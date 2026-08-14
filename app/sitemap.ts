import type { MetadataRoute } from "next";

import { baseUrlDelSito } from "@/lib/base-url";

/*
 * Le superfici pubbliche, in ordine di importanza. `/offline` resta fuori: è la
 * ricaduta del service worker, non una pagina che qualcuno debba trovare da un
 * motore di ricerca.
 *
 * Gli URL sono assoluti e nascono da `baseUrlDelSito()`, la stessa base dei
 * metadati: il sito diventerà un sottodominio, e da un punto solo si sposta.
 */
const SUPERFICI = [
  { percorso: "/", priorita: 1 },
  { percorso: "/mondo", priorita: 0.9 },
  { percorso: "/storie", priorita: 0.9 },
  { percorso: "/libro", priorita: 0.9 },
  { percorso: "/giornate", priorita: 0.8 },
  { percorso: "/mappa", priorita: 0.8 },
  { percorso: "/gioco", priorita: 0.7 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = baseUrlDelSito();

  return SUPERFICI.map(({ percorso, priorita }) => ({
    url: new URL(percorso, base).href,
    priority: priorita,
    // Niente `lastModified`: sarebbe la data della build, non quella in cui il
    // contenuto è cambiato davvero. Una data finta vale meno di nessuna data.
    changeFrequency: "monthly" as const,
  }));
}
