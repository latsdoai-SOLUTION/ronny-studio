import sys, os, json, subprocess, tempfile
from PIL import Image, ImageDraw, ImageFont, ImageFilter, features
def H(t):
    if features.check("raqm"): return t
    from bidi.algorithm import get_display; return get_display(t)
HEB="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"; HEB_B="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
SERIF="/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf"; SERIF_B="/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"
WARM=(244,239,232);GOLD=(224,184,95);MUT=(208,198,186);DARK=(19,16,12);COPPER=(224,140,92)
AVATAR=os.environ.get("RONNY_AVATAR", os.path.join(os.path.dirname(os.path.abspath(__file__)),"profile.jpg"))
def F(p,s): return ImageFont.truetype(p,s)
def run(c): subprocess.run(c,check=True)
def grab(clip,t,out): run(["ffmpeg","-y","-loglevel","error","-ss",str(t),"-i",clip,"-frames:v","1",out])

def wrap(d,t,f,mw):
    o=[];cur=""
    for w in t.split():
        s=(cur+" "+w).strip()
        if d.textlength(s,font=f)<=mw:cur=s
        else:o.append(cur);cur=w
    if cur:o.append(cur)
    return o
def cap_png(text,out,size=62,y=1470):
    img=Image.new("RGBA",(1080,1920),(0,0,0,0));d=ImageDraw.Draw(img);f=F(HEB_B,size)
    ls=wrap(d,text,f,960);lh=size*1.25;yy=y-lh*len(ls)/2
    for ln in ls:
        for dx,dy in[(0,3),(3,0),(0,-3),(-3,0),(2,2),(-2,2)]:d.text((540+dx,yy+dy),ln,font=f,fill=(0,0,0,160),anchor="ma")
        d.text((540,yy),ln,font=f,fill=(255,255,255,255),anchor="ma");yy+=lh
    img.save(out)
def cover_png(frame,heb,title,sub,out):
    from PIL import ImageEnhance
    img=Image.open(frame).convert("RGB");w,h=1080,1350;tr=w/h;ir=img.width/img.height
    if ir>tr: nw=int(img.height*tr);x=(img.width-nw)//2;img=img.crop((x,0,x+nw,img.height))
    else: nh=int(img.width/tr);yy=(img.height-nh)//2;img=img.crop((0,yy,img.width,yy+nh))
    img=img.resize((w,h),Image.LANCZOS)
    img=ImageEnhance.Contrast(img).enhance(1.06);img=ImageEnhance.Color(img).enhance(1.05)
    v=Image.new("L",img.size,0);ImageDraw.Draw(v).ellipse([-w*0.25,-h*0.2,w*1.25,h*1.2],fill=255)
    v=v.filter(ImageFilter.GaussianBlur(240));img=Image.composite(img,ImageEnhance.Brightness(img).enhance(0.74),v).convert("RGBA")
    cx=540;bw,bh=840,320;bx0=cx-bw//2;by0=675-bh//2;bx1=bx0+bw;by1=by0+bh
    p=Image.new("RGBA",img.size,(0,0,0,0));ImageDraw.Draw(p).rectangle([bx0-40,by0-40,bx1+40,by1+40],fill=(12,9,6,120))
    img=Image.alpha_composite(img,p.filter(ImageFilter.GaussianBlur(26)));d=ImageDraw.Draw(img,"RGBA")
    d.rectangle([bx0,by0,bx1,by1],outline=WARM,width=2);d.rectangle([bx0+11,by0+11,bx1-11,by1-11],outline=(224,184,95,140),width=1)
    d.text((cx,by0+50),H(heb),font=F(HEB,34),fill=WARM,anchor="mm")
    t=title.upper();ws=[d.textlength(c,font=F(SERIF_B,74)) for c in t];tot=sum(ws)+8*(len(t)-1);x=cx-tot/2
    for c,wd in zip(t,ws):d.text((x,by0+92),c,font=F(SERIF_B,74),fill=WARM);x+=wd+8
    d.line([cx-58,by0+212,cx+58,by0+212],fill=GOLD,width=2)
    s=sub.upper();ws=[d.textlength(c,font=F(SERIF,30)) for c in s];tot=sum(ws)+5*(len(s)-1);x=cx-tot/2
    for c,wd in zip(s,ws):d.text((x,by1-56),c,font=F(SERIF,30),fill=MUT);x+=wd+5
    img.convert("RGB").save(out,quality=95)
def endcard_png(headline,out):
    W,Ht=1080,1920;img=Image.new("RGB",(W,Ht),DARK)
    g=Image.new("L",(W,Ht),0);ImageDraw.Draw(g).ellipse([W*0.05,-Ht*0.05,W*0.95,Ht*0.4],fill=255)
    g=g.filter(ImageFilter.GaussianBlur(240)).point(lambda v:int(v*0.22));img=Image.composite(Image.new("RGB",(W,Ht),COPPER),img,g)
    d=ImageDraw.Draw(img,"RGBA");cx=540
    if os.path.exists(AVATAR):
        av=Image.open(AVATAR).convert("RGB");s=min(av.size);av=av.crop(((av.width-s)//2,(av.height-s)//2,(av.width+s)//2,(av.height+s)//2)).resize((190,190))
        m=Image.new("L",(190,190),0);ImageDraw.Draw(m).ellipse([0,0,190,190],fill=255);img.paste(av,(cx-95,470),m);d.ellipse([cx-95,470,cx+95,660],outline=GOLD,width=4)
    else: d.ellipse([cx-46,560,cx+46,652],fill=COPPER);d.text((cx,606),H("ר"),font=F(HEB,52),fill=DARK,anchor="mm")
    d.text((cx,745),H("רוני"),font=F(HEB_B,80),fill=WARM,anchor="mm")
    d.text((cx,815),"@ronnys_creative",font=F(SERIF,34),fill=GOLD,anchor="mm")
    d.line([cx-90,888,cx+90,888],fill=(224,184,95,160),width=2)
    d.text((cx,995),H(headline),font=F(HEB,46),fill=WARM,anchor="mm")
    d.text((cx,1115),H("שלחו DM או מייל:"),font=F(HEB,36),fill=MUT,anchor="mm")
    d.text((cx,1180),"shaya.studio.creative@gmail.com",font=F(SERIF,38),fill=WARM,anchor="mm")
    img.save(out)

def main(brief_path,outdir):
    b=json.load(open(brief_path));os.makedirs(outdir,exist_ok=True)
    # cover
    cf=os.path.join(outdir,"_cf.png");grab(b["cover"]["frame"],b["cover"]["frame_time"],cf)
    cover_png(cf,b["cover"]["heb"],b["cover"]["title"],b["cover"]["sub"],os.path.join(outdir,"cover.png"))
    # captions
    caps=[]
    for i,c in enumerate(b["captions"]):
        p=os.path.join(outdir,f"_cap{i}.png");cap_png(c["text"],p);caps.append((p,c["t0"],c["t1"]))
    # endcard
    ep=os.path.join(outdir,"endcard.png");endcard_png(b["endcard"]["headline"],ep)
    # body: normalize clips + concat + overlay captions
    ins=[];fc=[];n=len(b["clips"])
    for i,cl in enumerate(b["clips"]):
        ins+=["-i",cl["file"]];t0,t1=cl.get("trim",[0,9999])
        fc.append(f"[{i}:v]trim={t0}:{t1},setpts=PTS-STARTPTS,scale=1080:1920:flags=lanczos,unsharp=5:5:0.5:5:5:0.0,eq=contrast=1.04:saturation=1.05[v{i}]")
    fc.append("".join(f"[v{i}]" for i in range(n))+f"concat=n={n}:v=1:a=0[bv]")
    cur="bv"
    for j,(p,t0,t1) in enumerate(caps):
        ins+=["-i",p];nl=f"o{j}";fc.append(f"[{cur}][{n+j}:v]overlay=0:0:enable='between(t,{t0},{t1})'[{nl}]");cur=nl
    body=os.path.join(outdir,"_body.mp4")
    run(["ffmpeg","-y","-loglevel","error"]+ins+["-filter_complex",";".join(fc),"-map",f"[{cur}]","-r","30","-c:v","libx264","-preset","veryfast","-crf","20","-pix_fmt","yuv420p","-an",body])
    endv=os.path.join(outdir,"_end.mp4")
    run(["ffmpeg","-y","-loglevel","error","-loop","1","-t","2.6","-i",ep,"-vf","scale=1080:1920,format=yuv420p","-r","30","-c:v","libx264","-preset","veryfast","-crf","20","-an",endv])
    lst=os.path.join(outdir,"_list.txt");open(lst,"w").write(f"file '{body}'\nfile '{endv}'\n")
    reel=os.path.join(outdir,"reel.mp4");run(["ffmpeg","-y","-loglevel","error","-f","concat","-safe","0","-i",lst,"-c","copy",reel])
    for f in os.listdir(outdir):
        if f.startswith("_"): os.remove(os.path.join(outdir,f))
    print("REEL:",reel)
main(sys.argv[1],sys.argv[2])
