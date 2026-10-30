// ============================================================
// VOLWICK · LIVE MARKET REACTIONS · LIVE scene (Power, 27 Oct 2026)
// The panel shows the real recording of the terminal chart (frames extracted from the capture).
// The scene adds only: one statement at a time, the ET clock of the recording, the declared speed,
// a name on the protagonist wall and, at the closest point, a bracket with the measured gap.
// ============================================================
const {COL, seg, lin, eo, eio, mix, clamp} = VW;
let P = null, E = {};
const BG = '#04070C', GOLD = '#F2C14E', INK = '#F2F4F8', INK2 = '#8C97A8', RED = '#FF5A63';
const PANEL = {x: 0, y: 440, w: 1080, h: 1280};
const color = c => ({gold: GOLD, ink: INK, ink2: INK2, wall: RED, blue: COL.blue}[c] || c);
const fmt = (p, d = 2) => p.toLocaleString('en-US', {minimumFractionDigits: d, maximumFractionDigits: d});
const hms = s => { s = Math.floor(s); return String(Math.floor(s / 3600)).padStart(2, '0') + ':' + String(Math.floor(s % 3600 / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };
const cache = new Map();
function img(src){ if (cache.has(src)) return cache.get(src); const im = new Image(); const pr = new Promise(r => { im.onload = () => r(im); im.onerror = () => r(null); }); im.src = src; const v = {im, pr}; cache.set(src, v);
  if (cache.size > 40) cache.delete(cache.keys().next().value); return v; }

function section(t){ return P.sections.find(s => t >= s.t0 && t < s.t1) || P.sections[P.sections.length - 1]; }
function etAt(t){ const s = section(t);
  if (s.et0 !== undefined) return s.et0 + (t - s.t0) * s.speed;
  const i = P.sections.indexOf(s), prev = P.sections[i - 1], next = P.sections[i + 1];
  if (s.name === 'rewind') return (t - s.t0) < (s.t1 - s.t0) / 2 ? prev.et1 : next.et0;
  return prev.et1; }
function frameFor(t){ const s = section(t);
  if (s.et0 !== undefined) { const i = clamp(Math.floor((t - s.t0) * 60), 0, s.n - 1); return P.frames + '/' + s.name + '_' + String(i + 1).padStart(5, '0') + '.jpg'; }
  const i = P.sections.indexOf(s), prev = P.sections[i - 1], next = P.sections[i + 1];
  if (s.name === 'rewind' && (t - s.t0) >= (s.t1 - s.t0) / 2) return P.frames + '/' + next.name + '_00001.jpg';
  return P.frames + '/' + prev.name + '_' + String(prev.n).padStart(5, '0') + '.jpg'; }
function camAt(t){ const C = P.cams; if (t <= C[0][0]) return C[0][1];
  for (let i = 0; i < C.length - 1; i++){ const [ta, a] = C[i], [tb, b] = C[i + 1]; if (t <= tb){ const k = eio(clamp((t - ta) / Math.max(1e-6, tb - ta), 0, 1)); return a.map((v, j) => mix(v, b[j], k)); } }
  return C[C.length - 1][1]; }
function lookup(arr, et){ let lo = 0, hi = arr.length - 1; if (et <= arr[0][0]) return arr[0]; if (et >= arr[hi][0]) return arr[hi];
  while (hi - lo > 1){ const m = (lo + hi) >> 1; if (arr[m][0] <= et) lo = m; else hi = m; } return arr[lo]; }
function toScreen(xc, yc, cam){ const [x0, y0, x1, y1] = cam; return [PANEL.x + (xc - x0) / (x1 - x0) * PANEL.w, PANEL.y + (yc - y0) / (y1 - y0) * PANEL.h]; }

async function drawPanel(t){
  const g = VW.g, cam = camAt(t), [rx0, ry0] = P.region; const f = img(frameFor(t)); const im = await f.pr;
  g.save(); g.beginPath(); g.rect(PANEL.x, PANEL.y, PANEL.w, PANEL.h); g.clip(); g.fillStyle = '#000'; g.fillRect(PANEL.x, PANEL.y, PANEL.w, PANEL.h);
  if (im){ g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
    g.drawImage(im, (cam[0] - rx0) * 2, (cam[1] - ry0) * 2, (cam[2] - cam[0]) * 2, (cam[3] - cam[1]) * 2, PANEL.x, PANEL.y, PANEL.w, PANEL.h); }
  // rewind: a short dip to dark between the hook and the start of the session
  const s = section(t); if (s.name === 'rewind'){ const u = (t - s.t0) / (s.t1 - s.t0); g.fillStyle = `rgba(4,7,12,${1 - Math.abs(u - 0.5) * 2})`; g.fillRect(PANEL.x, PANEL.y, PANEL.w, PANEL.h); }
  // soft edges so the panel sits in the frame
  let gr = g.createLinearGradient(0, PANEL.y, 0, PANEL.y + 60); gr.addColorStop(0, BG); gr.addColorStop(1, 'rgba(4,7,12,0)'); g.fillStyle = gr; g.fillRect(0, PANEL.y, 1080, 60);
  gr = g.createLinearGradient(0, PANEL.y + PANEL.h - 80, 0, PANEL.y + PANEL.h); gr.addColorStop(0, 'rgba(4,7,12,0)'); gr.addColorStop(1, BG); g.fillStyle = gr; g.fillRect(0, PANEL.y + PANEL.h - 80, 1080, 80);
  g.restore(); return cam; }

function drawWallMarks(t, cam){
  if (t >= E.logo0) return; const g = VW.g, et = etAt(t), w = lookup(P.wall, et), s = section(t); if (s.name === 'rewind') return;
  const [, ys] = toScreen(0, w[1], cam);
  // name of the protagonist wall, small, above the terminal's own line, left side of the panel
  g.save(); g.font = '700 26px VWMono'; g.letterSpacing = '3px'; g.textBaseline = 'alphabetic'; g.textAlign = 'left';
  g.fillStyle = 'rgba(4,7,12,0.75)'; const lab = 'DEALER WALL'; const tw = g.measureText(lab).width; g.fillRect(18, ys - 46, tw + 24, 34);
  g.fillStyle = RED; g.fillText(lab, 30, ys - 20); g.restore();
  // short highlight of the line on the first frames and at the closest point
  const hl = Math.exp(-t / 0.5) + (t >= E.touch ? Math.exp(-(t - E.touch) / 0.6) : 0) + (t >= E.hook_hi && t < E.hook_hi + 2 ? Math.exp(-(t - E.hook_hi) / 0.6) : 0);
  if (hl > 0.02){ g.save(); g.globalAlpha = Math.min(1, hl) * 0.8; g.strokeStyle = '#FF7A80'; g.lineWidth = 3; g.shadowColor = RED; g.shadowBlur = 22; g.beginPath(); g.moveTo(0, ys); g.lineTo(1080, ys); g.stroke(); g.restore(); }
  // the gap at the closest point: bracket from the high of the candle to the wall
  const showHook = t >= E.hook_hi && s.name === 'hook', showLive = t >= E.touch && (s.name === 'live');
  if (showHook || showLive){ const k = eo(clamp((t - (showHook ? E.hook_hi : E.touch)) / 0.35, 0, 1));
    const yh = w[1] + (w[2] - P.high.price) * P.ppt; const [xb, yb0] = toScreen(P.high.x_css + 16, w[1], cam), [, yb1] = toScreen(0, yh, cam);
    g.save(); g.globalAlpha = k; g.strokeStyle = GOLD; g.lineWidth = 3; g.beginPath(); g.moveTo(xb - 10, yb0); g.lineTo(xb, yb0); g.lineTo(xb, yb1); g.lineTo(xb - 10, yb1); g.stroke();
    g.font = '700 30px VWMono'; g.fillStyle = GOLD; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillStyle = 'rgba(4,7,12,0.8)'; g.fillRect(xb + 10, (yb0 + yb1) / 2 - 22, 190, 44);
    g.fillStyle = GOLD; g.fillText('1.75 PTS', xb + 20, (yb0 + yb1) / 2 + 1); g.restore(); }
}

function distText(t){ const et = etAt(t), p = lookup(P.samples, et)[1], lv = lookup(P.wall, et)[2]; return fmt(Math.max(0, lv - p)); }
function drawStatement(t){
  const g = VW.g, cur = P.statements.find(s => t >= s.t0 - 0.001 && t < s.t1); if (!cur) return;
  const a = (cur.t0 <= 0.001 ? 1 : eo(lin(t, cur.t0, cur.t0 + 0.2))) * (1 - eo(lin(t, cur.t1 - 0.15, cur.t1)));
  const size = cur.size || 74, lh = size * 1.06, y0 = cur.lines.length === 1 ? 340 : 300 - (size - 74) * 0.6;
  g.save(); g.globalAlpha = a; g.textBaseline = 'alphabetic'; g.textAlign = 'left';
  cur.lines.forEach((ln, i) => { const parts = []; for (let j = 0; j < ln.length; j += 2) parts.push([ln[j].replace('{d}', distText(t)), ln[j + 1]]);
    g.font = `700 ${size}px VWSans`; g.letterSpacing = '-1px'; const w = parts.reduce((s, p) => s + g.measureText(p[0]).width, 0); let x = 540 - w / 2;
    parts.forEach(([txt, c]) => { g.fillStyle = color(c); g.fillText(txt, x, y0 + i * lh + (1 - a) * 10); x += g.measureText(txt).width; }); });
  if (cur.sub){ g.font = '600 24px VWMono'; g.letterSpacing = '3px'; g.textAlign = 'center'; g.fillStyle = INK2; g.fillText(cur.sub, 542, 418); }
  g.restore(); }

function drawFooter(t){
  if (t >= E.logo0) return; const g = VW.g, s = section(t), y = PANEL.y + PANEL.h + 44;
  g.save(); g.textBaseline = 'middle'; g.font = '600 32px VWMono'; g.letterSpacing = '3px'; g.textAlign = 'left'; g.fillStyle = INK; g.fillText(hms(etAt(t)) + ' ET', 56, y);
  g.textAlign = 'right';
  if (s.name === 'rewind'){ g.fillStyle = INK2; g.fillText('REWIND', 1080 - 56, y); }
  else if (s.speed !== undefined && s.speed <= 1.01){ g.fillStyle = RED; const tx = 'LIVE · ×1'; g.fillText(tx, 1080 - 56, y); const w = g.measureText(tx).width;
    g.globalAlpha = 0.6 + 0.4 * Math.sin(t * 6); g.beginPath(); g.arc(1080 - 56 - w - 20, y, 9, 0, Math.PI * 2); g.fill(); }
  else if (s.speed !== undefined){ g.fillStyle = INK2; g.fillText('SPEED ×' + Math.round(s.speed), 1080 - 56, y); }
  g.restore(); }
function drawTop(t){
  const a = 1 - seg(t, E.logo0, E.logo0 + 0.4); if (a <= 0) return; const g = VW.g;
  VW.logoTL(a, 'ES', 52, 28, true);
  g.save(); g.globalAlpha = a; g.textBaseline = 'middle'; g.textAlign = 'left';
  const pulse = 0.55 + 0.45 * Math.sin(t * 4.5); g.fillStyle = `rgba(255,77,94,${pulse})`; g.beginPath(); g.arc(72, 182, 7, 0, Math.PI * 2); g.fill();
  g.font = '700 23px VWMono'; g.letterSpacing = '4px'; g.fillStyle = INK; g.fillText(P.texts.badge, 90, 183);
  const bw = g.measureText(P.texts.badge).width; g.font = '600 21px VWMono'; g.letterSpacing = '3px'; g.fillStyle = INK2; g.fillText(P.texts.source_line, 90 + bw + 18, 183);
  g.restore(); }

async function render(t){
  const g = VW.g; if (t >= E.loop0) t = 0;     // last frames: the loop back to the hook
  g.fillStyle = BG; g.fillRect(0, 0, 1080, 1920);
  const cam = await drawPanel(t); drawWallMarks(t, cam); drawStatement(t); drawFooter(t); drawTop(t);
  if (t >= E.logo0){ const e = (t - E.logo0) * 1.8; VW.logoForm(e, P.logoPts(), {noUrl: true});
    const k = eo(clamp((e - 3.25) / 0.5, 0, 1)); if (k > 0){ g.save(); g.globalAlpha = k; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '700 40px VWMono'; g.letterSpacing = '5px';
      g.fillStyle = COL.blue; g.fillText('DISCOVER VOLWICK →', 543, 1395); g.font = '500 21px VWMono'; g.letterSpacing = '2px'; g.fillStyle = '#5E6B80'; g.fillText(P.texts.disclaimer, 540, 1480); g.restore(); } }
  return true; }

(async () => {
  P = await (await fetch(new URLSearchParams(location.search).get('p'))).json();
  VW.assets.wm = await VW.loadImage('/08_AUTOMATION/brand/assets/wm_crop.png'); VW.assets.mono = await VW.loadImage('/08_AUTOMATION/brand/assets/mono.png');
  await VW.loadFonts(); E = P.events;
  // price path for the logo ending: the recorded prices (every 5 s) of the last 25 minutes, on the panel scale
  P.logoPts = () => { const cam = camAt(E.logo0), end = P.samples[P.samples.length - 1][0], w = lookup(P.wall, end), out = [];
    const sm = P.samples.filter(s => s[0] >= end - 1500); const step = Math.max(1, Math.floor(sm.length / 60));
    for (let i = 0; i < sm.length; i += step){ const [et, p] = sm[i]; const xc = P.high.x_css - (end - et) / 60 * 7.0, yc = w[1] + (w[2] - p) * P.ppt; out.push(toScreen(xc, yc, cam)); } return out; };
  window.render = render;
  window.READY = {total: E.total};
})();
