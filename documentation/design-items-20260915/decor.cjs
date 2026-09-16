const {chromium}=require('../qa-browser.cjs'),fs=require('node:fs'),assert=require('node:assert/strict');
const stage=process.argv[2]||'after';
(async()=>{const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});try{
 const p=await b.newPage({viewport:{width:1440,height:900}}),dir='documentation/design-items-20260915',errors=[],rows=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:5181/');await p.locator('#studio-entry-button').click();await p.locator('#vj-name').fill('Studio design');await p.locator('#create-vj-button').click();await p.waitForFunction(()=>player.userData.loaded);
 const homes=await p.evaluate(()=>[{id:'garage',label:profile.housing.type},...shopItems.filter(i=>i.category==='housing').map(i=>({id:i.id,label:i.label}))]);
 for(const h of homes){await p.evaluate(h=>{profile.housing.type=h.label;StudioWorld.enter();profile.studioWorld.x=0;profile.studioWorld.z=10.8;profile.studioWorld.yaw=0;profile.studioWorld.pitch=-.03;StudioSet.refreshHome();},h);await p.waitForTimeout(150);
  for(const angle of [0,Math.PI]){await p.evaluate(angle=>profile.studioWorld.yaw=angle,angle);await p.waitForTimeout(80);if(['garage','housing-artist-loft','housing-penthouse'].includes(h.id))await p.screenshot({path:dir+'/'+stage+'-'+h.id+'-'+(angle?'windows':'workstation')+'.png'});}
  const data=await p.evaluate(()=>({bounds:StudioLayouts.bounds,draws:renderer.info.render.calls,triangles:renderer.info.render.triangles,decor:window.StudioDecor?.group?.children.length||0}));assert(data.bounds.every(b=>[b.minX,b.maxX,b.minZ,b.maxZ].every(Number.isFinite)),h.id);rows.push({...h,...data});
 }
 assert.deepEqual(errors,[]);fs.writeFileSync(dir+'/'+stage+'-decor.json',JSON.stringify({rows,errors},null,2));console.log('PASS: 11 room layouts rendered, valid furnishing bounds, no JavaScript errors');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
