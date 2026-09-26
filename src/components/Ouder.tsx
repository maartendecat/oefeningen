"use client";

import { useState } from "react";
import { ALLE_REEKSEN, LEVELS } from "@/data/levels";
import {
  exporteer,
  importeer,
  wisAlles,
  zetStil,
  zetVoortgang,
  type Spel,
} from "@/lib/state";
import type { Scherm } from "./App";

function Poort({ open }: { open: () => void }) {
  const [som] = useState(() => {
    const a = 6 + Math.floor(Math.random() * 4);
    const b = 6 + Math.floor(Math.random() * 4);
    return { a, b };
  });
  const [antwoord, zetAntwoord] = useState("");
  const [fout, zetFout] = useState(false);

  return (
    <form
      className="paneel poort"
      onSubmit={(e) => {
        e.preventDefault();
        if (Number(antwoord) === som.a * som.b) open();
        else {
          zetFout(true);
          zetAntwoord("");
        }
      }}
    >
      <h2>Voor ouders</h2>
      <p>
        Hoeveel is {som.a} × {som.b}?
      </p>
      <input
        className="invoer"
        inputMode="numeric"
        pattern="[0-9]*"
        autoFocus
        value={antwoord}
        onChange={(e) => zetAntwoord(e.target.value)}
      />
      {fout && <p className="fout">Dat klopt niet.</p>}
      <button className="knop" type="submit">
        Open
      </button>
    </form>
  );
}

export function Ouder({ spel, ga }: { spel: Spel; ga: (s: Scherm) => void }) {
  const [open, zetOpen] = useState(false);
  const [code, zetCode] = useState("");
  const [melding, zetMelding] = useState<string | null>(null);
  const reeksIds = ALLE_REEKSEN.map((p) => p.reeks.id);

  return (
    <main className="scherm ouder">
      <header className="balk">
        <button className="knop-rond" onClick={() => ga({ naam: "kaart" })} aria-label="terug">
          ✖
        </button>
        <h1 className="titel">oudermenu</h1>
        <span />
      </header>

      {!open ? (
        <Poort open={() => zetOpen(true)} />
      ) : (
        <div className="ouder-inhoud">
          {melding && <p className="melding">{melding}</p>}
          <section className="paneel">
            <h2>Voortgang</h2>
            <p>
              {spel.klaar.length} van {reeksIds.length} reeksen gedaan, {spel.kast.length} items gewonnen.
            </p>
            <p className="uitleg">
              Laat haar starten bij een bepaalde letter. Alle reeksen daarvoor tellen dan als gedaan en
              leveren elk een willekeurig item op. Teruggaan neemt geen items af.
            </p>
            <div className="level-keuze">
              {LEVELS.map((level) => {
                const eerste = ALLE_REEKSEN.find((p) => p.level.id === level.id)!;
                return (
                  <button
                    key={level.id}
                    className="knop"
                    onClick={() => {
                      zetVoortgang(reeksIds, eerste.index);
                      zetMelding(`Ze start nu bij "${level.nieuw.join(" ")}".`);
                    }}
                  >
                    {level.nieuw.join(" ")}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="paneel">
            <h2>Geluid</h2>
            <button className="knop" onClick={() => zetStil(!spel.stil)}>
              {spel.stil ? "Geluid aanzetten" : "Geluid uitzetten"}
            </button>
          </section>

          <section className="paneel">
            <h2>Naar een ander toestel</h2>
            <p className="uitleg">
              De voortgang zit enkel in deze browser. Kopieer deze code en plak ze op het andere toestel.
            </p>
            <textarea className="invoer code" readOnly value={exporteer(spel)} onFocus={(e) => e.target.select()} />
            <button
              className="knop"
              onClick={() => {
                void navigator.clipboard?.writeText(exporteer(spel));
                zetMelding("Code gekopieerd.");
              }}
            >
              Kopieer code
            </button>
            <textarea
              className="invoer code"
              placeholder="Plak hier een code"
              value={code}
              onChange={(e) => zetCode(e.target.value)}
            />
            <button
              className="knop"
              disabled={!code.trim()}
              onClick={() => {
                const ok = importeer(code);
                zetMelding(ok ? "Voortgang ingeladen." : "Die code werkt niet.");
                if (ok) zetCode("");
              }}
            >
              Laad code
            </button>
          </section>

          <section className="paneel gevaar">
            <h2>Alles wissen</h2>
            <button
              className="knop rood"
              onClick={() => {
                if (confirm("Alle voortgang, kleren en de gekozen pop wissen?")) {
                  wisAlles();
                  ga({ naam: "kaart" });
                }
              }}
            >
              Wis alles
            </button>
          </section>

        </div>
      )}
    </main>
  );
}
