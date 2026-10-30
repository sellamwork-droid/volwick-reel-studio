#!/bin/bash
# usage: ./mix_voice.sh voice.wav out.mp4   (voice sidechain-ducks the bed, final -14 LUFS / -1.5 dBTP)
V="$1"; O="$2"; M="${O%.mp4}_mix.wav"
ffmpeg -y -loglevel error -i ${BED:-music_sfx.wav} -i "$V" -filter_complex \
"[1:a]aresample=48000,apad=whole_dur=${DUR:-29},highpass=f=80,acompressor=threshold=-20dB:ratio=3:attack=5:release=120,equalizer=f=3500:t=q:w=1:g=2,asplit=2[vo][sc];\
[0:a]volume=0.55[bed];[bed][sc]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=350[duck];\
[duck][vo]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=8[a]" -map "[a]" -ar 48000 "$M"
ffmpeg -y -loglevel error -i ${VID:-pilot_silent60.mp4} -i "$M" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart "$O"
