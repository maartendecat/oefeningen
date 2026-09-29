"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Avatar } from "@/avatar/Avatar";
import { HeldItemPrent, vindHeld } from "@/avatar/Held";
import { HELD_CATEGORIEEN, HELD_ITEMS } from "@/avatar/heldenitems";
import { ItemPrent, vindBasis, type Stemming } from "@/avatar/Pop";
import { CATEGORIEEN, ITEMS } from "@/avatar/items";
import { klik, pling, woesj } from "@/lib/geluid";
import { rustUit, themaVan, trekAan, type Spel } from "@/lib/state";
import type { Scherm } from "./App";

const TIK_REACTIES: [Stemming, number][] = [
  ["draai", 950],
  ["blij", 900],
  ["juich", 1700],
];

/** Wat er in de kast hangt: de kleren van de pop of de uitrusting van de held. */
type Rek = {
  titel: string;
  categorieen: { id: string; naam: string; icoon: string }[];
  items: { id: string; naam: string; categorie: string; start?: boolean }[];
  gewonnen: string[];
  aan: Record<string, string | undefined>;
  pas: (id: string) => void;
  prent: (id: string) => ReactNode;
  tikGeluid: () => void;
};

function rekVan(spel: Spel): Rek {
  if (themaVan(spel) === "helden") {
    const huid = vindHeld(spel.avatar).huid;
    return {
      titel: "hoofdkwartier",
      categorieen: HELD_CATEGORIEEN,
      items: HELD_ITEMS,
      gewonnen: spel.uitrusting,
      aan: spel.heldAan,
      pas: rustUit,
      prent: (id) => <HeldItemPrent item={HELD_ITEMS.find((i) => i.id === id)!} huid={huid} naam={spel.naam} className="prent" />,
      tikGeluid: woesj,
    };
  }
  const huid = vindBasis(spel.avatar).huid;
  return {
    titel: "mijn kast",
    categorieen: CATEGORIEEN,
    items: ITEMS,
    gewonnen: spel.kast,
    aan: spel.aan,
    pas: trekAan,
    prent: (id) => <ItemPrent item={ITEMS.find((i) => i.id === id)!} huid={huid} className="prent" />,
    tikGeluid: pling,
  };
}

export function Kast({ spel, ga }: { spel: Spel; ga: (s: Scherm) => void }) {
  const rek = rekVan(spel);
  const [cat, zetCat] = useState(rek.categorieen[0].id);
  // De avatar reageert: op nieuwe kleren, en als ze op haar tikt.
  const [puls, zetPuls] = useState(0);
  const [stemming, zetStemming] = useState<Stemming>("rust");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const reageer = (nieuw: Stemming, duur: number) => {
    zetPuls((n) => n + 1);
    zetStemming(nieuw);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => zetStemming("rust"), duur);
  };
  const pas = (id: string) => {
    rek.pas(id);
    reageer("blij", 900);
  };
  // Bij elke tik de volgende reactie: een draaitje, een sprongetje, hartjes.
  const tikken = useRef(0);
  const tikOpAvatar = () => {
    const [nieuw, duur] = TIK_REACTIES[tikken.current++ % TIK_REACTIES.length];
    if (!spel.stil) rek.tikGeluid();
    reageer(nieuw, duur);
  };
  const heb = (id: string, start?: boolean) => start || rek.gewonnen.includes(id);

  const inCat = rek.items.filter((i) => i.categorie === cat);
  // Eerst wat ze al heeft, daarna de vraagtekens.
  const gesorteerd = [...inCat.filter((i) => heb(i.id, i.start)), ...inCat.filter((i) => !heb(i.id, i.start))];

  return (
    <main className={`scherm kast ${themaVan(spel) === "helden" ? "hoofdkwartier" : ""}`}>
      <header className="balk">
        <button className="knop-rond" onClick={() => ga({ naam: "kaart" })} aria-label="terug">
          🗺️
        </button>
        <h1 className="titel">{rek.titel}</h1>
        <button className="knop-rond" onClick={() => ga({ naam: "pop" })} aria-label="andere avatar">
          🔄
        </button>
      </header>

      <div className="kast-inhoud">
        <div className="kast-pop">
          <button className="pop-tik" onClick={tikOpAvatar} aria-label={`tik op ${spel.naam ?? "je avatar"}`}>
            <Avatar key={puls} spel={spel} naam={spel.naam} stemming={stemming} className="pop-groot" />
          </button>
          <span className="naam-label groot">{spel.naam}</span>
        </div>

        <div className="kast-rek">
          <nav className="tabs">
            {rek.categorieen.map((c) => {
              const totaal = rek.items.filter((i) => i.categorie === c.id && !i.start).length;
              const gewonnen = rek.items.filter((i) => i.categorie === c.id && rek.gewonnen.includes(i.id)).length;
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
                  className={`vakje ${rek.aan[item.categorie] === item.id ? "aan" : ""}`}
                  onClick={() => { if (!spel.stil) klik(); pas(item.id); }}
                  aria-label={item.naam}
                >
                  {rek.prent(item.id)}
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
