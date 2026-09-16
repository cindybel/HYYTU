/* Canonical procedural catalogue models: used by shelves, wardrobe and 3D inspection. */
window.ItemModels={create(item){
 const group=new THREE.Group();group.name=item.label;group.userData.itemId=item.id;
 const siblings=shopItems.filter(i=>i.type===item.type&&i.category===item.category),rank=Math.max(0,siblings.findIndex(i=>i.id===item.id)),tier=rank+1;
 const shell=new THREE.MeshStandardMaterial({color:0x36434e,roughness:.52,metalness:.25}),metal=new THREE.MeshStandardMaterial({color:0xaab5b6,roughness:.3,metalness:.8}),black=new THREE.MeshStandardMaterial({color:0x151d23,roughness:.86}),cloth=new THREE.MeshStandardMaterial({color:0x53626c,roughness:1}),glass=new THREE.MeshStandardMaterial({color:0x63a5bb,roughness:.18,metalness:.5});
 const box=(w,h,d,x,y,z,m=shell)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);group.add(o);return o;};
 const cyl=(r,h,x,y,z,m=metal,n=24)=>{const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,n),m);o.position.set(x,y,z);group.add(o);return o;};
 const ring=(r,t,x,y,z,m=black)=>{const o=new THREE.Mesh(new THREE.TorusGeometry(r,t,10,36),m);o.position.set(x,y,z);group.add(o);return o;};
 const rod=(a,b,r=.025,m=metal)=>{const f=new THREE.Vector3(...a),t=new THREE.Vector3(...b),o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,f.distanceTo(t),8),m);o.position.copy(f).add(t).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),t.sub(f).normalize());group.add(o);};
 if(item.category==='vjloop'){
  // A digital collection cover, not a claim that a physical box is required.
  box(.75,1,.12,0,.5,0,black);const c=document.createElement('canvas');c.width=c.height=256;const d=c.getContext('2d');d.fillStyle='#102029';d.fillRect(0,0,256,256);for(let j=0;j<10;j++){d.strokeStyle=j%2?'#c5a16c':'#65b5c3';d.beginPath();d.ellipse(128,110,20+j*9,15+j*(3+rank%5),(rank%13)*.15,0,Math.PI*2);d.stroke();}d.fillStyle='#f1e8d4';d.font='16px Arial';d.fillText(item.label,10,232,235);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;box(.71,.94,.008,0,.5,.066,new THREE.MeshBasicMaterial({map:t}));
 }else if(item.category==='housing'){
  box(1.6+rank*.08,.08,1.1,0,.04,0,metal);box(1.5,.7,.06,0,.42,-.48,cloth);box(.06,.7,1,-.72,.42,0,cloth);for(let j=0;j<Math.min(5,tier);j++){box(.18,.38,.17,-.5+j*.23,.28,.2,shell);box(.14,.04,.2,-.5+j*.23,.5,.2,metal);}box(.45,.35,.25,.35,.25,-.2,black);for(let j=0;j<1+rank%3;j++)box(.25,.28,.02,-.4+j*.35,.53,-.43,glass);
 }else if(item.category==='clothing'){
  const id=item.id.replace('clothing-',''),slot=WEAR_SLOTS[id];
  if(slot==='headphones'){ring(.34,.045,0,.55,0,metal);for(const x of [-.34,.34]){const ear=cyl(id.endsWith('pro')?.17:.13,.13,x,.45,0,black);ear.rotation.z=Math.PI/2;}}
  else if(slot==='headwear'){const dome=new THREE.Mesh(new THREE.SphereGeometry(.33,24,12,0,Math.PI*2,0,Math.PI/2),cloth);dome.position.y=.1;group.add(dome);cyl(.335,.08,0,.1,0,cloth);if(id==='cap-low'){const visor=box(.5,.04,.33,0,.13,.29,black);visor.rotation.x=.1;}else for(let j=0;j<18;j++)rod([Math.cos(j*Math.PI/9)*.33,.1,Math.sin(j*Math.PI/9)*.33],[Math.cos(j*Math.PI/9)*.3,.24,Math.sin(j*Math.PI/9)*.3],.007,metal);}
  else if(slot==='shoes'){for(const x of [-.24,.24]){box(.34,.18,.7,x,.14,.08,cloth);box(.36,id.endsWith('magenta')?.12:.07,.73,x,.04,.08,metal);box(.3,.2,.27,x,.29,-.12,cloth);for(let j=0;j<4;j++)box(.23,.015,.025,x,.245,-.01+j*.065,id.endsWith('cyan')?glass:metal);}}
  else if(slot==='pants'){box(.64,.19,.18,0,.94,0,cloth);for(const x of [-.18,.18]){box(.28,.83,.18,x,.48,0,cloth);box(.21,id==='pants-cargo'?.24:.14,.065,x,.61,.12,black);}}
  else if(slot==='hands'){for(const x of [-.22,.22]){box(.24,.25,.075,x,.2,0,cloth);for(let j=0;j<4;j++)box(.043,.18-j*.013,.07,x-.085+j*.055,.4,0,cloth);box(.08,.17,.07,x+.15,.24,0,cloth).rotation.z=-.4;}}
  else if(slot==='face'){box(.62,.25,.16,0,.3,0,cloth);for(const x of [-.35,.35])ring(.12,.012,x,.3,0,black);for(let j=0;j<3;j++)box(.52,.018,.012,0,.24+j*.055,.09,glass);}
  else if(slot==='badge'){cyl(.25,.06,0,.27,0,metal).rotation.x=Math.PI/2;ring(.16,.022,0,.27,.045,glass);}
  else{
   const long=id==='coat-tour',vest=id==='vest-led',hood=id==='hoodie-vj';box(.65,long?1.05:.68,.2,0,long?.6:.8,0,cloth);for(const side of [-1,1]){if(!vest)box(.22,long?.83:.65,.2,side*.45,.74,0,cloth).rotation.z=side*.2;box(.21,.16,.04,side*.18,.67,.13,black);}rod([-.4,1.3,0],[0,1.5,0]);rod([0,1.5,0],[.4,1.3,0]);ring(.07,.012,0,1.56,0,metal);if(hood){const o=new THREE.Mesh(new THREE.SphereGeometry(.25,20,12),cloth);o.scale.set(1,1,.6);o.position.set(0,1.22,-.06);group.add(o);}if(['jacket-reflective','vest-led','full-fit-pro'].includes(id)){for(const x of [-.22,.22])box(.045,.48,.025,x,.88,.12,id==='vest-led'?glass:metal);}box(.018,.67,.015,0,.8,.115,metal);if(id==='full-fit-pro')for(const x of [-.18,.18])box(.26,.45,.18,x,.08,0,cloth);
  }
 }else if(item.type==='projector'){
  const w=.9+rank*.09,h=.25+rank*.035;box(w,h,.7+rank*.04,0,h/2,0);const lens=cyl(rank>2?.16:.11,.12,w*.26,h*.58,.4,black);lens.rotation.x=Math.PI/2;const optic=cyl(rank>2?.125:.08,.014,w*.26,h*.58,.47,glass);optic.rotation.x=Math.PI/2;for(let j=0;j<5+tier;j++)box(.02,h*.5,.022,-w*.38+j*.042,h*.5,.36,black);for(const x of [-w*.36,w*.36])for(const z of [-.22,.22])cyl(.04,.06,x,-.015,z,black);if(rank>2)rod([-.25,h+.02,0],[.25,h+.02,0],.035);
 }else if(item.type==='computer'){
  if(rank<2){box(.9,.045,.6,0,.03,0,metal);box(.85,.52,.04,0,.31,-.27,black);box(.77,.44,.012,0,.31,-.24,glass);for(let j=0;j<24;j++)box(.05,.012,.038,-.35+j%8*.1,.06,-.12+Math.floor(j/8)*.065,black);}
  else{box(.45+rank*.04,1,.7,0,.5,0);for(let j=0;j<rank-1;j++){const fan=cyl(.12,.02,0,.22+j*.27,.36,black);fan.rotation.x=Math.PI/2;ring(.1,.012,0,.22+j*.27,.38,metal);}for(let j=0;j<rank;j++)box(.08,.025,.015,-.16+j*.07,.94,.36,metal);}
 }else if(item.type==='gpu'){box(1,.12,.4,0,.1,0,black);for(let j=0;j<2+rank;j++){cyl(.12,.04,-.3+j*.22,.18,0,metal);for(let k=0;k<5;k++)box(.15,.015,.02,-.3+j*.22,.21,0,black).rotation.y=k*Math.PI/5;}box(.7,.05,.02,0,.04,.21,metal);}
 else if(item.type==='cable'){for(let j=0;j<2+rank;j++){ring(.3+j*.012,.018,0,.33,j*.045,black);}for(const x of [-.4,.4]){rod([x*.5,.3,0],[x,.12,.16],.017,black);box(rank>2?.14:.1,.075,.13,x,.1,.2,metal);}if(rank>2)box(.22,.12,.3,0,.1,.28);}
 else if(item.type==='adapter'){box(.35+rank*.18,.13,.28,0,.12,0);for(let j=0;j<tier;j++)box(.065,.045,.035,-rank*.07+j*.14,.12,.16,metal);rod([0,.12,-.14],[0,.12,-.4],.025,black);box(.12,.07,.12,0,.12,-.46,metal);}
 else if(item.type==='router'||item.type==='console'){const console=item.type==='console';box(.9+rank*.12,.16,.5,0,.1,0);for(let j=0;j<(console?8:4)+rank*3;j++){const x=-.35+(j%8)*.1,z=-.12+Math.floor(j/8)*.15;if(console)cyl(.024,.035,x,.2,z,metal);else box(.05,.025,.018,x,.11,.26,metal);}if(!console)for(let j=0;j<tier;j++)rod([-.3+j*.3,.18,-.2],[-.3+j*.3,.65,-.28],.018,black);}
 else if(item.type==='screen'){box(1.1,.72,.035,0,.58,0,metal);box(1.04,.66,.015,0,.58,.028,new THREE.MeshStandardMaterial({color:0xd9dfda,roughness:.94}));for(const x of [-.48,.48])rod([x,0,0],[x,.92,0]);if(rank>0)for(const x of [-.48,.48])rod([x,0,-.2],[x,0,.25]);if(rank>1)box(1.2,.055,.08,0,.97,0,black);}
 else if(item.type==='bag'){box(.62+rank*.12,.55+rank*.12,.4,0,.35,0,cloth);ring(.16,.026,0,.7+rank*.1,0,black);for(const x of [-.2,.2])box(.035,.5,.025,x,.37,.215,metal);if(rank>0)box(.36,.24,.08,0,.32,.25,black);if(rank>1)for(const x of [-.29,.29])cyl(.06,.04,x,.03,0,black);}
 else{box(.65+rank*.08,.16,.5,0,.12,0,black);for(let j=0;j<tier+2;j++){box(.05,.13,.24,-.24+j*.1,.25,0,metal);cyl(.027,.08,-.24+j*.1,.36,0,glass);}}
 group.userData.modelKind=item.category+':'+item.type;return group;
}};
