#!/bin/bash
# usage: run_vx.sh <name> <OUTNAME>
set -e; n=$1; N=$2; cd "$(dirname "$0")/.."; o=vx/out_$n; mkdir -p $o
SCENE="scenes/vx_$n/index.html" EVENTS_OUT=$o/ev.json python3 tools/render.py video 60 $o/silent.mp4 > $o/render.log 2>&1
python3 vx/vx_sound.py $n $o/ev.json $o/sfx.wav >> $o/render.log 2>&1
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 $o/silent.mp4)
[ -f $o/vo.wav ] || ffmpeg -v error -y -f lavfi -i anullsrc=r=48000:cl=mono -t $DUR -c:a pcm_s24le $o/vo.wav
BED=$o/sfx.wav VID=$o/silent.mp4 DUR=$DUR bash mix_voice_hq.sh $o/vo.wav $o/$N.mp4 >> $o/render.log 2>&1
echo "$n done $DUR"
