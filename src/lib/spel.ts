// Het spelmodel zonder React of browser: de vorm van de voortgang, hoe je
// die controleert en hoe oude voortgang omgezet wordt. Zowel de browser als
// de server gebruiken dit bestand.

import { ITEMS, STARTKLEREN, type Categorie } from "@/avatar/items";
import { isHeld } from "@/avatar/Held";
import { HELD_ITEMS, HELD_START, type HeldAan, type HeldCategorie } from "@/avatar/heldenitems";
import { VOGELS, isStartvogel } from "@/avatar/vogels";

/**
 * Verhoog dit enkel samen met een stap in MIGRATIES, anders kan oude
 * voortgang niet meer ingelezen worden.
 */
export const VERSIE = 4;

export type Aan = Partial<Record<Categorie, string>>;

/** Kleren om aan te trekken, vogels om te verzamelen of een held om uit te rusten; volgt uit de avatar. */
export type Thema = "kleren" | "vogels" | "helden";

export type Spel = {
  versie: number;
  avatar: string | null;
  /** De naam die ze zelf aan haar avatar gaf. */
  naam?: string | null;
  /** Het leerjaar (1-6) bepaalt welke onderwerpen er zijn; null = nog niet gekozen. */
  leerjaar: number | null;
  /** Ids van reeksen die minstens één keer uitgespeeld zijn. */
  klaar: string[];
  /** Ids van gewonnen items (zonder de startkleren). */
  kast: string[];
  aan: Aan;
  /** Ids van gewonnen vogels. Blijft bewaard, ook als het kind terug een pop kiest. */
  vogels: string[];
  /** Ids van gewonnen heldenspullen (zonder de startuitrusting). Blijft ook bewaard. */
  uitrusting: string[];
  /** Wat de held aanheeft. */
  heldAan: HeldAan;
  stil: boolean;
  /** Tijdstip (ms) van de laatste wijziging; de nieuwste versie wint bij synchroniseren. */
  bijgewerkt?: number;
};

export function nieuwSpel(): Spel {
  return {
    versie: VERSIE,
    avatar: null,
    naam: null,
    leerjaar: null,
    klaar: [],
    kast: [],
    aan: { ...STARTKLEREN },
    vogels: [],
    uitrusting: [],
    heldAan: { ...HELD_START },
    stil: false,
    bijgewerkt: 0,
  };
}

/** Nog niets gebeurd: geen avatar gekozen en geen reeks gedaan. */
export function isLeeg(s: Spel): boolean {
  return (
    !s.avatar && s.klaar.length === 0 && s.kast.length === 0 && s.vogels.length === 0 && s.uitrusting.length === 0
  );
}

export function themaVan(s: Pick<Spel, "avatar">): Thema {
  if (isStartvogel(s.avatar)) return "vogels";
  if (isHeld(s.avatar)) return "helden";
  return "kleren";
}

type Ruw = Record<string, unknown>;

/** Omzettingen van versie n naar n+1, sleutel = n. */
export const MIGRATIES: Record<number, (oud: Ruw) => Ruw> = {
  // Het vogelthema: een lege verzameling vogels.
  1: (oud) => ({ ...oud, vogels: [] }),
  // Leerjaren: wie al speelde, deed het lezen van het eerste leerjaar.
  2: (oud) => ({ ...oud, leerjaar: 1 }),
  // Het heldenthema: nog niets gewonnen, de held draagt zijn startuitrusting.
  3: (oud) => ({ ...oud, uitrusting: [], heldAan: { ...HELD_START } }),
};

const isObject = (x: unknown): boolean => !!x && typeof x === "object" && !Array.isArray(x);

const isTekstLijst = (x: unknown): x is string[] =>
  Array.isArray(x) && x.length <= 1000 && x.every((v) => typeof v === "string" && v.length <= 64);

function isGeldig(d: Ruw): boolean {
  return (
    (d.avatar === null || typeof d.avatar === "string") &&
    (d.naam === undefined || d.naam === null || typeof d.naam === "string") &&
    (d.leerjaar === null || (Number.isInteger(d.leerjaar) && (d.leerjaar as number) >= 1 && (d.leerjaar as number) <= 6)) &&
    isTekstLijst(d.klaar) &&
    isTekstLijst(d.kast) &&
    isTekstLijst(d.vogels) &&
    isTekstLijst(d.uitrusting) &&
    isObject(d.aan) &&
    isObject(d.heldAan)
  );
}

/**
 * Ruimt kleren, vogels en heldenspullen op die niet meer bestaan (bv. na
 * het hertekenen van de kleerkast) en zorgt dat de avatar altijd iets aanheeft.
 */
export function herstel(s: Spel): Spel {
  const bestaat = (id: string) => ITEMS.some((i) => i.id === id && !i.start);
  const aan: Aan = {};
  for (const [cat, id] of Object.entries(s.aan) as [Categorie, unknown][]) {
    if (ITEMS.some((i) => i.id === id && i.categorie === cat)) aan[cat] = id as string;
  }
  for (const [cat, id] of Object.entries(STARTKLEREN) as [Categorie, string][]) {
    aan[cat] ??= id;
  }
  const heldAan: HeldAan = {};
  for (const [cat, id] of Object.entries(s.heldAan) as [HeldCategorie, unknown][]) {
    if (HELD_ITEMS.some((i) => i.id === id && i.categorie === cat)) heldAan[cat] = id as string;
  }
  for (const [cat, id] of Object.entries(HELD_START) as [HeldCategorie, string][]) {
    heldAan[cat] ??= id;
  }
  const heldBestaat = (id: string) => HELD_ITEMS.some((i) => i.id === id && !i.start);
  return {
    versie: VERSIE,
    avatar: s.avatar,
    naam: typeof s.naam === "string" ? s.naam.slice(0, 24) : null,
    leerjaar: s.leerjaar,
    klaar: [...new Set(s.klaar)],
    kast: [...new Set(s.kast.filter(bestaat))],
    aan,
    vogels: [...new Set(s.vogels.filter((id) => VOGELS.some((v) => v.id === id)))],
    uitrusting: [...new Set(s.uitrusting.filter(heldBestaat))],
    heldAan,
    stil: s.stil === true,
    bijgewerkt: typeof s.bijgewerkt === "number" ? s.bijgewerkt : 0,
  };
}

/**
 * Leest voortgang uit onbetrouwbare bron (localStorage, server, geplakte
 * code): zet oude versies om, controleert de vorm en ruimt op. Geeft null
 * als het niet te redden is, of als het van een nieuwere versie van de app
 * komt die deze versie nog niet kent.
 */
export function lees(data: unknown): Spel | null {
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  let d = data as Ruw;
  if (typeof d.versie !== "number" || d.versie < 1 || d.versie > VERSIE) return null;

  while ((d.versie as number) < VERSIE) {
    const stap = MIGRATIES[d.versie as number];
    if (!stap) return null;
    d = { ...stap(d), versie: (d.versie as number) + 1 };
  }

  return isGeldig(d) ? herstel(d as unknown as Spel) : null;
}
