import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Senza rete",
  description: "Questa pagina non è ancora stata salvata sul dispositivo.",
};

export default function Offline() {
  return (
    <section className="sezione">
      <div className="contenuto">
        <div className="testa-sezione">
          <span className="occhiello">Senza rete</span>
          <h1>Questa pagina non è ancora scesa a terra.</h1>
          <p>
            Il dispositivo è offline e questa pagina non era ancora stata
            salvata. Quello che hai già visitato resta leggibile — e il gioco,
            una volta aperto, funziona anche senza rete.
          </p>
        </div>

        <div className="apertura-azioni">
          <Link className="bottone" href="/gioco">
            Vai al gioco
          </Link>
          <Link className="bottone bottone--chiaro" href="/">
            Torna all&rsquo;isola
          </Link>
        </div>
      </div>
    </section>
  );
}
