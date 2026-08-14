import type { MetadataRoute } from "next";

import { baseUrlDelSito } from "@/lib/base-url";

/*
 * Il sito è una vetrina e vuole essere trovato: si apre tutto, tranne la
 * ricaduta offline del service worker e le immagini ottimizzate al volo, che
 * non sono pagine.
 */
export default function robots(): MetadataRoute.Robots {
  const base = baseUrlDelSito();

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/offline", "/_next/image"] }],
    sitemap: new URL("/sitemap.xml", base).href,
  };
}
