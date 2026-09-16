from pathlib import Path
import shutil
root=Path.cwd(); backup=root/'documentation/audit-official-20260914/before-fixes'; backup.mkdir(exist_ok=True)
files=['src/main.js','src/studio-world.js','src/studio-journey.js','tools/Lancer-VJ-Simulator.ps1']
for f in files:
 dst=backup/f; dst.parent.mkdir(parents=True,exist_ok=True)
 if not dst.exists(): shutil.copy2(root/f,dst)
p=root/'src/main.js'; s=p.read_text(encoding='utf-8'); s=s.replace("function advanceDay() {\n  if (!hasCompletedToday()) {", "function advanceDay({ fromWorld = false } = {}) {\n  if (!fromWorld && !hasCompletedToday()) {")
s=s.replace("  const dueGig = getDueGig();\n  if (dueGig) {", "  const dueGig = getDueGig();\n  if (!fromWorld && dueGig) {")
s=s.replace("  profile.day += 1;\n  profile.energyLog", "  profile.day += 1;\n  if (!fromWorld && profile.studioWorld) {\n    profile.studioWorld.seconds = (profile.day - 1) * 86400 + profile.studioWorld.seconds % 86400;\n  }\n  profile.energyLog",1)
s=s.replace("  saveSlots();\n  renderDesktop();\n}\n\nfunction getDueGig", "  saveSlots();\n  if (!fromWorld) renderDesktop();\n  else updateProfileChrome();\n}\n\nfunction getDueGig",1);p.write_text(s,encoding='utf-8')
p=root/'src/studio-world.js';s=p.read_text(encoding='utf-8');s=s.replace('  profile.studioWorld=state;', '''  // Keep the saved career date authoritative when loading pre-unified clocks.
  state.seconds=(Math.max(1,Number(profile.day)||1)-1)*86400+state.seconds%86400;
  profile.studioWorld=state;''')
s=s.replace('function advanceWorld(seconds){init();const amount=Math.max(0,Number(seconds)||0);state.seconds=Math.max(0,state.seconds+amount);return state.seconds;}', '''function advanceWorld(seconds){
  init();const numeric=Number(seconds),amount=Number.isFinite(numeric)?Math.max(0,numeric):0;
  const beforeDay=Math.floor(state.seconds/86400);
  state.seconds+=amount;
  const crossed=Math.floor(state.seconds/86400)-beforeDay;
  // All time sources (walking, computer, sleep) use the same daily bookkeeping.
  for(let i=0;i<crossed;i++)advanceDay({fromWorld:true});
  if(crossed)window.dispatchEvent(new Event('vj-world-day'));
  return state.seconds;
 }''');p.write_text(s,encoding='utf-8')
p=root/'src/studio-journey.js';s=p.read_text(encoding='utf-8');start=s.index('  for(let i=0;i<crossed;i++){');end=s.index('  if(profile?.stats)',start);s=s[:start]+s[end:];p.write_text(s,encoding='utf-8')
p=root/'tools/Lancer-VJ-Simulator.ps1';s=p.read_text(encoding='utf-8');s=s.replace("$pythonPath =", "$expectedIndex = [System.IO.File]::ReadAllText((Join-Path $projectPath 'index.html'))\n$pythonPath =",1);s=s.replace('return $page.Content.Contains(\'id="studio-entry-button"\') -and $page.Content.Contains(\'VJ\')', '''# A different VJ project can use the same UI IDs. Compare this build's index.
        return $page.Content.Replace("`r`n", "`n") -ceq $expectedIndex.Replace("`r`n", "`n")''');s=s.replace('5173..5180','5173..5190').replace('?build=library48-20260914','?build=official-integration');p.write_text(s,encoding='utf-8-sig')
