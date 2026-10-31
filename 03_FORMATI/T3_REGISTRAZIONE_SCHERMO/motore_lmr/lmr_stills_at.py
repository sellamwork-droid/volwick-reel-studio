#!/usr/bin/env python3
# render stills of a built project at given video times: python3 lmr_stills_at.py <project dir> t1 t2 ...
import sys, os, threading, http.server, socketserver, functools
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
pdir = os.path.abspath(sys.argv[1]); ts = [float(x) for x in sys.argv[2:]]
from playwright.sync_api import sync_playwright
srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), functools.partial(type('Q', (http.server.SimpleHTTPRequestHandler,), {'log_message': lambda *a: None}), directory=ROOT))
port = srv.server_address[1]; threading.Thread(target=srv.serve_forever, daemon=True).start()
rel = '/' + os.path.relpath(os.path.join(pdir, 'project.json'), ROOT); os.makedirs(os.path.join(pdir, 'qc'), exist_ok=True)
with sync_playwright() as p:
    br = p.chromium.launch(args=['--force-color-profile=srgb']); pg = br.new_page(viewport={'width': 1920, 'height': 1080}, device_scale_factor=1)
    pg.goto(f"http://127.0.0.1:{port}/08_AUTOMATION/scene/index_live_h.html?p={rel}"); pg.wait_for_function('window.READY !== undefined', timeout=60000)
    for t in ts: pg.evaluate(f'render({t})'); pg.locator('#h').screenshot(path=os.path.join(pdir, 'qc', f't{t:06.2f}.png')); print(os.path.join(pdir, 'qc', f't{t:06.2f}.png'))
    br.close()
srv.shutdown()
