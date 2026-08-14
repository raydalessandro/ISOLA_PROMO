import { getStoria, libro, sito } from "@/lib/canone";

/*
 * Dati strutturati del Volume 1.
 *
 * Regola unica: **solo fatti veri**. Qui dentro non c'è ISBN, non c'è data di
 * pubblicazione e non c'è `offers` — il libro è stampato ma la scheda Amazon
 * non ha ancora una data, e un prezzo o una disponibilità dichiarati adesso
 * sarebbero un link finto scritto in JSON (AGENTS.md, regola 4). Quei campi si
 * aggiungono il giorno in cui esistono, non prima.
 *
 * Manca di proposito anche `numberOfPages`: nessuno l'ha misurato.
 */

/**
 * `<` dentro una stringa chiuderebbe lo script. JSON.stringify non lo scappa,
 * quindi si scappa qui: è l'unico modo sicuro di iniettare JSON-LD.
 */
const perLoScript = (dati: unknown) => JSON.stringify(dati).replace(/</g, "\\u003c");

export function DatiStrutturatiLibro({ base }: { base: URL }) {
  const dati = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: `${libro.titolo} — ${libro.sottotitolo}`,
    description: libro.descrizione,
    inLanguage: "it",
    // La copertina è rigida: lo dice il testo alternativo dei render di stampa.
    bookFormat: "https://schema.org/Hardcover",
    author: { "@type": "Person", name: sito.autore },
    publisher: { "@type": "Organization", name: sito.editore },
    isPartOf: { "@type": "BookSeries", name: sito.nome },
    image: new URL("/media/libro/vol1-fronte.webp", base).href,
    audience: {
      "@type": "PeopleAudience",
      suggestedMinAge: libro.etaMin,
      suggestedMaxAge: libro.etaMax,
    },
    // I tre racconti del volume: titolo soltanto, come ovunque sul sito.
    hasPart: libro.storie.map((sid) => ({
      "@type": "CreativeWork",
      name: getStoria(sid).titolo,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: perLoScript(dati) }}
    />
  );
}
