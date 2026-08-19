"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

import { camera, inquadratura } from "@/isola-mappa";

/*
 * La camera sulla mappa.
 *
 * Ingrandisce un quartiere senza cambiare pagina: la stessa immagine, spostata
 * e ingrandita quanto basta perché il riquadro del quartiere riempia la
 * cornice. Il conto lo fa `isola-mappa` — la mappa sa dove stanno i suoi
 * quartieri, questa è solo la mano che la muove.
 *
 * **I pulsanti sono collegamenti veri.** Senza JavaScript portano alla pagina
 * del quartiere, che esiste e funziona per conto suo; con JavaScript il primo
 * clic ingrandisce, e il secondo sullo stesso quartiere apre la pagina. Così
 * non c'è nessun controllo finto (AGENTS.md, regola 5) e chi vuole guardare non
 * è costretto a cambiare pagina.
 *
 * Il dettaglio vero — gli abitanti, il mercato, le reti sulla sabbia — sta
 * nell'immagine del quartiere, e quella la carica la sua pagina: qui si
 * ingrandisce il disegno dell'isola intera, che è già in cache.
 */

export type VoceCamera = { url: string; vista: string; nome: string; breve: string };

export function MappaConCamera({
  quartieri,
  children,
}: {
  quartieri: VoceCamera[];
  children: ReactNode;
}) {
  /*
   * Non c'è nessun "siamo montati?": non serve. Tutto quello che si vede è un
   * collegamento che porta da qualche parte, e la camera è quello che succede
   * *invece* di seguirlo quando il browser sa eseguire questo file. Senza
   * JavaScript i clic non passano di qui e i collegamenti fanno il loro
   * mestiere; `attivo` resta vuoto, e i controlli che avrebbero senso solo da
   * ingranditi non compaiono affatto.
   */
  const [attivo, setAttivo] = useState<string | null>(null);

  const quartiere = quartieri.find((q) => q.url === attivo);
  const puntata = quartiere ? camera(inquadratura(quartiere.vista)) : null;

  const trasformazione = puntata
    ? `translate(${((0.5 - puntata.fuoco.x) * puntata.scala * 100).toFixed(2)}%, ${(
        (0.5 - puntata.fuoco.y) * puntata.scala * 100
      ).toFixed(2)}%) scale(${puntata.scala.toFixed(3)})`
    : undefined;

  return (
    <div className="mappa-camera">
      <nav className="mappa-quartieri" aria-label="I quartieri dell’isola">
        {quartieri.map((q) => (
          <Link
            key={q.url}
            href={`/mappa/${q.url}`}
            className={q.url === attivo ? "mappa-chip mappa-chip--attivo" : "mappa-chip"}
            aria-current={q.url === attivo ? "true" : undefined}
            onClick={(e) => {
              /* Il primo clic guarda, il secondo entra. */
              if (q.url === attivo) return;
              e.preventDefault();
              setAttivo(q.url);
            }}
          >
            {q.breve}
          </Link>
        ))}

        {attivo && (
          <Link
            href="/mappa"
            className="mappa-chip mappa-chip--via"
            onClick={(e) => {
              e.preventDefault();
              setAttivo(null);
            }}
          >
            Tutta l’isola
          </Link>
        )}
      </nav>

      <div className="mappa-quadro">
        <div
          className="mappa-scena"
          style={
            {
              transform: trasformazione,
              "--zoom": puntata ? puntata.scala.toFixed(3) : 1,
            } as React.CSSProperties
          }
        >
          {children}
        </div>
      </div>

      {quartiere && (
        <p className="mappa-invito">
          <Link href={`/mappa/${quartiere.url}`}>
            Apri {quartiere.nome.toLowerCase().startsWith("il ") ? quartiere.nome.toLowerCase() : quartiere.nome}{" "}
            &rarr;
          </Link>
          <span> Da vicino si vede chi ci sta di casa.</span>
        </p>
      )}
    </div>
  );
}
