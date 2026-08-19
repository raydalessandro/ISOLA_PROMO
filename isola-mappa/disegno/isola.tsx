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
} from "./strati";
import { ErbaFitta, Legna, Mercato, Reti } from "./dettagli";
import { Figure, type Figura } from "./figure";
import { SimboliRipetuti } from "./simboli";
import { COSTA_VERA } from "../geografia";
import { ISOLA_INTERA, type Inquadratura, riquadro } from "../quartieri";
import { stileTavola } from "../tavola";
import { stileVita } from "../vita";
import { curva } from "../tratto";

function Definizioni({ dettaglio }: { dettaglio: boolean }) {
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

      <SimboliRipetuti dettaglio={dettaglio} />

      <g id="cipresso">
        <ellipse cx="2.6" cy="2.4" rx="6" ry="2.6" fill="var(--tav-inchiostro)" opacity="0.22" />
        <rect x="-1" y="0" width="2" height="4" fill="var(--tav-tronco)" />
        <path d="M0 3c-4.4-2-5.6-10-4.4-17C-3.4-19-1.4-22 0-22s3.4 3 4.4 8C5.6-7 4.4 1 0 3z" fill="currentColor" />
        <path d="M0 3c-1.6-2-2-10-1.6-17C-1.2-19-0.6-22 0-22z" fill="#fff" opacity="0.16" />
        <path d="M1.6-19c1.6 2.4 2.6 6 2.8 11 .2 4-.6 8-2.4 11 .6-4 .8-8 .4-12-.2-4-.6-7.4-.8-10z" fill="var(--tav-inchiostro)" opacity="0.2" />
      </g>
    </defs>
  );
}

/**
 * La descrizione che leggono lo screen reader e chi non carica il disegno.
 *
 * Non è una didascalia poetica: elenca quello che nel riquadro si vede davvero,
 * e cambia col riquadro — di un quartiere si descrive quel quartiere, non tutta
 * l'isola.
 */
export const descrizione = (vista: Inquadratura = ISOLA_INTERA) =>
  vista.id === ISOLA_INTERA.id
    ? `Mappa disegnata dell'isola vista dall'alto: ${vista.cosa}.`
    : `Dettaglio della mappa disegnata dell'isola: ${vista.cosa}.`;

/**
 * Il disegno, pronto da servire.
 *
 * Non è pensato per finire dentro una pagina: è un'immagine, e si serve come
 * tale — il markup è fatto di migliaia di forme, e messo in linea in un
 * documento React finirebbe scritto due volte. Per questo si porta dentro la
 * tavolozza in un `<style>` e dichiara `xmlns`: fuori da un documento HTML
 * servono.
 *
 * `vista` decide che pezzo di foglio si guarda. Il disegno resta lo stesso —
 * cambia solo il riquadro, quindi le coordinate non si spostano mai e chi ci
 * mette dei segni sopra non ha niente da ricalcolare.
 */
export function IsolaDisegnata({
  vista = ISOLA_INTERA,
  dettaglio = vista.id !== ISOLA_INTERA.id,
  figure = [],
}: {
  vista?: Inquadratura;
  /** Da vicino si disegnano cose che di lontano sarebbero sporco. */
  dettaglio?: boolean;
  /**
   * Chi si vede in giro, già collocato da chi conosce il canone. Si disegnano
   * solo col dettaglio: da lontano sarebbero animali grandi come case.
   */
  figure?: Figura[];
}) {
  const strato = { vista, dettaglio };

  return (
    <svg
      className="isola-disegnata"
      viewBox={riquadro(vista)}
      role="img"
      aria-label={descrizione(vista)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{descrizione(vista)}</title>
      <style>{`${stileTavola()}\n${stileVita()}`}</style>

      <Definizioni dettaglio={dettaglio} />

      {/*
       * L'ordine è quello di una tavola dipinta: prima il fondo, poi quello che
       * ci sta sopra. Le montagne stanno **sotto** i prati apposta — così il
       * pascolo copre il piede della roccia e il massiccio sembra uscire dal
       * terreno invece di stargli appoggiato. L'ombra che gettano torna dopo,
       * quando il prato è già steso.
       */}
      <Mare {...strato} />
      <Terra {...strato} />
      <Montagne {...strato} />
      <Prati {...strato} />
      <OmbraDeiMonti {...strato} />
      <Acque {...strato} />
      <Boschi {...strato} />
      <Orti {...strato} />
      {dettaglio && <ErbaFitta vista={vista} />}
      <Sentieri {...strato} />
      <Villaggio {...strato} />
      <AlberoVecchio {...strato} />
      {dettaglio && (
        <>
          <Mercato vista={vista} />
          <Legna vista={vista} />
          <Reti vista={vista} />
          <Figure figure={figure} vista={vista} />
        </>
      )}
      <Approdo {...strato} />
      <Carta />
    </svg>
  );
}
