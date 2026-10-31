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

## I 4 tipi di video (cartelle uguali in 03_FORMATI, su Drive in 01_VIDEO e nei video consigliati)
1. **T1 Edit** (`01_EDIT`): montaggio veloce a tempo di musica, senza voce. Modello CREATIVE 05 (`c05_edit`).
2. **T2 Spiegazione con voce** (`02_SPIEGAZIONE_VOCE`): un concetto spiegato dalla voce HeyGen, con sottotitoli e grafico simulato. Modello Assorbimento V2 (`scenes/absorption_v2`).
3. **T3 Registrazione schermo** (`03_REGISTRAZIONE_SCHERMO`): il terminale vero sul mercato vero, con le regole Live Market Reactions (licenza dei dati confermata prima di ogni uscita).
4. **T4 Hook + grafico normale vs Volwick** (`04_HOOK_GRAFICO_VS_VOLWICK`): hook al primo fotogramma, grafico normale stile TradingView, poi Volwick che mostra la differenza. Modello CREATIVE 06B (`vx_drop2`); varianti `vx_replay`, `vx_trend`, `vx_tool`, `vx_book`.
I vecchi codici F1–F5: F1→T2, F2→T4, F3→T1, F4→T3, F5→T4.

## Video fatti
Elenco, stato e giudizi: `MEMORIA/video/*.json` (e `INDICE_VIDEO.csv` su Drive). I file sono su Drive in `01_VIDEO`; quelli fatti prima del Reel Studio in `04_ARCHIVIO_VIDEO`.

## Note
- `.venv` dentro `00_MOTORE` si crea su ogni computer con l'installazione: non si copia a mano. Nelle chat cloud non serve.
- Il codice di CREATIVE 02 (`scenes/vx_onelayer`) non è nel repository: è rimasto nella chat che l'ha fatto. Per rifarlo si parte da `scenes/vx_tool` e dalla scheda `06_DOCS/CREATIVE02_ONE_LAYER.md`.
