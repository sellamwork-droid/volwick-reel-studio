// ============================================================
// VOLWICK · LIVE MARKET REACTIONS · minimal scene (Power, 25 Oct 2026 night)
// Flat navy, no blur, no vignette, no rings, no arrows. One protagonist line, one text at a time,
// always in the same place with the same type. Numbers come from project.json (real terminal pixels).
// ============================================================
const {COL, seg, lin, eo, eio, mix, clamp} = VW;
let P = null, IMG = {}, E = {};
const BG = '#05080E', GOLD = '#F2C14E', INK = '#F2F4F8', INK2 = '#8C97A8';
const WALLC = {red:'#E2575F', green:'#3DDC84', cyan:'#49B7CC', magenta:'#C04BD8'};
const fmt = (p, d=2) => p.toLocaleString('en-US', {minimumFractionDigits:d, maximumFractionDigits:d});
const hm = m => { m = Math.floor(m); return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0'); };
const color = c => ({gold:GOLD, ink:INK, ink2:INK2, blue:COL.blue}[c] || WALLC[c] || c);

// ---------- time ----------
function minuteAt(t){ const K=P.timeline.remap; if (t<=K[0][0]) return K[0][1];
  for (let i=0;i<K.length-1;i++){ const [a0,m0]=K[i],[a1,m1]=K[i+1]; if (t<=a1){ const u=(t-a0)/(a1-a0); return m0+(m1-m0)*(m1<m0?eio(u):u); } } return K[K.length-1][1]; }
function speedAt(t){ const K=P.timeline.remap;
  for (let i=0;i<K.length-1;i++){ const [a0,m0]=K[i],[a1,m1]=K[i+1]; if (t>=a0 && t<a1) return (m1-m0)*60/(a1-a0); } return 0; }

// ---------- camera: smooth zoom, focus follows the candle being drawn, at the height of the wall ----------
const R = () => P.layout.chart;
function camAt(t){ const C=P.timeline.camera; if (t<=C[0].t) return C[0].s;
  for (let i=0;i<C.length-1;i++){ const a=C[i],b=C[i+1]; if (t<=b.t) return mix(a.s,b.s,eio((t-a.t)/(b.t-a.t))); } return C[C.length-1].s; }
const xOfLocal = m => (m - P.map.tb)/P.map.ta - P.crop.x0;
const yOfPrice = p => (p - P.map.pb)/P.map.pa - P.crop.y0;
const toLocal = mEt => mEt + P.session.local_minus_et_min;
const bar = m => P.barsByEt[m];
function focusAt(t){ const m=clamp(minuteAt(t), P.book.minute_et, P.timeline.end_minute_et);
  return {x: clamp(xOfLocal(toLocal(m-1)+0.5), 0, P.crop.w-P.layout.axis_w), y: P.layout.focus.y}; }
function toScreen(xc, yc, t){ const r=R(), s0=r.w/P.crop.w, s=camAt(t), f=focusAt(t);
  const fx=r.x+f.x*s0, fy=r.y+f.y*s0; return [fx+(r.x+xc*s0-fx)*s, fy+(r.y+yc*s0-fy)*s]; }

// ---------- chart ----------
function drawChart(t){
  const g=VW.g, r=R(), s0=r.w/P.crop.w, s=camAt(t);
  const [ox,oy]=toScreen(0,0,t), sw=P.crop.w*s0*s, sh=P.crop.h*s0*s;
  g.save(); g.beginPath(); g.rect(r.x,r.y,r.w,r.h); g.clip(); g.imageSmoothingQuality='high';
  const aw=P.layout.axis_w, pw=P.crop.w-aw;                          // plot area only: the terminal's axis is replaced by a clean one
  g.globalAlpha=0.7; g.drawImage(IMG.base, 0, 0, pw, P.crop.h, ox, oy, pw*s0*s, sh); g.globalAlpha=1;
  // every wall line of the terminal is hidden: the scene draws only the protagonist wall, from its book time
  g.fillStyle=BG;
  for (const w of P.walls){ const y=yOfPrice(w.level); const [, a]=toScreen(0,y-9,t), [, b]=toScreen(0,y+9,t); g.fillRect(r.x, a, r.w, b-a); }
  const m=minuteAt(t), done=Math.floor(m)-1, xr=xOfLocal(toLocal(done)+0.5), cw=clamp(xr,0,P.crop.w);
  const cw2=Math.min(cw, pw); if (cw2>0) g.drawImage(IMG.candles, 0, 0, cw2, P.crop.h, ox, oy, cw2*s0*s, sh);
  g.restore();
  // clean price axis: round levels, right edge, small
  g.save(); g.font='500 22px VWMono'; g.fillStyle=INK2; g.textAlign='right'; g.textBaseline='middle'; g.globalAlpha=0.8;
  const top=P.map.pa*(0)+P.map.pb, step=2.5; const pTop=yOfPrice, lo=Math.floor((P.map.pa*(P.crop.y0+P.crop.h)+P.map.pb)/step)*step, hi=Math.ceil((P.map.pa*P.crop.y0+P.map.pb)/step)*step;
  for (let p=lo; p<=hi; p+=step){ const [, yy]=toScreen(0, yOfPrice(p), t); if (yy>r.y+14 && yy<r.y+r.h-14) g.fillText(fmt(p), r.x+r.w-14, yy); }
  g.restore();
  return {done, xr};
}
function drawWall(t, st){
  const g=VW.g, r=R(), w=P.focus_wall, col=WALLC[w.family]||INK, y=yOfPrice(w.level);
  const [x0,ys]=toScreen(xOfLocal(toLocal(P.book.minute_et)), y, t); const x1=r.x+r.w-140;
  g.save(); g.beginPath(); g.rect(r.x,r.y,r.w,r.h); g.clip();
  g.strokeStyle=col; g.lineWidth=3; g.shadowColor=col; g.shadowBlur=8; g.beginPath(); g.moveTo(Math.max(r.x,x0),ys); g.lineTo(x1,ys); g.stroke();
  // the stretch after the touch: a quiet band of how far price moved from the wall
  const ba=seg(t,E.after0,E.after0+0.4)*(1-seg(t,E.logo0-0.3,E.logo0));
  if (ba>0){ const S=P.story, xa=xOfLocal(toLocal(S.reach_minute_et)-0.5), xe=Math.min(st.xr, xOfLocal(toLocal(S.end_minute_et)+0.5));
    if (xe>xa){ const [a0,b0]=toScreen(xa, yOfPrice(w.level+S.max_above_after), t), [a1,b1]=toScreen(xe, yOfPrice(w.level-S.max_below_after), t);
      g.shadowBlur=0; g.globalAlpha=ba; g.fillStyle='rgba(242,193,78,0.12)'; g.fillRect(a0,b0,a1-a0,b1-b0); } }
  g.restore();
  // small tag on the line, right side
  const a=1-seg(t,E.logo0-0.3,E.logo0); if (a<=0) return;
  g.save(); g.globalAlpha=a; g.font='600 24px VWMono'; g.letterSpacing='2px'; const label='WALL '+fmt(w.level); const tw=g.measureText(label).width+28;
  const tx=r.x+28, ty=clamp(ys-19, r.y+4, r.y+r.h-42);
  g.fillStyle=col; VW.roundRect(tx,ty,tw,38,6); g.fill(); g.fillStyle='#FFFFFF'; g.textBaseline='middle'; g.textAlign='center'; g.fillText(label, tx+tw/2+1, ty+20); g.restore();
}
function drawPrice(t, st){
  const b=bar(st.done); if (!b) return; const g=VW.g, r=R();
  const [xs, ys]=toScreen(st.xr-0.5, yOfPrice(b.close), t);
  if (xs<r.x || xs>r.x+r.w) return;
  g.save(); g.fillStyle=GOLD; g.beginPath(); g.arc(xs+2,ys,7,0,Math.PI*2); g.fill(); g.restore();
}

// ---------- one text at a time, same place, same type ----------
function lineWidth(g, parts){ return parts.reduce((s,p)=>s+g.measureText(p[0]).width,0); }
function drawStatement(t){
  const g=VW.g; let cur=null;
  for (const s of P.texts.statements){ if (t>=s.t0-0.001 && t<s.t1) { cur=s; break; } }
  if (!cur) return;
  const a=(cur.t0<=0.001?1:eo(lin(t,cur.t0,cur.t0+0.25)))*(1-eo(lin(t,cur.t1-0.2,cur.t1)));
  const size=cur.size||76, lh=size*1.12, y0=cur.y||300;
  g.save(); g.globalAlpha=a; g.textBaseline='alphabetic'; g.textAlign='left';
  cur.lines.forEach((ln,i)=>{
    const parts=(typeof ln==='string')?[[ln.replace('{d}', distText(t)),'ink']]:ln.map(p=>[p[0].replace('{d}', distText(t)), p[1]]);
    g.font=`700 ${size}px VWSans`; const w=lineWidth(g, parts); let x=540-w/2; const dy=(1-a)*10;
    parts.forEach(([txt,c])=>{ g.fillStyle=color(c); g.fillText(txt, x, y0+i*lh+dy); x+=g.measureText(txt).width; }); });
  if (cur.sub){ g.font='600 26px VWMono'; g.letterSpacing='4px'; g.textAlign='center'; g.fillStyle=INK2; g.fillText(cur.sub, 543, y0+cur.lines.length*lh+8); }
  g.restore();
}
function distText(t){ const b=bar(Math.floor(minuteAt(t))-1); if (!b) return ''; return fmt(Math.abs(b.close-P.focus_wall.level)); }

// ---------- footer: real-session clock and declared speed, small ----------
function drawFooter(t, st){
  const a=1-seg(t,E.logo0-0.3,E.logo0); if (a<=0) return; const g=VW.g, r=R(), y=r.y+r.h+56, sp=speedAt(t);
  g.save(); g.globalAlpha=a; g.font='600 28px VWMono'; g.letterSpacing='3px'; g.textBaseline='middle';
  g.textAlign='left'; g.fillStyle=INK; g.fillText(hm(st.done+1)+' ET', 72, y);
  const lab = t<E.hookOut ? '' : (sp<-1 ? 'REWIND' : (sp>1.5 ? 'SPEED ×'+Math.round(sp) : (t>=P.segments.after[1] ? 'SESSION CLOSE' : 'PAUSED')));
  g.textAlign='right'; g.fillStyle=INK2; g.fillText(lab, 1080-72, y);
  g.restore();
}
function drawTop(t){
  const a=1-seg(t,E.logo0+0.1,E.logo0+0.6); if (a<=0) return; const g=VW.g;
  VW.logoTL(a, P.session.ticker, 56, 28, true);
  g.save(); g.globalAlpha=a; g.textBaseline='middle'; g.textAlign='left';
  const pulse=0.6+0.4*Math.sin(t*4.5); g.fillStyle=`rgba(255,77,94,${pulse})`; g.beginPath(); g.arc(76,184,7,0,Math.PI*2); g.fill();
  g.font='700 24px VWMono'; g.letterSpacing='4px'; g.fillStyle=INK; g.fillText(P.texts.badge, 96, 185);
  const bw=g.measureText(P.texts.badge).width; g.font='600 22px VWMono'; g.letterSpacing='3px'; g.fillStyle=INK2; g.fillText(P.texts.source_line, 96+bw+20, 185);
  g.restore();
}

function render(t){
  const g=VW.g, loop=t>=E.loop0, tt=loop?0:t;
  g.fillStyle=BG; g.fillRect(0,0,1080,1920);
  const st=drawChart(tt); drawWall(tt, st); drawPrice(tt, st);
  drawStatement(tt); drawFooter(tt, st); drawTop(tt);
  if (t>=E.logo0 && !loop){
    const e=t-E.logo0, fo=clamp((t-(E.loop0-0.35))/0.35,0,1);
    VW.logoForm(e, P.logoPts(), {fadeOut:fo, noUrl:true});
    const k=eo(clamp((e-3.3)/0.45,0,1)); if (k>0){ g.save(); g.globalAlpha=k*(1-fo); g.textAlign='center'; g.font='700 38px VWMono'; g.letterSpacing='5px';
      g.fillStyle=COL.blue; g.fillText('DISCOVER VOLWICK →',543,1380); g.font='500 21px VWMono'; g.letterSpacing='2px'; g.fillStyle=INK2; g.fillText(P.texts.disclaimer,540,1470); g.restore(); }
  }
}

(async () => {
  P = await (await fetch(new URLSearchParams(location.search).get('p') || 'project.json')).json();
  VW.assets.wm = await VW.loadImage('/08_AUTOMATION/brand/assets/wm_crop.png'); VW.assets.mono = await VW.loadImage('/08_AUTOMATION/brand/assets/mono.png');
  IMG.base = await VW.loadImage(P.layers.base); IMG.candles = await VW.loadImage(P.layers.candles);
  await VW.loadFonts();
  P.barsByEt = {}; P.bars.forEach(b=>{ if (b.ok) P.barsByEt[b.minute_et]=b; });
  E = P.timeline.events;
  P.logoPts = () => { const ms=P.bars.filter(b=>b.ok && b.minute_et>=P.book.minute_et-1 && b.minute_et<=P.story.end_minute_et);
    const step=Math.max(1,Math.floor(ms.length/50)), pts=[]; for (let i=0;i<ms.length;i+=step){ const b=ms[i]; pts.push(toScreen(xOfLocal(toLocal(b.minute_et)), yOfPrice(b.close), E.logo0)); } return pts; };
  window.render = render;
  window.READY = {total:E.total, events:E, check:{bars:P.bars.length, walls:P.walls.length, focus:P.focus_wall.level}};
})();
