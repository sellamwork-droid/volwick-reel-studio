# Hook · studio, regola di scelta e catalogo (aggiornato al 30 ottobre 2026)

L'archivio è `01_HOOK/clip`, il catalogo vivo è `01_HOOK/CATALOGO_HOOK.csv` (si aggiorna con `python3 00_MOTORE/tools/hook_index.py .` dalla cartella 13_REEL_STUDIO; le colonne evento_mercato, formato_consigliato, stato e note si compilano a mano).

## Cosa dice la ricerca
- Il clip d'apertura funziona da interruzione dello schema solo se si collega a quello che viene dopo: se lo shock non si collega al contenuto, cala la retention.
- Finestra di decisione circa 1,4 s su Reels e 1,7 s su TikTok: hook di 1,5–2 s, già in movimento dal primo fotogramma, taglio durante l'azione.
- Più della metà delle visualizzazioni parte senza audio: il collegamento deve funzionare a muto.
- Due modi di collegare, sommabili: la scritta che mappa il clip sul concetto e il match cut (movimento o forma del clip che continua nello stesso punto dello schermo nel primo fotogramma del grafico).
- L'hook promette solo quello che il video poi mostra davvero.
Fonti: dev.to/bulkdl "Hook Engineering 2026", autoclip.dev "10 types of viral clip hooks", klap.app "Instagram Reels trends 2026", tokcount.com "micro-cut transitions", studiobinder "match on action".

## Regola di scelta
1. Il movimento del clip è lo stesso evento che il grafico mostra subito dopo (su, giù, stallo, crollo).
2. Taglio sul movimento; il punto chiave del clip finisce nella stessa posizione del punto chiave del primo fotogramma del grafico (`vx/hook_match.py`, anche con rallentatore).
3. Scritta corta nelle zone sicure, con logo, la fascia scura non deve coprire il soggetto.
4. Se nessun clip ha lo stesso movimento, niente hook.

## Catalogo
| Clip | Movimento | Evento di mercato | Stato |
|---|---|---|---|
| Timber Drop | appeso a un ramo, si lascia cadere | caduta verso il supporto | usato CREATIVE 06B (torso a 579,958 al secondo 4.0 sulla candela che cade) |
| Basketball Fail | sale sulla parete, tocca la sbarra alta, molla e cade | massimo e ricaduta; rally fermato | usato CREATIVE 01 HOOK |
| Scrape Down | raschietto blu che pulisce | schermo pulito, un solo layer | usato CREATIVE 02 |
| Soccer Player Launches Ball Overhead | palla in alto, si ferma, ricade | stallo | usato CREATIVE 03 (crop senza sponsor) |
| BMX Rider Leaps Over Concrete Wall | sale sul muro e salta giù | rottura verso il basso | libero |
| Trench Wall Crumbles | la parete della buca crolla | supporto che cede | libero |
| Ocean Drop | sasso dalla scogliera fino al mare | discesa senza pavimento | libero |
| Rope Swing Ends in Icy Pond | oscilla e finisce in acqua | ritorno violento | libero (720p con bande nere) |
| Greasy Pole | cammina su un palo e cade | camminare su una linea | solo senza screditare il metodo |
| Sandy Neck, Bad Ride | fail generico, volatilità | debole | |
| Crab, Piglet, Duck Heart, Cat Washes Car, Guests Race Tiny Cars, Man Swings Cleaver, Baby Face | nessun movimento di mercato | | non usare |
| Battle Rope, Girl Punching, Man Falls From Planks, Power Slap Kick, Slap to Kick, Tony Hawk, Glass Bottle, Ceiling Lights, Pancake Flip, Plane Crash | | | esclusi (persone esposte, possibile minore, marchi, scritte, @nomi, persona famosa, incidente) |
