const {chromium}=require('../qa-browser.cjs');
const fs=require('node:fs');
const dir='documentation/desktop-layout-20260915';
const stage=process.argv[2]||'before';
function measure(selector='#app-window') {
 const root=document.querySelector(selector),r=root.getBoundingClientRect(),issues=[];
 const visible=e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden';
 const label=e=>`${e.tagName.toLowerCase()}.${String(e.className).replace(/\s+/g,'.')} ${e.textContent.trim().slice(0,80)}`;
 for(const e of root.querySelectorAll('*')){
  if(!visible(e)||e.closest('[aria-hidden=true],svg,canvas')||['STYLE','SCRIPT','OPTION','CANVAS'].includes(e.tagName))continue;
  const b=e.getBoundingClientRect(),s=getComputedStyle(e);
  if(b.width&& (b.left<r.left-2||b.right>r.right+2))issues.push({type:'outside',element:label(e),left:Math.round(b.left-r.left),right:Math.round(b.right-r.right)});
  if(e.childElementCount===0&&e.textContent.trim()&&((['hidden','clip'].includes(s.overflowY)&&e.scrollHeight>e.clientHeight+2)||(['hidden','clip'].includes(s.overflowX)&&e.scrollWidth>e.clientWidth+2)))issues.push({type:'clipped',element:label(e)});
 }
 return {width:r.width,height:r.height,left:r.left,top:r.top,scrollWidth:root.scrollWidth,clientWidth:root.clientWidth,overflow:root.scrollWidth>root.clientWidth+2,offscreen:r.left<0||r.right>innerWidth+1||r.top<0||r.bottom>innerHeight+1,issues};
}
if(require.main===module)(async()=>{const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});try{
 const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[],rows=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5181/');await page.locator('#studio-entry-button').click();await page.locator('#vj-name').fill('Audit fenêtres');await page.locator('#create-vj-button').click();await page.waitForFunction(()=>player.userData.loaded);
 await page.evaluate(()=>{StudioWorld.showComputer();profile.settings.reducedMotion=true;profile.phoneMessages.push({from:'Direction du festival',day:1,title:'Préparation de la soirée de projection',body:'Vérifie les sorties indépendantes, les dimensions des écrans et les changements de rythme avant ton arrivée.'});});
 const apps=['calendar','guide','phone','email','social','transport','music','settings','stats','job','rest','inventory','finance','housing','skills','shop'];
 async function record(name,selector='#app-window') {await page.waitForTimeout(120);const m=await page.evaluate(measure,selector);rows.push({size:page.viewportSize(),name,...m});if((m.overflow||m.issues.length||m.offscreen)&&!name.includes('detail-all')){console.log(`${page.viewportSize().width} ${name}: overflow=${m.overflow} issues=${m.issues.length} ${m.issues.slice(0,3).map(i=>i.element).join(' / ')}`);}return m;}
 async function open(app){await page.evaluate(app=>{closeAppWindow(false);clearInactiveWindows();profile.settings.windowBounds={width:760,height:600};profile.settings.windowLayouts={};openApp(app);appWindow.scrollTop=0;},app);}
 for(const size of [{width:1680,height:950},{width:1280,height:720},{width:1116,height:717},{width:800,height:700},{width:390,height:844}]){
  await page.setViewportSize(size);
  for(const app of apps){await open(app);await record(app);}
  await open('guide');const guides=await page.locator('[data-guide-section]').evaluateAll(es=>es.map(e=>e.dataset.guideSection));
  for(const id of guides){await page.locator(`[data-guide-section="${id}"]`).click();await record('guide-'+id);}
  await open('finance');for(const tab of ['transfers','account','management']){await page.locator(`[data-bank-tab="${tab}"]`).click();await record('bank-'+tab);}
  await open('shop');
  for(const cat of ['gear','vjloop','clothing']){await page.evaluate(cat=>{shopDetailItemId=null;shopView=cat;renderDesktop();},cat);await record('shop-'+cat);if(cat==='clothing')await page.screenshot({path:`${dir}/${stage}-${size.width}-closet.png`});
   const id=await page.evaluate(cat=>shopItems.find(i=>i.category===cat&& (cat!=='clothing'||i.id==='clothing-pants-tech')).id,cat);
   await page.evaluate(id=>{shopDetailItemId=id;renderDesktop()},id);await record('detail-'+cat);await page.screenshot({path:`${dir}/${stage}-${size.width}-detail-${cat}.png`});
  }
 }
 fs.writeFileSync(`${dir}/${stage}.json`,JSON.stringify({rows,errors},null,2));console.log(JSON.stringify({pages:rows.length,bad:rows.filter(r=>r.overflow||r.offscreen||r.issues.length).length,errors}));
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
module.exports={measure};
