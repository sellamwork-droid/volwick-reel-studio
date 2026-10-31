"""V0006 bed from Power's track (31 Oct 15:28): the track from frame 1 to the end, beat grid locked to the cut, looped on a bar,
filtered under the rewind, faded under the end card. usage: OFFSET=<hook s> python3 bed_track.py track.mp3 ev.json bed.wav"""
import json, os, subprocess, sys, numpy as np, scipy.signal as ss, soundfile as sf
SR = 48000; tr, evp, out = sys.argv[1:4]
x = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', tr, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True).stdout, np.float32).reshape(-1, 2).astype(float)
ev = json.load(open(evp)); E = ev['events']; OFF = float(os.environ.get('OFFSET', 0.75)); DUR = ev['total'] + OFF + 0.2; n = int(DUR * SR)
PER = float(os.environ.get('PERIOD', 0.75)); PH = float(os.environ.get('PHASE', 0.0))   # beat period and time of the first beat in the track
LOOP_AT, LOOP_TO = float(os.environ.get('LOOP_AT', 9.0)), float(os.environ.get('LOOP_TO', 3.0))
shift = (PH - OFF) % PER                                     # track time at video 0, so a beat falls on the cut
src = np.arange(n) / SR + shift; src = np.where(src >= LOOP_AT, LOOP_TO + (src - LOOP_AT) % (LOOP_AT - LOOP_TO), src)
idx = np.clip((src * SR).astype(int), 0, len(x) - 1); B = x[idx] * (src >= 0)[:, None]
r0, r1 = int((E['rew'] + OFF) * SR), int((E['walls'] + OFF) * SR)   # rewind: muffled, a bit lower
B[r0:r1] = ss.sosfilt(ss.butter(4, 900, 'low', fs=SR, output='sos'), B[r0:r1], axis=0) * 0.7
t = np.arange(n) / SR; end = E['end'] + OFF; fo = np.clip(t / 0.03, 0, 1) * (1 - 0.35 * np.clip((t - end) / 0.4, 0, 1)) * np.clip((DUR - 0.3 - t) / 1.6, 0, 1)
B *= fo[:, None]; B = B / (np.abs(B).max() + 1e-9) * 0.8; sf.write(out, B.astype(np.float32), SR, subtype='FLOAT'); print('ok', round(DUR, 2), 'shift', round(shift, 3))
