/**
 * I quartieri, dalla parte del sito.
 *
 * `isola-mappa/quartieri.ts` sa **dove** guardare: un rettangolo per ciascuno,
 * letto sul disegno. Qui c'è tutto il resto, che è roba di canone e quindi non
 * può stare lì dentro: come si chiamano, che riga li racconta, quali luoghi ci
 * cadono, chi ci abita, quali storie ci passano.
 *
 * Le due liste si tengono per l'id, e questo file è l'unico posto in cui si
 * toccano. Un quartiere che il canone aggiungesse domani va scritto in tutte e
 * due — una riga qui, un rettangolo là — e non c'è modo di dimenticarsene a
 * metà: senza rettangolo non si disegna, senza questa riga non ha nome.
 */

import { luoghi, personaggi } from "@/lib/canone";
import { casaPrincipale, storieDi } from "@/lib/dove";
import { luoghiMappa } from "@/lib/legami";
import { abitantiSullaMappa } from "@/lib/mappa-abitanti";
import { segni } from "@/lib/mappa-posizioni";
import { inquadratura } from "@/isola-mappa";

export type QuartiereSito = {
  /** Come si chiama nell'indirizzo: /mappa/fuoco. */
  url: string;
  /** L'id dell'inquadratura in `isola-mappa`. */
  vista: string;
  /** L'id del luogo in `lib/canone.ts`, da cui vengono nome e riga. */
  canone: string;
  /** Come lo chiama `lib/legami.ts` nei suoi luoghi. */
  chiave: string;
};

/*
 * L'ordine è quello della bussola del canone: nord, est, sud, ovest, e il
 * villaggio in mezzo — che non è un quartiere ma il centro, e infatti sta per
 * ultimo, come sulle pagine del sito.
 */
export const QUARTIERI_SITO: QuartiereSito[] = [
  { url: "aria", vista: "aria", canone: "quartiere-aria", chiave: "aria" },
  { url: "fuoco", vista: "fuoco", canone: "quartiere-fuoco", chiave: "fuoco" },
  { url: "acqua", vista: "acqua", canone: "quartiere-acqua", chiave: "acqua" },
  { url: "terra", vista: "terra", canone: "quartiere-terra", chiave: "terra" },
  { url: "villaggio", vista: "centro", canone: "villaggio", chiave: "centro" },
];

export const quartiereSito = (url: string) => QUARTIERI_SITO.find((q) => q.url === url);

/** Nome e riga vengono dal canone, non da qui. */
export const vociDelQuartiere = (q: QuartiereSito) => {
  const luogo = luoghi.find((l) => l.id === q.canone);
  return {
    nome: luogo?.nome ?? "",
    riga: luogo?.riga ?? "",
    vista: inquadratura(q.vista),
  };
};

/** I segni della mappa che cadono dentro il riquadro di questo quartiere. */
export const segniDelQuartiere = (q: QuartiereSito) => {
  const v = inquadratura(q.vista);
  return segni.filter(
    (s) => s.x >= v.x && s.x <= v.x + v.larghezza && s.y >= v.y && s.y <= v.y + v.altezza,
  );
};

/** Gli abitanti che il canone mette di casa in questo quartiere. */
export const abitantiDelQuartiere = (q: QuartiereSito) =>
  abitantiSullaMappa
    .map((figura) => ({
      figura,
      persona: personaggi.find((p) => p.id === figura.id),
      casa: casaPrincipale(figura.id),
    }))
    .filter((v) => v.persona && v.casa?.quartiere === q.chiave)
    .map((v) => ({
      ...v,
      persona: v.persona!,
      casa: v.casa!,
      storie: storieDi(v.figura.id).length,
    }));

/** Quanti luoghi il canone conta in questo quartiere: serve a dire il vero in una riga. */
export const quantiLuoghi = (q: QuartiereSito) =>
  luoghiMappa.filter((l) => l.quartiere === q.chiave && l.tipo !== "path" && l.tipo !== "quarter")
    .length;
