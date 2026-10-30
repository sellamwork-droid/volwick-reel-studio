"""Simulated ES 1m session for CREATIVE 05 EDIT (no real market data). Deterministic, seed fixed."""
import json, numpy as np
rng = np.random.default_rng(20261105)
q = lambda x: round(x * 4) / 4
A = [(0,7738.0),(10,7741.0),(18,7736.5),(26,7733.0),(33,7730.5),(38,7729.75),(42,7731.5),(47,7730.25),(52,7734.0),
     (58,7737.5),(63,7736.25),(69,7740.5),(74,7743.25),(78,7741.5),(83,7743.75),(87,7742.75),(91,7744.0)]
N = 92
def anchor(i):
    for (a,pa),(b,pb) in zip(A,A[1:]):
        if a <= i <= b: u=(i-a)/(b-a); return pa+(pb-pa)*(0.5-0.5*np.cos(np.pi*u))
    return A[-1][1]
bars=[]; prev=7737.75
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
