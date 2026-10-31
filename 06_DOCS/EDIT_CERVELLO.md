# Cervello di edit · come si fa ogni edit nuovo (T1)

Regola di Power (31 ottobre 2026, 17:31–17:34): ogni edit nuovo resta nello stile 3D approvato con V0010 (spazio stellato, 3D vero, 4K, logo e finale approvato), ma **comunica in un modo diverso dal precedente**: altre inquadrature, altre interazioni, altre cinematiche. Musica sempre spinta, ritmo alto, montaggio professionale.

## Come si sceglie un edit
1. **Brano.** Dai brani di Power (`02_MUSICA/Banca audio/edit`, su Drive) si cerca uno spezzone di 18–20 s con energia alta e costante, meglio se dentro c'è uno stacco (pausa) seguito dal drop: lo stacco diventa il respiro del logo, il drop il primo grande taglio. Strumento: `scenes/v0012_edit3d_b` usa lo scan con librosa (energia, attacchi, loudness per finestre da 18 s, poi la griglia dei battiti). Ogni passaggio cade su un battito.
2. **Mosse.** Si prendono 4–6 mosse dalla tabella qui sotto, e **almeno metà non usate nell'edit precedente**. Si segna nella tabella dove sono state usate.
3. **Storia di prodotto.** Ogni mossa mostra una cosa vera del terminale (un layer, un muro, un Block Print, un numero del terminale), con la sua logica. Niente slogan vuoti, niente transizioni astratte scollegate.
4. **Pulizia.** Una scritta alla volta, solo quelle che servono. La parte con il prezzo ha al massimo due livelli e un numero.
5. **Suono.** Il brano più gli effetti nostri a tempo (`sound.py` della scena: whoosh sui tagli, colpi sui drop, clic e tintinnii sui conteggi). Volume −14,5 LUFS, picco sotto −1,5 dBTP.
6. **Consegna.** 4K 2160×3840 a 60 fps (`index.html?k4=1` + `render4k.py`), HEVC a 12 Mbit/s per stare sotto i 30 MB.

## Mosse (inquadrature, interazioni, cinematiche)
| ID | Mossa | Cosa mostra | Usata in |
|---|---|---|---|
| M01 | Parole impilate in 3D: ogni parola è una carta con un layer vivo dietro, una per battito | una frase corta e vera ("SEE / WHERE / DEALERS / HEDGE.") | V0012 |
| M02 | Riga dei layer fissa in alto e sotto un'inquadratura 3D diversa per battito, il tasto si accende | i layer uno per uno: WALLS, MAPS, BLOCK PRINTS, CVD, CDI, FLOW | V0012 |
| M03 | Il colore del mondo segue il mercato (blu → magenta alla rottura → oro sui Block Prints → verde alla girata) | rottura di un put wall short γ e appoggio sui Block Prints | V0012 |
| M04 | Contatore che sale a scatti sui battiti, con una pila 3D che cresce | i contratti di un livello di Block Prints (0 → 2,000) | V0012 |
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
| V0012 | Tyga - LAST KING MIX | 37:17.06 → +19,5 s | 99,5 BPM, stacco 3,0–4,2 s, drop a 4,20 s |

I brani sono di artisti noti: per la pubblicazione Power decide se tenerli nel file o sceglierli in app (regola del 30 ottobre: i brani famosi si scelgono in app).
