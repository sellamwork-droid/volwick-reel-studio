# CREATIVE 03 · One Rule (30 ottobre 2026)

Video in `04_RENDER/CREATIVE03_ONE_RULE`: con hook (14,6 s) e senza (13,6 s), ognuno con `_MUSIC_READY`, caption. 1080×1920, 60 fps, organico, senza voce.
Codice: `00_MOTORE/scenes/c03_one_rule` (scene.js) e `00_MOTORE/vx/c03_sound.py`; copia di lavoro originale in `04_RENDER/CREATIVE03_ONE_RULE/codice_lavoro`. Render: `SCENE=scenes/c03_one_rule/index.html EVENTS_OUT=vx/out_c03/ev.json python3 tools/render.py video 60 vx/out_c03/silent.mp4`, poi `[OFFSET=durata hook] python3 vx/c03_sound.py ev.json sfx.wav bed.wav` e `vx/mix_replay.sh`.

## Versioni
- V1: terminale sul fondo bianco, scartata ("non ha senso con lo sfondo bianco").
- V2: terminale dentro un monitor in uno studio chiaro, apertura larga e zoom sul muro.
- V3: più professionale, hook sempre.

## V3
- Hook 1,0 s: Soccer Player Launches Ball Overhead, solo il cielo (crop 289×513 da x 356, y 0, sorgente 1,66–2,2 s, rallentato 2x). Il crop toglie cartelloni e sponsor. Scritta "WHY DOES IT STALL / RIGHT THERE?" (STALL in blu) con logo.
- Match cut: palla a (502, 1045) nell'ultimo fotogramma dell'hook, mirino del cursore nello stesso punto sull'ultima candela che sale verso il muro.
- Apertura forte anche senza hook: grafico già ingrandito (1,55) col prezzo sotto il muro verde.
- A ogni tocco del muro (1,1 / 3,6 / 6,1 s) micro spinta della camera (+4%) e colpo sordo.
- A 7,7 s la camera si allarga sul monitor, il cursore va su WALLS · Top 3.

## Contenuto
Muri: ciano 7,766.5 −$9.6M, verde call long γ 7,758.5 +$24.5M, rosso put long γ 7,738.5 +$11.3M. Sessione ES simulata: tre tocchi del muro verde, chiusure sempre sotto, poi laterale. Tooltip: Call wall · long γ, Net +$24.5M.
