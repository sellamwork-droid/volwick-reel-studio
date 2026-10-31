// V0002 · EDIT ORDER FLOW (T1, 31 Oct 2026), rebuilt from CREATIVE 05: Ocean Drop hook on the first bar (composited in post),
// layer row without ES LEVELS / GUIDE / MARKET INTELLIGENCE, OPTIONS FLOW card, approved ending (VX.end).
// CREATIVE 05 · EDIT (30 Oct 2026). Fast motion-design edit, no voice, every cut on a 125 BPM grid (beat = 0.48 s, bar = 1.92 s).
// Logo ignition, the real Volwick layer row cut in on the beat, Dealer Walls slamming in, "2,000" assembling from pixels,
// six layer cards drawn like the terminal, SEE WHAT OTHERS CAN'T., logo end card.
// Simulated ES session (gen_data.py, fixed seed), declared on screen. No real data, no forecasts.
const { seg, lin, eo, eio, mix, clamp } = VW;
const BPM = 125, B = 60 / BPM, b = k => k * B;
const TOTAL = b(40) + 0.3;
let BARS;
// ---------- geometry (same terminal window as CREATIVE 01) ----------
const WIN = { x0: 96, x1: 940, y0: 520, y1: 1490 };
const HDR1 = 520, HDR = 640, CX0 = 96, CX1 = 858;
const PTOP = 7753, PX = 22, Y = p => HDR + (PTOP - p) * PX;
const SP = 8.1, X = i => CX0 + 14 + i * SP;
const N = 92;
// ---------- timeline (beats) ----------
const T = { hdr: b(4), full: b(7), walls: b(8), maps: b(13), cvd: b(14), prints: b(16), dim: b(16.5), num: b(18), dock: b(19),
  cards: b(20), one: b(26), out: b(27.5), slogan: b(28), end: b(32) };
const WALLS = [ // slam order, one per beat
  { p: 7722.5, fam: 'putS', usd: '−$14.1M', kind: 'PUT WALL · SHORT γ' },
  { p: 7729.5, fam: 'putL', usd: '+$17.3M', kind: 'PUT WALL · LONG γ' },
  { p: 7737.5, fam: 'callL', usd: '+$6.8M', kind: 'CALL WALL · LONG γ' },
  { p: 7749.5, fam: 'callS', usd: '−$12.4M', kind: 'CALL WALL · SHORT γ' },
  { p: 7744.5, fam: 'callL', usd: '+$21.6M', kind: 'CALL WALL · LONG γ', star: true } ];
const PRINTS = [ { i: 12, p: 7740.25, q: '386' }, { i: 36, p: 7729.75, q: '742', gold: true }, { i: 41, p: 7729.75, q: '690', gold: true },
  { i: 47, p: 7729.75, q: '568', gold: true }, { i: 60, p: 7737.5, q: '455' }, { i: 72, p: 7743.0, q: '520' }, { i: 84, p: 7744.0, q: '860 ×2', gold: true } ];
const KEY = { p: 7729.75, q: '2,000', n: 3 };
const PREV = 7716.25;
const HITS = [b(0), b(2), b(4), b(5), b(6), b(7), b(8), b(9), b(10), b(11), b(12), b(13), b(14), b(16), b(18), b(19), b(20), b(21), b(22), b(23), b(24), b(25), b(26), b(28), b(29), b(30), b(31), b(32)];
const fmt = (p, d = 2) => p.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

// ---------- session progress (time-lapse, declared on screen) ----------
function nbars(t) { if (t < T.full) return 0; if (t < T.walls) return 52 * eo(lin(t, T.full, T.walls - b(0.1))); return 52 + (N - 52) * lin(t, T.walls, b(27)); }
function barAt(i, nb) { const bb = BARS[i]; if (i < Math.floor(nb)) return bb; if (i > Math.floor(nb) || i >= N) return null; const f = nb - Math.floor(nb); if (f <= 0.02) return null;
  const c = mix(bb.o, bb.c, f) + Math.sin(f * 17) * 0.5 * (1 - f); const cq = Math.round(c * 4) / 4;
  return { o: bb.o, c: cq, h: Math.max(bb.o, cq, mix(bb.o, bb.h, Math.min(1, f * 1.4))), l: Math.min(bb.o, cq, mix(bb.o, bb.l, Math.min(1, f * 1.4))), v: bb.v * f, d: bb.d * f }; }
function lastP(nb) { const i = Math.min(N - 1, Math.floor(nb)); const bb = barAt(i, nb) || BARS[Math.max(0, i - 1)]; return bb.c; }

// ---------- header (real Volwick layer row, wrapped to three rows like on the phone) ----------
const R = {};
function chipW(g, parts) { let w = 0; parts.forEach(([s, f]) => { g.font = f; w += g.measureText(s).width; }); return w; }
function layoutHeader() {
  const g = VW.g, F = '600 16px VWMono', L = '500 13px VWMono', Bd = '700 17px VWMono';
  const row = (y, items, x0) => { let x = x0; items.forEach(it => { const w = it.w || (chipW(g, it.parts) + (it.pad ?? 22)); R[it.id] = { x, y, w, h: 30, ...it }; x += w + (it.gap ?? 8); }); };
  g.save(); g.letterSpacing = '0px';
  row(HDR1 + 5, [ { id: 'logo', w: 112, gap: 14 }, { id: 'sep1', w: 2, gap: 12 }, { id: 'tick', parts: [['● ', F], ['ES ', Bd], ['7,734.50', Bd], ['  +0.26%  ', L], ['▾', L]], pad: 26 }, { id: 'tf', parts: [['1m', Bd]], pad: 26 } ], WIN.x0 + 12);
  row(HDR1 + 45, [ { id: 'gDealer', parts: [['DEALER', L]], pad: 4, gap: 8 }, { id: 'walls', parts: [['WALLS ', L], ['Top 5', F], [' ▾', L]] }, { id: 'metric', parts: [['METRIC ', L], ['GEX', F], [' ▾', L]] },
    { id: 'expiry', parts: [['EXPIRY ', L], ['All', F], [' ▾', L]] }, { id: 'maps', parts: [['MAPS ', L], ['Gamma', F], [' ▾', L]] } ], WIN.x0 + 12);
  row(HDR1 + 85, [ { id: 'gAct', parts: [['ACTIVITY', L]], pad: 2, gap: 10 },
    { id: 'bp', parts: [['BLOCK PRINTS', Bd], ['  ▾', L]], pad: 60, gap: 6 }, { id: 'cvd', parts: [['CVD', Bd]], pad: 54, gap: 6 }, { id: 'cdi', parts: [['CDI', Bd]], pad: 54, gap: 6 }, { id: 'flow', parts: [['FLOW', Bd]], pad: 54 } ], WIN.x0 + 12);
  g.restore();
}
// order in which the chips cut in (16th notes inside the punch-in beats)
const CHIP_IN = { logo: 4, sep1: 4, tick: 4.25, tf: 4.5, gDealer: 5, walls: 5, metric: 5.25, expiry: 5.5, maps: 5.75, eslv: 6, sep2: 6, gAct: 6, bp: 6.25, cvd: 6.375, cdi: 6.5, flow: 6.625, guide: 6.75, mi: 6.875 };
const chipK = (id, t) => eo(lin(t, b(CHIP_IN[id]), b(CHIP_IN[id]) + 0.09));

function box(x, y, w, h, fill, stroke, r = 6, lw = 1) { const g = VW.g; VW.roundRect(x, y, w, h, r); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); } }
function txt(s, x, y, font, col, align = 'left', base = 'middle') { const g = VW.g; g.font = font; g.fillStyle = col; g.textAlign = align; g.textBaseline = base; g.fillText(s, x, y); return g.measureText(s).width; }
function toggle(x, y, on, col) { const g = VW.g; box(x, y - 8, 30, 16, on ? col : '#1E2229', on ? null : '#2A2F38', 8); g.fillStyle = on ? '#FFFFFF' : '#5B6270'; g.beginPath(); g.arc(on ? x + 22 : x + 8, y, 5.5, 0, 7); g.fill(); }
const DK = { bg: '#000000', panel: '#0E0F13', chip: '#16171B', chipB: '#22252C', lab: '#6B7280', val: '#E8ECF2', sep: '#2F6BFF', grid: 'rgba(255,255,255,0.045)', axis: '#8A93A3' };

function darkHeader(t, nb) {
  const g = VW.g; g.fillStyle = DK.panel; g.fillRect(WIN.x0, HDR1, WIN.x1 - WIN.x0, HDR - HDR1); g.fillStyle = '#1A1D24'; g.fillRect(WIN.x0, HDR - 1, WIN.x1 - WIN.x0, 1);
  const L = '500 13px VWMono', F = '600 16px VWMono', Bd = '700 17px VWMono', lp = nb > 0 ? lastP(nb) : 7738.0, ch = (lp - PREV) / PREV * 100;
  const pop = (id, fn) => { const k = chipK(id, t); if (k <= 0) return; const r = R[id]; g.save(); g.globalAlpha *= k; const s = 0.86 + 0.14 * k; g.translate(r.x + r.w / 2, r.y + r.h / 2); g.scale(s, s); g.translate(-(r.x + r.w / 2), -(r.y + r.h / 2)); fn(r); g.restore(); };
  const chip = (r, hl) => box(r.x, r.y, r.w, r.h, hl ? '#1B1F28' : DK.chip, hl ? '#3A4252' : DK.chipB, 6);
  const pulse = (r, col, t0) => { const k = VW.punch([t0], t, 0.12); if (k > 0.02) { g.save(); g.strokeStyle = VW.rgba(col, 0.9 * k); g.lineWidth = 2.5; g.shadowColor = col; g.shadowBlur = 18 * k; box(r.x - 3, r.y - 3, r.w + 6, r.h + 6, null, VW.rgba(col, 0.9 * k), 8, 2.5); g.restore(); } };
  pop('logo', r => { const wm = VW.assets.wm, wh = 20, ww = wh * wm.width / wm.height; g.save(); g.globalCompositeOperation = 'lighter'; g.drawImage(wm, r.x, r.y + 15 - wh / 2, ww, wh); g.restore(); });
  pop('sep1', r => { g.fillStyle = DK.sep; g.fillRect(r.x, r.y + 4, 2, 22); });
  pop('tick', r => { chip(r); let x = r.x + 12; const y = r.y + 15; g.fillStyle = '#2FB67C'; g.beginPath(); g.arc(x + 4, y, 4, 0, 7); g.fill(); x += 16;
    x += txt('ES ', x, y + 1, Bd, '#6E9BFF'); x += txt(fmt(lp), x, y + 1, Bd, DK.val) + 8;
    const cs = (ch >= 0 ? '+' : '') + ch.toFixed(2) + '%'; g.font = L; const cw = g.measureText(cs).width + 12; box(x, y - 10, cw, 20, ch >= 0 ? 'rgba(47,182,124,0.18)' : 'rgba(226,87,95,0.18)', null, 4); txt(cs, x + 6, y + 1, L, ch >= 0 ? '#2FB67C' : '#E2575F'); x += cw + 8; txt('▾', x, y + 1, L, DK.lab); });
  pop('tf', r => { chip(r); txt('1m', r.x + r.w / 2, r.y + 16, Bd, DK.val, 'center'); });
  pop('gDealer', r => txt('DEALER', r.x, r.y + 16, L, DK.lab));
  const mapsOn = t >= T.maps;
  for (const [id, lab, val] of [['walls', 'WALLS ', 'Top 5'], ['metric', 'METRIC ', 'GEX'], ['expiry', 'EXPIRY ', 'All'], ['maps', 'MAPS ', mapsOn ? 'Gamma' : 'None']])
    pop(id, r => { chip(r, (id === 'walls' && t >= T.walls && t < T.maps) || (id === 'maps' && t >= T.maps && t < T.cvd)); let xx = r.x + 11; const yy = r.y + 16; xx += txt(lab, xx, yy, L, id === 'walls' ? '#6E8BFF' : DK.lab); xx += txt(val, xx, yy, F, DK.val); txt(' ▾', xx, yy, L, DK.lab); });
  pop('gAct', r => txt('ACTIVITY', r.x, r.y + 16, L, DK.lab));
  const bpOn = t >= T.prints, cvdOn = t >= T.cvd;
  pop('bp', r => { box(r.x, r.y, r.w, r.h, bpOn ? 'rgba(242,193,78,0.12)' : 'rgba(242,193,78,0.04)', 'rgba(242,193,78,0.75)', 6, 1.4); toggle(r.x + 10, r.y + 15, bpOn, '#F2C14E');
    txt('BLOCK PRINTS', r.x + 48, r.y + 16, Bd, '#F5E6B8'); g.fillStyle = 'rgba(242,193,78,0.6)'; g.fillRect(r.x + r.w - 26, r.y + 7, 1, 16); txt('▾', r.x + r.w - 16, r.y + 16, L, '#F2C14E'); });
  for (const [id, lab, on] of [['cvd', 'CVD', cvdOn], ['cdi', 'CDI', false], ['flow', 'FLOW', false]])
    pop(id, r => { box(r.x, r.y, r.w, r.h, on ? '#121A33' : DK.chip, on ? '#2F4FA8' : DK.chipB, 6); toggle(r.x + 10, r.y + 15, on, '#2F6BFF'); txt(lab, r.x + 46, r.y + 16, Bd, DK.val); });
  pulse(R.walls, '#6E8BFF', T.walls); pulse(R.maps, '#F59228', T.maps); pulse(R.cvd, '#2F6BFF', T.cvd); pulse(R.bp, '#F2C14E', T.prints);
}

// ---------- chart layers (drawn exactly like the terminal) ----------
function gammaG(p, col) { const flip = 7740.25 + 0.25 * Math.sin(col * 1.3);
  if (p > flip) return -Math.min(117, 40 + (p - flip) * 18) * (1 + 0.08 * Math.sin(col * 0.7));
  if (p < 7725) return -Math.min(90, (7725 - p) * 22);
  return Math.min(110, 30 + 70 * Math.exp(-Math.pow((p - 7732) / 5, 2))) * (1 + 0.06 * Math.cos(col)); }
function gammaMap(nb, a, ybot) { if (a <= 0) return; const g = VW.g; g.save(); g.globalAlpha = a; const kmax = Math.ceil(nb);
  for (let c0 = 0; c0 < kmax; c0 += 5) { const xa = X(c0) - SP / 2, xb = X(Math.min(c0 + 5, kmax)) - SP / 2;
    for (let p = 7716; p < PTOP; p += 0.5) { const v = gammaG(p + 0.25, c0 / 5), k = Math.min(1, Math.abs(v) / 117); if (Y(p) > ybot + PX) continue;
      g.fillStyle = v > 0 ? `rgba(47,107,255,${0.035 + 0.13 * k})` : `rgba(245,146,40,${0.035 + 0.14 * k})`; g.fillRect(xa, Y(p + 0.5), xb - xa + 0.5, PX / 2 + 0.5); }
    const flip = 7740.25 + 0.25 * Math.sin(c0 / 5 * 1.3); g.fillStyle = 'rgba(255,255,255,0.85)'; g.fillRect(xa, Y(flip) - 1, xb - xa, 2);
    if (c0 > 0) { const pf = 7740.25 + 0.25 * Math.sin((c0 / 5 - 1) * 1.3); g.fillRect(xa - 1, Math.min(Y(flip), Y(pf)) - 1, 2, Math.abs(Y(flip) - Y(pf)) + 2); } }
  mapLegend(CX0 + 14, HDR + 22); g.restore(); }
function mapLegend(lx, ly) { const g = VW.g; box(lx - 8, ly - 15, 404, 30, 'rgba(14,15,19,0.9)', '#22252C', 5);
  let x = lx + txt('MAP · GAMMA ', lx, ly, '700 13px VWMono', '#C9D1DD'); x += txt('≤−117.3 ', x, ly, '500 13px VWMono', '#F59228');
  const gr = g.createLinearGradient(x, 0, x + 70, 0); gr.addColorStop(0, '#F59228'); gr.addColorStop(0.5, '#1A1D24'); gr.addColorStop(1, '#2F6BFF'); g.fillStyle = gr; g.fillRect(x, ly - 4, 70, 8); x += 76;
  x += txt('≥+117.3', x, ly, '500 13px VWMono', '#6E9BFF'); txt(' M$ per point', x, ly, '500 13px VWMono', '#6B7280'); }
function candles(nb, ybot) { const g = VW.g, w = 5.5;
  for (let i = 0; i <= Math.min(N - 1, Math.floor(nb)); i++) { const bb = barAt(i, nb); if (!bb) continue; const x = Math.round(X(i)), col = bb.c >= bb.o ? '#2FB67C' : '#E2575F'; g.fillStyle = col;
    g.fillRect(x - 0.75, Y(bb.h), 1.5, Y(bb.l) - Y(bb.h)); const y0 = Y(Math.max(bb.o, bb.c)), y1 = Y(Math.min(bb.o, bb.c)); g.fillRect(x - w / 2, y0, w, Math.max(1.5, y1 - y0));
    const vh = Math.min(40, bb.v / 3600 * 40); g.globalAlpha = 0.4; g.fillRect(x - w / 2, ybot - vh, w, vh); g.globalAlpha = 1; } }
function wallLine(w, a, grow, glow = 0) { if (a <= 0) return; const g = VW.g, col = VX.WALL[w.fam], y = Math.round(Y(w.p)) + 0.5, xr = CX1 - 212, xl = mix(xr, CX0, grow); g.save(); g.globalAlpha = a;
  const gr = g.createLinearGradient(xl, 0, xr, 0); gr.addColorStop(0, VW.rgba(col, 0.05)); gr.addColorStop(1, VW.rgba(col, 0.9)); g.strokeStyle = gr; g.lineWidth = 2 + 2 * glow; g.shadowColor = VW.rgba(col, 0.9); g.shadowBlur = 8 + 26 * glow;
  g.beginPath(); g.moveTo(xl, y); g.lineTo(xr, y); g.stroke(); g.shadowBlur = 0; g.fillStyle = col; g.beginPath(); g.arc(xr + 6, y, 4.5 + 3 * glow, 0, 7); g.fill();
  g.shadowColor = 'rgba(0,0,0,0.95)'; g.shadowBlur = 6; txt((w.star ? '★ ' : '') + fmt(w.p, 1) + ' · ' + w.usd, xr + 16, y + 1, '700 15px VWMono', col); g.restore(); }
function printMark(pr, a, grow = 1, nb = N) { if (a <= 0 || pr.i > nb - 0.5) return; const g = VW.g, x = X(pr.i), y = Y(pr.p), left = pr.i >= 80; g.save(); g.globalAlpha = a;
  g.fillStyle = '#FFFFFF'; g.shadowColor = 'rgba(255,255,255,0.6)'; g.shadowBlur = 6; g.fillRect(x - 14 * grow, y - 2.5, 28 * grow, 5); g.shadowBlur = 0;
  const s = pr.q; g.font = '700 14px VWMono'; const tw = g.measureText(s).width + 14, px = left ? x - 20 - tw : x + 20;
  if (pr.gold) { g.fillStyle = VX.GOLD; g.save(); g.translate(left ? x - 13 : x + 13, y); g.rotate(Math.PI / 4); g.fillRect(-4, -4, 8, 8); g.restore(); }
  box(px, y - 11, tw, 22, pr.gold ? VX.GOLD : '#E9EDF3', null, 4); txt(s, px + tw / 2, y + 1, '700 14px VWMono', pr.gold ? '#1A1300' : '#0B1220', 'center'); g.restore(); }
function keyLevel(a, x0 = CX0, x1 = CX1, yy = null) { if (a <= 0) return; const g = VW.g, y = Math.round(yy ?? Y(KEY.p)) + 0.5; g.save(); g.globalAlpha = a; g.strokeStyle = 'rgba(242,193,78,0.85)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.stroke();
  const s = `★★ ${KEY.p.toFixed(2)}  ${KEY.q} · ${KEY.n} blocks`; g.font = '700 13px VWMono'; const tw = g.measureText(s).width + 20, x = x0 + 6;
  g.fillStyle = '#14120A'; g.strokeStyle = VX.GOLD; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x, y - 12); g.lineTo(x + tw, y - 12); g.lineTo(x + tw + 9, y); g.lineTo(x + tw, y + 12); g.lineTo(x, y + 12); g.closePath(); g.fill(); g.stroke();
  txt(s, x + 9, y + 1, '700 13px VWMono', '#F5DE9A'); g.restore(); }
function cvdPane(nb, a, y0, y1) { if (a <= 0) return; const g = VW.g; g.save(); g.globalAlpha = a; g.fillStyle = '#000'; g.fillRect(CX0, y0, WIN.x1 - CX0, y1 - y0); g.fillStyle = '#1A1D24'; g.fillRect(CX0, y0, WIN.x1 - CX0, 1);
  const pts = []; let cum = 0; for (let i = 0; i <= Math.min(N - 1, Math.floor(nb)); i++) { const bb = barAt(i, nb); if (!bb) break; cum += bb.d; pts.push([X(i), cum]); } if (pts.length < 2) { g.restore(); return; }
  const vals = pts.map(p => p[1]), mn = Math.min(...vals), mx = Math.max(...vals), yv = v => y1 - 12 - (v - mn) / (mx - mn || 1) * (y1 - y0 - 40);
  g.save(); g.beginPath(); g.rect(CX0, y0, CX1 - CX0, y1 - y0); g.clip(); g.beginPath(); pts.forEach(([x, v], j) => j ? g.lineTo(x, yv(v)) : g.moveTo(x, yv(v)));
  g.strokeStyle = '#2FB67C'; g.lineWidth = 2; g.stroke(); g.lineTo(pts[pts.length - 1][0], y1); g.lineTo(pts[0][0], y1); g.closePath(); g.fillStyle = 'rgba(47,182,124,0.16)'; g.fill(); g.restore();
  const v = cum / 1000; txt('CVD', CX0 + 12, y0 + 16, '700 13px VWMono', '#8A93A3'); txt((v >= 0 ? '+' : '') + v.toFixed(2) + 'K contracts', CX0 + 50, y0 + 16, '600 13px VWMono', '#2FB67C');
  box(CX1 + 4, yv(cum) - 11, WIN.x1 - CX1 - 10, 22, '#2FB67C', null, 3); txt((v >= 0 ? '+' : '') + v.toFixed(2) + 'K', (CX1 + WIN.x1) / 2, yv(cum) + 1, '700 13px VWMono', '#00140A', 'center'); g.restore(); }
function timeAxis(y) { for (let i = 0; i < N; i++) { const m = 10 * 60 + i; if (m % 15) continue; txt(Math.floor(m / 60) + ':' + String(m % 60).padStart(2, '0'), X(i), y, '500 14px VWMono', '#8A93A3', 'center'); } }

function terminal(t) {
  const g = VW.g, nb = nbars(t), cvdK = eio(lin(t, T.cvd, T.cvd + 0.3)), ybot = mix(1456, 1370, cvdK);
  const bodyK = eo(lin(t, T.full - b(0.2), T.full + b(0.15)));
  g.save(); VW.roundRect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0, 12); g.clip(); g.save(); g.globalAlpha = bodyK; g.fillStyle = DK.bg; g.fillRect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0); g.restore();
  const chartK = eo(lin(t, T.full - b(0.25), T.full + b(0.25)));
  g.save(); g.globalAlpha = chartK; g.beginPath(); g.rect(CX0, HDR, CX1 - CX0, ybot - HDR); g.clip();
  g.fillStyle = DK.grid; for (let i = 0; i < N; i++) if (i % 5 === 0) g.fillRect(Math.round(X(i)), HDR, 1, ybot - HDR);
  gammaMap(nb, eo(lin(t, T.maps, T.maps + 0.3)) * 0.95, ybot);
  candles(nb, ybot);
  WALLS.forEach((w, j) => { const t0 = T.walls + b(j), k = eo(lin(t, t0, t0 + 0.13)); wallLine(w, k > 0 ? 1 : 0, k, VW.punch([t0 + 0.13], t, w.star ? 0.22 : 0.14)); });
  PRINTS.forEach((pr, j) => { const t0 = T.prints + b(0.25 * j) * 0.5; printMark(pr, eo(lin(t, t0, t0 + 0.12)), eo(lin(t, t0, t0 + 0.12)), nb); });
  keyLevel(t >= T.dock + b(0.5) ? 1 : 0);
  g.restore();
  // price axis
  g.save(); g.globalAlpha = bodyK; g.fillStyle = '#000'; g.fillRect(CX1, HDR, WIN.x1 - CX1, WIN.y1 - HDR); g.restore();
  if (chartK > 0) { g.save(); g.globalAlpha = chartK; g.beginPath(); g.rect(CX1, HDR, WIN.x1 - CX1, ybot - HDR); g.clip();
    for (let p = 7720; p <= 7752; p += 4) txt(fmt(p), (CX1 + WIN.x1) / 2, Y(p), '500 14px VWMono', DK.axis, 'center');
    if (nb > 1) { const lp = lastP(nb); box(CX1 + 2, Y(lp) - 12, WIN.x1 - CX1 - 6, 24, '#E9EDF3', null, 3); txt(fmt(lp), (CX1 + WIN.x1) / 2, Y(lp) + 1, '700 14px VWMono', '#0B1220', 'center'); }
    g.restore();
    cvdPane(nb, cvdK * chartK, ybot + 4, 1452); g.save(); g.globalAlpha = chartK; timeAxis(1472); txt('ET', WIN.x1 - 30, 1472, '500 13px VWMono', DK.lab, 'center'); g.restore(); }
  darkHeader(t, nb);
  g.restore();
  g.save(); g.globalAlpha = bodyK; box(WIN.x0 + 0.5, WIN.y0 + 0.5, WIN.x1 - WIN.x0 - 1, WIN.y1 - WIN.y0 - 1, null, 'rgba(255,255,255,0.10)', 12); g.restore();
}

// ---------- camera: hard punch-ins on the beat ("a scatti"), then the full window ----------
function cam(t) {
  const shots = [ [b(4), 1.95, 330, 535], [b(5), 1.8, 395, 575], [b(6), 1.75, 640, 615], [b(6.75), 2.0, 760, 535] ];
  if (t < T.full) { let s = shots[0]; shots.forEach(q => { if (t >= q[0]) s = q; }); const drift = 1 + 0.05 * lin(t, s[0], s[0] + B); return { s: s[1] * drift, fx: s[2], fy: s[3], cy: 900 }; }
  const k = eio(lin(t, T.full, T.full + b(0.75))); const s = mix(2.0, 1, k), fx = mix(540, 518, k), fy = mix(700, 1005, k);
  // a slight push toward the walls during the drop, and a push into the key level on the prints
  const push = 1 + 0.025 * seg(t, T.walls, b(13)) - 0.025 * seg(t, b(13), b(14)) + 0.035 * seg(t, T.prints, T.dock) * (1 - seg(t, T.dock, T.dock + b(0.6)));
  return { s: s * push, fx, fy: mix(fy, Y(KEY.p), 0.35 * seg(t, T.prints, T.dock) * (1 - seg(t, T.dock, T.dock + b(0.6)))), cy: 1005 };
}

// ---------- intro: the logo switches on ----------
function intro(t) { if (t > T.hdr + 0.05) return; const g = VW.g;
  // neon ignition: flicker on 16ths, then steady; light streak on the downbeat
  const fl = [1, 0.15, 0.9, 0.3, 1], step = Math.floor(lin(t, 0.04, b(1)) * 4.99), k = t < b(1) ? fl[step] * eo(lin(t, 0, 0.08)) : 1;
  const out = 1 - eo(lin(t, b(3.5), b(4)));
  const sx = mix(-300, 1380, eo(lin(t, 0, b(1)))); const gr = g.createLinearGradient(sx - 320, 0, sx + 320, 0); gr.addColorStop(0, 'rgba(90,140,255,0)'); gr.addColorStop(0.5, 'rgba(170,200,255,0.95)'); gr.addColorStop(1, 'rgba(90,140,255,0)');
  g.save(); g.globalAlpha = 1 - lin(t, b(1), b(1.6)); g.fillStyle = gr; g.fillRect(0, 818, 1080, 4); g.restore();
  // monogram, then the wordmark snaps in on beat 2; on beat 3.5 everything collapses into one line (the header rule)
  const sq = 1 - eio(lin(t, b(3.5), b(4))); const cy = mix(820, HDR1 + 60, eio(lin(t, b(3.5), b(4))));
  g.save(); g.translate(540, cy); g.scale(1 + 0.6 * (1 - sq), Math.max(0.004, sq)); g.translate(-540, -cy);
  const size = 600 * (1.18 - 0.18 * eo(lin(t, 0, b(1.5)))) * (1 + 0.04 * VW.punch([b(2)], t, 0.08)), blur = (1 - eo(lin(t, 0, b(1)))) * 16;
  g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = k; g.filter = `blur(${blur}px)`; g.drawImage(VW.assets.mono, 540 - size / 2, 760 - size / 2, size, size); g.filter = 'none';
  const wa = t >= b(2) ? 1 : 0; if (wa) { const wm = VW.assets.wm, ww = 800 * (1 + 0.08 * Math.exp(-(t - b(2)) * 14)), wh = ww * wm.height / wm.width; g.globalAlpha = 1; g.drawImage(wm, 540 - ww / 2, 1110 - wh / 2, ww, wh); g.globalAlpha = 0.5 * VW.punch([b(2)], t, 0.1); g.drawImage(wm, 540 - ww / 2, 1110 - wh / 2, ww, wh); }
  g.restore(); g.restore();
  if (out < 1) { g.save(); g.globalAlpha = (1 - out) * (1 - lin(t, b(4), b(4) + 0.05)); g.fillStyle = '#8AB6FF'; g.shadowColor = '#5A8CFF'; g.shadowBlur = 20; g.fillRect(96, cy - 1.5, 844, 3); g.restore(); }
}

// ---------- big type above the window ----------
function bigLabel(t) { const g = VW.g; let cur = null;
  WALLS.forEach((w, j) => { const t0 = T.walls + b(j); if (t >= t0 && t < t0 + B) cur = { t0, top: w.kind, big: w.usd, col: VX.WALL[w.fam], star: w.star }; });
  if (t >= T.maps && t < T.cvd) cur = { t0: T.maps, top: 'EXPOSURE MAPS', big: 'GAMMA', col: '#F59228' };
  if (t >= T.cvd && t < T.cvd + b(2)) cur = { t0: T.cvd, top: 'ACTIVITY', big: 'CVD', col: '#8AB6FF' };
  if (t >= T.prints && t < T.dim) cur = { t0: T.prints, top: 'ACTIVITY', big: 'BLOCK PRINTS', col: VX.GOLD };
  if (!cur) return; const k = eo(lin(t, cur.t0, cur.t0 + 0.1)), pk = VW.punch([cur.t0 + 0.02], t, 0.09);
  g.save(); g.globalAlpha = k; g.textAlign = 'center'; g.textBaseline = 'middle'; g.letterSpacing = '3px'; g.font = '700 28px VWMono'; g.fillStyle = '#C9D1DD'; g.fillText(cur.top, 540, 372);
  g.letterSpacing = '0px'; const sz = (cur.big.length > 8 ? 96 : 116) * (1 + 0.08 * pk); g.font = `700 ${sz}px VWSans`; g.fillStyle = cur.col; g.shadowColor = VW.rgba(cur.col, 0.8); g.shadowBlur = 26 + 30 * pk; g.fillText((cur.star ? '★ ' : '') + cur.big, 540, 448 + (1 - k) * 16); g.restore(); }

// ---------- "2,000" built from pixels ----------
let PIX = null;
function pixels() { const c = document.createElement('canvas'); c.width = 820; c.height = 260; const o = c.getContext('2d'); o.fillStyle = '#fff'; o.font = '700 230px VWMono'; o.textAlign = 'center'; o.textBaseline = 'middle'; o.fillText('2,000', 410, 140);
  const d = o.getImageData(0, 0, 820, 260).data, out = [], Rn = VW.rng(11), S = 13; for (let y = 0; y < 260; y += S) for (let x = 0; x < 820; x += S) if (d[((y + 6) * 820 + x + 6) * 4 + 3] > 110) out.push({ x, y, dx: (Rn() - 0.5) * 1300, dy: (Rn() - 0.5) * 1700, d: Rn() * 0.42, f: Rn() }); PIX = out; }
function megaPrint(t) { if (t < T.dim || t > T.dock + b(0.6)) return; const g = VW.g;
  const dim = eo(lin(t, T.dim, T.dim + 0.15)) * (1 - eo(lin(t, T.dock, T.dock + b(0.5)))); g.fillStyle = `rgba(1,3,8,${0.82 * dim})`; g.fillRect(0, 0, 1080, 1920);
  const ox = 130, oy = 820, dock = eio(lin(t, T.dock, T.dock + b(0.5))), tx = 200, ty = 1005 + (Y(KEY.p) - 1005) * 1; // docks into the key level label
  PIX.forEach(p => { const k = eo(clamp((t - T.dim - p.d) / (T.num - T.dim - 0.42), 0, 1)); let x = ox + p.x + p.dx * (1 - k), y = oy + p.y + p.dy * (1 - k);
    x = mix(x, tx + p.x * 0.09, dock); y = mix(y, ty + (p.y - 130) * 0.09, dock); const sz = mix(11, 1.5, dock);
    const tw = k < 1 ? 0.35 + 0.65 * k * (0.6 + 0.4 * Math.sin(t * 40 + p.f * 9)) : 1; g.fillStyle = VW.rgba(VX.GOLD, tw * (1 - dock * 0.6)); g.fillRect(x, y, sz, sz); });
  const lk = eo(lin(t, T.num, T.num + 0.12)) * (1 - dock); if (lk > 0) { g.save(); g.globalAlpha = lk; g.textAlign = 'center'; g.textBaseline = 'middle'; g.letterSpacing = '6px';
    g.font = '700 44px VWMono'; g.fillStyle = '#FFFFFF'; g.fillText('CONTRACTS · ONE PRICE', 540, 1150); g.font = '700 36px VWMono'; g.fillStyle = VX.GOLD; g.letterSpacing = '3px'; g.fillText('★★ 7729.75 · 3 BLOCKS', 540, 1215); g.restore(); }
  const top = eo(lin(t, T.dim, T.dim + 0.1)) * (1 - dock); if (top > 0) { g.save(); g.globalAlpha = top; g.textAlign = 'center'; g.font = '700 28px VWMono'; g.letterSpacing = '3px'; g.fillStyle = '#C9D1DD'; g.fillText('BLOCK PRINTS', 540, 700); g.restore(); }
}

// ---------- layer cards (each one a real piece of the terminal) ----------
const CARDS = [ { t: 'DEALER WALLS', col: '#26C08A' }, { t: 'BLOCK PRINTS', col: VX.GOLD }, { t: 'CVD', col: '#2FB67C' }, { t: 'CDI', col: '#E2575F' }, { t: 'EXPOSURE MAPS', col: '#F59228' }, { t: 'OPTIONS FLOW', col: '#2F6BFF' } ];
const CW = 600, CH = 380; let CIMG = [];
function buildCards() { const main = VW.g;
  CARDS.forEach((cd, i) => { const c = document.createElement('canvas'); c.width = CW; c.height = CH; const o = c.getContext('2d'); VW.g = o; const g = o;
    g.fillStyle = '#000'; VW.roundRect(0, 0, CW, CH, 18); g.fill(); g.save(); VW.roundRect(0, 0, CW, CH, 18); g.clip();
    g.fillStyle = '#0E0F13'; g.fillRect(0, 0, CW, 64); g.fillStyle = '#1A1D24'; g.fillRect(0, 63, CW, 1);
    if (i === 1) { box(16, 14, 300, 36, 'rgba(242,193,78,0.12)', 'rgba(242,193,78,0.75)', 7, 1.4); toggle(28, 32, true, '#F2C14E'); txt('BLOCK PRINTS', 68, 33, '700 20px VWMono', '#F5E6B8'); }
    else if (i === 2 || i === 3) { box(16, 14, 140, 36, '#121A33', '#2F4FA8', 7); toggle(28, 32, true, '#2F6BFF'); txt(cd.t, 68, 33, '700 20px VWMono', DK.val); }
    else if (i === 0) { box(16, 14, 210, 36, '#1B1F28', '#3A4252', 7); let x = 28 + txt('WALLS ', 28, 33, '500 16px VWMono', '#6E8BFF'); x += txt('Top 5', x, 33, '600 19px VWMono', DK.val); txt(' ▾', x, 33, '500 16px VWMono', DK.lab);
      box(236, 14, 170, 36, DK.chip, DK.chipB, 7); x = 248 + txt('METRIC ', 248, 33, '500 16px VWMono', DK.lab); x += txt('GEX', x, 33, '600 19px VWMono', DK.val); }
    else if (i === 4) { box(16, 14, 220, 36, '#1B1F28', '#3A4252', 7); let x = 28 + txt('MAPS ', 28, 33, '500 16px VWMono', DK.lab); x += txt('Gamma', x, 33, '600 19px VWMono', DK.val); txt(' ▾', x, 33, '500 16px VWMono', DK.lab); }
    else { box(16, 14, 150, 36, '#121A33', '#2F4FA8', 7); toggle(28, 32, true, '#2F6BFF'); txt('FLOW', 68, 33, '700 20px VWMono', DK.val); }
    const y0 = 64, y1 = CH, ch = y1 - y0, py = (p, a, z) => y0 + 30 + (a - p) / (a - z) * (ch - 60);
    const mini = (from, to, a, z, x0 = 20, x1 = 440, w = 4) => { const n = to - from, sp = (x1 - x0) / n; for (let j = 0; j < n; j++) { const bb = BARS[from + j], x = x0 + j * sp, col = bb.c >= bb.o ? '#2FB67C' : '#E2575F'; g.fillStyle = col;
      g.fillRect(x - 0.75, py(bb.h, a, z), 1.5, py(bb.l, a, z) - py(bb.h, a, z)); const ya = py(Math.max(bb.o, bb.c), a, z), yb = py(Math.min(bb.o, bb.c), a, z); g.fillRect(x - w / 2, ya, w, Math.max(1.5, yb - ya)); } return sp; };
    if (i === 0) { const a = 7752, z = 7720; mini(30, 92, a, z, 20, 350); WALLS.slice().sort((p, q) => q.p - p.p).forEach(w => { const col = VX.WALL[w.fam], y = py(w.p, a, z) + 0.5, gr = g.createLinearGradient(20, 0, 352, 0); gr.addColorStop(0, VW.rgba(col, 0.05)); gr.addColorStop(1, VW.rgba(col, 0.95));
        g.strokeStyle = gr; g.lineWidth = w.star ? 3.5 : 2.5; g.shadowColor = col; g.shadowBlur = 10; g.beginPath(); g.moveTo(20, y); g.lineTo(352, y); g.stroke(); g.shadowBlur = 0; g.fillStyle = col; g.beginPath(); g.arc(358, y, 5, 0, 7); g.fill();
        txt((w.star ? '★ ' : '') + fmt(w.p, 1) + ' · ' + w.usd, 370, y + 1, '700 17px VWMono', col); }); }
    if (i === 1) { const a = 7746, z = 7727; mini(28, 92, a, z, 20, 560); const sp = 540 / 64; const yk = py(KEY.p, a, z);
      g.strokeStyle = 'rgba(242,193,78,0.85)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(0, yk); g.lineTo(CW, yk); g.stroke();
      PRINTS.filter(p => p.i >= 28).forEach(pr => { const x = 20 + (pr.i - 28) * sp, y = py(pr.p, a, z); g.fillStyle = '#FFF'; g.fillRect(x - 13, y - 2.5, 26, 5); g.font = '700 16px VWMono'; const tw = g.measureText(pr.q).width + 14, left = pr.i >= 72, px = left ? x - 20 - tw : x + 20;
        if (pr.gold) { g.save(); g.fillStyle = VX.GOLD; g.translate(left ? x - 13 : x + 13, y); g.rotate(Math.PI / 4); g.fillRect(-4.5, -4.5, 9, 9); g.restore(); } box(px, y - 12, tw, 24, pr.gold ? VX.GOLD : '#E9EDF3', null, 4); txt(pr.q, px + tw / 2, y + 1, '700 16px VWMono', pr.gold ? '#1A1300' : '#0B1220', 'center'); });
      const s = `★★ ${KEY.p.toFixed(2)}  ${KEY.q} · ${KEY.n} blocks`; g.font = '700 17px VWMono'; const tw = g.measureText(s).width + 22; g.fillStyle = '#14120A'; g.strokeStyle = VX.GOLD; g.lineWidth = 1.4;
      const kx = 252; g.beginPath(); g.moveTo(kx, yk - 15); g.lineTo(kx + tw, yk - 15); g.lineTo(kx + tw + 11, yk); g.lineTo(kx + tw, yk + 15); g.lineTo(kx, yk + 15); g.closePath(); g.fill(); g.stroke(); txt(s, kx + 10, yk + 1, '700 17px VWMono', '#F5DE9A'); }
    if (i === 2) { const a = 7746, z = 7727; mini(20, 92, a, z, 20, 500); const top = y0 + 200; g.fillStyle = '#1A1D24'; g.fillRect(0, top, CW, 1);
      let cum = 0; const pts = []; for (let j = 20; j < 92; j++) { cum += BARS[j].d; pts.push(cum); } const mn = Math.min(...pts), mx = Math.max(...pts), yv = v => CH - 14 - (v - mn) / (mx - mn) * 90;
      g.beginPath(); pts.forEach((v, j) => { const x = 20 + j * 480 / 72; j ? g.lineTo(x, yv(v)) : g.moveTo(x, yv(v)); }); g.strokeStyle = '#2FB67C'; g.lineWidth = 2.5; g.stroke(); g.lineTo(500, CH); g.lineTo(20, CH); g.closePath(); g.fillStyle = 'rgba(47,182,124,0.16)'; g.fill();
      txt('CVD', 16, top + 18, '700 16px VWMono', '#8A93A3'); txt('+' + (cum / 1000).toFixed(2) + 'K contracts', 62, top + 18, '600 16px VWMono', '#2FB67C');
      box(508, yv(cum) - 12, 80, 24, '#2FB67C', null, 3); txt('+' + (cum / 1000).toFixed(2) + 'K', 548, yv(cum) + 1, '700 15px VWMono', '#00140A', 'center'); }
    if (i === 3) { txt('C $1.8M · P $3.0M · Single-leg', 20, y0 + 30, '600 17px VWMono', '#C9D1DD'); const zy = y0 + 190, Rn = VW.rng(3); g.fillStyle = 'rgba(255,255,255,0.15)'; g.fillRect(16, zy, CW - 32, 1);
      for (let j = 0; j < 46; j++) { const x = 22 + j * 12, big = j === 31, up = big ? true : Rn() > 0.45, h = big ? 120 : 6 + Rn() * 34; g.fillStyle = up ? '#2FB67C' : '#E2575F'; if (up) g.fillRect(x, zy - h, 8, h); else g.fillRect(x, zy + 1, 8, h * 0.8);
        if (big) { box(x - 34, zy - h - 34, 76, 26, '#2FB67C', null, 4); txt('$7.2M', x + 4, zy - h - 20, '700 16px VWMono', '#00140A', 'center'); } } }
    if (i === 4) { const a = 7748, z = 7724; for (let c0 = 0; c0 < 15; c0++) { const xa = 20 + c0 * 38; for (let p = z; p < a; p += 0.5) { const v = gammaG(p + 0.25, c0), k = Math.min(1, Math.abs(v) / 117);
          g.fillStyle = v > 0 ? `rgba(47,107,255,${0.06 + 0.26 * k})` : `rgba(245,146,40,${0.06 + 0.28 * k})`; g.fillRect(xa, py(p + 0.5, a, z), 38.5, (ch - 60) / ((a - z) * 2) + 0.5); }
        const fl = 7740.25 + 0.25 * Math.sin(c0 * 1.3); g.fillStyle = 'rgba(255,255,255,0.9)'; g.fillRect(xa, py(fl, a, z) - 1, 38, 2.5); }
      mini(30, 92, a, z, 22, 586, 3.5); g.save(); g.scale(1.25, 1.25); mapLegend(18, 82); g.restore(); }
    if (i === 5) { // options flow: premium bought at the ask minus sold at the bid, cumulated from 09:30 (C, P, NET), single leg same day
      const top = y0 + 26, bot = CH - 30, n = 60, Rn = VW.rng(7); let c = 0, p = 0; const C = [], P = [], NT = [];
      for (let j = 0; j < n; j++) { c += (Rn() - 0.42) * 0.22; p += (Rn() - 0.58) * 0.20; C.push(c); P.push(p); NT.push(c - p); }
      const all = C.concat(P, NT), mn = Math.min(...all), mx = Math.max(...all), yv = v => bot - (v - mn) / (mx - mn) * (bot - top - 30), xv = j => 20 + j * 470 / (n - 1);
      g.fillStyle = 'rgba(255,255,255,0.12)'; g.fillRect(16, yv(0), CW - 32, 1);
      for (const [arr, col, lab] of [[C, '#2FB67C', 'C'], [P, '#E2575F', 'P'], [NT, '#6E9BFF', 'NET']]) { g.beginPath(); arr.forEach((v, j) => j ? g.lineTo(xv(j), yv(v)) : g.moveTo(xv(j), yv(v))); g.strokeStyle = col; g.lineWidth = lab === 'NET' ? 3 : 2.2; g.stroke();
        const v = arr[n - 1]; box(498, yv(v) - 12, 86, 24, col, null, 3); txt(lab + ' ' + (v >= 0 ? '+' : '−') + '$' + Math.abs(v).toFixed(1) + 'M', 541, yv(v) + 1, '700 13px VWMono', '#00140A', 'center'); }
      txt('Since 09:30 · single leg · same day', 22, y0 + 22, '600 16px VWMono', '#8A93A3'); }
    g.restore(); box(1, 1, CW - 2, CH - 2, null, VW.rgba(cd.col, 0.85), 18, 2.5);
    CIMG.push(c); });
  VW.g = main; }
const SLOT = [[322, 742], [748, 860], [322, 1010], [748, 1128], [322, 1278], [748, 1396]];
function cards(t) { if (t < T.cards || t > T.slogan + 0.05) return; const g = VW.g;
  g.fillStyle = `rgba(2,4,10,${0.9 * eo(lin(t, T.cards, T.cards + 0.12))})`; g.fillRect(0, 0, 1080, 1920);
  const fly = eio(lin(t, T.out, T.slogan)); // camera flies through the stack on the last half bar
  CARDS.forEach((cd, i) => { const t0 = T.cards + b(i); if (t < t0) return;
    const inK = eo(lin(t, t0, t0 + 0.11)), settle = eio(lin(t, t0 + b(0.5), t0 + b(0.95)));
    const bigS = 1.32, slotS = 0.62, s = mix(bigS, slotS, settle) * (0.7 + 0.3 * inK) * (1 + fly * (1.6 + 0.3 * i));
    const [sx, sy] = SLOT[i]; let x = mix(540, sx, settle), y = mix(930, sy, settle) - 22 * Math.sin(t * 2.1 + i) * settle; x = mix(x, 540 + (x - 540) * 3.2, fly); y = mix(y, 960 + (y - 960) * 3.2, fly);
    const rot = mix(0, (i % 2 ? 0.06 : -0.06) + 0.025 * Math.sin(t * 1.3 + i), settle), skew = mix(0, i % 2 ? -0.07 : 0.07, settle);
    g.save(); g.globalAlpha = inK * (1 - fly); g.translate(x + (1 - inK) * (i % 2 ? 260 : -260), y); g.rotate(rot); g.transform(1, skew * 0.4, skew, 1, 0, 0); g.scale(s, s);
    g.shadowColor = VW.rgba(cd.col, 0.55); g.shadowBlur = 50; g.drawImage(CIMG[i], -CW / 2, -CH / 2); g.shadowBlur = 0;
    // card title riding on top of the card
    const tk = 1 - settle * 0.25; g.globalAlpha *= tk; g.font = '700 30px VWMono'; g.letterSpacing = '3px'; g.textAlign = 'left'; g.textBaseline = 'bottom'; g.fillStyle = '#FFFFFF'; g.shadowColor = 'rgba(0,0,0,0.9)'; g.shadowBlur = 12;
    g.fillText(cd.t, -CW / 2 + 4, -CH / 2 - 12); g.restore(); });
  const k = eo(lin(t, T.one, T.one + 0.1)) * (1 - fly); if (k > 0) { g.save(); g.globalAlpha = k; g.font = '700 84px VWSans'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#FFF'; g.shadowColor = 'rgba(0,0,0,0.95)'; g.shadowBlur = 30;
    const s1 = 'ONE ', s2 = 'TERMINAL.', w1 = g.measureText(s1).width, w2 = g.measureText(s2).width; g.textAlign = 'left'; g.fillText(s1, 540 - (w1 + w2) / 2, 420); g.fillStyle = '#6E9BFF'; g.fillText(s2, 540 - (w1 + w2) / 2 + w1, 420); g.restore(); } }

// ---------- slogan, one word per beat, then it settles into the end card ----------
const WORDS = ['TRADE', 'WITH', 'INSTITUTIONAL', 'CONTEXT.'];
function slogan(t) { if (t < T.slogan || t > T.end + 0.3) return; const g = VW.g, out = 1 - eo(lin(t, T.end - 0.05, T.end + 0.25));
  WORDS.forEach((w, i) => { const t0 = T.slogan + b(i), k = eo(lin(t, t0, t0 + 0.12)); if (k <= 0) return; const pk = VW.punch([t0 + 0.02], t, 0.09);
    g.save(); g.font = '700 150px VWSans'; let size = 150 * Math.min(1, 840 / g.measureText(w).width) * (1 + 0.06 * pk);
    g.globalAlpha = k * out; g.filter = k < 1 ? `blur(${(1 - k) * 16}px)` : 'none'; g.font = `700 ${size}px VWSans`; g.textAlign = 'center'; g.textBaseline = 'middle';
    const blue = i === 2; g.fillStyle = blue ? '#6E9BFF' : '#F2F5FA'; if (blue) { g.shadowColor = 'rgba(90,140,255,0.9)'; g.shadowBlur = 40; }
    g.fillText(w, 540, 735 + i * 172 + (1 - k) * 30); g.restore(); }); }

// ---------- approved Volwick ending (VX.end): the session's price line folds into the V ----------
let ENDPTS = null;
function endCard(t) { if (t <= T.end) return;
  if (!ENDPTS) { const from = 40, a = 7746, z = 7727; ENDPTS = []; for (let i = from; i < N; i++) ENDPTS.push([140 + (i - from) * 800 / (N - 1 - from), 1100 - (BARS[i].c - z) / (a - z) * 380]); }
  const k = eo(lin(t, T.end, T.end + 0.25)), g = VW.g; g.save(); g.globalAlpha = k; g.fillStyle = '#040913'; g.fillRect(0, 0, 1080, 1920); g.restore();
  VX.end(t, ENDPTS, { t0: T.end, total: TOTAL, loop0: TOTAL - 0.45 }); }   // loop0 is required without voice: VX.end hides everything when it is missing

function disclosure(t) { const g = VW.g, a = eo(lin(t, T.full, T.full + 0.2)) * (1 - lin(t, T.slogan - 0.1, T.slogan)); if (a <= 0) return; g.save(); g.globalAlpha = a;
  txt('Simulated ES session. Time-lapse.', VW.SAFE.cx, 1514, '500 17px VWMono', '#7F8AA0', 'center');
  const d2 = lin(t, T.walls, T.walls + 0.2); if (d2 > 0) { g.globalAlpha = a * d2; txt('Dealer Walls: modeled options-derived positioning.', VW.SAFE.cx, 1539, '500 17px VWMono', '#7F8AA0', 'center'); } g.restore(); }

function shake(t) { const k = Math.min(1.2, VW.punch(HITS, t, 0.05)) * (t < T.end ? 1 : 0); return [Math.sin(t * 97) * 7 * k, Math.cos(t * 83) * 7 * k]; }
function flash(t) { const k = VW.punch([b(2), T.walls + b(4) + 0.13, T.prints, T.cards, T.slogan], t, 0.045); if (k > 0.02) { VW.g.fillStyle = `rgba(200,215,255,${0.13 * k})`; VW.g.fillRect(0, 0, 1080, 1920); } }

function render(t) {
  const g = VW.g; g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.filter = 'none';
  const bg = g.createLinearGradient(0, 0, 0, 1920); bg.addColorStop(0, '#060C1A'); bg.addColorStop(1, '#03060D'); g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  const hz = g.createRadialGradient(540, 980, 60, 540, 980, 1100); hz.addColorStop(0, `rgba(47,107,255,${0.08 + 0.10 * Math.min(1, VW.punch(HITS, t, 0.08))})`); hz.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = hz; g.fillRect(0, 0, 1080, 1920);
  const [sx, sy] = shake(t); g.save(); g.translate(sx, sy);
  if (t < T.hdr) intro(t);
  else if (t < T.slogan + 0.05) { const c = cam(t); g.save(); g.translate(540, c.cy); g.scale(c.s, c.s); g.translate(-c.fx, -c.fy); terminal(t); g.restore();
    if (t >= T.full) { VW.logoTL(eo(lin(t, T.full, T.full + 0.2)), '', 46, 24, true); bigLabel(t); disclosure(t); }
    megaPrint(t); cards(t); }
  if (t >= T.end) endCard(t);
  if (t >= T.slogan && t < T.end) { g.fillStyle = 'rgba(2,4,10,1)'; g.fillRect(0, 0, 1080, 1920); } slogan(t);
  g.restore(); flash(t);
  if (t < T.end) VW.vignette();
}
window.READY = (async () => {
  BARS = (await (await fetch('data.json')).json()).bars;
  PRINTS.forEach(pr => { const bb = BARS[pr.i]; bb.l = Math.min(bb.l, pr.p); bb.h = Math.max(bb.h, pr.p); });
  await VW.loadFonts(); await VW.loadBrand(); layoutHeader(); pixels(); buildCards();
  window.render = render; render(0);
  return { total: TOTAL, events: { bpm: BPM, beat: B, T, walls: WALLS.map((w, j) => T.walls + b(j)), hits: HITS, end: T.end } };
})();
