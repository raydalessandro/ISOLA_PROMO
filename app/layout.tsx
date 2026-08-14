import type { Metadata, Viewport } from "next";

import "./globals.css";
import { Shell } from "@/components/shell";
import { sito } from "@/lib/canone";

/**
 * Base assoluta per Open Graph e manifest. Su Vercel il dominio arriva come
 * variabile d'ambiente; in locale si ricade su localhost.
 */
const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: { default: sito.titolo, template: `%s — ${sito.nome}` },
  description: sito.descrizione,
  applicationName: sito.nome,
  authors: [{ name: sito.autore }],
  publisher: sito.editore,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: sito.nomeBreve,
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: sito.nome,
    title: sito.titolo,
    description: sito.descrizione,
    images: [
      {
        url: "/media/libro/vol1-fronte.webp",
        width: 1120,
        height: 1400,
        alt: "La copertina del Volume 1 de L'Isola dei Tre Venti",
      },
    ],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: sito.coloreTema,
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  // Nessun blocco dello zoom: il sito lo leggono adulti, spesso di sera.
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
