"use client";

import { useState } from "react";
import { Avatar } from "@/avatar/Avatar";
import { HELDEN, HELD_PORTRET, Held } from "@/avatar/Held";
import { BASISSEN, PORTRET, Pop } from "@/avatar/Pop";
import { Vogel } from "@/avatar/Vogel";
import { STARTVOGELS } from "@/avatar/vogels";
import { klik, pling } from "@/lib/geluid";
import { kiesAvatar, zetNaam, type Spel } from "@/lib/state";
import { Vink } from "./Icoon";

const MAX_NAAM = 12;

export function AvatarKiezen({ spel, klaar }: { spel: Spel; klaar: () => void }) {
  // Wie al een avatar heeft maar nog geen naam, begint meteen bij de naam.
  const [stap, zetStap] = useState<"kiezen" | "naam">(spel.avatar && !spel.naam ? "naam" : "kiezen");
  const kies = (id: string) => {
    if (!spel.stil) klik();
    kiesAvatar(id);
    // De ouder gaf het profiel al een naam: dan is het kind meteen klaar.
    if (spel.naam) klaar();
    else zetStap("naam");
  };

  if (stap === "naam" && spel.avatar) {
    return (
      <NaamKiezen
        spel={spel}
        terug={() => zetStap("kiezen")}
        klaar={(naam) => {
          if (!spel.stil) pling();
          zetNaam(naam);
          klaar();
        }}
      />
    );
  }

  // Alles in één keer: bovenaan de poppen (kleren), dan de vogels en de helden.
  return (
    <main className="scherm kiezen">
      <h1 className="titel">kies je avatar</h1>
      <div className="kiezen-rij poppen">
        {BASISSEN.map((b) => (
          <button
            key={b.id}
            className={`kaartje pop-kaartje ${spel.avatar === b.id ? "gekozen" : ""}`}
            onClick={() => kies(b.id)}
            aria-label={`avatar ${BASISSEN.indexOf(b) + 1}`}
          >
            <Pop basis={b} aan={spel.aan} kader={PORTRET} className="pop-klein" />
          </button>
        ))}
      </div>
      <div className="kiezen-rij vogels">
        {STARTVOGELS.map((v) => (
          <button
            key={v.id}
            className={`kaartje pop-kaartje vogel-kaartje ${spel.avatar === v.id ? "gekozen" : ""}`}
            onClick={() => kies(v.id)}
            aria-label={v.naam}
          >
            <Vogel soort={v} className="pop-klein" />
          </button>
        ))}
      </div>
      <div className="kiezen-rij helden">
        {HELDEN.map((h) => (
          <button
            key={h.id}
            className={`kaartje pop-kaartje held-kaartje ${spel.avatar === h.id ? "gekozen" : ""}`}
            onClick={() => kies(h.id)}
            aria-label={`held ${h.naam}`}
          >
            <Held basis={h} aan={spel.heldAan} kader={HELD_PORTRET} className="pop-klein" />
          </button>
        ))}
      </div>
    </main>
  );
}

function NaamKiezen({
  spel,
  terug,
  klaar,
}: {
  spel: Spel;
  terug: () => void;
  klaar: (naam: string) => void;
}) {
  const [naam, zetNaamVeld] = useState(spel.naam ?? "");
  const schoon = naam.trim();

  return (
    <main className="scherm kiezen naam-kiezen">
      <header className="balk">
        <button className="knop-rond" onClick={terug} aria-label="andere avatar">
          ⬅️
        </button>
        <h1 className="titel">hoe heet je avatar?</h1>
        <span className="knop-plek" />
      </header>

      <form
        className="naam-vak"
        onSubmit={(e) => {
          e.preventDefault();
          if (schoon) klaar(schoon);
        }}
      >
        <Avatar spel={spel} stemming={schoon ? "blij" : "rust"} className="pop-naam-groot" />
        <div className="naam-invoer-rij">
          <input
            className="naam-invoer"
            value={naam}
            maxLength={MAX_NAAM}
            // Alles in de app is in kleine letters, ook haar naam.
            onChange={(e) => zetNaamVeld(e.target.value.toLowerCase())}
            autoFocus
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="done"
            aria-label="naam van je avatar"
          />
          <button className="groot-knop goed klein" type="submit" disabled={!schoon} aria-label="klaar">
            <Vink />
          </button>
        </div>
      </form>
    </main>
  );
}
