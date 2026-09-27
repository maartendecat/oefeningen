// Alle onderwerpen: wat er te oefenen valt, voor welk leerjaar, en hoe het
// kind antwoordt. Een kind ziet enkel de onderwerpen van zijn eigen leerjaar.
// Elke reeks, van welk onderwerp ook, levert een beloning op voor dezelfde
// verzameling (zie docs/leerjaren.md).

import { LEVELS } from "./levels";
import { TAFEL_LEVELS, type Som } from "./maaltafels";

export type { Som } from "./maaltafels";

export type Reeks<T> = { id: string; oefeningen: T[] };

export type Level<T> = {
  id: string;
  /** Wat er op de tegel van de levelkaart staat: nieuwe klanken, een tafel… */
  tegels: string[];
  reeksen: Reeks<T>[];
};

type Basis = {
  id: string;
  naam: string;
  icoon: string;
  leerjaren: number[];
};

/**
 * De soort bepaalt hoe het kind antwoordt:
 * - voorlezen: het kind leest luidop, een ouder tikt ✓ of ↻;
 * - som: het kind tikt het antwoord in, de app kijkt zelf na.
 */
export type Onderwerp =
  | (Basis & { soort: "voorlezen"; levels: Level<string>[] })
  | (Basis & { soort: "som"; levels: Level<Som>[] });

export const ONDERWERPEN: Onderwerp[] = [
  {
    id: "lezen",
    naam: "lezen",
    icoon: "📖",
    leerjaren: [1],
    soort: "voorlezen",
    levels: LEVELS.map((l) => ({ id: l.id, tegels: l.nieuw, reeksen: l.reeksen })),
  },
  {
    id: "maaltafels",
    naam: "maaltafels",
    icoon: "✖️",
    leerjaren: [3],
    soort: "som",
    levels: TAFEL_LEVELS,
  },
];

/** De leerjaren waarvoor er iets te oefenen is. */
export const LEERJAREN = [...new Set(ONDERWERPEN.flatMap((o) => o.leerjaren))].sort((a, b) => a - b);

export function onderwerpenVoor(leerjaar: number | null | undefined): Onderwerp[] {
  return ONDERWERPEN.filter((o) => leerjaar != null && o.leerjaren.includes(leerjaar));
}

export function vindOnderwerp(id: string | null | undefined): Onderwerp | undefined {
  return ONDERWERPEN.find((o) => o.id === id);
}

export type ReeksPlek = {
  onderwerp: Onderwerp;
  levelId: string;
  reeksId: string;
  /** Positie binnen het onderwerp, vanaf 0. */
  index: number;
};

/** Alle reeksen van een onderwerp achter elkaar, in speelvolgorde. */
export function reeksenVan(onderwerp: Onderwerp): ReeksPlek[] {
  const uit: ReeksPlek[] = [];
  for (const level of onderwerp.levels) {
    for (const reeks of level.reeksen) {
      uit.push({ onderwerp, levelId: level.id, reeksId: reeks.id, index: uit.length });
    }
  }
  return uit;
}

export function vindReeks(id: string): ReeksPlek | undefined {
  for (const o of ONDERWERPEN) {
    const plek = reeksenVan(o).find((p) => p.reeksId === id);
    if (plek) return plek;
  }
  return undefined;
}

/** De oefeningen van een reeks om voor te lezen (of undefined als het iets anders is). */
export function leesReeks(id: string): Reeks<string> | undefined {
  for (const o of ONDERWERPEN) {
    if (o.soort !== "voorlezen") continue;
    for (const l of o.levels) for (const r of l.reeksen) if (r.id === id) return r;
  }
  return undefined;
}

/** De sommen van een reeks (of undefined als het iets anders is). */
export function somReeks(id: string): Reeks<Som> | undefined {
  for (const o of ONDERWERPEN) {
    if (o.soort !== "som") continue;
    for (const l of o.levels) for (const r of l.reeksen) if (r.id === id) return r;
  }
  return undefined;
}
