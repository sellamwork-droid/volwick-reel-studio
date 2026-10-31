import * as THREE from './lib/three.module.min.js';
// 4K: index.html?k4=1 draws everything at 2x (2160 x 3840); glow, blur and letter spacing follow the factor
const K = new URLSearchParams(location.search).get('k4') ? 2 : 1;
{ const P = CanvasRenderingContext2D.prototype, sb = Object.getOwnPropertyDescriptor(P, 'shadowBlur'), fl = Object.getOwnPropertyDescriptor(P, 'filter'), ls = Object.getOwnPropertyDescriptor(P, 'letterSpacing');
  Object.defineProperty(P, 'shadowBlur', { set(v) { sb.set.call(this, v * (this.__k || 1)); }, get() { return sb.get.call(this) / (this.__k || 1); } });
  Object.defineProperty(P, 'filter', { set(v) { fl.set.call(this, String(v).replace(/([\d.]+)px/g, (m, n) => (parseFloat(n) * (this.__k || 1)) + 'px')); }, get() { return fl.get.call(this); } });
  if (ls) Object.defineProperty(P, 'letterSpacing', { set(v) { ls.set.call(this, String(v).replace(/([\d.]+)px/g, (m, n) => (parseFloat(n) * (this.__k || 1)) + 'px')); }, get() { return ls.get.call(this); } }); }
if (K > 1) { VW.cv.width = 1080 * K; VW.cv.height = 1920 * K; VW.cv.style.width = '1080px'; VW.cv.style.height = '1920px'; VW.g = VW.cv.getContext('2d'); }
VW.g.__k = K;
const { lin, eo, eio, mix, clamp } = VW;
const W = 1080, H = 1920;
// ---------- simulated session (fixed seed, tick 0.25) ----------
const P0 = 7731, PPX = 17, CY0 = 1300, PY = p => CY0 - (p - P0) * PPX;
const N = 120, SP = 7.0, BX = i => 40 + i * SP;
const WALLS = [ { p: 7777.50, fam: 'callS', net: '−$11.6M' }, { p: 7768.25, fam: 'callL', net: '+$22.4M', star: true },
  { p: 7752.75, fam: 'putS', net: '−$15.1M' }, { p: 7743.50, fam: 'putL', net: '+$9.7M' }, { p: 7735.25, fam: 'putS', net: '−$13.8M' } ];
const FAMC = { callL: '#39A86F', callS: '#49B7CC', putL: '#CF5D5D', putS: '#B16FD0' };
const STAR = { p: 7756.25, txt: '★ 7756.25  1,042 · 3 blocks' };
const PRINTS = [ { i: 37, p: 7736.0, q: '742 ×2', gold: true }, { i: 62, p: 7749.25, q: '386' }, { i: 79, p: 7756.25, q: '512' },
  { i: 86, p: 7756.25, q: '530' }, { i: 107, p: 7767.5, q: '830 ×2', gold: true } ];
let BARS = [], CVD = [], CONT = [];
function genBars() {
  const A = [[0, 7739], [10, 7745], [20, 7738], [30, 7741], [37, 7735.75], [46, 7743], [55, 7739], [64, 7750], [70, 7746], [78, 7755], [86, 7752], [94, 7758], [100, 7762], [107, 7767.5], [113, 7764.5], [119, 7766.5]];
  const r = VW.rng(20261031), q = x => Math.round(x * 4) / 4; let prev = 7738.75, cv = 0;
  for (let i = 0; i < N; i++) {
    let k = 0; while (A[k + 1][0] < i) k++; const [i0, p0] = A[k], [i1, p1] = A[k + 1];
    const c = q(mix(p0, p1, (i - i0) / (i1 - i0)) + (r() - 0.5) * 2.4), o = prev;
    const h = q(Math.max(o, c) + r() * 1.4), l = q(Math.min(o, c) - r() * 1.4), v = 0.25 + r() * 0.75 + (i > 100 ? 0.4 : 0);
    BARS.push({ o, h, l, c, v }); prev = c; cv += (c - o) * v * 1.6 + (r() - 0.5) * 0.8; CVD.push(cv);
  }
  BARS[107].h = 7768.25; BARS[37].l = 7735.5;
  PRINTS.forEach(pr => { const b = BARS[pr.i]; b.l = Math.min(b.l, pr.p); b.h = Math.max(b.h, pr.p); });
}
// ---------- 2D helpers ----------
function txt(g, s, x, y, font, col, al = 'left', bl = 'middle') { g.font = font; g.fillStyle = col; g.textAlign = al; g.textBaseline = bl; g.fillText(s, x, y); }
function rr(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function mkTex(w, h) { const cv = document.createElement('canvas'); cv.width = w * K; cv.height = h * K; const g = cv.getContext('2d'); g.__k = K; g.setTransform(K, 0, 0, K, 0, 0);
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; tex.minFilter = THREE.LinearMipmapLinearFilter; return { cv, g, tex }; }
function money(p) { return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function diamond(g, x, y, s, col) { g.save(); g.translate(x, y); g.rotate(Math.PI / 4); g.fillStyle = col; g.fillRect(-s, -s, 2 * s, 2 * s); g.restore(); }
function badge(g, x, y, q, gold, f = 21) { g.font = `700 ${f}px VWMono`; const tw = g.measureText(q).width; rr(g, x, y - f * 0.75, tw + 18, f * 1.45, 6); g.fillStyle = gold ? '#F2C14E' : '#E9EDF5'; g.fill(); txt(g, q, x + 9, y, `700 ${f}px VWMono`, '#0A0E16'); }
// ---------- terminal (PC look), full page ----------
const HDR = [];
function layoutHeader(g) {
  const F = '600 26px VWMono', L = '600 20px VWMono';
  const row = (y, label, chips) => { let x = 110; g.font = L; HDR.push({ kind: 'label', s: label, x, y }); x += g.measureText(label).width + 16;
    chips.forEach(c => { g.font = F; const w = g.measureText(c.s).width + 26; HDR.push({ kind: 'chip', s: c.s, key: c.key, x, y, w }); x += w + 10; }); };
  HDR.push({ kind: 'wm', x: 110, y: 296 });
  row(358, 'DEALER', [{ s: 'WALLS Top 5', key: 'W' }, { s: 'METRIC GEX', key: 'W' }, { s: 'EXPIRY 0DTE', key: 'W' }, { s: 'MAPS' }]);
  row(414, 'ACTIVITY', [{ s: 'BLOCK PRINTS', key: 'B' }, { s: 'CVD', key: 'C' }, { s: 'CDI' }, { s: 'FLOW' }]);
}
function chipPos(key) { const c = HDR.find(h => h.key === key); return [c.x + c.w / 2, c.y]; }
function drawTerminal(g, s) {   // s: {on:{W,B,C}, pulse:{W,B,C}, walls[], star, bars, prints, cvd, box, boxK, tip, disc, bgA}
  g.setTransform(K, 0, 0, K, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, W, H);
  g.fillStyle = `rgba(2,5,11,${s.bgA ?? 0.9})`; g.fillRect(0, 0, W, H);
  // header
  HDR.forEach(h => { g.save();
    if (h.kind === 'wm') { const wm = VW.assets.wm, hh = 44, ww = hh * wm.width / wm.height; g.globalCompositeOperation = 'lighter'; g.drawImage(wm, h.x, h.y - hh / 2, ww, hh); g.globalCompositeOperation = 'source-over';
      txt(g, '·  ES  ·  1m', h.x + ww + 18, h.y + 1, '600 28px VWMono', '#97A3B3'); }
    else if (h.kind === 'label') txt(g, h.s, h.x, h.y, '600 20px VWMono', '#5E6B80');
    else { const k = h.key ? (s.on[h.key] || 0) : 0, pu = h.key ? (s.pulse[h.key] || 0) : 0;
      const gd = h.key === 'B'; rr(g, h.x, h.y - 22, h.w, 44, 10); g.fillStyle = gd ? `rgba(242,193,78,${0.08 + 0.28 * k})` : `rgba(47,107,255,${0.05 + 0.3 * k})`; g.fill();
      if (k > 0) { g.shadowColor = gd ? 'rgba(242,193,78,0.9)' : 'rgba(90,140,255,0.9)'; g.shadowBlur = 10 + 30 * pu; }
      g.strokeStyle = gd ? `rgba(242,193,78,${0.55 + 0.45 * k})` : `rgba(${mix(150, 120, k)},${mix(170, 165, k)},${mix(210, 255, k)},${0.22 + 0.7 * k})`; g.lineWidth = 1.5 + 1.5 * pu; g.stroke(); g.shadowBlur = 0;
      txt(g, h.s, h.x + 13, h.y + 1, '600 26px VWMono', gd ? (k > 0.5 ? '#FFE7A6' : '#F2C14E') : (k > 0.5 ? '#ECEFF4' : '#97A3B3'));
      if (pu > 0.02) { g.globalAlpha = pu; rr(g, h.x - 10 * (1 - pu) - 4, h.y - 26 - 10 * (1 - pu), h.w + 8 + 20 * (1 - pu), 52 + 20 * (1 - pu), 14); g.strokeStyle = h.key === 'B' ? '#F2C14E' : '#8AB6FF'; g.lineWidth = 2; g.stroke(); } }
    g.restore(); });
  g.fillStyle = 'rgba(140,170,230,0.18)'; g.fillRect(0, 452, W, 1.5);
  // grid
  for (let x = 18; x < W; x += 36) { g.fillStyle = 'rgba(120,150,200,0.07)'; g.fillRect(x, 455, 1, 1080); }
  for (let p = 7732; p <= 7780; p += 4) { g.fillStyle = 'rgba(120,150,200,0.05)'; g.fillRect(0, PY(p), W, 1); }
  // walls
  WALLS.forEach((w, j) => { const k = s.walls[j] || 0; if (k <= 0) return; const y = PY(w.p), c = FAMC[w.fam], x0 = W - W * eo(k);
    g.save(); const lg = g.createLinearGradient(0, 0, W, 0); lg.addColorStop(0, VW.rgba(c, 0.05)); lg.addColorStop(0.6, VW.rgba(c, 0.45)); lg.addColorStop(1, VW.rgba(c, 0.95));
    g.strokeStyle = lg; g.lineWidth = w.star ? 4 : 2.5; g.shadowColor = VW.rgba(c, 0.9); g.shadowBlur = w.star ? 22 : 12;
    g.beginPath(); g.moveTo(x0, y); g.lineTo(W, y); g.stroke(); g.restore();
    const kl = eo(lin(k, 0.55, 1)); if (kl > 0) { g.save(); g.globalAlpha = kl;
      const lab = `${w.star ? '★ ' : ''}${money(w.p)} · ${w.net}`;
      g.font = '700 26px VWMono'; const tw = g.measureText(lab).width; rr(g, 924 - tw - 30, y - 36, tw + 40, 34, 7); g.fillStyle = 'rgba(2,5,11,0.85)'; g.fill();
      g.fillStyle = c; g.beginPath(); g.arc(924 - tw - 16, y - 19, 5, 0, 7); g.fill(); txt(g, lab, 932, y - 18, '700 26px VWMono', c, 'right'); g.restore(); } });
  // star level of block prints
  if (s.star > 0) { const y = PY(STAR.p); g.save(); g.globalAlpha = eo(s.star); g.setLineDash([7, 6]); g.strokeStyle = 'rgba(235,240,250,0.75)'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(0, y); g.lineTo(W * eo(s.star), y); g.stroke(); g.setLineDash([]);
    g.font = '700 23px VWMono'; const tw = g.measureText(STAR.txt).width; g.beginPath(); g.moveTo(110, y - 20); g.lineTo(110 + tw + 26, y - 20); g.lineTo(110 + tw + 40, y); g.lineTo(110 + tw + 26, y + 20); g.lineTo(110, y + 20); g.closePath();
    g.fillStyle = 'rgba(8,12,22,0.95)'; g.fill(); g.strokeStyle = 'rgba(235,240,250,0.8)'; g.lineWidth = 1.5; g.stroke(); txt(g, STAR.txt, 122, y + 1, '700 23px VWMono', '#ECEFF4'); g.restore(); }
  // candles, volume / CVD pane
  const nb = Math.min(N, s.bars), cvk = s.cvd || 0;
  for (let i = 0; i < Math.ceil(nb); i++) { const b = BARS[i], a = clamp(nb - i, 0, 1), x = BX(i), c = b.c >= b.o ? '#2FB67C' : '#E2575F';
    g.globalAlpha = a; g.fillStyle = c; g.fillRect(x - 0.6, PY(b.h), 1.6, PY(b.l) - PY(b.h));
    const y0 = PY(Math.max(b.o, b.c)), hh = Math.max(2, PY(Math.min(b.o, b.c)) - y0); g.fillRect(x - 2.4, y0, 5, hh);
    g.globalAlpha = a * 0.5 * (1 - cvk); const vh = b.v * 50; g.fillRect(x - 2.4, 1525 - vh, 5, vh); }
  g.globalAlpha = 1;
  if (cvk > 0) { const y0 = 1380, y1 = 1525, mn = Math.min(...CVD), mx = Math.max(...CVD), Y = v => y1 - 8 - (v - mn) / (mx - mn) * (y1 - y0 - 16);
    g.save(); g.globalAlpha = eo(cvk); g.fillStyle = 'rgba(140,170,230,0.12)'; g.fillRect(0, y0 - 6, W, 1.5);
    txt(g, 'CVD', 110, y0 + 14, '700 22px VWMono', '#DCE6FF'); g.beginPath(); g.rect(0, y0, BX(0) - 4 + (Math.min(nb, N * eo(cvk) + nb * 0) ) * SP + 8, y1 - y0); g.clip();
    g.strokeStyle = '#DCE6FF'; g.lineWidth = 3; g.shadowColor = 'rgba(200,215,255,0.8)'; g.shadowBlur = 12; g.beginPath();
    for (let i = 0; i < Math.ceil(nb); i++) g[i ? 'lineTo' : 'moveTo'](BX(i), Y(CVD[i])); g.stroke(); g.restore(); }
  // block prints
  PRINTS.forEach(pr => { const k = clamp((nb - pr.i) * 0.5, 0, 1) * (s.prints || 0); if (k <= 0) return; const x = BX(pr.i), y = PY(pr.p), pop = 1 + 0.6 * (1 - eo(clamp(k, 0, 1)));
    g.save(); g.globalAlpha = k; g.fillStyle = '#F4F6FA'; g.shadowColor = 'rgba(255,255,255,0.6)'; g.shadowBlur = 8; g.fillRect(x - 22 * pop, y - 2.5, 44 * pop, 5); g.shadowBlur = 0;
    diamond(g, x, y, 6 * pop, pr.gold ? '#F2C14E' : '#F4F6FA'); badge(g, x + 16, y - 26, pr.q, pr.gold); g.restore(); });
  // selection box
  if (s.box > 0) { const x0 = BX(97), x1 = BX(116), y0 = PY(7771), y1 = PY(7759.5), per = 2 * (x1 - x0 + y1 - y0); let left = per * eo(s.box);
    g.save(); g.globalAlpha = s.boxK ?? 1; g.setLineDash([9, 7]); g.strokeStyle = 'rgba(255,214,102,0.95)'; g.lineWidth = 2.5; g.shadowColor = 'rgba(255,200,80,0.6)'; g.shadowBlur = 10;
    g.beginPath(); const pts = [[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]]; g.moveTo(x0, y0);
    for (let k = 1; k < pts.length && left > 0; k++) { const [ax, ay] = pts[k - 1], [bx, by] = pts[k], d = Math.hypot(bx - ax, by - ay), f = Math.min(1, left / d); g.lineTo(ax + (bx - ax) * f, ay + (by - ay) * f); left -= d; }
    g.stroke(); g.restore(); }
  // wall tooltip (as in the terminal)
  if (s.tip > 0) { const k = eo(s.tip), x1 = 900, y = PY(7768.25) - 70, L = ['SPX 7,730 → ES 7,768.25', 'Call wall · long γ', 'Net +$22.4M'];
    g.save(); g.globalAlpha = k; g.translate(0, (1 - k) * 12); rr(g, x1 - 470, y - 150, 470, 138, 12); g.fillStyle = 'rgba(10,16,30,0.96)'; g.fill(); g.strokeStyle = 'rgba(57,168,111,0.8)'; g.lineWidth = 2; g.stroke();
    txt(g, L[0], x1 - 446, y - 118, '600 23px VWMono', '#97A3B3'); txt(g, L[1], x1 - 446, y - 81, '700 26px VWMono', '#39A86F'); txt(g, L[2], x1 - 446, y - 43, '700 30px VWMono', '#ECEFF4'); g.restore(); }
  if (s.disc > 0) { g.save(); g.globalAlpha = s.disc; txt(g, 'Simulated ES session. Dealer Walls: modeled positioning.', 540, 1540, '500 19px VWMono', '#7F8AA0', 'center'); g.restore(); }
}
// ---------- the long layer bar (as on the PC terminal: one row) ----------
const BW = 2900, BH = 150; let BARP = [];
function layoutBar(g) { let x = 50; const add = (kind, s, f, gap = 22) => { g.font = f; const w = kind === 'wm' ? 200 : g.measureText(s).width + (kind === 'chip' ? 34 : 0); BARP.push({ kind, s, x, w, f }); x += w + gap; };
  add('wm', '', '', 22); add('t', '·  ES  ·  1m', '600 40px VWMono', 40); add('sep', '', '', 40);
  add('lab', 'DEALER', '600 30px VWMono'); ['WALLS Top 5', 'METRIC GEX', 'EXPIRY 0DTE', 'MAPS'].forEach(s => add('chip', s, '600 38px VWMono', 16)); x += 24; add('sep', '', '', 40);
  add('lab', 'ACTIVITY', '600 30px VWMono'); ['BLOCK PRINTS', 'CVD', 'CDI', 'FLOW'].forEach(s => add('chip', s, '600 38px VWMono', 16)); BARP.end = x; }
function drawBar(g, u) {   // u = how far the drawing line has gone (0..1)
  g.setTransform(K, 0, 0, K, 0, 0); g.clearRect(0, 0, BW, BH); const hx = u * BW;
  g.save(); g.beginPath(); g.rect(0, 0, hx, BH); g.clip(); rr(g, 6, 6, BW - 12, BH - 12, 28); g.fillStyle = 'rgba(8,14,30,0.92)'; g.fill(); g.restore();
  // outline drawn by the line
  g.save(); g.beginPath(); g.rect(0, 0, hx, BH); g.clip(); rr(g, 6, 6, BW - 12, BH - 12, 28); g.strokeStyle = 'rgba(138,182,255,0.95)'; g.lineWidth = 4; g.shadowColor = '#5A8CFF'; g.shadowBlur = 18; g.stroke(); g.restore();
  BARP.forEach(p => { const k = clamp((hx - p.x) / 120, 0, 1); if (k <= 0) return; g.save(); g.globalAlpha = eo(k); const y = BH / 2;
    if (p.kind === 'wm') { const wm = VW.assets.wm, hh = 52, ww = hh * wm.width / wm.height; g.globalCompositeOperation = 'lighter'; g.drawImage(wm, p.x, y - hh / 2, ww, hh); }
    else if (p.kind === 't') txt(g, p.s, p.x, y + 2, p.f, '#97A3B3');
    else if (p.kind === 'lab') txt(g, p.s, p.x, y + 2, p.f, '#5E6B80');
    else if (p.kind === 'sep') { g.fillStyle = 'rgba(140,170,230,0.3)'; g.fillRect(p.x, 34, 2, BH - 68); }
    else { const gd = p.s === 'BLOCK PRINTS'; rr(g, p.x, y - 32, p.w, 64, 14); g.fillStyle = gd ? 'rgba(242,193,78,0.14)' : 'rgba(255,255,255,0.05)'; g.fill(); g.strokeStyle = gd ? 'rgba(242,193,78,0.95)' : 'rgba(150,180,240,0.55)'; g.lineWidth = 2; g.stroke(); txt(g, p.s, p.x + 17, y + 2, p.f, gd ? '#F2C14E' : '#C9D3E3'); }
    g.restore(); });
}
// ---------- layer panels (carousel) ----------
function miniCandles(g, x0, y0, w, h, i0, n, opt = {}) { const bs = BARS.slice(i0, i0 + n), lo = Math.min(...bs.map(b => b.l)) - 1, hi = Math.max(...bs.map(b => b.h)) + 1, sx = w / n, Y = p => y0 + h - (p - lo) / (hi - lo) * h;
  bs.forEach((b, i) => { const x = x0 + (i + 0.5) * sx, c = b.c >= b.o ? '#2FB67C' : '#E2575F'; g.globalAlpha = opt.a ?? 1; g.fillStyle = c; g.fillRect(x - 1, Y(b.h), 2, Y(b.l) - Y(b.h)); const t = Y(Math.max(b.o, b.c)); g.fillRect(x - sx * 0.32, t, sx * 0.64, Math.max(2, Y(Math.min(b.o, b.c)) - t)); });
  g.globalAlpha = 1; return { Y, X: i => x0 + (i - i0 + 0.5) * sx }; }
const PANELS = [
  { t: 'DEALER WALLS', h: 'GAMMA LEVELS', grp: 'DEALER', c: '#39A86F', one: 'Options-derived dealer levels · Net $ per wall', draw(g) {
      const m = miniCandles(g, 40, 140, 600, 300, 60, 52, { a: 0.85 }); const L = [[7768.25, 'callL', '+$22.4M', 1], [7752.75, 'putS', '−$15.1M'], [7743.5, 'putL', '+$9.7M'], [7777.5, 'callS', '−$11.6M']];
      L.forEach(([p, f, net, st]) => { const y = clamp(m.Y(p), 130, 450), c = FAMC[f]; g.save(); g.strokeStyle = c; g.lineWidth = st ? 5 : 3; g.shadowColor = c; g.shadowBlur = st ? 26 : 14; g.beginPath(); g.moveTo(40, y); g.lineTo(860, y); g.stroke(); g.restore();
        txt(g, `${st ? '★ ' : ''}${money(p)} · ${net}`, 860, y - 20, '700 26px VWMono', c, 'right'); });
      [['call long γ', 'callL'], ['put long γ', 'putL'], ['call short γ', 'callS'], ['put short γ', 'putS']].forEach(([s, f], j) => { const x = 40 + j * 210; g.fillStyle = FAMC[f]; g.beginPath(); g.arc(x + 8, 490, 8, 0, 7); g.fill(); txt(g, s, x + 24, 491, '600 22px VWMono', '#C9D3E3'); }); } },
  { t: 'BLOCK PRINTS', h: 'LARGE TRADES', grp: 'ACTIVITY', c: '#F2C14E', one: 'Large trades and where they stack on one price', draw(g) {
      const m = miniCandles(g, 40, 150, 820, 320, 64, 36, { a: 0.8 }); const y = m.Y(7756.25);
      g.save(); g.setLineDash([9, 7]); g.strokeStyle = 'rgba(235,240,250,0.85)'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(40, y); g.lineTo(860, y); g.stroke(); g.restore();
      [[76, 7756.25, '512', 0], [82, 7756.25, '318', 0], [88, 7756.25, '212', 0], [68, 7747.5, '742 ×2', 1]].forEach(([i, p, q, gd]) => { const x = m.X(i), yy = m.Y(p); g.save(); g.fillStyle = '#F4F6FA'; g.shadowColor = '#fff'; g.shadowBlur = 12; g.fillRect(x - 34, yy - 3.5, 68, 7); g.restore(); diamond(g, x, yy, 9, gd ? '#F2C14E' : '#F4F6FA'); badge(g, x + 22, yy - 34, q, gd, 26); });
      g.font = '700 28px VWMono'; const s = STAR.txt, tw = g.measureText(s).width, lx = 860 - tw - 30, ly = y + 62; rr(g, lx, ly - 26, tw + 30, 52, 10); g.fillStyle = 'rgba(8,12,22,0.96)'; g.fill(); g.strokeStyle = 'rgba(235,240,250,0.85)'; g.lineWidth = 2; g.stroke(); txt(g, s, lx + 15, ly + 1, '700 28px VWMono', '#ECEFF4');
      g.strokeStyle = 'rgba(235,240,250,0.6)'; g.beginPath(); g.moveTo(lx + tw / 2, ly - 26); g.lineTo(lx + tw / 2, y); g.stroke(); } },
  { t: 'CVD', h: 'ORDER FLOW', grp: 'ACTIVITY', c: '#DCE6FF', one: 'Aggressive buys minus aggressive sells, cumulative', draw(g) {
      miniCandles(g, 40, 130, 820, 190, 40, 80, { a: 0.9 }); g.fillStyle = 'rgba(140,170,230,0.2)'; g.fillRect(40, 340, 820, 2); txt(g, 'CVD', 40, 372, '700 24px VWMono', '#DCE6FF');
      const cs = CVD.slice(40, 120), mn = Math.min(...cs), mx = Math.max(...cs); g.save(); g.strokeStyle = '#DCE6FF'; g.lineWidth = 4.5; g.shadowColor = 'rgba(200,215,255,0.9)'; g.shadowBlur = 18; g.beginPath();
      cs.forEach((v, i) => g[i ? 'lineTo' : 'moveTo'](40 + (i + 0.5) * 820 / 80, 470 - (v - mn) / (mx - mn) * 100)); g.stroke(); g.restore(); } },
  { t: 'EXPIRY', h: 'EXPIRATIONS', grp: 'DEALER', c: '#8AB6FF', one: 'Which expiries build the walls', draw(g) {
      ['0DTE', 'WEEK', 'MONTH', 'ALL'].forEach((m, j) => { const x = 40 + j * 205; rr(g, x, 140, 190, 84, 16); g.fillStyle = j ? 'rgba(255,255,255,0.05)' : 'rgba(47,107,255,0.45)'; g.fill(); g.strokeStyle = j ? 'rgba(150,170,210,0.35)' : '#8AB6FF'; g.lineWidth = 2.5; if (!j) { g.shadowColor = '#5A8CFF'; g.shadowBlur = 20; } g.stroke(); g.shadowBlur = 0; txt(g, m, x + 95, 183, '700 32px VWMono', j ? '#97A3B3' : '#FFFFFF', 'center'); });
      txt(g, '0DTE · 38 strikes', 40, 268, '700 28px VWMono', '#C9D3E3');
      WALLS.slice(0, 4).forEach((w, j) => { const y = 320 + j * 44, c = FAMC[w.fam]; g.save(); g.strokeStyle = c; g.lineWidth = 3; g.shadowColor = c; g.shadowBlur = 12; g.beginPath(); g.moveTo(40, y); g.lineTo(560, y); g.stroke(); g.restore(); txt(g, `${money(w.p)} · ${w.net}`, 860, y, '700 24px VWMono', c, 'right'); }); } },
  { t: 'METRIC', h: 'METRIC', grp: 'DEALER', c: '#5A8CFF', one: 'Dealer P&L exposure per 1-point move', draw(g) {
      rr(g, 40, 118, 820, 62, 14); g.fillStyle = 'rgba(255,255,255,0.04)'; g.fill(); g.strokeStyle = 'rgba(150,170,210,0.25)'; g.lineWidth = 2; g.stroke();
      ['GEX', 'CEX', 'DEX', 'ALL'].forEach((m, j) => { const x = 46 + j * 203.5; if (!j) { rr(g, x, 124, 197, 50, 11); g.fillStyle = 'rgba(47,107,255,0.55)'; g.fill(); g.shadowColor = '#5A8CFF'; g.shadowBlur = 18; g.strokeStyle = '#8AB6FF'; g.stroke(); g.shadowBlur = 0; }
        txt(g, m, x + 98, 150, '700 30px VWMono', j ? '#7F8AA0' : '#FFFFFF', 'center'); });
      txt(g, 'WALL', 40, 212, '600 20px VWMono', '#5E6B80'); txt(g, 'FAMILY', 300, 212, '600 20px VWMono', '#5E6B80'); txt(g, 'NET · GEX', 860, 212, '600 20px VWMono', '#5E6B80', 'right');
      const rows = [...WALLS].sort((a, b) => Math.abs(parseFloat(b.net.replace(/[^0-9.]/g, ''))) - Math.abs(parseFloat(a.net.replace(/[^0-9.]/g, '')))), FN = { callL: 'call · long γ', callS: 'call · short γ', putL: 'put · long γ', putS: 'put · short γ' };
      rows.forEach((w, j) => { const y = 252 + j * 52, c = FAMC[w.fam], v = Math.abs(parseFloat(w.net.replace(/[^0-9.]/g, ''))); g.fillStyle = j % 2 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.05)'; g.fillRect(36, y - 24, 828, 48);
        g.fillStyle = VW.rgba(c, 0.28); g.fillRect(560, y - 13, 170 * v / 22.4, 26); g.fillStyle = c; g.fillRect(560, y - 13, 4, 26);
        g.beginPath(); g.arc(52, y, 7, 0, 7); g.fill(); txt(g, `${w.star ? '★ ' : ''}${money(w.p)}`, 70, y + 1, '700 26px VWMono', '#ECEFF4'); txt(g, FN[w.fam], 300, y + 1, '600 24px VWMono', c);
        txt(g, w.net, 860, y + 1, '700 26px VWMono', c, 'right'); }); } },
  { t: 'EXPOSURE MAPS', h: 'HEATMAP', grp: 'DEALER', c: '#F59228', one: 'Maps behind the candles · MAP · GAMMA', draw(g) {
      const r = VW.rng(11); for (let cx = 0; cx < 22; cx++) for (let cy = 0; cy < 9; cy++) { const v = Math.sin(cx * 0.35 + cy * 0.8) + (r() - 0.5) * 0.5 - (cy - 4) * 0.25; g.fillStyle = v > 0 ? `rgba(47,107,255,${0.2 + 0.45 * Math.min(1, v)})` : `rgba(245,146,40,${0.2 + 0.45 * Math.min(1, -v)})`; g.fillRect(40 + cx * 37.3, 130 + cy * 35, 35, 33); }
      miniCandles(g, 40, 140, 820, 300, 50, 44); } },
  { t: 'CDI', h: '0DTE PREMIUM', grp: 'ACTIVITY', c: '#E2575F', one: '0DTE premium, calls vs puts, minute by minute', draw(g) {
      const r = VW.rng(5); for (let i = 0; i < 52; i++) { const v = (r() - 0.45) * 60 + (i === 34 ? 170 : 0), x = 40 + i * 15.8; g.fillStyle = v > 0 ? '#2FB67C' : '#E2575F'; g.fillRect(x, v > 0 ? 330 - v : 330, 11, Math.abs(v)); }
      txt(g, '$6.4M', 40 + 34 * 15.8 + 5, 140, '700 28px VWMono', '#2FB67C', 'center'); txt(g, 'C $2.1M · P $2.6M · Single-leg', 40, 470, '600 24px VWMono', '#97A3B3'); } },
  { t: 'OPTIONS FLOW', h: 'ASK VS BID', grp: 'ACTIVITY', c: '#2F6BFF', one: 'Premium bought at ask vs sold at bid', draw(g) {
      const r = VW.rng(9); [['C', '#2FB67C', 0.3], ['P', '#E2575F', -0.22], ['NET', '#DCE6FF', 0.06]].forEach(([nm, c, d]) => { let v = 0; g.save(); g.strokeStyle = c; g.lineWidth = 4; g.shadowColor = c; g.shadowBlur = 12; g.beginPath();
        for (let i = 0; i <= 60; i++) { v += (r() - 0.5 + d) * 10; g[i ? 'lineTo' : 'moveTo'](40 + i * 12.5, 300 - v); } g.stroke(); g.restore(); txt(g, nm, 860, 300 - v, '700 26px VWMono', c, 'right'); }); } },
];
function panelTexture(P) { const w = 900, h = 580, t = mkTex(w, h), g = t.g;
  const bg = g.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#0F1C3A'); bg.addColorStop(1, '#060B17'); rr(g, 3, 3, w - 6, h - 6, 36); g.fillStyle = bg; g.fill();
  g.save(); g.clip(); P.draw(g); const sh = g.createLinearGradient(0, 0, w * 0.7, h); sh.addColorStop(0, 'rgba(255,255,255,0.10)'); sh.addColorStop(0.35, 'rgba(255,255,255,0)'); g.fillStyle = sh; g.fillRect(0, 0, w, h); g.restore();
  rr(g, 3, 3, w - 6, h - 6, 36); g.strokeStyle = VW.rgba(P.c, 0.8); g.lineWidth = 4; g.shadowColor = P.c; g.shadowBlur = 24; g.stroke(); g.shadowBlur = 0;
  txt(g, P.grp, 40, 46, '600 22px VWMono', '#5E6B80'); txt(g, P.t, 40, 92, '700 46px VWSans', '#FFFFFF');
  g.fillStyle = P.c; g.beginPath(); g.arc(860, 70, 10, 0, 7); g.fill();
  txt(g, P.one, 40, 548, '600 22px VWMono', '#97A3B3');
  t.tex.needsUpdate = true; return t.tex; }
// ---------- three.js ----------
const D = 960 / Math.tan(THREE.MathUtils.degToRad(17.5));
function logoMat(img) { const t = new THREE.Texture(img); t.colorSpace = THREE.SRGBColorSpace; t.needsUpdate = true;
  return new THREE.ShaderMaterial({ uniforms: { map: { value: t }, op: { value: 1 }, rev: { value: 1 }, sweep: { value: -1 } }, transparent: true, depthWrite: false, premultipliedAlpha: true,
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: 'uniform sampler2D map; uniform float op, rev, sweep; varying vec2 vUv; void main(){ if (vUv.x > rev) discard; vec3 c = texture2D(map, vUv).rgb; float l = max(c.r, max(c.g, c.b)); float s = exp(-pow((vUv.x + vUv.y*0.35 - sweep)/0.06, 2.0)); vec3 o = (c + vec3(0.75,0.85,1.0)*s*l*1.6)*op; float a = clamp(max(o.r, max(o.g, o.b)), 0.0, 1.0); gl_FragColor = vec4(o, a); }' }); }
function dotTex() { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,255,255,0.8)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); const t = new THREE.CanvasTexture(c); return t; }
function setCam(c, x, y, z, lx, ly, lz, roll = 0) { c.position.set(x, y, z); c.up.set(Math.sin(roll), Math.cos(roll), 0); c.lookAt(lx, ly, lz); c.updateMatrixWorld(); }
function proj(v, c = CAM) { const p = v.clone().project(c); return [(p.x + 1) * W / 2, (1 - p.y) * H / 2, p.z]; }
function draw3D(list) { R.clear(); list.forEach(([s, c]) => { R.render(s, c); R.clearDepth(); }); }
function starsCam(t, roll = 0, sp = 1) { setCam(CAMS, Math.sin(t * 0.3) * 150, Math.cos(t * 0.25) * 120, 2000 - t * 1100 * sp, Math.sin(t * 0.3) * 150 + roll * 800, 0, -20000, roll * 0.3); }
function blit(g, a = 1, bloom = 0.55) { g.save(); g.globalAlpha = a; g.drawImage(gl, 0, 0, W, H); if (bloom > 0) { g.globalCompositeOperation = 'lighter'; g.globalAlpha = a * bloom; g.filter = 'blur(14px)'; g.drawImage(gl, 0, 0, W, H); } g.restore(); }
function space(g, t, glowA = 0.14) { const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#040818'); bg.addColorStop(1, '#01030A'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
  const hz = g.createRadialGradient(540, 900, 40, 540, 900, 1200); hz.addColorStop(0, `rgba(47,107,255,${glowA})`); hz.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = hz; g.fillRect(0, 0, W, H); }
// blue light strands that draw the monogram outline in 3D (logo centre in world coords, size s)// ===================== V0012 · EDIT 3D n.2 (T1, 31 Oct 2026) =====================
// Same 3D house style as V0010, told a different way (Power 17:34: other shots, other interactions, other cinematics).
// Moves from the edit brain (06_DOCS/EDIT_CERVELLO.md): stacked word cards in 3D (M01), fixed layer row with one 3D shot
// per beat underneath (M02), the whole world tints with the market (M03), counter that steps on the beat (M04),
// particles that swarm into the V (M05). Song: trap section with a 1.1 s break and a drop at 4.20 s (99.5 BPM, beat 0.603 s).
// Simulated ES session, declared on screen. No forecasts. Approved ending elements and layout.
const B = 0.603, G = k => 4.20 + B * k;
const T = { words: [0.0, 0.59, 1.19, 1.79], fold: 2.39, brk: 3.0, drop: 4.20, cuts: [0, 1, 2, 3, 4, 5].map(G), c3: G(6), down: G(8), gold: G(11), flip: G(12),
  c4: G(13), steps: [13, 14, 15, 16, 17].map(G), end: G(19), loop0: 19.0, total: 19.45 };
let R, CAM, CAMS, S_STARS, stars, gl, S_LOGO, mono, wm, wmRef;
// ---------- S1: four word cards that stack on the beat, each with a live layer behind the word ----------
const WORDS = [ { s: 'SEE', vis: 'cvd' }, { s: 'WHERE', vis: 'maps' }, { s: 'DEALERS', vis: 'walls' }, { s: 'HEDGE.', vis: 'prints' } ];
let S_STACK, stackCards = [];
function wordCard(Wd) { const w = 880, h = 300, t = mkTex(w, h), g = t.g;
  const bg = g.createLinearGradient(0, 0, w, h); bg.addColorStop(0, '#0E1B38'); bg.addColorStop(1, '#050A16'); rr(g, 3, 3, w - 6, h - 6, 30); g.fillStyle = bg; g.fill(); g.save(); g.clip();
  g.globalAlpha = 0.85;
  if (Wd.vis === 'cvd') { const cs = CVD.slice(30, 120), mn = Math.min(...cs), mx = Math.max(...cs); g.strokeStyle = '#DCE6FF'; g.lineWidth = 5; g.shadowColor = 'rgba(200,215,255,0.9)'; g.shadowBlur = 18; g.beginPath(); cs.forEach((v, i) => g[i ? 'lineTo' : 'moveTo'](i * w / 89, 250 - (v - mn) / (mx - mn) * 200)); g.stroke(); }
  if (Wd.vis === 'maps') { const r = VW.rng(3); for (let cx = 0; cx < 24; cx++) for (let cy = 0; cy < 8; cy++) { const v = Math.sin(cx * 0.4 + cy * 0.7) - (cy - 3.5) * 0.3 + (r() - 0.5) * 0.4; g.fillStyle = v > 0 ? `rgba(47,107,255,${0.25 + 0.4 * Math.min(1, v)})` : `rgba(245,146,40,${0.25 + 0.4 * Math.min(1, -v)})`; g.fillRect(cx * 37, cy * 38, 35, 36); } }
  if (Wd.vis === 'walls') { [['callL', 70], ['putS', 160], ['putL', 235]].forEach(([f, y]) => { g.strokeStyle = FAMC[f]; g.lineWidth = 5; g.shadowColor = FAMC[f]; g.shadowBlur = 20; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }); }
  if (Wd.vis === 'prints') { g.setLineDash([10, 8]); g.strokeStyle = 'rgba(242,193,78,0.8)'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 240); g.lineTo(w, 240); g.stroke(); g.setLineDash([]);
    [[640, 0], [740, 1], [830, 1]].forEach(([x, gd]) => { g.fillStyle = '#F4F6FA'; g.fillRect(x - 34, 236, 68, 8); diamond(g, x, 240, 12, gd ? '#F2C14E' : '#F4F6FA'); }); }
  g.restore(); g.globalAlpha = 1; const sh = g.createLinearGradient(0, 0, w * 0.6, 0); sh.addColorStop(0, 'rgba(5,10,22,0.92)'); sh.addColorStop(1, 'rgba(5,10,22,0)'); rr(g, 3, 3, w - 6, h - 6, 30); g.fillStyle = sh; g.fill();
  rr(g, 3, 3, w - 6, h - 6, 30); g.strokeStyle = 'rgba(138,182,255,0.7)'; g.lineWidth = 3; g.shadowColor = '#5A8CFF'; g.shadowBlur = 20; g.stroke(); g.shadowBlur = 0;
  g.letterSpacing = '4px'; txt(g, Wd.s, 50, 158, '700 150px VWSans', Wd.s === 'DEALERS' ? '#8AB6FF' : '#FFFFFF'); g.letterSpacing = '0px';
  t.tex.needsUpdate = true; return t.tex; }
function buildStack() { S_STACK = new THREE.Scene(); WORDS.forEach((Wd, i) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(880, 300), new THREE.MeshBasicMaterial({ map: wordCard(Wd), transparent: true })); S_STACK.add(m); stackCards.push(m); }); }
function secStack(g, t) {
  space(g, t, 0.12); const tilt = eio(lin(t, 0, T.brk));
  stackCards.forEach((m, i) => { const t0 = T.words[i], e = eo(lin(t, t0, t0 + 0.28)), f = eio(lin(t, T.fold + i * 0.07, T.fold + i * 0.07 + 0.4));
    m.visible = t >= t0; m.position.set(mix(i % 2 ? 700 : -700, 0, e) + f * (i % 2 ? -1400 : 1400), 510 - i * 340 + (1 - e) * 220, mix(500, 0, e) - f * 600);
    m.rotation.set(mix(-1.1, 0, e) + f * 0.4, mix(i % 2 ? -0.9 : 0.9, 0, e) + f * (i % 2 ? -1.3 : 1.3), 0); m.material.opacity = 1 - lin(f, 0.6, 1); });
  setCam(CAM, mix(-260, 220, tilt), mix(-120, 80, tilt), D * mix(1.12, 1.0, tilt), 0, 0, 0, mix(0.04, -0.03, tilt));
  starsCam(t); draw3D([[S_STARS, CAMS], [S_STACK, CAM]]); blit(g, 1, 0.5);
}
// break (3.0 → 4.2): everything goes dark, the wordmark breathes in, then the drop
function secBreak(g, t) {
  space(g, t, 0.05 + 0.1 * lin(t, T.brk, T.drop)); const k = eo(lin(t, T.brk + 0.15, T.drop - 0.2)), out = lin(t, T.drop - 0.12, T.drop);
  mono.visible = false; wm.visible = true; wmRef.visible = false; wm.position.set(0, 0, mix(-900, 120, eio(lin(t, T.brk, T.drop)))); wm.rotation.set(0, mix(0.35, -0.05, k), 0); wm.scale.setScalar(0.7);
  wm.material.uniforms.op.value = k * (1 - out); wm.material.uniforms.sweep.value = mix(-0.4, 1.6, lin(t, T.brk + 0.4, T.drop - 0.1)); wm.material.uniforms.rev.value = 1;
  setCam(CAM, 0, 0, D, 0, 0, 0); starsCam(t, 0, 0.3); stars.material.opacity = 0.5; draw3D([[S_STARS, CAMS], [S_LOGO, CAM]]); stars.material.opacity = 1; blit(g, 1, 0.8);
}
// ---------- S2: fixed layer row on top, one 3D shot per beat underneath ----------
const CHIPS = [ { s: 'WALLS', g: 'DEALER' }, { s: 'METRIC', g: 'DEALER' }, { s: 'EXPIRY', g: 'DEALER' }, { s: 'MAPS', g: 'DEALER' }, { s: 'BLOCK PRINTS', g: 'ACTIVITY' }, { s: 'CVD', g: 'ACTIVITY' }, { s: 'CDI', g: 'ACTIVITY' }, { s: 'FLOW', g: 'ACTIVITY' } ];
const SHOTS = ['WALLS', 'MAPS', 'BLOCK PRINTS', 'CVD', 'CDI', 'FLOW'];
function layerRow(g, t, active, a = 1) {   // the real layer row, two lines, the active chip lights up
  g.save(); g.globalAlpha = a; const wmI = VW.assets.wm, hh = 46, ww = hh * wmI.width / wmI.height; g.globalCompositeOperation = 'lighter'; g.drawImage(wmI, 110, 282 - hh / 2, ww, hh); g.globalCompositeOperation = 'source-over';
  txt(g, '·  ES  ·  1m', 110 + ww + 18, 283, '600 28px VWMono', '#97A3B3');
  let x = 110, y = 348; const F = '600 25px VWMono';
  CHIPS.forEach((c, i) => { if (i === 4) { x = 110; y = 404; } if (i === 0 || i === 4) { txt(g, c.g, x, y, '600 19px VWMono', '#5E6B80'); g.font = '600 19px VWMono'; x += g.measureText(c.g).width + 14; }
    g.font = F; const w = g.measureText(c.s).width + 24, on = c.s === active, gd = c.s === 'BLOCK PRINTS'; rr(g, x, y - 21, w, 42, 10);
    g.fillStyle = on ? (gd ? 'rgba(242,193,78,0.35)' : 'rgba(47,107,255,0.45)') : (gd ? 'rgba(242,193,78,0.08)' : 'rgba(255,255,255,0.04)'); g.fill();
    if (on) { g.shadowColor = gd ? '#F2C14E' : '#5A8CFF'; g.shadowBlur = 26; } g.strokeStyle = gd ? (on ? '#FFE3A0' : 'rgba(242,193,78,0.7)') : (on ? '#B9D0FF' : 'rgba(150,170,210,0.25)'); g.lineWidth = on ? 2.5 : 1.5; g.stroke(); g.shadowBlur = 0;
    txt(g, c.s, x + 12, y + 1, F, gd ? (on ? '#FFF1C9' : '#F2C14E') : (on ? '#FFFFFF' : '#7F8AA0')); x += w + 9; });
  g.fillStyle = 'rgba(140,170,230,0.2)'; g.fillRect(0, 446, W, 1.5); g.restore(); }
let SH = {};
function lights(sc, warm = false) { sc.add(new THREE.AmbientLight(0xffffff, 0.55)); const d = new THREE.DirectionalLight(warm ? 0xfff0d0 : 0xdfe8ff, 2.4); d.position.set(600, 1200, 900); sc.add(d); const d2 = new THREE.DirectionalLight(0x6f8fff, 1.0); d2.position.set(-900, 300, -600); sc.add(d2); }
const GOLD = () => new THREE.MeshStandardMaterial({ color: 0xF2C14E, metalness: 0.85, roughness: 0.28, emissive: 0x3a2600 });
function buildShots() {
  // WALLS: glowing wall bars over 3D candles, seen from a low angle
  const sw = new THREE.Scene(); sw.fog = new THREE.Fog(0x02050b, 2000, 6000); const box = new THREE.BoxGeometry(1, 1, 1);
  const cm = new THREE.InstancedMesh(box, new THREE.MeshBasicMaterial(), 120); const M = new THREE.Matrix4(), C = new THREE.Color();
  for (let i = 0; i < 60; i++) { const b = BARS[50 + i], up = b.c >= b.o, top = (Math.max(b.o, b.c) - 7752) * 40, bot = (Math.min(b.o, b.c) - 7752) * 40; C.set(up ? 0x2FB67C : 0xE2575F);
    M.makeScale(26, Math.max(6, top - bot), 26); M.setPosition((i - 30) * 50, (top + bot) / 2, 0); cm.setMatrixAt(i * 2, M); cm.setColorAt(i * 2, C);
    M.makeScale(5, (b.h - b.l) * 40, 5); M.setPosition((i - 30) * 50, ((b.h + b.l) / 2 - 7752) * 40, 0); cm.setMatrixAt(i * 2 + 1, M); cm.setColorAt(i * 2 + 1, C); }
  sw.add(cm); [[7768.25, 0x5BE39A], [7752.75, 0xC88BE8], [7743.5, 0xE86A6A], [7777.5, 0x5FD3E6]].forEach(([p, c]) => { const m = new THREE.Mesh(new THREE.BoxGeometry(6000, 8, 8), new THREE.MeshBasicMaterial({ color: c })); m.position.y = (p - 7752) * 40; sw.add(m);
    const gl2 = new THREE.Mesh(new THREE.PlaneGeometry(6000, 140), glowMat(new THREE.Color(c).toArray())); gl2.position.y = m.position.y; sw.add(gl2); });
  SH.WALLS = sw;
  // MAPS: field of exposure columns, blue and amber
  const sm = new THREE.Scene(); sm.fog = new THREE.Fog(0x02050b, 2200, 6500); const mm = new THREE.InstancedMesh(box, new THREE.MeshStandardMaterial({ metalness: 0.3, roughness: 0.45 }), 26 * 16); lights(sm); let k = 0;
  for (let x = 0; x < 26; x++) for (let z = 0; z < 16; z++) { const v = Math.sin(x * 0.35 + z * 0.5) - (z - 8) * 0.12, h = 40 + Math.abs(v) * 420; C.set(v > 0 ? 0x2F6BFF : 0xD9771A).multiplyScalar(0.35 + 0.45 * Math.min(1, Math.abs(v)));
    M.makeScale(80, h, 80); M.setPosition((x - 13) * 92, h / 2 - 300, (z - 8) * 92); mm.setMatrixAt(k, M); mm.setColorAt(k, C); k++; }
  sm.add(mm); SH.MAPS = sm;
  // BLOCK PRINTS: gold diamonds stacking on one price level
  const sb = new THREE.Scene(); sb.fog = new THREE.Fog(0x02050b, 1800, 5200); const oct = new THREE.OctahedronGeometry(30); const om = new THREE.InstancedMesh(oct, GOLD(), 60); lights(sb, true); k = 0;
  [[-500, 12], [0, 18], [520, 14]].forEach(([x, n]) => { for (let j = 0; j < n; j++) { M.makeRotationY(j * 0.6); M.setPosition(x + (j % 3 - 1) * 46, 20 + Math.floor(j / 3) * 52, ((j * 7) % 3 - 1) * 40); om.setMatrixAt(k++, M); } });
  om.count = k; sb.add(om); const lvl = new THREE.Mesh(new THREE.BoxGeometry(6000, 6, 6), new THREE.MeshBasicMaterial({ color: 0xF2C14E })); lvl.position.y = -20; sb.add(lvl);
  const lg = new THREE.Mesh(new THREE.PlaneGeometry(6000, 220), glowMat([0.95, 0.76, 0.31])); lg.position.y = -20; sb.add(lg); SH['BLOCK PRINTS'] = sb; SH._oct = om;
  // CVD: the cumulative line as a glowing tube
  const sc = new THREE.Scene(); sc.fog = new THREE.Fog(0x02050b, 1800, 6000); const mn = Math.min(...CVD), mx = Math.max(...CVD);
  const pts = CVD.map((v, i) => new THREE.Vector3((i - 60) * 40, ((v - mn) / (mx - mn) - 0.5) * 900, Math.sin(i * 0.08) * 160));
  const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 400, 9, 8, false), new THREE.MeshBasicMaterial({ color: 0xDCE6FF })); sc.add(tube);
  const tube2 = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 400, 26, 8, false), new THREE.MeshBasicMaterial({ color: 0x5A8CFF, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false })); sc.add(tube2);
  SH.CVD = sc; SH._cvdPts = pts;
  // CDI: bars, one giant minute
  const sd = new THREE.Scene(); sd.fog = new THREE.Fog(0x02050b, 2000, 6000); const dm = new THREE.InstancedMesh(box, new THREE.MeshBasicMaterial(), 60); const r = VW.rng(5);
  for (let i = 0; i < 60; i++) { const v = (r() - 0.45) * 160 + (i === 40 ? 900 : 0); C.set(v > 0 ? 0x2FB67C : 0xE2575F); M.makeScale(34, Math.abs(v), 34); M.setPosition((i - 30) * 52, v / 2, 0); dm.setMatrixAt(i, M); dm.setColorAt(i, C); }
  sd.add(dm); SH.CDI = sd;
  // FLOW: three ribbons, C, P and NET
  const sf = new THREE.Scene(); sf.fog = new THREE.Fog(0x02050b, 2000, 6500); const r2 = VW.rng(9);
  [[0x2FB67C, 0.3], [0xE2575F, -0.22], [0xDCE6FF, 0.06]].forEach(([c, d], j) => { let v = 0; const p = []; for (let i = 0; i <= 70; i++) { v += (r2() - 0.5 + d) * 26; p.push(new THREE.Vector3((i - 35) * 60, v, (j - 1) * 160)); }
    sf.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(p), 300, 8, 8, false), new THREE.MeshBasicMaterial({ color: c }))); });
  SH.FLOW = sf;
}
function shotCam(name, u) {   // u = 0..1 inside the beat; every shot has its own move
  if (name === 'WALLS') setCam(CAM, mix(-1200, -500, u), mix(-350, -150, u), mix(1300, 1000, u), mix(200, 700, u), 0, -400, 0.12);
  if (name === 'MAPS') { const a = mix(-0.9, -0.3, u); setCam(CAM, Math.sin(a) * 3400, mix(1900, 1400, u), Math.cos(a) * 3400, 0, -150, 0); }
  if (name === 'BLOCK PRINTS') setCam(CAM, mix(600, -200, u), mix(140, 220, u), mix(1100, 900, u), mix(200, -100, u), 120, 0, -0.06);
  if (name === 'CVD') { const p = SH._cvdPts[Math.round(mix(30, 80, u))]; setCam(CAM, p.x - 900, p.y + 250, 900, p.x + 400, p.y, 0, 0.08); }
  if (name === 'CDI') setCam(CAM, mix(-300, 400, u), mix(1300, 900, u), mix(1700, 1500, u), mix(-200, 400, u), 200, 0, -0.1);
  if (name === 'FLOW') setCam(CAM, mix(-1600, -900, u), mix(300, 120, u), mix(900, 1300, u), mix(0, 600, u), 0, 0, 0.05);
}
function secCuts(g, t) {
  const k = Math.min(SHOTS.length - 1, Math.floor((t - T.drop) / B)), u = (t - T.cuts[k]) / B, name = SHOTS[k];
  space(g, t, 0.1); shotCam(name, eo(clamp(u, 0, 1))); starsCam(t, 0.1, 1.6); draw3D([[S_STARS, CAMS], [SH[name], CAM]]);
  g.save(); g.beginPath(); g.rect(0, 452, W, H - 452); g.clip(); blit(g, 1, name === 'MAPS' || name === 'BLOCK PRINTS' ? 0.3 : 0.7); g.restore();
  const fl = Math.exp(-u * 9); if (fl > 0.02) { g.fillStyle = `rgba(210,225,255,${0.22 * fl})`; g.fillRect(0, 452, W, H); }
  const dk = g.createLinearGradient(0, 0, 0, 520); dk.addColorStop(0, 'rgba(2,5,11,1)'); dk.addColorStop(0.85, 'rgba(2,5,11,0.95)'); dk.addColorStop(1, 'rgba(2,5,11,0)'); g.fillStyle = dk; g.fillRect(0, 0, W, 520);
  layerRow(g, t, name, eo(lin(t, T.drop, T.drop + 0.12)));
  txt(g, 'Simulated ES session.', 540, 1540, '500 19px VWMono', '#7F8AA0', 'center');
}
// ---------- S3: the world tints with the market ----------
const RX3 = i => (i - 30) * 58, RY3 = p => (p - 7745) * 62, N3 = 60, PUTS = 7745.25, BPL = 7738.50;
let TB3 = [], S_MKT, mk3, putS3, putG3, bpl3, bplG3, bpOct;
function gen3() { const A = [[0, 7752], [8, 7750], [16, 7747.5], [22, 7746.25], [27, 7745.75], [30, 7744.0], [33, 7741.25], [36, 7738.75], [38, 7739.5], [40, 7739.0], [44, 7741.5], [50, 7744.75], [55, 7747.0], [59, 7748.0]];
  const r = VW.rng(1212), q = x => Math.round(x * 4) / 4; let prev = 7752.25;
  for (let i = 0; i < N3; i++) { let k = 0; while (A[k + 1][0] < i) k++; const [i0, p0] = A[k], [i1, p1] = A[k + 1];
    const c = q(mix(p0, p1, (i - i0) / (i1 - i0)) + (r() - 0.5) * (i > 29 && i < 37 ? 0.6 : 1.1)), o = prev; TB3.push({ o, c, h: q(Math.max(o, c) + r() * 0.8), l: q(Math.min(o, c) - r() * 0.8) }); prev = c; }
  for (let i = 0; i < 30; i++) TB3[i].l = Math.max(TB3[i].l, 7745.5); [36, 38, 40].forEach(i => TB3[i].l = BPL); for (let i = 36; i < N3; i++) TB3[i].l = Math.max(TB3[i].l, BPL); }
function cur3(t) { return t < T.down ? mix(14, 30, eio(lin(t, T.c3, T.down))) : t < T.gold ? mix(30, 36, eo(lin(t, T.down, T.gold))) : t < T.flip ? mix(36, 40, lin(t, T.gold, T.flip)) : mix(40, 59, eio(lin(t, T.flip, T.c4))); }
function build3() { S_MKT = new THREE.Scene(); S_MKT.fog = new THREE.Fog(0x03060f, 1800, 6000); mk3 = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial(), N3 * 2); mk3.instanceMatrix.setUsage(THREE.DynamicDrawUsage); S_MKT.add(mk3);
  putS3 = new THREE.Mesh(new THREE.BoxGeometry(5000, 8, 8), new THREE.MeshBasicMaterial({ color: 0xC88BE8 })); putS3.position.y = RY3(PUTS); S_MKT.add(putS3);
  putG3 = new THREE.Mesh(new THREE.PlaneGeometry(5000, 170), glowMat([0.69, 0.44, 0.82])); putG3.position.y = RY3(PUTS); S_MKT.add(putG3);
  bpl3 = new THREE.Mesh(new THREE.BoxGeometry(5000, 7, 7), new THREE.MeshBasicMaterial({ color: 0xF2C14E })); bpl3.position.y = RY3(BPL); S_MKT.add(bpl3);
  bplG3 = new THREE.Mesh(new THREE.PlaneGeometry(5000, 170), glowMat([0.95, 0.76, 0.31])); bplG3.position.y = RY3(BPL); S_MKT.add(bplG3);
  bpOct = []; [36, 38, 40].forEach(i => { const d = new THREE.Mesh(new THREE.OctahedronGeometry(22), GOLD()); d.position.set(RX3(i), RY3(BPL), 30); S_MKT.add(d); bpOct.push(d); });
  const grid = new THREE.GridHelper(6000, 60, 0x1d3a7a, 0x10224a); grid.position.y = -900; S_MKT.add(grid); lights(S_MKT, true); }
function tint(t) {   // colour of the world: blue → magenta (break below the short γ put wall) → gold (Block Prints) → green (turn)
  const cs = [[0.18, 0.42, 1.0], [0.82, 0.26, 0.55], [0.95, 0.70, 0.22], [0.22, 0.85, 0.50]];
  const a = eio(lin(t, T.down - 0.05, T.down + 0.25)), b = eio(lin(t, T.gold - 0.05, T.gold + 0.15)), c = eio(lin(t, T.flip, T.flip + 0.3));
  let col = cs[0].map((v, i) => mix(v, cs[1][i], a)); col = col.map((v, i) => mix(v, cs[2][i], b)); col = col.map((v, i) => mix(v, cs[3][i], c)); return col; }
function secMarket(g, t) {
  const col = tint(t), [r, gg, bb] = col.map(v => Math.round(v * 255)), cb = cur3(t), nb = cb + 1, M = new THREE.Matrix4(), C = new THREE.Color();
  const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, `rgba(${r * 0.05 | 0},${gg * 0.05 | 0},${bb * 0.08 | 0},1)`); bg.addColorStop(1, '#01030A'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
  const hz = g.createRadialGradient(540, 980, 40, 540, 980, 1200); hz.addColorStop(0, `rgba(${r},${gg},${bb},0.22)`); hz.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = hz; g.fillRect(0, 0, W, H);
  for (let i = 0; i < N3; i++) { const b = TB3[i], g0 = clamp(nb - i, 0, 1), up = b.c >= b.o; C.set(up ? 0x2FB67C : 0xE2575F);
    const top = RY3(Math.max(b.o, b.c)), bot = RY3(Math.min(b.o, b.c)), hb = Math.max(6, top - bot) * g0;
    const z0 = g0 > 0.001 ? 1 : 0; M.makeScale(34 * z0, hb, 34 * z0); M.setPosition(RX3(i), bot + hb / 2, 0); mk3.setMatrixAt(i * 2, M); mk3.setColorAt(i * 2, C);
    const hw = (RY3(b.h) - RY3(b.l)) * g0; M.makeScale(7 * z0, Math.max(1, hw) * z0, 7 * z0); M.setPosition(RX3(i), RY3(b.l) + hw / 2, 0); mk3.setMatrixAt(i * 2 + 1, M); mk3.setColorAt(i * 2 + 1, C); }
  mk3.instanceMatrix.needsUpdate = true; mk3.instanceColor.needsUpdate = true; S_MKT.fog.color.setRGB(col[0] * 0.06, col[1] * 0.06, col[2] * 0.08);
  const hp = Math.exp(-Math.pow((t - T.down) / 0.08, 2)), hg = Math.exp(-Math.pow((t - T.gold) / 0.08, 2));
  putG3.material.uniforms.k.value = 0.7 + 2.5 * hp; bplG3.material.uniforms.k.value = 0.6 + 3 * hg; bpOct.forEach((d, j) => { d.visible = cb >= [36, 38, 40][j] - 0.4; d.rotation.y = t * 3 + j; d.scale.setScalar(1 + 0.8 * hg); });
  // camera: from above looking down the fall, then swings to the side for the turn
  const px = RX3(cb), py = RY3(TB3[Math.min(N3 - 1, Math.floor(cb))].c), sw = eio(lin(t, T.gold, T.c4));
  setCam(CAM, px + mix(-500, -900, sw), py + mix(900, 220, sw), mix(1300, 1700, sw), px + mix(150, 350, sw), py + mix(-150, 120, sw), -200, mix(-0.12, 0.05, sw));
  starsCam(t, -0.1, 1.2); stars.material.color.setRGB(mix(1, col[0] * 1.4, 0.5), mix(1, col[1] * 1.4, 0.5), mix(1, col[2] * 1.4, 0.5));
  draw3D([[S_STARS, CAMS], [S_MKT, CAM]]); stars.material.color.setRGB(1, 1, 1); blit(g, 1, 0.75);
  const P = (i, p) => proj(new THREE.Vector3(RX3(i), RY3(p), 0)), la = eo(lin(t, T.c3 + 0.1, T.c3 + 0.4)) * (1 - lin(t, T.c4 - 0.3, T.c4 - 0.1));
  const l1 = P(cb - 9, PUTS); g.save(); g.globalAlpha = la; g.letterSpacing = '3px'; g.shadowColor = '#C88BE8'; g.shadowBlur = 16; txt(g, 'PUT WALL · SHORT γ', 110, clamp(l1[1] - 34, 480, 1480), '700 30px VWMono', '#E0B2FF'); g.restore();
  if (t > T.gold - 0.1) { const l2 = P(cb - 9, BPL); g.save(); g.globalAlpha = la * eo(lin(t, T.gold - 0.1, T.gold + 0.1)); g.letterSpacing = '3px'; g.shadowColor = '#F2C14E'; g.shadowBlur = 16; txt(g, 'BLOCK PRINTS', 110, clamp(l2[1] + 44, 480, 1480), '700 30px VWMono', '#FFD978'); g.restore(); }
  const ov = (hp * 0.22 + hg * 0.25); if (ov > 0.02) { g.fillStyle = `rgba(${r},${gg},${bb},${ov})`; g.fillRect(0, 0, W, H); }
  txt(g, 'Simulated ES session.', 540, 1540, '500 19px VWMono', '#7F8AA0', 'center');
}
// ---------- S4: the contracts at that level, counted on the beat, as a 3D gold pile ----------
let S_PILE, pile;
function buildPile() { S_PILE = new THREE.Scene(); S_PILE.fog = new THREE.Fog(0x070503, 1600, 5000); pile = new THREE.InstancedMesh(new THREE.OctahedronGeometry(26), GOLD(), 220); lights(S_PILE, true); pile.instanceMatrix.setUsage(THREE.DynamicDrawUsage); S_PILE.add(pile);
  const lv = new THREE.Mesh(new THREE.BoxGeometry(5000, 7, 7), new THREE.MeshBasicMaterial({ color: 0xF2C14E })); lv.position.y = -10; S_PILE.add(lv); const lg = new THREE.Mesh(new THREE.PlaneGeometry(5000, 240), glowMat([0.95, 0.76, 0.31])); lg.position.y = -10; S_PILE.add(lg);
  const grid = new THREE.GridHelper(6000, 60, 0x5a4410, 0x2a2008); grid.position.y = -12; S_PILE.add(grid); }
const COUNTS = [0, 380, 760, 1140, 1520, 2000];
function count(t) { let c = 0; T.steps.forEach((s, j) => { c = mix(c, COUNTS[j + 1], eo(lin(t, s - 0.05, s + 0.12))); }); return Math.round(c); }
function secPile(g, t) {
  const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#0C0904'); bg.addColorStop(1, '#020203'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
  const hz = g.createRadialGradient(540, 1100, 40, 540, 1100, 1100); hz.addColorStop(0, 'rgba(242,193,78,0.22)'); hz.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = hz; g.fillRect(0, 0, W, H);
  const c = count(t), nOct = Math.round(c / 2000 * 200), M = new THREE.Matrix4(), Q = new THREE.Quaternion(), S = new THREE.Vector3(1, 1, 1), r = VW.rng(77), toEnd = eio(lin(t, T.end - 0.35, T.end));
  for (let i = 0; i < 200; i++) { const ring = Math.floor(Math.sqrt(i)), a = i * 2.4, rad = 40 + ring * 22 * (1 - ring / 26), y = 30 + i * 1.8, drop = clamp((t - T.c4) * 6 - i / 40, 0, 1);
    const fx = Math.cos(a) * rad, fz = Math.sin(a) * rad, fy = y + (1 - eo(drop)) * 900;
    M.compose(new THREE.Vector3(fx * (1 - toEnd), fy * (1 - toEnd) + 260 * toEnd, fz * (1 - toEnd)), Q.setFromEuler(new THREE.Euler(t * 2 + i, t * 3 + i * 0.3, 0)), S.setScalar(i < nOct ? 1 - 0.6 * toEnd : 0)); pile.setMatrixAt(i, M); }
  pile.instanceMatrix.needsUpdate = true; const a = mix(-0.6, 0.9, eio(lin(t, T.c4, T.end)));
  setCam(CAM, Math.sin(a) * 1500, mix(500, 380, lin(t, T.c4, T.end)), Math.cos(a) * 1500, 0, 260, 0); starsCam(t, 0.1, 0.8); stars.material.color.setRGB(1, 0.85, 0.55);
  draw3D([[S_STARS, CAMS], [S_PILE, CAM]]); stars.material.color.setRGB(1, 1, 1); blit(g, 1, 0.8);
  const hit = VW.punch(T.steps, t, 0.06), s = c.toLocaleString('en-US'), ka = eo(lin(t, T.c4, T.c4 + 0.2)) * (1 - lin(t, T.end - 0.2, T.end));
  g.save(); g.globalAlpha = ka; g.translate(540, 470); g.scale(1 + 0.08 * hit, 1 + 0.08 * hit);
  for (let d = 14; d > 0; d--) txt(g, s, d * 1.2, d * 1.8, '700 210px VWSans', `rgba(90,62,10,${0.9 - d * 0.05})`, 'center');
  g.shadowColor = 'rgba(242,193,78,0.95)'; g.shadowBlur = 40 + 50 * hit; txt(g, s, 0, 0, '700 210px VWSans', '#FFD978', 'center'); g.restore();
  g.save(); g.globalAlpha = ka; g.letterSpacing = '4px'; txt(g, 'CONTRACTS · 7,738.50 · 3 BLOCKS', 540, 612, '700 30px VWMono', '#F2C14E', 'center'); g.restore();
  txt(g, 'Simulated ES session.', 540, 1540, '500 19px VWMono', '#7F8AA0', 'center');
}
// ---------- S5: approved ending, the V forms from a swarm of particles ----------
let S_SWARM, swarm, swarmPos, swarmFrom, swarmTo;
function buildSwarm() { S_SWARM = new THREE.Scene(); const n = 2400; swarmPos = new Float32Array(n * 3); swarmFrom = new Float32Array(n * 3); swarmTo = new Float32Array(n * 3); const col = new Float32Array(n * 3), r = VW.rng(55);
  const all = CONT.flatMap(c => c), sz = 640 * 0.94, cy = 260;
  for (let i = 0; i < n; i++) { const [u, v] = all[Math.floor(r() * all.length)]; swarmTo[i * 3] = (u - 0.5) * sz + (r() - 0.5) * 8; swarmTo[i * 3 + 1] = cy - (v - 0.5) * sz + (r() - 0.5) * 8; swarmTo[i * 3 + 2] = (r() - 0.5) * 60;
    const a = r() * 6.283, rad = 200 + r() * 260; swarmFrom[i * 3] = Math.cos(a) * rad; swarmFrom[i * 3 + 1] = 260 + r() * 300 - 150; swarmFrom[i * 3 + 2] = Math.sin(a) * rad;
    const gd = r() < 0.45; col[i * 3] = gd ? 1 : 0.55; col[i * 3 + 1] = gd ? 0.8 : 0.72; col[i * 3 + 2] = gd ? 0.35 : 1; }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(swarmPos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  swarm = new THREE.Points(g, new THREE.PointsMaterial({ size: 14, map: dotTex(), vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true })); S_SWARM.add(swarm); }
function secEnd(g, t) {
  const e = t - T.end, outA = 1 - lin(t, T.loop0, T.total - 0.12); space(g, t, 0.14 * outA + 0.04);
  const n = swarmPos.length / 3, r = VW.rng(3);
  for (let i = 0; i < n; i++) { const d = eio(clamp(e * 1.25 - (i % 97) / 97 * 0.35, 0, 1)), sp = (1 - d) * 1.4, ang = sp * 3 + i;
    for (let c = 0; c < 3; c++) swarmPos[i * 3 + c] = mix(swarmFrom[i * 3 + c], swarmTo[i * 3 + c], d); swarmPos[i * 3] += Math.cos(ang) * 120 * sp; swarmPos[i * 3 + 2] += Math.sin(ang) * 120 * sp; }
  swarm.geometry.attributes.position.needsUpdate = true; swarm.material.opacity = (1 - lin(e, 1.05, 1.5)) * outA;
  const a = mix(1.1, 0, eio(lin(e, 0, 1.1))); setCam(CAM, Math.sin(a) * D, 260 + 200 * (1 - eio(lin(e, 0, 1.1))), Math.cos(a) * D, 0, 260 * 0, 0, 0.12 * (1 - lin(e, 0, 1.1)));
  const mk = eo(lin(e, 0.95, 1.35)); mono.visible = mk > 0; mono.position.set(0, 260, 0); mono.scale.set(mix(1.05, 0.94, mk), mix(1.05, 0.94, mk), 1); mono.rotation.set(0, mix(0.6, 0, mk), 0);
  mono.material.uniforms.op.value = mk * outA; mono.material.uniforms.sweep.value = mix(-0.4, 1.6, lin(e, 1.0, 1.5)); mono.material.uniforms.rev.value = 1;
  const wk = eo(lin(e, 1.08, 1.5)); wm.visible = wmRef.visible = wk > 0; wm.scale.setScalar(1); wm.position.set(0, 960 - 1085 - (1 - wk) * 50, -(1 - wk) * 900); wm.rotation.set(mix(0.6, 0, wk), 0, 0);
  wm.material.uniforms.op.value = wk * outA; wm.material.uniforms.sweep.value = mix(-0.4, 1.6, lin(e, 1.25, 1.85)); wm.material.uniforms.rev.value = 1;
  wmRef.position.set(0, wm.position.y - 125, wm.position.z); wmRef.rotation.set(-wm.rotation.x, 0, 0); wmRef.material.uniforms.op.value = 0.06 * wk * outA;
  starsCam(t, 0, 0.6); stars.material.opacity = 0.55 * outA + 0.1; draw3D([[S_STARS, CAMS], [S_SWARM, CAM], [S_LOGO, CAM]]); stars.material.opacity = 1; blit(g, 1, 0.8);
  const fl = Math.exp(-Math.pow((e - 1.0) / 0.1, 2)); if (fl > 0.02) { g.fillStyle = `rgba(190,210,255,${0.25 * fl})`; g.fillRect(0, 0, W, H); }
  const C = VW.COL, TY = 1318, tagline = [['TRADE', C.ink], ['WITH', C.ink], ['INSTITUTIONAL', C.blue], ['CONTEXT.', C.ink]], full = tagline.map(w => w[0]).join(' '), le = e * 1.7;
  const chars = Math.floor(clamp((le - 2.35) / 1.0, 0, 1) * full.length);
  if (chars > 0) { g.save(); g.globalAlpha = outA; g.font = '700 32px VWMono'; g.letterSpacing = '5px'; g.textBaseline = 'middle'; g.textAlign = 'left'; const tw = g.measureText(full).width; let x = 540 - tw / 2 + 3, c = 0;
    tagline.forEach(([w, col], wi) => { const piece = (wi ? ' ' : '') + w; for (const ch of piece) { if (c >= chars) break; g.fillStyle = col; if (col === C.blue) { g.shadowColor = 'rgba(90,140,255,0.8)'; g.shadowBlur = 18; } else g.shadowBlur = 0; g.fillText(ch, x, TY); x += g.measureText(ch).width; c++; } });
    if (chars < full.length || Math.floor(le * 3) % 2 === 0) { g.shadowBlur = 0; g.fillStyle = C.blue; g.fillRect(x + 4, TY - 20, 4, 40); } g.restore(); }
  const dv = T.end + 3.45 / 1.7, k = eo(lin(t, dv, dv + 0.3)) * outA;
  if (k > 0) { g.save(); g.globalAlpha = k; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '700 44px VWMono'; g.letterSpacing = '5px'; g.fillStyle = C.blue; g.shadowColor = 'rgba(90,140,255,0.8)'; g.shadowBlur = 20; g.fillText('DISCOVER VOLWICK →', 543, 1410 + (1 - k) * 10); g.restore(); }
  const kd = eo(lin(t, dv + 0.3, dv + 0.7)) * outA; if (kd > 0) { g.save(); g.globalAlpha = kd; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '600 29px VWMono'; g.fillStyle = C.ink2; g.fillText('Simulated data. Not investment advice.', 540, 1496); g.restore(); }
}
// ---------- build, post, render ----------
function glowMat(rgb) { return new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { k: { value: 1 }, c: { value: new THREE.Color(...rgb) } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
  fragmentShader: 'uniform float k; uniform vec3 c; varying vec2 vUv; void main(){ float d=abs(vUv.y-0.5)*2.0; float a=exp(-d*d*9.0)*0.55*k; gl_FragColor=vec4(c*a, a); }' }); }
function build3D() {
  gl = document.createElement('canvas'); gl.width = W * K; gl.height = H * K;
  R = new THREE.WebGLRenderer({ canvas: gl, antialias: true, alpha: true, preserveDrawingBuffer: true });
  R.setPixelRatio(1); R.setSize(W * K, H * K, false); R.outputColorSpace = THREE.SRGBColorSpace; R.setClearColor(0x000000, 0); R.autoClear = false;
  CAM = new THREE.PerspectiveCamera(35, W / H, 10, 40000); CAMS = new THREE.PerspectiveCamera(50, W / H, 10, 60000);
  S_STARS = new THREE.Scene(); const n = 6000, pos = new Float32Array(n * 3), col = new Float32Array(n * 3), r = VW.rng(4242);
  for (let i = 0; i < n; i++) { pos[i * 3] = (r() - 0.5) * 14000; pos[i * 3 + 1] = (r() - 0.5) * 22000; pos[i * 3 + 2] = -r() * 30000 + 2000; const b = 0.45 + 0.55 * r(), bl = r(); col[i * 3] = b * mix(1, 0.55, bl); col[i * 3 + 1] = b * mix(1, 0.72, bl); col[i * 3 + 2] = b; }
  const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(pos, 3)); sg.setAttribute('color', new THREE.BufferAttribute(col, 3));
  stars = new THREE.Points(sg, new THREE.PointsMaterial({ size: 26, map: dotTex(), vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true })); S_STARS.add(stars);
  S_LOGO = new THREE.Scene(); mono = new THREE.Mesh(new THREE.PlaneGeometry(640, 640), logoMat(VW.assets.mono)); S_LOGO.add(mono);
  const wa = VW.assets.wm; wm = new THREE.Mesh(new THREE.PlaneGeometry(860, 860 * wa.height / wa.width), logoMat(wa)); S_LOGO.add(wm); wmRef = new THREE.Mesh(wm.geometry, logoMat(wa)); wmRef.scale.y = -1; S_LOGO.add(wmRef);
  buildStack(); buildShots(); build3(); buildPile(); buildSwarm(); }
const BEATS = []; for (let k = -7; k <= 25; k++) { const b = G(k); if (b >= 0 && b < 19.5) BEATS.push(+b.toFixed(3)); }
let TMP = null;
function post(g, t) {
  const cuts = [T.drop, T.c3, T.c4, T.end], zb = cuts.reduce((a, c) => a + Math.exp(-Math.pow((t - c) / 0.09, 2)), 0), bp = VW.punch(BEATS, t, 0.05) * (t < T.end ? 1 : 0.4);
  const amt = 0.16 * zb + 0.014 * bp; if (amt < 0.003) return;
  if (!TMP) { TMP = document.createElement('canvas'); TMP.width = VW.cv.width; TMP.height = VW.cv.height; }
  const tg = TMP.getContext('2d'), w = VW.cv.width, h = VW.cv.height; tg.setTransform(1, 0, 0, 1, 0, 0); tg.globalAlpha = 1; tg.clearRect(0, 0, w, h); tg.drawImage(VW.cv, 0, 0);
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); const n = zb > 0.05 ? 7 : 1;
  for (let k = 1; k <= n; k++) { const s = 1 + amt * k / n; g.globalAlpha = n > 1 ? 0.22 : 1; g.drawImage(TMP, (w - w * s) / 2, (h - h * s) / 2, w * s, h * s); }
  g.restore(); }
function render(t) {
  const g = VW.g; g.setTransform(K, 0, 0, K, 0, 0); g.globalAlpha = 1; g.filter = 'none'; g.globalCompositeOperation = 'source-over';
  if (t < T.brk) secStack(g, t); else if (t < T.drop) secBreak(g, t); else if (t < T.c3) secCuts(g, t); else if (t < T.c4) secMarket(g, t); else if (t < T.end) secPile(g, t); else secEnd(g, t);
  VW.vignette(); post(g, t);
}
window.READY = (async () => {
  await VW.loadFonts(); await VW.loadBrand(); genBars(); gen3(); CONT = await (await fetch('mono_contours.json')).json();
  build3D(); window.render = render; render(0);
  return { total: T.total, events: { T, beats: BEATS } };
})();
