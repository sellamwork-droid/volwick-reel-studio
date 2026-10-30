# VOLWICK · Documento master

Aggiornato al 23 ottobre 2026. Raccoglie in un posto solo cosa è Volwick, come deve venire, le decisioni prese e lo stato a pochi giorni dal lancio. Le fonti sono i documenti del progetto VOLWICK su claude.ai (tutti copiati in questa cartella) e la memoria di Claude sul progetto. Dove due fonti si contraddicono vale la più recente, e le contraddizioni ancora aperte sono segnalate.

---

## 1. Cos'è Volwick

- **Cosa fa.** Volwick è un terminale web di market intelligence per day trader su indici, futures, ETF, oro e Bitcoin. Legge il posizionamento dei dealer di opzioni (muri gamma, mappe di esposizione) e il nastro di quello che passa davvero (block print, CVD, flusso opzioni), poi riassume tutto in una lettura automatica, la Market Intelligence.
- **Nomi.** Prima si chiamava DarkVol. Nel codice il terminale si chiama ancora Sightline (darkvol.work/sightline nelle prime fasi, oggi volwick.com/dashboard).
- **Categoria scelta.** "Market Intelligence Terminal". Territorio di comunicazione: "Beyond price".
- **Non va posizionato** come "piattaforma con più strumenti", "TradingView professionale" o "software Dark Pool".
- **Mercati.**
  - Prioritario gli USA, secondario l'Italia.
  - Sito, menu, terminale e guida in inglese; il sito ha anche la versione italiana.
- **Obiettivi.** 100 utenti paganti entro dicembre 2026. Budget marketing 10k al mese, margine circa 90%.

### Team

| Chi | Ruolo |
| --- | --- |
| Power (Vincenzo Amore) | Prodotto, coordinamento, front-end del sito (branch frontend-power). Partner con equity, non agenzia esterna |
| Matt | Sviluppo: terminale, backend, admin, Stripe, deploy. Repo del terminale e del backend è suo |
| Vik | Marketing |
| Mu | Capo progetto |
| Tudor | Front man dei video della guida, editing e podcast |
| James | SEO (parole chiave e metadata) |
| Brand ambassador | Volto dei reel di lancio |

---

## 2. Il prodotto: cosa c'è nel terminale

**Layer comunicati sul sito:**

- Dark Pool / Block Prints;
- Dealer Walls;
- Exposure Maps;
- CVD;
- CDI;
- Flow;
- Market Intelligence.

**Mercati sul sito:** 11 (SPX, ES, MES, NQ, RTY, VIX, VX, SPY, QQQ, GOLD, BTC). Power ha confermato che BTC c'è, anche se il manuale ufficiale lo dava assente. Dal 22 ottobre BTC ha muri derivati da IBIT.

**Fonti di verità sul prodotto, in ordine di peso:**

1. **Test dal vivo salvati in 02_TERMINALE**, l'ultimo del 22 ottobre.
2. **Volwick Terminal Manual ufficiale (69 pagine, set 2026),** riassunto in 01_PROGETTO_STATO_E_BRIEF/MEMORIA_CLAUDE.md.
3. **Source of truth del 5 ottobre**, con le domande a Matt su cosa è reale strumento per strumento.

**Regole sui claim**, dal manuale e dalla "bibbia":

- Mai promettere direzione o guadagni. Muri, CDI e mappe sono probabilità di posizionamento, mai certezze né consiglio finanziario.
- **"Dark Pool":**
  - è il nome deciso da Power per la comunicazione;
  - tecnicamente è vero solo su SPY (consolidated tape), mentre sui futures è exchange tape con vero aggressor tag;
  - Matt ha detto che non c'è un feed dark pool che indichi il venue.
- Non dire: OPRA, CME, "Level 3", "identifica gli HFT", "unico con dark pool".
- **Claim difendibile:** muri dalle posizioni reali dei market maker, più nastro futures al secondo, più lettura automatica, a $89.
- **Lessico:** "controvalore", non "nozionale"; niente "borse lit".
- **Guida:**
  - "Semplice da leggere. Tecnico quando serve. Preciso nelle spiegazioni."
  - "Non siamo una scuola di formazione": non si spiegano i concetti generali, si spiega come leggere le funzioni Volwick con esempi reali.

---

## 3. Prezzo e offerta (decisioni di Power)

- **Piano.** Abbonamento unico "Volwick Access" a $89 al mese.
- **Offerta di lancio.**
  - Primo mese a $0.99, poi rinnovo automatico a $89. Una per persona, account e carta.
  - Valida per chi si registra dal 28 ottobre al 27 novembre 2026 (mezzanotte California, 9:00 del 28 novembre in Italia).
- **Annuale.** Sconto del 18%, cioè $875.76 l'anno. Esce dalla pagina al lancio e torna dopo; flag `SHOW_YEARLY=false`.
- **Prova gratuita.** Dal 28 novembre si torna ai pacchetti normali, con una prova gratuita di 7 giorni facoltativa.
- **Pagina prezzi.** Al lancio sul sito si mostra solo il mensile, con il prezzo al centro.
- **Rimborsi e disdetta.**
  - Nessun rimborso, disdetta in qualsiasi momento, accesso fino a fine periodo pagato.
  - Da verificare con un legale rispetto al recesso UE di 14 giorni.
- **Lancio.** Unico, il 28 ottobre 2026, in inglese e italiano. Niente waitlist. Le ads partono dopo il lancio, non prima.

---

## 4. Come deve venire

### Sito (repo volwick-site, Next.js, branch frontend-power, PR #1 su mvansmith/volwick-site)

- **Struttura.** Home corta e visiva sul modello DeepCharts, senza copiarlo. Ordine voluto:
  1. titolo hero;
  2. explorer a tab con gli indicatori;
  3. Dark Pool;
  4. terminale;
  5. mercati;
  6. prezzo.
- **Menu.** Dark Pool (pagina dedicata), Prodotto, Mercati, Prezzo, Partner.
- **Banner offerta.** Layout C in colore "mezzanotte e ciano". Scorre via con la pagina, la navbar resta fissa.
- **Marchio.** Wordmark VOLWICK e monogramma V con rombo, acciaio cromato con glow blu su navy.
- **Token colore e font della landing.**
  - Sfondi da #040913, accento #2F6BFF / #8AB6FF, oro #F2C14E.
  - Font Archivo (titoli), Instrument Sans (testo), JetBrains Mono.
- **Regola numero uno di Power:** non toccare la versione PC quando si lavora sul telefono, salvo richiesta.
- **"La bibbia".** Il Front End & Marketing Plan di settembre è la linea guida su posizionamento e linguaggio; sintesi in MEMORIA_CLAUDE.md. È stato applicato al sito e poi annullato su richiesta di Power, quindi il sito resta com'era e il piano vale come informazione.

### Terminale

- **Ruolo di Power.** Gira a Matt i difetti in un unico PDF IT + EN per volta. Nei documenti sui bug va solo la descrizione di cosa non funziona: niente cause, niente soluzioni.
- **Come lo vogliamo:** dati coerenti tra pannelli, nessun numero inventato, stati chiari quando il dato è vecchio o assente, Market Intelligence che cambia con METRIC.

### Account dentro il terminale (volwick.com/dashboard → Account)

**Design consegnato il 20-21 ottobre:**

- PDF Volwick_Account_v3.pdf (8 pagine) in 09_CONSEGNE_FILE;
- prototipo cliccabile Volwick_Account_prototipo.html;
- dettaglio in 04_ACCOUNT_BILLING_PARTNER/volwick-account-overview-v2-20ott2026.md.

**Sezioni.** Account, Subscription, Partner programme, Support e, nella barra laterale, Guide ↗.

**Il menu dell'avatar.** Ogni voce apre la sua sezione e Time zone resta nel menu.

**Regole dell'Account:**

- ci entra solo chi ha un abbonamento attivo;
- Stripe gestisce carta, fatture e disdetta tramite il Customer Portal;
- il positivo è sempre blu, mai verde;
- niente ticker, timeframe o dati solo decorativi.

### Programma partner

- Facile come nei grandi SaaS: link referral subito, senza candidatura né approvazione.
- Commissione del 15% su quello che il cliente paga, anche sul mese a $0.99, poi su ogni rinnovo.
- Attribuzione di 90 giorni, pagamento il 15 del mese sopra $50. Il metodo di pagamento non si scrive sul sito (decisione del 23 ottobre).
- Il partner deve vedere tutto nella sua dashboard.

### Marketing

- **Serie caroselli Instagram "BEYOND PRICE",** episodi EP. 001, 002, ... (pensata per oltre 50). Sistema automatico in 08_STRUMENTI/auto-caroselli; regole slide in vw_regole_slide.md.
- **Video.**
  - Reel parlati con il brand ambassador e con Power.
  - Studio di montaggio in 08_STRUMENTI/studio-video, playbook in 05_MARKETING_CONTENUTI/video-reel.
- **Canali.** Molto lavoro su X (strategia in 05_MARKETING_CONTENUTI/social-caroselli-campagne). Il piano copre email, reel, YouTube, referral, promo e collab.
- **Collab.** Solo profili forti sul trading, puliti e in linea con il prodotto. Esclusi chi fa brokeraggio, affiliazioni o vende segnali su Telegram.
- **SEO.** Piano definitivo e localizzazione in 7 lingue in 05_MARKETING_CONTENUTI/seo.

---

## 5. Stato al 23 ottobre 2026

**P0, senza questi non si lancia** (dal check SaaS del 21 ottobre):

1. **Checkout.** Deve addebitare $0.99 il primo mese e poi $89; serve un test reale completo. Il 18 ottobre addebitava $89 subito; la soluzione chiesta a Matt è un coupon una tantum da $88.01.
2. **Chiavi in produzione.** Stripe, webhook e Resend (email) vanno attivati. L'11 ottobre mancavano chiave webhook e chiave Resend.
3. **Accesso protetto.** Pagine e dati del terminale solo con abbonamento attivo, controllato lato server.
4. **Account collegato all'abbonamento vero.** Oggi mostra "Not available right now".
5. **Documenti legali definitivi** (Power con un legale; al 23 ottobre siamo in attesa dei dati legali):
   - Termini, Privacy e Rischio sono ancora in "Bozza per la revisione legale";
   - mancano ragione sociale, sede, partita IVA e legge applicabile;
   - i Termini citano l'annuale e una prova gratuita, ma non l'offerta $0.99.
6. **Dark Pool.** Va costruito o tolto dal sito prima delle campagne.

**Terminale.** Il PDF unico del 22 ottobre per Matt ha 7 punti (Power ha tolto CVD, livelli a due stelle e stelle multiple):

1. print fuori prezzo su SPY e QQQ;
2. linee sfasate dopo un cambio di WALLS;
3. due numeri per lo stesso muro;
4. il testo di Market Intelligence non cambia con METRIC;
5. variazione % calcolata sull'ultimo prezzo invece che sulla chiusura;
6. variazione % del VIX sbagliata;
7. ordine dei riquadri diverso tra SPY ed ES.

Mockup delle soluzioni per i block prints: 02_TERMINALE/volwick-block-prints-mockup-v2-22ott2026.md.

**P1, se c'è tempo prima del 28:**

- email di promemoria prima del primo $89, di pagamento fallito e di benvenuto;
- tracciamento partner e calcolo delle commissioni;
- stati del feed: dati vecchi, riconnessione, mercato chiuso;
- fuso orario al primo accesso;
- eventi del funnel e pixel Meta e Google;
- admin collegato a Stripe;
- pagina "Chi siamo" con i dati aziendali;
- nota IVA sulla pagina prezzi;
- Google: togliere i testi o aggiungere il bottone;
- pagina Stato collegata a un monitoraggio vero.

**Decisioni e precisazioni del 23 ottobre (Power):**
- i prezzi nelle schede Mercati della landing sono live, presi da indici e non da CFD: non vanno segnalati come simulati;
- Stripe verrà collegato; l'admin oggi ha solo dati finti perché non abbiamo lanciato;
- l'admin va strutturato per l'uso di Power e James, per creare da lì tutto quello che serve (codici sconto, offerte, accessi), più veloce, tutto collegato e funzionante. Riferimento: l'admin di AXUX. Brief per Matt: 04_ACCOUNT_BILLING_PARTNER (admin, 23 ottobre).

**Documento completo del check:** 01_PROGETTO_STATO_E_BRIEF/volwick-check-saas-completo-21ott2026.md e, in versione condivisibile, https://claude.ai/artifact/AAyG16SyH8Ba5AMNWy7rRa

---

## 6. Incoerenze da sistemare

- **Commissione partner.** 15% deciso; alcune pagine vecchie dicevano 30%. Il 21 ottobre la pagina pubblica dice 15%.
- **Prezzo annuale.** Valore deciso $875.76; vecchie pagine e meta mostravano $854.40.
- **Etichetta dell'Account.** Il design mostra "$89 / month", ma durante il mese a $0.99 è meglio mostrare "Primo mese $0.99, poi $89 dal ...".
- **Google.** Supporto e cookie parlano di "Continua con Google", ma il bottone non c'è.
- **Signup italiano.** Il link porta ai Termini in inglese.
- **Menu italiano.** "Lavora con noi" va cambiato in "Diventa partner".

---

## 7. Come lavora Power (regole per chi scrive per lui)

**Testi e copy:**

- Niente trattini come punteggiatura.
- Prosa naturale che non sembri scritta da un'AI.
- Testi corti e dritti al punto, tono semplice che non sembri dare ordini.

**Documenti:**

- Email sempre in doppia versione, italiano e inglese.
- Solo informazione: niente domande retoriche, niente morale, niente chiuse a effetto.
- Scritti in prima persona.

**Con i developer:**

- Quello che esiste già non va presentato come un errore: si sta migliorando insieme.
- Per i bug: solo cosa non funziona.

**Mockup:**

- HTML autonomo che si apre nel browser, da mandare a chi non ha Claude.
- Il file si manda solo a lavoro finito.

**Repo del sito:**

- Commit con `-c user.name=Power -c user.email=sellam.work@gmail.com`.
- Il push lo fa Power da Terminal: `cd ~/dhospitality/volwick-site && git push origin frontend-power`.
- Poi Matt fa il deploy.

**Sicurezza:**

- Nessuna password, chiave o token incollati in chat.
- Niente accessi, pagamenti o acquisti fatti da Claude al posto di Power.

---

## 8. Dove trovare cosa

| Cartella | Contenuto |
| --- | --- |
| 01_PROGETTO_STATO_E_BRIEF | Questo documento, stato, piani, brief e risposte a Matt, check SaaS, istruzioni e memoria di Claude |
| 02_TERMINALE | Test, errori, verifiche, specifiche del terminale; guida e Academy; mockup HTML del terminale |
| 03_SITO_LANDING | Copy, landing, concorrenti, check sito e telefono |
| 04_ACCOUNT_BILLING_PARTNER | Account, abbonamento, offerta, funnel, referral, admin |
| 05_MARKETING_CONTENUTI | Caroselli Beyond Price, campagne, creator, X, video e reel, SEO |
| 07_DESIGN_MARCHIO | Marchio, colori, direzione creativa |
| 08_STRUMENTI | Script del sistema caroselli (auto) e dello studio video |
| 09_CONSEGNE_FILE | PDF, mockup e grafiche già consegnati |
| 11_LIVE_MARKET_REACTIONS | Seconda categoria di Reel: il terminale vero registrato durante il mercato. Registratore, rilevamento eventi, montaggio, prototipo ES del 24 ottobre. Regole nel suo CLAUDE.md |
| volwick-site (repo) | Collegamento al repo del sito su questo Mac |

L'elenco di ogni file con data e cartella è in INDICE.md.

- 23 ott 2026: admin con un solo ruolo, Admin (niente Owner/Marketing/Developer). Power, James e Matt hanno lo stesso accesso completo, 2FA obbligatoria, ogni azione nel registro attività. Mockup definitivo: 09_CONSEGNE_FILE/mockup_html/Volwick_Admin_IT.html (sostituisce Volwick_Admin_Prototype_IT.html).
- 23 ott 2026: admin in versione semplice per Matt. Nuovo da costruire solo: crea/archivia codice sconto in Stripe, accesso omaggio con data di fine, azioni sulla scheda utente (rimborso, disdetta, applica codice, reset password), SEO modificabile, un solo ruolo Admin. Il resto si sposta com'è. Per ora no: cambio prezzo e offerte, campagne email, funnel, blog, contestazioni (restano in Stripe).
- 23 ott 2026: admin versione minima approvata da Power, grafica come AXUX: 7 sezioni (Dashboard, Utenti, Pagamenti, Codici sconto, Supporto, Terminale, Team), un solo ruolo Admin. Nascoste dal menu: Analytics, Partners, Referrals, Data health, Audit log, Settings. Unica cosa nuova: crea codice sconto in Stripe (con scorciatoia Omaggio 1 mese al 100%).
- 23 ott 2026: regola admin di Power: solo le informazioni che usiamo davvero. Tolti ultimo accesso, 2FA e ruoli nel Team, paese e data di iscrizione dalla lista utenti, tipo di pagamento, testi tecnici e sottotitoli. Dashboard con 4 numeri, Team con solo nome, email, invita, rimuovi.
- 23 ott 2026: tolto anche Terminale, admin a 6 sezioni (Dashboard, Utenti, Pagamenti, Codici sconto, Supporto, Team). Ripresi dall'admin esistente: MRR, disdette, Da guardare, Blocca accesso utente. Aperto: Partners (richieste partner e commissioni).
- 23 ott 2026: admin finale (da revisione Power): 7 voci Overview, Clienti, Billing (Pagamenti + Codici), Partner (partner, richieste, commissioni), Avvisi (terminale, tipo, pubblico, date), Supporto, Team. Nuovo: accesso omaggio (free_until), giorni extra (trial_end su Stripe), note cliente, blocca accesso, esporta email, crea codice. Un solo ruolo; 2FA e registro attivi dietro. Dopo il lancio: Better Stack, ruolo Support, MRR nuovo/perso, motivi disdetta dal portale Stripe.
- 23 ott 2026: admin ripulito ancora: Overview 4 numeri senza percentuali; Clienti solo nome, email, stato e 7 azioni; Billing senza numeri in alto; Partner solo richieste e da pagare il 15; Avvisi solo messaggio, tipo, fino al; tolte note, applica codice, verifica email. PDF per Matt 8 pagine.
- 23 ott 2026: Power chiede admin Volwick uguale ad axux.com/admin. Menu a gruppi: Dashboard; Utenti (Tutti gli utenti, Codici sconto, Partner); Pagamenti (Storico pagamenti, Commissioni partner); Supporto; Sistema (Admin, Avvisi). Menu ⋮ per utente come AXUX (modifica dati, piano e scadenza, storico pagamenti, note, reset password, rimborsa, disdici, disattiva). Escluse le parti AXUX non pertinenti (PnL, Usage, Brokers, Credit Ledger, Payments %, Content, Data/AI/API/Plans/Videos/Visibility/COT/Docs).
- 23 ott 2026: aggiunti all'admin stile AXUX i controlli cruciali: contatori cliccabili in Dashboard (pagamenti falliti, contestazioni, ticket, commissioni), riga Feed dati di mercato (stato, ultimo dato, ritardo, simboli; mercato chiuso senza allarme), contestazioni con scadenza, MRR e disdette al posto di Con codice e Netto, Cancella account e dati (GDPR) nel menu utente, accessi sospetti (badge e filtro), Registro attività in Sistema. PDF per Matt 9 pagine.

## 26 ottobre 2026 · Test terminale (30 min, 11:57-12:27 Roma)
- Punti aperti del 22 ottobre: 2, 3, 4, 5, 6, 7 risolti. Punto 1 (print SPY) da ricontrollare con la borsa aperta; su QQQ i block print ora sono spenti.
- Nuovi P1: variazione % BTC sbagliata (Volwick -0.07%, CME novembre -1.21%); Market Intelligence con Top 3/5/10 salta i muri più vicini (ES 7,762.25 a +97 invece di 7,677.25 a +12).
- Da verificare P2: muri stimati SPY/QQQ/NQ quasi tutti negativi; "This month" vuoto su SPY, NQ, RTY, GOLD, BTC; linee dei muri disegnate sotto l'asse del tempo (desktop e telefono); chiamate API fino a 17 s al primo caricamento.
- P3: formato ritardo CDI "3779m54s"; tooltip "biggest print 0 shares"; regola della stella.
- Report: 09_CONSEGNE_FILE/pdf_documenti/Volwick_Test_Terminale_26ott2026.pdf

## 26 ottobre 2026 · Secondo test terminale a borsa aperta (15:07-15:30 Roma)
- Correzione: questa settimana la borsa USA apre alle 14:30 di Roma (cambio ora USA il 1 novembre).
- Nuovi: CDI SPX con minuti quasi vuoti lato server (14:40, 14:52, 14:53, 15:00, 15:21) P1; CDI SPY in ritardo fino a 137 s P2; print e stoppini SPY fuori prezzo anche in RTH (14:54 a 761.8 con mercato 763) P2.
- Ancora aperti: % BTC (base fissa circa 80,613), MI che cambia lettura con Top N (15:12 ES: long, short, balanced sugli stessi muri), This month vuoto, linee sotto l'asse.
- Ridimensionato: muri stimati SPY/QQQ negativi (con book di oggi misti).
- Visti una volta: grafico SPX aperto su un'altra seduta, prezzo ES fermo 2 minuti. Velocità: candles_history fino a 34 s all'apertura.
- Report: 09_CONSEGNE_FILE/pdf_documenti/Volwick_Test_Terminale_Live_26ott2026.pdf

## 26 ottobre 2026 · Giro finale terminale a mercati chiusi (22:21-22:31 Roma)
- Chiusure: 10/11 identiche a Yahoo/Cboe. BTC sbagliato tutto il giorno (base fissa ~80,613; 22:22 -0.65% contro -1.78%).
- CDI SPX: circa 25 minuti su 390 senza dati in tutta la seduta (6 nella prima ora). Non recuperati dopo la chiusura.
- SPY: stoppini fuori prezzo anche alle 20:13 e 20:20 (fino a 762.9 con prezzo 765.3; Yahoo min 765.31).
- Candele tagliate in alto quando si trascina il grafico indietro (scala fissa).
- candles_history: 3 richieste su 37 bloccate 32-38 s anche di notte (GOLD, ES, SPY); ogni cambio mercato riscarica 10 giorni.
- MI a mercato fermo: regime uguale con tutti i Top; il cambio delle 15:12 si vede solo a mercato aperto.
- Lista unica P1/P2/P3 nel report: 09_CONSEGNE_FILE/pdf_documenti/Volwick_Test_Terminale_Finale_26ott2026.pdf

## 26 ottobre 2026 · Errori terminale verificati (versione semplice per Matt)
- PDF con solo errori verificati: 09_CONSEGNE_FILE/pdf_documenti/Volwick_Errori_Terminale_26ott2026.pdf
- P1: CDI SPX minuti senza dati (17:51 $2K, 18:37 $3K, 18:52 $4K, 19:13 $135); variazione BTC; grafico vuoto fino a 37 s al cambio mercato; MI che cambia lettura con il Top (15:12).
- P2: muro sopra MI non il più vicino (SPX 7,700 a +23 con 7,690/7,695 in mezzo); stoppini SPY fuori prezzo; CDI SPY in ritardo; candele tagliate trascinando indietro; This month vuoto; linee sull'asse del tempo; telefono; ogni cambio riscarica 10 giorni.
- P3: formato STALE; asse del tempo BTC irregolare.
- Tolti perché non confermati: stella, tooltip biggest print, Options Flow SPY dalle 12:35, SPX su seduta precedente, ES fermo 2 minuti.
- 26 ott 23:05: PDF errori rifatto con uno screenshot marcato in rosso per ogni errore (11 su 13). Errori 4 (MI con Top N) e 7 (CDI SPY in ritardo) visibili solo a borsa aperta: screenshot da fare domani dopo le 14:30. Corretti gli orari degli stoppini SPY: 20:16 e 20:23 (Yahoo minimo 765.36 e 765.52). Errore "riscarica 10 giorni" unito al 3.

## 27 ottobre 2026 · Test connessione (01:25-01:35 Roma)
- Simulata caduta e ritorno della rete nel terminale (socket chiuso, nuovi tentativi falliti o appesi).
- Errore 14 (P1): se il tentativo di riconnessione resta appeso, Retry mostra "Retrying…" 4 s e non fa nulla; la barra resta. Causa in wsclient.js: connect() esce se this.ws esiste, non chiude il socket appeso, non azzera l'attesa (backoff fino a 30 s), nessun timeout sull'handshake, nessun ascolto dell'evento online.
- Con tentativi che falliscono subito, Retry funziona (riconnesso in 0.6 s), ma senza Retry l'attesa arriva a 30 s.
- Errore 15 (P2): con la borsa USA chiusa, se cade la connessione il terminale scrive "Market closed" e non mostra la barra rossa; prezzo ES fermo come se fosse live.
- Fix proposto a Matt: Retry chiude il socket pendente, azzera backoff e riconnette; timeout handshake 8 s; riconnessione immediata su evento online e ritorno sulla pagina; heartbeat per socket mezzi morti; stato "connessione persa" anche fuori orario per i futures.
- PDF aggiornato: 09_CONSEGNE_FILE/pdf_documenti/Volwick_Errori_Terminale_26ott2026.pdf

## 27 ott 2026 · PDF errori terminale in inglese per Matt
- File: 09_CONSEGNE_FILE/pdf_documenti/Volwick_Terminal_Errors_26Oct2026.pdf (10 pagine, 11 errori).
- Decisione Power: tolti dal report candele tagliate, linee dei muri sull'asse del tempo, telefono, notte senza avviso. Non riaggiungerli.
- Errore 1 (CDI SPX) spiegato per esteso: circa 25 minuti su 390 quasi vuoti, ancora mancanti dopo reload e dopo la chiusura; atteso: minuti recuperati e minuti senza dato segnati come mancanti, non come zero.
- Errori 4 e 7 ancora senza screenshot: si vedono solo a borsa aperta (dopo 14:30).

## 28 ott 2026 · Test landing, registrazione e acquisto (giorno del lancio)
- File: 09_CONSEGNE_FILE/pdf_documenti/Volwick_Test_Landing_Acquisto_28ott2026.pdf (6 pagine, 9 errori). Nessun account creato, nessun acquisto.
- P0: Termini/Privacy/Rischio ancora in bozza (ragione sociale, sede, P.IVA da completare); schede Mercati in home segnate LIVE ma numeri fissi, nessuna richiesta di dati (BTC 119,406 contro circa 81,457 alle 11:45).
- P1: prezzo in home senza "poi $89"; /checkout apribile da non loggati con Account segnato completato; titolo "fanno guadagnare" ed esempio MI con TRADE/STOP; piano annuale $875.76 nei Termini.
- Da provare con account vero: email di verifica, pagina Stripe (serve spuntare la casella del recesso), reset password, contatti e ticket.
