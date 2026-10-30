#!/bin/bash
# usage: ./run_lang.sh <lang> <outdir> <NAME>   (voice already assembled in <outdir>/vo.wav)
set -e; l=$1; o=$2; N=$3; cd "$(dirname "$0")"
python3 copy_lint.py $l > $o/lint.txt || { cat $o/lint.txt; exit 1; }
python3 make_caption.py $l $o/${N}_caption.txt $o
python3 copy_lint.py $l $o/${N}_caption.txt >> $o/lint.txt || { cat $o/lint.txt; exit 1; }
cd ..
SCENE="scenes/pglang/index.html?d=../../plang/$o" EVENTS_OUT=plang/$o/ev.json python3 tools/render.py video 60 plang/$o/silent.mp4 > plang/$o/render.log 2>&1
python3 tools/vw_sound.py plang/$o/ev.json plang/$o/sfx.wav >> plang/$o/render.log 2>&1
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 plang/$o/silent.mp4)
BED=plang/$o/sfx.wav VID=plang/$o/silent.mp4 DUR=$DUR bash mix_voice_hq.sh plang/$o/vo.wav plang/$o/$N.mp4 >> plang/$o/render.log 2>&1
echo "$l done $(tail -1 plang/$o/lint.txt)"
