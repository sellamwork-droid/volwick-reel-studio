// VOLWICK · Live Market Reactions · FULL TERMINAL tab recorder (28 Oct 2026)
// Records the whole Volwick tab (toolbar, chart, price and time axes, panels) with Chrome tab capture.
// Run in the Volwick dashboard tab, then click the button it adds (Claude in Chrome can click it: that gives the
// page the user activation Chrome requires). Chrome then shows its own "share this tab" prompt: Power clicks Share once.
// Files: 5-minute MP4 segments + JSON (UTC/ET/Rome times, terminal text every 5 s) saved to ~/Downloads.
// The mouse pointer is not recorded (cursor: never). The tab must stay visible.
(() => {
  if (window.__LMRT) { try { window.__LMRT.stop('reinstall'); } catch (e) {} }
  const L = window.__LMRT = { log: [], segs: [], state: 'idle', errors: [], pending: 0 };
  const fmtRome = d => d.toLocaleString('sv-SE', {timeZone: 'Europe/Rome'}).replace(' ', 'T');
  const fmtET = d => d.toLocaleString('sv-SE', {timeZone: 'America/New_York'}).replace(' ', 'T');
  const doc = () => (document.querySelector('iframe') || {}).contentDocument || document;
  function sample(){ try { const txt = [...doc().querySelectorAll('body *')].filter(e => e.children.length === 0 && e.offsetParent !== null).map(e => e.textContent.trim()).filter(t => t && t.length < 120);
    const now = new Date(); L.log.push({utc: now.toISOString(), rome: fmtRome(now), et: fmtET(now), text: txt.slice(0, 60)}); } catch (e) { L.errors.push('sample ' + e); } }
  L.sampler = setInterval(sample, 5000); sample();
  function save(blob, name){ const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 60000); }
  const mime = MediaRecorder.isTypeSupported('video/mp4;codecs=avc1') ? 'video/mp4;codecs=avc1' : 'video/webm;codecs=vp9';
  const ext = mime.startsWith('video/mp4') ? 'mp4' : 'webm';
  let stream = null, rec = null, segStart = null;
  L.prefix = 'LMR_ES_' + fmtET(new Date()).slice(0, 10) + '_FULLTAB';
  function startSeg(){ const chunks = [], st = new Date(), i0 = L.log.length, n = L.segs.length + L.pending + 1; segStart = st;
    rec = new MediaRecorder(stream, {mimeType: mime, videoBitsPerSecond: 20e6}); rec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); }; L.pending++;
    rec.onstop = () => { L.pending--; const end = new Date(), tag = L.prefix + '_' + fmtET(st).slice(11, 19).replace(/:/g, '') + 'ET_seg' + String(n).padStart(3, '0');
      const blob = new Blob(chunks, {type: mime}); save(blob, tag + '.' + ext);
      const s = stream.getVideoTracks()[0].getSettings();
      save(new Blob([JSON.stringify({file: tag + '.' + ext, start_utc: st.toISOString(), end_utc: end.toISOString(), start_et: fmtET(st), end_et: fmtET(end), start_rome: fmtRome(st), end_rome: fmtRome(end),
        capture: 'Chrome tab capture of the whole Volwick terminal (getDisplayMedia, current tab, cursor never), MediaRecorder ' + mime.split(';')[0] + ' 20 Mbps', size_px: [s.width, s.height], fps: s.frameRate,
        window: innerWidth + 'x' + innerHeight, dpr: devicePixelRatio, size_mb: +(blob.size / 1e6).toFixed(2), samples: L.log.slice(i0)}, null, 1)], {type: 'application/json'}), tag + '.json');
      L.segs.push({file: tag + '.' + ext, mb: +(blob.size / 1e6).toFixed(2)}); };
    rec.start(1000); L.state = 'rec'; }
  L.begin = async () => {
    stream = await navigator.mediaDevices.getDisplayMedia({video: {frameRate: 60, cursor: 'never', displaySurface: 'browser'}, audio: false, preferCurrentTab: true, selfBrowserSurface: 'include', surfaceSwitching: 'exclude'});
    stream.getVideoTracks()[0].addEventListener('ended', () => L.stop('share ended'));
    L.state = 'ready'; return stream.getVideoTracks()[0].getSettings(); };
  L.schedule = (startRome, endRome, segMin = 5) => { L.win = {startRome, endRome, segMin}; clearInterval(L.timer);
    L.timer = setInterval(() => { if (!stream) return; const now = new Date(), hhmm = fmtRome(now).slice(11, 16), inWin = hhmm >= startRome && hhmm < endRome;
      if (inWin && L.state !== 'rec') startSeg();
      else if (L.state === 'rec' && (!inWin || ((now - segStart) > 60000 && now.getUTCMinutes() % segMin === 0 && now.getUTCSeconds() === 0))) { rec.stop(); L.state = 'between'; if (inWin) startSeg(); }
      if (!inWin && L.state === 'between') L.state = 'idle'; }, 1000); };
  L.stop = why => { L.why = why; clearInterval(L.timer); if (rec && rec.state === 'recording') rec.stop(); L.state = 'stopped'; };
  L.status = () => ({state: L.state, segs: L.segs.length, last: L.segs.slice(-2), errors: L.errors.slice(-3), hidden: document.hidden, win: L.win,
    track: stream ? stream.getVideoTracks()[0].getSettings() : null});
  // the button: a trusted click on it gives the page the activation that getDisplayMedia needs
  const b = document.createElement('button'); b.id = 'lmr-start'; b.textContent = 'LMR · start full-terminal recording';
  Object.assign(b.style, {position: 'fixed', right: '16px', bottom: '16px', zIndex: 2147483647, padding: '10px 14px', background: '#2F6BFF', color: '#fff', border: 0, borderRadius: '8px', font: '600 13px system-ui', cursor: 'pointer'});
  b.onclick = async () => { try { const s = await L.begin(); b.remove(); L.started = s; } catch (e) { L.errors.push('begin ' + e); } };
  document.body.appendChild(b);
  try { navigator.wakeLock.request('screen').then(w => { L.wake = 'on'; }).catch(e => L.wake = 'no: ' + e.name); } catch (e) {}
  return 'button ready';
})()
