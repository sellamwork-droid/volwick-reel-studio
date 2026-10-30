// ============================================================
// Scene UTS-11 · ABSORPTION · glance version (stampo D: price on top, CVD below).
// One look: aggressive selling (CVD falling hard) while price sits flat on a level; then price lifts.
// Hypothetical long 1 ES on the level, stop under it, exit at the close. All data SIMULATED.
// ============================================================
const S = {};
const {COL, SAFE, seg, lin, eo, eio, mix, clamp} = VW;
const GOLD='#F2C14E', RED='#E2575F', GREEN=COL.up, WHITE='#F2F5FA', CYAN='#5A8CFF';
const q=x=>Math.round(x*4)/4;

// ---------- simulated ES 1m session ----------
const N=60, A0=19, A1=40, LVL=7700.00, PT=50;
const BARS = VW.simSession({
  seed: 20261028, start: 7718.50, n: N,
  target: i => i<A0 ? 7718.5-(7718.5-7702.25)*eio(i/(A0-1))+Math.sin(i*1.1)*0.7
            : i<=A1 ? 7701.75+0.7*Math.sin(i*1.3)
            : 7702+(7715.25-7702)*eo((i-A1)/(N-1-A1))+Math.sin(i*0.9)*0.5,
  vol: (i,body,R) => i>=A0&&i<=A1 ? Math.round(3600+R()*1600) : Math.round(1700+R()*1100+body*180),
  delta: (i,ret,gauss) => i<A0 ? ret*160-120+gauss()*110 : (i<=A1 ? -430+gauss()*120 : ret*160+60+gauss()*100)
});
BARS.forEach((b,i)=>{ if (i>=A0&&i<=A1){ b.c=clamp(q(b.c),7700.75,7703.00); b.o=i===A0?b.o:BARS[i-1].c; b.h=clamp(Math.max(b.h,b.o,b.c),Math.max(b.o,b.c),7703.75); b.l=clamp(Math.min(b.l,b.o,b.c),7700.25,Math.min(b.o,b.c)); } else if (i>0) b.o=BARS[i-1].c; b.h=Math.max(b.h,b.o,b.c); b.l=Math.min(b.l,b.o,b.c); });
BARS[A1+1].o=BARS[A1].c; BARS[N-1].c=7715.25; BARS[N-1].h=Math.max(BARS[N-1].h,7715.25);
const EB=28, ENTRY=7701.00, STOP=7697.00;                     // long on the level during the absorption
const pnl=p=>(p-ENTRY)*PT;
window.DATA_CHECK={ entry:ENTRY, stop:STOP, exit:BARS[N-1].c, pnl:pnl(BARS[N-1].c), risk:pnl(STOP),
  minLowAfterEntry:Math.min(...BARS.slice(EB).map(b=>b.l)), absorbRangeHi:Math.max(...BARS.slice(A0,A1+1).map(b=>b.h)), absorbRangeLo:Math.min(...BARS.slice(A0,A1+1).map(b=>b.l)),
  cvdA0:BARS[A0].cvd, cvdA1:BARS[A1].cvd, entryInBar:BARS[EB].l<=ENTRY&&BARS[EB].h>=ENTRY };

// ---------- layout (2026 zones) ----------
const PR={pMin:7694, pMax:7722};
const L={x0:104, x1:820, y0:600, y1:1180, ...PR, cvd:{y0:1250, y1:1500}};
const C=new VW.Chart(BARS,L);
const AX=836, LSP=1.7;
const X=i=>C.X(i), PY=p=>C.PY(p), CY=v=>C.CY(v);
const f2=p=>p.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const fmt=v=>(v>=0?'+':'−')+'$'+Math.abs(v).toFixed(2);

let WORDS=[], GROUPS=[], CUES={};
function W(word,nth=1,edge='s'){ let c=0; for (const w of WORDS){ if (w[0].replace(/[^\w']/g,'').toLowerCase()===word.replace(/[^\w']/g,'').toLowerCase()){ if (++c===nth) return edge==='s'?w[1]:w[2]; } } throw new Error('word not found: '+word+' #'+nth); }
let E={};
function buildTimeline(){
  E.priceH=W('Price',1); E.hookE=W('move.',1,'e');
  E.cvd=W('CVD'); E.buys=W('Buys'); E.l1E=W('up.',1,'e');
  E.falls=W('falls'); E.sellers=W('Sellers'); E.l2E=W('bar.',2,'e');
  E.yet=W('Yet'); E.level1=W('level.',1); E.every=W('Every'); E.passive=W('passive'); E.absorption=W('absorption.');
  E.when=W('When'); E.lifted=W('lifted'); E.l5E=W('level.',2,'e');
  E.hold=W('hold.'); E.pull=W('pull'); E.breaks=W('breaks.',1,'e');
  E.rw0=E.hookE+0.1; E.n0=E.rw0+0.45;
  E.logo0=CUES.logo0; E.beat=E.logo0+1.75/LSP; E.dv=CUES.dvv[0]-0.08; E.loop0=CUES.loop0; E.total=E.loop0+0.5;
  Object.assign(E,{hookBuyers:E.priceH, div:E.falls, cvdWord:E.cvd, b0:E.sellers, b1:E.l2E, flow:E.passive, volwick:E.hold,
    holdHit:E.absorption+0.05, count0:E.lifted, count1:E.l5E});
  S.total=E.total;
}

// ---------- state ----------
function state(t){
  const st={}, loop=t>=E.loop0, tt=loop?0:t;
  if (tt<E.rw0) st.n=N;
  else if (t<E.n0) st.n=mix(N,9,eio(lin(t,E.rw0,E.n0)));
  else if (t<E.falls) st.n=mix(9,A0,lin(t,E.n0,E.falls));
  else if (t<E.yet) st.n=mix(A0,A1-3,lin(t,E.falls,E.yet));
  else if (t<E.lifted) st.n=mix(A1-3,A1+0.6,lin(t,E.yet,E.lifted));
  else st.n=mix(A1+0.6,N,eio(lin(t,E.lifted,E.l5E+0.8)));
  st.hook = tt<E.rw0 ? 1 : 0;
  const hk=st.hook*(1-seg(t,E.rw0-0.1,E.rw0+0.15));
  st.cvdFocus = loop?0 : seg(t,E.cvd-0.1,E.cvd+0.3)*(1-seg(t,E.falls-0.2,E.falls+0.3));
  st.formula = loop?0 : seg(t,E.buys-0.1,E.buys+0.3)*(1-seg(t,E.l2E,E.l2E+0.4));
  st.cvdL  = loop?0 : Math.max(hk, t>=E.rw0?seg(t,E.falls-0.1,E.falls+0.5):0);
  st.flatL = loop?0 : Math.max(hk, t>=E.rw0?seg(t,E.yet-0.1,E.yet+0.5):0);
  st.lvl   = loop?0 : Math.max(hk, t>=E.rw0?seg(t,E.level1-0.2,E.level1+0.3):0);
  st.bids  = loop?0 : seg(t,E.passive-0.2,E.passive+0.5)*(1-0.75*seg(t,E.pull-0.1,E.pull+0.5));
  st.zone  = loop?0 : Math.max(hk, t>=E.rw0?seg(t,E.absorption-0.1,E.absorption+0.3):0);
  st.cta = loop?0 : seg(t,E.logo0-0.6,E.logo0);
  return st;
}

// ---------- drawings ----------
function panel(y0,y1,a=1){ const g=VW.g; g.save(); g.globalAlpha=a; g.fillStyle='rgba(10,16,30,0.55)'; VW.roundRect(L.x0-18,y0-20,AX+118-(L.x0-18),y1-y0+40,16); g.fill();
  g.strokeStyle='rgba(120,150,210,0.14)'; g.lineWidth=1.2; g.stroke(); g.restore(); }
function axis(a,yTag){ const g=VW.g; g.save(); g.globalAlpha=0.85*a; g.font='600 27px VWMono'; g.fillStyle=COL.ink2; g.textAlign='left'; g.textBaseline='middle';
  for (let p=Math.ceil(PR.pMin/5)*5; p<=PR.pMax; p+=5){ const y=PY(p); if (y<L.y0+14||y>L.y1-14||Math.abs(y-yTag)<46) continue; g.fillText(f2(p),AX,y);
    g.strokeStyle='rgba(120,150,210,0.07)'; g.lineWidth=1; g.beginPath(); g.moveTo(L.x0,y); g.lineTo(L.x1,y); g.stroke(); } g.restore(); }
function drawCandle(i,k,a){ if (k<=0||a<=0) return; const g=VW.g, b=BARS[i], x=X(i), kk=VW.eoe(k), cl=mix(b.o,b.c,kk), hi=mix(Math.max(b.o,cl),b.h,kk), lo=mix(Math.min(b.o,cl),b.l,kk);
  g.globalAlpha=a*Math.min(1,k*2.5); const col=cl>=b.o?COL.up:COL.dn; g.strokeStyle=col; g.lineWidth=2.2; g.beginPath(); g.moveTo(x,PY(hi)); g.lineTo(x,PY(lo)); g.stroke();
  const y1=PY(Math.max(b.o,cl)), y2=PY(Math.min(b.o,cl)); g.fillStyle=col; g.fillRect(x-C.bw*0.34,y1,C.bw*0.68,Math.max(2,y2-y1)); g.globalAlpha=1; }
function candles(n,a){ for (let i=0;i<Math.ceil(n)&&i<N;i++) drawCandle(i,clamp(n-i,0,1),a); }
function cvdPane(n,a){ const g=VW.g, c=L.cvd; g.save(); g.globalAlpha=a;
  const pts=[]; for (let i=0;i<Math.ceil(n)&&i<N;i++){ const k=clamp(n-i,0,1), prev=i?BARS[i-1].cvd:0; pts.push([mix(X(i)-C.bw*0.5,X(i)+C.bw*0.5,k),CY(mix(prev,BARS[i].cvd,k))]); }
  if (pts.length>1){ const gr=g.createLinearGradient(0,c.y0,0,c.y1); gr.addColorStop(0,VW.rgba(CYAN,0.28)); gr.addColorStop(1,VW.rgba(CYAN,0));
    g.beginPath(); g.moveTo(pts[0][0],c.y1); pts.forEach(p=>g.lineTo(p[0],p[1])); g.lineTo(pts[pts.length-1][0],c.y1); g.closePath(); g.fillStyle=gr; g.fill();
    g.beginPath(); pts.forEach((p,j)=>j?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1])); g.strokeStyle=CYAN; g.lineWidth=3; g.shadowColor=VW.rgba(CYAN,0.6); g.shadowBlur=8; g.stroke(); }
  g.shadowBlur=0; g.font='700 26px VWMono'; g.letterSpacing='2px'; g.fillStyle=COL.ink2; g.textAlign='left'; g.textBaseline='top'; g.fillText('CVD',L.x0+6,c.y0-6); g.restore(); }
// the absorption window: one vertical band through both panes
function zone(a){ if (a<=0) return; const g=VW.g, x0=X(A0)-C.bw*0.5, x1=X(A1)+C.bw*0.5; g.save(); g.globalAlpha=a;
  const gr=g.createLinearGradient(0,L.y0,0,L.cvd.y1); gr.addColorStop(0,VW.rgba(GOLD,0.0)); gr.addColorStop(0.35,VW.rgba(GOLD,0.10)); gr.addColorStop(1,VW.rgba(GOLD,0.10));
  g.fillStyle=gr; g.fillRect(x0,L.y0-10,x1-x0,L.cvd.y1-L.y0+20);
  g.strokeStyle=VW.rgba(GOLD,0.45); g.lineWidth=1.5; g.setLineDash([6,8]); g.beginPath(); g.moveTo(x0,L.y0-10); g.lineTo(x0,L.cvd.y1+10); g.moveTo(x1,L.y0-10); g.lineTo(x1,L.cvd.y1+10); g.stroke(); g.setLineDash([]);
  g.font='700 26px VWMono'; g.letterSpacing='3px'; g.fillStyle=GOLD; g.textAlign='center'; g.textBaseline='bottom'; g.fillText('ABSORPTION',(x0+x1)/2,L.y1-8); g.restore(); }
function segLine(x0,y0,x1,y1,k,col,label,lx,ly,align){ if (k<=0) return; const g=VW.g, xe=mix(x0,x1,eo(k)), ye=mix(y0,y1,eo(k));
  g.save(); g.strokeStyle=col; g.lineWidth=5; g.shadowColor=VW.rgba(col,0.85); g.shadowBlur=16; g.lineCap='round';
  g.beginPath(); g.moveTo(x0,y0); g.lineTo(xe,ye); g.stroke(); g.shadowBlur=0;
  const la=clamp((k-0.55)*3,0,1); if (la>0){ g.globalAlpha=la; g.font='700 32px VWMono'; g.letterSpacing='2px'; g.fillStyle=col; g.textAlign=align; g.textBaseline='middle'; g.shadowColor='rgba(0,0,0,0.95)'; g.shadowBlur=14; g.fillText(label,lx,ly); }
  g.restore(); }
function priceTag(p,a){ if (a<=0) return; const g=VW.g, y=clamp(PY(p),L.y0+24,L.y1-24); g.save(); g.globalAlpha=a;
  g.setLineDash([6,8]); g.strokeStyle=VW.rgba(GOLD,0.45); g.lineWidth=1.5; g.beginPath(); g.moveTo(L.x0,y); g.lineTo(AX-8,y); g.stroke(); g.setLineDash([]);
  g.fillStyle=GOLD; VW.roundRect(AX-10,y-26,132,52,9); g.fill(); g.fillStyle='#120E02'; g.font='700 26px VWMono'; g.textAlign='center'; g.textBaseline='middle'; g.fillText(f2(p),AX+56,y+1); g.restore(); }
function trade(n,a){ if (a<=0||n<EB+0.5) return; const g=VW.g, x0=X(EB)-C.bw*0.5, x1=X(Math.min(N-1,n-0.001))+C.bw*0.5, p=C.lastPrice(n), col=p>=ENTRY?GREEN:RED;
  g.save(); g.globalAlpha=a*clamp((n-EB-0.5)*4,0,1);
  g.fillStyle=VW.rgba(RED,0.10); g.fillRect(x0,PY(ENTRY),x1-x0,PY(STOP)-PY(ENTRY));
  g.fillStyle=VW.rgba(col,0.16); g.fillRect(x0,Math.min(PY(ENTRY),PY(p)),x1-x0,Math.abs(PY(p)-PY(ENTRY)));
  g.strokeStyle=GOLD; g.lineWidth=2; g.setLineDash([8,6]); g.beginPath(); g.moveTo(x0,PY(ENTRY)); g.lineTo(x1,PY(ENTRY)); g.stroke(); g.setLineDash([]);
  g.strokeStyle=VW.rgba(RED,0.9); g.beginPath(); g.moveTo(x0,PY(STOP)); g.lineTo(x1,PY(STOP)); g.stroke(); g.restore(); }
function pnlHero(n,a){ if (a<=0||n<EB+0.5) return; const g=VW.g, p=q(C.lastPrice(n)), usd=pnl(p), col=usd>0.004?GREEN:(usd<-0.004?RED:COL.ink);
  const x=(X(9)+X(40))/2+6, y=PY(7716.4); g.save(); g.globalAlpha=a*clamp((n-EB-0.5)*4,0,1); g.textAlign='center'; g.textBaseline='alphabetic';
  g.fillStyle='rgba(6,10,20,0.86)'; VW.roundRect(x-250,y-120,500,206,14); g.fill();
  g.font='700 25px VWMono'; g.letterSpacing='1px'; g.fillStyle=COL.ink2; g.fillText('LONG 1 ES @ '+f2(ENTRY),x,y-82); g.letterSpacing='0px';
  g.font='700 80px VWMono'; g.fillStyle=col; g.shadowColor=VW.rgba(col,0.55); g.shadowBlur=18; g.fillText(Math.abs(usd)<0.004?'$0.00':fmt(usd),x,y); g.shadowBlur=0;
  g.font='600 25px VWMono'; g.fillStyle=VW.rgba(RED,0.95); g.fillText('STOP '+f2(STOP)+' · RISK '+fmt(pnl(STOP)),x,y+36);
  g.fillStyle=COL.ink2; g.fillText('HYPOTHETICAL · NOT A SIGNAL',x,y+68); g.restore(); }

function levelLine(a){ if (a<=0) return; const g=VW.g, y=PY(LVL); g.save(); g.globalAlpha=a; g.strokeStyle=GOLD; g.lineWidth=2.5; g.setLineDash([12,8]); g.shadowColor=GOLD; g.shadowBlur=12;
  g.beginPath(); g.moveTo(L.x0,y); g.lineTo(L.x1,y); g.stroke(); g.setLineDash([]); g.shadowBlur=0;
  g.font='700 25px VWMono'; g.letterSpacing='2px'; g.fillStyle=GOLD; g.textAlign='left'; g.textBaseline='top'; g.fillText('LEVEL '+f2(LVL),L.x0+8,y+10); g.restore(); }
// resting buy limits at the level (illustration of the passive side): horizontal depth bars from the right edge
const BIDS=[[7700.25,1.0],[7700.75,0.78],[7701.25,0.62],[7701.75,0.45],[7702.25,0.30]];
function passiveBids(a){ if (a<=0) return; const g=VW.g, xr=L.x1-6, wmax=300, h=Math.abs(PY(7700.25)-PY(7700.75))*0.8; g.save();
  BIDS.forEach(([p,k],j)=>{ const kk=clamp(a*1.6-j*0.12,0,1); if (kk<=0) return; const w=wmax*k*eo(kk), y=PY(p);
    g.globalAlpha=a*0.9; g.fillStyle=VW.rgba(CYAN,0.75); g.fillRect(xr-w,y-h/2,w,h); });
  g.globalAlpha=a; g.font='700 25px VWMono'; g.letterSpacing='2px'; g.fillStyle=CYAN; g.textAlign='right'; g.textBaseline='bottom'; g.shadowColor='rgba(0,0,0,0.9)'; g.shadowBlur=10;
  g.fillText('PASSIVE BIDS',xr,PY(7702.6)-8); g.restore(); }
function formula(a){ if (a<=0) return; const g=VW.g, c=L.cvd; g.save(); g.globalAlpha=a; g.font='700 26px VWMono'; g.letterSpacing='1px'; g.textAlign='right'; g.textBaseline='top';
  g.fillStyle=COL.ink; g.shadowColor='rgba(0,0,0,0.9)'; g.shadowBlur=10; g.textBaseline='bottom'; g.fillText('CVD = ASK VOL − BID VOL, CUMULATIVE',L.x1-6,c.y1+2); g.restore(); }
function focusGlow(a){ if (a<=0) return; const g=VW.g, c=L.cvd; g.save(); g.globalAlpha=a; g.strokeStyle=VW.rgba(CYAN,0.8); g.lineWidth=2.5; g.shadowColor=CYAN; g.shadowBlur=18;
  VW.roundRect(L.x0-18,c.y0-20,AX+118-(L.x0-18),c.y1-c.y0+40,16); g.stroke(); g.restore(); }

// ---------- render ----------
function render(t){
  const g=VW.g; g.setTransform(1,0,0,1,0,0); g.globalAlpha=1; g.filter='none';
  VW.background(t);
  const st=state(t), tt=t>=E.loop0?0:t, n=st.n, p=q(C.lastPrice(Math.max(1,n)));
  const push=1+0.035*lin(tt,0,E.logo0), fx=(L.x0+L.x1)/2, fy=(L.y0+L.cvd.y1)/2;
  g.save(); g.translate(fx,fy); g.scale(push,push); g.translate(-fx,-fy);
  const dim=1-0.85*st.cta;
  panel(L.y0,L.y1,dim*(1-0.35*st.cvdFocus)); panel(L.cvd.y0,L.cvd.y1,dim); axis(dim,PY(p)); focusGlow(st.cvdFocus*dim);
  zone(st.zone*dim);
  levelLine(st.lvl*dim);
  passiveBids(st.bids*dim);
  candles(n,dim*(1-0.45*st.cvdFocus)); cvdPane(n,dim);
  const xa=X(A0), ie=Math.round(clamp(n-1,A0+1,A1)), xb=X(ie), xz=X(A1);
  segLine(xa,PY(7704.6),xb,PY(7704.6),st.flatL*dim,WHITE,'PRICE: FLAT',(xa+xz)/2,PY(7706.3),'center');
  segLine(xa,CY(BARS[A0].cvd)-10,xb,CY(BARS[ie].cvd)-10,st.cvdL*dim,RED,'DELTA: FALLING',xz+70,L.cvd.y0+34,'right');
  formula(st.formula*dim);
  priceTag(p,dim);
  g.restore();
  VW.vignette(); VW.topBand(380);
  const endK=seg(t,E.logo0,E.logo0+0.5)*(1-seg(t,E.loop0,E.total-0.15));
  VW.logoTL(1-endK,'ES',52,30,true);
  const hOut=1-seg(tt,E.hookE-0.05,E.hookE+0.25);
  { const a1=eo(lin(tt,-0.3,0))*hOut, a2=eo(lin(tt,E.priceH-0.05,E.priceH+0.15))*hOut; g.save(); g.textAlign='center'; g.textBaseline='middle'; g.shadowColor='rgba(0,0,0,0.95)'; g.shadowBlur=30;
    g.font='700 58px VWSans'; if (a1>0){ g.globalAlpha=a1; g.fillStyle=RED; g.fillText('HEAVY SELLING.',SAFE.cx,440); }
    if (a2>0){ g.globalAlpha=a2; g.fillStyle=WHITE; g.fillText("PRICE DIDN'T MOVE.",SAFE.cx,502); } g.restore(); }
  VW.captions(t,GROUPS,{y:490,size:66,keySize:76,keys:new Map([['CVD',CYAN],['aggressive',CYAN],['hard.',RED],['bid,',RED],['level.',GOLD],['passive',CYAN],['absorption.',GOLD],['lifted',GREEN],['breaks.',RED]]),until:E.logo0-0.2});
  if (t>E.logo0){ const y=PY(LVL), pts=[]; for (let i=0;i<N;i++) pts.push([mix(L.x0,L.x1,i/(N-1)),y]);
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
  GROUPS=VW.buildGroups(WORDS.filter(w=>w[1]>W('move.',1,'e')+0.2),3,16);
  buildTimeline(); await VW.loadFonts(); await VW.loadBrand(); render(0);
  return {...window.DATA_CHECK, total:S.total, events:E};
})();
