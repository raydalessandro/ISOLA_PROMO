/**
 * I simboli che si ripetono: chiome e sassi.
 *
 * Stanno in un file loro perché li usano tutti e due i lati del disegno — le
 * definizioni SVG che li dichiarano e gli strati che li piantano — e se
 * abitassero insieme alle definizioni nascerebbe un giro di import chiuso su se
 * stesso.
 */

import { caso, fra, macchia } from "../tratto";

/*
 * Tre chiome per cinque misure: quindici disegni, e in pagina quattrocento
 * `use` da quaranta caratteri l'uno.
 *
 * La misura è cotta dentro il simbolo apposta. Un `<use>` con `transform=
 * "translate(…) scale(…)"` costa tre volte tanto in caratteri, e questo disegno
 * finisce dentro l'HTML della pagina: moltiplicato per quattrocento alberi
 * diventa la differenza fra una mappa che pesa quanto una foto e una che pesa
 * un decimo.
 *
 * Ogni chioma è una massa, una luce in alto a sinistra e un'ombra in basso a
 * destra — il sole della tavola viene da maestrale e vale per tutta l'isola,
 * dagli alberi alle montagne. Il colore non è scritto qui: lo passa chi pianta
 * l'albero, con `color`, così lo stesso disegno serve al bosco fitto e al
 * pascolo assolato.
 */
export const MISURE = [0.7, 1, 1.4, 1.9, 2.5];

const CHIOME = [0, 1, 2].flatMap((v) => {
  const rnd = caso(910 + v * 137);
  const lobi = 3 + v;

  const corpo = Array.from({ length: lobi }, (_, k) => {
    const a = (k / lobi) * Math.PI * 2 - 1.2;
    return { a, r: fra(rnd, 6.4, 8.6) };
  });
  const luce = fra(rnd, 3.6, 4.6);
  const ombra = fra(rnd, 4.2, 5.4);

  return MISURE.map((m, i) => ({
    id: `a${v}${i}`,
    /* Il tronco e le ombre dentro la chioma: si vedono solo da vicino, e da
       lontano sarebbero due granelli scuri sotto ogni albero. */
    tronco: {
      x: (-1.1 * m).toFixed(1),
      y: (2 * m).toFixed(1),
      larghezza: (2.2 * m).toFixed(1),
      altezza: (3.4 * m).toFixed(1),
    },
    dentro: [
      macchia(-1.6 * m, 1.2 * m, 3 * m, caso(97 + v * 11 + i), { punte: 7, irregolare: 0.45 }),
      macchia(2.6 * m, -0.6 * m, 2.4 * m, caso(131 + v * 7 + i), { punte: 7, irregolare: 0.45 }),
    ],
    corpo: corpo.map((c) =>
      macchia(Math.cos(c.a) * 3.2 * m, (Math.sin(c.a) * 2.4 - 1.4) * m, c.r * m, caso(1 + v * 7 + i), {
        punte: 9,
        irregolare: 0.36,
      }),
    ),
    luce: macchia(-3.2 * m, -4.4 * m, luce * m, caso(31 + v * 5 + i), { punte: 7, irregolare: 0.4 }),
    ombra: macchia(3.4 * m, 2.2 * m, ombra * m, caso(53 + v * 3 + i), { punte: 7, irregolare: 0.4 }),
    ombraTerra: { cx: 3.2 * m, cy: 4.6 * m, rx: 8.6 * m, ry: 3 * m },
  }));
});

/**
 * Il nome del simbolo per un albero di raggio `r`: si prende la misura più
 * vicina, e si sceglie se l'albero porta la sua ombra a terra.
 *
 * Nel bosco fitto l'ombra si toglie. Sembra un dettaglio e non lo è: quattro
 * ombre ovali sotto quattro chiome che si toccano diventano un punteggiato
 * scuro fra una chioma e l'altra, e il bosco si legge come una manciata di
 * cespugli tondi invece che come una volta di rami. L'ombra serve all'albero
 * isolato in mezzo al prato, che senza galleggia.
 */
/**
 * Quale chioma, di quale misura: si prende la misura più vicina a quel raggio.
 *
 * Torna solo la coda del nome — la famiglia la sceglie chi disegna, e sono tre:
 * `a` con l'ombra a terra, per l'albero isolato in mezzo al prato; `b` senza
 * ombra, per il bosco fitto, dove quattro ovali scuri sotto quattro chiome che
 * si toccano diventano un punteggiato; `c` col tronco e le ombre dentro, per
 * quando si guarda da vicino.
 */
export const chioma = (v: number, r: number) => {
  const m = r / 10;
  let vicina = 0;
  for (let i = 1; i < MISURE.length; i++) {
    if (Math.abs(MISURE[i] - m) < Math.abs(MISURE[vicina] - m)) vicina = i;
  }
  return `${v}${vicina}`;
};

/** La famiglia di chiome giusta per come e dove si sta disegnando. */
export const famiglia = (fitto: boolean, dettaglio: boolean) =>
  dettaglio ? "c" : fitto ? "b" : "a";

/* Gli scogli: otto sassi in tre misure, sparsi lungo la riva con `use`. */
const SASSI = [0, 1, 2, 3, 4, 5, 6, 7].flatMap((v) => {
  const rnd = caso(600 + v * 29);
  const forma = { punte: 7, irregolare: 0.55 } as const;
  return [0, 1, 2].map((i) => ({
    id: `s${v}${i}`,
    d: macchia(0, 0, [4.5, 7.5, 11][i], caso(600 + v * 29 + i), forma),
    salto: rnd(),
  }));
});

export const sasso = (v: number, r: number) => `#s${v}${r < 6 ? 0 : r < 9 ? 1 : 2}`;

/**
 * Si dichiarano solo le chiome che si useranno.
 *
 * Le famiglie sono tre e quella da vicino non serve mai insieme alle altre due:
 * dichiararle tutte vorrebbe dire portarsi dietro in ogni file trenta disegni
 * che quel file non richiama. Sono trenta kilobyte a immagine, per niente.
 */
export function SimboliRipetuti({ dettaglio }: { dettaglio: boolean }) {
  return (
    <>
      {!dettaglio &&
        CHIOME.map((c) => (
          <g id={c.id} key={c.id}>
            <ellipse cx={c.ombraTerra.cx.toFixed(1)} cy={c.ombraTerra.cy.toFixed(1)} rx={c.ombraTerra.rx.toFixed(1)} ry={c.ombraTerra.ry.toFixed(1)} fill="var(--tav-inchiostro)" opacity="0.18" />
            <use href={`#${c.id.replace("a", "b")}`} />
          </g>
        ))}

      {!dettaglio && CHIOME.map((c) => (
        <g id={c.id.replace("a", "b")} key={c.id}>
          {c.corpo.map((d, k) => (
            <path key={k} d={d} fill="currentColor" />
          ))}
          <path d={c.ombra} fill="var(--tav-inchiostro)" opacity="0.22" />
          <path d={c.luce} fill="#fff" opacity="0.22" />
        </g>
      ))}

      {/* Gli stessi alberi, ma da vicino: il tronco sotto e due ombre dentro la
          chioma. Un albero senza tronco, guardato da due passi, è un cespuglio. */}
      {dettaglio && CHIOME.map((c) => (
        <g id={c.id.replace("a", "c")} key={c.id}>
          <ellipse cx={c.ombraTerra.cx.toFixed(1)} cy={c.ombraTerra.cy.toFixed(1)} rx={c.ombraTerra.rx.toFixed(1)} ry={c.ombraTerra.ry.toFixed(1)} fill="var(--tav-inchiostro)" opacity="0.18" />
          <rect x={c.tronco.x} y={c.tronco.y} width={c.tronco.larghezza} height={c.tronco.altezza} fill="var(--tav-tronco)" />
          {c.corpo.map((d, k) => (
            <path key={k} d={d} fill="currentColor" />
          ))}
          {c.dentro.map((d, k) => (
            <path key={k} d={d} fill="var(--tav-inchiostro)" opacity="0.16" />
          ))}
          <path d={c.ombra} fill="var(--tav-inchiostro)" opacity="0.22" />
          <path d={c.luce} fill="#fff" opacity="0.22" />
        </g>
      ))}

      {SASSI.map((s) => (
        <path id={s.id} key={s.id} d={s.d} />
      ))}
    </>
  );
}
