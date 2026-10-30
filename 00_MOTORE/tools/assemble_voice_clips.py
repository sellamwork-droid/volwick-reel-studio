import soundfile as sf, numpy as np, json, sys
sr=44100
PICK=json.load(open('picks.json')) if len(sys.argv)<2 else json.loads(sys.argv[1])
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
 'cta':{'g_cta':[['The',0,.08],['chart',.147,.48],['shows',.547,.88],['the',.92,1.04],['candles.',1.11,1.6],['Volwick',2.477,2.887],['shows',2.967,3.367],['the',3.387,3.447],['prints.',3.527,4.007]]},
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
order=['hook','c1','c2','e1','e2','x1','held','l1','cta']
gapb={'hook':0.10,'c1':0.75,'c2':0.35,'e1':0.30,'e2':0.25,'x1':0.45,'held':1.00,'l1':0.55,'cta':0.45}
v=np.zeros(int(60*sr)); words=[]; cues={}; t=0.0
for k in order:
    name=PICK.get(k, list(HG[k].keys())[0]); x,_=sf.read('cut_'+name+'.wav')
    mw,on,en=mapwords(x,HG[k][name])
    start = gapb[k] if k=='hook' else t+gapb[k]
    v[int(start*sr):int(start*sr)+len(x)]+=x
    words+=[[w,round(start+a,3),round(start+b,3)] for w,a,b in mw]
    cues[k]=[round(start+on,3),round(start+en,3),name]; t=start+en
logo0=t+0.30; wm=logo0+1.21/1.0*1.0  # wordmark appears logo0+1.75/1.45
wm=logo0+1.75/1.45
name=PICK.get('sw','q_swA'); x,_=sf.read('cut_'+name+'.wav'); mw,on,en=mapwords(x,HG['sw'][name])
start=wm-on; v[int(start*sr):int(start*sr)+len(x)]+=x
sw=[[w,round(start+a,3),round(start+b,3)] for w,a,b in mw]
cues['sw']=[round(start+on,3),round(start+en,3),name]; cues['logo0']=round(logo0,3); cues['dv']=round(start+en+0.25,3); cues['loop0']=round(start+en+1.7,3)
total=cues['loop0']+0.5; v=v[:int((total+0.3)*sr)]
sf.write('../vo_p03v2.wav',v,sr,subtype='PCM_16')
json.dump(words,open('../scenes/p03v2/words.json','w')); json.dump({'cues':cues,'sw':sw},open('../scenes/p03v2/cues.json','w'),indent=1)
print(json.dumps(cues)); print('total',round(total,2))
