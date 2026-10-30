// VX · RULE (from the minimal white "one rule" micro-lesson format). One sentence, one chart, one Volwick layer:
// price pushes into a green wall (call, long gamma), dealers sell the rally to stay hedged, price stalls.
const { seg, lin, eo, eio, mix, clamp } = VW;
const N = 22, WALLP = 7761.25;
const DATA = VX.series([[0, 7741.5], [4, 7745], [7, 7744], [10, 7751], [13, 7759.5], [15, 7757], [17, 7759.75], [19, 7756.5], [21, 7758.5]], N, 31, 0.9);
[13, 15, 17, 20].forEach(i => { DATA[i].h = WALLP + (i === 13 ? 0.5 : 0.25); DATA[i].c = Math.min(DATA[i].c, WALLP - 2.5); DATA[i].o = Math.min(DATA[i].o, WALLP - 1.5); });
const V = VX.view({ x0: 130, x1: 900, y0: 760, y1: 1490, pmin: 7739, pmax: 7764, n: N });
let C, E = {};
function timeline() { C = VX.C; E.push0 = 0.25; E.push1 = 1.75; E.sell0 = 2.05; E.sell1 = 4.2; E.stall0 = C.s1[0] - 0.1; E.stall1 = C.s1[1]; E.logo0 = C.logo0; }
function upto(t) { if (t < E.push0) return 10; if (t < E.sell0) return 10 + 4 * seg(t, E.push0, E.push1); if (t < E.stall0) return 14 + 5 * seg(t, E.sell0, E.sell1); return 19 + 3 * seg(t, E.stall0, E.stall1); }
function candles(n) { const g = VW.g, w = V.bw * 0.56;
  for (let i = 0; i < Math.ceil(n) && i < N; i++) { const d = DATA[i], fr = i === Math.floor(n) ? n - i : 1; if (fr <= 0) continue; const c = d.o + (d.c - d.o) * fr, h = Math.max(d.o, c, d.o + (d.h - d.o) * fr), l = Math.min(d.o, c, d.o + (d.l - d.o) * fr);
    const x = V.X(i), up = c >= d.o, col = up ? '#6FBF8B' : '#262626'; g.strokeStyle = col; g.lineWidth = 3; g.beginPath(); g.moveTo(x, V.Y(h)); g.lineTo(x, V.Y(l)); g.stroke();
    g.fillStyle = col; const y0 = V.Y(Math.max(d.o, c)), y1 = V.Y(Math.min(d.o, c)); g.fillRect(x - w / 2, y0, w, Math.max(3, y1 - y0)); } }
function render(t) {
  const g = VW.g; g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, 1080, 1920);
  const n = upto(t), wa = 1;
  // the wall: minimal, solid, labelled like the terminal but in ink
  const glow = 0.35 + 0.65 * VW.punch([E.push1 - 0.1, 2.6, 3.3, 4.0], t, 0.16);
  g.save(); g.strokeStyle = '#1E9E6A'; g.lineWidth = 5; g.shadowColor = `rgba(30,158,106,${0.5 * glow})`; g.shadowBlur = 24 * glow; g.beginPath(); g.moveTo(V.x0 - 20, V.Y(WALLP)); g.lineTo(V.x1 + 20, V.Y(WALLP)); g.stroke(); g.restore();
  g.save(); g.font = '700 24px VWMono'; g.fillStyle = '#1E9E6A'; g.textAlign = 'left'; g.fillText('CALL WALL · LONG γ   7,761.25 · +$24.5M', V.x0 - 20, V.Y(WALLP) - 22); g.restore();
  // dotted reference from the first push
  g.save(); g.setLineDash([3, 6]); g.strokeStyle = 'rgba(0,0,0,0.35)'; g.lineWidth = 2; const yb = V.Y(7744); g.beginPath(); g.moveTo(V.X(4), yb); g.lineTo(V.X(13), yb); g.stroke(); g.restore();
  candles(n);
  // dealers sell the rally: red markers above each touch
  [13, 15, 17, 20].forEach((i, j) => { const k = seg(t, [E.push1 - 0.05, 2.75, 3.45, C.s1[0] + 0.3][j], [E.push1 - 0.05, 2.75, 3.45, C.s1[0] + 0.3][j] + 0.25, eo); if (k <= 0 || n < i + 0.6) return;
    g.save(); g.globalAlpha = k; g.fillStyle = '#E5484D'; const x = V.X(i), y = V.Y(WALLP) - 48 - 10 * (1 - k); g.beginPath(); g.moveTo(x - 13, y - 14); g.lineTo(x + 13, y - 14); g.lineTo(x, y + 6); g.closePath(); g.fill();
    g.font = '700 19px VWMono'; g.textAlign = 'center'; g.fillText('SELL', x, y - 26); g.restore(); });
  // the stall: bracket under the range
  const sk = seg(t, E.stall0 + 0.2, E.stall0 + 0.6, eo); if (sk > 0) { g.save(); g.globalAlpha = sk; g.strokeStyle = VX.BLUE; g.lineWidth = 4; const xa = V.X(13) - 20, xb = mix(xa, V.X(21) + 20, sk), y = V.Y(7754);
    g.beginPath(); g.moveTo(xa, y - 14); g.lineTo(xa, y); g.lineTo(xb, y); g.lineTo(xb, y - 14); g.stroke(); g.font = '700 26px VWMono'; g.fillStyle = VX.BLUE; g.textAlign = 'center'; g.fillText('STALL', (xa + xb) / 2, y + 36); g.restore(); }
  // brand top bar on white
  const endK = seg(t, E.logo0, E.logo0 + 0.5); VX.logoLight(1 - endK, 'ES');
  const keys = { green: '#1E9E6A', wall: '#1E9E6A', sell: '#E5484D', rally: '#E5484D', stalls: VX.BLUE };
  for (let k = 0; k < VX.SENT.length; k++) VX.statement(t, k, { y: 520, size: 62, keys, col: '#111111', dim: 'rgba(17,17,17,0.10)', shadow: false });
  if (t > E.logo0) { const pts = []; for (let i = 0; i < 40; i++) pts.push([mix(V.x0 - 20, V.x1 + 20, i / 39), V.Y(WALLP)]); VX.end(t, pts); }
}
window.READY = (async () => { await VX.load('rule'); timeline(); return VX.ready(render, { ...E, cues: VX.C }); })();
