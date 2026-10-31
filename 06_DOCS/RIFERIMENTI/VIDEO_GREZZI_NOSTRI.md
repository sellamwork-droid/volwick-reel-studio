# Video grezzi nostri (31 ottobre 2026)

Cartella Drive: `00_CARICA_QUI/03_VIDEO_CONSIGLIATI/07_ALTRO/Video personali row/`. Indicazione di Power: video registrati da noi, da tenere perché possono sempre servire. Materiale nostro: si può usare dentro i video.
Studiati da `tudorswork · chat 03:37 · cloud`: 59 video su 63 (12 fotogrammi ciascuno, durata, formato, loudness). Fogli di fotogrammi non salvati nel repository.

## Da sapere prima di usarli
- **Sono in HDR (HLG, arib-std-b67)** quasi tutti i file 4K e 1080p del 21 ottobre: vanno convertiti in SDR bt709 prima del montaggio, altrimenti escono slavati. Esempio: `ffmpeg -i IN.MOV -vf "zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p" -c:v libx264 -crf 16 OUT.mp4`.
- **Schermi con dati reali** (gruppi B, D, F): per la licenza CME i dati reali non vanno nei video, tranne nei T3. Fuori dai T3 si usano solo le parti dove prezzi e numeri non si leggono (sfocate, mosse, in controluce) oppure le inquadrature sulla persona.
- **Gruppo C a bassa risoluzione** (464×848, compresso): chiedere gli originali.
- **Non studiati**: IMG_2190 (483 MB), IMG_3116 (292 MB), IMG_3134 (144 MB), IMG_3135 (113 MB) non si caricano dal PC; `FILE 2026-08-02 203827.mp4` e le 7 foto `IMAGE 2026-08-02 …jpg` hanno un carattere speciale nel nome e non si leggono dal collegamento. Da guardare da una sessione sul Mac.

## I momenti più utili
- **Hook POV della porta** (IMG_3112, 3113, 3114, 3118): mano che apre la porta e si entra nella stanza dei monitor. Apertura pronta per un T4 o un T2: "Entra nella stanza dove si leggono i dealer."
- **Grafico con trendline e frecce** (IMG_3125–3127): il "grafico normale" da mettere prima di Volwick nel confronto dei T4, girato da noi.
- **Faccia in camera** (IMG_3145, 3146, 3150, e 3028–3091 quando ci saranno gli originali): aperture con la persona e T2 con voce vera, più coinvolgenti della voce sintetica (V0003).
- **Texture macro del terminale** (gruppo B e F): stacchi e transizioni negli edit a tempo, con il fuoco morbido che nasconde i numeri.
- **Sito e prezzo $0.99** (IMG_3065, 3098): chiusura con l'offerta, quando ci saranno gli originali.

## Scheda per file
### A · Notte, baseball (1 clip)
Una persona batte palline da baseball su un prato di notte, 2 s, 1080p. Non è trading: utile solo come metafora (colpire la palla al momento giusto) in un edit.

| File | Durata | Formato | Audio |
|---|---|---|---|
| 1021.mp4 | 2.1 s | 1080×1920 30 fps | quasi muto (-30.8 LUFS) |

### B · Macro del terminale Volwick a mano libera (21 ottobre, 23:01–23:05)
Riprese 4K a 60 fps, telefono vicinissimo allo schermo, movimento e fuoco morbido: candele, livelli gialli tratteggiati, il riquadro KEY LEVEL con i contratti accumulati (2191–2193), pannelli di flusso e premium (2195, 2199), panoramiche sui monitor (2194, 2200, 2201). Quasi mute. Bellissime come texture e transizioni negli edit T1, ma sono dati reali sullo schermo: nei T1/T2/T4 solo dove numeri e prezzi non si leggono (sfocate, mosse), altrimenti solo nei T3.

| File | Durata | Formato | Audio |
|---|---|---|---|
| IMG_2191.MOV | 3.7 s | 2160×3840 60 fps HDR | quasi muto (-53.5 LUFS) |
| IMG_2192.MOV | 3.2 s | 2160×3840 60 fps HDR | quasi muto (-50.0 LUFS) |
| IMG_2193.MOV | 3.1 s | 2160×3840 60 fps HDR | quasi muto (-53.7 LUFS) |
| IMG_2194.MOV | 5.0 s | 2160×3840 60 fps HDR | quasi muto (-34.5 LUFS) |
| IMG_2195.MOV | 7.0 s | 2160×3840 60 fps HDR | parlato (-29.7 LUFS) |
| IMG_2196.MOV | 8.6 s | 2160×3840 60 fps HDR | quasi muto (-40.0 LUFS) |
| IMG_2197.MOV | 7.5 s | 2160×3840 30 fps HDR | quasi muto (-53.0 LUFS) |
| IMG_2198.MOV | 11.4 s | 2160×3840 30 fps HDR | quasi muto (-53.0 LUFS) |
| IMG_2199.MOV | 14.2 s | 2160×3840 30 fps HDR | quasi muto (-58.9 LUFS) |
| IMG_2200.MOV | 7.5 s | 2160×3840 30 fps HDR | quasi muto (-50.1 LUFS) |
| IMG_2201.MOV | 8.6 s | 2160×3840 30 fps HDR | quasi muto (-54.7 LUFS) |

### C · Presentazione alla scrivania con LED blu, bassa risoluzione (21 ottobre)
Una persona in maglietta bianca parla in camera seduta alla scrivania (parlato, −16/−23 LUFS), poi la camera gira sul monitor con il sito Volwick: "See the data that makes money for the world's biggest hedge funds" (3065), "what's moving it" (3079), la pagina prezzi con $0.99 (3098), il terminale (3094). ATTENZIONE: 464×848, compressi (probabilmente passati da WhatsApp): servono gli originali dal telefono prima di usarli.

| File | Durata | Formato | Audio |
|---|---|---|---|
| IMG_3028.MOV | 4.0 s | 464×848 30 fps | parlato (-16.1 LUFS) |
| IMG_3032.MOV | 3.4 s | 464×848 30 fps | parlato (-15.7 LUFS) |
| IMG_3047.MOV | 5.4 s | 464×848 30 fps | parlato (-20.8 LUFS) |
| IMG_3065.MOV | 8.5 s | 464×848 30 fps | parlato (-23.2 LUFS) |
| IMG_3079.MOV | 5.6 s | 464×848 30 fps | parlato (-16.1 LUFS) |
| IMG_3085.MOV | 2.4 s | 464×848 30 fps | parlato (-18.2 LUFS) |
| IMG_3091.MOV | 4.7 s | 464×848 30 fps | parlato (-17.0 LUFS) |
| IMG_3094.MOV | 3.4 s | 464×848 30 fps | parlato (-19.8 LUFS) |
| IMG_3098.MOV | 4.0 s | 464×848 30 fps | parlato (-16.1 LUFS) |

### D · Ingresso in ufficio in POV + scrivania con più monitor (21 ottobre, 22:09–22:35)
Mano che apre la porta, camminata tra le tende alla veneziana, si scopre il trader alla scrivania che si gira e parla (parlato in 3115–3124), poi i monitor. 3125–3128 (muti): un grafico con trendline disegnate, frecce blu e icone $, poi panoramica sulla postazione con più monitor. Il POV della porta è un hook pronto ("entra nella stanza dove..."); le trendline di 3125–3127 sono il "grafico normale" perfetto per il confronto con Volwick nei T4.

| File | Durata | Formato | Audio |
|---|---|---|---|
| IMG_3112.MOV | 5.7 s | 1080×1920 30 fps HDR | parlato (-25.6 LUFS) |
| IMG_3113.MOV | 6.7 s | 1080×1920 30 fps HDR | parlato (-25.0 LUFS) |
| IMG_3114.MOV | 6.7 s | 2160×3840 60 fps HDR | parlato (-19.3 LUFS) |
| IMG_3115.MOV | 8.5 s | 2160×3840 60 fps HDR | parlato (-21.1 LUFS) |
| IMG_3117.MOV | 8.4 s | 2160×3840 60 fps HDR | parlato (-22.0 LUFS) |
| IMG_3118.MOV | 10.1 s | 2160×3840 60 fps HDR | parlato (-22.0 LUFS) |
| IMG_3119.MOV | 8.5 s | 2160×3840 60 fps HDR | parlato (-15.5 LUFS) |
| IMG_3120.MOV | 3.4 s | 2160×3840 60 fps HDR | parlato (-23.2 LUFS) |
| IMG_3121.MOV | 9.0 s | 2160×3840 60 fps HDR | parlato (-16.5 LUFS) |
| IMG_3122.MOV | 10.7 s | 2160×3840 60 fps HDR | parlato (-19.8 LUFS) |
| IMG_3123.MOV | 12.1 s | 2160×3840 60 fps HDR | parlato (-18.4 LUFS) |
| IMG_3124.MOV | 12.7 s | 2160×3840 60 fps HDR | parlato (-18.9 LUFS) |
| IMG_3125.MOV | 10.0 s | 2160×3840 60 fps HDR | quasi muto (-49.6 LUFS) |
| IMG_3126.MOV | 10.0 s | 2160×3840 60 fps HDR | quasi muto (-53.5 LUFS) |
| IMG_3127.MOV | 6.9 s | 2160×3840 60 fps HDR | quasi muto (-53.4 LUFS) |
| IMG_3128.MOV | 8.1 s | 2160×3840 60 fps HDR | quasi muto (-57.4 LUFS) |

### E · Spiegazioni con le mani davanti ai monitor e parlato in camera (21 ottobre, 22:49–22:58)
La persona spiega gesticolando e indicando gli schermi (3136–3144, 4K 60 fps, parlato −17/−23 LUFS); 3145, 3146 e 3150 sono inquadrature frontali da seduto che parla in camera (1080p): le migliori per un'apertura con la faccia o per i T2 con voce vera.

| File | Durata | Formato | Audio |
|---|---|---|---|
| IMG_3136.MOV | 5.0 s | 2160×3840 60 fps HDR | parlato (-18.6 LUFS) |
| IMG_3137.MOV | 1.8 s | 2160×3840 60 fps HDR | quasi muto (-32.7 LUFS) |
| IMG_3138.MOV | 6.1 s | 2160×3840 60 fps HDR | parlato (-17.0 LUFS) |
| IMG_3139.MOV | 4.5 s | 2160×3840 60 fps HDR | parlato (-22.2 LUFS) |
| IMG_3140.MOV | 8.0 s | 2160×3840 60 fps HDR | parlato (-21.5 LUFS) |
| IMG_3143.MOV | 6.4 s | 2160×3840 60 fps HDR | parlato (-19.2 LUFS) |
| IMG_3144.MOV | 6.6 s | 2160×3840 60 fps HDR | parlato (-23.4 LUFS) |
| IMG_3145.MOV | 3.3 s | 1080×1920 30 fps HDR | parlato (-19.0 LUFS) |
| IMG_3146.MOV | 6.7 s | 1080×1920 30 fps HDR | parlato (-21.1 LUFS) |
| IMG_3150.MOV | 8.0 s | 1080×1920 30 fps HDR | parlato (-22.3 LUFS) |

### F · B-roll concentrato e macro degli schermi (21 ottobre, 23:06–23:09)
Quasi muti: inquadrature da dietro la spalla, mano sul mento, sguardo sugli schermi, macro di candele e livelli gialli (3157–3160), panoramica finale sulla postazione (3163). B-roll "trader concentrato" per gli stacchi tra un layer e l'altro e per le aperture dei T1.

| File | Durata | Formato | Audio |
|---|---|---|---|
| IMG_3152.MOV | 2.5 s | 1080×1920 30 fps HDR | quasi muto (-30.6 LUFS) |
| IMG_3153.MOV | 7.5 s | 1080×1920 30 fps HDR | quasi muto (-53.1 LUFS) |
| IMG_3154.MOV | 3.4 s | 1080×1920 30 fps HDR | quasi muto (-54.8 LUFS) |
| IMG_3155.MOV | 1.6 s | 1080×1920 30 fps HDR | quasi muto (-59.6 LUFS) |
| IMG_3156.MOV | 3.9 s | 2160×3840 60 fps HDR | quasi muto (-31.8 LUFS) |
| IMG_3157.MOV | 5.0 s | 2160×3840 60 fps HDR | quasi muto (-32.2 LUFS) |
| IMG_3158.MOV | 1.6 s | 2160×3840 60 fps HDR | quasi muto (-56.4 LUFS) |
| IMG_3159.MOV | 5.2 s | 2160×3840 60 fps HDR | quasi muto (-46.4 LUFS) |
| IMG_3160.MOV | 5.3 s | 2160×3840 60 fps HDR | quasi muto (-34.3 LUFS) |
| IMG_3161.MOV | 5.8 s | 2160×3840 60 fps HDR | quasi muto (-56.6 LUFS) |
| IMG_3162.MOV | 4.3 s | 2160×3840 60 fps HDR | quasi muto (-58.7 LUFS) |
| IMG_3163.MOV | 6.5 s | 2160×3840 60 fps HDR | quasi muto (-58.0 LUFS) |
