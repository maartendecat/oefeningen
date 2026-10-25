"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/avatar/Avatar";
import type { Stemming } from "@/avatar/Pop";
import { somReeks } from "@/data/onderwerpen";
import { klik, nogEens, pling } from "@/lib/geluid";
import { reeksKlaar, type Spel } from "@/lib/state";
import type { Scherm } from "./App";
import { Vink } from "./Icoon";
import { Splitshuis, Tienveld } from "./Splitshuis";

/** Na zoveel foute pogingen toont de app het juiste antwoord. */
const MAX_FOUT = 2;
/** Zo lang blijft een getalbeeld staan dat maar even getoond wordt. */
const EVEN_TONEN_MS = 2000;
/** Tot dit antwoord volstaat één rij grote knoppen (één tik is het antwoord). */
const KLEIN_KLAVIER_TOT = 10;

/**
 * Sommen oefenen: het kind tikt het antwoord in en de app kijkt zelf na. Een
 * som is tekst (6 × 7), een getalbeeld of een splitshuis (zie sommen.ts).
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
  const grootste = Math.max(0, ...(reeks?.oefeningen.map((s) => s.antwoord) ?? []));
  const maxCijfers = String(grootste).length;
  const kleinKlavier = grootste <= KLEIN_KLAVIER_TOT;

  // Een getalbeeld dat maar even getoond wordt, verdwijnt na een tijdje (bij
  // de oefening op plek `verstopt`); na een fout komt het terug.
  const [verstopt, zetVerstopt] = useState<number | null>(null);
  useEffect(() => {
    if (som?.vorm !== "getalbeeld" || !som.evenTonen) return;
    const t = setTimeout(() => zetVerstopt(plek), EVEN_TONEN_MS);
    return () => clearTimeout(t);
  }, [plek, som]);

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

  const kijkNa = (waarde = invoer) => {
    if (!som || toon || waarde === "") return;
    zetInvoer(waarde);
    if (Number(waarde) === som.antwoord) {
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
    zetVerstopt(null);
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
    zetInvoer((i) => (i.length < maxCijfers ? (i === "0" ? cijfer : i + cijfer) : i));
  };
  const wis = () => {
    if (toon) return;
    zetInvoer((i) => i.slice(0, -1));
  };

  // Ook met het toetsenbord, voor wie op een computer oefent.
  const toetsen = useRef({ tik, wis, kijkNa: () => kijkNa() });
  useEffect(() => {
    toetsen.current = { tik, wis, kijkNa: () => kijkNa() };
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

  const maatje = <Avatar key={puls} spel={spel} stemming={stemming} kader="portret" />;
  const antwoord = <span className={`antwoord ${toon ?? ""} ${invoer ? "" : "leeg"}`}>{invoer || "?"}</span>;

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
        {/* In een splitshuis woont het maatje in de middelste kamer. */}
        {som.vorm !== "splitshuis" && <div className="rekenmaatje" aria-hidden="true">{maatje}</div>}
        <div key={`${plek}-${schud}`} className={`lees-kaart som-kaart som-${som.vorm} ${schud ? "schud" : ""}`}>
          {som.vorm === "splitshuis" ? (
            <Splitshuis som={som} antwoord={antwoord} bewoner={maatje} />
          ) : som.vorm === "getalbeeld" ? (
            <div className={`getalbeeld ${som.staand ? "staand" : ""}`}>
              <Tienveld aantal={som.aantal} staand={som.staand} verborgen={verstopt === plek} />
              <p className="somtekst">
                <span className="is">=</span> {antwoord}
              </p>
            </div>
          ) : (
            <p className="somtekst">
              <span>{som.vraag}</span> <span className="is">=</span> {antwoord}
            </p>
          )}
          {toon === "hulp" && <p className="som-hulp">kijk goed: deze som komt straks nog eens terug</p>}
        </div>
      </div>

      {kleinKlavier ? (
        <div className="klavier klein" role="group" aria-label="antwoorden">
          {Array.from({ length: KLEIN_KLAVIER_TOT + 1 }, (_, n) => (
            <button key={n} className="toets" onClick={() => kijkNa(String(n))} disabled={!!toon}>
              {n}
            </button>
          ))}
        </div>
      ) : (
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
          <button className="toets klaar" onClick={() => kijkNa()} disabled={!!toon || !invoer} aria-label="klaar">
            <Vink />
          </button>
        </div>
      )}
    </main>
  );
}
