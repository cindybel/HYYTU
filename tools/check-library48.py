from pathlib import Path
import subprocess,json,numpy as np
from PIL import Image,ImageDraw
out=Path('video/originals');report=[];sheet=Image.new('RGB',(960,3360),(5,10,20));d=ImageDraw.Draw(sheet)
for i,meta in enumerate(json.loads((out/'manifest.json').read_text(encoding='utf-8'))):
 p=out/(meta['id']+'.mp4')
 probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(p)]))
 raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(p),'-vf','scale=160:90','-f','rawvideo','-pix_fmt','rgb24','-'])
 frames=np.frombuffer(raw,dtype=np.uint8).reshape(-1,90,160,3).astype(np.float32);delta=np.abs(np.diff(frames,axis=0)).mean(axis=(1,2,3));seam=float(np.abs(frames[-1]-frames[0]).mean());assert len(frames)==240;assert delta.max()>0;assert seam<=float(delta.max())*1.5+.2,(p,seam,delta.max())
 report.append(dict(id=meta['id'],frames=len(frames),duration=probe['format']['duration'],codec=probe['streams'][0]['codec_name'],bytes=p.stat().st_size,seamDifference=seam,maxAdjacentDifference=float(delta.max())))
 im=Image.open(out/(meta['id']+'.jpg'));im.thumbnail((320,180));xx=i%3*320;yy=i//3*210;sheet.paste(im,(xx,yy));d.text((xx+12,yy+187),meta['label'],fill='white')
sheet.save('documentation/qa/library48-contact.jpg');Path('documentation/qa/library48-encoding.json').write_text(json.dumps(report,indent=2));print(json.dumps({'passed':True,'count':len(report),'bytes':sum(x['bytes'] for x in report)}))
