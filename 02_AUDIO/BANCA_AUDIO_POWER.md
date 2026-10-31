# Banca audio di Power (31 ottobre 2026)

Dove: Drive `00_CARICA_QUI/02_MUSICA/Banca audio/` (sottocartelle Background, Click, effetti chiusura apertura video, Speach motivazionali, Swoosh). `studio.py arrivi` NON entra nelle sottocartelle di 02_MUSICA, quindi la banca resta lì con la struttura di Power; righe nel catalogo `02_AUDIO/CATALOGO_AUDIO.csv`.
Analizzata da `tudorswork · chat 03:37 · cloud`: durata, picco, loudness, numero di colpi (attacchi separati) e brillantezza (baricentro spettrale) di ogni file. 4 ambient su 5 non si sono caricati dal PC: sono della stessa serie di 875994.

## Regole d'uso
- **Licenze da verificare prima di mixare.** I nomi `<id>__<autore>__` vengono da Freesound: la licenza si legge su `freesound.org/s/<id>`. CC0 si usa libero; CC-BY si usa con il credito in caption; CC-BY-NC non va negli ads (sono commerciali). Finché la colonna licenza dice "da verificare", il suono non entra in un video consegnato.
- **Background e Speach motivazionali sono scaricati da YouTube (SnapYT): nessuna licenza, mai dentro un file.** Servono come riferimento di tono e ritmo per i nostri copioni e per scegliere audio simili in app. La cartella `italiano` è vuota.
- Nella cartella `Speach motivazionali/inglese` c'è un `Claude Setup.exe` finito lì per sbaglio: va tolto da Power (Claude non cancella file).
- Alcuni file sono WAV float con picco oltre 0 dBFS (872341, 277239, 447808, 555740, 59988, 875994): normalizzarli a −1 dBFS prima del mix.

## Click (scritte, sottotitoli, numeri)
| Suono | Durata | Uso consigliato |
|---|---|---|
| 467951 benzix2 ui-button-click | 0,12 s, scuro | sottotitoli parola per parola, click morbido che non stanca |
| 342200 christopherderp menu click | 0,14 s | cartellini e card che entrano (DEALERS SELL/BUY, LONG γ) |
| 478197 jonnyruss01 click_1 | 0,06 s, brillante | prezzo e numeri che cambiano |
| 566888 lennartgreen metronome | 0,01 s | tick dei contatori (RANGE · 12.50 PTS che sale), battiti a tempo negli edit |
| 797644 cpfcfan10 metallic click | 0,07 s, molto brillante | accento forte: il muro che si accende, PINNED |
| 435983 pachoba click | 0,4 s | comparsa di etichette con un po' di coda |
| 491158 phonosupf click-delay | 1,9 s, eco | logo o chiusura |
| 707041 vilkas_sound button-click | 1,0 s, livello alto | conferma, finale (abbassare) |
| 60945 erh, 506054 mellau, 513481 budek, 872341 signaturesounds | 0,3–1 s | riserva |
| 217482 abstraktgeneriert clicks | 18,9 s, 11 colpi a 0.25, 2.13, 3.78, 5.82, 7.79, 9.82, 11.64, 13.42, 14.99, 16.8, 17.83 s | pacchetto da tagliare |
| 622327 audacitier phone clicks | 17 s, 32 colpi, −49 LUFS | troppo basso: da alzare molto o scartare |

## Swoosh e whoosh (tagli, transizioni, camera 3D)
| Suono | Durata | Uso consigliato |
|---|---|---|
| 167842 speedenza whoosh-4d | 1,6 s, molto grave | taglio hook → grafico; movimenti di camera delle prove 3D (V0003 ORBITA) |
| 167843 speedenza whoosh-1a | 2,2 s, grave | ingresso del terminale, grandi rotazioni |
| 241146 speedenza whoosh-5a | 2,5 s, grave | transizioni lente, orbita |
| 60013 qubodup whoosh | 0,4 s | scritte che scorrono, tagli veloci |
| 59988 qubodup swosh | 0,3 s | tagli a tempo negli edit T1 |
| 750803 etheraudio synth whoosh | 0,8 s, morbido | card che entrano |
| 688989 infamouslazure whoosh-1 | 2 s, brillante, in salita | transizione con crescendo verso il drop |
| 558993 gerent woosh muffled | 3,2 s, scuro | rivelazione morbida, logo |
| 277239 raaghav81 head-spin | 6,5 s, 13 colpi | rotazioni e orbite veloci |
| 555740 eminyildirim wooshes | 67 s, 51 colpi | la scorta più grande, da tagliare (primi colpi a 1.3, 1.81, 6.93, 7.33, 13.75, 14.28, 19.54, 20.18, 20.45, 20.71, 24.8, 25.05, 25.8, 26.11, 31.54, 32.12, 36.91, 37.61, 3… s) |
| 582084 eminyildirim swooshes mono | 25,5 s, 31 colpi, brillanti | da tagliare |
| 447808 florianreichelt swishes | 29,6 s, 21 colpi | da tagliare |
| 588696 eminyildirim weird whoosh | 14,9 s, 21 colpi | effetti glitch, scritte che arrivano |
| 371313 mrthenoronha fishing-rod swish | 20,5 s, 11 colpi molto acuti | tagli rapidi negli edit |

## Apertura, chiusura e sottofondi
- 140512 blackstalian click_sfx6 (1,5 s, 3 battute scure): colpo sul logo all'apertura o sul finale approvato.
- 875994 bassimat ambient (2 min, −13 LUFS, scuro e calmo): base per i T2 con voce, da tenere 18–20 dB sotto la voce. Le altre quattro della serie filigrana (875778, 875899, 875953, 875995) sono dello stesso genere, da ascoltare quando si caricano.

## Prossimi passi
1. Power (o chi ha accesso al browser) verifica le licenze su Freesound e aggiorna la colonna licenza.
2. Tagliare i pacchetti in colpi singoli normalizzati (`<categoria>_<id>_<n>.wav`) da tenere accanto alla banca, così gli script audio (`vw_sound.py`, `replay_sound.py`) possono pescarli per nome.
