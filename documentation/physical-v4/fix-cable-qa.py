from pathlib import Path
p=Path('src/physical-models.js');s=p.read_text(encoding='utf-8');s=s.replace("if(!['keyboard'","if(item.id!=='router-sdi-distribution'&&!['keyboard'");s=s.replace("kind==='powerbar'?.52:","kind==='splitter'?.6:kind==='powerbar'?.52:");p.write_text(s,encoding='utf-8')
p=Path('src/physical-v4.js');s=p.read_text(encoding='utf-8');s=s.replace("m.visible=true;}else{m.position", "m.visible=!firstPort;}else{m.position")
s=s.replace("c.position={...o.position,x:o.position.x+.4};", "c.position={...o.position,x:o.position.x+.75,z:o.position.z+.5};")
s=s.replace("o.homePosition||={...o.position};", "o.homePosition={...o.position};")
# Ensure huge libraries use a second row per shelf instead of overlapping instances.
s=s.replace("cell=index%16,lx=-.77+(cell%4)*.51,lz=.14;", "cell=index%16,depth=Math.floor(index/64),lx=-.77+(cell%4)*.51,lz=.14-depth*.25;")
s=s.replace("shelf?.4:", "shelf?.22:")
p.write_text(s,encoding='utf-8')
p=Path('src/physical-cables.js');s=p.read_text(encoding='utf-8').replace("false,!state.active)", "false,Boolean(deskStation?.visible))").replace("true,!state.active)", "true,Boolean(deskStation?.visible))");p.write_text(s,encoding='utf-8')
p=Path('src/studio-decor.js');s=p.read_text(encoding='utf-8');s=s.replace("[[.75,.94,7.05],[.86,.83,6.74],[.60,.59,6.76],[.28,.65,6.79]]","[[.75,.96,7.05],[.80,.97,6.53],[.78,.72,6.51],[.60,.59,6.76],[.28,.65,6.79]]");p.write_text(s,encoding='utf-8')
p=Path('src/main.js');s=p.read_text(encoding='utf-8').replace("<span>Palier ${unlockLevel}</span>","<span>${item.physical ? (item.physical.unlock ? 'Après gig '+item.physical.unlock : 'Dès le départ') : 'Palier '+unlockLevel}</span>");p.write_text(s,encoding='utf-8')
