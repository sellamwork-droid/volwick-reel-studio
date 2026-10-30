// ============================================================
// Scene P01 · BEYOND THE CHART · "Price just made a new high. The buyers didn't."
// Concept: price vs CVD divergence, with its limit (no guaranteed reversal).
// All data is SIMULATED and labelled as such. Events are anchored to spoken words.
// ============================================================
const S = {};
const {COL, SAFE, seg, lin, eo, eio, mix, clamp} = VW;

// ---------- simulated ES 1m session ----------
const N=64, P1=44;
const bars = VW.simSession({
  seed: 20261023, start: 7641.25, n: N,
  target: i => i<P1
    ? (i<=36 ? 7641.25+(7676-7641.25)*Math.pow(i/36,0.9)+Math.sin(i*0.9)*1.4 : 7676-(i-36)*1.7)
    : (i<=58 ? 7664+(7682.5-7664)*((i-P1)/14)+Math.sin((i-P1)*1.3)*0.9 : 7682.5-(i-58)*1.1),
  vol: (i,body,R) => i<P1 ? Math.round(1800+R()*1400+body*260) : Math.round(1500+R()*900+body*160),
  // phase 1: buyers lift the offer; phase 2: price drifts up while aggressive buying fades
  delta: (i,ret,gauss) => i<P1 ? ret*210+gauss()*160+90 : (i>58 ? -260+gauss()*120 : ret*40-170+gauss()*120)
});
const H1 = VW.argmax(bars,28,43,b=>b.h), H2 = VW.argmax(bars,48,63,b=>b.h);
window.DATA_CHECK = {H1,H2, priceHigherHigh: bars[H2].h>bars[H1].h, cvdLowerHigh: bars[H2].cvd<bars[H1].cvd,
  h1:bars[H1].h, h2:bars[H2].h, c1:bars[H1].cvd, c2:bars[H2].cvd};

// ---------- layout: essentials inside the safe zone (x 120-888, y 290-1248) ----------
// v6: no floor or reflection. The chart fills the frame down to y 1440, captions sit under it.
const chart = new VW.Chart(bars, {x0:132, x1:760, y0:400, y1:1000, pMin:7636, pMax:7690, cvd:{y0:1080, y1:1380}});
const SX=VW.SAFE.cx, SY=870;

// ---------- word anchors ----------
let WORDS=[], GROUPS=[];
function W(word, nth=1, edge='s'){ let c=0; for (const w of WORDS){ if (w[0].replace(/[^\w]/g,'').toLowerCase()===word.replace(/[^\w]/g,'').toLowerCase()){ if (++c===nth) return edge==='s'?w[1]:w[2]; } } throw new Error('word not found: '+word+' #'+nth); }
let E={};
function buildTimeline(){
  E.hookPrice  = -0.25;   // v11: the hook is already on screen at frame 0
  E.hookBuyers = W('Net',1)-0.05;
  E.rw0 = W('didnt',1,'e')+0.12; E.rw1 = E.rw0+0.45;
  E.highEnd = W('high',1,'e'); E.didnt = W('didnt',1,'e');
  E.watch = W('Watch'); E.cvdWord = W('CVD',1); E.buy = W('buy'); E.sell = W('sell');
  E.b0 = W('Price',2); E.b1 = W('higher',1,'e');
  E.c0 = W('CVD',2); E.c1 = W('high',2,'e');
  E.lines = W('Price',3); E.div = W('divergence'); E.guar = W('guarantee'); E.going = W('going',1,'e');
  E.closer = W('closer'); E.volwick = W('Volwick'); E.flow = W('flow'); E.dealer = W('dealer');
  E.more = W('much'); E.end = W('trader',1,'e'); E.logo0 = E.end+0.05; E.beat = E.logo0+1.5; E.loop0 = E.logo0+4.4; E.total = E.loop0+0.6;
  S.total = E.total;
  S.CAM = [
    {t:0,                s:0.92, fx:540, fy:648},
    {t:E.rw0,            s:0.94, fx:540, fy:654},
    {t:E.rw1,            s:1.00, fx:470, fy:896},
    {t:E.cvdWord-0.2,    s:1.00, fx:470, fy:922},
    {t:E.cvdWord+0.5,    s:1.22, fx:420, fy:1180},
    {t:E.b0-0.3,         s:1.22, fx:430, fy:1180},
    {t:E.b0+0.3,         s:1.00, fx:470, fy:896},
    {t:E.lines,          s:1.06, fx:560, fy:860},
    {t:E.div,            s:1.12, fx:600, fy:820},
    {t:E.guar,           s:1.06, fx:600, fy:857},
    {t:E.closer+0.2,     s:1.14, fx:610, fy:830},
    {t:E.volwick+0.4,    s:1.00, fx:470, fy:896},
    {t:E.flow+0.35,      s:1.28, fx:620, fy:560},   // v11: push to the block prints
    {t:E.dealer+0.35,    s:1.10, fx:520, fy:640},   // then the two dealer walls
    {t:E.more+0.35,      s:1.00, fx:470, fy:896},   // then the whole terminal bar
    {t:E.end,            s:1.07, fx:520, fy:860},   // slow push while the last line lands
    {t:E.loop0-0.05,     s:1.00, fx:470, fy:896},
    {t:E.loop0,          s:0.92, fx:540, fy:648},   // under the ending: back to the opening shot (loop)
    {t:E.total,          s:0.92, fx:540, fy:648}];
  S.PUNCH = [E.hookBuyers, E.cvdWord, E.b0, E.c0, E.div, E.guar, E.volwick];
}

// ---------- story state as a function of real time ----------
function state(t){
  const st = {};
  const loop = t>=E.loop0;                          // last frames = first frame, for a seamless replay
  const OPEN=H2-3;                                     // cold open starts a few bars before the new high
  if (t<E.rw0 || loop){
    const tt = loop ? 0 : t;
    // the move happens on screen: price prints the new high, then CVD fails to follow
    st.n = mix(OPEN, N, eo(lin(tt, 0, E.highEnd+0.2)));
    st.c = mix(OPEN, N, eo(lin(tt, E.hookBuyers-0.25, E.didnt+0.05)));
    const tH = (H2+1-OPEN)/(N-OPEN);                   // fraction at which the high bar exists
    st.kp = seg(tt, (E.highEnd+0.2)*Math.pow(tH,1/3)*0.55, E.highEnd+0.15);
    st.kc = seg(tt, E.hookBuyers+0.05, E.didnt+0.1);
    st.zone = 0.6*st.kc; st.alpha=1;
  }
  else if (t<E.rw1){ const k=eio(lin(t,E.rw0,E.rw1)); st.n=mix(N,P1,k); st.c=mix(N,P1,k); st.kp=1-k; st.kc=1-k; st.zone=0.6*(1-k); st.alpha=1; }
  else {
    st.n = P1 + (N-P1)*lin(t,E.b0,E.b1);
    st.c = P1 + (N-P1)*lin(t,E.c0,E.c1);
    st.kp = seg(t,E.lines,E.lines+0.7); st.kc = seg(t,E.lines+0.5,E.lines+1.2);
    st.zone = seg(t,E.div-0.1,E.div+0.4,eo)*(1-seg(t,E.volwick,E.volwick+0.6));
    st.alpha = 1-seg(t,E.volwick,E.volwick+0.6);
  }
  st.fork = loop?0: seg(t,E.guar,E.guar+0.9)*(1-seg(t,E.volwick,E.volwick+0.6));
  st.bar = loop?0: seg(t,E.volwick,E.volwick+0.7,eo);
  st.prints = loop?0: 1; st.walls = loop?0:1;
  return st;
}

// ---------- scene-specific drawings ----------
function divergenceLines(kp, kc, alpha=1){
  if ((kp<=0&&kc<=0)||alpha<=0) return; VW.g.save(); VW.g.globalAlpha=alpha;
  const ax=chart.X(H1), ay=chart.PY(bars[H1].h)-16, bx=chart.X(H2), by=chart.PY(bars[H2].h)-16;
  const cx=chart.X(H1), cy=chart.CY(bars[H1].cvd)-12, dx=chart.X(H2), dy=chart.CY(bars[H2].cvd)-12;
  chart.trendLine(ax,ay,bx,by,COL.ink, kp, '▲ HIGHER HIGH', {x:bx+12,y:by-20});
  chart.trendLine(cx,cy,dx,dy,COL.warn, kc, '▼ LOWER HIGH', {x:dx-10,y:dy+26,base:'top'});
  VW.g.restore();
}
// The limit, drawn: from the last price two illustrative paths; neither is implied by the divergence.
function fork(k){
  if (k<=0) return; const g=VW.g, x0=chart.X(N-1), y0=chart.PY(bars[N-1].c), L=chart.L;
  const paths=[{dy:-105, col:COL.ink, lab:'CONTINUE'}, {dy:+105, col:COL.ink, lab:'REVERSE'}];
  g.save();
  paths.forEach((p,j)=>{ const kk=clamp(k*1.4,0,1); if (kk<=0) return;
    g.globalAlpha=0.9*kk; g.setLineDash([10,10]); g.strokeStyle=p.col; g.lineWidth=4;
    const ex=x0+70*kk+20, ey=y0+p.dy*kk;
    g.beginPath(); g.moveTo(x0,y0); g.bezierCurveTo(x0+30,y0,x0+40,y0+p.dy*0.6*kk,ex,ey); g.stroke(); g.setLineDash([]);
    g.font='700 22px VWMono'; g.fillStyle=p.col; g.textAlign='left'; g.textBaseline='middle'; g.fillText((j?'▼ ':'▲ ')+p.lab, ex+10, ey); });
  g.restore();
}
const WALLS=[{p:7687.25,col:COL.callL,lab:'7,687.25 · +$15.3M'},{p:7657.25,col:COL.putS,lab:'7,657.25 · −$11.8M'}];
const PRINTS=[{i:50,q:507},{i:55,q:858},{i:60,q:644}].map(p=>({...p,p:Math.round(((bars[p.i].h+bars[p.i].l)/2)/0.25)*0.25}));

// ---------- render ----------
function render(t){
  const g=VW.g; g.setTransform(1,0,0,1,0,0); g.globalAlpha=1; g.filter='none';
  VW.background(t);
  const st=state(t), cam0=VW.camAtLoom(S.CAM,t,0.03), ph=2*Math.PI*t/S.total;
  // v11 focus: one protagonist at a time (0 = sharp, 1 = dimmed + defocused)
  const fz=(a,b)=>seg(t,a-0.35,a)*(1-seg(t,b,b+0.35));
  const fP=Math.max(fz(E.watch+0.2,E.b0-0.35)), fC=Math.max(fz(E.b0-0.1,E.c0-0.2), fz(E.volwick+0.2,E.logo0+1));
  const cam={s:cam0.s*(1+0.008*Math.sin(ph)), fx:cam0.fx+6*Math.sin(ph*2), fy:cam0.fy+4*Math.sin(ph*3)};
  const sp=cam.s*(1+0.05*VW.punch(S.PUNCH,t));
  g.save(); g.translate(SX,SY); g.scale(sp*0.94,sp*0.94); g.translate(-cam.fx*0.97,-cam.fy); chart.grid(); g.restore();   // parallax: grid moves less than data
  g.save(); g.translate(SX,SY); g.scale(sp,sp); g.translate(-cam.fx,-cam.fy);
  VW.focusBegin(fP);
  chart.axis();
  chart.zone(H1,H2,st.zone, 1+0.6*Math.exp(-Math.pow((t-E.div)*3,2)));
  chart.volume(st.n,4200,110);
  WALLS.forEach((w,j)=>chart.wall(w.p,w.col,w.lab, st.walls*seg(t,E.dealer+j*0.22,E.dealer+0.9+j*0.22,eo)));
  chart.candles(st.n);
  PRINTS.forEach((p,j)=>chart.print(p.i,p.p,p.q, st.prints*lin(t,E.flow+j*0.18,E.flow+j*0.18+0.6)));
  chart.priceTag(st.n);
  VW.focusEnd();
  VW.focusBegin(fC, t>E.volwick ? 0.9 : 0.62, t>E.volwick ? 4.5 : 3.2);
  chart.cvdPane(st.c, 1, {labelX:440, sub: t>E.watch-0.3 && t<E.b0});
  chart.deltaHighlight(P1, seg(t,E.buy-0.05,E.buy+0.2)*(1-seg(t,E.b0-0.3,E.b0)), seg(t,E.sell-0.05,E.sell+0.2)*(1-seg(t,E.b0-0.3,E.b0)));
  { const ga=seg(t,E.buy-0.6,E.buy-0.2)*(1-seg(t,E.b0-0.4,E.b0)); if (ga>0){ g.save(); g.globalAlpha=ga; g.font='600 26px VWMono'; g.fillStyle=COL.ink2; g.textAlign='left'; g.textBaseline='top';
    g.fillText('AGGRESSIVE = MARKET ORDER', chart.L.x0+6, chart.L.cvd.y1+46); g.fillText('HITTING THE BID OR THE ASK', chart.L.x0+6, chart.L.cvd.y1+80); g.restore(); } }
  VW.focusEnd();
  divergenceLines(st.kp, st.kc, st.alpha*(1-0.65*st.fork));
  fork(st.fork);
  g.restore();
  VW.vignette(); VW.topBand(390);
  const endK = seg(t,E.logo0,E.logo0+0.6)*(1-seg(t,E.loop0,E.total-0.15));
  VW.logoTL(1-endK, 'ES · 1m');
  VW.commandBar(t, st.bar, 236, [['ES',COL.ink,E.volwick],['WALLS',COL.callL,E.dealer],['BLOCK PRINTS',COL.gold,E.flow],['CVD',COL.up,E.volwick+0.2],['CDI',COL.blue,E.more],['FLOW',COL.callS,E.more+0.15],['MAPS',COL.warn,E.more+0.3]]);
  VW.hook(t, [{text:'PRICE ▲', colour:COL.ink, t0:E.hookPrice, y:440, size:100},{text:'NET BUYING ▼', colour:COL.warn, t0:E.hookBuyers, y:555, size:100}], E.rw0-0.1);
  if (t>=E.loop0) VW.hook(t, [{text:'PRICE ▲', colour:COL.ink, t0:E.loop0+0.1, y:440, size:100}], 1e9);   // loop: last frame = first frame, hook included
  VW.rewind(t,E.rw0,E.rw1);
  if (st.fork>0){ g.save(); g.globalAlpha=st.fork; g.font='700 40px VWMono'; g.fillStyle=COL.ink; g.textAlign='center'; g.textBaseline='middle'; g.shadowColor='rgba(0,0,0,0.9)'; g.shadowBlur=18; g.fillText('BOTH ARE POSSIBLE.', SAFE.cx, 1062); g.restore(); }
  VW.captions(t, GROUPS, {y:1560, size:70, keySize:84, keys:new Map([['CVD,',COL.cvd],['CVD',COL.cvd],['divergence.',COL.warn],['reversal.',COL.ink],['signal.',COL.ink],['Volwick',COL.blue],['behind',COL.blue],['institutional',COL.blue],['buy',COL.up],['sell',COL.dn],['high.',COL.ink],['didn\'t.',COL.warn]]), until:E.end+0.1});
  VW.flash(VW.punch(S.PUNCH,t));
  if (t>E.logo0){ const cam=VW.camAt(S.CAM,E.logo0), sp0=cam.s; const pts=[]; for (let i=0;i<N;i++) pts.push([SX+(chart.X(i)-cam.fx)*sp0, SY+(chart.PY(bars[i].c)-cam.fy)*sp0]);
    VW.logoForm(t-E.logo0, pts, {fadeOut: seg(t,E.loop0,E.total-0.15)}); }
  VW.guides();
}
window.render = render;
window.READY = (async () => {
  const q = new URLSearchParams(location.search);
  WORDS = await (await fetch(q.get('words')||'words.json')).json();
  GROUPS = VW.buildGroups(WORDS.filter(w=>w[1]>(W('didnt',1,'e')+0.2)));   // the hook is written large, no captions during it
  buildTimeline();
  await VW.loadFonts(); await VW.loadBrand();
  render(0); return {...window.DATA_CHECK, total:S.total, events:E};
})();
