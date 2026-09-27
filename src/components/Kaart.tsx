"use client";

import { useEffect, useRef } from "react";
import { Avatar } from "@/avatar/Avatar";
import { ITEMS } from "@/avatar/items";
import { VOGELS } from "@/avatar/vogels";
import { reeksenVan, type Onderwerp } from "@/data/onderwerpen";
import { klik } from "@/lib/geluid";
import { kiesProfiel, themaVan, useStaat, zetStil, type Spel } from "@/lib/state";
import type { Scherm } from "./App";

const KLEUREN = {
  kleren: ["#ff4fa3", "#7b3fe4", "#4d9dfe", "#3ddc97", "#ff9f1c", "#e63946"],
  // Natuurkleuren: mos, meer, oker, dennengroen, lucht, roodborst.
  vogels: ["#5f9e3a", "#2f86b8", "#d99a2b", "#2e7d5b", "#56a8d8", "#d4622a"],
};

export function Kaart({
  spel,
  onderwerp,
  anderOnderwerp,
  ga,
}: {
  spel: Spel;
  onderwerp: Onderwerp;
  /** Enkel als het leerjaar meer dan één onderwerp heeft. */
  anderOnderwerp?: () => void;
  ga: (s: Scherm) => void;
}) {
  const reeksen = reeksenVan(onderwerp);
  const volgende = reeksen.find((p) => !spel.klaar.includes(p.reeksId));
  const volgendeIndex = volgende?.index ?? reeksen.length;
  const huidigRef = useRef<HTMLButtonElement>(null);
  const vogels = themaVan(spel) === "vogels";
  const teller = vogels
    ? { icoon: "🐦", gewonnen: spel.vogels.length, totaal: VOGELS.length, naam: "mijn vogels" }
    : { icoon: "👗", gewonnen: spel.kast.length, totaal: ITEMS.filter((i) => !i.start).length, naam: "mijn kast" };

  useEffect(() => {
    huidigRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, []);

  const staat = useStaat();
  const meerdereProfielen = Object.keys(staat?.lokaal.profielen ?? {}).length > 1;

  const tik = () => {
    if (!spel.stil) klik();
  };

  return (
    <main className="scherm kaart">
      <header className="balk">
        <button className="knop-rond pop-knop" onClick={() => { tik(); ga({ naam: "kast" }); }} aria-label={teller.naam}>
          <Avatar spel={spel} naam={spel.naam} kader={vogels ? "portret" : "volledig"} className={vogels ? "vogel-mini" : "pop-mini"} />
        </button>
        <span className="naam-label">{spel.naam}</span>
        <button className="kast-teller" onClick={() => { tik(); ga({ naam: "kast" }); }}>
          {teller.icoon} {teller.gewonnen} / {teller.totaal}
        </button>
        <div className="balk-rechts">
          {anderOnderwerp && (
            <button className="knop-rond" onClick={() => { tik(); anderOnderwerp(); }} aria-label="ander onderwerp">
              {onderwerp.icoon}
            </button>
          )}
          <button className="knop-rond" onClick={() => zetStil(!spel.stil)} aria-label="geluid">
            {spel.stil ? "🔇" : "🔊"}
          </button>
          {meerdereProfielen && (
            <button className="knop-rond" onClick={() => { tik(); kiesProfiel(null); }} aria-label="ander profiel">
              👥
            </button>
          )}
          <button className="knop-rond klein" onClick={() => ga({ naam: "ouder" })} aria-label="oudermenu">
            ⚙️
          </button>
        </div>
      </header>

      <div className="pad">
        {onderwerp.levels.map((level, li) => {
          const kleuren = KLEUREN[themaVan(spel)];
          const kleur = kleuren[li % kleuren.length];
          return (
            <section key={level.id} className="level" style={{ ["--kleur" as string]: kleur }}>
              <div className="level-kop">
                {level.tegels.map((k) => (
                  <span key={k} className={`letter-tegel ${k.length > 2 ? "breed" : ""}`}>{k}</span>
                ))}
              </div>
              <div className="bolletjes">
                {level.reeksen.map((reeks) => {
                  const plek = reeksen.find((p) => p.reeksId === reeks.id)!;
                  const klaar = spel.klaar.includes(reeks.id);
                  const open = plek.index <= volgendeIndex;
                  const huidig = plek.index === volgendeIndex;
                  const x = Math.round(Math.sin(plek.index * 1.3) * 110);
                  return (
                    <div key={reeks.id} className="bolletje-rij" style={{ ["--x" as string]: `${x}px` }}>
                      <button
                        ref={huidig ? huidigRef : undefined}
                        disabled={!open}
                        className={`bolletje ${klaar ? "klaar" : ""} ${huidig ? "huidig" : ""}`}
                        onClick={() => { tik(); ga({ naam: "oefenen", reeks: reeks.id }); }}
                      >
                        {klaar ? "⭐" : open ? plek.index + 1 : "🔒"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
        <section className="level einde">
          <div className="einde-tekst">{volgende ? "🏁" : "🎉 alles klaar! 🎉"}</div>
        </section>
      </div>
    </main>
  );
}
