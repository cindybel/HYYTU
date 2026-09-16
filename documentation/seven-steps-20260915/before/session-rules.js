/* Session rules: observable performance drives career progression. */
window.SessionRules={
 score(baseSkill,gig,run){
  const signal=clamp(Number(run.connectedRatio??1),0,1),completion=clamp(Number(run.live?.completion??0),0,1);
  const technical=clamp(Math.round(baseSkill),0,100),artistic=clamp(Math.round(run.live?.score||0),0,100);
  const professional=run.live?.transitions>0?100:0;
  const score=Math.round(Math.min(technical*.45+artistic*.45+professional*.1,100*signal*completion));
  const penalties=[];if(signal<1)penalties.push('Signal incomplet');if(completion<1)penalties.push('Show incomplet');if(!professional)penalties.push('Aucun fondu terminé');if(technical<80)penalties.push('Cadrage ou installation à améliorer');if(artistic<80)penalties.push('Intensité à adapter aux passages');
  return {score,technical,artistic,professional,clientSatisfaction:score,gearBonus:0,styleBonus:0,levelPenalty:0,bonuses:[...(technical>=85?['Projection cadrée']:[]),...(artistic>=85?['Énergie accompagnée']:[]),...(professional?['Fondu terminé']:[])],penalties,grade:getShowGrade(score,run.elapsed||0),gradeLabel:getShowGradeLabel(score,score),stars:`${getFinalGigQuality(score).stars} étoiles`,observed:true};
 },
 reward(gig){
  if(!liveShow?.completed)return [];
  profile.skillEvidence ||= {};
  const passed={
   cabling:rigs.length>0&&rigs.every(r=>r.cable.connected),
   mapping:aggregateScore.trapeze>=85&&aggregateScore.coverage>=85,
   multiOutput:rigs.length>=2&&rigs.every(r=>r.cable.connected)&&aggregateScore.coverage>=80,
   timePressure:Boolean(gig.timeLimitSeconds)&&liveSetupElapsed/1000<=gig.timeLimitSeconds,
   penTool:getGigMaskRequirement(gig)>0&&aggregateScore.mask>=85
  };
  const gained=[];
  for(const [id,ok] of Object.entries(passed)){
   if(!ok)continue;
   const proofs=profile.skillEvidence[id] ||= [],firstProof=!proofs.includes(gig.id);
   if(firstProof)proofs.push(gig.id);
   if(window.VJProgression){
    const difficulty=window.GigDifficulty?GigDifficulty.tier(gig)+1:Math.max(1,Math.min(3,Number(gig.number)||1));
    const result=firstProof
      ? VJProgression.addXp(id,30+difficulty*6,'gig',`${gig.id}:${id}`)
      : VJProgression.addXp(id,10,'gig-repeat',`${gig.id}:${id}:repeat-${Number(profile.showSessions)||0}`);
    gained.push(`${skillCatalog.find(s=>s.id===id)?.label||id} +${result.gained} XP`);
   }else{
    const earned=proofs.length>=5?3:proofs.length>=3?2:1,old=profile.skills[id]||0;
    if(earned>old){profile.skills[id]=earned;gained.push(`${skillCatalog.find(s=>s.id===id).label} niveau ${earned}`);}
   }
  }
  saveSlots();
  return gained;
 },
 simplifySetup(gig){
  gigSetupContent.querySelector('.production-prep')?.setAttribute('hidden','');
  const details=document.createElement('details');details.className='setup-advanced';const summary=document.createElement('summary');summary.textContent='Adapter le matériel et consulter le brief complet';details.append(summary);while(gigSetupContent.firstChild)details.append(gigSetupContent.firstChild);gigSetupContent.append(details);
  const brief=document.createElement('section');brief.className='session-brief';brief.innerHTML=`<small>TON OBJECTIF</small><h2>${getGigProjectorCount(gig)>1?'Coordonne tes projections':'Crée un show lisible'}</h2><p>${getGigMaskRequirement(gig)>0?'Délimite la forme avec un masque.':'Connecte et cadre la projection.'} Accompagne les passages musicaux et termine un fondu.</p><p>Ton matériel compatible est présélectionné. Vérifie les frais ci-dessous, puis enregistre ta préparation.</p><small>La note dépend de l’installation et du cadrage (45 %), de l’intensité (45 %) et d’un fondu terminé (10 %). Les gestes réellement réussis donnent de l’expérience terrain.</small>`;gigSetupContent.prepend(brief);if(gigSetupStartButton.disabled)details.open=true;
  gigSetupStartButton.textContent='Enregistrer ma préparation';
 }
};
