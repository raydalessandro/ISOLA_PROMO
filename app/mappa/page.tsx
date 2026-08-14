import type { Metadata } from "next";
import Image from "next/image";

import { MappaIsola } from "@/components/mappa-isola";

export const metadata: Metadata = {
  title: "La mappa",
  description:
    "L'isola vista dall'alto: il Fiume che Gira, il villaggio, le Montagne Gemelle, la Bocca e la Foresta Intrecciata.",
};

/* Le voci ripercorrono la geografia canonica dell'isola, non un'invenzione
   grafica: sono i luoghi che le storie attraversano davvero. */
const voci = [
  {
    id: "fiume",
    titolo: "Il Fiume che Gira",
    testo:
      "Un anello d'acqua chiuso intorno al villaggio, con una sola apertura a sud: la Bocca, dove il fiume incontra il mare.",
    colore: "var(--taglio)",
  },
  {
    id: "villaggio",
    titolo: "Il villaggio e la piazza",
    testo:
      "Dentro l'anello. La piazza con l'Albero Vecchio, il mercato di mezzogiorno, la scuola, il forno.",
    colore: "var(--mulinello)",
  },
  {
    id: "montagne",
    titolo: "Le Montagne Gemelle",
    testo:
      "A nord, oltre i Pascoli Alti. Si sale per la Via che Sale. Lassù, presso il burrone, vive Grunto.",
    colore: "var(--tenue)",
  },
  {
    id: "foresta",
    titolo: "La Foresta Intrecciata",
    testo:
      "A ovest, oltre gli Orti del Cerchio. Ha un margine dove ci si ferma e un dentro dove gli alberi diventano tutti uguali.",
    colore: "var(--intreccio)",
  },
];

/*
 * Le didascalie descrivono quello che l'immagine mostra davvero, e in due casi
 * questo ha voluto dire correggere il nome che il file si porta dietro dal
 * canone: `che-dorme` è un'alba con le barche già fuori, e in `notturna` la
 * luna piena si vede benissimo. I nomi dei file restano quelli — rinominarli
 * costerebbe un giro di service worker per niente - ma il testo dice il vero.
 * Chi rilegge non li "aggiusti" all'indietro.
 */
const atmosfere = [
  {
    file: "panoramica",
    testo: "L'isola di giorno, dal mare.",
  },
  {
    file: "che-dorme",
    testo: "L'isola all'alba: il sole basso sul mare, le prime barche già fuori.",
  },
  {
    file: "notturna",
    testo: "L'isola di notte, sotto la luna piena, con le finestre accese.",
  },
];

export default function Mappa() {
  return (
    <section className="sezione">
      <div className="contenuto">
        <div className="testa-sezione">
          <span className="occhiello">La mappa</span>
          <h1>L&rsquo;isola vista dall&rsquo;alto.</h1>
          <p>
            Tutto quello che succede nelle dodici storie succede qui dentro. Le
            distanze contano: quando i tre fratelli attraversano l&rsquo;isola,
            ci mettono una giornata.
          </p>
        </div>

        <div className="mappa-legenda">
          {voci.map((voce) => (
            <div
              className="mappa-voce"
              key={voce.id}
              style={{ "--colore-voce": voce.colore } as React.CSSProperties}
            >
              <h3>{voce.titolo}</h3>
              <p>{voce.testo}</p>
            </div>
          ))}
        </div>

        <MappaIsola />

        <div className="mappa-atmosfere">
          {atmosfere.map((a) => (
            <figure className="atmosfera" key={a.file}>
              <Image
                src={`/media/isola/${a.file}.webp`}
                alt={a.testo}
                width={1000}
                height={1500}
                sizes="(min-width: 46rem) 31vw, 92vw"
              />
              <figcaption>{a.testo}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
