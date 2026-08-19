import Image from "next/image";

import { descrizione } from "@/isola-mappa";
import { getStoria, personaggi } from "@/lib/canone";
import { storiePerLuogo } from "@/lib/legami";
import { COLORI_QUARTIERE, nomeQuartiere } from "@/lib/dove";
import { segniConLuogo } from "@/lib/mappa-posizioni";

/*
 * La mappa dell'isola con i luoghi da visitare.
 *
 * La base è l'isola disegnata (`isola-mappa/`), un vettoriale che ricalca
 * la tavola dipinta: stessa geografia, stesso riquadro 1000×1500, quindi le
 * coordinate lette sul disegno cadono dove devono senza aggiustamenti. I segni
 * le stanno sopra, in uno strato SVG che condivide quel riquadro.
 *
 * La tavola dipinta non sparisce: resta sotto la mappa, a grandezza piena, come
 * "la tavola stampata nel libro". Il vettoriale è la mappa da consultare — non
 * sfoca ingrandendo, pesa quanto una pagina invece di mezzo mega, e i suoi
 * luoghi sono forme, non pixel; la tavola è la stessa isola dipinta a mano, e
 * quella resta la versione bella.
 *
 * Funziona **senza JavaScript**: ogni segno è un collegamento a un'ancora, e
 * sotto la mappa c'è la stessa lista in forma di testo, con chi ci abita e
 * quali storie ci passano. Chi clicca scende alla scheda; chi non può cliccare
 * la trova comunque, in ordine. La mappa è l'indice, l'elenco è il contenuto.
 */

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
        {/* Il disegno arriva da `/isola/intera.svg`, non dal markup di questa pagina:
            è un'immagine come lo era la tavola, ma vettoriale — un decimo del
            peso, e nitida a qualunque ingrandimento. */}
        <Image
          src="/isola/intera.svg"
          alt={descrizione()}
          width={1000}
          height={1500}
          priority
          unoptimized
          sizes="(min-width: 46rem) 40rem, 92vw"
        />

        <svg className="mappa-segni" viewBox="0 0 1000 1500" aria-hidden="false">
          {voci.map(({ segno, luogo }) => {
            const { dx, dy, ancora } = posizioneEtichetta(segno.etichetta);
            const nome = `${luogo.nome} — ${nomeQuartiere(luogo.quartiere)}`;

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
                  stroke={COLORI_QUARTIERE[luogo.quartiere ?? "centro"]}
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
              <p className="mappa-scheda-dove">{nomeQuartiere(luogo.quartiere)}</p>

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
