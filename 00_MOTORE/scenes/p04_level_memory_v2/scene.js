// ============================================================
// Scene P04 · BEYOND THE CHART · "Same level. Third time."
// The level with a memory: 7,733.00 on ES took 7 block prints (2.4K contracts) across two earlier sessions.
// On today's chart it is just a number; with LEVELS · ALL (about ten days of memory) it is a key level
// (at least three prints in the band). Today price comes back to it; a hypothetical long, 1 ES at the level,
// stop 4 points below, exit at the close. Standard of P03 v6: live chart camera, P&L as a position, spoken CTA.
// All data SIMULATED.
// ============================================================
const S = {};
const {COL, SAFE, seg, lin, eo, eio, mix, clamp} = VW;
const GOLD='#F2C14E', RED='#E2575F', GREEN=COL.up, SILVER='#C9D2E3';

// ---------- simulated ES, three sessions (tick 0.25, $50 per point) ----------
const N=66, LVL=7733.00, PT=50, D1=20, D2=40, TOUCH=58, STOP=7729.00;
const R=VW.rng(40433), q=x=>Math.round(x*4)/4;
function target(i){
  if (i<D1){ return i<=9 ? mix(7744,LVL+0.5,eio(i/9)) : mix(LVL+0.5,7745,eo((i-9)/10)); }          // 2 days ago
  if (i<D2){ const j=i-D1; return j<=10 ? mix(7748,LVL+0.5,eio(j/10)) : mix(LVL+0.5,7741.5,eo((j-10)/9)); }   // yesterday
  const j=i-D2; if (j<=7) return mix(7746,7752,eo(j/7)); if (i<=TOUCH) return mix(7752,LVL+1,eio((i-47)/(TOUCH-47)));   // today
  return mix(LVL+1.5,7745.5,eo((i-TOUCH)/(N-1-TOUCH)));
}
const ATLVL=new Set([8,9,10,29,30,31,32]);              // bars that trade down to the level (prints there)
const BARS=[]; { let c=7744;
  for (let i=0;i<N;i++){ let o=(i===D1)?7748:(i===D2)?7746:c; let cl=q(target(i)+(R()-0.5)*1.2);
    if (i===TOUCH) cl=7734.50; if (i===N-1) cl=7745.50; if (ATLVL.has(i)) cl=Math.max(cl,LVL+0.5);
    let h=q(Math.max(o,cl)+R()*1.25+0.25), l=q(Math.min(o,cl)-R()*1.25-0.25);
    if (ATLVL.has(i)) l=LVL; else l=Math.max(l,LVL+0.5);
    if (i===TOUCH) l=7731.25;
    BARS.push({o,h,l,c:cl,v:Math.round(1800+R()*1600)}); c=cl; } }
const PRINTS=[[8,420],[9,310],[10,180],[29,650],[30,280],[31,360],[32,200]].map(([i,qty])=>({i,q:qty,p:LVL}));
PRINTS.forEach(pr=>{ BARS[pr.i].v+=pr.q*2; });
const TOTAL=PRINTS.reduce((a,p)=>a+p.q,0);              // 2,400 contracts
window.DATA_CHECK={ level:LVL, prints:PRINTS.length, contracts:TOTAL, minPrint:Math.min(...PRINTS.map(p=>p.q)),
  touchLow:BARS[TOUCH].l, close:BARS[N-1].c, pnlLow:(BARS[TOUCH].l-LVL)*PT, pnlClose:(BARS[N-1].c-LVL)*PT, pnlStop:(STOP-LVL)*PT,
  barsBelowLevelOutsideTouch:BARS.filter((b,i)=>i!==TOUCH&&b.l<LVL).length };

// ---------- world (fixed scale) and viewport ----------
const K=40, BW=13, PMAX=7756, PMIN=7724;
const LB={cvd:{y0:0,y1:0},x0:0,x1:N*BW,y0:0,y1:(PMAX-PMIN)*K,pMin:PMIN,pMax:PMAX}; const cA=new VW.Chart(BARS,LB);
const V={x0:96,x1:826,y0:580,y1:1530}; V.w=V.x1-V.x0; V.h=V.y1-V.y0; V.cx=(V.x0+V.x1)/2; V.cy=(V.y0+V.y1)/2;
const AX=836, CAP_Y=392, VOLH=70, VMAX=6200, LSP=1.7;
let CAM={cx:0,cy:0,s:1};
const SX=x=>V.cx+(x-CAM.cx)*CAM.s, SY=y=>V.cy+(y-CAM.cy)*CAM.s, WY=sy=>CAM.cy+(sy-V.cy)/CAM.s, PY=p=>cA.PY(p), X=i=>cA.X(i);
const f2=p=>p.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});

let WORDS=[], GROUPS=[], CUES={};
function W(word,nth=1,edge='s'){ let c=0; for (const w of WORDS){ if (w[0].replace(/[^\w']/g,'').toLowerCase()===word.replace(/[^\w']/g,'').toLowerCase()){ if (++c===nth) return edge==='s'?w[1]:w[2]; } } throw new Error('word not found: '+word+' #'+nth); }
let E={};
function buildTimeline(){
  E.third=W('Third'); E.hookE=W('time.',1,'e');
  E.today=W("today's"); E.l1E=W('number.',1,'e');
  E.vw1=W('Volwick',1); E.l2E=W('prints.',1,'e');
  E.seven=W('Seven'); E.l3E=W('days.',2,'e');
  E.one=W('One'); E.three=W('Three'); E.l4E=W('level.',2,'e');
  E.todayB=W('Today,'); E.l5E=W('it.',1,'e');
  E.held=W('held,'); E.not=W('Not'); E.l7E=W('guarantee.',1,'e');
  E.chart2=W('chart',2); E.vw2=W('Volwick',2); E.ctxE=W('memory.',1,'e');
  E.logo0=CUES.logo0; E.beat=E.logo0+1.75/LSP; E.dv=CUES.dvv[0]-0.08; E.loop0=CUES.loop0; E.total=E.loop0+0.5;
  E.flip=E.held+0.03; E.rise1=E.held+1.6;
  E.cmp0=E.not-0.1; E.cmp1=E.chart2-0.3;
  Object.assign(E,{rw0:E.hookE+0.1, softBoom:1, hookBuyers:E.third, div:E.three, cvdWord:E.todayB-0.2, b0:E.seven, b1:E.l3E, flow:E.vw1+0.3,
    volwick:E.vw2, holdHit:E.held+0.02, swap:E.vw1-0.1, riser0:E.l5E+0.05, riser1:E.held,
    arrive:E.l5E-0.02, count0:E.held+0.05, count1:E.rise1, ctaWhoosh:E.vw2-0.25});
  S.total=E.total;
}

// ---------- intrabar path of today's touch bar ----------
function touchPath(f){ const b=BARS[TOUCH];
  if (f<0.30) return mix(b.o,LVL,eio(f/0.30)); if (f<0.50) return LVL; if (f<0.60) return mix(LVL,b.l,eio((f-0.50)/0.10)); return mix(b.l,b.c,eo((f-0.60)/0.40)); }
const _lp=cA.lastPrice.bind(cA);
cA.lastPrice=n=> (n<TOUCH||n>=TOUCH+1) ? _lp(n) : touchPath(n-TOUCH);
function drawCandle(i,k,a){ if (k<=0||a<=0) return; const g=VW.g, b=BARS[i], x=X(i); let o=b.o, cl, hi, lo;
  if (i===TOUCH && k<1){ const p=touchPath(k); cl=p; lo=k<0.6?Math.min(b.o,p):Math.min(b.l,p); hi=Math.max(b.o,p,k>0.05?b.h:b.o); g.globalAlpha=a; }
  else { const kk=VW.eoe(k); cl=mix(b.o,b.c,kk); hi=mix(Math.max(b.o,cl),b.h,kk); lo=mix(Math.min(b.o,cl),b.l,kk); g.globalAlpha=a*Math.min(1,k*2.5); }
  const col=cl>=o?COL.up:COL.dn; g.strokeStyle=col; g.lineWidth=2/CAM.s*1.2; g.beginPath(); g.moveTo(x,PY(hi)); g.lineTo(x,PY(lo)); g.stroke();
  const y1=PY(Math.max(o,cl)), y2=PY(Math.min(o,cl)); g.fillStyle=col; g.fillRect(x-BW*0.34,y1,BW*0.68,Math.max(2/CAM.s,y2-y1)); g.globalAlpha=1; }
function candles(n,from,a){ for (let i=from;i<Math.ceil(n)&&i<N;i++) drawCandle(i,clamp(n-i,0,1),a); }

// ---------- state ----------
function state(t){
  const st={}; const loop=t>=E.loop0, tt=loop?0:t;
  if (tt<E.hookE+0.1) st.n=TOUCH+0.42;                                                  // hook: today's price on the level
  else if (t<E.today) st.n=mix(TOUCH+0.42,52,eio(lin(t,E.hookE+0.1,E.today)));          // back a few minutes before the touch
  else if (t<E.todayB) st.n=52;
  else if (t<E.l5E) st.n=mix(52,TOUCH+0.3,eio(lin(t,E.todayB,E.l5E)));                   // price returns while the voice says it
  else if (t<E.held) st.n=mix(TOUCH+0.3,TOUCH+0.62,lin(t,E.l5E,E.held));                 // slow motion (editing only)
  else st.n=mix(TOUCH+0.62,N,eo(lin(t,E.held,E.rise1)));                                 // reaction starts on the word
  // levels memory: ALL shows the earlier sessions' prints; TODAY shows none
  st.all = loop?0 : (tt<E.hookE+0.1 ? 1 : seg(t,E.vw1,E.vw1+0.35));
  st.seqP = loop?0 : (tt<E.hookE+0.1 ? 1 : lin(t,E.seven-0.1,E.l3E-0.3));
  st.key = loop?0 : (tt<E.hookE+0.1 ? 1 : seg(t,E.three-0.1,E.three+0.4));   // band becomes a key level
  st.event = loop?0 : seg(t,E.one-0.1,E.one+0.2)*(1-seg(t,E.three-0.2,E.three+0.1));
  st.slow = loop?0 : seg(t,E.l5E-0.35,E.l5E+0.25)*(1-seg(t,E.held+0.15,E.held+1.0));
  st.cmp = loop?0 : seg(t,E.cmp0,E.cmp0+0.4)*(1-seg(t,E.cmp1,E.cmp1+0.3));
  st.cta = loop?0 : seg(t,E.vw2-0.25,E.vw2+0.35);
  st.todayOnly = loop?0 : (seg(t,E.hookE,E.hookE+0.4)*(1-seg(t,E.vw1-0.05,E.vw1+0.4))) + (seg(t,E.chart2-0.2,E.chart2+0.2)*(1-seg(t,E.vw2-0.1,E.vw2+0.3)));
  return st;
}

// ---------- camera ----------
const camAll={s:0.84, cx:N*BW/2, cy:PY(7740.2)};                                  // three sessions
const camToday={s:1.2, cx:X(48), cy:PY(7743.2)};                                  // today only, before the touch
const camClose={s:2.1, cx:X(TOUCH)-0.10*V.w/2.1, cy:PY(LVL)+(V.cy-1018)/2.1};
const camPunch={s:1.08, cx:N*BW/2, cy:PY(7738.2)};
const camTrade={s:1.1, cx:X(54), cy:PY(7736.0)};                               // today with entry, stop and close
function camFollow(n){ const p=cA.lastPrice(Math.max(1,n)), s=clamp(560/(Math.max(0.5,Math.abs(p-LVL))*K),1.1,1.7);
  const xNew=X(Math.max(0,Math.min(N-1,n-0.5))), cx=xNew-(0.80-0.5)*V.w/s;
  let cy=PY(mix(LVL,p,0.6)); cy=Math.min(Math.max(cy, PY(LVL)-(1178-V.cy)/s), PY(p)+(V.cy-638)/s); return {s,cx,cy}; }
const mixCam=(a,b,k)=>({s:Math.exp(mix(Math.log(a.s),Math.log(b.s),k)), cx:mix(a.cx,b.cx,k), cy:mix(a.cy,b.cy,k)});
function camera(t,st){
  if (t>=E.loop0) return camAll;
  let c=mixCam(camPunch,camAll,eio(clamp(lin(t,0.3,1.3),0,1)));                             // strong open: on the touch, then the three sessions
  c=mixCam(c,camToday,seg(t,E.hookE,E.hookE+0.5)*(1-seg(t,E.vw1-0.1,E.vw1+0.5)));          // "on today's chart"
  c=mixCam(c,camFollow(st.n),seg(t,E.todayB-0.4,E.todayB+0.2)*(1-seg(t,E.not-0.4,E.not+0.2)));
  c=mixCam(c,camClose,st.slow);
  c=mixCam(c,camTrade,seg(t,E.not-0.4,E.not+0.2)*(1-seg(t,E.chart2-0.4,E.chart2)));
  c=mixCam(c,camToday,seg(t,E.chart2-0.4,E.chart2)*(1-seg(t,E.vw2-0.2,E.vw2+0.4)));         // "the chart shows today"
  c=mixCam(c,camAll,seg(t,E.vw2-0.2,E.vw2+0.4));                                             // "Volwick shows the memory"
  return c; }

// ---------- drawings ----------
function panel(){ const g=VW.g; g.save(); g.fillStyle='rgba(10,16,30,0.55)'; VW.roundRect(V.x0-14,V.y0-20,AX+118-(V.x0-14),V.h+40,18); g.fill();
  g.strokeStyle='rgba(120,150,210,0.14)'; g.lineWidth=1.2; g.stroke(); g.restore(); }
function axis(yTag,a){ const g=VW.g; const step=CAM.s>=1.3?2.5:5;
  g.save(); g.globalAlpha=0.85*a; g.font='600 28px VWMono'; g.fillStyle=COL.ink2; g.textAlign='left'; g.textBaseline='middle';
  const pTop=PMIN+(LB.y1-WY(V.y0))/K, pBot=PMIN+(LB.y1-WY(V.y1-VOLH))/K;
  for (let p=Math.ceil(pBot/step)*step; p<=pTop; p+=step){ const y=SY(PY(p)); if (y<V.y0+16||y>V.y1-VOLH-16||Math.abs(y-yTag)<48) continue;
    g.fillText(f2(p),AX,y); g.strokeStyle='rgba(120,150,210,0.07)'; g.lineWidth=1; g.beginPath(); g.moveTo(V.x0,y); g.lineTo(V.x1,y); g.stroke(); }
  g.restore(); }
function priceTag(p,a){ if (a<=0) return; const g=VW.g, y=clamp(SY(PY(p)),V.y0+26,V.y1-26); g.save(); g.globalAlpha=a;
  g.setLineDash([6,8]); g.strokeStyle=VW.rgba(GOLD,0.5); g.lineWidth=1.5; g.beginPath(); g.moveTo(V.x0,y); g.lineTo(AX-8,y); g.stroke(); g.setLineDash([]);
  g.fillStyle=GOLD; VW.roundRect(AX-10,y-26,132,52,9); g.fill(); g.fillStyle='#120E02'; g.font='700 26px VWMono'; g.textAlign='center'; g.textBaseline='middle'; g.fillText(f2(q(p)),AX+56,y+1); g.restore(); }
function volume(n,a){ const g=VW.g; g.save(); g.globalAlpha=a;
  for (let i=0;i<Math.ceil(n)&&i<N;i++){ const x=SX(X(i)); if (x<V.x0-20||x>V.x1+20) continue; const k=clamp(n-i,0,1), b=BARS[i];
    g.fillStyle=VW.rgba(b.c>=b.o?COL.up:COL.dn,0.26*k); const h=b.v/VMAX*VOLH*eo(k), w=Math.max(2,BW*CAM.s*0.68); g.fillRect(x-w/2,V.y1-h,w,h); } g.restore(); }
// session separators and labels (screen space)
function sessions(a){ if (a<=0) return; const g=VW.g; g.save(); g.font='700 25px VWMono'; g.letterSpacing='2px';
  const L=[[0,'2 DAYS AGO'],[D1,'YESTERDAY'],[D2,'TODAY']].map(([i,lab],j)=>{ const x=SX(X(i)-BW/2); return {j,lab,x,lx:Math.max(V.x0+12,x+10),w:g.measureText(lab).width}; });
  L.forEach((s0,j)=>{ if (j>0 && s0.x>V.x0+4 && s0.x<V.x1-4){ g.globalAlpha=0.5*a; g.setLineDash([6,8]); g.strokeStyle='rgba(150,170,210,0.5)'; g.lineWidth=1.5; g.beginPath(); g.moveTo(s0.x,V.y0+6); g.lineTo(s0.x,V.y1-6); g.stroke(); g.setLineDash([]); } });
  L.forEach((s0,j)=>{ const nx=L[j+1]; if (nx && nx.lx < s0.lx+s0.w+24) return;            // the next session's label takes the space
    if (s0.lx>V.x1-s0.w-110) return; g.globalAlpha=a; g.fillStyle=j===2?COL.ink:COL.ink2; g.textAlign='left'; g.textBaseline='top'; g.fillText(s0.lab,s0.lx,V.y0+70); });
  g.restore(); }
function pill(pr,k,hi){ if (k<=0) return; const g=VW.g, x=X(pr.i), y=PY(pr.p), r=(4+Math.sqrt(pr.q)*0.42)/Math.sqrt(CAM.s)*(0.6+0.4*eo(k));
  g.save(); g.globalAlpha=Math.min(1,k*1.4); g.shadowColor=VW.rgba(GOLD,0.8); g.shadowBlur=12+20*hi; g.fillStyle=VW.rgba(GOLD,0.92); g.beginPath(); g.arc(x,y,r*(1+0.35*hi),0,7); g.fill(); g.shadowBlur=0;
  const ring=clamp((k-0.2)*1.5,0,1); if (ring<1){ g.strokeStyle=VW.rgba(GOLD,0.6*(1-ring)); g.lineWidth=2/CAM.s; g.beginPath(); g.arc(x,y,r+ring*20/CAM.s,0,7); g.stroke(); }
  g.restore(); }
function levelLine(a,key,glow){ if (a<=0) return; const g=VW.g, y=PY(LVL), col=key>0.5?GOLD:SILVER; g.save(); g.globalAlpha=a*(0.55+0.45*key);
  g.strokeStyle=col; g.lineWidth=(2+2*key+2*glow)/CAM.s; g.setLineDash(glow>0.3?[]:[12/CAM.s,8/CAM.s]); g.shadowColor=col; g.shadowBlur=8+20*key+20*glow; g.beginPath(); g.moveTo(-2000,y); g.lineTo(LB.x1+2000,y); g.stroke(); g.restore(); }
// key level label in the terminal's format, on the left above the line
function levelLabel(a,count){ if (a<=0) return; const g=VW.g, y=SY(PY(LVL)); g.save(); g.globalAlpha=a; g.textAlign='left'; g.textBaseline='top';
  g.shadowColor='rgba(0,0,0,0.9)'; g.shadowBlur=12; g.font='700 30px VWMono'; g.fillStyle=GOLD;
  const n=Math.max(0,Math.min(PRINTS.length,count)), sum=PRINTS.slice(0,n).reduce((s,p)=>s+p.q,0);
  g.fillText(`★★ ${f2(LVL)}  ${(sum/1000).toFixed(1)}K · ${n} BLOCKS`,V.x0+14,y+16); g.restore(); }
function ruleTag(a,key){ if (a<=0) return; const g=VW.g, y=SY(PY(LVL)); g.save(); g.globalAlpha=a; g.font='700 29px VWMono'; g.textAlign='left'; g.textBaseline='top';
  g.shadowColor='rgba(0,0,0,0.9)'; g.shadowBlur=12; g.fillStyle=COL.ink; g.globalAlpha=a*(1-key); g.fillText('1 PRINT = AN EVENT',V.x0+14,y+62);
  g.globalAlpha=a*key; g.fillStyle=GOLD; g.fillText('3+ PRINTS = A KEY LEVEL',V.x0+14,y+62); g.restore(); }
function chip(txt,col,a){ if (a<=0) return; const g=VW.g; g.save(); g.globalAlpha=a; g.font='700 27px VWMono'; g.letterSpacing='2px'; const w=g.measureText(txt).width+32;
  g.fillStyle='rgba(6,10,20,0.85)'; VW.roundRect(V.x0+10,V.y0+12,w,48,10); g.fill(); g.strokeStyle=VW.rgba(col,0.6); g.lineWidth=1.5; g.stroke();
  g.fillStyle=col; g.textAlign='left'; g.textBaseline='middle'; g.fillText(txt,V.x0+26,V.y0+37); g.restore(); }
const fmt=v=>(v>=0?'+':'−')+'$'+Math.abs(v).toFixed(2);
// hypothetical long 1 ES at the level: green box entry -> price, red zone entry -> stop (world)
function positionBox(n,a){ if (a<=0) return; const f=n-TOUCH; if (f<0.3) return; const g=VW.g, p=cA.lastPrice(n), x0=X(TOUCH)-BW*0.5, x1=Math.max(X(Math.min(N-1,n-0.001))+BW*0.5, x0+BW*4);
  const k=a*clamp((f-0.3)*8,0,1); g.save(); g.globalAlpha=k;
  g.fillStyle=VW.rgba(RED,0.10); g.fillRect(x0,PY(LVL),x1-x0,PY(STOP)-PY(LVL)); g.strokeStyle=VW.rgba(RED,0.75); g.lineWidth=2/CAM.s; g.setLineDash([8/CAM.s,6/CAM.s]); g.beginPath(); g.moveTo(x0,PY(STOP)); g.lineTo(x1,PY(STOP)); g.stroke(); g.setLineDash([]);
  const col=p>=LVL?GREEN:RED; g.fillStyle=VW.rgba(col,0.16); g.fillRect(x0,Math.min(PY(LVL),PY(p)),x1-x0,Math.abs(PY(p)-PY(LVL)));
  g.strokeStyle=VW.rgba(col,0.8); g.beginPath(); g.moveTo(x0,PY(p)); g.lineTo(x1,PY(p)); g.stroke(); g.restore(); }
function stopTag(n,a){ if (a<=0||n-TOUCH<0.3) return; const g=VW.g, x=SX(X(TOUCH)+BW*2), y=SY(PY(STOP)); if (y>V.y1-VOLH-10) return;
  g.save(); g.globalAlpha=a*clamp((n-TOUCH-0.3)*8,0,1); g.font='700 28px VWMono'; g.fillStyle=RED; g.shadowColor='rgba(0,0,0,0.9)'; g.shadowBlur=10; g.textAlign='left'; g.textBaseline='top';
  g.fillText(`STOP ${f2(STOP)} · ${fmt((STOP-LVL)*PT)}`,Math.min(x,V.x1-470),y+8); g.restore(); }
const HYP1='HYPOTHETICAL · 1 ES @ '+f2(LVL), HYP2='EXIT AT THE CLOSE · NO FEES';
function pnlHero(n,a,t){ if (a<=0) return; const f=n-TOUCH; if (f<0.3) return;
  const g=VW.g, p=cA.lastPrice(n), usd=(q(p)-LVL)*PT, col=usd>0.004?GREEN:(usd<-0.004?RED:COL.ink), flash=Math.exp(-Math.pow((t-E.flip)/0.12,2));
  const x=V.x0+14, y=clamp(SY(PY(LVL))+130,V.y0+190,V.y1-VOLH-60); g.save(); g.globalAlpha=a*clamp((f-0.3)*10,0,1); g.textAlign='left'; g.textBaseline='alphabetic';
  g.font='700 84px VWMono'; g.fillStyle=col; g.shadowColor=VW.rgba(col,0.55+0.4*flash); g.shadowBlur=18+36*flash;
  const s=1+0.06*flash; g.save(); g.translate(x,y); g.scale(s,s); g.fillText(Math.abs(usd)<0.004?'$0.00':fmt(usd),0,0); g.restore(); g.shadowBlur=0;
  g.font='600 27px VWMono'; g.fillStyle=COL.ink2; g.fillText('HYPOTHETICAL · 1 ES', x+4, y+42); g.restore(); }
function compare(a){ if (a<=0) return; const g=VW.g, x=V.x0+14, y=clamp(SY(PY(LVL))+110,V.y0+190,V.y1-VOLH-170);
  g.save(); g.globalAlpha=a; g.fillStyle='rgba(6,10,20,0.82)'; VW.roundRect(x-12,y-62,520,226,14); g.fill(); g.textAlign='left'; g.textBaseline='alphabetic';
  [[`HELD  ${fmt((BARS[N-1].c-LVL)*PT)}`,GREEN,0],[`STOP  ${fmt((STOP-LVL)*PT)}`,RED,74]].forEach(([s,col,dy])=>{ g.font='700 62px VWMono'; g.fillStyle=col; g.shadowColor=VW.rgba(col,0.5); g.shadowBlur=16; g.fillText(s,x,y+dy); });
  g.shadowBlur=0; g.font='600 27px VWMono'; g.fillStyle=COL.ink2; g.fillText(HYP1,x+4,y+116); g.fillText(HYP2,x+4,y+148); g.restore(); }
function emerge(txt,col,k,below=false){ if (k<=0) return; const g=VW.g, y=SY(PY(LVL)), h=70;
  g.save(); g.beginPath(); if (below) g.rect(0,y+4,VW.W,h+20); else g.rect(0,y-h-20,VW.W,h+20); g.clip(); g.globalAlpha=Math.min(1,k*1.4);
  g.textAlign='center'; g.font='700 46px VWSans'; g.fillStyle=col; g.shadowColor='rgba(0,0,0,0.9)'; g.shadowBlur=24;
  if (below){ g.textBaseline='top'; g.fillText(txt,SAFE.cx,y+14-(1-eo(k))*h); } else { g.textBaseline='bottom'; g.fillText(txt,SAFE.cx,y-14+(1-eo(k))*h); }
  g.restore(); }
// hook: the three touches counted on the level
function touchMarks(t,a){ if (a<=0) return; const g=VW.g; const pts=[[9,0.25],[30,0.6],[TOUCH,E.third-0.05]];
  pts.forEach(([i,t0],j)=>{ const k=clamp((t-t0)/0.25,0,1); if (k<=0) return; const x=SX(X(i)), y=SY(PY(LVL));
    g.save(); g.globalAlpha=a*k; g.strokeStyle=GOLD; g.lineWidth=3; g.shadowColor=GOLD; g.shadowBlur=16; g.beginPath(); g.arc(x,y,22+(1-eo(k))*20,0,7); g.stroke(); g.shadowBlur=0;
    g.font='700 34px VWMono'; g.fillStyle=GOLD; g.textAlign='center'; g.textBaseline='top'; g.fillText(String(j+1),x,y+32); g.restore(); }); }

// ---------- render ----------
function render(t){
  const g=VW.g; g.setTransform(1,0,0,1,0,0); g.globalAlpha=1; g.filter='none';
  VW.background(t);
  const st=state(t), tt=t>=E.loop0?0:t, hook=tt<E.hookE+0.1;
  CAM=camera(t,st);
  const ctaDim=1-0.75*st.cta, p=cA.lastPrice(Math.max(1,st.n)), yTag=clamp(SY(PY(p)),V.y0+26,V.y1-26);
  panel(); axis(yTag,1-0.8*st.cta); volume(st.n,ctaDim);
  // world layer
  g.save(); g.beginPath(); g.rect(V.x0,V.y0,V.w,V.h); g.clip();
  g.translate(V.cx,V.cy); g.scale(CAM.s,CAM.s); g.translate(-CAM.cx,-CAM.cy);
  const tradeA=(t>=E.loop0||hook)?0:(1-seg(t,E.chart2-0.35,E.chart2+0.05));
  positionBox(st.n,tradeA);
  candles(st.n,0,ctaDim);
  const lvlA=Math.max(st.all, hook?1:0)*(1-0.2*st.todayOnly);
  levelLine(lvlA*(t>=E.loop0?0:1), st.key, st.slow);
  PRINTS.forEach((pr,j)=>{ const k=clamp(st.seqP*PRINTS.length-j,0,1)*st.all*(1-st.todayOnly); pill(pr,k,(j===3?st.event:0)); });
  g.restore();
  // screen layer
  sessions(1-st.cta);
  priceTag(p,1-st.cta);
  if (hook || t>=E.loop0) touchMarks(tt, t>=E.loop0?0:1);
  const labA=(t>=E.loop0||hook)?0 : st.all*(1-st.todayOnly)*(1-seg(t,E.todayB-0.3,E.todayB))*(1-st.cta);
  { const cnt=hook?PRINTS.length:Math.floor(st.seqP*PRINTS.length+0.15); levelLabel(labA*(cnt>=1?1:0), cnt); }
  ruleTag((t>=E.loop0)?0:seg(t,E.one-0.1,E.one+0.2)*(1-seg(t,E.todayB-0.3,E.todayB)), seg(t,E.three-0.1,E.three+0.25));
  stopTag(st.n,tradeA*(1-clamp(st.cmp*2,0,1)));
  pnlHero(st.n,tradeA*(1-clamp(st.cmp*2,0,1)),t);
  compare(clamp(st.cmp*2-1,0,1)*(1-seg(t,E.chart2-0.35,E.chart2+0.05)));
  if (t<E.vw2-0.3 && !hook){ const all=st.all*(1-st.todayOnly); chip('LEVELS · TODAY',COL.ink2,1-all); chip('LEVELS · ALL (10 DAYS)',GOLD,all); }
  if (hook) chip('LEVELS · ALL (10 DAYS)',GOLD,1);
  if (t<E.loop0){ emerge('THE CHART SHOWS TODAY.',COL.ink,seg(t,E.vw2-0.05,E.vw2+0.45));
    emerge('VOLWICK SHOWS THE MEMORY.',GOLD,seg(t,E.vw2+0.15,E.vw2+0.65),true); }
  VW.vignette(); VW.topBand(380);
  const endK=seg(t,E.logo0,E.logo0+0.5)*(1-seg(t,E.loop0,E.total-0.15));
  VW.logoTL(1-endK,'ES',52,30,true);
  const hOut=1-seg(tt,E.hookE-0.05,E.hookE+0.2);
  { const a1=eo(lin(tt,-0.3,0))*hOut, a2=eo(lin(tt,E.third-0.05,E.third+0.15))*hOut; g.save(); g.textAlign='center'; g.textBaseline='middle'; g.shadowColor='rgba(0,0,0,0.95)'; g.shadowBlur=30;
    g.font='700 58px VWSans'; if (a1>0){ g.globalAlpha=a1; g.fillStyle=COL.ink; g.fillText('SAME LEVEL.',SAFE.cx,440); }
    if (a2>0){ g.globalAlpha=a2; g.fillStyle=GOLD; g.fillText('THIRD TIME.',SAFE.cx,502); } g.restore(); }
  VW.captions(t,GROUPS,{y:490,size:66,keySize:76,keys:new Map([['ten',GOLD],['days',GOLD],['Seven',GOLD],['same',GOLD],['event.',COL.ink],['level.',GOLD],['Volwick',COL.blue],['held,',GREEN],['memory.',GOLD]]),until:E.vw2-0.15});
  if (t>E.logo0){ const y=SY(PY(LVL)), pts=[]; for (let i=0;i<N;i++) pts.push([mix(V.x0,V.x1,i/(N-1)),y]);
    VW.logoForm((t-E.logo0)*LSP, pts, {fadeOut:seg(t,E.loop0,E.total-0.15), noUrl:true, dy:-20, tagY:1318});
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
  CUES=(await (await fetch('cues.json')).json()).cues;
  GROUPS=VW.buildGroups(WORDS.filter(w=>w[1]>W('time.',1,'e')+0.2),3,16);
  buildTimeline(); await VW.loadFonts(); await VW.loadBrand(); render(0);
  const pAt=t=>q(cA.lastPrice(state(t).n)); let tc=E.held; while (pAt(tc)<=LVL && tc<E.held+2) tc+=0.005;
  return {...window.DATA_CHECK, total:S.total, events:E, signFlip:tc, heldWord:E.held};
})();
