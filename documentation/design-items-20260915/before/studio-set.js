/* Final integration · Starter garage art-direction pass.
   Compact VJ workspace with brick walls, one clear workstation and clean circulation. */
window.StudioSet=(()=>{
 const group=new THREE.Group();group.name='Starter garage interior';group.visible=false;scene.add(group);
 const material=(color,roughness=.8,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
 const dark=material(0x12181d,.78),wood=material(0x6f5944,.84),metal=material(0x68737a,.5,.52),floorMat=material(0x514e49,.97);
 const accent=material(0x20313a,.74),rubber=material(0x171c20,.9);

 function makeBrickTexture(){
  const cv=document.createElement('canvas');cv.width=1024;cv.height=512;const q=cv.getContext('2d');
  q.fillStyle='#b8aea0';q.fillRect(0,0,cv.width,cv.height);
  const bw=126,bh=58,mortar=8;
  for(let row=0,y=0;y<cv.height;row++,y+=bh){
   const offset=row%2?-bw/2:0;
   for(let x=offset;x<cv.width+bw;x+=bw){
    const seed=(row*17+Math.round(x/bw)*31+2000)%23;
    const r=105+seed*2,g=64+seed,b=48+Math.floor(seed*.55);
    q.fillStyle=`rgb(${r},${g},${b})`;
    q.fillRect(x+mortar/2,y+mortar/2,bw-mortar,bh-mortar);
    q.fillStyle='rgba(255,210,170,.06)';q.fillRect(x+mortar/2,y+mortar/2,bw-mortar,5);
    q.fillStyle='rgba(28,20,17,.12)';q.fillRect(x+mortar/2,y+bh-9,bw-mortar,4);
    for(let i=0;i<5;i++){
     const px=x+15+((seed*19+i*37)%(bw-30)),py=y+12+((seed*11+i*13)%(bh-24));
     q.fillStyle=i%2?'rgba(35,20,16,.08)':'rgba(240,190,145,.06)';q.fillRect(px,py,10+(i%3)*6,2);
    }
   }
  }
  const texture=new THREE.CanvasTexture(cv);texture.encoding=THREE.sRGBEncoding;
  texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(7.2,5.8);
  texture.anisotropy=Math.min(4,renderer.capabilities?.getMaxAnisotropy?.()||1);
  return texture;
 }
 const brickTexture=makeBrickTexture();
 const brick=new THREE.MeshStandardMaterial({color:0xc19a7b,map:brickTexture,roughness:.96,metalness:0});
 const relief=brickTexture.clone();relief.encoding=THREE.LinearEncoding;relief.needsUpdate=true;
 brick.bumpMap=relief;brick.bumpScale=.012;
 const brickSide=brick.clone();brickSide.map=brickTexture.clone();brickSide.map.needsUpdate=true;brickSide.map.repeat.set(5.2,5.8);

 function box(w,h,d,x,y,z,m,parent=group){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.receiveShadow=true;o.castShadow=true;parent.add(o);return o;}
 function label(text,x,y,z,rotation=0,w=2.4){const cv=document.createElement('canvas');cv.width=768;cv.height=220;const q=cv.getContext('2d');q.fillStyle='#17232a';q.fillRect(0,0,768,220);q.strokeStyle='#52636a';q.lineWidth=5;q.strokeRect(8,8,752,204);q.fillStyle='#e7dcc5';q.font='bold 46px Arial';q.textAlign='center';q.fillText(text,384,132,700);const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,w*.286),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv),side:THREE.FrontSide}));mesh.position.set(x,y,z);mesh.rotation.y=rotation;group.add(mesh);return mesh;}
 const left=-6.7,right=6.7,back=4.2,front=13.8,height=4.25;

 // Deterministic concrete grain: surface variation without animated noise.
 const concrete=document.createElement('canvas');concrete.width=concrete.height=512;
 const cq=concrete.getContext('2d');cq.fillStyle='#777772';cq.fillRect(0,0,512,512);
 let grainSeed=1937;const noise=()=>{grainSeed=(grainSeed*1664525+1013904223)>>>0;return grainSeed/4294967296;};
 for(let i=0;i<26000;i++){const shade=Math.floor(90+noise()*65);cq.fillStyle=`rgba(${shade},${shade},${shade},.22)`;cq.fillRect(noise()*512,noise()*512,1+noise()*3,1+noise()*2);}
 const concreteMap=new THREE.CanvasTexture(concrete);concreteMap.encoding=THREE.sRGBEncoding;concreteMap.wrapS=concreteMap.wrapT=THREE.RepeatWrapping;concreteMap.repeat.set(5,4);
 floorMat.map=concreteMap;floorMat.color.set(0xc3c2bb);
 const concreteRelief=concreteMap.clone();concreteRelief.encoding=THREE.LinearEncoding;concreteRelief.needsUpdate=true;floorMat.bumpMap=concreteRelief;floorMat.bumpScale=.008;
 // Expansion joints in the poured slab; all are flush with the walking surface.
 for(const x of [-3.35,0,3.35])box(.012,.002,front-back,x,.161,(back+front)/2,rubber);
 for(const z of [7.4,10.6])box(right-left,.002,.012,0,.161,z,rubber);
 // Electrical trunking and outlets are fastened to the rear wall.
 box(12.8,.035,.028,0,1.02,back+.112,metal);
 for(const x of [-5.2,-1.5,4.8]){
   box(.09,.13,.045,x,1.02,back+.14,material(0xc9c7be,.65));
   for(const y of [.997,1.047]){box(.01,.024,.005,x-.013,y,back+.166,dark);box(.01,.024,.005,x+.013,y,back+.166,dark);}
 }
 // Shell.
 box(right-left,.16,front-back,0,.08,(back+front)/2,floorMat);
 box(right-left,height,.18,0,height/2,back,brick);
 box(.18,height,front-back,left,height/2,(back+front)/2,brickSide);
 box(.18,height,front-back,right,height/2,(back+front)/2,brickSide);
 box(right-left,.16,front-back,0,height,(back+front)/2,dark);
 box(right-left,.72,.035,0,.46,back+.105,accent);
 box(.035,.72,front-back,left+.105,.46,(back+front)/2,accent);
 box(.035,.72,front-back,right-.105,.46,(back+front)/2,accent);

 const garageDoorStart=group.children.length;
 // Closed sectional garage door.
 const doorZ=front-.06;
 box(12.5,3.72,.18,0,1.9,doorZ,metal);
 for(let y=.35;y<3.6;y+=.48)box(11.95,.035,.205,0,y,doorZ-.015,dark);
 for(const x of [-5.85,5.85])box(.17,3.86,.28,x,1.94,doorZ-.08,dark);
 box(12.45,.22,.32,0,3.86,doorZ-.08,dark);
 for(const x of [-3.7,-1.25,1.25,3.7])box(1.65,.42,.035,x,2.72,doorZ-.115,material(0x354956,.42,.15));
 label('GARAGE / STUDIO VJ',0,3.52,doorZ-.19,Math.PI,3.45);

 const garageDoorParts=group.children.slice(garageDoorStart);
 // Preparation bench: against the back-left wall, no longer in front of the computer desk.
 const benchX=-3.55,benchZ=5.05;
 box(2.9,.14,.72,benchX,.87,benchZ,wood);
 box(.11,.82,.6,benchX-1.25,.42,benchZ,metal);box(.11,.82,.6,benchX+1.25,.42,benchZ,metal);
 box(2.85,1.05,.06,benchX,2.02,back+.16,accent);
 for(let x=benchX-1.05;x<benchX+1.1;x+=.43)for(let y=1.58;y<2.45;y+=.36)box(.035,.035,.028,x,y,back+.12,metal);
 label('ÉTABLI / PRÉPA',benchX,2.78,back+.11,0,2.2);
 const caseA=box(.92,.5,.54,benchX-.72,.35,benchZ+.02,rubber);caseA.rotation.y=.04;
 box(.78,.46,.5,benchX+.67,.33,benchZ+.02,material(0x303b40,.72,.2));

 // Rest zone label only; StudioLife creates the single interactive bed.
 label('COIN REPOS',left+.13,2.45,9.55,Math.PI/2,1.45);

 // Cable rail over the preparation bench.
 box(2.1,.09,.1,benchX,1.28,back+.22,metal);
 for(let i=0;i<4;i++){const hook=new THREE.Mesh(new THREE.TorusGeometry(.11,.022,8,16,Math.PI*1.55),rubber);hook.rotation.x=Math.PI/2;hook.position.set(benchX-.75+i*.5,1.04,back+.29);group.add(hook);}

 // Side exit.
 box(.2,2.75,1.4,right-.055,1.37,11.15,dark);box(.12,.09,.11,right-.19,1.25,10.72,material(0xd4b98e,.45,.5));
 label('SORTIE',right-.13,2.88,11.15,-Math.PI/2,1.25);

 // Ceiling practicals.
 for(const x of [-3.6,0,3.6]){box(2.2,.09,.28,x,4.02,8.1,dark);box(1.9,.02,.18,x,3.96,8.1,new THREE.MeshBasicMaterial({color:0xe7dfc8}));}
 const warm=new THREE.PointLight(0xffd3a0,1.0,8);warm.position.set(-4.6,3.15,9);group.add(warm);
 const cool=new THREE.PointLight(0x9fcbd6,.72,9);cool.position.set(3.4,3.35,7);group.add(cool);
 const doorLight=new THREE.PointLight(0xb6c7d4,.34,7);doorLight.position.set(0,3.25,12.4);group.add(doorLight);

 // Small dressing only on the preparation bench.
 const cup=new THREE.Mesh(new THREE.CylinderGeometry(.1,.09,.18,16),material(0xb9b09c,.7));cup.position.set(benchX+.9,1.03,benchZ);group.add(cup);
 const cable=new THREE.Mesh(new THREE.TorusGeometry(.27,.03,8,24),rubber);cable.rotation.x=Math.PI/2;cable.position.set(benchX-.55,.98,benchZ);group.add(cable);

 // Remove the obsolete oversized-room props (old second bed, old shelf and rug).
 let legacyScanned=false,legacy=[];
 function scanLegacy(){
  if(legacyScanned)return;legacyScanned=true;
  const targets=[[-11.8,15.2],[11.7,14.5],[0,12.8]];
  legacy=scene.children.filter(o=>o!==group&&targets.some(([x,z])=>Math.abs((o.position?.x??999)-x)<.45&&Math.abs((o.position?.z??999)-z)<.65));
  legacy.forEach(o=>{o.userData.__starterGarageHidden=true;o.visible=false;});
 }
 function blocked(x,z){
  if(x<left+.25||x>right-.25||z<back+.22||z>front-.38)return true;
  if(x>benchX-1.55&&x<benchX+1.55&&z>benchZ-.58&&z<benchZ+.58)return true;
  return window.StudioLayouts?.blocked(x,z)||false;
 }
 const homeDecor=new THREE.Group();homeDecor.name='Rented space architecture';group.add(homeDecor);
 const plaster=material(0xb7b4ac,.93),windowGlass=material(0x243f53,.3,.2),windowFrame=material(0x33393c,.42,.45),acoustic=material(0x363d43,.96);
 windowGlass.transparent=true;windowGlass.opacity=.10;windowGlass.depthWrite=false;windowGlass.color.set(0xafd4e0);
 const exteriorBuilding=material(0x667582,.95),exteriorBrick=material(0x79706a,.96);
 const skyCanvas=document.createElement('canvas');skyCanvas.width=16;skyCanvas.height=512;const skyContext=skyCanvas.getContext('2d');
 const skyGradient=skyContext.createLinearGradient(0,0,0,512);skyGradient.addColorStop(0,'#47789f');skyGradient.addColorStop(.6,'#b6ccd8');skyGradient.addColorStop(1,'#e5dad0');skyContext.fillStyle=skyGradient;skyContext.fillRect(0,0,16,512);
 const skyTexture=new THREE.CanvasTexture(skyCanvas);skyTexture.encoding=THREE.sRGBEncoding;
 const skyMaterial=new THREE.MeshBasicMaterial({map:skyTexture,side:THREE.DoubleSide,fog:false});
 exteriorBuilding.fog=false;exteriorBrick.fog=false;
 const cityWindow=new THREE.MeshBasicMaterial({color:0xa8c4cf});
 // Oak boards use a stable grain so the material survives revisiting a space.
 const oakCanvas=document.createElement('canvas');oakCanvas.width=oakCanvas.height=512;const oq=oakCanvas.getContext('2d');
 for(let row=0;row<8;row++){
  oq.fillStyle=['#927458','#a18462','#897056','#ad8d6b'][row%4];oq.fillRect(0,row*64,512,64);
  for(let i=0;i<100;i++){oq.strokeStyle=i%3?'rgba(54,35,20,.10)':'rgba(233,207,165,.13)';oq.beginPath();const y=row*64+(i*17%62);oq.moveTo(0,y);oq.bezierCurveTo(160,y-3,340,y+3,512,y);oq.stroke();}
  oq.fillStyle='#4e4235';oq.fillRect(0,row*64,512,1);oq.fillRect((row*179)%512,row*64,1,64);
 }
 const oakMap=new THREE.CanvasTexture(oakCanvas);oakMap.encoding=THREE.sRGBEncoding;oakMap.wrapS=oakMap.wrapT=THREE.RepeatWrapping;oakMap.repeat.set(4,3);
 const oakRelief=oakMap.clone();oakRelief.encoding=THREE.LinearEncoding;oakRelief.needsUpdate=true;

 function outside(premium){
  const sky=new THREE.Mesh(new THREE.PlaneGeometry(150,80),skyMaterial);sky.position.set(0,18,64);homeDecor.add(sky);
  const panes=[];
  for(let row=0;row<2;row++)for(let i=0;i<13;i++){
   const x=(i-6)*5.5+(row?2:0),h=5+((i*17+row*11)%12),z=32+row*18,ground=premium?-16:-1;
   box(4.3,h,4.2,x,ground+h/2,z,i%3?exteriorBuilding:exteriorBrick,homeDecor);
   box(4.5,.18,4.4,x,ground+h+.09,z,windowFrame,homeDecor);
   for(let y=ground+1;y<ground+h-.6;y+=1.45)for(let col=0;col<3;col++)panes.push([x-1.4+col*1.4,y,z-2.12]);
  }
  const mesh=new THREE.InstancedMesh(new THREE.PlaneGeometry(.63,.85),cityWindow,panes.length),matrix=new THREE.Matrix4(),rotation=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),Math.PI);
  panes.forEach((point,i)=>mesh.setMatrixAt(i,matrix.compose(new THREE.Vector3(...point),rotation,new THREE.Vector3(1,1,1))));homeDecor.add(mesh);
 }
 let homeSignature='';
 function updateHome(){
  const title=window.StudioWorld?.visitingHome?.label||profile?.housing?.type||'';if(title===homeSignature)return;homeSignature=title;
  for(const child of [...homeDecor.children]){homeDecor.remove(child);child.traverse(node=>{node.geometry?.dispose();if(node.material?.userData.layoutOwned)node.material.dispose();});}
  const garage=!shopItems.some(item=>item.category==='housing'&&item.label===title);
  garageDoorParts.forEach(part=>part.visible=garage);
  const walls=group.children.filter(o=>o.isMesh&&(o.material===brick||o.material===brickSide||o.userData.homeWall));
  const industrial=/loft|warehouse|partage/i.test(title);
  for(const wall of walls){wall.userData.homeWall=true;if(!wall.userData.originalMaterial)wall.userData.originalMaterial=wall.material;wall.material=garage||industrial?wall.userData.originalMaterial:plaster;}
  warm.color.set(garage?0xffd3a0:0xffe2bb);warm.intensity=garage?1:.8;cool.intensity=garage?.72:1.05;doorLight.intensity=garage?.34:.9;
  const finishedFloor=!garage&&!industrial&&!/sous-sol|insonorise/.test(title);
  floorMat.map=finishedFloor?oakMap:concreteMap;floorMat.bumpMap=finishedFloor?oakRelief:concreteRelief;floorMat.bumpScale=finishedFloor?.002:.008;floorMat.roughness=finishedFloor?.66:.97;
  group.children.filter(o=>o.isMesh&&o.geometry?.parameters?.height===.002).forEach(o=>o.visible=!finishedFloor);
  StudioLayouts.build(homeDecor,shopItems.find(item=>item.category==='housing'&&item.label===title)?.id);
  if(garage)return;
  const basement=/sous-sol/i.test(title),premium=/premium|luxe|penthouse/i.test(title),soundproof=/insonorise/i.test(title);
  const count=basement?2:premium?5:3,width=basement?1.3:premium?2.2:1.8,wh=basement?.55:premium?2.7:1.65,wy=basement?3.2:premium?2:2.3;
  const bottom=wy-wh/2,top=wy+wh/2,wallMaterial=industrial?brick:plaster;
  box(right-left,bottom,.16,0,bottom/2,front-.04,wallMaterial,homeDecor);
  box(right-left,height-top,.16,0,top+(height-top)/2,front-.04,wallMaterial,homeDecor);
  let previous=left;
  for(let i=0;i<count;i++){
   const x=(i-(count-1)/2)*(width+.28);
   const edge=x-width/2;box(edge-previous,wh,.16,(edge+previous)/2,wy,front-.04,wallMaterial,homeDecor);previous=x+width/2;
   for(const side of [-1,1]){box(.07,wh+.14,.10,x+side*(width/2+.035),wy,front-.17,windowFrame,homeDecor);box(width,.07,.10,x,wy+side*(wh/2+.035),front-.17,windowFrame,homeDecor);}
   box(width,wh,.015,x,wy,front-.23,windowGlass,homeDecor);
   box(.04,wh,.035,x,wy,front-.25,windowFrame,homeDecor);
   box(width,.035,.035,x,wy,front-.25,windowFrame,homeDecor);
   box(width+.24,.06,.25,x,wy-wh/2-.08,front-.25,wood,homeDecor);
  }
  box(right-previous,wh,.16,(right+previous)/2,wy,front-.04,wallMaterial,homeDecor);
  outside(premium);
  if(soundproof||/partage/i.test(title))for(const x of [-5.7,-4.7,4.7,5.7]){
   box(.72,1.65,.12,x,2,back+.19,acoustic,homeDecor);
   for(let y=1.25;y<2.8;y+=.15)box(.7,.045,.055,x,y,back+.28,dark,homeDecor);
  }
  if(industrial)for(const x of [-6.4,6.4]){box(.18,height,.22,x,height/2,front-.2,metal,homeDecor);box(.22,.18,front-back,x,height-.2,(front+back)/2,metal,homeDecor);}
 }
 const venueFloor=scene.getObjectByName('Venue base floor');
 return {group,refreshHome(){homeSignature='';updateHome();},tick(walking){if(venueFloor)venueFloor.visible=!walking;scanLegacy();if(walking)updateHome();group.visible=walking;legacy.forEach(o=>{if(o.userData.__starterGarageHidden)o.visible=false;});},blocked};
})();
