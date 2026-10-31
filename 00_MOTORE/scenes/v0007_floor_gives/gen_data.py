"""V0007 THE FLOOR GIVES (T1): simulated ES 1m session (no real market data). Deterministic, seed fixed.
A fast drop onto the long-gamma put wall / block-print floor at 7,729.75, a base, then a recovery."""
import json, numpy as np
rng = np.random.default_rng(20261107)
q = lambda x: round(x * 4) / 4
A = [(0,7742.5),(8,7744.0),(14,7741.5),(20,7737.0),(26,7732.5),(31,7730.25),(36,7729.75),(41,7731.0),(47,7730.0),(52,7732.5),
     (58,7735.0),(63,7734.0),(69,7737.5),(74,7739.75),(78,7738.5),(83,7740.5),(87,7739.75),(91,7741.0)]
N = 92
def anchor(i):
    for (a,pa),(b,pb) in zip(A,A[1:]):
        if a <= i <= b: u=(i-a)/(b-a); return pa+(pb-pa)*(0.5-0.5*np.cos(np.pi*u))
    return A[-1][1]
bars=[]; prev=7742.25
for i in range(N):
    v=0.7 if i<30 else (0.9 if i<55 else 1.1); o=prev; c=q(anchor(i)+rng.normal(0,v*0.45))
    if c==o and rng.random()<0.6: c=o+0.25*rng.choice([-1,1])
    up=max(o,c)+q(abs(rng.normal(0,v*0.6))); dn=min(o,c)-q(abs(rng.normal(0,v*0.6)))
    bars.append(dict(o=o,h=up,l=dn,c=c)); prev=c
for i,b in enumerate(bars):
    b['h']=min(b['h'],7745.25); b['l']=max(b['l'],7728.0)
    b['h']=max(b['h'],b['o'],b['c']); b['l']=min(b['l'],b['o'],b['c'])
for i,b in enumerate(bars):
    b['v']=max(200,int(rng.normal(950,260)*(1.0 if i<30 else 1.5 if i<55 else 1.8)))
    b['d']=int((b['c']-b['o'])*180+rng.normal(0,90))
json.dump(dict(bars=bars),open('data.json','w'))
print(max(b['h'] for b in bars),min(b['l'] for b in bars),[(i,b['c']) for i,b in enumerate(bars) if i%6==0])
