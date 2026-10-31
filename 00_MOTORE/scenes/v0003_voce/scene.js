// ============================================================
// V0003 · THE PIN (T2, 31 Oct 2026) · stampo Assorbimento V2 (price panel, voice-led, captions word by word).
// Price sits in a 2.5-point range on a call wall where dealers are long gamma; their hedging sells rallies and buys dips;
// when price moves away from the wall the range opens again. Voice: HeyGen Matthew (words.json / cues.json). All data SIMULATED.
// ============================================================
const S = {};
const {COL, SAFE, seg, lin, eo, eio, mix, clamp} = VW;
const GOLD='#F2C14E', RED='#E2575F', GREEN=COL.up, WHITE='#F2F5FA', WALLC='#26C08A';
const q=x=>Math.round(x*4)/4;

// ---------- simulated ES 1m session ----------
const N=60, P0=14, P1=44, WALL=7744.5;
const BARS = VW.simSession({
  seed: 20261103, start: 7731.25, n: N,
  target: i => i<P0 ? 7731.25+(WALL-0.75-7731.25)*eio(i/(P0-1))+Math.sin(i*1.2)*0.6
            : i<=P1 ? WALL+0.9*Math.sin(i*1.7)+0.3*Math.sin(i*0.6)
            : WALL-(WALL-7734.5)*eo((i-P1)/(N-1-P1))+Math.sin(i*1.4)*1.6,
  vol: (i,body,R) => i>=P0&&i<=P1 ? Math.round(1300+R()*700) : Math.round(2200+R()*1300+body*260),
  delta: (i,ret,gauss) => ret*160+gauss()*110
});
// keep the pinned bars inside the 2.5-point box around the wall, the open range wider after it
const RLO=7743.25, RHI=7745.75;
BARS.forEach((b,i)=>{ if (i>0) b.o=BARS[i-1].c;
  if (i>=P0&&i<=P1){ b.c=clamp(q(b.c),RLO+0.25,RHI-0.25); b.h=clamp(Math.max(b.h,b.o,b.c),Math.max(b.o,b.c),RHI); b.l=clamp(Math.min(b.l,b.o,b.c),RLO,Math.min(b.o,b.c)); }
  b.h=Math.max(b.h,b.o,b.c); b.l=Math.min(b.l,b.o,b.c); });
const after=BARS.slice(P1+1), AHI=Math.max(...after.map(b=>b.h)), ALO=Math.min(...after.map(b=>b.l));
window.DATA_CHECK={ pinHi:Math.max(...BARS.slice(P0,P1+1).map(b=>b.h)), pinLo:Math.min(...BARS.slice(P0,P1+1).map(b=>b.l)), afterHi:AHI, afterLo:ALO, last:BARS[N-1].c };

// ---------- layout (2026 zones) ----------
const PR={pMin:7730.5, pMax:7748.5};
const L={x0:104, x1:820, y0:640, y1:1400, ...PR, cvd:{y0:1400, y1:1410}};
const C=new VW.Chart(BARS,L);
const AX=836, LSP=1.7;
const X=i=>C.X(i), PY=p=>C.PY(p);
const f2=p=>p.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});

let WORDS=[], GROUPS=[], CUES={};
function W(word,nth=1,edge='s'){ let c=0; for (const w of WORDS){ if (w[0].replace(/[^\w']/g,'').toLowerCase()===word.replace(/[^\w']/g,'').toLowerCase()){ if (++c===nth) return edge==='s'?w[1]:w[2]; } } throw new Error('word not found: '+word+' #'+nth); }
let E={};
function buildTimeline(){
  E.its=W("It's"); E.hookE=W('accident.',1,'e'); E.rw0=E.hookE+0.1; E.n0=E.rw0+0.45;
  E.less=W('less'); E.sold=W('sold.'); E.bought=W('bought.'); E.boughtE=W('bought.',1,'e');
  E.wall=W('call'); E.long=W('long',1); E.sell=W('sell'); E.buy=W('buy'); E.pin=W('pin');
  E.when=W('When'); E.away=W('away'); E.open=W('open'); E.againE=W('again.',1,'e');
  E.logo0=CUES.logo0; E.dv=CUES.dvv[0]-0.08; E.loop0=CUES.loop0; E.total=CUES.total;
  S.total=E.total;
}

// ---------- state ----------
function state(t){
  const st={}, loop=t>=E.loop0, tt=loop?0:t;
  if (tt<E.rw0) st.n=P1+0.6;
  else if (t<E.n0) st.n=mix(P1+0.6,6,eio(lin(t,E.rw0,E.n0)));
  else if (t<E.boughtE) st.n=mix(6,30,lin(t,E.n0,E.boughtE));
  else if (t<E.pin) st.n=mix(30,P1+0.6,lin(t,E.boughtE,E.pin));
  else if (t<E.when) st.n=P1+0.6;
  else st.n=mix(P1+0.6,N,eio(lin(t,E.when,E.againE+0.4)));
  const hk=(tt<E.rw0?1:0)*(1-seg(t,E.rw0-0.1,E.rw0+0.15));
  st.range = loop?0 : Math.max(hk, t>=E.rw0?seg(t,E.less-0.1,E.less+0.4):0);
  st.sold  = loop?0 : seg(t,E.sold-0.1,E.sold+0.3)*(1-seg(t,E.wall-0.3,E.wall+0.2));
  st.bought= loop?0 : seg(t,E.bought-0.1,E.bought+0.3)*(1-seg(t,E.wall-0.3,E.wall+0.2));
  st.wall  = loop?0 : seg(t,E.wall-0.15,E.wall+0.45);
  st.longT = loop?0 : seg(t,E.long-0.1,E.long+0.35);
  st.dSell = loop?0 : seg(t,E.sell-0.1,E.sell+0.3)*(1-seg(t,E.when-0.2,E.when+0.3));
  st.dBuy  = loop?0 : seg(t,E.buy-0.1,E.buy+0.3)*(1-seg(t,E.when-0.2,E.when+0.3));
  st.pin   = loop?0 : seg(t,E.pin-0.1,E.pin+0.35);
  st.open  = loop?0 : seg(t,E.open-0.15,E.open+0.45);
  st.cta = loop?0 : seg(t,E.logo0-0.6,E.logo0);
  return st;
}

// ---------- drawings ----------
function panel(a=1){ const g=VW.g; g.save(); g.globalAlpha=a; g.fillStyle='rgba(10,16,30,0.55)'; VW.roundRect(L.x0-18,L.y0-20,AX+118-(L.x0-18),L.y1-L.y0+40,16); g.fill();
  g.strokeStyle='rgba(120,150,210,0.14)'; g.lineWidth=1.2; g.stroke(); g.restore(); }
function axis(a,yTag){ const g=VW.g; g.save(); g.globalAlpha=0.85*a; g.font='600 27px VWMono'; g.fillStyle=COL.ink2; g.textAlign='left'; g.textBaseline='middle';
  for (let p=Math.ceil(PR.pMin/5)*5; p<=PR.pMax; p+=5){ const y=PY(p); if (y<L.y0+14||y>L.y1-14||Math.abs(y-yTag)<46) continue; g.fillText(f2(p),AX,y);
    g.strokeStyle='rgba(120,150,210,0.07)'; g.lineWidth=1; g.beginPath(); g.moveTo(L.x0,y); g.lineTo(L.x1,y); g.stroke(); } g.restore(); }
function drawCandle(i,k,a){ if (k<=0||a<=0) return; const g=VW.g, b=BARS[i], x=X(i), kk=VW.eoe(k), cl=mix(b.o,b.c,kk), hi=mix(Math.max(b.o,cl),b.h,kk), lo=mix(Math.min(b.o,cl),b.l,kk);
  g.globalAlpha=a*Math.min(1,k*2.5); const col=cl>=b.o?COL.up:COL.dn; g.strokeStyle=col; g.lineWidth=2.2; g.beginPath(); g.moveTo(x,PY(hi)); g.lineTo(x,PY(lo)); g.stroke();
  const y1=PY(Math.max(b.o,cl)), y2=PY(Math.min(b.o,cl)); g.fillStyle=col; g.fillRect(x-C.bw*0.34,y1,C.bw*0.68,Math.max(2,y2-y1)); g.globalAlpha=1; }
function candles(n,a){ for (let i=0;i<Math.ceil(n)&&i<N;i++) drawCandle(i,clamp(n-i,0,1),a); }
function priceTag(p,a){ if (a<=0) return; const g=VW.g, y=clamp(PY(p),L.y0+24,L.y1-24); g.save(); g.globalAlpha=a;
  g.fillStyle=WHITE; VW.roundRect(AX-10,y-26,132,52,9); g.fill(); g.fillStyle='#0B1220'; g.font='700 26px VWMono'; g.textAlign='center'; g.textBaseline='middle'; g.fillText(f2(p),AX+56,y+1); g.restore(); }
// the range box: two dashed rails over the pinned bars, label on top
function rangeBox(i0,i1,lo,hi,a,col,label,above=true,gap=12){ if (a<=0) return; const g=VW.g, x0=X(i0)-C.bw*0.6, x1=X(i1)+C.bw*0.6, xe=mix(x0,x1,eo(clamp(a*1.4,0,1)));
  g.save(); g.globalAlpha=a; g.fillStyle=VW.rgba(col,0.08); g.fillRect(x0,PY(hi),xe-x0,PY(lo)-PY(hi));
  g.strokeStyle=VW.rgba(col,0.9); g.lineWidth=2.5; g.setLineDash([10,8]); g.beginPath(); g.moveTo(x0,PY(hi)); g.lineTo(xe,PY(hi)); g.moveTo(x0,PY(lo)); g.lineTo(xe,PY(lo)); g.stroke(); g.setLineDash([]);
  g.font='700 27px VWMono'; g.letterSpacing='2px'; g.fillStyle=col; g.textAlign='center'; g.textBaseline=above?'bottom':'top'; g.shadowColor='rgba(0,0,0,0.95)'; g.shadowBlur=12;
  g.fillText(label,(x0+x1)/2,above?PY(hi)-gap:PY(lo)+gap); g.restore(); }
// small markers on the rejections inside the range
function marks(a,up){ if (a<=0) return; const g=VW.g; g.save(); g.globalAlpha=a; const col=up?GREEN:RED;
  for (let i=P0+2;i<=30;i+=1){ const b=BARS[i]; const isHi=b.h>=RHI-0.25, isLo=b.l<=RLO+0.25; if (up?!isLo:!isHi) continue;
    const x=X(i), y=up?PY(b.l)+24:PY(b.h)-24; g.fillStyle=col; g.beginPath(); if (up){ g.moveTo(x,y-10); g.lineTo(x-9,y+6); g.lineTo(x+9,y+6); } else { g.moveTo(x,y+10); g.lineTo(x-9,y-6); g.lineTo(x+9,y-6); } g.closePath(); g.fill(); }
  g.restore(); }
function wallLine(a,glow){ if (a<=0) return; const g=VW.g, y=Math.round(PY(WALL))+0.5, xr=mix(L.x0,L.x1,eo(clamp(a*1.3,0,1)));
  g.save(); g.globalAlpha=a; const gr=g.createLinearGradient(L.x0,0,L.x1,0); gr.addColorStop(0,VW.rgba(WALLC,0.15)); gr.addColorStop(1,VW.rgba(WALLC,0.95));
  g.strokeStyle=gr; g.lineWidth=3+3*glow; g.shadowColor=VW.rgba(WALLC,0.9); g.shadowBlur=14+30*glow; g.beginPath(); g.moveTo(L.x0,y); g.lineTo(xr,y); g.stroke(); g.restore(); }
function wallLabel(a,longK){ if (a<=0) return; const g=VW.g, y=PY(WALL); g.save(); g.globalAlpha=a; g.font='700 25px VWMono'; g.letterSpacing='1px'; g.textAlign='left'; g.textBaseline='bottom';
  g.shadowColor='rgba(0,0,0,0.95)'; g.shadowBlur=12; const x=L.x0+10, yy=PY(RHI)-58; g.fillStyle=WALLC; g.fillText('CALL WALL · '+f2(WALL),x,yy);
  if (longK>0){ g.globalAlpha=a*longK; g.font='700 30px VWMono'; g.fillText('LONG γ · +$21.6M',x,yy+38); } g.restore(); }
function dealerTag(a,txt,col,y,arrowUp){ if (a<=0) return; const g=VW.g, x=X(P1)+C.bw*1.2+150; g.save(); g.globalAlpha=a; g.font='700 27px VWMono'; g.letterSpacing='1px';
  const tw=g.measureText(txt).width+28; g.fillStyle='rgba(6,10,20,0.88)'; VW.roundRect(x-tw/2,y-24,tw,48,10); g.fill(); g.strokeStyle=col; g.lineWidth=2; g.stroke();
  g.fillStyle=col; g.textAlign='center'; g.textBaseline='middle'; g.fillText(txt,x,y+1); g.restore(); }

// ---------- render ----------
function render(t){
  const g=VW.g; g.setTransform(1,0,0,1,0,0); g.globalAlpha=1; g.filter='none';
  VW.background(t);
  const st=state(t), tt=t>=E.loop0?0:t, n=st.n, p=q(C.lastPrice(Math.max(1,n)));
  const push=1+0.035*lin(tt,0,E.logo0), fx=(L.x0+L.x1)/2, fy=PY(WALL);
  g.save(); g.translate(fx,fy); g.scale(push,push); g.translate(-fx,-fy);
  const dim=1-0.85*st.cta, pinK=st.pin, glow=VW.punch([E.pin+0.05],t,0.35)+0.25*pinK;
  panel(dim); axis(dim,PY(p));
  wallLine(st.wall*dim,glow*dim);
  const pinCol=pinK>0.5?GOLD:WHITE, pinLab=pinK>0.5?'PINNED · 2.50 PTS':'RANGE · 2.50 PTS';
  rangeBox(P0,P1,RLO,RHI,st.range*dim*(1-0.6*st.open),pinCol,pinLab,false,50); // label under the green triangles (Power, 31 Oct)
  candles(n,dim);
  marks(st.sold*dim,false); marks(st.bought*dim,true);
  wallLabel(st.wall*dim,st.longT);
  dealerTag(st.dSell*dim,'DEALERS SELL ↓',RED,PY(RHI)-70); dealerTag(st.dBuy*dim,'DEALERS BUY ↑',GREEN,PY(RLO)+70);
  rangeBox(P1+1,N-1,ALO,AHI,st.open*dim,WHITE,'RANGE · '+(AHI-ALO).toFixed(2)+' PTS',false);
  priceTag(p,dim);
  g.restore();
  // small disclosure under the panel
  { const a=dim*(1-st.cta); if (a>0){ g.save(); g.globalAlpha=0.9*a; g.font='500 20px VWMono'; g.fillStyle=COL.ink2; g.textAlign='center'; g.textBaseline='middle';
    g.fillText('Simulated ES session. Dealer Walls: modeled options-derived positioning.',SAFE.cx,L.y1+52); g.restore(); } }
  VW.vignette(); VW.topBand(380);
  const endK=seg(t,E.logo0,E.logo0+0.5)*(1-seg(t,E.loop0,E.total-0.15));
  VW.logoTL(1-endK,'ES',52,30,true);
  const hOut=1-seg(tt,E.hookE-0.05,E.hookE+0.25);
  { const a1=eo(lin(tt,-0.3,0))*hOut, a2=eo(lin(tt,E.its-0.05,E.its+0.15))*hOut; g.save(); g.textAlign='center'; g.textBaseline='middle'; g.shadowColor='rgba(0,0,0,0.95)'; g.shadowBlur=30;
    g.font='700 58px VWSans'; if (a1>0){ g.globalAlpha=a1; g.fillStyle=WHITE; g.fillText('PRICE IS STUCK.',SAFE.cx,440); }
    if (a2>0){ g.globalAlpha=a2; g.fillStyle='#6E9BFF'; g.fillText("IT'S NOT AN ACCIDENT.",SAFE.cx,502); } g.restore(); }
  VW.captions(t,GROUPS,{y:490,size:66,keySize:76,keys:new Map([['sold.',RED],['bought.',GREEN],['call',WALLC],['wall.',WALLC],['long',WALLC],['gamma',WALLC],['sell',RED],['buy',GREEN],['pin',GOLD],['range',WHITE],['open',WHITE]]),until:E.logo0-0.2});
  if (t>E.logo0){ const y=PY(WALL), pts=[]; for (let i=0;i<N;i++) pts.push([mix(L.x0,L.x1,i/(N-1)),y]);
    VW.logoForm((t-E.logo0)*LSP, pts, {fadeOut:seg(t,E.loop0,E.total-0.15), noUrl:true, dy:-20, tagY:1318, tagSize:32, tagSpacing:5,
      tagline:[['TRADE',COL.ink],['WITH',COL.ink],['INSTITUTIONAL',COL.blue],['CONTEXT.',COL.ink]]});
    const out=1-seg(t,E.loop0,E.total-0.15), k=eo(lin(t,E.dv,E.dv+0.3))*out;
    if (k>0){ g.save(); g.globalAlpha=k; g.textAlign='center'; g.textBaseline='middle'; g.font='700 44px VWMono'; g.letterSpacing='5px';
      g.fillStyle=COL.blue; g.shadowColor='rgba(90,140,255,0.8)'; g.shadowBlur=20; g.fillText('DISCOVER VOLWICK →',543,1410+(1-k)*10); g.restore(); }
    const kd=eo(lin(t,E.dv+0.3,E.dv+0.7))*out;
    if (kd>0){ g.save(); g.globalAlpha=kd; g.textAlign='center'; g.textBaseline='middle'; g.font='600 29px VWMono'; g.fillStyle=COL.ink2; g.fillText('Simulated data. Not investment advice.',540,1496); g.restore(); } }
  VW.guides();
}
window.render=render;
window.READY=(async()=>{
  const qs=new URLSearchParams(location.search);
  WORDS=await (await fetch(qs.get('words')||'words.json')).json();
  CUES=(await (await fetch(qs.get('cues')||'cues.json')).json()).cues;
  GROUPS=VW.buildGroups(WORDS.filter(w=>w[1]>W('accident.',1,'e')+0.2),3,16,{glue:['long gamma','call wall']});
  buildTimeline(); await VW.loadFonts(); await VW.loadBrand(); render(0);
  return {...window.DATA_CHECK, total:S.total, events:E};
})();
