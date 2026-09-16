/* New physical equipment follows the existing catalogue material and geometry language. */
window.PhysicalModels=(()=>{
 function create(item){if(item.id==='support-studio-cart')return StudioLife.createProjectorCart();const d=PhysicalCore.spec(item.id),kind=d.kind;
  if(item.id!=='router-sdi-distribution'&&!['container','speaker','keyboard','mouse','microphone','wireless','audio-console','receiver','converter','powerbar','outlet','surface','stand','sdi-card'].includes(kind)&&!(kind==='cable'&&!['cable-25ft-basic','cable-75ft-active','cable-150ft-fiber'].includes(item.id)))return null;
  const g=new THREE.Group();g.name=item.label;g.userData.itemId=item.id;
  const black=new THREE.MeshStandardMaterial({color:0x1d262c,roughness:.68}),metal=new THREE.MeshStandardMaterial({color:0x8a969e,metalness:.7,roughness:.32}),key=new THREE.MeshStandardMaterial({color:0x39444a,roughness:.8});
  function box(w,h,z,x,y,depth,m=black){const o=new THREE.Mesh(GearModels.rounded(w,h,z,Math.min(.015,h*.22)),m);o.position.set(x,y,depth);g.add(o);return o;}
  function tube(points,r=.009,m=black){const path=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),o=new THREE.Mesh(new THREE.TubeGeometry(path,32,r,6,false),m);g.add(o);return o;}
  function cyl(r,h,x,y,z,m=metal){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,20),m);o.position.set(x,y,z);g.add(o);return o;}
  if(kind==='container'){const w=.65,h=.46,d=.4;box(w,.04,d,0,.025,0);for(const x of [-w/2,w/2])box(.035,h,d,x,h/2+.025,0);for(const z of [-d/2,d/2])box(w,h,.025,0,h/2+.025,z);box(w-.06,.012,d-.05,0,.055,0,key);const lid=new THREE.Group();lid.position.set(0,h+.03,-d/2);g.add(lid);const flap=box(w+.03,.045,d+.02,0,h+.05,0);g.remove(flap);flap.position.set(0,0,d/2);lid.add(flap);if(item.physicalOpen)lid.rotation.x=-1.65;g.userData.containerOpen=Boolean(item.physicalOpen);}
  else if(kind==='outlet'&&item.physicalPortCount<=2){box(.16,.22,.026,0,.11,0,new THREE.MeshStandardMaterial({color:0xd7d5c9,roughness:.55}));}
  else if(kind==='speaker'){for(const x of [-.18,.18]){box(.20,.28,.18,x,.16,0);for(const [y,r] of [[.14,.062],[.245,.025]]){const speaker=cyl(r,.012,x,y,.096,key);speaker.rotation.x=Math.PI/2;}}tube([[-.18,.035,-.1],[0,.01,-.16],[.18,.035,-.1]],.007);}
  else if(kind==='keyboard'){box(.48,.027,.18,0,.02,0);for(let row=0;row<5;row++)for(let col=0;col<14;col++)box(.025,.008,.024,-.216+col*.032,.04,-.063+row*.029,key);box(.16,.009,.022,0,.045,.054,metal);tube([[.13,.02,-.09],[.18,.008,-.18],[.34,.008,-.2]]);}
  else if(kind==='mouse'){const o=new THREE.Mesh(new THREE.SphereGeometry(1,20,12),black);o.scale.set(.035,.022,.06);o.position.y=.02;g.add(o);box(.002,.004,.052,0,.042,-.02,metal);cyl(.007,.012,0,.044,-.02).rotation.z=Math.PI/2;if(!d.wireless)tube([[0,.016,-.055],[.01,.01,-.15],[.11,.008,-.22]]);}
  else if(kind==='microphone'||kind==='wireless'){cyl(.025,.23,0,.15,0,black);const head=new THREE.Mesh(new THREE.SphereGeometry(.045,20,14),metal);head.position.y=.3;g.add(head);for(let i=0;i<6;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(.044,.0015,4,24),black);ring.rotation.x=Math.PI/2;ring.position.y=.278+i*.009;g.add(ring);}box(.02,.012,.01,0,.17,.025,metal);}
  else if(kind==='cable'){for(let j=0;j<3;j++){const ring=new THREE.Mesh(new THREE.TorusGeometry(.14+j*.016,.009,8,40),black);ring.rotation.x=Math.PI/2;ring.position.y=.018+j*.009;g.add(ring);}for(const x of [-.13,.13]){tube([[x,.025,.08],[x,.03,.2]],.009);if(['SDI','XLR'].includes(d.standard)){const o=cyl(d.standard==='XLR'?.015:.011,.055,x,.03,.22);o.rotation.x=Math.PI/2;}else{box(d.standard==='VGA'?.042:.025,.02,.04,x,.027,.23);box(d.standard==='VGA'?.034:.019,.012,.02,x,.027,.26,metal);}}}
  else if(kind==='surface'){box(1.6,.9,.025,0,1.35,0,new THREE.MeshStandardMaterial({color:0xe1dfd3}));cyl(.018,.85,0,.43,0);box(.65,.035,.42,0,.03,0);}
  else if(kind==='stand'){cyl(.028,1.4,0,.7,0);box(.55,.04,.48,0,1.42,0);for(const x of [-.3,.3])tube([[0,.25,0],[x,.02,.24]],.018,metal);tube([[-.2,1.4,0],[-.2,1.1,-.1],[.2,1.4,0]],.007,black);}
  else{const w=kind==='splitter'?.6:kind==='powerbar'?.52:kind==='outlet'?.85:kind==='audio-console'?.43:.25,z=kind==='audio-console'?.34:.15;box(w,.065,z,0,.05,0);box(w-.012,.01,z-.012,0,.088,0,metal);for(let i=0;i<(['powerbar','outlet'].includes(kind)?0:kind==='audio-console'?4:2);i++){box(.035,.008,.025,-w*.4+i*w*.8/((kind==='outlet'?12:kind==='powerbar'?6:kind==='audio-console'?4:2)-1),.097,0);}}
  GearModels.consolidate(g);return g;
 }
 return{create};
})();
