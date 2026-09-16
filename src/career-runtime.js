/* Career continuity, meaningful next steps, and preferences. */
function captureActiveRun() {
  if(currentGig?.physical)return;
  if (!currentGig || runFinished || !activeGigLoadout || !document.body.classList.contains('screen-gig')) return;
  profile.activeRun = {
    version:1, gigId:currentGig.id, loadout:JSON.parse(JSON.stringify(activeGigLoadout)),
    setupElapsed:liveSetupElapsed ?? (gigStartedAt ? performance.now()-gigStartedAt : 0),
    currentVideoIndex, live:liveShow?.snapshot() || null,
    rigs:rigs.map(rig=>({calibration:{...rig.calibration}, connected:rig.cable.connected, maskPoints:rig.maskPoints.map(p=>[p.x,p.y]),maskQuality:rig.maskQuality,maskZones:rig.maskZones?.map(zone=>zone.map(p=>[p.x,p.y])),mappingZone:rig.mappingZone||0})),
  };
}
function resumeActiveRun() {
  if(profile.physical?.active)return window.PhysicalV4?.resume();
  const saved=profile.activeRun;
  const gig=profile.gigs.find(g=>g.id===saved?.gigId);
  if (!saved || !gig || ['done','cancelled'].includes(gig.status)) { profile.activeRun=null; return; }
  currentGig=gig;activeGigLoadout=saved.loadout;runFinished=false;pendingGigSetup=null;
  gigSetupModal.hidden=true;
  currentVideoIndex=clamp(Number(saved.currentVideoIndex)||0,0,videoClips.length-1);
  loadVideoTexture(videoClips[currentVideoIndex].src);
  buildGigScene();resetGigRun();
  saved.rigs?.forEach((state,index)=>{
    const rig=rigs[index];if(!rig)return;
    Object.assign(rig.calibration,state.calibration);
    CeilingMounts.restore(rig);
    rig.cable.connected=Boolean(state.connected);rig.cable.mesh.visible=rig.cable.connected;
    rig.maskPoints=(state.maskPoints||[]).map(([x,y])=>new THREE.Vector2(x,y));rig.maskQuality=Number(state.maskQuality)||0;if(state.maskZones){PolygonMapping.init(rig);rig.maskZones=state.maskZones.map(zone=>zone.map(([x,y])=>({x,y})));rig.mappingZone=Math.min(state.mappingZone||0,rig.maskZones.length-1);rig.maskPoints=rig.maskZones[rig.mappingZone];}updateMaskContour(rig);
  });
  gigStartedAt=performance.now()-Math.max(0,Number(saved.setupElapsed)||0);
  gigTitle.textContent=`${gig.title} - ${gig.venue}`;
  showScreen('gig');updateRigs();updateGigHud();
  if(saved.live){startLivePerformance({restoring:true});liveShow.restore(saved.live);}
  message.textContent='Contrat repris. Les frais déjà payés ne sont pas débités à nouveau.';
  saveSlots();
}
function careerNextStep() {
  if(profile.activeRun)return {title:'Ta prestation est en pause',text:'Reprends exactement ton setup et ta régie. Aucun nouveau frais.',label:'Reprendre la prestation',action:'resume'};

  const offered=profile.gigs.find(g=>g.status==='offered');
  if(offered)return {title:'Un client t’a répondu',text:`${offered.title} · ouvre tes emails pour accepter, négocier ou refuser.`,label:'Lire la réponse',action:'email'};

  const playable=profile.gigs.find(g=>['accepted','scheduled'].includes(g.status)&&canPlayGig(g));
  if(playable)return {title:'C’est le jour du show',text:`${playable.title} · ton contrat est confirmé. Prépare ton setup et pars au venue.`,label:'Préparer mon show',action:'session',id:playable.id};

  const upcoming=profile.gigs.find(g=>['accepted','scheduled'].includes(g.status));
  if(upcoming)return {title:'Un show est planifié',text:`${upcoming.title} · prévu ${formatScheduledDay(getGigAbsoluteDay(upcoming))}. Utilise le temps avant le gig pour pratiquer, te former ou améliorer ton matériel.`,label:'Voir mes contrats',action:'booking'};

  const pending=profile.gigs.find(g=>g.status==='pending');
  if(pending)return {title:'Candidature envoyée',text:`${pending.title} · le client n’a pas encore répondu. Continue ta journée : pratique, formation, équipement ou nouvelles candidatures.`,label:'Voir le booking',action:'booking'};

  return {title:'Trouve ton prochain gig',text:'Explore le réseau de booking, vérifie les prérequis et envoie une candidature. Les clients répondent après un délai dans le temps du jeu.',label:'Chercher des gigs',action:'booking'};
}
function renderCareerCompass() {
  const host=document.querySelector('#career-compass');if(!host||!profile)return;
  const next=careerNextStep();
  host.innerHTML=`<span class="compass-kicker">CARRIÈRE · PROCHAINE ÉTAPE</span><h2>${escapeHtml(next.title)}</h2><p>${escapeHtml(next.text)}</p><button type="button" class="primary-action">${escapeHtml(next.label)}</button><small>${Number(profile.showSessions||0)} show(s) joué(s) · progression jour après jour</small>`;
  host.querySelector('button').addEventListener('click',()=>{
    if(next.action==='session')prepareSessionGig(next.id);else if(next.action==='learning')document.querySelector('#field-launch').click();else if(next.action==='resume')resumeActiveRun();else if(next.action==='gig')startGig(next.id);else openApp(next.action);
  });
}
function applyGamePreferences() {
  if(!profile?.settings)return;
  const s=profile.settings;
  musicAudio.volume=clamp(Number(s.volume??70)/100,0,1);
  const ratio=s.graphics==='performance'?1:s.graphics==='quality'?2:1.5;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,ratio));
  renderer.shadowMap.enabled=s.graphics!=='performance';
  scene.traverse(o=>{if(o.material && !Array.isArray(o.material))o.material.needsUpdate=true;});
  document.body.classList.toggle('reduced-motion',Boolean(s.reducedMotion));
  if(videoElement) {if(s.stillVisuals)videoElement.pause();else videoElement.play().catch(()=>{});}
  if(liveShow)liveShow.stillVisuals=Boolean(s.stillVisuals);
}
let premiumAudioContext;
function uiFeedback() {
  if(!profile?.settings?.uiSounds || Number(profile.settings.uiVolume??35)===0)return;
  try {
    premiumAudioContext ||= new (window.AudioContext||window.webkitAudioContext)();
    premiumAudioContext.resume();
    const osc=premiumAudioContext.createOscillator(),gain=premiumAudioContext.createGain();
    osc.type='sine';osc.frequency.setValueAtTime(540,premiumAudioContext.currentTime);osc.frequency.exponentialRampToValueAtTime(760,premiumAudioContext.currentTime+.045);
    gain.gain.setValueAtTime(.025*Number(profile.settings.uiVolume??35)/100,premiumAudioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.0001,premiumAudioContext.currentTime+.065);
    osc.connect(gain);gain.connect(premiumAudioContext.destination);osc.start();osc.stop(premiumAudioContext.currentTime+.07);
  }catch{/* Audio is optional; gameplay remains available. */}
}
window.addEventListener('pagehide',()=>{captureActiveRun();saveSlots();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){captureActiveRun();saveSlots();}});
document.addEventListener('click',event=>{if(event.target.closest('button:not(:disabled)'))uiFeedback();});
setInterval(()=>{if(currentGig&&!runFinished&&document.body.classList.contains('screen-gig'))saveSlots();},4000);

/* Unified career progression. Kept here because this runtime is loaded before the learning UIs. */
window.VJProgression=(()=>{
  const thresholds=[0,100,260,500,800,1200];
  const legacyLearningKey='vj-field-learning-v1';
  const learningRewards={mix:{skill:'timePressure',xp:12},wall:{skill:'mapping',xp:22},energy:{skill:'timePressure',xp:18},cable:{skill:'cabling',xp:22},client:{skill:'timePressure',xp:12},contract:{skill:'cabling',xp:10}};
  function root(){
    if(typeof profile==='undefined'||!profile)return null;
    profile.settings ||= {};profile.settings.progression ||= {version:1,skillXp:{},learning:{},practiceLog:{},history:[]};
    const p=profile.settings.progression;p.skillXp ||= {};p.learning ||= {};p.practiceLog ||= {};p.history ||= [];
    if(!p.legacyLearningMigrated){try{const legacy=JSON.parse(localStorage.getItem(legacyLearningKey)||'{}')||{};Object.entries(legacy).forEach(([id,v])=>{if(v)p.learning[id]=true;});}catch{}p.legacyLearningMigrated=true;}
    if(profile.skills)for(const [id,value] of Object.entries(profile.skills)){if(Number.isFinite(Number(p.skillXp[id])))continue;const level=Math.max(0,Math.min(5,Number(value)||0));p.skillXp[id]=thresholds[level]||0;}
    return p;
  }
  function levelForXp(xp){let level=0;for(let i=1;i<thresholds.length;i++)if(xp>=thresholds[i])level=i;return level;}
  function get(id){const p=root();const xp=Math.max(0,Number(p?.skillXp?.[id])||0),level=levelForXp(xp),maxLevel=thresholds.length-1,floor=thresholds[level],next=thresholds[Math.min(level+1,maxLevel)];return{id,xp,level,maxLevel,next,intoLevel:xp-floor,needed:level>=maxLevel?0:next-floor};}
  function repeatMultiplier(p,id,source){const key=`${Number(profile?.day)||1}:${id}:${source}`,count=Number(p.practiceLog[key])||0;p.practiceLog[key]=count+1;return [1,.65,.4,.25][Math.min(count,3)];}
  function label(id){return typeof skillCatalog!=='undefined'&&skillCatalog.find(s=>s.id===id)?.label||id;}
  function addXp(id,amount,source='practice',evidence=null){
    const p=root();if(!p)return {gained:0,...get(id)};const before=get(id),multiplier=['gig','course'].includes(source)?1:repeatMultiplier(p,id,source),gained=Math.max(1,Math.round(Math.max(0,Number(amount)||0)*multiplier));
    p.skillXp[id]=(Number(p.skillXp[id])||0)+gained;const after=get(id);profile.skills ||= {};profile.skills[id]=Math.max(Number(profile.skills[id])||0,after.level);profile.skillEvidence ||= {};profile.skillEvidence[id] ||= [];if(evidence&&!profile.skillEvidence[id].includes(evidence))profile.skillEvidence[id].push(evidence);p.history.push({day:Number(profile.day)||1,skill:id,xp:gained,source,evidence:evidence||null});if(p.history.length>100)p.history.splice(0,p.history.length-100);if(after.level>before.level&&typeof notify==='function')notify(`${label(id)} passe niveau ${after.level}. De nouvelles possibilités sont accessibles.`);if(typeof unlockGigs==='function')unlockGigs();if(typeof saveSlots==='function')saveSlots();window.dispatchEvent(new CustomEvent('vj-progression',{detail:{id,gained,source,before,after}}));return{gained,multiplier,...after,leveled:after.level>before.level};
  }
  function completeLearning(id){const p=root();if(!p)return false;const first=!p.learning[id];p.learning[id]=true;if(first){const reward=learningRewards[id];if(reward)addXp(reward.skill,reward.xp,'lesson',`lesson-${id}`);else if(typeof saveSlots==='function')saveSlots();}else if(typeof saveSlots==='function')saveSlots();window.dispatchEvent(new Event('vj-learning'));return true;}
  function readLearning(){return {...(root()?.learning||{})};}
  function progressText(id){const s=get(id);return s.level>=s.maxLevel?`Niveau ${s.level} · maîtrise actuelle`:`Niveau ${s.level} · ${s.intoLevel}/${s.needed} XP vers niveau ${s.level+1}`;}
  function courseXp(id,tier=1){return addXp(id,45+Math.max(0,tier-1)*18,'course',`course-${id}-${tier}-day-${Number(profile?.day)||1}`);}
  function gigXp(id,quality=1,gigId='gig'){return addXp(id,Math.round(22+Math.max(0,quality)*18),'gig',`${gigId}:${id}`);}
  return{thresholds,get,addXp,courseXp,gigXp,completeLearning,readLearning,progressText};
})();
