/* GOD99 in-game scene editor.
   Available only to a career whose VJ name contains GOD99.
   X toggles the editor while walking in the studio.
*/
window.God99SceneEditor=(()=>{
  const STORAGE_KEY='hyyu-god99-scenes-v1';
  const group=new THREE.Group();
  group.name='GOD99 Scene Editor Objects';
  scene.add(group);

  let open=false;
  let selected=null;
  let suppressCanvasClick=false;
  let objectSerial=1;

  const clamp=(v,min,max)=>Math.max(min,Math.min(max,Number(v)||0));
  const round=v=>Math.round((Number(v)||0)*1000)/1000;
  const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));

  function profileName(){
    return String(profile?.vjName||profile?.name||profile?.displayName||profile?.character?.name||document.querySelector('#vj-name')?.value||'').trim();
  }
  function allowed(){return /god\s*99/i.test(profileName());}
  function walking(){return document.body.classList.contains('studio-world-view');}

  const panel=document.createElement('section');
  panel.id='god99-scene-editor';
  panel.hidden=true;
  panel.innerHTML=`
    <div class="g99-shell">
      <header class="g99-head">
        <div><small>GOD99</small><h2>Éditeur de scène</h2><p>Ajoute et place les objets directement dans le garage.</p></div>
        <button type="button" data-g99-close title="Fermer (X)">×</button>
      </header>
      <div class="g99-toolbar">
        <input data-g99-search type="search" placeholder="Chercher un objet…">
        <select data-g99-category><option value="all">Tous les objets</option></select>
        <button type="button" data-g99-save>Sauvegarder</button>
        <button type="button" data-g99-load>Charger</button>
        <button type="button" data-g99-export>Exporter JSON</button>
        <label class="g99-import">Importer JSON<input data-g99-import type="file" accept="application/json,.json"></label>
      </div>
      <div class="g99-body">
        <aside class="g99-library"><strong>OBJETS</strong><div data-g99-library></div></aside>
        <aside class="g99-inspector">
          <div data-g99-empty>Sélectionne un objet dans la scène ou ajoute-en un.</div>
          <div data-g99-fields hidden>
            <strong data-g99-selected-name></strong>
            <div class="g99-grid">
              <label>X<input data-prop="x" type="number" step="0.1"></label>
              <label>Y<input data-prop="y" type="number" step="0.1"></label>
              <label>Z<input data-prop="z" type="number" step="0.1"></label>
              <label>Rotation<input data-prop="rotation" type="number" step="5"></label>
              <label>Échelle<input data-prop="scale" type="number" min="0.05" step="0.05"></label>
            </div>
            <div class="g99-actions">
              <button type="button" data-g99-duplicate>Dupliquer</button>
              <button type="button" data-g99-floor>Au sol</button>
              <button type="button" data-g99-delete>Supprimer</button>
            </div>
            <small>Raccourcis : Suppr = supprimer · D = dupliquer · Q/E = rotation · flèches = déplacer.</small>
          </div>
          <div class="g99-scenes"><strong>SCÈNES SAUVEGARDÉES</strong><select data-g99-scenes></select><input data-g99-scene-name placeholder="Nom de la scène" value="Garage GOD99"></div>
        </aside>
      </div>
    </div>`;
  document.body.append(panel);

  const style=document.createElement('style');
  style.textContent=`
    #god99-scene-editor{position:fixed;inset:58px 24px 24px;z-index:1400;pointer-events:none;color:#e7f9f6;font-family:Arial,sans-serif}
    #god99-scene-editor[hidden]{display:none}
    .g99-shell{height:100%;display:grid;grid-template-rows:auto auto 1fr;pointer-events:auto;background:#081219f4;border:1px solid #2b7780;border-radius:14px;box-shadow:0 30px 90px #000b;overflow:hidden}
    .g99-head{display:flex;justify-content:space-between;gap:20px;padding:14px 18px;border-bottom:1px solid #214b54;background:#0b1b24}.g99-head h2{margin:2px 0 3px;font-size:22px}.g99-head p{margin:0;color:#92aeb5;font-size:12px}.g99-head small{color:#4cf0dd;font-weight:900;letter-spacing:.18em}.g99-head button{width:40px;height:40px;border:1px solid #355c65;border-radius:8px;background:#142a34;color:white;font-size:25px;cursor:pointer}
    .g99-toolbar{display:flex;gap:8px;align-items:center;padding:10px 14px;border-bottom:1px solid #1d4650;flex-wrap:wrap}.g99-toolbar input[type=search],.g99-toolbar select,.g99-toolbar button,.g99-import{min-height:36px;border:1px solid #315965;border-radius:6px;background:#10242e;color:#e8f7f5;padding:7px 10px;font:inherit}.g99-toolbar input[type=search]{min-width:230px}.g99-toolbar button,.g99-import{cursor:pointer}.g99-import input{display:none}
    .g99-body{min-height:0;display:grid;grid-template-columns:minmax(360px,1fr) 300px}.g99-library{min-height:0;padding:12px;overflow:auto;border-right:1px solid #1d4650}.g99-library>strong,.g99-scenes>strong{display:block;margin-bottom:8px;color:#57eadc;font-size:11px;letter-spacing:.12em}.g99-library [data-g99-library]{display:grid;grid-template-columns:repeat(auto-fill,minmax(145px,1fr));gap:8px}.g99-object{display:grid;gap:4px;text-align:left;padding:9px;border:1px solid #244d58;border-radius:7px;background:#10242d;color:#e7f5f3;cursor:pointer}.g99-object:hover{border-color:#4ad7c9;background:#16313b}.g99-object small{color:#87a9af;font-size:10px}.g99-object b{font-size:12px}
    .g99-inspector{padding:14px;overflow:auto;background:#0b1820}.g99-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0}.g99-grid label{display:grid;gap:4px;color:#9db7bd;font-size:10px}.g99-grid input,.g99-scenes input,.g99-scenes select{width:100%;box-sizing:border-box;border:1px solid #2a5660;border-radius:5px;background:#09161d;color:white;padding:8px}.g99-actions{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:9px}.g99-actions button{border:1px solid #315b65;border-radius:5px;background:#17303a;color:white;padding:8px;cursor:pointer}.g99-actions [data-g99-delete]{border-color:#824852;background:#321820}.g99-scenes{display:grid;gap:7px;margin-top:22px;padding-top:12px;border-top:1px solid #20434d}.g99-inspector>div>small{color:#809ca3;line-height:1.4}
    body.god99-editor-open #studio-world-hud{opacity:.22;pointer-events:none}
    @media(max-width:850px){#god99-scene-editor{inset:12px}.g99-body{grid-template-columns:1fr}.g99-inspector{border-top:1px solid #1d4650}.g99-library{border-right:0;max-height:46vh}}
  `;
  document.head.append(style);

  const libraryNode=panel.querySelector('[data-g99-library]');
  const categoryNode=panel.querySelector('[data-g99-category]');
  const searchNode=panel.querySelector('[data-g99-search]');
  const fieldsNode=panel.querySelector('[data-g99-fields]');
  const emptyNode=panel.querySelector('[data-g99-empty]');
  const selectedNameNode=panel.querySelector('[data-g99-selected-name]');
  const scenesNode=panel.querySelector('[data-g99-scenes]');
  const sceneNameNode=panel.querySelector('[data-g99-scene-name]');

  const primitiveCatalog=[
    {id:'primitive-cube',label:'Bloc / caisse simple',category:'structure',primitive:'cube'},
    {id:'primitive-platform',label:'Plateforme',category:'structure',primitive:'platform'},
    {id:'primitive-wall',label:'Mur / panneau',category:'structure',primitive:'wall'},
    {id:'primitive-pillar',label:'Poteau',category:'structure',primitive:'pillar'},
    {id:'primitive-light',label:'Lampe',category:'light',primitive:'light'},
  ];

  function catalog(){
    const seen=new Set();
    const items=[];
    for(const p of primitiveCatalog){seen.add(p.id);items.push(p);}
    if(Array.isArray(window.shopItems)){
      for(const item of shopItems){
        if(!item?.id||seen.has(item.id))continue;
        if(item.category==='vjloop'||item.category==='housing')continue;
        if(!window.ItemModels?.create)continue;
        seen.add(item.id);items.push({id:item.id,label:item.label||item.id,category:item.category||item.type||'jeu',shopItem:item});
      }
    }
    if(Array.isArray(window.God99EditorObjects)){
      for(const item of window.God99EditorObjects){if(item?.id&&!seen.has(item.id)){seen.add(item.id);items.push(item);}}
    }
    return items.sort((a,b)=>String(a.label).localeCompare(String(b.label),'fr'));
  }

  function renderLibrary(){
    const all=catalog();
    const categories=[...new Set(all.map(i=>i.category||'autre'))].sort();
    const previous=categoryNode.value||'all';
    categoryNode.innerHTML='<option value="all">Tous les objets</option>'+categories.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('');
    if([...categoryNode.options].some(o=>o.value===previous))categoryNode.value=previous;
    const q=searchNode.value.trim().toLowerCase(),cat=categoryNode.value;
    const visible=all.filter(i=>(cat==='all'||i.category===cat)&&(!q||`${i.label} ${i.id} ${i.category}`.toLowerCase().includes(q)));
    libraryNode.replaceChildren();
    for(const item of visible){
      const b=document.createElement('button');b.type='button';b.className='g99-object';
      b.innerHTML=`<b>${esc(item.label)}</b><small>${esc(item.category||'objet')}</small>`;
      b.onclick=()=>addObject(item.id);
      libraryNode.append(b);
    }
    if(!visible.length)libraryNode.innerHTML='<small>Aucun objet trouvé.</small>';
  }

  function primitive(id){
    const material=new THREE.MeshStandardMaterial({color:0x657079,roughness:.76,metalness:.12});
    let mesh;
    if(id==='primitive-platform')mesh=new THREE.Mesh(new THREE.BoxGeometry(2.4,.18,1.6),material);
    else if(id==='primitive-wall')mesh=new THREE.Mesh(new THREE.BoxGeometry(2.8,2.4,.16),material);
    else if(id==='primitive-pillar')mesh=new THREE.Mesh(new THREE.BoxGeometry(.35,2.5,.35),material);
    else if(id==='primitive-light'){
      const g=new THREE.Group(),body=new THREE.Mesh(new THREE.CylinderGeometry(.14,.2,.28,16),material);body.rotation.x=Math.PI/2;g.add(body);const lamp=new THREE.PointLight(0xffddb0,1.1,5);lamp.position.y=.15;g.add(lamp);mesh=g;
    } else mesh=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),material);
    return mesh;
  }

  function createModel(catalogId){
    const entry=catalog().find(x=>x.id===catalogId);
    if(!entry)return null;
    let model=null;
    try{
      if(entry.primitive)model=primitive(entry.id);
      else if(entry.shopItem&&window.ItemModels?.create)model=ItemModels.create(entry.shopItem);
      else if(typeof entry.create==='function')model=entry.create();
    }catch(err){console.warn('GOD99 editor object failed',entry,err);}
    if(!model)return null;
    model.userData.god99EditorObject=true;
    model.userData.catalogId=entry.id;
    model.userData.editorLabel=entry.label||entry.id;
    model.userData.editorUid=`g99-${Date.now()}-${objectSerial++}`;
    model.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.userData.god99Owner=model.userData.editorUid;}});
    return model;
  }

  function suggestedPosition(){
    const origin=camera.position.clone(),dir=new THREE.Vector3();camera.getWorldDirection(dir);
    const point=origin.clone().add(dir.multiplyScalar(2.3));
    point.x=clamp(point.x,-5.9,5.9);point.z=clamp(point.z,4.8,13.1);point.y=.2;
    return point;
  }

  function groundObject(model){
    model.updateMatrixWorld(true);
    const box=new THREE.Box3().setFromObject(model);
    if(Number.isFinite(box.min.y))model.position.y+=.17-box.min.y;
  }

  function addObject(id,record=null){
    const model=createModel(id);if(!model){notify?.('Objet indisponible dans l’éditeur.');return null;}
    group.add(model);
    if(record){
      model.position.set(Number(record.position?.x)||0,Number(record.position?.y)||.17,Number(record.position?.z)||8);
      model.rotation.y=Number(record.rotationY)||0;
      model.scale.setScalar(Math.max(.02,Number(record.scale)||1));
    }else{
      model.position.copy(suggestedPosition());
      groundObject(model);
    }
    select(model);saveAutosave();return model;
  }

  function select(model){
    selected=model&&model.parent===group?model:null;
    emptyNode.hidden=Boolean(selected);fieldsNode.hidden=!selected;
    if(!selected)return;
    selectedNameNode.textContent=selected.userData.editorLabel||selected.userData.catalogId||'Objet';
    syncFields();
  }
  function syncFields(){
    if(!selected)return;
    panel.querySelector('[data-prop="x"]').value=round(selected.position.x);
    panel.querySelector('[data-prop="y"]').value=round(selected.position.y);
    panel.querySelector('[data-prop="z"]').value=round(selected.position.z);
    panel.querySelector('[data-prop="rotation"]').value=round(THREE.MathUtils.radToDeg(selected.rotation.y));
    panel.querySelector('[data-prop="scale"]').value=round(selected.scale.x);
  }
  panel.querySelectorAll('[data-prop]').forEach(input=>input.addEventListener('input',()=>{
    if(!selected)return;const prop=input.dataset.prop,value=Number(input.value);if(!Number.isFinite(value))return;
    if(prop==='x')selected.position.x=clamp(value,-6.1,6.1);
    if(prop==='y')selected.position.y=clamp(value,-1,8);
    if(prop==='z')selected.position.z=clamp(value,4.4,13.45);
    if(prop==='rotation')selected.rotation.y=THREE.MathUtils.degToRad(value);
    if(prop==='scale')selected.scale.setScalar(clamp(value,.02,20));
    saveAutosave();
  }));

  function removeSelected(){if(!selected)return;const target=selected;select(null);group.remove(target);disposeObject(target);saveAutosave();}
  function disposeObject(root){root.traverse(o=>{o.geometry?.dispose?.();if(o.material){const mats=Array.isArray(o.material)?o.material:[o.material];for(const m of mats){for(const v of Object.values(m))if(v?.isTexture)v.dispose?.();m.dispose?.();}}});}
  function duplicateSelected(){if(!selected)return;const r=serializeObject(selected),copy=addObject(r.catalogId,r);if(copy){copy.position.x+=.45;copy.position.z+=.45;syncFields();saveAutosave();}}

  function serializeObject(o){return {catalogId:o.userData.catalogId,label:o.userData.editorLabel,position:{x:round(o.position.x),y:round(o.position.y),z:round(o.position.z)},rotationY:round(o.rotation.y),scale:round(o.scale.x)};}
  function serialize(name=sceneNameNode.value||'Garage GOD99'){return {version:1,name,createdAt:new Date().toISOString(),objects:group.children.filter(o=>o.userData.god99EditorObject).map(serializeObject)};}
  function clearScene(){select(null);for(const child of [...group.children]){group.remove(child);disposeObject(child);}}
  function loadScene(data){if(!data||!Array.isArray(data.objects))return false;clearScene();for(const record of data.objects)addObject(record.catalogId,record);sceneNameNode.value=data.name||sceneNameNode.value;saveAutosave();return true;}

  function storedScenes(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')||{};}catch{return {};}}
  function writeScenes(data){localStorage.setItem(STORAGE_KEY,JSON.stringify(data));refreshSceneList();}
  function refreshSceneList(){const scenes=storedScenes(),names=Object.keys(scenes).sort();scenesNode.innerHTML=names.length?names.map(n=>`<option>${esc(n)}</option>`).join(''):'<option value="">Aucune scène</option>';}
  function saveNamed(){const name=(sceneNameNode.value||'Garage GOD99').trim();const scenes=storedScenes();scenes[name]=serialize(name);writeScenes(scenes);localStorage.setItem(`${STORAGE_KEY}:autosave`,JSON.stringify(scenes[name]));notify?.(`Scène « ${name} » sauvegardée.`);}
  function saveAutosave(){try{localStorage.setItem(`${STORAGE_KEY}:autosave`,JSON.stringify(serialize('Autosave GOD99')));}catch{}}
  function loadNamed(){const data=storedScenes()[scenesNode.value];if(data&&loadScene(data))notify?.(`Scène « ${data.name} » chargée.`);}
  function exportScene(){const data=serialize();const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${String(data.name||'god99-scene').replace(/[^a-z0-9_-]+/gi,'-').toLowerCase()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
  async function importScene(file){try{const data=JSON.parse(await file.text());if(!loadScene(data))throw new Error('format');notify?.(`Scène « ${data.name||file.name} » importée.`);}catch{notify?.('Ce fichier de scène est invalide.');}}

  function setOpen(value){
    if(value&&!allowed()){notify?.('L’éditeur est réservé au VJ GOD99.');return;}
    open=Boolean(value);panel.hidden=!open;document.body.classList.toggle('god99-editor-open',open);
    if(open){renderLibrary();refreshSceneList();suppressCanvasClick=true;setTimeout(()=>suppressCanvasClick=false,100);}
    else select(null);
  }

  function findRoot(hit){let o=hit;while(o&&o.parent!==group)o=o.parent;return o?.parent===group?o:null;}
  canvas.addEventListener('pointerup',event=>{
    if(!open||suppressCanvasClick||event.button!==0)return;
    const rect=canvas.getBoundingClientRect(),mouse=new THREE.Vector2((event.clientX-rect.left)/rect.width*2-1,-((event.clientY-rect.top)/rect.height)*2+1),ray=new THREE.Raycaster();ray.setFromCamera(mouse,camera);
    const hits=ray.intersectObjects(group.children,true);select(hits.length?findRoot(hits[0].object):null);
  },true);

  window.addEventListener('keydown',event=>{
    if(event.repeat||event.target?.matches?.('input,textarea,select'))return;
    if((event.key==='x'||event.key==='X')&&allowed()&&walking()){event.preventDefault();event.stopImmediatePropagation();setOpen(!open);return;}
    if(!open||!selected)return;
    const k=event.key.toLowerCase();
    if(event.key==='Delete'||event.key==='Backspace'){event.preventDefault();removeSelected();return;}
    if(k==='d'){event.preventDefault();duplicateSelected();return;}
    const step=event.shiftKey?.5:.1;
    if(k==='q')selected.rotation.y+=THREE.MathUtils.degToRad(event.shiftKey?15:5);
    else if(k==='e')selected.rotation.y-=THREE.MathUtils.degToRad(event.shiftKey?15:5);
    else if(event.key==='ArrowLeft')selected.position.x-=step;
    else if(event.key==='ArrowRight')selected.position.x+=step;
    else if(event.key==='ArrowUp')selected.position.z-=step;
    else if(event.key==='ArrowDown')selected.position.z+=step;
    else return;
    event.preventDefault();selected.position.x=clamp(selected.position.x,-6.1,6.1);selected.position.z=clamp(selected.position.z,4.4,13.45);syncFields();saveAutosave();
  },true);

  panel.querySelector('[data-g99-close]').onclick=()=>setOpen(false);
  panel.querySelector('[data-g99-save]').onclick=saveNamed;
  panel.querySelector('[data-g99-load]').onclick=loadNamed;
  panel.querySelector('[data-g99-export]').onclick=exportScene;
  panel.querySelector('[data-g99-import]').onchange=e=>{const f=e.target.files?.[0];if(f)importScene(f);e.target.value='';};
  panel.querySelector('[data-g99-delete]').onclick=removeSelected;
  panel.querySelector('[data-g99-duplicate]').onclick=duplicateSelected;
  panel.querySelector('[data-g99-floor]').onclick=()=>{if(selected){groundObject(selected);syncFields();saveAutosave();}};
  searchNode.oninput=renderLibrary;categoryNode.onchange=renderLibrary;

  // Restore editor-created objects only for GOD99. The regular game remains untouched for every other career.
  let restoredFor=null;
  function tick(){
    if(open&&(!allowed()||!walking()))setOpen(false);
    const key=allowed()?`${profileName()}|${profile?.created?'1':'0'}`:null;
    if(key&&key!==restoredFor){restoredFor=key;try{const data=JSON.parse(localStorage.getItem(`${STORAGE_KEY}:autosave`)||'null');if(data?.objects?.length)loadScene(data);}catch{}}
    group.visible=Boolean(profile?.created&&allowed()&&walking());
  }
  function loop(){tick();requestAnimationFrame(loop);}requestAnimationFrame(loop);

  return {group,allowed,setOpen,serialize,loadScene,addObject,renderLibrary,get isOpen(){return open;}};
})();
