#!/usr/bin/env python3
"""VOLWICK · Live Market Reactions · event detection from what the terminal shows.

  still mode (one frame of the terminal, e.g. the end-of-session chart):
    python3 lmr_detect.py still <frame.png> <meta.json> <out_dir>
  video mode (a segment recorded by lmr_recorder.html, with its JSON):
    python3 lmr_detect.py video <segment.mp4> <segment.json> <out_dir> [--every 0.5]

Writes <out_dir>/<id>_bars.csv, <id>_walls.json, <id>_events.json and a calibration sheet PNG.
Works only on pixels: axis labels, wall lines and labels, candles, last-price box.
"""
import sys, json, os, csv, datetime as dt
from zoneinfo import ZoneInfo
import numpy as np, cv2
import lmr_vision as V, lmr_events as EV

ET = ZoneInfo('America/New_York')

def write(out_dir, sid, bars, walls, events, calib, extra=None):
    os.makedirs(out_dir, exist_ok=True)
    with open(os.path.join(out_dir, f'{sid}_bars.csv'), 'w', newline='') as f:
        w = csv.writer(f); w.writerow(['minute_et', 'time_et', 'open', 'high', 'low', 'close', 'ok', 'source'])
        for b in bars: w.writerow([b['minute_et'], EV.hm(b['minute_et']), b.get('open'), b.get('high'), b.get('low'), b.get('close'), b['ok'], b.get('source', '')])
    json.dump(walls, open(os.path.join(out_dir, f'{sid}_walls.json'), 'w'), indent=2, default=float)
    doc = {'id': sid, 'generated_utc': dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds'), 'calibration': calib,
           'rules': {'touch_pts': EV.TOUCH_PTS, 'stall_pts': EV.STALL_PTS, 'stall_ratio': EV.STALL_RATIO,
                     'cross_pts': EV.CROSS_PTS, 'cross_bars': EV.CROSS_BARS, 'after_minutes': EV.AFTER},
           'note': 'All episodes are listed, whatever happened after. Score = readability only.',
           'events': events}
    if extra: doc.update(extra)
    json.dump(doc, open(os.path.join(out_dir, f'{sid}_events.json'), 'w'), indent=2, default=float)

def calib_sheet(im, L, a, b, walls, path, ta=None, tb=None):
    v = im[:, :, ::-1].astype(np.uint8).copy()
    x0, y0, x1, y1 = L.pane
    cv2.rectangle(v, (int(x0), int(y0)), (int(x1), int(y1)), (255, 140, 47), 1)
    cv2.rectangle(v, (int(L.axis_x0), int(y0)), (int(L.axis_x1), int(y1)), (80, 200, 255), 1)
    for w in walls:
        cv2.line(v, (int(x0), w['y']), (int(x1), w['y']), (255, 255, 255), 1)
        cv2.putText(v, f"{w['level']} {w['family']}", (int(x0) + 4, w['y'] - 4), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1)
    cv2.imwrite(path, v)

def still(frame, meta_path, out_dir):
    meta = json.load(open(meta_path))
    im = V.rgb(cv2.imread(frame))
    L = V.Layout(im)
    a, b, resid, pinfo = V.price_axis(im, L)
    ta, tb, tinfo = V.time_axis(im, L)
    walls = V.walls(im, L, a, b)
    last, last_y = V.last_price_box(im, L)
    # minutes on the axis are in the browser time zone: convert to ET with the session date
    tz = ZoneInfo(meta['browser_tz']); day = dt.date.fromisoformat(meta['session_date'])
    def to_et_minute(m_local):
        t = dt.datetime.combine(day, dt.time(0), tz) + dt.timedelta(minutes=m_local)
        e = t.astimezone(ET); return e.hour * 60 + e.minute
    lo_m = int(np.ceil((L.pane[0] - 0) * ta + tb)); hi_m = int(np.floor(L.pane[2] * ta + tb))
    raw = V.candles(im, L, a, b, ta, tb, range(lo_m, hi_m + 1))
    bars = []
    for c in raw:
        c = dict(c); c['minute_local'] = c['minute']; c['minute_et'] = to_et_minute(c['minute']); c['source'] = 'candle pixels'
        bars.append(c)
    okb = [x for x in bars if x['ok']]
    if okb and last is not None:            # the last candle's close is the last-price box (exact), drawn over by the price line
        okb[-1]['close_pixels'] = okb[-1]['close']; okb[-1]['close'] = last; okb[-1]['source'] = 'candle pixels + last-price box'
        okb[-1]['high'] = max(okb[-1]['high'], last); okb[-1]['low'] = min(okb[-1]['low'], last)
    book_et = meta['book_time_et']; bh, bm = map(int, book_et.split(':'))
    events = EV.find_events(bars, walls, bh * 60 + bm, market=meta['market'], date=meta['session_date'])
    for e in events:
        e['book_time_et'] = book_et; e['book_older_than_event'] = e['start_minute_et'] >= bh * 60 + bm
        e['data_quality'] = {'price_axis_resid_px': round(resid, 2), 'price_axis_ocr': f"{pinfo['ocr_agree']}/{pinfo['ocr_total']}",
                             'time_axis_ocr': f"{tinfo['ocr_agree']}/{tinfo['ocr_total']}",
                             'px_per_tick': round(V.TICK / abs(a), 2), 'price_precision_pts': 0.25,
                             'feed_interruptions': meta.get('feed_interruptions', 'none visible on the chart')}
    sid = meta['id']
    calib = {'mode': 'still', 'frame': os.path.basename(frame), 'layout': {'pane': [int(v) for v in L.pane], 'axis_x': [L.axis_x0, L.axis_x1], 'time_y': [L.time_y0, L.time_y1]},
             'price_fit': {'a': a, 'b': b, 'resid_px': resid, **pinfo}, 'time_fit': {'a': ta, 'b': tb, **tinfo},
             'last_price_box': last, 'last_price_y': last_y, 'meta': meta}
    write(out_dir, sid, bars, walls, events, calib)
    calib_sheet(im, L, a, b, walls, os.path.join(out_dir, f'{sid}_calibration.png'))
    return sid, bars, walls, events

def video(mp4, seg_json, out_dir, every=0.5):
    meta = json.load(open(seg_json))
    t0 = dt.datetime.fromisoformat(meta['recorder_start_utc'].replace('Z', '+00:00'))
    cap = cv2.VideoCapture(mp4); fps = cap.get(cv2.CAP_PROP_FPS) or 60; n = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    samples, walls_seen, L = [], {}, None
    k = 0; step = max(1, int(round(every * fps))); last_cal = -1e9
    while True:
        ok = cap.grab()
        if not ok: break
        if k % step == 0:
            ok, fr = cap.retrieve(); t = k / fps
            if ok:
                im = V.rgb(fr)
                try:
                    if L is None or t - last_cal > 30:
                        L = V.Layout(im); a, b, resid, _ = V.price_axis(im, L); last_cal = t
                        for w in V.walls(im, L, a, b):
                            key = w['level']; walls_seen.setdefault(key, {**w, 'first_seen_s': t}); walls_seen[key]['last_seen_s'] = t
                    p, py = V.last_price_box(im, L)
                    py_price = round((a * py + b) / V.TICK) * V.TICK if py is not None else None
                    flag = None
                    if p is None or (py_price is not None and abs(p - py_price) > 0.5): p, flag = py_price, 'ocr mismatch: used box position'
                    wall_clock = t0 + dt.timedelta(seconds=t)
                    samples.append({'t_video_s': round(t, 3), 'utc': wall_clock.isoformat(), 'price': p, 'flag': flag})
                except Exception as ex:
                    samples.append({'t_video_s': round(t, 3), 'price': None, 'flag': 'unreadable: ' + str(ex)[:60]})
        k += 1
    # minute bars from samples (ET wall clock of the recording)
    bars = {}
    for s in samples:
        if s.get('price') is None or 'utc' not in s: continue
        e = dt.datetime.fromisoformat(s['utc']).astimezone(ET); m = e.hour * 60 + e.minute
        bb = bars.setdefault(m, {'minute_et': m, 'open': s['price'], 'high': s['price'], 'low': s['price'], 'close': s['price'], 'ok': True, 'source': 'last-price box', 't_video_first_s': s['t_video_s']})
        bb['high'] = max(bb['high'], s['price']); bb['low'] = min(bb['low'], s['price']); bb['close'] = s['price']; bb['t_video_last_s'] = s['t_video_s']
    bars = [bars[m] for m in sorted(bars)]
    walls = list(walls_seen.values())
    # a wall counts only from the moment it is on screen
    first = min((w['first_seen_s'] for w in walls), default=0)
    book_m = (t0 + dt.timedelta(seconds=first)).astimezone(ET); book_m = book_m.hour * 60 + book_m.minute
    events = EV.find_events(bars, walls, book_m, market=meta.get('instrument', 'ES'), date=meta['recorder_start_et'][:10])
    for e in events:
        e['video_file'] = os.path.basename(mp4)
        e['t_video_start_s'] = next((b['t_video_first_s'] for b in bars if b['minute_et'] == e['start_minute_et']), None)
        e['t_video_end_s'] = next((b.get('t_video_last_s') for b in bars if b['minute_et'] == e['end_minute_et']), None)
        e['data_quality'] = {'unreadable_samples': sum(1 for s in samples if s['price'] is None), 'samples': len(samples),
                             'ocr_mismatch': sum(1 for s in samples if s.get('flag', '') and 'mismatch' in s['flag']),
                             'recording_interruptions': meta.get('interruptions', [])}
    sid = os.path.splitext(os.path.basename(mp4))[0]
    write(out_dir, sid, bars, walls, events, {'mode': 'video', 'fps': fps, 'frames': n, 'sample_every_s': every}, {'samples': samples})
    return sid, bars, walls, events

if __name__ == '__main__':
    mode = sys.argv[1]
    if mode == 'still':
        sid, bars, walls, ev = still(sys.argv[2], sys.argv[3], sys.argv[4])
    else:
        every = float(sys.argv[sys.argv.index('--every') + 1]) if '--every' in sys.argv else 0.5
        sid, bars, walls, ev = video(sys.argv[2], sys.argv[3], sys.argv[4], every)
    print(f'{sid}: {sum(1 for b in bars if b["ok"])} bars, {len(walls)} walls, {len(ev)} events')
    for e in ev:
        print(f"  {e['id']} {'+'.join(e['type']):18s} {e['level']:>9} {e['wall_family']:8s} from {e['from']:5s} {e['start_et']} ET  outcome: {e['outcome']}  after15m={e['after_15m']}  read={e['score_readability']}")
