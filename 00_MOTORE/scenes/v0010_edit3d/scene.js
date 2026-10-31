// V0010 · EDIT 3D (T1, 31 Oct 2026). Full-page 3D motion edit, beat-for-beat on the reference edit Power uploaded
// (03_VIDEO_CONSIGLIATI/01_EDIT/snapgram.io_vumgpryxic1y.mp4, 12.4 s, ~86 BPM, beats at 1.37 2.09 2.79 3.48 4.18 ...).
// Structure of the reference, rebuilt for Volwick (no TradingView branding, our logo, our terminal):
//  light streaks → V monogram swings in (3D) → lockup V + VOLWICK → collapses into a dash → line → the PC terminal forms
//  (layer row, grid, walls, prints) → 3D light waves → full-page chart in 3D, price runs into the call wall, selection box
//  → 3D floating layer cards + "See the walls." → wall Net counter with pixel sweep → approved ending (VX.end).
// No hook (T1). Simulated ES session (fixed seed, tick 0.25), declared on screen. No forecasts, no P&L.
import * as THREE from './lib/three.module.min.js';
const { seg, lin, eo, eio, mix, clamp } = VW;
const T = { mono: 0.66, lock: 1.37, collapse: 1.70, line: 2.09, panel: 2.40, rows: 2.79, waves: 4.18, chart: 4.52, box: 5.30, wide: 5.92,
  cards: 6.27, word: 6.99, wordOut: 7.86, count: 8.0, end: 9.08, loop0: 12.0, total: 12.45 };
const BEATS = [1.37, 2.09, 2.79, 3.48, 4.18, 4.88, 5.62, 6.27, 6.99, 7.66, 8.36, 9.08, 9.78, 10.45];
const W = 1080, H = 1920;
// ---------- simulated session ----------
const P0 = 7731, PPX = 19.4, CY0 = 1440, PY = p => CY0 - (p - P0) * PPX;
const N = 120, SP = 7.0, BX = i => 40 + i * SP;
const WALLS = [ { p: 7777.50, fam: 'callS', net: '−$11.6M' }, { p: 7768.25, fam: 'callL', net: '+$22.4M', star: true },
  { p: 7752.75, fam: 'putS', net: '−$15.1M' }, { p: 7743.50, fam: 'putL', net: '+$9.7M' }, { p: 7735.25, fam: 'putS', net: '−$13.8M' } ];
const FAMC = { callL: '#39A86F', callS: '#49B7CC', putL: '#CF5D5D', putS: '#B16FD0' };
const STAR = { p: 7756.25, txt: '★ 7756.25  1,042 · 3 blocks' };
const PRINTS = [ { i: 37, p: 7736.0, q: '742 ×2', gold: true }, { i: 62, p: 7749.25, q: '386' }, { i: 79, p: 7756.25, q: '512' },
  { i: 86, p: 7756.25, q: '530' }, { i: 107, p: 7767.5, q: '830 ×2', gold: true } ];
let BARS = [];
function genBars() {
  const A = [[0, 7739], [14, 7744], [26, 7737.5], [37, 7735.75], [46, 7742], [58, 7749], [66, 7746], [76, 7753], [84, 7757], [92, 7754], [100, 7762], [107, 7767.5], [113, 7764.5], [119, 7766.5]];
  const r = VW.rng(20261031), q = x => Math.round(x * 4) / 4; let prev = 7738.75;
  for (let i = 0; i < N; i++) {
    let k = 0; while (A[k + 1][0] < i) k++; const [i0, p0] = A[k], [i1, p1] = A[k + 1];
    const c = q(mix(p0, p1, (i - i0) / (i1 - i0)) + (r() - 0.5) * 2.2), o = prev;
    const h = q(Math.max(o, c) + r() * 1.4), l = q(Math.min(o, c) - r() * 1.4);
    BARS.push({ o, h, l, c, v: 0.25 + r() * 0.75 + (i > 100 ? 0.4 : 0) }); prev = c;
  }
  BARS[107].h = 7768.0; BARS[37].l = 7735.5;
  PRINTS.forEach(pr => { const b = BARS[pr.i]; b.l = Math.min(b.l, pr.p); b.h = Math.max(b.h, pr.p); });
}
// ---------- 2D helpers on any context ----------
function on(g, fn) { const o = VW.g; VW.g = g; try { fn(g); } finally { VW.g = o; } }
function txt(g, s, x, y, font, col, al = 'left', bl = 'middle') { g.font = font; g.fillStyle = col; g.textAlign = al; g.textBaseline = bl; g.fillText(s, x, y); }
function rr(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function mkTex(w, h) { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const g = cv.getContext('2d');
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; tex.generateMipmaps = true; tex.minFilter = THREE.LinearMipmapLinearFilter; return { cv, g, tex }; }
// ---------- the terminal (PC look), full page 1080 x 1920 ----------
const HDR = [];   // header items laid out once
function layoutHeader(g) {
  const F = '600 26px VWMono', L = '600 20px VWMono';
  const row = (y, label, chips) => { let x = 110; g.font = L; HDR.push({ kind: 'label', s: label, x, y }); x += g.measureText(label).width + 16;
    chips.forEach(c => { g.font = F; const w = g.measureText(c.s).width + 26; HDR.push({ kind: 'chip', s: c.s, x, y, w, on: c.on }); x += w + 10; }); };
  HDR.push({ kind: 'wm', x: 110, y: 296 });
  row(358, 'DEALER', [{ s: 'WALLS Top 5', on: 1 }, { s: 'METRIC GEX', on: 1 }, { s: 'EXPIRY 0DTE', on: 1 }, { s: 'MAPS' }]);
  row(414, 'ACTIVITY', [{ s: 'BLOCK PRINTS', on: 1 }, { s: 'CVD' }, { s: 'CDI' }, { s: 'FLOW' }]);
}
function drawTerminal(g, s) {   // s: {hdr, grid, walls[], star, bars, prints, box, boxK, disc}
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  g.fillStyle = '#02050B'; g.fillRect(0, 0, W, H);
  const hz = g.createRadialGradient(540, 900, 50, 540, 900, 1200); hz.addColorStop(0, 'rgba(47,107,255,0.07)'); hz.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = hz; g.fillRect(0, 0, W, H);
  // header
  const n = HDR.length;
  HDR.forEach((h, i) => { const k = eo(clamp(s.hdr * n - i, 0, 1)); if (k <= 0) return; g.save(); g.globalAlpha = k; g.translate(0, (1 - k) * 14);
    if (h.kind === 'wm') { const wm = VW.assets.wm, hh = 44, ww = hh * wm.width / wm.height; g.globalCompositeOperation = 'lighter'; g.drawImage(wm, h.x, h.y - hh / 2, ww, hh); g.globalCompositeOperation = 'source-over';
      txt(g, '·  ES  ·  1m', h.x + ww + 18, h.y + 1, '600 28px VWMono', '#97A3B3'); }
    else if (h.kind === 'label') txt(g, h.s, h.x, h.y, '600 20px VWMono', '#5E6B80');
    else { rr(g, h.x, h.y - 22, h.w, 44, 10); g.fillStyle = h.on ? 'rgba(47,107,255,0.22)' : 'rgba(255,255,255,0.04)'; g.fill();
      g.strokeStyle = h.on ? 'rgba(110,155,255,0.75)' : 'rgba(150,170,210,0.22)'; g.lineWidth = 1.5; g.stroke();
      txt(g, h.s, h.x + 13, h.y + 1, '600 26px VWMono', h.on ? '#DCE6FF' : '#97A3B3'); }
    g.restore(); });
  if (s.hdr > 0) { g.save(); g.globalAlpha = clamp(s.hdr * 3, 0, 1); g.fillStyle = 'rgba(140,170,230,0.18)'; g.fillRect(0, 448, W * clamp(s.hdr * 2, 0, 1), 1.5); g.restore(); }
  // grid
  if (s.grid > 0) { g.save(); const gx = W * eo(s.grid);
    g.beginPath(); g.rect(0, 445, gx, 1095); g.clip();
    for (let x = 18; x < W; x += 36) { g.fillStyle = 'rgba(120,150,200,0.07)'; g.fillRect(x, 445, 1, 1095); }
    for (let p = 7732; p <= 7780; p += 4) { g.fillStyle = 'rgba(120,150,200,0.05)'; g.fillRect(0, PY(p), W, 1); }
    g.restore(); }
  // walls (glow lines that grow from the right edge, label at right)
  WALLS.forEach((w, j) => { const k = s.walls[j] || 0; if (k <= 0) return; const y = PY(w.p), c = FAMC[w.fam], x0 = W - W * eo(k);
    g.save(); const lg = g.createLinearGradient(0, 0, W, 0); lg.addColorStop(0, VW.rgba(c, 0.05)); lg.addColorStop(0.6, VW.rgba(c, 0.45)); lg.addColorStop(1, VW.rgba(c, 0.95));
    g.strokeStyle = lg; g.lineWidth = w.star ? 4 : 2.5; g.shadowColor = VW.rgba(c, 0.9); g.shadowBlur = w.star ? 22 : 12;
    g.beginPath(); g.moveTo(x0, y); g.lineTo(W, y); g.stroke(); g.restore();
    const kl = eo(lin(k, 0.55, 1)); if (kl > 0) { g.save(); g.globalAlpha = kl;
      const lab = `${w.star ? '★ ' : ''}${w.p.toLocaleString('en-US', { minimumFractionDigits: 2 })} · ${w.net}`;
      g.font = '700 26px VWMono'; const tw = g.measureText(lab).width; rr(g, 924 - tw - 30, y - 36, tw + 40, 34, 7); g.fillStyle = 'rgba(2,5,11,0.82)'; g.fill();
      g.fillStyle = c; g.beginPath(); g.arc(924 - tw - 16, y - 19, 5, 0, 7); g.fill(); txt(g, lab, 932, y - 18, '700 26px VWMono', c, 'right');
      g.restore(); } });
  // star block level (dashed white, label at left)
  if (s.star > 0) { const y = PY(STAR.p); g.save(); g.globalAlpha = eo(s.star); g.setLineDash([7, 6]); g.strokeStyle = 'rgba(235,240,250,0.75)'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(0, y); g.lineTo(W * eo(s.star), y); g.stroke(); g.setLineDash([]);
    g.font = '700 22px VWMono'; const tw = g.measureText(STAR.txt).width; g.beginPath(); g.moveTo(110, y - 19); g.lineTo(110 + tw + 26, y - 19); g.lineTo(110 + tw + 40, y); g.lineTo(110 + tw + 26, y + 19); g.lineTo(110, y + 19); g.closePath();
    g.fillStyle = 'rgba(8,12,22,0.95)'; g.fill(); g.strokeStyle = 'rgba(235,240,250,0.8)'; g.lineWidth = 1.5; g.stroke(); txt(g, STAR.txt, 122, y + 1, '700 22px VWMono', '#ECEFF4'); g.restore(); }
  // candles + volume
  const nb = Math.min(N, s.bars);
  for (let i = 0; i < Math.ceil(nb); i++) { const b = BARS[i], a = clamp(nb - i, 0, 1), x = BX(i), up = b.c >= b.o, c = up ? '#2FB67C' : '#E2575F';
    g.globalAlpha = a; g.fillStyle = c; g.fillRect(x - 0.6, PY(b.h), 1.6, PY(b.l) - PY(b.h));
    const y0 = PY(Math.max(b.o, b.c)), hh = Math.max(2, PY(Math.min(b.o, b.c)) - y0); g.fillRect(x - 2.4, y0, 5, hh);
    g.globalAlpha = a * 0.55; const vh = b.v * 62; g.fillRect(x - 2.4, 1522 - vh, 5, vh); }
  g.globalAlpha = 1;
  // block prints
  PRINTS.forEach(pr => { const k = clamp((nb - pr.i) * 0.5, 0, 1) * (s.prints ?? 1); if (k <= 0) return; const x = BX(pr.i), y = PY(pr.p);
    g.save(); g.globalAlpha = k; g.fillStyle = '#F4F6FA'; g.shadowColor = 'rgba(255,255,255,0.6)'; g.shadowBlur = 8; g.fillRect(x - 22, y - 2.5, 44, 5); g.shadowBlur = 0;
    g.translate(x, y); g.rotate(Math.PI / 4); g.fillStyle = pr.gold ? '#F2C14E' : '#F4F6FA'; g.fillRect(-6, -6, 12, 12); g.rotate(-Math.PI / 4);
    g.font = '700 21px VWMono'; const tw = g.measureText(pr.q).width, bx = 16, by = -40; rr(g, bx, by, tw + 18, 30, 6); g.fillStyle = pr.gold ? '#F2C14E' : '#E9EDF5'; g.fill();
    txt(g, pr.q, bx + 9, by + 16, '700 21px VWMono', '#0A0E16'); g.restore(); });
  // selection box (dashed, drawn progressively) around the touch of the call wall
  if (s.box > 0) { const x0 = BX(97), x1 = BX(116), y0 = PY(7771), y1 = PY(7759.5), per = 2 * (x1 - x0 + y1 - y0), L = per * eo(s.box);
    g.save(); g.globalAlpha = s.boxK ?? 1; g.setLineDash([9, 7]); g.strokeStyle = 'rgba(255,214,102,0.95)'; g.lineWidth = 2.5; g.shadowColor = 'rgba(255,200,80,0.6)'; g.shadowBlur = 10;
    g.lineDashOffset = 0; g.beginPath(); const pts = [[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]]; let left = L; g.moveTo(x0, y0);
    for (let k = 1; k < pts.length && left > 0; k++) { const [ax, ay] = pts[k - 1], [bx, by] = pts[k], d = Math.hypot(bx - ax, by - ay), f = Math.min(1, left / d); g.lineTo(ax + (bx - ax) * f, ay + (by - ay) * f); left -= d; }
    g.stroke(); g.restore(); }
  if (s.disc > 0) { g.save(); g.globalAlpha = s.disc; txt(g, 'Simulated ES session. Dealer Walls: modeled positioning.', 540, 1536, '500 19px VWMono', '#7F8AA0', 'center'); g.restore(); }
}
// ---------- layer cards (3D) ----------
const CARDS = [
  { t: 'DEALER WALLS', c: '#39A86F', draw: (g, w, h) => { WALLS.slice(0, 4).forEach((wl, j) => { const y = 120 + j * 52, c = FAMC[wl.fam]; g.strokeStyle = c; g.lineWidth = 3; g.shadowColor = c; g.shadowBlur = 10; g.beginPath(); g.moveTo(30, y); g.lineTo(w - 30, y); g.stroke(); g.shadowBlur = 0; txt(g, `${wl.p.toFixed(2)} · ${wl.net}`, w - 30, y - 16, '700 20px VWMono', c, 'right'); }); } },
  { t: 'BLOCK PRINTS', c: '#F2C14E', draw: (g, w, h) => { txt(g, '★ 7756.25', 30, 140, '700 46px VWMono', '#ECEFF4'); txt(g, '1,042 · 3 blocks', 30, 196, '600 26px VWMono', '#97A3B3');
      [[360, 250, '742 ×2', 1], [250, 280, '512', 0]].forEach(([x, y, q, gd]) => { g.fillStyle = '#F4F6FA'; g.fillRect(x - 26, y - 3, 52, 6); g.save(); g.translate(x, y); g.rotate(Math.PI / 4); g.fillStyle = gd ? '#F2C14E' : '#F4F6FA'; g.fillRect(-7, -7, 14, 14); g.restore();
        g.font = '700 20px VWMono'; const tw = g.measureText(q).width; rr(g, x + 18, y - 42, tw + 16, 28, 6); g.fillStyle = gd ? '#F2C14E' : '#E9EDF5'; g.fill(); txt(g, q, x + 26, y - 27, '700 20px VWMono', '#0A0E16'); }); } },
  { t: 'CVD', c: '#DCE6FF', draw: (g, w, h) => { const r = VW.rng(7); let v = 0; g.strokeStyle = '#DCE6FF'; g.lineWidth = 3.5; g.shadowColor = 'rgba(200,215,255,0.7)'; g.shadowBlur = 10; g.beginPath();
      for (let i = 0; i <= 60; i++) { v += (r() - 0.42) * 9; g[i ? 'lineTo' : 'moveTo'](30 + i * (w - 60) / 60, 230 - v); } g.stroke(); g.shadowBlur = 0; g.fillStyle = 'rgba(150,170,210,0.25)'; g.fillRect(30, 230, w - 60, 1.5); } },
  { t: 'METRIC', c: '#5A8CFF', draw: (g, w, h) => { ['GEX', 'CEX', 'DEX', 'ALL'].forEach((m, j) => { const x = 30 + j * 122; rr(g, x, 120, 108, 64, 12); g.fillStyle = j ? 'rgba(255,255,255,0.05)' : 'rgba(47,107,255,0.35)'; g.fill(); g.strokeStyle = j ? 'rgba(150,170,210,0.3)' : '#8AB6FF'; g.lineWidth = 2; g.stroke(); txt(g, m, x + 54, 153, '700 26px VWMono', j ? '#97A3B3' : '#ECEFF4', 'center'); });
      txt(g, 'dealer exposure per 1-pt move', 30, 240, '600 21px VWMono', '#7F8AA0'); } },
  { t: 'EXPIRY', c: '#8AB6FF', draw: (g, w, h) => { ['0DTE', 'WEEK', 'MONTH', 'ALL'].forEach((m, j) => { const x = 30 + j * 122; rr(g, x, 120, 108, 64, 12); g.fillStyle = j ? 'rgba(255,255,255,0.05)' : 'rgba(47,107,255,0.35)'; g.fill(); g.strokeStyle = j ? 'rgba(150,170,210,0.3)' : '#8AB6FF'; g.lineWidth = 2; g.stroke(); txt(g, m, x + 54, 153, '700 24px VWMono', j ? '#97A3B3' : '#ECEFF4', 'center'); });
      txt(g, '0DTE · 38 strikes', 30, 240, '600 22px VWMono', '#7F8AA0'); } },
  { t: 'MAPS', c: '#F59228', draw: (g, w, h) => { const r = VW.rng(11); for (let cx = 0; cx < 14; cx++) for (let cy = 0; cy < 6; cy++) { const v = Math.sin(cx * 0.5 + cy * 0.9) + (r() - 0.5) * 0.6; g.fillStyle = v > 0 ? `rgba(47,107,255,${0.25 + 0.5 * Math.min(1, v)})` : `rgba(245,146,40,${0.25 + 0.5 * Math.min(1, -v)})`; g.fillRect(30 + cx * 36, 100 + cy * 30, 33, 27); }
      txt(g, 'MAP · GAMMA', 30, 300, '600 21px VWMono', '#7F8AA0'); } },
  { t: 'CDI', c: '#E2575F', draw: (g, w, h) => { const r = VW.rng(5); for (let i = 0; i < 40; i++) { const v = (r() - 0.45) * 50 + (i === 27 ? 120 : 0), x = 30 + i * 12.5; g.fillStyle = v > 0 ? '#2FB67C' : '#E2575F'; g.fillRect(x, v > 0 ? 210 - v : 210, 8, Math.abs(v)); }
      txt(g, '$6.4M', 30 + 27 * 12.5 + 4, 70, '700 22px VWMono', '#2FB67C', 'center'); txt(g, 'C $2.1M · P $2.6M · Single-leg', 30, 300, '600 19px VWMono', '#7F8AA0'); } },
  { t: 'FLOW', c: '#2F6BFF', draw: (g, w, h) => { const r = VW.rng(9); [['C', '#2FB67C', 0.3], ['P', '#E2575F', -0.25], ['NET', '#DCE6FF', 0.05]].forEach(([nm, c, d]) => { let v = 0; g.strokeStyle = c; g.lineWidth = 3; g.beginPath();
      for (let i = 0; i <= 40; i++) { v += (r() - 0.5 + d) * 8; g[i ? 'lineTo' : 'moveTo'](30 + i * 11, 200 - v); } g.stroke(); txt(g, nm, w - 30, 200 - v, '700 20px VWMono', c, 'right'); }); } },
];
function cardTexture(cd) { const w = 560, h = 340, t = mkTex(w, h), g = t.g;
  const bg = g.createLinearGradient(0, 0, w, h); bg.addColorStop(0, '#0E1A33'); bg.addColorStop(1, '#070C18'); rr(g, 2, 2, w - 4, h - 4, 28); g.fillStyle = bg; g.fill();
  g.strokeStyle = 'rgba(120,160,255,0.45)'; g.lineWidth = 3; g.stroke();
  g.fillStyle = cd.c; g.beginPath(); g.arc(40, 50, 8, 0, 7); g.fill(); txt(g, cd.t, 60, 51, '700 28px VWMono', '#ECEFF4');
  g.save(); g.beginPath(); rr(g, 2, 2, w - 4, h - 4, 28); g.clip(); cd.draw(g, w, h); g.restore();
  const sh = g.createLinearGradient(0, 0, w, h); sh.addColorStop(0, 'rgba(255,255,255,0.07)'); sh.addColorStop(0.4, 'rgba(255,255,255,0)'); rr(g, 2, 2, w - 4, h - 4, 28); g.fillStyle = sh; g.fill();
  t.tex.needsUpdate = true; return t.tex; }
// ---------- three.js ----------
let R, CAM, S_LOGO, S_TERM, S_WAVE, S_CARDS, mono, wm, ghost, term, termTex, wave, waveGeo, cardsG, cardMeshes = [], gl;
const D = 960 / Math.tan(THREE.MathUtils.degToRad(17.5));
function logoMat(img) { const t = new THREE.Texture(img); t.colorSpace = THREE.SRGBColorSpace; t.needsUpdate = true;
  return new THREE.ShaderMaterial({ uniforms: { map: { value: t }, op: { value: 1 }, rev: { value: 1 }, glow: { value: 0 } }, transparent: true, depthWrite: false, premultipliedAlpha: true, blending: THREE.NormalBlending,
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: 'uniform sampler2D map; uniform float op, rev, glow; varying vec2 vUv; void main(){ if (vUv.x > rev) discard; vec3 c = texture2D(map, vUv).rgb; float e = smoothstep(rev-0.04, rev, vUv.x)*glow; vec3 o = c*op + vec3(0.55,0.7,1.0)*e*op; float a = clamp(max(o.r, max(o.g, o.b)), 0.0, 1.0); gl_FragColor = vec4(o, a); }' }); }
function build3D() {
  gl = document.createElement('canvas'); gl.width = W; gl.height = H;
  R = new THREE.WebGLRenderer({ canvas: gl, antialias: true, alpha: true, preserveDrawingBuffer: true });
  R.setPixelRatio(1); R.setSize(W, H, false); R.outputColorSpace = THREE.SRGBColorSpace; R.setClearColor(0x000000, 0);
  CAM = new THREE.PerspectiveCamera(35, W / H, 10, 30000);
  // logo
  S_LOGO = new THREE.Scene();
  mono = new THREE.Mesh(new THREE.PlaneGeometry(520, 520), logoMat(VW.assets.mono)); S_LOGO.add(mono);
  const wa = VW.assets.wm; wm = new THREE.Mesh(new THREE.PlaneGeometry(600, 600 * wa.height / wa.width), logoMat(wa)); S_LOGO.add(wm);
  // terminal plane
  S_TERM = new THREE.Scene(); termTex = mkTex(W, H); on(termTex.g, layoutHeader);
  term = new THREE.Mesh(new THREE.PlaneGeometry(W, H), new THREE.MeshBasicMaterial({ map: termTex.tex, transparent: true })); S_TERM.add(term);
  // light waves
  S_WAVE = new THREE.Scene(); S_WAVE.fog = new THREE.Fog(0x02050b, 1500, 7000);
  waveGeo = new THREE.PlaneGeometry(9000, 9000, 150, 150); waveGeo.rotateX(-Math.PI / 2);
  wave = new THREE.Mesh(waveGeo, new THREE.ShaderMaterial({ uniforms: { fogColor: { value: new THREE.Color(0x02050b) }, fogNear: { value: 1500 }, fogFar: { value: 7000 } }, fog: true, side: THREE.DoubleSide,
    vertexShader: '#include <fog_pars_vertex>\nvarying vec3 vW; void main(){ vW=(modelMatrix*vec4(position,1.0)).xyz; vec4 mvPosition=modelViewMatrix*vec4(position,1.0); gl_Position=projectionMatrix*mvPosition;\n#include <fog_vertex>\n}',
    fragmentShader: '#include <fog_pars_fragment>\nvarying vec3 vW; void main(){ vec3 n=normalize(cross(dFdx(vW),dFdy(vW))); float l=clamp(dot(n,normalize(vec3(0.3,0.9,0.4))),0.0,1.0); float s=0.5+0.5*sin(vW.x*0.035); float rib=smoothstep(0.82,1.0,s); vec3 base=mix(vec3(0.02,0.06,0.20),vec3(0.18,0.42,1.0),pow(l,3.0)); base+=vec3(0.45,0.65,1.0)*rib*0.55*l; gl_FragColor=vec4(base,1.0);\n#include <fog_fragment>\n}' }));
  S_WAVE.add(wave);
  // cards
  S_CARDS = new THREE.Scene(); S_CARDS.fog = new THREE.Fog(0x061024, 2600, 5200); cardsG = new THREE.Group(); S_CARDS.add(cardsG);
  const side = new THREE.MeshBasicMaterial({ color: 0x1b2c55 });
  const POS = [[-250, 560, -200], [260, 330, 120], [-300, 40, 260], [280, -230, -100], [-220, -520, 120], [300, -760, -300], [-40, 860, -600], [60, -1000, 300]];
  CARDS.forEach((cd, j) => { const m = new THREE.Mesh(new THREE.BoxGeometry(560, 340, 16), [side, side, side, side, new THREE.MeshBasicMaterial({ map: cardTexture(cd), transparent: true, fog: true }), side]);
    m.userData.p = POS[j]; m.userData.r = [(j % 3 - 1) * 0.12, (j % 2 ? -0.35 : 0.3), (j % 4 - 1.5) * 0.06]; cardsG.add(m); cardMeshes.push(m); });
}
function setCam(x = 0, y = 0, z = D, lx = 0, ly = 0, lz = 0, roll = 0) { CAM.position.set(x, y, z); CAM.up.set(Math.sin(roll), Math.cos(roll), 0); CAM.lookAt(lx, ly, lz); }
// ---------- per-section animation ----------
function updWave(t) { const p = waveGeo.attributes.position, a = p.array;
  for (let i = 0; i < p.count; i++) { const x = a[i * 3], z = a[i * 3 + 2];
    a[i * 3 + 1] = 260 * Math.sin(x * 0.0016 + t * 3.1) * Math.cos(z * 0.0012 - t * 2.2) + 140 * Math.sin((x + z) * 0.003 + t * 4) + 60 * Math.sin(x * 0.009 - t * 6); }
  p.needsUpdate = true; }
function streaks(g, t) {   // reference intro: coloured light trails sweeping a dark grid
  const A = [ { c: '#39A86F', cx: 760, cy: 520, r: 420, a0: -2.6, sp: 4.2, d: 0.05 }, { c: '#CF5D5D', cx: 300, cy: 1260, r: 380, a0: 0.9, sp: -4.6, d: 0.0 },
    { c: '#5A8CFF', cx: 560, cy: 980, r: 640, a0: 2.2, sp: 3.4, d: 0.1 }, { c: '#49B7CC', cx: 840, cy: 1500, r: 300, a0: -1.0, sp: 5.2, d: 0.18 }, { c: '#FFFFFF', cx: 460, cy: 760, r: 520, a0: -0.4, sp: 5.6, d: 0.42 } ];
  g.save(); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round';
  A.forEach(s => { const u = t - s.d; if (u <= 0 || u > 0.75) return; const fade = Math.sin(Math.PI * clamp(u / 0.75, 0, 1)), head = s.a0 + s.sp * u;
    for (let k = 0; k < 26; k++) { const a1 = head - Math.sign(s.sp) * k * 0.035, a2 = a1 - Math.sign(s.sp) * 0.035, f = 1 - k / 26;
      g.strokeStyle = VW.rgba(s.c, 0.9 * f * fade); g.lineWidth = 2 + 13 * f; g.shadowColor = s.c; g.shadowBlur = 28 * f;
      g.beginPath(); g.moveTo(s.cx + Math.cos(a1) * s.r, s.cy + Math.sin(a1) * s.r * 0.75); g.lineTo(s.cx + Math.cos(a2) * s.r, s.cy + Math.sin(a2) * s.r * 0.75); g.stroke(); } });
  g.restore(); }
function bgPage(g, t, col1 = '#05091A', col2 = '#02040A', glowA = 0.1) { const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, col1); bg.addColorStop(1, col2); g.fillStyle = bg; g.fillRect(0, 0, W, H);
  const hz = g.createRadialGradient(540, 960, 40, 540, 960, 1150); hz.addColorStop(0, `rgba(47,107,255,${glowA})`); hz.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = hz; g.fillRect(0, 0, W, H); }
function blit(g, a = 1, filter = 'none') { g.save(); g.globalAlpha = a; g.filter = filter; g.drawImage(gl, 0, 0); g.restore(); }
function termState(t) {   // what the terminal shows at time t
  const s = { hdr: lin(t, T.panel + 0.05, T.rows + 0.35), grid: lin(t, T.rows, T.rows + 0.4), walls: WALLS.map((w, j) => lin(t, 3.05 + j * 0.13, 3.05 + j * 0.13 + 0.32)),
    star: lin(t, 3.62, 3.95), bars: t < T.chart ? 26 * eo(lin(t, 3.48, 4.18)) : mix(26, N, eio(lin(t, T.chart, 5.75))), prints: 1,
    box: lin(t, T.box, T.box + 0.42), boxK: 1 - lin(t, T.wide + 0.1, T.wide + 0.3), disc: lin(t, 3.2, 3.5) };
  return s; }
// pixel sweep + counter (reference: number counting up through green squares, here the call wall Net)
function counter(g, t) {
  bgPage(g, t, '#040A1C', '#02040A', 0.16 * eo(lin(t, T.count, T.count + 0.3)));
  const sw = lin(t, T.count + 0.1, T.end - 0.05), r = VW.rng(99);
  g.save(); g.globalCompositeOperation = 'lighter';
  for (let gx = 0; gx < 18; gx++) for (let gy = 0; gy < 32; gy++) { const x = gx * 60 + 2, y = gy * 60 + 2, d = (gx * 0.6 + (31 - gy) * 0.35) / 30, rv = r();
    const k = Math.exp(-Math.pow((sw * 1.6 - d - 0.15) / 0.12, 2)) * (0.35 + 0.65 * rv); if (k < 0.03) continue;
    g.fillStyle = `rgba(70,120,255,${0.55 * k})`; g.fillRect(x, y, 56, 56); g.strokeStyle = `rgba(150,190,255,${0.7 * k})`; g.lineWidth = 2; g.strokeRect(x + 1, y + 1, 54, 54); }
  g.restore();
  // streak at the start
  const sk = lin(t, T.count, T.count + 0.28); if (sk > 0 && sk < 1) { g.save(); g.globalCompositeOperation = 'lighter'; const x = mix(-200, 1300, eio(sk)), lg = g.createLinearGradient(x - 500, 0, x, 0);
    lg.addColorStop(0, 'rgba(90,140,255,0)'); lg.addColorStop(1, 'rgba(200,220,255,0.95)'); g.fillStyle = lg; g.shadowColor = '#5A8CFF'; g.shadowBlur = 40; g.fillRect(x - 500, 950, 500, 10); g.restore(); }
  const k = eo(lin(t, T.count + 0.18, T.count + 0.4)); if (k <= 0) return;
  const v = mix(4.7, 22.4, eio(lin(t, T.count + 0.2, T.end - 0.25))), blur = Math.abs(Math.sin(Math.PI * lin(t, T.count + 0.2, T.end - 0.25))) * 6;
  g.save(); g.globalAlpha = k; g.fillStyle = FAMC.callL; g.beginPath(); g.arc(300, 812, 9, 0, 7); g.fill();
  txt(g, 'CALL WALL · LONG γ · 7,768.25', 322, 813, '700 30px VWMono', '#97A3B3');
  g.filter = `blur(${blur.toFixed(1)}px)`; g.shadowColor = 'rgba(57,168,111,0.7)'; g.shadowBlur = 40;
  txt(g, `+$${v.toFixed(1)}M`, 540, 930, '700 170px VWSans', '#ECEFF4', 'center'); g.filter = 'none'; g.shadowBlur = 0;
  txt(g, 'NET · dealer exposure per 1-pt move', 540, 1040, '600 26px VWMono', '#7F8AA0', 'center'); g.restore();
  // the session's price line draws under the number: it is the line that folds into the V
  const pk = eo(lin(t, T.count + 0.35, T.end - 0.1)); if (pk > 0) { g.save(); g.strokeStyle = '#8AB6FF'; g.lineWidth = 4; g.shadowColor = 'rgba(90,140,255,0.8)'; g.shadowBlur = 14; g.beginPath();
    ENDPTS.forEach(([x, y], i) => { if (i / (ENDPTS.length - 1) <= pk) g[i ? 'lineTo' : 'moveTo'](x, y); }); g.stroke(); g.restore(); }
}
let ENDPTS = [];
// ---------- render ----------
function render(t) {
  const g = VW.g; g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.filter = 'none'; g.globalCompositeOperation = 'source-over';
  if (t < T.panel) {   // streaks, monogram, lockup, collapse
    bgPage(g, t, '#04081A', '#010308', 0.06 + 0.12 * eo(lin(t, T.mono, T.lock)));
    const ca = 0.42 * eo(lin(t, 0.2, 0.6)) * (1 - lin(t, 1.25, 1.6));   // faint chart behind, like the reference
    if (ca > 0) { drawTerminal(termTex.g, { hdr: 0, grid: 1, walls: [], star: 0, bars: N * eo(lin(t, 0.15, 1.2)), prints: 0, box: 0, disc: 0 }); g.save(); g.globalAlpha = ca; g.drawImage(termTex.cv, 0, -120); g.restore(); }
    streaks(g, t);
    // 3D logo
    const k = eo(lin(t, T.mono, T.mono + 0.42)), lk = eio(lin(t, T.lock, T.lock + 0.3)), cl = eio(lin(t, T.collapse, T.collapse + 0.3));
    if (k > 0) {
      const sc = mix(1, 0.34, lk) * mix(1, 0.06, cl);
      mono.position.set(mix(0, -350, lk), mix(80, 80, lk) + cl * 260, mix(-1400, 0, k)); mono.rotation.set(mix(-0.5, 0, k), mix(1.5, 0, k) + 0.12 * Math.sin(t * 2), 0);
      mono.scale.set(sc * mix(1, 0.4, cl), sc, 1); mono.material.uniforms.op.value = k * (1 - lin(t, T.collapse + 0.15, T.collapse + 0.3));
      wm.position.set(mix(170, 150, lk), 80 + cl * 260, 0); wm.rotation.set(0, mix(0.35, 0.04, lk), 0); wm.scale.set(mix(1, 0.08, cl), mix(1, 0.3, cl), 1);
      wm.material.uniforms.rev.value = lin(t, T.lock + 0.05, T.lock + 0.32); wm.material.uniforms.glow.value = 1 - lin(t, T.lock + 0.3, T.lock + 0.45);
      wm.material.uniforms.op.value = 1 - lin(t, T.collapse + 0.18, T.collapse + 0.3); wm.visible = t > T.lock;
      setCam(0, 0, D - 260 * eo(lin(t, T.mono, 1.7)), 0, 0, 0, 0.05 * (1 - k)); R.render(S_LOGO, CAM); blit(g);
      // ghost of the lockup sinking away, blurred
      const gk = lin(t, T.collapse, T.collapse + 0.5); if (gk > 0 && gk < 1) { const wmI = VW.assets.wm, ww = 600 * 0.9, hh = ww * wmI.height / wmI.width; g.save(); g.globalCompositeOperation = 'lighter';
        g.globalAlpha = 0.35 * (1 - gk); g.filter = 'blur(7px)'; g.drawImage(wmI, 540 - ww / 2 + 40, 880 - hh / 2 + gk * 320, ww, hh); g.restore(); }
    }
    // dash → line
    const dk = lin(t, T.collapse + 0.22, T.panel + 0.1); if (dk > 0) { const y = 880 - 260 - 0 + mix(0, -180, eio(lin(t, T.line, T.line + 0.25))), half = mix(26, 470, eio(lin(t, T.line, T.line + 0.28)));
      g.save(); g.globalCompositeOperation = 'lighter'; g.shadowColor = '#AFC6FF'; g.shadowBlur = 24; g.fillStyle = '#F4F7FF'; rr(g, 540 - half, y - 5, half * 2, 10, 5); g.fill(); g.restore(); }
  }
  else if (t < T.waves) {   // the PC terminal forms (flat-ish 3D, slow push)
    drawTerminal(termTex.g, termState(t)); termTex.tex.needsUpdate = true;
    // header line comes from the dash: map dash y 440 to the header rule
    const k = eio(lin(t, T.panel, T.waves));
    term.position.set(0, 0, mix(-160, 140, k)); term.rotation.set(mix(0.16, 0.02, k), mix(-0.1, 0.06, k), 0); term.scale.set(1, 1, 1);
    setCam(0, 0, D); bgPage(g, t, '#02050B', '#02050B', 0.05); R.render(S_TERM, CAM); blit(g);
  }
  else if (t < T.chart) {   // 3D light waves (transition)
    updWave(t); const k = lin(t, T.waves, T.chart);
    setCam(mix(-400, 300, k), mix(900, 520, k), mix(2600, -600, eio(k)), mix(0, 200, k), mix(-200, -60, k), mix(-2000, -4200, k), mix(0.25, -0.1, k));
    bgPage(g, t, '#02050B', '#03081A', 0.12); R.render(S_WAVE, CAM); blit(g);
    const fl = 1 - lin(t, T.waves, T.waves + 0.1); if (fl > 0) { g.fillStyle = `rgba(220,230,255,${0.5 * fl})`; g.fillRect(0, 0, W, H); }
  }
  else if (t < T.cards) {   // full-page chart in 3D: lies down, stands up, pushes into the wall touch, zooms out
    drawTerminal(termTex.g, termState(t)); termTex.tex.needsUpdate = true;
    const up = eo(lin(t, T.chart, T.chart + 0.5)), push = eio(lin(t, 5.0, 5.55)), out = eio(lin(t, T.wide, T.cards));
    const fx = BX(106) - 540, fy = 960 - PY(7766); const s = 1 + 0.55 * push - 0.7 * out;
    term.scale.set(s, s, 1); term.position.set(-fx * (s - 1) * (1 - out) , -fy * (s - 1) * (1 - out) + mix(-500, 0, up), mix(-900, 0, up) - 600 * out);
    term.rotation.set(mix(-1.1, 0, up) + 0.25 * out, 0.18 * out - 0.06 * (1 - up), 0.05 * out);
    setCam(0, 0, D); bgPage(g, t, '#02050B', '#02050B', 0.05); R.render(S_TERM, CAM); blit(g);
    if (t >= T.chart && t < T.chart + 0.12) { g.fillStyle = `rgba(220,230,255,${0.35 * (1 - lin(t, T.chart, T.chart + 0.12))})`; g.fillRect(0, 0, W, H); }
    const bl = lin(t, T.cards - 0.12, T.cards); if (bl > 0) { g.fillStyle = `rgba(30,70,200,${0.6 * bl})`; g.fillRect(0, 0, W, H); }
  }
  else if (t < T.count) {   // 3D layer cards
    bgPage(g, t, '#0A1A40', '#040A1C', 0.3);
    const k = lin(t, T.cards, T.count);
    cardMeshes.forEach((m, j) => { const [x, y, z] = m.userData.p, [rx, ry, rz] = m.userData.r, e = eo(lin(t, T.cards + j * 0.04, T.cards + j * 0.04 + 0.45));
      m.position.set(x * mix(1.8, 1, e), y * mix(1.5, 1, e), mix(-3000, z, e)); m.rotation.set(rx + (1 - e) * 0.8, ry + (1 - e) * 1.2, rz); });
    cardsG.rotation.set(mix(0.28, 0.1, k), mix(0.55, -0.35, eio(k)), mix(-0.08, 0.06, k));
    setCam(0, 0, mix(D + 500, D - 300, eio(k))); R.render(S_CARDS, CAM);
    const bl = 1 - lin(t, T.cards, T.cards + 0.25); blit(g, 1, bl > 0.02 ? `blur(${(14 * bl).toFixed(1)}px)` : 'none');
    // big words, in from the right on the beat, out to the left
    const wk = eo(lin(t, T.word, T.word + 0.32)), wo = eio(lin(t, T.wordOut, T.count));
    if (wk > 0) { g.save(); const x = mix(1200, 540, wk) - wo * 1300; g.shadowColor = 'rgba(0,0,0,0.85)'; g.shadowBlur = 50; g.filter = wk < 1 || wo > 0 ? `blur(${(4 * (1 - wk) + 6 * wo).toFixed(1)}px)` : 'none';
      txt(g, 'See the walls.', x, 1000, '700 124px VWSans', '#FFFFFF', 'center'); g.restore(); }
  }
  else if (t < T.end) counter(g, t);
  if (t >= T.end) { const k = eo(lin(t, T.end, T.end + 0.2)); g.save(); g.globalAlpha = k; g.fillStyle = '#040913'; g.fillRect(0, 0, W, H); g.restore();
    VX.end(t, ENDPTS, { t0: T.end, total: T.total, loop0: T.loop0 }); }
  // beat flashes
  const fl = VW.punch([T.lock, T.line, T.cards, T.count, T.end], t, 0.04); if (fl > 0.02) { g.fillStyle = `rgba(210,225,255,${0.16 * fl})`; g.fillRect(0, 0, W, H); }
  if (t < T.end) VW.vignette();
}
window.READY = (async () => {
  await VW.loadFonts(); await VW.loadBrand(); genBars();
  const cl = BARS.map(b => b.c), lo = Math.min(...cl), hi = Math.max(...cl);
  for (let k = 0; k < 48; k++) { const i = Math.round(k * (N - 1) / 47); ENDPTS.push([120 + k * (840 / 47), 1300 - (cl[i] - lo) / (hi - lo) * 150]); }
  build3D(); window.render = render; render(0);
  return { total: T.total, events: { T, beats: BEATS } };
})();
