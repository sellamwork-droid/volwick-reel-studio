"""P04 voice track: clips cut before the guard sentence, split at their longest silences, placed with designed gaps.
Writes ../vo_p04.wav, ../scenes/p04/words.json and cues.json."""
import soundfile as sf, numpy as np, json, sys, os
sr=44100
def segs(x,thr=-40,gap=15):
    W=int(0.01*sr); L=np.array([20*np.log10(np.sqrt((x[i:i+W]**2).mean())+1e-12) for i in range(0,len(x)-W,W)])
    sp=L>thr; out=[];i=0
    while i<len(sp):
        if sp[i]:
            j=i;last=i
            while j<len(sp):
                if sp[j]: last=j; j+=1
                else:
                    k=j
                    while k<len(sp) and not sp[k]: k+=1
                    if k-j>=gap or k>=len(sp): break
                    j=k
            out.append([i*0.01,(last+1)*0.01]); i=last+1
        else: i+=1
    return out
# HeyGen word times (relative only) and the guard start, per clip
HG=json.load(open('hg_p4.json'))
def load(name):
    x,r=sf.read(name+'.wav'); assert r==sr
    if name in HG and 'guard' in HG[name]:
        s=segs(x); keep=[q for q in s if q[0] < HG[name]['guard']-0.35]; end=keep[-1][1]+0.12
        x=x[:int(end*sr)].copy(); n=int(0.04*sr); x[-n:]*=np.linspace(1,0,n)
    return x
def split(x,k):
    """split at the k longest silences -> list of (audio, onset, offset) with onsets/offsets relative to each part"""
    s=segs(x)
    if k==0: return [(x,s[0][0],s[-1][1])]
    gaps=sorted(sorted([(s[i+1][0]-s[i][1],i) for i in range(len(s)-1)],reverse=True)[:k],key=lambda g:g[1])
    cuts=[int(((s[i][1]+s[i+1][0])/2)*sr) for _,i in gaps]; parts=[]; a=0
    for c in cuts+[len(x)]:
        p=x[a:c]; ps=segs(p); parts.append((p,ps[0][0],ps[-1][1])); a=c
    return parts
def place(v,p,t0): v[int(t0*sr):int(t0*sr)+len(p)]+=p
PLAN=[ # key, clip, gap before first part, internal gaps, word counts per part
 ('hook','p4_hook',0.10,[0.40],[2,2]),
 ('l1','p4_l1',0.55,[],None),
 ('l2','p4_l2',0.25,[],None),
 ('l3','p4_l3',0.30,[],None),
 ('l4','p4_l4',0.35,[],None),
 ('l5','p4_l5',0.40,[],None),
 ('held','p4_held',1.00,[],None),
 ('l7','p4_l7',0.55,[],None),
 ('cta','p4_cta',0.50,[0.45],[4,4]),
]
LSP=1.7; HOLD=0.95; DVGAP=float(sys.argv[2]) if len(sys.argv)>2 else 0.32; BRAND=sys.argv[1] if len(sys.argv)>1 else 'v4_bA'
v=np.zeros(int(60*sr)); words=[]; cues={}; t=0.0
for key,clip,gap,igaps,counts in PLAN:
    x=load(clip); parts=split(x,len(igaps)); hw=HG[clip]['words']; wi=0; t+=gap; cues[key]=[]
    for j,(p,on,en) in enumerate(parts):
        if j>0: t+=igaps[j-1]
        st=t-on; place(v,p,st)
        ws=hw[wi:wi+(counts[j] if counts else len(hw))]; wi+=len(ws)
        h0,h1=ws[0][1],ws[-1][2]; f=(en-on)/max(1e-3,h1-h0)
        words+=[[w,round(st+on+(a-h0)*f,3),round(st+on+(b-h0)*f,3)] for w,a,b in ws]
        cues[key].append([round(st+on,3),round(st+en,3)]); t=st+en
logo0=t+0.25; wm=logo0+1.75/LSP
x=load(BRAND); (a,ona,ena),(b,onb,enb)=split(x,1)
sa=wm-ona; place(v,a,sa); sb=sa+ena+DVGAP-onb; place(v,b,sb)
cues['sw']=[round(sa+ona,3),round(sa+ena,3),BRAND]; cues['dvv']=[round(sb+onb,3),round(sb+enb,3),BRAND]
cues['logo0']=round(logo0,3); cues['loop0']=round(sb+enb+HOLD,3)
total=cues['loop0']+0.5; v=v[:int((total+0.3)*sr)]
os.makedirs('../scenes/p04',exist_ok=True)
sf.write('../vo_p04.wav',v,sr,subtype='PCM_16')
json.dump(words,open('../scenes/p04/words.json','w')); json.dump({'cues':cues},open('../scenes/p04/cues.json','w'),indent=1)
print(json.dumps(cues)); print('total',round(total,2))
