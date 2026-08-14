"use client";

import { useEffect } from "react";

export default function Errore({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In produzione il messaggio non arriva al client: resta il digest, che è
    // l'unico appiglio per ritrovare l'errore nei log di Vercel.
    console.error(error);
  }, [error]);

  return (
    <section className="sezione">
      <div className="contenuto">
        <div className="testa-sezione">
          <span className="occhiello">Qualcosa si è rotto</span>
          <h1>Questa pagina non si è aperta.</h1>
          <p>
            Non è colpa tua. Prova a ricaricare: se continua, il problema è
            nostro e lo stiamo già guardando.
          </p>
        </div>

        <div className="apertura-azioni">
          <button className="bottone" onClick={reset} type="button">
            Riprova
          </button>
        </div>

        {error.digest ? (
          <p className="colophon" style={{ paddingInline: 0 }}>
            Riferimento: {error.digest}
          </p>
        ) : null}
      </div>
    </section>
  );
}
