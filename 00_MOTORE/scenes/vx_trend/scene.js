// VX · TREND (from the "How to trade a trendline breakout" format). Act 1: the familiar retail tutorial on a white chart,
// respected, not mocked. Act 2: the same candles inside Volwick, where the break already had a reason under it.
const { seg, lin, eo, eio, mix, clamp } = VW;
const N = 44, LINE = i => 7724 + (i - 6) * 0.5;           // trendline through the lows at i=6, 16, 26
const DATA = VX.series([[0, 7727.5], [6, 7724.5], [11, 7731], [16, 7729.5], [21, 7736], [26, 7734.5], [30, 7740.5], [33, 7739.5], [35, 7734.5], [37, 7731.5], [40, 7726], [42, 7722.5], [43, 7723.5]], N, 11, 0.7);
// make the three touches exact and the break clean
[[6, 7724], [16, 7729], [26, 7734]].forEach(([i, p]) => { DATA[i].l = p; DATA[i].o = Math.max(DATA[i].o, p + 1); DATA[i].c = Math.max(DATA[i].c, p + 1.5); DATA[i].h = Math.max(DATA[i].h, DATA[i].o, DATA[i].c) + 0.25; });
const V = VX.view({ x0: 96, x1: 770, y0: 640, y1: 1420, pmin: 7717, pmax: 7755, n: N });
const WALLS = [ { p: 7751.25, fam: 'callL', usd: '+$24.5M', star: true }, { p: 7746.25, fam: 'callS', usd: '−$13.4M' },
  { p: 7733.25, fam: 'putS', usd: '−$16.9M' }, { p: 7721.25, fam: 'putL', usd: '+$14.6M' } ];
const MEGA = { i: 35, p: 7733.25, q: '2,000', gold: true };
let C, E = {};
function timeline() { C = VX.C;
  E.draw0 = -0.01; E.draw1 = 1.4; E.label1 = 1.6; E.works = C.s1[0]; E.breakA = C.s2[0] - 0.2; E.breakB = C.s2[1] + 0.2; E.pos = C.s2[1] - 0.1;
  E.zoom0 = C.s3[0] - 0.1; E.zoom1 = C.s3[1]; E.rev0 = C.s3[1] + 0.05; E.rev1 = C.s4[0] - 0.05;
  E.wall = C.s4[0] + 0.1; E.short = C.s5[0]; E.drop0 = C.s6[0] - 0.1; E.drop1 = C.s6[1] + 0.3; E.mega = C.s7[0] + 0.05;
  E.erase = C.s8[0]; E.ctx = C.s9[0] - 0.1; E.logo0 = C.logo0; }
function upto(t) { // candles shown
  if (t < E.breakA) return 28 + 2 * seg(t, E.works - 0.5, E.works + 0.6);
  if (t < E.drop0) return 30 + 6 * seg(t, E.breakA, E.breakB, eo);
  return 36 + 8 * seg(t, E.drop0, E.drop1, eo); }
function cam(t) { const z = seg(t, E.zoom0, E.zoom1, eio) * (1 - seg(t, E.rev1, E.rev1 + 0.9, eio)); const out = seg(t, E.ctx - 0.2, E.ctx + 0.7, eio);
  return { s: 1 + 0.38 * z - 0.05 * out, fx: V.X(34), fy: V.Y(7737) }; }
function withCam(t, fn) { const g = VW.g, c = cam(t); g.save(); g.beginPath(); g.rect(0, 585, 1080, 905); g.clip(); g.translate(c.fx, c.fy); g.scale(c.s, c.s); g.translate(-c.fx, -c.fy); fn(); g.restore(); }
function label(txt, x, y, a, col = '#1B2A8C') { if (a <= 0) return; const g = VW.g; g.save(); g.globalAlpha = a; g.font = '700 28px VWSans'; g.fillStyle = col; g.textAlign = 'center'; g.fillText(txt, x, y); g.restore(); }
function trendline(t, th, a = 1) {
  const g = VW.g, k = seg(t, E.draw0, E.draw1, eio), er = seg(t, E.erase, E.erase + 0.6), i0 = 3, i1 = mix(3, 38, 0.45 + 0.55 * k); if (k <= 0 || a <= 0) return;
  g.save(); g.globalAlpha = a * (1 - er); g.strokeStyle = th === 'light' ? '#2B3BB5' : 'rgba(170,180,255,0.85)'; g.lineWidth = 4;
  for (const off of [0, 1.6]) { g.beginPath(); g.moveTo(V.X(i0), V.Y(LINE(i0) - off)); g.lineTo(V.X(i1), V.Y(LINE(i1) - off)); g.stroke(); }
  if (th === 'light' && t < E.draw1 + 0.6) { g.fillStyle = '#fff'; g.strokeStyle = '#2B3BB5'; g.lineWidth = 3; for (const i of [i0, i1]) { g.beginPath(); g.arc(V.X(i), V.Y(LINE(i)), 9, 0, 7); g.fill(); g.stroke(); } }
  if (er > 0 && er < 1) { g.globalAlpha = a * Math.sin(er * Math.PI); g.strokeStyle = VX.RED; g.lineWidth = 6; g.beginPath(); g.moveTo(V.X(i0), V.Y(LINE(i0)) - 30 + 60 * er); g.lineTo(V.X(i1), V.Y(LINE(i1)) + 30 - 60 * er); g.stroke(); }
  g.restore(); }
function positionTool(t) { const a = seg(t, E.pos, E.pos + 0.3) * (1 - seg(t, E.rev0, E.rev0 + 0.4)); if (a <= 0) return; const g = VW.g, x0 = V.X(33), x1 = V.X(43), ye = V.Y(7738), ys = V.Y(7742), yt = V.Y(7726);
  g.save(); g.globalAlpha = a; g.fillStyle = 'rgba(242,54,69,0.22)'; g.fillRect(x0, ys, x1 - x0, ye - ys); g.fillStyle = 'rgba(34,171,148,0.22)'; g.fillRect(x0, ye, x1 - x0, yt - ye);
  g.font = '700 20px VWSans'; g.fillStyle = '#F23645'; g.fillText('Stop', x0 + 8, ys + 24); g.fillStyle = '#138A74'; g.fillText('Target', x0 + 8, yt - 12); g.restore(); }
function scene(t, th) {
  const g = VW.g; g.save(); VX.drawGrid(V, th, { step: 5, axis: th === 'light', bx0: 0, bx1: 1080, by0: 0, by1: 1920 });
  const n = upto(t), act2 = th === 'dark';
  if (act2) { // Volwick layers
    const wk = seg(t, E.wall, E.wall + 0.7, eo), ctx = seg(t, E.ctx, E.ctx + 0.6);
    WALLS.forEach(w => { const isM = w.fam === 'putS'; const a = isM ? 1 : ctx; const grow = isM ? wk : ctx; if (isM && wk <= 0) return; VX.wall(V, w, a, { grow, fs: isM ? 27 : 23, lw: isM ? 6 : 3.5, xr: 930, above: true, glow: isM ? 30 + 24 * VW.punch([E.wall + 0.3, E.drop0 + 0.2], t, 0.2) : 16 }); });
  }
  VX.drawCandles(V, DATA, n, th);
  trendline(t, th, act2 ? 0.55 : 1);
  if (!act2) {
    label('Trend Line', V.X(11), V.Y(LINE(11)) + 70, seg(t, E.label1, E.label1 + 0.25));
    const w = seg(t, E.works, E.works + 0.3); [6, 16, 26].forEach((i, j) => VX.ring(V.X(i), V.Y(DATA[i].l) + 8, 34, seg(t, E.works + j * 0.18, E.works + j * 0.18 + 0.35), '#2B3BB5', 6));
    label('Area Of Value', V.X(24), V.Y(DATA[26].l) + 92, w);
    label('Bearish Breakout', V.X(37), V.Y(7727) + 40, seg(t, E.breakB - 0.2, E.breakB + 0.1), '#C2185B');
    positionTool(t);
  } else {
    const kp = seg(t, E.mega, E.mega + 0.35, eo); if (kp > 0) { VX.print(V, { i: MEGA.i, p: MEGA.p }, kp); VX.print(V, MEGA, kp, { scale: 1 + 0.9 * (1 - kp) + 0.35 * VW.punch([E.mega + 0.2], t, 0.18) }); }
  }
  if (!act2) VX.priceTag(V, DATA[Math.max(0, Math.min(N - 1, Math.floor(n) - 1))].c, th, 0.9);
  g.restore();
}
function overlays(t, light) {
  const g = VW.g, endK = seg(t, E.logo0, E.logo0 + 0.5);
  if (light) { VX.logoLight(1 - endK, 'ES'); { g.save(); g.font = '700 38px VWSans'; g.fillStyle = '#1B2A8C'; g.textAlign = 'center'; g.fillText('How To Trade A Trendline Breakout', 540, 390); g.restore(); } }
  else VX.topBar(1 - endK, 'ES');
  // layer tags in act 2
  if (!light) {
    const out = 1 - seg(t, E.ctx - 0.3, E.ctx), Y = 1492;
    const k1 = seg(t, E.wall + 0.2, E.wall + 0.5), k2 = seg(t, E.short, E.short + 0.3), k3 = seg(t, E.drop0, E.drop0 + 0.3), k4 = seg(t, E.mega, E.mega + 0.3);
    if (t < E.mega) { VX.tag('PUT WALL', 110, Y, VX.WALL.putS, k1 * out, { size: 26 }); VX.tag('SHORT γ · ACCELERATIVE', 330, Y, VX.WALL.putS, k2 * out * (1 - k3), { size: 24, text: '#FFFFFF' }); VX.tag('DEALERS SELL INTO THE DROP', 330, Y, VX.RED, k3 * out, { size: 24, text: '#FFFFFF' }); }
    else VX.tag('BLOCK PRINT · 2,000 CONTRACTS', 540, Y, VW.COL.gold, k4 * out, { size: 26, align: 'center', text: '#FFFFFF' });
    const sr = seg(t, E.mega + 0.1, E.mega + 0.9); if (sr > 0 && sr < 1) { const c = cam(t), sx = c.fx + (V.X(MEGA.i) - c.fx) * c.s, sy = c.fy + (V.Y(MEGA.p) - c.fy) * c.s; g.save(); g.strokeStyle = `rgba(242,193,78,${1 - sr})`; g.lineWidth = 8 * (1 - sr) + 1; g.beginPath(); g.arc(sx, sy, 30 + 380 * eo(sr), 0, 7); g.stroke(); g.restore(); }
  }
}
function render(t) {
  const g = VW.g; g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#000'; g.fillRect(0, 0, 1080, 1920);
  const rv = seg(t, E.rev0, E.rev1, eio), c = cam(t), bx = V.X(34), by = V.Y(LINE(34));
  if (rv < 1) { g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, 1080, 1920); withCam(t, () => scene(t, 'light')); overlays(t, true); }
  if (rv > 0) { g.save(); const sx = c.fx + (bx - c.fx) * c.s, sy = c.fy + (by - c.fy) * c.s; g.beginPath(); g.arc(sx, sy, 2400 * rv * rv + 2, 0, Math.PI * 2); g.clip();
    g.fillStyle = '#000'; g.fillRect(0, 0, 1080, 1920); { const hz = g.createRadialGradient(540, 1000, 50, 540, 1000, 900); hz.addColorStop(0, `rgba(224,85,216,${0.10 * seg(t, E.wall, E.wall + 0.8) * (1 - seg(t, E.ctx, E.ctx + 0.6))})`); hz.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = hz; g.fillRect(0, 0, 1080, 1920); }
    withCam(t, () => scene(t, 'dark')); VW.vignette(); overlays(t, false);
    if (rv < 1) { g.strokeStyle = VW.rgba(VX.WALL.putS, 1 - rv); g.lineWidth = 6; g.beginPath(); g.arc(sx, sy, 2400 * rv * rv + 2, 0, Math.PI * 2); g.stroke(); } g.restore(); }
  // captions: the spoken sentences
  const light = rv < 0.5, keys = light ? {} : { magenta: VX.WALL.putS, put: VX.WALL.putS, 'wall': VX.WALL.putS, short: VX.WALL.putS, gamma: VX.WALL.putS, two: VW.COL.gold, thousand: VW.COL.gold, contracts: VW.COL.gold, context: VX.LBLUE, sell: VX.RED, drop: VX.RED };
  for (let k = 0; k < VX.SENT.length; k++) VX.statement(t, k, { y: 500, size: 60, keys, col: light ? '#131722' : VX.INK, dim: light ? 'rgba(19,23,34,0.22)' : 'rgba(242,245,250,0.28)', shadow: !light });
  // ending: the close prices fold into the V
  if (t > E.logo0) { const pts = []; for (let i = 30; i < N; i++) pts.push([V.X(i), V.Y(DATA[i].c)]); VX.end(t, pts); }
}
window.READY = (async () => { await VX.load('trend'); timeline(); return VX.ready(render, { ...E, cues: VX.C }); })();
