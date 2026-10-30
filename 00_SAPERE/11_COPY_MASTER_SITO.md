# VOLWICK · COPY MASTER · 22 settembre 2026

Stato: copy di riferimento per Home, Prodotto, Mercati e Prezzo. Implementato nel prototipo alla versione 90. Sostituisce la v4.1 e la versione istituzionale v5. Struttura, funzionalità, dati dei mockup, mercati e prezzo invariati.

Regola parole chiave nel corpo (v98): nei paragrafi lunghi le parole chiave sono in bianco (classe .k, peso 500) e al massimo una frase per paragrafo in blu .gs, nel punto in cui la frase gira. Il blu resta raro, il bianco guida l'occhio.

Regola sul claim competitivo: "informazioni che gli altri terminali non hanno" non si usa mai come claim assoluto. Si usa qualificato dalla prova: nessuno degli otto terminali analizzati combina Dark Pool, futures order flow in tempo reale e dealer positioning nella stessa vista. Questa è la frase da ripetere in Home, Prodotto e Prezzo, sempre con la nota .

Nota  (in tutte le pagine dove compare un claim): Confronto condotto sui siti ufficiali di SpotGamma, MenthorQ, Volland, OptionsDepth, Unusual Whales, Tradytics, BlackBoxStocks e Cheddar Flow il 22 settembre 2026. "Terminali di positioning" indica SpotGamma, MenthorQ, Volland e OptionsDepth. Il confronto riguarda le funzionalità pubblicamente documentate alla data indicata.

CTA: primaria "Accedi a Volwick" ovunque (anche in chiusura, dove il brief diceva "Entra in Volwick": una sola etichetta per tutto il sito). Secondaria "Esplora il terminale" in home, "Esplora gli strumenti" in Prodotto, "Esplora i mercati" in Mercati.

Scelte di implementazione rispetto al brief: nessuna lineetta lunga come punteggiatura (le due presenti nel brief sono diventate una virgola e un punto medio); nella sezione interattiva della home i livelli selezionabili restano quattro perché il grafico ha quattro layer, quindi la Dark Pool è dentro il livello 02 insieme a Liquidity Tide, e Market Intelligence è la didascalia con tutti i livelli accesi; le FAQ della pagina Prezzo aggiungono alle sette del brief la domanda sui mercati e quella sulla cancellazione; il blocco Trasparenza prima del prezzo in home resta ("Informazione, non segnali."); il tagline mono in chiusura home è MARKET INTELLIGENCE · BEYOND PRICE (dal v103), il footer resta "Market intelligence beyond price."

---

## 1 · HOME · HERO
Eyebrow: BEYOND PRICE · MARKET INTELLIGENCE
H1: Vedi il mercato con informazioni che gli altri terminali non hanno. (senza nota sul titolo: il claim è circoscritto dalla riga di prova subito sotto, che porta la nota )
Sub: Non limitarti alle stesse informazioni che guardano tutti. Volwick ti dà accesso a Dark Pool, futures order flow in tempo reale, liquidità intraday e dealer positioning, direttamente sul grafico.
Sub 2: Un livello di informazione che gli altri terminali non hanno, tutto in un unico grafico.
CTA: Accedi a Volwick · Esplora il terminale
Micro: DARK POOL · LIQUIDITY TIDE · DEALER WALLS · CVD · CDI · FLOW · DEALER POSITIONING
Kicker: Il prezzo è visibile a tutti. Il vantaggio è vedere ciò che c'è dietro.
(riga di prova sugli 8 terminali rimossa dalla hero)
Card: CVD · +5.68K contratti · prezzo in rialzo, flusso in divergenza / LIQUIDITY TIDE · 2.7K ×20 · esecuzioni concentrate a 7,733 / DEALER WALL · 7,737.75 · +$15.3M di esposizione sul livello

## 2 · HOME · OLTRE IL PREZZO
Eyebrow: OLTRE IL PREZZO
H2: Tutti vedono il prezzo. Non tutti vedono cosa c'è dietro.
Lead: Una candela mostra il risultato di ciò che è già successo. Non mostra da sola chi sta aggredendo il mercato, dove passa size significativa, dove si concentra la liquidità, come sono posizionati i dealer o quale attività viene riportata fuori dal book pubblico. Volwick porta queste informazioni direttamente nel contesto del prezzo.
Schema (v100, tre schede centrate e animate): 01 · VISIBILE A TUTTI · Il prezzo · Il punto di partenza di ogni grafico. → 02 · DI SOLITO SPARSO · Il contesto · chip: Dark Pool, Futures order flow, Liquidità, Dealer positioning, CVD, CDI, Flow · Sette letture, normalmente su strumenti diversi. → 03 · CON VOLWICK · Una sola lettura · Tutto sullo stesso grafico, mentre il mercato si muove.
Value line (grande, centrata): Tutti guardano lo stesso mercato. Non tutti hanno le stesse informazioni.

## 3 · HOME · DARK POOL
Eyebrow: FUORI DAL BOOK PUBBLICO · LIVE
Titolo grande: Una parte del mercato non passa davanti ai tuoi occhi. Volwick te la mostra. (ultima frase in blu)
Composizione 50/50 (v101): a sinistra label e copy, a destra un terminale Volwick con la stampa Dark Pool evidenziata a 7,733.25, card flottante (DARK POOL · LIVE · 7,733.25 · 2.7K contracts · reported off-exchange activity) e tre eventi minori sul grafico.
Titolo di colonna (v102): DARK POOL in mono grande, con badge verde LIVE
Body 1: Una parte dell'attività viene eseguita fuori dal book pubblico. / Sul normale order book, non la vedi arrivare.
Lead: Con Volwick, la vedi sul grafico.
Tre righe: Dove è passata. / A quale prezzo. / Con quale size.
Body 2: E non la guardi isolata. La leggi insieme a futures order flow, liquidità e dealer positioning, mentre il mercato si muove.
Chiusura: Informazioni che normalmente restano fuori dal tuo grafico. Con Volwick, sono davanti a te.
Striscia di confronto (sostituisce i due box "Grafico tradizionale / Volwick"): Stesso mercato. Più informazioni davanti. · GRAFICO · Price · Volume → GRAFICO + VOLWICK · Price · Dark Pool · Order flow · Liquidity · Dealer positioning
Blocco DAL DATO AL CONTESTO (centrato, v104): Attività che gli altri non vedono / entra nella tua lettura del mercato. · Ogni stampa Dark Pool mostra dove è passata attività off-exchange, a quale prezzo e con quale size. Quando più eventi si concentrano nella stessa area, Volwick rende visibile dove quell'attività sta assumendo maggiore rilevanza. · E non la lascia isolata. La mette in relazione con prezzo, futures order flow, liquidità e dealer positioning.
(numeri e value line rimossi)

## 4 · HOME · LIQUIDITY TIDE (ripristinato al copy pre Dark Pool, v108)
Eyebrow: 01 · REAL-TIME LIQUIDITY
Claim: Vedi la liquidità muoversi.
Body: Osserva in tempo reale dove emergono ordini di grande entità, quanto sono rilevanti e come la loro presenza cambia mentre il mercato si muove.
Didascalia: ES · 1 minuto · seduta del 20 settembre
Riga LIVE LIQUIDITY: 2.7K contratti · ×20 esecuzioni rilevate · 7,733 livello di prezzo
(rimossi: quattro letture Aggressione/Assorbimento/Accumulazione/Divergenza, blocco Levels, value line "Il prezzo può sembrare fermo")

## 5 · HOME · DEALER WALLS (v109)
Eyebrow: 02 · DEALER POSITIONING
Claim: Ci sono livelli che non trovi / su un normale grafico.
Body: Livelli che non nascono dal prezzo, ma dalla struttura del mercato delle opzioni. Volwick individua dove l'esposizione dei dealer diventa significativa e porta queste aree direttamente sul grafico. / Dove si trova il Wall. Quanto pesa. Che esposizione c'è dietro. Quanto dista dal prezzo. / Informazioni che il prezzo, da solo, non può mostrarti.
Blocco REACTION LEVELS (centrato, v113): Non tutti i livelli hanno / lo stesso peso. · Volwick evidenzia le aree in cui il positioning dei dealer diventa più significativo e le aggiorna mentre cambia la struttura del mercato. · RESISTENZA · SUPPORTO · MAGNETE · +$15.3M esposizione sul livello · 7,737.75 Dealer Wall · +12.75 pt distanza dal prezzo
Value line (centrata): Non nasce dal movimento del prezzo. / Nasce dal positioning che c'è dietro.

## 6 · HOME · MARKET MAPS
Eyebrow: 03 · DEALER STRUCTURE
Claim: Il mercato si muove dentro una struttura. Volwick te la rende visibile.
Body: Il positioning dei dealer cambia continuamente e con esso può cambiare il contesto nel quale il prezzo si muove. / Market Maps trasforma questa struttura in qualcosa che puoi vedere direttamente intorno al prezzo.
Mappe: GAMMA · Mostra dove il positioning dei dealer può influenzare la risposta del mercato. / CHARM · Come cambia l'esposizione con il passare del tempo? / VANNA · Come cambia con la volatilità? / REGIME · Che tipo di contesto strutturale stai attraversando?
Value line: Il prezzo ti dice dove sei. Market Maps ti mostra il contesto intorno.

## 7 · HOME · CVD · CDI · FLOW (v116)
Eyebrow: 04 · DENTRO IL MOVIMENTO
Claim: Il prezzo mostra il movimento. / Il flusso ti aiuta a valutarne la qualità.
Body: Volwick mette il movimento del prezzo in relazione con l'attività che sta avvenendo su futures e opzioni. / Non per prevedere dove andrà il mercato, ma per capire se il movimento che stai osservando trova conferma nel flusso, dove stanno emergendo squilibri e quando prezzo e attività iniziano a divergere.
CVD · FUTURES · Pressione sul futures: Misura lo squilibrio cumulativo tra acquisti e vendite aggressive.
CDI · 0DTE OPTIONS · Sbilanciamento sulle opzioni: Mostra come si distribuisce l'attività intraday tra i due lati del mercato.
FLOW · OPTIONS PREMIUM · Flusso di premio: Mostra come il premio negoziato si distribuisce tra call e put.
Nota: Il prezzo può continuare a muoversi nella stessa direzione mentre ciò che accade sotto la superficie sta già cambiando.
Value line: Non cercare una previsione. / Cerca conferme, squilibri e divergenze.

## 8 · HOME · MARKET INTELLIGENCE (v122, grafica minimal)
Eyebrow: 05 · SINTESI · H2: MARKET INTELLIGENCE
Claim: Più informazioni hanno valore / quando sai come leggerle insieme.
Body: Dark Pool, Liquidity Tide, Dealer Walls, CVD, CDI, Flow e positioning mostrano dimensioni diverse dello stesso mercato. / Market Intelligence le mette in relazione e ti aiuta a capire cosa sta succedendo, quali livelli meritano attenzione e in quale contesto si sta muovendo il prezzo. / Non sostituisce la tua lettura. La rende più completa.
Pipeline (linea sottile con punto che scorre): DATA Cosa sta succedendo → STRUCTURE Dove si concentra il positioning → CONTEXT In quale struttura si muove il prezzo → MARKET INTELLIGENCE Una lettura più completa
La lettura di Volwick (tabella compatta, una riga alla volta si accende): MARKET READ Cosa sta mostrando il mercato? · KEY LEVEL Quali livelli meritano attenzione? · MARKET PLAN Quali condizioni definiscono lo scenario? · REGIME In quale contesto sta avvenendo?
Frase: Market Intelligence non ti dice cosa fare. Ti aiuta a capire meglio ciò che hai davanti.
Value line: La decisione resta tua. / Volwick ti dà più elementi per prenderla.

## 9 · HOME · DEMO INTERATTIVA (v119, sostituisce "Tutto insieme")
Eyebrow: PROVA LA LETTURA DI VOLWICK
H2: Una seduta. / Ogni lettura sullo stesso grafico.
Lead: Attiva Dealer Walls, Liquidity Tide, CVD, CDI, Flow e Maps direttamente dal terminale e osserva come ogni lettura aggiunge contesto allo stesso movimento di prezzo. Market Intelligence aggiorna la sintesi mentre la seduta avanza.
Indicazione: ATTIVA LE LETTURE DIRETTAMENTE DAL TERMINALE (v122: niente riquadri esterni, i tasti blu nel terminale si accendono da soli durante la seduta finché l'utente non ne tocca uno)
Didascalie tasti: Dealer Walls. I livelli dove si concentra il positioning dei dealer, con esposizione e distanza dal prezzo. Clicca un livello per il dettaglio. / Liquidity Tide. Le esecuzioni più rilevanti sul futures, con size e numero di stampe, e il livello dove si sono concentrate. / CVD. Lo squilibrio cumulativo tra acquisti e vendite aggressive sul futures. / CDI. Lo sbilanciamento dell'attività intraday sulle opzioni 0DTE. / Flow. Come si distribuisce il premio negoziato tra call e put. / Maps. La mappa gamma: la struttura di positioning dentro cui si muove il prezzo.
Etichetta obbligatoria nel terminale: DEMO INTERATTIVA · DATI SIMULATI
Scenario (ES 1m simulato, 10:00-12:30): salita verso Call Wall 7,737.75 → assorbimento sul livello (Liquidity Tide, livello 7,733) → nuovo massimo con CVD più basso e put in aumento → discesa verso la Calamita 7,717.75 → prezzo fermo sul livello.
Didascalie per fase: Il prezzo sale verso 7,737.75. Il Dealer Wall è sul grafico prima che il prezzo ci arrivi. / Sul livello passa size importante ma il prezzo non avanza. Liquidity Tide mostra dove si concentra l'attività. / Il prezzo segna un nuovo massimo, il CVD no. Il flusso smette di confermare il movimento. / Il prezzo lascia il Wall e scende verso 7,717.75. Market Intelligence aggiorna la lettura. / Il movimento si esaurisce vicino al livello di positioning.
Didascalie dimensioni: Struttura. I Dealer Walls sono i livelli dove si concentra il positioning dei dealer. Clicca un livello per vedere esposizione e distanza dal prezzo. / Liquidità. Liquidity Tide segna dove sono passate le esecuzioni più grandi e i livelli dove l'attività si è concentrata. / Flusso. CVD, CDI e Flow mettono il prezzo a confronto con ciò che accade su futures e opzioni. / Contesto. La mappa gamma e il regime mostrano la struttura dentro cui si muove il prezzo.
Chiusura (si accende a fine demo): Il prezzo era lo stesso. / Le informazioni che avevi davanti, no.
Nota: il terminale della demo usa la stessa pelle del software (barra superiore con WALLS Top 15, METRIC GEX, EXPIRY, chip oro; Liquidity Tide come etichette bianche size ×stampe; tag RESISTENZA / CALAMITA / SUPPORTO; prezzo in ambra; pannello READS THE CHART compatto; barra LIVE / REPLAY / TIME / SPEED). Il pannello mostra solo letture (Market Read, Magnet, Key Level, Regime, Levels), nessuna indicazione di trade.

## 10 · HOME · UN SOLO AMBIENTE (v127, visualizzazione animata)
Eyebrow: UN SOLO AMBIENTE
H2: Fonti separate. / Una sola lettura.
Visual: a sinistra cinque fonti vive in stile terminale (DARK POOL stampe off-exchange · FUTURES TAPE time & sales · DEALER POSITIONING GEX per strike · OPTIONS FLOW premio call/put SPX 0DTE · LIQUIDITY esecuzioni rilevanti). Un impulso parte da ciascuna fonte e raggiunge il terminale Volwick al centro: il tasto corrispondente si accende e il livello compare sul grafico. Dal terminale parte il flusso verso READS THE CHART a destra (Market Read, Key Level, Flow, Regime), che si compila riga per riga. Ciclo continuo.
Chiusura: Un mercato. Più informazioni. Un terminale.

## 11 · HOME · REPLAY (v127, mini terminale interattivo)
Eyebrow: REPLAY
H2: Torna a quel momento. / Con le informazioni di quel momento.
Indicazione: TRASCINA LA TIMELINE
Terminale: stessa pelle del software, timeline trascinabile, play/pausa, SPEED 1x 10x 30x 60x, timestamp "Replay (hh:mm)", etichetta DEMO · DATI SIMULATI. Spostando il tempo cambiano insieme candele, Dealer Walls (snapshot di positioning ogni 5 minuti, esposizioni che evolvono, nuovo Wall a 7,727.75 dalle 11:36), Liquidity Tide, CVD/Flow e Market Intelligence. A destra dell'istante corrente area "NON ANCORA DISPONIBILE".
Chiusura: Analizza ciò che potevi vedere / prima di sapere cosa sarebbe successo.

## 12 · HOME · CHIUSURA (v124)
Logo VOLWICK
H2: Lo stesso mercato. / Un livello di informazione diverso.
Lead: Dark Pool. Futures order flow in tempo reale. Liquidità. Dealer positioning. CVD. CDI. Flow. Market Intelligence. / Volwick porta nello stesso terminale informazioni che normalmente non hai davanti nello stesso ambiente, costruendo una lettura più completa intorno al prezzo.
Riga: Vedi più del prezzo. Comprendi più del movimento.
CTA: Accedi a Volwick · Tagline: MARKET INTELLIGENCE · BEYOND PRICE

## 13 · HOME · TRASPARENZA E PREZZO (v122)
Prezzo (uguale su Home, Prodotto, Mercati): ACCESSO COMPLETO · Un solo accesso. / Tutto Volwick. · $89 / mese · Accesso completo al terminale e a tutte le funzionalità Volwick. Nessun piano superiore. Nessuna funzione da sbloccare. · CTA Accedi a Volwick + Esplora il terminale · INCLUSO: Dark Pool live · Liquidity Tide · Dealer Walls · Dealer Positioning · Reaction Levels · CVD · CDI · Flow · Gamma · Charm · Vanna · Regime · Market Intelligence · Replay · Fino a cinque grafici e layout salvati · Tutti i mercati disponibili · UN SOLO ACCESSO: Nessun costo nascosto · Cancella quando vuoi · Accesso attivo fino alla fine del periodo · Volwick è uno strumento di market intelligence e analisi di mercato. Non gestisce capitale e non esegue operazioni.
Footer: VOLWICK · MARKET INTELLIGENCE · BEYOND PRICE · PRODOTTO (titolo cliccabile): Come funziona, Mercati, Prezzo · RISORSE: FAQ, Replay · ACCOUNT: Accedi, Apri il terminale · LEGAL: Termini, Privacy, Risk Disclaimer
Avvertenza di rischio: Volwick fornisce dati e strumenti di analisi di mercato e non costituisce consulenza finanziaria o una raccomandazione all'acquisto o alla vendita di strumenti finanziari. Il trading di futures, opzioni e altri strumenti finanziari comporta il rischio di perdita del capitale. Dati e risultati storici non garantiscono risultati futuri. (da far verificare a un legale prima della pubblicazione)

## PAGINA PRODOTTO
Hero: IL TERMINALE · Non abbiamo costruito un altro grafico. · Abbiamo costruito un terminale che aggiunge al prezzo ciò che normalmente manca: Dark Pool, futures order flow in tempo reale, liquidità intraday, positioning dei dealer e flusso delle opzioni. Informazioni che gli altri terminali analizzati non riuniscono nello stesso ambiente. · CTA Accedi a Volwick · Esplora gli strumenti
Principio: Parti dal prezzo. Poi aggiungi ciò che il prezzo non contiene. · Volwick mantiene il grafico al centro. Intorno aggiunge progressivamente diverse fonti di market intelligence. · PREZZO Cosa sta facendo il mercato. / ORDER FLOW Cosa sta succedendo negli scambi. / DARK POOL Cosa è stato eseguito fuori dal book pubblico. / DEALER POSITIONING Il contesto strutturale derivato dal mercato delle opzioni. / FLOW Cosa stanno mostrando futures e opzioni. / MARKET INTELLIGENCE Come queste informazioni si combinano nello stesso momento.
Strumenti (pre-titolo: Un terminale. Più livelli di informazione.): Dark Pool · Attività off-exchange riportata direttamente sul grafico con prezzo, ora, size e livello. / Liquidity Tide · Pressione e attività significativa sul nastro futures in tempo reale. / Dealer Walls · Livelli derivati dall'esposizione dei dealer per strike. / Dealer Positioning · il positioning derivato dal libro opzioni, non una previsione. / Reaction Levels · I livelli strutturalmente più rilevanti derivati dal positioning. / CVD · Futures aggression / CDI · 0DTE options imbalance / Flow · Options premium / Market Maps · Gamma, Charm, Vanna e Regime. / Market Intelligence · La sintesi che porta le diverse letture nello stesso contesto. / Replay · La seduta ricostruita con i dati che erano disponibili nel momento in cui si svolgeva.
Perché Volwick: Non è una singola feature a rendere Volwick diverso. È ciò che puoi vedere nello stesso momento. · DARK POOL + FUTURES ORDER FLOW + DEALER POSITIONING + OPTIONS FLOW + MARKET STRUCTURE · Tutto direttamente intorno al prezzo. Tra gli otto terminali analizzati, Volwick è l'unico a riunire Dark Pool, futures order flow in tempo reale e dealer positioning nella stessa vista.
Chiusura: Più fonti. Una sola lettura. · Non devi cambiare piattaforma per capire cosa sta succedendo dietro al prezzo. Volwick porta il contesto sul grafico.

## PAGINA MERCATI
Hero: MERCATI · Un unico terminale. Più mercati. Lo stesso livello di lettura. · Porta market intelligence, positioning e order flow direttamente sui mercati che osservi. · SPX · ES · MES · NQ · VIX · VX · RTY · SPY · QQQ · GOLD · CTA Esplora i mercati
Come funziona: Il dato cambia. Il principio resta lo stesso. · Per ogni mercato Volwick utilizza le fonti disponibili e dichiara chiaramente da dove deriva ciascuna lettura. Niente livelli presentati come equivalenti quando non lo sono. Dato osservato, dato derivato e stima restano distinti.
Gruppi: SPX · ES · MES · Leggi il prezzo insieme a futures order flow, Dealer Walls, dealer positioning, Reaction Levels e Market Maps. I livelli di ES e MES vengono messi in relazione con il positioning derivato dal libro opzioni SPX. / NQ · RTY · GOLD · Dove non è disponibile un libro opzioni equivalente a SPX, Volwick utilizza l'open interest dell'ETF di riferimento per costruire le letture disponibili. Il terminale indica quando un livello è stimato. / VIX · VX · Integra il contesto della volatilità con le letture disponibili sul libro VIX e sui futures VX. / SPY · QQQ · Porta la lettura degli ETF nello stesso ambiente, con gli strumenti disponibili per ciascun mercato.
Valore: Non vogliamo mostrarti più mercati. Vogliamo mostrarti più informazioni su ciascun mercato. · Il ticker cambia. Il principio di Volwick no: prezzo + flusso + struttura + positioning + contesto.

## PAGINA PREZZO
Hero: ACCESSO COMPLETO · Un accesso. Tutto Volwick. · $89 / mese. · Dark Pool live. Liquidity Tide. Dealer Walls. CVD. CDI. Flow. Dealer Positioning. Market Maps. Market Intelligence. Replay. Nessun livello superiore. Nessuna feature da sbloccare. · Accesso completo · Cancella quando vuoi
Per cosa stai pagando: Non stai pagando per un altro set di indicatori. · Stai accedendo a un terminale che riunisce Dark Pool, futures order flow in tempo reale, dealer positioning e market intelligence nello stesso ambiente. Una combinazione che non abbiamo trovato negli altri terminali analizzati. $89 al mese. Tutto incluso.
Cosa include: DARK POOL Attività Dark Pool integrata nella lettura / LIQUIDITY TIDE Futures order flow in tempo reale / STRUTTURA Dealer Walls · Dealer Positioning · Reaction Levels / FLOW CVD · CDI · Options Flow / CONTESTO Gamma · Charm · Vanna · Regime / MARKET INTELLIGENCE Market Read · Key Level · Market Plan · Regime / REPLAY Rivedi la seduta con il contesto disponibile durante il mercato / TERMINALE Fino a cinque grafici e layout salvati
Nessun upsell: Non devi scegliere quale parte di Volwick avere. · Un solo accesso significa esattamente questo. Nessun piano "Pro" sopra di te con le informazioni migliori bloccate. Entri in Volwick. Hai Volwick. · Tutti gli strumenti · Tutti i mercati disponibili · Tutti gli aggiornamenti inclusi
FAQ: Cos'è Volwick? / Cosa rende Volwick diverso? / Le Dark Pool sono live? / Liquidity Tide cos'è? / Volwick genera segnali BUY o SELL? / Serve TradingView o un'altra piattaforma? / Quanto costa? / Su quali mercati è disponibile? / Posso cancellare quando voglio? (testi come nel brief del 22 settembre, più le due aggiunte)
Chiusura: Il mercato mostra a tutti il prezzo. Volwick ti mostra il resto. · Entri in Volwick. Hai Volwick. · $89 al mese · Accesso completo · Cancella quando vuoi


NOTA (v96): tutti i rimandi numerici alla nota sul confronto sono stati rimossi dalla pagina. Le note a fondo sezione restano come testo senza numero.


## v112 · Didascalie
Rimosse ovunque le didascalie piccole grigie sotto grafici e screen (sigCap, heroCap, hwCap: "ES · 1 minuto · seduta del 20 settembre", "ES · Walls top 15 · metric GEX", "Una mappa alla volta...", "Terminale Volwick · ES 1m...", "non è un feed live"). Non vanno reintrodotte.

## v114 · Layout home
Home interamente centrata (hero a colonna unica con terminale sotto, titoli, testi, value line, numeri, Dark Pool con copy sopra e terminale sotto). Motion: griglia prospettica animata nell'hero, nastro scorrevole delle funzioni sotto l'hero, linea di scansione sui grafici, punto luminoso che scende sopra ogni sezione, riflesso di luce sui titoli mono, numeri che contano al primo scroll. Tutto si spegne con "riduci movimento".

## v121 · Nota di confronto
Rimossa ovunque la nota "Confronto condotto sui siti ufficiali di SpotGamma, MenthorQ, Volland, OptionsDepth…". Non va reintrodotta.

## v125 · Regola di impaginazione
In tutto il sito il testo è centrato (etichette, titoli, paragrafi, frasi di chiusura, numeri) ogni volta che non ha un'immagine o un grafico a fianco. Restano a due colonne solo i blocchi testo + immagine (schede strumento, hero con visual, Come funziona con il terminale fisso, FAQ).

## v126 · Terminale della demo
Pelle identica al software reale (volwick.com/dashboard): logo V + VOL(bianco)WICK(blu), gruppo ES/prezzo/variazione/1m, separatore blu, gruppo WALLS/METRIC/EXPIRY, separatore blu, chip LIQUIDITY TIDE/CVD/CDI/FLOW/MAPS, GUIDE e PANELS a destra; LAYOUT tolto. Asse sinistro volumi (K), asse destro prezzi senza virgola, volumi sovrapposti in basso, prezzo in ambra, crosshair con prezzo, volume e ora ET. Barra in basso: LIVE | REPLAY, TIME con play/pausa, timeline rossa con orari, SPEED 1x 10x 30x 60x, SNAPSHOT, REPLAY, ALERTS, etichetta DEMO · DATI SIMULATI.

## v128
Rimossi: la didascalia con orario sotto il terminale Replay e il blocco "Market intelligence, non segnali" prima del prezzo. Il concetto resta nella sezione Market Intelligence ("La decisione resta tua") e nell'avvertenza di rischio nel footer.

## v129 · Hero, prezzo, Prodotto
HOME HERO: tolte le righe "Un livello di informazione che gli altri terminali non hanno, tutto in un unico grafico." e la riga mono delle funzioni. Il terminale in apertura è ora quello interattivo (stessa pelle del software), in prospettiva che si raddrizza allo scroll; tutti i tasti funzionano (ES, 1m↔5m, WALLS, METRIC GEX/DEX/VEX, EXPIRY All/0DTE, LIQUIDITY TIDE, CVD, CDI, FLOW, MAPS, GUIDE, PANELS, LIVE, REPLAY, play/pausa, timeline, SPEED, SNAPSHOT, ALERTS). Tolto il secondo terminale statico sotto "Tutti vedono il prezzo".
PREZZO (Home, Prodotto, Mercati): ACCESSO COMPLETO · Un solo accesso. / Tutto Volwick. · $89 / mese · Informazioni che gli altri terminali non hanno, tutte nello stesso grafico. Nessun piano superiore. Nessuna funzione da sbloccare. · CTA · DATI: Dark Pool live, Liquidity Tide, Futures order flow · STRUTTURA: Dealer Walls, Dealer Positioning, Reaction Levels, Gamma · Charm · Vanna · Regime · FLUSSO: CVD, CDI, Options Flow · LETTURA: Market Intelligence, Replay, Fino a 5 grafici · layout salvati, Tutti i mercati disponibili · Nessun costo nascosto · Cancella quando vuoi · Accesso attivo fino alla fine del periodo · nota legale.
PRODOTTO (ordine): Hero "Informazioni che gli altri terminali non hanno. / Tutte sullo stesso grafico." + indice 01–07 → Il terminale, dal vivo "Parti dal prezzo. / Poi vedi ciò che il prezzo non mostra." (terminale interattivo) → 01 Dark Pool "Una parte del mercato non passa davanti ai tuoi occhi. Volwick te la mostra." → 02 Liquidity Tide "Vedi la liquidità muoversi." → 03 Dealer positioning "Ci sono livelli che non trovi su un normale grafico." (Dealer Walls, Dealer Positioning, Reaction Levels) → 04 Market Maps → 05 "Il prezzo mostra il movimento. / Il flusso ti aiuta a valutarne la qualità." (Flusso di premio, Pressione sul futures, Sbilanciamento sulle opzioni) → 06 Market Intelligence "Più informazioni hanno valore quando sai come leggerle insieme." → 07 Replay "Torna a quel momento. Con le informazioni di quel momento." → Dati e infrastruttura → Il terminale arriva già pronto → Perché Volwick (tolto "otto terminali analizzati") → Chiusura "Vedi più del prezzo. / Comprendi più del movimento." → prezzo.
EFFETTI: Dark Pool entra da sfocato a nitido; Liquidity Tide si rivela da sinistra; Dealer Walls si raddrizza dalla prospettiva; Market Maps entra in scala; schede strumento entrano alternate dai lati; card flow a cascata; fonti di "Un solo ambiente" a cascata; Replay ruota in posizione; luce che segue il mouse su mappe e figure.

## v130 · Capitoli ordinati
Regola: ogni indicatore è un capitolo con la stessa sequenza. Riga divisoria con numero (es. "01 DARK POOL / 06") SOLO quando si passa a un nuovo indicatore; nessun'altra riga dentro le sezioni. Poi: nome dello strumento, frase principale, una riga di spiegazione, UNA figura, riga di numeri, frase di chiusura.
Home: 01 Dark Pool · 02 Liquidity Tide · 03 Dealer Walls · 04 Market Maps · 05 CVD · CDI · Flow · 06 Market Intelligence. Prodotto: stessi capitoli più 07 Replay (/ 07).
Dark Pool home: una sola figura (terminale Dark Pool); tolti il confronto "Grafico / Grafico + Volwick" con le frecce, il secondo grafico con feed e il blocco "Dal dato al contesto". Testo: Una parte del mercato non passa davanti ai tuoi occhi. / Volwick te la mostra. · L'attività eseguita fuori dal book pubblico, direttamente sul grafico: dove è passata, a quale prezzo, con quale size. · 2.7K contratti in un solo evento · $1.05B nozionale · 7,733.25 livello di prezzo · Informazioni che normalmente restano fuori dal grafico. / Con Volwick, sono davanti a te.
Liquidity Tide: corretto il grafico che non si caricava. Chiusura: Il prezzo può sembrare fermo. / Il flusso no.
Spiegazioni ridotte a una riga per capitolo (Walls, Maps, Flow, Market Intelligence).
