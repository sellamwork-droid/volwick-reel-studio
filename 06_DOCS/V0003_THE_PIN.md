# V0003 · THE PIN (T2, 31 ottobre 2026)

Tipo T2 (spiegazione con voce parlata HeyGen), prova del sistema. Stampo Assorbimento V2: un solo pannello prezzo, voce che spiega il meccanismo passo per passo, sottotitoli parola per parola, a schermo solo etichette tecniche che entrano quando la voce le nomina, finale approvato.
Scena `00_MOTORE/scenes/v0003_voce` (scene.js nuovo sullo stampo di `absorption_v2`), tempi in `words.json` e `cues.json` presi dai timestamp di HeyGen, voce piazzata da `assemble_voice.py`, suono `tools/vw_sound.py`, mix `mix_voice_hq.sh`.

## Meccanismo
ES fermo in 2,5 punti su un call wall long γ (+$21.6M). I dealer long gamma si coprono contro il movimento: vendono i rialzi e comprano i ribassi, e questo può tenere il prezzo vicino al muro. Quando il prezzo si allontana, il range può riaprirsi (12,5 punti nella sessione simulata). Nessuna previsione, nessun P&L.

## Voce
HeyGen, voce Matthew (4bf1363e93f1474ba653df3b4add19ed), engine elevenlabs, modello eleven_multilingual_v2, una ripresa per il corpo (26,8 s) e una per la chiusura a velocità 0,92 (3,8 s). Copione in `COPIONE.txt` della consegna. Il corpo parte a 0,25 s; la chiusura parte sul wordmark (logo0 + 1,03 s).
Nota tecnica: il cloud e la shell del Mac non scaricano da resource2.heygen.ai (proxy 403). I file si scaricano sul Mac vero con uno script .command aperto dal Finder (o da Power) in `04_RENDER/_voce_<id>`.

## Sequenza (s)
| s | Voce | Schermo |
|---|---|---|
| 0 | Price is stuck. It's not an accident. | PRICE IS STUCK. / IT'S NOT AN ACCIDENT., range già visibile |
| 2.8 | For the last hour... | riavvolge e rigioca la sessione, RANGE · 2.50 PTS su "less" |
| 8.0 | ...gets sold. ...gets bought. | triangoli rossi sui massimi, verdi sui minimi |
| 11.2 | Right here sits a call wall. | linea verde del muro, CALL WALL · 7,744.50 |
| 13.1 | Dealers are long gamma on it. | LONG γ · +$21.6M |
| 17.4 | They sell into rallies, and buy into dips. | DEALERS SELL ↓ / DEALERS BUY ↑ |
| 21.5 | That hedging can pin price near the wall. | il muro si accende, PINNED · 2.50 PTS in oro |
| 23.4 | When price moves away... | il prezzo scende, RANGE · 12.50 PTS |
| 27.0 | Trade with institutional context. Discover Volwick. | finale approvato |
