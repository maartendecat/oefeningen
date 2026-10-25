// Rekenen voor het eerste leerjaar: getalbeelden en splitsen, zoals de klas
// het leert met Wiskanjers. Getalbeelden staan op een tienveld van 2 × 5,
// splitsen gebeurt met een splitshuis waarin één kamer leeg is.
//
// Een level per getal, systematisch van klein naar groot: eerst 2, dan 3…
// tot 10. Daarna alles tot 10 door elkaar, en twee levels tot 20.
//
// Elke reeks begint met 8 splitsingen van het nieuwe getal (in de eerste
// reeks in de volgorde van de kaartjes in de klas: 0 | 7, 1 | 6, 2 | 5…, en
// dan alle splitsingen, ook als dat er meer dan 8 zijn), en
// herhaalt daarna alle getallen tot nu toe. Een oefening is altijd óf een
// getalbeeld óf een splitshuis, nooit de twee samen. In de tweede helft van
// een level worden de getalbeelden maar even getoond.
//
// Zie rekenen.test.ts voor wat er bewaakt wordt, en docs/rekenen.md voor
// het ontwerp.

import { willekeur, type Som, type Willekeur } from "./sommen";

export type RekenLevel = {
  id: string;
  /** Wat er op de tegel van de levelkaart staat. */
  tegels: string[];
  reeksen: { id: string; oefeningen: Som[] }[];
};

const PER_REEKS = 15;
/** Zoveel oefeningen in het begin van een reeks gaan over het nieuwe getal. */
const NIEUW_PER_REEKS = 8;

type Splitshuis = Extract<Som, { vorm: "splitshuis" }>;
type Getalbeeld = Extract<Som, { vorm: "getalbeeld" }>;

/**
 * Hoe de getalbeelden van een reeks eruitzien: of ze maar even blijven
 * staan, en (willekeurig per getalbeeld) of het tienveld ligt of staat.
 */
type Stijl = { evenTonen: boolean; r: Willekeur };

const van = (begin: number, einde: number) => Array.from({ length: einde - begin + 1 }, (_, i) => begin + i);

/** Een splitshuis: het dak, de linker kamer, en welke kamer leeg is. */
function huis(dak: number, links: number, leeg: "links" | "rechts"): Splitshuis {
  const rechts = dak - links;
  return {
    vorm: "splitshuis",
    dak,
    links: leeg === "links" ? null : links,
    rechts: leeg === "rechts" ? null : rechts,
    antwoord: leeg === "links" ? links : rechts,
  };
}

function beeld(aantal: number, stijl: Stijl): Getalbeeld {
  return { vorm: "getalbeeld", aantal, staand: stijl.r.kans(0.5), evenTonen: stijl.evenTonen, antwoord: aantal };
}

/**
 * Alle splitsingen van een getal (met 0 erbij), elk met links of rechts leeg.
 * In de volgorde van de kaartjes: 0 | n, 1 | n-1…, eerst om beurt een andere
 * kamer leeg, daarna nog eens met de andere kamer leeg.
 */
function splitsingenVan(dak: number): Splitshuis[] {
  const kant = (i: number, ronde: number) => ((i + ronde) % 2 === 0 ? "rechts" : "links");
  return [0, 1].flatMap((ronde) => van(0, dak).map((i) => huis(dak, i, kant(i, ronde))));
}

/** Boven de tien: splitsen in 10 en de rest (14 = 10 + 4), het tiental links of rechts. */
function tientalSplitsingenVan(dak: number): Splitshuis[] {
  const rest = dak - 10;
  const alle = [huis(dak, 10, "rechts"), huis(dak, rest, "links"), huis(dak, rest, "rechts"), huis(dak, 10, "links")];
  // Bij 20 is de rest ook 10: dan zijn er maar twee verschillende.
  return alle.filter((h, i) => alle.findIndex((x) => sleutel(x) === sleutel(h)) === i);
}

/** Twee oefeningen zijn dezelfde als ze hetzelfde vragen (los van hoe het tienveld ligt, of even tonen). */
export function sleutel(s: Som): string {
  if (s.vorm === "getalbeeld") return `beeld ${s.aantal}`;
  if (s.vorm === "splitshuis") return `huis ${s.dak}: ${s.links ?? "?"} | ${s.rechts ?? "?"}`;
  return s.vraag;
}

/**
 * Om te herhalen: getalbeelden en splitsingen van alle getallen tot nu toe,
 * apart, zodat de getalbeelden niet verdwijnen tussen de vele splitsingen.
 */
function herhalingTot(getallen: number[], stijl: Stijl): Som[][] {
  return [
    getallen.map((n) => beeld(n, stijl)),
    [
      ...getallen.filter((n) => n >= 2 && n <= 10).flatMap(splitsingenVan),
      ...getallen.filter((n) => n > 10).flatMap(tientalSplitsingenVan),
    ],
  ];
}

/**
 * Een reeks: eerst `nieuw` (al in de juiste volgorde), dan aangevuld met
 * herhaling tot 15, om beurt een getalbeeld en een splitsing, zonder dezelfde
 * oefening twee keer. Is er niet genoeg verschillende herhaling (enkel bij
 * het getal 2), dan komt er toch een oefening terug.
 */
function reeks(id: string, r: Willekeur, nieuw: Som[], herhaling: Som[][]): { id: string; oefeningen: Som[] } {
  const oefeningen = [...nieuw];
  const gezien = new Set(oefeningen.map(sleutel));
  const stapels = herhaling.map((h) => r.schud(h));
  for (let beurt = 0; oefeningen.length < PER_REEKS && stapels.some((s) => s.length); beurt++) {
    const s = stapels[beurt % stapels.length].shift();
    if (!s || gezien.has(sleutel(s))) continue;
    gezien.add(sleutel(s));
    oefeningen.push(s);
  }
  const alles = [...nieuw, ...herhaling.flat()];
  while (oefeningen.length < PER_REEKS) oefeningen.push(r.kies(alles));
  return { id, oefeningen };
}

/** In de tweede helft van een level worden de getalbeelden maar even getoond. */
function stijlVan(k: number, aantal: number, r: Willekeur): Stijl {
  return { evenTonen: k > Math.ceil(aantal / 2), r };
}

/** Een level voor één nieuw getal van 2 tot 10. */
function getalLevel(n: number, aantal: number): RekenLevel {
  const id = `reken-${n}`;
  const reeksen = van(1, aantal).map((k) => {
    const r = willekeur(`${id}-${k}`);
    const stijl = stijlVan(k, aantal, r);
    const alle = splitsingenVan(n);
    // De eerste reeks in de volgorde van de kaartjes, en dan alle splitsingen
    // (bij 8, 9 en 10 zijn dat er meer dan 8); daarna door elkaar.
    const nieuw = k === 1 ? alle.slice(0, Math.max(NIEUW_PER_REEKS, n + 1)) : r.schud(alle).slice(0, NIEUW_PER_REEKS);
    return reeks(`${id}-${k}`, r, nieuw, herhalingTot(van(1, n), stijl));
  });
  return { id, tegels: [String(n)], reeksen };
}

/** Alles tot 10 door elkaar; de 8 eerste zijn splitsingen van de grotere getallen. */
function mixLevel(): RekenLevel {
  const id = "reken-mix10";
  const reeksen = van(1, 4).map((k) => {
    const r = willekeur(`${id}-${k}`);
    const stijl = stijlVan(k, 4, r);
    const groot = r.schud(van(6, 10).flatMap(splitsingenVan));
    const nieuw: Som[] = [];
    for (const s of groot) {
      if (nieuw.length === NIEUW_PER_REEKS) break;
      if (!nieuw.some((x) => sleutel(x) === sleutel(s))) nieuw.push(s);
    }
    return reeks(`${id}-${k}`, r, nieuw, herhalingTot(van(1, 10), stijl));
  });
  return { id, tegels: ["≤10"], reeksen };
}

/** Getallen boven de tien: eerst hun getalbeelden, dan splitsen in 10 en de rest. */
function tientalLevel(begin: number, einde: number): RekenLevel {
  const id = `reken-${begin}-${einde}`;
  const reeksen = van(1, 4).map((k) => {
    const r = willekeur(`${id}-${k}`);
    const stijl = stijlVan(k, 4, r);
    const getallen = r.schud(van(begin, einde));
    const beelden = getallen.slice(0, NIEUW_PER_REEKS / 2).map((n) => beeld(n, stijl));
    const huizen = r.schud(van(begin, einde).flatMap(tientalSplitsingenVan)).slice(0, NIEUW_PER_REEKS / 2);
    return reeks(`${id}-${k}`, r, [...beelden, ...huizen], herhalingTot(van(1, einde), stijl));
  });
  return { id, tegels: [`${begin}–${einde}`], reeksen };
}

/** Kleine getallen hebben weinig splitsingen, dus minder reeksen. */
const REEKSEN_PER_GETAL: Record<number, number> = { 2: 2, 3: 2, 4: 3 };

export const REKEN_LEVELS: RekenLevel[] = [
  ...van(2, 10).map((n) => getalLevel(n, REEKSEN_PER_GETAL[n] ?? 4)),
  mixLevel(),
  tientalLevel(11, 15),
  tientalLevel(16, 20),
];
