"""V0006 3D: effects only (the bed is Power's track, bed_track.py). OFFSET = hook length. Every hit on a beat of the track."""
import json, sys, os, numpy as np, scipy.signal as ss, soundfile as sf
ev = json.load(open(sys.argv[1])); E = ev["events"]; OFF = float(os.environ.get("OFFSET", 0.75)); DUR = ev["total"] + OFF + 0.2
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
def blip(f): d = 0.07; return np.sign(sine(f, d)) * env(d, 0.0005, 60) * 0.35
V = lambda c: c + OFF
S = buf()
add(S, riser(OFF), 0, g=0.18)
add(S, whoosh(0.5, up=True), V(0) - 0.1, g=0.22)                      # cut into the chart
add(S, slam(), V(E['top1']), g=0.5); add(S, whoosh(0.5, up=False), V(E['top1']) + 0.05, g=0.25)   # rejected on the line
add(S, whoosh(0.6, up=False), V(E['fold']) + 0.15, pan=0.2, g=0.3)    # the panel folds
add(S, riser(E['barEnd'] - E['bar']), V(E['bar']), g=0.18)            # the line draws the layer bar
add(S, slam(), V(E['term']), g=0.35)                                   # terminal on
for j in range(5): add(S, thump(140, 50, 0.4), V(E['aW']) + 0.57 + j * 0.755 / 8, pan=0.15 * (-1) ** j, g=0.28)   # walls slam in
add(S, tick(1800, 0.06), V(E['aW']) + 0.57, g=0.15)
add(S, riser(E['hit'] - E['push']), V(E['push']), g=0.3)
add(S, slam(big=True), V(E['hit']), g=0.75); add(S, chime(659.25, 1.2), V(E['hit']) + 0.02, g=0.05)   # BLOCKED
add(S, tick(1700, 0.08), V(E['aB']) + 0.57, g=0.2); add(S, chime(987.77, 1.0), V(E['aB']) + 0.57, pan=0.2, g=0.05)
add(S, tick(1300, 0.08), V(E['tip']), g=0.12)
add(S, whoosh(0.5), V(E['rise']) - 0.25, g=0.3)
add(S, riser(E['hit2'] - E['rise']), V(E['rise']), g=0.25); add(S, slam(big=True), V(E['hit2']), g=0.6)
la = V(E['end']) + 1.0; add(S, sine(55, 1.8) * np.clip(tt(1.8) / 0.25, 0, 1) * np.exp(-tt(1.8) * 2.2), la - 0.05, g=.30)
for j, (f, pn) in enumerate([(659.25, -.25), (987.77, .0), (1318.5, .25)]): add(S, chime(f), la + j * 0.11, pan=pn, g=.09)
st_ = np.stack(S, 1); st_ = st_ / (np.max(np.abs(st_)) + 1e-9) * 0.85; sf.write(sys.argv[2], st_.astype(np.float32), SR, subtype='FLOAT'); print('ok', round(DUR, 2))
