// Getekende icoontjes voor de grote knoppen. Een teken uit het lettertype
// (✓, ↻) staat nooit precies in het midden; deze wel.

function Lijn({ d }: { d: string }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke="var(--inkt)" strokeWidth={13} />
      <path d={d} stroke="#ffffff" strokeWidth={7} />
    </g>
  );
}

export function Vink({ className = "icoon" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <Lijn d="M11 25 L20 34 L37 14" />
    </svg>
  );
}

export function Opnieuw({ className = "icoon" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <Lijn d="M39 25 A15 15 0 1 1 29 10.5" />
      <path d="M25 2 L38 10 L26 19 Z" fill="#ffffff" stroke="var(--inkt)" strokeWidth={3} strokeLinejoin="round" />
    </svg>
  );
}

export function Pijl({ className = "icoon" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <Lijn d="M10 24 L36 24 M26 13 L37 24 L26 35" />
    </svg>
  );
}
