from pathlib import Path
def edit(file,a,b):
 p=Path(file);s=p.read_text(encoding='utf-8-sig');assert a in s,(file,a[:90]);p.write_text(s.replace(a,b,1),encoding='utf-8')
edit('src/main.js',"['cable', 'Fils video'],", "['cable', 'Câbles vidéo, audio et alimentation'],\n    ['converter', 'Convertisseurs SDI'], ['audio', 'Micros et audio'], ['keyboard', 'Claviers'], ['mouse', 'Souris'], ['power', 'Distribution électrique'], ['surface', 'Écrans de projection'], ['support', 'Supports et sécurité'],")
edit('src/catalog-browser.js',"!i.physicalDisabled&&(!q", "!i.physicalDisabled&&(!state.available||!window.PhysicalCareer?.unlockItem(i))&&(!q")
edit('src/physical-v4.js',"o.location==='vehicle'||o.location==='bag'&&ids.has(o.container)", "o.location==='vehicle'&&['projector','tower','surface','stand','monitor','container'].includes(C.spec(o.modelId).kind)||o.location==='bag'&&ids.has(o.container)")
edit('src/physical-v4.js',"if(!present(o))continue;const root=", "if(!present(o))continue;const root=")
edit('src/physical-v4.js',"root.add(m);const ports=", "root.add(m);if(C.spec(o.modelId).kind==='surface'){const display=new THREE.Mesh(new THREE.PlaneGeometry(1.05,1.05),new THREE.MeshBasicMaterial({color:0xffffff,map:testCardTexture}));display.name='workshop-projection';display.position.set(0,1.26,.03);root.add(display);}const ports=")
edit('src/physical-v4.js',"o.placed=true;}if(result", "o.placed=true;}if(kind==='surface')o.placed=true;if(result")
edit('src/physical-v4.js',"cableGeometry();objectPanel();const meter", "if(!state.active){const live=state.objects.find(o=>C.spec(o.modelId).kind==='projector'&&o.location==='desk'&&C.signal(state,o.uid).valid);for(const o of state.objects.filter(o=>C.spec(o.modelId).kind==='surface')){const screen=models.get(o.uid)?.getObjectByName('workshop-projection');if(screen){screen.visible=o.location==='desk';screen.material.map=live?clipTexture:testCardTexture;screen.material.color.setHex(live?0xffffff:0x222222);}}}cableGeometry();objectPanel();const meter")
# Surface placement is saved even before the first paid gig.
edit('src/physical-v4.js',"if(k==='escape'){", "if(k==='escape'){")
# Every type gets an explicit row; obsolete controller entries are hidden by catalogue filtering.
