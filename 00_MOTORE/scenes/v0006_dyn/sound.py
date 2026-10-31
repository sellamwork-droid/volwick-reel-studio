"""V0006 v3 sound: one 125 BPM bed from frame 1 to the end, cut points on the beat (rip on the drop, rewind tape-stop, build into the call-wall impact), SFX for MUSIC READY. OFFSET = hook length (0.96 = 2 beats)."""
import json, sys, numpy as np, scipy.signal as ss, soundfile as sf
import os
ev = json.load(open(sys.argv[1])); E = ev["events"]; OFF = float(os.environ.get("OFFSET", 0.96)); DUR = ev["total"] + OFF + 0.2
SR = 48000; n = int(SR * DUR); rng = np.random.default_rng(55)
BEAT = 60 / 125; bt = lambda k: k * BEAT
def bp(x, lo, hi, o=2): return ss.sosfilt(ss.butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def lp(x, f, o=4): return ss.sosfilt(ss.butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return ss.sosfilt(ss.butter(o, f, 'high', fs=SR, output='sos'), x)
def buf(): return np.zeros(n), np.zeros(n)
def add(Bf, sig, at, pan=0.0, g=1.0):
    i = int(round(max(0, at) * SR)); m = min(len(sig), n - i)
    if m > 0: Bf[0][i:i + m] += sig[:m] * g * np.sqrt((1 - pan) / 2); Bf[1][i:i + m] += sig[:m] * g * np.sqrt((1 + pan) / 2)
def tt(d): return np.arange(int(SR * d)) / SR
def env(d, a=0.002, r=6.0): x = tt(d); return np.clip(x / a, 0, 1) * np.exp(-x * r)
def sine(f, d): return np.sin(2 * np.pi * f * tt(d))
def sweep(f0, f1, d): x = tt(d); f = f0 * (f1 / f0) ** (x / d); return np.sin(2 * np.pi * np.cumsum(f) / SR)
def noise(d): return rng.standard_normal(int(SR * d))
# ---------- SFX library ----------
def tick(f=2400, d=0.05): return sine(f, d) * env(d, 0.0005, 90) + bp(noise(d), 3000, 9000) * env(d, 0.0003, 260) * 0.4
def thump(f0=120, f1=38, d=0.7): x = tt(d); f = f1 + (f0 - f1) * np.exp(-x * 18); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 4.5)
def slam(big=False):
    d = 1.2 if big else 0.8; s = thump(150, 34, d) * (1.3 if big else 1.0)
    s += bp(noise(d), 200, 2500) * env(d, 0.001, 22) * 0.9 + hp(noise(d), 4000) * env(d, 0.0005, 45) * 0.5
    m = sine(370, d) * 0.4 + sine(553, d) * 0.25 + sine(910, d) * 0.15; s += m * env(d, 0.001, 9 if big else 12) * 0.5   # metallic body
    return np.tanh(s * 1.4) * 0.8
def whoosh(d=0.45, up=True):
    x = tt(d); nz = noise(d); out = np.zeros(len(x))
    for k in range(6):
        seg = slice(k * len(x) // 6, (k + 1) * len(x) // 6); fc = (600 + 4200 * (k / 5 if up else 1 - k / 5)); out[seg] = bp(nz, fc * 0.6, min(20000, fc * 1.6))[seg]
    shape = np.sin(np.pi * np.clip(x / d, 0, 1)) ** (1.5 if up else 0.8); return lp(out, 9000) * shape
def riser(d): x = tt(d); return (bp(noise(d), 1500, 9000) * (x / d) ** 2 * 0.7 + sweep(200, 1600, d) * (x / d) ** 3 * 0.25) * np.clip((d - x) / 0.01, 0, 1)
def buzz(d): x = tt(d); s = np.sign(np.sin(2 * np.pi * 100 * x)) * 0.3 + bp(noise(d), 2000, 8000) * 0.5; return lp(s, 6000) * env(d, 0.001, 22)
def chime(f, d=1.6): x = tt(d); return (np.sin(2 * np.pi * f * x) + .25 * np.sin(2 * np.pi * f * 2.01 * x)) * np.exp(-x * 3.2) * np.clip(x / 0.004, 0, 1)
V = lambda c: c + OFF          # chart time -> video time
# ---------- one bed, 125 BPM, A minor, from frame 1 to the end (rule 03:29: never a song cut into another) ----------
ROOT = [55.0, 43.65, 65.41, 49.0]; CH = [[220, 261.63, 329.63], [174.61, 220, 261.63], [196, 261.63, 329.63], [196, 246.94, 293.66]]
def kick(): x = tt(0.35); f = 45 * (1 + 2.6 * np.exp(-x * 30)); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 7) * 1.1
def clap(): d = 0.25; return bp(noise(d), 900, 5000) * (env(d, 0.001, 30) + 0.5 * np.roll(env(d, 0.001, 60), 400) + 0.4 * np.roll(env(d, 0.001, 60), 800)) * 0.7
def hat(o=False): d = 0.18 if o else 0.05; return hp(noise(d), 8000) * env(d, 0.0005, 18 if o else 80)
def saw(f, d): x = tt(d); return 2 * ((f * x) % 1) - 1
def bass(f, d): s = saw(f, d) * 0.5 + saw(f * 1.005, d) * 0.5; return lp(s, 420) * np.clip(tt(d) / 0.004, 0, 1) * np.clip((d - tt(d)) / 0.02, 0, 1)
def pluck(f): d = 0.3; return lp(saw(f, d), 3200) * env(d, 0.001, 11)
def pad(fs, d): out = sum(lp(saw(f, d) + saw(f * 1.004, d), 1400) for f in fs) / (2 * len(fs)); x = tt(d); return out * np.clip(x / 0.3, 0, 1) * np.clip((d - x) / 0.3, 0, 1)
B = buf(); side = np.ones(n); t_end = V(E['end']); nb = int(DUR / BEAT) + 1
drop1, rew0, rew1, impact = OFF, V(E['rew']), V(E['walls']), V(E['top2'])
G0 = OFF - 2 * BEAT   # beat grid anchored so the cut lands on a downbeat
def state(tb):   # which part of the track plays on this beat
    if tb < drop1 - 1e-3: return 'intro'
    if rew0 - 1e-3 <= tb < rew1 - 1e-3: return 'rewind'
    if rew1 - 1e-3 <= tb < impact - 1e-3: return 'build'
    if tb >= t_end - 1e-3: return 'outro'
    return 'drop'
for k in range(nb):
    tb = G0 + bt(k); s = state(tb + 1e-3); bar = k // 4; ci = bar % 4; q = k % 4; prev = state(tb - BEAT + 1e-3) if k else None
    if (q == 0 or s != prev) and s in ('intro', 'outro', 'rewind'): add(B, pad([f / 2 for f in CH[ci]] + CH[ci], bt(4) + 0.3), tb, g=0.26)
    if s in ('drop', 'build'):
        for e in range(2): add(B, pluck(CH[ci][[0, 2, 1, 2][(2 * q + e) % 4]] * 2), tb + bt(e * 0.5), pan=0.35 * (-1) ** e, g=0.11)
    if s == 'drop':
        add(B, kick(), tb, g=0.6); i0 = int(tb * SR); m = min(int(0.2 * SR), n - i0)
        if m > 0: side[i0:i0 + m] = np.minimum(side[i0:i0 + m], 0.3 + 0.7 * (np.arange(m) / m))
        if q in (1, 3): add(B, clap(), tb, g=0.26)
        for e, gg in ((0.25, 0.035), (0.5, 0.08), (0.75, 0.035)): add(B, hat(), tb + bt(e), pan=0.25 * (-1) ** int(e * 4), g=gg)
        for e in (0.5, 0.75): add(B, bass(ROOT[ci] * 2, bt(0.24)), tb + bt(e), g=0.34)
    if s == 'build':   # 16th hats and a clap roll that tighten into the impact
        u = (tb - rew1) / max(1e-3, impact - rew1)
        for e in range(4): add(B, hat(), tb + bt(e * 0.25), pan=0.3, g=0.04 + 0.05 * u)
        for e in range(2 if u < 0.5 else 4): add(B, clap() * 0.6, tb + bt(e * (0.5 if u < 0.5 else 0.25)), g=0.08 + 0.16 * u)
        add(B, kick(), tb, g=0.45)
    if s == 'intro': add(B, hat(), tb + bt(0.5), g=0.04)
    if s == 'outro' and s != prev: add(B, kick(), tb, g=0.5); add(B, bass(55.0 * 2, bt(3)), tb, g=0.28)
# rewind: the track tape-stops and comes back filtered
i0, i1 = int(rew0 * SR), int(rew1 * SR); seg_ = slice(i0, i1)
for c in range(2): B[c][seg_] = lp(B[c][seg_], 900) * 0.7
B = (B[0] * side, B[1] * side)
x = np.arange(n) / SR; fo = np.clip(x / 0.05, 0, 1) * np.clip((DUR - 0.3 - x) / 1.6, 0, 1); B = (B[0] * fo, B[1] * fo)
# ---------- SFX (the MUSIC READY file keeps only these) ----------
S = buf()
add(S, riser(drop1), 0, g=0.22); add(S, whoosh(0.5, up=True), drop1 - 0.45, g=0.25)
add(S, slam(), drop1, g=0.5)                                                   # the rip tops out on the cut beat
add(S, whoosh(0.5, up=False), V(E['top1']) + 0.05, g=0.28)                     # and falls
add(S, whoosh(V(E['drop']) - V(E['grab']) + 0.1), V(E['grab']), pan=0.3, g=0.3) # divider
add(S, sweep(1400, 90, rew1 - rew0) * np.linspace(1, 0.2, int(SR * (rew1 - rew0))) * 0.5, rew0, g=0.25)   # tape rewind
for j in range(5): add(S, thump(140, 50, 0.4), rew1 + j * BEAT / 4, pan=0.15 * (-1) ** j, g=0.32); add(S, tick(1800 + 150 * j, 0.06), rew1 + j * BEAT / 4, g=0.12)   # walls slam in
add(S, riser(impact - rew1), rew1, g=0.3)
add(S, slam(big=True), impact, g=0.75); add(S, chime(659.25, 1.2), impact + 0.02, g=0.05)   # the wall holds
add(S, whoosh(0.5, up=False), impact + 0.1, g=0.25)
for c in E['clicks']: add(S, tick(2600, 0.04), V(c), g=0.15)
add(S, tick(1700, 0.08), V(E['prints']), g=0.2); add(S, chime(987.77, 1.0), V(E['prints']), pan=0.2, g=0.05)
add(S, tick(1300, 0.08), V(E['tip']), g=0.12)
la = t_end + 1.5 / 1.7; add(S, sine(55, 1.8) * np.clip(tt(1.8) / 0.25, 0, 1) * np.exp(-tt(1.8) * 2.2), la - 0.05, g=.30)
for j, (f, pn) in enumerate([(659.25, -.25), (987.77, .0), (1318.5, .25)]): add(S, chime(f), la + j * 0.11, pan=pn, g=.09)
def wr(path, Bf, peak):
    st = np.stack(Bf, 1); st = st / (np.max(np.abs(st)) + 1e-9) * peak; sf.write(path, st.astype(np.float32), SR, subtype='FLOAT')
wr(sys.argv[2], S, 0.85); wr(sys.argv[3], B, 0.8); print('ok', round(DUR, 2))
