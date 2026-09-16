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
  const texture=new THREE.CanvasTexture(cv);texture.colorSpace=THREE.SRGBColorSpace;
  texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(2.4,1.65);
  texture.anisotropy=Math.min(4,renderer.capabilities?.getMaxAnisotropy?.()||1);
  return texture;
 }
 const brickTexture=makeBrickTexture();
 const brick=new THREE.MeshStandardMaterial({color:0xc19a7b,map:brickTexture,roughness:.96,metalness:0});
 const brickSide=brick.clone();brickSide.map=brickTexture.clone();brickSide.map.needsUpdate=true;brickSide.map.repeat.set(1.8,1.65);

 function box(w,h,d,x,y,z,m,parent=group){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.receiveShadow=true;o.castShadow=true;parent.add(o);return o;}
 function label(text,x,y,z,rotation=0,w=2.4){const cv=document.createElement('canvas');cv.width=768;cv.height=220;const q=cv.getContext('2d');q.fillStyle='#17232a';q.fillRect(0,0,768,220);q.strokeStyle='#52636a';q.lineWidth=5;q.strokeRect(8,8,752,204);q.fillStyle='#e7dcc5';q.font='bold 46px Arial';q.textAlign='center';q.fillText(text,384,132,700);const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,w*.286),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv),side:THREE.FrontSide}));mesh.position.set(x,y,z);mesh.rotation.y=rotation;group.add(mesh);return mesh;}
 const left=-6.7,right=6.7,back=4.2,front=13.8,height=4.25;

 // Shell.
 box(right-left,.16,front-back,0,.08,(back+front)/2,floorMat);
 box(right-left,height,.18,0,height/2,back,brick);
 box(.18,height,front-back,left,height/2,(back+front)/2,brickSide);
 box(.18,height,front-back,right,height/2,(back+front)/2,brickSide);
 box(right-left,.16,front-back,0,height,(back+front)/2,dark);
 box(right-left,.72,.035,0,.46,back+.105,accent);
 box(.035,.72,front-back,left+.105,.46,(back+front)/2,accent);
 box(.035,.72,front-back,right-.105,.46,(back+front)/2,accent);

 // Closed sectional garage door.
 const doorZ=front-.06;
 box(12.5,3.72,.18,0,1.9,doorZ,metal);
 for(let y=.35;y<3.6;y+=.48)box(11.95,.035,.205,0,y,doorZ-.015,dark);
 for(const x of [-5.85,5.85])box(.17,3.86,.28,x,1.94,doorZ-.08,dark);
 box(12.45,.22,.32,0,3.86,doorZ-.08,dark);
 for(const x of [-3.7,-1.25,1.25,3.7])box(1.65,.42,.035,x,2.72,doorZ-.115,material(0x354956,.42,.15));
 label('GARAGE / STUDIO VJ',0,3.52,doorZ-.19,Math.PI,3.45);

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
  if(x<-3.95&&z>7.45&&z<11.7)return true;
  return false;
 }
 return {group,tick(walking){scanLegacy();group.visible=walking;legacy.forEach(o=>{if(o.userData.__starterGarageHidden)o.visible=false;});},blocked};
})();