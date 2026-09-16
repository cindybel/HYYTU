const a=require('node:assert/strict'),fs=require('fs');global.window=global;require('../../assets/vendor/three-v150.js');require('../../src/physical-cables.js');
const v=(x,y,z)=>new THREE.Vector3(x,y,z);
const cases=[
['table to table',v(-.6,1.1,7.5),v(.7,1.1,7.5),v(0,0,1),v(0,0,1)],
['table to floor right',v(0,1.1,7.5),v(3,.3,7.5),v(0,0,1),v(0,0,1)],
['table to floor back',v(0,1.1,7.5),v(0,.3,6),v(0,0,-1),v(0,0,1)],
['table to floor front',v(0,1.1,7.5),v(0,.3,10),v(0,0,1),v(0,0,1)],
['floor to table',v(0,.3,10),v(0,1.1,7.5),v(0,0,1),v(0,0,1)],
['very close ports',v(0,.01,0),v(.001,.01,0),v(0,0,1),v(0,0,1)],
];
const results=[];for(const [name,ap,bp,ad,bd] of cases){const curve=PhysicalCables.route({point:ap,direction:ad},{point:bp,direction:bd},10,true),geometry=new THREE.TubeGeometry(curve,128,.017,7,false),p=geometry.attributes.position;let crossings=0;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);a([x,y,z].every(Number.isFinite),name+' invalid vertex');if(x>-2.225&&x<2.225&&z>6.625&&z<8.275&&y>.83&&y<.92)crossings++;}results.push({name,crossings,length:curve.getLength()});a.equal(crossings,0,name+' crosses the desktop');}
console.log(results);fs.writeFileSync('documentation/physical-v4/cable-collision-results.json',JSON.stringify(results,null,2));
