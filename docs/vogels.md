# Ontwerp: vogelthema

Een tweede thema naast de kleren, voor een oudere broer die liever vogels
heeft dan een aankleedpop. De sfeer en de ideeën komen uit het bordspel
*Wingspan* (vogelkaarten, leefgebieden, verzamelen), maar de tekeningen en de
vormgeving zijn van ons: eigen SVG's, geen namaak van de prenten van het spel.

Status: gebouwd (eerste versie). De vogellijst is goedgekeurd.

## Eerste verandering

Een tweede thema naast de kleren: vogels. De leesoefeningen blijven precies
dezelfde (`src/data/levels.ts`). Alleen de avatar, de beloning, de kast en het
uitzicht van de app veranderen. Leesinhoud voor een ouder kind komt later,
apart.

## Thema kiezen en wisselen

- **Het kind kiest het thema zelf**, bij "kies je avatar". Dat scherm heeft
  twee stappen:
  1. twee grote knoppen: pop met kleren of vogel;
  2. daarna de 3 poppen of de 5 startvogels, en dan zoals nu de naamstap.
- Het thema volgt uit de gekozen avatar. Het profiel van je dochter blijft dus
  vanzelf kleren.
- **Wisselen kan altijd**, via 🔄 "andere avatar", ook naar het andere thema.
  **Beide verzamelingen blijven bewaard**, apart: kleren in de kast, vogels in
  het landschap. Wie terugwisselt, vindt alles terug.
- Een beloning gaat altijd naar het thema van de avatar op dat moment.
- Het oudermenu volgt het actieve thema. Een startletter kiezen geeft
  beloningen in het actieve thema. "Opnieuw beginnen" wist beide
  verzamelingen.
- De avatarvogel krijgt een eigen naam, zoals nu de pop.

## Uitzicht

- Bij een vogelavatar krijgt **de hele app natuurkleuren**: groen, lucht- en
  waterblauw, oker, in plaats van de roze achtergrond en roze confetti.
  Knoppen, vormen en schermen blijven dezelfde. Een kleurtoken per thema
  volstaat.
- In plaats van confetti vliegen er veertjes.
- De teller op de kaart wordt 🐦 *n* / 50 in plaats van 👗.
- "Wie gaat er lezen?" toont per profiel het eigen portret: pop of vogel.
- **Geluid**: nagemaakt getjilp en gefluit met Web Audio, zoals de huidige
  geluidjes. Geen audiobestanden. Een paar varianten, zodat niet elke vogel
  hetzelfde klinkt.

## Avatar: een van de vijf startvogels

- De vijf startvogels zijn **kea, amerikaanse zeearend, amerikaanse oehoe,
  papegaaiduiker en ijsvogel**.
- De avatar leest mee: op de kaart, als portret op het leesscherm, op het
  beloningsscherm en in het landschap.
- Hij reageert met dezelfde stemmingen als de pop, vertaald naar een vogel:

  | Stemming | Vogel |
  |---|---|
  | rust | zit, knippert af en toe |
  | blij | wipt op en neer |
  | juich | vleugels open, fladdert |
  | zwaar | veren opgezet, kopje scheef |
  | verrast | kuif of veren omhoog, grote ogen |
  | draai | draait rond op de tak |

- De avatar zelf verandert niet: geen extra's of accessoires. Alles wat hij
  wint, gaat naar het landschap.

## Beloning: vogelkaarten

- Na elke reeks liggen er **drie open kaarten** klaar: de vogel, de naam en
  een icoontje van het leefgebied. Hij kiest er één. Het mechanisme blijft
  hetzelfde als `kiesVerrassingen` nu (bij voorkeur uit verschillende
  leefgebieden).
- Er zijn 50 vogels om te winnen, ongeveer evenveel als de 55 reeksen. Alle 50
  zitten in de eerste versie.
- De vijf startvogels zijn ook te winnen, ook zijn eigen avatarsoort. De
  verzameling staat los van de avatar.

## Landschap in plaats van de kast

- **Eén breed panorama dat van links naar rechts scrolt**: bos, dan veld,
  dan water, met de lucht erboven. Zo leest het als een spelersbord.
- Elke vogel heeft een vaste plek die bij hem past: tak, boomholte, grond,
  lucht, riet, water, rots. Een vogel die hij nog niet heeft, is een grijs
  silhouet.
- De **avatarvogel zit vast linksonder op een tak**, voor het landschap. Tik
  erop en hij reageert, zoals de pop nu in de kast. Als hij een nieuwe vogel
  wint, kijkt de avatar verrast.
- Bij het openen scrolt het landschap naar de laatst gewonnen vogel.
- **Tik op een vogel**: hij beweegt en tjilpt, en er klapt een kaartje open
  met de naam en één kort weetje om te lezen (kleine letters, zoals de rest
  van de app).

## Tekeningen

- Eigen SVG's in code, zoals de kleren nu.
- **Stijl: stoer-gestileerd.** Vlakke kleuren, duidelijke vormen, een echt
  herkenbare soort en net genoeg karakter in de ogen voor de stemmingen. Eerder
  een mooie natuurgids in cartoonstijl dan schattig.
- Een paar gedeelde basisvormen (zangvogel, specht, roofvogel, uil,
  papegaai, steltloper, eend of zwaan, loopvogel, zeevogel), met per soort een
  eigen snavel, kuif, staart, kleuren en tekening. Waar een soort dat nodig
  heeft, krijgt hij een eigen vorm. Herkenbaarheid gaat voor hergebruik.
- De vijf startvogels hebben de stemmingen hierboven nodig. De verzamelvogels
  hebben alleen een rustpose en één reactie op een tik nodig.

## Vogellijst (voorstel, na te kijken)

Herkomst: **W** = basisdoos van *Wingspan*, **O** = Oceanië (uitbreiding),
**H** = van hier. ★ = ook startvogel.

### Bos (17)

| Vogel | Herk. | Weetje |
|---|---|---|
| kea ★ | O | een slimme papegaai uit de bergen. hij speelt in de sneeuw. |
| amerikaanse oehoe ★ | W | jaagt 's nachts en ziet heel goed in het donker. |
| helmspecht | W | hakt grote gaten in bomen om mieren te vangen. |
| roodkardinaal | W | het mannetje is helemaal rood, met een zwart masker. |
| blauwe gaai | W | verstopt eikels en vindt ze later terug. |
| zwartvleugeltangare | W | knalrood, met zwarte vleugels. |
| robijnkeelkolibrie | W | kan stil blijven hangen en zelfs achteruit vliegen. |
| kerkuil | W | hoort een muisje lopen, zelfs in het pikdonker. |
| wilde kalkoen | W | slaapt 's nachts hoog in een boom. |
| kookaburra | O | lacht zo luid dat je hem van ver hoort. |
| kiwi | O | kan niet vliegen en zoekt wormen met de neus aan de punt van zijn snavel. |
| regenbooglori | O | heeft alle kleuren van de regenboog. |
| liervogel | O | doet elk geluid na, zelfs een fototoestel. |
| grote bonte specht | H | roffelt op een boom om te laten horen: hier woon ik. |
| roodborst | H | zingt ook in de winter. |
| vlaamse gaai | H | doet het geluid van andere vogels na. |
| boomklever | H | loopt met zijn kop naar beneden langs een boom. |

### Veld (15)

| Vogel | Herk. | Weetje |
|---|---|---|
| slechtvalk | W | de snelste vogel van de wereld als hij naar beneden duikt. |
| roodstaartbuizerd | W | cirkelt hoog boven de velden en zoekt muizen. |
| holenuil | W | woont in een hol onder de grond. |
| renkoekoek | W | rent liever dan dat hij vliegt. |
| californische condor | W | een van de grootste vogels die kunnen vliegen. |
| purpergors | W | is blauw, rood en groen tegelijk. |
| emoe | O | kan niet vliegen, maar rent heel snel. |
| roze kaketoe | O | roze en grijs, en hangt graag ondersteboven. |
| boerenzwaluw | H | vliegt elke winter helemaal naar afrika. |
| torenvalk | H | hangt stil in de lucht boven het gras. |
| ekster | H | bouwt een nest met een dak erop. |
| merel | H | trekt wormen uit het gras. |
| koolmees | H | eet in de winter graag uit een vetbol. |
| pimpelmees | H | heeft een blauw petje. |
| huismus | H | neemt graag een bad in het zand. |

### Water (18)

| Vogel | Herk. | Weetje |
|---|---|---|
| amerikaanse zeearend ★ | W | grijpt vissen uit het water met zijn sterke klauwen. |
| papegaaiduiker ★ | W | draagt wel tien visjes tegelijk in zijn snavel. |
| ijsvogel ★ | H | duikt kopje-onder om visjes te vangen. |
| rode lepelaar | W | is roze door wat hij eet. |
| amerikaanse witte pelikaan | W | schept vissen op met de zak onder zijn snavel. |
| ijsduiker | W | duikt heel diep en roept 's nachts heel luid. |
| trompetzwaan | W | roept als een trompet. |
| trompetkraanvogel | W | danst en springt om een vrouwtje te lokken. |
| visarend | W | duikt met zijn poten eerst in het water. |
| amerikaanse kleine zilverreiger | W | is sneeuwwit en heeft gele voeten. |
| wilde eend | W | het mannetje heeft een glanzend groen hoofd. |
| carolina-eend | W | de kuikens springen uit een hoge boom naar beneden. |
| canadese gans | W | vliegt met de anderen in de vorm van een v. |
| zwarte zwaan | O | helemaal zwart, met een rode snavel. |
| dwergpinguïn | O | de kleinste pinguïn van de wereld. |
| blauwe reiger | H | staat heel stil tot er een vis voorbijzwemt. |
| fuut | H | draagt zijn jongen op zijn rug. |
| ooievaar | H | klappert met zijn snavel. |

Samen 50. De ijsvogel is de gewone ijsvogel van hier, niet de Amerikaanse
uit de basisdoos. De weetjes zijn kort gehouden om te lezen.
Kijk vooral na of er een lievelingsvogel ontbreekt.

## Hoe het gebouwd is

- `Spel` heeft een aparte lijst `vogels` naast `kast`. Het thema volgt uit
  `avatar` (`themaVan`): een startvogel betekent vogels, al de rest kleren.
  `VERSIE` ging naar 2, met een migratie die een lege vogellijst toevoegt,
  zodat een oude versie van de app de vogels niet per ongeluk kan wissen.
- `src/avatar/vogelvormen.ts`: de lichaamsvormen (zangvogel, specht,
  roofvogel, uil, steltloper, zwemvogel, rechtop, en eigen vormen voor
  kolibrie, pelikaan, emoe, kiwi, kalkoen en renkoekoek).
- `src/avatar/vogels.tsx`: de 50 soorten met kleuren, tekening en weetje.
- `src/avatar/Vogel.tsx`: tekent een vogel, met stemmingen, als silhouet of
  als portret.
- `src/avatar/decor.tsx` en `src/components/Landschap.tsx`: het panorama en
  de plek van elke vogel.
- `src/avatar/Avatar.tsx`: pop of vogel, voor alle schermen.
- Kleuren per thema als CSS-tokens onder `:root[data-thema="vogels"]`; `App`
  zet dat attribuut.

## Later, niet in de eerste versie

- Doelen per leefgebied, zoals de rondedoelen in *Wingspan*. Bijvoorbeeld:
  vijf watervogels leveren een vijver met waterlelies op in het landschap.
- Eitjes of nesten als tweede, kleinere beloning.
- Leesinhoud voor een kind dat twee jaar verder staat (de tweede vraag).
