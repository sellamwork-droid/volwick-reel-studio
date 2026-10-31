# V0001 · THE WALL BREAKS (T4, 31 ottobre 2026)

Tipo T4 (hook + grafico normale contro Volwick), prova del sistema. Modello CREATIVE 06B, scena `00_MOTORE/scenes/v0001_wall_breaks` (copiata da `vx_drop2`).
Video su Drive: `01_VIDEO/04_HOOK_GRAFICO_VS_VOLWICK/V0001_THE_WALL_BREAKS` (con hook, senza hook, MUSIC READY), 21,7 s, −14,9 LUFS, picco −1,9 dBFS.

## Aperture valutate (su 40)
A BMX che salta il muro e cade giù, match cut sulla rottura del supporto 37 (prodotta) · B "il tuo supporto si è rotto" dentro il grafico senza clip 33 · C due grafici affiancati 31.

## Sequenza
| s (dopo l'hook di 1,27 s) | Schermo | Titolo / riga tecnica |
|---|---|---|
| hook | BMX Rider 1.90–2.80 s, rallentato 0,5 da 2.45, torso (540,520) sulla candela (786,1000), zoom 2,0 | YOUR SUPPORT JUST BROKE. |
| 0.64 | grafico bianco, il prezzo attraversa la linea 7,722.50 | ES 1m · price slices through the line you drew |
| 2.15 | | WHAT WAS UNDER THE LINE? / A line shows where. Not how dealers hedge below it. |
| 3.35–5.0 | divisore LINES ONLY / WITH VOLWICK | |
| 5.15 | put wall short γ −$11.2M a 7,719.5, put wall long γ +$13.8M a 7,706.5 | SEE THE POSITIONING. |
| 6.85 | BLOCK PRINTS: 1,400 ×2 sulla rottura, 1,050 sul minimo | |
| 8.3 | | Next put wall · long γ · +$13.8M. The fall stalled one tick above. |
| 9.8 | tooltip del muro short γ | |
| 10.8 | | TRADE WITH INSTITUTIONAL CONTEXT. / Short γ can speed moves up. Long γ can slow them. Not a signal. |
| 16.3 | finale approvato | |

## Come si rifà
```
cd 00_MOTORE && mkdir -p vx/out_v0001 && O=vx/out_v0001 C="../01_HOOK/clip/BMX Rider Leaps Over Concrete Wall.mp4"
(cd scenes/v0001_wall_breaks && python3 gen_data.py)
SCENE=scenes/v0001_wall_breaks/index.html EVENTS_OUT=$O/ev.json python3 tools/render.py video 60 $O/silent_chart.mp4
SIZE=58 LH=62 Y0=347 BAND_END=430 BAND_A=0.62 BAND_FADE=50 python3 vx/hook_overlay.py $O/hook_ov.png "YOUR SUPPORT|JUST BROKE." "SUPPORT"
python3 vx/hook_match.py "$C" "1.90:2.45:1.0,2.45:2.80:0.5" $O/hook_ov.png $O/hook_v.mp4 540 520 786 1000 2.0
ffmpeg -ss 1.90 -t 0.90 -i "$C" -filter_complex "[0:a]asplit=2[a][b];[a]atrim=0:0.55,asetpts=N/SR/TB[a1];[b]atrim=0.55:0.90,asetpts=N/SR/TB,atempo=0.5[b1];[a1][b1]concat=n=2:v=0:a=1,aresample=48000,aformat=channel_layouts=stereo[o]" -map "[o]" $O/hook_a.wav
cd $O && OFFSET=1.2667 HOOK_WAV=hook_a.wav python3 ../replay_sound.py ev.json sfx.wav bed.wav
ffmpeg -i hook_v.mp4 -i silent_chart.mp4 -filter_complex "[0:v]settb=1/60,setpts=PTS-STARTPTS[a];[1:v]settb=1/60,setpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=1:a=0,format=yuv420p[v]" -map "[v]" -c:v libx264 -crf 15 -r 60 silent.mp4
VID=silent.mp4 SFX=sfx.wav BG=bed.wav ../mix_replay.sh VOLWICK_THE_WALL_BREAKS.mp4 VOLWICK_THE_WALL_BREAKS_MUSIC_READY.mp4
```
