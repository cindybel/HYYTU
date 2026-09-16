/* Workshop and home art direction. Floor props stay inside existing furniture footprints. */
window.StudioDecor=(()=>{
 const group=new THREE.Group();group.name='Studio art direction';group.visible=false;scene.add(group);
 const staticProps=new THREE.Group();group.add(staticProps);const accents=new THREE.Group();group.add(accents);
 const mat=(c,r=.8,m=0)=>new THREE.MeshStandardMaterial({color:new THREE.Color(c).convertSRGBToLinear(),roughness:r,metalness:m});
 const ink=mat('#26303a',.62,.3),steel=mat('#75808a',.42,.7),brass=mat('#a58651',.38,.6),ceramic=mat('#cbbaa0'),clay=mat('#826855'),leaf=mat('#536b50'),leafLight=mat('#728363'),linen=mat('#9b9c88'),dark=mat('#121a21');
 const wood=mat('#b4a18a',.68),felt=mat('#31494f',.95);
 const grain=document.createElement('canvas');grain.width=grain.height=512;const q=grain.getContext('2d');q.fillStyle='#b1a08b';q.fillRect(0,0,512,512);
 for(let i=0;i<360;i++){const y=(i*61)%512;q.strokeStyle=i%3?'rgba(65,44,23,.085)':'rgba(244,222,186,.14)';q.lineWidth=i%4?1:2;q.beginPath();q.moveTo(0,y);q.bezierCurveTo(130,y+Math.sin(i)*12,380,y-Math.sin(i*.3)*10,512,y+3);q.stroke();}
 const grainMap=new THREE.CanvasTexture(grain);grainMap.encoding=THREE.sRGBEncoding;grainMap.wrapS=grainMap.wrapT=THREE.RepeatWrapping;wood.map=grainMap;const grainBump=grainMap.clone();grainBump.encoding=THREE.LinearEncoding;grainBump.needsUpdate=true;wood.bumpMap=grainBump;wood.bumpScale=.003;
 const weaveCanvas=document.createElement('canvas');weaveCanvas.width=weaveCanvas.height=128;const wq=weaveCanvas.getContext('2d');wq.fillStyle='#888';wq.fillRect(0,0,128,128);for(let i=0;i<128;i+=3){wq.fillStyle=i%2?'#8c8c8c':'#848484';wq.fillRect(i,0,1,128);wq.fillRect(0,i,128,1);}
 const weave=new THREE.CanvasTexture(weaveCanvas);weave.wrapS=weave.wrapT=THREE.RepeatWrapping;weave.repeat.set(6,6);linen.bumpMap=felt.bumpMap=weave;linen.bumpScale=felt.bumpScale=.003;
 const add=(parent,geometry,m,x,y,z)=>{const o=new THREE.Mesh(geometry,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;};
 const box=(parent,w,h,d,x,y,z,m=ink,r=.02)=>add(parent,GearModels.rounded(w,h,d,r),m,x,y,z);
 const cyl=(parent,top,bottom,h,x,y,z,m=steel)=>add(parent,new THREE.CylinderGeometry(top,bottom,h,24),m,x,y,z);
 const tube=(parent,pts,r=.01,m=steel)=>add(parent,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(...p))),24,r,7,false),m,0,0,0);
 function textPlate(parent,text,w,h,x,y,z,rotation=0){
  const c=document.createElement('canvas');c.width=768;c.height=192;const d=c.getContext('2d');d.fillStyle='#202d34';d.fillRect(0,0,768,192);d.fillStyle='#d6c09b';d.font='600 54px Arial';d.textAlign='center';d.fillText(text,384,117,715);
  const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;const m=new THREE.MeshBasicMaterial({map:t});m.userData.decorOwned=true;const o=add(parent,new THREE.PlaneGeometry(w,h),m,x,y,z);o.rotation.y=rotation;return o;
 }
 function plant(parent,x,y,z,scale=.7){
  const p=new THREE.Group();p.position.set(x,y,z);p.scale.setScalar(scale);parent.add(p);
  cyl(p,.19,.145,.27,0,.135,0,clay);cyl(p,.172,.172,.012,0,.272,0,dark);
  for(let i=0;i<9;i++){const a=i*2.4,h=.42+(i%4)*.10,rx=Math.sin(a)*(.2+(i%2)*.07),rz=Math.cos(a)*.22;tube(p,[[0,.27,0],[rx*.4,.39,rz*.4],[rx,h,rz]],.008,leaf);
   const s=new THREE.Shape();s.moveTo(0,0);s.quadraticCurveTo(-.17,.16,0,.34);s.quadraticCurveTo(.17,.16,0,0);const geo=new THREE.ShapeGeometry(s,10);const pos=geo.attributes.position;for(let n=0;n<pos.count;n++)pos.setZ(n,Math.sin(pos.getY(n)*9)*.035);geo.computeVertexNormals();
   const lm=(i%2?leaf:leafLight).clone();lm.side=THREE.DoubleSide;lm.userData.decorOwned=true;const l=add(p,geo,lm,rx,h-.12,rz);l.rotation.set(-.45,a,.45*Math.sin(a));}
  return p;
 }
 function vase(parent,x,y,z,scale=1){
  const points=[[.055,0],[.11,.07],[.12,.17],[.07,.23],[.045,.29],[.048,.31]].map(([r,y])=>new THREE.Vector2(r*scale,y*scale));add(parent,new THREE.LatheGeometry(points,32),ceramic,x,y,z);
  for(let i=0;i<3;i++){tube(parent,[[x,y+.19*scale,z],[x+(i-1)*.035,y+.47*scale,z+.02],[x+(i-1)*.085,y+.61*scale,z]],.003,brass);}
 }
 function cushion(parent,x,y,z,width=.42,material=linen){const p=box(parent,width*1.45,.39,.14,x,y,z,material,.055);p.rotation.z=.11;return p;}
 function poster(parent,x,y,z,title,variant=0,width=1.2,rot=0){
  const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=rot;parent.add(g);const h=width*1.36;
  box(g,width+.07,h+.07,.045,0,0,0,ink);box(g,width+.018,h+.018,.013,0,0,.024,ceramic);
  const cv=document.createElement('canvas');cv.width=640;cv.height=870;const d=cv.getContext('2d');d.fillStyle=variant?'#e2d5b9':'#15262d';d.fillRect(0,0,640,870);
  d.fillStyle=variant?'#34484a':'#bfa479';d.font='20px Arial';d.fillText('DM / VISUAL LAB',46,57);d.fillText(variant?'STUDY 02':'STUDY 01',470,57);
  d.save();d.translate(320,405);for(let j=0;j<32;j++){d.strokeStyle=variant?(j%3?'#8f6850':'#3b7779'):(j%4?'#a1b2a6':'#cea765');d.lineWidth=j%5?1.6:3;d.beginPath();d.ellipse(0,0,55+j*5.9,35+j*6.5,variant?j*.026:j*.055,0,Math.PI*2);d.stroke();}d.restore();
  d.fillStyle=variant?'#273b40':'#e2d4b3';d.font='bold 47px Arial';d.fillText(title,44,748,556);d.font='18px Arial';d.fillText('MOUVEMENT · LUMIÈRE · ESPACE',45,795);
  const t=new THREE.CanvasTexture(cv);t.encoding=THREE.sRGBEncoding;const m=new THREE.MeshBasicMaterial({map:t});m.userData.decorOwned=true;add(g,new THREE.PlaneGeometry(width-.035,h-.035),m,0,0,.033);
 }
 let built=false,homeKey='',equipmentKey='',lastHour=-1,practical=null,environment=null,environmentActive=false;
 const previousEnvironment=scene.environment;
 function build(){
  built=true;
  const room=new THREE.Scene();room.add(new THREE.Mesh(new THREE.BoxGeometry(12,12,12),new THREE.MeshBasicMaterial({color:0x202833,side:THREE.BackSide})));
  for(const [x,y,z,c] of [[-4,3,2,0x868071],[3,4,-2,0x82909e]]){const p=new THREE.Mesh(new THREE.PlaneGeometry(5,4),new THREE.MeshBasicMaterial({color:c}));p.position.set(x,y,z);p.lookAt(0,0,0);room.add(p);}
  const pmrem=new THREE.PMREMGenerator(renderer);environment=pmrem.fromScene(room,.15);ProductStage.dispose(room);pmrem.dispose();
  // Thin wooden worktop and slender steel legs reuse the desk collision footprint.
  if(deskStation){
   for(const mesh of deskStation.children){const d=mesh.geometry?.parameters;if(!d)continue;
    if(d.width===4.45){mesh.geometry.dispose();mesh.geometry=GearModels.rounded(4.45,.09,1.65,.03);mesh.position.y=.875;mesh.material=wood;}
    if(d.width===.22&&d.height===.82){mesh.geometry.dispose();mesh.geometry=GearModels.rounded(.07,.68,.07,.012);mesh.position.y=.50;mesh.material=ink;}
    if(d.width===.82||d.width===.11)mesh.visible=false;
    if(d.width===.72&&mesh.userData.action==='connect-projector'){mesh.geometry.dispose();mesh.geometry=GearModels.rounded(.28,.018,.18,.015);mesh.position.set(1.12,.94,.18);mesh.material.color.setHex(0x4c8186);}
   }
   box(deskStation,3.84,.06,.055,0,.32,-.59,ink);box(deskStation,3.84,.06,.055,0,.81,-.59,ink);
   box(deskStation,1.50,.03,.48,.35,.94,-.01,felt,.02).name='Legacy desk mat';
  }
  // Slatted acoustic wall behind the workstation; clear of the preparation bench and shelves.
  box(staticProps,3.45,2.10,.07,.25,2.42,4.33,dark);
  for(let i=0;i<28;i++)box(staticProps,.052,2.10,.045,-1.39+i*.122,2.42,4.39,i%4?wood:ink,.005);
  poster(staticProps,.28,2.43,4.455,'AFTER HOURS',0,.92);
  for(const x of [-1.36,1.84]){box(staticProps,.04,1.90,.024,x,2.42,4.444,brass,.005);}
  // Tools on the existing pegboard. Everything remains above the bench.
  const legacyWall=new THREE.Group();legacyWall.name='Legacy wall cables';group.add(legacyWall);
  for(let i=0;i<3;i++){const coil=new THREE.Mesh(new THREE.TorusGeometry(.135+i*.015,.012,8,32),dark);coil.position.set(-4.44+i*.41,2.18,4.44);legacyWall.add(coil);tube(legacyWall,[[-4.44+i*.41,2.3,4.45],[-4.44+i*.41,2.35,4.43]],.01,steel);}
  for(let i=0;i<3;i++){cyl(staticProps,.021,.021,.23,-3.24+i*.16,1.86,4.43,i%2?brass:ink);cyl(staticProps,.009,.009,.16,-3.24+i*.16,2.03,4.43,steel);}
  textPlate(staticProps,'PRÉPARER / TESTER',1.25,.16,-3.55,2.58,4.43);
  box(staticProps,2.60,.028,.16,-3.55,1.46,4.46,ink);
  const strip=new THREE.MeshBasicMaterial({color:0xffdda3});box(staticProps,2.40,.012,.025,-3.55,1.43,4.51,strip);
  practical=new THREE.PointLight(0xffcf91,.75,4);practical.position.set(-3.55,1.6,4.85);group.add(practical);
  // A cable tray and relaxed cable routing remain under the desk.
  box(staticProps,1.8,.10,.20,.25,.71,6.86,ink);for(let i=0;i<6;i++)box(staticProps,.17,.005,.14,-.5+i*.30,.765,6.86,dark);
  tube(group,[[.75,.96,7.05],[.80,.97,6.53],[.78,.72,6.51],[.60,.59,6.76],[.28,.65,6.79]],.016,dark).name='Legacy desk cable';
  const legacyDesk=new THREE.Group();legacyDesk.name='Legacy desk props';group.add(legacyDesk);
  // Desk lamp, stationery and monitoring speakers.
  cyl(legacyDesk,.11,.13,.025,-1.75,.94,7.05,ink);tube(legacyDesk,[[-1.75,.96,7.05],[-1.75,1.42,7.05],[-1.52,1.62,7.09]],.022,brass);
  const shade=cyl(legacyDesk,.065,.14,.13,-1.49,1.60,7.10,ink);shade.rotation.z=-.4;cyl(legacyDesk,.115,.115,.007,-1.47,1.535,7.10,strip);
  const legacySpeakers=new THREE.Group();legacySpeakers.name='Legacy decorative speakers';group.add(legacySpeakers);
  for(const x of [-1.12,1.55]){box(legacySpeakers,.22,.37,.22,x,1.115,6.90,ink,.025);for(const [y,r] of [[1.065,.067],[1.205,.029]]){const cone=cyl(legacySpeakers,r,r,.012,x,y,7.018,dark);cone.rotation.x=Math.PI/2;const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.004,6,30),steel);ring.position.set(x,y,7.026);legacySpeakers.add(ring);}}
  box(legacyDesk,.24,.018,.33,1.80,.94,7.71,linen,.01);box(legacyDesk,.19,.002,.27,1.80,.951,7.71,ceramic,.004);tube(legacyDesk,[[1.69,.961,7.75],[1.82,.961,7.67]],.005,brass);
  plant(staticProps,-2.55,.95,5.06,.45);poster(staticProps,-6.535,2.50,7.14,'NIGHT / SHIFT',1,.8,Math.PI/2);
  // Smaller wall signs keep the workshop readable without floating billboards.
  for(const mesh of StudioSet.group.children){const p=mesh.geometry?.parameters;if(mesh.isMesh&&p?.width===2.2&&Math.abs(mesh.position.x+3.55)<.01)mesh.visible=false;}
  GearModels.consolidate(staticProps);
 }
 function disposeAccents(){accents.traverse(o=>{o.geometry?.dispose();if(o.material?.userData.decorOwned){o.material.map?.dispose();o.material.dispose();}});accents.clear();}
 function refreshHome(){
  const home=StudioWorld.visitingHome?.label||profile.housing.type;if(home===homeKey)return;homeKey=home;lastHour=-1;disposeAccents();
  const layout=scene.getObjectByName('Rental furnishing layout');if(!layout)return;
  // Accent props are attached to existing furniture, so circulation bounds do not grow.
  for(const furniture of layout.children){const x=furniture.position.x,z=furniture.position.z;
   if(furniture.name==='sofa'){cushion(accents,x-.68,.88,z+.20,.30,linen);cushion(accents,x+.69,.86,z+.20,.29,felt);}
   if(furniture.name==='chair')cushion(accents,x,.87,z+.20,.23,felt);
   if(['coffee','table','meeting','workbench'].includes(furniture.name)){const y=furniture.name==='coffee'?.48:.93;vase(accents,x+.32,y,z-.05,furniture.name==='coffee'?.75:.8);}
   if(furniture.name==='kitchen'){plant(accents,x+.58,.97,z,.46);box(accents,.27,.007,.21,x+.21,.969,z+.03,wood);}
   if(furniture.name==='bookcase')plant(accents,x,1.845,z,.45);
  }
 }
 function updateHardware(){
  const slug=profile.gear.console&&profile.gear.console!=='none'?profile.gear.console:'midi-mini',key=slug;
  if(key===equipmentKey)return;equipmentKey=key;
  const old=group.getObjectByName('Practice controller');if(old){group.remove(old);ProductStage.dispose(old);}
  const item=shopItems.find(i=>i.id==='console-'+slug);if(item){const model=ItemModels.create(item);model.name='Practice controller';const b=new THREE.Box3().setFromObject(model),s=b.getSize(new THREE.Vector3());model.scale.setScalar(.94/Math.max(s.x,s.y,s.z));model.position.set(-1.1,.925,7.59);group.add(model);}
 }
 function tick(){
  const walking=document.body.classList.contains('studio-world-view');group.visible=walking;if(!walking){if(environmentActive){scene.environment=previousEnvironment;environmentActive=false;}return;}if(!built)build();if(!environmentActive){scene.environment=environment.texture;environmentActive=true;}refreshHome();updateHardware();
  const hour=StudioWorld.getClock().hour;if(hour!==lastHour){lastHour=hour;const night=hour<6||hour>=20;practical.intensity=night?1.15:.75;StudioSet.daylight?.(hour);}
 }
 return{tick,group,materials:{wood,ink,steel,brass,ceramic,linen,felt},plant,vase,cushion};
})();
