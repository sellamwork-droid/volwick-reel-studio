# Studio degli hook (31 ottobre 2026)

Richiesta di Power: studiare tutti gli hook caricati (circa 250), capire quali funzionano di più e fare una scrematura. Gli edit (T1) non usano hook; gli hook servono a T4 e, quando serve, a T2.

## Come è stato fatto
266 clip in `01_HOOK/clip` (127 già in archivio, 139 scaricati da `00_CARICA_QUI/01_VIDEO_HOOK/Hook`; SpongeBob saltato perché personaggio coperto da diritti; i file "(1)" erano doppi). Per ogni clip si è guardata la scheda di 6 fotogrammi (`01_HOOK/_schede`) con gli stessi criteri:
- **esclusione:** marchi, scritte, watermark, @nomi, persone o personaggi famosi, violenza vera o persone in pericolo, contenuti non adatti a un marchio finanziario, qualità bassa, azione che non si capisce in 1 secondo;
- **forza:** movimento verticale netto che si aggancia a un movimento di prezzo (match cut), azione in 1–1,5 s, soggetto grande e centrale, sfondo pulito.
Voto 0–10; **approvato** ≥ 7, **riserva** 5–6 (solo se il movimento combacia benissimo), **escluso** ≤ 4 o una regola violata. Tutto è nel catalogo (`CATALOGO_HOOK.csv`: stato, evento di mercato, formato, nota con voto e momento migliore).

## Risultato
| | clip |
|---|---|
| approvati (compresi i già usati) | 22 |
| riserva | 43 |
| esclusi | 201 |

Motivi di esclusione: altro (tono, contenuto non adatto a un marchio finanziario) 110; marchi, scritte, watermark o @nomi 46; nessun movimento utile o non si capisce in 1 s 23; violenza, incidente o persone in pericolo 14; qualità bassa o inquadratura 6; personaggi o persone famose 2.

Doppioni (stesso filmato, file diversi): Donkey Takes Tumble = Donkey Flips Over a Wooden Fence; Athlete Falls From Gym Pull-Up Bar = Basketball Fail (già usato); No Babies = Man Loses Balance on Narrow Fence Rail; Pan Face = Man Ignites Something Beneath a Metal Bowl. Giant Snowball Dropped From Bridge e Snow Splash sembrano lo stesso lancio da due file: usarne uno per video.

## Gli approvati, dal più forte
| voto | clip | evento di mercato | nota | stato |
|---|---|---|---|---|
| 8 | BMX Rider Leaps Over Concrete Wall | rottura del supporto e caduta | già usato e approvato: salta oltre il muro e cade giù al 5°-6° fotogramma | usato V0001 |
| 8 | Donkey Flips Over a Wooden Fence | rottura del muro e caduta | asino scavalca la staccionata e precipita a testa in giù dal 3° fotogramma; soggetto grande e centrale | approvato |
| 8 | Donkey Takes Tumble | rottura del muro e caduta | stesso filmato di Donkey Flips Over a Wooden Fence (file diverso): usarne uno solo | escluso |
| 8 | Giant Snowball Dropped From Bridge | rottura del supporto e caduta nel vuoto | Enorme palla di neve gettata dal ponte, cade dritta e esplode in acqua; caduta dal 3° al 6° fotogramma | approvato |
| 8 | Man Backflips From Narrow Waterside Post | rimbalzo sul livello: sale e torna sul muro | Salto mortale dal palo contro cielo e montagne, riatterra sullo stesso palo; sfondo pulitissimo, 1,1 s | approvato |
| 8 | Ocean Drop | nessun pavimento sotto il prezzo: caduta nel vuoto | sasso lanciato dalla scogliera cade in mare (2°-4° fotogramma); già usato in CREATIVE 06 | approvato |
| 8 | Snow Splash | caduta verticale senza pavimento | palla di neve enorme lanciata dal ponte, cade nel vuoto e schizza nell'acqua; caduta 4°, impatto 6° | approvato |
| 8 | Timber Drop | rottura del supporto e caduta | lascia il ramo e cade dritto su cielo pulito; già usato e approvato, caduta dal 4° fotogramma | usato CREATIVE 06B |
| 8 | Tuck & Roll | rottura del supporto e caduta | salta dal tetto e atterra rotolando sul prato; soggetto centrale su cielo pulito, salto al 4° fotogramma | approvato |
| 8 | Water Ride Splash | crollo verticale ed esplosione di volatilità | barca scende dalla rampa ripida ed esplode in un muro d'acqua al 4° fotogramma | approvato |
| 7 | Athlete Falls From Gym Pull-Up Bar | falsa rottura: sale e ricade | salta, si aggrappa alla sbarra in alto e ricade di schiena al 6° fotogramma; sfondo pulito | escluso |
| 7 | Basketball Fail | falsa rottura: sale e ricade | duplicato di Athlete Falls From Gym Pull-Up Bar: ricade dalla sbarra al 6° fotogramma | usato CREATIVE 01 |
| 7 | Big Swing | caduta libera verso il supporto | figura che piomba dal cielo verso la camera, grande al 6° fotogramma; cielo pulito | approvato |
| 7 | Bridge Drop | falsa rottura: sale e ricade | salto mortale dal ponte, picco al 4° fotogramma e caduta in mare; cielo pulito | approvato |
| 7 | Construction Fall | rottura del supporto e caduta | pavimento di assi cede sotto l'operaio al 5° fotogramma; cade al piano sotto, nessuna ferita visibile | approvato |
| 7 | Greasy Pole | falsa tenuta: scivola dal livello e crolla | Uomo cammina sul palo, scivola e cade in acqua con schizzo; caduta dal 3° al 6° fotogramma | approvato |
| 7 | Man Backflips From High Bar Into Sand | falsa rottura: sale e ricade | Salto mortale dalla sbarra contro il cielo, picco al 5° fotogramma e ricaduta; tagliare attorno ai 5 s | approvato |
| 7 | Man Throws Large Log From Bridge | nessun pavimento sotto il prezzo: caduta nel vuoto | lancia un tronco dal ponte, la camera segue la caduta nella gola (4°-6° fotogramma); tagliare prima, graffiti sulla ringhiera | approvato |
| 7 | Pole Vaulter Falls During Attempt | falsa rottura: sale e ricade | asta si piega, atleta sale e ricade a terra fuori dal materasso; salita 3°, ricaduta 5°-6° | usato V0006 |
| 7 | Pull Up Fail | rottura del supporto e caduta | sbarra per trazioni cede e lei cade giù; rottura al 5° fotogramma, sfondo pulito | approvato |
| 7 | Santa-Hat Skater Crashes Into Rink Boards | rally che si ferma contro un muro | pattinatore lanciato frena e sbatte contro la balaustra; impatto al 5° fotogramma | approvato |
| 7 | Skateboard Slam | rottura del supporto e caduta | skater in discesa perde l'equilibrio e cade sull'asfalto; caduta 4°-6°, sfondo pulito | approvato |

## Riserva
| voto | clip | evento di mercato | nota | stato |
|---|---|---|---|---|
| 6 | Adult Tumbles Off a Giant Playground Slide | discesa veloce e atterraggio sul supporto | adulto scivola giù dallo scivolo e atterra sul tappetino al 5°-6° fotogramma; soggetto piccolo all'inizio | riserva |
| 6 | BMX Back Fail | falsa rottura: sale e ricade | rider sale sul corrimano, si ribalta e cade di schiena al 6° fotogramma; persone sullo sfondo | riserva |
| 6 | BMX Rider Jumps Down Concrete Staircase | discesa a gradini e rottura del supporto | scende la scalinata e si schianta all'ultimo fotogramma; soggetto piccolo fino al 5° | riserva |
| 6 | Bike Flip | falsa rottura: sale e ricade | mountain bike salta e si ribalta oltre il manubrio al 5° fotogramma; soggetto piccolo | riserva |
| 6 | Boat Tow Launches Man Into Air | accelerazione improvvisa al rialzo | trainato dalla barca e lanciato in cielo al 4°-5° fotogramma; soggetto piccolo in alto | riserva |
| 6 | Coconut Tree | rottura del supporto e caduta | palma si spezza e la chioma crolla in spiaggia al 4° fotogramma; inquadratura larga, soggetto piccolo | riserva |
| 6 | Corrugated Roof Collapses Under Crouching Man | rottura del supporto e caduta | tetto di lamiera cede e l'uomo sprofonda all'ultimo fotogramma; foglie in primo piano, soggetto piccolo | riserva |
| 6 | Couch Airbag | accelerazione improvvisa al rialzo | divano con airbag lancia l'uomo in alto al 2° fotogramma; locale buio, qualità media | riserva |
| 6 | Heights Jump | rottura del supporto e caduta | Salto parkour dal muretto giù nella scarpata, camera che segue; soggetto piccolo, salto al 3°-4° fotogramma | riserva |
| 6 | Hooded Person Launches Soccer Ball Skyward | accelerazione improvvisa al rialzo | Pallone sparato dritto in cielo, ultimo fotogramma palla nel cielo blu; controllare logo sul pallone | riserva |
| 6 | Man Bounces High on a Pogo Stick | rally che sale e poi crolla | Sale col pogo sul tetto e salta giù in strada; soggetto piccolo, numero civico visibile | riserva |
| 6 | Man Loses Balance on Narrow Fence Rail | equilibrio precario su un livello poi rottura e caduta | cammina sui pali della recinzione e cade al 6° fotogramma; lattina sul palo da controllare per marchio | riserva |
| 6 | Man Smashes Wall With Sledgehammer | il muro cede: rottura di un livello | mazza contro il muro, grosso pezzo crolla al 6° fotogramma; stampa sulla maglietta non leggibile | riserva |
| 6 | Martial Artist Kicks an Airborne Bottle | falsa rottura: sale e viene respinto | lancia la bottiglia in alto e la colpisce con un calcio al 6° fotogramma; cielo pulito, bottiglia piccola | riserva |
| 6 | No Babies | equilibrio precario su un livello poi rottura e caduta | duplicato di Man Loses Balance on Narrow Fence Rail: tenerne uno solo; caduta al 6° fotogramma | escluso |
| 6 | Skateboard Flop | rottura del supporto e caduta | skater scivola sul bordo, la tavola parte e cade di schiena al 6°; controllare grafica sulla tavola | riserva |
| 6 | Treadmill Fall | rottura del supporto e caduta | cade sul tapis roulant e viene trascinata giù al 3° fotogramma; scritta sul muro a destra da tagliare | riserva |
| 6 | Tree Jump | rottura del supporto e caduta | si lancia dall'alto dentro un pino, caduta netta su cielo bianco ma soggetto piccolo in alto | riserva |
| 6 | Tree Smash | rimbalzo su un muro | pallina da golf colpisce l'albero e torna indietro sul giocatore; pallina piccola, rimbalzo al 6° fotogramma | riserva |
| 5 | Athlete Flips Off an Exercise Bar | falsa rottura: sale e ricade | ribaltamento sulla sbarra e caduta finale; inquadratura confusa, piccoli loghi sui pali | riserva |
| 5 | Bad Ride | caduta libera improvvisa | torre a caduta libera che precipita sopra un uomo; scritte luminose sulla torre, verificare | riserva |
| 5 | Bike Tumble | impennata che si ribalta | ragazzo in impennata cade all'indietro al 5°-6° fotogramma; minore in strada, attenzione | riserva |
| 5 | Bowling Ball Rolls Through Skate Bowl | scende e rimbalza dal fondo | palla rotola giù nel bowl e risale; palla piccola tranne al 4° fotogramma | riserva |
| 5 | Chicken Lays Egg | rottura del supporto e caduta | uovo cade dal trespolo all'ultimo fotogramma; soggetto piccolo, qualità media | riserva |
| 5 | Cyclist Falls While Swinging a Hoop | falsa rottura: equilibrio che cede di colpo | in equilibrio sulla bici col cerchio, poi cade all'ultimo fotogramma; soggetto piccolo | riserva |
| 5 | Dirt Bike Flip | falsa rottura: sale e ricade | salto dalla rampa e ribaltamento in aria al 5° fotogramma; camera mossa, soggetto medio | riserva |
| 5 | Dog Crash | prezzo travolto e crollo | cane travolge la donna che cade distesa al 5° fotogramma; qualità media | riserva |
| 5 | Extreme Bike Crash | esplosione di volatilità | biker si schianta sulla curva con nuvola di polvere al 4°/5° fotogramma; soggetto piccolo all'inizio | riserva |
| 5 | Gorilla Charges Toward the Glass | accelerazione improvvisa al rialzo | Gorilla carica e si alza di scatto sulle zampe al 5° fotogramma; manca un impatto netto | riserva |
| 5 | Large Black Animal Falls From Roof | rottura del supporto e caduta | Grosso animale nero sul tetto che scivola giù all'ultimo fotogramma; verificare che atterri bene | riserva |
| 5 | Long Rod Drops Onto Sports Car Hood | caduta secca su un livello | Asta lasciata cadere dall'alto sul cofano di un'auto, impatto al 3° fotogramma; soggetto sottile | riserva |
| 5 | Man Backflips Off a Concrete Pipe | falsa rottura: sale e ricade | Salto mortale giù dal tubo di cemento, sfondo confuso e un po' sgranato; capriola al 4° fotogramma | riserva |
| 5 | Man Leaps From High Platform Into Pool | caduta pesante e impatto sul supporto | tuffo di pancia dal trampolino, impatto al 6° fotogramma; immagine sgranata, teste in primo piano | riserva |
| 5 | Mountain Biker Crashes on Dirt Turn | perdita di controllo improvvisa: esplosione di volatilità | biker cade in curva nella polvere al 4°-5° fotogramma; soggetto piccolo all'inizio, corda in primo piano | riserva |
| 5 | Person Falls Backward on Splash Pad Board | scivolata e caduta sul supporto | scivola sullo skimboard e cade all'indietro al 6° fotogramma; notte, leggermente sgranato | riserva |
| 5 | Plane Crash | crollo in arrivo verso il supporto | aereo scende verso l'anziano che guarda, impatto imminente all'ultimo fotogramma; tema disastro aereo delicato | riserva |
| 5 | Sandy Neck | falsa rottura: sale e ricade | salto mortale dal muretto, atterra di schiena/collo nella sabbia; rischio caduta che sembra infortunio | riserva |
| 5 | Singer Rises Through a Stage Trapdoor | ripartenza dal minimo | cantante sale dalla botola del palco; salita lenta, buio da concerto | riserva |
| 5 | Sun Launch | accelerazione improvvisa al rialzo | pallone luminoso di notte colpito in alto, ultimo fotogramma diventa sole al tramonto; poco leggibile | riserva |
| 5 | Surf Slam | rottura del supporto e caduta | scivolata nel fango giù per la collina e tuffo di pancia, soggetto piccolo fino al 6° fotogramma | riserva |
| 5 | Tiny Animal | falsa rottura: sale e ricade | piccolo petauro si arrampica sulla porta e si lancia nel vuoto verso la mano, salto all'ultimo fotogramma | riserva |
| 5 | Trench Wall Crumbles Into Deep Hole | il supporto cede: crollo nel vuoto | parete di terra che frana nella buca, primo piano; metafora del pavimento che cede, poco spettacolare | riserva |
| 5 | Young Man Stumbles While Sprinting | falsa rottura: parte e crolla | scatta e cade a faccia avanti sull'asfalto al 5° fotogramma; scritta piccola sulla maglia | riserva |

## Cosa ci dice lo studio
- Gli hook forti sono quasi tutti **cadute** (caduta / rottura del supporto 20, rimbalzo / stop contro un muro 2): perfetti per rotture di supporto, short gamma, falsi breakout. Per questi eventi abbiamo materiale per molte settimane.
- Mancano hook forti per **rialzi**, **rimbalzi su un muro** e **prezzo bloccato (pin)**. Per i video su call wall, rally fermati e range servono clip nuovi: qualcosa che sale e si ferma contro un tetto, un oggetto che rimbalza su una superficie, qualcosa in equilibrio perfetto che non si muove. Conviene cercarli e caricarli in `00_CARICA_QUI/01_VIDEO_HOOK`.
- Circa tre clip su quattro non sono usabili, soprattutto per violenza o incidenti e per marchi o scritte: quando si cercano hook nuovi conviene scartarli già alla fonte.
- I clip con watermark di pagine (es. @skill_unbelievable) vanno sempre esclusi, anche se il movimento è perfetto.

## Uso
`studio.py brief` mostra come "freschi" solo gli approvati mai usati; le riserve si guardano qui. Prima di usare un clip si controllano i fotogrammi del tratto scelto (marchi piccoli, scritte sul fondo) e si segna "usato <ID>" nel catalogo.
