# VOLWICK · Content Engine · CE_14 Linguaggio visivo, storytelling, audio e standard di qualità

Versione 1, 23 ottobre 2026. Nasce dal Creative Excellence Program di Power. Prevale su CE_00 e CE_13 dove li contraddice, tranne le decisioni già prese da Power (logo fisso in alto a sinistra, voce Matthew, nessuna etichetta a schermo, finale con il logo che si forma).

## Fase A · Reverse engineering

### Come è stato fatto
I video segnati **VISTO** sono stati aperti su YouTube nel Chrome di Power. Per ognuno ho estratto 12 fotogrammi a tempi fissi (0,05 s, 0,7, 1,5, 2,5, poi a intervalli crescenti, e gli ultimi 6 secondi). L'audio non l'ho ascoltato: i video erano muti, quindi voce e sound design dei video visti non sono analizzati. Dopo 5 video l'estensione di Chrome si è disconnessa. Gli altri sono **METADATI**: ho solo titolo, durata, visualizzazioni e descrizioni dalla ricerca precedente, e non ne descrivo i fotogrammi.

### Video visti (analisi completa nelle note di visione)
| # | Video | Visualizzazioni | La tecnica che ci serve |
|---|---|---|---|
| V1 | The Economist, «Are you about to lose your job?» | 292K | Domanda già scritta al fotogramma 0. Un numero gigante per schermo («40%») con etichetta e fonte. Lo stesso schema ripetuto per ogni dato |
| V2 | The Economist, «Russia is building its own version of Starlink» | 162K | Movimento al fotogramma 0, il nome della cosa entro 4 s, il meccanismo disegnato in wireframe monocromo, finale con solo il logo centrato |
| V3 | WSJ Heard on the Street, «Why Treasury Yields Have Defied…» | 15K | Paradosso nel titolo. Un grafico per schermo con la serie protagonista spessa e colorata e quella di contesto grigia. Annotazioni aggiunte sullo stesso grafico. Nome di rubrica come marchio di serie |
| V4 | Kurzgesagt, «Can Earth Run Out of Water?» | 3,9M | Fotogramma 0 con affermazione e un oggetto che si muove. Il colore cambia esattamente sulla parola. Dati in pillole sopra l'immagine. Chiusura che torna alla scena d'apertura |
| V5 | TradingView, «What is Trading Volume?» | 116K | Nessuna cinematica, interfaccia illeggibile da telefono, eppure 116K: conta la domanda di ricerca. Noi possiamo vincere sulla leggibilità |

### Video analizzati solo da metadati (nessun fotogramma descritto)
SpotGamma «SPX: Detect a Break Out / Fake Out» (2,9K); MenthorQ «Why Gamma Levels and Volume Profile Work So Well Together» (1,6K); Axia Futures «What Acceptance Tells You About the Market» (1,5-2,9K); Jigsaw Trading «Your Brain Is Sabotaging Your Trading» (537K, probabilmente promosso); Jigsaw «The FATAL Flaw in All Trading Systems» (409K); Barchart «The Gamma Flip: The Hidden Level That Can Change Everything» (77K, formato lungo); «Gamma exposure from an Ex Market Maker» (85K); «The ULTIMATE Beginner's Guide to GEX» (88K); TikTok @tradingenerationx sulle correlazioni (574K con 5,5K follower); TikTok @traders_notes_team (716K); TikTok @kevonz «Can you beat a quant trader?» (541K); TikTok @sharpresearch sui fair value gap (393K); The Economist su TikTok (100M in un anno, fonte INMA e Nieman Lab); WSJ «How China Stole Driscoll's Secret for Blueberries» (345K); WSJ «Why Chinese Cars Dominated the Paris Auto Show» (290K); Kurzgesagt «Dust Is Not What You Think» (2,8M); Kurzgesagt «What If You Never Slept?» (2,8M); Bloomberg «Can Microscopic Organisms Solve the Global Copper Crisis?» (23K).

Totale: 5 visti e 18 da metadati, per 23 video. Per arrivare a 30 visti con analisi dei fotogrammi serve che Chrome sia di nuovo collegato.

### Cosa ci insegnano, in sei regole
1. **Il fotogramma 0 contiene già la promessa.** In tutti e quattro i video curati il titolo o la domanda sono già sullo schermo, e qualcosa si muove al centro (V1, V2, V4).
2. **Un numero alla volta, grande, con etichetta e fonte sotto.** Nessun video visto mette due numeri della stessa importanza nello stesso schermo (V1, V3).
3. **Il grafico resta lo stesso e si arricchisce.** WSJ non cambia grafico, aggiunge un'annotazione. Kurzgesagt non cambia scena, cambia il colore (V3, V4).
4. **Il colore vuol dire qualcosa ed entra sulla parola.** L'acqua diventa magenta quando la voce dice «can supply» (V4).
5. **La serie ha un nome visibile.** «HEARD», la «E» tonda dell'Economist: il marchio della rubrica si riconosce prima del contenuto (V2, V3).
6. **Il finale è sobrio.** Solo logo centrato, nessun testo (V2), oppure ritorno alla scena d'apertura (V4). Il nostro logo che si forma con il loop rispetta entrambe le idee.

## Fase B · Volwick Visual Language

Direzione: premium, minimale, istituzionale, moderno, preciso, educativo.

**Regola principale: un solo elemento protagonista alla volta.** Il resto si attenua al 30-40% e va leggermente fuori fuoco (2,5D), senza sparire. Nel motore è la funzione `VW.focusBegin/focusEnd`.

| Ambito | Regola |
|---|---|
| Formato | 1080×1920, 60 fps |
| Zone sicure | Contenuto essenziale tra x 120 e 888 e tra y 250 e 1600. Sotto 1600 solo fondo: è la zona dove Instagram e TikTok mettono nome e descrizione. Logo fisso in alto a sinistra (x 64, y 92). |
| Gerarchia | Tre livelli soltanto. (1) Il protagonista: linea, livello o numero, nitido e illuminato. (2) Il contesto: grafico, assi e volumi, attenuati. (3) Il testo: hook o sottotitolo, sempre sopra o sotto il protagonista, mai sopra. |
| Dimensione dei grafici | Il pannello attivo occupa almeno il 55% dell'altezza utile. Due pannelli insieme solo per i confronti (P02), e in quel caso uno dei due è sempre attenuato. |
| Tipografia | Inter Tight 700 per hook e sottotitoli; JetBrains Mono per numeri ed etichette. **Minimo 26 px per tutto ciò che va letto**, 30 px per le etichette dei livelli, 70-84 px per i sottotitoli, 96-100 px per l'hook. Sotto i 26 px solo decorazione che non serve capire. |
| Densità | Massimo un numero da leggere per volta. Non più di tre etichette accese nello stesso istante. |
| Camera | Avvicinamento lento e continuo dentro ogni inquadratura (+3%), spostamenti con easing morbido di 0,4-0,7 s. Nessun whip pan o zoom brusco. Dopo ogni spostamento l'elemento nuovo arriva al centro. |
| Luce | Una sola luce: bagliore sull'elemento attivo (ombra colorata del suo colore) e vignetta morbida sul resto. Nessun lens flare né particelle. |
| Profondità | 2,5D: griglia in parallasse, dati sempre piatti e leggibili, fuori fuoco di 3-4,5 px sul contesto. Mai barre o candele 3D. |
| Colore | Fondo blu notte. Ogni colore ha un significato fisso: verde e rosso per candele e acquisti/vendite, arancio per divergenze, oro per i block print, colori dei muri come nel terminale (verde, rosso, ciano, magenta), blu Volwick per il marchio. |
| Transizioni | Niente stacchi di montaggio dentro un concetto. Il grafico resta e cambia ciò che è a fuoco. Il riavvolgimento è l'unica transizione «effetto», ed è riservato al passaggio da hook a spiegazione. |
| Sottotitoli | Parola per parola, 2-3 parole per volta, y 1560. La parola chiave prende **il colore dell'elemento di cui parla** (CVD bianco ghiaccio, «divergence» arancio, «buy» verde, «sell» rosso, «Red» rosso, «Magenta» magenta). |
| Branding | Logo fisso in alto a sinistra con lo strumento a destra («ES · 1m»). Nel finale il logo si forma dalla linea del prezzo, poi «SEE WHAT OTHERS CAN'T.», poi il loop sul fotogramma 0 con l'hook già scritto. |

## Fase C · Storytelling engine

Struttura base: **HOOK → QUESTION → FIRST INSIGHT → EXPLANATION → PAYOFF**. Il primo pezzo di valore arriva entro 3 secondi: l'hook stesso mostra il fenomeno, non lo promette.

### BEYOND THE CHART (un concetto visibile sul grafico)
1. **Contraddizione** (P01). Due fatti opposti nei primi 2 s («Price ▲ / Net buying ▼»), riavvolgimento, poi lo strumento che rende visibile la differenza, il limite e il bivio.
2. **Stesso punto, due finali** (P02). Due esiti mostrati subito, riavvolgimento al momento in cui erano identici, la variabile nascosta che li separa, poi il limite.
3. **Quiz.** «Which of these levels holds?» Due o tre livelli, una pausa di 1 s per far scegliere, poi la rivelazione con il dato di posizionamento. La risposta arriva entro metà video, non alla fine.

### UNDER THE SURFACE (un meccanismo che non si vede)
1. **Rallentatore.** Lo stesso movimento di 2 secondi mostrato prima a velocità normale, poi rallentato con il meccanismo disegnato sopra (coperture dei dealer, flusso).
2. **Domanda da glossario** (modello TradingView, ma leggibile). «What is charm?» Risposta in una frase entro 3 s, poi l'animazione che la rende ovvia.
3. **Prima e dopo il tempo.** Il grafico fermo, l'orologio che avanza, le coperture che si spostano da sole: il charm mostrato senza parole difficili.

### MARKET DECODED (una seduta reale, solo con dati storici verificati)
1. **Replay datato.** Data e ora a schermo, il livello prima del movimento, il movimento, cosa ha fatto il livello. Si alternano casi che hanno tenuto e casi che non hanno tenuto.
2. **Il numero della settimana.** Un solo valore («−$22M») spiegato in 30 secondi su un caso reale.
3. **Una giornata in tre momenti.** Apertura, metà seduta, chiusura: tre inquadrature dello stesso grafico, una sola variabile che cambia.

Regole di tensione senza sensazionalismo: la tensione viene da una domanda vera (perché lo stesso supporto ha avuto due esiti?), mai da promesse di guadagno. Si usano numeri di movimento (punti), mai di profitto.

## Fase D · Motion graphics: cosa ho cambiato nel motore

Il motore resta quello (HTML Canvas, Playwright, FFmpeg, 60 fps). Modifiche introdotte il 23 ottobre:

| Ambito | Modifica | File |
|---|---|---|
| Gerarchia | `VW.focusBegin(k, dim, blur)` e `VW.focusEnd()`: il contesto si attenua e va fuori fuoco | vw_core.js |
| Camera | `VW.camAtLoom`: avvicinamento continuo dentro ogni inquadratura, al posto delle inquadrature ferme | vw_core.js |
| Sottotitoli | Le parole chiave accettano un colore per parola (`Map` al posto di `Set`) | vw_core.js |
| Tipografia | Assi da 22 a 26 px, etichetta CVD da 24 a 30 px, etichette dei livelli da 24 a 30, muri da 22 a 26, barra comandi da 20 a 22. Tolta la sottoetichetta da 19 px, che resta solo durante la spiegazione | vw_chart.js |
| Hook | Il primo hook è già sul fotogramma 0. Il loop lo ridisegna alla fine, così il loop resta perfetto | scene |
| P01 parte finale | La camera non resta più ferma per 7 secondi: si avvicina ai block print, poi ai muri, poi si allarga sulla barra comandi | scene P01 |
| P02 | Pannello inattivo attenuato e fuori fuoco, pannello attivo in leggero avvicinamento, legenda da 4 voci minuscole a 2 righe leggibili | scene P02 |

Ancora da fare, in ordine di valore:
1. Candele che si formano con il wick prima del corpo, a 60 fps (oggi crescono insieme).
2. Una transizione «da un grafico all'altro» che conservi la linea del prezzo come filo continuo.
3. Cache dei livelli statici, che oggi vengono ridisegnati a ogni fotogramma: il render con il fuori fuoco ora è circa 3 volte più lento.

## Fase E · Identità audio

| Elemento | Regola |
|---|---|
| Voce | Matthew (HeyGen), velocità 1.0, pause 0,3-0,5 s tra le frasi, 0,4 s dopo l'hook. Per pubblicare serve un piano a pagamento con uso commerciale |
| Ritmo | Hook entro 1 s, una frase di valore entro 3 s, durata 25-40 s |
| Musica | Nessun brano di terzi: un tappeto grave sintetizzato in casa (55-220 Hz) che sale sulla rivelazione e si abbassa sotto la voce. Nessuna licenza da gestire |
| Effetti | Da 3 a 5 per video, solo sui momenti di contatto (hook, rivelazione, block print, muri). Niente laser o suoni da videogioco: tick, ping di vetro, colpi bassi morbidi |
| Sonic logo | **Nuovo**: sub da 55 Hz più tre note di vetro (Mi5, Si5, Mi6) sul lampo del logo. Identico su ogni video: è l'unico elemento audio con evidenza misurata sul ricordo del brand |
| Licenze | Tutti i suoni sono generati dal nostro codice, quindi nessuna licenza da gestire. La voce HeyGen gratuita non è commerciale |

## Fase F · Standard di qualità da 0 a 100

**Due cancelli prima del punteggio.** Se uno dei due fallisce, il video non si approva qualunque sia il punteggio:
1. **Correttezza tecnica.** Ogni frase con la sua etichetta O/M/H/I come da CE_13, coerente con CE_06. Nessuna previsione e nessun profitto.
2. **Comprensione.** I cinque sì del controllo di chiarezza di CE_13.

| Categoria | Punti | Cosa si guarda |
|---|---|---|
| Visual quality | 15 | Protagonista unico, focus, luce, nessun elemento sovrapposto o tagliato |
| Educational clarity | 15 | Primo valore entro 3 s, un'idea sola, i termini spiegati |
| Narrative strength | 15 | Hook con tensione vera, payoff chiaro, ritmo senza tempi morti oltre 3 s |
| Technical accuracy | 15 | Dati coerenti, limite detto, linguaggio da CE_06 |
| Audio quality | 10 | −14 LUFS, voce sopra tutto, effetti sincronizzati, sonic logo |
| Mobile readability | 10 | Nulla sotto i 26 px che debba essere letto, zone sicure rispettate, test a 420 px |
| Brand consistency | 10 | Logo, palette, tipografia, finale e sonic logo identici |
| Replay potential | 10 | Loop perfetto, fotogramma 0 = ultimo fotogramma con l'hook, un dettaglio che si coglie solo alla seconda visione |

Soglie: **85 o più** si pubblica; **75-84** si corregge e si riguarda; **sotto 75** si rifà.

## Fase G · Applicazione ai piloti

**P01.** Power l'ha approvato nella v10, quindi resta così. Le modifiche al motore (fuori fuoco, camera nella parte finale, testi più grandi, sottotitoli colorati, sonic logo) sono pronte per i prossimi video, ma non sono state applicate al P01 pubblicato.

**P02, v1 → v2.** Punteggio con la checklist di Fase F. È una mia valutazione sui fotogrammi: l'audio non l'ho ascoltato, ho misurato solo i livelli.

| Categoria | v1 | v2 | Cosa è cambiato |
|---|---|---|---|
| Visual quality (15) | 11 | 13 | Pannello inattivo attenuato e fuori fuoco, pannello attivo in leggero avvicinamento |
| Educational clarity (15) | 12 | 13 | Legenda finale da 4 voci minuscole a 2 righe (gamma lunga frena, gamma corta accelera) |
| Narrative strength (15) | 12 | 12 | Stesso copione: la voce non è cambiata |
| Technical accuracy (15) | 14 | 14 | Invariata, già verificata da un revisore indipendente |
| Audio quality (10) | 7 | 8 | Sonic logo fisso, −14,5 LUFS |
| Mobile readability (10) | 6 | 9 | Tutte le etichette da leggere a 24 px o più; i valori dei muri accorciati (+$14M, −$22M) |
| Brand consistency (10) | 8 | 9 | Logo, palette, sonic logo, colori dei sottotitoli coerenti |
| Replay potential (10) | 7 | 9 | «TWO SUPPORTS.» già al fotogramma 0 e ridisegnato a fine loop: ultimo fotogramma uguale al primo |
| **Totale** | **77** | **87** | Supera la soglia di pubblicazione (85) |

I due cancelli (correttezza tecnica e comprensione) sono superati in entrambe le versioni.

Limiti che restano sul P02: i due pannelli sono più piccoli del pannello unico del P01 (scelta voluta per il confronto); il ritmo è veloce perché la voce dura 22 secondi; l'hook parlato non è stato rifatto per mancanza di minuti voce. Con l'upgrade di HeyGen l'hook proposto è «Two supports. Same chart. One held, one collapsed. The difference wasn't on the chart.».
