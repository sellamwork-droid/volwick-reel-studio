# VOLWICK REEL STUDIO

Tutto quello che serve per generare i reel Volwick sta qui dentro e su Google Drive. Le istruzioni per Claude sono in `CLAUDE.md`, il sapere sul prodotto in `00_SAPERE`, le regole di Power in `REGOLE/PREFERENZE_E_FORMATI.md`.

## Dove sta cosa
| Dove | Cosa |
|---|---|
| GitHub `sellamwork-droid/volwick-reel-studio` (questa cartella) | motore, regole, sapere su Volwick, memoria dei video, catalogo hook, coda dei lavori (Issues) |
| Google Drive `VOLWICK REEL STUDIO` | `00_CARICA_QUI` (materiale nuovo), `01_VIDEO` (video finiti), `02_LIBRERIA` (musica e video consigliati catalogati), `03_ARCHIVIO_CARICAMENTI`, `04_ARCHIVIO_VIDEO` (tutti i video fatti prima), `05_SAPERE_VOLWICK` (copia leggibile di `00_SAPERE`), le guide PDF, il prompt di avvio e la skill |

## Come si lavora
- **Mac, Terminale:** `cd ~/Desktop/VOLWICK/13_REEL_STUDIO && claude`, poi "inizia". Installazione: `GUIDA_UTENTE.pdf`.
- **Chat dell'app Claude** (Mac o Windows): chat nuova, + Aggiungi cartella Drive, "inizia reel studio". Guide: `GUIDA_UTENTE.pdf` pagina 4, `GUIDA_UTENTE_WINDOWS.pdf`, `GUIDA_UTENTE_NUOVO_ACCOUNT.pdf` (account Claude diverso: `00_SETUP/PROMPT_AVVIO_CHAT.txt` e `00_SETUP/skill/SKILL.md`).

## I 5 formati
1. **F1 Voce e spiegazione**, modello Assorbimento V2 (`scenes/absorption_v2`).
2. **F2 Replay schermo**, modelli CREATIVE 01 (`vx_replay`) e CREATIVE 06B (`vx_drop2`, struttura preferita: hook clip agganciato, grafico TradingView bianco, Volwick).
3. **F3 Edit con musica**, modello CREATIVE 05 (`c05_edit`).
4. **F4 Live orizzontale** dal terminale vero, con le regole del Live Market Reactions (licenza dei dati confermata prima di ogni uscita).
5. **F5 Confronto** con TradingView o altri metodi, modelli `vx_trend`, `vx_tool`, `vx_book`, CREATIVE 02 e 03.
I video esempio da cui nascono i format: fotogrammi in `00_SAPERE/esempi_format/`, video interi su Drive in `02_LIBRERIA/03_VIDEO_CONSIGLIATI/<categoria>`, elenco in `07_RIFERIMENTI/RIFERIMENTI.csv`, ragionamento in `06_DOCS/MOTORE_VX_FORMAT.md`.

## Video fatti
Elenco, stato e giudizi: `MEMORIA/video/*.json` (e `INDICE_VIDEO.csv` su Drive). I file sono su Drive in `01_VIDEO`; quelli fatti prima del Reel Studio in `04_ARCHIVIO_VIDEO`.

## Note
- `.venv` dentro `00_MOTORE` si crea su ogni computer con l'installazione: non si copia a mano. Nelle chat cloud non serve.
- Il codice di CREATIVE 02 (`scenes/vx_onelayer`) non è nel repository: è rimasto nella chat che l'ha fatto. Per rifarlo si parte da `scenes/vx_tool` e dalla scheda `06_DOCS/CREATIVE02_ONE_LAYER.md`.
