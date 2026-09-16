/* Phase 6 · Content
   Adds honest, reusable metadata to the shipped visual library. No fake assets are
   advertised: packs remain curated selections of existing clips, but every clip gets a
   gameplay identity that browsers, briefs and future missions can use. */
window.VJContent=(()=>{
  const themes=[
    {id:'cosmic',label:'Cosmique',keywords:['Poussière','Orbites','Satellites','Constellation','Aurore'],styles:['chill','psytrance']},
    {id:'geometric',label:'Géométrique',keywords:['Pyramides','Portails','Cristaux','Colonnes','Grille','Hex','Mosaïque'],styles:['techno','corpo']},
    {id:'organic',label:'Organique',keywords:['Marées','Floraison','Tissu','Rubans','Courbes','Waves'],styles:['chill','underground']},
    {id:'kinetic',label:'Cinétique',keywords:['Spirale','Rayons','Éventail','Séquence','Tunnel','Circuit'],styles:['techno','rock']},
    {id:'abstract',label:'Abstrait',keywords:['Nœuds','Éclipse','Double hélice','Relief','Oscilloscope','Prisme','Neon'],styles:['psytrance','underground']},
  ];
  const energyMeta={
    warmup:{label:'Warm-up / break',intensity:1,tempo:'lent',use:'Installer une ambiance ou laisser respirer la scène'},
    groove:{label:'Groove',intensity:2,tempo:'moyen',use:'Tenir un passage stable sans voler la vedette'},
    rise:{label:'Montée',intensity:3,tempo:'croissant',use:'Faire monter la tension avant un changement musical'},
    peak:{label:'Peak',intensity:4,tempo:'fort',use:'Soutenir un moment fort avec une image plus dense'},
    legacy:{label:'Polyvalent',intensity:2,tempo:'variable',use:'Visuel flexible pour construire ou contraster une séquence'},
  };
  function themeFor(label=''){
    return themes.find(theme=>theme.keywords.some(word=>label.toLowerCase().includes(word.toLowerCase())))||themes[3];
  }
  function motionFor(label=''){
    if(/Suspendu|Aurore|Marées|Poussière|Rubans|Waves/i.test(label))return 'respiration';
    if(/Déploiement|Tunnel|Rayons|Séquence|Grille|Portails/i.test(label))return 'propulsion';
    if(/Spirale|Orbites|Éventail|Nœuds/i.test(label))return 'rotation';
    return 'pulsation';
  }
  function enrich(clip,index){
    const energy=clip.energy||'legacy',theme=clip.genre?themes.find(t=>t.id===({techno:'geometric',hiphop:'kinetic',chill:'organic',psytrance:'abstract',rock:'kinetic'}[clip.genre])):themeFor(clip.label),meta=energyMeta[energy]||energyMeta.legacy;
    window.ClipProgression?.enrich(clip);
    return Object.assign(clip,{
      contentId:clip.contentId||`visual-${String(index+1).padStart(2,'0')}`,
      energy,
      theme:theme.id,
      themeLabel:theme.label,
      motion:motionFor(clip.label),
      intensity:meta.intensity,
      tempoFeel:meta.tempo,
      recommendedUse:meta.use,
      styleAffinity:clip.styleAffinity||[...theme.styles],
    });
  }
  function curate(clips,{energy=null,theme=null,limit=6,exclude=[]}={}){
    const blocked=new Set(exclude);
    return clips.filter(c=>!blocked.has(c.contentId)&&(!energy||c.energy===energy)&&(!theme||c.theme===theme)).slice(0,limit);
  }
  function describe(clip){
    const meta=energyMeta[clip.energy]||energyMeta.legacy;
    return `${clip.themeLabel||'Visuel'} · ${meta.label} · mouvement ${clip.motion||'variable'}. ${clip.recommendedUse||meta.use}.`;
  }
  function packIdentity(item){
    const map={techno:'geometric',hiphop:'kinetic',rock:'kinetic',chill:'organic',psytrance:'abstract'};
    const theme=map[item?.styleTarget]||'geometric';
    const energy={chill:'warmup',hiphop:'groove',rock:'rise',techno:'peak',psytrance:'peak'}[item?.styleTarget]||'groove';
    return {theme,energy,label:themes.find(t=>t.id===theme)?.label||'Sélection'};
  }
  if(Array.isArray(window.OriginalClipLibrary))window.OriginalClipLibrary.forEach(enrich);
  try { if(typeof videoClips!=='undefined'&&Array.isArray(videoClips))videoClips.forEach(enrich); } catch {}
  return {themes,energyMeta,enrich,curate,describe,packIdentity};
})();

/* Gameplay modules are isolated so each phase can evolve without bloating main.js.
   VJ Core patches the programme first; Show Director wraps it afterwards so client overlays stay visible.
   FinalIntegration loads last and owns the transition from a completed show to the career result. */
(()=>{
  const modules=[
    ['visual-quality','./src/visual-quality.js?v=phase10-20260915'],
    ['vj-core3','./src/vj-core3.js?v=phase9-20260915'],
    ['show-director','./src/show-director.js?v=phase6-20260915'],
    ['career-world','./src/career-world.js?v=phase7-20260915'],
    ['signal-chain','./src/signal-chain.js?v=phase8-20260915'],
    ['crowd-intelligence','./src/crowd-intelligence.js?v=phase11-20260915'],
    ['progression-gameplay','./src/progression-gameplay.js?v=phase12-20260915'],
    ['commercial-polish','./src/commercial-polish.js?v=phase13-20260915'],
    ['final-integration','./src/final-integration.js?v=final-20260915'],
  ];
  for(const [id,src] of modules){
    if(document.querySelector(`script[data-vj-module="${id}"]`))continue;
    const script=document.createElement('script');script.src=src;script.async=false;script.dataset.vjModule=id;document.head.append(script);
  }
})();