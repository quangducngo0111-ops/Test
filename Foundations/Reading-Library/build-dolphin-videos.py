"""Create four real MP4 animations from the approved pixel-art scene.
Motion graphics are applied to the source artwork; no substitute blocky animals.
"""
from pathlib import Path
import math,random
import numpy as np
from PIL import Image,ImageDraw
import imageio.v2 as imageio

ROOT=Path(__file__).resolve().parent
SRC=ROOT/'dolphin-scenes'/'scene-1.webp'
OUT=ROOT/'dolphin-scenes'
W,H,FPS,FRAMES=552,466,18,108
source=Image.open(SRC).convert('RGB').resize((W+36,H+30),Image.Resampling.LANCZOS)
for scene in range(1,5):
    random.seed(scene*271)
    bubbles=[(random.uniform(0,W),random.uniform(0,H),random.uniform(7,20)) for _ in range(40)]
    dest=OUT/('scene-%s.mp4'%scene)
    with imageio.get_writer(str(dest),fps=FPS,codec='libx264',quality=7,macro_block_size=2,ffmpeg_log_level='error',output_params=['-pix_fmt','yuv420p','-movflags','+faststart']) as writer:
        for n in range(FRAMES):
            t=n/FPS
            dx=int(15+math.sin(t*.48+scene*.4)*7)
            dy=int(12+math.sin(t*.6+scene*.4)*5)
            frame=source.crop((dx,dy,dx+W,dy+H)).convert('RGBA')
            overlay=Image.new('RGBA',(W,H),(0,0,0,0))
            d=ImageDraw.Draw(overlay,'RGBA')
            for i,(x,y,speed) in enumerate(bubbles):
                yy=(y-t*speed+H)%H
                xx=x+math.sin(t*.8+i)*4
                d.ellipse((xx-2,yy-2,xx+2,yy+2),outline=(165,245,250,105),width=1)
            if scene==2:
                for offset in (0,.85,1.7):
                    age=(t-offset)%3.3
                    r=int(18+age*54);alpha=int(max(0,175-age*49))
                    if alpha:d.arc((340-r,132-r,340+r,132+r),-52,56,fill=(123,251,244,alpha),width=3)
            elif scene==3:
                for i,ox in enumerate((220,390)):
                    age=(t-i*.9)%2.8
                    r=int(18+age*42);alpha=int(max(0,155-age*48))
                    if alpha:d.arc((ox-r,205-r,ox+r,205+r),-80,80,fill=(114,237,247,alpha),width=2)
            elif scene==4:
                bx=int(375+math.sin(t*.4)*23)
                d.polygon([(bx-48,45),(bx+51,45),(bx+40,55),(bx-38,55)],fill=(14,42,80,215))
                d.rectangle((bx-15,34,bx+18,45),fill=(17,47,86,215))
                d.rectangle((bx+1,24,bx+4,34),fill=(17,47,86,215))
                for j in range(5):
                    yy=62+j*17
                    pts=[(x,int(yy+(x-bx)*.35+math.sin(x*.29+t*7+j)*7)) for x in range(bx-45,bx+57,7)]
                    d.line(pts,fill=(182,229,246,105),width=2)
            frame=Image.alpha_composite(frame,overlay)
            writer.append_data(np.asarray(frame.convert('RGB')))
    print(dest.name,dest.stat().st_size)
