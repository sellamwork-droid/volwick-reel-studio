# 00_SAPERE · tutto quello che serve sapere su Volwick per fare i video

Chi arriva nuovo (un Claude su un account diverso, un computer nuovo, una persona del team) legge questi file prima di toccare un video. Sono la conoscenza di prodotto: cos'è Volwick, come è fatto il terminale, come si usa, cosa fa ogni layer, cosa si può mostrare e dire, il marchio e il tono.

Ordine di lettura:
1. `01_COS_E_VOLWICK_MASTER.md`: cos'è Volwick, per chi è, decisioni, offerta, stato.
2. `02_TERMINALE_COSA_SI_PUO_MOSTRARE.md`: la base dei contenuti. Cosa è VERIFIED (si mostra e si spiega), PARTIAL, NOT IN BUILD (non si mostra), NOT VERIFIED (non si pubblica). Prevale su tutto il resto.
3. `../06_DOCS/LAYER_VOLWICK.md`: ogni layer come appare nei video (colori, etichette, cosa non si dice).
4. `03_MANUALE_TERMINALE_PUNTI_CHIAVE.md`: il manuale ufficiale del terminale (69 pagine) in punti, layer per layer, con le frasi del manuale. Versione dati: `04_MANUALE_TERMINALE_FATTI.json`.
5. `pdf/Volwick_Terminale_completo_22ott2026_IT.pdf` (e `_EN`): il terminale com'è davvero, schermata per schermata.
6. `immagini/riga_dei_layer.png` e `immagini/terminale_layer_23ott2026.gif`: la riga dei layer e il terminale vero (riferimento visivo).
7. `05_LINGUAGGIO_VISIVO.md`, `06_STANDARD_QUALITA.md`: come devono apparire i video e il punteggio di qualità.
8. `07_LIBRERIA_HOOK_TESTUALI.md`, `08_PLAYBOOK_CONTENUTI.md`: hook scritti e metodo dei contenuti.
9. `09_MARCHIO_COLORI.md`, `10_MARCHIO_DEFINITIVO.md`: logo e colori.
10. `11_COPY_MASTER_SITO.md`: posizionamento e linguaggio del sito (come parliamo ai trader).

## Com'è il terminale: immagini e video veri
Guardali prima di disegnare qualsiasi parte Volwick in un video: colori, spessori, etichette, pill, stelle, muri e Block Prints devono sembrare questi.
- `immagini/riga_dei_layer.png`: la riga dei layer in alto (nei video senza GUIDE, MARKET INTELLIGENCE ed ES LEVELS).
- `immagini/terminale_layer_23ott2026.gif`: il terminale intero con i layer che si accendono.
- `immagini/terminale_vero/`: screenshot e fotogrammi del terminale vero su ES (27 ottobre): muri con etichette "7,751 · −$22.8M" nei quattro colori, Block Prints (barre bianche, pill oro e argento "830 ×2", rombi), livelli chiave con stella "★ 7738.50 1,098 · 3 blocks", prezzo live tratteggiato oro, volumi.
- `immagini/terminale_macro*.png`: inquadrature strette del terminale.
- `video/terminale_vero_27ott_seg017.mp4` e `seg021.mp4`: 5 minuti ciascuno del terminale vero in movimento (ridotti a 1920 px, senza audio). Per vederli in una sessione: `ffmpeg -ss 60 -i 00_SAPERE/video/terminale_vero_27ott_seg021.mp4 -frames:v 1 f.png`.

**Attenzione:** sono registrazioni del mercato reale. Servono solo come riferimento per capire com'è il terminale. **Mai** dentro un video, né i fotogrammi né i dati (licenza CME): nei video si usano solo sessioni simulate, disegnate con il motore come in questi riferimenti.

## I video esempio dei format
`esempi_format/`: 8 fotogrammi per ogni video da cui nascono i format (trendline, indicatore, micro lezione, libro, edit motion, quiz "Buy or Sell?"). Video interi su Drive in `02_LIBRERIA/03_VIDEO_CONSIGLIATI/<categoria>`; come li abbiamo trasformati in versioni Volwick: `../06_DOCS/MOTORE_VX_FORMAT.md`.

## Marchio: loghi, icone, font, suono (`marchio/`)
- `LOGO_VOLWICK_wordmark.png` e `LOGO_V_monogramma.png`: i loghi ufficiali originali. `wordmark_ritagliato_per_video.png` e `monogramma_per_video.png`: le versioni che usa il motore (identiche a `00_MOTORE/assets`). Il logo non si ricolora mai; su fondo chiaro sta dentro una pillola navy.
- `icone/` e `Volwick_icone_logo.zip`: favicon, icone app (48–1024 px), confronti e proporzioni.
- `finale_approvato_dei_video.png`: il finale di ogni video, sempre questo.
- `font/`: Archivo (titoli del sito), Instrument Sans (testo del sito), JetBrains Mono (etichette e numeri), Inter Tight (titoli dei video), con licenza SIL OFL.
- `sonic_logo/`: il suono del marchio, intro e outro.
- `BRAND_IDENTITY.md`: identità del marchio. Colori e regole anche in `09_MARCHIO_COLORI.md` e `10_MARCHIO_DEFINITIVO.md`.
- `animazione_prezzo_099.mp4`: l'animazione dell'offerta a $0,99 usata nei primi video (l'offerta oggi va solo in caption).

## Il software: sito, terminale, documenti (`software/`)
- Sito: **volwick.com** (landing in inglese e italiano). Terminale: **volwick.com/dashboard** (serve un account: Claude non accede mai al posto di Power).
- `screenshot/`: hero del prodotto, mercati, layout telefono IT/EN, effetti, riga dei layer, check grafici.
- `banner/`: grafiche e mockup dei banner (PC e telefono).
- `mockup_terminale_html/`: i mockup HTML del terminale (barra, mappe, muri, Tide, CVD, multichart, redesign): si aprono nel browser o si renderizzano con Playwright per vedere i componenti.
- `documenti/DOSSIER_SOFTWARE.md`: il software descritto per intero. `VOLWICK_Knowledge_Base.md`: base di conoscenza del prodotto. `COMPETITOR_ANALYSIS.md`: concorrenti. `Volwick_traduzioni_IT_EN.json`: tutti i testi del sito e del terminale in IT ed EN (per usare esattamente i nomi dei comandi).

Regole che vincono su tutto, in quest'ordine: `../REGOLE/PREFERENZE_E_FORMATI.md` (le decisioni di Power, la più recente vince), poi `02_TERMINALE_COSA_SI_PUO_MOSTRARE.md`, poi il resto.
Nei video: solo funzioni presenti nella build, mai previsioni di direzione ("came out at a coin flip"), mai dati reali, Block Prints mai chiamati dark pool, un muro rosso è un supporto difeso e non un segnale ribassista.
