// ============================================================
// VOLWICK Content Engine · vw_core.js
// Shared foundation: canvas, palette, easing, timing, camera,
// captions, safe zone. Every frame is a pure function of time.
// ============================================================
const VW = {};
VW.W = 1080; VW.H = 1920;
VW.cv = document.getElementById('c');
VW.g = VW.cv.getContext('2d');
// letter tracking breaks Arabic joining and the Devanagari headline: never track text in those scripts,
(()=>{ const P=CanvasRenderingContext2D.prototype, RX=/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u0900-\u097F\uA8E0-\uA8FF]/;
  for (const fn of ['fillText','strokeText','measureText']) { const o=P[fn]; P[fn]=function(t,...a){ if (!RX.test(t)) return o.call(this,t,...a);
    // same script: no tracking, and the proportional face instead of the monospaced one (its wide space splits the words)
    const ls=this.letterSpacing, f=this.font; this.letterSpacing='0px'; if (f.includes('VWMono')) this.font=f.replace('VWMono','VWSans');
    try{ return o.call(this,t,...a); } finally{ this.letterSpacing=ls; this.font=f; } }; } })();

// Palette: data colours follow the terminal, brand blue only for accents.
VW.COL = {
  bg:'#04070D', grid:'rgba(120,150,200,0.07)', up:'#2FB67C', dn:'#E2575F',
  ink:'#ECEFF4', ink2:'#97A3B3', ink3:'#5E6B80', blue:'#5A8CFF', warn:'#E0913F', gold:'#F2C14E',
  callL:'#39A86F', cvd:'#DCE6FF', callS:'#49B7CC', putL:'#CF5D5D', putS:'#B16FD0'
};

// Safe zone for essential information (Reels/TikTok/Shorts union, 1080x1920).
// Safe zone for ORGANIC Reels + TikTok + Shorts at full screen (research 25 Oct 2026):
// Instagram organic covers top 250, bottom 319, left 86, right 119; TikTok top 130, bottom 484, left 44, right 140.
// Everything essential (logo, ticker, charts, labels, captions) stays inside this union.
VW.SAFE = {x0:96, x1:940, y0:260, y1:1550};   // bottom follows the 2026 overlays (TikTok ads 370 px, Reels 310 px)
VW.UI = { ig:{t:210,b:310,l:86,r:84}, tt:{t:108,b:370,l:60,r:120} };   // 2026 platform overlays (TikTok ads bottom 370)
VW.SAFE.cx = (VW.SAFE.x0 + VW.SAFE.x1) / 2;

// ---------- math / easing ----------
VW.clamp = (x,a,b) => Math.max(a, Math.min(b, x));
VW.lin = (t,a,b) => VW.clamp((t-a)/(b-a), 0, 1);
VW.eio = x => x<.5 ? 4*x*x*x : 1-Math.pow(-2*x+2,3)/2;
VW.eo  = x => 1-Math.pow(1-x,3);
VW.eoe = x => x===1 ? 1 : 1-Math.pow(2,-10*x);
VW.seg = (t,a,b,f=VW.eio) => f(VW.lin(t,a,b));
VW.mix = (a,b,k) => a+(b-a)*k;
VW.rgba = (hex,a) => { const n=parseInt(hex.slice(1),16); return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`; };
VW.rng = seed => { let s=seed>>>0; return () => { s=(s*1664525+1013904223)>>>0; return s/4294967296; }; };
VW.roundRect = (x,y,w,h,r) => { const g=VW.g; g.beginPath(); g.moveTo(x+r,y); g.arcTo(x+w,y,x+w,y+h,r); g.arcTo(x+w,y+h,x,y+h,r); g.arcTo(x,y+h,x,y,r); g.arcTo(x,y,x+w,y,r); g.closePath(); };

// ---------- piecewise maps (story time, camera) ----------
// pairs [[t0,v0],[t1,v1],...]; optional per-segment easing indexes
VW.piecewise = (pairs, t, easeSeg=[]) => {
  if (t <= pairs[0][0]) return pairs[0][1];
  for (let i=0;i<pairs.length-1;i++) { const [a0,b0]=pairs[i],[a1,b1]=pairs[i+1];
    if (t <= a1) { const k=(t-a0)/(a1-a0); return b0+(b1-b0)*(easeSeg.includes(i)?VW.eio(k):k); } }
  return pairs[pairs.length-1][1];
};
VW.camAt = (keys, t) => {
  if (t <= keys[0].t) return keys[0];
  for (let i=0;i<keys.length-1;i++) { const a=keys[i], b=keys[i+1];
    if (t <= b.t) { const k=VW.eio((t-a.t)/(b.t-a.t)); return {s:VW.mix(a.s,b.s,k), fx:VW.mix(a.fx,b.fx,k), fy:VW.mix(a.fy,b.fy,k)}; } }
  return keys[keys.length-1];
};
VW.punch = (times, t, w=0.11) => times.reduce((p,k)=>p+Math.exp(-Math.pow((t-k)/w,2)), 0);

// ---------- background / vignette ----------
VW.background = t => {
  const g=VW.g; g.fillStyle=VW.COL.bg; g.fillRect(0,0,VW.W,VW.H);
  const br=0.55+0.08*Math.sin(t*0.6);
  const rg=g.createRadialGradient(VW.SAFE.cx,760,40,VW.SAFE.cx,760,1100);
  rg.addColorStop(0,`rgba(28,58,140,${0.34*br})`); rg.addColorStop(0.5,'rgba(12,26,70,0.18)'); rg.addColorStop(1,'rgba(0,0,0,0)');
  g.fillStyle=rg; g.fillRect(0,0,VW.W,VW.H);
};
VW.vignette = () => {
  const g=VW.g, vg=g.createRadialGradient(540,860,520,540,960,1250);
  vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,0,0.72)');
  g.fillStyle=vg; g.fillRect(0,0,VW.W,VW.H);
};
// Cinematic floor: a soft mirror of the chart below the safe zone (no information lives there).
VW.reflection = (y0, y1, mirrorTop, alpha=0.16) => {
  const g=VW.g, h=y1-y0;
  const off=VW._ref||(VW._ref=document.createElement('canvas')); off.width=VW.W; off.height=h;
  const o=off.getContext('2d'); o.clearRect(0,0,VW.W,h);
  o.save(); o.translate(0,h); o.scale(1,-1); o.drawImage(VW.cv,0,mirrorTop-h,VW.W,h,0,0,VW.W,h); o.restore();
  o.globalCompositeOperation='destination-in';
  const gr=o.createLinearGradient(0,0,0,h); gr.addColorStop(0,'rgba(0,0,0,1)'); gr.addColorStop(1,'rgba(0,0,0,0)');
  o.fillStyle=gr; o.fillRect(0,0,VW.W,h); o.globalCompositeOperation='source-over';
  g.save(); g.globalAlpha=alpha; g.filter='blur(3px)'; g.drawImage(off,0,y0); g.restore();
};

// Perspective data floor below the safe zone: slow-moving grid that recedes to a horizon (decoration only).
VW.floor = (t, yTop) => {
  const g=VW.g, hz=yTop, cx=VW.SAFE.cx; g.save();
  const fade=g.createLinearGradient(0,hz,0,VW.H); fade.addColorStop(0,'rgba(90,140,255,0.10)'); fade.addColorStop(1,'rgba(90,140,255,0)');
  g.strokeStyle='rgba(90,140,255,0.16)'; g.lineWidth=1.2;
  for (let i=-14;i<=14;i++){ g.beginPath(); g.moveTo(cx+i*28,hz); g.lineTo(cx+i*260,VW.H); g.stroke(); }
  const sp=(t*0.35)%1;
  for (let j=0;j<12;j++){ const z=(j+sp)/12, y=hz+(VW.H-hz)*Math.pow(z,2.2); g.globalAlpha=0.25+0.75*z; g.beginPath(); g.moveTo(0,y); g.lineTo(VW.W,y); g.stroke(); }
  g.globalAlpha=1; g.fillStyle=fade; g.fillRect(0,hz,VW.W,VW.H-hz);
  const glow=g.createLinearGradient(0,hz-4,0,hz+40); glow.addColorStop(0,'rgba(120,160,255,0.35)'); glow.addColorStop(1,'rgba(120,160,255,0)'); g.fillStyle=glow; g.fillRect(0,hz-2,VW.W,42);
  g.restore();
};

// ---------- captions (word by word, white -> Volwick blue) ----------
// text length in visible characters (graphemes): Devanagari matras, Arabic harakat, emoji count as one
VW._seg = (typeof Intl!=='undefined' && Intl.Segmenter) ? new Intl.Segmenter() : null;
VW.glen = s => VW._seg ? [...VW._seg.segment(s)].length : s.length;
// caption groups never run across a pause or a sentence end, in any script
// opt.weakEnd: words that never close a line (articles, prepositions, conjunctions); opt.weakStart: words that never open one
VW.buildGroups = (words, maxWords=3, maxChars=17, opt={}) => {
  const gr=[]; let cur=[]; const bare=s=>s.toLowerCase().replace(/[.,:;!?"'»)\u060C\u061F\u0964]+$/,'');
  const WE=new Set((opt.weakEnd||[]).map(x=>x.toLowerCase())), WS=new Set((opt.weakStart||[]).map(x=>x.toLowerCase()));
  // opt.glue: multi-word terms never split across lines (e.g. "long gamma", "mapa de gamma")
  const nb=new Array(words.length).fill(false), B=words.map(w=>bare(w[0]));
  (opt.glue||[]).forEach(ph=>{ const p=ph.toLowerCase().split(' '); for (let i=0;i+p.length<=B.length;i++) if (p.every((x,j)=>B[i+j]===x)) for (let j=1;j<p.length;j++) nb[i+j]=true; });
  const endP=/[.,:;!?\u060C\u061F\u0964\u3001\u3002]$/;
  words.forEach((w,wi) => { const len=VW.glen(cur.map(x=>x[0]).join(' '));
    if (cur.length && (cur.length>=maxWords || len+VW.glen(w[0])+1>maxChars) && !(WS.has(bare(w[0])) && cur.length<=maxWords)) {
      let carry=[], k=wi;
      while (cur.length>(carry.length?0:1) && !endP.test(cur[cur.length-1][0]) && (WE.has(bare(cur[cur.length-1][0])) || nb[k])) { carry.unshift(cur.pop()); k--; }
      if (cur.length) gr.push(cur); cur=carry; }
    cur.push(w); if (/[.,:;?!\u0964\u0965\u061F\u060C\u061B\u3001\u3002\uFF1A\uFF01\uFF1F]["'\u00BB)]?$/.test(w[0])) { gr.push(cur); cur=[]; } });
  if (cur.length) gr.push(cur); return gr;
};
VW.captions = (t, groups, opt) => {
  const g=VW.g, {y, size=70, keySize=86, keys=new Set(), until=1e9, cx=VW.SAFE.cx} = opt;
  if (t>until) return;
  const grp=groups.find(gp=>t>=gp[0][1]-0.12 && t<=gp[gp.length-1][2]+0.28); if (!grp) return;
  const t0=grp[0][1]-0.12, pop=VW.eo(VW.lin(t,t0,t0+0.16));
  g.save(); g.textBaseline='alphabetic'; g.textAlign='left';
  const sizes=grp.map(w=>keys.has(w[0])?keySize:size);
  const widths=grp.map((w,i)=>{ g.font=`700 ${sizes[i]}px VWSans`; return g.measureText(w[0]).width; });
  const gap=20, total=widths.reduce((a,b)=>a+b,0)+gap*(grp.length-1);
  let x=cx-total/2;
  g.translate(cx,y); g.scale(0.92+0.08*pop,0.92+0.08*pop); g.translate(-cx,-y); g.globalAlpha=pop;
  grp.forEach((w,i)=>{ g.font=`700 ${sizes[i]}px VWSans`; g.shadowColor='rgba(0,0,0,0.85)'; g.shadowBlur=24;
    const kc=(keys instanceof Map)?keys.get(w[0]):null; g.fillStyle=t>=w[1]?(kc||VW.COL.blue):VW.COL.ink; g.fillText(w[0],x,y); x+=widths[i]+gap; });
  g.restore();
};

// ---------- QA overlay (only when ?guides=1) ----------
VW.guides = () => {
  if (!/guides=1/.test(location.search)) return;
  const g=VW.g, s=VW.SAFE; g.save();
  // shade what Instagram (orange) and TikTok (cyan) cover at full screen
  [[VW.UI.ig,'rgba(255,140,0,0.22)'],[VW.UI.tt,'rgba(0,220,255,0.18)']].forEach(([u,c])=>{ g.fillStyle=c;
    g.fillRect(0,0,VW.W,u.t); g.fillRect(0,VW.H-u.b,VW.W,u.b); g.fillRect(0,u.t,u.l,VW.H-u.t-u.b); g.fillRect(VW.W-u.r,u.t,u.r,VW.H-u.t-u.b); });
  g.setLineDash([10,8]); g.strokeStyle='rgba(255,0,120,0.9)'; g.lineWidth=3; g.strokeRect(s.x0,s.y0,s.x1-s.x0,s.y1-s.y0); g.restore();
};

// ---------- boot ----------
VW.loadImage = src => new Promise(r => { const im=new Image(); im.onload=()=>r(im); im.src=src; });
VW.loadFonts = async () => { for (const f of ['700 20px VWMono','600 20px VWMono','500 20px VWMono','700 20px VWSans','600 20px VWSans']) await document.fonts.load(f); };

// ---------- focus (v3 visual language): one protagonist at a time ----------
// Wrap the drawing of a secondary element: it dims and softly defocuses (2.5D depth of field).
// k = 0 protagonist (sharp, full), k = 1 background (dimmed + blurred).
VW._fstack=[];
VW.focusBegin = (k, dim=0.62, blur=3.2) => {
  // Fast defocus: the secondary layer is drawn into an offscreen canvas at reduced resolution
  // (r falls continuously with k) and scaled back up, which blurs it. Much cheaper than ctx.filter.
  const main=VW.g; if (k<=0.001){ main.save(); VW._fstack.push(null); return; }
  const r=Math.max(0.2, 1-0.17*blur*k), w=Math.ceil(VW.W*r), h=Math.ceil(VW.H*r);
  const off=document.createElement('canvas'); off.width=w; off.height=h; const o=off.getContext('2d');
  const m=main.getTransform(); o.setTransform(m.a*r,m.b*r,m.c*r,m.d*r,m.e*r,m.f*r);
  o.globalAlpha=1; VW._fstack.push({main, off, a:main.globalAlpha*(1-dim*k)}); VW.g=o; };
VW.focusEnd = () => { const f=VW._fstack.pop(); if (!f){ VW.g.restore(); return; }
  VW.g=f.main; const g=f.main; g.save(); g.setTransform(1,0,0,1,0,0); g.globalAlpha=f.a; g.imageSmoothingEnabled=true; g.imageSmoothingQuality='high';
  g.drawImage(f.off,0,0,VW.W,VW.H); g.restore(); };
// Slow continuous push-in inside every camera segment (looming): +amt scale across the segment.
VW.camAtLoom = (keys, t, amt=0.035) => {
  const c=VW.camAt(keys,t); let i=0; while (i<keys.length-1 && t>keys[i+1].t) i++;
  if (i>=keys.length-1) return c; const a=keys[i], b=keys[i+1], u=VW.clamp((t-a.t)/Math.max(0.001,b.t-a.t),0,1);
  return {s:c.s*(1+amt*Math.sin(Math.PI*u)), fx:c.fx, fy:c.fy}; };
