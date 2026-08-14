/**
 * I simboli che si ripetono: chiome e sassi.
 *
 * Stanno in un file loro perché li usano tutti e due i lati del disegno — le
 * definizioni SVG che li dichiarano e gli strati che li piantano — e se
 * abitassero insieme alle definizioni nascerebbe un giro di import chiuso su se
 * stesso.
 */

import { caso, fra, macchia } from "@/lib/isola/tratto";

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

/** Il nome del simbolo per un albero di raggio `r`: si prende la misura più vicina. */
export const chioma = (v: number, r: number) => {
  const m = r / 10;
  let vicina = 0;
  for (let i = 1; i < MISURE.length; i++) {
    if (Math.abs(MISURE[i] - m) < Math.abs(MISURE[vicina] - m)) vicina = i;
  }
  return `#a${v}${vicina}`;
};

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

export function SimboliRipetuti() {
  return (
    <>
      {CHIOME.map((c) => (
        <g id={c.id} key={c.id}>
          <ellipse cx={c.ombraTerra.cx.toFixed(1)} cy={c.ombraTerra.cy.toFixed(1)} rx={c.ombraTerra.rx.toFixed(1)} ry={c.ombraTerra.ry.toFixed(1)} fill="var(--tav-inchiostro)" opacity="0.18" />
          {c.corpo.map((d, k) => (
            <path key={k} d={d} fill="currentColor" />
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
