# CREATIVE 02 · One Layer (30 ottobre 2026, v3)

Video in `04_RENDER/CREATIVE02_ONE_LAYER`: `VOLWICK_CREATIVE02_ONE_LAYER_HOOK.mp4` e `_HOOK_MUSIC_READY.mp4` (28,0 s), `VOLWICK_CREATIVE02_ONE_LAYER.mp4` e `_MUSIC_READY.mp4` (26,4 s), caption. 1080×1920, 60 fps, organico, senza voce. Mix −14,9 LUFS, picco −1,9 dBTP.
Codice (copia di lavoro della chat, da portare in 00_MOTORE): `scenes/vx_onelayer` (scene.js, gen_data.py, data.json, hook.html e hook.js per la scritta dell'hook), `vx/onelayer_sound.py`, mix con `vx/mix_replay.sh`.

## Correzioni di Power sulla v1 (15:44)
Riempire di più lo schermo; la parte Volwick più tecnica e sul valore: i nostri layer non sono indicatori, sono regole (le regole di copertura dei dealer).
- Finestra 96–940 × 492–1500, grafico in scala più grande (circa 15,6 px per punto, candele più larghe).
- Ogni titolo ha sotto una riga tecnica corta; su ogni muro il tooltip del terminale (→ ES prezzo · GEX, famiglia e γ, Net in $, nota sui valori per punto SPX). Nessuna riga descrittiva che non possiamo verificare.

## Hook
Scrape Down (01_HOOK), da 0,85 a 2,43 s, 1,6 s, scritta "I WANTED A CLEAN CHART." con logo. Match cut: il bordo del raschietto blu sale e arriva all'altezza del campo di ricerca blu della finestra Indicators (y circa 730 contro 762) sullo stesso fondo bianco. Il clip non ha audio.

## Testi
| Tempo | Titolo | Riga tecnica |
|---|---|---|
| 0.0 | I USED TO SEARCH FOR THE BEST INDICATOR. | |
| 3.15 | NOW I USE ONE LAYER. | It's not an indicator. It's dealer positioning, read from the options book, not from past price. |
| 5.0 | DEALER WALLS. TOP 5. | The five strikes where dealers carry the most gamma, in dollars per point. |
| 6.9 | GREEN ABSORBS. | Call wall, long γ. Dealers sell the rally to stay hedged. That's why price often stalls here. |
| 10.9 | MAGENTA LETS IT RUN. | Put wall, short γ. Dealers sell into the drop to stay hedged. That's why the move can speed up. |
| 14.9 | RED DEFENDS. | Put wall, long γ. Dealers buy the dip to stay hedged. That's why price often finds a floor. |
| 18.9 | THESE AREN'T INDICATORS. | They're hedging rules. You see where dealers hedge before price gets there. |
| 22.3 | finale approvato | TRADE WITH INSTITUTIONAL CONTEXT., DISCOVER VOLWICK →, Simulated data. Not investment advice. |

## Vincoli
- Sessione ES simulata (gen_data.py, seed fisso), dichiarata a schermo.
- WALLS non ha Off: Volwick si apre su Top 3, il trader sceglie Top 5 e compaiono il magenta e il rosso.
- Letture in ordine cronologico: verde, magenta, rosso. Nessuna previsione ("often", "can").
- Offerta solo in caption.
