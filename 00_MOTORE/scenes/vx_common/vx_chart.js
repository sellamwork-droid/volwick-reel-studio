// ============================================================
// VX chart: candles + Volwick layers drawn like the real terminal (ES screenshot 27 Oct 2026):
// glowing walls fading to the left with "price · $" label on the right, white block-print bars,
// white / gold quantity pills, starred key level. Two themes: 'light' (generic retail chart) and 'dark' (Volwick).
// ============================================================
VX.THEME = {
  light: { bg: '#FFFFFF', grid: 'rgba(30,40,60,0.06)', up: '#22AB94', dn: '#F23645', wick: null, axis: '#6A7385', axisBg: '#FFFFFF' },
  dark:  { bg: '#000000', grid: 'rgba(255,255,255,0.045)', up: '#2FB67C', dn: '#E2575F', wick: null, axis: '#8A93A3', axisBg: '#000000' },
};
VX.WALL = { callL: '#26C08A', putL: '#F0506E', callS: '#22D3EE', putS: '#E055D8' };
VX.fmtP = p => p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// deterministic OHLC path from a list of [index, price] anchors with seeded noise
VX.series = (anchors, n, seed = 7, vol = 0.9) => {
  const r = VW.rng(seed), out = []; let prev = anchors[0][1];
  const at = i => { for (let k = 0; k < anchors.length - 1; k++) { const [a, pa] = anchors[k], [b, pb] = anchors[k + 1]; if (i >= a && i <= b) { const u = (i - a) / (b - a); return pa + (pb - pa) * (0.5 - 0.5 * Math.cos(Math.PI * u)); } } return anchors[anchors.length - 1][1]; };
  for (let i = 0; i < n; i++) {
    const target = at(i) + (r() - 0.5) * vol * 0.8, o = prev, c = Math.round(target * 4) / 4;
    const h = Math.max(o, c) + Math.round(r() * vol * 2) / 4 + 0.25, l = Math.min(o, c) - Math.round(r() * vol * 2) / 4 - 0.25;
    out.push({ o, h, l, c }); prev = c;
  }
  return out;
};

// view: {x0,x1,y0,y1,pmin,pmax,n} ; returns mappers
VX.view = v => ({ ...v, X: i => v.x0 + (i + 0.5) * (v.x1 - v.x0) / v.n, Y: p => v.y1 - (p - v.pmin) / (v.pmax - v.pmin) * (v.y1 - v.y0), bw: (v.x1 - v.x0) / v.n });

VX.drawGrid = (V, th, opt = {}) => {
  const g = VW.g, T = VX.THEME[th]; g.save();
  if (opt.bg !== false) { g.fillStyle = T.bg; g.fillRect(opt.bx0 ?? V.x0 - 40, opt.by0 ?? V.y0 - 40, (opt.bx1 ?? V.x1 + 160) - (opt.bx0 ?? V.x0 - 40), (opt.by1 ?? V.y1 + 60) - (opt.by0 ?? V.y0 - 40)); }
  g.strokeStyle = T.grid; g.lineWidth = 1;
  for (let i = 0; i <= V.n; i += (opt.vstep || 6)) { const x = V.x0 + i * (V.x1 - V.x0) / V.n; g.beginPath(); g.moveTo(x, V.y0 - 30); g.lineTo(x, V.y1 + 30); g.stroke(); }
  if (th === 'light') { const st = opt.step || 5; for (let p = Math.ceil(V.pmin / st) * st; p <= V.pmax; p += st) { const y = V.Y(p); g.beginPath(); g.moveTo(V.x0, y); g.lineTo(V.x1, y); g.stroke(); } }
  // price axis
  const st = opt.step || 5; g.font = '600 22px VWMono'; g.fillStyle = T.axis; g.textAlign = 'left'; g.textBaseline = 'middle';
  if (opt.axis !== false) for (let p = Math.ceil(V.pmin / st) * st; p <= V.pmax; p += st) g.fillText(VX.fmtP(p), V.x1 + 14, V.Y(p));
  g.restore();
};

VX.drawCandles = (V, data, upto, th, opt = {}) => {
  const g = VW.g, T = VX.THEME[th], w = Math.max(2, V.bw * (opt.body || 0.72)); g.save();
  const n = Math.min(data.length, Math.floor(upto)), frac = upto - Math.floor(upto);
  for (let i = 0; i < n + (frac > 0 && n < data.length ? 1 : 0); i++) {
    let d = data[i]; if (i === n) { const c = d.o + (d.c - d.o) * frac; d = { o: d.o, c, h: Math.max(d.o, c, d.o + (d.h - d.o) * frac), l: Math.min(d.o, c, d.o + (d.l - d.o) * frac) }; }
    const x = V.X(i), col = d.c >= d.o ? T.up : T.dn; g.strokeStyle = col; g.fillStyle = col; g.lineWidth = Math.max(2, V.bw * 0.16);
    g.beginPath(); g.moveTo(x, V.Y(d.h)); g.lineTo(x, V.Y(d.l)); g.stroke();
    const y0 = V.Y(Math.max(d.o, d.c)), y1 = V.Y(Math.min(d.o, d.c)); g.fillRect(x - w / 2, y0, w, Math.max(2, y1 - y0));
  }
  g.restore();
};

// last price tag on the axis
VX.priceTag = (V, p, th, a = 1) => { if (a <= 0) return; const g = VW.g; g.save(); g.globalAlpha = a; const y = V.Y(p);
  g.fillStyle = th === 'dark' ? VW.COL.gold : '#2962FF'; VW.roundRect(V.x1 + 6, y - 17, 132, 34, 5); g.fill();
  g.fillStyle = th === 'dark' ? '#120E02' : '#FFFFFF'; g.font = '700 22px VWMono'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(VX.fmtP(p), V.x1 + 72, y + 1); g.restore(); };

// dealer wall like the terminal: glow that fades to the left, dot + label on the right
VX.wall = (V, w, a = 1, opt = {}) => {
  if (a <= 0) return; const g = VW.g, col = VX.WALL[w.fam], y = V.Y(w.p), k = opt.grow ?? 1; g.save(); g.globalAlpha = a;
  const xr = opt.xr ?? V.x1, xl = VW.mix(xr, V.x0, k), gr = g.createLinearGradient(xl, 0, xr, 0); gr.addColorStop(0, VW.rgba(col, 0)); gr.addColorStop(0.55, VW.rgba(col, 0.55)); gr.addColorStop(1, VW.rgba(col, 1));
  const lw = (opt.lw || 3) * (w.star ? 1.6 : 1);
  g.shadowColor = VW.rgba(col, 0.9); g.shadowBlur = (opt.glow ?? 14) * (w.star ? 1.6 : 1); g.strokeStyle = gr; g.lineWidth = lw; g.beginPath(); g.moveTo(xl, y); g.lineTo(xr, y); g.stroke();
  g.shadowBlur = 10; g.fillStyle = col; g.beginPath(); g.arc(xr + 4, y, 6, 0, Math.PI * 2); g.fill(); g.shadowBlur = 0;
  if (opt.label !== false) { g.font = `700 ${opt.fs || 21}px VWMono`; g.textBaseline = 'middle'; g.fillStyle = col; g.shadowColor = 'rgba(0,0,0,0.9)'; g.shadowBlur = 8;
    const txt = (w.star ? '★ ' : '') + VX.fmtP(w.p) + ' · ' + w.usd;
    if (opt.above) { const fs = opt.fs || 21; g.textAlign = 'right'; g.font = `700 ${fs}px VWMono`; g.fillText((w.star ? '★ ' : '') + VX.fmtP(w.p), xr - 8, y - fs * 0.9); g.font = `700 ${Math.round(fs * 0.92)}px VWMono`; g.fillText(w.usd, xr - 8, y + fs * 0.95); } else { g.textAlign = 'left'; g.fillText(txt, xr + 16, y); } }
  g.restore();
};

// block print: white bar across the candle + quantity pill (white, or gold with diamond for mega)
VX.print = (V, pr, a = 1, opt = {}) => {
  if (a <= 0) return; const g = VW.g, x = V.X(pr.i), y = V.Y(pr.p), s = opt.scale || 1; g.save(); g.globalAlpha = a;
  g.fillStyle = '#FFFFFF'; g.shadowColor = 'rgba(255,255,255,0.7)'; g.shadowBlur = 8; g.fillRect(x - V.bw * 1.6, y - 3, V.bw * 3.2, 6); g.shadowBlur = 0;
  if (pr.q) { const gold = pr.gold, txt = String(pr.q) + (pr.x ? ' ×' + pr.x : ''); g.font = `700 ${Math.round(22 * s)}px VWMono`; const tw = g.measureText(txt).width + 22 * s, hh = 34 * s;
    const px = x + (pr.side === 'l' ? -V.bw * 2 - tw - 14 * s : V.bw * 2 + 14 * s);
    if (gold) { g.fillStyle = VW.COL.gold; g.save(); g.translate(x + (pr.side === 'l' ? -V.bw * 2 - 6 : V.bw * 2 + 6), y); g.rotate(Math.PI / 4); g.fillRect(-5 * s, -5 * s, 10 * s, 10 * s); g.restore(); }
    g.fillStyle = gold ? VW.COL.gold : '#E9EDF3'; if (gold) { g.shadowColor = 'rgba(242,193,78,0.7)'; g.shadowBlur = 16 * s; }
    VW.roundRect(px, y - hh / 2, tw, hh, 6 * s); g.fill(); g.shadowBlur = 0; g.fillStyle = gold ? '#1A1300' : '#0B1220'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, px + tw / 2, y + 1); }
  g.restore();
};

// starred key level (white dotted line + left tag "★ 7754.25 1,091 · 4 blocks")
VX.keyLevel = (V, kl, a = 1) => {
  if (a <= 0) return; const g = VW.g, y = V.Y(kl.p); g.save(); g.globalAlpha = a; g.strokeStyle = 'rgba(255,255,255,0.75)'; g.setLineDash([4, 5]); g.lineWidth = 2;
  g.beginPath(); g.moveTo(V.x0, y); g.lineTo(V.x1, y); g.stroke(); g.setLineDash([]);
  const txt = `★ ${kl.p.toFixed(2)}  ${kl.q} · ${kl.b} blocks`; g.font = '700 21px VWMono'; const tw = g.measureText(txt).width + 26;
  g.fillStyle = 'rgba(20,24,32,0.95)'; g.strokeStyle = 'rgba(255,255,255,0.8)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(V.x0, y - 17); g.lineTo(V.x0 + tw, y - 17); g.lineTo(V.x0 + tw + 12, y); g.lineTo(V.x0 + tw, y + 17); g.lineTo(V.x0, y + 17); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = '#FFFFFF'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(txt, V.x0 + 12, y + 1); g.restore();
};

// tag pill used to name a layer on screen ("PUT WALL · SHORT γ")
VX.tag = (txt, x, y, col, a = 1, opt = {}) => {
  if (a <= 0) return; const g = VW.g, s = opt.size || 26; g.save(); g.globalAlpha = a; g.font = `700 ${s}px VWMono`; g.letterSpacing = '2px';
  const tw = g.measureText(txt).width + s * 1.2, h = s * 1.7, x0 = opt.align === 'right' ? x - tw : opt.align === 'center' ? x - tw / 2 : x;
  g.fillStyle = opt.fill || 'rgba(4,9,19,0.88)'; g.strokeStyle = col; g.lineWidth = 2; g.shadowColor = VW.rgba(col, 0.6); g.shadowBlur = 18;
  VW.roundRect(x0, y - h / 2, tw, h, 8); g.fill(); g.stroke(); g.shadowBlur = 0; g.fillStyle = opt.text || col; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(txt, x0 + s * 0.6, y + 1); g.restore();
};

// hand-drawn style annotations (white ring and arrow, like screen-recorded tutorials)
VX.ring = (x, y, r, k, col = '#FFFFFF', lw = 9) => { if (k <= 0) return; const g = VW.g; g.save(); g.strokeStyle = col; g.lineWidth = lw; g.lineCap = 'round'; g.shadowColor = 'rgba(0,0,0,0.5)'; g.shadowBlur = 12;
  g.beginPath(); g.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * VW.eo(Math.min(1, k))); g.stroke(); g.restore(); };
VX.arrow = (x0, y0, x1, y1, k, col = '#FFFFFF', lw = 14) => { if (k <= 0) return; const g = VW.g, e = VW.eo(Math.min(1, k)), xe = VW.mix(x0, x1, e), ye = VW.mix(y0, y1, e), an = Math.atan2(y1 - y0, x1 - x0);
  g.save(); g.strokeStyle = col; g.fillStyle = col; g.lineWidth = lw; g.lineCap = 'round'; g.shadowColor = 'rgba(0,0,0,0.5)'; g.shadowBlur = 12; g.beginPath(); g.moveTo(x0, y0); g.lineTo(xe, ye); g.stroke();
  const L = lw * 3; g.beginPath(); g.moveTo(xe + Math.cos(an) * L * 0.4, ye + Math.sin(an) * L * 0.4); g.lineTo(xe - Math.cos(an - 0.5) * L, ye - Math.sin(an - 0.5) * L); g.lineTo(xe - Math.cos(an + 0.5) * L, ye - Math.sin(an + 0.5) * L); g.closePath(); g.fill(); g.restore(); };

// Volwick top bar (logo left, ticker right) for full-screen terminal shots
VX.topBar = (a = 1, ticker = 'ES') => { if (a <= 0) return; VW.logoTL(a, ticker, 52, 30, true); };
