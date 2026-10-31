"""Edit-style music bed from two sections of one beat tape (Power 31 Oct 18:03):
section A under hook + plain chart (a downbeat on the hook cut), section B from the swipe (a downbeat on the swipe landing),
muffled while the price sits on the call wall, open again on the drop, fade on the ending.
usage: OFF=<hook s> python3 music_edit.py track ev.json total_s A_start_s B_start_s out.wav"""
import os, sys, json, subprocess, numpy as np, librosa, soundfile as sf
from scipy.signal import butter, sosfilt
tr, evp, total, A0, B0, out = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4]), float(sys.argv[5]), sys.argv[6]
SR = 48000; OFF = float(os.environ.get('OFF', 0.93)); E = json.load(open(evp))['events']
def load(st, d):
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-ss', str(st), '-t', str(d), '-i', tr, '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-']); return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()
def downbeat(st):   # first strong kick beat in the window
    y = load(st, 20).mean(1); y22 = librosa.resample(y, orig_sr=SR, target_sr=22050); tempo, bt = librosa.beat.beat_track(y=y22, sr=22050, units='time')
    low = sosfilt(butter(4, 150, 'low', fs=SR, output='sos'), y); en = [np.sum(low[int(b * SR):int(b * SR) + 2400] ** 2) for b in bt[:8]]
    b = bt[int(np.argmax(en[:4]))]; return st + b, float(np.atleast_1d(tempo)[0])
a_db, ta = downbeat(A0); b_db, tb = downbeat(B0); print('A', round(a_db, 2), round(ta, 1), 'B', round(b_db, 2), round(tb, 1))
n = int(total * SR); outb = np.zeros((n, 2), np.float32)
tsw = OFF + E['drop']                                          # swipe landing
A = load(a_db - OFF, tsw + 0.05); m = min(len(A), int((tsw + 0.03) * SR)); outb[:m] = A[:m]
Bs = load(b_db, total); i0 = int(tsw * SR); m2 = min(len(Bs), n - i0); xf = int(0.03 * SR)
fade = np.linspace(0, 1, xf)[:, None]; outb[i0:i0 + xf] = outb[i0:i0 + xf] * (1 - fade) + Bs[:xf] * fade; outb[i0 + xf:i0 + m2] = Bs[xf:m2]
# muffle while the price sits on the wall
t_on, t_off = OFF + E['touch_in'], OFF + E['release']; sos = butter(2, 700, 'low', fs=SR, output='sos'); lp = np.stack([sosfilt(sos, outb[:, c]) for c in range(2)], 1)
x = np.arange(n) / SR; w = np.clip((x - t_on) / 0.25, 0, 1) * np.clip((t_off + 0.05 - x) / 0.08, 0, 1); w = w[:, None]
outb = outb * (1 - w) + lp * w * 0.8
if os.environ.get('LOGO_AT'):   # Power 31 Oct 18:45: music down when the logo section starts, gone once the logo shows (only the sound effects stay)
    L = float(os.environ['LOGO_AT']); gl = np.interp(x, [L - 0.05, L + 0.3, L + 0.85], [1.0, 0.4, 0.0]); outb *= gl[:, None]
else:
    outb *= np.clip((total - 0.1 - x) / 1.2, 0, 1)[:, None]
outb *= np.clip(x / 0.05, 0, 1)[:, None]
outb /= np.max(np.abs(outb)) + 1e-9; sf.write(out, (outb * 0.8).astype(np.float32), SR, subtype='FLOAT'); print('ok', total)
