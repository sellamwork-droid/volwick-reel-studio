import soundfile as sf, numpy as np, json, sys
sr=44100
PICK=json.load(open('picks_v4.json')) if len(sys.argv)<2 else json.loads(sys.argv[1])
HG={
 'hook':{'g_hookA':[['One',.2,.24],['price.',.32,.72],['Two',.96,1.44],['outcomes.',1.502,2.0]],
         'g_hookB':[['One',0,.08],['price...',.187,.72],['two',1.416,1.44],['outcomes.',1.502,2.0]],
         'g_hookC':[['One',.34,.4],['PRICE.',.533,1.2],['Two',1.7,2.0],['outcomes.',2.089,2.8]]},
 'held':{'q_heldA':[['And',.13,.16],['it',.24,.4],['HELD.',.52,1.04]],
         'q_heldB':[['And...',0,.4],['it',.96,1.92],['held.',2.0,2.32]],
         'q_heldC':[['And',.2,.24],['it',.32,.48],['held.',.64,1.28]]},
 'sw':{'q_swA':[['See',.204,.24],['what',.272,.4],['others',.48,.96],["can't.",1.06,1.52]],
       'g_swB':[['See',0,.08],['what',.128,.32],['others',.377,.72],["can't.",.78,1.12]],
       'g_swC':[['See',.2,.24],['what',.272,.4],['others...',.469,.88],["can't.",1.24,1.52]]},
 'c1':{'q_c1':[['Forty',.2,.24],['minutes',.28,.56],['earlier,',.61,.96],['SPY',1.52,2.16],['was',2.26,2.56],['flat.',2.656,3.04]]},
 'c2':{'q_c2':[['But',.21,.24],['off',.32,.56],['the',.6,.72],['exchange,',.8,1.44],['large',1.76,2.16],['blocks',2.24,2.72],['kept',2.768,2.96],['printing',3.013,3.44],['at',3.547,3.76],['the',3.8,3.92],['same',3.984,4.24],['price.',4.333,4.8]]},
 'e1':{'q_e1':[['Your',0,.24],['chart',.307,.64],['only',.704,.96],['blends',1.029,1.44],['them',1.504,1.76],['into',1.824,2.08],['volume.',2.149,2.56]]},
 'e2':{'q_e2':[['Volwick',.204,.48],['puts',.576,.96],['each',1.008,1.2],['print',1.267,1.6],['where',1.627,1.76],['it',1.787,1.84],['traded.',1.92,2.4]]},
 'x1':{'q_x1':[['Then',0,.24],['price',.293,.56],['came',.608,.8],['back',.848,1.04],['to',1.067,1.12],['that',1.152,1.28],['level.',1.333,1.6]]},
 'l1':{'q_l1':[['Not',.21,.24],['a',.34,.44],['signal.',.469,.64],['It',.96,1.44],['could',1.467,1.6],['have',1.616,1.68],['broken.',1.737,2.08]]},
 'cta':{'v4_ctaB':[['The',.068,.08],['chart',.133,.4],['shows',.453,.72],['the',.74,.8],['candles.',.88,1.44],['Volwick',3.46,3.76],['shows',3.84,4.24],['the',4.26,4.32],['prints.',4.387,4.88]],
        'v4_ctaC':[['The',.068,.08],['chart',.147,.48],['shows',.547,.88],['the',.9,.96],['candles.',1.04,1.6],['Volwick',2.74,2.96],['shows',3.027,3.36],['the',3.4,3.52],['prints.',3.6,4.08]],
        'g_cta':[['The',0,.08],['chart',.147,.48],['shows',.547,.88],['the',.92,1.04],['candles.',1.11,1.6],['Volwick',2.477,2.887],['shows',2.967,3.367],['the',3.387,3.447],['prints.',3.527,4.007]]},
}
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
def mapwords(x,hw):
    s=segs(x); on,en=s[0][0],s[-1][1]
    # sentence groups split on words ending with . ... ,? use real segment count when it matches sentence count
    groups=[]; cur=[]
    for w in hw:
        cur.append(w)
        if w[0].endswith('.') : groups.append(cur); cur=[]
    if cur: groups.append(cur)
    out=[]
    if len(groups)==len(s) and len(groups)>1:
        for g,(a,b) in zip(groups,s):
            h0,h1=g[0][1],g[-1][2]; f=(b-a)/max(1e-3,h1-h0)
            out+=[[w,a+(p-h0)*f,a+(q-h0)*f] for w,p,q in g]
    else:
        h0,h1=hw[0][1],hw[-1][2]; f=(en-on)/max(1e-3,h1-h0)
        out=[[w,on+(p-h0)*f,on+(q-h0)*f] for w,p,q in hw]
    return out,on,en
BR={'v4_bA':[['See',.068,.08],['what',.112,.24],['others',.286,.56],["can't.",.64,1.12],['Discover',3.241,3.36],['Volwick.',3.42,3.92]],
    'v4_bB':[['See',.14,.32],['what',.352,.48],['others',.549,.96],["can't.",1.06,1.6],['Discover',3.263,3.363],['Volwick.',3.463,4.003]],
    'v4_bC':[['See',.136,.16],['what',.192,.32],['others',.366,.64],["can't.",.76,1.36],['Discover',2.909,2.96],['Volwick.',3.06,3.6]]}
GUARD={'v4_bA':6.997,'v4_bB':5.4,'v4_bC':4.837,'v4_ctaB':6.917,'v4_ctaC':5.699}
import os
def cut(name):
    """raw HeyGen clip -> clip without the guard sentence (cut in the silence before it), 40 ms fade"""
    if os.path.exists('cut_'+name+'.wav'): return sf.read('cut_'+name+'.wav')[0]
    x,r=sf.read(name+'.wav'); assert r==sr, r
    if x.ndim>1: x=x.mean(1)
    s=segs(x); g=GUARD[name]
    # last speech segment that starts before the guard (HeyGen time is approximate, the pause is >1 s)
    keep=[q for q in s if q[0] < g-0.35]; end=keep[-1][1]+0.12
    y=x[:int(end*sr)].copy(); n=int(0.04*sr); y[-n:]*=np.linspace(1,0,n); sf.write('cut_'+name+'.wav',y,sr,subtype='PCM_16'); return y
order=['hook','c1','c2','e1','e2','x1','held','l1','cta']
gapb={'hook':0.10,'c1':0.60,'c2':0.25,'e1':0.25,'e2':0.22,'x1':0.35,'held':1.00,'l1':0.45,'cta':0.40}
LSP=1.7; DVGAP=float(PICK.get('dvgap',0.32)); HOLD=1.05
v=np.zeros(int(60*sr)); words=[]; cues={}; t=0.0
for k in order:
    name=PICK.get(k, list(HG[k].keys())[0]); x=cut(name) if name.startswith('v4_') else sf.read('cut_'+name+'.wav')[0]
    mw,on,en=mapwords(x,HG[k][name])
    start = gapb[k] if k=='hook' else t+gapb[k]
    v[int(start*sr):int(start*sr)+len(x)]+=x
    words+=[[w,round(start+a,3),round(start+b,3)] for w,a,b in mw]
    cues[k]=[round(start+on,3),round(start+en,3),name]; t=start+en
logo0=t+0.30; wm=logo0+1.75/LSP
name=PICK.get('brand','v4_bA')
BR['combo']=HG['sw']['q_swA']+[['Discover',.13,.6],['Volwick.',.66,1.19]]
if name=='combo' or os.path.exists(name+'.wav') or os.path.exists('cut_'+name+'.wav'):
    if name=='combo':   # slogan take A (v3) + the earlier v3 "Discover Volwick." clip
        a=sf.read('cut_q_swA.wav')[0]; b=sf.read('cut_x_dv.wav')[0]
    else:
        x=cut(name); s=segs(x)
        # split "See what others can't." | "Discover Volwick." at the longest silence
        gaps=[(s[i+1][0]-s[i][1],i) for i in range(len(s)-1)]; gi=max(gaps)[1]; sp=int(((s[gi][1]+s[gi+1][0])/2)*sr)
        a,b=x[:sp],x[sp:]
    mwa,ona,ena=mapwords(a,BR[name][:4]); bw=[[w,p-BR[name][4][1],q-BR[name][4][1]] for w,p,q in BR[name][4:]]
    mwb,onb,enb=mapwords(b,BR[name][4:])
    sa=wm-ona; v[int(sa*sr):int(sa*sr)+len(a)]+=a
    sb=sa+ena+DVGAP-onb; v[int(sb*sr):int(sb*sr)+len(b)]+=b
    sw=[[w,round(sa+p,3),round(sa+q,3)] for w,p,q in mwa]; dvw=[[w,round(sb+p,3),round(sb+q,3)] for w,p,q in mwb]
    cues['sw']=[round(sa+ona,3),round(sa+ena,3),name]; cues['dvv']=[round(sb+onb,3),round(sb+enb,3),name]
else:   # provisional: old slogan clip, discover slot kept silent
    x=sf.read('cut_q_swA.wav')[0]; mw,on,en=mapwords(x,HG['sw']['q_swA']); sa=wm-on; v[int(sa*sr):int(sa*sr)+len(x)]+=x
    sw=[[w,round(sa+p,3),round(sa+q,3)] for w,p,q in mw]; dvw=[]; cues['sw']=[round(sa+on,3),round(sa+en,3),'q_swA']; cues['dvv']=[round(sa+en+DVGAP,3),round(sa+en+DVGAP+0.75,3),'PLACEHOLDER']
cues['logo0']=round(logo0,3); cues['loop0']=round(cues['dvv'][1]+HOLD,3)
total=cues['loop0']+0.5; v=v[:int((total+0.3)*sr)]
sf.write('../vo_p03v4.wav',v,sr,subtype='PCM_16')
json.dump(words,open('../scenes/p03v4/words.json','w')); json.dump({'cues':cues,'sw':sw,'dv':dvw},open('../scenes/p03v4/cues.json','w'),indent=1)
print(json.dumps(cues)); print('total',round(total,2))
