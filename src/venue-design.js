/* Location-specific architecture. Shared bounded texture cache; geometry belongs to stageGroup. */
window.VenueDesign=(()=>{
 const textures=new Map();let active=null;
 const families=['garage','street','bar','hall','club','basement','studio','loft','gallery','club','hall','hall','studio','bar','gallery','club','gallery','loft','warehouse','warehouse','hall','lab','lab','festival','club','cathedral','arena','lab','festival','arena'];
 function texture(kind){if(textures.has(kind))return textures.get(kind);const c=document.createElement('canvas');c.width=c.height=512;const d=c.getContext('2d');const colors={brick:'#6e5145',concrete:'#7d817c',wood:'#82674a',metal:'#49565c',plaster:'#c3c1b5',tile:'#58636a'};d.fillStyle=colors[kind]||colors.concrete;d.fillRect(0,0,512,512);let seed=912;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};for(let i=0;i<14000;i++){d.fillStyle=`rgba(${i%2?'255,255,255':'0,0,0'},${rand()*.1})`;const x=rand()*512,y=rand()*512;d.fillRect(x,y,kind==='wood'?30+rand()*80:1+rand()*3,1);}
 if(kind==='brick'){d.strokeStyle='#3f3c36';d.lineWidth=4;for(let y=0;y<512;y+=64){d.beginPath();d.moveTo(0,y);d.lineTo(512,y);d.stroke();for(let x=(y/64%2)*64;x<512;x+=128){d.beginPath();d.moveTo(x,y);d.lineTo(x,y+64);d.stroke();}}}
 if(kind==='wood'||kind==='tile'){d.strokeStyle=kind==='wood'?'#483b2d':'#343f44';d.lineWidth=2;for(let x=0;x<512;x+=64)d.strokeRect(x,0,64,512);}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(4,2);t.encoding=THREE.sRGBEncoding;textures.set(kind,t);return t;}
 function build(parent,gig){if(!gig){active=null;return null;}const num=Math.max(1,Number(gig.number)||Number(String(gig.id).match(/\d+/)?.[0])||1);const family=gig.venueFamily||families[num-1]||'hall';const group=new THREE.Group();group.name='Location architecture';group.userData.family=family;parent.add(group);active=group;
 const mat=(color,map=null,roughness=.85,metalness=0)=>new THREE.MeshStandardMaterial({color,map:map?texture(map):null,roughness,metalness});
 const steel=mat(0x9da8a9,null,.36,.72),dark=mat(0x20292c),wood=mat(0xbfa682,'wood'),brick=mat(0xc8b3a0,'brick'),concrete=mat(0xb6bab6,'concrete'),plaster=mat(0xdddccf,'plaster'),rubber=mat(0x131a20);
 function box(w,h,z,x,y,depth,m){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,z),m);o.position.set(x,y,depth);o.castShadow=true;o.receiveShadow=true;group.add(o);return o;}
 function rod(a,b,r=.04,m=steel){const from=new THREE.Vector3(...a),to=new THREE.Vector3(...b),o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,from.distanceTo(to),8),m);o.position.copy(from).add(to).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),to.sub(from).normalize());group.add(o);return o;}
 function sign(text,x,y,z,w=3,color='#d5cbb1'){const key='sign:'+text;if(!textures.has(key)){const c=document.createElement('canvas');c.width=1024;c.height=192;const d=c.getContext('2d');d.fillStyle='#202b2d';d.fillRect(0,0,1024,192);d.strokeStyle='#7c8a80';d.lineWidth=3;d.strokeRect(14,14,996,164);d.fillStyle=color;d.textAlign='center';d.font='600 48px Arial';d.fillText(text,512,111,950);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;textures.set(key,t);}return box(w,w*.1875,.03,x,y,z,new THREE.MeshBasicMaterial({map:textures.get(key)}));}
 function lamp(x,y,z,w=1.8,color=0xffddb2){box(w,.12,.24,x,y,z,dark);box(w*.88,.025,.17,x,y-.08,z,new THREE.MeshBasicMaterial({color}));const l=new THREE.PointLight(color,.7,9,2);l.position.set(x,y-.25,z);group.add(l);}
 function shelf(x,z){for(const y of [.35,1.25,2.15,3.05])box(2.8,.09,.85,x,y,z,wood);for(const dx of [-1.32,1.32])box(.09,3.2,.09,x+dx,1.6,z-.34,steel);for(let i=0;i<8;i++){const xx=x-.9+(i%3)*.85,yy=.62+Math.floor(i/3)*.9;box(.65,.45,.56,xx,yy,z,mat([0x6b7978,0x9b8260,0x414d57][i%3]));box(.27,.09,.01,xx,yy,z+.29,plaster);}}
 function caseBox(x,z,w=1.3){box(w,.85,.85,x,.54,z,rubber);for(const y of [.14,.93])box(w+.03,.04,.88,x,y,z,steel);for(const dx of [-w/2,w/2])box(.05,.84,.89,x+dx,.54,z,steel);box(.3,.08,.04,x,.63,z+.45,steel);for(const dx of [-w*.35,w*.35]){const o=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,.08,12),rubber);o.rotation.z=Math.PI/2;o.position.set(x+dx,.1,z);group.add(o);}}
 function speaker(x,z){box(.9,1.4,.6,x,1,z,rubber);for(const y of [.65,1.28]){const o=new THREE.Mesh(new THREE.CylinderGeometry(.26,.2,.05,24),dark);o.rotation.x=Math.PI/2;o.position.set(x,y,z+.33);group.add(o);}rod([x,.2,z],[x,1,z],.05);}
 function truss(x,z,height=7){for(const dx of [-.16,.16])rod([x+dx,0,z],[x+dx,height,z]);for(let y=0;y<height-.5;y+=.6)rod([x-.16,y,z],[x+.16,y+.6,z]);}
 const outdoor=['festival','street'].includes(family);const width=['garage','bar','basement'].includes(family)?16:30;const high=['cathedral','arena','warehouse','festival'].includes(family)?12:7.6;
 box(34,.12,26,0,-.015,3,mat(0x87918f,outdoor?'concrete':family==='loft'||family==='gallery'?'wood':'concrete'));
 if(!outdoor){const wall=['bar','loft','warehouse','basement'].includes(family)?brick:['gallery','lab','studio'].includes(family)?plaster:concrete;box(width,high,.22,0,high/2,-7.65,wall);for(const side of [-1,1])box(.2,high,20,side*width/2,high/2,2,wall);box(width,.16,20,0,high,2,dark);for(const x of [-width/2+.2,width/2-.2])box(.08,.2,20,x,.15,2,dark);}
 if(family==='garage'){
  // Side-mounted sectional vehicle door, tracks, workbench and service storage.
  box(3.5,4.9,.2,5.65,2.5,-7.37,steel);for(let y=.4;y<4.9;y+=.55){box(3.3,.46,.12,5.65,y,-7.22,mat(0xb4b7ae,'metal'));box(3.25,.025,.02,5.65,y+.2,-7.14,dark);}for(const x of [3.85,7.45]){rod([x,.1,-7.1],[x,5.15,-7.1],.055);rod([x,5.15,-7.1],[x,5.15,-2],.055);}box(.4,.12,.08,5.65,1.2,-7.08,dark);
  box(3.4,.18,1.15,-5.5,1.38,-6.45,wood);for(const x of [-6.9,-4.1])box(.12,1.25,.85,x,.68,-6.45,steel);box(3.1,1.6,.07,-5.5,3,-7.25,mat(0x8b7353,'wood'));
  for(let i=0;i<8;i++){const x=-6.8+i*.36;rod([x,2.5,-7.12],[x,3.2+(i%3)*.2,-7.12],.035,steel);box(.15,.1,.08,x,2.65,-7.05,mat(i%2?0xb48346:0x6d777d));}
  shelf(-6.1,-3);for(let i=0;i<3;i++){const tire=new THREE.Mesh(new THREE.TorusGeometry(.43,.14,10,24),rubber);tire.rotation.x=Math.PI/2;tire.position.set(6.5,.2+i*.29,-5.2);group.add(tire);}caseBox(5.8,-2.5);sign('ATELIER / GARAGE',-5.5,4.4,-7.15,3);lamp(-4,6.5,-3,3);lamp(4,6.5,-3,3);speaker(-3.3,-5.5);speaker(3.3,-5.5);
 }else if(family==='bar'||family==='basement'){
  box(4.1,1.3,1.2,-5.9,.7,-5.9,wood);box(4.4,.14,1.4,-5.9,1.4,-5.9,dark);shelf(-5.7,-7);for(let i=0;i<12;i++){const bottle=new THREE.Mesh(new THREE.CylinderGeometry(.06,.09,.45,8),mat(i%2?0x56735b:0x96663c));bottle.position.set(-6.8+(i%6)*.4,1.55+Math.floor(i/6)*.9,-6.8);group.add(bottle);}for(const x of [4.4,6.5]){box(1.6,.12,.9,x,1.15,-5.7,wood);rod([x,0,-5.7],[x,1.1,-5.7],.09);lamp(x,4,-5.7,.5);}sign(family==='bar'?'BAR / SESSION LOCALE':'SOUS-SOL / LIVE',-5.7,4.5,-7.16,3.3);speaker(-3.6,-5.2);speaker(3.6,-5.2);lamp(-5,5,-5,.6);
 }else if(family==='gallery'||family==='studio'||family==='lab'||family==='loft'){
  for(const x of [-11,-8,8,11]){box(2.3,3.4,.14,x,3.2,-7.25,dark);box(2.05,3.15,.04,x,3.2,-7.14,mat(family==='lab'?0x486276:0xaab7b0));sign(family==='lab'?'SIGNAL / '+Math.abs(x):'ÉTUDE / '+Math.abs(x),x,3.3,-7.08,1.8);lamp(x,6.4,-6,1);box(1,.9,1,x,.5,-5.5,plaster);}
  if(family==='loft'){for(const x of [-12,12]){box(3.4,3.8,.07,x,4.9,-7.2,new THREE.MeshBasicMaterial({color:0x4d6676}));for(const dx of [-1.6,0,1.6])box(.055,3.8,.1,x+dx,4.9,-7.08,dark);box(3.4,.06,.1,x,4.9,-7.08,dark);}}
  if(family==='lab'||family==='studio'){shelf(-12,-3.2);for(let i=0;i<3;i++){caseBox(9+i*1.5,-3);box(.75,.4,.12,9+i*1.5,1.3,-3,new THREE.MeshBasicMaterial({color:0x5b8886}));}}
  sign(family==='gallery'?'GALERIE / ARTS NUMÉRIQUES':family==='loft'?'LOFT / SESSION PRIVÉE':family==='lab'?'LABORATOIRE / SORTIES VIDÉO':'STUDIO / CRÉATION',0,6.7,-7.25,6);lamp(0,7,-3,4);
 }else if(family==='warehouse'){
  for(const x of [-13,-9,9,13]){box(.4,10,.5,x,5,-6.8,steel);rod([x,8,-6.8],[x+(x<0?3:-3),10,-6.8],.1);shelf(x,-5.8);caseBox(x,-2.8,1.8);}for(const y of [7,8.5])rod([-14,y,-7.05],[14,y,-7.05],.12);box(29,.4,.5,0,10,-6.8,steel);sign('HANGAR / '+num,0,8,-7.1,5);lamp(-8,9,-3,3);lamp(8,9,-3,3);
 }else if(family==='cathedral'){
  const stone=mat(0xb2aaa0,'concrete');for(const side of [-1,1])for(const x of [9,13]){const xx=side*x;box(.8,7,.8,xx,3.5,-6.8,stone);const arch=[];for(let i=0;i<=24;i++){const q=i*Math.PI/24;arch.push(new THREE.Vector3(xx+2*Math.cos(q),7+3*Math.sin(q),-6.8));}const mesh=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(arch),32,.17,8,false),stone);group.add(mesh);}for(let i=0;i<5;i++){box(3,.16,.7,-11,.75,-3+i*1.6,wood);box(3,.16,.7,11,.75,-3+i*1.6,wood);}lamp(-9,5,-5,.4,0xffc17a);lamp(9,5,-5,.4,0xffc17a);sign('NEF / MAPPING ARCHITECTURAL',0,8,-7.3,6);
 }else if(family==='street'){
  box(32,12,.3,0,6,-7.7,brick);for(const x of [-12,-8,8,12]){box(2.4,3,.18,x,7.5,-7.4,dark);box(2.1,2.7,.05,x,7.5,-7.27,new THREE.MeshBasicMaterial({color:0x66776e}));}box(34,.18,1.3,0,.12,-5.9,concrete);sign('COUR / ARTS NOCTURNES',0,6.6,-7.2,5);for(const x of [-10,10]){rod([x,0,-4],[x,6,-4],.075);lamp(x,6,-4,.8);}caseBox(-7,-4);
 }else{
  // Public production venues: distinct roof, audience architecture, stage wings.
  const isFestival=family==='festival',isArena=family==='arena';for(const x of [-10,10]){truss(x,-6.4,isFestival?9:7);speaker(x,-5.5);caseBox(x,-3,1.6);}rod([-10,7,-6.4],[10,7,-6.4],.1);box(20,.3,2,0,.13,-6.3,dark);
  for(const side of [-1,1]){for(let j=0;j<5;j++){box(.1,5,.15,side*(10.9+j*.6),3,-6.7,dark);box(.025,4.6,.03,side*(10.9+j*.6),3,-6.59,new THREE.MeshBasicMaterial({color:side<0?0x578eaa:0xb89572}));}lamp(side*8,6.7,-4,1.5,side<0?0x83b7cf:0xd5a779);}
  if(isFestival){box(25,.3,6,0,9,-4.4,steel);for(const x of [-12,12]){truss(x,-1.4,9);box(2.4,5.5,.15,x,4,-6.5,mat(0x3c6674));sign('LIVE',x,5,-6.35,2);}for(let j=0;j<6;j++)rod([-13+j*5,1,-.5],[-9+j*5,1,-.5],.045);}
  if(isArena){for(const side of [-1,1])for(let j=0;j<4;j++){box(3,.5+j*.45,15,side*(12+j*.6),(.5+j*.45)/2,1,dark);for(let k=0;k<6;k++)box(.45,.5,.5,side*(11.7+j*.6),.7+j*.45,-4+k*2,mat(0x65595a));}}
  if(family==='club'){for(const x of [-12,12])box(2.8,1.3,2,x,.7,-3,mat(0x4b3e4d));}
  sign(isFestival?'FESTIVAL / SCÈNE '+num:isArena?'ARENA / AUDIOVISUEL':'SALLE / '+gig.venue,0,6.5,-7.1,6);
 }
 group.userData.props=group.children.length;return family;
 }
 function tick(){const inGig=document.body.classList.contains('screen-gig');const old=scene.getObjectByName('Production venue details');if(old)old.visible=!inGig&&!document.body.classList.contains('shop-closet');scene.children.forEach(o=>{if(o.userData.legacyTruss)o.visible=!inGig;});if(active)active.visible=inGig;}
 return {build,tick};
})();
