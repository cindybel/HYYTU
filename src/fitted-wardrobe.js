/* Clothing details are shaded on the animated garment surface, not rigid props. */
window.FittedWardrobe=(()=>{
 let state=null;
 const vertexHeader='attribute vec3 wardrobePosition; attribute float wardrobeHand; varying vec3 vWardrobePosition; varying float vWardrobeHand;';
 const fragmentHeader=`varying vec3 vWardrobePosition; varying float vWardrobeHand;
 uniform float wardrobeTop,wardrobePants,wardrobeShoes,wardrobeGloves,wardrobeBadge,wardrobeCoverLegs;
 uniform vec3 wardrobeTrouserColor;
 float fabricBox(vec2 p,vec2 halfSize,float soft){vec2 d=abs(p)-halfSize;return 1.-smoothstep(-soft,soft,max(d.x,d.y));}
 float fabricBand(float value,float center,float width){return 1.-smoothstep(width*.5,width*.5+.0007,abs(value-center));}
 `;
 function coordinates(mesh,height){
  if(mesh.geometry.attributes.wardrobePosition)return;
  const points=[],hands=[],pos=mesh.geometry.attributes.position,weights=mesh.geometry.attributes.skinWeight,ids=mesh.geometry.attributes.skinIndex;
  const inverse=player.matrixWorld.clone().invert(),p=new THREE.Vector3();mesh.skeleton.update();
  for(let i=0;i<pos.count;i++){
   p.fromBufferAttribute(pos,i);mesh.boneTransform(i,p);p.applyMatrix4(mesh.matrixWorld).applyMatrix4(inverse);points.push(p.x,p.y/height,p.z);
   let hand=0;for(let j=0;j<4;j++){const index=ids.getComponent?ids.getComponent(i,j):ids.array[i*4+j],weight=weights.array[i*4+j];if(/Hand|Finger/.test(mesh.skeleton.bones[index]?.name||''))hand+=weight;}hands.push(hand);
  }
  mesh.geometry.setAttribute('wardrobePosition',new THREE.Float32BufferAttribute(points,3));mesh.geometry.setAttribute('wardrobeHand',new THREE.Float32BufferAttribute(hands,1));
 }
 function shade(material,kind,uniforms){
  if(material.userData.surfaceWardrobe)return;material.userData.surfaceWardrobe=true;
  material.onBeforeCompile=shader=>{
   Object.assign(shader.uniforms,uniforms);
   shader.vertexShader=vertexHeader+'\n'+shader.vertexShader;
   shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvWardrobePosition=wardrobePosition;vWardrobeHand=wardrobeHand;');
   shader.fragmentShader=fragmentHeader+'\n'+shader.fragmentShader;
   const patterns=`
    vec3 wp=vWardrobePosition;float front=smoothstep(.035,.075,wp.z);float ax=abs(wp.x);float wardrobeGlow=0.;float wardrobeReflective=0.;
    float weave=(sin(wp.x*3700.)*sin(wp.y*3900.))*.012;
    ${kind==='top'?`
     if(wardrobeTop>0.){
      float torso=1.-smoothstep(.17,.21,ax);
      float zipper=fabricBand(wp.x,0.,.0018)*fabricBox(vec2(0.,wp.y-1.13),vec2(1.,.22),.001)*front;
      if(wardrobeTop!=1.)diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.045,.055,.065),zipper*.75);
      if(wardrobeTop>=3.&&wardrobeTop<=5.){
       float tape=fabricBand(ax,.090,.008)*fabricBox(vec2(0.,wp.y-1.205),vec2(1.,.115),.001)*front;
       float back=fabricBand(wp.y,1.23,.009)*(1.-smoothstep(-.10,-.075,wp.z))*torso;
       float piping=fabricBand(wp.y,1.015,.004)*torso;
       wardrobeReflective=max(tape,max(back,piping));
       vec3 tapeColor=wardrobeTop==4.?vec3(.08,.30,.29):vec3(.25,.29,.30);
       diffuseColor.rgb=mix(diffuseColor.rgb,tapeColor,wardrobeReflective);
       wardrobeGlow=wardrobeTop==4.?wardrobeReflective:0.;
      }
      if(wardrobeTop==1.){
       vec2 p=vec2(wp.x+.075,wp.y-1.26);float mark=fabricBox(p,vec2(.014,.008),.0007)*front;
       float ink=fabricBand(p.x+.005+p.y*.35,0.,.0015)+fabricBand(p.x-.004-p.y*.35,0.,.0015);
       diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.10,.22,.22),mark*min(1.,ink));
      }
     }
     if(wardrobeBadge>0.){float r=length(vec2(wp.x-.08,wp.y-1.28));float disc=(1.-smoothstep(.010,.011,r))*front;float rim=smoothstep(.0075,.009,r)*disc;diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.022,.043,.052),disc);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.08,.26,.26),rim);}
    `:kind==='pants'?`
     if(wardrobePants>0.){
      float crease=.92+.055*sin(wp.y*60.+ax*32.)+.025*sin(wp.y*150.+wp.z*30.);
      diffuseColor.rgb=wardrobeTrouserColor*(crease+weave);
      vec2 pp=vec2(ax-.145,wp.y-.685);float panel=fabricBox(pp,vec2(.040,wardrobePants==1.?.055:.042),.003)*front;
      float inset=fabricBox(pp,vec2(.037,wardrobePants==1.?.052:.039),.002)*front;
      diffuseColor.rgb*=1.-panel*.07;
      diffuseColor.rgb=mix(diffuseColor.rgb,wardrobeTrouserColor*1.30,(panel-inset)*.60);
      float opening=fabricBand(wp.y,wardrobePants==1.?.735:.72,.0018)*fabricBox(vec2(pp.x,0.),vec2(.032,1.),.001)*front;
      diffuseColor.rgb=mix(diffuseColor.rgb,wardrobeTrouserColor*.55,opening);
      float legSeam=fabricBand(ax,.18,.0016)*(1.-smoothstep(.83,.88,wp.y))*smoothstep(.12,.18,wp.y);
      diffuseColor.rgb=mix(diffuseColor.rgb,wardrobeTrouserColor*1.28,legSeam);
      float knee=fabricBand(wp.y,.50,.0018)*front*fabricBox(vec2(ax-.105,0.),vec2(.055,1.),.002);
      if(wardrobePants==2.)diffuseColor.rgb=mix(diffuseColor.rgb,wardrobeTrouserColor*.72,knee);
     }
    `:kind==='shoes'?`
     if(wardrobeShoes>0.){float sole=fabricBand(wp.y,.032,.0045);vec3 trim=wardrobeShoes==1.?vec3(.06,.25,.25):vec3(.30,.05,.18);diffuseColor.rgb=mix(diffuseColor.rgb,trim,sole);wardrobeGlow=sole*.28;}
    `:`
     if(wardrobeCoverLegs>0.&&wp.y<.62&&wp.y>.07&&ax<.215)discard;
     if(wardrobeGloves>0.){float glove=smoothstep(.5,.75,vWardrobeHand);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.013,.018,.024)*(1.+weave),glove);}
    `}
   `;
   shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\n'+patterns);
   shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=mix(roughnessFactor,.4,wardrobeReflective);');
   shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\ntotalEmissiveRadiance+=vec3(.025,.12,.105)*wardrobeGlow;');
  };
  material.customProgramCacheKey=()=>`fitted-wardrobe-v1-${kind}`;material.needsUpdate=true;
 }
 function extendTrousers(root,base,height,uniforms){
  const coord=base.geometry.attributes.wardrobePosition;let low=Infinity;for(let i=0;i<coord.count;i++)low=Math.min(low,coord.getY(i));if(low<.3)return null;
  // Lengthen the existing garment topology so the cuff moves to the ankle.
  // New inverse bind matrices preserve its current pose while following leg bones.
  const bones=base.skeleton.bones,inv=player.matrixWorld.clone().invert(),geometry=base.geometry.clone(),points=[],wardrobe=[],indices=new Uint16Array(coord.count*4),weights=new Float32Array(coord.count*4),sides={};
  for(const side of ['L','R']){const ids=['Thigh','Calf','Foot'].map(part=>bones.findIndex(b=>b.name.replaceAll(' ','_')===`Bip01_${side}_${part}`));sides[side]={ids,p:ids.map(i=>bones[i].getWorldPosition(new THREE.Vector3()).applyMatrix4(inv))};}
  function center(y,p){const [top,knee,ankle]=p;return y<knee.y?ankle.clone().lerp(knee,(y-ankle.y)/(knee.y-ankle.y)):knee.clone().lerp(top,(y-knee.y)/(top.y-knee.y));}
  for(let i=0;i<coord.count;i++){
   const v=new THREE.Vector3().fromBufferAttribute(coord,i);v.y*=height;const oldY=v.y,side=v.x>=0?sides.L:sides.R;
   for(let j=0;j<4;j++){indices[i*4+j]=base.geometry.attributes.skinIndex.array[i*4+j];weights[i*4+j]=base.geometry.attributes.skinWeight.array[i*4+j];}
   if(oldY<.745*height){
    const y=oldY/height,cuff=low+.042,newY=(y<cuff?.105+(y-low)*1.25:.1575+(y-cuff)*(.745-.1575)/(.745-cuff))*height;
    const before=center(oldY,side.p),after=center(newY,side.p),t=THREE.MathUtils.smoothstep(newY,.14*height,.38*height),scale=.75+.28*t;
    v.x=after.x+(v.x-before.x)*scale;v.z=after.z+(v.z-before.z)*scale;v.y=newY;
    const blend=THREE.MathUtils.smoothstep(newY,side.p[1].y-.055,side.p[1].y+.105);
    indices.set([side.ids[0],side.ids[1],0,0],i*4);weights.set([blend,1-blend,0,0],i*4);
   }
   points.push(v.x,v.y,v.z);wardrobe.push(v.x,v.y/height,v.z);
  }
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(points,3));geometry.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(indices,4));geometry.setAttribute('skinWeight',new THREE.Float32BufferAttribute(weights,4));geometry.setAttribute('wardrobePosition',new THREE.Float32BufferAttribute(wardrobe,3));geometry.morphAttributes={};geometry.computeVertexNormals();geometry.computeBoundingBox();geometry.computeBoundingSphere();
  const material=base.material.clone();material.userData={};material.name='wardrobe_pants';shade(material,'pants',uniforms);
  const mesh=new THREE.SkinnedMesh(geometry,material);mesh.name='Fitted full-length trousers';mesh.userData.fittedTrouserExtension=true;mesh.castShadow=true;mesh.receiveShadow=true;mesh.frustumCulled=false;root.add(mesh);root.updateWorldMatrix(true,true);mesh.bind(new THREE.Skeleton(bones));mesh.visible=false;mesh.userData.sourceGarment=base;return mesh;
 }

 function prepare(){
  // SkinnedMesh.updateMatrixWorld refreshes bindMatrixInverse; updateWorldMatrix
  // alone does not. Sampling before this would double-transform loaded vertices.
  player.updateMatrixWorld(true);
  const body=[];player.traverse(o=>{if(o.isSkinnedMesh)body.push(o)});const height=humanLoaded==='nova'?1:1.055;
  const uniforms={wardrobeTop:{value:0},wardrobePants:{value:0},wardrobeShoes:{value:0},wardrobeGloves:{value:0},wardrobeBadge:{value:0},wardrobeCoverLegs:{value:0},wardrobeTrouserColor:{value:new THREE.Color()}};
  let pants=null;
  for(const mesh of body){coordinates(mesh,height);for(const material of Array.isArray(mesh.material)?mesh.material:[mesh.material]){if(material.name.startsWith('wardrobe_')){const kind=material.name.slice(9);shade(material,kind,uniforms);if(kind==='pants'&&!pants&&mesh.material===material)pants=mesh;}else if(material.name.endsWith('_body'))shade(material,'skin',uniforms);}}
  state={root:player,character:humanLoaded,uniforms,extension:pants?extendTrousers(player,pants,height,uniforms):null};
 }
 function update(appearance,wear){
  if(!state||state.character!==humanLoaded||!player.getObjectByProperty('isSkinnedMesh',true)?.geometry.attributes.wardrobePosition)prepare();
  const u=state.uniforms,top=wear.top?.replace('clothing-','')||appearance.shirt;
  u.wardrobeTop.value=({'hoodie-vj':1,'jacket-blackout':2,'jacket-reflective':3,reflective:3,'vest-led':4,led:4,'full-fit-pro':5,'pro-fit':5,'coat-tour':6})[top]||0;
  const pants=wear.pants?.replace('clothing-','')||(top==='full-fit-pro'?'pants-tech':null);
  u.wardrobePants.value=pants==='pants-cargo'?1:pants?2:0;u.wardrobeTrouserColor.value.set(pants==='pants-cargo'?'#343e36':'#273542').convertSRGBToLinear();
  u.wardrobeShoes.value=wear.shoes?(wear.shoes.endsWith('cyan')?1:2):0;u.wardrobeGloves.value=wear.hands?1:0;u.wardrobeBadge.value=wear.badge?1:0;
  if(state.extension){state.extension.visible=Boolean(pants);state.extension.userData.sourceGarment.visible=!pants;}
  u.wardrobeCoverLegs.value=state.extension&&pants?1:0;
 }
 return {update,get state(){return state}};
})();
