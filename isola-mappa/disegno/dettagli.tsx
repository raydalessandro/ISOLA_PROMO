/**
 * Quello che si vede solo da vicino.
 *
 * Sono strati che a mappa intera non si disegnano affatto: alla scala del
 * foglio sarebbero granelli sporchi, e peserebbero come le cose che si vedono.
 * Entrando in un quartiere invece sono esattamente la differenza fra un
 * paesaggio e un posto dove qualcuno vive — il mercato sotto l'Albero, l'erba
 * che si infittisce, i fiori nel prato, le cataste di legna al Forno.
 *
 * Valgono le regole di tutto il resto: caso governato da un seme, e niente che
 * il canone non dica già. Il mercato di mezzogiorno sulla piazza è canone; una
 * bancarella in più o in meno è disegno.
 */

import {
  PASCOLI_ALTI, PRATO_ANELLO, PRATO_SUD_EST, PRATO_SUD_OVEST,
} from "../geografia";
import { type Inquadratura } from "../quartieri";
import { caso, fra, macchia, type P, semina } from "../tratto";

/** Se un punto cade nel riquadro che si sta guardando. */
const inVista = (v: Inquadratura, x: number, y: number, margine = 40) =>
  x >= v.x - margine &&
  x <= v.x + v.larghezza + margine &&
  y >= v.y - margine &&
  y <= v.y + v.altezza + margine;

/* ---------- l'erba, da vicino ---------- */

const ERBA = (() => {
  const rnd = caso(4747);
  return [PASCOLI_ALTI, PRATO_ANELLO, PRATO_SUD_OVEST, PRATO_SUD_EST].flatMap((campo) =>
    semina(campo, 300, rnd, { distanza: 11 }).map(([x, y]) => {
      const h = fra(rnd, 2.6, 5.4);
      const p = fra(rnd, -1.8, 1.8);
      return {
        x,
        y,
        d: `M${Math.round(x)} ${Math.round(y)}q${p.toFixed(1)} ${(-h / 2).toFixed(1)} ${(p * 1.4).toFixed(1)} ${(-h).toFixed(1)}`,
      };
    }),
  );
})();

const FIORI = (() => {
  const rnd = caso(4848);
  return [PASCOLI_ALTI, PRATO_ANELLO, PRATO_SUD_OVEST, PRATO_SUD_EST].flatMap((campo) =>
    semina(campo, 90, rnd, { distanza: 26 }).map(([x, y]) => ({
      x: Math.round(x),
      y: Math.round(y),
      r: Number(fra(rnd, 0.9, 1.7).toFixed(1)),
      bianco: rnd() > 0.78,
    })),
  );
})();

export function ErbaFitta({ vista }: { vista: Inquadratura }) {
  const erba = ERBA.filter((c) => inVista(vista, c.x, c.y));
  const fiori = FIORI.filter((f) => inVista(vista, f.x, f.y));

  return (
    <g>
      <g stroke="var(--tav-bosco)" fill="none" strokeWidth="1.1" strokeLinecap="round" opacity="0.28">
        {erba.map((c, i) => (
          <path key={i} d={c.d} />
        ))}
      </g>
      <g>
        {fiori.map((f, i) => (
          <circle
            key={i}
            cx={f.x}
            cy={f.y}
            r={f.r}
            fill={f.bianco ? "var(--tav-schiuma)" : "var(--tav-orto-fiore)"}
            opacity="0.75"
          />
        ))}
      </g>
    </g>
  );
}

/* ---------- il mercato di mezzogiorno ---------- */

/*
 * Le bancarelle sulla piazza, sotto l'Albero. Il mercato di mezzogiorno è
 * canone: quante siano le bancarelle no, e infatti sono poche — quel tanto che
 * basta perché la piazza si legga come una piazza di mercato e non come uno
 * slargo di terra battuta.
 */
const BANCHI = (() => {
  const rnd = caso(1212);
  const centro: P = [524, 862];
  return Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 + 0.4;
    return {
      x: Math.round(centro[0] + Math.cos(a) * fra(rnd, 34, 52)),
      y: Math.round(centro[1] + Math.sin(a) * fra(rnd, 20, 32)),
      r: Number(fra(rnd, -9, 9).toFixed(1)),
      chiaro: rnd() > 0.5,
    };
  });
})();

function Banco({ x, y, r, chiaro }: { x: number; y: number; r: number; chiaro: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <ellipse cx="1" cy="1" rx="12" ry="3.6" fill="var(--tav-inchiostro)" opacity="0.2" />
      {/* I due pali e il banco */}
      <path d="M-9-2v-9M9-2v-9" stroke="var(--tav-tronco)" strokeWidth="1.4" fill="none" />
      <rect x="-10" y="-3" width="20" height="3" fill="var(--tav-tetto-scuro)" />
      {/* Il telo, teso e un po' cascante in mezzo */}
      <path
        d="M-12-10q12-5 24 0l-2 3.4q-10-4.2-20 0z"
        fill={chiaro ? "var(--tav-sabbia-chiara)" : "var(--tav-tetto)"}
      />
      <path d="M-12-10q12-5 24 0" fill="none" stroke="var(--tav-inchiostro)" strokeWidth="0.7" opacity="0.4" />
      {/* La roba sul banco: tre mucchi, che a questa scala è già tanto. */}
      <g opacity="0.9">
        <circle cx="-5" cy="-4.4" r="1.8" fill="var(--tav-orto-fiore)" />
        <circle cx="0" cy="-4.6" r="2" fill="var(--tav-bosco-luce)" />
        <circle cx="5.4" cy="-4.4" r="1.7" fill="var(--tav-tetto)" />
      </g>
    </g>
  );
}

export function Mercato({ vista }: { vista: Inquadratura }) {
  const banchi = BANCHI.filter((b) => inVista(vista, b.x, b.y));
  if (banchi.length === 0) return null;

  return (
    <g>
      {banchi.map((b, i) => (
        <Banco key={i} {...b} />
      ))}
    </g>
  );
}

/* ---------- la legna del Forno ---------- */

/*
 * Il Forno di Fiamma brucia legna, e la legna sta accatastata da qualche parte:
 * due cataste accanto al forno, con i tondi di taglio in vista. È il genere di
 * cosa che si vede solo entrando nel quartiere, e che di lontano non si
 * disegna.
 */
const CATASTE = [
  { x: 706, y: 636, r: -8 },
  { x: 780, y: 676, r: 6 },
];

export function Legna({ vista }: { vista: Inquadratura }) {
  const cataste = CATASTE.filter((c) => inVista(vista, c.x, c.y));
  if (cataste.length === 0) return null;

  const rnd = caso(3535);

  return (
    <g>
      {cataste.map((c, i) => (
        <g key={i} transform={`translate(${c.x} ${c.y}) rotate(${c.r})`}>
          <ellipse cx="1" cy="1" rx="13" ry="4" fill="var(--tav-inchiostro)" opacity="0.2" />
          <rect x="-11" y="-9" width="22" height="9" rx="1.5" fill="var(--tav-tronco)" />
          {Array.from({ length: 9 }, (_, k) => (
            <circle
              key={k}
              cx={(-9 + (k % 5) * 4.6).toFixed(1)}
              cy={(-2.4 - Math.floor(k / 5) * 4.2).toFixed(1)}
              r={fra(rnd, 1.6, 2.1).toFixed(1)}
              fill="var(--tav-tetto)"
              stroke="var(--tav-tronco)"
              strokeWidth="0.5"
              opacity="0.95"
            />
          ))}
        </g>
      ))}
    </g>
  );
}

/* ---------- le reti del pontile ---------- */

/*
 * Al pontile ci si pesca: due reti stese ad asciugare sulla sabbia, come le
 * lascia chi è appena rientrato.
 */
export function Reti({ vista }: { vista: Inquadratura }) {
  if (!inVista(vista, 520, 1320, 120)) return null;

  const rnd = caso(6464);
  const maglie = Array.from({ length: 14 }, () => {
    const a = fra(rnd, 0, Math.PI * 2);
    return `M${(Math.cos(a) * 12).toFixed(1)} ${(Math.sin(a) * 7).toFixed(1)}L${(Math.cos(a + 2.2) * 12).toFixed(1)} ${(Math.sin(a + 2.2) * 7).toFixed(1)}`;
  });

  return (
    <g>
      {[
        { x: 486, y: 1332, r: -12 },
        { x: 604, y: 1316, r: 9 },
      ].map((rete, i) => (
        <g key={i} transform={`translate(${rete.x} ${rete.y}) rotate(${rete.r})`}>
          <path
            d={macchia(0, 0, 13, caso(70 + i), { punte: 9, irregolare: 0.3, schiaccia: 0.6 })}
            fill="var(--tav-sabbia-ombra)"
            opacity="0.55"
          />
          <g stroke="var(--tav-muro-ombra)" strokeWidth="0.7" fill="none" opacity="0.7">
            {maglie.map((d, k) => (
              <path key={k} d={d} />
            ))}
          </g>
        </g>
      ))}
    </g>
  );
}
