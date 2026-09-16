const {chromium}=require('../qa-browser.cjs'),a=require('node:assert/strict'),fs=require('fs');
(async()=>{const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});try{
 const p=await b.newPage({viewport:{width:1440,height:900}}),errors=[],checks=[];p.on('pageerror',e=>errors.push(e.stack));
 await p.goto('http://127.0.0.1:5187/');await p.locator('#studio-entry-button').click();await p.locator('#vj-name').fill('Mapping and return QA');await p.locator('#create-vj-button').click();await p.waitForTimeout(250);
 await p.evaluate(()=>{PhysicalV4.state.completed=Array.from({length:16},(_,i)=>i+1);});await p.evaluate(require('./fixture.cjs'),17);
 for(const viewport of [{width:1440,height:900},{width:1116,height:717},{width:960,height:600}]){
  await p.setViewportSize(viewport);await p.waitForTimeout(150);
  const check=await p.evaluate(()=>{const title=gigTitle.getBoundingClientRect(),name=document.querySelector('.vj-tag').getBoundingClientRect(),box=document.querySelector('.quest-title').getBoundingClientRect();const controls=[...document.querySelectorAll('.top-actions button')].filter(e=>e.getBoundingClientRect().width>0).map(e=>{const r=e.getBoundingClientRect();return{text:e.textContent,inside:r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight};});return{separate:title.bottom<=name.top,headerInside:box.left>=0&&box.right<=innerWidth,headerBottom:box.bottom,buttonsTop:document.querySelector('.top-actions').getBoundingClientRect().top,controls};});
  checks.push({viewport,...check});a(check.separate&&check.headerInside&&check.headerBottom<=check.buttonsTop,JSON.stringify(check));a(check.controls.every(c=>c.inside));
  if(viewport.width===1116)await p.screenshot({path:'documentation/physical-v4/gig-hud-1116.png'});
 }
 a.deepEqual(errors,[]);fs.writeFileSync('documentation/physical-v4/hud-results.json',JSON.stringify({checks,errors},null,2));console.log('PASS title, player name and gig buttons at 3 desktop sizes');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
