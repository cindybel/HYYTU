window.ClipCollections=(()=>{
 const ready=window.VJContent?Promise.resolve():new Promise(resolve=>{const script=document.createElement('script');script.src='./src/content-runtime.js?build=content-phase6';script.onload=resolve;script.onerror=resolve;document.head.append(script);});
 const dialog=document.createElement('dialog');dialog.className='item-inspector clip-collection-dialog';dialog.innerHTML='<header><div><small>BIBLIOTHÈQUE VISUELLE</small><h2>Mes clips et packs</h2></div><button data-clips-close>Fermer</button></header><p data-clips-intro>48 clips sont inclus dans le jeu. Les packs achetés sont des sélections thématiques de cette bibliothèque : ils organisent ton contenu, ils ne prétendent pas ajouter de faux fichiers.</p><label>Collection <select data-collection></select></label><div data-pack-summary></div><div data-collection-cards class="clip-browser-grid"></div><video controls muted loop playsinline style="width:100%;max-height:350px"></video>';document.body.append(dialog);
 function ensureMetadata(){if(!window.VJContent)return;try{videoClips.forEach(VJContent.enrich);}catch{}}
 function contents(item){
  ensureMetadata();
  if(!item)return videoClips.filter(c=>c.energy);
  const style=ClipProgression.genre(item.styleTarget),tier=item.visualTier||getItemUnlockLevel(item);
  return videoClips.filter(c=>c.poster&&c.requiredLevel===tier&&c.styleAffinity.includes(style)).slice(0,6);
 }
 function card(clip,container){
  const b=document.createElement('button');b.type='button';b.className='clip-card';b.title=window.VJContent?.describe(clip)||clip.label;
  if(clip.poster){const img=document.createElement('img');img.src=window.VJAssetUrl?.(clip.poster)||clip.poster;img.alt='';img.loading='lazy';b.append(img);}
  const text=document.createElement('span');text.textContent=clip.label;b.append(text);
  const access=document.createElement('small');access.textContent=ClipProgression.label(clip);b.append(access);b.classList.toggle('clip-locked-preview',!ClipProgression.unlocked(clip));
  if(window.VJContent){const meta=document.createElement('small');meta.textContent=`${clip.themeLabel} · ${VJContent.energyMeta[clip.energy]?.label||clip.energy} · ${clip.motion}`;b.append(meta);}
  b.onclick=()=>{const video=dialog.querySelector('video');video.src=window.VJAssetUrl?.(clip.src)||clip.src;video.play().catch(()=>{});};container.append(b);
 }
 function draw(select){
  ensureMetadata();const item=shopItems.find(i=>i.id===select.value),list=item?contents(item):videoClips.filter(c=>select.value.startsWith('tier:')?c.requiredLevel===Number(select.value.slice(5)):true);const cards=dialog.querySelector('[data-collection-cards]');cards.replaceChildren();list.forEach(clip=>card(clip,cards));
  const summary=dialog.querySelector('[data-pack-summary]');if(item){summary.innerHTML=`<strong>${escapeHtml(item.label)}</strong><p>${ClipProgression.names[ClipProgression.genre(item.styleTarget)]} · ${list[0]?.collectionLabel||''} · ${list.length} clips. Ce pack organise une sélection de la bibliothèque. Le niveau du personnage détermine son utilisation en régie.</p>`;}else summary.innerHTML=`<strong>${ClipProgression.summary()}</strong><p>${ClipProgression.tiers.map(t=>`Niveau ${t.level} : ${t.label}. ${t.detail}`).join('<br>')}</p><p>Clique un clip pour le regarder. Les aperçus des collections futures sont visibles ; leur utilisation en show se débloque au niveau indiqué.</p>`;
  const v=dialog.querySelector('video');v.pause();v.removeAttribute('src');v.load();
 }
 async function open(id=null){
  await ready;ensureMetadata();const select=dialog.querySelector('select');select.replaceChildren();const all=document.createElement('option');all.value='included';all.textContent=`Bibliothèque complète · ${videoClips.length} clips`;select.append(all);
  dialog.querySelector('[data-clips-intro]').textContent=`${videoClips.length} clips conservés et nouveaux, répartis en trois collections. Tes anciens clips restent disponibles quand tu progresses.`;
  for(const tier of ClipProgression.tiers){const o=document.createElement('option');o.value=`tier:${tier.level}`;o.textContent=`Niveau ${tier.level} · ${tier.label} · ${videoClips.filter(c=>c.requiredLevel===tier.level).length} clips`;select.append(o);}
  for(const item of shopItems.filter(i=>i.category==='vjloop'&&profile.ownedItems.includes(i.id))){const o=document.createElement('option');o.value=item.id;const identity=window.VJContent?.packIdentity(item);o.textContent=`Acheté · ${item.label}${identity?` · ${identity.label}`:''}`;select.append(o);}
  select.value=[...select.options].some(o=>o.value===id)?id:'included';select.onchange=()=>draw(select);draw(select);dialog.showModal();
 }
 function close(){const v=dialog.querySelector('video');v.pause();v.removeAttribute('src');v.load();dialog.close();}
 async function preview(src){await open();const clip=videoClips.find(c=>c.src===src);if(!clip)return;const v=dialog.querySelector('video');v.src=window.VJAssetUrl?.(clip.src)||clip.src;v.play().catch(()=>{});}
 dialog.querySelector('[data-clips-close]').onclick=close;dialog.oncancel=e=>{e.preventDefault();close();};document.addEventListener('click',e=>{const b=e.target.closest('[data-owned-clips]');if(b)open(b.dataset.ownedClips||null);});return {open,preview,contents,ready};
})();
