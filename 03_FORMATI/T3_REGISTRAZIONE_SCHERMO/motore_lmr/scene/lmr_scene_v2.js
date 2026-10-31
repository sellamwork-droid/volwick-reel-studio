// ============================================================
// VOLWICK · LIVE MARKET REACTIONS · reel scene v2 (payoff first, rewind, replay, payoff)
// Grammar of the approved AI videos (P01/P02, CE_14): the phenomenon on frame 0, rewind,
// one protagonist at a time, one number at a time, text that lands on the beat, logo from the lines.
// Every number comes from project.json (pixels of the real terminal). Nothing is invented here.
// ============================================================
const {COL, seg, lin, eo, eio, mix, clamp} = VW;
let P = null, IMG = {}, E = {};
const GOLD = '#F2C14E', WALLC = {red:'#E2575F', green:'#39A86F', cyan:'#49B7CC', magenta:'#C04BD8'};
const fmt = (p, d=2) => p.toLocaleString('en-US', {minimumFractionDigits:d, maximumFractionDigits:d});
const hm = m => { m = Math.floor(m); return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0'); };

// ---------- time remap (may go backwards during the rewind) ----------
function minuteAt(t){ const K=P.timeline.remap; if (t<=K[0][0]) return K[0][1];
  for (let i=0;i<K.length-1;i++){ const [a0,m0]=K[i],[a1,m1]=K[i+1]; if (t<=a1){ const u=(t-a0)/(a1-a0); return m0+(m1-m0)*(m1<m0?eio(u):u); } } return K[K.length-1][1]; }
function speedAt(t){ const K=P.timeline.remap;
  for (let i=0;i<K.length-1;i++){ const [a0,m0]=K[i],[a1,m1]=K[i+1]; if (t>=a0 && t<a1) return (m1-m0)*60/(a1-a0); } return 0; }

// ---------- geometry ----------
const R = () => P.layout.chart;
function camAt(t){ const C=P.timeline.camera; if (t<=C[0].t) return C[0].s;
  for (let i=0;i<C.length-1;i++){ const a=C[i],b=C[i+1]; if (t<=b.t) return mix(a.s,b.s,eio((t-a.t)/(b.t-a.t))); } return C[C.length-1].s; }
// the camera follows the price: the focus is the candle being drawn, at the height of the wall
function focusAt(t){ const f=P.layout.focus, m=clamp(minuteAt(t), P.book.minute_et, P.timeline.end_minute_et);
  return {x: clamp(xOfLocal(toLocal(m-1)+0.5), 0, P.crop.w-P.layout.axis_w), y: f.y}; }
function toScreen(xc, yc, t){ const r=R(), s0=r.w/P.crop.w, s=camAt(t), f=focusAt(t);
  const fx=r.x+f.x*s0, fy=r.y+f.y*s0; return [fx+(r.x+xc*s0-fx)*s, fy+(r.y+yc*s0-fy)*s]; }
const xOfLocal = m => (m - P.map.tb)/P.map.ta - P.crop.x0;
const yOfPrice = p => (p - P.map.pb)/P.map.pa - P.crop.y0;
const toLocal = mEt => mEt + P.session.local_minus_et_min;
const bar = m => P.barsByEt[m];

// ---------- chart: context dimmed and soft, candles sharp (one protagonist) ----------
function drawChart(t, dimK){
  const g=VW.g, r=R(), s0=r.w/P.crop.w, s=camAt(t);
  const [ox,oy]=toScreen(0,0,t), sw=P.crop.w*s0*s, sh=P.crop.h*s0*s;
  g.save(); g.beginPath(); g.rect(r.x,r.y,r.w,r.h); g.clip(); g.imageSmoothingQuality='high';
  g.save(); g.globalAlpha=0.55; g.filter='blur(1.4px)'; g.drawImage(IMG.base, ox, oy, sw, sh); g.restore();
  // the walls exist on screen only from the book time on
  const xb=xOfLocal(toLocal(P.book.minute_et)); g.fillStyle='rgba(5,8,14,0.97)';
  for (const w of P.walls){ const y=yOfPrice(w.level); const [, a]=toScreen(0,y-8,t), [bx, b]=toScreen(xb,y+8,t); g.fillRect(ox, a, Math.max(0,bx-ox), b-a); }
  const m=minuteAt(t), done=Math.floor(m)-1, xr=xOfLocal(toLocal(done)+0.5), cw=clamp(xr,0,P.crop.w);
  if (cw>0){ g.save(); g.globalAlpha=1-0.55*dimK; g.drawImage(IMG.candles, 0, 0, cw, P.crop.h, ox, oy, cw*s0*s, sh); g.restore(); }
  g.restore();
  // soft edges so the chart floats in the navy
  const fe=g.createLinearGradient(0,r.y,0,r.y+r.h); fe.addColorStop(0,'rgba(5,8,14,0.9)'); fe.addColorStop(0.07,'rgba(5,8,14,0)'); fe.addColorStop(0.93,'rgba(5,8,14,0)'); fe.addColorStop(1,'rgba(5,8,14,0.9)');
  g.fillStyle=fe; g.fillRect(r.x,r.y,r.w,r.h);
  return {done, xr};
}

function drawWall(t, st){
  const g=VW.g, r=R(), w=P.focus_wall, y=yOfPrice(w.level), col=WALLC[w.family]||COL.ink;
  const xb=xOfLocal(toLocal(P.book.minute_et));
  const [x0s, ys]=toScreen(xb,y,t), [x1s]=toScreen(P.crop.w-P.layout.axis_w,y,t);
  const hit=Math.exp(-Math.pow((t-E.touch)/0.25,2)) + Math.exp(-Math.pow((t-0.02)/0.3,2));
  g.save(); g.beginPath(); g.rect(r.x,r.y,r.w,r.h); g.clip();
  g.strokeStyle=col; g.lineWidth=4+5*hit; g.shadowColor=col; g.shadowBlur=22+50*hit;
  g.beginPath(); g.moveTo(x0s,ys); g.lineTo(x1s,ys); g.stroke();
  // impact ring where price meets the wall
  if (hit>0.02){ const [hx]=toScreen(xOfLocal(toLocal(P.story.reach_minute_et)),y,t);
    g.globalAlpha=Math.min(1,hit); g.lineWidth=3; g.beginPath(); g.arc(hx,ys,18+60*(1-Math.min(1,hit)),0,Math.PI*2); g.stroke(); }
  g.restore();
  // the band: how far price moved from the wall after reaching it (drawn as the replay advances)
  const ba=seg(t,E.after0,E.after0+0.3)*(1-seg(t,E.logo0-0.1,E.logo0+0.3));
  if (ba>0){ const L=w.level, u=P.story.max_above_after, d=P.story.max_below_after;
    const xa=xOfLocal(toLocal(P.story.reach_minute_et)-0.5), xe=Math.min(st.xr, xOfLocal(toLocal(P.story.end_minute_et)+0.5));
    if (xe>xa){ const [sx0, sy0]=toScreen(xa, yOfPrice(L+u), t), [sx1, sy1]=toScreen(xe, yOfPrice(L-d), t);
      g.save(); g.beginPath(); g.rect(r.x,r.y,r.w,r.h); g.clip(); g.globalAlpha=ba; g.fillStyle='rgba(242,193,78,0.16)'; g.fillRect(sx0,sy0,sx1-sx0,sy1-sy0);
      g.strokeStyle='rgba(242,193,78,0.9)'; g.lineWidth=2; g.setLineDash([8,6]); g.beginPath(); g.moveTo(sx0,sy0); g.lineTo(sx1,sy0); g.moveTo(sx0,sy1); g.lineTo(sx1,sy1); g.stroke(); g.restore(); } }
  // wall label: big and short
  const la=1-seg(t,E.logo0-0.2,E.logo0+0.2);
  g.save(); g.globalAlpha=la; g.textAlign='left'; g.textBaseline='alphabetic'; g.shadowColor='rgba(0,0,0,0.95)'; g.shadowBlur=18;
  const lx=r.x+48, ly=clamp(ys-30, r.y+110, r.y+r.h-20);
  g.font='700 28px VWMono'; g.letterSpacing='4px'; g.fillStyle=col; g.fillText('DEALER WALL', lx, ly-62);
  g.font='700 64px VWMono'; g.letterSpacing='0px'; g.fillStyle=COL.ink; g.fillText(fmt(w.level), lx, ly);
  g.restore();
}

function drawPrice(t, st){
  const b=bar(st.done); if (!b) return; const g=VW.g, r=R();
  const y=yOfPrice(b.close), [xs, ys]=toScreen(st.xr-0.5, y, t);
  g.save(); g.beginPath(); g.rect(r.x,r.y,r.w,r.h); g.clip();
  g.strokeStyle=GOLD; g.globalAlpha=0.7; g.setLineDash([6,6]); g.lineWidth=2; g.beginPath(); g.moveTo(xs+8,ys); g.lineTo(r.x+r.w-170,ys); g.stroke(); g.setLineDash([]);
  g.globalAlpha=1; g.fillStyle=GOLD; g.shadowColor=GOLD; g.shadowBlur=20; g.beginPath(); g.arc(xs+2,ys,8,0,Math.PI*2); g.fill(); g.restore();
  g.save(); const tw=164, th=46, tx=r.x+r.w-tw-8, ty=clamp(ys-th/2, r.y+6, r.y+r.h-th-6);
  g.fillStyle=GOLD; VW.roundRect(tx,ty,tw,th,8); g.fill(); g.font='700 30px VWMono'; g.fillStyle='#0B0E14'; g.textAlign='center'; g.textBaseline='middle'; g.fillText(fmt(b.close), tx+tw/2, ty+th/2+1); g.restore();
}

// ---------- top zone: hook, then one big number at a time ----------
function drawHook(t){
  const g=VW.g, k=1-seg(t,E.hookOut,E.hookOut+0.25); if (k<=0) return;
  const L=P.texts.hook;
  g.save(); g.textAlign='center'; g.textBaseline='alphabetic'; g.shadowColor='rgba(0,0,0,0.95)'; g.shadowBlur=34;
  L.forEach((line,i)=>{ const a = i===0 ? 1 : Math.max(eo(lin(t,0.55,0.75)), t<0.001?1:0);   // line 2 lands after the hit; it is also on the loop frame
    g.globalAlpha=a*k; g.font='700 84px VWSans'; g.fillStyle=i===1?GOLD:COL.ink;
    g.save(); g.translate(540, 330+i*100); const sc=1.1-0.1*a; g.scale(sc,sc); g.fillText(line,0,0); g.restore(); });
  g.restore();
}
function drawCounter(t, st){
  const g=VW.g, a=seg(t,E.reveal0+0.05,E.reveal0+0.3)*(1-seg(t,E.payoff0-0.2,E.payoff0+0.1)); if (a<=0) return;
  const b=bar(st.done); if (!b) return; const L=P.focus_wall.level, d=b.close-L, near=Math.abs(d)<=1;
  g.save(); g.globalAlpha=a; g.textAlign='center'; g.textBaseline='alphabetic'; g.shadowColor='rgba(0,0,0,0.9)'; g.shadowBlur=24;
  g.font='700 168px VWMono'; g.fillStyle=near?GOLD:COL.ink; g.fillText(fmt(Math.abs(d)), 540, 410);
  g.font='700 30px VWMono'; g.letterSpacing='5px'; g.fillStyle=near?GOLD:COL.ink2;
  g.fillText(near ? 'POINTS · AT THE WALL' : (d<0 ? 'POINTS BELOW THE WALL' : 'POINTS ABOVE THE WALL'), 543, 462);
  g.restore();
}
function drawPayoff(t){
  const g=VW.g, a=seg(t,E.payoff0,E.payoff0+0.3)*(1-seg(t,E.logo0-0.15,E.logo0+0.2)); if (a<=0) return;
  const S=P.story, pop=eo(lin(t,E.payoff0,E.payoff0+0.35));
  g.save(); g.globalAlpha=a; g.textAlign='center'; g.textBaseline='alphabetic'; g.shadowColor='rgba(0,0,0,0.9)'; g.shadowBlur=30;
  g.font='700 30px VWMono'; g.letterSpacing='5px'; g.fillStyle=COL.ink2; g.fillText(P.texts.payoff_kicker, 543, 246);
  g.save(); g.translate(540,414); const sc=1.15-0.15*pop; g.scale(sc,sc); g.font='700 188px VWMono'; g.letterSpacing='0px'; g.fillStyle=GOLD; g.fillText(fmt(S.max_away_after),0,0); g.restore();
  g.font='700 30px VWMono'; g.letterSpacing='5px'; g.fillStyle=GOLD; g.fillText(P.texts.payoff_label, 543, 468);
  g.restore();
}

// ---------- captions under the chart, word by word ----------
function drawCaptions(t){
  const keys=new Map(P.texts.caption_keys.map(([w,c])=>[w, c==='gold'?GOLD:(WALLC[c]||c)]));
  VW.captions(t, P.captionGroups, {y:R().y+R().h+96, size:68, keySize:80, keys, until:E.logo0-0.1});
}

function drawHUD(t, st){
  const g=VW.g, r=R(), y0=r.y+r.h+160, a=seg(t,E.hookOut,E.hookOut+0.2)*(1-seg(t,E.logo0-0.2,E.logo0+0.2)); if (a<=0) return;
  const sp=speedAt(t);
  g.save(); g.globalAlpha=a; g.textAlign='left'; g.textBaseline='middle'; g.font='700 46px VWMono'; g.fillStyle=COL.ink; g.fillText(hm(st.done+1)+' ET', 72, y0+29);
  const label = sp < -1 ? '◀◀ REWIND' : (sp>1.5 ? 'REPLAY ×'+Math.round(sp) : 'SESSION CLOSED');
  g.font='700 28px VWMono'; g.letterSpacing='3px'; const bw=g.measureText(label).width+44, bx=1080-72-bw;
  g.strokeStyle=sp<-1?COL.ink2:COL.blue; g.lineWidth=2; VW.roundRect(bx,y0,bw,58,29); g.stroke(); g.fillStyle='rgba(90,140,255,0.12)'; g.fill();
  g.fillStyle=COL.ink; g.textAlign='center'; g.fillText(label, bx+bw/2+2, y0+30);
  g.restore();
}

function drawTopBar(t){
  const a=1-seg(t,E.logo0+0.2,E.logo0+0.8); if (a<=0) return;
  VW.topBand(200); VW.logoTL(a,P.session.ticker,60,30,true);
  const g=VW.g; g.save(); g.globalAlpha=a*0.9; g.textAlign='left'; g.font='600 21px VWMono'; g.letterSpacing='3px'; g.fillStyle=COL.ink3;
  g.fillText(P.texts.source_line, 64, 190); g.restore();
}

function render(t){
  const g=VW.g; const loop=t>=E.loop0; const tt=loop?0:t;
  VW.background(tt);
  const dimK=seg(tt,E.payoff0,E.payoff0+0.3);
  const st=drawChart(tt, dimK);
  drawWall(tt, st); drawPrice(tt, st);
  if (tt>=E.hookOut && tt<E.reveal0+0.05) VW.rewind(tt, E.hookOut, E.reveal0+0.05);
  drawHook(tt); drawCounter(tt, st); drawPayoff(tt);
  drawCaptions(tt); drawHUD(tt, st);
  VW.vignette(); drawTopBar(tt);
  VW.flash(Math.exp(-Math.pow((tt-E.touch)/0.08,2))*0.9);     // flash on the touch in the replay
  if (t>=E.logo0 && !loop){
    const e=t-E.logo0, fo=clamp((t-(E.loop0-0.35))/0.35,0,1);
    VW.logoForm(e, P.logoPts(), {fadeOut:fo, disclaimer:P.texts.disclaimer, noUrl:true});
    const k=eo(clamp((e-3.3)/0.45,0,1)); if (k>0){ g.save(); g.globalAlpha=k*(1-fo); g.textAlign='center'; g.font='700 40px VWMono'; g.letterSpacing='5px';
      g.fillStyle=COL.blue; g.shadowColor='rgba(90,140,255,0.8)'; g.shadowBlur=18; g.fillText('DISCOVER VOLWICK →',543,1380); g.restore();
      g.save(); g.globalAlpha=k*(1-fo); g.textAlign='center'; g.font='500 21px VWMono'; g.letterSpacing='2px'; g.fillStyle=COL.ink3; g.fillText(P.texts.disclaimer,540,1470); g.restore(); }
  }
}

(async () => {
  P = await (await fetch(new URLSearchParams(location.search).get('p') || 'project.json')).json();
  VW.assets.wm = await VW.loadImage('/08_AUTOMATION/brand/assets/wm_crop.png'); VW.assets.mono = await VW.loadImage('/08_AUTOMATION/brand/assets/mono.png');
  IMG.base = await VW.loadImage(P.layers.base); IMG.candles = await VW.loadImage(P.layers.candles);
  await VW.loadFonts();
  P.barsByEt = {}; P.bars.forEach(b=>{ if (b.ok) P.barsByEt[b.minute_et]=b; });
  E = P.timeline.events;
  // captions: phrases split on '|' (written by lmr_build.py), one short line at a time inside each window
  P.captionGroups = [];
  P.texts.captions.forEach(c => { const ch=[[]];
    c.words.forEach(w => { const parts=w.split('|'); parts.forEach((pw,i)=>{ if (i>0) ch.push([]); if (pw) ch[ch.length-1].push(pw); }); });
    const groups=ch.filter(x=>x.length), d=(c.t1-c.t0)/groups.length;
    groups.forEach((grp,k)=>{ const a=c.t0+k*d, b=a+d-0.3; P.captionGroups.push(grp.map((w,i)=>[w, a+i*0.14, b])); }); });
  // the logo is drawn from the price path that was replayed, in screen space at the start of the ending
  P.logoPts = () => { const ms=P.bars.filter(b=>b.ok && b.minute_et>=P.book.minute_et-1 && b.minute_et<=P.story.end_minute_et);
    const step=Math.max(1,Math.floor(ms.length/50)), pts=[]; for (let i=0;i<ms.length;i+=step){ const b=ms[i]; pts.push(toScreen(xOfLocal(toLocal(b.minute_et)), yOfPrice(b.close), E.logo0)); } return pts; };
  window.render = render;
  window.READY = {total:E.total, events:E, check:{bars:P.bars.length, walls:P.walls.length, focus:P.focus_wall.level}};
})();
