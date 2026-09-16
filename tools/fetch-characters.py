import json,urllib.request,urllib.parse,concurrent.futures
from pathlib import Path
D=json.load(open('documentation/rocketbox-tree.json'))
choices=['Female_Adult_12','Male_Adult_12','Male_Adult_17']
files=[]
for f in D['tree']:
 p=f['path']
 if any(p.startswith('Assets/Avatars/Adults/'+n+'/') for n in choices) and (p.endswith('_facial.fbx') or p.endswith('_color.tga') or p.endswith('_normal.tga')): files.append(p)
files+=['Assets/Animations/all_animations_max_motextr_static/f_idle_breathe_01.max.fbx','Assets/Animations/all_animations_max_motextr_static/m_idle_breathe_01.max.fbx']
def dl(p):
 out=Path('assets-source/rocketbox')/p
 out.parent.mkdir(parents=True,exist_ok=True)
 if not out.exists():urllib.request.urlretrieve('https://raw.githubusercontent.com/microsoft/Microsoft-Rocketbox/master/'+urllib.parse.quote(p),out)
 return out.stat().st_size
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:sizes=list(ex.map(dl,files))
print('Downloaded',len(files),'files',sum(sizes),'bytes')
