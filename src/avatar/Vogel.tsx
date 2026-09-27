// Tekent één vogel uit vogels.tsx, met dezelfde stemmingen als de pop.
//
// Van achter naar voor: eerst alle delen in de lijnkleur en iets dikker
// (dat wordt de buitenlijn, zonder lijnen tussen kop en lijf), dan de
// kleuren: poten, staart, lijf met buik en tekening, kop, snavel, vleugel,
// oog. Daarboven de effecten van de stemming: muzieknootjes, vonkjes,
// een zweetdruppel.
//
// De animaties staan in globals.css (zoek op "Vogel-animaties").

import { useId, type CSSProperties, type ReactNode } from "react";
import { sterPad, vonkPad } from "./vormen";
import type { Stemming } from "./Pop";
import type { Oog } from "./vogelvormen";
import type { Soort } from "./vogels";

export const VOGELLIJN = "#1f1a24";
const DIK = 3.2;

function spreiding(uid: string): number {
  let h = 0;
  for (const c of uid) h = (h * 31 + c.charCodeAt(0)) % 9973;
  return h;
}

function OogTekening({ o, stemming, iris, ring }: { o: Oog; stemming: Stemming; iris?: string; ring?: string }) {
  const { x, y, r } = o;
  const lacht = stemming === "blij" || stemming === "juich" || stemming === "draai";
  if (lacht) {
    return (
      <path
        d={`M${x - r * 1.05} ${y + r * 0.35} Q${x} ${y - r * 1.25} ${x + r * 1.05} ${y + r * 0.35}`}
        fill="none"
        stroke={VOGELLIJN}
        strokeWidth={Math.max(1.6, r * 0.5)}
        strokeLinecap="round"
      />
    );
  }
  if (stemming === "zwaar") {
    return (
      <path
        d={`M${x - r} ${y - r * 0.8} L${x + r * 0.7} ${y} L${x - r} ${y + r * 0.8}`}
        fill="none"
        stroke={VOGELLIJN}
        strokeWidth={Math.max(1.6, r * 0.45)}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  }
  const groot = stemming === "verrast" ? 1.3 : 1;
  const R = r * groot;
  return (
    <g className="oog" style={{ transformOrigin: `${x}px ${y}px` }}>
      {ring && <circle cx={x} cy={y} r={R + Math.max(1.4, r * 0.32)} fill={ring} />}
      {stemming === "verrast" && <circle cx={x} cy={y} r={R} fill="#ffffff" stroke={VOGELLIJN} strokeWidth={1} />}
      {iris ? (
        <>
          <circle cx={x} cy={y} r={stemming === "verrast" ? R * 0.8 : R} fill={iris} stroke={VOGELLIJN} strokeWidth={Math.max(0.8, r * 0.12)} />
          <circle cx={x} cy={y} r={R * 0.5} fill={VOGELLIJN} />
        </>
      ) : (
        <circle cx={x} cy={y} r={stemming === "verrast" ? R * 0.75 : R} fill={VOGELLIJN} />
      )}
      <circle cx={x + R * 0.28} cy={y - R * 0.3} r={Math.max(0.9, R * 0.28)} fill="#ffffff" />
    </g>
  );
}

// ---- Effecten ------------------------------------------------------------------

function notePad(x: number, y: number, s: number): string {
  // Een achtste noot: bolletje met steel en vlag.
  return `M${x} ${y} C${x - 3 * s} ${y - 0.5 * s} ${x - 3.5 * s} ${y + 3 * s} ${x - 0.5 * s} ${y + 3 * s} C${x + 2 * s} ${y + 3 * s} ${x + 2.2 * s} ${y + 1.2 * s} ${x + 2 * s} ${y} L${x + 2 * s} ${y - 9 * s} C${x + 4 * s} ${y - 7 * s} ${x + 6 * s} ${y - 6 * s} ${x + 5 * s} ${y - 3 * s} C${x + 5 * s} ${y - 5 * s} ${x + 3.5 * s} ${y - 6 * s} ${x + 2.8 * s} ${y - 6.2 * s} L${x + 2.8 * s} ${y + 0.2 * s} Z`;
}

function Noten({ x, y, r }: { x: number; y: number; r: number }) {
  const s = Math.max(1.4, r / 11);
  const plekken: [number, number, string][] = [
    [x - r * 0.8, y - r * 1.5, "#ffd23f"],
    [x + r * 0.5, y - r * 1.9, "#ffffff"],
    [x + r * 1.6, y - r * 1.4, "#ffd23f"],
    [x - r * 1.9, y - r * 0.8, "#ffffff"],
  ];
  return (
    <g>
      {plekken.map(([nx, ny, kleur], i) => (
        <path
          key={i}
          className="zweef"
          style={{ animationDelay: `${i * 0.3}s` }}
          d={notePad(nx, ny, s)}
          fill={kleur}
          stroke={VOGELLIJN}
          strokeWidth={0.9}
          strokeLinejoin="round"
        />
      ))}
    </g>
  );
}

function Vonken({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g>
      <path className="fonkel-kort" d={vonkPad(x - r * 1.1, y - r * 0.9, r * 0.28)} fill="#ffd23f" />
      <path className="fonkel-kort" style={{ animationDelay: "0.12s" }} d={sterPad(x + r * 1.3, y - r * 1.1, r * 0.26)} fill="#ffffff" stroke="#ffd23f" strokeWidth={1} />
      <path className="fonkel-kort" style={{ animationDelay: "0.24s" }} d={vonkPad(x + r * 1.7, y - r * 0.1, r * 0.2)} fill="#ffd23f" />
    </g>
  );
}

function Flits({ x, y, r }: { x: number; y: number; r: number }) {
  const t = y - r * 1.25;
  return (
    <g className="flits" fill="none" stroke="#ffb347" strokeWidth={Math.max(2, r * 0.1)} strokeLinecap="round">
      <path d={`M${x} ${t - r * 0.35} L${x} ${t} M${x - r * 0.75} ${t - r * 0.1} L${x - r * 0.5} ${t + r * 0.2} M${x + r * 0.75} ${t - r * 0.1} L${x + r * 0.5} ${t + r * 0.2}`} />
    </g>
  );
}

function Zweet({ x, y, r }: { x: number; y: number; r: number }) {
  const zx = x - r * 0.9;
  const zy = y - r * 0.9;
  const s = Math.max(0.6, r / 22);
  return (
    <path
      className="zweet"
      d={`M${zx} ${zy} Q${zx + 5 * s} ${zy + 7 * s} ${zx} ${zy + 11 * s} Q${zx - 5 * s} ${zy + 7 * s} ${zx} ${zy} Z`}
      fill="#bfe3ff"
      stroke="#6fa9e0"
      strokeWidth={1}
    />
  );
}

/** Een stuk boomstam achter een specht. */
function Stam() {
  return (
    <g>
      <path d="M44 0 L72 0 L74 200 L42 200 Z" fill="#8a6a4a" stroke={VOGELLIJN} strokeWidth={2.4} />
      <path
        d="M52 20 Q50 40 53 60 M64 8 Q66 34 63 52 M50 90 Q48 116 52 136 M66 100 Q68 130 64 150 M56 164 Q54 180 57 198"
        fill="none"
        stroke="#6a4e34"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </g>
  );
}

// ---- Samenstellen --------------------------------------------------------------

export function Vogel({
  soort,
  stemming = "rust",
  kader = "volledig",
  silhouet = false,
  className,
  naam,
  metStam = true,
}: {
  soort: Soort;
  stemming?: Stemming;
  kader?: "volledig" | "portret";
  /** Nog niet gewonnen: enkel de grijze vorm. */
  silhouet?: boolean;
  className?: string;
  naam?: string | null;
  /** Een specht met zijn stukje stam; in het landschap zit hij tegen een echte boom. */
  metStam?: boolean;
}) {
  const uid = useId().replace(/[:«»]/g, "");
  const g = soort.vorm;
  const k = soort.kleur;
  const extraAchter = soort.extra?.filter((e) => e.achter) ?? [];
  const extraVoor = soort.extra?.filter((e) => !e.achter) ?? [];
  const s = spreiding(uid);
  const stijl = { "--knipper": `${-(s % 5000)}ms`, "--wieg": `${-(s % 3000)}ms` } as CSSProperties;
  const grijs = "#8f9a8c";

  // De buitenlijn: alle delen in lijnkleur, iets dikker dan de vulling.
  const contour = (kleur: string, dik: number): ReactNode => (
    <g fill={kleur} stroke={kleur} strokeWidth={dik * 2} strokeLinejoin="round" strokeLinecap="round">
      {g.poten && <path d={g.poten} fill="none" strokeWidth={g.pootDikte + dik * 2} />}
      {extraAchter.map((e, i) => <path key={i} d={e.d} />)}
      <path d={g.staart} />
      <path d={g.lijf} />
      <path d={g.kop} />
      {extraVoor.map((e, i) => <path key={i} d={e.d} />)}
      <path d={g.snavel.d} />
      {silhouet && g.vleugels.map((v, i) => <path key={i} d={v.d} />)}
    </g>
  );

  const vleugels = g.vleugels.map((v, i) => (
    <g key={i} className={`vleugel vleugel-${i}`} style={{ transformOrigin: `${v.schouder[0]}px ${v.schouder[1]}px` }}>
      <clipPath id={`${uid}-vl${i}`}>
        <path d={v.d} />
      </clipPath>
      <path d={v.d} fill={k.vleugel} />
      {soort.vleugelTekening && (
        <g clipPath={`url(#${uid}-vl${i})`}>{soort.vleugelTekening(i)}</g>
      )}
      <path d={v.d} fill="none" stroke={VOGELLIJN} strokeWidth={DIK * 0.8} strokeLinejoin="round" />
    </g>
  ));

  const figuur = silhouet ? (
    contour(grijs, DIK)
  ) : (
    <>
      {contour(VOGELLIJN, DIK)}
      {g.poten && <path d={g.poten} fill="none" stroke={k.poot} strokeWidth={g.pootDikte} strokeLinecap="round" strokeLinejoin="round" />}
      {extraAchter.map((e, i) => <path key={i} d={e.d} fill={e.kleur} />)}
      <path d={g.staart} fill={k.staart} />
      {soort.staartTekening && (
        <>
          <clipPath id={`${uid}-st`}>
            <path d={g.staart} />
          </clipPath>
          <g clipPath={`url(#${uid}-st)`}>{soort.staartTekening}</g>
        </>
      )}
      <clipPath id={`${uid}-lijf`}>
        <path d={g.lijf} />
        <path d={g.kop} />
      </clipPath>
      <path d={g.lijf} fill={k.lijf} />
      <path d={g.kop} fill={k.kop} />
      <g clipPath={`url(#${uid}-lijf)`}>
        {k.buik && <path d={g.buik} fill={k.buik} />}
        {soort.tekening}
      </g>
      {extraVoor.map((e, i) => <path key={i} d={e.d} fill={e.kleur} />)}
      <path d={g.snavel.d} fill={k.snavel} />
      {soort.snavelTekening}
      {g.snavel.lijn && <path d={g.snavel.lijn} fill="none" stroke={VOGELLIJN} strokeWidth={1.3} strokeLinecap="round" opacity={0.7} />}
      {vleugels}
      {g.ogen.map((o, i) => (
        <OogTekening key={i} o={o} stemming={stemming} iris={k.iris} ring={k.oogring} />
      ))}
      {soort.bovenop}
    </>
  );

  const { x, y, r } = g.kop0;
  const water = g.water;
  const viewBox = kader === "portret" ? g.portret : g.kader;

  return (
    <svg
      viewBox={viewBox}
      className={`vogel stemming-${stemming} ${silhouet ? "silhouet" : ""} ${className ?? ""}`}
      style={{ ...stijl, ["--grond" as string]: `${g.grond}px` }}
      role="img"
      aria-label={naam || soort.naam}
    >
      {water !== undefined && (
        <clipPath id={`${uid}-boven`}>
          <rect x={-100} y={-100} width={400} height={water + 100} />
        </clipPath>
      )}
      {g.stam && metStam && <Stam />}
      {!silhouet && water === undefined && g.poten && !g.stam && (
        <ellipse className="vogel-grond" cx={100} cy={g.grond + 2} rx={40} ry={5} fill="#1f1a24" fillOpacity={0.14} />
      )}
      <g className="vogel-sprong">
        <g className="vogel-adem" clipPath={water !== undefined ? `url(#${uid}-boven)` : undefined}>
          {figuur}
        </g>
        {water !== undefined && !silhouet && (
          <path
            d={`M24 ${water + 1} Q40 ${water - 3} 56 ${water + 1} T88 ${water + 1} T120 ${water + 1} T152 ${water + 1} T184 ${water + 1}`}
            fill="none"
            stroke="#ffffff"
            strokeOpacity={0.8}
            strokeWidth={3}
            strokeLinecap="round"
          />
        )}
        {!silhouet && stemming === "juich" && <Noten x={x} y={y} r={r} />}
        {!silhouet && (stemming === "blij" || stemming === "draai") && <Vonken x={x} y={y} r={r} />}
        {!silhouet && stemming === "verrast" && <Flits x={x} y={y} r={r} />}
        {!silhouet && stemming === "zwaar" && <Zweet x={x} y={y} r={r} />}
      </g>
    </svg>
  );
}
