# VOLWICK REEL STUDIO · istruzioni per Claude

Questa cartella è il sistema completo per generare i reel Volwick (TikTok, Instagram Reels, Shorts). Chi apre una sessione di Claude qui, su qualsiasi computer, deve poter lavorare senza chiedere dove sono le cose. È anche un repository GitHub privato condiviso da tutti i computer e da tutte le sessioni di Claude di Power: si lavora sempre sull'ultima versione e si salva sempre qui.

## Leggi prima di toccare qualsiasi cosa
0. `00_SAPERE/00_LEGGIMI.md` e i file che indica: cos'è Volwick, come è fatto e come si usa il terminale, ogni layer, il manuale ufficiale in punti, cosa si può mostrare, marchio e tono. Senza questo non si fa un video. (Una sessione nuova, su qualsiasi account, ha qui tutto il sapere: non serve il progetto claude.ai.)
1. `REGOLE/PREFERENZE_E_FORMATI.md`: tutte le regole di Power, con il registro datato in fondo (la regola più recente vince). Sezioni chiave: Video VX, Reel Studio, Lavoro in parallelo.
2. Questo file e `LEGGIMI.md` (mappa e comandi).
3. `06_DOCS/LAYER_VOLWICK.md`: cosa fa e come appare ogni layer del terminale. Si mostra e si dice solo quello che esiste.
4. `03_FORMATI/<formato>/MODELLO.md` del formato che stai facendo, e la scheda del video modello in `06_DOCS`.
5. `06_DOCS/HOOK_CATALOGO.md` e `01_HOOK/CATALOGO_HOOK.csv` prima di scegliere un hook.

## Mappa
(`MEMORIA/video/` = storico di ogni video con stato, feedback di Power e lezioni; `00_MOTORE/tools/studio.py` = brief, memoria, controlli.)
| Cartella | Cosa c'è |
|---|---|
| `00_MOTORE/` | il motore unico: `engine/` (base grafica, zone sicure, logo, finale), `scenes/` (una cartella per video), `vx/` (audio, mix, hook), `tools/` (render, catalogo hook, fogli di controllo), `fonts/`, `assets/` (logo ufficiale) |
| `00_SAPERE/` | conoscenza di prodotto: Volwick, terminale, manuale in punti, layer, marchio, tono, PDF e immagini del terminale vero |
| `00_SETUP/` | installazione su un computer nuovo e verifica |
| `01_HOOK/` | `clip/` archivio dei clip hook, `CATALOGO_HOOK.csv` (stato, movimento, evento di mercato), `_schede/` fotogrammi di ogni clip |
| `02_AUDIO/` | `AUDIO_TREND.md` audio virali della settimana (si scelgono in app), `brani_con_licenza/` file mixabili |
| `03_FORMATI/` | i 4 tipi di video (T1 edit, T2 spiegazione voce, T3 registrazione schermo, T4 hook + grafico vs Volwick), ognuno con `MODELLO.md` |
| `04_RENDER/` | cartella di lavoro locale, fuori dal repository (i video finiti vanno su Drive in `01_VIDEO` con `studio.py consegna`) |
| `05_PUBBLICATI/` | registro di cosa è uscito, quando e con quali numeri |
| `06_DOCS/` | schede di ogni video, studio degli hook, layer, motore, lingue |
| `07_RIFERIMENTI/` | `RIFERIMENTI.csv`: i video consigliati e gli esempi dei format (video su Drive in `02_LIBRERIA/03_VIDEO_CONSIGLIATI`, fotogrammi in `00_SAPERE/esempi_format`) |
| `REGOLE/` | `PREFERENZE_E_FORMATI.md`, tutte le regole di Power con il registro datato |
| `FINALE_APPROVATO.png` | il finale di ogni video, sempre questo |

## Come si fa un video (flusso fisso)
1. Brief: chi è il trader, cosa gli manca, quale meccanismo d'attenzione. Tre aperture diverse, voto su chiarezza, attenzione, rilevanza, curiosità, credibilità, legame col prodotto, leggibilità, fattibilità; si produce la migliore.
2. Hook sempre al primo fotogramma. Struttura preferita: clip dell'archivio agganciato al movimento del grafico (match cut, il soggetto finisce sul punto del grafico che si muove nello stesso verso), poi grafico normale stile TradingView bianco, poi il terminale Volwick con la riga dei layer. Modello: CREATIVE 06B (`scenes/vx_drop2`).
3. Scena: copia la cartella del modello in `00_MOTORE/scenes/<nome_video>`, dati simulati con `gen_data.py` (seed fisso, tick 0,25), mai dati reali.
4. Fogli di controllo (stills) prima del render: zone sicure, logo, scritte, riga dei layer.
5. Render a 60 fps, audio, mix in due versioni (con base e MUSIC READY).
6. Controllo finale: loudness circa −14,5/−15 LUFS, picco sotto −1,5 dBTP, durata, fotogrammi chiave.
7. Consegna con `studio.py consegna` (vedi Consegna): su Drive arriva solo il video finito e completo, `01_VIDEO/<TIPO>/01 Titolo (data).mp4`: numero dal 1 dentro il tipo, l'argomento del video in italiano, la data di uscita (la caption con l'offerta resta nella memoria del video). Scheda del video in `06_DOCS/`. Se usi un hook, aggiorna `CATALOGO_HOOK.csv` (stato "usato <video>").

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
- Dati simulati dichiarati a schermo. Le registrazioni reali non vanno nei video (licenza CME), tranne il tipo T3 (registrazione schermo) con le sue regole.
- Brani famosi mai dentro il file: si scelgono in app; dentro il file solo base originale o brani con licenza.
- Niente clip con marchi, scritte, @nomi o persone famose.
- Niente pubblicazione sui social da parte di Claude, niente password o chiavi in chat o nei file, niente acquisti.

## Aggiornamento continuo (regola fissa di Power)
Il repository (e la sua copia su ogni computer) è la fonte. Ogni cosa nuova si salva qui subito, senza aspettare che Power lo chieda:
- regola o correzione nuova → registro di `REGOLE/PREFERENZE_E_FORMATI.md` (e nel progetto VOLWICK su claude.ai se la sessione lo vede);
- modifica al motore → `00_MOTORE` (mai solo in una copia di lavoro);
- video finito → Drive `01_VIDEO/<TIPO>/01 Titolo (data).mp4` con `studio.py consegna` + memoria in `MEMORIA/video/` + scheda in `06_DOCS/`;
- hook nuovo o usato → `01_HOOK/clip` + `CATALOGO_HOOK.csv`;
- audio della settimana → `02_AUDIO/AUDIO_TREND.md`.
Prima di salvare un file che altri possono aver cambiato, rileggilo e aggiungi solo la parte nuova.

## Lavorare in squadra (più computer, più Claude, in contemporanea)
Questo repository è il cervello comune. Ogni Claude su ogni computer lavora sulla stessa memoria: quello che impara uno, lo sanno tutti al `git pull` successivo.

### Presenza: sapere sempre chi lavora e cosa genera (regola fissa di Power, 31 ottobre)
Lavorano insieme account Claude diversi, chat diverse dello stesso account e il Terminale sui computer. Ognuno si fa vedere dagli altri:
- **Nome di sessione** alla prima presenza, sempre nella forma `<account> · <chat o computer> · <cloud o Terminale>`, per esempio `tudorswork · chat 02:31 · cloud` o `sellamwork · Mac · Terminale`. Resta salvato sul computer o nel cloud della chat.
- `python3 00_MOTORE/tools/studio.py presenza "cosa sto facendo" --video V0012 [--chi "<nome di sessione>"]` a ogni passo: inizio, scheda presa, scena, render, mix, consegna, attesa del giudizio. Scrive `MEMORIA/sessioni/<nome>.json` e fa pull, commit e push da solo (un file per sessione, niente conflitti). `nuovo` e `consegna` la aggiornano da soli.
- `studio.py chi` (e la sezione 0 del brief): chi è ATTIVO (segnale negli ultimi 45 minuti), su quale video e cosa sta facendo. Prima di prendere una scheda, guarda `chi`: un video di una sessione attiva non si tocca.
- **Memoria sempre aggiornata:** `git pull --rebase` (o `studio.py sync`) prima di ogni passo e prima di rispondere a Power su stato, coda o giudizi; `studio.py sync "messaggio"` subito dopo ogni cosa nuova (giudizio, lezione, regola, hook, scheda). Il brief fa il pull da solo.
- A fine lavoro `studio.py fine`. Una sessione senza segnale da più di 45 minuti risulta ferma: la sua scheda in lavorazione si riprende solo dopo averlo chiesto a Power.

### Inizio di ogni sessione (sempre, senza eccezioni)
1. `git pull --rebase`, poi `python3 00_MOTORE/tools/studio.py presenza "inizio sessione" --chi "<nome di sessione>"`
2. `python3 00_MOTORE/tools/studio.py brief`: regole più recenti, storico dei video con il feedback di Power, lezioni da applicare, hook freschi e già usati, ultime modifiche al motore, coda dei lavori, materiale caricato dal team (lo prende in carico da solo: poi fai commit e push).
3. Leggi `REGOLE/PREFERENZE_E_FORMATI.md` per intero (la regola più recente vince) e la scheda JSON del video modello (`MEMORIA/video/CREATIVE06B.json`).
4. Scrivi a chi ti sta usando un riassunto in italiano di poche righe: chi altro sta lavorando adesso e su cosa, video in coda, ultimi giudizi di Power, materiale nuovo arrivato, cosa proponi di fare. Poi aspetta o prendi la scheda più vecchia se ti chiede di procedere.

### Google Drive: cartella condivisa "VOLWICK REEL STUDIO"
Su ogni computer gira Google Drive per desktop con la cartella condivisa aggiunta a "Il mio Drive". Prima volta su un computer: `python3 00_MOTORE/tools/studio.py drive` (la trova da solo, crea la struttura; se non la trova, passale il percorso). Struttura, gestita solo dagli script:
- `00_CARICA_QUI/`: il team carica lì il materiale nuovo (anche dal telefono), in tre cartelle: `01_VIDEO_HOOK` (clip per gli hook), `02_MUSICA` (solo brani con licenza), `03_VIDEO_CONSIGLIATI/<categoria>` con le categorie numerate 01_EDIT (T1), 02_SPIEGAZIONE_VOCE (T2), 03_REGISTRAZIONE_SCHERMO (T3), 04_HOOK_GRAFICO_VS_VOLWICK (T4), 05_HOOK_E_APERTURE, 06_COMPETITOR, 07_ALTRO. `studio.py arrivi` (lanciato anche dal brief) porta gli hook nel repository e nel catalogo, sposta musica e video consigliati in `02_LIBRERIA` con le stesse categorie e li registra in `02_AUDIO/CATALOGO_AUDIO.csv` e `07_RIFERIMENTI/RIFERIMENTI.csv` (colonna categoria); gli originali degli hook vanno in `03_ARCHIVIO_CARICAMENTI/<data>`. Un video consigliato in `07_ALTRO` o senza categoria lo classifichi tu quando lo studi.
- `01_VIDEO/<TIPO>/01 Titolo (data).mp4`: **solo il video finito e completo**, un file per video, chiamato con il numero (dal 1 dentro il tipo), l'argomento in italiano e la data di uscita, per esempio `01 Prezzo bloccato sul call wall (31-10-2026).mp4` (l'ID V0012 resta solo nel repository); diviso nei 4 tipi (01_EDIT, 02_SPIEGAZIONE_VOCE, 03_REGISTRAZIONE_SCHERMO, 04_HOOK_GRAFICO_VS_VOLWICK; il tipo lo sceglie lo script dal campo formato T1–T4). Niente caption, schede, copertine, spezzoni o altre versioni (regola di Power, 31 ottobre 2026). Lo crea solo `studio.py consegna`.
- `INDICE_VIDEO.csv`: tutti i video con stato e ultimo giudizio, rifatto a ogni consegna.
- `04_ARCHIVIO_VIDEO/`: tutti i video generati prima del Reel Studio, ogni versione, con `INDICE_ARCHIVIO.csv`. Regola di Power: su Drive c'è **ogni video mai generato**; nessun video finito resta solo su un computer.
Nessun file a mano in Drive, nessun rinomina: l'ordine lo tiene lo script. Se `01_VIDEO` non è in ordine, sul Mac: `python3 00_MOTORE/tools/studio.py riordina` (mai da una copia montata nella VM: Drive per desktop non registra quei cambi e li annulla).

### Materiale nuovo da studiare
- **Video consigliato** (`RIFERIMENTI.csv` stato "da studiare", con la categoria): guardalo (fotogrammi ogni 0,5 s, struttura, hook, ritmo, testi, audio), scrivi la scheda in `06_DOCS/RIFERIMENTI/<nome>.md` (cosa funziona, cosa si adatta a Volwick, a quale formato), metti stato "studiato" e il nome della scheda. Quello che cambia il modo di fare i video diventa lezione o regola (vedi sotto) o un formato nuovo in `03_FORMATI`.
- **Audio** (`CATALOGO_AUDIO.csv` stato "da ascoltare"): durata, BPM, tono, formato consigliato. Si mixa dentro un video solo dopo che Power ha confermato la licenza (colonna licenza). I brani famosi non si mixano mai: si scelgono in app.
- **Hook**: il catalogo li analizza da solo; tu guardi la scheda in `01_HOOK/_schede`, compili evento di mercato, formato consigliato e stato (approvato, escluso con motivo).

### Sessione dalla chat dell'app Claude (cloud)
Una chat dell'app Claude (progetto VOLWICK) può lavorare come le sessioni del Terminale. Lavora nel cloud, quindi tre cose cambiano.
1. **Avvio:** collega il repository (`add_repo` sellamwork-droid/volwick-reel-studio, accesso push), clonalo, registra la cartella, `pip install -r 00_MOTORE/requirements.txt` se manca qualcosa, `git config user.name "Claude (Volwick Reel Studio)"` e `user.email noreply@anthropic.com`. Poi tutto come "Inizio di ogni sessione". Il render (Playwright, ffmpeg) gira nel cloud senza installazioni.
2. **Drive:** la chat arriva a Drive solo attraverso il computer collegato (strumenti remote-devices). Il materiale caricato in `00_CARICA_QUI` lo prende in carico la prossima sessione del Terminale: la chat lo segnala e basta.
3. **Consegna:** `mkdir -p /tmp/vw_drive && VW_DRIVE=/tmp/vw_drive python3 00_MOTORE/tools/studio.py consegna V0012 <cartella>` prepara in `/tmp/vw_drive` il solo video finito `01_VIDEO/<TIPO>/<NN> <Titolo> (<data>).mp4`, le versioni secondarie in `04_ARCHIVIO_VIDEO/V0012_<NOME>/` e `INDICE_VIDEO.csv`. Poi copiali in `/mnt/user-data/outputs/` e mandali al computer con `device_commit_files`:
   - se tra le cartelle collegate (get_device_info) c'è **VOLWICK REEL STUDIO** di Google Drive: con gli stessi percorsi dentro quella cartella (solo quei file, niente caption né schede);
   - altrimenti in `~/Desktop/VOLWICK/13_REEL_STUDIO/04_RENDER/_DA_CARICARE/V0012_<NOME>/`: la prossima sessione del Terminale li porta su Drive da sola (`studio.py arrivi`, lanciato dal brief);
   - nessun computer collegato o file oltre 30 MB: mandali in chat e dillo a Power.
   Poi commit e push della memoria come sempre. Nella cartella 13_REEL_STUDIO del Mac non si scrive mai a mano: si aggiorna con `git pull`.

### Prendere un lavoro
- Se chi ti usa chiede un video nuovo a parole, aprilo tu come scheda: `gh api "repos/{owner}/{repo}/issues" -f title="VIDEO · <nome>" -f body="<formato, evento, layer, hook, note>" -f "labels[]=da-fare"`. Poi lo prendi come gli altri.
- La coda sono le Issues: `gh issue list --label da-fare` (oppure `gh api "repos/{owner}/{repo}/issues?labels=da-fare"`). Prendi la più vecchia, etichetta `in-lavorazione` (togli `da-fare`), commenta "presa da <computer/sessione>". Una scheda già `in-lavorazione` non si tocca.
- L'ID del video è `V` + numero della scheda a quattro cifre (scheda #12 → `V0012`): è unico anche con dieci Claude in parallelo.
- Apri subito la sua memoria e fai il push, così gli altri vedono che è occupato:
  `python3 00_MOTORE/tools/studio.py nuovo V0012 --issue 12 --nome "..." --formato T4 --scena 00_MOTORE/scenes/v0012_<nome> --hook "<clip>.mp4" --evento "..."`
- Scegli l'hook tra i **freschi** del brief. Un hook già usato si riusa solo con un taglio diverso e se il movimento combacia meglio.

### Durante il lavoro
- Solo nella tua cartella di scena (`00_MOTORE/scenes/v0012_<nome>`, copiata dal modello). Le scene degli altri non si toccano.
- Motore comune (`engine/`, `scenes/vx_common/`, `vx/*.py`, `tools/`): solo con branch e pull request descritta (`git switch -c motore/<cosa>`), mai direttamente su main mentre altri renderizzano. Nella descrizione: cosa cambia, perché, quali scene tocca.
- Fai `git pull --rebase` anche prima del render finale: le regole possono essere cambiate mentre lavoravi.

### Consegna
1. Metti in una cartella di lavoro (es. `00_MOTORE/vx/out_v0012/consegna`) il video finito (con hook) ed eventuali versioni secondarie (MUSIC_READY, NOHOOK) e `CAPTION.txt` (caption con offerta e hashtag).
2. `python3 00_MOTORE/tools/studio.py aggiorna V0012 durata_s=21.4 titoli="RIGA 1|RIGA 2" layer="WALLS Top 5|BLOCK PRINTS"`
   poi `python3 00_MOTORE/tools/studio.py consegna V0012 00_MOTORE/vx/out_v0012/consegna --titolo "Argomento in italiano" [--video file.mp4]`: mette su Drive **solo il video finito** in `01_VIDEO/<TIPO>/<NN> <Titolo> (<data>).mp4` (numero e data li assegna lo script), le versioni secondarie in `04_ARCHIVIO_VIDEO/V0012_<NOME>/` (fuori dalla vista di Power), salva la caption nella memoria del video, aggiorna stato e indice, commenta la scheda GitHub e la mette `da-rivedere`. Mai mp4 o wav nel repository.
3. Se hai usato un hook, aggiorna `01_HOOK/CATALOGO_HOOK.csv` (stato "usato V0012").
4. `python3 00_MOTORE/tools/studio.py controlla` deve dare 0 errori (GitHub lo ripete a ogni push).
5. Commit piccoli e chiari, `git pull --rebase`, `git push`.

### Come il sistema impara (obbligatorio)
Ogni volta che Power dà un giudizio o una correzione, in chat o come commento alla scheda:
1. **Sul video:** `studio.py aggiorna V0012 feedback="Power: ..."`. Se Power chiede di rifarlo `stato=da-rifare`; se approva `stato=approvato`; quando esce `stato=pubblicato`.
2. **Lezione:** se la correzione vale anche per i video futuri, `studio.py aggiorna V0012 lezione="..."`, scritta come regola pratica che un altro Claude può applicare senza contesto.
3. **Regola:** se è un'indicazione generale di Power, aggiungi la riga datata in cima al registro di `REGOLE/PREFERENZE_E_FORMATI.md` e correggi la sezione relativa (la vecchia regola che contraddice si cancella).
4. **Motore:** se la correzione si risolve meglio nel motore (finale, riga dei layer, colori, zone sicure), pull request sul motore così vale per tutti i video successivi.
5. **Push subito** con `studio.py sync "giudizio V0012"`. Gli altri Claude la ricevono al loro prossimo `git pull`.
Un video `superato` resta nello storico: serve a non ripetere l'errore.

### Conflitti
- Le memorie dei video sono un file per video: non vanno mai in conflitto.
- Se `git pull --rebase` segnala un conflitto nel registro delle regole, tieni **entrambe** le righe, nell'ordine di data, e continua con `git rebase --continue`.
- Mai `git push --force` su main.

### Sempre
- Niente chiavi, password o token nel repository o in chat. Il repository resta privato.
- Niente pubblicazioni sui social: pubblica solo Power. Niente acquisti.
