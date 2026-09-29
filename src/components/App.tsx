"use client";

import { useEffect, useState } from "react";
import { onderwerpenVoor, vindReeks } from "@/data/onderwerpen";
import { kiesProfiel, themaVan, useSpel, useStaat } from "@/lib/state";
import { startSync, useSyncStatus } from "@/lib/sync";
import { Aanmelden, type Aanmeldopties } from "./Aanmelden";
import { AvatarKiezen } from "./AvatarKiezen";
import { Beloning } from "./Beloning";
import { Kaart } from "./Kaart";
import { Kast } from "./Kast";
import { Landschap } from "./Landschap";
import { LeerjaarKiezen } from "./LeerjaarKiezen";
import { Lezen } from "./Lezen";
import { OnderwerpKiezen } from "./OnderwerpKiezen";
import { Rekenen } from "./Rekenen";
import { Ouder } from "./Ouder";
import { ProfielKiezen } from "./ProfielKiezen";

export type Scherm =
  | { naam: "kaart" }
  /** Een reeks oefenen: voorlezen of sommen, volgens het onderwerp. */
  | { naam: "oefenen"; reeks: string }
  | { naam: "beloning"; reeks: string; eerste: boolean }
  /** De kast, bij een vogel het landschap, bij een held het hoofdkwartier; `nieuw` is net gewonnen. */
  | { naam: "kast"; nieuw?: string }
  | { naam: "pop" }
  | { naam: "ouder" };

export function App({ aanmelden }: { aanmelden: Aanmeldopties }) {
  const staat = useStaat();
  const spel = useSpel();
  const sync = useSyncStatus();
  const [scherm, zetScherm] = useState<Scherm>({ naam: "kaart" });
  // Welk onderwerp elk profiel open heeft (enkel nodig als er meer dan één is).
  const [gekozen, zetGekozen] = useState<Record<string, string | null>>({});

  useEffect(() => {
    void startSync();
  }, []);

  // Met een vogel als avatar krijgt de hele app natuurkleuren, met een held
  // stripkleuren (zie globals.css).
  const thema = spel?.avatar ? themaVan(spel) : null;
  useEffect(() => {
    if (thema === "vogels" || thema === "helden") document.documentElement.dataset.thema = thema;
    else delete document.documentElement.dataset.thema;
  }, [thema]);

  // Na afmelden (of account verwijderen) begint wie inlogt weer bij het begin.
  const [vorigeLogin, zetVorigeLogin] = useState(sync.ingelogd);
  if (vorigeLogin !== sync.ingelogd) {
    zetVorigeLogin(sync.ingelogd);
    if (sync.ingelogd === false) zetScherm({ naam: "kaart" });
  }

  // Met maar één profiel hoeft er niets gekozen te worden.
  const ids = staat ? Object.keys(staat.lokaal.profielen) : [];
  const enigProfiel = ids.length === 1 ? ids[0] : null;
  useEffect(() => {
    if (sync.gestart && enigProfiel && !staat?.actief) kiesProfiel(enigProfiel);
  }, [sync.gestart, enigProfiel, staat?.actief]);

  // Op de server (en heel even in de browser) is er nog niets bekend.
  if (!staat) return <div className="laden" />;
  const heeftProfielen = ids.length > 0;
  // Nog niets op dit toestel: eerst horen of er iemand ingelogd is.
  if (!sync.gestart && !heeftProfielen) return <div className="laden" />;

  // Niet (meer) ingelogd. Zonder internet mag er wel verder gespeeld worden
  // met de profielen die al op dit toestel staan.
  if (sync.ingelogd === false || (sync.ingelogd === null && !heeftProfielen)) {
    return <Aanmelden opties={aanmelden} />;
  }

  if (scherm.naam === "ouder") return <Ouder spel={spel} ga={zetScherm} />;
  if (!spel) return <ProfielKiezen ga={zetScherm} />;

  if (!spel.avatar || !spel.naam || scherm.naam === "pop") {
    return <AvatarKiezen spel={spel} klaar={() => zetScherm({ naam: scherm.naam === "pop" ? "kast" : "kaart" })} />;
  }

  // Het leerjaar bepaalt de onderwerpen; heeft de ouder het niet ingesteld,
  // dan kiest het kind het zelf.
  const onderwerpen = onderwerpenVoor(spel.leerjaar);
  if (onderwerpen.length === 0) return <LeerjaarKiezen spel={spel} />;
  const profiel = staat.actief ?? "";
  const kiesOnderwerp = (id: string | null) => zetGekozen((g) => ({ ...g, [profiel]: id }));
  const onderwerp =
    onderwerpen.find((o) => o.id === gekozen[profiel]) ?? (onderwerpen.length === 1 ? onderwerpen[0] : undefined);

  switch (scherm.naam) {
    case "oefenen":
      return vindReeks(scherm.reeks)?.onderwerp.soort === "som" ? (
        <Rekenen key={scherm.reeks} spel={spel} reeksId={scherm.reeks} ga={zetScherm} />
      ) : (
        <Lezen key={scherm.reeks} spel={spel} reeksId={scherm.reeks} ga={zetScherm} />
      );
    case "beloning":
      return <Beloning spel={spel} reeksId={scherm.reeks} eerste={scherm.eerste} ga={zetScherm} />;
    case "kast":
      return themaVan(spel) === "vogels" ? (
        <Landschap spel={spel} nieuw={scherm.nieuw} ga={zetScherm} />
      ) : (
        <Kast spel={spel} ga={zetScherm} />
      );
    default:
      if (!onderwerp) return <OnderwerpKiezen spel={spel} onderwerpen={onderwerpen} kies={kiesOnderwerp} />;
      return (
        <Kaart
          spel={spel}
          onderwerp={onderwerp}
          anderOnderwerp={onderwerpen.length > 1 ? () => kiesOnderwerp(null) : undefined}
          ga={zetScherm}
        />
      );
  }
}
