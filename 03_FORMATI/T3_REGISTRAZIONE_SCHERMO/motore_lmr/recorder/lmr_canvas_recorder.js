// VOLWICK · Live Market Reactions · canvas recorder (27 Oct 2026)
// Paste/run in the Volwick dashboard tab (Claude in Chrome javascript_tool). It composes every chart canvas of the
// terminal iframe into one canvas at device pixels, records it with MediaRecorder in 5-minute files aligned to the
// clock, and saves each file + a JSON log (UTC/ET/Rome times, terminal text every 5 s) to ~/Downloads.
// Lesson of 27 Oct: size and pixel ratio are re-read at the start of every file, so moving the window to another
// monitor changes the next file's resolution instead of stretching a wrong one. The page must stay visible:
// a hidden/occluded tab stops repainting (fpsLog shows it).
// Usage: run this file, then window.__LMR.schedule('14:30', '21:00', 5). Stop: window.__LMR.stop('why').
(() => {
  if (window.__LMR) { try { window.__LMR.stop('reinstall'); clearInterval(window.__LMR.sampler); clearInterval(window.__LMR.fpsTimer); window.__LMR.state = 'off'; } catch (e) {} }
  const L = window.__LMR = { log: [], segs: [], state: 'idle', frames: 0, errors: [], pending: 0, fpsLog: [] };
  const fmtRome = d => d.toLocaleString('sv-SE', {timeZone: 'Europe/Rome'}).replace(' ', 'T');
  const fmtET = d => d.toLocaleString('sv-SE', {timeZone: 'America/New_York'}).replace(' ', 'T');
  const doc = () => document.querySelector('iframe').contentDocument;
  const canv = () => [...doc().querySelectorAll('canvas')].filter(c => c.getBoundingClientRect().width > 10);
  const box = () => { const rs = canv().map(c => c.getBoundingClientRect()); const x0 = Math.min(...rs.map(r => r.x)), y0 = Math.min(...rs.map(r => r.y)), x1 = Math.max(...rs.map(r => r.x + r.width)), y1 = Math.max(...rs.map(r => r.y + r.height)); return {x: x0, y: y0, w: Math.round(x1 - x0), h: Math.round(y1 - y0)}; };
  let B, S, comp, g, stream;
  function setup(){ B = box(); S = devicePixelRatio; comp = document.createElement('canvas'); comp.width = Math.round(B.w * S); comp.height = Math.round(B.h * S); g = comp.getContext('2d'); stream = comp.captureStream(30); }
  setup();
  function draw(){ if (L.state === 'off') return; try { const cs = canv(); g.fillStyle = '#000'; g.fillRect(0, 0, comp.width, comp.height);
    for (const c of cs){ const r = c.getBoundingClientRect(); g.drawImage(c, (r.x - B.x) * S, (r.y - B.y) * S, r.width * S, r.height * S); } L.frames++; L.lastFrame = Date.now(); } catch (e) { L.errors.push(String(e)); }
    requestAnimationFrame(draw); }
  requestAnimationFrame(draw);
  const mime = MediaRecorder.isTypeSupported('video/mp4;codecs=avc1') ? 'video/mp4;codecs=avc1' : 'video/webm;codecs=vp9';
  const ext = mime.startsWith('video/mp4') ? 'mp4' : 'webm';
  function sample(){ try { const txt = [...doc().querySelectorAll('body *')].filter(e => e.children.length === 0 && e.offsetParent !== null).map(e => e.textContent.trim()).filter(t => t && t.length < 120);
    const now = new Date(); L.log.push({utc: now.toISOString(), rome: fmtRome(now), et: fmtET(now), frames: L.frames, text: txt.slice(0, 60)}); } catch (e) { L.errors.push('sample ' + e); } }
  L.sampler = setInterval(sample, 5000); sample();
  let last = 0; L.fpsTimer = setInterval(() => { L.fpsLog.push([new Date().toISOString().slice(11, 19), L.frames - last, document.visibilityState]); last = L.frames; if (L.fpsLog.length > 6000) L.fpsLog.shift(); }, 5000);
  function save(blob, name){ const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 60000); }
  let rec = null, segStart = null;
  function startSeg(){ const nb = box(); if (nb.w !== B.w || nb.h !== B.h || devicePixelRatio !== S) setup();
    const myChunks = [], myStart = new Date(), my0 = L.log.length, n = L.segs.length + L.pending + 1, myB = {...B}, myS = S, mySize = [comp.width, comp.height]; segStart = myStart;
    rec = new MediaRecorder(stream, {mimeType: mime, videoBitsPerSecond: 16e6}); rec.ondataavailable = e => { if (e.data.size) myChunks.push(e.data); }; L.pending++;
    rec.onstop = () => { L.pending--; const end = new Date(); const tag = L.prefix + '_' + fmtET(myStart).slice(11, 19).replace(/:/g, '') + 'ET_seg' + String(n).padStart(3, '0');
      const blob = new Blob(myChunks, {type: mime}); save(blob, tag + '.' + ext);
      const meta = {file: tag + '.' + ext, start_utc: myStart.toISOString(), end_utc: end.toISOString(), start_et: fmtET(myStart), end_et: fmtET(end), start_rome: fmtRome(myStart), end_rome: fmtRome(end),
        capture: 'canvas composite of the Volwick terminal chart (every chart canvas of the iframe, device pixels), captureStream 30 fps, MediaRecorder ' + mime.split(';')[0] + ' 16 Mbps', box_css: myB, scale: myS, size_px: mySize,
        window: innerWidth + 'x' + innerHeight, browser_tz: Intl.DateTimeFormat().resolvedOptions().timeZone, size_mb: +(blob.size / 1e6).toFixed(2), samples: L.log.slice(my0), fps_log: L.fpsLog.slice(-62)};
      save(new Blob([JSON.stringify(meta, null, 1)], {type: 'application/json'}), tag + '.json'); L.segs.push({file: meta.file, mb: meta.size_mb, start_et: meta.start_et, end_et: meta.end_et}); };
    rec.start(1000); L.state = 'rec'; }
  L.prefix = 'LMR_ES_' + fmtET(new Date()).slice(0, 10);
  L.stop = why => { L.why = why; clearInterval(L.timer); if (rec && rec.state === 'recording') rec.stop(); L.state = 'stopped'; };
  L.status = () => ({state: L.state, frames: L.frames, lastFrameAgoMs: Date.now() - (L.lastFrame || 0), segs: L.segs.length, last: L.segs.slice(-2), errors: L.errors.slice(-3), hidden: document.hidden, wake: L.wake, px: [comp.width, comp.height], win: L.win, fps: L.fpsLog.slice(-6)});
  L.schedule = (startRome, endRome, segMin = 5) => { L.win = {startRome, endRome, segMin}; clearInterval(L.timer);
    L.timer = setInterval(() => { const now = new Date(), hhmm = fmtRome(now).slice(11, 16), inWin = hhmm >= startRome && hhmm < endRome;
      if (inWin && L.state !== 'rec') startSeg();
      else if (L.state === 'rec' && (!inWin || ((now - segStart) > 60000 && now.getUTCMinutes() % segMin === 0 && now.getUTCSeconds() === 0))) { rec.stop(); L.state = 'between'; if (inWin) startSeg(); }
      if (!inWin && L.state === 'between') L.state = 'idle'; }, 1000); };
  try { navigator.wakeLock.request('screen').then(w => { L.wake = 'on'; w.addEventListener('release', () => L.wake = 'released'); }).catch(e => L.wake = 'no: ' + e.name); } catch (e) { L.wake = 'no'; }
  return 'installed ' + comp.width + 'x' + comp.height;
})()
