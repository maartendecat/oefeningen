// Inloggen voor ouders, met Better Auth in "stateless" modus: de login zit
// in een versleuteld cookie, er is geen gebruikersdatabank nodig. Het gezin
// wordt herkend aan het e-mailadres, zodat Google en (later) Facebook met
// hetzelfde adres bij hetzelfde gezin uitkomen.
//
// Nodig in de omgeving: BETTER_AUTH_SECRET, BETTER_AUTH_URL,
// GOOGLE_CLIENT_ID en GOOGLE_CLIENT_SECRET. Facebook staat klaar en gaat
// aan zodra FACEBOOK_CLIENT_ID en FACEBOOK_CLIENT_SECRET gezet zijn.

import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

/** Een ouder blijft 90 dagen ingelogd; elk gebruik verlengt dat. */
const LOGIN_DUUR = 90 * 24 * 60 * 60;

export const googleAan = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
export const facebookAan = !!(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET);

export const auth = betterAuth({
  socialProviders: {
    ...(googleAan && {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        // Op een gedeelde iPad wil je kunnen kiezen met welk account.
        prompt: "select_account" as const,
      },
    }),
    ...(facebookAan && {
      facebook: {
        clientId: process.env.FACEBOOK_CLIENT_ID!,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      },
    }),
  },
  session: {
    expiresIn: LOGIN_DUUR,
    cookieCache: {
      enabled: true,
      maxAge: LOGIN_DUUR,
      strategy: "jwe",
      refreshCache: true,
    },
  },
  account: {
    storeStateStrategy: "cookie",
    storeAccountCookie: true,
  },
  plugins: [nextCookies()],
});
