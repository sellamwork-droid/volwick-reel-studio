# Motore video Volwick (VX), pacchetto completo (30 ottobre 2026)

Per lavorarci da un'altra chat: estrarre questo pacchetto in una cartella di lavoro e lanciare da lì.

- Render: `SCENE=scenes/vx_replay/index.html EVENTS_OUT=vx/out_replay/ev.json python3 tools/render.py video 60 vx/out_replay/silent.mp4` (serve Python con playwright e Chromium, ffmpeg).
- Fotogrammi di controllo: `SCENE=scenes/vx_replay/index.html python3 tools/render.py stills 1 5 10` (escono in stills/).
- Audio CREATIVE 01: `python3 vx/replay_sound.py vx/out_replay/ev.json sfx.wav bed.wav`, poi `VID=silent.mp4 SFX=sfx.wav BG=bed.wav|brano.mp3 START=sec vx/mix_replay.sh out.mp4 out_music_ready.mp4`.
- Video con voce (trend, tool, rule, book, edit): `vx/run_vx.sh`, voce assemblata con `vx/vx_assemble.py`.
- Regole: claude/volwick-preferenze-e-formati.md nel progetto, sezione Video VX. Scheda del primo video: claude/volwick-creative01-replay-30ott2026.md.
- Hook in testa con match cut (esempio CREATIVE 01 con Basketball Fail): `python3 vx/hook_overlay.py out.png "RIGA 1|RIGA 2" "PAROLE,BLU"` crea scritta e logo; `python3 vx/hook_match.py clip.mp4 t0 t1 velocità overlay.png hook.mp4 srcX srcY dstX dstY scala` fa l'avvicinamento che porta il punto (srcX, srcY) del clip sul punto (dstX, dstY) del primo fotogramma del grafico; poi concat con la scena (variante `index.html#hook` di vx_replay). Audio: `OFFSET=<durata hook> HOOK_WAV=hook.wav python3 vx/replay_sound.py ev.json sfx.wav bed.wav`. Studio e catalogo dei clip: claude/volwick-hook-catalogo-30ott2026.md nel progetto.
