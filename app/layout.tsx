import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat, Literata, Qwigley, Playfair_Display, Qwitcher_Grypen } from "next/font/google";
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
  title: "Alexander & Eleanor | The Wedding Invitation",
  description:
    "You are cordially invited to celebrate the marriage of Alexander and Eleanor on Saturday, October 24, 2026, in Florence, Italy.",
  keywords: ["wedding", "invitation", "Alexander & Eleanor", "Florence Italy", "Villa La Massa"],
  authors: [{ name: "Alexander & Eleanor" }],
  openGraph: {
    title: "Alexander & Eleanor | The Wedding Invitation",
    description: "Join us in celebrating our wedding day in Florence, Italy.",
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
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-brand-cream text-brand-charcoal selection:bg-brand-gold selection:text-brand-emerald">
        <LenisProvider>
          <main className="flex-grow flex flex-col">{children}</main>
        </LenisProvider>
      </body>
    </html>
  );
}
