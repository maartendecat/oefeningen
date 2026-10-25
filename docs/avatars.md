# Ontwerp: meerdere avatars verzamelen

Elk thema heeft ongeveer 50 beloningen (48 kleren, 51 vogels, 50
heldenspullen), en het lezen alleen telt al 44 reeksen. Komt er een tweede
onderwerp bij in hetzelfde leerjaar, zoals rekenen in het eerste (zie
`docs/rekenen.md`), dan is de verzameling halverwege leeg.

Daarom hoort de verzameling voortaan **bij de avatar**, niet bij het thema.
Is een avatar goed gevuld, dan begint het kind aan een nieuwe: een ander
meisje, een held of een vogel. Ladders en beloningen staan zo helemaal los
van elkaar: elke reeks, van welk onderwerp ook, vult de avatar waarmee het
kind op dat moment speelt.

Status: gebouwd (eerste versie).

## Een verzameling per avatar

- Elke avatar die het kind begon, heeft **zijn eigen gewonnen spullen en zijn
  eigen outfit**. Lotte en Noor hebben dus elk een eigen kast; een tweede
  vogel heeft zijn eigen landschap.
- Binnen een thema verzamelen de avatars **dezelfde spullen**: Noor kan
  dezelfde 48 kleren winnen als Lotte. Die herhaling is voorlopig goed;
  eigen spullen per avatar kunnen later nog.
- Een beloning gaat altijd naar de **actieve avatar**.
- De naam blijft bij het profiel, niet per avatar.

## Sterren

Elke avatar krijgt 0 tot 3 sterren, volgens hoe vol zijn verzameling is:

| Sterren | Wanneer |
|---|---|
| ☆☆☆ | minder dan een derde |
| ★☆☆ | vanaf een derde (16 à 17 spullen) |
| ★★☆ | vanaf twee derde (32 à 34 spullen) |
| ★★★ | alles gewonnen |

De sterren staan bij elke avatar in "mijn avatars", en bij de actieve avatar
op de levelkaart, naast de teller (🐦 12 / 51).

## Een nieuwe avatar beginnen

- **Een nieuwe avatar mag zodra alle begonnen avatars minstens ★★ hebben.**
  Zo begint het kind niet overal aan zonder iets af te maken, en moet het ook
  niet wachten op de laatste paar spullen.
- Het kind kiest zelf uit **alle thema's**: een ander meisje, een held of een
  vogel.
- Wisselen tussen begonnen avatars kan altijd. Wie terugwisselt, vindt alles
  terug zoals het was.
- Na ongeveer 32 reeksen komt er dus een nieuwe avatar bij. Met lezen en
  rekenen samen (87 reeksen) is dat twee à drie avatars in een
  schooljaar.

### Als de actieve avatar vol is

Is de actieve avatar helemaal vol (★★★) en speelt het kind een nieuwe reeks
uit, dan kan die beloning niet meer naar hem. Een avatar die nog niets won,
telt niet als begonnen: kiest het kind een andere, dan verdwijnt hij weer
(zo kan een kind bij de eerste keuze nog van gedacht veranderen). Het beloningsscherm zegt dan
"Lotte is helemaal klaar!" en het kind kiest eerst met wie het verder
verzamelt: een begonnen avatar die nog niet vol is, of een nieuwe (dat mag
altijd, want een volle avatar heeft ★★). Daarna komen de drie verrassingen
voor die avatar, zoals nu.

Zijn alle avatars van alle thema's vol (15 avatars, zo'n 750 reeksen), dan is
er enkel nog confetti.

## Schermen

- **"mijn avatars"** is het scherm "kies je avatar" voor wie al begonnen is,
  met dezelfde drie rijen (poppen, vogels, helden):
  - een begonnen avatar toont zijn sterren; tikken maakt hem actief;
  - een nog niet begonnen avatar is grijs met een slotje zolang er een
    begonnen avatar onder ★★ zit, en anders gewoon te kiezen;
  - een nieuw profiel zonder avatar ziet "kies je avatar", met de naamstap.
- De knop 🔄 "andere avatar" in de kast, het landschap en het hoofdkwartier
  gaat naar "mijn avatars".
- Wordt een nieuwe avatar vrij (alle begonnen avatars ★★), dan toont het
  beloningsscherm dat met een extra feestje: "je mag een nieuwe avatar
  kiezen!". Kiezen hoeft niet meteen.
- Kast, landschap en hoofdkwartier tonen de verzameling van de actieve
  avatar.

## Oudermenu

- "Start bij level" geeft de extra beloningen aan de actieve avatar, tot die
  vol is. Er gaat niets over naar een andere avatar.
- "Opnieuw beginnen" wist alle avatars; de naam en het leerjaar blijven.
- Het profiel toont de actieve avatar, met het aantal begonnen avatars.

## Technische schets

`Spel` krijgt VERSIE 5:

```ts
type Verzameling = {
  /** Ids van gewonnen spullen of vogels (zonder de startspullen). */
  gewonnen: string[];
  /** Wat de pop of held aanheeft; leeg bij een vogel. */
  aan: Record<string, string>;
};

type Spel = {
  // …
  /** De actieve avatar. */
  avatar: string | null;
  /** Elke begonnen avatar, met zijn verzameling. */
  avatars: Record<string, Verzameling>;
  // weg: kast, aan, vogels, uitrusting, heldAan
};
```

- `herstel` controleert elke verzameling tegen de spullen van het thema van
  die avatar, en zorgt dat een pop of held altijd iets aanheeft.
- `kiesVerrassingen` en `winBeloning` werken op de verzameling van de actieve
  avatar. Nieuwe hulpfuncties: `sterrenVan(spel, avatarId)` en
  `magNieuweAvatar(spel)`.
- Synchroniseren verandert niet: het hele profiel wint of verliest op
  `bijgewerkt`.

### Migratie van versie 4

- Elk thema waarin al iets gewonnen is, wordt één begonnen avatar:
  - is de huidige avatar van dat thema, dan krijgt die de verzameling;
  - anders de eerste avatar van dat thema (Lotte, de eerste startvogel of
    Bliksem).
- De huidige avatar is altijd begonnen, ook met een lege verzameling.
- `aan` gaat naar de pop, `heldAan` naar de held.

Tests:

- de migratie, met een, twee en drie thema's met spullen;
- sterren op de grenzen (een derde, twee derde, vol);
- een nieuwe avatar mag enkel als alle begonnen avatars ★★ hebben;
- een beloning komt nooit bij een volle avatar terecht.
