"use client";

/**
 * Ultima rete: qui si è rotto anche il layout, quindi questo componente
 * rimpiazza <html> e <body> e non può contare su globals.css.
 */
export default function ErroreGlobale({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="it">
      <body
        style={{
          background: "#faf6f0",
          color: "#241c14",
          fontFamily: "Georgia, 'Times New Roman', serif",
          margin: 0,
          minHeight: "100vh",
          padding: "3rem 1.5rem",
        }}
      >
        <main style={{ margin: "0 auto", maxWidth: "34rem" }}>
          <h1 style={{ fontSize: "1.9rem", lineHeight: 1.2, margin: "0 0 1rem" }}>
            Il sito non si è aperto.
          </h1>
          <p style={{ color: "#4a3d30", lineHeight: 1.6, margin: "0 0 1.6rem" }}>
            Prova a ricaricare la pagina.
          </p>
          <button
            onClick={reset}
            type="button"
            style={{
              background: "#25537f",
              border: 0,
              borderRadius: "999px",
              color: "#fff",
              cursor: "pointer",
              font: "600 0.95rem ui-sans-serif, system-ui, sans-serif",
              padding: "0.78rem 1.5rem",
            }}
          >
            Riprova
          </button>
          {error.digest ? (
            <p style={{ color: "#6d5d4c", fontSize: "0.8rem", marginTop: "2rem" }}>
              Riferimento: {error.digest}
            </p>
          ) : null}
        </main>
      </body>
    </html>
  );
}
