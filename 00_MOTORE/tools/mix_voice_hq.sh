#!/bin/bash
# HQ mix (29 Oct 2026): clean voice chain (no compressor, no EQ boost), sidechain-ducked bed,
# gentle 2:1 voice leveller, measured static gain to -14.5 LUFS + safety peak limiter at -1.8 dBFS,
# soxr resampling, AAC 320k.
# usage: BED=sfx.wav VID=silent.mp4 DUR=secs ./mix_voice_hq.sh voice.wav out.mp4
V="$1"; O="$2"; M="${O%.mp4}_mix.wav"; P="${O%.mp4}_pre.wav"
ffmpeg -y -loglevel error -i ${BED} -i "$V" -filter_complex \
"[1:a]aresample=48000:resampler=soxr,apad=whole_dur=${DUR},highpass=f=70,acompressor=threshold=-22dB:ratio=2:attack=15:release=180:knee=6:makeup=1,asplit=2[vo][sc];\
[0:a]aresample=48000:resampler=soxr,volume=0.5[bed];[bed][sc]sidechaincompress=threshold=0.03:ratio=6:attack=25:release=400[duck];\
[duck][vo]amix=inputs=2:normalize=0:duration=first[a]" -map "[a]" -c:a pcm_f32le "$P"
II=$(ffmpeg -hide_banner -i "$P" -af loudnorm=print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p' | python3 -c "import sys,json;print(json.load(sys.stdin)['input_i'])")
G=$(python3 -c "print(round(-14.5-($II),2))")
ffmpeg -y -loglevel error -i "$P" -af "volume=${G}dB,alimiter=limit=0.813:attack=2:release=80:level=disabled,aresample=48000:resampler=soxr" -c:a pcm_s24le "$M"
ffmpeg -y -loglevel error -i "${VID}" -i "$M" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -shortest -movflags +faststart "$O"
rm -f "$P"; echo ok
