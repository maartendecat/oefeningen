"use client";

import { useState, type ReactNode } from "react";
import { Avatar } from "@/avatar/Avatar";
import { HELDEN, HELD_PORTRET, Held } from "@/avatar/Held";
import { BASISSEN, PORTRET, Pop } from "@/avatar/Pop";
import { Vogel } from "@/avatar/Vogel";
import { STARTVOGELS } from "@/avatar/vogels";
import { klik, pling } from "@/lib/geluid";
import {
  begonnenAvatars,
  isVol,
  kiesAvatar,
  magNieuweAvatar,
  sterrenVan,
  verzamelingVan,
  zetNaam,
  type Spel,
} from "@/lib/state";
import { Sterren, Vink } from "./Icoon";

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

  const begonnen = begonnenAvatars(spel);
  return (
    <main className="scherm kiezen">
      <h1 className="titel">{begonnen.length > 0 ? "mijn avatars" : "kies je avatar"}</h1>
      {!magNieuweAvatar(spel) && <p className="ondertitel">verzamel eerst ★★ voor een nieuwe avatar</p>}
      <AvatarRaster spel={spel} kies={kies} />
    </main>
  );
}

/**
 * Alle avatars in één keer: bovenaan de poppen (kleren), dan de vogels en de
 * helden. Een begonnen avatar toont zijn sterren; een nieuwe heeft een
 * slotje zolang hij niet mag. `zonderVolle` sluit ook volle avatars uit (om
 * te kiezen met wie het kind verder verzamelt).
 */
export function AvatarRaster({
  spel,
  kies,
  zonderVolle = false,
}: {
  spel: Spel;
  kies: (id: string) => void;
  zonderVolle?: boolean;
}) {
  const begonnen = begonnenAvatars(spel);
  const nieuwMag = magNieuweAvatar(spel);
  const kaartje = (id: string, soort: string, label: string, prent: ReactNode) => {
    const bezig = begonnen.includes(id) || spel.avatar === id;
    const opSlot = !bezig && !nieuwMag;
    const vol = zonderVolle && isVol(spel, id);
    return (
      <button
        key={id}
        className={`kaartje pop-kaartje ${soort} ${spel.avatar === id && !zonderVolle ? "gekozen" : ""} ${opSlot ? "dicht" : ""} ${vol ? "vol" : ""}`}
        onClick={() => kies(id)}
        disabled={opSlot || vol}
        aria-label={label}
      >
        {prent}
        {begonnen.includes(id) && <Sterren aantal={sterrenVan(spel, id)} className="kaartje-sterren" />}
        {opSlot && (
          <span className="kaartje-slot" aria-hidden="true">
            🔒
          </span>
        )}
      </button>
    );
  };
  const aanVan = (id: string) => verzamelingVan(spel, id).aan;

  return (
    <>
      <div className="kiezen-rij poppen">
        {BASISSEN.map((b, i) =>
          kaartje(b.id, "", `avatar ${i + 1}`, <Pop basis={b} aan={aanVan(b.id)} kader={PORTRET} className="pop-klein" />),
        )}
      </div>
      <div className="kiezen-rij vogels">
        {STARTVOGELS.map((v) => kaartje(v.id, "vogel-kaartje", v.naam, <Vogel soort={v} className="pop-klein" />))}
      </div>
      <div className="kiezen-rij helden">
        {HELDEN.map((h) =>
          kaartje(
            h.id,
            "held-kaartje",
            `held ${h.naam}`,
            <Held basis={h} aan={aanVan(h.id)} kader={HELD_PORTRET} className="pop-klein" />,
          ),
        )}
      </div>
    </>
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
