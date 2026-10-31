"""VOLWICK · Live Market Reactions · reading the terminal from its pixels.

Everything here works on what the terminal shows on screen (a recorded frame or a still):
price axis, time axis, wall lines and their labels, candles, last-price box.
No network data, no internal state of the terminal.
"""
import re, subprocess, tempfile, os
import numpy as np, cv2

BG = np.array([7, 9, 13])                     # terminal background (RGB)
GREEN = np.array([74, 222, 128]); RED = np.array([248, 113, 113])   # candle colours (RGB)
PRICE_BOX = np.array([232, 194, 104])         # last-price box on the axis
TICK = 0.25

def rgb(frame_bgr):
    return frame_bgr[:, :, ::-1].astype(np.int16)

def ocr(img_rgb, whitelist='0123456789.,:', psm=7, scale=4, invert=False):
    g = cv2.cvtColor(img_rgb.astype(np.uint8), cv2.COLOR_RGB2GRAY)
    g = cv2.resize(g, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)
    if not invert: g = 255 - g
    g = cv2.normalize(g, None, 0, 255, cv2.NORM_MINMAX)
    g = _undot_zeros(g)
    with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as f: path = f.name
    cv2.imwrite(path, g)
    try:
        out = subprocess.run(['tesseract', path, '-', '--psm', str(psm), '-c', f'tessedit_char_whitelist={whitelist}'],
                             capture_output=True, text=True, timeout=20).stdout
    finally:
        os.unlink(path)
    return out.strip()

def _undot_zeros(g):
    """JetBrains Mono draws a dot inside 0: erase small blobs enclosed in another glyph's box so OCR reads 0."""
    ink = (g < 128).astype(np.uint8)
    n, lab, st, _ = cv2.connectedComponentsWithStats(ink, 8)
    if n < 3: return g
    big = st[1:, cv2.CC_STAT_AREA].max()
    out = g.copy()
    for i in range(1, n):
        x, y, w, h, area = st[i]
        if area > 0.25 * big: continue
        for j in range(1, n):
            if j == i: continue
            X, Y, Wd, Hd, A = st[j]
            if A > area * 2 and X < x and Y < y and X + Wd > x + w and Y + Hd > y + h:
                out[lab == i] = 255; break
    return out

def runs(mask1d, min_len=1, gap=0):
    """Contiguous True runs as (start, end_inclusive), merging gaps <= gap."""
    idx = np.flatnonzero(mask1d); out = []
    if not len(idx): return out
    s = p = idx[0]
    for i in idx[1:]:
        if i - p > gap + 1:
            if p - s + 1 >= min_len: out.append((s, p))
            s = i
        p = i
    if p - s + 1 >= min_len: out.append((s, p))
    return out

class Layout:
    """Where the pane, the price axis and the time axis are, found from the pixels."""
    def __init__(self, im):
        H, W, _ = im.shape
        sat = im.max(axis=2) - im.min(axis=2)
        bright = (im.max(axis=2) > 120) & (sat < 40)               # grey label text only (candles and walls are coloured)
        colhits = bright[:, int(W * 0.6):].sum(axis=0)
        xs = np.flatnonzero(colhits > 20) + int(W * 0.6)
        self.axis_x0 = int(xs.min()) - 6 if len(xs) else W - 90
        self.axis_x1 = int(xs.max()) + 4 if len(xs) else W - 4
        # time axis: bottom band with time labels
        rowhits = bright[:, : self.axis_x0].sum(axis=1)
        rr = runs(rowhits[int(H * 0.85):] > 3, min_len=5)
        if rr:
            s, e = rr[-1]; self.time_y0 = s + int(H * 0.85) - 3; self.time_y1 = e + int(H * 0.85) + 3
        else:
            self.time_y0, self.time_y1 = H - 30, H - 6
        x0 = int(np.flatnonzero(np.abs(im[H // 2, :, :] - BG).sum(axis=1) < 12).min())   # first background column
        self.pane = (x0, 64, self.axis_x0 - 4, self.time_y0 - 6)   # x0,y0,x1,y1 (top bar excluded)

def _grid_consensus(pos, vals, steps):
    """Labels on an axis are evenly spaced with a round step. OCR can misread single digits
    (the dotted zero), so the value of every label is rebuilt from the step and the anchor most
    labels agree on. Returns (fitted values, step, agreeing count)."""
    pos = np.asarray(pos, float); order = np.argsort(pos); pos = pos[order]
    vals = [vals[i] for i in order]
    d = np.diff(pos); med = np.median(d)
    regular = np.r_[True, np.abs(d - med) < 0.2 * med]          # drop an off-grid label (e.g. last bar time)
    idx = np.round((pos - pos[0]) / med).astype(int)
    best = None
    for S in steps:
        for sign in (1, -1):
            anchors = {}
            for k, (i, v) in enumerate(zip(idx, vals)):
                if v is None or not regular[k]: continue
                a0 = round((v - sign * S * i) / S) * S
                anchors[a0] = anchors.get(a0, 0) + 1
            if not anchors: continue
            a0, n = max(anchors.items(), key=lambda kv: kv[1])
            if best is None or n > best[2]: best = (a0, S * sign, n)
    a0, S, n = best
    fitted = [a0 + S * i for i in idx]
    return pos, np.array(fitted, float), regular, abs(S), n

def price_axis(im, L):
    """OCR the axis labels and fit y -> price. Returns (a, b, residual_px, labels) with price = a*y + b."""
    x0, x1 = L.axis_x0, L.axis_x1
    band = im[:, x0:x1]
    sat = band.max(axis=2) - band.min(axis=2)
    txt = (band.max(axis=2) > 110) & (sat < 40)
    ys, vals = [], []
    for s, e in runs(txt.sum(axis=1) > 0, min_len=6):
        if e - s > 20 or s < L.pane[1] or e > L.pane[3]: continue
        t = ocr(im[max(0, s - 3):e + 4, x0:x1], '0123456789.')
        m = re.fullmatch(r'(\d{3,6}\.\d{2})', t.replace(',', ''))
        ys.append((s + e) / 2.0); vals.append(float(m.group(1)) if m else None)
    if len(ys) < 4: raise RuntimeError('price axis not readable')
    y, p, reg, step, n = _grid_consensus(ys, vals, [0.25, 0.5, 1, 2, 2.5, 5, 10, 20, 25, 50, 100])
    if n < 3: raise RuntimeError('price axis: OCR does not agree')
    a, b = np.polyfit(y[reg], p[reg], 1)
    resid_px = float(np.max(np.abs(a * y[reg] + b - p[reg])) / abs(a))
    return a, b, resid_px, {'labels': [(float(yy), float(pp)) for yy, pp in zip(y, p)], 'step': step, 'ocr_agree': int(n), 'ocr_total': len(ys)}

def time_axis(im, L):
    """OCR the HH:MM labels under the pane and fit x -> minutes of day (browser time zone)."""
    band = im[L.time_y0:L.time_y1, L.pane[0]:L.axis_x0]
    sat = band.max(axis=2) - band.min(axis=2)
    cols = ((band.max(axis=2) > 110) & (sat < 40)).sum(axis=0) > 0
    xs, vals = [], []
    for s, e in runs(cols, min_len=10, gap=4):
        if s < 3: continue                                     # clipped label at the left edge
        t = ocr(im[L.time_y0:L.time_y1, L.pane[0] + max(0, s - 3):L.pane[0] + e + 4], '0123456789:')
        m = re.fullmatch(r'(\d{1,2}):(\d{2})', t)
        xs.append((s + e) / 2.0 + L.pane[0]); vals.append(int(m.group(1)) * 60 + int(m.group(2)) if m else None)
    if len(xs) < 3: raise RuntimeError('time axis not readable')
    x, mm, reg, step, n = _grid_consensus(xs, vals, [1, 2, 5, 10, 15, 30, 60, 120])
    if n < 2: raise RuntimeError('time axis: OCR does not agree')
    a, b = np.polyfit(x[reg], mm[reg], 1)
    return a, b, {'labels': [(float(xx), int(v)) for xx, v, r in zip(x, mm, reg) if r], 'step_min': step, 'ocr_agree': int(n), 'ocr_total': len(xs)}

def wall_family(c):
    r, g, b = [float(v) for v in c]
    if r > 1.8 * g and r > 1.6 * b: return 'red'          # put wall long gamma
    if g > 1.4 * r and g >= b * 0.9 and b < g * 0.8: return 'green'   # call wall long gamma
    if b > 1.3 * r and g > 1.3 * r: return 'cyan'          # short gamma (calls)
    if r > 1.3 * g and b > 1.3 * g: return 'magenta'       # short gamma (puts)
    return None

FAMILY_TEXT = {'red': 'Put wall · long γ', 'green': 'Call wall · long γ', 'cyan': 'Call wall · short γ', 'magenta': 'Put wall · short γ'}

def walls(im, L, a, b):
    """Horizontal wall lines across the pane: y, colour family, price from y, label OCR."""
    x0, y0, x1, y1 = L.pane
    pane = im[y0:y1, x0:x1]
    sat = pane.max(axis=2) - pane.min(axis=2)
    not_dash = np.abs(pane - PRICE_BOX).sum(axis=2) > 90          # ignore the dashed last-price line
    g_, r_ = candle_mask(pane, 60)
    colored = (sat > 16) & not_dash & ~g_ & ~r_
    frac = colored.mean(axis=1)
    out = []
    for s, e in runs(frac > 0.40, min_len=1, gap=1):
        if y0 + e > y1 - 25: continue                                  # volume bars at the bottom of the pane
        yy = y0 + s + int(np.argmax((sat * colored)[s:e + 1].mean(axis=1)))
        row = im[yy, x0:x1]; m = colored[yy - y0]
        col = np.median(row[m], axis=0)
        fam = wall_family(col)
        if fam is None: continue
        price_y = a * yy + b
        # label: text right of the line end, same row
        lab = im[max(0, yy - 7):yy + 8, x1 - 120:x1 + 2]
        t = ocr(lab, '0123456789.,·+-$MK ', psm=7)
        m2 = re.search(r'(\d{1,2},?\d{3}\.\d{2})', t)
        lvl = float(m2.group(1).replace(',', '')) if m2 else None
        val = re.search(r'([+-]?\$?[\d.]+[MK])', t.split(m2.group(1))[-1] if m2 else t)
        snapped = round(price_y / TICK) * TICK
        out.append({'y': int(yy), 'family': fam, 'family_text': FAMILY_TEXT[fam], 'rgb': [int(v) for v in col],
                    'price_from_y': round(float(price_y), 3), 'label_ocr': t, 'label_level': lvl,
                    'label_value': val.group(1) if val else None,
                    'level': lvl if (lvl is not None and abs(lvl - price_y) < 1.0) else snapped,
                    'level_source': 'label' if (lvl is not None and abs(lvl - price_y) < 1.0) else 'y-axis (label unreadable)'})
    return out

def candle_mask(im, tol=40):
    g = np.abs(im - GREEN).sum(axis=2) < tol
    r = np.abs(im - RED).sum(axis=2) < tol
    return g, r

def candles(im, L, a, b, ta, tb, minutes):
    """Read OHLC for each minute in `minutes` from a still frame. x(minute) = (minute - tb)/ta."""
    x0, y0, x1, y1 = L.pane
    g, r = candle_mask(im)
    both = g | r
    # volume bars live at the bottom of the pane: exclude the band where colour touches the bottom edge
    colhit = both[y0:y1, x0:x1]
    vol_top = y1
    rows = np.flatnonzero(colhit.mean(axis=1) > 0.15)
    if len(rows): vol_top = y0 + rows.min() - 2 if rows.min() > (y1 - y0) * 0.6 else y1
    step = 1.0 / ta
    out = []
    for mnt in minutes:
        xc = (mnt - tb) / ta
        xa, xb = int(round(xc - step * 0.45)), int(round(xc + step * 0.45))
        if xa < x0 or xb > x1: continue
        sub_g = g[y0:vol_top, xa:xb + 1]; sub_r = r[y0:vol_top, xa:xb + 1]
        ng, nr = sub_g.sum(), sub_r.sum()
        if ng + nr < 2: out.append({'minute': mnt, 'ok': False}); continue
        sub = sub_g if ng >= nr else sub_r
        ys = np.flatnonzero(sub.any(axis=1))
        hi_y, lo_y = y0 + ys.min(), y0 + ys.max()
        widths = sub.sum(axis=1)
        body = np.flatnonzero(widths >= max(2, widths.max() - 1))
        bt, bb = y0 + body.min(), y0 + body.max()
        P = lambda yy: round((a * yy + b) / TICK) * TICK
        up = ng >= nr
        o, c = (P(bb + 0.5), P(bt - 0.5)) if up else (P(bt - 0.5), P(bb + 0.5))
        out.append({'minute': mnt, 'ok': True, 'x': round(xc, 1), 'dir': 'up' if up else 'down',
                    'open': o, 'high': P(hi_y - 0.5), 'low': P(lo_y + 0.5), 'close': c,
                    'px_per_tick': round(TICK / abs(a), 2)})
    return out

def last_price_box(im, L):
    """The highlighted last-price box on the axis, read by OCR (used on video frames)."""
    band = im[:, L.axis_x0:L.axis_x1]
    m = np.abs(band - PRICE_BOX).sum(axis=2) < 40
    rr = runs(m.sum(axis=1) > 10, min_len=6)
    if not rr: return None, None
    s, e = rr[0]
    t = ocr(im[s:e + 1, L.axis_x0:L.axis_x1], '0123456789.', invert=False)
    mm = re.search(r'(\d{3,6}\.\d{2})', t)
    v = round(float(mm.group(1)) / TICK) * TICK if mm else None      # prices live on the 0.25 tick
    return v, (s + e) / 2.0
