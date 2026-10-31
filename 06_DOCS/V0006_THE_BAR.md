# V0006 · THE BAR (T4, 31 ottobre 2026)

Tipo T4 (hook + grafico normale contro Volwick). Scena `00_MOTORE/scenes/v0006_the_bar` (da V0001 / `vx_drop2`), sessione tudorswork · chat 02:31 · cloud.
Video su Drive: `01_VIDEO/04_HOOK_GRAFICO_VS_VOLWICK/06 Falsa rottura sotto il call wall (31-10-2026).mp4`; MUSIC READY in `04_ARCHIVIO_VIDEO/V0006_THE_BAR`. 21,4 s, −15,7 LUFS, picco −1,8 dBFS.

## Aperture valutate (su 40)
A saltatore con l'asta che sale verso l'asticella e ricade, match cut sulla candela del massimo che scende 35 (prodotta) · B "breakout?" dentro il grafico senza clip 31 · C due grafici affiancati 30.

## Storia
Resistenza disegnata a 7,731.50 (massimo precedente). Il prezzo la supera, si ferma a 7,733.25, un tick sotto il call wall long γ (+$12.6M a 7,733.5), rientra sotto la linea e tiene sopra il put wall long γ (+$9.7M a 7,722.5). Block Prints 1,250 ×2 sul massimo. Dati simulati (`gen_data.py`, seed 20261106). Scala più stretta (PTOP 7745, PX 24) per riempire la finestra.

## Sequenza (dopo l'hook di 0,97 s)
| s | Schermo | Titolo / riga tecnica |
|---|---|---|
| hook | Pole Vaulter 0.72–1.40 s, rallentato 0,6 da 1.00, torso sulla candela del massimo, zoom 1,4 | YOUR BREAKOUT JUST FAILED. |
| 0.0 | grafico bianco, candela sopra la linea che rientra (0,35 s) | ES 1m · price pokes over the line you drew, then drops back |
| 2.15 | | WHAT WAS ABOVE THE LINE? / A line shows where. Not how dealers hedge above it. |
| 3.35–5.0 | divisore LINES ONLY / WITH VOLWICK | |
| 5.15 | muri Top 5 | SEE THE POSITIONING. / Call wall · long γ · +$12.6M, two points over your line |
| 6.85 | Block Prints | Block Prints: 1,250 ×2 traded at the high |
| 8.3 | | The push stalled one tick under the call wall. |
| 9.8 | tooltip del call wall | |
| 10.8 | | TRADE WITH INSTITUTIONAL CONTEXT. / Long γ: dealers hedge against the move. Context, not a signal. |
| 16.3 | finale approvato | |

## Come si rifà
```
cd 00_MOTORE && O=vx/out_v0006 && mkdir -p $O && C="../01_HOOK/clip/Pole Vaulter Falls During Attempt.mp4"
(cd scenes/v0006_the_bar && python3 gen_data.py)
SCENE=scenes/v0006_the_bar/index.html EVENTS_OUT=$O/ev.json python3 tools/render.py video 60 $O/silent_chart.mp4
SIZE=58 LH=62 Y0=347 BAND_END=430 BAND_A=0.62 BAND_FADE=50 python3 vx/hook_overlay.py $O/hook_ov.png "YOUR BREAKOUT|JUST FAILED." "BREAKOUT"
python3 vx/hook_match.py "$C" "0.72:1.0:1.0,1.0:1.4:0.6" $O/hook_ov.png $O/hook_v.mp4 817 1061 800 900 1.4
ffmpeg -ss 0.72 -t 0.68 -i "$C" -filter_complex "[0:a]asplit=2[a][b];[a]atrim=0:0.28,asetpts=N/SR/TB[a1];[b]atrim=0.28:0.68,asetpts=N/SR/TB,atempo=0.6[b1];[a1][b1]concat=n=2:v=0:a=1,aresample=48000,aformat=channel_layouts=stereo[o]" -map "[o]" $O/hook_a.wav
cd $O && OFFSET=0.966667 HOOK_WAV=hook_a.wav python3 ../replay_sound.py ev.json sfx.wav bed.wav
ffmpeg -i hook_v.mp4 -i silent_chart.mp4 -filter_complex "[0:v]settb=1/60,setpts=PTS-STARTPTS[a];[1:v]settb=1/60,setpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=1:a=0,format=yuv420p[v]" -map "[v]" -c:v libx264 -crf 15 -r 60 silent.mp4
VID=silent.mp4 SFX=sfx.wav BG=bed.wav bash ../mix_replay.sh VOLWICK_THE_BAR.mp4 VOLWICK_THE_BAR_MUSIC_READY.mp4
```

## Versione 2 (31 ottobre, dopo i giudizi di Power)
- Audio = prova A: niente audio del clip, una base dal primo fotogramma, fruscio sotto l'hook, colpo sul taglio (`AUDIO_MODE=base python3 ../../scenes/v0006_the_bar/sound.py`, senza HOOK_WAV).
- Transizione = variante 3 con curva di velocità: `SCENE="scenes/v0006_the_bar/index.html?var=3"`. Contatto a 0,32 s, scia e freccia rosse fino a 2,2 s.
- La prima versione (audio del clip spezzato, replay senza curva) è in archivio come `V0006_V1.mp4`; le prove audio (A, B, C) e di transizione (1, 2, 3) sono nella stessa cartella.
