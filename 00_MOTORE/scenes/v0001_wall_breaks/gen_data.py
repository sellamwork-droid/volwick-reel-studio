"""V0001 · THE WALL BREAKS (T4). Simulated ES 1m session, no real data. Deterministic (seed fisso, tick 0,25).
Story: the trader's support at 7,722.50 breaks; under it sits a short-γ put wall (accelerative), price falls fast
and stalls just above the next long-γ put wall at 7,706.50. Nothing here is real market data."""
import json, numpy as np
rng = np.random.default_rng(20261101); q = lambda x: round(x * 4) / 4
SUP, SHORT, LONG = 7722.50, 7719.50, 7706.50
A = [(0, 7738.0), (8, 7731.0), (15, 7726.0), (22, 7723.0), (28, 7729.0), (36, 7736.5), (45, 7739.0), (50, 7734.0), (54, 7729.0), (56, 7726.5),
     (57, 7724.0), (58, 7719.0), (59, 7711.0), (60, 7708.0), (62, 7710.5), (64, 7708.5), (66, 7709.0), (70, 7711.5), (74, 7710.0), (78, 7712.0), (84, 7710.5), (92, 7711.5)]
N = 93
def anchor(i):
    for (a, pa), (b, pb) in zip(A, A[1:]):
        if a <= i <= b: u = (i - a) / (b - a); return pa + (pb - pa) * (0.5 - 0.5 * np.cos(np.pi * u))
    return A[-1][1]
vol = lambda i: 0.55 if i < 56 else (1.7 if i < 62 else 0.7)
bars = []; prev = 7738.25
for i in range(N):
    v = vol(i); o = prev; c = q(anchor(i) + rng.normal(0, v * 0.4))
    if c == o: c = o + 0.25 * rng.choice([-1, 1])
    h = max(o, c) + q(abs(rng.normal(0, v * 0.5))); l = min(o, c) - q(abs(rng.normal(0, v * 0.5)))
    bars.append(dict(o=o, h=h, l=l, c=c)); prev = c
for i, b in enumerate(bars):          # one clean prior swing low = the drawn support; after the break nothing closes under the long-γ wall
    if i < 57: b['l'] = max(b['l'], SUP + 0.25)
    b['l'] = max(b['l'], LONG + 0.25); b['h'] = max(b['h'], b['o'], b['c']); b['l'] = min(b['l'], b['o'], b['c'])
bars[22]['l'] = SUP
# the break: a red candle onto the line, then two big red candles straight through it, a wick one tick above the long-γ wall
bars[57].update(o=bars[56]['c'], c=7723.25); bars[57]['h'] = max(bars[57]['o'], 7723.25) + 0.25; bars[57]['l'] = 7723.0
bars[58].update(o=7723.25, c=7716.75, h=7723.5, l=7716.5)
bars[59].update(o=7716.75, c=7709.75, h=7717.0, l=7709.5)
bars[60].update(o=7709.75, c=7708.25, h=7710.25, l=LONG + 0.25)
bars[61]['o'] = 7708.25
for i in range(61, N - 1): bars[i + 1]['o'] = bars[i]['c']
for b in bars: b['h'] = max(b['h'], b['o'], b['c']); b['l'] = max(min(b['l'], b['o'], b['c']), LONG + 0.25 if b is not bars[22] else SUP)
for i, b in enumerate(bars):
    down = b['c'] < b['o']; first_hi = rng.random() < (0.75 if down else 0.3)
    e1, e2 = (b['h'], b['l']) if first_hi else (b['l'], b['h']); pts = [b['o']]; k0 = b['o']
    for k1 in (e1, e2, b['c']):
        for s in range(1, 5): pts.append(q(min(b['h'], max(b['l'], k0 + (k1 - k0) * s / 4 + (rng.normal(0, 0.15) if s < 4 else 0)))))
        k0 = k1
    if i in (58, 59): pts = [q(b['o'] + (b['c'] - b['o']) * (s / 12) ** 1.6) for s in range(13)]; pts[-1] = b['c']   # accelerating fall
    pts[-1] = b['c']; b['path'] = pts
    b['v'] = max(250, int(rng.normal(900, 220) * (1 if i < 57 else 3.2 if i < 62 else 1.5)))
    b['d'] = int((b['c'] - b['o']) * 160 + rng.normal(0, 80))
json.dump(dict(bars=bars, SUP=SUP), open('data.json', 'w'))
print('min low', min(b['l'] for b in bars), [(i, bars[i]['o'], bars[i]['h'], bars[i]['l'], bars[i]['c']) for i in range(55, 66)])
print('highs', max(b['h'] for b in bars))
