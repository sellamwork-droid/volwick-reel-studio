# Preferenze e formati di Power

Questo è il file che impara come lavoro. Claude lo legge prima di preparare qualsiasi cosa per Volwick. Ogni volta che do una nuova indicazione, una correzione o un formato, lo aggiorna subito con la data, senza che io lo debba chiedere. Se una regola nuova contraddice una vecchia, vale la nuova e la vecchia si cancella.

Ultimo aggiornamento: 25 ottobre 2026.

## Come deve funzionare Claude con me
- **Adattarsi sempre.** Quando correggo qualcosa, la correzione vale anche per i lavori successivi dello stesso tipo, senza che la ripeta.
- **La cartella locale è la fonte.** ~/Desktop/VOLWICK si sposta sempre intera su altri computer; per i video tutto sta in 13_REEL_STUDIO (leggere 13_REEL_STUDIO/CLAUDE.md). Ogni regola, modifica al motore, video, hook o audio si aggiorna subito lì.
- **Salvare due volte.** Ogni nuova regola va scritta qui, nella cartella ~/Desktop/VOLWICK, e nel progetto VOLWICK su claude.ai (claude/volwick-preferenze-e-formati.md). Se il computer non è collegato, si salva nel progetto e la cartella si allinea alla prima occasione.
- **Decisioni di prodotto.** Prezzi, funzioni e scelte sul sito vanno anche in VOLWICK_MASTER.md.

## File e lingue
- **Niente file MD per me.** I documenti MD non mi servono mai: i lavori arrivano come PDF, HTML o nel formato che chiedo. Nella cartella restano solo i file MD del sistema (CLAUDE.md, VOLWICK_MASTER.md, questo file, INDICE.md) e non se ne creano di nuovi.
- **Prima dell'approvazione solo italiano.** Finché non approvo del tutto, mi mandi solo il file in italiano.
- **Dopo l'approvazione italiano e inglese.** Quando approvo, mi mandi il file in italiano e in inglese, e se c'è un mockup anche il mockup in italiano e in inglese.

## Scrittura
- Con me si parla in italiano. Sito, terminale e guida sono in inglese, con la versione italiana del sito.
- Niente trattini come punteggiatura.
- Prosa naturale e corta, che non sembri scritta da un'AI. Tono semplice, che non dà ordini.
- Documenti in prima persona, solo informazione: niente domande retoriche, niente morale, niente chiuse a effetto.
- Email e messaggi importanti sempre in due versioni, italiano e inglese.
- Mai promettere guadagni o direzione del mercato.

## Video della guida (episodi con Tudor)
- **Struttura di ogni episodio.** La prima frase, quella detta guardando in camera, e l'ultima parte sono solo camera: Tudor a tutto schermo, in primo piano, senza il software. In mezzo il terminale, con il riquadro di Tudor in basso a sinistra, che resta sempre.
- **Il software è quello vero.** Niente ricostruzioni: si registra volwick.com/dashboard e un regista automatico muove il cursore e clicca i controlli veri, a tempo con la voce già registrata. La voce comanda il montaggio, non il contrario.
- **Cursore bianco** con bordo scuro, grande, movimenti naturali. Nessun cursore di sistema nella ripresa.
- **Sottotitoli bianchi** che si accendono di azzurro Volwick (#5A8CFF) parola per parola mentre viene detta, in basso.
- **Voce pulita al massimo:** rete neurale contro stanza e rumore, spettro portato verso una voce normale, poi la catena "pro" del motore, −14 LUFS.
- **Inquadratura pulita:** sopra e sotto la barra del terminale una fascia scura dello stesso colore del terminale.
- **Zoom** sui comandi quando se ne parla, poi si torna larghi. Il tooltip di un muro si apre solo quando serve.
- **Registrazione:** con il mercato aperto il video intero in una sola sessione. Dove il dato non c'è il cursore non indica niente di sbagliato.
- **Il più automatico possibile.** Postazione consigliata: il Mac, con Chrome su una Scrivania normale e visibile. Il clic su Allow per condividere la scheda serve una volta per sessione.

## Messaggi a Matt
- Molto corti e dritti al punto. Se l'ho già sentito, niente saluti.
- Quello che esiste già non va presentato come un errore: si migliora insieme.
- Prima di un messaggio con un link, ricordarmi di condividere l'artifact dal menu Condividi.

## PDF per Matt
- **Lingua:** solo italiano finché non approvo; dopo l'approvazione, italiano e inglese.
- **Grafica uguale alla landing:**
  - sfondo navy #040913;
  - blu #2F6BFF e #8AB6FF;
  - font Archivo per i titoli, Instrument Sans per il testo, JetBrains Mono per le etichette.
- **Impaginazione:**
  - logo VOLWICK in alto a sinistra su ogni pagina;
  - pagine orizzontali 1600 × 1000;
  - numero pagina in alto a destra (01 / 08);
  - piè di pagina "Volwick · internal · for Matt".
- **Struttura:**
  - copertina;
  - "oggi", con lo screenshot reale e i problemi numerati;
  - una pagina per sezione, con screenshot e punti numerati;
  - stati;
  - telefono.
- **Contenuto:**
  - screenshot veri del prototipo, non disegni a parte;
  - niente pagina finale di note di sviluppo o checklist: la checklist la tengo io.
- **Esportazione:** ogni pagina come immagine ad alta risoluzione, così il PDF si vede uguale su Mac, telefono e qualsiasi lettore (circa 3 MB).
- Prima di togliere una pagina, dirmi in breve cosa contiene.

## PDF di bug del terminale
- Un unico PDF per volta: in italiano finché non lo approvo, poi anche in inglese.
- Solo la descrizione di cosa non funziona, con lo screenshot: niente cause, niente soluzioni.

## Mockup e prototipi
- **HTML autonomo** che si apre nel browser, da mandare anche a chi non ha Claude. Me lo mandi solo a lavoro finito.
- **Lingua:** in italiano finché non approvo; dopo l'approvazione, versione italiana e versione inglese.
- **Prototipi cliccabili:**
  - una barra PROTOTIPO in alto per cambiare stato (attivo, pagamento fallito, disdetto, caricamento, errore);
  - una vista PC e una vista Telefono.
- **Grafica:** colori e font della landing, logo VOLWICK in alto a sinistra.
- **Contenuto:** tenere solo quello che serve davvero. Niente elementi solo visivi che danno tanto lavoro al developer (esempi: ticker, timeframe, statistiche doppie).

## Sito (repo volwick-site)
- Regola numero uno: quando si lavora sul telefono non si tocca la versione PC.
- Controllo telefono a 320, 360, 390 e 430 px, in IT ed EN, senza scorrimento laterale.
- Il push lo faccio io da Terminal, in una nuova scheda (Cmd+T): `cd ~/dhospitality/volwick-site && git push origin frontend-power`.

## Check e analisi
- Un check completo diventa un PDF, non un doc di Claude Docs, con priorità P0, P1, P2 e chi fa cosa. Grafica e impaginazione come i PDF per Matt.
- Admin vuoto (nessun cliente, abbonamento o numero da Stripe) è normale in questa fase: non va segnalato come problema.
- Prima studiare come lo fanno i leader SaaS, poi proporre la versione più semplice per noi.

## Reel: lingue, copy, sottotitoli e voce (29 ottobre 2026)
Lingue del motore: EN, ES, PT (Brasile), DE, IT, AR, JA, HI (hindi aggiunto il 29 ottobre, ancora da testare).
- **Audio perfetto.** Niente grana né interruzioni: ElevenLabs multilingual v2 con lingua indicata, tagli solo tra una frase e l'altra con dissolvenze, mix HQ a 48 kHz (circa −15 LUFS, picco sotto −1,5 dBTP). Strumenti in `volwick_engine_v3/tools`: `assemble_voice_hq.py`, `mix_voice_hq.sh`, cartella `lingue/`.
- **Una sola ripresa per lingua.** Tutta la voce in una chiamata sola, tagliata dopo: tono ed energia uguali dall'inizio alla fine (1 credito invece di 4).
- **Voce che non sembra un'AI.** Copione scritto per l'orecchio: frasi brevi, una idea per frase, la virgola dove un trader prende fiato, il punto dove chiude il pensiero. Niente parentesi né sigle che la voce legge male; numeri in lettere nel copione parlato.
- **Copy da madrelingua.** Termini del trader di quel paese, un solo termine approvato per concetto e lingua (`lingue/vw_glossary.json`). Arabo, giapponese e hindi passano da una revisione madrelingua prima di uscire.
- **Sottotitoli = parlato.** Esattamente le parole lette dalla voce, con la stessa punteggiatura; numeri in cifre col formato del paese (7.746 in IT, PT, DE, ES; 7,746 in EN, AR, JA, HI). Ogni riga si ferma a fine frase o alla virgola.
- **Caption del post generata dal copione** (`lingue/make_caption.py`), mai riscritta a mano.
- **Controllo automatico prima del render** (`lingue/copy_lint.py`): blocca il video se trova numeri nel formato sbagliato, trattini, termini non approvati, punteggiatura sbagliata per la lingua, parole chiave colorate assenti, caption diversa dal parlato, disclaimer non approvato.
- **Tipografia per scrittura.** Arabo e hindi senza spaziatura tra le lettere e col carattere proporzionale; font Noto Sans Arabic, Noto Sans Devanagari, Noto Sans CJK JP.
- **Ascolto finale di Power** prima di ogni uscita.
- **Revisione linguistica indipendente** (29 ottobre, sera): ogni lingua passa da un revisore separato che verifica i termini sul web (come parlano davvero i trader di quel paese) e corregge grammatica, registro e punteggiatura. Le scelte approvate finiscono nel glossario.
- **Correttore ortografico** con i dizionari Hunspell (IT, PT, DE, ES, EN) dentro il controllo automatico.
- **Sottotitoli come Netflix:** una riga non finisce mai con articolo, preposizione o congiunzione; in hindi le posposizioni restano col nome; i termini composti (long gamma, mapa de gamma, गामा मैप) non si spezzano mai.
- **Sottotitoli agganciati al copione:** i tempi della voce vengono riallineati sulle parole esatte del copione, così a schermo compare sempre il testo scritto e mai una variante del sintetizzatore. Il brand nei sottotitoli è sempre "Volwick" anche quando alla voce serve una grafia fonetica (ボルウィック, वॉलविक, فولويك).
- **Verifica di ascolto automatica** con Whisper small: la trascrizione della voce deve corrispondere al copione prima del render.
- **Numeri:** in spagnolo i numeri di 4 cifre senza separatore (7746, regola RAE); in giapponese il prezzo si fa leggere in hiragana e si mostra in cifre.

## Video VX (30 ottobre 2026)
- **Un video alla volta.** Ogni chat chiude il suo video prima di passare al successivo.
- **Zone sicure TikTok e Reels.** Tutto il contenuto sta tra x 96 e 940 e tra y 260 e 1550: niente sotto le icone a destra (da y 700 in giù), sotto la caption in basso o sotto la barra in alto.
- **Logo in ogni video.** Wordmark ufficiale VOLWICK, mai ricolorato; su fondo chiaro dentro una pillola navy.
- **Musica di sottofondo.** I video sono organici, non ads. Power vuole musica famosa in sottofondo: manda il file del brano e lo mixo sotto, oppure lo sceglie in app al caricamento. Ogni video esce in due versioni: con base e MUSIC READY (solo effetti, spazio per il brano).
- **Niente registrazioni reali.** Le registrazioni del 27 ottobre (e in generale i dati reali) non si usano nei video, né dati né fotogrammi: sessioni simulate, dichiarate a schermo.
- **Terminale com'è davvero.** In schermata c'è la riga dei layer in alto, su tre righe: VOLWICK · ES prezzo · 1m / DEALER (WALLS, METRIC, EXPIRY, MAPS) / ACTIVITY (BLOCK PRINTS, CVD, CDI, FLOW). Niente GUIDE, MARKET INTELLIGENCE ed ES LEVELS (17:00). I layer si accendono da lì, uno alla volta.
- **Transizione hook → grafico (31 ottobre 03:42).** Il prezzo parte subito nel verso del soggetto, con scia e freccia; replay a curva di velocità (2× nel primo secondo, poi 1,7, 1,5, 1 in passi sempre più corti), mai iperveloce per tutto il video. Modello: V0006 (`?var=3`).
- **Audio dell'hook (31 ottobre 03:29).** Sotto l'hook niente audio del clip: una sola base continua dal primo fotogramma alla fine, fruscio che sale sotto l'hook e colpo sordo sul taglio (prova A di V0006). Mai una musica spezzata al taglio.
- **Hook dall'archivio** (13_REEL_STUDIO/01_HOOK/clip sul Mac, catalogo CATALOGO_HOOK.csv; studio e catalogo in claude/volwick-hook-catalogo-30ott2026.md). Ogni video prova ad aprire con uno di quei clip, solo se è collegato bene: il movimento del clip è lo stesso evento che il grafico mostra subito dopo, il taglio cade sul movimento e il punto chiave del clip finisce nella stessa posizione del primo fotogramma del grafico (match cut). Il collegamento può essere anche solo di movimento, non per forza con la scritta. Se nessun clip ha lo stesso movimento, niente hook. Massimo 2 secondi, logo e scritte nelle zone sicure, un clip diverso per video, si consegna anche la versione senza hook. Esclusi i clip con marchi, scritte, @nomi o persone famose e Plane Crash.
- **Finale approvato, sempre questo** (riferimento: FINALE_APPROVATO.png nella cartella principale del Reel Studio, è il finale di Assorbimento V2). La linea del prezzo si piega nella V, flash, monogramma V e wordmark VOLWICK con riflesso. Sotto, TRADE WITH INSTITUTIONAL CONTEXT. scritto a macchina in mono spaziato con il cursore blu e INSTITUTIONAL in blu. Poi DISCOVER VOLWICK → in blu mono con alone e una sola riga: Simulated data. Not investment advice. Niente altre righe nel finale: né offerta, né prezzo, né SEE WHAT OTHERS CAN'T.; l'offerta va nella caption.
- **Hook all'inizio, dentro il grafico** (brief Visual Hook Engineering, 30 ottobre). L'hook è sempre nel primo fotogramma: grafico già in moto, contesto da trader riconoscibile, una domanda aperta. Nasce dal principio fisico del movimento (caduta verso il supporto, collisione col muro, sfondamento della linea, azione non finita, trasformazione dello stesso grafico). Clip esterni solo se fanno parte della stessa storia. Per ogni video tre aperture con meccanismi diversi, voto su chiarezza, attenzione, rilevanza, curiosità, credibilità, legame col prodotto, leggibilità, fattibilità; si produce la migliore e si testano le altre a parità di corpo.
- **Struttura preferita (16:09):** clip hook dall'archivio agganciato al movimento del grafico (match cut, per esempio una caduta sulle candele che cadono) → grafico normale stile TradingView bianco → il nostro software (Volwick con la riga dei layer). Modello: CREATIVE 06B THE DROP HOOK.
- **CREATIVE 01 (replay realistico).** Sembra una registrazione dello schermo: cursore umano che disegna supporto e resistenza, replay con candele che si formano, poi la stessa sessione continua in Volwick. Overlay minimi, niente glitch, zoom, flash o 3D. Chiude col finale approvato.

## Lavoro in parallelo su più chat (30 ottobre 2026)
- **Sistema unico su GitHub (23:00).** Repository privato sellamwork-droid/volwick-reel-studio: motore, regole, hook, memoria dei video e coda dei lavori (Issues con etichette da-fare, in-lavorazione, da-rivedere, da-rifare, fatto). Ogni Claude su ogni computer parte da `git pull --rebase` e `python3 00_MOTORE/tools/studio.py brief`, prende una scheda, lavora nella sua cartella di scena e fa il push. ID video = V + numero della scheda (V0012). Istruzioni complete nel CLAUDE.md del repository.
- **Presenza (31 ottobre).** Ogni Claude, di qualsiasi account, chat o computer, si fa vedere con `studio.py presenza` a ogni passo e guarda `studio.py chi` prima di prendere un lavoro; memoria sempre da GitHub (pull prima, sync dopo).
- **Cantieri (31 ottobre, 03:50).** Due Claude non lavorano mai sulla stessa cosa: ogni video e ogni lavoro comune (drive, hook, caricamenti, motore, regole, audio, riferimenti) ha un solo padrone. Si prende con `studio.py prendi <cantiere>`, si lascia con `lascia`; se è OCCUPATO si avvisa Power e si fa altro. `nuovo` ferma i doppioni (stesso hook, evento quasi uguale, stesso nome).
- **Il sistema impara.** Ogni giudizio di Power va sul video (MEMORIA/video/<ID>.json, feedback e stato), le correzioni valide per il futuro diventano lezioni o regole del registro, quelle tecniche passano nel motore con una pull request. Push subito: gli altri Claude lo ricevono al loro git pull.
- **Controlli automatici** (`studio.py controlla`, ripetuti da GitHub a ogni push): niente chiavi, niente video nel repository, riga dei layer e finale approvato nelle scene attive.
- **Render fuori dal repository**, nella cartella condivisa dei render (da decidere: Google Drive o Mac).
- **Un video diverso per ogni chat.** Lo garantiscono i cantieri: il video preso da una chat è bloccato per le altre.
- **Ogni chat lavora sulla sua copia del motore** (originale in 13_REEL_STUDIO/00_MOTORE). Se una chat migliora il motore e il miglioramento serve anche alle altre, Power lo dice alla chat principale, che lo porta nella cartella comune.
- **Le regole nuove vanno salvate in questo file** (e in claude/volwick-preferenze-e-formati.md nel progetto). Se Power dà una regola a una sola chat, quella chat la salva qui, così le altre la leggono alla lettura successiva.
- **Salvataggio senza sovrascrivere.** Prima di salvare, la chat rilegge il file in quel momento e aggiunge solo la riga nuova, mai riscrivendolo da una copia vecchia.

## Reel Studio · 4 tipi di video (aggiornato 31 ottobre 2026)
- **Cartella unica:** il repository volwick-reel-studio (sul Mac ~/Desktop/VOLWICK/13_REEL_STUDIO, aggiornato con git pull). Motore grafico unico in 00_MOTORE; i video finiti vanno su Drive in 01_VIDEO/<tipo>/<ID>_<NOME>.
- **Quattro tipi fissi** (stesse cartelle in 03_FORMATI, in Drive 01_VIDEO e nei video consigliati): T1 01_EDIT (montaggio a tempo di musica, senza voce, modello CREATIVE 05); T2 02_SPIEGAZIONE_VOCE (spiegazione con voce parlata HeyGen e sottotitoli, modello Assorbimento V2); T3 03_REGISTRAZIONE_SCHERMO (registrazione dello schermo del terminale vero, regole Live Market Reactions, licenza dati confermata prima di ogni uscita); T4 04_HOOK_GRAFICO_VS_VOLWICK (hook iniziale, grafico normale stile TradingView, poi Volwick che mostra la differenza, modello CREATIVE 06B). I vecchi codici: F1→T2, F2→T4, F3→T1, F4→T3, F5→T4.
- **Hook fortissimi:** tutto si basa su hook forti nei primi 1,5–2 s, collegati per movimento o significato. Archivio in 01_HOOK con catalogo automatico (`00_MOTORE/tools/hook_index.py`).
- **Audio virali:** si usano gli audio più virali di Instagram e TikTok della settimana (02_AUDIO/AUDIO_TREND.md, aggiornato ogni settimana), scelti in app al caricamento; dentro il file solo brani con licenza.
- **Portafoglio:** prima si riempiono archivio hook e catalogo audio, poi si producono i reel a ritmo alto.

## Registro delle nuove indicazioni
Ogni nuova indicazione si aggiunge qui sotto con la data, la più recente in alto.

- 31 ottobre 2026 (03:50): due Claude non lavorano mai sulla stessa cosa. Ogni lavoro è un cantiere con un solo padrone (un video V0012, oppure drive, hook, caricamenti, motore, regole, audio, riferimenti): si prende con `studio.py prendi <cantiere>` prima di toccarlo e si lascia con `lascia`. Se è OCCUPATO si dice a Power e si fa altro. `nuovo` blocca un video con lo stesso hook, un evento quasi uguale o lo stesso nome di un video di un'altra sessione attiva. Dettagli nel CLAUDE.md, sezione Cantieri.
- 31 ottobre 2026 (03:42): linea guida della transizione hook → grafico = variante 3 di V0006 (scia di caduta). Appena passa al grafico il prezzo si muove subito nello stesso verso del soggetto, con una scia rossa (o verde se sale) e una freccia che seguono il prezzo. Niente replay iperveloce per tutta la durata: curva di velocità solo all'inizio, rispetto al replay calmo (0,55 candele/s) 2× nel primo secondo, poi 2 → 1,7 → 1,5 → 1 in passi sempre più corti (0,4, 0,25, 0,15 s). Codice: `camera`, `crashFx`, `RAMP` e `rampPairs` in scenes/v0006_the_bar/scene.js (?var=3).
- 31 ottobre 2026 (03:29): linea guida audio dei video con hook = prova A di V0006: niente audio del clip hook, una sola base dal primo fotogramma alla fine, un fruscio che sale sotto l'hook e un colpo sordo sul taglio. Le prove B (solo audio dell'hook) e C (dissolvenza hook → base) non vanno bene. In replay_sound.py e negli altri script audio non si usa più HOOK_WAV sotto l'hook.
- 31 ottobre 2026 (03:24): l'audio non si taglia mai a caso. Vietato far partire la musica del clip hook e spezzarla al taglio per passare a una base di stile diverso (successo in V0006). Sotto l'hook o c'è una sola base continua dall'inizio alla fine, o si parte con l'audio del clip lasciato sfumare (mai stop secco) senza musica dopo. Linea guida definitiva da scegliere tra tre prove su V0006 (A base unica, B solo audio del hook, C dissolvenza hook → base).
- 31 ottobre 2026 (02:40): il lavoro è in contemporanea su account Claude diversi, sullo stesso account e su chat diverse: ogni Claude deve sapere quando un altro sta lavorando e cosa sta generando, e avere sempre la memoria aggiornata da GitHub. Ogni sessione ha un nome (`<account> · <chat o computer> · <cloud o Terminale>`), segnala a ogni passo con `studio.py presenza` (file in MEMORIA/sessioni, push automatico), guarda `studio.py chi` prima di prendere una scheda, fa `git pull` prima di ogni passo e `studio.py sync` dopo ogni cosa nuova. Dettagli nel CLAUDE.md, sezione Presenza.
- 31 ottobre 2026 (03:04): negli edit (T1) non si mettono hook: si aprono con il logo che si accende e i tagli a tempo. Gli hook dell'archivio servono agli altri tipi; quelli caricati (circa 250) vanno studiati tutti e scremati, tenendo i più adatti ai nostri video.
- 31 ottobre 2026 (03:01): i video in 01_VIDEO si chiamano con un numero dal 1 (dentro il loro tipo), l'argomento del video in italiano e la data di uscita, per esempio 01 Prezzo bloccato sul call wall (31-10-2026).mp4. Niente codici tipo V0002 nei nomi che vede Power (restano solo nel repository). Nella cartella del tipo solo gli mp4 completi.
- 31 ottobre 2026 (02:54): a Power si consegna esclusivamente il video fatto e completo. In 01_VIDEO/<tipo>/ c'è solo <ID>_<NOME>.mp4, un file per video: niente caption, schede, copertine, LEGGIMI, spezzoni o altre versioni. Le versioni secondarie (MUSIC READY, senza hook) e i video superati vanno in 04_ARCHIVIO_VIDEO; caption e scheda restano nella memoria del video nel repository. L'interfaccia deve essere completamente pulita.
- 31 ottobre 2026 (01:10): i video si dividono in quattro tipi, con cartelle uguali ovunque: T1 01_EDIT, T2 02_SPIEGAZIONE_VOCE (voce HeyGen), T3 03_REGISTRAZIONE_SCHERMO (il grafico vero registrato dal terminale), T4 04_HOOK_GRAFICO_VS_VOLWICK (hook iniziale, grafico normale, poi Volwick). Su Drive i video finiti stanno in 01_VIDEO/<tipo>/; i video consigliati in 03_VIDEO_CONSIGLIATI con le categorie 01–04 dei tipi più 05_HOOK_E_APERTURE, 06_COMPETITOR, 07_ALTRO. Il confronto e il replay schermo sono T4. Nella memoria il campo formato vale T1–T4.
- 31 ottobre 2026 (00:35): il sistema deve contenere tutto il sapere per fare i video, così un Claude nuovo su un account o computer nuovo sa già tutto: 00_SAPERE nel repository (copia leggibile su Drive in 05_SAPERE_VOLWICK) con cos'è Volwick, come è fatto e come si usa il terminale, i layer, il manuale ufficiale in punti, cosa si può mostrare, marchio e tono. Per account nuovi: guida GUIDA_REEL_STUDIO_NUOVO_ACCOUNT.pdf, PROMPT_AVVIO_CHAT.txt e la skill da caricare, tutto su Drive.
- 31 ottobre 2026 (00:05): anche le chat dell'app Claude lavorano come operai del Reel Studio, in parallelo alle sessioni del Terminale: si collegano al repository, producono nel cloud e consegnano su Drive attraverso il computer collegato (o in 04_RENDER/_DA_CARICARE, che il Terminale porta su Drive). Avvio con la skill volwick-reel-studio.
- 30 ottobre 2026 (23:44): su Drive il materiale si carica in tre cartelle di 00_CARICA_QUI: 01_VIDEO_HOOK, 02_MUSICA, 03_VIDEO_CONSIGLIATI; i video consigliati sono divisi in categorie numerate (01 voce e spiegazione, 02 replay schermo, 03 edit e musica, 04 live mercato, 05 confronto, 06 hook e aperture, 07 competitor, 08 altro). Dal Drive si monitorano i video generati e si danno in pasto al sistema hook, musica e video consigliati.
- 30 ottobre 2026 (23:33): la cartella Drive VOLWICK REEL STUDIO deve contenere ogni video mai generato, tutte le versioni: i nuovi in 01_VIDEO (studio.py consegna), quelli fatti prima in 04_ARCHIVIO_VIDEO con il suo indice. Nessun video finito resta solo su un computer.
- 30 ottobre 2026 (23:00): i video si generano in contemporanea da più Claude e più computer con un unico sistema su GitHub (repository privato sellamwork-droid/volwick-reel-studio). Il sistema ha uno storico e impara: ogni giudizio o correzione di Power si registra sul video (MEMORIA/video), diventa lezione o regola per le generazioni successive e vale per tutti al git pull. Ogni sessione parte da git pull e studio.py brief. Niente motore sul server del terminale.
- 30 ottobre 2026 (22:22): tutto in un'unica cartella da poter spostare su un altro computer: la cartella madre ~/Desktop/VOLWICK si sposta sempre intera, e per i video tutto il sistema di generazione sta in 13_REEL_STUDIO (CLAUDE.md con le istruzioni per qualsiasi Claude, installazione e verifica in 00_SETUP, motore, hook, audio, formati, video fatti, schede in 06_DOCS). Ogni cosa nuova si aggiorna sempre lì, nella cartella locale, che è la fonte.
- 30 ottobre 2026 (17:00): nella riga dei layer dei video si tolgono GUIDE, MARKET INTELLIGENCE ed ES LEVELS; la terza riga parte con ACTIVITY. CREATIVE 06B giudicato ottimo.
- 30 ottobre 2026 (16:09): struttura preferita dei video: hook all'inizio con un clip dell'archivio (per esempio qualcuno che cade) agganciato al movimento del grafico (match cut), poi il grafico normale stile TradingView (bianco), poi il nostro software. Il grafico scuro generico è meno chiaro. Modello: CREATIVE 06B THE DROP HOOK.
- 30 ottobre 2026 (16:01): l'hook è sempre all'inizio del video, dal primo fotogramma. Brief Visual Hook Engineering: l'hook nasce dentro il grafico dal principio fisico del movimento; niente clip virali scollegati; tre aperture valutate per video, si produce la più forte. Dettagli in claude/volwick-creative06-the-drop-30ott2026.md.
- 30 ottobre 2026 (15:44): nei video lo schermo va riempito (finestra e grafico più grandi possibile dentro le zone sicure) e la parte Volwick deve essere più tecnica e far capire il valore: i nostri layer non sono indicatori, sono le regole di copertura dei dealer letti dal book delle opzioni. Sotto ogni titolo una riga tecnica corta (famiglia del muro, γ, cosa fanno i dealer e perché il prezzo reagisce, senza promettere), e i dati del terminale a schermo (tooltip del muro con Net in $).
- 30 ottobre 2026 (15:42): servono hook molto più forti e gli audio più virali di Instagram e TikTok; si costruisce un archivio di hook e un catalogo di brani virali per il portafoglio reel. Cinque formati fissi (voce e spiegazione, replay schermo, edit con musica, live orizzontale, confronto) e un motore grafico unico in ~/Desktop/VOLWICK/13_REEL_STUDIO. Dettagli nella sezione Reel Studio.
- 30 ottobre 2026 (15:28): il finale dei video è sempre quello approvato (Assorbimento V2): V e wordmark VOLWICK, TRADE WITH INSTITUTIONAL CONTEXT. scritto a macchina in mono con cursore blu, DISCOVER VOLWICK →, Simulated data. Not investment advice. Nessun'altra riga. Riferimento in 12_MOTORE_STATICO/FINALE_APPROVATO.png.
- 30 ottobre 2026 (15:16–15:19): gli hook vanno studiati e collegati bene, con una ricerca fatta a modo. Il collegamento può essere anche solo tra la intro e il movimento (match cut), non per forza tra immagine e titolo.
- 30 ottobre 2026 (15:06): per tutti i video si prova ad aprire con un hook della cartella ~/Desktop/HOOK, solo se coerente con l'inizio del video; se non c'è modo di dargli coerenza si salta. Dettagli nella sezione Video VX.
- 30 ottobre 2026 (15:03): si lavora su più video insieme con più chat. Un video diverso per ogni chat, ogni chat sulla sua copia del motore (i miglioramenti utili a tutti passano dalla chat principale), le regole nuove si salvano in questo file. Dettagli nella sezione Lavoro in parallelo su più chat.
- 30 ottobre 2026 (14:24–14:35): un video alla volta, si parte dal primo (CREATIVE 01, replay realistico). Zone sicure di TikTok e Reels rispettate sempre e logo ufficiale in ogni video. I video sono organici, non ads: musica famosa di sottofondo. Le registrazioni del 27 ottobre non si usano. Il terminale si mostra con la sua riga dei layer in alto. Dettagli nella sezione Video VX.
- 30 ottobre 2026: nuovo motore VX (video ricalcati sui format che funzionano, esempi in 12_MOTORE_STATICO/00_ESEMPI). Volwick è sempre il protagonista e va valorizzato con esempi; il metodo degli altri (trendline, indicatori, libri) non si scredita: il video può partire da lì e mostrare che con Volwick non serve, perché si vedono Dealer Walls, Block Prints e il resto. Paragone o struttura del format originale, hook forti, impatto visivo aggressivo. Ogni layer va rappresentato esattamente come nel terminale (scheda 12_MOTORE_STATICO/01_LAYER).
- 29 ottobre 2026 (16:04): arrivare alla perfezione assoluta su coerenza con la lingua, punteggiatura e sottotitoli, usando tutti gli strumenti disponibili.
- 29 ottobre 2026: si aggiunge l'hindi (senza test per ora). Il motore deve essere precisissimo: copy belli e giusti, sottotitoli e scritte esatti, voce scorrevole con intonazione e punteggiatura giuste, coinvolgente, che non sembri un'AI. Regole nella sezione Reel: lingue, copy, sottotitoli e voce.
- 29 ottobre 2026: l'audio deve essere perfetto, mai sgranato o interrotto. Test lingue a mezzo video per risparmiare crediti (PT, AR, DE, JA, IT).
- 29 ottobre 2026 (16:10): nei video LIVE MARKET REACTIONS effetti sonori un po' più bassi; i dealer walls si fanno notare insieme ai block print, con i milioni dell'etichetta in grande e la famiglia (long γ suppressive, short γ accelerative), soprattutto i muri che il prezzo supera e quello che non raggiunge, con un minimo di spiegazione coerente e senza cause.
- 29 ottobre 2026 (13:20): nei video LIVE MARKET REACTIONS il dealer wall non è più il protagonista. Si mostra il terminale che si muove dal vivo: block print che entrano sulla candela, key level che si formano quando i blocchi si accumulano, prezzo che si muove dopo (descritto, mai spiegato con cause). Il muro resta solo contesto.
- 28 ottobre 2026 (15:00): nei video LIVE MARKET REACTIONS niente rallentatore alla fine e niente tratti a velocità reale; video più lungo, circa 50 secondi, sempre accelerato fino al logo.
- 28 ottobre 2026: approvato VOLWICK_ABSORPTION_V2 come modello dei Reel tecnici: circa 40 secondi, la voce spiega bene il meccanismo passo per passo, a schermo solo etichette tecniche che entrano quando la voce le nomina, niente P&L né scritte inutili, finale TRADE WITH INSTITUTIONAL CONTEXT.
- 28 ottobre 2026 (00:37): nei video LIVE MARKET REACTIONS lo slogan finale è TRADE WITH INSTITUTIONAL CONTEXT. (al posto di SEE WHAT OTHERS CAN'T.).
- 28 ottobre 2026: nei Reel lo slogan finale è TRADE WITH INSTITUTIONAL CONTEXT. (al posto di SEE WHAT OTHERS CAN'T.), a schermo sotto il logo e in voce prima di "Discover Volwick.". Si va avanti solo con video nuovi: i vecchi (P01, P02) non si rifanno.
- 27 ottobre 2026 (22:20): nei video LIVE MARKET REACTIONS il logo VOLWICK sta in alto a sinistra, grande e ben visibile.
- 27 ottobre 2026 (sera): i Reel del Content Engine devono essere a colpo d'occhio e professionali: il grafico racconta il concetto da solo, voce di poche frasi corte, niente spiegazioni lunghe di cosa fa Volwick (la chiusura resta solo See what others can't. Discover Volwick.).
- 27 ottobre 2026 (20:00): nei video LIVE MARKET REACTIONS il grafico si ferma il meno possibile (al massimo una pausa breve sul momento chiave), tutto più semplice, accelerato bene e d'impatto. Si consegna un solo video, non due versioni.
- 27 ottobre 2026 (sera): i video LIVE MARKET REACTIONS si fanno senza hook iniziale e non in formato Reel: video orizzontali 16:9 del software vero, fatti bene, un minimo argomentati, che si fermano in pausa a far vedere i punti chiave con richiami sul grafico e una frase semplice. Dettaglio nella sezione Formato ORIZZONTALE del CLAUDE.md di 11_LIVE_MARKET_REACTIONS.
- 27 ottobre 2026: Reel del Content Engine, nuovo stampo (γ Map V4 e P03 V4B). Il grafico scende fino a circa y 1520 seguendo le zone sicure 2026 (Reels 310 px sotto, TikTok 320, ads TikTok 370), così hook e sottotitoli scendono e restano ben staccati dal logo; anche nel finale tagline e DISCOVER VOLWICK stanno distanziati dal wordmark. Nelle simulazioni non si indicano i punti del movimento, il P&L resta in $. Apertura forte, una sola sessione tecnica e informativa da trader invece di due scenari, versioni minimal e ordinate. Piano di produzione nel progetto: claude/volwick-reel-piano-produzione-27ott2026.md.

- 26 ottobre 2026: i Reel LIVE MARKET REACTIONS devono essere più lunghi (45-60 secondi) e live davvero: filmato vero del terminale durante il mercato vero, con i movimenti reali presi dal software, il tocco del muro a velocità reale e il resto accelerato e dichiarato. Dettaglio nella sezione Formato LIVE del CLAUDE.md di 11_LIVE_MARKET_REACTIONS.
- 25 ottobre 2026 (V13): i Reel LIVE MARKET REACTIONS non hanno mai voce né musica: Claude fa solo gli effetti sonori sincronizzati al grafico (muro, crescendo, impatto al tocco, reazione, sonic logo) e consegna due versioni, _SFX e _SILENT. Durata 22-30 secondi, grafico grande e protagonista, hook PRICE HIT THIS WALL. / THEN STOPPED., tre momenti (avvicinamento, FIRST TOUCH., reazione), testi ridotti a hook, muro, primo tocco, reazione e brand. Una frase come THE LEVEL HELD. si usa solo se descrive esattamente l'intervallo. Dettaglio nella sezione Formato V13 del CLAUDE.md di 11_LIVE_MARKET_REACTIONS.
- 25 ottobre 2026 (notte, dopo la v8): i Reel LIVE MARKET REACTIONS vanno tenuti puliti e minimal: niente profondità né effetti, un solo testo alla volta ordinato, candele più veloci, effetti sonori quasi impercettibili perché sotto ci va la musica, e sempre un hook iniziale forte.
- 25 ottobre 2026 (notte): nei Reel LIVE MARKET REACTIONS il messaggio deve essere chiaro (cosa ha fatto il livello, per esempio ha fatto da tetto), la durata è circa un minuto, e c'è sempre una scritta fissa che dice che è mercato reale (LIVE MARKET se registrato dal vivo, REAL MARKET se ricostruito dal grafico vero).
- 25 ottobre 2026: i Reel LIVE MARKET REACTIONS devono essere più visivi, più veloci (18 a 22 secondi) e con un hook molto più impattante, con la stessa strategia social dei video AI: esito nel primo fotogramma, riavvolgimento, un numero grande alla volta, sottotitoli che entrano sul ritmo, camera che segue il prezzo. Dettaglio nella sezione Regia obbligatoria del CLAUDE.md di 11_LIVE_MARKET_REACTIONS.
- 24 ottobre 2026 (sera): video della guida. Apertura e chiusura solo camera, Tudor in primo piano; in mezzo il terminale vero con il riquadro di Tudor, che resta. Cursore bianco; sottotitoli bianchi che diventano azzurro Volwick parola per parola; voce pulita al massimo; fascia scura pulita sopra la barra del terminale. Registrazione il più automatica possibile.
- 24 ottobre 2026: nasce la seconda categoria di contenuti, LIVE MARKET REACTIONS: Reel che mostrano il terminale vero durante il mercato vero, separati dal Content Engine educational. Tutto in 11_LIVE_MARKET_REACTIONS, con il suo CLAUDE.md. Non si inventano dati né eventi, si registrano anche i livelli che non tengono, la velocità si dichiara a schermo, e non si pubblica niente prima del controllo umano e della conferma sulla licenza dei dati.
- 23 ottobre 2026: sul sito e nella dashboard partner non si scrive come vengono pagati i partner (niente PayPal o bonifico). Al suo posto: "tracked in your dashboard" / "tutto tracciato in dashboard". Restano giorno di pagamento e soglia minima.
- 23 ottobre 2026: i documenti MD non mi servono mai, nella cartella non se ne creano di nuovi. Finché non approvo mi mandi solo il file in italiano; dopo l'approvazione file e mockup in italiano e in inglese.
- 23 ottobre 2026: i prezzi nelle schede Mercati sono live da indici (non CFD), non vanno segnalati come simulati. Per le pagine legali si scrive che siamo in attesa dei dati legali. L'admin senza dati è normale: va progettato per me e James, collegato e veloce, prendendo spunto da AXUX.
- 23 ottobre 2026: i check si consegnano in PDF, non in Claude Docs. Se l'admin non mostra dati è normale.
- 23 ottobre 2026: la cartella VOLWICK va aggiornata a ogni nuova indicazione, e Claude deve imparare il mio modo di chiedere le cose e adattarsi sempre.
- 22 ottobre 2026: il PDF dell'Account si deve vedere bene quando lo scarico. Le pagine vanno esportate come immagini.
- 21 ottobre 2026: nel PDF per Matt va tolta la pagina con note di sviluppo e checklist.
- 20 ottobre 2026: nell'Account il menu dell'avatar e la barra laterale hanno le stesse voci, e ogni voce apre la sua sezione. Chi non ha un abbonamento non entra mai nell'Account. Niente dettagli dell'offerta di lancio nell'Account.
