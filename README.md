# oefenen op lezen

Een leesspelletje voor het eerste leerjaar, volgens de lettervolgorde van
*Veilig leren lezen* (kim-versie). Het kind leest reeksen van tien woordjes en
zinnetjes luidop voor, een ouder tikt ✓ of ↻, en na elke reeks mag het kind een
nieuw kledingstuk kiezen voor de eigen pop.

Alles draait in de browser: de voortgang zit in `localStorage`, er is geen
backend.

## Ontwikkelen

```bash
npm install
npm run dev     # http://localhost:3000
npm test        # controleert de leesinhoud
npm run lint
```

## Hoe het in elkaar zit

| Pad | Wat |
|---|---|
| `src/data/levels.ts` | De leesinhoud: levels (één nieuwe klank per level) met reeksen van tien oefeningen. |
| `src/data/levels.test.ts` | Bewaakt dat elk woord enkel gekende klanken gebruikt, één klinker heeft en geen medeklinkerclusters bevat, en dat een reeks niet korter wordt naar het einde. |
| `src/lib/klanken.ts` | Hakt woorden in klanken (`kaas` → `k · aa · s`). |
| `src/lib/state.ts` | Spelstatus in `localStorage`, plus alle acties. |
| `src/avatar/` | De aankleedpop (`Pop.tsx`) en alle kleren (`items.tsx`), als SVG. |
| `src/components/` | De schermen: pop kiezen, levelkaart, lezen, beloning, kast, oudermenu. |

### Nieuwe letters toevoegen

Voeg in `src/data/levels.ts` een level toe met de nieuwe klank(en) in `nieuw`
en een paar reeksen van tien oefeningen. `npm test` zegt meteen of er een woord
tussen zit dat nog niet leesbaar is. Voor elke extra reeks is het leuk om ook
een extra item in `src/avatar/items.tsx` te tekenen, zodat er genoeg te winnen
blijft.

### Oudermenu

Het tandwieltje op de kaart, beveiligd met een maalsom. Daar kan je:
- de startletter kiezen (bv. meteen bij de `e` beginnen),
- het geluid aan- of uitzetten,
- de voortgang als code kopiëren naar een ander toestel,
- alles wissen.

## Hosting

Vercel: importeer de GitHub-repo, Vercel herkent Next.js vanzelf. Er zijn geen
omgevingsvariabelen nodig.
