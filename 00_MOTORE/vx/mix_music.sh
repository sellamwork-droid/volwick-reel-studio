#!/bin/bash
# Adds a LICENSED music track under voice + sfx, ducked under the voice, then the HQ loudness chain.
# usage: VID=silent.mp4 VO=vo.wav SFX=sfx.wav MUSIC=track.mp3 START=secs_into_track ./mix_music.sh out.mp4
set -e; DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$VID"); P="${1%.mp4}_pre.wav"; M="${1%.mp4}_mix.wav"
ffmpeg -y -loglevel error -i "$VO" -i "$SFX" -ss "${START:-0}" -i "$MUSIC" -filter_complex \
"[0:a]aresample=48000:resampler=soxr,apad=whole_dur=$DUR,highpass=f=70,acompressor=threshold=-22dB:ratio=2:attack=15:release=180:knee=6,asplit=2[vo][sc];\
[2:a]aresample=48000:resampler=soxr,atrim=0:$DUR,afade=t=in:d=0.3,afade=t=out:st=$(python3 -c "print(max(0,$DUR-1.2))"):d=1.2,volume=0.32[mu];\
[mu][sc]sidechaincompress=threshold=0.02:ratio=8:attack=20:release=350[duck];\
[1:a]aresample=48000:resampler=soxr,volume=0.45[fx];[duck][fx][vo]amix=inputs=3:normalize=0:duration=first[a]" -map "[a]" -c:a pcm_f32le "$P"
II=$(ffmpeg -hide_banner -i "$P" -af loudnorm=print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p' | python3 -c "import sys,json;print(json.load(sys.stdin)['input_i'])")
G=$(python3 -c "print(round(-14.5-($II),2))")
ffmpeg -y -loglevel error -i "$P" -af "volume=${G}dB,alimiter=limit=0.813:attack=2:release=80:level=disabled,aresample=48000:resampler=soxr" -c:a pcm_s24le "$M"
ffmpeg -y -loglevel error -i "$VID" -i "$M" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -shortest -movflags +faststart "$1"; rm -f "$P"; echo ok
