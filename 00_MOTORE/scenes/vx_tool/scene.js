// VX · TOOL (from the "one easy indicator" screen-recorded tutorial format). The setup is not an indicator:
// open Volwick, Dealer Walls Top 5, and read three reactions. Screen-recording look: toolbar, dropdown, white boxes, rings, arrows.
const { seg, lin, eo, eio, mix, clamp } = VW;
const N = 60;
const DATA = VX.series([[0, 7749], [6, 7755], [12, 7759.5], [16, 7754], [19, 7750], [21, 7744], [23, 7737.5], [26, 7732], [30, 7729.5], [34, 7736], [38, 7740], [44, 7738.5], [50, 7745], [59, 7743.5]], N, 23, 0.7);
DATA[12].h = 7761.0; DATA[12].c = Math.min(DATA[12].c, 7758.5); DATA[13].h = Math.min(DATA[13].h, 7760.75);
DATA[30].l = 7728.5; DATA[30].c = Math.max(DATA[30].c, 7730.5); DATA[29].l = Math.max(DATA[29].l, 7728.75);
const V = VX.view({ x0: 110, x1: 770, y0: 740, y1: 1400, pmin: 7716, pmax: 7769, n: N });
const WALLS = [ { p: 7766.25, fam: 'callS', usd: '−$13.4M' }, { p: 7761.25, fam: 'callL', usd: '+$24.5M', star: true },
  { p: 7741.25, fam: 'putS', usd: '−$16.9M' }, { p: 7728.25, fam: 'putL', usd: '+$18.0M' }, { p: 7721.25, fam: 'putL', usd: '+$14.6M' } ];
const SPOT = { green: [12, 7761.25], red: [30, 7728.25], mag: [22, 7741.25] };
let C, E = {};
function timeline() { C = VX.C;
  E.mod0 = C.s1[0] - 0.15; E.mod1 = C.s1[1] + 0.35; E.open = C.s2[0] - 0.1; E.drop0 = C.s3[0] - 0.2; E.pick = C.s3[0] + 0.55; E.walls = C.s3[0] + 0.85;
  E.g = C.s4[0] - 0.1; E.r = C.s5[0] - 0.1; E.m = C.s6[0] - 0.1; E.all = C.s7[0] - 0.2; E.logo0 = C.logo0; }
const L = { x0: 70, x1: 1010, y0: 575, y1: 1470 };
function cam(t) { // focus tour: hook wide, then green, red, magenta, then wide
  const keys = [[0, 1, 540, 1060], [E.g - 0.35, 1, 540, 1060], [E.g + 0.25, 1.55, V.X(12), V.Y(7756)], [E.r - 0.3, 1.55, V.X(12), V.Y(7756)], [E.r + 0.3, 1.55, V.X(30), V.Y(7733)],
    [E.m - 0.3, 1.55, V.X(30), V.Y(7733)], [E.m + 0.3, 1.45, V.X(24), V.Y(7738)], [E.all - 0.1, 1.45, V.X(24), V.Y(7738)], [E.all + 0.5, 1, 540, 1060], [99, 1, 540, 1060]];
  let k = 0; while (k < keys.length - 2 && t > keys[k + 1][0]) k++; const [ta, sa, xa, ya] = keys[k], [tb, sb, xb, yb] = keys[k + 1], u = eio(clamp((t - ta) / Math.max(0.01, tb - ta), 0, 1));
  return { s: mix(sa, sb, u), x: mix(xa, xb, u), y: mix(ya, yb, u) }; }
function chip(x, y, txt, on, a = 1, hi = 0) { const g = VW.g; g.save(); g.globalAlpha = a; g.font = '700 22px VWMono'; g.letterSpacing = '1px'; const w = g.measureText(txt).width + 30;
  g.fillStyle = on ? 'rgba(47,107,255,0.18)' : 'rgba(255,255,255,0.05)'; g.strokeStyle = on ? VX.BLUE : 'rgba(255,255,255,0.14)'; g.lineWidth = 1.5; VW.roundRect(x, y - 21, w, 42, 7); g.fill(); g.stroke();
  g.fillStyle = on ? '#FFFFFF' : '#A9B3C4'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(txt, x + 15, y + 1);
  if (hi > 0) { g.strokeStyle = '#FFFFFF'; g.lineWidth = 6; g.globalAlpha = a * hi; g.strokeRect(x - 8, y - 30, w + 16, 60); } g.restore(); return w; }
function windowFrame() { const g = VW.g; g.save(); g.fillStyle = '#05070B'; g.strokeStyle = 'rgba(255,255,255,0.10)'; g.lineWidth = 2; VW.roundRect(L.x0, L.y0, L.x1 - L.x0, L.y1 - L.y0, 18); g.fill(); g.stroke();
  g.fillStyle = 'rgba(255,255,255,0.06)'; g.fillRect(L.x0 + 1, L.y0 + 84, L.x1 - L.x0 - 2, 1.5); g.restore(); }
function toolbar(t) { const top5 = t < E.mod0 || t > E.pick + 0.15; let x = 96; const y = L.y0 + 42;
  x += chip(x, y, 'ES', true) + 10; x += chip(x, y, '1m', false) + 10;
  const wx = x; x += chip(x, y, top5 ? 'WALLS · TOP 5' : 'WALLS · OFF', top5, 1, 0) + 10; x += chip(x, y, 'GEX', false) + 10; chip(x, y, 'EXPIRY · ALL', false); return wx; }
function dropdown(t, wx) { const a = seg(t, E.drop0, E.drop0 + 0.18) * (1 - seg(t, E.pick + 0.2, E.pick + 0.4)); if (a <= 0) return; const g = VW.g, items = ['Off', 'Top 3', 'Top 5', 'Top 10', 'Top 15'], x = wx, y = L.y0 + 72;
  g.save(); g.globalAlpha = a; g.fillStyle = '#0E131C'; g.strokeStyle = 'rgba(255,255,255,0.16)'; g.lineWidth = 1.5; g.shadowColor = 'rgba(0,0,0,0.7)'; g.shadowBlur = 30; VW.roundRect(x, y, 250, items.length * 56 + 16, 10); g.fill(); g.stroke(); g.shadowBlur = 0;
  items.forEach((it, i) => { const yy = y + 36 + i * 56, sel = it === 'Top 5' && t > E.pick - 0.25; if (sel) { g.fillStyle = 'rgba(47,107,255,0.25)'; g.fillRect(x + 8, yy - 24, 234, 48); }
    g.font = '700 26px VWMono'; g.fillStyle = sel ? '#FFFFFF' : '#C3CBD8'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(it, x + 24, yy); });
  const hb = seg(t, E.drop0 + 0.25, E.drop0 + 0.45); if (hb > 0) { g.strokeStyle = '#FFFFFF'; g.lineWidth = 6; g.globalAlpha = a * hb; g.strokeRect(x - 6, y + 36 + 2 * 56 - 32, 262, 64); }
  g.restore(); }
function modal(t) { const a = seg(t, E.mod0, E.mod0 + 0.2) * (1 - seg(t, E.mod1 - 0.15, E.mod1)); if (a <= 0) return; const g = VW.g, x = 150, y = 820, w = 780, h = 470;
  g.save(); g.globalAlpha = a; g.fillStyle = 'rgba(0,0,0,0.55)'; g.fillRect(L.x0, L.y0, L.x1 - L.x0, L.y1 - L.y0);
  g.fillStyle = '#131722'; g.strokeStyle = 'rgba(255,255,255,0.15)'; VW.roundRect(x, y, w, h, 14); g.fill(); g.stroke();
  g.font = '700 32px VWSans'; g.fillStyle = '#E6E9EF'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText('Indicators', x + 30, y + 46);
  g.fillStyle = '#1E2230'; VW.roundRect(x + 30, y + 84, w - 60, 58, 8); g.fill(); const typed = 'best indicator'.slice(0, Math.floor(seg(t, E.mod0 + 0.1, E.mod0 + 0.7) * 14));
  g.font = '600 26px VWSans'; g.fillStyle = '#C9CFDA'; g.fillText('🔍  ' + typed, x + 48, y + 114);
  for (let i = 0; i < 4; i++) { g.fillStyle = 'rgba(255,255,255,0.07)'; g.fillRect(x + 30, y + 176 + i * 66, w - 60 - i * 70, 40); }
  const x2 = seg(t, C.s1[0] + 0.1, C.s1[0] + 0.35, eo); if (x2 > 0) { g.strokeStyle = VX.RED; g.lineWidth = 16; g.lineCap = 'round'; g.globalAlpha = a * x2; const cx = x + w / 2, cy = y + h / 2, r = 150 * (1.3 - 0.3 * x2);
    g.beginPath(); g.moveTo(cx - r, cy - r); g.lineTo(cx + r, cy + r); g.moveTo(cx + r, cy - r); g.lineTo(cx - r, cy + r); g.stroke(); }
  g.restore(); }
function chartLayer(t) { const g = VW.g, wk = seg(t, E.walls, E.walls + 0.8, eo), hook = t < E.mod0, whole = t > E.all;
  VX.drawGrid(V, 'dark', { bg: false, axis: false, vstep: 6 });
  const wa = hook ? 1 : (t < E.walls ? 0 : 1);
  WALLS.forEach((w, i) => VX.wall(V, w, wa, { grow: hook ? 1 : seg(t, E.walls + i * 0.07, E.walls + 0.6 + i * 0.07, eo), xr: 960, above: true, fs: 22, lw: w.star ? 3.5 : 3, glow: 16 }));
  VX.drawCandles(V, DATA, N, 'dark');
  // rings and arrows: hook shows all three; then one per sentence; finally all three again
  const show = (k0) => hook ? 1 : whole ? seg(t, E.all + 0.3, E.all + 0.8) : seg(t, k0, k0 + 0.45);
  const keep = (k0, k1) => hook ? 1 - seg(t, E.mod0 - 0.2, E.mod0) : (t < k1 || whole ? 1 : 0);
  const gk = show(E.g + 0.3) * keep(E.g, E.r - 0.2), rk = show(E.r + 0.3) * keep(E.r, E.m - 0.2), mk = show(E.m + 0.3) * keep(E.m, E.all);
  VX.ring(V.X(12), V.Y(7761.25), 34, gk); VX.arrow(V.X(12) + 50, V.Y(7759), V.X(18) + 30, V.Y(7748), gk);
  VX.ring(V.X(30), V.Y(7728.25), 34, rk); VX.arrow(V.X(30) + 40, V.Y(7730), V.X(36) + 20, V.Y(7740), rk);
  VX.ring(V.X(21), V.Y(7741.25), 34, mk); VX.arrow(V.X(21) + 34, V.Y(7738), V.X(26) + 30, V.Y(7728), mk);
}
function render(t) {
  const g = VW.g; g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#000'; g.fillRect(0, 0, 1080, 1920);
  const hz = g.createRadialGradient(540, 1050, 80, 540, 1050, 1000); hz.addColorStop(0, 'rgba(47,107,255,0.10)'); hz.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = hz; g.fillRect(0, 0, 1080, 1920);
  windowFrame(); const wx = toolbar(t);
  const c = cam(t); g.save(); g.beginPath(); g.rect(L.x0 + 2, L.y0 + 88, L.x1 - L.x0 - 4, L.y1 - L.y0 - 92); g.clip();
  g.translate(540, 1060); g.scale(c.s, c.s); g.translate(-c.x, -c.y); chartLayer(t); g.restore();
  dropdown(t, wx); modal(t);
  // cursor: to WALLS chip, click, to Top 5, click
  const cx = t < E.drop0 ? mix(860, wx + 120, seg(t, E.open, E.drop0 - 0.05, eio)) : mix(wx + 120, wx + 90, seg(t, E.drop0 + 0.1, E.pick - 0.1, eio)), cy = t < E.drop0 ? mix(1300, L.y0 + 50, seg(t, E.open, E.drop0 - 0.05, eio)) : mix(L.y0 + 50, L.y0 + 72 + 36 + 112, seg(t, E.drop0 + 0.1, E.pick - 0.1, eio));
  const ca = seg(t, E.open, E.open + 0.2) * (1 - seg(t, E.pick + 0.5, E.pick + 0.8)); VX.cursor(cx, cy, ca, false, VW.punch([E.drop0 - 0.02, E.pick], t, 0.09));
  { const Y = 1528, out = 1 - seg(t, E.all - 0.2, E.all + 0.1);
    VX.tag('CALL WALL · LONG γ · ABSORBS', 540, Y, VX.WALL.callL, seg(t, E.g + 0.2, E.g + 0.45) * (1 - seg(t, E.r - 0.15, E.r)) * out, { size: 25, align: 'center', text: '#FFFFFF' });
    VX.tag('PUT WALL · LONG γ · DEFENDS', 540, Y, VX.WALL.putL, seg(t, E.r + 0.2, E.r + 0.45) * (1 - seg(t, E.m - 0.15, E.m)) * out, { size: 25, align: 'center', text: '#FFFFFF' });
    VX.tag('PUT WALL · SHORT γ · ACCELERATES', 540, Y, VX.WALL.putS, seg(t, E.m + 0.2, E.m + 0.45) * out, { size: 25, align: 'center', text: '#FFFFFF' }); }
  VW.vignette(); const endK = seg(t, E.logo0, E.logo0 + 0.5); VX.topBar(1 - endK, 'ES');
  const keys = { green: VX.WALL.callL, absorb: VX.WALL.callL, red: VX.WALL.putL, defend: VX.WALL.putL, magenta: VX.WALL.putS, run: VX.WALL.putS, volwick: VX.LBLUE, walls: VX.LBLUE, top: VX.LBLUE, five: VX.LBLUE };
  for (let k = 0; k < VX.SENT.length; k++) VX.statement(t, k, { y: 455, size: 58, keys });
  if (t > E.logo0) { const pts = []; for (let i = 20; i < N; i++) pts.push([V.X(i), V.Y(DATA[i].c)]); VX.end(t, pts); }
}
window.READY = (async () => { await VX.load('tool'); timeline(); return VX.ready(render, { ...E, cues: VX.C }); })();
