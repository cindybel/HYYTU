from pathlib import Path
p=Path('src/physical-v4.js');s=p.read_text(encoding='utf-8')
s=s.replace("['shelf','desk'].includes(o.location)&&!state.links", "['shelf','desk'].includes(o.location)&&!o.installed.length&&!C.content(state,o.uid).length&&!state.links")
old="state.objects=state.objects.filter(o=>o.owner!=='rental');"
# Two return paths share the same cleanup, including personal gear inside rented bags.
s=s.replace(old,"returnRentals();")
at=s.index(' function cancel(){')
s=s[:at]+""" function returnRentals(){const rented=new Set(state.objects.filter(o=>o.owner==='rental').map(o=>o.uid));let index=state.objects.filter(o=>o.location==='shelf'&&o.owner==='player').length;for(const o of state.objects){if(o.owner==='player'&&rented.has(o.container)){o.location='shelf';o.position=shelfPosition(index++);delete o.container;}}state.objects=state.objects.filter(o=>o.owner!=='rental');}
"""+s[at:]
p.write_text(s,encoding='utf-8')
