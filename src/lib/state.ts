"use client";

import { useSyncExternalStore } from "react";
import { ITEMS, UITTREKBAAR } from "@/avatar/items";
import { VOGELS } from "@/avatar/vogels";
import { isLeeg, lees, nieuwSpel, themaVan, type Spel } from "./spel";

export type { Aan, Spel, Thema } from "./spel";
export { themaVan } from "./spel";

// Alle profielen van het gezin staan ook in localStorage: zo werkt de app
// meteen, ook zonder internet, en kan een kind van profiel wisselen zonder
// op de server te wachten. sync.ts houdt de server bij.
//
// Welk profiel speelt, zit enkel in het geheugen: bij het openen van de app
// kiest het kind opnieuw (tenzij er maar één profiel is).

const SLEUTEL = "oefenen-op-lezen:gezin";
/** Van vóór de profielen: één spel, zonder gezin. Wordt het eerste profiel. */
const SLEUTEL_OUD = "oefenen-op-lezen";

export type Lokaal = {
  /** E-mailadres van het gezin waarvan deze profielen zijn, of null als nog niemand inlogde. */
  gezin: string | null;
  profielen: Record<string, Spel>;
  /** Profielen waarvan we weten dat de server ze heeft (om verwijderingen te herkennen). */
  gesynct: string[];
  /** Verwijderd terwijl de server onbereikbaar was; wordt later doorgegeven. */
  teWissen: string[];
};

export type Staat = {
  lokaal: Lokaal;
  actief: string | null;
};

let staat: Staat | null = null;
const luisteraars = new Set<() => void>();
let naWijziging: ((id: string) => void) | null = null;

export function nieuwId(): string {
  const tekens = "abcdefghijklmnopqrstuvwxyz0123456789";
  const buf = new Uint8Array(12);
  crypto.getRandomValues(buf);
  return "p-" + Array.from(buf, (b) => tekens[b % tekens.length]).join("");
}

function leesLokaal(): Lokaal {
  const leeg: Lokaal = { gezin: null, profielen: {}, gesynct: [], teWissen: [] };
  try {
    const ruw = localStorage.getItem(SLEUTEL);
    if (ruw) {
      const data = JSON.parse(ruw) as Partial<Lokaal>;
      const profielen: Record<string, Spel> = {};
      for (const [id, spel] of Object.entries(data.profielen ?? {})) {
        const goed = lees(spel);
        if (goed) profielen[id] = goed;
      }
      return {
        gezin: typeof data.gezin === "string" ? data.gezin : null,
        profielen,
        gesynct: Array.isArray(data.gesynct) ? data.gesynct : [],
        teWissen: Array.isArray(data.teWissen) ? data.teWissen : [],
      };
    }
    // Eerste keer met profielen: wat hier al gespeeld werd, wordt een profiel.
    const oud = lees(JSON.parse(localStorage.getItem(SLEUTEL_OUD) ?? "null"));
    if (oud && !isLeeg(oud)) return { ...leeg, profielen: { [nieuwId()]: oud } };
  } catch {
    // Kapotte of geblokkeerde opslag: leeg beginnen.
  }
  return leeg;
}

function laad(): Staat {
  if (staat) return staat;
  const lokaal = leesLokaal();
  const ids = Object.keys(lokaal.profielen);
  staat = { lokaal, actief: ids.length === 1 ? ids[0] : null };
  return staat;
}

function zet(volgend: Staat, bewaarLokaal = true) {
  staat = volgend;
  if (bewaarLokaal) {
    try {
      localStorage.setItem(SLEUTEL, JSON.stringify(volgend.lokaal));
      localStorage.removeItem(SLEUTEL_OUD);
    } catch {
      // Privévenster of volle opslag: het spel werkt verder, enkel zonder geheugen.
    }
  }
  luisteraars.forEach((l) => l());
}

export function huidigeStaat(): Staat {
  return laad();
}

/** Laat sync.ts weten welk profiel veranderd is. */
export function bijWijziging(f: (id: string) => void) {
  naWijziging = f;
}

function abonneer(l: () => void) {
  luisteraars.add(l);
  return () => luisteraars.delete(l);
}

/** De hele lokale staat, of null tijdens de server-render. */
export function useStaat(): Staat | null {
  return useSyncExternalStore(abonneer, laad, () => null);
}

/** Het spel van het actieve profiel. */
export function useSpel(): Spel | null {
  const s = useStaat();
  return s?.actief ? (s.lokaal.profielen[s.actief] ?? null) : null;
}

// ---- Profielen --------------------------------------------------------------

/**
 * Bewaart een profiel. Een eigen wijziging krijgt een nieuw tijdstip en gaat
 * naar de server; wat van de server komt, wordt enkel overgenomen.
 */
export function bewaarProfiel(id: string, spel: Spel, { vanServer = false } = {}) {
  const s = laad();
  const nieuw = vanServer ? spel : { ...spel, bijgewerkt: Date.now() };
  zet({ ...s, lokaal: { ...s.lokaal, profielen: { ...s.lokaal.profielen, [id]: nieuw } } });
  if (!vanServer) naWijziging?.(id);
}

export function kiesProfiel(id: string | null) {
  zet({ ...laad(), actief: id }, false);
}

/**
 * Oudermenu: een nieuw profiel met een naam, en eventueel al het leerjaar;
 * het kind kiest zelf de avatar (en het leerjaar, als de ouder dat niet deed).
 */
export function maakProfiel(naam: string, leerjaar: number | null = null): string {
  const id = nieuwId();
  bewaarProfiel(id, { ...nieuwSpel(), naam, leerjaar });
  return id;
}

/** Oudermenu: het leerjaar van een profiel aanpassen. */
export function zetLeerjaarVan(id: string, leerjaar: number) {
  const spel = laad().lokaal.profielen[id];
  if (spel) bewaarProfiel(id, { ...spel, leerjaar });
}

export function hernoemProfiel(id: string, naam: string) {
  const spel = laad().lokaal.profielen[id];
  if (spel) bewaarProfiel(id, { ...spel, naam });
}

export function verwijderProfiel(id: string) {
  const s = laad();
  const profielen = { ...s.lokaal.profielen };
  delete profielen[id];
  zet({
    actief: s.actief === id ? null : s.actief,
    lokaal: {
      ...s.lokaal,
      profielen,
      teWissen: s.lokaal.gesynct.includes(id) ? [...s.lokaal.teWissen, id] : s.lokaal.teWissen,
      gesynct: s.lokaal.gesynct.filter((g) => g !== id),
    },
  });
}

/** Voor sync.ts: de lokale boekhouding aanpassen zonder iets naar de server te sturen. */
export function pasLokaalAan(f: (l: Lokaal) => Lokaal) {
  const s = laad();
  const lokaal = f(s.lokaal);
  const actief = s.actief && lokaal.profielen[s.actief] ? s.actief : null;
  zet({ lokaal, actief });
}

// ---- Acties op het actieve profiel ------------------------------------------

export function pasAan(f: (s: Spel) => Spel) {
  const s = laad();
  const spel = s.actief ? s.lokaal.profielen[s.actief] : null;
  if (s.actief && spel) bewaarProfiel(s.actief, f(spel));
}

export function kiesAvatar(id: string) {
  pasAan((s) => ({ ...s, avatar: id }));
}

export function zetLeerjaar(leerjaar: number) {
  pasAan((s) => ({ ...s, leerjaar }));
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

/** Voegt een vogel toe aan het landschap. */
export function winVogel(id: string) {
  pasAan((s) => (s.vogels.includes(id) ? s : { ...s, vogels: [...s.vogels, id] }));
}

/** Wint een beloning in het thema van de avatar. */
export function winBeloning(s: Spel, id: string) {
  if (themaVan(s) === "vogels") winVogel(id);
  else winItem(id);
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

/** Wat er nog te winnen is in het thema van de avatar, met de groep om te spreiden. */
function nogTeWinnen(s: Spel): { id: string; groep: string }[] {
  if (themaVan(s) === "vogels") {
    return VOGELS.filter((v) => !s.vogels.includes(v.id)).map((v) => ({ id: v.id, groep: v.gebied }));
  }
  return ITEMS.filter((i) => !i.start && !s.kast.includes(i.id)).map((i) => ({ id: i.id, groep: i.categorie }));
}

/**
 * Kiest drie verrassingen, zoveel mogelijk uit verschillende categorieën
 * (bij de vogels: uit verschillende leefgebieden).
 */
export function kiesVerrassingen(s: Spel, aantal = 3): string[] {
  const open = nogTeWinnen(s).sort(() => Math.random() - 0.5);
  const gekozen: typeof open = [];
  for (const item of open) {
    if (gekozen.length === aantal) break;
    if (!gekozen.some((g) => g.groep === item.groep)) gekozen.push(item);
  }
  for (const item of open) {
    if (gekozen.length === aantal) break;
    if (!gekozen.includes(item)) gekozen.push(item);
  }
  return gekozen.map((i) => i.id);
}

/**
 * Oudermenu: zet de voortgang van één onderwerp (`reeksIds`, in
 * speelvolgorde) zo dat de reeksen vóór `aantalKlaar` gedaan zijn. Voor elke
 * reeks die zo extra klaar raakt, komt er een willekeurig item (of vogel) bij;
 * terugzetten neemt niets af. Andere onderwerpen blijven zoals ze waren.
 */
export function zetVoortgang(reeksIds: string[], aantalKlaar: number) {
  pasAan((s) => {
    const nieuw = reeksIds.slice(0, aantalKlaar);
    const klaar = [...s.klaar.filter((id) => !reeksIds.includes(id)), ...nieuw];
    const extra = nieuw.filter((id) => !s.klaar.includes(id)).length;
    const veld = themaVan(s) === "vogels" ? "vogels" : "kast";
    let lijst = s[veld];
    for (let i = 0; i < extra; i++) {
      const [nieuw] = kiesVerrassingen({ ...s, [veld]: lijst }, 1);
      if (nieuw) lijst = [...lijst, nieuw];
    }
    return { ...s, klaar, [veld]: lijst };
  });
}

/** Begint opnieuw met het actieve profiel; de naam en het leerjaar blijven. */
export function wisVoortgang() {
  pasAan((s) => ({ ...nieuwSpel(), naam: s.naam, leerjaar: s.leerjaar }));
}

export function exporteer(s: Spel): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(s))));
}

/** Laadt een reservekopie in het actieve profiel. */
export function importeer(code: string): boolean {
  try {
    const spel = lees(JSON.parse(decodeURIComponent(escape(atob(code.trim())))));
    if (!spel) return false;
    pasAan(() => spel);
    return true;
  } catch {
    return false;
  }
}
