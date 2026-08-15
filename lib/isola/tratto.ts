/**
 * Gli attrezzi del disegno: un caso governato, curve morbide, semine dentro
 * una forma.
 *
 * Niente qui sa cos'è un'isola. Sono le poche funzioni geometriche che servono
 * a disegnarne una a mano in SVG: `geografia.ts` dice dove stanno le cose,
 * `components/isola/` le disegna, e questo file è la matita.
 *
 * Una regola sola, ma vincolante: **il disegno è deterministico**. Gli alberi
 * sono sparsi a caso, ma è un caso con un seme scritto nel codice, quindi il
 * bosco è identico a ogni render — server, client e screenshot di prova
 * producono lo stesso markup. Un `Math.random()` qui dentro farebbe litigare
 * l'idratazione e cambierebbe l'isola a ogni ricarica.
 */

/** Un punto sul foglio, nelle unità del viewBox (1000×1500). */
export type P = readonly [number, number];

/**
 * Mulberry32: piccolo, veloce, e soprattutto sempre uguale a se stesso.
 * Si passa un seme diverso per ogni campo di semina, così aggiungere un albero
 * in un bosco non rimescola tutti gli altri boschi.
 */
export function caso(seme: number): () => number {
  let a = seme >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Un numero fra due estremi. */
export const fra = (rnd: () => number, min: number, max: number) => min + rnd() * (max - min);

/** Una voce a caso da un elenco. */
export const scegli = <T,>(rnd: () => number, voci: readonly T[]) =>
  voci[Math.min(voci.length - 1, Math.floor(rnd() * voci.length))];

/**
 * Un decimale basta.
 *
 * Non è pignoleria: questo disegno è fatto di migliaia di numeri e finisce
 * dentro l'HTML della pagina. Fra `123.46` e `123.5` non cambia un pixel, e
 * cambiano decine di kilobyte.
 */
const n = (v: number) => Math.round(v * 10) / 10;

/**
 * Una curva morbida che passa **per** i punti dati (Catmull-Rom convertita in
 * cubiche di Bézier). Serve per coste e fiumi: si scrivono pochi punti letti
 * sulla tavola e la curva ci passa in mezzo senza spigoli.
 */
export function curva(punti: readonly P[], chiusa = true, tensione = 1): string {
  if (punti.length < 2) return "";
  const p = (i: number): P =>
    chiusa
      ? punti[(i + punti.length) % punti.length]
      : punti[Math.max(0, Math.min(punti.length - 1, i))];

  let d = `M${n(punti[0][0])} ${n(punti[0][1])}`;
  const ultimo = chiusa ? punti.length : punti.length - 1;

  for (let i = 0; i < ultimo; i++) {
    const [x0, y0] = p(i - 1);
    const [x1, y1] = p(i);
    const [x2, y2] = p(i + 1);
    const [x3, y3] = p(i + 2);
    const k = tensione / 6;

    d +=
      `C${n(x1 + (x2 - x0) * k)} ${n(y1 + (y2 - y0) * k)}` +
      ` ${n(x2 - (x3 - x1) * k)} ${n(y2 - (y3 - y1) * k)}` +
      ` ${n(x2)} ${n(y2)}`;
  }

  return chiusa ? `${d}Z` : d;
}

/** Una macchia tondeggiante ma non rotonda: la base di chiome, prati, secche. */
export function macchia(
  cx: number,
  cy: number,
  raggio: number,
  rnd: () => number,
  { punte = 9, irregolare = 0.28, schiaccia = 1 } = {},
): string {
  const punti: P[] = [];
  for (let i = 0; i < punte; i++) {
    const a = (i / punte) * Math.PI * 2;
    const r = raggio * (1 - irregolare / 2 + rnd() * irregolare);
    punti.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r * schiaccia]);
  }
  return curva(punti);
}

/** Il rettangolo che contiene una forma. */
export const riquadro = (poligono: readonly P[]) => {
  const xs = poligono.map((p) => p[0]);
  const ys = poligono.map((p) => p[1]);
  return {
    x: Math.min(...xs),
    y: Math.min(...ys),
    x2: Math.max(...xs),
    y2: Math.max(...ys),
  };
};

/** Se un punto cade dentro una forma chiusa (ray casting). */
export function dentro(poligono: readonly P[], [x, y]: P): boolean {
  let sì = false;
  for (let i = 0, j = poligono.length - 1; i < poligono.length; j = i++) {
    const [xi, yi] = poligono[i];
    const [xj, yj] = poligono[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) sì = !sì;
  }
  return sì;
}

/**
 * Semina punti dentro una forma, tenendoli a distanza fra loro.
 *
 * Si tira a caso dentro il riquadro e si scarta chi cade fuori dalla forma o
 * troppo vicino a un fratello: un bosco fatto così ha i vuoti e gli addensamenti
 * di un bosco vero, mentre una griglia si vede da lontano che è una griglia.
 */
export function semina(
  poligono: readonly P[],
  quanti: number,
  rnd: () => number,
  { distanza = 0, tentativi = 40 } = {},
): P[] {
  const r = riquadro(poligono);
  const punti: P[] = [];

  for (let i = 0; i < quanti; i++) {
    for (let t = 0; t < tentativi; t++) {
      const p: P = [fra(rnd, r.x, r.x2), fra(rnd, r.y, r.y2)];
      if (!dentro(poligono, p)) continue;
      if (distanza > 0 && punti.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < distanza)) {
        continue;
      }
      punti.push(p);
      break;
    }
  }

  return punti;
}

/** Il punto a una certa frazione di una spezzata: serve a posare cose lungo una riva. */
export function lungo(punti: readonly P[], t: number): P {
  const tratti: number[] = [];
  let totale = 0;
  for (let i = 1; i < punti.length; i++) {
    const l = Math.hypot(punti[i][0] - punti[i - 1][0], punti[i][1] - punti[i - 1][1]);
    tratti.push(l);
    totale += l;
  }

  let resta = totale * Math.max(0, Math.min(1, t));
  for (let i = 0; i < tratti.length; i++) {
    if (resta > tratti[i]) {
      resta -= tratti[i];
      continue;
    }
    const k = tratti[i] === 0 ? 0 : resta / tratti[i];
    return [
      punti[i][0] + (punti[i + 1][0] - punti[i][0]) * k,
      punti[i][1] + (punti[i + 1][1] - punti[i][1]) * k,
    ];
  }
  return punti[punti.length - 1];
}

/** Il baricentro di una forma. */
export const centro = (poligono: readonly P[]): P => [
  poligono.reduce((s, p) => s + p[0], 0) / poligono.length,
  poligono.reduce((s, p) => s + p[1], 0) / poligono.length,
];

/** Una forma ristretta verso il suo centro: la riva interna, l'ombra di una macchia. */
export function verso(poligono: readonly P[], fattore: number): P[] {
  const [cx, cy] = centro(poligono);
  return poligono.map(([x, y]) => [cx + (x - cx) * fattore, cy + (y - cy) * fattore] as const);
}

/**
 * La stessa cosa, ma detta al disegno invece che alla geometria: la trasformata
 * che ingrandisce o restringe una forma **attorno al suo centro**.
 *
 * Serve a non riscrivere una costa da duecento punti ogni volta che la si vuole
 * un po' più larga o un po' più stretta: si dichiara una volta con un `id` e
 * la si richiama con `use` e questa trasformata. Sono decine di kilobyte di
 * pagina in meno, a parità di disegno.
 */
export const attornoAlCentro = (poligono: readonly P[], fattore: number) => {
  const [cx, cy] = centro(poligono);
  const k = Math.round(fattore * 1000) / 1000;
  return `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${k}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`;
};

/**
 * Una striscia che si allarga: un fiume che sfocia, un pontile, una foce.
 *
 * Si prende la spezzata, si cammina lungo i suoi punti e a ciascuno si apre la
 * perpendicolare della larghezza voluta — larga `da` all'inizio, `a` alla fine.
 * Il risultato è una forma chiusa, non un tratto: si può riempire.
 */
export function nastro(punti: readonly P[], da: number, a: number): string {
  const ultimo = punti.length - 1;
  const perpendicolare = (i: number): P => {
    const [x0, y0] = punti[Math.max(0, i - 1)];
    const [x1, y1] = punti[Math.min(ultimo, i + 1)];
    const l = Math.hypot(x1 - x0, y1 - y0) || 1;
    return [-(y1 - y0) / l, (x1 - x0) / l];
  };

  const sopra: P[] = [];
  const sotto: P[] = [];
  punti.forEach(([x, y], i) => {
    const mezza = (da + (a - da) * (i / ultimo)) / 2;
    const [nx, ny] = perpendicolare(i);
    sopra.push([x + nx * mezza, y + ny * mezza]);
    sotto.push([x - nx * mezza, y - ny * mezza]);
  });

  return curva([...sopra, ...sotto.reverse()], true);
}

/**
 * Frastaglia una linea: la costa di un'isola non è un ovale.
 *
 * Fra un punto e l'altro se ne infilano altri, spostati di traverso di quanto
 * dice `ampiezza`. La curva ci ripassa in mezzo morbida, ma non è più regolare:
 * sono le insenature e i promontori che un ovale non ha. Il caso è quello del
 * seme, quindi la costa è sempre la stessa costa.
 */
export function frastaglia(
  punti: readonly P[],
  rnd: () => number,
  ampiezza: number,
  chiusa = true,
  fitta = 2,
): P[] {
  const fuori: P[] = [];
  const ultimo = chiusa ? punti.length : punti.length - 1;

  for (let i = 0; i < ultimo; i++) {
    const [x0, y0] = punti[i];
    const [x1, y1] = punti[(i + 1) % punti.length];
    fuori.push(punti[i]);

    const l = Math.hypot(x1 - x0, y1 - y0) || 1;
    const nx = -(y1 - y0) / l;
    const ny = (x1 - x0) / l;

    for (let k = 1; k <= fitta; k++) {
      const t = k / (fitta + 1);
      const s = fra(rnd, -ampiezza, ampiezza);
      fuori.push([x0 + (x1 - x0) * t + nx * s, y0 + (y1 - y0) * t + ny * s]);
    }
  }

  if (!chiusa) fuori.push(punti[punti.length - 1]);
  return fuori;
}
