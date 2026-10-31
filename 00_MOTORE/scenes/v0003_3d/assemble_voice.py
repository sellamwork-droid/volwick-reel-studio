"""V0003: places the two HeyGen clips (body.wav, brand.wav) on the scene timeline from cues.json and writes vo.wav (48 kHz, 24 bit)
and adds the sound-design aliases to the events file. usage: python3 assemble_voice.py <dir with body.wav brand.wav ev.json>"""
import sys, json, os, subprocess, numpy as np, soundfile as sf
d = sys.argv[1]; here = os.path.dirname(os.path.abspath(__file__)); SR = 48000
cues = json.load(open(os.path.join(here, 'cues.json')))['cues']
def load(p):
    x = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', p, '-af', 'aresample=48000:resampler=soxr:precision=28', '-ac', '1', '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(x, dtype=np.float32).astype(np.float64)
def fade(x, fi=0.015, fo=0.06):
    a, b = int(fi * SR), int(fo * SR); x = x.copy(); x[:a] *= 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, a)); x[-b:] *= 0.5 + 0.5 * np.cos(np.linspace(0, np.pi, b)); return x
body, brand = fade(load(os.path.join(d, 'body.wav'))), fade(load(os.path.join(d, 'brand.wav')))
total = cues['total'] + 0.3; v = np.zeros(int(total * SR) + SR)
for x, at in ((body, 0.25), (brand, cues['brand_at'])):
    i = int(round(at * SR)); v[i:i + len(x)] += x[:len(v) - i]
v = v[:int(total * SR)]; peak = np.abs(v).max()
if peak > 0.97: v *= 0.97 / peak
sf.write(os.path.join(d, 'vo.wav'), v, SR, subtype='PCM_24')
# events for tools/vw_sound.py (same keys as the Absorption V2 scene)
evp = os.path.join(d, 'ev.json'); ev = json.load(open(evp)); E = ev['events']
E.update(hookBuyers=0.25, div=E['wall'], beat=round(cues['logo0'] + 1.75 / 1.7, 3), b0=E['sold'], b1=E['boughtE'], flow=E['sell'], cvdWord=E['less'],
         volwick=E['pin'], holdHit=E['pin'] + 0.05, count0=E['open'], count1=E['againE'])
json.dump(ev, open(evp, 'w')); print('vo.wav', round(len(v) / SR, 2), 's, peak', round(float(peak), 3))
