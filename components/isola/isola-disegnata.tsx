/**
 * L'isola disegnata: la stessa tavola, in vettoriale.
 *
 * Perché rifarla. La mappa interattiva stava sopra un'immagine da mezzo mega,
 * e ogni segno era una promessa che il disegno sotto non poteva mantenere:
 * niente si accende, niente si stacca, niente si ingrandisce senza sfocare.
 * Questa versione è fatta di forme — pesa quanto una pagina, resta nitida a
 * qualunque ingrandimento, e i luoghi sono cose disegnate, non pixel colorati.
 *
 * Perché il primo tentativo si era fermato. La palette del sito è quella dei
 * tre punti stampati sulla quarta di copertina, e con quei tre colori un'isola
 * non si dipinge: veniva un diagramma. La strada d'uscita non è stata allargare
 * la palette a piacere, che la regola 11 vieta, ma **campionare la tavola**:
 * i token `--tav-*` in `app/styles/isola.css` sono presi uno per uno da
 * `public/media/isola/mappa.webp`, con le coordinate del prelievo scritte
 * accanto. Vengono dal canone quanto i tre punti, e non si mescolano con la
 * palette del sito: vivono dentro il disegno e basta.
 *
 * Il disegno è **decorativo e statico**: non ha controlli, non ha stati, e non
 * chiede JavaScript. I segni cliccabili stanno in uno strato a parte
 * (`components/mappa-isola.tsx`) che condivide questo riquadro 1000×1500.
 */

import {
  Acque, AlberoVecchio, Approdo, Boschi, Carta, Mare, Montagne, OmbraDeiMonti,
  Orti, Prati, Sentieri, Terra, Villaggio,
} from "@/components/isola/strati";
import { SimboliRipetuti } from "@/components/isola/simboli";
import { COSTA_VERA } from "@/lib/isola/geografia";
import { stileTavola } from "@/lib/isola/tavola";
import { curva } from "@/lib/isola/tratto";

function Definizioni() {
  return (
    <defs>
      {/* Il mare è chiaro attorno all'isola e si fa fondo solo negli angoli del
          foglio: è così sulla tavola, ed è anche l'unico modo perché l'isola
          non finisca dentro una macchia scura. */}
      <radialGradient id="g-mare" cx="50%" cy="46%" r="96%">
        <stop offset="0" stopColor="var(--tav-mare-chiaro)" />
        <stop offset="0.55" stopColor="var(--tav-mare)" />
        <stop offset="1" stopColor="var(--tav-mare-fondo)" />
      </radialGradient>

      <linearGradient id="g-terra" x1="0" y1="0" x2="0.35" y2="1">
        <stop offset="0" stopColor="var(--tav-prato)" />
        <stop offset="0.55" stopColor="var(--tav-prato)" />
        <stop offset="1" stopColor="var(--tav-prato-scuro)" />
      </linearGradient>

      <linearGradient id="g-roccia" x1="0.1" y1="0" x2="0.9" y2="0.9">
        <stop offset="0" stopColor="var(--tav-roccia-luce)" />
        <stop offset="0.72" stopColor="var(--tav-roccia)" />
        <stop offset="1" stopColor="var(--tav-roccia-ombra)" />
      </linearGradient>

      <linearGradient id="g-fiume" x1="0" y1="0" x2="1" y2="0.4">
        <stop offset="0" stopColor="var(--tav-fiume-chiaro)" />
        <stop offset="1" stopColor="var(--tav-fiume)" />
      </linearGradient>

      {/* La vignetta resta appena accennata: serve a chiudere il foglio, non a
          spegnerlo. Sopra 0.2 il mare diventa notte e l'isola annerisce. */}
      <radialGradient id="g-vignetta" cx="50%" cy="48%" r="74%">
        <stop offset="0.6" stopColor="var(--tav-inchiostro)" stopOpacity="0" />
        <stop offset="1" stopColor="var(--tav-inchiostro)" stopOpacity="0.16" />
      </radialGradient>

      {/*
       * La costa si disegna una volta sola e si richiama con `use`: entra nel
       * ritaglio dell'isola, nella scogliera e nell'orlo bagnato. Ripeterla per
       * esteso costerebbe diecimila caratteri a copia.
       */}
      <path id="p-costa" d={curva(COSTA_VERA)} />

      <clipPath id="c-isola">
        <use href="#p-costa" />
      </clipPath>

      {/*
       * L'acquerello: un po' di rumore che scompiglia i bordi delle forme.
       * È quello che separa un disegno da un diagramma — una costa tirata col
       * righello si vede subito che è stata tirata col righello.
       */}
      <filter id="f-acquerello" x="-8%" y="-8%" width="116%" height="116%">
        <feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves="3" seed="7" result="rumore" />
        <feDisplacementMap in="SourceGraphic" in2="rumore" scale="12" xChannelSelector="R" yChannelSelector="G" />
      </filter>

      <filter id="f-sfoca" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="11" />
      </filter>

      <filter id="f-sfoca-corta" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="4" />
      </filter>

      {/* La grana della carta: rumore grigio steso in moltiplica sopra tutto. */}
      <filter id="f-grana" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" seed="19" />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.7" intercept="0" />
        </feComponentTransfer>
      </filter>

      <SimboliRipetuti />

      <g id="cipresso">
        <ellipse cx="2.6" cy="2.4" rx="6" ry="2.6" fill="var(--tav-inchiostro)" opacity="0.22" />
        <path d="M0 3c-4.4-2-5.6-10-4.4-17C-3.4-19-1.4-22 0-22s3.4 3 4.4 8C5.6-7 4.4 1 0 3z" fill="currentColor" />
        <path d="M0 3c-1.6-2-2-10-1.6-17C-1.2-19-0.6-22 0-22z" fill="#fff" opacity="0.14" />
      </g>
    </defs>
  );
}

/** La descrizione che leggono lo screen reader e chi non carica il disegno. */
export const DESCRIZIONE_ISOLA =
  "Mappa disegnata dell'isola vista dall'alto: le Montagne Gemelle a nord, i " +
  "Pascoli Alti con la pozza e le capanne dei pastori, l'anello del Fiume che " +
  "Gira chiuso attorno al villaggio con l'Albero Vecchio, la Foresta " +
  "Intrecciata e gli Orti del Cerchio a ovest, il quartiere di Fuoco col camino " +
  "del forno a est, e a sud la spiaggia con il pontile, dove il fiume incontra " +
  "il mare.";

/**
 * Il disegno intero, pronto da servire.
 *
 * Non finisce dentro la pagina: lo serve `/isola.svg` come immagine a sé, che
 * il browser mette in cache una volta e riusa. Per questo si porta dentro la
 * tavolozza in un `<style>` — un'immagine non legge il CSS di chi la mostra — e
 * per questo dichiara `xmlns`: fuori da un documento HTML serve.
 */
export function IsolaDisegnata() {
  return (
    <svg
      className="isola-disegnata"
      viewBox="0 0 1000 1500"
      role="img"
      aria-label={DESCRIZIONE_ISOLA}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{DESCRIZIONE_ISOLA}</title>
      <style>{stileTavola()}</style>

      <Definizioni />

      {/*
       * L'ordine è quello di una tavola dipinta: prima il fondo, poi quello che
       * ci sta sopra. Le montagne stanno **sotto** i prati apposta — così il
       * pascolo copre il piede della roccia e il massiccio sembra uscire dal
       * terreno invece di stargli appoggiato. L'ombra che gettano torna dopo,
       * quando il prato è già steso.
       */}
      <Mare />
      <Terra />
      <Montagne />
      <Prati />
      <OmbraDeiMonti />
      <Acque />
      <Boschi />
      <Orti />
      <Sentieri />
      <Villaggio />
      <AlberoVecchio />
      <Approdo />
      <Carta />
    </svg>
  );
}
