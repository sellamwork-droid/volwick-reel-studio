"""CREATIVE 06 · FALLING INTO SUPPORT. Simulated ES 1m session, no real data. Deterministic."""
import json, numpy as np
rng = np.random.default_rng(20261031); q = lambda x: round(x * 4) / 4
A = [(0, 7731.0), (8, 7724.0), (15, 7716.0), (22, 7713.5), (28, 7721.0), (36, 7731.0), (45, 7738.0), (50, 7735.0), (54, 7729.5), (56, 7726.0),
     (57, 7722.5), (58, 7718.0), (59, 7714.0), (60, 7713.5), (62, 7715.0), (64, 7713.75), (65, 7713.25), (68, 7716.5), (72, 7718.5), (76, 7717.5), (80, 7721.0), (86, 7724.0), (92, 7726.5)]
N = 93
def anchor(i):
    for (a, pa), (b, pb) in zip(A, A[1:]):
        if a <= i <= b: u = (i - a) / (b - a); return pa + (pb - pa) * (0.5 - 0.5 * np.cos(np.pi * u))
    return A[-1][1]
vol = lambda i: 0.55 if i < 55 else (1.6 if i < 61 else (0.8 if i < 70 else 0.65))
bars = []; prev = 7731.25
for i in range(N):
    v = vol(i); o = prev; c = q(anchor(i) + rng.normal(0, v * 0.4))
    if c == o: c = o + 0.25 * rng.choice([-1, 1])
    h = max(o, c) + q(abs(rng.normal(0, v * 0.5))); l = min(o, c) - q(abs(rng.normal(0, v * 0.5)))
    bars.append(dict(o=o, h=h, l=l, c=c)); prev = c
SUP = 7712.50
for i, b in enumerate(bars):          # one clean prior swing low = the drawn support; the drop tests it once, never closes below the put wall
    if i < 57: b['l'] = max(b['l'], SUP + 0.25)
    b['l'] = max(b['l'], 7711.75); b['h'] = max(b['h'], b['o'], b['c']); b['l'] = min(b['l'], b['o'], b['c'])
bars[22]['l'] = SUP
# the drop: two big red candles straight into the line, then a wick through it
bars[58].update(o=bars[57]['c'], c=7716.25); bars[58]['h'] = bars[58]['o'] + 0.25; bars[58]['l'] = 7715.75
bars[59].update(o=7716.25, c=7713.25, h=7716.5, l=7712.75)
bars[60].update(o=7713.25, c=7714.0, h=7714.5, l=7711.75)
bars[61]['o'] = 7714.0
for i in range(61, N - 1): bars[i + 1]['o'] = bars[i]['c']
for b in bars: b['h'] = max(b['h'], b['o'], b['c']); b['l'] = min(b['l'], b['o'], b['c'])
for i, b in enumerate(bars):
    down = b['c'] < b['o']; first_hi = rng.random() < (0.75 if down else 0.3)
    e1, e2 = (b['h'], b['l']) if first_hi else (b['l'], b['h']); pts = [b['o']]; k0 = b['o']
    for k1 in (e1, e2, b['c']):
        for s in range(1, 5): pts.append(q(min(b['h'], max(b['l'], k0 + (k1 - k0) * s / 4 + (rng.normal(0, 0.15) if s < 4 else 0)))))
        k0 = k1
    if i in (58, 59): pts = [q(b['o'] + (b['c'] - b['o']) * (s / 12) ** 1.6) for s in range(13)]; pts[-1] = b['c']   # accelerating fall
    pts[-1] = b['c']; b['path'] = pts
    b['v'] = max(250, int(rng.normal(900, 220) * (1 if i < 56 else 3.0 if i < 62 else 1.6)))
    b['d'] = int((b['c'] - b['o']) * 160 + rng.normal(0, 80))
json.dump(dict(bars=bars, SUP=SUP), open('data.json', 'w'))
print(min(b['l'] for b in bars), [(i, bars[i]['o'], bars[i]['h'], bars[i]['l'], bars[i]['c']) for i in range(55, 68)])
