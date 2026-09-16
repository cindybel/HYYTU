/* Local two-deck mixer. Cues are a compressed exercise, not audio analysis. */
class VJLiveShow {
  constructor(root, clips, options={}) {
    this.root = root;this.options=options;this.preparedByPlayer=false;this.stageTasks=[false,false,false,false];
    this.clips = clips;
    this.duration = 60;
    this.stillVisuals=Boolean(profile.settings.stillVisuals);
    this.elapsed = 0;
    this.paused=false;this.feedbackKey="";
    this.intensity = 0.5;
    this.blackout = false;
    this.started = false;
    this.completed = false;
    this.integral = 0;
    this.phaseStats=Array.from({length:4},()=>({seconds:0,matched:0}));
    this.transitions = 0;
    this.transition = null;
    this.queuedAt=null;this.syncedTransitions=0;
    this.currentIndex = 0;
    this.previewIndex = 1 % clips.length;
    this.effects={saturation:100,hue:0,zoom:100,mirror:false};
    this.effectChanges=0;
    this.cues = [
      {name:'WARM-UP',low:25,high:45,text:'Le DJ installe le groove. Garde de la place à la lumière : intensité 25–45 %.'},
      {name:'MONTÉE',low:50,high:70,text:'L’énergie monte. Prépare un autre visuel puis lance un fondu. Intensité 50–70 %.'},
      {name:'PEAK',low:75,high:95,text:'Le set atteint son pic. Soutiens l’énergie sans tout écraser : intensité 75–95 %.'},
      {name:'BREAK',low:15,high:35,text:'Le DJ retire le kick. Fais respirer la projection : intensité 15–35 %.'},
    ];
    this.showProfile=ShowProfiles.get(options.gig||currentGig);
    this.cues=ShowProfiles.cues(options.gig||currentGig);
    root.innerHTML = `
      <div class="live-show-head"><div><span class="live-indicator"></span><strong>RESOLUTE 8 · MIX VIDÉO</strong><small>Session guidée · 60 s · bande-son originale synthétisée</small></div><span data-live-time>00:00 / 01:00</span><button type="button" data-live-view aria-pressed="true">Régie complète</button><button type="button" data-live-pause aria-pressed="false">Pause</button></div>
      <div class="live-cue"><b data-live-cue>WARM-UP</b><span data-live-instruction></span><progress data-live-progress max="60" value="0" aria-label="Progression de la prestation"></progress></div>
      <div class="live-response" data-live-response role="status">Écoute le groove, puis règle ton intensité.</div><details class="live-help"><summary>Pourquoi ?</summary><p>La bande-son suit quatre passages écrits pour apprendre : warm-up, montée, peak et break. Elle ne détecte pas une musique importée. Le retour évalue ton intensité et tes fondus, jamais la beauté de tes choix.</p><label><input type="checkbox" data-live-music> Bande-son du show</label></details><div class="live-desk">
        <div class="live-monitor"><span>PROGRAMME · EN SALLE</span><canvas width="640" height="360" data-live-program aria-label="Sortie vidéo diffusée"></canvas><small data-live-program-name></small></div>
        <div class="live-monitor"><span>PRÉVIEW · HORS DIFFUSION</span><div data-live-preview></div><select data-live-select aria-label="Visuel à préparer"></select></div>
        <div class="live-mix-controls"><label>Durée du fondu <select data-live-duration><option value="0.6">Rapide · 0,6 s</option><option value="2" selected>Doux · 2 s</option><option value="4">Lent · 4 s</option></select></label><button type="button" data-live-take>Envoyer en fondu →</button><button type="button" data-live-sync aria-pressed="false">Fondu au prochain temps 1</button><p data-live-status aria-live="polite">Prépare un clip sans modifier la sortie.</p></div>
        <div class="live-level-controls"><span data-live-target></span><label>Intensité de sortie <output data-live-level>50 %</output><input data-live-intensity type="range" min="0" max="100" value="50" aria-label="Intensité de sortie" /></label><button type="button" data-live-blackout aria-pressed="false">Blackout</button><small>Coupe l’image en salle. Le clip continue de tourner.</small></div>
        <div class="live-effect-controls" aria-label="Effets de programme"><strong>EFFETS PROGRAMME</strong><label>Saturation <output data-live-saturation-value>100 %</output><input data-live-saturation type="range" min="0" max="180" value="100" /></label><label>Teinte <output data-live-hue-value>0°</output><input data-live-hue type="range" min="-180" max="180" value="0" /></label><label>Zoom <output data-live-zoom-value>100 %</output><input data-live-zoom type="range" min="100" max="140" value="100" /></label><button type="button" data-live-mirror aria-pressed="false">Miroir horizontal</button><small>Ces choix modifient réellement le programme. Ils ne donnent pas de points gratuits.</small></div>
      </div>`;
    const task=document.createElement('section');task.className='live-action-card';task.setAttribute('aria-label','Ce que tu dois faire');task.innerHTML='<small>TON ACTION MAINTENANT</small><strong data-live-task-title></strong><p data-live-task-how></p><span data-live-task-result role=\"status\"></span>';root.querySelector('.live-cue').before(task);
    const effectsPanel=document.createElement('details');effectsPanel.className='live-effects-panel';effectsPanel.innerHTML='<summary>Effets visuels · saturation, teinte, zoom et miroir</summary>';const effectsControls=root.querySelector('.live-effect-controls');effectsControls.before(effectsPanel);effectsPanel.append(effectsControls);
    const guide=document.createElement('section');guide.className='live-performance-guide';guide.setAttribute('aria-label','Conduite du spectacle');
    guide.innerHTML=`<ol class="live-phase-track">${this.cues.map((c,i)=>`<li data-phase="${i}"><b>${c.name}</b><small>${i*15}–${(i+1)*15} s · ${c.low}–${c.high} %</small></li>`).join('')}</ol><div class="live-pulse-row"><span>${this.showProfile.bpm} BPM · mesure</span><div class="live-beats" aria-label="Quatre temps">${[1,2,3,4].map(n=>`<i>${n}</i>`).join('')}</div><span data-live-flow>Accompagne le passage</span></div><p data-live-next></p>`;
    const plan=document.createElement('details');plan.className='live-plan';plan.innerHTML='<summary>Voir les passages et le rythme</summary>';root.querySelector('.live-cue').after(plan);plan.append(guide);this.phaseNodes=[...guide.querySelectorAll('[data-phase]')];this.beatNodes=[...guide.querySelectorAll('.live-beats i')];
    root.querySelector('[data-live-sync]').onclick=()=>this.queueTake();
    const deck=document.createElement('div');deck.className='resolute-deck career-clip-deck';deck.innerHTML='<div class="resolute-layer"><small>COMPOSITION</small><strong>Couche 1</strong><span>Visuels · fondu · effets programme</span></div><div class="resolute-live-clips" role="group" aria-label="Clips Resolute 8"></div>';root.querySelector('.live-desk').before(deck);
    ClipBrowser.mount(deck.querySelector('.resolute-live-clips'),clips,index=>{if(this.paused||this.transition||this.queuedAt!=null||this.completed)return false;this.prepare(index,true);},this.previewIndex);
    root.dataset.stage='true';document.body.classList.add('live-stage-focus');root.querySelector('[data-live-view]').onclick=e=>{const focused=root.dataset.stage!=='true';root.dataset.stage=String(focused);document.body.classList.toggle('live-stage-focus',focused);e.currentTarget.textContent=focused?'Régie complète':'Voir la salle';e.currentTarget.setAttribute('aria-pressed',String(focused));};
    const musicToggle=root.querySelector('[data-live-music]');musicToggle.checked=profile.settings.liveMusic!==false;musicToggle.onchange=()=>{profile.settings.liveMusic=musicToggle.checked;saveSlots();};
    root.querySelector('[data-live-pause]').onclick=()=>{this.setPaused(!this.paused);saveSlots();};
    this.onVisibility=()=>{if(document.hidden&&!this.completed){this.setPaused(true);saveSlots();}};document.addEventListener('visibilitychange',this.onVisibility);
    this.canvas = root.querySelector('[data-live-program]');
    this.canvas.width=GearCapabilities.resolution(GearCapabilities.selected('computer'));this.canvas.height=this.canvas.width*9/16;
    root.querySelector('.live-show-head small').textContent=`${this.showProfile.name} · ${this.showProfile.bpm} BPM · ${this.canvas.width} × ${this.canvas.height}`;
    this.ctx = this.canvas.getContext('2d');
    this.select = root.querySelector('[data-live-select]');
    clips.forEach((clip,index)=>{const option=document.createElement('option');option.value=index;option.textContent=clip.label;this.select.append(option);});
    this.select.value = this.previewIndex;
    this.select.addEventListener('change',()=>this.prepare(Number(this.select.value),true));
    root.querySelector('[data-live-take]').addEventListener('click',()=>this.take());
    root.querySelector('[data-live-intensity]').addEventListener('input',event=>{
      this.intensity=Number(event.target.value)/100;
      root.querySelector('[data-live-level]').textContent=`${event.target.value} %`;
    });
    root.querySelector('[data-live-blackout]').addEventListener('click',event=>{
      this.blackout=!this.blackout;
      event.currentTarget.setAttribute('aria-pressed',String(this.blackout));
      event.currentTarget.textContent=this.blackout?'Rétablir la sortie':'Blackout';
    });
    const bindEffect=(selector,key,valueSelector,suffix='')=>{
      const input=root.querySelector(selector),output=root.querySelector(valueSelector);
      input.addEventListener('input',()=>{this.effects[key]=Number(input.value);this.effectChanges++;output.textContent=`${input.value}${suffix}`;});
    };
    bindEffect('[data-live-saturation]','saturation','[data-live-saturation-value]',' %');
    bindEffect('[data-live-hue]','hue','[data-live-hue-value]','°');
    bindEffect('[data-live-zoom]','zoom','[data-live-zoom-value]',' %');
    root.querySelector('[data-live-mirror]').addEventListener('click',event=>{this.effects.mirror=!this.effects.mirror;this.effectChanges++;event.currentTarget.setAttribute('aria-pressed',String(this.effects.mirror));});
  }
  media(index) {
    const video=document.createElement('video');
    video.src=this.clips[index].src;video.muted=true;video.loop=true;video.playsInline=true;video.preload='auto';
    video.addEventListener('error',()=>this.status('Vidéo indisponible. Vérifie les fichiers du dossier video.'));
    video.play().catch(()=>{this.status('Lecture bloquée : clique sur un contrôle pour reprendre.');});
    return video;
  }
  release(video) { if(video){video.pause();video.removeAttribute('src');video.load();video.remove();} }
  start(index) {
    this.soundtrack=new window.LiveSoundtrack();this.started=true;this.currentIndex=index;this.program=this.media(index);
    this.prepare((index+1)%this.clips.length);
    this.root.querySelector('[data-live-program-name]').textContent=this.clips[index].label;
    this.updateCue();
  }
  prepare(index, byPlayer=false) {
    if(this.paused || this.transition || this.queuedAt!=null || this.completed) return;
    if(byPlayer&&index!==this.currentIndex)this.preparedByPlayer=true;
    this.release(this.preview);this.previewIndex=index;this.select.value=index;
    this.preview=this.media(index);this.preview.setAttribute('aria-label','Clip en préparation');
    this.root.querySelector('[data-live-preview]').replaceChildren(this.preview);
    this.status('Préview chargée. La sortie en salle reste inchangée.');
  }
  queueTake() {
    if(this.paused||this.transition||this.completed||!this.started)return;
    if(this.queuedAt!=null){this.queuedAt=null;this.select.disabled=false;this.status('Fondu programmé annulé.');return;}
    if(this.previewIndex===this.currentIndex||this.preview?.readyState<2){this.status('Prépare un autre clip chargé avant de programmer le fondu.');return;}
    const bar=240/this.showProfile.bpm,at=(Math.floor(this.elapsed/bar)+1)*bar;
    if(at+Number(this.root.querySelector('[data-live-duration]').value)>this.duration){this.status('Le show se termine : utilise le fondu immédiat si nécessaire.');return;}
    this.queuedAt=at;this.select.disabled=true;this.status('Fondu prêt : départ au prochain temps 1. Reclique pour annuler.');
  }
  take(synced=false) {
    if(this.paused || this.transition || !this.started || this.completed) return;
    if(this.previewIndex===this.currentIndex){this.status('Ce clip est déjà en programme. Prépare un autre visuel.');return;}
    if(this.preview.readyState<2){this.status('Le clip charge encore. Réessaie dans un instant.');return;}
    this.program.play().catch(()=>{});this.preview.play().catch(()=>{});
    this.queuedAt=null;
    this.transition={synced,elapsed:0,duration:Number(this.root.querySelector('[data-live-duration]').value)};
    this.select.disabled=true;this.root.querySelector('[data-live-take]').disabled=true;
    this.status(synced?'Fondu lancé sur le temps 1.':'Fondu en cours : les deux clips sont mélangés dans la projection.');
  }
  status(text) { const sync=this.root.querySelector('[data-live-sync]');sync.disabled=Boolean(this.paused||this.transition||this.completed);sync.setAttribute('aria-pressed',String(this.queuedAt!=null));sync.textContent=this.queuedAt!=null?'Annuler le fondu programmé':'Fondu au prochain temps 1';this.root.querySelector('[data-live-status]').textContent=text;this.root.querySelectorAll('[data-resolute-clip]').forEach(button=>{button.setAttribute('aria-pressed',String(Number(button.dataset.resoluteClip)===this.previewIndex));button.disabled=Boolean(this.paused||this.transition||this.queuedAt!=null||this.completed);}); }
  updateCue() {
    const index=Math.min(3,Math.floor(this.elapsed/(this.duration/4)));
    this.cueIndex=index;
    if(this.phaseStats[0].matched>=5)this.stageTasks[0]=true;
    if(this.phaseStats[3].matched>=5)this.stageTasks[3]=true;
    const cue=this.cues[index],mid=Math.round((cue.low+cue.high)/2),done=this.stageTasks[index];
    const titles=['Installe l’ambiance','Change l’image en salle','Place un fondu sur le rythme','Accompagne la fin'];
    const steps=[`Déplace « Intensité de sortie » vers ${mid} %. Garde-la dans la cible pendant 5 secondes.`,this.preparedByPlayer?'Ton image est prête. Clique « Envoyer en fondu » puis laisse le fondu se terminer.':`Choisis une image différente dans PRÉVIEW. Elle reste invisible au public. Ensuite, clique « Envoyer en fondu ». Garde aussi l’intensité vers ${mid} %.`,`Prépare une image différente, puis clique « Fondu au prochain temps 1 ». Le départ attend le rythme. Garde l’intensité vers ${mid} %.`,`Ramène l’intensité vers ${mid} % pendant au moins 5 secondes. Laisse le programme visible jusqu’au bilan.`];
    this.root.querySelector('[data-live-task-title]').textContent=`${index+1}/4 · ${titles[index]}`;
    this.root.querySelector('[data-live-task-how]').textContent=done?`Geste réussi. Continue de suivre la cible ${cue.low}–${cue.high} % jusqu’au prochain passage.`:steps[index];
    this.root.querySelector('[data-live-task-result]').textContent=`${done?'✓ Réussi':'À jouer'} · ${this.stageTasks.filter(Boolean).length}/4 défis de scène réussis`;
    this.root.querySelectorAll('[data-action-highlight]').forEach(el=>el.removeAttribute('data-action-highlight'));
    const target=index===1?(this.preparedByPlayer?'[data-live-take]':'[data-live-select]'):index===2?'[data-live-sync]':'[data-live-intensity]';
    if(!done)this.root.querySelector(target)?.setAttribute('data-action-highlight','true');
    this.root.querySelector('[data-live-cue]').textContent=this.cues[index].name;
    this.root.querySelector('[data-live-instruction]').textContent=this.cues[index].text;
    this.phaseNodes.forEach((node,i)=>{node.setAttribute('aria-current',i===index?'step':'false');node.dataset.done=String(i<index);});
    const beat=Math.floor(this.elapsed*this.showProfile.bpm/60)%4;
    this.beatNodes.forEach((node,i)=>node.dataset.active=String(i===beat));
    const next=this.cues[index+1],remaining=Math.max(0,Math.ceil((index+1)*15-this.elapsed));
    this.root.querySelector('[data-live-next]').textContent=next?`Dans ${remaining} s : ${next.name} · vise ${next.low}–${next.high} %. Prépare ton prochain visuel.`:`Finale : ${remaining} s · laisse respirer la sortie jusqu’au bilan.`;
    this.root.querySelector('[data-live-target]').textContent=`Cible actuelle : ${this.cues[index].low}–${this.cues[index].high} %`;
    const phase=this.phaseStats[index],match=phase.seconds>0?Math.round(phase.matched/phase.seconds*100):0;
    this.root.querySelector('[data-live-flow]').textContent=`Passage accompagné : ${match} % du temps · ${this.syncedTransitions} fondu(s) sur le temps 1`;

  }
  setPaused(value) {
    if(this.completed)return;this.paused=value;const b=this.root.querySelector('[data-live-pause]');b.textContent=value?'Reprendre':'Pause';b.setAttribute('aria-pressed',String(value));
    if(value){this.program?.pause();this.preview?.pause();this.soundtrack?.mute();}else{if(!this.stillVisuals){this.program?.play().catch(()=>{});this.preview?.play().catch(()=>{});}this.soundtrack?.resume();}
    this.root.querySelectorAll('[data-live-intensity],[data-live-blackout],[data-live-duration],[data-live-saturation],[data-live-hue],[data-live-zoom],[data-live-mirror]').forEach(c=>c.disabled=value);
    this.select.disabled=value||Boolean(this.transition)||this.queuedAt!=null;this.root.querySelector('[data-live-take]').disabled=value||Boolean(this.transition);
    this.status(value?'Show en pause. Ton temps et tes résultats sont conservés.':'Le show reprend.');
  }
  drawSource(video,alpha){
    if(!video||video.readyState<2||alpha<=0)return;
    const width=video.videoWidth||640,height=video.videoHeight||360,zoom=Math.max(1,Number(this.effects.zoom||100)/100),cropW=width/zoom,cropH=height/zoom,sx=(width-cropW)/2,sy=(height-cropH)/2;
    this.ctx.save();
    this.ctx.globalAlpha=this.intensity*alpha;
    this.ctx.filter=`saturate(${Math.max(0,Number(this.effects.saturation)||0)}%) hue-rotate(${Number(this.effects.hue)||0}deg)`;
    if(this.effects.mirror){this.ctx.translate(this.canvas.width,0);this.ctx.scale(-1,1);}
    this.ctx.drawImage(video,sx,sy,cropW,cropH,0,0,this.canvas.width,this.canvas.height);
    this.ctx.restore();
  }
  drawProgram(fraction=0){
    this.ctx.save();this.ctx.globalCompositeOperation='source-over';this.ctx.globalAlpha=1;this.ctx.filter='none';this.ctx.fillStyle='#000';this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);this.ctx.restore();
    if(this.blackout)return;
    this.drawSource(this.program,1-fraction);
    if(fraction>0)this.drawSource(this.preview,fraction);
  }
  tick(delta) {
    if(!this.started || this.completed || this.paused) return;
    // An unloaded source does not earn output or silently advance the exercise.
    if(this.program.readyState<2){this.status('Chargement du programme vidéo…');return;}
    if(this.stillVisuals){this.program.pause();this.preview?.pause();}
    const step=Math.min(delta,this.duration-this.elapsed);
    const cue=this.cues[Math.min(3,Math.floor(this.elapsed/(this.duration/4)))];
    const level=this.blackout?0:this.intensity*100;
    const distance=Math.max(cue.low-level,0,level-cue.high);
    // Split time at cue boundaries so feedback reflects exactly the observed phase.
    for(let cursor=this.elapsed;cursor<this.elapsed+step-1e-8;){const i=Math.min(3,Math.floor(cursor/15)),end=Math.min(this.elapsed+step,(i+1)*15),part=end-cursor;this.phaseStats[i].seconds+=part;if(level>=this.cues[i].low&&level<=this.cues[i].high)this.phaseStats[i].matched+=part;cursor=end;}
    this.integral+=Math.max(0,100-distance*2)*step;
    let transitionStep=step;
    if(this.queuedAt!=null&&this.elapsed+step>=this.queuedAt){transitionStep=Math.max(0,this.elapsed+step-this.queuedAt);this.queuedAt=null;this.take(true);}
    this.elapsed+=step;this.soundtrack?.tick(this);
    const feedback=this.blackout?'Sortie coupée : rétablis l’image pour le public.':level<cue.low?'Monte doucement l’intensité.':level>cue.high?'Baisse l’intensité pour laisser respirer l’image.':'Bonne intensité : tu accompagnes ce passage.';
    if(feedback!==this.feedbackKey){this.feedbackKey=feedback;this.root.querySelector('[data-live-response]').textContent=feedback;this.root.querySelector('[data-live-response]').dataset.match=String(!this.blackout&&distance===0);}
    const fraction=this.transition?Math.min(1,(this.transition.elapsed+=transitionStep)/this.transition.duration):0;
    this.drawProgram(fraction);
    if(fraction>=1){
      const phase=Math.min(3,Math.floor(this.elapsed/15));if(phase===1)this.stageTasks[1]=true;if(phase===2&&this.transition.synced)this.stageTasks[2]=true;this.preparedByPlayer=false;
      const previousIndex=this.currentIndex;if(this.transition.synced)this.syncedTransitions++;
      this.release(this.program);this.program=this.preview;this.preview=null;this.currentIndex=this.previewIndex;this.transition=null;this.transitions++;
      this.program.remove();
      const promoted=this.program;requestAnimationFrame(()=>{if(this.program===promoted&&!this.paused&&!this.stillVisuals)promoted.play().catch(()=>this.status('Clique sur un contrôle pour reprendre la vidéo.'));});
      this.select.disabled=false;this.root.querySelector('[data-live-take]').disabled=false;
      this.root.querySelector('[data-live-program-name]').textContent=this.clips[this.currentIndex].label;
      this.prepare(previousIndex);this.status('Transition terminée. Le nouveau clip est en programme.');
      if(profile.settings.liveMusic!==false)this.soundtrack?.crowd();
    }
    this.updateCue();
    this.root.querySelector('[data-live-progress]').value=this.elapsed;
    this.root.querySelector('[data-live-time]').textContent=`${String(Math.floor(this.elapsed / 60)).padStart(2,'0')}:${String(Math.floor(this.elapsed % 60)).padStart(2,'0')} / 01:00`;
    if(this.elapsed>=this.duration){
      this.completed=true;this.soundtrack?.mute();this.status('Prestation terminée. Clique sur Voir mon bilan.');
      this.root.querySelectorAll('button,input,select').forEach(control=>control.disabled=true);
    }
  }
  result() {
    return {score:Math.round(this.elapsed?this.integral/this.elapsed:0),completion:Math.min(1,this.elapsed/this.duration),stageTasks:[...this.stageTasks],transitions:this.transitions,syncedTransitions:this.syncedTransitions,effectChanges:this.effectChanges,seconds:Math.round(this.elapsed),phases:this.phaseStats.map((p,i)=>({name:this.cues[i].name,seconds:p.seconds,matched:p.matched}))};
  }
  snapshot() {
    return {...this.result(),preparedByPlayer:this.preparedByPlayer,paused:this.paused,queuedAt:this.queuedAt,elapsed:this.elapsed,integral:this.integral,intensity:this.intensity,blackout:this.blackout,effects:{...this.effects},currentIndex:this.currentIndex,previewIndex:this.previewIndex,transition:this.transition?{...this.transition}:null,programTime:this.program?.currentTime||0,previewTime:this.preview?.currentTime||0};
  }
  restore(saved) {
    this.release(this.program);
    this.currentIndex=Math.max(0,Math.min(this.clips.length-1,Number(saved.currentIndex)||0));
    this.program=this.media(this.currentIndex);
    this.prepare(Math.max(0,Math.min(this.clips.length-1,Number(saved.previewIndex)||0)));
    this.preparedByPlayer=Boolean(saved.preparedByPlayer);this.stageTasks=[0,1,2,3].map(i=>Boolean(saved.stageTasks?.[i]));
    this.syncedTransitions=Math.max(0,Number(saved.syncedTransitions)||0);this.queuedAt=Number.isFinite(saved.queuedAt)&&saved.queuedAt>=Number(saved.elapsed)?saved.queuedAt:null;
    this.elapsed=Math.max(0,Math.min(this.duration,Number(saved.elapsed)||0));this.integral=Math.max(0,Number(saved.integral)||0);
    if(Array.isArray(saved.phases))this.phaseStats=this.phaseStats.map((p,i)=>{const v=saved.phases[i];const seconds=clamp(Number(v?.seconds)||0,0,15);return {seconds,matched:clamp(Number(v?.matched)||0,0,seconds)};});
    this.transitions=Math.max(0,Number(saved.transitions)||0);this.effectChanges=Math.max(0,Number(saved.effectChanges)||0);this.intensity=Math.max(0,Math.min(1,Number(saved.intensity)||0));this.blackout=Boolean(saved.blackout);
    if(saved.effects&&typeof saved.effects==='object')this.effects={...this.effects,...saved.effects};
    this.completed=this.elapsed>=this.duration;this.transition=saved.transition?{...saved.transition}:null;
    this.root.querySelector('[data-live-intensity]').value=this.intensity*100;
    this.root.querySelector('[data-live-level]').textContent=`${Math.round(this.intensity*100)} %`;
    this.root.querySelector('[data-live-blackout]').setAttribute('aria-pressed',String(this.blackout));
    this.root.querySelector('[data-live-blackout]').textContent=this.blackout?'Rétablir la sortie':'Blackout';
    const effectBindings=[['[data-live-saturation]','[data-live-saturation-value]','saturation',' %'],['[data-live-hue]','[data-live-hue-value]','hue','°'],['[data-live-zoom]','[data-live-zoom-value]','zoom',' %']];
    for(const [inputSel,outSel,key,suffix] of effectBindings){const input=this.root.querySelector(inputSel);input.value=this.effects[key];this.root.querySelector(outSel).textContent=`${this.effects[key]}${suffix}`;}
    this.root.querySelector('[data-live-mirror]').setAttribute('aria-pressed',String(Boolean(this.effects.mirror)));
    this.root.querySelector('[data-live-program-name]').textContent=this.clips[this.currentIndex].label;
    this.root.querySelector('[data-live-progress]').value=this.elapsed;
    const seek=(video,time)=>{const apply=()=>{if(Number.isFinite(video.duration))video.currentTime=Math.min(time,Math.max(0,video.duration-.05));};if(video.readyState)apply();else video.addEventListener('loadedmetadata',apply,{once:true});};
    seek(this.program,Number(saved.programTime)||0);seek(this.preview,Number(saved.previewTime)||0);
    this.select.disabled=Boolean(this.transition)||this.queuedAt!=null||this.completed;this.root.querySelector('[data-live-take]').disabled=Boolean(this.transition)||this.completed;
    if(this.completed)this.root.querySelectorAll('button,input,select').forEach(c=>c.disabled=true);
    this.root.querySelector('[data-live-time]').textContent=`${String(Math.floor(this.elapsed/60)).padStart(2,'0')}:${String(Math.floor(this.elapsed%60)).padStart(2,'0')} / 01:00`;
    // A completed exercise no longer ticks: explicitly redraw its restored output.
    if(this.completed){const draw=()=>this.drawProgram(0);this.program.addEventListener('loadeddata',draw,{once:true});this.program.addEventListener('seeked',draw,{once:true});draw();}
    if(saved.paused&&!this.completed)this.setPaused(true);
    this.updateCue();this.status(this.completed?'Prestation terminée. Ouvre ton bilan.':this.paused?'Show repris en pause. Clique sur Reprendre.':'Prestation reprise au dernier point sauvegardé.');
  }
  dispose() {document.body.classList.remove('live-stage-focus');document.removeEventListener('visibilitychange',this.onVisibility);this.soundtrack?.dispose();this.release(this.program);this.release(this.preview);this.started=false;}
}
