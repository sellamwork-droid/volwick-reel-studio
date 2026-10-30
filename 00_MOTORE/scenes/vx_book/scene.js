// VX · BOOK (from the "simple trading book" desk format). The book's double bottom is respected; then the same
// pattern on a filmed monitor running Volwick shows who was defending the low: a red put wall and block prints.
const { seg, lin, eo, eio, mix, clamp } = VW;
const N = 40, LOW = 7712.25, NECK = 7722;
const DATA = VX.series([[0, 7729], [5, 7722], [10, 7713.25], [13, 7718], [16, 7721.5], [20, 7717], [23, 7713.5], [26, 7718.5], [29, 7721.75], [33, 7727], [36, 7730], [39, 7733]], N, 41, 0.7);
DATA[10].l = 7712.5; DATA[23].l = 7712.75; DATA[10].c = Math.max(DATA[10].c, 7714); DATA[23].c = Math.max(DATA[23].c, 7714.25);
const SW = 1000, SH = 1240;                          // monitor screen (offscreen canvas)
const V = VX.view({ x0: 40, x1: 720, y0: 170, y1: 1150, pmin: 7706, pmax: 7737, n: N });
const WALLS = [{ p: 7733.25, fam: 'callL', usd: '+$21.0M' }, { p: LOW, fam: 'putL', usd: '+$14.6M', star: true }];
const PR = [{ i: 10, p: 7712.5, q: 858, side: 'r' }, { i: 23, p: 7712.75, q: 644, x: 2, gold: true, side: 'r' }];
let C, E = {}, scr, sg;
function timeline() { C = VX.C; E.push0 = C.s1[0] - 0.2; E.whip0 = C.s1[1] + 0.35; E.whip1 = C.s2[0] - 0.05; E.wall = C.s2[0]; E.lg = C.s3[0];
  E.prints = C.s4[0]; E.same = C.s5[0] - 0.1; E.same1 = C.s5[1] + 0.3; E.go0 = C.s6[0] - 0.2; E.go1 = C.s6[1] + 0.5; E.logo0 = C.logo0; }
// ---------- desk + book ----------
const R = VW.rng(5), GRAIN = Array.from({ length: 70 }, () => [R() * 1080, R() * 6 + 2, R() * 0.5 + 0.2, R() * 40]);
function desk(g) { g.fillStyle = '#5B3D24'; g.fillRect(-200, -200, 1480, 2320);
  GRAIN.forEach(([x, w, a, ph]) => { g.strokeStyle = `rgba(30,16,6,${0.25 * a})`; g.lineWidth = w; g.beginPath(); for (let y = -200; y <= 2120; y += 40) { const xx = x + Math.sin(y / 260 + ph) * 18; y === -200 ? g.moveTo(xx, y) : g.lineTo(xx, y); } g.stroke(); });
  const v = g.createRadialGradient(540, 1000, 300, 540, 1000, 1300); v.addColorStop(0, 'rgba(255,220,170,0.10)'); v.addColorStop(1, 'rgba(0,0,0,0.55)'); g.fillStyle = v; g.fillRect(-200, -200, 1480, 2320); }
function ink(g, pts, col = '#151515', w = 7) { g.strokeStyle = col; g.lineWidth = w; g.lineJoin = 'round'; g.lineCap = 'round'; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); }
function page(g, t) { // page coordinates 0..860 x 0..1080
  g.save(); g.shadowColor = 'rgba(0,0,0,0.55)'; g.shadowBlur = 40; g.shadowOffsetY = 18; g.fillStyle = '#F7F5EF'; g.fillRect(0, 0, 860, 1080); g.restore();
  g.fillStyle = '#222'; for (let y = 30; y < 1060; y += 34) { g.beginPath(); g.arc(22, y, 7, 0, 7); g.fill(); }
  g.fillStyle = '#2E9E5B'; g.fillRect(60, 40, 760, 46); g.font = '700 26px VWSans'; g.fillStyle = '#FFF'; g.textAlign = 'left'; g.fillText('REVERSAL CHART PATTERNS', 80, 72);
  // double top (partly visible, upper half)
  ink(g, [[150, 330], [230, 160], [300, 260], [370, 160], [450, 330]], '#333', 5); g.strokeStyle = '#C62828'; g.lineWidth = 4; g.beginPath(); g.moveTo(170, 260); g.lineTo(520, 260); g.stroke();
  g.font = '600 24px VWSans'; g.fillStyle = '#555'; g.fillText('Double Top', 560, 250);
  // double bottom (the hero diagram)
  g.font = '700 40px VWSans'; g.fillStyle = '#111'; g.fillText('Double Bottom', 150, 470);
  ink(g, [[130, 560], [240, 860], [330, 700], [420, 860], [560, 560]]);
  g.strokeStyle = '#C62828'; g.lineWidth = 5; g.beginPath(); g.moveTo(150, 700); g.lineTo(640, 700); g.stroke();
  g.setLineDash([12, 10]); g.strokeStyle = '#1B2A8C'; g.lineWidth = 4; g.beginPath(); g.moveTo(600, 700); g.lineTo(600, 560); g.stroke(); g.setLineDash([]);
  [[600, 560, 'target'], [600, 700, 'entry'], [600, 900, 'stop']].forEach(([x, y, s]) => { g.strokeStyle = '#1B2A8C'; g.lineWidth = 4; g.beginPath(); g.moveTo(x - 30, y); g.lineTo(x + 30, y); g.stroke(); g.font = '600 30px VWSans'; g.fillStyle = '#1B2A8C'; g.fillText(s, x + 44, y + 10); });
  g.font = '600 28px VWSans'; g.fillStyle = '#C62828'; g.fillText('neckline', 160, 690);
  g.font = '700 34px VWSans'; g.fillStyle = '#2E9E5B'; g.fillRect(60, 980, 760, 4); g.fillStyle = '#555'; g.font = '600 24px VWSans'; g.fillText('Wait for the neckline break. Stop under the lows.', 80, 1030);
}
function pen(g, x, y, a) { g.save(); g.translate(x, y); g.rotate(-0.75); g.fillStyle = '#121212'; g.shadowColor = 'rgba(0,0,0,0.5)'; g.shadowBlur = 20; g.shadowOffsetY = 12;
  g.fillRect(0, -11, 520, 22); g.shadowBlur = 0; g.fillStyle = '#C0C0C0'; g.fillRect(-36, -7, 36, 14); g.beginPath(); g.moveTo(-36, -7); g.lineTo(-56, 0); g.lineTo(-36, 7); g.fill(); g.fillStyle = '#2A2A2A'; g.fillRect(380, -13, 26, 26); g.restore(); }
function bookScene(t) { const g = VW.g, push = seg(t, E.push0, E.push0 + 1.6, eio), sh = 0.004 * Math.sin(t * 1.7) + 0.003 * Math.sin(t * 2.9);
  g.save(); g.translate(540, 1050); g.rotate(-0.05 + sh); g.scale(1 + 0.55 * push, 1 + 0.55 * push); g.translate(-540 + 30 * push, -1050 - 120 * push);
  desk(g); g.save(); g.translate(120, 560); g.rotate(-0.03); page(g, t);
  const px = 330 + 40 * Math.sin(t * 1.3) * (1 - push), py = 720 + 120 * push + 10 * Math.sin(t * 2.1); pen(g, px + 30, py + 130, 1); g.restore();
  g.restore(); }
// ---------- monitor ----------
function screenChart(t) { const g0 = VW.g; VW.g = sg; const g = sg; g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#000'; g.fillRect(0, 0, SW, SH);
  // terminal header inside the screen
  g.fillStyle = 'rgba(255,255,255,0.05)'; g.fillRect(0, 0, SW, 70); g.font = '700 26px VWMono'; g.fillStyle = '#DCE3EE'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText('VOLWICK   ES · 1m   WALLS · TOP 5   PRINTS', 30, 36);
  VX.drawGrid(V, 'dark', { bg: false, axis: false, vstep: 5 });
  const wk = seg(t, E.wall, E.wall + 0.7, eo), ctx = seg(t, E.go0, E.go0 + 0.5);
  VX.wall(V, WALLS[1], wk > 0 ? 1 : 0, { grow: wk, xr: 960, above: true, fs: 30, lw: 6, glow: 30 + 26 * VW.punch([E.wall + 0.35, E.lg + 0.2], t, 0.2) });
  VX.wall(V, WALLS[0], ctx, { grow: ctx, xr: 960, above: true, fs: 26, lw: 3.5 });
  const n = t < E.go0 ? 25 : 25 + 15 * seg(t, E.go0, E.go1, eo); VX.drawCandles(V, DATA, n, 'dark');
  PR.forEach((p, j) => { const k = seg(t, E.prints + j * 0.35, E.prints + j * 0.35 + 0.3, eo); VX.print(V, p, k, { scale: 1.35 + 0.6 * (1 - k) }); });
  VX.keyLevel(V, { p: 7712.5, q: '1,502', b: 3 }, seg(t, E.prints + 0.9, E.prints + 1.3));
  // neckline from the book, now just a reference
  g.save(); g.setLineDash([10, 10]); g.strokeStyle = `rgba(255,255,255,${0.35 * seg(t, E.same, E.same + 0.3)})`; g.lineWidth = 3; g.beginPath(); g.moveTo(V.x0, V.Y(NECK)); g.lineTo(V.x1, V.Y(NECK)); g.stroke(); g.restore();
  VW.g = g0; }
function monitorScene(t) { const g = VW.g; g.save(); g.fillStyle = '#0A0B0F'; g.fillRect(0, 0, 1080, 1920);
  const amb = g.createRadialGradient(540, 1700, 50, 540, 1700, 900); amb.addColorStop(0, 'rgba(255,40,60,0.18)'); amb.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = amb; g.fillRect(0, 0, 1080, 1920);
  screenChart(t); const sh = 0.003 * Math.sin(t * 1.9), z = 1 + 0.05 * seg(t, E.wall, E.go1);
  g.translate(540, 1005); g.rotate(0.035 + sh); g.transform(1, 0.02, -0.04, 1, 0, 0); g.scale(0.8 * z, 0.8 * z); g.translate(-SW / 2, -SH / 2);
  g.fillStyle = '#16181D'; VW.roundRect(-34, -34, SW + 68, SH + 68, 26); g.fill(); g.drawImage(scr, 0, 0);
  // glare and pixel grid of a filmed screen
  const gl = g.createLinearGradient(0, 0, SW, SH); gl.addColorStop(0, 'rgba(255,255,255,0.07)'); gl.addColorStop(0.45, 'rgba(255,255,255,0)'); gl.addColorStop(1, 'rgba(120,150,255,0.05)'); g.fillStyle = gl; g.fillRect(0, 0, SW, SH);
  g.fillStyle = 'rgba(0,0,0,0.10)'; for (let y = 0; y < SH; y += 4) g.fillRect(0, y, SW, 1);
  g.restore(); }
// small inset of the book page for "Same pattern."
function inset(t) { const k = seg(t, E.same, E.same + 0.3, eo) * (1 - seg(t, E.same1, E.same1 + 0.3)); if (k <= 0) return; const g = VW.g; g.save(); g.globalAlpha = k; g.translate(150, 760); g.rotate(-0.06); g.scale(0.34 * (0.9 + 0.1 * k), 0.34 * (0.9 + 0.1 * k)); page(g, t); g.restore(); }
function render(t) {
  const g = VW.g; g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#000'; g.fillRect(0, 0, 1080, 1920);
  const wp = seg(t, E.whip0, E.whip1, eio);
  if (t < E.whip1) { if (wp > 0) { for (let k = 0; k < 6; k++) { g.save(); g.globalAlpha = 0.28; g.translate(-1400 * wp * wp - k * 40 * wp, 0); bookScene(t); g.restore(); } } else bookScene(t); }
  if (wp > 0.45) { g.save(); const k = (wp - 0.45) / 0.55; if (k < 1) { for (let j = 0; j < 5; j++) { g.save(); g.globalAlpha = 0.3; g.translate(1300 * (1 - k) * (1 - k) + j * 40 * (1 - k), 0); monitorScene(t); g.restore(); } } else monitorScene(t); g.restore(); }
  inset(t);
  // tags under the monitor
  const Y = 1532; if (t > E.wall) { VX.tag('PUT WALL · LONG γ · DEFENDED', 540, Y, VX.WALL.putL, seg(t, E.lg, E.lg + 0.3) * (1 - seg(t, E.prints - 0.2, E.prints)), { size: 26, align: 'center', text: '#FFFFFF' });
    VX.tag('BLOCK PRINTS ON THE LOW', 540, Y, VW.COL.gold, seg(t, E.prints + 0.1, E.prints + 0.4) * (1 - seg(t, E.go0 - 0.2, E.go0)), { size: 26, align: 'center', text: '#FFFFFF' }); }
  // top band so the brand bar reads over the desk
  const tb = g.createLinearGradient(0, 0, 0, 640); tb.addColorStop(0, 'rgba(0,0,0,0.85)'); tb.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = tb; g.fillRect(0, 0, 1080, 640);
  const endK = seg(t, E.logo0, E.logo0 + 0.5); VX.topBar(1 - endK, 'ES');
  const keys = { red: VX.WALL.putL, put: VX.WALL.putL, wall: VX.WALL.putL, long: VX.WALL.putL, gamma: VX.WALL.putL, block: VW.COL.gold, prints: VW.COL.gold, defending: VX.LBLUE, held: VX.LBLUE };
  for (let k = 0; k < VX.SENT.length; k++) VX.statement(t, k, { y: 455, size: 60, keys, box: t < E.whip1 });
  if (t > E.logo0) { const pts = []; for (let i = 0; i < 40; i++) pts.push([mix(150, 930, i / 39), 1005]); VX.end(t, pts); }
}
window.READY = (async () => { scr = document.createElement('canvas'); scr.width = SW; scr.height = SH; sg = scr.getContext('2d'); await VX.load('book'); timeline(); return VX.ready(render, { ...E, cues: VX.C }); })();
