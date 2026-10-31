// ============================================================
// V0003 · THE PIN · PROVE 3D (T2, 31 Oct 2026) · stampo Assorbimento V2 (price panel, voice-led, captions word by word).
// Price sits in a 2.5-point range on a call wall where dealers are long gamma; their hedging sells rallies and buys dips;
// when price moves away from the wall the range opens again. Voice: HeyGen Matthew (words.json / cues.json). All data SIMULATED.
// ============================================================
const S = {};
const {COL, SAFE, seg, lin, eo, eio, mix, clamp} = VW;
const GOLD='#F2C14E', RED='#E2575F', GREEN=COL.up, WHITE='#F2F5FA', WALLC='#26C08A';
const q=x=>Math.round(x*4)/4;

// ---------- simulated ES 1m session ----------
const N=60, P0=14, P1=44, WALL=7744.5;
const BARS = VW.simSession({
  seed: 20261103, start: 7731.25, n: N,
  target: i => i<P0 ? 7731.25+(WALL-0.75-7731.25)*eio(i/(P0-1))+Math.sin(i*1.2)*0.6
            : i<=P1 ? WALL+0.9*Math.sin(i*1.7)+0.3*Math.sin(i*0.6)
            : WALL-(WALL-7734.5)*eo((i-P1)/(N-1-P1))+Math.sin(i*1.4)*1.6,
  vol: (i,body,R) => i>=P0&&i<=P1 ? Math.round(1300+R()*700) : Math.round(2200+R()*1300+body*260),
  delta: (i,ret,gauss) => ret*160+gauss()*110
});
// keep the pinned bars inside the 2.5-point box around the wall, the open range wider after it
const RLO=7743.25, RHI=7745.75;
BARS.forEach((b,i)=>{ if (i>0) b.o=BARS[i-1].c;
  if (i>=P0&&i<=P1){ b.c=clamp(q(b.c),RLO+0.25,RHI-0.25); b.h=clamp(Math.max(b.h,b.o,b.c),Math.max(b.o,b.c),RHI); b.l=clamp(Math.min(b.l,b.o,b.c),RLO,Math.min(b.o,b.c)); }
  b.h=Math.max(b.h,b.o,b.c); b.l=Math.min(b.l,b.o,b.c); });
const after=BARS.slice(P1+1), AHI=Math.max(...after.map(b=>b.h)), ALO=Math.min(...after.map(b=>b.l));
window.DATA_CHECK={ pinHi:Math.max(...BARS.slice(P0,P1+1).map(b=>b.h)), pinLo:Math.min(...BARS.slice(P0,P1+1).map(b=>b.l)), afterHi:AHI, afterLo:ALO, last:BARS[N-1].c };

// ---------- layout (2026 zones) ----------
const PR={pMin:7730.5, pMax:7748.5};
const L={x0:104, x1:820, y0:640, y1:1400, ...PR, cvd:{y0:1400, y1:1410}};
const C=new VW.Chart(BARS,L);
const AX=836, LSP=1.7;
const X=i=>C.X(i), PY=p=>C.PY(p);
const f2=p=>p.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});

let WORDS=[], GROUPS=[], CUES={};
function W(word,nth=1,edge='s'){ let c=0; for (const w of WORDS){ if (w[0].replace(/[^\w']/g,'').toLowerCase()===word.replace(/[^\w']/g,'').toLowerCase()){ if (++c===nth) return edge==='s'?w[1]:w[2]; } } throw new Error('word not found: '+word+' #'+nth); }
let E={};
function buildTimeline(){
  E.its=W("It's"); E.hookE=W('accident.',1,'e'); E.rw0=E.hookE+0.1; E.n0=E.rw0+0.45;
  E.less=W('less'); E.sold=W('sold.'); E.bought=W('bought.'); E.boughtE=W('bought.',1,'e');
  E.wall=W('call'); E.long=W('long',1); E.sell=W('sell'); E.buy=W('buy'); E.pin=W('pin');
  E.when=W('When'); E.away=W('away'); E.open=W('open'); E.againE=W('again.',1,'e');
  E.logo0=CUES.logo0; E.dv=CUES.dvv[0]-0.08; E.loop0=CUES.loop0; E.total=CUES.total;
  S.total=E.total;
}

// ---------- state ----------
function state(t){
  const st={}, loop=t>=E.loop0, tt=loop?0:t;
  if (tt<E.rw0) st.n=P1+0.6;
  else if (t<E.n0) st.n=mix(P1+0.6,6,eio(lin(t,E.rw0,E.n0)));
  else if (t<E.boughtE) st.n=mix(6,30,lin(t,E.n0,E.boughtE));
  else if (t<E.pin) st.n=mix(30,P1+0.6,lin(t,E.boughtE,E.pin));
  else if (t<E.when) st.n=P1+0.6;
  else st.n=mix(P1+0.6,N,eio(lin(t,E.when,E.againE+0.4)));
  const hk=(tt<E.rw0?1:0)*(1-seg(t,E.rw0-0.1,E.rw0+0.15));
  st.range = loop?0 : Math.max(hk, t>=E.rw0?seg(t,E.less-0.1,E.less+0.4):0);
  st.sold  = loop?0 : seg(t,E.sold-0.1,E.sold+0.3)*(1-seg(t,E.wall-0.3,E.wall+0.2));
  st.bought= loop?0 : seg(t,E.bought-0.1,E.bought+0.3)*(1-seg(t,E.wall-0.3,E.wall+0.2));
  st.wall  = loop?0 : seg(t,E.wall-0.15,E.wall+0.45);
  st.longT = loop?0 : seg(t,E.long-0.1,E.long+0.35);
  st.dSell = loop?0 : seg(t,E.sell-0.1,E.sell+0.3)*(1-seg(t,E.when-0.2,E.when+0.3));
  st.dBuy  = loop?0 : seg(t,E.buy-0.1,E.buy+0.3)*(1-seg(t,E.when-0.2,E.when+0.3));
  st.pin   = loop?0 : seg(t,E.pin-0.1,E.pin+0.35);
  st.open  = loop?0 : seg(t,E.open-0.15,E.open+0.45);
  st.cta = loop?0 : seg(t,E.logo0-0.6,E.logo0);
  return st;
}

// ============================================================
// 3D LAYER (Power, 31 Oct: "più tridimensionale, più profondità"). Same data, same voice timeline as v0003_voce.
// ?var=1 TAVOLO  · the chart is a table seen from above: extruded candles, glass wall slab, floor grid, slow orbit
// ?var=2 ORBITA  · starts flat, the camera turns at every key word (wall, gamma, sell/buy, pin, away)
// ?var=3 STRATI  · near-flat chart split in depth layers (grid far, candles, floating cards near), parallax drift
// ============================================================
const VAR = +(new URLSearchParams(location.search).get('var') || 1);
const F3 = 1500;                                   // focal length (px)
const PIV = {x:(L.x0+L.x1)/2, y:PY(WALL), z:0};    // camera pivot: the wall, centre of the chart
let CAM = {yaw:0, pitch:0, roll:0, dz:0, px:0, py:0};
function P3(x,y,z){
  let dx=x-PIV.x, dy=y-PIV.y, dz=z-PIV.z;
  const cy=Math.cos(CAM.yaw), sy=Math.sin(CAM.yaw); const x1=dx*cy+dz*sy, z1=-dx*sy+dz*cy;
  const cp=Math.cos(CAM.pitch), sp=Math.sin(CAM.pitch); const y1=dy*cp+z1*sp, z2=z1*cp-dy*sp+CAM.dz;
  const s=F3/(F3+z2); return [PIV.x+CAM.px+x1*s, PIV.y+CAM.py+y1*s, z2, s];
}
const shade=(hex,k,a=1)=>{ const n=parseInt(hex.slice(1),16); const c=v=>Math.round(clamp(v*k,0,255)); return `rgba(${c(n>>16&255)},${c(n>>8&255)},${c(n&255)},${a})`; };
function quadPath(pts){ const g=VW.g; g.beginPath(); g.moveTo(pts[0][0],pts[0][1]); for (let i=1;i<pts.length;i++) g.lineTo(pts[i][0],pts[i][1]); g.closePath(); }
// box faces with a shade factor per face, painter-sorted by the caller
function boxFaces(x0,x1,y0,y1,z0,z1,col,a){
  const v=(x,y,z)=>P3(x,y,z);
  const F=[ // [corners, shade]
    [[v(x0,y0,z0),v(x1,y0,z0),v(x1,y1,z0),v(x0,y1,z0)],1.0],   // front
    [[v(x0,y0,z1),v(x1,y0,z1),v(x1,y1,z1),v(x0,y1,z1)],0.45],  // back
    [[v(x0,y0,z0),v(x1,y0,z0),v(x1,y0,z1),v(x0,y0,z1)],1.35],  // top
    [[v(x0,y1,z0),v(x1,y1,z0),v(x1,y1,z1),v(x0,y1,z1)],0.45],  // bottom
    [[v(x0,y0,z0),v(x0,y1,z0),v(x0,y1,z1),v(x0,y0,z1)],0.68],  // left
    [[v(x1,y0,z0),v(x1,y1,z0),v(x1,y1,z1),v(x1,y0,z1)],0.68]]; // right
  return F.map(([p,k])=>({z:(p[0][2]+p[1][2]+p[2][2]+p[3][2])/4, draw:()=>{ const g=VW.g; g.globalAlpha=a; quadPath(p); g.fillStyle=shade(col,k); g.fill(); }}));
}
// depth of each element per variant
const DEP = VAR===3 ? {candle:10, grid:260, card:-150, tag:-70, range:16, wall:18}
                    : {candle:22, grid:70,  card:-60,  tag:-30, range:44, wall:70};

// ---------- camera per variant ----------
function camKeys(){
  const k=(t,yaw,pitch,dz,py=0,px=0,roll=0)=>[t,{yaw,pitch,dz,py,px,roll}];
  if (VAR===1) return [k(0,-0.20,0.40,-40,0),k(E.wall,-0.08,0.38,-110,0),k(E.pin,0.08,0.36,-230,0),k(E.when,0.14,0.34,-110,0),k(E.logo0,0.18,0.32,-60,0)];
  if (VAR===2) return [k(0,0,0,0),k(E.rw0,0,0,0),k(E.n0,-0.10,0.10,-40),k(E.sold,-0.06,0.14,-80),
    k(E.wall-0.2,-0.06,0.14,-80),k(E.wall+0.9,-0.38,0.28,-60),k(E.long+1.2,-0.44,0.32,-130),
    k(E.sell-0.2,-0.28,0.28,-110),k(E.buy+0.6,0.28,0.24,-150),k(E.pin+0.1,0.06,0.20,-300),
    k(E.when,0.06,0.20,-270),k(E.againE+0.4,-0.14,0.28,-40),k(E.logo0,-0.16,0.30,0)];
  return [k(0,0,0,0)]; // VAR 3: drift is analytic
}
let KEYS=[];
const FIT = VAR===3 ? {dz:170, py:40} : {dz:330, py:70};   // keep the whole 3D chart inside the safe zones (x 96–940, y 260–1550)
function camAt(t){ const c=camRaw(t); c.dz+=FIT.dz; c.py+=FIT.py; return c; }
function camRaw(t){
  if (VAR===3){ const w=t*0.55; return {yaw:0.075*Math.sin(w)+0.03*Math.sin(w*2.3), pitch:0.05+0.04*Math.sin(w*0.8+1), roll:0, dz:-40-60*lin(t,0,E.logo0)-90*seg(t,E.pin-0.2,E.pin+0.6)*(1-seg(t,E.when,E.when+1)), px:0, py:0}; }
  if (t<=KEYS[0][0]) return {...KEYS[0][1]};
  for (let i=0;i<KEYS.length-1;i++){ const [t0,a]=KEYS[i],[t1,b]=KEYS[i+1]; if (t<=t1){ const kk=eio(lin(t,t0,t1)); const o={}; for (const key in a) o[key]=mix(a[key],b[key],kk); return o; } }
  return {...KEYS[KEYS.length-1][1]};
}

// ---------- drawings in 3D ----------
function panel3(a){ if (a<=0) return; const g=VW.g, z=DEP.grid, x0=L.x0-18, x1=AX+118, y0=L.y0-20, y1=L.y1+20;
  g.save(); g.globalAlpha=a; quadPath([P3(x0,y0,z),P3(x1,y0,z),P3(x1,y1,z),P3(x0,y1,z)]); g.fillStyle='rgba(10,16,30,0.62)'; g.fill(); g.strokeStyle='rgba(120,150,210,0.16)'; g.lineWidth=1.2; g.stroke();
  // horizontal price grid on the back plane
  g.strokeStyle='rgba(120,150,210,0.10)'; g.lineWidth=1;
  for (let p=Math.ceil(PR.pMin)+0; p<=PR.pMax; p+=1){ const y=PY(p); if (y<L.y0||y>L.y1) continue; const A=P3(L.x0,y,z),B=P3(L.x1,y,z); g.globalAlpha=a*(p%5===0?1:0.35); g.beginPath(); g.moveTo(A[0],A[1]); g.lineTo(B[0],B[1]); g.stroke(); }
  for (let i=0;i<=N;i+=6){ const x=L.x0+C.bw*i, A=P3(x,L.y0,z), B=P3(x,L.y1,z); g.globalAlpha=a*0.35; g.beginPath(); g.moveTo(A[0],A[1]); g.lineTo(B[0],B[1]); g.stroke(); }
  g.restore(); }
function floor3(a){ if (a<=0||VAR===3) return; const g=VW.g, y=L.y1+20, zs=-260, ze=DEP.grid; g.save(); g.lineWidth=1.2;
  // floor plane under the chart, fading lines receding into depth
  const q=[P3(L.x0-18,y,zs),P3(AX+118,y,zs),P3(AX+118,y,ze),P3(L.x0-18,y,ze)]; quadPath(q); const gr=g.createLinearGradient(0,q[0][1],0,q[2][1]); gr.addColorStop(0,'rgba(90,140,255,0.10)'); gr.addColorStop(1,'rgba(90,140,255,0.0)'); g.globalAlpha=a; g.fillStyle=gr; g.fill();
  g.strokeStyle='rgba(120,160,255,0.22)';
  for (let x=L.x0-18;x<=AX+118;x+=C.bw*6){ const A=P3(x,y,zs),B=P3(x,y,ze); g.globalAlpha=a*0.6; g.beginPath(); g.moveTo(A[0],A[1]); g.lineTo(B[0],B[1]); g.stroke(); }
  for (let z=zs;z<=ze;z+=55){ const A=P3(L.x0-18,y,z),B=P3(AX+118,y,z); g.globalAlpha=a*0.6*lin(z,zs-40,ze); g.beginPath(); g.moveTo(A[0],A[1]); g.lineTo(B[0],B[1]); g.stroke(); }
  g.restore(); }
function candleFaces(n,a){ const out=[]; const d=DEP.candle/2;
  for (let i=0;i<Math.ceil(n)&&i<N;i++){ const k=clamp(n-i,0,1); if (k<=0) continue; const b=BARS[i], x=X(i), kk=VW.eoe(k), cl=mix(b.o,b.c,kk), hi=mix(Math.max(b.o,cl),b.h,kk), lo=mix(Math.min(b.o,cl),b.l,kk);
    const col=cl>=b.o?COL.up:COL.dn, aa=a*Math.min(1,k*2.5), w=C.bw*0.34, yT=PY(Math.max(b.o,cl)), yB=Math.max(yT+2,PY(Math.min(b.o,cl)));
    const wick={z:P3(x,(yT+yB)/2,0)[2]+0.01, draw:()=>{ const g=VW.g, A=P3(x,PY(hi),0), B=P3(x,yT,0), Cc=P3(x,yB,0), D=P3(x,PY(lo),0); g.globalAlpha=aa; g.strokeStyle=col; g.lineWidth=2.2*A[3]; g.beginPath(); g.moveTo(A[0],A[1]); g.lineTo(B[0],B[1]); g.moveTo(Cc[0],Cc[1]); g.lineTo(D[0],D[1]); g.stroke(); }};
    const faces=boxFaces(x-w,x+w,yT,yB,-d,d,col,aa); faces.sort((p,q)=>q.z-p.z);
    const zc=P3(x,(yT+yB)/2,0)[2]; out.push({z:zc, draw:()=>{ wick.draw(); for (const f of faces) f.draw(); }}); }
  return out; }
function rangeBox3(i0,i1,lo,hi,a,col,label,gap=12){ if (a<=0) return; const g=VW.g, x0=X(i0)-C.bw*0.6, x1=X(i1)+C.bw*0.6, xe=mix(x0,x1,eo(clamp(a*1.4,0,1))), d=DEP.range, yh=PY(hi), yl=PY(lo);
  g.save(); g.globalAlpha=a;
  const faces=[[P3(x0,yh,-d),P3(xe,yh,-d),P3(xe,yh,d),P3(x0,yh,d)],[P3(x0,yl,-d),P3(xe,yl,-d),P3(xe,yl,d),P3(x0,yl,d)],[P3(x0,yh,-d),P3(xe,yh,-d),P3(xe,yl,-d),P3(x0,yl,-d)]];
  faces.forEach((f,j)=>{ quadPath(f); g.fillStyle=VW.rgba(col,j===2?0.05:0.10); g.fill(); });
  g.strokeStyle=VW.rgba(col,0.9); g.lineWidth=2.4; g.setLineDash([10,8]);
  for (const [y,z] of [[yh,-d],[yl,-d],[yh,d],[yl,d]]){ const A=P3(x0,y,z),B=P3(xe,y,z); g.globalAlpha=a*(z<0?1:0.45); g.beginPath(); g.moveTo(A[0],A[1]); g.lineTo(B[0],B[1]); g.stroke(); }
  g.setLineDash([]); g.lineWidth=1.6; g.globalAlpha=a*0.6; for (const x of [x0,xe]) for (const y of [yh,yl]){ const A=P3(x,y,-d),B=P3(x,y,d); g.beginPath(); g.moveTo(A[0],A[1]); g.lineTo(B[0],B[1]); g.stroke(); }
  const T=P3((x0+x1)/2, yl+gap, -d); g.globalAlpha=a; g.font=`700 ${Math.round(27*T[3])}px VWMono`; g.letterSpacing='2px'; g.fillStyle=col; g.textAlign='center'; g.textBaseline='top'; g.shadowColor='rgba(0,0,0,0.95)'; g.shadowBlur=12;
  g.fillText(label,T[0],T[1]); g.restore(); }
function marks3(a,up){ if (a<=0) return; const g=VW.g; g.save(); g.globalAlpha=a; const col=up?GREEN:RED, z=-DEP.candle/2-2;
  for (let i=P0+2;i<=30;i++){ const b=BARS[i]; const isHi=b.h>=RHI-0.25, isLo=b.l<=RLO+0.25; if (up?!isLo:!isHi) continue;
    const Q=P3(X(i), up?PY(b.l)+24:PY(b.h)-24, z), s=Q[3], x=Q[0], y=Q[1]; g.fillStyle=col; g.shadowColor=VW.rgba(col,0.8); g.shadowBlur=10; g.beginPath();
    if (up){ g.moveTo(x,y-10*s); g.lineTo(x-9*s,y+6*s); g.lineTo(x+9*s,y+6*s); } else { g.moveTo(x,y+10*s); g.lineTo(x-9*s,y-6*s); g.lineTo(x+9*s,y-6*s); } g.closePath(); g.fill(); }
  g.restore(); }
// the call wall as a glass slab across the chart; depth grows with the gamma size when "long gamma" is said
function wallSlab(a,glow,half,longK){ if (a<=0) return; const g=VW.g, y=PY(WALL), xr=mix(L.x0,L.x1,eo(clamp(a*1.3,0,1))), D=DEP.wall*(1+(VAR===3?0.6:1.6)*longK);
  const zs=half==='back'?0:-D, ze=half==='back'?D:0; g.save();
  const q=[P3(L.x0,y,zs),P3(xr,y,zs),P3(xr,y,ze),P3(L.x0,y,ze)]; quadPath(q); g.globalAlpha=a*(half==='back'?0.55:0.8); g.fillStyle=VW.rgba(WALLC,0.10+0.10*glow); g.fill();
  if (half==='front'){ // thin vertical skin of the slab + bright front edge
    const t=6, sk=[P3(L.x0,y-t,-D),P3(xr,y-t,-D),P3(xr,y+t,-D),P3(L.x0,y+t,-D)]; quadPath(sk); g.globalAlpha=a; g.fillStyle=VW.rgba(WALLC,0.35); g.fill();
    const A=P3(L.x0,y,-D),B=P3(xr,y,-D); const gr=g.createLinearGradient(A[0],0,B[0],0); gr.addColorStop(0,VW.rgba(WALLC,0.2)); gr.addColorStop(1,VW.rgba(WALLC,1));
    g.strokeStyle=gr; g.lineWidth=(3+3*glow)*A[3]; g.shadowColor=VW.rgba(WALLC,0.9); g.shadowBlur=14+30*glow; g.beginPath(); g.moveTo(A[0],A[1]); g.lineTo(B[0],B[1]); g.stroke();
    const A2=P3(L.x0,y,D),B2=P3(xr,y,D); g.shadowBlur=0; g.lineWidth=1.5; g.strokeStyle=VW.rgba(WALLC,0.35); g.beginPath(); g.moveTo(A2[0],A2[1]); g.lineTo(B2[0],B2[1]); g.stroke(); }
  g.restore(); }
// floating card: a real 3D plane with drop shadow on the chart plane
function card3(cx,cy,z,txt,col,a,size=27){ if (a<=0) return; const g=VW.g; g.save(); g.font=`700 ${size}px VWMono`; g.letterSpacing='1px'; const tw=g.measureText(txt).width+30, h=size*1.8;
  const sh=[P3(cx-tw/2+10,cy-h/2+14,DEP.grid*0+0),P3(cx+tw/2+10,cy-h/2+14,0),P3(cx+tw/2+10,cy+h/2+14,0),P3(cx-tw/2+10,cy+h/2+14,0)];
  if (z<-20){ quadPath(sh); g.globalAlpha=a*0.45; g.fillStyle='rgba(0,0,0,0.9)'; g.filter='blur(8px)'; g.fill(); g.filter='none'; }
  const q=[P3(cx-tw/2,cy-h/2,z),P3(cx+tw/2,cy-h/2,z),P3(cx+tw/2,cy+h/2,z),P3(cx-tw/2,cy+h/2,z)]; quadPath(q); g.globalAlpha=a; g.fillStyle='rgba(6,10,20,0.92)'; g.fill(); g.strokeStyle=col; g.lineWidth=2; g.stroke();
  const T=P3(cx,cy,z); g.font=`700 ${Math.round(size*T[3])}px VWMono`; g.fillStyle=col; g.textAlign='center'; g.textBaseline='middle'; g.fillText(txt,T[0],T[1]+1); g.restore(); }
function text3(x,y,z,txt,font,size,col,a,align='left',base='bottom'){ if (a<=0) return; const g=VW.g, T=P3(x,y,z); g.save(); g.globalAlpha=a; g.font=`${font} ${Math.round(size*T[3])}px VWMono`; g.letterSpacing='1px'; g.fillStyle=col; g.textAlign=align; g.textBaseline=base; g.shadowColor='rgba(0,0,0,0.95)'; g.shadowBlur=12; g.fillText(txt,T[0],T[1]); g.restore(); }
function axis3(a,pTag){ for (let p=Math.ceil(PR.pMin/5)*5; p<=PR.pMax; p+=5){ const y=PY(p); if (y<L.y0+14||y>L.y1-14||Math.abs(y-PY(pTag))<46) continue; text3(AX,y,DEP.grid*0.5,f2(p),'600',27,COL.ink2,0.85*a,'left','middle'); } }
function priceTag3(p,a){ if (a<=0) return; const g=VW.g, y=clamp(PY(p),L.y0+24,L.y1-24), z=DEP.tag; g.save(); g.globalAlpha=a;
  quadPath([P3(AX-10,y-26,z),P3(AX+122,y-26,z),P3(AX+122,y+26,z),P3(AX-10,y+26,z)]); g.fillStyle=WHITE; g.shadowColor='rgba(0,0,0,0.7)'; g.shadowBlur=16; g.fill(); g.shadowBlur=0;
  const T=P3(AX+56,y+1,z); g.fillStyle='#0B1220'; g.font=`700 ${Math.round(26*T[3])}px VWMono`; g.textAlign='center'; g.textBaseline='middle'; g.fillText(f2(p),T[0],T[1]); g.restore(); }

// ---------- render ----------
function render(t){
  const g=VW.g; g.setTransform(1,0,0,1,0,0); g.globalAlpha=1; g.filter='none';
  VW.background(t);
  const st=state(t), tt=t>=E.loop0?0:t, n=st.n, p=q(C.lastPrice(Math.max(1,n)));
  CAM=camAt(tt);
  const dim=1-0.85*st.cta, pinK=st.pin, glow=VW.punch([E.pin+0.05],t,0.35)+0.25*pinK;
  floor3(dim); panel3(dim); axis3(dim,p);
  wallSlab(st.wall*dim,glow*dim,'back',st.longT);
  const pinCol=pinK>0.5?GOLD:WHITE, pinLab=pinK>0.5?'PINNED · 2.50 PTS':'RANGE · 2.50 PTS';
  const items=candleFaces(n,dim); items.sort((a,b)=>b.z-a.z); for (const it of items) it.draw(); g.globalAlpha=1;
  wallSlab(st.wall*dim,glow*dim,'front',st.longT);
  rangeBox3(P0,P1,RLO,RHI,st.range*dim*(1-0.6*st.open),pinCol,pinLab,50);
  marks3(st.sold*dim,false); marks3(st.bought*dim,true);
  { const a=st.wall*dim, yy=PY(RHI)-58; text3(L.x0+10,yy,DEP.card,'CALL WALL · '+f2(WALL),'700',25,WALLC,a); text3(L.x0+10,yy+38,DEP.card,'LONG γ · +$21.6M','700',30,WALLC,a*st.longT); }
  const tx=X(P1)+C.bw*1.2+150;
  card3(tx,PY(RHI)-70,DEP.card,'DEALERS SELL ↓',RED,st.dSell*dim); card3(tx,PY(RLO)+70,DEP.card,'DEALERS BUY ↑',GREEN,st.dBuy*dim);
  rangeBox3(P1+1,N-1,ALO,AHI,st.open*dim,WHITE,'RANGE · '+(AHI-ALO).toFixed(2)+' PTS');
  priceTag3(p,dim);
  { const a=dim*(1-st.cta); if (a>0){ g.save(); g.globalAlpha=0.9*a; g.font='500 20px VWMono'; g.fillStyle=COL.ink2; g.textAlign='center'; g.textBaseline='middle';
    g.fillText('Simulated ES session. Dealer Walls: modeled options-derived positioning.',SAFE.cx,L.y1+70); g.restore(); } }
  VW.vignette(); VW.topBand(380);
  const endK=seg(t,E.logo0,E.logo0+0.5)*(1-seg(t,E.loop0,E.total-0.15));
  VW.logoTL(1-endK,'ES',52,30,true);
  const hOut=1-seg(tt,E.hookE-0.05,E.hookE+0.25);
  { const a1=eo(lin(tt,-0.3,0))*hOut, a2=eo(lin(tt,E.its-0.05,E.its+0.15))*hOut; g.save(); g.textAlign='center'; g.textBaseline='middle'; g.shadowColor='rgba(0,0,0,0.95)'; g.shadowBlur=30;
    g.font='700 58px VWSans'; if (a1>0){ g.globalAlpha=a1; g.fillStyle=WHITE; g.fillText('PRICE IS STUCK.',SAFE.cx,440); }
    if (a2>0){ g.globalAlpha=a2; g.fillStyle='#6E9BFF'; g.fillText("IT'S NOT AN ACCIDENT.",SAFE.cx,502); } g.restore(); }
  VW.captions(t,GROUPS,{y:490,size:66,keySize:76,keys:new Map([['sold.',RED],['bought.',GREEN],['call',WALLC],['wall.',WALLC],['long',WALLC],['gamma',WALLC],['sell',RED],['buy',GREEN],['pin',GOLD],['range',WHITE],['open',WHITE]]),until:E.logo0-0.2});
  if (t>E.logo0){ const y=PY(WALL), pts=[]; for (let i=0;i<N;i++) pts.push([mix(L.x0,L.x1,i/(N-1)),y]);
    VW.logoForm((t-E.logo0)*LSP, pts, {fadeOut:seg(t,E.loop0,E.total-0.15), noUrl:true, dy:-20, tagY:1318, tagSize:32, tagSpacing:5,
      tagline:[['TRADE',COL.ink],['WITH',COL.ink],['INSTITUTIONAL',COL.blue],['CONTEXT.',COL.ink]]});
    const out=1-seg(t,E.loop0,E.total-0.15), k=eo(lin(t,E.dv,E.dv+0.3))*out;
    if (k>0){ g.save(); g.globalAlpha=k; g.textAlign='center'; g.textBaseline='middle'; g.font='700 44px VWMono'; g.letterSpacing='5px';
      g.fillStyle=COL.blue; g.shadowColor='rgba(90,140,255,0.8)'; g.shadowBlur=20; g.fillText('DISCOVER VOLWICK →',543,1410+(1-k)*10); g.restore(); }
    const kd=eo(lin(t,E.dv+0.3,E.dv+0.7))*out;
    if (kd>0){ g.save(); g.globalAlpha=kd; g.textAlign='center'; g.textBaseline='middle'; g.font='600 29px VWMono'; g.fillStyle=COL.ink2; g.fillText('Simulated data. Not investment advice.',540,1496); g.restore(); } }
  VW.guides();
}
window.render=render;
window.READY=(async()=>{
  const qs=new URLSearchParams(location.search);
  WORDS=await (await fetch(qs.get('words')||'words.json')).json();
  CUES=(await (await fetch(qs.get('cues')||'cues.json')).json()).cues;
  GROUPS=VW.buildGroups(WORDS.filter(w=>w[1]>W('accident.',1,'e')+0.2),3,16,{glue:['long gamma','call wall']});
  buildTimeline(); KEYS=camKeys(); await VW.loadFonts(); await VW.loadBrand(); render(0);
  return {...window.DATA_CHECK, total:S.total, events:E};
})();
