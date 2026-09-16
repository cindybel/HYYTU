const {chromium}=require('C:/Users/VJs DMTeam/AppData/Local/Temp/vj-simulator-qa/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});try{
const p=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto('http://127.0.0.1:5181/');await p.locator('#studio-entry-button').click();await p.locator('#vj-name').fill('Visites QA');await p.locator('#create-vj-button').click();await p.evaluate(()=>StudioWorld.showComputer());await p.locator('.desktop-icon[data-app="housing"]').click();
const ids=await p.locator('[data-home-preview]').evaluateAll(nodes=>nodes.map(n=>n.dataset.homePreview));const rows=[];
for(const id of ids){
 const before=await p.evaluate(()=>JSON.stringify({housing:profile.housing,money:profile.money,owned:profile.ownedItems,skills:profile.skills,bank:profile.bank,position:{x:profile.studioWorld.x,z:profile.studioWorld.z,yaw:profile.studioWorld.yaw,pitch:profile.studioWorld.pitch}}));
 await p.locator(`[data-home-preview="${id}"]`).click();await p.locator('#home-visit-back').waitFor({state:'visible'});await p.waitForTimeout(180);
 assert.equal(await p.evaluate(()=>StudioWorld.visitingHome.id),id);assert(await p.locator('[data-world-home]').innerText().then(t=>t.startsWith('Visite')));
 const clock=await p.evaluate(()=>profile.studioWorld.seconds);const start=await p.evaluate(()=>camera.position.x);await p.keyboard.down('ArrowRight');await p.waitForTimeout(350);await p.keyboard.up('ArrowRight');assert.notEqual(await p.evaluate(()=>camera.position.x),start);
 assert.equal(await p.evaluate(()=>profile.studioWorld.seconds),clock);await p.keyboard.press('e');assert.equal(await p.evaluate(()=>currentApp),null);
 assert.equal(await p.evaluate(()=>JSON.stringify({housing:profile.housing,money:profile.money,owned:profile.ownedItems,skills:profile.skills,bank:profile.bank,position:{x:profile.studioWorld.x,z:profile.studioWorld.z,yaw:profile.studioWorld.yaw,pitch:profile.studioWorld.pitch}})),before);
 await p.evaluate(()=>saveSlots());assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem(SAVE_KEY))[activeSlot].housing.type),JSON.parse(before).housing.type);
 if(id==='housing-penthouse')await p.screenshot({path:'documentation/audit-official-20260914/visit-penthouse.png'});
 if(rows.length%2)await p.keyboard.press('Escape');else await p.locator('#home-visit-back').click();
 await p.locator('#app-window h1').filter({hasText:'Locaux'}).waitFor();assert.equal(await p.evaluate(()=>StudioWorld.visitingHome),null);
 rows.push(id);
}
await p.setViewportSize({width:390,height:844});await p.locator('[data-home-preview]').first().click();await p.locator('#home-visit-back').click();await p.locator('#app-window h1').filter({hasText:'Locaux'}).waitFor();
assert.deepEqual(errors,[]);fs.writeFileSync('documentation/audit-official-20260914/visit-tests.json',JSON.stringify({rows,mobileReturn:true,errors},null,2));console.log('10 visits: movement, no purchase, no career changes, save safe, button/Escape return; mobile return OK');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
