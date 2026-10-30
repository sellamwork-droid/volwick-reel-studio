# VOLWICK REEL STUDIO

Tutto quello che serve per generare i reel Volwick sta qui dentro. La cartella si sposta insieme alla cartella madre `VOLWICK` (le regole stanno in `../01_PROGETTO_STATO_E_BRIEF`). Le istruzioni per Claude sono in `CLAUDE.md`.

## Su un computer nuovo
1. Copia l'intera cartella `VOLWICK` sulla Scrivania (`~/Desktop/VOLWICK`).
2. Doppio clic su `00_SETUP/INSTALLA_REEL_STUDIO.command` (installa ffmpeg, Python, Chromium per il render, le librerie, Claude Code).
3. Doppio clic su `00_SETUP/VERIFICA.command`: deve fare un fotogramma di prova e dire "tutto ok".
4. Per lavorare: Terminale, `cd ~/Desktop/VOLWICK/13_REEL_STUDIO`, poi `claude`. Oppure apri la cartella in Claude (Cowork).

## I 5 formati
1. **F1 Voce e spiegazione**, modello Assorbimento V2 (`scenes/absorption_v2`).
2. **F2 Replay schermo**, modelli CREATIVE 01 (`vx_replay`) e CREATIVE 06B (`vx_drop2`, struttura preferita: hook clip agganciato, grafico TradingView bianco, Volwick).
3. **F3 Edit con musica**, modello CREATIVE 05 (`c05_edit`).
4. **F4 Live orizzontale** dal terminale vero, in `../11_LIVE_MARKET_REACTIONS` con le sue regole.
5. **F5 Confronto** con TradingView o altri metodi, modelli `vx_trend`, `vx_tool`, `vx_book`, CREATIVE 02 e 03.

## Video fatti (04_RENDER)
CREATIVE01_REPLAY · CREATIVE02_ONE_LAYER · CREATIVE03_ONE_RULE · CREATIVE05_EDIT · CREATIVE06_THE_DROP · CREATIVE06B_THE_DROP_HOOK · ARCHIVIO_VX_30OTT (primi cinque VX).

## Note
- `.venv` dentro `00_MOTORE` si rifà su ogni computer con l'installazione: non si copia a mano.
- Le cartelle `_da_eliminare` contengono solo pacchetti già estratti: si possono cancellare.
- Il codice di CREATIVE 02 (`scenes/vx_onelayer`) è rimasto nella copia di lavoro della sua chat: va portato in `00_MOTORE/scenes/` alla prossima sessione di quella chat.
