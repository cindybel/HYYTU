/* Phase 10 · Visual quality
   Raises rendering quality without replacing the performant procedural scene. */
window.VisualQuality=(()=>{
  let ratioCap=1.75,frames=0,elapsed=0,last=performance.now(),lastTraverse=0,raf=0;
  const qualityCaps={low:1,medium:1.3,high:1.75,ultra:2};
  function preferredCap(){
    const setting=profile?.settings?.graphicsQuality||'auto';
    if(setting!=='auto'&&qualityCaps[setting])return qualityCaps[setting];
    return ratioCap;
  }
  function configureRenderer(){
    try{
      const quality=profile?.settings?.graphicsQuality||'auto';
      renderer.shadowMap.enabled=quality!=='low';
      if(THREE.PCFSoftShadowMap)renderer.shadowMap.type=THREE.PCFSoftShadowMap;
      if(THREE.ACESFilmicToneMapping!=null)renderer.toneMapping=THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure=1.04;
      if(THREE.SRGBColorSpace)renderer.outputColorSpace=THREE.SRGBColorSpace;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,preferredCap()));
    }catch{}
  }
  function improveScene(){
    try{
      const quality=profile?.settings?.graphicsQuality||'auto',maxAniso=renderer.capabilities.getMaxAnisotropy?.()||1,aniso=quality==='low'?1:quality==='medium'?4:8;
      scene.traverse(node=>{
        if(!node.isMesh)return;
        const materials=Array.isArray(node.material)?node.material:[node.material];
        for(const material of materials){
          if(!material)continue;
          if(material.map){material.map.anisotropy=Math.min(aniso,maxAniso);if(THREE.SRGBColorSpace&&!material.map.colorSpace)material.map.colorSpace=THREE.SRGBColorSpace;material.map.needsUpdate=true;}
          if(material.isMeshStandardMaterial){
            if(!Number.isFinite(material.roughness))material.roughness=.55;
            if(!Number.isFinite(material.metalness))material.metalness=.05;
            material.envMapIntensity=Math.min(1.15,Math.max(.55,Number(material.envMapIntensity)||.8));
          }
        }
        const parentKind=node.parent?.userData?.modelKind||node.userData?.modelKind||'';
        if(String(parentKind).startsWith('gear:')||/projector|computer|console|road|rack|truss/i.test(node.name||node.parent?.name||'')){node.castShadow=quality!=='low';node.receiveShadow=true;}
      });
    }catch{}
  }
  function setQuality(value){
    if(typeof profile==='undefined'||!profile)return;
    profile.settings ||= {};profile.settings.graphicsQuality=['auto','low','medium','high','ultra'].includes(value)?value:'auto';
    if(profile.settings.graphicsQuality!=='auto')ratioCap=qualityCaps[profile.settings.graphicsQuality]||1.75;
    configureRenderer();improveScene();if(typeof saveSlots==='function')saveSlots();
  }
  function tick(){
    const now=performance.now(),dt=Math.max(0,now-last);last=now;frames++;elapsed+=dt;
    if(now-lastTraverse>4000){lastTraverse=now;improveScene();}
    if(elapsed>=5000){
      const mode=profile?.settings?.graphicsQuality||'auto';
      if(mode==='auto'){
        const fps=frames/(elapsed/1000),target=profile?.settings?.reducedMotion?1.25:(fps<38?1.05:fps<48?1.3:fps>58?1.75:ratioCap);
        if(Math.abs(target-ratioCap)>.05){ratioCap=target;renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,ratioCap));}
      }else{
        const target=qualityCaps[mode]||1.75;if(Math.abs(target-ratioCap)>.01){ratioCap=target;configureRenderer();}
      }
      frames=0;elapsed=0;
    }
  }
  function loop(){tick();raf=requestAnimationFrame(loop);}
  configureRenderer();window.addEventListener('resize',configureRenderer);window.setTimeout(improveScene,250);raf=requestAnimationFrame(loop);
  return {tick,configureRenderer,improveScene,setQuality,get pixelRatioCap(){return ratioCap;},dispose(){cancelAnimationFrame(raf);window.removeEventListener('resize',configureRenderer);}};
})();
