# Volwick — marchio definitivo (19 set 2026)

Scelto da Power fra sei proposte a forme piene: **la V piena**, proposta 03.
Consegna: `volwick-logo-definitivo.zip` (36 file).

## Cos'è

La V del nome costruita come due tratti pieni con le punte tonde. Il braccio destro è
più lungo e sale più in alto del sinistro: quello è lo stoppino, cioè la parte della
candela che segna dove il prezzo è arrivato e da dove è stato respinto. Il significato
sta nell'asimmetria, non in un elemento aggiunto.

## Geometria, da non modificare

```
riquadro            100 × 100
punta sinistra      18,0 · 25,0
punta destra        82,0 · 17,0
vertice             50,0 · 83,0
raggio capsula      11,8   (spessore 23,6)
```

Le forme sono **tracciati chiusi**, non contorni con spessore. Scalano senza deformarsi
e non hanno stroke che cambia con lo zoom. Il braccio destro è disegnato sopra il
sinistro, con un'ombra di contatto a gradiente radiale ritagliata sul braccio sinistro:
è quella che dà la profondità all'incrocio.

## Colori

| Ruolo | Valore |
|---|---|
| inchiostro su fondo scuro | `#ECEFF4` |
| inchiostro su fondo chiaro | `#0C111A` |
| accento, WICK e simbolo piatto | `#3D6FF5` |
| gradiente braccio sinistro | `#EDF3FF` → `#9FBCFF` → `#4B7AF7` → `#20409E` |
| gradiente braccio destro | `#A8C3FF` → `#6E92FF` → `#3660DE` → `#11256B` |

Luce sempre dall'alto a sinistra. I riflessi sono capsule più sottili spostate verso
la luce, con gradiente bianco in dissolvenza.

## Carattere

Geist SemiBold (600), crenatura bloccata a **−0,02 em**. Nei file SVG la scritta è già
convertita in tracciati, quindi il lockup resta identico anche dove Geist non è
installato.

## Proporzioni del lockup

Altezza visibile del simbolo = **1,44 × cap height** della scritta. Spazio fra simbolo
e parola = **0,46 × cap height**. Il centro del simbolo è allineato al centro della cap
height, non alla linea di base.

## Cosa c'è nel pacchetto

- **Simbolo**: versione con volume, piatta blu, bianca, nera, e una che eredita il
  colore del testo intorno tramite `currentColor`.
- **Parola**: fondo scuro, fondo chiaro, bianca, nera.
- **Lockup**: fondo scuro, fondo chiaro, piatto per la stampa, bianco, nero.
- **PNG trasparenti**: simbolo fino a 1024, parola e lockup fino a 2400.
- **Icone**: applicazione quadrata 1024, web arrotondata 512, favicon 32 · 64 · 180.
- **Presentazione**: simbolo, parola e lockup su fondo con alone, fino a 3000 px.
- **COME-SI-USA.txt**: codice per la testata, righe della favicon, regole d'uso.

## Regole

Altezza minima del lockup 24 px a schermo e 9 mm in stampa; sotto quella soglia va il
simbolo da solo. **Sotto i 32 px si usa la versione piatta**, perché a quelle misure il
gradiente si impasta e il simbolo perde il disegno. Area di rispetto pari alla larghezza
di un braccio della V. Mai ruotato, mai deformato, mai con ombre esterne, e mai colorato
con i colori dei dati (verde, rosso, ciano, viola, oro) perché dentro il prodotto quei
colori hanno già un significato.

## Note per chi riprende il lavoro

Il generatore è `vfinal/gen.py` nello scratchpad di sessione: costruisce le capsule in
geometria esatta e converte la scritta in tracciati con fontTools. `vfinal/render.js`
esporta tutti i PNG con Playwright. Se servono altre misure, si rigenerano da lì invece
di ridisegnare.
