/* Catalogue hardware. Geometry and finishes are shared by previews and the world. */
window.GearModels=(()=>{
 const color=s=>new THREE.Color(s).convertSRGBToLinear();
 function rounded(w,h,d,r=.03){
  r=Math.min(r,w*.24,h*.24,d*.24);
  const x=w/2-r,y=h/2-r,c=Math.min(r,x*.5,y*.5),s=new THREE.Shape();
  s.moveTo(-x+c,-y);s.lineTo(x-c,-y);s.quadraticCurveTo(x,-y,x,-y+c);s.lineTo(x,y-c);s.quadraticCurveTo(x,y,x-c,y);s.lineTo(-x+c,y);s.quadraticCurveTo(-x,y,-x,y-c);s.lineTo(-x,-y+c);s.quadraticCurveTo(-x,-y,-x+c,-y);
  const g=new THREE.ExtrudeGeometry(s,{depth:d-2*r,bevelEnabled:true,bevelSize:r,bevelThickness:r,bevelSegments:3,curveSegments:4,steps:1});g.translate(0,0,-d/2+r);return g;
 }
 function consolidate(root){
  root.updateMatrixWorld(true);const batches=new Map(),originals=new Set();
  root.traverse(o=>{if(!o.isMesh)return;const copy=o.geometry.clone().applyMatrix4(o.matrixWorld),g=copy.index?copy.toNonIndexed():copy;
   if(g!==copy)copy.dispose();if(!batches.has(o.material))batches.set(o.material,[]);batches.get(o.material).push(g);originals.add(o.geometry);
  });root.clear();originals.forEach(g=>g.dispose());
  for(const [material,parts] of batches){const geometry=new THREE.BufferGeometry();
   for(const [name,size] of [['position',3],['normal',3],['uv',2]]){const a=new Float32Array(parts.reduce((n,g)=>n+g.attributes.position.count*size,0));let offset=0;for(const g of parts){const values=g.getAttribute(name)?.array;if(values)a.set(values,offset);offset+=g.attributes.position.count*size;}geometry.setAttribute(name,new THREE.BufferAttribute(a,size));}
   const mesh=new THREE.Mesh(geometry,material);mesh.castShadow=true;mesh.receiveShadow=true;root.add(mesh);parts.forEach(g=>g.dispose());
  }
 }
 function create(item){
  const group=new THREE.Group();group.name=item.label;group.userData={itemId:item.id,modelKind:'gear:'+item.type,designVersion:2};
  const siblings=shopItems.filter(i=>i.category==='gear'&&i.type===item.type),rank=Math.max(0,siblings.findIndex(i=>i.id===item.id)),slug=item.id.slice(item.type.length+1);
  const tint=['#74c5c1','#c5a267','#e19361'][Math.min(2,Math.floor(rank*3/Math.max(1,siblings.length)))];
  const mat=(c,roughness=.55,metalness=0)=>new THREE.MeshStandardMaterial({color:color(c),roughness,metalness});
  const shell=mat('#28343f',.39,.25),rubber=mat('#111821',.86),metal=mat('#aab9c5',.29,.78),edge=mat('#596976',.43,.6),ivory=mat('#dedbd0',.56,.04),accent=mat(tint,.4,.3),optic=mat('#274e66',.08,.62),gold=mat('#bea064',.26,.8),cloth=mat('#253440',.96);
  const led=mat('#a8e8da',.28);led.emissive=color('#51b6a2');led.emissiveIntensity=.45;
  const add=(geo,m,x=0,y=0,z=0)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);group.add(o);return o;};
  const box=(w,h,d,x,y,z,m=shell,r=.025)=>add(rounded(w,h,d,r),m,x,y,z);
  const cyl=(r,h,x,y,z,m=metal,n=32)=>add(new THREE.CylinderGeometry(r,r,h,n),m,x,y,z);
  const ring=(r,t,x,y,z,m=metal)=>add(new THREE.TorusGeometry(r,t,8,40),m,x,y,z);
  const tube=(points,r=.014,m=rubber)=>add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),32,r,8,false),m);
  function label(text,x,y,z,w=.3,h=.07,rotation=0,bg='#192731',fg='#cbd9dd'){
   const c=document.createElement('canvas');c.width=512;c.height=128;const d=c.getContext('2d');d.fillStyle=bg;d.fillRect(0,0,512,128);d.fillStyle=fg;d.font='600 42px Arial';d.textAlign='center';d.fillText(text,256,80,474);
   const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;const o=add(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t}),x,y,z);o.rotation.x=rotation;return o;
  }
  const screw=(x,y,z,axis='z')=>{const o=cyl(.012,.007,x,y,z,metal,12);if(axis==='z')o.rotation.x=Math.PI/2;if(axis==='x')o.rotation.z=Math.PI/2;};
  function ports(n,x,y,z,spacing=.105,back=false){for(let i=0;i<n;i++){box(.078,.04,.018,x+i*spacing,y,z,metal,.004);box(.058,.021,.02,x+i*spacing,y,z+(back?-.009:.009),rubber,.002);}}
  function feet(w,d){for(const x of [-w*.36,w*.36])for(const z of [-d*.32,d*.32])cyl(.035,.035,x,.02,z,rubber,16);}
  function display(w,h,x,y,z){
   const c=document.createElement('canvas');c.width=768;c.height=432;const d=c.getContext('2d');
   d.fillStyle='#18212b';d.fillRect(0,0,768,432);d.fillStyle='#35434f';d.fillRect(0,0,768,29);d.fillStyle='#dabc80';d.font='bold 15px Arial';d.fillText('RESOLUTE / LIVE WORKSPACE',18,21);
   for(let row=0;row<2;row++)for(let col=0;col<7;col++){const x=72+col*97,y=42+row*86;d.fillStyle=row?'#223e49':'#2d3a53';d.fillRect(x,y,87,70);d.strokeStyle=col%2?'#cdad73':'#6caebb';d.beginPath();for(let k=0;k<48;k++){const a=k*Math.PI/12,r=5+k*.5;const px=x+43+Math.cos(a+col)*r,py=y+32+Math.sin(a)*r*.66;if(!k)d.moveTo(px,py);else d.lineTo(px,py);}d.stroke();}
   for(let k=0;k<2;k++){d.fillStyle='#080e18';d.fillRect(16+k*250,226,236,155);d.strokeStyle=k?'#dfb876':'#60babe';for(let n=0;n<7;n++){d.strokeRect(30+k*250+n*10,240+n*8,208-n*20,127-n*16);}}
   for(let i=0;i<6;i++){d.fillStyle='#65798a';d.fillRect(537+i*36,239,8,140);d.fillStyle=i%2?'#ccac76':'#63ada7';d.fillRect(529+i*36,260+i*13,24,11);}
   d.fillStyle='#475767';d.fillRect(18,404,732,8);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return add(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t,toneMapped:false}),x,y,z);
  }
  function fan(x,y,z,r,front=false){
   const disc=cyl(r,.025,x,y,z,rubber);if(front)disc.rotation.x=Math.PI/2;
   const rim=ring(r*.89,.008,x,front?y:y+.015,front?z+.018:z,edge);if(!front)rim.rotation.x=-Math.PI/2;
   for(let j=0;j<9;j++){const a=j*Math.PI*2/9;const b=box(r*.18,.012,r*.7,x+Math.sin(a)*r*.36,y+.018,z+Math.cos(a)*r*.36,edge,.005);b.rotation.y=a+.35;
    if(front){b.position.set(x+Math.sin(a)*r*.36,y+Math.cos(a)*r*.36,z+.026);b.rotation.set(Math.PI/2,0,-a-.35);}}
   const hub=cyl(r*.19,.036,x,y+.023,z,metal);if(front){hub.position.set(x,y,z+.03);hub.rotation.x=Math.PI/2;}
  }
  function controller(compact=false){
   const cols=compact?4:rank===2?8:4,rows=compact?2:rank===0?2:3,w=cols*.13+.21,d=.55;
   box(w,.095,d,0,.07,0,rubber);box(w-.025,.026,d-.025,0,.131,0,shell);
   for(const x of [-w/2+.02,w/2-.02])box(.032,.12,d-.02,x,.092,0,rank>0?accent:edge);
   for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){const x=-(cols-1)*.065+col*.13,z=.16-row*.11;box(.102,.023,.084,x,.16,z,row===1?accent:ivory,.013);box(.054,.002,.008,x,.173,z,row===1?rubber:accent);}
   for(let j=0;j<Math.min(cols,6);j++){const x=-(cols-1)*.065+j*.13;cyl(.032,.044,x,.169,-.185,rubber,24);box(.008,.005,.022,x,.194,-.185,ivory);}
   ports(1,-.03,.077,-d/2-.007,.1,true);label(compact?'PAD / MINI':rank===2?'SHOW CONTROL':'PAD / LIVE',0,.132,.278,w*.55,.027);feet(w,d);
  }
  if(item.type==='projector'){
   const w=[.88,1.04,.91,1.10,1.25,1.34][rank],h=[.24,.26,.31,.25,.4,.44][rank],d=[.62,.67,.69,.67,.85,.94][rank],y=.065+h/2,front=d/2;
   const bodyMat=rank<3?ivory:shell;
   box(w,h,d,0,y,0,bodyMat,.065);box(w-.035,.027,d-.035,0,y+h/2-.018,0,rank===0?ivory:rank<3?metal:edge,.04);
   box(w-.015,.026,d-.015,0,.069,0,rubber,.03);feet(w,d);
   const lx=rank<3?w*.23:rank===3?-w*.22:0,lr=rank===2?.185:rank>3?.177:.107,ly=y+.006;
   box(rank>3?.43:w*.42,h*.68,.022,rank>3?0:lx,ly,front+.007,rubber,.025);
   for(let j=0;j<3;j++){const b=cyl(lr+j*.011,.048,lx,ly,front+.025+j*.035,j===1?edge:rubber,48);b.rotation.x=Math.PI/2;}
   const lens=cyl(lr*.82,.012,lx,ly,front+.132,optic,48);lens.rotation.x=Math.PI/2;ring(lr*.65,.006,lx,ly,front+.14,accent);
   const glint=add(new THREE.SphereGeometry(lr*.27,18,10),new THREE.MeshBasicMaterial({color:color('#a8cdde'),transparent:true,opacity:.45}),lx-lr*.22,ly+lr*.23,front+.143);glint.scale.set(1,.23,.025);
   for(let j=0;j<(rank>3?8:7);j++)box(.017,h*.43,.014,-w*.40+j*.035,ly,front+.015,rubber,.002);
   for(const s of [-1,1]){for(let j=0;j<9;j++)box(.009,h*.41,.02,s*(w/2+.002),ly,-d*.32+j*.045,rubber,.001);for(const z of [-d*.3,d*.3])screw(s*(w*.43),y+h/2+.004,z,'y');}
   for(let j=0;j<3;j++)cyl(.014,.006,w*.29+j*.035,y+h/2+.01,-d*.28,j===0?led:rubber,16);
   label(item.label.split(' ')[0].toUpperCase(),-w*.20,ly+h*.35,front+.017,w*.40,.038,0,rank<3?'#d4d5ce':'#28343f',rank<3?'#263640':'#d3dcda');
   ports(rank>3?3:1,-.18,ly,-front-.012,.14,true);
   if(rank>3){for(const s of [-1,1])tube([[s*w*.46,.12,-d*.36],[s*(w/2+.075),.13,-d*.36],[s*(w/2+.075),y+h*.45,-d*.36],[s*w*.44,y+h*.45,-d*.36]],.029,metal);
    for(const x of [-w*.4,w*.4])box(.10,h+.045,.075,x,y,front*.87,rank===4?accent:rubber,.025);
    label(rank===5?'4K / LASER':'STAGE / 6500',w*.26,ly,front+.02,.25,.052);
   }
   if(rank===0){const tape=label('A / 01',-.25,y+h/2+.02,.10,.17,.065,-Math.PI/2,'#b4aa87','#373d3a');tape.rotation.z=.08;}
  }else if(item.type==='computer'){
   if(slug.includes('laptop')){
    const w=.98+rank*.10,d=.66+rank*.025,h=.57+rank*.04,m=rank===2?metal:rank===1?shell:edge;
    box(w,.047,d,0,.048,0,m,.024);feet(w,d);box(w*.81,.01,.31,0,.076,-.075,rubber,.02);
    for(let row=0;row<4;row++)for(let col=0;col<11;col++)box(w*.062,.008,.048,-w*.365+col*w*.073,.086,-.185+row*.07,rank===0?edge:rubber,.004);
    box(w*.30,.003,.115,0,.077,.213,rank===2?ivory:shell,.01);
    const panel=new THREE.Group();panel.position.set(0,.084,-d/2+.03);panel.rotation.x=-.13;group.add(panel);
    const attach=o=>{group.remove(o);panel.add(o);return o;};attach(box(w,h,.035,0,h/2,0,m,.02));attach(box(w-.04,h-.035,.009,0,h/2,.022,rubber,.01));attach(display(w-.105,h-.085,0,h/2,.029));attach(cyl(.008,.006,0,h-.019,.028,rubber,12)).rotation.x=Math.PI/2;
    ports(1,-w*.30,.049,d/2+.003);label(rank===2?'PRO / ART':rank===1?'STAGE / GTX':'FIELD / 01',w*.28,.075,.18,w*.18,.035,-Math.PI/2,'#26343e',tint);
    for(let j=0;j<8;j++)box(.055,.004,.012,-w*.46,.078,-.18+j*.03,rubber,.002);
   }else{
    const w=rank===4?.60:.49,h=1.02,d=.75;box(w,h,d,0,h/2+.06,0,rubber,.045);box(w-.04,h-.035,.025,0,h/2+.06,d/2+.012,shell,.015);feet(w,d);
    for(let j=0;j<(rank===4?3:2);j++)fan(0,.25+j*.27,d/2+.038,.109,true);
    box(.025,h-.06,d-.045,-w/2-.006,h/2+.06,0,edge,.02);const side=mat('#294452',.16,.35);side.transparent=true;side.opacity=.72;box(.016,h-.10,d-.055,w/2+.005,h/2+.06,0,side,.015);
    box(.025,.045,d*.65,w/2-.02,.4,0,accent,.005);
    label(rank===4?'SHOW / 4080':'STUDIO / 4060',0,.977,d/2+.037,w*.79,.059);ports(3,-.17,.74,-d/2-.012,.12,true);cyl(.026,.008,w*.32,h+.066,.20,led,24);
   }
  }else if(item.type==='gpu'){
   const w=rank===2?1.12:.86,d=.37;box(w,.08,d,0,.12,0,rubber);box(w-.02,.018,d-.02,0,.075,0,mat('#344c40',.65));
   box(w*.67,.045,.02,-.03,.043,d/2,gold,.002);for(let j=0;j<18;j++)box(.008,.033,.022,-w*.32+j*w*.035,.04,d/2+.002,rubber,.001);
   for(let j=0;j<(rank===2?3:2);j++)fan(-w*.30+j*w*(rank===2?.30:.60),.179,0,.126);
   for(let j=0;j<16;j++)box(.014,.065,.30,-w*.43+j*w*.054,.122,0,metal,.002);
   box(.035,.24,d+.04,w/2+.025,.115,0,metal,.006);ports(1,-.14,.119,d/2+.015);label('RAYTRIX',0,.174,d/2+.011,w*.50,.032);
  }else if(item.type==='cable'){
   const loom=slug.includes('loom'),strands=loom?3:1;
   for(let k=0;k<strands;k++)for(let j=0;j<3;j++){const o=ring(.29+j*.022,.014,0,.045+k*.075+j*.014,0,rubber);o.rotation.x=-Math.PI/2;}
   for(let k=0;k<strands;k++)for(const s of [-1,1]){
    const x=s*(.40+k*.065),z=.26+k*.018; tube([[s*.20,.06+k*.075,.19],[s*.36,.045,.12],[x,.06,z]],.014);
    box(.075,.05,.13,x,.06,z+.065,rubber,.013);box(.078,.038,.066,x,.06,z+.157,metal,.009);box(.054,.019,.006,x,.06,z+.194,rubber,.002);box(.063,.004,.03,x,.087,z+.044,k===1?gold:k===2?ivory:accent,.002);
   }
   for(const s of [-1,1])box(.075,.045+strands*.065,.13,s*.29,.045+strands*.034,0,cloth,.01);
   label(loom?'LOOM / 3':slug.includes('fiber')?'FIBER / 150':rank===1?'ACTIVE / 75':'HDMI / 25',0,.042+strands*.075,.15,.25,.069,-Math.PI/2);
  }else if(item.type==='adapter'){
   const triple=slug.includes('3pack'),edid=slug.includes('edid');
   for(let j=0;j<(triple?3:1);j++){const x=triple?(j-1)*.23:0;box(.16,edid?.12:.07,edid?.28:.23,x,.06,0,rank?metal:rubber,.018);ports(1,x-.035,.06,edid?.151:.123);
    if(edid){label('EDID / LOCK',x,.123,0,.137,.059,-Math.PI/2);for(let k=0;k<4;k++)box(.015,.008,.035,x-.05+k*.03,.129,-.072,k===0?accent:rubber,.002);}
    else{tube([[x,.06,-.12],[x+.04,.045,-.23],[x-.02,.04,-.33]],.012);box(slug.includes('usb-c')?.07:.095,.034,.062,x-.02,.04,-.355,metal,.009);}
   }
  }else if(item.type==='router'){
   const w=[.40,.65,1.12][rank],h=rank===2?.14:.10,d=.40;box(w,h,d,0,h/2+.03,0,rubber);box(w-.025,.018,d-.025,0,h+.035,0,shell);
   ports(rank===0?2:rank===1?3:4,-w*.34,h/2+.035,d/2+.015,rank===0?.17:rank===1?.20:.18);
   ports(rank===2?4:1,-w*.32,h/2+.035,-d/2-.012,.18,true);
   for(let j=0;j<(rank===2?8:2);j++)box(.025,.008,.025,-w*.33+j*.057,h+.05,.09,j%3?rubber:led,.004);
   label(rank===2?'MATRIX / 4 × 4':rank===1?'MAPBOX / 3':'DUO / SPLIT',0,h+.048,-.06,w*.8,.078,-Math.PI/2);
   if(rank===2)for(const s of [-1,1]){box(.09,h,.12,s*(w/2+.025),h/2+.03,.15,metal);screw(s*(w/2+.036),h/2+.03,.218);}
  }else if(item.type==='console')controller();
  else if(item.type==='screen'){
   const portable=slug.includes('portable'),w=portable?.91:rank===1?1.27:1.06,h=w*9/16,y=h/2+(portable?.055:.30);
   box(w,h,.045,0,y,0,rubber,.018);box(w-.015,h-.015,.008,0,y,.026,edge,.012);display(w-.05,h-.055,0,y,.033);
   if(portable){tube([[-.32,.025,-.30],[-.32,h*.62,-.028]],.016,metal);tube([[.32,.025,-.30],[.32,h*.62,-.028]],.016,metal);}
   else{box(.079,.33,.065,0,.2,-.015,metal);box(.39,.027,.27,0,.025,0,shell,.04);}
   label('VIEW / '+(portable?'TOUCH':rank===1?'27':'24'),0,y-h*.472,.033,.19,.018);ports(1,-.19,y-.1,-.031,.1,true);
  }else if(item.type==='bag'){
   const w=rank===0?.70:rank===1?.50:.60,h=rank===0?.53:rank===1?.75:.88,d=rank===0?.30:.35;
   box(w,h,d,0,h/2+.03,0,cloth,.115);box(w*.78,h*.39,.085,0,h*.29,d/2+.015,rubber,.055);box(w*.83,.02,.019,0,h*.51,d/2+.057,edge,.004);
   for(const s of [-1,1]){tube([[s*w*.32,.14,-d/2],[s*w*.38,h*.46,-d/2-.13],[s*w*.24,h*.86,-d/2]],.032,rubber);tube([[s*w*.39,.10,d/2*.72],[s*w*.44,h*.45,d/2*.70],[s*w*.38,h*.87,d/2*.68]],.004,edge);}
   tube([[-.12,h+.014,0],[-.10,h+.10,0],[.10,h+.10,0],[.12,h+.014,0]],.02,rubber);label('ROADVAULT',0,h*.7,d/2+.007,w*.51,.073);
   for(const s of [-1,1]){box(.043,h*.64,.02,s*w*.29,h*.41,d/2+.065,rubber,.006);box(.061,.052,.03,s*w*.29,h*.55,d/2+.078,edge,.008);}
   if(rank===2)for(const s of [-1,1]){const wh=cyl(.05,.045,s*w*.35,.045,-d*.36,rubber);wh.rotation.x=Math.PI/2;}
  }else if(item.type==='accessory'){
   if(slug==='mini-controller'){
    box(.68,.08,.41,0,.065,0,rubber,.035);
    for(const x of [-.17,.17]){const pedal=box(.24,.045,.30,x,.139,.025,metal,.026);pedal.rotation.x=-.16;for(let j=0;j<6;j++)box(.19,.009,.014,x,.172+j*.006,-.075+j*.031,rubber,.003);cyl(.012,.009,x,.113,-.153,led,16);}
    label('STAGECUE / DUO',0,.066,.216,.42,.035);ports(1,-.03,.064,-.22,.1,true);
   }
   else if(slug==='gaff-pocket'){
    const shape=new THREE.Shape();shape.absarc(0,0,.24,0,Math.PI*2,false);const hole=new THREE.Path();hole.absarc(0,0,.145,0,Math.PI*2,true);shape.holes.push(hole);
    const roll=add(new THREE.ExtrudeGeometry(shape,{depth:.12,bevelEnabled:true,bevelSize:.005,bevelThickness:.004,bevelSegments:2,curveSegments:48}),rubber,0,.13,0);roll.rotation.x=Math.PI/2;
    for(const r of [.147,.222,.232]){const o=ring(r,.0025,0,.136,0,r===.147?ivory:edge);o.rotation.x=-Math.PI/2;}box(.22,.005,.12,.27,.009,0,rubber);
   }else if(slug==='wide-lens'){
    for(let j=0;j<5;j++){const o=cyl(.16+j*.01,.07,0,.23,-.14+j*.065,j%2?edge:rubber,48);o.rotation.x=Math.PI/2;}
    const o=cyl(.177,.015,0,.23,.178,optic,64);o.rotation.x=Math.PI/2;ring(.192,.007,0,.23,.19,gold);
    for(let j=0;j<24;j++){const a=j*Math.PI/12;box(.009,.03,.11,Math.sin(a)*.18,.23+Math.cos(a)*.18,-.02,edge,.002).rotation.z=-a;}
    box(.48,.06,.40,0,.03,0,rubber,.055);label('WIDE / 0.8',0,.025,.212,.23,.034);
   }else if(slug==='roadcase-pro'||slug==='mapping-kit'){
    const kit=slug==='mapping-kit',w=kit?.83:1.03,h=kit?.14:.62,d=kit?.55:.63;
    box(w,h,d,0,h/2+.08,0,rubber,.045);for(const y of [.08,h+.08]){box(w+.015,.027,d+.015,0,y,0,metal,.016);}
    for(const x of [-w/2,w/2])for(const z of [-d/2,d/2]){box(.047,h+.02,.047,x,h/2+.08,z,metal,.011);if(!kit){const wh=cyl(.06,.047,x,.055,z,rubber,20);wh.rotation.z=Math.PI/2;}}
    for(const x of [-w*.29,w*.29]){box(.065,.09,.02,x,h*.78,d/2+.025,metal,.007);box(.034,.045,.01,x,h*.78,d/2+.04,rubber,.004);}
    tube([[-.10,h*.46,d/2+.023],[-.10,h*.46-.035,d/2+.062],[.10,h*.46-.035,d/2+.062],[.10,h*.46,d/2+.023]],.014,metal);
    if(kit){box(w,.38,.065,0,.42,-d/2+.02,rubber,.04);box(w-.08,.29,.014,0,.42,-d/2+.063,cloth,.015);for(let j=0;j<4;j++){const marker=cyl(.017,.31,-.25+j*.095,h+.12,.07,j%2?metal:accent,16);marker.rotation.x=Math.PI/2;}box(.21,.035,.18,.22,h+.108,.04,ivory,.01);label('MAP / FIELD KIT',0,.43,-d/2+.074,.43,.067);}
    else{label('ROADVAULT / TOUR',0,.46,d/2+.035,.61,.079);label('FRAGILE   ↑↑',-.20,.23,d/2+.034,.23,.075,0,'#d9d0ad','#26343b');}
   }
  }
  if(!group.children.length)box(.4,.15,.3,0,.1,0);
  consolidate(group);return group;
 }
 return{create,rounded,consolidate};
})();
