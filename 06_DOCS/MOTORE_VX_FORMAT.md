# Volwick · motore VX: video ricalcati sui format che funzionano (30 ottobre 2026)

Richiesta di Power: per ogni video di esempio in `07_RIFERIMENTI/ESEMPI_FORMAT` una versione Volwick che ne segue il ragionamento. Volwick è sempre il protagonista e va valorizzato con esempi. Il metodo degli altri non si scredita: il video può partire da lì e mostrare che con Volwick quelle cose non servono, perché si vedono Dealer Walls, Block Prints e il resto. Impatto visivo forte e aggressivo.

## I cinque format

| Esempio | Ragionamento | Versione Volwick |
|---|---|---|
| Trendline breakout (grafico bianco, linee e scritte a mano) | Tutorial familiare, il trader si riconosce | **TRENDLINE.** Parte uguale, con la trendline disegnata, "Area Of Value", la rottura e la posizione short. Poi un cerchio dalla rottura apre Volwick: sotto la linea c'era un put wall magenta (short γ), i dealer vendono nella discesa e passano 2.000 contratti sul livello. "No lines to draw. Just context." |
| Indicatore facile (registrazione dello schermo, riquadri bianchi, cerchi e frecce) | "Come faccio io con un solo strumento" | **ONE LAYER.** Si cerca un indicatore e lo si scarta; si apre Volwick e si sceglie WALLS · Top 5 col riquadro bianco. Poi tre reazioni cerchiate: il verde assorbe, il rosso difende, il magenta lascia correre |
| Micro lezione ICT (bianco minimal, testo parola per parola) | Una regola, un grafico, dieci secondi | **ONE RULE.** "If price pushes into a green wall, dealers sell the rally to stay hedged. That's why it often stalls." |
| Libro di trading sul tavolo (pagina col pattern, poi il monitor) | Il pattern che tutti conoscono | **THE BOOK.** Pagina col doppio minimo, colpo di frusta sul monitor con Volwick: put wall rosso long γ e block prints sui minimi. "Now you see why it held." |
| Edit veloce in motion design (logo, UI a scatti, carte che fluttuano, numeri a pixel) | Ritmo e desiderio, niente voce | **EDIT.** Logo che si accende, comandi del terminale a scatti, muri che si schiantano a tempo, "2,000" che si compone a pixel, sei schede dei layer, SEE WHAT OTHERS CAN'T., logo |

## Regole del motore
- Lingua: inglese, voce Matthew (multilingual v2), una ripresa per video. L'edit è senza voce, con musica sintetizzata a 128 BPM e tagli a tempo.
- Colori dei layer identici al terminale: verde call long γ, rosso put long γ, ciano call short γ, magenta put short γ, oro per i block print mega. Le etichette sono uguali a quelle reali ("7,733.25 · −$16.9M", "★ 7712.50 1,502 · 3 blocks").
- Sottotitoli: la frase parlata, esatta, parola per parola. La prima frase è leggibile dal primo fotogramma.
- Le chip dei layer stanno in basso, dentro la zona sicura (y ≤ 1550).
- Finale sempre uguale: linee della scena che diventano il logo, TRADE WITH INSTITUTIONAL CONTEXT., DISCOVER VOLWICK →, "$0.99 your first month", "Then $89/month. Cancel anytime.", "Simulated data. Not financial advice.", logo sonoro.
- Niente previsioni: "often stalls", "defend", "lets price run" descrivono il meccanismo, non promettono il risultato.

## Dove sta
- Codice: `00_MOTORE/scenes/vx_*` (vx_common con vx.js e vx_chart.js), `00_MOTORE/vx` (vx_assemble.py, vx_sound.py, run_vx.sh).
- Video: `04_RENDER`.
