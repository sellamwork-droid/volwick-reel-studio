// ============================================================
// Scene P · γ MAP · "Same drop. Different ground."
// The gamma map as in the terminal: price-by-time heat map behind the candles, one column per 5 minutes,
// BLUE = dealers long gamma (moves absorbed), AMBER = short gamma (moves amplified), white line where the sign changes.
// The map runs until about 30 minutes past the newest candle. Two ILLUSTRATIVE scenarios from the same drop:
// A in a blue field (stalls), B below the white line in amber (runs). Hypothetical short 1 ES at 7,745.00, exit 15 min later.
// All data SIMULATED.
// ============================================================
const S = {};
const {COL, SAFE, seg, lin, eo, eio, mix, clamp} = VW;
const GOLD='#F2C14E', RED='#E2575F', GREEN=COL.up, BLUE='#4C8DFF', AMBER='#F5A623', WHITE='#F2F5FA';

// ---------- simulated ES (tick 0.25, $50 per point) ----------
const N=57, ENTRY=7745.00, PT=50, EB=41, FLIP_B=7746.0;
const q=x=>Math.round(x*4)/4;
function mk(seed, tgt, fix){ const R=VW.rng(seed), B=[]; let c=7752.5;
  for (let i=0;i<N;i++){ const o=c; let cl=q(tgt(i)+(R()-0.5)*1.0); if (fix[i]) cl=fix[i];
    const h=q(Math.max(o,cl)+R()*1.0+0.25), l=q(Math.min(o,cl)-R()*1.0-0.25); B.push({o,h,l,c:cl,v:Math.round(1600+R()*1500)}); c=cl; } return B; }
const common=i=> i<35 ? 7752.5+1.6*Math.sin(i*0.7)+0.6*Math.sin(i*1.9) : mix(7752,7745.75,eio((i-34)/6));
const BARS_A=mk(5101, i=> i<=EB ? common(i) : mix(7744,7749.5,eo((i-EB)/(N-1-EB)))+0.9*Math.sin(i*1.3), {[EB]:7745.75,[N-1]:7749.50});
const BARS_B=BARS_A.slice(0,EB).map(b=>({...b})).concat(mk(5101, i=> i<=EB ? common(i) : mix(7743,7728.75,eo((i-EB)/(N-1-EB))), {[EB]:7743.00,[N-1]:7728.75}).slice(EB));
BARS_B[EB].o=BARS_A[EB].o; BARS_B[EB].h=BARS_A[EB].h; BARS_A[EB].l=Math.min(BARS_A[EB].l,7744.50);   // the short at 7,745.00 is filled in both
// both scenarios open the entry bar at the same price and cross 7,745.00 inside it
const pnl=x=>(ENTRY-x)*PT;                                  // short
window.DATA_CHECK={ entry:ENTRY, exitA:BARS_A[N-1].c, exitB:BARS_B[N-1].c, pnlA:pnl(BARS_A[N-1].c), pnlB:pnl(BARS_B[N-1].c),
  sameBefore:BARS_A.slice(0,EB).every((b,i)=>b.c===BARS_B[i].c), entryBarOpen:BARS_A[EB].o, entryBarLowA:BARS_A[EB].l, entryBarLowB:BARS_B[EB].l };

// ---------- the gamma field (value in -1..1, + = blue / long gamma) ----------
function fieldA(p,col){ const d=Math.abs(p-7750.5); return clamp((12-d)/5,-1,1)*(0.8+0.2*Math.sin(col*0.9)); }     // blue around spot, amber wedges beyond ±12
function fieldB(p,col){ return clamp((p-FLIP_B)/5,-1,1)*(0.8+0.2*Math.sin(col*0.7+1)); }                               // sign change at 7,746

// ---------- world (fixed scale) and viewport ----------
const K=34, BW=16, PMAX=7770, PMIN=7722;
const LB={cvd:{y0:0,y1:0},x0:0,x1:N*BW,y0:0,y1:(PMAX-PMIN)*K,pMin:PMIN,pMax:PMAX};
const cA=new VW.Chart(BARS_A,LB), cB=new VW.Chart(BARS_B,LB);
const V={x0:96,x1:826,y0:466,y1:1408}; V.w=V.x1-V.x0; V.h=V.y1-V.y0; V.cx=(V.x0+V.x1)/2; V.cy=(V.y0+V.y1)/2;
const AX=836, CAP_Y=392, VOLH=64, VMAX=5200, LSP=1.7;
let CAM={cx:0,cy:0,s:1};
const SX=x=>V.cx+(x-CAM.cx)*CAM.s, SY=y=>V.cy+(y-CAM.cy)*CAM.s, WY=sy=>CAM.cy+(sy-V.cy)/CAM.s, PY=p=>cA.PY(p), X=i=>cA.X(i);
const f2=p=>p.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const fmt=v=>(v>=0?'+':'−')+'$'+Math.abs(v).toFixed(2);

let WORDS=[], GROUPS=[], CUES={};
function W(word,nth=1,edge='s'){ let c=0; for (const w of WORDS){ if (w[0].replace(/[^\w']/g,'').toLowerCase()===word.replace(/[^\w']/g,'').toLowerCase()){ if (++c===nth) return edge==='s'?w[1]:w[2]; } } throw new Error('word not found: '+word+' #'+nth); }
let E={};
function buildTimeline(){
  E.diff=W('Different'); E.hookE=W('ground.',1,'e');
  E.behind=W('Behind'); E.l1E=W('book.',1,'e');
  E.blue=W('Blue:'); E.blueE=W('absorbed.',1,'e'); E.amber=W('Amber:'); E.amberE=W('amplified.',1,'e');
  E.scA=W('Scenario',1); E.lands=W('lands'); E.stalls=W('stalls.'); E.stallsE=W('stalls.',1,'e');
  E.scB=W('Scenario',2); E.below=W('Below'); E.amberB=W('amber.',1,'e'); E.runs=W('runs.'); E.runsE=W('runs.',1,'e');
  E.chart2=W('chart',1); E.moveE=W('move.',1,'e'); E.vw2=W('Volwick',2); E.ctxE=W('it.',1,'e');
  E.rw0=E.hookE+0.1; E.logo0=CUES.logo0; E.beat=E.logo0+1.75/LSP; E.dv=CUES.dvv[0]-0.08; E.loop0=CUES.loop0; E.total=E.loop0+0.5;
  E.cmp0=E.runsE+0.9; E.cmp1=E.vw2-0.25; E.bRw0=E.scB-0.35; E.bRw1=E.scB+0.2;
  Object.assign(E,{softBoom:1, hookBuyers:E.diff, div:E.blue, cvdWord:E.amber, b0:E.behind, b1:E.l1E, flow:E.lands,
    volwick:E.vw2, holdHit:E.stalls+0.02, breakHit:E.runs+0.03, swap:E.bRw0, riser0:E.amberB, riser1:E.runs, ctaWhoosh:E.vw2-0.25});
  S.total=E.total;
}

// ---------- state ----------
function state(t){
  const st={}; const loop=t>=E.loop0, tt=loop?0:t;
  // scenario A clock
  if (tt<E.rw0) st.n=EB+0.55;
  else if (t<E.behind) st.n=mix(EB+0.55,22,eio(lin(t,E.rw0,E.behind)));
  else if (t<E.scA) st.n=mix(22,34,lin(t,E.behind,E.scA));
  else if (t<E.stalls) st.n=mix(34,EB+0.6,eio(lin(t,E.scA,E.stalls)));                  // the drop, entry crossed inside bar 41
  else st.n=mix(EB+0.6,N,eo(lin(t,E.stalls,E.stalls+1.6)));                               // it stalls and climbs back
  // scenario B clock (same session up to bar 41)
  st.b=loop?0:seg(t,E.bRw0,E.bRw1);
  if (t<E.bRw1) st.nB=36; else if (t<E.runs) st.nB=mix(36,EB+0.35,eio(lin(t,E.bRw1,E.runs))); else st.nB=mix(EB+0.35,N,eo(lin(t,E.runs,E.runs+1.6)));
  // map: A fades in from "Behind the candles", sweeps column by column; B replaces it in scenario B
  st.mapA = loop?0 : seg(t,E.behind+0.2,E.behind+0.6)*(1-st.b);
  st.sweep = loop?1 : clamp(lin(t,E.behind+0.2,E.l1E),0,1);
  st.mapB = loop?0 : st.b;
  st.hiBlue = loop?0 : seg(t,E.blue-0.1,E.blue+0.3)*(1-seg(t,E.amber-0.2,E.amber+0.1));
  st.hiAmber= loop?0 : seg(t,E.amber-0.1,E.amber+0.3)*(1-seg(t,E.scA-0.3,E.scA));
  st.cmp = loop?0 : seg(t,E.cmp0,E.cmp0+0.4)*(1-seg(t,E.cmp1,E.cmp1+0.3));
  st.cta = loop?0 : seg(t,E.vw2-0.25,E.vw2+0.35);
  st.moveOnly = loop?0 : seg(t,E.chart2-0.2,E.chart2+0.2)*(1-seg(t,E.vw2-0.2,E.vw2+0.2));
  return st;
}

// ---------- camera ----------
const camHook={s:0.8, cx:(X(18)+X(56))/2+30, cy:(PY(7756.5)+PY(7727.5))/2};
const camMap ={s:0.82, cx:X(24), cy:PY(7750.5)};
const camWide={s:0.8, cx:(X(18)+X(56))/2+30, cy:(PY(7756.5)+PY(7727.5))/2};
function camFollow(c,n){ const p=c.lastPrice(Math.max(1,n)), s=1.15, xNew=c.X(Math.max(0,Math.min(N-1,n-0.5)));
  return {s, cx:Math.max(V.w/2/s-8, xNew-(0.78-0.5)*V.w/s), cy:PY(mix(ENTRY+3,p,0.5))}; }
const mixCam=(a,b,k)=>({s:Math.exp(mix(Math.log(a.s),Math.log(b.s),k)), cx:mix(a.cx,b.cx,k), cy:mix(a.cy,b.cy,k)});
function camera(t,st){
  if (t>=E.loop0) return camHook;
  let c=camMap;
  c=mixCam(c,camFollow(cA,st.n),seg(t,E.scA-0.4,E.scA+0.2));
  if (st.b>0) c=mixCam(c,camFollow(cB,st.nB),st.b);
  c=mixCam(c,camWide,seg(t,E.cmp0-0.3,E.cmp0+0.3));
  c=mixCam(c,camHook,1-seg(t,E.rw0-0.05,E.rw0+0.45));
  return c; }

// ---------- drawings ----------
function panel(){ const g=VW.g; g.save(); g.fillStyle='rgba(10,16,30,0.55)'; VW.roundRect(V.x0-14,V.y0-20,AX+118-(V.x0-14),V.h+40,18); g.fill();
  g.strokeStyle='rgba(120,150,210,0.14)'; g.lineWidth=1.2; g.stroke(); g.restore(); }
function axis(yTag,a){ const g=VW.g; const step=CAM.s>=1.05?2.5:5;
  g.save(); g.globalAlpha=0.85*a; g.font='600 28px VWMono'; g.fillStyle=COL.ink2; g.textAlign='left'; g.textBaseline='middle';
  const pTop=PMIN+(LB.y1-WY(V.y0))/K, pBot=PMIN+(LB.y1-WY(V.y1-VOLH))/K;
  for (let p=Math.ceil(pBot/step)*step; p<=pTop; p+=step){ const y=SY(PY(p)); if (y<V.y0+16||y>V.y1-VOLH-16||Math.abs(y-yTag)<48) continue; g.fillText(f2(p),AX,y); }
  g.restore(); }
function priceTag(p,a){ if (a<=0) return; const g=VW.g, y=clamp(SY(PY(p)),V.y0+26,V.y1-26); g.save(); g.globalAlpha=a;
  g.setLineDash([6,8]); g.strokeStyle=VW.rgba(GOLD,0.5); g.lineWidth=1.5; g.beginPath(); g.moveTo(V.x0,y); g.lineTo(AX-8,y); g.stroke(); g.setLineDash([]);
  g.fillStyle=GOLD; VW.roundRect(AX-10,y-26,132,52,9); g.fill(); g.fillStyle='#120E02'; g.font='700 26px VWMono'; g.textAlign='center'; g.textBaseline='middle'; g.fillText(f2(q(p)),AX+56,y+1); g.restore(); }
function volume(B,n,a,from=0){ const g=VW.g; g.save(); g.globalAlpha=a;
  for (let i=from;i<Math.ceil(n)&&i<N;i++){ const x=SX(X(i)); if (x<V.x0-20||x>V.x1+20) continue; const k=clamp(n-i,0,1), b=B[i];
    g.fillStyle=VW.rgba(b.c>=b.o?COL.up:COL.dn,0.26*k); const h=b.v/VMAX*VOLH*eo(k), w=Math.max(2,BW*CAM.s*0.62); g.fillRect(x-w/2,V.y1-h,w,h); } g.restore(); }
function drawCandle(B,i,k,a){ if (k<=0||a<=0) return; const g=VW.g, b=B[i], x=X(i), kk=VW.eoe(k), cl=mix(b.o,b.c,kk), hi=mix(Math.max(b.o,cl),b.h,kk), lo=mix(Math.min(b.o,cl),b.l,kk);
  g.globalAlpha=a*Math.min(1,k*2.5); const col=cl>=b.o?COL.up:COL.dn; g.strokeStyle=col; g.lineWidth=2.4/CAM.s; g.beginPath(); g.moveTo(x,PY(hi)); g.lineTo(x,PY(lo)); g.stroke();
  const y1=PY(Math.max(b.o,cl)), y2=PY(Math.min(b.o,cl)); g.fillStyle=col; g.fillRect(x-BW*0.33,y1,BW*0.66,Math.max(2/CAM.s,y2-y1)); g.globalAlpha=1; }
function candles(B,n,from,a){ for (let i=from;i<Math.ceil(n)&&i<N;i++) drawCandle(B,i,clamp(n-i,0,1),a); }
// heat map: 5-bar columns, 1-point rows, up to 30 bars past the newest candle (world)
function heatmap(field,n,a,sweep,hiB,hiA){ if (a<=0) return; const g=VW.g, cols=Math.ceil(N/5), last=Math.min(cols, Math.ceil((n+30)/5)), vis=Math.ceil(last*sweep);
  for (let c=0;c<vis;c++){ const x0=c*5*BW, w=5*BW-1;
    for (let p=PMIN; p<PMAX; p+=1){ const v=field(p+0.5,c), m=Math.abs(v), col=v>=0?BLUE:AMBER, hl=v>=0?hiB:hiA;
      g.fillStyle=VW.rgba(col,a*(0.06+0.30*m)*(1+0.9*hl)); g.fillRect(x0,PY(p+1),w,K-1); } } }
function signLine(lv,a,label){ if (a<=0) return; const g=VW.g, y=PY(lv); g.save(); g.globalAlpha=a; g.strokeStyle=WHITE; g.lineWidth=2.5/CAM.s; g.setLineDash([10/CAM.s,8/CAM.s]);
  g.shadowColor='rgba(255,255,255,0.7)'; g.shadowBlur=10; g.beginPath(); g.moveTo(-2000,y); g.lineTo(LB.x1+2000,y); g.stroke(); g.restore(); }
function signLabel(lv,a,txt){ if (a<=0) return; const g=VW.g, y=SY(PY(lv)); g.save(); g.globalAlpha=a; g.font='700 28px VWMono'; g.fillStyle=WHITE; g.shadowColor='rgba(0,0,0,0.9)'; g.shadowBlur=12;
  g.textAlign='left'; g.textBaseline='top'; g.fillText(txt,V.x0+14,y+12); g.restore(); }
function bandLabel(txt,col,p,a,right=false){ if (a<=0) return; const g=VW.g, y=SY(PY(p)); if (y<V.y0+80||y>V.y1-VOLH-30) return; g.save(); g.globalAlpha=a; g.font='700 30px VWMono'; g.letterSpacing='1px';
  const w=g.measureText(txt).width+28, x0=right?V.x1-12-w:V.x0+12; g.fillStyle='rgba(6,10,20,0.78)'; VW.roundRect(x0,y-26,w,52,10); g.fill(); g.fillStyle=col; g.textAlign='left'; g.textBaseline='middle'; g.fillText(txt,x0+14,y+1); g.restore(); }
function chip(txt,col,a,row=0){ if (a<=0) return; const g=VW.g; g.save(); g.globalAlpha=a; g.font='700 27px VWMono'; g.letterSpacing='2px'; const w=g.measureText(txt).width+32;
  g.fillStyle='rgba(6,10,20,0.85)'; VW.roundRect(V.x0+10,V.y0+12+row*58,w,48,10); g.fill(); g.strokeStyle=VW.rgba(col,0.6); g.lineWidth=1.5; g.stroke();
  g.fillStyle=col; g.textAlign='left'; g.textBaseline='middle'; g.fillText(txt,V.x0+26,V.y0+37+row*58); g.restore(); }
// hypothetical short: box entry -> price (green if in profit), screen counter on the left above the entry
function positionBox(c,n,a){ if (a<=0||n<EB+0.4) return; const g=VW.g, p=c.lastPrice(n), x0=X(EB)-BW*0.5, x1=X(Math.min(N-1,n-0.001))+BW*0.5, up=p<=ENTRY, col=up?GREEN:RED;
  g.save(); g.globalAlpha=a*clamp((n-EB-0.4)*6,0,1); g.fillStyle=VW.rgba(col,0.16); g.fillRect(x0,Math.min(PY(ENTRY),PY(p)),x1-x0,Math.abs(PY(p)-PY(ENTRY)));
  g.strokeStyle=VW.rgba(GOLD,0.9); g.lineWidth=2/CAM.s; g.setLineDash([8/CAM.s,6/CAM.s]); g.beginPath(); g.moveTo(x0,PY(ENTRY)); g.lineTo(x1,PY(ENTRY)); g.stroke(); g.setLineDash([]); g.restore(); }
function pnlHero(c,n,a,label){ if (a<=0||n<EB+0.4) return; const g=VW.g, p=q(c.lastPrice(n)), usd=pnl(p), col=usd>0.004?GREEN:(usd<-0.004?RED:COL.ink);
  const x=V.x0+14, y=V.y1-VOLH-70; g.save(); g.globalAlpha=a*clamp((n-EB-0.4)*6,0,1); g.textAlign='left'; g.textBaseline='alphabetic';
  g.font='700 27px VWMono'; g.letterSpacing='2px'; g.fillStyle=COL.ink2; g.fillText(label,x+4,y-78); g.letterSpacing='0px';
  g.font='700 84px VWMono'; g.fillStyle=col; g.shadowColor=VW.rgba(col,0.55); g.shadowBlur=18; g.fillText(Math.abs(usd)<0.004?'$0.00':fmt(usd),x,y); g.shadowBlur=0;
  g.font='600 27px VWMono'; g.fillStyle=COL.ink2; g.fillText('HYPOTHETICAL · SHORT 1 ES', x+4, y+42); g.restore(); }
function compare(a){ if (a<=0) return; const g=VW.g, x=V.x0+14, y=V.y0+190;
  g.save(); g.globalAlpha=a; g.fillStyle='rgba(6,10,20,0.84)'; VW.roundRect(x-12,y-62,640,262,14); g.fill(); g.textAlign='left'; g.textBaseline='alphabetic';
  [[`A · BLUE   ${fmt(pnl(BARS_A[N-1].c))}`,RED,0],[`B · AMBER  ${fmt(pnl(BARS_B[N-1].c))}`,GREEN,72]].forEach(([s,col,dy])=>{ g.font='700 52px VWMono'; g.fillStyle=col; g.shadowColor=VW.rgba(col,0.5); g.shadowBlur=14; g.fillText(s,x,y+dy); });
  g.shadowBlur=0; g.font='600 27px VWMono'; g.fillStyle=COL.ink2; g.fillText('HYPOTHETICAL · SHORT 1 ES @ '+f2(ENTRY),x+4,y+112); g.fillText('EXIT 15 MIN LATER · NO FEES',x+4,y+144);
  g.fillStyle=WHITE; g.font='700 27px VWMono'; g.fillText('NOT A DIRECTION CALL · A READ OF THE DAY',x+4,y+184); g.restore(); }
// hook: two dotted futures from the entry, with their P&L
function hookPaths(t,a){ if (a<=0) return; const g=VW.g; const x0=SX(X(EB)), y0=SY(PY(ENTRY));
  [[BARS_A,BLUE,E.diff-0.6],[BARS_B,AMBER,E.diff-0.1]].forEach(([B,col,t0],j)=>{ const k=clamp((t-t0)/0.5,0,1); if (k<=0) return; g.save(); g.globalAlpha=a; g.setLineDash([10,8]); g.strokeStyle=col; g.lineWidth=4; g.shadowColor=col; g.shadowBlur=10;
    g.beginPath(); g.moveTo(x0,y0); const last=EB+1+Math.floor((N-1-EB-1)*eo(k)); for (let i=EB+1;i<=last;i++) g.lineTo(SX(X(i)),SY(PY(B[i].c))); g.stroke(); g.setLineDash([]); g.shadowBlur=0;
    if (k>0.6){ const yE=SY(PY(B[N-1].c)), v=pnl(B[N-1].c); g.globalAlpha=a*clamp((k-0.6)*3,0,1); g.font='700 50px VWMono'; g.fillStyle=v>=0?GREEN:RED; g.shadowColor='rgba(0,0,0,0.9)'; g.shadowBlur=12;
      g.textAlign='right'; g.textBaseline=j===0?'bottom':'top'; g.fillText(fmt(v),V.x1-8,yE+(j===0?-14:14)); }
    g.restore(); }); }
function emerge(txt,col,y,k,below=false){ if (k<=0) return; const g=VW.g, h=70;
  g.save(); g.beginPath(); if (below) g.rect(0,y+4,VW.W,h+20); else g.rect(0,y-h-20,VW.W,h+20); g.clip(); g.globalAlpha=Math.min(1,k*1.4);
  g.textAlign='center'; g.font='700 40px VWSans'; g.fillStyle=col; g.shadowColor='rgba(0,0,0,0.9)'; g.shadowBlur=24;
  if (below){ g.textBaseline='top'; g.fillText(txt,SAFE.cx,y+14-(1-eo(k))*h); } else { g.textBaseline='bottom'; g.fillText(txt,SAFE.cx,y-14+(1-eo(k))*h); }
  g.restore(); }

// ---------- render ----------
function render(t){
  const g=VW.g; g.setTransform(1,0,0,1,0,0); g.globalAlpha=1; g.filter='none';
  VW.background(t);
  const st=state(t), tt=t>=E.loop0?0:t, hook=tt<E.rw0;
  CAM=camera(t,st);
  const curB=st.b>0.5?BARS_B:BARS_A, curC=st.b>0.5?cB:cA, curN=st.b>0.5?st.nB:st.n, p=curC.lastPrice(Math.max(1,curN)), yTag=clamp(SY(PY(p)),V.y0+26,V.y1-26);
  const candleA=(1-0.75*st.cta)*(1-0.3*st.hiBlue)*(1-0.3*st.hiAmber), mapK=(1-0.7*st.moveOnly);
  panel(); axis(yTag,1-0.8*st.cta);
  volume(BARS_A,Math.min(st.n,EB),candleA); volume(BARS_A,st.n,candleA*(1-st.b),EB); volume(BARS_B,st.nB,candleA*st.b,EB);
  // world
  g.save(); g.beginPath(); g.rect(V.x0,V.y0,V.w,V.h); g.clip(); g.translate(V.cx,V.cy); g.scale(CAM.s,CAM.s); g.translate(-CAM.cx,-CAM.cy);
  heatmap(fieldA, st.n, st.mapA*mapK, st.sweep, st.hiBlue, st.hiAmber);
  heatmap(fieldB, st.nB, st.mapB*mapK*(t>=E.loop0?0:1), 1, 0, seg(t,E.below,E.amberB));
  signLine(7738.5,st.mapA*0.8,''); signLine(7762.5,st.mapA*0.8,''); signLine(FLIP_B,st.mapB,'');
  const trade=(hook||t>=E.loop0)?0:(1-seg(t,E.vw2-0.4,E.vw2));
  positionBox(cA,st.n,trade*(1-0.7*st.b)); if (st.b>0) positionBox(cB,st.nB,trade*st.b);
  candles(BARS_A,Math.min(st.n,EB),0,candleA);
  candles(BARS_A,st.n,EB,candleA*(1-0.7*st.b));
  if (st.b>0) candles(BARS_B,st.nB,EB,candleA*st.b);
  g.restore();
  // screen
  priceTag(p,1-st.cta);
  if (hook) hookPaths(tt,1);
  signLabel(FLIP_B,st.mapB*(1-st.cmp)*(1-st.cta),'SIGN CHANGE · '+f2(FLIP_B));
  bandLabel('BLUE · LONG γ · ABSORBS',BLUE,7752,st.hiBlue);
  bandLabel('AMBER · SHORT γ · AMPLIFIES',AMBER,7764,st.hiAmber,true);
  const hero=trade*(1-clamp(st.cmp*2,0,1));
  if (st.b<0.5) pnlHero(cA,st.n,hero*(1-2*st.b),'SCENARIO A · SIMULATED'); else pnlHero(cB,st.nB,hero*(2*st.b-1),'SCENARIO B · SIMULATED');
  compare(clamp(st.cmp*2-1,0,1)*(1-st.cta));
  if (!hook && t<E.vw2-0.3) chip('MAP · GAMMA',COL.ink2,Math.max(st.mapA,st.mapB)*(1-st.cmp));
  if (t<E.loop0){ const yL=SY(PY(FLIP_B)); emerge('THE CHART SHOWS THE MOVE.',COL.ink,yL,seg(t,E.vw2-0.05,E.vw2+0.45)); emerge('VOLWICK SHOWS THE GROUND UNDER IT.',AMBER,yL,seg(t,E.vw2+0.15,E.vw2+0.65),true); }
  VW.vignette(); VW.topBand(330);
  const endK=seg(t,E.logo0,E.logo0+0.5)*(1-seg(t,E.loop0,E.total-0.15));
  VW.logoTL(1-endK,'ES',52,30,true);
  const hOut=1-seg(tt,E.hookE-0.05,E.hookE+0.2);
  { const a1=eo(lin(tt,-0.3,0))*hOut, a2=eo(lin(tt,E.diff-0.05,E.diff+0.15))*hOut; g.save(); g.textAlign='center'; g.textBaseline='middle'; g.shadowColor='rgba(0,0,0,0.95)'; g.shadowBlur=30;
    g.font='700 54px VWSans'; if (a1>0){ g.globalAlpha=a1; g.fillStyle=COL.ink; g.fillText('SAME DROP.',SAFE.cx,352); }
    if (a2>0){ g.globalAlpha=a2; g.fillStyle=AMBER; g.fillText('DIFFERENT GROUND.',SAFE.cx,414); } g.restore(); }
  VW.captions(t,GROUPS,{y:CAP_Y+22,size:66,keySize:76,keys:new Map([['Blue:',BLUE],['absorbed.',BLUE],['Amber:',AMBER],['amplified.',AMBER],['blue.',BLUE],['amber.',AMBER],['white',WHITE],['stalls.',BLUE],['runs.',AMBER],['Volwick',COL.blue],['ground',AMBER]]),until:E.vw2-0.15});
  if (t>E.logo0){ const y=SY(PY(FLIP_B)), pts=[]; for (let i=0;i<N;i++) pts.push([mix(V.x0,V.x1,i/(N-1)),y]);
    VW.logoForm((t-E.logo0)*LSP, pts, {fadeOut:seg(t,E.loop0,E.total-0.15), noUrl:true});
    const out=1-seg(t,E.loop0,E.total-0.15), k=eo(lin(t,E.dv,E.dv+0.3))*out;
    if (k>0){ g.save(); g.globalAlpha=k; g.textAlign='center'; g.textBaseline='middle'; g.font='700 44px VWMono'; g.letterSpacing='5px';
      g.fillStyle=COL.blue; g.shadowColor='rgba(90,140,255,0.8)'; g.shadowBlur=20; g.fillText('DISCOVER VOLWICK →',543,1352+(1-k)*10); g.restore(); }
    const kd=eo(lin(t,E.dv+0.3,E.dv+0.7))*out;
    if (kd>0){ g.save(); g.globalAlpha=kd; g.textAlign='center'; g.textBaseline='middle'; g.font='600 29px VWMono'; g.fillStyle=COL.ink2; g.fillText('Simulated scenarios. Not investment advice.',540,1418); g.restore(); } }
  VW.guides();
}
window.render=render;
window.READY=(async()=>{
  const qs=new URLSearchParams(location.search);
  WORDS=await (await fetch(qs.get('words')||'words.json')).json();
  CUES=(await (await fetch('cues.json')).json()).cues;
  GROUPS=VW.buildGroups(WORDS.filter(w=>w[1]>W('ground.',1,'e')+0.2),3,16);
  buildTimeline(); await VW.loadFonts(); await VW.loadBrand(); render(0);
  return {...window.DATA_CHECK, total:S.total, events:E};
})();
