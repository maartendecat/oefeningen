# Ontwerp: leerjaren, onderwerpen en maaltafels

Tot nu toe had de app één soort oefening: woordjes en zinnetjes lezen voor
het eerste leerjaar. Een oudere broer (derde leerjaar) wil maaltafels
oefenen. Later komen er nog onderwerpen bij, zoals spelling in het derde
leerjaar of rekenen in het eerste. Dit ontwerp trekt de oefeningen daarom
uit elkaar per leerjaar en per onderwerp, zonder dat de rest van de app
(avatar, beloningen, landschap of kast) verandert.

Status: gebouwd (eerste versie).

## Drie lagen

```
profiel ── leerjaar (1–6)
            └─ onderwerpen voor dat leerjaar   (lezen, maaltafels, later spelling…)
                 └─ levels                      (een letter, een tafel…)
                      └─ reeksen van 15 oefeningen → beloning
```

### Leerjaar

- Elk profiel heeft een leerjaar.
- **De ouder stelt het in** bij het maken van het profiel, en kan het wijzigen
  in het oudermenu.
- **Anders kiest het kind** het zelf: na de avatar en de naam komt een scherm
  "in welk leerjaar zit je?" met grote cijfers. Dat verschijnt alleen als het
  leerjaar nog niet ingesteld is.
- Alleen leerjaren met inhoud worden getoond (voorlopig 1 en 3).
- Bestaande profielen komen via een migratie in het eerste leerjaar.

### Onderwerp

- Een onderwerp heeft een naam, een icoon, de leerjaren waarvoor het geldt,
  een soort oefening (zie verder) en zijn eigen levels met reeksen.
- Voorlopig zijn er twee onderwerpen:
  - **lezen** 📖 voor het 1e leerjaar: de huidige inhoud;
  - **maaltafels** ✖️ voor het 3e leerjaar.
- **Een kind ziet alleen de onderwerpen van zijn eigen leerjaar.**
- Met één onderwerp gaat de app meteen naar de levelkaart, zoals nu. Vanaf
  twee onderwerpen kiest het kind eerst met grote tegels, en heeft elk
  onderwerp zijn eigen kaart.

### Voortgang en beloningen

- De voortgang blijft één lijst van gedane reeksen. Reeks-ids zijn uniek over
  alle onderwerpen heen (een test bewaakt dat): de leesreeksen houden hun ids
  (`ikms-1`…), de maaltafels krijgen `tafel-…`. De bestaande voortgang hoeft
  dus niet omgezet te worden.
- **Eén verzameling beloningen per profiel.** Het thema dat het kind koos
  (vogels of kleren) geldt voor alle onderwerpen: elke gedane reeks levert
  iets op voor dezelfde kast of hetzelfde landschap.
- Elk onderwerp telt ongeveer evenveel reeksen als er beloningen zijn (44
  reeksen, 50 vogels). Doet één kind ooit meerdere onderwerpen, dan zijn er
  meer beloningen nodig (zie "Later").

## Soorten oefeningen

Het onderwerp bepaalt hoe het kind antwoordt. Elke soort heeft een eigen
scherm, maar het frame is voor iedereen hetzelfde: voortgangsbolletjes, het
maatje, stoppen, en daarna het beloningsscherm.

| Soort | Hoe | Wie kijkt na |
|---|---|---|
| **voorlezen** (lezen) | tekst op een kaart, het kind leest luidop | een ouder tikt ✓ of ↻ |
| **som** (maaltafels) | `6 × 7 = ?`, het kind tikt het antwoord op een groot cijferklavier | de app zelf |

Een som werkt zo:

- **juist:** het maatje is blij, en de volgende som komt;
- **fout:** het maatje schrikt even, en hij mag het nog eens proberen;
- **twee keer fout:** de app toont het juiste antwoord, en die som komt
  achteraan de reeks nog eens terug. Een reeks is pas klaar als elke som een
  keer juist beantwoord is.
- **Geen klok** en geen snelheid: rustig oefenen.

Een nieuwe soort later, zoals spelling (een woord horen en intypen), is een
nieuw scherm. De rest blijft ongemoeid.

## Maaltafels

Het is **herhaling**: in het derde leerjaar kennen de kinderen alle tafels al
uit het tweede. Daarom mengt elke reeks de tafels, en wordt het snel
moeilijker. Op het einde bouwt het verder met rekenwerk dat op de tafels
steunt. Antwoorden blijven onder de 1000 (getallen tot 1000 in het derde
leerjaar).

### Opbouw: 11 levels van 4 reeksen, elk 15 sommen

Samen 44 reeksen en 660 sommen, net als bij het lezen. De tegel op de kaart
toont waar het level over gaat.

| Level | Tegel | Wat erin zit |
|---|---|---|
| 1 | `2 3 4 5` | de lagere tafels (2, 3, 4, 5, 10), maal en gedeeld door |
| 2 | `6 7 8 9` | de moeilijke tafels; reeks 8 gaat voor het eerst boven de tien (× 11) |
| 3 | `11 12` | de tafels van 11 en 12, tot 12 × 12 |
| 4 | `40×7` | tientallen maal een getal, en de delingen erbij |
| 5 | `15×4` | 13 tot 19 maal een getal |
| 6 | `23×4` | 21 tot 49 maal een getal |
| 7 | `96:8` | grotere delingen: de uitkomst is een getal tot 29 |
| 8 | `300×3` | honderdtallen, en 150 × 4 |
| 9 | `20×30` | tientallen maal tientallen, en 120 × 5 |
| 10 | `mix` | alles door elkaar, met 51 tot 99 maal een getal |
| 11 | `top` | het moeilijkste: tot 99 × 9, en 181 × 4 |

- Reeksen 1 tot 7 blijven binnen de tafels (getallen tot 10). Vanaf reeks 8
  gaat het boven de tien.
- Binnen een level:
  - reeks 1 is vooral het nieuwe, met een beetje herhaling;
  - vanaf reeks 2 komen de delingen erbij;
  - reeks 3 en 4 nemen de moeilijke versie van het nieuwe;
  - elke reeks herhaalt ook wat de vorige levels brachten.
- Binnen een reeks lopen de sommen op van makkelijk naar moeilijk, en een
  reeks begint altijd met een maalsom.
- Delen gebeurt altijd door een eenvoudig getal: tot 12, een tiental of een
  honderdtal (`216 : 6`, nooit `216 : 36`).

### Gegenereerd, maar vast

- De sommen worden in code gegenereerd uit de regels hierboven, met een vaste
  willekeur (seed). Dezelfde reeks is dus altijd dezelfde, en een reeks-id
  blijft altijd dezelfde sommen betekenen.
- Een test bewaakt dat:
  - elke som klopt en onder de 1000 blijft;
  - elke reeks 15 verschillende sommen heeft (`20 × 30` en `30 × 20` tellen
    als dezelfde);
  - reeksen 1 tot 7 binnen de tafels blijven en reeks 8 erboven gaat;
  - elke tafel van 2 tot 10 als maal- en als deeltafel voorkomt;
  - er alleen door eenvoudige getallen gedeeld wordt.

## Technische schets

- `src/data/onderwerpen.ts`: de lijst onderwerpen, met naam, icoon,
  leerjaren, soort en levels.
- `src/data/levels.ts` blijft het lezen. `src/data/maaltafels.ts` genereert
  de maaltafelreeksen.
- `Reeks.oefeningen` wordt een lijst van oefeningen per soort: tekst voor
  voorlezen, `{ vraag, antwoord }` voor een som.
- `Spel` krijgt `leerjaar` (VERSIE 3, migratie naar leerjaar 1 voor bestaande
  profielen).
- Schermen:
  - `Kaart` toont de levels van het gekozen onderwerp;
  - `Lezen` blijft voor voorlezen, `Rekenen` komt erbij voor sommen;
  - er is een scherm om het leerjaar te kiezen;
  - er komt pas een keuzescherm voor onderwerpen als er meer dan één is.
- Het oudermenu:
  - leerjaar instellen per profiel;
  - "start bij level" werkt per onderwerp.

## Later

- Meer onderwerpen: spelling (3e leerjaar), rekenen tot 20 (1e leerjaar), …
- Meer beloningen als een kind meerdere onderwerpen doet: extra vogels en
  kleren, of eitjes en nesten in het landschap.
- Een snelheidsspel voor de maaltafels.
