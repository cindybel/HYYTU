/* GOD99 in-game scene editor. X toggles it while walking in the studio. */
window.God99SceneEditor=(()=>{
  const STORAGE_KEY='hyyu-god99-scenes-v1';
  const editorGroup=new THREE.Group();
  editorGroup.name='GOD99 Scene Editor Objects';
  scene.add(editorGroup);

  let opened=false;
  let selected=null;
  let serial=1;

  const clamp=(v,min,max)=>Math.max(min,Math.min(max,Number(v)||0));
  const round=v=>Math.round((Number(v)||0)*1000)/1000;
  const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,ch=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  }[ch]));

  function getProfileName(){
    const p=typeof profile!=='undefined'?profile:null;
    return String(
      p?.vjName||p?.name||p?.displayName||p?.character?.name||
      document.querySelector('#vj-name')?.value||''
    ).trim();
  }

  function allowed(){return /god\s*99/i.test(getProfileName());}
  function isWalking(){return document.body.classList.contains('studio-world-view');}
  function notifyUser(text){if(typeof notify==='function')notify(text);else console.info(text);}

  const panel=document.createElement('section');
  panel.id='god99-scene-editor';
  panel.hidden=true;
  panel.innerHTML=`
    <div class="g99-shell">
      <header class="g99-head">
        <div><small>GOD99</small><h2>Éditeur de scène</h2><p>Ajoute, place et sauvegarde les objets directement dans le garage.</p></div>
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
          <div data-g99-empty>Sélectionne un objet ou ajoute-en un.</div>
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
            <small>Suppr = supprimer · D = dupliquer · Q/E = rotation · flèches = déplacer.</small>
          </div>
          <div class="g99-scenes">
            <strong>SCÈNES SAUVEGARDÉES</strong>
            <select data-g99-scenes></select>
            <input data-g99-scene-name placeholder="Nom de la scène" value="Garage GOD99">
          </div>
        </aside>
      </div>
    </div>`;
  document.body.append(panel);

  const style=document.createElement('style');
  style.textContent=`
    #god99-scene-editor{position:fixed;inset:58px 24px 24px;z-index:1400;color:#e7f9f6;font-family:Arial,sans-serif}
    #god99-scene-editor[hidden]{display:none}
    .g99-shell{height:100%;display:grid;grid-template-rows:auto auto 1fr;background:#081219f4;border:1px solid #2b7780;border-radius:14px;box-shadow:0 30px 90px #000b;overflow:hidden}
    .g99-head{display:flex;justify-content:space-between;gap:20px;padding:14px 18px;border-bottom:1px solid #214b54;background:#0b1b24}.g99-head h2{margin:2px 0 3px;font-size:22px}.g99-head p{margin:0;color:#92aeb5;font-size:12px}.g99-head small{color:#4cf0dd;font-weight:900;letter-spacing:.18em}.g99-head button{width:40px;height:40px;border:1px solid #355c65;border-radius:8px;background:#142a34;color:white;font-size:25px;cursor:pointer}
    .g99-toolbar{display:flex;gap:8px;align-items:center;padding:10px 14px;border-bottom:1px solid #1d4650;flex-wrap:wrap}.g99-toolbar input[type=search],.g99-toolbar select,.g99-toolbar button,.g99-import{min-height:36px;border:1px solid #315965;border-radius:6px;background:#10242e;color:#e8f7f5;padding:7px 10px;font:inherit}.g99-toolbar input[type=search]{min-width:230px}.g99-toolbar button,.g99-import{cursor:pointer}.g99-import input{display:none}
    .g99-body{min-height:0;display:grid;grid-template-columns:minmax(360px,1fr) 300px}.g99-library{min-height:0;padding:12px;overflow:auto;border-right:1px solid #1d4650}.g99-library>strong,.g99-scenes>strong{display:block;margin-bottom:8px;color:#57eadc;font-size:11px;letter-spacing:.12em}.g99-library [data-g99-library]{display:grid;grid-template-columns:repeat(auto-fill,minmax(145px,1fr));gap:8px}.g99-object{display:grid;gap:4px;text-align:left;padding:9px;border:1px solid #244d58;border-radius:7px;background:#10242d;color:#e7f5f3;cursor:pointer}.g99-object:hover{border-color:#4ad7c9;background:#16313b}.g99-object small{color:#87a9af;font-size:10px}.g99-object b{font-size:12px}
    .g99-inspector{padding:14px;overflow:auto;background:#0b1820}.g99-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0}.g99-grid label{display:grid;gap:4px;color:#9db7bd;font-size:10px}.g99-grid input,.g99-scenes input,.g99-scenes select{width:100%;box-sizing:border-box;border:1px solid #2a5660;border-radius:5px;background:#09161d;color:white;padding:8px}.g99-actions{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:9px}.g99-actions button{border:1px solid #315b65;border-radius:5px;background:#17303a;color:white;padding:8px;cursor:pointer}.g99-actions [data-g99-delete]{border-color:#824852;background:#321820}.g99-scenes{display:grid;gap:7px;margin-top:22px;padding-top:12px;border-top:1px solid #20434d}.g99-inspector small{color:#809ca3;line-height:1.4}
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

  const primitives=[
    {id:'primitive-cube',label:'Bloc / caisse simple',category:'Structure'},
    {id:'primitive-platform',label:'Plateforme',category:'Structure'},
    {id:'primitive-wall',label:'Mur / panneau',category:'Structure'},
    {id:'primitive-pillar',label:'Poteau',category:'Structure'},
    {id:'primitive-light',label:'Lampe',category:'Lumière'}
  ];

  function getShopItems(){
    try{return typeof shopItems!=='undefined'&&Array.isArray(shopItems)?shopItems:[];}catch{return [];}
  }

  function catalog(){
    const list=primitives.map(x=>({...x,primitive:true}));
    const seen=new Set(list.map(x=>x.id));
    for(const item of getShopItems()){
      if(!item?.id||seen.has(item.id)||item.category==='vjloop'||item.category==='housing')continue;
      if(!window.ItemModels?.create)continue;
      seen.add(item.id);
      list.push({id:item.id,label:item.label||item.id,category:item.category||item.type||'Jeu',shopItem:item});
    }
    if(Array.isArray(window.God99EditorObjects)){
      for(const item of window.God99EditorObjects){
        if(item?.id&&!seen.has(item.id)){seen.add(item.id);list.push(item);}
      }
    }
    return list.sort((a,b)=>String(a.label).localeCompare(String(b.label),'fr'));
  }

  function renderLibrary(){
    const all=catalog();
    const oldCategory=categoryNode.value||'all';
    const categories=[...new Set(all.map(x=>x.category||'Autre'))].sort();
    categoryNode.innerHTML='<option value="all">Tous les objets</option>'+categories.map(c=>`<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
    if([...categoryNode.options].some(o=>o.value===oldCategory))categoryNode.value=oldCategory;
    const term=searchNode.value.trim().toLowerCase();
    const category=categoryNode.value;
    const visible=all.filter(item=>(category==='all'||item.category===category)&&(!term||`${item.label} ${item.id} ${item.category}`.toLowerCase().includes(term)));
    libraryNode.replaceChildren();
    for(const item of visible){
      const button=document.createElement('button');
      button.type='button';button.className='g99-object';
      button.innerHTML=`<b>${escapeHtml(item.label)}</b><small>${escapeHtml(item.category||'Objet')}</small>`;
      button.onclick=()=>addObject(item.id);
      libraryNode.append(button);
    }
    if(!visible.length)libraryNode.innerHTML='<small>Aucun objet trouvé.</small>';
  }

  function createPrimitive(id){
    const material=new THREE.MeshStandardMaterial({color:0x657079,roughness:.76,metalness:.12});
    if(id==='primitive-platform')return new THREE.Mesh(new THREE.BoxGeometry(2.4,.18,1.6),material);
    if(id==='primitive-wall')return new THREE.Mesh(new THREE.BoxGeometry(2.8,2.4,.16),material);
    if(id==='primitive-pillar')return new THREE.Mesh(new THREE.BoxGeometry(.35,2.5,.35),material);
    if(id==='primitive-light'){
      const holder=new THREE.Group();
      const body=new THREE.Mesh(new THREE.CylinderGeometry(.14,.2,.28,16),material);body.rotation.x=Math.PI/2;holder.add(body);
      const light=new THREE.PointLight(0xffddb0,1.1,5);light.position.y=.15;holder.add(light);
      return holder;
    }
    return new THREE.Mesh(new THREE.BoxGeometry(1,1,1),material);
  }

  function createModel(catalogId){
    const entry=catalog().find(x=>x.id===catalogId);if(!entry)return null;
    let model=null;
    try{
      if(entry.primitive)model=createPrimitive(entry.id);
      else if(entry.shopItem&&window.ItemModels?.create)model=ItemModels.create(entry.shopItem);
      else if(typeof entry.create==='function')model=entry.create();
    }catch(error){console.warn('GOD99 object error',error);}
    if(!model)return null;
    model.userData.god99EditorObject=true;
    model.userData.catalogId=entry.id;
    model.userData.editorLabel=entry.label||entry.id;
    model.userData.editorUid=`g99-${Date.now()}-${serial++}`;
    model.traverse(node=>{if(node.isMesh){node.castShadow=true;node.receiveShadow=true;}});
    return model;
  }

  function groundObject(model){
    model.updateMatrixWorld(true);
    const bounds=new THREE.Box3().setFromObject(model);
    if(Number.isFinite(bounds.min.y))model.position.y+=.17-bounds.min.y;
  }

  function suggestedPosition(){
    const point=camera.position.clone();
    const direction=new THREE.Vector3();camera.getWorldDirection(direction);point.add(direction.multiplyScalar(2.3));
    point.x=clamp(point.x,-5.9,5.9);point.y=.2;point.z=clamp(point.z,4.8,13.1);return point;
  }

  function selectObject(model){
    selected=model&&model.parent===editorGroup?model:null;
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

  function serializeObject(object){return {
    catalogId:object.userData.catalogId,
    label:object.userData.editorLabel,
    position:{x:round(object.position.x),y:round(object.position.y),z:round(object.position.z)},
    rotationY:round(object.rotation.y),scale:round(object.scale.x)
  };}

  function serialize(name=sceneNameNode.value||'Garage GOD99'){return {
    version:1,name,createdAt:new Date().toISOString(),
    objects:editorGroup.children.filter(x=>x.userData.god99EditorObject).map(serializeObject)
  };}

  function addObject(id,record=null){
    const model=createModel(id);if(!model){notifyUser('Objet indisponible dans l’éditeur.');return null;}
    editorGroup.add(model);
    if(record){
      model.position.set(Number(record.position?.x)||0,Number(record.position?.y)||.17,Number(record.position?.z)||8);
      model.rotation.y=Number(record.rotationY)||0;model.scale.setScalar(Math.max(.02,Number(record.scale)||1));
    }else{model.position.copy(suggestedPosition());groundObject(model);}
    selectObject(model);saveAutosave();return model;
  }

  function disposeObject(root){
    root.traverse(node=>{
      node.geometry?.dispose?.();
      if(node.material){
        const materials=Array.isArray(node.material)?node.material:[node.material];
        for(const material of materials){
          for(const value of Object.values(material))if(value?.isTexture)value.dispose?.();
          material.dispose?.();
        }
      }
    });
  }

  function removeSelected(){if(!selected)return;const target=selected;selectObject(null);editorGroup.remove(target);disposeObject(target);saveAutosave();}
  function duplicateSelected(){if(!selected)return;const data=serializeObject(selected),copy=addObject(data.catalogId,data);if(copy){copy.position.x+=.45;copy.position.z+=.45;syncFields();saveAutosave();}}
  function clearScene(){selectObject(null);for(const child of [...editorGroup.children]){editorGroup.remove(child);disposeObject(child);}}
  function loadScene(data){if(!data||!Array.isArray(data.objects))return false;clearScene();for(const item of data.objects)addObject(item.catalogId,item);sceneNameNode.value=data.name||sceneNameNode.value;saveAutosave();return true;}

  function storedScenes(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')||{};}catch{return {};}}
  function refreshSceneList(){const names=Object.keys(storedScenes()).sort();scenesNode.innerHTML=names.length?names.map(n=>`<option>${escapeHtml(n)}</option>`).join(''):'<option value="">Aucune scène</option>';}
  function saveNamed(){const name=(sceneNameNode.value||'Garage GOD99').trim();const scenes=storedScenes();scenes[name]=serialize(name);localStorage.setItem(STORAGE_KEY,JSON.stringify(scenes));localStorage.setItem(`${STORAGE_KEY}:autosave`,JSON.stringify(scenes[name]));refreshSceneList();notifyUser(`Scène « ${name} » sauvegardée.`);}
  function loadNamed(){const data=storedScenes()[scenesNode.value];if(data&&loadScene(data))notifyUser(`Scène « ${data.name} » chargée.`);}
  function saveAutosave(){try{localStorage.setItem(`${STORAGE_KEY}:autosave`,JSON.stringify(serialize('Autosave GOD99')));}catch{}}
  function exportScene(){const data=serialize();const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=`${String(data.name||'god99-scene').replace(/[^a-z0-9_-]+/gi,'-').toLowerCase()}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  async function importScene(file){try{const data=JSON.parse(await file.text());if(!loadScene(data))throw new Error('format');notifyUser(`Scène « ${data.name||file.name} » importée.`);}catch{notifyUser('Ce fichier de scène est invalide.');}}

  function setOpen(value){
    if(value&&!allowed()){notifyUser('L’éditeur est réservé au VJ GOD99.');return;}
    opened=Boolean(value);panel.hidden=!opened;document.body.classList.toggle('god99-editor-open',opened);
    if(opened){renderLibrary();refreshSceneList();}else selectObject(null);
  }

  function findEditorRoot(object){let node=object;while(node&&node.parent!==editorGroup)node=node.parent;return node?.parent===editorGroup?node:null;}

  canvas.addEventListener('pointerup',event=>{
    if(!opened||event.button!==0||panel.contains(event.target))return;
    const rect=canvas.getBoundingClientRect();
    const mouse=new THREE.Vector2((event.clientX-rect.left)/rect.width*2-1,-((event.clientY-rect.top)/rect.height)*2+1);
    const raycaster=new THREE.Raycaster();raycaster.setFromCamera(mouse,camera);
    const hits=raycaster.intersectObjects(editorGroup.children,true);selectObject(hits.length?findEditorRoot(hits[0].object):null);
  },true);

  window.addEventListener('keydown',event=>{
    if(event.repeat||event.target?.matches?.('input,textarea,select'))return;
    if((event.key==='x'||event.key==='X')&&allowed()&&isWalking()){
      event.preventDefault();event.stopImmediatePropagation();setOpen(!opened);return;
    }
    if(!opened||!selected)return;
    const key=event.key.toLowerCase();
    if(event.key==='Delete'||event.key==='Backspace'){event.preventDefault();removeSelected();return;}
    if(key==='d'){event.preventDefault();duplicateSelected();return;}
    const step=event.shiftKey ? 0.5 : 0.1;
    if(key==='q')selected.rotation.y+=THREE.MathUtils.degToRad(event.shiftKey?15:5);
    else if(key==='e')selected.rotation.y-=THREE.MathUtils.degToRad(event.shiftKey?15:5);
    else if(event.key==='ArrowLeft')selected.position.x-=step;
    else if(event.key==='ArrowRight')selected.position.x+=step;
    else if(event.key==='ArrowUp')selected.position.z-=step;
    else if(event.key==='ArrowDown')selected.position.z+=step;
    else return;
    event.preventDefault();selected.position.x=clamp(selected.position.x,-6.1,6.1);selected.position.z=clamp(selected.position.z,4.4,13.45);syncFields();saveAutosave();
  },true);

  panel.querySelectorAll('[data-prop]').forEach(input=>input.addEventListener('input',()=>{
    if(!selected)return;const value=Number(input.value);if(!Number.isFinite(value))return;
    const prop=input.dataset.prop;
    if(prop==='x')selected.position.x=clamp(value,-6.1,6.1);
    else if(prop==='y')selected.position.y=clamp(value,-1,8);
    else if(prop==='z')selected.position.z=clamp(value,4.4,13.45);
    else if(prop==='rotation')selected.rotation.y=THREE.MathUtils.degToRad(value);
    else if(prop==='scale')selected.scale.setScalar(clamp(value,.02,20));
    saveAutosave();
  }));

  panel.querySelector('[data-g99-close]').onclick=()=>setOpen(false);
  panel.querySelector('[data-g99-save]').onclick=saveNamed;
  panel.querySelector('[data-g99-load]').onclick=loadNamed;
  panel.querySelector('[data-g99-export]').onclick=exportScene;
  panel.querySelector('[data-g99-import]').onchange=event=>{const file=event.target.files?.[0];if(file)importScene(file);event.target.value='';};
  panel.querySelector('[data-g99-delete]').onclick=removeSelected;
  panel.querySelector('[data-g99-duplicate]').onclick=duplicateSelected;
  panel.querySelector('[data-g99-floor]').onclick=()=>{if(selected){groundObject(selected);syncFields();saveAutosave();}};
  searchNode.oninput=renderLibrary;categoryNode.onchange=renderLibrary;

  let restoredFor=null;
  function tick(){
    if(opened&&(!allowed()||!isWalking()))setOpen(false);
    const p=typeof profile!=='undefined'?profile:null;
    const key=allowed()?`${getProfileName()}|${p?.created?'1':'0'}`:null;
    if(key&&key!==restoredFor){
      restoredFor=key;
      try{const data=JSON.parse(localStorage.getItem(`${STORAGE_KEY}:autosave`)||'null');if(data?.objects?.length)loadScene(data);}catch{}
    }
    editorGroup.visible=Boolean(p?.created&&allowed()&&isWalking());
  }
  function loop(){tick();requestAnimationFrame(loop);}requestAnimationFrame(loop);

  return {group:editorGroup,allowed,setOpen,serialize,loadScene,addObject,renderLibrary,get isOpen(){return opened;}};
})();
