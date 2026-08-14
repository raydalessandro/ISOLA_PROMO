"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { avviaGioco } from "@/lib/gioco/motore";
import stili from "./gioco.module.css";

/**
 * La console dell'avventura.
 *
 * React possiede il DOM (schermo e tasti), il motore possiede il gioco: al
 * montaggio gli si passa il contenitore, allo smontaggio si chiama la funzione
 * che restituisce, che ferma il loop, stacca i listener e salva la partita.
 */
export function ConsoleIsola() {
  const contenitore = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = contenitore.current;
    if (!root) return;
    return avviaGioco(root);
  }, []);

  return (
    <div className={stili.superficie} ref={contenitore}>
      <div className={stili.console}>
        <Link href="/" className={stili.uscita}>
          ← Esci dall&rsquo;isola
        </Link>

        <div className={stili.scocca}>
          <canvas
            className={stili.schermo}
            data-schermo=""
            width={160}
            height={144}
            role="img"
            aria-label="Schermo del gioco: la mappa dell'isola vista dall'alto, con il bambino che cammina."
          />
          <div className={stili.targhetta}>
            ISOLA <em>DEI TRE VENTI</em>
          </div>
        </div>

        <div className={stili.comandi}>
          <div className={stili.croce}>
            <button
              type="button"
              className={`${stili.direzione} ${stili.su}`}
              id="dU"
              aria-label="Vai su"
            >
              ▲
            </button>
            <button
              type="button"
              className={`${stili.direzione} ${stili.sinistra}`}
              id="dL"
              aria-label="Vai a sinistra"
            >
              ◀
            </button>
            <div className={`${stili.direzione} ${stili.perno} ${stili.centro}`} aria-hidden="true" />
            <button
              type="button"
              className={`${stili.direzione} ${stili.destra}`}
              id="dR"
              aria-label="Vai a destra"
            >
              ▶
            </button>
            <button
              type="button"
              className={`${stili.direzione} ${stili.giu}`}
              id="dD"
              aria-label="Vai giù"
            >
              ▼
            </button>
          </div>

          <div className={stili.azioni}>
            <button
              type="button"
              className={`${stili.azione} ${stili.azioneB}`}
              id="btnB"
              aria-label="Tasto B: apri lo zaino"
            >
              B
            </button>
            <button
              type="button"
              className={stili.azione}
              id="btnA"
              aria-label="Tasto A: parla e conferma"
            >
              A
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
