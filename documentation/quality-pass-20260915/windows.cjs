const {chromium}=require('../qa-browser.cjs'),assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});try{
 const p=await b.newPage({viewport:{width:1280,height:900}}),errors=[],checks=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:5181/');await p.locator('#studio-entry-button').click();await p.locator('#vj-name').fill('Fenêtres QA');await p.locator('#create-vj-button').click();await p.waitForFunction(()=>player.userData.loaded);
 await p.evaluate(()=>{StudioWorld.showComputer();profile.settings.reducedMotion=true;profile.settings.windowBounds={width:680,height:520};openApp('files');});
 async function visible(name){const r=await p.locator('#app-window').boundingBox(),s=p.viewportSize();assert(r&&r.x>=0&&r.y>=0&&r.x+r.width<=s.width+1&&r.y+r.height<=s.height+1,JSON.stringify({name,r,s}));for(const cls of ['red','yellow','green'])assert(await p.locator('#app-window .traffic.'+cls).isVisible());checks.push({name,r,s});}
 await visible('initial');
 for(const [x,y] of [[2500,1700],[-500,-500]]){const h=await p.locator('#app-window .app-heading').boundingBox();await p.mouse.move(h.x+60,h.y+20);await p.mouse.down();await p.mouse.move(x,y,{steps:8});await p.mouse.up();await visible('drag-'+x);}
 const before=await p.locator('#app-window').boundingBox();await p.locator('#app-window .traffic.green').click();await visible('maximized');const max=await p.locator('#app-window').boundingBox();assert(max.width>before.width);
 await p.locator('#app-window .traffic.green').click();await visible('restored');assert(Math.abs((await p.locator('#app-window').boundingBox()).width-before.width)<2);
 await p.locator('#app-window .traffic.yellow').click();await p.locator('#app-window').waitFor({state:'hidden'});await p.locator('.app-button[data-app=files]').click();await visible('reopened from taskbar');
 await p.setViewportSize({width:390,height:844});await visible('small viewport');await p.locator('#app-window .traffic.green').click();await visible('small maximize');await p.locator('#app-window .traffic.green').click();await visible('small restore');
 await p.setViewportSize({width:1280,height:900});await p.locator('#app-window .traffic.red').click();await p.locator('.relax-game-icon').click();await p.locator('.relax-game-window').waitFor({state:'visible'});
 for(const size of [{width:1280,height:900},{width:390,height:844}]){await p.setViewportSize(size);const r=await p.locator('.relax-game-window').boundingBox();assert(r.x>=0&&r.y>=0&&r.x+r.width<=size.width+1&&r.y+r.height<=size.height+1,JSON.stringify({size,r}));}
 await p.locator('[data-relax-close]').click();assert.deepEqual(errors,[]);fs.writeFileSync('documentation/quality-pass-20260915/windows.json',JSON.stringify({checks,errors},null,2));console.log('PASS: window drag bounds, maximize/restore, minimize/taskbar restore, viewport shrinking, Pause window at desktop and mobile sizes');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
