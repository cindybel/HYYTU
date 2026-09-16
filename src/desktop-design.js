/* Coherent app labels and vector icons; existing buttons keep their own listeners. */
(()=>{
 const apps={
  files:['Explorateur','Fichiers et collections du jeu','<path d="M3 6h7l2 2h9v12H3Z"/><path d="M3 6V4h7l2 2"/>'],
  calendar:['Sessions','Calendrier et candidatures','<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18m-13 4h2m4 0h2"/>'],
  guide:['Guide VJ','Les gestes du métier','<path d="M12 6c-3-3-7-3-9-2v15c3-1 6 0 9 2 3-2 6-3 9-2V4c-2-1-6-1-9 2Zm0 0v15"/>'],
  phone:['Contacts','Clients et messages','<path d="M4 4h16v13H9l-5 4Z"/><path d="M8 8h8m-8 4h5"/>'],
  email:['Courriels','Offres et réponses','<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>'],
  social:['Shows','Trouver ton prochain gig','<path d="m12 3 9 5v8l-9 5-9-5V8Zm0 0v18M3 8l9 5 9-5"/>'],
  transport:['Transport','Préparer ton départ','<path d="M3 6h11v12H3Zm11 5h4l3 4v3h-7"/><circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/>'],
  music:['Musique','Écouter tes morceaux','<path d="M9 17V5l11-2v12M9 8l11-2"/><ellipse cx="6" cy="18" rx="3" ry="2"/><ellipse cx="17" cy="16" rx="3" ry="2"/>'],
  stats:['Progression','Compétences et réputation','<path d="M4 20V10m8 10V4m8 16v-7M2 21h20"/>'],
  inventory:['Inventaire','Ton matériel et tes clips','<path d="m3 7 9-4 9 4v13H3Zm0 0h18M9 12h6"/>'],
  finance:['Banque','Cachets et budget','<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18m-14 6h4"/>'],
  settings:['Réglages','Image, son et confort','<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3"/><circle cx="16" cy="17" r="3"/>'],
  skills:['École VJ','Apprendre et progresser','<path d="m2 9 10-5 10 5-10 5Zm4 3v6c4 3 8 3 12 0v-6m4-3v8"/>'],
  housing:['Locaux','Ton espace de création','<path d="m3 10 9-7 9 7v11H3Zm6 11v-8h6v8"/>'],
  shop:['Boutique','Gear, collections et tenues','<path d="M3 8h18v13H3Zm3 0V4h12v4M8 12v3m8-3v3"/>'],
  rehearsal:['Régie VJ','Répéter comme en gig','<rect x="2" y="4" width="20" height="13" rx="2"/><path d="m10 8 5 3-5 3Zm-3 13h10m-5-4v4"/>'],
  relax:['Pause','Souffler entre deux shows','<path d="M4 11c0-4 3-7 7-7m2 16c4 0 7-3 7-7"/><circle cx="12" cy="12" r="4"/>'],
 };
 for(const b of document.querySelectorAll('.desktop-icon,.app-button')){
  const id=b.dataset.app||(b.hasAttribute('data-rehearsal-launch')?'rehearsal':b.classList.contains('relax-game-icon')?'relax':null),app=apps[id];if(!app)continue;
  const first=[...b.childNodes].find(n=>n.nodeType===Node.TEXT_NODE);if(first)first.textContent=app[0];else b.prepend(document.createTextNode(app[0]));
  b.dataset.description=app[1];b.title=`${app[0]} · ${app[1]}`;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#b4e7d7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${app[2]}</svg>`;
  b.style.setProperty('--app-symbol',`url("data:image/svg+xml,${encodeURIComponent(svg)}")`);
 }
 const labels={game:'Démarrer',new:'Nouvelle partie',load:'Charger',save:'Sauvegarder',quit:'Quitter'};
 document.querySelectorAll('.os-menu-bar [data-menu-action]').forEach(b=>{if(labels[b.dataset.menuAction])b.textContent=labels[b.dataset.menuAction];});
 document.querySelector('.os-menu-left [data-menu-action=game]')?.setAttribute('aria-label','Démarrer');
 document.querySelectorAll('.app-dock .app-button').forEach(b=>b.setAttribute('aria-label',b.title||b.textContent));
 document.querySelectorAll('.os-menu-bar [data-os-open]').forEach(b=>{if(apps[b.dataset.osOpen])b.textContent=apps[b.dataset.osOpen][0];});
})();
