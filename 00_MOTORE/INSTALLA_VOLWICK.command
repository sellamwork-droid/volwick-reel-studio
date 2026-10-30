#!/bin/bash
# Volwick Content Engine: installazione completa (doppio clic per avviare)
cd "$(dirname "$0")"
echo ""; echo "=== VOLWICK · installazione motore video ==="; echo ""

# 1. Homebrew
if ! command -v brew >/dev/null 2>&1; then
  [ -x /opt/homebrew/bin/brew ] && eval "$(/opt/homebrew/bin/brew shellenv)"
  [ -x /usr/local/bin/brew ] && eval "$(/usr/local/bin/brew shellenv)"
fi
if ! command -v brew >/dev/null 2>&1; then
  echo ">> Installo Homebrew. Ti chiederà la password del Mac (mentre scrivi non vedi nulla, è normale)."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  if [ -x /opt/homebrew/bin/brew ]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
    grep -q 'brew shellenv' ~/.zprofile 2>/dev/null || echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
  fi
  [ -x /usr/local/bin/brew ] && eval "$(/usr/local/bin/brew shellenv)"
fi

# 2. ffmpeg e Python
echo ">> Installo ffmpeg e Python"
brew install ffmpeg python@3.12

# 3. Claude Code
if ! command -v claude >/dev/null 2>&1 && [ ! -x "$HOME/.local/bin/claude" ]; then
  echo ">> Installo Claude Code"
  curl -fsSL https://claude.ai/install.sh | bash
fi
grep -q '.local/bin' ~/.zshrc 2>/dev/null || echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
export PATH="$HOME/.local/bin:$PATH"

# 4. Librerie del motore
echo ">> Preparo l'ambiente Python del motore"
PY="$(brew --prefix)/bin/python3.12"; [ -x "$PY" ] || PY=python3
"$PY" -m venv .venv
source .venv/bin/activate
pip install --upgrade pip -q
pip install -r requirements.txt
python -m playwright install chromium

# 5. Chiavi (restano solo su questo Mac)
echo ""
if ! grep -q 'ANTHROPIC_API_KEY' ~/.zshrc 2>/dev/null; then
  read -r -s -p "Incolla la API key di Anthropic e premi Invio (Invio vuoto per saltare): " AK; echo ""
  [ -n "$AK" ] && echo "export ANTHROPIC_API_KEY=\"$AK\"" >> ~/.zshrc && echo "   salvata."
fi
if ! grep -q 'HEYGEN_API_KEY' ~/.zshrc 2>/dev/null; then
  read -r -s -p "Incolla la API key di HeyGen e premi Invio (Invio vuoto per saltare): " HK; echo ""
  [ -n "$HK" ] && echo "export HEYGEN_API_KEY=\"$HK\"" >> ~/.zshrc && echo "   salvata."
fi

# 6. Verifica
echo ""; echo "=== VERIFICA ==="
command -v ffmpeg >/dev/null && echo "ffmpeg ........ ok" || echo "ffmpeg ........ MANCA"
claude --version >/dev/null 2>&1 && echo "Claude Code ... ok ($(claude --version))" || echo "Claude Code ... MANCA"
python -c "import playwright, numpy, scipy, soundfile, PIL" 2>/dev/null && echo "librerie ...... ok" || echo "librerie ...... MANCANO"
echo ""
echo "Finito. Per partire: apri un nuovo Terminale e scrivi"
echo "   cd ~/Desktop/VOLWICK/10_CONTENT_ENGINE/volwick_engine_v3 && source .venv/bin/activate && claude"
echo ""; read -r -p "Premi Invio per chiudere."
