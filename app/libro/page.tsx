import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { DatiStrutturatiLibro } from "@/components/dati-strutturati";
import { baseUrlDelSito } from "@/lib/base-url";
import { getStoria, libro, sito, volumi } from "@/lib/canone";

export const metadata: Metadata = {
  title: "Il libro",
  description:
    "L'Isola dei Tre Venti, Volume 1 — Il vento che taglia. Tre storie illustrate da leggere ad alta voce, dai 3 ai 6 anni.",
};

export default function Libro() {
  const prossimi = volumi.filter((v) => v.stato === "in preparazione");

  return (
    <>
      <DatiStrutturatiLibro base={baseUrlDelSito()} />

      <section className="sezione">
        <div className="contenuto libro-apertura">
          <figure className="libro-scatto">
            <Image
              src="/media/libro/vol1-tre-quarti.webp"
              alt={`${libro.titolo}, ${libro.sottotitolo}, copertina rigida`}
              width={760}
              height={950}
              priority
              sizes="(min-width: 54rem) 40vw, 90vw"
            />
          </figure>

          <div>
            <span className="libro-eta">{libro.eta}</span>
            <h1>{libro.titolo}</h1>
            <p className="libro-sottotitolo">{libro.sottotitolo}</p>

            <p>{libro.descrizione}</p>

            <ol className="libro-indice">
              {libro.storie.map((sid, i) => {
                const storia = getStoria(sid);
                return (
                  <li key={sid}>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <b>{storia.titolo}</b>
                      <p>{storia.riga}</p>
                    </div>
                  </li>
                );
              })}
            </ol>

            <p className="libro-firma">
              {sito.autore} — {sito.editore}
            </p>

            <div className="libro-azioni">
              <span className="in-arrivo">Su Amazon</span>
              <Link className="bottone bottone--chiaro" href="/storie">
                Tutte le dodici storie
              </Link>
            </div>

            <div className="libro-uscita">
              <p>
                <b>Il libro è stampato.</b> La scheda su Amazon è pronta e in
                attesa della data di pubblicazione: quando ci sarà, il
                collegamento comparirà qui e sui canali dell&rsquo;isola.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="venti sezione">
        <div className="contenuto">
          <div className="testa-sezione">
            <span className="occhiello">Com&rsquo;è fatto</span>
            <h2>Copertina rigida, illustrato dentro e fuori.</h2>
          </div>

          <div className="libro-facce">
            <figure className="libro-faccia">
              <Image
                src="/media/libro/vol1-fronte.webp"
                alt="Fronte della copertina: i tre fratelli sotto l'Albero Vecchio con Rovo, Mèmolo, Stria e Fiamma."
                width={760}
                height={950}
                sizes="(min-width: 46rem) 40vw, 88vw"
              />
              <figcaption>
                Il fronte: la piazza del villaggio, e chi ci si incontra.
              </figcaption>
            </figure>

            <figure className="libro-faccia">
              <Image
                src="/media/libro/vol1-retro.webp"
                alt="Retro della copertina: l'isola vista dall'alto dentro un anello, i tre punti dei venti, l'indice delle tre storie."
                width={760}
                height={950}
                sizes="(min-width: 46rem) 40vw, 88vw"
              />
              <figcaption>
                Il retro: l&rsquo;isola dall&rsquo;alto e i tre punti dei venti.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="sezione">
        <div className="contenuto">
          <div className="testa-sezione">
            <span className="occhiello">La saga</span>
            <h2>Quattro volumi, uno per stagione.</h2>
            <p>
              Il primo è questo. Gli altri tre sono scritti e stanno prendendo
              forma illustrata.
            </p>
          </div>

          <ul className="prossimi">
            {prossimi.map((v) => (
              <li key={v.numero}>
                <span className="occhiello">Volume {v.numero}</span>
                <h3>{v.stagione}</h3>
                <p>{v.vento}</p>
                <span className="volume-stato">in preparazione</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
