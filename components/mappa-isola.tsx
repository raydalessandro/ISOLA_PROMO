import Image from "next/image";

import { MappaConCamera, type VoceCamera } from "@/components/mappa-camera";

import { descrizione, type Inquadratura, ISOLA_INTERA, riquadro } from "@/isola-mappa";
import { getStoria, personaggi } from "@/lib/canone";
import { storiePerLuogo } from "@/lib/legami";
import { COLORI_QUARTIERE, nomeQuartiere } from "@/lib/dove";
import { segni, type SegnoMappa, segniConLuogo } from "@/lib/mappa-posizioni";

/*
 * La mappa dell'isola con i luoghi da visitare.
 *
 * La base è l'isola disegnata (`isola-mappa/`), un vettoriale che ricalca la
 * tavola dipinta: stessa geografia, stesso riquadro 1000×1500, quindi le
 * coordinate lette sul disegno cadono dove devono senza aggiustamenti. I segni
 * le stanno sopra, in uno strato SVG che condivide quel riquadro — e siccome è
 * lo stesso riquadro, lo stesso strato serve tanto all'isola intera quanto al
 * dettaglio di un quartiere: cambia il `viewBox`, non le coordinate.
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

/**
 * Da che parte cade l'etichetta.
 *
 * Il verso lo dice `lib/mappa-posizioni.ts`, scelto guardando l'isola intera —
 * ma dentro il riquadro di un quartiere un segno che stava in mezzo si ritrova
 * sul bordo, e l'etichetta finirebbe tagliata. Quindi vicino al bordo il verso
 * si ribalta verso il centro: è l'unico posto in cui il disegno decide da solo,
 * e decide per non tagliare le parole.
 */
const versoUtile = (segno: SegnoMappa, vista: Inquadratura) => {
  const dax = (segno.x - vista.x) / vista.larghezza;

  if (dax > 0.62 && segno.etichetta !== "sopra" && segno.etichetta !== "sotto") return "sinistra";
  if (dax < 0.38 && segno.etichetta !== "sopra" && segno.etichetta !== "sotto") return "destra";
  if (dax > 0.86) return "sinistra";
  if (dax < 0.14) return "destra";
  return segno.etichetta;
};

const posizioneEtichetta = (verso: string) => {
  if (verso === "sopra") return { dx: 0, dy: -SCOSTAMENTO - 6, ancora: "middle" as const };
  if (verso === "sotto") return { dx: 0, dy: SCOSTAMENTO + 20, ancora: "middle" as const };
  if (verso === "sinistra") return { dx: -SCOSTAMENTO - 4, dy: 8, ancora: "end" as const };
  return { dx: SCOSTAMENTO + 4, dy: 8, ancora: "start" as const };
};

/**
 * Il disegno e i suoi segni, in un riquadro solo.
 *
 * L'immagine arriva da `/isola/…svg` e non dal markup di questa pagina: è
 * fatta di migliaia di forme, e in linea finirebbe scritta due volte. I segni
 * invece stanno qui, perché sono pochi e perché devono essere collegamenti veri.
 */
export function TavolaConSegni({
  vista = ISOLA_INTERA,
  voci = segniConLuogo(),
  alt,
  priorita = false,
}: {
  vista?: Inquadratura;
  voci?: ReturnType<typeof segniConLuogo>;
  alt?: string;
  priorita?: boolean;
}) {
  return (
    <>
      <Image
        src={`/isola/${vista.id}.svg`}
        alt={alt ?? descrizione(vista)}
        width={vista.larghezza}
        height={vista.altezza}
        priority={priorita}
        unoptimized
        sizes="(min-width: 46rem) 40rem, 92vw"
      />

      <svg className="mappa-segni" viewBox={riquadro(vista)} aria-hidden="false">
        {voci.map(({ segno, luogo }) => {
          const { dx, dy, ancora } = posizioneEtichetta(versoUtile(segno, vista));
          const nome = `${luogo.nome} — ${nomeQuartiere(luogo.quartiere)}`;

          return (
            <a key={segno.id} href={`#luogo-${segno.id}`} className="mappa-segno" aria-label={nome}>
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
    </>
  );
}

/** Le schede dei luoghi: chi ci abita, quali storie ci passano, perché sta lì. */
export function SchedeLuoghi({ voci = segniConLuogo() }: { voci?: ReturnType<typeof segniConLuogo> }) {
  return (
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
  );
}

/** I segni che cadono dentro un riquadro, col loro luogo già agganciato. */
export const vociDentro = (dentro: SegnoMappa[]) => {
  const ammessi = new Set(dentro.map((s) => s.id));
  return segniConLuogo().filter((v) => ammessi.has(v.segno.id));
};

export function MappaIsola({ quartieri }: { quartieri: VoceCamera[] }) {
  return (
    <>
      <figure className="mappa-interattiva">
        <MappaConCamera quartieri={quartieri}>
          <TavolaConSegni priorita />
        </MappaConCamera>
      </figure>

      <SchedeLuoghi />
    </>
  );
}

export { segni };
