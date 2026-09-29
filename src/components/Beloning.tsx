"use client";

import { useEffect, useState } from "react";
import { Avatar } from "@/avatar/Avatar";
import { HeldItemPrent, vindHeld } from "@/avatar/Held";
import { vindHeldItem } from "@/avatar/heldenitems";
import { ItemPrent, vindBasis, type Stemming } from "@/avatar/Pop";
import { Vogel } from "@/avatar/Vogel";
import { vindItem } from "@/avatar/items";
import { LEEFGEBIEDEN, vindVogel } from "@/avatar/vogels";
import { reeksenVan, vindReeks } from "@/data/onderwerpen";
import { fanfare, pling, woesj, zingVogel } from "@/lib/geluid";
import { kiesVerrassingen, themaVan, winBeloning, type Spel, type Thema } from "@/lib/state";
import type { Scherm } from "./App";
import { Pijl } from "./Icoon";

// Een veertje voor wie een vogel als avatar heeft.
const VEER = "M0 12 C2 6 6 1 12 0 C11 5 7 10 0 12 Z";
// Een bliksemschicht voor wie een held als avatar heeft (samen met sterretjes).
const SCHICHT = "M7 0 L1 11 L6 11 L3 20 L12 7 L7 7 L10 0 Z";

async function confetti(veel: boolean, thema: Thema) {
  const { default: knal } = await import("canvas-confetti");
  const kleuren = {
    vogels: ["#5f9e3a", "#2f86b8", "#d99a2b", "#d4622a", "#f4f0e8", "#8a6a4a"],
    helden: ["#e63946", "#ffcc1a", "#2f6fe0", "#ffffff", "#ff7a1a"],
    kleren: ["#ff4fa3", "#7b3fe4", "#ffd23f", "#3ddc97", "#4d9dfe"],
  }[thema];
  const vorm = {
    vogels: { shapes: [knal.shapeFromPath(VEER)], scalar: 2.2 },
    helden: { shapes: [knal.shapeFromPath(SCHICHT), "star" as const], scalar: 1.8 },
    kleren: {},
  }[thema];
  knal({ particleCount: veel ? 160 : 90, spread: 90, origin: { y: 0.6 }, colors: kleuren, ...vorm });
  if (veel) {
    setTimeout(() => knal({ particleCount: 80, angle: 60, spread: 70, origin: { x: 0 }, colors: kleuren, ...vorm }), 250);
    setTimeout(() => knal({ particleCount: 80, angle: 120, spread: 70, origin: { x: 1 }, colors: kleuren, ...vorm }), 400);
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
  // Eerst even verrast om het nieuwe cadeau, dan juichen.
  const [stemming, zetStemming] = useState<Stemming>(eerste ? "verrast" : "juich");
  const thema = themaVan(spel);
  const vogels = thema === "vogels";
  const helden = thema === "helden";

  useEffect(() => {
    if (!gekozen) return;
    const t = setTimeout(() => zetStemming("juich"), 700);
    return () => clearTimeout(t);
  }, [gekozen]);

  useEffect(() => {
    if (!spel.stil) fanfare();
    void confetti(false, thema);
    // Enkel bij het openen van het scherm.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reeksId]);

  const kies = (id: string) => {
    winBeloning(spel, id);
    zetGekozen(id);
    if (!spel.stil) {
      const vogel = vindVogel(id);
      if (vogels && vogel) zingVogel(vogel);
      else if (helden) woesj();
      else pling();
    }
    void confetti(true, thema);
  };

  // "ga verder" start meteen de volgende reeks van hetzelfde onderwerp die
  // nog niet gedaan is.
  const onderwerp = vindReeks(reeksId)?.onderwerp;
  const volgende = onderwerp && reeksenVan(onderwerp).find((p) => !spel.klaar.includes(p.reeksId));
  const verder = (
    <div className="knoppen-rij">
      <button
        className="groot-knop klein-tekst"
        onClick={() => ga({ naam: "kast", nieuw: gekozen ?? undefined })}
        aria-label={vogels ? "mijn vogels" : helden ? "mijn hoofdkwartier" : "mijn kast"}
      >
        {vogels ? "🏞️" : helden ? "🦸" : "👗"}
      </button>
      <button
        className="groot-knop verder-knop"
        onClick={() => ga(volgende ? { naam: "oefenen", reeks: volgende.reeksId } : { naam: "kaart" })}
      >
        ga verder
        <Pijl className="icoon klein" />
      </button>
    </div>
  );

  if (keuzes.length === 0) {
    return (
      <main className="scherm beloning">
        <h1 className="titel groot">goed zo!</h1>
        <Avatar spel={spel} naam={spel.naam} stemming="juich" className="pop-groot" />
        {verder}
      </main>
    );
  }

  if (gekozen) {
    const nieuweVogel = vogels ? vindVogel(gekozen) : undefined;
    return (
      <main className="scherm beloning">
        <h1 className="titel groot">{helden ? "pow!" : "joepie!"}</h1>
        {nieuweVogel ? (
          // De avatar kijkt naar zijn nieuwe vogel.
          <div className="beloning-duo">
            <Avatar spel={spel} naam={spel.naam} stemming={stemming} className="duo-avatar" />
            <figure className="vogelkaart groot">
              <Vogel soort={nieuweVogel} stemming="blij" className="prent" />
              <figcaption className="vogelnaam">{nieuweVogel.naam}</figcaption>
            </figure>
          </div>
        ) : (
          <Avatar spel={spel} naam={spel.naam} stemming={stemming} className="pop-groot" />
        )}
        {verder}
      </main>
    );
  }

  const huid = helden ? vindHeld(spel.avatar).huid : vindBasis(spel.avatar).huid;
  return (
    <main className="scherm beloning">
      <h1 className="titel groot">goed zo!</h1>
      <p className="ondertitel">{vogels ? "kies een vogel 🪶" : helden ? "kies je superspul ⚡" : "kies een cadeau 🎁"}</p>
      <div className="cadeaus">
        {keuzes.map((id, i) => {
          const vogel = vogels ? vindVogel(id) : undefined;
          const heldItem = helden ? vindHeldItem(id) : undefined;
          const item = vogel || heldItem ? undefined : vindItem(id);
          if (!vogel && !item && !heldItem) return null;
          const gebied = vogel && LEEFGEBIEDEN.find((g) => g.id === vogel.gebied)!;
          return (
            <button
              key={id}
              className={`kaartje cadeau ${vogel ? `vogelkaart gebied-${vogel.gebied}` : ""}`}
              style={{ animationDelay: `${i * 0.15}s` }}
              onClick={() => kies(id)}
              aria-label={vogel?.naam ?? heldItem?.naam ?? item!.naam}
            >
              {vogel ? (
                <>
                  <span className="gebied-icoon" aria-hidden="true">{gebied!.icoon}</span>
                  <Vogel soort={vogel} className="prent" />
                  <span className="vogelnaam">{vogel.naam}</span>
                </>
              ) : heldItem ? (
                <HeldItemPrent item={heldItem} huid={huid} naam={spel.naam} className="prent" />
              ) : (
                <ItemPrent item={item!} huid={huid} className="prent" />
              )}
            </button>
          );
        })}
      </div>
    </main>
  );
}
