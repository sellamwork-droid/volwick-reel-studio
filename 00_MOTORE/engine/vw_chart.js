// ============================================================
// VOLWICK Content Engine · vw_chart.js
// Parametric financial components. A Chart owns a layout and a
// dataset of OHLC bars (with per-bar aggressive delta and CVD).
// All drawing happens in "world" coordinates, under the camera.
// ============================================================

// ---------- simulated session generator (illustrative data only) ----------
// spec: {seed, start, n, tick, target(i)->price, delta(i, ret)->int, vol(i, body)->int}
VW.simSession = spec => {
  const R=VW.rng(spec.seed); const gauss=()=>{ let u=0,v=0; while(!u)u=R(); while(!v)v=R(); return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); };
  const tk=spec.tick||0.25, rnd=x=>Math.round(x/tk)*tk;
  const bars=[]; let close=spec.start, cvd=0;
  for (let i=0;i<spec.n;i++) {
    const o=close, c=rnd(spec.target(i)+gauss()*0.6);
    const h=rnd(Math.max(o,c)+Math.abs(gauss())*0.9+tk), l=rnd(Math.min(o,c)-Math.abs(gauss())*0.9-tk);
    const v=spec.vol(i, Math.abs(c-o), R);
    let d=spec.delta(i, c-o, gauss);
    d=Math.max(-v*0.6, Math.min(v*0.6, Math.round(d)));        // delta can never exceed traded volume
    cvd+=d; bars.push({o,h,l,c,v,d,cvd}); close=c;
  }
  return bars;
};
VW.argmax = (bars,a,b,key) => { let m=-1e18,k=a; for (let i=a;i<=b;i++){ const v=key(bars[i]); if (v>m){m=v;k=i;} } return k; };

VW.Chart = class {
  constructor(bars, L) {
    this.bars=bars; this.N=bars.length; this.L=L;
    this.bw=(L.x1-L.x0)/this.N;
    let cMin=1e18,cMax=-1e18; bars.forEach(b=>{cMin=Math.min(cMin,b.cvd);cMax=Math.max(cMax,b.cvd);});
    cMin=Math.min(cMin,0); const pad=(cMax-cMin)*0.14; this.cMin=cMin-pad; this.cMax=cMax+pad;
  }
  X(i){ return this.L.x0+this.bw*(i+0.5); }
  PY(p){ const L=this.L; return L.y1-(p-L.pMin)/(L.pMax-L.pMin)*(L.y1-L.y0); }
  CY(v){ const c=this.L.cvd; return c.y1-(v-this.cMin)/(this.cMax-this.cMin)*(c.y1-c.y0); }

  grid(alpha=1){ const g=VW.g, L=this.L; g.save(); g.globalAlpha=alpha; g.strokeStyle=VW.COL.grid; g.lineWidth=1;
    for (let p=Math.ceil(L.pMin/5)*5; p<=L.pMax; p+=5){ const y=this.PY(p); g.beginPath(); g.moveTo(L.x0-400,y); g.lineTo(L.x1+300,y); g.stroke(); }
    for (let i=0;i<=this.N;i+=8){ const x=L.x0+this.bw*i; g.beginPath(); g.moveTo(x,L.y0-300); g.lineTo(x,L.cvd.y1+60); g.stroke(); }
    g.restore(); }
  axis(alpha=1, step=10){ const g=VW.g, L=this.L; g.save(); g.globalAlpha=alpha; g.font='500 26px VWMono'; g.fillStyle=VW.COL.ink3; g.textAlign='left'; g.textBaseline='middle';
    for (let p=Math.ceil(L.pMin/step)*step; p<=L.pMax; p+=step) g.fillText(p.toFixed(0),L.x1+16,this.PY(p)); g.restore(); }
  candle(i,k){ if (k<=0) return; const g=VW.g, b=this.bars[i], x=this.X(i), col=b.c>=b.o?VW.COL.up:VW.COL.dn, kk=VW.eoe(k);
    const c=VW.mix(b.o,b.c,kk), hi=VW.mix(Math.max(b.o,b.c),b.h,kk), lo=VW.mix(Math.min(b.o,b.c),b.l,kk);
    g.globalAlpha=Math.min(1,k*2.5); g.strokeStyle=col; g.lineWidth=2.4;
    g.beginPath(); g.moveTo(x,this.PY(hi)); g.lineTo(x,this.PY(lo)); g.stroke();
    const y1=this.PY(Math.max(b.o,c)), y2=this.PY(Math.min(b.o,c)); g.fillStyle=col; g.fillRect(x-this.bw*0.34,y1,this.bw*0.68,Math.max(2,y2-y1)); g.globalAlpha=1; }
  candles(n){ for (let i=0;i<Math.ceil(n)&&i<this.N;i++) this.candle(i,VW.clamp(n-i,0,1)); }
  volume(n, vmax, hmax=90){ const g=VW.g;
    for (let i=0;i<Math.ceil(n)&&i<this.N;i++){ const k=VW.clamp(n-i,0,1), b=this.bars[i];
      g.fillStyle=VW.rgba(b.c>=b.o?VW.COL.up:VW.COL.dn,0.26*k); const h=b.v/vmax*hmax*VW.eo(k); g.fillRect(this.X(i)-this.bw*0.34,this.L.y1-h,this.bw*0.68,h); } }
  lastPrice(n){ const i=Math.min(this.N-1,Math.floor(Math.max(0,n-0.001))), b=this.bars[i]; return VW.mix(b.o,b.c,VW.eoe(VW.clamp(n-i,0,1))); }
  priceTag(n){ if (n<1) return; const g=VW.g, L=this.L, p=this.lastPrice(n), y=this.PY(p);
    g.setLineDash([6,8]); g.strokeStyle=VW.rgba(VW.COL.gold,0.55); g.lineWidth=1.5; g.beginPath(); g.moveTo(L.x0-400,y); g.lineTo(L.x1+8,y); g.stroke(); g.setLineDash([]);
    g.fillStyle=VW.COL.gold; VW.roundRect(L.x1+10,y-21,112,42,7); g.fill();
    g.fillStyle='#120E02'; g.font='700 23px VWMono'; g.textAlign='center'; g.textBaseline='middle'; g.fillText(p.toFixed(2),L.x1+66,y+1); }

  // CVD pane: delta bars + cumulative line, revealed to fractional bar n.
  cvdPane(n, alpha=1, opt={}){
    if (alpha<=0) return; const g=VW.g, L=this.L, P=L.cvd, off=(1-alpha)*120;
    g.save(); g.translate(0,off); g.globalAlpha=alpha;
    g.strokeStyle='rgba(150,170,210,0.16)'; g.lineWidth=1; g.beginPath(); g.moveTo(L.x0-400,P.y0-22); g.lineTo(L.x1+300,P.y0-22); g.stroke();
    g.font='700 30px VWMono'; g.fillStyle=VW.COL.ink2; g.textAlign='left'; g.textBaseline='alphabetic'; g.fillText('CVD',opt.labelX||L.x0,P.y0+10);
    if (opt.sub!==false){ g.fillStyle=VW.COL.ink3; g.font='500 22px VWMono'; g.fillText('buys − sells',(opt.labelX||L.x0)+82,P.y0+10); }
    g.setLineDash([3,7]); g.strokeStyle='rgba(150,170,210,0.18)'; g.beginPath(); g.moveTo(L.x0,this.CY(0)); g.lineTo(L.x1,this.CY(0)); g.stroke(); g.setLineDash([]);
    for (let i=0;i<Math.ceil(n)&&i<this.N;i++){ const k=VW.clamp(n-i,0,1), d=this.bars[i].d; g.fillStyle=VW.rgba(d>=0?VW.COL.up:VW.COL.dn,0.22*k);
      const h=d/900*54*VW.eo(k); g.fillRect(this.X(i)-this.bw*0.3,this.CY(0)-Math.max(h,0),this.bw*0.6,Math.abs(h)); }
    if (n>0){ const pts=[[this.X(0)-this.bw*0.5,this.CY(0)]];
      for (let i=0;i<Math.ceil(n)&&i<this.N;i++){ const k=VW.clamp(n-i,0,1), prev=i?this.bars[i-1].cvd:0; pts.push([VW.mix(this.X(i)-this.bw*0.5,this.X(i)+this.bw*0.5,k),this.CY(VW.mix(prev,this.bars[i].cvd,k))]); }
      const LC=opt.lineColor||VW.COL.cvd; const grd=g.createLinearGradient(0,P.y0,0,P.y1); grd.addColorStop(0,VW.rgba(LC,0.16)); grd.addColorStop(1,VW.rgba(LC,0));
      g.beginPath(); g.moveTo(pts[0][0],this.CY(0)); pts.forEach(p=>g.lineTo(p[0],p[1])); g.lineTo(pts[pts.length-1][0],this.CY(0)); g.closePath(); g.fillStyle=grd; g.fill();
      g.shadowColor=VW.rgba(LC,0.7); g.shadowBlur=18; g.beginPath(); pts.forEach((p,j)=>j?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));
      g.strokeStyle=LC; g.lineWidth=5; g.lineJoin='round'; g.stroke(); g.shadowBlur=0;
      const hp=pts[pts.length-1]; g.fillStyle=LC; g.beginPath(); g.arc(hp[0],hp[1],7,0,7); g.fill();
      const iv=Math.min(this.N-1,Math.floor(Math.max(0,n-0.001))), val=this.bars[iv].cvd, tag=(val>=0?'+':'')+(val/1000).toFixed(1)+'K';
      g.fillStyle=VW.rgba(LC,0.95); VW.roundRect(L.x1+10,hp[1]-19,104,38,7); g.fill();
      g.fillStyle='#0B1220'; g.font='700 22px VWMono'; g.textAlign='center'; g.textBaseline='middle'; g.fillText(tag,L.x1+62,hp[1]+1); }
    g.restore(); }

  // Highlight aggressive buys or sells inside the CVD pane (kb, ks: 0..1)
  deltaHighlight(upTo, kb, ks){ const g=VW.g, P=this.L.cvd; if (kb<=0&&ks<=0) return;
    for (let i=0;i<upTo;i++){ const d=this.bars[i].d, h=d/900*54, on=d>=0?kb:ks; if (on<=0) continue;
      g.save(); g.globalAlpha=on; g.shadowColor=d>=0?VW.COL.up:VW.COL.dn; g.shadowBlur=16; g.fillStyle=VW.rgba(d>=0?VW.COL.up:VW.COL.dn,0.95);
      g.fillRect(this.X(i)-this.bw*0.3,this.CY(0)-Math.max(h,0),this.bw*0.6,Math.abs(h)); g.restore(); }
    g.save(); g.font='700 30px VWMono'; g.textBaseline='middle'; g.textAlign='left';
    g.globalAlpha=kb; g.fillStyle=VW.COL.up; g.fillText('▲ AGGRESSIVE BUYS',this.L.x0+6,P.y0+46);
    g.globalAlpha=ks; g.fillStyle=VW.COL.dn; g.fillText('▼ AGGRESSIVE SELLS',this.L.x0+6,P.y1+30); g.restore(); }

  // Two-point trend line with glow, drawn to progress k, plus a tag.
  trendLine(x1,y1,x2,y2,col,k,tag,tagPos){ if (k<=0) return; const g=VW.g;
    g.save(); g.shadowColor=col; g.shadowBlur=22; g.strokeStyle=col; g.lineWidth=5; g.lineCap='round';
    g.beginPath(); g.moveTo(x1,y1); g.lineTo(VW.mix(x1,x2,k),VW.mix(y1,y2,k)); g.stroke(); g.shadowBlur=0;
    g.fillStyle=col; g.beginPath(); g.arc(x1,y1,8,0,7); g.fill(); if (k>0.98){ g.beginPath(); g.arc(x2,y2,8,0,7); g.fill(); }
    if (tag && k>0.6){ g.globalAlpha=VW.lin(k,0.6,1); g.font='700 30px VWMono'; g.fillStyle=col; g.textAlign=tagPos.align||'right'; g.textBaseline=tagPos.base||'bottom'; g.fillText(tag,tagPos.x,tagPos.y); }
    g.restore(); }

  // Divergence window shading between bar a and b.
  zone(a,b,alpha,pulse=1){ if (alpha<=0) return; const g=VW.g, L=this.L, x1=this.X(a)-this.bw*1.2, x2=this.X(b)+this.bw*1.2;
    const grd=g.createLinearGradient(x1,0,x2,0); grd.addColorStop(0,VW.rgba(VW.COL.warn,0)); grd.addColorStop(0.5,VW.rgba(VW.COL.warn,0.07*pulse)); grd.addColorStop(1,VW.rgba(VW.COL.warn,0));
    g.save(); g.globalAlpha=alpha; g.fillStyle=grd; g.fillRect(x1,L.y0-100,x2-x1,L.cvd.y1-L.y0+140);
    g.strokeStyle=VW.rgba(VW.COL.warn,0.35); g.lineWidth=1.2; [x1,x2].forEach(x=>{ g.beginPath(); g.moveTo(x,L.y0-100); g.lineTo(x,L.cvd.y1+30); g.stroke(); }); g.restore(); }

  // Dealer wall: line drawn from the right, label with value (terminal language).
  wall(p,col,label,k){ if (k<=0) return; const g=VW.g, L=this.L, y=this.PY(p), xl=VW.mix(L.x1,L.x0-300,VW.eo(k));
    g.save(); g.shadowColor=col; g.shadowBlur=14; g.strokeStyle=col; g.lineWidth=3; g.beginPath(); g.moveTo(xl,y); g.lineTo(L.x1,y); g.stroke(); g.shadowBlur=0;
    g.globalAlpha=VW.lin(k,0.4,1); g.fillStyle=col; g.beginPath(); g.arc(L.x1-312,y,7,0,7); g.fill();
    g.font='700 26px VWMono'; g.textAlign='left'; g.textBaseline='bottom'; g.fillText(label,L.x1-300,y-10); g.restore(); }

  // Block print: gold diamond dropping onto price, label with size, impact ring.
  print(i,p,q,k){ if (k<=0) return; const g=VW.g, x=this.X(i), y=this.PY(p)-(1-VW.eo(k))*60, s=10*(0.6+0.4*k);
    g.save(); g.globalAlpha=VW.clamp(k*1.5,0,1); const ring=VW.lin(k,0.6,1);
    g.strokeStyle=VW.rgba(VW.COL.gold,0.6*(1-ring)); g.lineWidth=2; g.beginPath(); g.arc(x,this.PY(p),10+ring*34,0,7); g.stroke();
    g.fillStyle=VW.COL.gold; g.beginPath(); g.moveTo(x,y-s); g.lineTo(x+s,y); g.lineTo(x,y+s); g.lineTo(x-s,y); g.closePath(); g.fill();
    const lx=x-96, ly=y-60; VW.roundRect(lx,ly,78,36,8); g.fill();
    g.strokeStyle=VW.rgba(VW.COL.gold,0.8); g.lineWidth=2; g.beginPath(); g.moveTo(lx+78,ly+18); g.lineTo(x-s-2,y-4); g.stroke();
    g.fillStyle='#1A1300'; g.font='700 22px VWMono'; g.textAlign='center'; g.textBaseline='middle'; g.fillText(String(q),lx+39,ly+19); g.restore(); }
};

// Terminal-style command bar (our mockup, never a screen grab). chips: [[label,colour,onTime],...]
VW.commandBar = (t, k, y, chips) => {
  if (k<=0) return; const g=VW.g, S=VW.SAFE;
  g.save(); g.globalAlpha=k; y=y-(1-k)*40;
  g.fillStyle='rgba(13,20,34,0.92)'; VW.roundRect(S.x0,y,S.x1-S.x0,70,14); g.fill(); g.strokeStyle='rgba(120,150,210,0.22)'; g.lineWidth=1.2; g.stroke();
  g.textBaseline='middle'; g.textAlign='left'; g.font='700 22px VWMono'; let x=S.x0+14;
  chips.forEach(([lab,col,ton])=>{ const on=VW.seg(t,ton,ton+0.3), w=g.measureText(lab).width+30;
    g.fillStyle=VW.rgba(col,0.10+0.14*on); VW.roundRect(x,y+15,w,40,8); g.fill(); g.strokeStyle=VW.rgba(col,0.25+0.6*on); g.lineWidth=1.4; g.stroke();
    g.fillStyle=on>0.5?col:VW.COL.ink3; g.fillText(lab,x+15,y+36); x+=w+8; });
  g.restore();
};
