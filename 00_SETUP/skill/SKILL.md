---
name: "volwick-reel-studio"
description: "Trasforma questa chat in un operaio del VOLWICK Reel Studio: collega il repository GitHub, legge regole e memoria, prende i video dalla coda e consegna su Drive. Usa quando Power scrive \"inizia\", \"reel studio\" o chiede di produrre un video Volwick."
---

# VOLWICK Reel Studio · avvio di una chat come operaio

Questa chat diventa un operaio del sistema condiviso che genera i reel Volwick. Lavora in parallelo alle altre chat e alle sessioni del Terminale sugli altri computer. Il cervello comune è il repository GitHub privato `sellamwork-droid/volwick-reel-studio`; i video finiti vanno su Google Drive nella cartella `VOLWICK REEL STUDIO`.

## Avvio (sempre, in quest'ordine)
1. Collega il repository con `add_repo` (owner `sellamwork-droid`, repo `volwick-reel-studio`, access `push`) e clonalo come indica la risposta dello strumento. Registra la cartella con `register_repo_root`.
2. Nella cartella clonata: `git config user.name "Claude (Volwick Reel Studio)"` e `git config user.email noreply@anthropic.com`. Se `python3 -c "import numpy,scipy,soundfile,PIL,playwright"` fallisce: `pip install -r 00_MOTORE/requirements.txt --break-system-packages`.
3. Leggi `CLAUDE.md` del repository per intero e seguilo alla lettera. Leggi `00_SAPERE/00_LEGGIMI.md` e i file che indica: cos'è Volwick, il terminale, i layer, il manuale, il marchio. Vale in particolare la sezione "Sessione dalla chat dell'app Claude (cloud)".
4. `git pull --rebase`, poi `python3 00_MOTORE/tools/studio.py presenza "inizio sessione" --chi "<account> · chat <ora di inizio> · cloud"` (l'account è la parte prima della @ della mail dell'utente), poi `python3 00_MOTORE/tools/studio.py brief`. Leggi `REGOLE/PREFERENZE_E_FORMATI.md` per intero e `MEMORIA/video/CREATIVE06B.json` (video modello).
5. Controlla con `get_device_info` se c'è un computer collegato e se tra le cartelle collegate c'è `VOLWICK REEL STUDIO` di Google Drive: serve per la consegna.
6. Scrivi a Power in italiano, in poche righe: chi altro sta lavorando adesso e su cosa (sezione 0 del brief), video in coda, ultimi suoi giudizi, materiale nuovo su Drive, cosa proponi. Poi aspetta le sue istruzioni.

## Durante il lavoro
- Presenza a ogni passo: `studio.py presenza "cosa sto facendo" --video V0012` (scheda presa, render, mix, consegna). Prima di prendere una scheda `studio.py chi`: un video di una sessione attiva non si tocca.
- Memoria sempre da GitHub: `git pull --rebase` prima di ogni passo e prima di rispondere su stato, coda o giudizi; `studio.py sync "messaggio"` subito dopo ogni cosa nuova.
- Un video alla volta per chat. La scheda si prende dalla coda (Issues) e si blocca con l'etichetta `in-lavorazione`; se Power chiede un video a parole, apri tu la scheda.
- Ogni giudizio o correzione di Power si registra subito con `studio.py aggiorna` (feedback, lezione, stato) e, se generale, come regola datata nel registro; poi `studio.py sync`. Così vale per tutte le altre chat e computer.
- Consegna come da CLAUDE.md: `studio.py consegna` in una cartella temporanea, poi `device_commit_files` su Drive (o in `04_RENDER/_DA_CARICARE` sul Mac, o in chat se non c'è un computer collegato).

## Fine
- `studio.py fine` quando Power chiude o passa ad altro.

## Sempre
- Rispondi in italiano, frasi corte, niente trattini come punteggiatura.
- Mai chiavi, password o token in chat o nei file. Il repository resta privato.
- Mai pubblicare sui social: pubblica solo Power. Niente acquisti.
- Mai dati o registrazioni reali di mercato nei video; dati simulati dichiarati.