import bpy
from pathlib import Path
bpy.ops.wm.open_mainfile(filepath=str(Path.cwd()/'assets/characters/nova/nova.blend'))
a=next(o for o in bpy.data.objects if o.type=='ARMATURE')
for f in [1,20,40]:
 bpy.context.scene.frame_set(f)
 print('POSE',f,[(b.name,tuple(round(v,2) for v in b.rotation_euler),tuple(round(v,2) for v in b.rotation_quaternion)) for b in a.pose.bones if 'UpperArm' in b.name])
print('ACTIONLEN',len(a.animation_data.action.fcurves))
print('CURVES',[(c.data_path,c.array_index,c.evaluate(40)) for c in a.animation_data.action.fcurves if 'UpperArm' in c.data_path][:8])
