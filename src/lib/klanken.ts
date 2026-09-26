// Klanken zoals ze in Veilig leren lezen aangeleerd worden. Een woord wordt
// gehakt in de langst mogelijke klank: "kaas" is k-aa-s, niet k-a-a-s.

const MEERLETTERIG = [
  "sch",
  "aa", "ee", "oo", "uu",
  "oe", "ie", "eu", "ui", "ou", "au", "ei", "ij",
  "ch", "ng",
];

const KLINKERS = new Set([
  "a", "e", "i", "o", "u",
  "aa", "ee", "oo", "uu",
  "oe", "ie", "eu", "ui", "ou", "au", "ei", "ij",
]);

export function isKlinker(klank: string): boolean {
  return KLINKERS.has(klank);
}

/** Hakt één woord (zonder spaties of leestekens) in klanken. */
export function hak(woord: string): string[] {
  const klanken: string[] = [];
  let i = 0;
  while (i < woord.length) {
    const lang = MEERLETTERIG.find((k) => woord.startsWith(k, i));
    const klank = lang ?? woord[i];
    klanken.push(klank);
    i += klank.length;
  }
  return klanken;
}

/** Splitst een oefening in woorden, met het leesteken los erachter. */
export function woorden(tekst: string): string[] {
  return tekst.split(" ").filter(Boolean);
}

/** Het woord zonder een eventueel leesteken op het einde. */
export function kaal(woord: string): string {
  return woord.replace(/[.?]$/, "");
}
