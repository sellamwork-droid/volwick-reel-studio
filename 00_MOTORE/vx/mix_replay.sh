#!/bin/bash
# No-voice mix: SFX + background (synth bed or Power's track). The MUSIC_READY export keeps the same gain without the background.
# usage: VID=silent.mp4 SFX=sfx.wav BG=bed.wav|track.mp3 [START=secs] [BGVOL=0.55] ./mix_replay.sh out.mp4 out_music_ready.mp4
set -e; DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$VID"); P="${1%.mp4}_pre.wav"; M="${1%.mp4}_mix.wav"; P2="${2%.mp4}_pre.wav"; M2="${2%.mp4}_mix.wav"
FO=$(python3 -c "print(max(0,$DUR-1.4))")
ffmpeg -y -loglevel error -i "$SFX" -ss "${START:-0}" -i "$BG" -filter_complex \
"[1:a]aresample=48000:resampler=soxr,atrim=0:$DUR,asetpts=N/SR/TB,afade=t=in:d=0.05,afade=t=out:st=$FO:d=1.4,volume=${BGVOL:-0.55}[bg];\
[0:a]aresample=48000:resampler=soxr,apad=whole_dur=$DUR,asplit=2[fx][fx2];[bg][fx]amix=inputs=2:normalize=0:duration=longest,atrim=0:$DUR[a];[fx2]atrim=0:$DUR[b]" \
-map "[a]" -c:a pcm_f32le "$P" -map "[b]" -c:a pcm_f32le "$P2"
II=$(ffmpeg -hide_banner -i "$P" -af loudnorm=print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p' | python3 -c "import sys,json;print(json.load(sys.stdin)['input_i'])")
G=$(python3 -c "print(round(-14.5-($II),2))")
for pair in "$P:$M:$1" "$P2:$M2:$2"; do IFS=: read a b c <<< "$pair"
  ffmpeg -y -loglevel error -i "$a" -af "volume=${G}dB,alimiter=limit=0.77:attack=2:release=80:level=disabled,aresample=48000:resampler=soxr" -c:a pcm_s24le "$b"
  ffmpeg -y -loglevel error -i "$VID" -i "$b" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -shortest -movflags +faststart "$c"; rm -f "$a"; done; echo ok gain $G
