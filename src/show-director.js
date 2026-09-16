/* Phase 6 · Show Director
   Turns the 60-second live set into a changing mandate with timed requests.
   Events are deterministic for a saved run and are graded from observable player actions. */
window.ShowDirector=(()=>{
  const clamp01=value=>Math.max(0,Math.min(100,Number(value)||0));
  const definitions={
    logo:{
      label:'Branding client',
      title:'Le client veut son branding à l’écran',
      brief:'Affiche le carton client pendant au moins 2 secondes avant la fin du délai.',
      action:'Afficher le branding',
    },
    drop:{
      label:'Drop imprévu',
      title:'Le DJ avance son drop',
      brief:'Monte l’intensité à 70 % ou plus et termine un fondu. Un départ sur le temps 1 donne le meilleur résultat.',
    },
    blackout:{
      label:'Blackout régie',
      title:'Le régisseur demande un blackout',
      brief:'Coupe la sortie au moins 1 seconde, puis rétablis l’image avant la fin du délai.',
    },
    signal:{
      label:'Signal instable',
      title:'Le signal devient instable',
      brief:'Réagis rapidement et stabilise la sortie avant que le problème ne devienne visible au client.',
      action:'Stabiliser le signal',
    },
  };

  function stableHash(text=''){
    let h=2166136261;
    for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619);}
    return h>>>0;
  }
  function currentGigFor(show){
    if(show?.options?.gig)return show.options.gig;
    try{return typeof currentGig!=='undefined'?currentGig:null;}catch{return null;}
  }
  function buildSchedule(show){
    const gig=currentGigFor(show),number=Math.max(1,Number(gig?.number)||1);
    const tier=window.GigDifficulty?.tier?.(gig)??Math.min(5,Math.floor((number-1)/5));
    const count=Math.min(4,2+(tier>=1?1:0)+(tier>=3?1:0)+(gig?.clientType==='festival'?1:0));
    const times=count===2?[18,42]:count===3?[13,31,48]:[10,24,38,51];
    const pool=['logo','drop','blackout','signal'];
    const seed=stableHash(`${gig?.id||'gig'}:${Number(profile?.showSessions)||0}`),shift=seed%pool.length;
    const order=pool.map((_,i)=>pool[(i+shift)%pool.length]).slice(0,count);
    return order.map((type,i)=>({id:`director-${i}-${type}`,type,start:times[i],end:Math.min(59,times[i]+(type==='blackout'?7:8)),status:'pending',score:0,reaction:null,hold:0}));
  }
  function injectStyles(){
    if(document.querySelector('#show-director-style'))return;
    const style=document.createElement('style');style.id='show-director-style';style.textContent=`
      .show-director-panel{border:1px solid #526875;background:linear-gradient(180deg,#152b37,#0e1f29);border-radius:7px;padding:10px 12px;margin:10px 0;color:#eaf4f5;box-shadow:0 10px 28px #07101766}
      .show-director-head{display:flex;align-items:center;justify-content:space-between;gap:10px}.show-director-head small{letter-spacing:.14em;color:#8fe5dd;font-size:10px}.show-director-head b{font:700 11px/1 monospace;color:#efc980}
      .show-director-panel h3{font-size:15px;margin:6px 0}.show-director-panel p{font-size:12px;line-height:1.45;margin:5px 0;color:#c5d4da}.show-director-panel[data-state="active"]{border-color:#e4bf75;box-shadow:0 0 0 1px #e4bf7533,0 12px 32px #07101777}.show-director-panel[data-state="resolved"]{border-color:#57b98a}.show-director-panel[data-state="missed"]{border-color:#b56666}
      .show-director-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:8px}.show-director-actions button{min-height:34px}.show-director-summary{display:flex;justify-content:space-between;gap:10px;border-top:1px solid #314a56;margin-top:9px;padding-top:8px;font-size:10px;color:#9eb1ba}.show-director-summary strong{color:#f2e4bf}.show-director-next{font-size:10px;color:#90a9b4}
      [data-director-highlight="true"]{outline:2px solid #e4bf75!important;outline-offset:2px;box-shadow:0 0 18px #e4bf7544!important}.show-director-flash{animation:directorPulse .75s ease-out}@keyframes directorPulse{0%{box-shadow:0 0 0 0 #e4bf7588}100%{box-shadow:0 0 0 14px transparent}}
      @media(max-width:760px){.show-director-head{align-items:flex-start;flex-direction:column}.show-director-summary{flex-direction:column}}
    `;document.head.append(style);
  }

  class Director{
    constructor(show,saved=null){
      this.show=show;this.gig=currentGigFor(show);this.events=buildSchedule(show);this.active=null;this.overlayOn=false;this.signalFault=false;this.blackoutHeld=0;this.blackoutSeen=false;this.dropIntensityReady=false;this.dropTransitionReady=false;this.dropSyncReady=false;this.lastRender=-1;this.attach();if(saved)this.restore(saved);else this.render(true);
    }
    attach(){
      injectStyles();if(this.root?.isConnected)return;
      const root=document.createElement('section');root.className='show-director-panel';root.dataset.state='waiting';root.innerHTML='<div class="show-director-head"><small>SHOW DIRECTOR · DEMANDES LIVE</small><b data-director-clock>EN ATTENTE</b></div><h3 data-director-title>Reste disponible</h3><p data-director-brief>Le client, le DJ ou la régie peuvent modifier le mandat pendant la prestation.</p><div class="show-director-actions"><button type="button" data-director-logo hidden>Afficher le branding</button><button type="button" data-director-signal hidden>Stabiliser le signal</button></div><span class="show-director-next" data-director-next></span><div class="show-director-summary"><span data-director-progress>0 demande résolue</span><strong data-director-score>Mandat live 100 %</strong></div>';
      const host=this.show.root.querySelector('.resolute-console-coach')||this.show.root;const anchor=host.querySelector('.live-action-card')||host.firstChild;host.insertBefore(root,anchor);this.root=root;
      root.querySelector('[data-director-logo]').onclick=()=>this.toggleLogo();root.querySelector('[data-director-signal]').onclick=()=>this.recoverSignal();
    }
    activate(event){
      event.status='active';event.transitionBase=this.show.transitions;event.syncBase=this.show.syncedTransitions;this.active=event;this.blackoutHeld=0;this.blackoutSeen=false;this.dropIntensityReady=false;this.dropTransitionReady=false;this.dropSyncReady=false;this.signalFault=event.type==='signal';this.overlayOn=false;this.flash();this.render(true);
    }
    flash(){if(!this.root)return;this.root.classList.remove('show-director-flash');void this.root.offsetWidth;this.root.classList.add('show-director-flash');}
    scoreFor(event,bonus=0){const reaction=Math.max(0,this.show.elapsed-event.start);return clamp01(Math.round(100-reaction*7+bonus));}
    resolve(event,bonus=0){if(!event||event.status!=='active')return;event.status='resolved';event.reaction=Math.max(0,this.show.elapsed-event.start);event.score=this.scoreFor(event,bonus);this.active=null;this.overlayOn=false;this.signalFault=false;this.clearHighlights();this.flash();this.render(true);}
    miss(event){if(!event||!['active','pending'].includes(event.status))return;event.status='missed';event.score=0;if(this.active===event)this.active=null;this.overlayOn=false;this.signalFault=false;this.clearHighlights();this.render(true);}
    toggleLogo(){const event=this.active;if(event?.type!=='logo')return;this.overlayOn=!this.overlayOn;event.hold=event.hold||0;this.render(true);}
    recoverSignal(){const event=this.active;if(event?.type!=='signal')return;this.signalFault=false;this.resolve(event,8);}
    clearHighlights(){this.show.root.querySelectorAll('[data-director-highlight]').forEach(node=>node.removeAttribute('data-director-highlight'));}
    highlight(type){this.clearHighlights();let selector='';if(type==='drop')selector='[data-live-sync]';if(type==='blackout')selector='[data-live-blackout]';if(type==='logo')selector='[data-director-logo]';if(type==='signal')selector='[data-director-signal]';this.root?.querySelector(selector)?.setAttribute('data-director-highlight','true');this.show.root.querySelector(selector)?.setAttribute('data-director-highlight','true');}
    tick(delta){
      const t=Number(this.show.elapsed)||0;
      for(const event of this.events){if(event.status==='pending'&&t>=event.end)this.miss(event);}
      if(!this.active){const due=this.events.find(event=>event.status==='pending'&&t>=event.start&&t<event.end);if(due)this.activate(due);}
      const event=this.active;
      if(event){
        if(event.type==='logo'){
          if(this.overlayOn)event.hold=(event.hold||0)+delta;
          if((event.hold||0)>=2)this.resolve(event,5);
        }else if(event.type==='blackout'){
          if(this.show.blackout){this.blackoutSeen=true;this.blackoutHeld+=delta;}
          else if(this.blackoutSeen&&this.blackoutHeld>=1)this.resolve(event,6);
        }else if(event.type==='drop'){
          if(this.show.intensity>=.7)this.dropIntensityReady=true;
          if(this.show.transitions>(event.transitionBase||0))this.dropTransitionReady=true;
          if(this.show.syncedTransitions>(event.syncBase||0))this.dropSyncReady=true;
          if(this.dropIntensityReady&&this.dropTransitionReady)this.resolve(event,this.dropSyncReady?12:0);
        }
        if(event.status==='active'&&t>=event.end)this.miss(event);
      }
      if(this.show.completed){for(const pending of this.events.filter(e=>e.status==='pending'||e.status==='active'))this.miss(pending);}
      if(Math.floor(t*5)!==this.lastRender){this.lastRender=Math.floor(t*5);this.render();}
    }
    render(force=false){
      if(!this.root)return;const t=Number(this.show.elapsed)||0,event=this.active;const done=this.events.filter(e=>e.status==='resolved').length,missed=this.events.filter(e=>e.status==='missed').length,total=this.events.length,score=this.result().score;
      const clock=this.root.querySelector('[data-director-clock]'),title=this.root.querySelector('[data-director-title]'),brief=this.root.querySelector('[data-director-brief]'),logo=this.root.querySelector('[data-director-logo]'),signal=this.root.querySelector('[data-director-signal]');
      logo.hidden=event?.type!=='logo';signal.hidden=event?.type!=='signal';if(event?.type==='logo')logo.textContent=this.overlayOn?'Retirer le branding':'Afficher le branding';
      if(event){const def=definitions[event.type];this.root.dataset.state='active';clock.textContent=`${Math.max(0,event.end-t).toFixed(1)} s`;title.textContent=def.title;brief.textContent=event.type==='logo'&&this.overlayOn?`Branding visible · ${(event.hold||0).toFixed(1)} / 2.0 s`:event.type==='blackout'&&this.blackoutHeld>=1?'Blackout tenu · rétablis maintenant l’image.':event.type==='drop'?(this.dropIntensityReady?'Intensité OK · termine maintenant un fondu.':def.brief):def.brief;this.highlight(event.type);
      }else{
        const latest=[...this.events].reverse().find(e=>e.status==='resolved'||e.status==='missed'),next=this.events.find(e=>e.status==='pending');this.root.dataset.state=latest?.status||'waiting';clock.textContent=next?`DANS ${Math.max(0,next.start-t).toFixed(0)} s`:'MANDAT TERMINÉ';title.textContent=latest?(latest.status==='resolved'?`✓ ${definitions[latest.type].label} réussi`:`Demande manquée · ${definitions[latest.type].label}`):'Reste disponible';brief.textContent=latest?(latest.status==='resolved'?`Réaction ${latest.reaction?.toFixed(1)||'0.0'} s · ${latest.score}/100.`:'Cette demande pèsera dans le professionnalisme du bilan.'):'Une demande live peut arriver pendant le show.';this.clearHighlights();
      }
      const next=this.events.find(e=>e.status==='pending');this.root.querySelector('[data-director-next]').textContent=next&&!event?`Prochaine demande vers ${Math.round(next.start)} s · ${definitions[next.type].label}`:event?'Réagis avant la fin du compte à rebours.':'Toutes les demandes ont été traitées.';
      this.root.querySelector('[data-director-progress]').textContent=`${done}/${total} résolue${done>1?'s':''}${missed?` · ${missed} manquée${missed>1?'s':''}`:''}`;this.root.querySelector('[data-director-score]').textContent=`Mandat live ${score} %`;
    }
    draw(ctx,canvas){
      if(!ctx||!canvas)return;
      if(this.signalFault){ctx.save();ctx.globalAlpha=.22;for(let y=8;y<canvas.height;y+=36){ctx.fillStyle=y%72?'#f3f6f1':'#68d9d0';ctx.fillRect(0,y,canvas.width,4);}ctx.globalAlpha=.16;ctx.fillStyle='#fff';ctx.fillRect(0,Math.floor((this.show.elapsed*91)%canvas.height),canvas.width,10);ctx.restore();}
      if(this.overlayOn){const label=this.gig?.venue||this.gig?.title||'CLIENT';ctx.save();ctx.globalAlpha=.82;ctx.fillStyle='#07131b';ctx.fillRect(canvas.width*.06,canvas.height*.77,canvas.width*.5,canvas.height*.14);ctx.globalAlpha=1;ctx.fillStyle='#e9dec6';ctx.font=`700 ${Math.max(14,Math.round(canvas.height*.045))}px Arial`;ctx.fillText('BRANDING CLIENT',canvas.width*.085,canvas.height*.825);ctx.fillStyle='#8fe5dd';ctx.font=`600 ${Math.max(12,Math.round(canvas.height*.035))}px Arial`;ctx.fillText(String(label).slice(0,32),canvas.width*.085,canvas.height*.872);ctx.restore();}
    }
    result(){const total=this.events.length,resolved=this.events.filter(e=>e.status==='resolved'),missed=this.events.filter(e=>e.status==='missed'),score=total?Math.round(this.events.reduce((sum,e)=>sum+(e.status==='resolved'?e.score:0),0)/total):100;return {score,total,resolved:resolved.length,missed:missed.length,resolvedLabels:resolved.map(e=>definitions[e.type].label),missedLabels:missed.map(e=>definitions[e.type].label),events:this.events.map(e=>({id:e.id,type:e.type,status:e.status,score:e.score,reaction:e.reaction,start:e.start,end:e.end}))};}
    snapshot(){return {events:this.events.map(e=>({...e})),overlayOn:this.overlayOn,signalFault:this.signalFault,blackoutHeld:this.blackoutHeld,blackoutSeen:this.blackoutSeen,dropIntensityReady:this.dropIntensityReady,dropTransitionReady:this.dropTransitionReady,dropSyncReady:this.dropSyncReady,activeId:this.active?.id||null};}
    restore(saved){if(Array.isArray(saved?.events)&&saved.events.length)this.events=saved.events.map(e=>({...e}));this.overlayOn=Boolean(saved?.overlayOn);this.signalFault=Boolean(saved?.signalFault);this.blackoutHeld=Number(saved?.blackoutHeld)||0;this.blackoutSeen=Boolean(saved?.blackoutSeen);this.dropIntensityReady=Boolean(saved?.dropIntensityReady);this.dropTransitionReady=Boolean(saved?.dropTransitionReady);this.dropSyncReady=Boolean(saved?.dropSyncReady);this.active=this.events.find(e=>e.id===saved?.activeId&&e.status==='active')||null;this.render(true);}
    dispose(){this.clearHighlights();this.root?.remove();this.root=null;}
  }

  function attach(show,saved=null){if(!show)return null;if(!show.__showDirector)show.__showDirector=new Director(show,saved);else if(saved)show.__showDirector.restore(saved);return show.__showDirector;}
  function patchLiveShow(){
    if(typeof VJLiveShow==='undefined'||VJLiveShow.prototype.__showDirectorPatched)return;
    const p=VJLiveShow.prototype;p.__showDirectorPatched=true;
    const start=p.start,tick=p.tick,draw=p.drawProgram,result=p.result,snapshot=p.snapshot,restore=p.restore,dispose=p.dispose;
    p.start=function(...args){const value=start.apply(this,args);attach(this);return value;};
    p.tick=function(delta){const value=tick.call(this,delta);attach(this)?.tick(delta);return value;};
    p.drawProgram=function(...args){const value=draw.apply(this,args);this.__showDirector?.draw(this.ctx,this.canvas);return value;};
    p.result=function(){const base=result.call(this);return {...base,director:attach(this)?.result()||null};};
    p.snapshot=function(){const base=snapshot.call(this);return {...base,directorState:attach(this)?.snapshot()||null};};
    p.restore=function(saved){const value=restore.call(this,saved);attach(this,saved?.directorState);return value;};
    p.dispose=function(){this.__showDirector?.dispose();this.__showDirector=null;return dispose.call(this);};
  }
  function patchScoring(){
    if(!window.SessionRules||SessionRules.__showDirectorPatched)return;SessionRules.__showDirectorPatched=true;const scoreBase=SessionRules.score.bind(SessionRules);
    SessionRules.score=(baseSkill,gig,run)=>{const base=scoreBase(baseSkill,gig,run),director=run.live?.director;if(!director?.total)return base;const signal=Math.max(0,Math.min(1,Number(run.connectedRatio??1))),completion=Math.max(0,Math.min(1,Number(run.live?.completion??0))),professional=Math.round(base.professional*.35+director.score*.65),score=Math.round(Math.min(base.technical*.4+base.artistic*.35+professional*.25,100*signal*completion)),clientSatisfaction=Math.round(Math.min(100,score*.7+director.score*.3)),bonuses=[...base.bonuses],penalties=[...base.penalties];if(director.resolved)bonuses.push(`Show Director ${director.resolved}/${director.total} demandes`);if(director.resolved===director.total)bonuses.push('Mandat live respecté');if(director.missed)penalties.push(`Demandes live manquées : ${director.missedLabels.join(', ')}`);return {...base,professional,score,clientSatisfaction,bonuses,penalties,grade:getShowGrade(score,run.elapsed||0),gradeLabel:getShowGradeLabel(score,clientSatisfaction),stars:`${getFinalGigQuality(score).stars} étoiles`};};
  }
  patchLiveShow();patchScoring();
  return {attach,definitions};
})();