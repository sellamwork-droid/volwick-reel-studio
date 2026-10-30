"""VOLWICK · sound design generator driven by a scene's event map.
usage: python3 vw_sound.py events.json out.wav     (events = READY() output of the scene)
All sounds are synthesized here: no third-party samples, no licensing exposure."""
import json, sys, numpy as np, scipy.signal as ss, soundfile as sf
ev=json.load(open(sys.argv[1])); E=ev['events']; DUR=ev['total']+0.3
SR=48000; n=int(SR*DUR); t=np.arange(n)/SR; rng=np.random.default_rng(7)
L=np.zeros(n); R=np.zeros(n)
def lp(x,f,o=4): return ss.sosfilt(ss.butter(o,f,'low',fs=SR,output='sos'),x)
def hp(x,f,o=2): return ss.sosfilt(ss.butter(o,f,'high',fs=SR,output='sos'),x)
def bp(x,lo,hi,o=2): return ss.sosfilt(ss.butter(o,[lo,hi],'band',fs=SR,output='sos'),x)
def env(a,b,c,d): return np.clip((t-a)/max(b-a,1e-3),0,1)*(t<c)+np.clip(1-(t-c)/max(d-c,1e-3),0,1)*(t>=c)
def add(sig,at,pan=0.0,g=1.0):
    i=int(max(0,at)*SR); m=min(len(sig),n-i)
    if m<=0: return
    L[i:i+m]+=sig[:m]*g*np.sqrt((1-pan)/2); R[i:i+m]+=sig[:m]*g*np.sqrt((1+pan)/2)
def tick(f=2400,d=0.035): tt=np.arange(int(SR*d))/SR; return np.sin(2*np.pi*f*tt)*np.exp(-tt*140)
def whoosh(d=1.0):
    m=int(SR*d); x=rng.standard_normal(m); tt=np.arange(m)/SR; out=np.zeros(m)
    for j,(lo,hi) in enumerate(np.linspace([300,900],[2500,6000],8)): a=j*m//8; b=(j+1)*m//8; out[a:b]=bp(x,lo,hi)[a:b]
    return out*np.sin(np.pi*tt/d)**2
def boom(f0=50,d=1.8):
    tt=np.arange(int(SR*d))/SR; f=f0*(1+1.4*np.exp(-tt*14))
    return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tt*2.6)+lp(rng.standard_normal(len(tt)),180)*np.exp(-tt*9)*0.5
def ping(f=1600,d=0.5): tt=np.arange(int(SR*d))/SR; return (np.sin(2*np.pi*f*tt)+.4*np.sin(2*np.pi*f*2.76*tt))*np.exp(-tt*11)
# bed: low drone that lifts on the divergence and ducks at the end
pad=np.zeros(n)
for f,a in [(55,1),(82.41,.55),(110,.5),(130.81,.22),(164.81,.28),(220,.12)]:
    for det in (-0.12,0.12): pad+=a*np.sin(2*np.pi*(f+det)*t+rng.random()*6)
pad=lp(pad/6+lp(rng.standard_normal(n),420)*0.6,900)*(0.55+0.45*np.sin(2*np.pi*0.07*t))
pad*=env(0,0.05,E.get('loop0',E['beat']+1.0),DUR)*(0.6+0.4*env(E['div']-0.3,E['div']+0.2,E['volwick']-0.5,E['volwick']+0.3))*0.16
add(pad,0,-.1); add(np.roll(pad,int(.013*SR)),0,.1)
# 3-5 contact moments + light texture (playbook rule)
add(boom(48,1.6),0.0,g=.7); add(ping(1400,.6),0.0,g=.09)            # first frame
add(boom(40,1.6),E['hookBuyers'],g=(.4 if ('breakHit' in E or 'softBoom' in E) else .65))                              # BUYERS
add(whoosh(0.5)[::-1],E['rw0']-0.05,g=.3)                              # rewind
add(ping(880,1.2),E['div'],g=.08); add(ping(1318,1.2),E['div']+0.02,g=.05)   # divergence: neutral accent, no bearish drop
add(boom(44,2.6),E['beat'],g=.3)                                     # wordmark
for k in range(20): add(tick(2500+rng.integers(-150,150)),E['b0']+k*((E['b1']-E['b0'])/20),pan=rng.uniform(-.4,.4),g=.05)
for j in range(3): add(ping(1700+j*140,.5),E['flow']+j*0.18,pan=(-.3,0,.3)[j],g=.06)
add(whoosh(0.9),E['cvdWord']-0.4,-.3,g=.14); add(whoosh(1.0),E['volwick']-0.5,.3,g=.16)
# Volwick sonic logo (identical on every video): soft sub swell + three-note glass chime E5 B5 E6, on the logo flash
def chime(f,d=1.6): tt=np.arange(int(SR*d))/SR; return (np.sin(2*np.pi*f*tt)+.25*np.sin(2*np.pi*f*2.01*tt))*np.exp(-tt*3.2)*np.clip(tt/0.004,0,1)
def sonic_logo(at):
    tt=np.arange(int(SR*1.8))/SR; sub=np.sin(2*np.pi*55*tt)*np.clip(tt/0.25,0,1)*np.exp(-tt*2.2); add(sub,at-0.05,g=.35)
    for j,(f,pn) in enumerate([(659.25,-.25),(987.77,.0),(1318.5,.25)]): add(chime(f),at+j*0.11,pan=pn,g=.11)
sonic_logo(E['beat'])
if 'holdHit' in E:   # support holds: soft, rounded low knock + a gentle high tone
    add(boom(74,0.9),E['holdHit'],g=.22); add(chime(783.99),E['holdHit']+0.02,pan=-.2,g=.045)
if 'breakHit' in E:  # support gives way: filtered noise drop under the sub
    m=int(SR*1.1); x=lp(rng.standard_normal(m),900)*np.exp(-np.arange(m)/SR*4.0); add(x,E['breakHit']+0.02,pan=.2,g=.10)
for k in ('swap0','swap','swap2'):
    if k in E: add(whoosh(0.7),E[k],pan=(-.3 if k=='swap' else .3),g=.10)
if 'riser0' in E and 'riser1' in E:   # tension before the decisive word: filtered noise that opens up, cut at the word
    d=max(0.2,E['riser1']-E['riser0']); m=int(SR*d); tt=np.arange(m)/SR; x=rng.standard_normal(m); out=np.zeros(m)
    for j,(lo,hi) in enumerate(np.linspace([180,500],[1400,4200],10)): a0=j*m//10; b0=(j+1)*m//10; out[a0:b0]=bp(x,lo,hi)[a0:b0]
    add(out*(tt/d)**1.6,E['riser0'],g=.07)
    for k in range(int(d/0.5)+1): add(boom(62,0.45),E['riser0']+k*0.5,g=.10)   # slow heartbeat under the slow-motion
if 'flip' in E:      # P&L changes sign: soft, short double tick
    add(ping(2350,0.25),E['flip'],pan=.15,g=.05); add(ping(3130,0.2),E['flip']+0.06,pan=.15,g=.035)
if 'bigPrint' in E:  # the large block on the retest: deep weighted thud + low gold tone
    add(boom(52,1.6),E['bigPrint'],g=.3); add(chime(587.33,2.0),E['bigPrint']+0.01,pan=-.1,g=.05); add(chime(880,1.6),E['bigPrint']+0.03,pan=.1,g=.03)
if 'dollar' in E: add(ping(1568,1.0),E['dollar'],g=.07); add(ping(2093,1.0),E['dollar']+0.03,g=.05)   # CTA accent
out=np.stack([L,R],1); out/=max(1e-9,np.abs(out).max())/0.6
sf.write(sys.argv[2],out,SR,subtype='PCM_24'); print('ok',DUR)
