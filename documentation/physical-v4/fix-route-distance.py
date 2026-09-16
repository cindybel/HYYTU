from pathlib import Path
p=Path('src/physical-v4.js');s=p.read_text(encoding='utf-8');s=s.replace("function cableGeometry(){", "C.cableDistance=(s,c,a,b,override)=>PhysicalCables.measure(models,s,c,a,b,override);\n function cableGeometry(){")
s=s.replace("const clip=shopItems.find(i=>i.id===state.selectedClips[0]);", "const clip=shopItems.find(i=>state.selectedClips.includes(i.id)&&i.styleTarget===g.style)||shopItems.find(i=>i.id===state.selectedClips[0]);")
s=s.replace("<h3>Contenu avant gig ·", "<p>Style demandé : ${escapeHtml(getStyleMeta(g.style).label)}</p><h3>Contenu avant gig ·")
p.write_text(s,encoding='utf-8')
p=Path('src/physical-core.js');s=p.read_text(encoding='utf-8')
s=s.replace("if(distance(aa.object.position,bb.object.position)>d.length+.001)return fail('Câble trop court : '+d.length+' m.');", "const reach=root.PhysicalCore?.cableDistance?.(s,c,a,b)??distance(aa.object.position,bb.object.position);if(reach>d.length+.001)return fail('Câble trop court : '+d.length+' m pour un trajet de '+reach.toFixed(1)+' m.');")
s=s.replace("if(other&&distance(position,other.position)>spec(c.modelId).length)", "if(other&&(root.PhysicalCore?.cableDistance?.(s,c,l.a,l.b,{uid:id,position})??distance(position,other.position))>spec(c.modelId).length)")
p.write_text(s,encoding='utf-8')
