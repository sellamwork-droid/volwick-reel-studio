#!/usr/bin/env python3
"""Split one still of the terminal into two layers for a replay of the session:
   base.png     axes, grid, wall lines and labels (what was on screen from the book time on)
   candles.png  candles and volume bars only (RGBA), revealed minute by minute in time order
The dashed last-price line and the last-price box are removed (they show the final price);
the scene draws its own price marker at the price of the minute being shown.
usage: python3 lmr_layers.py <frame.png> <crop x0,y0,x1,y1> <out_dir> [walls.json]
"""
import sys, os, numpy as np, cv2

def masks(im):
    r, g, b = [im[:, :, i] for i in range(3)]
    m0 = np.maximum(np.maximum(r, g), b); mx = m0 + 1e-6
    # candle / volume red: g/r ~ 0.45, g ~ b ; candle / volume green: r/g ~ 0.33, b/g ~ 0.58
    red = (r > 30) & (g / mx > 0.38) & (g / mx < 0.56) & (np.abs(g - b) < 0.12 * r + 4) & (r == m0)
    green = (g > 30) & (r / mx > 0.25) & (r / mx < 0.42) & (b / mx > 0.48) & (b / mx < 0.68) & (g == m0)
    yellow = (r > 60) & (np.abs(r / mx - 1) < 0.01) & (g / mx > 0.75) & (g / mx < 0.9) & (b / mx > 0.38) & (b / mx < 0.52)
    return red, green, yellow

def main(frame, crop, out, walls_json=None):
    os.makedirs(out, exist_ok=True)
    bgr = cv2.imread(frame); im = bgr[:, :, ::-1].astype(float)
    x0, y0, x1, y1 = crop
    im = im[y0:y1, x0:x1]
    red, green, yellow = masks(im)
    cand = red | green
    wall_bands = []
    if walls_json:                                   # wall rows: the line is drawn over the candles, handled column by column below
        import json
        for w in json.load(open(walls_json)):
            yy = w['y'] - y0
            if 0 <= yy < im.shape[0]: wall_bands.append(slice(max(0, yy - 6), yy + 7))
        for band in wall_bands: cand[band] = False
    bg = np.array([7, 9, 13], float)
    base = im.copy(); base[cand] = bg; base[yellow] = bg
    # the last-price box on the axis: a filled yellow rectangle, wipe it
    ys, xs = np.nonzero(yellow)
    box = yellow[:, int(im.shape[1] * 0.9):]
    if box.any():
        by, bx = np.nonzero(box); bx = bx + int(im.shape[1] * 0.9)
        base[by.min() - 2:by.max() + 3, bx.min() - 2:] = bg
    # grid lines under removed candles: restore the faint grid colour where the column is a grid column
    grid = np.array([15, 17, 21], float)
    col_grid = (np.abs(im - grid).sum(axis=2) < 6).mean(axis=0) > 0.35
    row_grid = (np.abs(im - grid).sum(axis=2) < 6).mean(axis=1) > 0.35
    gy = np.nonzero(row_grid)[0]; gx = np.nonzero(col_grid)[0]
    for y in gy: base[y, cand[y]] = grid
    for x in gx: base[cand[:, x], x] = grid
    alpha = np.where(cand, 255, 0).astype(np.uint8)
    # wall bands: a column is 'dirty' where candles or volume pass under the line; rebuild the line there from clean
    # neighbouring columns in the base, and keep the original mixed pixels in the candle layer for the reveal
    for band in wall_bands:
        sub = base[band]
        ref = np.median(sub[:, :int(sub.shape[1] * 0.75)], axis=1)          # typical line profile (rows of the band)
        dev = np.abs(sub - ref[:, None, :]).sum(axis=2).max(axis=0)
        near = cand[max(0, band.start - 4):band.start].any(axis=0) | cand[band.stop:band.stop + 4].any(axis=0)
        dirty = (dev > 60) | near
        dirty = cv2.dilate(dirty.astype(np.uint8)[None, :], np.ones((1, 3), np.uint8))[0].astype(bool)
        dirty[int(sub.shape[1] * 0.80):] &= near[int(sub.shape[1] * 0.80):]   # the line's label and end dot are not candles
        clean = np.flatnonzero(~dirty)
        src = base[band].copy()
        for x in np.flatnonzero(dirty):
            l = clean[clean < x]
            if len(l): base[band, x] = np.median(src[:, l[-8:]], axis=1)     # continue the line from the clean stretch on its left
            else:
                r = clean[clean > x]
                if len(r): base[band, x] = np.median(src[:, r[:8]], axis=1)
        strong = (red | green)[band]                                    # only the candle pixels, never the line or its label
        sub_a = alpha[band]; sub_a[:, dirty] = np.where(strong[:, dirty], 255, 0); alpha[band] = sub_a
    top = im.copy(); top[yellow] = base[yellow]                         # no final-price dashes in the reveal layer
    rgba = np.dstack([top[:, :, ::-1].astype(np.uint8), alpha])
    cv2.imwrite(os.path.join(out, 'base.png'), base[:, :, ::-1].astype(np.uint8))
    cv2.imwrite(os.path.join(out, 'candles.png'), rgba)
    print('layers', base.shape, 'candle px', int(cand.sum()), 'price-line px', int(yellow.sum()), 'wall bands', len(wall_bands))
    return

    rgba = np.dstack([im[:, :, ::-1].astype(np.uint8), alpha])
    cv2.imwrite(os.path.join(out, 'base.png'), base[:, :, ::-1].astype(np.uint8))
    cv2.imwrite(os.path.join(out, 'candles.png'), rgba)
    print('layers', base.shape, 'candle px', int(cand.sum()), 'price-line px', int(yellow.sum()))

if __name__ == '__main__':
    main(sys.argv[1], [int(v) for v in sys.argv[2].split(',')], sys.argv[3], sys.argv[4] if len(sys.argv) > 4 else None)
