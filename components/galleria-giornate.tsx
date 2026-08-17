"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import type { Giornata } from "@/lib/canone";

/*
 * La galleria delle giornate, con l'ingrandimento.
 *
 * **Senza JavaScript resta una galleria che funziona.** Ogni illustrazione è
 * dentro un collegamento al file grande: chi non ha JS — o chi apre in una
 * scheda nuova — vede comunque l'immagine intera. Il click viene intercettato
 * solo quando c'è qualcosa di meglio da fare, cioè aprire la lente.
 *
 * La lente è un `<dialog>` vero, non un div travestito: da lì arrivano gratis
 * il fuoco che resta dentro, la chiusura con Esc, lo sfondo inerte e il ritorno
 * del fuoco all'illustrazione da cui si era partiti. Riscriverli a mano
 * significherebbe farlo peggio.
 *
 * L'ingrandimento pesca dal file `@2x` (1500 px contro 860): è il motivo per
 * cui quelle due larghezze esistono.
 */

export function GalleriaGiornate({ immagini }: { immagini: Giornata[] }) {
  const [aperta, setAperta] = useState<number | null>(null);
  const lente = useRef<HTMLDialogElement>(null);

  const scorri = useCallback(
    (passo: number) =>
      setAperta((i) => (i === null ? i : (i + passo + immagini.length) % immagini.length)),
    [immagini.length],
  );

  useEffect(() => {
    const d = lente.current;
    if (!d) return;
    if (aperta === null) {
      if (d.open) d.close();
    } else if (!d.open) {
      d.showModal();
    }
  }, [aperta]);

  const corrente = aperta === null ? null : immagini[aperta];

  return (
    <>
      <div className="galleria">
        {immagini.map((immagine, i) => (
          <figure className="giornata" key={immagine.file}>
            <a
              className="giornata-apri"
              href={`/media/giornate/${immagine.file}@2x.webp`}
              onClick={(e) => {
                // Ctrl/cmd, rotellina o tasto destro: si lascia fare al browser.
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                setAperta(i);
              }}
            >
              <Image
                src={`/media/giornate/${immagine.file}.webp`}
                alt={immagine.didascalia}
                width={immagine.larghezza}
                height={immagine.altezza}
                sizes="(min-width: 70rem) 27vw, (min-width: 40rem) 44vw, 92vw"
              />
            </a>
            <figcaption>{immagine.didascalia}</figcaption>
          </figure>
        ))}
      </div>

      <dialog
        className="lente"
        ref={lente}
        aria-label="Illustrazione ingrandita"
        onClose={() => setAperta(null)}
        onClick={(e) => {
          // Solo lo sfondo: il click sull'immagine non deve chiudere.
          if (e.target === lente.current) setAperta(null);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            scorri(-1);
          }
          if (e.key === "ArrowRight") {
            e.preventDefault();
            scorri(1);
          }
        }}
      >
        {corrente && (
          <div className="lente-corpo">
            <figure className="lente-figura">
              <Image
                src={`/media/giornate/${corrente.file}@2x.webp`}
                alt={corrente.didascalia}
                width={corrente.larghezza}
                height={corrente.altezza}
                sizes="(min-width: 60rem) 70vw, 94vw"
              />
              <figcaption>{corrente.didascalia}</figcaption>
            </figure>

            <div className="lente-comandi">
              <button type="button" onClick={() => scorri(-1)}>
                <span aria-hidden="true">←</span> Precedente
              </button>
              <span className="lente-conto" aria-live="polite">
                {(aperta ?? 0) + 1} di {immagini.length}
              </span>
              <button type="button" onClick={() => scorri(1)}>
                Successiva <span aria-hidden="true">→</span>
              </button>
            </div>

            <button type="button" className="lente-chiudi" onClick={() => setAperta(null)}>
              Chiudi
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}
