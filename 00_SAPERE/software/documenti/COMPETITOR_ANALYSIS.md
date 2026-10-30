# VOLWICK — Analisi competitor

Data rilevazione: 24-25 settembre 2026. Fonte: scraping delle homepage e delle pagine prezzi/feature (Firecrawl). Tutti i prezzi sono quelli pubblicati sui siti in quella data e possono cambiare. DeepCharts è escluso perché già coperto altrove.

Nota di metodo: lo scraping restituisce il testo, non la grafica. Lo "stile visivo" è ricavato da `theme-color`, dai nomi delle immagini (es. `-dark.webp`), da `og:image` e dal tono del copy. Quando è una deduzione lo dico esplicitamente.

Riferimento Volwick: terminale browser per SPX/ES/MES/VIX. Muri di posizionamento dealer (GEX/CEX/DEX) calcolati sulle posizioni nette reali dei market maker (dati OptionsDepth), greche ricalcolate ogni 5 minuti. Heatmap di gamma, charm, vega e volga. "Liquidity Tide" (nastro di pressione sul tape futures al secondo, con rilevamento dei large print e dell'assorbimento). CVD, 0DTE CDI, flusso dei premi opzioni. Pannello automatico "Reads the chart" (verdetto, piano, livelli chiave, regime). Piano unico a 89 $/mese. Dark pool pianificato.

---

## 1. SpotGamma — spotgamma.com

Fonti: https://spotgamma.com , https://spotgamma.com/subscribe-to-spotgamma/

- **Posizionamento / hero.** H2 hero: *"Where options flow the markets go"*. Sottotitoli: *"For stocks, futures, and options traders"*, *"Know when and why options flows are in control"*, *"See what the professionals see"*. Nella pagina non c'è un H1 vero e proprio; il messaggio forte è l'H2.
- **Sezioni della landing, in ordine.** Hero con CTA → "Trusted By Top Institutions" (loghi media) → 5 tile prodotto (Daily Options Flow Analysis, Unique Levels on US Indices, Key Levels on 3,500+ Stocks, Real-Time Charts & Indicators, Directional Guidance) → testimonianze → lead magnet "Opening Setup™" (newsletter gratuita per una settimana) → blog e media (tastylive) → "So, Why Options Flows?" (metafora del castello di sabbia) → "Positional Analysis is the Secret to Your Trading Edge" (tabella Senza/Con) → webinar "Hedge Fund Secrets" → griglia dei tool (Founder's Note, Equity Hub, Options Calculator, Compass, TRACE, HIRO, Volatility Dashboard, Tape) → CTA → FAQ.
- **Feature chiave.** Founder's Note (nota AM/PM), key levels sugli indici, Equity Hub (3.500+ titoli, "Synthetic OI Lens"), HIRO (impatto delle coperture in tempo reale), TRACE (heatmap S&P 500 con modelli Gamma, Delta Pressure e **Charm Pressure**), Tape (flow opzioni), Compass (scanner), Volatility Dashboard.
- **Fonti dati dichiarate.** "Proprietary Options Inventory Model" che *"ingests all options traded across the US exchanges"*. Posizionamento modellato, non dichiarato come posizioni reali dei MM.
- **Dark pool:** no. **GEX/dealer:** sì. **Charm:** sì (TRACE Charm Pressure). **Vanna:** non in evidenza. **Order flow futures:** no; solo livelli esportati su piattaforme futures (NinjaTrader, Bookmap CloudNotes, Sierra, TradingView…). **0DTE:** sì, con una pagina dedicata. **AI/lettura automatica:** no, c'è la lettura umana del fondatore (Founder's Note) e la "Directional Guidance".
- **Prezzi.** La pagina è incoerente e mostra due griglie. Griglia A: Standard 89 $/mese (primo mese 17 $), Pro 129 $ (primo mese 25 $), Alpha 299 $ (primo mese 49 $, poi 249 $). Annuale: 67 / 97 / 224 $ al mese. Griglia B: Essential 99 $/mese (74 $ annuale), Alpha 299 $, Institutional da 1.999 $/mese. L'Alpha è l'unico piano con TRACE/HIRO completi.
- **Prova sociale.** Loghi Bloomberg, WSJ, Reuters, MarketWatch. Testimonianze con risultati ("paid for an upgrade", "Service is worth 10x the cost!"). Settimana gratuita della newsletter senza carta di credito. Primo mese a 17 $.
- **CTA.** "Get Started Now", "Start Your Free Week", "Get Started Today", "🛒 Sign Up".
- **Stile.** Copy da infomarketing (webinar "Hedge Fund Secrets", emoji 🤷‍♂️/😎, ClickFunnels/OptimizePress, popup con un placeholder dimenticato *"[enter lead magnet name here]"* e un e-book "Fancy Cooking for Busy People" rimasto nella pagina). Tema non verificabile dal testo.
- **Da copiare.** Il frame *"See what the professionals see"*. La tabella "Senza / Con analisi posizionale". Il primo mese a prezzo simbolico (17 $). Il lead magnet giornaliero via email.
- **Punti deboli da attaccare.** Pagina prezzi contraddittoria (89 o 99 $? "First month $17, then $89" scritto sotto un piano Institutional da 1.999 $). Artefatti di template nella pagina. Il valore dipende molto da una persona (il fondatore). Niente order flow futures sul grafico. Il tool real-time (HIRO/TRACE) costa 299 $.

## 2. MenthorQ — menthorq.com

Fonti: https://menthorq.com , https://menthorq.com/pricing/

- **H1:** *"Institutional Quant Data. For Active Traders."* **Sottotitolo:** *"MenthorQ brings the same quantitative models used by hedge funds and market makers directly into your trading workflow. Options and Futures analytics, Gamma Levels, GEX and Volatility Models: all in one platform."*
- **Sezioni in ordine.** Hero + CTA → contatori (64+ modelli quant, 1k+ asset, 7k+ trader attivi, 500h+ di Academy) → loghi media → *"The only platform with native Futures Options Gamma Levels"* → carosello di 25 modelli → "QUIN AI — Your quant analyst. Always on." → esempi di prompt → copertura degli asset → 10 integrazioni → recensioni Trustpilot → CTA finale.
- **Feature chiave.** Gamma levels su futures calcolati nativamente dalle catene di opzioni su futures (ES, NQ, RTY, CL, GC…): Call Resistance, Put Support, HVL. Net GEX, Net DEX, 0DTE Levels, Option Matrix, modelli CTA e Vol-Control, VRP, skew, superficie 3D, Q-Score, Blind Spot levels, crypto, forex.
- **Dati.** "Direct Futures Options chains… Not derived, not mapped from equity options." I livelli sono basati su OI e modelli.
- **Dark pool:** no (compare solo in una guida educativa). **GEX/dealer:** sì. **Charm/vanna:** non in evidenza in homepage. **Order flow futures:** no nativo; i livelli vanno dentro ATAS, Bookmap, Quantower, Sierra, NinjaTrader. **0DTE:** sì. **AI:** QUIN, uno screener in linguaggio naturale ("not a chatbot… cognitive infrastructure"). Non fa una lettura automatica del grafico.
- **Prezzi.** Premium 129 $/mese (primo mese 39 $ con il codice FIRST39). Pro 349 $/mese (primo mese 174,50 $), che aggiunge mentorship e 9 sessioni live a settimana. **Garanzia di rimborso di 7 giorni.** Esiste anche un piano annuale.
- **Prova sociale.** Contatori, loghi (Bloomberg, Benzinga, TradingView, Business Insider, NinjaTrader, MarketWatch, Investing.com), recensioni Trustpilot lunghe, garanzia, "Start Free – No Credit Card".
- **CTA.** "Start Free – No Credit Card", "See Pricing", "Claim Offer".
- **Stile.** Scuro, dedotto dai loghi `-WH` (bianchi) e da un og:image con "black background, glowing teal". Tono quant e istituzionale ("No opinions, no narrative — pure data, math").
- **Da copiare.** Il claim *"The only platform with native…"* è specifico e verificabile. I contatori in hero. La formula "Not derived, not mapped". Il coupon del primo mese dichiarato sulla pagina.
- **Punti deboli.** Nessun order flow e nessun tape: serve una seconda piattaforma. Dispersione (25 modelli, crypto e forex): poco focalizzato su SPX/ES. Il prezzo reale è 129 $. La parte AI è uno screener, non una lettura.

## 3. Unusual Whales — unusualwhales.com

Fonti: https://unusualwhales.com (con la griglia prezzi inclusa), https://unusualwhales.com/information/periscope-faq

- **H1:** *"Uncover trades that move markets"*. **Sottotitolo:** *"Access real-time options flow, GEX, AI-powered trading insights and join a community of 100,000 traders"*.
- **Sezioni in ordine.** Banner API → hero → carosello (Congressional Trading, Follow the Flow, Market Maker Exposure) → tweet di utenti → "Introducing Mr. Whale" (AI) → contatori (11K+ ticker, 1B+ data point, real-time) → dashboard → preset di flusso → API/MCP ("Analyze Like a Quant. Ship Like a Vibe Coder") → community → feature (alert, Discord bot, app mobile) → selettore prodotto e prezzi → Enterprise ("Replace your old terminal") → "Featured everywhere".
- **Feature chiave.** Flow opzioni full tape (OPRA), **Periscope** SPX Market Maker Exposure, heatmap GEX su tutti i ticker, Market/Net Tide, dashboard delle greche, dark pool, trade dei politici, prediction market, Mr. Whale AI, API/MCP.
- **Dati.** "Full OPRA tape". Periscope *"reveals actual Market Maker net positioning and net greek exposure in SPX"*; su Retail Max il marketing dice *"Direct from CBOE"* (https://unusualwhales.com/information/periscope-faq). **Attenzione: è la stessa categoria di dato "posizioni reali dei MM" che usa Volwick.**
- **Dark pool:** sì (flow, download giornalieri, nei meta title). **GEX/dealer:** sì. **Charm/vanna:** nel dashboard greche (non dettagliato in landing). **Order flow futures:** no per il retail (l'Enterprise cita "futures" nel tape). **0DTE:** implicito (SPX). **AI:** Mr. Whale, chat più brief giornaliero via email. Non è una lettura del grafico sempre attiva.
- **Prezzi.** Free (dati con 2 giorni di ritardo). Retail Basic 50 $/mese (42 $ annuale; Periscope aggiornato ogni 10 minuti). Retail Pro 75 $ (63 $). Retail Max 120 $ (102 $; **Periscope ogni minuto**). Poi piani API, Everything, Enterprise.
- **Prova sociale.** "100,000 traders", tweet con P&L, contatori, "Featured everywhere", free tier.
- **CTA.** "Pricing", "Generate API Key", "Try Mr. Whale", "Unlock full access", "Get Started".
- **Stile.** Scuro (`theme-color #0c0e13`). Tono retail e community, con umorismo da meme.
- **Da copiare.** Il free tier con ritardo ("See the whole platform delayed 2 trading days"). La differenziazione per frequenza di aggiornamento (10 minuti contro 1 minuto). L'angolo API/MCP per chi sviluppa.
- **Punti deboli.** È una dashboard a tabelle e non un terminale di esecuzione. Nessun order flow ES/MES. Periscope è un grafico separato, non sovrapposto al prezzo dei futures. Il prodotto è enorme e dispersivo (politici, prediction market). Una recensione di BlackBox lo definisce *"much too complex"*.

## 4. Quant Data — quantdata.us

Fonte: https://quantdata.us (i prezzi sono nella homepage)

- **H1:** *"Smarter Options Trading Starts Here"*. **Sottotitolo:** *"Quant Data provides officially licensed real‑time and historical market data directly from the exchanges, allowing you to analyze, test, and trade with confidence."*
- **Sezioni in ordine.** Hero + CTA di prova → loghi media → FEATURES (Options Order Flow, Options Exposure, Options Heat Map) → INSIGHTS (carosello di 10 tool, tra cui Dark Flow) → TESTIMONIALS (da Discord, con link) → COMMUNITY (15.000+ membri Discord, livestream quotidiani) → PRICING → sviluppatori/API (MCP) → CTA finale.
- **Feature chiave.** Flow opzioni consolidato e non consolidato. Esposizione dealer Delta/Gamma/**Vanna/Charm**. Heatmap con 30+ metriche (GEX, DEX, VEX, CHEX). Interval Map (come l'esposizione cambia durante la giornata). Net Drift, Net Flow, Volatility Drift, **Dark Flow**, livelli e print dark pool.
- **Dati.** "Officially licensed… directly from the exchanges". Il posizionamento dei dealer è modellato.
- **Dark pool:** sì (tool "Dark Flow" e "Dark pool levels, prints, and notable flow" in un pannello dedicato). **GEX/dealer:** sì. **Charm/vanna:** sì. **Order flow futures:** no. **0DTE:** non in evidenza. **AI:** no, a parte il supporto MCP per usare i dati con agenti esterni.
- **Prezzi.** Piano unico: 74,99 $/mese oppure 62,50 $/mese con pagamento annuale. Prova gratuita di 7 giorni. Piano Professional separato.
- **Prova sociale.** Loghi (Bloomberg, CNBC, CNN, Forbes, Nasdaq, WSJ). Testimonianze Discord verificabili tramite link ("Just finished my best month ever, +$16k"). 15k membri.
- **CTA.** "Start 7‑Day Free Trial", "Get Started", "Get 7 days free".
- **Stile.** Scuro, navy (`#04173d`). Tono pulito e da SaaS.
- **Da copiare.** "Simple, transparent pricing… No hidden fees" con un piano unico (è lo stesso modello di Volwick). Le testimonianze con link al messaggio Discord originale. La sezione per sviluppatori/MCP.
- **Punti deboli.** È il concorrente di prezzo più vicino (62-75 $) con dark pool, GEX e charm/vanna, **ma non ha futures né tape**: è una dashboard a pannelli, non un grafico ES con i muri sovrapposti. Nessuna lettura automatica.

## 5. Skylit (Heatseeker) — skylit.ai

Fonti: https://skylit.ai (prezzi inclusi), https://www.skylit.ai/modules/atlas

- **H1:** *"Your trading desk, with an AI analyst built in."* **Sottotitolo:** *"Dealer positioning at every strike and expiration, options flow as it prints, charting and paper trading on one desk, with Talon, an AI analyst that reads the same live data beside you."*
- **Sezioni in ordine.** Hero + 4 bullet (ms real-time, oltre 1 anno di replay, team Trader Success, dati NASDAQ/CBOE/OPRA) → screenshot dei moduli → "The agentic trading platform for…" → "What you get" → moduli (Heatseeker, Flowseeker, Atlas, Nexus, Talon) → Live Stages (stanze audio/video) → Academy → Aegis → Wall of Success (4,9/5 su oltre 554 recensioni Whop) → "Priced as a professional tool" → Pricing → confronto piani → FAQ.
- **Feature chiave.** Heatseeker (GEX/VEX per strike e scadenza, "King Node"). Flowseeker. **Atlas: grafico con orb GEX/VEX, pannello Flow, linee dark pool, Volume/CVD/Candle Delta/Footprint, Volume Profile/TPO, ES1/NQ1 con livelli "Derived" da SPX/NDX, Projection, Replay.** Talon (agente AI). Nexus (paper trading). In roadmap: Aethos (DOM futures, order flow, Level 3 via Rithmic, "Coming in Q4").
- **Dati.** "Data licensed via NASDAQ, CBOE & OPRA". Il posizionamento dei dealer è *"derived by Skylit from that data"*, quindi modellato e non derivato da dati tag per partecipante.
- **Dark pool:** sì, come linee sul grafico Atlas ("Dark Pool draws the largest recent print levels as lines"). **GEX/dealer:** sì. **Vanna:** sì (VEX). **Charm:** non citato. **Order flow futures:** in parte sì: Atlas su ES1 ha CVD, delta per candela e footprint; il DOM e l'esecuzione arrivano nel Q4. **0DTE:** sì (Expirations "Front"). **AI:** Talon, on demand, *"never calls direction"*.
- **Prezzi.** Community 99,99 $/mese (Discord + bot con mappe aggiornate ogni 15 s). Initiate 299 $ (Heatseeker solo su indici SPXW/SPY/QQQ/IWM/DIA/VIX). **Pro 699 $** (Atlas, Talon, 3.500+ ticker). Nessuna prova ("No trial on any plan"); l'unica cosa gratuita sono 30 minuti al giorno di audio dei Live Stages.
- **Prova sociale.** Oltre 554 recensioni Whop (4,9/5), un "Wall of Success", un fondatore carismatico ("Glitch"), un vocabolario proprietario (King node, gatekeeper, RUG). Disclaimer onesti ("Individual results vary").
- **CTA.** "See plans and pricing", "Explore the modules", "Go Pro", "Join Community", "Get Initiate".
- **Stile.** Doppio tema chiaro/scuro (asset `-dark`/`-light`, `theme-color #F6F6F3`). Tono premium e "hyperintelligence", con molta cura.
- **Da copiare.** "Priced as a professional tool, because it does the work of several" con la lista "In place of…". Il vocabolario proprietario dei livelli. Il replay di oltre un anno. La FAQ "Does Atlas tell me which way the market will go? No." (onestà che crea fiducia).
- **Punti deboli.** **Prezzo: per avere Atlas (tutto sul grafico) servono 699 $/mese**, quasi 8 volte Volwick. Nessuna prova. I livelli ES sono "Derived" e *"drift slightly during the day"*. L'order flow nativo e il DOM non ci sono ancora (Q4). Talon non dà un verdetto per scelta.

## 6. Trade Echo — DealerEdge — tradeecho.com/features/dealeredge

Fonti: https://tradeecho.com/features/dealeredge , https://tradeecho.com , https://tradeecho.com/features/futures , https://tradeecho.com/features/pulse , https://tradeecho.com/features/darkpool

- **H1 (DealerEdge):** *"See where dealers are pinned. Before the squeeze."* **Sottotitolo:** *"DealerEdge is a gamma exposure workstation. Three modes - Heatmap, Pro, and Focus… Included in Trade Echo at $199/mo, alongside five more products."*
- **H1 (homepage):** *"Institutional-grade options flow, GEX & dealer positioning. Agentic trading, built in."* Sottotitolo: *"…$199/mo, replacing $900+/mo of competing tools."*
- **Sezioni della homepage in ordine.** Barra con il prezzo → hero con prova sociale (5.000+ trader) → ticker del mercato → 8 card prodotto (DealerEdge, Pulse, OptionFlow, Darkpool, AlgoEdge, Futures, Cortex, Copy Trading) → Community → confronto "The tools you stitch together" (997 $ contro 199 $) → 3 step d'onboarding → **tabella comparativa con i concorrenti per nome** (UW, FlowAlgo, Cheddar, Heatseeker) → mobile → testimonianza → FAQ → CTA.
- **Sezioni della pagina DealerEdge in ordine.** Hero → 3 modalità → pipeline in 4 step → 6 livelli (Anchor, Flip, HVL, Call/Put Wall, Defense Lines, GEX Rating 1-5) → playbook long/short gamma → copertura dei ticker → feature → persona → statistiche → confronto dei prezzi ("$699/mo GEX-only tools") → FAQ → cross-link e pagine "vs".
- **Feature chiave.** GEX heatmap (GEX, Vol, VEX, Notional, %Gamma). **Pulse: grafico con GEX, pill Anchor/Flip, charm drift, istogramma Net Flow e print dark pool sulla stessa superficie; supporta sessioni Globex e radici futures.** **Futures Echo Map: volume profile, heatmap del delta, CVD, tape con lato aggressore e livelli gamma dei dealer su ES/MES/NQ/MNQ/RTY/YM, 24×5, con replay.** Darkpool (livelli Hero/Magnet/Support/Resistance). Cortex AI (chat, agenti programmati, esecuzione nel broker). Copy trading. App iOS/Android.
- **Dati.** "Every U.S. options exchange". GEX *"computed per strike and expiry against open interest - not modeled"*: è calcolato sull'OI, **non su posizioni reali dei MM**. Dark pool da SIP/ATS con refresh a 45 s. Nella Echo Map la mappa completa si aggiorna circa ogni 45 s; tape e CVD circa ogni 2 s.
- **Dark pool:** sì (modulo dedicato, poi overlay su Pulse; sulla Echo Map è collegato come "cash context" SPY/QQQ). **GEX/dealer:** sì. **Charm:** "Charm lens" / charm drift. **Vanna:** *"Honest answer: not yet."* **Order flow futures:** sì. **0DTE:** sì. **AI:** Cortex (chat, agenti). La "AI Analysis" di DealerEdge è **solo post-market** (*"it refreshes after the close, not in real time"*).
- **Prezzi.** Pro 199 $/mese, 2.199 $/anno, Lifetime 3.499 $.
- **Prova sociale.** "5,000+ traders", una sola testimonianza ("Prop desk · NYC"), app nei due store, Discord con "monthly member payouts".
- **CTA.** "Start Pro · $199/mo →", "See the heatmap live", "View plans", "Get Futures with Pro", "Start tracking the dark".
- **Stile.** Scuro, da terminale (numerazione "01 /", micro-copy monospace, ticker). Tono aggressivo e comparativo, molto trasparente sui limiti.
- **Da copiare.** L'**onestà tecnica esplicita** ("Honest answer: not yet", "If a level is on your map, it's real", "honest by design"), che è una leva di fiducia fortissima. La tabella che somma lo stack di tool dei concorrenti. Le pagine "vs X" per la SEO. Le persona ("0DTE traders: Size by the regime.").
- **Punti deboli.** Il GEX si basa sull'OI e non su posizioni reali dei MM. Il prezzo è 199 $, più del doppio di Volwick. La AI di DealerEdge non è intraday. Niente vanna, niente volga. La mappa futures pesante si aggiorna ogni ~45 s. Il prodotto è molto dispersivo (copy trading, algo, news). **È il concorrente più diretto e fa marketing comparativo per nome: potrebbe aggiungere Volwick alla sua tabella.**

## 7. Bookmap — bookmap.com

Fonte: https://bookmap.com (i prezzi sono nella homepage)

- **H1:** *"A trading platform that displays market liquidity"*. **Sottotitolo (H4):** *"Check what candlesticks are hiding"*.
- **Sezioni in ordine.** Hero + CTA → video "What is Bookmap?" → Features (tab Heatmap/Volume/Indicators) → Awards → Pricing → note sui dati.
- **Feature chiave.** Heatmap del book storico a 40 fps, volume dots, CVD, volume profile, record/replay, footprint, DOM Pro, indicatori di assorbimento, imbalance e strength level (dal piano Global+), multibook.
- **Dati.** I dati futures e azioni sono **venduti a parte** (MBO via BookmapData, CME…). La crypto è live.
- **Dark pool:** no nativo. **GEX/dealer:** no nativo; arriva tramite add-on di terzi (SpotGamma CloudNotes, MenthorQ, GEXBot si integrano in Bookmap). **Charm/vanna:** no. **Order flow futures:** sì, è lo standard di riferimento. **0DTE:** no. **AI:** no.
- **Prezzi.** Digital gratis (dati ritardati). Digital+ 19 $. Global 49 $ (dati live esclusi). **Global+ 99 $** (assorbimento, footprint, DOM). Più i dati di mercato. Esistono anche annuale e lifetime. Nessun rimborso.
- **Prova sociale.** Premi (immagine "Awards"), video, webinar.
- **CTA.** "START FOR FREE".
- **Stile.** Accento blu (`#0085f9`), screenshot scuri della heatmap. Tono tecnico e sobrio.
- **Da copiare.** "Check what candlesticks are hiding": una promessa visiva in 5 parole. Il freemium.
- **Punti deboli.** Software desktop (con web limitato). Richiede abbonamento dati e add-on GEX per avvicinarsi a Volwick: stack di 99 $ + dati + 50-150 $ di add-on GEX. Curva di apprendimento alta. Nessun contesto opzioni nativo.

## 8. Cheddar Flow — cheddarflow.com

Fonti: https://cheddarflow.com , https://www.cheddarflow.com/pricing

- **H1:** *"A modern options order flow platform"*. **Sottotitolo:** *"Uncover unusual options activity and follow the smart money in real time."*
- **Sezioni in ordine.** Hero + CTA di prova → "Used by over 10,000+ traders" → 3 benefici → order tracking/sweeps → "Explore hidden markets & private deals" (dark pool, Institutional Zone Analysis) → "Decode gamma to predict pressure points" (GEX, Wall radar, Gamma regime) → "AI-Powered signals" (Power Alerts) → dettagli degli ordini → testimonianze (tweet del 2021) → footer.
- **Feature chiave.** Flow opzioni, sweep, dark pool orders e dark pool levels, GEX (net/call/put, rilevamento dei muri, regime), AI Power Alerts, Cheddar AI.
- **Dati.** Non specificati ("Fast, reliable market data").
- **Dark pool:** sì, solo nel piano Pro, presentato come *"privately negotiated orders… to conceal their trading activities. This data is now available to you!"*. **GEX/dealer:** sì (Pro). **Charm/vanna:** no. **Order flow futures:** no. **0DTE:** no. **AI:** alert AI e Cheddar AI, senza lettura del grafico.
- **Prezzi.** Standard: 7 giorni gratis, poi 85 $/mese. **Pro 99 $/mese** (GEX, dark pool, AI alerts; nessuna prova). Pro annuale 75 $/mese. Countdown "Offer Ends In". Nessun rimborso.
- **Prova sociale.** "10,000+ traders", loghi di recensioni editoriali, tweet (datati 2021).
- **CTA.** "Start free 7 day trial", "Get Started", "Buy Pro Monthly Plan".
- **Stile.** Scuro, retail e moderno. Countdown di urgenza.
- **Da copiare.** La coppia "Wall radar" + "Gamma regime" come concetti semplici. La prova gratuita sul piano base.
- **Punti deboli.** Testimonianze vecchie di 5 anni. Niente futures e niente grafico con overlay. Il GEX è un'aggiunta recente (2025). Il countdown finto erode la fiducia. Prova assente proprio sul piano che conta.

## 9. OptionsDepth — optionsdepth.com (fornitore dati di Volwick)

Fonte: https://optionsdepth.com (prezzi e FAQ nella homepage)

- **H1:** *"Revealing Unseen Market Depth with Precision"*. **Sottotitolo:** *"Empower your strategy with precise options positioning and exposure analysis."*
- **Sezioni in ordine.** Hero → "Trusted by" (con "Traders from Jefferies") → "Unmatched Transparency, Cutting-Edge Accuracy" → Dynamic Charts / Intra-Day Data → feature (Custom Dashboard, MM Exposure, Positional Insights, Depth View) → Data Shop → Pricing → testimonianze → FAQ → CTA.
- **Feature chiave.** Heatmap dell'esposizione dei MM ("We also pioneered MM exposure heatmaps"), modelli gamma/charm/vanna, positional insights per scadenza, matrice strike × scadenza, dati grezzi per backtest, 3D gamma maps.
- **Dati.** *"exchange participant-tagged data from CBOE — not inferred from bid/ask spreads or tape heuristics"*. Copre **solo SPX e VIX**.
- **Dark pool:** no. **GEX/dealer:** sì, con posizioni reali. **Charm/vanna:** sì. **Order flow futures:** no. **0DTE:** sì, è il focus. **AI:** no.
- **Prezzi.** Pro Max 249 $/mese (2.499 $/anno); il sito dice "Updates every 10 minutes" in una tab e "every 1 minute" in un'altra. Pro legacy 199 $ (dati giornalieri). Combo TWI x OD 375 $/mese (con *"Trade alerts with 84% win rate"*). Enterprise su richiesta.
- **Prova sociale.** Il nome Jefferies. Testimonianze ironiche ("My ex wife hates Options Depth").
- **CTA.** "Get Started", "Contact Us".
- **Stile.** Webflow, pulito, istituzionale-tech.
- **Da copiare.** *"not inferred from bid/ask spreads or tape heuristics"*: è la frase che differenzia il dato. Il concetto "forward-looking" delle heatmap.
- **Implicazioni per Volwick.** Volwick rivende o visualizza un dato che la fonte vende a 249 $/mese, a 89 $, **con in più grafico ES/MES, tape e lettura automatica**. È un argomento di prezzo forte. Verificare però con il legale le condizioni di licenza e l'uso del nome OptionsDepth nel marketing. Nota: OptionsDepth aggiorna ogni 1-10 minuti, Volwick ricalcola ogni 5; non dichiarare "real-time" per i muri.

## 10. GEXBot — gexbot.com

Fonti: https://gexbot.com , https://www.gexbot.com/pricing

- **H1:** *"live options analytics"*. **Sottotitolo:** *"track positioning | trade imbalance"*.
- **Sezioni in ordine.** Hero con screenshot → "under the hood: real-time options classification" → integrations → coverage (56+ ticker) → i 4 pacchetti a scala → Research add-on → CTA con coupon.
- **Feature chiave.** GEX al secondo (calcolato su OI e volume). Classificazione dell'aggressore sulle opzioni al millisecondo. Profili delta/gamma/vanna/charm. Orderflow opzioni (net vanna/charm/gex/convexity). *"convert options activity to futures levels with an integrated multiplier"*. 43 grafici nel Research. WebSocket.
- **Dati.** Calcolo proprio da OI e volume, con classificazione dell'aggressore.
- **Dark pool:** no. **GEX/dealer:** sì. **Charm/vanna:** sì. **Order flow futures:** no nativo, ma si integra in Bookmap, ATAS, Sierra, NinjaTrader e simili. **0DTE:** implicito. **AI:** "natural language commands (with AI API key)" solo nel Research.
- **Prezzi.** Classic 50 $, State 150 $, Orderflow 250 $, Quant 350 $ al mese. Research 100 $ come add-on. Sconto del 50% sul primo mese con il codice TRIAL50.
- **Prova sociale.** Quasi nulla (niente testimonianze né loghi).
- **CTA.** "subscribe", "start free", "demo".
- **Stile.** Scuro (`#121212`), minimale, tutto minuscolo, per utenti tecnici.
- **Da copiare.** Il "demo" per ogni pacchetto. Il messaggio "works with your platform".
- **Punti deboli.** Nessuna UX di terminale. Prova sociale zero. Il pacchetto con vanna/charm costa almeno 150-250 $. Serve una piattaforma esterna per il grafico.

## 11. BlackBoxStocks — blackboxstocks.com

Fonte: https://blackboxstocks.com (prezzi nella homepage)

- **H1:** *"THE ULTIMATE TOOL FOR TRADERS"*. Nessun sottotitolo, solo "JOIN NOW / View Pricing".
- **Sezioni in ordine.** Hero → "Our Proprietary Features" (Alerts, Options Flow, Trading Community, Dark Pool) → "Join Team Blackbox" (foto di membri nel mondo con il merchandising) → "Track Our Top Alerts" (tabella vuota: *"Data not found."*) → Team Traders (bio) → recensioni Google (5,0 su 622) → prezzi → broker partner (tastytrade, TradeStation) → CTA "FLOW V2".
- **Feature chiave.** Alert algoritmici su 11.000 titoli, flow opzioni, dark pool (real-time e storico, "Dark Pool Volume Profile Chart Study"), "Real-time Net Options Delta and Gamma Exposure" (Options Plus), trading room live, trade del team con entry/exit.
- **Dati.** Non dichiarati.
- **Dark pool:** sì (da Options Plus, 79 $), anche come volume profile sul grafico. **GEX/dealer:** base (net delta/gamma). **Charm/vanna:** no. **Order flow futures:** no; c'è uno show mattutino su livelli ES/NQ. **0DTE:** no. **AI:** no, solo alert algoritmici.
- **Prezzi.** Options Basic 59 $, Options Plus 79 $, Equities Plus 89 $, Equities & Options Premium 149 $ al mese. "All sales are final."
- **Prova sociale.** 622 recensioni Google a 5 stelle, foto della community, bio dei trader, commissioni scontate con i broker.
- **CTA.** "JOIN NOW", "View Pricing".
- **Stile.** Datato (Elementor 2023), da community retail. Il tono è caldo e da "famiglia".
- **Da copiare.** Le recensioni con nome e data recente. Mettere in primo piano le persone.
- **Punti deboli.** Tabella dei risultati vuota in homepage. Estetica vecchia. GEX superficiale. Niente futures order flow. "Team Trades with Entries & Exits" lo rende un servizio di segnali (rischio regolatorio, ma anche più "caldo").

## 12. FlowAlgo — flowalgo.com

Fonti: https://flowalgo.com , https://flowalgo.com/select-a-plan/

- **H1:** *"Real-time Option Order Flow."* **Sottotitolo:** *"FlowAlgo alerts you as notable orders take place on the stock and equity options markets. Remove the noise and zone in on what truly matters."*
- **Sezioni in ordine.** Banner di disservizio ("We apologize for the service interuption") → hero + offerta di prova → "Institutional-level Order Flow Data for the Retail Trader" → cosa traccia (Sweeps, Blocks, Darkpool) → video demo con voice alert → spiegazione degli sweep → blocchi → dark pool, con tutorial bullish/bearish sui print → "Simpler, yet far more powerful…" → CTA.
- **Feature chiave.** Sweep, blocchi, equity block e print dark pool, "FlowAlgo Levels (Institutional Zones)", voice alert, Alpha AI Signals (nuovo), Dark Pool Insights (nuovo), chatroom.
- **Dark pool:** sì, è un pilastro storico (lista di print più livelli). **GEX/dealer:** no. **Charm/vanna:** no. **Order flow futures:** no. **0DTE:** no. **AI:** "Alpha Ai Signals".
- **Prezzi.** Prova di 2 settimane a 37 $, poi 149 $/mese. Trimestrale 129 $/mese. Annuale 99 $/mese.
- **Prova sociale.** Solo video demo; nessuna testimonianza nel testo.
- **CTA.** "Try Two Weeks for $37", "View Plans and Pricing", "Get Started for $37".
- **Stile.** Scuro, anni 2017-2020 (esempi datati: AAPL 155 C "6/17"). Offerta "ends Dec 31st", verosimilmente scaduta o evergreen.
- **Da copiare.** La prova a pagamento simbolico (37 $) che filtra i curiosi. I voice alert.
- **Punti deboli.** Esempi e UI vecchi, banner di disservizio, niente GEX né futures. Il prezzo di 149 $ è alto per il solo flow.

---

## SINTESI

### (1) Chi combina dark pool + posizionamento dealer + order flow futures, e sullo stesso grafico?

| Competitor | Dark pool | Dealer/GEX | Order flow futures (CVD/tape/delta) | Tutti e tre sullo stesso grafico? |
|---|---|---|---|---|
| **Skylit (Atlas, piano Pro 699 $)** | Sì (linee sul grafico) | Sì (GEX/VEX, "Derived" su ES1/NQ1) | Sì (Volume, **CVD**, Candle Delta, **Footprint**, Volume Profile su Atlas); DOM ed esecuzione nel Q4 | **Sì, in pratica sì.** Atlas mette orb GEX, linee dark pool e CVD/footprint sullo stesso grafico, anche su ES1 (https://www.skylit.ai/modules/atlas) |
| **Trade Echo (199 $)** | Sì | Sì (dall'OI) | Sì (Echo Map: profile, delta heatmap, **CVD**, tape e gamma su ES/MES) | **Quasi.** Echo Map = gamma + CVD + tape sul grafico ES; Pulse = GEX + dark pool + Net Flow sul grafico (anche radici Globex). Il dark pool nella Echo Map è "cash context" collegato. **Tutti e tre sono nello stesso abbonamento e in due superfici grafiche del prodotto** (https://tradeecho.com/features/futures , https://tradeecho.com/features/pulse) |
| Quant Data | Sì | Sì (+charm/vanna) | No | No |
| Unusual Whales | Sì | Sì (Periscope, **posizioni reali MM SPX**) | No (retail) | No |
| BlackBoxStocks | Sì | Base | No | No |
| Cheddar Flow | Sì | Sì | No | No |
| FlowAlgo | Sì | No | No | No |
| Bookmap (+ add-on terzi) | No | Solo tramite add-on (SpotGamma/MenthorQ/GEXBot) | Sì | No (manca il dark pool) |
| SpotGamma / MenthorQ / GEXBot / OptionsDepth | No | Sì | No nativo | No |

**Conclusione netta.** Il claim *"l'unico software con dark pool + posizionamento dealer + order flow futures (sullo stesso grafico)"* **NON è difendibile**, e lo sarebbe ancora meno con il dark pool solo "pianificato". Skylit Atlas lo fa già su un unico grafico. Trade Echo offre tutte e tre le cose in un unico abbonamento a 199 $, lo scrive in homepage e fa marketing comparativo per nome. In più il dark pool **non esiste sui futures ES**: sarebbe una proiezione dei print SPY/QQQ, e va detto con onestà. **Raccomandazione: non comunicare il dark pool finché non è live** (rischio di pubblicità ingannevole ed esposizione a smentite da parte di concorrenti comparativi come Trade Echo).

**Claim di unicità che SONO difendibili** (limitati a "tra i principali tool analizzati, settembre 2026"; va fatto un check periodico):

1. **Posizioni reali dei market maker più tape futures al secondo sullo stesso grafico ES/MES.** Nessun concorrente analizzato mette i muri dealer calcolati su **posizioni nette reali dei MM** (dato CBOE tag per partecipante) sullo stesso grafico ES/MES di un **nastro di pressione del tape futures al secondo** con large print e assorbimento. Chi ha le posizioni reali (OptionsDepth, UW Periscope) non ha il tape futures. Chi ha il tape futures più il gamma (Trade Echo, Skylit, Bookmap con add-on) calcola il gamma da OI o modelli ("computed… against open interest", "derived by Skylit"). *Formulazione suggerita:* "L'unico terminale che disegna i muri dei dealer, calcolati dalle posizioni reali dei market maker e non stimati dall'open interest, direttamente sul grafico ES/MES, accanto al tape futures secondo per secondo."
   - Attenzione: **non** dire "unici ad avere posizioni reali MM" (lo dicono OptionsDepth e UW Periscope, *"actual Market Maker net positioning… Direct from CBOE"*, a 50-120 $). Non dire "real-time" per i muri (ricalcolo ogni 5 minuti; UW Max e OptionsDepth Pro Max arrivano a 1 minuto).
2. **Heatmap volga.** Nessun concorrente analizzato cita la volga (al massimo gamma/vanna/charm/VEX/"convexity"). È un claim tecnicamente difendibile ma di nicchia, da usare come prova di profondità e non come headline.
3. **Lettura automatica intraday sempre attiva (verdetto + piano + livelli + regime).** Trade Echo DealerEdge AI è *"post-market only"*. Skylit Talon è on demand e *"never calls direction"*. MenthorQ QUIN è uno screener. UW Mr. Whale è una chat. È difendibile come "l'unica lettura che si aggiorna da sola durante la seduta", **ma "verdetto" e "piano" espongono a rischio regolatorio**: i concorrenti si proteggono esplicitamente. Serve un disclaimer forte e un frame "lettura della struttura", non "consiglio".
4. **Claim di prezzo.** "Muri dealer più order flow futures sullo stesso grafico a 89 $": Trade Echo 199 $, Skylit Atlas 699 $, Bookmap Global+ 99 $ + dati + 50-150 $ di add-on GEX, OptionsDepth da sola 249 $. Il claim "a meno della metà di…" è difendibile, verificando la parità funzionale citata.

### (2) Mappa prezzi (mensile, piano mensile; tra parentesi l'annuale mensilizzato)

| Fascia | Prodotto | Prezzo |
|---|---|---|
| < 60 $ | UW Retail Basic | 50 $ (42 $), con Periscope ogni 10 min + dark pool |
| | GEXBot Classic | 50 $ |
| | BlackBox Options Basic | 59 $ |
| 60-100 $ | Quant Data (piano unico) | 74,99 $ (62,50 $) |
| | UW Retail Pro | 75 $ (63 $) |
| | BlackBox Options Plus / Equities Plus | 79 $ / 89 $ |
| | Cheddar Flow Standard / Pro | 85 $ / 99 $ (Pro annuale 75 $) |
| | **VOLWICK** | **89 $ (piano unico)** |
| | SpotGamma Standard/Essential | 89-99 $ (67-74 $), con primo mese a 17-25 $ |
| | Bookmap Global+ | 99 $ + dati di mercato |
| | FlowAlgo annuale | 99 $ |
| 100-200 $ | UW Retail Max | 120 $ (102 $), Periscope a 1 min |
| | MenthorQ Premium | 129 $ (primo mese 39 $) |
| | SpotGamma Pro | 129 $ |
| | FlowAlgo mensile | 149 $ (prova di 2 settimane a 37 $) |
| | BlackBox Premium | 149 $ |
| | GEXBot State | 150 $ |
| | **Trade Echo Pro** | **199 $** (2.199 $/anno; lifetime 3.499 $) |
| | OptionsDepth Pro (legacy) | 199 $ |
| 200-700 $ | OptionsDepth Pro Max | 249 $ |
| | GEXBot Orderflow / Quant | 250 $ / 350 $ |
| | SpotGamma Alpha | 299 $ (primo mese 49 $) |
| | Skylit Initiate | 299 $ |
| | MenthorQ Pro | 349 $ |
| | **Skylit Pro (Atlas)** | **699 $** |
| Istituzionale | SpotGamma Institutional | da 1.999 $ |

Lettura: Volwick a 89 $ sta nella fascia dei **tool di solo flow o dashboard** (Quant Data, UW, Cheddar), ma offre ciò che nel mercato costa **199-699 $** (grafico futures + dealer). Il prezzo è un'arma, ma rischia anche di segnalare "meno serio". Conviene ancorarlo con il confronto dello stack, come fanno Trade Echo e Skylit.

### (3) Pattern comuni delle landing

1. **Hero = promessa di accesso istituzionale.** "See what the professionals see" (SpotGamma), "Institutional Quant Data" (MenthorQ), "Institutional-grade" (Trade Echo), "follow the smart money" (Cheddar, FlowAlgo). È una formula abusata e indistinguibile.
2. **Loghi media subito sotto l'hero** (Bloomberg, WSJ, CNBC, Forbes…) in SpotGamma, MenthorQ, Quant Data, Cheddar.
3. **Contatori** (7k+, 10k+, 15k+, 100k trader; 3.500+ ticker; 64+ modelli).
4. **Griglia di moduli con nomi proprietari** (HIRO, TRACE, Heatseeker, Atlas, DealerEdge, Echo Map, QUIN, Talon) e un **lessico proprietario dei livelli** (King Node, Anchor/Flip/Defense, Hero/Magnet).
5. **Community come prodotto** (Discord, live room, Live Stages, team trader). Quasi tutti la vendono.
6. **AI come layer** (Mr. Whale, QUIN, Talon, Cortex, Cheddar AI, Alpha AI). Quasi sempre è una chat on demand.
7. **Offerta d'ingresso**: primo mese scontato (SpotGamma 17 $, MenthorQ 39 $, GEXBot -50%), prova di 7 giorni (Quant Data, Cheddar), prova a pagamento (FlowAlgo 37 $), free tier ritardato (UW, Bookmap). **Solo Skylit non ha nessuna prova.**
8. **Confronto con lo stack** ("replacing $900+/mo", "In place of…") nei due player più evoluti, Trade Echo e Skylit.
9. **Onestà e disclaimer come leva** (Trade Echo "Honest answer: not yet"; Skylit "Atlas never calls direction", "results are not typical").
10. **Tema scuro dominante.** Solo Skylit offre un tema chiaro/scuro curato.

### (4) White space per Volwick

1. **"Dati veri, non stime."** È l'unico posizionamento dati che i concorrenti con il grafico futures non possono copiare senza cambiare fornitore. Trade Echo scrive "computed against open interest", Skylit "derived". Headline possibile: *"I muri dei dealer da posizioni reali. Non da stime sull'open interest."* Va accompagnata da una spiegazione in 3 righe su cosa sia il dato tag per partecipante (e cosa non sia).
2. **Focus radicale su SPX/ES/MES/VIX e sull'intraday.** Tutti gli altri si disperdono su 3.500 ticker, crypto, forex, politici, copy trading. Volwick può essere "il terminale dello S&P": meno cose, fatte meglio. MES porta dentro il trader di prop firm e micro.
3. **La lettura che si aggiorna da sola.** Tutti hanno una chat AI; nessuno ha un pannello che, senza domande, dice "regime, livelli, cosa invaliderebbe la tesi" in tempo reale. Va inquadrata come lettura della struttura e dei condizionali ("se perde X, il muro successivo è Y"), non come segnale. Serve un disclaimer stile Skylit.
4. **Microstruttura futures più opzioni in una sola vista, a 89 $.** Il "Liquidity Tide" (1 s, large print, assorbimento) è più vicino a Bookmap che a qualsiasi tool GEX. Nessuno fonde assorbimento futures e muri reali dei MM sotto i 199 $. Frame possibile: "Bookmap + SpotGamma in una tab del browser".
5. **Profondità delle greche di secondo ordine.** Charm, vanna e **volga** in heatmap; Trade Echo non ha la vanna, Cheddar e FlowAlgo nulla. Utile per il pubblico 0DTE ("perché il pin scivola nel pomeriggio").
6. **Trasparenza sulla freschezza del dato.** Come fa Trade Echo, dichiarare "greche ricalcolate ogni 5 min, tape al secondo", con timestamp visibile. Trasforma un limite in un segnale di fiducia e previene le critiche comparative.
7. **Offerta d'ingresso mancante.** Con un piano unico a 89 $ serve un meccanismo di prova (7 giorni, o un replay gratuito di una sessione passata, o dati ritardati). Molti concorrenti convertono così; Skylit, che non ha prova, compensa con la community.
8. **Prova sociale.** È il gap principale da colmare prima del lancio: servono testimonianze verificabili (link Discord o X, come Quant Data), non generiche.
9. **Dark pool: come usarlo quando arriverà.** Non come "unici", ma come *"print SPY/SPX off-exchange proiettati sui livelli ES, accanto ai muri reali"*, quindi come conferma di confluenza (il frame di Atlas). E solo dopo il rilascio.

### Rischi e cautele da passare al marketing

- Non pubblicare claim sul dark pool prima del rilascio.
- Non usare "real-time" per i muri (ricalcolo ogni 5 min). Sì per il tape.
- Non dire "unici con posizioni reali dei MM" (UW Periscope, OptionsDepth). Dire "unici a portarle sul grafico ES/MES con il tape futures", con la qualifica "tra i principali tool di settembre 2026".
- "Verdetto" e "piano" nel pannello automatico: il linguaggio deve restare descrittivo, con un disclaimer "not financial advice"; i concorrenti lo fanno tutti.
- Uso del nome e del dato OptionsDepth nel marketing: verificare le condizioni di licenza.
- Trade Echo pubblica tabelle comparative e pagine "vs": aspettarsi un confronto diretto, e prepararne uno.
