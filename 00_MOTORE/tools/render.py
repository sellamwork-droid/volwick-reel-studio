"""Deterministic frame renderer: python3 render.py stills t1 t2 ... | python3 render.py video FPS out.mp4"""
import sys, subprocess, threading, http.server, socketserver, os, functools, json
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.TCPServer(("127.0.0.1", 0), functools.partial(Q, directory=ROOT)); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()

mode = sys.argv[1]
with sync_playwright() as p:
    b = p.chromium.launch(args=["--disable-gpu-vsync", "--force-color-profile=srgb"])
    pg = b.new_page(viewport={"width": 1080, "height": 1920}, device_scale_factor=1)
    pg.goto(f"http://127.0.0.1:{port}/"+os.environ.get("SCENE","scene.html"))
    check = pg.evaluate("window.READY")
    print("DATA_CHECK", json.dumps(check))
    if os.environ.get("EVENTS_OUT"): json.dump(check, open(os.environ["EVENTS_OUT"],"w"))
    canvas = pg.locator("#c")
    if mode == "stills":
        os.makedirs(os.path.join(ROOT, "stills"), exist_ok=True)
        for t in sys.argv[2:]:
            pg.evaluate(f"render({float(t)})")
            canvas.screenshot(path=os.path.join(ROOT, "stills", f"t{float(t):05.2f}.png"))
    else:
        fps = int(sys.argv[2]); out = sys.argv[3]; total = float(os.environ.get('TOTAL') or check.get('total',29.0))
        nf = int(total * fps)
        ff = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", str(fps),
                               "-c:v", "mjpeg", "-i", "-", "-c:v", "libx264", "-preset", "slow", "-crf", "15",
                               "-pix_fmt", "yuv420p", "-movflags", "+faststart", out], stdin=subprocess.PIPE)
        for f in range(nf):
            pg.evaluate(f"render({f / fps})")
            ff.stdin.write(canvas.screenshot(type="jpeg", quality=96))
            if f % 60 == 0: print("frame", f, "/", nf, flush=True)
        ff.stdin.close(); ff.wait()
    b.close()
srv.shutdown()
