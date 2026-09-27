"use client";

import { Avatar } from "@/avatar/Avatar";
import { LEERJAREN } from "@/data/onderwerpen";
import { klik } from "@/lib/geluid";
import { zetLeerjaar, type Spel } from "@/lib/state";

/**
 * "In welk leerjaar zit je?": enkel als de ouder het leerjaar nog niet
 * instelde. Grote cijfers, en enkel de leerjaren waarvoor er iets te oefenen is.
 */
export function LeerjaarKiezen({ spel }: { spel: Spel }) {
  return (
    <main className="scherm kiezen leerjaar-kiezen">
      <Avatar spel={spel} kader="portret" className="leerjaar-avatar" naam={spel.naam} />
      <h1 className="titel">in welk leerjaar zit je?</h1>
      <div className="kiezen-rij">
        {LEERJAREN.map((j) => (
          <button
            key={j}
            className="kaartje leerjaar-knop"
            onClick={() => {
              if (!spel.stil) klik();
              zetLeerjaar(j);
            }}
            aria-label={`leerjaar ${j}`}
          >
            {j}
          </button>
        ))}
      </div>
    </main>
  );
}
