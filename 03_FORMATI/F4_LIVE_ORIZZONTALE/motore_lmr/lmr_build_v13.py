#!/usr/bin/env python3
"""VOLWICK · Live Market Reactions · v13 builder (cinematic, 22-30 s, SFX + SILENT exports).

  python3 lmr_build_v13.py <05_PROJECTS/<name>/spec.json> [--stills-only]

Same data path as lmr_build.py (bars read off the terminal, story numbers computed here), new timeline:
APPROACH -> CONTACT (slowed, light zoom) -> REACTION -> logo. The chart is drawn as vectors from the
real OHLC so it can fill the frame without upscaling blur. Every speed change is declared on screen.
"""
import sys, os, json, csv, subprocess, threading, http.server, socketserver, functools, datetime as dt, re
from zoneinfo import ZoneInfo
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); sys.path.insert(0, HERE)
from lmr_build import story, hm, fmtp, run

PLOT = {'x': 30, 'y': 520, 'w': 890, 'h': 1020}

def main(spec_path, stills_only=False):
    spec = json.load(open(spec_path)); pdir = os.path.dirname(os.path.abspath(spec_path))
    evdoc = json.load(open(os.path.join(ROOT, spec['events']))); ev = next(e for e in evdoc['events'] if e['id'] == spec['event_id'])
    cal = evdoc['calibration']; meta = cal['meta']; sid = evdoc['id']; evdir = os.path.join(ROOT, os.path.dirname(spec['events']))
    bars = []
    for r in csv.DictReader(open(os.path.join(evdir, f'{sid}_bars.csv'))):
        ok = r['ok'] == 'True'; bars.append({'minute_et': int(r['minute_et']), 'ok': ok, **({k: float(r[k]) for k in ('open', 'high', 'low', 'close')} if ok else {})})
    walls = json.load(open(os.path.join(evdir, f'{sid}_walls.json')))
    focus = next(w for w in walls if abs(w['level'] - ev['level']) < 0.01)
    bh, bmm = map(int, meta['book_time_et'].split(':')); book = bh * 60 + bmm
    S = story(bars, ev, book); day = dt.date.fromisoformat(meta['session_date'])
    mr = S['reach_minute_et']; mend = S['end_minute_et'] + 1

    # ---- timeline: cursor in ET minutes (bars before floor(cursor) are complete) ----
    def target(s):
        base, off = re.match(r'(reach|end|)([+-]\d+)?$', s).groups(); off = int(off or 0)
        return {'reach': mr, 'end': mend, '': None}[base] + off if base else cur + off
    K = [[0.0, book]]; seg = {}; t = 0.0; cur = book
    for name, to, how in spec['plan']:
        m1 = target(to); d = how['secs'] if 'secs' in how else (m1 - cur) * 60 / how['speed']
        assert m1 >= cur, f'{name}: time must only go forward'
        seg[name] = (round(t, 4), round(t + d, 4)); t += d; cur = m1; K.append([round(t, 4), m1])
    def t_of(c):
        for (a0, m0), (a1, m1) in zip(K, K[1:]):
            if m1 > m0 and m0 <= c <= m1: return a0 + (c - m0) / (m1 - m0) * (a1 - a0)
    E = {'touch': round(t_of(mr + 1), 3), 'approachHot0': seg['approach'][0], 'closeHold': seg['close_hold'][0]}
    E['band0'] = round(seg['reaction'][0] + 0.4, 3); E['reaction'] = round(seg['reaction'][0] + 0.9, 3)
    E['wall_draw'] = 0.05; E['logo0'] = round(t, 3); E['loop0'] = round(t + spec['ending_s'], 3); E['total'] = round(E['loop0'] + 0.3, 3)
    E['logo_flash'] = round(E['logo0'] + 1.5 / spec['logo_speed'], 3)

    # ---- camera: view windows from the real bars, the wall always inside ----
    by = {b['minute_et']: b for b in bars if b['ok']}
    def view(tk, m0, m1, pad=0.12):
        bs = [by[m] for m in range(int(m0), int(m1) + 1) if m in by]
        lo = min([b['low'] for b in bs] + [ev['level']]); hi = max([b['high'] for b in bs] + [ev['level']]); pd = (hi - lo) * pad
        return {'t': round(tk, 3), 'm0': m0, 'm1': m1, 'p0': lo - pd, 'p1': hi + pd}
    V = [view(0, book - 12, mend + 5), view(seg['approach'][1] - 1.2, book + 4, mend + 4),
         view(E['touch'] - 0.35, mr - 22, mr + 13, 0.16), view(seg['after_slow'][1], mr - 22, mr + 13, 0.16),
         view(seg['reaction'][1], mr - 30, mend + 4, 0.14), view(E['logo0'], mr - 30, mend + 4, 0.14)]
    for v in V: assert v['p0'] < ev['level'] < v['p1']

    C = spec['copy']; lvl = fmtp(ev['level'])
    def sub(x): return x.format(level=lvl, book=hm(book), after=S['minutes_after'], away=fmtp(S['max_away_after']))
    def fill(lines): return [[[sub(p[0]), p[1]] for p in ln] if isinstance(ln, list) and ln and isinstance(ln[0], list) else [[sub(ln[0]) if isinstance(ln, list) else sub(ln), 'ink']] for ln in lines]
    statements = [
        {'t0': 0.0, 't1': 3.3, 'lines': fill(C['hook']), 'stagger': [0, 1.15], 'size': 92},
        {'t0': 3.5, 't1': round(seg['approach'][1] - 0.6, 3), 'lines': fill(C['wall']), 'sub': sub(C['wall_sub']), 'size': 84},
        {'t0': round(E['touch'] - 0.03, 3), 't1': round(seg['after_slow'][1] + 0.3, 3), 'lines': fill(C['touch']), 'size': 96},
        {'t0': E['reaction'], 't1': round(E['logo0'] - 0.05, 3), 'lines': fill(C['reaction']), 'sub': sub(C['reaction_sub']), 'size': 84},
    ]
    project = {'session': {'ticker': ev['market'], 'local_minus_et_min': None},
               'layout': {'plot': PLOT}, 'book': {'minute_et': book, 'label': hm(book) + ' ET'}, 'story': S,
               'bars': [b for b in bars if b['ok']], 'focus_wall': focus,
               'timeline': {'remap': K, 'end_minute_et': mend, 'events': E, 'views': V, 'logo_speed': spec['logo_speed']},
               'texts': {'badge': spec['badge'], 'source_line': f"{ev['market']} · {day.strftime('%a %d %b').upper()}", 'statements': statements,
                         'disclaimer': spec['disclaimer']}, 'segments': seg}
    json.dump(project, open(os.path.join(pdir, 'project.json'), 'w'), indent=1); json.dump(E, open(os.path.join(pdir, 'events_timeline.json'), 'w'), indent=1)
    print('TIMELINE', json.dumps(seg), 'total', E['total'])

    # ---- render ----
    from playwright.sync_api import sync_playwright
    srv = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(type('Q', (http.server.SimpleHTTPRequestHandler,), {'log_message': lambda *a: None}), directory=ROOT))
    port = srv.server_address[1]; threading.Thread(target=srv.serve_forever, daemon=True).start()
    video = os.path.join(pdir, 'video.mp4'); fps = 60; rel = '/' + os.path.relpath(os.path.join(pdir, 'project.json'), ROOT)
    with sync_playwright() as p:
        br = p.chromium.launch(args=['--force-color-profile=srgb']); pg = br.new_page(viewport={'width': 1080, 'height': 1920}, device_scale_factor=1)
        pg.goto(f"http://127.0.0.1:{port}/08_AUTOMATION/scene/{spec['scene_html']}?p={rel}"); pg.wait_for_function('window.READY !== undefined', timeout=30000)
        cv = pg.locator('#c'); os.makedirs(os.path.join(pdir, 'stills'), exist_ok=True)
        for s_ in [0.0, 0.6, 1.6, 4.5, seg['approach'][1] - 0.3, E['touch'] - 0.2, E['touch'] + 0.1, E['touch'] + 0.5, seg['after_slow'][1] - 0.3,
                   E['reaction'] + 0.8, seg['close_hold'][1] - 0.2, E['logo0'] + 1.0, E['loop0'] - 0.3]:
            pg.evaluate(f'render({s_})'); cv.screenshot(path=os.path.join(pdir, 'stills', f't{s_:06.2f}.png'))
        if not stills_only:
            nf = int(round(E['total'] * fps))
            ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', str(fps), '-c:v', 'png', '-i', '-',
                                   '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-pix_fmt', 'yuv420p', '-r', str(fps), video], stdin=subprocess.PIPE)
            for f in range(nf):
                pg.evaluate(f'render({f / fps})'); ff.stdin.write(cv.screenshot(type='png'))
                if f % 300 == 0: print('frame', f, '/', nf, flush=True)
            ff.stdin.close(); ff.wait()
        br.close()
    srv.shutdown()
    if stills_only: return

    # ---- sound (effects only) and the two exports ----
    sfx = os.path.join(pdir, 'sfx.wav'); run(['python3', os.path.join(HERE, spec['sound_script']), os.path.join(pdir, 'events_timeline.json'), sfx])
    outdir = os.path.join(ROOT, '06_EXPORTS'); os.makedirs(outdir, exist_ok=True)
    f_sfx = os.path.join(outdir, spec['exports']['sfx']); f_sil = os.path.join(outdir, spec['exports']['silent'])
    venc = ['-c:v', 'libx264', '-preset', 'slower', '-tune', 'animation', '-crf', '10', '-g', '60', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-r', '60', '-movflags', '+faststart']
    run(['ffmpeg', '-y', '-loglevel', 'error', '-i', video, '-i', sfx, '-map', '0:v', '-map', '1:a'] + venc + ['-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-shortest', f_sfx])
    run(['ffmpeg', '-y', '-loglevel', 'error', '-i', video, '-map', '0:v', '-an'] + venc + [f_sil])
    review = {'exports': [os.path.relpath(f_sfx, ROOT), os.path.relpath(f_sil, ROOT)], 'duration_s': E['total'], 'fps': 60, 'format': '1080x1920',
              'status': 'INTERNAL · NOT FOR PUBLICATION (data licence gate open)',
              'source': {'kind': spec['source_kind'], 'file': spec['source'], 'gamma_status': meta.get('gamma_status')},
              'event': ev, 'story_numbers': S, 'wall_tooltip_on_recording': meta.get('tooltip_7672'),
              'speed_plan': [{'from_et': hm(m0), 'to_et': hm(m1), 'seconds': round(a1 - a0, 2), 'speed_x': round((m1 - m0) * 60 / (a1 - a0)) if m1 > m0 else 0}
                             for (a0, m0), (a1, m1) in zip(K, K[1:])],
              'statements': statements,
              'copy_note': 'THE LEVEL HELD. not used: after the touch price went 1.75 pts above the wall and closed 0.25 above it, so the level was not held as a ceiling. Used PRICE STAYED AT THE WALL. (16 min within 1.75 pts, to the 17:00 ET close).',
              'checks_to_do_by_human': ['Numbers on screen match the terminal.', 'Book of the wall (16:00 ET) older than the event.',
                                        'Speed and ET clock declared on screen; time order intact.', 'Data licence confirmed in writing before any publication.']}
    json.dump(review, open(os.path.join(outdir, 'Volwick_LMR_ES_2026-10-23_B_v13_review.json'), 'w'), indent=1, ensure_ascii=False)
    print('EXPORT', f_sfx, f_sil)

if __name__ == '__main__':
    main(sys.argv[1], '--stills-only' in sys.argv)
