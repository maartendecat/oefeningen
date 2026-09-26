"use client";

import { useSyncExternalStore } from "react";
import { ITEMS, STARTKLEREN, UITTREKBAAR, type Categorie } from "@/avatar/items";

// Alle voortgang zit in één object in localStorage. Het versienummer laat toe
// om later de vorm te veranderen zonder oude voortgang kwijt te spelen.

const SLEUTEL = "oefenen-op-lezen";
const VERSIE = 1;

export type Aan = Partial<Record<Categorie, string>>;

export type Spel = {
  versie: typeof VERSIE;
  avatar: string | null;
  /** De naam die ze zelf aan haar pop gaf. Ontbreekt in oudere voortgang. */
  naam?: string | null;
  /** Ids van reeksen die minstens één keer uitgespeeld zijn. */
  klaar: string[];
  /** Ids van gewonnen items (zonder de startkleren). */
  kast: string[];
  aan: Aan;
  stil: boolean;
};

export function nieuwSpel(): Spel {
  return {
    versie: VERSIE,
    avatar: null,
    naam: null,
    klaar: [],
    kast: [],
    aan: { ...STARTKLEREN },
    stil: false,
  };
}

function isSpel(x: unknown): x is Spel {
  const s = x as Spel;
  return (
    !!s &&
    s.versie === VERSIE &&
    Array.isArray(s.klaar) &&
    Array.isArray(s.kast) &&
    typeof s.aan === "object"
  );
}

let huidig: Spel | null = null;
const luisteraars = new Set<() => void>();

function laad(): Spel {
  if (huidig) return huidig;
  try {
    const ruw = localStorage.getItem(SLEUTEL);
    const data = ruw ? JSON.parse(ruw) : null;
    huidig = isSpel(data) ? data : nieuwSpel();
  } catch {
    huidig = nieuwSpel();
  }
  return huidig;
}

export function bewaar(volgend: Spel) {
  huidig = volgend;
  try {
    localStorage.setItem(SLEUTEL, JSON.stringify(volgend));
  } catch {
    // Privévenster of volle opslag: het spel werkt verder, enkel zonder geheugen.
  }
  luisteraars.forEach((l) => l());
}

export function pasAan(f: (s: Spel) => Spel) {
  bewaar(f(laad()));
}

function abonneer(l: () => void) {
  luisteraars.add(l);
  return () => luisteraars.delete(l);
}

/** Het spel, of null tijdens de server-render (localStorage bestaat daar niet). */
export function useSpel(): Spel | null {
  return useSyncExternalStore(abonneer, laad, () => null);
}

// ---- Acties ---------------------------------------------------------------

export function kiesAvatar(id: string) {
  pasAan((s) => ({ ...s, avatar: id }));
}

export function zetNaam(naam: string) {
  pasAan((s) => ({ ...s, naam }));
}

export function zetStil(stil: boolean) {
  pasAan((s) => ({ ...s, stil }));
}

export function reeksKlaar(id: string) {
  pasAan((s) => (s.klaar.includes(id) ? s : { ...s, klaar: [...s.klaar, id] }));
}

/** Voegt een item toe aan de kast en trekt het meteen aan. */
export function winItem(id: string) {
  pasAan((s) => {
    const kast = s.kast.includes(id) ? s.kast : [...s.kast, id];
    return trekAanIn({ ...s, kast }, id);
  });
}

export function trekAan(id: string) {
  pasAan((s) => trekAanIn(s, id));
}

function trekAanIn(s: Spel, id: string): Spel {
  const item = ITEMS.find((i) => i.id === id);
  if (!item) return s;
  const aan = { ...s.aan };
  const cat = item.categorie;

  if (aan[cat] === id && UITTREKBAAR.includes(cat)) {
    delete aan[cat];
    return { ...s, aan };
  }
  aan[cat] = id;
  // Een kleedje vervangt truitje en rok; wie die weer kiest, doet het kleedje uit.
  if (cat === "truitjes" || cat === "onder") delete aan.kleedjes;
  return { ...s, aan };
}

export function vergrendeld(s: Spel) {
  return ITEMS.filter((i) => !i.start && !s.kast.includes(i.id));
}

/** Kiest drie verrassingen, zoveel mogelijk uit verschillende categorieën. */
export function kiesVerrassingen(s: Spel, aantal = 3): string[] {
  const open = [...vergrendeld(s)].sort(() => Math.random() - 0.5);
  const gekozen: typeof open = [];
  for (const item of open) {
    if (gekozen.length === aantal) break;
    if (!gekozen.some((g) => g.categorie === item.categorie)) gekozen.push(item);
  }
  for (const item of open) {
    if (gekozen.length === aantal) break;
    if (!gekozen.includes(item)) gekozen.push(item);
  }
  return gekozen.map((i) => i.id);
}

/**
 * Oudermenu: zet de voortgang zo dat de reeksen vóór `aantalKlaar` gedaan
 * zijn. Voor elke reeks die zo extra klaar raakt, komt er een willekeurig
 * item bij; terugzetten neemt niets af.
 */
export function zetVoortgang(reeksIds: string[], aantalKlaar: number) {
  pasAan((s) => {
    const klaar = reeksIds.slice(0, aantalKlaar);
    const extra = klaar.filter((id) => !s.klaar.includes(id)).length;
    let kast = s.kast;
    for (let i = 0; i < extra; i++) {
      const [nieuw] = kiesVerrassingen({ ...s, kast }, 1);
      if (nieuw) kast = [...kast, nieuw];
    }
    return { ...s, klaar, kast };
  });
}

export function wisAlles() {
  bewaar(nieuwSpel());
}

export function exporteer(s: Spel): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(s))));
}

export function importeer(code: string): boolean {
  try {
    const data = JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
    if (!isSpel(data)) return false;
    bewaar(data);
    return true;
  } catch {
    return false;
  }
}
