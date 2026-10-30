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

    # ---- timeline v3 (~60 s, Power 25 Oct): hook, rewind, real-session context, what the wall is and why it can
    #      slow price, replay with an open question, slow touch, what happened, the message and its limit, logo ----
    sp = spec['speeds']; D = spec['durations']
    m0 = book_min; mr = S['reach_minute_et']; mend = S['end_minute_et'] + 1
    slow_a = max(m0 + 1, mr - sp.get('slow_before_min', 1)); slow_b = min(mend, mr + 1 + sp.get('slow_after_min', 1))
    t = 0.0; K = [[0, mr + 1]]; E = {}
    t += D['hook']; K.append([t, mr + 1]); E['hookOut'] = t
    t += D['rewind']; K.append([t, m0]); E['reveal0'] = t; E['setup0'] = t
    for k, d in enumerate(D['setup']): E[f'setup{k}'] = t; t += d
    K.append([t, m0]); E['approach0'] = t
    for name, (ma, mb, speed) in [('approach', (m0, slow_a, sp['fast'])), ('slow', (slow_a, slow_b, sp['slow'])), ('after', (slow_b, mend, sp['after']))]:
        E[name + '_start'] = t
        if mb > ma: t += (mb - ma) * 60 / speed; K.append([round(t, 4), mb])
    reveal_end = t
    fwd = K[K.index([E['approach0'], m0]):]
    def t_of_minute(m):
        for (ta_, ma), (tb_, mb) in zip(fwd, fwd[1:]):
            if ma <= m <= mb and mb > ma: return ta_ + (m - ma) / (mb - ma) * (tb_ - ta_)
        return fwd[-1][0]
    E['touch'] = round(t_of_minute(mr + 1), 3); E['after0'] = round(E['touch'] + 0.15, 3)
    E['payoff0'] = round(reveal_end + 0.2, 3); E['concl'] = E['payoff0']
    E['message0'] = round(E['payoff0'] + D['payoff'], 3)
    E['logo0'] = round(E['message0'] + sum(D['message']), 3); E['dv'] = E['logo0'] + 3.3
    E['loop0'] = round(E['logo0'] + D['ending'], 3); E['total'] = round(E['loop0'] + 0.4, 3)
    E['counter0'] = E[f'setup{len(D["setup"]) - 1}']
    E['mech0'], E['mech1'] = E['setup2'], E['setup3']
    E['candle_ticks'] = [round(t_of_minute(m), 3) for m in range(m0 + 1, mend + 1)]
    for k, d in enumerate(D['message']): E[f'msg{k}'] = round(E['message0'] + sum(D['message'][:k]), 3)

    focus = next(w for w in walls if abs(w['level'] - ev['level']) < 0.01)
    a, b = cal['price_fit']['a'], cal['price_fit']['b']; ta, tb = cal['time_fit']['a'], cal['time_fit']['b']
    cw, ch = x1 - x0, y1 - y0
    chart_w = 1080; chart_h = round(chart_w * ch / cw); chart_y = spec.get('chart_y', 520)
    reach_local = S['reach_minute_et'] + local_minus_et
    fx = (reach_local - tb) / ta - x0; fy = (ev['level'] - b) / a - y0
    wall_word = (spec.get('wall_word_color') or focus['family'])
    gam = 'long' if 'long' in focus['family_text'] else 'short'
    def cap(text, t0, t1): return {'words': text.split(' '), 't0': round(t0, 3), 't1': round(t1, 3)}
    def card(t0, t1, lines): return {'t0': round(t0, 3), 't1': round(t1, 3), 'lines': lines}
    day_label = day.strftime('%a %d %b %Y').upper()
    hr = lambda m: f"{(m // 60 - 1) % 12 + 1}:{m % 60:02d} {'PM' if m >= 720 else 'AM'}"
    texts = {
        'hook': spec['hook_lines'],
        'badge': spec.get('badge', 'REAL MARKET'),
        'source_line': f"{ev['market']} FUTURES · {day_label}",
        'cards': [
            card(E['setup0'], E['setup1'], [{'t': 'ES FUTURES', 's': 104, 'c': 'ink'}, {'t': f"{day_label} · {hr(m0)} ET", 's': 32, 'c': 'ink2', 'mono': 1}]),
            card(E['setup1'], E['setup2'], [{'t': 'DEALER WALL', 's': 40, 'c': wall_word, 'mono': 1}, {'t': fmtp(ev['level']), 's': 132, 'c': 'ink', 'mono': 1}]),
            card(E['setup2'], E['setup3'], [{'t': 'PRICE ▲  DEALERS SELL', 's': 58, 'c': 'red', 'mono': 1}, {'t': 'PRICE ▼  DEALERS BUY', 's': 58, 'c': 'green', 'mono': 1}]),
            card(E['msg0'], E['msg1'], [{'t': 'THE WALL', 's': 104, 'c': 'ink'}, {'t': 'ACTED LIKE A CEILING.', 's': 76, 'c': 'gold'}]),
            card(E['msg1'], E['msg2'], [{'t': f"{gam.upper()} GAMMA HEDGING", 's': 54, 'c': 'ink'}, {'t': 'CAN DAMPEN MOVES', 's': 54, 'c': 'green' if gam == 'long' else 'red'}]),
            card(E['msg2'], E['logo0'], [{'t': 'NO WALL IS GUARANTEED.', 's': 56, 'c': 'ink'}, {'t': 'IT SHOWS WHERE TO LOOK.', 's': 56, 'c': 'blue'}]),
        ],
        'captions': [
            cap("A REAL SESSION.|THE LAST HOUR OF ES.", E['setup0'] + 0.2, E['setup1'] - 0.1),
            cap("VOLWICK DRAWS|A DEALER WALL HERE.", E['setup1'] + 0.2, E['setup2'] - 0.1),
            cap(f"{gam.upper()} GAMMA:|DEALERS HEDGE|AGAINST THE MOVE.", E['setup2'] + 0.2, E['setup3'] - 0.1),
            cap(f"PRICE STARTS|{fmtp(S['dist_at_book'])} POINTS BELOW.", E['setup3'] + 0.2, E['approach0'] - 0.1),
            cap("WATCH IT CLIMB.|WILL IT BREAK THROUGH?", E['approach0'] + 0.3, E['touch'] - 2.4),
            cap(f"{hm(mr)} ET.|TOUCH.", E['touch'] - 1.6, E['touch'] + 1.6),
            cap("THEN THE CLIMB|STOPS.", E['touch'] + 1.8, E['payoff0'] - 0.1),
            cap(f"{S['minutes_after']} MINUTES|AT THE WALL.", E['payoff0'] + 0.3, E['message0'] - 0.1),
            cap("IT CAME UP TO IT|AND WENT FLAT.", E['msg0'] + 0.3, E['msg1'] - 0.1),
            cap("THAT'S WHAT|DEALER POSITIONING|CAN LOOK LIKE.", E['msg1'] + 0.3, E['msg2'] - 0.1),
            cap("SEE IT LIVE|ON VOLWICK.", E['msg2'] + 0.3, E['logo0'] - 0.1),
        ],
        'caption_keys': [["WALL.", wall_word], ["WALL", wall_word], ["CLIMB.", "green"], ["TOUCH.", "gold"], ["STOPS.", "gold"], ["HERE.", wall_word], ["FLAT.", "gold"], ["THROUGH?", "gold"], ["LIVE", "red"]],
        'payoff_kicker': f"{hm(mr)} → {hm(S['end_minute_et'] + 1)} ET",
        'payoff_label': 'MAX POINTS FROM THE WALL',
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
        'story': S,
        'layers': {'base': '/' + os.path.relpath(os.path.join(lay, 'base.png'), ROOT), 'candles': '/' + os.path.relpath(os.path.join(lay, 'candles.png'), ROOT)},
        'bars': bars, 'walls': walls, 'focus_wall': focus,
        'timeline': {'remap': K, 'end_minute_et': mend, 'events': E,
                     'camera': [{'t': 0, 's': cam['hook']}, {'t': E['hookOut'], 's': cam['hook'] + 0.04}, {'t': E['reveal0'], 's': cam['full']},
                                {'t': E['setup1'], 's': cam['full']}, {'t': E['setup1'] + 1.2, 's': cam['wall']}, {'t': E['setup3'], 's': cam['wall'] + 0.05},
                                {'t': E['approach0'], 's': cam['full']}, {'t': E['touch'], 's': cam['touch']}, {'t': reveal_end, 's': cam['after']},
                                {'t': E['message0'], 's': cam['after']}, {'t': E['logo0'], 's': cam['after'] - 0.04}]},
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
        pg.goto(f'http://127.0.0.1:{port}/08_AUTOMATION/scene/index.html?p={rel}')
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
        stills = spec.get('sheet_times') or [0.0, E['setup0'] + 1.5, E['setup1'] + 2.0, E['setup2'] + 2.0, E['setup3'] + 1.5, E['approach0'] + 4.0, E['touch'] + 0.05, E['payoff0'] + 1.5, E['msg0'] + 1.5, E['msg1'] + 1.5, E['msg2'] + 1.5, E['logo0'] + 4.0]
        os.makedirs(os.path.join(pdir, 'stills'), exist_ok=True)
        for s_ in stills:
            pg.evaluate(f'render({s_})'); cv.screenshot(path=os.path.join(pdir, 'stills', f't{s_:06.2f}.png'))
        br.close()
    srv.shutdown()

    # ---- sound + mix + export ----
    sfx = os.path.join(pdir, 'sfx.wav'); run(['python3', os.path.join(HERE, 'lmr_sound.py'), os.path.join(pdir, 'events_timeline.json'), sfx])
    outdir = os.path.join(ROOT, '06_EXPORTS'); os.makedirs(outdir, exist_ok=True)
    name = f"Volwick_LMR_{ev['market']}_{meta['session_date']}_{spec['version']}_v{spec['iteration']}_INTERNAL"
    final = os.path.join(outdir, name + '.mp4'); dur = E['total']
    voice = spec.get('voice')
    if voice:
        filt = (f"[1:a]aresample=48000,adelay={int(voice.get('at', 0) * 1000)}|{int(voice.get('at', 0) * 1000)},apad=whole_dur={dur},highpass=f=80,"
                "acompressor=threshold=-20dB:ratio=3:attack=5:release=120,asplit=2[vo][sc];[0:a]volume=0.55[bed];"
                "[bed][sc]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=350[duck];[duck][vo]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=8[a]")
        run(['ffmpeg', '-y', '-loglevel', 'error', '-i', sfx, '-i', os.path.join(ROOT, voice['file']), '-filter_complex', filt, '-map', '[a]', '-ar', '48000', os.path.join(pdir, 'mix.wav')])
    else:
        run(['ffmpeg', '-y', '-loglevel', 'error', '-i', sfx, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=8', '-ar', '48000', os.path.join(pdir, 'mix.wav')])
    # two-pass loudness: measure, then gain + limiter to -14 LUFS / about -1.3 dBTP
    mixw = os.path.join(pdir, 'mix.wav')
    meas = subprocess.run(['ffmpeg', '-hide_banner', '-i', mixw, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    import re as _re
    I = float(_re.findall(r'I:\s+(-?[\d.]+) LUFS', meas)[-1]); gain = -14.0 - I
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
