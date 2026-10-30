"""VX sound design (30 Oct 2026). Synthesized only (no samples, no licensing exposure).
usage: python3 vx_sound.py <name> <ev.json> <out.wav>
Voice ads: dark bed + few contact moments + the Volwick sonic logo on the logo flash.
'edit': a full 128 BPM track (kick, clap, hats, sub, risers, impacts) cut to the scene grid."""
import json, sys, numpy as np, scipy.signal as ss, soundfile as sf
name = sys.argv[1]; ev = json.load(open(sys.argv[2])); E = ev['events']; DUR = ev['total'] + 0.3
SR = 48000; n = int(SR * DUR); t = np.arange(n) / SR; rng = np.random.default_rng(11)
L = np.zeros(n); R = np.zeros(n)
def lp(x, f, o=4): return ss.sosfilt(ss.butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return ss.sosfilt(ss.butter(o, f, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi, o=2): return ss.sosfilt(ss.butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def add(sig, at, pan=0.0, g=1.0):
    i = int(max(0, at) * SR); m = min(len(sig), n - i)
    if m <= 0: return
    L[i:i + m] += sig[:m] * g * np.sqrt((1 - pan) / 2); R[i:i + m] += sig[:m] * g * np.sqrt((1 + pan) / 2)
def tick(f=2400, d=0.035): tt = np.arange(int(SR * d)) / SR; return np.sin(2 * np.pi * f * tt) * np.exp(-tt * 140)
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
def riser(a, b, g=.08):
    d = max(0.2, b - a); m = int(SR * d); tt = np.arange(m) / SR; x = hp(rng.standard_normal(m), 800); add(x * (tt / d) ** 2, a, g=g)
logo_flash = E.get('logo0', ev['total'] - 5) + 1.5 / 1.7
if name != 'edit':
    loop0 = E.get('cues', {}).get('loop0', ev['total'] - 0.5)
    pad = np.zeros(n)
    for f, a in [(55, 1), (82.41, .5), (110, .45), (164.81, .25), (220, .1)]:
        for det in (-0.1, 0.1): pad += a * np.sin(2 * np.pi * (f + det) * t + rng.random() * 6)
    pad = lp(pad / 6 + lp(rng.standard_normal(n), 380) * 0.5, 800) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.08 * t))
    pad *= np.clip(t / 0.4, 0, 1) * np.clip((DUR - t) / 0.6, 0, 1) * 0.13
    import os
    if not os.environ.get('MUSIC_READY'): L += pad; R += pad   # music-ready: no drone, the in-app track takes that space
    add(boom(46, 1.4), 0.0, g=.32)                                             # hook contact on frame 1
    C = E.get('cues', {})
    if name == 'trend':
        add(whoosh(1.0), E['rev0'] - 0.1, .2, g=.16); add(boom(44, 1.8), E['wall'] + 0.3, g=.3); add(boom(52, 1.6), E['mega'] + 0.1, g=.32)
        add(chime(587.33, 1.6), E['mega'] + 0.12, -.1, g=.05); add(whoosh(0.6), E['erase'], -.2, g=.08); add(whoosh(0.9), E['ctx'] - 0.2, .3, g=.10)
    if name == 'tool':
        add(whoosh(0.5), E['mod0'], -.2, g=.10); add(boom(60, 0.6), C['s1'][0] + 0.15, g=.18)
        for k in (E['drop0'] - 0.02, E['pick']): add(tick(1900, 0.03), k, .15, g=.08); add(tick(3100, 0.02), k + 0.01, .15, g=.04)
        add(whoosh(0.8), E['walls'] - 0.1, .3, g=.10)
        for k in (E['g'], E['r'], E['m']): add(whoosh(0.6), k - 0.25, -.2, g=.08); add(boom(70, 0.7), k + 0.3, g=.16)
        add(whoosh(0.8), E['all'], .2, g=.10)
    if name == 'rule':
        add(boom(58, 1.2), E['push1'] - 0.05, g=.26)
        for k in (2.75, 3.45): add(ping(1480, 0.35), k, .2, g=.05)
        add(whoosh(0.7), E['stall0'], -.2, g=.08)
    if name == 'book':
        add(whoosh(0.9), E['whip0'], .3, g=.22); add(boom(48, 1.6), E['wall'] + 0.2, g=.3)
        add(chime(587.33, 1.4), E['prints'] + 0.05, -.1, g=.05); add(chime(783.99, 1.2), E['prints'] + 0.4, .1, g=.04)
        add(whoosh(0.6), E['same'], -.2, g=.08); riser(E['go0'] - 0.2, E['go1'] - 0.3, g=.05)
    add(whoosh(1.0), E['logo0'] - 0.4, .3, g=.14); sonic_logo(logo_flash)
else:
    B = E['B']; nb = int(E['T']['end'] / B) + 1
    def kick(): tt = np.arange(int(SR * 0.45)) / SR; f = 48 * (1 + 3 * np.exp(-tt * 30)); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 7)
    def clap(): m = int(SR * 0.25); x = bp(rng.standard_normal(m), 900, 3500); tt = np.arange(m) / SR; return x * np.exp(-tt * 22)
    def hat(): m = int(SR * 0.06); x = hp(rng.standard_normal(m), 7000); tt = np.arange(m) / SR; return x * np.exp(-tt * 70)
    for k in range(nb):
        tb = k * B
        if k >= 2: add(kick(), tb, g=.55)
        if k >= 2 and k % 2 == 1: add(clap(), tb, .1, g=.22)
        if k >= 4: add(hat(), tb + B / 2, .3, g=.10); add(hat(), tb, -.3, g=.06)
        if k >= 2:  # sub bass: root note follows a 4 bar loop
            root = [41.2, 41.2, 49.0, 36.7][(k // 4) % 4]; tt = np.arange(int(SR * B * 0.9)) / SR; add(np.sin(2 * np.pi * root * tt) * np.exp(-tt * 2.5), tb, g=.28)
    for h in E['HITS']: add(boom(52, 1.0), h, g=.22); add(whoosh(0.35)[::-1], h - 0.3, .2, g=.07)
    T = E['T']; riser(T['walls'] - 4 * B, T['walls'], .06); riser(T['cards'] - 4 * B, T['cards'], .06); riser(T['slogan'] - 4 * B, T['slogan'], .07)
    for i in range(30): add(tick(2200 + i * 40, 0.02), T['print'] + i * 0.02, .2, g=.03)   # pixels landing
    # music drops out on the logo, only the sonic logo remains
    lo = E['logo0']; fade = np.clip(1 - (t - lo) / 0.5, 0, 1); L *= fade; R *= fade
    add(whoosh(1.0), lo - 0.4, .3, g=.14); sonic_logo(logo_flash)
    pad = lp(rng.standard_normal(n), 300) * 0.05 * np.clip((t - lo) / 0.5, 0, 1) * np.clip((DUR - t) / 0.6, 0, 1); L += pad; R += pad
out = np.stack([L, R], 1); out /= max(1e-9, np.abs(out).max()) / 0.6
sf.write(sys.argv[3], out, SR, subtype='PCM_24'); print('ok', name, round(DUR, 2))
