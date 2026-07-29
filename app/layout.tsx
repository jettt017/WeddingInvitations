import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const cormorant = localFont({
  src: "./fonts/cormorant-garamond-latin.woff2",
  display: "swap",
  variable: "--font-serif-cormorant",
  weight: "300 700",
});

const montserrat = localFont({
  src: "./fonts/montserrat-latin.woff2",
  display: "swap",
  variable: "--font-sans-montserrat",
  weight: "300 700",
});

const literata = localFont({
  src: "./fonts/literata-latin.woff2",
  display: "swap",
  variable: "--font-literata",
  weight: "300 700",
});

const prata = localFont({
  src: "./fonts/prata-latin.woff2",
  display: "swap",
  variable: "--font-prata",
  weight: "400",
});

const qwigley = localFont({
  src: "./fonts/qwigley-latin.woff2",
  display: "swap",
  variable: "--font-qwigley",
  weight: "400",
});

const playfairDisplay = localFont({
  src: "./fonts/playfair-display-latin.woff2",
  display: "swap",
  variable: "--font-playfair",
  weight: "400 700",
});

const qwitcherGrypen = localFont({
  src: [
    {
      path: "./fonts/qwitcher-grypen-latin-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/qwitcher-grypen-latin-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-qwitcher",
});

export const metadata: Metadata = {
  title: "Kinan & Faiz | The Wedding Invitation",
  description:
    "You are cordially invited to celebrate the marriage of Kinan and Faiz on August 16, 2026, in Surabaya.",
  keywords: ["wedding", "invitation", "Kinan & Faiz", "Surabaya"],
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
      className={`${cormorant.variable} ${montserrat.variable} ${literata.variable} ${prata.variable} ${qwigley.variable} ${playfairDisplay.variable} ${qwitcherGrypen.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className="bg-brand-cream text-brand-charcoal selection:bg-brand-gold selection:text-brand-emerald flex min-h-full flex-col"
      >
        <main className="flex flex-grow flex-col">{children}</main>
      </body>
    </html>
  );
}
