# DOSSIER TECNICO — Sightline (DarkVol → VOLWICK)

Fonte: lettura diretta di `sightline.v814.js` (26.451 righe, ~1,5 MB) e `sight.html`. Nessuna fonte web.
Tutti i numeri, soglie, endpoint ed eventi sono citati come appaiono nel codice. Dove il codice contraddice il marketing o la UI, lo segnalo.

Nota di brand: il codice riconosce tre domini: `volwick` → wordmark "VOL·WICK", `letthebotcook` → "LET THE BOT COOK", `darkvol` → "DARK·VOL", fallback "SIGHT·LINE" (righe ~7125-7131). Il login è un **codice d'accesso di 8 cifre** (nessuna identità utente: il menu account dice "account not linked yet", senza email o piani inventati).

---

## 1. Architettura e fonti dati

### 1.1 Stack client
- Grafico: **Lightweight Charts 4.x** (TradingView open source) + canvas overlay disegnati a mano (`klOverlay` per tide/marker/livelli/etichette muri, `#gammaSurface` per le heatmap, canvas separati per CVD, CDI, OPTIONS FLOW).
- Client realtime: `window.DarkVol.client` (websocket), `api` (REST), autenticazione con header `X-Session-Token` (sessionToken + xorKey in localStorage).
- Timeframe: 1m / 5m / 15m / 1h / 4h / D, aggregati **in memoria** dalla storia a 1 minuto già caricata ("no refetch").
- Storia candele: 10 giorni di trading (30 con `?surfday=`, 2 nei pannelli embed). ES ≈ 10.850 barre 1-min su 10 giorni.

### 1.2 Endpoint REST (trovati nel codice)
| Endpoint | Uso |
|---|---|
| `/api/mm_gex/{SPX|VIX}?metric=GEX|CEX&time_slot=HH:MM:SS` | Libro dealer "signed" per strike e per scadenza (campi `strikePrice, expirationDate, netValue, callValue, putValue`, `cached_slots`, `date`, `time_slot`). |
| `/api/uw_gex/{ticker}` | Unusual Whales `gex_levels` (solo gamma, non firmato). **Morto dal 2026-06-23** ("gex_levels = 0 rows, disabled at 3 startup sites"). |
| `/api/gamma_heatmap/{ticker}`, `/api/gamma_heatmap_slots/` | Legacy, citati nell'header ("deprecated gamma_heatmap table"); `loadSlots()` ora è un no-op. |
| `/api/uw_delta_impact/{ticker}` (`api.getDeltaImpact`, since=now−14h, points=100000) | Backfill della linea CDI cumulativa. |
| `/api/spike_history/{sym}?hours=480&limit=30000` | Barre al minuto dei premi call/put 0DTE (CDI). Ri-pull ogni 10 s. |
| `/api/last_rth_offset` | Base ES−SPX "canonica" (mediana ultima ora RTH). Rifiutata se `source` inizia con `fallback` o `rth_date` nullo. |
| `api.getRecentTrades(sym,{hours,minSize,limit})` | Trade dal DB: 24 h al caricamento, 240 h (tetto API) su richiesta; limit 250.000 (fallback 50K/20K). |
| `api.getCandlesHistory(sym, days)` | 10 giorni di candele (max 30). |

### 1.3 File statici "live" pubblicati da daemon server (`/static/dvol/live/…`)
- `SPX_replay.json` — superficie greche SPX di oggi, uno slot ogni 5 min, slot corrente ri-prezzato ~ogni 60 s (campo `asof`). Include per slot e per bucket DTE (`all/0dte/weekly/monthly`) un array `forcedFlow` con `gamma, charm, vega, volga` per griglia di prezzi.
- `SPX_replay_<YYYY-MM-DD>.json` — archivio giorni passati (`?surfday=`).
- `SPX_morning_proj.json` — **libro delle 09:20 congelato e proiettato** sull'intera giornata ("built once ~09:35").
- `SPX_afterhours.json` — proiezione after-hours dal book delle 16:00 (esclude lo 0DTE già scaduto), unita (non sostituita) al giorno RTH.
- `VIX_replay.json` — superficie del book VIX (somma su tutte le scadenze: niente split DTE).
- `SPX.json` / `VIX.json` — overlay HEDGING (poll 15 s, daemon ri-prezza ogni 30 s) — pulsante rimosso il 2026-07-22.
- `SPX_dex.json`, `SPX_dex_replay.json` — DEX (delta dealer) **auto-calcolato** dal book NET_POSITION.
- `oi_walls_<T>.json` — livelli OI stimati per SPY/QQQ/NQ/RTY/GOLD/BTC, scritti **ogni 10 min in RTH** (client poll 60 s).
- `oi_surface_<T>.json` (+ `_afterhours`, `_<data>`) — superficie greche naive-OI per gli stessi ticker.
- `oi_overlay_SPX.json` — OI EDGE (top-15 per open interest + posizione MM).
- `optflow_<SPX|SPY>.json` — pannello OPTIONS FLOW (poll 10 s).
- `bot.json` — marker del bot (ESCLUSO, vedi §14).

### 1.4 Eventi WebSocket
| Evento | Contenuto / cadenza |
|---|---|
| `snapshot` | Barre iniziali + seed stato VIX. |
| `onTrade(sym)` | Trade tick per ticker (ES_F, MES_F, NQ_F, VX_F, RTY_F, BTC_F, GC_F, SPY, QQQ…). Lato aggressore: campo `side` 'A'/'B' o codici condizione iniettati dal backend **9001 = buy (ask lifted), 9002 = sell (bid hit), 9003 = neutro** su trade Databento. Codice Polygon **14 = intermarket sweep**. |
| `spx_pro_update` / `vix_pro_update` | Prezzo indice SPX/VIX ~1/s (candela server a 5 min scartata; il client costruisce barre 1-min). VIX sempre sottoscritto per il pannello bias. |
| `godmode_tide_boot`, `godmode_tide_boot_more`, `godmode_tide` | Liquidity Tide: boot ~30k + 12×40k colonne (fino a 500.000), poi 1 colonna/~1 s. Subscribe via `client._send({action:'subscribe', channel:'godmode_tide', symbol})`. Watchdog client: re-subscribe se >45 s senza colonne (controllo ogni 6 s). |
| `u_opt` | ~ogni 0,5 s: cumulativi delta-impact opzioni per simbolo (c, p, tot, 0DTE, single-leg, z). |
| `spike_history`, `spike_bar`, `spike_current` | Premi call/put 0DTE al minuto (barra chiusa / minuto in corso ~ogni 0,25 s). |
| `watchdog_alert` | `kind:'uw_options_stale'` → banner "⚠ CDI auto-recovery … reconnecting…" (30 s). Backend "Case D": ≥2 ticker principali silenziosi in RTH. |

### 1.5 Vendor (come dichiarato nel codice)
- **OptionsDepth** ("OD"): posizioni **market-maker nette firmate** per strike/scadenza (`customer_type=mm`, `net_value`). Il codice **nasconde deliberatamente il nome** ("vendor name stripped"; regex costruita a runtime `['op','tions','depth']` per non far comparire la parola). Nella UI appare come fonte "signed".
- **Unusual Whales ("UW")**: `uw_gex`, `uw_delta_impact`, `u_opt`, watchdog `uw_options_stale`. `gex_levels` UW è dismesso dal 2026-06-23. I nomi `uw_*` restano sui canali delta-impact.
- **tastytrade**: feed indice SPX ("databento futures + tastytrade index"), tide /VX, OI "tastytrade Summary" (OI EDGE), collector 0DTE `tasty_cdi_ingest` (SPXW) e `tasty_spy_cdi_ingest` (SPY) per OPTIONS FLOW; **DXLink** (skew reale) per il vanna SPX.
- **Databento**: trade futures CME con lato aggressore.
- **Polygon**: condizioni trade equity (sweep = cond. 14).
- **Massive**: open interest live sugli ETF (SPY/QQQ/IWM/GLD/IBIT) per i ticker senza book dealer.

### 1.6 Cosa è auto-calcolato (IP proprietario)
- **Superfici greche** (gamma/charm/vega/volga) da un motore "NET_POSITION" proprio: posizioni OD × greche ri-prezzate in-house per ogni slot di 5 min ("from OUR OWN NET_POSITION engine").
- **DEX** (delta dealer) e mappa **DELTA** (integrale della gamma, ri-azzerata allo spot: "how many deltas of futures must change hands to get between them").
- **Liquidity Tide** (motore `tide_engines` in `venator_main.py`).
- Base ES−SPX live (EMA), proiezioni 9:20 e after-hours, livelli OI stimati, tutta la logica di VERDICT/PLAN/regime/compass.

---

## 2. Dealer Walls (muri dealer)

### 2.1 Fonti per ticker
- **SPX, VIX** → `/api/mm_gex` (OD firmato).
- **ES_F, MES_F** → book SPX traslato di `offset = ES − SPX`. **VX_F** → book VIX **a valore facciale** (offset forzato a 0 dal 2026-07-23: le opzioni VIX sono cash-settled e la base VIX↔VX è instabile e "si inverte durante uno spike").
- **SPY, QQQ, NQ, RTY, GOLD, BTC** → livelli **OI stimati** (vedi 2.6), non un book dealer.

### 2.2 Metriche
UI: **GEX · CEX · ALL · DEX** (VEX esiste nel codice ma non è nel selettore; tooltip: "SPX/ES (GEX/CEX) + VIX (GEX only, twice-daily)").
- GEX = gamma (valori OD già in **$M per punto**; per VIX "per 1 vol-point").
- CEX = charm (legenda HTML: "$M/5min").
- DEX = delta dealer auto-calcolato (unità grezze di book, niente $: "no invented conversion").
- ALL = GEX + CEX + DEX insieme; stili linea: GEX pieno, CEX tratteggio largo, DEX tratteggio medio. In ALL il Top-N viene **diviso** tra le metriche: `perMetricCount = max(3, round(walls/3))` (0 se Off).

### 2.3 Convenzioni di segno e colori (4 colori)
Colore = call/put dominante × segno netto:
- Call · long γ (verde `#4ade80`) — "Suppressive resistance — dealers defend, fade rallies"
- Call · short γ (ciano `#22d3ee`) — "Accelerative — breakouts above can run fast"
- Put · long γ (rosso `#ef4444`) — "Suppressive support — dealers defend, fade dips"
- Put · short γ (magenta `#e879f9`) — "Accelerative — breakdowns below can run fast"
CEX: carica positiva = "time pulls DOWN (dealers SELL as time decays)", negativa = "time pulls UP". DEX: MM long δ call = clienti hanno venduto call, ecc.

### 2.4 Selezione e ranking (Top-N)
- Opzioni: **Off, Top 3, 5, 10, 15 (default), 25, 40**.
- Finestra candidati: parte da **±1,5%** dello spot, si allarga di 0,5% fino a **±5%** se non ci sono abbastanza strike; fallback in "strike" (mediana gap × N) per strumenti a basso prezzo come VIX (dove ±5% < 1 strike).
- Punteggio: `|net| × exp(−((K−spot)/σ)²/2)`, σ = 1% dello spot. Poi Top-N.
- Gerarchia visiva a 5 tier per rango: #1 sempre tier 5 (4px, 100%, ★ unico), #2 tier 4, poi soglie 45%/75%. Linee disegnate su canvas con dissolvenza a sinistra, glow e peso proporzionale; etichette in una "corsia" propria a destra, de-sovrapposte.
- Asse prezzi: i muri possono allargare l'asse al massimo di `0.75 ×` il range delle ultime 200 candele (min 0,25% del prezzo) → "candles keep ≥40% of the pane".
- Tooltip hover: strike (su ES "SPX 7700 → ES 7713.00"), tipo, effetto, call/put firmati, nota unità.

### 2.5 Filtri scadenza
**All / 0DTE / This week / This month**, calendario ET, **solo in avanti da oggi** (dal 2026-08-23: "a contract that expired on Tuesday exerts no hedging pressure on Thursday"). All ≈ fino a ~60 DTE. Contatore di strike unici su ogni pulsante; 0DTE disattivato se 0 ("No contracts expire today"). Se il filtro svuota, i muri si tolgono (nessun muro "fantasma").

### 2.6 Proiezione SPX → ES/MES (base)
- `recomputeOffset`: solo in RTH, `new = 0.9·old + 0.1·(ES−SPX)` (EMA) perché i due feed tickano in istanti diversi (jitter ±0,5 pt). Muri ri-disegnati solo se la base si muove ≥ 0,25 pt.
- Seed da localStorage, poi `/api/last_rth_offset`; se il server restituisce un fallback, lo scarta e la status bar mostra "**estimated**". Default 38 se nulla. Bound [0,200] (il commento documenta una base reale di 71,22).
- **Offset "bloccato" al fetch** (`_mmGexLockedOffset`): ogni strike di un book è traslato dello stesso numero, e la status bar mostra esattamente quel numero ("the number written in the status bar has to be exactly the number used to place the walls").

### 2.7 Cadenze
- Poll ogni **60 s** (throttle 30 s), finestra dati **09:00–16:00 ET**. OD pubblica slot ogni 5 min (~2:30 dopo il confine); commenti e replay parlano di book a **10 min** per GEX/CEX (VEX storicamente orario/30 min).
- **Burst** all'apertura (0/5/30/60/120/180/240 s) e a ogni confine di 5 min; burst di +1:40/+2:10/+2:40.
- Retry su vuoto: +60 s, +60 s, poi attende il ciclo.
- Colore età dato: verde <2 min, ambra <12 min (VEX <~32 min), rosso oltre.
- **Banner STALE rosso** se la data servita < oggi ("STALE - SHOWING <data> BOOK, NOT TODAY"), nato dall'incidente del 2026-08-05 (vendor vuoto, back-end servì silenziosamente il book di ieri). **Avviso 16:00**: "16:00 BOOK - NEXT SESSION EXPIRY (todays 0DTE settled + excluded)". Nessuno dei due può essere nascosto dall'utente.

### 2.8 Book VIX, OI EDGE, 9:20
- VIX: GEX, "twice-daily" (tooltip). Superficie VIX somma le scadenze (toggle DTE inerte, dichiarato).
- **OI EDGE (beta)**: top-15 strike per OI (entro ±150 pt, OI ≥ 50) con % detenuta dai MM; verde = dealer net long ("defends/holds"), rosso = short ("accelerant"); linee tratteggiate, spessore 2 se quota MM ≥ 40%. Hover: OI call/put, posizione MM, GEX e CEX per gamba. SPX/ES/MES.
- **Book mattutino congelato**: preset possono "pinnare" i muri allo slot 09:20 mentre heatmap e candele restano live. Guida: "Those are positions traders held overnight — real open interest… verifiable, they don't move".

### 2.9 Livelli OI per ticker senza book (SPY/QQQ/NQ/RTY/GOLD/BTC)
- Da OI live Massive sull'ETF corrispondente (SPY, QQQ, IWM, GLD, IBIT), strike tradotti con rapporto **misurato** ogni run: QQQ→NQ ~41,25; IWM→RTY ~10,08; GLD→GC ~11,06; IBIT→BTC ~1774×.
- Convenzione "naive": clienti short call / long put ⇒ dealer +γ sulle call (verde) e −γ sulle put (magenta). Valori "$ per 1% move".
- Etichettati onestamente: status "OI levels · N strikes · estimated from <ETF> open interest (not a dealer book)"; hover "estimated from … open interest · not a dealer book". Se mancano: avviso a schermo "<X> has no dealer book".

---

## 3. Heat map (superfici)

Pulsanti: **γ MAP, CHARM, VEGA, VOLGA, DELTA, 9:20 PROJ** (+ OI EDGE).
- **Assi**: X = tempo (una colonna per slot di **5 min**), Y = prezzo (griglia `forcedFlow`, interpolata linearmente fino a 5 sotto-celle per passo). Canvas sotto le candele (z-index 0).
- **Colore**: rampa continua di 32 step verde (positivo) / rosso (negativo), alpha 0,14→0,72 ("owner-approved ramp"); intensità per percentili p40/p70/p88/p97 **su scala dell'intera giornata** (opzione per-slot disattivata), curva ^1,3.
- **Charm e Delta negati solo per il colore**: verde = dealer COMPRANO (supportivo), rosso = VENDONO ("the exact misread that cost money").
- **Linee di flip**: per ogni colonna, zero-crossing del metric interpolato, disegnato come **tick oro** (non una linea continua, per non "mentire sulla continuità"). Se non ci sono cambi di segno la legenda dice "no sign change in this book" (misurato: la gamma SPX spesso non ha zero-crossing, il charm ne aveva 18).
- **Unità**: solo la gamma ha unità derivabile (**M$ per punto** = valore × spot / 1e6); charm/vega/volga in unità grezze ("Inventing a conversion would put a number on screen that means nothing").
- **Proiezione in avanti**: l'ultimo slot si estende ~6 slot (~30 min) oltre il proprio timestamp.
- **Hover**: valore sotto il cursore (ricerca binaria sulla griglia non uniforme) con prezzo "cursor".
- **Refresh**: file ricaricato ogni 60 s (tranne 9:20 PROJ, statico).
- **After-hours**: dopo le 16:05 fino alle 09:20 ES/MES (e ticker OI) estendono il giorno con la proiezione, con guardia anti-collisione di etichette.
- **Archivio**: `?surfday=YYYY-MM-DD` con badge "◀ REPLAY".
- Libri: SPX (SPX/SPXW/ES/MES), VIX (VIX/VX), OI (SPY/QQQ/NQ/RTY/GOLD/BTC). Banner rosso se la superficie OI è di un giorno precedente.
- Significati dalla guida: VEGA verde = dealer long vol (smorzano uno spike), rosso = lo amplificano; VOLGA verde = auto-correttivo, rosso = cascata. "**Red VEGA + Red VOLGA = coiled spring**". "VEGA/VOLGA say nothing about up or down".

---

## 4. Liquidity Tide ("GOD MODE")

**Cos'è**: un nastro di order flow reale che sostituisce/sovrappone le candele. Colonne server a ~1 s con campi: `p` prezzo, `v` volume, `col` ∈ [−1,+1] (direzione × convinzione; −1 venditori, +1 compratori), `thk` (spessore/convinzione), `mode` ('A' = assorbimento), `mx` (stampa più grande).
- Buffer fino a **500.000 colonne** (~4 giorni; SPY/BTC 250.000).
- **Colore del nastro**: grigio → verde (compratori) o rosso (venditori) lineare in `col`. Assorbimento = anima chiara sottile.
- **Volume rolling 5 s** (`vr`) + VWAP rolling 5 s per ogni colonna.
- **Scala per strumento** `sf = min(1, ((vr − off)/scl)^1.3)`, calibrata sulla distribuzione reale del 5s-volume: ES off 500/scl 1600 (bianco ≈ >p99); VX 90/330; NQ 175/560; RTY 70/145; SPY 50000/40000; BTC 4/24; GOLD 68/482.
- **Glow bianco** sul nastro quando sf > 0,15 (onset `off + 0,2324·scl`; ES ≈ 872 lotti/5s).
- **Barre bianche ("SIZE bars")**: solo **picchi locali** con sf_raw tra **0,22 e 3,0** (sopra 3 = artefatto di feed), non su discontinuità >120 s; ancorate al **VWAP dei 5 s** ("where the heavy lots actually transacted"); larghezza in pixel fissi `8 + 10·min(3.5, sf)` (confrontabile a ogni zoom); piazzate dalla più grande, senza sovrapposizioni.
- **Tacche ambra (slow absorption)**: ≥4 colonne consecutive `mode='A'` (gap ≤6 s) con `thk ≥ 0.6` e `vr` tra `off` e l'onset della barra bianca (`off + 0,4753·scl`) → "the quiet iceberg-absorption the white spike can't catch".
- **Lettura hover**: "BUYERS winning" (col > 0,12) / "SELLERS winning" (< −0,12) / "ABSORBED / balanced"; forza strong > 0,66, moderate > 0,33; size HEAVY/medium/light con soglie (ES hi 900/md 300; VX 150/50; NQ 310/105; RTY 165/45; SPY 50000/25000; BTC 10/2; GOLD 180/52); "flow (5s)" in lotti, "biggest print (5s)", "ABSORPTION — passive side eating aggression (reversal tell)" oppure "momentum — initiative pushing price", orario ET al secondo.
- Su SPX/SPXW: usa la tide ES traslata della base live; **niente nastro**, solo barre bianche (per non mostrare un secondo prezzo).
- Candele sotto la tide ON di default (pulsante CANDLES ON/OFF). Griglia di minuti tenue. Ottimizzazioni: decimazione che conserva la colonna più pesante, append incrementale.
- **Coiled spring** (overlay HEDGING, ora dormiente): flusso tide 90 min per bin di 2 pt vs gamma dealer; vendite dentro il supporto / acquisti dentro la resistenza = "FIGHT".

---

## 5. Flow markers (blocchi, sweep, mega) e Levels

### 5.1 Soglie `FLOW_THRESHOLDS` (size, non premio)
| Ticker | unità | min | mega | cluster | levelTick |
|---|---|---|---|---|---|
| ES | contratti | 100 | 300 | 1.0 | 2.5 |
| MES | contratti | 60 | 150 | 0.5 | 1.5 |
| NQ | contratti | 20 | 60 | 5.0 | 10.0 |
| MNQ | contratti | 500 | 1500 | 2.5 | 5.0 |
| SPY / QQQ | azioni | 5.000 | 50.000 | 0.10 | 0.25 |
| SPX | — | 1 | 100 | 5 | 10 |
| VIX | — | 100 | 500 | 0.5 | 1 |
| VX | contratti | 25 | 100 | 0.05 | 0.5 |
| RTY | contratti | 50 | 60 | 0.5 | 1.0 |
| BTC | contratti | 2 | 10 | 5 | 25 |
| GOLD | contratti | 10 | 50 | 0.5 | 1.0 |
Soglie ricalibrate su distribuzioni misurate (es. GOLD: p99=6, min 10 ≈ p99.7; MES era irraggiungibile a 500). Min personalizzabile per ticker.
- Sweep solo equity (cond. 14); futures sempre "block".
- Modalità FLOW: **Off / All / Mega**. Marker = pillole quadrate con numero dentro, **argento normali, oro mega**, raggruppati per (minuto, cluster di prezzo, tipo), max 250 per schermo, max 600 in memoria; de-sovrapposizione con filo verso il prezzo reale. Tooltip: "BLOCK/SWEEP CLUSTER ×N", totale minuto, 5 stampe più grandi.
- Marker e livelli sono **mostrati solo con Liquidity Tide attiva** ("The Tide switch is the master for everything the Tide draws").

### 5.2 LEVELS (zone di blocchi)
- **Today** (dalle 09:30 ET) o **All** (~10 giorni, 240 h).
- Clusterizza per `levelTick`; qualifica se **≥3 stampe** (fallback ≥2); punteggio `totale × log10(count+1) × (1 + min(1, minutiDistinti/30))`; **Top 10** zone.
- Tier per ratio (0,70/0,40/0,20): il più forte **oro**, gli altri **argento**; badge ★★/★; linee **tratteggiate** (per distinguerle dai muri dealer). Etichetta "prezzo size · N blocks". Tooltip "KEY LEVEL · MEGA / SWEEP-DOM", primo tocco.

---

## 6. CVD, CDI, OPTIONS FLOW

### 6.1 CVD (Cumulative Volume Delta)
- `+size` se aggressore buy, `−size` se sell, dai trade (side o codici 9001/9002). Neutri scartati. Bucket 1 min, dedupe, ricostruzione su backfill fuori ordine.
- **Per sessione ET**: ogni sessione riparte da zero ("ten sessions = ten climbs"); nessun zero inventato prima del primo trade.
- Default: **ON sui futures, OFF sugli equity** ("unreliable aggressor side"); SPX/VIX nessun feed trade.
- Guida: "If price rises but this falls, the move isn't real — fade risk."

### 6.2 CDI (Cumulative Delta Impact) — **0DTE-only dal 2026-05-15**
- Mapping: SPX/SPXW/ES/MES → **SPXW** (SPX non ha 0DTE: archivio 39.922 righe SPXW con premio 0DTE vs 5 SPX); SPY → SPY (secondo pannello fisso `SPY_0DTE`, stesso interruttore); QQQ/IWM nel resolver; resto "n/a".
- **Barre** (visual primario): premio **call 0DTE per minuto (verde, su)** vs **put (rosso, giù)**, scala lineare in $ con tetto `min(max visibile, p95×3,5)`, etichette $ sulle 5 maggiori, hover con net e totale. In fallback, delta minuto per minuto dalla serie `u_opt`.
- **Gambe**: `sl` single-leg (default), `ml` multi-leg (= all − sl), `all`.
- **Freschezza**: verde < 30 s ("live"), giallo 30 s–3 min, rosso ≥ 3 min "STALE Xm Ys".
- Storico fino a 30.000 barre / 100.000 punti.

### 6.3 OPTIONS FLOW (pulsante "FLOW")
- Premio **single-leg 0DTE** cumulativo per lato: **C = call comprate all'ask − call vendute al bid** (verde), **P = put vendute − put comprate** (rosso, negativo = ribassista), **NET** grigio = somma. "Dollars of PREMIUM, not delta-weighted. Trades inside the spread carry no side." Disponibile SPX/ES/MES (SPXW) e SPY. QQQ esplicitamente **null** ("QQQ displayed SPY'S FLOW UNDER QQQ'S NAME" – corretto).

---

## 7. "READS THE CHART" — Market Intelligence

Pannello ancorato a destra, 4 blocchi fissi: **VERDICT · WHY · THE PLAN · LEVELS ON THE CHART**. Richiede fonte firmata → SPX, ES, MES, VIX, VX. Si aggiorna ogni 2 s (congelato in replay).

> Nota: il blocco **WHY** esiste nella UI ma `paintWhy()` **non è definita** in questa build → sezione vuota/placeholder.

### 7.1 VERDICT = Direction Compass + Magnete + PIN
**Compass** (single-score, ±10):
- Banda ±2,5%, σ = 0,5% spot. γ-gravity center = media prezzi pesata `|net|×prossimità`; `gLean = centro − spot`; asimmetria massa sopra/sotto; vLean analogo sul VEX.
- `raw = 0,30·gLean + 0,40·vLean + 8·asym` (VIX "dropped — 52% acc = noise"), clamp ±10, **media delle ultime 3 letture**.
- Tier: **HIGH ≥7, MED ≥3, LOW ≥1, NEUTRAL <1** → "LONG/SHORT <ticker>", "conviction · score".
- Verbi d'azione per 90 s sulle transizioni: **ENTER NOW, CLOSE POSITION, FLIP, TRIM HALF, ADD BACK**.
- **Velocity override**: se lo spot si è mosso ≥5 pt in 30 min contro il segno del compass → forzato NEUTRAL ("Only ever DOWNGRADES conviction").
- Backtest nel commento: 4/4 giorni chiamati dalla media del mattino; HIGH-conviction intraday 61% (35/57); 82% nel trend day +64 pt.

**Magnete γ+**: strike con γ positivo massimo entro ±30 pt. Se net < 120 → "⚠ WEAK γ — no pin, BREAKOUT RISK"; se ≤3 pt → "● PINNED"; altrimenti "LEAN LONG/SHORT — strong γ magnet pulling price".

**PIN (charm-pin magnet)**: nel band ±2,5% lo strike con |charm| massimo, se ≥75, quota >5%, distanza >10 pt; forza = mag × min(8, 1/max(0,25, ore residue)); **⚡ ACCELERATING** se ≥1,8× la lettura precedente sullo stesso strike con <4 h al close. Se Σ|charm| > 5×|Σγ| → "CHARM-DRIFT — regime is time-decay-driven".

### 7.2 THE PLAN = Trade Setup + regime
**Classificazione strike** (±2,5%, |net| ≥ 5): callShare ≥ 0,65 = call-dom, ≤ 0,35 = put-dom.
- real_ceiling (call-dom sopra, γ+), real_floor (put-dom sotto, γ+), stale_floor (call-dom sotto: "40% breach"), weak_ceiling, mixed, short_g_above ("Rejection wall"), short_g_below ("Breakdown trigger").
- **Cancellazione di coppie opposte**: vicini entro 10 pt con peso gaussiano σ 7,5 pt; "neutralizzato" se ≥60% cancellato ("↔K").
- Ranking `magnitudoEffettiva × gaussiana(σ=0,5% spot)`.
- **Probabilità di tocco (first-passage)**: `P = 2·N(−d/(spot·σ_T))`, `σ_T = VIX_eff/100·√(ore/(252·6,5))`; VIX_eff = VIX×0,6 in γ+, ×1,3 in γ−; soglia **30%**. Ore al close dallo slot in replay.
- Gerarchia fino a 3 muri per lato: IMMEDIATE / DOMINANT (★) / CASCADE (→).
- Storia del giorno dalle candele: tocco ±3 pt, rottura con chiusura oltre ±2 pt; ≥2 rotture = **failed → MOMENTUM**; ≥4 test senza rotture = strong hold.
- Velocità 5 barre: >1,5 pt/min verso il muro = STRONG_APPROACH ("FADE NOW"/"BREAKING"), <0,5 e <5 pt = STALL ("BREAK SETUP"), < −1 = REVERSING ("FADE LATE").

**Regime** (aggregato firmato): >+50 → **RANGE-BOUND DAY** ("Dealers DAMPEN moves · sell into ceiling, buy into floor"); <−50 → **TREND DAY** ("follow momentum through walls"); altrimenti **MIXED REGIME** ("wait for a confirmed level break"). Mostra "Range floor ↔ ceiling (Npt) · Net hedge $".

**Trade Setup** (con isteresi: serve 2 letture consecutive per cambiare): **PIN** (entrambi i muri <0,5% e spot centrato: "Sell KC / KF · long wings ±10", stop ±1), **RANGE** (<1% + γ+), **CEILING TEST / FLOOR TEST** (spot sbilanciato >30% verso un muro o muro vicino <1%), **WIDE RANGE** (1–2,5%), **TREND DAY** (γ−), **DRIFT/NO STRUCTURE**. Conviction HIGH/MED/LOW/NONE; riga **pivot** = strike short-γ nel Top-5 per |γ| entro ±10 pt con |net| ≥ 15.

**Info badge**: flip di composizione call↔put (soglia 50%, |net| ≥10, 10 min), **VACUUM ↑/↓** (nessun muro reale entro 50 pt), short-γ entro 10 pt, **FLOW ALERT 🌊** (Δnet ≥ ±15 tra slot con lean ≥65%, solo "build", 60 min; 57% su 5 giorni n=122, 59% sui build n=58).

**Reaction levels**: Sell zones (γ+ sopra) e Buy zones (γ+ sotto), top 3 ordinati per prossimità entro 35 pt (eccezione ATM ±3 pt).

### 7.3 Regime Badge (pannello walls)
Somma net entro ±2% dello spot; tilt = net/gross; >+5% POSITIVE, <−5% NEGATIVE, altrimenti BALANCED; testo per metrica ("Suppressive — dealers fade moves" / "Accelerative — dealers chase moves").

### 7.4 Now Look Here
Strike entro ±2% con punteggio `|net| × exp(−d²/2σ²)` (σ 0,5%): **top 3 magneti** (net>0, "🧲 Where market WANTS to go") + **top 2 pericoli** (net<0, "⚡ Danger — runs if breached"). Ruoli per metrica: GEX Magnet/Squeeze, CEX Pin Down/Pin Up, VEX Vol Bull/Vol Bear, DEX Long Δ/Short Δ; senza segno: 🛑 resistenza / 🛡 supporto.

### 7.5 Dealer Positioning (layer Gamma / Charm / Vanna)
- Pesi: **GEX 0,75, Charm 0,00 (solo informativo), Vanna 0,25**. Charm con segno invertito (empirico 2026-05-15: 72% a 60 m dopo il flip, n=29) ma escluso dal voto.
- GEX score: rapporto call wall / put floor su scala log (≥2× → ±0,6…).
- **Vanna**: attivo solo se **|ΔVIX 5 min| > 0,15 pt**; VIX in calo × VEX positivo = BID; saturazione a 0,5 pt. Nel replay il vanna è omesso ("Better to omit than to mislead").
- Accordo ≥2 layer ×1,15 (TRIPLE STACK / STACKED), disaccordo ×0,6 (MIXED FORCES); direzione UP/DOWN a ±0,30; confidenza 0,50–0,95.
- **Attenzione**: il VEX non è più richiesto dal client (selettore senza VEX; ALL scarica solo GEX+CEX) → in pratica il layer Vanna resta "—".
- **Hedge by expiry**: somma γ entro ±0,3% dello spot divisa in Today / This wk / This mo + "Total at price: $X/pt".

### 7.6 Cose ritirate (onestà)
Target line "🎯" ritirata il 2026-07-09 ("unreliable magnet pick"); linea zero-flip disattivata (sostituita dai tick sulle heatmap); PATH pill "empirically falsified (42%)"; TRAMPOLINES rimosse ("fired in 37 of 38 slots"); pannello CONTEXT e pulsante HEDGING rimossi.

---

## 8. Replay (ESCLUSO dalla landing)
Barra REPLAY che avanza lo scrubber snapshot (book a 10 min, `SLOT_MS 600000`), velocità **1×/10×/30×/60×** (10× ≈ 42 slot in ~40 min), passo per candela. Candele **clippate al tempo di replay** (`__candleClock`, "the candles obey the replay clock", nessuna barra futura), spot e ore-al-close presi dallo slot, marker rosso verticale, guard "backend served another slot → treat as empty", vanna omesso. Giorni archiviati con `?surfday=`.

## 9. Layout (ESCLUSO)
1–5 grafici (1→2→3→4→5), **PRO LAYOUT / "COMMAND DECK"** (ES pinned 09:20 · SPX 0DTE VEGA · SPX VOLGA · VX γ), **"CREATOR'S VIEW"/FOCUS VIEW** (ES · SPX charm · SPY · NQ con tide), preset RECOMMENDED (ES, Top 5, ALL, CVD on), "Save as preset", "Copy to all", stato di apertura di default del proprietario (ES, tide, γ map, CDI, Top 15).

## 10. Alert e watchdog
- **HEAVY-FLOW ALERTS**: suono (880/1320 Hz) + toast quando compare una barra bianca della tide; finestra 5 s, **cooldown 45 s**, re-arm sotto il 60% dell'onset; ticker SPY, ES, MES, NQ, RTY, VX, BTC, GOLD; funziona anche da pannelli embed; stato diagnostico e "TEST ALERT".
- **LEVEL ALERTS**: "Within N points of <livello> on <ticker>" scelti tra gli 8 livelli visibili più vicini; stati Armed/Triggered/Paused; scatta **una sola volta**; rifiuta livelli >20% dal prezzo (min 25 pt) "it could never fire".
- **Watchdog**: `watchdog_alert` per feed opzioni fermi; keep-alive tide 45 s; batch watchdog 20 s; prezzo congelato mostra tag cavo; "Market closed" (punto grigio) distinto da "Disconnected".
- **Spike**: barre premio 0DTE al minuto (`spike_bar`/`spike_current`) con etichette sui 5 picchi.

## 11. Dark pool / off-exchange — ESITO
**Nel codice NON esiste alcun dato dark pool.** Grep di `dark` (escluso darkvol/colori), `ATS`, `TRF`, `FINRA`, `off-exchange`, `OTC`: **zero** occorrenze rilevanti (solo "dark" come colore). Non c'è attribuzione di venue: le stampe SPY/QQQ sono classificate solo per **dimensione** (≥5.000 azioni) e condizione 14 (sweep). I "blocchi" futures sono trade CME grandi, non block trade negoziati. **Non dichiarare dark pool nella landing.**

## 12. Ticker e disponibilità
Barra: SPX, ES, MES, NQ, VIX, VX, RTY, SPY, QQQ, BTC, GOLD (in codice anche SPXW, MNQ).

| Modulo | SPX | ES/MES | VIX | VX | SPY | QQQ | NQ | RTY | GOLD | BTC |
|---|---|---|---|---|---|---|---|---|---|---|
| Muri dealer firmati (OD) | ✔ | ✔ via base | ✔ GEX | ✔ facciale | — | — | — | — | — | — |
| Livelli OI stimati | — | — | — | — | ✔ | ✔ | ✔ (QQQ) | ✔ (IWM) | ✔ (GLD) | ✔ (IBIT) |
| Heat map | ✔ | ✔ | ✔ | ✔ | ✔ OI | ✔ OI | ✔ OI | ✔ OI | ✔ OI | ✔ OI |
| 9:20 PROJ / OI EDGE / DEX | ✔ | ✔ | — | — | — | — | — | — | — | — |
| Liquidity Tide | barre ES | ✔ | — | ✔ | ✔ | — | ✔ | ✔ | ✔ | ✔ |
| Flow/Levels | — | ✔ | — | ✔ | ✔ | (soglie sì, no tide) | ✔ | ✔ | ✔ | ✔ |
| CVD | — | ✔ default | — | ✔ | off default | off default | ✔ | ✔ | ✔ | ✔ |
| CDI / OPTIONS FLOW | SPXW | SPXW | — | — | SPY | — | — | — | — | — |
| READS THE CHART | ✔ | ✔ | ✔ | ✔ | — | — | — | — | — | — |

## 13. Differenzianti e note di onestà (per il marketer)
- **Posizioni dealer reali, non OI naive**, sui prodotti SPX (fonte firmata MM) + greche ricalcolate in casa ogni 5 min; dove non c'è un book, livelli OI **dichiarati come stime** con rapporto ETF misurato.
- **5 superfici** (gamma, charm, vega, volga, delta) nel tempo × prezzo, con flip visibili colonna per colonna; **proiezione 09:20 congelata** vs superficie live; estensione after-hours.
- **ES/MES agganciati a SPX** con base live EMA e numero di base mostrato ("estimated" se non confermato).
- **Liquidity Tide**: soglie calibrate per strumento su percentili reali (ES bianco ≈ >p99), VWAP 5 s, assorbimento ambra.
- Frasi d'onestà già nel prodotto: "Top 5–10 is the honest read; beyond that is mostly noise"; "dealer positioning is reliable for levels and how volatile things get. It is not a reliable direction predictor — we've tested that many times"; "An empty panel beats a confident wrong one"; banner STALE e 16:00; "estimated from ETF open interest (not a dealer book)"; "live read of now · not a forecast".
- Dati di backtest nel codice (interni, piccoli campioni, **da non usare come claim senza verifica**): direzione a 10 min = 50% (39 slot, 2026-05-14) → modello "levels-first"; tenuta resistenze reali 92%, supporti reali 100%, "stale floor" rotti 40%; contenimento range 100% su 5 giorni; tenuta muri 62–100% per test; compass 61% HIGH (35/57); Flow alert 57–59%; CVD THRUST +1,36 vs −0,95 su 20 sessioni e B/S map 57–60% vs 48% casuale su 15 sessioni (moduli **dormienti/ritirati**, non esposti in UI).

## 14. Funzioni bot — ESCLUSE dalla landing
- Marker "BOT TRADES" (entrate/uscite) da `/static/dvol/live/bot.json` (poll 60 s) su SPY/SPX/ES/MES; toggle "BOT TRADES: ON/OFF"; voce di menu "Trading Bot"; PAPER vs BOT; brand "LET THE BOT COOK". Esclusi anche Replay (§8) e Layout/Pro Layout (§9).
