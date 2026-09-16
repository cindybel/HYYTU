from pathlib import Path
p=Path('src/physical-v4.js');s=p.read_text(encoding='utf-8').replace("if(C.spec(i.id).kind==='container')o.position={x:4.1+(count%2)*.8,y:.2,z:11.8};", "if(C.spec(i.id).kind==='container'){const bags=state.objects.filter(x=>C.spec(x.modelId).kind==='container'&&x.uid!==o.uid).length;o.position={x:3.75+(bags%3)*.77,y:.18,z:11.05+Math.floor(bags/3)*.78};}")
p.write_text(s,encoding='utf-8')
