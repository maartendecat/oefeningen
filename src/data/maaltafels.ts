// De maaltafels voor het derde leerjaar: 11 levels van 4 reeksen, elk 15
// sommen. Elk level brengt een nieuwe tafel; de reeksen mengen die met de
// tafels die al gekend zijn, en worden moeilijker naar het einde toe. Vanaf de
// tweede reeks van een level komt de deeltafel erbij. Het laatste level gaat
// boven de 100.
//
// De sommen worden gegenereerd met een vaste willekeur per reeks: dezelfde
// reeks bestaat dus altijd uit dezelfde sommen. Zie maaltafels.test.ts voor
// wat er bewaakt wordt, en docs/leerjaren.md voor het ontwerp.

export type Som = {
  /** Zoals ze getoond wordt: "6 × 7" of "42 : 6". */
  vraag: string;
  antwoord: number;
};

export type TafelLevel = {
  id: string;
  /** Wat er op de tegel van de levelkaart staat. */
  tegels: string[];
  reeksen: { id: string; oefeningen: Som[] }[];
};

const PER_REEKS = 15;

// ---- Vaste willekeur ---------------------------------------------------------

function zaad(tekst: string): number {
  let h = 2166136261;
  for (const c of tekst) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}

/** mulberry32: klein, snel en altijd dezelfde reeks getallen voor hetzelfde zaad. */
function willekeur(tekst: string) {
  let a = zaad(tekst);
  const volgende = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    getal: (van: number, tot: number) => van + Math.floor(volgende() * (tot - van + 1)),
    kies: <T,>(lijst: T[]): T => lijst[Math.floor(volgende() * lijst.length)],
    kans: (p: number) => volgende() < p,
  };
}

// ---- Sommen ------------------------------------------------------------------

const maal = (a: number, b: number): Som => ({ vraag: `${a} × ${b}`, antwoord: a * b });
const deel = (product: number, a: number): Som => ({ vraag: `${product} : ${a}`, antwoord: product / a });

/** Hoe moeilijk een som is, om een reeks van makkelijk naar moeilijk te zetten. */
function moeilijkheid(s: Som): number {
  const getallen = s.vraag.split(/ [×:] /).map(Number);
  const makkelijk = (n: number) => [0, 1, 2, 5, 10].includes(n);
  let m = s.vraag.includes(":") ? 6 : 0;
  m += getallen.filter((n) => !makkelijk(n)).length * 2;
  m += Math.min(4, Math.log10(Math.max(1, s.antwoord)) * 1.5);
  return m;
}

type Bron = {
  /** De tafel, en welke vermenigvuldigers (1-10) meedoen. */
  tafel: number;
  factoren: number[];
  deel: boolean;
};

function trekSom(r: ReturnType<typeof willekeur>, bron: Bron): Som {
  const f = r.kies(bron.factoren);
  if (bron.deel && f !== 0) return deel(bron.tafel * f, bron.tafel);
  // "3 × 4" en "4 × 3" zijn allebei de tafel van 4.
  return r.kans(0.5) ? maal(f, bron.tafel) : maal(bron.tafel, f);
}

const EEN_TOT_TIEN = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const MOEILIJK = [6, 7, 8, 9];

/**
 * Een reeks van 15 verschillende sommen: `aantal` uit elke bron (samen 15),
 * gesorteerd van makkelijk naar moeilijk.
 */
function reeks(id: string, delen: [Bron | Bron[], number][]): { id: string; oefeningen: Som[] } {
  const r = willekeur(id);
  const gezien = new Set<string>();
  const sommen: Som[] = [];
  for (const [bron, aantal] of delen) {
    const bronnen = Array.isArray(bron) ? bron : [bron];
    let gevonden = 0;
    for (let poging = 0; gevonden < aantal && poging < 500; poging++) {
      const som = trekSom(r, r.kies(bronnen));
      if (gezien.has(som.vraag)) continue;
      gezien.add(som.vraag);
      sommen.push(som);
      gevonden++;
    }
  }
  if (sommen.length !== PER_REEKS) throw new Error(`reeks ${id} heeft ${sommen.length} sommen`);
  sommen.sort((a, b) => moeilijkheid(a) - moeilijkheid(b));
  // Altijd beginnen met een maalsom, ook als er een heel makkelijke deling is.
  const eersteMaal = sommen.findIndex((s) => s.vraag.includes("×"));
  if (eersteMaal > 0) sommen.unshift(...sommen.splice(eersteMaal, 1));
  return { id, oefeningen: sommen };
}

const tafels = (lijst: number[], opties: { factoren?: number[]; deel?: boolean } = {}): Bron[] =>
  lijst.map((tafel) => ({ tafel, factoren: opties.factoren ?? EEN_TOT_TIEN, deel: opties.deel ?? false }));

// ---- De levels ---------------------------------------------------------------

/** Volgorde van de tafels: van makkelijk naar moeilijk, en een tafel na zijn "helft". */
const VOLGORDE: { nieuw: number[]; tegels: string[] }[] = [
  { nieuw: [1, 10], tegels: ["×1", "×10"] },
  { nieuw: [2], tegels: ["×2"] },
  { nieuw: [5], tegels: ["×5"] },
  { nieuw: [4], tegels: ["×4"] },
  { nieuw: [3], tegels: ["×3"] },
  { nieuw: [6], tegels: ["×6"] },
  { nieuw: [9], tegels: ["×9"] },
  { nieuw: [8], tegels: ["×8"] },
  { nieuw: [7], tegels: ["×7"] },
];

function tafelLevel(index: number): TafelLevel {
  const { nieuw, tegels } = VOLGORDE[index];
  const oud = VOLGORDE.slice(0, index).flatMap((v) => v.nieuw);
  const id = `tafel-${nieuw.join("-")}`;
  const n = (d: number) => `${id}-${d}`;

  // In het eerste level is er nog niets ouds: dan komt ×0 erbij, en voor de
  // rest herhaalt het de nieuwe tafels.
  const nul: Bron = { tafel: 0, factoren: [1, 2, 3, 5, 7, 9], deel: false };
  const herhaal = oud.length ? oud : nieuw;
  const oudMaal: Bron[] = oud.length ? tafels(oud) : [nul];
  const oudGemengd: Bron[] = [...tafels(herhaal), ...tafels(herhaal, { deel: true }), ...(oud.length ? [] : [nul])];
  const oudMoeilijk: Bron[] = [...tafels(herhaal, { factoren: MOEILIJK }), ...tafels(herhaal, { factoren: MOEILIJK, deel: true })];

  return {
    id,
    tegels,
    reeksen: [
      reeks(n(1), [[tafels(nieuw), 11], [oudMaal, 4]]),
      reeks(n(2), [[tafels(nieuw), 6], [tafels(nieuw, { deel: true }), 6], [oudMaal, 3]]),
      reeks(n(3), [[tafels(nieuw), 5], [tafels(nieuw, { deel: true }), 4], [oudGemengd, 6]]),
      reeks(n(4), [
        [tafels(nieuw, { factoren: [3, 4, 6, 7, 8, 9] }), 3],
        [tafels(nieuw, { factoren: [3, 4, 6, 7, 8, 9], deel: true }), 3],
        [oudMoeilijk, 9],
      ]),
    ],
  };
}

const ALLE_TAFELS = VOLGORDE.flatMap((v) => v.nieuw);

/** Alles door elkaar, vooral de moeilijke sommen. */
const GEMENGD: TafelLevel = {
  id: "tafel-mix",
  tegels: ["mix"],
  reeksen: [
    reeks("tafel-mix-1", [[tafels(ALLE_TAFELS), 9], [tafels(ALLE_TAFELS, { deel: true }), 6]]),
    reeks("tafel-mix-2", [[tafels(MOEILIJK, { factoren: MOEILIJK }), 9], [tafels(ALLE_TAFELS, { deel: true }), 6]]),
    reeks("tafel-mix-3", [[tafels(MOEILIJK, { factoren: MOEILIJK }), 7], [tafels(MOEILIJK, { factoren: MOEILIJK, deel: true }), 8]]),
    reeks("tafel-mix-4", [
      [tafels(ALLE_TAFELS, { factoren: MOEILIJK }), 8],
      [tafels(ALLE_TAFELS, { factoren: MOEILIJK, deel: true }), 7],
    ]),
  ],
};

/** Boven de 100: ×11 en ×12, en tientallen maal een getal. */
const TIENTALLEN: Bron[] = [20, 30, 40, 50].map((tafel) => ({ tafel, factoren: [2, 3, 4, 5, 6, 7, 8, 9], deel: false }));

const BOVEN_HONDERD: TafelLevel = {
  id: "tafel-100",
  tegels: ["100+"],
  reeksen: [
    reeks("tafel-100-1", [[tafels([11]), 8], [tafels([12], { factoren: [1, 2, 3, 4, 5, 10] }), 4], [tafels(MOEILIJK), 3]]),
    reeks("tafel-100-2", [[tafels([11, 12]), 7], [tafels([11, 12], { deel: true }), 5], [tafels(MOEILIJK, { deel: true }), 3]]),
    reeks("tafel-100-3", [[TIENTALLEN, 8], [tafels([12], { factoren: [6, 7, 8, 9, 10, 11, 12] }), 7]]),
    reeks("tafel-100-4", [
      [tafels([11, 12], { factoren: [8, 9, 10, 11, 12] }), 5],
      [TIENTALLEN, 4],
      [tafels([11, 12], { deel: true }), 3],
      [tafels(MOEILIJK, { factoren: MOEILIJK, deel: true }), 3],
    ]),
  ],
};

export const TAFEL_LEVELS: TafelLevel[] = [...VOLGORDE.map((_, i) => tafelLevel(i)), GEMENGD, BOVEN_HONDERD];
