"""VOLWICK · Live Market Reactions · events on minute bars.

Input: minute bars read from the terminal (ET minutes) + the walls on screen with their book time.
Output: every TOUCH / STALL / CROSS episode, with what price did afterwards. Nothing is filtered by outcome.
Scoring measures how readable the moment is on screen, never whether the level 'worked'.
"""
import numpy as np

TOUCH_PTS = 1.0      # A: price within 1 point of the wall
STALL_PTS = 2.0      # B: near the wall (within 2 points) ...
STALL_RATIO = 0.5    #    ... and the next 5 minutes move less than half of the previous 5
CROSS_PTS = 1.0      # C: closes beyond the wall by >= 1 point ...
CROSS_BARS = 2       #    ... for 2 minutes in a row
AFTER = 15           # minutes measured after the event

def hm(m): return '%02d:%02d' % divmod(int(m), 60)

def _rng(bars, a, b):
    seg = [x for x in bars[max(0, a):max(0, b)] if x['ok']]
    if not seg: return None
    return max(x['high'] for x in seg) - min(x['low'] for x in seg)

def find_events(bars, walls, book_minute_et, market='ES', date='', layer='Dealer Walls (GEX)'):
    """bars: list of dicts with minute_et, open, high, low, close, ok. walls: list of dicts with level, family, family_text, label_value."""
    bars = [b for b in bars if b.get('ok')]
    out = []
    for w in walls:
        L = w['level']; inside = False; i = 0
        while i < len(bars):
            b = bars[i]
            if b['minute_et'] < book_minute_et:          # the wall did not exist yet on screen
                i += 1; continue
            near = (b['low'] <= L + TOUCH_PTS) and (b['high'] >= L - TOUCH_PTS)
            if near and not inside:
                inside = True
                prev = [x for x in bars[:i] if x['minute_et'] >= book_minute_et - 60]
                side = np.sign((prev[-1]['close'] if prev else b['open']) - L) or 1
                came_from = 'below' if side < 0 else 'above'
                ev = {'type': ['TOUCH'], 'market': market, 'date': date, 'layer': layer, 'level': L,
                      'wall_family': w['family'], 'wall_text': w['family_text'], 'wall_value': w.get('label_value'),
                      'level_source': w.get('level_source'), 'from': came_from,
                      'start_et': hm(b['minute_et']), 'start_minute_et': b['minute_et']}
                # approach: points travelled toward the wall in the 30 minutes before
                look = [x for x in bars[:i] if x['minute_et'] >= b['minute_et'] - 30]
                if look:
                    ext = min(x['low'] for x in look) if came_from == 'below' else max(x['high'] for x in look)
                    ev['approach_pts_30m'] = round(abs(L - ext), 2)
                # stall
                r_before = _rng(bars, i - 5, i); r_after = _rng(bars, i, i + 5)
                if r_before and r_after is not None and abs(b['close'] - L) <= STALL_PTS and r_after < STALL_RATIO * r_before:
                    ev['type'].append('STALL')
                ev['range_5m_before'] = r_before; ev['range_5m_after'] = r_after
                # cross: closes beyond the wall on the other side
                run, cross_at = 0, None
                for j in range(i, min(len(bars), i + AFTER + 1)):
                    beyond = (bars[j]['close'] - L) * (-side) >= CROSS_PTS
                    run = run + 1 if beyond else 0
                    if run >= CROSS_BARS: cross_at = bars[j - CROSS_BARS + 1]['minute_et']; break
                if cross_at is not None:
                    ev['type'].append('CROSS'); ev['cross_et'] = hm(cross_at)
                # what price did in the next 15 minutes, relative to the wall
                aft = bars[i:i + AFTER + 1]
                ev['after_15m'] = {
                    'max_above_pts': round(max(x['high'] for x in aft) - L, 2),
                    'max_below_pts': round(L - min(x['low'] for x in aft), 2),
                    'minutes_within_1pt': sum(1 for x in aft if x['low'] <= L + 1 and x['high'] >= L - 1),
                    'close_vs_level_pts': round(aft[-1]['close'] - L, 2),
                    'range_pts': round(max(x['high'] for x in aft) - min(x['low'] for x in aft), 2),
                    'minutes_available': len(aft) - 1}
                ev['end_et'] = hm(aft[-1]['minute_et']); ev['end_minute_et'] = aft[-1]['minute_et']
                far = ev['after_15m']['max_above_pts'] if side < 0 else ev['after_15m']['max_below_pts']
                ev['outcome'] = 'crossed' if cross_at is not None else ('did not get through' if far < CROSS_PTS else 'probed beyond, no 2-minute close')
                # readability score 0..100 (never the outcome)
                others = [x['level'] for x in walls if x is not w and abs(x['level'] - L) < 3]
                ev['score_readability'] = int(min(100, 40 * min(1, (ev.get('approach_pts_30m') or 0) / 10)
                                                  + 30 * (0 if others else 1)
                                                  + 30 * min(1, ev['after_15m']['minutes_available'] / AFTER)))
                out.append(ev)
            elif not near and inside:
                # leave the episode once price is clearly away (> 3 points)
                if abs(b['close'] - L) > 3: inside = False
            i += 1
    out.sort(key=lambda e: e['start_minute_et'])
    for k, e in enumerate(out): e['id'] = f"{e['market']}-{e['date']}-{k + 1:02d}"
    return out
