import bpy
from pathlib import Path
bpy.ops.wm.read_factory_settings(use_empty=True)
p=Path.cwd()/'assets-source/rocketbox/Assets/Animations/all_animations_max_motextr_static/f_idle_breathe_01.max.fbx'
bpy.ops.import_scene.fbx(filepath=str(p))
for o in bpy.data.objects:
 if o.type=='ARMATURE':print('ARM',o.name,[b.name for b in o.data.bones][:12],o.animation_data.action.name if o.animation_data else '')
for a in bpy.data.actions:print('ACT',a.name,a.frame_range[:],[(f.data_path,f.array_index) for f in a.fcurves][:5])
