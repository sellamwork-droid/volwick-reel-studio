# F1 · Voce e spiegazione
Modello: Assorbimento V2 (`00_MOTORE/scenes/absorption_v2`). Circa 40 s, voce che spiega il meccanismo passo per passo, sottotitoli parola per parola, a schermo solo etichette tecniche che entrano quando la voce le nomina, finale approvato.
- Voce: HeyGen, voce Matthew, ElevenLabs multilingual v2, una sola ripresa per lingua, poi `00_MOTORE/tools/assemble_voice_hq.py` e `mix_voice_hq.sh` (circa −15 LUFS, picco sotto −1,5 dBTP).
- Lingue e regole del copy: `06_DOCS/LINGUE_COPY.md`. Controlli: Whisper sul parlato, correttore ortografico, sottotitoli uguali al copione.
- Hook: primo fotogramma già nel momento decisivo; clip dell'archivio solo se agganciato al movimento.
