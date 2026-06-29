# -*- coding: utf-8 -*-
"""
מנוע הסטייל של רוני — קאבר ממוסגר דו-לשוני + כרטיס סיום ממותג.
נועל את "מתכון רוני" (כמו בפיד שלה): מסגרת אלגנטית, כותרת אנגלית בסריף,
כיתוב עברי, קו זהב, וכרטיס סיום כהה עם CTA ומייל.

שימוש:
  python3 ronny_style.py cover  --frame frame.png --heb "אירוח ולייפסטייל" --title "Staycation" --sub "Hotel Showcase · UGC" --out cover.png
  python3 ronny_style.py endcard --headline "רוצים תוכן כזה למותג שלכם?" --out endcard.png

הערה: לסטייל סופי מומלץ להניח גופן Heebo-Bold.ttf ב-כלים/fonts/ (ברירת מחדל: DejaVu/Liberation).
"""
import argparse, os
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter
from bidi.algorithm import get_display

_HERE = os.path.dirname(os.path.abspath(__file__))
def _font(*names, fallback):
    for n in names:
        p = os.path.join(_HERE, "fonts", n)
        if os.path.exists(p): return p
    return fallback
HEB   = _font("Heebo-Regular.ttf", "Heebo.ttf", fallback="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")
HEB_B = _font("Heebo-Bold.ttf", fallback="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")
SERIF   = "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf"
SERIF_B = "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"
WARM=(244,239,232); GOLD=(224,184,95); MUT=(208,198,186); DARK=(19,16,12); COPPER=(224,140,92)

from PIL import features as _ft
def F(p,s): return ImageFont.truetype(p,s)
# כש-Pillow מקומפל עם raqm הוא עושה bidi בעצמו → אסור get_display (היפוך כפול)
def H(t): return t if _ft.check("raqm") else get_display(t)

def crop45(img,w=1080,h=1350):
    img=img.convert("RGB"); tr=w/h; ir=img.width/img.height
    if ir>tr:
        nw=int(img.height*tr); x=(img.width-nw)//2; img=img.crop((x,0,x+nw,img.height))
    else:
        nh=int(img.width/tr); y=(img.height-nh)//2; img=img.crop((0,y,img.width,y+nh))
    return img.resize((w,h),Image.LANCZOS)

def grade(img):
    img=ImageEnhance.Contrast(img).enhance(1.06); img=ImageEnhance.Color(img).enhance(1.05)
    r,g,b=img.split(); r=r.point(lambda v:min(255,int(v*1.02))); b=b.point(lambda v:int(v*0.98))
    img=Image.merge("RGB",(r,g,b))
    v=Image.new("L",img.size,0)
    ImageDraw.Draw(v).ellipse([-img.width*0.25,-img.height*0.2,img.width*1.25,img.height*1.2],fill=255)
    v=v.filter(ImageFilter.GaussianBlur(240)); dark=ImageEnhance.Brightness(img).enhance(0.74)
    return Image.composite(img,dark,v)

def _tracked(d,t,font,cx,y,tr,fill):
    ws=[d.textlength(c,font=font) for c in t]; total=sum(ws)+tr*(len(t)-1); x=cx-total/2
    for c,w in zip(t,ws): d.text((x,y),c,font=font,fill=fill); x+=w+tr

def _load_frame(path):
    if path.lower().endswith((".mp4",".mov",".m4v")):
        import cv2, numpy as np
        cap=cv2.VideoCapture(path); best=None; bs=-1; n=int(cap.get(cv2.CAP_PROP_FRAME_COUNT)) or 0
        idxs=np.linspace(0,max(n-1,1),min(30,max(n,1))).astype(int) if n>0 else range(0,300,10)
        for i in idxs:
            if n>0: cap.set(cv2.CAP_PROP_POS_FRAMES,int(i))
            ok,fr=cap.read()
            if not ok: continue
            g=cv2.cvtColor(fr,cv2.COLOR_BGR2GRAY); s=cv2.Laplacian(g,cv2.CV_64F).var()*max(1-abs(g.mean()-130)/130,0.15)
            if s>bs: bs=s; best=fr
        cap.release()
        return Image.fromarray(cv2.cvtColor(best,cv2.COLOR_BGR2RGB))
    return Image.open(path)

def cover(frame,heb_top,eng_title,eng_sub,out):
    img=grade(crop45(_load_frame(frame))).convert("RGBA"); cx=540
    bw,bh=840,320; bx0=cx-bw//2; by0=675-bh//2; bx1=bx0+bw; by1=by0+bh
    panel=Image.new("RGBA",img.size,(0,0,0,0))
    ImageDraw.Draw(panel).rectangle([bx0-40,by0-40,bx1+40,by1+40],fill=(12,9,6,120))
    img=Image.alpha_composite(img,panel.filter(ImageFilter.GaussianBlur(26)))
    d=ImageDraw.Draw(img,"RGBA")
    d.rectangle([bx0,by0,bx1,by1],outline=WARM,width=2)
    d.rectangle([bx0+11,by0+11,bx1-11,by1-11],outline=(224,184,95,140),width=1)
    d.text((cx,by0+50),H(heb_top),font=F(HEB,34),fill=WARM,anchor="mm")
    _tracked(d,eng_title.upper(),F(SERIF_B,74),cx,by0+92,8,WARM)
    d.line([cx-58,by0+212,cx+58,by0+212],fill=GOLD,width=2)
    _tracked(d,eng_sub.upper(),F(SERIF,30),cx,by1-56,5,MUT)
    img.convert("RGB").save(out,quality=95)

def endcard(headline,email,handle,out,avatar=None):
    W,Ht=1080,1920; img=Image.new("RGB",(W,Ht),DARK)
    glow=Image.new("L",(W,Ht),0); ImageDraw.Draw(glow).ellipse([W*0.05,-Ht*0.05,W*0.95,Ht*0.4],fill=255)
    glow=glow.filter(ImageFilter.GaussianBlur(240)).point(lambda v:int(v*0.22))
    img=Image.composite(Image.new("RGB",(W,Ht),COPPER),img,glow)
    d=ImageDraw.Draw(img,"RGBA"); cx=540
    if avatar and os.path.exists(avatar):
        s=150; av=Image.open(avatar).convert("RGB").resize((s,s))
        m=Image.new("L",(s,s),0); ImageDraw.Draw(m).ellipse([0,0,s,s],fill=255)
        img.paste(av,(cx-s//2,528),m); d.ellipse([cx-s//2,528,cx+s//2,528+s],outline=GOLD,width=3)
    else:
        d.ellipse([cx-46,560,cx+46,652],fill=COPPER); d.text((cx,606),H("ר"),font=F(HEB,52),fill=DARK,anchor="mm")
    d.text((cx,740),H("רוני"),font=F(HEB_B,84),fill=WARM,anchor="mm")
    d.text((cx,812),handle,font=F(SERIF,34),fill=GOLD,anchor="mm")
    d.line([cx-90,890,cx+90,890],fill=(224,184,95,160),width=2)
    d.text((cx,1000),H(headline),font=F(HEB,46),fill=WARM,anchor="mm")
    d.text((cx,1120),H("שלחו DM או מייל:"),font=F(HEB,36),fill=MUT,anchor="mm")
    d.text((cx,1185),email,font=F(SERIF,38),fill=WARM,anchor="mm")
    img.save(out,quality=95)

if __name__=="__main__":
    ap=argparse.ArgumentParser(); sub=ap.add_subparsers(dest="cmd",required=True)
    c=sub.add_parser("cover"); c.add_argument("--frame",required=True); c.add_argument("--heb",default="")
    c.add_argument("--title",required=True); c.add_argument("--sub",default="UGC"); c.add_argument("--out",required=True)
    e=sub.add_parser("endcard"); e.add_argument("--headline",default="רוצים תוכן כזה למותג שלכם?")
    e.add_argument("--email",default="shaya.studio.creative@gmail.com"); e.add_argument("--handle",default="@ronnys_creative"); e.add_argument("--out",required=True)
    a=ap.parse_args()
    if a.cmd=="cover": cover(a.frame,a.heb,a.title,a.sub,a.out)
    else: endcard(a.headline,a.email,a.handle,a.out)
    print("ok:",a.out)
