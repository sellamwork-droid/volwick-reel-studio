#!/usr/bin/env python3
"""VOLWICK · Live Market Reactions · LIVE horizontal builder (16:9, no hook, pauses that explain).

  python3 lmr_live_build_h.py <05_PROJECTS/<name>/spec.json> [--stills-only] [--skip-extract]

Timeline entries: play (ET interval -> seconds, speed declared on screen, x1 = real time), pause (one real frame
held, marked PAUSED, with callouts drawn on the chart), end (logo). Every number in the callouts and in the
bottom line comes from the recording: wall label read off the footage, price from the terminal text logged every 5 s.
"""
import sys, os, json, glob, re, subprocess, threading, http.server, socketserver, functools, shutil
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); FPS = 60
def run(cmd): print('$', ' '.join(cmd)[:200], flush=True); subprocess.run(cmd, check=True)
def secs(s): h, m, x = s.split(':'); return int(h) * 3600 + int(m) * 60 + float(x)

def main(spec_path, stills_only=False, skip_extract=False):
    spec = json.load(open(spec_path)); pdir = os.path.dirname(os.path.abspath(spec_path))
    idx = json.load(open(os.path.join(ROOT, spec['index'])))
    def off(et):
        seg = [s for s in idx if s['start_et_s'] <= et][-1]; return seg['offset'] + min(et - seg['start_et_s'], seg['dur'] - 0.05)
    samples = []
    for f in sorted(glob.glob(os.path.join(ROOT, spec['samples_glob']))):
        for s in json.load(open(f))['samples']:
            t = s['text']
            if len(t) > 3 and re.match(r'^7,\d{3}\.\d\d$', t[3]): samples.append([secs(s['et'][11:19]), float(t[3].replace(',', ''))])
    wall = []; lvl = None
    for t, y, txt in json.load(open(os.path.join(ROOT, spec['wall_ocr']))):
        m = re.search(r'7,?(76\d)(?:\.(\d{1,2}))?', txt or '')
        if m: lvl = float('7' + m.group(1) + '.' + (m.group(2) or '0'))
        if y is not None and lvl: wall.append([t, y, lvl])
    ys = [w[1] for w in wall]
    for i in range(len(wall)): win = sorted(ys[max(0, i - 2):i + 3]); wall[i][1] = win[len(win) // 2]
    # ---- timeline ----
    S = []; t = 0.0
    for e in spec['timeline']:
        d = e['secs']; s = {'kind': e['kind'], 'id': e.get('id', e['kind']), 't0': round(t, 4), 't1': round(t + d, 4), 'say': e.get('say'), 'callouts': e.get('callouts', []), 'zoom': e.get('zoom'), 'cam': e.get('cam')}
        if e['kind'] == 'play': s.update({'et0': secs(e['et0']), 'et1': secs(e['et1']), 'speed': round((secs(e['et1']) - secs(e['et0'])) / d, 2), 'n': int(round(d * FPS))})
        if e['kind'] == 'pause': s.update({'et': secs(e['et'])})
        S.append(s); t += d
    total = round(t, 4)
    fdir = os.path.join(pdir, 'frames'); src = os.path.join(ROOT, spec['source'])
    if not skip_extract:
        shutil.rmtree(fdir, ignore_errors=True); os.makedirs(fdir); procs = []
        for s in S:
            if s['kind'] == 'play':
                dur = s['et1'] - s['et0']; k = dur / (s['t1'] - s['t0'])
                procs.append(subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-y', '-ss', f"{off(s['et0']):.3f}", '-i', src, '-t', f'{dur + 2:.3f}',
                    '-vf', f'setpts=(PTS-STARTPTS)/{k:.6f},fps={FPS}', '-frames:v', str(s['n']), '-q:v', '2', os.path.join(fdir, s['id'] + '_%05d.jpg')]))
            if s['kind'] == 'pause':
                procs.append(subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-y', '-ss', f"{off(s['et']):.3f}", '-i', src, '-frames:v', '1', '-q:v', '1', os.path.join(fdir, s['id'] + '.jpg')]))
        for p in procs: p.wait()
    if not skip_extract and spec.get('fix_flicker'):   # terminal y-autoscale flicker on the 27 Oct footage (Power, 29 Oct: "su e giù" around 0:30)
        run(['python3', os.path.join(HERE, 'analysis', 'fix_rescale_flicker.py'), fdir, ','.join(spec['fix_flicker'])])
    for s in S:
        if s['kind'] == 'play': s['n'] = len(glob.glob(os.path.join(fdir, s['id'] + '_*.jpg')))
    ev = {'total': round(total + 0.3, 3), 'logo0': S[-1]['t0'], 'loop0': total, 'pauses': [s['t0'] for s in S if s['kind'] == 'pause'],
          'touch': next(s['t0'] for s in S if s['kind'] == 'pause' and s['zoom']), 'logo_flash': round(S[-1]['t0'] + 1.5 / 1.8, 3)}
    ev['reaction'] = next((s['t0'] for s in S if s['id'] == 'd'), total) + 0.2; ev['hook_hi'] = -10
    def vt(et):   # video time of a recording instant (ET seconds), on the play sections
        for s in S:
            if s['kind'] == 'play' and s['et0'] <= et < s['et1']: return round(s['t0'] + (et - s['et0']) / s['speed'], 3)
        return None
    marks = []
    for m in spec.get('marks', []):
        m = dict(m); m['et'] = secs(m['et']); m['t'] = vt(m['et'])
        if m['t'] is not None: marks.append(m)
    ev['marks'] = [{'t': m['t'], 'type': m['type'], 'big': m.get('big', False)} for m in marks]
    project = {'sections': S, 'total': total, 'events': ev, 'ppt': spec['ppt_css'], 'price_x': spec['price_x_css'], 'samples': samples, 'wall': wall,
               'chips': [{'et0': secs(c['et0']), 'et1': secs(c['et1']), 'title': c['title'], 'sub': c.get('sub'), 'fin': c.get('fin', True), 'fout': c.get('fout', True)} for c in spec.get('chips', [])], 'marks': marks, 'texts': {'badge': spec['badge'], 'disclaimer': spec['disclaimer']}, 'frames': '/' + os.path.relpath(fdir, ROOT)}
    json.dump(project, open(os.path.join(pdir, 'project.json'), 'w')); json.dump(ev, open(os.path.join(pdir, 'events_timeline.json'), 'w'), indent=1)
    print('TIMELINE', [(s['id'], s['t0'], s['t1'], s.get('speed')) for s in S], 'total', total, flush=True)
    from playwright.sync_api import sync_playwright
    srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), functools.partial(type('Q', (http.server.SimpleHTTPRequestHandler,), {'log_message': lambda *a: None}), directory=ROOT))
    port = srv.server_address[1]; threading.Thread(target=srv.serve_forever, daemon=True).start()
    video = os.path.join(pdir, 'video.mp4'); rel = '/' + os.path.relpath(os.path.join(pdir, 'project.json'), ROOT)
    with sync_playwright() as p:
        br = p.chromium.launch(args=['--force-color-profile=srgb']); pg = br.new_page(viewport={'width': 1920, 'height': 1080}, device_scale_factor=1)
        pg.goto(f"http://127.0.0.1:{port}/08_AUTOMATION/scene/index_live_h.html?p={rel}"); pg.wait_for_function('window.READY !== undefined', timeout=60000)
        cv = pg.locator('#h'); os.makedirs(os.path.join(pdir, 'stills'), exist_ok=True)
        for s in S:
            for u in (0.15, 0.6, 0.97):
                ts = s['t0'] + u * (s['t1'] - s['t0']); pg.evaluate(f'render({ts})'); cv.screenshot(path=os.path.join(pdir, 'stills', f"t{ts:06.2f}_{s['id']}.png"))
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
    sfx = os.path.join(pdir, 'sfx.wav'); run(['python3', os.path.join(HERE, spec.get('sound', 'lmr_sound_live_h.py')), os.path.join(pdir, 'events_timeline.json'), sfx])
    outdir = os.path.join(ROOT, '06_EXPORTS'); base = f"Volwick_LMR_ES_2026-10-27_{spec['version']}_v{spec['iteration']}"
    f_sfx = os.path.join(outdir, base + '.mp4')
    venc = ['-c:v', 'libx264', '-preset', 'slower', '-crf', '14', '-g', '60', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-r', '60', '-movflags', '+faststart']
    run(['ffmpeg', '-y', '-loglevel', 'error', '-i', video, '-i', sfx, '-map', '0:v', '-map', '1:a'] + venc + ['-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-shortest', f_sfx])
    json.dump({'exports': [os.path.relpath(f_sfx, ROOT)], 'duration_s': ev['total'], 'status': 'INTERNAL · NOT FOR PUBLICATION (data licence gate open)',
               'source': spec['source_kind'], 'timeline': spec['timeline']}, open(os.path.join(outdir, base + '_review.json'), 'w'), indent=1, ensure_ascii=False)
    print('EXPORT', f_sfx)

if __name__ == '__main__':
    main(sys.argv[1], '--stills-only' in sys.argv, '--skip-extract' in sys.argv)
