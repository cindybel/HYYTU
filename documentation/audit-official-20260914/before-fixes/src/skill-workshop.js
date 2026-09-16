/* Progression capabilities: levels open concrete tools instead of only raising numbers. */
window.VJCapabilities=(()=>{
 const rules={
  liveSaturation:{label:'Saturation live',skill:null,level:0},
  liveHue:{label:'Correction couleur live',skill:'timePressure',level:1},
  liveZoom:{label:'Zoom / crop live',skill:'mapping',level:1},
  liveMirror:{label:'Transformation miroir',skill:'penTool',level:1},
  independentOutputs:{label:'Sorties indépendantes',skill:'multiOutput',level:1},
  reliableSignal:{label:'Diagnostic de signal avancé',skill:'cabling',level:1},
 };
 function has(id){const r=rules[id];if(!r)return false;if(!r.skill)return true;return ((window.VJProgression?.get(r.skill)?.level??Number(profile?.skills?.[r.skill]))||0)>=r.level;}
 function unlocksFor(skill){return Object.entries(rules).filter(([,r])=>r.skill===skill).map(([id,r])=>({id,...r,unlocked:has(id)}));}
 function label(id){return rules[id]?.label||id;}
 return {rules,has,unlocksFor,label};
})();

/* Apply capability locks to the real live console without replacing its gameplay. */
(()=>{
 if(typeof VJLiveShow==='undefined'||VJLiveShow.prototype.__progressionCapabilities)return;
 const apply=show=>{
  if(!show?.root)return;
  const locks=[
   ['[data-live-hue]','liveHue','Time Pressure niveau 1'],
   ['[data-live-zoom]','liveZoom','Mapping niveau 1'],
   ['[data-live-mirror]','liveMirror','Pen Tool niveau 1'],
  ];
  for(const [selector,capability,requirement] of locks){
   const control=show.root.querySelector(selector);if(!control)continue;
   const unlocked=VJCapabilities.has(capability),parent=control.closest('label')||control;
   control.dataset.capability=capability;
   control.disabled=!unlocked||show.paused||show.completed;
   parent.dataset.locked=String(!unlocked);
   parent.title=unlocked?`${VJCapabilities.label(capability)} débloqué`:`Débloque ${VJCapabilities.label(capability)} : ${requirement}.`;
  }
 };
 for(const method of ['start','restore','setPaused']){
  const original=VJLiveShow.prototype[method];if(typeof original!=='function')continue;
  VJLiveShow.prototype[method]=function(...args){const result=original.apply(this,args);apply(this);return result;};
 }
 VJLiveShow.prototype.__progressionCapabilities=true;
})();

/* Free hands-on skill workshops. Practice grants XP; it no longer gives an entire level in one click. */
window.SkillWorkshop=(()=>{
 let run=0;
 function open(id){
  if(profile.activeRun){notify("Reprends ou termine le contrat avant cet atelier.");return;}
  const skill=skillCatalog.find(s=>s.id===id);if(!skill)return;
  const progress=window.VJProgression?.get(id);const level=progress?.level??(profile.skills[id]||0);const tier=Math.min(level,2);
  const token=++run,host=document.querySelector('#field-school');host.hidden=false;
  host.innerHTML=`<header><div><small>ATELIER GRATUIT · ${window.VJProgression?.progressText(id)||`NIVEAU ${level}`}</small><h1>${escapeHtml(skill.label)}</h1></div><button data-workshop-exit>Retour aux ateliers</button></header><section class="workshop-body"><p data-workshop-task></p><div data-workshop-controls></div><canvas width="800" height="320" data-workshop-canvas aria-label="Zone de pratique"></canvas><button data-workshop-test>Vérifier mon geste</button><p data-workshop-status role="status"></p><small>La pratique gratuite donne de l’XP. Répéter exactement le même exercice dans la même journée rapporte progressivement moins.</small></section>`;
  const q=s=>host.querySelector(s),ctx=q('canvas').getContext('2d');let done=false;
  q('[data-workshop-exit]').onclick=()=>{run++;host.hidden=true;saveSlots();renderDesktop();};q('[data-workshop-exit]').focus();
  function result(ok,text){
   if(done)return;q('[data-workshop-status]').textContent=(ok?'':'Pas encore : ')+text;
   if(ok){
    done=true;let earned;
    if(window.VJProgression)earned=VJProgression.addXp(id,35+tier*8,'workshop',`workshop-${id}-tier-${tier}-day-${Number(profile.day)||1}`);
    else{profile.skills[id]=Math.min(3,level+1);saveSlots();earned={gained:0,level:profile.skills[id]};}
    q('[data-workshop-test]').disabled=true;
    const unlocked=window.VJCapabilities?.unlocksFor(id).filter(item=>item.unlocked).map(item=>item.label)||[];
    q('[data-workshop-status]').textContent=`${text} +${earned.gained||0} XP · ${window.VJProgression?.progressText(id)||`niveau ${earned.level}`}.${unlocked.length?` Capacités actives : ${unlocked.join(', ')}.`:''}`;
   }
  }
  function background(){ctx.fillStyle='#102330';ctx.fillRect(0,0,800,320);ctx.font='18px Arial';ctx.fillStyle='#dbe7ee';}
  if(id==='cabling'){
   const format=['HDMI','DisplayPort','SDI'][tier];q('[data-workshop-task]').textContent=`Relie une sortie ${format} à une entrée du même format. Le signal va de la source vers le projecteur.`;
   q('[data-workshop-controls]').innerHTML=`<label>Ordinateur <select data-from><option value="">Choisir un port</option><option>Entrée ${format}</option><option>Sortie ${format}</option></select></label><label>Projecteur <select data-to><option value="">Choisir un port</option><option>Sortie ${format}</option><option>Entrée ${format}</option><option>Entrée ${format==='HDMI'?'SDI':'HDMI'}</option></select></label>`;
   const draw=()=>{background();ctx.strokeStyle='#8bc9c5';ctx.strokeRect(80,90,190,120);ctx.strokeRect(530,90,190,120);ctx.fillText('SOURCE',120,150);ctx.fillText('PROJECTEUR',557,150);if(q('[data-from]').value&&q('[data-to]').value){ctx.beginPath();ctx.moveTo(270,150);ctx.lineTo(530,150);ctx.stroke();}};host.querySelectorAll('select').forEach(e=>e.onchange=draw);draw();q('[data-workshop-test]').onclick=()=>result(q('[data-from]').value===`Sortie ${format}`&&q('[data-to]').value===`Entrée ${format}`,'Le signal part de la sortie source et arrive dans une entrée compatible.');
  }else if(id==='mapping'){
   const targetX=[130,210,170][tier],targetWidth=[410,340,460][tier];q('[data-workshop-task]').textContent='Cadre le rectangle bleu dans la cible dorée. Corrige la position, la largeur et le trapèze.';
   q('[data-workshop-controls]').innerHTML='<label>Position <input data-map-x type="range" min="50" max="300" value="80"></label><label>Largeur <input data-map-w type="range" min="250" max="500" value="300"></label><label>Trapèze <input data-map-skew type="range" min="-70" max="70" value="40"></label>';
   const draw=()=>{background();const x=+q('[data-map-x]').value,w=+q('[data-map-w]').value,k=+q('[data-map-skew]').value;ctx.strokeStyle='#e5c082';ctx.lineWidth=3;ctx.strokeRect(targetX,65,targetWidth,190);ctx.fillStyle='#5ec6c580';ctx.beginPath();ctx.moveTo(x+k,65);ctx.lineTo(x+w-k,65);ctx.lineTo(x+w,255);ctx.lineTo(x,255);ctx.closePath();ctx.fill();};host.querySelectorAll('input').forEach(e=>e.oninput=draw);draw();q('[data-workshop-test]').onclick=()=>{const tolerance=12-tier*3;result(Math.abs(+q('[data-map-x]').value-targetX)<=tolerance&&Math.abs(+q('[data-map-w]').value-targetWidth)<=tolerance&&Math.abs(+q('[data-map-skew]').value)<=tolerance,'Aligne les bords bleus avec les quatre bords de la cible.');};
  }else if(id==='penTool'){
   const points=tier===0?[[200,70],[600,70],[600,250],[200,250]]:tier===1?[[210,65],[600,95],[555,255],[170,225]]:[[260,55],[550,55],[650,160],[550,265],[260,265],[155,160]];let placed=[];
   q('[data-workshop-task]').textContent='Trace le contour : clique les points numérotés dans l’ordre, puis vérifie.';q('[data-workshop-controls]').innerHTML='<button data-reset-outline>Recommencer le contour</button>';
   const draw=()=>{background();ctx.strokeStyle='#e5c082';ctx.lineWidth=2;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.stroke();points.forEach(([x,y],i)=>{ctx.fillStyle='#f2d2a4';ctx.beginPath();ctx.arc(x,y,7,0,Math.PI*2);ctx.fill();ctx.fillText(String(i+1),x+12,y);});if(placed.length){ctx.strokeStyle='#60d9cc';ctx.lineWidth=4;ctx.beginPath();placed.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));if(placed.length===points.length)ctx.closePath();ctx.stroke();}};
   q('canvas').onclick=e=>{if(done||placed.length>=points.length)return;const r=e.currentTarget.getBoundingClientRect();placed.push([(e.clientX-r.left)*800/r.width,(e.clientY-r.top)*320/r.height]);draw();};q('[data-reset-outline]').onclick=()=>{if(done)return;placed=[];draw();};draw();q('[data-workshop-test]').onclick=()=>result(placed.length===points.length&&placed.every(([x,y],i)=>Math.hypot(x-points[i][0],y-points[i][1])<20-tier*3),'Chaque sommet doit suivre le bord de la surface, dans le bon ordre.');
  }else if(id==='multiOutput'){
   const count=tier===0?2:3,routes=tier===2?['B','C','A']:['A','B','C'];q('[data-workshop-task]').textContent=`Route ${count} compositions différentes vers ${count} écrans. Un splitter duplique une image ; ici les sorties sont indépendantes.`;
   q('[data-workshop-controls]').innerHTML=Array.from({length:count},(_,i)=>`<label>Écran ${i+1} · attend ${routes[i]}<select data-route><option value="">Aucune source</option>${['A','B','C'].map(c=>`<option>${c}</option>`).join('')}</select></label>`).join('');
   const draw=()=>{background();host.querySelectorAll('[data-route]').forEach((e,i)=>{ctx.fillStyle=e.value==='A'?'#46bfb4':e.value==='B'?'#a482d8':e.value==='C'?'#d4a56e':'#213947';ctx.fillRect(45+i*250,65,210,190);ctx.fillStyle='#fff';ctx.fillText(e.value||'Pas de signal',65+i*250,160);});};host.querySelectorAll('select').forEach(e=>e.onchange=draw);draw();q('[data-workshop-test]').onclick=()=>result([...host.querySelectorAll('[data-route]')].every((e,i)=>e.value===routes[i]),'Chaque écran doit recevoir sa composition, sans duplication involontaire.');
  }else{
   const duration=12+tier*4;let started=0,last=0,matched=0,elapsed=0;q('[data-workshop-task]').textContent=`Suis les deux passages pendant ${duration} secondes. Prépare-toi à baisser l’intensité au break.`;q('[data-workshop-controls]').innerHTML='<label>Intensité <input data-pressure-level type="range" min="0" max="100" value="50"></label>';q('[data-workshop-test]').textContent='Commencer l’exercice';
   const frame=now=>{if(token!==run||host.hidden||done)return;const dt=Math.min(.1,(now-last)/1000);last=now;if(!document.hidden){elapsed+=dt;const target=elapsed<duration/2?65:25,levelValue=+q('[data-pressure-level]').value;if(Math.abs(levelValue-target)<=10-tier*2)matched+=dt;background();ctx.fillText(elapsed<duration/2?'MONTÉE · vise 65 %':'BREAK · vise 25 %',180,120);ctx.fillText(`${Math.ceil(Math.max(0,duration-elapsed))} secondes`,180,180);ctx.fillStyle='#61cfc5';ctx.fillRect(180,215,levelValue*4,20);}if(elapsed>=duration){const ok=matched/elapsed>=.75;result(ok,ok?'Tu as suivi les changements sans interrompre le show.':'Observe la consigne et adapte le niveau ; tu peux réessayer.');if(!ok){started=0;q('[data-workshop-test]').disabled=false;}}else requestAnimationFrame(frame);};
   q('[data-workshop-test]').onclick=()=>{if(started)return;started=1;matched=0;elapsed=0;last=performance.now();q('[data-workshop-test]').disabled=true;requestAnimationFrame(frame);};background();ctx.fillText('Entraînement sans frais et sans pénalité',150,160);
  }
 }
 return {open};
})();

/* VJ School: the Skills app exposes practice, school and field experience. */
(()=>{
  function courseCost(skill,level){const costs=skill.costs||[];return Number(costs[Math.min(level,costs.length-1)]||Math.max(120,180+level*220));}
  function courseLabel(level){return level<=0?'Initiation':level===1?'Intermédiaire':level===2?'Avancé':'Perfectionnement';}
  function unlockText(skillId,level){
    const entries=window.VJCapabilities?.unlocksFor(skillId)||[];
    if(!entries.length)return 'La maîtrise améliore surtout l’accès aux contrats et au matériel spécialisé.';
    const next=entries.find(entry=>!entry.unlocked);
    if(next)return `Prochain déblocage concret : ${next.label} au niveau ${next.level}.`;
    return `Capacité débloquée : ${entries.map(entry=>entry.label).join(', ')}.`;
  }

  window.renderSkills=function renderSkills(){
    const cards=skillCatalog.map(skill=>{
      const p=window.VJProgression?.get(skill.id)||{level:Number(profile.skills?.[skill.id])||0,intoLevel:0,needed:100,maxLevel:3};
      const mastered=p.level>=p.maxLevel,percent=mastered?100:Math.round((p.intoLevel/Math.max(1,p.needed))*100),cost=courseCost(skill,p.level);
      return `<article class="shop-card skill-career-card"><div class="shop-card-body"><small>COMPÉTENCE VJ</small><h2>${escapeHtml(skill.label)}</h2><p>${escapeHtml(skill.description)}</p><div class="day-energy-bar"><span>${escapeHtml(window.VJProgression?.progressText(skill.id)||`Niveau ${p.level}`)}</span><strong>${percent}%</strong><i><b style="width:${percent}%"></b></i></div><p class="skill-unlock-note">${escapeHtml(unlockText(skill.id,p.level))}</p><div class="skill-paths"><button data-workshop="${skill.id}" ${mastered?'disabled':''}>${mastered?'Maîtrisé':'Pratiquer gratuitement'}</button><button class="primary-action" data-course="${skill.id}" data-course-cost="${cost}" ${mastered?'disabled':''}>${mastered?'Formation terminée':`${courseLabel(p.level)} · ${cost} $`}</button></div><small>Pratique : XP modérée. École : progression plus rapide. Les gigs donnent l’expérience terrain la plus importante.</small></div></article>`;
    }).join('');
    appWindow.innerHTML=`<div class="app-heading"><div><h1>VJ School & Skills</h1><p>Apprends, pratique, puis prouve tes compétences sur le terrain. Les niveaux ouvrent maintenant des capacités visibles dans la régie, en plus des contrats et du matériel.</p></div></div><div class="shop-grid">${cards}</div>`;
    appWindow.querySelectorAll('[data-workshop]').forEach(button=>button.onclick=()=>SkillWorkshop.open(button.dataset.workshop));
    appWindow.querySelectorAll('[data-course]').forEach(button=>button.onclick=()=>{
      const id=button.dataset.course,cost=Number(button.dataset.courseCost)||0,skill=skillCatalog.find(s=>s.id===id);if(!skill)return;
      if(profile.money<cost){notify(`Il te manque ${cost-profile.money} $ pour cette formation.`);return;}
      if(typeof spendEnergy==='function'&&!spendEnergy('study'))return;
      profile.money-=cost;
      if(typeof recordTransaction==='function')recordTransaction('Formation VJ',-cost,skill.label);
      const tier=(window.VJProgression?.get(id)?.level||0)+1,earned=window.VJProgression?.courseXp(id,tier);
      if(typeof recordDayActivity==='function')recordDayActivity('study',`Formation ${skill.label}`);
      const unlocked=window.VJCapabilities?.unlocksFor(id).filter(item=>item.unlocked).map(item=>item.label)||[];
      notify(`${skill.label} : formation terminée, +${earned?.gained||0} XP.${unlocked.length?` Capacités actives : ${unlocked.join(', ')}.`:''}`);
      saveSlots();renderSkills();renderDesktop();
    });
  };
  window.addEventListener('vj-progression',()=>{if(typeof currentApp!=='undefined'&&currentApp==='skills')window.renderSkills();});
})();
