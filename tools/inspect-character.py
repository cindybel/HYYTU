import bpy,json
from pathlib import Path
bpy.ops.wm.read_factory_settings(use_empty=True)
p=Path.cwd()/'assets-source/rocketbox/Assets/Avatars/Adults/Female_Adult_12/Export/Female_Adult_12_facial.fbx'
bpy.ops.import_scene.fbx(filepath=str(p))
for o in bpy.data.objects:
 print('OBJ',o.name,o.type,tuple(round(v,2) for v in o.dimensions))
 if o.type=='MESH': print('MATS',[(m.name if m else None) for m in o.data.materials],len(o.data.polygons))
 if o.type=='ARMATURE': print('BONES',[b.name for b in o.data.bones][:35])
print('IMAGES',[i.filepath for i in bpy.data.images])
print('ACTIONS',[(a.name,a.frame_range[:]) for a in bpy.data.actions])
