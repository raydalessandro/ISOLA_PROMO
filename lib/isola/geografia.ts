/**
 * La forma dell'isola, letta sulla tavola dipinta.
 *
 * Ogni punto qui dentro è stato preso su `public/media/isola/mappa.webp` con una
 * griglia da cento unità sovrapposta, nello stesso riquadro 1000×1500 che usa
 * la mappa interattiva: quello che sulla tavola sta a 430 385 sta a 430 385
 * anche qui. Non è una geografia inventata, è la stessa isola ridisegnata.
 *
 * Cosa viene dal canone e cosa no, per chi rilegge:
 * — dal canone la **geografia**: le Montagne Gemelle a nord, l'anello del Fiume
 *   che Gira con la sola apertura a sud (la Bocca), il villaggio con l'Albero
 *   Vecchio dentro l'anello, la Foresta Intrecciata e gli Orti del Cerchio a
 *   ovest, il quartiere di Fuoco a est, la spiaggia e il pontile a sud;
 * — da questo file solo il **come si disegna**: quanti alberi, dove cade un
 *   tetto, quanto è larga una riva. Nessuna di queste scelte aggiunge canone,
 *   e nessuna può contraddirlo — se la tavola e questo file litigano, ha
 *   ragione la tavola.
 *
 * I nomi dei luoghi non stanno qui: le etichette le mette
 * `lib/mappa-posizioni.ts`, che pesca i luoghi veri da `lib/legami.ts`.
 */

import { caso, frastaglia, type P } from "@/lib/isola/tratto";

/** Il foglio: la tavola è 2:3, e il riquadro del disegno la ricalca. */
export const FOGLIO = { larghezza: 1000, altezza: 1500 };

/**
 * La linea di costa, in senso orario dal fianco nord-ovest.
 *
 * A nord si ferma bassa, sotto le montagne: le cime sono disegnate sopra, come
 * sulla tavola, e sporgono oltre la riva. È la convenzione della veduta a volo
 * d'uccello — la montagna si vede da davanti, la costa da sopra.
 */
export const COSTA: P[] = [
  [292, 206], [246, 240], [215, 262], [178, 300], [152, 330], [126, 358],
  [112, 396], [98, 432], [92, 470], [78, 512], [72, 558], [64, 606],
  [60, 660], [52, 712], [56, 762], [62, 812], [66, 862], [70, 912],
  [80, 962], [88, 1012], [100, 1060], [112, 1106], [131, 1150], [152, 1194],
  [176, 1236], [206, 1272], [242, 1300], [286, 1318], [330, 1332], [380, 1340],
  [430, 1346], [476, 1356], [520, 1362], [566, 1358], [610, 1350], [656, 1342],
  [700, 1330], [742, 1312], [782, 1290], [820, 1262], [852, 1230], [878, 1192],
  [901, 1150], [920, 1100], [936, 1050], [946, 996], [951, 940], [954, 886],
  [953, 830], [950, 774], [946, 720], [940, 664], [931, 610], [924, 558],
  [916, 506], [904, 458], [890, 412], [872, 370], [851, 332], [822, 300],
  [790, 272], [756, 248], [721, 228], [686, 212], [650, 198], [614, 182],
  [576, 168], [538, 158], [500, 154], [464, 152], [430, 154], [394, 162],
  [360, 172], [326, 188],
];
/**
 * La costa vera: la stessa linea, ma sbrecciata.
 *
 * I punti qui sopra sono quelli letti sulla tavola, ed è giusto che restino
 * pochi e leggibili — ma una costa che li unisce e basta viene un ovale. Fra
 * l'uno e l'altro se ne infilano altri spostati di traverso: nascono le cale e
 * i promontori, e la riva smette di sembrare disegnata col compasso.
 */
export const COSTA_VERA: P[] = frastaglia(COSTA, caso(4242), 9, true, 1);

/** Le secche: la fascia d'acqua chiara che accompagna la costa. */
export const SECCA_LARGA = 1.05;
export const SECCA_STRETTA = 1.022;

/** Il ciglio roccioso: dentro la costa, la corona di scogli e falesie. */
export const CIGLIO = 0.978;

/**
 * Il Fiume che Gira, in due bracci che si chiudono a nord e si ritrovano a sud.
 *
 * L'anello è chiuso attorno al villaggio e ha **una sola apertura**: la Bocca,
 * dove l'acqua incontra il mare. Il ramo est passa largo sotto il quartiere di
 * Fuoco, quello ovest sfiora la Foresta Intrecciata.
 */
export const FIUME_EST: P[] = [
  [520, 466], [604, 478], [692, 512], [772, 566], [828, 640], [858, 726],
  [868, 812], [858, 898], [826, 976], [772, 1042], [700, 1092], [618, 1140],
  [556, 1180],
];

export const FIUME_OVEST: P[] = [
  [520, 466], [438, 476], [368, 502], [324, 556], [306, 634], [301, 720],
  [300, 806], [288, 890], [286, 962], [312, 1032], [366, 1090], [438, 1136],
  [500, 1168], [556, 1180],
];

/** La Bocca: dal punto in cui i due bracci si ritrovano fino al mare. */
export const BOCCA: P[] = [
  [556, 1180], [546, 1236], [536, 1290], [524, 1342], [516, 1392],
];

/** La pozza dei pascoli, l'abbeveratoio dei pastori. */
export const POZZA = { cx: 432, cy: 386, rx: 44, ry: 24 };

/**
 * Le Montagne Gemelle: un massiccio solo, con due vette e una sella in mezzo.
 *
 * Sulla tavola non sono due coni piantati vicini — è una montagna sola che sale
 * due volte, e fra le due cime c'è l'insellatura da cui scende il rigagnolo dei
 * pascoli. La cresta la costruisce `strati.tsx` a gradini irregolari da questi
 * cinque punti: scritta come poligono verrebbe un poligono.
 */
export const MASSICCIO = {
  piedeSinistro: [204, 316] as P,
  ponente: [386, 62] as P,
  sella: [500, 196] as P,
  levante: [606, 46] as P,
  piedeDestro: [788, 312] as P,
  seme: 2101,
};

/** Le due vette, in ordine da ponente: servono a chi disegna luci e ombre. */
export const VETTE: P[] = [MASSICCIO.ponente, MASSICCIO.levante];

/** La sella fra le due cime, da cui scende il rigagnolo che alimenta la pozza. */
export const SELLA: P[] = [
  [502, 214], [500, 262], [494, 312], [486, 356], [462, 376], [432, 386],
];

/** Il piede delle montagne: dove la roccia si posa sul prato. */
export const PIEDE_MONTI: P[] = [
  [214, 268], [268, 292], [330, 302], [400, 300], [462, 298], [512, 302],
  [580, 306], [646, 300], [712, 294], [768, 272],
];

/** I quattro prati, dal più alto al più basso. */
export const PASCOLI_ALTI: P[] = [
  [140, 350], [230, 300], [330, 288], [430, 292], [520, 296], [620, 290],
  [720, 292], [810, 320], [860, 380], [872, 440], [840, 470], [760, 480],
  [660, 470], [560, 458], [460, 460], [370, 476], [280, 486], [200, 468],
  [148, 420],
];

/** Il prato dentro l'anello, quello che il villaggio si tiene attorno. */
export const PRATO_ANELLO: P[] = [
  [520, 486], [620, 500], [700, 536], [770, 590], [820, 660], [840, 750],
  [830, 850], [790, 950], [720, 1030], [630, 1090], [540, 1130], [450, 1100],
  [380, 1050], [330, 980], [316, 890], [322, 790], [330, 690], [352, 590],
  [420, 512],
];

/** Il prato di sud-ovest, fra il fiume e la spiaggia. */
export const PRATO_SUD_OVEST: P[] = [
  [286, 972], [318, 1046], [372, 1100], [440, 1146], [500, 1180], [470, 1240],
  [400, 1280], [312, 1300], [232, 1288], [172, 1230], [136, 1150], [124, 1064],
  [176, 1000],
];

/** Il prato di sud-est, fra il fiume e la Spiaggia delle Conchiglie. */
export const PRATO_SUD_EST: P[] = [
  [600, 1160], [680, 1110], [760, 1060], [830, 1000], [880, 1080], [886, 1160],
  [846, 1236], [772, 1288], [690, 1310], [614, 1300], [568, 1262], [572, 1204],
];

/** La Foresta Intrecciata: la massa più scura dell'isola, sul fianco ovest. */
export const FORESTA: P[] = [
  [96, 486], [148, 442], [212, 428], [268, 448], [304, 500], [312, 570],
  [300, 646], [284, 720], [258, 782], [212, 812], [156, 796], [112, 742],
  [86, 664], [78, 574],
];

/** Il bosco basso che scende a sud della foresta, più rado. */
export const BOSCO_SUD: P[] = [
  [110, 830], [168, 820], [214, 846], [230, 906], [212, 966], [166, 1006],
  [116, 990], [92, 928], [92, 870],
];

/** Gli Orti del Cerchio: i campi a cerchi concentrici. */
export const ORTI = { cx: 240, cy: 840, rx: 112, ry: 92, giri: 4 };

/** Il quartiere di Fuoco: terra secca e chiara, a est dell'Albero Vecchio. */
export const FUOCO: P[] = [
  [624, 578], [692, 542], [762, 550], [818, 598], [848, 672], [852, 764],
  [822, 848], [762, 896], [688, 900], [636, 862], [608, 782], [604, 678],
];

/**
 * La spiaggia: una fascia di sabbia lungo la riva sud, non una macchia in mezzo
 * al prato. Il bordo di sotto segue la costa, quello di sopra si ferma dove
 * l'erba ricomincia.
 */
export const SPIAGGIA: P[] = [
  [236, 1296], [300, 1272], [372, 1264], [450, 1268], [530, 1272], [606, 1266],
  [676, 1272], [736, 1290], [758, 1310], [700, 1332], [610, 1350], [520, 1362],
  [430, 1348], [330, 1334], [258, 1314],
];

/** La chioma dell'Albero Vecchio, e il piede del tronco. */
export const ALBERO_VECCHIO = { cx: 498, cy: 668, raggio: 130, tronco: [520, 836] as P };

/**
 * I sentieri, come si vedono sulla tavola: la Via che Sale dalle montagne,
 * l'anello di terra battuta attorno all'Albero, i rami verso gli orti, verso il
 * Forno e giù alla spiaggia.
 */
export const SENTIERI: P[][] = [
  [[498, 264], [508, 330], [520, 396], [524, 440], [516, 490], [506, 540], [502, 592]],
  [[502, 592], [470, 640], [430, 700], [408, 764], [420, 820], [470, 856], [530, 872], [590, 858], [636, 820], [648, 762], [630, 706], [592, 664], [546, 630], [502, 592]],
  [[408, 764], [356, 800], [300, 828], [252, 842]],
  [[636, 820], [688, 806], [736, 776], [772, 736]],
  [[530, 872], [536, 940], [552, 1010], [566, 1082], [566, 1150], [560, 1216], [556, 1272]],
  [[470, 856], [430, 906], [396, 962], [372, 1020]],
];

/** Il ponte sul ramo est: due travi e un corrimano, dove il sentiero passa. */
export const PONTE = { x: 862, y: 812, larghezza: 56, inclinazione: -14 };

/** Il pontile di Bartolo: entra in mare oltre la foce. */
export const PONTILE = { da: [498, 1352] as P, a: [452, 1444] as P, larghezza: 15 };

/** Le case, raccolte per quartiere. `r` è la rotazione del tetto in gradi. */
export type Casa = { x: number; y: number; s: number; r: number };

/** Il villaggio dentro l'anello, attorno alla piazza e sotto l'Albero. */
export const CASE_VILLAGGIO: Casa[] = [
  { x: 386, y: 792, s: 1.05, r: -6 }, { x: 420, y: 830, s: 0.92, r: 4 },
  { x: 372, y: 848, s: 0.86, r: -10 }, { x: 448, y: 866, s: 1.0, r: 2 },
  { x: 492, y: 884, s: 1.12, r: -3 }, { x: 540, y: 894, s: 0.95, r: 6 },
  { x: 588, y: 876, s: 1.04, r: -4 }, { x: 624, y: 842, s: 0.9, r: 8 },
  { x: 556, y: 842, s: 0.88, r: -7 }, { x: 604, y: 800, s: 0.98, r: 3 },
  { x: 636, y: 754, s: 0.92, r: -5 }, { x: 468, y: 812, s: 0.8, r: 9 },
  { x: 344, y: 806, s: 0.78, r: 6 }, { x: 512, y: 830, s: 0.82, r: -8 },
  { x: 420, y: 1032, s: 0.86, r: 5 }, { x: 540, y: 1048, s: 0.8, r: -6 },
];

/** Il quartiere di Fuoco: case più rade su terra secca, e il Forno col camino. */
export const CASE_FUOCO: Casa[] = [
  { x: 690, y: 668, s: 1.0, r: 4 }, { x: 726, y: 706, s: 0.92, r: -6 },
  { x: 690, y: 748, s: 0.96, r: 7 }, { x: 736, y: 790, s: 0.9, r: -3 },
  { x: 684, y: 826, s: 0.86, r: 5 }, { x: 782, y: 742, s: 0.88, r: -8 },
  { x: 776, y: 830, s: 0.8, r: 6 },
];

/** Il Forno di Fiamma: la casa col camino che fuma prima che sia giorno. */
export const FORNO = { x: 748, y: 650, s: 1.25, r: -4 };

/** Le capanne dei pastori, sui Pascoli Alti. */
export const CAPANNE_PASTORI: Casa[] = [
  { x: 400, y: 328, s: 1.0, r: 0 }, { x: 520, y: 352, s: 1.05, r: 0 },
  { x: 556, y: 378, s: 0.95, r: 0 }, { x: 592, y: 372, s: 0.9, r: 0 },
];

/** Le due capanne sulla spiaggia, di là dalla Bocca. */
export const CAPANNE_SPIAGGIA: Casa[] = [
  { x: 566, y: 1252, s: 0.86, r: -5 }, { x: 578, y: 1300, s: 0.78, r: 4 },
];

/** I cipressi del quartiere di Fuoco: scuri, stretti, in fila lungo il fiume. */
export const CIPRESSI: P[] = [
  [830, 664], [840, 700], [828, 736], [844, 776], [826, 812], [806, 856],
  [664, 606], [700, 596],
];

/**
 * I campi di semina: dove crescono gli alberi e quanti ne crescono.
 *
 * Il seme di ciascuno è scritto qui: cambiarlo rimescola quel bosco e solo
 * quello. Chi ritocca un numero si guarda l'anteprima, non si fida del nome.
 */
export const BOSCHI = [
  { forma: FORESTA, quanti: 190, seme: 1207, distanza: 13, raggio: [15, 26] as const, tono: "fitto" as const },
  { forma: BOSCO_SUD, quanti: 44, seme: 4411, distanza: 16, raggio: [12, 21] as const, tono: "fitto" as const },
  { forma: PASCOLI_ALTI, quanti: 62, seme: 902, distanza: 34, raggio: [10, 18] as const, tono: "rado" as const },
  { forma: PRATO_ANELLO, quanti: 44, seme: 3110, distanza: 40, raggio: [11, 19] as const, tono: "rado" as const },
  { forma: PRATO_SUD_OVEST, quanti: 46, seme: 5150, distanza: 34, raggio: [10, 18] as const, tono: "rado" as const },
  { forma: PRATO_SUD_EST, quanti: 48, seme: 6120, distanza: 34, raggio: [10, 18] as const, tono: "rado" as const },
  { forma: FUOCO, quanti: 9, seme: 7130, distanza: 52, raggio: [7, 12] as const, tono: "secco" as const },
];
