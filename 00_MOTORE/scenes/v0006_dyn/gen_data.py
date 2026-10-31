"""V0006 v3 · THE BAR, dynamic cut (T4). Price consolidates, rips through the line in four big green candles, slams one tick under the call wall, drops back.
V0006 · THE BAR (T4). Simulated ES 1m session, no real data. Deterministic (seed fisso, tick 0,25).
Story: the trader's resistance at 7,731.50 (prior swing high). Price pokes over it, stalls one tick under a long-γ call wall
at 7,733.50, then drops back under the line and holds above the long-γ put wall at 7,722.50. Nothing here is real market data."""
import json, numpy as np
rng = np.random.default_rng(20261106); q = lambda x: round(x * 4) / 4
RES, CALLW, PUTW = 7731.50, 7733.50, 7722.50
A = [(0, 7716.0), (8, 7721.0), (14, 7726.5), (20, 7731.0), (26, 7727.0), (32, 7723.5), (38, 7725.0), (44, 7726.0), (48, 7725.25), (52, 7726.0),
     (53, 7727.75), (54, 7729.75), (55, 7731.25), (56, 7732.75), (57, 7731.0), (58, 7727.5), (59, 7725.0), (60, 7724.0), (63, 7725.5), (67, 7724.25), (72, 7726.0), (78, 7725.0), (85, 7726.25), (92, 7725.5)]
N = 93
def anchor(i):
    for (a, pa), (b, pb) in zip(A, A[1:]):
        if a <= i <= b: u = (i - a) / (b - a); return pa + (pb - pa) * (0.5 - 0.5 * np.cos(np.pi * u))
    return A[-1][1]
vol = lambda i: 0.5 if i < 55 else (1.5 if i < 61 else 0.6)
bars = []; prev = 7716.25
for i in range(N):
    v = vol(i); o = prev; c = q(anchor(i) + rng.normal(0, v * 0.4))
    if c == o: c = o + 0.25 * rng.choice([-1, 1])
    h = max(o, c) + q(abs(rng.normal(0, v * 0.5))); l = min(o, c) - q(abs(rng.normal(0, v * 0.5)))
    bars.append(dict(o=o, h=h, l=l, c=c)); prev = c
def fix(b): b['h'] = max(b['h'], b['o'], b['c']); b['l'] = min(b['l'], b['o'], b['c'])
for i, b in enumerate(bars):          # one clean prior swing high = the drawn resistance; nothing trades at or above the call wall
    if i < 55: b['h'] = min(b['h'], RES - 0.25); b['c'] = min(b['c'], RES - 0.25); b['o'] = min(b['o'], RES - 0.25)
    b['h'] = min(b['h'], CALLW - 0.25); b['l'] = max(b['l'], PUTW + 0.25); fix(b)
bars[20]['h'] = RES
# the rip: four big green candles through the line, a rejection candle one tick under the call wall, two red candles back under
bars[52]['c'] = 7726.0; bars[52]['h'] = max(bars[52]['h'], 7726.0)
for i, (o, c, h, l) in zip(range(53, 60), [(7726.0, 7727.75, 7728.0, 7725.75), (7727.75, 7729.75, 7730.0, 7727.5), (7729.75, 7731.25, 7731.25, 7729.5),
                                            (7731.25, 7732.75, 7733.0, 7731.0), (7732.75, 7729.5, CALLW - 0.25, 7729.25), (7729.5, 7725.75, 7729.75, 7725.5), (7725.75, 7724.25, 7726.25, PUTW + 0.75)]):
    bars[i].update(o=o, c=c, h=h, l=l)
bars[60]['o'] = 7724.25
for i in range(60, N - 1): bars[i + 1]['o'] = bars[i]['c']
for b in bars: fix(b); b['l'] = max(b['l'], PUTW + 0.25); b['h'] = min(b['h'], CALLW - 0.25); fix(b)
for i, b in enumerate(bars):
    down = b['c'] < b['o']; first_hi = rng.random() < (0.75 if down else 0.3)
    e1, e2 = (b['h'], b['l']) if first_hi else (b['l'], b['h']); pts = [b['o']]; k0 = b['o']
    for k1 in (e1, e2, b['c']):
        for s in range(1, 5): pts.append(q(min(b['h'], max(b['l'], k0 + (k1 - k0) * s / 4 + (rng.normal(0, 0.15) if s < 4 else 0)))))
        k0 = k1
    if 53 <= i <= 56: pts = [q(b['o'] + (b['c'] - b['o']) * (s / 11) ** 0.8) for s in range(12)]; pts[1] = b['l'] if i == 53 else pts[1]; pts[-2] = b['h']   # straight up
    if i == 57: pts = [7732.75, 7733.0, CALLW - 0.25, 7733.0, 7732.5, 7731.75, 7731.0, 7730.5, 7730.0, 7729.5, 7729.25, 7729.5]   # straight to the high, then down through the line
    if i == 58: pts = [q(b['o'] + (b['c'] - b['o']) * (s / 12) ** 1.4) for s in range(13)]
    pts[-1] = b['c']; b['path'] = pts
    b['v'] = max(250, int(rng.normal(900, 220) * (1 if i < 53 else 3.2 if i < 61 else 1.4)))
    b['d'] = int((b['c'] - b['o']) * 160 + rng.normal(0, 80))
json.dump(dict(bars=bars, SUP=RES), open('data.json', 'w'))
print('range', min(b['l'] for b in bars), max(b['h'] for b in bars), [(i, bars[i]['o'], bars[i]['h'], bars[i]['l'], bars[i]['c']) for i in range(54, 62)])
print('highs before 56 at RES:', [i for i, b in enumerate(bars[:56]) if b['h'] >= RES])
