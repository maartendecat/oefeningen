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

### Opbouw: 11 levels van 4 reeksen, elk 15 sommen

Samen 44 reeksen en 660 sommen, net als bij het lezen. Elk level brengt één
nieuwe tafel, die in de tegel op de kaart staat (`× 3`). De reeksen mengen
die nieuwe tafel met de tafels die al gekend zijn. De moeilijkheid stijgt
per reeks.

| Level | Nieuw | Wat erin zit |
|---|---|---|
| 1 | × 1 en × 10 | de makkelijkste tafels, en ook ×0 |
| 2 | × 2 | |
| 3 | × 5 | |
| 4 | × 4 | het dubbele van × 2 |
| 5 | × 3 | |
| 6 | × 6 | het dubbele van × 3 |
| 7 | × 9 | |
| 8 | × 8 | het dubbele van × 4 |
| 9 | × 7 | de moeilijkste |
| 10 | alles gemengd | vooral de moeilijke sommen (6 tot 9) |
| 11 | boven 100 | × 11 en × 12, tientallen (`30 × 4`, `20 × 7`), en ook `12 × 9` |

### Binnen een level

1. **Reeks 1:** vooral de nieuwe tafel, met een paar sommen uit vroegere
   tafels.
2. **Reeks 2:** de nieuwe tafel als deeltafel erbij (`21 : 3`), zodat
   maaltafel en deeltafel samen geleerd worden.
3. **Reeks 3:** maal en gedeeld door, gemengd met de vroegere tafels.
4. **Reeks 4:** de moeilijkste van de nieuwe tafel en een herhaling van
   alles tot dan toe.

Binnen een reeks lopen de sommen ook op: eerst de makkelijke (× 1, × 2, × 10),
naar het einde de moeilijke.

### Gegenereerd, maar vast

- De sommen worden in code gegenereerd uit de regels hierboven, met een vaste
  willekeur (seed). Dezelfde reeks is dus altijd dezelfde, en een reeks-id
  blijft altijd dezelfde sommen betekenen.
- Een test bewaakt dat:
  - elke som klopt;
  - elke reeks 15 sommen heeft;
  - er binnen een reeks geen dubbele sommen zijn;
  - een reeks alleen tafels gebruikt die al aan bod kwamen;
  - elke tafel ergens als maal- en als deeltafel voorkomt.

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
