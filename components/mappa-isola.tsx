import Image from "next/image";

import { getStoria, personaggi } from "@/lib/canone";
import { storiePerLuogo } from "@/lib/legami";
import { segniConLuogo } from "@/lib/mappa-posizioni";

/*
 * La mappa dell'isola con i luoghi da visitare.
 *
 * La base è la tavola dipinta — la stessa isola stampata sulla quarta di
 * copertina — e i segni le stanno sopra, in uno strato SVG che condivide il suo
 * riquadro: la tavola è 2:3 e il viewBox è 1000×1500, quindi le coordinate lette
 * sul disegno cadono dove devono senza aggiustamenti.
 *
 * Un vettoriale disegnato al posto della tavola è stato provato e messo da
 * parte: la palette del sito (blu, verde, arancio dei tre punti) non è quella
 * dell'acquerello (teal, oliva, ocra), e la regola 11 non lascia allargarla.
 * Un disegno piatto accanto a una tavola dipinta perde sempre.
 *
 * Funziona **senza JavaScript**: ogni segno è un collegamento a un'ancora, e
 * sotto la mappa c'è la stessa lista in forma di testo, con chi ci abita e
 * quali storie ci passano. Chi clicca scende alla scheda; chi non può cliccare
 * la trova comunque, in ordine. La mappa è l'indice, l'elenco è il contenuto.
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
  if (verso === "sopra") return { dx: 0, dy: -SCOSTAMENTO - 6, ancora: "middle" as const };
  if (verso === "sotto") return { dx: 0, dy: SCOSTAMENTO + 20, ancora: "middle" as const };
  if (verso === "sinistra") return { dx: -SCOSTAMENTO - 4, dy: 8, ancora: "end" as const };
  return { dx: SCOSTAMENTO + 4, dy: 8, ancora: "start" as const };
};

export function MappaIsola() {
  const voci = segniConLuogo();

  return (
    <>
      <figure className="mappa-interattiva">
        <Image
          src="/media/isola/mappa.webp"
          alt="Mappa dell'isola vista dall'alto: le Montagne Gemelle a nord, l'anello del Fiume che Gira intorno al villaggio con l'Albero Vecchio, la Foresta Intrecciata e gli Orti del Cerchio a ovest, il quartiere di Fuoco a est e la spiaggia col pontile a sud."
          width={1000}
          height={1500}
          priority
          sizes="(min-width: 46rem) 40rem, 92vw"
        />

        <svg className="mappa-segni" viewBox="0 0 1000 1500" aria-hidden="false">
          {voci.map(({ segno, luogo }) => {
            const { dx, dy, ancora } = posizioneEtichetta(segno.etichetta);
            const quartiere = QUARTIERI[luogo.quartiere ?? "centro"];
            const nome = `${luogo.nome} — ${quartiere.nome}`;

            return (
              <a
                key={segno.id}
                href={`#luogo-${segno.id}`}
                className="mappa-segno"
                aria-label={nome}
              >
                <title>{nome}</title>
                <circle
                  cx={segno.x}
                  cy={segno.y}
                  r="10"
                  fill="var(--carta-alta)"
                  stroke={quartiere.colore}
                  strokeWidth="4"
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
              <p className="mappa-scheda-dove">{QUARTIERI[luogo.quartiere ?? "centro"].nome}</p>

              {abitante && (
                <p className="mappa-scheda-abita">
                  Ci vive <b>{abitante.nome}</b>, {abitante.specie}.
                </p>
              )}

              {passano.length > 0 && (
                <div className="mappa-scheda-storie">
                  <span>
                    {passano.length === 1
                      ? "Ci passa una storia"
                      : `Ci passano ${passano.length} storie`}
                  </span>
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
