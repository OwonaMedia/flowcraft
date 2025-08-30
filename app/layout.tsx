import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FlowCraft - Intelligente WhatsApp-Workflows für Unternehmen",
  description: "Die führende WhatsApp Bot SaaS-Plattform für deutsche Unternehmen. Erstellen Sie intelligente Workflows in Minuten - 100% DSGVO-konform und EU-gehostet.",
  keywords: ["WhatsApp Bot", "WhatsApp Business", "Automation", "DSGVO", "Workflow", "FlowCraft", "Deutschland", "EU"],
  authors: [{ name: "FlowCraft Team" }],
  openGraph: {
    title: "FlowCraft - Intelligente WhatsApp-Workflows",
    description: "Die führende WhatsApp Bot SaaS-Plattform für deutsche Unternehmen",
    type: "website",
    locale: "de_DE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${inter.variable} font-sans antialiased bg-gray-50`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
