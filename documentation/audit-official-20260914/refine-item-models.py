from pathlib import Path
p=Path('src/item-models.js');b=Path('documentation/audit-official-20260914/before-fixes/src/item-models.js');b.write_bytes(p.read_bytes());s=p.read_text(encoding='utf-8')
a=s.index("  if(rank<2){",s.index("}else if(item.type==='computer')"));b=s.index(" }else if(item.type==='gpu')",a)
s=s[:a]+'''  if(item.id.includes('laptop')){
   const w=.86+rank*.14,d=.57+rank*.05,h=.5+rank*.055;
   box(w,.04+rank*.012,d,0,.035,0,rank===0?shell:metal);box(w-.035,h,.035,0,h/2+.075,-d/2+.02,black);box(w-.1,h-.07,.012,0,h/2+.075,-d/2+.042,glass);
   for(let row=0;row<4;row++)for(let col=0;col<10;col++)box(w*.065,.008,.033,-w*.39+col*w*.087,.071+rank*.012,-.17+row*.055,black);
   box(w*.27,.009,.095,0,.071+rank*.012,.18,shell);
   for(let j=0;j<rank+1;j++)box(.01,.018,.06,w/2+.003,.04,-.14+j*.095,black);
   if(rank>0)for(const x of [-w*.45,w*.45])for(let j=0;j<7;j++)box(.035,.009,.012,x,.074+rank*.012,-.15+j*.029,black);
   cyl(.01,.008,0,h+.06,-d/2+.055,black).rotation.x=Math.PI/2;
  }else{box(.45+rank*.04,1,.7,0,.5,0);for(let j=0;j<rank-1;j++){const fan=cyl(.12,.02,0,.22+j*.27,.36,black);fan.rotation.x=Math.PI/2;ring(.1,.012,0,.22+j*.27,.38,metal);}for(let j=0;j<rank;j++)box(.08,.025,.015,-.16+j*.07,.94,.36,metal);}
''' +s[b:]
a=s.index(" else if(item.type==='screen')");b=s.index(" else if(item.type==='bag')",a)
s=s[:a]+''' else if(item.type==='screen'){
  const portable=item.id.includes('portable'),w=portable?.82:rank===1?1.28:1.1,h=w*9/16;
  const y=portable?h/2+.07:h/2+.26;
  box(w,h,.055,0,y,0,black);box(w-.05,h-.05,.008,0,y,.033,glass);box(.045,.009,.005,w*.4,y-h*.45,.04,metal);
  if(portable){rod([-.27,.05,-.27],[-.27,h*.65,-.02]);rod([.27,.05,-.27],[.27,h*.65,-.02]);rod([-.27,.05,-.27],[.27,.05,-.27]);}
  else{box(.085,.3,.07,0,.16,-.03,metal);box(rank===1?.5:.38,.035,.25,0,.03,0,metal);if(rank===1){rod([-.2,.055,0],[0,.055,-.16]);rod([.2,.055,0],[0,.055,-.16]);}}
 }
 else if(item.type==='accessory'){
  const slug=item.id.replace('accessory-','');
  if(slug==='gaff-pocket'){
   const tape=ring(.22,.085,0,.09,0,black);tape.rotation.x=Math.PI/2;
   const core=ring(.143,.012,0,.096,0,cloth);core.rotation.x=Math.PI/2;
   box(.28,.012,.14,.27,.025,0,black).rotation.y=.18;
  }else if(slug==='wide-lens'){
   for(let j=0;j<5;j++){const barrel=cyl(.18+j*.007,.065,0,.24,-.13+j*.06,black);barrel.rotation.x=Math.PI/2;}
   const optic=cyl(.20,.025,0,.24,.175,glass);optic.rotation.x=Math.PI/2;
   for(const z of [-.14,.04,.18])ring(.20,.015,0,.24,z,metal);
   box(.4,.045,.38,0,.025,0,cloth);
  }else if(slug==='mapping-kit'){
   box(.9,.1,.6,0,.07,0,black);box(.9,.46,.065,0,.32,-.26,shell);
   box(.49,.34,.015,-.14,.33,-.217,metal);for(let j=0;j<5;j++)box(.36,.008,.012,-.14,.21+j*.056,-.204,black);
   for(let j=0;j<3;j++)box(.012,.28,.013,-.27+j*.12,.33,-.203,black);
   for(let j=0;j<4;j++){const marker=cyl(.018,.3,-.3+j*.11,.145,.07,j%2?glass:metal);marker.rotation.x=Math.PI/2;}
   box(.18,.07,.17,.29,.15,.12,shell);
  }else if(slug==='roadcase-pro'){
   box(1.05,.68,.63,0,.42,0,black);for(const y of [.13,.66,.78])box(1.09,.035,.67,0,y,0,metal);
   for(const x of [-.52,.52])for(const z of [-.315,.315]){box(.05,.65,.05,x,.45,z,metal);const wheel=cyl(.065,.055,x,.065,z,black);wheel.rotation.z=Math.PI/2;}
   for(const x of [-.32,.32])box(.06,.1,.025,x,.65,.34,metal);box(.27,.09,.025,0,.45,.335,metal);box(.2,.05,.027,0,.45,.35,black);
  }else if(slug==='mini-controller'){
   box(.68,.11,.44,0,.08,0,black);for(const x of [-.17,.17]){const pedal=box(.25,.045,.33,x,.16,.02,metal);pedal.rotation.x=-.15;for(let j=0;j<5;j++)box(.20,.008,.018,x,.20,.02+j*.035,black);cyl(.016,.012,x,.145,-.17,glass);}box(.08,.035,.06,0,.09,-.25,metal);
  }
 }
''' +s[b:];p.write_text(s,encoding='utf-8')
