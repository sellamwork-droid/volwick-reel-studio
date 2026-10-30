#!/bin/bash
# usage: stills_sheet.sh <scene_dir> <out.png> t1 t2 ...
SC=$1; OUT=$2; shift 2; cd "$(dirname "$0")/.."; rm -rf stills_tmp_$$; mkdir -p stills_tmp_$$
[ -d stills ] && mv stills stills_keep_$$
SCENE="scenes/$SC/index.html" timeout 600 python3 tools/render.py stills "$@" > stills_tmp_$$/log.txt 2>&1 || { tail -5 stills_tmp_$$/log.txt; }
mv stills/* stills_tmp_$$/ 2>/dev/null; rmdir stills 2>/dev/null; [ -d stills_keep_$$ ] && mv stills_keep_$$ stills
python3 - "$OUT" stills_tmp_$$ <<'PY'
import sys,glob
from PIL import Image
fs=sorted(glob.glob(sys.argv[2]+'/t*.png')); ims=[Image.open(f).resize((390,693)) for f in fs]
W=Image.new('RGB',(400*len(ims)-10,693),'white')
for i,im in enumerate(ims): W.paste(im,(i*400,0))
W.save(sys.argv[1])
PY
grep -i error stills_tmp_$$/log.txt | head -5; rm -rf stills_tmp_$$
