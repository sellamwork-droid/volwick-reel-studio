> REGOLAMENTO STORICO del Content Engine (formato F1). Le istruzioni valide per lavorare sono in `../CLAUDE.md` (13_REEL_STUDIO) e le regole in `../../01_PROGETTO_STATO_E_BRIEF/PREFERENZE_E_FORMATI.md`. La corsia A/B/C e la cartella lavori/ valgono solo se Power assegna le lettere.

# VOLWICK Content Engine · regole per ogni Claude

Leggi tutto questo file prima di iniziare. Vale per tutti e tre i Claude (A, B, C).

## Chi sei e cosa fai
Produci Reel verticali educativi per Volwick (terminale per dealer positioning e order flow, lancio 28 ottobre 2026). Ogni video spiega UN concetto di mercato con un grafico simulato che si muove insieme alla voce, e chiude con il logo che si forma dalla linea del prezzo.
Riferimenti approvati: scenes/p01_cvd_divergence (P01 v10, APPROVATO, non modificarlo) e scenes/p02_brake_or_fuel (P02 v3).

## Corsia di lavoro (obbligatorio)
All'avvio chiedi: "Sono il Claude A, B o C?" se non ti è stato detto.
Lavori SOLO dentro lavori/<tua lettera>/. Ogni video ha la sua cartella: lavori/A/a001_nome/, lavori/A/a002_nome/ ecc.
NON modificare engine/, tools/, assets/, fonts/, scenes/ né le cartelle degli altri. Se serve una modifica al motore, scrivila in lavori/<lettera>/RICHIESTE_MOTORE.md e continua.
Prima di scegliere il tema leggi lavori/*/REGISTRO.md di tutti: non rifare un concetto già fatto o in corso. Appena scegli un tema, aggiungi una riga al TUO REGISTRO.md (data, codice, concetto, stato).

## Pipeline di un video
1. Concetto: un solo meccanismo (es. divergenza CVD, gamma che frena o accelera, muro che cede, block print). Hook in 1,5 secondi.
2. Copione inglese 25 a 35 secondi, in script.txt. Chiusura con una CTA su Volwick, senza date.
3. Voce: HeyGen, voce "Matthew - Rich & Clear" (voice_id 4bf1363e93f1474ba653df3b4add19ed), chiave in HEYGEN_API_KEY. Salva audio come voice.wav e i tempi parola per parola come words.json. Se mancano i tempi usa tools/vw_align.py.
4. Scena: copia index.html e scene.js dal pilota più vicino e adattali. I percorsi a motore, font e asset sono assoluti (/engine/, /fonts/, /assets/), quindi funzionano da qualsiasi cartella. Gli eventi si agganciano alle parole con W(parola, n, 'e').
5. Render muto: SCENE=lavori/A/a001_nome/index.html EVENTS_OUT=lavori/A/a001_nome/events.json python tools/render.py video 60 lavori/A/a001_nome/silent.mp4
6. Suono: python tools/vw_sound.py lavori/A/a001_nome/events.json lavori/A/a001_nome/sfx.wav
7. Mix: BED=.../sfx.wav VID=.../silent.mp4 DUR=<durata> ./mix_voice.sh .../voice.wav .../Volwick_a001_nome_v1.mp4
8. Controllo: python tools/sheet.py <video> <png> 0.5,3,8,15,22,<fine> e GUARDA davvero i fotogrammi. Mai dichiarare finito un video senza averlo controllato.
9. Punteggio con la checklist 0 a 100 (CE_14 nella cartella superiore). Sotto 85 si rifà. Le porte obbligatorie sono accuratezza tecnica e comprensione.

## Standard visivi (CE_13 e CE_14)
Logo fisso in alto a sinistra. Nessuna etichetta "simulation" o "dati simulati" a schermo durante il video (solo la riga piccola di disclaimer nel finale). Niente pavimento o riflessi sotto il grafico. Testo minimo 26 px. Un solo protagonista alla volta (gli altri elementi oscurati e sfocati). Hook visibile dal primo fotogramma e ridisegnato a fine loop. Parole chiave dei sottotitoli colorate come l'elemento a cui si riferiscono. Leggera spinta della camera continua. Finale: la linea del prezzo forma il logo, poi loop.

## Compliance (non negoziabile)
Guadagno e perdita in $ sempre presenti sui grafici (decisione di Power, 24 ott 2026): 1 contratto ES = $50 a punto, arrotondato al tick (12,50 $), verde se positivo e rosso se negativo, mostrare SEMPRE anche la perdita, mai solo il guadagno. Niente percentuali di successo o promesse di risultato. Dati sempre simulati: nella caption del post va "Simulated data. Not investment advice."
MAI pubblicare sui social. MAI accessi, pagamenti o acquisti. Nessuna chiave scritta nei file o nei messaggi.

## Consegna
Video finito: lavori/<lettera>/consegne/Volwick_<codice>_<nome>_vN.mp4 più una caption.txt con testo del post e disclaimer. Aggiorna il REGISTRO.md con stato "da rivedere". Power rivede e pubblica a mano.

## Regole di ritmo della voce (decise da Power il 24 ottobre 2026)
1. Le frasi importanti hanno spazio. Prima della frase chiave (la rivelazione del hook, il payoff, la frase del brand) lascia una pausa di 0,6 a 1 secondo. Tra frasi normali bastano 0,3 a 0,4 secondi.
2. La frase del brand ("Discover Volwick.") si genera SEMPRE come clip separata e si posiziona circa 1 secondo dopo la fine della frase precedente, in sincrono con il momento in cui compare il wordmark VOLWICK nel finale.
3. Il brand si dice con calma e sicurezza: frase corta, chiusa dal punto (mai punto esclamativo), velocità 0,9 a 0,95.
4. Per la frase del brand e per il hook genera 2 o 3 prese e fai scegliere a Power quella con l'espressione migliore.
5. HeyGen accetta solo la pausa <break time="0.5s"/>: niente altri tag SSML. Il ritmo si controlla con pause, punteggiatura, clip separate e velocità.
6. Quando unisci clip, taglia solo nel silenzio (sotto circa -50 dB): mai tagliare a metà di una parola. Controlla il livello audio 0,3 secondi prima e dopo ogni taglio.
7. Niente CTA vendita esplicita in voce ("one dollar", "link in bio"): la voce chiude con valore più "Discover Volwick." Offerte e link vanno in caption.

## Barra in alto (decisa da Power il 24 ottobre 2026)
Barra superiore pulita: solo wordmark VOLWICK in alto a sinistra, grande e ben visibile (VW.logoTL(alpha, 'ES', 60, 30, true)), e solo il ticker in alto a destra. MAI il timeframe (niente "1m", "5m"). Nessuna etichetta di entrata, prezzo d'ingresso o altre scritte vicino a logo e ticker.

## Finale (decisione di Power, 24 ottobre 2026)
REGOLA FISSA: ogni video finisce SEMPRE con l'animazione in cui delle linee della scena si trasformano nel logo (VW.logoForm), mai un cartello statico al suo posto.
Le linee si prendono sempre da qualcosa che è già in scena: di norma la linea del prezzo (punti [X(i), PY(close)]); se il video non ha un grafico prezzi si usa un'altra linea presente: la linea del CVD o di un indicatore, un muro o un livello, il bordo o le righe di una tabella, una curva di esposizione. Bastano 30 a 60 punti in ordine da sinistra a destra, passati come pts a VW.logoForm. Se in scena non c'è nessuna linea, se ne disegna una (per esempio un tracciato che attraversa lo schermo nell'ultimo secondo prima del finale) e si usa quella.
Nella caption del post va sempre l'avvertenza completa CFTC 4.41 sui risultati ipotetici, perché nel video ci sono cifre in dollari.

## Standard di regia (P02 v9 APPROVATO da Power il 24 ottobre 2026: modo di operare per tutti i Reel)
Riferimento da copiare: scenes/p02_brake_or_fuel_v9 (scene.js).
1. Hook: il primo fotogramma mostra già entrambi gli scenari; l'evento chiave (rottura, divergenza) avviene esattamente sulla parola che lo nomina, con testo a schermo e impatto sonoro nello stesso fotogramma.
2. Composizione: il grafico protagonista occupa quasi tutto il centro (circa x 56 a 900, y 330 a 1520); il confronto a due grafici solo in apertura e chiusura; niente elementi decorativi per riempire.
3. Scala fissa: stesso intervallo di prezzo in tutte le inquadrature, così il livello non salta mai.
4. Transizioni: il livello resta fermo come punto di riferimento; lo scenario esce scorrendo da un lato, il nuovo entra dall'altro, la linea del livello cambia colore senza muoversi.
5. Camera: solo un push-in lento (massimo 5%) centrato sul livello decisivo; nessun altro movimento.
6. Titolo del meccanismo sopra il protagonista (es. "LONG GAMMA HEDGING / CAN DAMPEN MOVES"): prima il meccanismo, il colore è solo supporto.
7. CTA: le frasi emergono dalle linee dei livelli mentre le candele si attenuano al 30%.
8. Finale: le linee dei livelli si trasformano nel logo, in versione rapida (circa 3 secondi), poi loop sul primo fotogramma.
9. Suono: effetti solo sugli eventi (tenuta, rottura, cambio scenario, logo), discreti e istituzionali, niente effetti aggressivi.

## Schermata finale (approvata da Power, 24 ottobre 2026)
Quando appare il logo: wordmark VOLWICK, sotto "SEE WHAT OTHERS CAN'T." e poi "DISCOVER VOLWICK →" (blu), con la riga piccola del disclaimer.
In voce Matthew dice "See what others can't." mentre lo slogan si scrive (in P02 v9 "See" a logo0 + 1,62 s), poi circa 0,8 secondi di pausa e "Discover Volwick." in sincrono con la comparsa di "DISCOVER VOLWICK →" (logo0 + 3,8 s). Clip separate, velocità 0,9, 2 o 3 prese da far scegliere a Power. Loop dopo logo0 + 5,6 s.

## Controllo audio delle clip voce (lezione da P02 v9)
1. Non fidarti dei word_timestamps di HeyGen per le clip corte: misura l'inizio reale del parlato (prima finestra di 10 ms sopra -35 dB) e allinea su quello.
2. Prima di usare una presa, cerca i click: salto tra due campioni molto più grande del normale (oltre circa 8 volte la mediana locale, o sopra 0,25). Se c'è, scarta la presa e usa un'altra.
3. Il tappeto musicale deve restare sotto tutto il finale fino al loop (vw_sound.py usa loop0 per la dissolvenza), mai silenzio totale tra una frase e l'altra.

## Zona sicura a schermo intero (ricerca del 25 ottobre 2026, vale per TUTTI i video)
Instagram Reels organico copre: sopra 250 px, sotto 319, sinistra 86, destra 119 (tasti like, commenti, condividi). TikTok copre: sopra 130, sotto 484 (nome, caption, suono), sinistra 44, destra 140.
Tutto ciò che conta (logo, ticker, grafici, prezzi, etichette, cifre in $, sottotitoli, testi del finale) sta dentro VW.SAFE = x 96 a 940, y 260 a 1430. Si controlla renderizzando con "?guides=1": arancione = coperto da Instagram, azzurro = coperto da TikTok, rettangolo fucsia = zona sicura.
Valori di riferimento (scena scenes/p02_brake_or_fuel_v10_safe): logo in alto a sinistra a x 96, y 264, altezza 52; ticker allineato a x 940; titoli e hook tra y 350 e 430; grafici tra x 124 e 806 (assi e cartellino prezzo finiscono prima di x 930); grafico protagonista y 452 a 1302; due grafici y 478 a 842 e 938 a 1302; sottotitoli a y 1408 (60 px); nel finale "DISCOVER VOLWICK →" a y 1360 e disclaimer a y 1418.
Il vecchio standard (logo a y 92, sottotitoli a y 1650, grafici fino a x 900) NON va più usato: logo e sottotitoli finivano sotto i tasti.
