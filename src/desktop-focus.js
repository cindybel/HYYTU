/* Phase 8 · VJOS navigation clarity. One complete desktop for every career. */
window.DesktopFocus=(()=>{
 const appControls=[...document.querySelectorAll('[data-app]')];
 const iconMap={calendar:'▶',guide:'?',phone:'☎',email:'✉',social:'◆',transport:'↗',music:'♫',stats:'▥',inventory:'▣',finance:'$',settings:'⚙',skills:'★',shop:'◇',housing:'⌂'};

 function updateLabels(){
  document.querySelectorAll('.desktop-icon[data-app="social"],.app-button[data-app="social"]').forEach(button=>button.textContent='Shows');
  const guide=document.querySelector('.desktop-icon[data-app="guide"]');if(guide)guide.textContent='Guide VJ';
  const settings=document.querySelector('.desktop-icon[data-app="settings"]');if(settings)settings.textContent='Réglages';
  for(const button of appControls){if(iconMap[button.dataset.app])button.dataset.icon=iconMap[button.dataset.app];}
 }

 function activeApp(){
  try{return typeof currentApp==='string'?currentApp:null;}catch{return null;}
 }

 function ensureWindowVisible(windowEl){
  if(!windowEl||windowEl.hidden||!document.body.classList.contains('screen-desktop'))return;
  const margin=18;
  const maxWidth=Math.max(320,window.innerWidth-margin*2);
  const maxHeight=Math.max(300,window.innerHeight-132);
  const rect=windowEl.getBoundingClientRect();
  if(rect.width>maxWidth)windowEl.style.width=`${maxWidth}px`;
  if(rect.height>maxHeight)windowEl.style.height=`${maxHeight}px`;
  requestAnimationFrame(()=>{
   const r=windowEl.getBoundingClientRect();
   const maxLeft=Math.max(margin,window.innerWidth-r.width-margin);
   const maxTop=Math.max(50,window.innerHeight-r.height-86);
   let left=Math.min(Math.max(r.left,margin),maxLeft);
   let top=Math.min(Math.max(r.top,50),maxTop);
   // Old saves could remember a nearly off-screen position. Center those instead of clipping content.
   if(r.left<0||r.right>window.innerWidth||r.width>window.innerWidth-margin*2){left=Math.max(margin,Math.round((window.innerWidth-r.width)/2));}
   windowEl.style.left=`${left}px`;
   windowEl.style.top=`${top}px`;
  });
 }

 function sync(){
  document.body.classList.remove('desktop-focused');
  document.querySelector('#desktop-tools-toggle')?.remove();
  const active=activeApp();
  for(const button of appControls){
   const selected=Boolean(active&&button.dataset.app===active);
   button.classList.toggle('selected',selected);
   button.setAttribute('aria-pressed',String(selected));
   if(selected)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');
  }
  const windowEl=document.querySelector('#app-window');
  if(windowEl){windowEl.setAttribute('aria-live','polite');windowEl.setAttribute('aria-atomic','false');ensureWindowVisible(windowEl);}
 }

 updateLabels();
 for(const button of appControls){
  button.setAttribute('aria-pressed','false');
  button.addEventListener('click',()=>requestAnimationFrame(sync));
 }

 const appWindow=document.querySelector('#app-window');
 if(appWindow){new MutationObserver(()=>requestAnimationFrame(sync)).observe(appWindow,{childList:true,subtree:false});}
 window.addEventListener('resize',()=>requestAnimationFrame(()=>ensureWindowVisible(appWindow)));

 window.addEventListener('keydown',event=>{
  if(!document.body.classList.contains('screen-desktop'))return;
  if(event.altKey||event.ctrlKey||event.metaKey||event.target.closest('input,textarea,select'))return;
  const map={
   '1':'calendar','2':'social','3':'email','4':'inventory','5':'shop','6':'skills',
  };
  const app=map[event.key];if(!app)return;
  const target=document.querySelector(`.desktop-icon[data-app="${app}"]`)||document.querySelector(`.app-button[data-app="${app}"]`);
  if(target){event.preventDefault();target.click();}
 });

 sync();
 return {update:sync,ensureWindowVisible};
})();

/* Phase 10 · Career balancing.
   Early gigs now fund useful starter upgrades without making late career rewards explode.
   Skill XP from live gigs is normalized so a 0-100 score cannot accidentally grant hundreds of XP. */
window.VJBalance=(()=>{
 const economy={earlyGigBoost:1.12,midGigBoost:1.06,lateGigBoost:1.03,minEarlyPay:240,minMidPay:520};
 const progression={gigXpMin:34,gigXpMax:56,courseBase:48,courseTierStep:16};

 function rebalanceGigs(){
  if(typeof starterGigs==='undefined'||!Array.isArray(starterGigs))return;
  for(const gig of starterGigs){
   const number=Math.max(1,Number(gig.number)||1);
   const multiplier=number<=6?economy.earlyGigBoost:number<=16?economy.midGigBoost:economy.lateGigBoost;
   const floor=number<=6?economy.minEarlyPay:number<=16?economy.minMidPay:0;
   gig.budget=Math.max(floor,Math.round(((Number(gig.budget)||0)*multiplier)/5)*5);
   const naturalGate=Math.max(0,Math.round((number-1)*2.6));
   gig.minRep=Math.min(Number(gig.minRep)||naturalGate,naturalGate);
  }
 }

 function quality01(value){
  const raw=Number(value);
  if(!Number.isFinite(raw))return .65;
  if(raw>2)return Math.max(0,Math.min(1,raw/100));
  return Math.max(0,Math.min(1,raw));
 }

 function tuneProgression(){
  const api=window.VJProgression;if(!api||api.__balanced)return;
  api.courseXp=function(id,tier=1){
   const amount=progression.courseBase+Math.max(0,Number(tier)-1)*progression.courseTierStep;
   return api.addXp(id,amount,'course',`course-${id}-${tier}-day-${Number(profile?.day)||1}`);
  };
  api.gigXp=function(id,quality=.65,gigId='gig'){
   const q=quality01(quality);
   const amount=Math.round(progression.gigXpMin+(progression.gigXpMax-progression.gigXpMin)*q);
   return api.addXp(id,amount,'gig',`${gigId}:${id}`);
  };
  api.__balanced=true;
 }

 rebalanceGigs();tuneProgression();
 return {economy,progression,rebalanceGigs,tuneProgression};
})();

/* Phase 11 · final interaction polish. */
window.VJPolish=(()=>{
 const taskClock=document.querySelector('.task-clock');
 const appNames={calendar:'Sessions',social:'Shows',email:'Email',inventory:'Inventaire',shop:'Shop',skills:'Skills',finance:'Banque',music:'Player',settings:'Réglages',phone:'Contacts',transport:'Uver',stats:'Stats',guide:'Guide VJ'};
 let lastTitle='';

 function updateTaskClock(){
  if(!taskClock)return;
  let text='VJOS';
  try{
   const clock=window.StudioWorld?.getClock?.();
   if(clock)text=`Jour ${clock.day} · ${String(clock.hour).padStart(2,'0')}:${String(clock.minute).padStart(2,'0')}`;
  }catch{}
  taskClock.textContent=text;
 }

 function updateTitle(){
  let next='VJ Simulator';
  try{
   if(document.body.classList.contains('screen-gig')&&typeof currentGig!=='undefined'&&currentGig)next=`${currentGig.title} · VJ Simulator`;
   else if(document.body.classList.contains('screen-desktop')&&typeof currentApp==='string'&&currentApp)next=`${appNames[currentApp]||currentApp} · VJ Simulator`;
   else if(document.body.classList.contains('screen-creator'))next='Création du VJ · VJ Simulator';
  }catch{}
  if(next!==lastTitle){lastTitle=next;document.title=next;}
 }

 function applyMotionPreference(){
  const systemReduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const gameReduced=Boolean(profile?.settings?.reducedMotion);
  document.body.classList.toggle('reduced-motion',Boolean(systemReduced||gameReduced));
 }

 window.addEventListener('keydown',event=>{if(event.key==='Tab')document.body.classList.add('keyboard-navigation');});
 window.addEventListener('pointerdown',()=>document.body.classList.remove('keyboard-navigation'),{passive:true});
 window.matchMedia?.('(prefers-reduced-motion: reduce)').addEventListener?.('change',applyMotionPreference);

 const observer=new MutationObserver(()=>{updateTitle();updateTaskClock();});
 observer.observe(document.body,{attributes:true,attributeFilter:['class'],subtree:false});
 document.querySelector('#app-window')&&observer.observe(document.querySelector('#app-window'),{childList:true,subtree:false});

 setInterval(()=>{updateTaskClock();updateTitle();},1000);
 applyMotionPreference();updateTaskClock();updateTitle();
 return {updateTaskClock,updateTitle,applyMotionPreference};
})();

/* Final audit · load the beginner-only Resolut cleanup after every deferred studio script. */
window.addEventListener('load',()=>{
 if(document.querySelector('script[data-resolut-beginner]'))return;
 const script=document.createElement('script');
 script.src='./src/resolut-beginner.js?v=beginner-20260914';
 script.dataset.resolutBeginner='1';
 document.head.append(script);
},{once:true});
