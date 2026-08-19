/**
 * L'isola disegnata — la porta d'ingresso.
 *
 * Questa cartella è un **asset a sé**: disegna l'isola dei Tre Venti e non sa
 * niente del sito che la mostra. Non importa niente da fuori, non conosce
 * Next, non legge il canone, non tocca il DOM. Chi la vuole altrove se la porta
 * via com'è — vedi `LEGGIMI.md`.
 *
 * Da qui passa tutto quello che serve di fuori. Il resto dei file è interno:
 * cambia quando il disegno cambia, e nessuno deve dipenderci.
 */

export { IsolaDisegnata, descrizione } from "./disegno/isola";
export { FOGLIO } from "./geografia";
export {
  camera, ISOLA_INTERA, type Inquadratura, inquadratura, QUARTIERI, riquadro,
} from "./quartieri";
export { TAVOLA } from "./tavola";
