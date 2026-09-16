/* Visible sockets, plugs and cable jackets. Connections still belong to PhysicalCore. */
window.PhysicalCables=(()=>{
 const wires=new Map();
 const colors={VGA:0x466db3,HDMI:0x319b91,DP:0x537b8b,'USB-C':0x537b8b,SDI:0xc49442,XLR:0x9374b6,USB:0x808995,POWER:0x756956};
 const material=(color,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness:.58,metalness});
 function ports(root,o,bounds){
  const group=new THREE.Group();group.name='physical-ports';root.add(group);
  const size=bounds.getSize(new THREE.Vector3()),width=Math.max(.16,Math.min(size.x*.85,.85)),cols=Math.min(PhysicalCore.spec(o.modelId).kind==='outlet'?12:PhysicalCore.spec(o.modelId).kind==='powerbar'?7:5,o.ports.length),rows=Math.ceil(o.ports.length/cols);
  o.ports.forEach((p,i)=>{
   const socket=new THREE.Group();socket.userData.endpoint={device:o.uid,port:p.id};socket.name='socket-'+p.id;
   const kind=PhysicalCore.spec(o.modelId).kind;
   if(kind==='laptop'){
    const left=['power','vga','audio'].includes(p.id),bank=o.ports.filter(q=>['power','vga','audio'].includes(q.id)===left),n=bank.findIndex(q=>q.id===p.id);
    socket.position.set(left?bounds.min.x-.008:bounds.max.x+.008,.026,bounds.min.z+size.z*.18+(n+.5)*size.z*.62/bank.length);socket.rotation.y=left?-Math.PI/2:Math.PI/2;
   }else if(kind==='outlet'&&o.ports.length===2){socket.position.set(0,.065+i*.082,bounds.max.z+.008);
   }else if(kind==='powerbar'){
    socket.position.set((i-(o.ports.length-1)/2)*width/o.ports.length,bounds.max.y+.009,0);socket.rotation.x=-Math.PI/2;
   }else{
    const rear=['projector','tower','monitor','speaker','keyboard','mouse'].includes(kind);
    socket.position.set((i%cols-(cols-1)/2)*width/Math.max(cols,1),Math.min(size.y*.7,.13)+(Math.floor(i/cols)-(rows-1)/2)*.072,rear?bounds.min.z-.012:bounds.max.z+.012);if(rear)socket.rotation.y=Math.PI;
   }
   const round=['SDI','XLR','AUX'].includes(p.standard),w=Math.min(.07,width/Math.max(cols,1)*.8);
   const shell=new THREE.Mesh(round?new THREE.CylinderGeometry(w*.45,w*.45,.014,16):new THREE.BoxGeometry(w,.036,.014),material(0x77858b,.65));
   if(round)shell.rotation.x=Math.PI/2;socket.add(shell);
   const hole=new THREE.Mesh(round?new THREE.CircleGeometry(w*.32,16):new THREE.PlaneGeometry(w*.76,.022),material(0x070c10));hole.position.z=.008;socket.add(hole);
   if(p.standard==='VGA'){hole.material.color.setHex(0x264b91);for(let row=0;row<3;row++)for(let col=0;col<5;col++){const pin=new THREE.Mesh(new THREE.CircleGeometry(.0012,6),material(0x101b26));pin.position.set((col-2)*.006+(row%2)*.002,(row-1)*.006,.009);socket.add(pin);}}
   if(p.standard==='MAINS'){hole.material.color.setHex(0xd1cbbd);for(const x of [-.009,.009]){const slot=new THREE.Mesh(new THREE.PlaneGeometry(.004,.012),material(0x10151a));slot.position.set(x,.003,.009);socket.add(slot);}const ground=new THREE.Mesh(new THREE.CircleGeometry(.0035,10),material(0x10151a));ground.position.set(0,-.006,.01);socket.add(ground);}
   if(p.standard==='IEC')for(const [x,y] of [[-.009,-.002],[.009,-.002],[0,.008]]){const pin=new THREE.Mesh(new THREE.BoxGeometry(.003,.008,.004),material(0xadaf9f,.8));pin.position.set(x,y,.012);socket.add(pin);}
   if(p.standard==='HDMI'){const sh=new THREE.Shape();sh.moveTo(-w*.36,.009);sh.lineTo(w*.36,.009);sh.lineTo(w*.25,-.008);sh.lineTo(-w*.25,-.008);sh.closePath();hole.geometry.dispose();hole.geometry=new THREE.ShapeGeometry(sh);const tongue=new THREE.Mesh(new THREE.PlaneGeometry(w*.45,.003),material(0xaf9a70));tongue.position.z=.01;socket.add(tongue);}
   const indicator=new THREE.Mesh(new THREE.TorusGeometry(w*.65,.0035,5,20),new THREE.MeshBasicMaterial({color:0x54ed9d}));indicator.name='port-indicator';indicator.position.z=.012;indicator.visible=false;socket.add(indicator);
   const pick=new THREE.Mesh(new THREE.SphereGeometry(Math.max(.028,w*.65),8,6),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));socket.add(pick);
   const cv=document.createElement('canvas');cv.width=512;cv.height=100;const ctx=cv.getContext('2d');ctx.fillStyle='#10202a';ctx.fillRect(0,0,512,100);ctx.fillStyle='#ffffff';ctx.font='bold 30px Arial';ctx.textAlign='center';ctx.fillText(p.standard+' '+p.direction.toUpperCase()+' · '+p.id,256,62,490);
   const tex=new THREE.CanvasTexture(cv);const tag=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,depthTest:true}));tag.name='port-label';tag.raycast=()=>{};tag.scale.set(.24,.047,1);tag.position.set(0,.062,.025);socket.add(tag);
   socket.traverse(n=>n.userData.endpoint=socket.userData.endpoint);group.add(socket);
  });return group;
 }
 function updatePorts(root,o,cable,first,selected,state){
  for(const socket of root.getObjectByName('physical-ports').children){const p=o.ports.find(p=>p.id===socket.userData.endpoint.port),occupied=state.links.some(l=>[l.a,l.b].some(e=>e.device===o.uid&&e.port===p.id));
   const compatible=cable?.ends?.includes(p.standard)&&(!first||first.port.direction!==p.direction)&&!occupied&&!['shelf','bag','vehicle'].includes(o.location);
   const ring=socket.getObjectByName('port-indicator');ring.visible=Boolean(cable);ring.material.color.setHex(compatible?0x54ed9d:!occupied&&!first&&['VGA','HDMI','SDI','DP','USB-C'].includes(p.standard)&&!cable?.ends?.includes(p.standard)?0xe6b755:0xef6464);
   socket.getObjectByName('port-label').visible=Boolean(cable||selected===o.uid);
  }
 }
 function endpoint(models,e){const root=models.get(e.device),socket=root?.getObjectByName('socket-'+e.port);if(!socket)return null;return{point:socket.getWorldPosition(new THREE.Vector3()),direction:new THREE.Vector3(0,0,1).applyQuaternion(socket.getWorldQuaternion(new THREE.Quaternion()))};}
 function dispose(g){g.traverse(n=>{n.geometry?.dispose();n.material?.dispose();});g.removeFromParent();}
 function path(a,b,length,garage,floorY=.023){
  const floor=Math.max(.023,floorY);
  const straight=a.point.distanceTo(b.point),slack=Math.max(0,length-straight),drop=Math.min(Math.max(a.point.y,b.point.y)-floor,slack*.4+.06);
  const leadA=a.point.clone().addScaledVector(a.direction,.085),leadB=b.point.clone().addScaledVector(b.direction,.085);
  const lowA=leadA.clone().lerp(leadB,.16),lowB=leadA.clone().lerp(leadB,.84);lowA.y=Math.max(floor,a.point.y-drop);lowB.y=Math.max(floor,b.point.y-drop);
  const mid=lowA.clone().lerp(lowB,.5);mid.y=Math.max(floor,Math.min(lowA.y,lowB.y)-.12);mid.z+=Math.min(.4,slack*.12);
  const desk={left:-2.225,right:2.225,back:6.625,front:8.275,top:.92,bottom:.83};
  const aboveDesk=p=>garage&&p.x>desk.left-.02&&p.x<desk.right+.02&&p.z>desk.back-.02&&p.z<desk.front+.02&&p.y>desk.top;
  const onA=aboveDesk(a.point),onB=aboveDesk(b.point);
  function edge(p,toward){const choices=[new THREE.Vector3(desk.left-.09,desk.top+.07,p.z),new THREE.Vector3(desk.right+.09,desk.top+.07,p.z),new THREE.Vector3(p.x,desk.top+.07,desk.back-.09),new THREE.Vector3(p.x,desk.top+.07,desk.front+.09)];return choices.sort((x,y)=>x.distanceTo(p)+x.distanceTo(toward)-y.distanceTo(p)-y.distanceTo(toward))[0];}
  let points=[a.point,leadA,lowA,mid,lowB,leadB,b.point];
  if(onA&&onB){for(const p of [lowA,mid,lowB])p.y=Math.max(desk.top+.025,p.y);}
  else if(onA||onB){const e=edge(onA?leadA:leadB,onA?b.point:a.point),outside=e.clone();outside.y=Math.max(floor,Math.min(a.point.y,b.point.y)-.15);points=onA?[a.point,leadA,e,outside,lowB,leadB,b.point]:[a.point,leadA,lowA,outside,e,leadB,b.point];}
  const curve=new THREE.CatmullRomCurve3(points,false,'centripetal');
  // Sample the contact surface before computing arc length. Flat contact segments
  // must not leave zero-length intervals in Three's tangent interpolation.
  const samples=[];for(let i=0;i<=160;i++){const p=curve.getPoint(i/160);p.y=Math.max(floor,p.y);if(garage&&p.x>desk.left-.025&&p.x<desk.right+.025&&p.z>desk.back-.025&&p.z<desk.front+.025&&(onA&&onB||p.y>desk.bottom-.025))p.y=Math.max(desk.top+.026,p.y);if(!samples.length||p.distanceToSquared(samples.at(-1))>1e-10)samples.push(p);}
  const result=new THREE.CurvePath();for(let i=1;i<samples.length;i++)result.add(new THREE.LineCurve3(samples[i-1],samples[i]));if(!result.curves.length)result.add(new THREE.LineCurve3(a.point,a.point.clone().add(new THREE.Vector3(.001,0,0))));return result;
 }
 function draw(parent,id,a,b,definition,loose,garage,floorY,secured=false){
  if(![...a.point.toArray(),...b.point.toArray(),definition.length].every(Number.isFinite))throw new Error('Invalid cable endpoints '+id+' '+JSON.stringify({a:a.point,b:b.point,length:definition.length}));
  const key=[...a.point.toArray(),...b.point.toArray(),...a.direction.toArray(),...b.direction.toArray()].map(n=>n.toFixed(3)).join('|')+loose+garage+floorY+secured;
  let old=wires.get(id);if(old?.userData.key===key)return;if(old)dispose(old);
  const g=new THREE.Group();g.name=loose?'Cable held at one end':'Connected physical cable';g.userData={uid:id,key,physicalCable:true,loose};
  const cablePath=path(a,b,definition.length,garage,floorY),tooShort=cablePath.getLength()>definition.length+.15,color=colors[definition.standard]||0x596771;
  const jacket=new THREE.Mesh(new THREE.TubeGeometry(cablePath,64,definition.standard==='AUX'?.0035:.006,7,false),material(tooShort?0xb84337:0x28353c));jacket.name='cable-jacket';jacket.castShadow=true;jacket.receiveShadow=true;g.add(jacket);const pick=new THREE.Mesh(new THREE.TubeGeometry(cablePath,64,.026,5,false),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));pick.name='cable-pick';g.add(pick);
  if(secured)for(const t of [.22,.4,.6,.78]){const point=cablePath.getPoint(t),tangent=cablePath.getTangent(t);if(point.y>floorY+.055&&point.y<.935)continue;const tape=new THREE.Mesh(new THREE.BoxGeometry(.18,.008,.06),material(0xc5aa6d));tape.name='gaffer-band';tape.position.copy(point);tape.position.y+=.018;tape.rotation.y=Math.atan2(tangent.x,tangent.z);g.add(tape);}
  for(const [i,e]of [a,b].entries()){
   const plug=new THREE.Group();plug.name='plug-'+i;plug.position.copy(e.point);plug.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),e.direction);
   const round=['SDI','XLR'].includes(definition.standard),body=new THREE.Mesh(round?new THREE.CylinderGeometry(.024,.024,.076,12):new THREE.BoxGeometry(definition.standard==='VGA'?.08:.052,.037,.076),material(color,.2));if(round)body.rotation.x=Math.PI/2;body.position.z=.041;plug.add(body);
   const grip=new THREE.Mesh(new THREE.CylinderGeometry(.017,.012,.058,10),material(0x151e25));grip.rotation.x=Math.PI/2;grip.position.z=.107;plug.add(grip);g.add(plug);
  }
  parent.add(g);wires.set(id,g);
 }
 function sync(parent,models,state,held,first,camera){
  parent.updateMatrixWorld(true);const active=new Set();
  for(const l of state.links){const a=endpoint(models,l.a),b=endpoint(models,l.b),c=PhysicalCore.get(state,l.cable);if(!a||!b||!c)continue;draw(parent,l.cable,a,b,PhysicalCore.spec(c.modelId),false,Boolean(deskStation?.visible),StudioSet.group.visible?.185:.023,c.secured);active.add(l.cable);}
  if(held&&first){const a=endpoint(models,first),c=PhysicalCore.get(state,held);if(a&&c){const b={point:new THREE.Vector3(.25,-.22,-.8).applyMatrix4(camera.matrixWorld),direction:new THREE.Vector3(0,0,1).applyQuaternion(camera.quaternion)};draw(parent,held,a,b,PhysicalCore.spec(c.modelId),true,Boolean(deskStation?.visible),StudioSet.group.visible?.185:.023);active.add(held);}}
  for(const [id,g]of wires)if(!active.has(id)){dispose(g);wires.delete(id);}
 }
 function measure(models,state,cable,a,b,override){const ends=[a,b].map(e=>{const o=PhysicalCore.get(state,e.device),socket=models.get(e.device)?.getObjectByName('socket-'+e.port);if(!o||!socket)return null;const rotation=new THREE.Euler(o.pitch||0,o.rotation||0,0),position=override?.uid===o.uid?override.position:o.position;return{point:socket.position.clone().applyEuler(rotation).add(new THREE.Vector3(position.x,position.y,position.z)),direction:new THREE.Vector3(0,0,1).applyQuaternion(socket.quaternion).applyEuler(rotation)};});if(ends.some(e=>!e))return null;return routeLength(ends[0],ends[1],PhysicalCore.spec(cable.modelId).length,Boolean(deskStation?.visible));}
 function routeLength(a,b,length,garage){return path(a,b,length,garage,StudioSet.group.visible?.185:.023).getLength();}
 return{ports,updatePorts,sync,wires,route:path,measure};
})();
