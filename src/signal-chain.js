/* Phase 8 · Technical signal simulation
   Makes the selected computer, GPU, cabling and output count affect gig reliability. */
window.SignalChain=(()=>{
  const clamp100=value=>Math.max(0,Math.min(100,Math.round(Number(value)||0)));
  const idx=(type,slug)=>Math.max(0,(GEAR_PROGRESSIONS[type]||[]).indexOf(slug));
  function selected(type){
    try{return window.GearCapabilities?.selected?.(type)||profile.gear?.[type]||GEAR_PROGRESSIONS[type]?.[0];}catch{return profile.gear?.[type]||GEAR_PROGRESSIONS[type]?.[0];}
  }
  function snapshot(gig=currentGig){
    const outputs=Math.max(1,Number(typeof getGigProjectorCount==='function'?getGigProjectorCount(gig):gig?.projectorCount)||1);
    const tier=window.GigDifficulty?.tier?.(gig)??Math.min(5,Math.floor((Math.max(1,Number(gig?.number)||1)-1)/5));
    const computer=selected('computer'),gpu=selected('gpu'),cable=selected('cable'),adapter=selected('adapter'),consoleSlug=selected('console'),router=selected('router');
    const computerLevel=idx('computer',computer),gpuLevel=idx('gpu',gpu),cableLevel=idx('cable',cable),adapterLevel=idx('adapter',adapter),consoleLevel=idx('console',consoleSlug),routerLevel=idx('router',router);
    const targetWidth=[1280,1280,1920,1920,2560,3840][tier]||1920;
    const targetFps=tier>=4?60:tier>=2?59.94:30;
    const outputStandard=outputs>=2?'SDI / processeur':'HDMI / DisplayPort';
    let health=100;const warnings=[];
    if(computerLevel<tier-1){health-=16;warnings.push(`Ordinateur limite pour ${targetWidth} px.`);}
    if(gpuLevel<Math.max(0,tier-2)){health-=12;warnings.push('GPU proche de sa limite : risque de frames perdues.');}
    if(outputs>=2&&cableLevel<1){health-=18;warnings.push('Liaison trop courte ou non active pour plusieurs sorties.');}
    if(outputs>=2&&adapterLevel<1){health-=10;warnings.push('Adaptation vidéo peu robuste pour un setup multi-sorties.');}
    if(outputs>=3&&Math.max(consoleLevel,routerLevel)<1){health-=16;warnings.push('Il manque un vrai point de distribution/switching pour trois sorties.');}
    if(tier>=4&&cableLevel<2){health-=10;warnings.push('Un long run fibre/actif est recommandé pour cette salle.');}
    health=clamp100(health);
    const tested=Boolean(gig?.signalTest&&gig.signalTest.day===profile.day&&gig.signalTest.signature===signature({computer,gpu,cable,adapter,consoleSlug,router,outputs,targetWidth,targetFps}));
    return {computer,gpu,cable,adapter,console:consoleSlug,router,outputs,tier,targetWidth,targetFps,outputStandard,health,warnings,tested};
  }
  function signature(data){return [data.computer,data.gpu,data.cable,data.adapter,data.consoleSlug||data.console,data.router,data.outputs,data.targetWidth,data.targetFps].join('|');}
  function test(gig=currentGig){
    if(!gig)return null;const snap=snapshot(gig);gig.signalTest={day:profile.day,signature:signature(snap),health:snap.health,warnings:[...snap.warnings]};saveSlots();return snapshot(gig);
  }
  function markup(gig=currentGig){
    const s=snapshot(gig),state=s.health>=85?'stable':s.health>=65?'warning':'risk';
    return `<section class="signal-chain-panel" data-signal-state="${state}"><div class="signal-chain-head"><div><small>CHAÎNE SIGNAL</small><h3>${s.targetWidth}p · ${s.targetFps} Hz · ${s.outputs} sortie${s.outputs>1?'s':''}</h3></div><strong>${s.health}%</strong></div><div class="signal-chain-flow"><span>Ordinateur<br><b>${escapeHtml(s.computer)}</b></span><i>→</i><span>GPU<br><b>${escapeHtml(s.gpu)}</b></span><i>→</i><span>${escapeHtml(s.outputStandard)}<br><b>${escapeHtml(s.cable)}</b></span><i>→</i><span>Distribution<br><b>${escapeHtml(s.console||s.router||'direct')}</b></span><i>→</i><span>Écran / projo<br><b>${s.outputs} output${s.outputs>1?'s':''}</b></span></div>${s.warnings.length?`<ul>${s.warnings.map(w=>`<li>${escapeHtml(w)}</li>`).join('')}</ul>`:'<p>La chaîne est cohérente pour ce mandat.</p>'}<div class="signal-chain-actions"><button type="button" data-signal-test>${s.tested?'✓ Signal testé aujourd’hui':'Tester le signal'}</button><small>${s.tested?'Le test correspond au matériel actuellement sélectionné.':'Teste après chaque changement de matériel.'}</small></div></section>`;
  }
  function injectStyles(){if(document.querySelector('#signal-chain-style'))return;const style=document.createElement('style');style.id='signal-chain-style';style.textContent=`.signal-chain-panel{margin:12px 0;padding:12px;border:1px solid #405a68;border-radius:8px;background:#0f222d}.signal-chain-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.signal-chain-head small{letter-spacing:.13em;color:#8fe5dd}.signal-chain-head h3{margin:4px 0;font-size:14px}.signal-chain-head>strong{font-size:24px;color:#8fe5dd}.signal-chain-panel[data-signal-state="warning"]{border-color:#a9854c}.signal-chain-panel[data-signal-state="warning"] .signal-chain-head>strong{color:#e4bf75}.signal-chain-panel[data-signal-state="risk"]{border-color:#9f5555}.signal-chain-panel[data-signal-state="risk"] .signal-chain-head>strong{color:#ef8888}.signal-chain-flow{display:grid;grid-template-columns:1fr auto 1fr auto 1fr auto 1fr auto 1fr;align-items:center;gap:5px;margin:10px 0}.signal-chain-flow span{min-width:0;padding:7px;border:1px solid #294652;border-radius:5px;background:#152c38;font-size:9px;text-align:center;color:#9fb5be}.signal-chain-flow b{color:#edf5f5;font-size:9px}.signal-chain-flow i{font-style:normal;color:#6f939f}.signal-chain-panel ul{margin:8px 0;padding-left:18px;color:#efc980;font-size:11px}.signal-chain-panel p{font-size:11px;color:#a9bdc8}.signal-chain-actions{display:flex;align-items:center;gap:9px;flex-wrap:wrap}.signal-chain-actions small{color:#91aab4}@media(max-width:760px){.signal-chain-flow{grid-template-columns:1fr}.signal-chain-flow i{transform:rotate(90deg);text-align:center}}`;document.head.append(style);}
  function attachTest(root,gig){const button=root?.querySelector('[data-signal-test]');if(!button)return;button.onclick=()=>{const after=test(gig);button.textContent='✓ Signal testé aujourd’hui';notify(after.health>=85?'Signal stable. Tu peux préparer le show.':after.health>=65?'Signal utilisable, mais surveille les avertissements.':'Test signal risqué : change du matériel si possible.');const panel=button.closest('.signal-chain-panel');if(panel){const fresh=document.createElement('div');fresh.innerHTML=markup(gig);panel.replaceWith(fresh.firstElementChild);attachTest(root,gig);}};}
  function patch(){
    injectStyles();
    if(window.SessionRules?.simplifySetup&&!window.SessionRules.__signalChainSetup){const original=window.SessionRules.simplifySetup.bind(window.SessionRules);window.SessionRules.simplifySetup=function(gig){const value=original(gig);const host=gigSetupContent.querySelector('.session-brief')||gigSetupContent.firstElementChild;host?.insertAdjacentHTML('afterend',markup(gig));attachTest(gigSetupContent,gig);return value;};window.SessionRules.__signalChainSetup=true;}
    if(window.SessionRules?.score&&!window.SessionRules.__signalChainScore){const original=window.SessionRules.score.bind(window.SessionRules);window.SessionRules.score=function(baseSkill,gig,run){const result=original(baseSkill,gig,run),s=snapshot(gig);let penalty=Math.max(0,Math.round((80-s.health)/4));if(!s.tested&&s.tier>=2)penalty+=3;if(!penalty)return result;result.technical=clamp100(result.technical-penalty*2);result.professional=clamp100(result.professional-penalty);result.score=clamp100(result.score-penalty);result.clientSatisfaction=clamp100(result.clientSatisfaction-penalty);result.penalties=[...(result.penalties||[]),`Chaîne signal : ${s.health}%${s.tested?'':' · non testée'}`];result.grade=getShowGrade(result.score,run.elapsed||0);result.gradeLabel=getShowGradeLabel(result.score,result.clientSatisfaction);return result;};window.SessionRules.__signalChainScore=true;}
  }
  patch();
  return {snapshot,test,markup};
})();
