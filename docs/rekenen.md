# Ontwerp: rekenen in het eerste leerjaar

Naast het lezen krijgt het eerste leerjaar een tweede onderwerp: **rekenen**
🔢, met getalbeelden en splitsen. De inhoud volgt hoe de klas het leert, met
**Wiskanjers**: getalbeelden op een **tienveld van 2 × 5**, en splitsen met
het **splitshuis** (zoals op de kaartjes van Tientje Tel), waarin telkens één
getal ingevuld moet worden.

De ladders zelf vragen weinig nieuw werk: het model met onderwerpen bestaat al
(zie `docs/leerjaren.md`). Omdat het eerste leerjaar nu twee onderwerpen
heeft, verschijnt het keuzescherm "wat ga je oefenen?" vanzelf. De
beloningen veranderen wel (zie `docs/avatars.md`).

Status: gebouwd (eerste versie).

## Eén ladder, een level per getal

Getalbeelden en splitsen zitten samen in **één ladder**, en niet in twee
aparte:

- De klas splitst de getallen systematisch, van klein naar groot: eerst 2,
  dan 3, dan 4… Dat is net hoe het lezen een klank per kern brengt.
- Het antwoord is altijd een getal, dus de app kijkt alles zelf na, zoals bij
  de maaltafels.

Een oefening is altijd **óf een getalbeeld óf een splitshuis**, nooit de twee
samen (dus geen tienveld onder een splitshuis). In één reeks komen ze wel
allebei voor, tot hetzelfde grootste getal.

## Soorten oefeningen

### Splitshuis

Zoals op de kaartjes in de klas:

```
        ┌───┐
        │ 7 │          het dak: een smalle toren met het getal
    ┌───┼───┼───┐
    │ 2 │ 🙂│ ? │      links en rechts een kamer, in het midden het figuurtje
    └───┴───┴───┘
```

- Het dak is altijd ingevuld. Van de twee kamers is er één ingevuld en één
  leeg: dat getal tikt het kind in. De lege kamer staat soms links en soms
  rechts.
- **0 hoort erbij:** `7 = 0 + 7` en `7 = 7 + 0` zijn gewone splitsingen.
- **In de middelste kamer staat de avatar van het kind** (het portret, zoals
  op de levelkaart). Het figuurtje uit de klas, Tientje Tel, nemen we niet
  over: dat is een figuur van de methode, en zoals bij de vogels tekenen we
  niets na. De eigen avatar past er net zo goed, en het kind ziet zo zijn pop,
  held of vogel ook tijdens het rekenen.

### Getalbeeld

Zoals op de kaartjes in de klas:

```
 1  ■□ □□ □     4  ■■ □□ □     5  ■■ ■□ □     7  ■■ ■■ □     10  ■■ ■■ ■
    □□ □□ □        ■■ □□ □        ■■ □□ □        ■■ ■□ □         ■■ ■■ ■
```

- Een tienveld van 2 × 5 met **vierkantjes**. De kolommen staan in groepjes
  van 2, 2 en 1.
- Het wordt **kolom per kolom** gevuld: eerst boven, dan onder. Bij 3 is de
  eerste kolom vol en staat er één vierkantje bovenaan de tweede.
- Het tienveld ligt of staat, willekeurig per getalbeeld. Staand is het 5
  rijen van 2, rij per rij gevuld (eerst links, dan rechts).
- Vanaf 11 zijn er twee tienvelden: het eerste is vol, het tweede toont de
  rest. Liggend staan ze onder elkaar, staand naast elkaar.
- Het kind tikt hoeveel vierkantjes er zwart zijn.

### Even tonen

In de tweede helft van een level blijft een getalbeeld **2 seconden**
staan en verdwijnt dan: het kind moet het beeld herkennen, niet tellen.

- Fout geantwoord: het beeld komt terug en blijft staan.
- Een splitshuis wordt nooit verborgen.
- Er is geen klok: antwoorden mag zo traag als het kind wil.

### Antwoorden en nakijken

Zoals bij de maaltafels (`Rekenen.tsx`):

- **juist:** het maatje is blij, en de volgende oefening komt;
- **fout:** het maatje schrikt even, en het kind mag nog eens proberen;
- **twee keer fout:** de app toont het juiste antwoord, en de oefening komt
  achteraan de reeks terug.

Het klavier is eenvoudiger dan bij de maaltafels:

- **tot 10:** één rij grote knoppen 0 tot 10. Eén tik is het antwoord, er is
  geen ✓-knop;
- **tot 20:** het gewone cijferklavier, met hoogstens twee cijfers.

De vraag staat vooral in beeld, niet in tekst: het kind leest nog niet vlot.

## Opbouw

### Levels

| Level | Tegel | Reeksen | Wat erin zit |
|---|---|---|---|
| 1 | `2` | 2 | splitsen van 2, getalbeelden 1 en 2 |
| 2 | `3` | 2 | splitsen van 3, getalbeeld 3 |
| 3 | `4` | 3 | splitsen van 4, getalbeeld 4 |
| 4–9 | `5` … `10` | 4 elk | splitsen van dat getal, zijn getalbeeld |
| 10 | `≤10` | 4 | alles tot 10 door elkaar |
| 11 | `11–15` | 4 | getalbeelden met twee tienvelden, splitsen in 10 en de rest |
| 12 | `16–20` | 4 | idem tot 20 |

Samen 43 reeksen. De kleine getallen krijgen minder reeksen: 2 heeft maar
drie splitsingen, daar valt niet veel langer op te oefenen.

### Een reeks van 15

- **Eerst het nieuwe getal:** de eerste 8 oefeningen zijn splitsingen van het
  nieuwe getal (bij 2 zijn dat er 6, zie verder).
  - In de eerste reeks van een level staan ze in de volgorde van de kaartjes
    in de klas: `0 | 7`, `1 | 6`, `2 | 5`, `3 | 4`, … telkens met een andere
    kamer leeg. Bij 8, 9 en 10 komen zo alle splitsingen in de eerste reeks:
    9 tot 11 in plaats van 8.
  - In de volgende reeksen staan ze door elkaar.
- **Dan herhaling:** de rest zijn variaties op alle getallen tot nu toe, het
  nieuwe inbegrepen: om beurt een getalbeeld en een splitsing. Zo verdwijnen
  de getalbeelden niet tussen de vele splitsingen.

Binnen een level:

- **eerste helft** (reeks 1 en 2, bij 2 en 3 enkel reeks 1, bij 4 reeks 1 en
  2): de getalbeelden blijven staan;
- **tweede helft:** de getalbeelden worden even getoond.

In levels 10 tot 12 is er geen "nieuw getal" in de klassieke zin: level 10
mengt alles tot 10, levels 11 en 12 beginnen met de nieuwe getallen boven de
tien (eerst hun getalbeelden, dan `14 = 10 + 4`).

### Kleine getallen

Bij 2 zijn er te weinig verschillende oefeningen voor 15 zonder herhaling
(zes splitsingen: drie, telkens met links of rechts leeg, en de getalbeelden
1 en 2). Daar komen oefeningen dus twee keer in een reeks voor. Vanaf 3 zijn
alle 15 oefeningen van een reeks verschillend.

### Gegenereerd, maar vast

Zoals bij de maaltafels: de oefeningen komen uit code met een vaste
willekeur (seed), dus een reeks-id blijft altijd dezelfde oefeningen
betekenen. Reeks-ids beginnen met `reken-`.

Een test bewaakt dat:

- elk antwoord klopt;
- vanaf het getal 3 elke reeks 15 verschillende oefeningen heeft
  (`7 = 3 + ?` en `7 = ? + 3` tellen als verschillend);
- de eerste 8 oefeningen splitsingen van het nieuwe getal zijn (levels 1 tot
  9), en de eerste reeks van 7 de volgorde van de kaartjes volgt;
- een level enkel getallen gebruikt die al aan bod kwamen;
- elke splitsing van het nieuwe getal, met 0 erbij, in zijn level voorkomt;
- het dak nooit leeg is, en precies één kamer leeg is;
- boven de tien enkel in 10 en de rest gesplitst wordt;
- getalbeelden enkel in de tweede helft van een level even getoond worden;
- het tienveld ongeveer even vaak ligt als staat;
- elke reeks minstens twee getalbeelden heeft;
- de ids uniek zijn over alle onderwerpen heen.

## Technische schets

- `src/data/rekenen.ts` genereert de levels, `onderwerpen.ts` krijgt een
  onderwerp `rekenen` 🔢 voor leerjaar 1, met soort `som`.
- `src/data/sommen.ts` heeft de vormen van een som en de vaste willekeur,
  samen met de maaltafels.
- `Som` krijgt een vorm; de maaltafels worden `tekst`:

  ```ts
  type Som =
    | { vorm: "tekst"; vraag: string; antwoord: number }
    | { vorm: "getalbeeld"; aantal: number; staand: boolean; evenTonen: boolean; antwoord: number }
    | { vorm: "splitshuis"; dak: number; links: number | null; rechts: number | null; antwoord: number };
  ```

- `Rekenen.tsx` tekent de vraag volgens de vorm (`Tienveld` en `Splitshuis`
  in `Splitshuis.tsx`, met het portret van de avatar in het midden) en kiest
  het klavier volgens het grootste antwoord van de reeks. Bij een splitshuis
  staat het maatje niet apart: het woont in de middelste kamer.
- Het spelmodel verandert niet voor rekenen: `klaar` krijgt gewoon
  `reken-…`-ids erbij. De beloningen volgen `docs/avatars.md`, dat best eerst
  gebouwd wordt.
