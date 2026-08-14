"use client";

import { useEffect } from "react";

/**
 * Registra il service worker.
 *
 * In sviluppo resta spento di proposito: servire risorse dalla cache mentre si
 * lavora fa perdere ore a inseguire modifiche che il browser non mostra.
 */
export function useServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const registra = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Registrazione fallita: online il sito funziona comunque per intero.
      });
    };

    if (document.readyState === "complete") registra();
    else window.addEventListener("load", registra, { once: true });

    return () => window.removeEventListener("load", registra);
  }, []);
}
