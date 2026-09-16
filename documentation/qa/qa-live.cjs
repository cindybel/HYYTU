const {chromium}=require(process.env.VJ_PLAYWRIGHT || 'playwright');
const assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--enable-webgl','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:5173');
await page.evaluate(()=>{profile=slots[0]=makeFreshCareerSlot(0);profile.created=true;profile.money=5000;profile.gigs[0].status='accepted';profile.gigs[0].eventDay=profile.day;startGig(profile.gigs[0].id);});
await page.locator('#gig-setup-start-button').click();
assert.equal(await page.locator('#start-live-button').isDisabled(),true);
await page.locator('#connect-projector-button').click();
await page.locator('#start-live-button').click();
await page.waitForFunction(()=>liveShow.program.readyState>=2&&liveShow.preview.readyState>=2);
assert.equal(await page.locator('#reset-button').isDisabled(),true);
await page.locator('[data-live-intensity]').fill('35');
const original=await page.evaluate(()=>liveShow.currentIndex);
await page.locator('[data-live-select]').selectOption('2');
await page.waitForFunction(()=>liveShow.preview.readyState>=2);
assert.equal(await page.evaluate(()=>liveShow.currentIndex),original);
await page.locator('[data-live-take]').click();
await page.waitForFunction(()=>liveShow.transitions===1);
assert.equal(await page.evaluate(()=>liveShow.currentIndex),2);
await page.locator('[data-live-blackout]').click();
await page.waitForTimeout(250);
assert.equal(await page.evaluate(()=>{const p=liveShow.ctx.getImageData(0,0,640,360).data;return p.some((v,i)=>i%4!==3&&v>0)}),false);
await page.locator('[data-live-blackout]').click();await page.waitForTimeout(250);
assert.equal(await page.evaluate(()=>{const p=liveShow.ctx.getImageData(0,0,640,360).data;return p.some((v,i)=>i%4!==3&&v>0)}),true);
await page.screenshot({path:require('node:path').join(__dirname,'qa-live.png')});
const end=Date.now()+85000;let prior=-1;
while(Date.now()<end){
 const state=await page.evaluate(()=>({cue:liveShow.cueIndex,done:liveShow.completed,elapsed:liveShow.elapsed}));
 if(state.done)break;
 if(state.cue!==prior){await page.locator('[data-live-intensity]').fill(String([35,60,85,25][state.cue]));prior=state.cue;console.log('CUE',state.cue,Math.round(state.elapsed));}
 await page.waitForTimeout(600);
}
const live=await page.evaluate(()=>liveShow.result());assert.equal(live.completion,1);assert.ok(live.score>90);assert.equal(live.transitions,1);
await page.locator('#finish-gig-button').click();
const result=await page.evaluate(()=>({score:currentGig.lastScore,payout:currentGig.lastPayout}));assert.ok(result.payout>0);
assert.match(await page.locator('#result-content').innerText(),/60 \/ 60 s/);
await page.screenshot({path:require('node:path').join(__dirname,'qa-live-result.png')});
await page.locator('#result-close-button').click();assert.equal(await page.evaluate(()=>liveShow),null);
assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:true,live,result,errors}));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
