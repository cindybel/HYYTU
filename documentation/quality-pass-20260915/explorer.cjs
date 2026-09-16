const {chromium}=require('../qa-browser.cjs'),{measure}=require('../desktop-layout-20260915/audit.cjs'),assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});try{
 const p=await b.newPage({viewport:{width:1280,height:900}}),rows=[],errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:5181/');await p.locator('#studio-entry-button').click();await p.locator('#vj-name').fill('Explorateur QA');await p.locator('#create-vj-button').click();await p.waitForFunction(()=>player.userData.loaded);await p.evaluate(()=>{StudioWorld.showComputer();profile.settings.reducedMotion=true;profile.ownedItems=shopItems.map(i=>i.id);profile.stats.level=5;});
 await p.locator('.desktop-icon[data-app=files]').dblclick();await p.locator('.file-explorer').waitFor();
 for(const size of [{width:1280,height:900},{width:1116,height:717},{width:390,height:844}]){await p.setViewportSize(size);
  for(const folder of ['home','clips','gear','clothing','documents']){await p.locator(`.file-explorer [data-file-folder="${folder}"]`).click();
   for(const mode of ['icons','list']){await p.locator('[data-file-view]').selectOption(mode);await p.waitForTimeout(100);const m=await p.evaluate(measure);rows.push({size,folder,mode,...m});assert(!m.overflow&&!m.offscreen&&!m.issues.length,JSON.stringify(rows.at(-1)));}
  }
  await p.locator('.file-explorer [data-file-folder=clips]').click();await p.locator('[data-file-view]').selectOption('icons');
  await p.waitForFunction(()=>[...document.querySelectorAll('.explorer-file-icon img')].every(i=>i.complete&&i.naturalWidth>0));
  assert.equal(await p.locator('.explorer-file-icon img').count(),await p.locator('[data-file-entry]').count());
  await p.screenshot({path:`documentation/quality-pass-20260915/explorer-${size.width}.png`});
 }
 await p.setViewportSize({width:1280,height:900});await p.locator('[data-file-search]').fill('introuvable012345');assert.equal(await p.locator('[data-file-entry]').count(),0);await p.locator('[data-file-search]').fill('');const label=await p.locator('[data-file-entry] strong').first().textContent();await p.locator('[data-file-search]').fill(label);assert((await p.locator('[data-file-entry]').count())>0);
 await p.locator('[data-file-entry]').first().dblclick();await p.waitForFunction(()=>{const v=document.querySelector('.clip-collection-dialog video');return v.readyState>=2&&!v.paused;});await p.locator('[data-clips-close]').click();
 await p.locator('.file-explorer [data-file-folder=gear]').click();await p.locator('[data-file-entry]').first().click();await p.locator('[data-file-open]').click();await p.locator('.item-inspector[open] [data-model-view] canvas').waitFor();await p.locator('[data-model-close]').click();
 await p.locator('[data-file-back]').click();assert(await p.locator('.explorer-address').textContent().then(s=>s.includes('Vidéos')));await p.locator('[data-file-forward]').click();assert(await p.locator('.explorer-address').textContent().then(s=>s.includes('Matériel')));await p.locator('[data-file-up]').click();assert.equal(await p.locator('[data-file-entry]').count(),4);
 await p.locator('.file-explorer [data-file-folder=documents]').click();await p.locator('[data-file-entry]').first().press('Enter');await p.locator('.email-reader').waitFor();
 await p.locator('#app-window .traffic.red').click();await p.locator('.os-menu-left [data-menu-action=game]').click();await p.locator('#os-game-menu').waitFor({state:'visible'});assert(await p.locator('#os-game-menu [data-menu-action=save]').isVisible());await p.locator('#os-game-menu [data-menu-action=save]').click();
 assert.deepEqual(errors,[]);fs.writeFileSync('documentation/quality-pass-20260915/explorer.json',JSON.stringify({rows,errors},null,2));console.log('PASS: 30 explorer views, all folders, both views, search, navigation history, real video playback, 3D gear, document opening and Start > Save');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
