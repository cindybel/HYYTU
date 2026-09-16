from pathlib import Path
p=Path('src/physical-v4.js');s=p.read_text(encoding='utf-8')
s=s.replace("${d.kind==='matrix'?`<button data-route>Router entrée ${o.route} → sorties</button>`:''}", "${d.kind==='matrix'?o.ports.filter(p=>p.direction==='out').map(p=>`<button data-route=\"${p.id}\">OUT ${p.id.slice(3)} ← IN ${o.routes?.[p.id]||o.route||1}</button>`).join(''):''}${d.kind==='tower'?o.installed.map(id=>`<button data-uninstall=\"${id}\">Retirer ${escapeHtml(item(C.get(state,id)?.modelId).label)}</button>`).join(''):''}")
s=s.replace("panel.querySelector('[data-route]')?.addEventListener('click',()=>{o.route=o.route%4+1;persist();});", "panel.querySelectorAll('[data-route]').forEach(b=>b.onclick=()=>result(C.setRoute(state,o.uid,b.dataset.route,(o.routes?.[b.dataset.route]||o.route||1)%4+1)));panel.querySelectorAll('[data-uninstall]').forEach(b=>b.onclick=()=>result(C.uninstall(state,b.dataset.uninstall)));")
s=s.replace("if(target&&target.uid!==held&&C.spec", "if(target&&d.kind==='gaffer'&&C.spec(target.modelId).kind==='cable'){if(result(C.secure(state,target.uid,o.uid)))notify('Câble fixé au sol. Prends le câble pour retirer le gaffer.');return;}\n   if(target&&target.uid!==held&&C.spec")
s=s.replace("<p>${d.quality} ·", "<p>${o.secured?'Fixé au gaffer · ':''}${d.quality} ·")
p.write_text(s,encoding='utf-8')
p=Path('src/physical-core.js');s=p.read_text(encoding='utf-8')
s=s.replace(" const spec=id=>", " define('accessory-gaff-pocket',{kind:'gaffer',label:'StageTack — gaffer',price:18,weightKg:.2,volumeUnits:1,unlock:0});\n const spec=id=>")
s=s.replace("if(c)delete c.looseEnd;", "if(c){delete c.looseEnd;delete c.secured;}")
s=s.replace("const other=get(s,l.a.device===id?", "const fixed=get(s,l.cable);if(fixed?.secured&&distance(position,o.position)>.15)return fail('Retire le gaffer avant de déplacer cet appareil.');const other=get(s,l.a.device===id?")
at=s.index(' root.PhysicalCore=')
s=s[:at]+""" function secure(s,cableId,tapeId){const cable=get(s,cableId),tape=get(s,tapeId);if(!cable||!tape||spec(tape.modelId).kind!=='gaffer'||tape.location!=='hand')return fail('Prends le rouleau de gaffer.');if(!s.links.some(l=>l.cable===cableId))return fail('Branche le câble avant de le fixer.');cable.secured=true;return{ok:true};}
"""+s[at:]
s=s.replace("uninstall,setRoute};","uninstall,setRoute,secure};")
p.write_text(s,encoding='utf-8')
p=Path('src/physical-outputs.js');s=p.read_text(encoding='utf-8')
s=s.replace("state.objects.filter(o=>state.active.ids.includes(o.uid)&&C.spec(o.modelId).kind==='projector').map(o=>C.signal(state,o.uid)).filter(s=>s.valid).map(s=>s.channel)", "state.objects.filter(o=>state.active.ids.includes(o.uid)&&['laptop','tower'].includes(C.spec(o.modelId).kind)).flatMap(o=>o.ports.filter(p=>p.direction==='out'&&['HDMI','DP','USB-C','VGA','SDI'].includes(p.standard)).map(p=>o.uid+':'+p.id))")
p.write_text(s,encoding='utf-8')
