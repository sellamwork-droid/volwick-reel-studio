# VOLWICK · Content Engine · CE_08 Hook Library

Versione 1, 23 ottobre 2026. Sostituisce come archivio principale CE_01_BANCA_HOOK.md, che resta valida per gli hook già approvati (molti sono ripresi qui). Ogni hook è legato a un concetto del database CE_07_CONCEPT_DATABASE.xlsx tramite l'ID e a un layer della build attuale (CE_06, sezione A).

Gli hook sono in inglese perché è il testo che va a schermo e in voce. La glossa italiana c'è solo dove il senso non è immediato.

## Come si usa

1. Si parte dal concetto scelto nel database, non dall'hook: l'hook serve il concetto.
2. Per ogni video si producono tre candidati (A, B, C del database) e si sceglie con il test qualità in fondo a questo file.
3. In produzione si registra nella scheda CE_04 la famiglia dell'hook usata, così dopo 4 video per famiglia si può confrontare skip rate e sends per reach.

Totale: **150 hook** su 50 concetti, 3 per concetto. Conteggio per famiglia:

| Famiglia | Hook |
|---|---|
| Counterintuitive | 21 |
| Common mistake | 7 |
| Visual anomaly | 31 |
| Specific event | 30 |
| Technical curiosity | 28 |
| Myth explanation | 12 |
| Cause and effect | 21 |

## Counterintuitive

Ribalta un'aspettativa diffusa. Funziona solo se il payoff arriva entro 8 secondi, altrimenti abitua il pubblico a ignorare la promessa (OpusClip 2026).

| Hook (on screen) | Parole | Concetto | Layer | Scopo |
|---|---|---|---|---|
| Price went up. Buying pressure went down. | 7 | BTC-01 | CVD (pannello con barre delta), candele OHLC | SAVE |
| Same volume. Different winner. | 4 | BTC-02 | CVD (barre delta), volume, candele OHLC | SAVE |
| Record volume. Zero net aggression. | 5 | BTC-03 | CVD (barre delta), volume | SAVE |
| Buyers pushed hardest here. Price fell anyway. | 7 | BTC-04 | CVD (barre delta), candele OHLC | SAVE |
| Not every rally is hollow. | 5 | BTC-05 | CVD, candele OHLC | SAVE |
| Red on the chart. Support underneath. | 6 | BTC-06 | Dealer Walls (famiglie colore, valore in $) | SAVE |
| Green above price. Brake, not magnet. | 6 | BTC-07 | Dealer Walls (famiglia verde, tooltip) | SAVE |
| Two supports. One brakes. One accelerates. | 6 | BTC-08 | Dealer Walls (rosso contro magenta, tooltip Accelerative) | SAVE |
| You drew a line. This one has size. | 8 | BTC-09 | Dealer Walls (valore in $) | SAVE |
| The biggest wall isn't the closest one. | 7 | BTC-11 | Dealer Walls (Top N, stella), Market Intelligence (Key strikes) | SAVE |
| Dealer positioning is not a forecast. | 6 | BTC-12 | Market Intelligence (Dealer positioning, Break scenarios), Dealer Walls | SAVE |
| Tight range. Heavy prints. | 4 | BTC-14 | Block Prints | SEND |
| The low of the day had a block. | 8 | BTC-15 | Block Prints (livelli oro con stelle) | SEND |
| Sold puts look red. They're bullish. | 6 | BTC-16 | Options Flow (linee C, P, NET) | SAVE |
| Put buying rose. So did the market. | 7 | BTC-17 | Options Flow (linea P), candele | SAVE |
| The rally nobody paid for. <br>*il rialzo che nessuno ha pagato in premio* | 5 | BTC-18 | Options Flow (NET), candele | SAVE |
| More premium isn't more conviction. | 5 | BTC-19 | CDI (barre per minuto, intestazione C e P) | SAVE |
| Identical charts. Opposite dealer positioning. | 5 | BTC-20 | Exposure Maps (Gamma) | SAVE |
| One line. Two different markets. | 5 | UTS-03 | Exposure Maps (Gamma, gradino bianco) | SAVE |
| Every wall has a price tag. | 6 | UTS-09 | Dealer Walls (tooltip, "dealer P&L exposure per 1-point SPX move") | SAVE |
| Not price. Volatility. A different map. | 6 | UTS-16 | Exposure Maps (Vega) | SAVE |

## Common mistake

Nomina un errore che il trader riconosce in sé. Mai deridere: l'errore è del metodo, non della persona.

| Hook (on screen) | Parole | Concetto | Layer | Scopo |
|---|---|---|---|---|
| Most traders read this wall backwards. | 6 | BTC-07 | Dealer Walls (famiglia verde, tooltip) | SAVE |
| Your support line has no size. | 6 | BTC-09 | Dealer Walls (valore in $) | SAVE |
| Biggest wall on screen. Wrong one to watch? | 8 | BTC-11 | Dealer Walls (Top N, stella), Market Intelligence (Key strikes) | SAVE |
| Most traders chase the big print. | 6 | BTC-13 | Block Prints (rombi oro, barre bianche) | SAVE |
| Yesterday's level. Today's market. | 4 | BTC-21 | Dealer Walls (ora del book sul comando WALLS: grigio, ambra, rosso) | SAVE |
| Check the timestamp before the level. | 6 | BTC-21 | Dealer Walls (ora del book sul comando WALLS: grigio, ambra, rosso) | SAVE |
| Every read should say when it's wrong. <br>*ogni lettura dovrebbe dire quando smette di valere* | 7 | UTS-17 | Market Intelligence (Break scenarios, Invalidation) | SAVE |

## Visual anomaly

Il primo fotogramma mostra già la cosa strana. È la famiglia più vicina a "risultato mostrato nei primi 2 secondi", il tipo di hook più visto nello studio OpusClip su 34.635 clip.

| Hook (on screen) | Parole | Concetto | Layer | Scopo |
|---|---|---|---|---|
| Price just made a new high. The buyers didn't. | 9 | BTC-01 | CVD (pannello con barre delta), candele OHLC | SAVE |
| New high. Fewer aggressive buyers. | 5 | BTC-01 | CVD (pannello con barre delta), candele OHLC | SAVE |
| Two identical candles. Opposite pressure. | 5 | BTC-02 | CVD (barre delta), volume, candele OHLC | SAVE |
| Huge volume. Nobody won. <br>*volume enorme, nessuna parte ha prevalso* | 4 | BTC-03 | CVD (barre delta), volume | SAVE |
| Strongest buying of the day. Top wick. | 7 | BTC-04 | CVD (barre delta), candele OHLC | SAVE |
| Price and pressure, moving together. | 5 | BTC-05 | CVD, candele OHLC | SAVE |
| Same support. Opposite behavior. | 4 | BTC-08 | Dealer Walls (rosso contro magenta, tooltip Accelerative) | SAVE |
| Three touches. Same number. Here's why. | 6 | BTC-10 | Dealer Walls (stella, valore) | SAVE |
| 858 contracts. One trade. Price didn't move. | 7 | BTC-13 | Block Prints (rombi oro, barre bianche) | SAVE |
| The market went quiet. The tape didn't. | 7 | BTC-14 | Block Prints | SEND |
| Nothing moved. Four blocks printed. | 5 | BTC-14 | Block Prints | SEND |
| Look where the biggest trade printed. | 6 | BTC-15 | Block Prints (livelli oro con stelle) | SEND |
| Session low. 1,013 contracts. Same price. | 6 | BTC-15 | Block Prints (livelli oro con stelle) | SEND |
| Bearish flow. Bullish day. | 4 | BTC-17 | Options Flow (linea P), candele | SAVE |
| Price up. Options money flat. | 5 | BTC-18 | Options Flow (NET), candele | SAVE |
| Price ran. Net premium didn't. | 5 | BTC-18 | Options Flow (NET), candele | SAVE |
| $7.2 million in calls. One minute. | 6 | BTC-19 | CDI (barre per minuto, intestazione C e P) | SAVE |
| Same price. Completely different market. | 5 | BTC-20 | Exposure Maps (Gamma) | SAVE |
| Same lines. Different source. | 4 | BTC-22 | Dealer Walls (dicitura "estimated from open interest · not a dealer book") | SAVE |
| Price stood still. Dealers kept trading. | 6 | UTS-04 | Exposure Maps (Charm), Dealer Walls (metrica CEX) | SAVE |
| Same strike. Morning versus last hour. | 6 | UTS-05 | Dealer Walls (EXPIRY 0DTE, METRIC CEX), Exposure Maps (Charm) | SEND |
| Same strike. Three different walls. | 5 | UTS-06 | Dealer Walls (METRIC: GEX, CEX, DEX) | SAVE |
| Today's options. Different walls. | 4 | UTS-07 | Dealer Walls (EXPIRY: 0DTE, settimana, mese, All) | SAVE |
| The hedge map under your candles. | 6 | UTS-08 | Exposure Maps (Delta, legenda "blue = they BUY") | SAVE |
| SPX 7,625. ES 7,662.75. Same wall. | 6 | UTS-10 | Dealer Walls (book proiettato, tooltip "SPX 7,625 → ES 7,662.75") | SAVE |
| Heavy selling. Price didn't move. | 5 | UTS-11 | CVD, Block Prints (livello oro) | SAVE |
| Sellers kept hitting. The level held. | 6 | UTS-11 | CVD, Block Prints (livello oro) | SAVE |
| 2 blocks. 1,013 contracts. Same price. | 6 | UTS-12 | Block Prints (PRICE LEVELS, stelle, quantità) | SEND |
| Yesterday's biggest block. Today's price. | 5 | UTS-13 | Block Prints (PRICE LEVELS Today e All, memoria di circa 10 giorni) | SAVE |
| C $1.8M. P $3.0M. One minute. | 6 | UTS-14 | CDI (barre, intestazione "C $1.8M · P $3.0M · Single-leg") | SAVE |
| Two layers. One fast move. | 5 | UTS-18 | Dealer Walls (magenta), CVD | SAVE |

## Specific event

Solo MARKET DECODED. Ogni hook richiede dati reali: le parti tra parentesi quadre si compilano con data, livello, ora e size veri. **Needs real data.**

| Hook (on screen) | Parole | Concetto | Layer | Scopo |
|---|---|---|---|---|
| Nov 20. OPEX. Where did the walls go? <br>`needs real data` | 8 | MD-01 | Dealer Walls (EXPIRY mese e All), Exposure Maps (Gamma) | SEND |
| Expiry day. Before and after the walls. <br>`needs real data` | 7 | MD-01 | Dealer Walls (EXPIRY mese e All), Exposure Maps (Gamma) | SEND |
| What OPEX did to dealer positioning. <br>`needs real data` | 6 | MD-01 | Dealer Walls (EXPIRY mese e All), Exposure Maps (Gamma) | SEND |
| CPI day. Where were the walls at 8:29? <br>`needs real data` | 8 | MD-02 | Dealer Walls, CVD, Block Prints | SEND |
| Data at 8:30. The tape at 8:31. <br>`needs real data` | 7 | MD-02 | Dealer Walls, CVD, Block Prints | SEND |
| CPI hit. Which wall did price meet? <br>`needs real data` | 7 | MD-02 | Dealer Walls, CVD, Block Prints | SEND |
| [DATE]. [LEVEL]. Three tests. It held. <br>`needs real data` | 6 | MD-03 | Dealer Walls, CVD, Block Prints | SEND |
| One wall. Three tests. Real session. <br>`needs real data` | 6 | MD-03 | Dealer Walls, CVD, Block Prints | SEND |
| [DATE]: the wall price couldn't break. <br>`needs real data` | 6 | MD-03 | Dealer Walls, CVD, Block Prints | SEND |
| This wall failed. We show it anyway. <br>`needs real data` | 7 | MD-04 | Dealer Walls, CVD, Exposure Maps (Gamma) | SEND |
| [DATE]. The biggest wall broke. <br>`needs real data` | 5 | MD-04 | Dealer Walls, CVD, Exposure Maps (Gamma) | SEND |
| [LEVEL] broke at [TIME]. What changed first? <br>`needs real data` | 7 | MD-04 | Dealer Walls, CVD, Exposure Maps (Gamma) | SEND |
| 2:00 PM. Fed decision. One minute of premium. <br>`needs real data` | 8 | MD-05 | CDI, Options Flow, candele | SEND |
| FOMC minute: calls or puts first? <br>`needs real data` | 6 | MD-05 | CDI, Options Flow, candele | SEND |
| [DATE]. 2:00 PM. $[X]M in one minute. <br>`needs real data` | 7 | MD-05 | CDI, Options Flow, candele | SEND |
| [DATE]. SPX closed [N] points from [STRIKE]. <br>`needs real data` | 7 | MD-06 | Dealer Walls (EXPIRY 0DTE, CEX), Exposure Maps (Charm) | SEND |
| Pinned, or coincidence? Two real days. <br>*pin o coincidenza? due giornate reali* <br>`needs real data` | 6 | MD-06 | Dealer Walls (EXPIRY 0DTE, CEX), Exposure Maps (Charm) | SEND |
| The last hour pulled toward one strike? <br>`needs real data` | 7 | MD-06 | Dealer Walls (EXPIRY 0DTE, CEX), Exposure Maps (Charm) | SEND |
| This week's biggest ES block. Then what? <br>`needs real data` | 7 | MD-07 | Block Prints, CVD | SEND |
| [SIZE] contracts at [PRICE]. 60 minutes later. <br>`needs real data` | 7 | MD-07 | Block Prints, CVD | SEND |
| Biggest print. Smallest reaction? <br>`needs real data` | 4 | MD-07 | Block Prints, CVD | SEND |
| Textbook divergence. Price kept going. <br>`needs real data` | 5 | MD-08 | CVD, candele | SAVE |
| The divergence was there. It didn't matter. <br>`needs real data` | 7 | MD-08 | CVD, candele | SAVE |
| [DATE]: CVD diverged. Price ignored it. <br>`needs real data` | 6 | MD-08 | CVD, candele | SAVE |
| [DATE]. Fast tape. Short gamma underneath? <br>`needs real data` | 6 | MD-09 | Dealer Walls (ciano e magenta), Exposure Maps (Gamma), CVD su ES | SEND |
| VIX up [N]%. Where were the walls? <br>`needs real data` | 7 | MD-09 | Dealer Walls (ciano e magenta), Exposure Maps (Gamma), CVD su ES | SEND |
| A volatile day, through dealer positioning. <br>`needs real data` | 6 | MD-09 | Dealer Walls (ciano e magenta), Exposure Maps (Gamma), CVD su ES | SEND |
| Five sessions. Five biggest walls. Scorecard. <br>`needs real data` | 6 | MD-10 | Dealer Walls, Market Intelligence (Key strikes) | SEND |
| Held or broke? A week of walls. <br>`needs real data` | 7 | MD-10 | Dealer Walls, Market Intelligence (Key strikes) | SEND |
| Every wall this week, misses included. <br>`needs real data` | 6 | MD-10 | Dealer Walls, Market Intelligence (Key strikes) | SEND |

## Technical curiosity

Una domanda precisa a cui il video risponde. Domande di dolore specifico battono gli inizi generici (OpusClip, dato del fornitore).

| Hook (on screen) | Parole | Concetto | Layer | Scopo |
|---|---|---|---|---|
| Why does price stall right here? | 6 | BTC-10 | Dealer Walls (stella, valore) | SAVE |
| Size or distance? Walls need both. | 6 | BTC-11 | Dealer Walls (Top N, stella), Market Intelligence (Key strikes) | SAVE |
| This read has no direction. On purpose. | 7 | BTC-12 | Market Intelligence (Dealer positioning, Break scenarios), Dealer Walls | SAVE |
| Put line up. Market up. Why? | 6 | BTC-16 | Options Flow (linee C, P, NET) | SAVE |
| Your chart can't see this. | 5 | BTC-20 | Exposure Maps (Gamma) | SAVE |
| Is your level from today? | 5 | BTC-21 | Dealer Walls (ora del book sul comando WALLS: grigio, ambra, rosso) | SAVE |
| Estimated or measured? Read the label. | 6 | BTC-22 | Dealer Walls (dicitura "estimated from open interest · not a dealer book") | SAVE |
| Why dealers buy when price drops. | 6 | UTS-01 | Exposure Maps (Gamma), Dealer Walls (verde e rosso) | SAVE |
| Why some breakdowns don't stop. | 5 | UTS-02 | Dealer Walls (ciano e magenta, tooltip Accelerative), Exposure Maps (Gamma) | SAVE |
| Where dealer gamma flips sign. | 5 | UTS-03 | Exposure Maps (Gamma, gradino bianco) | SAVE |
| What happens when time does the trading? | 7 | UTS-04 | Exposure Maps (Charm), Dealer Walls (metrica CEX) | SAVE |
| Why the last hour feels different. | 6 | UTS-05 | Dealer Walls (EXPIRY 0DTE, METRIC CEX), Exposure Maps (Charm) | SEND |
| GEX, CEX, DEX. Three questions. | 5 | UTS-06 | Dealer Walls (METRIC: GEX, CEX, DEX) | SAVE |
| Which expiry built this wall? | 5 | UTS-07 | Dealer Walls (EXPIRY: 0DTE, settimana, mese, All) | SAVE |
| Where did the dealers have to buy? | 7 | UTS-08 | Exposure Maps (Delta, legenda "blue = they BUY") | SAVE |
| −$22M. What this number actually means. | 6 | UTS-09 | Dealer Walls (tooltip, "dealer P&L exposure per 1-point SPX move") | SAVE |
| This number is per point. <br>*il valore è per ogni punto di SPX* | 5 | UTS-09 | Dealer Walls (tooltip, "dealer P&L exposure per 1-point SPX move") | SAVE |
| These ES walls come from SPX. | 6 | UTS-10 | Dealer Walls (book proiettato, tooltip "SPX 7,625 → ES 7,662.75") | SAVE |
| Why ES walls sit at odd prices. | 7 | UTS-10 | Dealer Walls (book proiettato, tooltip "SPX 7,625 → ES 7,662.75") | SAVE |
| How a price becomes a level. | 6 | UTS-12 | Block Prints (PRICE LEVELS, stelle, quantità) | SEND |
| This level is from last week. | 6 | UTS-13 | Block Prints (PRICE LEVELS Today e All, memoria di circa 10 giorni) | SAVE |
| Who spent more on options this minute? | 7 | UTS-14 | CDI (barre, intestazione "C $1.8M · P $3.0M · Single-leg") | SAVE |
| Calls versus puts. Every single minute. | 6 | UTS-14 | CDI (barre, intestazione "C $1.8M · P $3.0M · Single-leg") | SAVE |
| Three lines. One question: who paid? | 6 | UTS-15 | Options Flow (C, P, NET) | SAVE |
| Ask or bid? Who crossed the spread? | 7 | UTS-15 | Options Flow (C, P, NET) | SAVE |
| How to read C, P and NET. | 7 | UTS-15 | Options Flow (C, P, NET) | SAVE |
| Where volatility matters most to dealers. | 6 | UTS-16 | Exposure Maps (Vega) | SAVE |
| Between the walls, or outside them? | 6 | UTS-17 | Market Intelligence (Break scenarios, Invalidation) | SAVE |

## Myth explanation

Smonta una credenza. Va accompagnato dal limite: smontare un mito non significa sostituirlo con una certezza.

| Hook (on screen) | Parole | Concetto | Layer | Scopo |
|---|---|---|---|---|
| Volume doesn't tell you who's aggressive. | 6 | BTC-02 | CVD (barre delta), volume, candele OHLC | SAVE |
| High volume isn't strong buying. | 5 | BTC-03 | CVD (barre delta), volume | SAVE |
| A red wall is not bearish. | 6 | BTC-06 | Dealer Walls (famiglie colore, valore in $) | SAVE |
| A call wall is not a target. | 7 | BTC-07 | Dealer Walls (famiglia verde, tooltip) | SAVE |
| Support isn't a line. It's a position. | 7 | BTC-09 | Dealer Walls (valore in $) | SAVE |
| Dealers don't predict. They react. | 5 | BTC-12 | Market Intelligence (Dealer positioning, Break scenarios), Dealer Walls | SAVE |
| Big trades don't mean big moves. | 6 | BTC-13 | Block Prints (rombi oro, barre bianche) | SAVE |
| Red rising in Flow is bullish. <br>*nel pannello Flow la linea rossa che sale è rialzista* | 6 | BTC-16 | Options Flow (linee C, P, NET) | SAVE |
| Bought puts aren't always a bet down. | 7 | BTC-17 | Options Flow (linea P), candele | SAVE |
| One huge bar isn't a trend. | 6 | BTC-19 | CDI (barre per minuto, intestazione C e P) | SAVE |
| Not every gamma level is a dealer book. <br>*non ogni livello gamma viene da un book dei dealer* | 8 | BTC-22 | Dealer Walls (dicitura "estimated from open interest · not a dealer book") | SAVE |
| Prints don't disappear at the close. <br>*i print non spariscono alla chiusura* | 6 | UTS-13 | Block Prints (PRICE LEVELS Today e All, memoria di circa 10 giorni) | SAVE |

## Cause and effect

Collega un meccanismo a un effetto visibile. È la famiglia naturale di UNDER THE SURFACE.

| Hook (on screen) | Parole | Concetto | Layer | Scopo |
|---|---|---|---|---|
| Aggressive buyers. No new high. | 5 | BTC-04 | CVD (barre delta), candele OHLC | SAVE |
| This rally has buyers behind it. | 6 | BTC-05 | CVD, candele OHLC | SAVE |
| This red line is a brake. | 6 | BTC-06 | Dealer Walls (famiglie colore, valore in $) | SAVE |
| Brakes or fuel. Every wall is one. <br>*freno o benzina: ogni muro è l'uno o l'altro* | 7 | BTC-08 | Dealer Walls (rosso contro magenta, tooltip Accelerative) | SAVE |
| It's not a coincidence. It's positioning. | 6 | BTC-10 | Dealer Walls (stella, valore) | SAVE |
| Price drops. Dealers buy. Here's why. | 6 | UTS-01 | Exposure Maps (Gamma), Dealer Walls (verde e rosso) | SAVE |
| Long gamma: the market's brake pedal. <br>*gamma lunga: il pedale del freno del mercato* | 6 | UTS-01 | Exposure Maps (Gamma), Dealer Walls (verde e rosso) | SAVE |
| Short gamma: dealers sell into the drop. | 7 | UTS-02 | Dealer Walls (ciano e magenta, tooltip Accelerative), Exposure Maps (Gamma) | SAVE |
| Below this wall, hedging adds fuel. | 6 | UTS-02 | Dealer Walls (ciano e magenta, tooltip Accelerative), Exposure Maps (Gamma) | SAVE |
| Cross this line, hedging changes direction. | 6 | UTS-03 | Exposure Maps (Gamma, gradino bianco) | SAVE |
| No price move. Hedges still changed. | 6 | UTS-04 | Exposure Maps (Charm), Dealer Walls (metrica CEX) | SAVE |
| The clock is moving these walls. | 6 | UTS-05 | Dealer Walls (EXPIRY 0DTE, METRIC CEX), Exposure Maps (Charm) | SEND |
| Switch the metric. The walls move. | 6 | UTS-06 | Dealer Walls (METRIC: GEX, CEX, DEX) | SAVE |
| Change the expiry. The map changes. | 6 | UTS-07 | Dealer Walls (EXPIRY: 0DTE, settimana, mese, All) | SAVE |
| Blue means dealers buy here. | 5 | UTS-08 | Exposure Maps (Delta, legenda "blue = they BUY") | SAVE |
| CVD falling. Price flat. Someone's absorbing. | 6 | UTS-11 | CVD, Block Prints (livello oro) | SAVE |
| Two trades. One price. Now a level. | 7 | UTS-12 | Block Prints (PRICE LEVELS, stelle, quantità) | SEND |
| Volatility moved. These levels mattered. | 5 | UTS-16 | Exposure Maps (Vega) | SAVE |
| This read stops holding right here. | 6 | UTS-17 | Market Intelligence (Break scenarios, Invalidation) | SAVE |
| When the wall breaks and CVD agrees. | 7 | UTS-18 | Dealer Walls (magenta), CVD | SAVE |
| Short gamma plus aggressive selling. | 5 | UTS-18 | Dealer Walls (magenta), CVD | SAVE |

## Pattern vietati

Questi schemi non si usano, né nell'hook né nella voce né in didascalia. Il motivo è sempre lo stesso: il pubblico dei trader li associa ai finti guru (thread r/Daytrading citati in fintech_benchmarks.md) e regolatori e piattaforme li penalizzano (ESMA gennaio 2026, regole Instagram e TikTok sull'engagement bait).

| Vietato | Perché | Al suo posto |
|---|---|---|
| Promesse di profitto: "make $X a day", "this setup prints", percentuali di vincita | Claim di risultato non dimostrabile, rischio FTC ed ESMA | Promettere comprensione: "what this number actually means" |
| "Secret", "hidden edge", "what they don't show you" | Tono da guru, sfiducia del pubblico | Nominare il layer e il fenomeno: "Heavy selling. Price didn't move." |
| "Hedge funds / institutions don't want you to know" | Claim non verificabile; i Block Prints non identificano chi scambia | "Big trades don't mean big moves." |
| Urgenza: "before it's too late", "right now", "last chance" | ESMA: "Do not add pressure or create urgency" | Nessuna urgenza; la data serve solo nei MARKET DECODED |
| "Comment GAMMA for the link", "like if...", "tag a friend" | Instagram 2024: le CTA a parola possono ridurre la reach; TikTok: fake engagement | Payoff utile che si manda da solo |
| Direzione: "SPX is going to 7,000", "go long here", "enter now" | Può diventare raccomandazione d'investimento (MAR); vietato dalla KB | "This read stops holding on a close outside the two walls." |
| Saluti e preamboli: "Hi everyone", "Have you ever wondered", "Today we..." | Gli inizi con preambolo sono tra i peggiori nello studio OpusClip 2026 | Iniziare dal fenomeno a schermo |
| Nomi non presenti nella build: Vanna, Replay, Market Read, Key Level, Market Plan, VERDICT, dark pool fuori borsa | CE_06 sezioni B e C | Solo i nomi dei layer: Dealer Walls, Exposure Maps, Block Prints, CVD, CDI, Options Flow, Market Intelligence |
| Hook che il video non mantiene | Retention che crolla e pubblico che impara a ignorarci | Ogni hook ha il suo payoff scritto nella scheda del concetto |

## Test qualità dell'hook (5 controlli)

Un hook passa solo se supera tutti e cinque.

1. **Primo fotogramma.** La cosa di cui parla l'hook è già visibile nel fotogramma 1, senza logo né titolo prima. Se serve spiegare cosa guardare, l'hook è sbagliato o il fotogramma è sbagliato.
2. **Otto parole.** Massimo 8 parole, leggibile in circa 2,5 secondi a 60 px o più nel riquadro sicuro. Unica eccezione il pilota, già approvato a 9 parole.
3. **Specifico.** Contiene almeno un elemento concreto: un numero, un layer, un colore, un'azione del prezzo. "The market is lying to you" non passa; "Price went up. Buying pressure went down." sì.
4. **Payoff entro 8 secondi.** La risposta o la prima metà della spiegazione arriva entro circa 8 secondi dal rewind, come da CE_00. Se il payoff arriva solo alla fine, si riscrive il copione, non l'hook.
5. **Onesto e dentro la KB.** Promette comprensione e non profitto; nessun pattern vietato; usa solo funzioni della sezione A di CE_06; il limite interpretativo del concetto si può dire senza contraddire l'hook.

Controllo extra per SEND: chiedersi "lo manderei a un amico trader con un messaggio di una riga?". Se la riga che verrebbe in mente è generica, il video è SAVE e va misurato come tale.
