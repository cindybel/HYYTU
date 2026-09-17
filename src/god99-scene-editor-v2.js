/* GOD99 scene editor - integrated in the normal game. */
window.God99SceneEditor=(()=>{
 const KEY='hyyu-god99-scenes-v2';
 const root=new THREE.Group();root.name='GOD99 editor scene';scene.add(root);
 let opened=false,selected=null,serial=1,restored=false;
 const $=(s,p=document)=>p.querySelector(s), clamp=(n,a,b)=>Math.max(a,Math.min(b,Number(n)||0));
 const name=()=>String(profile?.vjName||profile?.name||profile?.displayName||profile?.character?.name||$('#vj-name')?.value||'');
 const allowed=()=>/god\s*99/i.test(name());
 const isWalking=()=>document.body.classList.contains('studio-world-view');
 const primitives=[
  {id:'editor-cube',label:'Bloc',category:'Structure'},
  {id:'editor-platform',label:'Plateforme',category:'Structure'},
  {id:'editor-wall',label:'Mur / panneau',category:'Structure'},
  {id:'editor-pillar',label:'Poteau',category:'Structure'},
  {id:'editor-light',label:'Lampe',category:'Lumière'}
 ];
 function gameItems(){
  const out=[...primitives],seen=new Set(out.map(x=>x.id));
  if(typeof shopItems!=='undefined'&&Array.isArray(shopItems)&&window.ItemModels?.create){
   for(const item of shopItems){
    if(!item?.id||seen.has(item.id)||item.category==='vjloop'||item.category==='housing')continue;
    seen.add(item.id);out.push({id:item.id,label:item.label||item.id,category:item.category||item.type||'Jeu',item});
   }
  }
  if(Array.isArray(window.God99EditorObjects))for(const entry of window.God99EditorObjects){if(entry?.id&&!seen.has(entry.id)){seen.add(entry.id);out.push(entry);}}
  return out;
 }
 function primitive(id){
  const mat=new THREE.MeshStandardMaterial({color:0x69747b,roughness:.75,metalness:.12});
  if(id==='editor-platform')return new THREE.Mesh(new THREE.BoxGeometry(2.4,.18,1.6),mat);
  if(id==='editor-wall')return new THREE.Mesh(new THREE.BoxGeometry(2.8,2.4,.16),mat);
  if(id==='editor-pillar')return new THREE.Mesh(new THREE.BoxGeometry(.35,2.5,.35),mat);
  if(id==='editor-light'){const g=new THREE.Group(),m=new THREE.Mesh(new THREE.CylinderGeometry(.15,.2,.28,16),mat);m.rotation.x=Math.PI/2;g.add(m);const l=new THREE.PointLight(0xffddb0,1.2,6);l.position.y=.25;g.add(l);return g;}
  return new THREE.Mesh(new THREE.BoxGeometry(1,1,1),mat);
 }
 function create(id){
  const entry=gameItems().find(x=>x.id===id);if(!entry)return null;let o=null;
  try{o=entry.id.startsWith('editor-')?primitive(entry.id):entry.item?ItemModels.create(entry.item):typeof entry.create==='function'?entry.create():null;}catch(e){console.warn('GOD99 object error',e);}
  if(!o)return null;o.userData.god99=true;o.userData.editorId=entry.id;o.userData.editorLabel=entry.label||entry.id;o.userData.editorUid=`god99-${serial++}`;
  o.traverse(n=>{if(n.isMesh){n.castShadow=true;n.receiveShadow=true;}});return o;
 }
 function spawnPoint(){const d=new THREE.Vector3();camera.getWorldDirection(d);const p=camera.position.clone().add(d.multiplyScalar(2.3));return new THREE.Vector3(clamp(p.x,-5.9,5.9),.2,clamp(p.z,4.8,13.1));}
 function floor(o){o.updateMatrixWorld(true);const b=new THREE.Box3().setFromObject(o);if(Number.isFinite(b.min.y))o.position.y+=.17-b.min.y;}
 function add(id,data){const o=create(id);if(!o){notify?.('Objet indisponible.');return;}root.add(o);if(data){o.position.set(Number(data.x)||0,Number(data.y)||.17,Number(data.z)||8);o.rotation.y=Number(data.r)||0;o.scale.setScalar(Math.max(.02,Number(data.s)||1));}else{o.position.copy(spawnPoint());floor(o);}pick(o);autosave();}
 function dispose(o){o.traverse(n=>{n.geometry?.dispose?.();if(n.material){const list=Array.isArray(n.material)?n.material:[n.material];list.forEach(m=>m.dispose?.());}});}
 function remove(){if(!selected)return;const o=selected;pick(null);root.remove(o);dispose(o);autosave();}
 function copy(){if(!selected)return;const d=record(selected);add(d.id,{...d,x:d.x+.4,z:d.z+.4});}
 function record(o){return{id:o.userData.editorId,x:+o.position.x.toFixed(3),y:+o.position.y.toFixed(3),z:+o.position.z.toFixed(3),r:+o.rotation.y.toFixed(4),s:+o.scale.x.toFixed(3)};}
 function data(sceneName){return{version:2,name:sceneName||$('#g99-scene-name')?.value||'Garage GOD99',objects:root.children.filter(o=>o.userData.god99).map(record)};}
 function clear(){pick(null);for(const o of [...root.children]){root.remove(o);dispose(o);}}
 function apply(d){if(!d?.objects)return false;clear();for(const x of d.objects)add(x.id,x);if($('#g99-scene-name')&&d.name)$('#g99-scene-name').value=d.name;autosave();return true;}
 function scenes(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{};}catch{return{};}}
 function refreshScenes(){const n=$('#g99-scenes');if(!n)return;const names=Object.keys(scenes());n.innerHTML=names.length?names.map(x=>`<option>${x.replace(/[<&]/g,'')}</option>`).join(''):'<option value="">Aucune scène</option>';}
 function autosave(){try{localStorage.setItem(KEY+':autosave',JSON.stringify(data('Autosave GOD99')));}catch{}}
 function save(){const n=($('#g99-scene-name')?.value||'Garage GOD99').trim(),all=scenes();all[n]=data(n);localStorage.setItem(KEY,JSON.stringify(all));refreshScenes();notify?.(`Scène ${n} sauvegardée.`);}
 function load(){const d=scenes()[$('#g99-scenes')?.value];if(d&&apply(d))notify?.(`Scène ${d.name} chargée.`);}
 function exportJson(){const d=data(),blob=new Blob([JSON.stringify(d,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=(d.name||'god99-scene').replace(/[^a-z0-9_-]+/gi,'-').toLowerCase()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
 async function importJson(file){try{const d=JSON.parse(await file.text());if(!apply(d))throw 0;notify?.('Scène importée.');}catch{notify?.('JSON de scène invalide.');}}

 const panel=document.createElement('section');panel.id='god99-editor';panel.hidden=true;panel.innerHTML=`<div class="g99"><header><div><small>GOD99</small><h2>Éditeur de scène</h2></div><button data-close>×</button></header><div class="bar"><input id="g99-search" placeholder="Chercher un objet"><select id="g99-category"><option value="all">Tous</option></select><input id="g99-scene-name" value="Garage GOD99"><button data-save>Sauvegarder</button><button data-load>Charger</button><select id="g99-scenes"></select><button data-export>Exporter JSON</button><label>Importer<input data-import type="file" accept=".json,application/json"></label></div><main><div class="library" data-library></div><aside><p data-empty>Sélectionne ou ajoute un objet.</p><div data-fields hidden><h3 data-title></h3><label>X<input data-p="x" type="number" step=".1"></label><label>Y<input data-p="y" type="number" step=".1"></label><label>Z<input data-p="z" type="number" step=".1"></label><label>Rotation<input data-p="r" type="number" step="5"></label><label>Échelle<input data-p="s" type="number" step=".05" min=".02"></label><button data-floor>Au sol</button><button data-copy>Dupliquer</button><button data-delete>Supprimer</button><small>Flèches : déplacer · Q/E : tourner · D : dupliquer · Suppr : supprimer</small></div></aside></main></div>`;document.body.append(panel);
 const css=document.createElement('style');css.textContent=`#god99-editor{position:fixed;inset:55px 20px 20px;z-index:1500;color:#eafbf8;font-family:Arial}#god99-editor[hidden]{display:none}.g99{height:100%;display:grid;grid-template-rows:auto auto 1fr;background:#07141bf4;border:1px solid #31717a;border-radius:12px;overflow:hidden;box-shadow:0 30px 90px #000c}.g99 header{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:#0d222b;border-bottom:1px solid #24505a}.g99 header h2{margin:2px 0}.g99 header small{color:#54e7d8;font-weight:900}.g99 header button{font-size:25px;width:40px;height:40px}.g99 button,.g99 input,.g99 select,.g99 label{background:#102a33;color:white;border:1px solid #315b65;border-radius:5px;padding:7px}.g99 button,.g99 label{cursor:pointer}.g99 .bar{display:flex;gap:7px;flex-wrap:wrap;padding:9px;border-bottom:1px solid #20444c}.g99 .bar label input{display:none}.g99 main{display:grid;grid-template-columns:1fr 290px;min-height:0}.g99 .library{padding:10px;overflow:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(145px,1fr));align-content:start;gap:7px}.g99 .library button{text-align:left;min-height:55px}.g99 aside{padding:12px;background:#0b1b22;overflow:auto}.g99 aside label{display:grid;grid-template-columns:75px 1fr;align-items:center;margin:6px 0}.g99 aside input{width:100%;box-sizing:border-box}.g99 aside button{margin:4px 2px}.g99 aside small{display:block;margin-top:10px;color:#8da9ae;line-height:1.4}@media(max-width:800px){#god99-editor{inset:8px}.g99 main{grid-template-columns:1fr}.g99 aside{max-height:40vh}}`;document.head.append(css);

 function render(){const all=gameItems(),search=$('#g99-search').value.toLowerCase(),cat=$('#g99-category').value,cats=[...new Set(all.map(x=>x.category))],old=cat;$('#g99-category').innerHTML='<option value="all">Tous</option>'+cats.map(c=>`<option>${String(c).replace(/[<&]/g,'')}</option>`).join('');if([...$('#g99-category').options].some(o=>o.value===old))$('#g99-category').value=old;const list=all.filter(x=>(cat==='all'||x.category===cat)&&(!search||(x.label+' '+x.id).toLowerCase().includes(search)));const host=$('[data-library]',panel);host.replaceChildren();for(const item of list){const b=document.createElement('button');b.innerHTML=`<b>${item.label}</b><br><small>${item.category}</small>`;b.onclick=()=>add(item.id);host.append(b);}}
 function pick(o){selected=o&&o.parent===root?o:null;$('[data-empty]',panel).hidden=!!selected;$('[data-fields]',panel).hidden=!selected;if(!selected)return;$('[data-title]',panel).textContent=selected.userData.editorLabel||selected.userData.editorId;sync();}
 function sync(){if(!selected)return;$('[data-p=x]',panel).value=selected.position.x.toFixed(2);$('[data-p=y]',panel).value=selected.position.y.toFixed(2);$('[data-p=z]',panel).value=selected.position.z.toFixed(2);$('[data-p=r]',panel).value=THREE.MathUtils.radToDeg(selected.rotation.y).toFixed(1);$('[data-p=s]',panel).value=selected.scale.x.toFixed(2);}
 panel.querySelectorAll('[data-p]').forEach(i=>i.oninput=()=>{if(!selected)return;const v=Number(i.value);if(!Number.isFinite(v))return;const p=i.dataset.p;if(p==='x')selected.position.x=clamp(v,-6.1,6.1);if(p==='y')selected.position.y=clamp(v,-1,8);if(p==='z')selected.position.z=clamp(v,4.4,13.45);if(p==='r')selected.rotation.y=THREE.MathUtils.degToRad(v);if(p==='s')selected.scale.setScalar(clamp(v,.02,20));autosave();});
 function toggle(value=!opened){if(value&&!allowed()){notify?.('Crée ou utilise le VJ GOD99 pour ouvrir cet éditeur.');return;}opened=!!value;panel.hidden=!opened;if(opened){render();refreshScenes();}else pick(null);}
 panel.querySelector('[data-close]').onclick=()=>toggle(false);panel.querySelector('[data-save]').onclick=save;panel.querySelector('[data-load]').onclick=load;panel.querySelector('[data-export]').onclick=exportJson;panel.querySelector('[data-import]').onchange=e=>{if(e.target.files?.[0])importJson(e.target.files[0]);e.target.value='';};panel.querySelector('[data-floor]').onclick=()=>{if(selected){floor(selected);sync();autosave();}};panel.querySelector('[data-copy]').onclick=copy;panel.querySelector('[data-delete]').onclick=remove;$('#g99-search').oninput=render;$('#g99-category').onchange=render;
 canvas.addEventListener('pointerup',e=>{if(!opened||e.button!==0)return;const r=canvas.getBoundingClientRect(),m=new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height)*2+1),ray=new THREE.Raycaster();ray.setFromCamera(m,camera);const hit=ray.intersectObjects(root.children,true)[0];if(!hit){pick(null);return;}let o=hit.object;while(o&&o.parent!==root)o=o.parent;pick(o?.parent===root?o:null);},true);
 window.addEventListener('keydown',e=>{if(e.target?.matches?.('input,textarea,select'))return;if(!e.repeat&&(e.key==='x'||e.key==='X')&&allowed()&&isWalking()){e.preventDefault();e.stopImmediatePropagation();toggle();return;}if(!opened||!selected)return;const k=e.key.toLowerCase(),step=e.shiftKey?.5:.1;if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();remove();return;}if(k==='d'){e.preventDefault();copy();return;}if(k==='q')selected.rotation.y+=THREE.MathUtils.degToRad(5);else if(k==='e')selected.rotation.y-=THREE.MathUtils.degToRad(5);else if(e.key==='ArrowLeft')selected.position.x-=step;else if(e.key==='ArrowRight')selected.position.x+=step;else if(e.key==='ArrowUp')selected.position.z-=step;else if(e.key==='ArrowDown')selected.position.z+=step;else return;e.preventDefault();sync();autosave();},true);
 function tick(){if(opened&&(!allowed()||!isWalking()))toggle(false);root.visible=allowed()&&isWalking();if(!restored&&allowed()&&profile?.created){restored=true;try{const d=JSON.parse(localStorage.getItem(KEY+':autosave')||'null');if(d?.objects?.length)apply(d);}catch{}}requestAnimationFrame(tick);}requestAnimationFrame(tick);
 return{root,toggle,add,data,apply,allowed,get opened(){return opened;}};
})();
