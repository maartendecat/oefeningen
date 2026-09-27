"use client";

import { reeksenVan, type Onderwerp } from "@/data/onderwerpen";
import { klik } from "@/lib/geluid";
import type { Spel } from "@/lib/state";

/** Wat gaan we oefenen? Enkel als het leerjaar meer dan één onderwerp heeft. */
export function OnderwerpKiezen({
  spel,
  onderwerpen,
  kies,
}: {
  spel: Spel;
  onderwerpen: Onderwerp[];
  kies: (id: string) => void;
}) {
  return (
    <main className="scherm kiezen">
      <h1 className="titel">wat ga je oefenen?</h1>
      <div className="kiezen-rij">
        {onderwerpen.map((o) => {
          const reeksen = reeksenVan(o);
          const klaar = reeksen.filter((p) => spel.klaar.includes(p.reeksId)).length;
          return (
            <button
              key={o.id}
              className="kaartje onderwerp-knop"
              onClick={() => {
                if (!spel.stil) klik();
                kies(o.id);
              }}
            >
              <span className="onderwerp-icoon" aria-hidden="true">
                {o.icoon}
              </span>
              <span className="onderwerp-naam">{o.naam}</span>
              <span className="onderwerp-stand">
                ⭐ {klaar} / {reeksen.length}
              </span>
            </button>
          );
        })}
      </div>
    </main>
  );
}
