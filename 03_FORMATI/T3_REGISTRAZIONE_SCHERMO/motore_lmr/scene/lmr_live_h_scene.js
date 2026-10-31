// ============================================================
// VOLWICK · LIVE MARKET REACTIONS · horizontal scene (Power, 27 Oct 2026 evening)
// 16:9, no hook. The real terminal recording fills the frame almost 1:1. The video stops (PAUSED) to show:
// callouts on the wall, on the price and on the gap, plus one plain sentence in the bottom bar.
// ============================================================
const {COL, seg, lin, eo, eio, mix, clamp} = VW;
const H = document.getElementById('h').getContext('2d');
let P = null, E = {};
const BG = '#04070C', GOLD = '#F2C14E', INK = '#F2F4F8', INK2 = '#8C97A8', INK3 = '#5E6B80', RED = '#FF5A63';
const PANEL = {x: 40, y: 24, w: 1840, h: 928}, FULL = [0, 0, 1678, 846];
const fmt = (p, d = 2) => p.toLocaleString('en-US', {minimumFractionDigits: d, maximumFractionDigits: d});
const hms = s => { s = Math.floor(s); return String(Math.floor(s / 3600)).padStart(2, '0') + ':' + String(Math.floor(s % 3600 / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };
const cache = new Map();
function img(src){ if (cache.has(src)) return cache.get(src); const im = new Image(); const pr = new Promise(r => { im.onload = () => r(im); im.onerror = () => r(null); }); im.src = src;
  const v = {pr}; cache.set(src, v); if (cache.size > 30) cache.delete(cache.keys().next().value); return v; }
const sec = t => P.sections.find(s => t >= s.t0 && t < s.t1) || P.sections[P.sections.length - 1];
function etAt(t){ const s = sec(t); if (s.kind === 'play') return s.et0 + (t - s.t0) * s.speed; if (s.kind === 'pause') return s.et;
  const pl = P.sections.filter(x => x.kind === 'play'); return pl[pl.length - 1].et1; }
function frameFor(t){ const s = sec(t);
  if (s.kind === 'play'){ const i = clamp(Math.floor((t - s.t0) * 60), 0, s.n - 1); return P.frames + '/' + s.id + '_' + String(i + 1).padStart(5, '0') + '.jpg'; }
  if (s.kind === 'pause') return P.frames + '/' + s.id + '.jpg';
  const pl = P.sections.filter(x => x.kind === 'play'), last = pl[pl.length - 1]; return P.frames + '/' + last.id + '_' + String(last.n).padStart(5, '0') + '.jpg'; }
function camAt(t){ const s = sec(t); if (!s.camA) return FULL;
  const k = s.kind === 'pause' ? eio(clamp((t - s.t0) / 0.5, 0, 1)) : eio(clamp((t - s.t0) / Math.max(0.01, s.t1 - s.t0), 0, 1));
  return s.camA.map((v, j) => mix(v, s.camB[j], k)); }
function setupCams(){ let cur = FULL; for (const s of P.sections){ s.camA = cur; s.camB = s.zoom || s.cam || (s.kind === 'end' ? cur : FULL); cur = s.camB; } }
// value chips on the wall while the video runs (no pause): real values read off the terminal label
function chips(t, cam){ if (t >= E.logo0 || !P.chips) return; const et = etAt(t), s = sec(t); if (s.kind === 'pause') return;
  for (const c of P.chips){ if (et < c.et0 || et >= c.et1) continue; const k = (c.fin === false ? 1 : eo(clamp((et - c.et0) / Math.max(1, s.speed || 1) / 0.25, 0, 1))) * (c.fout === false ? 1 : 1 - eo(clamp((et - (c.et1 - 0.3 * (s.speed || 1))) / Math.max(1, (s.speed || 1) * 0.3), 0, 1)));
    const w = lookup(P.wall, et), [, ys] = toS(0, w[1], cam); H.save(); H.globalAlpha = k; H.font = '700 26px VWMono'; H.letterSpacing = '2px';
    const tw = Math.max(H.measureText(c.title).width, c.sub ? (H.font = '600 20px VWMono', H.measureText(c.sub).width) : 0) + 40, bh = c.sub ? 82 : 52;
    const bx = Math.min(toS(1360, 0, cam)[0], PANEL.x + PANEL.w - tw - 24), by = ys - bh - 18;
    H.strokeStyle = 'rgba(255,110,118,0.85)'; H.lineWidth = 2.5; H.shadowColor = RED; H.shadowBlur = 14; H.beginPath(); H.moveTo(PANEL.x, ys); H.lineTo(PANEL.x + PANEL.w, ys); H.stroke(); H.shadowBlur = 0;
    H.fillStyle = 'rgba(8,10,16,0.92)'; rr(bx, by, tw, bh, 10); H.fill(); H.strokeStyle = 'rgba(255,90,99,0.7)'; H.lineWidth = 1.5; H.stroke(); H.beginPath(); H.moveTo(bx + 30, by + bh); H.lineTo(bx + 30, ys); H.stroke();
    H.textBaseline = 'alphabetic'; H.font = '700 26px VWMono'; H.fillStyle = INK; H.fillText(c.title, bx + 20, by + 36); if (c.sub){ H.font = '600 20px VWMono'; H.fillStyle = RED; H.fillText(c.sub, bx + 20, by + 66); }
    H.restore(); } }

// ---- live layers of the terminal (Power, 29 Oct 2026): block prints entering and key levels forming, marked while the video runs ----
const WHITE_C = '#F2F4F8';
function tagBox(x, y, title, sub, col, a, alignRight){ H.save(); H.globalAlpha = a; H.textBaseline = 'alphabetic';
  H.font = '700 17px VWMono'; H.letterSpacing = '3px'; const w1 = H.measureText(title).width; H.font = '700 28px VWMono'; H.letterSpacing = '2px'; const w2 = sub ? H.measureText(sub).width : 0;
  const tw = Math.max(w1, w2) + 36, bh = sub ? 78 : 44; let bx = alignRight ? x - tw : x; bx = Math.max(PANEL.x + 16, Math.min(bx, PANEL.x + PANEL.w - tw - 16)); const by = Math.max(PANEL.y + 110, Math.min(y, PANEL.y + PANEL.h - bh - 16));
  H.fillStyle = 'rgba(6,9,15,0.93)'; rr(bx, by, tw, bh, 10); H.fill(); H.strokeStyle = col; H.globalAlpha = a * 0.75; H.lineWidth = 1.5; H.stroke(); H.globalAlpha = a;
  H.font = '700 17px VWMono'; H.letterSpacing = '3px'; H.fillStyle = INK2; H.fillText(title, bx + 18, by + 28);
  if (sub){ H.font = '700 28px VWMono'; H.letterSpacing = '2px'; H.fillStyle = col; H.fillText(sub, bx + 18, by + 62); }
  H.restore(); return {bx, by, tw, bh}; }
function pillRing(box, cam, col, a, pad){ const [x0, y0] = toS(box[0], box[1], cam), [x1, y1] = toS(box[0] + box[2], box[1] + box[3], cam); pad = pad || 8;
  H.save(); H.globalAlpha = a; H.strokeStyle = col; H.lineWidth = 3; H.shadowColor = col; H.shadowBlur = 16; rr(x0 - pad, y0 - pad, x1 - x0 + 2 * pad, y1 - y0 + 2 * pad, 9); H.stroke(); H.restore();
  return [(x0 + x1) / 2, (y0 + y1) / 2, x1 + pad, y0 - pad]; }
function lineGlow(yc, cam, col, a){ const [, ys] = toS(0, yc, cam); H.save(); H.globalAlpha = a; H.strokeStyle = col; H.lineWidth = 3; H.shadowColor = col; H.shadowBlur = 18;
  H.beginPath(); H.moveTo(PANEL.x, ys); H.lineTo(PANEL.x + PANEL.w, ys); H.stroke(); H.restore(); return ys; }
function marks(t, cam){ if (t >= E.logo0 || !P.marks) return; const s = sec(t); if (s.kind === 'pause') return; const et = etAt(t);
  for (const m of P.marks){ const u = t - m.t, dur = m.dur || 1.8; if (u < 0 || u > dur) continue;
    const a = eo(clamp(u / 0.18, 0, 1)) * (1 - eo(clamp((u - (dur - 0.35)) / 0.35, 0, 1))); const col = m.colhex || (m.color === 'gold' ? GOLD : WHITE_C);
    if (m.type === 'block'){ const dx = -0.05 * (et - m.et), box = [m.box[0] + dx, m.box[1], m.box[2], m.box[3]];
      const [cx, cy, rx, ty] = pillRing(box, cam, col, a);
      const pr = clamp(u / 0.7, 0, 1); if (pr < 1){ H.save(); H.globalAlpha = (1 - pr) * 0.9; H.strokeStyle = col; H.lineWidth = 3; H.beginPath(); H.arc(cx, cy, 18 + 90 * eo(pr), 0, Math.PI * 2); H.stroke(); H.restore(); }
      const tb = tagBox(rx + 70, ty - 96, m.title, m.sub, col, a, false);
      H.save(); H.globalAlpha = a * 0.8; H.strokeStyle = col; H.lineWidth = 1.5; H.beginPath(); H.moveTo(rx, ty + 4); H.lineTo(tb.bx, tb.by + tb.bh / 2); H.stroke(); H.restore(); }
    if (m.type === 'level' || m.type === 'wall'){ const ys = lineGlow(m.y, cam, col, a * 0.9); const xs = toS(m.x || 1390, 0, cam)[0];
      tagBox(xs, m.below ? ys + 16 : ys - (m.sub ? 78 : 44) - 14, m.title, m.sub, col, a, false); } } }
const lookup = (arr, et) => { let lo = 0, hi = arr.length - 1; if (et <= arr[0][0]) return arr[0]; if (et >= arr[hi][0]) return arr[hi];
  while (hi - lo > 1){ const m = (lo + hi) >> 1; if (arr[m][0] <= et) lo = m; else hi = m; } return arr[lo]; };
const toS = (xc, yc, cam) => [PANEL.x + (xc - cam[0]) / (cam[2] - cam[0]) * PANEL.w, PANEL.y + (yc - cam[1]) / (cam[3] - cam[1]) * PANEL.h];
function rr(x, y, w, h, r){ H.beginPath(); H.moveTo(x + r, y); H.arcTo(x + w, y, x + w, y + h, r); H.arcTo(x + w, y + h, x, y + h, r); H.arcTo(x, y + h, x, y, r); H.arcTo(x, y, x + w, y, r); H.closePath(); }

async function drawPanel(t){
  const cam = camAt(t), im = await img(frameFor(t)).pr;
  H.save(); rr(PANEL.x, PANEL.y, PANEL.w, PANEL.h, 14); H.clip(); H.fillStyle = '#000'; H.fillRect(PANEL.x, PANEL.y, PANEL.w, PANEL.h);
  if (im){ H.imageSmoothingEnabled = true; H.imageSmoothingQuality = 'high'; H.drawImage(im, cam[0] * 2, cam[1] * 2, (cam[2] - cam[0]) * 2, (cam[3] - cam[1]) * 2, PANEL.x, PANEL.y, PANEL.w, PANEL.h); }
  const s = sec(t); if (s.kind === 'pause'){ const k = eo(clamp((t - s.t0) / 0.3, 0, 1)); H.fillStyle = `rgba(0,0,0,${0.28 * k})`; H.fillRect(PANEL.x, PANEL.y, PANEL.w, PANEL.h); }
  H.restore();
  H.save(); rr(PANEL.x + 0.5, PANEL.y + 0.5, PANEL.w - 1, PANEL.h - 1, 14); H.strokeStyle = 'rgba(255,255,255,0.08)'; H.lineWidth = 1; H.stroke(); H.restore();
  // VOLWICK wordmark top left, well visible, with the LIVE badge right next to it on the same dark plate
  H.save(); const wm = VW.assets.wm, lh = 46, lw = lh * wm.width / wm.height; H.font = '700 18px VWMono'; H.letterSpacing = '3px'; const tw = H.measureText(P.texts.badge).width;
  const px = PANEL.x + 18, py = PANEL.y + 18, pw = 28 + lw + 30 + 1 + 30 + 20 + tw + 26, ph = 72;
  H.fillStyle = 'rgba(4,7,12,0.88)'; rr(px, py, pw, ph, 12); H.fill(); H.strokeStyle = 'rgba(255,255,255,0.08)'; H.lineWidth = 1; H.stroke();
  H.globalCompositeOperation = 'lighter'; H.drawImage(wm, px + 28, py + (ph - lh) / 2, lw, lh); H.globalAlpha = 0.35; H.drawImage(wm, px + 28, py + (ph - lh) / 2, lw, lh); H.globalAlpha = 1; H.globalCompositeOperation = 'source-over';
  const sx = px + 28 + lw + 30; H.fillStyle = 'rgba(255,255,255,0.14)'; H.fillRect(sx, py + 18, 1, ph - 36);
  H.fillStyle = `rgba(255,77,94,${0.6 + 0.4 * Math.sin(t * 4.5)})`; H.beginPath(); H.arc(sx + 30, py + ph / 2, 7, 0, Math.PI * 2); H.fill();
  H.fillStyle = INK; H.textBaseline = 'middle'; H.fillText(P.texts.badge, sx + 48, py + ph / 2 + 1); H.restore();
  return cam; }

function callouts(t, cam){
  const s = sec(t); if (s.kind !== 'pause') return; const et = s.et, w = lookup(P.wall, et), price = lookup(P.samples, et)[1];
  const yW = w[1], yP = w[1] + (w[2] - price) * P.ppt, xP = P.price_x; const z = !!s.zoom;
  const [, ysW] = toS(0, yW, cam), [xsP, ysP] = toS(xP, yP, cam);
  s.callouts.forEach((c, i) => { const k = eo(clamp((t - s.t0 - 0.35 - i * 0.55) / 0.35, 0, 1)); if (k <= 0) return; H.save(); H.globalAlpha = k;
    if (c.type === 'wall'){ // glow on the terminal's own line, then a label box above it, in the empty space right of price
      H.strokeStyle = 'rgba(255,110,118,0.9)'; H.lineWidth = 3; H.shadowColor = RED; H.shadowBlur = 18; H.beginPath(); H.moveTo(PANEL.x, ysW); H.lineTo(PANEL.x + PANEL.w, ysW); H.stroke(); H.shadowBlur = 0;
      H.font = '700 26px VWMono'; H.letterSpacing = '2px'; const tw = Math.max(H.measureText(c.title).width, c.sub ? (H.font = '600 20px VWMono', H.measureText(c.sub).width) : 0) + 40;
      const bx = Math.min(z ? PANEL.x + PANEL.w - tw - 60 : toS(1360, 0, cam)[0], PANEL.x + PANEL.w - tw - 24), bh = c.sub ? 82 : 52, by = ysW - bh - 18;
      H.fillStyle = 'rgba(8,10,16,0.92)'; rr(bx, by, tw, bh, 10); H.fill(); H.strokeStyle = 'rgba(255,90,99,0.7)'; H.lineWidth = 1.5; H.stroke();
      H.beginPath(); H.moveTo(bx + 30, by + bh); H.lineTo(bx + 30, ysW); H.stroke();
      H.textBaseline = 'alphabetic'; H.font = '700 26px VWMono'; H.fillStyle = INK; H.fillText(c.title, bx + 20, by + 36);
      if (c.sub){ H.font = '600 20px VWMono'; H.fillStyle = RED; H.fillText(c.sub, bx + 20, by + 66); } }
    if (c.type === 'price'){ H.strokeStyle = GOLD; H.lineWidth = 3; H.beginPath(); H.arc(xsP, ysP, z ? 22 : 15, 0, Math.PI * 2); H.stroke();
      H.font = '700 24px VWMono'; H.letterSpacing = '2px'; const tw = H.measureText(c.label).width + 28; const bx = xsP - tw - 34, by = ysP - 21;
      H.fillStyle = 'rgba(8,10,16,0.92)'; rr(bx, by, tw, 42, 8); H.fill(); H.strokeStyle = 'rgba(242,193,78,0.7)'; H.lineWidth = 1.5; H.stroke();
      H.fillStyle = GOLD; H.textBaseline = 'middle'; H.fillText(c.label, bx + 14, by + 22); }
    if (c.type === 'gap'){ const xb = xsP + (z ? 60 : 34); H.strokeStyle = GOLD; H.lineWidth = 3; H.beginPath(); H.moveTo(xb - 12, ysW); H.lineTo(xb, ysW); H.lineTo(xb, ysP); H.lineTo(xb - 12, ysP); H.stroke();
      H.font = '700 28px VWMono'; H.letterSpacing = '2px'; const tw = H.measureText(c.label).width + 28, by = (ysW + ysP) / 2 - 22;
      H.fillStyle = 'rgba(8,10,16,0.92)'; rr(xb + 14, by, tw, 44, 8); H.fill(); H.fillStyle = GOLD; H.textBaseline = 'middle'; H.fillText(c.label, xb + 28, by + 23); }
    if (c.type === 'levelglow'){ lineGlow(c.y, cam, c.color === 'gold' ? GOLD : WHITE_C, k); if (c.box) pillRing(c.box, cam, WHITE_C, k, 6); }
    if (c.type === 'pill'){ const col = c.color === 'gold' ? GOLD : WHITE_C, r = pillRing(c.box, cam, col, k, 7);
      if (c.title){ const tb = tagBox(c.side === 'left' ? r[0] - 40 : r[2] + 40, r[3] - (c.up || 100), c.title, c.sub, col, k, c.side === 'left');
        H.save(); H.strokeStyle = col; H.globalAlpha = 0.8 * k; H.lineWidth = 1.5; H.beginPath(); H.moveTo(c.side === 'left' ? r[0] : r[2], r[3] + 4); H.lineTo(c.side === 'left' ? tb.bx + tb.tw : tb.bx, tb.by + tb.bh / 2); H.stroke(); H.restore(); } }
    if (c.type === 'tag'){ const [xs, ys] = toS(c.x, c.y, cam); tagBox(xs, ys, c.title, c.sub, c.color === 'gold' ? GOLD : WHITE_C, k, !!c.right); }
    H.restore(); });
}

function wrap(text, maxW){ const words = text.split(' '), lines = []; let cur = '';
  for (const w of words){ const tr = cur ? cur + ' ' + w : w; if (H.measureText(tr).width > maxW && cur){ lines.push(cur); cur = w; } else cur = tr; } if (cur) lines.push(cur); return lines; }
function bottomBar(t){
  if (t >= E.logo0) return; const s = sec(t), y0 = PANEL.y + PANEL.h, et = etAt(t);
  H.save(); H.textBaseline = 'middle';
  H.font = '600 30px VWMono'; H.letterSpacing = '2px'; H.fillStyle = INK; H.textAlign = 'left'; H.fillText(hms(et) + ' ET', 48, y0 + 44);
  H.font = '700 20px VWMono'; H.letterSpacing = '3px';
  if (s.kind === 'pause'){ H.fillStyle = GOLD; H.fillText('❚❚ PAUSED', 48, y0 + 84); }
  else if (s.speed <= 1.01){ H.fillStyle = RED; H.fillText('● LIVE · REAL TIME ×1', 48, y0 + 84); }
  else { H.fillStyle = INK2; H.fillText('▶▶ SPEED ×' + Math.round(s.speed), 48, y0 + 84); }
  if (s.say){ const a = eo(clamp((t - s.t0) / 0.3, 0, 1)) * (1 - eo(clamp((t - (s.t1 - 0.2)) / 0.2, 0, 1)));
    let say = s.say; if (say.includes('{d}')){ const p = lookup(P.samples, et)[1], lv = lookup(P.wall, et)[2]; say = say.replace('{d}', fmt(Math.max(0, lv - p))); }
    H.globalAlpha = a; H.font = '600 31px VWSans'; H.letterSpacing = '0px'; H.textAlign = 'center'; H.fillStyle = INK;
    const lines = wrap(say, 1180); lines.forEach((ln, i) => H.fillText(ln, 1000, y0 + 64 + (i - (lines.length - 1) / 2) * 40)); H.globalAlpha = 1; }
  H.restore(); }

// ending: the engine's vertical logo animation, drawn on its own canvas and placed in the centre
function ending(t){
  if (t < E.logo0) return; const e = (t - E.logo0) * 1.8, g = VW.g;
  g.clearRect(0, 0, 1080, 1920); g.fillStyle = 'rgba(0,0,0,0)';
  const pts = []; for (let i = 0; i <= 50; i++){ const u = i / 50; pts.push([140 + u * 800, 900 - 260 * Math.pow(u, 1.4) + 30 * Math.sin(u * 9)]); }
  const W0 = VW.W, H0 = VW.H; VW.W = 0; VW.H = 0; VW.logoForm(e, pts, {noUrl: true, tagline: [['TRADE', COL.ink], ['WITH', COL.ink], ['INSTITUTIONAL', COL.blue], ['CONTEXT.', COL.ink]]}); VW.W = W0; VW.H = H0;   // full-frame fills of the engine are done on the main canvas instead
  const k = eo(clamp((e - 3.25) / 0.5, 0, 1)); if (k > 0){ g.save(); g.globalAlpha = k; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '700 40px VWMono'; g.letterSpacing = '5px';
    g.fillStyle = COL.blue; g.fillText('DISCOVER VOLWICK →', 543, 1395); g.restore(); }
  const dk = eio(clamp(e / 0.9, 0, 1)); H.fillStyle = `rgba(3,6,12,${dk})`; H.fillRect(0, 0, 1920, 1080);
  const fl = Math.exp(-Math.pow((e - 1.5) / 0.12, 2));
  const sc = 1080 / 1920 * 1.12, w = 1080 * sc, hh = 1920 * sc; H.save(); H.globalCompositeOperation = 'lighter'; H.drawImage(VW.cv, 0, 360, 1080, 1260, (1920 - w) / 2, 540 - (1260 * sc) / 2 - 20, w, 1260 * sc); H.restore();
  if (fl > 0.01){ H.fillStyle = `rgba(190,210,255,${0.22 * fl})`; H.fillRect(0, 0, 1920, 1080); }
  if (k > 0){ H.save(); H.globalAlpha = k; H.textAlign = 'center'; H.textBaseline = 'middle'; H.font = '500 20px VWMono'; H.letterSpacing = '2px'; H.fillStyle = INK3; H.fillText(P.texts.disclaimer, 960, 540 - (1260 * sc) / 2 - 20 + (1480 - 360) * sc); H.restore(); }
}

async function render(t){
  if (t >= E.loop0) t = E.loop0 - 0.001;
  H.fillStyle = BG; H.fillRect(0, 0, 1920, 1080);
  const cam = await drawPanel(t); chips(t, cam); marks(t, cam); callouts(t, cam); bottomBar(t); ending(t); return true; }

(async () => {
  P = await (await fetch(new URLSearchParams(location.search).get('p'))).json();
  VW.assets.wm = await VW.loadImage('/08_AUTOMATION/brand/assets/wm_crop.png'); VW.assets.mono = await VW.loadImage('/08_AUTOMATION/brand/assets/mono.png');
  await VW.loadFonts(); E = P.events; setupCams();
  window.render = render; window.READY = {total: E.total};
})();
