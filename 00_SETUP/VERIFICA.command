#!/bin/bash
# VOLWICK REEL STUDIO: verifica che il motore funzioni su questo computer
cd "$(dirname "$0")/../00_MOTORE" || exit 1
source .venv/bin/activate 2>/dev/null || { echo "Manca l'ambiente: lancia prima INSTALLA_REEL_STUDIO.command"; read -r; exit 1; }
ok=1
command -v ffmpeg >/dev/null && echo "ffmpeg ........ ok" || { echo "ffmpeg ........ MANCA"; ok=0; }
python -c "import playwright, numpy, scipy, soundfile, PIL" 2>/dev/null && echo "librerie ...... ok" || { echo "librerie ...... MANCANO"; ok=0; }
command -v claude >/dev/null && echo "Claude Code ... ok" || echo "Claude Code ... non trovato (serve solo per lavorare da Terminale)"
SCENE=scenes/vx_drop2/index.html python tools/render.py stills 9 >/dev/null 2>&1 && [ -f stills/t09.00.png ] && echo "render ........ ok (00_MOTORE/stills/t09.00.png)" || { echo "render ........ NON FUNZIONA"; ok=0; }
(cd .. && python 00_MOTORE/tools/hook_index.py . >/dev/null 2>&1) && echo "catalogo hook . ok" || { echo "catalogo hook . NON FUNZIONA"; ok=0; }
echo ""; [ $ok = 1 ] && echo "TUTTO OK: il Reel Studio è pronto." || echo "Qualcosa manca: rilancia INSTALLA_REEL_STUDIO.command."
echo ""; read -r -p "Premi Invio per chiudere."
