/* Placement uses actual solid mesh tops, including every shelf level. */
window.PhysicalPlacement=(()=>{
 let solids=[],scanned=0,last=null;const pad=.008;
 const outline=new THREE.Box3Helper(new THREE.Box3(),0xef7067);outline.visible=false;outline.material.depthTest=false;outline.renderOrder=900;scene.add(outline);
 function visible(n){for(;n;n=n.parent)if(!n.visible)return false;return true;}
 function onHeld(n){for(;n;n=n.parent)if(n.userData.uid===window.PhysicalV4?.held)return true;return false;}
 function surfaces(){if(performance.now()-scanned>150){scanned=performance.now();solids=[];scene.updateMatrixWorld(true);scene.traverse(n=>{if(n.isMesh&&n.userData.placementSurface&&visible(n)&&!onHeld(n))solids.push({mesh:n,box:new THREE.Box3().setFromObject(n),name:n.userData.placementSurface});});}return solids;}
 function boxAt(o,model,p){const old=model.position.clone(),rot=model.rotation.clone();model.position.copy(p);model.rotation.set(0,o.rotation||0,0);model.updateMatrixWorld(true);const b=new THREE.Box3().setFromObject(model.children[0]);model.position.copy(old);model.rotation.copy(rot);model.updateMatrixWorld(true);return b;}
 function inspect(o,model,p){const b=boxAt(o,model,p),all=surfaces(),cover=s=>b.min.x>=s.box.min.x+.006&&b.max.x<=s.box.max.x-.006&&b.min.z>=s.box.min.z+.006&&b.max.z<=s.box.max.z-.006;
  const support=all.filter(s=>cover(s)&&s.box.max.y<=p.y+.035).sort((a,b)=>b.box.max.y-a.box.max.y)[0];
  const collision=all.some(s=>b.min.x<s.box.max.x-.008&&b.max.x>s.box.min.x+.008&&b.min.z<s.box.max.z-.008&&b.max.z>s.box.min.z+.008&&b.min.y<s.box.max.y-.004&&b.max.y>s.box.min.y+.008);
  const gap=support?p.y-support.box.max.y:Infinity,valid=Boolean(support&&Math.abs(gap-pad)<.03&&!collision);
  return{point:p,box:b,support,valid,reason:collision?'Objet dans un meuble : remonte-le.':!support?'Pas de support assez large sous l’objet.':valid?'Au contact : '+support.name:'Descends l’objet jusqu’au support ('+Math.max(0,gap).toFixed(2)+' m).'};
 }
 function point(o){const d=camera.getWorldDirection(new THREE.Vector3());d.y=0;if(d.lengthSq()<.001)d.set(0,0,-1);d.normalize();const p=camera.position.clone().addScaledVector(d,1.4);p.y=o.carryHeight??Math.max(.2,camera.position.y-.35);return p;}
 function current(o,model){return inspect(o,model,point(o));}
 function preview(o,model){last=current(o,model);model.position.copy(last.point);model.rotation.set(0,o.rotation||0,0);model.updateMatrixWorld(true);outline.box.copy(last.box);outline.material.color.setHex(last.valid?0x64e5a0:0xf19b66);outline.visible=true;return last;}
 function height(o,model,delta,contact=false){const now=current(o,model),p=now.point.clone();let y=contact&&now.support?now.support.box.max.y+pad:THREE.MathUtils.clamp(p.y+delta,.008,3.7);
  if(y<p.y){const stops=surfaces().filter(s=>now.box.min.x<s.box.max.x&&now.box.max.x>s.box.min.x&&now.box.min.z<s.box.max.z&&now.box.max.z>s.box.min.z&&s.box.max.y+pad<=p.y+.03&&s.box.max.y+pad>=y);if(stops.length)y=Math.max(...stops.map(s=>s.box.max.y+pad));}
  o.carryHeight=y;return current(o,model);
 }
 function pick(ray,o,model){const hit=ray.intersectObjects(surfaces().map(s=>s.mesh),false).find(h=>h.face&&h.face.normal.clone().transformDirection(h.object.matrixWorld).y>.8);if(!hit)return null;const p=hit.point.clone();p.y+=pad;return inspect(o,model,p);}
 return{preview,current,height,pick,inspect,hide(){outline.visible=false;last=null;},get last(){return last;},surfaces};
})();
