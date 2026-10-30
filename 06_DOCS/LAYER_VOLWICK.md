# Volwick · i layer del terminale per il motore statico (30 ottobre 2026)

Fonti, in ordine di peso: CE_06 Knowledge Base (test dal vivo fino al 22 ottobre e registrazione del 23), risposte di Matt (13 e 16 ottobre), Volwick Terminal Manual (69 pagine), screenshot reale ES del 27 ottobre (REF_LMR_ES_seg025).

Regola d'oro: si mostra e si dice solo quello che esiste nella build. Ogni grafica è una lettura del posizionamento, mai una previsione. Il manuale stesso dice che la direzione dai dealer "came out at a coin flip".

## Come appare il terminale (riferimento visivo reale)
- Fondo nero puro, griglia verticale finissima, candele verdi e rosse sottili, volume in basso.
- Muri come linee orizzontali luminose che sfumano verso sinistra, con pallino ed etichetta a destra: "7,766.25 · +$23.8M".
- Block Prints: barre bianche orizzontali sulle candele, pill bianche "550 ×2", pill oro "830 ×2" con rombo, livello chiave con stella "★ 7754.25 1,091 · 4 blocks".
- Tipografia mono piccola e precisa. Niente decorazioni: la forza viene dai dati.

## 1. Dealer Walls
- **Cosa fa.** Mostra i prezzi dove i dealer di opzioni hanno più esposizione gamma, con il valore in dollari per punto. Gamma lunga = freno (vendono sui rialzi, comprano sui ribassi). Gamma corta = benzina (inseguono il movimento).
- **Come appare.** Quattro famiglie a colori fissi: verde call long γ (resistenza che smorza), rosso put long γ (supporto che smorza), ciano call short γ (accelera), magenta put short γ (accelera). Il muro più grande ha la stella. WALLS Top 3, 5, 10, 15. METRIC GEX, CEX, DEX, ALL. EXPIRY 0DTE, settimana, mese, All.
- **Colpo visivo.** Il prezzo che sbatte contro una linea verde incandescente, oppure un muro magenta che si spezza e il prezzo che cade. Muro = barriera fisica, enorme, luminosa, con il valore in dollari gigante.
- **Non si dice.** Che un muro garantisce un rimbalzo. Che un muro rosso è ribassista: è un supporto difeso. Nessun confronto in dollari fra strumenti di fasce diverse.
- **Dove.** SPX e VIX hanno il book dei dealer; ES, MES e VX il book proiettato; NQ, QQQ, SPY, RTY, GOLD e BTC hanno livelli stimati dall'open interest. I visual con muri si ambientano su SPX, ES o MES.

## 2. Block Prints (nel manuale Liquidity Tide, nella comunicazione "Dark Pool")
- **Cosa fa.** Segna dove passano scambi di grandi dimensioni e dove si accumulano sullo stesso prezzo, con il lato aggressore preso dall'exchange. Memoria di circa 10 giorni (PRICE LEVELS Today o All).
- **Come appare.** Barre bianche sulle candele; rombi e pill oro con la quantità (507, 858, "830 ×2"); livelli oro con stelle ("★★ 7672.50 1,013 · 2 blocks").
- **Colpo visivo.** Un numero enorme ("2,000") inchiodato su un prezzo; il prezzo che torna su quel livello giorni dopo; tante barre bianche impilate come colpi di martello.
- **Non si dice.** Chi ha fatto lo scambio (istituzioni identificate, hedge fund). "Fuori borsa": su futures è tape dell'exchange. Le soglie in voce.

## 3. CVD
- **Cosa fa.** Acquisti aggressivi meno vendite aggressive, cumulato. Serve per la divergenza: il prezzo sale e il CVD no.
- **Come appare.** Pannello sotto il prezzo con una linea.
- **Colpo visivo.** Due linee che si separano a forbice: il prezzo che fa un massimo nuovo, il CVD che crolla.
- **Non si dice.** Che una divergenza garantisce l'inversione. Non c'è su SPX e VIX.

## 4. CDI
- **Cosa fa.** Premio speso oggi su opzioni con scadenza in giornata (single leg), call contro put, minuto per minuto. Su SPX, ES e MES legge il book SPXW; su SPY legge SPY; su QQQ è spento.
- **Come appare.** Barre verdi sopra lo zero e rosse sotto, picchi col valore ($7.2M), intestazione "C $1.8M · P $3.0M · Single-leg".
- **Colpo visivo.** Una barra gigantesca da $7.2M in un minuto fra barre minuscole: la "tuonata".
- **Non si dice.** Niente oltre questo sul calcolo (stato PARTIAL).

## 5. Options Flow
- **Cosa fa.** Premio comprato all'ask contro venduto al bid, cumulato dalle 09:30, con le linee C, P e NET. Solo single leg same day, su SPX, ES, MES e SPY.
- **Colpo visivo.** La linea rossa che sale presentata come rialzista: è vendita di put. Il ribaltamento della lettura ingenua.

## 6. Exposure Maps (una alla volta)
- **Cosa fa.** Mappe a colonne da 5 minuti dietro le candele: Gamma, Charm, Vega, Volga, Delta. Il gradino bianco segna dove il segno cambia (γ flip).
  - Gamma: zone che smorzano o amplificano.
  - Charm: coperture che cambiano solo per il passare del tempo, a prezzo fermo.
  - Vega e Volga: reazione agli shock di volatilità.
  - Delta: dove i dealer comprano o vendono il sottostante ("blue = they BUY").
- **Come appare.** Colonne blu e ambra, legenda "MAP · GAMMA ≤−117.3 … ≥+117.3 M$ per point".
- **Colpo visivo.** Il grafico tagliato in due: sopra blu calmo, sotto ambra infuocato, con il prezzo che attraversa il confine.
- **Non si dice.** Vanna, mappa Regime: non esistono.

## 7. Market Intelligence
- **Cosa fa.** Lettura del book dei dealer: Dealer positioning (es. "Neutral", intensità LOW), Key strikes (muro sopra, spot, muro sotto, con la distanza), Break scenarios (Above, Between walls, Below), Invalidation, Gamma by strike.
- **Colpo visivo.** Una scheda pulita e autorevole accanto al caos del grafico: il trader con la lettura in mano.
- **Non si mostra.** VERDICT, punteggi da −10 a +10, ENTER NOW, TRIM HALF, THE PLAN. Non è un segnale.

## Strumenti e dati
11 strumenti nella build: SPX, ES, MES, NQ, VIX, VX, RTY, SPY, QQQ, GOLD, BTC. Timeframe 1m e 5m. Orari ET. Nelle grafiche: dati simulati coerenti, dichiarati.

## Lessico
- **Si dice:** Dealer Walls, Block Prints, CVD, CDI, Options Flow, Exposure Maps, Market Intelligence; posizionamento dei dealer; scambi di grandi dimensioni; controvalore.
- **Non si dice:** segnale, previsione, entra long; dark pool sui futures; ordini istituzionali identificati; Level 3; nomi dei fornitori di dati; Replay, bot, layout, alert, Vanna.

## Brand
- Slogan: TRADE WITH INSTITUTIONAL CONTEXT. (SEE WHAT OTHERS CAN'T resta la firma di posizionamento).
- Offerta di lancio: $0.99 il primo mese, poi $89 al mese, fino al 27 novembre 2026.
- Palette: navy #040913, blu #2F6BFF, azzurro #8AB6FF, oro #F2C14E, verde #26C08A, rosso #F0506E, ciano #22D3EE, magenta #E055D8, arancio mappa #F59228.
- Pubblico al 99% da telefono: tutto leggibile a misura di schermo del telefono.
