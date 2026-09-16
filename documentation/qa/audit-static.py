from pathlib import Path
import json,hashlib,struct,re
root=Path('.');out=root/'documentation/audit-2026-09-14';out.mkdir(exist_ok=True)
sources={str(p):{'lines':len(p.read_text(encoding='utf-16' if p.read_bytes().startswith(b'\xff\xfe') else 'utf-8-sig').splitlines()),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in [*Path('src').glob('*'),Path('index.html'),Path('package.json')] if p.is_file()}
assets=[]
for folder in ['assets','assets-source','video','image']:
 for p in Path(folder).rglob('*'):
  if p.is_file():assets.append({'path':str(p),'bytes':p.stat().st_size})
models=[]
for p in Path('assets').rglob('*.glb'):
 b=p.read_bytes();size,kind=struct.unpack_from('<II',b,12);j=json.loads(b[20:20+size]);models.append({'path':str(p),'meshes':len(j.get('meshes',[])),'materials':len(j.get('materials',[])),'animations':[a.get('name','unnamed') for a in j.get('animations',[])],'skins':len(j.get('skins',[]))})
main=Path('src/main.js').read_text(encoding='utf-8');functions=re.findall(r'^function (\w+)\(',main,re.M);duplicates={f:functions.count(f) for f in set(functions) if functions.count(f)>1}
result={'sources':sources,'assets':assets,'models':models,'functions':len(functions),'duplicateMainFunctions':duplicates}
(out/'static-inventory.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'sources':len(sources),'mainLines':sources['src\\main.js']['lines'],'cssLines':sources['src\\styles.css']['lines'],'assetFiles':len(assets),'assetMiB':round(sum(x['bytes'] for x in assets)/1048576),'models':models,'duplicates':duplicates},ensure_ascii=False))

