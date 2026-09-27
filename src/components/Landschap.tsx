"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/avatar/Avatar";
import { BREEDTE, Decor, GEBIED_X, HOOGTE, PLEKKEN, Voorgrond, type Plek } from "@/avatar/decor";
import type { Stemming } from "@/avatar/Pop";
import { Vogel } from "@/avatar/Vogel";
import { LEEFGEBIEDEN, VOGELS, vindVogel, type Leefgebied, type Soort } from "@/avatar/vogels";
import { klik, pling, zingVogel } from "@/lib/geluid";
import type { Spel } from "@/lib/state";
import type { Scherm } from "./App";

const TIK_REACTIES: [Stemming, number][] = [
  ["draai", 950],
  ["blij", 900],
  ["juich", 1700],
];

/**
 * Eén vogel op zijn plek in het landschap: het tekenvlak van de vogel wordt
 * zo geschaald en verschoven dat zijn poten (100, grond) op (x, y) staan.
 */
function OpZijnPlek({
  soort,
  plek,
  heeft,
  stemming,
  tik,
}: {
  soort: Soort;
  plek: Plek;
  heeft: boolean;
  stemming: Stemming;
  tik: () => void;
}) {
  const [x0, y0, w, h] = soort.vorm.kader.split(" ").map(Number);
  const { x, y, k } = plek;
  const transform = [plek.spiegel && `translate(${2 * x} 0) scale(-1 1)`, plek.draai && `rotate(180 ${x} ${y})`]
    .filter(Boolean)
    .join(" ");
  return (
    <g
      transform={transform || undefined}
      className={heeft ? "plek gewonnen" : "plek"}
      onClick={heeft ? tik : undefined}
      role={heeft ? "button" : undefined}
      aria-label={heeft ? soort.naam : undefined}
    >
      <svg
        x={x - (100 - x0) * k}
        y={y - (soort.vorm.grond - y0) * k}
        width={w * k}
        height={h * k}
        viewBox={soort.vorm.kader}
        overflow="visible"
      >
        <Vogel soort={soort} silhouet={!heeft} stemming={heeft ? stemming : "rust"} metStam={false} />
      </svg>
    </g>
  );
}

export function Landschap({ spel, nieuw, ga }: { spel: Spel; nieuw?: string; ga: (s: Scherm) => void }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [open, zetOpen] = useState<Soort | null>(null);
  // Welke vogel net reageert (na een tik), en hoe.
  const [actief, zetActief] = useState<{ id: string; stemming: Stemming; n: number } | null>(
    nieuw ? { id: nieuw, stemming: "juich", n: 0 } : null,
  );

  // De avatar reageert: verrast bij een nieuwe vogel, en als je erop tikt.
  const [avatarStemming, zetAvatarStemming] = useState<Stemming>(nieuw ? "verrast" : "rust");
  const [puls, zetPuls] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const reageer = (s: Stemming, duur: number) => {
    zetPuls((n) => n + 1);
    zetAvatarStemming(s);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => zetAvatarStemming("rust"), duur);
  };
  useEffect(() => {
    if (nieuw) timer.current = setTimeout(() => zetAvatarStemming("rust"), 1200);
    return () => clearTimeout(timer.current);
  }, [nieuw]);

  const tikken = useRef(0);
  const tikOpAvatar = () => {
    const [s, duur] = TIK_REACTIES[tikken.current++ % TIK_REACTIES.length];
    // De eigen vogel zingt zijn eigen liedje.
    const eigen = vindVogel(spel.avatar);
    if (!spel.stil) {
      if (eigen) zingVogel(eigen);
      else pling();
    }
    reageer(s, duur);
  };

  // Scroll naar de nieuwe of laatst gewonnen vogel.
  const doel = nieuw ?? spel.vogels.at(-1);
  const naarX = (x: number, gedrag: ScrollBehavior) => {
    const el = scroller.current;
    if (!el) return;
    const schaal = el.scrollWidth / BREEDTE;
    el.scrollTo({ left: x * schaal - el.clientWidth / 2, behavior: gedrag });
  };
  useEffect(() => {
    const plek = doel ? PLEKKEN[doel] : undefined;
    if (plek) naarX(plek.x, "instant");
    // Enkel bij het openen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tikOpVogel = (soort: Soort) => {
    if (!spel.stil) zingVogel(soort);
    zetActief((a) => ({ id: soort.id, stemming: "blij", n: (a?.n ?? 0) + 1 }));
    zetOpen(soort);
  };

  const heeft = (id: string) => spel.vogels.includes(id);
  const telling = (g: Leefgebied) => {
    const inGebied = VOGELS.filter((v) => v.gebied === g);
    return `${inGebied.filter((v) => heeft(v.id)).length}/${inGebied.length}`;
  };

  // Wie in het water waadt, komt vóór het water; de rest erachter.
  const lagen = (waden: boolean) =>
    VOGELS.filter((v) => !!PLEKKEN[v.id]?.waden === waden).map((v) => (
      <OpZijnPlek
        key={actief?.id === v.id ? `${v.id}-${actief.n}` : v.id}
        soort={v}
        plek={PLEKKEN[v.id]}
        heeft={heeft(v.id)}
        stemming={actief?.id === v.id ? actief.stemming : "rust"}
        tik={() => tikOpVogel(v)}
      />
    ));

  return (
    <main className="scherm landschap">
      <header className="balk">
        <button className="knop-rond" onClick={() => ga({ naam: "kaart" })} aria-label="terug">
          🗺️
        </button>
        <nav className="gebieden">
          {LEEFGEBIEDEN.map((g) => (
            <button
              key={g.id}
              className="gebied-knop"
              onClick={() => {
                if (!spel.stil) klik();
                naarX(GEBIED_X[g.id] + 480, "smooth");
              }}
              aria-label={g.naam}
            >
              <span aria-hidden="true">{g.icoon}</span> {telling(g.id)}
            </button>
          ))}
        </nav>
        <button className="knop-rond" onClick={() => ga({ naam: "pop" })} aria-label="andere avatar">
          🔄
        </button>
      </header>

      <div className="landschap-venster">
        <div className="landschap-scroll" ref={scroller}>
          <svg className="landschap-prent" viewBox={`0 0 ${BREEDTE} ${HOOGTE}`} role="img" aria-label="mijn vogels">
            <Decor />
            {lagen(false)}
            <Voorgrond />
            {lagen(true)}
          </svg>
        </div>

        <button className="landschap-avatar" onClick={tikOpAvatar} aria-label={`tik op ${spel.naam ?? "je vogel"}`}>
          <svg className="avatar-tak" viewBox="0 0 200 40" aria-hidden="true">
            <path d="M0 22 Q100 12 196 24" fill="none" stroke="#1f1a24" strokeWidth={22} strokeLinecap="round" />
            <path d="M0 22 Q100 12 196 24" fill="none" stroke="#8a6a4a" strokeWidth={14} strokeLinecap="round" />
          </svg>
          <Avatar key={puls} spel={spel} stemming={avatarStemming} className="avatar-op-tak" naam={spel.naam} />
        </button>
      </div>

      {open && (
        <div className="vogel-info" onClick={() => zetOpen(null)} role="dialog" aria-label={open.naam}>
          <figure className="vogelkaart groot" onClick={(e) => e.stopPropagation()}>
            <span className="gebied-icoon" aria-hidden="true">
              {LEEFGEBIEDEN.find((g) => g.id === open.gebied)!.icoon}
            </span>
            <button className="knop-rond klein sluit" onClick={() => zetOpen(null)} aria-label="sluiten">
              ✖
            </button>
            <button className="info-vogel" onClick={() => tikOpVogel(open)} aria-label={`${open.naam} laten zingen`}>
              <Vogel key={actief?.n} soort={open} stemming="blij" className="prent" />
            </button>
            <figcaption>
              <span className="vogelnaam">{open.naam}</span>
              <span className="weetje">{open.weetje}</span>
            </figcaption>
          </figure>
        </div>
      )}
    </main>
  );
}
