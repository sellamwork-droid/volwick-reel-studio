// VX · ONE RULE (CREATIVE 03, 30 Oct 2026). Minimal white micro lesson: one rule, one chart, ten seconds.
// "If price pushes into a green wall, dealers sell the rally to stay hedged. That's why it often stalls."
// The chart is the Volwick terminal as it really looks (layer row, wall glow with dot and label, hover tooltip),
// set on a white page. Simulated ES session, declared on screen. Every frame is a pure function of time.
const { seg, lin, eo, eio, mix, clamp } = VW;
const TOTAL = 13.6, T_END = 9.6;
// ---------- geometry ----------
// the terminal is drawn at desktop size on an offscreen screen (1600 x 1000), then shown on a monitor
const WIN = { x0: 0, x1: 1600, y0: 0, y1: 1000 };
const HDR1 = 0, HDR = 96, CX0 = 0, CX1 = 1490, YB = 930;
const MON = { x0: 96, x1: 940, y0: 770 }, SCR = { x: 110, y: 784, w: 816, h: 510 };
const PTOP = 7768.5, PBOT = 7735.25, PX = (YB - HDR - 16) / (PTOP - PBOT);
const Y = p => HDR + 8 + (PTOP - p) * PX;
const SP = 16, BD = 0.5, K0 = 45;   // bar spacing, first bar x, seconds per live bar, first live bar
const X = i => 1060 - (K0 - i) * SP;
const PREV_CLOSE = 7731.25;
const WALLS = [ { p: 7766.5, fam: 'callS', usd: '−$9.6M' }, { p: 7758.5, fam: 'callL', usd: '+$24.5M' }, { p: 7738.5, fam: 'putL', usd: '+$11.3M' } ];
const GW = WALLS[1];
// ---------- the rule, word by word (on screen text = the rule, exactly) ----------
const S1 = [['If', 0.0], ['price', 0.0], ['pushes', 0.2], ['into', 0.4], ['a', 0.52], ['green', 0.64], ['wall,', 0.86],
  ['dealers', 1.62], ['sell', 1.92], ['the', 2.14], ['rally', 2.28], ['to', 2.6], ['stay', 2.74], ['hedged.', 2.98]];
const S2 = [['That’s', 4.5], ['why', 4.72], ['it', 4.9], ['often', 5.04], ['stalls.', 5.42]];
const KEYS = { green: '#12A06A', 'wall,': '#12A06A', sell: '#E5484D', rally: '#E5484D', 'stalls.': '#2F6BFF' };
// ---------- interactions ----------
const E = { tip: 1.3, zout0: 7.7, zout1: 8.5, walls: 8.6, tipOut: 4.15, stall: 5.55, end: T_END };
// ---------- simulated session ----------
let BARS = [];
function buildBars() {
  const r = VW.rng(303), q = v => Math.round(v * 4) / 4, out = [];
  const anchors = [[0, 7738.75], [7, 7741.75], [12, 7740.25], [20, 7745.5], [24, 7743.75], [32, 7749.5], [37, 7748.25], [44, 7754.0]];
  const at = i => { for (let k = 0; k < anchors.length - 1; k++) { const [a, pa] = anchors[k], [b, pb] = anchors[k + 1]; if (i >= a && i <= b) { const u = (i - a) / (b - a); return pa + (pb - pa) * (0.5 - 0.5 * Math.cos(Math.PI * u)); } } return anchors[anchors.length - 1][1]; };
  let prev = 7738.75;
  for (let i = 0; i < K0; i++) { const o = prev, c = q(at(i) + (r() - 0.5) * 1.2); const h = Math.max(o, c) + q(r() * 0.9) + 0.25, l = Math.min(o, c) - q(r() * 0.9) - 0.25;
    out.push({ o, h: Math.min(h, 7757.25), l, c, v: 700 + Math.round(r() * 1500) }); prev = c; }
  out[K0 - 1].c = 7754.0;
  // live bars: the push, the touch, the sell, the stall (highs at the wall, closes below it)
  const L = [[7756.5, 7753.75, 7756.25], [7758.0, 7755.75, 7757.75], [7758.5, 7756.0, 7756.5], [7757.0, 7754.25, 7754.5], [7755.25, 7752.75, 7753.25],
    [7754.5, 7752.5, 7754.25], [7756.75, 7754.0, 7756.5], [7758.75, 7756.0, 7756.25], [7756.5, 7753.5, 7753.75], [7754.75, 7752.75, 7754.5],
    [7755.75, 7753.75, 7755.25], [7757.0, 7754.5, 7756.75], [7758.5, 7756.25, 7756.5], [7757.0, 7754.75, 7755.0], [7756.0, 7754.25, 7755.5],
    [7757.25, 7755.0, 7756.75], [7758.25, 7756.0, 7756.25], [7757.0, 7754.75, 7755.25], [7756.25, 7754.5, 7755.75], [7756.75, 7755.0, 7756.25]];
  L.forEach(([h, l, c], j) => { const o = out[out.length - 1].c, hi = Math.max(h, o, c), lo = Math.min(l, o, c);
    const touch = hi >= GW.p - 0.01; out.push({ o, h: hi, l: lo, c, v: (touch ? 2600 : 1100) + Math.round(r() * 900) }); });
  // tick path inside each bar: open, first extreme, second extreme, close
  out.forEach(b => { const up = b.c >= b.o, a = up ? b.l : b.h, z = up ? b.h : b.l; b.path = [b.o, a, z, b.c]; b.u = [0, 0.28, 0.68, 1]; });
  BARS = out;
}
function priceIn(b, f) { // price along the tick path, snapped to the 0.25 tick
  for (let s = 0; s < 3; s++) if (f <= b.u[s + 1]) { const k = (f - b.u[s]) / (b.u[s + 1] - b.u[s]); return Math.round(mix(b.path[s], b.path[s + 1], k) * 4) / 4; }
  return b.c;
}
function state(t) { const r = Math.max(0, Math.min(t, T_END) / BD), k = K0 + Math.floor(r); return { k: Math.min(k, BARS.length - 1), f: k >= BARS.length ? 1 : r - Math.floor(r) }; }
function barAt(i, S) { const b = BARS[i]; if (i < S.k) return b; if (i > S.k) return null;
  const f = S.f; let h = b.o, l = b.o; const n = 24; for (let j = 0; j <= n; j++) { const p = priceIn(b, f * j / n); h = Math.max(h, p); l = Math.min(l, p); }
  const c = priceIn(b, f); return { o: b.o, h, l, c, v: Math.round(b.v * Math.max(0.08, f)) }; }
function lastPrice(S) { const b = barAt(S.k, S); return b ? b.c : BARS[K0 - 1].c; }
// time of each touch of the wall (for sound and the cursor)
function touchTimes() { const ts = []; for (let i = K0; i < BARS.length; i++) { const b = BARS[i]; if (b.h >= GW.p - 0.01) { const t0 = (i - K0) * BD; for (let j = 0; j <= 200; j++) if (priceIn(b, j / 200) >= GW.p - 0.01) { ts.push(+(t0 + j / 200 * BD).toFixed(3)); break; } } } return ts.filter(x => x < T_END); }
const fmt = (p, d = 2) => p.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const tlabel = i => { const m = 10 * 60 + 41 + i; return Math.floor(m / 60) + ':' + String(m % 60).padStart(2, '0'); };

// ---------- humanized cursor (same model as CREATIVE 01) ----------
let KF = [];
function cursorAt(t) {
  if (t <= KF[0][0]) return { x: KF[0][1], y: KF[0][2] };
  for (let q = 0; q < KF.length - 1; q++) { const [t0, x0, y0] = KF[q], [t1, x1, y1, curv = 0.12] = KF[q + 1];
    if (t <= t1) { const u = (t - t0) / (t1 - t0), e = 1 - Math.pow(1 - u, 3); const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, bow = Math.sin(Math.PI * e) * L * curv;
      const over = Math.sin(Math.PI * clamp((u - 0.7) / 0.3, 0, 1)) * Math.min(6, L * 0.02); return { x: x0 + dx * e - dy / L * bow + dx / L * over, y: y0 + dy * e + dx / L * bow + dy / L * over }; } }
  const l = KF[KF.length - 1]; return { x: l[1], y: l[2] };
}
function jitter(t) { return { x: Math.sin(t * 2.3) * 1.2 + Math.sin(t * 5.1 + 1) * 0.6, y: Math.cos(t * 1.9) * 1.0 + Math.sin(t * 4.3) * 0.5 }; }

// ---------- header layout: the real Volwick layer row, wrapped on three rows ----------
const R = {};
function chipW(g, parts) { let w = 0; parts.forEach(([s, font]) => { g.font = font; w += g.measureText(s).width; }); return w; }
function layoutHeader() {
  const g = VW.g, F = '600 16px VWMono', L = '500 13px VWMono', B = '700 17px VWMono';
  const row = (y, items, x0) => { let x = x0; items.forEach(it => { const w = it.w || (chipW(g, it.parts) + (it.pad ?? 22)); R[it.id] = { x, y, w, h: 30, ...it }; x += w + (it.gap ?? 8); }); };
  g.save(); g.letterSpacing = '0px';
  row(HDR1 + 8, [ { id: 'logo', w: 112, gap: 14 }, { id: 'sep1', w: 2, gap: 12 }, { id: 'tick', parts: [['● ', F], ['ES ', B], ['7,734.50', B], ['  +0.26%  ', L], ['▾', L]], pad: 26 }, { id: 'tf', parts: [['1m', B]], pad: 26 } ], WIN.x0 + 14);
  row(HDR1 + 52, [ { id: 'gDealer', parts: [['DEALER', L]], pad: 4, gap: 8 }, { id: 'walls', parts: [['WALLS ', L], ['Top 3', F], [' ▾', L]] }, { id: 'metric', parts: [['METRIC ', L], ['GEX', F], [' ▾', L]] },
    { id: 'expiry', parts: [['EXPIRY ', L], ['All', F], [' ▾', L]] }, { id: 'maps', parts: [['MAPS ', L], ['None', F], [' ▾', L]], gap: 16 },
    { id: 'eslv', parts: [['ES LEVELS ', L], ['Shifted +33.6', F], [' ▾', L]], pad: 18, gap: 8 }, { id: 'sep2', w: 2, gap: 8 }, { id: 'gAct', parts: [['ACTIVITY', L]], pad: 2, gap: 8 },
    { id: 'bp', parts: [['BLOCK PRINTS', B], ['  ▾', L]], pad: 60, gap: 6 }, { id: 'cvd', parts: [['CVD', B]], pad: 54, gap: 6 }, { id: 'cdi', parts: [['CDI', B]], pad: 54, gap: 6 }, { id: 'flow', parts: [['FLOW', B]], pad: 54 } ], WIN.x0 + 14);
  g.font = B; const wg = g.measureText('? GUIDE').width + 22, wm = g.measureText('MARKET INTELLIGENCE').width + 22;
  R.mi = { x: WIN.x1 - 14 - wm, y: HDR1 + 8, w: wm, h: 30 }; R.guide = { x: R.mi.x - 8 - wg, y: HDR1 + 8, w: wg, h: 30 };
  g.restore();
}
// ---------- drawing helpers ----------
function box(x, y, w, h, fill, stroke, r = 6, lw = 1) { const g = VW.g; VW.roundRect(x, y, w, h, r); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); } }
function txt(s, x, y, font, col, align = 'left', base = 'middle') { const g = VW.g; g.font = font; g.fillStyle = col; g.textAlign = align; g.textBaseline = base; g.fillText(s, x, y); return g.measureText(s).width; }
function toggle(x, y, on, col) { const g = VW.g; box(x, y - 8, 30, 16, on ? col : '#1E2229', on ? null : '#2A2F38', 8); g.fillStyle = on ? '#FFFFFF' : '#5B6270'; g.beginPath(); g.arc(on ? x + 22 : x + 8, y, 5.5, 0, 7); g.fill(); }
const DK = { bg: '#000000', panel: '#0E0F13', chip: '#16171B', chipB: '#22252C', lab: '#6B7280', val: '#E8ECF2', sep: '#2F6BFF', grid: 'rgba(255,255,255,0.045)', axis: '#8A93A3' };

function header(t, S, cur) {
  const g = VW.g; g.fillStyle = DK.panel; g.fillRect(WIN.x0, HDR1, WIN.x1 - WIN.x0, HDR - HDR1); g.fillStyle = '#1A1D24'; g.fillRect(WIN.x0, HDR - 1, WIN.x1 - WIN.x0, 1);
  const L = '500 13px VWMono', F = '600 16px VWMono', B = '700 17px VWMono', lp = lastPrice(S), ch = (lp - PREV_CLOSE) / PREV_CLOSE * 100;
  const hov = id => { const r = R[id]; return cur.x > r.x && cur.x < r.x + r.w && cur.y > r.y && cur.y < r.y + r.h; };
  const chip = id => { const r = R[id], hl = hov(id); box(r.x, r.y, r.w, r.h, hl ? '#1B1F28' : DK.chip, hl ? '#3A4252' : DK.chipB, 6); };
  const wm = VW.assets.wm, wh = 20, ww = wh * wm.width / wm.height; g.save(); g.globalCompositeOperation = 'lighter'; g.drawImage(wm, R.logo.x, R.logo.y + 15 - wh / 2, ww, wh); g.restore();
  g.fillStyle = DK.sep; g.fillRect(R.sep1.x, R.sep1.y + 4, 2, 22);
  chip('tick'); let x = R.tick.x + 12; const y = R.tick.y + 15; g.fillStyle = '#2FB67C'; g.beginPath(); g.arc(x + 4, y, 4, 0, 7); g.fill(); x += 16;
  x += txt('ES ', x, y + 1, B, '#6E9BFF'); x += txt(fmt(lp), x, y + 1, B, DK.val) + 8;
  const cs = (ch >= 0 ? '+' : '') + ch.toFixed(2) + '%'; g.font = L; const cw = g.measureText(cs).width + 12; box(x, y - 10, cw, 20, ch >= 0 ? 'rgba(47,182,124,0.18)' : 'rgba(226,87,95,0.18)', null, 4); txt(cs, x + 6, y + 1, L, ch >= 0 ? '#2FB67C' : '#E2575F'); x += cw + 8; txt('▾', x, y + 1, L, DK.lab);
  chip('tf'); txt('1m', R.tf.x + R.tf.w / 2, R.tf.y + 16, B, DK.val, 'center');
  chip('guide'); txt('? GUIDE', R.guide.x + 11, R.guide.y + 16, B, '#C9D1DD'); chip('mi'); txt('MARKET INTELLIGENCE', R.mi.x + 11, R.mi.y + 16, B, '#C9D1DD');
  txt('DEALER', R.gDealer.x, R.gDealer.y + 16, L, DK.lab);
  for (const [id, lab, val] of [['walls', 'WALLS ', 'Top 3'], ['metric', 'METRIC ', 'GEX'], ['expiry', 'EXPIRY ', 'All'], ['maps', 'MAPS ', 'None']]) {
    chip(id); let xx = R[id].x + 11; const yy = R[id].y + 16; xx += txt(lab, xx, yy, L, id === 'walls' ? '#6E8BFF' : DK.lab); xx += txt(val, xx, yy, F, DK.val); txt(' ▾', xx, yy, L, DK.lab); }
  { chip('eslv'); let xx = R.eslv.x + 11; const yy = R.eslv.y + 16; xx += txt('ES LEVELS ', xx, yy, L, DK.lab); xx += txt('Shifted +33.6', xx, yy, F, DK.val); txt(' ▾', xx, yy, L, DK.lab); }
  g.fillStyle = DK.sep; g.fillRect(R.sep2.x, R.sep2.y + 4, 2, 22); txt('ACTIVITY', R.gAct.x, R.gAct.y + 16, L, DK.lab);
  { const r = R.bp; box(r.x, r.y, r.w, r.h, 'rgba(242,193,78,0.04)', 'rgba(242,193,78,0.75)', 6, 1.4); toggle(r.x + 10, r.y + 15, false, '#F2C14E');
    txt('BLOCK PRINTS', r.x + 48, r.y + 16, B, '#F5E6B8'); g.fillStyle = 'rgba(242,193,78,0.6)'; g.fillRect(r.x + r.w - 26, r.y + 7, 1, 16); txt('▾', r.x + r.w - 16, r.y + 16, L, '#F2C14E'); }
  for (const [id, lab] of [['cvd', 'CVD'], ['cdi', 'CDI'], ['flow', 'FLOW']]) { const r = R[id]; box(r.x, r.y, r.w, r.h, DK.chip, DK.chipB, 6); toggle(r.x + 10, r.y + 15, false, '#2F6BFF'); txt(lab, r.x + 46, r.y + 16, B, DK.val); }
  // WALLS is the layer this rule is about: a soft highlight while the rule names the wall
  const wk = seg(t, E.walls, E.walls + 0.25) * (1 - seg(t, T_END - 0.2, T_END)); if (wk > 0.02) { const r = R.walls; g.save(); g.globalAlpha = wk; box(r.x - 1, r.y - 1, r.w + 2, r.h + 2, null, '#26C08A', 7, 1.6); g.restore(); }
}
// dealer wall exactly as the terminal draws it: glow fading to the left, dot, "price · $" label on the right
function wallLine(w) { const g = VW.g, col = VX.WALL[w.fam], y = Math.round(Y(w.p)) + 0.5, xr = CX1 - 178, xl = CX0; g.save();
  const gr = g.createLinearGradient(xl, 0, xr, 0); gr.addColorStop(0, VW.rgba(col, 0.05)); gr.addColorStop(1, VW.rgba(col, 0.9)); g.strokeStyle = gr; g.lineWidth = 2; g.shadowColor = VW.rgba(col, 0.8); g.shadowBlur = 8;
  g.beginPath(); g.moveTo(xl, y); g.lineTo(xr, y); g.stroke(); g.shadowBlur = 0; g.fillStyle = col; g.beginPath(); g.arc(xr + 6, y, 4.5, 0, 7); g.fill();
  g.shadowColor = 'rgba(0,0,0,0.95)'; g.shadowBlur = 6; txt(fmt(w.p, 1) + ' · ' + w.usd, xr + 16, y + 1, '700 15px VWMono', col); g.restore(); }
function axisTag(p, bg, fg, a = 1, font = '700 14px VWMono') { if (a <= 0) return; const g = VW.g, y = Y(p); g.save(); g.globalAlpha = a; box(CX1 + 2, y - 12, WIN.x1 - CX1 - 6, 24, bg, null, 3); txt(fmt(p), (CX1 + WIN.x1) / 2, y + 1, font, fg, 'center'); g.restore(); }
function candles(S) {
  const g = VW.g, w = 8;
  for (let i = 0; i <= S.k; i++) { const b = barAt(i, S); if (!b) continue; const x = Math.round(X(i)), col = b.c >= b.o ? '#2FB67C' : '#E2575F'; g.fillStyle = col;
    g.fillRect(x - 0.75, Y(b.h), 1.5, Y(b.l) - Y(b.h)); const y0 = Y(Math.max(b.o, b.c)), y1 = Y(Math.min(b.o, b.c)); g.fillRect(x - w / 2, y0, w, Math.max(1.5, y1 - y0));
    const vh = Math.min(40, b.v / 3600 * 40); g.globalAlpha = 0.4; g.fillRect(x - w / 2, YB - vh, w, vh); g.globalAlpha = 1; }
}
function crosshair(cur, a) {
  if (a <= 0 || cur.x < CX0 || cur.x > CX1 || cur.y < HDR || cur.y > YB) return; const g = VW.g; g.save(); g.globalAlpha = a;
  g.strokeStyle = 'rgba(180,190,210,0.45)'; g.lineWidth = 1; g.setLineDash([5, 5]); g.beginPath(); g.moveTo(CX0, cur.y); g.lineTo(CX1, cur.y); g.moveTo(cur.x, HDR); g.lineTo(cur.x, YB); g.stroke(); g.setLineDash([]);
  const p = Math.round((PTOP - (cur.y - HDR - 8) / PX) * 4) / 4; axisTag(p, '#363A45', '#FFFFFF', 1, '600 14px VWMono'); g.restore();
}
function tooltip(a) { // wall hover label, same structure as the terminal tooltip (GEX, call wall long γ)
  if (a <= 0) return; const g = VW.g, w = GW, col = VX.WALL[w.fam], W = 410, H = 214, x = 636, y = Y(w.p) + 30 + (1 - a) * 6; g.save(); g.globalAlpha = a;
  g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 18; box(x, y, W, H, 'rgba(12,14,19,0.97)', '#2A2F38', 8); g.shadowBlur = 0; g.fillStyle = col; g.fillRect(x, y + 8, 3, H - 16);
  txt('→ ES ' + fmt(w.p, 1), x + 18, y + 24, '700 17px VWMono', DK.val); txt('GEX', x + W - 18, y + 24, '600 14px VWMono', DK.lab, 'right');
  txt('Call wall · long γ', x + 18, y + 54, '700 17px VWMono', col);
  txt('Suppressive resistance', x + 18, y + 80, '500 15px VWMono', '#C9D1DD'); txt('dealers defend, fade rallies', x + 18, y + 100, '500 15px VWMono', '#C9D1DD');
  txt('Net', x + 18, y + 130, '600 15px VWMono', DK.lab); txt(w.usd, x + 64, y + 130, '700 17px VWMono', DK.val); txt('long γ', x + 168, y + 130, '600 15px VWMono', col);
  ['Values are dealer P&L exposure per 1-point', 'SPX move (ES tracks SPX with carry offset).', 'Sum across all expirations.'].forEach((s, j) => txt(s, x + 18, y + 160 + j * 18, '500 13px VWMono', '#6B7280'));
  g.restore();
}
// editorial mark on top of the terminal (not a terminal feature): the stall range
function stallMark(t) {
  const k = seg(t, E.stall, E.stall + 0.5, eo), a = 1 - seg(t, T_END - 0.25, T_END); if (k <= 0 || a <= 0) return; const g = VW.g;
  const S = state(t), xa = X(K0 + 2) - 10, xb = mix(xa, Math.min(X(K0 + 19), X(S.k)) + 10, k), yt = Y(GW.p) + 6, yb = Y(7752.0);
  g.save(); g.globalAlpha = a; g.strokeStyle = '#2F6BFF'; g.lineWidth = 3; g.lineJoin = 'round'; g.shadowColor = 'rgba(47,107,255,0.7)'; g.shadowBlur = 10;
  g.beginPath(); g.moveTo(xa, yb - 12); g.lineTo(xa, yb); g.lineTo(xb, yb); g.lineTo(xb, yb - 12); g.stroke(); g.shadowBlur = 0;
  g.fillStyle = 'rgba(47,107,255,0.08)'; g.fillRect(xa, yt, xb - xa, yb - yt);
  const tk = seg(t, E.stall + 0.3, E.stall + 0.6, eo); if (tk > 0) { g.globalAlpha = a * tk; g.font = '700 18px VWMono'; g.letterSpacing = '3px'; const s = 'STALL', tw = g.measureText(s).width + 22, cx = (xa + X(K0 + 19) + 10) / 2 - 40;
    box(cx - tw / 2, yb + 10, tw, 30, '#2F6BFF', null, 6); txt(s, cx + 1.5, yb + 26, '700 18px VWMono', '#FFFFFF', 'center'); }
  g.restore();
}
function terminal(t, S, cur, tipA) {
  const g = VW.g; g.save(); g.beginPath(); g.rect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0); g.clip(); g.fillStyle = DK.bg; g.fillRect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0);
  g.save(); g.beginPath(); g.rect(CX0, HDR, CX1 - CX0, YB - HDR); g.clip();
  g.fillStyle = DK.grid; for (let i = -70; i <= 70; i++) if ((41 + 600 + i) % 5 === 0) g.fillRect(Math.round(X(i)), HDR, 1, YB - HDR);
  candles(S); WALLS.forEach(wallLine); crosshair(cur, tipA > 0.05 ? 0 : 1);
  g.restore();
  g.fillStyle = '#000'; g.fillRect(CX1, HDR, WIN.x1 - CX1, WIN.y1 - HDR);
  for (let p = 7736; p <= 7768; p += 2) txt(fmt(p), (CX1 + WIN.x1) / 2, Y(p), '500 14px VWMono', DK.axis, 'center');
  axisTag(lastPrice(S), '#E9EDF3', '#0B1220'); crosshair(cur, tipA > 0.05 ? 0 : 1);
  for (let i = -70; i <= 70; i++) { const m = 41 + 600 + i; if (m % 15) continue; const x = X(i); if (x < CX0 + 30 || x > CX1 - 30) continue; txt(tlabel(i), x, YB + 33, '500 14px VWMono', '#8A93A3', 'center'); }
  txt('ET', WIN.x1 - 40, YB + 33, '500 13px VWMono', DK.lab, 'center');
  stallMark(t); tooltip(tipA); header(t, S, cur);
  g.restore();
}
// ---------- the rule on white ----------
let LAY = null;
function layoutText() {
  const g = VW.g, maxW = 816; g.save(); g.letterSpacing = '-0.5px';
  const LINES = [[0, 7], [7, 11], [11, 14]], l1 = LINES.map(([a, b]) => S1.slice(a, b)), l2 = [S2];
  let size = 64; const width = ln => ln.reduce((p, w) => p + g.measureText(w[0]).width, 0) + g.measureText(' ').width * (ln.length - 1);
  for (; size > 40; size--) { g.font = `700 ${size}px VWSans`; if (Math.max(...[...l1, ...l2].map(width)) <= maxW) break; }
  const sp = g.measureText(' ').width, lh = Math.round(size * 1.16), gap = Math.round(size * 0.42), hTot = (l1.length + l2.length - 1) * lh + gap, y0 = 530 - hTot / 2;
  const items = []; const place = (lines, yStart) => lines.forEach((ln, li) => { const tw = width(ln); let x = VW.SAFE.cx - tw / 2;
    ln.forEach(w => { items.push({ s: w[0], t: w[1], x, y: yStart + li * lh, w: g.measureText(w[0]).width }); x += g.measureText(w[0]).width + sp; }); });
  place(l1, y0); place(l2, y0 + l1.length * lh + gap); g.restore(); LAY = { items, size };
}
function rule(t, a) {
  if (a <= 0) return; const g = VW.g; g.save(); g.globalAlpha = a; g.font = `700 ${LAY.size}px VWSans`; g.letterSpacing = '-0.5px'; g.textBaseline = 'middle'; g.textAlign = 'left';
  LAY.items.forEach(it => { const k = it.t <= 0 ? 1 : eo(lin(t, it.t, it.t + 0.16)); if (k <= 0) return; const col = KEYS[it.s.toLowerCase()] || '#0B0F17';
    g.save(); g.globalAlpha = a * k; g.fillStyle = col; g.fillText(it.s, it.x, it.y + (1 - k) * 10); g.restore();
    // a thin underline grows under the key words, like the landing
    if (KEYS[it.s.toLowerCase()]) { const u = seg(t, it.t + 0.12, it.t + 0.42, eo); if (u > 0) { const wd = it.s.replace(/[.,]$/, ''), ww = g.measureText(wd).width; g.fillStyle = VW.rgba(col, 0.35); g.fillRect(it.x, it.y + LAY.size * 0.5, ww * u, 4); } } });
  g.restore();
}
function logoPill(a) { if (a <= 0) return; const g = VW.g, wm = VW.assets.wm, h = 38, w = h * wm.width / wm.height, x = VW.SAFE.x0 + 18, y = 286;
  g.save(); g.globalAlpha = a; g.fillStyle = '#040913'; g.shadowColor = 'rgba(4,9,19,0.22)'; g.shadowBlur = 16; g.shadowOffsetY = 4; VW.roundRect(x - 18, y - 13, w + 36, h + 26, (h + 26) / 2); g.fill(); g.restore();
  g.save(); g.globalAlpha = a; g.globalCompositeOperation = 'lighter'; g.drawImage(wm, x, y, w, h); g.globalAlpha = 0.45 * a; g.drawImage(wm, x, y, w, h); g.restore();
  g.save(); g.globalAlpha = a; g.letterSpacing = '3px'; txt('ONE RULE', VW.SAFE.x1, y + h / 2 + 1, '700 22px VWMono', '#8C95A5', 'right'); g.restore(); }
function disclosure(a) { if (a <= 0) return; const g = VW.g; g.save(); g.globalAlpha = a;
  txt('Simulated session. Not a recording.', VW.SAFE.cx, 1516, '500 17px VWMono', '#8C95A5', 'center');
  txt('Dealer Walls: modeled options-derived positioning.', VW.SAFE.cx, 1541, '500 17px VWMono', '#8C95A5', 'center'); g.restore(); }
function endCard(t) {
  const k = eo(lin(t, T_END, T_END + 0.35)); if (k <= 0) return; const g = VW.g; g.save(); g.globalAlpha = k; g.fillStyle = '#040913'; g.fillRect(0, 0, 1080, 1920);
  const rg = g.createRadialGradient(518, 700, 40, 518, 700, 620); rg.addColorStop(0, 'rgba(47,107,255,0.16)'); rg.addColorStop(1, 'rgba(47,107,255,0)'); g.fillStyle = rg; g.fillRect(0, 0, 1080, 1920); g.restore();
  const a = (t0, d = 0.3) => eo(lin(t, t0, t0 + d)), cx = VW.SAFE.cx;
  { const wm = VW.assets.wm, h = 78, w = h * wm.width / wm.height, al = a(T_END + 0.15, 0.4); if (al > 0) { g.save(); g.globalAlpha = al; g.globalCompositeOperation = 'lighter'; g.drawImage(wm, cx - w / 2, 600 - h / 2, w, h); g.globalAlpha = 0.45 * al; g.drawImage(wm, cx - w / 2, 600 - h / 2, w, h); g.restore(); } }
  g.save(); g.globalAlpha = a(T_END + 0.45); g.fillStyle = '#2F6BFF'; g.fillRect(cx - 40, 690, 80, 3); g.restore();
  g.save(); g.globalAlpha = a(T_END + 0.55); txt('$0.99 — FIRST MONTH', cx, 820 + (1 - a(T_END + 0.55)) * 10, '700 78px VWSans', '#FFFFFF', 'center'); txt('Then $89/month. Cancel anytime.', cx, 900, '600 36px VWSans', '#AEB8CC', 'center'); g.restore();
  g.save(); g.globalAlpha = a(T_END + 1.0); g.letterSpacing = '2px'; g.font = '700 54px VWSans'; const s1 = 'SEE WHAT OTHERS ', s2 = 'CAN’T.', w1 = g.measureText(s1).width, w2 = g.measureText(s2).width;
  txt(s1, cx - (w1 + w2) / 2, 1060, '700 54px VWSans', '#F2F5FA'); txt(s2, cx - (w1 + w2) / 2 + w1, 1060, '700 54px VWSans', '#6E9BFF'); g.restore();
  { const al = a(T_END + 1.35); g.save(); g.globalAlpha = al; const bw = 520, bh = 96, bx = cx - bw / 2, by = 1170; g.shadowColor = 'rgba(47,107,255,0.55)'; g.shadowBlur = 30; box(bx, by, bw, bh, '#2F6BFF', null, 48); g.shadowBlur = 0;
    g.letterSpacing = '4px'; txt('DISCOVER VOLWICK', cx, by + bh / 2 + 2, '700 34px VWMono', '#FFFFFF', 'center'); g.restore(); }
  g.save(); g.globalAlpha = a(T_END + 1.6); ['Simulated session. Not a recording.', 'Dealer Walls represent modeled options-derived positioning.', 'For ES/MES, SPX-derived levels use estimated basis mapping.', 'Not financial advice.']
    .forEach((s, j) => txt(s, cx, 1392 + j * 32, '500 19px VWMono', '#7F8AA0', 'center')); g.restore();
}
let OC = null, OG = null;
let TCH = [];
function cam(t) { const k = 1 - seg(t, E.zout0, E.zout1, eio); let P = 0; TCH.forEach(ti => { if (t >= ti) P += Math.exp(-(t - ti) / 0.16) * (ti === TCH[0] ? 1 : 0.7); });
  return { z: (1 + 0.55 * k) * (1 + 0.04 * P), cx: mix(800, 1080, k) + 5 * P * Math.sin(t * 73), cy: mix(500, 444, k) + 4 * P * Math.cos(t * 61) }; }
function studio() { const g = VW.g, bg = g.createLinearGradient(0, 0, 0, 1920); bg.addColorStop(0, '#FAFBFC'); bg.addColorStop(0.7, '#EEF0F3'); bg.addColorStop(1, '#E4E7EC'); g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  const dy = 1434, dk = g.createLinearGradient(0, dy, 0, 1920); dk.addColorStop(0, '#E2E5EA'); dk.addColorStop(1, '#D5D9E0'); g.fillStyle = dk; g.fillRect(0, dy, 1080, 1920 - dy);
  g.fillStyle = 'rgba(255,255,255,0.8)'; g.fillRect(0, dy, 1080, 1.5);
  g.save(); g.translate(518, dy + 4); g.scale(1, 0.07); const sh = g.createRadialGradient(0, 0, 10, 0, 0, 340); sh.addColorStop(0, 'rgba(20,28,45,0.30)'); sh.addColorStop(1, 'rgba(20,28,45,0)'); g.fillStyle = sh; g.fillRect(-400, -400, 800, 800); g.restore(); }
function monitor(t, S, c, tipA) {
  const g = VW.g, cx = (MON.x0 + MON.x1) / 2, chinY = SCR.y + SCR.h + 22;
  const al = g.createLinearGradient(cx - 46, 0, cx + 46, 0); al.addColorStop(0, '#A9AFB8'); al.addColorStop(0.5, '#D9DDE2'); al.addColorStop(1, '#9AA0A9');
  g.fillStyle = al; g.beginPath(); g.moveTo(cx - 40, chinY - 4); g.lineTo(cx + 40, chinY - 4); g.lineTo(cx + 48, 1422); g.lineTo(cx - 48, 1422); g.closePath(); g.fill();
  g.fillStyle = 'rgba(0,0,0,0.12)'; g.fillRect(cx - 40, chinY - 4, 80, 10);
  const bs = g.createLinearGradient(0, 1418, 0, 1436); bs.addColorStop(0, '#E3E6EA'); bs.addColorStop(1, '#A5ABB4'); g.fillStyle = bs; VW.roundRect(cx - 150, 1418, 300, 16, 8); g.fill();
  g.save(); g.shadowColor = 'rgba(15,22,38,0.35)'; g.shadowBlur = 60; g.shadowOffsetY = 26; g.fillStyle = '#0B0C0F'; VW.roundRect(MON.x0, MON.y0, MON.x1 - MON.x0, chinY - MON.y0, 18); g.fill(); g.restore();
  g.strokeStyle = 'rgba(255,255,255,0.14)'; g.lineWidth = 1.5; VW.roundRect(MON.x0 + 0.75, MON.y0 + 0.75, MON.x1 - MON.x0 - 1.5, chinY - MON.y0 - 1.5, 17.5); g.stroke();
  g.fillStyle = '#2A2D33'; g.beginPath(); g.arc(cx, chinY - 11, 2.2, 0, 7); g.fill();
  const vg = VW.g; VW.g = OG; OG.setTransform(1, 0, 0, 1, 0, 0); terminal(t, S, c, tipA); if (t < T_END) drawCursor(c, tipA); VW.g = vg;
  const C = cam(t), s = SCR.w / 1600 * C.z, dx = SCR.x + SCR.w / 2 - C.cx * s, dy = SCR.y + SCR.h / 2 - C.cy * s;
  g.save(); g.beginPath(); g.rect(SCR.x, SCR.y, SCR.w, SCR.h); g.clip(); g.fillStyle = '#000'; g.fillRect(SCR.x, SCR.y, SCR.w, SCR.h);
  g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high'; g.drawImage(OC, dx, dy, 1600 * s, 1000 * s);
  const gl = g.createLinearGradient(SCR.x, SCR.y, SCR.x + SCR.w * 0.7, SCR.y + SCR.h); gl.addColorStop(0, 'rgba(255,255,255,0.06)'); gl.addColorStop(0.45, 'rgba(255,255,255,0.015)'); gl.addColorStop(0.46, 'rgba(255,255,255,0)'); g.fillStyle = gl; g.fillRect(SCR.x, SCR.y, SCR.w, SCR.h);
  g.restore();
}
function drawCursor(c, tipA) { const g = VW.g, inChart = c.x > CX0 && c.x < CX1 && c.y > HDR && c.y < YB && tipA < 0.05;
  if (inChart) { g.save(); g.strokeStyle = '#FFFFFF'; g.lineWidth = 2.5; g.shadowColor = 'rgba(0,0,0,0.9)'; g.shadowBlur = 4; g.beginPath(); g.moveTo(c.x - 14, c.y); g.lineTo(c.x + 14, c.y); g.moveTo(c.x, c.y - 14); g.lineTo(c.x, c.y + 14); g.stroke(); g.restore(); }
  else VX.cursor(c.x, c.y, 1, false, 0); }
function render(t) {
  const g = VW.g, S = state(t); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.save(); const sc = 1 + 0.03 * Math.min(t, T_END) / T_END; g.translate(518, 1040); g.scale(sc, sc); g.translate(-518, -1040); studio();
  let c = cursorAt(t); const jt = jitter(t); c = { x: c.x + jt.x, y: c.y + jt.y };
  const tipA = eo(lin(t, E.tip, E.tip + 0.18)) * (1 - seg(t, E.tipOut, E.tipOut + 0.2));
  monitor(t, S, c, tipA); g.restore();
  const outA = 1 - seg(t, T_END, T_END + 0.3); logoPill(outA); rule(t, outA); disclosure(outA);
  endCard(t); g.restore();
}
window.READY = (async () => {
  buildBars(); await VW.loadFonts(); await VW.loadBrand(); OC = document.createElement('canvas'); OC.width = 1600; OC.height = 1000; OG = OC.getContext('2d'); { const vg = VW.g; VW.g = OG; layoutHeader(); VW.g = vg; } layoutText();
  const wy = Y(GW.p), T = touchTimes();
  TCH = T; const wc = { x: R.walls.x + R.walls.w * 0.62, y: R.walls.y + 16 };
  KF = [ [0, 1060, 452], [0.9, 1040, Y(7756.5), 0.08], [1.24, X(47) - 6, wy, -0.1], [1.3, X(47) - 4, wy + 1], [4.1, X(47) + 2, wy - 1],
    [4.85, 1528, 690, 0.12], [5.1, 1530, 691], [7.7, 1534, 693], [8.55, wc.x, wc.y, -0.1], [8.7, wc.x + 2, wc.y + 1], [9.6, wc.x + 4, wc.y] ];
  window.render = render; render(0);
  return { total: TOTAL, events: { ...E, touches: T, words: [...S1, ...S2].map(w => w[1]), end: T_END, logo0: T_END } };
})();
