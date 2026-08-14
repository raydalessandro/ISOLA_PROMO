/**
 * Base assoluta usata dai metadati (Open Graph, manifest, canonical).
 *
 * Perché non è una riga sola: una variabile d'ambiente può esistere ed essere
 * vuota. `??` cade solo su `undefined`, quindi una `NEXT_PUBLIC_SITE_URL`
 * impostata a stringa vuota passava dritta dentro `new URL("")` e faceva
 * cadere la build in fase di raccolta delle pagine — non a runtime, dove si
 * sarebbe notato prima. È successo davvero, al primo deploy su Vercel.
 *
 * Qui ogni candidato viene ripulito, verificato e scartato se non regge: un
 * dominio configurato male degrada al successivo invece di fermare tutto.
 */

/** L'ultima spiaggia: sempre valida, così la funzione non può fallire. */
const RICADUTA = "http://localhost:3000";

function prova(valore: string | undefined): URL | null {
  const pulito = valore?.trim();
  if (!pulito) return null;

  // Vercel espone gli host senza schema (`mio-sito.vercel.app`).
  const conSchema = /^https?:\/\//i.test(pulito) ? pulito : `https://${pulito}`;

  try {
    const url = new URL(conSchema);
    return url.hostname ? url : null;
  } catch {
    return null;
  }
}

/**
 * In ordine di precedenza: il dominio dichiarato da noi, il dominio di
 * produzione del progetto Vercel, l'URL del singolo deploy, localhost.
 *
 * I `process.env.NEXT_PUBLIC_*` si scrivono per esteso e non si leggono da un
 * oggetto passato come parametro: Next li sostituisce a build time solo se li
 * trova scritti così.
 */
export function baseUrlDelSito(): URL {
  return (
    prova(process.env.NEXT_PUBLIC_SITE_URL) ??
    prova(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    prova(process.env.VERCEL_URL) ??
    new URL(RICADUTA)
  );
}
