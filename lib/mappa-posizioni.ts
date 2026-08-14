/**
 * Dove sta ogni luogo sulla mappa disegnata.
 *
 * Scritto a mano, e deve restare scritto a mano. Le coordinate di
 * `lib/legami.ts` vengono dal geojson del canone e sono **simboliche**: dicono
 * in quale quartiere sta una cosa, non dove sta — nel villaggio due edifici
 * distano cinque metri, e proiettandoli si ottiene un grumo illeggibile.
 *
 * Queste invece sono lette sull'illustrazione canonica
 * (`public/media/isola/mappa.webp`, la stessa isola stampata sulla quarta di
 * copertina), con una griglia sovrapposta: se una cosa sta a x=430 y=385 nel
 * disegno, sta a 430 385 anche qui.
 *
 * Regola per chi aggiunge una voce: **si segna solo quello che
 * nell'illustrazione si vede.** Un segnaposto è una promessa di precisione, e
 * su un luogo che il disegno non mostra sarebbe una precisione inventata. Chi
 * non è qui non è dimenticato: vive nel quartiere, e il quartiere lo dice la
 * scheda.
 */

import { luogoMappa } from "@/lib/legami";

export type SegnoMappa = {
  /** Id di `luoghiMappa` in lib/legami.ts. */
  id: string;
  x: number;
  y: number;
  /** Da che parte del segno cade l'etichetta, per non coprire il disegno. */
  etichetta: "sopra" | "sotto" | "destra" | "sinistra";
  /** Perché è collocato lì: si legge sull'illustrazione. */
  nota: string;
};

export const segni: SegnoMappa[] = [
  {
    id: "grotta_grunto",
    x: 638,
    y: 178,
    etichetta: "destra",
    nota: "Sul fianco est delle Montagne Gemelle: Grunto vive lassù, presso il Burrone.",
  },
  {
    id: "pozza_abbeveratoio_pastori",
    x: 430,
    y: 385,
    etichetta: "sinistra",
    nota: "La pozza si vede nel disegno, fra le capanne dei pastori e il prato.",
  },
  {
    id: "pascoli_alti",
    x: 262,
    y: 398,
    etichetta: "sinistra",
    nota: "Il prato aperto a nord, in contrasto col bosco che comincia più sotto.",
  },
  {
    id: "foresta_intrecciata",
    x: 158,
    y: 655,
    etichetta: "destra",
    nota: "La massa più scura dell'isola, sul fianco ovest.",
  },
  {
    id: "orti_del_cerchio",
    x: 230,
    y: 832,
    etichetta: "sotto",
    nota: "I cerchi concentrici dei campi: nel disegno sono inconfondibili.",
  },
  {
    id: "albero_vecchio",
    x: 500,
    y: 668,
    etichetta: "sopra",
    nota: "La chioma grande al centro del villaggio.",
  },
  {
    id: "piazza_villaggio",
    x: 522,
    y: 858,
    etichetta: "sotto",
    nota: "Lo slargo di terra battuta fra le case, sotto l'Albero Vecchio.",
  },
  {
    id: "forno",
    x: 748,
    y: 650,
    etichetta: "destra",
    nota: "Il camino che fuma prima che sia giorno: è il segno del quartiere di Fuoco.",
  },
  {
    id: "fiume_che_gira",
    x: 878,
    y: 645,
    etichetta: "destra",
    nota: "Sul braccio est dell'anello, dove il fiume corre largo.",
  },
  {
    id: "spiaggia_conchiglie",
    x: 645,
    y: 1302,
    etichetta: "destra",
    nota: "La sabbia a sud-est, oltre la foce.",
  },
  {
    id: "pontile_bocca",
    x: 470,
    y: 1392,
    etichetta: "sinistra",
    nota: "Il pontile che entra in mare, dove il Fiume incontra il mare.",
  },
];

/** I segni con il luogo del canone già agganciato. Salta i luoghi ignoti. */
export const segniConLuogo = () =>
  segni
    .map((segno) => ({ segno, luogo: luogoMappa(segno.id) }))
    .filter((v): v is { segno: SegnoMappa; luogo: NonNullable<ReturnType<typeof luogoMappa>> } =>
      Boolean(v.luogo),
    );
