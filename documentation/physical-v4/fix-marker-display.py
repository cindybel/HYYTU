from pathlib import Path
p=Path('src/physical-v4.js');s=p.read_text(encoding='utf-8').replace("r.referenceMarkers=Boolean(surfaces[i]?.referenceMarkers);", "r.referenceMarkers=Boolean(surfaces[i]?.referenceMarkers);if(gigMaskRequiredForPhysical(r))PolygonMapping.markers(r);")
# No extra global required: mapping targets exist only when a mapping gig has initialized.
s=s.replace("if(gigMaskRequiredForPhysical(r))","if(r.mappingTargets)")
s=s.replace("root.add(display);}PhysicalCables.ports", "root.add(display);if(o.referenceMarkers){for(const x of [-.5,.5])for(const y of [.76,1.76]){const marker=new THREE.Mesh(new THREE.PlaneGeometry(.055,.055),new THREE.MeshBasicMaterial({color:0xffdb7c}));marker.position.set(x,y,.04);root.add(marker);}}}PhysicalCables.ports")
p.write_text(s,encoding='utf-8')
p=Path('src/physical-career.js');s=p.read_text(encoding='utf-8');s=s.replace("item.effectScope='Les ports, la longueur, le poids et l’alimentation déterminent son utilisation.';", "item.effectScope=d.kind==='gaffer'?'En main, clique un câble branché pour le fixer. Prends le câble pour retirer le gaffer.':d.kind==='lens'?'En main, clique un projecteur éteint. Agrandit physiquement l’image de 25 %.':d.kind==='marker-kit'?'En main, clique un écran. Les repères aident à placer tes points près du contour, sans les tracer automatiquement.':'Les ports, la longueur, le poids et l’alimentation déterminent son utilisation.';")
p.write_text(s,encoding='utf-8')
