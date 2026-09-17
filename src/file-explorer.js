/* The simulated computer exposes real game collections, not the host filesystem. */
window.VJFileExplorer=(()=>{
 const folders={home:'Ce PC',clips:'Vidéos VJ',gear:'Matériel',clothing:'Tenues',documents:'Documents'};
 let folder='home',history=['home'],cursor=0,query='',selection=null,entries=[];
 let contextEntry=null;
 const icon='<svg viewBox="0 0 32 26" aria-hidden="true"><path fill="#e6b954" d="M1 3h12l3 4h15v18H1Z"/><path fill="#f2cf77" d="M1 10h30l-3 15H1Z"/></svg>';
 const contextMenu=document.createElement('div');
 contextMenu.className='explorer-context-menu';
 contextMenu.hidden=true;
 contextMenu.style.cssText='position:fixed;z-index:99999;min-width:210px;padding:6px;background:#101b2a;border:1px solid #47617e;border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,.45)';
 const sendToProjector=document.createElement('button');
 sendToProjector.type='button';
 sendToProjector.textContent='Envoyer au projecteur';
 sendToProjector.style.cssText='width:100%;padding:10px 12px;text-align:left;border:0;border-radius:6px;background:transparent;color:#eef7ff;font:inherit;cursor:pointer';
 sendToProjector.onmouseenter=()=>sendToProjector.style.background='#1d3853';
 sendToProjector.onmouseleave=()=>sendToProjector.style.background='transparent';
 contextMenu.append(sendToProjector);
 document.body.append(contextMenu);
 function closeContextMenu(){contextMenu.hidden=true;contextEntry=null;}
 function showContextMenu(entry,event){
  if(entry?.kind!=='clip')return;
  contextEntry=entry;
  contextMenu.hidden=false;
  const width=220,height=48;
  contextMenu.style.left=`${Math.min(event.clientX,window.innerWidth-width-8)}px`;
  contextMenu.style.top=`${Math.min(event.clientY,window.innerHeight-height-8)}px`;
 }
 function sendClipToProjector(entry){
  if(!entry||entry.kind!=='clip')return;
  const index=videoClips.findIndex(c=>c.src===entry.id);
  if(index<0){notify?.('Clip introuvable.');return;}
  if(!document.body.classList.contains('screen-gig')){
   notify?.('Entre dans un gig pour envoyer un clip au projecteur.');
   return;
  }
  if(typeof selectVideo!=='function'){
   notify?.('Le projecteur n’est pas disponible pour le moment.');
   return;
  }
  selectVideo(index);
  notify?.(`${entry.label} envoyé au projecteur.`);
 }
 sendToProjector.onclick=()=>{const entry=contextEntry;closeContextMenu();sendClipToProjector(entry);};
 document.addEventListener('pointerdown',event=>{if(!contextMenu.hidden&&!contextMenu.contains(event.target))closeContextMenu();});
 document.addEventListener('keydown',event=>{if(event.key==='Escape')closeContextMenu();});
 window.addEventListener('blur',closeContextMenu);
 function list(){
  if(folder==='home')return Object.entries(folders).filter(([id])=>id!=='home').map(([id,label])=>({id,label,type:'Dossier',kind:'folder'}));
  if(folder==='clips')return videoClips.filter(c=>!/\/video\/vecteezy_/i.test(c.src||'')&&ClipProgression.unlocked(c)).map(c=>({id:c.src,label:c.label,type:`Clip vidéo · niveau ${c.requiredLevel}`,kind:'clip',poster:c.poster}));
  if(folder==='documents')return [{id:'physical-guide',label:'Game Design Master — Refonte physique v4.pdf',type:'PDF · 17 pages · guide officiel',kind:'guide'},...profile.emails.slice().reverse().map(e=>({id:e.id,label:e.subject,type:`Courriel · jour ${e.day}`,kind:'email'}))];
  return shopItems.filter(i=>i.category===folder&&profile.ownedItems.includes(i.id)).map(i=>({id:i.id,label:i.label,type:folder==='gear'?'Matériel possédé':'Vêtement possédé',kind:'item'}));
 }
 function open(entry){if(!entry)return;if(entry.kind==='guide'){openApp('physical-guide');return;}if(entry.kind==='folder')navigate(entry.id);else if(entry.kind==='clip')ClipCollections.preview(entry.id);else if(entry.kind==='item')ItemInspector.open(entry.id);else{selectedEmailId=entry.id;openApp('email');}}
 function navigate(id){closeContextMenu();folder=id;history=history.slice(0,cursor+1);history.push(id);cursor++;query='';render();}
 function fileIcon(e){
  if(e.kind==='folder')return icon;
  if(e.kind==='clip')return e.poster?`<img src="${escapeHtml(window.VJAssetUrl?.(e.poster)||e.poster)}" alt="">`:'<span class="explorer-document" aria-hidden="true">▶</span>';
  if(e.kind==='item')return `<span class="explorer-item-image" data-item-preview="${escapeHtml(e.id)}"></span>`;
  return '<span class="explorer-document">✉</span>';
 }
 function draw(){
  closeContextMenu();
  const host=appWindow.querySelector('[data-file-list]');if(!host)return;
  entries=list().filter(e=>e.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()));selection=null;
  host.dataset.view=profile.settings.explorerView==='list'?'list':'icons';
  host.innerHTML=entries.map((e,i)=>`<button class="explorer-entry" data-file-entry="${i}" title="${escapeHtml(e.label)}"><span class="explorer-file-icon">${fileIcon(e)}</span><strong>${escapeHtml(e.label)}</strong><small>${escapeHtml(e.type)}</small></button>`).join('')||'<p class="explorer-empty">Aucun élément dans ce dossier pour cette recherche.</p>';
  appWindow.querySelector('[data-file-count]').textContent=`${entries.length} élément(s) · double-clique pour ouvrir, clic droit sur un clip pour l’envoyer au projecteur.`;
  const openButton=appWindow.querySelector('[data-file-open]');openButton.disabled=true;
  host.querySelectorAll('[data-file-entry]').forEach(b=>{
   const getEntry=()=>entries[Number(b.dataset.fileEntry)];
   b.onclick=()=>{selection=getEntry();host.querySelectorAll('[data-file-entry]').forEach(el=>el.setAttribute('aria-pressed',String(el===b)));openButton.disabled=false;};
   b.ondblclick=()=>open(getEntry());
   b.oncontextmenu=e=>{const entry=getEntry();if(entry?.kind!=='clip')return;e.preventDefault();selection=entry;host.querySelectorAll('[data-file-entry]').forEach(el=>el.setAttribute('aria-pressed',String(el===b)));openButton.disabled=false;showContextMenu(entry,e);};
   b.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();open(getEntry());}};
  });
 }
 function render(){
  closeContextMenu();
  appWindow.innerHTML=`<div class="app-heading explorer-heading"><div><h1>Explorateur de fichiers</h1></div></div><div class="explorer-toolbar"><button data-file-back aria-label="Dossier précédent" ${cursor===0?'disabled':''}>←</button><button data-file-forward aria-label="Dossier suivant" ${cursor===history.length-1?'disabled':''}>→</button><button data-file-up aria-label="Dossier parent" ${folder==='home'?'disabled':''}>↑</button><div class="explorer-address"><button data-file-folder="home">Ce PC</button>${folder!=='home'?`<span>› ${folders[folder]}</span>`:''}</div><label class="explorer-search"><span>Rechercher</span><input type="search" data-file-search placeholder="Dans ${folders[folder]}" value="${escapeHtml(query)}"></label></div><div class="explorer-commands"><button data-file-open disabled>Ouvrir</button><label>Affichage <select data-file-view><option value="icons">Grandes icônes</option><option value="list">Liste détaillée</option></select></label></div><div class="file-explorer"><nav aria-label="Dossiers">${Object.entries(folders).map(([id,label])=>`<button data-file-folder="${id}" aria-current="${id===folder?'page':'false'}">${icon}<span>${label}</span></button>`).join('')}</nav><section data-file-list aria-label="Fichiers"></section></div><footer class="explorer-status" data-file-count></footer>`;
  appWindow.querySelectorAll('[data-file-folder]').forEach(b=>b.onclick=()=>navigate(b.dataset.fileFolder));
  appWindow.querySelector('[data-file-back]').onclick=()=>{folder=history[--cursor];query='';render();};appWindow.querySelector('[data-file-forward]').onclick=()=>{folder=history[++cursor];query='';render();};appWindow.querySelector('[data-file-up]').onclick=()=>navigate('home');
  const search=appWindow.querySelector('[data-file-search]');search.oninput=()=>{query=search.value;draw();};const view=appWindow.querySelector('[data-file-view]');view.value=profile.settings.explorerView==='list'?'list':'icons';view.onchange=()=>{profile.settings.explorerView=view.value;saveSlots();draw();};
  appWindow.querySelector('[data-file-open]').onclick=()=>open(selection);draw();addWindowControls();
 }
 return {render};
})();
