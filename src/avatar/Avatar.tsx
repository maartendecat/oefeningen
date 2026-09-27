// De avatar van een profiel: een pop met kleren of een vogel, afhankelijk
// van wat het kind koos. Schermen tekenen de avatar via dit bestand, zodat
// ze niet hoeven te weten welk thema het is.

import { PORTRET, Pop, STRAK, VOLLEDIG, vindBasis, type Stemming } from "./Pop";
import { Vogel } from "./Vogel";
import { vindVogel } from "./vogels";
import type { Spel } from "@/lib/spel";

export type Kader = "volledig" | "strak" | "portret";

export function Avatar({
  spel,
  stemming = "rust",
  kader = "volledig",
  className,
  naam,
}: {
  spel: Pick<Spel, "avatar" | "aan">;
  stemming?: Stemming;
  kader?: Kader;
  className?: string;
  naam?: string | null;
}) {
  const vogel = vindVogel(spel.avatar);
  if (vogel?.start) {
    return (
      <Vogel
        soort={vogel}
        stemming={stemming}
        kader={kader === "portret" ? "portret" : "volledig"}
        className={className}
        naam={naam}
      />
    );
  }
  return (
    <Pop
      basis={vindBasis(spel.avatar)}
      aan={spel.aan}
      stemming={stemming}
      kader={kader === "portret" ? PORTRET : kader === "strak" ? STRAK : VOLLEDIG}
      className={className}
      naam={naam}
    />
  );
}
