// ============================================================
// Scene P03 v5 · SILENT SIZE · "One price. Two outcomes."
// v5: live chart. The chart lives in a world at fixed scale (480 px per $1, 22 px per bar) and a camera frames it:
// wide on the hook and on the alternative outcome, following the newest candle during the story, close on the touch.
// Axis, price tag, P&L and captions are in screen space. P&L = a long position from the level (box entry -> price).
// All data SIMULATED (100 SPY shares, no commissions or slippage).
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
const BIG={i:TOUCH,q:2400000,p:LVL};                  // the large block printed on the retest, at the level price
BARS[TOUCH].v=Math.round(BARS[TOUCH].v*2.1); for (let i=TOUCH+1;i<N;i++) BARS[i].v=Math.round(BARS[i].v*1.75);
const ALT=-0.62;                                       // the other outcome: a break of the level
window.DATA_CHECK={ entry:LVL, touchLow:BARS[TOUCH].l, end:BARS[N-1].c, printedBefore:PRINTED, pnlAtPrint:0, pnlEnd:r2((BARS[N-1].c-LVL)*SH), pnlLow:r2((BARS[TOUCH].l-LVL)*SH), pnlAlt:r2(ALT*SH) };

// ---------- world (fixed scale) and viewport ----------
const K=480, BW=22, PMAX=763.95, PMIN=760.90;
const LB={cvd:{y0:0,y1:0},x0:0,x1:N*BW,y0:0,y1:(PMAX-PMIN)*K,pMin:PMIN,pMax:PMAX}; const cB=new VW.Chart(BARS,LB);
const V={x0:96,x1:826,y0:452,y1:1408}; V.w=V.x1-V.x0; V.h=V.y1-V.y0; V.cx=(V.x0+V.x1)/2; V.cy=(V.y0+V.y1)/2;
const AX=836;                                          // axis column (screen)
const CAP_Y=392, VOLH=74, VMAX=180000, LSP=1.7;
let CAM={cx:0,cy:0,s:1};
const SX=x=>V.cx+(x-CAM.cx)*CAM.s, SY=y=>V.cy+(y-CAM.cy)*CAM.s, WY=sy=>CAM.cy+(sy-V.cy)/CAM.s;

let WORDS=[], GROUPS=[], CUES={};
function W(word,nth=1,edge='s'){ let c=0; for (const w of WORDS){ if (w[0].replace(/[^\w']/g,'').toLowerCase()===word.replace(/[^\w']/g,'').toLowerCase()){ if (++c===nth) return edge==='s'?w[1]:w[2]; } } throw new Error('word not found: '+word+' #'+nth); }
let E={};
function buildTimeline(){
  E.one=W('One'); E.two=W('Two'); E.hookE=W('outcomes.',1,'e');
  E.forty=W('Forty'); E.flatE=W('flat.',1,'e'); E.but=W('But'); E.large=W('large'); E.priceW=W('price.',2,'e');
  E.your=W('Your'); E.volume=W('volume.',1,'e'); E.vput=W('Volwick'); E.traded=W('traded.',1,'e');
  E.then=W('Then'); E.levelE=W('level.',1,'e'); E.held=W('HELD.'); E.heldE=W('HELD.',1,'e');
  E.not=W('Not'); E.brokenE=W('broken.',1,'e'); E.chart2=W('chart',2); E.vw2=W('Volwick',2); E.ctaE=W('prints.',1,'e');
  E.rw0=E.hookE+0.15; E.rw1=E.forty-0.05;
  E.logo0=CUES.logo0; E.beat=E.logo0+1.75/LSP; E.dv=CUES.dvv[0]-0.08; E.loop0=CUES.loop0; E.total=E.loop0+0.5;
  E.flip=E.held+0.03;
  // slow motion: bar fraction f runs 0.3 -> 0.62 between "level." and "HELD."; the block prints at f=0.40 while price sits on the level
  E.big=E.levelE+(0.40-0.3)/0.32*(E.held-E.levelE);
  E.rise1=E.held+1.8;                                   // the bounce develops over 1.8 s, the P&L counts with it
  Object.assign(E,{softBoom:1, hookBuyers:E.two, div:E.not, cvdWord:E.forty, b0:E.large, b1:E.priceW, flow:E.vput+0.3,
    volwick:E.vw2, holdHit:E.held+0.02, bigPrint:E.big, swap:E.then-0.2, riser0:E.levelE+0.05, riser1:E.held,
    arrive:E.levelE-0.02, count0:E.held+0.05, count1:E.rise1, ctaWhoosh:E.chart2-0.25});
  S.total=E.total;
}

// ---------- the touch bar, intrabar (same path for candle, price tag, P&L and camera) ----------
function touchPath(f){ const b=BARS[TOUCH];
  if (f<0.30) return mix(b.o,LVL,eio(f/0.30)); if (f<0.50) return LVL; if (f<0.60) return mix(LVL,b.l,eio((f-0.50)/0.10)); return mix(b.l,b.c,eo((f-0.60)/0.40)); }
const _lp=cB.lastPrice.bind(cB);
cB.lastPrice=n=> (n<TOUCH||n>=TOUCH+1) ? _lp(n) : touchPath(n-TOUCH);
const _cd=cB.candle.bind(cB);
cB.candle=(i,k)=>{ if (i!==TOUCH||k>=1) return _cd(i,k); if (k<=0) return; const g=VW.g, b=BARS[i], x=cB.X(i), p=touchPath(k);
  const lo=k<0.6?Math.min(b.o,p):b.l, hi=Math.max(b.o,p, k>0.05?b.h:b.o), col=p>=b.o?COL.up:COL.dn;
  g.globalAlpha=1; g.strokeStyle=col; g.lineWidth=2.4; g.beginPath(); g.moveTo(x,cB.PY(hi)); g.lineTo(x,cB.PY(lo)); g.stroke();
  const y1=cB.PY(Math.max(b.o,p)), y2=cB.PY(Math.min(b.o,p)); g.fillStyle=col; g.fillRect(x-cB.bw*0.34,y1,cB.bw*0.68,Math.max(2,y2-y1)); };

// ---------- state ----------
function state(t){
  const st={}; const loop=t>=E.loop0, tt=loop?0:t;
  if (tt<E.rw0) st.n=N;
  else if (tt<E.rw1) st.n=mix(N,26,eio(lin(tt,E.rw0,E.rw1)));
  else if (t<E.then) st.n=mix(26,40,eo(lin(t,E.forty,E.but)));
  else if (t<E.levelE) st.n=mix(40,TOUCH+0.3,eio(lin(t,E.then,E.levelE)));            // price travels back while the voice says it
  else if (t<E.held) st.n=mix(TOUCH+0.3,TOUCH+0.62,lin(t,E.levelE,E.held));            // slow motion (editing only, same price path)
  else st.n=mix(TOUCH+0.62,N,eo(lin(t,E.held,E.rise1)));                        // the reaction starts on the word
  st.hook = loop?1:1-seg(t,E.rw0-0.1,E.rw0+0.35);
  st.seqP = (t<E.rw1 && !loop) ? 1 : (loop?1:lin(t,E.large-0.1,E.priceW));
  st.toVol = loop?0 : eio(lin(t,E.your+0.2,E.volume))*(1-eio(lin(t,E.vput,E.traded)));
  st.lvl = loop?1 : Math.max(st.hook, seg(t,E.priceW-0.4,E.priceW+0.2))*(1-0.85*st.toVol);
  st.slow = loop?0 : seg(t,E.levelE-0.35,E.levelE+0.25)*(1-seg(t,E.held+0.15,E.held+1.0));
  st.alt = loop?0 : Math.max(seg(t,E.two-0.05,E.two+0.45)*(1-seg(t,E.rw0-0.1,E.rw0+0.15)), seg(t,E.not-0.1,E.not+0.5)*(1-seg(t,E.chart2-0.3,E.chart2+0.1)));
  st.wideAlt = loop?0 : seg(t,E.not-0.35,E.not+0.25)*(1-seg(t,E.chart2-0.5,E.chart2));
  st.cta = loop?0 : seg(t,E.chart2-0.25,E.chart2+0.35);
  st.ctaCam = loop?0 : seg(t,E.chart2-0.5,E.chart2);
  return st;
}

// ---------- camera ----------
const camWide={s:0.78, cx:(cB.X(26)-11+cB.X(63)+11+40)/2, cy:(cB.PY(763.70)+cB.PY(761.10))/2};
function camFollow(n){
  // keeps the newest candle at 86 % of the width; the level never sinks below y=1180 (room for the P&L under it),
  // so when price runs away from the level the camera pulls back instead of losing either of them
  const p=cB.lastPrice(Math.max(1,n)), s=clamp(700/(Math.max(0.01,p-LVL)*K),0.8,1.05);
  const xNew=cB.X(Math.max(0,Math.min(N-1,n-0.5)));
  const cx=Math.max(V.w/2/s-8, xNew-(0.86-0.5)*V.w/s);
  const a=mix(LVL,p,0.62);
  return {s, cx, cy:Math.min(Math.max(cB.PY(a), cB.PY(LVL)-(1180-V.cy)/s), cB.PY(p)+(V.cy-490)/s)}; }
const camClose={s:1.5, cx:cB.X(TOUCH)-0.06*V.w/1.5, cy:cB.PY(LVL)+(V.cy-1010)/1.5};
const camCta={s:1.0, cx:cB.X(46), cy:cB.PY(LVL)};
const mixCam=(a,b,k)=>({s:Math.exp(mix(Math.log(a.s),Math.log(b.s),k)), cx:mix(a.cx,b.cx,k), cy:mix(a.cy,b.cy,k)});
function camera(t,st){
  if (t>=E.loop0) return camWide;
  let c=camFollow(st.n);
  c=mixCam(c,camClose,st.slow);
  c=mixCam(c,camWide,Math.max(st.hook,st.wideAlt));
  c=mixCam(c,camCta,st.ctaCam);
  return c; }

// ---------- drawings ----------
function panel(){ const g=VW.g; g.save(); g.fillStyle='rgba(10,16,30,0.55)'; VW.roundRect(V.x0-14,V.y0-20,AX+118-(V.x0-14),V.h+40,18); g.fill();
  g.strokeStyle='rgba(120,150,210,0.14)'; g.lineWidth=1.2; g.stroke(); g.restore(); }
function axis(n,a){ const g=VW.g; const step=CAM.s>=0.95?0.25:0.5, yTag=clamp(SY(cB.PY(cB.lastPrice(Math.max(1,n)))),V.y0+24,V.y1-24);
  g.save(); g.globalAlpha=0.85*a; g.font='600 30px VWMono'; g.fillStyle=COL.ink2; g.textAlign='left'; g.textBaseline='middle';
  const pTop=PMIN+(cB.L.y1-WY(V.y0))/K, pBot=PMIN+(cB.L.y1-WY(V.y1-VOLH))/K;
  for (let p=Math.ceil(pBot/step)*step; p<=pTop; p+=step){ const y=SY(cB.PY(p)); if (y<V.y0+16||y>V.y1-VOLH-16||Math.abs(y-yTag)<50) continue;
    g.fillText(p.toFixed(2),AX,y); g.strokeStyle='rgba(120,150,210,0.07)'; g.lineWidth=1; g.beginPath(); g.moveTo(V.x0,y); g.lineTo(V.x1,y); g.stroke(); }
  g.restore(); }
function priceTag(n,a){ if (a<=0||n<1) return; const g=VW.g, p=cB.lastPrice(n), y=clamp(SY(cB.PY(p)),V.y0+24,V.y1-24); g.save(); g.globalAlpha=a;
  g.setLineDash([6,8]); g.strokeStyle=VW.rgba(GOLD,0.5); g.lineWidth=1.5; g.beginPath(); g.moveTo(V.x0,y); g.lineTo(AX-8,y); g.stroke(); g.setLineDash([]);
  g.fillStyle=GOLD; VW.roundRect(AX-8,y-26,128,52,9); g.fill(); g.fillStyle='#120E02'; g.font='700 30px VWMono'; g.textAlign='center'; g.textBaseline='middle'; g.fillText(p.toFixed(2),AX+56,y+1); g.restore(); }
function volume(n,a){ const g=VW.g; g.save(); g.globalAlpha=a;
  for (let i=0;i<Math.ceil(n)&&i<N;i++){ const x=SX(cB.X(i)); if (x<V.x0-20||x>V.x1+20) continue; const k=clamp(n-i,0,1), b=BARS[i];
    g.fillStyle=VW.rgba(b.c>=b.o?COL.up:COL.dn,0.26*k); const h=b.v/VMAX*VOLH*eo(k), w=BW*CAM.s*0.68; g.fillRect(x-w/2,V.y1-h,w,h); } g.restore(); }
function bubble(pr,k,toVol){ if (k<=0) return; const g=VW.g, x=cB.X(pr.i), yL=cB.PY(pr.p);
  const vh=BARS[pr.i].v/VMAX*VOLH, yV=WY(V.y1-vh), y=mix(yL,yV,toVol), r=(3+Math.sqrt(pr.q/1000)*0.36)*(0.6+0.4*eo(k))*(1-0.55*toVol);
  g.save(); g.globalAlpha=Math.min(1,k*1.3); g.shadowColor=VW.rgba(GOLD,0.8); g.shadowBlur=14*(1-toVol); g.fillStyle=VW.rgba(GOLD,0.85); g.beginPath(); g.arc(x,y,r,0,7); g.fill(); g.shadowBlur=0;
  const ring=clamp((k-0.2)*1.5,0,1); if (ring<1){ g.strokeStyle=VW.rgba(GOLD,0.6*(1-ring)); g.lineWidth=2; g.beginPath(); g.arc(x,y,r+ring*26,0,7); g.stroke(); }
  g.restore(); }
function bigPrint(t,a){ if (a<=0) return; const g=VW.g, x=cB.X(BIG.i), y=cB.PY(BIG.p), kk=(t<E.rw0||t>=E.loop0)?1:clamp((t-E.big)/0.35,0,1);
  if (kk<=0) return; const r=24*(0.55+0.45*eo(kk));
  g.save(); g.globalAlpha=a*Math.min(1,kk*2);
  const halo=g.createRadialGradient(x,y,0,x,y,r*3); halo.addColorStop(0,VW.rgba(GOLD,0.4)); halo.addColorStop(1,VW.rgba(GOLD,0)); g.fillStyle=halo; g.beginPath(); g.arc(x,y,r*3,0,7); g.fill();
  g.shadowColor=VW.rgba(GOLD,0.95); g.shadowBlur=30; g.fillStyle=GOLD; g.beginPath(); g.arc(x,y,r,0,7); g.fill(); g.shadowBlur=0;
  const ring=clamp((t-E.big)/0.9,0,1); if (t>=E.rw0 && t<E.loop0 && ring>0 && ring<1){ g.strokeStyle=VW.rgba(GOLD,0.7*(1-ring)); g.lineWidth=3; g.beginPath(); g.arc(x,y,r+ring*90,0,7); g.stroke(); }
  g.restore(); }
function bigLabel(t,a){ if (a<=0) return; const kk=(t<E.rw0||t>=E.loop0)?1:clamp((t-E.big-0.1)/0.3,0,1); if (kk<=0) return;
  const g=VW.g, x=SX(cB.X(BIG.i)), y=SY(cB.PY(BIG.p)), r=24*CAM.s; g.save(); g.globalAlpha=a*kk; g.font='700 36px VWMono'; g.fillStyle=GOLD;
  g.shadowColor='rgba(0,0,0,0.9)'; g.shadowBlur=14; g.textAlign='right'; g.textBaseline='bottom'; g.fillText('2.4M',x-r-10,y-8); g.restore(); }
function levelLine(a,glow){ if (a<=0) return; const g=VW.g, y=cB.PY(LVL); g.save(); g.globalAlpha=a;
  g.strokeStyle=GOLD; g.lineWidth=(3+2*glow)/CAM.s; g.setLineDash(glow>0.3?[]:[12/CAM.s,8/CAM.s]); g.shadowColor=GOLD; g.shadowBlur=14+26*glow; g.beginPath(); g.moveTo(-2000,y); g.lineTo(cB.L.x1+2000,y); g.stroke(); g.restore(); }
function levelTag(a){ if (a<=0) return; const g=VW.g, y=SY(cB.PY(LVL)); g.save(); g.globalAlpha=a; g.font='700 30px VWMono'; g.fillStyle=GOLD; g.textAlign='right'; g.textBaseline='top';
  g.shadowColor='rgba(0,0,0,0.9)'; g.shadowBlur=12; g.fillText('8 BLOCKS · 3.06M SH @ '+LVL.toFixed(2),V.x1-12,y+14); g.restore(); }
const fmt=v=>(v>=0?'+':'−')+'$'+Math.abs(v).toFixed(2);
// long 100 shares from the level: box from the entry bar to the current bar, between entry and current price (world)
function positionBox(n,a){ if (a<=0) return; const f=n-TOUCH; if (f<0.3) return; const g=VW.g, p=cB.lastPrice(n), x0=cB.X(TOUCH)-BW*0.5, x1=cB.X(Math.min(N-1,n-0.001))+BW*0.5;
  const y0=cB.PY(LVL), y1=cB.PY(p), up=p>=LVL, col=up?GREEN:RED; g.save(); g.globalAlpha=a*clamp((f-0.3)*8,0,1);
  g.fillStyle=VW.rgba(col,0.14); g.fillRect(x0,Math.min(y0,y1),x1-x0,Math.abs(y1-y0)); g.strokeStyle=VW.rgba(col,0.7); g.lineWidth=2/CAM.s; g.beginPath(); g.moveTo(x0,y1); g.lineTo(x1,y1); g.stroke(); g.restore(); }
// P&L counter, screen space, hung under the level line on the left: it reads exactly the same price as the box and the price tag
function pnlHero(n,a,t){ if (a<=0) return; const f=n-TOUCH; if (f<0.3) return;
  const g=VW.g, p=cB.lastPrice(n), usd=r2(p-LVL)*SH, pos=usd>0.004, neg=usd<-0.004, col=pos?GREEN:(neg?RED:COL.ink), flash=Math.exp(-Math.pow((t-E.flip)/0.12,2));
  const x=V.x0+14, y=clamp(SY(cB.PY(LVL))+112,V.y0+120,V.y1-VOLH-58); g.save(); g.globalAlpha=a*clamp((f-0.3)*10,0,1); g.textAlign='left'; g.textBaseline='alphabetic';
  g.font='700 84px VWMono'; g.fillStyle=col; g.shadowColor=VW.rgba(col,0.55+0.4*flash); g.shadowBlur=18+36*flash;
  const s=1+0.06*flash; g.save(); g.translate(x,y); g.scale(s,s); g.fillText(usd===0?'$0.00':fmt(usd),0,0); g.restore(); g.shadowBlur=0;
  g.font='600 28px VWMono'; g.letterSpacing='1px'; g.fillStyle=COL.ink2; g.fillText('HYPOTHETICAL · 100 SPY @ '+LVL.toFixed(2), x+4, y+44); g.restore(); }
// the other outcome: red dashed path from the entry; its P&L counts down with the tip of the path
function altPath(k){ if (k<=0) return; const g=VW.g, x0=cB.X(TOUCH), y0=cB.PY(LVL), x1=cB.X(N-1);
  const tip=[mix(x0,x1,k), cB.PY(LVL+ALT*eo(k))];
  g.save(); g.globalAlpha=0.95*Math.min(1,k*3); g.setLineDash([12/CAM.s,10/CAM.s]); g.strokeStyle=RED; g.lineWidth=4/CAM.s; g.beginPath(); g.moveTo(x0,y0);
  g.bezierCurveTo(x0+60,y0, x0+100,cB.PY(LVL+ALT*0.65*eo(k)), tip[0],tip[1]); g.stroke(); g.setLineDash([]); g.restore(); return tip; }
function altLabel(k,tip){ if (k<=0||!tip) return; const g=VW.g, v=Math.round(ALT*SH*eo(k)), x=SX(tip[0]), y=SY(tip[1]);
  g.save(); g.globalAlpha=clamp((k-0.15)*4,0,1); g.font='700 52px VWMono'; g.fillStyle=RED; g.shadowColor=VW.rgba(RED,0.55); g.shadowBlur=16; g.textAlign='right'; g.textBaseline='top';
  g.textAlign='left'; const w=g.measureText(fmt(v)).width; g.fillText(fmt(v),Math.min(V.x1-6-w,x+16),y+14); g.restore(); }
function emerge(txt,col,k,below=false){ if (k<=0) return; const g=VW.g, y=SY(cB.PY(LVL)), h=70;
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
  const dim=1-0.85*st.cta;
  panel(); axis(st.n,1-0.8*st.cta);
  volume(st.n, dim*(1-0.9*st.alt));
  // world layer, clipped to the viewport
  g.save(); g.beginPath(); g.rect(V.x0,V.y0,V.w,V.h); g.clip();
  g.translate(V.cx,V.cy); g.scale(CAM.s,CAM.s); g.translate(-CAM.cx,-CAM.cy);
  positionBox(st.n,(1-st.cta));
  g.globalAlpha=dim; cB.candles(st.n); g.globalAlpha=1;
  levelLine(st.lvl, st.slow);
  PRINTS.forEach((pr,j)=>{ if (pr.i>=st.n) return; const k=clamp(st.seqP*PRINTS.length-j,0,1); bubble(pr,k*(1-0.9*st.cta),st.toVol); });
  if (st.n>TOUCH+0.3) bigPrint(t,(1-st.cta));
  const tip=altPath(st.alt);
  g.restore();
  // screen layer
  priceTag(st.n,1-st.cta);
  if (st.n>TOUCH+0.3) bigLabel(t,1-st.cta);
  levelTag(t>=E.loop0?0:seg(t,E.vput,E.vput+0.3)*(1-seg(t,E.then-0.3,E.then)));
  pnlHero(st.n, 1-st.cta, t);
  altLabel(st.alt,tip);
  if (t<E.loop0){ emerge('THE CHART SHOWS THE CANDLES.',COL.ink,seg(t,E.chart2-0.05,E.chart2+0.45));
    emerge('VOLWICK SHOWS THE PRINTS.',GOLD,seg(t,E.vw2-0.05,E.vw2+0.45),true); }
  VW.vignette(); VW.topBand(330);
  const endK=seg(t,E.logo0,E.logo0+0.5)*(1-seg(t,E.loop0,E.total-0.15));
  VW.logoTL(1-endK,'SPY',52,30,true);
  const hOut=1-seg(tt,E.rw0-0.15,E.rw0+0.1);
  { const a1=eo(lin(tt,-0.3,0))*hOut, a2=eo(lin(tt,E.two-0.03,E.two+0.15))*hOut;
    if (a1>0){ g.save(); g.font='700 58px VWSans'; g.textBaseline='middle'; g.textAlign='left'; g.shadowColor='rgba(0,0,0,0.95)'; g.shadowBlur=30;
      const t1='ONE PRICE.  ', t2='TWO OUTCOMES.', w1=g.measureText(t1).width, w2=g.measureText(t2).width, x=SAFE.cx-(w1+w2)/2;
      g.globalAlpha=a1; g.fillStyle=COL.ink; g.fillText(t1,x,CAP_Y); g.globalAlpha=a2; g.fillStyle=GOLD; g.fillText(t2,x+w1,CAP_Y); g.restore(); } }
  VW.captions(t,GROUPS,{y:CAP_Y+22,size:66,keySize:76,keys:new Map([['blocks',GOLD],['printing',GOLD],['volume.',COL.ink2],['Volwick',COL.blue],['traded.',GOLD],['level.',GOLD],['HELD.',GREEN],['held.',GREEN],['broken.',RED],['signal.',COL.ink]]),until:E.chart2-0.15});
  if (t>E.logo0){ const y=SY(cB.PY(LVL)), pts=[]; for (let i=0;i<N;i++) pts.push([mix(V.x0,V.x1,i/(N-1)),y]);
    VW.logoForm((t-E.logo0)*LSP, pts, {fadeOut:seg(t,E.loop0,E.total-0.15), noUrl:true});
    const out=1-seg(t,E.loop0,E.total-0.15), k=eo(lin(t,E.dv,E.dv+0.3))*out;
    if (k>0){ g.save(); g.globalAlpha=k; g.textAlign='center'; g.textBaseline='middle'; g.font='700 44px VWMono'; g.letterSpacing='5px';
      g.fillStyle=COL.blue; g.shadowColor='rgba(90,140,255,0.8)'; g.shadowBlur=20; g.fillText('DISCOVER VOLWICK →',543,1352+(1-k)*10); g.restore(); }
    const kd=eo(lin(t,E.dv+0.3,E.dv+0.7))*out;
    if (kd>0){ g.save(); g.globalAlpha=kd; g.textAlign='center'; g.textBaseline='middle'; g.font='500 25px VWMono'; g.letterSpacing='1px'; g.fillStyle=COL.ink3; g.fillText('Hypothetical results. Not investment advice.',540,1420); g.restore(); } }
  VW.guides();
}
window.render=render;
window.READY=(async()=>{
  const q=new URLSearchParams(location.search);
  WORDS=await (await fetch(q.get('words')||'words.json')).json();
  CUES=(await (await fetch('cues.json')).json()).cues;
  GROUPS=VW.buildGroups(WORDS.filter(w=>w[1]>W('outcomes.',1,'e')+0.2),3,16);
  buildTimeline(); await VW.loadFonts(); await VW.loadBrand(); render(0);
  const nAt=t=>state(t).n, pAt=t=>cB.lastPrice(nAt(t)); let tc=E.held; while (pAt(tc)<LVL && tc<E.held+2) tc+=0.005;
  return {...window.DATA_CHECK, total:S.total, events:E, signFlipAt:tc, flipEvent:E.flip, pnlAtFlip:r2(pAt(E.flip)-LVL)*SH, pnlAtHeldPlus05:r2(pAt(E.held+0.5)-LVL)*SH};
})();
