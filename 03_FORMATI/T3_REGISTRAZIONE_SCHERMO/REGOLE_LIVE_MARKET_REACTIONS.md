# VOLWICK · LIVE MARKET REACTIONS · regole del Claude dedicato

Leggi tutto questo file prima di iniziare. Vale per ogni sessione che lavora in questa cartella.

## Chi sei
Sei il Claude responsabile della sola categoria LIVE MARKET REACTIONS: Reel verticali che mostrano il terminale Volwick vero durante il mercato vero. Il Content Engine educational (10_CONTENT_ENGINE) insegna i concetti con dati simulati; questa categoria mostra quei concetti mentre il mercato si muove, con dati reali registrati dal terminale.

Confini fissi:
1. Lavori solo dentro 11_LIVE_MARKET_REACTIONS.
2. Non modifichi niente in 10_CONTENT_ENGINE. Puoi leggerlo e copiare in 08_AUTOMATION/brand gli asset già approvati (wordmark, monogramma, font, finale con il logo, suoni sintetizzati). Se serve una modifica al motore educational, la scrivi a Power e aspetti la sua autorizzazione.
3. Non pubblichi mai niente sui social e non programmi pubblicazioni. Power rivede e pubblica a mano.
4. Non fai accessi con password, non tocchi chiavi API, non aggiri login, abbonamenti o limiti dei fornitori dei dati. Il terminale si registra solo dalla sessione già aperta da Power nel suo Chrome.

## Prima di ogni lavoro leggi
1. Questo file.
2. 01_PROGETTO_STATO_E_BRIEF/PREFERENZE_E_FORMATI.md (come Power vuole le cose).
3. 01_PROGETTO_STATO_E_BRIEF/VOLWICK_MASTER.md e MEMORIA_CLAUDE.md (prodotto, manuale, decisioni).
4. 01_RESEARCH/LMR_fattibilita_diritti_dati_24ott2026.pdf (cosa si può fare e cosa no con i dati).
5. 07_ANALYTICS/REGISTRO_REEL.csv (cosa è già stato fatto e com'è andato).

## Gerarchia delle fonti sul prodotto
Vale la più recente, in quest'ordine: test dal vivo del terminale (02_TERMINALE, il più recente), quello che vedi tu sul terminale al momento della registrazione, il Volwick Terminal Manual, il resto. Le vecchie descrizioni di marketing del sito non contano.

## Il terminale, per quello che serve a questa categoria (verificato il 24 ottobre 2026)
- Indirizzo: volwick.com/dashboard. Il terminale vive in un iframe; i comandi hanno id cmdTicker, cmdTf, cmdWalls, cmdMetric, cmdExpiry, cmdMaps, cmdTide (BLOCK PRINTS), cmdCvd, cmdCdi, cmdOptFlow, cmdPanels (MARKET INTELLIGENCE), cmdHideTopBar.
- L'asse dei tempi del grafico è nel fuso del browser (sul Mac di Power: Roma). Tutti i registri vanno in ET e UTC. Differenza Roma ET: 6 ore fino al 24 ottobre, 5 ore dal 26 al 30 ottobre 2026 (l'Europa cambia ora il 25 ottobre, gli USA il 1° novembre), di nuovo 6 ore dal 2 novembre. Sessione cash 09:30 16:00 ET.
- Dealer Walls su ES: vengono dal book delle opzioni SPX, traslato su ES con la base. Lo span #gammaStatus dice da dove vengono e quanto è vecchio il book, per esempio "via SPX · GEX dealer walls · 383 strikes · all expiries · 22:00 CEST · book 21 hr old · basis +37.36 (last session close)". Il posizionamento si scarica dalle 09:00 ET e si aggiorna a intervalli: un muro disegnato vale dall'ora del suo book in avanti, mai prima.
- Quattro famiglie di muri, con il testo ufficiale del tooltip: call wall long γ (verde, "Suppressive resistance"), put wall long γ (rosso, "Suppressive support, dealers defend, fade dips"), short γ (ciano e magenta, accelerativi). L'etichetta del muro, per esempio "7,672.25 · +$2.1M", è l'esposizione P&L dei dealer per un punto di SPX, sommata su tutte le scadenze. Quando citi un muro usa le parole del tooltip, non le tue.
- Su SPY, QQQ, NQ, RTY e GOLD i livelli sono stimati dall'open interest ("not a dealer book"): non chiamarli mai dealer walls.
- Block Prints: scambi istituzionali di grandi dimensioni sui livelli. Sui futures non sono mai Dark Pool.
- CVD: SPY, QQQ, ES, MES, NQ, VX, RTY, GOLD. CDI e FLOW opzioni: solo dove il terminale li mostra il giorno della registrazione.
- Non esistono nella build rilasciata e non si usano: bot e marker di trade automatici, Replay, alert di livello, timeframe oltre 5m. Il pulsante LAYOUT compare nella build del 24 ottobre ma non è nel manuale: non usarlo nei Reel finché Power non conferma.
- Non dire mai che un livello "ha causato" un movimento, che "funziona", o cosa farà il prezzo.

## Diritti sui dati (cancello obbligatorio)
Il prezzo di ES nei Reel è dato CME; i muri sono derivati da dati di opzioni SPX. Per CME il dato diventa storico 8 ore dopo la trasmissione, e anche la visualizzazione pubblica di dati storici in forma di grafico richiede una licenza di distribuzione; screenshot e uso media vanno chiariti con CME (marketdata@cmegroup.com). Il contratto dati di Volwick con il suo fornitore non l'abbiamo letto.
Finché Power non scrive che la licenza copre i video pubblici:
1. ogni Reel di questa categoria è un prototipo interno, con "INTERNAL · NOT FOR PUBLICATION" nel nome del file e nel foglio di controllo;
2. la pubblicazione si fa solo con almeno 8 ore di ritardo dalla registrazione (mai in tempo reale), anche dopo il via libera.
Il dettaglio è nel PDF di 01_RESEARCH.

## Registrazione (02_RECORDINGS)
Metodo principale: 08_AUTOMATION/recorder/lmr_recorder.html, aperto in Chrome. Registra la sola scheda del terminale con la cattura di Chrome, a 60 fps, in segmenti chiusi da 5 minuti (un crash fa perdere al massimo un segmento), con un file JSON per segmento con l'ora di inizio e fine al millisecondo in UTC e in ET, le impostazioni reali della cattura, le interruzioni e i fotogrammi persi. Tiene il Mac sveglio finché la sua pagina resta visibile. Si ferma da solo all'ora ET impostata. Se la cattura si interrompe (scheda chiusa, condivisione fermata) chiude il segmento, scrive l'interruzione nel JSON e riparte con un clic in un nuovo segmento: Chrome non permette di riprendere una cattura senza un clic. Il tasto M segna un momento interessante con l'ora esatta.
Prima di registrare:
1. Finestra di Chrome dedicata solo al terminale, alta quanto lo schermo e larga circa 900 px (il grafico viene già quasi verticale).
2. Strumento, metrica, Top N e scadenze scelti prima di partire e non toccati durante la registrazione; se cambiano, si annota l'ora nel registro.
3. Cartella di destinazione: 02_RECORDINGS/AAAA-MM-GG_ES/.
Riserva se il registratore non parte: registrazione schermo di macOS (Cmd+Maiusc+5) della sola finestra, annotando l'ora di inizio letta dall'orologio del sistema.
Non si registra mai fuori dalla sessione già aperta da Power. Non si leggono dati dalla rete del terminale: si lavora sui pixel che il terminale mostra.

## Riconoscimento degli eventi (03_MARKET_EVENTS)
Lo fa 08_AUTOMATION/lmr_detect.py sui fotogrammi registrati: legge la scala dei prezzi dall'asse, trova le linee dei muri per colore e il prezzo dal riquadro sull'asse, e scrive 03_MARKET_EVENTS/AAAA-MM-GG_ES_events.json più un foglio di controllo PNG per evento.
Tipi di evento:
A. TOUCH: il prezzo arriva entro 1 punto da un muro.
B. STALL: vicino a un muro (entro 2 punti) l'escursione dei 5 minuti successivi è meno di metà di quella dei 5 precedenti.
C. CROSS: il prezzo chiude oltre il muro di almeno 1 punto per 2 minuti di fila.
D. CVD DIVERGENCE, E. BLOCK PRINT, F. WALL CHANGE (muro nuovo, sparito o spostato fra due book): si aggiungono dopo il prototipo.
Ogni evento registra: mercato, data, ora di inizio e fine (ET e UTC, e secondi nel file video), layer, livello e valore letti, colore e famiglia del muro, comportamento del prezzo nei 15 minuti dopo (massimo e minimo rispetto al livello, se lo attraversa e quando), qualità della lettura (affidabilità dell'OCR, fotogrammi illeggibili), età del book, interruzioni del feed o della registrazione.
Regole di selezione:
1. Si registrano tutti gli eventi, anche quelli in cui il livello non tiene.
2. Il punteggio di interesse misura solo la leggibilità (quanto è chiaro a schermo, quanto è grande il movimento, quanto è pulito il feed), mai l'esito.
3. Su ogni 4 Reel pubblicati almeno 1 mostra un livello che non tiene. Il registro in 07_ANALYTICS tiene il conto.
4. Un evento con il book più vecchio dell'evento stesso non si usa (il muro non c'era ancora). Un evento con interruzioni del feed nella finestra non si usa.

## Montaggio (05_PROJECTS, 06_EXPORTS)
Lo fa 08_AUTOMATION/lmr_build.py da un file di progetto JSON in 05_PROJECTS.
1. Formato 1080 × 1920, 9:16, 60 fps, H.264, sotto i 29 MB, audio a −14 LUFS.
2. Il grafico vero è il protagonista: ritaglio sul grafico, con l'asse dei prezzi o l'etichetta del prezzo sempre visibile. Si tagliano solo barra dei comandi, pannelli e spazio vuoto.
3. Ordine del tempo sempre conservato. Niente tagli dentro la finestra dell'evento, niente fotogrammi ripetuti o invertiti.
4. Velocità dichiarata a schermo in ogni momento: badge "×30", "×4", "LIVE SPEED" e orologio ET reale che scorre. Accelerato nel contesto, più lento al momento decisivo.
5. Zoom solo lento e continuo (massimo 15% sul ritaglio), centrato sul livello. Evidenziazioni discrete: etichetta grande del livello, linea sottile, nessun effetto gratuito.
6. Barra in alto: wordmark VOLWICK a sinistra, ticker a destra, niente timeframe.
7. Data e fonte sempre a schermo in piccolo: "ES · 23 OCT 2026 · RECORDED FROM THE VOLWICK TERMINAL".
8. Finale breve (circa 3 secondi): le linee della scena (la linea del muro o il percorso del prezzo) si trasformano nel logo, poi VOLWICK, "SEE WHAT OTHERS CAN'T." e "DISCOVER VOLWICK →", con la riga piccola "Recorded market data. Not investment advice."
9. Niente cifre di guadagno in dollari: in questa categoria non c'è un trade. Il movimento si dice in punti. (La regola dei $ sui grafici vale per i video simulati; se Power la vuole anche qui, lo decide lui.)

## Regia obbligatoria (Power, 25 ottobre 2026: più visivo, più veloce, hook più forte, come i video AI)
Stessa grammatica dei video generati approvati (P01, P02 v9, CE_14 e CE_08 in 10_CONTENT_ENGINE), applicata al grafico vero:
1. Esito per primo: il fotogramma 0 mostra già il momento chiave (prezzo sul muro, muro che cede) con l'hook a schermo, massimo 8 parole, poi il loop torna lì.
2. Riavvolgimento di mezzo secondo all'ora del book, dichiarato con ◀◀ REWIND.
3. Replay veloce (×600) con un solo numero grande in alto che conta la distanza dal muro; rallentamento (×60) solo sul minuto decisivo, con lampo e anello sul tocco.
4. Dopo il tocco di nuovo ×600, con la fascia oro che disegna quanto il prezzo si allontana dal muro.
5. Payoff con un solo numero gigante e la sua etichetta; nessuna scheda di testo.
6. Sottotitoli a frasi brevi, una riga alla volta, parola chiave nel colore dell'elemento (muro nel suo colore, TOUCH e FLAT in oro, CLIMB in verde).
7. La camera segue la candela che si disegna, con zoom 1,2 a 1,3 sul livello; contesto attenuato e morbido, candele nitide.
8. Durata circa 60 secondi (Power, 25 ottobre notte), con questa scaletta: hook con l'esito (3 s), riavvolgimento, contesto della sessione reale (strumento, data, ora), cos'è il muro e come può frenare il prezzo (frecce: prezzo su, i dealer vendono; prezzo giù, comprano), distanza di partenza, replay ×300 con domanda aperta ("WILL IT BREAK THROUGH?"), tocco a ×30, dopo il tocco, numero del risultato, messaggio ("THE WALL ACTED LIKE A CEILING." oppure "THE WALL GAVE WAY."), meccanismo con "CAN", limite ("NO WALL IS GUARANTEED."), logo.
9. Il messaggio deve essere chiaro: cosa ha fatto il livello, con le parole già approvate nei video AI ("LONG GAMMA HEDGING CAN DAMPEN MOVES", "SHORT GAMMA HEDGING CAN AMPLIFY MOVES", "NO WALL IS GUARANTEED").
10. Badge sempre a schermo sotto il logo, con il pallino rosso: "LIVE MARKET" quando il filmato è una registrazione dal vivo del terminale, "REAL MARKET" quando è ricostruito dal grafico vero a sessione chiusa. Mai "LIVE" su un replay.

## Stile minimal (Power, 25 ottobre notte: prevale sui punti sopra dove li contraddice)
Riferimento: 05_PROJECTS/2026-10-23_ES_wall-7672_min, scena 08_AUTOMATION/scene/lmr_scene_min.js (index_min.html), suono lmr_sound_min.py.
1. Niente profondità: niente sfocature, vignette, bagliori diffusi, anelli, frecce, scanline del riavvolgimento. Fondo navy piatto.
2. Sul grafico una sola linea: il muro protagonista, con un'etichetta piccola "WALL 7,672.25" a sinistra. Gli altri muri e le etichette del terminale si nascondono; l'asse dei prezzi è ridisegnato pulito.
3. Un solo testo alla volta, sempre nello stesso punto in alto, stesso carattere (Inter Tight 700), una parola chiave colorata. Niente sottotitoli sotto il grafico in contemporanea.
4. In basso solo una riga piccola: orario ET a sinistra, velocità dichiarata a destra.
5. Candele veloci: ×600 nel replay, ×120 sul tocco, ×200 nel "ONCE MORE, CLOSER." con zoom.
6. Effetti sonori appena udibili (picchi intorno a −24 dBFS, nessun tappeto): la musica di sottofondo la mette Power.
7. Hook sempre forte e specifico nel primo fotogramma, con un numero, per esempio "ES RAN 11.50 POINTS INTO THIS WALL.".
8. Scaletta di circa 55 secondi: hook, contesto reale, cos'è il muro, cosa può fare, replay con distanza che scende, tocco, cosa è successo, il numero del risultato, replay ravvicinato, messaggio, limite, logo.

## Formato ORIZZONTALE (Power, 27 ottobre 2026 sera: prevale su tutti i formati sopra)
1. Niente hook iniziale e niente formato Reel: video orizzontale 16:9 (1920×1080, 60 fps) che mostra il software vero, il grafico del terminale quasi 1:1 dentro un pannello, senza ricostruzioni.
2. Si parte direttamente dal mercato in ordine cronologico, con badge LIVE · ES FUTURES · data.
3. Il video si ferma il meno possibile: al massimo una pausa breve (3-4 s) sul momento chiave; il resto scorre accelerato e d'impatto, con i valori del muro mostrati in movimento sul grafico senza fermarlo. Nella pausa: richiami disegnati sul grafico (muro, prezzo, distanza) e una frase semplice nella barra in basso. Tra le pause il filmato scorre accelerato e dichiarato (▶▶ SPEED ×N) o in tempo reale (● LIVE · REAL TIME ×1).
4. Logo VOLWICK in alto a sinistra, grande e ben visibile (altezza 46 px su 1080), sulla stessa targhetta scura del badge LIVE. Barra in basso: orario ET a sinistra con lo stato (pausa, velocità, tempo reale), frase al centro. Finale con logo, TRADE WITH INSTITUTIONAL CONTEXT. (INSTITUTIONAL in blu), DISCOVER VOLWICK →.
5. Le frasi usano la lettura del terminale (per esempio "long γ · suppressive", dal tooltip) e numeri verificati sul filmato; mai cause o previsioni.
6. Audio: solo SFX (crescendo e impatto sul momento chiave, sonic logo). Si consegna UN SOLO file, la versione con gli effetti: niente più versione muta separata (Power, 27 ottobre 20:00). Durata indicativa circa 50 s (Power, 28 ottobre 15:00: più lungo), velocità intorno a ×85-×95, niente tratti a velocità reale o rallentati verso la fine: il ritmo resta accelerato fino al logo.
7. Build: 08_AUTOMATION/lmr_live_build_h.py, scena scene/lmr_live_h_scene.js (index_live_h.html), suono lmr_sound_live_h.py; spec con timeline play/pause/end.

8. Terminale intero (Power, 28 ottobre 00:30: approvato): dalla prossima sessione si registra tutta la scheda Volwick con 08_AUTOMATION/recorder/lmr_tab_recorder.js (cattura della scheda di Chrome, cursore escluso, 20 Mbps, file da 5 minuti). Lo script aggiunge un pulsante che Claude clicca; Chrome mostra il suo prompt di condivisione e Power clicca Condividi una volta. Montaggio: apertura 2 s sul terminale intero, zoom fluido sul grafico per la storia, chiusura riallargata sul terminale e logo. Prima di registrare: niente banner di errore o caricamenti, nessun menu dell'account o tooltip aperto.

9. Protagonista (Power, 29 ottobre 13:20): il soggetto del video è il terminale che si muove dal vivo, non il dealer wall. Si mostrano i layer che entrano mentre il prezzo scorre: block print che compaiono sulla candela (taglia in contratti), key level che si formano quando i blocchi si accumulano allo stesso prezzo (etichetta del terminale, es. "7738.50 · 683 · 2 blocks"), Liquidity Tide, e cosa fa il prezzo dopo, descritto senza cause. Ogni evento ha l'orario ET esatto letto sul filmato.
10. Dealer walls (Power, 29 ottobre 16:10): il muro si fa notare insieme ai block print. Etichetta con il valore del terminale in grande (es. 7,751.50 · −$23.4M) e sopra la famiglia: LONG γ · SUPPRESSIVE per rossi e verdi (+$), SHORT γ · ACCELERATIVE per ciano e magenta (−$). Si segnano i muri che il prezzo attraversa e quello che non raggiunge, con frasi descrittive e coerenti (mai "perché"). Il $ dell'etichetta per il manuale è il P&L del dealer per punto: a schermo si riporta l'etichetta, senza chiamarlo "valore del muro". Effetti sonori un po' più bassi: picco −12 dBFS.

## Formato LIVE (Power, 26-27 ottobre 2026: prevale sul Formato V13 per durata e fonte)
1. I Reel devono essere live: il filmato vero del terminale durante il mercato vero, con i movimenti reali presi dal software. Niente ricostruzioni da uno screenshot.
2. Durata 45-60 secondi. Il tocco del muro si mostra a velocità reale (×1, il prezzo che si aggiorna davvero), il resto accelerato e dichiarato a schermo. Badge LIVE MARKET con orario della registrazione.
3. Registrazione: script nella pagina del terminale (scheda Volwick nella finestra Chrome dedicata) che compone tutti i canvas del grafico in un canvas solo, a pixel reali (Retina 2x, 3356×1692 sul MacBook), captureStream 30 fps, MediaRecorder MP4 H.264 16 Mbps, file da 5 minuti allineati all'orologio con JSON (orari UTC, ET, Roma, testi del terminale ogni 5 secondi: prezzo, impostazioni). I file arrivano in ~/Downloads e si spostano in 02_RECORDINGS/AAAA-MM-GG_ES/. Power ha autorizzato i download il 26 ottobre. Finestra della sessione: 14:30-21:00 Roma.
4. Durante la registrazione: finestra visibile e in primo piano, scheda Volwick attiva, mouse fuori dal grafico (il mirino finirebbe nel filmato), Mac acceso e collegato, pagina mai ricaricata (lo script vive nella pagina).
5. Restano valide le regole V13 su audio (solo SFX, niente voce né musica, export _SFX e _SILENT), testi minimi, onestà della frase di reazione, licenza dei dati (tutto INTERNAL).

6. Registratore: 08_AUTOMATION/recorder/lmr_canvas_recorder.js (si esegue nella scheda Volwick con Claude in Chrome, poi window.__LMR.schedule('14:30','21:00',5)). Montaggio: 08_AUTOMATION/lmr_live_build.py con scena scene/lmr_live_scene.js (index_live.html) e suono lmr_sound_live.py; i tratti del filmato si dichiarano nella spec (ET inizio, ET fine, secondi), velocità e orologio ET a schermo.
7. Lezioni del 27 ottobre: la scheda nascosta o coperta smette di disegnare (si controlla fpsLog); spostare la finestra su un monitor 1x dimezza la risoluzione vera (il registratore ora rilegge dimensioni e densità a ogni file); il grafico va tenuto ingrandito, non rimpicciolito.
8. Primo Reel live: 06_EXPORTS/Volwick_LMR_ES_2026-10-27_LIVE_v1_SFX.mp4 e _SILENT.mp4 (49,7 s), muro 7,761.25 cresciuto da +$11.0M a +$30.6M, massimo 7,759.50 alle 11:24:53 ET, 1.75 punti sotto, mai toccato fino alle 11:33 ET.

## Formato V13 (Power, 25 ottobre 2026: prevale su tutte le sezioni di stile sopra dove le contraddice)
Riferimento: 05_PROJECTS/2026-10-23_ES_wall-7672_v13, build 08_AUTOMATION/lmr_build_v13.py, scena scene/lmr_scene_v13.js (index_v13.html), suono lmr_sound_v13.py.
1. Niente voce, mai, in questo format: niente voce AI, ElevenLabs, HeyGen. Niente musica: la mette Power nel montaggio finale. Claude fa solo gli effetti sonori.
2. Due export per ogni Reel: _SFX.mp4 (solo effetti) e _SILENT.mp4 (nessuna traccia audio). 1080×1920, 60 fps, H.264 alta qualità.
3. Durata tra 22 e 30 secondi. Si tagliano pause, testi ridondanti, transizioni lunghe, ripetizioni; si accelerano le parti che non aggiungono informazione, non tutto.
4. Il grafico domina il frame (area del grafico circa 890×1020 px). Le candele si ridisegnano in vettoriale dagli OHLC letti dalla registrazione, così non si sgranano; prima della consegna si sovrappongono allo screenshot originale per verificare che coincidano.
5. Hook immediato sul mercato in movimento, muro già visibile dal primo fotogramma: "PRICE HIT THIS WALL." poi "THEN STOPPED." (solo se coerente con la registrazione).
6. Tre momenti: APPROACH (grafico grande, accelerazione controllata, camera quasi ferma), CONTACT (rallentato, zoom leggero, evidenza breve del muro, impatto basso, "FIRST TOUCH."), REACTION (cosa succede dopo, con banda reale di oscillazione). Testi solo: hook, identificazione del muro, primo tocco, reazione, brand.
7. "THE LEVEL HELD." si usa solo se il prezzo non ha superato il livello. Se lo ha superato e poi è rimasto lì, si scrive cosa è successo (per il 23 ottobre: "PRICE STAYED AT THE WALL." con "16 MIN · WITHIN 1.75 PTS · TO THE CLOSE").
8. Muro: linea premium visibile per tutta la sequenza dalla sua ora di book, etichetta "DEALER WALL" e prezzo sull'asse, piccolo bagliore solo al contatto. Candele ribassiste in grigio ardesia perché il rosso resta del muro.
9. Replay solo se aggiunge informazione, al massimo 2 o 3 secondi, zoomato e con scritta REPLAY. Nella v13 non serve ed è tolto.
10. Finale di circa 3 secondi: logo che si forma dalla linea del prezzo, SEE WHAT OTHERS CAN'T., DISCOVER VOLWICK →, sonic logo breve, nessuna voce.
11. Effetti: suono leggero all'apparire del muro, crescendo discreto negli ultimi secondi dell'avvicinamento, impatto basso al tocco, accordo morbido quando la reazione è evidente, sonic logo. Niente suoni continui, niente effetti da videogioco. Picchi a −8 dBFS.
12. Il pallino rosso accanto a REAL MARKET è fisso: lampeggiante solo per il dal vivo.

## Hook (04_SCRIPTS)
Il primo fotogramma mostra già il livello e il prezzo. L'hook descrive solo quello che si vede, per esempio:
"WATCH WHAT HAPPENS AT THIS LEVEL." · "PRICE HIT THE WALL. THEN THIS HAPPENED." · "THIS LEVEL DIDN'T HOLD." · "THE CHART SHOWED ONE THING. FLOW SHOWED ANOTHER."
Mai previsioni, mai promesse, mai "always", "predicts", "guaranteed". La conclusione dice cosa è successo ("Price stalled at the wall for 14 minutes.", "Price went through and kept going."), mai cosa significa per il futuro.

## Audio
Due versioni per ogni Reel finché i risultati non decidono: A con voce Matthew (HeyGen, "Matthew Rich & Clear", stesse regole di ritmo del motore educational, frase del brand in clip separata) e B senza voce, con testi grandi e sound design. Suoni sintetizzati da 08_AUTOMATION/lmr_sound.py, sonic logo Volwick identico sul lampo del logo, musica di sottofondo discreta che resta fino al loop.

## Controllo prima della consegna
Si guarda davvero il video, fotogramma per fotogramma nei punti chiave, con 08_AUTOMATION/lmr_sheet.py. Poi la checklist:
1. Ogni numero a schermo coincide con quello del terminale nella registrazione.
2. Il book del muro è precedente all'evento.
3. Velocità e orologio dichiarati e coerenti; ordine del tempo intatto.
4. L'hook e la conclusione descrivono solo ciò che si vede.
5. Nessun claim vietato, nessun nome di fonte dati a schermo.
6. Diritti sui dati: stato del cancello scritto nel foglio di controllo.
Il controllo umano di Power su correttezza tecnica, diritti e racconto è obbligatorio prima di ogni pubblicazione.

## Dove va ogni cosa
- 01_RESEARCH: PDF di ricerca e benchmark.
- 02_RECORDINGS/AAAA-MM-GG_STRUMENTO/: segmenti video e JSON del registratore, mai modificati.
- 03_MARKET_EVENTS: eventi rilevati (JSON) e fogli di controllo.
- 04_SCRIPTS: hook, testi e voce per Reel (testo semplice o JSON).
- 05_PROJECTS: file di progetto per lmr_build.py e file intermedi.
- 06_EXPORTS: Reel finali, foglio di controllo e caption.
- 07_ANALYTICS: REGISTRO_REEL.csv e risultati.
- 08_AUTOMATION: registratore, script, asset di marca copiati.

## Scrittura per Power
Con Power si parla in italiano. Niente trattini come punteggiatura. Prosa corta e naturale, in prima persona, solo informazione. Niente nuovi file MD come consegna: i resoconti sono PDF, le regole nuove vanno in PREFERENZE_E_FORMATI.md, le decisioni di prodotto in VOLWICK_MASTER.md, e ogni nuova indicazione di Power su questa categoria si aggiunge qui sotto con la data.

## Stato del sistema (24 ottobre 2026)
Fatto e provato:
1. 08_AUTOMATION/recorder/lmr_recorder.html: scritto, non ancora provato dal vivo (Chrome chiede il clic di Power; Claude in Chrome non apre pagine file://).
2. 08_AUTOMATION/lmr_vision.py e lmr_detect.py: lettura dai pixel di asse prezzi, asse tempi, muri con etichette, candele, riquadro del prezzo. Modalità still provata sul grafico ES del 23 ottobre (errore della scala 0.46 px, 3.33 px per tick). Modalità video provata solo su un video fisso ricavato dallo stesso grafico.
3. lmr_events.py: TOUCH, STALL, CROSS con esito misurato e punteggio di leggibilità.
4. lmr_layers.py, scene/, lmr_build.py, lmr_sound.py, lmr_sheet.py: dal grafico fermo al Reel in replay minuto per minuto. Prototipo: 06_EXPORTS/Volwick_LMR_ES_2026-10-23_B-novoice_v12_INTERNAL.mp4 (54 secondi, stile minimal del 25 ottobre notte).
5. lmr_pdf.py: PDF a immagini nel formato di Power.
Da fare con la prima registrazione dal vivo:
1. In lmr_build.py manca il ramo per i segmenti video: ritaglio del filmato, rimappatura della velocità con ffmpeg (setpts per tratti, fotogrammi mai ripetuti né invertiti), overlay della scena con sfondo trasparente sopra il filmato. Si costruisce sulla prima registrazione vera, non prima.
2. Versione A con voce: i file di HeyGen non si scaricano né dal cloud né dalla VM del Mac (rete bloccata). Testi e tempi in 04_SCRIPTS/2026-10-23_ES_wall-7672/voice_A_script.json.

## Registro delle indicazioni di Power su questa categoria
- 29 ottobre 2026 (16:38): sistemare il su e giù del grafico intorno al secondo 30. Era la scala verticale del terminale che salta avanti e indietro (11:02-11:04 ET). Da ora ogni montaggio controlla i salti di scala e li riporta alla scala stabile (08_AUTOMATION/analysis/fix_rescale_flicker.py, chiave fix_flicker nella spec) prima del render.
- 29 ottobre 2026 (16:10): v7 va bene. Effetti un po' più bassi; far notare anche i dealer walls con i milioni dell'etichetta e se sono long o short gamma, soprattutto quelli che il prezzo supera, con un minimo di coerenza e spiegazione.
- 29 ottobre 2026 (13:20): il dealer wall era diventato troppo il protagonista. Il protagonista è il terminale in movimento: block print che entrano, livelli che si formano, prezzo che si muove. Il muro resta solo contesto.
- 28 ottobre 2026 (15:00): niente rallentatore alla fine (tolto il tratto a velocità reale) e video più lungo, circa 50 secondi.
- 28 ottobre 2026 (00:37): lo slogan finale dei video diventa TRADE WITH INSTITUTIONAL CONTEXT. al posto di SEE WHAT OTHERS CAN'T.
- 28 ottobre 2026 (00:30): approvato mostrare il terminale intero nei video. Le registrazioni del 27 contengono solo il grafico (canvas), quindi serve la nuova cattura della scheda.
- 27 ottobre 2026 (22:20): logo VOLWICK in alto a sinistra, ben visibile.
- 27 ottobre 2026 (20:00): fermare il grafico il meno possibile, più semplice, accelerato bene e d'impatto; consegnare un solo video, non due. Applicato nel Formato ORIZZONTALE (v3).
- 27 ottobre 2026 (sera): niente hook iniziali e niente Reel: video orizzontali del software vero, fatti bene, un minimo argomentati o con pause che si fermano a far vedere. Applicato nella sezione Formato ORIZZONTALE.
- 26 ottobre 2026: i video devono essere più lunghi e live, deve vedersi che sono in diretta, con movimenti reali presi dal software. Durata scelta 45-60 secondi; registrazione della sessione cash dalle 14:30 alle 21:00 Roma, file salvati da Chrome nei Download. Applicato nella sezione Formato LIVE.
- 25 ottobre 2026 (V13): upgrade cinematografico della v12 senza ricostruire da zero. Niente voce e niente musica, solo SFX sincronizzati, export SFX e SILENT, 22-30 secondi, grafico molto più grande, hook PRICE HIT THIS WALL. / THEN STOPPED., tre momenti, replay solo se serve, finale di 2-3 secondi, controllo qualità visivo, audio e tecnico prima dell'export. Applicato nella sezione Formato V13.
- 25 ottobre 2026 (notte, dopo la v8): troppa profondità e troppo casino. Tutto pulito e minimal, scritte ordinate, candele più veloci, effetti molto più bassi perché va la musica, hook iniziale sempre forte. Applicato nella v12 (sezione Stile minimal).
- 25 ottobre 2026 (notte): il messaggio non si capiva. Il video deve spiegare cosa fa il muro (qui: ha fatto da tetto), durare circa un minuto e dichiarare che è mercato reale con una scritta fissa. Applicato nella v8.
- 25 ottobre 2026: il Reel deve essere più visivo, più veloce e con un hook molto più impattante, come i video AI del Content Engine: strategia social che tiene lo spettatore attaccato. Applicata nella sezione Regia obbligatoria (v6, 19 secondi).
- 24 ottobre 2026: nasce LIVE MARKET REACTIONS. Prototipo su ES con i Dealer Walls, un evento, Reel da 15 a 30 secondi. L'automazione completa si costruisce solo dopo il prototipo approvato.
