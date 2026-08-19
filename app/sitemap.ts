import type { MetadataRoute } from "next";

import { baseUrlDelSito } from "@/lib/base-url";
import { QUARTIERI_SITO } from "@/lib/mappa-quartieri";

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
  /* I quartieri: cinque pagine vere, una per pezzo d'isola. Si linkano e si
     trovano, e funzionano senza JavaScript — la camera su /mappa e' un di piu'. */
  ...QUARTIERI_SITO.map((q) => ({ percorso: `/mappa/${q.url}`, priorita: 0.6 })),
  { percorso: "/gioco", priorita: 0.7 },
];

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
