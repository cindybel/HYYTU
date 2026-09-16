/* Rounded garment meshes, shared by the shop, shelves and 3D inspector. */
window.ClothingModels=(()=>{
 const palette={'hoodie-vj':'#24262d','jacket-blackout':'#141c24','jacket-reflective':'#b0bfc8','coat-tour':'#4c414c','vest-led':'#152632','full-fit-pro':'#263847','pants-cargo':'#344039','pants-tech':'#202c39','beanie-black':'#28232d','cap-low':'#24303b','gloves-stage':'#222832','mask-club':'#23333d'};
 function fabric(){const c=document.createElement('canvas');c.width=c.height=128;const d=c.getContext('2d');d.fillStyle='#888';d.fillRect(0,0,128,128);for(let i=0;i<128;i+=2){d.fillStyle=i%4?'#9b9b9b':'#6b6b6b';d.fillRect(i,0,1,128);d.fillStyle='#7b7b7b';d.fillRect(0,i,128,1);}const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(3,3);return t;}
 function create(item){
  const id=item.id.replace('clothing-',''),g=new THREE.Group();g.name=item.label;g.userData={itemId:item.id,modelKind:'clothing:clothing'};
  const mat=(color,roughness=.78,metalness=0)=>new THREE.MeshStandardMaterial({color:new THREE.Color(color).convertSRGBToLinear(),roughness,metalness});
  const cloth=mat(palette[id]||'#202831'),rib=mat('#151d25'),seam=mat('#5b6770'),metal=mat('#9aaebc',.3,.72),rubber=mat('#19212a'),sole=mat('#bbc4c5',.7),accent=mat(id==='shoes-magenta'?'#e559ac':'#54c6cd',.42,.15);
  cloth.bumpMap=fabric();cloth.bumpScale=.007;if(id==='jacket-reflective'){cloth.metalness=.48;cloth.roughness=.32;}
  const add=(geo,m,x=0,y=0,z=0)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);g.add(o);return o;};
  const oval=(x,y,z,sx,sy,sz,m)=>{const o=add(new THREE.SphereGeometry(1,32,20),m,x,y,z);o.scale.set(sx,sy,sz);return o;};
  const line=(pts,r=.004,m=seam)=>add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(...p))),Math.max(8,pts.length*5),r,7,false),m);
  const loop=(x,y,z,rx,ry,m=seam,r=.004)=>line(Array.from({length:49},(_,i)=>[x+rx*Math.cos(i*Math.PI/24),y+ry*Math.sin(i*Math.PI/24),z]),r,m);
  const patch=(x,y,z,w,h,m=cloth,r=.018)=>{const s=new THREE.Shape();s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);return add(new THREE.ExtrudeGeometry(s,{depth:.009,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.004,bevelThickness:.004,curveSegments:8}),m,x,y,z);};
  // Elliptic cross-sections give fabric volume, a taper and small seam folds.
  const loft=(sections,m=cloth,fold=.012,arc=0)=>{if(m===rib){fold=0;sections=sections.map(([y,x,z,rx,rz])=>[y,x,z,rx*1.06,rz*1.06]);}const coarse=sections;sections=[];for(let j=0;j<coarse.length-1;j++){for(let n=0;n<6;n++){const t=n/6;sections.push(coarse[j].map((_,k)=>{const a=coarse[Math.max(0,j-1)][k],b=coarse[j][k],c=coarse[j+1][k],d=coarse[Math.min(coarse.length-1,j+2)][k];return .5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t*t+(-a+3*b-3*c+d)*t*t*t);}));}}sections.push(coarse[coarse.length-1]);const pos=[],uv=[],ix=[],N=64;sections.forEach(([y,x,z,rx,rz],j)=>{for(let i=0;i<=N;i++){const a=arc+(Math.PI*2-arc*2)*i/N,f=1+fold*Math.sin(a*12+j*.13);pos.push(x+Math.sin(a)*rx*f,y,z+Math.cos(a)*rz*f);uv.push(i/N,j/(sections.length-1));if(j&&i){const k=j*(N+1)+i;ix.push(k,k-1,k-N-2,k,k-N-2,k-N-1);}}});const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(ix);geo.computeVertexNormals();return add(geo,m);};
  const logo=(x,y,z,w=.12,h=.06,text='VJ / 01')=>{const c=document.createElement('canvas');c.width=256;c.height=128;const d=c.getContext('2d');d.fillStyle='#14212a';d.fillRect(0,0,256,128);d.strokeStyle='#70d5d5';d.lineWidth=5;d.strokeRect(9,9,238,110);d.font='bold 37px Arial';d.textAlign='center';d.fillStyle='#d3e5e3';d.fillText(text,128,79);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;add(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t}),x,y,z);};
  const pants=(off=0,scale=1)=>{const prior=new Set(g.children);loft([[.82,0,0,.30,.14],[.92,0,0,.32,.145],[1,0,0,.31,.14]],cloth,.006);for(const s of [-1,1]){loft([[.06,s*.18,.025,.115,.115],[.12,s*.18,.025,.12,.115],[.35,s*.175,0,.135,.12],[.62,s*.17,0,.15,.135],[.86,s*.155,0,.15,.14]],cloth,.018);loft([[.05,s*.18,.025,.116,.116],[.12,s*.18,.025,.12,.117]],rib,.012);line([[s*.26,.96,.10],[s*.30,.73,.07],[s*.30,.46,.08],[s*.295,.14,.04]],.0035);patch(s*.21,.61,.13,.155,id==='pants-cargo'?.18:.12,rib);patch(s*.21,.69,.146,.165,.037,cloth);for(const y of [.95,.9])line([[s*.04,y,.14],[s*.28,y,.1]],.003);}
   patch(0,.955,.146,.066,.052,metal,.006);line([[0,.91,.15],[0,.81,.155]],.004,metal);
   for(const o of g.children)if(!prior.has(o)){o.scale.multiplyScalar(scale);o.position.multiplyScalar(scale);o.position.y+=off;}
  };
  if(['hoodie-vj','jacket-blackout','jacket-reflective','coat-tour','vest-led','full-fit-pro'].includes(id)){
   const long=id==='coat-tour',vest=id==='vest-led',hood=id==='hoodie-vj',bottom=long?.12:.42;
   loft([[bottom,0,0,long?.35:.285,.15],[bottom+.06,0,0,long?.35:.29,.15],[.62,0,0,.29,.16],[.85,0,0,.33,.175],[1.05,0,0,.36,.165],[1.14,0,0,.30,.14],[1.21,0,0,.13,.10]],cloth,.015);
   loft([[bottom,0,0,long?.35:.285,.151],[bottom+.055,0,0,long?.35:.29,.153]],rib,.025);
   for(const s of [-1,1]){
    if(!vest){loft([[.39,s*.50,0,.088,.092],[.45,s*.495,0,.091,.095],[.65,s*.455,0,.108,.11],[.84,s*.405,0,.12,.13],[1.03,s*.32,0,.135,.145],[1.11,s*.285,0,.105,.12]],cloth,.02);loft([[.38,s*.50,0,.087,.09],[.455,s*.495,0,.093,.096]],rib,.024);line([[s*.37,1.03,.10],[s*.46,.75,.10],[s*.50,.47,.075]],.003);}
    line([[s*.29,bottom+.08,.05],[s*.295,.75,.11],[s*.32,1.04,.07]],.003);
    if(hood){const p=patch(s*.11,.64,.168,.20,.12,cloth);p.rotation.z=s*.12;line([[s*.045,.69,.19],[s*.19,.60,.18]],.006,rib);}
    else{patch(s*.18,long?.53:.68,.158,.165,.17,rib);patch(s*.18,long?.61:.76,.173,.18,.04,cloth);line([[s*.10,.98,.176],[s*.24,.98,.159]],.006,metal);}
   }
   if(hood){loft([[1.09,0,-.055,.19,.13],[1.23,0,-.07,.215,.18],[1.4,0,-.07,.18,.16],[1.47,0,-.06,.07,.085],[1.48,0,-.055,.01,.03]],cloth,.006,.75);for(const s of [-1,1])line([[s*.12,1.21,.09],[s*.08,1.08,.19],[s*.095,.93,.187]],.006,sole);logo(.12,.91,.18,.14,.07);}
   else{loft([[1.17,0,0,.136,.104],[1.26,0,0,.135,.101]],rib,.004,.12);line([[0,bottom+.04,.156],[0,.75,.184],[0,1.2,.112]],.0045,metal);patch(.016,1.10,.156,.018,.045,metal,.004);logo(.18,.86,.163,.12,.056);}
   if(['jacket-reflective','vest-led','full-fit-pro'].includes(id)){for(const s of [-1,1])line([[s*.23,.80,.154],[s*.24,1.0,.144],[s*.15,1.16,.127]],id==='vest-led'?.012:.017,id==='vest-led'?accent:sole);line([[-.275,.54,.066],[-.18,.54,.138],[0,.54,.165],[.18,.54,.138],[.275,.54,.066]],.009,id==='vest-led'?accent:sole);}
   if(id==='full-fit-pro')pants(-.40,.83);
  }else if(id.startsWith('pants-'))pants();
  else if(id.startsWith('shoes-')){
   for(const x of [-.22,.22]){oval(x,.10,.075,.165,.080,.335,rubber);oval(x,.14,.085,.163,.073,.328,sole);loft([[-.19,x,-.28,.07,.075],[-.13,x,-.29,.12,.125],[-.04,x,-.28,.14,.12],[.10,x,-.245,.15,.090],[.28,x,-.215,.135,.070],[.385,x,-.175,.035,.018],[.397,x,-.174,.002,.002]],cloth,.002).rotation.x=Math.PI/2;oval(x,.409,-.078,.086,.012,.065,rib);oval(x,.364,-.015,.076,.033,.088,cloth);for(let i=0;i<5;i++){const z=-.045+i*.051,y=.406-i*.023;line([[x-.064,y,z-.019],[x+.064,y,z+.019]],.007,sole);line([[x+.064,y+.003,z-.019],[x-.064,y+.003,z+.019]],.006,sole);}for(const s of [-1,1]){line([[x+s*.138,.20,-.12],[x+s*.151,.20,.05],[x+s*.13,.205,.25]],.014,accent);line([[x+s*.157,.116,-.14],[x+s*.165,.116,.08],[x+s*.143,.12,.30]],.004,rubber);}patch(x,.31,-.191,.035,.10,accent,.005);}
  }else if(id.startsWith('headphones-')){
   const pro=id.endsWith('pro');line(Array.from({length:33},(_,i)=>[Math.cos(i*Math.PI/32)*.31,.45+Math.sin(i*Math.PI/32)*.36,0]),.043,rubber);line(Array.from({length:29},(_,i)=>[Math.cos(.1+i*(Math.PI-.2)/28)*.325,.45+Math.sin(.1+i*(Math.PI-.2)/28)*.375,-.005]),.011,metal);
   for(const s of [-1,1]){oval(s*.315,.40,0,.083,.14,.104,cloth);oval(s*.275,.40,0,.04,.122,.092,rubber);oval(s*.371,.40,0,.025,pro?.113:.085,.085,metal);line([[s*.30,.51,-.06],[s*.375,.50,0],[s*.34,.32,.045]],.012,metal);if(pro){const o=add(new THREE.TorusGeometry(.071,.006,8,40),accent,s*.398,.40,0);o.rotation.y=Math.PI/2;}logo(s*.32,.4,.107,.07,.034,pro?'PRO':'VJ');}if(pro)line([[.32,.30,.03],[.27,.20,.17],[.12,.20,.27]],.012,rubber);
  }else if(id==='beanie-black'||id==='cap-low'){
   const cap=id==='cap-low';add(new THREE.SphereGeometry(.30,48,28,0,Math.PI*2,0,Math.PI/2),cloth,0,.14,0).scale.set(1,cap?.85:1.15,1);loft([[.09,0,0,.30,.30],[.16,0,0,.305,.305],[.21,0,0,.296,.296]],rib,.012);
   if(cap){const visor=oval(0,.12,.27,.30,.025,.23,cloth);visor.rotation.x=.10;line([[-.23,.13,.32],[-.16,.105,.455],[0,.10,.488],[.16,.105,.455],[.23,.13,.32]],.003,sole);for(const a of [-1,0,1])line([[Math.sin(a)*.29,.19,Math.cos(a)*.29],[Math.sin(a)*.2,.33,Math.cos(a)*.2],[0,.395,0]],.003);oval(0,.4,0,.027,.01,.027,rib);}
   else for(let i=0;i<56;i++){const a=i*Math.PI/28;line([[Math.sin(a)*.305,.10,Math.cos(a)*.305],[Math.sin(a)*.305,.17,Math.cos(a)*.305],[Math.sin(a)*.298,.21,Math.cos(a)*.298]],.0025,seam);}logo(0,.18,.307,.10,.065);
  }else if(id==='gloves-stage'){
   for(const s of [-1,1]){const x=s*.24;oval(x,.26,0,.11,.15,.048,cloth);loft([[.045,x,0,.092,.052],[.13,x,0,.094,.052]],rib,.012);for(let j=0;j<4;j++){const fx=x-.077+j*.05,h=.14+(1-Math.abs(j-1.5)/2)*.07;oval(fx,.37+h/2,0,.023,h/2+.015,.026,cloth);line([[fx-.018,.41,.023],[fx,.418,.027],[fx+.018,.41,.023]],.003,seam);}const thumb=oval(x+s*.117,.265,.005,.035,.105,.038,cloth);thumb.rotation.z=-s*.45;patch(x,.25,.048,.13,.12,rib);line([[x-.067,.13,.047],[x+.067,.13,.047]],.006,accent);}
  }else if(id==='mask-club'){
   oval(0,.3,0,.29,.135,.135,cloth);for(const s of [-1,1])loop(s*.29,.30,-.015,.12,.108,rib,.008);for(let j=-1;j<=1;j++)line([[-.21,.3+j*.042,.07],[-.10,.305+j*.045,.128],[0,.31+j*.045,.14],[.1,.305+j*.045,.128],[.21,.3+j*.042,.07]],.0045,accent);line([[-.12,.40,.075],[0,.43,.08],[.12,.40,.075]],.004,metal);
  }else{const o=add(new THREE.CylinderGeometry(.19,.19,.033,64),metal,0,.24,0);o.rotation.x=Math.PI/2;const face=add(new THREE.CylinderGeometry(.17,.17,.035,64),rubber,0,.24,.018);face.rotation.x=Math.PI/2;loop(0,.24,.040,.146,.146,accent,.007);logo(0,.24,.042,.21,.12,'VJ');}
  return g;
 }
 return {create,palette};
})();
