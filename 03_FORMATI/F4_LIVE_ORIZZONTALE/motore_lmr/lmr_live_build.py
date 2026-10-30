#!/usr/bin/env python3
"""VOLWICK · Live Market Reactions · LIVE builder: a vertical Reel cut from the real recording of the terminal.

  python3 lmr_live_build.py <05_PROJECTS/<name>/spec.json> [--stills-only] [--skip-extract]

The footage is the canvas capture of the Volwick chart made in the page during the session (02_RECORDINGS).
Each section maps an ET interval of the recording to an output duration (speed declared on screen, time
order kept, x1 = real time). Frames are extracted with ffmpeg, the scene draws them with a light camera and
adds only text, the ET clock, the declared speed and a few marks on the protagonist wall.
"""
import sys, os, json, glob, re, subprocess, threading, http.server, socketserver, functools, shutil
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
FPS = 60
def run(cmd): print('$', ' '.join(cmd)[:220], flush=True); subprocess.run(cmd, check=True)
def secs(s): h, m, x = s.split(':'); return int(h) * 3600 + int(m) * 60 + float(x)
def hms(t): t = int(round(t)); return '%02d:%02d:%02d' % (t // 3600, t % 3600 // 60, t % 60)

def main(spec_path, stills_only=False, skip_extract=False):
    spec = json.load(open(spec_path)); pdir = os.path.dirname(os.path.abspath(spec_path))
    idx = json.load(open(os.path.join(ROOT, spec['index'])))
    def off(et):  # ET seconds -> offset in the concatenated recording
        seg = [s for s in idx if s['start_et_s'] <= et][-1]
        return seg['offset'] + min(et - seg['start_et_s'], seg['dur'] - 0.05)
    # ---- DOM samples (price every 5 s) and wall label read off the footage every second ----
    samples = []
    for f in sorted(glob.glob(os.path.join(ROOT, spec['samples_glob']))):
        for s in json.load(open(f))['samples']:
            t = s['text']
            if len(t) > 3 and re.match(r'^7,\d{3}\.\d\d$', t[3]): samples.append([secs(s['et'][11:19]), float(t[3].replace(',', ''))])
    ocr = json.load(open(os.path.join(ROOT, spec['wall_ocr'])))
    wall = []; last_lvl = None
    for t, y, txt in ocr:
        m = re.search(r'7,?(76\d)(?:\.(\d{1,2}))?', txt or '')
        if m: last_lvl = float('7' + m.group(1) + '.' + (m.group(2) or '0'))
        if y is not None: wall.append([t, y, last_lvl])
    # smooth the wall y (median of 5 s)
    ys = [w[1] for w in wall]
    for i in range(len(wall)): wall[i][1] = sorted(ys[max(0, i - 2):i + 3])[len(ys[max(0, i - 2):i + 3]) // 2]

    # ---- sections ----
    S = []; t = 0.0
    for name, a, b, d in spec['sections']:
        sec = {'name': name, 't0': round(t, 4), 't1': round(t + d, 4), 'n': int(round(d * FPS))}
        if a: sec.update({'et0': secs(a), 'et1': secs(b), 'speed': round((secs(b) - secs(a)) / d, 2)})
        S.append(sec); t += d
    total = round(t, 4); E = {s['name']: s for s in S}
    def t_of_et(name, et): s = E[name]; return s['t0'] + (et - s['et0']) / (s['et1'] - s['et0']) * (s['t1'] - s['t0'])
    hi = spec['high']; t_hi_live = round(t_of_et('live', secs(hi['et'])), 3); t_hi_hook = round(t_of_et('hook', secs(hi['et'])), 3)

    # ---- frames ----
    fdir = os.path.join(pdir, 'frames'); src = os.path.join(ROOT, spec['source'])
    x0, y0, x1, y1 = spec['region_css']; cw, ch = (x1 - x0) * 2, (y1 - y0) * 2
    if not skip_extract:
        shutil.rmtree(fdir, ignore_errors=True); os.makedirs(fdir)
        procs = []
        for s in S:
            if 'et0' not in s: continue
            o0 = off(s['et0']); dur_src = s['et1'] - s['et0']; k = dur_src / (s['t1'] - s['t0'])
            vf = f"setpts=(PTS-STARTPTS)/{k:.6f},fps={FPS},crop={cw}:{ch}:{x0 * 2}:{y0 * 2}"
            cmd = ['ffmpeg', '-loglevel', 'error', '-y', '-ss', f'{o0:.3f}', '-i', src, '-t', f'{dur_src + 2:.3f}', '-vf', vf, '-frames:v', str(s['n']), '-q:v', '2',
                   os.path.join(fdir, s['name'] + '_%05d.jpg')]
            print('$', ' '.join(cmd)[:200], flush=True); procs.append(subprocess.Popen(cmd))
        for p in procs: p.wait()
        for s in S:
            if 'et0' in s:
                got = len(glob.glob(os.path.join(fdir, s['name'] + '_*.jpg'))); print(s['name'], got, '/', s['n']); s['n'] = got

    # ---- texts ----
    def st(t0, t1, lines, sub=None, size=74): return {'t0': round(t0, 3), 't1': round(t1, 3), 'lines': lines, 'sub': sub, 'size': size}
    h = E['hook']; hm_ = (h['t0'] + h['t1']) / 2
    t_306 = t_of_et('s4', secs('11:09:06'))
    statements = [
        st(0, hm_, [['BIGGEST ', 'ink', 'WALL', 'wall'], ['ON THE CHART.', 'ink']], size=84),
        st(hm_, h['t1'], [['PRICE STOPPED', 'ink'], ['1.75 PTS ', 'gold', 'SHORT.', 'gold']], size=84),
        st(E['rewind']['t1'], E['s3']['t1'], [['10:33 ET.', 'ink'], ['THE WALL: ', 'ink', '+$11.0M', 'wall']]),
        st(E['s4']['t0'], t_306 - 0.05, [['PRICE CLIMBED.', 'ink'], ['THE WALL GREW.', 'wall']]),
        st(t_306, E['s5']['t0'] + 2.2, [['IT REACHED', 'ink'], ['+$30.6M.', 'wall']]),
        st(E['s5']['t0'] + 2.2, E['s5']['t1'], [['{d} PTS', 'gold'], ['TO THE WALL.', 'ink']]),
        st(E['live']['t0'], t_hi_live - 0.05, [['REAL TIME.', 'ink'], ['NO SPEED-UP.', 'ink2']]),
        st(t_hi_live, E['live']['t1'], [['1.75 PTS', 'gold'], ['SHORT.', 'gold']], size=96),
        st(E['s7']['t0'], E['s7']['t1'], [['IT NEVER', 'ink'], ['TOUCHED IT.', 'ink']], sub='UNTIL 11:33 ET · END OF RECORDING'),
    ]
    C = spec['cams']; W, M, Z = C['W'], C['M'], C['Z']
    cams = [[0, M], [h['t1'], Z], [E['rewind']['t0'] + 0.3, W], [E['s5']['t0'], W], [E['s5']['t1'], Z], [E['live']['t1'], Z], [E['s7']['t1'], M], [total, M]]
    ev = {'total': round(total + 0.3, 3), 'logo0': E['end']['t0'], 'loop0': total, 'hook_hi': t_hi_hook, 'touch': t_hi_live,
          'reaction': E['s7']['t0'], 'wall_draw': 0.05, 'logo_flash': round(E['end']['t0'] + 1.5 / 1.8, 3)}
    project = {'sections': S, 'total': total, 'events': ev, 'region': spec['region_css'], 'ppt': spec['ppt_css'], 'high': hi,
               'samples': samples, 'wall': wall, 'statements': statements, 'cams': cams,
               'texts': {'badge': spec['badge'], 'source_line': spec['source_line'], 'disclaimer': spec['disclaimer']}, 'frames': '/' + os.path.relpath(fdir, ROOT)}
    json.dump(project, open(os.path.join(pdir, 'project.json'), 'w')); json.dump(ev, open(os.path.join(pdir, 'events_timeline.json'), 'w'), indent=1)
    print('SECTIONS', [(s['name'], s['t0'], s['t1'], s.get('speed')) for s in S], 'total', total)

    # ---- render ----
    from playwright.sync_api import sync_playwright
    srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), functools.partial(type('Q', (http.server.SimpleHTTPRequestHandler,), {'log_message': lambda *a: None}), directory=ROOT))
    port = srv.server_address[1]; threading.Thread(target=srv.serve_forever, daemon=True).start()
    video = os.path.join(pdir, 'video.mp4'); rel = '/' + os.path.relpath(os.path.join(pdir, 'project.json'), ROOT)
    with sync_playwright() as p:
        br = p.chromium.launch(args=['--force-color-profile=srgb']); pg = br.new_page(viewport={'width': 1080, 'height': 1920}, device_scale_factor=1)
        pg.goto(f"http://127.0.0.1:{port}/08_AUTOMATION/scene/index_live.html?p={rel}"); pg.wait_for_function('window.READY !== undefined', timeout=60000)
        cv = pg.locator('#c'); os.makedirs(os.path.join(pdir, 'stills'), exist_ok=True)
        for s_ in [0.2, 2.0, 3.9, 4.8, 7.0, 13.0, 18.6, 24.0, 28.0, t_hi_live + 0.2, 37.0, 42.0, ev['logo0'] + 1.0, ev['loop0'] - 0.2]:
            pg.evaluate(f'render({s_})'); cv.screenshot(path=os.path.join(pdir, 'stills', f't{s_:06.2f}.png'))
        if not stills_only:
            nf = int(round(ev['total'] * FPS))
            ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', str(FPS), '-c:v', 'png', '-i', '-',
                                   '-c:v', 'libx264', '-preset', 'slow', '-crf', '12', '-pix_fmt', 'yuv420p', '-r', str(FPS), video], stdin=subprocess.PIPE)
            for f in range(nf):
                pg.evaluate(f'render({f / FPS})'); ff.stdin.write(cv.screenshot(type='png'))
                if f % 300 == 0: print('frame', f, '/', nf, flush=True)
            ff.stdin.close(); ff.wait()
        br.close()
    srv.shutdown()
    if stills_only: return
    sfx = os.path.join(pdir, 'sfx.wav'); run(['python3', os.path.join(HERE, 'lmr_sound_live.py'), os.path.join(pdir, 'events_timeline.json'), sfx])
    outdir = os.path.join(ROOT, '06_EXPORTS'); base = f"Volwick_LMR_ES_2026-10-27_LIVE_v{spec['iteration']}"
    f_sfx = os.path.join(outdir, base + '_SFX.mp4'); f_sil = os.path.join(outdir, base + '_SILENT.mp4')
    venc = ['-c:v', 'libx264', '-preset', 'slower', '-crf', '14', '-g', '60', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-r', '60', '-movflags', '+faststart']
    run(['ffmpeg', '-y', '-loglevel', 'error', '-i', video, '-i', sfx, '-map', '0:v', '-map', '1:a'] + venc + ['-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-shortest', f_sfx])
    run(['ffmpeg', '-y', '-loglevel', 'error', '-i', video, '-map', '0:v', '-an'] + venc + [f_sil])
    review = {'exports': [os.path.relpath(f_sfx, ROOT), os.path.relpath(f_sil, ROOT)], 'duration_s': ev['total'], 'status': 'INTERNAL · NOT FOR PUBLICATION (data licence gate open)',
              'source': spec['source_kind'], 'sections': [{k: (hms(v) if k in ('et0', 'et1') else v) for k, v in s.items()} for s in S],
              'facts': {'high': hi, 'wall_value_10_33': '+$11.0M', 'wall_value_peak': '+$30.6M (11:09:06-11:15:22 ET)', 'wall_value_at_high': '+$24.5M',
                        'never_touched_until': '11:32:52 ET (end of recording)', 'biggest_on_chart_at_high': 'yes, +$24.5M vs +$23.8M (7,766.25) and smaller'},
              'statements': statements}
    json.dump(review, open(os.path.join(outdir, base + '_review.json'), 'w'), indent=1, ensure_ascii=False)
    print('EXPORT', f_sfx, f_sil)

if __name__ == '__main__':
    main(sys.argv[1], '--stills-only' in sys.argv, '--skip-extract' in sys.argv)
