import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SchedeLuoghi, TavolaConSegni, vociDentro } from "@/components/mappa-isola";
import { conArticolo } from "@/lib/dove";
import {
  abitantiDelQuartiere, QUARTIERI_SITO, quartiereSito, segniDelQuartiere, vociDelQuartiere,
} from "@/lib/mappa-quartieri";

/*
 * La pagina di un quartiere.
 *
 * È la mappa vista da vicino: la stessa isola, lo stesso disegno, ma inquadrata
 * su un pezzo — e da vicino il disegno mostra cose che di lontano non ci sono,
 * gli abitanti compresi. Il testo però non aggiunge canone: il nome e la riga
 * vengono da `lib/canone.ts`, i luoghi e le case da `lib/legami.ts`. Questa
 * pagina li mette in fila, non li inventa.
 *
 * Esiste come indirizzo suo, e non solo come stato di /mappa, per tre motivi:
 * si può linkare, si può indicizzare, e funziona senza JavaScript.
 */

export function generateStaticParams() {
  return QUARTIERI_SITO.map((q) => ({ quartiere: q.url }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ quartiere: string }>;
}): Promise<Metadata> {
  const { quartiere } = await params;
  const q = quartiereSito(quartiere);
  if (!q) return {};

  const { nome, riga } = vociDelQuartiere(q);
  return { title: nome, description: riga };
}

export default async function Quartiere({ params }: { params: Promise<{ quartiere: string }> }) {
  const { quartiere } = await params;
  const q = quartiereSito(quartiere);
  if (!q) notFound();

  const { nome, riga, vista } = vociDelQuartiere(q);
  const voci = vociDentro(segniDelQuartiere(q));
  const abitanti = abitantiDelQuartiere(q);
  const altri = QUARTIERI_SITO.filter((a) => a.url !== q.url);

  return (
    <section className="sezione">
      <div className="contenuto">
        <div className="testa-sezione">
          <span className="occhiello">
            <Link href="/mappa">La mappa</Link>
          </span>
          <h1>{nome}</h1>
          <p>{riga}</p>
        </div>

        <figure className="mappa-interattiva">
          <TavolaConSegni
            vista={vista}
            voci={voci}
            priorita
            alt={`Dettaglio della mappa disegnata dell'isola: ${vista.cosa}.`}
          />
        </figure>

        {abitanti.length > 0 && (
          <div className="quartiere-abitanti">
            <h2>Chi ci sta di casa</h2>
            <ul>
              {abitanti.map(({ persona, casa, storie }) => (
                <li key={persona.id}>
                  <b>{persona.nome}</b>, {persona.specie}. Sta {conArticolo(casa.nome)}
                  {storie > 0 && `, e passa per ${storie === 1 ? "una storia" : `${storie} storie`}`}.
                </li>
              ))}
            </ul>
            <p className="quartiere-nota">
              Le figure sul disegno dicono il quartiere, non l&rsquo;indirizzo: il canone colloca
              queste case qui dentro, non su un tetto preciso.
            </p>
          </div>
        )}

        {voci.length > 0 && <SchedeLuoghi voci={voci} />}

        <nav className="quartiere-giro" aria-label="Gli altri quartieri">
          {altri.map((a) => (
            <Link key={a.url} href={`/mappa/${a.url}`}>
              {vociDelQuartiere(a).nome}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
