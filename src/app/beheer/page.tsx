// Beheer: wie gebruikt de app, en hoeveel? Enkel voor de e-mailadressen in
// BEHEERDERS. Bovenaan de dagtellers (activiteit.ts), daaronder de huidige
// stand van elk gezin, rechtstreeks uit de opslag.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ONDERWERPEN } from "@/data/onderwerpen";
import { laatsteDagen, nieuweReeksen } from "@/lib/activiteit";
import { opslag } from "@/lib/opslag";
import { huidigeOuder, isBeheerder } from "@/lib/ouder";
import { lees, sterrenVan, type Spel } from "@/lib/spel";

export const metadata: Metadata = { title: "beheer · oefenen", robots: { index: false } };

const DAG = 24 * 60 * 60 * 1000;
const ONDERWERP_IDS = ONDERWERPEN.map((o) => o.id);

type Profiel = { id: string; spel: Spel };
type Gezin = { email: string; profielen: Profiel[]; laatst: number };

function som(r: Record<string, number>): number {
  return Object.values(r).reduce((a, b) => a + b, 0);
}

function geleden(ms: number, nu: number): string {
  if (!ms) return "nooit";
  const dagen = Math.floor((nu - ms) / DAG);
  if (dagen < 1) return "vandaag";
  if (dagen < 2) return "gisteren";
  return `${dagen} dagen geleden`;
}

function datum(ms: number): string {
  if (!ms) return "";
  return new Intl.DateTimeFormat("nl-BE", {
    timeZone: "Europe/Brussels",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(ms));
}

function korteDag(dag: string): string {
  const [j, m, d] = dag.split("-").map(Number);
  return new Intl.DateTimeFormat("nl-BE", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }).format(
    new Date(Date.UTC(j, m - 1, d)),
  );
}

function Tegel({ getal, label }: { getal: number; label: string }) {
  return (
    <div className="beheer-tegel">
      <strong>{getal}</strong>
      <span>{label}</span>
    </div>
  );
}

export default async function Beheer() {
  const ouder = await huidigeOuder();
  if (!ouder) {
    return (
      <main className="scherm ouder">
        <div className="ouder-inhoud">
          <section className="paneel">
            <h1>Beheer</h1>
            <p>
              <Link href="/">Log eerst in</Link> met een beheerdersaccount.
            </p>
          </section>
        </div>
      </main>
    );
  }
  if (!isBeheerder(ouder)) notFound();

  const db = opslag();
  if (!db) {
    return (
      <main className="scherm ouder">
        <div className="ouder-inhoud">
          <section className="paneel">
            <h1>Beheer</h1>
            <p>Er is geen databank ingesteld.</p>
          </section>
        </div>
      </main>
    );
  }

  // De pagina wordt per bezoek opgebouwd; "nu" hoort bij dat bezoek.
  // eslint-disable-next-line react-hooks/purity
  const nu = Date.now();
  const dertig = laatsteDagen(30, nu);
  const [maand, week, emails] = await Promise.all([
    db.activiteit(dertig),
    db.activiteit(dertig.slice(-7)),
    db.gezinnen(),
  ]);

  const gezinnen: Gezin[] = await Promise.all(
    emails.map(async (email) => {
      const profielen: Profiel[] = [];
      for (const [id, data] of Object.entries(await db.profielen(email))) {
        const spel = lees(data);
        if (spel) profielen.push({ id, spel });
      }
      profielen.sort((a, b) => (b.spel.bijgewerkt ?? 0) - (a.spel.bijgewerkt ?? 0));
      return { email, profielen, laatst: profielen[0]?.spel.bijgewerkt ?? 0 };
    }),
  );
  gezinnen.sort((a, b) => b.laatst - a.laatst);

  const profielen = gezinnen.flatMap((g) => g.profielen);
  const actief = (dagen: number) => (lijst: { laatst: number }[]) =>
    lijst.filter((x) => x.laatst && nu - x.laatst < dagen * DAG).length;
  const profielLaatst = profielen.map((p) => ({ laatst: p.spel.bijgewerkt ?? 0 }));

  const reeksenWeek = week.dagen.reduce((n, d) => n + som(d.reeksen), 0);
  const reeksenMaand = maand.dagen.reduce((n, d) => n + som(d.reeksen), 0);
  const kolommen = [
    ...ONDERWERP_IDS,
    ...new Set(maand.dagen.flatMap((d) => Object.keys(d.reeksen)).filter((o) => !ONDERWERP_IDS.includes(o))),
  ];
  const meesteReeksen = Math.max(1, ...maand.dagen.map((d) => som(d.reeksen)));

  return (
    <main className="scherm ouder">
      <div className="beheer-inhoud">
        <section className="paneel">
          <h1>Beheer</h1>
          <p className="uitleg">
            Bovenaan de dagtellers: hoeveel gezinnen en profielen er per dag speelden en hoeveel reeksen er voor het eerst
            uitgespeeld werden. Daaronder de huidige stand van elk gezin.
          </p>
        </section>

        <section className="paneel">
          <h2>Afgelopen dagen</h2>
          <div className="beheer-tegels">
            <Tegel getal={week.gezinnen} label="gezinnen, 7 dagen" />
            <Tegel getal={maand.gezinnen} label="gezinnen, 30 dagen" />
            <Tegel getal={week.profielen} label="profielen, 7 dagen" />
            <Tegel getal={maand.profielen} label="profielen, 30 dagen" />
            <Tegel getal={reeksenWeek} label="nieuwe reeksen, 7 dagen" />
            <Tegel getal={reeksenMaand} label="nieuwe reeksen, 30 dagen" />
          </div>
          <div className="beheer-tabel">
            <table>
              <thead>
                <tr>
                  <th>dag</th>
                  <th>gezinnen</th>
                  <th>profielen</th>
                  {kolommen.map((o) => (
                    <th key={o}>{o}</th>
                  ))}
                  <th className="beheer-balk-kolom">reeksen</th>
                </tr>
              </thead>
              <tbody>
                {[...maand.dagen].reverse().map((d) => (
                  <tr key={d.dag} className={d.profielen === 0 ? "beheer-stil" : undefined}>
                    <td>{korteDag(d.dag)}</td>
                    <td>{d.gezinnen}</td>
                    <td>{d.profielen}</td>
                    {kolommen.map((o) => (
                      <td key={o}>{d.reeksen[o] ?? 0}</td>
                    ))}
                    <td className="beheer-balk-kolom">
                      <span className="beheer-balk" style={{ width: `${(som(d.reeksen) / meesteReeksen) * 80}%` }} />
                      <span className="beheer-balk-getal">{som(d.reeksen)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="paneel">
          <h2>Gezinnen</h2>
          <div className="beheer-tegels">
            <Tegel getal={gezinnen.length} label="gezinnen" />
            <Tegel getal={profielen.length} label="profielen" />
            <Tegel getal={actief(7)(gezinnen)} label="gezinnen gespeeld, 7 dagen" />
            <Tegel getal={actief(30)(gezinnen)} label="gezinnen gespeeld, 30 dagen" />
            <Tegel getal={actief(7)(profielLaatst)} label="profielen gespeeld, 7 dagen" />
            <Tegel getal={actief(30)(profielLaatst)} label="profielen gespeeld, 30 dagen" />
          </div>
          {gezinnen.length === 0 && <p className="uitleg">Nog geen gezinnen.</p>}
          {gezinnen.map((g) => (
            <div key={g.email} className="beheer-gezin">
              <h3>
                {g.email} <span className="uitleg">· {geleden(g.laatst, nu)}</span>
              </h3>
              <div className="beheer-tabel">
                <table>
                  <thead>
                    <tr>
                      <th>profiel</th>
                      <th>leerjaar</th>
                      <th>reeksen klaar</th>
                      <th>avatars</th>
                      <th>laatst gespeeld</th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.profielen.map(({ id, spel }) => {
                      const klaar = nieuweReeksen({ klaar: [] }, spel);
                      return (
                        <tr key={id}>
                          <td>{spel.naam ?? "?"}</td>
                          <td>{spel.leerjaar ?? "–"}</td>
                          <td>
                            {Object.keys(klaar).length === 0
                              ? "–"
                              : Object.entries(klaar)
                                  .map(([o, n]) => `${o} ${n}`)
                                  .join(", ")}
                          </td>
                          <td>
                            {Object.keys(spel.avatars).length === 0
                              ? "–"
                              : Object.keys(spel.avatars)
                                  .map((a) => `${a} ${"★".repeat(sterrenVan(spel, a)) || "·"}`)
                                  .join(", ")}
                          </td>
                          <td title={datum(spel.bijgewerkt ?? 0)}>{geleden(spel.bijgewerkt ?? 0, nu)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
