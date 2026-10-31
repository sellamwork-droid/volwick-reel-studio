// ============================================================
// VOLWICK Content Engine · vw_brand.js
// Brand layer: discreet wordmark, data label, hook typography,
// rewind texture, punch flash, centred wordmark end beat.
// ============================================================
VW.assets = {};
VW.loadBrand = async () => { VW.assets.wm = await VW.loadImage('/assets/wm_crop.png'); VW.assets.mono = await VW.loadImage('/assets/mono.png'); };

// Discreet wordmark inside the safe zone + data label on the right.
VW.brandBar = (alpha, dataLabel='ILLUSTRATIVE DATA', sub='') => {
  if (alpha<=0) return; const g=VW.g, S=VW.SAFE, wm=VW.assets.wm, h=28, w=h*wm.width/wm.height;
  g.save(); g.globalAlpha=0.62*alpha; g.globalCompositeOperation='lighter'; g.drawImage(wm,S.x0,S.y0+4,w,h); g.restore();
  g.save(); g.globalAlpha=alpha; g.textAlign='right'; g.textBaseline='middle';
  g.font='600 19px VWMono'; g.fillStyle=VW.COL.ink3; g.fillText(dataLabel,S.x1,S.y0+12);
  if (sub){ g.font='600 19px VWMono'; g.fillStyle=VW.COL.ink2; g.fillText(sub,S.x1,S.y0+38); }
  g.restore();
};

// Fixed wordmark top-left (decision of Power, 23 Oct 2026, v7): always on screen, crisp, no data label.
// Optional small instrument tag on the right, on the same baseline.
VW.logoTL = (alpha=1, tag='', h=46, tagSize=24, crisp=false) => {
  if (alpha<=0) return; const g=VW.g, wm=VW.assets.wm, w=h*wm.width/wm.height, x=64, y=92+(46-h)/2;
  g.save(); g.globalAlpha=alpha;
  if (crisp){ g.globalCompositeOperation='lighter'; g.drawImage(wm,x,y,w,h); g.globalAlpha=0.45*alpha; g.drawImage(wm,x,y,w,h); }  // wordmark has a black matte: additive only
  else { g.globalCompositeOperation='lighter'; g.drawImage(wm,x,y,w,h); }
  g.restore();
  if (tag){ g.save(); g.globalAlpha=(crisp?1:0.8)*alpha; g.font=`${crisp?700:600} ${tagSize}px VWMono`; g.fillStyle=crisp?VW.COL.ink:VW.COL.ink2; g.textAlign='right'; g.textBaseline='middle'; g.fillText(tag, VW.W-64, y+h/2); g.restore(); }
};
// Dark band behind the top of the frame so the brand bar stays clean under any camera move.
VW.topBand = (y1=360) => { const g=VW.g, tb=g.createLinearGradient(0,0,0,y1);
  tb.addColorStop(0,'rgba(3,6,12,0.97)'); tb.addColorStop(0.75,'rgba(3,6,12,0.8)'); tb.addColorStop(1,'rgba(3,6,12,0)'); g.fillStyle=tb; g.fillRect(0,0,VW.W,y1); };

// Big hook lines. lines: [{text, colour, t0, y}]
VW.hook = (t, lines, tOut) => {
  const g=VW.g, out=1-VW.seg(t,tOut,tOut+0.2); if (out<=0) return;
  const hb=g.createLinearGradient(0,lines[0].y-170,0,lines[lines.length-1].y+70);
  hb.addColorStop(0,'rgba(3,6,12,0)'); hb.addColorStop(0.3,`rgba(3,6,12,${0.72*out})`); hb.addColorStop(0.8,`rgba(3,6,12,${0.72*out})`); hb.addColorStop(1,'rgba(3,6,12,0)');
  g.fillStyle=hb; g.fillRect(0,lines[0].y-170,VW.W,lines[lines.length-1].y-lines[0].y+240);
  g.save(); g.textAlign='center'; g.textBaseline='alphabetic'; g.font=`700 ${lines[0].size||112}px VWSans`; g.shadowColor='rgba(0,0,0,0.9)'; g.shadowBlur=40;
  lines.forEach(L=>{ const k=VW.eo(VW.lin(t,L.t0,L.t0+0.18)); if (k<=0) return; g.globalAlpha=k*out; g.fillStyle=L.colour;
    g.save(); g.translate(VW.SAFE.cx,L.y); g.scale(1.25-0.25*k,1.25-0.25*k); g.fillText(L.text,0,0); g.restore(); });
  g.restore();
};
VW.rewind = (t,t0,t1) => { const g=VW.g, k=VW.seg(t,t0,t0+0.15)*(1-VW.seg(t,t1-0.15,t1)); if (k<=0) return;
  g.save(); g.globalAlpha=0.5*k; const R=VW.rng(Math.floor(t*60));
  for (let y=0;y<VW.H;y+=6){ g.fillStyle=`rgba(140,170,255,${0.05+0.05*R()})`; g.fillRect(0,y,VW.W,1.5); }
  g.globalAlpha=k; g.font='700 30px VWMono'; g.fillStyle=VW.COL.ink; g.textAlign='right'; g.textBaseline='middle'; g.fillText('◀◀  REWIND',VW.SAFE.x1,VW.SAFE.y0+90); g.restore(); };
VW.flash = (p) => { if (p<=0.005) return; VW.g.fillStyle=`rgba(200,215,255,${0.10*p})`; VW.g.fillRect(0,0,VW.W,VW.H); };

// Centred wordmark beat (~1 s) over a dimmed frame, with a light sweep. Does not stop the picture.
VW.wordmarkBeat = (t, t0, dur=1.1) => {
  const e=t-t0; if (e<0||e>dur) return; const g=VW.g, wm=VW.assets.wm;
  const a=VW.eo(VW.clamp(e/0.25,0,1))*(1-VW.eo(VW.clamp((e-(dur-0.3))/0.3,0,1)));
  g.fillStyle=`rgba(3,6,12,${0.55*a})`; g.fillRect(0,0,VW.W,VW.H);
  const ww=720, wh=ww*wm.height/wm.width, wx=VW.SAFE.cx-ww/2, wy=760-wh/2;
  g.save(); g.globalAlpha=a; g.globalCompositeOperation='lighter'; g.drawImage(wm,wx,wy+(1-a)*14,ww,wh); g.restore();
  const sw=VW.clamp((e-0.1)/0.8,0,1); if (sw>0&&sw<1){
    const o2c=VW._sw||(VW._sw=document.createElement('canvas')); o2c.width=ww; o2c.height=Math.ceil(wh); const o2=o2c.getContext('2d');
    o2.globalCompositeOperation='source-over'; o2.clearRect(0,0,ww,wh); o2.drawImage(wm,0,0,ww,wh); o2.globalCompositeOperation='source-in';
    const bx=VW.mix(-160,ww+160,sw), gr=o2.createLinearGradient(bx-110,0,bx+110,0); gr.addColorStop(0,'rgba(255,255,255,0)'); gr.addColorStop(0.5,'rgba(255,255,255,0.9)'); gr.addColorStop(1,'rgba(255,255,255,0)');
    o2.fillStyle=gr; o2.fillRect(0,0,ww,wh); g.save(); g.globalAlpha=a; g.globalCompositeOperation='lighter'; g.drawImage(o2c,wx,wy); g.restore(); }
};

// ------------------------------------------------------------
// Logo-forming ending (from pilot v3, liked by Power): the closing-price line lifts off
// the chart and folds into the V, flash, monogram, wordmark rises with a light sweep,
// tagline types in, then url + disclaimer. e = seconds since the ending starts.
// pts: screen-space points of the price line at the start of the ending.
// fadeOut: 0..1 to dissolve the whole ending (used for the loop back to frame 1).
// ------------------------------------------------------------
VW.vPath = k => { const L=[356,563], B=[540,878], R=[722,563];
  if (k<0.5){ const u=k/0.5; return [VW.mix(L[0],B[0],u),VW.mix(L[1],B[1],u)]; }
  const u=(k-0.5)/0.5; return [VW.mix(B[0],R[0],u),VW.mix(B[1],R[1],u)]; };
VW.logoForm = (e, pts, opt={}) => {
  if (e<=0) return; const g=VW.g, C=VW.COL, cl=VW.clamp, eo=VW.eo, eio=VW.eio, mix=VW.mix;
  const fade=1-(opt.fadeOut||0); if (fade<=0) return;
  const tagline=opt.tagline||[['SEE',C.ink],['WHAT',C.ink],['OTHERS',C.blue],["CAN'T.",C.ink]];
  g.save(); g.globalAlpha=fade;
  // 1. world fades to deep navy
  const dk=eio(cl(e/0.9,0,1)); g.fillStyle=`rgba(3,6,12,${dk})`; g.fillRect(0,0,VW.W,VW.H);
  // 2. price line folds into the V
  const mk=cl((e-0.25)/1.15,0,1), lineA=cl(e/0.3,0,1)*(1-cl((e-1.55)/0.35,0,1)), n=pts.length;
  if (lineA>0){ const q=pts.map((p,i)=>{ const d=cl(mk*1.35-(i/n)*0.35,0,1), kk=eio(d), v=VW.vPath(i/(n-1)); return [mix(p[0],v[0],kk),mix(p[1],v[1],kk)]; });
    g.save(); g.globalAlpha=fade*lineA; g.lineJoin='round'; g.lineCap='round';
    const glow=0.6+1.6*Math.exp(-Math.pow((e-1.45)/0.18,2)); g.shadowColor='rgba(120,160,255,1)'; g.shadowBlur=30*glow;
    g.strokeStyle='#DCE6FF'; g.lineWidth=5+4*mk; g.beginPath(); q.forEach((p,j)=>j?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1])); g.stroke(); g.restore(); }
  // 3. flash + monogram
  const fl=Math.exp(-Math.pow((e-1.5)/0.12,2)); if (fl>0.01){ g.fillStyle=`rgba(190,210,255,${0.22*fl})`; g.fillRect(0,0,VW.W,VW.H); }
  const mo=eo(cl((e-1.35)/0.5,0,1));
  if (mo>0){ const size=640*(1.06-0.06*mo), off=VW._mo||(VW._mo=document.createElement('canvas')); off.width=off.height=1024;
    const og=off.getContext('2d'); og.globalCompositeOperation='source-over'; og.clearRect(0,0,1024,1024); og.drawImage(VW.assets.mono,0,0,1024,1024);
    og.globalCompositeOperation='destination-in'; const m=og.createRadialGradient(512,520,200,512,520,480); m.addColorStop(0,'#000'); m.addColorStop(1,'rgba(0,0,0,0)'); og.fillStyle=m; og.fillRect(0,0,1024,1024);
    g.save(); g.globalAlpha=fade*mo; g.globalCompositeOperation='lighter'; g.drawImage(off,540-size/2,720-size/2,size,size); g.restore(); }
  // 4. wordmark rises with a light sweep
  const wm=VW.assets.wm, wa=eo(cl((e-1.75)/0.6,0,1));
  if (wa>0){ const ww=860, wh=ww*wm.height/wm.width, wx=540-ww/2, wy=1105-wh/2+(1-wa)*30;
    g.save(); g.globalAlpha=fade*wa; g.globalCompositeOperation='lighter'; g.drawImage(wm,wx,wy,ww,wh); g.restore();
    const sw=cl((e-2.05)/0.75,0,1);
    if (sw>0&&sw<1){ const o2c=VW._sw2||(VW._sw2=document.createElement('canvas')); o2c.width=ww; o2c.height=Math.ceil(wh); const o2=o2c.getContext('2d');
      o2.globalCompositeOperation='source-over'; o2.fillStyle='#000'; o2.fillRect(0,0,ww,wh);
      const bx=mix(-200,ww+200,sw), gr=o2.createLinearGradient(bx-120,0,bx+120,0); gr.addColorStop(0,'rgba(255,255,255,0)'); gr.addColorStop(0.5,'rgba(255,255,255,0.95)'); gr.addColorStop(1,'rgba(255,255,255,0)');
      o2.fillStyle=gr; o2.fillRect(0,0,ww,wh); o2.globalCompositeOperation='multiply'; o2.drawImage(wm,0,0,ww,wh); /* sweep only on the letters (black matte) */ g.save(); g.globalAlpha=fade; g.globalCompositeOperation='lighter'; g.drawImage(o2c,wx,wy); g.restore(); } }
  // 5. tagline types in
  const full=tagline.map(w=>w[0]).join(' '), chars=Math.floor(cl((e-2.35)/1.0,0,1)*full.length);
  if (chars>0){ g.save(); g.font='700 40px VWMono'; g.letterSpacing='6px'; g.textBaseline='middle'; g.textAlign='left';
    const tw=g.measureText(full).width; let x=540-tw/2+3, c=0;
    tagline.forEach(([w,col],wi)=>{ const piece=(wi?' ':'')+w; for (const ch of piece){ if (c>=chars) break; g.fillStyle=col;
      if (col===C.blue){ g.shadowColor='rgba(90,140,255,0.8)'; g.shadowBlur=18; } else g.shadowBlur=0; g.fillText(ch,x,1270); x+=g.measureText(ch).width; c++; } });
    if (chars<full.length||Math.floor(e*3)%2===0){ g.shadowBlur=0; g.fillStyle=C.blue; g.fillRect(x+4,1250,4,40); }
    g.restore(); }
  // 6. url + disclaimer
  const ua=eo(cl((e-3.2)/0.5,0,1));
  if (ua>0 && !opt.noUrl){ g.save(); g.globalAlpha=fade*ua; g.textAlign='center'; g.textBaseline='middle';
    g.font='600 26px VWMono'; g.letterSpacing='4px'; g.fillStyle=C.ink2; g.fillText('VOLWICK.COM',543,1400);
    g.font='500 21px VWMono'; g.letterSpacing='2px'; g.fillStyle=C.ink3; g.fillText(opt.disclaimer||'Simulated data. Not investment advice.',540,1470); g.restore(); }
  g.restore();
};
