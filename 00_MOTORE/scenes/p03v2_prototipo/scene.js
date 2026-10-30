// ============================================================
// Scene P03 v2 · UNDER THE SURFACE · "One price. Two outcomes."
// Cinematic prototype: flash-forward hook with both $ outcomes, rewind, forty flat minutes,
// off-exchange prints at one price, blended into volume vs placed where they traded,
// return to the level in slow motion, "HELD" on the bounce, P&L as hero (counter + sign flip). Minimal text: one text per moment,
// limit (it could have broken), CTA rising from the level, logo from the level line.
// v10 safe zone. All data SIMULATED (100 SPY shares, no commissions or slippage).
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
const PRINTS=[[6,412000],[10,186000],[14,640000],[18,233000],[23,318000],[27,575000],[31,204000],[36,489000]].map(([i,q])=>({i,q,p:LVL}));
PRINTS.forEach(pr=>{ BARS[pr.i].v+=Math.round(pr.q*0.12); });
const BIG={i:TOUCH,q:2400000,p:LVL};                  // the large block printed on the retest
BARS[TOUCH].v=Math.round(BARS[TOUCH].v*2.1); for (let i=TOUCH+1;i<N;i++) BARS[i].v=Math.round(BARS[i].v*1.75);   // participation picks up after it
const ALT=-0.62;                                       // the other outcome: a break of the level
window.DATA_CHECK={ touchLow:BARS[TOUCH].l, end:BARS[N-1].c, pnlEnd:r2((BARS[N-1].c-LVL)*SH), pnlLow:r2((BARS[TOUCH].l-LVL)*SH), pnlAlt:r2(ALT*SH) };

// ---------- layout (v10 safe zone) ----------
const PR={pMin:760.95, pMax:763.85};
const R_1={x0:124,x1:806,y0:452,y1:1302,...PR};
const LB={cvd:{y0:0,y1:0},...R_1}; const cB=new VW.Chart(BARS,LB);
const VMAX=180000;

let WORDS=[], GROUPS=[], CUES={};
function W(word,nth=1,edge='s'){ let c=0; for (const w of WORDS){ if (w[0].replace(/[^\w']/g,'').toLowerCase()===word.replace(/[^\w']/g,'').toLowerCase()){ if (++c===nth) return edge==='s'?w[1]:w[2]; } } throw new Error('word not found: '+word+' #'+nth); }
let E={};
function buildTimeline(){
  E.one=W('One'); E.two=W('Two'); E.hookE=W('outcomes.',1,'e');
  E.forty=W('Forty'); E.flatE=W('flat.',1,'e'); E.but=W('But'); E.large=W('large'); E.priceW=W('price.',2,'e');
  E.your=W('Your'); E.volume=W('volume.',1,'e'); E.vput=W('Volwick'); E.traded=W('traded.',1,'e');
  E.then=W('Then'); E.levelE=W('level.',1,'e'); E.held=W('HELD.'); E.heldE=W('HELD.',1,'e');
  E.not=W('Not'); E.brokenE=W('broken.',1,'e'); E.chart2=W('chart',2); E.vw2=W('Volwick',2); E.ctaE=W('prints.',1,'e');
  E.rw0=E.hookE+0.15; E.rw1=E.forty-0.05;                       // rewind window
  E.logo0=CUES.logo0; E.beat=E.logo0+1.0; E.dv=CUES.dv; E.loop0=CUES.loop0; E.total=E.loop0+0.5;
  E.flip=E.held+0.03; E.big=E.levelE+(0.45-0.3)/0.32*(E.held-E.levelE);   // the moment price touches the level in slow motion                                           // P&L turns positive right after "HELD"
  Object.assign(E,{softBoom:1, hookBuyers:E.two, div:E.not, cvdWord:E.forty, b0:E.large, b1:E.priceW, flow:E.vput+0.3,
    volwick:E.vw2, holdHit:E.held+0.02, bigPrint:E.big, swap:E.then-0.2, riser0:E.levelE+0.05, riser1:E.held});
  S.total=E.total;
}

// ---------- state ----------
function state(t){
  const st={}; const loop=t>=E.loop0, tt=loop?0:t;
  // bars: flash-forward > rewind > forty quiet minutes > rise and return > slow-motion touch > bounce
  if (tt<E.rw0) st.n=N;
  else if (tt<E.rw1) st.n=mix(N,26,eio(lin(tt,E.rw0,E.rw1)));
  else if (t<E.then) st.n=mix(26,40,eo(lin(t,E.forty,E.but)));
  else if (t<E.levelE) st.n=mix(40,TOUCH+0.3,eio(lin(t,E.then,E.levelE)));
  else if (t<E.held) st.n=mix(TOUCH+0.3,TOUCH+0.62,lin(t,E.levelE,E.held));            // slow motion (editing only)
  else st.n=mix(TOUCH+0.62,N,eo(lin(t,E.held,E.held+1.3)));
  st.hook = loop?1:1-seg(t,E.rw0-0.1,E.rw0+0.25);                                    // flash-forward layer
  st.rewind = loop?0:seg(t,E.rw0,E.rw0+0.15)*(1-seg(t,E.rw1-0.15,E.rw1));
  st.seqP = (t<E.rw1 && !loop) ? 1 : (loop?1:lin(t,E.large-0.1,E.priceW));
  st.toVol = loop?0 : eio(lin(t,E.your+0.2,E.volume))*(1-eio(lin(t,E.vput,E.traded)));
  st.lvl = loop?1 : Math.max(st.hook, seg(t,E.priceW-0.4,E.priceW+0.2))*(1-0.85*st.toVol);
  st.slow = loop?0 : seg(t,E.levelE-0.1,E.levelE+0.3)*(1-seg(t,E.held+0.2,E.held+0.9));
  const prog = lin(tt,0,E.logo0);
  st.push = 1+0.035*prog+0.05*st.slow;
  st.alt = loop?0 : Math.max(seg(t,E.two-0.05,E.two+0.45)*(1-seg(t,E.rw0-0.1,E.rw0+0.15)), seg(t,E.not-0.1,E.not+0.5)*(1-seg(t,E.chart2-0.3,E.chart2+0.1)));
  st.cta = loop?0 : seg(t,E.chart2-0.25,E.chart2+0.35);
  return st;
}

// ---------- drawings ----------
function panelFrame(L){ const g=VW.g; g.save(); g.fillStyle='rgba(10,16,30,0.55)'; VW.roundRect(L.x0-24,L.y0-28,L.x1-L.x0+150,L.y1-L.y0+56,18); g.fill();
  g.strokeStyle='rgba(120,150,210,0.14)'; g.lineWidth=1.2; g.stroke(); g.restore(); }
function bubble(c,pr,k,toVol,label){ if (k<=0) return; const g=VW.g, L=c.L, x=c.X(pr.i), yL=c.PY(pr.p);
  const vh=BARS[pr.i].v/VMAX*120, yV=L.y1-vh, y=mix(yL,yV,toVol), r=(3+Math.sqrt(pr.q/1000)*0.36)*(0.6+0.4*eo(k))*(1-0.55*toVol);
  g.save(); g.globalAlpha=Math.min(1,k*1.3); g.shadowColor=VW.rgba(GOLD,0.8); g.shadowBlur=18*(1-toVol); g.fillStyle=VW.rgba(GOLD,0.85); g.beginPath(); g.arc(x,y,r,0,7); g.fill(); g.shadowBlur=0;
  const ring=clamp((k-0.2)*1.5,0,1); if (ring<1){ g.strokeStyle=VW.rgba(GOLD,0.6*(1-ring)); g.lineWidth=2; g.beginPath(); g.arc(x,y,r+ring*30,0,7); g.stroke(); }
  if (false){ g.globalAlpha=Math.min(1,k*1.3)*(1-toVol/0.3); g.font='700 22px VWMono'; g.fillStyle=GOLD; g.textAlign='center'; g.textBaseline='bottom'; g.fillText(Math.round(pr.q/1000)+'K',x,y-r-6); }
  g.restore(); }
function bigPrint(c,t,a){ if (a<=0) return; const g=VW.g, x=c.X(BIG.i), y=c.PY(BIG.p), k=E.big!==undefined? clamp((t-E.big)/0.35,0,1):1, kk=(t<E.rw0||t>=E.loop0)?1:k;
  if (kk<=0) return; const r=30*(0.55+0.45*eo(kk));
  g.save(); g.globalAlpha=a*Math.min(1,kk*2);
  const halo=g.createRadialGradient(x,y,0,x,y,r*3.2); halo.addColorStop(0,VW.rgba(GOLD,0.45)); halo.addColorStop(1,VW.rgba(GOLD,0)); g.fillStyle=halo; g.beginPath(); g.arc(x,y,r*3.2,0,7); g.fill();
  g.shadowColor=VW.rgba(GOLD,0.95); g.shadowBlur=36; g.fillStyle=GOLD; g.beginPath(); g.arc(x,y,r,0,7); g.fill(); g.shadowBlur=0;
  for (const d of [0,0.25]){ const ring=clamp((t-E.big-d)/0.9,0,1); if (t>=E.rw0 && t<E.loop0 && ring>0 && ring<1){ g.strokeStyle=VW.rgba(GOLD,0.7*(1-ring)); g.lineWidth=3; g.beginPath(); g.arc(x,y,r+ring*120,0,7); g.stroke(); } }
  g.globalAlpha=a*clamp((kk-0.3)*2,0,1); g.font='700 32px VWMono'; g.letterSpacing='1px'; g.fillStyle=GOLD; g.textAlign='center'; g.textBaseline='top'; g.fillText('2.4M',x,y+r+18);
  g.restore(); }
function levelLine(c,a,glow,la=0){ if (a<=0) return; const g=VW.g, L=c.L, y=c.PY(LVL); g.save(); g.globalAlpha=a;
  g.strokeStyle=GOLD; g.lineWidth=3+2*glow; g.setLineDash(glow>0.3?[]:[12,8]); g.shadowColor=GOLD; g.shadowBlur=14+26*glow; g.beginPath(); g.moveTo(L.x0-20,y); g.lineTo(L.x1+8,y); g.stroke(); g.setLineDash([]); g.shadowBlur=0;
  if (la>0){ g.globalAlpha=a*la; g.font='700 28px VWMono'; g.fillStyle=GOLD; g.textAlign='right'; g.textBaseline='top'; g.fillText('LEVEL '+LVL.toFixed(2),L.x1-4,y+14); } g.restore(); }
const fmt=v=>(v>=0?'+':'−')+'$'+Math.abs(v).toFixed(2);
// P&L hero: counter only; colour crossfades on the sign change
const _lp=cB.lastPrice.bind(cB);
function touchPrice(c,n){ if (n<TOUCH||n>=TOUCH+1) return _lp(n); const b=BARS[TOUCH], f=n-TOUCH; return f<0.6?mix(b.o,b.l,eo(f/0.6)):mix(b.l,b.c,eo((f-0.6)/0.4)); }
cB.lastPrice=n=>touchPrice(cB,n);   // price tag and P&L read the same intrabar path
function pnlHero(c,n,a,t){ if (n<=TOUCH+0.05||a<=0) return; const g=VW.g, L=c.L, p=touchPrice(c,n), d=r2(p-LVL), usd=d*SH;
  const k=clamp((n-TOUCH-0.05)*4,0,1); const pos=usd>=0, col=pos?GREEN:RED, flash=Math.exp(-Math.pow((t-E.flip)/0.12,2));
  const y=L.y1-150; g.save(); g.globalAlpha=a*k; g.textAlign='left'; g.textBaseline='alphabetic';
  g.letterSpacing='0px'; g.font='700 76px VWMono'; g.fillStyle=col; g.shadowColor=VW.rgba(col,0.65+0.35*flash); g.shadowBlur=22+40*flash;
  const s=1+0.08*flash; g.save(); g.translate(L.x0,y); g.scale(s,s); g.fillText(fmt(usd),0,0); g.restore(); g.shadowBlur=0;
  g.restore(); }
function altPath(c,k){ if (k<=0) return; const g=VW.g, x0=c.X(TOUCH), y0=c.PY(LVL), x1=c.X(N-1);
  g.save(); g.globalAlpha=0.95*k; g.setLineDash([12,10]); g.strokeStyle=RED; g.lineWidth=4; g.beginPath(); g.moveTo(x0,y0);
  g.bezierCurveTo(x0+70,y0, x0+120,c.PY(LVL+ALT*0.65), mix(x0,x1,k), c.PY(LVL+ALT*k)); g.stroke(); g.setLineDash([]);
  if (k>0.5){ g.globalAlpha=clamp((k-0.5)*2.5,0,1); g.font='700 52px VWMono'; g.fillStyle=RED; g.shadowColor=VW.rgba(RED,0.6); g.shadowBlur=18; g.textAlign='right'; g.textBaseline='top'; g.fillText(fmt(ALT*SH),x1+6,c.PY(LVL+ALT)+12); }
  g.restore(); }
function winChip(c,a){ if (a<=0) return; const g=VW.g, x=c.X(N-1), y=c.PY(BARS[N-1].c); g.save(); g.globalAlpha=a; g.font='700 52px VWMono'; g.fillStyle=GREEN;
  g.shadowColor=VW.rgba(GREEN,0.6); g.shadowBlur=18; g.textAlign='right'; g.textBaseline='bottom'; g.fillText(fmt(r2(BARS[N-1].c-LVL)*SH),x+6,y-26); g.restore(); }
function centerText(txt,y,size,col,a,font='VWSans',weight=700){ if (a<=0) return; const g=VW.g; g.save(); g.globalAlpha=a; g.textAlign='center'; g.textBaseline='middle';
  g.font=`${weight} ${size}px ${font}`; g.fillStyle=col; g.shadowColor='rgba(0,0,0,0.95)'; g.shadowBlur=30; g.fillText(txt,SAFE.cx,y); g.restore(); }
function emerge(txt,c,col,k,below=false){ if (k<=0) return; const g=VW.g, L=c.L, y=c.PY(LVL), h=66;
  g.save(); g.beginPath(); if (below) g.rect(0,y+4,VW.W,h+20); else g.rect(0,y-h-20,VW.W,h+20); g.clip(); g.globalAlpha=Math.min(1,k*1.4);
  g.textAlign='center'; g.font='700 44px VWSans'; g.fillStyle=col; g.shadowColor='rgba(0,0,0,0.9)'; g.shadowBlur=24;
  if (below){ g.textBaseline='top'; g.fillText(txt,(L.x0+L.x1+122)/2,y+14-(1-eo(k))*h); } else { g.textBaseline='bottom'; g.fillText(txt,(L.x0+L.x1+122)/2,y-14+(1-eo(k))*h); }
  g.restore(); }
function rewindFx(a){ if (a<=0) return; const g=VW.g; g.save(); g.globalAlpha=0.35*a;
  const gr=g.createLinearGradient(0,0,VW.W,0); gr.addColorStop(0,'rgba(120,160,255,0)'); gr.addColorStop(0.5,'rgba(120,160,255,0.55)'); gr.addColorStop(1,'rgba(120,160,255,0)');
  g.fillStyle=gr; for (let y=SAFE.y0; y<SAFE.y1; y+=7) g.fillRect(0,y,VW.W,1.2); g.restore(); }

// ---------- render ----------
function render(t){
  const g=VW.g; g.setTransform(1,0,0,1,0,0); g.globalAlpha=1; g.filter='none';
  VW.background(t);
  const st=state(t), tt=t>=E.loop0?0:t, c=cB, L=c.L;
  // camera: anchored to the level, following price a little
  const fx=(L.x0+L.x1)/2, fy=mix(c.PY(LVL), c.PY(c.lastPrice(st.n)), 0.25);
  g.save(); g.translate(fx,fy); g.scale(st.push,st.push); g.translate(-fx,-fy);
  const candleA=1-0.85*st.cta;
  panelFrame(L); c.grid(); c.axis(1,1);
  g.globalAlpha=candleA*(1-0.9*st.alt); c.volume(st.n,VMAX,120); g.globalAlpha=candleA; c.candles(st.n); g.globalAlpha=1;
  levelLine(c, st.lvl, st.slow, t>=E.loop0?0:seg(t,E.priceW-0.4,E.priceW+0.2)*(1-seg(t,E.then-0.3,E.then)));
  PRINTS.forEach((pr,j)=>{ if (pr.i>=st.n) return; const k=clamp(st.seqP*PRINTS.length-j,0,1); bubble(c,pr,k*(1-0.9*st.cta),st.toVol,false); });
  if (st.n>TOUCH+0.3) bigPrint(c,t,(1-st.cta)*(1-st.rewind));
  g.globalAlpha=1-st.cta; c.priceTag(st.n); g.globalAlpha=1;
  pnlHero(c, st.n, (1-st.cta)*(1-st.rewind), t);
  altPath(c, st.alt);
  if (t<E.loop0){ emerge('THE CHART SHOWS THE CANDLES.',c,COL.ink,seg(t,E.chart2-0.05,E.chart2+0.45));
    emerge('VOLWICK SHOWS THE PRINTS.',c,GOLD,seg(t,E.vw2-0.05,E.vw2+0.45),true); }
  g.restore();
  rewindFx(st.rewind);
  VW.vignette(); VW.topBand(330);
  const endK=seg(t,E.logo0,E.logo0+0.5)*(1-seg(t,E.loop0,E.total-0.15));
  VW.logoTL(1-endK,'SPY',52,30,true);
  // hook: the result first
  const hOut=1-seg(tt,E.rw0-0.15,E.rw0+0.1);
  { const a1=eo(lin(tt,-0.3,0))*hOut, a2=eo(lin(tt,E.two-0.03,E.two+0.15))*hOut;
    if (a1>0){ g.save(); g.font='700 50px VWSans'; g.textBaseline='middle'; g.textAlign='left'; g.shadowColor='rgba(0,0,0,0.95)'; g.shadowBlur=30;
      const t1='ONE PRICE.  ', t2='TWO OUTCOMES.', w1=g.measureText(t1).width, w2=g.measureText(t2).width, x=SAFE.cx-(w1+w2)/2, y=384;
      g.globalAlpha=a1; g.fillStyle=COL.ink; g.fillText(t1,x,y); g.globalAlpha=a2; g.fillStyle=GOLD; g.fillText(t2,x+w1,y); g.restore(); } }
  VW.captions(t,GROUPS,{y:1408,size:60,keySize:70,keys:new Map([['blocks',GOLD],['printing',GOLD],['volume.',COL.ink2],['Volwick',COL.blue],['traded.',GOLD],['level.',GOLD],['HELD.',GREEN],['broken.',RED]]),until:E.chart2-0.15});
  if (t>E.logo0){ const y=c.PY(LVL), pts=[]; for (let i=0;i<N;i++) pts.push([mix(L.x0,L.x1,i/(N-1)),y]);
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
  CUES=(await (await fetch('cues.json')).json()).cues;
  GROUPS=VW.buildGroups(WORDS.filter(w=>w[1]>W('outcomes.',1,'e')+0.2));
  buildTimeline(); await VW.loadFonts(); await VW.loadBrand(); render(0);
  return {...window.DATA_CHECK, total:S.total, events:E};
})();
