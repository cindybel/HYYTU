/* Full-size equipment storage; only untouched stored objects are arranged. */
window.PhysicalStorage=(()=>{
 const levels=[.36,.94,1.52],bays=[{x:4.35,z:5.42,r:0},{x:5.35,z:7.35,r:-Math.PI/2},{x:5.35,z:9.7,r:-Math.PI/2},{x:-5.35,z:7.4,r:Math.PI/2}];
 const rack=new THREE.Group();rack.name='Usable cable wall rack';scene.add(rack);let signature='';
 const DEFAULT_LAYOUT_VERSION=2;
 function size(o){if(o.modelId==='support-studio-cart')return 1.04;const k=PhysicalCore.spec(o.modelId).kind;return {laptop:.48,tower:.6,monitor:.6,projector:.44,powerbar:.52,speaker:.44,container:.65,keyboard:.48,mouse:.12,cable:.38,surface:1.8,stand:1.5}[k]||(k==='outlet'?(o.ports.length<=2?.2:1.05):.4);}
 function slot(index){const b=bays[Math.floor(index/9)%4],cell=index%9,lx=-.7+(cell%3)*.7;return{x:b.x+lx*Math.cos(b.r),y:levels[[1,0,2][Math.floor(cell/3)]]+.043,z:b.z-lx*Math.sin(b.r),rotation:b.r};}
 function applyDefaultProjectionCorner(state){
  if((Number(state.god99GarageLayoutVersion)||0)>=DEFAULT_LAYOUT_VERSION)return;
  const screen=state.objects.find(o=>PhysicalCore.spec(o.modelId).kind==='surface');
  const stand=state.objects.find(o=>o.modelId==='support-studio-cart');
  const projector=state.objects.find(o=>PhysicalCore.spec(o.modelId).kind==='projector'&&(o.modelId==='projector-cheap'||o.mountedTo===stand?.uid||o.location==='shelf'||o.location==='desk'));
  // Default GOD99 garage composition based on the approved room view:
  // screen along the left wall, projector on its rack across the room facing the screen.
  if(screen){screen.location='desk';screen.position={x:-5.28,y:.168,z:8.95};screen.rotation=Math.PI/2;}
  if(stand){stand.location='desk';stand.position={x:2.65,y:.168,z:8.45};stand.rotation=0;state.studioCartPlaced=true;}
  if(projector&&stand){projector.location='desk';projector.position={x:2.65,y:1.216,z:8.45};projector.rotation=-Math.PI/2;projector.mountedTo=stand.uid;projector.mountedOffset={x:0,y:1.048,z:0,rotation:-Math.PI/2};}
  state.god99GarageLayoutVersion=DEFAULT_LAYOUT_VERSION;
 }
 function arrange(state){let n=0,c=0,f=0;for(const o of state.objects){if(o.location!=='shelf')continue;const k=PhysicalCore.spec(o.modelId).kind;if(k==='cable'){const index=c++;o.position={x:-4.7+(index%6)*.45,y:1.6-Math.floor(index/6)*.5,z:4.57};o.rotation=0;o.storageHook=true;}
 else if(['surface','stand','container'].includes(k)){o.position={x:k==='surface'?2.7:k==='stand'?2.1:3.15+(f++%3)*.7,y:.168,z:k==='container'?9.85:5.35};o.rotation=0;}
 else{const place=slot(n++);o.position={x:place.x,y:place.y,z:place.z};o.rotation=place.rotation;delete o.storageHook;}}
 const stand=state.objects.find(o=>o.modelId==='support-studio-cart'),pj=state.objects.find(o=>o.modelId==='projector-cheap'&&(o.location==='shelf'||o.mountedTo===stand?.uid));if(stand&&!state.studioCartPlaced){stand.location='desk';stand.position={x:2.8,y:.168,z:6.25};if(pj){pj.location='desk';pj.position={x:2.8,y:1.216,z:6.25};pj.rotation=Math.PI;pj.mountedTo=stand.uid;pj.mountedOffset={x:0,y:1.048,z:0,rotation:Math.PI};}state.studioCartPlaced=true;}
 applyDefaultProjectionCorner(state);
 }
 function label(text){const c=document.createElement('canvas');c.width=512;c.height=100;const d=c.getContext('2d');d.fillStyle='#152731';d.fillRect(0,0,512,100);d.fillStyle='#f3e6c9';d.textAlign='center';d.font='bold 28px Arial';d.fillText(text,256,60,490);const tex=new THREE.CanvasTexture(c);return new THREE.Mesh(new THREE.PlaneGeometry(.43,.084),new THREE.MeshBasicMaterial({map:tex}));}
 function tick(state,visible){rack.visible=visible;if(!visible)return;const cables=state.objects.filter(o=>o.location==='shelf'&&o.storageHook),key=cables.map(o=>o.uid+JSON.stringify(o.position)).join('|');if(key===signature)return;signature=key;rack.traverse(n=>{n.geometry?.dispose();n.material?.map?.dispose();n.material?.dispose();});rack.clear();for(const o of cables){const p=o.position,mat=new THREE.MeshStandardMaterial({color:0x8b9394,metalness:.65,roughness:.4}),path=new THREE.CatmullRomCurve3([new THREE.Vector3(p.x,p.y+.31,4.43),new THREE.Vector3(p.x,p.y+.31,4.64),new THREE.Vector3(p.x,p.y+.36,4.64)]);rack.add(new THREE.Mesh(new THREE.TubeGeometry(path,10,.012,6,false),mat));const d=PhysicalCore.spec(o.modelId),name=d.standard==='POWER'?(o.modelId==='cable-extension'?'Rallonge secteur':'Secteur appareil'):d.standard==='AUX'?'Audio jack':d.standard;const tag=label(name+' · '+d.length+' m');tag.userData.uid=o.uid;tag.position.set(p.x,p.y+.45,4.48);rack.add(tag);}}
 return{size,slot,arrange,tick,levels,bays,rack};
})();
