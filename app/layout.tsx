import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Montserrat,
  Literata,
  Qwigley,
  Playfair_Display,
  Qwitcher_Grypen,
} from "next/font/google";
import { LenisProvider } from "@/components/providers/lenis-provider";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif-cormorant",
  weight: ["300", "400", "500", "600", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans-montserrat",
  weight: ["300", "400", "500", "600", "700"],
});

const literata = Literata({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-literata",
  weight: ["300", "400", "500", "600", "700"],
});

const qwigley = Qwigley({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-qwigley",
  weight: ["400"],
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

const qwitcherGrypen = Qwitcher_Grypen({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-qwitcher",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Kinan & Faiz | The Wedding Invitation",
  description:
    "You are cordially invited to celebrate the marriage of Kinan and Faiz on August 16, 2026, in Bandung.",
  keywords: ["wedding", "invitation", "Kinan & Faiz", "Bandung"],
  authors: [{ name: "Kinan & Faiz" }],
  openGraph: {
    title: "Kinan & Faiz | The Wedding Invitation",
    description: "Join Kinan and Faiz in celebrating their wedding day on August 16, 2026.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${montserrat.variable} ${literata.variable} ${qwigley.variable} ${playfairDisplay.variable} ${qwitcherGrypen.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className="bg-brand-cream text-brand-charcoal selection:bg-brand-gold selection:text-brand-emerald flex min-h-full flex-col"
      >
        <LenisProvider>
          <main className="flex flex-grow flex-col">{children}</main>
        </LenisProvider>
      </body>
    </html>
  );
}
