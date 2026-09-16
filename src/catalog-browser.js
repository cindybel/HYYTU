/* Shop controls use actual ownership, prices and progression rules. */
window.CatalogBrowser=(()=>{
 const state={query:'',sort:'level',available:false};
 const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 function filter(items){
  const q=normalize(state.query);
  return items.filter(i=>!i.physicalDisabled&&(!state.available||!window.PhysicalCareer?.unlockItem(i))&&(!q||normalize([i.label,i.description,...(i.tags||[])].join(' ')).includes(q))&&(!state.available||((profile.godMode||getItemUnlockLevel(i)<=profile.stats.level)&&(profile.godMode||i.cost<=profile.money)&&(!profile.ownedItems.includes(i.id)||i.stackable))))
   .sort((a,b)=>state.sort==='price-up'?a.cost-b.cost:state.sort==='price-down'?b.cost-a.cost:state.sort==='name'?a.label.localeCompare(b.label,'fr'):getItemUnlockLevel(a)-getItemUnlockLevel(b)||a.cost-b.cost);
 }
 function toolbar(items){const visible=items.filter(i=>shopView!=='gear'||shopGearFilter==='all'||i.type===shopGearFilter).filter(i=>shopView!=='vjloop'||shopLoopFilter==='all'||i.styleTarget===shopLoopFilter);
  return `<section class="catalog-toolbar" aria-label="Chercher et trier les articles"><label class="catalog-search"><span>Rechercher</span><input data-catalog-search type="search" placeholder="Nom, marque ou usage…" value="${escapeHtml(state.query)}"></label><label>Trier <select data-catalog-sort><option value="level">Progression</option><option value="price-up">Prix croissant</option><option value="price-down">Prix décroissant</option><option value="name">Nom</option></select></label><label class="catalog-budget"><input data-catalog-budget type="checkbox" ${state.available?'checked':''}> Achetable maintenant</label><span class="catalog-count" role="status">${visible.length} article(s)</span>${state.query||state.available?'<button data-catalog-clear>Effacer les filtres</button>':''}</section>${!visible.length?'<p class="catalog-empty">Aucun article ne correspond à ces filtres. Essaie un autre mot ou désactive « Achetable maintenant ».</p>':''}`;
 }
 function redraw(focus){const caret=focus?.selectionStart;renderDesktop();if(focus){const next=appWindow.querySelector('[data-catalog-search]');next.focus();next.setSelectionRange(caret,caret);}}
 function decorate(){
  const input=appWindow.querySelector('[data-catalog-search]');if(!input||input.dataset.bound)return;input.dataset.bound='true';
  input.oninput=()=>{state.query=input.value;redraw(input);};const sort=appWindow.querySelector('[data-catalog-sort]');sort.value=state.sort;sort.onchange=()=>{state.sort=sort.value;redraw();};
  appWindow.querySelector('[data-catalog-budget]').onchange=e=>{state.available=e.target.checked;redraw();};
  appWindow.querySelector('[data-catalog-clear]')?.addEventListener('click',()=>{state.query='';state.available=false;redraw();});
 }
 new MutationObserver(decorate).observe(appWindow,{childList:true,subtree:true});
 return{filter,toolbar,state};
})();
