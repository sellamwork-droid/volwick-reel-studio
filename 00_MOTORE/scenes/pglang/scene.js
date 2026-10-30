// ============================================================
// Scene P · γ MAP V2 · one session, read like a trader.
// Gamma map behind the candles (5-minute columns, 1-point rows, runs ~30 minutes past the newest candle):
// BLUE = dealers long gamma (they sell rallies / buy dips to stay hedged: moves absorbed), AMBER = short gamma (hedging adds to the move).
// White line = sign change (γ flip) at 7,746.00. Range 7,746.00–7,756.00 with 6 tests, first close below the flip, 17.25 pts in 15 minutes.
// Hypothetical short 1 ES at 7,745.00 (close of the break bar), stop 7,748.50, exit 15 bars later. All data SIMULATED.
// ============================================================
const S = {};
const {COL, SAFE, seg, lin, eo, eio, mix, clamp} = VW;
const GOLD='#F2C14E', RED='#E2575F', GREEN=COL.up, BLUE='#4C8DFF', AMBER='#F5A623', WHITE='#F2F5FA';

// ---------- simulated ES 1-minute (tick 0.25, $50 per point) ----------
const N=57, EB=41, FLIP=7746.00, TOP=7756.00, ENTRY=7745.00, STOP=7748.50, PT=50;
const q=x=>Math.round(x*4)/4;
const TESTS=[[5,'h'],[10,'l'],[16,'h'],[21,'l'],[27,'h'],[32,'l']];             // 6 tests of the range edges
const KP=[[0,7751],[5,7755],[10,7747],[16,7755],[21,7747],[27,7755],[32,7747],[36,7750.5],[40,7747.5],[41,7745],
          [43,7743.5],[44,7744],[47,7738.5],[48,7739.25],[51,7733.5],[52,7734],[56,7728.75]];
function kp(i){ for (let j=0;j<KP.length-1;j++){ const [a,pa]=KP[j],[b,pb]=KP[j+1]; if (i>=a&&i<=b) return mix(pa,pb,eio((i-a)/(b-a||1))); } return KP[KP.length-1][1]; }
const BARS=(()=>{ const R=VW.rng(7311), B=[]; let c=7750.75;
  for (let i=0;i<N;i++){ const o=c, fixed=KP.find(k=>k[0]===i); let cl=fixed?fixed[1]:q(kp(i)+(R()-0.5)*1.2);
    let h=q(Math.max(o,cl)+0.25+R()*0.9), l=q(Math.min(o,cl)-0.25-R()*0.9);
    if (i<=40){ cl=clamp(cl,7746.75,7755.25); h=clamp(h,Math.max(o,cl),7755.25); l=clamp(l,7746.75,Math.min(o,cl)); }
    const t=TESTS.find(x=>x[0]===i); if (t){ if (t[1]==='h') h=TOP; else l=FLIP; }
    if (i===EB){ h=Math.max(o,7747.75); l=7744.50; }
    if (i>EB) h=Math.min(h, 7746.50);                                            // never reaches the stop
    const v=i>EB?Math.round(3400+R()*1500):(i===EB?4200:Math.round(1500+R()*1100));
    B.push({o,h,l,c:cl,v}); c=cl; } return B; })();
const pnl=x=>(ENTRY-x)*PT;
const EXIT=BARS[N-1].c;
window.DATA_CHECK={ entry:ENTRY, exit:EXIT, pnl:pnl(EXIT), risk:pnl(STOP), move:FLIP-EXIT,
  rangeHi:Math.max(...BARS.slice(0,41).map(b=>b.h)), rangeLo:Math.min(...BARS.slice(0,41).map(b=>b.l)),
  touchesHi:BARS.slice(0,41).filter(b=>b.h===TOP).length, touchesLo:BARS.slice(0,41).filter(b=>b.l===FLIP).length,
  firstCloseBelow:BARS.findIndex(b=>b.c<FLIP), maxHighAfter:Math.max(...BARS.slice(EB+1).map(b=>b.h)), barsAfter:N-1-EB };

// ---------- gamma field (value -1..1, + = blue / long gamma), sign change at the flip ----------
function field(p,col){ const w=0.85+0.15*Math.sin(col*0.9+0.4);
  if (p>=FLIP) return clamp((p-FLIP)/3.5,0,1)*mix(1,0.45,clamp((p-7760)/8,0,1))*w;
  return -clamp((FLIP-p)/3.5,0,1)*w; }

// ---------- world (fixed scale) and viewport ----------
const K=34, BW=16, PMAX=7772, PMIN=7720;
const LB={cvd:{y0:0,y1:0},x0:0,x1:N*BW,y0:0,y1:(PMAX-PMIN)*K,pMin:PMIN,pMax:PMAX};
const C=new VW.Chart(BARS,LB);
const V={x0:96,x1:826,y0:580,y1:1530}; V.w=V.x1-V.x0; V.h=V.y1-V.y0; V.cx=(V.x0+V.x1)/2; V.cy=(V.y0+V.y1)/2;
const AX=836, CAP_Y=392, VOLH=64, VMAX=5200, LSP=1.7;
let CAM={cx:0,cy:0,s:1};
const SX=x=>V.cx+(x-CAM.cx)*CAM.s, SY=y=>V.cy+(y-CAM.cy)*CAM.s, WY=sy=>CAM.cy+(sy-V.cy)/CAM.s, PY=p=>C.PY(p), X=i=>C.X(i);
// prices in the viewer's format: thousands always grouped (7.746,00 / 7,746.00) except Spanish, where RAE leaves 4 digits ungrouped (7746,00)
const f2=p=>{ const loc=(typeof LANG!=='undefined'&&LANG.locale)||'en-US'; return p.toLocaleString(loc,{minimumFractionDigits:2,maximumFractionDigits:2,useGrouping:loc.startsWith('es')?'min2':'always'}); };
const fmt=v=>(v>=0?'+':'−')+'$'+Math.abs(v).toFixed(2);

let WORDS=[], GROUPS=[], CUES={};
function W(word,nth=1,edge='s'){ let c=0; for (const w of WORDS){ if (w[0].replace(/[^\w']/g,'').toLowerCase()===word.replace(/[^\w']/g,'').toLowerCase()){ if (++c===nth) return edge==='s'?w[1]:w[2]; } } throw new Error('word not found: '+word+' #'+nth); }
let E={};
let LANG={};
function buildTimeline(){
  const c=CUES, F=1e9;
  E.absorb=c.hook0[1]-0.7; E.below1=c.hook1[0]; E.amplify=c.hook1[0]+0.35; E.hookE=c.hook1[1];
  E.map=c.l1[0]; E.l1E=c.l1[1]; E.blue=c.l20[0]; const d=c.l21[1]-c.l21[0]; E.sell=c.l21[0]+0.38*d; E.buy=c.l21[0]+0.72*d;
  // exact sync: the sell/buy marks land on the spoken word itself when lang.json names it
  const at=t=>{ if(!t) return null; const n=t.normalize('NFC'); const w=WORDS.find(x=>x[0].normalize('NFC')===n && x[1]>=c.l2[0]); return w?w[1]:null; };
  if (LANG.cueWords){ const s1=at(LANG.cueWords.sell), b1=at(LANG.cueWords.buy); if(s1!=null) E.sell=s1; if(b1!=null) E.buy=b1; } E.l2E=c.l21[1];
  E.price=F; E.l3E=F; E.white=F; E.flips=F; E.below2=F; E.short=F; E.hedging=F; E.drop=F; E.chart=F; E.vw=F;
  E.rw0=E.hookE+0.1; E.n0=E.rw0+0.5; E.brk=F; E.run0=F; E.run1=F;
  E.logo0=CUES.logo0; E.beat=E.logo0+1.75/LSP; E.dv=CUES.dvv[0]-0.08; E.loop0=CUES.loop0; E.total=E.loop0+0.5;
  Object.assign(E,{hookBuyers:E.below1, div:E.blue, cvdWord:E.map, b0:E.map, b1:E.l1E, flow:E.sell, volwick:E.logo0-0.3});
  S.total=E.total;
}

// ---------- state ----------
function state(t){
  const st={}; const loop=t>=E.loop0, tt=loop?0:t;
  if (tt<E.rw0) st.n=N;
  else if (t<E.n0) st.n=mix(N,3,eio(lin(t,E.rw0,E.n0)));
  else st.n=mix(3,34,lin(t,E.n0,E.l2E+0.4));
  st.hook=tt<E.rw0?1:0;
  st.map = loop?0 : (st.hook?1:0)*(1-seg(t,E.rw0-0.05,E.rw0+0.3)) + (t>=E.rw0?seg(t,E.map-0.1,E.map+0.4):0);
  st.sweep= st.hook?1 : clamp(lin(t,E.map-0.1,E.l1E-0.3),0,1);
  st.line = loop?0 : Math.max(st.hook*(1-seg(t,E.rw0-0.05,E.rw0+0.3)), t>=E.rw0?seg(t,E.white-0.15,E.white+0.25):0);
  st.hiBlue = loop?0 : (st.hook?seg(t,E.absorb-0.1,E.absorb+0.25)*(1-seg(t,E.below1-0.1,E.below1+0.2)):0) + seg(t,E.blue-0.1,E.blue+0.3)*(1-seg(t,E.l2E,E.l2E+0.4));
  st.hiAmber= loop?0 : (st.hook?seg(t,E.amplify-0.1,E.amplify+0.25):0) + seg(t,E.below2-0.1,E.below2+0.3)*(1-seg(t,E.run1,E.run1+0.5));
  st.legB = seg(t,E.blue-0.1,E.blue+0.3); st.legA = seg(t,E.below2-0.1,E.below2+0.3);
  st.tests = loop?0 : (t>=E.rw0?1:0)*(1-seg(t,E.white-0.2,E.white+0.3));
  st.sellPulse= seg(t,E.sell-0.05,E.sell+0.2)*(1-seg(t,E.sell+0.7,E.sell+1.0));
  st.buyPulse = seg(t,E.buy-0.05,E.buy+0.2)*(1-seg(t,E.buy+0.7,E.buy+1.0));
  st.cta = loop?0 : seg(t,E.vw-0.25,E.vw+0.35);
  st.moveOnly = loop?0 : seg(t,E.chart-0.2,E.chart+0.2)*(1-seg(t,E.vw-0.2,E.vw+0.2));
  return st;
}

// ---------- camera ----------
const camAll  ={s:0.76, cx:(X(0)+X(N-1))/2+16, cy:PY(7742.2)};
const camRange={s:1.05, cx:X(22), cy:PY(7749.5)};
const mixCam=(a,b,k)=>({s:Math.exp(mix(Math.log(a.s),Math.log(b.s),k)), cx:mix(a.cx,b.cx,k), cy:mix(a.cy,b.cy,k)});
const camPunch={s:1.4, cx:X(41), cy:PY(7741.5)};
function camera(t){
  if (t>=E.loop0) return camAll;
  let c=mixCam(camPunch,camAll,eio(clamp(lin(t,0.35,1.5),0,1)));
  c=mixCam(c,camRange,seg(t,E.rw0,E.n0+0.2));
  c=mixCam(c,camAll,seg(t,E.run0-0.5,E.run0+0.6));
  return c; }

// ---------- drawings ----------
function panel(){ const g=VW.g; g.save(); g.fillStyle='rgba(10,16,30,0.55)'; VW.roundRect(V.x0-14,V.y0-20,AX+118-(V.x0-14),V.h+40,18); g.fill();
  g.strokeStyle='rgba(120,150,210,0.14)'; g.lineWidth=1.2; g.stroke(); g.restore(); }
function axis(yTag,a){ const g=VW.g; const step=CAM.s>=0.95?2.5:5;
  g.save(); g.globalAlpha=0.85*a; g.font='600 28px VWMono'; g.fillStyle=COL.ink2; g.textAlign='left'; g.textBaseline='middle';
  const pTop=PMIN+(LB.y1-WY(V.y0))/K, pBot=PMIN+(LB.y1-WY(V.y1-VOLH))/K;
  for (let p=Math.ceil(pBot/step)*step; p<=pTop; p+=step){ const y=SY(PY(p)); if (y<V.y0+16||y>V.y1-VOLH-16||Math.abs(y-yTag)<48) continue; g.fillText(f2(p),AX,y); }
  g.restore(); }
function priceTag(p,a){ if (a<=0) return; const g=VW.g, y=clamp(SY(PY(p)),V.y0+26,V.y1-26); g.save(); g.globalAlpha=a;
  g.setLineDash([6,8]); g.strokeStyle=VW.rgba(GOLD,0.5); g.lineWidth=1.5; g.beginPath(); g.moveTo(V.x0,y); g.lineTo(AX-8,y); g.stroke(); g.setLineDash([]);
  g.fillStyle=GOLD; VW.roundRect(AX-10,y-26,132,52,9); g.fill(); g.fillStyle='#120E02'; g.font='700 26px VWMono'; g.textAlign='center'; g.textBaseline='middle'; g.fillText(f2(q(p)),AX+56,y+1); g.restore(); }
function volume(n,a){ const g=VW.g; g.save(); g.globalAlpha=a;
  for (let i=0;i<Math.ceil(n)&&i<N;i++){ const x=SX(X(i)); if (x<V.x0-20||x>V.x1+20) continue; const k=clamp(n-i,0,1), b=BARS[i];
    g.fillStyle=VW.rgba(b.c>=b.o?COL.up:COL.dn,0.26*k); const h=b.v/VMAX*VOLH*eo(k), w=Math.max(2,BW*CAM.s*0.62); g.fillRect(x-w/2,V.y1-h,w,h); } g.restore(); }
function drawCandle(i,k,a){ if (k<=0||a<=0) return; const g=VW.g, b=BARS[i], x=X(i), kk=VW.eoe(k), cl=mix(b.o,b.c,kk), hi=mix(Math.max(b.o,cl),b.h,kk), lo=mix(Math.min(b.o,cl),b.l,kk);
  g.globalAlpha=a*Math.min(1,k*2.5); const col=cl>=b.o?COL.up:COL.dn; g.strokeStyle=col; g.lineWidth=2.4/CAM.s; g.beginPath(); g.moveTo(x,PY(hi)); g.lineTo(x,PY(lo)); g.stroke();
  const y1=PY(Math.max(b.o,cl)), y2=PY(Math.min(b.o,cl)); g.fillStyle=col; g.fillRect(x-BW*0.33,y1,BW*0.66,Math.max(2/CAM.s,y2-y1)); g.globalAlpha=1; }
function candles(n,a){ for (let i=0;i<Math.ceil(n)&&i<N;i++) drawCandle(i,clamp(n-i,0,1),a); }
function heatmap(n,a,sweep,hiB,hiA){ if (a<=0) return; const g=VW.g, cols=Math.ceil((N+30)/5), last=Math.min(cols, Math.ceil((n+30)/5)), vis=Math.ceil(last*sweep);
  for (let c=0;c<vis;c++){ const x0=c*5*BW, w=5*BW-1;
    for (let p=PMIN; p<PMAX; p+=1){ const v=field(p+0.5,c), m=Math.abs(v), col=v>=0?BLUE:AMBER, hl=v>=0?hiB:hiA;
      g.fillStyle=VW.rgba(col,a*(0.05+0.28*m)*(1+0.9*hl)); g.fillRect(x0,PY(p+1),w,K-1); } } }
function signLine(a){ if (a<=0) return; const g=VW.g, y=PY(FLIP); g.save(); g.globalAlpha=a; g.strokeStyle=WHITE; g.lineWidth=2.6/CAM.s; g.setLineDash([10/CAM.s,8/CAM.s]);
  g.shadowColor='rgba(255,255,255,0.7)'; g.shadowBlur=10; g.beginPath(); g.moveTo(-2000,y); g.lineTo(LB.x1+2000,y); g.stroke(); g.restore(); }
function tagAt(txt,col,x,y,a,align='left',size=27){ if (a<=0) return; const g=VW.g; g.save(); g.globalAlpha=a; g.font=`700 ${size}px VWMono`; g.letterSpacing='1px';
  const w=g.measureText(txt).width+24, x0=align==='left'?x:x-w; g.fillStyle='rgba(6,10,20,0.82)'; VW.roundRect(x0,y-22,w,44,9); g.fill();
  g.fillStyle=col; g.textAlign='left'; g.textBaseline='middle'; g.fillText(txt,x0+12,y+1); g.restore(); }
// legend top-left of the viewport: MAP · GAMMA, then the two colours as they are named
function legend(a,aB,aA){ if (a<=0) return; const g=VW.g, x=V.x0+10, y=V.y0+12; g.save(); g.globalAlpha=a;
  g.font='700 26px VWMono'; g.letterSpacing='2px'; const rows=[[LANG.legend[0],COL.ink2,1],[LANG.legend[1],BLUE,aB],[LANG.legend[2],AMBER,aA]];
  let w=0; rows.forEach(r=>{ w=Math.max(w,g.measureText(r[0]).width); }); const nr=1+(aB>0?1:0)+(aA>0?1:0);
  g.fillStyle='rgba(6,10,20,0.85)'; VW.roundRect(x,y,w+70,16+nr*40,10); g.fill(); g.strokeStyle='rgba(140,160,200,0.3)'; g.lineWidth=1.2; g.stroke();
  let r=0; rows.forEach(([txt,col,k],j)=>{ if (j>0&&k<=0) return; g.globalAlpha=a*(j===0?1:k); const yy=y+28+r*40;
    if (j>0){ g.fillStyle=col; g.fillRect(x+16,yy-11,22,22); } g.fillStyle=j===0?COL.ink2:col; g.textAlign='left'; g.textBaseline='middle'; g.fillText(txt,x+(j>0?50:16),yy+1); r++; });
  g.restore(); }
// test markers: ▼ over each range high test, ▲ under each low test, numbered in order
function testMarks(n,a,st){ if (a<=0) return; const g=VW.g;
  TESTS.forEach(([i,s],j)=>{ const k=clamp((n-i-0.6)*3,0,1); if (k<=0) return; const b=BARS[i], x=SX(X(i)), up=s==='h';
    const pulse=up?st.sellPulse:st.buyPulse, y=up?SY(PY(b.h))-16:SY(PY(b.l))+16, sc=1+0.35*pulse;
    g.save(); g.globalAlpha=a*k; g.translate(x,y); g.scale(sc,sc); g.fillStyle=BLUE; g.shadowColor=VW.rgba(BLUE,0.9); g.shadowBlur=8+14*pulse;
    g.beginPath(); if (up){ g.moveTo(-9,-14); g.lineTo(9,-14); g.lineTo(0,0); } else { g.moveTo(-9,14); g.lineTo(9,14); g.lineTo(0,0); } g.fill();
    g.restore(); }); }
function rangeBracket(a){ if (a<=0) return; const g=VW.g, x=SX(X(36))+14, yT=SY(PY(TOP)), yB=SY(PY(FLIP));
  g.save(); g.globalAlpha=a; g.strokeStyle=VW.rgba(WHITE,0.55); g.lineWidth=1.6; g.setLineDash([5,6]);
  g.beginPath(); g.moveTo(SX(X(0))-8,yT); g.lineTo(x,yT); g.stroke(); g.setLineDash([]);
  g.strokeStyle=WHITE; g.lineWidth=2.4; g.beginPath(); g.moveTo(x-10,yT); g.lineTo(x,yT); g.lineTo(x,yB); g.lineTo(x-10,yB); g.stroke(); g.restore();
  tagAt('RANGE 10 PTS · 6 TESTS',WHITE,x,yT-92,a,'right',25); }
function flipLabel(a){ if (a<=0) return; const y=SY(PY(FLIP)); tagAt(LANG.flip+f2(FLIP),WHITE,V.x0+12,y+36,a,'left',26); }
// hypothetical short: entry line, stop zone, box to price, counter
function position(n,a){ if (a<=0||n<EB+0.98) return; const g=VW.g, k=1, p=C.lastPrice(Math.max(n,EB+1)), x0=X(EB)-BW*0.5, x1=X(Math.min(N-1,Math.max(EB+1,n)-0.001))+BW*0.5;
  g.save(); g.globalAlpha=a*k;
  g.fillStyle=VW.rgba(RED,0.13); g.fillRect(x0,PY(STOP),x1-x0+BW,PY(ENTRY)-PY(STOP));
  g.strokeStyle=VW.rgba(RED,0.85); g.lineWidth=2/CAM.s; g.beginPath(); g.moveTo(x0,PY(STOP)); g.lineTo(x1+BW,PY(STOP)); g.stroke();
  if (n>EB+1){ g.fillStyle=VW.rgba(p<=ENTRY?GREEN:RED,0.12); g.fillRect(x0,Math.min(PY(ENTRY),PY(p)),x1-x0,Math.abs(PY(p)-PY(ENTRY))); }
  g.strokeStyle=VW.rgba(GOLD,0.95); g.lineWidth=2/CAM.s; g.setLineDash([8/CAM.s,6/CAM.s]); g.beginPath(); g.moveTo(x0,PY(ENTRY)); g.lineTo(x1+BW,PY(ENTRY)); g.stroke(); g.restore(); }
function pnlHero(n,a){ if (a<=0||n<EB+0.98) return; const g=VW.g, p=n<EB+1?ENTRY:q(C.lastPrice(n)), usd=pnl(p), col=usd>0.004?GREEN:(usd<-0.004?RED:COL.ink);
  const x=V.x0+14, y=V.y1-VOLH-64; g.save(); g.globalAlpha=a;
  g.fillStyle='rgba(6,10,20,0.72)'; VW.roundRect(x-10,y-122,500,214,14); g.fill();
  g.textAlign='left'; g.textBaseline='alphabetic';
  g.font='700 25px VWMono'; g.letterSpacing='1px'; g.fillStyle=COL.ink2; g.fillText('HYPOTHETICAL · SHORT 1 ES @ '+f2(ENTRY),x+4,y-86); g.letterSpacing='0px';
  g.font='700 84px VWMono'; g.fillStyle=col; g.shadowColor=VW.rgba(col,0.55); g.shadowBlur=18; g.fillText(Math.abs(usd)<0.004?'$0.00':fmt(usd),x,y); g.shadowBlur=0;
  g.font='600 25px VWMono'; g.fillStyle=VW.rgba(RED,0.95); g.fillText('STOP '+f2(STOP)+' · RISK '+fmt(pnl(STOP)),x+4,y+40);
  g.fillStyle=COL.ink2; g.fillText('SIMULATED · NOT A DIRECTION CALL',x+4,y+74); g.restore(); }
function measured(a){ if (a<=0) return; const g=VW.g, xA=SX(X(N-1))+BW*CAM.s*1.2, y0=SY(PY(FLIP)), y1=SY(PY(EXIT)), k=eo(a);
  g.save(); g.globalAlpha=a; g.strokeStyle=AMBER; g.lineWidth=3; g.shadowColor=VW.rgba(AMBER,0.8); g.shadowBlur=10;
  g.beginPath(); g.moveTo(xA,y0); g.lineTo(xA,mix(y0,y1,k)); g.stroke();
  g.beginPath(); g.moveTo(xA-9,y1-14); g.lineTo(xA,y1); g.lineTo(xA+9,y1-14); g.globalAlpha=a*clamp((k-0.8)*5,0,1); g.stroke();
  g.setLineDash([6,6]); g.lineWidth=1.6; g.shadowBlur=0; g.globalAlpha=a*0.8; g.beginPath(); g.moveTo(SX(X(EB)),y1); g.lineTo(xA,y1); g.stroke(); g.restore();
  const xl=SX(X(EB))-16, ym=SY(PY(7738.5));
  g.save(); g.globalAlpha=a; g.textAlign='right'; g.textBaseline='alphabetic'; g.shadowColor='rgba(0,0,0,0.95)'; g.shadowBlur=16;
  g.font='700 54px VWMono'; g.fillStyle=AMBER; g.fillText('−17.25 PTS',xl,ym);
  g.font='700 27px VWMono'; g.letterSpacing='2px'; g.fillStyle=WHITE; g.fillText('15 MIN · FROM THE FLIP',xl,ym+40); g.restore(); }
function emerge(txt,col,y,k,below=false){ if (k<=0) return; const g=VW.g, h=70;
  g.save(); g.beginPath(); if (below) g.rect(0,y+4,VW.W,h+20); else g.rect(0,y-h-20,VW.W,h+20); g.clip(); g.globalAlpha=Math.min(1,k*1.4);
  g.textAlign='center'; g.font='700 40px VWSans'; g.fillStyle=col; g.shadowColor='rgba(0,0,0,0.9)'; g.shadowBlur=24;
  if (below){ g.textBaseline='top'; g.fillText(txt,SAFE.cx,y+14-(1-eo(k))*h); } else { g.textBaseline='bottom'; g.fillText(txt,SAFE.cx,y-14+(1-eo(k))*h); }
  g.restore(); }

// captions: word by word, colour on the spoken word; rtl layout for Arabic, tight gap for Japanese
function capL(t){ if (t>E.logo0-0.15) return; const g=VW.g, grp=GROUPS.find(gp=>t>=gp[0][1]-0.12 && t<=gp[gp.length-1][2]+0.28); if (!grp) return;
  const size=LANG.capSize||66, ks=LANG.keySize||76, gap=LANG.capGap!=null?LANG.capGap:20, y=490, cx=SAFE.cx, keys=new Map(LANG.keys.map(([w,c])=>[w.normalize('NFC'),{BLUE,AMBER,WHITE,VW:COL.blue}[c]]));
  const t0=grp[0][1]-0.12, pop=eo(lin(t,t0,t0+0.16)); g.save(); g.textBaseline='alphabetic'; g.textAlign='left'; g.direction=LANG.rtl?'rtl':'ltr';
  const sz=grp.map(w=>keys.has(w[0].normalize('NFC'))?ks:size), wd=grp.map((w,i)=>{ g.font=`700 ${sz[i]}px VWSans`; return g.measureText(w[0]).width; });
  const tot=wd.reduce((a,b)=>a+b,0)+gap*(grp.length-1); let x=LANG.rtl?cx+tot/2:cx-tot/2;
  g.translate(cx,y); g.scale(0.92+0.08*pop,0.92+0.08*pop); g.translate(-cx,-y); g.globalAlpha=pop;
  grp.forEach((w,i)=>{ g.font=`700 ${sz[i]}px VWSans`; g.shadowColor='rgba(0,0,0,0.85)'; g.shadowBlur=24; const kc=keys.get(w[0].normalize('NFC')); g.fillStyle=t>=w[1]?(kc||COL.blue):COL.ink;
    if (LANG.rtl){ x-=wd[i]; g.fillText(w[0],x,y); x-=gap; } else { g.fillText(w[0],x,y); x+=wd[i]+gap; } });
  g.restore(); }

// ---------- render ----------
function render(t){
  const g=VW.g; g.setTransform(1,0,0,1,0,0); g.globalAlpha=1; g.filter='none';
  VW.background(t);
  const st=state(t), tt=t>=E.loop0?0:t, hook=tt<E.rw0;
  CAM=camera(t);
  const p=C.lastPrice(Math.max(1,st.n)), yTag=clamp(SY(PY(p)),V.y0+26,V.y1-26);
  const candleA=(1-0.75*st.cta)*(1-0.25*Math.max(st.hiBlue*(hook?1:0),st.hiAmber*(hook?1:0))), mapK=(1-0.7*st.moveOnly);
  panel(); axis(yTag,1-0.8*st.cta);
  volume(st.n,candleA);
  g.save(); g.beginPath(); g.rect(V.x0,V.y0,V.w,V.h); g.clip(); g.translate(V.cx,V.cy); g.scale(CAM.s,CAM.s); g.translate(-CAM.cx,-CAM.cy);
  heatmap(st.n, st.map*mapK, st.sweep, st.hiBlue, st.hiAmber);
  signLine(st.line*(1-0.4*st.moveOnly)); if (hook){ const fl=Math.exp(-Math.pow((t-0.15)/0.28,2)); if (fl>0.02){ g.save(); g.globalAlpha=fl; g.fillStyle=VW.rgba(WHITE,0.35); g.fillRect(-2000,PY(FLIP)-10/CAM.s,LB.x1+4000,20/CAM.s); g.restore(); } }
  const trade=(hook||t>=E.loop0)?0:seg(t,E.brk-0.05,E.brk+0.25)*(1-seg(t,E.vw-0.4,E.vw));
  position(st.n,trade);
  candles(st.n,candleA);
  g.restore();
  priceTag(p,1-st.cta);
  testMarks(st.n,st.tests,st);
  flipLabel(st.line*(1-st.cta)*(hook?1:seg(t,E.white,E.white+0.3)));
  pnlHero(st.n,trade);
  legend(st.map*(1-st.cta)*(hook?0:1), st.legB, st.legA);
  if (t<E.loop0){ const yL=SY(PY(FLIP)); emerge('THE CHART SHOWS THE MOVE.',COL.ink,yL,seg(t,E.vw-0.05,E.vw+0.45)); emerge('VOLWICK SHOWS THE GROUND UNDER IT.',AMBER,yL,seg(t,E.vw+0.15,E.vw+0.65),true); }
  VW.vignette(); VW.topBand(380);
  const endK=seg(t,E.logo0,E.logo0+0.5)*(1-seg(t,E.loop0,E.total-0.15));
  VW.logoTL(1-endK,'ES',52,30,true);
  const hOut=1-seg(tt,E.hookE-0.05,E.hookE+0.25);
  { const a1=eo(lin(tt,-0.3,0))*hOut, a2=eo(lin(tt,E.below1-0.05,E.below1+0.15))*hOut; g.save(); g.textAlign='center'; g.textBaseline='middle'; g.shadowColor='rgba(0,0,0,0.95)'; g.shadowBlur=30;
    const pop=k=>0.9+0.1*eo(clamp(k,0,1));
    g.font='700 58px VWSans'; if (a1>0){ g.save(); g.globalAlpha=a1; g.translate(SAFE.cx,440); g.scale(pop(tt/0.25),pop(tt/0.25)); g.fillStyle=BLUE; g.direction=LANG.rtl?'rtl':'ltr'; g.font=`700 ${LANG.hookSize||58}px VWSans`; g.fillText(LANG.hook[0],0,0); g.restore(); }
    if (a2>0){ g.save(); g.globalAlpha=a2; const k2=(tt-E.below1+0.05)/0.25; g.translate(SAFE.cx,502); g.scale(pop(k2),pop(k2)); g.fillStyle=AMBER; g.direction=LANG.rtl?'rtl':'ltr'; g.font=`700 ${LANG.hookSize||58}px VWSans`; g.fillText(LANG.hook[1],0,0); g.restore(); } g.restore(); }
  capL(t);
  if (t>E.logo0){ const y=SY(PY(FLIP)), pts=[]; for (let i=0;i<N;i++) pts.push([mix(V.x0,V.x1,i/(N-1)),y]);
    VW.logoForm((t-E.logo0)*LSP, pts, {fadeOut:seg(t,E.loop0,E.total-0.15), noUrl:true, dy:-20, tagY:1318, tagSize:LANG.tagSize||32, tagSpacing:LANG.tagSpacing!=null?LANG.tagSpacing:5, tagline:LANG.tagline, tagWhole:LANG.tagWhole, tagDir:LANG.rtl?'rtl':'ltr'});
    const out=1-seg(t,E.loop0,E.total-0.15), k=eo(lin(t,E.dv,E.dv+0.3))*out;
    if (k>0){ g.save(); g.globalAlpha=k; g.textAlign='center'; g.textBaseline='middle'; g.font='700 44px VWMono'; g.letterSpacing='5px';
      g.fillStyle=COL.blue; g.shadowColor='rgba(90,140,255,0.8)'; g.shadowBlur=20; g.direction=LANG.rtl?'rtl':'ltr'; g.fillText(LANG.discover,543,1410+(1-k)*10); g.restore(); }
    const kd=eo(lin(t,E.dv+0.3,E.dv+0.7))*out;
    if (kd>0){ g.save(); g.globalAlpha=kd; g.textAlign='center'; g.textBaseline='middle'; g.font='600 29px VWMono'; g.fillStyle=COL.ink2; g.direction=LANG.rtl?'rtl':'ltr'; g.fillText(LANG.disc,540,1496); g.restore(); } }
  VW.guides();
}
window.render=render;
window.READY=(async()=>{
  const qs=new URLSearchParams(location.search), d=qs.get('d')||'.';
  WORDS=await (await fetch(d+'/words.json')).json();
  CUES=(await (await fetch(d+'/cues.json')).json()).cues;
  LANG=await (await fetch(d+'/lang.json')).json();
  const CM=LANG.capMap||{}; GROUPS=VW.buildGroups(WORDS.filter(w=>w[1]>CUES.hook1[1]+0.2).map(w=>CM[w[0]]!=null?[CM[w[0]],w[1],w[2]]:w),LANG.capWords||3,LANG.capChars||16,{weakEnd:LANG.weakEnd,weakStart:LANG.weakStart,glue:LANG.glue});
  buildTimeline(); await VW.loadFonts();
  for (const f of ['700 40px VWSans','600 40px VWSans','700 40px VWMono','600 40px VWMono']) await document.fonts.load(f,'ابت漢字かなカナकखगहिंदी');
  await VW.loadBrand(); render(0);
  return {...window.DATA_CHECK, total:S.total, events:E};
})();
