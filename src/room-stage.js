/* Stage dressing uses the actual mixed programme, never the preview. */
window.VJRoom = (() => {
 const source=document.createElement('canvas');source.width=960;source.height=540;
 function crowdMood(){
  const state=document.body.dataset.crowdState||'';
  if(state.includes('en-feu'))return 1;
  if(state.includes('tres-engage'))return .82;
  if(state.includes('accroche'))return .62;
  if(state.includes('en-ecoute'))return .42;
  if(state.includes('distant'))return .2;
  if(state.includes('decroche'))return .08;
  return .45;
 }
 function draw(canvas,{time=0,level=.5,still=false,playing=false}={}){
  source.getContext('2d').drawImage(canvas,0,0,960,540);
  const c=canvas.getContext('2d'),t=still?0:time,pulse=playing&&!still?(1+Math.sin(t*Math.PI*4))*.5:0,crowd=crowdMood();
  c.fillStyle='#050916';c.fillRect(0,0,960,540);
  const haze=c.createRadialGradient(480,220,30,480,220,520);haze.addColorStop(0,`rgba(53,94,135,${.2+level*.22})`);haze.addColorStop(1,'#050916');c.fillStyle=haze;c.fillRect(0,0,960,540);
  // Receding architecture, truss, and floor establish a small venue.
  c.strokeStyle='#233248';c.lineWidth=2;
  for(const x of [32,112,848,928]){c.beginPath();c.moveTo(x,0);c.lineTo(x,440);c.stroke();}
  c.fillStyle='#111c2a';c.fillRect(80,35,800,15);c.strokeStyle='#405163';
  for(let x=80;x<870;x+=32){c.beginPath();c.moveTo(x,35);c.lineTo(x+16,50);c.lineTo(x+32,35);c.stroke();}
  c.fillStyle='#101829';c.beginPath();c.moveTo(150,389);c.lineTo(810,389);c.lineTo(960,540);c.lineTo(0,540);c.fill();
  for(let x=-300;x<1400;x+=140){c.strokeStyle='#223048';c.beginPath();c.moveTo(480+(x-480)*.55,389);c.lineTo(x,540);c.stroke();}
  // Gentle beams: no flashes; reduced motion freezes their position.
  [130,270,690,830].forEach((x,i)=>{const shift=Math.sin(t*.35+i)*80;const g=c.createLinearGradient(x,58,x+shift,455);g.addColorStop(0,`rgba(${i%2?'203,106,255':'74,232,218'},${level*(.16+pulse*.035)})`);g.addColorStop(1,'rgba(75,150,190,0)');c.fillStyle=g;c.beginPath();c.moveTo(x-5,58);c.lineTo(x+5,58);c.lineTo(x+shift+95,460);c.lineTo(x+shift-95,460);c.fill();c.fillStyle='#acb8c9';c.fillRect(x-10,49,20,12);});
  c.shadowColor='#58d5dc';c.shadowBlur=10+level*18;c.fillStyle='#344457';c.fillRect(174,77,612,307);c.shadowBlur=0;
  c.drawImage(source,180,83,600,295);
  c.globalAlpha=level*.13;c.save();c.translate(180,397);c.scale(1,-.3);c.drawImage(source,0,-295,600,295);c.restore();c.globalAlpha=1;
  for(const x of [112,805]){c.fillStyle='#03060b';c.fillRect(x,246,44,139);for(const y of [275,330]){c.strokeStyle='#263241';c.beginPath();c.arc(x+22,y,16,0,Math.PI*2);c.stroke();}}
  c.fillStyle='#050812';c.fillRect(352,378,256,48);c.strokeStyle='#466477';c.strokeRect(352,378,256,48);c.fillStyle='#6ee6d5';c.fillRect(367,389,50,3);c.fillRect(539,389,50,3);c.fillStyle='#152032';c.fillRect(466,359,36,21);
  c.fillStyle='#05070e';c.beginPath();c.arc(485,337,12,0,Math.PI*2);c.fill();c.fillRect(473,349,24,29);
  // Crowd movement now reflects actual live engagement instead of looping at a fixed amplitude.
  for(let i=0;i<23;i++){
    const x=18+i*43,bob=still?0:Math.sin(t*(1.15+crowd*.9)+i)*level*(2+crowd*10),y=477+(i%3)*18+bob;
    c.fillStyle=i%2?'#0a101b':'#080c16';c.beginPath();c.arc(x,y,10+i%3,0,Math.PI*2);c.fill();c.beginPath();c.ellipse(x,y+32,19,29,0,0,Math.PI*2);c.fill();
    c.strokeStyle=crowd>.72&&i%4===0?'#496078':'#273247';c.lineWidth=2;c.beginPath();c.arc(x,y,11,Math.PI,Math.PI*1.7);c.stroke();
    if(crowd>.68&&i%3===0){const armLift=18+crowd*20;c.beginPath();c.moveTo(x-10,y+23);c.lineTo(x-18,y+23-armLift);c.moveTo(x+10,y+23);c.lineTo(x+18,y+23-armLift*(i%2?.75:1));c.stroke();}
  }
  c.fillStyle='#a6c3d5';c.font='11px monospace';c.fillText('LE SOUS-SOL  /  SESSION VJ',30,25);
 }
 return {draw};
})();
