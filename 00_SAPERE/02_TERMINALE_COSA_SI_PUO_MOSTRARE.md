# VOLWICK · Content Engine · Knowledge base dei contenuti

Versione 1, 23 ottobre 2026. Regola di Power: nei contenuti si mostrano e si descrivono solo le funzioni presenti nella build attuale. Niente funzioni rimosse, dati non disponibili o metodi non verificati.

Fonti, in ordine di peso:
1. test dal vivo in 02_TERMINALE (ultimo del 22 ottobre) e registrazione del terminale del 23 ottobre;
2. risposte di Matt del 13 e del 16 ottobre;
3. Volwick Terminal Manual (69 pagine).

Stati di verifica:
* **VERIFIED**: si può spiegare.
* **PARTIAL**: si può mostrare, ma il metodo non si descrive oltre quanto scritto.
* **NOT IN BUILD**: non si mostra e non si nomina.
* **NOT VERIFIED**: non si pubblica.

## A. Cosa si può mostrare e spiegare

### Strumenti (VERIFIED)
11 strumenti: SPX, ES, MES, NQ, VIX, VX, RTY, SPY, QQQ, GOLD, BTC. Timeframe 1m e 5m. Orari in ET.

| Fascia | Strumenti | Origine dei muri, come la dichiara il terminale |
|---|---|---|
| Book dei dealer | SPX, VIX | book dell'indice |
| Book proiettato | ES, MES (via SPX), VX (via VIX) | book dell'indice portato sul future con la base |
| Stima da open interest | NQ (QQQ), QQQ, SPY, RTY (IWM), GOLD (GLD), BTC (IBIT) | "estimated from open interest · not a dealer book" |

Regola per i video: i contenuti con muri, mappe e Market Intelligence si ambientano su SPX, ES o MES. Le grandezze in dollari cambiano molto tra fasce, quindi non si mettono a confronto strumenti di fasce diverse senza dirlo.

### Dealer Walls (VERIFIED)
* Linee orizzontali con valore in dollari ("7,712.25 · −$8.9M"). Il muro più grande ha la stella.
* WALLS: Off, Top 3, 5, 10, 15. La selezione avviene per esposizione × vicinanza allo spot.
* METRIC: GEX, CEX (charm), DEX, ALL. Reale su SPX, VIX, ES, MES, VX.
* EXPIRY: 0DTE, settimana, mese, All, con il numero di strike.
* Quattro famiglie con colori fissi:

| Famiglia | Colore | Comportamento |
|---|---|---|
| call long γ | verde | resistenza che smorza |
| put long γ | rosso | supporto che smorza |
| call short γ | ciano | accelera |
| put short γ | magenta | accelera |

* Tooltip reale: "SPX 7,625 → ES 7,662.75 · Put wall · short γ · Accelerative, breakdowns below can run fast · Net −$22M", con la nota "dealer P&L exposure per 1-point SPX move".
* Concetto spiegabile: gamma lunga fa da freno, gamma corta fa da benzina. Un muro rosso è un supporto difeso, non un segnale ribassista.
* L'ora del book sta sul comando WALLS: grigio se è della sessione in corso, ambra se è vecchio, rosso se manca.

### Block Prints (VERIFIED)
È il layer chiamato Liquidity Tide nel manuale e "Dark Pool" nella comunicazione commerciale. Nei video si chiama Block Prints. Dark Pool si usa al massimo come nome commerciale, mai come "fuori borsa".

* Barre bianche orizzontali sulle candele dove passa la size.
* Rombi oro con la quantità, per esempio 507, 858, 644.
* Livelli di prezzo oro con stelle e quantità ("★★ 7672.50 1,013 · 2 blocks").
* Pannello: PRINTS con Minimum size in contratti; etichette Tidy, Classic, Diamonds; PRICE LEVELS Off, Today, All con il proprio Minimum size.
* Memoria di circa 10 giorni su ogni mercato. Lato aggressore preso dall'exchange.
* Soglie di partenza: ES 100, MES 60, NQ 20, RTY 50, VX 25, GOLD 10, SPY e QQQ 5.000 azioni. Le soglie si spiegano come "soglia per strumento", senza leggere i numeri in voce.
* Si dice: scambi di grandi dimensioni e dove si accumulano sullo stesso prezzo. Non si dice: chi li ha fatti, istituzioni identificate, hedge fund.

### CVD (VERIFIED)
* Acquisti aggressivi meno vendite aggressive, cumulato, con una regola unica calcolata sul server. Storico dal 13 ottobre.
* Presente su SPY, QQQ, ES, MES, NQ, VX, RTY, GOLD. Non su SPX e VIX.
* Concetti spiegabili: divergenza, conferma, pressione. Limite da dire sempre: una divergenza non garantisce un'inversione e il prezzo può continuare.

### CDI (PARTIAL)
* Si può dire: premio speso su opzioni con scadenza in giornata, solo single leg, call contro put, minuto per minuto. Su SPX, ES e MES legge il book SPXW, su SPY legge SPY. Su QQQ è spento.
* Si vede: barre verdi sopra lo zero e rosse sotto, picchi con il valore ($7.2M), intestazione "C $1.8M · P $3.0M · Single-leg".
* Non si descrive altro del calcolo finché Matt non lo documenta.

### Options Flow (VERIFIED)
* Premio comprato all'ask contro venduto al bid, cumulato dalle 09:30, con linee C, P e NET. Solo single leg same day.
* Su SPX, ES, MES, SPY.
* Concetto spiegabile: rosso che sale è vendita di put, quindi rialzista.

### Exposure Maps (VERIFIED)
* MAPS, una alla volta: Gamma, Charm, Vega, Volga, Delta.
* Colonne da 5 minuti dietro le candele, ambra e blu, con un gradino bianco dove il colore cambia segno.
* Legenda reale: "MAP · GAMMA ≤−117.3 … ≥+117.3 M$ per point". Su Delta: "dealer hedge vs spot (blue = they BUY)".
* Charm si spiega come l'effetto del tempo sulle coperture a prezzo fermo.

### Market Intelligence (VERIFIED)
Cassetto a destra con:
* **Dealer positioning**: stato tipo "Neutral" con intensità LOW e frase di lettura.
* **Key strikes**: wall above, spot, wall below, con la distanza in punti.
* **Break scenarios**: Above, Between walls, Below.
* **Invalidation**: "This read stops holding on a close outside the two walls."
* **Gamma by strike**.

È una lettura del book dei dealer, non un segnale. Non si mostrano VERDICT, ENTER NOW, TRIM HALF né punteggi da −10 a +10.

### Onestà del prodotto (VERIFIED, ottimo per i contenuti)
Ora del book dichiarata, "estimated from open interest" scritto sul livello, base dichiarata nel tooltip. Il manuale stesso scrive che il posizionamento dei dealer non prevede la direzione.

## B. Cosa non si mostra e non si nomina (NOT IN BUILD)
* Vanna, sia come mappa sia come layer.
* Mappa Regime come superficie.
* Replay, time machine, split screen, layout preconfigurati, RECOMMENDED, PRO LAYOUT, alert di livello, bot, trade marker.
* Timeframe oltre 5m. Top 25 e Top 40.
* THE PLAN, VERDICT con punteggio, verbi operativi.
* I nomi Market Read, Key Level, Market Plan.
* Dark Pool fuori borsa su SPY e QQQ: non esiste ancora nel feed.

## C. Cosa non si pubblica (NOT VERIFIED)
* Frequenze esatte di aggiornamento di book, muri e mappe.
* Come viene ricalcolata la base su ES, MES e VX.
* La regola dello stato di Dealer positioning e della riga Invalidation.
* Il calcolo completo del CDI.
* I nomi dei fornitori di dati (CME, OPRA, CBOE, OptionsDepth...): manca una frase pubblica approvata.
* Il raggio di ricerca dei muri (4% sul sito, 5% nella guida).

## D. Lessico
| Si dice | Non si dice |
|---|---|
| controvalore | nozionale |
| scambi di grandi dimensioni, block print | dark pool sui futures, ordini istituzionali identificati |
| dati con lato aggressore dell'exchange | Level 3, identifica gli HFT |
| posizionamento dei dealer, lettura | segnale, previsione, entra long |
| Dealer Walls, Exposure Maps, Block Prints, CVD, CDI, Options Flow, Market Intelligence | sinonimi o nomi vecchi dei layer |

## E. Dati per i video
* Fino a nuovo ordine solo dati simulati, coerenti (OHLC, CVD derivato dai delta), con l'etichetta ILLUSTRATIVE DATA o SIMULATED.
* MARKET DECODED parte solo con dati storici verificati: mercato, data e ora a schermo, casi in cui il livello non ha tenuto compresi.
