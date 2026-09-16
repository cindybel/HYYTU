from pathlib import Path
p=Path('src/physical-v4.js');s=p.read_text(encoding='utf-8')
s=s.replace("rotation:o.rotation,container:o.container})),fee", "rotation:o.rotation,container:o.container,ports:structuredClone(o.ports),installed:[...o.installed]})),fee")
s=s.replace("const map=g.maskRequired?", "const mirror=![5,6,9,23].includes(g.number)||new Set(signals.filter(x=>x.valid).map(x=>x.channel)).size===1;const map=g.maskRequired?")
s=s.replace("if(!work){score=", "if(!mirror){score=Math.min(score,69);reasons.push('Une distribution du même signal est demandée');}if(clips.count<g.clipMinimum){score=Math.min(score,69);reasons.push('Clips sélectionnés insuffisants');}if(g.number===24&&clips.matching<6){score=Math.min(score,69);reasons.push('Six clips du style demandé sont requis');}if(!work){score=")
s=s.replace("if(!dress)reasons.push('Dress code non respecté');", "if(!dress){score=Math.min(score,69);reasons.push('Dress code non respecté');}")
p.write_text(s,encoding='utf-8')
p=Path('src/main.js');s=p.read_text(encoding='utf-8').replace("if (currentApp === 'skills') renderSkills();","if (currentApp === 'skills') window.PhysicalV4?.enabled ? PhysicalCareer.skills() : renderSkills();").replace("if (currentApp === 'stats') renderStats();","if (currentApp === 'stats') window.PhysicalV4?.enabled ? PhysicalCareer.stats() : renderStats();");p.write_text(s,encoding='utf-8')
p=Path('src/physical-core.js');s=p.read_text(encoding='utf-8').replace("'HDMI','SDI',280,21","'HDMI','SDI',250,21").replace("kind:'splitter',price:65","kind:'splitter',price:70").replace("1×4',price:190","1×4',price:220").replace("kind:'matrix',price:450","kind:'matrix',price:520").replace("StageMic',price:65","StageMic',price:55").replace("4 voies',price:120","4 voies',price:140").replace("Support projecteur + élingue',price:80","Support projecteur + élingue',price:103")
# Prevent cards in two places at once.
s=s.replace("if(!b.open)return fail(", "if(o.location==='installed')return fail('Retire la carte de la tour avant de la ranger.');if(!b.open)return fail(")
p.write_text(s,encoding='utf-8')
