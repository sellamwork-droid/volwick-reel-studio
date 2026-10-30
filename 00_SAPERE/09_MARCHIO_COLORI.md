# Volwick — colori del marchio (fissati)

Direzione: **blu notte e oro**, con la tela del grafico portata a un quasi-nero neutro.

## Perché questi e non altri
Verde, rosso, viola e ciano sono già occupati dai dati sul grafico. Se il marchio usasse
uno di quei colori, il cliente proverebbe a leggerci un significato di trading. Restano
tre accenti possibili: oro, rame, neutro avorio. L'oro è quello che il settore riconosce
come denaro serio senza doverlo spiegare, ed è quello già presente nel logo.

Il navy porta istituzione e prestigio ovunque si legge del testo, ma dentro l'area del
grafico è un difetto: i colori dei dati nuotano nello stesso blu e i quattro tipi di muro
si distinguono meno. Per questo la tela del grafico, e solo quella, scende a `#080A0F`.

## Interfaccia
```
--s0     #0B1220   fondo pagina, rail, sito
--s1     #111A2B   pannelli, barre
--s2     #182338   superfici rialzate
--s3     #20304A   controlli
--s4     #294060   controllo in hover
--ln     #1E2B42   divisori
--ln2    #2A3A56   bordi
--chart  #080A0F   tela del grafico — l'unica eccezione al navy
--i1     #EDF1F7   testo primario
--i2     #9DAAC0   testo secondario
--i3     #67748C   testo terziario
--i4     #4A5468   disattivato
--ac     #E8B551   accento del marchio
--acd    #A8802F   accento premuto
--acs    rgba(232,181,81,.14)   accento di sfondo
```

## Significati — solo interfaccia
```
--ok     #45AE77   live, armato, funzionante
--wn     #E0913F   attenzione, book vecchio, replay, in pausa
--dg     #E0656A   errore, disconnesso, distruttivo
--px     #C8D3E4   prezzo corrente
```
Due correzioni rispetto alla versione precedente:
- **Attenzione** è virata all'arancio. Su un marchio oro, un avviso ambra era ambiguo.
- **Prezzo corrente** lascia il blu e diventa platino. Su fondo navy un blu su blu sparisce.

## Dati — solo grafico
```
call · gamma lunga    #39A86F
call · gamma corta    #49B7CC
put  · gamma lunga    #CF5D5D
put  · gamma corta    #B16FD0
magnete               #C9922F
```
**Il conflitto oro marchio / oro magnete è chiuso.** Il magnete scende a un oro brunito,
più scuro e più spento. Sulla stessa schermata l'oro brillante significa sempre "premi qui",
l'oro spento significa sempre "questo è il livello". Due valori diversi della stessa
famiglia, nessuna ambiguità.

## Regole
- I colori dell'interfaccia e i colori dei dati non si mescolano mai.
- Un solo accento. Se tutto è evidenziato, niente lo è.
- Il colore non è mai l'unico segnale: ogni stato porta anche una parola.
- Il 90% dei pixel deve restare neutro navy, altrimenti l'oro smette di significare qualcosa.
