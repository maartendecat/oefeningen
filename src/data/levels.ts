// De leesinhoud, in de volgorde van Veilig leren lezen (kim-versie).
//
// Elk level brengt één nieuwe klank (of bij de start een handvol). Een reeks
// telt altijd vijftien oefeningen en loopt op in moeilijkheid: eerst losse
// woordjes, dan een paar woorden samen, dan korte zinnetjes.
//
// Regels die de test in levels.test.ts bewaakt:
// - enkel kleine letters, als leesteken hoogstens . of ? op het einde;
// - elk woord gebruikt alleen klanken die op dat moment al gekend zijn;
// - elk woord heeft één klinker en nooit twee medeklinkers naast elkaar
//   (dus geen "kast" of "skip": clusters komen pas in kern 7).

export type Reeks = {
  id: string;
  oefeningen: string[];
};

export type Level = {
  id: string;
  kern: string;
  /** De klanken die in dit level nieuw zijn. */
  nieuw: string[];
  reeksen: Reeks[];
};

export const LEVELS: Level[] = [
  {
    id: "ikms",
    kern: "start",
    nieuw: ["i", "k", "m", "s"],
    reeksen: [
      {
        id: "ikms-1",
        oefeningen: [
          "ik", "is", "kim", "sim", "mis", "mik", "sik", "kik", "ik mik", "ik mis", "ik mis kim.",
          "ik mis sim.", "mis ik kim?", "mis ik sim?", "ik mis kim. ik mis sim.",
        ],
      },
      {
        id: "ikms-2",
        oefeningen: [
          "sim", "kim", "mik", "sik", "mis", "ik", "is", "kik", "mis ik", "ik mik.", "ik mis",
          "ik mis sim.", "mis ik kim?", "ik mis kim.", "ik mik. ik mis.",
        ],
      },
      {
        id: "ikms-3",
        oefeningen: [
          "ik", "is", "mis", "mik", "kim", "sik", "sim", "kik", "ik mik", "mis ik", "ik mis",
          "mis ik sim?", "ik mis kim.", "ik mis sim.", "ik mis sim. ik mis kim.",
        ],
      },
      {
        id: "ikms-4",
        oefeningen: [
          "sim", "kik", "sik", "kim", "mis", "ik", "is", "mik", "ik mis", "ik mik", "mis ik",
          "ik mis sim.", "mis ik kim?", "ik mik. ik mis.", "ik mis kim. mis ik sim?",
        ],
      },
    ],
  },
  {
    id: "p",
    kern: "kern 1",
    nieuw: ["p"],
    reeksen: [
      {
        id: "p-1",
        oefeningen: [
          "kip", "pim", "sip", "kim", "sim", "mis", "ik", "ik mis kip.", "pim is sip.", "is kip sip?",
          "ik mis pim.", "sim is sip.", "is pim sip?", "kim is sip.", "kip is sip. pim is sip.",
        ],
      },
      {
        id: "p-2",
        oefeningen: [
          "sip", "kip", "pim", "mis", "mik", "kim", "sim", "ik mik.", "kip is sip.", "is pim sip?",
          "mis ik kip?", "kim is sip.", "pim is sip.", "ik mis pim.", "ik mis kip. kip is sip.",
        ],
      },
      {
        id: "p-3",
        oefeningen: [
          "kip", "pim", "sip", "kim", "sim", "mis", "ik", "pim is sip.", "is kip sip?", "ik mis kip.",
          "mis ik pim?", "sim is sip.", "is kim sip?", "kip is sip. pim is sip.",
          "is pim sip? pim is sip.",
        ],
      },
      {
        id: "p-4",
        oefeningen: [
          "sip", "pim", "kip", "mis", "sik", "kim", "ik", "kim is sip.", "is sim sip?", "is pim sip?",
          "kip is sip.", "mis ik pim?", "ik mis pim. ik mis kip.", "sim is sip. kim is sip.",
          "ik mis kim. kim is sip.",
        ],
      },
    ],
  },
  {
    id: "aa",
    kern: "kern 1",
    nieuw: ["aa"],
    reeksen: [
      {
        id: "aa-1",
        oefeningen: [
          "aap", "aas", "kaas", "maak", "maas", "kaap", "kaak", "ik maak", "maak kaas", "aap is sip.",
          "ik mis kaas.", "is aap sip?", "ik maak kaas.", "pim is aap.", "ik maak kaas. aap is sip.",
        ],
      },
      {
        id: "aa-2",
        oefeningen: [
          "kaap", "kaak", "aap", "kaas", "pim", "maas", "aas", "maak kaas", "ik maak", "kim is aap.",
          "is kaas sip?", "ik mis aap.", "maak ik kaas?", "is pim aap?", "ik mis kaas. aap is sip.",
        ],
      },
      {
        id: "aa-3",
        oefeningen: [
          "maas", "aas", "kaas", "aap", "kaak", "kaap", "maak", "ik maak", "maak kaas", "sim is aap.",
          "is pim aap?", "ik mis kaas.", "maak ik kaas?", "kim is aap.", "aap is sip. ik mis aap.",
        ],
      },
      {
        id: "aa-4",
        oefeningen: [
          "aap", "kaas", "maas", "kaap", "aas", "maak", "kaak", "maak kaas", "ik maak", "ik mis kaas.",
          "is aap sip?", "sim is aap.", "ik maak kaas.", "ik mis aap. aap is sip.",
          "is kim aap? kim is aap.",
        ],
      },
    ],
  },
  {
    id: "r",
    kern: "kern 1",
    nieuw: ["r"],
    reeksen: [
      {
        id: "r-1",
        oefeningen: [
          "raam", "raap", "rik", "maar", "saar", "paar", "raak", "ik raak", "raak raam", "rik is sip.",
          "saar is aap.", "is saar sip?", "ik mis rik.", "ik maak raap.", "rik is sip maar saar is aap.",
        ],
      },
      {
        id: "r-2",
        oefeningen: [
          "paar", "raak", "rik", "raam", "saar", "raap", "maar", "maak raam", "raak maar", "ik raak kim.",
          "is rik aap?", "ik maak raap.", "saar is sip.", "maar ik mis saar.",
          "rik is aap maar kim is kip.",
        ],
      },
      {
        id: "r-3",
        oefeningen: [
          "maar", "raam", "raap", "paar", "rik", "saar", "raak", "raak maar", "maak maar", "saar is sip.",
          "maak maar kaas.", "ik raak raam.", "is rik sip?", "rik is aap maar saar is kip.",
          "ik mis saar maar ik mis rik.",
        ],
      },
      {
        id: "r-4",
        oefeningen: [
          "rik", "saar", "raam", "paar", "raak", "raap", "maar", "raak raam", "raak maar", "ik mis saar.",
          "is rik sip?", "maak maar kaas.", "ik maak raap.", "is saar aap? saar is aap.",
          "saar is aap maar rik is kip.",
        ],
      },
    ],
  },
  {
    id: "e",
    kern: "kern 1",
    nieuw: ["e"],
    reeksen: [
      {
        id: "e-1",
        oefeningen: [
          "mes", "rek", "rem", "sem", "es", "mep", "pek", "ik rem", "rem maar", "rek maar", "sem is sip.",
          "ik mis mes.", "is sem aap?", "ik mis sem.", "ik rem maar sem is sip.",
        ],
      },
      {
        id: "e-2",
        oefeningen: [
          "mep", "pek", "rek", "rem", "mes", "sem", "es", "ik rek", "raak mes", "ik rem", "is sem sip?",
          "ik raak sem.", "rem maar sem.", "sem is aap.", "sem is sip. ik mis sem.",
        ],
      },
      {
        id: "e-3",
        oefeningen: [
          "sem", "mes", "rem", "es", "rek", "mep", "pek", "rem maar", "ik rek", "raak mes", "ik maak rek.",
          "sem is aap.", "ik mis mes.", "saar is sip. ik mis sem.", "sem is kip maar kim is aap.",
        ],
      },
      {
        id: "e-4",
        oefeningen: [
          "rem", "sem", "mes", "pek", "es", "rek", "mep", "ik rek", "rem maar", "raak mes", "sem is sip.",
          "ik mis mes.", "is sem sip?", "ik maak rek. sem is sip.", "sem is aap maar rik is kip.",
        ],
      },
    ],
  },
  {
    id: "v",
    kern: "kern 1",
    nieuw: ["v"],
    reeksen: [
      {
        id: "v-1",
        oefeningen: [
          "vis", "vaas", "vaak", "vaar", "ver", "mes", "raam", "ik vis", "vaar maar", "ik vaar.",
          "vis maar", "ik mis vis.", "is vis sip?", "is vaas ver?", "ik vaar ver maar sem is sip.",
        ],
      },
      {
        id: "v-2",
        oefeningen: [
          "vis", "ver", "vaas", "vaak", "raam", "vaar", "rem", "raak vaas", "vis maar", "ik vaar",
          "is saar ver?", "ik vis vaak.", "ik vaar ver.", "ik mis vaak kaas.",
          "ik vis vaak maar ik mis vis.",
        ],
      },
      {
        id: "v-3",
        oefeningen: [
          "vaar", "ver", "vis", "vaas", "mes", "vaak", "raap", "vis maar", "ik vaar ver", "vaak vis ik.",
          "is vis kaas?", "vaar ik ver?", "ik mis vaas.", "ik vaar ver. is saar ver?",
          "sem is ver maar ik mis sem.",
        ],
      },
      {
        id: "v-4",
        oefeningen: [
          "vis", "vaas", "ver", "vaar", "vaak", "mes", "sem", "ik vis", "vis maar", "vaar maar",
          "is vaas ver?", "ik vaar ver.", "is sem ver?", "ik vaar vaak. is vis ver?",
          "sem is ver maar ik vaar.",
        ],
      },
    ],
  },
  {
    id: "n",
    kern: "kern 2",
    nieuw: ["n"],
    reeksen: [
      {
        id: "n-1",
        oefeningen: [
          "in", "en", "pen", "ren", "maan", "naam", "nek", "ik ren", "ren maar", "kim en sim.",
          "ik mis pen.", "ren naar kim.", "pen in vaas", "is maan ver?", "ik ren en ren naar maan.",
        ],
      },
      {
        id: "n-2",
        oefeningen: [
          "naam", "nek", "kin", "maan", "naar", "pen", "vin", "ik ren", "vis en kaas", "aap en kip",
          "is maan ver?", "ik mis pen.", "ik ren naar sem.", "ren maar naar rik.",
          "ik ren naar kim en sim.",
        ],
      },
      {
        id: "n-3",
        oefeningen: [
          "nep", "pin", "vin", "ren", "naam", "nek", "kin", "ren maar", "pen in vaas", "ren naar maan",
          "is naam kim?", "ik vis in maas.", "ik ren naar rik.", "is naam sem? naam is sem.",
          "ik ren naar maan maar maan is ver.",
        ],
      },
      {
        id: "n-4",
        oefeningen: [
          "naam", "maan", "pen", "nek", "ren", "in", "vin", "ren naar", "aap en kip", "is maan ver?",
          "ren naar saar.", "vis en kaas", "ik mis pen.", "ik ren en ren naar maan.",
          "ik ren naar sem en saar.",
        ],
      },
    ],
  },
  {
    id: "t",
    kern: "kern 2",
    nieuw: ["t"],
    reeksen: [
      {
        id: "t-1",
        oefeningen: [
          "tik", "tim", "pet", "net", "met", "tip", "vet", "ik tik", "met pet", "tik maar", "tim met pet.",
          "is tim sip?", "is pet vet?", "ik ren met tim.", "tim is sip maar ik ren.",
        ],
      },
      {
        id: "t-2",
        oefeningen: [
          "tip", "pit", "vet", "rit", "maat", "tim", "taak", "tik maar", "met pet", "vis in net",
          "kip is vet.", "is tim sip?", "ik tik met pen.", "tim is ver maar ik ren.",
          "ik vis met net in maas.",
        ],
      },
      {
        id: "t-3",
        oefeningen: [
          "taak", "maat", "tin", "net", "tim", "tip", "rit", "ik tik.", "ik tik", "pim en tim",
          "is pet vet?", "tim met pet.", "ik ren met tim naar maan.", "ik vis met net in maas.",
          "tim is sip. ik mis tim.",
        ],
      },
      {
        id: "t-4",
        oefeningen: [
          "tim", "pet", "tip", "net", "taak", "vet", "maat", "tik maar", "ik tik", "tim met pet",
          "is tim ver?", "kip is vet.", "ik tik met pen.", "tim en ik ren naar maan.",
          "ik ren met tim naar saar.",
        ],
      },
    ],
  },
  {
    id: "ee",
    kern: "kern 2",
    nieuw: ["ee"],
    reeksen: [
      {
        id: "ee-1",
        oefeningen: [
          "nee", "mee", "eet", "peer", "veer", "meer", "reep", "ik eet", "ren mee", "eet maar",
          "ik eet peer.", "kim eet kaas.", "is peer vet?", "tim eet reep.", "nee. ik eet peer.",
        ],
      },
      {
        id: "ee-2",
        oefeningen: [
          "meer", "veer", "teen", "reep", "neem", "nee", "keer", "neem mee", "eet maar", "ik eet",
          "tim eet reep.", "aap eet peer.", "ik eet vis.", "ik neem veer mee.",
          "saar eet peer. ik eet reep.",
        ],
      },
      {
        id: "ee-3",
        oefeningen: [
          "keer", "ree", "keek", "meer", "reep", "teen", "veer", "eet mee", "neem mee", "ree is ver.",
          "ik keek naar maan.", "ik keek naar ree.", "nee. ik eet reep.", "ik eet vis met mes.",
          "tim eet peer en ik eet reep.",
        ],
      },
      {
        id: "ee-4",
        oefeningen: [
          "eet", "peer", "reep", "teen", "mee", "nee", "meer", "eet maar", "ren mee", "ik eet reep.",
          "tim eet peer.", "neem maar peer.", "aap eet peer.", "ik eet peer en tim eet reep.",
          "ik keek naar ree. ree is ver.",
        ],
      },
    ],
  },
  {
    id: "b",
    kern: "kern 2",
    nieuw: ["b"],
    reeksen: [
      {
        id: "b-1",
        oefeningen: [
          "ben", "bes", "bek", "baas", "beer", "been", "baan", "ik ben", "ik ben kim.", "beer is sip.",
          "ben ik baas?", "beer eet bes.", "ik ben tim.", "is beer baas?",
          "beer eet bes maar aap eet peer.",
        ],
      },
      {
        id: "b-2",
        oefeningen: [
          "baan", "beet", "bit", "been", "ben", "bes", "beer", "ik ben", "baas ben ik", "ik ben tim.",
          "is beer baas?", "beer eet vis.", "beer is sip.", "aap beet in peer.",
          "ik ben baas en tim is beer.",
        ],
      },
      {
        id: "b-3",
        oefeningen: [
          "beer", "baas", "bes", "bek", "ben", "been", "beet", "ik ben", "ik ben baas", "beer eet reep.",
          "is saar baas?", "bes in bek.", "ben ik baas?", "beer eet bes. ik eet reep.",
          "ik ben aap maar tim is beer.",
        ],
      },
      {
        id: "b-4",
        oefeningen: [
          "beer", "baas", "bek", "bes", "baan", "ben", "been", "ik ben", "beer eet bes.", "ben ik baas?",
          "ik ben saar.", "baas ben ik", "beer eet vis.", "beer is baas maar aap is sip.",
          "ik ben tim en ik ben baas.",
        ],
      },
    ],
  },
  {
    id: "oo",
    kern: "kern 2",
    nieuw: ["oo"],
    reeksen: [
      {
        id: "oo-1",
        oefeningen: [
          "oor", "roos", "boot", "boom", "oom", "boon", "ook", "ik kook", "roos in vaas", "aap in boom",
          "ik ben boos.", "beer eet noot.", "ik eet ook.", "oom tim is boos.", "ik vaar met oom in boot.",
        ],
      },
      {
        id: "oo-2",
        oefeningen: [
          "rook", "kook", "poot", "noot", "boos", "boom", "oor", "ik kook", "kook maar", "ik kook vis.",
          "aap eet noot.", "roos in vaas", "ik ren naar boot.", "oom toon is boos.",
          "ik kook vis en oom eet mee.",
        ],
      },
      {
        id: "oo-3",
        oefeningen: [
          "boom", "boot", "toon", "poot", "oom", "boon", "rook", "ik kook", "is boom ver?",
          "roos in vaas.", "ik mis oom toon.", "ik eet ook boon.", "ik vaar met oom in boot.",
          "beer is boos maar aap is sip.", "aap is in boom en beer is in boot.",
        ],
      },
      {
        id: "oo-4",
        oefeningen: [
          "roos", "boot", "oor", "noot", "poot", "boos", "kook", "ik kook", "boom en roos", "ik kook vis.",
          "is oom boos?", "aap in boom.", "beer eet noot.", "ik vaar met oom toon in boot.",
          "oom toon is boos maar ik ben ook boos.",
        ],
      },
    ],
  },
];

export type ReeksPlek = {
  reeks: Reeks;
  level: Level;
  /** Positie over alle levels heen, vanaf 0. */
  index: number;
};

/** Alle reeksen achter elkaar, in speelvolgorde. */
export const ALLE_REEKSEN: ReeksPlek[] = LEVELS.flatMap((level) =>
  level.reeksen.map((reeks) => ({ reeks, level })),
).map((plek, index) => ({ ...plek, index }));

export function vindReeks(id: string): ReeksPlek | undefined {
  return ALLE_REEKSEN.find((p) => p.reeks.id === id);
}

/** Alle klanken die gekend zijn na het level met deze index. */
export function gekendeKlanken(levelIndex: number): Set<string> {
  return new Set(LEVELS.slice(0, levelIndex + 1).flatMap((l) => l.nieuw));
}
