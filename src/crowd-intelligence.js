/* Phase 11 · Intelligent crowd
   Crowd energy reacts to timing, venue type, blackouts, transitions and live requests. */
window.CrowdIntelligence=(()=>{
  const clamp=(v,a=0,b=100)=>Math.max(a,Math.min(b,Number(v)||0));
  function venueProfile(gig){
    const type=String(gig?.clientType||'').toLowerCase(),venue=String(gig?.venue||'').toLowerCase();
    if(type==='festival'||/festival|outdoor|parc|stage/.test(venue))return {id:'festival',label:'Grande foule',response:.55,base:48,cheer:78};
    if(type==='corpo'||/gala|hotel|conference|corporate/.test(venue))return {id:'corporate',label:'Public événementiel',response:.28,base:58,cheer:88};
    if(type==='underground'||/warehouse|sous-sol|underground/.test(venue))return {id:'underground',label:'Crowd underground',response:.72,base:52,cheer:74};
    return {id:'club',label:'Club',response:.65,base:50,cheer:76};
  }
  function injectStyles(){if(document.querySelector('#crowd-intelligence-style'))return;const s=document.createElement('style');s.id='crowd-intelligence-style';s.textContent=`.crowd-panel{margin:8px 0;padding:9px 10px;border:1px solid #334e5b;border-radius:7px;background:#10212b}.crowd-head{display:flex;justify-content:space-between;gap:10px;font-size:10px}.crowd-head small{letter-spacing:.12em;color:#8fe5dd}.crowd-meter{height:7px;margin:7px 0;border-radius:99px;background:#263945;overflow:hidden}.crowd-meter i{display:block;height:100%;width:50%;background:linear-gradient(90deg,#5b8392,#8fe5dd,#e4bf75);transition:width .25s}.crowd-panel p{margin:0;font-size:11px;color:#b3c5cc}`;document.head.append(s);}
  function label(score){return score>=88?'En feu':score>=74?'Très engagé':score>=58?'Accroché':score>=42?'En écoute':score>=25?'Distant':'Décroché';}
  function mount(show,saved){
    if(show.__crowd)return show.__crowd;
    injectStyles();const profileData=venueProfile(show.options?.gig||currentGig),state={score:profileData.base,lastTransitions:show.transitions||0,lastDirectorResolved:0,lastCheer:-99,profile:profileData};
    const panel=document.createElement('section');panel.className='crowd-panel';panel.innerHTML=`<div class="crowd-head"><small>PUBLIC · ${profileData.label}</small><strong data-crowd-score>${Math.round(state.score)}%</strong></div><div class="crowd-meter"><i data-crowd-bar></i></div><p data-crowd-text>${label(state.score)}</p>`;
    const host=show.root.querySelector('.resolute-console-coach')||show.root;host.append(panel);state.panel=panel;show.__crowd=state;if(saved)restore(show,saved);render(show);return state;
  }
  function render(show){const s=show.__crowd;if(!s?.panel)return;s.panel.querySelector('[data-crowd-score]').textContent=`${Math.round(s.score)}%`;s.panel.querySelector('[data-crowd-bar]').style.width=`${clamp(s.score)}%`;s.panel.querySelector('[data-crowd-text]').textContent=`${label(s.score)} · ${s.profile.label}`;document.body.dataset.crowdState=label(s.score).toLowerCase().replace(/\s+/g,'-');}
  function update(show,delta){
    const s=show.__crowd||mount(show),cue=show.cues?.[show.cueIndex||0],level=show.blackout?0:show.intensity*100;let target=s.profile.base;
    if(cue){const inRange=level>=cue.low&&level<=cue.high;target+=inRange?22:-Math.min(24,Math.abs(level-(cue.low+cue.high)/2)*.35);}
    if(show.blackout)target-=18;
    if(show.transitions>s.lastTransitions){target+=12;s.lastTransitions=show.transitions;}
    const director=show.__showDirector?.result?.();if(director&&director.resolved>s.lastDirectorResolved){target+=8*(director.resolved-s.lastDirectorResolved);s.lastDirectorResolved=director.resolved;}
    if(director?.missed)target-=Math.min(18,director.missed*4);
    const phase=Math.min(3,Math.floor((show.elapsed||0)/15));if(phase===2&&!show.blackout&&level>=70)target+=8;
    const k=Math.min(1,delta*s.profile.response);s.score=clamp(s.score+(clamp(target)-s.score)*k);
    if(s.score>=s.profile.cheer&&show.transitions>s.lastCheer&&show.elapsed-s.lastCheer>7){show.soundtrack?.crowd?.();s.lastCheer=show.elapsed;}
    render(show);
  }
  function result(show){const s=show.__crowd;return s?Math.round(s.score):50;}
  function snapshot(show){const s=show.__crowd;return s?{score:s.score,lastTransitions:s.lastTransitions,lastDirectorResolved:s.lastDirectorResolved,lastCheer:s.lastCheer}:null;}
  function restore(show,saved){if(!saved)return;const s=show.__crowd||mount(show);s.score=clamp(saved.score);s.lastTransitions=Number(saved.lastTransitions)||0;s.lastDirectorResolved=Number(saved.lastDirectorResolved)||0;s.lastCheer=Number(saved.lastCheer)||-99;render(show);}
  function patch(){
    if(typeof VJLiveShow!=='undefined'&&!VJLiveShow.prototype.__crowdPatched){const p=VJLiveShow.prototype;p.__crowdPatched=true;const start=p.start,tick=p.tick,res=p.result,snap=p.snapshot,restoreBase=p.restore,dispose=p.dispose;p.start=function(...args){const out=start.apply(this,args);mount(this);return out;};p.tick=function(delta){const out=tick.call(this,delta);if(!this.paused&&!this.completed)update(this,delta);return out;};p.result=function(){return {...res.call(this),crowdScore:result(this)};};p.snapshot=function(){return {...snap.call(this),crowd:snapshot(this)};};p.restore=function(saved){const out=restoreBase.call(this,saved);mount(this,saved?.crowd);return out;};p.dispose=function(){delete document.body.dataset.crowdState;this.__crowd?.panel?.remove();return dispose.call(this);};}
    if(window.SessionRules?.score&&!window.SessionRules.__crowdScore){const original=window.SessionRules.score.bind(window.SessionRules);window.SessionRules.score=function(baseSkill,gig,run){const r=original(baseSkill,gig,run),crowd=clamp(run.live?.crowdScore??50),delta=Math.round((crowd-50)/10);r.clientSatisfaction=clamp(r.clientSatisfaction+delta);r.score=clamp(r.score+Math.round(delta*.5));if(crowd>=80)r.bonuses=[...(r.bonuses||[]),'Public très engagé'];if(crowd<35)r.penalties=[...(r.penalties||[]),'Public décroché'];r.grade=getShowGrade(r.score,run.elapsed||0);r.gradeLabel=getShowGradeLabel(r.score,r.clientSatisfaction);return r;};window.SessionRules.__crowdScore=true;}
  }
  patch();return {mount,result,venueProfile};
})();
