"""Hook clip with a match cut: speed ramp + push-in that lands a point of the clip on a point of the first chart frame.
usage: python3 hook_match.py src.mp4 "t0:t1:speed[,t1:t2:speed...]" overlay.png out.mp4 srcX srcY dstX dstY scaleEnd
       (old form still works: src t0 t1 speed overlay out srcX srcY dstX dstY scaleEnd)
The point (srcX, srcY) is where the subject is on the LAST source frame; the push-in ends exactly there on the cut."""
import os, sys, subprocess, json, numpy as np
from PIL import Image
a = sys.argv[1:]
if ':' in a[1]: src, segs, ov, out = a[0], [tuple(map(float, s.split(':'))) for s in a[1].split(',')], a[2], a[3]; rest = a[4:]
else: src, segs, ov, out = a[0], [(float(a[1]), float(a[2]), float(a[3]))], a[4], a[5]; rest = a[6:]
sx, sy, dx, dy, s1 = map(float, rest)
W, H, FPS = 1080, 1920, 60
t0, t1 = segs[0][0], segs[-1][1]
fr = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=r_frame_rate', '-of', 'json', src]))['streams'][0]['r_frame_rate']
sfps = eval(fr)
rd = subprocess.Popen(['ffmpeg', '-v', 'error', '-ss', str(t0), '-t', str(t1 - t0 + 0.1), '-i', src, '-vf', f'scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
F = []
while True:
    b = rd.stdout.read(W * H * 3)
    if len(b) < W * H * 3: break
    F.append(np.frombuffer(b, np.uint8).reshape(H, W, 3))
times = []                                  # output time -> source time
for (a0, a1, sp) in segs:
    n = int(round((a1 - a0) / sp * FPS))
    for k in range(n): times.append(a0 + (a1 - a0) * k / n)
times.append(t1)
def frame_at(ts):
    u = (ts - t0) * sfps; i = int(np.floor(u)); f = u - i; i = min(max(i, 0), len(F) - 1); j = min(i + 1, len(F) - 1)
    if os.environ.get('BLEND') == '1': return (F[i] * (1 - f) + F[j] * f).astype(np.uint8)
    return F[j] if f >= 0.5 else F[i]          # nearest frame: clean silhouettes in slow motion
ovl = Image.open(ov).convert('RGBA'); N = len(times)
ox1, oy1 = dx - sx * s1, dy - sy * s1
wr = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'slow', '-crf', '15', '-pix_fmt', 'yuv420p', out], stdin=subprocess.PIPE)
for k, ts in enumerate(times):
    u = k / max(1, N - 1); e = u * u * (3 - 2 * u); s = 1 + (s1 - 1) * e; ox, oy = ox1 * e, oy1 * e
    im = Image.fromarray(frame_at(ts)).transform((W, H), Image.AFFINE, (1 / s, 0, -ox / s, 0, 1 / s, -oy / s), Image.BICUBIC).convert('RGBA')
    im.alpha_composite(ovl); wr.stdin.write(im.convert('RGB').tobytes())
wr.stdin.close(); wr.wait(); print('frames', N, 'dur', round(N / FPS, 3), 'times', ','.join(f'{x:.3f}' for x in times[::max(1, N // 6)]))
