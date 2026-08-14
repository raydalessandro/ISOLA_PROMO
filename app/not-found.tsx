import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pagina non trovata",
};

export default function NonTrovata() {
  return (
    <section className="sezione">
      <div className="contenuto">
        <div className="testa-sezione">
          <span className="occhiello">404</span>
          <h1>Qui non c&rsquo;è niente.</h1>
          <p>
            Succede anche sull&rsquo;isola: si prende un sentiero e finisce
            prima del previsto. Si torna indietro e si riparte.
          </p>
        </div>

        <div className="apertura-azioni">
          <Link className="bottone" href="/">
            Torna all&rsquo;isola
          </Link>
          <Link className="bottone bottone--chiaro" href="/mappa">
            Guarda la mappa
          </Link>
        </div>
      </div>
    </section>
  );
}
