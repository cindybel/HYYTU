from pathlib import Path
p=Path('src/main.js');s=p.read_text(encoding='utf-8').replace("  profile.orientation = 'balanced';\n  profile.settings.language", "  profile.orientation = 'balanced';\n  profile.settings.academy={lesson:0,best:0,completed:0,roomWins:[]};\n  profile.settings.language",1)
s=s.replace('if(gig?.sessionReady&&window.SessionRules)return SessionRules.reward(gig);', 'if(window.SessionRules && liveShow)return SessionRules.reward(gig);').replace('if(gig?.sessionReady&&window.SessionRules)return SessionRules.score(baseSkill,gig,run);','if(window.SessionRules && run.live)return SessionRules.score(baseSkill,gig,run);')
s=s.replace('if(currentGig.sessionReady){profile.showSessions=Number(profile.showSessions||0)+1;currentGig.lastSessionNumber=profile.showSessions;}', 'profile.showSessions=Number(profile.showSessions||0)+1;currentGig.lastSessionNumber=profile.showSessions;')
s=s.replace('Compétence acquise : ${escapeHtml(gainedSkills.join', 'Progression des compétences : ${escapeHtml(gainedSkills.join')
p.write_text(s,encoding='utf-8')
p=Path('src/academy.js');s=p.read_text(encoding='utf-8');old=" let saved={lesson:0,best:0,completed:0};try{Object.assign(saved,JSON.parse(localStorage.getItem(key)||'{}'));}catch{}\n saved.lesson=Math.max(0,Math.min(3,Number(saved.lesson)||0));"
new=''' let owner=null,saved={lesson:0,best:0,completed:0};
 function syncAcademyProfile(){
  if(owner===profile)return;
  owner=profile;profile.settings ||= {};
  if(!profile.settings.academy){
   const legacy={};if(profile.created){try{Object.assign(legacy,JSON.parse(localStorage.getItem(key)||'{}'));}catch{}}
   profile.settings.academy={lesson:0,best:0,completed:0,...legacy};
  }
  saved=profile.settings.academy;saved.lesson=Math.max(0,Math.min(3,Number(saved.lesson)||0));
 }
 syncAcademyProfile();'''
assert old in s;s=s.replace(old,new)
s=s.replace("function persist(){try{localStorage.setItem(key,JSON.stringify(saved));q('[data-save]').textContent='Apprentissage sauvegardé sur cet ordinateur.';}catch{q('[data-save]').textContent='Sauvegarde indisponible : garde cette fenêtre ouverte.';}}", "function persist(){if(owner!==profile)return;q('[data-save]').textContent=saveSlots()===false?'Sauvegarde indisponible : garde cette fenêtre ouverte.':'Apprentissage sauvegardé dans cette carrière.';}")
s=s.replace("launch.onclick=()=>{quick=false;", "launch.onclick=()=>{syncAcademyProfile();q('[data-volume]').value=saved.preferences?.volume??35;q('[data-still]').checked=Boolean(saved.preferences?.still);quick=false;")
p.write_text(s,encoding='utf-8')
p=Path('documentation/audit-official-20260914/dmteam-projector-tests.cjs');s=p.read_text(encoding='utf-8').replace("profile.studioWorld.x=1.6;profile.studioWorld.z=8.5;profile.studioWorld.yaw=-.45", "profile.studioWorld.x=4;profile.studioWorld.z=8.1;profile.studioWorld.yaw=.6");p.write_text(s,encoding='utf-8')
