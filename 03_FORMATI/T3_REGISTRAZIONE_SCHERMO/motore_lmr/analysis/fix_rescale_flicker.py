# The 27 Oct recording has a y-autoscale flicker in the terminal around 11:02-11:04 ET: for some seconds the chart is drawn
# at another vertical scale, then snaps back ("su e giù"). Each flicker frame is the same real frame redrawn at the steady
# scale: affine vertical fit on two fixed-price lines (red wall 7,761.50 and the white key level 7,738.50).
# python3 fix_rescale_flicker.py <frames dir> <section ids comma> [ref_red ref_white]
import sys, glob, os, numpy as np
from PIL import Image
d, secs = sys.argv[1], sys.argv[2].split(','); R0, W0 = (float(sys.argv[3]), float(sys.argv[4])) if len(sys.argv) > 4 else (388.0, 797.0)
def lines(f):
    a = np.asarray(Image.open(f).convert('RGB'))[:, 2700:2900].astype(int); m = np.median(a, axis=1)
    def centers(mask):
        rows = np.where(mask)[0]
        return [float(g.mean()) for g in np.split(rows, np.where(np.diff(rows) > 3)[0] + 1) if len(g)] if len(rows) else []
    red = centers((m[:, 0] > 120) & (m[:, 1] < 70) & (m[:, 2] < 90)); wh = [c for c in centers((m[:, 0] > 150) & (m[:, 1] > 150) & (m[:, 2] > 150)) if c > 650]
    return (red[0] if red else None, max(wh) if wh else None)
n = 0
for sec in secs:
    for f in sorted(glob.glob(f'{d}/{sec}_[0-9]*.jpg')):
        r, w = lines(f)
        if r is None or w is None or abs(w - W0) <= 3: continue
        a = (w - r) / (W0 - R0); b = r - a * R0; im = Image.open(f).convert('RGB')
        im.transform(im.size, Image.AFFINE, (1, 0, 0, 0, a, b), resample=Image.BICUBIC).save(f + '.tmp.jpg', quality=95); os.replace(f + '.tmp.jpg', f); n += 1
        print(os.path.basename(f), round(r), round(w), round(a, 4), round(b, 1))
print('fixed', n)
