/**
 * Le sagome degli abitanti.
 *
 * Sono profili, non ritratti: a questa scala una figura è alta venti unità su
 * un foglio da millecinquecento, e quello che si legge è la forma — le orecchie
 * della lepre, le corna dello stambecco, il collo a esse dell'airone. Un occhio
 * disegnato sarebbe mezzo pixel di sporco.
 *
 * **Qui non c'è canone.** Non ci sono nomi, non ci sono personaggi: c'è come si
 * disegna una volpe. Chi sia quella volpe, e dove stia, lo decide il progetto
 * che usa la mappa — è lui che conosce il canone, e passa le figure già
 * collocate. La regola del LEGGIMI vale anche qui: questa cartella disegna
 * un'isola, non la racconta.
 *
 * Le figure si vedono **solo da vicino**. Sulla mappa intera l'isola è un
 * paesaggio, e venti animali grandi come una casa sarebbero una bugia sulle
 * distanze: quando i tre fratelli attraversano l'isola ci mettono una giornata.
 */

import { type Inquadratura } from "../quartieri";

export type NomeSagoma =
  | "volpe"
  | "tasso"
  | "lepre"
  | "riccio"
  | "stambecco"
  | "airone"
  | "cormorano"
  | "picchio"
  | "scoiattolo"
  | "tartaruga"
;

/**
 * Ogni sagoma con la sua tinta, presa dalla tavolozza della tavola.
 *
 * Le tinte non sono a caso: la volpe è rossa e prende il caldo dei tetti, lo
 * scoiattolo è grigio e prende la roccia in ombra, la tartaruga di mare prende
 * il verde del bosco. La specie la dice il canone, il colore lo sceglie il
 * disegno — dentro la tavolozza, che non si allarga.
 */
const SAGOME: Record<NomeSagoma, { tinta: string; disegno: React.ReactNode }> = {
  /* la volpe: coda folta bassa, muso appuntito */
  volpe: {
    tinta: "var(--tav-tetto)",
    disegno: (
      <>
        <path d="M-6-7c-5 0-11-3-12-9-1-4 2-6 4-4 2 3 1 6 3 8 2 2 4 3 5 5z" />
        <ellipse cx="-2" cy="-8" rx="7.5" ry="5" />
        <path d="M-7-4h2.4v4.4H-7zM0-4h2.4v4.4H0z" />
        <circle cx="6.5" cy="-12" r="3.8" />
        <path d="M3.8-14.2l-.4-3.6 3 2.6zM8.4-14.8l1.8-3.2 1.4 3z" />
        <path d="M9.2-11.8l5 1.4-4.8 1.8z" />
      </>
    ),
  },
  /* il tasso: corpo basso e largo, zampe corte */
  tasso: {
    tinta: "var(--tav-inchiostro)",
    disegno: (
      <>
        <ellipse cx="-1" cy="-6" rx="9" ry="4.6" />
        <path d="M-8-3h2.2v3.2H-8zM-3.5-3h2.2v3.2h-2.2zM1-3h2.2v3.2H1zM5-3h2.2v3.2H5z" />
        <ellipse cx="8.6" cy="-8.4" rx="4.2" ry="3.2" />
        <path d="M11.6-9.4l3.4 1.2-3.4 1.6z" />
        <path d="M-9.4-8.4c-2.4-.6-3.8-1.6-4.2-3 1.8.2 3.2.8 4.4 1.8z" />
      </>
    ),
  },
  /* la lepre seduta: orecchie lunghe, piede posteriore appoggiato */
  lepre: {
    tinta: "var(--tav-muro)",
    disegno: (
      <>
        <ellipse cx="-3" cy="-6.5" rx="6.6" ry="6" />
        <ellipse cx="4" cy="-11" rx="3.8" ry="3.4" />
        <path d="M4-13.4c-.6-6 .2-10 1.8-10.2 1.6-.2 2 4 1 10.2zM7.4-13.6c.4-5.6 1.8-9 3.2-8.6 1.4.4.6 4.4-1.2 9z" />
        <path d="M6.8-10.2l4.4 1-4.2 1.8z" />
        <path d="M-6.6-2.4c0-1.4 1.2-2.2 3-2.2h4c1.4 0 2.2.8 2.2 1.6 0 1.6-1.4 3-4.2 3h-2.6c-1.6 0-2.4-1-2.4-2.4z" />
      </>
    ),
  },
  /* il riccio: la cupola di aculei */
  riccio: {
    tinta: "var(--tav-tronco)",
    disegno: (
      <>
        <path d="M-10.6-1.2c-.6-6.4 4-11.4 10.8-11.8 5-.4 9 1.8 11 5.2l2.6.8-2.6 1.2c.2 1.8-.6 3.4-2 4.6z" />
        <path d="M-8.6-10.2l-1.6-4 3.6 2.6zM-4-13l-.8-4.2 3.2 3.2zM1-14.2l.4-4.2 2.6 3.6zM6-13.6l1.8-3.8 1.8 3.8zM10-11.4l3.2-2.8.2 4z" />
        <path d="M13.4-6.4l3.6.6-3.4 1.6z" />
        <circle cx="11.6" cy="-6.6" r=".9" fill="#000" opacity="0.4" />
      </>
    ),
  },
  /* lo stambecco: corna lunghe rovesciate all'indietro */
  stambecco: {
    tinta: "var(--tav-roccia)",
    disegno: (
      <>
        <ellipse cx="-2" cy="-9" rx="8" ry="4.6" />
        <path d="M-7.6-6h2.4v6h-2.4zM-3.4-6h2.4v6h-2.4zM1.2-6h2.4v6H1.2zM4.8-6h2.4v6H4.8z" />
        <path d="M4.4-10.6l4-5.4 3.4 2.2-3 5.2z" />
        <ellipse cx="10.6" cy="-16.6" rx="3.4" ry="2.8" />
        <path d="M13-17.4l3.6.8-3.4 2z" />
        <path d="M9.6-19.4c-.4-4 1.4-7.6 5.4-9.6-2 2.6-2.8 5.4-2.4 8.4zM12-19c.6-4 3-7 7-8.8-2.6 2.6-4 5.4-4.2 8.6z" />
        <path d="M9.4-13.6l1 3.4 1.8-2.8z" />
      </>
    ),
  },
  /* l'airone: zampe alte, collo a esse, becco a pugnale */
  airone: {
    tinta: "var(--tav-roccia-ombra)",
    disegno: (
      <>
        <path d="M-1-9h1.4V0H-1zM2.4-9h1.4V0H2.4z" />
        <ellipse cx="0" cy="-12" rx="6.6" ry="3.6" />
        <path d="M-6-13.4c-2.6-.4-4.6-1.4-5.8-3 2.6 0 4.6.6 6 1.8z" />
        <path d="M3-14c3-1 4.6-3.4 5-6.4.4-2.6 1.4-4 3-4.2l1.2 2c-1.6.4-2.2 1.6-2.4 3.4-.4 4-2.4 6.6-5.6 7.6z" />
        <circle cx="12.4" cy="-23.6" r="2.2" />
        <path d="M14.4-24.2l6 1.4-6 1.6z" />
      </>
    ),
  },
  /* il cormorano: corpo inclinato, becco uncinato */
  cormorano: {
    tinta: "var(--tav-inchiostro)",
    disegno: (
      <>
        <path d="M-1.6-6h1.6V0h-1.6zM1.6-6h1.6V0H1.6z" />
        <ellipse cx="0" cy="-9.4" rx="5.6" ry="4.4" transform="rotate(-14 0 -9.4)" />
        <path d="M-5-7.4c-2.4.6-4.2 1.8-5.4 3.6 2.6-.4 4.6-1.4 6-2.8z" />
        <path d="M2.6-12.4c1.6-2.6 2.4-5.4 2.4-8.4 0-2.6 1.4-4 3.2-3.8l1 2.2c-1.4.2-1.8 1.4-1.8 3.2 0 3.4-1 6.2-2.8 8.4z" />
        <circle cx="8.4" cy="-23" r="2.2" />
        <path d="M10.4-23.6l6 1.2-2.4 1.4 1.6 1.2-5.2-.6z" />
      </>
    ),
  },
  /* il picchio: piccolo, becco dritto, ciuffo sul capo */
  picchio: {
    tinta: "var(--tav-muro-ombra)",
    disegno: (
      <>
        <ellipse cx="-0.6" cy="-6.4" rx="5" ry="3.8" transform="rotate(-18 -0.6 -6.4)" />
        <path d="M-4.6-4.4c-2.4.4-4.2 1.4-5.4 3 2.4 0 4.2-.6 5.6-1.8z" />
        <circle cx="4.2" cy="-10.4" r="2.8" />
        <path d="M3.6-12.8l-.2-3.6 2.8 2.8z" />
        <path d="M6.6-10.8l4.8.8-4.6 1.6z" />
        <path d="M0-3.2h1.4V0H0zM2.6-3.2H4V0H2.6z" />
      </>
    ),
  },
  /* lo scoiattolo: la coda a esse più alta del corpo */
  scoiattolo: {
    tinta: "var(--tav-roccia-ombra)",
    disegno: (
      <>
        <path d="M-3-4c-6-1-10-6-9.4-12.4.4-4.6 3.6-7 5.6-5 2 2 .6 5-1.4 7-2.2 2.2-1.4 6 1.6 8z" />
        <ellipse cx="0" cy="-6" rx="4.8" ry="4.8" />
        <circle cx="4" cy="-11.4" r="3" />
        <path d="M2-13.6l-.2-3 2.6 2.2zM5.6-13.8l1.4-2.8 1.4 2.8z" />
        <path d="M6.6-10.6l4.2 1-4.2 1.6z" />
        <path d="M2.8-2.6c1.6 0 2.4.8 2.4 1.6S4.4 0 3.4 0H2z" />
      </>
    ),
  },
  /* la tartaruga: carapace a cupola, testa in fuori */
  tartaruga: {
    tinta: "var(--tav-bosco)",
    disegno: (
      <>
        <path d="M-10.6-2.2c0-5.6 4.6-9.8 10.4-9.8s10.4 4.2 10.4 9.8z" />
        <path d="M-11.4-2.2h22.4c0 1.4-.8 2.2-2.4 2.2h-17.6c-1.6 0-2.4-.8-2.4-2.2z" />
        <path d="M-8.6.2c-1.6 1-2.6 2-3 3.2h4.4zM6.6.2l1.4 3.2h4.4c-.4-1.2-1.4-2.2-3-3.2z" />
        <ellipse cx="12.4" cy="-4.4" rx="3.4" ry="2.6" />
        <path d="M15-5.4l3.4 1.2-3.4 1.4z" />
        <path d="M-5.4-5c1.4-2.2 3.4-3.4 5.6-3.4s4.2 1.2 5.6 3.4z" opacity=".3" />
      </>
    ),
  },
};

/** Una figura piantata sul foglio: chi è lo sa il canone, qui c'è solo la forma. */
export type Figura = {
  x: number;
  y: number;
  sagoma: NomeSagoma;
  /** Da che parte guarda: 1 a levante, -1 a ponente. */
  verso?: 1 | -1;
  /** Quanto è grande rispetto al normale, per i vecchissimi e i piccoli. */
  scala?: number;
};

/** Se un punto cade nel riquadro che si sta guardando. */
const inVista = (v: Inquadratura, x: number, y: number, margine = 40) =>
  x >= v.x - margine &&
  x <= v.x + v.larghezza + margine &&
  y >= v.y - margine &&
  y <= v.y + v.altezza + margine;

export function Figure({ figure, vista }: { figure: Figura[]; vista: Inquadratura }) {
  const dentro = figure.filter((f) => inVista(vista, f.x, f.y));
  if (dentro.length === 0) return null;

  return (
    <g>
      {dentro.map((f, i) => {
        const { tinta, disegno } = SAGOME[f.sagoma];
        const verso = f.verso ?? 1;
        const scala = f.scala ?? 1;

        return (
          <g key={i} className="figura" transform={`translate(${f.x} ${f.y}) scale(${(verso * scala).toFixed(2)} ${scala})`}>
            <ellipse cx="1" cy="0.6" rx="9" ry="2.4" fill="var(--tav-inchiostro)" opacity="0.24" />
            <g fill={tinta}>{disegno}</g>
            {/* Il filo di luce a maestrale, come su tutto il resto della tavola. */}
            <g fill="#fff" opacity="0.18" transform="translate(-0.7 -0.9)">
              {disegno}
            </g>
          </g>
        );
      })}
    </g>
  );
}
