"""V0012 EDIT 3D n.2: sound effects on the cuts, in time with the song (beat 0.603 s, drop at 4.20 s).
usage: python3 sound.py ev.json sfx.wav     (ev.json from render: events.T). Original synthesized sounds only."""
import json, sys, numpy as np, scipy.signal as ss, soundfile as sf
T = json.load(open(sys.argv[1]))['events']['T']; SR = 48000; DUR = T['total'] + 0.2; n = int(SR * DUR); rng = np.random.default_rng(10)
def bp(x, lo, hi, o=2): return ss.sosfilt(ss.butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def lp(x, f, o=4): return ss.sosfilt(ss.butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return ss.sosfilt(ss.butter(o, f, 'high', fs=SR, output='sos'), x)
def tt(d): return np.arange(int(SR * d)) / SR
def env(d, a=0.002, r=6.0): x = tt(d); return np.clip(x / a, 0, 1) * np.exp(-x * r)
def sine(f, d): return np.sin(2 * np.pi * f * tt(d))
def noise(d): return rng.standard_normal(int(SR * d))
L = np.zeros((2, n))
def add(sig, at, g=1.0, pan=0.0):
    i = int(round(max(0, at) * SR)); m = min(len(sig), n - i)
    if m > 0: L[0, i:i + m] += sig[:m] * g * np.sqrt((1 - pan) / 2); L[1, i:i + m] += sig[:m] * g * np.sqrt((1 + pan) / 2)
def whoosh(d=0.5, up=True):
    x = tt(d); nz = noise(d); out = np.zeros(len(x))
    for k in range(8):
        s = slice(k * len(x) // 8, (k + 1) * len(x) // 8); fc = 500 + 5000 * (k / 7 if up else 1 - k / 7); out[s] = bp(nz, fc * 0.6, min(20000, fc * 1.6))[s]
    return lp(out, 10000) * np.sin(np.pi * np.clip(x / d, 0, 1)) ** 1.4
def boom(f0=110, f1=36, d=1.1): x = tt(d); f = f1 + (f0 - f1) * np.exp(-x * 14); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 3.5)
def impact(big=1.0): d = 1.2; return np.tanh((boom(d=d) * 1.2 + bp(noise(d), 300, 3000) * env(d, 0.001, 26) * 0.7 + hp(noise(d), 5000) * env(d, 0.0005, 40) * 0.35) * 1.3) * 0.8 * big
def shimmer(f=1318.5, d=1.6): x = tt(d); s = sum(np.sin(2 * np.pi * f * m * x) * a for m, a in [(1, 1), (1.5, 0.5), (2, 0.35), (3, 0.15)]); return s * np.exp(-x * 2.6) * np.clip(x / 0.01, 0, 1) * 0.25
def riser(d): x = tt(d); return (bp(noise(d), 1200, 9000) * (x / d) ** 2 * 0.5 + np.sin(2 * np.pi * np.cumsum(220 * (8 ** (x / d))) / SR) * (x / d) ** 3 * 0.18) * np.clip((d - x) / 0.02, 0, 1)
def tick(f=2600, d=0.04): return sine(f, d) * env(d, 0.0005, 110) * 0.6 + bp(noise(d), 3000, 9000) * env(d, 0.0003, 300) * 0.3
def flip(): d = 0.12; x = bp(noise(d), 1500, 7000) * env(d, 0.001, 40) * 0.7; c = tick(1800, 0.05) * 0.6; x[:len(c)] += c; return x
def pop(f=880): d = 0.25; return (sine(f, d) + 0.4 * sine(f * 2, d)) * env(d, 0.001, 18) * 0.5
def clink(f=2400): d = 0.5; x = tt(d); s = sum(np.sin(2 * np.pi * f * m * x) * a for m, a in [(1, 1), (2.76, 0.5), (5.4, 0.25)]); return s * np.exp(-x * 9) * np.clip(x / 0.002, 0, 1) * 0.35
# stack: each word card lands on its beat
for k, w in enumerate(T['words']): add(whoosh(0.25, True), w - 0.12, 0.25, -0.4 + 0.25 * k); add(pop(740 + 120 * k), w + 0.05, 0.35)
add(whoosh(0.5, False), T['fold'], 0.35); add(shimmer(1318.5, 1.4), T['brk'] + 0.3, 0.35); add(riser(T['drop'] - T['brk'] - 0.1) * 0.6, T['brk'], 0.25)
add(impact(1.0), T['drop'], 0.55)
# one flick per cut under the layer row
for c in T['cuts'][1:]: add(whoosh(0.22, True), c - 0.1, 0.22); add(tick(2600, 0.04), c, 0.35)
# market: deep hit on the break of the short γ put wall, gold hit on the Block Prints, whoosh up on the turn
add(boom(80, 28, 1.6) * 0.9, T['down'], 0.6); add(whoosh(0.6, False), T['down'], 0.3)
add(impact(0.9), T['gold'], 0.5); add(shimmer(1567.98, 1.5), T['gold'], 0.45); add(whoosh(0.5, True), T['flip'] - 0.2, 0.35)
# pile: clinks on each count step
add(whoosh(0.4, True), T['c4'] - 0.2, 0.3)
for j, s in enumerate(T['steps']): [add(clink(2200 + 180 * j + 90 * q), s + q * 0.03, 0.22, (q - 1) * 0.4) for q in range(3)]; add(pop(880 + 110 * j), s, 0.25)
add(impact(0.7), T['steps'][-1], 0.4)
# ending
add(whoosh(0.6, False)[::-1], T['end'] - 0.1, 0.35); add(shimmer(1318.5, 2.2), T['end'] + 1.0, 0.55); add(pop(1760), T['end'] + 3.45 / 1.7, 0.25)
L = np.tanh(L * 1.1); sf.write(sys.argv[2], L.T.astype(np.float32), SR); print('sfx', sys.argv[2], round(DUR, 2), 's')
