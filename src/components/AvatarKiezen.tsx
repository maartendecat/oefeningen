"use client";

import { BASISSEN, Pop } from "@/avatar/Pop";
import { klik } from "@/lib/geluid";
import { kiesAvatar, type Spel } from "@/lib/state";

export function AvatarKiezen({ spel, klaar }: { spel: Spel; klaar: () => void }) {
  return (
    <main className="scherm kiezen">
      <h1 className="titel">kies je pop</h1>
      <div className="kiezen-rij">
        {BASISSEN.map((b) => (
          <button
            key={b.id}
            className={`kaartje pop-kaartje ${spel.avatar === b.id ? "gekozen" : ""}`}
            onClick={() => {
              if (!spel.stil) klik();
              kiesAvatar(b.id);
              klaar();
            }}
          >
            <Pop basis={b} aan={spel.aan} className="pop-klein" />
            <span className="pop-naam">{b.naam}</span>
          </button>
        ))}
      </div>
    </main>
  );
}
