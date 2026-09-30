import type { Metadata } from "next";
import { Fira_Code, Oswald } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const flightDisplay = Oswald({ variable: "--font-flight-display", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const flightMono = Fira_Code({ variable: "--font-flight-mono", subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: "Preflight — Checklist route book",
  description: "Run personal checklists for launches, interviews, and content work.",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", siteName: "Preflight", title: "Preflight — Checklist route book", description: "Run personal checklists for launches, interviews, and content work." },
  twitter: { card: "summary", creator: "@bookchaowalit" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${flightDisplay.variable} ${flightMono.variable}`}><body><Analytics /><SpeedInsights />{children}</body></html>;
}
