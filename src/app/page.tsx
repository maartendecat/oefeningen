import { App } from "@/components/App";
import { facebookAan, googleAan } from "@/lib/auth";
import { testLoginAan } from "@/lib/ouder";

export default function Home() {
  return <App aanmelden={{ google: googleAan, facebook: facebookAan, test: testLoginAan }} />;
}
