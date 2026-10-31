# V0007 · THE FLOOR GIVES (T1, 31 ottobre 2026)

Tipo T1 (edit a tempo, senza voce, senza hook: regola 31 ottobre 03:04). Scena `00_MOTORE/scenes/v0007_floor_gives` (da V0002 / `c05_edit`), suono `scenes/v0007_floor_gives/sound.py` senza HOOK_WAV, mix `vx/mix_c05.sh`. Sessione tudorswork · chat 02:31 · cloud.
Video su Drive: `01_VIDEO/01_EDIT/02 Il pavimento dei Block Prints a tempo di musica (31-10-2026).mp4`; MUSIC READY in `04_ARCHIVIO_VIDEO/V0007_THE_FLOOR_GIVES`. 19,5 s, −15,3 LUFS, picco vero −3,0 dBFS.

## Differenze da V0002
Si apre con il logo che si accende (nessun clip). Sessione nuova (`gen_data.py`, seed 20261107): discesa veloce da 7,744 sul pavimento 7,729.75, base con tre Block Prints (810 + 655 + 535 = 2,000), poi recupero fino a 7,741. Muri: put short γ −$12.9M 7,722.5, put long γ +$15.8M 7,729.5, call long γ +$7.4M 7,737.5, call long γ +$19.2M 7,744.5 (stella), call short γ −$10.6M 7,749.5.

## Come si rifà
```
cd 00_MOTORE && O=vx/out_v0007 && mkdir -p $O && (cd scenes/v0007_floor_gives && python3 gen_data.py)
SCENE=scenes/v0007_floor_gives/index.html EVENTS_OUT=$O/ev.json python3 tools/render.py video 60 $O/silent.mp4
cd $O && python3 ../../scenes/v0007_floor_gives/sound.py ev.json sfx.wav bed.wav
VID=silent.mp4 SFX=sfx.wav BG=bed.wav bash ../mix_c05.sh VOLWICK_THE_FLOOR_GIVES.mp4 VOLWICK_THE_FLOOR_GIVES_MUSIC_READY.mp4
# picco vero sopra −1,5 dopo l'AAC: limitatore sovracampionato
for f in VOLWICK_THE_FLOOR_GIVES VOLWICK_THE_FLOOR_GIVES_MUSIC_READY; do ffmpeg -i $f.mp4 -c:v copy -af "aresample=192000,alimiter=limit=0.70:level=disabled,aresample=48000" -c:a aac -b:a 320k ${f}_t.mp4 && mv ${f}_t.mp4 $f.mp4; done
```
