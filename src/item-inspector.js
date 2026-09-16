window.ItemInspector=(()=>{
 const dialog=document.createElement('dialog');dialog.className='item-inspector product-inspector';
 dialog.innerHTML='<header><div><small>ATAZONE / ATELIER 3D</small><h2></h2></div><button data-model-close>Fermer</button></header><div class="inspector-layout"><section><div data-model-view tabindex="0" role="img" aria-label="Objet en 3D. Glisser ou utiliser les flèches pour tourner."></div><div class="inspector-controls"><button data-model-angle="three-quarter">Vue ¾</button><button data-model-angle="front">Face</button><button data-model-angle="back">Dos</button><button data-model-reset>Réinitialiser</button><label><input type="checkbox" data-model-spin> Rotation</label><label>Zoom <input type="range" data-model-zoom min="65" max="160" value="100" aria-label="Distance de vue"></label></div><p class="inspector-help">Glisse pour tourner · molette pour zoomer · flèches au clavier</p></section><aside data-model-info></aside></div>';
 document.body.append(dialog);
 let renderer=null,stage=null,frame=0,last=0,drag=null,primary=null,compared=null,showingCompared=false,resizeObserver=null;
 const viewport=dialog.querySelector('[data-model-view]');
 function close(){cancelAnimationFrame(frame);resizeObserver?.disconnect();resizeObserver=null;drag=null;dialog.close();if(renderer){stage.close();renderer.dispose();renderer.forceContextLoss();renderer=null;stage=null;}viewport.replaceChildren();}
 function view(mode){stage.view(mode);dialog.querySelectorAll('[data-model-angle]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.modelAngle===mode)));}
 function reset(){dialog.querySelector('[data-model-zoom]').value=100;dialog.querySelector('[data-model-spin]').checked=false;stage.setZoom(1);view('three-quarter');}
 function resize(){if(!renderer)return;stage.resize(viewport.clientWidth,viewport.clientHeight);}
 function show(item){
  dialog.querySelector('h2').textContent=item.label;stage.set(item);resize();reset();
  const scope=item.category==='vjloop'?'Collection numérique · aperçu de sa pochette':item.category==='housing'?'Maquette du lieu':'Modèle utilisé dans le catalogue et les rangements';
  const stats=Object.entries(item.stats||{}),owned=profile.ownedItems.includes(item.id),equipped=item.category==='gear'&&profile.gear[item.type]===item.id.slice(item.type.length+1);
  const labels={technique:'Technique',creativity:'Créativité',reputation:'Réputation',style:'Style',network:'Réseau',professional:'Professionnalisme',gear:'Matériel',fatigue:'Fatigue'};
  dialog.querySelector('[data-model-info]').innerHTML=`<span class="inspector-status">${equipped?'Équipé':owned?'Dans ton inventaire':'Dans la boutique'}</span><p>${escapeHtml(item.description)}</p><p class="inspector-capability">${escapeHtml(GearCapabilities.describe(item)||scope)}</p><dl><div><dt>Prix</dt><dd>${item.cost}$</dd></div><div><dt>Déblocage</dt><dd>Niveau ${getItemUnlockLevel(item)}</dd></div>${stats.map(([k,v])=>`<div><dt>${escapeHtml(labels[k]||k)}</dt><dd>${v>0?'+':''}${v}</dd></div>`).join('')}</dl>${compared?`<div class="inspector-compare"><small>TON ÉQUIPEMENT ACTUEL</small><strong>${escapeHtml(compared.label)}</strong><button data-model-compare>${showingCompared?'Revenir à cet article':'Voir mon équipement en 3D'}</button></div>`:''}<small>${escapeHtml(scope)}</small>`;
  dialog.querySelector('[data-model-compare]')?.addEventListener('click',()=>{showingCompared=!showingCompared;show(showingCompared?compared:primary);});
 }
 function open(id){
  const item=shopItems.find(i=>i.id===id);if(!item)return;if(renderer)close();primary=item;showingCompared=false;
  compared=item.category==='gear'?shopItems.find(i=>i.id===item.type+'-'+profile.gear[item.type]&&i.id!==item.id):null;
  dialog.showModal();renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(1.5,devicePixelRatio));viewport.append(renderer.domElement);stage=ProductStage.create(renderer);show(item);
  resizeObserver=new ResizeObserver(resize);resizeObserver.observe(viewport);last=performance.now();
  function draw(now){if(!renderer)return;const dt=Math.min(.05,(now-last)/1000);last=now;if(!document.hidden){if(dialog.querySelector('[data-model-spin]').checked&&!drag)stage.pivot.rotation.y+=dt*.25;stage.render();}frame=requestAnimationFrame(draw);}frame=requestAnimationFrame(draw);
 }
 dialog.querySelector('[data-model-close]').onclick=close;dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
 dialog.querySelectorAll('[data-model-angle]').forEach(b=>b.onclick=()=>view(b.dataset.modelAngle));dialog.querySelector('[data-model-reset]').onclick=reset;
 dialog.querySelector('[data-model-zoom]').oninput=e=>stage?.setZoom(Number(e.target.value)/100);
 viewport.onpointerdown=e=>{drag={x:e.clientX,y:e.clientY};viewport.setPointerCapture(e.pointerId);viewport.focus();};
 viewport.onpointermove=e=>{if(!drag||!stage)return;stage.pivot.rotation.y+=(e.clientX-drag.x)*.008;stage.pivot.rotation.x=THREE.MathUtils.clamp(stage.pivot.rotation.x+(e.clientY-drag.y)*.006,-.6,.6);drag={x:e.clientX,y:e.clientY};};
 viewport.onpointerup=viewport.onpointercancel=()=>drag=null;
 viewport.addEventListener('wheel',e=>{e.preventDefault();const input=dialog.querySelector('[data-model-zoom]');input.value=THREE.MathUtils.clamp(Number(input.value)+(e.deltaY>0?5:-5),65,160);stage?.setZoom(Number(input.value)/100);},{passive:false});
 viewport.onkeydown=e=>{if(!stage||!e.key.startsWith('Arrow'))return;e.preventDefault();if(e.key==='ArrowLeft')stage.pivot.rotation.y-=.15;if(e.key==='ArrowRight')stage.pivot.rotation.y+=.15;if(e.key==='ArrowUp')stage.pivot.rotation.x=Math.max(-.6,stage.pivot.rotation.x-.1);if(e.key==='ArrowDown')stage.pivot.rotation.x=Math.min(.6,stage.pivot.rotation.x+.1);};
 function decorate(){
  for(const article of appWindow.querySelectorAll('article[data-detail],article[data-item-id]')){const id=article.dataset.detail||article.dataset.itemId;if(!article.querySelector('[data-item-3d]')){const b=document.createElement('button');b.type='button';b.setAttribute('data-item-3d',id);b.textContent='Explorer en 3D';b.onclick=e=>{e.stopPropagation();open(id);};(article.querySelector('.row-actions')||article).append(b);}}
  const actions=appWindow.querySelector('.product-detail-actions');if(actions&&!actions.querySelector('[data-item-3d]')){const id=appWindow.querySelector('[data-item-preview]')?.dataset.itemPreview;if(id){const b=document.createElement('button');b.setAttribute('data-item-3d',id);b.textContent='Explorer en 3D';b.onclick=()=>open(id);actions.prepend(b);}}
 }
 new MutationObserver(decorate).observe(appWindow,{childList:true,subtree:true});return{open,close,get model(){return stage?.model},get stage(){return stage}};
})();
