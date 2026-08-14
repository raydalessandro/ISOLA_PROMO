import Image from "next/image";
import Link from "next/link";

import {
  libro,
  promessa,
  sito,
  storie,
  storiePerCiclo,
  totaleGiornate,
  venti,
} from "@/lib/canone";

export default function Apertura() {
  const primoVolume = storiePerCiclo("A");

  return (
    <>
      <section className="apertura">
        <div className="contenuto apertura-griglia">
          <div className="apertura-testo">
            <span className="tre-punti" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>

            <h1>
              L&rsquo;Isola dei <em>Tre Venti</em>
            </h1>

            <p className="apertura-promessa">{promessa}</p>

            <p className="apertura-sotto">
              Uno separa le cose, uno le unisce, uno le capovolge. Ci vivono
              animali che parlano e tre fratelli diversi in tutto: Gabriel
              decide, Elias parla con tutti, Noah trova ciò che nessuno aveva
              visto.
            </p>

            <div className="apertura-azioni">
              <Link className="bottone" href="/storie">
                Le dodici storie
              </Link>
              <Link className="bottone bottone--chiaro" href="/gioco">
                Entra nell&rsquo;isola
              </Link>
            </div>
          </div>

          <figure className="tavola">
            <Image
              src="/media/isola/arte-copertina.webp"
              alt="I tre fratelli nella piazza del villaggio, sotto l'Albero Vecchio, insieme a Rovo, Mèmolo, Stria e Fiamma."
              width={1000}
              height={1500}
              priority
              sizes="(min-width: 54rem) 40vw, 92vw"
            />
            <figcaption>La piazza del villaggio, sotto l&rsquo;Albero Vecchio.</figcaption>
          </figure>
        </div>
      </section>

      <section className="venti sezione">
        <div className="contenuto">
          <div className="testa-sezione">
            <span className="occhiello">I tre venti</span>
            <h2>Ogni vento è un modo di stare al mondo.</h2>
            <p>
              Non sono magia e non fanno miracoli: cambiano il tempo, e col
              tempo cambia quello che i bambini riescono a vedere.
            </p>
          </div>

          <div className="venti-griglia">
            {venti.map((vento) => (
              <article
                key={vento.id}
                className="vento"
                style={{ "--colore-vento": vento.colore } as React.CSSProperties}
              >
                <span className="occhiello">{vento.stagione}</span>
                <h3>{vento.nome}</h3>
                <p>{vento.cosaFa}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sezione">
        <div className="contenuto">
          <div className="testa-sezione">
            <span className="occhiello">L&rsquo;isola</span>
            <h2>Un posto che si può visitare.</h2>
            <p>
              Il villaggio, i quattro quartieri, le Montagne Gemelle, il Fiume
              che Gira. Tutto quello che succede nelle storie succede qui.
            </p>
          </div>

          <div className="rimandi">
            <Link className="rimando" href="/mondo">
              <div className="rimando-figura">
                <Image
                  src="/media/giornate/v2-20-isola-abitata-cover.webp"
                  alt=""
                  width={860}
                  height={484}
                  sizes="(min-width: 46rem) 46vw, 92vw"
                />
              </div>
              <div className="rimando-corpo">
                <span className="occhiello">Chi ci vive</span>
                <h3>Diciotto abitanti, e nessuno è una comparsa</h3>
                <p>
                  I tre fratelli, gli animali del villaggio, chi tiene in piedi
                  l&rsquo;isola e i cinque cuccioli della scuola.
                </p>
                <span className="freccia">Conoscili →</span>
              </div>
            </Link>

            <Link className="rimando" href="/mappa">
              <div className="rimando-figura">
                <Image
                  src="/media/isola/mappa.webp"
                  alt=""
                  width={832}
                  height={1248}
                  sizes="(min-width: 46rem) 46vw, 92vw"
                />
              </div>
              <div className="rimando-corpo">
                <span className="occhiello">La mappa</span>
                <h3>L&rsquo;isola vista dall&rsquo;alto</h3>
                <p>
                  Il Fiume che Gira chiude un anello intorno al villaggio. Fuori
                  dall&rsquo;anello ci sono il mare, la Bocca e le montagne.
                </p>
                <span className="freccia">Guarda la mappa →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="venti sezione">
        <div className="contenuto">
          <div className="testa-sezione">
            <span className="occhiello">Le giornate</span>
            <h2>Quello che succede fra una storia e l’altra.</h2>
            <p>
              {totaleGiornate} illustrazioni che non stanno in nessun libro:
              giornate normali dell’isola, un gesto per volta.
            </p>
          </div>

          <div className="rimandi">
            <Link className="rimando" href="/giornate">
              <div className="rimando-figura">
                <Image
                  src="/media/giornate/s1-19-mercato-cover.webp"
                  alt=""
                  width={860}
                  height={484}
                  sizes="(min-width: 46rem) 46vw, 92vw"
                />
              </div>
              <div className="rimando-corpo">
                <span className="occhiello">{totaleGiornate} illustrazioni</span>
                <h3>Le giornate dell’isola</h3>
                <p>
                  Un ponte da provare, una legatura da rifare, una fila di semi
                  storta. Sono le immagini che accompagneranno l’isola sui
                  social.
                </p>
                <span className="freccia">Guardale →</span>
              </div>
            </Link>

            <Link className="rimando" href="/giornate">
              <div className="rimando-figura">
                <Image
                  src="/media/giornate/v2-11-bartolo-mattino-cover.webp"
                  alt=""
                  width={860}
                  height={484}
                  sizes="(min-width: 46rem) 46vw, 92vw"
                />
              </div>
              <div className="rimando-corpo">
                <span className="occhiello">Uno alla volta</span>
                <h3>Venti ritratti, venti mestieri</h3>
                <p>
                  Fiamma prima che cominci il giorno, Bartolo che controlla una
                  cima all’alba, Zolla che pareggia un’aiuola.
                </p>
                <span className="freccia">Conosci l’isola →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="vetrina sezione">
        <div className="contenuto vetrina-griglia">
          <div className="vetrina-copertina">
            <Image
              src="/media/libro/vol1-tre-quarti.webp"
              alt={`Copertina di ${libro.titolo}, ${libro.sottotitolo}`}
              width={760}
              height={950}
              sizes="(min-width: 54rem) 34vw, 88vw"
            />
          </div>

          <div>
            <span className="occhiello">Il primo volume</span>
            <h2>{libro.titolo}</h2>
            <p className="vetrina-sottotitolo">{libro.sottotitolo}</p>
            <p>{libro.descrizione}</p>

            <ul className="vetrina-elenco">
              {primoVolume.map((storia) => (
                <li key={storia.sid}>{storia.titolo}</li>
              ))}
            </ul>

            <p>
              {libro.eta}. {sito.autore}, {sito.editore}.
            </p>

            <div className="vetrina-azioni">
              <span className="in-arrivo">Su Amazon</span>
              <Link className="bottone bottone--chiaro" href="/libro">
                Guarda il libro
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="sezione">
        <div className="contenuto">
          <div className="testa-sezione">
            <span className="occhiello">Le storie</span>
            <h2>Dodici storie, quattro stagioni.</h2>
            <p>
              Tre per volume, una per sera. I titoli sono qui; i racconti stanno
              nei libri.
            </p>
          </div>

          <div className="rimandi">
            <Link className="rimando" href="/storie">
              <div className="rimando-figura">
                <Image
                  src="/media/isola/panoramica.webp"
                  alt=""
                  width={1000}
                  height={1500}
                  sizes="(min-width: 46rem) 46vw, 92vw"
                />
              </div>
              <div className="rimando-corpo">
                <span className="occhiello">
                  {storie.length} titoli
                </span>
                <h3>Tutte le storie della saga</h3>
                <p>
                  Dalla nebbia sulle Montagne Gemelle al pomeriggio in cui i tre
                  venti suonano insieme.
                </p>
                <span className="freccia">Leggi i titoli →</span>
              </div>
            </Link>

            <Link className="rimando" href="/gioco">
              <div className="rimando-figura">
                <Image
                  src="/media/isola/che-dorme.webp"
                  alt=""
                  width={832}
                  height={1248}
                  sizes="(min-width: 46rem) 46vw, 92vw"
                />
              </div>
              <div className="rimando-corpo">
                <span className="occhiello">Per i bambini</span>
                <h3>Un&rsquo;avventura sull&rsquo;isola</h3>
                <p>
                  Un piccolo gioco: commissioni da portare a termine, il memory
                  coi cuccioli, otto stelle da raccogliere. Nessuna battaglia.
                </p>
                <span className="freccia">Gioca →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
