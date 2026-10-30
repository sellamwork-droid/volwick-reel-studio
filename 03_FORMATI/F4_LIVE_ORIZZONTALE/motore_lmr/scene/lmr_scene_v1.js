// ============================================================
// VOLWICK · LIVE MARKET REACTIONS · reel scene (replay of a recorded terminal chart)
// Every frame is a pure function of time. All numbers come from project.json,
// which comes from lmr_detect.py (pixels of the real terminal). Nothing is invented here.
// ============================================================
const {COL, seg, lin, eo, eio, mix, clamp} = VW;
let P = null, IMG = {}, E = {};
const GOLD = '#F2C14E', WALLC = {red:'#E2575F', green:'#39A86F', cyan:'#49B7CC', magenta:'#C04BD8'};
const fmt = (p, d=2) => p.toLocaleString('en-US', {minimumFractionDigits:d, maximumFractionDigits:d});
const UP = s => s.split('γ').map(x=>x.toUpperCase()).join('γ');
const hm = m => { m = Math.floor(m); return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0'); };

// ---------- time remap: video seconds -> session minute (ET), piecewise linear, declared on screen ----------
function minuteAt(t){ const K=P.timeline.remap; if (t<=K[0][0]) return K[0][1];
  for (let i=0;i<K.length-1;i++){ const [a0,m0]=K[i],[a1,m1]=K[i+1]; if (t<=a1) return m0+(m1-m0)*(t-a0)/(a1-a0); } return K[K.length-1][1]; }
function speedAt(t){ const K=P.timeline.remap;
  for (let i=0;i<K.length-1;i++){ const [a0,m0]=K[i],[a1,m1]=K[i+1]; if (t>=a0 && t<a1) return (m1-m0)*60/(a1-a0); } return 0; }

// ---------- geometry: crop pixels -> screen ----------
function chartRect(){ return P.layout.chart; }                        // {x,y,w,h} on the 1080x1920 canvas
function camAt(t){ const C=P.timeline.camera; let k=0;
  if (t<=C[0].t) return C[0]; for (let i=0;i<C.length-1;i++){ const a=C[i],b=C[i+1]; if (t<=b.t){ const u=eio((t-a.t)/(b.t-a.t)); return {s:mix(a.s,b.s,u)}; } } return C[C.length-1]; }
function toScreen(xc, yc, t){                                          // crop coords -> canvas coords (with camera)
  const R=chartRect(), s0=R.w/P.crop.w, cam=camAt(t), f=P.layout.focus;   // focus in crop coords
  const fx=R.x+f.x*s0, fy=R.y+f.y*s0;
  return [fx+(R.x+xc*s0-fx)*cam.s, fy+(R.y+yc*s0-fy)*cam.s];
}
const xOfMinuteLocal = m => (m - P.map.tb)/P.map.ta - P.crop.x0;
const yOfPrice = p => (p - P.map.pb)/P.map.pa - P.crop.y0;

// ---------- drawing ----------
function drawChart(t){
  const g=VW.g, R=chartRect(), cam=camAt(t), s0=R.w/P.crop.w;
  const [ox,oy]=toScreen(0,0,t), sw=P.crop.w*s0*cam.s, sh=P.crop.h*s0*cam.s;
  g.save(); g.beginPath(); g.rect(R.x,R.y,R.w,R.h); g.clip();
  g.imageSmoothingQuality='high';
  g.drawImage(IMG.base, ox, oy, sw, sh);
  // walls exist on screen only from the book time on: hide them before it (kept: axes and grid)
  const xb=xOfMinuteLocal(P.book.minute_local);
  g.fillStyle='rgb(7,9,13)';
  for (const w of P.walls){ const y=yOfPrice(w.level); const [, sy0]=toScreen(0,y-7,t), [sxb, sy1]=toScreen(xb,y+7,t);
    g.fillRect(ox, sy0, Math.max(0,sxb-ox), sy1-sy0); }
  // book time marker
  const [bx0, by0]=toScreen(xb,0,t), [, by1]=toScreen(xb,P.crop.h-P.layout.time_h,t);
  g.strokeStyle='rgba(138,182,255,0.35)'; g.setLineDash([4,6]); g.lineWidth=1.5; g.beginPath(); g.moveTo(bx0,by0); g.lineTo(bx0,by1); g.stroke(); g.setLineDash([]);
  g.font='600 20px VWMono'; g.letterSpacing='2px'; g.fillStyle='rgba(138,182,255,0.8)'; g.textAlign='left'; g.fillText('BOOK '+P.book.label, bx0+8, by0+28);
  // candles revealed minute by minute, never ahead of the clock
  const m=minuteAt(t), done=Math.floor(m)-1;                           // last complete minute
  const xr=xOfMinuteLocal(P.toLocal(done)+0.5);
  const cw=Math.max(0, Math.min(P.crop.w, xr));
  if (cw>0) g.drawImage(IMG.candles, 0, 0, cw, P.crop.h, ox, oy, cw*s0*cam.s, sh);
  g.restore();
  return {done, xr};
}

function bar(mEt){ return P.barsByEt[mEt]; }

function drawFocusWall(t, st){
  const g=VW.g, R=chartRect(), w=P.focus_wall, y=yOfPrice(w.level), col=WALLC[w.family]||COL.ink;
  const a=1;                                              // visible from the first frame: the hook points at it
  const xb=xOfMinuteLocal(P.book.minute_local);
  const [x0s, ys]=toScreen(xb,y,t), [x1s]=toScreen(P.crop.w-P.layout.axis_w,y,t);
  const xEnd=x1s;
  const touchK=Math.exp(-Math.pow((t-E.touch)/0.35,2));
  g.save(); g.beginPath(); g.rect(R.x,R.y,R.w,R.h); g.clip();
  g.globalAlpha=a; g.strokeStyle=col; g.lineWidth=3+3*touchK; g.shadowColor=col; g.shadowBlur=18+30*touchK;
  g.beginPath(); g.moveTo(x0s,ys); g.lineTo(xEnd,ys); g.stroke(); g.restore();
  // label, top-left above the line
  const la=a*(1-seg(t,E.concl-0.2,E.concl+0.3)*0.6);
  g.save(); g.globalAlpha=la; g.textAlign='left'; g.textBaseline='alphabetic';
  g.font='700 58px VWMono'; g.fillStyle=COL.ink; g.shadowColor='rgba(0,0,0,0.9)'; g.shadowBlur=16;
  const lx=R.x+40, ly=ys-58;
  g.fillText(fmt(w.level), lx, ly);
  g.font='700 26px VWMono'; g.letterSpacing='3px'; g.fillStyle=col; g.fillText('DEALER WALL · '+UP(w.family_text), lx, ly+38);
  g.restore();
}

function drawPriceMarker(t, st){
  const b=bar(st.done); if (!b) return; const g=VW.g, R=chartRect();
  const y=yOfPrice(b.close), xr=xOfMinuteLocal(P.toLocal(st.done)+0.5);
  const [xs, ys]=toScreen(xr-0.5, y, t), [xa]=toScreen(P.crop.w-P.layout.axis_w, y, t);
  g.save(); g.beginPath(); g.rect(R.x,R.y,R.w+0,R.h); g.clip();
  g.strokeStyle=GOLD; g.globalAlpha=0.75; g.setLineDash([6,6]); g.lineWidth=1.5; g.beginPath(); g.moveTo(xs+6,ys); g.lineTo(xa,ys); g.stroke(); g.setLineDash([]);
  g.globalAlpha=1; g.fillStyle=GOLD; g.shadowColor=GOLD; g.shadowBlur=14; g.beginPath(); g.arc(xs+2,ys,6,0,Math.PI*2); g.fill(); g.restore();
  // price tag on the axis side
  g.save(); g.fillStyle=GOLD; const tw=150, th=40, tx=R.x+R.w-tw-6, ty=clamp(ys-th/2, R.y+4, R.y+R.h-th-4);
  VW.roundRect(tx,ty,tw,th,6); g.fill(); g.font='700 26px VWMono'; g.fillStyle='#0B0E14'; g.textAlign='center'; g.textBaseline='middle'; g.fillText(fmt(b.close), tx+tw/2, ty+th/2+1);
  const d=b.close-P.focus_wall.level, near=Math.abs(d)<=1;
  g.textAlign='right'; g.font='700 28px VWMono'; g.letterSpacing='1px'; g.fillStyle=near?GOLD:COL.ink; g.shadowColor='rgba(0,0,0,0.95)'; g.shadowBlur=12;
  const dy = (ys > R.y+R.h-140) ? -34 : 34;
  g.fillText((d>=0?'+':'−')+fmt(Math.abs(d))+' PTS VS WALL', tx+tw, ty+th/2+dy); g.restore();
}

function drawHUD(t, st){
  const g=VW.g, R=chartRect(), y0=R.y+R.h+34;
  const a=1-seg(t,E.logo0-0.2,E.logo0+0.4); if (a<=0) return;
  const sp=speedAt(t);
  g.save(); g.globalAlpha=a;
  g.textAlign='left'; g.textBaseline='alphabetic'; g.font='700 64px VWMono'; g.fillStyle=COL.ink;
  g.fillText(hm(st.done+1)+' ET', 64, y0+58);
  g.font='600 20px VWMono'; g.letterSpacing='3px'; g.fillStyle=COL.ink3; g.fillText('SESSION TIME · '+P.session.date_label, 66, y0+92);
  const label = sp>1.5 ? 'REPLAY ×'+Math.round(sp) : (t<E.reveal0 ? 'PAUSED' : 'SESSION CLOSED');
  g.font='700 30px VWMono'; g.letterSpacing='3px'; const bw=g.measureText(label).width+44, bx=1080-64-bw, by=y0+6;
  g.strokeStyle=COL.blue; g.lineWidth=2; VW.roundRect(bx,by,bw,58,29); g.stroke(); g.fillStyle='rgba(90,140,255,0.10)'; g.fill();
  g.fillStyle=COL.ink; g.textAlign='center'; g.textBaseline='middle'; g.fillText(label, bx+bw/2+2, by+30);
  g.restore();
}

function drawHook(t){
  const g=VW.g, k=1-seg(t,E.hookOut,E.hookOut+0.3); if (k<=0) return;
  const L=P.texts.hook, y0=300;
  g.save(); g.textAlign='center'; g.textBaseline='alphabetic'; g.shadowColor='rgba(0,0,0,0.9)'; g.shadowBlur=30;
  L.forEach((line,i)=>{ const a=1; g.globalAlpha=a*k; g.font='700 84px VWSans';
    g.fillStyle=i===L.length-1?COL.ink:COL.ink; g.save(); g.translate(540,y0+i*96); const sc=1.12-0.12*a; g.scale(sc,sc); g.fillText(line,0,0); g.restore(); });
  g.restore();
}

function drawCaption(t, txt, t0, t1, y=330, size=46, col=COL.ink){
  const g=VW.g, a=seg(t,t0,t0+0.3)*(1-seg(t,t1-0.25,t1)); if (a<=0) return;
  g.save(); g.globalAlpha=a; g.textAlign='center'; g.textBaseline='alphabetic'; g.shadowColor='rgba(0,0,0,0.9)'; g.shadowBlur=24;
  const lines=Array.isArray(txt)?txt:[txt];
  lines.forEach((l,i)=>{ g.font=`700 ${size}px VWSans`; g.fillStyle=i===0?col:COL.ink2; g.fillText(l,540,y+i*(size+14)); });
  g.restore();
}

function drawConclusion(t){
  const g=VW.g, a=seg(t,E.concl,E.concl+0.35)*(1-seg(t,E.logo0-0.1,E.logo0+0.3)); if (a<=0) return;
  g.save(); g.fillStyle=`rgba(3,6,12,${0.84*a})`; g.fillRect(0,0,1080,1920); g.restore();
  const C=P.texts.conclusion;
  g.save(); g.textAlign='center'; g.textBaseline='alphabetic'; g.shadowColor='rgba(0,0,0,0.95)'; g.shadowBlur=30;
  C.forEach((c,i)=>{ const k=eo(lin(t,E.concl+i*0.6,E.concl+0.35+i*0.6)); if (k<=0) return; g.globalAlpha=a*k; const y=640+i*360;
    g.font='600 28px VWMono'; g.letterSpacing='4px'; g.fillStyle=COL.ink3; g.fillText(c.kicker, 540, y);
    g.letterSpacing='0px'; c.lines.forEach((l,j)=>{ g.font='700 80px VWSans'; g.fillStyle=(i===1&&j===1)?GOLD:COL.ink; g.fillText(l, 540, y+96+j*90); }); });
  g.restore();
}

function drawTopBar(t){
  const a=1-seg(t,E.logo0+0.2,E.logo0+0.8); if (a<=0) return;
  VW.topBand(250); VW.logoTL(a,P.session.ticker,60,30,true);
  const g=VW.g; g.save(); g.globalAlpha=a*0.9; g.textAlign='left'; g.font='600 20px VWMono'; g.letterSpacing='3px'; g.fillStyle=COL.ink3;
  g.fillText(P.texts.source_line, 64, 200); g.restore();
}

function render(t){
  const g=VW.g; const loop=t>=E.loop0; const tt=loop?0:t;
  g.fillStyle='#05080E'; g.fillRect(0,0,1080,1920);
  const st=drawChart(tt);
  drawFocusWall(tt, st); drawPriceMarker(tt, st);
  drawHUD(tt, st);
  drawHook(tt);
  P.texts.beats.forEach(b=>drawCaption(tt, b.text, b.t0, b.t1, b.y||330, b.size||46, b.col==='gold'?GOLD:COL.ink));
  drawConclusion(tt);
  drawTopBar(tt);
  if (t>=E.logo0 && !loop){
    const e=t-E.logo0;
    VW.logoForm(e, P.logoPts(), {fadeOut:clamp((t-(E.loop0-0.35))/0.35,0,1), disclaimer:P.texts.disclaimer, noUrl:true});
    // DISCOVER VOLWICK →
    const k=eo(clamp((e-3.5)/0.5,0,1)); if (k>0){ g.save(); g.globalAlpha=k*(1-clamp((t-(E.loop0-0.35))/0.35,0,1)); g.textAlign='center'; g.font='700 40px VWMono'; g.letterSpacing='5px';
      g.fillStyle=COL.blue; g.shadowColor='rgba(90,140,255,0.8)'; g.shadowBlur=18; g.fillText('DISCOVER VOLWICK →',543,1380); g.restore();
      g.save(); g.globalAlpha=k; g.textAlign='center'; g.font='500 21px VWMono'; g.letterSpacing='2px'; g.fillStyle=COL.ink3; g.fillText(P.texts.disclaimer,540,1470); g.restore(); }
  }
}

(async () => {
  P = await (await fetch(new URLSearchParams(location.search).get('p') || 'project.json')).json();
  VW.assets.wm = await VW.loadImage('/08_AUTOMATION/brand/assets/wm_crop.png'); VW.assets.mono = await VW.loadImage('/08_AUTOMATION/brand/assets/mono.png');
  IMG.base = await VW.loadImage(P.layers.base); IMG.candles = await VW.loadImage(P.layers.candles);
  await document.fonts.load('700 40px VWSans'); await document.fonts.load('700 40px VWMono'); await document.fonts.load('600 20px VWMono');
  P.barsByEt = {}; P.bars.forEach(b=>{ if (b.ok) P.barsByEt[b.minute_et]=b; });
  P.toLocal = mEt => mEt + P.session.local_minus_et_min;
  E = P.timeline.events;
  // logo line: the price path that was revealed, in screen space at the start of the ending
  P.logoPts = () => { const pts=[]; const ms=P.bars.filter(b=>b.ok && b.minute_et>=P.timeline.remap[0][1] && b.minute_et<=P.timeline.end_minute_et);
    const step=Math.max(1,Math.floor(ms.length/50)); for (let i=0;i<ms.length;i+=step){ const b=ms[i]; pts.push(toScreen(xOfMinuteLocal(P.toLocal(b.minute_et)), yOfPrice(b.close), E.logo0)); } return pts; };
  window.render = render;
  window.READY = {total:E.total, events:E, check:{bars:P.bars.length, walls:P.walls.length, focus:P.focus_wall.level}};
})();
