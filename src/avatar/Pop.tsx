// De aankleedpop: een meisje van een jaar of twaalf, getekend in lagen.
// Van achter naar voor: achterhaar, lijf, gezicht, schoenen, onderstuk,
// truitje of kleedje, voorhaar, bril, hoed en tas.

import { useId, type ReactNode } from "react";
import { vindItem, type Item } from "./items";
import type { Aan } from "@/lib/state";

type Kapsel = "lang" | "staart" | "puffs" | "bob" | "vlechten";

export type Basis = {
  id: string;
  huid: string;
  haar: string;
  kapsel: Kapsel;
};

export const BASISSEN: Basis[] = [
  { id: "lotte", huid: "#f9d4b8", haar: "#f4c95d", kapsel: "lang" },
  { id: "noor", huid: "#f1c7a5", haar: "#7a4526", kapsel: "staart" },
  { id: "amira", huid: "#8d5a3b", haar: "#2b1a12", kapsel: "puffs" },
  { id: "fien", huid: "#fbe0cc", haar: "#e0662d", kapsel: "bob" },
  { id: "yara", huid: "#c68b62", haar: "#1f1a1a", kapsel: "vlechten" },
];

export function vindBasis(id: string | null): Basis {
  return BASISSEN.find((b) => b.id === id) ?? BASISSEN[0];
}

const KAP = "M62 82 Q58 32 100 31 Q142 32 138 82 Q134 58 116 54 Q100 64 84 56 Q68 60 62 82 Z";

function Achterhaar({ kapsel, kleur }: { kapsel: Kapsel; kleur: string }) {
  switch (kapsel) {
    case "lang":
      return <path d="M60 70 Q58 28 100 28 Q142 28 140 70 L148 178 Q100 190 52 178 Z" fill={kleur} />;
    case "staart":
      return (
        <g fill={kleur}>
          <path d="M131 46 Q172 54 164 118 Q160 150 146 164 Q150 120 128 82 Z" />
          <circle cx={134} cy={48} r={7} fill="#ff6fae" />
        </g>
      );
    case "puffs":
      return (
        <g fill={kleur}>
          <circle cx={66} cy={40} r={22} />
          <circle cx={134} cy={40} r={22} />
        </g>
      );
    case "bob":
      return (
        <path d="M57 74 Q55 28 100 28 Q145 28 143 74 L146 118 Q132 126 120 118 L80 118 Q68 126 54 118 Z" fill={kleur} />
      );
    case "vlechten":
      return null;
  }
}

function Voorhaar({ kapsel, kleur }: { kapsel: Kapsel; kleur: string }) {
  switch (kapsel) {
    case "staart":
      return (
        <path
          d="M62 82 Q58 32 100 31 Q142 32 138 82 Q132 56 112 50 Q88 50 74 64 Q66 72 62 82 Z"
          fill={kleur}
        />
      );
    case "puffs":
      return <path d="M62 80 Q60 34 100 33 Q140 34 138 80 Q134 58 100 54 Q66 58 62 80 Z" fill={kleur} />;
    case "bob":
      return <path d="M62 84 Q56 30 100 30 Q144 30 138 84 L136 62 Q100 68 64 62 Z" fill={kleur} />;
    case "vlechten":
      return (
        <g fill={kleur}>
          <path d={KAP} />
          {[0, 1].map((kant) => {
            const x = kant ? 136 : 64;
            return (
              <g key={kant}>
                {[100, 118, 136, 154, 172].map((y) => (
                  <ellipse key={y} cx={x} cy={y} rx={9} ry={10.5} />
                ))}
                <circle cx={x} cy={188} r={5} fill="#ffd23f" />
                <path d={`M${x - 5} 192 L${x} 204 L${x + 5} 192 Z`} />
              </g>
            );
          })}
        </g>
      );
    default:
      return <path d={KAP} fill={kleur} />;
  }
}

function Lijf({ huid }: { huid: string }) {
  return (
    <g fill={huid}>
      <rect x={80} y={200} width={17} height={122} rx={8} />
      <rect x={103} y={200} width={17} height={122} rx={8} />
      <path d="M68 138 L46 222" stroke={huid} strokeWidth={14} strokeLinecap="round" />
      <path d="M132 138 L154 222" stroke={huid} strokeWidth={14} strokeLinecap="round" />
      <circle cx={46} cy={224} r={9} />
      <circle cx={154} cy={224} r={9} />
      <path d="M70 130 Q100 122 130 130 L128 210 L72 210 Z" />
      <rect x={92} y={100} width={16} height={34} rx={6} />
      <circle cx={64} cy={80} r={7} />
      <circle cx={136} cy={80} r={7} />
      <ellipse cx={100} cy={74} rx={36} ry={38} />
    </g>
  );
}

function Gezicht({ haar }: { haar: string }) {
  return (
    <g>
      <path d="M79 66 Q87 61 95 65 M105 65 Q113 61 121 66" stroke={haar} strokeWidth={3} fill="none" strokeLinecap="round" />
      {[87, 113].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={79} rx={4.5} ry={6} fill="#2b2140" />
          <circle cx={x + 1.6} cy={76.5} r={1.7} fill="#ffffff" />
        </g>
      ))}
      <path d="M80 75 L77 72 M120 75 L123 72" stroke="#2b2140" strokeWidth={2} strokeLinecap="round" />
      <circle cx={79} cy={92} r={6} fill="#ff6f91" opacity={0.35} />
      <circle cx={121} cy={92} r={6} fill="#ff6f91" opacity={0.35} />
      <path d="M99 85 Q101 88 99 90" stroke="#00000033" strokeWidth={2} fill="none" strokeLinecap="round" />
      <path d="M91 96 Q100 105 109 96" stroke="#8b2d4f" strokeWidth={3} fill="none" strokeLinecap="round" />
    </g>
  );
}

function tekenItem(item: Item | undefined, uid: string, huid: string): ReactNode {
  return item ? <g key={item.id}>{item.teken({ uid: `${uid}-${item.id}`, huid })}</g> : null;
}

export function Pop({
  basis,
  aan,
  naam,
  className,
}: {
  basis: Basis;
  aan: Aan;
  naam?: string | null;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const kleed = vindItem(aan.kleedjes);
  const t = (id: string | undefined) => tekenItem(vindItem(id), uid, basis.huid);

  return (
    <svg viewBox="0 0 200 360" className={className} role="img" aria-label={naam || "pop"}>
      <ellipse cx={100} cy={342} rx={56} ry={7} fill="#00000018" />
      <Achterhaar kapsel={basis.kapsel} kleur={basis.haar} />
      <Lijf huid={basis.huid} />
      <Gezicht haar={basis.haar} />
      {t(aan.schoenen)}
      {kleed ? tekenItem(kleed, uid, basis.huid) : (
        <>
          {t(aan.onder)}
          {t(aan.truitjes)}
        </>
      )}
      <Voorhaar kapsel={basis.kapsel} kleur={basis.haar} />
      {t(aan.brillen)}
      {t(aan.hoofd)}
      {t(aan.tassen)}
    </svg>
  );
}

/** Eén item als los prentje, voor in de kast en bij de beloning. */
export function ItemPrent({ item, huid = "#f1c7a5", className }: { item: Item; huid?: string; className?: string }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg viewBox={item.kader} className={className} role="img" aria-label={item.naam}>
      {item.teken({ uid, huid })}
    </svg>
  );
}
