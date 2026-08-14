"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { canali, sito } from "@/lib/canone";
import { useServiceWorker } from "@/lib/use-service-worker";
import {
  IconaGiornate,
  IconaGioco,
  IconaIsola,
  IconaLibro,
  IconaMappa,
  IconaMondo,
  IconaStorie,
  MarchioTrePunti,
} from "@/components/icone";

const voci = [
  { href: "/", etichetta: "Isola", esteso: "L'isola", Icona: IconaIsola },
  { href: "/mondo", etichetta: "Mondo", esteso: "Chi ci vive", Icona: IconaMondo },
  { href: "/giornate", etichetta: "Giornate", esteso: "Le giornate", Icona: IconaGiornate },
  { href: "/storie", etichetta: "Storie", esteso: "Le dodici storie", Icona: IconaStorie },
  { href: "/mappa", etichetta: "Mappa", esteso: "La mappa", Icona: IconaMappa },
  { href: "/libro", etichetta: "Libro", esteso: "Il libro", Icona: IconaLibro },
  { href: "/gioco", etichetta: "Gioco", esteso: "Il gioco", Icona: IconaGioco },
];

/* La barra bassa non regge sette voci su un telefono: la mappa resta nella
   navigazione ampia e nei rimandi dentro le pagine. */
const vociBarra = voci.filter((v) => v.href !== "/mappa");

function TrePunti() {
  return (
    <span className="tre-punti" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const percorso = usePathname();
  useServiceWorker();

  /* Il gioco occupa lo schermo: niente testata, niente barra, un solo <main>. */
  if (percorso.startsWith("/gioco")) return <main id="contenuto">{children}</main>;

  const corrente = (href: string) =>
    href === "/" ? percorso === "/" : percorso.startsWith(href);

  return (
    <div className="shell">
      <a className="salta-al-contenuto" href="#contenuto">
        Salta al contenuto
      </a>

      <header className="testata">
        <div className="testata-interno">
          <Link href="/" className="marchio">
            <MarchioTrePunti className="marchio-segno" />
            <span className="marchio-testo">
              <b>L&rsquo;Isola dei Tre Venti</b>
              <small>{sito.editore}</small>
            </span>
          </Link>

          <nav className="navigazione" aria-label="Navigazione principale">
            {voci
              .filter((v) => v.href !== "/")
              .map(({ href, esteso }) => (
                <Link
                  key={href}
                  href={href}
                  aria-current={corrente(href) ? "page" : undefined}
                >
                  {esteso}
                </Link>
              ))}
          </nav>
        </div>
      </header>

      <main id="contenuto">{children}</main>

      <footer className="chiusura">
        <div className="chiusura-interno">
          <div className="chiusura-marchio">
            <TrePunti />
            <h2>Tre venti, dodici storie, quattro stagioni.</h2>
            <p>{sito.descrizione}</p>
          </div>

          <div>
            <h2>Dove trovarci</h2>
            <div className="chiusura-canali">
              {canali.map((canale) => (
                <div key={canale.id} className="chiusura-canale">
                  {canale.url ? (
                    <a href={canale.url} rel="noreferrer" target="_blank">
                      {canale.nome} su {canale.dove}
                    </a>
                  ) : (
                    <span>
                      {canale.nome} su {canale.dove}
                    </span>
                  )}
                  <span>{canale.url ? "aperto" : "in arrivo"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="colophon">
          {sito.nome} — {sito.autore}, {sito.editore}. Illustrazioni e testi
          della saga, tutti i diritti riservati.
        </p>
      </footer>

      <nav className="barra-bassa" aria-label="Navigazione">
        {vociBarra.map(({ href, etichetta, Icona }) => (
          <Link
            key={href}
            href={href}
            aria-current={corrente(href) ? "page" : undefined}
          >
            <Icona />
            {etichetta}
          </Link>
        ))}
      </nav>
    </div>
  );
}
