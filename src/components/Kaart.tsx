"use client";

import { useEffect, useRef } from "react";
import { Pop, vindBasis } from "@/avatar/Pop";
import { ITEMS } from "@/avatar/items";
import { ALLE_REEKSEN, LEVELS } from "@/data/levels";
import { klik } from "@/lib/geluid";
import { kiesProfiel, useStaat, zetStil, type Spel } from "@/lib/state";
import type { Scherm } from "./App";

const KLEUREN = ["#ff4fa3", "#7b3fe4", "#4d9dfe", "#3ddc97", "#ff9f1c", "#e63946"];

export function Kaart({ spel, ga }: { spel: Spel; ga: (s: Scherm) => void }) {
  const volgende = ALLE_REEKSEN.find((p) => !spel.klaar.includes(p.reeks.id));
  const volgendeIndex = volgende?.index ?? ALLE_REEKSEN.length;
  const huidigRef = useRef<HTMLButtonElement>(null);
  const aantalItems = ITEMS.filter((i) => !i.start).length;

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
        <button className="knop-rond pop-knop" onClick={() => { tik(); ga({ naam: "kast" }); }} aria-label="mijn kast">
          <Pop basis={vindBasis(spel.avatar)} aan={spel.aan} naam={spel.naam} className="pop-mini" />
        </button>
        <span className="naam-label">{spel.naam}</span>
        <button className="kast-teller" onClick={() => { tik(); ga({ naam: "kast" }); }}>
          👗 {spel.kast.length} / {aantalItems}
        </button>
        <div className="balk-rechts">
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
        {LEVELS.map((level, li) => {
          const kleur = KLEUREN[li % KLEUREN.length];
          return (
            <section key={level.id} className="level" style={{ ["--kleur" as string]: kleur }}>
              <div className="level-kop">
                {level.nieuw.map((k) => (
                  <span key={k} className="letter-tegel">{k}</span>
                ))}
              </div>
              <div className="bolletjes">
                {level.reeksen.map((reeks) => {
                  const plek = ALLE_REEKSEN.find((p) => p.reeks.id === reeks.id)!;
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
                        onClick={() => { tik(); ga({ naam: "lezen", reeks: reeks.id }); }}
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
