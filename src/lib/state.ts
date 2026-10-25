"use client";

import { useSyncExternalStore } from "react";
import { HELD_ITEMS, HELD_UITTREKBAAR } from "@/avatar/heldenitems";
import { ITEMS, UITTREKBAAR } from "@/avatar/items";
import { VOGELS } from "@/avatar/vogels";
import {
  isAvatar,
  isLeeg,
  lees,
  magNieuweAvatar,
  nieuweVerzameling,
  nieuwSpel,
  themaVan,
  verzamelingVan,
  type Spel,
  type Thema,
  type Verzameling,
} from "./spel";

export type { Aan, Spel, Thema, Verzameling } from "./spel";
export {
  AVATARS,
  begonnenAvatars,
  isVol,
  magNieuweAvatar,
  spullenVan,
  sterrenVan,
  themaVan,
  verzamelingVan,
} from "./spel";

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

/**
 * Speelt verder met een avatar. Een nieuwe avatar mag enkel als alle
 * begonnen avatars minstens twee sterren hebben; een avatar die nog niets
 * won, verdwijnt als het kind een andere kiest (zie docs/avatars.md).
 */
export function kiesAvatar(id: string) {
  pasAan((s) => {
    if (!isAvatar(id)) return s;
    if (!s.avatars[id] && !magNieuweAvatar(s)) return s;
    const avatars: Record<string, Verzameling> = {};
    for (const [a, v] of Object.entries(s.avatars)) if (a === id || v.gewonnen.length > 0) avatars[a] = v;
    avatars[id] ??= nieuweVerzameling(id);
    return { ...s, avatar: id, avatars };
  });
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

/** Past de verzameling van de actieve avatar aan. */
function pasVerzamelingAan(f: (v: Verzameling, thema: Thema) => Verzameling) {
  pasAan((s) => {
    if (!s.avatar) return s;
    return { ...s, avatars: { ...s.avatars, [s.avatar]: f(verzamelingVan(s), themaVan(s)) } };
  });
}

/**
 * Wint een beloning voor de actieve avatar: een vogel voor het landschap, of
 * kleren of heldenspul dat de avatar meteen aantrekt.
 */
export function winBeloning(id: string) {
  pasVerzamelingAan((v, thema) => {
    const gewonnen = v.gewonnen.includes(id) ? v.gewonnen : [...v.gewonnen, id];
    return pasAanIn({ ...v, gewonnen }, thema, id);
  });
}

/** Trekt de pop of held iets aan, of weer uit (als dat mag). */
export function trekAan(id: string) {
  pasVerzamelingAan((v, thema) => pasAanIn(v, thema, id));
}

function pasAanIn(v: Verzameling, thema: Thema, id: string): Verzameling {
  if (thema === "helden") {
    const item = HELD_ITEMS.find((i) => i.id === id);
    if (!item) return v;
    const aan = { ...v.aan };
    const cat = item.categorie;
    if (aan[cat] === id && HELD_UITTREKBAAR.includes(cat)) delete aan[cat];
    else aan[cat] = id;
    return { ...v, aan };
  }
  if (thema === "kleren") {
    const item = ITEMS.find((i) => i.id === id);
    if (!item) return v;
    const aan = { ...v.aan };
    const cat = item.categorie;
    if (aan[cat] === id && UITTREKBAAR.includes(cat)) {
      delete aan[cat];
      return { ...v, aan };
    }
    aan[cat] = id;
    // Een kleedje vervangt truitje en rok; wie die weer kiest, doet het kleedje uit.
    if (cat === "truitjes" || cat === "onder") delete aan.kleedjes;
    return { ...v, aan };
  }
  return v;
}

/** Wat de actieve avatar nog kan winnen, met de groep om te spreiden. */
function nogTeWinnen(s: Pick<Spel, "avatar" | "avatars">): { id: string; groep: string }[] {
  const { gewonnen } = verzamelingVan(s);
  const thema = themaVan(s);
  if (thema === "vogels") {
    return VOGELS.filter((v) => !gewonnen.includes(v.id)).map((v) => ({ id: v.id, groep: v.gebied }));
  }
  const items: { id: string; categorie: string; start?: boolean }[] = thema === "helden" ? HELD_ITEMS : ITEMS;
  return items.filter((i) => !i.start && !gewonnen.includes(i.id)).map((i) => ({ id: i.id, groep: i.categorie }));
}

/**
 * Kiest drie verrassingen voor de actieve avatar, zoveel mogelijk uit
 * verschillende categorieën (bij de vogels: uit verschillende leefgebieden).
 */
export function kiesVerrassingen(s: Pick<Spel, "avatar" | "avatars">, aantal = 3): string[] {
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
 * reeks die zo extra klaar raakt, krijgt de actieve avatar een willekeurige
 * beloning, tot hij vol is; terugzetten neemt niets af. Andere onderwerpen
 * blijven zoals ze waren.
 */
export function zetVoortgang(reeksIds: string[], aantalKlaar: number) {
  pasAan((s) => {
    const nieuw = reeksIds.slice(0, aantalKlaar);
    const klaar = [...s.klaar.filter((id) => !reeksIds.includes(id)), ...nieuw];
    const extra = nieuw.filter((id) => !s.klaar.includes(id)).length;
    if (!s.avatar) return { ...s, klaar };
    let v = verzamelingVan(s);
    for (let i = 0; i < extra; i++) {
      const [id] = kiesVerrassingen({ avatar: s.avatar, avatars: { [s.avatar]: v } }, 1);
      if (id) v = { ...v, gewonnen: [...v.gewonnen, id] };
    }
    return { ...s, klaar, avatars: { ...s.avatars, [s.avatar]: v } };
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
