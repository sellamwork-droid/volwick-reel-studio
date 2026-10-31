// V0006 · THE BAR (T4, 31 Oct 2026), from V0001 / vx_drop2 (CREATIVE 06B). Hook: a pole vaulter goes for the bar and drops back (match cut on the fall),
// white TradingView-like chart where the breakout over the trader's resistance fails, then Volwick: a long-γ call wall two points over the line,
// the push stalls one tick under it and drops back; the pullback holds over the long-γ put wall.
// VX · THE DROP (CREATIVE 06, 30 Oct 2026). Visual Hook Engineering brief: the hook is a physical principle inside the chart.
// Opening A (falling object -> collision): two big red candles accelerate into the support the trader drew, cursor on the line.
// Reveal by contrast: the cursor drags a divider across the same chart and Volwick appears behind it (walls, then Block Prints).
// Simulated ES session (gen_data.py), no real market data. Every frame is a pure function of time.
const { seg, lin, eo, eio, mix, clamp } = VW;
const TOTAL = 13.7;
let D, BARS, SUP;
// ---------- geometry ----------
// logo position test (Power 31 Oct 03:49): ?logo=tl (old, top left) · top (centered above) · bottom (centered under the chart) · none
const LOGO = new URLSearchParams(location.search).get('logo') || 'none';
// layout test (Power 31 Oct, voice: spaces not well managed): ?lay=A compact one-line title, bigger chart · B two-line title closer, bigger chart · C like A, window runs past the safe zone (only grid, volume, time axis down there)
const LAY = new URLSearchParams(location.search).get('lay') || 'A';
const LT_ = { '': { ts: 58, lh: 62, y2: 347, y1: 382, sub: 457, w0: 498, w1: 1548, one: false }, A: { ts: 44, lh: 50, y2: 300, y1: 300, sub: 344, w0: 372, w1: 1550, one: true },
  B: { ts: 54, lh: 58, y2: 294, y1: 323, sub: 398, w0: 426, w1: 1550, one: false }, C: { ts: 44, lh: 50, y2: 300, y1: 300, sub: 344, w0: 372, w1: 1700, one: true } }[LAY];
const WIN = { x0: 96, x1: 940, y0: LT_.w0, y1: LOGO === 'bottom' ? LT_.w1 - 74 : LT_.w1 };   // fills the safe zone (rule 30 Oct 15:44)
const HDR1 = WIN.y0, HDR = WIN.y0 + 120, LB = WIN.y1 - 98, DB = WIN.y1 - 34, DBS = Math.min(DB, 1516);   // light chart bottom (replay bar under it), dark chart bottom
const CX0L = 140, CX0D = 96, CX1 = 858;
const PTOP0 = 7745.0, PX0 = LAY ? (DBS - HDR) / 37.3 : 24.0; let PTOP = PTOP0, PX = PX0;   // PTOP/PX/SP change with the chart zoom (setView)   // tighter scale: the walls fill the window
const Y = p => HDR + (PTOP - p) * PX;
const SP0 = 12, XR0 = 790; let SP = SP0, XR = XR0;   // XR moves left during the absorption so the wall point has room on its right (chart scroll, like a trading platform)
const T_END = 9.6;
// V0006 v3 (Power 31 Oct 04:42, voice): faster and more impactful, cut on a 125 BPM grid (beat 0.48 s). Chart time 0 = video 0.96 s (hook = 2 beats).
// rip up through the line → rejection → fall (light chart) · fast divider · rewind · walls slam in on 8ths · same rip into the call wall, zoom and impact · fall · prints · tooltip · outro.
const VAR = 3, BT = 0.48;
const SPAIRS = [[0, 52.0], [0.96, 56.2], [1.92, 57.7], [2.88, 58.1], [3.36, 51.6], [3.84, 51.9], [4.80, 56.2], [5.76, 57.7], [T_END, 59.8]];   // s = 56.2: bar 57 forming, at its high
const E = { sel: -0.3, top1: 0.96, contact: 1.12, handle: 2.0, grab: 2.4, drop: 2.88, rew: 2.88, walls: 3.36, top2: 4.80, prints: 3.84, tip: 6.24, out: 6.72, end: T_END };
const WALLS = [ { p: 7741.5, fam: 'callS', usd: '−$6.4M' }, { p: 7733.5, fam: 'callL', usd: '+$12.6M' }, { p: 7727.5, fam: 'callL', usd: '+$3.9M' },
  { p: 7722.5, fam: 'putL', usd: '+$9.7M' }, { p: 7712.5, fam: 'putS', usd: '−$8.8M' } ];
const TIPW = 1;   // the wall the tooltip opens on
const PRINTS = [ { i: 20, p: 7731.25, q: '740', gold: true }, { i: 38, p: 7725.0, q: '410' }, { i: 57, p: 7733.0, q: '1,250 ×2', gold: true, left: true }, { i: 59, p: 7723.5, q: '880', gold: true, left: true }, { i: 66, p: 7724.5, q: '460' } ];
const PREV_CLOSE = 7718.25;

// ---------- replay state ----------
function sAt(t) { t = Math.min(t, T_END); for (let q = 0; q < SPAIRS.length - 1; q++) { const [a, sa] = SPAIRS[q], [b, sb] = SPAIRS[q + 1]; if (t <= b) return sa + (sb - sa) * clamp((t - a) / (b - a), 0, 1); } return SPAIRS[SPAIRS.length - 1][1]; }
function state(t) { const s = sAt(t), k = Math.floor(s) + 1; return { s, k, f: s - Math.floor(s), live: true }; }
const X = (i, S) => XR - (S.s - i) * SP;
function barAt(i, S) { // completed bar, or the forming one built from its tick path
  const b = BARS[i]; if (i < S.k) return b; if (i > S.k || !S.live) return null;
  const n = b.path.length - 1, u = S.f * n, j = Math.floor(u); let h = b.o, l = b.o; for (let q = 0; q <= Math.min(j, n); q++) { h = Math.max(h, b.path[q]); l = Math.min(l, b.path[q]); }
  const c = b.path[Math.min(j, n)]; return { o: b.o, h: Math.max(h, c), l: Math.min(l, c), c, v: Math.round(b.v * S.f), d: Math.round(b.d * S.f) };
}
function lastPrice(S) { const b = barAt(S.k, S); return b ? b.c : BARS[S.k - 1].c; }
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
const CLICKS = [E.grab, E.drop, E.prints];
const press = t => CLICKS.reduce((p, c) => Math.max(p, t >= c - 0.03 ? Math.exp(-(t - c + 0.03) * 9) * (t < c + 0.45 ? 1 : 0) : 0), 0);

// ---------- header layout (real Volwick layer row, wrapped to fit the phone) ----------
const R = {};
function chipW(g, parts) { let w = 0; parts.forEach(([txt, font]) => { g.font = font; w += g.measureText(txt).width; }); return w; }
function layoutHeader() {
  const g = VW.g, F = '600 16px VWMono', L = '500 13px VWMono', B = '700 17px VWMono';
  const row = (y, items, x0) => { let x = x0; items.forEach(it => { const w = it.w || (chipW(g, it.parts) + (it.pad ?? 22)); R[it.id] = { x, y, w, h: 30, ...it }; x += w + (it.gap ?? 8); }); };
  g.save(); g.letterSpacing = '0px';
  row(HDR1 + 5, [ { id: 'logo', w: 112, gap: 14 }, { id: 'sep1', w: 2, gap: 12 }, { id: 'tick', parts: [['● ', F], ['ES ', B], ['7,712.75', B], ['  +0.26%  ', L], ['▾', L]], pad: 26 }, { id: 'tf', parts: [['1m', B]], pad: 26 } ], WIN.x0 + 12);
  row(HDR1 + 45, [ { id: 'gDealer', parts: [['DEALER', L]], pad: 4, gap: 8 }, { id: 'walls', parts: [['WALLS ', L], ['Top 5', F], [' ▾', L]] }, { id: 'metric', parts: [['METRIC ', L], ['GEX', F], [' ▾', L]] },
    { id: 'expiry', parts: [['EXPIRY ', L], ['All', F], [' ▾', L]] }, { id: 'maps', parts: [['MAPS ', L], ['None', F], [' ▾', L]] } ], WIN.x0 + 12);
  // row 3 starts with ACTIVITY (Power 30 Oct 17:00: no ES LEVELS, no GUIDE, no MARKET INTELLIGENCE in the videos)
  row(HDR1 + 85, [ { id: 'gAct', parts: [['ACTIVITY', L]], pad: 2, gap: 10 },
    { id: 'bp', parts: [['BLOCK PRINTS', B], ['  ▾', L]], pad: 60, gap: 6 }, { id: 'cvd', parts: [['CVD', B]], pad: 54, gap: 6 }, { id: 'cdi', parts: [['CDI', B]], pad: 54, gap: 6 }, { id: 'flow', parts: [['FLOW', B]], pad: 54 } ], WIN.x0 + 12);
  { const r = R.flow, over = r.x + r.w - (WIN.x1 - 10); if (over > 0) console.log('row3 overflow', over); }
  const spread = ids => { const last = R[ids[ids.length - 1]], extra = (WIN.x1 - 12) - (last.x + last.w); if (extra <= 0) return; const per = extra / ids.length; ids.forEach((id, j) => { R[id].x += per * j; R[id].w += per; }); };
  if (HDRV === 2) { spread(['walls', 'metric', 'expiry', 'maps']); spread(['bp', 'cvd', 'cdi', 'flow']); R.tf.x = WIN.x1 - 12 - R.tf.w; }
  if (HDRV === 1) { const x0 = WIN.x0 + 12, x1 = WIN.x1 - 12, gap = 12, w = (x1 - x0 - gap) / 2;
    R.tf.x = x1 - R.tf.w; R.tick.x = R.logo.x + R.logo.w + 26 + ((R.tf.x - 12) - (R.logo.x + R.logo.w + 26) - R.tick.w) / 2;
    R.walls = { ...R.walls, x: x0, y: HDR1 + 54, w, h: 50 }; R.bp = { ...R.bp, x: x0 + w + gap, y: HDR1 + 54, w, h: 50 }; }
  // right side of row 1
  g.restore();
}
const ctr = id => ({ x: R[id].x + R[id].w / 2, y: R[id].y + R[id].h / 2 });

// ---------- drawing helpers ----------
function box(x, y, w, h, fill, stroke, r = 6, lw = 1) { const g = VW.g; VW.roundRect(x, y, w, h, r); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); } }
function txt(s, x, y, font, col, align = 'left', base = 'middle') { const g = VW.g; g.font = font; g.fillStyle = col; g.textAlign = align; g.textBaseline = base; g.fillText(s, x, y); return g.measureText(s).width; }
function toggle(x, y, on, col) { const g = VW.g; box(x, y - 8, 30, 16, on ? col : '#1E2229', on ? null : '#2A2F38', 8); g.fillStyle = on ? '#FFFFFF' : '#5B6270'; g.beginPath(); g.arc(on ? x + 22 : x + 8, y, 5.5, 0, 7); g.fill(); }

// ---------- LIGHT (generic charting software) ----------
// Power 31 Oct 16:43: chart frontal, only the effects in 3D; show the volume absorbed at the call wall and the price turning back down
const hr = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
function ring3d(x, y, r, tilt, rot, col, a, lw, dash) { const g = VW.g; if (a <= 0 || r <= 0) return; g.save(); g.globalAlpha = a; g.translate(x, y); g.rotate(rot);
  g.strokeStyle = col; g.lineWidth = lw; g.shadowColor = col; g.shadowBlur = 14; if (dash) { g.setLineDash(dash); g.lineDashOffset = -r * 3; }
  g.beginPath(); g.ellipse(0, 0, r, r * tilt, 0, 0, Math.PI * 2); g.stroke(); g.restore(); }
// Power 31 Oct 16:57: the volume comes from above and goes down (no red arrows). ?abs=1..5 = five animations to choose from
const ABS = +(new URLSearchParams(location.search).get('abs') || 1);
function fallIn(t, wx, wy, T0, T1, n0, N) {   // volume falling from the top of the chart into the wall point, with depth
  const g = VW.g, gold = VX.GOLD, cyan = '#7FD8FF';
  for (let n = n0; n < n0 + N; n++) { const z = hr(n + 307), t0 = T0 + hr(n) * (T1 - T0 - 0.25), dur = 0.22 + 0.22 * z, u = (t - t0) / dur; if (u <= 0 || u > 1.12) continue;
    const sx = wx + (hr(n + 101) - 0.5) * 520 * (1 + 0.7 * z), sy = HDR - 30 - 80 * hr(n + 203), q1 = Math.min(u, 1) ** 2, q0 = Math.max(0, q1 - 0.22 - 0.12 * (1 - z));
    const P = q => [mix(sx, wx, q), mix(sy, wy, q)], [x0, y0] = P(q0), [x1, y1] = P(q1), sz = 1.2 + 4.5 * (1 - z), al = (0.35 + 0.65 * (1 - z)) * (u > 1 ? 1 - (u - 1) / 0.12 : 1);
    const col = q1 > 0.6 ? gold : cyan, gr = g.createLinearGradient(x0, y0, x1, y1); gr.addColorStop(0, VW.rgba(col, 0)); gr.addColorStop(1, VW.rgba(col, al));
    g.strokeStyle = gr; g.lineWidth = sz; g.lineCap = 'round'; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); g.fillStyle = VW.rgba('#FFFFFF', al); g.beginPath(); g.arc(x1, y1, sz * 0.7, 0, 7); g.fill(); }
}
function coreRings(t, wx, wy, T0, T1, HIT) { const g = VW.g, gold = VX.GOLD, fill = eo(lin(t, T0 + 0.1, T1)), fade = 1 - seg(t, 5.6, 6.1), core = (16 + 30 * fill) * (1 + 0.25 * Math.exp(-Math.max(0, t - HIT) * 9) * (t > HIT ? 1 : 0)); if (fade <= 0) return;
  const rg = g.createRadialGradient(wx, wy, 0, wx, wy, core * 2.6); rg.addColorStop(0, VW.rgba('#FFFFFF', 0.95 * fade)); rg.addColorStop(0.25, VW.rgba(gold, 0.75 * fade)); rg.addColorStop(1, VW.rgba(gold, 0)); g.fillStyle = rg; g.beginPath(); g.arc(wx, wy, core * 2.6, 0, 7); g.fill();
  ring3d(wx, wy, core * 1.9, 0.28, 0.18 + t * 0.6, gold, 0.85 * fade, 3, [18, 10]); ring3d(wx, wy, core * 1.35, 0.42, -0.5 - t * 0.9, '#7FD8FF', 0.7 * fade, 2.5, [10, 8]); }
function shock(t, wx, wy, list) { list.forEach(([th, m]) => { const d = t - th; if (d < 0 || d > 0.7) return; const e = eo(d / 0.7); ring3d(wx, wy, 30 + 520 * e, 0.16, 0, VX.GOLD, m * (1 - e), 5 * (1 - e) + 1); ring3d(wx, wy, 20 + 300 * e, 0.22, 0, '#FFFFFF', 0.7 * m * (1 - e), 2); }); }
function cube(x, y, s, a, lab) { const g = VW.g, d = s * 0.45; g.save(); g.globalAlpha = a;   // gold block in 3D: front, top and side faces
  g.fillStyle = '#F7D774'; g.beginPath(); g.moveTo(x - s / 2, y - s); g.lineTo(x - s / 2 + d, y - s - d * 0.7); g.lineTo(x + s / 2 + d, y - s - d * 0.7); g.lineTo(x + s / 2, y - s); g.closePath(); g.fill();
  g.fillStyle = '#9C7A1E'; g.beginPath(); g.moveTo(x + s / 2, y - s); g.lineTo(x + s / 2 + d, y - s - d * 0.7); g.lineTo(x + s / 2 + d, y - d * 0.7); g.lineTo(x + s / 2, y); g.closePath(); g.fill();
  const gr = g.createLinearGradient(0, y - s, 0, y); gr.addColorStop(0, '#E9BE45'); gr.addColorStop(1, '#C39222'); g.fillStyle = gr; g.shadowColor = VX.GOLD; g.shadowBlur = 20; g.fillRect(x - s / 2, y - s, s, s); g.shadowBlur = 0;
  if (lab) txt(lab, x, y - s / 2, '800 15px VWMono', '#1A1300', 'center'); g.restore(); }
function absorbFx(t, S) {
  const T0 = 4.3, T1 = 4.85, HIT = E.top2; if (t < T0 || t > 6.4) return; const g = VW.g, wx = X(57, S), wy = Y(7733.25), gold = VX.GOLD;
  const hx = X(S.k, S), hy = Y(lastPrice(S)), down = seg(t, 4.95, 5.1) * (1 - seg(t, 5.8, 6.2));
  g.save(); g.globalCompositeOperation = 'lighter';
  if (ABS === 1) {   // RAIN: volume rains from above into the wall, then keeps raining down with the price
    fallIn(t, wx, wy, T0, T1 + 0.1, 0, 90); coreRings(t, wx, wy, T0, T1, HIT); shock(t, wx, wy, [[HIT, 1]]);
    if (down > 0) for (let n = 0; n < 70; n++) { const z = hr(n + 600), t0 = 4.95 + hr(n + 650) * 0.8, u = (t - t0) / (0.35 + 0.3 * z); if (u <= 0 || u > 1) continue;
      const S0 = state(t0), x = X(S0.k, S) + (hr(n + 700) - 0.5) * 70 * (1 + z), y0 = Y(lastPrice(S0)) - 10, y = y0 + u * u * (220 + 200 * (1 - z)), sz = 1 + 3.5 * (1 - z), al = (1 - u) * down;
      const gr = g.createLinearGradient(0, y - 40, 0, y); gr.addColorStop(0, 'rgba(226,87,95,0)'); gr.addColorStop(1, `rgba(255,170,120,${al})`); g.strokeStyle = gr; g.lineWidth = sz; g.beginPath(); g.moveTo(x, y - 30 - 30 * (1 - z)); g.lineTo(x, y); g.stroke(); } }
  if (ABS === 2) {   // PRESS: the volume falls into the wall, then the wall comes down on the price like a 3D slab
    fallIn(t, wx, wy, T0, T1 + 0.1, 0, 70); shock(t, wx, wy, [[HIT, 1]]);
    const k = seg(t, HIT - 0.05, HIT + 0.1) * (1 - seg(t, 5.8, 6.2)); if (k > 0) { const w = 190, d = 40, top = wy, bot = Math.max(wy + 4, hy - 6), x0 = hx - w / 2 - 20;
      const fr = g.createLinearGradient(0, top, 0, bot); fr.addColorStop(0, VW.rgba(gold, 0.55 * k)); fr.addColorStop(1, VW.rgba('#E2575F', 0.12 * k)); g.fillStyle = fr; g.fillRect(x0, top, w, bot - top);
      g.fillStyle = VW.rgba(gold, 0.35 * k); g.beginPath(); g.moveTo(x0, top); g.lineTo(x0 + d, top - d * 0.6); g.lineTo(x0 + w + d, top - d * 0.6); g.lineTo(x0 + w, top); g.closePath(); g.fill();
      g.fillStyle = VW.rgba(gold, 0.18 * k); g.beginPath(); g.moveTo(x0 + w, top); g.lineTo(x0 + w + d, top - d * 0.6); g.lineTo(x0 + w + d, bot - d * 0.6); g.lineTo(x0 + w, bot); g.closePath(); g.fill();
      g.strokeStyle = VW.rgba('#FFF2C4', 0.9 * k); g.lineWidth = 3; g.beginPath(); g.moveTo(x0, bot); g.lineTo(x0 + w, bot); g.stroke();
      for (let j = 0; j < 6; j++) { const yy = mix(top, bot, ((t * 2.2 + j / 6) % 1)); g.strokeStyle = VW.rgba('#FFFFFF', 0.25 * k); g.lineWidth = 1.5; g.beginPath(); g.moveTo(x0 + 10, yy); g.lineTo(x0 + w - 10, yy); g.stroke(); } } }
  if (ABS === 3) {   // WATERFALL: absorbed at the wall, then it pours down into the volume bars at the bottom
    fallIn(t, wx, wy, T0, T1 + 0.1, 0, 80); coreRings(t, wx, wy, T0, T1, HIT); shock(t, wx, wy, [[HIT, 1]]);
    if (down > 0) { for (let n = 0; n < 80; n++) { const z = hr(n + 800), t0 = 4.9 + hr(n + 850) * 0.85, u = (t - t0) / (0.3 + 0.25 * z); if (u <= 0 || u > 1.1) continue;
        const i = 57 + (n % 2), tx = X(i, S) + (hr(n + 900) - 0.5) * 8, cx = mix(wx, tx, 0.5) + (hr(n + 950) - 0.5) * 120, q1 = Math.min(u, 1) ** 1.6, q0 = Math.max(0, q1 - 0.2);
        const P = q => { const a = (1 - q) * (1 - q), b = 2 * (1 - q) * q, c = q * q; return [a * wx + b * cx + c * tx, a * wy + b * mix(wy, DB, 0.4) + c * (DB - 6)]; }, [x0, y0] = P(q0), [x1, y1] = P(q1), al = (0.4 + 0.6 * (1 - z)) * down;
        const gr = g.createLinearGradient(x0, y0, x1, y1); gr.addColorStop(0, VW.rgba(gold, 0)); gr.addColorStop(1, VW.rgba('#FFE7A0', al)); g.strokeStyle = gr; g.lineWidth = 1.2 + 3.5 * (1 - z); g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); }
      for (let i = 57; i <= 58; i++) { const x = X(i, S), w = Math.round(8 * SP / SP0) + 8, gr = g.createLinearGradient(0, DB - 90, 0, DB); gr.addColorStop(0, VW.rgba(gold, 0)); gr.addColorStop(1, VW.rgba(gold, 0.7 * down)); g.fillStyle = gr; g.fillRect(x - w / 2, DB - 90, w, 90); } } }
  if (ABS === 4) {   // BLOCKS: the two Block Prints fall as gold 3D blocks onto the wall; the price drops away under them
    g.globalCompositeOperation = 'source-over'; const fade = 1 - seg(t, 5.8, 6.2);
    [[4.45, -34, '1,250'], [HIT - 0.06, 34, '1,250']].forEach(([tl, dx, lab], j) => { const td = tl - 0.32; if (t < td) return; const u = clamp((t - td) / 0.32, 0, 1), bounce = t > tl ? Math.abs(Math.sin((t - tl) * 18)) * 10 * Math.exp(-(t - tl) * 7) : 0;
      const y = mix(HDR - 60, wy - 2, u * u) - bounce; g.globalCompositeOperation = 'lighter'; if (u < 1) { const gr = g.createLinearGradient(0, y - 160, 0, y - 40); gr.addColorStop(0, VW.rgba(gold, 0)); gr.addColorStop(1, VW.rgba(gold, 0.6)); g.fillStyle = gr; g.fillRect(wx + dx - 26, y - 160, 52, 120); }
      g.globalCompositeOperation = 'source-over'; cube(wx + dx - 6, y, 56, fade, lab); });
    g.globalCompositeOperation = 'lighter'; shock(t, wx, wy, [[4.45, 0.7], [HIT - 0.06, 1]]);
    if (down > 0) { g.strokeStyle = VW.rgba('#E2575F', 0.8 * down); g.lineWidth = 3; g.setLineDash([6, 8]); g.lineDashOffset = -t * 120; g.beginPath(); g.moveTo(wx, wy + 6); g.lineTo(hx, hy - 8); g.stroke(); g.setLineDash([]); } }
  if (ABS === 5) {   // WAVE: a sheet of light comes down from above onto the wall, ripples, then follows the price down
    const sheet = (y, w, col, a) => { if (a <= 0) return; g.save(); g.translate(wx, y); g.scale(1, 0.18); const rg = g.createRadialGradient(0, 0, 0, 0, 0, w); rg.addColorStop(0, VW.rgba(col, 0.75 * a)); rg.addColorStop(0.7, VW.rgba(col, 0.25 * a)); rg.addColorStop(1, VW.rgba(col, 0)); g.fillStyle = rg; g.beginPath(); g.arc(0, 0, w, 0, 7); g.fill(); g.restore(); ring3d(wx, y, w * 0.8, 0.18, 0, col, 0.9 * a, 2.5); };
    const u = eio(lin(t, T0, HIT)); sheet(mix(HDR - 20, wy, u), mix(520, 230, u), '#7FD8FF', seg(t, T0, T0 + 0.1) * (1 - seg(t, HIT, HIT + 0.1)));
    for (let n = 0; n < 40; n++) { const t0 = T0 + hr(n + 1000) * (HIT - T0), uu = (t - t0) / 0.35; if (uu <= 0 || uu > 1 || t > HIT + 0.2) continue; const yy = mix(HDR - 20, wy, eio(lin(t0, T0, HIT))) + uu * 60, xx = wx + (hr(n + 1050) - 0.5) * 420; g.fillStyle = `rgba(160,220,255,${1 - uu})`; g.fillRect(xx - 1.5, yy, 3, 12); }
    coreRings(t, wx, wy, T0, T1, HIT); shock(t, wx, wy, [[HIT, 1], [HIT + 0.12, 0.6]]);
    if (down > 0) sheet(Math.max(wy, hy - 4), 200, gold, down); }
  g.globalCompositeOperation = 'source-over';
  // the absorption meter, counting the Block Prints
  const mk = seg(t, HIT, HIT + 0.12) * (1 - seg(t, 5.9, 6.15)); if (mk > 0) { const n = Math.round(2500 * eo(lin(t, HIT, 5.15)) / 50) * 50, mx = CX0D + 18, my = Y(SUP) + 16, mw = 330;
    g.globalAlpha = mk; box(mx, my, mw, 58, 'rgba(10,8,0,0.9)', gold, 7, 2); txt('ABSORBED AT THE WALL', mx + 14, my + 17, '700 14px VWMono', '#C9B27A');
    txt(n.toLocaleString('en-US'), mx + mw - 14, my + 17, '800 20px VWMono', gold, 'right'); box(mx + 14, my + 36, mw - 28, 10, '#2A2410', null, 5); box(mx + 14, my + 36, (mw - 28) * n / 2500, 10, gold, null, 5); g.globalAlpha = 1; }
  g.restore();
}
// TradingView side: the move is there, the reason is not
function plainNote(t, S) { const a = seg(t, 1.92, 2.1) * (1 - seg(t, E.grab + 0.1, E.grab + 0.3)); if (a <= 0) return; const g = VW.g, x0 = X(53, S) - 14, x1 = X(58, S) + 14, y0 = Y(7734.5), y1 = Y(7725.5);
  g.save(); g.globalAlpha = a; g.setLineDash([8, 6]); g.strokeStyle = '#9598A1'; g.lineWidth = 2; g.strokeRect(x0, y0, x1 - x0, y1 - y0); g.setLineDash([]);
  box((x0 + x1) / 2 - 80, y0 - 42, 160, 32, '#F0F3FA', '#B2B5BE', 6); txt('WHY HERE?', (x0 + x1) / 2, y0 - 26, '700 17px VWMono', '#787B86', 'center'); g.restore(); }
const LT = { bg: '#FFFFFF', grid: '#F0F3FA', up: '#089981', dn: '#F23645', axis: '#131722', sub: '#787B86', line: '#2962FF', border: '#E0E3EB', chip: '#F0F3FA', on: '#E3EFFD' };
function lightToolbar(t, cur) {
  const g = VW.g, x = WIN.x0, icons = 7; g.fillStyle = LT.bg; g.fillRect(x, HDR, CX0L - x, (LB + 28) - HDR); g.fillStyle = LT.border; g.fillRect(CX0L - 1, HDR, 1, (LB + 28) - HDR);
  const toolOn = false;
  for (let k = 0; k < icons; k++) { const cx = x + 22, cy = HDR + 28 + k * 48, hov = Math.abs(cur.x - cx) < 20 && Math.abs(cur.y - cy) < 20;
    if (k === 2 && toolOn) box(cx - 17, cy - 17, 34, 34, LT.on, null, 6); else if (hov) box(cx - 17, cy - 17, 34, 34, LT.chip, null, 6);
    g.save(); g.strokeStyle = k === 2 && toolOn ? LT.line : LT.axis; g.fillStyle = g.strokeStyle; g.lineWidth = 1.8; g.lineCap = 'round'; g.beginPath();
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
  const g = VW.g, last = barAt(S.k, S) || BARS[S.k - 1], lp = last.c; g.fillStyle = LT.bg; g.fillRect(WIN.x0, HDR1, WIN.x1 - WIN.x0, HDR - HDR1);
  g.fillStyle = LT.border; g.fillRect(WIN.x0, HDR1 + 40, WIN.x1 - WIN.x0, 1);
  let x = WIN.x0 + 14; const y = HDR1 + 20;
  box(x, y - 14, 92, 28, LT.chip, null, 6); txt('⌕', x + 10, y, '600 17px VWSans', LT.sub); txt('ES', x + 32, y + 1, '700 18px VWSans', LT.axis); x += 104;
  txt('1m', x + 6, y + 1, '700 17px VWSans', LT.axis); x += 44; g.fillStyle = LT.border; g.fillRect(x, y - 12, 1, 24); x += 12;
  txt('ƒx  Indicators', x, y + 1, '600 17px VWSans', LT.axis); x += 142; g.fillStyle = LT.border; g.fillRect(x, y - 12, 1, 24); x += 12;
  box(x, y - 14, 100, 28, LT.on, null, 6); txt('⟲ Replay', x + 12, y + 1, '700 17px VWSans', LT.line);
  // legend rows (symbol + OHLC, volume)
  const col = lp >= last.o ? LT.up : LT.dn; let lx = WIN.x0 + 14; const y2 = HDR1 + 60, y3 = HDR1 + 98;
  lx += txt('E-mini S&P 500 Futures · 1 · CME', lx, y2, '600 16px VWSans', LT.axis) + 14;
  for (const [k, v] of [['O', last.o], ['H', last.h], ['L', last.l], ['C', lp]]) { lx += txt(k, lx, y2, '600 15px VWSans', LT.sub) + 3; lx += txt(fmt(v), lx, y2, '600 15px VWSans', col) + 10; }
  txt('Vol', WIN.x0 + 14, y3, '600 15px VWSans', LT.sub); txt((last.v / 1000).toFixed(2) + 'K', WIN.x0 + 46, y3, '600 15px VWSans', col);
}
function replayBar(t) {
  const g = VW.g, y0 = (LB + 28), y1 = WIN.y1, cy = (y0 + y1) / 2; g.fillStyle = LT.bg; g.fillRect(WIN.x0, y0, WIN.x1 - WIN.x0, y1 - y0); g.fillStyle = LT.border; g.fillRect(WIN.x0, y0, WIN.x1 - WIN.x0, 1);
  let x = WIN.x0 + 16; box(x, cy - 15, 112, 30, LT.chip, null, 6); txt('Select bar', x + 12, cy + 1, '600 15px VWSans', LT.axis); x += 130;
  const playing = true; box(x, cy - 17, 40, 34, LT.chip, null, 6); g.fillStyle = LT.axis;
  if (!playing) { g.beginPath(); g.moveTo(x + 14, cy - 9); g.lineTo(x + 28, cy); g.lineTo(x + 14, cy + 9); g.closePath(); g.fill(); } else { g.fillRect(x + 13, cy - 8, 5, 16); g.fillRect(x + 22, cy - 8, 5, 16); }
  R.play = { x, y: cy - 17, w: 40, h: 34 }; x += 52;
  g.beginPath(); g.moveTo(x + 8, cy - 8); g.lineTo(x + 18, cy); g.lineTo(x + 8, cy + 8); g.closePath(); g.fill(); g.fillRect(x + 20, cy - 8, 3, 16); x += 40;
  txt('1x', x + 4, cy + 1, '700 16px VWSans', LT.axis); x += 40;
  txt('Jump to real-time', WIN.x1 - 16, cy + 1, '600 15px VWSans', LT.sub, 'right');
}
function hline(p, col, lw, dash, x0, x1, a = 1, sel = 0) { if (a <= 0) return; const g = VW.g, y = Math.round(Y(p)) + 0.5; g.save(); g.globalAlpha = a; g.strokeStyle = col; g.lineWidth = lw; g.setLineDash(dash); g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.stroke(); g.setLineDash([]);
  if (sel > 0) { g.globalAlpha = a * sel; for (const hx of [x0 + 120, x1 - 120]) { g.fillStyle = '#FFFFFF'; g.strokeStyle = col; g.lineWidth = 2; g.beginPath(); g.arc(hx, y, 6, 0, 7); g.fill(); g.stroke(); } } g.restore(); }
function axisTag(p, bg, fg, a = 1, font = '600 15px VWSans') { if (a <= 0) return; const g = VW.g, y = Y(p); g.save(); g.globalAlpha = a; box(CX1 + 2, y - 12, WIN.x1 - CX1 - 6, 24, bg, null, 3); txt(fmt(p), (CX1 + WIN.x1) / 2, y + 1, font, fg, 'center'); g.restore(); }

function levels() { const step = PX > 44 ? 1 : PX > 30 ? 2 : 4, bot = PTOP - (DB - HDR) / PX, out = []; for (let p = Math.ceil(bot / step) * step; p <= PTOP; p += step) out.push(p); return out; }
function candles(S, th, x0, yb) {
  const g = VW.g, up = th === 'light' ? LT.up : '#2FB67C', dn = th === 'light' ? LT.dn : '#E2575F', w = Math.round(8 * SP / SP0);
  for (let i = 0; i <= S.k; i++) { const b = barAt(i, S); if (!b) continue; const x = Math.round(X(i, S)); if (x < x0 - 6 || x > CX1 + 6) continue;
    const col = b.c >= b.o ? up : dn; g.fillStyle = col; g.fillRect(x - 0.75, Y(b.h), 1.5, Y(b.l) - Y(b.h));
    const y0 = Y(Math.max(b.o, b.c)), y1 = Y(Math.min(b.o, b.c)); g.fillRect(x - w / 2, y0, w, Math.max(1.5, y1 - y0));
    // volume
    const vmax = th === 'light' ? 56 : 40, vh = Math.min(vmax, b.v / 3600 * vmax); g.globalAlpha = th === 'light' ? 0.4 : 0.4; g.fillRect(x - w / 2, yb - vh, w, vh); g.globalAlpha = 1; }
}
function timeAxis(S, x0, y, th) {
  const g = VW.g; for (let i = 0; i <= 92; i++) { const m = 10 * 60 + 2 + i; if (m % 15) continue; const x = X(i, S); if (x < x0 + 20 || x > CX1 - 20) continue;
    txt(tlabel(i), x, y, th === 'light' ? '600 15px VWSans' : '500 14px VWMono', th === 'light' ? LT.axis : '#8A93A3', 'center'); }
}
let NOCROSS = false;
function crosshair(cur, th, x0, y0, y1, a = 1) {
  if (NOCROSS || cur.x < x0 || cur.x > CX1 || cur.y < y0 || cur.y > y1 || a <= 0) return; const g = VW.g; g.save(); g.globalAlpha = a;
  g.strokeStyle = th === 'light' ? 'rgba(120,123,134,0.7)' : 'rgba(180,190,210,0.5)'; g.lineWidth = 1; g.setLineDash([5, 5]);
  g.beginPath(); g.moveTo(x0, cur.y); g.lineTo(CX1, cur.y); g.moveTo(cur.x, y0); g.lineTo(cur.x, y1); g.stroke(); g.setLineDash([]);
  const p = Math.round((PTOP - (cur.y - HDR) / PX) * 4) / 4; axisTag(p, '#363A45', '#FFFFFF', 1, th === 'light' ? '600 15px VWSans' : '600 14px VWMono'); g.restore();
}
function drawLight(t, S, cur) {
  const g = VW.g; g.save(); g.beginPath(); g.rect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0); g.clip();
  g.fillStyle = LT.bg; g.fillRect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0);
  g.fillStyle = LT.grid; for (const p of levels()) g.fillRect(CX0L, Math.round(Y(p)), CX1 - CX0L, 1);
  for (let i = 0; i <= 92; i++) if ((10 * 60 + 2 + i) % 15 === 0) { const x = Math.round(X(i, S)); if (x > CX0L && x < CX1) g.fillRect(x, HDR, 1, LB - HDR); }
  g.save(); g.beginPath(); g.rect(CX0L, HDR, CX1 - CX0L, LB - HDR); g.clip(); candles(S, 'light', CX0L, LB);
  // the support the trader drew: selected while the cursor sits on it, flashes once on contact
  const sel = seg(t, E.sel, E.sel + 0.12) * (1 - seg(t, E.handle, E.handle + 0.2)), hit = Math.exp(-Math.pow((t - E.contact) / 0.12, 2));
  hline(SUP, LT.line, 2 + 2 * hit + (sel > 0.5 ? 1 : 0), [], CX0L, CX1, 1, sel);
  crosshair(cur, 'light', CX0L, HDR, LB);
  g.restore();
  g.fillStyle = LT.bg; g.fillRect(CX1, HDR, WIN.x1 - CX1, (LB + 28) - HDR); g.fillStyle = LT.border; g.fillRect(CX1, HDR, 1, (LB + 28) - HDR);
  for (const p of levels()) txt(fmt(p), (CX1 + WIN.x1) / 2, Y(p), '600 15px VWSans', LT.axis, 'center');
  axisTag(SUP, LT.line, '#FFFFFF');
  const lp = lastPrice(S), lb = barAt(S.k, S) || BARS[S.k - 1]; axisTag(lp, lp >= lb.o ? LT.up : LT.dn, '#FFFFFF');
  crosshair(cur, 'light', CX0L, HDR, LB);
  g.fillStyle = LT.bg; g.fillRect(CX0L, LB, CX1 - CX0L, 28); g.fillStyle = LT.border; g.fillRect(CX0L, LB, CX1 - CX0L, 1); timeAxis(S, CX0L, (LB + 15), 'light');
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
  const s = pr.q, gold = pr.gold; g.font = '700 14px VWMono'; const tw = g.measureText(s).width + 14, left = !!pr.left, px = left ? x - 24 - tw : x + 24;
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
function darkHeader(t, S, cur) { if (HDRV === 1) return darkHeader1(t, S, cur); return darkHeader0(t, S, cur); }
function darkHeader1(t, S, cur) {
  const g = VW.g; g.fillStyle = DK.panel; g.fillRect(WIN.x0, HDR1, WIN.x1 - WIN.x0, HDR - HDR1); g.fillStyle = '#1A1D24'; g.fillRect(WIN.x0, HDR - 1, WIN.x1 - WIN.x0, 1);
  const L = '500 15px VWMono', B = '700 19px VWMono', lp = lastPrice(S), ch = (lp - PREV_CLOSE) / PREV_CLOSE * 100;
  const wm = VW.assets.wm, wh = 22, ww = wh * wm.width / wm.height; g.save(); g.globalCompositeOperation = 'lighter'; g.drawImage(wm, R.logo.x, R.logo.y + 15 - wh / 2, ww, wh); g.restore();
  g.fillStyle = DK.sep; g.fillRect(R.sep1.x, R.sep1.y + 4, 2, 22);
  box(R.tick.x, R.tick.y, R.tick.w, 30, DK.chip, DK.chipB, 6); let x = R.tick.x + 12; const y = R.tick.y + 15; g.fillStyle = '#2FB67C'; g.beginPath(); g.arc(x + 4, y, 4, 0, 7); g.fill(); x += 16;
  x += txt('ES ', x, y + 1, '700 17px VWMono', '#6E9BFF'); x += txt(fmt(lp), x, y + 1, '700 17px VWMono', DK.val) + 8;
  const cs = (ch >= 0 ? '+' : '') + ch.toFixed(2) + '%'; g.font = '500 13px VWMono'; const cw = g.measureText(cs).width + 12; box(x, y - 10, cw, 20, ch >= 0 ? 'rgba(47,182,124,0.18)' : 'rgba(226,87,95,0.18)', null, 4); txt(cs, x + 6, y + 1, '500 13px VWMono', ch >= 0 ? '#2FB67C' : '#E2575F');
  box(R.tf.x, R.tf.y, R.tf.w, 30, DK.chip, DK.chipB, 6); txt('1m', R.tf.x + R.tf.w / 2, R.tf.y + 16, '700 17px VWMono', DK.val, 'center');
  const wallsOn = t >= E.walls, bpOn = t >= E.prints, w = R.walls, b = R.bp, my = w.y + w.h / 2;
  box(w.x, w.y, w.w, w.h, wallsOn ? 'rgba(38,192,138,0.10)' : DK.chip, wallsOn ? 'rgba(38,192,138,0.7)' : DK.chipB, 8, 1.4); toggle(w.x + 14, my, wallsOn, '#26C08A');
  let xx = w.x + 56 + txt('DEALER WALLS ', w.x + 56, my + 1, B, DK.val); txt('Top 5 ▾', xx, my + 1, L, '#8A93A3');
  box(b.x, b.y, b.w, b.h, bpOn ? 'rgba(242,193,78,0.12)' : 'rgba(242,193,78,0.04)', 'rgba(242,193,78,0.75)', 8, 1.4); toggle(b.x + 14, my, bpOn, '#F2C14E');
  txt('BLOCK PRINTS', b.x + 56, my + 1, B, '#F5E6B8'); txt('▾', b.x + b.w - 20, my + 1, L, '#F2C14E');
}
function darkHeader0(t, S, cur) {
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
  const mapsOn = false, ddOpen = false;
  for (const [id, lab, val] of [['walls', 'WALLS ', 'Top 5'], ['metric', 'METRIC ', 'GEX'], ['expiry', 'EXPIRY ', 'All'], ['maps', 'MAPS ', mapsOn ? 'Gamma' : 'None']]) {
    g.globalAlpha = HDRV === 2 && id !== 'walls' ? 0.45 : 1; chip(id, hov(id) || (id === 'maps' && ddOpen)); let xx = R[id].x + 11; const yy = R[id].y + 16; xx += txt(lab, xx, yy, L, id === 'walls' ? '#6E8BFF' : DK.lab); xx += txt(val, xx, yy, F, DK.val); txt(' ▾', xx, yy, L, DK.lab); }
  g.globalAlpha = 1;
  // row 3: ES LEVELS, ACTIVITY group
  txt('ACTIVITY', R.gAct.x, R.gAct.y + 16, L, DK.lab);
  const bpOn = t >= E.prints, cvdOn = false;
  { const r = R.bp; box(r.x, r.y, r.w, r.h, bpOn ? 'rgba(242,193,78,0.12)' : 'rgba(242,193,78,0.04)', 'rgba(242,193,78,0.75)', 6, 1.4); toggle(r.x + 10, r.y + 15, bpOn, '#F2C14E');
    txt('BLOCK PRINTS', r.x + 48, r.y + 16, B, '#F5E6B8'); g.fillStyle = 'rgba(242,193,78,0.6)'; g.fillRect(r.x + r.w - 26, r.y + 7, 1, 16); txt('▾', r.x + r.w - 16, r.y + 16, L, '#F2C14E'); }
  if (HDRV === 2) g.globalAlpha = 0.45;
  for (const [id, lab, on] of [['cvd', 'CVD', cvdOn], ['cdi', 'CDI', false], ['flow', 'FLOW', false]]) { const r = R[id]; box(r.x, r.y, r.w, r.h, on ? '#121A33' : DK.chip, on ? '#2F4FA8' : DK.chipB, 6); toggle(r.x + 10, r.y + 15, on, '#2F6BFF'); txt(lab, r.x + 46, r.y + 16, B, DK.val); }
  g.globalAlpha = 1;
  // MAPS dropdown
  if (ddOpen) { const r = R.maps, items = ['None', 'Gamma', 'Charm', 'Vega', 'Volga', 'Delta'], k = eo(lin(t, E.maps, E.maps + 0.12)); g.save(); g.globalAlpha = k;
    const dx = r.x, dy = r.y + r.h + 4, w = 150; box(dx, dy, w, items.length * 34 + 8, '#14161B', '#2A2F38', 6); g.shadowBlur = 0;
    items.forEach((it, j) => { const iy = dy + 4 + j * 34, h = cur.x > dx && cur.x < dx + w && cur.y > iy && cur.y < iy + 34; if (h) box(dx + 4, iy, w - 8, 34, '#1F2A44', null, 4);
      txt(it, dx + 16, iy + 18, '600 16px VWMono', it === 'None' ? '#6E9BFF' : DK.val); R['dd_' + it] = { x: dx, y: iy, w, h: 34 }; }); g.restore(); }
}
function tooltip(t, a) { // wall hover label: same structure as the real terminal tooltip (data only, no extra wording)
  if (a <= 0) return; const g = VW.g, w = WALLS[TIPW], col = VX.WALL[w.fam], x = CX0D + 20, y = Y(w.p) + 30, W = 470, H = 156; g.save(); g.globalAlpha = a;
  box(x, y, W, H, 'rgba(12,14,19,0.97)', '#2A2F38', 8); g.fillStyle = col; g.fillRect(x, y + 8, 3, H - 16);
  txt('→ ES ' + fmt(w.p, 1), x + 18, y + 24, '700 17px VWMono', DK.val); txt('GEX', x + W - 18, y + 24, '600 14px VWMono', DK.lab, 'right');
  txt('Call wall · long γ', x + 18, y + 54, '700 17px VWMono', col);
  txt('Net', x + 18, y + 84, '600 15px VWMono', DK.lab); txt(w.usd, x + 70, y + 84, '700 17px VWMono', DK.val); txt('long γ', x + 170, y + 84, '600 15px VWMono', col);
  ['Values are dealer P&L exposure per 1-point', 'SPX move (ES tracks SPX with carry offset).', 'Sum across all expirations.'].forEach((s2, j) => txt(s2, x + 18, y + 108 + j * 17, '500 13px VWMono', '#6B7280')); g.restore();
}
function drawDark(t, S, cur) {
  const g = VW.g, cvdK = 0, ybot = DB; // chart bottom (CVD pane opens under it)
  g.save(); g.beginPath(); g.rect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0); g.clip(); g.fillStyle = DK.bg; g.fillRect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0);
  g.save(); g.beginPath(); g.rect(CX0D, HDR, CX1 - CX0D, ybot - HDR); g.clip();
  g.fillStyle = DK.grid; for (let i = 0; i <= 92; i++) if ((10 * 60 + 2 + i) % 5 === 0) { const x = Math.round(X(i, S)); g.fillRect(x, HDR, 1, ybot - HDR); }
  candles(S, 'dark', CX0D, ybot);
  // the trader's own levels stay on screen
  for (const [p, lab] of [[SUP, 'YOUR LEVEL']]) { hline(p, '#7FA2FF', 2, [8, 6], CX0D, CX1, 0.9); const y = Y(p); box(CX0D + 290, y - 22, 98, 18, 'rgba(41,98,255,0.9)', null, 3); txt(lab, CX0D + 339, y - 12, '700 12px VWMono', '#FFFFFF', 'center'); }
  WALLS.forEach((w, j) => { const t0 = E.walls + j * BT / 2 * 0.5; wallLine(w, seg(t, t0, t0 + 0.06), eo(lin(t, t0, t0 + 0.12))); });
  wallHit(t); absorbFx(t, S);
  const bpk = eo(lin(t, E.prints, E.prints + 0.35)); PRINTS.forEach(pr => printMark(pr, S, bpk));
  crosshair(cur, 'dark', CX0D, HDR, ybot, t > E.tip - 0.1 ? 0 : 1);
  g.restore();
  // price axis
  g.fillStyle = '#000'; g.fillRect(CX1, HDR, WIN.x1 - CX1, WIN.y1 - HDR);
  g.save(); g.beginPath(); g.rect(CX1, HDR, WIN.x1 - CX1, ybot - HDR); g.clip(); for (const p of levels()) txt(fmt(p), (CX1 + WIN.x1) / 2, Y(p), '500 14px VWMono', DK.axis, 'center');
  const lp = lastPrice(S); axisTag(lp, '#E9EDF3', '#0B1220', 1, '700 14px VWMono'); crosshair(cur, 'dark', CX0D, HDR, ybot, t > E.tip - 0.1 ? 0 : 1); g.restore();
  timeAxis(S, CX0D, (DB + 16), 'dark'); txt('ET', WIN.x1 - 30, (DB + 16), '500 13px VWMono', DK.lab, 'center');
  tooltip(t, eo(lin(t, E.tip, E.tip + 0.18)));
  darkHeader(t, S, cur);
  g.restore();
}

// ---------- frame ----------
const OVER = [ [0.0, '', 'BREAKOUT', '?'], [E.top1, 'YOUR ', 'BREAKOUT', ' JUST FAILED.'], [1.92, 'PLAIN CHART: ', 'UP', ', THEN DOWN.'], [E.walls, 'SEE THE ', 'POSITIONING.'],
  [E.top2, 'VOLUME ', 'ABSORBED', ' AT THE WALL.'], [5.3, 'PRICE ', 'TURNS BACK', ' DOWN.'], [E.out, 'TRADE WITH ', 'INSTITUTIONAL', ' CONTEXT.'] ];
const SUBS = [ [0.0, 'ES 1m · price rips through the line you drew'], [E.top1, '...and drops straight back under it'], [1.92, 'A line shows where. Not what happened there.'],
  [E.rew, 'Rewind. Same move, Dealer Walls on.'], [E.prints, 'Same rip. Block Prints on.'], [E.top2, 'Block Prints 1,250 ×2 into the call wall'], [5.3, 'Call wall · long γ · +$12.6M'],
  [E.out, 'Long γ: dealers hedge against the move. Not a signal.'] ];
function overlay(t) {
  const g = VW.g; let j = -1; OVER.forEach((o, q) => { if (t >= o[0]) j = q; }); if (j < 0 || t > T_END) return;
  const o = OVER[j], k = j === 0 ? 1 : eo(lin(t, o[0], o[0] + 0.22)), parts = o.slice(1); g.save(); g.globalAlpha = k * (1 - seg(t, T_END - 0.2, T_END)); g.font = `700 ${LT_.ts}px VWSans`; g.letterSpacing = '1px';
  // wrap into max two lines inside the safe width
  const words = []; parts.forEach((p, q) => p.split(/(?<= )/).forEach(w => w && words.push([w, q === 1])));
  const lines = [[]]; let lw = 0; words.forEach(w => { const ww = g.measureText(w[0]).width; if (!LT_.one && lw + ww > 830 && lines[lines.length - 1].length) { lines.push([]); lw = 0; } lines[lines.length - 1].push(w); lw += ww; });
  if (lines.length === 2) { const all = lines.flat(), wd = w => g.measureText(w[0]).width; let best = null;
    for (let q = 1; q < all.length; q++) { const a = all.slice(0, q).reduce((p, w) => p + wd(w), 0), b = all.slice(q).reduce((p, w) => p + wd(w), 0), m = Math.max(a, b); if (a <= 830 && b <= 830 && (!best || m < best[0])) best = [m, q]; }
    if (best) { lines[0] = all.slice(0, best[1]); lines[1] = all.slice(best[1]); } }
  const lh = LT_.lh, y0 = (lines.length > 1 ? LT_.y2 : LT_.y1); g.textBaseline = 'middle'; const pop = 1 + 0.18 * Math.exp(-Math.max(0, t - o[0]) * 14) * (j > 0 ? 1 : 0); g.translate(VW.SAFE.cx, y0); g.scale(pop, pop); g.translate(-VW.SAFE.cx, -y0);
  lines.forEach((ln, li) => { const tw = ln.reduce((s, w) => s + g.measureText(w[0].trimEnd()).width + (w[0].endsWith(' ') ? g.measureText(' ').width : 0), 0) - (ln[ln.length - 1][0].endsWith(' ') ? g.measureText(' ').width : 0);
    let x = VW.SAFE.cx - tw / 2; ln.forEach(w => { g.fillStyle = w[1] ? '#6E9BFF' : '#F2F5FA'; g.textAlign = 'left'; g.fillText(w[0], x, y0 + li * lh); x += g.measureText(w[0]).width; }); });
  // technical line under the title
  let js = -1; SUBS.forEach((o, q) => { if (t >= o[0]) js = q; });
  if (js >= 0) { const ks = js === 0 ? 1 : eo(lin(t, SUBS[js][0], SUBS[js][0] + 0.25)); g.globalAlpha = ks * (1 - seg(t, T_END - 0.2, T_END)); g.letterSpacing = '0px';
    let fs = 25; g.font = `600 ${fs}px VWMono`; while (g.measureText(SUBS[js][1]).width > 820 && fs > 18) { fs--; g.font = `600 ${fs}px VWMono`; }
    txt(SUBS[js][1], VW.SAFE.cx, LT_.sub, `600 ${fs}px VWMono`, '#9FB3D9', 'center'); }
  g.restore();
}
function disclosure(t) { const g = VW.g, a = 1 - seg(t, T_END - 0.2, T_END); if (a <= 0) return; g.save(); g.globalAlpha = a;
  const d2 = seg(t, E.grab, E.grab + 0.4), y = HDR + 28, x = (t >= E.grab ? CX0D : CX0L) + 12;
  txt('Illustrative replay. Simulated data.', x, y, '500 14px VWMono', '#8A93A3');
  if (d2 > 0) { g.globalAlpha = a * d2; txt('Dealer Walls: modeled options-derived positioning.', x, y + 18, '500 14px VWMono', '#8A93A3'); } g.restore(); }
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
// ---------- camera and impact effects (v3) ----------
const CAMK = [ [0, 1.45, 'p'], [0.96, 1.6, 'p'], [1.5, 1.3, 'p'], [1.92, 1, 'c'], [3.84, 1, 'c'], [4.5, 1.6, 'w'], [E.top2, 1.8, 'w'], [5.4, 1.35, 'p'], [5.95, 1, 'c'] ];
const HITS = [ [E.top1, 1.0], [E.drop, 0.35], [E.top2, 1.6], ...[0, 1, 2, 3, 4].map(j => [E.walls + j * BT / 4, 0.25]) ];
function focus(kind, S) { if (kind === 'p') return { x: Math.min(X(S.k, S), 800), y: Y(lastPrice(S)) }; if (kind === 'w') return { x: X(57, S) - 40, y: Y(WALLS[1].p) + 30 }; return { x: 540, y: (WIN.y0 + WIN.y1) / 2 }; }
function camera(t, S) {
  let q = 0; while (q < CAMK.length - 1 && t > CAMK[q + 1][0]) q++;
  const A = CAMK[q], B = CAMK[Math.min(q + 1, CAMK.length - 1)], u = B === A ? 1 : eio(clamp((t - A[0]) / (B[0] - A[0]), 0, 1));
  let sx = 0, sy = 0; HITS.forEach(([th, amp]) => { const d = t - th; if (d >= 0 && d < 0.5) { const e = Math.exp(-d * 11) * amp; sx += Math.sin(d * 95) * 9 * e; sy += (Math.cos(d * 77) * 7 + 8) * e; } });
  return { x: sx, y: sy, s: 1, fx: 540, fy: 960 };   // Power 31 Oct 15:58: no image zoom, only shake; the zoom is the chart's own scale (setView)
}
// chart zoom like a trading platform (Power 31 Oct 15:58): price scale and bar spacing change, the price axis and the time axis follow, header and axis stay in place
const MIDY = () => (HDR + DBS) / 2, CENTER0 = PTOP0 - (DBS - HDR) / PX0 / 2;
function fprice(kind, S) { return kind === 'p' ? lastPrice(S) : kind === 'w' ? WALLS[1].p - 1.5 : CENTER0; }
function setView(t, S) {
  let q = 0; while (q < CAMK.length - 1 && t > CAMK[q + 1][0]) q++;
  const A = CAMK[q], B = CAMK[Math.min(q + 1, CAMK.length - 1)], u = B === A ? 1 : eio(clamp((t - A[0]) / (B[0] - A[0]), 0, 1));
  const z = mix(A[1], B[1], u), pf = mix(fprice(A[2], S), fprice(B[2], S), u);
  XR = XR0 - 210 * eio(seg(t, 4.15, 4.55)) * (1 - eio(seg(t, 5.75, 6.15)));
  PX = PX0 * z; SP = SP0 * (1 + (z - 1) * 0.8); PTOP = pf + (MIDY() - HDR) / PX;
}
let CAM = { x: 0, y: 0, s: 1, fx: 540, fy: 960 };
function flashA(t) { let a = 0; [[E.top1, 0.22], [E.top2, 0.26]].forEach(([th, m]) => { const d = t - th; if (d >= 0) a = Math.max(a, m * Math.exp(-d * 14)); }); return a; }
function crashFx(t, S) {
  const g = VW.g, dark = t >= E.drop, x0 = dark ? CX0D : CX0L, y1 = dark ? DB : LB;
  const fa = flashA(t); if (fa > 0.01) { g.save(); g.globalAlpha = fa; g.fillStyle = t >= E.top2 ? '#BFFFE6' : '#FFFFFF'; g.fillRect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0); g.restore(); }
  const moving = (t < 1.92) || (t > 3.84 && t < 6.2); if (!moving) return;
  g.save(); g.beginPath(); g.rect(x0, HDR, CX1 - x0, y1 - HDR); g.clip();
  const p0 = lastPrice(state(Math.max(0, t - 0.22))), p1 = lastPrice(S), up = p1 > p0, col = up ? (dark ? '#2FB67C' : '#089981') : (dark ? '#E2575F' : '#F23645');
  for (let q = 1; q <= 8; q++) { const Sq = state(Math.max(0, t - q * 0.03)), pq = lastPrice(Sq), x = X(Sq.k, S); g.globalAlpha = 0.55 * (1 - q / 9); g.fillStyle = col; g.fillRect(x - 5, Y(pq) - 3, 10, 6); }
  // Power 31 Oct 16:57: no arrows next to the price
  g.restore();
}
function rewindFx(t) {
  const k = seg(t, E.rew, E.rew + 0.06) * (1 - seg(t, E.walls - 0.06, E.walls)); if (k <= 0) return; const g = VW.g; g.save(); g.globalAlpha = k;
  g.fillStyle = 'rgba(47,107,255,0.10)'; g.fillRect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0);
  for (let y = WIN.y0; y < WIN.y1; y += 6) { g.fillStyle = `rgba(255,255,255,${0.03 + 0.03 * Math.sin(y * 0.7 + t * 60)})`; g.fillRect(WIN.x0, y, WIN.x1 - WIN.x0, 2); }
  const by = WIN.y0 + 150 + ((t * 900) % (WIN.y1 - WIN.y0 - 200)); g.fillStyle = 'rgba(255,255,255,0.12)'; g.fillRect(WIN.x0, by, WIN.x1 - WIN.x0, 14);
  box(CX0D + 18, HDR + 46, 150, 40, 'rgba(4,9,19,0.85)', '#2F6BFF', 6); txt('◀◀ REWIND', CX0D + 93, HDR + 67, '700 18px VWMono', '#8AB6FF', 'center'); g.restore();
}
function wallHit(t) {   // the call wall label grows on the impact
  const d = t - E.top2; if (d < -0.05 || d > 1.6) return; const g = VW.g, w = WALLS[1], col = VX.WALL[w.fam], y = Y(w.p), a = seg(t, E.top2 - 0.05, E.top2) * (1 - seg(t, E.top2 + 1.3, E.top2 + 1.6));
  const sc = 1 + 0.35 * Math.exp(-Math.max(0, d) * 8); g.save(); g.globalAlpha = a; g.strokeStyle = col; g.lineWidth = 5; g.shadowColor = col; g.shadowBlur = 24; g.beginPath(); g.moveTo(CX0D, y); g.lineTo(CX1 - 178, y); g.stroke(); g.shadowBlur = 0;
  g.restore();
}
function wallCallout(t) {   // screen space, above the wall wherever the camera puts it
  const d = t - E.top2; if (d < -0.05 || d > 1.6) return; const g = VW.g, w = WALLS[1], col = VX.WALL[w.fam], a = seg(t, E.top2 - 0.05, E.top2) * (1 - seg(t, E.top2 + 1.3, E.top2 + 1.6));
  const ys = Y(w.p) + CAM.y, sc = 1 + 0.35 * Math.exp(-Math.max(0, d) * 8), s = 'CALL WALL · ' + w.usd;
  g.save(); g.globalAlpha = a; g.font = '800 30px VWMono'; const tw = g.measureText(s).width + 34, cx = 470, cy = Math.max(WIN.y0 + 140, ys - 58); g.translate(cx, cy); g.scale(sc, sc);
  box(-tw / 2, -25, tw, 50, 'rgba(6,20,14,0.94)', col, 9, 2.5); txt(s, 0, 1, '800 30px VWMono', col, 'center'); g.restore();
}
function logoAt(a) {
  if (LOGO === 'none' || a <= 0) return; if (LOGO === 'tl') return VW.logoTL(a, '', 46, 24, true);
  const g = VW.g, wm = VW.assets.wm, h = 46, w = h * wm.width / wm.height, x = 540 - w / 2, y = LOGO === 'top' ? 264 : 1496;
  g.save(); g.globalAlpha = a; g.globalCompositeOperation = 'lighter'; g.drawImage(wm, x, y, w, h); g.globalAlpha = 0.45 * a; g.drawImage(wm, x, y, w, h); g.restore();
}
function divX(t) { return t < E.grab ? WIN.x1 : mix(WIN.x1, WIN.x0 - 2, eio(lin(t, E.grab, E.drop))); }
// window edges (Power 31 Oct 16:57: the borders should show as little as possible, one with the background): ?frame=0 as before · 1 no frame, black background · 2 + edges faded 30 px · 3 + wide fade left and bottom
const FR = +(new URLSearchParams(location.search).get('frame') || 0);
function feather([top, right, bot, left]) { const g = VW.g, { x0, x1, y0, y1 } = WIN, f = (ax, ay, bx, by, rx, ry, rw, rh) => { const gr = g.createLinearGradient(ax, ay, bx, by); gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(rx, ry, rw, rh); };
  if (top) f(0, y0 - 1, 0, y0 + top, x0 - 2, y0 - 2, x1 - x0 + 4, top + 2); if (bot) f(0, y1 + 1, 0, y1 - bot, x0 - 2, y1 - bot, x1 - x0 + 4, bot + 2);
  if (left) f(x0 - 1, 0, x0 + left, 0, x0 - 2, y0 - 2, left + 2, y1 - y0 + 4); if (right) f(x1 + 1, 0, x1 - right, 0, x1 - right, y0 - 2, right + 2, y1 - y0 + 4); }
function divider(t) {   // Power 31 Oct 16:43: the swipe right to left, accentuated (beam, sparks, light sweep, flash on arrival)
  const a = seg(t, E.handle, E.handle + 0.25) * (1 - seg(t, E.drop, E.drop + 0.25)); const g = VW.g, x = Math.min(divX(t), WIN.x1 - 3), cy = 1060;
  const mv = seg(t, E.grab, E.grab + 0.05) * (1 - seg(t, E.drop - 0.04, E.drop)), H = WIN.y1 - WIN.y0;
  if (mv > 0) { g.save(); g.beginPath(); g.rect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, H); g.clip(); g.globalCompositeOperation = 'lighter';
    const sw = g.createLinearGradient(x, 0, x + 260, 0); sw.addColorStop(0, `rgba(47,107,255,${0.45 * mv})`); sw.addColorStop(1, 'rgba(47,107,255,0)'); g.fillStyle = sw; g.fillRect(x, WIN.y0, 260, H);
    const bm = g.createLinearGradient(x - 40, 0, x + 40, 0); bm.addColorStop(0, 'rgba(110,155,255,0)'); bm.addColorStop(0.5, `rgba(170,200,255,${0.9 * mv})`); bm.addColorStop(1, 'rgba(110,155,255,0)'); g.fillStyle = bm; g.fillRect(x - 40, WIN.y0, 80, H);
    for (let n = 0; n < 60; n++) { const z = hr(n + 11), y = WIN.y0 + hr(n + 23) * H, life = 0.22 + 0.2 * z, t0 = E.grab + hr(n + 37) * (E.drop - E.grab - 0.05), u = (t - t0) / life; if (u < 0 || u > 1) continue;
      const x0 = divX(t0), px = x0 + (60 + 260 * (1 - z)) * eo(u), py = y + (hr(n + 51) - 0.5) * 60 * u, sz = 1 + 3.5 * (1 - z);
      g.fillStyle = `rgba(200,220,255,${(1 - u) * (0.4 + 0.6 * (1 - z))})`; g.fillRect(px - sz * 4, py - sz / 2, sz * 8, sz); }
    g.restore(); }
  const fl = t >= E.drop ? Math.exp(-(t - E.drop) * 9) : 0; if (fl > 0.02) { g.save(); g.globalAlpha = 0.35 * fl; g.fillStyle = '#6E9BFF'; g.fillRect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, H); g.restore(); }
  if (a <= 0) return; g.save(); g.globalAlpha = a;
  g.fillStyle = '#FFFFFF'; g.shadowColor = mv > 0 ? 'rgba(120,165,255,1)' : 'rgba(0,0,0,0.6)'; g.shadowBlur = mv > 0 ? 26 : 10; g.fillRect(x - 2, WIN.y0, 4, H);
  g.beginPath(); g.arc(x, cy, 26, 0, 7); g.fill(); g.shadowBlur = 0; g.fillStyle = '#131722';
  g.beginPath(); g.moveTo(x - 15, cy); g.lineTo(x - 6, cy - 8); g.lineTo(x - 6, cy + 8); g.closePath(); g.fill(); g.beginPath(); g.moveTo(x + 15, cy); g.lineTo(x + 6, cy - 8); g.lineTo(x + 6, cy + 8); g.closePath(); g.fill();
  const k = seg(t, E.grab, E.grab + 0.2); if (k > 0) { g.globalAlpha = a * k; const pop = 1 + 0.2 * Math.exp(-(t - E.grab) * 10);
    if (x - WIN.x0 > 250) { g.save(); g.translate(x - 130, 1150); g.scale(pop, pop); box(-112, -24, 224, 48, 'rgba(240,243,250,0.96)', '#B2B5BE', 8); txt('PLAIN CHART', 0, 1, '800 22px VWMono', '#131722', 'center'); g.restore(); }
    if (WIN.x1 - x > 250) { g.save(); g.translate(x + 130, 1150); g.scale(pop, pop); box(-112, -24, 224, 48, 'rgba(4,9,19,0.94)', '#2F6BFF', 8, 2); txt('VOLWICK', 0, 1, '800 22px VWMono', '#8AB6FF', 'center'); g.restore(); } }
  g.restore();
}
// time warp (Power 31 Oct 15:28, his track "Never stop trading", 80 BPM): ?k=0.78125 maps the 125 BPM beat (0.48 s) onto the track's half beat (0.375 s)
const K = +(new URLSearchParams(location.search).get('k') || 1);
// terminal bar (Power 31 Oct 15:36: crowded, empty on the right, half the controls unused): ?hdr=1 only the controls the video uses, big · ?hdr=2 the full layer row spread over the whole width, unused ones dimmed
const HDRV = +(new URLSearchParams(location.search).get('hdr') || 2);   // Power 31 Oct 15:58: bar 2 chosen
function render(t) { renderAt(t < T_END * K ? t / K : T_END + (t - T_END * K)); }
function renderAt(t) {
  const g = VW.g, S = state(t); g.save(); g.fillStyle = '#040913'; g.fillRect(0, 0, 1080, 1920);
  setView(t, S);
  const bg = g.createLinearGradient(0, 0, 0, 1920); bg.addColorStop(0, FR ? '#000' : '#060C1A'); bg.addColorStop(1, FR ? '#000' : '#03060D'); g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  let c = cursorAt(t); const jt = jitter(t); c = { x: c.x + jt.x, y: c.y + jt.y };
  const cam = camera(t, S); CAM = cam; g.save(); { VW.roundRect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0, 12); g.clip(); } g.translate(cam.x, cam.y); if (cam.s !== 1) { g.translate(cam.fx, cam.fy); g.scale(cam.s, cam.s); g.translate(-cam.fx, -cam.fy); }
  if (!FR) { g.save(); g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 40; box(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0, '#000', null, 12); g.restore(); }
  const dx = divX(t), dragging = t >= E.grab - 0.1 && t < E.drop + 0.1;
  NOCROSS = dragging || (t >= E.handle && Math.abs(c.x - dx) < 40);
  g.save(); VW.roundRect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0, 12); g.clip();
  if (dx > WIN.x0) { g.save(); g.beginPath(); g.rect(WIN.x0, WIN.y0, dx - WIN.x0, WIN.y1 - WIN.y0); g.clip(); drawLight(t, S, c); plainNote(t, S); g.restore(); }
  if (t >= E.grab && dx < WIN.x1) { g.save(); g.beginPath(); g.rect(dx, WIN.y0, WIN.x1 - dx, WIN.y1 - WIN.y0); g.clip(); drawDark(t, S, c); g.restore(); }
  g.restore();
  if (!FR) box(WIN.x0 + 0.5, WIN.y0 + 0.5, WIN.x1 - WIN.x0 - 1, WIN.y1 - WIN.y0 - 1, null, 'rgba(255,255,255,0.12)', 12);
  if (FR >= 2) feather(FR === 2 ? [30, 30, 30, 30] : [0, 24, 110, 70]);
  divider(t);
  const onVol = c.x > dx, x0c = onVol ? CX0D : CX0L;
  const inChart = !NOCROSS && c.x > x0c && c.x < CX1 && c.y > HDR && c.y < LB && !(t >= E.tip - 0.1);
  if (t < T_END + 0.1) { const pr = press(t), lightHere = !onVol; if (inChart) { g.save(); g.strokeStyle = lightHere ? '#131722' : '#FFFFFF'; g.lineWidth = 2.5; g.shadowColor = lightHere ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)'; g.shadowBlur = 4;
      g.beginPath(); g.moveTo(c.x - 14, c.y); g.lineTo(c.x + 14, c.y); g.moveTo(c.x, c.y - 14); g.lineTo(c.x, c.y + 14); g.stroke(); g.restore(); }
    else VX.cursor(c.x, c.y, 1, lightHere, pr); }
  crashFx(t, S); rewindFx(t); g.restore(); wallCallout(t);
  logoAt(1 - seg(t, T_END, T_END + 0.25));
  overlay(t); disclosure(t); endCard(t);
  g.restore();
}

window.READY = (async () => {
  D = await (await fetch('data.json')).json(); BARS = D.bars; SUP = D.SUP;
  await VW.loadFonts(); await VW.loadBrand(); layoutHeader();
  const S0 = state(0), Sc = state(E.contact), bp = { x: R.bp.x + 26, y: R.bp.y + 15 }, hy = 1060, wallPt = { x: 640, y: Y(WALLS[TIPW].p) };
  const lineX = X(57, Sc) - 70;                                    // just left of where price meets the line
  KF = [ [0, lineX, Y(SUP)], [1.7, lineX + 3, Y(SUP)], [2.15, WIN.x1 - 4, hy, 0.12], [E.grab, WIN.x1 - 3, hy], [E.drop, WIN.x0 + 20, hy + 6, 0.02], [3.2, WIN.x0 + 24, hy + 8],
    [3.55, bp.x - 60, bp.y + 140, 0.1], [E.prints, bp.x, bp.y, -0.06], [3.98, bp.x + 1, bp.y], [4.6, wallPt.x - 150, wallPt.y + 120, 0.1], [5.6, wallPt.x - 130, wallPt.y + 110], [6.0, wallPt.x - 40, wallPt.y + 30, 0.1], [E.tip, wallPt.x, wallPt.y], [T_END, wallPt.x + 4, wallPt.y - 1] ];
  window.render = render; render(0);
  const sc = v => typeof v === 'number' ? v * K : v, ev = {}; for (const [k, v] of Object.entries(E)) ev[k] = sc(v);
  return { total: T_END * K + (TOTAL - T_END), events: { ...ev, clicks: CLICKS.map(sc), end: T_END * K, logo0: T_END * K, k: K } };
})();
