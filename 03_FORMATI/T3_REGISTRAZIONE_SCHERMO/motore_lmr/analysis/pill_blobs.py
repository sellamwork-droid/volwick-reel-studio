# per-second block-print pill boxes in the 1 fps analysis frames (CSS px, x offset +1000)
import numpy as np, glob, json, sys
from PIL import Image
from scipy import ndimage as nd
d=sys.argv[1]; out=sys.argv[2]; res={}
for f in sorted(glob.glob(d+'/*.jpg')):
    n=f.split('/')[-1][:-4]; seg,i=n.split('_'); t=int(seg[:2])*3600+int(seg[2:4])*60+int(i)-1
    a=np.asarray(Image.open(f).convert('RGB')).astype(int); R,G,B=a[...,0],a[...,1],a[...,2]
    L=[]
    for name,m in (('gold',(R>200)&(G>160)&(G<215)&(B<120)),('white',(R>200)&(G>200)&(B>200))):
        m=m[:, :585]; lab,_=nd.label(nd.binary_closing(m,iterations=2))
        for sl in nd.find_objects(lab):
            h=sl[0].stop-sl[0].start; w=sl[1].stop-sl[1].start
            if 12<=h<=18 and 24<=w<=60 and m[sl].mean()>0.45: L.append([name,sl[1].start+1000,sl[0].start,w,h])
    res[t]=L
json.dump(res,open(out,'w'))
