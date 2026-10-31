// ============================================================
// VOLWICK · LIVE MARKET REACTIONS · v13 scene (Power, 25 Oct 2026: cinematic upgrade, 22-30 s)
// The chart is redrawn as vectors from the OHLC bars read off the terminal recording (pixel reading,
// tick snapped), so it can fill the 9:16 frame without upscaling blur. Nothing is invented:
// candles appear only once their minute is complete, the wall line starts at its book time.
// Three moments: APPROACH, CONTACT (slow, light zoom, highlight), REACTION. One text at a time.
// ============================================================
const {COL, seg, lin, eo, eio, mix, clamp} = VW;
let P = null, E = {};
const BG = '#05080E', GOLD = '#F2C14E', INK = '#F2F4F8', INK2 = '#8C97A8', INK3 = '#4E5A6E';
const UP = '#35C98A', DN = '#66738A';                    // down candles slate, so the red wall never melts into them
const WALLC = {red:'#FF5A63', green:'#3DDC84', cyan:'#49B7CC', magenta:'#C04BD8'};
const fmt = (p, d=2) => p.toLocaleString('en-US', {minimumFractionDigits:d, maximumFractionDigits:d});
const hm = m => { m = Math.floor(m); return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0'); };
const color = c => ({gold:GOLD, ink:INK, ink2:INK2, blue:COL.blue, wall:WALLC[P.focus_wall.family]}[c] || WALLC[c] || c);

// ---------- time: cursor in ET minutes; bars before floor(cursor) are complete ----------
function cursorAt(t){ const K=P.timeline.remap; if (t<=K[0][0]) return K[0][1];
  for (let i=0;i<K.length-1;i++){ const [a0,m0]=K[i],[a1,m1]=K[i+1]; if (t<=a1) return m0+(m1-m0)*(t-a0)/(a1-a0); } return K[K.length-1][1]; }
function speedAt(t){ const K=P.timeline.remap;
  for (let i=0;i<K.length-1;i++){ const [a0,m0]=K[i],[a1,m1]=K[i+1]; if (t>=a0 && t<a1) return (m1-m0)*60/(a1-a0); } return 0; }
// time (s) at which a cursor value is reached, forward pass
function tOfCursor(c){ const K=P.timeline.remap; for (let i=0;i<K.length-1;i++){ const [a0,m0]=K[i],[a1,m1]=K[i+1]; if (m1>m0 && c>=m0 && c<=m1) return a0+(c-m0)/(m1-m0)*(a1-a0); } return 1e9; }

// ---------- camera: a view window [m0,m1]x[p0,p1] eased between keyframes ----------
const PL = () => P.layout.plot;
function viewAt(t){ const V=P.timeline.views; if (t<=V[0].t) return V[0];
  for (let i=0;i<V.length-1;i++){ const a=V[i], b=V[i+1]; if (t<=b.t){ const k=eio((t-a.t)/(b.t-a.t)); return {m0:mix(a.m0,b.m0,k), m1:mix(a.m1,b.m1,k), p0:mix(a.p0,b.p0,k), p1:mix(a.p1,b.p1,k)}; } }
  return V[V.length-1]; }
let VWN = null;
const X = m => { const r=PL(); return r.x + (m - VWN.m0)/(VWN.m1-VWN.m0)*r.w; };
const Y = p => { const r=PL(); return r.y + (VWN.p1 - p)/(VWN.p1-VWN.p0)*r.h; };
const bar = m => P.barsByEt[m];

// ---------- grid, axes ----------
function drawGrid(t, hide){
  const g=VW.g, r=PL(); const ppt=r.h/(VWN.p1-VWN.p0); const step = ppt>70 ? 1 : (ppt>34 ? 2.5 : 5);
  g.save(); g.font='500 24px VWMono'; g.textAlign='right'; g.textBaseline='middle';
  for (let p=Math.ceil(VWN.p0/step)*step; p<=VWN.p1; p+=step){ const y=Y(p); if (y<r.y+6 || y>r.y+r.h-6) continue;
    g.strokeStyle='rgba(120,150,200,0.075)'; g.lineWidth=1; g.beginPath(); g.moveTo(r.x, Math.round(y)+0.5); g.lineTo(r.x+r.w, Math.round(y)+0.5); g.stroke();
    if (hide.some(h=>Math.abs(h-y)<30)) continue; g.fillStyle=INK3; g.fillText(fmt(p), 1080-24, y); }
  // time labels, ET, every 15 minutes
  g.textAlign='center'; g.font='500 22px VWMono'; g.fillStyle=INK3;
  for (let m=Math.ceil(VWN.m0/15)*15; m<=VWN.m1; m+=15){ const x=X(m); if (x<r.x+30 || x>r.x+r.w-30) continue;
    g.strokeStyle='rgba(120,150,200,0.05)'; g.beginPath(); g.moveTo(Math.round(x)+0.5, r.y); g.lineTo(Math.round(x)+0.5, r.y+r.h); g.stroke();
    g.fillText(hm(m), x, r.y+r.h+34); }
  g.restore();
}

// ---------- candles ----------
function drawCandles(t){
  const g=VW.g, r=PL(), c=cursorAt(t), done=Math.floor(c+1e-6)-1, pxm=r.w/(VWN.m1-VWN.m0);
  const bw=clamp(pxm*0.62, 3, 30), ww=clamp(pxm*0.11, 1.5, 3.5);
  g.save(); g.beginPath(); g.rect(r.x, r.y-2, r.w, r.h+4); g.clip();
  for (let m=Math.floor(VWN.m0)-1; m<=Math.min(done, Math.ceil(VWN.m1)); m++){ const b=bar(m); if (!b) continue;
    // a candle fades in over 70 ms once its minute is complete (no intrabar path is drawn)
    const tc=tOfCursor(m+1), a=m < P.book.minute_et-1 ? 1 : clamp((t-tc)/0.07, 0, 1); if (a<=0) continue;
    const x=X(m+0.5), up=b.close>=b.open, col=up?UP:DN;
    g.globalAlpha=a; g.fillStyle=col; g.fillRect(x-ww/2, Y(b.high), ww, Math.max(1, Y(b.low)-Y(b.high)));
    const y0=Y(Math.max(b.open,b.close)), y1=Y(Math.min(b.open,b.close)); g.fillRect(x-bw/2, y0, bw, Math.max(2, y1-y0)); }
  g.restore();
  return {done, cursor:c};
}

// ---------- protagonist wall ----------
function drawWall(t, st){
  const g=VW.g, r=PL(), w=P.focus_wall, col=WALLC[w.family]||INK, y=Y(w.level);
  const draw=1;                                             // the wall is on screen from the first frame (book 16:00 ET = first cursor)
  const xa=Math.max(r.x, X(P.book.minute_et)), xb=r.x+r.w, xe=mix(xa, xb, draw);
  const hl=Math.exp(-Math.max(0,t-E.touch)/0.55)*(t>=E.touch?1:0) ;   // contact highlight, decays
  const h0=0.6*Math.exp(-t/0.35);                                          // soft brightening of the line on the first frame (no glow point)
  const ap=lin(t, E.approachHot0, E.touch)*(t<E.touch?1:0);               // the line warms up a little on the approach
  const fadeEnd=1-seg(t,E.logo0-0.2,E.logo0+0.2);
  g.save(); g.globalAlpha=fadeEnd;
  // quiet band: how far price moved around the wall after the touch (real max above / below)
  const ba=seg(t,E.band0,E.band0+0.5);
  if (ba>0){ const S=P.story, x0=X(S.reach_minute_et), x1=Math.min(X(st.done+1), X(S.end_minute_et+1));
    if (x1>x0){ g.globalAlpha=fadeEnd*ba; g.fillStyle='rgba(242,193,78,0.10)'; g.fillRect(x0, Y(w.level+S.max_above_after), x1-x0, Y(w.level-S.max_below_after)-Y(w.level+S.max_above_after));
      g.strokeStyle='rgba(242,193,78,0.35)'; g.lineWidth=1.5; g.setLineDash([6,6]);
      for (const p of [w.level+S.max_above_after, w.level-S.max_below_after]){ g.beginPath(); g.moveTo(x0, Y(p)); g.lineTo(x1, Y(p)); g.stroke(); }
      g.setLineDash([]); g.globalAlpha=fadeEnd; } }
  // the line
  g.strokeStyle=col; g.lineCap='round'; g.lineWidth=3.5+1.5*hl+0.5*ap+h0; g.shadowColor=col; g.shadowBlur=6+16*hl+4*ap+10*h0;
  g.beginPath(); g.moveTo(xa, y); g.lineTo(xe, y); g.stroke();
  // start tick at the book time
  g.shadowBlur=0; g.lineWidth=2; g.globalAlpha=fadeEnd*0.6*draw; g.beginPath(); g.moveTo(xa, y-14); g.lineTo(xa, y+14); g.stroke(); g.globalAlpha=fadeEnd;
  // contact glow at the touch point (small, short)
  if (hl>0.01){ const cx=X(P.story.reach_minute_et+0.5), gr=g.createRadialGradient(cx,y,0,cx,y,90*(1+0.4*(1-hl)));
    gr.addColorStop(0,`rgba(255,120,120,${0.55*hl})`); gr.addColorStop(1,'rgba(255,90,99,0)'); g.fillStyle=gr; g.fillRect(cx-140,y-140,280,280); }
  // label above the line, at its start: name of the level
  const la=draw*(t<E.logo0?1:0);
  if (la>0){ g.globalAlpha=fadeEnd*la; g.font='700 24px VWMono'; g.letterSpacing='3px'; g.textAlign='left'; g.textBaseline='alphabetic';
    const lx=Math.max(r.x+8, xa+10), ly=y-18; g.fillStyle=col; g.fillText('DEALER WALL', lx, ly); g.letterSpacing='0px'; }
  g.restore();
  // price tag on the axis
  axisTag(w.level, col, '#FFFFFF', fadeEnd*draw, 1+0.06*hl);
  return y;
}
function axisTag(p, bg, fg, a, sc=1, yForce){
  if (a<=0) return; const g=VW.g, y=yForce!==undefined?yForce:Y(p), r=PL(); if (y<r.y-20 || y>r.y+r.h+20) return;
  g.save(); g.globalAlpha=a; g.font='700 25px VWMono'; const txt=fmt(p), tw=g.measureText(txt).width+22, h=40*sc, x=1080-12-tw;
  g.fillStyle=bg; VW.roundRect(x, y-h/2, tw, h, 7); g.fill(); g.fillStyle=fg; g.textAlign='center'; g.textBaseline='middle'; g.fillText(txt, x+tw/2, y+1); g.restore();
}
function drawPrice(t, st, yWall){
  const b=bar(st.done); if (!b || st.done<P.book.minute_et-1) return null; const g=VW.g, r=PL();
  const fadeEnd=1-seg(t,E.logo0-0.2,E.logo0+0.2); if (fadeEnd<=0) return null;
  const x=X(st.done+0.5), y=Y(b.close); if (x<r.x || x>r.x+r.w) return null;
  g.save(); g.globalAlpha=fadeEnd;
  g.strokeStyle='rgba(242,193,78,0.45)'; g.lineWidth=1.5; g.setLineDash([4,7]); g.beginPath(); g.moveTo(x+12, y); g.lineTo(r.x+r.w, y); g.stroke(); g.setLineDash([]);
  g.fillStyle=GOLD; g.shadowColor=GOLD; g.shadowBlur=10; g.beginPath(); g.arc(x, y, 7, 0, Math.PI*2); g.fill(); g.restore();
  // gold tag; if it would cover the wall tag, it moves just above or below it
  let ty=y; if (Math.abs(ty-yWall)<42) ty = (b.close>=P.focus_wall.level ? yWall-42 : yWall+42);
  axisTag(b.close, GOLD, '#10131A', fadeEnd, 1, ty);
  return ty;
}

// ---------- one statement at a time, top of the frame ----------
function drawStatement(t){
  const g=VW.g; const cur=P.texts.statements.find(s=>t>=s.t0-0.001 && t<s.t1); if (!cur) return;
  const ain=cur.t0<=0.001?1:eo(lin(t,cur.t0,cur.t0+0.22)), aout=1-eo(lin(t,cur.t1-0.18,cur.t1));
  const size=cur.size||84, lh=size*1.1, y0=cur.y||330;
  g.save(); g.textBaseline='alphabetic'; g.textAlign='left';
  cur.lines.forEach((ln,i)=>{ const t0=cur.t0+(cur.stagger?cur.stagger[i]||0:0); const a=(t0<=0.001&&i===0?1:eo(lin(t,t0,t0+0.22)))*aout; if (a<=0) return;
    const parts=(typeof ln==='string')?[[ln,'ink']]:ln; g.font=`700 ${size}px VWSans`; g.letterSpacing='-1px';
    const w=parts.reduce((s,p)=>s+g.measureText(p[0]).width,0); let x=540-w/2; const dy=(1-a)*12;
    g.globalAlpha=a; parts.forEach(([txt,c])=>{ g.fillStyle=color(c); g.fillText(txt, x, y0+i*lh+dy); x+=g.measureText(txt).width; }); });
  if (cur.sub){ const a=eo(lin(t,cur.t0+0.15,cur.t0+0.4))*aout; g.globalAlpha=a; g.font='600 25px VWMono'; g.letterSpacing='3px'; g.textAlign='center'; g.fillStyle=INK2;
    g.fillText(cur.sub, 542, y0+(cur.lines.length-1)*lh+54); }
  g.restore();
}

// ---------- footer: real-session clock (ET) and the declared speed ----------
function drawFooter(t, st){
  const a=1-seg(t,E.logo0-0.2,E.logo0+0.2); if (a<=0) return; const g=VW.g, y=PL().y+PL().h+100, sp=speedAt(t);
  g.save(); g.globalAlpha=a; g.font='600 28px VWMono'; g.letterSpacing='3px'; g.textBaseline='middle';
  g.textAlign='left'; g.fillStyle=INK; g.fillText(hm(Math.min(st.done+1, P.timeline.end_minute_et))+' ET', 56, y);
  const lab = sp>1.5 ? (sp<=100 ? 'SLOWED · ×' : 'SPEED ×')+Math.round(sp) : (t>=E.closeHold ? 'SESSION CLOSE' : 'PAUSED');
  g.textAlign='right'; g.fillStyle=INK2; g.fillText(lab, 1080-56, y);
  g.restore();
}
function drawTop(t){
  const a=1-seg(t,E.logo0,E.logo0+0.4); if (a<=0) return; const g=VW.g;
  VW.logoTL(a, P.session.ticker, 52, 28, true);
  g.save(); g.globalAlpha=a; g.textBaseline='middle'; g.textAlign='left';
  g.fillStyle='#FF4D5E'; g.beginPath(); g.arc(72,182,6,0,Math.PI*2); g.fill();   // static dot: a replay of a real session, not live
  g.font='700 23px VWMono'; g.letterSpacing='4px'; g.fillStyle=INK; g.fillText(P.texts.badge, 90, 183);
  const bw=g.measureText(P.texts.badge).width; g.font='600 21px VWMono'; g.letterSpacing='3px'; g.fillStyle=INK2; g.fillText(P.texts.source_line, 90+bw+18, 183);
  g.restore();
}

function render(t){
  const g=VW.g, loop=t>=E.loop0, tt=loop?0:t;
  g.fillStyle=BG; g.fillRect(0,0,1080,1920);
  VWN=viewAt(tt);
  const yWall=Y(P.focus_wall.level), b=bar(Math.floor(cursorAt(tt)+1e-6)-1);
  drawGrid(tt, [yWall, b?Y(b.close):-999]);
  const st=drawCandles(tt); const yw=drawWall(tt, st); drawPrice(tt, st, yw);
  drawStatement(tt); drawFooter(tt, st); drawTop(tt);
  if (tt>=E.logo0){
    const e=(tt-E.logo0)*P.timeline.logo_speed, fo=0;   // the ending holds clean to the last frame
    VW.logoForm(e, P.logoPts(), {fadeOut:fo, noUrl:true});
    const k=eo(clamp((e-3.25)/0.5,0,1)); if (k>0){ g.save(); g.globalAlpha=k*(1-fo); g.textAlign='center'; g.textBaseline='middle'; g.font='700 40px VWMono'; g.letterSpacing='5px';
      g.fillStyle=COL.blue; g.fillText('DISCOVER VOLWICK →',543,1395); g.font='500 21px VWMono'; g.letterSpacing='2px'; g.fillStyle=INK3; g.fillText(P.texts.disclaimer,540,1480); g.restore(); }
  }
}

(async () => {
  P = await (await fetch(new URLSearchParams(location.search).get('p') || 'project.json')).json();
  VW.assets.wm = await VW.loadImage('/08_AUTOMATION/brand/assets/wm_crop.png'); VW.assets.mono = await VW.loadImage('/08_AUTOMATION/brand/assets/mono.png');
  await VW.loadFonts();
  P.barsByEt = {}; P.bars.forEach(b=>{ if (b.ok) P.barsByEt[b.minute_et]=b; });
  E = P.timeline.events;
  P.logoPts = () => { VWN=viewAt(E.logo0); const ms=P.bars.filter(b=>b.ok && b.minute_et>=P.book.minute_et-1 && b.minute_et<=P.story.end_minute_et);
    return ms.map(b=>[X(b.minute_et+0.5), Y(b.close)]); };
  window.render = render;
  window.viewAt = viewAt;
  window.READY = {total:E.total, events:E, check:{bars:P.bars.length, focus:P.focus_wall.level}};
})();
