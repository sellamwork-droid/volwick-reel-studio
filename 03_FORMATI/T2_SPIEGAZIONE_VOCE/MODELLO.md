# T2 · Spiegazione con voce parlata (HeyGen)
Modello: Assorbimento V2 (`00_MOTORE/scenes/absorption_v2`). Circa 40 s, voce che spiega il meccanismo passo per passo, sottotitoli parola per parola, a schermo solo etichette tecniche che entrano quando la voce le nomina, finale approvato.
- Voce: HeyGen, voce Matthew, ElevenLabs multilingual v2, una sola ripresa per lingua, poi `00_MOTORE/tools/assemble_voice_hq.py` e `mix_voice_hq.sh` (circa −15 LUFS, picco sotto −1,5 dBTP).
- Lingue e regole del copy: `06_DOCS/LINGUE_COPY.md`. Controlli: Whisper sul parlato, correttore ortografico, sottotitoli uguali al copione.
- Hook: primo fotogramma già nel momento decisivo; clip dell'archivio solo se agganciato al movimento.
- Da dove arriva la voce: in una chat dell'app Claude dal connettore **HeyGen** dell'account (`create_speech`, voce Matthew); sul Mac dalle chiavi HeyGen/ElevenLabs salvate nel computer (`00_MOTORE/INSTALLA_VOLWICK.command` le chiede a Power). Le chiavi non stanno mai nel repository né in chat. Senza connettore né chiavi il tipo T2 non si fa: si dice a Power e si passa a T1 o T4, che non hanno voce.
- Dopo un errore o un timeout di HeyGen si chiede a Power prima di riprovare (costa crediti).
