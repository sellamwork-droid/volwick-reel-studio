#!/bin/bash
out=$1; shift; rm -rf stills; SCENE=scenes/c05_edit/index.html python3 tools/render.py stills "$@" >/tmp/st.log 2>&1 || cat /tmp/st.log
ls stills/*.png | sort -t t -k2 -n > /tmp/l.txt; n=$(wc -l < /tmp/l.txt)
args=""; f=""; for i in $(seq 0 $((n-1))); do p=$(sed -n "$((i+1))p" /tmp/l.txt); args="$args -i $p"; lab=$(basename $p .png); f="$f[$i:v]scale=270:-1,drawtext=text='$lab':x=8:y=8:fontsize=22:fontcolor=yellow[v$i];"; done
lay=$(python3 -c "n=$n;c=min(n,6);print('|'.join(f'{(i%c)*270}_{(i//c)*480}' for i in range(n)))")
ins=""; for i in $(seq 0 $((n-1))); do ins="$ins[v$i]"; done
ffmpeg -v error -y $args -filter_complex "$f${ins}xstack=inputs=$n:layout=$lay:fill=black" $out
