/* Phase 8 UI is loaded here because this runtime is present on every playable screen. */
(()=>{
 if(document.querySelector('link[data-vj-ui-phase="8"]'))return;
 const link=document.createElement('link');
 link.rel='stylesheet';
 link.href='./src/ui-ux.css?phase=8-20260914';
 link.dataset.vjUiPhase='8';
 document.head.append(link);
})();

/* Venue lighting follows venue identity and musical phase, never a judgement of creative quality. */
window.ClubAtmosphere=(()=>{
 const profiles={
  garage:{label:'Garage',base:.82,live:.92,color:0xffc98f,motion:.035},
  street:{label:'Cour extérieure',base:1.05,live:1.02,color:0xb8d8ff,motion:.02},
  bar:{label:'Bar',base:.68,live:.88,color:0xffb36f,motion:.04},
  basement:{label:'Sous-sol',base:.58,live:.9,color:0x88aaff,motion:.045},
  club:{label:'Club',base:.72,live:1.18,color:0x62dcd5,motion:.075},
  warehouse:{label:'Hangar',base:.78,live:1.12,color:0x8fd9ff,motion:.055},
  festival:{label:'Festival',base:1.12,live:1.22,color:0xc8efff,motion:.045},
  cathedral:{label:'Architecture',base:.7,live:.96,color:0xffc88a,motion:.025},
  arena:{label:'Grande salle',base:.92,live:1.2,color:0xb9d7ff,motion:.05},
  lab:{label:'Signal Lab',base:.86,live:1.04,color:0x72e4dc,motion:.025},
  studio:{label:'Studio',base:.9,live:1,color:0xd7ebff,motion:.02},
  gallery:{label:'Galerie',base:.96,live:.94,color:0xe4f1ff,motion:.015},
  loft:{label:'Loft',base:.82,live:.98,color:0xffd2a3,motion:.025},
  hall:{label:'Salle',base:.88,live:1.04,color:0xc8e3ff,motion:.035},
 };
 let lamps=[],owner=null,atmosphere=profiles.hall;
 function inspectVenue(){
  const venue=document.body.classList.contains('screen-gig')?stageGroup?.getObjectByName('Location architecture'):scene.getObjectByName('Production venue details');
  if(venue===owner)return;
  owner=venue;const family=venue?.userData?.family||'hall';atmosphere=profiles[family]||profiles.hall;document.body.dataset.venueFamily=family;
  lamps=venue?venue.children.filter(x=>x.isPointLight).map(light=>({light,base:light.userData.atmosphereBase??light.intensity})):[];
  for(const entry of lamps){entry.light.userData.atmosphereBase=entry.base;entry.light.color.setHex(atmosphere.color);}
 }
 function tick(){
  inspectVenue();
  if(document.body.classList.contains('live-stage-focus')&&document.body.classList.contains('screen-gig')){camera.position.set(0,SCREEN_Y,Math.max(2,rigs.length*6-4));camera.lookAt(0,SCREEN_Y-1.5,WALL_Z);}
  const playing=document.body.classList.contains('screen-gig')&&liveShow?.started&&!liveShow.completed;
  const phase=playing?Math.min(3,Math.floor(liveShow.elapsed/15)):0;
  const phaseLevel=[.65,1,1.35,.4][phase];
  let reduced=false;
  try { reduced=Boolean(profile?.settings?.reducedMotion||profile?.settings?.stillVisuals); } catch {}
  for(const {light,base} of lamps){
   if(!playing){light.intensity=base*atmosphere.base;continue;}
   const drift=reduced?1:1+Math.sin(liveShow.elapsed*Math.PI)*atmosphere.motion;
   light.intensity=base*atmosphere.live*phaseLevel*drift;
  }
 }
 return {tick,get profile(){return atmosphere;},profiles};
})();

/* Final garage cleanup: the starter garage already has a projector elsewhere.
   Remove the duplicate StudioLife projector/cart and its invisible interaction zone. */
(()=>{
 const PROJECTOR_X=4.05,PROJECTOR_Z=10.15;
 const inDuplicateProjectorZone=(x,z,pad=1.05)=>Math.abs(Number(x)-PROJECTOR_X)<pad&&Math.abs(Number(z)-PROJECTOR_Z)<pad;

 function disposeObject(object){
  object?.traverse?.(node=>{
   node.geometry?.dispose?.();
   if(Array.isArray(node.material))node.material.forEach(material=>{material.map?.dispose?.();material.dispose?.();});
   else{node.material?.map?.dispose?.();node.material?.dispose?.();}
  });
 }

 function removeDuplicateProjectorMeshes(){
  try{
   const gear=scene.getObjectByName('Equipped garage gear');
   if(!gear)return;
   const props=gear.parent;
   const removeFrom=(parent,predicate)=>{
    if(!parent)return;
    [...parent.children].filter(predicate).forEach(child=>{parent.remove(child);disposeObject(child);});
   };
   removeFrom(gear,child=>inDuplicateProjectorZone(child.position?.x,child.position?.z,1.2));
   removeFrom(props,child=>child!==gear&&inDuplicateProjectorZone(child.position?.x,child.position?.z,.9));
  }catch{}
 }

 window.addEventListener('load',()=>{
  const life=window.StudioLife;
  if(!life||life.__duplicateProjectorRemoved)return;
  const original={
   hint:life.hint?.bind(life),
   act:life.act?.bind(life),
   blocked:life.blocked?.bind(life),
   tick:life.tick?.bind(life),
  };
  window.StudioLife={
   ...life,
   __duplicateProjectorRemoved:true,
   hint(state){
    if(state&&inDuplicateProjectorZone(state.x,state.z,1.5))return null;
    return original.hint?.(state)??null;
   },
   act(state){
    if(state&&inDuplicateProjectorZone(state.x,state.z,1.5))return;
    return original.act?.(state);
   },
   blocked(x,z){
    if(inDuplicateProjectorZone(x,z,.85))return false;
    return original.blocked?.(x,z)??false;
   },
   tick(walking){
    original.tick?.(walking);
    if(walking)removeDuplicateProjectorMeshes();
   },
  };
  removeDuplicateProjectorMeshes();
 },{once:true});
})();

/* Live completion bridge.
   The 60-second performance must never leave the player stuck on a frozen mixer.
   As soon as the timer reaches 01:00, update the HUD and automatically open the gig debrief. */
(()=>{
 let handledShow=null;
 let finishTimer=null;
 function updateCompletionCopy(show){
  try{
   const root=show?.root||document.querySelector('#live-show-desk');
   const response=root?.querySelector('[data-live-response]');
   const status=root?.querySelector('[data-live-status]');
   const cue=root?.querySelector('[data-live-cue]');
   const instruction=root?.querySelector('[data-live-instruction]');
   if(response){response.textContent='Prestation terminée. Ton bilan va s’ouvrir automatiquement.';response.dataset.match='true';}
   if(status)status.textContent='Show terminé · calcul du cachet, du score et de l’XP…';
   if(cue)cue.textContent='TERMINÉ';
   if(instruction)instruction.textContent='La prestation est finie. Aucun autre contrôle n’est nécessaire.';
  }catch{}
 }
 function armDebrief(show){
  handledShow=show;
  updateCompletionCopy(show);
  try{if(typeof updateGigHud==='function')updateGigHud();}catch{}
  if(finishTimer)clearTimeout(finishTimer);
  finishTimer=setTimeout(()=>{
   finishTimer=null;
   try{
    if(typeof liveShow==='undefined'||liveShow!==show||!show?.completed)return;
    if(typeof runFinished!=='undefined'&&runFinished)return;
    if(typeof currentGig==='undefined'||!currentGig)return;
    if(typeof finishGig==='function')finishGig();
   }catch(error){console.error('Live completion debrief failed',error);}
  },650);
 }
 function watch(){
  try{
   if(typeof liveShow!=='undefined'&&liveShow?.completed){
    if(handledShow!==liveShow)armDebrief(liveShow);
   }else if(typeof liveShow!=='undefined'&&!liveShow){
    handledShow=null;
    if(finishTimer){clearTimeout(finishTimer);finishTimer=null;}
   }
  }catch{}
  requestAnimationFrame(watch);
 }
 requestAnimationFrame(watch);
})();
