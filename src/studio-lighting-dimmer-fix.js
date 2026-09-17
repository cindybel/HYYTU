/* Darken legacy/global room lighting with the physical studio dimmer. */
(()=>{
  if(window.__studioDimmerDarknessFix)return;
  window.__studioDimmerDarknessFix=true;

  const BASE_KEY='studioDimmerBaseIntensity';
  const MIN_AMBIENT=.035;

  function isInside(root,node){
    let current=node;
    while(current){if(current===root)return true;current=current.parent;}
    return false;
  }

  function level(){
    const raw=Number(window.profile?.studioLightLevel ?? (typeof profile!=='undefined'?profile?.studioLightLevel:1) ?? 1);
    return Number.isFinite(raw)?Math.max(0,Math.min(1,raw)):1;
  }

  function apply(){
    if(typeof scene==='undefined')return;
    const walking=document.body.classList.contains('studio-world-view');
    const studioRoot=window.StudioSet?.group;
    const factor=walking ? MIN_AMBIENT+(1-MIN_AMBIENT)*level() : 1;

    scene.traverse(light=>{
      if(!light?.isLight)return;
      if(studioRoot&&isInside(studioRoot,light))return;
      if(!Number.isFinite(light.userData?.[BASE_KEY])){
        light.userData=light.userData||{};
        light.userData[BASE_KEY]=Number(light.intensity)||0;
      }
      const base=light.userData[BASE_KEY];
      light.intensity=base*factor;
    });
  }

  function install(){
    if(!window.StudioWorld?.tick){requestAnimationFrame(install);return;}
    if(window.StudioWorld.tick.__dimmerDarknessWrapped)return;
    const original=window.StudioWorld.tick.bind(window.StudioWorld);
    const wrapped=function(...args){const result=original(...args);apply();return result;};
    wrapped.__dimmerDarknessWrapped=true;
    window.StudioWorld.tick=wrapped;
  }

  install();
})();
