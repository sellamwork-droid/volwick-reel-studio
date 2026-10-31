# T4 · Hook iniziale + grafico normale contro Volwick
Il tipo principale. Si apre con un hook forte, poi un grafico normale (stile TradingView, bianco), poi lo stesso momento dentro Volwick: si vede la differenza tra un grafico normale e Volwick. Senza voce, 20–25 s, due versioni audio (con base e MUSIC READY), finale approvato.

**Modello di riferimento: CREATIVE 06B** (`scenes/vx_drop2`, giudicato ottimo da Power). Struttura: clip hook dell'archivio agganciato al movimento del grafico (match cut con `vx/hook_match.py`), grafico normale bianco con cursore umano e replay, poi il terminale Volwick (divisore o dissolvenza) con la riga dei layer, layer accesi uno alla volta, tooltip del muro con Net in $, sotto ogni titolo una riga tecnica, finale approvato.
Per un video nuovo: copia `scenes/vx_drop2` in `scenes/<nome>`, cambia `gen_data.py` (evento di mercato), `E` (tempi), `WALLS`, `PRINTS`, `OVER`/`SUBS` (testi), `KF` (cursore).

Varianti dello stesso tipo (il confronto può partire da un metodo diverso dal grafico nudo):
- replay realistico: CREATIVE 01 (`scenes/vx_replay`), linee del trader disegnate e replay, poi Volwick;
- trendline: `scenes/vx_trend`; indicatore scartato: `scenes/vx_tool` e CREATIVE 02 One Layer; libro di trading: `scenes/vx_book`; una regola: CREATIVE 03 One Rule (`scenes/c03_one_rule`, audio `vx/c03_sound.py`).
Il metodo dell'altro non si scredita: resta valido, Volwick aggiunge il posizionamento dei dealer.
Esempi da cui nasce il tipo: `00_SAPERE/esempi_format/04_*` e `06_DOCS/MOTORE_VX_FORMAT.md`.
