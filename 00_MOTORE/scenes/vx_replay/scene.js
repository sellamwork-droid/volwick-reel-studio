// VX · REPLAY (CREATIVE 01, 30 Oct 2026). A trader draws support and resistance on a white chart, runs a replay,
// then the same session continues inside Volwick and the layers are switched on one at a time from the real layer row.
// Simulated ES session (gen_data.py), no real market data. Every frame is a pure function of time.
const { seg, lin, eo, eio, mix, clamp } = VW;
// '#hook' variant: the video opens on a hook clip that match-cuts onto the swing high, so the intro is shorter (line tool already active)
const HK = location.hash.includes('hook'), SHF = HK ? 1.45 : 0;
const TOTAL = 25.0 - SHF;
let D, BARS, SH, SL;
// ---------- geometry ----------
const WIN = { x0: 96, x1: 940, y0: 520, y1: 1490 };
const HDR1 = 520, HDR = 640;                  // three header rows of 40 px
const CX0L = 140, CX0D = 96, CX1 = 858;        // chart left (light has the drawing toolbar), chart right / price axis
const PTOP = 7752.5, PX = 22;                   // fixed price scale: px per point
const Y = p => HDR + (PTOP - p) * PX;
const SP = 12, XR = 790;                        // bar spacing, x of the last completed bar before replay
const RP0 = 4.4 - SHF, RPB = 0.6;                     // replay start, seconds per bar
const T_XF0 = 11.35 - SHF, T_XF1 = 11.85 - SHF;             // light -> Volwick dissolve
const T_END = 20.9 - SHF;
// ---------- timeline of interactions ----------
const E0 = HK ? { tool1: -1, lineR: 0.45, tool2: 1.08, lineS: 1.95, play: 2.85 } : { tool1: 0.92, lineR: 1.86, tool2: 2.42, lineS: 3.46, play: 4.3 };
const E = { ...E0, hoverR: 10.15 - SHF, walls: 12.0 - SHF,
  maps: 13.22 - SHF, gamma: 13.72 - SHF, prints: 14.62 - SHF, cvd: 15.42 - SHF, tip: 18.15 - SHF, end: T_END };
const WALLS = [ { p: 7751.5, fam: 'callS', usd: '−$9.8M' }, { p: 7746.5, fam: 'callS', usd: '−$16.2M' }, { p: 7736.5, fam: 'callL', usd: '+$7.9M' },
  { p: 7729.5, fam: 'putS', usd: '−$11.2M' }, { p: 7721.5, fam: 'putL', usd: '+$12.6M' } ];
const PRINTS = [ { i: 16, p: 7741.25, q: '386' }, { i: 34, p: 7723.0, q: '1,020', gold: true }, { i: 48, p: 7733.25, q: '742', gold: true },
  { i: 58, p: 7733.25, q: '542' }, { i: 68, p: 7741.0, q: '520' }, { i: 77, p: 7742.0, q: '860 ×2', gold: true }, { i: 83, p: 7746.75, q: '475' } ];
const KEYLEVEL = { p: 7733.25, q: '1,284', b: 2 };
const PREV_CLOSE = 7714.25;

// ---------- replay state ----------
function rp(t) { return t < RP0 ? 0 : (Math.min(t, T_END) - RP0) / RPB; }
function state(t) { const r = rp(t), k = 60 + Math.floor(r), f = r - Math.floor(r); return { s: 59 + r, k: r > 0 ? k : 60, f: r > 0 ? f : 0, live: r > 0 }; }
const X = (i, S) => XR - (S.s - i) * SP;
function barAt(i, S) { // completed bar, or the forming one built from its tick path
  const b = BARS[i]; if (i < S.k) return b; if (i > S.k || !S.live) return null;
  const n = b.path.length - 1, u = S.f * n, j = Math.floor(u); let h = b.o, l = b.o; for (let q = 0; q <= Math.min(j, n); q++) { h = Math.max(h, b.path[q]); l = Math.min(l, b.path[q]); }
  const c = b.path[Math.min(j, n)]; return { o: b.o, h: Math.max(h, c), l: Math.min(l, c), c, v: Math.round(b.v * S.f), d: Math.round(b.d * S.f) };
}
function lastPrice(S) { const b = barAt(S.live ? S.k : 59, S); return b ? b.c : BARS[59].c; }
const fmt = (p, d = 2) => p.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const tlabel = i => { const m = 10 * 60 + 2 + i; return Math.floor(m / 60) + ':' + String(m % 60).padStart(2, '0'); };

// ---------- humanized cursor ----------
let KF = [];
function cursorAt(t) {
  if (t <= KF[0][0]) return { x: KF[0][1], y: KF[0][2] };
  for (let q = 0; q < KF.length - 1; q++) { const [t0, x0, y0] = KF[q], [t1, x1, y1, curv = 0.12] = KF[q + 1];
    if (t <= t1) { const u = (t - t0) / (t1 - t0), e = u < 1 ? 1 - Math.pow(1 - u, 3) * (1 - 0.0 * u) : 1;   // fast start, soft landing
      const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, bow = Math.sin(Math.PI * e) * L * curv;  // slight arc like a wrist
      const over = Math.sin(Math.PI * clamp((u - 0.7) / 0.3, 0, 1)) * Math.min(6, L * 0.02);                 // tiny overshoot and settle
      return { x: x0 + dx * e - dy / L * bow + dx / L * over, y: y0 + dy * e + dx / L * bow + dy / L * over }; } }
  const l = KF[KF.length - 1]; return { x: l[1], y: l[2] };
}
function jitter(t) { return { x: Math.sin(t * 2.3) * 1.2 + Math.sin(t * 5.1 + 1) * 0.6, y: Math.cos(t * 1.9) * 1.0 + Math.sin(t * 4.3) * 0.5 }; }
const CLICKS = [E.tool1, E.lineR, E.tool2, E.lineS, E.play, E.maps, E.gamma, E.prints, E.cvd];
const press = t => CLICKS.reduce((p, c) => Math.max(p, t >= c - 0.03 ? Math.exp(-(t - c + 0.03) * 9) * (t < c + 0.45 ? 1 : 0) : 0), 0);

// ---------- header layout (real Volwick layer row, wrapped to fit the phone) ----------
const R = {};
function chipW(g, parts) { let w = 0; parts.forEach(([txt, font]) => { g.font = font; w += g.measureText(txt).width; }); return w; }
function layoutHeader() {
  const g = VW.g, F = '600 16px VWMono', L = '500 13px VWMono', B = '700 17px VWMono';
  const row = (y, items, x0) => { let x = x0; items.forEach(it => { const w = it.w || (chipW(g, it.parts) + (it.pad ?? 22)); R[it.id] = { x, y, w, h: 30, ...it }; x += w + (it.gap ?? 8); }); };
  g.save(); g.letterSpacing = '0px';
  row(HDR1 + 5, [ { id: 'logo', w: 112, gap: 14 }, { id: 'sep1', w: 2, gap: 12 }, { id: 'tick', parts: [['● ', F], ['ES ', B], ['7,734.50', B], ['  +0.26%  ', L], ['▾', L]], pad: 26 }, { id: 'tf', parts: [['1m', B]], pad: 26 } ], WIN.x0 + 12);
  row(HDR1 + 45, [ { id: 'gDealer', parts: [['DEALER', L]], pad: 4, gap: 8 }, { id: 'walls', parts: [['WALLS ', L], ['Top 5', F], [' ▾', L]] }, { id: 'metric', parts: [['METRIC ', L], ['GEX', F], [' ▾', L]] },
    { id: 'expiry', parts: [['EXPIRY ', L], ['All', F], [' ▾', L]] }, { id: 'maps', parts: [['MAPS ', L], ['Gamma', F], [' ▾', L]] } ], WIN.x0 + 12);
  // row 3 starts with ACTIVITY (Power 30 Oct 17:00: no ES LEVELS, no GUIDE, no MARKET INTELLIGENCE in the videos)
  row(HDR1 + 85, [ { id: 'gAct', parts: [['ACTIVITY', L]], pad: 2, gap: 10 },
    { id: 'bp', parts: [['BLOCK PRINTS', B], ['  ▾', L]], pad: 60, gap: 6 }, { id: 'cvd', parts: [['CVD', B]], pad: 54, gap: 6 }, { id: 'cdi', parts: [['CDI', B]], pad: 54, gap: 6 }, { id: 'flow', parts: [['FLOW', B]], pad: 54 } ], WIN.x0 + 12);
  { const r = R.flow, over = r.x + r.w - (WIN.x1 - 10); if (over > 0) console.log('row3 overflow', over); }
  // right side of row 1
  g.restore();
}
const ctr = id => ({ x: R[id].x + R[id].w / 2, y: R[id].y + R[id].h / 2 });

// ---------- drawing helpers ----------
function box(x, y, w, h, fill, stroke, r = 6, lw = 1) { const g = VW.g; VW.roundRect(x, y, w, h, r); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); } }
function txt(s, x, y, font, col, align = 'left', base = 'middle') { const g = VW.g; g.font = font; g.fillStyle = col; g.textAlign = align; g.textBaseline = base; g.fillText(s, x, y); return g.measureText(s).width; }
function toggle(x, y, on, col) { const g = VW.g; box(x, y - 8, 30, 16, on ? col : '#1E2229', on ? null : '#2A2F38', 8); g.fillStyle = on ? '#FFFFFF' : '#5B6270'; g.beginPath(); g.arc(on ? x + 22 : x + 8, y, 5.5, 0, 7); g.fill(); }

// ---------- LIGHT (generic charting software) ----------
const LT = { bg: '#FFFFFF', grid: '#F0F3FA', up: '#089981', dn: '#F23645', axis: '#131722', sub: '#787B86', line: '#2962FF', border: '#E0E3EB' };
function lightToolbar(t, cur) {
  const g = VW.g, x = WIN.x0, icons = 7; g.fillStyle = '#FFFFFF'; g.fillRect(x, HDR, CX0L - x, 1424 - HDR); g.fillStyle = LT.border; g.fillRect(CX0L - 1, HDR, 1, 1424 - HDR);
  const toolOn = (t >= E.tool1 && t < E.lineR) || (t >= E.tool2 && t < E.lineS);
  for (let k = 0; k < icons; k++) { const cx = x + 22, cy = 668 + k * 48, hov = Math.abs(cur.x - cx) < 20 && Math.abs(cur.y - cy) < 20;
    if (k === 2 && toolOn) box(cx - 17, cy - 17, 34, 34, '#E3EFFD', null, 6); else if (hov) box(cx - 17, cy - 17, 34, 34, '#F0F3FA', null, 6);
    g.save(); g.strokeStyle = k === 2 && toolOn ? LT.line : '#131722'; g.fillStyle = g.strokeStyle; g.lineWidth = 1.8; g.lineCap = 'round'; g.beginPath();
    if (k === 0) { g.moveTo(cx - 9, cy); g.lineTo(cx + 9, cy); g.moveTo(cx, cy - 9); g.lineTo(cx, cy + 9); }
    if (k === 1) { g.moveTo(cx - 9, cy + 9); g.lineTo(cx + 9, cy - 9); }
    if (k === 2) { g.moveTo(cx - 11, cy); g.lineTo(cx + 11, cy); }
    if (k === 3) { for (const d of [-8, -2, 4, 9]) { g.moveTo(cx - 10, cy + d); g.lineTo(cx + 10, cy + d); } }
    if (k === 4) { g.moveTo(cx - 9, cy + 8); g.bezierCurveTo(cx - 4, cy - 10, cx + 2, cy + 10, cx + 9, cy - 8); }
    if (k === 5) { g.moveTo(cx - 7, cy - 8); g.lineTo(cx + 7, cy - 8); g.moveTo(cx, cy - 8); g.lineTo(cx, cy + 9); }
    if (k === 6) { g.rect(cx - 10, cy - 5, 20, 10); for (const d of [-5, 0, 5]) { g.moveTo(cx + d, cy - 5); g.lineTo(cx + d, cy - 1); } }
    g.stroke(); if (k === 2) { g.beginPath(); g.arc(cx, cy, 2.6, 0, 7); g.fill(); } g.restore(); }
}
function lightHeader(t, S) {
  const g = VW.g, last = barAt(S.live ? S.k : 59, S) || BARS[59], lp = last.c; g.fillStyle = '#FFFFFF'; g.fillRect(WIN.x0, HDR1, WIN.x1 - WIN.x0, HDR - HDR1);
  g.fillStyle = LT.border; g.fillRect(WIN.x0, HDR1 + 40, WIN.x1 - WIN.x0, 1);
  let x = WIN.x0 + 14; const y = HDR1 + 20;
  box(x, y - 14, 92, 28, '#F0F3FA', null, 6); txt('⌕', x + 10, y, '600 17px VWSans', LT.sub); txt('ES', x + 32, y + 1, '700 18px VWSans', LT.axis); x += 104;
  txt('1m', x + 6, y + 1, '700 17px VWSans', LT.axis); x += 44; g.fillStyle = LT.border; g.fillRect(x, y - 12, 1, 24); x += 12;
  txt('ƒx  Indicators', x, y + 1, '600 17px VWSans', LT.axis); x += 142; g.fillStyle = LT.border; g.fillRect(x, y - 12, 1, 24); x += 12;
  box(x, y - 14, 100, 28, '#E3EFFD', null, 6); txt('⟲ Replay', x + 12, y + 1, '700 17px VWSans', LT.line);
  // legend rows (symbol + OHLC, volume)
  const col = lp >= last.o ? LT.up : LT.dn; let lx = WIN.x0 + 14; const y2 = HDR1 + 60, y3 = HDR1 + 98;
  lx += txt('E-mini S&P 500 Futures · 1 · CME', lx, y2, '600 16px VWSans', LT.axis) + 14;
  for (const [k, v] of [['O', last.o], ['H', last.h], ['L', last.l], ['C', lp]]) { lx += txt(k, lx, y2, '600 15px VWSans', LT.sub) + 3; lx += txt(fmt(v), lx, y2, '600 15px VWSans', col) + 10; }
  txt('Vol', WIN.x0 + 14, y3, '600 15px VWSans', LT.sub); txt((last.v / 1000).toFixed(2) + 'K', WIN.x0 + 46, y3, '600 15px VWSans', col);
}
function replayBar(t) {
  const g = VW.g, y0 = 1424, y1 = WIN.y1, cy = (y0 + y1) / 2; g.fillStyle = '#FFFFFF'; g.fillRect(WIN.x0, y0, WIN.x1 - WIN.x0, y1 - y0); g.fillStyle = LT.border; g.fillRect(WIN.x0, y0, WIN.x1 - WIN.x0, 1);
  let x = WIN.x0 + 16; box(x, cy - 15, 112, 30, '#F0F3FA', null, 6); txt('Select bar', x + 12, cy + 1, '600 15px VWSans', LT.axis); x += 130;
  const playing = t >= E.play; box(x, cy - 17, 40, 34, '#F0F3FA', null, 6); g.fillStyle = LT.axis;
  if (!playing) { g.beginPath(); g.moveTo(x + 14, cy - 9); g.lineTo(x + 28, cy); g.lineTo(x + 14, cy + 9); g.closePath(); g.fill(); } else { g.fillRect(x + 13, cy - 8, 5, 16); g.fillRect(x + 22, cy - 8, 5, 16); }
  R.play = { x, y: cy - 17, w: 40, h: 34 }; x += 52;
  g.beginPath(); g.moveTo(x + 8, cy - 8); g.lineTo(x + 18, cy); g.lineTo(x + 8, cy + 8); g.closePath(); g.fill(); g.fillRect(x + 20, cy - 8, 3, 16); x += 40;
  txt('1x', x + 4, cy + 1, '700 16px VWSans', LT.axis); x += 40;
  txt('Jump to real-time', WIN.x1 - 16, cy + 1, '600 15px VWSans', LT.sub, 'right');
}
function hline(p, col, lw, dash, x0, x1, a = 1, sel = 0) { if (a <= 0) return; const g = VW.g, y = Math.round(Y(p)) + 0.5; g.save(); g.globalAlpha = a; g.strokeStyle = col; g.lineWidth = lw; g.setLineDash(dash); g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.stroke(); g.setLineDash([]);
  if (sel > 0) { g.globalAlpha = a * sel; for (const hx of [x0 + 120, x1 - 120]) { g.fillStyle = '#FFFFFF'; g.strokeStyle = col; g.lineWidth = 2; g.beginPath(); g.arc(hx, y, 6, 0, 7); g.fill(); g.stroke(); } } g.restore(); }
function axisTag(p, bg, fg, a = 1, font = '600 15px VWSans') { if (a <= 0) return; const g = VW.g, y = Y(p); g.save(); g.globalAlpha = a; box(CX1 + 2, y - 12, WIN.x1 - CX1 - 6, 24, bg, null, 3); txt(fmt(p), (CX1 + WIN.x1) / 2, y + 1, font, fg, 'center'); g.restore(); }

function candles(S, th, x0, yb) {
  const g = VW.g, up = th === 'light' ? LT.up : '#2FB67C', dn = th === 'light' ? LT.dn : '#E2575F', w = 8;
  for (let i = 0; i <= S.k; i++) { const b = barAt(i, S); if (!b) continue; const x = Math.round(X(i, S)); if (x < x0 - 6 || x > CX1 + 6) continue;
    const col = b.c >= b.o ? up : dn; g.fillStyle = col; g.fillRect(x - 0.75, Y(b.h), 1.5, Y(b.l) - Y(b.h));
    const y0 = Y(Math.max(b.o, b.c)), y1 = Y(Math.min(b.o, b.c)); g.fillRect(x - w / 2, y0, w, Math.max(1.5, y1 - y0));
    // volume
    const vmax = th === 'light' ? 64 : 40, vh = Math.min(vmax, b.v / 3200 * vmax); g.globalAlpha = th === 'light' ? 0.35 : 0.4; g.fillRect(x - w / 2, yb - vh, w, vh); g.globalAlpha = 1; }
}
function timeAxis(S, x0, y, th) {
  const g = VW.g; for (let i = 0; i <= 92; i++) { const m = 10 * 60 + 2 + i; if (m % 15) continue; const x = X(i, S); if (x < x0 + 20 || x > CX1 - 20) continue;
    txt(tlabel(i), x, y, th === 'light' ? '600 15px VWSans' : '500 14px VWMono', th === 'light' ? LT.axis : '#8A93A3', 'center'); }
}
let NOCROSS = false;
function crosshair(cur, th, x0, y0, y1, a = 1) {
  if (NOCROSS || cur.x < x0 || cur.x > CX1 || cur.y < y0 || cur.y > y1 || a <= 0) return; const g = VW.g; g.save(); g.globalAlpha = a;
  g.strokeStyle = th === 'light' ? 'rgba(120,123,134,0.7)' : 'rgba(180,190,210,0.45)'; g.lineWidth = 1; g.setLineDash([5, 5]);
  g.beginPath(); g.moveTo(x0, cur.y); g.lineTo(CX1, cur.y); g.moveTo(cur.x, y0); g.lineTo(cur.x, y1); g.stroke(); g.setLineDash([]);
  const p = Math.round((PTOP - (cur.y - HDR) / PX) * 4) / 4; axisTag(p, th === 'light' ? '#131722' : '#363A45', '#FFFFFF', 1, th === 'light' ? '600 15px VWSans' : '600 14px VWMono'); g.restore();
}
function drawLight(t, S, cur) {
  const g = VW.g; g.save(); g.beginPath(); g.rect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0); g.clip();
  g.fillStyle = LT.bg; g.fillRect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0);
  // grid
  g.fillStyle = LT.grid; for (let p = 7720; p <= 7752; p += 4) g.fillRect(CX0L, Math.round(Y(p)), CX1 - CX0L, 1);
  for (let i = 0; i <= 92; i++) if ((10 * 60 + 2 + i) % 15 === 0) { const x = Math.round(X(i, S)); if (x > CX0L && x < CX1) g.fillRect(x, HDR, 1, 1396 - HDR); }
  g.save(); g.beginPath(); g.rect(CX0L, HDR, CX1 - CX0L, 1396 - HDR); g.clip(); candles(S, 'light', CX0L, 1396);
  // drawn levels
  const selR = t >= E.lineR && t < E.lineR + 0.7 ? 1 : seg(t, E.hoverR, E.hoverR + 0.15) * (1 - seg(t, T_XF0, T_XF0 + 0.2));
  if (t >= E.lineR) hline(SH, LT.line, t >= E.hoverR && t < T_XF0 + 0.2 ? 3 : 2, [], CX0L, CX1, 1, selR);
  if (t >= E.lineS) hline(SL, LT.line, 2, [], CX0L, CX1, 1, t < E.lineS + 0.7 ? 1 : 0);
  crosshair(cur, 'light', CX0L, HDR, 1396);
  g.restore();
  // price axis
  g.fillStyle = '#FFFFFF'; g.fillRect(CX1, HDR, WIN.x1 - CX1, 1424 - HDR); g.fillStyle = LT.border; g.fillRect(CX1, HDR, 1, 1424 - HDR);
  for (let p = 7720; p <= 7752; p += 4) txt(fmt(p), (CX1 + WIN.x1) / 2, Y(p), '600 15px VWSans', LT.axis, 'center');
  if (t >= E.lineR) axisTag(SH, LT.line, '#FFFFFF'); if (t >= E.lineS) axisTag(SL, LT.line, '#FFFFFF');
  const lp = lastPrice(S), lb = barAt(S.live ? S.k : 59, S) || BARS[59]; axisTag(lp, lp >= lb.o ? LT.up : LT.dn, '#FFFFFF');
  crosshair(cur, 'light', CX0L, HDR, 1396); // axis label on top
  // time axis
  g.fillStyle = '#FFFFFF'; g.fillRect(CX0L, 1396, CX1 - CX0L, 28); g.fillStyle = LT.border; g.fillRect(CX0L, 1396, CX1 - CX0L, 1); timeAxis(S, CX0L, 1411, 'light');
  lightHeader(t, S); lightToolbar(t, cur); replayBar(t);
  g.restore();
}

// ---------- DARK (Volwick terminal) ----------
const DK = { bg: '#000000', panel: '#0E0F13', chip: '#16171B', chipB: '#22252C', lab: '#6B7280', val: '#E8ECF2', sep: '#2F6BFF', grid: 'rgba(255,255,255,0.045)', axis: '#8A93A3' };
function gammaG(p, col) { // modeled gamma profile (M$ per point): long γ in the range, short γ above the flip and below the floor
  const flip = 7739.5 + 0.25 * Math.sin(col * 1.3);
  if (p > flip) return -Math.min(117, 40 + (p - flip) * 18) * (1 + 0.08 * Math.sin(col * 0.7));
  if (p < 7724) return -Math.min(90, (7724 - p) * 22);
  return Math.min(110, 30 + 70 * Math.exp(-Math.pow((p - 7733) / 5, 2))) * (1 + 0.06 * Math.cos(col));
}
function gammaMap(S, a, y1) {
  if (a <= 0) return; const g = VW.g; g.save(); g.globalAlpha = a;
  const kmax = S.k; for (let c0 = 0; c0 <= kmax; c0 += 5) { const xa = X(c0, S) - SP / 2, xb = X(Math.min(c0 + 5, kmax + 1), S) - SP / 2; if (xb < CX0D || xa > CX1) continue;
    for (let p = 7715; p < PTOP; p += 0.5) { const v = gammaG(p + 0.25, c0 / 5); const k = Math.min(1, Math.abs(v) / 117);
      g.fillStyle = v > 0 ? `rgba(47,107,255,${0.035 + 0.13 * k})` : `rgba(245,146,40,${0.035 + 0.14 * k})`; g.fillRect(xa, Y(p + 0.5), xb - xa + 0.5, PX / 2 + 0.5); }
    // white step at the sign change
    const flip = 7739.5 + 0.25 * Math.sin(c0 / 5 * 1.3); g.fillStyle = 'rgba(255,255,255,0.85)'; g.fillRect(xa, Y(flip) - 1, xb - xa, 2);
    if (c0 > 0) { const pf = 7739.5 + 0.25 * Math.sin((c0 / 5 - 1) * 1.3); g.fillRect(xa - 1, Math.min(Y(flip), Y(pf)) - 1, 2, Math.abs(Y(flip) - Y(pf)) + 2); } }
  // legend like the terminal
  const lx = CX0D + 14, ly = HDR + 22; box(lx - 8, ly - 15, 404, 30, 'rgba(14,15,19,0.9)', '#22252C', 5);
  let x = lx + txt('MAP · GAMMA ', lx, ly, '700 13px VWMono', '#C9D1DD'); x += txt('≤−117.3 ', x, ly, '500 13px VWMono', '#F59228');
  const gr = g.createLinearGradient(x, 0, x + 70, 0); gr.addColorStop(0, '#F59228'); gr.addColorStop(0.5, '#1A1D24'); gr.addColorStop(1, '#2F6BFF'); g.fillStyle = gr; g.fillRect(x, ly - 4, 70, 8); x += 76;
  x += txt('≥+117.3', x, ly, '500 13px VWMono', '#6E9BFF'); txt(' M$ per point', x, ly, '500 13px VWMono', '#6B7280');
  g.restore();
}
function wallLine(w, a, grow) { if (a <= 0) return; const g = VW.g, col = VX.WALL[w.fam], y = Math.round(Y(w.p)) + 0.5, xr = CX1 - 178, xl = mix(xr, CX0D, grow); g.save(); g.globalAlpha = a;
  const gr = g.createLinearGradient(xl, 0, xr, 0); gr.addColorStop(0, VW.rgba(col, 0.05)); gr.addColorStop(1, VW.rgba(col, 0.9)); g.strokeStyle = gr; g.lineWidth = 2; g.shadowColor = VW.rgba(col, 0.8); g.shadowBlur = 8;
  g.beginPath(); g.moveTo(xl, y); g.lineTo(xr, y); g.stroke(); g.shadowBlur = 0; g.fillStyle = col; g.beginPath(); g.arc(xr + 6, y, 4.5, 0, 7); g.fill();
  g.shadowColor = 'rgba(0,0,0,0.95)'; g.shadowBlur = 6; txt(fmt(w.p, 1) + ' · ' + w.usd, xr + 16, y + 1, '700 15px VWMono', col); g.restore(); }
function printMark(pr, S, a, grow = 1) {
  if (a <= 0 || pr.i > S.k || (pr.i === S.k && S.f < 0.5)) return; const g = VW.g, x = X(pr.i, S), y = Y(pr.p); if (x < CX0D) return; g.save(); g.globalAlpha = a;
  g.fillStyle = '#FFFFFF'; g.shadowColor = 'rgba(255,255,255,0.6)'; g.shadowBlur = 6; g.fillRect(x - 18 * grow, y - 2.5, 36 * grow, 5); g.shadowBlur = 0;
  const s = pr.q, gold = pr.gold; g.font = '700 14px VWMono'; const tw = g.measureText(s).width + 14, left = pr.i >= 77, px = left ? x - 24 - tw : x + 24;
  if (gold) { g.fillStyle = VX.GOLD; g.save(); g.translate(left ? x - 17 : x + 17, y); g.rotate(Math.PI / 4); g.fillRect(-4, -4, 8, 8); g.restore(); }
  box(px, y - 11, tw, 22, gold ? VX.GOLD : '#E9EDF3', null, 4); txt(s, px + tw / 2, y + 1, '700 14px VWMono', gold ? '#1A1300' : '#0B1220', 'center'); g.restore(); }
function keyLevel(a) { if (a <= 0) return; const g = VW.g, y = Math.round(Y(KEYLEVEL.p)) + 0.5; g.save(); g.globalAlpha = a; g.strokeStyle = 'rgba(242,193,78,0.85)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(CX0D, y); g.lineTo(CX1, y); g.stroke();
  const s = `★★ ${KEYLEVEL.p.toFixed(2)}  ${KEYLEVEL.q} · ${KEYLEVEL.b} blocks`; g.font = '700 13px VWMono'; const tw = g.measureText(s).width + 20, x = CX0D + 6;
  g.fillStyle = '#14120A'; g.strokeStyle = VX.GOLD; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x, y - 12); g.lineTo(x + tw, y - 12); g.lineTo(x + tw + 9, y); g.lineTo(x + tw, y + 12); g.lineTo(x, y + 12); g.closePath(); g.fill(); g.stroke();
  txt(s, x + 9, y + 1, '700 13px VWMono', '#F5DE9A'); g.restore(); }
function cvdPane(S, a, y0, y1) {
  if (a <= 0) return; const g = VW.g; g.save(); g.globalAlpha = a; g.fillStyle = '#000'; g.fillRect(CX0D, y0, WIN.x1 - CX0D, y1 - y0); g.fillStyle = '#1A1D24'; g.fillRect(CX0D, y0, WIN.x1 - CX0D, 1);
  const pts = []; let cum = 0; for (let i = 0; i <= S.k; i++) { const b = barAt(i, S); if (!b) break; cum += b.d; pts.push([X(i, S), cum]); }
  const vals = pts.map(p => p[1]), mn = Math.min(...vals), mx = Math.max(...vals), yy = v => y1 - 12 - (v - mn) / (mx - mn || 1) * (y1 - y0 - 40);
  g.save(); g.beginPath(); g.rect(CX0D, y0, CX1 - CX0D, y1 - y0); g.clip(); g.beginPath(); pts.forEach(([x, v], j) => j ? g.lineTo(x, yy(v)) : g.moveTo(x, yy(v)));
  g.strokeStyle = '#2FB67C'; g.lineWidth = 2; g.stroke(); g.lineTo(pts[pts.length - 1][0], y1); g.lineTo(pts[0][0], y1); g.closePath(); g.fillStyle = 'rgba(47,182,124,0.16)'; g.fill(); g.restore();
  const v = cum / 1000; txt('CVD', CX0D + 12, y0 + 16, '700 13px VWMono', '#8A93A3'); txt((v >= 0 ? '+' : '') + v.toFixed(2) + 'K contracts', CX0D + 50, y0 + 16, '600 13px VWMono', '#2FB67C'); txt('×', CX0D + 238, y0 + 16, '600 14px VWMono', '#E2575F');
  box(CX1 + 4, yy(cum) - 11, WIN.x1 - CX1 - 10, 22, '#2FB67C', null, 3); txt((v >= 0 ? '+' : '') + v.toFixed(2) + 'K', (CX1 + WIN.x1) / 2, yy(cum) + 1, '700 13px VWMono', '#00140A', 'center');
  g.restore();
}
function darkHeader(t, S, cur) {
  const g = VW.g; g.fillStyle = DK.panel; g.fillRect(WIN.x0, HDR1, WIN.x1 - WIN.x0, HDR - HDR1); g.fillStyle = '#1A1D24'; g.fillRect(WIN.x0, HDR - 1, WIN.x1 - WIN.x0, 1);
  const L = '500 13px VWMono', F = '600 16px VWMono', B = '700 17px VWMono', lp = lastPrice(S), ch = (lp - PREV_CLOSE) / PREV_CLOSE * 100;
  const chip = (id, hl) => { const r = R[id]; box(r.x, r.y, r.w, r.h, hl ? '#1B1F28' : DK.chip, hl ? '#3A4252' : DK.chipB, 6); };
  const hov = id => { const r = R[id]; return cur.x > r.x && cur.x < r.x + r.w && cur.y > r.y && cur.y < r.y + r.h; };
  // row 1: wordmark, ticker, timeframe | guide, market intelligence
  const wm = VW.assets.wm, wh = 20, ww = wh * wm.width / wm.height; g.save(); g.globalCompositeOperation = 'lighter'; g.drawImage(wm, R.logo.x, R.logo.y + 15 - wh / 2, ww, wh); g.restore();
  g.fillStyle = DK.sep; g.fillRect(R.sep1.x, R.sep1.y + 4, 2, 22);
  chip('tick'); let x = R.tick.x + 12, y = R.tick.y + 15; g.fillStyle = '#2FB67C'; g.beginPath(); g.arc(x + 4, y, 4, 0, 7); g.fill(); x += 16;
  x += txt('ES ', x, y + 1, B, '#6E9BFF'); x += txt(fmt(lp), x, y + 1, B, DK.val) + 8;
  const cs = (ch >= 0 ? '+' : '') + ch.toFixed(2) + '%'; g.font = L; const cw = g.measureText(cs).width + 12; box(x, y - 10, cw, 20, ch >= 0 ? 'rgba(47,182,124,0.18)' : 'rgba(226,87,95,0.18)', null, 4); txt(cs, x + 6, y + 1, L, ch >= 0 ? '#2FB67C' : '#E2575F'); x += cw + 8; txt('▾', x, y + 1, L, DK.lab);
  chip('tf'); txt('1m', R.tf.x + R.tf.w / 2, R.tf.y + 16, B, DK.val, 'center');
  // row 2: DEALER group
  txt('DEALER', R.gDealer.x, R.gDealer.y + 16, L, DK.lab);
  const mapsOn = t >= E.gamma, ddOpen = t >= E.maps && t < E.gamma + 0.05;
  for (const [id, lab, val] of [['walls', 'WALLS ', 'Top 5'], ['metric', 'METRIC ', 'GEX'], ['expiry', 'EXPIRY ', 'All'], ['maps', 'MAPS ', mapsOn ? 'Gamma' : 'None']]) {
    chip(id, hov(id) || (id === 'maps' && ddOpen)); let xx = R[id].x + 11; const yy = R[id].y + 16; xx += txt(lab, xx, yy, L, id === 'walls' ? '#6E8BFF' : DK.lab); xx += txt(val, xx, yy, F, DK.val); txt(' ▾', xx, yy, L, DK.lab); }
  // row 3: ES LEVELS, ACTIVITY group
  txt('ACTIVITY', R.gAct.x, R.gAct.y + 16, L, DK.lab);
  const bpOn = t >= E.prints, cvdOn = t >= E.cvd;
  { const r = R.bp; box(r.x, r.y, r.w, r.h, bpOn ? 'rgba(242,193,78,0.12)' : 'rgba(242,193,78,0.04)', 'rgba(242,193,78,0.75)', 6, 1.4); toggle(r.x + 10, r.y + 15, bpOn, '#F2C14E');
    txt('BLOCK PRINTS', r.x + 48, r.y + 16, B, '#F5E6B8'); g.fillStyle = 'rgba(242,193,78,0.6)'; g.fillRect(r.x + r.w - 26, r.y + 7, 1, 16); txt('▾', r.x + r.w - 16, r.y + 16, L, '#F2C14E'); }
  for (const [id, lab, on] of [['cvd', 'CVD', cvdOn], ['cdi', 'CDI', false], ['flow', 'FLOW', false]]) { const r = R[id]; box(r.x, r.y, r.w, r.h, on ? '#121A33' : DK.chip, on ? '#2F4FA8' : DK.chipB, 6); toggle(r.x + 10, r.y + 15, on, '#2F6BFF'); txt(lab, r.x + 46, r.y + 16, B, DK.val); }
  // MAPS dropdown
  if (ddOpen) { const r = R.maps, items = ['None', 'Gamma', 'Charm', 'Vega', 'Volga', 'Delta'], k = eo(lin(t, E.maps, E.maps + 0.12)); g.save(); g.globalAlpha = k;
    const dx = r.x, dy = r.y + r.h + 4, w = 150; box(dx, dy, w, items.length * 34 + 8, '#14161B', '#2A2F38', 6); g.shadowBlur = 0;
    items.forEach((it, j) => { const iy = dy + 4 + j * 34, h = cur.x > dx && cur.x < dx + w && cur.y > iy && cur.y < iy + 34; if (h) box(dx + 4, iy, w - 8, 34, '#1F2A44', null, 4);
      txt(it, dx + 16, iy + 18, '600 16px VWMono', it === 'None' ? '#6E9BFF' : DK.val); R['dd_' + it] = { x: dx, y: iy, w, h: 34 }; }); g.restore(); }
}
function tooltip(t, a) { // wall hover label, same text structure as the real terminal tooltip
  if (a <= 0) return; const g = VW.g, w = WALLS[1], col = VX.WALL[w.fam], x = CX0D + 20, y = Y(w.p) + 44, W = 486, H = 196; g.save(); g.globalAlpha = a;
  box(x, y, W, H, 'rgba(12,14,19,0.97)', '#2A2F38', 8); g.fillStyle = col; g.fillRect(x, y + 8, 3, H - 16);
  txt('→ ES ' + fmt(w.p, 1), x + 18, y + 24, '700 17px VWMono', DK.val); txt('GEX', x + W - 18, y + 24, '600 14px VWMono', DK.lab, 'right');
  txt('Call wall · short γ', x + 18, y + 54, '700 17px VWMono', col);
  txt('Accelerative — breakouts above can run fast', x + 18, y + 80, '500 15px VWMono', '#C9D1DD');
  txt('Net', x + 18, y + 110, '600 15px VWMono', DK.lab); txt(w.usd, x + 70, y + 110, '700 17px VWMono', DK.val); txt('short γ', x + 170, y + 110, '600 15px VWMono', col);
  const foot = ['Values are dealer P&L exposure per 1-point', 'SPX move (ES tracks SPX with carry offset).', 'Sum across all expirations.'];
  foot.forEach((s, j) => txt(s, x + 18, y + 140 + j * 18, '500 13px VWMono', '#6B7280')); g.restore();
}
function drawDark(t, S, cur) {
  const g = VW.g, cvdK = eio(lin(t, E.cvd, E.cvd + 0.32)), ybot = mix(1456, 1370, cvdK); // chart bottom (CVD pane opens under it)
  g.save(); g.beginPath(); g.rect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0); g.clip(); g.fillStyle = DK.bg; g.fillRect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0);
  g.save(); g.beginPath(); g.rect(CX0D, HDR, CX1 - CX0D, ybot - HDR); g.clip();
  g.fillStyle = DK.grid; for (let i = 0; i <= 92; i++) if ((10 * 60 + 2 + i) % 5 === 0) { const x = Math.round(X(i, S)); g.fillRect(x, HDR, 1, ybot - HDR); }
  gammaMap(S, eo(lin(t, E.gamma, E.gamma + 0.45)) * 0.95, ybot);
  candles(S, 'dark', CX0D, ybot);
  // the trader's own levels stay on screen
  for (const [p, lab] of [[SH, 'YOUR LEVEL'], [SL, 'YOUR LEVEL']]) { hline(p, '#7FA2FF', 2, [8, 6], CX0D, CX1, 0.9); const y = Y(p); box(CX0D + 8, y - 22, 98, 18, 'rgba(41,98,255,0.9)', null, 3); txt(lab, CX0D + 57, y - 12, '700 12px VWMono', '#FFFFFF', 'center'); }
  const wk = (j) => eo(lin(t, E.walls + j * 0.12, E.walls + j * 0.12 + 0.6)); WALLS.forEach((w, j) => wallLine(w, Math.min(1, wk(j) * 1.6), wk(j)));
  const bpk = eo(lin(t, E.prints, E.prints + 0.35)); keyLevel(bpk); PRINTS.forEach(pr => { const born = RP0 + (pr.i - 60 + 0.5) * RPB; printMark(pr, S, bpk * (pr.i >= 60 && t >= E.prints ? eo(lin(t, Math.max(E.prints, born), Math.max(E.prints, born) + 0.25)) : 1), pr.i >= 60 && born > E.prints ? eo(lin(t, born, born + 0.25)) : 1); });
  crosshair(cur, 'dark', CX0D, HDR, ybot, t > E.tip - 0.1 ? 0 : 1);
  g.restore();
  // price axis
  g.fillStyle = '#000'; g.fillRect(CX1, HDR, WIN.x1 - CX1, WIN.y1 - HDR);
  g.save(); g.beginPath(); g.rect(CX1, HDR, WIN.x1 - CX1, ybot - HDR); g.clip(); for (let p = 7716; p <= 7752; p += 4) txt(fmt(p), (CX1 + WIN.x1) / 2, Y(p), '500 14px VWMono', DK.axis, 'center');
  const lp = lastPrice(S); axisTag(lp, '#E9EDF3', '#0B1220', 1, '700 14px VWMono'); crosshair(cur, 'dark', CX0D, HDR, ybot, t > E.tip - 0.1 ? 0 : 1); g.restore();
  cvdPane(S, cvdK, ybot + 4, 1452);
  timeAxis(S, CX0D, 1472, 'dark'); txt('ET', WIN.x1 - 30, 1472, '500 13px VWMono', DK.lab, 'center');
  tooltip(t, eo(lin(t, E.tip, E.tip + 0.18)));
  darkHeader(t, S, cur);
  g.restore();
}

// ---------- frame ----------
const OVER = [ [0.0, 'YOU DRAW THE ', 'LEVELS.'], [4.6 - SHF, 'SO DOES ', 'EVERYONE', ' ELSE.'], [10.1 - SHF, 'BUT WHAT’S ', 'BEHIND', ' THE LEVELS?'],
  [12.35 - SHF, 'SEE THE ', 'POSITIONING.'], [18.45 - SHF, 'TRADE WITH ', 'INSTITUTIONAL', ' CONTEXT.'] ];
function overlay(t) {
  const g = VW.g; let j = -1; OVER.forEach((o, q) => { if (t >= o[0]) j = q; }); if (j < 0 || t > T_END) return;
  const o = OVER[j], k = j === 0 ? 1 : eo(lin(t, o[0], o[0] + 0.22)), parts = o.slice(1); g.save(); g.globalAlpha = k * (1 - seg(t, T_END - 0.2, T_END)); g.font = '700 60px VWSans'; g.letterSpacing = '1px';
  // wrap into max two lines inside the safe width
  const words = []; parts.forEach((p, q) => p.split(/(?<= )/).forEach(w => w && words.push([w, q === 1])));
  const lines = [[]]; let lw = 0; words.forEach(w => { const ww = g.measureText(w[0]).width; if (lw + ww > 830 && lines[lines.length - 1].length) { lines.push([]); lw = 0; } lines[lines.length - 1].push(w); lw += ww; });
  if (lines.length === 2) { const all = lines.flat(), wd = w => g.measureText(w[0]).width; let best = null;
    for (let q = 1; q < all.length; q++) { const a = all.slice(0, q).reduce((p, w) => p + wd(w), 0), b = all.slice(q).reduce((p, w) => p + wd(w), 0), m = Math.max(a, b); if (a <= 830 && b <= 830 && (!best || m < best[0])) best = [m, q]; }
    if (best) { lines[0] = all.slice(0, best[1]); lines[1] = all.slice(best[1]); } }
  const lh = 70, y0 = 420 - (lines.length - 1) * lh / 2 + (1 - k) * 10; g.textBaseline = 'middle';
  lines.forEach((ln, li) => { const tw = ln.reduce((s, w) => s + g.measureText(w[0].trimEnd()).width + (w[0].endsWith(' ') ? g.measureText(' ').width : 0), 0) - (ln[ln.length - 1][0].endsWith(' ') ? g.measureText(' ').width : 0);
    let x = VW.SAFE.cx - tw / 2; ln.forEach(w => { g.fillStyle = w[1] ? '#6E9BFF' : '#F2F5FA'; g.textAlign = 'left'; g.fillText(w[0], x, y0 + li * lh); x += g.measureText(w[0]).width; }); });
  g.restore();
}
function disclosure(t) { const g = VW.g, a = 1 - seg(t, T_END - 0.2, T_END); if (a <= 0) return; g.save(); g.globalAlpha = a;
  txt('Illustrative replay. Simulated data.', VW.SAFE.cx, 1514, '500 17px VWMono', '#7F8AA0', 'center');
  const d2 = seg(t, E.walls, E.walls + 0.4); if (d2 > 0) { g.globalAlpha = a * d2; txt('Dealer Walls: modeled options-derived positioning.', VW.SAFE.cx, 1539, '500 17px VWMono', '#7F8AA0', 'center'); } g.restore(); }
// approved Volwick ending (Absorption V2, confirmed by Power 30 Oct): the price line folds into the V, wordmark,
// TRADE WITH INSTITUTIONAL CONTEXT. typed in mono with the blue cursor, DISCOVER VOLWICK →, one disclaimer line. Nothing else.
const LSP = 1.7;
function endCard(t) {
  if (t <= T_END) return; const g = VW.g, S = state(T_END), pts = [];
  for (let i = Math.max(0, S.k - 26); i <= S.k; i++) { const b = barAt(i, S); if (b) pts.push([X(i, S), Y(b.c)]); }
  VW.logoForm((t - T_END) * LSP, pts, { noUrl: true, dy: -20, tagY: 1318, tagSize: 32, tagSpacing: 5,
    tagline: [['TRADE', VW.COL.ink], ['WITH', VW.COL.ink], ['INSTITUTIONAL', VW.COL.blue], ['CONTEXT.', VW.COL.ink]] });
  const dv = T_END + 3.45 / LSP, k = eo(lin(t, dv, dv + 0.3));
  if (k > 0) { g.save(); g.globalAlpha = k; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '700 44px VWMono'; g.letterSpacing = '5px';
    g.fillStyle = VW.COL.blue; g.shadowColor = 'rgba(90,140,255,0.8)'; g.shadowBlur = 20; g.fillText('DISCOVER VOLWICK →', 543, 1410 + (1 - k) * 10); g.restore(); }
  const kd = eo(lin(t, dv + 0.3, dv + 0.7));
  if (kd > 0) { g.save(); g.globalAlpha = kd; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '600 29px VWMono'; g.fillStyle = VW.COL.ink2; g.fillText('Simulated data. Not investment advice.', 540, 1496); g.restore(); }
}
function render(t) {
  const g = VW.g, S = state(t); g.save(); g.fillStyle = '#040913'; g.fillRect(0, 0, 1080, 1920);
  const bg = g.createLinearGradient(0, 0, 0, 1920); bg.addColorStop(0, '#060C1A'); bg.addColorStop(1, '#03060D'); g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  let c = cursorAt(t); const jt = jitter(t); c = { x: c.x + jt.x, y: c.y + jt.y };
  // window frame
  g.save(); g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 40; box(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0, '#000', null, 12); g.restore();
  const xf = eio(lin(t, T_XF0, T_XF1));
  NOCROSS = t >= E.maps && t < E.gamma + 0.05 && c.x > R.maps.x && c.x < R.maps.x + 150 && c.y < R.maps.y + 260;
  g.save(); VW.roundRect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0, 12); g.clip();
  if (xf < 1) drawLight(t, S, c);
  if (xf > 0) { g.globalAlpha = xf; drawDark(t, S, c); g.globalAlpha = 1; }
  g.restore();
  box(WIN.x0 + 0.5, WIN.y0 + 0.5, WIN.x1 - WIN.x0 - 1, WIN.y1 - WIN.y0 - 1, null, xf < 0.5 ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.10)', 12);
  // cursor: arrow on UI, cross on the chart (like charting software)
  const overDD = t >= E.maps && t < E.gamma + 0.05 && c.x > R.maps.x && c.x < R.maps.x + 150 && c.y < R.maps.y + 260;
  NOCROSS = overDD;
  const inChart = !overDD && c.x > (xf < 0.5 ? CX0L : CX0D) && c.x < CX1 && c.y > HDR && c.y < 1396 && !(t >= E.tip - 0.1 && xf > 0.5);
  if (t < T_END + 0.1) { const pr = press(t), light = xf < 0.5; if (inChart) { g.save(); g.strokeStyle = light ? '#131722' : '#FFFFFF'; g.lineWidth = 2.5; g.shadowColor = light ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)'; g.shadowBlur = 4;
      g.beginPath(); g.moveTo(c.x - 14, c.y); g.lineTo(c.x + 14, c.y); g.moveTo(c.x, c.y - 14); g.lineTo(c.x, c.y + 14); g.stroke(); if (pr > 0) { g.fillStyle = `rgba(47,107,255,${0.3 * pr})`; g.beginPath(); g.arc(c.x, c.y, 10 + 14 * pr, 0, 7); g.fill(); } g.restore(); }
    else VX.cursor(c.x, c.y, 1, light, pr); }
  VW.logoTL(1 - seg(t, T_END, T_END + 0.25), '', 46, 24, true);
  overlay(t); disclosure(t); endCard(t);
  g.restore();
}

window.READY = (async () => {
  D = await (await fetch('data.json')).json(); BARS = D.bars; SH = D.SH; SL = D.SL;
  await VW.loadFonts(); await VW.loadBrand(); layoutHeader();
  const S0 = { s: 59, k: 60, f: 0, live: false };
  const pH = { x: X(16, S0), y: Y(SH) }, pL = { x: X(34, S0), y: Y(SL) }, tool = { x: 118, y: 764 }, play = { x: 316, y: 1457 };
  const S10 = state(10.15), mp = ctr('maps'), bp = { x: R.bp.x + 26, y: R.bp.y + 15 }, cv = { x: R.cvd.x + 26, y: R.cvd.y + 15 };
  const gm = { x: R.maps.x + 60, y: R.maps.y + R.maps.h + 4 + 4 + 34 + 17 };
  const wallPt = { x: 622, y: Y(7746.5) };
  const KF_INTRO = HK ? [ [0, pH.x, pH.y], [0.38, pH.x + 1, pH.y], [0.6, pH.x + 2, pH.y + 1], [1.0, tool.x, tool.y, 0.12], [1.15, tool.x + 1, tool.y],
      [1.88, pL.x, pL.y, 0.08], [2.05, pL.x + 1, pL.y], [2.78, play.x, play.y, -0.12] ]
    : [ [0, 560, 1120], [0.25, 556, 1112], [0.86, tool.x, tool.y, 0.10], [1.0, tool.x + 1, tool.y],
      [1.78, pH.x, pH.y, -0.10], [1.95, pH.x + 2, pH.y + 1], [2.36, tool.x + 1, tool.y + 1, 0.12], [2.5, tool.x, tool.y],
      [3.38, pL.x, pL.y, 0.08], [3.55, pL.x + 1, pL.y], [4.24, play.x, play.y, -0.12] ];
  const KF_REST = [ [4.6, play.x + 3, play.y - 2],
    [6.2, 420, 1330, 0.1], [8.6, 560, 1080, -0.08], [10.08, 590, Y(SH), 0.1], [11.3, 600, Y(SH) + 1],
    [12.0, 640, 1000, 0.1], [13.14, mp.x, mp.y, -0.12], [13.3, mp.x + 1, mp.y], [13.66, gm.x, gm.y, 0.05], [13.8, gm.x, gm.y],
    [14.56, bp.x, bp.y, 0.1], [14.75, bp.x + 1, bp.y], [15.36, cv.x, cv.y, -0.06], [15.6, cv.x, cv.y + 1],
    [16.8, 520, 1040, 0.12], [18.08, wallPt.x, wallPt.y, -0.1], [20.9, wallPt.x + 4, wallPt.y - 1] ].map(k => [k[0] - SHF, ...k.slice(1)]);
  KF = [...KF_INTRO, ...KF_REST];
  window.render = render; render(0);
  return { total: TOTAL, events: { ...E, clicks: CLICKS, xf0: T_XF0, end: T_END, logo0: T_END, rp0: RP0, rpb: RPB } };
})();
