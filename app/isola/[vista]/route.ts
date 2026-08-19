/**
 * `/isola/intera.svg`, `/isola/fuoco.svg`, … — l'isola disegnata, per riquadro.
 *
 * Il disegno è fatto di migliaia di forme. Messo dentro la pagina finirebbe
 * scritto due volte — una nel markup e una nel payload che React si porta
 * dietro — e la mappa peserebbe più della fotografia che sostituisce. Servito
 * così è un file solo: il browser lo prende una volta, lo tiene in cache, e la
 * pagina resta leggera come le altre.
 *
 * C'è un file per inquadratura, e non è uno spreco: il disegno di un quartiere
 * scarta tutto quello che cade fuori dal riquadro, quindi pesa una frazione di
 * quello intero e in cambio può permettersi il dettaglio da vicino.
 *
 * Sono statici: non leggono la richiesta, non cambiano fra un visitatore e
 * l'altro, e vengono generati in build come qualunque altra pagina del sito.
 */

import { createElement } from "react";

import { ISOLA_INTERA, IsolaDisegnata, QUARTIERI, inquadratura } from "@/isola-mappa";
import { figureDellaMappa } from "@/lib/mappa-abitanti";

export const dynamic = "force-static";
/* Le inquadrature sono cinque più l'isola intera: fuori da quelle non c'è
   niente da disegnare, e chiederne un'altra è un indirizzo sbagliato. */
export const dynamicParams = false;

export function generateStaticParams() {
  return [ISOLA_INTERA, ...QUARTIERI].map((i) => ({ vista: `${i.id}.svg` }));
}

export async function GET(_richiesta: Request, contesto: { params: Promise<{ vista: string }> }) {
  const { vista } = await contesto.params;

  /* `react-dom/server` si carica qui dentro e non in testa al file: importarlo
     fra i moduli di una app router fa storcere il naso al bundler, che non può
     sapere che qui serve a stampare un'immagine e non a rendere una pagina. */
  const { renderToStaticMarkup } = await import("react-dom/server");
  const disegno = renderToStaticMarkup(
    createElement(IsolaDisegnata, {
      vista: inquadratura(vista.replace(/\.svg$/, "")),
      /* Gli abitanti li conosce il sito, non il disegno: qui si passano già
         collocati, e il disegno li mette in scena solo da vicino. */
      figure: figureDellaMappa(),
    }),
  );

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n${disegno}`, {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      /* Cambia solo con un deploy, e allora cambia tutto: dieci minuti di cache
         piena e un giorno di riuso mentre si rinfresca. */
      "cache-control": "public, max-age=600, stale-while-revalidate=86400",
    },
  });
}
