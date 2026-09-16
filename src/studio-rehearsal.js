/* The home rehearsal runs the same mixer as paid gigs, without a career payout. */
window.StudioRehearsal=(()=>{
 let host=null,show=null,frame=0,last=0,lastSaved=0,phase=0,musicWasPlaying=false,drill=null,drillFinished=false;
 function persist(){if(!show)return;profile.settings.rehearsal={gigId:host.querySelector('[data-rehearsal-gig]').value,guided:host.querySelector('[data-rehearsal-guided]').checked,drill,run:show.snapshot()};saveSlots();}
 function close(){persist();cancelAnimationFrame(frame);show?.dispose();show=null;host?.close();host?.remove();host=null;if(musicWasPlaying)musicAudio.play().catch(()=>{});document.querySelector('#academy-launch')?.focus();}
 function start(saved=null,passage=null){
  drill=Number.isInteger(passage)&&passage>=0&&passage<4?passage:null;drillFinished=false;
  show?.dispose();const root=host.querySelector('[data-rehearsal-desk]'),gig=profile.gigs.find(g=>g.id===host.querySelector('[data-rehearsal-gig]').value)||profile.gigs[0];
  root.hidden=false;
  show=new VJLiveShow(root,videoClips,{gig,practice:true,saved});show.start(0);if(saved)show.restore(saved);else if(drill!==null){show.elapsed=drill*15;show.updateCue();}show.setPaused(true);
  const current=show,draw=()=>{if(show===current)current.drawProgram(current.transition?Math.min(1,current.transition.elapsed/current.transition.duration):0);};current.program.addEventListener('loadeddata',draw,{once:true});draw();
  root.dataset.stage='false';document.body.classList.remove('live-stage-focus');root.querySelector('[data-live-view]').hidden=true;
  phase=Math.min(3,Math.floor(show.elapsed/15));host.querySelector('[data-rehearsal-result]').hidden=true;host.querySelector('[data-rehearsal-go]').hidden=show.completed;
  host.querySelector('[data-rehearsal-go]').textContent=saved?'Reprendre ce passage':'Commencer le premier passage';
  host.querySelectorAll('[data-rehearsal-passage]').forEach((b,i)=>{b.textContent=`${i+1}. ${show.cues[i].name} · 15 s`;b.setAttribute('aria-pressed',String(i===drill));});
  host.querySelector('[data-rehearsal-whole]').setAttribute('aria-pressed',String(drill===null));
  host.querySelector('[data-rehearsal-mode]').textContent=drill===null?'Set complet · 60 secondes':`Pratique ciblée · ${show.cues[drill].name} · 15 secondes`;
  last=performance.now();lastSaved=show.elapsed;persist();
 }
 function report(){
  const panel=host.querySelector('[data-rehearsal-result]');if(!panel.hidden)return;
  const indices=drill===null?[0,1,2,3]:[drill],gigId=host.querySelector('[data-rehearsal-gig]').value;
  profile.settings.rehearsalBests ||= {};
  const rows=indices.map(i=>{const p=show.phaseStats[i],percent=Math.round(p.seconds?p.matched/p.seconds*100:0),key=`${gigId}:${i}`,old=profile.settings.rehearsalBests[key]||{};
   profile.settings.rehearsalBests[key]={percent:Math.max(old.percent||0,percent),gesture:Boolean(old.gesture||show.stageTasks[i])};
   const advice=!show.stageTasks[i]?(i===1?'Prépare une autre image et termine un fondu.':i===2?'Termine un fondu lancé sur le temps 1.':'Reste cinq secondes dans la cible.'):percent<70?'Geste réussi. Travaille maintenant la régularité de l’intensité.':'Passage maîtrisé. Essaie un autre contrat ou un autre choix de clips.';
   return `<article><strong>${show.stageTasks[i]?'✓':'○'} ${escapeHtml(show.cues[i].name)}</strong><span>${percent} % du temps dans la cible · record ${profile.settings.rehearsalBests[key].percent} %</span><p>${advice}</p><button data-rehearsal-retry="${i}">Retravailler ces 15 secondes</button></article>`;});
  panel.hidden=false;panel.innerHTML=`<h2>${drill===null?'Bilan de ta répétition':'Bilan du passage'}</h2><p>${indices.filter(i=>show.stageTasks[i]).length}/${indices.length} geste(s) réussi(s). Choisis le passage à retravailler.</p><div class="rehearsal-report">${rows.join('')}</div>`;
  panel.querySelectorAll('[data-rehearsal-retry]').forEach(b=>b.onclick=()=>start(null,Number(b.dataset.rehearsalRetry)));persist();
  if(drill!==null)show.root.hidden=true;
 }
 function tick(now){
  if(!host)return;const dt=Math.min(.25,(now-last)/1000);last=now;
  if(show&&!document.hidden){
   const guided=host.querySelector('[data-rehearsal-guided]').checked;
   const boundary=(drill??phase)+1;const end=boundary*15;
   if(!drillFinished)show.tick(guided||drill!==null?Math.min(dt,Math.max(0,end-show.elapsed)):dt);
   const next=Math.min(3,Math.floor(show.elapsed/15));
   if(drill!==null&&show.elapsed>=end&&!drillFinished){drillFinished=true;show.setPaused(true);report();}
   else if(guided&&next>phase&&!show.completed&&drill===null){phase=next;show.setPaused(true);persist();}
   else if(!guided)phase=next;
   const go=host.querySelector('[data-rehearsal-go]');go.hidden=!show.paused||show.completed||drillFinished;go.textContent=`Jouer le passage ${phase+1} · ${show.cues[phase].name}`;
   if(show.completed)report();
   else if(show.elapsed-lastSaved>=5){lastSaved=show.elapsed;persist();}
  }
  frame=requestAnimationFrame(tick);
 }
 function open(){
  if(host)return;if(!profile.created){notify('Crée ton VJ pour ouvrir ton poste de pratique.');return;}
  if(profile.activeRun){notify('Termine ton contrat en cours avant d’ouvrir une répétition.');return;}
  musicWasPlaying=!musicAudio.paused;musicAudio.pause();host=document.createElement('dialog');host.id='studio-rehearsal';
  host.innerHTML='<header><div><small>TON POSTE VJ · PRATIQUE GRATUITE</small><h1>La même régie qu’en gig</h1><p>Prépare en préview, diffuse en programme et suis les quatre actions. Le mode guidé attend ton accord entre les passages.</p></div><button data-rehearsal-close>Retour au local</button></header><div class="rehearsal-options"><label>Répéter le live de ce contrat<select data-rehearsal-gig></select></label><label><input type="checkbox" data-rehearsal-guided checked> Mode guidé · pause entre les passages</label><button data-rehearsal-restart>Recommencer</button><button data-rehearsal-go>Commencer</button></div><p data-rehearsal-result role="status" hidden></p><section class="live-show-desk" data-rehearsal-desk></section>';
  const passages=document.createElement('nav');passages.className='rehearsal-passages';passages.setAttribute('aria-label','Choisir un exercice');passages.innerHTML='<button data-rehearsal-whole>Set complet · 60 s</button>'+[0,1,2,3].map(i=>`<button data-rehearsal-passage="${i}"></button>`).join('')+'<span data-rehearsal-mode></span>';host.querySelector('.rehearsal-options').after(passages);
  const oldResult=host.querySelector('[data-rehearsal-result]'),result=document.createElement('section');result.dataset.rehearsalResult='';result.setAttribute('aria-label','Bilan de la répétition');result.hidden=true;oldResult.replaceWith(result);
  const select=host.querySelector('[data-rehearsal-gig]');profile.gigs.forEach(g=>{const o=document.createElement('option');o.value=g.id;o.textContent=`${g.number}. ${g.title} · ${ShowProfiles.get(g).name}`;select.append(o);});
  const saved=profile.settings.rehearsal;select.value=profile.gigs.some(g=>g.id===saved?.gigId)?saved.gigId:(profile.gigs.find(g=>['accepted','offered'].includes(g.status))||profile.gigs[0]).id;
  host.querySelector('[data-rehearsal-guided]').checked=saved?.guided!==false;document.body.append(host);host.showModal();
  host.querySelector('[data-rehearsal-close]').onclick=close;host.addEventListener('cancel',e=>{e.preventDefault();close();});
  select.onchange=()=>start();host.querySelector('[data-rehearsal-restart]').onclick=()=>start(null,drill);host.querySelector('[data-rehearsal-go]').onclick=()=>{show.setPaused(false);persist();};host.querySelector('[data-rehearsal-guided]').onchange=persist;
  passages.querySelectorAll('[data-rehearsal-passage]').forEach(b=>b.onclick=()=>start(null,Number(b.dataset.rehearsalPassage)));passages.querySelector('[data-rehearsal-whole]').onclick=()=>start();
  start(saved?.run||null,saved?.drill);frame=requestAnimationFrame(tick);
 }
 const launch=document.querySelector('#academy-launch');if(launch){launch.textContent='Mon poste VJ · pratiquer comme en gig';launch.addEventListener('click',event=>{event.stopImmediatePropagation();open();},true);}
 const icons=document.querySelector('.desktop-icon')?.parentElement;if(icons){const icon=document.createElement('button');icon.className='desktop-icon';icon.type='button';icon.dataset.icon='VJ';icon.dataset.rehearsalLaunch='';icon.textContent='Régie VJ';icon.onclick=open;icons.prepend(icon);}
 return{open,close,get isOpen(){return Boolean(host)},get show(){return show}};
})();
