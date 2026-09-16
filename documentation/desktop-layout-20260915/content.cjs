const {chromium}=require('../qa-browser.cjs'),fs=require('node:fs'),assert=require('node:assert/strict');
const {measure}=require('./audit.cjs'),dir='documentation/desktop-layout-20260915';
function accessibility(selector='#app-window'){
 const root=document.querySelector(selector),problems=[],r=root.getBoundingClientRect();let buttons=0;
 for(const el of root.querySelectorAll('button,input,select,summary')){
  if(!el.getClientRects().length||el.disabled||el.closest('[aria-hidden=true]'))continue;
  el.scrollIntoView({block:'center',inline:'nearest',behavior:'instant'});const b=el.getBoundingClientRect();if(b.width<1||b.height<1)continue;
  const hit=document.elementFromPoint(b.x+b.width/2,b.y+b.height/2);buttons++;
  if(hit!==el&&!el.contains(hit))problems.push({type:'obscured-control',text:el.textContent.trim().slice(0,80),class:el.className,by:hit?.className||hit?.tagName});
 }
 root.scrollTop=0;root.scrollLeft=0;
 const tree=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;
 while(node=tree.nextNode()){
  if(!node.textContent.trim())continue;const el=node.parentElement;if(!el.getClientRects().length||el.closest('style,script,option,svg,[aria-hidden=true]'))continue;
  const range=document.createRange();range.selectNodeContents(node);const t=range.getBoundingClientRect();if(!t.width||!t.height)continue;
  let p=el;while(p&&p!==root){const s=getComputedStyle(p),b=p.getBoundingClientRect();if((['hidden','clip'].includes(s.overflowY)&& (t.top<b.top-2||t.bottom>b.bottom+2))||(['hidden','clip'].includes(s.overflowX)&&(t.left<b.left-2||t.right>b.right+2))){problems.push({type:'cut-text',text:node.textContent.trim().slice(0,100),by:p.className});break;}p=p.parentElement;}
 }
 for(const img of root.querySelectorAll('.catalog-photo img')){const a=img.getBoundingClientRect(),b=img.parentElement.getBoundingClientRect();if(a.width>b.width+1||a.height>b.height+1)problems.push({type:'cut-image',text:img.alt});}
 return {buttons,problems};
}
(async()=>{const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});try{
 const p=await browser.newPage({viewport:{width:1280,height:900}}),errors=[],rows=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:5181/');await p.locator('#studio-entry-button').click();await p.locator('#vj-name').fill('Cindy Bélanger · Direction visuelle et mapping');await p.locator('#create-vj-button').click();await p.waitForFunction(()=>player.userData.loaded);
 await p.evaluate(()=>{StudioWorld.showComputer();profile.settings.reducedMotion=true;profile.money=12000;profile.stats.level=5;profile.ownedItems=shopItems.map(i=>i.id);profile.inventory=Object.fromEntries(shopItems.filter(i=>i.category==='gear').map(i=>[i.id,6]));profile.equippedWear={top:'clothing-vest-led',pants:'clothing-pants-tech',shoes:'clothing-shoes-cyan'};applyHumanAppearance();
  for(let i=0;i<7;i++){const g=profile.gigs[i];g.status=['offered','accepted','pending','scheduled','done','cancelled','locked'][i];g.scheduledDay=profile.day+i;g.eventDay=profile.day+i;}
  addEmail('Festival des arts numériques · Équipe technique','Contrat de projection architecturale — renseignements pour la régie','Voici les informations pour préparer la prestation : trois compositions distinctes, un repérage des sorties vidéo et des transitions adaptées à la musique. Réponds à cette offre pour confirmer ta présence.',{type:'gig-offer',gigId:profile.gigs[0].id,unique:false});
  profile.phoneMessages.push({from:'Équipe de direction technique du festival',day:profile.day,title:'Préparation de la projection sur plusieurs façades',body:'Le responsable vidéo souhaite vérifier les dimensions, les connecteurs et le matériel avant le spectacle. Rendez-vous au local pour faire les essais.'});
  profile.loans=[{id:'layout-loan',label:'Financement du matériel de projection',balance:800,minimum:85,interest:12}];
  for(let i=0;i<24;i++)VJBank.record(i%2?240:-35,'Installation et transport du matériel pour le festival des arts numériques',{counterparty:'Collectif des arts numériques de Montréal'});
  musicTrackName='Festival des arts numériques — Session complète de répétition et préparation de la soirée';musicPlaylist=[{name:musicTrackName,url:''}];
 });
 async function open(app,width){await p.evaluate(({app,width})=>{closeAppWindow(false);clearInactiveWindows();profile.settings.windowLayouts={};profile.settings.windowBounds={width,height:620};openApp(app);appWindow.scrollTop=0;},{app,width});}
 async function check(name,selector='#app-window',controls=true){await p.evaluate(s=>document.querySelector(s).querySelectorAll('details').forEach(d=>d.open=true),selector);await p.waitForTimeout(90);const m=await p.evaluate(measure,selector),a=controls?await p.evaluate(accessibility,selector):{buttons:0,problems:[]};const row={name,size:p.viewportSize(),...m,...a};rows.push(row);if(m.overflow||m.offscreen||m.issues.length||a.problems.length)console.log(name,JSON.stringify({overflow:m.overflow,offscreen:m.offscreen,issues:m.issues.slice(0,4),problems:a.problems.slice(0,6)}));}
 for(const cfg of [{size:{width:1680,height:950},width:520},{size:{width:1116,height:717},width:1068},{size:{width:390,height:844},width:760}]){
  await p.setViewportSize(cfg.size);
  for(const app of ['calendar','guide','phone','email','social','transport','music','settings','stats','job','rest','inventory','finance','housing','skills','shop']){
   await open(app,cfg.width);await check(app+'-populated');
   if(['phone','email','music','inventory','housing','skills'].includes(app))await p.screenshot({path:`${dir}/content-${cfg.size.width}-${app}.png`});
   if(app==='social'){await p.locator('[data-simple-all]').click();await check('booking-detailed');const styles=await p.locator('[data-booking-style]').evaluateAll(es=>es.map(e=>e.dataset.bookingStyle));for(const style of styles){await p.locator(`[data-booking-style="${style}"]`).click();await check('booking-'+style);} }
   if(app==='finance'){
    for(const tab of ['transfers','account','management']){await p.locator(`[data-bank-tab="${tab}"]`).click();await check('bank-populated-'+tab);}
    await p.locator('[data-bank-tab="transfers"]').click();await p.locator('[data-bank-panel="transfers"] [data-bank-receipt]').first().click();await check('bank-receipt','#bank-receipt');await p.locator('#bank-receipt button').click();
   }
  }
  await open('skills',cfg.width);for(const skill of await p.locator('[data-workshop]').evaluateAll(es=>es.map(e=>e.dataset.workshop))){await p.locator(`[data-workshop="${skill}"]`).click();await check('workshop-'+skill,'#field-school');await p.locator('[data-workshop-exit]').click();}
  await open('inventory',cfg.width);await p.locator('[data-owned-clips]').click();await check('clip-collections','.clip-collection-dialog');await p.screenshot({path:`${dir}/content-${cfg.size.width}-clips.png`});await p.locator('[data-clips-close]').click();
  for(const id of ['clothing-pants-tech',await p.evaluate(()=>shopItems.find(i=>i.type==='projector').id)]){await p.evaluate(id=>ItemInspector.open(id),id);await check('inspector-'+id,'.item-inspector[open]');await p.locator('[data-model-close]').click();}
  await p.evaluate(()=>StudioRehearsal.open());await check('rehearsal','#studio-rehearsal');await p.locator('[data-rehearsal-close]').click();
 }
 await p.setViewportSize({width:1116,height:717});await open('shop',650);
 const items=await p.evaluate(()=>shopItems.filter(i=>['gear','vjloop','clothing'].includes(i.category)).map(i=>({id:i.id,cat:i.category})));
 for(const {id,cat} of items){await p.evaluate(({id,cat})=>{shopView=cat;shopDetailItemId=id;renderDesktop();},{id,cat});await check('article-'+id);}
 fs.writeFileSync(`${dir}/content.json`,JSON.stringify({rows,errors},null,2));const bad=rows.filter(r=>r.overflow||r.offscreen||r.issues.length||r.problems.length);console.log(JSON.stringify({pages:rows.length,articles:items.length,buttons:rows.reduce((a,r)=>a+r.buttons,0),bad:bad.length,errors}));
 assert.deepEqual(errors,[]);assert.equal(bad.length,0,'Layout or inaccessible content remains; see content.json');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
