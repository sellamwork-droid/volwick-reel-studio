// VX · EDIT (from the fast motion-design "hype edit" format). No voice: everything cut on a 128 BPM grid.
// Logo ignition, terminal fragments, walls slamming in, a block print assembling from pixels, floating layer cards, slogan, logo.
const { seg, lin, eo, eio, mix, clamp } = VW;
const BPM = 128, B = 60 / BPM, b = k => k * B;      // beat k in seconds
const N = 48;
const DATA = VX.series([[0, 7738], [8, 7747], [14, 7744], [20, 7752], [26, 7749], [30, 7756.5], [34, 7751], [40, 7742], [44, 7736.5], [47, 7739]], N, 77, 0.8);
const V = VX.view({ x0: 96, x1: 780, y0: 700, y1: 1400, pmin: 7730, pmax: 7764, n: N });
const WALLS = [{ p: 7758.25, fam: 'callL', usd: '+$24.5M', star: true }, { p: 7753.25, fam: 'callS', usd: '−$9.7M' }, { p: 7741.25, fam: 'putL', usd: '+$18.0M' }, { p: 7735.25, fam: 'putS', usd: '−$16.9M' }];
const T = { logo: 0, chart: b(2), chips: b(5), walls: b(8), print: b(12), cards: b(16), slogan: b(21), end: b(24) };
const HITS = [b(0.5), b(2), b(5), b(8), b(9), b(10), b(11), b(12), b(14), b(16), b(21), b(22), b(23)];
let PIX = null;
function pixels() { const c = document.createElement('canvas'); c.width = 900; c.height = 300; const o = c.getContext('2d'); o.fillStyle = '#fff'; o.font = '700 250px VWMono'; o.textAlign = 'center'; o.textBaseline = 'middle'; o.fillText('2,000', 450, 160);
  const d = o.getImageData(0, 0, 900, 300).data, out = [], R = VW.rng(9), S = 14; for (let y = 0; y < 300; y += S) for (let x = 0; x < 900; x += S) if (d[((y + S / 2) * 900 + x + S / 2) * 4 + 3] > 120) out.push({ x, y, dx: (R() - 0.5) * 1400, dy: (R() - 0.5) * 1800, d: R() * 0.35 }); PIX = out; }
function shake(t) { const k = VW.punch(HITS, t, 0.06); return [Math.sin(t * 97) * 10 * k, Math.cos(t * 83) * 10 * k]; }
function flash(t) { const k = VW.punch([b(2), b(8), b(12), b(16), b(21)], t, 0.05); if (k > 0.02) { const g = VW.g; g.fillStyle = `rgba(200,215,255,${0.35 * k})`; g.fillRect(0, 0, 1080, 1920); } }
function logoIgnite(t) { const g = VW.g, k = 0.5 + 0.5 * seg(t, 0, b(1.5), eo), out = 1 - seg(t, b(1.7), b(2)); if (out <= 0) return; g.save(); g.globalAlpha = out;
  // light streak across, then the monogram snaps in from blur
  const sx = mix(-400, 1480, seg(t, 0, b(1))); const gr = g.createLinearGradient(sx - 300, 0, sx + 300, 0); gr.addColorStop(0, 'rgba(90,140,255,0)'); gr.addColorStop(0.5, 'rgba(160,190,255,0.9)'); gr.addColorStop(1, 'rgba(90,140,255,0)'); g.fillStyle = gr; g.fillRect(0, 930, 1080, 6);
  const size = 520 * (1.25 - 0.25 * k); g.filter = `blur(${(1 - k) * 22}px)`; g.globalCompositeOperation = 'lighter'; g.globalAlpha = out * k; g.drawImage(VW.assets.mono, 540 - size / 2, 900 - size / 2, size, size);
  g.filter = 'none'; const wm = VW.assets.wm, ww = 760 * (1.1 - 0.1 * k), wh = ww * wm.height / wm.width; g.globalAlpha = out * seg(t, b(0.8), b(1.4)); g.drawImage(wm, 540 - ww / 2, 1230 - wh / 2, ww, wh); g.restore(); }
function chips(t) { const items = ['ES', '1m', 'WALLS · TOP 5', 'GEX', 'PRINTS · MEGA', 'MAPS · γ'], g = VW.g; if (t < T.chips || t > T.walls + b(1)) return; const out = 1 - seg(t, T.walls, T.walls + b(1));
  items.forEach((s, i) => { const k = seg(t, T.chips + i * b(0.5), T.chips + i * b(0.5) + b(0.4), eo); if (k <= 0) return; g.save(); g.globalAlpha = k * out; g.font = '700 46px VWMono'; g.letterSpacing = '2px';
    const w = g.measureText(s).width + 60, x = 540 - w / 2 + (1 - k) * (i % 2 ? 700 : -700), y = 640 + i * 120; g.filter = `blur(${(1 - k) * 14}px)`;
    g.fillStyle = i === 2 ? 'rgba(47,107,255,0.25)' : 'rgba(255,255,255,0.06)'; g.strokeStyle = i === 2 ? VX.BLUE : 'rgba(255,255,255,0.25)'; g.lineWidth = 3; VW.roundRect(x, y - 44, w, 88, 14); g.fill(); g.stroke();
    g.fillStyle = '#FFFFFF'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(s, x + 30, y + 2); if (i === 2 && t > T.chips + b(2.2)) { g.strokeStyle = '#FFF'; g.lineWidth = 7; g.strokeRect(x - 12, y - 58, w + 24, 116); } g.restore(); }); }
function chart(t) { const g = VW.g, show = (t > T.chart && t < T.chips) || (t > T.walls - b(0.3) && t < T.cards + b(0.5)); if (!show) return;
  const out = 1 - seg(t, T.cards, T.cards + b(0.5)), z = t < T.chips ? 1.25 - 0.25 * seg(t, T.chart, T.chips, eo) : 1 + 0.04 * seg(t, T.walls, T.cards);
  g.save(); g.globalAlpha = out; g.translate(540, 1050); g.scale(z, z); g.translate(-540, -1050);
  VX.drawGrid(V, 'dark', { bg: false, axis: false, vstep: 6 });
  if (t > T.walls - b(0.3)) WALLS.forEach((w, i) => { const t0 = T.walls + i * B; const k = seg(t, t0, t0 + b(0.35), eo); if (k <= 0) return; VX.wall(V, w, 1, { grow: k, xr: 960, above: true, fs: 26, lw: w.star ? 5 : 4, glow: 20 + 30 * VW.punch([t0 + 0.1], t, 0.12) }); });
  VX.drawCandles(V, DATA, t < T.chips ? 20 + 28 * seg(t, T.chart, T.chips) : N, 'dark');
  if (t > T.print) { const k = seg(t, T.print + b(2), T.print + b(2.5)); VX.keyLevel(V, { p: 7741.25, q: '2,000', b: 1 }, k); }
  g.restore(); }
function megaPrint(t) { if (t < T.print || t > T.cards + b(0.3)) return; const g = VW.g, out = 1 - seg(t, T.cards - b(0.5), T.cards); g.save(); g.globalAlpha = out;
  g.fillStyle = `rgba(2,4,10,${0.78 * seg(t, T.print, T.print + b(0.5))})`; g.fillRect(0, 560, 1080, 900);
  const ox = 90, oy = 900 - 150; PIX.forEach(p => { const k = eo(clamp((t - T.print - p.d) / b(1.5), 0, 1)); const x = ox + p.x + p.dx * (1 - k), y = oy + p.y + p.dy * (1 - k);
    g.fillStyle = k < 1 ? `rgba(242,193,78,${0.4 + 0.6 * k})` : VW.COL.gold; g.fillRect(x, y, 12, 12); });
  const lk = seg(t, T.print + b(1.6), T.print + b(2.1), eo); g.font = '700 48px VWMono'; g.letterSpacing = '8px'; g.textAlign = 'center'; g.fillStyle = '#FFF'; g.globalAlpha = out * lk; g.fillText('CONTRACTS · ONE PRICE', 540, 1120); g.restore(); }
const CARDS = [['DEALER WALLS', VX.WALL.callL], ['BLOCK PRINTS', VW.COL.gold], ['CVD', VX.LBLUE], ['CDI', VX.WALL.putL], ['EXPOSURE MAPS', VX.AMBER], ['MARKET INTELLIGENCE', VX.BLUE]];
function card(x, y, w, h, title, col, k, i, t) { const g = VW.g; g.save(); g.globalAlpha = k; g.translate(x, y); g.rotate(-0.12 + 0.05 * Math.sin(t * 0.8 + i)); g.transform(1, -0.08, 0.18, 1, 0, 0);
  g.fillStyle = 'rgba(10,16,30,0.92)'; g.strokeStyle = VW.rgba(col, 0.8); g.lineWidth = 3; g.shadowColor = VW.rgba(col, 0.5); g.shadowBlur = 40; VW.roundRect(-w / 2, -h / 2, w, h, 24); g.fill(); g.stroke(); g.shadowBlur = 0;
  g.font = '700 34px VWMono'; g.letterSpacing = '2px'; g.fillStyle = '#FFF'; g.textAlign = 'left'; g.textBaseline = 'top'; g.fillText(title, -w / 2 + 28, -h / 2 + 26);
  // tiny glyph of each layer
  g.strokeStyle = col; g.fillStyle = col; g.lineWidth = 4; const gx = -w / 2 + 30, gy = -h / 2 + 100, gw = w - 60;
  if (i === 0) for (let j = 0; j < 3; j++) { g.globalAlpha = k * (1 - j * 0.25); g.beginPath(); g.moveTo(gx, gy + 20 + j * 34); g.lineTo(gx + gw, gy + 20 + j * 34); g.stroke(); }
  else if (i === 1) { for (let j = 0; j < 4; j++) g.fillRect(gx + j * 70, gy + 30 + (j % 2) * 30, 50, 8); g.fillRect(gx + gw - 110, gy + 20, 110, 40); }
  else if (i === 2 || i === 4) { g.beginPath(); for (let j = 0; j <= 20; j++) { const xx = gx + j * gw / 20, yy = gy + 50 + Math.sin(j * 0.7 + i) * 30 * (i === 4 ? 0.5 : 1); j ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); }
  else if (i === 3) for (let j = 0; j < 12; j++) { const hh = (j === 8 ? 90 : 10 + (j * 37 % 30)); g.fillRect(gx + j * gw / 12, gy + 100 - hh, gw / 16, hh); }
  else { g.font = '600 24px VWMono'; g.fillText('WALL ABOVE  7,758', gx, gy + 10); g.fillText('SPOT        7,746', gx, gy + 46); g.fillText('WALL BELOW  7,741', gx, gy + 82); }
  g.restore(); }
function cards(t) { if (t < T.cards || t > T.slogan + b(0.5)) return; const out = 1 - seg(t, T.slogan, T.slogan + b(0.5)), g = VW.g;
  const pos = [[300, 720], [790, 870], [290, 1030], [790, 1180], [300, 1340], [780, 1470]];
  CARDS.forEach(([ti, col], i) => { const k = seg(t, T.cards + i * b(0.5), T.cards + i * b(0.5) + b(0.45), eo) * out; if (k <= 0) return; const [x, y] = pos[i];
    card(x + (1 - k) * (i % 2 ? 500 : -500), y - 25 * Math.sin(t * 0.9 + i) - 40 * seg(t, T.cards, T.slogan), 420, 220, ti, col, k, i, t); });
  const k = seg(t, T.cards + b(3.2), T.cards + b(3.6), eo) * out; if (k > 0) { g.save(); g.globalAlpha = k; g.font = '700 84px VWSans'; g.textAlign = 'center'; g.fillStyle = '#FFF'; g.shadowColor = 'rgba(0,0,0,0.9)'; g.shadowBlur = 30; g.fillText('One terminal.', 540, 500); g.restore(); } }
function slogan(t) { if (t < T.slogan || t > T.end + b(0.5)) return; const g = VW.g, out = 1 - seg(t, T.end, T.end + b(0.5)), words = ['SEE', 'WHAT', 'OTHERS', "CAN'T."];
  words.forEach((w, i) => { const k = seg(t, T.slogan + i * b(0.5), T.slogan + i * b(0.5) + b(0.4), eo); if (k <= 0) return; g.save(); g.globalAlpha = k * out; g.filter = `blur(${(1 - k) * 18}px)`;
    g.font = '700 150px VWSans'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = i === 2 ? VX.LBLUE : '#FFF'; if (i === 2) { g.shadowColor = 'rgba(90,140,255,0.9)'; g.shadowBlur = 40; }
    g.fillText(w, 540, 720 + i * 170 + (1 - k) * 40); g.restore(); }); }
function render(t) {
  const g = VW.g; g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#02040A'; g.fillRect(0, 0, 1080, 1920);
  const hz = g.createRadialGradient(540, 1000, 60, 540, 1000, 1100); hz.addColorStop(0, `rgba(47,107,255,${0.10 + 0.12 * VW.punch(HITS, t, 0.08)})`); hz.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = hz; g.fillRect(0, 0, 1080, 1920);
  const [sx, sy] = shake(t); g.save(); g.translate(sx, sy);
  logoIgnite(t); chart(t); chips(t); megaPrint(t); cards(t); slogan(t);
  g.restore(); flash(t); VW.vignette();
  const endK = seg(t, VX.C.logo0, VX.C.logo0 + 0.5), barK = seg(t, b(2), b(2.4)) * (1 - endK); VX.topBar(barK, 'ES');
  if (t > VX.C.logo0) { const pts = []; for (let i = 0; i < 40; i++) pts.push([mix(150, 930, i / 39), 980]); VX.end(t, pts); }
}
window.READY = (async () => { await VW.loadFonts(); await VW.loadBrand(); pixels();
  VX.WORDS = []; VX.SENT = []; VX.C = { logo0: T.end, dvv: [T.end + 2.35, T.end + 2.9], loop0: T.end + 4.3 }; VX.TOTAL = VX.C.loop0 + 0.5;
  return VX.ready(render, { T, HITS, B, logo0: T.end, dvv: VX.C.dvv, total: VX.TOTAL }); })();
