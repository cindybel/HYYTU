/* Physical garage interactions + persisted departure flow. */
window.StudioLife=(()=>{
 const props=new THREE.Group();props.visible=false;scene.add(props);
 const equipment=new THREE.Group();equipment.name='Equipped garage gear';props.add(equipment);
 const mat=(color,roughness=.75,metalness=.05)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
 function box(w,h,d,x,y,z,m,parent=props){const mesh=new THREE.Mesh(GearModels.rounded(w,h,d,Math.min(.04,h*.2)),m);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
 function label(text,x,y,z,rotation=0,w=1.8,parent=props){const cv=document.createElement('canvas');cv.width=512;cv.height=150;const c=cv.getContext('2d');c.fillStyle='#172630';c.fillRect(0,0,512,150);c.strokeStyle='#4c636b';c.lineWidth=4;c.strokeRect(5,5,502,140);c.fillStyle='#e9dec6';c.font='bold 30px Arial';c.textAlign='center';c.fillText(text,256,90,470);const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,w*.293),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv),side:THREE.FrontSide}));mesh.position.set(x,y,z);mesh.rotation.y=rotation;parent.add(mesh);return mesh;}

 // One bed at a credible double-bed scale; the bounds below match its footprint.
 const bedX=-5.05,bedZ=9.55;
 const bed=new THREE.Group();bed.name='Studio bed';props.add(bed);
 const bedFrame=mat(0x635347,.82),bedLinen=mat(0xc1b7a4,.98),bedBlanket=mat(0x576c72,.96);
 for(const dx of [-.64,.64])for(const dz of [-.92,.92])box(.07,.19,.07,bedX+dx,.255,bedZ+dz,bedFrame,bed);
 box(1.55,.18,2.1,bedX,.39,bedZ,bedFrame,bed);
 box(1.48,.19,2.02,bedX,.57,bedZ,bedLinen,bed);
 box(1.6,.95,.08,bedX,.635,bedZ-1.05,bedFrame,bed);
 box(1.5,.045,1.35,bedX,.687,bedZ+.32,bedBlanket,bed);
 for(const dx of [-.745,.745])box(.018,.18,1.33,bedX+dx,.6,bedZ+.32,bedBlanket,bed);
 for(const dx of [-.38,.38]){
  const pillow=new THREE.Mesh(new THREE.SphereGeometry(1,16,10),bedLinen);pillow.scale.set(.32,.07,.22);pillow.position.set(bedX+dx,.725,bedZ-.73);pillow.castShadow=true;bed.add(pillow);
 }

 label('REPOS',-6.52,1.55,bedZ,Math.PI/2,.65);

 // The desk itself and controller already come from createDeskStation().
 // StudioLife only swaps in the actually equipped computer so there is no duplicate table/controller.
 const workstationX=.35,workstationZ=7.42;

 // Projector cart: freestanding in the room, never intersecting a wall or shelf.
 const projectorX=2.8,projectorZ=6.25;
 box(.78,.08,.78,projectorX,.12,projectorZ,mat(0x424a4e,.55,.4));
 box(.09,.96,.09,projectorX,.6,projectorZ,mat(0x5a646a,.45,.55));
 box(.9,.08,.8,projectorX,1.08,projectorZ,mat(0x424a4e,.55,.4));
 box(.58,.05,.58,projectorX,.18,projectorZ,mat(0x313a40,.55,.35));

 let gearKey='';
 function disposeEquipment(){
  const geometries=new Set(),materials=new Set(),textures=new Set();
  equipment.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material){materials.add(o.material);if(o.material.map)textures.add(o.material.map);}});
  geometries.forEach(g=>g.dispose?.());materials.forEach(m=>m.dispose?.());textures.forEach(t=>t.dispose?.());equipment.clear();
 }
 function modelFor(type,slug){
  if(!slug||slug==='none')return null;
  const item=shopItems.find(entry=>entry.id===`${type}-${slug}`);
  if(!item)return null;
  return {item,model:ItemModels.create(item)};
 }
 function fitModel(model,maxSize){
  const bounds=new THREE.Box3().setFromObject(model),size=bounds.getSize(new THREE.Vector3()),largest=Math.max(size.x,size.y,size.z)||1;
  model.scale.setScalar(maxSize/largest);return model;
 }
 function hideLegacyDeskLaptop(){
  try{
   if(typeof deskStation==='undefined'||!deskStation)return;
   const legacyLaptop=deskStation.children.find(child=>child?.type==='Group');
   if(legacyLaptop){legacyLaptop.visible=false;legacyLaptop.userData.__replacedByOwnedComputer=true;}
  }catch{}
 }
 function hideLegacyRoomProps(){
  const targets=[[-11.8,15.2],[11.7,14.5],[0,12.8]];
  scene.children.forEach(o=>{
   if(o===props||o===window.StudioSet?.group)return;
   if(targets.some(([x,z])=>Math.abs((o.position?.x??999)-x)<.5&&Math.abs((o.position?.z??999)-z)<.7)){
    o.visible=false;o.userData.__legacyStarterProp=true;
   }
  });
 }
 function rebuildEquippedGear(){
  const computer=profile?.gear?.computer||'starter-laptop';
  const projector=profile?.gear?.projector||'cheap';
  const screen=profile?.gear?.screen||'none';
  const key=`${computer}|${projector}|${screen}`;
  if(key===gearKey)return;gearKey=key;disposeEquipment();hideLegacyDeskLaptop();

  const computerData=modelFor('computer',computer);
  if(computerData){
   const model=fitModel(computerData.model,1.08),isDesktop=/desktop-/.test(computer);
   if(isDesktop){model.position.set(1.62,.88,7.38);model.rotation.y=-Math.PI/2;}
   else{model.position.set(workstationX,.95,workstationZ);model.rotation.y=0;}
   equipment.add(model);
  }

  if(screen&&screen!=='none'){
   const screenData=modelFor('screen',screen);
   if(screenData){const monitor=fitModel(screenData.model,.9);monitor.position.set(.25,1.02,7.02);monitor.rotation.y=0;equipment.add(monitor);}
  }

  const projectorData=modelFor('projector',projector);
  if(projectorData){
   const model=fitModel(projectorData.model,.86);model.name='Studio equipped projector';model.rotation.y=Math.PI;
   const bounds=new THREE.Box3().setFromObject(model);model.position.set(projectorX,1.12-bounds.min.y,projectorZ);equipment.add(model);
   label(projectorData.item.label,projectorX,.88,projectorZ+.41,0,.85,equipment);
  }
 }

 function zone(s){
  if(Math.hypot(s.x-bedX,s.z-bedZ)<1.65)return 'bed';
  if(Math.hypot(s.x-workstationX,s.z-7.75)<1.8)return 'mixer';
  if(Math.hypot(s.x-projectorX,s.z-projectorZ)<1.45)return 'projector';
  return null;
 }
 function hint(s){const z=zone(s);if(z==='bed')return {enabled:true,label:'Dormir · choisir la durée · E',hint:'Tu peux dormir quand tu veux, de 1 à 12 heures.'};if(z==='mixer')return {enabled:true,label:'Ouvrir le poste VJ · E',hint:'Ordinateur équipé + contrôleur VJ. Lance la pratique libre.'};if(z==='projector')return {enabled:true,label:'Tester mon projecteur · E',hint:'Le projecteur visible correspond à celui équipé.'};return null;}

 function sleepRecovery(housing=profile?.housing){return 7+Math.min(4,Math.floor(Math.max(0,Number(housing?.comfort)||0)/10));}
 function sleepHours(hours){
  const amount=Math.max(1,Math.min(12,Math.round(Number(hours)||1)));
  const before=window.StudioWorld?.getClock?.();
  if(!before||!window.StudioWorld?.advanceMinutes){notify('Horloge du studio indisponible.');return;}
  window.StudioWorld.advanceMinutes(amount*60);
  const after=window.StudioWorld.getClock();
  const crossed=Math.max(0,(Number(after.day)||1)-(Number(before.day)||1));
  if(profile?.stats)profile.stats.fatigue=Math.max(0,(Number(profile.stats.fatigue)||0)-amount*sleepRecovery());
  if(!crossed&&profile?.energyLog){
   if(typeof syncEnergyLog==='function')syncEnergyLog();
   profile.energyLog.remaining=Math.min(typeof DAILY_ENERGY_MAX==='number'?DAILY_ENERGY_MAX:4,(Number(profile.energyLog.remaining)||0)+Math.max(1,Math.floor(amount/3)));
  }
  if(typeof recordDayActivity==='function')recordDayActivity('rest',`Sommeil ${amount} h`);
  saveSlots();updateProfileChrome?.();
  const time=`${String(after.hour).padStart(2,'0')}:${String(after.minute).padStart(2,'0')}`;
  notify(`Tu as dormi ${amount} h. Il est ${time}. Fatigue ${Math.round(profile.stats?.fatigue||0)}.`);
 }

 function openSleepMenu(){
  document.querySelector('#sleep-duration-menu')?.remove();
  const clock=window.StudioWorld?.getClock?.();
  const root=document.createElement('section');root.id='sleep-duration-menu';root.className='menu-screen';root.style.display='grid';root.style.zIndex='1100';
  root.innerHTML=`<div class="menu-panel"><span class="production-eyebrow">COIN REPOS</span><h1>Dormir combien de temps ?</h1><p>Tu peux dormir à n’importe quelle heure. Le sommeil fait avancer l’horloge et réduit ta fatigue. Si tu passes minuit, le calendrier passe au jour suivant.</p><p>Ton logement permet de récupérer <strong>${sleepRecovery()} points de fatigue par heure</strong>.</p><div class="sleep-clock"><strong>Maintenant</strong><span>${clock?`${String(clock.hour).padStart(2,'0')}:${String(clock.minute).padStart(2,'0')}`:'--:--'}</span></div><label class="field"><span>Durée <output data-sleep-output>8 h</output></span><input data-sleep-hours type="range" min="1" max="12" step="1" value="8"></label><div class="menu-actions"><button class="secondary-action" data-sleep-quick="2">Sieste · 2 h</button><button class="secondary-action" data-sleep-quick="4">Repos · 4 h</button><button class="secondary-action" data-sleep-quick="8">Nuit · 8 h</button><button class="primary-action" data-sleep-confirm>Dormir 8 h</button><button class="secondary-action" data-close>Annuler</button></div></div>`;
  document.body.append(root);
  const slider=root.querySelector('[data-sleep-hours]'),output=root.querySelector('[data-sleep-output]'),confirm=root.querySelector('[data-sleep-confirm]');
  const sync=()=>{output.textContent=`${slider.value} h`;confirm.textContent=`Dormir ${slider.value} h`;};
  slider.oninput=sync;root.querySelectorAll('[data-sleep-quick]').forEach(button=>button.onclick=()=>{slider.value=button.dataset.sleepQuick;sync();});
  root.querySelector('[data-close]').onclick=()=>root.remove();confirm.onclick=()=>{const hours=Number(slider.value);root.remove();sleepHours(hours);};
  root.addEventListener('keydown',event=>{if(event.key==='Escape')root.remove();});slider.focus();
 }

 function act(s){
  const z=zone(s);
  if(z==='bed'){openSleepMenu();return;}
  if(z==='mixer'){
   const launch=document.querySelector('#academy-launch');if(!launch){notify('Le poste VJ n’est pas disponible.');return;}
   if(window.StudioRehearsal){StudioRehearsal.open();return;}launch.click();return;
  }
  if(z==='projector'){
   const launch=document.querySelector('#field-launch');if(!launch){notify('Atelier projection indisponible.');return;}
   launch.click();const wall=document.querySelector('#field-school [data-mission="wall"]');if(wall&&!wall.disabled)wall.click();else notify('Commence le parcours VJ pour débloquer la pratique projection.');
  }
 }
 function blocked(x,z){
  if(Math.abs(x-(deskStation?.position.x||0))<2.225&&Math.abs(z-(deskStation?.position.z||7.45))<.825)return true;
  if(x<bedX+.8&&x>bedX-.8&&z>bedZ-1.1&&z<bedZ+1.05)return true;
  if(x>projectorX-.62&&x<projectorX+.62&&z>projectorZ-.62&&z<projectorZ+.62)return true;
  return false;
 }
 function tick(walking){props.visible=walking;if(walking){hideLegacyDeskLaptop();hideLegacyRoomProps();rebuildEquippedGear();}}
 return {hint,act,blocked,tick,openSleepMenu,sleepHours,sleepRecovery};
})();

window.StudioJourney=(()=>{
 let departing=false;
 const props=new THREE.Group();props.visible=false;scene.add(props);
 function box(w,h,d,x,y,z,color){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color,roughness:.6,metalness:.25}));mesh.position.set(x,y,z);mesh.castShadow=true;props.add(mesh);return mesh;}
 box(.18,2.75,1.35,6.55,1.38,11.25,0x263b45);box(.18,.12,.2,6.37,1.3,10.82,0xdac28b);
 const crates=[];for(let i=0;i<3;i++){const x=4.35+(i%2)*1.05,y=.35+Math.floor(i/2)*.72;crates.push(box(.95,.65,.7,x,y,12.15,0x202c39));box(.97,.05,.73,x,y+.2,12.15,0x7a919b);box(.24,.08,.06,x,y,12.53,0xa8d4ca);}
 function label(text,x,y,z,rotation=0){const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;const c=canvas.getContext('2d');c.fillStyle='#142632';c.fillRect(0,0,512,128);c.fillStyle='#e9dec6';c.font='bold 35px Arial';c.textAlign='center';c.fillText(text,256,76);const mesh=new THREE.Mesh(new THREE.PlaneGeometry(2,.5),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(canvas),side:THREE.FrontSide}));mesh.position.set(x,y,z);mesh.rotation.y=rotation;props.add(mesh);}
 label('SORTIE / VILLE',6.35,2.65,11.25,-Math.PI/2);label('MATÉRIEL DU SHOW',4.85,1.85,11.72,Math.PI);
 function queue(gig){profile.preparedDeparture={gigId:gig.id,quotedCost:readGigLoadoutFromSetup().totalCost,packed:false,selections:[...gigSetupContent.querySelectorAll('select[data-loadout-type]')].map(e=>({type:e.dataset.loadoutType,key:e.dataset.loadoutKey,value:e.value}))};profile.preparedDeparture.packed=JSON.stringify(profile.preparedDeparture.selections)===JSON.stringify(profile.savedStudioSetup);saveSlots();gigSetupModal.hidden=true;pendingGigSetup=null;StudioWorld.enter();notify(profile.preparedDeparture.packed?'Setup déjà maîtrisé : ton matériel est prêt. Rejoins la sortie.':'Préparation enregistrée. Regroupe le matériel près des caisses, puis rejoins la sortie.');}
 function nearby(s){if(Math.hypot(s.x-4.8,s.z-12.15)<1.55)return 'cases';if(Math.hypot(s.x-5.75,s.z-11.25)<1.45)return 'door';return null;}
 function hint(s){const zone=nearby(s),p=profile.preparedDeparture;if(zone==='cases')return {label:p?(p.packed?'Matériel regroupé':'Regrouper le matériel · E'):'Caisses du show',enabled:Boolean(p&&!p.packed),hint:p?'Prépare physiquement ton départ.':'Les caisses seront utiles lorsqu’un contrat est confirmé.'};if(zone==='door')return {label:p?.packed?'Partir vers le show · E':'Sortir / choisir une destination · E',enabled:true,hint:p?.packed?'Ton setup est prêt pour le venue.':'La porte sert aux déplacements : magasin, école et rendez-vous.'};return null;}
 function travelMenu(){
  const root=document.createElement('section');root.className='menu-screen';root.style.display='grid';root.style.zIndex='1000';root.innerHTML='<div class="menu-panel"><span class="production-eyebrow">SORTIR DU GARAGE</span><h1>Où aller ?</h1><p>Choisis une destination.</p><div class="menu-actions"><button class="primary-action" data-dest="shop">Magasin AV</button><button class="primary-action" data-dest="skills">École / formations VJ</button><button class="primary-action" data-dest="social">Réseau de booking</button><button class="secondary-action" data-close>Rester au garage</button></div></div>';document.body.append(root);
  const close=()=>root.remove();root.querySelector('[data-close]').onclick=close;root.querySelectorAll('[data-dest]').forEach(b=>b.onclick=()=>{const app=b.dataset.dest;close();StudioWorld.showComputer();document.body.classList.remove('studio-world-view');openApp(app);});
 }
 function act(s){
  const zone=nearby(s),p=profile.preparedDeparture;
  if(zone==='door'&&!p){travelMenu();return;}
  if(!p)return;
  if(zone==='cases'&&!p.packed){p.packed=true;profile.savedStudioSetup=p.selections.map(s=>({...s}));saveSlots();notify('Matériel regroupé. Rejoins la porte de sortie.');}
  else if(zone==='door'&&!p.packed){notify('Ton contrat est confirmé, mais le matériel n’est pas regroupé. Passe par les caisses.');}
  else if(zone==='door'&&p.packed){const gig=profile.gigs.find(g=>g.id===p.gigId);if(!gig||!canPlayGig(gig)){notify('Ce contrat n’est pas disponible aujourd’hui. Vérifie le calendrier à l’ordinateur.');return;}startGig(gig.id);const selects=[...gigSetupContent.querySelectorAll('select[data-loadout-type]')];let unavailable=false;for(const saved of p.selections){const select=selects.find(e=>e.dataset.loadoutType===saved.type&&e.dataset.loadoutKey===saved.key);if(select&&[...select.options].some(o=>o.value===saved.value))select.value=saved.value;else unavailable=true;}if(unavailable||readGigLoadoutFromSetup().totalCost!==p.quotedCost){notify(unavailable?'Un équipement n’est plus disponible : vérifie la préparation avant de partir.':'Les frais ont changé : vérifie à nouveau la préparation avant de partir.');return;}departing=true;try{beginGigFromSetup();}finally{departing=false;}}}
 function offerSavedSetup(){
  if(!Array.isArray(profile.savedStudioSetup))return;
  const button=document.createElement('button');button.type='button';button.dataset.reuseSetup='';button.textContent='Réutiliser mon dernier setup';
  button.onclick=()=>{let missing=0;for(const saved of profile.savedStudioSetup){const select=[...gigSetupContent.querySelectorAll('select[data-loadout-type]')].find(e=>e.dataset.loadoutType===saved.type&&e.dataset.loadoutKey===saved.key);if(select&&[...select.options].some(o=>o.value===saved.value)){select.value=saved.value;select.dispatchEvent(new Event('change',{bubbles:true}));}else missing++;}button.textContent=missing?'Choix disponibles repris · vérifie les autres équipements':'Setup repris · vérifie les frais avant de valider';};
  gigSetupContent.prepend(button);
 }
 function tick(walking){props.visible=walking;crates.forEach(m=>m.material.color.setHex(profile?.preparedDeparture?.packed?0x36574f:0x202c39));}
 document.querySelector('#result-close-button').addEventListener('click',()=>StudioWorld.enter());
 return {queue,act,hint,tick,offerSavedSetup,get departing(){return departing;}};
})();
