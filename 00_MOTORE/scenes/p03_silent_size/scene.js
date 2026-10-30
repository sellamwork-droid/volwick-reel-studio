// ============================================================
// Scene P03 · UNDER THE SURFACE · "The candle was flat. The size wasn't."
// SPY 1m: forty flat minutes on the chart while large off-exchange blocks print at one price.
// The chart blends them into volume; Volwick places each print where it traded.
// Price returns to the print level. Not a signal: it can still break.
// Standard: P02 v9 direction, v10 safe zone, $ P&L (100 shares) incl. loss, logo from the level line.
// All data SIMULATED.
// ============================================================
const S = {};
const {COL, SAFE, seg, lin, eo, eio, mix, clamp} = VW;
const GOLD = '#F2C14E', RED = '#E2575F';

// ---------- simulated SPY session (tick 0.01) ----------
const N=64, LVL=761.95, SH=100;
const R=VW.rng(30311), gs=()=>{ let u=0,v=0; while(!u)u=R(); while(!v)v=R(); return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); };
const r2=x=>Math.round(x*100)/100;
function target(i){
  if (i<40) return 762.15+0.16*Math.sin(i*0.9)+0.06*Math.sin(i*2.3);               // forty quiet minutes
  if (i<50) return 762.15+1.05*eo((i-39)/10);                                     // drifts away
  if (i<56) return mix(763.20, LVL+0.02, eio((i-49)/6));                          // comes back to the print level
  return LVL+1.65*eo((i-55)/8);                                                   // reacts from it
}
const BARS=[]; { let c=762.10;
  for (let i=0;i<N;i++){ const o=c; let cl=r2(target(i)+gs()*0.03); if (i===55) cl=r2(LVL+0.04);
    const h=r2(Math.max(o,cl)+Math.abs(gs())*0.05+0.01); let l=r2(Math.min(o,cl)-Math.abs(gs())*0.05-0.01);
    if (i===55) l=r2(LVL-0.05); if (i<40) l=Math.max(l, LVL-0.04);
    BARS.push({o,h,l,c:cl,v:Math.round(52000+R()*38000)}); c=cl; } }
// off-exchange blocks, all at the level (shares)
const PRINTS=[[6,412000],[10,186000],[14,640000],[18,233000],[23,318000],[27,575000],[31,204000],[36,489000]].map(([i,q])=>({i,q,p:LVL}));
PRINTS.forEach(pr=>{ BARS[pr.i].v+=Math.round(pr.q*0.12); });   // in the consolidated volume, blended in
const TOTAL_SH=PRINTS.reduce((a,b)=>a+b.q,0);
window.DATA_CHECK={ flatRange:[Math.min(...BARS.slice(0,40).map(b=>b.l)), Math.max(...BARS.slice(0,40).map(b=>b.h))], touchLow:BARS[55].l, end:BARS[N-1].c, prints:PRINTS.length, shares:TOTAL_SH };

// ---------- layouts (v10 safe zone) ----------
const PR={pMin:761.25, pMax:763.85};
const R_A2={x0:124,x1:806,y0:478,y1:842,...PR}, R_B2={x0:124,x1:806,y0:938,y1:1302,...PR};
const R_1={x0:124,x1:806,y0:452,y1:1302,...PR}, R_UP={x0:124,x1:806,y0:-560,y1:-90,...PR};
const LA={cvd:{y0:0,y1:0},...R_A2}, LB={cvd:{y0:0,y1:0},...R_B2};
const cA=new VW.Chart(BARS,LA), cB=new VW.Chart(BARS,LB);
const mixR=(a,b,k)=>({x0:mix(a.x0,b.x0,k),x1:mix(a.x1,b.x1,k),y0:mix(a.y0,b.y0,k),y1:mix(a.y1,b.y1,k),pMin:a.pMin,pMax:a.pMax});
function setRect(c,r){ Object.assign(c.L,r); c.bw=(r.x1-r.x0)/c.N; }

let WORDS=[], GROUPS=[];
function W(word,nth=1,edge='s'){ let c=0; for (const w of WORDS){ if (w[0].replace(/[^\w']/g,'').toLowerCase()===word.replace(/[^\w']/g,'').toLowerCase()){ if (++c===nth) return edge==='s'?w[1]:w[2]; } } throw new Error('word not found: '+word+' #'+nth); }
let E={};
function buildTimeline(){
  E.size=W('size'); E.sizeE=W("wasn't",1,'e'); E.forty=W('For'); E.but=W('But'); E.large=W('large'); E.priceW=W('price.',1,'e');
  E.they=W('They'); E.your=W('Your'); E.volume=W('volume.',1,'e'); E.vput=W('Volwick'); E.traded=W('traded.',1,'e');
  E.so=W('So'); E.back=W('back,',1,'e'); E.you=W('you'); E.history=W('history.',1,'e');
  E.not=W('Not'); E.brk=W('break.',1,'e'); E.chart2=W('chart',2)-0.15; E.vw2=W('Volwick',2); E.end=WORDS[WORDS.length-1][2];
  // bar reveal schedule
  E.touch = E.back-0.15;                 // price reaches the print level on "back"
  E.logo0=E.end+0.3; E.beat=E.logo0+1.0; E.sw=E.logo0+1.62; E.dv=E.logo0+3.8; E.loop0=E.logo0+5.6; E.total=E.loop0+0.5;
  Object.assign(E,{softBoom:1, hookBuyers:E.size+0.12, rw0:E.your, div:E.not, cvdWord:E.forty, b0:E.large, b1:E.priceW,
    flow:E.vput+0.3, volwick:E.vw2, holdHit:E.touch+0.05, swap:E.so-0.2});
  S.total=E.total;
}

// ---------- state ----------
function state(t){
  const st={}; const loop=t>=E.loop0, tt=loop?0:t;
  // bars
  if (tt<E.forty) st.n=mix(26,30,lin(tt,0,E.forty));
  else if (t<E.so) st.n=mix(30,40,eo(lin(t,E.forty,E.but)));
  else if (t<E.you) st.n=mix(40,56,eio(lin(t,E.so,E.back+0.1)));
  else st.n=mix(56,N,eo(lin(t,E.you,E.history+0.3)));
  // layout: dual (your chart vs with prints) > single prints chart
  const k=loop?0:seg(t,E.forty-0.1,E.forty+0.5);
  st.ra=mixR(R_A2,R_UP,k); st.rb=mixR(R_B2,R_1,k); st.aA=1-k; st.single=k>=1;
  // prints: hook pops on "size"; in the explanation they re-print one by one
  st.hookPrints = tt<E.forty ? eo(lin(tt,E.size+0.05,E.size+0.35)) : 0;
  st.seqP = loop?0 : lin(t,E.large-0.1,E.priceW);     // 0..1 across the 8 prints
  st.toVol = loop?0 : eio(lin(t,E.your+0.2,E.volume))*(1-eio(lin(t,E.vput,E.traded)));   // dots sink into volume, then return
  st.lvl = loop?0 : seg(t,E.priceW-0.4,E.priceW+0.2)*(1-0.85*st.toVol);
  st.push = st.single ? 1+0.05*lin(t,E.forty+0.5,E.end) : 1+0.02*lin(tt,0,E.forty);
  st.alt = loop?0 : seg(t,E.not-0.1,E.not+0.5)*(1-seg(t,E.chart2-0.3,E.chart2+0.1));
  st.cta = loop?0 : seg(t,E.chart2-0.2,E.chart2+0.35);
  return st;
}

// ---------- drawings ----------
function panelFrame(L,a){ const g=VW.g; g.save(); g.globalAlpha=a; g.fillStyle='rgba(10,16,30,0.55)'; VW.roundRect(L.x0-24,L.y0-28,L.x1-L.x0+150,L.y1-L.y0+56,18); g.fill();
  g.strokeStyle='rgba(120,150,210,0.14)'; g.lineWidth=1.2; g.stroke(); g.restore(); }
function panelLabel(L,txt,col,a){ if (a<=0) return; const g=VW.g; g.save(); g.globalAlpha=a; g.font='700 24px VWMono'; g.letterSpacing='2px'; g.fillStyle=col; g.textAlign='left'; g.textBaseline='top'; g.fillText(txt,L.x0-6,L.y0-16); g.restore(); }
function bubble(c, pr, k, toVol, label){ if (k<=0) return; const g=VW.g, L=c.L, x=c.X(pr.i), yL=c.PY(pr.p);
  const vh=BARS[pr.i].v/180000*(L.y1-L.y0>600?120:70), yV=L.y1-vh;           // top of its volume bar
  const y=mix(yL,yV,toVol), r=(5+Math.sqrt(pr.q/1000)*0.72)*(0.6+0.4*eo(k))*(1-0.55*toVol);
  g.save(); g.globalAlpha=Math.min(1,k*1.3);
  g.shadowColor=VW.rgba(GOLD,0.8); g.shadowBlur=18*(1-toVol); g.fillStyle=VW.rgba(GOLD,0.85); g.beginPath(); g.arc(x,y,r,0,7); g.fill(); g.shadowBlur=0;
  const ring=clamp((k-0.2)*1.5,0,1); if (ring<1){ g.strokeStyle=VW.rgba(GOLD,0.6*(1-ring)); g.lineWidth=2; g.beginPath(); g.arc(x,y,r+ring*30,0,7); g.stroke(); }
  if (label && pr.q>=480000 && toVol<0.3){ g.globalAlpha=Math.min(1,k*1.3)*(1-toVol/0.3); g.font='700 22px VWMono'; g.fillStyle=GOLD; g.textAlign='center'; g.textBaseline='bottom'; g.fillText(Math.round(pr.q/1000)+'K', x, y-r-6); }
  g.restore(); }
function levelLine(c,a){ if (a<=0) return; const g=VW.g, L=c.L, y=c.PY(LVL); g.save(); g.globalAlpha=a;
  g.strokeStyle=GOLD; g.lineWidth=3; g.setLineDash([12,8]); g.shadowColor=GOLD; g.shadowBlur=14; g.beginPath(); g.moveTo(L.x0-20,y); g.lineTo(L.x1+8,y); g.stroke(); g.setLineDash([]); g.shadowBlur=0;
  g.font='700 28px VWMono'; g.fillStyle=GOLD; g.textAlign='right'; g.textBaseline='top'; g.fillText('PRINT LEVEL · '+LVL.toFixed(2), L.x1-4, y+14); g.restore(); }
function pnl(c,n,a){ const iT=55; if (n<=iT+0.3||a<=0) return; const g=VW.g, L=c.L, d=Math.round((c.lastPrice(n)-LVL)*100)/100, usd=d*SH, col=d>=0?COL.up:RED;
  const txt=(usd>=0?'+':'−')+'$'+Math.abs(usd).toFixed(2); const big=(L.y1-L.y0)>600;
  g.save(); g.globalAlpha=a*clamp((n-iT-0.3)*2,0,1); g.textAlign='left'; g.textBaseline='alphabetic';
  g.font=`700 ${big?58:44}px VWMono`; g.fillStyle=col; g.shadowColor=VW.rgba(col,0.6); g.shadowBlur=18; const y=L.y1-(big?130:82); g.fillText(txt,L.x0,y);
  const w=g.measureText(txt).width; g.shadowBlur=0; g.font='600 26px VWMono'; g.fillStyle=VW.rgba(col,0.85); g.fillText((d>=0?'+':'−')+Math.abs(d).toFixed(2)+' · 100 SH', L.x0+w+20, y-4); g.restore(); }
function altPath(c,k){ if (k<=0) return; const g=VW.g, x0=c.X(55), y0=c.PY(LVL), x1=c.X(N-1);
  g.save(); g.globalAlpha=0.9*k; g.setLineDash([12,10]); g.strokeStyle=RED; g.lineWidth=4; g.beginPath(); g.moveTo(x0,y0);
  g.bezierCurveTo(x0+70,y0, x0+120,c.PY(LVL-0.4), mix(x0,x1,k), c.PY(LVL-0.62*k)); g.stroke(); g.setLineDash([]);
  if (k>0.6){ g.globalAlpha=clamp((k-0.6)*3,0,1); g.font='700 40px VWMono'; g.fillStyle=RED; g.textAlign='right'; g.textBaseline='top'; g.fillText('−$62.00', x1, c.PY(LVL-0.62)+10); }
  g.restore(); }
function centerText(txt,y,size,col,a,font='VWSans',weight=700){ if (a<=0) return; const g=VW.g; g.save(); g.globalAlpha=a; g.textAlign='center'; g.textBaseline='middle';
  g.font=`${weight} ${size}px ${font}`; g.fillStyle=col; g.shadowColor='rgba(0,0,0,0.95)'; g.shadowBlur=30; g.fillText(txt,SAFE.cx,y); g.restore(); }
function emerge(txt,c,col,k,below=false){ if (k<=0) return; const g=VW.g, L=c.L, y=c.PY(LVL), h=66;
  g.save(); g.beginPath(); if (below) g.rect(0,y+4,VW.W,h+20); else g.rect(0,y-h-20,VW.W,h+20); g.clip(); g.globalAlpha=Math.min(1,k*1.4);
  g.textAlign='center'; g.font='700 44px VWSans'; g.fillStyle=col; g.shadowColor='rgba(0,0,0,0.9)'; g.shadowBlur=24;
  if (below){ g.textBaseline='top'; g.fillText(txt,(L.x0+L.x1+122)/2, y+14-(1-eo(k))*h); } else { g.textBaseline='bottom'; g.fillText(txt,(L.x0+L.x1+122)/2, y-14+(1-eo(k))*h); }
  g.restore(); }

// ---------- render ----------
function render(t){
  const g=VW.g; g.setTransform(1,0,0,1,0,0); g.globalAlpha=1; g.filter='none';
  VW.background(t);
  const st=state(t), tt=t>=E.loop0?0:t;
  setRect(cA,st.ra); setRect(cB,st.rb);
  const fx=(cB.L.x0+cB.L.x1)/2, fy=st.single?cB.PY(LVL):900;
  g.save(); g.translate(fx,fy); g.scale(st.push,st.push); g.translate(-fx,-fy);
  const candleA=1-0.72*st.cta;
  // top: your chart (no prints)
  if (st.aA>0.01){ g.save(); g.globalAlpha=st.aA; panelFrame(cA.L,1); cA.grid(); cA.axis(1,1); cA.volume(st.n,180000,70); cA.candles(st.n); cA.priceTag(st.n);
    panelLabel(cA.L,'YOUR CHART',COL.ink3,1); g.restore(); }
  // bottom / protagonist: same candles + off-exchange prints
  g.save(); panelFrame(cB.L,1); cB.grid(); cB.axis(1,1);
  g.globalAlpha=candleA; cB.volume(st.n,180000,st.single?120:70); cB.candles(st.n); g.globalAlpha=1;
  levelLine(cB, st.lvl*(st.cta>0?1:1));
  if (!st.single){ PRINTS.forEach(pr=>{ if (pr.i<st.n) bubble(cB,pr,st.hookPrints,0,false); }); panelLabel(cB.L,'WITH OFF-EXCHANGE PRINTS',GOLD,1); }
  else { PRINTS.forEach((pr,j)=>{ const k=clamp(st.seqP*PRINTS.length-j,0,1); bubble(cB,pr,k*(1-0.6*st.cta),st.toVol,true); }); }
  g.globalAlpha=candleA; cB.priceTag(st.n); g.globalAlpha=1; pnl(cB,st.n,candleA);
  altPath(cB,st.alt);
  if (t<E.loop0){ emerge('THE CHART SHOWS THE CANDLES.',cB,COL.ink,seg(t,E.chart2-0.05,E.chart2+0.45));
    emerge('VOLWICK SHOWS THE PRINTS.',cB,GOLD,seg(t,E.vw2-0.05,E.vw2+0.45),true); }
  g.restore(); g.restore();
  // headlines (one idea at a time)
  const H=(a,b,c1,c2,t0,t1)=>{ const k=seg(t,t0-0.2,t0+0.2)*(1-seg(t,t1-0.25,t1)); centerText(a,352,40,c1,k); centerText(b,402,40,c2,k); };
  if (t<E.loop0){
    H('OFF-EXCHANGE BLOCKS','PRINTING AT ONE PRICE',COL.ink,GOLD,E.but,E.they);
    H('REPORTED TO THE PUBLIC TAPE','WITHIN SECONDS',COL.ink,GOLD,E.they,E.your);
    H('YOUR CHART','BLENDS THEM INTO VOLUME',COL.ink,COL.ink2,E.your,E.vput);
    H('VOLWICK','PUTS EACH PRINT WHERE IT TRADED',COL.ink,COL.blue,E.vput,E.so);
    H('PRICE CAME BACK','TO THE PRINT LEVEL',COL.ink,GOLD,E.so,E.not);
    H('NOT A SIGNAL.','IT CAN STILL BREAK.',COL.ink,RED,E.not,E.chart2); }
  VW.vignette(); VW.topBand(330);
  const endK=seg(t,E.logo0,E.logo0+0.5)*(1-seg(t,E.loop0,E.total-0.15));
  VW.logoTL(1-endK,'SPY',52,30,true);
  // hook
  const hOut=1-seg(tt,E.forty-0.2,E.forty+0.1);
  centerText('THE CANDLE WAS FLAT.',362,52,COL.ink,eo(lin(tt,-0.3,0))*hOut);
  centerText("THE SIZE WASN'T.",424,52,GOLD,eo(lin(tt,E.size-0.02,E.size+0.15))*hOut);
  VW.captions(t,GROUPS,{y:1408,size:60,keySize:70,keys:new Map([['blocks',GOLD],['printing',GOLD],['public',COL.ink],['volume.',COL.ink2],['Volwick',COL.blue],['traded.',GOLD],['history.',GOLD],['break.',RED]]),until:E.chart2-0.15});
  if (t>E.logo0){ const y=cB.PY(LVL), pts=[]; for (let i=0;i<N;i++) pts.push([mix(cB.L.x0,cB.L.x1,i/(N-1)),y]);
    VW.logoForm((t-E.logo0)*1.45, pts, {fadeOut:seg(t,E.loop0,E.total-0.15), noUrl:true});
    const out=1-seg(t,E.loop0,E.total-0.15), k=eo(lin(t,E.dv-0.05,E.dv+0.3))*out;
    if (k>0){ g.save(); g.globalAlpha=k; g.textAlign='center'; g.textBaseline='middle'; g.font='700 36px VWMono'; g.letterSpacing='5px';
      g.fillStyle=COL.blue; g.shadowColor='rgba(90,140,255,0.8)'; g.shadowBlur=18; g.fillText('DISCOVER VOLWICK →',543,1360+(1-k)*10); g.restore(); }
    const kd=eo(lin(t,E.dv+0.3,E.dv+0.7))*out;
    if (kd>0){ g.save(); g.globalAlpha=kd; g.textAlign='center'; g.textBaseline='middle'; g.font='500 21px VWMono'; g.letterSpacing='2px'; g.fillStyle=COL.ink3; g.fillText('Hypothetical results. Not investment advice.',540,1418); g.restore(); } }
  VW.guides();
}
window.render=render;
window.READY=(async()=>{
  const q=new URLSearchParams(location.search);
  WORDS=await (await fetch(q.get('words')||'words.json')).json();
  GROUPS=VW.buildGroups(WORDS.filter(w=>w[1]>W("wasn't",1,'e')+0.2));
  buildTimeline(); await VW.loadFonts(); await VW.loadBrand(); render(0);
  return {...window.DATA_CHECK, total:S.total, events:E};
})();
