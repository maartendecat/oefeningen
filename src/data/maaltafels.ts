// De maaltafels voor het derde leerjaar: 11 levels van 4 reeksen, elk 15
// sommen. Het is herhaling: alle tafels zijn al gekend uit het tweede
// leerjaar. Daarom mengt elke reeks de tafels, en wordt het snel moeilijker:
//
//   1. de lagere tafels (2, 3, 4, 5, 10), maal en gedeeld door;
//   2. de moeilijke tafels (6, 7, 8, 9); vanaf reeks 8 gaat het boven de tien;
//   3. daarna rekenwerk dat op de tafels steunt: ×11 en ×12, tientallen,
//      tweecijferig maal eencijferig, grotere delingen, honderdtallen;
//   4. op het einde alles door elkaar.
//
// Elke reeks herhaalt ook wat de vorige levels brachten. Antwoorden blijven
// onder de 1000 (getallen tot 1000 in het derde leerjaar).
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
const MAX_ANTWOORD = 999;

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
    kies: <T,>(lijst: T[]): T => lijst[Math.floor(volgende() * lijst.length)],
    kans: (p: number) => volgende() < p,
  };
}

type Willekeur = ReturnType<typeof willekeur>;

// ---- Sommen ------------------------------------------------------------------

/** Een getal waardoor een derdeklasser kan delen: tot 12, een tiental (40) of een honderdtal (300). */
const eenvoudigeDeler = (n: number) => n <= 12 || (n % 10 === 0 && n < 100) || n % 100 === 0;

/**
 * a × b, of (met kans `deel`) de deling die erbij hoort: a·b : a of a·b : b.
 * Delen gebeurt altijd door een eenvoudig getal: 216 : 6, nooit 216 : 36.
 * Bij een maalsom staat het grote getal even vaak voor als achter.
 */
function som(r: Willekeur, a: number, b: number, deel: number): Som {
  const product = a * b;
  if (r.kans(deel) && a !== 0 && b !== 0) {
    const delers = [a, b].filter(eenvoudigeDeler);
    const deler = delers.length ? r.kies(delers) : Math.min(a, b);
    return { vraag: `${product} : ${deler}`, antwoord: product / deler };
  }
  return r.kans(0.5) ? { vraag: `${a} × ${b}`, antwoord: product } : { vraag: `${b} × ${a}`, antwoord: product };
}

/** Maakt één som; `deel` is de kans op een deling. */
type Maker = (r: Willekeur, deel: number) => Som;

const van = (begin: number, einde: number, stap = 1) =>
  Array.from({ length: Math.floor((einde - begin) / stap) + 1 }, (_, i) => begin + i * stap);

const EEN_TOT_TIEN = van(1, 10);
const LAGE_TAFELS = [2, 3, 4, 5, 10];
const HOGE_TAFELS = [6, 7, 8, 9];
const TWEE_TOT_NEGEN = van(2, 9);

/** Tweecijferige getallen zonder de tientallen (die hebben hun eigen level). */
const tweecijferig = (begin: number, einde: number) => van(begin, einde).filter((n) => n % 10 !== 0);

/** Een getal uit `getallen` maal een getal uit `factoren`, niet boven de 999. */
function maal(getallen: number[], factoren: number[]): Maker {
  return (r, deel) => {
    for (;;) {
      const a = r.kies(getallen);
      const b = r.kies(factoren);
      if (a * b <= MAX_ANTWOORD) return som(r, a, b, deel);
    }
  };
}

/** Een deling met een eencijferige deler en een uitkomst uit `uitkomsten` (96 : 8). */
function deling(uitkomsten: number[], delers: number[]): Maker {
  return (r) => {
    const a = r.kies(uitkomsten);
    const b = r.kies(delers);
    return { vraag: `${a * b} : ${b}`, antwoord: a };
  };
}

/** Kiest telkens een van deze makers. */
const gemengd =
  (...makers: Maker[]): Maker =>
  (r, deel) =>
    r.kies(makers)(r, deel);

// ---- Wat elk level brengt -------------------------------------------------------

type LevelSoort = {
  id: string;
  tegels: string[];
  /** Het nieuwe van dit level, en een moeilijkere versie voor de latere reeksen. */
  nieuw: Maker;
  moeilijk: Maker;
};

const SOORTEN: LevelSoort[] = [
  {
    id: "tafel-1",
    tegels: ["2 3 4 5"],
    nieuw: maal(LAGE_TAFELS, EEN_TOT_TIEN),
    moeilijk: maal(LAGE_TAFELS, HOGE_TAFELS),
  },
  {
    id: "tafel-2",
    tegels: ["6 7 8 9"],
    nieuw: maal(HOGE_TAFELS, EEN_TOT_TIEN),
    moeilijk: maal(HOGE_TAFELS, HOGE_TAFELS),
  },
  {
    id: "tafel-3",
    tegels: ["11 12"],
    nieuw: maal([11, 12], van(2, 10)),
    moeilijk: maal([11, 12], van(6, 12)),
  },
  {
    id: "tafel-4",
    tegels: ["40×7"],
    nieuw: maal(van(20, 90, 10), TWEE_TOT_NEGEN),
    moeilijk: maal(van(40, 90, 10), HOGE_TAFELS),
  },
  {
    id: "tafel-5",
    tegels: ["15×4"],
    nieuw: maal(tweecijferig(13, 19), [2, 3, 4, 5]),
    moeilijk: maal(tweecijferig(13, 19), TWEE_TOT_NEGEN),
  },
  {
    id: "tafel-6",
    tegels: ["23×4"],
    nieuw: maal(tweecijferig(21, 49), [2, 3, 4, 5]),
    moeilijk: maal(tweecijferig(21, 49), HOGE_TAFELS),
  },
  {
    id: "tafel-7",
    tegels: ["96:8"],
    nieuw: deling(tweecijferig(11, 19), TWEE_TOT_NEGEN),
    moeilijk: deling(tweecijferig(13, 29), HOGE_TAFELS),
  },
  {
    id: "tafel-8",
    tegels: ["300×3"],
    nieuw: maal(van(100, 400, 100), [2, 3]),
    moeilijk: gemengd(maal(van(100, 400, 100), TWEE_TOT_NEGEN), maal([120, 150, 160, 240, 250], [2, 3, 4])),
  },
  {
    id: "tafel-9",
    tegels: ["20×30"],
    nieuw: maal(van(10, 50, 10), van(10, 30, 10)),
    moeilijk: gemengd(maal(van(20, 90, 10), van(20, 40, 10)), maal(van(110, 190, 10), [2, 3, 4, 5])),
  },
  {
    id: "tafel-10",
    tegels: ["mix"],
    nieuw: gemengd(maal(HOGE_TAFELS, HOGE_TAFELS), maal([11, 12], van(6, 12)), maal(tweecijferig(13, 49), HOGE_TAFELS)),
    moeilijk: gemengd(maal(tweecijferig(51, 99), TWEE_TOT_NEGEN), maal(van(40, 90, 10), van(20, 30, 10))),
  },
  {
    id: "tafel-11",
    tegels: ["top"],
    nieuw: gemengd(maal(tweecijferig(51, 99), HOGE_TAFELS), maal([12], van(9, 12)), deling(tweecijferig(21, 49), HOGE_TAFELS)),
    moeilijk: gemengd(maal(tweecijferig(61, 99), HOGE_TAFELS), maal(tweecijferig(101, 199), [2, 3, 4])),
  },
];

// ---- Reeksen -------------------------------------------------------------------

/** Hoe moeilijk een som is, om een reeks van makkelijk naar moeilijk te zetten. */
function moeilijkheid(s: Som): number {
  const getallen = s.vraag.split(/ [×:] /).map(Number);
  const makkelijk = (n: number) => [0, 1, 2, 5, 10].includes(n);
  let m = s.vraag.includes(":") ? 6 : 0;
  m += getallen.filter((n) => !makkelijk(n)).length * 2;
  m += Math.min(6, Math.log10(Math.max(1, s.antwoord)) * 2);
  return m;
}

/** Een reeks van 15 verschillende sommen: [maker, aantal, kans op deling], van makkelijk naar moeilijk. */
function reeks(id: string, delen: [Maker, number, number][]): { id: string; oefeningen: Som[] } {
  const r = willekeur(id);
  const gezien = new Set<string>();
  const sommen: Som[] = [];
  // 20 × 30 en 30 × 20 tellen als dezelfde som.
  const sleutel = (s: Som) =>
    s.vraag.includes("×") ? s.vraag.split(" × ").map(Number).sort((x, y) => x - y).join("×") : s.vraag;
  for (const [maker, aantal, deel] of delen) {
    let gevonden = 0;
    for (let poging = 0; gevonden < aantal && poging < 1000; poging++) {
      const s = maker(r, deel);
      if (gezien.has(sleutel(s))) continue;
      gezien.add(sleutel(s));
      sommen.push(s);
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

function maakLevel(index: number): TafelLevel {
  const { id, tegels, nieuw, moeilijk } = SOORTEN[index];
  const vorige = SOORTEN.slice(0, index);
  // Herhaling van alles wat de vorige levels brachten.
  const herhaal = vorige.length ? gemengd(...vorige.map((v) => v.moeilijk)) : moeilijk;
  const herhaalMakkelijk = vorige.length ? gemengd(...vorige.map((v) => v.nieuw)) : nieuw;
  const n = (d: number) => `${id}-${d}`;

  // Reeks 8 (de laatste van het tweede level) gaat voor het eerst boven de tien.
  const bovenTien: [Maker, number, number][] = index === 1 ? [[maal([11], TWEE_TOT_NEGEN), 4, 0.25]] : [];
  const extra = bovenTien.reduce((t, [, aantal]) => t + aantal, 0);

  return {
    id,
    tegels,
    reeksen: [
      reeks(n(1), [[nieuw, 11, index === 0 ? 0 : 0.2], [herhaalMakkelijk, 4, 0.3]]),
      reeks(n(2), [[nieuw, 9, 0.5], [herhaal, 6, 0.4]]),
      reeks(n(3), [[moeilijk, 8, 0.4], [herhaal, 7, 0.5]]),
      reeks(n(4), [[moeilijk, 11 - extra, 0.5], ...bovenTien, [herhaal, 4, 0.5]]),
    ],
  };
}

export const TAFEL_LEVELS: TafelLevel[] = SOORTEN.map((_, i) => maakLevel(i));
