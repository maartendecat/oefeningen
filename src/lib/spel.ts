// Het spelmodel zonder React of browser: de vorm van de voortgang, hoe je
// die controleert en hoe oude voortgang omgezet wordt. Zowel de browser als
// de server gebruiken dit bestand.

import { ITEMS, STARTKLEREN, type Categorie } from "@/avatar/items";
import { HELDEN, isHeld } from "@/avatar/Held";
import { HELD_ITEMS, HELD_START } from "@/avatar/heldenitems";
import { BASISSEN } from "@/avatar/Pop";
import { STARTVOGELS, VOGELS, isStartvogel } from "@/avatar/vogels";

/**
 * Verhoog dit enkel samen met een stap in MIGRATIES, anders kan oude
 * voortgang niet meer ingelezen worden.
 */
export const VERSIE = 5;

export type Aan = Partial<Record<Categorie, string>>;

/** Kleren om aan te trekken, vogels om te verzamelen of een held om uit te rusten; volgt uit de avatar. */
export type Thema = "kleren" | "vogels" | "helden";

/** Wat één avatar verzamelde (zie docs/avatars.md). */
export type Verzameling = {
  /** Ids van gewonnen kleren, vogels of heldenspullen (zonder de startspullen). */
  gewonnen: string[];
  /** Wat de pop of held aanheeft, per categorie; leeg bij een vogel. */
  aan: Record<string, string>;
};

export type Spel = {
  versie: number;
  /** De avatar waarmee het kind nu speelt. */
  avatar: string | null;
  /** De naam die ze zelf aan haar avatar gaf. */
  naam?: string | null;
  /** Het leerjaar (1-6) bepaalt welke onderwerpen er zijn; null = nog niet gekozen. */
  leerjaar: number | null;
  /** Ids van reeksen die minstens één keer uitgespeeld zijn. */
  klaar: string[];
  /** Elke avatar die het kind begon, met zijn verzameling. */
  avatars: Record<string, Verzameling>;
  stil: boolean;
  /** Tijdstip (ms) van de laatste wijziging; de nieuwste versie wint bij synchroniseren. */
  bijgewerkt?: number;
};

/** Alle avatars per thema, in de volgorde van het keuzescherm. */
export const AVATARS: Record<Thema, string[]> = {
  kleren: BASISSEN.map((b) => b.id),
  vogels: STARTVOGELS.map((v) => v.id),
  helden: HELDEN.map((h) => h.id),
};

export function isAvatar(id: string): boolean {
  return Object.values(AVATARS).some((ids) => ids.includes(id));
}

export function themaVan(s: Pick<Spel, "avatar">): Thema {
  if (isStartvogel(s.avatar)) return "vogels";
  if (isHeld(s.avatar)) return "helden";
  return "kleren";
}

/** Wat er in een thema te winnen valt (zonder de startspullen). */
export function spullenVan(thema: Thema): string[] {
  if (thema === "vogels") return VOGELS.map((v) => v.id);
  if (thema === "helden") return HELD_ITEMS.filter((i) => !i.start).map((i) => i.id);
  return ITEMS.filter((i) => !i.start).map((i) => i.id);
}

function startAan(thema: Thema): Record<string, string> {
  if (thema === "kleren") return { ...STARTKLEREN } as Record<string, string>;
  if (thema === "helden") return { ...HELD_START } as Record<string, string>;
  return {};
}

export function nieuweVerzameling(avatar: string): Verzameling {
  return { gewonnen: [], aan: startAan(themaVan({ avatar })) };
}

/** De verzameling van een avatar (standaard de actieve), of een lege als hij nog niet begonnen is. */
export function verzamelingVan(s: Pick<Spel, "avatar" | "avatars">, avatar = s.avatar): Verzameling {
  if (!avatar) return { gewonnen: [], aan: {} };
  return s.avatars[avatar] ?? nieuweVerzameling(avatar);
}

/** 0 tot 3 sterren: vanaf een derde, vanaf twee derde, en alles gewonnen. */
export function sterrenVan(s: Pick<Spel, "avatar" | "avatars">, avatar = s.avatar): number {
  if (!avatar) return 0;
  const totaal = spullenVan(themaVan({ avatar })).length;
  const gewonnen = verzamelingVan(s, avatar).gewonnen.length;
  if (gewonnen >= totaal) return 3;
  if (gewonnen * 3 >= totaal * 2) return 2;
  if (gewonnen * 3 >= totaal) return 1;
  return 0;
}

export function isVol(s: Pick<Spel, "avatar" | "avatars">, avatar = s.avatar): boolean {
  return sterrenVan(s, avatar) === 3;
}

/** Begonnen avatars: die al iets gewonnen hebben. Een avatar zonder iets telt nog niet mee. */
export function begonnenAvatars(s: Pick<Spel, "avatars">): string[] {
  return Object.keys(s.avatars).filter((id) => s.avatars[id].gewonnen.length > 0);
}

/** Een nieuwe avatar mag zodra alle begonnen avatars minstens twee sterren hebben. */
export function magNieuweAvatar(s: Pick<Spel, "avatar" | "avatars">): boolean {
  return begonnenAvatars(s).every((id) => sterrenVan(s, id) >= 2);
}

export function nieuwSpel(): Spel {
  return {
    versie: VERSIE,
    avatar: null,
    naam: null,
    leerjaar: null,
    klaar: [],
    avatars: {},
    stil: false,
    bijgewerkt: 0,
  };
}

/** Nog niets gebeurd: geen avatar gekozen en geen reeks gedaan. */
export function isLeeg(s: Spel): boolean {
  return !s.avatar && s.klaar.length === 0 && begonnenAvatars(s).length === 0;
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
  // Een verzameling per avatar: elk thema met spullen wordt één avatar, de
  // huidige als die van dat thema is, en anders de eerste van dat thema.
  4: (oud) => {
    const { kast, aan, vogels, uitrusting, heldAan, ...rest } = oud;
    const avatar = typeof oud.avatar === "string" ? oud.avatar : null;
    const thema = avatar ? themaVan({ avatar }) : null;
    const avatars: Record<string, unknown> = {};
    const per: [Thema, unknown, unknown][] = [
      ["kleren", kast, aan],
      ["vogels", vogels, {}],
      ["helden", uitrusting, heldAan],
    ];
    for (const [t, gewonnen, tAan] of per) {
      // Een kapotte lijst gaat mee, zodat de controle erna ze weigert.
      const leeg = Array.isArray(gewonnen) && gewonnen.length === 0;
      if (leeg && thema !== t) continue;
      avatars[thema === t ? avatar! : AVATARS[t][0]] = { gewonnen, aan: tAan };
    }
    return { ...rest, avatars };
  },
};

const isObject = (x: unknown): boolean => !!x && typeof x === "object" && !Array.isArray(x);

const isTekstLijst = (x: unknown): x is string[] =>
  Array.isArray(x) && x.length <= 1000 && x.every((v) => typeof v === "string" && v.length <= 64);

function isVerzameling(x: unknown): boolean {
  if (!isObject(x)) return false;
  const v = x as Ruw;
  return isTekstLijst(v.gewonnen) && isObject(v.aan);
}

function isGeldig(d: Ruw): boolean {
  return (
    (d.avatar === null || typeof d.avatar === "string") &&
    (d.naam === undefined || d.naam === null || typeof d.naam === "string") &&
    (d.leerjaar === null || (Number.isInteger(d.leerjaar) && (d.leerjaar as number) >= 1 && (d.leerjaar as number) <= 6)) &&
    isTekstLijst(d.klaar) &&
    isObject(d.avatars) &&
    Object.keys(d.avatars as Ruw).length <= 50 &&
    Object.values(d.avatars as Ruw).every(isVerzameling)
  );
}

/**
 * Houdt enkel spullen die bestaan en bij het thema passen, en zorgt dat een
 * pop of held altijd iets aanheeft.
 */
function herstelVerzameling(avatar: string, v: Verzameling): Verzameling {
  const thema = themaVan({ avatar });
  const spullen = spullenVan(thema);
  const items: { id: string; categorie: string }[] = thema === "kleren" ? ITEMS : thema === "helden" ? HELD_ITEMS : [];
  const aan: Record<string, string> = {};
  for (const [cat, id] of Object.entries(v.aan)) {
    if (items.some((i) => i.id === id && i.categorie === cat)) aan[cat] = id;
  }
  for (const [cat, id] of Object.entries(startAan(thema))) aan[cat] ??= id;
  return { gewonnen: [...new Set(v.gewonnen.filter((id) => spullen.includes(id)))], aan };
}

/**
 * Ruimt kleren, vogels en heldenspullen op die niet meer bestaan (bv. na
 * het hertekenen van de kleerkast) en zorgt dat de avatar altijd iets aanheeft.
 */
export function herstel(s: Spel): Spel {
  const avatar = s.avatar && isAvatar(s.avatar) ? s.avatar : null;
  const avatars: Record<string, Verzameling> = {};
  for (const [id, v] of Object.entries(s.avatars)) {
    if (isAvatar(id)) avatars[id] = herstelVerzameling(id, v);
  }
  if (avatar) avatars[avatar] ??= nieuweVerzameling(avatar);
  return {
    versie: VERSIE,
    avatar,
    naam: typeof s.naam === "string" ? s.naam.slice(0, 24) : null,
    leerjaar: s.leerjaar,
    klaar: [...new Set(s.klaar)],
    avatars,
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
