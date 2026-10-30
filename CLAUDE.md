# VOLWICK REEL STUDIO · istruzioni per Claude

Questa cartella è il sistema completo per generare i reel Volwick (TikTok, Instagram Reels, Shorts). Chi apre una sessione di Claude qui, su qualsiasi computer, deve poter lavorare senza chiedere dove sono le cose. È anche un repository GitHub privato condiviso da tutti i computer e da tutte le sessioni di Claude di Power: si lavora sempre sull'ultima versione e si salva sempre qui.

## Leggi prima di toccare qualsiasi cosa
1. `REGOLE/PREFERENZE_E_FORMATI.md`: tutte le regole di Power, con il registro datato in fondo (la regola più recente vince). Sezioni chiave: Video VX, Reel Studio, Lavoro in parallelo.
2. Questo file e `LEGGIMI.md` (mappa e comandi).
3. `06_DOCS/LAYER_VOLWICK.md`: cosa fa e come appare ogni layer del terminale. Si mostra e si dice solo quello che esiste.
4. `03_FORMATI/<formato>/MODELLO.md` del formato che stai facendo, e la scheda del video modello in `06_DOCS`.
5. `06_DOCS/HOOK_CATALOGO.md` e `01_HOOK/CATALOGO_HOOK.csv` prima di scegliere un hook.

## Mappa
| Cartella | Cosa c'è |
|---|---|
| `00_MOTORE/` | il motore unico: `engine/` (base grafica, zone sicure, logo, finale), `scenes/` (una cartella per video), `vx/` (audio, mix, hook), `tools/` (render, catalogo hook, fogli di controllo), `fonts/`, `assets/` (logo ufficiale) |
| `00_SETUP/` | installazione su un computer nuovo e verifica |
| `01_HOOK/` | `clip/` archivio dei clip hook, `CATALOGO_HOOK.csv` (stato, movimento, evento di mercato), `_schede/` fotogrammi di ogni clip |
| `02_AUDIO/` | `AUDIO_TREND.md` audio virali della settimana (si scelgono in app), `brani_con_licenza/` file mixabili |
| `03_FORMATI/` | i 5 formati, ognuno con `MODELLO.md` |
| `04_RENDER/<VIDEO>/` | ogni video finito (fuori dal repository: cartella condivisa dei render) |
| `05_PUBBLICATI/` | registro di cosa è uscito, quando e con quali numeri |
| `06_DOCS/` | schede di ogni video, studio degli hook, layer, motore, lingue |
| `07_RIFERIMENTI/` | i video esempio da cui nascono i format (solo sul Mac di Power, non nel repository) |
| `REGOLE/` | `PREFERENZE_E_FORMATI.md`, tutte le regole di Power con il registro datato |
| `FINALE_APPROVATO.png` | il finale di ogni video, sempre questo |

## Come si fa un video (flusso fisso)
1. Brief: chi è il trader, cosa gli manca, quale meccanismo d'attenzione. Tre aperture diverse, voto su chiarezza, attenzione, rilevanza, curiosità, credibilità, legame col prodotto, leggibilità, fattibilità; si produce la migliore.
2. Hook sempre al primo fotogramma. Struttura preferita: clip dell'archivio agganciato al movimento del grafico (match cut, il soggetto finisce sul punto del grafico che si muove nello stesso verso), poi grafico normale stile TradingView bianco, poi il terminale Volwick con la riga dei layer. Modello: CREATIVE 06B (`scenes/vx_drop2`).
3. Scena: copia la cartella del modello in `00_MOTORE/scenes/<nome_video>`, dati simulati con `gen_data.py` (seed fisso, tick 0,25), mai dati reali.
4. Fogli di controllo (stills) prima del render: zone sicure, logo, scritte, riga dei layer.
5. Render a 60 fps, audio, mix in due versioni (con base e MUSIC READY).
6. Controllo finale: loudness circa −14,5/−15 LUFS, picco sotto −1,5 dBTP, durata, fotogrammi chiave.
7. Consegna in `04_RENDER/<NOME_VIDEO>/` con caption (offerta solo in caption). Scheda del video in `06_DOCS/`. Se usi un hook, aggiorna `CATALOGO_HOOK.csv` (stato "usato <video>").

## Comandi (dal Terminale)
```
cd ~/Desktop/VOLWICK/13_REEL_STUDIO/00_MOTORE && source .venv/bin/activate
SCENE=scenes/vx_drop2/index.html python3 tools/render.py stills 0 2 5          # fotogrammi in stills/
SCENE=scenes/vx_drop2/index.html EVENTS_OUT=vx/out_x/ev.json python3 tools/render.py video 60 vx/out_x/silent.mp4
python3 vx/hook_overlay.py out.png "RIGA 1|RIGA 2" "PAROLE,BLU"                # scritta + logo dell'hook (env SIZE, LH, Y0, BAND_END)
python3 vx/hook_match.py clip.mp4 "t0:t1:1.0,t1:t2:0.6" overlay.png hook.mp4 srcX srcY dstX dstY 1.4
OFFSET=<durata hook> HOOK_WAV=hook.wav python3 vx/replay_sound.py ev.json sfx.wav bed.wav
VID=silent.mp4 SFX=sfx.wav BG=bed.wav|brano.mp3 [START=sec] vx/mix_replay.sh VIDEO.mp4 VIDEO_MUSIC_READY.mp4
cd .. && python3 00_MOTORE/tools/hook_index.py .                                 # cataloga i clip nuovi in 01_HOOK/clip
```
Hook + grafico: `ffmpeg -i hook.mp4 -i silent.mp4 -filter_complex "[0:v][1:v]concat=n=2:v=1:a=0" ...` (vedi `06_DOCS/CREATIVE06_THE_DROP.md`).

## Regole che non si toccano
- Zone sicure x 96–940, y 260–1550. Logo ufficiale in ogni video. Finale approvato e nient'altro.
- Riga dei layer: VOLWICK · ES · 1m / DEALER WALLS METRIC EXPIRY MAPS / ACTIVITY BLOCK PRINTS CVD CDI FLOW (niente GUIDE, MARKET INTELLIGENCE, ES LEVELS).
- Nessuna previsione, nessun P&L in punti, Block Prints mai chiamati dark pool, muri mai chiamati ordini.
- Dati simulati dichiarati a schermo. Le registrazioni reali non vanno nei video (licenza CME), tranne il formato F4 con le sue regole.
- Brani famosi mai dentro il file: si scelgono in app; dentro il file solo base originale o brani con licenza.
- Niente clip con marchi, scritte, @nomi o persone famose.
- Niente pubblicazione sui social da parte di Claude, niente password o chiavi in chat o nei file, niente acquisti.

## Aggiornamento continuo (regola fissa di Power)
Questa cartella locale è la fonte. Ogni cosa nuova si salva qui subito, senza aspettare che Power lo chieda:
- regola o correzione nuova → registro di `REGOLE/PREFERENZE_E_FORMATI.md` (e nel progetto VOLWICK su claude.ai se la sessione lo vede);
- modifica al motore → `00_MOTORE` (mai solo in una copia di lavoro);
- video finito → `04_RENDER/<NOME>/` + scheda in `06_DOCS/`;
- hook nuovo o usato → `01_HOOK/clip` + `CATALOGO_HOOK.csv`;
- audio della settimana → `02_AUDIO/AUDIO_TREND.md`.
Prima di salvare un file che altri possono aver cambiato, rileggilo e aggiungi solo la parte nuova.

## Lavorare in squadra (più computer, più Claude)
1. **Prima di iniziare:** `git pull`. Leggi `REGOLE/PREFERENZE_E_FORMATI.md` (registro in fondo).
2. **Prendi una scheda:** apri le Issues con etichetta `da-fare` (`gh issue list --label da-fare`). Prendi la più vecchia, mettile l'etichetta `in-lavorazione`, togli `da-fare` e commenta "presa da <questa sessione>". Se una scheda è già `in-lavorazione` non toccarla.
3. **Produci** nella tua cartella di scena `00_MOTORE/scenes/<nome_video>` (mai nelle scene degli altri), seguendo il flusso sopra.
4. **Consegna:** video in `04_RENDER/<NOME_VIDEO>/` della cartella condivisa dei render; nel repository solo codice della scena, `06_DOCS/<NOME_VIDEO>.md` e l'eventuale aggiornamento di `01_HOOK/CATALOGO_HOOK.csv`. Commenta la scheda con dove sono i file, etichetta `da-rivedere`.
5. **Salva subito:** `git add` dei tuoi file, commit con messaggio chiaro, `git pull --rebase`, `git push`. Piccoli commit frequenti.
6. **Motore comune (`engine/`, `scenes/vx_common/`, `vx/*.py`, `tools/`):** si cambia solo con un branch e una pull request descritta, così le altre sessioni non si rompono a metà lavoro.
7. **Regole nuove di Power:** riga datata nel registro di `REGOLE/PREFERENZE_E_FORMATI.md`, commit e push subito; se la sessione vede anche il Mac o il progetto claude.ai, la stessa riga va anche lì.
8. **Niente segreti nel repository:** nessuna chiave, password o token, mai.
