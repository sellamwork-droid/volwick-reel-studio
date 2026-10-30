"""VX voice assembler (30 Oct 2026). One TTS take per ad, cut at sentence boundaries (never through a word),
raised-cosine fades, sentences placed with designed gaps; the brand pair lands on the logo like the Reels.
usage: python3 vx_assemble.py <name>   -> out_<name>/vo.wav, words.json, cues.json  (cues: s0..sN, logo0, sw, dvv, loop0)"""
import sys, json, subprocess, os, numpy as np, soundfile as sf
SR = 48000; LSP = 1.7; DVGAP = 0.32; HOLD = 1.1
PLAN = {  # gap before each body sentence; logo after the last body sentence
 'depth': dict(gaps=[0.30, 0.45, 0.70, 0.55], logo_after=1.35),
 'xray':  dict(gaps=[0.30, 1.10, 0.60, 0.30, 0.30, 0.70, 0.30], logo_after=0.95),
 'tape':  dict(gaps=[0.55, 0.30, 0.25, 0.70, 0.35, 0.70], logo_after=1.45),
 'tool':  dict(gaps=[0.30, 0.55, 0.55, 0.40, 0.65, 0.35, 0.35, 0.60], logo_after=0.95),
 'trend': dict(gaps=[0.30, 0.70, 0.45, 0.95, 1.00, 0.35, 0.35, 0.50, 0.60, 0.30], logo_after=1.00),
 'rule':  dict(gaps=[0.35, 0.60], logo_after=1.20),
 'book':  dict(gaps=[0.40, 0.40, 1.00, 0.30, 0.40, 0.55, 0.40], logo_after=1.10),
}
name = sys.argv[1]; out = f'out_{name}'; os.makedirs(out, exist_ok=True); P = PLAN[name]
W = json.load(open('words_src.json'))[name]
x = np.frombuffer(subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', f'{name}.mp3', '-af', 'aresample=48000:resampler=soxr:precision=28',
                                   '-ac', '1', '-f', 'f32le', '-'], capture_output=True).stdout, dtype=np.float32).astype(np.float64)
S, cur = [], []
for w in W:
    cur.append(w)
    if w[0].rstrip('"\'')[-1:] in '.?!': S.append(cur); cur = []
body, brand, guard = S[:-3], S[-3:-1], S[-1]
assert len(body) == len(P['gaps']), (len(body), len(P['gaps']))
def rms_db(i, n): s = x[max(0, i):i + n]; return 20 * np.log10(np.sqrt((s ** 2).mean()) + 1e-12)
def cut(s, nxt):
    a = max(0.0, s[0][1] - 0.10); b = s[-1][2] + 0.10; lim = nxt - 0.04
    i = int(b * SR); n = int(0.01 * SR)
    while i < int(lim * SR) and rms_db(i, n) > -48: i += n
    b = min(lim, i / SR + 0.06); seg = x[int(a * SR):int(b * SR)].copy()
    fi, fo = int(0.015 * SR), int(0.035 * SR)
    seg[:fi] *= 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, fi)); seg[-fo:] *= 0.5 + 0.5 * np.cos(np.linspace(0, np.pi, fo))
    return seg, a
allS = body + brand + [guard]
v = np.zeros(SR * 40); words = []; cues = {}; t = 0.0
for k, (s, gap) in enumerate(zip(body, P['gaps'])):
    seg, a = cut(s, allS[k + 1][0][1]); t += gap; i0 = int(t * SR); v[i0:i0 + len(seg)] += seg
    words += [[w[0], round(t + w[1] - a, 3), round(t + w[2] - a, 3)] for w in s]
    cues[f's{k}'] = [round(t + s[0][1] - a, 3), round(t + s[-1][2] - a, 3)]; t += len(seg) / SR
logo0 = cues[f's{len(body) - 1}'][1] + P['logo_after']; wm = logo0 + 1.75 / LSP
(sa, aa), (sb, ab) = cut(brand[0], brand[1][0][1]), cut(brand[1], guard[0][1])
ta = wm - (brand[0][0][1] - aa); v[int(ta * SR):int(ta * SR) + len(sa)] += sa
tb = ta + (brand[0][-1][2] - aa) + DVGAP - (brand[1][0][1] - ab); v[int(tb * SR):int(tb * SR) + len(sb)] += sb
cues['sw'] = [round(ta + brand[0][0][1] - aa, 3), round(ta + brand[0][-1][2] - aa, 3)]
cues['dvv'] = [round(tb + brand[1][0][1] - ab, 3), round(tb + brand[1][-1][2] - ab, 3)]
cues['logo0'] = round(logo0, 3); cues['loop0'] = round(cues['dvv'][1] + HOLD, 3); total = cues['loop0'] + 0.5
v = v[:int((total + 0.3) * SR)]; pk = np.abs(v).max()
if pk > 0.97: v *= 0.97 / pk
sf.write(f'{out}/vo.wav', v, SR, subtype='PCM_24')
json.dump(words, open(f'{out}/words.json', 'w')); json.dump({'cues': cues, 'total': round(total, 3)}, open(f'{out}/cues.json', 'w'), indent=1)
print(name, json.dumps(cues), 'total', round(total, 2))
