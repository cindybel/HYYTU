const {chromium}=require('../qa-browser.cjs'),assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});try{
 const p=await b.newPage({viewport:{width:1400,height:1100}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:5181/documentation/quality-pass-20260915/apercu.html');
 for(const width of [1400,390]){await p.setViewportSize({width,height:1100});for(let i=0;i<7;i++){await p.locator('nav button').nth(i).click();await p.waitForFunction(()=>{const i=document.querySelector('#capture');return i.complete&&i.naturalWidth>0});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}}
 await p.setViewportSize({width:1400,height:1100});await p.locator('nav button').nth(2).click();await p.waitForFunction(()=>document.querySelector('#capture').complete);await p.screenshot({path:'documentation/quality-pass-20260915/review-preview.png',fullPage:true});
 for(const a of await p.locator('a').evaluateAll(es=>es.map(a=>a.href).filter(h=>h.startsWith(location.origin)))){const response=await p.request.get(a);assert.equal(response.status(),200,a);}
 assert.deepEqual(errors,[]);console.log('PASS: seven actual screenshots load, review tabs work, local links resolve, no horizontal overflow at 1400 or 390px');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
