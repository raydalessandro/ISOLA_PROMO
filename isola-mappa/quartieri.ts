/**
 * I quartieri, e come si inquadrano.
 *
 * Il disegno è uno solo, grande 1000×1500. Guardarlo tutto insieme è la mappa;
 * guardarne un pezzo è un quartiere. Qui stanno i pezzi: un rettangolo per
 * ciascuno, letto sul disegno, più il conto che serve a puntarci la camera.
 *
 * I nomi dei quartieri **non** stanno qui, e non è una dimenticanza: come si
 * chiamano lo dice il canone, che vive nel progetto che usa questa mappa, non
 * nella mappa. Qui ci sono gli `id` e le coordinate — quello che serve per
 * disegnare e per inquadrare.
 *
 * Le direzioni sono quelle del canone: Aria a nord con i Pascoli e le Montagne,
 * Fuoco a levante col forno, Acqua a mezzogiorno dove il Fiume incontra il mare,
 * Terra a ponente con gli Orti e la Foresta, e il villaggio in mezzo, dentro
 * l'anello.
 */

import { FOGLIO } from "./geografia";

export type Inquadratura = {
  id: string;
  x: number;
  y: number;
  larghezza: number;
  altezza: number;
  /** Una riga su cosa si vede qui dentro: serve al testo alternativo. */
  cosa: string;
};

/** Il foglio intero: è un'inquadratura come le altre, la più larga. */
export const ISOLA_INTERA: Inquadratura = {
  id: "intera",
  x: 0,
  y: 0,
  larghezza: FOGLIO.larghezza,
  altezza: FOGLIO.altezza,
  cosa:
    "le Montagne Gemelle a nord, i Pascoli Alti con la pozza e le capanne dei " +
    "pastori, l'anello del Fiume che Gira chiuso attorno al villaggio con " +
    "l'Albero Vecchio, la Foresta Intrecciata e gli Orti del Cerchio a ovest, " +
    "il quartiere di Fuoco col camino del forno a est, e a sud la spiaggia con " +
    "il pontile, dove il fiume incontra il mare",
};

export const QUARTIERI: Inquadratura[] = [
  {
    id: "aria",
    x: 84,
    y: 20,
    larghezza: 840,
    altezza: 480,
    cosa: "le Montagne Gemelle, la sella da cui scende il rigagnolo, i Pascoli Alti con la pozza e le capanne dei pastori",
  },
  {
    id: "fuoco",
    x: 556,
    y: 492,
    larghezza: 424,
    altezza: 470,
    cosa: "la terra secca a levante, le case del quartiere, i cipressi lungo il fiume e il Forno col camino che fuma",
  },
  {
    id: "acqua",
    x: 200,
    y: 1030,
    larghezza: 640,
    altezza: 450,
    cosa: "la Bocca dove il fiume incontra il mare, la spiaggia con le conchiglie, il pontile e la barca tirata a riva",
  },
  {
    id: "terra",
    x: 30,
    y: 392,
    larghezza: 430,
    altezza: 640,
    cosa: "la Foresta Intrecciata sul fianco di ponente e gli Orti del Cerchio, coi campi a cerchi concentrici",
  },
  {
    id: "centro",
    x: 292,
    y: 548,
    larghezza: 460,
    altezza: 440,
    cosa: "l'Albero Vecchio, la piazza del villaggio e le case raccolte sotto la chioma, dentro l'anello del Fiume",
  },
];

export const inquadratura = (id: string): Inquadratura =>
  id === ISOLA_INTERA.id
    ? ISOLA_INTERA
    : (QUARTIERI.find((q) => q.id === id) ?? ISOLA_INTERA);

/** Il `viewBox` di un'inquadratura, pronto per l'attributo SVG. */
export const riquadro = (i: Inquadratura) =>
  `${i.x} ${i.y} ${i.larghezza} ${i.altezza}`;

/**
 * Dove puntare la camera per vedere un quartiere **senza cambiare immagine**.
 *
 * Serve a chi mostra la mappa intera e la vuole ingrandire su un pezzo con una
 * trasformazione CSS invece che con un altro file: si ingrandisce quanto basta
 * perché il rettangolo ci stia tutto, e si sposta il suo centro al centro del
 * riquadro. Le due strade danno la stessa inquadratura, e sono pensate per
 * essere intercambiabili: si comincia con la camera, e quando l'immagine di
 * dettaglio è arrivata si sostituisce senza che niente salti.
 *
 * `scala` e `spostamento` sono in frazioni del riquadro intero: chi disegna
 * moltiplica per la larghezza e l'altezza che ha in pagina.
 */
export const camera = (i: Inquadratura) => {
  const scala = Math.min(
    FOGLIO.larghezza / i.larghezza,
    FOGLIO.altezza / i.altezza,
  );

  return {
    scala,
    /* Il centro del rettangolo, in frazione del foglio: è anche l'origine
       attorno a cui conviene applicare l'ingrandimento. */
    fuoco: {
      x: (i.x + i.larghezza / 2) / FOGLIO.larghezza,
      y: (i.y + i.altezza / 2) / FOGLIO.altezza,
    },
  };
};
