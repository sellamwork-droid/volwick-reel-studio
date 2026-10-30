"""Hook overlay PNG (1080x1920, transparent): dark band, official wordmark, caption in the house style.
usage: python3 hook_overlay.py out.png "LINE ONE|LINE TWO" "WORDS,IN,BLUE"   (run from the engine root)"""
import sys, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
out, text, blue = sys.argv[1], sys.argv[2].split('|'), set(w.strip().upper() for w in (sys.argv[3] if len(sys.argv) > 3 else '').split(',') if w.strip())
W, H = 1080, 1920; img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
band = np.zeros((H, W, 4), np.uint8); band[..., :3] = (3, 6, 12); y = np.arange(H)
import os
BE, BA, BF = float(os.environ.get('BAND_END', 520)), float(os.environ.get('BAND_A', 0.8)), float(os.environ.get('BAND_FADE', 150))
band[..., 3] = (np.clip(np.where(y < BE, BA, BA * (1 - (y - BE) / BF)), 0, 1) * 255)[:, None].astype(np.uint8)
img = Image.alpha_composite(img, Image.fromarray(band, 'RGBA'))
wm = Image.open('assets/wm_crop.png').convert('RGB'); h = 46; w = round(h * wm.width / wm.height); wm = wm.resize((w, h), Image.LANCZOS)
arr = np.asarray(wm).astype(float); al = arr.max(2); rgb = np.where(al[..., None] > 0, arr / np.maximum(al[..., None], 1) * 255, 0)
img.alpha_composite(Image.fromarray(np.dstack([np.clip(rgb, 0, 255), al]).astype(np.uint8), 'RGBA'), (96, 264))
import os
f = ImageFont.truetype('fonts/fontsource-inter-tight-5.3.0/package/files/inter-tight-latin-700-normal.woff2', int(os.environ.get('SIZE', 60)))
lh = int(os.environ.get('LH', 70)); y0 = float(os.environ['Y0']) if os.environ.get('Y0') else 420 - (len(text) - 1) * lh / 2
def draw(d, shadow):
    for li, line in enumerate(text):
        words = line.split(' '); adv = lambda s: sum(f.getlength(c) + 1 for c in s)
        tw = sum(adv(w) for w in words) + adv(' ') * (len(words) - 1) - 1; x = 518 - tw / 2
        for wi, wd in enumerate(words):
            col = (0, 0, 0, 200) if shadow else ('#6E9BFF' if wd.strip('.,:?!').upper() in blue else '#F2F5FA')
            for ch in wd + (' ' if wi < len(words) - 1 else ''): d.text((x, y0 + li * lh), ch, font=f, fill=col, anchor='lm'); x += f.getlength(ch) + 1
sh = Image.new('RGBA', (W, H), (0, 0, 0, 0)); draw(ImageDraw.Draw(sh), True)
img = Image.alpha_composite(img, sh.filter(ImageFilter.GaussianBlur(12))); draw(ImageDraw.Draw(img), False)
img.save(out); print('ok', out)
