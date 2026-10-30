# CREATIVE 01 · Replay realistico (30 ottobre 2026)

Video in `04_RENDER/CREATIVE01_REPLAY`: `VOLWICK_CREATIVE01_REPLAY.mp4` (25 s, senza hook) e `VOLWICK_CREATIVE01_REPLAY_HOOK.mp4` (25 s, con hook Basketball Fail), ognuno anche in versione `_MUSIC_READY` (solo effetti). 1080×1920, 60 fps, organico.
Codice: `13_REEL_STUDIO/00_MOTORE/scenes/vx_replay` (scene.js, gen_data.py, data.json; variante con hook `index.html#hook`), `vx/replay_sound.py`, `vx/mix_replay.sh`, `vx/hook_overlay.py`, `vx/hook_match.py`.

## Vincoli
- Sessione ES simulata da zero (gen_data.py, seed fisso): tick 0,25, volatilità che cresce sulla rottura, nessun dato reale. Le registrazioni del 27 ottobre non si usano.
- Il replay non è truccato: il prezzo tocca la resistenza disegnata (7,741.25) e torna indietro, poi rompe, arriva al call wall e lo buca e rientra.
- Volwick non ha una modalità replay: nella parte Volwick non compare nessun comando di replay, le candele continuano come in diretta.
- Le linee del trader restano nella parte Volwick come annotazione tratteggiata "YOUR LEVEL" (non è una funzione del terminale).
- WALLS parte già su Top 5 (non esiste "Off"): i muri entrano per primi quando si apre Volwick, poi MAPS → Gamma, BLOCK PRINTS e CVD si accendono dalla riga dei layer.

## Timeline (versione senza hook; con hook tutto dopo il Play è anticipato di 1,45 s)
| Tempo | Schermo | Cursore | Overlay |
|---|---|---|---|
| 0.0–1.9 | grafico bianco, 60 candele 1m | strumento linea orizzontale (0.92), click sul massimo 7,741.50 (1.86) | YOU DRAW THE LEVELS. |
| 1.9–3.5 | | strumento (2.42), click sul minimo 7,722.75 (3.46) | |
| 4.3–10 | replay: candele che si formano tick per tick, grafico che scorre | click Play (4.3), poi deriva sul grafico | SO DOES EVERYONE ELSE. (4.6) |
| 10.1–11.3 | prezzo testa la resistenza e arretra | hover sulla linea, che si seleziona | BUT WHAT'S BEHIND THE LEVELS? |
| 11.35–11.85 | dissolvenza al terminale Volwick, stesse candele e stessa scala | | |
| 12.0 | Dealer Walls entrano (Top 5) | | SEE THE POSITIONING. (12.35) |
| 13.2–13.7 | MAPS ▾ → Gamma: mappa blu/ambra con gradino del flip | click MAPS, click Gamma | |
| 14.6 | BLOCK PRINTS on: barre bianche, pill oro, ★★ 7733.25 1,284 · 2 blocks | click toggle | |
| 15.4 | CVD on: pannello sotto il grafico | click toggle | |
| 14.6–18 | rottura della resistenza, corsa verso il call wall 7,746.5 | | |
| 18.15–20.9 | tooltip del muro: → ES 7,746.5 · GEX · Call wall · short γ · Accelerative · Net −$16.2M | hover sul muro | TRADE WITH INSTITUTIONAL CONTEXT. (18.45) |
| 20.9–25 | finale approvato: la linea del prezzo si piega nella V, wordmark, TRADE WITH INSTITUTIONAL CONTEXT. a macchina, DISCOVER VOLWICK →, Simulated data. Not investment advice. | | |

## Hook (versione _HOOK)
Basketball Fail, 1,5 s, scritta "PRICE AT THE HIGH.". Avvicinamento che porta la sbarra alta sul massimo del grafico (x 274, y 882); taglio mentre molla la presa; primo fotogramma del grafico col mirino sullo stesso massimo, strumento linea già attivo, linea disegnata a 0,45 s. Studio in claude/volwick-hook-catalogo-30ott2026.md.

## Riga dei layer (dallo screenshot di Power)
VOLWICK | ● ES prezzo variazione ▾ | 1m | DEALER [WALLS Top 5 ▾] [METRIC GEX ▾] [EXPIRY All ▾] [MAPS ▾] | [ES LEVELS Shifted +33.6 ▾] | ACTIVITY [BLOCK PRINTS ▾ oro] [CVD] [CDI] [FLOW] | ? GUIDE | MARKET INTELLIGENCE. Sul telefono è disposta su tre righe, stesso ordine e stesso stile.

## Audio
Clic reali del mouse su ogni azione, tick morbidi all'accensione dei layer, logo sonoro sul flash della V. Base originale lo-fi a 92 BPM come segnaposto: quando Power manda il brano, `BG=brano.mp3 START=sec ./mix_replay.sh`. Mix circa −14.8 LUFS, picco sotto −1.5 dBTP.

## Disclaimer
A schermo: "Illustrative replay. Simulated data." e, da Volwick in poi, "Dealer Walls: modeled options-derived positioning." Nel finale solo "Simulated data. Not investment advice." (regola del finale approvato). Offerta e basis mapping per ES/MES stanno nella caption.
