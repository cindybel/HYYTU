import bpy, math, json
from pathlib import Path
from mathutils import Vector
ROOT=Path.cwd()
choices=[('Female_Adult_12','nova','f'),('Male_Adult_12','eli','m'),('Male_Adult_17','sam','m')]
for source,name,sex in choices:
 bpy.ops.wm.read_factory_settings(use_empty=True)
 base=ROOT/'assets-source/rocketbox/Assets/Avatars/Adults'/source
 bpy.ops.import_scene.fbx(filepath=str(base/'Export'/f'{source}_facial.fbx'))
 original=list(bpy.data.objects)
 arm=next(o for o in original if o.type=='ARMATURE')
 mesh=next(o for o in original if o.type=='MESH')
 mesh.name='Human_'+name
 arm.animation_data_clear()
 out=ROOT/'assets/characters'/name;out.mkdir(parents=True,exist_ok=True)
 # Rebuild physically based materials with the supplied diffuse/normal/alpha maps.
 for mat in mesh.data.materials:
  stem=mat.name
  mat.use_nodes=True;nodes=mat.node_tree.nodes;nodes.clear()
  bsdf=nodes.new('ShaderNodeBsdfPrincipled');bsdf.inputs['Roughness'].default_value=.78
  bsdf.inputs['Specular IOR Level'].default_value=.25
  output=nodes.new('ShaderNodeOutputMaterial');mat.node_tree.links.new(bsdf.outputs['BSDF'],output.inputs['Surface'])
  for suffix,is_normal in [('_color',False),('_normal',True)]:
   f=base/'Textures'/f'{stem}{suffix}.tga'
   if not f.exists():continue
   img=bpy.data.images.load(str(f),check_existing=False)
   _ = img.pixels[0]
   if is_normal:img.colorspace_settings.name='Non-Color'
   if is_normal and img.size[0]>1024:img.scale(1024,1024)
   img.filepath_raw=str(out/(stem+suffix+'.png'));img.file_format='PNG';img.save()
   tex=nodes.new('ShaderNodeTexImage');tex.image=img
   if is_normal:
    norm=nodes.new('ShaderNodeNormalMap');norm.inputs['Strength'].default_value=.55
    mat.node_tree.links.new(tex.outputs['Color'],norm.inputs['Color']);mat.node_tree.links.new(norm.outputs['Normal'],bsdf.inputs['Normal'])
   else:
    mat.node_tree.links.new(tex.outputs['Color'],bsdf.inputs['Base Color'])
    if 'opacity' in stem:
     mat.node_tree.links.new(tex.outputs['Alpha'],bsdf.inputs['Alpha']);mat.surface_render_method='DITHERED'
  mat.diffuse_color=(1,1,1,1)
 # Split garment polygons from skin so outfit color controls never tint faces or hands.
 body_index=next(i for i,m in enumerate(mesh.data.materials) if '_body' in m.name)
 body=mesh.data.materials[body_index]
 image=next(n.image for n in body.node_tree.nodes if n.type=='TEX_IMAGE' and '_color' in n.image.name)
 pixels=list(image.pixels);width,height=image.size
 variants={}
 for kind in ['top','pants','shoes']:
  mat=body.copy();mat.name='wardrobe_'+kind;mesh.data.materials.append(mat);variants[kind]=len(mesh.data.materials)-1
 uv=mesh.data.uv_layers.active.data
 for poly in mesh.data.polygons:
  if poly.material_index!=body_index:continue
  v=sum((uv[i].uv for i in poly.loop_indices),Vector((0,0)))/len(poly.loop_indices)
  ix=(int(v.x*width)%width);iy=(int(v.y*height)%height);offset=(iy*width+ix)*4;r,g,b=pixels[offset:offset+3]
  skin=r>g*1.13 and r>b*1.3 and r>.16
  center=mesh.matrix_world @ poly.center
  if not skin:poly.material_index=variants['shoes' if center.z<.2 else 'pants' if center.z<.94 else 'top']
 # Import the matching library breathing motion; keep only pose rotations.
 before=set(bpy.data.objects)
 animation=ROOT/'assets-source/rocketbox/Assets/Animations/all_animations_max_motextr_static'/f'{sex}_idle_breathe_01.max.fbx'
 bpy.ops.import_scene.fbx(filepath=str(animation))
 animated=next(o for o in bpy.data.objects if o not in before and o.type=='ARMATURE')
 # Retarget world-space pose rotations: the animation FBX has a different bind pose.
 for bone in arm.pose.bones:
  if bone.name in animated.pose.bones:
   c=bone.constraints.new('COPY_ROTATION');c.target=animated;c.subtarget=bone.name;c.owner_space='POSE';c.target_space='POSE'
 bpy.ops.object.select_all(action='DESELECT');arm.select_set(True);bpy.context.view_layer.objects.active=arm
 bpy.ops.nla.bake(frame_start=1,frame_end=81,step=2,only_selected=False,visual_keying=True,clear_constraints=True,use_current_action=False,bake_types={'POSE'})
 arm.animation_data.action.name='Idle_Breathe'
 for obj in list(bpy.data.objects):
  if obj not in before:bpy.data.objects.remove(obj,do_unlink=True)
 # Four expression targets instead of shipping 140 unused facial targets.
 if mesh.data.shape_keys:
  keep={'AK_09_EyeBlinkLeft','AK_10_EyeBlinkRight','AK_44_MouthSmileLeft','AK_45_MouthSmileRight'}
  for key in list(mesh.data.shape_keys.key_blocks)[1:]:
   if key.name not in keep:mesh.shape_key_remove(key)
 bpy.context.scene.frame_start=1;bpy.context.scene.frame_end=81;bpy.context.scene.render.fps=30;bpy.context.scene.frame_set(20)
 # Keep morph targets neutral and visible in a natural pose.
 bpy.ops.object.select_all(action='DESELECT')
 for obj in original:obj.select_set(True)
 bpy.context.view_layer.objects.active=arm
 bpy.ops.export_scene.gltf(filepath=str(out/(name+'.glb')),export_format='GLB',use_selection=True,export_animations=True,export_animation_mode='ACTIVE_ACTIONS',export_materials='EXPORT',export_image_format='AUTO',export_yup=True)
 # Consistent portrait made from the same 3D asset used in the game.
 world=bpy.context.scene.world or bpy.data.worlds.new('World');bpy.context.scene.world=world;world.use_nodes=True;world.node_tree.nodes['Background'].inputs[0].default_value=(.035,.055,.085,1);world.node_tree.nodes['Background'].inputs[1].default_value=.45
 bpy.ops.object.camera_add(location=(.1,-1.75,1.54));cam=bpy.context.object
 cam.rotation_euler=(Vector((0,0,1.48))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.lens=65;bpy.context.scene.camera=cam
 for loc,energy,color,size in [((2,-3,3),260,(.75,.86,1),3),((-2,-1,2),160,(.5,1,.92),2),((1,2,2.5),220,(.62,.45,1),2)]:
  bpy.ops.object.light_add(type='AREA',location=loc);light=bpy.context.object;light.data.energy=energy;light.data.color=color;light.data.shape='DISK';light.data.size=size;light.rotation_euler=(Vector((0,0,1.2))-light.location).to_track_quat('-Z','Y').to_euler()
 scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=24;scene.cycles.use_denoising=True;scene.render.resolution_x=600;scene.render.resolution_y=760;scene.render.resolution_percentage=100;scene.render.image_settings.file_format='PNG';scene.render.filepath=str(out/'portrait.png');scene.render.film_transparent=False
 bpy.ops.wm.save_as_mainfile(filepath=str(out/(name+'.blend')))
 bpy.ops.render.render(write_still=True)
 print('CHARACTER_READY',name,flush=True)


