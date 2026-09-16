const {chromium}=require('C:/Users/VJs DMTeam/AppData/Local/Temp/vj-simulator-qa/node_modules/playwright');const assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});try{
 const p=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:5181/');await p.locator('#studio-entry-button').click();await p.locator('#vj-name').fill('dmteam');await p.locator('#create-vj-button').click();
 const ids=await p.evaluate(()=>shopItems.filter(i=>i.category==='housing').map(i=>i.id)),rows=[];
 for(const id of ids){
  await p.evaluate(()=>StudioWorld.showComputer());await p.locator('.desktop-icon[data-app="housing"]').click();await p.locator(`[data-home-move="${id}"]`).click();await p.locator('#leave-studio-computer').click();await p.waitForTimeout(650);
  const paths=await p.evaluate(()=>{
   const blocked=(x,z)=>StudioSet.blocked(x,z)||StudioStorage.blocked(x,z)||StudioWardrobe.blocked(x,z)||StudioLife.blocked(x,z);
   const free=(x,z)=>x>=-6&&x<=6&&z>=4.75&&z<=13.3&&![[0,0],[.22,0],[-.22,0],[0,.22],[0,-.22]].some(([dx,dz])=>blocked(x+dx,z+dz));
   const points=[],seen=new Set(),queue=[[-1.25,10.4]];for(let i=0;i<queue.length;i++){const [x,z]=queue[i],key=`${x.toFixed(2)}:${z.toFixed(2)}`;if(seen.has(key)||!free(x,z))continue;seen.add(key);points.push({x,z});for(const [dx,dz]of [[.2,0],[-.2,0],[0,.2],[0,-.2]])queue.push([x+dx,z+dz]);}
   return {count:points.length,wardrobe:points.some(s=>StudioWardrobe.near(s)),storage:points.some(s=>StudioStorage.near(s)),bed:points.some(s=>StudioLife.hint(s)?.label.includes('Dormir')),projector:points.some(s=>StudioLife.hint(s)?.label.includes('projecteur')),computer:points.some(s=>Math.hypot(s.x-.35,s.z-8.9)<1.5),exit:points.some(s=>Math.hypot(s.x-5.75,s.z-11.25)<.8),bounds:StudioLayouts.bounds};
  });
  for(const key of ['wardrobe','storage','bed','projector','computer','exit'])assert(paths[key],`${id}: ${key} unreachable`);
  const first=paths.bounds.find(b=>b.minZ>11);await p.evaluate(x=>{profile.studioWorld.x=x;profile.studioWorld.z=10.6;profile.studioWorld.yaw=0;profile.studioWorld.pitch=0;},(first.minX+first.maxX)/2);await p.keyboard.down('s');await p.waitForTimeout(1600);await p.keyboard.up('s');
  const walked=await p.evaluate(()=>({x:profile.studioWorld.x,z:profile.studioWorld.z}));assert(walked.z>10.8);assert(walked.z<first.minZ,`${id}: walked through furniture`);assert(!paths.bounds.some(b=>walked.x>b.minX&&walked.x<b.maxX&&walked.z>b.minZ&&walked.z<b.maxZ));
  await p.evaluate(()=>{profile.studioWorld.x=1.8;profile.studioWorld.z=9.6;profile.studioWorld.yaw=2.9;profile.studioWorld.pitch=-.13;});await p.waitForTimeout(200);
  if(['housing-micro-room','housing-shared-studio','housing-penthouse'].includes(id))await p.screenshot({path:`documentation/audit-official-20260914/layout-${id}.png`});rows.push({id,...paths,walked});
 }
 // A genuine mouse click on the wardrobe must not leave the rental visit.
 await p.evaluate(()=>StudioWorld.showComputer());await p.locator('.desktop-icon[data-app="housing"]').click();await p.locator('[data-home-preview]').first().click();await p.waitForTimeout(650);
 await p.mouse.move(500,440);await p.mouse.down();await p.mouse.move(814,440,{steps:8});await p.mouse.up();await p.waitForTimeout(150);
 const point=await p.evaluate(()=>{const v=new THREE.Vector3(-4.55,1.5,12.1).project(camera);return{x:(v.x+1)*innerWidth/2,y:(1-v.y)*innerHeight/2}});await p.mouse.click(point.x,point.y);await p.waitForTimeout(150);assert.equal(await p.evaluate(()=>currentApp),null);assert(await p.locator('#home-visit-back').isVisible());await p.keyboard.press('Escape');
 assert.deepEqual(errors,[]);fs.writeFileSync('documentation/audit-official-20260914/layout-tests.json',JSON.stringify({rows,wardrobeClickInVisit:'stays in visit',errors},null,2));console.log('10 layouts: all six essential destinations reachable; furniture stops actual keyboard movement; wardrobe click keeps visit isolated');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
