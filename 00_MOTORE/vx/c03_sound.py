"""CREATIVE 01 replay: sound. Original synthesized audio only.
usage: python3 replay_sound.py ev.json sfx.wav bed.wav
sfx: real mouse clicks on every interaction, soft UI ticks, sonic logo on the end card.
bed: a calm 92 BPM lo-fi bed (placeholder until Power's track arrives), fades into the end card."""
import json, sys, numpy as np, scipy.signal as ss, soundfile as sf
ev = json.load(open(sys.argv[1])); E = ev['events']
import os
OFF = float(os.environ.get('OFFSET', 0))   # hook clip in front: every event moves by its length
for k, v in list(E.items()):
    if isinstance(v, (int, float)): E[k] = v + OFF
    elif isinstance(v, list): E[k] = [x + OFF for x in v]
DUR = ev['total'] + OFF + 0.2
SR = 48000; n = int(SR * DUR); t = np.arange(n) / SR; rng = np.random.default_rng(5)
def bp(x, lo, hi, o=2): return ss.sosfilt(ss.butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def lp(x, f, o=4): return ss.sosfilt(ss.butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return ss.sosfilt(ss.butter(o, f, 'high', fs=SR, output='sos'), x)
def buf(): return np.zeros(n), np.zeros(n)
def add(B, sig, at, pan=0.0, g=1.0):
    i = int(max(0, at) * SR); m = min(len(sig), n - i)
    if m > 0: B[0][i:i + m] += sig[:m] * g * np.sqrt((1 - pan) / 2); B[1][i:i + m] += sig[:m] * g * np.sqrt((1 + pan) / 2)
def click(bright=1.0):  # mouse press + release
    m = int(SR * 0.012); tt = np.arange(m) / SR; x = bp(rng.standard_normal(m), 1800, 7000) * np.exp(-tt * 900)
    body = np.sin(2 * np.pi * 2900 * bright * tt) * np.exp(-tt * 1300) * 0.6; out = np.zeros(int(SR * 0.11)); out[:m] += x + body
    j = int(SR * 0.075); out[j:j + m] += (x * 0.55 + body * 0.4); return out
def chime(f, d=1.6): tt = np.arange(int(SR * d)) / SR; return (np.sin(2 * np.pi * f * tt) + .25 * np.sin(2 * np.pi * f * 2.01 * tt)) * np.exp(-tt * 3.2) * np.clip(tt / 0.004, 0, 1)
end = E['end']
# ---------- SFX ----------
S = buf()
for k, w in enumerate(E['words']):   # each word lands: a soft, short key tick
    tt = np.arange(int(SR * 0.06)) / SR; add(S, bp(rng.standard_normal(len(tt)), 2500, 7000) * np.exp(-tt * 140) * 0.5 + np.sin(2 * np.pi * (1900 + 60 * (k % 4)) * tt) * np.exp(-tt * 90) * 0.3, w, pan=0.1 * ((k % 3) - 1), g=0.10)
for j, c in enumerate(E['touches']):   # price meets the wall: a muted low knock
    tt = np.arange(int(SR * 0.5)) / SR; f = 70 * (1 + 1.5 * np.exp(-tt * 30)); knock = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9) + bp(rng.standard_normal(len(tt)), 300, 1600) * np.exp(-tt * 40) * 0.25
    add(S, knock, c - 0.01, g=0.30 if j == 0 else 0.22)
tt = np.arange(int(SR * 0.4)) / SR; add(S, np.sin(2 * np.pi * 1320 * tt) * np.exp(-tt * 14) * 0.6, E['tip'], pan=0.2, g=0.06)  # tooltip
tt = np.arange(int(SR * 0.5)) / SR; add(S, np.sin(2 * np.pi * 1760 * tt) * np.exp(-tt * 10) * 0.5, E['stall'] + 0.3, pan=-0.15, g=0.05)  # stall mark
if os.environ.get('HOOK_WAV'):   # the clip's own sound under the hook
    hw, hsr = sf.read(os.environ['HOOK_WAV']); hw = hw if hw.ndim == 2 else np.stack([hw, hw], 1)
    m = min(len(hw), n); fade = np.clip((OFF - np.arange(m) / SR) / 0.08, 0, 1)
    S[0][:m] += hw[:m, 0] * fade * 0.9; S[1][:m] += hw[:m, 1] * fade * 0.9
# camera pulls back to the full terminal: soft air whoosh; WALLS highlighted: glass tick
def whoosh(d, f0, f1):
    m = int(SR * d); tt = np.arange(m) / SR; x = rng.standard_normal(m); out = np.zeros(m); seg = 1024
    for k in range(0, m, seg): fc = f0 + (f1 - f0) * k / m; out[k:k + seg] = bp(x[k:k + seg + 256], max(80, fc * 0.6), fc * 1.4)[:len(out[k:k + seg])]
    return out * np.sin(np.pi * tt / d) ** 2
add(S, whoosh(0.9, 500, 2400), E['zout0'] - 0.1, pan=0.0, g=0.10)
tt = np.arange(int(SR * 0.3)) / SR; add(S, np.sin(2 * np.pi * 1760 * tt) * np.exp(-tt * 22), E['walls'], pan=-0.2, g=0.07)
if OFF > 0:   # hook in front: the ball rises (rising air), hard cut on the chart (soft sub hit)
    add(S, whoosh(OFF, 300, 3200), 0.0, g=0.12)
    tt = np.arange(int(SR * 0.6)) / SR; f = 48 * (1 + 2.5 * np.exp(-tt * 25)); add(S, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 6), OFF - 0.01, g=0.35)
# sonic logo on the end card
la = end + 0.2; tt = np.arange(int(SR * 1.8)) / SR; add(S, np.sin(2 * np.pi * 55 * tt) * np.clip(tt / 0.25, 0, 1) * np.exp(-tt * 2.2), la - 0.05, g=.30)
for j, (f, pn) in enumerate([(659.25, -.25), (987.77, .0), (1318.5, .25)]): add(S, chime(f), la + j * 0.11, pan=pn, g=.09)
# ---------- BED (92 BPM) ----------
B = buf(); bpm = 92; beat = 60 / bpm; bars = int(DUR / (4 * beat)) + 1
def kick(): tt = np.arange(int(SR * 0.4)) / SR; f = 50 * (1 + 2.2 * np.exp(-tt * 28)); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 8)
def snare(): m = int(SR * 0.22); tt = np.arange(m) / SR; return bp(rng.standard_normal(m), 700, 4500) * np.exp(-tt * 20) * 0.8 + np.sin(2 * np.pi * 190 * tt) * np.exp(-tt * 30) * 0.4
def hat(): m = int(SR * 0.05); tt = np.arange(m) / SR; return hp(rng.standard_normal(m), 7500) * np.exp(-tt * 80)
def ep(freqs, d):  # electric piano chord
    tt = np.arange(int(SR * d)) / SR; out = np.zeros(len(tt))
    for f in freqs: out += (np.sin(2 * np.pi * f * tt + 0.8 * np.sin(2 * np.pi * f * tt) * np.exp(-tt * 3)) * np.exp(-tt * 0.9))
    return lp(out / len(freqs), 2600) * np.clip(tt / 0.01, 0, 1) * np.clip((d - tt) / 0.3, 0, 1)
CH = [[220.0, 261.63, 329.63, 392.0], [174.61, 220.0, 261.63, 329.63], [130.81, 196.0, 246.94, 329.63], [196.0, 246.94, 293.66, 329.63]]
ROOT = [55.0, 43.65, 65.41, 49.0]
for b in range(bars):
    t0 = b * 4 * beat; ci = b % 4
    add(B, ep(CH[ci], 4 * beat + 0.2), t0, g=0.16)
    tt = np.arange(int(SR * 4 * beat)) / SR; add(B, np.sin(2 * np.pi * ROOT[ci] * tt) * np.clip(tt / 0.02, 0, 1) * np.exp(-tt * 0.6), t0, g=0.22)
    for q in range(4):
        tb = t0 + q * beat
        if q in (0, 2) or (q == 3 and b % 2): add(B, kick(), tb + (0.5 * beat if q == 3 else 0), g=0.42)
        if q in (1, 3): add(B, snare(), tb + 0.012, pan=0.05, g=0.16)
        for e in (0, 0.5): add(B, hat(), tb + e * beat + (0.03 if e else 0), pan=0.3, g=0.05 if e else 0.035)
# vinyl-ish air
air = lp(rng.standard_normal(n), 5000) * 0.006; B[0][:] += air; B[1][:] += air
# bed starts on frame 1, ducks a touch under the end card text, fades out under the sonic logo
env = np.clip(t / 0.05, 0, 1) * (1 - 0.55 * np.clip((t - end) / 0.4, 0, 1)) * np.clip((DUR - 0.4 - t) / 1.6, 0, 1)
B = (B[0] * env, B[1] * env)
for path, (L, R) in ((sys.argv[2], S), (sys.argv[3], B)):
    out = np.stack([L, R], 1); out /= max(1e-9, np.abs(out).max()) / 0.7; sf.write(path, out, SR, subtype='PCM_24')
print('ok', round(DUR, 2))
