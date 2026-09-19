"""Prueba de calidad Blender: turbo metalico en estudio, render de 1 fotograma en CPU.
   Uso:  blender -b -P scripts/blender_turbo_test.py
   Salida: out/blender/turbo_test.png
   NO usa GPU (device = CPU), deja 2 nucleos libres."""
import bpy, os, math
from math import radians, cos, sin, pi

# --- limpiar escena ---
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

def mat(name, color, rough, metal=1.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes.get("Principled BSDF")
    b.inputs["Base Color"].default_value = (*color, 1.0)
    b.inputs["Metallic"].default_value = metal
    b.inputs["Roughness"].default_value = rough
    return m

alu     = mat("alu",      (0.90, 0.91, 0.93), 0.26)
polished= mat("polished", (0.95, 0.95, 0.97), 0.12)
cast    = mat("cast",     (0.30, 0.31, 0.33), 0.52)
dark    = mat("dark",     (0.42, 0.44, 0.47), 0.40)

def add(obj, material, smooth=True):
    o = bpy.context.active_object
    o.data.materials.append(material)
    if smooth:
        bpy.ops.object.shade_smooth()
    return o

def cyl(r, d, loc, rot=(0,0,0), m=dark, v=64):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=d, location=loc, rotation=rot, vertices=v)
    return add(cyl_obj := None or bpy.context.active_object, m)

def torus(maj, minr, loc, rot=(0,0,0), m=dark):
    bpy.ops.mesh.primitive_torus_add(major_radius=maj, minor_radius=minr, location=loc, rotation=rot,
                                     major_segments=64, minor_segments=24)
    return add(bpy.context.active_object, m)

X = 1.0  # eje del turbo = X ; los cilindros por defecto van en Z -> rot Y=90 para tumbarlos

# --- carcasa central de cojinetes + nervios ---
cyl(0.55, 2.2, (0,0,0), (0, radians(90), 0), dark)
for i in range(7):
    torus(0.6, 0.05, (-0.9 + i*0.3, 0, 0), (0, radians(90), 0), dark)

# --- lado compresor (frio, aluminio) ---
torus(1.35, 0.72, (-1.75, 0, 0), (0, radians(90), 0), alu)
cyl(1.35, 0.22, (-2.55, 0, 0), (0, radians(90), 0), alu)
torus(0.5, 0.16, (-2.7, 0, 0), (0, radians(90), 0), alu)
cyl(0.5, 1.7, (-2.5, 1.05, 0), (0, 0, radians(52)), alu)  # tubo admision

# --- lado turbina (caliente, fundicion oscura) ---
torus(1.4, 0.78, (1.8, 0, 0), (0, radians(90), 0), cast)
cyl(1.4, 0.24, (2.62, 0, 0), (0, radians(90), 0), cast)
bpy.ops.mesh.primitive_cube_add(size=1, location=(3.0, 0, 0));
bpy.context.active_object.scale = (0.22, 0.9, 0.9); add(bpy.context.active_object, cast)  # brida escape
cyl(0.55, 1.4, (2.6, 0.95, 0), (0, 0, radians(-45)), cast)  # salida escape

# --- linea de aceite arriba ---
cyl(0.12, 1.5, (0, 1.4, 0), (0,0,0), polished)
cyl(0.2, 0.18, (0, 2.1, 0), (0,0,0), polished)

# --- rodetes con alabes ---
def wheel(cx, material, twist=0.5):
    bpy.ops.mesh.primitive_cone_add(radius1=0.34, radius2=0.14, depth=0.6, location=(cx,0,0),
                                    rotation=(0, radians(90), 0), vertices=24)
    add(bpy.context.active_object, material)
    for i in range(12):
        a = i/12*2*pi
        bpy.ops.mesh.primitive_cube_add(size=1, location=(cx, cos(a)*0.46, sin(a)*0.46))
        o = bpy.context.active_object
        o.scale = (0.5, 0.36, 0.025)
        o.rotation_euler = (a, 0, twist)
        add(o, material)

wheel(-2.35, polished)   # rodete compresor
wheel(2.35, dark, -0.5)  # rueda turbina

# --- suelo de estudio ---
bpy.ops.mesh.primitive_plane_add(size=40, location=(0,0,-2.0))
floor = mat("floor", (0.05,0.05,0.06), 0.4, metal=0.0)
add(bpy.context.active_object, floor, smooth=False)

# --- mundo (gris estudio para reflejos) ---
world = bpy.data.worlds.new("W"); scene.world = world; world.use_nodes = True
bg = world.node_tree.nodes.get("Background")
bg.inputs[0].default_value = (0.04, 0.045, 0.05, 1.0)
bg.inputs[1].default_value = 0.6

# --- luces de estudio ---
def area(loc, rot, size, power, color=(1,1,1)):
    bpy.ops.object.light_add(type='AREA', location=loc, rotation=rot)
    l = bpy.context.active_object.data
    l.size = size; l.energy = power; l.color = color
area((-5, -4, 6), (radians(50), 0, radians(-40)), 6, 2200)          # key
area(( 6, -3, 3), (radians(65), 0, radians(55)), 5, 900, (1.0,0.55,0.25))  # rim calido (turbina)
area((-6, 3, 4),  (radians(60), 0, radians(200)), 6, 700, (0.5,0.7,1.0))   # fill frio (compresor)

# --- camara (encuadra el turbo entero, 3/4, apuntando al origen) ---
bpy.ops.object.empty_add(location=(0, 0, 0.1)); target = bpy.context.active_object
bpy.ops.object.camera_add(location=(5.0, -14.0, 4.5))
cam = bpy.context.active_object; scene.camera = cam
cam.data.lens = 55
con = cam.constraints.new('TRACK_TO')
con.target = target; con.track_axis = 'TRACK_NEGATIVE_Z'; con.up_axis = 'UP_Y'

# --- render (CPU, sin GPU) ---
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.samples = 96
try:
    scene.cycles.use_denoising = True
except Exception:
    pass
cores = os.cpu_count() or 4
scene.render.threads_mode = 'FIXED'
scene.render.threads = max(1, cores - 2)
scene.render.resolution_x = 1280
scene.render.resolution_y = 720
scene.render.image_settings.file_format = 'PNG'
out = os.path.join(os.getcwd(), "out", "blender")
os.makedirs(out, exist_ok=True)
scene.render.filepath = os.path.join(out, "turbo_test.png")
print("[BLENDER] render CPU con", scene.render.threads, "hilos ->", scene.render.filepath)
bpy.ops.render.render(write_still=True)
print("[BLENDER] LISTO")
