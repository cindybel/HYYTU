/* The simulated computer exposes real game collections, not the host filesystem. */
window.VJFileExplorer=(()=>{
 const folders={home:'Ce PC',clips:'Vidéos VJ',gear:'Matériel',clothing:'Tenues',documents:'Documents'};
 let folder='home',history=['home'],cursor=0,query='',selection=null,entries=[];
 const icon='<svg viewBox="0 0 32 26" aria-hidden="true"><path fill="#e6b954" d="M1 3h12l3 4h15v18H1Z"/><path fill="#f2cf77" d="M1 10h30l-3 15H1Z"/></svg>';
 function list(){
  if(folder==='home')return Object.entries(folders).filter(([id])=>id!=='home').map(([id,label])=>({id,label,type:'Dossier',kind:'folder'}));
  if(folder==='clips')return videoClips.filter(c=>ClipProgression.unlocked(c)).map(c=>({id:c.src,label:c.label,type:`Clip vidéo · niveau ${c.requiredLevel}`,kind:'clip',poster:c.poster}));
  if(folder==='documents')return profile.emails.slice().reverse().map(e=>({id:e.id,label:e.subject,type:`Courriel · jour ${e.day}`,kind:'email'}));
  return shopItems.filter(i=>i.category===folder&&profile.ownedItems.includes(i.id)).map(i=>({id:i.id,label:i.label,type:folder==='gear'?'Matériel possédé':'Vêtement possédé',kind:'item'}));
 }
 function open(entry){if(!entry)return;if(entry.kind==='folder')navigate(entry.id);else if(entry.kind==='clip')ClipCollections.preview(entry.id);else if(entry.kind==='item')ItemInspector.open(entry.id);else{selectedEmailId=entry.id;openApp('email');}}
 function navigate(id){folder=id;history=history.slice(0,cursor+1);history.push(id);cursor++;query='';render();}
 function fileIcon(e){
  if(e.kind==='folder')return icon;
  if(e.kind==='clip')return e.poster?`<img src="${escapeHtml(window.VJAssetUrl?.(e.poster)||e.poster)}" alt="">`:'<span class="explorer-document" aria-hidden="true">▶</span>';
  if(e.kind==='item')return `<span class="explorer-item-image" data-item-preview="${escapeHtml(e.id)}"></span>`;
  return '<span class="explorer-document">✉</span>';
 }
 function draw(){
  const host=appWindow.querySelector('[data-file-list]');if(!host)return;
  entries=list().filter(e=>e.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()));selection=null;
  host.dataset.view=profile.settings.explorerView==='list'?'list':'icons';
  host.innerHTML=entries.map((e,i)=>`<button class="explorer-entry" data-file-entry="${i}" title="${escapeHtml(e.label)}"><span class="explorer-file-icon">${fileIcon(e)}</span><strong>${escapeHtml(e.label)}</strong><small>${escapeHtml(e.type)}</small></button>`).join('')||'<p class="explorer-empty">Aucun élément dans ce dossier pour cette recherche.</p>';
  appWindow.querySelector('[data-file-count]').textContent=`${entries.length} élément(s) · double-clique pour ouvrir, ou sélectionne puis appuie sur Entrée.`;
  const openButton=appWindow.querySelector('[data-file-open]');openButton.disabled=true;
  host.querySelectorAll('[data-file-entry]').forEach(b=>{b.onclick=()=>{selection=entries[Number(b.dataset.fileEntry)];host.querySelectorAll('[data-file-entry]').forEach(el=>el.setAttribute('aria-pressed',String(el===b)));openButton.disabled=false;};b.ondblclick=()=>open(entries[Number(b.dataset.fileEntry)]);b.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();open(entries[Number(b.dataset.fileEntry)]);}};});
 }
 function render(){
  appWindow.innerHTML=`<div class="app-heading explorer-heading"><div><h1>Explorateur de fichiers</h1></div></div><div class="explorer-toolbar"><button data-file-back aria-label="Dossier précédent" ${cursor===0?'disabled':''}>←</button><button data-file-forward aria-label="Dossier suivant" ${cursor===history.length-1?'disabled':''}>→</button><button data-file-up aria-label="Dossier parent" ${folder==='home'?'disabled':''}>↑</button><div class="explorer-address"><button data-file-folder="home">Ce PC</button>${folder!=='home'?`<span>› ${folders[folder]}</span>`:''}</div><label class="explorer-search"><span>Rechercher</span><input type="search" data-file-search placeholder="Dans ${folders[folder]}" value="${escapeHtml(query)}"></label></div><div class="explorer-commands"><button data-file-open disabled>Ouvrir</button><label>Affichage <select data-file-view><option value="icons">Grandes icônes</option><option value="list">Liste détaillée</option></select></label></div><div class="file-explorer"><nav aria-label="Dossiers">${Object.entries(folders).map(([id,label])=>`<button data-file-folder="${id}" aria-current="${id===folder?'page':'false'}">${icon}<span>${label}</span></button>`).join('')}</nav><section data-file-list aria-label="Fichiers"></section></div><footer class="explorer-status" data-file-count></footer>`;
  appWindow.querySelectorAll('[data-file-folder]').forEach(b=>b.onclick=()=>navigate(b.dataset.fileFolder));
  appWindow.querySelector('[data-file-back]').onclick=()=>{folder=history[--cursor];query='';render();};appWindow.querySelector('[data-file-forward]').onclick=()=>{folder=history[++cursor];query='';render();};appWindow.querySelector('[data-file-up]').onclick=()=>navigate('home');
  const search=appWindow.querySelector('[data-file-search]');search.oninput=()=>{query=search.value;draw();};const view=appWindow.querySelector('[data-file-view]');view.value=profile.settings.explorerView==='list'?'list':'icons';view.onchange=()=>{profile.settings.explorerView=view.value;saveSlots();draw();};
  appWindow.querySelector('[data-file-open]').onclick=()=>open(selection);draw();addWindowControls();
 }
 return {render};
})();
