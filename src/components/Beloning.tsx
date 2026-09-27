"use client";

import { useEffect, useState } from "react";
import { Avatar } from "@/avatar/Avatar";
import { ItemPrent, vindBasis, type Stemming } from "@/avatar/Pop";
import { Vogel } from "@/avatar/Vogel";
import { vindItem } from "@/avatar/items";
import { LEEFGEBIEDEN, vindVogel } from "@/avatar/vogels";
import { reeksenVan, vindReeks } from "@/data/onderwerpen";
import { fanfare, pling, zingVogel } from "@/lib/geluid";
import { kiesVerrassingen, themaVan, winBeloning, type Spel } from "@/lib/state";
import type { Scherm } from "./App";
import { Pijl } from "./Icoon";

// Een veertje voor wie een vogel als avatar heeft.
const VEER = "M0 12 C2 6 6 1 12 0 C11 5 7 10 0 12 Z";

async function confetti(veel: boolean, vogels: boolean) {
  const { default: knal } = await import("canvas-confetti");
  const kleuren = vogels
    ? ["#5f9e3a", "#2f86b8", "#d99a2b", "#d4622a", "#f4f0e8", "#8a6a4a"]
    : ["#ff4fa3", "#7b3fe4", "#ffd23f", "#3ddc97", "#4d9dfe"];
  const vorm = vogels ? { shapes: [knal.shapeFromPath(VEER)], scalar: 2.2 } : {};
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
  const vogels = themaVan(spel) === "vogels";

  useEffect(() => {
    if (!gekozen) return;
    const t = setTimeout(() => zetStemming("juich"), 700);
    return () => clearTimeout(t);
  }, [gekozen]);

  useEffect(() => {
    if (!spel.stil) fanfare();
    void confetti(false, vogels);
    // Enkel bij het openen van het scherm.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reeksId]);

  const kies = (id: string) => {
    winBeloning(spel, id);
    zetGekozen(id);
    if (!spel.stil) {
      const vogel = vindVogel(id);
      if (vogels && vogel) zingVogel(vogel);
      else pling();
    }
    void confetti(true, vogels);
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
        aria-label={vogels ? "mijn vogels" : "mijn kast"}
      >
        {vogels ? "🏞️" : "👗"}
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
        <h1 className="titel groot">joepie!</h1>
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

  const basis = vindBasis(spel.avatar);
  return (
    <main className="scherm beloning">
      <h1 className="titel groot">goed zo!</h1>
      <p className="ondertitel">{vogels ? "kies een vogel 🪶" : "kies een cadeau 🎁"}</p>
      <div className="cadeaus">
        {keuzes.map((id, i) => {
          const vogel = vogels ? vindVogel(id) : undefined;
          const item = vogel ? undefined : vindItem(id);
          if (!vogel && !item) return null;
          const gebied = vogel && LEEFGEBIEDEN.find((g) => g.id === vogel.gebied)!;
          return (
            <button
              key={id}
              className={`kaartje cadeau ${vogel ? `vogelkaart gebied-${vogel.gebied}` : ""}`}
              style={{ animationDelay: `${i * 0.15}s` }}
              onClick={() => kies(id)}
              aria-label={vogel?.naam ?? item!.naam}
            >
              {vogel ? (
                <>
                  <span className="gebied-icoon" aria-hidden="true">{gebied!.icoon}</span>
                  <Vogel soort={vogel} className="prent" />
                  <span className="vogelnaam">{vogel.naam}</span>
                </>
              ) : (
                <ItemPrent item={item!} huid={basis.huid} className="prent" />
              )}
            </button>
          );
        })}
      </div>
    </main>
  );
}
