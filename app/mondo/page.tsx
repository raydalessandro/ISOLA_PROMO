import type { Metadata } from "next";
import Image from "next/image";

import type { Luogo } from "@/lib/canone";
import { gruppi, luoghiPerTipo, personaggi, personaggiPerGruppo } from "@/lib/canone";

export const metadata: Metadata = {
  title: "Chi ci vive",
  description:
    "I tre fratelli, gli animali del villaggio, chi tiene in piedi l'isola e i cinque cuccioli della scuola.",
};

function SchedaLuogo({ luogo, largo = false }: { luogo: Luogo; largo?: boolean }) {
  return (
    <article className={largo ? "luogo luogo--largo" : "luogo"}>
      <div className="luogo-figura">
        <Image
          src={`/media/luoghi/${luogo.id}.webp`}
          alt={luogo.nome}
          width={900}
          height={1350}
          sizes={largo ? "(min-width: 46rem) 38vw, 92vw" : "(min-width: 68rem) 23vw, (min-width: 46rem) 46vw, 92vw"}
        />
      </div>
      <div className="luogo-corpo">
        <h3>{luogo.nome}</h3>
        <p>{luogo.riga}</p>
      </div>
    </article>
  );
}

export default function Mondo() {
  return (
    <>
      <section className="sezione">
        <div className="contenuto">
          <div className="testa-sezione">
            <span className="occhiello">Chi ci vive</span>
            <h1>Diciotto abitanti, e nessuno è una comparsa.</h1>
            <p>
              Gli animali dell&rsquo;isola parlano, hanno una casa e un
              mestiere. Non sono lì per insegnare qualcosa ai bambini: sono lì
              perché ci abitano.
            </p>
          </div>

          {gruppi.map((gruppo) => (
            <section className="gruppo" key={gruppo.id} aria-labelledby={`g-${gruppo.id}`}>
              <div className="gruppo-testa">
                <h2 id={`g-${gruppo.id}`}>{gruppo.titolo}</h2>
                <p>{gruppo.intro}</p>
              </div>

              <div className="abitanti">
                {personaggiPerGruppo(gruppo.id).map((p) => (
                  <article className="abitante" key={p.id}>
                    <div className="abitante-figura">
                      <Image
                        src={`/media/personaggi/${p.id}.webp`}
                        alt={`${p.nome}, ${p.specie}`}
                        width={520}
                        height={693}
                        sizes="(min-width: 62rem) 20vw, (min-width: 40rem) 30vw, 46vw"
                      />
                    </div>
                    <div className="abitante-corpo">
                      <h3>{p.nome}</h3>
                      <span className="abitante-specie">{p.specie}</span>
                      <p>{p.riga}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="venti sezione">
        <div className="contenuto">
          <div className="testa-sezione">
            <span className="occhiello">Dove abitano</span>
            <h2>Il centro e i quattro quartieri.</h2>
            <p>
              Dentro l&rsquo;anello del Fiume c&rsquo;è il villaggio, con la
              piazza e il mercato. Intorno stanno i quattro quartieri: aria a
              nord, fuoco a est, acqua a sud, terra a ovest.
            </p>
          </div>

          {luoghiPerTipo("centro").map((luogo) => (
            <SchedaLuogo key={luogo.id} luogo={luogo} largo />
          ))}

          <div className="quartieri">
            {luoghiPerTipo("quartiere").map((luogo) => (
              <SchedaLuogo key={luogo.id} luogo={luogo} />
            ))}
          </div>

          <p className="colophon" style={{ borderTop: "none", marginTop: "1.5rem", paddingInline: 0 }}>
            {personaggi.length} abitanti disegnati, tutti presenti nel canone
            della saga.
          </p>
        </div>
      </section>
    </>
  );
}
