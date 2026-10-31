# key-level labels at the left edge of the chart (full composite px, 2x CSS): rows with bright text in x 0..300, OCR on change
import numpy as np, glob, json, subprocess, sys
from PIL import Image
idx=json.load(open('02_RECORDINGS/2026-10-27_ES/LMR_ES_2026-10-27_FULL_index.json'))
def et_of(off):
    seg=[s for s in idx if s['offset']<=off][-1]; return seg['start_et_s']+off-seg['offset']
fs=sorted(glob.glob('03_MARKET_EVENTS/2026-10-27_ES_leftstrip/*.jpg')); out=[]; last=None
for k,f in enumerate(fs):
    a=np.asarray(Image.open(f).convert('L')).astype(int)[:, :320]
    br=(a>150).sum(1); rows=np.where(br>12)[0]
    groups=[]
    for r in rows:
        if groups and r-groups[-1][1]<=3: groups[-1][1]=r
        else: groups.append([r,r])
    groups=[g for g in groups if 8<=g[1]-g[0]<=40]
    key=tuple((g[0]//4) for g in groups)
    labs=[]
    if key!=(last[0] if last else None) or k%30==0:
        for g in groups:
            y0,y1=max(0,g[0]-4),g[1]+5
            Image.fromarray(np.asarray(Image.open(f).convert('L'))[y0:y1, :330]).resize((660,(y1-y0)*2)).save('/tmp/claude-0/lab.png')
            txt=subprocess.run(['tesseract','/tmp/claude-0/lab.png','-','--psm','7'],capture_output=True,text=True).stdout.strip()
            labs.append([int(g[0]),int(g[1]),txt])
        last=(key,labs)
        out.append([round(et_of(k+0.5),1),labs])
json.dump(out,open('03_MARKET_EVENTS/2026-10-27_ES_level_labels.json','w'),indent=0)
def hms(t): t=int(t); return '%02d:%02d:%02d'%(t//3600,t%3600//60,t%60)
prev=None
for t,l in out:
    s=' | '.join(f'{a}-{b} {x}' for a,b,x in l)
    if s!=prev: print(hms(t),s); prev=s
