from pathlib import Path
p=Path('src/physical-cables.js');s=p.read_text(encoding='utf-8')
s=s.replace("cols=Math.min(5,o.ports.length),rows=Math.ceil(o.ports.length/5);", "cols=Math.min(PhysicalCore.spec(o.modelId).kind==='outlet'?12:PhysicalCore.spec(o.modelId).kind==='powerbar'?7:5,o.ports.length),rows=Math.ceil(o.ports.length/cols);")
s=s.replace("i%5-(cols-1)/2", "i%cols-(cols-1)/2").replace("Math.floor(i/5)-(rows-1)/2", "Math.floor(i/cols)-(rows-1)/2")
s=s.replace("function path(a,b,length,garage){", "function path(a,b,length,garage,floorY=.023){\n  const floor=Math.max(.023,floorY);")
start=s.index(' function path(');end=s.index(' function draw(',start);part=s[start:end].replace("-.026","-floor").replace("Math.max(.026,","Math.max(floor,").replace("Math.max(.023,p.y)","Math.max(floor,p.y)");s=s[:start]+part+s[end:]
s=s.replace("function draw(parent,id,a,b,definition,loose,garage){", "function draw(parent,id,a,b,definition,loose,garage,floorY){")
s=s.replace("+loose+garage;", "+loose+garage+floorY;").replace("path(a,b,definition.length,garage)", "path(a,b,definition.length,garage,floorY)")
s=s.replace("Boolean(deskStation?.visible));active.add", "Boolean(deskStation?.visible),StudioSet.group.visible?.185:.023);active.add")
s=s.replace("function routeLength(a,b,length,garage){return path(a,b,length,garage).getLength();}", "function routeLength(a,b,length,garage){return path(a,b,length,garage,StudioSet.group.visible?.185:.023).getLength();}")
p.write_text(s,encoding='utf-8')
p=Path('src/physical-v4.js');s=p.read_text(encoding='utf-8').replace("shelf?.22:d.kind==='surface'", "shelf?.22:d.kind==='outlet'?1.05:d.kind==='powerbar'?.65:d.kind==='surface'");p.write_text(s,encoding='utf-8')
