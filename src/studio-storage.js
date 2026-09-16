/* Physical owned inventory, with non-destructive housing capacity rules.
   Equipped workstation gear is shown at the workstation, not duplicated on shelves. */
window.StudioStorage=(()=>{
 const group=new THREE.Group();group.name='Owned equipment shelves';scene.add(group);group.visible=false;
 const capacitySteps=[24,36,48,64,80,100,128,160,200,256,320];let signature='',elapsed=0;
 const homes=shopItems.filter(i=>i.category==='housing');
 // Keep every shelf safely inside the brick shell. The first bay used to sit too close to the back wall.
 const bayLayouts=[
  {x:4.35,z:5.42,r:0,label:'MATÉRIEL'},
  {x:5.35,z:7.35,r:-Math.PI/2,label:'CASES'},
  {x:5.35,z:9.7,r:-Math.PI/2,label:'SIGNAL'},
  {x:-5.35,z:7.4,r:Math.PI/2,label:'ARCHIVES'},
 ];
 function capacity(housing=profile?.housing){const label=typeof housing==='string'?housing:housing?.type;const index=homes.findIndex(i=>i.label===label);return capacitySteps[index+1]||24;}
 function units(item){return item.category==='gear'?getOwnedGearUnitCount(item.type,item.id.replace(item.type+'-','')):profile.ownedItems.includes(item.id)?Math.max(1,Number(profile.inventory[item.id])||1):0;}
 function displayUnits(item){
  let count=units(item);
  if(item.category==='gear'&&['computer','projector'].includes(item.type)){
   const slug=item.id.replace(item.type+'-','');
   if(profile?.gear?.[item.type]===slug)count=Math.max(0,count-1);
  }
  return count;
 }
 function weight(item){return item.category==='vjloop'||item.category==='housing'?0:item.type==='screen'?4:['projector','computer','console'].includes(item.type)?2:1;}
 function entries(){return shopItems.filter(i=>['gear','clothing'].includes(i.category)).map(item=>({item,count:units(item)})).filter(e=>e.count>0);}
 function displayEntries(){return shopItems.filter(i=>i.category==='gear').map(item=>({item,count:displayUnits(item)})).filter(e=>e.count>0);}
 function used(){return entries().reduce((sum,e)=>sum+e.count*weight(e.item),0);}
 function check(item){if(profile.godMode)return null;const total=used(),limit=capacity();if(item.category==='housing')return total>capacity(item.label)?`Ce lieu offre ${capacity(item.label)} places ; ton matériel en utilise ${total}. Aucun objet ne sera supprimé.`:null;return weight(item)&&total+weight(item)>limit?`Rangement plein : ${total}/${limit} places. Vends du matériel ou choisis un lieu plus grand dans Immobilier.`:null;}
 function dispose(){const gs=new Set(),ms=new Set(),ts=new Set();group.traverse(o=>{if(o.geometry)gs.add(o.geometry);if(o.material){ms.add(o.material);if(o.material.map)ts.add(o.material.map);}});gs.forEach(x=>x.dispose());ms.forEach(x=>x.dispose());ts.forEach(x=>x.dispose());group.clear();}
 function rebuild(list){
  dispose();const limit=capacity(window.StudioWorld?.visitingHome?.label||profile.housing),bays=Math.max(1,Math.min(4,Math.max(Math.ceil(limit/80),Math.ceil((window.PhysicalV4?.state?.objects.filter(o=>o.location==='shelf'&&!['cable','surface','stand','container'].includes(PhysicalCore.spec(o.modelId).kind)).length||list.length)/9))));
  const steel=new THREE.MeshStandardMaterial({color:0x59656a,metalness:.62,roughness:.36}),wood=new THREE.MeshStandardMaterial({color:0x806a50,roughness:.84}),dark=new THREE.MeshStandardMaterial({color:0x202a30,roughness:.68});
  function labelMesh(text,w=2.05){const c=document.createElement('canvas');c.width=768;c.height=150;const d=c.getContext('2d');d.fillStyle='#14242b';d.fillRect(0,0,768,150);d.strokeStyle='#4c636b';d.lineWidth=4;d.strokeRect(6,6,756,138);d.fillStyle='#efe2c8';d.textAlign='center';d.font='bold 31px Arial';d.fillText(text,384,90,720);const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;return new THREE.Mesh(new THREE.PlaneGeometry(w,w*.195),new THREE.MeshBasicMaterial({map:tex,side:THREE.FrontSide}));}
  function shelfBay(layout,bay){
   const holder=new THREE.Group();holder.position.set(layout.x,0,layout.z);holder.rotation.y=layout.r;group.add(holder);
   const box=(w,h,d,x,y,z,m)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;holder.add(o);return o;};
   for(const yy of [.36,.94,1.52])box(2.15,.07,.85,0,yy,0,wood).userData.placementSurface='Étagère';
   for(const dx of [-1.02,1.02])box(.065,1.92,.065,dx,1.10,.36,steel);
   box(2.15,1.92,.035,0,1.10,-.44,dark);
   const sign=labelMesh(bay===0?`${layout.label} · ${used()} / ${limit}`:layout.label,1.9);sign.position.set(0,2.02,.44);holder.add(sign);
   return holder;
  }
  const holders=[];for(let i=0;i<bays;i++)holders.push(shelfBay(bayLayouts[i],i));
  list.forEach(({item,count},index)=>{
   const bay=Math.min(holders.length-1,Math.floor(index/16)),cell=index%16,holder=holders[bay];
   const lx=-.77+(cell%4)*.51,ly=.36+([1,2,0,3][Math.floor(cell/4)])*.7,lz=.14;
   if(window.PhysicalV4?.enabled)return;
   const model=ItemModels.create(item),bounds=new THREE.Box3().setFromObject(model),size=bounds.getSize(new THREE.Vector3());model.scale.setScalar(.34/Math.max(size.x,size.y,size.z));model.position.set(lx,ly,lz);model.userData.ownedItem=item.id;holder.add(model);
   const tag=labelMesh(`${item.label} ×${count}`,.48);tag.position.set(lx,ly-.15,.34);tag.userData.ownedItem=item.id;holder.add(tag);
  });
 }
 function localPoint(layout,state){const dx=state.x-layout.x,dz=state.z-layout.z,c=Math.cos(-layout.r),s=Math.sin(-layout.r);return{x:dx*c-dz*s,z:dx*s+dz*c};}
 function near(state){return group.visible&&group.children.length&&bayLayouts.slice(0,group.children.length).some(layout=>{const p=localPoint(layout,state);return Math.abs(p.x)<1.55&&Math.abs(p.z)<1.55;});}
 function open(){if(!group.visible||window.StudioWorld?.visitingHome)return;StudioWorld.showComputer();document.body.classList.remove('studio-world-view');openApp('inventory');PhysicalPanels.open('inventory');}
 function tick(dt,walking){group.visible=walking;if(!walking||!profile?.created)return;elapsed+=dt;if(elapsed<.5)return;elapsed=0;const list=displayEntries(),key=JSON.stringify([window.StudioWorld?.visitingHome?.label||profile.housing.type,profile.gear?.computer,profile.gear?.projector,list.map(e=>[e.item.id,e.count])]);if(key!==signature){signature=key;rebuild(list);}}
 let down=null;canvas.addEventListener('pointerdown',e=>{if(group.visible)down={x:e.clientX,y:e.clientY};});canvas.addEventListener('pointerup',e=>{if(!down)return;const click=Math.hypot(e.clientX-down.x,e.clientY-down.y)<5;down=null;if(!click||!group.visible)return;const r=canvas.getBoundingClientRect(),ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),camera);const hit=ray.intersectObject(group,true)[0];if(hit&&hit.distance<5)open();});
 function blocked(x,z){return bayLayouts.slice(0,group.children.length).some(layout=>{const p=localPoint(layout,{x,z});return Math.abs(p.x)<1.18&&Math.abs(p.z)<.52;});}
 return {capacity,used,check,entries,tick,near,open,group,blocked};
})();