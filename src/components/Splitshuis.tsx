// Het tienveld en het splitshuis, zoals de klas ze gebruikt (Wiskanjers).

import type { ReactNode } from "react";
import type { Som } from "@/data/sommen";

const VAK = 40;
const VIERKANT = 30;
const RAND = 8;
/** Witruimte tussen de groepjes van 2 + 2 + 1 kolommen. */
const GROEP = 14;
/** Zo lang is een tienveld (5 kolommen in groepjes) en zo breed (2 rijen). */
const LANG = 2 * RAND + 5 * VAK + 2 * GROEP;
const KORT = 2 * RAND + 2 * VAK;
const TUSSEN = 16;

/** Waar vakje `i` (0 tot 9) ligt: kolom per kolom, eerst boven en dan onder. */
function plekVan(i: number): { langs: number; dwars: number } {
  const kolom = Math.floor(i / 2);
  return {
    langs: RAND + kolom * VAK + (kolom >= 2 ? GROEP : 0) + (kolom >= 4 ? GROEP : 0),
    dwars: RAND + (i % 2) * VAK,
  };
}

/**
 * Een tienveld van 2 × 5, zoals in de klas: vierkantjes, kolom per kolom
 * gevuld (eerst boven, dan onder), met de kolommen in groepjes van 2, 2 en 1.
 * Staand wordt dat rij per rij, eerst links en dan rechts. Vanaf 11 zijn er
 * twee tienvelden: het eerste is vol. Verborgen: enkel de lege vakjes.
 */
export function Tienveld({
  aantal,
  staand = false,
  verborgen = false,
  className = "",
}: {
  aantal: number;
  staand?: boolean;
  verborgen?: boolean;
  className?: string;
}) {
  const velden = aantal > 10 ? 2 : 1;
  // Liggend staan twee tienvelden onder elkaar, staand naast elkaar.
  const breed = staand ? velden * KORT + (velden - 1) * TUSSEN : LANG;
  const hoog = staand ? LANG : velden * KORT + (velden - 1) * TUSSEN;
  return (
    <svg
      viewBox={`0 0 ${breed} ${hoog}`}
      className={`tienveld ${staand ? "staand" : "liggend"} ${velden === 2 ? "dubbel" : ""} ${className}`}
      role="img"
      aria-label={verborgen ? "tienveld" : `${aantal} vakjes`}
    >
      {Array.from({ length: velden }, (_, v) => {
        const opschuiven = v * (KORT + TUSSEN);
        return (
          <g key={v} transform={staand ? `translate(${opschuiven} 0)` : `translate(0 ${opschuiven})`}>
            <rect
              x={2}
              y={2}
              width={(staand ? KORT : LANG) - 4}
              height={(staand ? LANG : KORT) - 4}
              rx={8}
              fill="#ffffff"
              stroke="#c9c2d6"
              strokeWidth={3}
            />
            {Array.from({ length: 10 }, (_, i) => {
              const { langs, dwars } = plekVan(i);
              const vol = !verborgen && v * 10 + i < aantal;
              const marge = (VAK - VIERKANT) / 2;
              return (
                <rect
                  key={i}
                  x={(staand ? dwars : langs) + marge}
                  y={(staand ? langs : dwars) + marge}
                  width={VIERKANT}
                  height={VIERKANT}
                  rx={2}
                  fill={vol ? "var(--inkt)" : "#ffffff"}
                  stroke={vol ? "var(--inkt)" : "#c9c2d6"}
                  strokeWidth={vol ? 2 : 2.5}
                />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Het splitshuis: een smalle toren met het getal als dak, en daaronder drie
 * kamers: links een getal, in het midden de avatar, rechts een getal. Eén
 * kamer is leeg; daar komt `antwoord`.
 */
export function Splitshuis({
  som,
  antwoord,
  bewoner,
}: {
  som: Extract<Som, { vorm: "splitshuis" }>;
  antwoord: ReactNode;
  bewoner: ReactNode;
}) {
  return (
    <div className="splitshuis">
      <div className="huis-dak">{som.dak}</div>
      <div className="huis-kamers">
        <div className="huis-kamer">{som.links ?? antwoord}</div>
        <div className="huis-kamer huis-bewoner" aria-hidden="true">
          {bewoner}
        </div>
        <div className="huis-kamer">{som.rechts ?? antwoord}</div>
      </div>
    </div>
  );
}
