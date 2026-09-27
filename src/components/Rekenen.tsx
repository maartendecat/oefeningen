"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/avatar/Avatar";
import type { Stemming } from "@/avatar/Pop";
import { somReeks } from "@/data/onderwerpen";
import { klik, nogEens, pling } from "@/lib/geluid";
import { reeksKlaar, type Spel } from "@/lib/state";
import type { Scherm } from "./App";
import { Vink } from "./Icoon";

const MAX_CIJFERS = 3;
/** Na zoveel foute pogingen toont de app het juiste antwoord. */
const MAX_FOUT = 2;

/**
 * Sommen oefenen: het kind tikt het antwoord in en de app kijkt zelf na.
 * Fout: nog eens proberen. Twee keer fout: de app toont het juiste antwoord
 * en de som komt achteraan de reeks terug. De reeks is klaar als elke som
 * een keer juist beantwoord is.
 */
export function Rekenen({ spel, reeksId, ga }: { spel: Spel; reeksId: string; ga: (s: Scherm) => void }) {
  const reeks = somReeks(reeksId);
  // Welke sommen nog aan de beurt komen (indexen), en waar we zitten.
  const [wachtrij, zetWachtrij] = useState(() => reeks?.oefeningen.map((_, i) => i) ?? []);
  const [plek, zetPlek] = useState(0);
  const [goed, zetGoed] = useState<Set<number>>(() => new Set());
  const [invoer, zetInvoer] = useState("");
  const [fouten, zetFouten] = useState(0);
  const [toon, zetToon] = useState<"juist" | "hulp" | null>(null);
  const [schud, zetSchud] = useState(0);

  // Het maatje: blij bij een juist antwoord, even "pfff" bij een fout.
  const [stemming, zetStemming] = useState<Stemming>("rust");
  const [puls, zetPuls] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (f: () => void, ms: number) => timers.current.push(setTimeout(f, ms));
  const reageer = (nieuw: Stemming, duur: number) => {
    zetStemming(nieuw);
    zetPuls((n) => n + 1);
    later(() => zetStemming("rust"), duur);
  };

  const huidig = wachtrij[plek];
  const som = reeks?.oefeningen[huidig];

  const volgende = (nieuweWachtrij: number[], nieuwGoed: Set<number>) => {
    zetInvoer("");
    zetFouten(0);
    zetToon(null);
    if (plek + 1 < nieuweWachtrij.length) {
      zetPlek(plek + 1);
      return;
    }
    // Alles juist beantwoord: naar de beloning.
    if (reeks && nieuwGoed.size === reeks.oefeningen.length) {
      const eerste = !spel.klaar.includes(reeksId);
      reeksKlaar(reeksId);
      ga({ naam: "beloning", reeks: reeksId, eerste });
    }
  };

  const kijkNa = () => {
    if (!som || toon || invoer === "") return;
    if (Number(invoer) === som.antwoord) {
      if (!spel.stil) pling();
      reageer("blij", 900);
      const nieuwGoed = new Set(goed).add(huidig);
      zetGoed(nieuwGoed);
      zetToon("juist");
      later(() => volgende(wachtrij, nieuwGoed), 650);
      return;
    }
    if (!spel.stil) nogEens();
    zetSchud((n) => n + 1);
    if (fouten + 1 < MAX_FOUT) {
      zetFouten(fouten + 1);
      zetInvoer("");
      reageer("zwaar", 1800);
      return;
    }
    // Twee keer fout: toon het juiste antwoord, en de som komt later terug.
    reageer("verrast", 1400);
    zetToon("hulp");
    zetInvoer(String(som.antwoord));
    const nieuweWachtrij = [...wachtrij, huidig];
    zetWachtrij(nieuweWachtrij);
    later(() => volgende(nieuweWachtrij, goed), 2600);
  };

  const tik = (cijfer: string) => {
    if (toon) return;
    if (!spel.stil) klik();
    zetInvoer((i) => (i.length < MAX_CIJFERS ? (i === "0" ? cijfer : i + cijfer) : i));
  };
  const wis = () => {
    if (toon) return;
    zetInvoer((i) => i.slice(0, -1));
  };

  // Ook met het toetsenbord, voor wie op een computer oefent.
  const toetsen = useRef({ tik, wis, kijkNa });
  useEffect(() => {
    toetsen.current = { tik, wis, kijkNa };
  });
  useEffect(() => {
    const opToets = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) toetsen.current.tik(e.key);
      else if (e.key === "Backspace") toetsen.current.wis();
      else if (e.key === "Enter") toetsen.current.kijkNa();
    };
    window.addEventListener("keydown", opToets);
    return () => window.removeEventListener("keydown", opToets);
  }, []);

  if (!reeks || !som) {
    return (
      <main className="scherm">
        <button className="groot-knop" onClick={() => ga({ naam: "kaart" })}>🏠</button>
      </main>
    );
  }

  return (
    <main className="scherm rekenen">
      <header className="balk">
        <button className="knop-rond" onClick={() => ga({ naam: "kaart" })} aria-label="terug">
          ✖
        </button>
        <div className="voortgang" aria-label={`${goed.size} van ${reeks.oefeningen.length}`}>
          {reeks.oefeningen.map((_, i) => (
            <span key={i} className={`stip ${goed.has(i) ? "gedaan" : ""} ${i === huidig ? "nu" : ""}`} />
          ))}
        </div>
        <span className="knop-plek" />
      </header>

      <div className="som-vak">
        <div className="rekenmaatje" aria-hidden="true">
          <Avatar key={puls} spel={spel} stemming={stemming} kader="portret" />
        </div>
        <div key={`${plek}-${schud}`} className={`lees-kaart som-kaart ${schud ? "schud" : ""}`}>
          <p className="somtekst">
            <span>{som.vraag}</span> <span className="is">=</span>{" "}
            <span className={`antwoord ${toon ?? ""} ${invoer ? "" : "leeg"}`}>{invoer || "?"}</span>
          </p>
          {toon === "hulp" && <p className="som-hulp">kijk goed: deze som komt straks nog eens terug</p>}
        </div>
      </div>

      <div className="klavier" role="group" aria-label="cijfers">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((c) => (
          <button key={c} className="toets" onClick={() => tik(c)} disabled={!!toon}>
            {c}
          </button>
        ))}
        <button className="toets wis" onClick={wis} disabled={!!toon || !invoer} aria-label="wissen">
          ⌫
        </button>
        <button className="toets" onClick={() => tik("0")} disabled={!!toon}>
          0
        </button>
        <button className="toets klaar" onClick={kijkNa} disabled={!!toon || !invoer} aria-label="klaar">
          <Vink />
        </button>
      </div>
    </main>
  );
}
