"""VOLWICK REEL STUDIO · indice degli hook.
Scansiona 01_HOOK/clip (anche sottocartelle), e per ogni clip nuovo calcola: durata, risoluzione, momento di massima azione,
direzione del movimento del soggetto (sale, scende, sale e ricade, scende e risale, orizzontale, fermo) e intensità.
Crea una scheda con 6 fotogrammi in 01_HOOK/_schede e aggiorna 01_HOOK/CATALOGO_HOOK.csv senza toccare le colonne scritte a mano
(evento_mercato, formato_consigliato, stato, note).
uso:  python3 00_MOTORE/tools/hook_index.py            (dalla cartella 13_REEL_STUDIO)"""
import csv, json, os, subprocess, sys
import numpy as np
from PIL import Image

ROOT = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else '.')
CLIPS, SHEETS, CSV = os.path.join(ROOT, '01_HOOK', 'clip'), os.path.join(ROOT, '01_HOOK', '_schede'), os.path.join(ROOT, '01_HOOK', 'CATALOGO_HOOK.csv')
EXT = ('.mp4', '.mov', '.m4v', '.webm', '.mkv')
AUTO = ['file', 'durata_s', 'risoluzione', 'verticale', 'picco_azione_s', 'movimento', 'intensita']
HAND = ['evento_mercato', 'formato_consigliato', 'stato', 'note']
os.makedirs(SHEETS, exist_ok=True)

def probe(p):
    o = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height:format=duration', '-of', 'json', p]))
    s = o['streams'][0]; return float(o['format']['duration']), int(s['width']), int(s['height'])

def frames(p, fps=8, w=90, h=160):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-vf', f'fps={fps},scale={w}:{h},format=gray', '-f', 'rawvideo', '-'], capture_output=True).stdout
    n = len(raw) // (w * h); return np.frombuffer(raw[:n * w * h], np.uint8).reshape(n, h, w).astype(np.float32)

def analyse(F, fps=8):
    if len(F) < 3: return 0.0, 'fermo', 0.0
    D = np.abs(np.diff(F, axis=0)); D[D < 12] = 0                  # pixel changes, noise removed
    E = D.mean(axis=(1, 2)); peak = (int(E.argmax()) + 1) / fps
    ys = np.arange(F.shape[1])[None, :, None]; xs = np.arange(F.shape[2])[None, None, :]
    tot = D.sum(axis=(1, 2)) + 1e-6; cy = (D * ys).sum(axis=(1, 2)) / tot; cx = (D * xs).sum(axis=(1, 2)) / tot
    act = E > max(1.0, 0.25 * E.max())                              # only frames where something really moves
    if act.sum() < 3: return round(peak, 2), 'fermo', round(float(E.max()), 1)
    y, x = cy[act], cx[act]; H, W = F.shape[1], F.shape[2]
    third = max(1, len(y) // 3); y0, ym, y1 = y[:third].mean(), y[third:-third or None].mean() if len(y) > 2 else y.mean(), y[-third:].mean()
    dy, dx = (y1 - y0) / H, (x[-third:].mean() - x[:third].mean()) / W
    if ym < min(y0, y1) - 0.06 * H: mv = 'sale e ricade'               # screen y smaller = higher on screen
    elif ym > max(y0, y1) + 0.06 * H: mv = 'scende e risale'
    elif dy < -0.08: mv = 'sale'
    elif dy > 0.08: mv = 'scende'
    elif abs(dx) > 0.15: mv = 'orizzontale'
    else: mv = 'sul posto'
    return round(peak, 2), mv, round(float(E.max()), 1)

def sheet(p, dur, out):
    ims = []
    for k in range(6):
        t = dur * (0.04 + 0.92 * k / 5)
        r = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{t:.2f}', '-i', p, '-frames:v', '1', '-vf', 'scale=180:320:force_original_aspect_ratio=decrease,pad=180:320:(ow-iw)/2:(oh-ih)/2', '-f', 'image2pipe', '-vcodec', 'png', '-'], capture_output=True).stdout
        if r: import io; ims.append(Image.open(io.BytesIO(r)).convert('RGB'))
    if not ims: return
    W = Image.new('RGB', (len(ims) * 184, 320), 'black')
    for i, im in enumerate(ims): W.paste(im, (i * 184, 0))
    W.save(out)

rows = {}
if os.path.exists(CSV):
    with open(CSV, newline='', encoding='utf-8') as f:
        for r in csv.DictReader(f): rows[r['file']] = r
files = sorted(os.path.relpath(os.path.join(d, n), CLIPS) for d, _, fs in os.walk(CLIPS) for n in fs if n.lower().endswith(EXT))
new = 0
for rel in files:
    if rel in rows and rows[rel].get('movimento'): continue
    p = os.path.join(CLIPS, rel)
    try:
        dur, w, h = probe(p); pk, mv, en = analyse(frames(p))
    except Exception as e:
        print('salto', rel, e); continue
    r = rows.get(rel, {k: '' for k in HAND}); r.update(file=rel, durata_s=round(dur, 2), risoluzione=f'{w}x{h}', verticale='sì' if h > w else 'no', picco_azione_s=pk, movimento=mv, intensita=en)
    r.setdefault('stato', ''); r['stato'] = r['stato'] or 'da vedere'; rows[rel] = r; new += 1
    sheet(p, dur, os.path.join(SHEETS, os.path.splitext(rel.replace(os.sep, '__'))[0] + '.png'))
for gone in [k for k in rows if k not in files]: rows[gone]['stato'] = 'file mancante'
with open(CSV, 'w', newline='', encoding='utf-8') as f:
    wr = csv.DictWriter(f, fieldnames=AUTO + HAND); wr.writeheader()
    for k in sorted(rows): wr.writerow({c: rows[k].get(c, '') for c in AUTO + HAND})
print(f'clip totali {len(files)}, analizzati ora {new}, catalogo {CSV}')
