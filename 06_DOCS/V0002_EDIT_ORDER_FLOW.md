# V0002 · EDIT ORDER FLOW (T1, 31 ottobre 2026)

Tipo T1 (edit a tempo di musica, senza voce), prova del sistema. È CREATIVE 05 rifatto con le correzioni che aveva in sospeso: hook al primo fotogramma, riga dei layer nuova (niente ES LEVELS, GUIDE, MARKET INTELLIGENCE), scheda OPTIONS FLOW al posto di Market Intelligence, parole TRADE / WITH / INSTITUTIONAL / CONTEXT. e finale approvato (VX.end), nessuna offerta nel video.
Scena `00_MOTORE/scenes/v0002_edit_flow` (copiata da `c05_edit`), suono `scenes/v0002_edit_flow/sound.py` (copia di `vx/c05_sound.py` con HOOK_WAV sulla prima battuta), mix `vx/mix_c05.sh`.
Video su Drive: `01_VIDEO/01_EDIT/V0002_EDIT_ORDER_FLOW` (con base e MUSIC READY, tagli a 125 BPM), 19,5 s, −15,0 LUFS, picco −3,0 dBFS.

## Aperture valutate (su 40)
A Ocean Drop (sasso che cade nel vuoto, WHERE'S THE FLOOR?), taglio sul battere nella riga dei layer 34 (prodotta) · B logo che si accende (CREATIVE 05) 27 · C "2,000" a pixel come prima immagine 31.

## Come si rifà
```
cd 00_MOTORE && O=vx/out_v0002 && mkdir -p $O && C="../01_HOOK/clip/Ocean Drop.mp4"
SCENE=scenes/v0002_edit_flow/index.html EVENTS_OUT=$O/ev.json python3 tools/render.py video 60 $O/silent_scene.mp4
SIZE=58 LH=62 Y0=347 BAND_END=430 BAND_A=0.62 BAND_FADE=50 python3 vx/hook_overlay.py $O/hook_ov.png "WHERE'S|THE FLOOR?" "FLOOR"
python3 vx/hook_match.py "$C" "1.55:3.70:1.1316" $O/hook_ov.png $O/hook_v.mp4 564 1184 540 900 1.6        # 115 fotogrammi = 1,917 s
ffmpeg -ss 1.55 -t 2.15 -i "$C" -af "atempo=1.1316,aresample=48000,aformat=channel_layouts=stereo" $O/hook_a.wav
cd $O && ffmpeg -i hook_v.mp4 -ss 1.91666 -i silent_scene.mp4 -filter_complex "[0:v]settb=1/60,setpts=PTS-STARTPTS[a];[1:v]settb=1/60,setpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=1:a=0,format=yuv420p[v]" -map "[v]" -c:v libx264 -crf 15 -r 60 silent.mp4
HOOK_WAV=hook_a.wav python3 ../../scenes/v0002_edit_flow/sound.py ev.json sfx.wav bed.wav
VID=silent.mp4 SFX=sfx.wav BG=bed.wav bash ../mix_c05.sh VOLWICK_EDIT_ORDER_FLOW.mp4 VOLWICK_EDIT_ORDER_FLOW_MUSIC_READY.mp4
```
