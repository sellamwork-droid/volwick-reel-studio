#!/usr/bin/env python3
"""VOLWICK · Live Market Reactions · from a detected event to a vertical Reel.

  python3 lmr_build.py <05_PROJECTS/<name>/spec.json>

The spec names the source (still of the terminal or recorded segment), the events file, the event id
and the version (A voice, B no voice). Every number shown on screen is computed here from the bars the
detector read off the terminal, and written to review.json next to the export for the human check.
"""
import sys, os, json, csv, math, subprocess, shutil, threading, http.server, socketserver, functools, datetime as dt
from zoneinfo import ZoneInfo

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
import lmr_layers

def hm(m): return '%02d:%02d' % divmod(int(m), 60)
def fmtp(x): return f'{x:,.2f}'
def run(cmd, **kw): print('$', ' '.join(cmd) if isinstance(cmd, list) else cmd, flush=True); subprocess.run(cmd, check=True, **kw)

def story(bars, ev, book_min):
    """Numbers for the texts, all from the bars. Price comes to the wall from one side."""
    L = ev['level']; frm = ev['from']
    after_book = [b for b in bars if b['ok'] and b['minute_et'] >= book_min]
    # at the book time the last complete minute on screen is the one before it
    start = next(b for b in bars if b['ok'] and b['minute_et'] == book_min - 1)
    reach = next(b for b in after_book if (b['high'] >= L if frm == 'below' else b['low'] <= L))
    end = after_book[-1]
    post = [b for b in after_book if b['minute_et'] >= reach['minute_et']]
    max_above = max(b['high'] for b in post) - L; max_below = L - min(b['low'] for b in post)
    return {'level': L, 'from': frm, 'book_minute_et': book_min, 'start_close': start['close'],
            'dist_at_book': round(L - start['close'], 2) if frm == 'below' else round(start['close'] - L, 2),
            'reach_minute_et': reach['minute_et'], 'minutes_to_reach': reach['minute_et'] - book_min,
            'end_minute_et': end['minute_et'], 'minutes_after': end['minute_et'] - reach['minute_et'] + 1,
            'max_above_after': round(max_above, 2), 'max_below_after': round(max_below, 2),
            'max_away_after': round(max(max_above, max_below), 2), 'end_close': end['close'],
            'end_vs_level': round(end['close'] - L, 2)}

def main(spec_path):
    spec = json.load(open(spec_path)); pdir = os.path.dirname(os.path.abspath(spec_path))
    evdoc = json.load(open(os.path.join(ROOT, spec['events'])))
    ev = next(e for e in evdoc['events'] if e['id'] == spec['event_id'])
    cal = evdoc['calibration']; meta = cal['meta']
    sid = evdoc['id']
    bars = []
    with open(os.path.join(ROOT, os.path.dirname(spec['events']), f'{sid}_bars.csv')) as f:
        for r in csv.DictReader(f):
            ok = r['ok'] == 'True'
            bars.append({'minute_et': int(r['minute_et']), 'ok': ok, **({k: float(r[k]) for k in ('open', 'high', 'low', 'close')} if ok else {})})
    walls = json.load(open(os.path.join(ROOT, os.path.dirname(spec['events']), f'{sid}_walls.json')))
    bh, bmm = map(int, meta['book_time_et'].split(':')); book_min = bh * 60 + bmm
    S = story(bars, ev, book_min)
    # time zones: the chart axis is in the browser zone, the reel speaks ET
    day = dt.date.fromisoformat(meta['session_date'])
    loc = dt.datetime.combine(day, dt.time(12), ZoneInfo(meta['browser_tz'])); et = loc.astimezone(ZoneInfo('America/New_York'))
    local_minus_et = int((loc.utcoffset() - et.utcoffset()).total_seconds() // 60)

    # ---- layers (still replay) ----
    x0, y0, x1, y1 = spec['crop']
    lay = os.path.join(pdir, 'layers'); os.makedirs(lay, exist_ok=True)
    lmr_layers.main(os.path.join(ROOT, spec['source']), [x0, y0, x1, y1], lay, os.path.join(ROOT, os.path.dirname(spec['events']), f'{sid}_walls.json'))

    # ---- timeline v4 minimal (Power, 25 Oct night): one text at a time, faster candles, instant replay, ~55 s ----
    sp = spec['speeds']; D = spec['durations']
    m0 = book_min; mr = S['reach_minute_et']; mend = S['end_minute_et'] + 1
    slow_a = max(m0 + 1, mr - 1); slow_b = min(mend, mr + 2)
    rp0 = max(m0, mr - sp.get('replay_before_min', 6))
    t = 0.0; K = [[0.0, mr + 1]]; E = {}; seg_t = {}
    def hold(name, minute, d):
        nonlocal_t[0] += d; K.append([round(nonlocal_t[0], 4), minute]); seg_t[name] = (round(nonlocal_t[0] - d, 4), round(nonlocal_t[0], 4))
    def move(name, ma, mb, speed=None, secs=None):
        d = secs if secs is not None else (mb - ma) * 60 / speed
        nonlocal_t[0] += d; K.append([round(nonlocal_t[0], 4), mb]); seg_t[name] = (round(nonlocal_t[0] - d, 4), round(nonlocal_t[0], 4))
    nonlocal_t = [0.0]
    hold('hook', mr + 1, D['hook'])
    move('rewind', mr + 1, m0, secs=D['rewind'])
    hold('ctx', m0, D['ctx']); hold('wall', m0, D['wall']); hold('meaning', m0, D['meaning'])
    move('approach', m0, slow_a, sp['fast']); move('touch', slow_a, slow_b, sp['slow']); move('after', slow_b, mend, sp['fast'])
    hold('stop', mend, D['stop']); hold('payoff', mend, D['payoff'])
    move('replay_rw', mend, rp0, secs=D['replay_rewind']); move('replay', rp0, mend, sp['replay'])
    hold('message', mend, D['message']); hold('limit', mend, D['limit'])
    t = nonlocal_t[0]
    def t_fwd(seg, m):
        (ta_, tb_) = seg_t[seg]; i = [k for k in range(len(K)) if abs(K[k][0] - tb_) < 1e-6][0]
        ma, mb = K[i - 1][1], K[i][1]; return ta_ + (m - ma) / (mb - ma) * (tb_ - ta_)
    E = {'hookOut': seg_t['hook'][1], 'reveal0': seg_t['rewind'][1], 'touch': round(t_fwd('touch', mr + 1), 3)}
    E['after0'] = round(E['touch'] + 0.1, 3); E['concl'] = seg_t['payoff'][0]; E['payoff0'] = seg_t['payoff'][0]
    E['replay_touch'] = round(t_fwd('replay', mr + 1), 3)
    E['logo0'] = round(t, 3); E['dv'] = E['logo0'] + 3.3; E['loop0'] = round(t + D['ending'], 3); E['total'] = round(E['loop0'] + 0.4, 3)
    E['candle_ticks'] = []
    reveal_end = seg_t['after'][1]

    focus = next(w for w in walls if abs(w['level'] - ev['level']) < 0.01)
    a, b = cal['price_fit']['a'], cal['price_fit']['b']; ta, tb = cal['time_fit']['a'], cal['time_fit']['b']
    cw, ch = x1 - x0, y1 - y0
    chart_w = 1080; chart_h = round(chart_w * ch / cw); chart_y = spec.get('chart_y', 560)
    reach_local = S['reach_minute_et'] + local_minus_et
    fx = (reach_local - tb) / ta - x0; fy = (ev['level'] - b) / a - y0
    wc = focus['family']
    def st_(seg, lines, sub=None, size=76, until=None):
        t0, t1 = seg_t[seg] if isinstance(seg, str) else seg
        return {'t0': round(t0, 3), 't1': round(until if until is not None else t1, 3), 'lines': lines, 'sub': sub, 'size': size}
    day_label = day.strftime('%a %d %b').upper()
    C = spec['copy']
    texts = {
        'badge': spec.get('badge', 'REAL MARKET'),
        'source_line': f"{ev['market']} · {day_label}",
        'statements': [
            st_('hook', C['hook'], size=88),
            st_('ctx', C['ctx'], sub=f"{ev['market']} FUTURES · {day.strftime('%d %b %Y').upper()} · {hm(m0)} ET"),
            st_('wall', [[C['wall'][0], 'ink']], sub=None) | {'lines': [C['wall'][0], [[fmtp(ev['level']), wc]]]},
            st_('meaning', C['meaning']),
            st_((seg_t['approach'][0], E['touch'] - 0.25), [[['{d}', 'gold'], [' POINTS TO GO', 'ink']]], size=76),
            st_((E['touch'] - 0.25, seg_t['after'][1]), [[[f"{hm(mr)} ET · ", 'ink'], ['TOUCH.', 'gold']]]),
            st_('stop', C['stop']),
            st_('payoff', [f"{S['minutes_after']} MINUTES.", [["NEVER MORE THAN ", 'ink'], [f"{fmtp(S['max_away_after'])} PTS", 'gold']], "FROM THE WALL."], size=68),
            st_((seg_t['replay_rw'][0], seg_t['replay'][1]), C['replay']),
            st_('message', C['message']),
            st_('limit', C['limit']),
        ],
        'disclaimer': spec.get('disclaimer', 'Recorded market data. Not investment advice.'),
    }
    cam = spec.get('camera', {'hook': 1.16, 'full': 1.0, 'touch': 1.2, 'after': 1.14})
    project = {
        'session': {'ticker': ev['market'], 'date_label': day.strftime('%d %b %Y').upper(), 'local_minus_et_min': local_minus_et},
        'crop': {'x0': x0, 'y0': y0, 'w': cw, 'h': ch},
        'map': {'pa': a, 'pb': b, 'ta': ta, 'tb': tb},
        'layout': {'chart': {'x': 0, 'y': chart_y, 'w': chart_w, 'h': chart_h}, 'focus': {'x': fx, 'y': fy},
                   'axis_w': x1 - cal['layout']['axis_x'][0]},
        'book': {'minute_et': book_min, 'label': hm(book_min) + ' ET'},
        'story': S, 'segments': seg_t,
        'layers': {'base': '/' + os.path.relpath(os.path.join(lay, 'base.png'), ROOT), 'candles': '/' + os.path.relpath(os.path.join(lay, 'candles.png'), ROOT)},
        'bars': bars, 'walls': walls, 'focus_wall': focus,
        'timeline': {'remap': K, 'end_minute_et': mend, 'events': E,
                     'camera': [{'t': 0, 's': cam['hook']}, {'t': E['hookOut'], 's': cam['hook']}, {'t': E['reveal0'], 's': cam['full']},
                                {'t': seg_t['meaning'][1], 's': cam['full']}, {'t': E['touch'], 's': cam['touch']}, {'t': seg_t['payoff'][1], 's': cam['touch']},
                                {'t': seg_t['replay_rw'][1], 's': cam['replay']}, {'t': seg_t['replay'][1], 's': cam['replay']}, {'t': E['logo0'], 's': cam['touch']}]},
        'texts': texts}
    json.dump(project, open(os.path.join(pdir, 'project.json'), 'w'), indent=1)
    json.dump(E, open(os.path.join(pdir, 'events_timeline.json'), 'w'), indent=1)

    # ---- render (deterministic, 60 fps) ----
    from playwright.sync_api import sync_playwright
    srv = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(type('Q', (http.server.SimpleHTTPRequestHandler,), {'log_message': lambda *a: None}), directory=ROOT))
    port = srv.server_address[1]; threading.Thread(target=srv.serve_forever, daemon=True).start()
    silent = os.path.join(pdir, 'silent.mp4'); fps = 60
    rel = '/' + os.path.relpath(os.path.join(pdir, 'project.json'), ROOT)
    with sync_playwright() as p:
        br = p.chromium.launch(args=['--force-color-profile=srgb'])
        pg = br.new_page(viewport={'width': 1080, 'height': 1920}, device_scale_factor=1)
        pg.goto(f"http://127.0.0.1:{port}/08_AUTOMATION/scene/{spec.get('scene_html', 'index.html')}?p={rel}")
        pg.wait_for_function('window.READY !== undefined', timeout=30000)
        print('READY', pg.evaluate('JSON.stringify(window.READY.check)'))
        nf = int(E['total'] * fps)
        ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', str(fps), '-c:v', 'mjpeg', '-i', '-',
                               '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-r', str(fps), silent], stdin=subprocess.PIPE)
        cv = pg.locator('#c')
        for f in range(nf):
            pg.evaluate(f'render({f / fps})'); ff.stdin.write(cv.screenshot(type='jpeg', quality=95))
            if f % 300 == 0: print('frame', f, '/', nf, flush=True)
        ff.stdin.close(); ff.wait()
        stills = spec.get('sheet_times') or [0.0] + [round((v[0] + v[1]) / 2, 2) for k, v in seg_t.items() if k not in ('hook',)] + [E['logo0'] + 4.0]
        os.makedirs(os.path.join(pdir, 'stills'), exist_ok=True)
        for s_ in stills:
            pg.evaluate(f'render({s_})'); cv.screenshot(path=os.path.join(pdir, 'stills', f't{s_:06.2f}.png'))
        br.close()
    srv.shutdown()

    # ---- sound + mix + export ----
    sfx = os.path.join(pdir, 'sfx.wav'); run(['python3', os.path.join(HERE, spec.get('sound_script', 'lmr_sound.py')), os.path.join(pdir, 'events_timeline.json'), sfx])
    outdir = os.path.join(ROOT, '06_EXPORTS'); os.makedirs(outdir, exist_ok=True)
    name = f"Volwick_LMR_{ev['market']}_{meta['session_date']}_{spec['version']}_v{spec['iteration']}_INTERNAL"
    final = os.path.join(outdir, name + '.mp4'); dur = E['total']
    voice = spec.get('voice')
    if voice:
        filt = (f"[1:a]aresample=48000,adelay={int(voice.get('at', 0) * 1000)}|{int(voice.get('at', 0) * 1000)},apad=whole_dur={dur},highpass=f=80,"
                "acompressor=threshold=-20dB:ratio=3:attack=5:release=120,asplit=2[vo][sc];[0:a]volume=0.55[bed];"
                "[bed][sc]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=350[duck];[duck][vo]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=8[a]")
        run(['ffmpeg', '-y', '-loglevel', 'error', '-i', sfx, '-i', os.path.join(ROOT, voice['file']), '-filter_complex', filt, '-map', '[a]', '-ar', '48000', os.path.join(pdir, 'mix.wav')])
    elif spec.get('audio') == 'quiet':
        run(['ffmpeg', '-y', '-loglevel', 'error', '-i', sfx, '-ar', '48000', os.path.join(pdir, 'mix.wav')])
    else:
        run(['ffmpeg', '-y', '-loglevel', 'error', '-i', sfx, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=8', '-ar', '48000', os.path.join(pdir, 'mix.wav')])
    # two-pass loudness: measure, then gain + limiter to -14 LUFS / about -1.3 dBTP
    mixw = os.path.join(pdir, 'mix.wav')
    meas = subprocess.run(['ffmpeg', '-hide_banner', '-i', mixw, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    import re as _re
    I = float(_re.findall(r'I:\s+(-?[\d.]+) LUFS', meas)[-1]); gain = (-14.0 - I) if spec.get('audio') != 'quiet' else 0.0
    run(['ffmpeg', '-y', '-loglevel', 'error', '-i', mixw, '-af', f'volume={gain:.2f}dB,alimiter=limit=0.84:level=false', '-ar', '48000', mixw.replace('.wav', '_n.wav')])
    os.replace(mixw.replace('.wav', '_n.wav'), mixw)
    run(['ffmpeg', '-y', '-loglevel', 'error', '-i', silent, '-i', os.path.join(pdir, 'mix.wav'), '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'slow',
         '-crf', '18', '-maxrate', '7M', '-bufsize', '14M', '-pix_fmt', 'yuv420p', '-r', '60', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', final])
    size = os.path.getsize(final) / 1e6

    # ---- review sheet for the human check ----
    review = {'export': os.path.relpath(final, ROOT), 'size_mb': round(size, 2), 'duration_s': dur, 'fps': 60, 'format': '1080x1920',
              'status': 'INTERNAL · NOT FOR PUBLICATION (data licence gate open)',
              'source': {'kind': spec['source_kind'], 'file': spec['source'], 'capture': meta.get('capture_method'), 'terminal_settings': meta.get('terminal_settings'),
                         'gamma_status': meta.get('gamma_status')},
              'event': ev, 'story_numbers': S,
              'on_screen_numbers': {'wall_level': ev['level'], 'wall_family_text': focus['family_text'], 'book_time': hm(book_min) + ' ET',
                                    'distance_at_book_pts': S['dist_at_book'], 'reach_time_et': hm(S['reach_minute_et']),
                                    'max_away_after_pts': S['max_away_after'], 'end_time_et': hm(S['end_minute_et'])},
              'speed_plan': [{'from_et': hm(ma), 'to_et': hm(mb), 'seconds': round(tb_ - ta_, 2), 'speed_x': round((mb - ma) * 60 / (tb_ - ta_)) if tb_ > ta_ else 0}
                             for (ta_, ma), (tb_, mb) in zip(K, K[1:])],
              'texts': texts, 'checks_to_do_by_human': [
                  'Numbers on screen match the terminal (see story_numbers and the recording).',
                  'The book of the wall is older than the event (book 16:00 ET, event after).',
                  'Speed and ET clock declared on screen; time order intact; no minute skipped or repeated.',
                  'Hook and conclusion describe only what is visible.',
                  'Data licence for public use confirmed in writing before any publication.']}
    json.dump(review, open(os.path.join(outdir, name + '_review.json'), 'w'), indent=1, ensure_ascii=False)
    print('EXPORT', final, f'{size:.1f} MB', f'{dur:.2f} s')
    return final

if __name__ == '__main__':
    main(sys.argv[1])
