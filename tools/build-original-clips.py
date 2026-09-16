"""Original deterministic VJ motion graphics. Render with Python, Pillow, numpy, FFmpeg."""
from pathlib import Path
import math, subprocess, json
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import imageio_ffmpeg
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'video'/'originals';OUT.mkdir(parents=True,exist_ok=True)
W,H,FPS,SECONDS=1280,720,30,8
TAU=math.tau
CLIPS=[('aurora','Aurore · warm-up'),('ribbons','Rubans · break'),('orbits','Orbites · groove'),('grid','Grille · montée'),('tunnel','Tunnel · peak'),('kaleido','Prisme · peak')]
y,x=np.mgrid[-1:1:complex(0,180),-1.78:1.78:complex(0,320)]
def frame(kind,t):
 a=TAU*t
 im=Image.new('RGB',(W,H),(3,7,17));glow=Image.new('RGB',(W,H));d=ImageDraw.Draw(glow)
 if kind=='aurora':
  v=np.zeros((180,320,3),dtype=np.float32);v[:]=[3,7,17]
  for j,c in enumerate(([20,145,160],[80,40,170],[15,120,90])):
   center=.35*np.sin(x*1.7+a+j*1.3)+.2*np.cos(x*3-a+j)-.25+j*.2
   band=np.exp(-((y-center)/(.16+j*.04))**2)*(0.6+.2*np.sin(x*2+a+j))
   v+=band[:,:,None]*np.array(c)
  return Image.fromarray(np.uint8(np.clip(v,0,255))).resize((W,H),Image.Resampling.BICUBIC)
 if kind=='ribbons':
  for j in range(32):
   pts=[]
   for xx in range(-20,W+21,8):
    yy=H/2+(j-16)*7+100*math.sin(xx/280+a+j*.065)+50*math.sin(xx/170-a+j*.03)
    pts.append((xx,yy))
   d.line(pts,fill=(65+j*3,55+j*3,190+j),width=2)
 elif kind=='orbits':
  for j in range(12):
   pts=[]
   rot=.4*math.sin(a)+j*.23
   for k in range(201):
    ang=TAU*k/200;r=100+j*15
    u=r*math.cos(ang);v=r*.45*math.sin(ang)
    pts.append((640+u*math.cos(rot)-v*math.sin(rot),360+u*math.sin(rot)+v*math.cos(rot)))
   d.line(pts,fill=(50+j*9,200-j*7,220),width=2)
   theta=a+j*.8;u=(100+j*15)*math.cos(theta);v=(100+j*15)*.45*math.sin(theta)
   px=640+u*math.cos(rot)-v*math.sin(rot);py=360+u*math.sin(rot)+v*math.cos(rot)
   d.ellipse((px-4,py-4,px+4,py+4),fill=(215,245,245))
 elif kind=='grid':
  horizon=260+20*math.sin(a)
  for j in range(-13,14):
   d.line([(640+j*22,horizon),(640+j*160,H)],fill=(24,120,150),width=2)
  for j in range(22):
   z=((j+.5+.45*math.sin(a))/22)**2;yy=horizon+(H-horizon)*z
   strength=int(35+150*z);d.line([(0,yy),(W,yy)],fill=(strength//3,strength,strength),width=2)
  for j in range(6):
   r=40+j*19+5*math.sin(a+j*.3)
   d.arc((640-r,180-r*.7,640+r,180+r*.7),0,360,fill=(140,60+j*15,210),width=2)
 elif kind=='tunnel':
  for j in range(24):
   z=(j+.5+.45*math.sin(a))/24;r=15+950*z*z
   # Fade both ends to avoid a popping ring at the loop seam.
   fade=math.sin(math.pi*z)**2
   rot=.16*math.sin(a)+.15*j
   pts=[(640+r*math.cos(k*TAU/6+rot),360+r*.72*math.sin(k*TAU/6+rot)) for k in range(7)]
   d.line(pts,fill=(int(190*fade),int(80*fade),int(230*fade)),width=max(1,int(z*5)))
 elif kind=='kaleido':
  for j in range(9):
   r=65+j*29;rot=a*(1 if j%2 else -1)+j*.2
   for k in range(8):
    ang=k*TAU/8;rr=r+10*math.sin(a+j)
    pts=[]
    for q,rad in ((0,rr-22),(.12,rr), (0,rr+22),(-.12,rr),(0,rr-22)):
     theta=ang+q+.12*math.sin(rot)
     pts.append((640+rad*math.cos(theta),360+rad*math.sin(theta)))
    d.line(pts,fill=(200-j*10,80+j*12,115+j*14),width=2)
 from PIL import ImageChops
 im=ImageChops.add(im,glow.filter(ImageFilter.GaussianBlur(11)))
 return ImageChops.add(im,glow)

def render():
 manifest=[]
 for kind,label in CLIPS:
  dest=OUT/f'{kind}.mp4'
  cmd=[imageio_ffmpeg.get_ffmpeg_exe(),'-hide_banner','-loglevel','error','-y','-f','rawvideo','-vcodec','rawvideo','-s',f'{W}x{H}','-pix_fmt','rgb24','-r',str(FPS),'-i','-','-an','-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',str(dest)]
  p=subprocess.Popen(cmd,stdin=subprocess.PIPE)
  for i in range(FPS*SECONDS):p.stdin.write(frame(kind,i/(FPS*SECONDS)).tobytes())
  p.stdin.close()
  if p.wait():raise RuntimeError(kind)
  frame(kind,.25).save(OUT/f'{kind}.jpg',quality=92)
  manifest.append(dict(id=kind,label=label,src=f'/video/originals/{kind}.mp4',poster=f'/video/originals/{kind}.jpg',width=W,height=H,fps=FPS,seconds=SECONDS))
  print(f'RENDERED {kind} {dest.stat().st_size}',flush=True)
 (OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
if __name__=='__main__':render()
