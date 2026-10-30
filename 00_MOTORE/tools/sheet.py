import sys,subprocess
from PIL import Image, ImageDraw
vid,out=sys.argv[1],sys.argv[2]; ts=[float(x) for x in sys.argv[3].split(',')]
ims=[]
for t in ts:
    raw=subprocess.run(['ffmpeg','-v','error','-ss',str(t),'-i',vid,'-frames:v','1','-s','270x480','-f','rawvideo','-pix_fmt','rgb24','-'],capture_output=True).stdout
    im=Image.frombytes('RGB',(270,480),raw); d=ImageDraw.Draw(im); d.rectangle([0,0,60,18],fill=(0,0,0)); d.text((4,3),f'{t:.1f}s',fill=(255,230,0)); ims.append(im)
cols=min(6,len(ims)); rows=(len(ims)+cols-1)//cols
s=Image.new('RGB',(270*cols,480*rows))
for i,im in enumerate(ims): s.paste(im,((i%cols)*270,(i//cols)*480))
s.save(out)
