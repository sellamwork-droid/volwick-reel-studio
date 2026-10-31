// V0006 · THE BAR, 3D cut (T4, 31 Oct 2026). Power 16:11: same story, animation and editing in the style of V0010 "03 Edit 3D il terminale Volwick che si forma"
// (scenes/v0010_edit3d): starfield, panels in real 3D, the terminal forming full page, layer names flying into their chips, 3D candles, 3D logo ending.
// Story: the trader's line at 7,731.50 → price rips through it → rejected one tick under the call wall (long γ, +$12.6M) → back under the line.
// Hook (pole vaulter) composited in front (0.755 s = 1 beat of "Never stop trading", ~79 BPM). Simulated ES session (scenes/v0006_dyn/gen_data.py), no real data.
import * as THREE from '../v0010_edit3d/lib/three.module.min.js';   // shared copy
const { lin, eo, eio, mix, clamp } = VW;
const BT = 0.755;   // one beat of the track
const T = { top1: 2 * BT, fold: 3 * BT, bar: 3.5 * BT, barEnd: 4.5 * BT, term: 4.5 * BT, aW: 4.5 * BT, push: 6.5 * BT, hit: 8 * BT, tip: 9.6 * BT, aB: 9 * BT, wide: 10.5 * BT,
  rise: 11 * BT, hit2: 13 * BT, end: 15 * BT };
T.loop0 = T.end + 3.9; T.total = T.end + 4.35;
const W = 1080, H = 1920;
// ---------- session ----------
let BARS = [], N = 0;
const RES = 7731.5;
const PPX = 30; let ZF = 1, ZX = 1, PF = 7727.67;   // chart zoom inside the terminal (Power 15:58: zoom like a trading platform, the price axis follows)
const PY = p => 960 - (p - PF) * PPX * ZF;
const SPT = 9.2, HX = 36 + 56 * SPT, BX = i => HX + (36 + i * SPT - HX) * ZX;
const WALLS = [ { p: 7741.5, fam: 'callS', net: '−$6.4M' }, { p: 7733.5, fam: 'callL', net: '+$12.6M', star: true }, { p: 7727.5, fam: 'callL', net: '+$3.9M' },
  { p: 7722.5, fam: 'putL', net: '+$9.7M' }, { p: 7712.5, fam: 'putS', net: '−$8.8M' } ];
const FAMC = { callL: '#39A86F', callS: '#49B7CC', putL: '#CF5D5D', putS: '#B16FD0' };
const PRINTS = [ { i: 20, p: 7731.25, q: '740', gold: true }, { i: 38, p: 7725.0, q: '410' }, { i: 57, p: 7733.0, q: '1,250 ×2', gold: true }, { i: 59, p: 7723.5, q: '880', gold: true }, { i: 66, p: 7724.5, q: '460' } ];
let CONT = [];
const st = s => ({ s, k: Math.floor(s) + 1, f: s - Math.floor(s) });
function barAt(i, S) { const b = BARS[i]; if (!b) return null; if (i < S.k) return b; if (i > S.k) return null;
  const n = b.path.length - 1, u = S.f * n, j = Math.floor(u); let h = b.o, l = b.o; for (let q = 0; q <= Math.min(j, n); q++) { h = Math.max(h, b.path[q]); l = Math.min(l, b.path[q]); }
  const c = b.path[Math.min(j, n)]; return { o: b.o, h: Math.max(h, c), l: Math.min(l, c), c, v: b.v * S.f }; }
const lastP = S => { const b = barAt(S.k, S); return b ? b.c : BARS[S.k - 1].c; };
function sAt(P, t) { if (t <= P[0][0]) return P[0][1]; for (let q = 0; q < P.length - 1; q++) { const [a, sa] = P[q], [b, sb] = P[q + 1]; if (t <= b) return sa + (sb - sa) * eio(clamp((t - a) / (b - a), 0, 1)); } return P[P.length - 1][1]; }
const SFLAT = [[0, 52.1], [T.top1, 56.2], [T.fold, 57.75], [T.bar, 57.95]];
const STERM = [[T.term, 44], [T.push, 52.0], [T.hit, 56.2], [T.tip, 57.5], [T.wide, 60.0], [T.rise, 60.4]];
// ---------- 2D helpers ----------
function txt(g, s, x, y, font, col, al = 'left', bl = 'middle') { g.font = font; g.fillStyle = col; g.textAlign = al; g.textBaseline = bl; g.fillText(s, x, y); }
function rr(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function mkTex(w, h) { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const g = cv.getContext('2d');
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; tex.minFilter = THREE.LinearMipmapLinearFilter; return { cv, g, tex }; }
function money(p) { return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function diamond(g, x, y, s, col) { g.save(); g.translate(x, y); g.rotate(Math.PI / 4); g.fillStyle = col; g.fillRect(-s, -s, 2 * s, 2 * s); g.restore(); }
function badge(g, x, y, q, gold, f = 21) { g.font = `700 ${f}px VWMono`; const tw = g.measureText(q).width; rr(g, x, y - f * 0.75, tw + 18, f * 1.45, 6); g.fillStyle = gold ? '#F2C14E' : '#E9EDF5'; g.fill(); txt(g, q, x + 9, y, `700 ${f}px VWMono`, '#0A0E16'); }

// ---------- the normal chart: a white charting panel floating in space ----------
const FW = 960, FH = 1280, FLO = 7717, FHI = 7737, fy0 = 196, fy1 = 1150, fpy = p => fy1 - (p - FLO) / (FHI - FLO) * (fy1 - fy0), FSP = 19, FXR = 770;
const fxx = (i, S) => FXR - (S.s - i) * FSP;
function drawFlat(g, S, t) {
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, FW, FH); rr(g, 0, 0, FW, FH, 26); g.fillStyle = '#FFFFFF'; g.fill();
  const LTX = '#131722', SUB = '#787B86', UP = '#089981', DN = '#F23645', BL = '#2962FF', last = barAt(S.k, S) || BARS[S.k - 1], lp = last.c;
  txt(g, '⌕  ES', 34, 52, '700 30px VWSans', LTX); txt(g, '1m', 160, 52, '700 30px VWSans', LTX); txt(g, 'ƒx  Indicators', 236, 52, '600 29px VWSans', LTX);
  rr(g, 470, 28, 156, 48, 9); g.fillStyle = '#E3EFFD'; g.fill(); txt(g, '⟲ Replay', 490, 53, '700 28px VWSans', BL);
  g.fillStyle = '#E0E3EB'; g.fillRect(0, 98, FW, 2); g.fillRect(820, 100, 2, FH - 160);
  const col = lp >= last.o ? UP : DN; let lx = 34; lx += txt2(g, 'E-mini S&P 500 Futures · 1 · CME', lx, 136, '600 25px VWSans', LTX) + 16;
  for (const [k, v] of [['O', last.o], ['H', last.h], ['L', last.l], ['C', lp]]) { lx += txt2(g, k, lx, 136, '600 24px VWSans', SUB) + 4; lx += txt2(g, money(v), lx, 136, '600 24px VWSans', col) + 12; }
  g.save(); g.beginPath(); g.rect(10, fy0 - 30, 810, fy1 - fy0 + 60); g.clip();
  for (let p = FLO; p <= FHI; p += 2) { g.fillStyle = '#F0F3FA'; g.fillRect(10, Math.round(fpy(p)), 810, 2); }
  for (let i = 0; i <= S.k; i++) { const b = barAt(i, S); if (!b) continue; const x = fxx(i, S); if (x < 0) continue; const c = b.c >= b.o ? UP : DN; g.fillStyle = c;
    g.fillRect(x - 1.5, fpy(b.h), 3, fpy(b.l) - fpy(b.h)); const y0 = fpy(Math.max(b.o, b.c)); g.fillRect(x - 7, y0, 14, Math.max(3, fpy(Math.min(b.o, b.c)) - y0));
    g.globalAlpha = 0.35; const vh = Math.min(70, b.v / 3600 * 70); g.fillRect(x - 7, fy1 + 40 - vh, 14, vh); g.globalAlpha = 1; }
  // the line the trader drew
  g.fillStyle = BL; g.fillRect(10, fpy(RES) - 2.5, 810, 5); [120, 560].forEach(hx => { g.beginPath(); g.arc(hx, fpy(RES), 9, 0, 7); g.fillStyle = '#FFF'; g.fill(); g.lineWidth = 3; g.strokeStyle = BL; g.stroke(); });
  // speed trail on the price head
  const p0 = lastP(st(sAt(SFLAT, Math.max(0, t - 0.2)))), mv = lp - p0;
  if (Math.abs(mv) > 0.6) { const x = fxx(S.k, S) + 24, ya = fpy(p0), yb = fpy(lp), c2 = mv > 0 ? UP : DN, gr = g.createLinearGradient(0, ya, 0, yb); gr.addColorStop(0, VW.rgba(c2, 0)); gr.addColorStop(1, VW.rgba(c2, 0.95));
    g.fillStyle = gr; g.fillRect(x, Math.min(ya, yb), 9, Math.abs(yb - ya)); const d = mv > 0 ? -1 : 1; g.fillStyle = c2; g.beginPath(); g.moveTo(x - 12, yb - 12 * d); g.lineTo(x + 21, yb - 12 * d); g.lineTo(x + 4.5, yb + 12 * d); g.closePath(); g.fill(); }
  g.restore();
  for (let p = FLO; p <= FHI; p += 4) txt(g, money(p), 890, fpy(p), '600 23px VWSans', LTX, 'center');
  const tag = (p, bg) => { rr(g, 826, fpy(p) - 19, 128, 38, 5); g.fillStyle = bg; g.fill(); txt(g, money(p), 890, fpy(p) + 1, '700 23px VWSans', '#FFF', 'center'); };
  tag(RES, BL); tag(lp, col);
  txt(g, 'Illustrative replay. Simulated data.', 34, 176, '500 21px VWMono', '#9AA0AC');
  g.fillStyle = '#E0E3EB'; g.fillRect(0, FH - 62, FW, 2); txt(g, 'Select bar   ❚❚   ▶❚   1x', 34, FH - 30, '600 24px VWSans', LTX); txt(g, 'Jump to real-time', FW - 34, FH - 30, '600 23px VWSans', SUB, 'right');
}
function txt2(g, s, x, y, f, c) { txt(g, s, x, y, f, c); return g.measureText(s).width; }
function flatHead(S) { return new THREE.Vector3(fxx(S.k, S) - FW / 2, FH / 2 - fpy(lastP(S)), 0); }
const TITLES = [ [0, '', 'BREAKOUT', '?'], [T.top1, 'YOUR ', 'BREAKOUT', ' JUST FAILED.'], [T.fold - 0.1, 'WHAT WAS ', 'ABOVE', ' THE LINE?'] ];
function title(g, t, list, until) {
  let j = -1; list.forEach((o, q) => { if (t >= o[0]) j = q; }); if (j < 0 || t > until) return; const o = list[j], k = eo(lin(t, o[0], o[0] + 0.18)) * (1 - lin(t, until - 0.15, until));
  const pop = j ? 1 + 0.2 * Math.exp(-(t - o[0]) * 12) : 1; g.save(); g.globalAlpha = k; g.translate(540, 300); g.scale(pop, pop); g.font = '700 60px VWSans'; g.letterSpacing = '1px';
  const parts = o.slice(1), tw = parts.reduce((a, p) => a + g.measureText(p).width, 0); let x = -tw / 2; g.textBaseline = 'middle'; g.shadowColor = 'rgba(0,0,0,0.85)'; g.shadowBlur = 24;
  parts.forEach((p, q) => { g.fillStyle = q === 1 ? '#6E9BFF' : '#F2F5FA'; g.fillText(p, x, 0); x += g.measureText(p).width; }); g.restore(); }
function secFlat(g, t) {
  space(g, t, 0.13); const S = st(sAt(SFLAT, t)); drawFlat(flatTex.g, S, t); flatTex.tex.needsUpdate = true;
  const fold = eio(lin(t, T.fold + 0.2, T.bar)), push = eio(lin(t, 0, T.top1)) * (1 - eio(lin(t, T.top1 + 0.15, T.fold + 0.2))), hit = Math.exp(-Math.pow((t - T.top1) / 0.07, 2));
  flatM.position.set(0, -120, 0); flatM.rotation.set(mix(0.16, 0.05, eo(lin(t, 0, T.top1))) + fold * Math.PI / 2, mix(-0.3, -0.08, eo(lin(t, 0, T.top1))) * (1 - fold), 0); flatM.scale.set(mix(1, 1.5, fold), 1, 1); flatM.updateMatrixWorld();
  const hw = flatHead(S).applyMatrix4(flatM.matrixWorld), z = 0.3 * push + 0.12 * eo(lin(t, 0, 0.3)) * (1 - lin(t, T.top1, T.fold));
  const sh = hit * 14 * Math.sin(t * 90);
  setCam(CAM, mix(0, hw.x, z) + sh, mix(-60, hw.y - 260, z) + sh * 0.6, mix(D * 1.22, D * 0.7, z), mix(0, hw.x, z * 0.9), mix(-60, hw.y - 260, z * 0.9), 0, -0.03 * push);
  starsCam(t, 0.05); draw3D([[S_STARS, CAMS], [S_FLAT, CAM]]); blit(g, 1, 0.22);
  if (hit > 0.03) { g.fillStyle = `rgba(255,255,255,${0.22 * hit})`; g.fillRect(0, 0, W, H); }
  if (t > T.fold + 0.2) { const k = eio(lin(t, T.fold + 0.35, T.bar)), half = mix(300, 540, k); g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = lin(t, T.fold + 0.3, T.fold + 0.45);
    g.shadowColor = '#8AB6FF'; g.shadowBlur = 30; g.fillStyle = '#F2F6FF'; rr(g, 540 - half, 1000 - 4, half * 2, 8, 4); g.fill(); g.restore(); }
  title(g, t, TITLES, T.bar);
}

// ---------- the Volwick terminal, full page (bar 2: the whole layer row spread over the width, unused controls dimmed) ----------
const HDR = [];
function layoutHeader(g) {
  const F = '600 26px VWMono', L = '600 20px VWMono';
  const row = (y, label, chips) => { let x = 96; g.font = L; HDR.push({ kind: 'label', s: label, x, y }); x += g.measureText(label).width + 14; const x0 = x, items = [];
    chips.forEach(c => { g.font = F; const w = g.measureText(c.s).width + 26; items.push({ kind: 'chip', s: c.s, key: c.key, dim: c.dim, x, y, w }); x += w + 10; });
    const extra = (984 - 10 * (items.length - 1) - x0) - items.reduce((a, c) => a + c.w, 0), per = extra / items.length; let xx = x0; items.forEach(c => { c.x = xx; c.w += per; xx += c.w + 10; HDR.push(c); }); };
  HDR.push({ kind: 'wm', x: 96, y: 300 });
  row(362, 'DEALER', [{ s: 'WALLS Top 5', key: 'W' }, { s: 'METRIC GEX', dim: 1 }, { s: 'EXPIRY All', dim: 1 }, { s: 'MAPS None', dim: 1 }]);
  row(418, 'ACTIVITY', [{ s: 'BLOCK PRINTS', key: 'B' }, { s: 'CVD', dim: 1 }, { s: 'CDI', dim: 1 }, { s: 'FLOW', dim: 1 }]);
}
function chipPos(key) { const c = HDR.find(h => h.key === key); return [c.x + c.w / 2, c.y]; }
function drawTerminal(g, s, t) {
  ZF = 1 + 0.8 * (s.zoom || 0); ZX = 1 + 0.6 * (s.zoom || 0); PF = mix(7727.67, 7731.0, s.zoom || 0);
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, W, H); g.fillStyle = 'rgba(2,5,11,0.9)'; g.fillRect(0, 0, W, H);
  const S = s.S, lp = lastP(S);
  HDR.forEach(h => { g.save();
    if (h.kind === 'wm') { const wm = VW.assets.wm, hh = 44, ww = hh * wm.width / wm.height; g.globalCompositeOperation = 'lighter'; g.drawImage(wm, h.x, h.y - hh / 2, ww, hh); g.globalCompositeOperation = 'source-over';
      txt(g, `·  ES ${money(lp)}  ·`, h.x + ww + 18, h.y + 1, '600 28px VWMono', '#97A3B3'); rr(g, 984 - 64, h.y - 22, 64, 44, 10); g.fillStyle = 'rgba(255,255,255,0.05)'; g.fill(); txt(g, '1m', 984 - 32, h.y + 1, '700 26px VWMono', '#ECEFF4', 'center'); }
    else if (h.kind === 'label') txt(g, h.s, h.x, h.y, '600 20px VWMono', '#5E6B80');
    else { const k = h.key ? (s.on[h.key] || 0) : 0, pu = h.key ? (s.pulse[h.key] || 0) : 0, gd = h.key === 'B'; if (h.dim) g.globalAlpha = 0.45;
      rr(g, h.x, h.y - 22, h.w, 44, 10); g.fillStyle = gd ? `rgba(242,193,78,${0.08 + 0.28 * k})` : `rgba(47,107,255,${0.05 + 0.3 * k})`; g.fill();
      if (k > 0) { g.shadowColor = gd ? 'rgba(242,193,78,0.9)' : 'rgba(90,140,255,0.9)'; g.shadowBlur = 10 + 30 * pu; }
      g.strokeStyle = gd ? `rgba(242,193,78,${0.55 + 0.45 * k})` : `rgba(${mix(150, 120, k)},${mix(170, 165, k)},${mix(210, 255, k)},${0.22 + 0.7 * k})`; g.lineWidth = 1.5 + 1.5 * pu; g.stroke(); g.shadowBlur = 0;
      txt(g, h.s, h.x + 13, h.y + 1, '600 26px VWMono', gd ? (k > 0.5 ? '#FFE7A6' : '#F2C14E') : (k > 0.5 ? '#ECEFF4' : '#97A3B3'));
      if (pu > 0.02) { g.globalAlpha = pu; rr(g, h.x - 10 * (1 - pu) - 4, h.y - 26 - 10 * (1 - pu), h.w + 8 + 20 * (1 - pu), 52 + 20 * (1 - pu), 14); g.strokeStyle = gd ? '#F2C14E' : '#8AB6FF'; g.lineWidth = 2; g.stroke(); } }
    g.restore(); });
  g.fillStyle = 'rgba(140,170,230,0.18)'; g.fillRect(0, 456, W, 1.5);
  for (let x = 18; x < W; x += 36) { g.fillStyle = 'rgba(120,150,200,0.07)'; g.fillRect(x, 459, 1, 1080); }
  g.save(); g.beginPath(); g.rect(0, 459, W, 1100); g.clip();
  for (let p = 7700; p <= 7750; p += 2) { g.fillStyle = 'rgba(120,150,200,0.05)'; g.fillRect(0, PY(p), W, 1); }
  // walls
  WALLS.forEach((w, j) => { const k = s.walls[j] || 0; if (k <= 0) return; const y = PY(w.p), c = FAMC[w.fam], x0 = W - W * eo(k), big = w.star ? 1 + 1.6 * (s.hitK || 0) : 1;
    g.save(); const lg = g.createLinearGradient(0, 0, W, 0); lg.addColorStop(0, VW.rgba(c, 0.05)); lg.addColorStop(0.6, VW.rgba(c, 0.45)); lg.addColorStop(1, VW.rgba(c, 0.95));
    g.strokeStyle = lg; g.lineWidth = (w.star ? 4 : 2.5) * big; g.shadowColor = VW.rgba(c, 0.9); g.shadowBlur = (w.star ? 22 : 12) * big; g.beginPath(); g.moveTo(x0, y); g.lineTo(W, y); g.stroke(); g.restore();
    const kl = eo(lin(k, 0.55, 1)); if (kl > 0) { g.save(); g.globalAlpha = kl; const lab = `${w.star ? '★ ' : ''}${money(w.p)} · ${w.net}`; g.font = '700 26px VWMono'; const tw = g.measureText(lab).width;
      rr(g, 960 - tw - 30, y - 36, tw + 40, 34, 7); g.fillStyle = 'rgba(2,5,11,0.85)'; g.fill(); g.fillStyle = c; g.beginPath(); g.arc(960 - tw - 16, y - 19, 5, 0, 7); g.fill(); txt(g, lab, 968, y - 18, '700 26px VWMono', c, 'right'); g.restore(); } });
  // the trader's line
  { const y = PY(RES), k = s.line || 0; if (k > 0) { g.save(); g.globalAlpha = k; g.setLineDash([12, 9]); g.strokeStyle = 'rgba(127,162,255,0.9)'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); g.setLineDash([]);
    rr(g, 360, y + 8, 150, 30, 5); g.fillStyle = 'rgba(41,98,255,0.9)'; g.fill(); txt(g, 'YOUR LEVEL', 435, y + 24, '700 19px VWMono', '#FFFFFF', 'center'); g.restore(); } }
  // candles, volume
  for (let i = 0; i <= S.k; i++) { const b = barAt(i, S); if (!b) continue; const x = BX(i), c = b.c >= b.o ? '#2FB67C' : '#E2575F'; g.fillStyle = c; g.fillRect(x - 0.8, PY(b.h), 2, PY(b.l) - PY(b.h));
    const y0 = PY(Math.max(b.o, b.c)), hh = Math.max(2, PY(Math.min(b.o, b.c)) - y0); g.fillRect(x - 3, y0, 6.5, hh); g.globalAlpha = 0.5; const vh = Math.min(60, b.v / 3600 * 60); g.fillRect(x - 3, 1525 - vh, 6.5, vh); g.globalAlpha = 1; }
  // speed trail on the price head
  { const p0 = s.p0, mv = lp - p0; if (Math.abs(mv) > 0.6) { const x = BX(S.k) + 16, ya = PY(p0), yb = PY(lp), c2 = mv > 0 ? '#2FB67C' : '#E2575F', gr = g.createLinearGradient(0, ya, 0, yb); gr.addColorStop(0, VW.rgba(c2, 0)); gr.addColorStop(1, VW.rgba(c2, 0.95));
    g.fillStyle = gr; g.fillRect(x, Math.min(ya, yb), 7, Math.abs(yb - ya)); const d = mv > 0 ? -1 : 1; g.fillStyle = c2; g.beginPath(); g.moveTo(x - 10, yb - 10 * d); g.lineTo(x + 17, yb - 10 * d); g.lineTo(x + 3.5, yb + 10 * d); g.closePath(); g.fill(); } }
  // price tag
  { const y = PY(lp); rr(g, 984, y - 17, 92, 34, 5); g.fillStyle = '#E9EDF3'; g.fill(); txt(g, money(lp), 1030, y + 1, '700 19px VWMono', '#0B1220', 'center'); }
  // block prints
  PRINTS.forEach(pr => { const k = (pr.i <= S.k - (pr.i === S.k ? 0 : 0) ? 1 : 0) * (s.prints || 0); if (k <= 0 || pr.i > S.k) return; const x = BX(pr.i), y = PY(pr.p), pop = 1 + 0.6 * (1 - eo(clamp(s.prints, 0, 1)));
    g.save(); g.globalAlpha = k; g.fillStyle = '#F4F6FA'; g.shadowColor = 'rgba(255,255,255,0.6)'; g.shadowBlur = 8; g.fillRect(x - 22 * pop, y - 2.5, 44 * pop, 5); g.shadowBlur = 0;
    diamond(g, x, y, 6 * pop, pr.gold ? '#F2C14E' : '#F4F6FA'); badge(g, x + 16, y - 26, pr.q, pr.gold); g.restore(); });
  // selection box on the touch
  if (s.box > 0) { const x0 = BX(51), x1 = BX(61), y0 = PY(7736), y1 = PY(7728.5), per = 2 * (x1 - x0 + y1 - y0); let left = per * eo(s.box);
    g.save(); g.globalAlpha = s.boxK ?? 1; g.setLineDash([9, 7]); g.strokeStyle = 'rgba(255,214,102,0.95)'; g.lineWidth = 2.5; g.shadowColor = 'rgba(255,200,80,0.6)'; g.shadowBlur = 10;
    g.beginPath(); const pts = [[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]]; g.moveTo(x0, y0);
    for (let k = 1; k < pts.length && left > 0; k++) { const [ax, ay] = pts[k - 1], [bx, by] = pts[k], d = Math.hypot(bx - ax, by - ay), f = Math.min(1, left / d); g.lineTo(ax + (bx - ax) * f, ay + (by - ay) * f); left -= d; }
    g.stroke(); g.restore(); }
  // wall tooltip
  if (s.tip > 0) { const k = eo(s.tip), x1 = 960, y = PY(7733.5) - 64, Lt = ['→ ES 7,733.50 · GEX', 'Call wall · long γ', 'Net +$12.6M'];
    g.save(); g.globalAlpha = k; g.translate(0, (1 - k) * 12); rr(g, x1 - 470, y - 150, 470, 138, 12); g.fillStyle = 'rgba(10,16,30,0.96)'; g.fill(); g.strokeStyle = 'rgba(57,168,111,0.8)'; g.lineWidth = 2; g.stroke();
    txt(g, Lt[0], x1 - 446, y - 118, '600 23px VWMono', '#97A3B3'); txt(g, Lt[1], x1 - 446, y - 81, '700 26px VWMono', '#39A86F'); txt(g, Lt[2], x1 - 446, y - 43, '700 30px VWMono', '#ECEFF4'); g.restore(); }
  g.restore();
  txt(g, 'Simulated ES session. Dealer Walls: modeled options-derived positioning.', 540, 1545, '500 19px VWMono', '#7F8AA0', 'center');
}
function termState(t) {
  const act = a => eo(lin(t, a + 0.45, a + 0.57)), pul = a => Math.exp(-Math.pow((t - a - 0.57) / 0.12, 2)), S = st(sAt(STERM, t));
  return { S, p0: lastP(st(sAt(STERM, Math.max(T.term, t - 0.18)))), on: { W: act(T.aW), B: act(T.aB) }, pulse: { W: pul(T.aW), B: pul(T.aB) },
    walls: WALLS.map((w, j) => lin(t, T.aW + 0.57 + j * BT / 8, T.aW + 0.57 + j * BT / 8 + 0.3)), line: lin(t, T.term, T.term + 0.3), prints: eo(lin(t, T.aB + 0.55, T.aB + 0.7)),
    box: lin(t, T.hit + 0.1, T.hit + 0.5), boxK: 1 - lin(t, T.wide - 0.2, T.wide), tip: lin(t, T.tip, T.tip + 0.18) * (1 - lin(t, T.wide - 0.15, T.wide)), hitK: Math.exp(-Math.max(0, t - T.hit) * 4) * (t >= T.hit ? 1 : 0), zoom: eio(lin(t, T.push, T.hit)) * (1 - eio(lin(t, T.tip + 0.25, T.wide))) };
}
const ACT = [ { t: T.aW, s: 'DEALER WALLS', key: 'W', c: '#39A86F', grp: 'DEALER' }, { t: T.aB, s: 'BLOCK PRINTS', key: 'B', c: '#F2C14E', grp: 'ACTIVITY' } ];
function secTerm(g, t) {
  space(g, t, 0.08); drawTerminal(termTex.g, termState(t), t); termTex.tex.needsUpdate = true;
  const enter = eo(lin(t, T.term, T.term + 0.35)), push = eio(lin(t, T.push, T.hit)) * (1 - eio(lin(t, T.tip + 0.2, T.wide))), out = eio(lin(t, T.wide, T.rise)), hit = Math.exp(-Math.pow((t - T.hit) / 0.07, 2));
  const s = mix(1.12, 1, enter) * mix(1, 0.7, out), sh = hit * 16 * Math.sin(t * 95);
  term.scale.set(s, s, 1); term.position.set(sh, sh * 0.5, -300 * out);
  term.rotation.set(0.05 * Math.sin(t * 1.1) * (1 - push) + 0.25 * out, -0.04 * Math.cos(t * 0.9) * (1 - push) - 0.4 * out, 0.04 * out);
  setCam(CAM, 0, 0, D, 0, 0, 0); starsCam(t); draw3D([[S_STARS, CAMS], [S_TERM, CAM]]); blit(g, 1, 0.35);
  if (t < T.term + 0.12) { g.fillStyle = `rgba(220,230,255,${0.16 * (1 - lin(t, T.term, T.term + 0.12))})`; g.fillRect(0, 0, W, H); }
  if (hit > 0.03) { g.fillStyle = `rgba(200,255,225,${0.2 * hit})`; g.fillRect(0, 0, W, H); }
  // the layer name flies into its chip, then the chip switches on
  ACT.forEach(A => { const a = lin(t, A.t + 0.02, A.t + 0.18), f = eio(lin(t, A.t + 0.28, A.t + 0.55)); if (a <= 0 || f >= 1) return;
    const [cx, cyy] = chipPos(A.key), c3 = proj(new THREE.Vector3(cx - 540, 960 - cyy, 0).applyMatrix4(term.matrixWorld)), x = mix(540, c3[0], f), y = mix(1000, c3[1], f), sc = mix(1, 0.24, f) * mix(1.25, 1, eo(a));
    g.save(); g.globalAlpha = eo(a) * (1 - lin(f, 0.75, 1)); g.translate(x, y); g.scale(sc, sc);
    const bgk = g.createRadialGradient(0, 0, 10, 0, 0, 520); bgk.addColorStop(0, `rgba(2,5,11,${0.75 * (1 - f)})`); bgk.addColorStop(1, 'rgba(2,5,11,0)'); g.fillStyle = bgk; g.fillRect(-560, -260, 1120, 520);
    g.shadowColor = A.c; g.shadowBlur = 40; txt(g, A.s, 0, 0, '700 112px VWSans', A.key === 'B' ? '#F7D27A' : '#FFFFFF', 'center'); g.shadowBlur = 0; g.fillStyle = A.c; g.fillRect(-120, 78, 240, 8);
    txt(g, A.grp, 0, -100, '600 34px VWMono', '#97A3B3', 'center'); g.restore(); });
  // on the touch: BLOCKED.
  const bk = lin(t, T.hit, T.hit + 0.12) * (1 - lin(t, T.hit + 0.5, T.hit + 0.68)); if (bk > 0) { const sc = 1 + 0.25 * Math.exp(-(t - T.hit) * 10);
    g.save(); g.globalAlpha = bk; g.translate(540, 760); g.scale(sc, sc); const bgk = g.createRadialGradient(0, 0, 10, 0, 0, 480); bgk.addColorStop(0, 'rgba(2,5,11,0.7)'); bgk.addColorStop(1, 'rgba(2,5,11,0)'); g.fillStyle = bgk; g.fillRect(-520, -240, 1040, 480);
    g.shadowColor = '#39A86F'; g.shadowBlur = 44; txt(g, 'BLOCKED.', 0, 0, '700 128px VWSans', '#FFFFFF', 'center'); g.shadowBlur = 0; txt(g, 'CALL WALL · LONG γ · +$12.6M', 0, 104, '700 36px VWMono', '#5BE39A', 'center'); g.restore(); }
  const bl = lin(t, T.rise - 0.12, T.rise); if (bl > 0) { g.save(); g.globalAlpha = bl; g.fillStyle = 'rgba(8,20,60,0.85)'; g.fillRect(0, 0, W, H); g.restore(); }
}
// ---------- the long layer bar (as on the PC terminal: one row) ----------
const BW = 2900, BH = 150; let BARP = [];
function layoutBar(g) { let x = 50; const add = (kind, s, f, gap = 22) => { g.font = f; const w = kind === 'wm' ? 200 : g.measureText(s).width + (kind === 'chip' ? 34 : 0); BARP.push({ kind, s, x, w, f }); x += w + gap; };
  add('wm', '', '', 22); add('t', '·  ES  ·  1m', '600 40px VWMono', 40); add('sep', '', '', 40);
  add('lab', 'DEALER', '600 30px VWMono'); ['WALLS Top 5', 'METRIC GEX', 'EXPIRY All', 'MAPS None'].forEach(s => add('chip', s, '600 38px VWMono', 16)); x += 24; add('sep', '', '', 40);
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
    else { const gd = p.s === 'BLOCK PRINTS'; rr(g, p.x, y - 32, p.w, 64, 14); g.fillStyle = gd ? 'rgba(242,193,78,0.14)' : 'rgba(255,255,255,0.05)'; g.fill(); g.strokeStyle = gd ? 'rgba(242,193,78,0.95)' : 'rgba(150,180,240,0.55)'; g.lineWidth = 2; g.stroke(); txt(g, p.s, p.x + 17, y + 2, p.f, gd ? '#F2C14E' : '#C9D3E3'); }
    g.restore(); });
}

let R, CAM, CAMS, S_STARS, stars, S_LOGO, mono, wm, wmRef, S_BAR, barM, barTex, S_TERM, term, termTex, S_FLAT, flatM, flatTex, S_RISE, candleMesh, wallMesh, wallGlow, lineMesh, gl;
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
  S_TERM = new THREE.Scene(); termTex = mkTex(W, H); layoutHeader(termTex.g);
  term = new THREE.Mesh(new THREE.PlaneGeometry(W, H), new THREE.MeshBasicMaterial({ map: termTex.tex, transparent: true })); S_TERM.add(term);
  S_FLAT = new THREE.Scene(); flatTex = mkTex(FW, FH); flatM = new THREE.Mesh(new THREE.PlaneGeometry(FW, FH), new THREE.MeshBasicMaterial({ map: flatTex.tex, transparent: true, side: THREE.DoubleSide })); S_FLAT.add(flatM);
  S_RISE = new THREE.Scene(); S_RISE.fog = new THREE.Fog(0x040914, 2600, 7000);
  const box = new THREE.BoxGeometry(1, 1, 1); candleMesh = new THREE.InstancedMesh(box, new THREE.MeshBasicMaterial({ vertexColors: false }), TN * 2); candleMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  for (let i = 0; i < TN * 2; i++) candleMesh.setColorAt(i, new THREE.Color(0x2FB67C)); S_RISE.add(candleMesh);
  wallMesh = new THREE.Mesh(new THREE.BoxGeometry(4200, 7, 7), new THREE.MeshBasicMaterial({ color: 0x5be39a })); S_RISE.add(wallMesh);
  wallGlow = new THREE.Mesh(new THREE.PlaneGeometry(4200, 160), new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { k: { value: 1 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: 'uniform float k; varying vec2 vUv; void main(){ float d=abs(vUv.y-0.5)*2.0; float a=exp(-d*d*9.0)*0.55*k; gl_FragColor=vec4(vec3(0.22,0.66,0.44)*a, a); }' })); S_RISE.add(wallGlow);
  const grid = new THREE.GridHelper(6000, 60, 0x1d3a7a, 0x10224a); grid.position.y = -700; S_RISE.add(grid);
  lineMesh = new THREE.Mesh(new THREE.BoxGeometry(4200, 3, 3), new THREE.MeshBasicMaterial({ color: 0x7FA2FF })); S_RISE.add(lineMesh);
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
  if (opt.pen) { CONT.forEach((cn, ci) => { const n = cn.length, mm = clamp((m - ci * 0.18) / (1 - ci * 0.18), 0, 1), upto = Math.floor(mm * (n - 1));
      if (upto < 1) return;
      [[-22, 'rgba(90,140,255,', 2, 0.55], [0, 'rgba(240,245,255,', 2.6, 1], [22, 'rgba(90,140,255,', 2, 0.55]].forEach(([z, c, lw, al]) => {
        const pts = []; for (let i = 0; i <= upto; i++) { const [u, v] = cn[i]; pts.push(proj(new THREE.Vector3(cx + (u - 0.5) * s, cy - (v - 0.5) * s, z), cam)); }
        g.strokeStyle = c + (al * fade) + ')'; g.lineWidth = lw; g.shadowColor = '#5A8CFF'; g.shadowBlur = 16; g.beginPath(); pts.forEach((q, i) => g[i ? 'lineTo' : 'moveTo'](q[0], q[1])); g.stroke(); });
      if (mm < 1) { const [u, v] = cn[upto], h = proj(new THREE.Vector3(cx + (u - 0.5) * s, cy - (v - 0.5) * s, 0), cam), gr = g.createRadialGradient(h[0], h[1], 0, h[0], h[1], 40);
        gr.addColorStop(0, `rgba(255,255,255,${fade})`); gr.addColorStop(0.3, `rgba(140,180,255,${0.6 * fade})`); gr.addColorStop(1, 'rgba(47,107,255,0)'); g.fillStyle = gr; g.fillRect(h[0] - 40, h[1] - 40, 80, 80); } });
    g.restore(); return; }
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

function secBar(g, t) {   // the line runs lengthwise and draws the layer bar in 3D (from V0010)
  space(g, t, 0.12); const u = eio(lin(t, T.bar, T.barEnd - 0.12)), sw = eio(lin(t, T.barEnd - 0.16, T.barEnd));
  drawBar(barTex.g, Math.max(0.0001, u)); barTex.tex.needsUpdate = true;
  barM.position.set(0, mix(0, 820, sw), mix(0, -600, sw)); barM.rotation.set(mix(0.12, 0, sw), mix(-0.95, 0, sw), mix(0.05, 0, sw)); barM.scale.setScalar(mix(1, 0.36, sw));
  const head = new THREE.Vector3(-BW / 2 + u * BW, 0, 0).applyMatrix4((barM.updateMatrixWorld(), barM.matrixWorld));
  const cz = mix(D * 0.92, D, sw); setCam(CAM, mix(head.x * 0.35, 0, sw), 80, cz + mix(head.z * 0.3, 0, sw), mix(head.x * 0.55, 0, sw), mix(0, 300, sw), mix(head.z * 0.6, 0, sw));
  starsCam(t, 0.1); draw3D([[S_STARS, CAMS], [S_BAR, CAM]]); blit(g, 1, 0.6);
  if (u < 1) { const [hx, hy] = proj(head); g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createRadialGradient(hx, hy, 0, hx, hy, 90); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.2, 'rgba(140,180,255,0.7)'); gr.addColorStop(1, 'rgba(47,107,255,0)'); g.fillStyle = gr; g.fillRect(hx - 90, hy - 90, 180, 180); g.restore(); }
  title(g, t + 0.0, [[T.bar, 'WHAT WAS ', 'ABOVE', ' THE LINE?']], T.barEnd);
}

// ---------- 3D: the same move as candles in space, into the glowing call wall and back ----------
const RX = i => (i - 30) * 52, RY = p => (p - 7728) * 62, TN = 50;
let TB = [];
function genTrade() { const A = [[0, 7726.5], [8, 7727.5], [16, 7725.5], [24, 7726.75], [32, 7725.75], [38, 7726.5], [40, 7727.75], [42, 7729.75], [43, 7731.25], [44, 7732.75], [45, 7731.0], [46, 7728.0], [47, 7726.25], [49, 7726.75]];
  const r = VW.rng(606), q = x => Math.round(x * 4) / 4; let prev = 7726.25;
  for (let i = 0; i < TN; i++) { let k = 0; while (A[k + 1][0] < i) k++; const [i0, p0] = A[k], [i1, p1] = A[k + 1];
    const c = q(mix(p0, p1, (i - i0) / (i1 - i0)) + (i > 38 && i < 47 ? 0 : (r() - 0.5) * 1.0)), o = prev; TB.push({ o, c, h: q(Math.max(o, c) + r() * 0.7), l: q(Math.min(o, c) - r() * 0.7) }); prev = c; }
  TB.forEach(b => { b.h = Math.min(b.h, 7733.25); }); TB[44].h = 7733.25; TB[45].h = 7733.0; }
const curBar = t => t < T.hit2 ? mix(12, 44.6, eio(lin(t, T.rise, T.hit2))) : mix(44.6, 48.5, eo(lin(t, T.hit2, T.end - 0.1)));
function tradeCam(t) { const k = eio(lin(t, T.rise, T.end)), cb = curBar(t);
  setCam(CAM, RX(cb) - mix(900, 520, k), RY(7729) + mix(-80, 140, k), mix(2000, 1700, k), RX(cb) + 200, RY(7731.5), -500, mix(0.06, -0.03, k)); }
function secRise(g, t) {
  space(g, t, 0.16); const cb = curBar(t), nb = cb + 1, M = new THREE.Matrix4(), C = new THREE.Color();
  for (let i = 0; i < TN; i++) { const b = TB[i], g0 = clamp(nb - i, 0, 1), up = b.c >= b.o; C.set(up ? 0x2FB67C : 0xE2575F);
    const top = RY(Math.max(b.o, b.c)), bot = RY(Math.min(b.o, b.c)), hb = Math.max(6, top - bot) * g0;
    M.makeScale(28, hb, 28); M.setPosition(RX(i), bot + hb / 2, 0); candleMesh.setMatrixAt(i * 2, M); candleMesh.setColorAt(i * 2, C);
    const hw = (RY(b.h) - RY(b.l)) * g0; M.makeScale(6, Math.max(1, hw), 6); M.setPosition(RX(i), RY(b.l) + hw / 2, 0); candleMesh.setMatrixAt(i * 2 + 1, M); candleMesh.setColorAt(i * 2 + 1, C); }
  candleMesh.instanceMatrix.needsUpdate = true; candleMesh.instanceColor.needsUpdate = true;
  const hit = Math.exp(-Math.pow((t - T.hit2) / 0.08, 2));
  wallMesh.position.set(0, RY(7733.5), 0); wallGlow.position.copy(wallMesh.position); wallGlow.material.uniforms.k.value = 0.7 + 2.8 * hit; wallMesh.scale.set(1, 1 + 2.5 * hit, 1 + 2.5 * hit);
  lineMesh.position.set(0, RY(RES), 0);
  tradeCam(t); CAM.position.x += hit * 12 * Math.sin(t * 90); CAM.updateMatrixWorld(); starsCam(t, -0.1); draw3D([[S_STARS, CAMS], [S_RISE, CAM]]); blit(g, 1, 0.65);
  const P = (i, p) => proj(new THREE.Vector3(RX(i), RY(p), 0)), pill = (x, y, s, col, bg, al = 'left', f = '700 27px VWMono') => { g.font = f; const w = g.measureText(s).width + 28, x0 = al === 'right' ? x - w : x; rr(g, x0, y - 22, w, 44, 10); g.fillStyle = bg; g.fill(); g.strokeStyle = col; g.lineWidth = 2; g.stroke(); txt(g, s, x0 + 14, y + 1, f, col); };
  const lw = P(cb + 8, 7733.5), ll = P(Math.max(2, cb - 12), RES); g.save(); g.globalAlpha = eo(lin(t, T.rise + 0.1, T.rise + 0.4));
  pill(Math.min(960, lw[0]), lw[1] - 34, '★ 7,733.50 · CALL WALL · +$12.6M', '#5BE39A', 'rgba(4,14,10,0.85)', 'right'); pill(Math.max(96, ll[0]), ll[1] + 36, 'YOUR LEVEL · 7,731.50', '#8AB6FF', 'rgba(6,12,30,0.85)'); g.restore();
  // big price, it climbs into the wall and stops one tick under it
  const ci = Math.min(TN - 1, Math.floor(cb)), b = TB[ci], fr = cb - Math.floor(cb), px = Math.round(mix(b.o, b.c, clamp(fr * 1.2, 0, 1)) * 4) / 4, pk = t >= T.hit2 ? 1 : 0;
  const capped = Math.min(t < T.hit2 ? px : px, 7733.25), down = t > T.hit2 + 0.1;
  g.save(); g.translate(540, 470); g.transform(1, -0.05, 0, 1, 0, 0); const s = money(capped), col = down ? '#FF7A80' : '#F2F6FF', sc = 1 + 0.1 * hit;
  g.scale(sc, sc); for (let d = 12; d > 0; d--) txt(g, s, d * 1.2, d * 1.8, '700 150px VWSans', `rgba(${down ? '90,20,26' : '30,50,110'},${0.9 - d * 0.05})`, 'center');
  g.shadowColor = down ? 'rgba(230,80,90,0.8)' : 'rgba(120,160,255,0.8)'; g.shadowBlur = 30 + 50 * hit; txt(g, s, 0, 0, '700 150px VWSans', col, 'center'); g.restore();
  txt(g, 'ES · 1m', 540, 340, '700 32px VWMono', '#8AB6FF', 'center');
  const lk = eo(lin(t, T.hit2, T.hit2 + 0.15)); if (lk > 0) { g.save(); g.globalAlpha = lk; txt(g, 'ONE TICK UNDER THE CALL WALL', 540, 590, '700 32px VWMono', '#5BE39A', 'center'); g.restore(); }
  if (hit > 0.05) { g.fillStyle = `rgba(200,255,225,${0.18 * hit})`; g.fillRect(0, 0, W, H); }
  txt(g, 'Simulated ES session. Dealer Walls: modeled options-derived positioning.', 540, 1540, '500 19px VWMono', '#7F8AA0', 'center');
}
function riseLine() { tradeCam(T.end); const out = []; for (let k = 0; k < 60; k++) { const i = Math.round(k * 48 / 59); out.push(proj(new THREE.Vector3(RX(i), RY(TB[i].c), 0))); } return out; }
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
  if (t < T.bar) secFlat(g, t); else if (t < T.term) secBar(g, t); else if (t < T.rise) secTerm(g, t); else if (t < T.end) secRise(g, t); else secEnd(g, t);
  const fl = VW.punch([T.term, T.rise, T.end], t, 0.04); if (fl > 0.02) { g.fillStyle = `rgba(210,225,255,${0.1 * fl})`; g.fillRect(0, 0, W, H); }
  VW.vignette();
}
window.READY = (async () => {
  await VW.loadFonts(); await VW.loadBrand(); BARS = (await (await fetch('data.json')).json()).bars; N = BARS.length; CONT = await (await fetch('mono_contours.json')).json();
  genTrade(); build3D(); LINE = riseLine(); window.render = render; render(0);
  // where the price head sits on the first frame (for the hook's match cut)
  const S0 = st(sAt(SFLAT, 0)); render(0); const hp = proj(flatHead(S0).applyMatrix4(flatM.matrixWorld));
  return { total: T.total, events: { ...T, hook: [Math.round(hp[0]), Math.round(hp[1])], clicks: [], rew: T.fold, walls: T.term, top2: T.hit } };
})();
