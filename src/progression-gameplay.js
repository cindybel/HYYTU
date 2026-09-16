/* Phase 12 · Gameplay progression
   Purchased hardware changes actual live capabilities instead of only adding score bonuses. */
window.ProgressionGameplay=(()=>{
  const rank=(type,slug)=>Math.max(-1,(GEAR_PROGRESSIONS[type]||[]).indexOf(slug));
  function selected(type){try{return window.GearCapabilities?.selected?.(type)||profile.gear?.[type]||'none';}catch{return profile.gear?.[type]||'none';}}
  function capabilities(){
    const computer=selected('computer'),gpu=selected('gpu'),consoleSlug=selected('console'),router=selected('router');
    const computerRank=rank('computer',computer),gpuRank=rank('gpu',gpu),consoleRank=rank('console',consoleSlug),routerRank=rank('router',router);
    const maxLayers=[1,2,3,4,4][Math.max(0,computerRank)]||1;
    const gpuLayers=gpuRank<0?maxLayers:Math.min(4,2+gpuRank);
    return {computer,gpu,console:consoleSlug,router,maxLayers:Math.min(maxLayers,gpuLayers),macroLevel:consoleRank+1,maxOutputs:routerRank<0?1:[2,3,4][routerRank]||1,resolution:window.GearCapabilities?.resolution?.(computer)||640};
  }
  function apply(show){
    const cap=capabilities(),core=show.__core3;if(!core)return;
    for(const layer of core.layers){if(layer.index+1>cap.maxLayers){if(layer.video)show.release(layer.video);layer.video=null;layer.opacity=0;}}
    const panel=show.root.querySelector('.core3-panel');if(panel){
      panel.querySelector('summary').textContent=`Régie avancée · matériel : ${Math.min(cap.maxLayers,1+core.layers.length)}/4 couches utilisables`;
      [...panel.querySelectorAll('.core3-layer')].forEach((row,i)=>{const layerNumber=i+2;if(layerNumber>cap.maxLayers){row.classList.add('core3-lock');row.querySelectorAll('select,input').forEach(el=>el.disabled=true);row.title=`Ton ordinateur actuel limite la régie à ${cap.maxLayers} couche${cap.maxLayers>1?'s':''}.`;}});
      const macroButtons=[...panel.querySelectorAll('[data-core3-macro]')];macroButtons.forEach((button,i)=>{const required=i===0?1:2;button.disabled=cap.macroLevel<required;button.title=button.disabled?(required===1?'Un contrôleur MIDI débloque cette macro.':'Un VJ Deck débloque cette macro.'):'Contrôle matériel disponible.';});
      const bypass=panel.querySelector('[data-core3-bypass]');if(bypass){bypass.disabled=cap.macroLevel<3;bypass.title=bypass.disabled?'Show Control Pro requis pour un bypass master instantané.':'Bypass master matériel.';}
      const recorder=panel.querySelector('[data-core3-rec]');if(recorder){recorder.disabled=cap.macroLevel<1;recorder.title=recorder.disabled?'Un contrôleur MIDI ou supérieur débloque l’enregistrement des réglages.':'';}
      let card=panel.querySelector('.progression-cap-card');if(!card){card=document.createElement('div');card.className='progression-cap-card';panel.querySelector('.core3-inner')?.prepend(card);}if(card)card.innerHTML=`<strong>CAPACITÉS DU SETUP</strong><span>${cap.resolution}px programme · ${cap.maxLayers} couche${cap.maxLayers>1?'s':''} · ${cap.maxOutputs} sortie${cap.maxOutputs>1?'s':''} · macros ${cap.macroLevel?`niveau ${cap.macroLevel}`:'verrouillées'}</span>`;
    }
  }
  function injectStyles(){if(document.querySelector('#progression-gameplay-style'))return;const s=document.createElement('style');s.id='progression-gameplay-style';s.textContent=`.progression-cap-card{display:flex;justify-content:space-between;gap:10px;margin-bottom:7px;padding:7px 8px;border:1px solid #294753;border-radius:5px;background:#142a35;font-size:9px;color:#9fb5be}.progression-cap-card strong{color:#e4bf75}.core3-layer.core3-lock{opacity:.46}`;document.head.append(s);}
  function patch(){injectStyles();if(typeof VJLiveShow==='undefined'||VJLiveShow.prototype.__progressionGameplayPatched)return;const p=VJLiveShow.prototype;p.__progressionGameplayPatched=true;const start=p.start;p.start=function(...args){const value=start.apply(this,args);apply(this);return value;};}
  patch();return {capabilities,apply};
})();
