// Wat de onderwerpen met sommen delen: de vormen van een som, en een vaste
// willekeur om reeksen te genereren die altijd dezelfde blijven.

/**
 * Een som met een getal als antwoord. De vorm bepaalt hoe ze getoond wordt:
 * - tekst: "6 × 7" (de maaltafels);
 * - getalbeeld: vierkantjes op een tienveld van 2 × 5 (vanaf 11 twee
 *   tienvelden), liggend of `staand`; `evenTonen`: het beeld verdwijnt na een
 *   paar seconden;
 * - splitshuis: een dak met een getal en twee kamers, waarvan er één leeg is
 *   (null).
 */
export type Som =
  | { vorm: "tekst"; vraag: string; antwoord: number }
  | { vorm: "getalbeeld"; aantal: number; staand: boolean; evenTonen: boolean; antwoord: number }
  | { vorm: "splitshuis"; dak: number; links: number | null; rechts: number | null; antwoord: number };

export type TekstSom = Extract<Som, { vorm: "tekst" }>;

function zaad(tekst: string): number {
  let h = 2166136261;
  for (const c of tekst) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}

/** mulberry32: klein, snel en altijd dezelfde reeks getallen voor hetzelfde zaad. */
export function willekeur(tekst: string) {
  let a = zaad(tekst);
  const volgende = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    kies: <T,>(lijst: T[]): T => lijst[Math.floor(volgende() * lijst.length)],
    kans: (p: number) => volgende() < p,
    /** Een geschudde kopie van de lijst. */
    schud: <T,>(lijst: T[]): T[] => {
      const uit = [...lijst];
      for (let i = uit.length - 1; i > 0; i--) {
        const j = Math.floor(volgende() * (i + 1));
        [uit[i], uit[j]] = [uit[j], uit[i]];
      }
      return uit;
    },
  };
}

export type Willekeur = ReturnType<typeof willekeur>;
