const HUMAN_CAST={
 nova:{label:'Nova',look:'Hoodie sombre · denim · sneakers',path:'/assets/characters/nova/nova.glb'},
 eli:{label:'Eli',look:'Denim urbain · t-shirt · sneakers',path:'/assets/characters/eli/eli.glb'},
 sam:{label:'Sam',look:'Veste streetwear · casquette · denim',path:'/assets/characters/sam/sam.glb'},
};
let humanPoseRestore=[],humanStride=0;
let humanMixer=null, humanRequest=0, humanLoaded=null,humanPending=null;
function createVj() {
 const group=new THREE.Group();group.userData.realistic=true;
 queueMicrotask(()=>loadHumanCharacter(profile.appearance.character||'nova'));
 return group;
}
async function loadHumanCharacter(id) {
 if(!HUMAN_CAST[id])id='nova';
 if(humanLoaded===id){humanRequest++;humanPending=null;return;}
 if(humanPending===id)return;humanPending=id;
 const request=++humanRequest;
 const status=document.querySelector('#character-status');if(status)status.textContent='Chargement du personnage 3D…';
 try {
  const asset=await new THREE.GLTFLoader().loadAsync(HUMAN_CAST[id].path);
  if(request!==humanRequest)return;
  const oldTextures=new Set();player.traverse(o=>{if(o.isMesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material]){for(const value of Object.values(m))if(value?.isTexture)oldTextures.add(value);m.dispose();}}});oldTextures.forEach(t=>t.dispose());
  humanPoseRestore=[];player.clear();player.userData.wearSignature=null;
  const model=asset.scene;
  const bounds=new THREE.Box3().setFromObject(model),size=bounds.getSize(new THREE.Vector3());
  model.scale.setScalar(1);
  model.position.y=0;
  model.traverse(o=>{if(o.isMesh){o.frustumCulled=false;o.castShadow=true;o.receiveShadow=true;const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>{m.roughness=.78;m.metalness=0;if(m.name.includes('opacity')){m.side=THREE.DoubleSide;m.alphaTest=.35;m.transparent=false;} });}});
  player.add(model);refineShoeRegions();humanMixer=new THREE.AnimationMixer(model);
  if(asset.animations[0])humanMixer.clipAction(asset.animations[0]).play();
  humanLoaded=id;humanPending=null;player.userData.loaded=true;player.userData.character=id;
  if(status)status.textContent=HUMAN_CAST[id].look;
  const fill=new THREE.PointLight(0xe8f3ff,5,5);fill.name='wardrobe-fill';fill.position.set(.6,1.9,2);player.add(fill);
  applyHumanAppearance();
 }catch(error){if(request===humanRequest)humanPending=null;if(status)status.textContent='Le personnage n’a pas chargé. Réessaie en choisissant une silhouette.';console.error('Character loading failed',error);}
}
function applyHumanAppearance() {
 if(!player?.userData.realistic)return;
 const id=profile.appearance.character||'nova';
 if(humanLoaded!==id){loadHumanCharacter(id);return;}
 const appearance=clothingPreview||profile.appearance;
 const wear={...(profile.equippedWear||{})};
 if(clothingPreview?.itemId){const slug=clothingPreview.itemId.replace('clothing-','');wear[WEAR_SLOTS[slug]||'top']=clothingPreview.itemId;}
 renderHumanWardrobe(appearance,wear);
 const portrait=document.querySelector('#character-portrait');if(portrait)portrait.src=`/assets/characters/${id}/portrait.png`;
}
function updateHumanCharacter(delta) {
 if(!humanMixer||!player?.userData.realistic)return;
 const fill=player.getObjectByName('wardrobe-fill');if(fill){const walkingView=document.body.classList.contains('studio-world-view')&&profile.settings.thirdPerson;fill.visible=walkingView||document.body.classList.contains('screen-creator')||document.body.classList.contains('shop-closet');fill.intensity=walkingView?1.1:5;}
 for(const [bone,q] of humanPoseRestore)bone.quaternion.copy(q);humanPoseRestore=[];
 if(!profile.settings.reducedMotion)humanMixer.update(delta);
 const walking=Boolean(player.userData.walking)&&document.body.classList.contains('studio-world-view')&&!profile.settings.reducedMotion;
 if(walking)humanStride+=Math.min(.1,delta)*8;
 player.traverse(bone=>{
  if(!bone.isBone)return;const name=bone.name.replaceAll(' ','_');
  const side=name.includes('_L_')?1:name.includes('_R_')?-1:0;if(!side)return;
  if(/Thigh|Calf|UpperArm|Forearm/.test(name))humanPoseRestore.push([bone,bone.quaternion.clone()]);
  if(walking&&/Thigh|Calf/.test(name)){const angle=/Thigh/.test(name)?Math.sin(humanStride)*.28*side:Math.max(0,-Math.sin(humanStride)*side)*.35,axis=new THREE.Vector3(Math.cos(player.rotation.y),0,-Math.sin(player.rotation.y)),rotation=new THREE.Quaternion().setFromAxisAngle(axis,angle),parent=bone.parent.getWorldQuaternion(new THREE.Quaternion());bone.quaternion.premultiply(parent.clone().invert().multiply(rotation).multiply(parent));bone.updateWorldMatrix(true,true);}
  if(/UpperArm/.test(name)&&!document.body.classList.contains('shop-closet')){
   const child=bone.children.find(o=>o.isBone);if(child){bone.updateWorldMatrix(true,true);const direction=child.getWorldPosition(new THREE.Vector3()).sub(bone.getWorldPosition(new THREE.Vector3())).normalize(),desired=new THREE.Vector3(side*.12,-.98,walking?Math.sin(humanStride)*.18*side:.05).normalize(),rotation=new THREE.Quaternion().setFromUnitVectors(direction,desired),parent=bone.parent.getWorldQuaternion(new THREE.Quaternion());bone.quaternion.premultiply(parent.clone().invert().multiply(rotation).multiply(parent));bone.updateWorldMatrix(true,true);}
  }
 });
 const time=performance.now()/1000,blink=profile.settings.reducedMotion?0:Math.max(0,1-Math.abs((time%4.8)-4.5)/.09);
 player.traverse(o=>{if(o.morphTargetDictionary&&o.morphTargetInfluences){for(const [name,index] of Object.entries(o.morphTargetDictionary))if(name.includes('EyeBlink'))o.morphTargetInfluences[index]=blink;}});
}
function setupHumanSelector() {
 const host=document.querySelector('#human-selector');if(!host)return;
 host.innerHTML=Object.entries(HUMAN_CAST).map(([id,person])=>`<button type="button" data-human="${id}" aria-pressed="${(profile.appearance.character||'nova')===id}"><img src="/assets/characters/${id}/portrait.png" alt="${person.label}, ${person.look}" /><strong>${person.label}</strong><small>${person.look}</small></button>`).join('');
 host.querySelectorAll('[data-human]').forEach(button=>button.addEventListener('click',()=>{profile.appearance.character=button.dataset.human;loadHumanCharacter(button.dataset.human);host.querySelectorAll('[data-human]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}));
}
