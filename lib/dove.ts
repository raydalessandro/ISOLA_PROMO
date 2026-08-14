/**
 * Dove abita chi, e per dove passano le storie.
 *
 * `lib/legami.ts` è generato dal canone e contiene i legami grezzi; qui ci sono
 * le poche scelte editoriali che servono a mostrarli, e stanno scritte a mano
 * perché sono scelte, non dati:
 *
 * - fra le case di uno stesso abitante si mostra quella dove lo si trova
 *   davvero (la Scuola per Stria, il Pontile per Bartolo), non l'indirizzo;
 * - fra i luoghi di una storia si mostrano i più caratteristici, e i sentieri
 *   restano fuori: «passa per il Sentiero Orti-Casa Salvia» non dice niente a
 *   nessuno.
 *
 * Vale sempre la regola 7: di una storia esce **dove passa e quando**, mai come
 * va a finire.
 */

import type { LuogoMappa, StoriaLegami } from "@/lib/legami";
import { casaDi, luoghiMappa, storieLegami } from "@/lib/legami";

/** Come si chiamano i quartieri quando si scrivono in una frase. */
export const QUARTIERI: Record<string, string> = {
  aria: "quartiere d’Aria",
  fuoco: "quartiere di Fuoco",
  acqua: "quartiere d’Acqua",
  terra: "quartiere di Terra",
  centro: "villaggio",
  perimetro: "attorno all’isola",
};

/** Il colore del quartiere, dai token dei tre venti. */
export const COLORI_QUARTIERE: Record<string, string> = {
  aria: "var(--taglio)",
  fuoco: "var(--mulinello-testo)",
  acqua: "var(--taglio)",
  terra: "var(--intreccio)",
  centro: "var(--morbido)",
  perimetro: "var(--taglio)",
};

export const nomeQuartiere = (quartiere: string | null) =>
  QUARTIERI[quartiere ?? "centro"] ?? QUARTIERI.centro;

/** Quante storie passano da un luogo: serve a scegliere fra più candidati. */
const presenze = new Map<string, number>();
for (const s of storieLegami) {
  for (const id of s.luoghi) presenze.set(id, (presenze.get(id) ?? 0) + 1);
}

/**
 * La casa di un personaggio, quando il canone gliene dà una.
 *
 * Alcuni ne hanno due — Stria la scuola e la casa, Bartolo il pontile e la
 * capanna. Si mostra quella che le storie attraversano di più: è il posto in
 * cui quel personaggio lo si incontra, che è l'informazione utile a chi legge.
 */
export const casaPrincipale = (idPersonaggio: string): LuogoMappa | undefined =>
  casaDi(idPersonaggio)
    .slice()
    .sort((a, b) => (presenze.get(b.id) ?? 0) - (presenze.get(a.id) ?? 0))[0];

/**
 * «al Forno di Fiamma», «alla Scuola di Stria».
 *
 * Il genere si ricava dalla prima parola del nome: in italiano i nomi di luogo
 * che finiscono in -a sono femminili (Scuola, Bottega, Casetta, Casa, Tana,
 * Grotta, Capanna), gli altri maschili (Forno, Pontile, Cortile). Vale per
 * tutte e dieci le case che il canone assegna; se un giorno ne arriva una che
 * non ci sta, si scrive l'eccezione qui invece di indovinare.
 */
export const conArticolo = (nome: string) =>
  `${/a$/i.test(nome.split(" ")[0]) ? "alla" : "al"} ${nome}`;

/** Le storie in cui un personaggio è in scena. */
export const storieDi = (idPersonaggio: string): StoriaLegami[] =>
  storieLegami.filter((s) => s.cast.includes(idPersonaggio));

/**
 * I luoghi che danno il carattere a una storia.
 *
 * Fuori i sentieri, e in testa i luoghi che compaiono in **meno** storie: sono
 * quelli che distinguono questa storia dalle altre. Le Montagne Gemelle dicono
 * qualcosa; la Piazza del Villaggio, che torna quasi ovunque, molto meno.
 */
export const luoghiNotevoli = (sid: string, quanti = 3): LuogoMappa[] => {
  const storia = storieLegami.find((s) => s.sid === sid);
  if (!storia) return [];

  return storia.luoghi
    .map((id) => luoghiMappa.find((l) => l.id === id))
    .filter((l): l is LuogoMappa => Boolean(l) && l!.tipo !== "path")
    .sort(
      (a, b) =>
        (presenze.get(a.id) ?? 0) - (presenze.get(b.id) ?? 0) ||
        a.nome.localeCompare(b.nome, "it"),
    )
    .slice(0, quanti);
};

/** «Inverno, di notte» — il quando di una storia, senza il come va a finire. */
export const quando = (sid: string) => {
  const storia = storieLegami.find((s) => s.sid === sid);
  if (!storia?.stagione) return null;

  const stagione = storia.stagione[0].toUpperCase() + storia.stagione.slice(1);
  return storia.notturna ? `${stagione}, di notte` : stagione;
};

/** «A, B e C»: l'elenco come lo scriverebbe una persona, non una virgola secca. */
export const elenco = (voci: string[]) =>
  voci.length <= 1 ? (voci[0] ?? "") : `${voci.slice(0, -1).join(", ")} e ${voci.at(-1)}`;
