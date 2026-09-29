# Ontwerp: superheldenthema

Een derde thema naast de kleren en de vogels. Het werkt zoals de pop: een
avatar om aan te kleden, alleen is het hier een superheld die je uitrust. De
helden en hun spullen zijn zelf bedacht en getekend. Er zit niets van
bestaande strips of films in.

Status: gebouwd (eerste versie).

## De vijf helden

Vijf kinderen in een stoere heldenpose, elk met een eigen kracht. De kracht
zie je als ze juichen: dan vliegt die rond de held.

| id | Kracht | Uiterlijk |
|---|---|---|
| bliksem | supersnel (bliksems) | lichte huid, blond stekelhaar, blauwe ogen |
| vlam | vuur (vlammetjes) | sproetjes, rood krulhaar |
| ijs | bevriezen (ijskristallen) | donkere huid, kort zwart haar met een witte lok |
| wervel | vliegen (windwervels) | getinte huid, lang zwart haar in een staart |
| komeet | sterrenkracht (sterretjes) | zwarte huid, afro-knotjes |

Het kind geeft de held zelf een naam, zoals bij de pop.

## Uitrusting: 8 categorieën, 52 items

Een pak, laarzen en handschoenen heeft een held altijd aan (daarvan is er een
startversie). Capes, maskers, emblemen, helmen en gadgets mogen ook uit.

| Categorie | Items |
|---|---|
| 🦸 pakken | *blauw heldenpak (start)*, flitspak, ninjapak, drakenpak, robotpak, sterrenpak, vuurpak |
| 🧣 capes | korte rode cape, lange zwarte cape, sterrencape, gouden cape, strijderscape, vleugelcape |
| 🎭 maskers | rood oogmasker, zwart kattenmasker, vizierbril, ninjamasker, robotvizier, vlindermasker |
| ⭐ emblemen | bliksem, ster, vlam, schild, hart, letter van je naam |
| ⛑️ helmen | vleugelhelm, ridderhelm, antennes, ninja-hoofdband, kroontje, astronautenhelm |
| 🥾 laarzen | *blauwe laarzen (start)*, rode laarzen, raketlaarzen, gouden laarzen, ninjasloffen, robotvoeten, veerlaarzen |
| 🧤 handschoenen | *blauwe handschoenen (start)*, bokshandschoenen, gouden armbanden, klauwhandschoenen, ijshandschoenen, robotarmen, vuurhandschoenen |
| 🛡️ gadgets | schild, magische hamer, gouden lasso, toverstaf, zaklamp, heldenhond, robotje |

Dat zijn 49 spullen om te winnen: genoeg voor elke reeks van elk onderwerp.
Het letterembleem toont de eerste letter van de naam van de held.

## Tekenstijl

Stripstijl: dikke, bijna zwarte contouren, vlakke kleuren en één harde
schaduwkant rechts, zonder zachte verlopen. Alle helden staan in dezelfde
pose, in hetzelfde assenstelsel als de pop (200 × 400, voeten op y 372). Zo
passen alle spullen op elke held, en werken de animaties van de pop ook voor
de helden. De maten van de pose staan in `src/avatar/heldvormen.tsx`.

Een cape heeft twee delen: de lap achter het lijf (`achter`) en het stukje
over de schouders met de gesp (`teken`).

## Uitzicht en gedrag

- **Kiezen**: een derde rij bij "kies je avatar". Wisselen kan altijd. Kleren,
  vogels en heldenspullen blijven elk apart bewaard (`kast`, `vogels`,
  `uitrusting`), net als wat de pop en de held aanhebben (`aan`, `heldAan`).
- **Kleuren**: stripkleuren (heldenrood, blauw, geel) en een achtergrond met
  rasterpuntjes, zoals in een gedrukte strip.
- **Hoofdkwartier**: in plaats van de kast. De held staat voor een stad bij
  zonsondergang. De teller op de kaart wordt 🦸 *n* / 49.
- **Beloning**: sterretjes en bliksems in plaats van confetti, "pow!" in plaats
  van "joepie!", en een zoevend geluidje met een heldendeuntje (Web Audio).
- **Stemmingen**: dezelfde als bij de pop. Bij het juichen vliegt de eigen
  kracht rond, en de cape wappert harder als de held springt.
- **Oudermenu**: "voortgang zetten" geeft heldenspullen als de avatar een held
  is. "Opnieuw beginnen" wist ook de heldenspullen.
