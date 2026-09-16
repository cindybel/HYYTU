/* The previous library remains intact. Higher career levels add collections. */
window.ClipProgression=(()=>{
 const tiers=[{level:1,label:'Essentiels',detail:'Formes lisibles pour apprendre les fondus.'},{level:3,label:'Compositions',detail:'Variantes plus denses et mouvements développés.'},{level:5,label:'Matières & profondeur',detail:'20 nouvelles boucles : textures, lumière et profondeur, par style musical.'}];
 const names={techno:'Techno',hiphop:'Hip-hop',chill:'Chill',psytrance:'Psytrance',rock:'Rock'};
 const families={techno:['contours','lattice','circuit','bars','squares','triangles','scope','columns','diamonds','rays','grid','tunnel'],hiphop:['contours','discs','bars','scope','terrain','fan','columns'],chill:['particles','waves','contours','helix','discs','stars','terrain','knots','fan','aurora','ribbons','orbits'],psytrance:['petals','arcs','spiral','helix','stars','triangles','knots','diamonds','kaleido'],rock:['arcs','contours','circuit','bars','scope','terrain','columns','rays']};
 const genre=value=>names[value]?value:(value==='corpo'?'chill':'techno');
 const level=()=>Math.max(1,Number(profile.stats.level)||1);
 function enrich(clip){const key=clip.src.split('/').pop().replace(/\.mp4$/,'').replace(/-[12]$/,'');clip.requiredLevel=clip.genre?5:/-2\.mp4$/.test(clip.src)?3:1;clip.collectionLabel=tiers.find(t=>t.level===clip.requiredLevel).label;clip.styleAffinity=clip.genre?[clip.genre]:Object.keys(families).filter(s=>families[s].includes(key));if(!clip.styleAffinity.length)clip.styleAffinity=Object.keys(names);return clip;}
 function unlocked(clip){return enrich(clip).requiredLevel<=level();}
 function playlist(clips,gig,saved=null){
  clips.forEach(enrich);
  // Older saves used indices in the full original array. Preserve that order.
  if(saved){if(Array.isArray(saved.playlist)){const list=saved.playlist.map(src=>clips.find(c=>c.src===src)).filter(Boolean);if(list.length===saved.playlist.length&&list.length)return list;}else return clips.filter(c=>!c.genre);}
  const style=genre(gig?.style),order={warmup:0,groove:1,rise:2,peak:3,legacy:4};
  return clips.filter(c=>unlocked(c)&&c.styleAffinity.includes(style)).sort((a,b)=>b.requiredLevel-a.requiredLevel||(order[a.energy]??4)-(order[b.energy]??4));
 }
 function label(clip){enrich(clip);return `${clip.collectionLabel} · niveau ${clip.requiredLevel}${unlocked(clip)?'':' · à débloquer'}`;}
 function summary(){const n=level(),next=tiers.find(t=>t.level>n);return `Niveau ${n} · ${tiers.filter(t=>t.level<=n).map(t=>t.label).join(' + ')}${next?` · Prochaine collection au niveau ${next.level}`:' · Toutes les collections débloquées'}`;}
 return {tiers,names,genre,level,enrich,unlocked,playlist,label,summary};
})();
