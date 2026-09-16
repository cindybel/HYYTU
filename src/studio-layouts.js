/* Rental furnishings share one geometry/collision source. No career data is changed. */
window.StudioLayouts=(()=>{
 const profiles={
  'housing-micro-room':{description:'Coin cuisine compact et petite table sous les fenêtres hautes.',color:0x777965,parts:[['kitchen',.5,13],['stool',-1.1,12.7]]},
  'housing-econo':{description:'Cuisine ouverte et table de repas pour une personne.',color:0x718387,parts:[['kitchen',1.5,13],['table',-.9,12.55],['stool',-.9,11.8]]},
  'housing-loft-small':{description:'Salon en cuir et claustra qui sépare le coin repos.',color:0x986e4e,parts:[['sofa',.1,12.8],['partition',-3.1,9.5],['coffee',.1,11.8]]},
  'housing-medium':{description:'Coin salon, table basse et bibliothèque près des fenêtres.',color:0x63817b,parts:[['sofa',-.3,12.8],['coffee',-.3,11.8],['bookcase',2.15,13]]},
  'housing-shared-studio':{description:'Table de collaboration, deux sièges et panneau de préparation.',color:0x596c83,parts:[['meeting',0,12.5],['stool',-1.3,12.5],['stool',1.3,12.5],['board',-3.1,9.5]]},
  'housing-warehouse-room':{description:'Zone de préparation industrielle et rangement fermé pour les outils.',color:0x5d6867,parts:[['workbench',0,12.7],['cabinet',2.25,13],['partition',-3.1,9.5]]},
  'housing-soundproof':{description:'Séparation acoustique du coin repos et banquette d’écoute.',color:0x494e62,parts:[['acoustic',-3.1,9.5],['sofa',0,12.8],['coffee',0,11.8]]},
  'housing-luxe':{description:'Salon de réception avec fauteuil et bibliothèque.',color:0xb0a08a,parts:[['sofa',-.6,12.8],['coffee',-.6,11.8],['chair',2,12.5],['partition',-3.1,9.5]]},
  'housing-artist-loft':{description:'Table de création et panneau d’esquisses séparant l’espace de repos.',color:0x887768,parts:[['workbench',.8,12.7],['board',-3.1,9.5],['stool',.8,11.8],['bookcase',-1.8,13]]},
  'housing-penthouse':{description:'Salon face à la ville, fauteuil et claustra du coin nuit.',color:0x9eafa9,parts:[['sofa',-.3,12.8],['chair',2.1,12.45],['coffee',-.3,11.8],['partition',-3.1,9.5]]},
 };
 const mat=(color,roughness=.75,metalness=0)=>new THREE.MeshStandardMaterial({color:new THREE.Color(color).convertSRGBToLinear(),roughness,metalness});
 const steel=StudioDecor.materials.ink,oak=StudioDecor.materials.wood,paper=mat(0xd1c8b7),ink=mat(0x354950),stone=mat(0xb0a997,.48),book=mat(0x94735d);
 const fabricCanvas=document.createElement('canvas');fabricCanvas.width=fabricCanvas.height=128;const q=fabricCanvas.getContext('2d');q.fillStyle='#989898';q.fillRect(0,0,128,128);
 for(let i=0;i<128;i+=2){q.fillStyle=i%4?'#929292':'#aaaaaa';q.fillRect(i,0,1,128);q.fillRect(0,i,128,1);}
 const weave=new THREE.CanvasTexture(fabricCanvas);weave.wrapS=weave.wrapT=THREE.RepeatWrapping;weave.repeat.set(7,7);
 let bounds=[];
 function box(parent,w,h,d,x,y,z,m){const mesh=new THREE.Mesh(GearModels.rounded(w,h,d,.028),m);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;if(h<.12&&w>.35&&d>.25)mesh.userData.placementSurface='Meuble';parent.add(mesh);return mesh;}
 function cushion(parent,w,h,d,x,y,z,m){
  const g=GearModels.rounded(w,h,d,.065);
  const mesh=new THREE.Mesh(g,m);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
 }
 function legs(parent,w,d,h){for(const x of [-w/2,w/2])for(const z of [-d/2,d/2])box(parent,.055,h,.055,x,.16+h/2,z,steel);}
 function seat(parent,width,cloth){
  legs(parent,width-.25,.65,.25);box(parent,width,.15,.85,0,.43,0,oak);
  const sections=width>1.5?2:1;for(let i=0;i<sections;i++){const x=sections===2?(i-.5)*(width-.2)/2:0;cushion(parent,(width-.24)/sections,.18,.76,x,.59,-.03,cloth);const back=cushion(parent,(width-.13)/sections,.53,.20,x,.87,.33,cloth);back.rotation.x=-.10;}
  for(const x of [-width/2+.04,width/2-.04])cushion(parent,.13,.35,.85,x,.67,0,cloth);
  if(width>1.5)box(parent,.014,.012,.7,0,.69,-.04,ink);
 }
 function build(parent,id){
  bounds=[];const config=profiles[id];if(!config)return;
  const cloth=mat(config.color,.92);cloth.bumpMap=weave;cloth.bumpScale=.006;cloth.userData.layoutOwned=true;
  const root=new THREE.Group();root.name='Rental furnishing layout';root.userData.housingId=id;parent.add(root);
  for(const [kind,x,z] of config.parts){
   const p=new THREE.Group();p.name=kind;p.position.set(x,0,z);root.add(p);
   if(kind==='sofa'||kind==='chair')seat(p,kind==='sofa'?2.15:.9,cloth);
   if(['table','coffee','meeting','workbench'].includes(kind)){
    const low=kind==='coffee',width=kind==='meeting'?1.8:kind==='workbench'?2.3:1.25,depth=kind==='meeting'?.95:.62,h=low?.43:.88;
    legs(p,width-.2,depth-.16,h-.2);box(p,width,.065,depth,0,h,0,kind==='coffee'?stone:oak);
    box(p,.34,.02,.26,-.18,h+.045,0,paper);box(p,.28,.022,.2,-.14,h+.063,.015,book);
    if(kind==='workbench'){box(p,.55,.15,.28,.65,h+.1,0,steel);for(let i=0;i<3;i++)box(p,.012,.025,.2,-.3+i*.07,h+.07,-.05,ink);}
   }
   if(kind==='stool'){legs(p,.32,.32,.47);cushion(p,.45,.1,.45,0,.65,0,cloth);}
   if(kind==='kitchen'){
    box(p,1.65,.72,.55,0,.54,0,paper);box(p,1.75,.06,.62,0,.93,0,stone);
    for(const xx of [-.54,0,.54]){box(p,.012,.64,.012,xx,.55,-.28,oak);box(p,.18,.025,.04,xx+.18,.78,-.30,steel);}
    box(p,.5,.014,.37,-.4,.968,0,StudioDecor.materials.steel);box(p,.42,.009,.29,-.4,.979,0,steel);
    const faucet=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(-.4,.97,.18),new THREE.Vector3(-.4,1.25,.18),new THREE.Vector3(-.4,1.27,-.02),new THREE.Vector3(-.4,1.15,-.06)]),24,.016,8,false),StudioDecor.materials.steel);p.add(faucet);
   }
   if(kind==='bookcase'||kind==='cabinet'){
    for(const xx of [-.46,.46])box(p,.06,1.7,.36,xx,1.01,0,oak);
    box(p,.92,1.7,.035,0,1.01,.17,oak);
    for(let y=.2;y<1.9;y+=.53)box(p,.98,.045,.38,0,y,0,oak);
    if(kind==='cabinet'){box(p,.88,1.58,.035,0,1,-.19,steel);box(p,.035,.28,.06,.25,1,-.22,stone);}
    else for(let row=0;row<3;row++)for(let i=0;i<6;i++)box(p,.08,.26+(i%3)*.03,.21,-.35+i*.13,.37+row*.53,0,i%2?book:paper);
   }
   if(['partition','board','acoustic'].includes(kind)){
    // Fixed to the floor; 1.6 m long leaves access around both ends.
    for(const zz of [-.8,.8])box(p,.08,2.45,.08,0,1.385,zz,oak);
    for(const y of [.22,2.6])box(p,.09,.1,1.68,0,y,0,oak);
    if(kind==='partition')for(let zz=-.68;zz<.75;zz+=.17)box(p,.06,2.28,.05,0,1.4,zz,oak);
    else{box(p,.08,2.15,1.48,0,1.38,0,kind==='acoustic'?cloth:paper);
     if(kind==='board')for(let i=0;i<5;i++)box(p,.01,.22,.25,.05,1.05+(i%2)*.48,-.55+i*.26,i%2?book:ink);
    }
   }
   p.updateWorldMatrix(true,true);const b=new THREE.Box3().setFromObject(p);bounds.push({minX:b.min.x,maxX:b.max.x,minZ:b.min.z,maxZ:b.max.z,kind});
  }
 }
 function blocked(x,z){return bounds.some(b=>x>b.minX&&x<b.maxX&&z>b.minZ&&z<b.maxZ);}
 return {build,blocked,describe:id=>profiles[id]?.description||'',get bounds(){return bounds.map(b=>({...b}));}};
})();
