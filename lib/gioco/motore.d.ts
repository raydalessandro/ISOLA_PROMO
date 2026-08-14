/**
 * Tipo pubblico del motore di gioco (`motore.js`, JavaScript portato dal
 * prototipo). L'unica superficie che il resto dell'app deve conoscere.
 */

/**
 * Avvia l'avventura dentro `root`, che deve già contenere il canvas
 * (`[data-schermo]`) e i tasti della console (`#dU #dD #dL #dR #btnA #btnB`).
 * Restituisce la funzione che ferma il gioco, stacca i listener e salva.
 */
export function avviaGioco(root: HTMLElement): () => void;
