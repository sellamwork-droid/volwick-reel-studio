// V0010 · EDIT 3D v2 (T1, 31 Oct 2026). Full-page 3D motion edit cut beat-for-beat on the reference edit Power uploaded
// (03_VIDEO_CONSIGLIATI/01_EDIT/snapgram.io_vumgpryxic1y.mp4, ~86 BPM, beats 1.37 2.09 2.79 3.48 4.18 4.88 5.62 6.27 6.99 7.66 8.36 9.08 ...).
// v2 after Power's notes (04:37): starfield 3D background; blue lines draw the V in 3D, the wordmark arrives and leaves;
// the V becomes a line that draws the long layer bar; on the terminal WALLS, BLOCK PRINTS and CVD switch on one by one
// and each one shows up on the chart while candles go up and down; no abstract waves; price runs into the call wall with
// the real wall tooltip; 3D carousel of layer panels drawn like the terminal; 3D rise with the price counting up to the
// wall; approved ending (same elements and layout) with the logo forming in 3D. No hook (T1). Simulated ES session.
import * as THREE from './lib/three.module.min.js';
const { lin, eo, eio, mix, clamp } = VW;
const T = { form: 1.22, mono: 1.37, wm: 1.45, wmOut: 1.80, unfold: 1.98, bar: 2.12, barEnd: 2.79, term: 2.79, aW: 2.79, aB: 3.48, aC: 4.18,
  push: 4.95, box: 5.25, tip: 5.62, wide: 5.95, cards: 6.27, c1: 6.99, c2: 7.66, rise: 8.0, wall: 8.86, end: 9.08, loop0: 12.0, total: 12.45 };
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
  BARS[107].h = 7768.0; BARS[37].l = 7735.5;
  PRINTS.forEach(pr => { const b = BARS[pr.i]; b.l = Math.min(b.l, pr.p); b.h = Math.max(b.h, pr.p); });
}
// ---------- 2D helpers ----------
function txt(g, s, x, y, font, col, al = 'left', bl = 'middle') { g.font = font; g.fillStyle = col; g.textAlign = al; g.textBaseline = bl; g.fillText(s, x, y); }
function rr(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function mkTex(w, h) { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const g = cv.getContext('2d');
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
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, W, H);
  g.fillStyle = `rgba(2,5,11,${s.bgA ?? 0.9})`; g.fillRect(0, 0, W, H);
  // header
  HDR.forEach(h => { g.save();
    if (h.kind === 'wm') { const wm = VW.assets.wm, hh = 44, ww = hh * wm.width / wm.height; g.globalCompositeOperation = 'lighter'; g.drawImage(wm, h.x, h.y - hh / 2, ww, hh); g.globalCompositeOperation = 'source-over';
      txt(g, '·  ES  ·  1m', h.x + ww + 18, h.y + 1, '600 28px VWMono', '#97A3B3'); }
    else if (h.kind === 'label') txt(g, h.s, h.x, h.y, '600 20px VWMono', '#5E6B80');
    else { const k = h.key ? (s.on[h.key] || 0) : 0, pu = h.key ? (s.pulse[h.key] || 0) : 0;
      rr(g, h.x, h.y - 22, h.w, 44, 10); g.fillStyle = `rgba(47,107,255,${0.05 + 0.3 * k})`; g.fill();
      if (k > 0) { g.shadowColor = 'rgba(90,140,255,0.9)'; g.shadowBlur = 10 + 30 * pu; }
      g.strokeStyle = `rgba(${mix(150, 120, k)},${mix(170, 165, k)},${mix(210, 255, k)},${0.22 + 0.7 * k})`; g.lineWidth = 1.5 + 1.5 * pu; g.stroke(); g.shadowBlur = 0;
      txt(g, h.s, h.x + 13, h.y + 1, '600 26px VWMono', k > 0.5 ? '#ECEFF4' : '#97A3B3');
      if (pu > 0.02) { g.globalAlpha = pu; rr(g, h.x - 10 * (1 - pu) - 4, h.y - 26 - 10 * (1 - pu), h.w + 8 + 20 * (1 - pu), 52 + 20 * (1 - pu), 14); g.strokeStyle = '#8AB6FF'; g.lineWidth = 2; g.stroke(); } }
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
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, BW, BH); const hx = u * BW;
  g.save(); g.beginPath(); g.rect(0, 0, hx, BH); g.clip(); rr(g, 6, 6, BW - 12, BH - 12, 28); g.fillStyle = 'rgba(8,14,30,0.92)'; g.fill(); g.restore();
  // outline drawn by the line
  g.save(); g.beginPath(); g.rect(0, 0, hx, BH); g.clip(); rr(g, 6, 6, BW - 12, BH - 12, 28); g.strokeStyle = 'rgba(138,182,255,0.95)'; g.lineWidth = 4; g.shadowColor = '#5A8CFF'; g.shadowBlur = 18; g.stroke(); g.restore();
  BARP.forEach(p => { const k = clamp((hx - p.x) / 120, 0, 1); if (k <= 0) return; g.save(); g.globalAlpha = eo(k); const y = BH / 2;
    if (p.kind === 'wm') { const wm = VW.assets.wm, hh = 52, ww = hh * wm.width / wm.height; g.globalCompositeOperation = 'lighter'; g.drawImage(wm, p.x, y - hh / 2, ww, hh); }
    else if (p.kind === 't') txt(g, p.s, p.x, y + 2, p.f, '#97A3B3');
    else if (p.kind === 'lab') txt(g, p.s, p.x, y + 2, p.f, '#5E6B80');
    else if (p.kind === 'sep') { g.fillStyle = 'rgba(140,170,230,0.3)'; g.fillRect(p.x, 34, 2, BH - 68); }
    else { rr(g, p.x, y - 32, p.w, 64, 14); g.fillStyle = 'rgba(255,255,255,0.05)'; g.fill(); g.strokeStyle = 'rgba(150,180,240,0.55)'; g.lineWidth = 2; g.stroke(); txt(g, p.s, p.x + 17, y + 2, p.f, '#C9D3E3'); }
    g.restore(); });
}
// ---------- layer panels (carousel) ----------
function miniCandles(g, x0, y0, w, h, i0, n, opt = {}) { const bs = BARS.slice(i0, i0 + n), lo = Math.min(...bs.map(b => b.l)) - 1, hi = Math.max(...bs.map(b => b.h)) + 1, sx = w / n, Y = p => y0 + h - (p - lo) / (hi - lo) * h;
  bs.forEach((b, i) => { const x = x0 + (i + 0.5) * sx, c = b.c >= b.o ? '#2FB67C' : '#E2575F'; g.globalAlpha = opt.a ?? 1; g.fillStyle = c; g.fillRect(x - 1, Y(b.h), 2, Y(b.l) - Y(b.h)); const t = Y(Math.max(b.o, b.c)); g.fillRect(x - sx * 0.32, t, sx * 0.64, Math.max(2, Y(Math.min(b.o, b.c)) - t)); });
  g.globalAlpha = 1; return { Y, X: i => x0 + (i - i0 + 0.5) * sx }; }
const PANELS = [
  { t: 'DEALER WALLS', grp: 'DEALER', c: '#39A86F', one: 'Options-derived dealer levels · Net $ per wall', draw(g) {
      const m = miniCandles(g, 40, 140, 600, 300, 60, 52, { a: 0.85 }); const L = [[7768.25, 'callL', '+$22.4M', 1], [7752.75, 'putS', '−$15.1M'], [7743.5, 'putL', '+$9.7M'], [7777.5, 'callS', '−$11.6M']];
      L.forEach(([p, f, net, st]) => { const y = clamp(m.Y(p), 130, 450), c = FAMC[f]; g.save(); g.strokeStyle = c; g.lineWidth = st ? 5 : 3; g.shadowColor = c; g.shadowBlur = st ? 26 : 14; g.beginPath(); g.moveTo(40, y); g.lineTo(860, y); g.stroke(); g.restore();
        txt(g, `${st ? '★ ' : ''}${money(p)} · ${net}`, 860, y - 20, '700 26px VWMono', c, 'right'); });
      [['call long γ', 'callL'], ['put long γ', 'putL'], ['call short γ', 'callS'], ['put short γ', 'putS']].forEach(([s, f], j) => { const x = 40 + j * 210; g.fillStyle = FAMC[f]; g.beginPath(); g.arc(x + 8, 490, 8, 0, 7); g.fill(); txt(g, s, x + 24, 491, '600 22px VWMono', '#C9D3E3'); }); } },
  { t: 'BLOCK PRINTS', grp: 'ACTIVITY', c: '#F2C14E', one: 'Large trades and where they stack on one price', draw(g) {
      const m = miniCandles(g, 40, 150, 820, 320, 64, 36, { a: 0.8 }); const y = m.Y(7756.25);
      g.save(); g.setLineDash([9, 7]); g.strokeStyle = 'rgba(235,240,250,0.85)'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(40, y); g.lineTo(860, y); g.stroke(); g.restore();
      [[76, 7756.25, '512', 0], [82, 7756.25, '318', 0], [88, 7756.25, '212', 0], [68, 7747.5, '742 ×2', 1]].forEach(([i, p, q, gd]) => { const x = m.X(i), yy = m.Y(p); g.save(); g.fillStyle = '#F4F6FA'; g.shadowColor = '#fff'; g.shadowBlur = 12; g.fillRect(x - 34, yy - 3.5, 68, 7); g.restore(); diamond(g, x, yy, 9, gd ? '#F2C14E' : '#F4F6FA'); badge(g, x + 22, yy - 34, q, gd, 26); });
      g.font = '700 28px VWMono'; const s = STAR.txt, tw = g.measureText(s).width, lx = 860 - tw - 30, ly = y + 62; rr(g, lx, ly - 26, tw + 30, 52, 10); g.fillStyle = 'rgba(8,12,22,0.96)'; g.fill(); g.strokeStyle = 'rgba(235,240,250,0.85)'; g.lineWidth = 2; g.stroke(); txt(g, s, lx + 15, ly + 1, '700 28px VWMono', '#ECEFF4');
      g.strokeStyle = 'rgba(235,240,250,0.6)'; g.beginPath(); g.moveTo(lx + tw / 2, ly - 26); g.lineTo(lx + tw / 2, y); g.stroke(); } },
  { t: 'CVD', grp: 'ACTIVITY', c: '#DCE6FF', one: 'Aggressive buys minus aggressive sells, cumulative', draw(g) {
      miniCandles(g, 40, 130, 820, 190, 40, 80, { a: 0.9 }); g.fillStyle = 'rgba(140,170,230,0.2)'; g.fillRect(40, 340, 820, 2); txt(g, 'CVD', 40, 372, '700 24px VWMono', '#DCE6FF');
      const cs = CVD.slice(40, 120), mn = Math.min(...cs), mx = Math.max(...cs); g.save(); g.strokeStyle = '#DCE6FF'; g.lineWidth = 4.5; g.shadowColor = 'rgba(200,215,255,0.9)'; g.shadowBlur = 18; g.beginPath();
      cs.forEach((v, i) => g[i ? 'lineTo' : 'moveTo'](40 + (i + 0.5) * 820 / 80, 470 - (v - mn) / (mx - mn) * 100)); g.stroke(); g.restore(); } },
  { t: 'EXPIRY', grp: 'DEALER', c: '#8AB6FF', one: 'Which expiries build the walls', draw(g) {
      ['0DTE', 'WEEK', 'MONTH', 'ALL'].forEach((m, j) => { const x = 40 + j * 205; rr(g, x, 140, 190, 84, 16); g.fillStyle = j ? 'rgba(255,255,255,0.05)' : 'rgba(47,107,255,0.45)'; g.fill(); g.strokeStyle = j ? 'rgba(150,170,210,0.35)' : '#8AB6FF'; g.lineWidth = 2.5; if (!j) { g.shadowColor = '#5A8CFF'; g.shadowBlur = 20; } g.stroke(); g.shadowBlur = 0; txt(g, m, x + 95, 183, '700 32px VWMono', j ? '#97A3B3' : '#FFFFFF', 'center'); });
      txt(g, '0DTE · 38 strikes', 40, 268, '700 28px VWMono', '#C9D3E3');
      WALLS.slice(0, 4).forEach((w, j) => { const y = 320 + j * 44, c = FAMC[w.fam]; g.save(); g.strokeStyle = c; g.lineWidth = 3; g.shadowColor = c; g.shadowBlur = 12; g.beginPath(); g.moveTo(40, y); g.lineTo(560, y); g.stroke(); g.restore(); txt(g, `${money(w.p)} · ${w.net}`, 860, y, '700 24px VWMono', c, 'right'); }); } },
  { t: 'METRIC', grp: 'DEALER', c: '#5A8CFF', one: 'GEX · CEX (charm) · DEX', draw(g) {
      ['GEX', 'CEX', 'DEX', 'ALL'].forEach((m, j) => { const x = 40 + j * 205; rr(g, x, 160, 190, 96, 16); g.fillStyle = j ? 'rgba(255,255,255,0.05)' : 'rgba(47,107,255,0.45)'; g.fill(); g.strokeStyle = j ? 'rgba(150,170,210,0.35)' : '#8AB6FF'; g.lineWidth = 2.5; g.stroke(); txt(g, m, x + 95, 209, '700 38px VWMono', j ? '#97A3B3' : '#FFFFFF', 'center'); });
      txt(g, 'dealer P&L exposure per 1-point move', 40, 330, '600 26px VWMono', '#C9D3E3'); } },
  { t: 'EXPOSURE MAPS', grp: 'DEALER', c: '#F59228', one: 'Maps behind the candles · MAP · GAMMA', draw(g) {
      const r = VW.rng(11); for (let cx = 0; cx < 22; cx++) for (let cy = 0; cy < 9; cy++) { const v = Math.sin(cx * 0.35 + cy * 0.8) + (r() - 0.5) * 0.5 - (cy - 4) * 0.25; g.fillStyle = v > 0 ? `rgba(47,107,255,${0.2 + 0.45 * Math.min(1, v)})` : `rgba(245,146,40,${0.2 + 0.45 * Math.min(1, -v)})`; g.fillRect(40 + cx * 37.3, 130 + cy * 35, 35, 33); }
      miniCandles(g, 40, 140, 820, 300, 50, 44); } },
  { t: 'CDI', grp: 'ACTIVITY', c: '#E2575F', one: '0DTE premium, calls vs puts, minute by minute', draw(g) {
      const r = VW.rng(5); for (let i = 0; i < 52; i++) { const v = (r() - 0.45) * 60 + (i === 34 ? 170 : 0), x = 40 + i * 15.8; g.fillStyle = v > 0 ? '#2FB67C' : '#E2575F'; g.fillRect(x, v > 0 ? 330 - v : 330, 11, Math.abs(v)); }
      txt(g, '$6.4M', 40 + 34 * 15.8 + 5, 140, '700 28px VWMono', '#2FB67C', 'center'); txt(g, 'C $2.1M · P $2.6M · Single-leg', 40, 470, '600 24px VWMono', '#97A3B3'); } },
  { t: 'OPTIONS FLOW', grp: 'ACTIVITY', c: '#2F6BFF', one: 'Premium bought at ask vs sold at bid', draw(g) {
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
let R, CAM, CAMS, S_STARS, stars, S_LOGO, mono, wm, wmRef, S_BAR, barM, barTex, S_TERM, term, termTex, S_CARDS, ring, cardMeshes = [], S_RISE, candleMesh, wallMesh, wallGlow, gl;
const D = 960 / Math.tan(THREE.MathUtils.degToRad(17.5));
function logoMat(img) { const t = new THREE.Texture(img); t.colorSpace = THREE.SRGBColorSpace; t.needsUpdate = true;
  return new THREE.ShaderMaterial({ uniforms: { map: { value: t }, op: { value: 1 }, rev: { value: 1 }, sweep: { value: -1 } }, transparent: true, depthWrite: false, premultipliedAlpha: true,
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: 'uniform sampler2D map; uniform float op, rev, sweep; varying vec2 vUv; void main(){ if (vUv.x > rev) discard; vec3 c = texture2D(map, vUv).rgb; float l = max(c.r, max(c.g, c.b)); float s = exp(-pow((vUv.x + vUv.y*0.35 - sweep)/0.06, 2.0)); vec3 o = (c + vec3(0.75,0.85,1.0)*s*l*1.6)*op; float a = clamp(max(o.r, max(o.g, o.b)), 0.0, 1.0); gl_FragColor = vec4(o, a); }' }); }
function dotTex() { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,255,255,0.8)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); const t = new THREE.CanvasTexture(c); return t; }
function build3D() {
  gl = document.createElement('canvas'); gl.width = W; gl.height = H;
  R = new THREE.WebGLRenderer({ canvas: gl, antialias: true, alpha: true, preserveDrawingBuffer: true });
  R.setPixelRatio(1); R.setSize(W, H, false); R.outputColorSpace = THREE.SRGBColorSpace; R.setClearColor(0x000000, 0); R.autoClear = false;
  CAM = new THREE.PerspectiveCamera(35, W / H, 10, 40000); CAMS = new THREE.PerspectiveCamera(50, W / H, 10, 60000);
  // starfield
  S_STARS = new THREE.Scene(); const n = 6000, pos = new Float32Array(n * 3), col = new Float32Array(n * 3), r = VW.rng(4242);
  for (let i = 0; i < n; i++) { pos[i * 3] = (r() - 0.5) * 14000; pos[i * 3 + 1] = (r() - 0.5) * 22000; pos[i * 3 + 2] = -r() * 30000 + 2000; const b = 0.45 + 0.55 * r(), bl = r();
    col[i * 3] = b * mix(1, 0.55, bl); col[i * 3 + 1] = b * mix(1, 0.72, bl); col[i * 3 + 2] = b; }
  const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(pos, 3)); sg.setAttribute('color', new THREE.BufferAttribute(col, 3));
  stars = new THREE.Points(sg, new THREE.PointsMaterial({ size: 26, map: dotTex(), vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true }));
  S_STARS.add(stars);
  // logo
  S_LOGO = new THREE.Scene();
  mono = new THREE.Mesh(new THREE.PlaneGeometry(640, 640), logoMat(VW.assets.mono)); S_LOGO.add(mono);
  const wa = VW.assets.wm; wm = new THREE.Mesh(new THREE.PlaneGeometry(860, 860 * wa.height / wa.width), logoMat(wa)); S_LOGO.add(wm);
  wmRef = new THREE.Mesh(wm.geometry, logoMat(wa)); wmRef.scale.y = -1; S_LOGO.add(wmRef);
  // long bar
  S_BAR = new THREE.Scene(); barTex = mkTex(BW, BH); layoutBar(barTex.g);
  barM = new THREE.Mesh(new THREE.PlaneGeometry(BW, BH), new THREE.MeshBasicMaterial({ map: barTex.tex, transparent: true })); S_BAR.add(barM);
  // terminal
  S_TERM = new THREE.Scene(); termTex = mkTex(W, H); layoutHeader(termTex.g);
  term = new THREE.Mesh(new THREE.PlaneGeometry(W, H), new THREE.MeshBasicMaterial({ map: termTex.tex, transparent: true })); S_TERM.add(term);
  // carousel
  S_CARDS = new THREE.Scene(); S_CARDS.fog = new THREE.Fog(0x050a1a, 3000, 6500); ring = new THREE.Group(); S_CARDS.add(ring);
  PANELS.forEach((P, j) => { const tex = panelTexture(P), m = new THREE.Mesh(new THREE.PlaneGeometry(900, 580), new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide }));
    const rf = new THREE.Mesh(m.geometry, new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.16, side: THREE.DoubleSide })); rf.scale.y = -1; rf.position.y = -600;
    const holder = new THREE.Group(); holder.add(m); holder.add(rf); ring.add(holder); cardMeshes.push(holder); });
  // 3D rise: candles as boxes, the call wall as a glowing bar
  S_RISE = new THREE.Scene(); S_RISE.fog = new THREE.Fog(0x040914, 2600, 7000);
  const box = new THREE.BoxGeometry(1, 1, 1); candleMesh = new THREE.InstancedMesh(box, new THREE.MeshBasicMaterial({ vertexColors: false }), N * 2); candleMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  for (let i = 0; i < N * 2; i++) candleMesh.setColorAt(i, new THREE.Color(i % 2 ? 0x2FB67C : 0x2FB67C)); S_RISE.add(candleMesh);
  wallMesh = new THREE.Mesh(new THREE.BoxGeometry(4200, 7, 7), new THREE.MeshBasicMaterial({ color: 0x5be39a })); S_RISE.add(wallMesh);
  wallGlow = new THREE.Mesh(new THREE.PlaneGeometry(4200, 160), new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { k: { value: 1 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: 'uniform float k; varying vec2 vUv; void main(){ float d=abs(vUv.y-0.5)*2.0; float a=exp(-d*d*9.0)*0.55*k; gl_FragColor=vec4(vec3(0.22,0.66,0.44)*a, a); }' })); S_RISE.add(wallGlow);
  const grid = new THREE.GridHelper(6000, 60, 0x1d3a7a, 0x10224a); grid.position.y = -700; S_RISE.add(grid);
}
function setCam(c, x, y, z, lx, ly, lz, roll = 0) { c.position.set(x, y, z); c.up.set(Math.sin(roll), Math.cos(roll), 0); c.lookAt(lx, ly, lz); c.updateMatrixWorld(); }
function proj(v, c = CAM) { const p = v.clone().project(c); return [(p.x + 1) * W / 2, (1 - p.y) * H / 2, p.z]; }
function draw3D(list) { R.clear(); list.forEach(([s, c]) => { R.render(s, c); R.clearDepth(); }); }
function starsCam(t, roll = 0, sp = 1) { setCam(CAMS, Math.sin(t * 0.3) * 150, Math.cos(t * 0.25) * 120, 2000 - t * 1100 * sp, Math.sin(t * 0.3) * 150 + roll * 800, 0, -20000, roll * 0.3); }
function blit(g, a = 1, bloom = 0.55) { g.save(); g.globalAlpha = a; g.drawImage(gl, 0, 0); if (bloom > 0) { g.globalCompositeOperation = 'lighter'; g.globalAlpha = a * bloom; g.filter = 'blur(14px)'; g.drawImage(gl, 0, 0); } g.restore(); }
function space(g, t, glowA = 0.14) { const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#040818'); bg.addColorStop(1, '#01030A'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
  const hz = g.createRadialGradient(540, 900, 40, 540, 900, 1200); hz.addColorStop(0, `rgba(47,107,255,${glowA})`); hz.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = hz; g.fillRect(0, 0, W, H); }
// blue light strands that draw the monogram outline in 3D (logo centre in world coords, size s)
function strands(g, t0, t1, t, cx, cy, s, cam, opt = {}) {
  const m = lin(t, t0, t1); if (m <= 0) return; g.save(); g.globalCompositeOperation = 'lighter'; g.lineJoin = 'round'; g.lineCap = 'round';
  const fade = opt.fade ?? 1, from = opt.from;
  CONT.forEach((cn, ci) => { const n = cn.length;
    for (let L = 0; L < 4; L++) { const zoff = (L - 1.5) * 26, sc = 1 + (L - 1.5) * 0.012, delay = L * 0.06 + ci * 0.12;
      const pts = []; for (let i = 0; i < n; i++) { const d = clamp((m - delay) * 1.7 - (i / n) * 0.6, 0, 1); if (d <= 0) continue; const k = eio(d), [u, v] = cn[i];
        const tx = cx + (u - 0.5) * s * sc, ty = cy - (v - 0.5) * s * sc, tz = zoff;
        let sx, sy, sz; if (from) { const [fx, fy] = from(i / (n - 1)); sx = fx; sy = fy; sz = 0; } else { const a = (i / n) * 9 + L * 1.3 + ci; sx = tx * 4 + Math.cos(a) * 1600; sy = ty * 3 + Math.sin(a) * 1600; sz = -4200 + L * 300; }
        pts.push(proj(new THREE.Vector3(mix(sx, tx, k), mix(sy, ty, k), mix(sz, tz, k)), cam)); }
      if (pts.length < 2) continue;
      g.strokeStyle = L === 1 ? `rgba(235,242,255,${0.95 * fade})` : `rgba(90,140,255,${0.75 * fade})`; g.lineWidth = L === 1 ? 3.2 : 2.2; g.shadowColor = '#5A8CFF'; g.shadowBlur = 22;
      g.beginPath(); pts.forEach((p, i) => g[i ? 'lineTo' : 'moveTo'](p[0], p[1])); g.stroke();
      const h = pts[pts.length - 1]; if (opt.heads !== false && m < 1) { const gr = g.createRadialGradient(h[0], h[1], 0, h[0], h[1], 26); gr.addColorStop(0, `rgba(255,255,255,${0.9 * fade})`); gr.addColorStop(1, 'rgba(90,140,255,0)'); g.fillStyle = gr; g.fillRect(h[0] - 26, h[1] - 26, 52, 52); } } });
  g.restore(); }
// ---------- sections ----------
function secLogo(g, t) {   // 0 → 2.12: lines draw the V in 3D, wordmark arrives and leaves, the V folds into a line
  space(g, t, 0.10 + 0.12 * eo(lin(t, 0.6, T.mono)));
  const a = mix(0.85, 0, eio(lin(t, 0, T.mono))), cy = 120;
  setCam(CAM, Math.sin(a) * D * 0.9, cy + 260 * (1 - eo(lin(t, 0, T.mono))), Math.cos(a) * D * 0.9 + D * 0.1, 0, cy, 0, -0.12 * (1 - lin(t, 0, T.mono)));
  starsCam(t, a * 0.3); const mk = eo(lin(t, T.form, T.mono + 0.1)), out = lin(t, T.unfold, T.unfold + 0.18);
  mono.position.set(0, cy, 0); mono.rotation.set(0, 0, 0); mono.scale.set(1, mix(1, 0.02, eio(lin(t, T.unfold - 0.04, T.unfold + 0.12))), 1);
  mono.material.uniforms.op.value = mk * (1 - out * 0.3); mono.material.uniforms.sweep.value = mix(-0.4, 1.6, lin(t, T.mono, T.mono + 0.45));
  const wk = eo(lin(t, T.wm, T.wm + 0.3)), wo = eio(lin(t, T.wmOut, T.unfold + 0.08));
  wm.visible = wmRef.visible = t > T.wm; wm.position.set(wo * 900, cy - 430 - (1 - wk) * 60, -wo * 1800); wm.rotation.set(0, -wo * 0.9, 0);
  wm.material.uniforms.op.value = wk * (1 - wo); wm.material.uniforms.sweep.value = mix(-0.4, 1.6, lin(t, T.wm + 0.1, T.wm + 0.5)); wm.material.uniforms.rev.value = 1;
  wmRef.position.set(wm.position.x, cy - 430 - 120 - (1 - wk) * 60, wm.position.z); wmRef.rotation.copy(wm.rotation); wmRef.material.uniforms.op.value = 0.06 * wk * (1 - wo);
  mono.visible = t > T.form; stars.material.opacity = 1;
  draw3D([[S_STARS, CAMS], [S_LOGO, CAM]]); blit(g, 1, 0.7);
  strands(g, 0.05, T.mono, t, 0, cy, 640, CAM, { fade: 1 - lin(t, T.mono + 0.05, T.mono + 0.3) });
  // the V folds into one horizontal line of light
  if (t > T.unfold - 0.02) { const k = eio(lin(t, T.unfold, T.bar)), y = 960 - cy, half = mix(150, 520, k);
    g.save(); g.globalCompositeOperation = 'lighter'; g.shadowColor = '#8AB6FF'; g.shadowBlur = 30; g.fillStyle = '#F2F6FF'; rr(g, 540 - half, y - 4, half * 2, 8, 4); g.fill(); g.restore(); }
}
function secBar(g, t) {   // 2.12 → 2.79: the line runs lengthwise and draws the layer bar in 3D
  space(g, t, 0.12); const u = eio(lin(t, T.bar, T.barEnd - 0.12)), sw = eio(lin(t, T.barEnd - 0.16, T.barEnd));
  drawBar(barTex.g, Math.max(0.0001, u)); barTex.tex.needsUpdate = true;
  barM.position.set(0, mix(0, 820, sw), mix(0, -600, sw)); barM.rotation.set(mix(0.12, 0, sw), mix(-0.95, 0, sw), mix(0.05, 0, sw)); barM.scale.setScalar(mix(1, 0.36, sw));
  const head = new THREE.Vector3(-BW / 2 + u * BW, 0, 0).applyMatrix4((barM.updateMatrixWorld(), barM.matrixWorld));
  const cz = mix(D * 0.92, D, sw); setCam(CAM, mix(head.x * 0.35, 0, sw), 80, cz + mix(head.z * 0.3, 0, sw), mix(head.x * 0.55, 0, sw), mix(0, 300, sw), mix(head.z * 0.6, 0, sw));
  starsCam(t, 0.1); draw3D([[S_STARS, CAMS], [S_BAR, CAM]]); blit(g, 1, 0.6);
  if (u < 1) { const [hx, hy] = proj(head); g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createRadialGradient(hx, hy, 0, hx, hy, 90); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.2, 'rgba(140,180,255,0.7)'); gr.addColorStop(1, 'rgba(47,107,255,0)'); g.fillStyle = gr; g.fillRect(hx - 90, hy - 90, 180, 180); g.restore(); }
}
function termState(t) {
  const act = (a) => eo(lin(t, a + 0.5, a + 0.62)), pul = (a) => Math.exp(-Math.pow((t - a - 0.62) / 0.12, 2));
  return { on: { W: act(T.aW), B: act(T.aB), C: act(T.aC) }, pulse: { W: pul(T.aW), B: pul(T.aB), C: pul(T.aC) },
    walls: WALLS.map((w, j) => lin(t, T.aW + 0.62 + j * 0.08, T.aW + 0.62 + j * 0.08 + 0.3)), star: lin(t, T.aB + 0.62, T.aB + 0.9), prints: eo(lin(t, T.aB + 0.6, T.aB + 0.75)),
    cvd: lin(t, T.aC + 0.6, T.aC + 1.0), bars: mix(18, N, eio(lin(t, T.term, 5.7))), box: lin(t, T.box, T.box + 0.4), boxK: 1 - lin(t, T.wide + 0.05, T.wide + 0.25),
    tip: lin(t, T.tip, T.tip + 0.18) * (1 - lin(t, T.cards - 0.15, T.cards)), disc: lin(t, T.term + 0.3, T.term + 0.6), bgA: 0.88 }; }
const ACT = [ { t: T.aW, s: 'DEALER WALLS', key: 'W', c: '#39A86F' }, { t: T.aB, s: 'BLOCK PRINTS', key: 'B', c: '#F2C14E' }, { t: T.aC, s: 'CVD', key: 'C', c: '#DCE6FF' } ];
function secTerm(g, t) {   // 2.79 → 6.27: terminal, layers switch on one by one, run into the call wall
  space(g, t, 0.08); drawTerminal(termTex.g, termState(t)); termTex.tex.needsUpdate = true;
  const enter = eo(lin(t, T.term, T.term + 0.35)), push = eio(lin(t, T.push, T.push + 0.55)), out = eio(lin(t, T.wide, T.cards));
  const fx = BX(106) - 540, fy = 960 - PY(7766), s = (1 + 0.5 * push) * mix(1.1, 1, enter) * mix(1, 0.72, out);
  term.scale.set(s, s, 1); term.position.set(-fx * 0.5 * push * (1 - out), -fy * 0.5 * push * (1 - out), -300 * out);
  term.rotation.set(0.05 * Math.sin(t * 1.1) * (1 - push) + 0.22 * out, -0.04 * Math.cos(t * 0.9) * (1 - push) - 0.35 * out, 0.04 * out);
  setCam(CAM, 0, 0, D, 0, 0, 0); starsCam(t); draw3D([[S_STARS, CAMS], [S_TERM, CAM]]); blit(g, 1, 0.35);
  if (t < T.term + 0.12) { g.fillStyle = `rgba(220,230,255,${0.4 * (1 - lin(t, T.term, T.term + 0.12))})`; g.fillRect(0, 0, W, H); }
  // the layer name flies into its chip, then the chip switches on
  ACT.forEach(A => { const a = lin(t, A.t + 0.02, A.t + 0.2), f = eio(lin(t, A.t + 0.32, A.t + 0.6)); if (a <= 0 || f >= 1) return;
    const [cx, cyy] = chipPos(A.key), c3 = proj(new THREE.Vector3(cx - 540, 960 - cyy, 0).applyMatrix4(term.matrixWorld)), x = mix(540, c3[0], f), y = mix(1000, c3[1], f), sc = mix(1, 0.24, f) * mix(1.25, 1, eo(a));
    g.save(); g.globalAlpha = eo(a) * (1 - lin(f, 0.75, 1)); g.translate(x, y); g.scale(sc, sc);
    const bgk = g.createRadialGradient(0, 0, 10, 0, 0, 520); bgk.addColorStop(0, `rgba(2,5,11,${0.75 * (1 - f)})`); bgk.addColorStop(1, 'rgba(2,5,11,0)'); g.fillStyle = bgk; g.fillRect(-560, -260, 1120, 520);
    g.shadowColor = A.c; g.shadowBlur = 40; txt(g, A.s, 0, 0, '700 112px VWSans', '#FFFFFF', 'center'); g.shadowBlur = 0; g.fillStyle = A.c; g.fillRect(-120, 78, 240, 8);
    txt(g, A.key === 'C' ? 'ACTIVITY' : A.key === 'B' ? 'ACTIVITY' : 'DEALER', 0, -100, '600 34px VWMono', '#97A3B3', 'center'); g.restore(); });
  const bl = lin(t, T.cards - 0.14, T.cards); if (bl > 0) { g.save(); g.globalAlpha = bl; g.fillStyle = 'rgba(8,20,60,0.85)'; g.fillRect(0, 0, W, H); g.restore(); }
}
function ringRot(t) { const k = eio(lin(t, T.cards, T.cards + 0.45)) * 0 + eio(lin(t, T.c1 - 0.12, T.c1 + 0.2)) + eio(lin(t, T.c2 - 0.12, T.c2 + 0.2)) + 1.6 * eio(lin(t, T.rise - 0.2, T.rise)); return k * Math.PI * 2 / PANELS.length; }
function secCards(g, t) {   // 6.27 → 8.0: carousel of layer panels, each drawn like the terminal
  space(g, t, 0.22); const Rr = 1500, n = PANELS.length, rot = ringRot(t), ent = eo(lin(t, T.cards, T.cards + 0.5));
  cardMeshes.forEach((h, j) => { const a = j * Math.PI * 2 / n - rot; h.position.set(Math.sin(a) * Rr, 0, Math.cos(a) * Rr - Rr); h.rotation.set(0, a, 0); });
  ring.position.set(0, 60, mix(-2600, 0, ent)); ring.rotation.set(mix(0.5, 0.1, ent), mix(-1.4, 0, ent), mix(0.12, 0, ent));
  setCam(CAM, 0, 200, D * 0.9, 0, 40, 0); starsCam(t, 0.2, 1.3); draw3D([[S_STARS, CAMS], [S_CARDS, CAM]]);
  const bl = 1 - lin(t, T.cards, T.cards + 0.22); g.save(); if (bl > 0.02) g.filter = `blur(${(16 * bl).toFixed(1)}px)`; g.drawImage(gl, 0, 0); g.restore(); blit(g, 0, 0); g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.35; g.filter = 'blur(16px)'; g.drawImage(gl, 0, 0); g.restore();
  // which panel is in front: its group and position in the terminal row
  const idx = Math.round(rot / (Math.PI * 2 / n)) % n, P = PANELS[idx], k = eo(lin(t, T.cards + 0.25, T.cards + 0.5)) * (1 - lin(t, T.rise - 0.15, T.rise));
  if (k > 0) { g.save(); g.globalAlpha = k; txt(g, `VOLWICK · ${P.grp}`, 540, 560, '600 30px VWMono', '#8AB6FF', 'center'); g.fillStyle = 'rgba(138,182,255,0.6)'; g.fillRect(470, 590, 140, 3); g.restore(); }
}
// 3D rise: the session in 3D, the price counts up into the call wall
const RX = i => (i - 60) * 46, RY = p => (p - 7752) * 34;
function riseCam(t) { const k = eio(lin(t, T.rise, T.end)); setCam(CAM, mix(-1700, 900, k), mix(-150, 420, k), mix(2300, 2000, k), mix(-300, 1500, k), mix(-120, 520, k), mix(-200, -500, k), mix(0.08, -0.04, k)); }
function secRise(g, t) {
  space(g, t, 0.16); const k = lin(t, T.rise, T.wall), nb = mix(36, N, eio(k)), M = new THREE.Matrix4(), C = new THREE.Color();
  for (let i = 0; i < N; i++) { const b = BARS[i], g0 = clamp(nb - i, 0, 1), up = b.c >= b.o; C.set(up ? 0x2FB67C : 0xE2575F);
    const top = RY(Math.max(b.o, b.c)), bot = RY(Math.min(b.o, b.c)), hb = Math.max(6, top - bot) * g0;
    M.makeScale(26, hb, 26); M.setPosition(RX(i), bot + hb / 2, 0); candleMesh.setMatrixAt(i * 2, M); candleMesh.setColorAt(i * 2, C);
    const hw = (RY(b.h) - RY(b.l)) * g0; M.makeScale(5, Math.max(1, hw), 5); M.setPosition(RX(i), RY(b.l) + hw / 2, 0); candleMesh.setMatrixAt(i * 2 + 1, M); candleMesh.setColorAt(i * 2 + 1, C); }
  candleMesh.instanceMatrix.needsUpdate = true; candleMesh.instanceColor.needsUpdate = true;
  const hit = Math.exp(-Math.pow((t - T.wall) / 0.08, 2)); wallMesh.position.set(0, RY(7768.25), 0); wallGlow.position.copy(wallMesh.position); wallGlow.material.uniforms.k.value = 0.7 + 2.5 * hit;
  wallMesh.scale.set(1, 1 + 2 * hit, 1 + 2 * hit); riseCam(t); starsCam(t, -0.1); draw3D([[S_STARS, CAMS], [S_RISE, CAM]]); blit(g, 1, 0.7);
  // wall label in 3D space
  const wl = proj(new THREE.Vector3(RX(118), RY(7768.25) + 40, 0)); g.save(); g.globalAlpha = eo(lin(t, T.rise + 0.1, T.rise + 0.4)); txt(g, '★ 7,768.25 · +$22.4M', Math.min(930, wl[0]), wl[1] - 16, '700 30px VWMono', '#39A86F', 'right'); g.restore();
  // the counter: current price in big 3D type
  const ci = Math.min(N - 1, Math.floor(nb)), p = BARS[ci].c, reach = lin(t, T.wall - 0.04, T.wall + 0.1), s = money(Math.round(Math.min(7768.25, p + (7768.25 - p) * reach) * 4) / 4);
  g.save(); g.translate(540, 560); g.transform(1, -0.06, 0, 1, 0, 0); const col = reach > 0.5 ? '#5BE39A' : '#FFFFFF';
  for (let d = 14; d > 0; d--) txt(g, s, d * 1.2, d * 1.8, '700 150px VWSans', `rgba(${reach > 0.5 ? '20,90,55' : '25,50,120'},${0.9 - d * 0.04})`, 'center');
  g.shadowColor = reach > 0.5 ? 'rgba(57,168,111,0.9)' : 'rgba(90,140,255,0.8)'; g.shadowBlur = 36 + 40 * hit; txt(g, s, 0, 0, '700 150px VWSans', col, 'center'); g.restore();
  txt(g, 'ES', 540, 440, '700 34px VWMono', '#8AB6FF', 'center');
  const lk = eo(lin(t, T.wall, T.wall + 0.15)); if (lk > 0) { g.save(); g.globalAlpha = lk; txt(g, 'CALL WALL · LONG γ · NET +$22.4M', 540, 690, '700 34px VWMono', '#5BE39A', 'center'); g.restore(); }
  if (hit > 0.05) { g.fillStyle = `rgba(200,255,225,${0.18 * hit})`; g.fillRect(0, 0, W, H); }
  txt(g, 'Simulated ES session.', 540, 1540, '500 19px VWMono', '#7F8AA0', 'center');
}
// price line of the 3D rise in screen space at the cut: it becomes the logo
function riseLine() { riseCam(T.end); const out = []; for (let k = 0; k < 60; k++) { const i = Math.round(60 + k * (N - 61) / 59); out.push(proj(new THREE.Vector3(RX(i), RY(BARS[i].c), 0))); } return out; }
let LINE = null;
function secEnd(g, t) {   // approved ending, same elements and layout, the logo forms in 3D
  const e = t - T.end, outA = 1 - lin(t, T.loop0, T.total - 0.12); space(g, t, 0.14 * outA + 0.04);
  const cy = 260, a = mix(0.95, 0, eio(lin(e, 0.1, 1.1)));
  setCam(CAM, Math.sin(a) * D, 160 * (1 - eio(lin(e, 0.1, 1.1))) + cy * 0, Math.cos(a) * D, 0, 0, 0, 0.1 * (1 - lin(e, 0, 1.1)));
  const from = u => { const f = u * (LINE.length - 1), i = Math.floor(f), r = f - i, A = LINE[i], B = LINE[Math.min(LINE.length - 1, i + 1)]; return [mix(A[0], B[0], r) - 540, 960 - mix(A[1], B[1], r)]; };
  const mk = eo(lin(e, 0.95, 1.35));
  mono.visible = mk > 0; mono.position.set(0, cy, 0); mono.scale.set(mix(1.05, 0.94, mk), mix(1.05, 0.94, mk), 1); mono.rotation.set(mix(-0.25, 0, mk), mix(0.45, 0, mk), 0);
  mono.material.uniforms.op.value = mk * outA; mono.material.uniforms.sweep.value = mix(-0.4, 1.6, lin(e, 1.0, 1.5));
  const wk = eo(lin(e, 1.08, 1.5)); wm.visible = wmRef.visible = wk > 0; wm.position.set(0, 960 - 1085 - (1 - wk) * 50, -(1 - wk) * 900); wm.rotation.set(mix(0.6, 0, wk), 0, 0);
  wm.material.uniforms.op.value = wk * outA; wm.material.uniforms.sweep.value = mix(-0.4, 1.6, lin(e, 1.25, 1.85)); wm.material.uniforms.rev.value = 1;
  wmRef.position.set(0, wm.position.y - 125, wm.position.z); wmRef.rotation.set(-wm.rotation.x, 0, 0); wmRef.material.uniforms.op.value = 0.06 * wk * outA;
  starsCam(t, 0, 0.6); stars.material.opacity = 0.55 * outA + 0.1; draw3D([[S_STARS, CAMS], [S_LOGO, CAM]]); stars.material.opacity = 1; blit(g, 1, 0.8);
  strands(g, -0.02, 1.0, e, 0, cy, 640 * 0.94, CAM, { from, fade: (1 - lin(e, 1.05, 1.35)) * outA });
  const fl = Math.exp(-Math.pow((e - 1.0) / 0.1, 2)); if (fl > 0.02) { g.fillStyle = `rgba(190,210,255,${0.25 * fl})`; g.fillRect(0, 0, W, H); }
  // tagline typed, DISCOVER VOLWICK →, disclaimer: same text, fonts and positions as the approved ending (VX.end)
  const C = VW.COL, TY = 1318, tagline = [['TRADE', C.ink], ['WITH', C.ink], ['INSTITUTIONAL', C.blue], ['CONTEXT.', C.ink]], full = tagline.map(w => w[0]).join(' '), le = e * 1.7;
  const chars = Math.floor(clamp((le - 2.35) / 1.0, 0, 1) * full.length);
  if (chars > 0) { g.save(); g.globalAlpha = outA; g.font = '700 32px VWMono'; g.letterSpacing = '5px'; g.textBaseline = 'middle'; g.textAlign = 'left'; const tw = g.measureText(full).width; let x = 540 - tw / 2 + 3, c = 0;
    tagline.forEach(([w, col], wi) => { const piece = (wi ? ' ' : '') + w; for (const ch of piece) { if (c >= chars) break; g.fillStyle = col; if (col === C.blue) { g.shadowColor = 'rgba(90,140,255,0.8)'; g.shadowBlur = 18; } else g.shadowBlur = 0; g.fillText(ch, x, TY); x += g.measureText(ch).width; c++; } });
    if (chars < full.length || Math.floor(le * 3) % 2 === 0) { g.shadowBlur = 0; g.fillStyle = C.blue; g.fillRect(x + 4, TY - 20, 4, 40); } g.restore(); }
  const dv = T.end + 3.45 / 1.7, k = eo(lin(t, dv, dv + 0.3)) * outA;
  if (k > 0) { g.save(); g.globalAlpha = k; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '700 44px VWMono'; g.letterSpacing = '5px'; g.fillStyle = C.blue; g.shadowColor = 'rgba(90,140,255,0.8)'; g.shadowBlur = 20; g.fillText('DISCOVER VOLWICK →', 543, 1410 + (1 - k) * 10); g.restore(); }
  const kd = eo(lin(t, dv + 0.3, dv + 0.7)) * outA; if (kd > 0) { g.save(); g.globalAlpha = kd; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '600 29px VWMono'; g.fillStyle = C.ink2; g.fillText('Simulated data. Not investment advice.', 540, 1496); g.restore(); }
}
// ---------- render ----------
function render(t) {
  const g = VW.g; g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.filter = 'none'; g.globalCompositeOperation = 'source-over';
  if (t < T.bar) secLogo(g, t); else if (t < T.term) secBar(g, t); else if (t < T.cards) secTerm(g, t); else if (t < T.rise) secCards(g, t); else if (t < T.end) secRise(g, t); else secEnd(g, t);
  const fl = VW.punch([T.mono, T.cards, T.rise, T.end], t, 0.04); if (fl > 0.02) { g.fillStyle = `rgba(210,225,255,${0.14 * fl})`; g.fillRect(0, 0, W, H); }
  VW.vignette();
}
window.READY = (async () => {
  await VW.loadFonts(); await VW.loadBrand(); genBars(); CONT = await (await fetch('mono_contours.json')).json();
  build3D(); LINE = riseLine(); window.render = render; render(0);
  return { total: T.total, events: { T } };
})();
