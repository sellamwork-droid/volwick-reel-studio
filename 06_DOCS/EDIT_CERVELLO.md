# Cervello di edit · come si fa ogni edit nuovo (T1)

Regola di Power (31 ottobre 2026, 17:31–17:34): ogni edit nuovo resta nello stile 3D approvato con V0010 (spazio stellato, 3D vero, 4K, logo e finale approvato), ma **comunica in un modo diverso dal precedente**: altre inquadrature, altre interazioni, altre cinematiche. Musica sempre spinta, ritmo alto, montaggio professionale.

## Come si sceglie un edit
1. **Brano.** Niente testi espliciti (parolacce, sesso): se non si può controllare il testo, si usa un brano strumentale. Dai brani di Power (`02_MUSICA/Banca audio/edit`, su Drive) si cerca uno spezzone di 18–20 s con energia alta e costante, meglio se dentro c'è uno stacco (pausa) seguito dal drop: lo stacco diventa il respiro del logo, il drop il primo grande taglio. Strumento: `scenes/v0012_edit3d_b` usa lo scan con librosa (energia, attacchi, loudness per finestre da 18 s, poi la griglia dei battiti). Ogni passaggio cade su un battito.
2. **Mosse.** Si prendono 4–6 mosse dalla tabella qui sotto, e **almeno metà non usate nell'edit precedente**. Si segna nella tabella dove sono state usate.
3. **Solo il terminale vero (Power, 31 ottobre 18:38).** Dopo l'apertura tutto quello che si vede è il terminale com'è davvero, disegnato identico: riga dei layer, candele, muri con le etichette Net, Block Prints con badge e livello con stella, CVD, mappa, tooltip. Il 3D sta nella camera, nella profondità, nei tagli e nelle transizioni. Niente oggetti inventati (colonne 3D, tubi, pile di diamanti, onde): sembrano finti. V0012 prima versione è stata bocciata per questo.
4. **Pulizia.** Una scritta alla volta, solo quelle che servono. La parte con il prezzo ha al massimo due livelli e un numero.
5. **Suono.** Il brano più gli effetti nostri a tempo (`sound.py` della scena: whoosh sui tagli, colpi sui drop, clic e tintinnii sui conteggi). Volume −14,5 LUFS, picco sotto −1,5 dBTP.
6. **Consegna.** 4K 2160×3840 a 60 fps (`index.html?k4=1` + `render4k.py`), HEVC a 12 Mbit/s per stare sotto i 30 MB.

## Mosse (inquadrature, interazioni, cinematiche)
| ID | Mossa | Cosa mostra | Usata in |
|---|---|---|---|
| M01 | Parole impilate in 3D: ogni parola è una carta con un layer vivo dietro, una per battito | una frase corta e vera ("SEE / WHERE / DEALERS / HEDGE.") | V0012 |
| M02 | Terminale vero in 3D, una inquadratura per battito (camera che salta su un dettaglio diverso: muri, etichette, mappa, badge, CVD), un layer si accende a ogni taglio | i layer del terminale uno per uno | V0012 |
| M03 | Volo radente sul grafico vero, la luce del mondo segue il mercato (magenta alla rottura, oro sui Block Prints, verde alla girata), tooltip vero del muro | rottura di un put wall short γ e appoggio sui Block Prints | V0012 |
| M04 | Orbita sull'etichetta vera del livello Block Prints che si aggiorna a ogni battito (740 → 1,360 → 2,000 · 3 blocks) mentre i badge oro compaiono | i contratti che si accumulano su un prezzo | V0012 |
| ✗ | Bocciati (sembrano finti): colonne 3D, tubi di luce, pile di diamanti, onde astratte | | V0012 v1, V0010 v1 |
| M05 | Sciame di particelle oro e blu che forma la V nel finale | finale approvato | V0012 |
| M06 | Penna di luce che disegna il contorno della V | apertura | V0010 |
| M07 | La V diventa una linea che disegna per il lungo la riga dei layer | apertura | V0010 |
| M08 | Terminale a tutta pagina che si forma; il nome del layer vola nel suo tasto | attivazione dei layer | V0010 |
| M09 | Giostra 3D delle carte dei layer con titolo tecnico che si ribalta | panoramica dei layer | V0010 |
| M10 | Candele 3D tra due muri, P&L che sale a destra | il prezzo da un muro all'altro | V0010 |
| M11 | Linea del prezzo che si alza in 3D e si piega nella V | finale approvato | V0010 |
| M12 | Stacco nel silenzio del brano: buio, il wordmark respira, poi il drop | respiro prima del drop | V0012 |
| M13 | Zoom di movimento attraverso i tagli e spinta leggera su ogni battito | ritmo | V0010, V0012 |
| — | Da provare: bianco e nero con un solo layer a colore; lampi di parole singole 0,5 s; prima/dopo (grafico normale contro terminale); loop perfetto (ultimo fotogramma = primo); macro con fuoco che scorre sulle etichette dei muri; vista esplosa del terminale a strati | | |

Spunti da cui vengono le mosse: `06_DOCS/RIFERIMENTI/SPUNTI_MONTAGGIO_POWER.md` (25 video di Power) e `06_DOCS/RIFERIMENTI/EDIT_3D_SNAPGRAM_vumgpryxic1y.md`.

## Brani usati
| Video | Brano (Banca audio/edit) | Spezzone | Note |
|---|---|---|---|
| V0010 | brano del video di riferimento | 0–12,45 s + due ripetizioni di 4 battute | ~86 BPM |
| V0012 v1 | Tyga - LAST KING MIX | 37:17.06 → +19,5 s | scartato: rischio testi espliciti non controllabili |
| V0012 v2 | 90s Hip-Hop (1997) B.I.G. Inspired – Cadillac on Flatbush (strumentale) | 1:05:13.56 → +20 s | 89 BPM; lo stacco prima del drop è un filtro passa basso sul brano (3,0–4,0 s) |

I brani sono di artisti noti: per la pubblicazione Power decide se tenerli nel file o sceglierli in app (regola del 30 ottobre: i brani famosi si scelgono in app).
