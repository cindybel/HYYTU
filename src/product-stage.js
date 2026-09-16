/* Consistent studio lighting and framing for actual catalogue models. */
window.ProductStage=(()=>{
 function dispose(root){const gs=new Set(),ms=new Set(),ts=new Set();root.traverse(o=>{if(o.geometry)gs.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:o.material?[o.material]:[]){ms.add(m);for(const t of Object.values(m))if(t?.isTexture)ts.add(t);}});gs.forEach(g=>g.dispose());ms.forEach(m=>m.dispose());ts.forEach(t=>t.dispose());}
 function create(renderer){
  renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  const studio=new THREE.Scene();studio.background=new THREE.Color('#121b26');studio.fog=new THREE.Fog('#121b26',7,24);
  studio.add(new THREE.HemisphereLight(0xc5d7e9,0x45505a,.80));
  const key=new THREE.DirectionalLight(0xfff0d9,2.05);key.position.set(-3,5,4);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-2;key.shadow.camera.right=2;key.shadow.camera.top=2;key.shadow.camera.bottom=-2;key.shadow.camera.near=.1;key.shadow.camera.far=15;key.shadow.bias=-.0005;key.shadow.normalBias=.015;studio.add(key);
  const rim=new THREE.DirectionalLight(0xa9cee6,1.45);rim.position.set(3,2,-3);studio.add(rim);
  const fill=new THREE.DirectionalLight(0xaac2d9,.6);fill.position.set(3,1,4);studio.add(fill);
  const room=new THREE.Scene();room.add(new THREE.Mesh(new THREE.BoxGeometry(12,12,12),new THREE.MeshBasicMaterial({color:0x444b56,side:THREE.BackSide})));
  for(const [x,y,z,w,h] of [[-4,2,3,3,5],[4,3,1,2,4],[0,5,-2,5,2]]){const panel=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:0xffffff}));panel.position.set(x,y,z);panel.lookAt(0,0,0);room.add(panel);}
  const pmrem=new THREE.PMREMGenerator(renderer),environment=pmrem.fromScene(room,.12);studio.environment=environment.texture;dispose(room);pmrem.dispose();
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.MeshStandardMaterial({color:new THREE.Color('#111a24').convertSRGBToLinear(),roughness:1,metalness:0}));floor.rotation.x=-Math.PI/2;floor.position.y=-.004;floor.receiveShadow=true;studio.add(floor);
  const pivot=new THREE.Group();studio.add(pivot);const camera=new THREE.PerspectiveCamera(32,4/3,.01,100);
  let model=null,radius=1,height=1,baseDistance=3,zoom=1;
  function frame(aspect){camera.aspect=aspect;camera.updateProjectionMatrix();const vertical=THREE.MathUtils.degToRad(camera.fov/2),horizontal=Math.atan(Math.tan(vertical)*aspect);baseDistance=radius/Math.sin(Math.min(vertical,horizontal))*1.12;view('three-quarter');
   if(model){for(let n=0;n<3;n++){pivot.updateMatrixWorld(true);camera.updateMatrixWorld(true);const b=new THREE.Box3().setFromObject(pivot);let extent=0;for(const x of [b.min.x,b.max.x])for(const y of [b.min.y,b.max.y])for(const z of [b.min.z,b.max.z]){const p=new THREE.Vector3(x,y,z).project(camera);extent=Math.max(extent,Math.abs(p.x),Math.abs(p.y));}baseDistance*=Math.max(.7,Math.min(1.3,extent/.87));view('three-quarter');}}
  }
  function view(mode='three-quarter'){
   pivot.rotation.set(0,mode==='back'?Math.PI:mode==='front'?0:-.38,0);
   const d=baseDistance*zoom;camera.position.set(mode==='three-quarter'?d*.36:0,height*.44+d*.27,d*(mode==='three-quarter'?.91:1));camera.lookAt(0,height*.44,0);
  }
  function set(item){if(model){pivot.remove(model);dispose(model);}model=ItemModels.create(item);pivot.add(model);const box=new THREE.Box3().setFromObject(model),center=box.getCenter(new THREE.Vector3()),size=box.getSize(new THREE.Vector3());model.position.set(-center.x,-box.min.y,-center.z);radius=Math.max(.1,size.length()/2);height=size.y;zoom=1;frame(camera.aspect);return model;}
  function setZoom(value){zoom=THREE.MathUtils.clamp(value,.65,1.6);const d=camera.position.clone().sub(new THREE.Vector3(0,height*.44,0)).normalize();camera.position.copy(d.multiplyScalar(baseDistance*zoom)).add(new THREE.Vector3(0,height*.44,0));}
  function resize(w,h){renderer.setSize(Math.max(1,w),Math.max(1,h));frame(w/h);}
  function render(){renderer.render(studio,camera);}
  function close(){dispose(studio);environment.dispose();key.shadow.map?.dispose();}
  return{set,view,setZoom,resize,render,close,pivot,camera,scene:studio,get model(){return model}};
 }
 return{create,dispose};
})();
