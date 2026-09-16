/* Fitted accessories follow the skeleton; wardrobe colors never touch skin materials. */
const wardrobeTextureCache=new WeakMap();
function neutralWardrobeTexture(source){
 if(!source?.image)return source;
 if(wardrobeTextureCache.has(source))return wardrobeTextureCache.get(source);
 const canvas=document.createElement('canvas');canvas.width=canvas.height=1024;const c=canvas.getContext('2d');c.drawImage(source.image,0,0,1024,1024);const pixels=c.getImageData(0,0,1024,1024);for(let i=0;i<pixels.data.length;i+=4){const v=Math.min(255,45+.2126*pixels.data[i]+.7152*pixels.data[i+1]+.0722*pixels.data[i+2]);pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=v;}c.putImageData(pixels,0,0);
 const texture=new THREE.CanvasTexture(canvas);texture.flipY=source.flipY;texture.encoding=THREE.sRGBEncoding;texture.wrapS=source.wrapS;texture.wrapT=source.wrapT;texture.offset.copy(source.offset);texture.repeat.copy(source.repeat);wardrobeTextureCache.set(source,texture);return texture;
}
function clearHumanAccessories(){const parts=[];player.traverse(o=>{if(o.userData.wearAttachment)parts.push(o);});for(const part of parts){part.removeFromParent();part.traverse(o=>{if(o.isMesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material]){for(const v of Object.values(m))if(v?.isTexture)v.dispose();m.dispose();}}});}}
function renderHumanWardrobe(appearance,wear){
 const colors={black:0x272b34,charcoal:0x515763,white:0xf4f1e9,cyan:0x36d6da,magenta:0xed58b2,pink:0xf78abf,purple:0x9770dc,blue:0x456bac,green:0x4bae85,yellow:0xecc661,red:0xd95d65,cargo:0x303c37,techwear:0x293448};
 const top=wear.top?.replace('clothing-','');
 const topColors=Object.fromEntries(Object.entries(ClothingModels.palette).map(([id,hex])=>[id,new THREE.Color(hex).getHex()]));
 player.traverse(o=>{if(!o.isMesh||o.userData.wearAttachment)return;for(const m of Array.isArray(o.material)?o.material:[o.material]){if(!m.name.startsWith('wardrobe_'))continue;if(!m.userData.wardrobePrepared){m.map=neutralWardrobeTexture(m.map);m.userData.wardrobePrepared=true;m.needsUpdate=true;}const kind=m.name.slice(9);let color=kind==='top'?(topColors[top]!==undefined?topColors[top]:colors[appearance.shirtColor]):kind==='pants'?colors[appearance.pants]:colors[appearance.shoes];if(kind==='pants'&&wear.pants)color=colors[wear.pants.endsWith('cargo')?'cargo':'techwear'];if(kind==='shoes'&&wear.shoes)color=0x202831;m.color.setHex(color??0xffffff);m.roughness=top==='jacket-reflective'&&kind==='top'?.38:.82;m.metalness=top==='jacket-reflective'&&kind==='top'?.22:0;}});
 FittedWardrobe.update(appearance,wear);
 const signature=JSON.stringify([humanLoaded,wear,Boolean(appearance.headphones),appearance.shirt]);if(player.userData.wearSignature===signature)return;player.userData.wearSignature=signature;clearHumanAccessories();player.updateWorldMatrix(true,true);
 const bone=name=>{let found;player.traverse(o=>{if(o.isBone&&o.name.replaceAll(' ','_')===`Bip01_${name}`)found=o;});return found;};
 const point=name=>{const b=bone(name);return b?player.worldToLocal(b.getWorldPosition(new THREE.Vector3())):new THREE.Vector3(0,1.3,0);};
 function attach(name,id,build){const b=bone(name);if(!b)return;const g=new THREE.Group();g.name=`wear-${id}`;g.userData.wearAttachment=true;g.userData.itemId=id;g.position.copy(point(name));if(name==='Spine2')g.position.z+=humanLoaded==='eli'?.04:humanLoaded==='sam'?.02:0;build(g);player.add(g);player.updateWorldMatrix(true,true);b.attach(g);}
 const headgear=wear.headwear?.replace('clothing-','');
 function canonical(g,id,scale,position){const model=ClothingModels.create({id:`clothing-${id}`,label:id});model.scale.set(...scale);model.position.set(...position);model.traverse(o=>{if(o.isMesh)o.castShadow=true;});g.add(model);}
 if(headgear)attach('Head',headgear,g=>canonical(g,headgear,[.35,.28,humanLoaded==='sam'?.46:.38],[0,.11,.008]));
 const headphones=wear.headphones?.replace('clothing-','')||(appearance.headphones?'headphones-basic':null);
 if(headphones)attach('Head',headphones,g=>canonical(g,headphones,[.39,.28,.40],[0,-.016,.015]));
 if(wear.face)attach('Head','mask-club',g=>canonical(g,'mask-club',[.26,.26,.26],[0,-.033,.09]));

}

function refineShoeRegions(){
 player.updateWorldMatrix(true,true);let pants;player.traverse(o=>{if(o.material?.name==='wardrobe_pants')pants=o.material;});if(!pants)return;
 player.traverse(o=>{if(!o.isSkinnedMesh||o.material?.name!=='wardrobe_shoes')return;o.skeleton.update();const geometry=o.geometry.clone(),pos=geometry.attributes.position,idx=geometry.index,shoe=[],ankle=[],point=new THREE.Vector3(),heights=[];
 for(let i=0;i<pos.count;i++){point.fromBufferAttribute(pos,i);o.boneTransform(i,point);o.localToWorld(point);player.worldToLocal(point);heights.push(point.y);}
 const count=idx?idx.count:pos.count;for(let i=0;i<count;i+=3){const a=idx?idx.getX(i):i,b=idx?idx.getX(i+1):i+1,c=idx?idx.getX(i+2):i+2;(Math.max(heights[a],heights[b],heights[c])>.17?ankle:shoe).push(a,b,c);}
 if(shoe.length&&ankle.length){geometry.setIndex(shoe.concat(ankle));geometry.clearGroups();geometry.addGroup(0,shoe.length,0);geometry.addGroup(shoe.length,ankle.length,1);o.geometry=geometry;o.material=[o.material,pants];}else geometry.dispose();
 });
}
