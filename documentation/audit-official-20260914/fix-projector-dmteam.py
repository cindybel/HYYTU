from pathlib import Path
for f in ['src/club-atmosphere.js','src/academy.js']:
 p=Path(f);b=Path('documentation/audit-official-20260914/before-fixes')/f
 if not b.exists():b.write_bytes(p.read_bytes())
p=Path('src/main.js');s=p.read_text(encoding='utf-8');s=s.replace("  if (stageGroup) stageGroup.visible = !choosingLook;", "  // Contract rigs belong to the venue, never to the smaller studio shell.\n  if (stageGroup) stageGroup.visible = !choosingLook && !document.body.classList.contains('screen-desktop');")
s=s.replace('function saveSlots() {\n  captureActiveRun();','function saveSlots() {\n  if(profile?.godMode)profile.money=GOD_MODE_MONEY;\n  captureActiveRun();')
s=s.replace("  profile.money = 75;\n  addEmail('Maman'", "  profile.money = 75;\n  const dmteam=name.replace(/^vj\\s+/i,'').trim().toLowerCase()==='dmteam';\n  if(dmteam)activateGodMode();\n  addEmail('Maman'",1)
s=s.replace("  notify('Carriere creee. Tu commences dans le garage avec 75$.');", "  notify(dmteam?'DMTEAM : argent illimité, tous les objets et contrats débloqués, compétences au maximum.':'Carriere creee. Tu commences dans le garage avec 75$.');",1)
s=s.replace("profile.skills = Object.fromEntries(skillCatalog.map((skill) => [skill.id, 3]));", "profile.skills = Object.fromEntries(skillCatalog.map((skill) => [skill.id, 5]));\n  profile.settings.progression={version:1,skillXp:Object.fromEntries(skillCatalog.map(skill=>[skill.id,1200])),learning:Object.fromEntries(['mix','wall','energy','cable','client','contract'].map(id=>[id,true])),practiceLog:{},history:[],legacyLearningMigrated:true};")
s=s.replace("if (item.stackable || ['cable', 'adapter'].includes(item.type)) profile.inventory[item.id] = 6;", "if (item.stackable || item.category==='gear') profile.inventory[item.id] = 6;")
s=s.replace('  const bankTransfer = window.VJBank?.record(amount, label, details);', '  if(profile.godMode)profile.money=GOD_MODE_MONEY;\n  const bankTransfer = window.VJBank?.record(amount, label, details);')
p.write_text(s,encoding='utf-8')
p=Path('src/club-atmosphere.js');s=p.read_text(encoding='utf-8');a=s.index('/* Final garage cleanup:');b=s.index('/* Live completion bridge.',a);s=s[:a]+'''/* StudioLife owns the physical studio projector. Venue rigs are hidden by
   updateSceneContextVisibility; spatial deletion must not remove owned gear. */

'''+s[b:];p.write_text(s,encoding='utf-8')
p=Path('src/studio-journey.js');s=p.read_text(encoding='utf-8').replace('const projectorX=4.05,projectorZ=10.15;', 'const projectorX=2.8,projectorZ=6.25;');s=s.replace("const model=fitModel(projectorData.model,.86);model.position.set(projectorX,1.12,projectorZ);model.rotation.y=-Math.PI/2;equipment.add(model);", "const model=fitModel(projectorData.model,.86);model.name='Studio equipped projector';model.rotation.y=Math.PI;\n   const bounds=new THREE.Box3().setFromObject(model);model.position.set(projectorX,1.12-bounds.min.y,projectorZ);equipment.add(model);")
s=s.replace("box(.09,.96,.09,projectorX,.6,projectorZ,mat(0x5a646a,.45,.55));", "box(.09,.96,.09,projectorX,.6,projectorZ,mat(0x5a646a,.45,.55));\n box(.9,.08,.8,projectorX,1.08,projectorZ,mat(0x424a4e,.55,.4));")
p.write_text(s,encoding='utf-8')
p=Path('src/academy.js');s=p.read_text(encoding='utf-8').replace("i>0&&!wins.includes(i-1)?'disabled':''", "i>0&&!wins.includes(i-1)&&!profile?.godMode?'disabled':''");p.write_text(s,encoding='utf-8')
p=Path('src/bank.js');s=p.read_text(encoding='utf-8').replace('${money(profile.money)}</h2><p>Solde disponible', "${profile.godMode?'∞':money(profile.money)}</h2><p>${profile.godMode?'Argent illimité · tous les déblocages':'Solde disponible'}");p.write_text(s,encoding='utf-8')
