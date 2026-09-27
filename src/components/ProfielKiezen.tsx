"use client";

import { useState } from "react";
import { Avatar } from "@/avatar/Avatar";
import { klik } from "@/lib/geluid";
import { kiesProfiel, maakProfiel, themaVan, useStaat } from "@/lib/state";
import type { Scherm } from "./App";
import { Vink } from "./Icoon";

/**
 * "Wie gaat er lezen?": het kind kiest zelf zijn profiel. Nieuwe profielen
 * maakt de ouder in het oudermenu; enkel het allereerste kan hier meteen,
 * vlak na het inloggen.
 */
export function ProfielKiezen({ ga }: { ga: (s: Scherm) => void }) {
  const staat = useStaat();
  const [naam, zetNaam] = useState("");
  if (!staat) return null;
  const profielen = Object.entries(staat.lokaal.profielen).sort(([, a], [, b]) =>
    (a.naam ?? "").localeCompare(b.naam ?? ""),
  );

  const kies = (id: string) => {
    klik();
    kiesProfiel(id);
    ga({ naam: "kaart" });
  };

  return (
    <main className="scherm profielen">
      <header className="balk">
        <span className="knop-plek" />
        <h1 className="titel">{profielen.length ? "wie gaat er lezen?" : "welkom!"}</h1>
        <button className="knop-rond klein" onClick={() => ga({ naam: "ouder" })} aria-label="oudermenu">
          ⚙️
        </button>
      </header>

      {profielen.length > 0 ? (
        <div className="profiel-raster">
          {profielen.map(([id, spel], i) => (
            <button key={id} className="profiel-keuze" onClick={() => kies(id)}>
              <span
                className={`profiel-portret ${themaVan(spel) === "vogels" ? "vogel-portret" : ""}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {spel.avatar ? (
                  <Avatar spel={spel} kader="portret" />
                ) : (
                  <span className="profiel-vraag">?</span>
                )}
              </span>
              <span className="naam-label">{spel.naam ?? "?"}</span>
            </button>
          ))}
        </div>
      ) : (
        <form
          className="paneel eerste-profiel"
          onSubmit={(e) => {
            e.preventDefault();
            const schoon = naam.trim().toLowerCase();
            if (!schoon) return;
            kiesProfiel(maakProfiel(schoon));
            ga({ naam: "kaart" });
          }}
        >
          <h2>Maak het eerste profiel</h2>
          <p className="uitleg">
            Hoe heet je kind? Daarna kiest het zelf een avatar. Meer profielen voeg je later toe in het
            oudermenu (⚙️).
          </p>
          <div className="naam-invoer-rij">
            <input
              className="naam-invoer"
              value={naam}
              maxLength={12}
              onChange={(e) => zetNaam(e.target.value.toLowerCase())}
              autoFocus
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              aria-label="naam van het kind"
            />
            <button className="groot-knop goed klein" type="submit" disabled={!naam.trim()} aria-label="klaar">
              <Vink />
            </button>
          </div>
        </form>
      )}
    </main>
  );
}
