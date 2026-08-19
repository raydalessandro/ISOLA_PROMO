/**
 * Chi si incontra sulla mappa, e dove.
 *
 * Le sagome le disegna `isola-mappa/`, che di canone non sa niente: sa disegnare
 * una volpe. Chi sia quella volpe lo sa questo file, ed è l'unico posto in cui
 * le due cose si toccano.
 *
 * **Quanto è precisa una figura.** Il canone dà a dieci abitanti una casa, e per
 * ciascuna dice il quartiere: il Forno di Fiamma è nel quartiere di Fuoco, la
 * Tana di Rovo in quello di Terra. Il quartiere è affidabile, la posizione
 * dentro il quartiere no — vale la stessa avvertenza di `lib/legami.ts`, dove
 * due edifici del villaggio distano cinque metri. Quindi una figura dice
 * **«questo abitante sta di casa da queste parti»**, non «la sua porta è quel
 * tetto lì». Per questo le figure non hanno etichetta: chi vuole i nomi li
 * trova nelle schede, dove ci sta anche la frase che li spiega.
 *
 * Gli altri otto — i tre fratelli e i cinque cuccioli — non compaiono: il canone
 * non gli dà una casa, e piazzarli da qualche parte sarebbe inventare. Che poi è
 * la stessa ragione per cui i segni della mappa segnano solo quello che
 * l'illustrazione mostra davvero.
 */

import type { Figura } from "@/isola-mappa";

export type AbitanteSullaMappa = Figura & {
  /** Id in `lib/canone.ts`: il nome e la specie si prendono da lì. */
  id: string;
  /** Perché sta lì: si legge sul disegno, e dice il quartiere del canone. */
  nota: string;
};

export const abitantiSullaMappa: AbitanteSullaMappa[] = [
  {
    id: "grunto",
    sagoma: "stambecco",
    x: 654,
    y: 218,
    verso: -1,
    scala: 1.1,
    nota: "Sul fianco est delle Montagne Gemelle, presso il Burrone: il quartiere d'Aria.",
  },
  {
    id: "fiamma",
    sagoma: "volpe",
    x: 780,
    y: 686,
    verso: -1,
    nota: "Davanti al Forno, nel quartiere di Fuoco, dove il camino fuma prima che sia giorno.",
  },
  {
    id: "stria",
    sagoma: "airone",
    x: 470,
    y: 954,
    verso: 1,
    nota: "Nel villaggio, poco sotto la piazza: la scuola sta dentro l'anello.",
  },
  {
    id: "nodo",
    sagoma: "picchio",
    x: 636,
    y: 880,
    verso: -1,
    scala: 0.9,
    nota: "Fra le case del villaggio, dove il canone mette la sua bottega.",
  },
  {
    id: "memolo",
    sagoma: "riccio",
    x: 418,
    y: 886,
    verso: 1,
    scala: 0.9,
    nota: "Nel villaggio, sul lato di ponente della piazza.",
  },
  {
    id: "rovo",
    sagoma: "tasso",
    x: 268,
    y: 734,
    verso: 1,
    nota: "Al margine della Foresta Intrecciata, nel quartiere di Terra.",
  },
  {
    id: "salvia",
    sagoma: "lepre",
    x: 322,
    y: 902,
    verso: -1,
    nota: "Fra gli Orti del Cerchio e il fiume, nel quartiere di Terra.",
  },
  {
    id: "zolla",
    sagoma: "scoiattolo",
    x: 186,
    y: 782,
    verso: 1,
    scala: 0.95,
    nota: "Dentro il bosco, a ponente: il quartiere di Terra.",
  },
  {
    id: "bartolo",
    sagoma: "tartaruga",
    x: 512,
    y: 1342,
    verso: -1,
    scala: 1.1,
    nota: "Sulla spiaggia accanto al pontile, nel quartiere d'Acqua.",
  },
  {
    id: "amo",
    sagoma: "cormorano",
    x: 672,
    y: 1300,
    verso: -1,
    nota: "Sulla Spiaggia delle Conchiglie, nel quartiere d'Acqua.",
  },
];

/** Le figure nude, come le vuole il disegno: senza nomi, senza canone. */
export const figureDellaMappa = (): Figura[] =>
  abitantiSullaMappa.map(({ x, y, sagoma, verso, scala }) => ({ x, y, sagoma, verso, scala }));
