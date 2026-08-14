import type { Metadata } from "next";
import Image from "next/image";

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

const atmosfere = [
  {
    file: "panoramica",
    testo: "L'isola di giorno, dal mare.",
  },
  {
    file: "che-dorme",
    testo: "L'isola che dorme.",
  },
  {
    file: "notturna",
    testo: "L'isola di notte, senza luna.",
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

        <figure className="mappa-tavola">
          <Image
            src="/media/isola/mappa.webp"
            alt="Mappa dell'isola vista dall'alto: il villaggio al centro, l'anello del Fiume che Gira, le Montagne Gemelle a nord, la foresta a ovest e la Bocca a sud."
            width={1000}
            height={1500}
            priority
            sizes="(min-width: 46rem) 44rem, 92vw"
          />
        </figure>

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
