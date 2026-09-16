from pathlib import Path
def edit(file,a,b):
 p=Path(file);s=p.read_text(encoding='utf-8-sig');assert a in s,(file,a[:80]);p.write_text(s.replace(a,b,1),encoding='utf-8')
edit('src/career-runtime.js','function captureActiveRun() {','function captureActiveRun() {\n  if(currentGig?.physical)return;')
edit('src/career-runtime.js','function resumeActiveRun() {','function resumeActiveRun() {\n  if(profile.physical?.active)return window.PhysicalV4?.resume();')
edit('src/main.js','function refreshAvailableGigPool(showNotifications = false) {','function refreshAvailableGigPool(showNotifications = false) {\n  if(window.PhysicalV4?.enabled){PhysicalCareer.migrate();return 0;}')
edit('src/main.js','function connectActiveProjector() {','function connectActiveProjector() {\n  if(currentGig?.physical){notify(\'Prends un câble physique et relie ses deux extrémités aux ports.\');return;}')
edit('src/main.js','  window.FirstShowCoach?.tick(liveDelta);', '  if(!window.PhysicalV4?.enabled)window.FirstShowCoach?.tick(liveDelta);')
edit('src/physical-core.js',"if(d.kind==='laptop'&&outs.indexOf(p)>=d.maxOutputs)","if(d.kind==='laptop'&&outs.filter(p=>upstream(s,id,p.id)).indexOf(p)>=d.maxOutputs)")
edit('src/physical-core.js',"const p=o.ports.find(p=>p.direction==='in'&&p.standard===o.input)||o.ports.find(p=>p.id==='mic');", "const p=o.ports.find(p=>p.direction==='in'&&p.standard===o.input);")
edit('src/physical-v4.js',"const indices=window.ClipCollections?.indices?.(clip);if(indices?.length)currentVideoIndex=indices[0];", "const contents=window.ClipCollections?.contents?.(clip);const chosen=contents?.[0]||videoClips.find(v=>v.styleAffinity?.includes(clip.styleTarget))||videoClips[0];if(chosen){currentVideoIndex=videoClips.indexOf(chosen);loadVideoTexture(chosen.src);}")
edit('src/physical-v4.js',"if(k==='escape'){held=null;firstPort=null;selected=null;panel.hidden=true;panelKey='';return;}","if(k==='escape'){if(held){const o=C.get(state,held);o.location=state.active?'venue':'desk';o.position=o.homePosition||o.position;held=null;dirty=true;saveSlots();}firstPort=null;selected=null;panel.hidden=true;panelKey='';return;}")
