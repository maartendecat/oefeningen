import type { Metadata, Viewport } from "next";
import { Andika } from "next/font/google";
import "./globals.css";

// Andika is gemaakt voor beginnende lezers: een "kinder-a" en "kinder-g",
// zoals in het leesboek.
const andika = Andika({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-andika",
});

export const metadata: Metadata = {
  title: "oefenen op lezen",
  description: "Leren lezen met Veilig leren lezen, en je avatar aankleden of vogels verzamelen.",
  appleWebApp: { capable: true, title: "lezen", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#ffe8f3",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="nl-BE" className={andika.variable}>
      <body>{children}</body>
    </html>
  );
}
