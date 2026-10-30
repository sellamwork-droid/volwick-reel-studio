# Volwick Content Engine · installazione con API key

Questa guida serve per far girare la produzione video su un Mac usando i crediti API di Anthropic invece di un abbonamento Claude Max.

## 1. Programmi da installare (una volta sola)

Apri il Terminale e incolla questi comandi uno alla volta.

```bash
# Homebrew (se non c'è già)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Claude Code
curl -fsSL https://claude.ai/install.sh | bash

# ffmpeg (montaggio video) e Python 3
brew install ffmpeg python

# Librerie Python del motore
cd ~/Desktop/VOLWICK/10_CONTENT_ENGINE/volwick_engine_v3
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m playwright install chromium
```

Controllo finale: `claude --version`, `ffmpeg -version` e `python -c "import playwright, numpy, scipy, soundfile, PIL; print('ok')"` devono rispondere senza errori.

## 2. Chiavi (le imposti tu, mai in chat)

Crea la chiave su console.anthropic.com (sezione API Keys) e quella HeyGen dalle impostazioni del tuo account HeyGen. Poi aprile nel file del terminale:

```bash
open -e ~/.zshrc
```

e aggiungi in fondo due righe con le tue chiavi al posto dei puntini:

```bash
export ANTHROPIC_API_KEY="..."
export HEYGEN_API_KEY="..."
```

Salva, chiudi e riapri il Terminale. La prima volta che lanci `claude` ti chiederà se usare la chiave trovata: rispondi sì.

## 3. Avvio

```bash
cd ~/Desktop/VOLWICK/10_CONTENT_ENGINE/volwick_engine_v3
source .venv/bin/activate
claude
```

Ogni Claude lavora sul suo video in una sua cartella dentro `scenes/` (per esempio `scenes/p03_.../`), così nessuno tocca il lavoro degli altri. Per lanciarne più di uno basta aprire più finestre del Terminale e ripetere l'avvio.

## 4. Render di prova

```bash
SCENE=scenes/p02_brake_or_fuel/index.html python tools/render.py video 60 prova.mp4
```

## 5. Costi

Con la API si paga a consumo: ogni token letto o scritto scala dai crediti. Il consumo si controlla in tempo reale su console.anthropic.com nella sezione Usage. Conviene impostare un limite di spesa mensile nella Console prima di partire.
