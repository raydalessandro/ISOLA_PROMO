import type { Metadata } from "next";
import Image from "next/image";

import { giornate, totaleGiornate } from "@/lib/canone";

export const metadata: Metadata = {
  title: "Le giornate dell’isola",
  description:
    "Quaranta illustrazioni che non stanno in nessun libro: momenti laterali della vita sull'isola, un gesto per volta.",
};

export default function Giornate() {
  return (
    <section className="sezione">
      <div className="contenuto contenuto--largo">
        <div className="testa-sezione">
          <span className="occhiello">Le giornate</span>
          <h1>Quello che succede fra una storia e l’altra.</h1>
          <p>
            {totaleGiornate} illustrazioni che non stanno in nessun libro. Non
            sono scene dei racconti: sono giornate normali dell’isola — un ponte
            da provare, una legatura da rifare, una fila di semi storta — e sono
            le immagini che accompagneranno l’isola sui social.
          </p>
        </div>

        {giornate.map((set) => (
          <section className="set" key={set.id} aria-labelledby={`set-${set.id}`}>
            <div className="set-testa">
              <h2 id={`set-${set.id}`}>{set.titolo}</h2>
              <p>{set.intro}</p>
            </div>

            <div className="galleria">
              {set.immagini.map((immagine) => (
                <figure className="giornata" key={immagine.file}>
                  <Image
                    src={`/media/giornate/${immagine.file}.webp`}
                    alt={immagine.didascalia}
                    width={immagine.larghezza}
                    height={immagine.altezza}
                    sizes="(min-width: 70rem) 27vw, (min-width: 40rem) 44vw, 92vw"
                  />
                  <figcaption>{immagine.didascalia}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        ))}

        <div className="nota-giornate">
          <h2>Perché esistono</h2>
          <p>
            Le illustrazioni dei libri raccontano le storie. Queste raccontano
            il resto: com’è l’isola quando non sta succedendo niente di
            speciale. Sono disegnate sulle stesse reference canoniche dei
            volumi, così Fiamma è sempre Fiamma e la sciarpa di Mèmolo è sempre
            storta dalla stessa parte.
          </p>
        </div>
      </div>
    </section>
  );
}
