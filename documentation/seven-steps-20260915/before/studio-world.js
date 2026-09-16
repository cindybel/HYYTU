/* Walkable compact garage using the existing Three.js room and character. */
window.StudioWorld=(()=>{
 const WORLD_TIME_SCALE=12;
 const MAX_CLOCK_DT=.25;
 const MAX_MOVE_DT=.1;
 const MOVE_SPEED=2.55;
 const COLLISION_STEP=.1;
 const PLAYER_RADIUS=.22;
 let computer=false,lastSave=0,owner=null,state=null,drag=null;
 let visit=null;
 const visitBack=document.createElement('button');visitBack.id='home-visit-back';visitBack.textContent='← Retour aux locaux';visitBack.hidden=true;document.body.append(visitBack);
 visitBack.onclick=endVisit;
 function endVisit(){
  if(!visit)return;state=visit.savedState;visit=null;held.clear();keys.clear();drag=null;computer=true;visitBack.hidden=true;
  window.StudioSet?.refreshHome();openApp('housing');
 }
 function visitHome(id){
  const item=shopItems.find(entry=>entry.id===id&&entry.category==='housing');if(!item||!profile?.created)return;
  if(visit)endVisit();init();visit={item,savedState:state};state={...state,x:0,z:10.8,yaw:Math.PI,pitch:0};
  computer=false;held.clear();keys.clear();drag=null;closeAppWindow(false);clearInactiveWindows();visitBack.hidden=false;visitBack.focus();
 }
 window.addEventListener('keydown',event=>{if(visit&&event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();endVisit();}},true);
 let lastObjectiveText='',lastClockText='',lastDateText='',lastActionText='',lastHintText='',lastButtonDisabled=null;
 const held=new Set();
 const body=document.body;
 const hud=document.createElement('section');hud.id='studio-world-hud';hud.hidden=true;hud.innerHTML='<header><div><small>MON ESPACE VJ</small><strong data-world-home>Ton espace VJ</strong><span data-world-objective></span></div><div><time data-world-clock></time><strong data-world-date></strong><small>Temps du monde · ×12</small></div></header><div class="studio-world-interact"><p data-world-hint></p><button data-world-computer>Utiliser · E</button><details class="world-controls-help"><summary>Commandes</summary><small>ZQSD / WASD / flèches : marcher · glisser la souris : regarder · E : utiliser</small><div class="world-move-pad"><button data-walk="forward" aria-label="Avancer">↑</button><button data-walk="left" aria-label="Aller à gauche">←</button><button data-walk="back" aria-label="Reculer">↓</button><button data-walk="right" aria-label="Aller à droite">→</button></div></details></div>';body.append(hud);
 const objectiveNode=hud.querySelector('[data-world-objective]');
 const clockNode=hud.querySelector('[data-world-clock]');
 const dateNode=hud.querySelector('[data-world-date]');
 const hintNode=hud.querySelector('[data-world-hint]');
 const actionButton=hud.querySelector('[data-world-computer]');
 const leave=document.createElement('button');leave.id='leave-studio-computer';leave.textContent='← Me lever de l’ordinateur';leave.hidden=true;body.append(leave);
 const academy=document.querySelector('#academy');
 const fieldSchool=document.querySelector('#field-school');
 const lamp=new THREE.PointLight(0xffc481,0,10);lamp.position.set(-4,3,8.5);scene.add(lamp);
 function init(){
  if(owner===profile&&state)return;
  owner=profile;const s=profile.studioWorld||{};
  state={x:Number.isFinite(s.x)?clamp(s.x,-6.1,6.1):-1.25,z:Number.isFinite(s.z)?clamp(s.z,4.6,13.45):10.4,yaw:Number(s.yaw)||0,pitch:clamp(Number(s.pitch)||0,-.9,.9),seconds:Number.isFinite(s.seconds)?Math.max(0,s.seconds):18*3600};
  if(Math.abs(Number(s.x))>6.2||Number(s.z)>13.5||Number(s.z)<4.4){state.x=-1.25;state.z=10.4;state.yaw=0;}
  // Keep the saved career date authoritative when loading pre-unified clocks.
  state.seconds=(Math.max(1,Number(profile.day)||1)-1)*86400+state.seconds%86400;
  profile.studioWorld=state;
 }
 function near(){return Math.hypot(state.x-.35,state.z-8.9)<2.25;}
 function enter(){init();computer=false;currentApp=null;closeAppWindow(false);clearInactiveWindows();held.clear();keys.clear();document.activeElement?.blur();}
 function getWorldAction(){
  if(visit)return null;
  if(window.StudioLife?.hint(state))return {source:'life',...window.StudioLife.hint(state)};
  if(window.StudioWardrobe?.near(state))return {source:'wardrobe',enabled:true,label:'Ouvrir la garde-robe · E'};
  if(window.StudioStorage?.near(state))return {source:'storage',enabled:true,label:'Voir mon inventaire · E'};
  if(window.StudioJourney?.hint(state))return {source:'journey',...window.StudioJourney.hint(state)};
  if(near())return {source:'computer',enabled:true,label:'Utiliser l’ordinateur · E'};
  return null;
 }
 function useComputer(){
  if(!state)return;const action=getWorldAction();if(!action?.enabled)return;
  if(action.source==='life'){window.StudioLife.act(state);return;}
  if(action.source==='wardrobe'){StudioWardrobe.open();return;}
  if(action.source==='storage'){StudioStorage.open();return;}
  if(action.source==='journey'){StudioJourney.act(state);return;}
  computer=true;held.clear();keys.clear();body.classList.remove('studio-world-view');hud.hidden=true;leave.hidden=false;focusRoomCamera();document.activeElement?.blur();
 }
 leave.onclick=()=>{closeAppWindow(false);clearInactiveWindows();computer=false;held.clear();keys.clear();document.activeElement?.blur();};actionButton.onclick=useComputer;
 function blocked(x,z){return window.StudioSet?.blocked(x,z)||window.StudioStorage?.blocked(x,z)||window.StudioWardrobe?.blocked?.(x,z)||window.StudioLife?.blocked?.(x,z)||false;}
 function canOccupy(x,z){
  if(x<-6.25+PLAYER_RADIUS||x>6.25-PLAYER_RADIUS||z<4.5+PLAYER_RADIUS||z>13.55-PLAYER_RADIUS)return false;
  return !blocked(x,z)&&!blocked(x+PLAYER_RADIUS,z)&&!blocked(x-PLAYER_RADIUS,z)&&!blocked(x,z+PLAYER_RADIUS)&&!blocked(x,z-PLAYER_RADIUS);
 }
 function recoverIfBlocked(){
  if(canOccupy(state.x,state.z))return;
  const safe=[[-1.25,10.4],[0,10.8],[-2.4,11.6],[2.25,9.4],[0,12.2],[2.4,11.6]];
  const spot=safe.find(([x,z])=>canOccupy(x,z));
  if(spot){state.x=spot[0];state.z=spot[1];state.yaw=0;}
 }
 function movePlayer(dx,dz,dt){
  recoverIfBlocked();
  const frame=Math.min(MAX_MOVE_DT,Math.max(0,Number(dt)||0));
  const distance=MOVE_SPEED*frame;
  const steps=Math.max(1,Math.ceil(distance/COLLISION_STEP));
  const step=distance/steps;
  for(let i=0;i<steps;i++){
   const nx=state.x+dx*step,nz=state.z+dz*step;
   if(canOccupy(nx,state.z))state.x=nx;
   if(canOccupy(state.x,nz))state.z=nz;
  }
 }
 function movementDirection(event){
  const code=event.code||'';
  const key=String(event.key||'').toLowerCase();
  if(code==='ArrowUp'||code==='KeyW'||code==='KeyZ'||key==='arrowup'||key==='w'||key==='z')return 'forward';
  if(code==='ArrowDown'||code==='KeyS'||key==='arrowdown'||key==='s')return 'back';
  if(code==='ArrowLeft'||code==='KeyA'||code==='KeyQ'||key==='arrowleft'||key==='a'||key==='q')return 'left';
  if(code==='ArrowRight'||code==='KeyD'||key==='arrowright'||key==='d')return 'right';
  return null;
 }
 function advanceWorld(seconds){
  init();const numeric=Number(seconds),amount=Number.isFinite(numeric)?Math.max(0,numeric):0;
  const beforeDay=Math.floor(state.seconds/86400);
  state.seconds+=amount;
  const crossed=Math.floor(state.seconds/86400)-beforeDay;
  // All time sources (walking, computer, sleep) use the same daily bookkeeping.
  for(let i=0;i<crossed;i++)advanceDay({fromWorld:true});
  if(crossed)window.dispatchEvent(new Event('vj-world-day'));
  return state.seconds;
 }
 function stepWorldClock(dt,active){if(!active)return;const frame=Math.min(MAX_CLOCK_DT,Math.max(0,Number(dt)||0));advanceWorld(frame*WORLD_TIME_SCALE);lastSave+=frame;if(lastSave>=10){lastSave=0;saveSlots();}}
 function clockParts(){init();const totalMinutes=Math.floor(state.seconds/60),hour=Math.floor(totalMinutes/60)%24;return {seconds:state.seconds,day:Math.floor(state.seconds/86400)+1,hour,minute:totalMinutes%60};}
 function writeText(node,value,key){if(key==='objective'){if(value===lastObjectiveText)return;lastObjectiveText=value;}else if(key==='clock'){if(value===lastClockText)return;lastClockText=value;}else if(key==='date'){if(value===lastDateText)return;lastDateText=value;}else if(key==='action'){if(value===lastActionText)return;lastActionText=value;}else if(key==='hint'){if(value===lastHintText)return;lastHintText=value;}node.textContent=value;}
 function tick(dt){
  if(!profile?.created){window.StudioSet?.tick(false);window.StudioStorage?.tick(dt,false);window.StudioWardrobe?.tick(false);window.StudioJourney?.tick(false);window.StudioLife?.tick?.(false);hud.hidden=true;leave.hidden=true;if(player)player.visible=true;body.classList.remove('studio-world-view');lamp.intensity=0;return;}init();
  const desktop=body.classList.contains('screen-desktop'),gig=body.classList.contains('screen-gig');
  stepWorldClock(dt,!visit&&!document.hidden&&(desktop||gig)&&!liveShow?.paused);
  const overlay=Boolean((academy&&!academy.hidden)||(fieldSchool&&!fieldSchool.hidden));
  const walking=desktop&&!computer&&!overlay&&gigSetupModal.hidden;
  window.StudioJourney?.tick(walking);window.StudioSet?.tick(walking);window.StudioStorage?.tick(dt,walking);window.StudioWardrobe?.tick(walking);window.StudioLife?.tick?.(walking);
  if(camera.fov!==(walking?70:48)){camera.fov=walking?70:48;camera.updateProjectionMatrix();}
  player.visible=!walking;body.classList.toggle('studio-world-view',walking);hud.hidden=!walking;leave.hidden=!desktop||!computer||overlay||!gigSetupModal.hidden;lamp.intensity=walking?1.15+Math.cos((state.seconds/3600%24)/24*Math.PI*2)*.35:0;
  window.PhysicalPanels?.tick();
  visitBack.hidden=!walking||!visit;
  if(!walking)return;
  recoverIfBlocked();
  const f=held.has('forward'),back=held.has('back'),left=held.has('left'),right=held.has('right');
  let dx=Number(right)-Number(left),dz=Number(back)-Number(f);if(dx||dz){const length=Math.hypot(dx,dz);dx/=length;dz/=length;const rx=dx*Math.cos(state.yaw)+dz*Math.sin(state.yaw),rz=dz*Math.cos(state.yaw)-dx*Math.sin(state.yaw);movePlayer(rx,rz,dt);player.rotation.y=Math.atan2(rx,rz);}
  player.position.set(state.x,0,state.z);cameraControl.target.set(state.x,1.1,state.z);cameraControl.yaw=state.yaw;cameraControl.pitch=state.pitch;cameraControl.distance=4.8;camera.position.set(state.x,1.65,state.z);camera.lookAt(state.x-Math.sin(state.yaw)*Math.cos(state.pitch),1.65+Math.sin(state.pitch),state.z-Math.cos(state.yaw)*Math.cos(state.pitch));
  const objective=profile.preparedDeparture?(profile.preparedDeparture.packed?{x:5.75,z:11.25,label:'Rejoins la sortie'}:{x:4.7,z:12.15,label:'Regroupe le matériel'}):{x:.35,z:8.9,label:'Ton ordinateur'};let bearing=Math.atan2(objective.x-state.x,state.z-objective.z)+state.yaw;bearing=Math.atan2(Math.sin(bearing),Math.cos(bearing));writeText(objectiveNode,`${objective.label} · ${Math.ceil(Math.hypot(objective.x-state.x,objective.z-state.z))} m ${Math.abs(bearing)<.5?'↑':Math.abs(bearing)>2.5?'↓':bearing>0?'→':'←'}`,'objective');
  const homeNode=hud.querySelector('[data-world-home]');const homeTitle=visit?`Visite · ${visit.item.label}`:profile.housing.type;if(homeNode&&homeNode.textContent!==homeTitle)homeNode.textContent=homeTitle;
  if(visit)writeText(objectiveNode,`${visit.item.rent}$ / mois · ${window.StudioStorage?.capacity(visit.item.label) ?? 24} places`,'objective');
  const clock=clockParts();
  hud.querySelector('header>div:last-child>small').textContent=visit?'Visite · temps en pause':'Temps du monde · ×12';writeText(clockNode,`${String(clock.hour).padStart(2,'0')}:${String(clock.minute).padStart(2,'0')}`,'clock');
  const dateLabel=typeof formatScheduledDay==='function'?`${formatScheduledDay(profile.day)} · Année ${getYearNumber(profile.day)}`:`Jour ${profile.day}`;writeText(dateNode,dateLabel,'date');
  const action=getWorldAction(),disabled=!action?.enabled,actionText=visit?'Visite libre':action?.label||'Approche-toi d’un objet interactif';if(lastButtonDisabled!==disabled){lastButtonDisabled=disabled;actionButton.disabled=disabled;}writeText(actionButton,actionText,'action');writeText(hintNode,(visit?'Marche pour explorer. Retour aux locaux pour choisir ton espace.':action?.hint)||(near()?'Ordinateur : booking, messages, boutique et carrière.':'Explore ton espace : les objets importants sont utilisables directement.'),'hint');
 }
 window.addEventListener('keydown',e=>{if(!body.classList.contains('studio-world-view')||e.target.closest('input,textarea,select'))return;const direction=movementDirection(e);const key=String(e.key||'').toLowerCase();if(key==='e'){e.preventDefault();useComputer();return;}if(direction){e.preventDefault();held.add(direction);}});
 window.addEventListener('keyup',e=>{const direction=movementDirection(e);if(direction)held.delete(direction);});window.addEventListener('blur',()=>held.clear());document.addEventListener('visibilitychange',()=>{if(document.hidden){held.clear();if(state)saveSlots();}});
 hud.querySelectorAll('[data-walk]').forEach(button=>{button.onpointerdown=e=>{e.preventDefault();held.add(button.dataset.walk);button.setPointerCapture(e.pointerId);};button.onpointerup=button.onpointercancel=()=>held.delete(button.dataset.walk);});
 canvas.addEventListener('pointerdown',e=>{if(!body.classList.contains('studio-world-view'))return;drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);});canvas.addEventListener('pointermove',e=>{if(drag===null||!state)return;const sensitivity=(profile.settings?.lookSensitivity??100)/100;state.yaw-=(e.clientX-drag.x)*.004*sensitivity;state.pitch=clamp(state.pitch-(e.clientY-drag.y)*.004*sensitivity,-.9,.9);drag={x:e.clientX,y:e.clientY};});canvas.addEventListener('pointerup',()=>drag=null);canvas.addEventListener('pointercancel',()=>drag=null);
 window.addEventListener('pagehide',()=>{if(state)saveSlots();});
 return {enter,tick,visitHome,endVisit,get visitingHome(){return visit?.item||null;},showComputer(){computer=true;held.clear();},advanceMinutes(minutes){return advanceWorld(Math.max(0,Number(minutes)||0)*60);},getClock:clockParts,get computerOpen(){return computer;}};
})();
