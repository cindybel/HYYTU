/* One playing texture per actual source output. A splitter shares that texture. */
window.PhysicalOutputs=(()=>{
 const media=new Map();let signature='';
 function reset(){for(const entry of media.values()){entry.video.pause();entry.video.removeAttribute('src');entry.video.load();entry.texture.dispose();}media.clear();signature='';}
 function pause(){for(const entry of media.values())entry.video.pause();}
 function library(state,gig){const selected=state.selectedClips.map(id=>shopItems.find(i=>i.id===id)).filter(i=>i&&profile.ownedItems.includes(i.id));selected.sort((a,b)=>Number(b.styleTarget===gig.style)-Number(a.styleTarget===gig.style));const clips=selected.flatMap(item=>window.ClipCollections?.contents?.(item)||videoClips.filter(v=>v.styleAffinity?.includes(item.styleTarget)));return [...new Map(clips.map(c=>[c.src,c])).values()];}
 function texture(state,rig,gig){if(!state?.active||!rig.physicalId)return clipTexture;const C=PhysicalCore,signal=C.signal(state,rig.physicalId);if(!signal.valid)return testCardTexture;
  const key=state.active.gigId+'|'+state.selectedClips.join('|');if(signature!==key){reset();signature=key;}
  let entry=media.get(signal.channel);if(!entry){const channels=[...new Set(state.objects.filter(o=>state.active.ids.includes(o.uid)&&['laptop','tower'].includes(C.spec(o.modelId).kind)).flatMap(o=>o.ports.filter(p=>p.direction==='out'&&['HDMI','DP','USB-C','VGA','SDI'].includes(p.standard)).map(p=>o.uid+':'+p.id)))].sort();const clips=library(state,gig);if(!clips.length)return clipTexture;const clip=clips[channels.indexOf(signal.channel)%clips.length],video=document.createElement('video');video.src=clip.src;video.loop=true;video.muted=true;video.playsInline=true;video.preload='auto';const texture=new THREE.VideoTexture(video);texture.colorSpace=THREE.SRGBColorSpace;entry={video,texture,src:clip.src};media.set(signal.channel,entry);video.addEventListener('loadeddata',()=>{if(profile.settings.stillVisuals)video.currentTime=Math.min(.1,video.duration||.1);},{once:true});}
  if(profile.settings.stillVisuals)entry.video.pause();else if(entry.video.paused)entry.video.play().catch(()=>{});return entry.video.error?testCardTexture:entry.texture;
 }
 return{texture,pause,reset,media};
})();
