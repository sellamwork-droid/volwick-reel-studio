// ============================================================
// Scene P02 · BEYOND THE CHART · "Two supports. One held. One collapsed."
// Concept: long gamma wall (red, brakes) vs short gamma wall (magenta, accelerates).
// All data is SIMULATED. Events are anchored to spoken words.
// ============================================================
const S = {};
const {COL, SAFE, seg, lin, eo, eio, mix, clamp} = VW;
const MAG = '#C04BD8', RED = '#E2575F';

// ---------- two simulated ES 1m sessions, identical until the touch ----------
const N=46, TOUCH=26, WALL=7660, START=7684;
const pre = i => START-(START-WALL-0.75)*Math.pow(i/TOUCH,1.15)+Math.sin(i*0.8)*1.1;
function session(after){ return VW.simSession({ seed: 77101, start: START, n: N, target: i => i<=TOUCH ? pre(i) : after(i-TOUCH),
  vol:(i,b,R)=>Math.round(1500+R()*1200+b*300), delta:(i,ret,gs)=>ret*200+gs()*120 }); }
const A = session(k => WALL+1.2+8.5*(1-Math.exp(-k/6))+Math.sin(k*1.1)*0.8);      // red wall: soft bounce
const B = session(k => WALL-0.5-20*(1-Math.exp(-k/5))+Math.sin(k*1.3)*0.7);        // magenta wall: fast break
for (let i=TOUCH;i<N;i++){ A[i].l=Math.max(A[i].l, WALL-0.5); A[i].o=Math.max(A[i].o,A[i].l); A[i].c=Math.max(A[i].c,A[i].l); }
window.DATA_CHECK = { identicalBeforeTouch: A.slice(0,TOUCH).every((b,i)=>b.c===B[i].c),
  aEnd:A[N-1].c, bEnd:B[N-1].c, aMinAfter:Math.min(...A.slice(TOUCH).map(b=>b.l)), bMinAfter:Math.min(...B.slice(TOUCH).map(b=>b.l)) };

// ---------- layout: two stacked panels inside the safe zone ----------
const PA = {x0:132, x1:740, y0:390, y1:790, pMin:7634, pMax:7690, cvd:{y0:770,y1:770}};
const PB = {x0:132, x1:740, y0:990, y1:1390, pMin:7634, pMax:7690, cvd:{y0:1390,y1:1390}};
const cA = new VW.Chart(A, PA), cB = new VW.Chart(B, PB);

let WORDS=[], GROUPS=[];
function W(word, nth=1, edge='s'){ let c=0; for (const w of WORDS){ if (w[0].replace(/[^\w]/g,'').toLowerCase()===word.replace(/[^\w]/g,'').toLowerCase()){ if (++c===nth) return edge==='s'?w[1]:w[2]; } } throw new Error('word not found: '+word+' #'+nth); }
let E={};
function buildTimeline(){
  E.two=W('Two'); E.held=W('held'); E.coll=W('collapsed'); E.collE=W('collapsed',1,'e');
  E.normal=W('On'); E.same=W('same'); E.dealer=W('dealer');
  E.red=W('Red'); E.buy=W('buy'); E.slowE=W('it',1,'e')+0.6;
  E.mag=W('Magenta'); E.sell=W('sell'); E.speedE=W('up',1,'e');
  E.neither=W('Neither'); E.breakW=W('guarantee')-0.1; E.bounce=W('guarantee');
  E.volwick=W('Volwick'); E.colors=W('Volwick'); E.inst=W('behind');
  E.end=W('behind',1,'e')+0.45; E.logo0=E.end+0.05; E.beat=E.logo0+1.5; E.loop0=E.logo0+4.4; E.total=E.loop0+0.6;
  S.total=E.total;
  S.PUNCH=[E.held, E.coll, E.dealer, E.red, E.mag, E.neither, E.volwick];
}

// ---------- story state ----------
const OPEN=18;
function state(t){
  const st={}; const loop=t>=E.loop0;
  if (t<E.normal || loop){ const tt=loop?0:t;
    // cold open: both play from the same bar; top bounces, bottom breaks
    const k=eo(lin(tt,0.0,E.collE+0.2)); st.nA=mix(OPEN,N,k); st.nB=mix(OPEN,N,k); st.col=0; st.dimA=0; st.dimB=0; }
  else if (t<E.normal+0.45){ const k=eio(lin(t,E.normal,E.normal+0.45)); st.nA=mix(N,TOUCH+1,k); st.nB=mix(N,TOUCH+1,k); st.col=0; st.dimA=0; st.dimB=0; st.rw=1; }
  else {
    st.col=seg(t,E.dealer,E.dealer+0.6);
    st.nA = TOUCH+1+(N-TOUCH-1)*lin(t,E.red+0.3,E.slowE);
    st.nB = TOUCH+1+(N-TOUCH-1)*lin(t,E.mag+0.3,E.speedE);
    st.dimA = seg(t,E.mag-0.2,E.mag+0.3)*(1-seg(t,E.neither-0.2,E.neither+0.2));
    st.dimB = seg(t,E.red-0.2,E.red+0.3)*(1-seg(t,E.mag-0.2,E.mag+0.3));
  }
  st.alt = loop?0: seg(t,E.breakW-0.1,E.breakW+0.5)*(1-seg(t,E.volwick,E.volwick+0.4));
  st.altB = loop?0: seg(t,E.bounce-0.1,E.bounce+0.5)*(1-seg(t,E.volwick,E.volwick+0.4));
  st.fail = loop?0: seg(t,E.neither,E.neither+0.3)*(1-seg(t,E.volwick-0.2,E.volwick+0.2));
  st.legend = loop?0: seg(t,E.colors,E.colors+0.5);
  return st;
}

// ---------- drawings ----------
function panelFrame(L, alpha){ const g=VW.g; g.save(); g.globalAlpha=alpha;
  g.fillStyle='rgba(10,16,30,0.55)'; VW.roundRect(L.x0-24,L.y0-96,L.x1-L.x0+170,L.y1-L.y0+124,18); g.fill();
  g.strokeStyle='rgba(120,150,210,0.14)'; g.lineWidth=1.2; g.stroke(); g.restore(); }
function wallLine(c, col, k, label, alpha=1, above=false){ const g=VW.g, L=c.L, y=c.PY(WALL), ty=above?y-12:y+12;
  const grey='#7C889C', cc = k<1 ? (k<=0?grey:col) : col;
  g.save(); g.globalAlpha=alpha;
  // neutral support line (same look) cross-fading into the coloured wall
  g.setLineDash(k<0.5?[10,8]:[]); g.lineWidth=3+1.5*k; g.strokeStyle=k<0.5?grey:col;
  g.shadowColor=col; g.shadowBlur=18*k; g.beginPath(); g.moveTo(L.x0-20,y); g.lineTo(L.x1+8,y); g.stroke(); g.setLineDash([]); g.shadowBlur=0;
  g.font='700 27px VWMono'; g.textAlign='left'; g.textBaseline=above?'bottom':'top';
  g.globalAlpha=alpha*(1-k); g.fillStyle=grey; g.fillText('SUPPORT · 7,660.00', L.x0, ty);
  g.globalAlpha=alpha*k; g.fillStyle=col; g.fillText(label, L.x0, ty);
  g.restore(); }
function moveCounter(c, n, col, alpha){ if (n<=TOUCH+0.5||alpha<=0) return; const g=VW.g, L=c.L, p=c.lastPrice(n), d=p-WALL;
  g.save(); g.globalAlpha=alpha*clamp((n-TOUCH-0.5)*2,0,1); g.textAlign='left'; g.textBaseline='alphabetic';
  g.font='600 24px VWMono'; g.fillStyle=COL.ink3; g.fillText('FROM THE LEVEL', L.x0, L.y0-66);
  g.font='700 48px VWMono'; g.fillStyle=col; g.shadowColor=VW.rgba(col,0.6); g.shadowBlur=16;
  g.fillText((d>=0?'+':'−')+Math.abs(d).toFixed(2)+' PTS', L.x0, L.y0-16); g.restore(); }
function tag(text, x, y, col, a, size=26){ if (a<=0) return; const g=VW.g; g.save(); g.globalAlpha=a; g.font=`700 ${size}px VWMono`;
  const w=g.measureText(text).width+36; g.fillStyle='rgba(8,12,22,0.88)'; VW.roundRect(x,y-24,w,48,10); g.fill();
  g.strokeStyle=VW.rgba(col,0.8); g.lineWidth=1.6; g.stroke(); g.fillStyle=col; g.textAlign='left'; g.textBaseline='middle'; g.fillText(text,x+18,y+1); g.restore(); }
function altPath(c, from, dy, col, k){ if (k<=0) return; const g=VW.g, x0=c.X(from), y0=c.PY(WALL), x1=c.X(N-1);
  g.save(); g.globalAlpha=0.85*k; g.setLineDash([10,10]); g.strokeStyle=col; g.lineWidth=4;
  g.beginPath(); g.moveTo(x0,y0); g.bezierCurveTo(x0+80,y0, x0+120, c.PY(WALL+dy*0.5), mix(x0,x1,k), c.PY(WALL+dy*k)); g.stroke(); g.restore(); }
function legend(k){ if (k<=0) return; const g=VW.g;
  // v2: two readable rows instead of four tiny chips (no pausing to read)
  const rows=[[[RED,'#39A86F'],'LONG γ','BRAKES'],[[MAG,'#49B7CC'],'SHORT γ','ACCELERATES']];
  g.save(); const y0=790, w=768, x0=SAFE.x0; g.globalAlpha=k; g.fillStyle='rgba(8,12,22,0.95)'; VW.roundRect(x0,y0-8,w,124,16); g.fill(); g.strokeStyle='rgba(120,150,210,0.25)'; g.stroke();
  rows.forEach(([cols,lab,beh],j)=>{ const kk=clamp(k*3-j*0.8,0,1), y=y0+26+j*56; g.globalAlpha=k*kk;
    cols.forEach((c,m)=>{ g.fillStyle=c; VW.roundRect(x0+26+m*30,y-11,22,22,5); g.fill(); });
    g.font='700 30px VWMono'; g.textAlign='left'; g.textBaseline='middle'; g.fillStyle=COL.ink; g.fillText(lab,x0+100,y);
    g.fillStyle=j?MAG:COL.up; g.textAlign='right'; g.fillText(beh,x0+w-26,y); });
  g.restore(); }

// ---------- render ----------
function render(t){
  const g=VW.g; g.setTransform(1,0,0,1,0,0); g.globalAlpha=1; g.filter='none';
  VW.background(t);
  const st=state(t), ph=2*Math.PI*t/S.total, sp=1+0.012*Math.sin(ph)+0.035*VW.punch(S.PUNCH,t);
  g.save(); g.translate(540,890); g.scale(sp,sp); g.translate(-540,-890);
  [[cA,st.nA,st.dimA,RED,'LONG γ · +$14M'],[cB,st.nB,st.dimB,MAG,'SHORT γ · −$22M']].forEach(([c,n,dim,col,lab],j)=>{
    // v2: the inactive panel dims AND defocuses; the active one pushes in slightly
    const act=(1-dim)*(st.dimA+st.dimB>0.05?1:0), cy=(c.L.y0+c.L.y1)/2, ps=1+0.03*act;
    g.save(); g.translate(540,cy); g.scale(ps,ps); g.translate(-540,-cy); VW.focusBegin(dim, 0.68, 4);
    panelFrame(c.L, 1); c.grid(); c.axis(); c.volume(n,4200,70);
    wallLine(c, col, st.col, lab, 1, j===1);
    c.candles(n); c.priceTag(n);
    moveCounter(c, n, j? RED:COL.up, 1);
    VW.focusEnd(); g.restore();
  });
  // what the dealers do, only on the explanatory beats
  tag('DEALER HEDGE: BUYING', PA.x0+300, cA.PY(7651), COL.up, seg(t,E.buy-0.1,E.buy+0.3)*(1-seg(t,E.mag-0.3,E.mag)));
  tag('DEALER HEDGE: SELLING', PB.x0, PB.y1-40, RED, seg(t,E.sell-0.1,E.sell+0.3)*(1-seg(t,E.neither-0.3,E.neither)));
  { const a=seg(t,E.speedE-1.2,E.speedE-0.8)*(1-seg(t,E.neither-0.3,E.neither)); if (a>0){ g.save(); g.globalAlpha=a; g.font='600 24px VWMono'; g.fillStyle=MAG; g.textAlign='right'; g.textBaseline='middle';
    g.fillText('“Accelerative, breakdowns', PB.x1+120, PB.y0-70); g.fillText('below can run fast”', PB.x1+120, PB.y0-38); g.restore(); } }
  altPath(cA, TOUCH, -18, RED, st.alt); altPath(cB, TOUCH, +9, MAG, st.altB);
  g.restore();
  if (st.fail>0){ g.save(); g.globalAlpha=st.fail; g.font='700 44px VWMono'; g.fillStyle=COL.ink; g.textAlign='center'; g.textBaseline='middle'; g.shadowColor='rgba(0,0,0,0.9)'; g.shadowBlur=18; g.fillText('BOTH CAN FAIL.', SAFE.cx, 846); g.restore(); }
  legend(st.legend);
  VW.vignette(); VW.topBand(250);
  const endK = seg(t,E.logo0,E.logo0+0.6)*(1-seg(t,E.loop0,E.total-0.15));
  VW.logoTL(1-endK, 'ES · 1m');
  // hook: the two outcomes written large over their panels
  const hOut=1-seg(t,E.normal-0.2,E.normal+0.1);
  if (hOut>0){ g.save(); g.textAlign='center'; g.textBaseline='middle'; g.shadowColor='rgba(0,0,0,0.95)'; g.shadowBlur=30;
    [[ 'TWO SUPPORTS.', -0.3, 220, COL.ink, 72],['ONE HELD.', E.held, 520, COL.up, 96],['ONE COLLAPSED.', E.coll, 1120, RED, 96]].forEach(([tx,t0,y,col,sz])=>{
      const k=eo(lin(t,t0-0.05,t0+0.15)); if (k<=0) return; g.globalAlpha=k*hOut; g.font=`700 ${sz}px VWSans`; g.fillStyle=col;
      g.save(); g.translate(SAFE.cx,y); g.scale(1.2-0.2*k,1.2-0.2*k); g.fillText(tx,0,0); g.restore(); });
    g.restore(); }
  if (t>=E.loop0){ const k=eo(lin(t,E.loop0+0.1,E.loop0+0.3)); g.save(); g.globalAlpha=k; g.textAlign='center'; g.textBaseline='middle'; g.shadowColor='rgba(0,0,0,0.95)'; g.shadowBlur=30; g.font='700 72px VWSans'; g.fillStyle=COL.ink; g.fillText('TWO SUPPORTS.', SAFE.cx, 220); g.restore(); }
  VW.rewind(t, E.normal, E.normal+0.45);
  VW.captions(t, GROUPS, {y:1560, size:70, keySize:84, keys:new Map([['Red',RED],['Magenta',MAG],['buy',COL.up],['sell,',RED],['guarantee.',COL.ink],['Volwick',COL.blue],['behind',COL.blue],['line.',COL.ink],['held.',COL.up],['collapsed.',RED]]), until:E.end+0.1});
  VW.flash(VW.punch(S.PUNCH,t));
  if (t>E.logo0){ const pts=[]; for (let i=0;i<N;i++) pts.push([cA.X(i), cA.PY(A[i].c)]);
    VW.logoForm(t-E.logo0, pts, {fadeOut: seg(t,E.loop0,E.total-0.15)}); }
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
