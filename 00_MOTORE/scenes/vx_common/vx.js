// ============================================================
// VOLWICK VX engine · shared layer (30 Oct 2026)
// A second visual language next to the Content Engine: same brand ending, same safe zones,
// new looks (3D terrain, x-ray scan, pure typography). Every frame is a pure function of time.
// ============================================================
const VX = {};
VX.BLUE = '#2F6BFF'; VX.LBLUE = '#8AB6FF'; VX.GOLD = '#F2C14E'; VX.AMBER = '#F59228'; VX.RED = '#F0506E'; VX.GREEN = '#26C08A'; VX.CYAN = '#22D3EE';
VX.NAVY = '#040913'; VX.INK = '#F2F5FA';

VX.load = async name => {
  const d = `../../vx/out_${name}`;
  VX.WORDS = await (await fetch(d + '/words.json')).json();
  const c = await (await fetch(d + '/cues.json')).json(); VX.C = c.cues; VX.TOTAL = c.total;
  // sentences = groups of words between terminal punctuation, aligned with cues s0..sN
  VX.SENT = []; let cur = [];
  for (const w of VX.WORDS) { cur.push(w); if (/[.?!]$/.test(w[0])) { VX.SENT.push(cur); cur = []; } }
  await VW.loadFonts(); await VW.loadBrand();
};

// statement captions: the spoken sentence, word by word, centred; keys in colour. Exactly the spoken text.
VX.statement = (t, k, opt = {}) => {
  const s = VX.SENT[k]; if (!s) return; const g = VW.g, eo = VW.eo, lin = VW.lin;
  const t0 = k === 0 ? -1 : s[0][1] - 0.12, t1 = (VX.SENT[k + 1] ? VX.SENT[k + 1][0][1] - 0.18 : (VX.C.logo0 ? VX.C.logo0 + 0.1 : s[s.length - 1][2] + (opt.hold || 0.8)));
  const out = opt.keep ? 1 : 1 - VW.seg(t, t1 - 0.12, t1 + 0.08);
  const a = eo(lin(t, t0, t0 + 0.18)) * out; if (a <= 0) return;
  const size = opt.size || 66, y = opt.y || 450, keys = opt.keys || {}, font = opt.font || 'VWSans', col0 = opt.col || VX.INK, dim = opt.dim || 'rgba(242,245,250,0.28)';
  g.save(); g.globalAlpha = a; g.textBaseline = 'alphabetic'; g.font = `700 ${size}px ${font}`; g.letterSpacing = (opt.track || 0) + 'px';
  const words = s.map(w => opt.upper ? w[0].toUpperCase() : w[0]);
  // wrap into lines that fit the safe width
  const maxW = opt.maxW || 860, lines = [[]]; let lw = 0; const sp = g.measureText(' ').width;
  words.forEach((w, i) => { const ww = g.measureText(w).width; if (lines[lines.length - 1].length && lw + sp + ww > maxW) { lines.push([]); lw = 0; } lines[lines.length - 1].push(i); lw += (lw ? sp : 0) + ww; });
  const lh = size * 1.12, y0 = y - (lines.length - 1) * lh / 2;
  if (opt.box) { let mw = 0; lines.forEach(ln => { const tw = ln.reduce((p, i) => p + g.measureText(words[i]).width, 0) + sp * (ln.length - 1); mw = Math.max(mw, tw); });
    g.fillStyle = typeof opt.box === 'string' ? opt.box : 'rgba(0,0,0,0.62)'; VW.roundRect(540 - mw / 2 - 28, y0 - size * 0.95, mw + 56, lh * (lines.length - 1) + size * 1.35, 16); g.fill(); }
  if (opt.shadow !== false) { g.shadowColor = 'rgba(0,0,0,0.9)'; g.shadowBlur = 26; }
  lines.forEach((ln, li) => {
    const tw = ln.reduce((p, i) => p + g.measureText(words[i]).width, 0) + sp * (ln.length - 1);
    let x = (opt.align === 'left' ? (opt.x || 110) : 540 - tw / 2);
    ln.forEach(i => { const w = s[i], on = (k === 0 && opt.firstLit !== false) || t >= w[1] - 0.04, kc = keys[w[0].replace(/[.,!?]$/, '').toLowerCase()];
      g.fillStyle = on ? (kc || col0) : dim; if (on && kc) { g.save(); g.shadowColor = VW.rgba(kc, 0.7); g.shadowBlur = 22; g.fillText(words[i], x, y0 + li * lh); g.restore(); } else g.fillText(words[i], x, y0 + li * lh);
      x += g.measureText(words[i]).width + sp; });
  });
  g.restore();
};

// brand ending = the APPROVED Volwick ending (Absorption V2, confirmed by Power 30 Oct 2026, reference 12_MOTORE_STATICO/FINALE_APPROVATO.png):
// price line folds into the V, wordmark, TRADE WITH INSTITUTIONAL CONTEXT. typed in mono with the blue cursor, DISCOVER VOLWICK →,
// one disclaimer line. Nothing else on the ending (no offer, no price: the offer goes in the caption).
// opt.t0 / opt.dv / opt.loop0 / opt.total override the voice cues for videos without voice.
VX.end = (t, pts, opt = {}) => {
  const C = VX.C || {}, seg = VW.seg, eo = VW.eo, lin = VW.lin, g = VW.g, LSP = 1.7;
  const t0 = opt.t0 ?? C.logo0, loop0 = opt.loop0 ?? C.loop0 ?? 1e9, total = opt.total ?? VX.TOTAL ?? 1e9; if (t <= t0) return;
  const out = 1 - seg(t, loop0, total - 0.12);
  VW.logoForm((t - t0) * LSP, pts, { fadeOut: 1 - out, noUrl: true, dy: -20, tagY: 1318, tagSize: 32, tagSpacing: 5,
    tagline: [['TRADE', VW.COL.ink], ['WITH', VW.COL.ink], ['INSTITUTIONAL', VW.COL.blue], ['CONTEXT.', VW.COL.ink]] });
  const dv = opt.dv ?? (C.dvv ? C.dvv[0] - 0.08 : t0 + 3.45 / LSP), k = eo(lin(t, dv, dv + 0.3)) * out;
  if (k > 0) { g.save(); g.globalAlpha = k; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '700 44px VWMono'; g.letterSpacing = '5px';
    g.fillStyle = VW.COL.blue; g.shadowColor = 'rgba(90,140,255,0.8)'; g.shadowBlur = 20; g.fillText('DISCOVER VOLWICK →', 543, 1410 + (1 - k) * 10); g.restore(); }
  const kd = eo(lin(t, dv + 0.3, dv + 0.7)) * out;
  if (kd > 0) { g.save(); g.globalAlpha = kd; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '600 29px VWMono'; g.fillStyle = VW.COL.ink2;
    g.fillText('Simulated data. Not investment advice.', 540, 1496); g.restore(); }
};

VX.ready = (render, events) => { window.render = render; render(0); return { total: VX.TOTAL, events }; };

// official wordmark on light backgrounds: the real logo on a navy pill (never a recoloured logo)
VX.logoLight = (a = 1, ticker = 'ES', h = 52) => {
  if (a <= 0) return; const g = VW.g, wm = VW.assets.wm, w = h * wm.width / wm.height, x = VW.SAFE.x0, y = VW.SAFE.y0 + 4 + (46 - h) / 2;
  g.save(); g.globalAlpha = a; g.fillStyle = '#040913'; g.shadowColor = 'rgba(4,9,19,0.35)'; g.shadowBlur = 18; VW.roundRect(x - 10, y - 10, w + 26, h + 20, 12); g.fill(); g.shadowBlur = 0;
  g.globalCompositeOperation = 'lighter'; g.drawImage(wm, x, y, w, h); g.globalAlpha = 0.45 * a; g.drawImage(wm, x, y, w, h); g.restore();
  if (ticker) { g.save(); g.globalAlpha = a; g.font = '700 30px VWMono'; g.fillStyle = '#131722'; g.textAlign = 'right'; g.textBaseline = 'middle'; g.fillText(ticker, VW.SAFE.x1, y + h / 2); g.restore(); }
};
// mouse cursor (screen-recording look)
VX.cursor = (x, y, a = 1, light = true, press = 0) => {
  if (a <= 0) return; const g = VW.g; g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(1.6, 1.6);
  if (press > 0) { g.fillStyle = `rgba(47,107,255,${0.35 * press})`; g.beginPath(); g.arc(0, 0, 16 * press + 6, 0, Math.PI * 2); g.fill(); }
  g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 22); g.lineTo(6, 17); g.lineTo(10, 26); g.lineTo(14, 24); g.lineTo(10, 15); g.lineTo(17, 15); g.closePath();
  g.fillStyle = light ? '#111' : '#FFF'; g.strokeStyle = light ? '#FFF' : '#000'; g.lineWidth = 1.6; g.fill(); g.stroke(); g.restore();
};
