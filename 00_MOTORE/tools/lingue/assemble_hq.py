"""HQ voice assembler (v3, 29 Oct 2026). One take per language, realigned on the script. Cuts each clip at sentence boundaries from the TTS word timestamps
(never through a word), extends the tail while the voice is still audible, applies raised-cosine fades on every
edge, places parts with designed gaps at 48 kHz float, writes 24-bit WAV + words.json + cues.json.
usage: python3 assemble_hq.py <lang> <outdir>"""
import sys, json, subprocess, numpy as np, soundfile as sf
SR=48000; LSP=1.7; DVGAP=0.32; HOLD=0.95
lang=sys.argv[1]; out=sys.argv[2]
W=json.load(open('words_src.json'))
def load(name):
    x=subprocess.run(['ffmpeg','-loglevel','error','-i',name+'.mp3','-af','aresample=48000:resampler=soxr:precision=28','-ac','1','-f','f32le','-'],capture_output=True).stdout
    return np.frombuffer(x,dtype=np.float32).astype(np.float64)
def sentences(ws):
    out=[]; cur=[]
    for w in ws:
        cur.append(w)
        if w[0].rstrip('"\'')[-1:] in '.。?!।؟॥': out.append(cur); cur=[]
    if cur: out.append(cur)
    return out
def rms_db(x,i,n): s=x[max(0,i):i+n]; return 20*np.log10(np.sqrt((s**2).mean())+1e-12)
def cut(x,s,nxt):
    a=max(0.0,s[0][1]-0.10); b=s[-1][2]+0.10; lim=(nxt-0.04) if nxt is not None else len(x)/SR
    # extend the tail while still audible (> -48 dBFS over 10 ms), never into the next sentence
    i=int(b*SR); n=int(0.01*SR)
    while i<int(lim*SR) and rms_db(x,i,n)>-48: i+=n
    b=min(lim, i/SR+0.06)
    seg=x[int(a*SR):int(b*SR)].copy()
    fi,fo=int(0.015*SR),int(0.035*SR)
    seg[:fi]*=0.5-0.5*np.cos(np.linspace(0,np.pi,fi)); seg[-fo:]*=0.5+0.5*np.cos(np.linspace(0,np.pi,fo))
    return seg,a
_ALL={}
import vw_text as T
def parts(clip):
    # one-take mode: the whole voiceover read in one TTS call ({lang}_all) so tone and energy stay continuous.
    # Timestamps are realigned onto the script's own tokens (captions = script, never the TTS's spelling).
    import os; KEY=os.environ.get('VKEY',f'{lang}_all')
    if KEY in W:
        if not _ALL:
            GL,LJ,S=T.load(lang); R=T.realign(lang,S,W[KEY])
            _ALL['x']=load(KEY); seq=[]
            for p in [q for q,_ in S['parts']]+['guard']:
                for snt in sentences(R[p]): seq.append((p,snt))
            _ALL['seq']=seq
        seq=_ALL['seq']; res=[]
        for k,(p,snt) in enumerate(seq):
            if p!=clip: continue
            seg,a=cut(_ALL['x'],snt,seq[k+1][1][0][1]); res.append((seg,a,snt))
        return res
    x=load(f'{lang}_{clip}'); ss=sentences(W[f'{lang}_{clip}'])[:-1]          # last sentence is the guard
    gs=sentences(W[f'{lang}_{clip}'])
    res=[]
    for k in range(len(ss)):
        nxt=gs[k+1][0][1]
        seg,a=cut(x,ss[k],nxt); res.append((seg,a,ss[k]))
    return res
PLAN=[('hook',0.25,0.45),('l1',0.60,0.30),('l2',0.40,0.35)]
v=np.zeros(SR*60); words=[]; cues={}; t=0.0
for clip,gap,igap in PLAN:
    ps=parts(clip)
    for k,(seg,a,ws) in enumerate(ps):
        t+=gap if k==0 else igap
        i0=int(t*SR); v[i0:i0+len(seg)]+=seg
        words+=[[w[0],round(t+(w[1]-a),3),round(t+(w[2]-a),3)] for w in ws]
        cues[f'{clip}{k}']=[round(t+(ws[0][1]-a),3),round(t+(ws[-1][2]-a),3)]; t+=len(seg)/SR
    cues[clip]=[cues[f'{clip}0'][0],cues[f'{clip}{len(ps)-1}'][1]]
logo0=t+0.6; wm=logo0+1.75/LSP
br=parts('brand')
(sa,aa,wa),(sb,ab,wb)=br
ta=wm-(wa[0][1]-aa); v[int(ta*SR):int(ta*SR)+len(sa)]+=sa
tb=ta+(wa[-1][2]-aa)+DVGAP-(wb[0][1]-ab); v[int(tb*SR):int(tb*SR)+len(sb)]+=sb
cues['sw']=[round(ta+wa[0][1]-aa,3),round(ta+wa[-1][2]-aa,3)]; cues['dvv']=[round(tb+wb[0][1]-ab,3),round(tb+wb[-1][2]-ab,3)]
cues['logo0']=round(logo0,3); cues['loop0']=round(cues['dvv'][1]+HOLD,3)
total=cues['loop0']+0.5; v=v[:int((total+0.3)*SR)]
peak=np.abs(v).max(); 
if peak>0.97: v*=0.97/peak
sf.write(f'{out}/vo.wav',v,SR,subtype='PCM_24')
# captions show what the viewer must read: digits for spoken numbers, real brand spelling, no tashkeel
import os
if os.path.exists(f'{out}/lang.json'): words=T.display_tokens(lang,json.load(open(f'{out}/lang.json')),words)
json.dump(words,open(f'{out}/words.json','w'),ensure_ascii=False); json.dump({'cues':cues},open(f'{out}/cues.json','w'),indent=1)
print(lang,json.dumps(cues),'total',round(total,2),'peak',round(float(peak),3))
