const {chromium}=require(process.env.VJ_PLAYWRIGHT);const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});const p=await b.newPage({viewport:{width:1440,height:1000}});const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:5173');await p.locator('#first-show-button').click();for(const id of [2,0]){await p.locator(`[data-visual="${id}"]`).click();await p.locator('[data-take]').click();await p.waitForTimeout(2200);}await p.locator('[data-intensity]').fill('60');assert.equal(await p.locator('[data-room-mission="1"]').isDisabled(),true);
const results=[];
for(let m=0;m<3;m++){
if(m===0)await p.locator('[data-room-mission="0"]').click();else await p.locator('[data-room-continue]').click();let faded=false,paused=false;
while(await p.locator('#academy').getAttribute('data-quick-step')!=='5'){
 const label=await p.locator('[data-time]').innerText(),sec=parseInt(label)||0;
 await p.locator('[data-intensity]').fill(String(m===0?50:m===1?(sec<16?35:65):sec<8?75:sec<24?25:60));
 if(!faded&&sec>=2){const available=p.locator('.academy-clips button:not([data-program="true"])').first();await available.click();await p.locator('[data-take]').click();faded=true;}
 if(m===1&&!paused&&sec>=5){await p.locator('[data-close]').click();await p.reload();await p.locator('#first-show-button').click();assert.match(await p.locator('[data-title]').innerText(),/pause/);await p.locator('[data-play]').click();paused=true;}
 await p.waitForTimeout(500);
}
assert.equal(await p.locator('[data-title]').innerText(),'Bien joué !');results.push({mission:m,passed:true});console.log('Mission '+(m+1)+' played and passed');await p.screenshot({path:`documentation/qa/qa-room-mission-${m}.png`});
}
await p.reload();await p.locator('#first-show-button').click();const saved=await p.evaluate(()=>JSON.parse(localStorage.getItem('vj-simulator-academy-v1')));assert.deepEqual(saved.roomWins,[0,1,2]);
// A failed attempt never unlocks a mission: isolated fresh browser storage fixture skips intro only.
const c=await b.newContext();const f=await c.newPage();await f.goto('http://127.0.0.1:5173');await f.evaluate(()=>localStorage.setItem('vj-simulator-academy-v1',JSON.stringify({introComplete:true,run:{mission:0,elapsed:31,integral:3100,completedFades:0,program:0,preview:1,level:.5}})));await f.reload();await f.locator('#first-show-button').click();await f.locator('[data-play]').click();await f.waitForTimeout(1600);assert.equal(await f.locator('[data-title]').innerText(),'Un autre essai ?');assert.equal(await f.locator('[data-room-mission="1"]').isDisabled(),true);
assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:true,results,reload:true,failedAttemptFixture:true,errors}));await b.close();})().catch(e=>{console.error(e);process.exit(1)});
