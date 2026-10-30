#!/usr/bin/env python3
"""VOLWICK · Live Market Reactions · minimal sound (Power, 25 Oct night): music goes on top later,
so effects are barely there. No pad, no ticks, no risers. A soft low thump on the hook, a soft knock on the
touch and on the replayed touch, the Volwick sonic logo on the logo flash. Fixed level, peaks around -24 dBFS.
usage: python3 lmr_sound_min.py events.json out.wav"""
import json, sys, numpy as np, soundfile as sf
E = json.load(open(sys.argv[1])); DUR = E['total'] + 0.3; SR = 48000; n = int(SR * DUR)
L = np.zeros(n); R = np.zeros(n)
def add(sig, at, pan=0.0, g=1.0):
    i = int(max(0, at) * SR); m = min(len(sig), n - i)
    if m > 0: L[i:i + m] += sig[:m] * g * np.sqrt((1 - pan) / 2); R[i:i + m] += sig[:m] * g * np.sqrt((1 + pan) / 2)
def thump(f0=58, d=0.9):
    tt = np.arange(int(SR * d)) / SR; f = f0 * (1 + 0.8 * np.exp(-tt * 18)); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 5) * np.clip(tt / 0.006, 0, 1)
def knock(f=180, d=0.35):
    tt = np.arange(int(SR * d)) / SR; return np.sin(2 * np.pi * f * tt) * np.exp(-tt * 22) * np.clip(tt / 0.003, 0, 1)
def chime(f, d=1.6):
    tt = np.arange(int(SR * d)) / SR; return (np.sin(2 * np.pi * f * tt) + .25 * np.sin(2 * np.pi * f * 2.01 * tt)) * np.exp(-tt * 3.2) * np.clip(tt / 0.004, 0, 1)
add(thump(), 0.0, g=0.5)
add(knock(), E['touch'], g=0.35)
if 'replay_touch' in E: add(knock(), E['replay_touch'], g=0.3)
at = E['logo0'] + 1.5
tt = np.arange(int(SR * 1.8)) / SR; add(np.sin(2 * np.pi * 55 * tt) * np.clip(tt / 0.25, 0, 1) * np.exp(-tt * 2.2), at - 0.05, g=0.35)
for j, (f, pn) in enumerate([(659.25, -.25), (987.77, .0), (1318.5, .25)]): add(chime(f), at + j * 0.11, pan=pn, g=0.12)
out = np.stack([L, R], 1); out *= 10 ** (-24 / 20) / max(1e-9, np.abs(out).max())
sf.write(sys.argv[2], out, SR, subtype='PCM_24'); print('ok', round(DUR, 2))
