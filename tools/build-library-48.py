"""Extend the original six loops to 48. Deterministic geometric motion; no external media."""
from pathlib import Path
import math,json,subprocess,concurrent.futures
import numpy as np
from PIL import Image,ImageDraw,ImageFilter,ImageChops
import imageio_ffmpeg
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'video/originals';T=math.tau;W,H=1280,720
NAMES=[('particles','Poussière cosmique'),('contours','Courbes topographiques'),('waves','Marées'),('arcs','Éclipse'),('petals','Floraison'),('helix','Double hélice'),('lattice','Tissu lumineux'),('circuit','Circuit'),('discs','Satellites'),('spiral','Spirale'),('bars','Séquence'),('terrain','Relief'),('triangles','Pyramides'),('squares','Portails'),('stars','Constellation'),('scope','Oscilloscope'),('columns','Colonnes'),('diamonds','Cristaux'),('fan','Éventail'),('knots','Nœuds'),('rays','Rayons')]
GROUPS=['warmup']*10+['groove']*11+['rise']*11+['peak']*10
NEW=[dict(id=f'{kind}-{v+1}',kind=kind,variant=v,label=f'{label} · {"Suspendu" if v==0 else "Déploiement"}',energy=GROUPS[i*2+v]) for i,(kind,label) in enumerate(NAMES) for v in range(2)]
def frame(m,t):
 kind,v=m['kind'],m['variant'];a=T*t;speed=1 if m['energy'] in ('warmup','groove') else 2;b=a*speed
 im=Image.new('RGB',(W,H),(3,6,15));ink=Image.new('RGB',(W,H));d=ImageDraw.Draw(ink)
 def color(j):return [(50,170,200),(172,92,210),(220,155,90),(80,190,150)][(j//4+v)%4]
 def line(pts,j=0,width=2):d.line(pts,fill=color(j),width=width)
 def poly(cx,cy,r,n,angle,j=0,ratio=1):line([(cx+r*math.cos(angle+k*T/n),cy+r*ratio*math.sin(angle+k*T/n)) for k in range(n+1)],j)
 if kind=='particles':
  rng=np.random.default_rng(710+v)
  for j in range(120 if v else 75):
   xx,yy=rng.uniform(50,1230),rng.uniform(50,670);p=rng.uniform(0,T);xx+=30*math.sin(a+p);yy+=20*math.cos(a+p*(2 if v else 1));r=1+j%3
   d.ellipse((xx-r,yy-r,xx+r,yy+r),fill=color(j))
   if v and j%3==0:line([(xx,yy),(xx+18*math.cos(a+p),yy+18*math.sin(a+p))],j,1)
 elif kind=='contours':
  for j in range(24):
   pts=[]
   for k in range(181):
    q=k*T/180;r=30+j*10+13*math.sin(q*(3+v*2)+a+j*.14)+8*math.cos(q*2-a)
    pts.append((640+r*math.cos(q)*(1.6 if v else 1),360+r*math.sin(q)))
   line(pts,j)
 elif kind=='waves':
  for j in range(32):
   pts=[(x,130+j*15+30*math.sin(x/(120+v*100)+a+j*.22)+20*math.cos(x/190-a+j*.17)) for x in range(0,W+1,8)]
   if v:pts=[(640+(x-640)*.8+(y-360)*.3,y) for x,y in pts]
   line(pts,j)
 elif kind=='arcs':
  for j in range(22):
   r=60+j*10;cx=640+(150*math.sin(a) if v else 0);cy=360
   start=(a*180/math.pi+j*17)*(1 if j%2 else -1);d.arc((cx-r,cy-r,cx+r,cy+r),start,start+(150 if v else 260),fill=color(j),width=3)
 elif kind=='petals':
  for j in range(15):
   pts=[]
   for k in range(241):
    q=k*T/240;r=(70+j*12)*(1+.22*math.cos(q*(5+v*3)+a+j*.1))
    pts.append((640+r*math.cos(q+.12*math.sin(a)),360+r*math.sin(q+.12*math.sin(a))))
   line(pts,j)
 elif kind=='helix':
  for j in range(65):
   x=100+j*17;phase=j*.15+b;yy=100*math.sin(phase);z=.5+.5*math.cos(phase)
   p=(x,360+yy);q=(x,360-yy)
   if v:p=(640+yy,50+j*9);q=(640-yy,50+j*9)
   line([p,q],j,1);r=2+2*z
   for xx,y in (p,q):d.ellipse((xx-r,y-r,xx+r,y+r),fill=color(j))
 elif kind=='lattice':
  for j in range(25):
   for axis in range(2):
    pts=[]
    for k in range(81):
     x=180+k*12;y=100+j*21+25*math.sin(k*.11+b+j*.2)
     if axis:x,y=640+(y-360)*1.7,360+(x-640)*.5
     if v:x+=40*math.sin(y/120-a);y+=20*math.cos(x/170+a)
     pts.append((x,y))
    line(pts,j,1)
 elif kind=='circuit':
  for j in range(24):
   x=70+j*48;y=100+(j%5)*100;offset=30*math.sin(b+j*.4)
   pts=[(x,80),(x,200+offset),(x+20,220+offset),(x+20,560),(x+40,580)]
   if v:pts=[(640+(yy-360)*1.8,360+(xx-640)*.45) for xx,yy in pts]
   line(pts,j);xx,yy=pts[2];r=4;d.ellipse((xx-r,yy-r,xx+r,yy+r),outline=color(j),width=2)
 elif kind=='discs':
  for j in range(18):
   q=j*T/18+(.3*math.sin(b));rad=160+60*math.sin(a+j*.5);cx=640+rad*math.cos(q);cy=360+rad*math.sin(q)
   if v:cx=140+(j%6)*200+20*math.sin(b+j);cy=140+(j//6)*210
   r=15+8*math.sin(a+j)**2;d.ellipse((cx-r,cy-r,cx+r,cy+r),outline=color(j),width=3)
 elif kind=='spiral':
  for j in range(5+v*3):
   pts=[]
   for k in range(301):
    q=k*.055+j*T/(5+v*3)+b;r=10+k*.85
    pts.append((640+r*math.cos(q),360+r*math.sin(q)*(1 if v else .7)))
   line(pts,j*4)
 elif kind=='bars':
  for j in range(44):
   x=90+j*25;length=50+190*(.5+.5*math.sin(b+j*.2))
   if v:line([(x,620-length*2),(x,620)],j,8)
   else:line([(x,360-length),(x,360+length)],j,5)
 elif kind=='terrain':
  for j in range(28):
   pts=[]
   for k in range(101):
    x=80+k*11.2;y=140+j*16+35*math.sin(k*.13+a+j*.2)*math.sin(j*.12+a)
    if v:y+=45*math.cos(k*.07-b)
    pts.append((x,y))
   line(pts,j)
 elif kind in ('triangles','squares','diamonds'):
  n={'triangles':3,'squares':4,'diamonds':4}[kind]
  if not v:
   for j in range(22):poly(640,360,30+j*12,n,.15*math.sin(b)+j*.05+(math.pi/4 if kind=='diamonds' else 0),j, .65 if kind=='diamonds' else 1)
  else:
   for j in range(24):poly(160+j%6*190,130+j//6*155,35+12*math.sin(b+j*.3),n,.3*math.sin(b+j*.2)+(math.pi/4 if kind=="diamonds" else 0),j,.55 if kind=="diamonds" else 1)
 elif kind=='stars':
  for j in range(16 if v else 10):
   cx=160+j%5*240;cy=180+j//5*150
   if v:cx=640+200*math.cos(j*T/16);cy=360+200*math.sin(j*T/16)
   pts=[]
   for k in range(13):
    q=k*T/12+(.3*math.sin(b));r=(32 if k%2==0 else 10)+4*math.sin(a+j)
    pts.append((cx+r*math.cos(q),cy+r*math.sin(q)))
   line(pts,j)
 elif kind=='scope':
  for j in range(12):
   pts=[]
   for k in range(301):
    q=k*T/300;x=640+400*math.sin(q*(2+v)+.3*math.sin(b)+j*.025);y=360+220*math.sin(q*3+b+j*.06)
    pts.append((x,y))
   line(pts,j)
 elif kind=='columns':
  for j in range(12):
   x=140+j*90
   for k in range(12):
    y=80+k*50;shift=22*math.sin(b+k*.3+j*.3)
    if v:poly(x+shift,y,12,4,(.2*math.sin(b))+j*.05,j+k)
    else:line([(x-20,y+shift),(x+20,y+shift)],j+k,3)
 elif kind=='fan':
  for j in range(90):
   q=j*math.pi/89;r=240+40*math.sin(b+j*.1)
   cx=640;cy=570 if not v else 360
   line([(cx,cy),(cx+1.8*r*math.cos(q+.1*math.sin(a)),cy-r*math.sin(q+.1*math.sin(a)))],j,1)
   if v:line([(cx,cy),(cx-1.8*r*math.cos(q),cy+r*math.sin(q))],j,1)
 elif kind=='knots':
  for j in range(9):
   pts=[]
   for k in range(241):
    q=k*T/240;r=160+50*math.cos(q*(3+v)+b+j*.07)
    pts.append((640+r*math.cos(q*2),360+r*math.sin(q*2)*.7+50*math.sin(q*3+b+j*.07)))
   line(pts,j*2)
 elif kind=='rays':
  for j in range(64):
   q=j*T/64+.07*math.sin(b);r=100+35*math.sin(b+j*.4);end=r+100+70*math.sin(a+j*.2)**2
   cx=640+(180*math.sin(a) if v else 0)
   line([(cx+r*math.cos(q),360+r*math.sin(q)),(cx+end*math.cos(q),360+end*math.sin(q))],j,3)
 return ImageChops.add(ImageChops.add(im,ink.filter(ImageFilter.GaussianBlur(6))),ink)

def render(m):
 dest=OUT/(m['id']+'.mp4')
 if dest.exists() and not m.get("force"):return m
 tmp=OUT/(m['id']+'.render.mp4');cmd=[imageio_ffmpeg.get_ffmpeg_exe(),'-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s','1280x720','-r','30','-i','-','-an','-c:v','libx264','-threads','2','-preset','fast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',str(tmp)]
 p=subprocess.Popen(cmd,stdin=subprocess.PIPE)
 try:
  for i in range(240):p.stdin.write(frame(m,i/240).tobytes())
 finally:p.stdin.close()
 if p.wait():raise RuntimeError(m['id'])
 tmp.replace(dest);frame(m,.25).save(OUT/(m['id']+'.jpg'),quality=92);print('RENDERED '+m['id'],flush=True);return m
if __name__=='__main__':
 with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:list(pool.map(render,NEW))
 base=json.loads((OUT/'manifest.json').read_text(encoding='utf-8'))[:6]
 for m,g in zip(base,['warmup','warmup','groove','rise','peak','peak']):m['energy']=g
 for m in NEW:base.append(dict(m,src='/video/originals/'+m['id']+'.mp4',poster='/video/originals/'+m['id']+'.jpg',width=1280,height=720,fps=30,seconds=8))
 (OUT/'manifest.json').write_text(json.dumps(base,ensure_ascii=False,indent=2),encoding='utf-8')
 print('COMPLETE 48',flush=True)
