"use client";

import { useState } from "react";
import { BASISSEN, PORTRET, Pop } from "@/avatar/Pop";
import { Vogel } from "@/avatar/Vogel";
import { STARTKLEREN } from "@/avatar/items";
import { STARTVOGELS } from "@/avatar/vogels";
import { aanmeldenMetFacebook, aanmeldenMetGoogle, testAanmelden, useSyncStatus } from "@/lib/sync";

export type Aanmeldopties = { google: boolean; facebook: boolean; test: boolean };

/** Het officiële "G"-logo, zoals Google het voor inlogknoppen vraagt. */
function GoogleG() {
  return (
    <svg viewBox="0 0 48 48" className="login-logo" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

export function Aanmelden({ opties }: { opties: Aanmeldopties }) {
  const sync = useSyncStatus();
  const [bezig, zetBezig] = useState(false);
  const [fout, zetFout] = useState<string | null>(null);

  const doe = async (f: () => Promise<void>) => {
    zetBezig(true);
    zetFout(null);
    try {
      await f();
    } catch {
      zetFout("Inloggen lukte niet. Is er internet?");
    }
    zetBezig(false);
  };

  return (
    <main className="scherm aanmelden">
      <div className="aanmelden-avatars" aria-hidden="true">
        {/* Om beurt een pop en een vogel: er zijn twee thema's. */}
        {BASISSEN.slice(0, 3).flatMap((b, i) => [
          <span key={b.id} className="profiel-portret klein" style={{ animationDelay: `${i * 0.24}s` }}>
            <Pop basis={b} aan={STARTKLEREN} kader={PORTRET} />
          </span>,
          <span key={STARTVOGELS[i].id} className="profiel-portret klein vogel-portret" style={{ animationDelay: `${i * 0.24 + 0.12}s` }}>
            <Vogel soort={STARTVOGELS[i]} kader="portret" />
          </span>,
        ])}
      </div>
      <h1 className="titel groot">lezen!</h1>

      <section className="paneel aanmelden-paneel">
        <h2>Voor ouders</h2>
        <p>
          Log in om voor elk kind een profiel te maken. De voortgang wordt bewaard in je account, zodat je ook op
          een ander toestel verder kan.
        </p>
        <div className="login-knoppen">
          {opties.google && (
            <button className="login-knop" disabled={bezig} onClick={() => doe(aanmeldenMetGoogle)}>
              <GoogleG />
              Inloggen met Google
            </button>
          )}
          {opties.facebook && (
            <button className="login-knop facebook" disabled={bezig} onClick={() => doe(aanmeldenMetFacebook)}>
              Inloggen met Facebook
            </button>
          )}
          {opties.test && (
            <button className="login-knop test" disabled={bezig} onClick={() => doe(() => testAanmelden())}>
              Test-login (enkel lokaal)
            </button>
          )}
          {!opties.google && !opties.facebook && !opties.test && (
            <p className="fout">Inloggen staat nog niet ingesteld op deze server.</p>
          )}
        </div>
        {(fout || sync.offline) && <p className="fout">{fout ?? "Geen verbinding met internet."}</p>}
        <p className="uitleg">
          We bewaren enkel je e-mailadres, de namen van de profielen en hun leesvoortgang.{" "}
          <a href="/privacy">Privacy</a>
        </p>
      </section>
    </main>
  );
}
