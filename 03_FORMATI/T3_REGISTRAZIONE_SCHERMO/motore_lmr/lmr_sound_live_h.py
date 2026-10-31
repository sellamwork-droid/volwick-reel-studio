#!/usr/bin/env python3
"""VOLWICK · Live Market Reactions · LIVE horizontal sound (from v13): a soft tick on every pause (Power, 25 Oct 2026). Effects only: no voice, no music,
no continuous bed. Five cues synced to the chart, synthesized (no samples, no licences):
  1. the wall on the first frame: a light glass tone
  2. a discreet crescendo in the last seconds of the approach, cut just before the touch
  3. the touch: a low, deep impact
  4. the reaction becomes evident (band + text): a soft low chord
  5. the Volwick sonic logo on the logo flash (sub + E5 B5 E6)
Peaks normalised to -8 dBFS so music can go on top later without clipping.
usage: python3 lmr_sound_v13.py events_timeline.json out.wav"""
import json, sys, numpy as np, scipy.signal as ss, soundfile as sf
E = json.load(open(sys.argv[1])); DUR = E['total'] + 0.2; SR = 48000; n = int(SR * DUR); rng = np.random.default_rng(13)
L = np.zeros(n); R = np.zeros(n)
def lp(x, f, o=4): return ss.sosfilt(ss.butter(o, f, 'low', fs=SR, output='sos'), x)
def bp(x, lo, hi, o=2): return ss.sosfilt(ss.butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def add(sig, at, pan=0.0, g=1.0):
    i = int(max(0, at) * SR); m = min(len(sig), n - i)
    if m > 0: L[i:i + m] += sig[:m] * g * np.sqrt((1 - pan) / 2); R[i:i + m] += sig[:m] * g * np.sqrt((1 + pan) / 2)
def T(d): return np.arange(int(SR * d)) / SR
def chime(f, d=1.4, k=3.4):
    tt = T(d); return (np.sin(2 * np.pi * f * tt) + .22 * np.sin(2 * np.pi * f * 2.01 * tt)) * np.exp(-tt * k) * np.clip(tt / 0.004, 0, 1)

# 1. wall: light glass tone + a very soft low tap
tt = T(0.5); add(np.sin(2 * np.pi * 62 * tt) * np.exp(-tt * 9) * np.clip(tt / 0.01, 0, 1), 0.02, g=0.35)
add(chime(1318.5, 1.2, 4.5), 0.04, pan=-.15, g=0.10); add(chime(1975.5, 1.0, 5.5), 0.07, pan=.15, g=0.05)

# 2. crescendo: band-passed noise that opens up + a low swell, last 3 s before the touch, cut 40 ms before it
d = 3.0; tt = T(d); u = tt / d; nz = rng.standard_normal(len(tt)); rs = np.zeros(len(tt))
for j in range(12): a_ = j * len(tt) // 12; b_ = (j + 1) * len(tt) // 12; rs[a_:b_] = bp(nz, 150 + 120 * j, 600 + 380 * j)[a_:b_]
swell = np.sin(2 * np.pi * np.cumsum(55 + 25 * u) / SR) * 0.6
env = u ** 2.6 * np.clip((d - 0.04 - tt) / 0.03, 0, 1)
cres = (lp(rs, 5000) * 0.55 + swell) * env
add(cres, E['touch'] - d, -.1, g=0.16); add(np.roll(cres, int(0.011 * SR)), E['touch'] - d, .1, g=0.16)

# 3. touch: deep impact (pitch-dropping sub + short low noise body + faint air)
tt = T(1.8); f = 44 * (1 + 1.2 * np.exp(-tt * 16)); boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 2.4) * np.clip(tt / 0.003, 0, 1)
body = lp(rng.standard_normal(len(tt)), 220) * np.exp(-tt * 11) * 0.6; air = bp(rng.standard_normal(len(tt)), 2500, 7000) * np.exp(-tt * 30) * 0.08
add(boom + body + air, E['touch'], g=1.0)

# 3b. a soft tick when the video pauses to explain (not on the gap pause, which has the impact)
for tp in E['pauses']:
    if abs(tp - E['touch']) < 0.05: continue
    tt = T(0.5); add(np.sin(2 * np.pi * 880 * tt) * np.exp(-tt * 14) * np.clip(tt / 0.003, 0, 1), tp, pan=-.1, g=0.10); add(np.sin(2 * np.pi * 70 * tt) * np.exp(-tt * 12), tp, g=0.25)

# 4. reaction evident: soft low chord, slow attack, short
tt = T(1.8); a = np.clip(tt / 0.09, 0, 1) * np.exp(-tt * 2.2)
chord = sum(w * np.sin(2 * np.pi * fr * tt) for fr, w in [(110, 1), (164.81, .7), (220, .45), (329.63, .18)]) * a
add(lp(chord, 1200), E['reaction'] - 0.05, -.12, g=0.16); add(lp(chord, 1200), E['reaction'] - 0.04, .12, g=0.16)

# 5. sonic logo
at = E['logo_flash']; tt = T(1.8); add(np.sin(2 * np.pi * 55 * tt) * np.clip(tt / 0.2, 0, 1) * np.exp(-tt * 2.2), at - 0.05, g=0.45)
for j, (fr, pn) in enumerate([(659.25, -.25), (987.77, .0), (1318.5, .25)]): add(chime(fr, 1.6, 3.2), at + j * 0.11, pan=pn, g=0.14)

out = np.stack([L, R], 1); out[-int(0.05 * SR):] *= np.linspace(1, 0, int(0.05 * SR))[:, None]
out *= 10 ** (-8 / 20) / max(1e-9, np.abs(out).max())
sf.write(sys.argv[2], out, SR, subtype='PCM_24'); print('ok', round(DUR, 2))
