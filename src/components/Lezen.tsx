"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/avatar/Avatar";
import type { Stemming } from "@/avatar/Pop";
import { vindReeks } from "@/data/levels";
import { nogEens, pling } from "@/lib/geluid";
import { hak, isKlinker, kaal, woorden } from "@/lib/klanken";
import { reeksKlaar, type Spel } from "@/lib/state";
import type { Scherm } from "./App";
import { Opnieuw, Vink } from "./Icoon";

export function Lezen({
  spel,
  reeksId,
  ga,
}: {
  spel: Spel;
  reeksId: string;
  ga: (s: Scherm) => void;
}) {
  const plek = vindReeks(reeksId);
  const [stap, zetStap] = useState(0);
  const [klankjes, zetKlankjes] = useState(false);
  const [schud, zetSchud] = useState(0);
  // Het leesmaatje: blij bij een goed woord, "pfff" als het zwaar gaat.
  const [stemming, zetStemming] = useState<Stemming>("rust");
  const [puls, zetPuls] = useState(0);
  const terugNaarRust = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(terugNaarRust.current), []);

  const reageer = (nieuw: Stemming, duur: number) => {
    clearTimeout(terugNaarRust.current);
    zetStemming(nieuw);
    zetPuls((n) => n + 1);
    terugNaarRust.current = setTimeout(() => zetStemming("rust"), duur);
  };

  if (!plek) {
    return (
      <main className="scherm">
        <button className="groot-knop" onClick={() => ga({ naam: "kaart" })}>🏠</button>
      </main>
    );
  }

  const oefeningen = plek.reeks.oefeningen;
  const tekst = oefeningen[stap];

  const goed = () => {
    if (!spel.stil) pling();
    if (stap === oefeningen.length - 1) {
      const eerste = !spel.klaar.includes(reeksId);
      reeksKlaar(reeksId);
      ga({ naam: "beloning", reeks: reeksId, eerste });
      return;
    }
    zetStap(stap + 1);
    zetKlankjes(false);
    reageer("blij", 900);
  };

  const opnieuw = () => {
    if (!spel.stil) nogEens();
    zetSchud((n) => n + 1);
    // Na een 'nog eens' helpen de klankjes om het woord te hakken.
    zetKlankjes(true);
    reageer("zwaar", 2600);
  };

  return (
    <main className="scherm lezen">
      <header className="balk">
        <button className="knop-rond" onClick={() => ga({ naam: "kaart" })} aria-label="terug">
          ✖
        </button>
        <div className="voortgang" aria-label={`${stap + 1} van ${oefeningen.length}`}>
          {oefeningen.map((_, i) => (
            <span key={i} className={`stip ${i < stap ? "gedaan" : ""} ${i === stap ? "nu" : ""}`} />
          ))}
        </div>
        <button
          className={`knop-rond ${klankjes ? "aan" : ""}`}
          onClick={() => zetKlankjes(!klankjes)}
          aria-label="klankjes"
        >
          ✂️
        </button>
      </header>

      <div className="leesvak">
        <div key={`${stap}-${schud}`} className={`lees-kaart ${schud ? "schud" : ""}`}>
          {klankjes ? (
            <p className="leestekst gehakt">
              {woorden(tekst).map((w, wi) => (
                <span key={wi} className="gehakt-woord">
                  {hak(kaal(w)).map((k, ki) => (
                    <span key={ki} className={`klank ${isKlinker(k) ? "klinker" : ""}`}>
                      {k}
                    </span>
                  ))}
                  {w.endsWith(".") || w.endsWith("?") ? <span className="leesteken">{w.slice(-1)}</span> : null}
                </span>
              ))}
            </p>
          ) : (
            <p className="leestekst">{tekst}</p>
          )}
        </div>
      </div>

      <div className="maatje" aria-hidden="true">
        <Avatar key={puls} spel={spel} stemming={stemming} kader="portret" />
      </div>

      <footer className="knoppen">
        <button className="groot-knop opnieuw" onClick={opnieuw} aria-label="nog eens">
          <Opnieuw />
        </button>
        <button className="groot-knop goed" onClick={goed} aria-label="goed gelezen">
          <Vink />
        </button>
      </footer>
    </main>
  );
}
