// Hoe de profielen van dit toestel en die van de server samengaan. Puur,
// zodat de regels getest kunnen worden zonder browser of server.

import type { Spel } from "./spel";

export type Boekhouding = {
  profielen: Record<string, Spel>;
  /** Profielen waarvan we weten dat de server ze heeft. */
  gesynct: string[];
  /** Hier verwijderd, nog door te geven aan de server. */
  teWissen: string[];
};

/**
 * - hetzelfde profiel op twee plaatsen: het recentste `bijgewerkt` wint;
 * - enkel op de server: nieuw van een ander toestel, dus overnemen
 *   (tenzij het hier net verwijderd is);
 * - enkel hier en al eens gesynct: elders verwijderd, dus hier ook weg;
 * - enkel hier en nooit gesynct: nieuw, dus naar de server sturen.
 */
export function voegSamen(
  hier: Boekhouding,
  server: Record<string, Spel>,
): { profielen: Record<string, Spel>; gesynct: string[]; teDuwen: string[] } {
  const profielen = { ...hier.profielen };
  const teDuwen: string[] = [];

  for (const [id, spel] of Object.entries(server)) {
    if (hier.teWissen.includes(id)) continue;
    const lokaal = profielen[id];
    const tijdServer = spel.bijgewerkt ?? 0;
    const tijdHier = lokaal?.bijgewerkt ?? 0;
    if (!lokaal || tijdServer > tijdHier) profielen[id] = spel;
    else if (tijdHier > tijdServer) teDuwen.push(id);
  }

  for (const id of Object.keys(hier.profielen)) {
    if (id in server) continue;
    if (hier.gesynct.includes(id)) delete profielen[id];
    else teDuwen.push(id);
  }

  const gesynct = Object.keys(server).filter((id) => id in profielen);
  return { profielen, gesynct, teDuwen };
}
