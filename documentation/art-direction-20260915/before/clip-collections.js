window.ClipCollections=(()=>{
 const ready=window.VJContent?Promise.resolve():new Promise(resolve=>{const script=document.createElement('script');script.src='./src/content-runtime.js?build=content-phase6';script.onload=resolve;script.onerror=resolve;document.head.append(script);});
 const dialog=document.createElement('dialog');dialog.className='item-inspector clip-collection-dialog';dialog.innerHTML='<header><div><small>BIBLIOTHÈQUE VISUELLE</small><h2>Mes clips et packs</h2></div><button data-clips-close>Fermer</button></header><p data-clips-intro>48 clips sont inclus dans le jeu. Les packs achetés sont des sélections thématiques de cette bibliothèque : ils organisent ton contenu, ils ne prétendent pas ajouter de faux fichiers.</p><label>Collection <select data-collection></select></label><div data-pack-summary></div><div data-collection-cards class="clip-browser-grid"></div><video controls muted loop playsinline style="width:100%;max-height:350px"></video>';document.body.append(dialog);
 function ensureMetadata(){if(!window.VJContent)return;try{videoClips.forEach(VJContent.enrich);}catch{}}
 function contents(item){
  ensureMetadata();
  if(!item)return videoClips.filter(c=>c.energy);
  const identity=window.VJContent?.packIdentity(item)||{theme:null,energy:null};
  let pool=window.VJContent?.curate(videoClips,{theme:identity.theme,energy:identity.energy,limit:6})||[];
  if(pool.length<3)pool=window.VJContent?.curate(videoClips,{energy:identity.energy,limit:6})||[];
  if(pool.length<3)pool=videoClips.filter(c=>c.energy===identity.energy).slice(0,6);
  return pool.length?pool:videoClips.slice(0,6);
 }
 function card(clip,container){
  const b=document.createElement('button');b.type='button';b.className='clip-card';b.title=window.VJContent?.describe(clip)||clip.label;
  if(clip.poster){const img=document.createElement('img');img.src=window.VJAssetUrl?.(clip.poster)||clip.poster;img.alt='';img.loading='lazy';b.append(img);}
  const text=document.createElement('span');text.textContent=clip.label;b.append(text);
  if(window.VJContent){const meta=document.createElement('small');meta.textContent=`${clip.themeLabel} · ${VJContent.energyMeta[clip.energy]?.label||clip.energy} · ${clip.motion}`;b.append(meta);}
  b.onclick=()=>{const video=dialog.querySelector('video');video.src=window.VJAssetUrl?.(clip.src)||clip.src;video.play().catch(()=>{});};container.append(b);
 }
 function draw(select){
  ensureMetadata();const item=shopItems.find(i=>i.id===select.value),list=item?contents(item):videoClips.filter(c=>c.energy);const cards=dialog.querySelector('[data-collection-cards]');cards.replaceChildren();list.forEach(clip=>card(clip,cards));
  const summary=dialog.querySelector('[data-pack-summary]');if(item){const identity=window.VJContent?.packIdentity(item);summary.innerHTML=`<strong>${escapeHtml(item.label)}</strong><p>${identity?`${identity.label} · ${VJContent.energyMeta[identity.energy]?.label||identity.energy}. `:''}Sélection de ${list.length} clips cohérents pour retrouver rapidement une direction visuelle. Les fichiers restent ceux de la bibliothèque incluse.</p>`;}else summary.innerHTML='<strong>Bibliothèque complète</strong><p>Explore les clips par énergie. Warm-up pour respirer, groove pour tenir, montée pour construire et peak pour les moments forts.</p>';
  const v=dialog.querySelector('video');v.pause();v.removeAttribute('src');v.load();
 }
 async function open(id=null){
  await ready;ensureMetadata();const select=dialog.querySelector('select');select.replaceChildren();const all=document.createElement('option');all.value='included';all.textContent=`Bibliothèque complète · ${videoClips.length} clips`;select.append(all);
  for(const item of shopItems.filter(i=>i.category==='vjloop'&&profile.ownedItems.includes(i.id))){const o=document.createElement('option');o.value=item.id;const identity=window.VJContent?.packIdentity(item);o.textContent=`Acheté · ${item.label}${identity?` · ${identity.label}`:''}`;select.append(o);}
  select.value=[...select.options].some(o=>o.value===id)?id:'included';select.onchange=()=>draw(select);draw(select);dialog.showModal();
 }
 function close(){const v=dialog.querySelector('video');v.pause();v.removeAttribute('src');v.load();dialog.close();}
 dialog.querySelector('[data-clips-close]').onclick=close;dialog.oncancel=e=>{e.preventDefault();close();};document.addEventListener('click',e=>{const b=e.target.closest('[data-owned-clips]');if(b)open(b.dataset.ownedClips||null);});return {open,contents,ready};
})();
