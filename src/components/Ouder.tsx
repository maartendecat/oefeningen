"use client";

import { useState, type ReactNode } from "react";
import { Avatar } from "@/avatar/Avatar";
import { ALLE_REEKSEN, LEVELS } from "@/data/levels";
import {
  exporteer,
  hernoemProfiel,
  importeer,
  maakProfiel,
  useStaat,
  wisVoortgang,
  zetStil,
  zetVoortgang,
  type Spel,
} from "@/lib/state";
import { afmelden, useSyncStatus, verwijderAccount, wisProfiel } from "@/lib/sync";
import type { Scherm } from "./App";

const MAX_NAAM = 12;
const MAX_PROFIELEN = 12;

function Poort({ open }: { open: () => void }) {
  const [som] = useState(() => {
    const a = 6 + Math.floor(Math.random() * 4);
    const b = 6 + Math.floor(Math.random() * 4);
    return { a, b };
  });
  const [antwoord, zetAntwoord] = useState("");
  const [fout, zetFout] = useState(false);

  return (
    <form
      className="paneel poort"
      onSubmit={(e) => {
        e.preventDefault();
        if (Number(antwoord) === som.a * som.b) open();
        else {
          zetFout(true);
          zetAntwoord("");
        }
      }}
    >
      <h2>Voor ouders</h2>
      <p>
        Hoeveel is {som.a} × {som.b}?
      </p>
      <input
        className="invoer"
        inputMode="numeric"
        pattern="[0-9]*"
        autoFocus
        value={antwoord}
        onChange={(e) => zetAntwoord(e.target.value)}
      />
      {fout && <p className="fout">Dat klopt niet.</p>}
      <button className="knop" type="submit">
        Open
      </button>
    </form>
  );
}

/**
 * Een knop die eerst om bevestiging vraagt, in de pagina zelf. De
 * confirm()-dialoog van de browser verschijnt niet overal (bv. niet in een
 * ingebouwd browservenster) en zegt dan stilletjes "nee".
 */
function Bevestig({
  vraag,
  doe,
  className = "knop rood",
  disabled,
  children,
}: {
  vraag: string;
  doe: () => void | Promise<void>;
  className?: string;
  disabled?: boolean;
  children: ReactNode;
}) {
  const [vragen, zetVragen] = useState(false);
  if (!vragen) {
    return (
      <button className={className} disabled={disabled} onClick={() => zetVragen(true)}>
        {children}
      </button>
    );
  }
  return (
    <div className="bevestig" role="alertdialog" aria-label={vraag}>
      <p>{vraag}</p>
      <div className="bevestig-knoppen">
        <button
          className={className}
          onClick={() => {
            zetVragen(false);
            void doe();
          }}
        >
          Ja
        </button>
        <button className="knop" onClick={() => zetVragen(false)} autoFocus>
          Nee
        </button>
      </div>
    </div>
  );
}

/** Kleine letters, zoals alles wat het kind leest. */
const netjes = (naam: string) => naam.toLowerCase().slice(0, MAX_NAAM);

function Account({ meld }: { meld: (t: string) => void }) {
  const sync = useSyncStatus();
  const [bezig, zetBezig] = useState(false);
  // Afmelden op een server zonder databank wist alles: dat vragen we apart.
  const [geenOpslag, zetGeenOpslag] = useState(false);
  return (
    <section className="paneel">
      <h2>Account</h2>
      {sync.ouder ? (
        <p>
          Ingelogd als <strong>{sync.ouder.email}</strong>.
        </p>
      ) : (
        <p className="uitleg">Nu even geen verbinding met de server.</p>
      )}
      {!sync.opslag && (
        <p className="uitleg">Op deze server staat geen databank ingesteld: de profielen blijven enkel op dit toestel.</p>
      )}
      {sync.offline && <p className="uitleg">Geen verbinding: wijzigingen gaan mee zodra die er weer is.</p>}
      {geenOpslag ? (
        <Bevestig
          vraag="Deze server bewaart niets online: afmelden wist de profielen van dit toestel definitief. Toch afmelden?"
          doe={async () => {
            zetGeenOpslag(false);
            await afmelden({ toch: true });
          }}
        >
          Toch afmelden
        </Bevestig>
      ) : (
        <Bevestig
          className="knop"
          disabled={bezig}
          vraag="Afmelden? De profielen blijven bewaard in je account, maar verdwijnen van dit toestel."
          doe={async () => {
            zetBezig(true);
            const uitkomst = await afmelden();
            zetBezig(false);
            if (uitkomst === "offline") {
              meld("Er is voortgang die nog niet bewaard is. Maak eerst verbinding met internet en probeer opnieuw.");
            } else if (uitkomst === "geen-opslag") {
              zetGeenOpslag(true);
            }
          }}
        >
          {bezig ? "Even bewaren…" : "Afmelden"}
        </Bevestig>
      )}
    </section>
  );
}

function Profielen({ meld }: { meld: (t: string) => void }) {
  const staat = useStaat();
  const [nieuw, zetNieuw] = useState("");
  if (!staat) return null;
  const profielen = Object.entries(staat.lokaal.profielen);

  return (
    <section className="paneel">
      <h2>Profielen</h2>
      <p className="uitleg">
        Elk kind heeft een eigen avatar, voortgang en kast (of vogels). Wisselen kan het kind zelf.
      </p>
      <ul className="profiel-lijst">
        {profielen.map(([id, spel]) => (
          <li key={id} className="profiel-rij">
            <span className="profiel-mini">
              {spel.avatar ? (
                <Avatar spel={spel} kader="portret" />
              ) : (
                <span className="profiel-vraag">?</span>
              )}
            </span>
            <input
              className="invoer naam-veld"
              defaultValue={spel.naam ?? ""}
              maxLength={MAX_NAAM}
              aria-label="naam"
              autoCapitalize="none"
              onBlur={(e) => {
                const naam = netjes(e.target.value.trim());
                if (naam && naam !== spel.naam) {
                  hernoemProfiel(id, naam);
                  meld(`Hernoemd naar "${naam}".`);
                }
              }}
            />
            <span className="profiel-stand">
              {spel.klaar.length} / {ALLE_REEKSEN.length}
            </span>
            <Bevestig
              className="knop rood klein"
              vraag={`Het profiel van "${spel.naam ?? "?"}" met alle voortgang, kleren en vogels verwijderen?`}
              doe={async () => {
                await wisProfiel(id);
                meld("Profiel verwijderd.");
              }}
            >
              Verwijder
            </Bevestig>
          </li>
        ))}
      </ul>
      {profielen.length < MAX_PROFIELEN && (
        <form
          className="koppel"
          onSubmit={(e) => {
            e.preventDefault();
            const naam = netjes(nieuw.trim());
            if (!naam) return;
            maakProfiel(naam);
            zetNieuw("");
            meld(`Profiel "${naam}" toegevoegd.`);
          }}
        >
          <input
            className="invoer naam-veld"
            placeholder="naam van het kind"
            value={nieuw}
            maxLength={MAX_NAAM}
            onChange={(e) => zetNieuw(e.target.value)}
            autoCapitalize="none"
          />
          <button className="knop" type="submit" disabled={!nieuw.trim()}>
            + Profiel toevoegen
          </button>
        </form>
      )}
    </section>
  );
}

function Instellingen({ spel, meld, ga }: { spel: Spel; meld: (t: string) => void; ga: (s: Scherm) => void }) {
  const [code, zetCode] = useState("");
  const reeksIds = ALLE_REEKSEN.map((p) => p.reeks.id);
  const naam = spel.naam ?? "dit profiel";

  return (
    <>
      <section className="paneel">
        <h2>Voortgang van {naam}</h2>
        <p>
          {spel.klaar.length} van {reeksIds.length} reeksen gedaan, {spel.kast.length}{" "}
          {spel.kast.length === 1 ? "item" : "items"} en {spel.vogels.length}{" "}
          {spel.vogels.length === 1 ? "vogel" : "vogels"} gewonnen.
        </p>
        <p className="uitleg">
          Laat {naam} starten bij een bepaalde letter. Alle reeksen daarvoor tellen dan als gedaan en leveren elk
          een willekeurig item op (of een vogel, als {naam} een vogel als avatar heeft). Teruggaan neemt niets af.
        </p>
        <div className="level-keuze">
          {LEVELS.map((level) => {
            const eerste = ALLE_REEKSEN.find((p) => p.level.id === level.id)!;
            return (
              <button
                key={level.id}
                className="knop"
                onClick={() => {
                  zetVoortgang(reeksIds, eerste.index);
                  meld(`${naam} start nu bij "${level.nieuw.join(" ")}".`);
                }}
              >
                {level.nieuw.join(" ")}
              </button>
            );
          })}
        </div>
      </section>

      <section className="paneel">
        <h2>Geluid</h2>
        <button className="knop" onClick={() => zetStil(!spel.stil)}>
          {spel.stil ? "Geluid aanzetten" : "Geluid uitzetten"}
        </button>
      </section>

      <section className="paneel">
        <h2>Reservekopie van {naam}</h2>
        <p className="uitleg">Werkt ook zonder account: kopieer deze code en plak ze in een ander profiel.</p>
        <textarea className="invoer code" readOnly value={exporteer(spel)} onFocus={(e) => e.target.select()} />
        <button
          className="knop"
          onClick={() => {
            void navigator.clipboard?.writeText(exporteer(spel));
            meld("Code gekopieerd.");
          }}
        >
          Kopieer code
        </button>
        <textarea
          className="invoer code"
          placeholder="Plak hier een code"
          value={code}
          onChange={(e) => zetCode(e.target.value)}
        />
        <button
          className="knop"
          disabled={!code.trim()}
          onClick={() => {
            const ok = importeer(code);
            meld(ok ? "Voortgang ingeladen." : "Die code werkt niet.");
            if (ok) zetCode("");
          }}
        >
          Laad code
        </button>
      </section>

      <section className="paneel gevaar">
        <h2>Opnieuw beginnen</h2>
        <Bevestig
          vraag={`Alle voortgang, kleren, vogels en de avatar van ${naam} wissen? De naam blijft.`}
          doe={() => {
            wisVoortgang();
            ga({ naam: "kaart" });
          }}
        >
          Wis de voortgang van {naam}
        </Bevestig>
      </section>
    </>
  );
}

export function Ouder({ spel, ga }: { spel: Spel | null; ga: (s: Scherm) => void }) {
  const [open, zetOpen] = useState(false);
  const [melding, zetMelding] = useState<string | null>(null);

  return (
    <main className="scherm ouder">
      <header className="balk">
        <button className="knop-rond" onClick={() => ga({ naam: "kaart" })} aria-label="terug">
          ✖
        </button>
        <h1 className="titel">oudermenu</h1>
        <span />
      </header>

      {!open ? (
        <Poort open={() => zetOpen(true)} />
      ) : (
        <div className="ouder-inhoud">
          {melding && <p className="melding">{melding}</p>}
          <Account meld={zetMelding} />
          <Profielen meld={zetMelding} />
          {spel && <Instellingen spel={spel} meld={zetMelding} ga={ga} />}
          <section className="paneel gevaar">
            <h2>Account verwijderen</h2>
            <p className="uitleg">Verwijdert alle profielen en hun voortgang van de server, en meldt je af.</p>
            <Bevestig
              vraag="Alle profielen en alle voortgang van dit gezin definitief verwijderen?"
              doe={async () => {
                try {
                  await verwijderAccount();
                } catch {
                  zetMelding("Verwijderen lukte niet. Is er internet?");
                }
              }}
            >
              Verwijder mijn account
            </Bevestig>
          </section>
        </div>
      )}
    </main>
  );
}
