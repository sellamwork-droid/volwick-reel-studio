#!/usr/bin/env python3
"""Contact sheet of a reel at given times: python3 lmr_sheet.py video.mp4 out.png 0.5,3,8,...  (look at it before delivering)"""
import sys, subprocess, os, tempfile, cv2, numpy as np
v, out, ts = sys.argv[1], sys.argv[2], [float(x) for x in sys.argv[3].split(',')]
tiles = []
with tempfile.TemporaryDirectory() as d:
    for i, t in enumerate(ts):
        p = os.path.join(d, f'{i}.png'); subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', str(t), '-i', v, '-frames:v', '1', p], check=True)
        im = cv2.imread(p); im = cv2.resize(im, (360, 640), interpolation=cv2.INTER_AREA)
        cv2.putText(im, f'{t:.2f}s', (10, 26), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (80, 200, 255), 2); tiles.append(im)
cols = min(6, len(tiles)); rows = (len(tiles) + cols - 1) // cols
while len(tiles) < rows * cols: tiles.append(np.zeros_like(tiles[0]))
cv2.imwrite(out, np.vstack([np.hstack(tiles[r * cols:(r + 1) * cols]) for r in range(rows)])); print(out)
