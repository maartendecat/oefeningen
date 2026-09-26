"use client";

import { useState } from "react";
import { BASISSEN, Pop, vindBasis } from "@/avatar/Pop";
import { klik, pling } from "@/lib/geluid";
import { kiesAvatar, zetNaam, type Spel } from "@/lib/state";

const MAX_NAAM = 12;

export function AvatarKiezen({ spel, klaar }: { spel: Spel; klaar: () => void }) {
  // Wie al een pop heeft maar nog geen naam, begint meteen bij de naam.
  const [stap, zetStap] = useState<"pop" | "naam">(spel.avatar && !spel.naam ? "naam" : "pop");

  if (stap === "naam" && spel.avatar) {
    return (
      <NaamKiezen
        spel={spel}
        terug={() => zetStap("pop")}
        klaar={(naam) => {
          if (!spel.stil) pling();
          zetNaam(naam);
          klaar();
        }}
      />
    );
  }

  return (
    <main className="scherm kiezen">
      <h1 className="titel">kies je pop</h1>
      <div className="kiezen-rij">
        {BASISSEN.map((b) => (
          <button
            key={b.id}
            className={`kaartje pop-kaartje ${spel.avatar === b.id ? "gekozen" : ""}`}
            onClick={() => {
              if (!spel.stil) klik();
              kiesAvatar(b.id);
              zetStap("naam");
            }}
            aria-label={`pop ${BASISSEN.indexOf(b) + 1}`}
          >
            <Pop basis={b} aan={spel.aan} className="pop-klein" />
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
        <button className="knop-rond" onClick={terug} aria-label="andere pop">
          ⬅️
        </button>
        <h1 className="titel">hoe heet je pop?</h1>
        <span className="knop-plek" />
      </header>

      <form
        className="naam-vak"
        onSubmit={(e) => {
          e.preventDefault();
          if (schoon) klaar(schoon);
        }}
      >
        <Pop basis={vindBasis(spel.avatar)} aan={spel.aan} className="pop-naam-groot" />
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
            aria-label="naam van je pop"
          />
          <button className="groot-knop goed klein" type="submit" disabled={!schoon} aria-label="klaar">
            ✓
          </button>
        </div>
      </form>
    </main>
  );
}
