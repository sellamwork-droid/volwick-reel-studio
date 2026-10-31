// V0006 · THE BAR, 3D (T4, 31 Oct 2026). Power 16:29: take only the style of the 3D edit (depth, light, camera moves, rhythm) and rebuild every
// moment from this video's own story. Nothing reused from V0010's sections.
// Story, told in space: the trader's chart stands in front of us, price rips through the line he drew and is thrown back.
// "What was above the line?": the chart tips back and becomes a floor, the lights go out, and Volwick's dealer walls rise out of it as glass fins,
// one per price level. The same move again: the price runs along the floor into the call-wall fin, the fin takes the hit and holds, the price falls back.
// The chart stands up again as the Volwick terminal: Block Prints at the high, the wall's tooltip. Approved ending (VW.logoForm from the price line).
// Simulated ES session (scenes/v0006_dyn/gen_data.py), no real data. Hook (pole vaulter) composited in front, 0.755 s = one beat of "Never stop trading".
import * as THREE from '../v0010_edit3d/lib/three.module.min.js';   // shared copy of three.js
const { lin, eo, eio, mix, clamp } = VW;
const W = 1080, H = 1920, BT = 0.755;
const T = { top1: 2 * BT, fall: 3 * BT, tilt: 3 * BT, dark: 3.5 * BT, fins: 4 * BT, rew: 5 * BT, rip: 6 * BT, hit: 8 * BT, back: 9 * BT, up: 9.5 * BT, prints: 10.5 * BT,
  tip: 11 * BT, out: 12 * BT, end: 13.5 * BT };
const LSP = 1.7; T.total = T.end + 4.2;
// ---------- session ----------
let BARS = [];
const RES = 7731.5, CALLW = 7733.5;
const WALLS = [ { p: 7741.5, fam: 'callS', net: '−$6.4M', kind: 'call wall · short γ' }, { p: CALLW, fam: 'callL', net: '+$12.6M', kind: 'call wall · long γ', star: true },
  { p: 7727.5, fam: 'callL', net: '+$3.9M', kind: 'call wall · long γ' }, { p: 7722.5, fam: 'putL', net: '+$9.7M', kind: 'put wall · long γ' }, { p: 7712.5, fam: 'putS', net: '−$8.8M', kind: 'put wall · short γ' } ];
const FAMC = { callL: '#33C489', callS: '#49B7CC', putL: '#E0605F', putS: '#B16FD0' };
const PRINTS = [ { i: 20, p: 7731.25, q: '740', gold: true }, { i: 38, p: 7725.0, q: '410' }, { i: 57, p: 7733.0, q: '1,250 ×2', gold: true }, { i: 59, p: 7723.5, q: '880', gold: true } ];
const st = s => ({ s, k: Math.floor(s) + 1, f: s - Math.floor(s) });
function barAt(i, S) { const b = BARS[i]; if (!b) return null; if (i < S.k) return b; if (i > S.k) return null;
  const n = b.path.length - 1, u = S.f * n, j = Math.floor(u); let h = b.o, l = b.o; for (let q = 0; q <= Math.min(j, n); q++) { h = Math.max(h, b.path[q]); l = Math.min(l, b.path[q]); }
  const c = b.path[Math.min(j, n)]; return { o: b.o, h: Math.max(h, c), l: Math.min(l, c), c, v: b.v * S.f }; }
const lastP = S => { const b = barAt(S.k, S); return b ? b.c : BARS[S.k - 1].c; };
function sAt(P, t) { if (t <= P[0][0]) return P[0][1]; for (let q = 0; q < P.length - 1; q++) { const [a, sa] = P[q], [b, sb] = P[q + 1]; if (t <= b) return sa + (sb - sa) * eio(clamp((t - a) / (b - a), 0, 1)); } return P[P.length - 1][1]; }
// replay: rip and rejection, a short pause while the walls rise, rewind, the same rip into the call wall, the fall, then calm
const SP = [[0, 52.1], [T.top1, 56.2], [T.fall + 0.3, 57.8], [T.rew, 58.1], [T.rip - 0.05, 51.9], [T.hit, 56.2], [T.back + 0.2, 57.8], [T.out, 59.6], [T.end, 60.6]];
const money = p => p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
function txt(g, s, x, y, f, c, al = 'left', bl = 'middle') { g.font = f; g.fillStyle = c; g.textAlign = al; g.textBaseline = bl; g.fillText(s, x, y); return g.measureText(s).width; }
function rr(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }

// ---------- the chart, one surface with two skins: the trader's white chart and the Volwick terminal ----------
const FW = 1000, FH = 1360, HD = 170, CY0 = 230, CY1 = 1200, LO = 7716, HI = 7743, AX = 860;
const py = p => CY1 - (p - LO) / (HI - LO) * (CY1 - CY0), XR = 800, SPX = 17.5, px = (i, S) => XR - (S.s - i) * SPX;
let chartCv, chartG, chartTex;
function drawChart(S, t, k) {   // k: 0 = white charting software, 1 = Volwick
  const g = chartG, last = barAt(S.k, S) || BARS[S.k - 1], lp = last.c, mvP = lastP(st(sAt(SP, Math.max(0, t - 0.2))));
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, FW, FH); g.globalAlpha = 1;
  const bgL = [255, 255, 255], bgD = [6, 10, 20], bg = bgL.map((c, j) => Math.round(mix(c, bgD[j], k))); rr(g, 0, 0, FW, FH, 28); g.fillStyle = `rgb(${bg})`; g.fill();
  const ink = k < 0.5 ? '#131722' : '#E6EBF3', sub = k < 0.5 ? '#787B86' : '#7F8AA0', line = k < 0.5 ? '#E0E3EB' : 'rgba(140,170,230,0.16)', UP = k < 0.5 ? '#089981' : '#2FB67C', DN = k < 0.5 ? '#F23645' : '#E2575F';
  // header: TradingView-like bar, or the Volwick layer row (bar 2, spread over the width, unused controls dimmed)
  if (k < 0.5) { g.globalAlpha = 1 - 2 * k; txt(g, '⌕  ES', 34, 52, '700 30px VWSans', ink); txt(g, '1m', 162, 52, '700 30px VWSans', ink); txt(g, 'ƒx  Indicators', 236, 52, '600 29px VWSans', ink);
    rr(g, 470, 28, 156, 48, 9); g.fillStyle = '#E3EFFD'; g.fill(); txt(g, '⟲ Replay', 490, 53, '700 28px VWSans', '#2962FF');
    let x = 34; x += txt(g, 'E-mini S&P 500 Futures · 1 · CME', x, 128, '600 25px VWSans', ink) + 16; const c = lp >= last.o ? UP : DN;
    for (const [n, v] of [['O', last.o], ['H', last.h], ['L', last.l], ['C', lp]]) { x += txt(g, n, x, 128, '600 24px VWSans', sub) + 4; x += txt(g, money(v), x, 128, '600 24px VWSans', c) + 12; } }
  else { g.globalAlpha = 2 * k - 1; const wm = VW.assets.wm, wh = 34, ww = wh * wm.width / wm.height; g.save(); g.globalCompositeOperation = 'lighter'; g.drawImage(wm, 30, 40 - wh / 2, ww, wh); g.restore();
    txt(g, `·  ES ${money(lp)}`, 40 + ww, 41, '600 25px VWMono', '#97A3B3'); rr(g, FW - 92, 20, 62, 40, 8); g.strokeStyle = 'rgba(150,180,240,0.4)'; g.lineWidth = 1.5; g.stroke(); txt(g, '1m', FW - 61, 41, '700 24px VWMono', ink, 'center');
    const rows = [[96, 'DEALER', [['WALLS Top 5', 'W'], ['METRIC GEX'], ['EXPIRY All'], ['MAPS None']]], [146, 'ACTIVITY', [['BLOCK PRINTS', 'B'], ['CVD'], ['CDI'], ['FLOW']]]];
    const on = { W: lin(t, T.fins, T.fins + 0.2), B: lin(t, T.prints, T.prints + 0.15) };
    rows.forEach(([y, lab, chips]) => { const x0 = 30 + txt(g, lab, 30, y, '600 18px VWMono', '#5E6B80') + 14, gap = 10, w = (FW - 30 - x0 - gap * 3) / 4;
      chips.forEach(([s, key], j) => { const x = x0 + j * (w + gap), a = key ? on[key] : 0, gold = key === 'B'; g.save(); if (!key) g.globalAlpha *= 0.45;
        rr(g, x, y - 19, w, 38, 8); g.fillStyle = gold ? `rgba(242,193,78,${0.06 + 0.3 * a})` : `rgba(47,107,255,${0.04 + 0.3 * a})`; g.fill();
        g.strokeStyle = gold ? 'rgba(242,193,78,0.85)' : `rgba(140,170,240,${0.3 + 0.6 * a})`; g.lineWidth = 1.5; g.stroke(); txt(g, s, x + 12, y + 1, '600 22px VWMono', gold ? '#F2C14E' : a > 0.5 ? '#ECEFF4' : '#97A3B3'); g.restore(); }); }); }
  g.globalAlpha = 1; g.fillStyle = line; g.fillRect(0, HD, FW, 2); g.fillRect(AX, HD, 2, FH - HD - 70);
  // price grid and axis
  for (let p = LO; p <= HI; p += 2) { g.fillStyle = k < 0.5 ? '#F0F3FA' : 'rgba(120,150,200,0.06)'; g.fillRect(10, Math.round(py(p)), AX - 10, 2); if (p % 4 === 0) txt(g, money(p), (AX + FW) / 2, py(p), '600 22px VWMono', sub, 'center'); }
  g.save(); g.beginPath(); g.rect(10, HD + 4, AX - 12, FH - HD - 80); g.clip();
  // the Volwick walls drawn on the chart under the fins
  if (k > 0.5) WALLS.forEach((w, j) => { const a = fin(t, j); if (a <= 0) return; const y = py(w.p), c = FAMC[w.fam]; const lg = g.createLinearGradient(0, 0, AX, 0); lg.addColorStop(0, VW.rgba(c, 0.05)); lg.addColorStop(1, VW.rgba(c, 0.9 * a));
    g.fillStyle = lg; g.fillRect(10, y - 2, AX - 10, w.star ? 5 : 3); });
  // candles + volume
  for (let i = 0; i <= S.k; i++) { const b = barAt(i, S); if (!b) continue; const x = px(i, S); if (x < 0) continue; const c = b.c >= b.o ? UP : DN; g.fillStyle = c;
    g.fillRect(x - 1.5, py(b.h), 3, py(b.l) - py(b.h)); const y0 = py(Math.max(b.o, b.c)); g.fillRect(x - 6.5, y0, 13, Math.max(3, py(Math.min(b.o, b.c)) - y0));
    g.globalAlpha = 0.35; const vh = Math.min(70, b.v / 3600 * 70); g.fillRect(x - 6.5, FH - 90 - vh, 13, vh); g.globalAlpha = 1; }
  // the trader's line
  const ly = py(RES); if (k < 0.5) { g.fillStyle = '#2962FF'; g.fillRect(10, ly - 2.5, AX - 10, 5); [130, 560].forEach(hx => { g.beginPath(); g.arc(hx, ly, 9, 0, 7); g.fillStyle = '#FFF'; g.fill(); g.lineWidth = 3; g.strokeStyle = '#2962FF'; g.stroke(); }); }
  else { g.setLineDash([12, 9]); g.strokeStyle = 'rgba(127,162,255,0.9)'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(10, ly); g.lineTo(AX, ly); g.stroke(); g.setLineDash([]); rr(g, 330, ly + 10, 150, 30, 5); g.fillStyle = 'rgba(41,98,255,0.9)'; g.fill(); txt(g, 'YOUR LEVEL', 405, ly + 26, '700 19px VWMono', '#FFF', 'center'); }
  // speed trail on the price head
  const mv = lp - mvP; if (Math.abs(mv) > 0.6) { const x = px(S.k, S) + 20, ya = py(mvP), yb = py(lp), c2 = mv > 0 ? UP : DN, gr = g.createLinearGradient(0, ya, 0, yb); gr.addColorStop(0, VW.rgba(c2, 0)); gr.addColorStop(1, VW.rgba(c2, 0.95));
    g.fillStyle = gr; g.fillRect(x, Math.min(ya, yb), 8, Math.abs(yb - ya)); const d = mv > 0 ? -1 : 1; g.fillStyle = c2; g.beginPath(); g.moveTo(x - 11, yb - 11 * d); g.lineTo(x + 19, yb - 11 * d); g.lineTo(x + 4, yb + 11 * d); g.closePath(); g.fill(); }
  // Block Prints at the high, gold
  const bp = eo(lin(t, T.prints, T.prints + 0.25)); if (bp > 0) PRINTS.forEach(pr => { if (pr.i > S.k) return; const x = px(pr.i, S), y = py(pr.p), pop = 1 + 0.5 * (1 - bp);
    g.save(); g.globalAlpha = bp; g.fillStyle = '#F4F6FA'; g.shadowColor = 'rgba(255,255,255,0.6)'; g.shadowBlur = 8; g.fillRect(x - 20 * pop, y - 2.5, 40 * pop, 5); g.shadowBlur = 0;
      g.save(); g.translate(x, y); g.rotate(Math.PI / 4); g.fillStyle = pr.gold ? '#F2C14E' : '#F4F6FA'; g.fillRect(-6 * pop, -6 * pop, 12 * pop, 12 * pop); g.restore();
      g.font = '700 21px VWMono'; const tw = g.measureText(pr.q).width; rr(g, x - tw - 40, y - 34, tw + 18, 30, 6); g.fillStyle = pr.gold ? '#F2C14E' : '#E9EDF5'; g.fill(); txt(g, pr.q, x - tw - 31, y - 19, '700 21px VWMono', '#0A0E16'); g.restore(); });
  g.restore();
  // price tags
  const tag = (p, bg, fg) => { rr(g, AX + 6, py(p) - 18, FW - AX - 12, 36, 5); g.fillStyle = bg; g.fill(); txt(g, money(p), (AX + FW) / 2, py(p) + 1, '700 21px VWMono', fg, 'center'); };
  if (k < 0.5) tag(RES, '#2962FF', '#FFF'); tag(lp, k < 0.5 ? (lp >= last.o ? UP : DN) : '#E9EDF3', k < 0.5 ? '#FFF' : '#0B1220');
  // wall labels on the Volwick skin (right side, like the terminal)
  if (k > 0.5) WALLS.forEach((w, j) => { const a = eo(lin(fin(t, j), 0.6, 1)); if (a <= 0) return; const s = `${w.star ? '★ ' : ''}${money(w.p)} · ${w.net}`, y = py(w.p); g.save(); g.globalAlpha = a; g.font = '700 22px VWMono';
    const tw = g.measureText(s).width; rr(g, AX - tw - 34, y - 34, tw + 26, 30, 6); g.fillStyle = 'rgba(4,8,16,0.85)'; g.fill(); txt(g, s, AX - 21, y - 18, '700 22px VWMono', FAMC[w.fam], 'right'); g.restore(); });
  // the wall tooltip, as in the terminal
  const tp = eo(lin(t, T.tip, T.tip + 0.2)) * (1 - lin(t, T.end - 0.25, T.end)); if (tp > 0) { const y = py(CALLW) - 70, x1 = AX - 20; g.save(); g.globalAlpha = tp;
    rr(g, x1 - 420, y - 150, 420, 132, 12); g.fillStyle = 'rgba(10,16,30,0.97)'; g.fill(); g.strokeStyle = 'rgba(51,196,137,0.8)'; g.lineWidth = 2; g.stroke();
    txt(g, '→ ES 7,733.50 · GEX', x1 - 398, y - 118, '600 22px VWMono', '#97A3B3'); txt(g, 'Call wall · long γ', x1 - 398, y - 82, '700 25px VWMono', '#33C489'); txt(g, 'Net +$12.6M', x1 - 398, y - 44, '700 29px VWMono', '#ECEFF4'); g.restore(); }
  txt(g, k < 0.5 ? 'Illustrative replay. Simulated data.' : 'Simulated ES session. Dealer Walls: modeled options-derived positioning.', 30, FH - 40, '500 20px VWMono', sub);
  chartTex.needsUpdate = true;
}
const fin = (t, j) => eo(lin(t, T.fins + j * BT / 4, T.fins + j * BT / 4 + 0.32));   // the walls rise one per sixteenth

// ---------- three.js: a dark room with a perspective floor grid, slow particles, the chart, the glass fins ----------
let R, CAM, scene, chart, fins = [], finMats = [], ripple, headGlow, gl;
const D = 960 / Math.tan(THREE.MathUtils.degToRad(17.5));
function glowMat(col, base = 0.55) { return new THREE.ShaderMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
  uniforms: { c: { value: new THREE.Color(col) }, k: { value: 0 }, hit: { value: 0 }, base: { value: base } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
  fragmentShader: 'uniform vec3 c; uniform float k, hit, base; varying vec2 vUv; void main(){ float h = vUv.y; float edge = smoothstep(0.0,0.04,vUv.x)*smoothstep(1.0,0.96,vUv.x); float a = (pow(1.0-h,1.6)*base + exp(-pow((h-0.98)/0.02,2.0))*0.9 + hit*0.9*exp(-h*2.5)) * edge * k; gl_FragColor = vec4(c*a + vec3(1.0)*hit*a*0.35, a); }' }); }
function build3D() {
  gl = document.createElement('canvas'); gl.width = W; gl.height = H;
  R = new THREE.WebGLRenderer({ canvas: gl, antialias: true, alpha: true, preserveDrawingBuffer: true }); R.setPixelRatio(1); R.setSize(W, H, false); R.outputColorSpace = THREE.SRGBColorSpace; R.setClearColor(0x000000, 0);
  CAM = new THREE.PerspectiveCamera(35, W / H, 10, 30000); scene = new THREE.Scene(); scene.fog = new THREE.Fog(0x030714, 2600, 9000);
  const grid = new THREE.GridHelper(16000, 120, 0x1b3772, 0x0d1d40); grid.position.y = -900; scene.add(grid);
  const n = 900, pos = new Float32Array(n * 3), r = VW.rng(91); for (let i = 0; i < n; i++) { pos[i * 3] = (r() - 0.5) * 9000; pos[i * 3 + 1] = (r() - 0.3) * 5000; pos[i * 3 + 2] = -r() * 9000 + 1500; }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3)); scene.add(new THREE.Points(pg, new THREE.PointsMaterial({ size: 5, color: 0x6f8fd8, transparent: true, opacity: 0.55, depthWrite: false })));
  chartCv = document.createElement('canvas'); chartCv.width = FW; chartCv.height = FH; chartG = chartCv.getContext('2d');
  chartTex = new THREE.CanvasTexture(chartCv); chartTex.colorSpace = THREE.SRGBColorSpace; chartTex.anisotropy = 8; chartTex.minFilter = THREE.LinearMipmapLinearFilter;
  chart = new THREE.Mesh(new THREE.PlaneGeometry(FW, FH), new THREE.MeshBasicMaterial({ map: chartTex, transparent: true, side: THREE.DoubleSide })); scene.add(chart);
  WALLS.forEach(w => { const m = glowMat(FAMC[w.fam], w.star ? 0.7 : 0.45), f = new THREE.Mesh(new THREE.PlaneGeometry(AX - 10, 1), m);
    f.rotation.x = Math.PI / 2; f.position.set((10 + AX) / 2 - FW / 2, FH / 2 - py(w.p), 0); chart.add(f); fins.push(f); finMats.push(m); });
  ripple = new THREE.Mesh(new THREE.RingGeometry(0.85, 1, 64), new THREE.MeshBasicMaterial({ color: 0xbfffe2, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
  chart.add(ripple);
  const gc = document.createElement('canvas'); gc.width = gc.height = 128; const gg = gc.getContext('2d'), rg = gg.createRadialGradient(64, 64, 0, 64, 64, 64); rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(0.3, 'rgba(160,190,255,0.5)'); rg.addColorStop(1, 'rgba(60,110,255,0)'); gg.fillStyle = rg; gg.fillRect(0, 0, 128, 128);
  headGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(gc), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); headGlow.scale.set(120, 120, 1); chart.add(headGlow);
}
const local = (x, y, z = 0) => new THREE.Vector3(x - FW / 2, FH / 2 - y, z);
function proj(v) { const p = v.clone().project(CAM); return [(p.x + 1) * W / 2, (1 - p.y) * H / 2, p.z]; }
// camera and chart pose keyframes: [t, tilt, camera offset from the look point (x, y, z), look at ('c' centre, 'h' price head, 'w' call wall), chart y]
const POSE = [ [0, 0.10, [0, 0, 1.24], 'c', -120], [T.top1, 0.06, [0, 0, 1.14], 'c', -120], [T.fall, 0.10, [0, 0, 1.2], 'c', -110],
  [T.tilt + 0.15, 0.10, [0, 0, 1.2], 'c', -110], [T.fins, 1.18, [-0.22, 0.72, 1.05], 'w', -260], [T.rew, 1.18, [-0.3, 0.55, 0.95], 'w', -260],
  [T.rip, 1.22, [-0.42, 0.34, 0.62], 'h', -260], [T.hit, 1.25, [-0.3, 0.3, 0.52], 'w', -260], [T.back + 0.1, 1.2, [-0.25, 0.5, 0.8], 'w', -260],
  [T.up + 0.6, 0.04, [0, 0, 1.18], 'c', -120], [T.end, 0.04, [0, 0, 1.18], 'c', -120] ];
function look(kind, S) { if (kind === 'h') return local(px(S.k, S), py(lastP(S))); if (kind === 'w') return local(560, py(CALLW)); return local(FW / 2, FH / 2 + 40); }
function pose(t, S) {
  let q = 0; while (q < POSE.length - 1 && t > POSE[q + 1][0]) q++; const A = POSE[q], B = POSE[Math.min(q + 1, POSE.length - 1)], u = B === A ? 1 : eio(clamp((t - A[0]) / (B[0] - A[0]), 0, 1));
  chart.rotation.set(-mix(A[1], B[1], u), mix(-0.12, 0.04, eo(lin(t, 0, T.top1))) * (1 - lin(t, T.tilt, T.fins)), 0); chart.position.set(0, mix(A[4], B[4], u), 0); chart.updateMatrixWorld();
  const la = look(A[3], S).applyMatrix4(chart.matrixWorld), lb = look(B[3], S).applyMatrix4(chart.matrixWorld), L = la.lerp(lb, u);
  const o = A[2].map((v, j) => mix(v, B[2][j], u)), hit = Math.exp(-Math.pow((t - T.hit) / 0.08, 2)) * 1.6 + Math.exp(-Math.pow((t - T.top1) / 0.07, 2)), sh = hit * 14 * Math.sin(t * 92);
  CAM.position.set(L.x + o[0] * D + sh, L.y + o[1] * D + sh * 0.6, L.z + o[2] * D); CAM.up.set(0, 1, 0); CAM.lookAt(L); CAM.updateMatrixWorld();
}
// ---------- text ----------
const TITLES = [ [0, '', 'BREAKOUT', '?'], [T.top1, 'YOUR ', 'BREAKOUT', ' JUST FAILED.'], [T.tilt, 'WHAT WAS ', 'ABOVE', ' THE LINE?'], [T.fins + 0.2, 'DEALER ', 'WALLS', '.'],
  [T.hit, 'BLOCKED BY A ', 'CALL WALL', '.'], [T.out, 'TRADE WITH ', 'INSTITUTIONAL', ' CONTEXT.'] ];
function title(g, t) {
  let j = -1; TITLES.forEach((o, q) => { if (t >= o[0]) j = q; }); if (j < 0 || t > T.end) return; const o = TITLES[j], k = (j ? eo(lin(t, o[0], o[0] + 0.16)) : 1) * (1 - lin(t, T.end - 0.2, T.end));
  const pop = j ? 1 + 0.22 * Math.exp(-(t - o[0]) * 12) : 1, parts = o.slice(1); g.save(); g.globalAlpha = k; g.translate(540, 300); g.scale(pop, pop); g.font = '700 58px VWSans'; g.letterSpacing = '1px';
  let tw = parts.reduce((a, p) => a + g.measureText(p).width, 0); if (tw > 860) { const s = 860 / tw; g.scale(s, s); } let x = -tw / 2; g.textBaseline = 'middle'; g.shadowColor = 'rgba(0,0,0,0.9)'; g.shadowBlur = 26;
  parts.forEach((p, q) => { g.fillStyle = q === 1 ? (j === 4 ? '#5BE39A' : '#6E9BFF') : '#F2F5FA'; g.fillText(p, x, 0); x += g.measureText(p).width; }); g.restore();
  const sub = [[0, 'ES 1m · price rips through the line you drew'], [T.top1, '...and drops straight back under it'], [T.tilt, 'A line shows where. Not how dealers hedge above it.'],
    [T.fins + 0.2, 'Options positioning, one wall per level'], [T.rew, 'Same move. Walls on.'], [T.hit, 'long γ · +$12.6M · it holds, one tick above the high'], [T.prints, 'Block Prints: 1,250 ×2 traded at the high'],
    [T.out, 'Long γ: dealers hedge against the move. Not a signal.']]; let js = -1; sub.forEach((o, q) => { if (t >= o[0]) js = q; });
  if (js >= 0) { g.save(); g.globalAlpha = (js ? eo(lin(t, sub[js][0], sub[js][0] + 0.2)) : 1) * (1 - lin(t, T.end - 0.2, T.end)); txt(g, sub[js][1], 540, 362, '600 25px VWMono', '#9FB3D9', 'center'); g.restore(); }
}
// ---------- frame ----------
function backdrop(g) { const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#050A1A'); bg.addColorStop(1, '#010309'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
  const hz = g.createRadialGradient(540, 1000, 40, 540, 1000, 1100); hz.addColorStop(0, 'rgba(47,107,255,0.12)'); hz.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = hz; g.fillRect(0, 0, W, H); }
function render(t) {
  const g = VW.g; g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.filter = 'none'; g.globalCompositeOperation = 'source-over'; backdrop(g);
  if (t > T.end) return endCard(g, t);
  const tc = Math.min(t, T.end), S = st(sAt(SP, tc)), dark = eio(lin(tc, T.tilt + 0.25, T.fins - 0.05)) * (1 - 0) ;
  drawChart(S, tc, dark); pose(tc, S);
  const hit = Math.exp(-Math.max(0, tc - T.hit) * 5) * (tc >= T.hit ? 1 : 0);
  fins.forEach((f, j) => { const a = fin(tc, j), w = WALLS[j], hgt = (w.star ? 300 : 170) * a * (1 + 0.25 * hit * (w.star ? 1 : 0)), down = 1 - eio(lin(tc, T.back + 0.2, T.up + 0.5));
    f.scale.set(1, Math.max(0.001, hgt * down), 1); f.position.z = hgt * down / 2; finMats[j].uniforms.k.value = a * down; finMats[j].uniforms.hit.value = w.star ? hit : 0; });
  { const r0 = lin(tc, T.hit, T.hit + 0.7), s = 40 + 520 * eo(r0); ripple.position.copy(local(px(56.2 * 0 + 57, S), py(CALLW), 4)); ripple.scale.set(s, s * 0.35, 1); ripple.material.opacity = 0.8 * (1 - r0) * (tc >= T.hit ? 1 : 0); }
  { const hp = local(px(S.k, S), py(lastP(S)), 6); headGlow.position.copy(hp); const mvk = Math.abs(lastP(S) - lastP(st(sAt(SP, Math.max(0, tc - 0.2))))); headGlow.material.opacity = clamp(mvk / 3, 0.15, 1) * (dark > 0.5 ? 1 : 0.6); }
  R.clear(); R.render(scene, CAM); g.drawImage(gl, 0, 0); g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.28 + 0.4 * hit; g.filter = 'blur(16px)'; g.drawImage(gl, 0, 0); g.restore();
  const fl = Math.exp(-Math.pow((tc - T.top1) / 0.07, 2)) * 0.18 + Math.exp(-Math.pow((tc - T.hit) / 0.08, 2)) * 0.28; if (fl > 0.01) { g.fillStyle = `rgba(215,255,235,${fl})`; g.fillRect(0, 0, W, H); }
  // the call wall's label floats above its fin while the chart lies flat
  const lk = fin(tc, 1) * (1 - lin(tc, T.back + 0.2, T.up + 0.3)); if (lk > 0.02) { const top = proj(local(560, py(CALLW), 300 * fin(tc, 1)).applyMatrix4(chart.matrixWorld)), sc = 1 + 0.3 * hit, s = '★ CALL WALL · long γ · +$12.6M';
    g.save(); g.globalAlpha = lk; g.translate(clamp(top[0], 300, 780), top[1] - 30); g.scale(sc, sc); g.font = '700 28px VWMono'; const tw = g.measureText(s).width; rr(g, -tw / 2 - 18, -24, tw + 36, 48, 10); g.fillStyle = 'rgba(4,16,11,0.9)'; g.fill();
    g.strokeStyle = '#33C489'; g.lineWidth = 2; g.stroke(); txt(g, s, 0, 1, '700 28px VWMono', '#5BE39A', 'center'); g.restore(); }
  title(g, tc); VW.vignette();
}
// approved ending (the price line folds into the V, wordmark, typed tagline, DISCOVER VOLWICK →, one disclaimer line)
let ENDPTS = [];
function endCard(g, t) {
  VW.logoForm((t - T.end) * LSP, ENDPTS, { noUrl: true, dy: -20, tagY: 1318, tagSize: 32, tagSpacing: 5, tagline: [['TRADE', VW.COL.ink], ['WITH', VW.COL.ink], ['INSTITUTIONAL', VW.COL.blue], ['CONTEXT.', VW.COL.ink]] });
  const dv = T.end + 3.45 / LSP, k = eo(lin(t, dv, dv + 0.3));
  if (k > 0) { g.save(); g.globalAlpha = k; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '700 44px VWMono'; g.letterSpacing = '5px'; g.fillStyle = VW.COL.blue; g.shadowColor = 'rgba(90,140,255,0.8)'; g.shadowBlur = 20; g.fillText('DISCOVER VOLWICK →', 543, 1410 + (1 - k) * 10); g.restore(); }
  const kd = eo(lin(t, dv + 0.3, dv + 0.7)); if (kd > 0) { g.save(); g.globalAlpha = kd; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '600 29px VWMono'; g.fillStyle = VW.COL.ink2; g.fillText('Simulated data. Not investment advice.', 540, 1496); g.restore(); }
}
window.READY = (async () => {
  await VW.loadFonts(); await VW.loadBrand(); BARS = (await (await fetch('data.json')).json()).bars; build3D();
  // where the price line sits on screen at the end, for the approved ending
  { const S = st(sAt(SP, T.end)); drawChart(S, T.end, 1); pose(T.end, S); for (let i = Math.max(0, S.k - 26); i <= S.k; i++) { const b = barAt(i, S); if (b) { const p = proj(local(px(i, S), py(b.c)).applyMatrix4(chart.matrixWorld)); ENDPTS.push([p[0], p[1]]); } } }
  const S0 = st(sAt(SP, 0)); pose(0, S0); const hk = proj(local(px(S0.k, S0), py(lastP(S0))).applyMatrix4(chart.matrixWorld));
  window.render = render; render(0);
  return { total: T.total, events: { ...T, hook: [Math.round(hk[0]), Math.round(hk[1])], rew: T.tilt, walls: T.fins, top2: T.hit, aW: T.fins, aB: T.prints, term: T.fins, push: T.rip, bar: T.tilt, barEnd: T.fins, rise: T.up } };
})();
