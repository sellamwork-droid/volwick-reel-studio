#!/bin/bash
# VOLWICK REEL STUDIO: installazione su un Mac nuovo (doppio clic per avviare)
cd "$(dirname "$0")/../00_MOTORE" || exit 1
echo ""; echo "=== VOLWICK REEL STUDIO · installazione ==="; echo ""
# 1. Homebrew
if ! command -v brew >/dev/null 2>&1; then
  [ -x /opt/homebrew/bin/brew ] && eval "$(/opt/homebrew/bin/brew shellenv)"
  [ -x /usr/local/bin/brew ] && eval "$(/usr/local/bin/brew shellenv)"
fi
if ! command -v brew >/dev/null 2>&1; then
  echo ">> Installo Homebrew. Ti chiederà la password del Mac (mentre scrivi non vedi nulla, è normale)."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  [ -x /opt/homebrew/bin/brew ] && eval "$(/opt/homebrew/bin/brew shellenv)" && (grep -q 'brew shellenv' ~/.zprofile 2>/dev/null || echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile)
  [ -x /usr/local/bin/brew ] && eval "$(/usr/local/bin/brew shellenv)"
fi
# 2. ffmpeg e Python
echo ">> Installo ffmpeg e Python"; brew install ffmpeg python@3.12
# 3. Claude Code
if ! command -v claude >/dev/null 2>&1 && [ ! -x "$HOME/.local/bin/claude" ]; then echo ">> Installo Claude Code"; curl -fsSL https://claude.ai/install.sh | bash; fi
grep -q '.local/bin' ~/.zshrc 2>/dev/null || echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
export PATH="$HOME/.local/bin:$PATH"
# 4. Ambiente Python del motore (si rifà su ogni computer)
echo ">> Preparo l'ambiente Python del motore"
PY="$(brew --prefix)/bin/python3.12"; [ -x "$PY" ] || PY=python3
rm -rf .venv; "$PY" -m venv .venv && source .venv/bin/activate
pip install --upgrade pip -q && pip install -r requirements.txt && python -m playwright install chromium
echo ""; echo "Finito. Ora fai doppio clic su VERIFICA.command."; echo ""; read -r -p "Premi Invio per chiudere."
