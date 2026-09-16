/* Final integration · End-of-show flow
   A finished performance must never look frozen. The career result opens automatically. */
window.FinalIntegration=(()=>{
  function scheduleResult(show){
    if(!show?.completed||show.__autoResultScheduled)return;
    show.__autoResultScheduled=true;
    try{
      const time=show.root?.querySelector?.('[data-live-time]');if(time)time.textContent='TERMINÉ';
      const response=show.root?.querySelector?.('[data-live-response]');if(response){response.textContent='Prestation terminée · préparation du bilan…';response.dataset.match='true';}
      const status=show.root?.querySelector?.('[data-live-status]');if(status)status.textContent='Le show est terminé. Ton bilan va s’ouvrir automatiquement.';
    }catch{}
    window.setTimeout(()=>{
      try{
        if(typeof currentGig!=='undefined'&&currentGig&&typeof runFinished!=='undefined'&&!runFinished&&typeof finishGig==='function')finishGig();
      }catch(error){console.error('Auto bilan',error);show.__autoResultScheduled=false;}
    },650);
  }
  function patch(){
    if(typeof VJLiveShow==='undefined'||VJLiveShow.prototype.__finalIntegrationPatched)return;
    const p=VJLiveShow.prototype;p.__finalIntegrationPatched=true;
    const tick=p.tick,restore=p.restore;
    p.tick=function(delta){const value=tick.call(this,delta);if(this.completed)scheduleResult(this);return value;};
    p.restore=function(saved){const value=restore.call(this,saved);if(this.completed)scheduleResult(this);return value;};
  }
  patch();
  return {scheduleResult};
})();
