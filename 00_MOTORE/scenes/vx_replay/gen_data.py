"""Simulated ES 1m session for CREATIVE 01 (no real market data). Deterministic."""
import json, numpy as np
rng = np.random.default_rng(20261030)
q = lambda x: round(x * 4) / 4
A = [(0,7727.0),(8,7733.5),(16,7740.25),(20,7736.0),(27,7729.0),(34,7724.0),(40,7729.5),(48,7735.75),(55,7732.0),(59,7733.25),
     (63,7736.5),(68,7740.5),(71,7737.5),(75,7739.5),(78,7742.75),(81,7745.5),(84,7744.25),(87,7745.75),(90,7745.25)]
N = 91
def anchor(i):
    for (a,pa),(b,pb) in zip(A,A[1:]):
        if a <= i <= b: u=(i-a)/(b-a); return pa+(pb-pa)*(0.5-0.5*np.cos(np.pi*u))
    return A[-1][1]
def vol(i):  # volatility regime: quiet history, a little more in replay, expansion on the break
    return 0.55 if i < 60 else (0.75 if i < 77 else 1.25)
bars=[]; prev=7726.75
for i in range(N):
    v=vol(i); o=prev; c=q(anchor(i)+rng.normal(0,v*0.45))
    if c==o and rng.random()<0.6: c=o+0.25*rng.choice([-1,1])
    up=max(o,c)+q(abs(rng.normal(0,v*0.55))); dn=min(o,c)-q(abs(rng.normal(0,v*0.55)))
    bars.append(dict(o=o,h=up,l=dn,c=c)); prev=c
# structure constraints: one clean swing high and one clean swing low in the history
SH,SL=7741.50,7722.75
for i,b in enumerate(bars):
    if i<60:
        b['h']=min(b['h'],SH-0.25); b['l']=max(b['l'],SL+0.25)
    elif i<78:
        b['h']=min(b['h'],SH-0.25)
    b['h']=max(b['h'],b['o'],b['c']); b['l']=min(b['l'],b['o'],b['c'])
bars[16]['h']=SH; bars[34]['l']=SL
bars[68]['h']=SH-0.25   # replay tests the drawn resistance and backs off: the level does its job
bars[81]['h']=max(bars[81]['h'],7746.75)
# intrabar tick paths (open -> extremes -> close), 14 points each
for i,b in enumerate(bars):
    first_low = rng.random()<0.5 if b['c']>=b['o'] else rng.random()<0.25
    e1,e2=(b['l'],b['h']) if first_low else (b['h'],b['l'])
    pts=[b['o']]; key=[(0.25+0.15*rng.random(),e1),(0.6+0.15*rng.random(),e2),(1.0,b['c'])]
    k0=(0.0,b['o'])
    for k1 in key:
        for s in range(1,5):
            u=s/4; p=k0[1]+(k1[1]-k0[1])*u+(rng.normal(0,0.2) if s<4 else 0)
            pts.append(q(min(b['h'],max(b['l'],p))))
        k0=k1
    pts[-1]=b['c']; b['path']=pts
    b['v']=int(rng.normal(900,250)*(1.0 if i<60 else 1.3 if i<77 else 2.4)); b['v']=max(200,b['v'])
    b['d']=int((b['c']-b['o'])*180+rng.normal(0,90))  # bar delta for CVD
json.dump(dict(bars=bars,SH=SH,SL=SL),open('data.json','w'))
print(max(b['h'] for b in bars[:60]),min(b['l'] for b in bars[:60]),max(b['h'] for b in bars[60:78]),max(b['h'] for b in bars), [ (i,b['c']) for i,b in enumerate(bars) if i%5==0])
