// De avatar om aan te kleden: een hip tienermeisje in fashion-illustratiestijl,
// met dunne contourlijnen in bessenkleur. Alle avatars staan in dezelfde pose,
// zodat elk kledingstuk op elke avatar past.
//
// Van achter naar voor: achterhaar, benen, schoenen, romp en armen,
// onderstuk, truitje of kleedje, shopping, handen, hals en hoofd, voorhaar,
// gezicht, bril en hoofdaccessoire.

import { useId, type ReactNode } from "react";
import { vindItem, type Item } from "./items";
import { ARM_LINKS, ARM_RECHTS, LIJN, OMLIJND, Streng } from "./vormen";
import type { Aan } from "@/lib/state";

type Kapsel = "golven" | "staart" | "knot" | "bob" | "vlechten";

export type Basis = {
  id: string;
  huid: string;
  /** Een iets donkerdere huidtint voor schaduw en neus. */
  schaduw: string;
  haar: string;
  /** Een donkerdere haartint voor lokken en wenkbrauwen. */
  haarDonker: string;
  kapsel: Kapsel;
};

export const BASISSEN: Basis[] = [
  { id: "lotte", huid: "#f6d3b8", schaduw: "#e3ad8c", haar: "#d9a441", haarDonker: "#a8742a", kapsel: "golven" },
  { id: "noor", huid: "#f0c2a0", schaduw: "#d69c78", haar: "#6b3e26", haarDonker: "#4a2716", kapsel: "staart" },
  { id: "amira", huid: "#8d5a3b", schaduw: "#6e412a", haar: "#2b1a12", haarDonker: "#140b07", kapsel: "knot" },
  { id: "fien", huid: "#fbe0cc", schaduw: "#e8b89c", haar: "#e889b0", haarDonker: "#c25f8a", kapsel: "bob" },
  { id: "yara", huid: "#b5774f", schaduw: "#935a37", haar: "#241a1a", haarDonker: "#0e0909", kapsel: "vlechten" },
];

export function vindBasis(id: string | null): Basis {
  return BASISSEN.find((b) => b.id === id) ?? BASISSEN[0];
}

// ---- Haar -------------------------------------------------------------------

const KAP = "M78 58 Q74 24 100 24 Q126 24 122 58 Q118 38 100 36 Q84 38 78 58 Z";

function Achterhaar({ b }: { b: Basis }) {
  switch (b.kapsel) {
    case "golven":
      return (
        <path
          d="M76 50 Q70 22 100 22 Q130 22 124 50 Q134 80 128 108 Q136 132 126 152 Q112 148 108 132 L92 132 Q88 148 74 152 Q64 132 72 108 Q66 80 76 50 Z"
          fill={b.haar}
          {...OMLIJND}
        />
      );
    case "staart":
      return (
        <g {...OMLIJND}>
          <path d="M112 28 Q150 34 144 96 Q142 124 128 142 Q134 100 114 60 Z" fill={b.haar} />
          <path d="M126 50 Q138 80 132 118" fill="none" stroke={b.haarDonker} strokeWidth={1.5} />
        </g>
      );
    case "knot":
      return (
        <g {...OMLIJND}>
          <circle cx={100} cy={18} r={17} fill={b.haar} />
          <path d="M90 12 Q96 8 102 12 M100 22 Q106 18 112 22" fill="none" stroke={b.haarDonker} strokeWidth={1.5} />
        </g>
      );
    case "bob":
      return (
        <path
          d="M76 58 Q72 22 100 22 Q128 22 124 58 L128 88 Q118 94 110 86 L90 86 Q82 94 72 88 Z"
          fill={b.haar}
          {...OMLIJND}
        />
      );
    case "vlechten":
      return (
        <g {...OMLIJND}>
          <path d="M76 50 Q70 22 100 22 Q130 22 124 50 L132 176 L68 176 Z" fill={b.haar} />
          <path d="M84 70 L80 174 M92 80 L90 174 M108 80 L110 174 M116 70 L120 174" fill="none" stroke={b.haarDonker} strokeWidth={1.5} />
        </g>
      );
  }
}

function Voorhaar({ b }: { b: Basis }) {
  switch (b.kapsel) {
    case "golven":
      return (
        <g {...OMLIJND}>
          <path d="M78 60 Q72 22 102 22 Q126 24 122 58 Q118 36 104 34 Q96 46 80 50 Z" fill={b.haar} />
          <path d="M80 60 Q74 80 80 96 Q76 110 82 120 M120 60 Q126 80 120 96 Q124 110 118 120" fill="none" stroke={b.haarDonker} strokeWidth={3} />
        </g>
      );
    case "staart":
      return (
        <g {...OMLIJND}>
          <path d="M78 56 Q76 26 100 26 Q124 26 122 56 Q116 36 100 36 Q86 38 78 56 Z" fill={b.haar} />
          <path d="M79 50 Q75 62 80 74" fill="none" stroke={b.haar} strokeWidth={3} />
          <circle cx={116} cy={31} r={6} fill="#f4a7c8" />
        </g>
      );
    case "knot":
      return (
        <g {...OMLIJND}>
          <path d="M78 60 Q74 28 100 28 Q126 28 122 60 Q120 42 100 40 Q80 42 78 60 Z" fill={b.haar} />
          <path d="M88 32 Q100 28 112 32" fill="none" stroke={b.haarDonker} strokeWidth={1.5} />
          <rect x={88} y={30} width={24} height={5} rx={2.5} fill="#f4a7c8" />
        </g>
      );
    case "bob":
      return (
        <g {...OMLIJND}>
          <path d="M78 62 Q72 24 100 24 Q128 24 122 62 Q120 44 108 40 Q96 52 80 50 Z" fill={b.haar} />
          <rect x={108} y={36} width={13} height={4} rx={2} fill="#f7d774" transform="rotate(-22 114 38)" />
          <rect x={110} y={44} width={13} height={4} rx={2} fill="#ffffff" transform="rotate(-22 116 46)" />
        </g>
      );
    case "vlechten":
      return (
        <g {...OMLIJND}>
          <path d={KAP} fill={b.haar} />
          <path d="M100 25 L100 36" fill="none" stroke={b.haarDonker} strokeWidth={1.5} />
          {[78, 122].map((x) => {
            const kant = x < 100 ? -1 : 1;
            return (
              <g key={x}>
                <Streng d={`M${x} 62 Q${x + kant * 4} 110 ${x - kant * 2} 162`} kleur={b.haar} dikte={7} />
                <rect x={x - kant * 2 - 5} y={150} width={10} height={6} rx={2} fill="#e8b04a" />
              </g>
            );
          })}
        </g>
      );
  }
}

// ---- Lijf en gezicht ---------------------------------------------------------

function Benen({ huid }: { huid: string }) {
  return (
    <g fill={huid} {...OMLIJND}>
      <path d="M79 178 Q77 262 85 352 L95 352 Q99 262 99 178 Z" />
      <path d="M121 178 Q123 262 115 352 L105 352 Q101 262 101 178 Z" />
    </g>
  );
}

function Romp({ huid }: { huid: string }) {
  return (
    <g>
      <Streng d={ARM_LINKS} kleur={huid} dikte={10} />
      <Streng d={ARM_RECHTS} kleur={huid} dikte={10} />
      <path
        d="M76 100 Q100 94 124 100 L119 164 Q121 172 122 182 L78 182 Q79 172 81 164 Z"
        fill={huid}
        {...OMLIJND}
      />
    </g>
  );
}

function Handen({ huid }: { huid: string }) {
  return (
    <g fill={huid} {...OMLIJND}>
      <ellipse cx={67} cy={211} rx={5.5} ry={6.5} />
      <ellipse cx={133} cy={211} rx={5.5} ry={6.5} />
    </g>
  );
}

function Hoofd({ b }: { b: Basis }) {
  return (
    <g>
      <rect x={94} y={72} width={12} height={28} rx={4} fill={b.huid} {...OMLIJND} />
      <path d="M95 80 Q100 86 105 80 L105 76 L95 76 Z" fill={b.schaduw} />
      <ellipse cx={100} cy={54} rx={21} ry={25} fill={b.huid} {...OMLIJND} />
    </g>
  );
}

function Gezicht({ b }: { b: Basis }) {
  return (
    <g strokeLinecap="round" fill="none">
      <path d="M85 49 Q91 46 96 48 M104 48 Q109 46 115 49" stroke={b.haarDonker} strokeWidth={1.6} />
      <path d="M85 57 Q91 52 97 57 M103 57 Q109 52 115 57" stroke={LIJN} strokeWidth={2.2} />
      <path d="M85 57 L83 55 M115 57 L117 55" stroke={LIJN} strokeWidth={1.6} />
      <circle cx={91} cy={58.5} r={2.8} fill="#5a3825" />
      <circle cx={109} cy={58.5} r={2.8} fill="#5a3825" />
      <circle cx={92} cy={57.5} r={0.9} fill="#ffffff" />
      <circle cx={110} cy={57.5} r={0.9} fill="#ffffff" />
      <path d="M100 60 Q102 65 99 66" stroke={b.schaduw} strokeWidth={1.4} />
      <ellipse cx={86} cy={65} rx={4} ry={2.3} fill="#f47bae" opacity={0.35} />
      <ellipse cx={114} cy={65} rx={4} ry={2.3} fill="#f47bae" opacity={0.35} />
      <path d="M93 69 Q100 78.5 107 69 Q100 71 93 69 Z" fill="#c0476f" stroke="#a8325e" strokeWidth={0.8} strokeLinejoin="round" />
      <path d="M95 70 Q100 71.8 105 70 L104.2 71.8 Q100 73.4 95.8 71.8 Z" fill="#ffffff" />
      <circle cx={79} cy={66} r={2.2} fill="#e8b04a" />
      <circle cx={121} cy={66} r={2.2} fill="#e8b04a" />
    </g>
  );
}

// ---- Samenstellen ------------------------------------------------------------

function tekenItem(item: Item | undefined, uid: string, b: Basis): ReactNode {
  return item ? <g key={item.id}>{item.teken({ uid: `${uid}-${item.id}`, huid: b.huid })}</g> : null;
}

/** Het volledige tekenvlak, ruim genoeg voor tassen en ballonnen opzij. */
export const VOLLEDIG = "0 0 200 400";
/** Strak rond de figuur zelf, voor als ze nog niets vasthoudt. */
export const STRAK = "44 0 112 388";

export function Pop({
  basis,
  aan,
  naam,
  className,
  kader = VOLLEDIG,
}: {
  basis: Basis;
  aan: Aan;
  naam?: string | null;
  className?: string;
  kader?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const kleed = vindItem(aan.kleedjes);
  const t = (id: string | undefined) => tekenItem(vindItem(id), uid, basis);

  return (
    <svg viewBox={kader} className={className} role="img" aria-label={naam || "avatar"}>
      <ellipse cx={100} cy={378} rx={58} ry={7} fill="#00000014" />
      <Achterhaar b={basis} />
      <Benen huid={basis.huid} />
      {t(aan.schoenen)}
      <Romp huid={basis.huid} />
      {kleed ? (
        tekenItem(kleed, uid, basis)
      ) : (
        <>
          {t(aan.onder)}
          {t(aan.truitjes)}
        </>
      )}
      {t(aan.tassen)}
      <Handen huid={basis.huid} />
      <Hoofd b={basis} />
      <Voorhaar b={basis} />
      <Gezicht b={basis} />
      {t(aan.brillen)}
      {t(aan.hoofd)}
    </svg>
  );
}

/** Eén item als los prentje, voor in de kast en bij de beloning. */
export function ItemPrent({ item, huid = "#f0c2a0", className }: { item: Item; huid?: string; className?: string }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg viewBox={item.kader} className={className} role="img" aria-label={item.naam}>
      {item.teken({ uid, huid })}
    </svg>
  );
}
