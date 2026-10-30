#!/usr/bin/env python3
"""VOLWICK · Live Market Reactions · sound design from the scene's event map.
usage: python3 lmr_sound.py events.json out.wav
Same synthesized palette as the educational engine (no samples, no licences): low pad bed,
discreet contact sounds on real events only, the Volwick sonic logo (sub + E5 B5 E6) on the logo flash."""
import json, sys, numpy as np, scipy.signal as ss, soundfile as sf
E = json.load(open(sys.argv[1])); DUR = E['total'] + 0.3
SR = 48000; n = int(SR * DUR); t = np.arange(n) / SR; rng = np.random.default_rng(11)
L = np.zeros(n); R = np.zeros(n)
def lp(x, f, o=4): return ss.sosfilt(ss.butter(o, f, 'low', fs=SR, output='sos'), x)
def bp(x, lo, hi, o=2): return ss.sosfilt(ss.butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def env(a, b, c, d): return np.clip((t - a) / max(b - a, 1e-3), 0, 1) * (t < c) + np.clip(1 - (t - c) / max(d - c, 1e-3), 0, 1) * (t >= c)
def add(sig, at, pan=0.0, g=1.0):
    i = int(max(0, at) * SR); m = min(len(sig), n - i)
    if m <= 0: return
    L[i:i + m] += sig[:m] * g * np.sqrt((1 - pan) / 2); R[i:i + m] += sig[:m] * g * np.sqrt((1 + pan) / 2)
def tick(f=2400, d=0.03): tt = np.arange(int(SR * d)) / SR; return np.sin(2 * np.pi * f * tt) * np.exp(-tt * 160)
def whoosh(d=1.0):
    m = int(SR * d); x = rng.standard_normal(m); tt = np.arange(m) / SR; out = np.zeros(m)
    for j, (lo, hi) in enumerate(np.linspace([300, 900], [2500, 6000], 8)): a = j * m // 8; b = (j + 1) * m // 8; out[a:b] = bp(x, lo, hi)[a:b]
    return out * np.sin(np.pi * tt / d) ** 2
def boom(f0=50, d=1.8):
    tt = np.arange(int(SR * d)) / SR; f = f0 * (1 + 1.4 * np.exp(-tt * 14))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 2.6) + lp(rng.standard_normal(len(tt)), 180) * np.exp(-tt * 9) * 0.5
def ping(f=1600, d=0.5): tt = np.arange(int(SR * d)) / SR; return (np.sin(2 * np.pi * f * tt) + .4 * np.sin(2 * np.pi * f * 2.76 * tt)) * np.exp(-tt * 11)
def chime(f, d=1.6): tt = np.arange(int(SR * d)) / SR; return (np.sin(2 * np.pi * f * tt) + .25 * np.sin(2 * np.pi * f * 2.01 * tt)) * np.exp(-tt * 3.2) * np.clip(tt / 0.004, 0, 1)
def sonic_logo(at):
    tt = np.arange(int(SR * 1.8)) / SR; sub = np.sin(2 * np.pi * 55 * tt) * np.clip(tt / 0.25, 0, 1) * np.exp(-tt * 2.2); add(sub, at - 0.05, g=.35)
    for j, (f, pn) in enumerate([(659.25, -.25), (987.77, .0), (1318.5, .25)]): add(chime(f), at + j * 0.11, pan=pn, g=.11)
# bed: low pad, a little lift while price approaches the level, stays under the ending until the loop
pad = np.zeros(n)
for f, a in [(55, 1), (82.41, .55), (110, .5), (130.81, .22), (164.81, .28), (220, .12)]:
    for det in (-0.12, 0.12): pad += a * np.sin(2 * np.pi * (f + det) * t + rng.random() * 6)
pad = lp(pad / 6 + lp(rng.standard_normal(n), 420) * 0.6, 900) * (0.55 + 0.45 * np.sin(2 * np.pi * 0.07 * t))
pad *= env(0, 0.05, E['loop0'], DUR) * (0.65 + 0.35 * env(E['reveal0'], E['touch'], E['concl'], E['concl'] + 1.0)) * 0.16
add(pad, 0, -.1); add(np.roll(pad, int(.013 * SR)), 0, .1)
add(boom(48, 1.6), 0.0, g=.6); add(ping(1400, .6), 0.0, g=.08)                       # first frame
for k, tk in enumerate(E.get('candle_ticks', [])): add(tick(2300 + (k % 5) * 90), tk, pan=((k % 7) - 3) / 8, g=.035)   # each minute revealed
add(whoosh(0.6)[::-1], E.get('hookOut', E['reveal0'] - 0.5) - 0.05, -.2, g=.16)      # rewind
# riser: filtered noise that opens up while price travels to the wall (tension), cut on the touch
rl = max(0.5, E['touch'] - E['reveal0']); m = int(SR * rl); tt = np.arange(m) / SR
nz = rng.standard_normal(m); rs = np.zeros(m)
for j in range(10): a_ = j * m // 10; b_ = (j + 1) * m // 10; rs[a_:b_] = bp(nz, 200 + 250 * j, 900 + 700 * j)[a_:b_]
add(rs * (tt / rl) ** 2.2 * 0.6, E['reveal0'], g=.12)
add(boom(74, 0.9), E['touch'], g=.24); add(chime(783.99), E['touch'] + 0.02, pan=-.2, g=.05)   # price reaches the wall
add(whoosh(0.9), E['concl'] - 0.45, .3, g=.10); add(boom(52, 1.4), E['concl'], g=.30)     # payoff number
add(whoosh(1.0), E['logo0'] - 0.2, -.3, g=.12)
sonic_logo(E['logo0'] + 1.5)                                                         # logo flash
if 'dv' in E: add(ping(1568, 1.0), E['dv'], g=.06); add(ping(2093, 1.0), E['dv'] + 0.03, g=.04)
out = np.stack([L, R], 1); out /= max(1e-9, np.abs(out).max()) / 0.6
sf.write(sys.argv[2], out, SR, subtype='PCM_24'); print('ok', round(DUR, 2))
