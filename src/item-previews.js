/* Product photographs are rendered from the canonical in-game catalogue models. */
window.ItemPreviews=(()=>{
 const cache=new Map(),images=new Map(),queue=[];let renderer=null,stage=null,busy=false;
 function loadImage(url){if(!images.has(url))images.set(url,new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('Poster unavailable'));image.src=window.VJAssetUrl?.(url)||url;}));return images.get(url);}
 async function paintPack(canvas,item){
  await ClipCollections.ready;const clips=ClipCollections.contents(item).slice(0,4);if(!clips.length)throw new Error('Empty collection');
  const posters=await Promise.all(clips.map(c=>loadImage(c.poster)));canvas.width=640;canvas.height=480;const c=canvas.getContext('2d');
  c.fillStyle='#101c29';c.fillRect(0,0,640,480);c.fillStyle='#a7d8d2';c.font='600 16px Arial';c.fillText('COLLECTION VJ · IMAGES DES CLIPS',20,30);
  posters.forEach((image,i)=>{const x=16+(i%2)*308,y=48+Math.floor(i/2)*173,w=300,h=165,scale=Math.max(w/image.width,h/image.height),sw=w/scale,sh=h/scale;c.drawImage(image,(image.width-sw)/2,(image.height-sh)/2,sw,sh,x,y,w,h);});
  c.fillStyle='#eef4ef';c.font='bold 23px Arial';c.fillText(item.label,20,427,600);c.font='16px Arial';c.fillStyle='#b8c9d3';c.fillText(`${ClipCollections.contents(item).length} clips · niveau ${clips[0].requiredLevel}`,20,456);
  return clips.map(c=>c.id||c.src);
 }
 function dispose(group){const geometries=new Set(),materials=new Set(),textures=new Set();group.traverse(o=>{if(o.geometry)geometries.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:o.material?[o.material]:[]){materials.add(m);for(const t of Object.values(m))if(t?.isTexture)textures.add(t);}});textures.forEach(x=>x.dispose());materials.forEach(x=>x.dispose());geometries.forEach(x=>x.dispose());}
 function photograph(item){
  if(!renderer){renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setSize(640,480);renderer.setPixelRatio(1);stage=ProductStage.create(renderer);}
  stage.set(item);stage.resize(640,480);stage.render();return renderer.domElement.toDataURL('image/png');
 }
 async function work(){if(busy)return;busy=true;while(queue.length){const {item,resolve,reject}=queue.shift();try{if(item.category==='vjloop'){const canvas=document.createElement('canvas');await paintPack(canvas,item);resolve(canvas.toDataURL('image/png'));}else resolve(photograph(item));}catch(e){reject(e);}await new Promise(r=>setTimeout(r,16));}busy=false;}
 function get(id){if(!cache.has(id)){const item=shopItems.find(i=>i.id===id);if(!item)return Promise.reject(new Error('Unknown item'));const promise=new Promise((resolve,reject)=>queue.push({item,resolve,reject}));cache.set(id,promise);work();}return cache.get(id);}
 async function fill(element){const id=element.dataset.itemPreview;try{const url=await get(id);if(!element.isConnected)return;const item=shopItems.find(i=>i.id===id),image=document.createElement('img');image.src=url;image.alt=item.category==='vjloop'?`Extraits des clips : ${item.label}`:`Vue du modèle 3D : ${item.label}`;image.decoding='async';image.dataset.catalogImage=id;element.replaceChildren(image);element.dataset.previewState='ready';}catch{element.dataset.previewState='error';element.textContent='Aperçu indisponible';}}
 const visible=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){visible.unobserve(entry.target);fill(entry.target);}},{rootMargin:'100px'});
 function decorate(){for(const element of appWindow.querySelectorAll('[data-item-preview]:not([data-preview-state])')){element.dataset.previewState='waiting';element.classList.add('catalog-photo');element.replaceChildren();element.textContent=element.classList.contains('explorer-item-image')?'…':'Chargement de l’aperçu…';visible.observe(element);}}
 new MutationObserver(decorate).observe(appWindow,{childList:true,subtree:true});decorate();
 return{get,paintPack,get cachedCount(){return cache.size}};
})();
