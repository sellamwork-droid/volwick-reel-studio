# VOLWICK: base di conoscenza per la nuova landing

Aggiornata al 25 settembre 2026. Fonti: il mockup (artifact GvAxzKArd5KenTaRs1R5jZ), il codice del terminale (sightline.v814.js, circa 1,5 MB, letto per intero), la guida interna "How to read", i siti di 13 concorrenti. I dettagli completi sono nei due allegati: DOSSIER_SOFTWARE.md e COMPETITOR_ANALYSIS.md.

---

## 1. Il mockup attuale: cosa contiene

Tema scuro, un solo colore d'accento blu (#3D6FF5). Font: Archivio per i titoli, Instrument Sans per il testo, JetBrains Mono per le etichette. Il pezzo centrale è un terminale finto ma interattivo. Il copy è in italiano, tono sobrio da "market intelligence".

Il file contiene molte versioni di home e pagine sovrapposte. Il percorso più completo della home è in 11 blocchi:

1. **Hero:** "Non guardare solo il mercato. Accedi alle informazioni che lo muovono." Accanto, il terminale animato con il ticker di tutti i layer.
2. **Beyond price:** "Il prezzo è l'output. Non l'intera informazione." Uno storytelling a scroll che aggiunge un livello alla volta sul grafico.
3. **Dark Pool:** "DARK POOL. LIVE IN VOLWICK." Feed di stampe con ora, prezzo, size e nozionale (dati simulati, stampa da $1,05B a 7.733), poi "Dal print al livello" e "Dark Pool ≠ Order Flow".
4. **Liquidity Tide:** "La size diventa visibile."
5. **Dealer Walls:** "Il positioning diventa struttura." Tabella degli strike con livello, GEX, segno e scadenza.
6. **CVD · CDI · Flow:** "Il prezzo si muove. Il flow mostra con quale pressione."
7. **Gamma · Charm · Vanna · Regime:** heatmap a schede.
8. **Market Intelligence:** Market Read, Key Level, Market Plan, Regime.
9. **One terminal:** "Fonti separate. Una sola vista."
10. **Replay**
11. **Prezzo $89/mese:** "Nessun piano superiore. Nessuna funzione da sbloccare."

Poi: FAQ, pagina Mercati (10 schede strumento, matrice di disponibilità), "Come funziona" in 5 step, e tutto il funnel (signup, verifica, checkout Stripe, onboarding, login, recupero password, account, abbonamento, annullamento, referral, assistenza, testi legali in bozza, 404, casi limite).

**Da togliere per tua indicazione:** Layout (1-5 grafici, Pro Layout, layout salvati), Replay, Bot. Nel mockup compaiono in hero, blocco 10, prezzo, FAQ, "Built for the session", preferenze account e onboarding.

**Punti forti da tenere:** il terminale finto interattivo, lo storytelling a strati, l'onestà ("La decisione resta a chi opera", "Dato osservato, dato derivato e stima restano distinti"), il piano unico.

**Punti deboli:** troppe versioni ripetute (3 blocchi prezzo quasi uguali, 3 sezioni "one terminal"), poca spiegazione tecnica del perché i dati valgono, nessuna prova (numeri reali, testimonianze, prova gratuita), e il Dark Pool presentato come live con dati simulati.

**Brand:** i nuovi loghi (wordmark VOLWICK e monogramma V con rombo) sono acciaio cromato con alone blu su navy profondo. Sono più "premium e luminosi" dell'attuale blu piatto del mockup. La nuova landing dovrebbe spostarsi verso navy #050B18, gradienti argento-ghiaccio e glow blu elettrico.

---

## 2. Il software reale: cosa fa davvero

**Fonti dati**
- OptionsDepth: posizioni nette reali dei market maker, dato CBOE marcato per partecipante.
- Databento: futures CME al tick, con lato aggressore.
- tastytrade / DXLink: SPX, VX, flussi 0DTE SPXW e SPY.
- Polygon: equity e sweep.
- Massive: open interest degli ETF.
- Unusual Whales: solo per il CDI. L'altro canale UW è spento da giugno.
- Tutte le greche sono ricalcolate in casa (motore "NET_POSITION").

**Dealer Walls**
- Metriche GEX, CEX, DEX, più ALL.
- Book SPX aggiornato ogni 5 minuti. Poll ogni 60 s dalle 9:00 alle 16:00 ET.
- Proiettati su ES/MES con la base ES−SPX calcolata live e mostrata a schermo.
- Top 3/5/10/15/25/40, classificati per |esposizione| × vicinanza al prezzo.
- Quattro colori: call/put × gamma long/short. Filtri 0DTE / settimana / mese.
- Banner STALE se il book è vecchio.
- Su SPY, QQQ, NQ, RTY, GOLD e BTC i livelli sono stimati dall'open interest dell'ETF e dichiarati come tali.

**Heatmap**
- Gamma, Charm, Vega, Volga, Delta, più la proiezione congelata delle 9:20.
- Prezzo × tempo a colonne da 5 minuti, con le linee di flip del segno.

**Liquidity Tide**
- Nastro futures a colonne da 1 secondo, calibrato per strumento.
- Barre bianche = raffica di size reale (ES circa 870+ lotti, oltre il 99° percentile).
- Tacche ambra = assorbimento iceberg silenzioso.
- All'hover una lettura in inglese semplice di chi sta vincendo.

**Flow**
- Marker di block e sweep (ES ≥100 contratti, mega ≥300).
- Zone "Levels" dove si sono concentrati i grandi scambi, oggi o negli ultimi 10 giorni.

**CVD, CDI, Options Flow**
- CVD: aggressione futures cumulativa.
- CDI: delta 0DTE SPXW e SPY in dollari, single-leg / multi-leg.
- Options Flow: premio 0DTE comprato all'ask meno venduto al bid, call / put / netto.

**Reads the chart (Market Intelligence)**
- Verdetto con convinzione LOW, MED o HIGH.
- Magnete e pin da charm.
- THE PLAN: setup PIN, RANGE, TEST, TREND, DRIFT con livello, stop e pivot.
- Probabilità di tocco dei muri.
- Regime range / trend / misto.
- "Now Look Here": i 3 magneti e le 2 zone di pericolo.
- Aggiornamento ogni 2 secondi, solo su SPX, ES, MES, VIX e VX.

**Mercati:** SPX, ES, MES, NQ, VIX, VX, RTY, SPY, QQQ, GOLD, più BTC nel codice (assente nel mockup).

### ⚠️ Tre cose che il codice contraddice

1. **Nel software non c'è nessun dato Dark Pool.** Nessuna occorrenza di ATS, TRF, FINRA o off-exchange. Le "stampe grandi" sono trade futures on-exchange filtrati per size. Il Dark Pool deve essere in sviluppo: va confermato con Matt prima di scriverne.
2. **Il layer Vanna mostra sempre "—"** perché il client non scarica più il VEX. Il mockup lo vende come feature piena.
3. **Il blocco "WHY" del pannello è vuoto** in questa build.

**Frasi d'onestà già nel prodotto, oro per il copy:**
- "Top 5–10 is the honest read; beyond that is mostly noise."
- "Dealer positioning is not a reliable direction predictor — we've tested that."
- Congelamento dei livelli della mattina perché "verifiable, they don't move".

---

## 3. Concorrenti in sintesi

**Il claim "unico software al mondo con le Dark Pool" non regge.** Hanno già dark pool:
- Unusual Whales, da $50
- Quant Data, $75
- Cheddar Flow, BlackBoxStocks, FlowAlgo
- Trade Echo DealerEdge, $199: dark pool, GEX e order flow futures sulla stessa piattaforma
- Skylit Atlas, $699: linee dark pool, GEX/VEX e CVD sullo stesso grafico, anche su ES

Un claim di unicità falso è anche un rischio legale (pubblicità ingannevole, AGCM in Italia, FTC negli USA).

**Cosa invece è difendibile**, specificando "tra i principali tool, settembre 2026":

1. Muri dei dealer da **posizioni reali dei market maker** (non stimati dall'open interest), proiettati sul grafico ES/MES **insieme al nastro futures al secondo**. Trade Echo e Skylit calcolano la gamma dall'open interest; chi ha le posizioni reali (OptionsDepth, Unusual Whales Periscope) non ha il nastro futures.
2. **Charm, Vega e Volga come mappe** sul grafico: la Volga non la cita nessuno.
3. **Lettura automatica intraday** che si aggiorna da sola. Trade Echo fa l'AI solo a fine giornata, Skylit solo su domanda.
4. **Prezzo:** a $89 quello che altrove costa $199-699.

**DeepCharts** (il concorrente n.1 che hai indicato):
- Headline "Scopri le tracce degli Smart Money", "Grafici a raggi X".
- Numeri in hero: +80 indicatori, +5 studi, 0,015 s di refresh.
- Moduli con nome proprietario "Deep…".
- Piani $59 / $79 / $100: DeepGamma solo nel Pro. Dati CBOE market maker su SPX a 1 minuto, backtest 9 mesi. Solo Windows, prova di 14 giorni, sessioni live con trader noti.
- Niente dark pool, niente charm/vanna/volga, nessuna lettura automatica.
- È una piattaforma di orderflow a cui è stata aggiunta la gamma. Volwick è il contrario: nasce dal positioning e ci aggiunge il nastro.

**Pattern comuni delle landing del settore:**
- "Accesso istituzionale / smart money" (abusato)
- Loghi dei media e contatori utenti
- Moduli con nomi propri
- Community e sessioni live
- Prova gratuita o primo mese scontato
- Tabelle "sostituisci $X di tool"
- Tema scuro

**Spazi liberi per Volwick:**
- "Dati veri, non stime" spiegato semplice
- Focus totale su S&P e VIX, con MES per i trader delle prop firm
- Il browser come vantaggio: niente installazione, a differenza di DeepCharts che gira solo su Windows
- Freschezza del dato dichiarata con timestamp
- Onestà sui limiti come leva di fiducia

Mancano due cose da creare: una prova o garanzia, e testimonianze vere.

---

## 4. Decisioni da prendere prima di scrivere il copy

1. **Dark Pool:** qual è lo stato reale e la data di uscita? Da quale fonte (FINRA TRF su SPY/QQQ? proiettato su ES)? Senza feature live non si può scrivere "live".
2. **Vanna:** si ripristina prima del lancio o si toglie dal copy?
3. **Headline di posizionamento:** "unico" va spostato dal Dark Pool alla combinazione difendibile (posizioni reali dei market maker + nastro futures + lettura automatica, a $89).
4. **Offerta d'ingresso:** prova, primo mese o garanzia?
5. **Licenza OptionsDepth:** si può citare il nome della fonte nel marketing?
6. **Lingua e mercato:** il mercato primario sono gli USA, ma il mockup è in italiano. Serve la versione EN come principale?
