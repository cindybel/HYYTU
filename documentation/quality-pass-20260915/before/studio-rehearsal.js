/* The home rehearsal runs the same mixer as paid gigs, without a career payout. */
window.StudioRehearsal=(()=>{
 let host=null,show=null,frame=0,last=0,lastSaved=0,phase=0,musicWasPlaying=false;
 function persist(){if(!show)return;profile.settings.rehearsal={gigId:host.querySelector('[data-rehearsal-gig]').value,guided:host.querySelector('[data-rehearsal-guided]').checked,run:show.snapshot()};saveSlots();}
 function close(){persist();cancelAnimationFrame(frame);show?.dispose();show=null;host?.close();host?.remove();host=null;if(musicWasPlaying)musicAudio.play().catch(()=>{});document.querySelector('#academy-launch')?.focus();}
 function start(saved=null){
  show?.dispose();const root=host.querySelector('[data-rehearsal-desk]'),gig=profile.gigs.find(g=>g.id===host.querySelector('[data-rehearsal-gig]').value)||profile.gigs[0];
  show=new VJLiveShow(root,videoClips,{gig,practice:true,saved});show.start(0);if(saved)show.restore(saved);show.setPaused(true);
  const current=show,draw=()=>{if(show===current)current.drawProgram(current.transition?Math.min(1,current.transition.elapsed/current.transition.duration):0);};current.program.addEventListener('loadeddata',draw,{once:true});draw();
  root.dataset.stage='false';document.body.classList.remove('live-stage-focus');root.querySelector('[data-live-view]').hidden=true;
  phase=Math.min(3,Math.floor(show.elapsed/15));host.querySelector('[data-rehearsal-result]').hidden=true;host.querySelector('[data-rehearsal-go]').hidden=show.completed;
  host.querySelector('[data-rehearsal-go]').textContent=saved?'Reprendre ce passage':'Commencer le premier passage';last=performance.now();lastSaved=show.elapsed;persist();
 }
 function tick(now){
  if(!host)return;const dt=Math.min(.25,(now-last)/1000);last=now;
  if(show&&!document.hidden){
   const guided=host.querySelector('[data-rehearsal-guided]').checked;
   const boundary=(phase+1)*15;show.tick(guided?Math.min(dt,Math.max(0,boundary-show.elapsed)):dt);
   const next=Math.min(3,Math.floor(show.elapsed/15));
   if(guided&&next>phase&&!show.completed){phase=next;show.setPaused(true);persist();}
   else if(!guided)phase=next;
   const go=host.querySelector('[data-rehearsal-go]');go.hidden=!show.paused||show.completed;go.textContent=`Jouer le passage ${phase+1} · ${show.cues[phase].name}`;
   if(show.completed){const result=host.querySelector('[data-rehearsal-result]');if(result.hidden){const r=show.result();result.hidden=false;result.textContent=`Répétition terminée : ${r.stageTasks.filter(Boolean).length}/4 défis de scène, intensité ${r.score}/100, ${r.transitions} fondu(s) terminé(s). Clique Recommencer pour travailler les gestes manqués. En gig, le cadrage et les connexions s’ajoutent au bilan.`;persist();}}
   else if(show.elapsed-lastSaved>=5){lastSaved=show.elapsed;persist();}
  }
  frame=requestAnimationFrame(tick);
 }
 function open(){
  if(host)return;if(!profile.created){notify('Crée ton VJ pour ouvrir ton poste de pratique.');return;}
  if(profile.activeRun){notify('Termine ton contrat en cours avant d’ouvrir une répétition.');return;}
  musicWasPlaying=!musicAudio.paused;musicAudio.pause();host=document.createElement('dialog');host.id='studio-rehearsal';
  host.innerHTML='<header><div><small>TON POSTE VJ · PRATIQUE GRATUITE</small><h1>La même régie qu’en gig</h1><p>Prépare en préview, diffuse en programme et suis les quatre actions. Le mode guidé attend ton accord entre les passages.</p></div><button data-rehearsal-close>Retour au local</button></header><div class="rehearsal-options"><label>Répéter le live de ce contrat<select data-rehearsal-gig></select></label><label><input type="checkbox" data-rehearsal-guided checked> Mode guidé · pause entre les passages</label><button data-rehearsal-restart>Recommencer</button><button data-rehearsal-go>Commencer</button></div><p data-rehearsal-result role="status" hidden></p><section class="live-show-desk" data-rehearsal-desk></section>';
  const select=host.querySelector('[data-rehearsal-gig]');profile.gigs.forEach(g=>{const o=document.createElement('option');o.value=g.id;o.textContent=`${g.number}. ${g.title} · ${ShowProfiles.get(g).name}`;select.append(o);});
  const saved=profile.settings.rehearsal;select.value=profile.gigs.some(g=>g.id===saved?.gigId)?saved.gigId:(profile.gigs.find(g=>['accepted','offered'].includes(g.status))||profile.gigs[0]).id;
  host.querySelector('[data-rehearsal-guided]').checked=saved?.guided!==false;document.body.append(host);host.showModal();
  host.querySelector('[data-rehearsal-close]').onclick=close;host.addEventListener('cancel',e=>{e.preventDefault();close();});
  select.onchange=()=>start();host.querySelector('[data-rehearsal-restart]').onclick=()=>start();host.querySelector('[data-rehearsal-go]').onclick=()=>{show.setPaused(false);persist();};host.querySelector('[data-rehearsal-guided]').onchange=persist;
  start(saved?.run||null);frame=requestAnimationFrame(tick);
 }
 const launch=document.querySelector('#academy-launch');if(launch){launch.textContent='Mon poste VJ · pratiquer comme en gig';launch.addEventListener('click',event=>{event.stopImmediatePropagation();open();},true);}
 const icons=document.querySelector('.desktop-icon')?.parentElement;if(icons){const icon=document.createElement('button');icon.className='desktop-icon';icon.type='button';icon.dataset.icon='VJ';icon.dataset.rehearsalLaunch='';icon.textContent='Régie VJ';icon.onclick=open;icons.prepend(icon);}
 return{open,close,get isOpen(){return Boolean(host)},get show(){return show}};
})();
