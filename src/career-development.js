/* Career features derive from saved contracts and selected equipment. */
window.ShowProfiles=(()=>{
 const sets={
  learning:{name:'Première scène',bpm:120,ranges:[[25,45],[50,70],[75,95],[15,35]],names:['WARM-UP','MONTÉE','PEAK','BREAK']},
  bar:{name:'Bar intimiste',bpm:96,ranges:[[20,40],[35,55],[50,70],[20,40]],names:['ACCUEIL','GROOVE','REFRAIN','SORTIE']},
  club:{name:'Club électronique',bpm:128,ranges:[[35,55],[60,80],[80,100],[15,30]],names:['OUVERTURE','MONTÉE','DROP','BREAK']},
  festival:{name:'Festival',bpm:140,ranges:[[40,60],[65,85],[85,100],[30,50]],names:['ENTRÉE','MONTÉE','GRAND FINAL','SALUT']},
  corporate:{name:'Événement client',bpm:104,ranges:[[15,30],[25,45],[45,65],[15,30]],names:['ACCUEIL','PRÉSENTATION','RÉVÉLATION','CLÔTURE']},
 };
 function get(gig){let id=(Number(gig?.number)||1)===1?'learning':gig?.clientType==='festival'||/festival/i.test(gig?.venue||'')?'festival':gig?.clientType==='corpo'?'corporate':/techno|house|trance|electro/i.test(gig?.style||'')?'club':'bar';return {id,...sets[id]};}
 function cues(gig){const p=get(gig);return p.ranges.map(([low,high],i)=>({name:p.names[i],low,high,text:`${p.name} · ${p.names[i].toLowerCase()} : intensité ${low}–${high} %.`}));}
 function brief(gig){const p=get(gig);return `${p.name} · ${p.bpm} BPM · ${p.ranges.map(([a,b],i)=>`${p.names[i]} ${a}–${b} %`).join(' → ')}`;}
 return {get,cues,brief};
})();
window.GearCapabilities=(()=>{
 function selected(type,loadout=activeGigLoadout){const choice=loadout?.selected?.[type];return choice?.slug||profile.gear?.[type]||GEAR_PROGRESSIONS[type][0];}
 function resolution(slug){const i=Math.max(0,GEAR_PROGRESSIONS.computer.indexOf(slug));return [640,960,1280,1600,1920][i]||640;}
 function brightness(slug){const i=Math.max(0,GEAR_PROGRESSIONS.projector.indexOf(slug));return [.72,.8,.87,.92,.97,1][i]||.72;}
 function describe(item){if(item.type==='computer'){const width=resolution(item.id.replace('computer-',''));return `Programme live : ${width} × ${width*9/16} pixels. Une sortie plus détaillée quand cet ordinateur est sélectionné.`;}if(item.type==='projector')return `Éclat de projection : ${Math.round(brightness(item.id.replace('projector-',''))*100)} %. Améliore la luminosité affichée ; le cadrage reste ton travail.`;return '';}
 return {selected,resolution,brightness,describe};
})();
window.ClientRelations=(()=>{
 const key=g=>`venue:${g.venue||g.id}`;
 function records(){profile.clientRelations ||= {};return profile.clientRelations;}
 function get(g){return records()[key(g)]||null;}
 function offerBonus(g){const r=get(g);if(!r||r.trust<2){if(g.loyaltyBaseBudget!=null){g.budget=g.contractBudget=g.loyaltyBaseBudget;g.loyaltyBonus=0;}return 0;}const base=g.loyaltyBaseBudget??g.contractBudget??Math.max(80,Math.round((g.baseBudget||g.budget)*getClientProfile(g).budgetMultiplier));g.loyaltyBaseBudget=base;const bonus=Math.round(base*.1);g.budget=base+bonus;g.contractBudget=g.budget;g.loyaltyBonus=bonus;return bonus;}
 function complete(g,result,live){
  const all=records(),r=all[key(g)] ||= {trust:0,shows:0,successful:0,events:[],lastFeedback:''};
  const event=`${g.id}:${g.timesCompleted}`;if(r.events.includes(event))return r.lastFeedback;
  r.events.push(event);r.shows++;const success=live.completion>=1&&result.score>=getGigMinimumScore(g);
  r.trust=Math.max(0,Math.min(10,r.trust+(success?2:-1)));if(success)r.successful++;
  r.lastFeedback=success?'Tu as livré le brief. Je te reprends volontiers : +10 % sur une prochaine offre tant que notre confiance reste au moins à 2/10.':`Le brief n’est pas encore rempli. ${result.penalties?.[0]||'Vérifie le cadrage et termine la prestation.'} Tu peux retenter le contrat.`;
  addEmail(g.venue||'Client',success?'On retravaille ensemble ?':'Retour sur ta prestation',r.lastFeedback,{unique:false});
  if(success&&!r.referred){const candidate=profile.gigs.find(next=>next.id!==g.id&&next.status==='open'&&canBookSession(next)&&!getGigDateConflict(next));if(candidate){
    candidate.eventDay=Math.max(profile.day+3,getGigApplicationDay(candidate));candidate.date=`Jour ${candidate.eventDay}`;candidate.status='offered';candidate.referredBy=g.venue||g.title;r.referred=candidate.id;
    addEmail(candidate.venue||'Client',`Recommandation : ${candidate.title}`,`${g.venue||g.title} nous a parlé de ton show. Voici une offre pour ${formatScheduledDay(candidate.eventDay)}. Consulte le brief, puis accepte ou refuse.`,{type:'gig-offer',gigId:candidate.id});
    r.lastFeedback+=` Une recommandation t’attend dans Email : ${candidate.title}.`;
  }}return r.lastFeedback;
 }
 function markup(g){const r=get(g);return r?`<p class="client-memory">${escapeHtml(g.venue||'Client')} · confiance ${r.trust}/10 · ${r.successful}/${r.shows} brief(s) livré(s)${g.loyaltyBonus?` · offre fidélité +${g.loyaltyBonus} $`:''}</p>`:'';}
 return {get,complete,offerBonus,markup};
})();
window.FirstShowCoach=(()=>{
 let host,signature='',elapsed=0;
 function tick(dt){elapsed+=dt;if(elapsed<.15)return;elapsed=0;
  if(!host){host=document.createElement('aside');host.id='first-show-coach';host.setAttribute('aria-label','Guide du premier show');host.innerHTML='<button data-coach-collapse>Réduire le guide</button><div data-coach-content role="status"></div>';document.body.append(host);host.querySelector('button').onclick=()=>{profile.settings.coachCollapsed=!profile.settings.coachCollapsed;saveSlots();signature='';};}
  const active=document.body.classList.contains('screen-gig')&&!liveShow&&!runFinished&&(Number(profile.showSessions)||0)===0;host.hidden=!active;if(!active)return;
  if(!host.isConnected)document.body.append(host);
  const desk=document.querySelector('#live-show-desk');if(liveShow&&desk&&host.parentElement!==desk)desk.querySelector('.live-cue').after(host);else if(!liveShow&&host.parentElement!==document.body)document.body.append(host);
  let title,text,step;
  if(!rigs.every(r=>r.cable.connected)){step=1;title='Branche le signal';text='Clique « Connecter projo ». La mire sera remplacée par ton visuel.';}
  else if(!liveShow&&Math.min(aggregateScore.coverage,aggregateScore.trapeze)<80){step=2;title='Cadre ton image';text='Sélectionne le projecteur. Ajuste sa position avec les flèches et son angle avec W/S et A/D. Vise au moins 80 % en couverture et en trapèze.';}
  else if(!liveShow){step=3;title='La projection est prête';text='Clique « Lancer la prestation ». Tu vas jouer quatre passages musicaux.';}
  else if(liveShow.transitions===0&&liveShow.elapsed>=15){step=5;title='Change de visuel en douceur';text='Ouvre « Régie complète », prépare un autre clip puis clique « Envoyer en fondu ». Ajuste aussi l’intensité indiquée.';}
  else{step=liveShow.transitions?6:4;const cue=liveShow.cues[liveShow.cueIndex||0];title=liveShow.transitions?'Accompagne la fin du show':'Suis le passage musical';text=`${cue.name} : garde l’intensité entre ${cue.low} et ${cue.high} %. Le bilan s’ouvrira à la fin des 60 secondes.`;}
  const collapsed=Boolean(profile.settings.coachCollapsed),value=JSON.stringify([title,text,collapsed]);if(value===signature)return;signature=value;host.dataset.step=step;host.querySelector('button').textContent=collapsed?'Afficher le guide':'Réduire le guide';const content=host.querySelector('[data-coach-content]');content.hidden=collapsed;content.innerHTML=`<strong>${step}/6 · ${title}</strong><p>${text}</p>`;
 }return {tick};
})();
