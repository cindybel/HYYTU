from pathlib import Path
p=Path('src/physical-v4.js');s=p.read_text(encoding='utf-8').replace("if(!o||o.modelId==='venue-outlet')return;if(held", "if(!o||o.modelId==='venue-outlet')return;if(o.location==='installed'&&!result(C.uninstall(state,id)))return;if(held")
s=s.replace("if(d.kind==='lens')held=null;persist();", "if(d.kind==='lens'){held=null;selected=target.uid;}persist();")
s=s.replace("if(result(C.install(state,held,target.uid))){held=null;persist();}", "if(result(C.install(state,held,target.uid))){held=null;selected=target.uid;persist();}")
p.write_text(s,encoding='utf-8')
