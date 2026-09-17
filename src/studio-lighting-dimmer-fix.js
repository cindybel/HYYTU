/* Darken the studio reliably with the physical ceiling-light dimmer. */
(()=>{
  if(window.__studioDimmerDarknessFix)return;
  window.__studioDimmerDarknessFix=true;

  const BASE_KEY='studioDimmerBaseIntensity';
  const MIN_AMBIENT=.02;
  const MIN_BRIGHTNESS=.12;

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
    const amount=level();
    const factor=walking ? MIN_AMBIENT+(1-MIN_AMBIENT)*amount : 1;

    // Dim every global/legacy light that is not already controlled by StudioSet.
    scene.traverse(light=>{
      if(!light?.isLight)return;
      if(studioRoot&&isInside(studioRoot,light))return;
      if(!Number.isFinite(light.userData?.[BASE_KEY])){
        light.userData=light.userData||{};
        light.userData[BASE_KEY]=Number(light.intensity)||0;
      }
      light.intensity=light.userData[BASE_KEY]*factor;
    });

    // Guaranteed visual result: darken only the 3D canvas while walking.
    // This also catches basic/emissive materials that lights cannot affect.
    const view=(typeof renderer!=='undefined'&&renderer?.domElement)||document.querySelector('#game');
    if(view){
      if(walking){
        const brightness=MIN_BRIGHTNESS+(1-MIN_BRIGHTNESS)*Math.pow(amount,0.72);
        view.style.filter=`brightness(${brightness.toFixed(3)})`;
      }else{
        view.style.filter='';
      }
    }
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
