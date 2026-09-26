"use client";

import { useEffect, useState } from "react";
import { ItemPrent, Pop, vindBasis } from "@/avatar/Pop";
import { vindItem } from "@/avatar/items";
import { fanfare, pling } from "@/lib/geluid";
import { kiesVerrassingen, winItem, type Spel } from "@/lib/state";
import type { Scherm } from "./App";

async function confetti(veel: boolean) {
  const { default: knal } = await import("canvas-confetti");
  const kleuren = ["#ff4fa3", "#7b3fe4", "#ffd23f", "#3ddc97", "#4d9dfe"];
  knal({ particleCount: veel ? 160 : 90, spread: 90, origin: { y: 0.6 }, colors: kleuren });
  if (veel) {
    setTimeout(() => knal({ particleCount: 80, angle: 60, spread: 70, origin: { x: 0 }, colors: kleuren }), 250);
    setTimeout(() => knal({ particleCount: 80, angle: 120, spread: 70, origin: { x: 1 }, colors: kleuren }), 400);
  }
}

export function Beloning({
  spel,
  reeksId,
  eerste,
  ga,
}: {
  spel: Spel;
  reeksId: string;
  eerste: boolean;
  ga: (s: Scherm) => void;
}) {
  // Eén keer bepalen, anders wisselen de verrassingen bij elke render.
  const [keuzes] = useState(() => (eerste ? kiesVerrassingen(spel) : []));
  const [gekozen, zetGekozen] = useState<string | null>(null);
  const basis = vindBasis(spel.avatar);

  useEffect(() => {
    if (!spel.stil) fanfare();
    void confetti(false);
    // Enkel bij het openen van het scherm.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reeksId]);

  const kies = (id: string) => {
    winItem(id);
    zetGekozen(id);
    if (!spel.stil) pling();
    void confetti(true);
  };

  const verder = (
    <div className="knoppen-rij">
      <button className="groot-knop klein-tekst" onClick={() => ga({ naam: "kaart" })}>🗺️</button>
      <button className="groot-knop klein-tekst" onClick={() => ga({ naam: "kast" })}>👗</button>
    </div>
  );

  if (keuzes.length === 0) {
    return (
      <main className="scherm beloning">
        <h1 className="titel groot">goed zo!</h1>
        <Pop basis={basis} aan={spel.aan} className="pop-groot dans" />
        {verder}
      </main>
    );
  }

  if (gekozen) {
    return (
      <main className="scherm beloning">
        <h1 className="titel groot">joepie!</h1>
        <Pop basis={basis} aan={spel.aan} className="pop-groot dans" />
        {verder}
      </main>
    );
  }

  return (
    <main className="scherm beloning">
      <h1 className="titel groot">goed zo!</h1>
      <p className="ondertitel">kies een cadeau 🎁</p>
      <div className="cadeaus">
        {keuzes.map((id, i) => {
          const item = vindItem(id)!;
          return (
            <button
              key={id}
              className="kaartje cadeau"
              style={{ animationDelay: `${i * 0.15}s` }}
              onClick={() => kies(id)}
            >
              <ItemPrent item={item} huid={basis.huid} className="prent" />
            </button>
          );
        })}
      </div>
    </main>
  );
}
