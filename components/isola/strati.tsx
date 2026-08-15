/**
 * Gli strati del disegno, dal mare in giù fino alla grana della carta.
 *
 * Ognuno è una funzione che restituisce un gruppo SVG e non sa niente degli
 * altri: l'ordine in cui si sovrappongono lo decide `isola-disegnata.tsx`.
 * Le forme vengono da `lib/isola/geografia.ts`, i colori dai token `--tav-*`
 * dichiarati in `app/styles/isola.css` — qui non compare nessun colore scritto
 * a mano, se non i bianchi e i neri di luce e ombra, che sono trasparenze.
 *
 * Tutto quello che è "a caso" — alberi, onde, scogli, rughe della roccia — si
 * calcola una volta sola al caricamento del modulo, con un seme fisso: il
 * disegno che esce dal server è identico a quello che il browser si ritrova, e
 * ricaricare la pagina non rimescola il bosco.
 */

import {
  ALBERO_VECCHIO, BOCCA, BOSCHI, CAPANNE_PASTORI, CAPANNE_SPIAGGIA, CASE_FUOCO,
  CASE_VILLAGGIO, CIGLIO, CIPRESSI, COSTA_VERA, FIUME_EST, FIUME_OVEST, FORESTA,
  FORNO, FUOCO, MASSICCIO, ORTI, PASCOLI_ALTI, PONTE, PONTILE, POZZA,
  PRATO_ANELLO, PRATO_SUD_EST, PRATO_SUD_OVEST, SECCA_LARGA, SECCA_STRETTA,
  SELLA, SENTIERI, SPIAGGIA, type Casa,
} from "@/lib/isola/geografia";
import { chioma, sasso } from "@/components/isola/simboli";
import {
  attornoAlCentro, caso, curva, dentro, fra, frastaglia, lungo, macchia, nastro,
  type P, scegli, semina, verso,
} from "@/lib/isola/tratto";

/* ---------- il mare ---------- */

const ORLO = verso(COSTA_VERA, 1.12);
const ONDE = (() => {
  const rnd = caso(8801);
  const foglio: P[] = [[-10, -10], [1010, -10], [1010, 1510], [-10, 1510]];
  return semina(foglio, 380, rnd, { distanza: 36 })
    .filter((p) => !dentro(ORLO, p))
    .map((p) => ({ p: [Math.round(p[0]), Math.round(p[1])] as P, l: Math.round(fra(rnd, 9, 26)), o: fra(rnd, 0.14, 0.4) }));
})();

/* Chiazze di fondale, e gli scogli che spuntano al largo: sulla tavola ce ne
   sono a sud-ovest e a sud-est, dove la costa si sbriciola in mare. */
const CHIAZZE = (() => {
  const rnd = caso(2727);
  const larga = verso(COSTA_VERA, 1.2);
  return semina([[0, 0], [1000, 0], [1000, 1500], [0, 1500]], 26, rnd, { distanza: 150 })
    .filter((p) => !dentro(larga, p))
    .map((p) => ({
      d: macchia(p[0], p[1], fra(rnd, 60, 150), rnd, { punte: 9, irregolare: 0.5 }),
      chiara: rnd() > 0.45,
      o: fra(rnd, 0.08, 0.2),
    }));
})();

const SCOGLI_AL_LARGO: { x: number; y: number; v: number; r: number }[] = [
  { x: 138, y: 1276, v: 2, r: 9 }, { x: 168, y: 1312, v: 5, r: 5 },
  { x: 110, y: 1232, v: 3, r: 5 }, { x: 846, y: 1272, v: 1, r: 8 },
  { x: 878, y: 1232, v: 4, r: 5 }, { x: 818, y: 1306, v: 6, r: 5 },
  { x: 952, y: 992, v: 0, r: 6 }, { x: 54, y: 706, v: 7, r: 5 },
  { x: 70, y: 972, v: 2, r: 5 }, { x: 934, y: 474, v: 5, r: 5 },
];

export function Mare() {
  return (
    <g>
      <rect x="-20" y="-20" width="1040" height="1540" fill="url(#g-mare)" />

      {/* Le chiazze dell'acquerello: il mare della tavola non è mai di un colore
          solo, ha i fondali che si vedono attraverso. */}
      <g filter="url(#f-sfoca)">
        {CHIAZZE.map((c, i) => (
          <path key={i} d={c.d} fill={c.chiara ? "var(--tav-mare-chiaro)" : "var(--tav-mare-fondo)"} opacity={c.o.toFixed(2)} />
        ))}
      </g>

      {/* L'ombra dell'isola nell'acqua: senza, l'isola sta appiccicata al fondo
          invece di galleggiarci sopra. */}
      <g transform="translate(8 12)">
        <use href="#p-costa" transform={attornoAlCentro(COSTA_VERA, 1.03)} fill="var(--tav-mare-fondo)" opacity="0.3" filter="url(#f-sfoca)" />
      </g>

      {/* Le secche: l'acqua si schiarisce due volte prima di toccare la riva. */}
      <use href="#p-costa" transform={attornoAlCentro(COSTA_VERA, SECCA_LARGA)} fill="var(--tav-mare-chiaro)" opacity="0.55" filter="url(#f-acquerello)" />
      <use href="#p-costa" transform={attornoAlCentro(COSTA_VERA, SECCA_STRETTA)} fill="var(--tav-secca)" opacity="0.6" filter="url(#f-acquerello)" />

      <g stroke="var(--tav-schiuma)" fill="none" strokeLinecap="round" strokeWidth="2">
        {ONDE.map(({ p, l, o }, i) => (
          <path key={i} d={`M${p[0]} ${p[1]}q${l / 2} -3.2 ${l} 0`} opacity={o.toFixed(1)} />
        ))}
      </g>

      <use
        href="#p-costa"
        transform={attornoAlCentro(COSTA_VERA, 1.016)}
        fill="none"
        stroke="var(--tav-schiuma)"
        strokeWidth="5"
        opacity="0.5"
        filter="url(#f-sfoca-corta)"
      />

      {/*
       * Gli scogli al largo. La misura si cambia scegliendo un altro sasso, non
       * scalando: su un `use` la scala si applica prima di `x` e `y`, e il sasso
       * finirebbe da un'altra parte invece che più grande dov'è.
       */}
      <g>
        {SCOGLI_AL_LARGO.map((s, i) => (
          <g key={i}>
            <use href={sasso(s.v, s.r * 1.7)} x={s.x} y={s.y} fill="var(--tav-schiuma)" opacity="0.4" filter="url(#f-sfoca-corta)" />
            <use href={sasso(s.v, s.r)} x={s.x} y={s.y} fill="var(--tav-roccia-ombra)" opacity="0.9" />
            <use href={sasso(s.v, s.r * 0.55)} x={s.x - 2} y={s.y - 2} fill="var(--tav-roccia-luce)" opacity="0.55" />
          </g>
        ))}
      </g>
    </g>
  );
}

/* ---------- la terra e il suo ciglio ---------- */

const SCOGLI = (() => {
  const rnd = caso(3307);
  const giro: P[] = [...COSTA_VERA, COSTA_VERA[0]];
  const pezzi: { x: number; y: number; v: number; r: number; luce: boolean }[] = [];

  for (let t = 0; t < 1; t += 0.007) {
    const [x, y] = lungo(giro, t + fra(rnd, -0.002, 0.002));
    const fuori = fra(rnd, 0.992, 1.024);
    pezzi.push({
      x: Math.round(x * fuori),
      y: Math.round(y * fuori),
      v: Math.floor(fra(rnd, 0, 8)),
      r: fra(rnd, 4, 12),
      luce: rnd() > 0.5,
    });
  }

  return pezzi;
})();

export function Terra() {
  return (
    <g>
      {/* Prima la scogliera, poi la terra dentro: il ciglio è quello che avanza
          fra le due, e così la costa si disegna una volta invece di due. */}
      <use href="#p-costa" fill="var(--tav-roccia)" filter="url(#f-acquerello)" />
      <use href="#p-costa" transform={attornoAlCentro(COSTA_VERA, CIGLIO)} fill="url(#g-terra)" filter="url(#f-acquerello)" />

      <g clipPath="url(#c-isola)">
        {SCOGLI.map((s, i) => (
          <use
            key={i}
            href={sasso(s.v, s.r)}
            x={s.x}
            y={s.y}
            fill={s.luce ? "var(--tav-roccia-luce)" : "var(--tav-roccia-ombra)"}
            opacity="0.5"
          />
        ))}
      </g>

      {/* L'orlo bagnato dell'isola, dove la roccia scende in acqua. */}
      <use href="#p-costa" fill="none" stroke="var(--tav-inchiostro)" strokeWidth="2" opacity="0.4" />
    </g>
  );
}

/* ---------- i prati, la sabbia, la terra secca ---------- */

/* I ciuffi d'erba: cinquecento segni corti sparsi sui prati. Sono quello che
   distingue un prato dipinto da un poligono verde. */
const CIUFFI = (() => {
  const rnd = caso(6161);
  const campi = [PASCOLI_ALTI, PRATO_ANELLO, PRATO_SUD_OVEST, PRATO_SUD_EST];
  return campi.flatMap((campo) =>
    semina(campo, 190, rnd, { distanza: 15 }).map(([x, y]) => {
      const h = fra(rnd, 3.4, 7);
      const p = fra(rnd, -2.4, 2.4);
      return `M${Math.round(x)} ${Math.round(y)}q${p.toFixed(1)} ${(-h / 2).toFixed(1)} ${(p * 1.3).toFixed(1)} ${(-h).toFixed(1)}`;
    }),
  );
})();

/** I muretti a secco che dividono i campi, come sulla tavola. */
const MURETTI: P[][] = [
  [[262, 340], [340, 356], [420, 344], [470, 316]],
  [[600, 330], [668, 352], [742, 350], [790, 372]],
  [[352, 1046], [300, 1092], [250, 1116], [196, 1112]],
  [[700, 1136], [762, 1108], [820, 1064]],
  [[860, 1130], [820, 1188], [768, 1224]],
];

export function Prati() {
  const campi: { forma: P[]; colore: string; opacità: number }[] = [
    { forma: PASCOLI_ALTI, colore: "var(--tav-prato)", opacità: 0.95 },
    { forma: PRATO_ANELLO, colore: "var(--tav-prato-chiaro)", opacità: 0.95 },
    { forma: PRATO_SUD_OVEST, colore: "var(--tav-prato)", opacità: 0.9 },
    { forma: PRATO_SUD_EST, colore: "var(--tav-prato-chiaro)", opacità: 0.9 },
  ];

  return (
    <g>
      <g filter="url(#f-acquerello)">
        {campi.map((c, i) => (
          <g key={i}>
            <path d={curva(c.forma)} fill={c.colore} opacity={c.opacità} />
            {/* La luce batte al centro del prato, l'orlo resta più carico. */}
            <path d={curva(verso(c.forma, 0.68))} fill="var(--tav-prato-chiaro)" opacity="0.3" />
          </g>
        ))}

        {/* Il quartiere di Fuoco: terra secca, chiara, senz'erba. Il bordo è
            frastagliato come tutto il resto — un'ellisse sfumata sembrerebbe un
            alone, non un pezzo d'isola. */}
        <path d={curva(frastaglia(FUOCO, caso(818), 12))} fill="var(--tav-secco)" />
        <path d={curva(frastaglia(verso(FUOCO, 0.66), caso(819), 10))} fill="var(--tav-secco-chiaro)" opacity="0.6" />

        <path d={curva(SPIAGGIA)} fill="var(--tav-sabbia)" />
        <path d={curva(verso(SPIAGGIA, 0.78))} fill="var(--tav-sabbia-chiara)" opacity="0.75" />
      </g>

      <g stroke="var(--tav-bosco)" fill="none" strokeWidth="1.5" strokeLinecap="round" opacity="0.3">
        {CIUFFI.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      <g fill="none" strokeLinecap="round">
        {MURETTI.map((m, i) => (
          <g key={i}>
            <path d={curva(m, false)} stroke="var(--tav-roccia-ombra)" strokeWidth="4.5" opacity="0.45" />
            <path d={curva(m, false)} stroke="var(--tav-roccia-luce)" strokeWidth="2" opacity="0.6" />
          </g>
        ))}
      </g>
    </g>
  );
}

/* ---------- le acque dolci ---------- */

/** Un braccio del fiume: il letto scuro, l'acqua, il riflesso. */
function Braccio({ punti, larghezza }: { punti: P[]; larghezza: number }) {
  const d = curva(frastaglia(punti, caso(punti[3][0] | 0), 3.5, false, 1), false);
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke="var(--tav-fiume-riva)" strokeWidth={larghezza + 16} opacity="0.75" />
      <path d={d} stroke="url(#g-fiume)" strokeWidth={larghezza} />
      <path d={d} stroke="var(--tav-fiume-chiaro)" strokeWidth={larghezza * 0.3} opacity="0.7" />
    </g>
  );
}

export function Acque() {
  return (
    <g>
      <Braccio punti={FIUME_EST} larghezza={22} />
      <Braccio punti={FIUME_OVEST} larghezza={21} />

      {/* La Bocca si allarga scendendo: è l'unica apertura dell'anello. */}
      <g>
        <path d={nastro(BOCCA, 32, 64)} fill="var(--tav-fiume-riva)" opacity="0.7" />
        <path d={nastro(BOCCA, 21, 48)} fill="url(#g-fiume)" />
        <path d={nastro(BOCCA, 8, 20)} fill="var(--tav-fiume-chiaro)" opacity="0.65" />
      </g>

      {/* Il rigagnolo che scende dalla sella e riempie la pozza dei pastori. */}
      <path d={curva(SELLA, false)} fill="none" stroke="var(--tav-fiume)" strokeWidth="6" opacity="0.85" strokeLinecap="round" />

      <g>
        <path
          d={macchia(POZZA.cx, POZZA.cy, POZZA.rx + 6, caso(414), { punte: 11, irregolare: 0.22, schiaccia: POZZA.ry / POZZA.rx })}
          fill="var(--tav-fiume-riva)"
          opacity="0.5"
        />
        <path
          d={macchia(POZZA.cx, POZZA.cy, POZZA.rx, caso(415), { punte: 11, irregolare: 0.2, schiaccia: POZZA.ry / POZZA.rx })}
          fill="url(#g-fiume)"
        />
        <ellipse cx={POZZA.cx - 10} cy={POZZA.cy - 5} rx={POZZA.rx * 0.4} ry={POZZA.ry * 0.34} fill="var(--tav-fiume-chiaro)" opacity="0.6" />
      </g>
    </g>
  );
}

/* ---------- le Montagne Gemelle ---------- */

/*
 * Una montagna non è un poligono con sopra due facce colorate: è una cosa che
 * si legge per creste sovrapposte, quella dietro più scura di quella davanti.
 * Qui sono tre: il massiccio con le due vette, una costiera di mezzo, e i
 * risalti in prima fila. Ogni cresta sale a gradini irregolari — la roccia si
 * spezza, non scivola — e il prato le copre il piede, così il massiccio esce
 * dal terreno invece di stargli appoggiato sopra.
 */
function salita(da: P, a: P, passi: number, rnd: () => number): P[] {
  const punti: P[] = [];
  for (let i = 1; i < passi; i++) {
    const t = i / passi;
    /* Esponenti diversi su x e y: la spalla resta larga e la cima si stringe. */
    const x = da[0] + (a[0] - da[0]) * Math.pow(t, 0.86) + fra(rnd, -8, 8);
    const y = da[1] + (a[1] - da[1]) * Math.pow(t, 1.2) + fra(rnd, -9, 7);
    punti.push([x, y]);
    if (i % 3 === 0) punti.push([x + fra(rnd, 5, 15), y + fra(rnd, 4, 14)]);
  }
  return punti;
}

/** Una cresta chiusa in basso: pronta da riempire. */
function cresta(vertici: P[], base: number, rnd: () => number): P[] {
  const linea: P[] = [vertici[0]];
  for (let i = 1; i < vertici.length; i++) {
    linea.push(...salita(vertici[i - 1], vertici[i], i % 2 ? 6 : 4, rnd), vertici[i]);
  }
  return [...linea, [vertici[vertici.length - 1][0], base], [vertici[0][0], base]];
}

const RILIEVO = (() => {
  const rnd = caso(MASSICCIO.seme);
  const { piedeSinistro: ps, ponente, sella, levante, piedeDestro: pd } = MASSICCIO;

  const alta = cresta([ps, ponente, sella, levante, pd], 356, rnd);

  /* Gli speroni: le spalle che si staccano dalle due vette e vengono avanti.
     Sono loro a togliere alle cime l'aria di candela — una montagna vera non ha
     un profilo solo. */
  const speroni = [
    cresta([[236, 300], [300, 176], [368, 246]], 320, rnd),
    cresta([[404, 288], [468, 168], [524, 250]], 316, rnd),
    cresta([[556, 286], [636, 154], [704, 252]], 318, rnd),
    cresta([[688, 292], [744, 196], [796, 288]], 324, rnd),
  ];

  /* La costiera di mezzo: rocciosa ancora, ma molto più bassa. */
  const mezza = cresta(
    [[196, 330], [292, 232], [392, 268], [500, 218], [606, 264], [702, 226], [806, 324]],
    352, rnd,
  );

  /* I risalti in prima fila non sono roccia: sono i primi dossi d'erba, quelli
     su cui i pastori portano le capre. Verdi, con i sassi che spuntano. */
  const bassa = cresta(
    [[176, 348], [268, 290], [366, 312], [458, 284], [552, 308], [648, 286], [746, 310], [828, 346]],
    362, rnd,
  );

  /* Le facce in ombra: a levante di ogni vetta, che il sole viene da maestrale. */
  const ombre = [ponente, levante].map((v) => [
    v,
    [v[0] + 38, v[1] + 86],
    [v[0] + 84, v[1] + 196],
    [v[0] + 20, v[1] + 208],
    [v[0] + 6, v[1] + 90],
  ] as P[]);

  const rughe: string[] = [];
  for (let k = 0; k < 46; k++) {
    const [x, y] = lungo(alta.slice(0, -2), fra(rnd, 0.05, 0.95));
    const lung = fra(rnd, 20, 68);
    const scarto = fra(rnd, -16, 16);
    rughe.push(`M${x.toFixed(1)} ${y.toFixed(1)}q${scarto.toFixed(1)} ${(lung / 2).toFixed(1)} ${(scarto * 0.5).toFixed(1)} ${lung.toFixed(1)}`);
  }

  const detriti = semina(
    [[ps[0] - 40, 274], [pd[0] + 40, 274], [pd[0] + 30, 348], [ps[0] - 30, 348]],
    40, rnd, { distanza: 16 },
  ).map((p) => ({ p, r: fra(rnd, 2.4, 6.5), luce: rnd() > 0.5 }));

  return { alta, speroni, mezza, bassa, ombre, rughe, detriti };
})();

/** L'ombra che il massiccio getta sul pascolo, verso levante. Si disegna dopo i
    prati, altrimenti il prato ci passa sopra e la montagna torna a galleggiare. */
export function OmbraDeiMonti() {
  return (
    <path
      d={curva(RILIEVO.bassa)}
      fill="var(--tav-inchiostro)"
      opacity="0.14"
      transform="translate(26 16)"
      filter="url(#f-sfoca)"
    />
  );
}

export function Montagne() {
  return (
    <g>
      <path d={curva(RILIEVO.alta)} fill="url(#g-roccia)" filter="url(#f-acquerello)" />

      <g>
        {RILIEVO.ombre.map((o, i) => (
          <path key={i} d={curva(o)} fill="var(--tav-roccia-ombra)" opacity="0.42" />
        ))}
      </g>

      <g stroke="var(--tav-roccia-ombra)" fill="none" strokeWidth="1.8" strokeLinecap="round" opacity="0.3">
        {RILIEVO.rughe.map((d, k) => (
          <path key={k} d={d} />
        ))}
      </g>

      <g>
        {RILIEVO.speroni.map((sp, i) => (
          <g key={i}>
            <path d={curva(sp)} fill="var(--tav-roccia)" filter="url(#f-acquerello)" />
            <path d={curva(sp)} fill="var(--tav-roccia-ombra)" opacity="0.3" transform="translate(9 6)" />
            <path d={curva(sp)} fill="var(--tav-roccia-luce)" opacity="0.26" transform="translate(-7 5)" />
          </g>
        ))}
      </g>

      {/* Le nuvole si impigliano fra la cresta alta e quella di mezzo: è quello
          che le fa stare *dentro* la montagna invece che davanti. */}
      <g fill="#fff" opacity="0.5" filter="url(#f-sfoca)">
        <ellipse cx="300" cy="214" rx="76" ry="24" />
        <ellipse cx="366" cy="238" rx="48" ry="15" />
        <ellipse cx="708" cy="204" rx="68" ry="22" />
        <ellipse cx="652" cy="228" rx="42" ry="14" />
      </g>

      <path d={curva(RILIEVO.mezza)} fill="var(--tav-roccia)" filter="url(#f-acquerello)" />
      <path d={curva(RILIEVO.mezza)} fill="var(--tav-roccia-ombra)" opacity="0.22" transform="translate(8 7)" />
      <path d={curva(RILIEVO.bassa)} fill="var(--tav-prato-scuro)" filter="url(#f-acquerello)" />
      <path d={curva(RILIEVO.bassa)} fill="var(--tav-prato)" opacity="0.55" transform="translate(-6 8)" />

      <g>
        {RILIEVO.detriti.map((s, k) => (
          <circle
            key={k}
            cx={s.p[0].toFixed(1)}
            cy={s.p[1].toFixed(1)}
            r={s.r.toFixed(1)}
            fill={s.luce ? "var(--tav-roccia-luce)" : "var(--tav-roccia-ombra)"}
            opacity="0.55"
          />
        ))}
      </g>
    </g>
  );
}

/* ---------- i boschi ---------- */

/* Ogni campo di semina è calcolato una volta sola. Il tono di ciascun albero è
   pescato da una terna: chiome tutte dello stesso verde non fanno un bosco,
   fanno una tappezzeria. */
const TONI: Record<string, readonly string[]> = {
  fitto: [
    "var(--tav-bosco)", "var(--tav-bosco-ombra)", "var(--tav-bosco)",
    "var(--tav-bosco-luce)", "var(--tav-bosco)", "var(--tav-fogliame-luce)",
  ],
  rado: ["var(--tav-bosco-luce)", "var(--tav-fogliame-luce)", "var(--tav-bosco-luce)", "var(--tav-bosco)"],
  secco: ["var(--tav-bosco-secco)", "var(--tav-bosco-luce)", "var(--tav-bosco-secco)"],
};

/** Un albero piantato: il simbolo da richiamare e dove. */
type Pianta = { href: string; x: number; y: number; tono: string };

const pianta = (
  rnd: () => number,
  p: P,
  raggio: readonly [number, number],
  toni: readonly string[],
  fitto = false,
): Pianta => {
  const r = fra(rnd, raggio[0], raggio[1]);
  return {
    href: chioma(Math.floor(fra(rnd, 0, 3)), r, fitto),
    x: Math.round(p[0]),
    y: Math.round(p[1]),
    tono: scegli(rnd, toni),
  };
};

/*
 * Gli alberi si raggruppano per tono e non per bosco: dentro un `<g color=…>`
 * ogni albero costa un `use` e basta. Dentro ogni gruppo restano ordinati dal
 * più alto al più basso, così le chiome davanti coprono quelle dietro — è
 * quello che fa sembrare profondo un bosco disegnato piatto.
 */
const perTono = (piante: Pianta[]) => {
  const gruppi = new Map<string, Pianta[]>();
  for (const a of piante.sort((x, y) => x.y - y.y)) {
    const g = gruppi.get(a.tono);
    if (g) g.push(a);
    else gruppi.set(a.tono, [a]);
  }
  return [...gruppi];
};

const ALBERI = perTono(
  BOSCHI.flatMap((b) => {
    const rnd = caso(b.seme);
    return semina(b.forma, b.quanti, rnd, { distanza: b.distanza }).map((p) =>
      pianta(rnd, p, b.raggio, TONI[b.tono], b.tono === "fitto"),
    );
  }),
);

/*
 * Sulla tavola gli alberi non stanno solo nella foresta: c'è una fascia di
 * bosco lungo tutta la costa, e un filare che segue il fiume. Sono le due cose
 * che riempiono l'isola — un prato vuoto grande come mezzo foglio si vede
 * subito che è vuoto.
 */
const FASCIA_COSTIERA = perTono(
  (() => {
    const rnd = caso(9090);
    const orlo = verso(COSTA_VERA, 0.985);
    const interno = verso(COSTA_VERA, 0.87);

    return semina(orlo, 900, rnd, { distanza: 19 })
      .filter((p) => !dentro(interno, p) && !dentro(SPIAGGIA, p) && p[1] > 320)
      .map((p) => pianta(rnd, p, [10, 19], TONI.fitto, true));
  })(),
);

/** Il filare lungo il fiume: dove c'è acqua, sulla tavola c'è verde. */
const RIVE = perTono(
  (() => {
    const rnd = caso(7373);
    const alberi: Pianta[] = [];

    for (const ramo of [FIUME_EST, FIUME_OVEST]) {
      for (let t = 0.02; t < 0.99; t += 0.028) {
        const [x, y] = lungo(ramo, t);
        const lato = rnd() > 0.5 ? 1 : -1;
        alberi.push(pianta(rnd, [x + fra(rnd, 20, 44) * lato, y + fra(rnd, -16, 16)], [8, 15], TONI.rado));
      }
    }

    return alberi;
  })(),
);

/** Un gruppo di alberi per tono: un `use` a testa, nient'altro. */
function Piante({ campi }: { campi: [string, Pianta[]][] }) {
  return (
    <>
      {campi.map(([tono, piante]) => (
        <g color={tono} key={tono}>
          {piante.map((a, k) => (
            <use key={k} href={a.href} x={a.x} y={a.y} />
          ))}
        </g>
      ))}
    </>
  );
}

export function Boschi() {
  return (
    <g>
      {/* Sotto la Foresta Intrecciata il terreno è più scuro di quello intorno:
          non ci arriva luce, e sulla tavola si vede. */}
      <path d={curva(frastaglia(FORESTA, caso(11), 14))} fill="var(--tav-bosco)" opacity="0.9" filter="url(#f-acquerello)" />
      <path d={curva(frastaglia(verso(FORESTA, 0.86), caso(12), 12))} fill="var(--tav-bosco-ombra)" opacity="0.45" filter="url(#f-acquerello)" />

      <Piante campi={ALBERI} />

      <Piante campi={FASCIA_COSTIERA} />
      <Piante campi={RIVE} />

      <g color="var(--tav-bosco-ombra)">
        {CIPRESSI.map(([x, y], i) => (
          <use key={i} href="#cipresso" transform={`translate(${x} ${y}) scale(${(0.85 + (i % 3) * 0.12).toFixed(2)})`} />
        ))}
      </g>
    </g>
  );
}

/* ---------- gli Orti del Cerchio ---------- */

/*
 * I campi a cerchi concentrici, che sulla tavola sono la cosa più
 * riconoscibile dell'isola dopo l'Albero. Non è un disco marrone con sopra dei
 * pallini: è una radura chiara aperta nel bosco, con i solchi che girano e le
 * file di colture piantate lungo il solco. Le file si disegnano come trattini
 * orientati come il giro — un punto tondo non dice da che parte si zappa.
 */
const COLTURE = (() => {
  const rnd = caso(2440);
  const file: { d: string; fiore: boolean }[] = [];

  for (let g = 0; g < ORTI.giri; g++) {
    const k = (g + 0.6) / ORTI.giri;
    const quanti = 14 + g * 10;

    for (let i = 0; i < quanti; i++) {
      const a = (i / quanti) * Math.PI * 2 + fra(rnd, -0.06, 0.06);
      const x = ORTI.cx + Math.cos(a) * ORTI.rx * k;
      const y = ORTI.cy + Math.sin(a) * ORTI.ry * k;
      /* Il trattino segue la tangente del giro: è il verso del filare. */
      const dx = -Math.sin(a) * fra(rnd, 5, 9);
      const dy = Math.cos(a) * fra(rnd, 4, 7);
      file.push({
        d: `M${(x - dx / 2).toFixed(1)} ${(y - dy / 2).toFixed(1)}l${dx.toFixed(1)} ${dy.toFixed(1)}`,
        fiore: rnd() > 0.62,
      });
    }
  }

  return file;
})();

export function Orti() {
  return (
    <g>
      {/* La radura: gli orti stanno in un'apertura del bosco, non sul bosco. */}
      <path
        d={macchia(ORTI.cx, ORTI.cy, ORTI.rx + 20, caso(2441), { punte: 13, irregolare: 0.16, schiaccia: ORTI.ry / ORTI.rx })}
        fill="var(--tav-prato-chiaro)"
        filter="url(#f-acquerello)"
      />
      <path
        d={macchia(ORTI.cx, ORTI.cy, ORTI.rx + 6, caso(2442), { punte: 13, irregolare: 0.14, schiaccia: ORTI.ry / ORTI.rx })}
        fill="var(--tav-orto)"
        opacity="0.55"
        filter="url(#f-acquerello)"
      />

      {/* I solchi: quattro giri, uno dentro l'altro. */}
      <g fill="none" stroke="var(--tav-orto-riga)" strokeWidth="2.2" opacity="0.6">
        {Array.from({ length: ORTI.giri }, (_, g) => {
          const k = (g + 1) / ORTI.giri;
          return <ellipse key={g} cx={ORTI.cx} cy={ORTI.cy} rx={(ORTI.rx * k).toFixed(1)} ry={(ORTI.ry * k).toFixed(1)} />;
        })}
      </g>

      <g strokeWidth="3.4" strokeLinecap="round" fill="none">
        {COLTURE.map((c, i) => (
          <path key={i} d={c.d} stroke={c.fiore ? "var(--tav-orto-fiore)" : "var(--tav-fogliame-luce)"} opacity="0.8" />
        ))}
      </g>

      {/* Il muretto a secco che chiude gli orti. */}
      <ellipse
        cx={ORTI.cx}
        cy={ORTI.cy}
        rx={ORTI.rx + 14}
        ry={ORTI.ry + 12}
        fill="none"
        stroke="var(--tav-roccia-ombra)"
        strokeWidth="3"
        opacity="0.45"
        strokeDasharray="9 7"
      />
    </g>
  );
}

/* ---------- i sentieri ---------- */

export function Sentieri() {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      {SENTIERI.map((s, i) => {
        const d = curva(frastaglia(s, caso(700 + i), 3, false, 1), false);
        return (
          <g key={i}>
            <path d={d} stroke="var(--tav-sentiero-ombra)" strokeWidth="9" opacity="0.35" />
            <path d={d} stroke="var(--tav-sentiero)" strokeWidth="6" opacity="0.95" />
          </g>
        );
      })}
    </g>
  );
}

/* ---------- le case ---------- */

/*
 * Una casa vista da mezza altezza: due falde, un muro, un'ombra portata.
 * È il compromesso che regge alla scala della mappa — a venti unità di
 * larghezza una casa in pianta sarebbe un quadrato, e un villaggio di quadrati
 * non si legge come un villaggio.
 */
/** Quanto è grande una casa sul foglio. Sotto 1.3 il villaggio si perde. */
const SCALA_CASE = 1.4;

function Casetta({ x, y, s, r }: Casa) {
  return (
    <g transform={`translate(${x} ${y}) scale(${(s * SCALA_CASE).toFixed(2)}) rotate(${r})`}>
      <ellipse cx="3" cy="1" rx="16" ry="5.5" fill="var(--tav-inchiostro)" opacity="0.22" />
      <path d="M-11 0v-9h22v9z" fill="var(--tav-muro)" />
      <path d="M4 0v-9h7v9z" fill="var(--tav-muro-ombra)" opacity="0.55" />
      <path d="M-14-8 -10-16h20l4 8z" fill="var(--tav-tetto)" />
      <path d="M-10-16h20l-3-6h-14z" fill="var(--tav-tetto-scuro)" />
      <path d="M-14-8 -10-16h20l4 8zM-10-16h20l-3-6h-14z" fill="none" stroke="var(--tav-inchiostro)" strokeWidth="1" opacity="0.5" />
      <rect x="-2" y="-6" width="4" height="6" fill="var(--tav-inchiostro)" opacity="0.55" />
    </g>
  );
}

/** La capanna dei pastori: un cono di paglia, senza muri. */
function Capanna({ x, y, s, r }: Casa) {
  return (
    <g transform={`translate(${x} ${y}) scale(${(s * SCALA_CASE).toFixed(2)}) rotate(${r})`}>
      <ellipse cx="2" cy="1" rx="14" ry="4.6" fill="var(--tav-inchiostro)" opacity="0.22" />
      <path d="M-13 0c0-8 5-16 13-16s13 8 13 16z" fill="var(--tav-tetto)" />
      <path d="M0-16c8 0 13 8 13 16H4c0-8-2-16-4-16z" fill="var(--tav-tetto-scuro)" opacity="0.75" />
      <path d="M0-16v16M-8-9c5-3 11-3 16 0M-13 0h26" fill="none" stroke="var(--tav-inchiostro)" strokeWidth="0.9" opacity="0.4" />
      <path d="M-3 0v-5h6v5z" fill="var(--tav-inchiostro)" opacity="0.5" />
    </g>
  );
}

export function Villaggio() {
  return (
    <g>
      {/* La piazza: terra battuta sotto l'Albero, dove sta il mercato. */}
      <path
        d={macchia(524, 862, 86, caso(919), { punte: 12, irregolare: 0.26, schiaccia: 0.66 })}
        fill="var(--tav-sentiero)"
        opacity="0.95"
        filter="url(#f-acquerello)"
      />

      {CASE_VILLAGGIO.map((c, i) => (
        <Casetta key={`v${i}`} {...c} />
      ))}
      {CASE_FUOCO.map((c, i) => (
        <Casetta key={`f${i}`} {...c} />
      ))}
      {CAPANNE_SPIAGGIA.map((c, i) => (
        <Casetta key={`s${i}`} {...c} />
      ))}
      {CAPANNE_PASTORI.map((c, i) => (
        <Capanna key={`p${i}`} {...c} />
      ))}

      {/* Il Forno di Fiamma: più grande delle altre, e il camino fuma. */}
      <g transform={`translate(${FORNO.x} ${FORNO.y}) scale(${(FORNO.s * SCALA_CASE).toFixed(2)}) rotate(${FORNO.r})`}>
        <ellipse cx="3" cy="1" rx="18" ry="6" fill="var(--tav-inchiostro)" opacity="0.24" />
        <path d="M-13 0v-11h26v11z" fill="var(--tav-muro)" />
        <path d="M5 0v-11h8v11z" fill="var(--tav-muro-ombra)" opacity="0.55" />
        <path d="M-16-10-11-19h22l5 9z" fill="var(--tav-tetto)" />
        <path d="M-11-19h22l-3-7h-16z" fill="var(--tav-tetto-scuro)" />
        <rect x="6" y="-30" width="6" height="12" fill="var(--tav-muro-ombra)" />
        <rect x="-3" y="-7" width="6" height="7" rx="3" fill="var(--tav-inchiostro)" opacity="0.65" />
      </g>

      {/* Il fumo, che sulla tavola sale piegato dal vento. */}
      <path
        d="M757 620c-9-14 6-22 0-36-5-12 8-18 4-30"
        fill="none"
        stroke="#fff"
        strokeWidth="13"
        strokeLinecap="round"
        opacity="0.45"
        filter="url(#f-sfoca-corta)"
      />

      {/* Il ponte sul ramo est, dove il sentiero scavalca il Fiume che Gira. */}
      <g transform={`translate(${PONTE.x} ${PONTE.y}) rotate(${PONTE.inclinazione})`}>
        <rect x={-PONTE.larghezza / 2} y="-5" width={PONTE.larghezza} height="10" fill="var(--tav-tetto-scuro)" />
        <path d={`M${-PONTE.larghezza / 2} -5h${PONTE.larghezza}M${-PONTE.larghezza / 2} 5h${PONTE.larghezza}`} fill="none" stroke="var(--tav-inchiostro)" strokeWidth="1.2" opacity="0.55" />
      </g>
    </g>
  );
}

/* ---------- l'Albero Vecchio ---------- */

/*
 * L'albero più vecchio dell'isola, e l'unica cosa disegnata su questa mappa che
 * si riconosce da sola. Si costruisce in quattro tempi, e l'ordine conta:
 *
 * 1. una massa sola, grande e tondeggiante ma non tonda — è la sagoma;
 * 2. i festoni del bordo, che le tolgono il profilo da palloncino;
 * 3. i ciuffi dentro, piccoli rispetto alla chioma: se si fanno grossi si
 *    leggono come spirali e l'albero diventa un cavolo;
 * 4. la luce, sparsa a maestrale come su tutto il resto della tavola.
 */
const CHIOMA = (() => {
  const rnd = caso(1500);
  const { cx, cy, raggio } = ALBERO_VECCHIO;

  const sagoma = macchia(cx, cy, raggio, rnd, { punte: 22, irregolare: 0.16, schiaccia: 0.94 });

  const festoni = Array.from({ length: 26 }, (_, i) => {
    const a = (i / 26) * Math.PI * 2 + fra(rnd, -0.06, 0.06);
    const d = raggio * fra(rnd, 0.9, 1.0);
    return macchia(cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.94, raggio * fra(rnd, 0.11, 0.19), rnd, {
      punte: 7,
      irregolare: 0.45,
    });
  });

  const ciuffi = Array.from({ length: 34 }, (_, i) => {
    const a = fra(rnd, 0, Math.PI * 2);
    const d = raggio * Math.sqrt(fra(rnd, 0, 0.78));
    const x = cx + Math.cos(a) * d;
    const y = cy + Math.sin(a) * d * 0.92;
    /* Il sole viene da maestrale: in alto a sinistra chiaro, in basso a destra
       scuro, con un po' di disordine perché non venga una mezzaluna netta. */
    const luce = (cx - x) / raggio + (cy - y) / raggio + fra(rnd, -0.55, 0.55);
    return {
      d: macchia(x, y, raggio * fra(rnd, 0.16, 0.28), rnd, { punte: 9, irregolare: 0.4 }),
      tono: luce > 0.5 ? 2 : luce > -0.15 ? 1 : 0,
    };
  });

  return { sagoma, festoni, ciuffi };
})();

const VERDE = ["var(--tav-bosco-ombra)", "var(--tav-bosco)", "var(--tav-bosco-luce)"];

export function AlberoVecchio() {
  const { cx, cy, raggio, tronco } = ALBERO_VECCHIO;

  return (
    <g>
      {/* L'ombra della chioma sul villaggio: cade a scirocco, corta, di mezzogiorno. */}
      <ellipse cx={cx + 46} cy={cy + 168} rx={raggio * 0.82} ry={raggio * 0.26} fill="var(--tav-inchiostro)" opacity="0.24" filter="url(#f-sfoca)" />

      {/* Il tronco esce da sotto la chioma, con le radici aperte: è l'unico
          albero dell'isola di cui si veda il piede. */}
      <path
        d={`M${tronco[0] - 30} ${tronco[1]}c8-14 6-28 8-46 2-24 -6-46 -4-64h44c2 18 -6 40 -4 64 2 18 0 32 8 46z`}
        fill="var(--tav-tronco)"
      />
      <path
        d={`M${tronco[0] - 30} ${tronco[1]}c8-14 6-28 8-46 2-24 -6-46 -4-64h15c-1 18 -7 42 -5 64 2 18 0 32 6 46z`}
        fill="var(--tav-inchiostro)"
        opacity="0.26"
      />

      <g filter="url(#f-acquerello)">
        <path d={CHIOMA.sagoma} fill="var(--tav-bosco)" transform="translate(10 14)" opacity="0.55" />
        {CHIOMA.festoni.map((d, i) => (
          <path key={i} d={d} fill="var(--tav-bosco)" />
        ))}
        <path d={CHIOMA.sagoma} fill="var(--tav-bosco)" />
        {CHIOMA.ciuffi.map((c, i) => (
          <path key={i} d={c.d} fill={VERDE[c.tono]} opacity={c.tono === 0 ? 0.55 : 0.75} />
        ))}
      </g>

      {/* Il colmo, dove il sole batte pieno. */}
      <path
        d={macchia(cx - 44, cy - 52, raggio * 0.26, caso(77), { punte: 10, irregolare: 0.42 })}
        fill="var(--tav-fogliame-luce)"
        opacity="0.5"
      />
    </g>
  );
}

/* ---------- la Bocca, il pontile, la barca ---------- */

/*
 * Le conchiglie. Il luogo si chiama Spiaggia delle Conchiglie, e su una mappa
 * disegnata a mano quel nome si può mantenere: una manciata di gusci chiari
 * sulla sabbia, dove la battigia le ha lasciate.
 */
const CONCHIGLIE = (() => {
  const rnd = caso(1919);
  return semina(
    [[540, 1300], [700, 1288], [756, 1312], [700, 1340], [600, 1348], [548, 1330]],
    26, rnd, { distanza: 13 },
  ).map((p) => ({
    x: Math.round(p[0]),
    y: Math.round(p[1]),
    r: fra(rnd, 1.8, 3.4),
    aperta: rnd() > 0.5,
  }));
})();

export function Approdo() {
  const assi = Array.from({ length: 9 }, (_, i) => i / 8);

  return (
    <g>
      <g>
        {CONCHIGLIE.map((c, i) => (
          <g key={i}>
            <ellipse cx={c.x} cy={c.y} rx={c.r.toFixed(1)} ry={(c.r * 0.72).toFixed(1)} fill="var(--tav-schiuma)" opacity="0.85" />
            {c.aperta && (
              <path
                d={`M${c.x - c.r} ${c.y}q${c.r} ${-c.r * 0.9} ${c.r * 2} 0`}
                fill="none"
                stroke="var(--tav-sabbia-ombra)"
                strokeWidth="0.7"
                opacity="0.7"
              />
            )}
          </g>
        ))}
      </g>
      <path d={nastro([PONTILE.da, PONTILE.a], PONTILE.larghezza, PONTILE.larghezza)} fill="var(--tav-tetto-scuro)" />
      <g stroke="var(--tav-inchiostro)" strokeWidth="1.3" opacity="0.5" fill="none">
        {assi.map((t, i) => {
          const [x, y] = lungo([PONTILE.da, PONTILE.a], t);
          return <path key={i} d={`M${(x - 7).toFixed(1)} ${(y - 3).toFixed(1)}l14 7`} />;
        })}
      </g>

      {/* La barca tirata a riva, come sulla tavola. */}
      <g transform="translate(560 1332) rotate(-18)">
        <ellipse cx="2" cy="4" rx="22" ry="5" fill="var(--tav-inchiostro)" opacity="0.2" />
        <path d="M-22 0c6 7 38 7 44 0-6-6-38-6-44 0z" fill="var(--tav-tetto-scuro)" />
        <path d="M-18 0c5 4 32 4 37 0z" fill="var(--tav-sabbia-chiara)" opacity="0.85" />
      </g>
    </g>
  );
}

/* ---------- la carta ---------- */

export function Carta() {
  return (
    <g style={{ mixBlendMode: "multiply" }}>
      <rect x="0" y="0" width="1000" height="1500" fill="#fff" filter="url(#f-grana)" opacity="0.07" />
      <rect x="0" y="0" width="1000" height="1500" fill="url(#g-vignetta)" opacity="0.5" />
    </g>
  );
}
