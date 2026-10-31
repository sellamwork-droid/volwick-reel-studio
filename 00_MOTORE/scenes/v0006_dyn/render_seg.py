"""Render only a stretch of the scene (local helper for test clips): SCENE=... python3 render_seg.py FPS T0 T1 out.mp4"""
import sys, os, subprocess, threading, http.server, socketserver, functools
from playwright.sync_api import sync_playwright
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.TCPServer(("127.0.0.1", 0), functools.partial(Q, directory=ROOT)); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
fps, t0, t1, out = int(sys.argv[1]), float(sys.argv[2]), float(sys.argv[3]), sys.argv[4]
with sync_playwright() as p:
    b = p.chromium.launch(args=["--force-color-profile=srgb"]); pg = b.new_page(viewport={"width": 1080, "height": 1920})
    pg.goto(f"http://127.0.0.1:{port}/" + os.environ["SCENE"]); pg.evaluate("window.READY"); c = pg.locator("#c")
    ff = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", str(fps), "-c:v", "mjpeg", "-i", "-", "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", "-pix_fmt", "yuv420p", out], stdin=subprocess.PIPE)
    for f in range(int((t1 - t0) * fps)):
        pg.evaluate(f"render({t0 + f / fps})"); ff.stdin.write(c.screenshot(type="jpeg", quality=95))
    ff.stdin.close(); ff.wait(); b.close()
srv.shutdown()
