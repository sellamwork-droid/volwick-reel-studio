# Volwick Terminal Manual · i punti chiave

Estratto dal Volwick Terminal Manual ufficiale (69 pagine, misurato sulla build rilasciata, orari ET, dati CBOE). Ogni voce: cosa è, perché conta, fatti verificati e frasi del manuale (in inglese, come nel manuale). Per i video valgono comunque le regole di 02_TERMINALE_COSA_SI_PUO_MOSTRARE.md: se una cosa qui non è nella build attuale, non si mostra.

## Cross-layer

### Two lenses: the option book and the tape  (pagine 2-3)
- **Cos'è:** Everything on the screen belongs either to the option book or to the record of what actually traded.
- **Perché conta:** The strongest reading available is the one where two independent lenses point at the same price.
- Positioning lens: walls, heat maps, read panel, CDI and Flow panes
- Tape lens: candles, volume, CVD, Liquidity Tide, block prints and key levels
- > is structural, it updates on a timer, and it answers 'where, and how hard'
- > is live tick by tick and it answers 'who is doing it right now'
- > A heavy dealer wall that is also a Tide key level is far better evidence than either on its own.

### We tested direction. It was a coin flip.  (pagine 2, 52, 65)
- **Cos'è:** The product states outright that dealer positioning is reliable for levels and volatility, not for direction.
- **Perché conta:** It kills the wrong expectation before it costs money, in an industry where everyone promises forecasts.
- Direction from dealer positioning was tested repeatedly and came out at a coin flip
- The headline was changed to a levels-and-time statement instead
- Rule 4 of the eight demonstration rules is: never claim direction
- > dealer positioning is reliable for levels and for how volatile things get. It is not a reliable direction predictor
- > Volwick tells you where reactions happen and how violent they are likely to be. It does not tell you which way the next hour goes
- > Direction from dealer positioning was tested repeatedly and came out at a coin flip, so the headline was changed to a levels-and-time statement instead
- > Never claim direction
- > That honesty is a selling point, not an omission.

### A terminal that declares what it does not know  (pagine 2, 29, 34, 39, 43)
- **Cos'è:** Every absence of data is drawn as an absence, never interpolated or smoothed over.
- **Perché conta:** You always know whether you are looking at a real number or at a hole in the feed.
- Feed gaps are hatched instead of smoothed
- A frozen price gets a hollow tag instead of a solid one
- A book from a prior session is flagged in amber
- An instrument with no option chain reads 'n/a'
- > Gaps in the feed are hatched rather than smoothed over. A frozen price gets a hollow tag instead of a solid one. A book from a prior session says so in amber. An instrument with no option chain says 'n/a' rather than borrowing another instrument's numbers
- > the easy alternative is to interpolate quietly and hope nobody checks.

### The first five things, in order  (pagine 3-4)
- **Cos'è:** A fixed five-step sequence for opening the terminal, where the first two steps only verify the data.
- **Perché conta:** Steps one and two establish that what is on screen is real before anyone interprets it.
- Step 1: sign in and check the connection readout
- Step 2: check the book-health dot and open it once
- Step 3: choose the instrument
- Step 4: set WALLS, METRIC and EXPIRY
- Step 5: open the read panel
- > The order matters.

### Ten instruments, and why Bitcoin is not one  (pagine 3, 8, 22, 60, 67)
- **Cos'è:** A closed list of ten tickers, chosen because a clean option book exists behind them.
- **Perché conta:** Not every layer exists on every instrument, and the product refuses to fake the missing ones.
- Ten instruments are offered: SPX ES MES NQ VIX VX RTY SPY QQQ GOLD
- A first-ever load opens on ES
- SPX, ES and MES carry every layer the terminal has
- > Ten instruments are offered: SPX ES MES NQ VIX VX RTY SPY QQQ GOLD
- > If you are demonstrating the product, demonstrate it on SPX, ES or MES, because those three carry every layer the terminal has
- > Bitcoin. Deliberately absent, because there is no clean option book behind it

### Percent change measured from the tape, not a calendar  (pagine 8, 56)
- **Cos'è:** The top-bar block showing the ticker, the last trade and the percentage change.
- **Perché conta:** The baseline for the change is found in the data rather than assumed from the clock.
- Example: ES 7,778.25 -0.35%
- The previous close is located by finding the last gap of thirty minutes or more in the loaded history
- > The change is a percentage only, with no points figure anywhere in the bar
- > On SPX, VIX, SPY and QQQ only regular-hours bars feed that baseline; on the futures the whole overnight session counts.

### Two timeframes only: 1m and 5m  (pagine 9, 59, 63, 66)
- **Cos'è:** The only two candle resolutions available, because the product is built around one-minute dealer flow.
- **Perché conta:** The higher timeframes exist in the engine and were removed on purpose, not because they broke.
- Exactly two rows: 1m and 5m
- 5m is aggregated in memory from the one-minute history already loaded, so switching is instant
- The page re-asserts 1m at boot and again about 2.5 seconds later
- 15m, 1h, 4h and Daily exist in the underlying engine and are removed here
- > exactly two rows on Volwick: 1m and 5m
- > 5m is aggregated in memory from the one-minute history that is already loaded, so switching does not re-fetch anything and is instant
- > removed on purpose, not that they are broken.

### No single wall is a trade  (pagine 27-28, 38, 63, 65, 69)
- **Cos'è:** A magnet is what the dealer book wants; a key level is where big money has actually traded. One alone is not enough.
- **Perché conta:** It is the one rule from this product that works even with the tools you already use.
- Confluence examples: a heavy dealer wall that is also a Tide key level; a magnet that also sits on a charm flip; a big options-flow spike arriving exactly at a wall
- > A magnet is what the dealer book wants. A key level is where big money has actually traded
- > When a magnet and a key level land on the same price, that is the strongest single read the chart produces
- > No single wall is a trade.
- > Wait for price to come to the level
- > No single wall is a trade. Wait for two independent things to agree on one price.

### A hollow price tag means the feed is frozen  (pagine 25, 36, 57, 65, 69)
- **Cos'è:** A gold dotted line at live price with a matching axis tag, which goes hollow when the price stalls.
- **Perché conta:** A frozen price looks exactly like a live one unless you know this one visual difference.
- It ticks on every trade rather than once per bar
- Gold was chosen because the previous cyan sat one shade away from the cyan used for short-gamma walls
- When the feed stalls the solid gold tag is replaced by a hollow outlined tag with the same number and the price line dims
- > Do not trade off a hollow tag.
- > it is the single most important 'looks live but is not' state on the chart.
- > Gold was chosen deliberately. The previous cyan sat one shade away from the cyan used for short-gamma walls, so the live price was being misread as a dealer level
- > A hollow price tag means the feed is frozen. Do not trade off it.

### A perfectly flat bar is always fabricated  (pagine 2, 34, 56)
- **Cos'è:** Diagonal hatching marks minutes with no data instead of leaving them blank or inventing a bar.
- **Perché conta:** 'We do not know' is not the same statement as 'the market was quiet'.
- A dim 45-degree diagonal hatch running the full height of the price area
- Nothing else on the chart is drawn diagonally
- It is painted first, underneath every other layer
- Only gaps between roughly 90 seconds and 10 minutes are hatched
- > Earlier builds carried a flat bar forward through a gap, which looked exactly like a real minute in which price did not move. The product now treats any perfectly flat bar as fabricated and refuses to quote a price off one.
- > a dim 45-degree diagonal hatch

### A crosshair deliberately dressed as interface  (pagine 34-35)
- **Cos'è:** The grey dashed crosshair with time and price tags that synchronises all three panes.
- **Perché conta:** It is drawn in interface grey so it can never be mistaken for a quote off the market.
- In Tide mode the pill shows seconds (14:32:07) when a tide column sits under the cursor and only minutes (14:32) elsewhere
- > deliberately drawn in interface grey rather than the chart's cyan, because cyan is a data colour here and a crosshair dressed as data reads like a quote off the market
- > lights up the matching horizontal position in the CVD and CDI panes below, so all three panels read the same instant

### Volume is the confirmation channel for a break  (pagine 24)
- **Cos'è:** Standard OHLC candles with a volume histogram pinned to the bottom of the price pane.
- **Perché conta:** A wall break on heavy volume is a different event from the same break on a flat bar.
- Volume occupies the bottom eighteen percent or so of the price pane, scaled off its own left axis so it never distorts the price scale
- SPX and VIX are index quotes and carry no shareable volume, so the volume strip is empty
- With the Tide on, candles are painted fully transparent rather than removed
- > a break through a dealer wall on a volume bar far above its neighbours is a different event from the same break on a flat bar
- > SPX and VIX are index calculations with no shareable volume.

### One clock: everything is US Eastern  (pagine 1, 55)
- **Cos'è:** Every time on the platform is ET, with no user setting to change it.
- **Perché conta:** There is no timezone ambiguity anywhere on the screen.
- The crosshair prints 14:35 ET with the suffix spelled out so you can confirm it at a glance
- > Every time on the platform is ET, everywhere, with no user setting to change it
- > Nothing is shown in the viewer's local time.

### Two windows: the session and the data pull  (pagine 55)
- **Cos'è:** The regular session, and the wider window in which fresh dealer positioning is pulled.
- **Perché conta:** It explains why you already have a book at 09:10, and where the clock logic breaks.
- Regular session is 09:30 to 16:00 ET, Monday to Friday
- A wider data window, 09:00 to 16:00 ET, governs when fresh dealer positioning is pulled
- Pre-open books land from about 09:00
- > The open-or-closed test is daylight-saving-rough and knows no market holidays. On Thanksgiving or Christmas Day the readout will say `Connected` over a dead tape
- > It is the one case where the words on screen are wrong.

### Trading status read from the tape, not the clock  (pagine 56)
- **Cos'è:** Whether an instrument counts as trading is decided by whether a bar has printed recently.
- **Perché conta:** On ES at 21:00 ET you see Connected, and that is the correct answer.
- If a one-minute bar has printed within the last fifteen minutes, the instrument is treated as trading, whatever the clock says
- > A trader on ES at 21:00 ET sees `Connected`, and that is correct.

### The bug that reported a 0.00% day  (pagine 56)
- **Cos'è:** SPX, VIX, SPY and QQQ are filtered to 09:30-16:00 to find the session boundaries.
- **Perché conta:** Without the filter the daily change calculation is simply wrong.
- Without the filter, SPX once resolved its previous session to a Sunday 18:08 print and reported a 0.00 percent day change
- > Without the filter, SPX once resolved its 'previous session' to a Sunday 18:08 print and reported a 0.00 percent day change.

### Missing time is compressed, not drawn  (pagine 34, 56)
- **Cos'è:** The time axis is laid out bar by bar, so a closed market takes up no width at all.
- **Perché conta:** There is no empty space to scroll through to get back to the live edge.
- The futures 17:00 to 18:00 ET maintenance break occupies no width
- Only holes between roughly 90 seconds and 10 minutes are given real slots on the axis, and those are painted as NO DATA
- Anything longer is treated as a legitimate market break and closed up
- > The time axis is laid out bar by bar, not by wall clock
- > The rule that decides this is a ten-minute cap.

### Leave it open overnight and it reconnects  (pagine 57)
- **Cos'è:** A chart left open through the night snaps back to live by itself.
- **Perché conta:** No manual refresh is needed to start the next session.
- It refetches once the new trading day passes 09:00 ET
- > snaps itself back to live and refetches once the new trading day passes 09:00 ET. No manual refresh is needed.

### Three connection states, nothing in between  (pagine 3, 21, 57, 67)
- **Cos'è:** The feed status chip pinned to the right edge of the bar, with round-trip latency in milliseconds.
- **Perché conta:** It tells you whether the price you are looking at is real, before you act on it.
- Connected · 437ms with a green dot: live price feed, round trip 437ms
- Market closed (grey): connected, but the regular session is closed
- Disconnected (red): the price feed is down
- There are no other states
- It is repainted every 500 milliseconds
- The word only moves after the state has been consistent for roughly three seconds down or two seconds up
- > The price feed is down. The last price on screen is frozen, not current.
- > A few hundred milliseconds is normal, and a number climbing steadily is the early warning that a disconnect is coming
- > A dead socket outranks a closed market
- > It is not clickable

### A status light that refuses to strobe  (pagine 21, 57)
- **Cos'è:** The logic that stops the connection chip flickering between states.
- **Perché conta:** Holding still is the honest reading of an ambiguous state.
- Outside the session the socket can report down for a handful of samples in twenty seconds while the feed is idle
- Without damping the label would strobe about twice a second
- A real outage still shows within about three seconds
- > A link that is flapping every half second reaches neither threshold and the chip simply holds still, which is the honest reading of 'neither reliably up nor reliably down'.

### Four classes of update, named out loud  (pagine 58)
- **Cos'è:** Which numbers are live tick by tick, which run on a timer, and which never change again.
- **Perché conta:** It tells you which figure on screen you can quote as real time.
- Live, tick by tick: price, the forming candle, volume, the trade-print markers, CVD, the options-premium panes, the Liquidity Tide
- Live but on a timer: the dealer-positioning walls, levels, heat maps and the panels driven by them; heat-map columns are five-minute snapshots
- Fixed for the session: any snapshot you pin, and your saved control state
- Fixed for good: a closed one-minute bar never changes again
- > A closed one-minute bar never changes again.

### What a reload remembers, and what it resets  (pagine 58-59)
- **Cos'è:** Which controls survive a reload and which are deliberately forced back to a default.
- **Perché conta:** It surprises anyone who expects a reload to reset the whole terminal.
- Persist: instrument (falls back to ES if invalid), WALLS count (a stored 25 or 40 is rewritten to 15), Liquidity Tide on/off, Tide size threshold per instrument, FLOW pane, MAPS selection, PANELS dock, access session, cached basis offset
- Do not persist: METRIC always returns to GEX, EXPIRY always returns to All, timeframe is always 1m, Tide FLOW and LEVELS are forced back to Off at every boot
- CVD is Off at boot but an explicit user choice sticks
- CDI is forced on regardless of how you left it
- > Stored as an 'I turned it off' flag, so first-time users always get it on

### Not every layer exists on every ticker  (pagine 60)
- **Cos'è:** The table of which layer exists on which instrument.
- **Perché conta:** 'The control did nothing' is almost always this table rather than a fault.
- SPX: signed book, all four metrics, Tide over candles, no volume, index same-day CDI, Flow yes
- ES and MES: index book basis-shifted, all four metrics, Tide yes, CVD yes, index same-day CDI, Flow yes
- NQ, RTY and GOLD: open-interest estimate, gamma only, Tide yes, CVD yes, no CDI book, no Flow
- VIX: signed book, GEX and CEX, no Tide data, no volume, no CDI, no Flow
- VX: index book basis-shifted, GEX and CEX, no Tide data, CVD yes, no CDI, no Flow
- SPY: open-interest estimate, gamma only, SPY CDI book, Flow yes
- QQQ: open-interest estimate, gamma only, QQQ CDI book, no Flow, and it says so
- > 'the control did nothing' is almost always this table rather than a fault
- > On QQQ, NQ, RTY, VIX, VX and GOLD the pane opens and draws nothing, deliberately, because mapping QQQ onto the SPY book would have shown SPY's flow under QQQ's name.

### CBOE-licensed market data, stated on the page  (pagine 1, 60, 69)
- **Cos'è:** The declaration of where the market data on the terminal comes from.
- **Perché conta:** It is the product's claim to legitimacy, printed rather than implied.
- All market data on the terminal comes from CBOE-licensed market data distributions
- > All market data on the terminal comes from CBOE-licensed market data distributions
- > Volwick Terminal Manual · measured against the shipped build · all times ET · market data: CBOE-licensed market data distributions

### Cmd+K, and every row presses a real button  (pagine 22, 67)
- **Cos'è:** A centred search bar that jumps to any ticker or runs any action by name.
- **Perché conta:** A palette action and the equivalent button press are the same code path and cannot drift apart.
- Ctrl+K on Windows, Cmd+K on Mac
- Placeholder: Jump to a ticker, a place, or an action…
- Ten ticker rows and eight actions
- Actions: Open Layers, Turn all layers off, Refresh walls, Where the walls come from, How to read this chart, Liquidity Tide on/off, Timeframe 1m, Timeframe 5m
- Ranking is prefix-first
- > Every row drives the real control by clicking it, so a palette action and the equivalent button press are the same code path and cannot drift apart.

### The top bar drops words, never a control  (pagine 23, 62)
- **Cos'è:** As the window narrows the bar gives up words in a fixed order, and never a control.
- **Perché conta:** It explains the product's most common bug report.
- At 1920px everything is present
- About 1512px: LIQUIDITY TIDE becomes TIDE
- About 1366px: the change percentage disappears, the WALLS, METRIC and EXPIRY captions go, leaving Top 15 | GEX | All, and MAPS · GAMMA becomes GAMMA
- About 1280px: the brand mark disappears
- At 1024px the bar becomes horizontally scrollable and bar height grows from 46px to 52px
- > Work at 1,400 pixels or wider if you can.

### The five sentences to teach first  (pagine 69)
- **Cos'è:** The product's own irreducible summary of how to read the screen.
- **Perché conta:** Five lines that between them cover the five most expensive mistakes.
- > A red wall is a defended floor, not a bearish signal.
- > In a blue gamma field, fade the edges. In an amber field, follow the break.
- > Green means 'no known problem', not 'walls confirmed present'.
- > A hollow price tag means the feed is frozen. Do not trade off it.
- > No single wall is a trade. Wait for two independent things to agree on one price.

### Eight rules for showing a market screen  (pagine 64-65)
- **Cos'è:** The internal discipline rules for anyone demonstrating the terminal, which are also the correct-use rules.
- **Perché conta:** It is a checklist of what to verify before saying any number out loud.
- 1. Demonstrate on SPX, ES or MES
- 2. Check the book-health dot and its age before quoting any level
- 3. Check the Flow pane's age field before quoting a total
- 4. Never claim direction
- 5. Wait for price to come to the level
- 6. Do not trade a single wall
- 7. Do not trade off a hollow price tag
- 8. Do not quote the read panel when the book is stale
- > Never claim direction
- > Do not quote the read panel when the book is stale.
- > Every row in it, including the verdict and the regime, is from that older date.

### Two documents: one on meaning, one on buttons  (pagine 19, 64, 67)
- **Cos'è:** The in-product trading playbook, kept separate from the technical manual.
- **Perché conta:** Meaning and mechanics live in two documents on purpose, and the product says which wins.
- Headed DAY TRADER'S PLAYBOOK / How to Read Sightline
- Sections in order: The Big Picture, Two Lenses · Quick Start · The Toolbar, Control by Control · LIQUIDITY TIDE · CVD vs CDI, don't confuse them · The Options Positioning Map · Gamma Regime, the master switch · The TOP 5 / TOP 10 Rule · Time-of-Day Playbook · What Each Metric Means · SETUP Classifications · Common Mistakes
- > Treat the Guide as authoritative on meaning and this manual as authoritative on which buttons exist.

### Gold means the thing that matters most  (pagine 36, 37, 63)
- **Cos'è:** Gold appears in four places in the price area with four different meanings.
- **Perché conta:** Knowing them stops you reading the live price as if it were a dealer level.
- Gold appears in four places: the live price line and axis tag; the day's strongest key level, double-starred; a mega block pill; the threshold badge when the threshold is the user's own
- > Teach it as 'gold means the thing that matters most in its own family'
- > amber never means bad and never means bearish. It means 'look at this'.

## Dealer Walls

### These lines are not moving averages  (pagine 2)
- **Cos'è:** The horizontal lines are option strikes weighted by dealer exposure, not indicators calculated off price.
- **Perché conta:** They exist because somebody is contractually obliged to hedge at that price.
- > They are not moving averages, pivots or Fibonacci retracements. They exist because somebody is obliged to hedge at that price.

### A green dot does not mean the data is there  (pagine 3, 7, 61, 66)
- **Cos'è:** A nine-pixel status light for the dealer book that feeds the walls, the maps and the read panel.
- **Perché conta:** The dot reads the words of the status line, not the result of the fetch, so it can stay green with no walls.
- The dot is 9 pixels across
- It is re-read every 500 milliseconds
- Green: the book is current and its status text carries no warning words
- Amber: the status contains 'stale', '16:00 book' or 'not published'
- Red: feed down, unavailable, or no gamma loaded, which means there are effectively no walls
- > green means 'no known problem', not 'walls confirmed present'
- > The book-health dot reads the words of the status line, not the result of the fetch.
- > A wall request that fails with the message 'Could not load the dealer walls, the chart and price are still live. Retrying…' matches none of the warning words, so the dot stays green while no walls exist.
- > The amber state is easy to skim past, because the dot is only 9 pixels across, and a stale book draws perfectly normal-looking walls at yesterday's strikes.
- > Nothing else on the chart will look wrong.

### Index walls carried onto the futures scale  (pagine 7, 59, 60)
- **Cos'è:** On ES, MES and VX the walls are the index book shifted onto the futures scale by the premium.
- **Perché conta:** Those wall prices carry the uncertainty of an estimate, and the status line says so.
- The line ends with basis +14.88 · estimated
- Example pair: estimated (SPX 7743.41 / ES_F 7777.50)
- > A stale cached basis offset can put the ES, MES or VX wall lines a few points out for a moment on a cold load
- > wait a beat before concluding anything.

### Top 5 is the honest read. Past Top 10 is noise.  (pagine 3, 10, 38, 59, 66)
- **Cos'è:** How many wall lines get drawn, counted as the largest strikes by exposure rather than by distance.
- **Perché conta:** Top 3 on a quiet day and Top 3 on expiry day do not cover the same band of prices.
- Five rows: Off, Top 3, Top 5, Top 10, Top 15
- The default is Top 15
- Top 25 and Top 40 exist on the internal build and are removed; a saved preference of 25 or 40 is rewritten to 15
- > Top 5 is the honest read, Top 10 is context, and everything past Top 10 is mostly noise
- > the N largest strikes by dealer exposure in the currently selected metric and expiry bucket. It is a count, not a distance.

### GEX, CEX, DEX: three different kinds of level  (pagine 11, 59, 61, 66)
- **Cos'è:** Which dealer exposure greek the wall lines measure, which changes what a level actually represents.
- **Perché conta:** The same strike means a different thing under gamma, under charm and under delta.
- GEX is gamma exposure: where dealer hedging suppresses or accelerates price
- CEX is charm exposure: time-decay pressure on dealer hedges, and the pin engine near same-day strikes
- DEX is delta exposure: dealer delta by strike
- ALL draws all of them at once, gamma as solid lines and charm dashed
- The default is GEX and it does not persist
- Metric switching is only real on SPX, VIX, ES, MES and VX
- DEX has a book only on SPX, ES and MES
- > A typical working reading is GEX, Top 15, All expiries
- > if the instrument is SPY, QQQ, NQ, RTY or GOLD, treat METRIC as fixed at GEX regardless of what the label says.

### Expiry buckets that count the strikes first  (pagine 12, 59, 66)
- **Cos'è:** Which expirations feed the walls and the heat map, with each row showing a live strike count.
- **Perché conta:** You can see whether a bucket will draw anything at all before you select it.
- 0DTE (0) with 27 Sep
- This week (163) with 28 Sep - 2 Oct
- This month (137) with 27 Sep - 30 Sep
- All (338)
- When the 0DTE count is zero the row dims to 35 percent and is not clickable
- On SPY, QQQ, NQ, RTY and GOLD the expiry toggle re-filters the heat map but not the wall lines
- > The count is the number of distinct strikes in that window, not contracts
- > No contracts expire today on this instrument
- > The control looks fully live and is only half live there.

### Four visual channels encode one wall's rank  (pagine 25)
- **Cos'è:** Thickness, opacity, dashing and a left-to-right fade all encode how important a wall is.
- **Perché conta:** The biggest wall of the day is recognisable at a glance, with no legend needed.
- Thickness: one pixel to four
- Opacity: faint to fully saturated
- The weakest walls of a metric go dashed
- Every wall is invisible at the far left of history and reaches full strength at the right-hand end
- > Rank is measured against the strongest wall of its own metric, never across metrics

### Why a far strike cannot bully into the Top 5  (pagine 25)
- **Cos'è:** Walls are selected by absolute exposure multiplied by closeness to spot.
- **Perché conta:** It stops a monstrous far out-of-the-money strike taking a slot that matters.
- Selection starts in a tight band of about 1.5 percent either side of price and widens only as far as 5 percent if there are not enough candidates
- > starting in a tight band of about 1.5 percent either side of price and widening only as far as 5 percent if there are not enough candidates. That is what stops a monstrous far out-of-the-money strike bullying its way into the Top 5.

### A label that refuses to be placed dishonestly  (pagine 26)
- **Cos'è:** Every wall has a filled dot and a label in a reserved lane along the right edge.
- **Perché conta:** The dot carries the true colour, because the line itself is deliberately faded.
- Label format: 7,685 · +$19.7M
- Exactly one wall per screen carries a star, marking the single biggest of the day
- > Labels that cannot be placed honestly are dropped, not stacked
- > a wall whose price is off the visible vertical range gets no pill at all: it is deliberately not parked at the top edge, because that would be a claim about a price you cannot see.

### What +$19.7M on a strike actually means  (pagine 26-27)
- **Cos'è:** The unit of the number printed on every wall, and what that number is not.
- **Perché conta:** It is not money anyone will pay you; it is how much hedging pressure is bolted to that price.
- For the signed book (SPX, ES, MES, VIX, VX) it is dealer profit-and-loss exposure per one-point move in the underlying index, or per one volatility point on VIX
- Always signed and abbreviated: +$19.7M, -$1.24B, +$850K
- A plus sign means dealers are long that greek at that strike, a minus sign means short
- Delta exposure is quoted in raw book units with no dollar sign, being contracts multiplied by delta multiplied by 100
- Units: dollars per million per point for gamma, dollars per million per five minutes for charm, dollars per million per volatility percent for vanna
- In ALL mode labels are prefixed GEX· and CEX· so 360M under one metric and 526.52B under another cannot be confused
- > It is not a dollar amount anybody will pay you. It is a measure of how much hedging pressure is bolted to that price.
- > Do not compare a gamma number to a delta number.
- > Delta exposure is quoted in raw book units with no dollar sign at all… because there is no defensible dollar conversion for it and the product refuses to invent one.

### Four wall colours, four behaviours  (pagine 27, 36, 69)
- **Cos'è:** Every wall is classified on two axes, call or put dominant and dealer gamma long or short, giving four colours.
- **Perché conta:** It tells you whether that level brakes price or shoves it.
- GREEN · call wall, long gamma: suppressive resistance
- RED · put wall, long gamma: suppressive support
- CYAN · call wall, short gamma: accelerative
- MAGENTA · put wall, short gamma: accelerative
- Under charm the same four read 'time pulls down' and 'time pulls up'
- Under delta they read 'customers bought calls here' and 'sold puts here'
- > Dealers defend it and fade rallies into it. Expect a stall
- > Expect it to hold
- > A clean break above can run fast. Follow it
- > A break below can run fast. Do not buy it
- > green and red walls brake price; cyan and magenta walls are where price gets a shove

### A red wall is a floor, not a bearish signal  (pagine 23-24, 63, 69)
- **Cos'è:** Green and red mean direction on the candles and suppression on the walls, and the two get confused constantly.
- **Perché conta:** Mixing up direction and suppression is the single most common misreading of this chart.
- On the heat maps there is no green or red at all
- > On the candles and the volume bars, green and red are price direction
- > On the dealer walls, green and red are suppression, not direction
- > A red wall is a floor, not a bearish signal. This is the single most common misreading of the chart and it must be said out loud when training someone.

### Magnets: the strike that pins price  (pagine 27-28, 38, 51)
- **Cos'è:** A strike carrying strong positive gamma close to spot, which drags price toward itself and pins it.
- **Perché conta:** It changes the choice between a range trade and a breakout trade as the session wears on.
- The closer a magnet is to spot and the bigger its gamma, the stronger the pull
- The pull strengthens into the close as same-day options decay
- The magnet read now lives in the read panel, not as a line
- > Magnets are not direction calls
- > They tell you where price is likely to be attracted and pinned, not whether the next hour is up or down.
- > range trades get better and breakout trades get worse as the session wears on around a strong magnet
- > an earlier gold target line, which drew the single dominant magnet on the chart, has been retired

### Estimated from open interest, and it says so  (pagine 29, 60)
- **Cos'è:** On five instruments the walls are estimated from open interest instead of from a signed dealer book.
- **Perché conta:** You need to know when you are looking at an estimate, and the product labels it in plain words.
- SPY, QQQ, NQ, RTY and GOLD have no signed dealer positioning available
- Hovering one gives the strike, the call and put split of open interest, and the net gamma per one percent move
- > estimated from open interest · not a dealer book
- > <TICKER> has no dealer book / Walls and maps read the book on <list>

### Hover a level, get a sentence not a number  (pagine 29-30)
- **Cos'è:** A card that appears when the cursor comes within a few pixels of a wall line.
- **Perché conta:** It turns the level into an operating sentence instead of a raw figure.
- On ES it shows both scales, for example SPX 7700 → ES 7713.00
- Each section gives a swatch, a family name such as Call wall · long γ, an effect sentence, and signed Net, Call and Put values
- > Nothing on the chart requires a click to inspect
- > Suppressive resistance — dealers defend, fade rallies
- > Values are dealer P&L exposure per 1-point SPX move. Sum across all expirations.
- > The wall card prefers to sit to the right of the cursor and the flow card to the left

### Levels that look real and are not  (pagine 54)
- **Cos'è:** Adjacent opposite-gamma strikes that look like walls but whose net hedging force is roughly zero.
- **Perché conta:** They are the false levels, and the panel counts them for you.
- The row can add: 3 neutralizing pairs near price
- > Those are adjacent opposite-gamma strikes that look like walls but whose net hedging force is roughly zero. Do not trade those standalone.

## Market Intelligence

### Where the walls come from  (pagine 3, 7, 60)
- **Cos'è:** A panel that declares the origin, the timestamp and the age of the book used to draw the levels.
- **Perché conta:** It is the correct answer to 'where does this number come from', which retail tools rarely give.
- Provenance line: via SPX · GEX dealer walls · 338 strikes · all expiries · 16:00:00 · 237s ago
- Amber warning: 16:00 BOOK — NEXT SESSION EXPIRY (today's 0DTE settled + excluded)
- Last update line: Last update GEX 16:00 ET 4 min · cached
- A REFRESH WALLS button
- > STALE — SHOWING 2026-09-25 BOOK, NOT TODAY. Walls / regime / bias are all from that date.

### A panel that reads the chart in words  (pagine 4, 20, 50, 67)
- **Cos'è:** A fixed column docked to the right, headed READS THE CHART, that synthesises everything on screen.
- **Perché conta:** It is the fastest way to know what the screen is saying without learning every colour first.
- The dock is 320 pixels wide and the chart narrows to make room rather than being overlapped
- Four blocks always in the same order: VERDICT, WHY, THE PLAN, LEVELS ON THE CHART, closing with a source strip
- Sections with nothing to say hide themselves
- In the first seconds after a ticker change it prints waiting for ES…
- > the panel does not teach.
- > It is not a fourth chart, and it is not a place where anything is configured.
- > rather than asserting something false about the market
- > The colour legend and the explanations were deliberately moved out of it and into the Guide, so what remains is only the reading.

### One arrow encodes conviction, not just side  (pagine 50)
- **Cos'è:** An arrow, a direction and the instrument, on a single line.
- **Perché conta:** The arrow shape tells you how much the panel believes its own call.
- ↑↑ LONG ES, ↓ SHORT ES, or · NEUTRAL
- A double arrow is HIGH, a single arrow is MED, a diagonal arrow is LOW
- At LOW it prints LONG bias rather than naming the instrument
- > which is the panel hedging its own language on purpose.

### A conviction score from -10 to +10  (pagine 51)
- **Cos'è:** A strength-of-agreement number between the layers, not a price target.
- **Perché conta:** It quantifies how much the independent signals actually agree today.
- The score runs from minus ten to plus ten
- It is smoothed over the last three readings, so it steps rather than flickers
- Thresholds: 7 and above is HIGH, 3 and above is MED, 1 and above is LOW, below 1 is NEUTRAL
- It reads HIGH conviction · 7.4, or from neutral score -0.1
- > Teach the score as a strength-of-agreement number, not a price target.

### Five verbs that live for ninety seconds  (pagine 51)
- **Cos'è:** A verb that appears when the state changes, then removes itself.
- **Perché conta:** It marks the moment of change, not just the current state.
- ENTER NOW: the read has just left neutral
- CLOSE POSITION: just returned to neutral
- FLIP: direction reversed
- TRIM HALF: conviction dropped a tier
- ADD BACK: conviction rose a tier
- It shows for ninety seconds after the state changes
- > For ninety seconds after the state changes
- > It then disappears on its own.

### The system that downgrades itself  (pagine 51)
- **Cos'è:** A mechanism that forces the panel to NEUTRAL when price has moved against its own reading.
- **Perché conta:** It is software writing down the conditions in which it does not trust itself.
- Trigger: spot has moved five points or more in the last thirty minutes in the opposite direction to the score
- It prints velocity override · raw 4.2 vs 30m +7.8pt
- It only ever downgrades conviction and can never upgrade it
- > It exists because on gaps and on news the positioning book is stale relative to price. It only ever downgrades conviction and can never upgrade it.
- > When you see it, the panel is telling you it does not trust itself.

### MAGNET 7735, forty-one points away  (pagine 51-52)
- **Cos'è:** The dominant positive-gamma strike within thirty points, with the distance printed in points.
- **Perché conta:** It names where price gravity is pulling, and how far that is from here.
- The dominant magnet is searched within thirty points of spot
- Example: MAGNET 7735 (γ+11) · ↑↑ LEAN LONG — strong γ magnet pulling price UP 41pt to 7735
- PINNED 7735 — range chop, fade the edges, when spot is within three points of it
- WEAK γ — no pin, BREAKOUT RISK (gravity unreliable today)
- > Do not read a weak magnet as a target.

### 61% of the charm sitting on one strike  (pagine 52)
- **Cos'è:** A row flagging a strike that concentrates most of the band's charm exposure.
- **Perché conta:** It is the mechanical end-of-day pin, stated as a concentration percentage.
- Example: PIN ↑ 7800 with 24pt above · 61% concentration · pull 340 · ACCELERATING
- It marks a strike holding a large share of the band's charm and sitting more than ten points away
- When charm dominates gamma the row becomes CHARM-DRIFT — charm exposure dominant over γ — regime is time-decay-driven
- > The accelerating flag means the pull has grown materially since the previous reading

### A headline with the direction left out  (pagine 52)
- **Cos'è:** One line with spot and the time left to the close, with no directional forecast at all.
- **Perché conta:** What this line leaves out is itself the statement.
- Example: LEVELS · 7761 · 15h 43m to close
- > Note what it deliberately does not do. It does not predict direction.
- > Direction from dealer positioning was tested repeatedly and came out at a coin flip
- > That honesty is a selling point, not an omission.

### Seven ways a session can be classified  (pagine 52-53)
- **Cos'è:** The single actionable row of the panel, sorting the day into one of seven named setups.
- **Perché conta:** Naming the day is what tells you which kind of trade can even exist today.
- PIN: spot is held at a dominant strike, range chop, fade the edges
- RANGE: two governing walls close enough to define a working range
- CEILING TEST: spot is loading against the upper wall
- FLOOR TEST: spot is loading against the lower wall
- WIDE: governing walls far apart, range loose
- TREND DAY · γ- regime: dealers amplify, breaks run, fade trades lose
- NO STRUCTURE: nothing structural to trade, the panel is saying sit out
- Example: WIDE · 7750 ↔ 7820 (70pt)
- Reason line: Walls 1-2.5% away — range exists, theta slower
- It can add pivot 7745, the short-gamma strike within ten points of spot that the day tends to oscillate around
- > The setup is hysteresis-damped, so it does not flicker between states minute to minute.

### Fade it or follow it: check this row first  (pagine 53)
- **Cos'è:** The master switch to check before any fade: range-bound, trend, or mixed.
- **Perché conta:** It decides whether the walls are places to fade or places to follow.
- RANGE-BOUND DAY (green): dealers dampen moves — Sell into the ceiling, buy into the floor. Walls hold
- TREND DAY (red): dealers amplify breaks — Follow momentum through the walls. Fade trades lose
- MIXED REGIME (grey): near neutral — Wait for a confirmed level break before trading
- Row beneath: Range 7735 ↔ 7800 (65pt) · Net hedge +$50M
- > the put floor, the call wall, the width, and the total dealer gamma across the band, where positive is stabilising

### The panel and the chart cannot disagree  (pagine 54)
- **Cos'è:** A price-ordered list of the lines actually drawn, with the current price sitting in the middle.
- **Perché conta:** Everything above that row is overhead and everything below it is support.
- Size on the right: +$12.6M, or starred -$32.3M
- The current price sits in the middle of the list as a white price now row
- Clicking a row centres the price axis on that level without moving the time window
- Honest empty states: no wall this side, walls are off, waiting for ES…, no walls drawn on this instrument
- > It is built from the very array the chart draws from, so the panel and the chart cannot disagree with each other
- > Every real row is clickable and keyboard-reachable.

### The anatomy of a session in four phases  (pagine 54)
- **Cos'è:** How the setup typically evolves from the open through to the close.
- **Perché conta:** It explains why the panel says almost nothing early in the morning.
- Early in the day the walls are wide relative to spot and the setup is usually WIDE or NO STRUCTURE at LOW or no conviction
- WIDE becomes CEILING TEST or FLOOR TEST as spot loads against one side, then RANGE or PIN once both walls are inside about half a percent
- Charm's weight rises steadily into the close by construction, so the charm-pin row and the magnet distance carry more meaning after 14:00
- > The highest-confidence state the panel can produce is a PIN setup at HIGH conviction inside a RANGE-BOUND regime in the last hour. The lowest is NO STRUCTURE inside a MIXED REGIME.

## CVD

### The Liquidity Tide: order flow as a ribbon  (pagine 2, 13-14, 30, 66, 68)
- **Cos'è:** A proprietary algorithm that renders live order flow as a ribbon behind or instead of the candles.
- **Perché conta:** It shows buying and selling pressure while it happens, without waiting for a bar to close.
- In tide mode the ribbon is the price and its leading edge is live price right now
- Green means buyers, red means sellers, grey means balanced or absorbed
- Saturation and opacity rise with conviction
- The ribbon's vertical thickness is deliberately flat and constant
- Default On
- The Tide has no data on VIX or VX
- > An extensive proprietary algorithm that renders live order flow as a ribbon
- > How the engine derives any of this is proprietary and is not documented anywhere in the product
- > The Tide has no data on VIX or VX.

### The pale core: absorption before the turn  (pagine 30)
- **Cos'è:** A light core running down the middle of a stretch of ribbon, marking absorption.
- **Perché conta:** It is often the tell that a reversal is close, before the candles show anything.
- > A subtle pale core running down the middle of a stretch marks absorption: one side quietly eating the other's aggression, which is often the tell that a turn is close.

### White bars: when real size commits to a price  (pagine 30-31, 36, 69)
- **Cos'è:** Short white horizontal bars laid across the ribbon at the price where a burst of institutional size committed.
- **Perché conta:** When a white bar appears, that price has already been defended with real money.
- The bar's length is the magnitude of the event, drawn in fixed pixels so it stays the same at every zoom
- The bar sits at the price the heavy lots actually transacted at, not at the closing tick
- Bars are placed biggest first and a smaller one that would overlap a bigger one is skipped
- > This is the engine's headline signal
- > when a white bar appears, respect that price
- > White is a magnitude signal, not a direction signal. A white bar says size arrived, not which way it is going.
- > white is the only meaning white carries anywhere in the price area

### The signal that appears about once a day  (pagine 31)
- **Cos'è:** An amber bar at the price of sustained absorption that never produced a white bar.
- **Perché conta:** It is the patient version of the same event: a stealthy turning point.
- It appears roughly once a day
- Its width scales with how convinced the reading is
- Amber and white never appear at the same price for the same event
- > It appears roughly once a day, and its width scales with how convinced the reading is
- > Treat it as a confluence nudge at a stealthy turning point… not a standalone signal
- > they never appear at the same price for the same event, because amber fires specifically where white did not.

### The ribbon, translated into a sentence  (pagine 31-32)
- **Cos'è:** A popout that reads the ribbon at the cursor in plain English.
- **Perché conta:** It turns a colour gradient into a verdict you can state out loud.
- Verdicts: BUYERS winning, SELLERS winning, ABSORBED-balanced
- Strength qualifiers: light, moderate or strong
- Size descriptors: light-quiet, medium, or HEAVY (institutional or algorithmic flow)
- Two numeric flow readouts in lots
- The price above a white bar is labelled avg px
- Timestamps are in ET
- > HEAVY (institutional or algorithmic flow)

### A CVD built only from the big trades  (pagine 15, 38, 39-40, 67)
- **Cos'è:** A session-cumulative total of buy volume minus sell volume on the tape, signed by the aggressor.
- **Perché conta:** It tells you whether the people moving price are actually paying up to move it.
- Only prints at or above that instrument's block threshold feed it
- A print that landed inside the spread carries no side
- The pane is about 180px and never more than 32% of the chart
- Default Off at every boot
- Header: CVD +40 contracts, optionally · zero is off the scale or · stalled 12m
- After five minutes the header greys out
- > Every qualifying print that lifted the offer adds its size. Every print that hit the bid subtracts its size.
- > It is deliberately a big-trader CVD, not a tick-by-tick one.
- > No block trade has arrived on ES today. The curve appears with the first one.
- > It does not claim the feed is broken, because it cannot tell a dead feed from a quiet session.

### Read the shape against price, not the pixels  (pagine 39)
- **Cos'è:** The CVD vertical scale auto-fits whatever is on screen, so apparent steepness means nothing alone.
- **Perché conta:** It is the single most common beginner error on that pane.
- The scale auto-fits to the high and low of what is on screen, forces zero into the window, and adds 14 percent padding
- > Pan or zoom and the curve's apparent steepness changes. Read the shape against price, never the pixel height.
- > This is the single thing that confuses people about this pane.

### Was that high bought, or just unopposed?  (pagine 40)
- **Cos'è:** Price makes a new high and CVD does not.
- **Perché conta:** It separates a high that buyers paid for from a high that happened because sellers went away.
- > the high was not bought. It was carried by an absence of sellers rather than by aggressive buying, and it is fade risk
- > a new low in price with CVD flat or turning up means sellers are spent and the move is squeeze-prone
- > CVD tells you whether the people moving price are actually paying up to move it.

## Dark Pool

### What counts as big, market by market  (pagine 13, 32, 39, 59, 68)
- **Cos'è:** The minimum print that counts as a block, preset per instrument and editable.
- **Perché conta:** Large is not a universal number: 100 contracts on ES is not 100 contracts on NQ.
- ES 100 contracts
- MES 60 contracts
- NQ 20 contracts
- RTY 50 contracts
- GOLD 10 contracts
- VX 25 contracts
- SPX 1
- VIX 100
- SPY 5,000 shares
- QQQ 5,000 shares
- Mega thresholds: ES 300, SPY 50,000, QQQ 50,000
- > The value is remembered per instrument, so a number typed on SPY does not follow you to ES
- > The threshold box refuses minus signs, decimals and exponent characters outright

### Size pills: 2.4K contracts in one minute  (pagine 32, 69)
- **Cos'è:** Rounded pills marking unusually large single prints, grouped by minute and by price cluster.
- **Perché conta:** It shows where real size passed through, and exactly how much of it.
- Sizes abbreviated as 1.2M, 5.5K, 450
- 2.4K ×6 means 2,400 contracts across six separate prints in that one minute at that one price
- Silver is a normal block, gold is a mega block, and mega pills are drawn slightly larger
- Pills are capped at the 250 largest in view
- > Every pill carries a number, always
- > a pill is never allowed to sit on a candle: if there is genuinely nowhere to put it it shrinks to a dot

### We removed a line because it looked like a spike  (pagine 32-33)
- **Cos'è:** A small diamond marks the true price and time of a print, joined to its label by a dotted diagonal.
- **Perché conta:** The diamond is the truth and the pill is only the label.
- Nothing in this layer is drawn vertically any more, by design
- > The diamond replaced an earlier vertical stroke that ran from the pill down to the price… On a candle chart a thin vertical stroke is a wick, and stacked clusters in one minute merged their strokes into one unbroken vertical line that read as a price spike that never happened. Nothing in this layer is drawn vertically any more, by design.

### Zoom out and the size filter rises with you  (pagine 33)
- **Cos'è:** The more candles on screen, the higher the print threshold drawn, with a badge declaring the active number.
- **Perché conta:** It prevents a wall of overlapping labels when you zoom out, and it never hides the rule it used.
- Badge: orders above 200 contracts · zoom · 310 candles
- Badge: orders above 300 contracts · your filter
- Roughly two hours of bars or fewer shows everything the instrument qualifies, out to about a full session doubles the floor, and beyond that it multiplies it by five
- > The ladder is measured in candles on screen, not in pixels
- > Your typed threshold always beats the zoom. There is no blending, no maximum-of-the-two

### One 6,000-lot trade or twelve 500-lot trades?  (pagine 33)
- **Cos'è:** A card that breaks a cluster of prints at one price back into the individual trades.
- **Perché conta:** A single enormous order and many medium orders at the same price are very different events.
- Headers: BLOCK CLUSTER ×N, MEGA BLOCK CLUSTER, SWEEP CLUSTER
- The five largest individual prints are listed with their exact prices, with any mega print flagged in gold
- > That list is how you tell one 6,000-lot trade from twelve 500-lot trades at the same price, which are very different events
- > The time is forced to ET regardless of the viewer's machine clock.

### A key level needs at least three big prints  (pagine 28, 36, 63, 69)
- **Cos'è:** Dashed horizontal lines where qualified block prints have repeatedly stacked up.
- **Perché conta:** It is where big money has actually traded, not where the option book would like it to trade.
- A band qualifies only with at least three separate large prints, relaxed to two on a thin instrument
- The top ten are drawn
- The strongest is gold and carries a double star; every other level is silver
- Label example: 7,150.00  2K · 36 blocks
- The LEVELS control offers Today, All (about ten days of memory) and Off
- > A band qualifies only with at least three separate large prints in it, relaxed to two on a thin instrument, because a single huge print is an event and not a level
- > levels and their labels require the Liquidity Tide to be on

## Exposure Maps

### Support in one regime, air pocket in the other  (pagine 37, 53)
- **Cos'è:** The calculation of whether dealers near price are net long or net short gamma.
- **Perché conta:** It inverts the meaning of everything else on screen, including whether a support level is real.
- It sums signed dealer gamma within two percent either side of spot and reports the tilt as net divided by gross
- Roughly five percent is the dividing band: above plus five reads POSITIVE, below minus five NEGATIVE, in between MIXED or TRANSITION
- > Do not eyeball it.
- > the walls are brakes… the play is to fade them
- > The walls stop being brakes and become triggers. The play is to follow breaks
- > a put wall below price in this regime is an air pocket, not support, and price tends to flush straight through it. Buying that same level here is the classic way to lose money with this chart.
- > mistaking the two is the single most expensive error on this screen.

### Short gamma changes your size, not your side  (pagine 38)
- **Cos'è:** Where dealers are short gamma, their hedging amplifies whatever price does.
- **Perché conta:** It is a sizing decision: stops get hit that would have survived in the other regime.
- > moves get faster, ranges get wider, and stops get hit that would have survived in the other regime. Size positions for that, and be sceptical of any level-based mean-reversion idea in that zone.

### A heat map of the dealer book behind price  (pagine 2, 43-44)
- **Cos'è:** A price-by-time heat map painted behind the candles, each vertical column a five-minute snapshot of the book.
- **Perché conta:** This is what separates a day that will chop from a day that will run.
- It runs from the open through to about thirty minutes past the newest snapshot, then stops
- Hover gives the exact value, labelled with the map name and cursor 7776.25
- The MAPS menu offers five maps plus None: γ Map, Charm, Vega, Volga and Delta
- There is no Vanna map and no Regime map on the chart
- > This is what separates a day that will chop from a day that will run.
- > rather than smearing one frozen reading across the dead after-hours session
- > a price-by-time heat map painted behind the candles and under the wall lines. Up and down is price. Left and right is time.

### A 10:00 screenshot will not match 10:00 later  (pagine 44, 62)
- **Cos'è:** The colour scale is computed across the whole day, not column by column.
- **Perché conta:** It makes 09:45 directly comparable with 15:45, at the cost of past columns re-shading.
- > a past column can re-shade when a heavier column arrives later in the day, so a screenshot taken at 10:00 will not match the same 10:00 viewed after the close. Nothing is wrong. The scale simply learned more.

### Why green and red became blue and amber  (pagine 44-45, 50, 69)
- **Cos'è:** A single two-ended colour axis, used identically on all five maps.
- **Perché conta:** The colour means the same thing whichever map you open, and neither end looks louder than the other.
- BLUE · dealers buy · supportive · dampening
- AMBER · dealers sell · pressure · amplifying
- Each arm is a thirty-two-step continuous ramp, not tiered
- At full strength blue and amber are within half a percent of each other in luminance
- The previous green-and-red scheme had the two ends almost three times apart in brightness
- > Nothing is blacked out, and that is on purpose. The dimmest cell of each arm still carries colour
- > The previous green-and-red scheme had the two ends almost three times apart in brightness, which made a dealer-long day look like more information than a dealer-short day.

### The price where dealers reverse their behaviour  (pagine 45, 69)
- **Cos'è:** White ticks marking where the field crosses zero, which is where amber becomes blue.
- **Perché conta:** It is one exact price with a mechanical meaning instead of an opinion.
- On the gamma map it is the volatility trigger
- On the delta map it is where the hedge flips between buying and selling, and that is a different price from the gamma flip
- > That is the line that matters on any map: the price at which the dealers' forced behaviour reverses.
- > no sign change in this book
- > rather than drawing a line that does not exist

### The legend shows a percentile, not a maximum  (pagine 45)
- **Cos'è:** The legend strip under the chart that decodes whichever map is active.
- **Perché conta:** The number beside the gradient is a high percentile of the day's field, not the day's peak.
- It reads MAP · GAMMA, MAP · CHARM, or MAP · DELTA · dealer hedge vs spot (blue = they BUY)
- The strip shows a negative number, the amber-to-ground-to-blue gradient bar, the matching positive number, the unit, then either 'where the colour changes sign' or 'no sign change in this book'
- > The plus-or-minus number is a high percentile of the day's field, not the day's maximum
- > The key belongs to the map and says so. Changing the walls metric from GEX to DEX will not change it, by design

### The gamma map: chop day or run day  (pagine 46)
- **Cos'è:** The default map, painting how fast a dealer's hedge must change as price moves.
- **Perché conta:** It is the range-versus-breakout read for the whole session.
- BLUE: dealers are long gamma there, so price goes sticky and rangey
- AMBER: dealers are short gamma, their hedging piles on, so moves accelerate
- A textbook range day is a broad blue band either side of spot with amber wedges above the ceiling and below the floor
- > A dealer who is long gamma must sell into strength and buy into weakness just to stay flat… Nobody chooses this; it falls out of the options they are holding
- > In a blue field, fade the edges and expect chop between the levels. In an amber field, expect a break to run and do not fade it
- > The same put wall that is real support in a blue field is an air pocket in an amber one, and mistaking the two is the single most expensive error on this screen

### The rally that runs on the clock, not on price  (pagine 47)
- **Cos'è:** The time-decay map, the one that owns the last two hours of the session.
- **Perché conta:** Charm moves the dealers' hedge even when price is standing perfectly still.
- Measured on a live index book, the gamma field had zero zero-crossings in every expiry bucket while charm had eighteen
- BLUE: dealers must BUY as the day runs
- AMBER: dealers must SELL
- > Charm is the way an option's delta changes purely because time passes, with price standing perfectly still. Every hour that elapses moves the dealers' hedge whether or not the market does anything, and it is the only one of these effects that does
- > why charm dominates the last two hours of the session, and why it is behind the well-known charm rally: dealers short out-of-the-money puts are mechanically forced to buy as those puts decay
- > The flip is the signal
- > If you are looking for the flip line, this is the map that has one.

### It does not say where. It says how violent.  (pagine 48)
- **Cos'è:** A map of fragility rather than of direction.
- **Perché conta:** It tells you how violent a move becomes once one starts.
- BLUE: dealers are LONG vol, a volatility spike makes them sell vol into it, which calms the spike. Stabilising
- AMBER: dealers are SHORT vol, a spike forces them to buy vol, which feeds the spike. Amplifying, and the dangerous side
- > Vega is what a dealer's book is worth per point of implied volatility… It says nothing about up or down
- > amber here does not mean down. It means 'if something happens here, it will be fast'
- > Traders use this map for sizing and for option selling, not for picking a side.

### Amber vega plus amber volga: the coiled spring  (pagine 48)
- **Cos'è:** Volga is how vega itself changes as volatility moves: the accelerator on the accelerator.
- **Perché conta:** It says whether the amplification feeds itself, which is the difference between a bleed and a blow-up.
- BLUE: self-correcting, as vol rises dealers get longer vol, so they sell, and the move runs out of fuel
- AMBER: cascade, as vol rises dealers get shorter vol, so they must buy more, and vol snowballs
- > Amber vega plus amber volga is the coiled spring. Dealers are short vol and that shortness deepens as vol rises, so a small catalyst can snowball into a violent volatility expansion and a sharp selloff.
- > Do not sell naked premium into amber-and-amber; the risk there is a fast blow-up, not a slow bleed.
- > Blue-and-blue is the opposite… the quietest configuration the map can show.

### How much buying sits between here and 7,800?  (pagine 49)
- **Cos'è:** The cumulative dealer hedge, drawn relative to where price is right now.
- **Perché conta:** It answers a question no other tool answers directly: read two prices and subtract.
- Read two prices and subtract, and the difference is how many deltas of futures have to change hands to travel between them
- It is derived from the same gamma book, since delta is its integral, so it costs no extra data and can never disagree with the gamma map
- The colour follows the hedge, not the book: a dealer long option delta is short futures, so the sign is already flipped for you
- > Where the gamma map shows the rate at which the hedge changes, the delta map shows the cumulative hedge
- > the zero line on this map… is a different price from the gamma flip line
- > They are two distinct levels and confusing them is the commonest mistake here.

### Why a boring afternoon drifts upward  (pagine 49)
- **Cos'è:** How a dealer's delta changes when implied volatility changes; here it is a badge, not a map.
- **Perché conta:** It is the mechanism behind the vol-crush rally.
- Badge row example: Gamma ↑ 33 · Charm ↓ 12 · Vanna —
- It activates only when implied vol has actually moved materially in the last five minutes
- A dash means that layer has nothing to say right now
- > positive net vanna means a fall in implied vol forces dealers to buy, so a quiet afternoon with implied vol bleeding away drifts upward
- > It is the mechanism behind the vol-crush rally.
- > All three badges pointing the same way is the highest-confidence state the panel can show.

## CDI

### How many dollars of premium, this minute  (pagine 16, 38, 40-41, 67)
- **Cos'è:** Where same-day expiring option money is going, in dollars of premium, one bar per minute on the candle axis.
- **Perché conta:** CDI climbing into a flat price is accumulation you cannot see on the chart itself.
- Call premium draws up from the centre line in green, put premium draws down from it in red
- It is dollars of premium, not contracts, and not delta-weighted
- The pane is about 180px
- On at every boot
- Header example: C $21K · P $7K
- 0DTE only
- > Net dealer-side delta exposure generated by same-day option flow
- > CDI climbing into a flat price is accumulation
- > On at every boot. This is one of the few layers the product turns on for you

### An iron condor is not a directional bet  (pagine 16, 41, 63)
- **Cos'è:** CDI counts only prints that are a standalone call or put, excluding the legs of spreads.
- **Perché conta:** It means a tall green bar really does mean somebody is buying calls.
- Multi-leg and All-legs modes exist on the internal build and are removed here
- > A four-leg iron condor prints two calls and two puts at once, so in an all-legs view it shows up as a tall two-sided spike that expresses no directional view whatsoever. Single-leg strips that out, so a tall green bar really is somebody buying calls
- > it cannot be inflated by somebody legging a spread
- > only prints that are a standalone call or put, which is pure directional flow.

### Which option chain the CDI pane follows  (pagine 40-41)
- **Cos'è:** The source selector for the option chain, plus the option of stacking a second SPY pane.
- **Perché conta:** It lets you watch index and ETF flow together without switching instruments.
- SPX, ES and MES all read the same-day index weekly book; SPY reads SPY; QQQ reads QQQ
- VIX, VX, NQ, RTY and GOLD have no option book and the source tag reads — (n/a)
- + 2nd BOOK stacks a second, independent SPY same-day pane directly beneath the first
- > The old index monthly toggle has been removed… index monthlies are morning-settled and stop trading the previous session, so they are never same-day

### Outliers clipped, true figure still printed  (pagine 41)
- **Cos'è:** A linear dollar scale with a softening applied to outliers.
- **Perché conta:** Five million and seven million stay distinguishable at a glance.
- Anything beyond roughly 3.5 times the 95th percentile clips to the edge but still prints its true dollar figure
- The five biggest visible bars carry a permanent dollar label
- > anything beyond roughly 3.5 times the 95th percentile clips to the edge but still prints its true dollar figure
- > the five biggest visible bars carry a permanent dollar label

### Every number carries its own age  (pagine 41)
- **Cos'è:** A dot in the CDI header stating how old the data in the pane is.
- **Perché conta:** It is an honesty check to run before quoting any figure out loud.
- Green under 30 seconds, amber from 30 seconds to 3 minutes, red beyond 3 minutes
- The age is shown in words beside it, for example 36s ago
- Amber banner: CDI auto-recovery in progress…
- Named empty states: n/a, no 0DTE flow yet, backfill HTTP 401 or 500
- > green under 30 seconds, amber from 30 seconds to 3 minutes, and red beyond 3 minutes, with the age in words beside it, for example `36s ago`

### The spike, not the trend, is the signal  (pagine 42)
- **Cos'è:** A tall isolated bar means somebody just spent real money inside a single minute.
- **Perché conta:** A spike landing exactly on a heavy dealer level is far stronger evidence than either on its own.
- > the everyday use is not the trend, it is the spike
- > A big CDI spike landing exactly on a heavy dealer level, or landing on a charm sign flip, is far stronger evidence than either on its own.
- > a quiet, even pane means the same-day tape has no opinion today, which is itself information.

## Options Flow

### How much premium today spent, and which side  (pagine 17, 38, 42-43, 67)
- **Cos'è:** Cumulative single-leg same-day premium, split by the side of the market it actually traded on, as three lines.
- **Perché conta:** It says whether the money spent today is directional, and in which direction.
- Green is calls bought at the ask minus calls sold at the bid
- Red is puts sold at the bid minus puts bought at the ask, so put buying plots downward
- Grey is the two summed
- Dollars of premium, not delta-weighted
- The pane is about 150px, default Off but it persists
- > A reading instrument — nothing sizes on it.
- > Cumulative single-leg same-day premium, split by the side of the market it actually traded on, plotted as three running lines across the session.

### Red going up is bullish  (pagine 42, 63)
- **Cos'è:** Both coloured lines are drawn in bullish-is-up terms, which inverts the intuition for puts.
- **Perché conta:** It is the misreading every new user makes exactly once.
- > Green going up is call buying. Red going down is put buying. Red going UP does not mean more puts, it means puts are being sold, which is bullish. A new user will misread this exactly once. Say it out loud in training.

### The options tape changes its mind first  (pagine 42)
- **Cos'è:** The net grey line crossing zero, and green crossing beneath red.
- **Perché conta:** It usually happens before the change shows up in the candles.
- > Green crossing beneath red means put demand has overtaken call demand in dollar terms, which is the options tape changing its mind, and it usually does so before it shows up in the candles
- > Both lines climbing together, green up and red up, is the quietly bullish combination: calls being bought and puts being sold.

### One number to quote: NET premium  (pagine 42)
- **Cos'è:** Three session-cumulative figures pinned to the right edge of the Flow pane.
- **Perché conta:** The NET figure with its sign is the single number worth quoting out loud.
- Example: C $4.20M, P -$1.11M, NET $3.09M
- > The NET figure with its sign is the single number to quote.
- > These are session-cumulative, not per-minute, so read them as 'this is what the day has spent'

### If it says 13.6h ago, it is last night's file  (pagine 43, 64)
- **Cos'è:** The age of the data printed in the Flow pane header.
- **Perché conta:** A total from yesterday's file looks exactly like a total from today.
- Header: OPTIONS FLOW · SPX 0DTE · single leg · premium $ · 45s ago · 312 min
- It prints seconds, then minutes, then hours
- > If it reads `13.6h ago` you are looking at last night's file, not today's session. Check this before quoting any total.
- > Check the Flow pane's age field before quoting a total.

### Every empty pane says why it is empty  (pagine 43)
- **Cos'è:** Each blank state carries a sentence explaining the reason it is blank.
- **Perché conta:** You never have to guess whether the product is broken.
- Named states: waiting for the collector; no trades tagged yet this session; no data file yet; no flow in view — scroll to the live edge; · frozen — last session, not aligned to the axis
- > no flow in view — scroll to the live edge
- > no 0DTE book for this instrument / available on SPX, ES, MES and SPY
