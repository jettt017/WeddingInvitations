import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
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
      className={`${cormorant.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-cream text-brand-charcoal selection:bg-brand-gold selection:text-brand-emerald">
        <LenisProvider>
          <main className="flex-grow flex flex-col">{children}</main>
        </LenisProvider>
      </body>
    </html>
  );
}
