/**
 * `/isola.svg` — l'isola disegnata, servita come immagine.
 *
 * Il disegno è fatto di migliaia di forme. Messo dentro la pagina finirebbe
 * scritto due volte — una nel markup e una nel payload che React si porta
 * dietro — e la mappa peserebbe più della fotografia che sostituisce. Servito
 * così è un file solo: il browser lo prende una volta, lo tiene in cache, e la
 * pagina resta leggera come le altre.
 *
 * È statico: non legge la richiesta, non cambia fra un visitatore e l'altro, e
 * viene generato in build come qualunque altra pagina del sito.
 */

import { createElement } from "react";

import { IsolaDisegnata } from "@/components/isola/isola-disegnata";

export const dynamic = "force-static";

export async function GET() {
  /* `react-dom/server` si carica qui dentro e non in testa al file: importarlo
     fra i moduli di una app router fa storcere il naso al bundler, che non può
     sapere che qui serve a stampare un'immagine e non a rendere una pagina. */
  const { renderToStaticMarkup } = await import("react-dom/server");
  const disegno = renderToStaticMarkup(createElement(IsolaDisegnata));

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n${disegno}`, {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      /* Cambia solo con un deploy, e allora cambia tutto: dieci minuti di cache
         piena e un giorno di riuso mentre si rinfresca. */
      "cache-control": "public, max-age=600, stale-while-revalidate=86400",
    },
  });
}
