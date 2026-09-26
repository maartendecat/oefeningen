"use client";

import { useState } from "react";
import { ItemPrent, Pop, vindBasis } from "@/avatar/Pop";
import { CATEGORIEEN, ITEMS, type Categorie } from "@/avatar/items";
import { klik } from "@/lib/geluid";
import { trekAan, type Spel } from "@/lib/state";
import type { Scherm } from "./App";

export function Kast({ spel, ga }: { spel: Spel; ga: (s: Scherm) => void }) {
  const [cat, zetCat] = useState<Categorie>("truitjes");
  const basis = vindBasis(spel.avatar);
  const heb = (id: string, start?: boolean) => start || spel.kast.includes(id);

  const inCat = ITEMS.filter((i) => i.categorie === cat);
  // Eerst wat ze al heeft, daarna de vraagtekens.
  const gesorteerd = [...inCat.filter((i) => heb(i.id, i.start)), ...inCat.filter((i) => !heb(i.id, i.start))];

  return (
    <main className="scherm kast">
      <header className="balk">
        <button className="knop-rond" onClick={() => ga({ naam: "kaart" })} aria-label="terug">
          🗺️
        </button>
        <h1 className="titel">mijn kast</h1>
        <button className="knop-rond" onClick={() => ga({ naam: "pop" })} aria-label="andere avatar">
          🔄
        </button>
      </header>

      <div className="kast-inhoud">
        <div className="kast-pop">
          <Pop basis={basis} aan={spel.aan} naam={spel.naam} className="pop-groot" />
          <span className="naam-label groot">{spel.naam}</span>
        </div>

        <div className="kast-rek">
          <nav className="tabs">
            {CATEGORIEEN.map((c) => {
              const totaal = ITEMS.filter((i) => i.categorie === c.id && !i.start).length;
              const gewonnen = ITEMS.filter((i) => i.categorie === c.id && spel.kast.includes(i.id)).length;
              return (
                <button
                  key={c.id}
                  className={`tab ${cat === c.id ? "actief" : ""}`}
                  onClick={() => { if (!spel.stil) klik(); zetCat(c.id); }}
                  aria-label={c.naam}
                >
                  <span className="tab-icoon">{c.icoon}</span>
                  <span className="tab-teller">{gewonnen}/{totaal}</span>
                </button>
              );
            })}
          </nav>

          <div className="vakjes">
            {gesorteerd.map((item) =>
              heb(item.id, item.start) ? (
                <button
                  key={item.id}
                  className={`vakje ${spel.aan[item.categorie] === item.id ? "aan" : ""}`}
                  onClick={() => { if (!spel.stil) klik(); trekAan(item.id); }}
                  aria-label={item.naam}
                >
                  <ItemPrent item={item} huid={basis.huid} className="prent" />
                </button>
              ) : (
                <div key={item.id} className="vakje dicht" aria-label="nog te winnen">
                  ?
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
