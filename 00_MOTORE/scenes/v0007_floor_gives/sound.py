"""V0002 EDIT ORDER FLOW (copied from vx/c05_sound.py, CREATIVE 05): sound. HOOK_WAV = sound of the hook clip on the first bar. Original synthesized audio only, 125 BPM grid (beat 0.48 s), first downbeat at 0.00 s.
usage: python3 c05_sound.py ev.json sfx.wav bed.wav
sfx (MUSIC READY): ignition, UI ticks on every chip, wall impacts, pixel build, card whooshes, slogan hits, sonic logo.
bed: 125 BPM synth track with the same structure (intro, build, drop, break, drop, half time, outro) as a placeholder."""
import json, sys, numpy as np, scipy.signal as ss, soundfile as sf
ev = json.load(open(sys.argv[1])); E = ev['events']; T = E['T']; DUR = ev['total'] + 0.2
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
S = buf()
# intro: neon flicker + streak + monogram, wordmark snap on beat 2, collapse into the header line
# V0002: the first bar is the Ocean Drop hook clip (its own sound, HOOK_WAV), a long falling whoosh under it
import os
if os.environ.get('HOOK_WAV'):
    hw, hsr = sf.read(os.environ['HOOK_WAV']); hw = hw if hw.ndim == 2 else np.stack([hw, hw], 1)
    if hsr != SR: hw = ss.resample(hw, int(len(hw) * SR / hsr))
    m = min(len(hw), int(bt(4) * SR)); fade = np.clip((m - np.arange(m)) / (0.05 * SR), 0, 1); add(S, hw[:m, 0] * fade, 0, pan=-0.3, g=0.9); add(S, hw[:m, 1] * fade, 0, pan=0.3, g=0.9)
add(S, whoosh(bt(3), up=False), bt(0.5), g=0.22); add(S, thump(90, 30, 1.0), 0, g=0.35)
add(S, riser(bt(0.5)), bt(3.5), g=0.18); add(S, whoosh(bt(0.5), up=False), bt(3.5), g=0.25)
# header chips: one UI tick per chip, panned by position
chips = [4, 4, 4.25, 4.5, 5, 5, 5.25, 5.5, 5.75, 6, 6, 6, 6.25, 6.375, 6.5, 6.625, 6.75, 6.875]
for j, c in enumerate(sorted(set(chips))): add(S, tick(2200 + 180 * (j % 5)), bt(c), pan=-0.5 + (j % 7) / 6, g=0.16)
for c in (4, 5, 6, 6.75): add(S, thump(160, 70, 0.18) * 0.6, bt(c), g=0.35)    # cut accents
add(S, whoosh(bt(1), up=True), bt(7), g=0.3)
# walls: one impact per beat, the starred wall heavier
for j, w in enumerate(E['walls']): add(S, slam(big=(j == 4)), w, pan=[-.15, .15, -.05, .2, 0][j], g=0.55 if j < 4 else 0.75)
# maps / cvd switching on
add(S, sweep(300, 1400, 0.3) * env(0.3, 0.004, 9) * 0.5, T['maps'], g=0.18); add(S, tick(1800, 0.08), T['maps'], g=0.2)
add(S, tick(2600, 0.08), T['cvd'], pan=0.2, g=0.22); add(S, thump(140, 60, 0.2), T['cvd'], g=0.25)
# block prints on + prints popping on the chart
add(S, tick(3000, 0.08), T['prints'], g=0.24); add(S, chime(987.77, 0.9), T['prints'], pan=-0.2, g=0.06)
for j in range(7): add(S, blip(1400 + 120 * j), T['prints'] + bt(0.125 * j) * 0.5, pan=-0.6 + 0.2 * j, g=0.2)
# 2,000 from pixels: digital grains thickening, impact when the number locks, then it docks into the level
d = T['num'] - T['dim']
for k in range(160):
    u = (k / 160) ** 0.6; at = T['dim'] + u * d; add(S, blip(900 + rng.random() * 2600), at, pan=rng.uniform(-0.8, 0.8), g=0.05 + 0.08 * (k / 160))
add(S, riser(d), T['dim'], g=0.14)
add(S, slam(big=True), T['num'], g=0.6); add(S, chime(659.25, 1.4), T['num'], pan=-.2, g=.06); add(S, chime(1318.5, 1.4), T['num'] + 0.05, pan=.2, g=.05)
add(S, whoosh(bt(0.5), up=False), T['dock'], g=0.3); add(S, tick(1500, 0.08), T['dock'] + bt(0.5), g=0.22)
# cards: a whoosh and a soft hit for each card on the beat
for j in range(6): add(S, whoosh(0.22), T['cards'] + bt(j) - 0.12, pan=-0.4 if j % 2 == 0 else 0.4, g=0.32); add(S, thump(130, 55, 0.35), T['cards'] + bt(j), g=0.35); add(S, tick(2000 + 200 * j, 0.06), T['cards'] + bt(j), g=0.12)
add(S, slam(), T['one'], g=0.45); add(S, riser(T['slogan'] - T['out']), T['out'], g=0.25); add(S, whoosh(T['slogan'] - T['out'] + 0.1), T['out'], g=0.35)
# slogan: one hit per word
for j in range(4): add(S, thump(110, 36, 0.9), T['slogan'] + bt(j), g=0.6 if j < 3 else 0.75); add(S, hp(noise(0.12), 3000) * env(0.12, 0.0005, 40), T['slogan'] + bt(j), g=0.12)
# sonic logo on the end card
la = E['end']; add(S, sine(55, 1.8) * np.clip(tt(1.8) / 0.25, 0, 1) * np.exp(-tt(1.8) * 2.2), la - 0.05, g=.30)
for j, (f, pn) in enumerate([(659.25, -.25), (987.77, .0), (1318.5, .25)]): add(S, chime(f), la + 0.1 + j * 0.11, pan=pn, g=.09)
for j, at in enumerate([0, 0.12, 0.24]): add(S, buzz(0.08), la + at, g=0.08)
# ---------- BED: 125 BPM, A minor, Am F C G ----------
Bd = buf(); bars = 11
ROOT = [55.0, 43.65, 65.41, 49.0]; CH = [[220, 261.63, 329.63], [174.61, 220, 261.63], [196, 261.63, 329.63], [196, 246.94, 293.66]]
def kick(): x = tt(0.35); f = 45 * (1 + 2.6 * np.exp(-x * 30)); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 7) * 1.1
def clap(): d = 0.25; return bp(noise(d), 900, 5000) * (env(d, 0.001, 30) + 0.5 * np.roll(env(d, 0.001, 60), 400) + 0.4 * np.roll(env(d, 0.001, 60), 800)) * 0.7
def hat(o=False): d = 0.18 if o else 0.05; return hp(noise(d), 8000) * env(d, 0.0005, 18 if o else 80)
def saw(f, d): x = tt(d); return 2 * ((f * x) % 1) - 1
def bass(f, d): s = saw(f, d) * 0.5 + saw(f * 1.005, d) * 0.5; return lp(s, 420) * np.clip(tt(d) / 0.004, 0, 1) * np.clip((d - tt(d)) / 0.02, 0, 1)
def pluck(f): d = 0.3; return lp(saw(f, d), 3200) * env(d, 0.001, 11)
def pad(fs, d): out = sum(lp(saw(f, d) + saw(f * 1.004, d), 1400) for f in fs) / (2 * len(fs)); x = tt(d); return out * np.clip(x / 0.3, 0, 1) * np.clip((d - x) / 0.3, 0, 1)
def section(bar):  # 0 intro, 1 build, 2-3 drop, 4 break, 5-6 drop, 7 half time, 8-9 outro
    return ['intro', 'build', 'drop', 'drop', 'break', 'drop', 'drop', 'half', 'outro', 'outro', 'tail'][bar]
side = np.ones(n)
for bar in range(bars):
    t0 = bt(4 * bar); s = section(bar); ci = bar % 4
    if s == 'tail': break
    if s in ('intro', 'break', 'outro', 'build'): add(Bd, pad([f / 2 for f in CH[ci]] + [f for f in CH[ci]], bt(4) + 0.3), t0, g=0.32 if s != 'outro' else 0.28)
    if s in ('intro', 'build', 'drop', 'break'):
        for k in range(8):
            f = CH[ci][[0, 1, 2, 1, 0, 2, 1, 2][k]] * 2; add(Bd, pluck(f), t0 + bt(k * 0.5), pan=0.35 * (-1) ** k, g=0.10 if s in ('intro', 'break') else 0.13)
    if s == 'build':
        for k in range(16): add(Bd, hat(), t0 + bt(k * 0.25), pan=0.3, g=0.05 + 0.04 * k / 16)
        for k in range(8): add(Bd, clap() * 0.6, t0 + bt(2 + k * 0.25), g=0.12 + 0.12 * k / 8)
    if s == 'drop':
        for k in range(4):
            tb = t0 + bt(k); add(Bd, kick(), tb, g=0.55); i0 = int(tb * SR); m = min(int(0.2 * SR), n - i0)
            if m > 0: side[i0:i0 + m] = np.minimum(side[i0:i0 + m], 0.25 + 0.75 * (np.arange(m) / m))
            if k in (1, 3): add(Bd, clap(), tb, g=0.24)
            add(Bd, hat(), tb + bt(0.5), pan=0.25, g=0.08); add(Bd, hat(), tb + bt(0.25), pan=-0.25, g=0.035); add(Bd, hat(), tb + bt(0.75), pan=-0.25, g=0.035)
            for e in (0.5, 0.75): add(Bd, bass(ROOT[ci] * 2, bt(0.24)), tb + bt(e), g=0.32)
    if s == 'break':
        for k in range(8): add(Bd, clap() * 0.5, t0 + bt(3 + k * 0.125), g=0.06 + 0.12 * k / 8)
    if s == 'half':
        for k in range(4): add(Bd, kick(), t0 + bt(k), g=0.48); add(Bd, bass(ROOT[ci] * 2, bt(0.7)), t0 + bt(k), g=0.22)
        add(Bd, pad([f for f in CH[0]], bt(4)), t0, g=0.22)
    if s == 'outro' and bar == 8: add(Bd, kick(), t0, g=0.5); add(Bd, bass(55.0 * 2, bt(3)), t0, g=0.3)
Bd = (Bd[0] * side, Bd[1] * side)
x = np.arange(n) / SR; fo = np.clip((ev['total'] + 0.15 - x) / 1.6, 0, 1); Bd = (Bd[0] * fo, Bd[1] * fo)
def wr(path, Bf, peak):
    st = np.stack(Bf, 1); st = st / (np.max(np.abs(st)) + 1e-9) * peak; sf.write(path, st.astype(np.float32), SR, subtype='FLOAT')
wr(sys.argv[2], S, 0.85); wr(sys.argv[3], Bd, 0.8); print('ok', DUR)
