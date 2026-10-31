#!/usr/bin/env python3
"""VOLWICK · Live Market Reactions · sound for the block-print videos (Power, 29 Oct 2026). Effects only, no voice, no music.
Cues synced to the terminal: a light glass tone on the first frame; a short 'print' cue every time a block print enters
(tap + chime, brighter for gold pills); a low two-note 'lock' when a key level forms or updates; a discreet crescendo into
the single pause and a deep impact on it; the Volwick sonic logo. Synthesized, no samples. Peaks at -12 dBFS (Power, 29 Oct: effects a bit lower).
usage: python3 lmr_sound_blocks_h.py events_timeline.json out.wav"""
import json, sys, numpy as np, scipy.signal as ss, soundfile as sf
E = json.load(open(sys.argv[1])); DUR = E['total'] + 0.2; SR = 48000; n = int(SR * DUR); rng = np.random.default_rng(29)
L = np.zeros(n); R = np.zeros(n)
def lp(x, f, o=4): return ss.sosfilt(ss.butter(o, f, 'low', fs=SR, output='sos'), x)
def bp(x, lo, hi, o=2): return ss.sosfilt(ss.butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def add(sig, at, pan=0.0, g=1.0):
    i = int(max(0, at) * SR); m = min(len(sig), n - i)
    if m > 0: L[i:i + m] += sig[:m] * g * np.sqrt((1 - pan) / 2); R[i:i + m] += sig[:m] * g * np.sqrt((1 + pan) / 2)
def T(d): return np.arange(int(SR * d)) / SR
def chime(f, d=1.4, k=3.4):
    tt = T(d); return (np.sin(2 * np.pi * f * tt) + .22 * np.sin(2 * np.pi * f * 2.01 * tt)) * np.exp(-tt * k) * np.clip(tt / 0.004, 0, 1)
def tap(g=1.0):
    tt = T(0.25); return (np.sin(2 * np.pi * 90 * tt) * np.exp(-tt * 22) + bp(rng.standard_normal(len(tt)), 1800, 6000) * np.exp(-tt * 70) * 0.25) * g

# first frame: light glass tone
add(chime(1318.5, 1.2, 4.5), 0.04, pan=-.15, g=0.08); add(chime(1975.5, 1.0, 5.5), 0.07, pan=.15, g=0.04)
touch = E.get('touch', -10)
for m in E.get('marks', []):
    t = m['t']
    if abs(t - touch) < 0.4: continue
    if m['type'] == 'block':   # print: tap + chime (gold brighter)
        add(tap(), t, g=0.40); add(chime(1567.98 if m.get('big') else 1174.66, 0.9, 5.0), t + 0.01, pan=.2, g=0.11); add(chime(2349.3, 0.6, 7), t + 0.03, pan=-.2, g=0.04)
    elif m['type'] == 'wall':  # dealer wall named: soft glass tone + low tap
        tt = T(0.5); add(np.sin(2 * np.pi * 62 * tt) * np.exp(-tt * 9) * np.clip(tt / 0.01, 0, 1), t, g=0.22)
        add(chime(1318.5, 1.1, 4.5), t + 0.02, pan=-.15, g=0.06); add(chime(1975.5, 0.9, 5.5), t + 0.05, pan=.15, g=0.03)
    else:                      # level: low two-note lock
        tt = T(1.2); a = np.clip(tt / 0.03, 0, 1) * np.exp(-tt * 3.2)
        tone = sum(w * np.sin(2 * np.pi * fr * tt) for fr, w in [(110, 1), (164.81, .6), (220, .35)]) * a
        add(lp(tone, 1400), t, -.1, g=0.20); add(lp(tone, 1400), t + 0.012, .1, g=0.20); add(chime(880, 0.9, 4), t + 0.06, g=0.06)

# crescendo into the pause, cut 40 ms before it, then the impact
if touch > 0:
    d = 2.2; tt = T(d); u = tt / d; nz = rng.standard_normal(len(tt)); rs = np.zeros(len(tt))
    for j in range(12): a_ = j * len(tt) // 12; b_ = (j + 1) * len(tt) // 12; rs[a_:b_] = bp(nz, 150 + 120 * j, 600 + 380 * j)[a_:b_]
    swell = np.sin(2 * np.pi * np.cumsum(55 + 25 * u) / SR) * 0.6; env = u ** 2.6 * np.clip((d - 0.04 - tt) / 0.03, 0, 1)
    cres = (lp(rs, 5000) * 0.55 + swell) * env
    add(cres, touch - d, -.1, g=0.13); add(np.roll(cres, int(0.011 * SR)), touch - d, .1, g=0.13)
    tt = T(1.8); f = 44 * (1 + 1.2 * np.exp(-tt * 16)); boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 2.4) * np.clip(tt / 0.003, 0, 1)
    body = lp(rng.standard_normal(len(tt)), 220) * np.exp(-tt * 11) * 0.6; air = bp(rng.standard_normal(len(tt)), 2500, 7000) * np.exp(-tt * 30) * 0.08
    add(boom + body + air, touch, g=0.85)

# sonic logo
at = E['logo_flash']; tt = T(1.8); add(np.sin(2 * np.pi * 55 * tt) * np.clip(tt / 0.2, 0, 1) * np.exp(-tt * 2.2), at - 0.05, g=0.45)
for j, (fr, pn) in enumerate([(659.25, -.25), (987.77, .0), (1318.5, .25)]): add(chime(fr, 1.6, 3.2), at + j * 0.11, pan=pn, g=0.14)

out = np.stack([L, R], 1); out[-int(0.05 * SR):] *= np.linspace(1, 0, int(0.05 * SR))[:, None]
out *= 10 ** (-12 / 20) / max(1e-9, np.abs(out).max())
sf.write(sys.argv[2], out, SR, subtype='PCM_24'); print('ok', round(DUR, 2))
