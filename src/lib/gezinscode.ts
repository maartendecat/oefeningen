// De gezinscode koppelt een toestel aan de voortgang op de server, bv.
// "roos-maan-vis-482". Leesbaar genoeg om over te typen, en met drie
// woorden uit honderd plus drie cijfers (een miljard mogelijkheden) niet
// te raden.

const WOORDEN = [
  "aap", "appel", "bal", "banaan", "beer", "bes", "bij", "blad", "bloem", "boom",
  "boot", "bos", "brood", "burcht", "cactus", "dak", "das", "deur", "dino", "draak",
  "duif", "eend", "egel", "eiland", "ezel", "fee", "fiets", "gans", "geit", "gitaar",
  "haas", "hart", "hert", "hond", "honing", "huis", "ijs", "jas", "kaas", "kam",
  "kasteel", "kat", "kers", "kip", "koe", "koek", "kroon", "kus", "lamp", "leeuw",
  "lente", "maan", "meer", "melk", "mier", "mol", "muis", "mus", "noot", "oma",
  "opa", "otter", "paard", "panda", "parel", "peer", "pen", "piano", "pinguin", "pizza",
  "raket", "regen", "reus", "ring", "roos", "sneeuw", "sok", "specht", "spin", "ster",
  "strand", "taart", "tijger", "tulp", "uil", "vaas", "vis", "vlag", "vlinder", "vos",
  "wafel", "walvis", "wolk", "worm", "zebra", "zee", "zon", "zwaan", "zwaard", "zomer",
];

const PATROON = /^[a-z]+-[a-z]+-[a-z]+-\d{3}$/;

function willekeurig(max: number): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;
}

export function nieuweCode(): string {
  const woorden = [0, 1, 2].map(() => WOORDEN[willekeurig(WOORDEN.length)]);
  const getal = String(willekeurig(1000)).padStart(3, "0");
  return [...woorden, getal].join("-");
}

/** Maakt een ingetypte code netjes: kleine letters, spaties of punten worden streepjes. */
export function normaliseer(invoer: string): string {
  return invoer
    .trim()
    .toLowerCase()
    .replace(/[\s._]+/g, "-")
    .replace(/-+/g, "-");
}

export function isGeldigeCode(code: string): boolean {
  return code.length <= 60 && PATROON.test(code);
}
