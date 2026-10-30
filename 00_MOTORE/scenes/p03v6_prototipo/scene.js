// ============================================================
// Scene P03 v6 · SILENT SIZE · "Same price. Different information."
// Two ILLUSTRATIVE scenarios built from the same session: same price, same block prints, same hypothetical trade
// (long 100 SPY at the level, exit at the close). Scenario A holds, scenario B breaks. The prints do not decide the
// direction; they show where size traded. Live chart: world at fixed scale, camera frames it.
// All data SIMULATED.
// ============================================================
const S = {};
const {COL, SAFE, seg, lin, eo, eio, mix, clamp} = VW;
const GOLD='#F2C14E', RED='#E2575F', GREEN=COL.up;

// ---------- simulated SPY session (tick 0.01) ----------
const N=64, LVL=761.95, SH=100, TOUCH=55;
const R=VW.rng(30311), gs=()=>{ let u=0,v=0; while(!u)u=R(); while(!v)v=R(); return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); };
const r2=x=>Math.round(x*100)/100;
function target(i){
  if (i<40) return 762.15+0.16*Math.sin(i*0.9)+0.06*Math.sin(i*2.3);
  if (i<50) return 762.15+1.05*eo((i-39)/10);
  if (i<56) return mix(763.20, LVL+0.02, eio((i-49)/6));
  return LVL+1.65*eo((i-55)/8);
}
const BARS=[]; { let c=762.10;
  for (let i=0;i<N;i++){ const o=c; let cl=r2(target(i)+gs()*0.03); if (i===TOUCH) cl=r2(LVL+0.04);
    const h=r2(Math.max(o,cl)+Math.abs(gs())*0.05+0.01); let l=r2(Math.min(o,cl)-Math.abs(gs())*0.05-0.01);
    if (i===TOUCH) l=r2(LVL-0.10); if (i<40) l=Math.max(l, LVL-0.04);
    BARS.push({o,h,l,c:cl,v:Math.round(52000+R()*38000)}); c=cl; } }
const PRINTS=[[12,412000],[15,186000],[18,640000],[21,233000],[25,318000],[28,575000],[32,204000],[36,489000]].map(([i,q])=>({i,q,p:LVL}));
PRINTS.forEach(pr=>{ BARS[pr.i].v+=Math.round(pr.q*0.12); });
const PRINTED=PRINTS.reduce((a,p)=>a+p.q,0);          // 3,057,000 shares at the level before the retest
const BIG={i:TOUCH,q:2400000,p:LVL};                  // a large block on the retest, at the level price (present in both scenarios)
BARS[TOUCH].v=Math.round(BARS[TOUCH].v*2.1); for (let i=TOUCH+1;i<N;i++) BARS[i].v=Math.round(BARS[i].v*1.75);
// scenario B: identical up to the touch, then the level gives way and the session closes at 761.33
const BARS_B=BARS.map(b=>({...b})); { const RB=VW.rng(40417); const t=TOUCH;
  BARS_B[t]={o:BARS[t].o,h:BARS[t].h,l:761.74,c:761.78,v:BARS[t].v};
  let c=761.78; for (let i=t+1;i<N;i++){ const o=c; let cl=(i===N-1)?761.33:r2(LVL-0.62*eo((i-t)/8)+(RB()-0.5)*0.05);
    const h=r2(Math.max(o,cl)+RB()*0.05+0.01), l=r2(Math.min(o,cl)-RB()*0.05-0.01); BARS_B[i]={o,h,l,c:cl,v:BARS[i].v}; c=cl; } }
window.DATA_CHECK={ entry:LVL, exitA:BARS[N-1].c, exitB:BARS_B[N-1].c, pnlA:r2((BARS[N-1].c-LVL)*SH), pnlB:r2((BARS_B[N-1].c-LVL)*SH),
  lowA:BARS[TOUCH].l, pnlLowA:r2((BARS[TOUCH].l-LVL)*SH), printedBefore:PRINTED, bigPrint:BIG.q };

// ---------- world (fixed scale) and viewport ----------
const K=480, BW=22, PMAX=763.95, PMIN=760.90;
const LB={cvd:{y0:0,y1:0},x0:0,x1:N*BW,y0:0,y1:(PMAX-PMIN)*K,pMin:PMIN,pMax:PMAX};
const cA=new VW.Chart(BARS,LB), cBB=new VW.Chart(BARS_B,LB);
const V={x0:96,x1:826,y0:466,y1:1408}; V.w=V.x1-V.x0; V.h=V.y1-V.y0; V.cx=(V.x0+V.x1)/2; V.cy=(V.y0+V.y1)/2;
const AX=836, CAP_Y=392, VOLH=74, VMAX=180000, LSP=1.7;
let CAM={cx:0,cy:0,s:1};
const SX=x=>V.cx+(x-CAM.cx)*CAM.s, SY=y=>V.cy+(y-CAM.cy)*CAM.s, WY=sy=>CAM.cy+(sy-V.cy)/CAM.s, PY=p=>cA.PY(p), X=i=>cA.X(i);

let WORDS=[], GROUPS=[], CUES={};
function W(word,nth=1,edge='s'){ let c=0; for (const w of WORDS){ if (w[0].replace(/[^\w']/g,'').toLowerCase()===word.replace(/[^\w']/g,'').toLowerCase()){ if (++c===nth) return edge==='s'?w[1]:w[2]; } } throw new Error('word not found: '+word+' #'+nth); }
let E={};
function buildTimeline(){
  E.diff=W('Different'); E.hookE=W('information.',1,'e');
  E.cand=W('candles,'); E.p1E=W('moved.',1,'e');
  E.but=W('But'); E.three=W('three'); E.r1E=W('price.',2,'e');
  E.vput=W('Volwick',1); E.traded=W('traded.',1,'e');
  E.then=W('Then'); E.levelE=W('level.',1,'e');
  E.scA=W('Scenario',1); E.held=W('held.'); E.scB=W('Scenario',2); E.sameB=W('Same',2); E.printsB=W('prints.',1); E.broke=W('broke.');
  E.priceC=W('Price',5); E.moveE=W('move.',1,'e'); E.vw2=W('Volwick',2); E.ctxE=W('context.',1,'e');
  E.rw0=E.hookE+0.10; E.rw1=E.cand;                                   // rewind from the hook to the start of the session
  E.logo0=CUES.logo0; E.beat=E.logo0+1.75/LSP; E.dv=CUES.dvv[0]-0.08; E.loop0=CUES.loop0; E.total=E.loop0+0.5;
  E.flip=E.held+0.03; E.rise1=E.held+1.5;
  E.big=E.levelE+(0.40-0.3)/0.32*(E.held-E.levelE);                 // the block prints while price sits on the level
  E.bRw0=E.scB-0.35; E.bRw1=E.scB+0.20; E.bFall1=E.broke+1.5;
  E.cmp0=E.broke+1.1; E.cmp1=E.vw2-0.25;                              // both results side by side
  Object.assign(E,{softBoom:1, hookBuyers:E.diff, div:E.scB, cvdWord:E.then-0.2, b0:E.three, b1:E.r1E, flow:E.vput+0.3,
    volwick:E.vw2, holdHit:E.held+0.02, breakHit:E.broke+0.05, bigPrint:E.big, swap:E.bRw0, riser0:E.levelE+0.05, riser1:E.held,
    arrive:E.levelE-0.02, count0:E.held+0.05, count1:E.rise1, ctaWhoosh:E.vw2-0.25});
  S.total=E.total;
}

// ---------- intrabar path of the touch bar (same path for candle, price tag, P&L and camera) ----------
function touchPath(b,f){
  if (f<0.30) return mix(b.o,LVL,eio(f/0.30)); if (f<0.50) return LVL; if (f<0.60) return mix(LVL,761.85,eio((f-0.50)/0.10)); return mix(761.85,b.c,eo((f-0.60)/0.40)); }
function wire(c,B){ const lp=c.lastPrice.bind(c);
  c.lastPrice=n=> (n<TOUCH||n>=TOUCH+1) ? lp(n) : touchPath(B[TOUCH],n-TOUCH);
  // candle drawn with an alpha multiplier (the engine's candle resets alpha); the touch bar follows its intrabar path
  c.drawCandle=(i,k,a)=>{ if (k<=0||a<=0) return; const g=VW.g, b=B[i], x=c.X(i); let o=b.o, cl, hi, lo;
    if (i===TOUCH && k<1){ const p=touchPath(b,k); cl=p; lo=k<0.6?Math.min(b.o,p):Math.min(761.85,p); hi=Math.max(b.o,p,k>0.05?b.h:b.o); g.globalAlpha=a; }
    else { const kk=VW.eoe(k); cl=mix(b.o,b.c,kk); hi=mix(Math.max(b.o,cl),b.h,kk); lo=mix(Math.min(b.o,cl),b.l,kk); g.globalAlpha=a*Math.min(1,k*2.5); }
    const col=cl>=o?COL.up:COL.dn; g.strokeStyle=col; g.lineWidth=2.4; g.beginPath(); g.moveTo(x,c.PY(hi)); g.lineTo(x,c.PY(lo)); g.stroke();
    const y1=c.PY(Math.max(o,cl)), y2=c.PY(Math.min(o,cl)); g.fillStyle=col; g.fillRect(x-c.bw*0.34,y1,c.bw*0.68,Math.max(2,y2-y1)); g.globalAlpha=1; }; }
wire(cA,BARS); wire(cBB,BARS_B);

// ---------- state ----------
function state(t){
  const st={}; const loop=t>=E.loop0, tt=loop?0:t;
  // scenario A clock
  if (tt<E.rw0) st.n=TOUCH+0.45;                                                       // hook: price sitting on the level
  else if (tt<E.rw1) st.n=mix(TOUCH+0.45,26,eio(lin(tt,E.rw0,E.rw1)));
  else if (t<E.then) st.n=mix(26,40,eo(lin(t,E.cand,E.p1E)));
  else if (t<E.levelE) st.n=mix(40,TOUCH+0.3,eio(lin(t,E.then,E.levelE)));
  else if (t<E.held) st.n=mix(TOUCH+0.3,TOUCH+0.62,lin(t,E.levelE,E.held));            // slow motion (editing only, same price path)
  else st.n=mix(TOUCH+0.62,N,eo(lin(t,E.held,E.rise1)));                              // the reaction starts on the word
  // scenario B clock (same session up to the touch)
  st.b = loop?0 : seg(t,E.bRw0,E.bRw1);
  if (t<E.bRw1) st.nB=TOUCH+0.3; else if (t<E.broke) st.nB=mix(TOUCH+0.3,TOUCH+0.5,lin(t,E.bRw1,E.broke)); else st.nB=mix(TOUCH+0.5,N,eo(lin(t,E.broke,E.bFall1)));
  // information layer: prints and level
  st.info = loop?0 : (tt<E.rw1 ? seg(tt,E.diff-0.1,E.diff+0.25)*(1-seg(tt,E.rw0,E.rw0+0.2)) : 1);
  st.seqP = loop?1 : (tt<E.rw0 ? 1 : lin(t,E.three-0.1,E.r1E));
  st.toVol = loop?0 : (tt<E.rw0 ? 0 : 1-eio(lin(t,E.vput+0.2,E.traded)));
  st.lvl = loop?1 : (tt<E.rw0 ? st.info : seg(t,E.vput+0.6,E.traded+0.1));
  st.slow = loop?0 : seg(t,E.levelE-0.35,E.levelE+0.25)*(1-seg(t,E.held+0.15,E.held+1.0));
  st.cmp = loop?0 : seg(t,E.cmp0,E.cmp0+0.4)*(1-seg(t,E.cmp1,E.cmp1+0.3));
  st.cta = loop?0 : seg(t,E.vw2-0.25,E.vw2+0.35);
  return st;
}

// ---------- camera ----------
const camHook={s:0.8, cx:X(36), cy:PY(762.45)};
const camWide={s:0.72, cx:(X(24)+X(63)+40)/2, cy:PY(763.61)+(V.cy-505)/0.72};
const camClose={s:1.5, cx:X(TOUCH)-0.06*V.w/1.5, cy:PY(LVL)+(V.cy-1010)/1.5};
const camTouchB={s:1.3, cx:X(TOUCH)-0.05*V.w/1.3, cy:PY(LVL)+(V.cy-880)/1.3};
const camCta={s:1.0, cx:X(46), cy:PY(LVL)};
function camFollow(c,n){
  // newest candle at 86 % of the width; level and price both stay in frame (level never below y=1180, price never above y=500)
  const p=c.lastPrice(Math.max(1,n)), s=clamp(580/(Math.max(0.01,Math.abs(p-LVL))*K),0.74,1.05);
  const xNew=c.X(Math.max(0,Math.min(N-1,n-0.5))), cx=Math.max(V.w/2/s-8, xNew-(0.86-0.5)*V.w/s);
  let cy=PY(mix(LVL,p,0.62)); if (p>=LVL) cy=Math.min(Math.max(cy, PY(LVL)-(1090-V.cy)/s), PY(p)+(V.cy-505)/s);
  else cy=Math.max(Math.min(cy, PY(LVL)+(V.cy-640)/s), PY(p)-(1300-V.cy)/s);
  return {s,cx,cy}; }
const mixCam=(a,b,k)=>({s:Math.exp(mix(Math.log(a.s),Math.log(b.s),k)), cx:mix(a.cx,b.cx,k), cy:mix(a.cy,b.cy,k)});
function camera(t,st){
  if (t>=E.loop0) return camHook;
  let c=camFollow(cA,st.n);
  c=mixCam(c,camClose,st.slow);
  if (st.b>0){ const fb=t<E.broke?camTouchB:mixCam(camTouchB,camFollow(cBB,st.nB),seg(t,E.broke,E.broke+0.8)); c=mixCam(c,fb,st.b); }
  c=mixCam(c,camWide,seg(t,E.cmp0-0.3,E.cmp0+0.3)*(1-seg(t,E.vw2-0.6,E.vw2-0.1)));
  c=mixCam(c,camCta,seg(t,E.vw2-0.6,E.vw2-0.1));
  c=mixCam(c,camHook,1-seg(t,E.rw0-0.05,E.rw0+0.45));
  return c; }

// ---------- drawings ----------
function panel(){ const g=VW.g; g.save(); g.fillStyle='rgba(10,16,30,0.55)'; VW.roundRect(V.x0-14,V.y0-20,AX+118-(V.x0-14),V.h+40,18); g.fill();
  g.strokeStyle='rgba(120,150,210,0.14)'; g.lineWidth=1.2; g.stroke(); g.restore(); }
function axis(yTag,a){ const g=VW.g; const step=CAM.s>=0.95?0.25:0.5;
  g.save(); g.globalAlpha=0.85*a; g.font='600 30px VWMono'; g.fillStyle=COL.ink2; g.textAlign='left'; g.textBaseline='middle';
  const pTop=PMIN+(LB.y1-WY(V.y0))/K, pBot=PMIN+(LB.y1-WY(V.y1-VOLH))/K;
  for (let p=Math.ceil(pBot/step)*step; p<=pTop; p+=step){ const y=SY(PY(p)); if (y<V.y0+16||y>V.y1-VOLH-16||Math.abs(y-yTag)<50) continue;
    g.fillText(p.toFixed(2),AX,y); g.strokeStyle='rgba(120,150,210,0.07)'; g.lineWidth=1; g.beginPath(); g.moveTo(V.x0,y); g.lineTo(V.x1,y); g.stroke(); }
  g.restore(); }
function priceTag(p,a){ if (a<=0) return; const g=VW.g, y=clamp(SY(PY(p)),V.y0+26,V.y1-26); g.save(); g.globalAlpha=a;
  g.setLineDash([6,8]); g.strokeStyle=VW.rgba(GOLD,0.5); g.lineWidth=1.5; g.beginPath(); g.moveTo(V.x0,y); g.lineTo(AX-8,y); g.stroke(); g.setLineDash([]);
  g.fillStyle=GOLD; VW.roundRect(AX-8,y-26,128,52,9); g.fill(); g.fillStyle='#120E02'; g.font='700 30px VWMono'; g.textAlign='center'; g.textBaseline='middle'; g.fillText(p.toFixed(2),AX+56,y+1); g.restore(); return y; }
function volume(c,B,n,a,from=0){ const g=VW.g; g.save(); g.globalAlpha=a;
  for (let i=from;i<Math.ceil(n)&&i<N;i++){ const x=SX(c.X(i)); if (x<V.x0-20||x>V.x1+20) continue; const k=clamp(n-i,0,1), b=B[i];
    g.fillStyle=VW.rgba(b.c>=b.o?COL.up:COL.dn,0.26*k); const h=b.v/VMAX*VOLH*eo(k), w=BW*CAM.s*0.68; g.fillRect(x-w/2,V.y1-h,w,h); } g.restore(); }
function candles(c,n,from,a){ if (a<=0) return; for (let i=from;i<Math.ceil(n)&&i<N;i++) c.drawCandle(i,clamp(n-i,0,1),a); }
function bubble(pr,k,toVol){ if (k<=0) return; const g=VW.g, x=X(pr.i), yL=PY(pr.p);
  const vh=BARS[pr.i].v/VMAX*VOLH, yV=WY(V.y1-vh), y=mix(yL,yV,toVol), r=(3+Math.sqrt(pr.q/1000)*0.36)*(0.6+0.4*eo(k));
  g.save(); g.globalAlpha=Math.min(1,k*1.3); g.shadowColor=VW.rgba(GOLD,0.8); g.shadowBlur=14; g.fillStyle=VW.rgba(GOLD,0.9); g.beginPath(); g.arc(x,y,r,0,7); g.fill(); g.shadowBlur=0;
  const ring=clamp((k-0.2)*1.5,0,1); if (ring<1){ g.strokeStyle=VW.rgba(GOLD,0.6*(1-ring)); g.lineWidth=2; g.beginPath(); g.arc(x,y,r+ring*26,0,7); g.stroke(); }
  g.restore(); }
function bigPrint(t,a,always){ if (a<=0) return; const g=VW.g, x=X(BIG.i), y=PY(BIG.p), kk=always?1:clamp((t-E.big)/0.35,0,1);
  if (kk<=0) return; const r=24*(0.55+0.45*eo(kk));
  g.save(); g.globalAlpha=a*Math.min(1,kk*2);
  const halo=g.createRadialGradient(x,y,0,x,y,r*3); halo.addColorStop(0,VW.rgba(GOLD,0.4)); halo.addColorStop(1,VW.rgba(GOLD,0)); g.fillStyle=halo; g.beginPath(); g.arc(x,y,r*3,0,7); g.fill();
  g.shadowColor=VW.rgba(GOLD,0.95); g.shadowBlur=30; g.fillStyle=GOLD; g.beginPath(); g.arc(x,y,r,0,7); g.fill(); g.shadowBlur=0;
  const ring=clamp((t-E.big)/0.9,0,1); if (!always && ring>0 && ring<1){ g.strokeStyle=VW.rgba(GOLD,0.7*(1-ring)); g.lineWidth=3; g.beginPath(); g.arc(x,y,r+ring*90,0,7); g.stroke(); }
  g.restore(); return kk; }
function bigLabel(a){ if (a<=0) return; const g=VW.g, x=SX(X(BIG.i)), y=SY(PY(BIG.p)), r=24*CAM.s; g.save(); g.globalAlpha=a; g.font='700 36px VWMono'; g.fillStyle=GOLD;
  g.shadowColor='rgba(0,0,0,0.9)'; g.shadowBlur=14; g.textAlign='right'; g.textBaseline='bottom'; g.fillText('2.4M',x-r-10,y-10); g.restore(); }
function levelLine(a,glow){ if (a<=0) return; const g=VW.g, y=PY(LVL); g.save(); g.globalAlpha=a;
  g.strokeStyle=GOLD; g.lineWidth=(3+2*glow)/CAM.s; g.setLineDash(glow>0.3?[]:[12/CAM.s,8/CAM.s]); g.shadowColor=GOLD; g.shadowBlur=14+26*glow; g.beginPath(); g.moveTo(-2000,y); g.lineTo(LB.x1+2000,y); g.stroke(); g.restore(); }
function levelTag(a){ if (a<=0) return; const g=VW.g, y=SY(PY(LVL)); g.save(); g.globalAlpha=a; g.font='700 31px VWMono'; g.fillStyle=GOLD; g.textAlign='left'; g.textBaseline='top';
  g.shadowColor='rgba(0,0,0,0.9)'; g.shadowBlur=12; g.fillText('8 BLOCKS · 3.06M SH @ '+LVL.toFixed(2),V.x0+14,y+14); g.restore(); }
function chip(txt,col,a){ if (a<=0) return; const g=VW.g; g.save(); g.globalAlpha=a; g.font='700 27px VWMono'; g.letterSpacing='2px'; const w=g.measureText(txt).width+32;
  g.fillStyle='rgba(6,10,20,0.85)'; VW.roundRect(V.x0+10,V.y0+12,w,48,10); g.fill(); g.strokeStyle=VW.rgba(col,0.6); g.lineWidth=1.5; g.stroke();
  g.fillStyle=col; g.textAlign='left'; g.textBaseline='middle'; g.fillText(txt,V.x0+26,V.y0+37); g.restore(); }
const fmt=v=>(v>=0?'+':'−')+'$'+Math.abs(v).toFixed(2);
function positionBox(c,n,a){ if (a<=0) return; const f=n-TOUCH; if (f<0.3) return; const g=VW.g, p=c.lastPrice(n), x0=c.X(TOUCH)-BW*0.5, x1=c.X(Math.min(N-1,n-0.001))+BW*0.5;
  const y0=PY(LVL), y1=PY(p), col=p>=LVL?GREEN:RED; g.save(); g.globalAlpha=a*clamp((f-0.3)*8,0,1);
  g.fillStyle=VW.rgba(col,0.14); g.fillRect(x0,Math.min(y0,y1),x1-x0,Math.abs(y1-y0)); g.strokeStyle=VW.rgba(col,0.7); g.lineWidth=2/CAM.s; g.beginPath(); g.moveTo(x0,y1); g.lineTo(x1,y1); g.stroke(); g.restore(); }
const HYP1='HYPOTHETICAL · 100 SPY @ '+LVL.toFixed(2), HYP2='EXIT AT THE CLOSE · NO FEES';
// live P&L of the scenario on screen, hung under the level on the left
function pnlHero(c,n,a,t,label){ if (a<=0) return; const f=n-TOUCH; if (f<0.3) return;
  const g=VW.g, p=c.lastPrice(n), usd=r2(p-LVL)*SH, col=usd>0.004?GREEN:(usd<-0.004?RED:COL.ink), flash=Math.exp(-Math.pow((t-E.flip)/0.12,2));
  const x=V.x0+14, y=clamp(SY(PY(LVL))+150,V.y0+150,V.y1-VOLH-84); g.save(); g.globalAlpha=a*clamp((f-0.3)*10,0,1); g.textAlign='left'; g.textBaseline='alphabetic';
  g.font='700 27px VWMono'; g.letterSpacing='2px'; g.fillStyle=COL.ink2; g.fillText(label,x+4,y-78); g.letterSpacing='0px';
  g.font='700 84px VWMono'; g.fillStyle=col; g.shadowColor=VW.rgba(col,0.55+0.4*flash); g.shadowBlur=18+36*flash;
  const s=1+0.06*flash; g.save(); g.translate(x,y); g.scale(s,s); g.fillText(usd===0?'$0.00':fmt(usd),0,0); g.restore(); g.shadowBlur=0;
  g.font='600 27px VWMono'; g.fillStyle=COL.ink2; g.fillText('HYPOTHETICAL · 100 SPY', x+4, y+42); g.restore(); }
// both results, same size, same assumptions
function compare(a){ if (a<=0) return; const g=VW.g, x=V.x0+14, y=clamp(SY(PY(LVL))+80,V.y0+150,V.y1-VOLH-150);
  const A=r2((BARS[N-1].c-LVL)*SH), B=r2((BARS_B[N-1].c-LVL)*SH);
  g.save(); g.globalAlpha=a; g.textAlign='left'; g.textBaseline='alphabetic';
  [[`A  ${fmt(A)}`,GREEN,0],[`B  ${fmt(B)}`,RED,72]].forEach(([s,col,dy])=>{ g.font='700 64px VWMono'; g.fillStyle=col; g.shadowColor=VW.rgba(col,0.5); g.shadowBlur=16; g.fillText(s,x,y+dy); });
  g.shadowBlur=0; g.font='600 27px VWMono'; g.fillStyle=COL.ink2; g.fillText(HYP1,x+4,y+110); g.fillText(HYP2,x+4,y+142); g.restore(); }
function emerge(txt,col,k,below=false){ if (k<=0) return; const g=VW.g, y=SY(PY(LVL)), h=70;
  g.save(); g.beginPath(); if (below) g.rect(0,y+4,VW.W,h+20); else g.rect(0,y-h-20,VW.W,h+20); g.clip(); g.globalAlpha=Math.min(1,k*1.4);
  g.textAlign='center'; g.font='700 46px VWSans'; g.fillStyle=col; g.shadowColor='rgba(0,0,0,0.9)'; g.shadowBlur=24;
  if (below){ g.textBaseline='top'; g.fillText(txt,SAFE.cx,y+14-(1-eo(k))*h); } else { g.textBaseline='bottom'; g.fillText(txt,SAFE.cx,y-14+(1-eo(k))*h); }
  g.restore(); }

// ---------- render ----------
function render(t){
  const g=VW.g; g.setTransform(1,0,0,1,0,0); g.globalAlpha=1; g.filter='none';
  VW.background(t);
  const st=state(t), tt=t>=E.loop0?0:t;
  CAM=camera(t,st);
  const ctaDim=1-0.8*st.cta, infoBoost=1;
  const curC=st.b>0.5?cBB:cA, curN=st.b>0.5?st.nB:st.n, curP=curC.lastPrice(Math.max(1,curN));
  const yTag=clamp(SY(PY(curP)),V.y0+26,V.y1-26);
  panel(); axis(yTag,1-0.8*st.cta);
  volume(cA,BARS,Math.min(st.n,TOUCH),ctaDim);
  volume(cA,BARS,st.n,ctaDim*(1-st.b)*(1-0.6*st.cmp),TOUCH); volume(cBB,BARS_B,st.nB,ctaDim*st.b*(1-0.6*st.cmp),TOUCH);
  // world layer
  g.save(); g.beginPath(); g.rect(V.x0,V.y0,V.w,V.h); g.clip();
  g.translate(V.cx,V.cy); g.scale(CAM.s,CAM.s); g.translate(-CAM.cx,-CAM.cy);
  positionBox(cA,st.n,(1-0.7*st.b)*(1-st.cta));
  if (st.b>0) positionBox(cBB,st.nB,st.b*(1-st.cta));
  candles(cA,Math.min(st.n,TOUCH),0,ctaDim);
  candles(cA,st.n,TOUCH,ctaDim*(1-0.7*st.b));                              // scenario A (ghost once B starts)
  if (st.b>0) candles(cBB,st.nB,TOUCH,ctaDim*st.b);                       // scenario B
  levelLine(st.lvl*st.info, st.slow);
  PRINTS.forEach((pr,j)=>{ if (pr.i>=Math.max(st.n,TOUCH*st.b)) return; const k=clamp(st.seqP*PRINTS.length-j,0,1)*st.info; bubble(pr,k,st.toVol); });
  let bk=0; if (st.n>TOUCH+0.3 || st.b>0) bk=bigPrint(t,st.info,(t<E.rw0)||st.b>0||t>=E.loop0);
  g.restore();
  // screen layer
  priceTag(curP,1-st.cta);
  if (bk>0) bigLabel(st.info*clamp((bk-0.3)*2,0,1));
  levelTag(t>=E.loop0||tt<E.rw0 ? st.info : seg(t,E.traded-0.3,E.traded)*(1-seg(t,E.then-0.3,E.then)));
  const hero=(1-clamp(st.cmp*2,0,1))*(1-st.cta)*(t<E.loop0?1:0);
  if (st.b<0.5) pnlHero(cA,st.n,hero*(1-2*st.b)*(t>E.levelE-0.15?1:0),t,'SCENARIO A · SIMULATED');
  else pnlHero(cBB,st.nB,hero*(2*st.b-1),t,'SCENARIO B · SIMULATED');
  compare(clamp(st.cmp*2-1,0,1)*(1-st.cta));
  // layer chip: what the viewer is looking at
  if (t<E.vw2-0.3){ const withInfo=(tt<E.rw0)? st.info : seg(t,E.vput,E.vput+0.3);
    chip('PRICE ONLY',COL.ink2,1-withInfo); chip('PRICE + BLOCK PRINTS',GOLD,withInfo); }
  if (t<E.loop0){ emerge('PRICE SHOWS THE MOVE.',COL.ink,seg(t,E.vw2-0.05,E.vw2+0.45));
    emerge('VOLWICK ADDS THE CONTEXT.',GOLD,seg(t,E.vw2+0.15,E.vw2+0.65),true); }
  VW.vignette(); VW.topBand(330);
  const endK=seg(t,E.logo0,E.logo0+0.5)*(1-seg(t,E.loop0,E.total-0.15));
  VW.logoTL(1-endK,'SPY',52,30,true);
  // hook text
  const hOut=1-seg(tt,E.rw0-0.15,E.rw0+0.1);
  { const a1=eo(lin(tt,-0.3,0))*hOut, a2=eo(lin(tt,E.diff-0.05,E.diff+0.15))*hOut; g.save(); g.textAlign='center'; g.textBaseline='middle'; g.shadowColor='rgba(0,0,0,0.95)'; g.shadowBlur=30;
    g.font='700 52px VWSans'; if (a1>0){ g.globalAlpha=a1; g.fillStyle=COL.ink; g.fillText('SAME PRICE.',SAFE.cx,352); }
    if (a2>0){ g.globalAlpha=a2; g.fillStyle=GOLD; g.fillText('DIFFERENT INFORMATION.',SAFE.cx,412); } g.restore(); }
  VW.captions(t,GROUPS,{y:CAP_Y+22,size:66,keySize:76,keys:new Map([['three',GOLD],['million',GOLD],['printed',GOLD],['Volwick',COL.blue],['traded.',GOLD],['level.',GOLD],['held.',GREEN],['broke.',RED],['prints.',GOLD],['move.',COL.ink],['context.',GOLD]]),until:E.vw2-0.15});
  if (t>E.logo0){ const y=SY(PY(LVL)), pts=[]; for (let i=0;i<N;i++) pts.push([mix(V.x0,V.x1,i/(N-1)),y]);
    VW.logoForm((t-E.logo0)*LSP, pts, {fadeOut:seg(t,E.loop0,E.total-0.15), noUrl:true});
    const out=1-seg(t,E.loop0,E.total-0.15), k=eo(lin(t,E.dv,E.dv+0.3))*out;
    if (k>0){ g.save(); g.globalAlpha=k; g.textAlign='center'; g.textBaseline='middle'; g.font='700 44px VWMono'; g.letterSpacing='5px';
      g.fillStyle=COL.blue; g.shadowColor='rgba(90,140,255,0.8)'; g.shadowBlur=20; g.fillText('DISCOVER VOLWICK →',543,1352+(1-k)*10); g.restore(); }
    const kd=eo(lin(t,E.dv+0.3,E.dv+0.7))*out;
    if (kd>0){ g.save(); g.globalAlpha=kd; g.textAlign='center'; g.textBaseline='middle'; g.font='600 29px VWMono'; g.letterSpacing='0px'; g.fillStyle=COL.ink2; g.fillText('Simulated scenarios. Not investment advice.',540,1418); g.restore(); } }
  VW.guides();
}
window.render=render;
window.READY=(async()=>{
  const q=new URLSearchParams(location.search);
  WORDS=await (await fetch(q.get('words')||'words.json')).json();
  CUES=(await (await fetch('cues.json')).json()).cues;
  GROUPS=VW.buildGroups(WORDS.filter(w=>w[1]>W('information.',1,'e')+0.2),3,16);
  buildTimeline(); await VW.loadFonts(); await VW.loadBrand(); render(0);
  const nAt=t=>state(t).n, pAt=t=>cA.lastPrice(nAt(t)); let tc=E.held; while (pAt(tc)<LVL && tc<E.held+2) tc+=0.005;
  const pB=t=>cBB.lastPrice(state(t).nB); let tb=E.broke-0.5; while (pB(tb)>=761.85 && tb<E.broke+2) tb+=0.005;
  return {...window.DATA_CHECK, total:S.total, events:E, signFlipA:tc, heldWord:E.held, breaksPriorLowB:tb, brokeWord:E.broke};
})();
