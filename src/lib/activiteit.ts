// Dagtellers voor het beheer: per dag hoeveel gezinnen en profielen actief
// waren en hoeveel nieuwe reeksen er per onderwerp gedaan zijn. Enkel
// totalen: wie er speelde, wordt niet per dag bewaard (zie opslag.ts).

import { vindReeks } from "@/data/onderwerpen";
import type { Spel } from "./spel";

/** Hoelang de dagtellers bewaard blijven. */
export const TELLER_DUUR = 400 * 24 * 60 * 60;

/** Een dag tellen we in Belgische tijd, als "2026-10-27". */
export function dagVan(ms: number): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Brussels" }).format(new Date(ms));
}

/** De laatste `aantal` dagen tot en met vandaag, de oudste eerst. */
export function laatsteDagen(aantal: number, nu = Date.now()): string[] {
  const dagen = new Set<string>();
  // Per twaalf uur terug, zodat een zomeruur geen dag overslaat.
  for (let ms = nu; dagen.size < aantal; ms -= 12 * 60 * 60 * 1000) dagen.add(dagVan(ms));
  return [...dagen].reverse();
}

/** Reeksen die in `nieuw` klaar zijn en in `oud` nog niet, geteld per onderwerp. */
export function nieuweReeksen(oud: Pick<Spel, "klaar">, nieuw: Pick<Spel, "klaar">): Record<string, number> {
  const uit: Record<string, number> = {};
  for (const id of nieuw.klaar) {
    if (oud.klaar.includes(id)) continue;
    const onderwerp = vindReeks(id)?.onderwerp.id ?? "onbekend";
    uit[onderwerp] = (uit[onderwerp] ?? 0) + 1;
  }
  return uit;
}

export type Dag = {
  dag: string;
  gezinnen: number;
  profielen: number;
  reeksen: Record<string, number>;
};
