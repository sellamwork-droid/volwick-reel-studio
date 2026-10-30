# VOLWICK · Content Engine · Standard di qualità

23 ottobre 2026. Sei regole decise da Power dopo la Fase 2. Si applicano a ogni video e prevalgono sui documenti precedenti dove li contraddicono.

## 1. Wordmark
Niente logo fisso nell'angolo in alto a sinistra. Il wordmark VOLWICK sta piccolo e discreto dentro la zona sicura, in alto a sinistra del riquadro (x 120, y circa 294, altezza 28 px, opacità circa 60%). Nel finale il wordmark compare centrato per circa un secondo sopra l'immagine, senza card separata. Il template del motore (vw_brand.js, funzione brandBar) è già impostato così.

## 2. Tipo di dati, etichetta e disclaimer
Ogni video dichiara il proprio tipo di dati, e da quello derivano l'etichetta a schermo e il disclaimer in didascalia.

| Tipo | Quando | Etichetta a schermo, per tutto il video | Disclaimer in didascalia |
|---|---|---|---|
| **SIMULATION** | Dati generati per spiegare un concetto (oggi tutti i video) | `EDUCATIONAL SIMULATION · NOT MARKET DATA` | Educational simulation, not real market data. Not investment advice. AI voice. |
| **HISTORICAL** | Seduta reale esportata dal terminale (MARKET DECODED) | `ES · 1m · 20 NOV 2026 · HISTORICAL DATA` (strumento, timeframe, data, ora ET dei momenti citati) | Historical market data shown for education. Past market behavior does not indicate future results. Not investment advice. AI voice. |
| **HYPOTHETICAL PERFORMANCE** | Solo se un giorno si mostrano trade o risultati simulati | come HISTORICAL più `HYPOTHETICAL RESULTS` | testo in stile CFTC 4.41, vicino al dato |

Un'analisi storica che descrive cosa hanno mostrato i dati e cosa ha fatto il prezzo è HISTORICAL. Non è una performance ipotetica, perché non simula operazioni né risultati. Oggi non si producono video di performance.

## 3. Controllo di chiarezza
Prima del render si legge il copione come se non si conoscesse Volwick. Il video passa solo con cinque sì:
1. Insegna una sola idea?
2. Ogni termine tecnico è spiegato in poche parole la prima volta che compare (CVD, gamma, charm, assorbimento)?
3. L'idea è chiara entro 15 secondi?
4. Chi guarda saprebbe ripetere in una frase cosa ha imparato?
5. Si capisce tutto senza aver mai visto il terminale?

Se un punto fallisce, il concetto o si allunga (35 a 45 secondi) o si divide in due video. Non si comprime la spiegazione per stare nei 25 secondi.

## 4. Verifica tecnica
Ogni frase del copione su dealer, gamma, charm, assorbimento, CDI, flow o qualunque meccanismo riceve un'etichetta, scritta nello storyboard:

| Etichetta | Cos'è | Come va detto |
|---|---|---|
| **O · osservato** | Quello che il dato mostra a schermo | Al presente, diretto. Esempio: "CVD makes a lower high." |
| **M · modello** | Un valore calcolato o stimato | Esempio: "dealer exposure", e "estimated" quando la fonte è una stima da open interest |
| **H · ipotesi** | Il meccanismo che spiegherebbe il fenomeno | Al condizionale. Esempio: "dealers may hedge by selling into strength" |
| **I · interpretazione** | Cosa può significare per chi guarda | Con il limite. Esempio: "a reason to look closer, not a signal" |

Regole:
* Nessuna frase H o I senza condizionale o senza limite.
* Nessuna correlazione presentata come causa.
* Nessuno scenario presentato come previsione.
* Ogni frase deve essere coerente con CE_06 (knowledge base).
* Per i meccanismi complessi (gamma, charm, assorbimento) la verifica la fa un secondo controllo indipendente prima del render.

## 5. Contenuti e conversioni
Il contenuto resta educativo: nessuna call to action dentro il video oltre al wordmark finale. Le conversioni si misurano fuori dal video.

* **Link tracciati**:
  * nella bio di Instagram e TikTok, un link per serie;
  * in YouTube e X, un link per video;
  * il formato è `utm_source=<piattaforma>&utm_medium=social&utm_campaign=<serie>&utm_content=<ID video>`.
* **Quattro livelli per ogni video**, nella scheda CE_04:

| Livello | Metriche |
|---|---|
| Reach | view, watch time, skip rate |
| Interesse | visite al profilo, follow, condivisioni, salvataggi |
| Visita qualificata | sessione sul sito di almeno 30 secondi o visita alla pagina prodotto |
| Conversione | registrazioni, abbonamenti |

* **Ruolo del video**: dopo almeno 4 settimane ogni video si classifica come REACH (porta visualizzazioni) o CONVERT (porta visite qualificate e registrazioni). Il mix si decide su questo, non sulle sole view.
* **Limite**: i Reel non hanno link cliccabili, quindi l'attribuzione su Instagram è per serie e per finestra di pubblicazione, non per singolo video. È un'approssimazione e va letta come tale.

## 6. Ricalibrazione prudente
* I pesi del punteggio non cambiano prima di **12 video pubblicati per serie** e **almeno 6 settimane** di dati.
* Le analisi si fanno separate per piattaforma, per formato (serie) e per fascia di durata (sotto 30 s, 30 a 45 s, oltre 45 s), mai mescolando.
* A ogni revisione si sposta al massimo un peso, di 5 punti, e si annota il motivo in una riga.
* Un singolo video anomalo, in positivo o in negativo, non sposta nulla.
