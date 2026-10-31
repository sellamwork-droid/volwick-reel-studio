// ============================================================
// Scene P02 v9 · BEYOND THE CHART · "One level held. The other broke."
// Cinematic pass: break synced to the words, level-anchored transition,
// slow push-in on the decisive level, CTA emerging from the levels,
// lines of the level folding into the logo. Simulated ES data.
// ============================================================
const S = {};
const {COL, SAFE, seg, lin, eo, eio, mix, clamp} = VW;
const MAG = '#C04BD8', RED = '#E2575F', GREY = '#7C889C';

// ---------- two simulated ES sessions, identical until the touch ----------
const N=46, TOUCH=26, WALL=7660, START=7684;
const pre = i => START-(START-WALL-0.75)*Math.pow(i/TOUCH,1.15)+Math.sin(i*0.8)*1.1;
function session(after){ return VW.simSession({ seed: 77101, start: START, n: N, target: i => i<=TOUCH ? pre(i) : after(i-TOUCH),
  vol:(i,b,R)=>Math.round(1500+R()*1200+b*300), delta:(i,ret,gs)=>ret*200+gs()*120 }); }
const A = session(k => WALL+1.2+8.5*(1-Math.exp(-k/6))+Math.sin(k*1.1)*0.8);      // held
const B = session(k => WALL-0.5-20*(1-Math.exp(-k/5))+Math.sin(k*1.3)*0.7);        // broke
for (let i=TOUCH;i<N;i++){ A[i].l=Math.max(A[i].l, WALL-0.5); A[i].o=Math.max(A[i].o,A[i].l); A[i].c=Math.max(A[i].c,A[i].l); }
window.DATA_CHECK = { identicalBeforeTouch: A.slice(0,TOUCH).every((b,i)=>b.c===B[i].c),
  aEnd:A[N-1].c, bEnd:B[N-1].c, aMinAfter:Math.min(...A.slice(TOUCH).map(b=>b.l)), bMinAfter:Math.min(...B.slice(TOUCH).map(b=>b.l)) };

// ---------- layouts ----------
const PR = {pMin:7636, pMax:7688};                                   // same scale everywhere: the level never jumps
const R_A2 = {x0:72, x1:872, y0:450, y1:915, ...PR};
const R_B2 = {x0:72, x1:872, y0:1010, y1:1475, ...PR};
const R_1  = {x0:56, x1:900, y0:330, y1:1520, ...PR};               // protagonist: most of the frame
const R_UP = {x0:72, x1:872, y0:-560, y1:-90, ...PR};
const R_DN = {x0:72, x1:872, y0:2000, y1:2470, ...PR};
const LA = {cvd:{y0:0,y1:0}, ...R_A2}, LB = {cvd:{y0:0,y1:0}, ...R_B2};
const cA = new VW.Chart(A, LA), cB = new VW.Chart(B, LB);
const mixR = (r1,r2,k) => ({x0:mix(r1.x0,r2.x0,k), x1:mix(r1.x1,r2.x1,k), y0:mix(r1.y0,r2.y0,k), y1:mix(r1.y1,r2.y1,k), pMin:mix(r1.pMin,r2.pMin,k), pMax:mix(r1.pMax,r2.pMax,k)});
function setRect(c, r){ Object.assign(c.L, r); c.bw=(r.x1-r.x0)/c.N; }

let WORDS=[], GROUPS=[];
function W(word, nth=1, edge='s'){ let c=0; for (const w of WORDS){ if (w[0].replace(/[^\w]/g,'').toLowerCase()===word.replace(/[^\w]/g,'').toLowerCase()){ if (++c===nth) return edge==='s'?w[1]:w[2]; } } throw new Error('word not found: '+word+' #'+nth); }
let E={};
function buildTimeline(){
  E.held=W('held'); E.coll=W('collapsed'); E.collE=W('collapsed',1,'e');
  E.normal=W('On'); E.same=W('same'); E.dealer=W('dealer');
  E.red=W('Red'); E.buy=W('buy'); E.mag=W('Magenta'); E.sell=W('sell');
  E.neither=W('Neither'); E.guar=W('guarantee'); E.your=W('Your'); E.volwick=W('Volwick'); E.behindE=WORDS[WORDS.length-1][2];
  // hook choreography: both reach the level, A turns on "held", B breaks exactly on "collapsed" (= BROKE)
  E.touch=0.95; E.holdHit=E.held-0.08; E.breakHit=E.coll; E.why=E.collE+0.15;
  // level-anchored transition long > short
  E.x0=E.mag-0.55; E.x1=E.mag+0.15;
  // fast close: logo forms from the level lines
  E.logo0=E.behindE+0.3; E.beat=E.logo0+1.0; E.sw=E.logo0+1.62; E.dv=E.logo0+3.8; E.loop0=E.logo0+5.6; E.total=E.loop0+0.5;
  Object.assign(E,{hookBuyers:E.breakHit, rw0:E.normal, div:E.neither, cvdWord:E.dealer, b0:E.red+0.3, b1:E.mag-0.2, flow:E.mag+0.3,
    swap0:E.red-0.35, swap:E.x0+0.1, swap2:E.neither-0.35});
  S.total=E.total;
}

// ---------- story state ----------
const OPEN=18;
function state(t){
  const st={}; const loop=t>=E.loop0, tt=loop?0:t;
  if (tt<E.normal){
    st.nA = tt<E.touch ? mix(OPEN,TOUCH+0.4,eo(lin(tt,0,E.touch))) : (tt<E.held-0.25 ? TOUCH+0.4 : mix(TOUCH+0.4,N,eo(lin(tt,E.held-0.25,E.held+0.9))));
    // B sits on the level, then gives way sharply on the word
    st.nB = tt<E.touch ? mix(OPEN,TOUCH+0.4,eo(lin(tt,0,E.touch))) : (tt<E.breakHit ? TOUCH+0.4 : mix(TOUCH+0.4,N,eo(lin(tt,E.breakHit,E.breakHit+0.75))));
    st.col=0;
  } else if (t<E.normal+0.5){ const k=eio(lin(t,E.normal,E.normal+0.5)); st.nA=mix(N,TOUCH+1,k); st.nB=mix(N,TOUCH+1,k); st.col=0; }
  else {
    st.col=seg(t,E.dealer,E.dealer+0.6);
    st.nA = TOUCH+1+(N-TOUCH-1)*lin(t,E.red+0.5,E.buy+1.6);
    st.nB = TOUCH+1+(N-TOUCH-1)*lin(t,E.mag+0.4,E.sell+0.9);
  }
  // modes: dual > single A > (level-anchored swap) > single B > dual
  const kA=seg(t,E.red-0.45,E.red+0.1), kX=seg(t,E.x0,E.x1), kD=seg(t,E.neither-0.45,E.neither+0.1);
  st.ra=R_A2; st.rb=R_B2; st.aA=1; st.aB=1; st.single=false; st.kX=0;
  if (!loop){
    if (kD>0){ st.ra=mixR(R_UP,R_A2,kD); st.rb=mixR(R_1,R_B2,kD); st.aA=kD; }
    else if (kA>=1){ st.single=true; st.ra=R_1; st.rb=R_1; st.kX=kX; }
    else if (kA>0){ st.ra=mixR(R_A2,R_1,kA); st.rb=mixR(R_B2,R_DN,kA); st.aB=1-kA; }
  }
  // slow push-in toward the decisive level
  st.push = st.single ? 1+0.05*(kX<1 ? lin(t,E.red,E.x0) : lin(t,E.x1,E.neither-0.45)) : 1+0.02*lin(tt,0,E.normal);
  st.alt = loop?0: seg(t,E.guar-0.1,E.guar+0.5)*(1-seg(t,E.your-0.3,E.your+0.1));
  st.cta = loop?0: seg(t,E.your-0.2,E.your+0.35);
  return st;
}

// ---------- drawings ----------
function panelFrame(L, alpha){ const g=VW.g; g.save(); g.globalAlpha=alpha;
  g.fillStyle='rgba(10,16,30,0.55)'; VW.roundRect(L.x0-24,L.y0-28,L.x1-L.x0+150,L.y1-L.y0+56,18); g.fill();
  g.strokeStyle='rgba(120,150,210,0.14)'; g.lineWidth=1.2; g.stroke(); g.restore(); }
function wallLine(c, col, k, label, alpha=1, above=false, glow=0){ const g=VW.g, L=c.L, y=c.PY(WALL), ty=above?y-14:y+14;
  g.save(); g.globalAlpha=alpha;
  g.setLineDash(k<0.5?[10,8]:[]); g.lineWidth=3+2*k+2*glow; g.strokeStyle=k<0.5?GREY:col;
  g.shadowColor=col; g.shadowBlur=20*k+30*glow; g.beginPath(); g.moveTo(L.x0-20,y); g.lineTo(L.x1+8,y); g.stroke(); g.setLineDash([]); g.shadowBlur=0;
  g.font='700 30px VWMono'; g.textAlign='left'; g.textBaseline=above?'bottom':'top';
  const ka=clamp((k-0.5)*4,0,1), kb=clamp((0.5-k)*4,0,1);
  g.globalAlpha=alpha*kb; g.fillStyle=GREY; g.fillText('SUPPORT', L.x0, ty);
  g.globalAlpha=alpha*ka; g.fillStyle=col; g.fillText(label, L.x0, ty);
  g.restore(); }
function pnl(c, n, alpha){ if (n<=TOUCH+0.5||alpha<=0) return; const g=VW.g, L=c.L, d=Math.round((c.lastPrice(n)-WALL)*4)/4, usd=d*50, col=d>=0?COL.up:RED;
  const txt=(usd>=0?'+':'−')+'$'+Math.abs(usd).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
  g.save(); g.globalAlpha=alpha*clamp((n-TOUCH-0.5)*2,0,1); g.textAlign='left'; g.textBaseline='alphabetic';
  g.font='700 58px VWMono'; g.fillStyle=col; g.shadowColor=VW.rgba(col,0.6); g.shadowBlur=18; const y=L.y1-118; g.fillText(txt, L.x0, y);
  const w=g.measureText(txt).width; g.shadowBlur=0; g.font='600 26px VWMono'; g.fillStyle=VW.rgba(col,0.85); g.fillText((d>=0?'+':'−')+Math.abs(d).toFixed(2)+' PTS', L.x0+w+20, y-4); g.restore(); }
function stamp(c, text, col, k, above){ if (k<=0) return; const g=VW.g, L=c.L, y=c.PY(WALL)+(above?-58:58);
  g.save(); g.globalAlpha=k; g.font='700 40px VWSans'; g.textAlign='right'; g.textBaseline='middle'; g.fillStyle=col;
  g.shadowColor=VW.rgba(col,0.7); g.shadowBlur=20; const s=1.15-0.15*eo(k); g.translate(L.x1-10,y); g.scale(s,s); g.fillText(text,0,0); g.restore(); }
function tag(text, x, y, col, a, size=28){ if (a<=0) return; const g=VW.g; g.save(); g.globalAlpha=a; g.font=`700 ${size}px VWMono`;
  const w=g.measureText(text).width+40; g.fillStyle='rgba(8,12,22,0.9)'; VW.roundRect(x,y-26,w,52,12); g.fill();
  g.strokeStyle=VW.rgba(col,0.85); g.lineWidth=2; g.stroke(); g.fillStyle=col; g.textAlign='left'; g.textBaseline='middle'; g.fillText(text,x+20,y+1); g.restore(); }
function cushion(c, k){ if (k<=0) return; const g=VW.g, L=c.L, y=c.PY(WALL), h=60, xs=c.X(TOUCH)-c.bw; g.save(); g.globalAlpha=k;
  const gr=g.createLinearGradient(0,y,0,y+h); gr.addColorStop(0,VW.rgba(RED,0.24)); gr.addColorStop(1,VW.rgba(RED,0)); g.fillStyle=gr; g.fillRect(xs,y,L.x1-xs+8,h); g.restore(); }
function streak(c, k){ if (k<=0) return; const g=VW.g, L=c.L, y=c.PY(WALL), h=c.PY(WALL-20)-y, xs=c.X(TOUCH)-c.bw; g.save(); g.globalAlpha=k;
  const gr=g.createLinearGradient(0,y,0,y+h); gr.addColorStop(0,VW.rgba(MAG,0.22)); gr.addColorStop(1,VW.rgba(MAG,0)); g.fillStyle=gr; g.fillRect(xs,y,L.x1-xs+8,h); g.restore(); }
function altPath(c, dy, col, k){ if (k<=0) return; const g=VW.g, x0=c.X(TOUCH), y0=c.PY(WALL), x1=c.X(N-1);
  g.save(); g.globalAlpha=0.9*k; g.setLineDash([12,10]); g.strokeStyle=col; g.lineWidth=4;
  g.beginPath(); g.moveTo(x0,y0); g.bezierCurveTo(x0+90,y0, x0+140, c.PY(WALL+dy*0.5), mix(x0,x1,k), c.PY(WALL+dy*k)); g.stroke(); g.restore(); }
function centerText(txt, y, size, col, a, font='VWSans', weight=700){ if (a<=0) return; const g=VW.g; g.save(); g.globalAlpha=a; g.textAlign='center'; g.textBaseline='middle';
  g.font=`${weight} ${size}px ${font}`; g.fillStyle=col; g.shadowColor='rgba(0,0,0,0.95)'; g.shadowBlur=30; g.fillText(txt,SAFE.cx,y); g.restore(); }
// a sentence that rises out of a level line (clipped at the line)
function emerge(txt, c, col, k){ if (k<=0) return; const g=VW.g, L=c.L, y=c.PY(WALL), h=70;
  g.save(); g.beginPath(); g.rect(0,y-h-20,VW.W,h+20); g.clip(); g.globalAlpha=Math.min(1,k*1.4);
  g.textAlign='center'; g.textBaseline='bottom'; g.font='700 50px VWSans'; g.fillStyle=col; g.shadowColor='rgba(0,0,0,0.9)'; g.shadowBlur=24;
  g.fillText(txt,(L.x0+L.x1)/2+30, y-14+(1-eo(k))*h); g.restore(); }

// one panel: content can slide horizontally inside its frame (level-anchored swap)
function drawPanel(c, n, col, lab, above, a, slide, o){ if (a<=0.01) return; const g=VW.g, L=c.L;
  g.save(); g.globalAlpha=a;
  if (!o.noFrame){ panelFrame(L,1); c.grid(); c.axis(); }
  g.save(); g.beginPath(); g.rect(L.x0-24,L.y0-28,L.x1-L.x0+32,L.y1-L.y0+56); g.clip(); g.translate(slide,0);
  g.globalAlpha=a*o.candleA; c.volume(n,4200,L.y1-L.y0>600?120:70); c.candles(n); g.globalAlpha=a; pnl(c, n, o.candleA); g.restore();
  g.globalAlpha=a; wallLine(c, col, o.col, lab, 1, above, o.glow||0);
  g.globalAlpha=a*o.candleA; if (!slide) c.priceTag(n);
  g.restore(); }

// ---------- render ----------
function render(t){
  const g=VW.g; g.setTransform(1,0,0,1,0,0); g.globalAlpha=1; g.filter='none';
  VW.background(t);
  const st=state(t);
  setRect(cA, st.ra); setRect(cB, st.rb);
  // camera: slow push-in centred on the level of the protagonist
  const focusC = st.single ? (st.kX<0.5?cA:cB) : cA, fx=(focusC.L.x0+focusC.L.x1)/2, fy=st.single?focusC.PY(WALL):900;
  g.save(); g.translate(fx,fy); g.scale(st.push,st.push); g.translate(-fx,-fy);
  const candleA = 1-0.72*st.cta, glow = st.cta;
  if (st.single){
    const k=eio(st.kX), W0=VW.W*0.55;
    panelFrame(cA.L,1); cA.grid(); cA.axis();
    drawPanel(cA, st.nA, RED,'LONG GAMMA', false, 1-k, -k*W0, {noFrame:true, col:st.col, candleA});
    drawPanel(cB, st.nB, MAG,'SHORT GAMMA', true, k, (1-k)*W0, {noFrame:true, col:st.col, candleA});
  } else {
    drawPanel(cA, st.nA, RED,'LONG GAMMA', false, st.aA, 0, {col:st.col, candleA, glow});
    drawPanel(cB, st.nB, MAG,'SHORT GAMMA', true, st.aB, 0, {col:st.col, candleA, glow});
  }
  // hook stamps, exactly on the words
  if (t<E.normal+0.3 || t>=E.loop0){ const tt=t>=E.loop0?0:t, o=1-seg(t,E.normal,E.normal+0.3);
    stamp(cA,'HELD',COL.up,seg(tt,E.held-0.05,E.held+0.15)*o,false); stamp(cB,'BROKE',RED,seg(tt,E.breakHit,E.breakHit+0.12)*o,true); }
  // mechanism beats
  if (st.single){
    const aBuy=seg(t,E.buy-0.2,E.buy+0.3)*(1-seg(t,E.x0-0.2,E.x0+0.1));
    cushion(cA, aBuy); tag('HEDGING MAY ADD BUYING', cA.L.x0, cA.PY(WALL)+80, COL.up, aBuy);
    const aSell=seg(t,E.sell-0.2,E.sell+0.3)*(1-seg(t,E.neither-0.6,E.neither-0.3));
    streak(cB, aSell); tag('HEDGING MAY ADD SELLING', cB.L.x0, cB.PY(WALL)-170, RED, aSell);
  }
  altPath(cA, -18, RED, st.alt); altPath(cB, +9, MAG, st.alt);
  // CTA: the sentences rise out of the levels while candles recede
  if (t<E.loop0){ emerge('THE CHART SHOWS THE LEVEL.', cA, COL.ink, seg(t,E.your-0.05,E.your+0.45));
  emerge('VOLWICK SHOWS THE POSITIONING.', cB, COL.blue, seg(t,E.volwick-0.05,E.volwick+0.45)); }
  g.restore();
  centerText('NEITHER LEVEL IS GUARANTEED.', 962, 44, COL.ink, st.alt, 'VWMono');
  { const kL=seg(t,E.red-0.2,E.red+0.25)*(1-seg(t,E.x0,E.x0+0.3)), kS=seg(t,E.x1-0.2,E.x1+0.2)*(1-seg(t,E.neither-0.5,E.neither-0.3));
    centerText('LONG GAMMA HEDGING', 214, 44, COL.ink, kL); centerText('CAN DAMPEN MOVES', 270, 44, COL.up, kL);
    centerText('SHORT GAMMA HEDGING', 214, 44, COL.ink, kS); centerText('CAN AMPLIFY MOVES', 270, 44, RED, kS); }
  VW.vignette(); VW.topBand(250);
  const endK=seg(t,E.logo0,E.logo0+0.5)*(1-seg(t,E.loop0,E.total-0.15));
  VW.logoTL(1-endK, 'ES', 60, 30, true);
  // hook text
  const tt=t>=E.loop0?0:t, hOut=1-seg(tt,E.why-0.15,E.why);
  centerText('ONE LEVEL HELD.', 272, 62, COL.up, eo(lin(tt,-0.3,0.0))*hOut);
  centerText('THE OTHER BROKE.', 356, 62, RED, eo(lin(tt,E.breakHit-0.02,E.breakHit+0.12))*hOut);
  if (t<E.loop0){ const k=eo(lin(t,E.why,E.why+0.18))*(1-seg(t,E.same,E.same+0.3)); if (k>0){ g.save(); g.translate(SAFE.cx,320); const s=1.2-0.2*k; g.scale(s,s); g.translate(-SAFE.cx,-320); centerText('WHY?', 320, 120, COL.ink, k); g.restore(); } }
  VW.captions(t, GROUPS, {y:1650, size:70, keySize:84, keys:new Map([['Red',RED],['Magenta',MAG],['buy',COL.up],['sell',RED],['guarantee.',COL.ink],['dealer',COL.blue],['walls:',COL.blue]]), until:E.your-0.15});
  // close: the two level lines fold into the logo (fast)
  if (t>E.logo0){ const yA=cA.PY(WALL), pts=[]; for (let i=0;i<N;i++) pts.push([mix(cA.L.x0,cA.L.x1,i/(N-1)), yA]);
    VW.logoForm((t-E.logo0)*1.45, pts, {fadeOut: seg(t,E.loop0,E.total-0.15), noUrl:true}); 
    const out=1-seg(t,E.loop0,E.total-0.15), k=eo(lin(t,E.dv-0.05,E.dv+0.3))*out;
    if (k>0){ g.save(); g.globalAlpha=k; g.textAlign='center'; g.textBaseline='middle'; g.font='700 36px VWMono'; g.letterSpacing='5px';
      g.fillStyle=COL.blue; g.shadowColor='rgba(90,140,255,0.8)'; g.shadowBlur=18; g.fillText('DISCOVER VOLWICK →',543,1392+(1-k)*10); g.restore(); }
    const kd=eo(lin(t,E.dv+0.3,E.dv+0.7))*out;
    if (kd>0){ g.save(); g.globalAlpha=kd; g.textAlign='center'; g.textBaseline='middle'; g.font='500 21px VWMono'; g.letterSpacing='2px'; g.fillStyle=COL.ink3; g.fillText('Hypothetical results. Not investment advice.',540,1470); g.restore(); } }
  VW.guides();
}
window.render=render;
window.READY=(async()=>{
  const q=new URLSearchParams(location.search);
  WORDS=await (await fetch(q.get('words')||'words.json')).json();
  GROUPS=VW.buildGroups(WORDS.filter(w=>w[1]>W('collapsed',1,'e')+0.2));
  buildTimeline(); await VW.loadFonts(); await VW.loadBrand(); render(0);
  return {...window.DATA_CHECK, total:S.total, events:E};
})();
