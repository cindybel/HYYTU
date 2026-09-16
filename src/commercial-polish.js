/* Phase 13 · Commercial-quality foundation
   Save migration, autosave, gamepad basics, player-facing options and recoverable errors.
   Platform-specific Steam/cloud features stay outside this browser build. */
window.CommercialPolish=(()=>{
  let autosaveTimer=0,gamepadRaf=0,lastPadKeys=new Set(),lastErrorAt=0,translatingKey=false;
  const defaultControls={up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight',interact:'KeyE',confirm:'Enter',back:'Escape'};
  const controlLabels={ArrowUp:'↑',ArrowDown:'↓',ArrowLeft:'←',ArrowRight:'→',KeyW:'W',KeyA:'A',KeyS:'S',KeyD:'D',KeyZ:'Z',KeyQ:'Q',KeyE:'E',KeyF:'F',KeyI:'I',KeyJ:'J',KeyK:'K',KeyL:'L',Enter:'Entrée',Escape:'Échap'};
  function migrate(){
    if(typeof profile==='undefined'||!profile)return;
    profile.settings ||= {};
    if(!Number.isFinite(profile.settings.uiScale))profile.settings.uiScale=1;
    if(!Number.isFinite(profile.settings.fov))profile.settings.fov=50;
    if(!['auto','low','medium','high','ultra'].includes(profile.settings.graphicsQuality))profile.settings.graphicsQuality='auto';
    if(!['none','contrast'].includes(profile.settings.colorAssist))profile.settings.colorAssist='none';
    profile.settings.controls={...defaultControls,...(profile.settings.controls||{})};
    profile.careerWorld ||= {sectorRep:{},contacts:{},negotiations:{},lastCallbackDay:0};
    profile.sessionRecordings ||= [];
    profile.saveVersion=Math.max(13,Number(profile.saveVersion)||0);
  }
  function injectStyles(){
    if(document.querySelector('#commercial-polish-style'))return;
    const style=document.createElement('style');style.id='commercial-polish-style';style.textContent=`
      .commercial-settings{margin-top:16px;padding-top:14px;border-top:1px solid #344e5b}.commercial-settings h2{margin:0 0 10px;font-size:14px}.commercial-settings-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}.commercial-settings label{display:flex;justify-content:space-between;gap:12px;align-items:center;padding:8px;border:1px solid #2f4855;border-radius:6px;background:#132733}.commercial-settings select,.commercial-settings input{max-width:160px}.control-bindings{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-top:9px}.control-bindings label{font-size:10px}.commercial-setting-note{margin:9px 0 0;color:#9fb3bd;font-size:10px}body[data-color-assist="contrast"] .live-response[data-match="true"],body[data-color-assist="contrast"] [data-crowd-state]{outline:2px solid #fff}body[data-color-assist="contrast"] .live-target-meter{filter:saturate(.25) contrast(1.45)}@media(max-width:760px){.commercial-settings-grid,.control-bindings{grid-template-columns:1fr}}
    `;document.head.append(style);
  }
  function applyViewSettings(){
    try{
      migrate();
      const fov=Math.max(40,Math.min(80,Number(profile.settings.fov)||50));
      if(camera?.isPerspectiveCamera&&Math.abs(camera.fov-fov)>.1){camera.fov=fov;camera.updateProjectionMatrix();}
      const scale=Math.max(.85,Math.min(1.25,Number(profile.settings.uiScale)||1));
      document.documentElement.style.setProperty('--vj-ui-scale',String(scale));
      document.documentElement.style.fontSize=`${Math.round(16*scale)}px`;
      document.body.dataset.colorAssist=profile.settings.colorAssist||'none';
      window.VisualQuality?.setQuality?.(profile.settings.graphicsQuality||'auto');
    }catch{}
  }
  function autosave(){try{if(typeof profile!=='undefined'&&profile&&typeof saveSlots==='function'){migrate();saveSlots();}}catch{} }
  function startAutosave(){clearInterval(autosaveTimer);autosaveTimer=setInterval(autosave,45000);}
  function emitKey(code,down){
    const keyMap={ArrowUp:'ArrowUp',ArrowDown:'ArrowDown',ArrowLeft:'ArrowLeft',ArrowRight:'ArrowRight',KeyE:'e',Enter:'Enter',Escape:'Escape'},key=keyMap[code]||code.replace(/^Key/,'').toLowerCase();
    translatingKey=true;
    try{document.body.dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code,key,bubbles:true,cancelable:true}));}finally{translatingKey=false;}
  }
  function gamepadLoop(){
    const pad=navigator.getGamepads?.()?.[0],next=new Set();
    if(pad){
      const ax=pad.axes||[],b=pad.buttons||[];
      if(b[12]?.pressed||ax[1]<-.55)next.add('ArrowUp');if(b[13]?.pressed||ax[1]>.55)next.add('ArrowDown');if(b[14]?.pressed||ax[0]<-.55)next.add('ArrowLeft');if(b[15]?.pressed||ax[0]>.55)next.add('ArrowRight');
      if(b[0]?.pressed)next.add('KeyE');if(b[1]?.pressed)next.add('Escape');if(b[9]?.pressed)next.add('Enter');
    }
    for(const code of next)if(!lastPadKeys.has(code))emitKey(code,true);for(const code of lastPadKeys)if(!next.has(code))emitKey(code,false);lastPadKeys=next;gamepadRaf=requestAnimationFrame(gamepadLoop);
  }
  function translateCustomKey(event){
    if(translatingKey||!profile?.settings?.controls||event.repeat)return;
    if(event.target?.closest?.('input,select,textarea,button'))return;
    const controls=profile.settings.controls;
    const action=Object.keys(defaultControls).find(name=>controls[name]===event.code&&controls[name]!==defaultControls[name]);
    if(!action)return;
    event.preventDefault();event.stopImmediatePropagation();emitKey(defaultControls[action],event.type==='keydown');
  }
  function optionsMarkup(){
    migrate();
    const optionsFor=(values,current)=>values.map(value=>`<option value="${value}" ${value===current?'selected':''}>${controlLabels[value]||value}</option>`).join('');
    const moveCodes=['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyA','KeyS','KeyD','KeyZ','KeyQ','KeyI','KeyJ','KeyK','KeyL'];
    const interactCodes=['KeyE','KeyF','Enter'];
    return `<section class="commercial-settings"><h2>Affichage et contrôles</h2><div class="commercial-settings-grid">
      <label><span>Qualité graphique</span><select data-commercial="graphicsQuality"><option value="auto">Auto</option><option value="low">Bas</option><option value="medium">Moyen</option><option value="high">Élevé</option><option value="ultra">Ultra</option></select></label>
      <label><span>Champ de vision <output data-fov-output>${profile.settings.fov}°</output></span><input data-commercial="fov" type="range" min="40" max="80" step="1" value="${profile.settings.fov}"></label>
      <label><span>Taille interface <output data-ui-output>${Math.round(profile.settings.uiScale*100)}%</output></span><input data-commercial="uiScale" type="range" min="0.85" max="1.25" step="0.05" value="${profile.settings.uiScale}"></label>
      <label><span>Contraste des repères</span><select data-commercial="colorAssist"><option value="none">Standard</option><option value="contrast">Contraste renforcé</option></select></label>
    </div><h2>Touches</h2><div class="control-bindings">
      <label>Haut <select data-control="up">${optionsFor(moveCodes,profile.settings.controls.up)}</select></label><label>Bas <select data-control="down">${optionsFor(moveCodes,profile.settings.controls.down)}</select></label><label>Gauche <select data-control="left">${optionsFor(moveCodes,profile.settings.controls.left)}</select></label><label>Droite <select data-control="right">${optionsFor(moveCodes,profile.settings.controls.right)}</select></label><label>Interagir <select data-control="interact">${optionsFor(interactCodes,profile.settings.controls.interact)}</select></label>
    </div><p class="commercial-setting-note">Manette : stick/D-pad pour bouger, A pour interagir, B pour retour, Start pour confirmer. Les réglages sont sauvegardés dans le profil.</p></section>`;
  }
  function bindOptions(host){
    const root=host.querySelector('.commercial-settings');if(!root)return;
    root.querySelector('[data-commercial="graphicsQuality"]').value=profile.settings.graphicsQuality;
    root.querySelector('[data-commercial="colorAssist"]').value=profile.settings.colorAssist;
    root.querySelectorAll('[data-commercial]').forEach(input=>input.oninput=()=>{
      const key=input.dataset.commercial,value=input.type==='range'?Number(input.value):input.value;profile.settings[key]=value;
      if(key==='fov')root.querySelector('[data-fov-output]').textContent=`${value}°`;if(key==='uiScale')root.querySelector('[data-ui-output]').textContent=`${Math.round(value*100)}%`;
      applyViewSettings();saveSlots();
    });
    root.querySelectorAll('[data-control]').forEach(select=>select.onchange=()=>{profile.settings.controls[select.dataset.control]=select.value;saveSlots();});
  }
  function patchSettings(){
    if(typeof window.renderSettings!=='function'||window.renderSettings.__commercialPatched)return;
    const original=window.renderSettings;
    const wrapped=function(host=appWindow){const value=original(host);host.querySelector('.settings-panel')?.insertAdjacentHTML('beforeend',optionsMarkup());bindOptions(host);return value;};
    wrapped.__commercialPatched=true;window.renderSettings=wrapped;
  }
  function reportError(message){const now=Date.now();if(now-lastErrorAt<4000)return;lastErrorAt=now;try{if(typeof notify==='function')notify(`Le jeu a récupéré une erreur : ${String(message||'inconnue').slice(0,90)}`);}catch{} }
  function onError(event){reportError(event?.error?.message||event?.message);}
  function onReject(event){reportError(event?.reason?.message||event?.reason);}
  function init(){
    injectStyles();migrate();applyViewSettings();patchSettings();startAutosave();
    window.addEventListener('beforeunload',autosave);window.addEventListener('error',onError);window.addEventListener('unhandledrejection',onReject);window.addEventListener('keydown',translateCustomKey,true);window.addEventListener('keyup',translateCustomKey,true);gamepadRaf=requestAnimationFrame(gamepadLoop);
  }
  init();
  return {migrate,autosave,applyViewSettings,dispose(){clearInterval(autosaveTimer);cancelAnimationFrame(gamepadRaf);window.removeEventListener('beforeunload',autosave);window.removeEventListener('error',onError);window.removeEventListener('unhandledrejection',onReject);window.removeEventListener('keydown',translateCustomKey,true);window.removeEventListener('keyup',translateCustomKey,true);}};
})();
