import { getStoria, personaggi } from "@/lib/canone";
import { storiePerLuogo } from "@/lib/legami";
import { segniConLuogo } from "@/lib/mappa-posizioni";

/*
 * La mappa disegnata dell'isola.
 *
 * Funziona **senza JavaScript**: ogni segno è un collegamento a un'ancora, e
 * sotto la mappa c'è la stessa lista in forma di testo. Chi clicca scende alla
 * scheda del luogo; chi non può cliccare la trova comunque, in ordine. La
 * mappa è l'indice, l'elenco è il contenuto — non un ripiego, ma il modo in
 * cui questa pagina resta leggibile a tutti.
 *
 * Il disegno arriva da fuori, come `children`: è illustrazione, e si rifà o si
 * cambia registro senza toccare né i collegamenti né l'accessibilità. Questo
 * componente porta i segni, le ancore e le schede — la parte che vale identica
 * sopra un disegno vettoriale o sopra la tavola dipinta.
 */

const QUARTIERI: Record<string, { nome: string; colore: string }> = {
  aria: { nome: "quartiere d’Aria", colore: "var(--taglio)" },
  fuoco: { nome: "quartiere di Fuoco", colore: "var(--mulinello-testo)" },
  acqua: { nome: "quartiere d’Acqua", colore: "var(--taglio)" },
  terra: { nome: "quartiere di Terra", colore: "var(--intreccio)" },
  centro: { nome: "villaggio", colore: "var(--morbido)" },
  perimetro: { nome: "attorno all’isola", colore: "var(--taglio)" },
};

/** Lo scostamento dell'etichetta dal segno, in unità di viewBox. */
const SCOSTAMENTO = 17;

const posizioneEtichetta = (verso: string) => {
  if (verso === "sopra") return { dx: 0, dy: -SCOSTAMENTO - 4, ancora: "middle" as const };
  if (verso === "sotto") return { dx: 0, dy: SCOSTAMENTO + 16, ancora: "middle" as const };
  if (verso === "sinistra") return { dx: -SCOSTAMENTO, dy: 6, ancora: "end" as const };
  return { dx: SCOSTAMENTO, dy: 6, ancora: "start" as const };
};

export function MappaIsola({ children }: { children: React.ReactNode }) {
  const voci = segniConLuogo();

  return (
    <>
      <figure className="mappa-disegnata">
        <svg
          viewBox="0 0 1000 1500"
          role="img"
          aria-label="Mappa disegnata dell'isola: le Montagne Gemelle a nord, l'anello del Fiume che Gira intorno al villaggio, la Foresta a ovest, gli Orti del Cerchio, il quartiere di Fuoco a est e la spiaggia con il pontile a sud."
        >
          {children}

          <g className="mappa-segni">
            {voci.map(({ segno, luogo }) => {
              const { dx, dy, ancora } = posizioneEtichetta(segno.etichetta);
              const quartiere = QUARTIERI[luogo.quartiere ?? "centro"];

              return (
                <a key={segno.id} href={`#luogo-${segno.id}`} className="mappa-segno">
                  {/* Il nome accessibile del collegamento: lo screen reader
                      legge questo, non il cerchio. */}
                  <title>
                    {luogo.nome} — {quartiere.nome}
                  </title>
                  <circle
                    cx={segno.x}
                    cy={segno.y}
                    r="9"
                    fill="var(--carta-alta)"
                    stroke={quartiere.colore}
                    strokeWidth="3.5"
                  />
                  <text
                    x={segno.x + dx}
                    y={segno.y + dy}
                    textAnchor={ancora}
                    className="mappa-etichetta"
                  >
                    {luogo.nome}
                  </text>
                </a>
              );
            })}
          </g>
        </svg>
      </figure>

      <ol className="mappa-schede">
        {voci.map(({ segno, luogo }) => {
          const abitante = luogo.abitante
            ? personaggi.find((p) => p.id === luogo.abitante)
            : undefined;
          const passano = storiePerLuogo(luogo.id).map((s) => getStoria(s.sid));

          return (
            <li className="mappa-scheda" id={`luogo-${segno.id}`} key={segno.id}>
              <h3>{luogo.nome}</h3>
              <p className="mappa-scheda-dove">
                {QUARTIERI[luogo.quartiere ?? "centro"].nome}
              </p>

              {abitante && (
                <p className="mappa-scheda-abita">
                  Ci vive <b>{abitante.nome}</b>, {abitante.specie}.
                </p>
              )}

              {passano.length > 0 && (
                <div className="mappa-scheda-storie">
                  <span>{passano.length === 1 ? "Ci passa una storia" : `Ci passano ${passano.length} storie`}</span>
                  <ul>
                    {passano.map((s) => (
                      <li key={s.sid}>{s.titolo}</li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="mappa-scheda-nota">{segno.nota}</p>
            </li>
          );
        })}
      </ol>
    </>
  );
}
