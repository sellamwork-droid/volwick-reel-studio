# F2 · Replay schermo
Modelli: CREATIVE 06B (`scenes/vx_drop2`, struttura preferita) e CREATIVE 01 (`scenes/vx_replay`). Schede in `06_DOCS`.
Struttura: clip hook dell'archivio agganciato al movimento del grafico (match cut con `vx/hook_match.py`), grafico normale stile TradingView bianco con cursore umano e replay, poi il terminale Volwick (divisore o dissolvenza) con la riga dei layer, layer accesi uno alla volta, tooltip del muro con Net in $, sotto ogni titolo una riga tecnica, finale approvato. 20–25 s, senza voce, due versioni audio.
Per un video nuovo: copia `scenes/vx_drop2` in `scenes/<nome>`, cambia `gen_data.py` (evento di mercato), `E` (tempi), `WALLS`, `PRINTS`, `OVER`/`SUBS` (testi), `KF` (cursore).
