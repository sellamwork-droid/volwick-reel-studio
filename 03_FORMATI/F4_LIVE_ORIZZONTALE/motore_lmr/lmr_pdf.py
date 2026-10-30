#!/usr/bin/env python3
"""HTML of 1600x1000 pages -> PDF made of page images (looks the same on every reader, Power's PDF format).
usage: python3 lmr_pdf.py page.html out.pdf"""
import sys, os, tempfile
from playwright.sync_api import sync_playwright
from PIL import Image
src, out = os.path.abspath(sys.argv[1]), sys.argv[2]
with sync_playwright() as p, tempfile.TemporaryDirectory() as d:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1600, 'height': 1000}, device_scale_factor=2)
    pg.goto('file://' + src); pg.wait_for_timeout(800)
    n = pg.evaluate("document.querySelectorAll('.pg').length"); ims = []
    for i in range(n):
        el = pg.locator('.pg').nth(i); path = os.path.join(d, f'{i}.png'); el.screenshot(path=path)
        ims.append(Image.open(path).convert('RGB'))
    ims[0].save(out, save_all=True, append_images=ims[1:], resolution=200, quality=88)
    b.close()
print(out, n, 'pages')
