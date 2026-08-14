/**
 * Estrae da canone i legami fra luoghi, abitanti e storie, e scrive
 * `lib/legami.ts`.
 *
 *   node scripts/estrai-legami.mjs --canone ../isola_i3v_visual
 *
 * Il sito NON dipende dal canone in build. `isola_i3v_visual` è un repo
 * separato e in sola lettura: `npm run check` deve funzionare su una macchina
 * che non ce l'ha su disco. Questo script si lancia a mano quando il canone
 * cambia, l'output si committa e si rilegge come si fa con `lib/canone.ts`.
 * Niente generazione dentro `next build`, niente fetch, niente submodule.
 *
 * COSA ESCE E COSA RESTA
 *
 * `story_graph.json` è un documento di lavorazione: contiene le risoluzioni,
 * le paure e i finali delle dodici storie. Di quel file esce il **dove e il
 * quando**, mai il **cosa succede** (AGENTS.md, regola 7). Per questo i campi
 * ammessi sono elencati uno per uno qui sotto: una blacklist, al prossimo
 * campo aggiunto al grafo, pubblicherebbe un finale da sola.
 */

import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

/* --- campi ammessi -------------------------------------------------------- */

/** Proprietà del geojson che finiscono nel sito. `note` resta fuori. */
const CAMPI_LUOGO = [
  "id",
  "name",
  "type",
  "category",
  "quarter",
  "parent",
  "inhabitant",
  "status",
  "elevation_m",
  "flow_direction",
];

/** Campi delle storie che finiscono nel sito: dove, quando, con chi. */
const CAMPI_STORIA = [
  "id",
  "cycle",
  "season",
  "wind_active",
  "night_scene",
  "quartieri_attraversati",
];

/* --- lettura degli argomenti ---------------------------------------------- */

function leggiPercorsoCanone() {
  const i = process.argv.indexOf("--canone");
  if (i === -1 || !process.argv[i + 1]) {
    console.error(
      "Manca il canone.\n" +
        "  node scripts/estrai-legami.mjs --canone ../isola_i3v_visual\n\n" +
        "Il canone è un repo separato in sola lettura: va checkato a parte,\n" +
        "non è una dipendenza di questo progetto.",
    );
    process.exit(1);
  }
  return resolve(process.argv[i + 1]);
}

async function leggiJson(percorso) {
  try {
    return JSON.parse(await readFile(percorso, "utf8"));
  } catch (errore) {
    console.error(`Non riesco a leggere ${percorso}\n  ${errore.message}`);
    process.exit(1);
  }
}

/* --- proiezione ----------------------------------------------------------- */

/**
 * Il geojson è in WGS84. L'isola è piccola (8×7 km): una equirettangolare con
 * la correzione del coseno alla latitudine media basta e avanza, e non porta
 * dentro una libreria di proiezioni per un'isola inventata.
 *
 * L'uscita è in unità di viewBox, origine in alto a sinistra come nell'SVG:
 * x cresce verso est, y cresce verso sud.
 *
 * ATTENZIONE — LE POSIZIONI SONO SIMBOLICHE
 *
 * Le coordinate del geojson dicono **in quale quartiere** sta una cosa, e da
 * che parte, non dove sta davvero. Non sono un rilievo: l'isola misura 7,9×6,7
 * km, ma la bottega e la casa di Nodo distano 5,4 metri e la scuola dalla casa
 * di Stria 7,8. Su un riquadro da 1000 unità è meno di un pixel, ed è il motivo
 * per cui gli edifici del villaggio si accavallano in un grumo.
 *
 * Quindi: la proiezione serve a collocare le cose **per quartiere**, e le aree
 * dei quartieri sono affidabili. La disposizione dentro un quartiere va presa
 * dall'illustrazione di reference e dalle storie, non da questi numeri. Una
 * mappa disegnata leggendo queste coordinate come cartografia mostrerebbe
 * un'isola che non è quella dei libri.
 *
 * Il riquadro si misura sull'isola e non su tutto il canone: le due "Isole
 * all'Orizzonte" (status `stub`) stanno al largo, e inquadrarle dentro
 * rimpicciolirebbe l'isola vera per far posto a due triangolini. Restano nel
 * modulo con le loro coordinate, che cadono fuori dal riquadro — che è poi
 * esattamente dove stanno: oltre l'orizzonte.
 */
const LARGHEZZA_VISTA = 1000;

/** Il riquadro si costruisce su queste; tutto il resto viene comunque proiettato. */
const inquadrabile = (f) => f.properties.status !== "stub";

function costruisciProiezione(features) {
  const lon = [];
  const lat = [];
  for (const f of features.filter(inquadrabile)) {
    percorriCoordinate(f.geometry.coordinates, ([x, y]) => {
      lon.push(x);
      lat.push(y);
    });
  }

  const lonMin = Math.min(...lon);
  const lonMax = Math.max(...lon);
  const latMin = Math.min(...lat);
  const latMax = Math.max(...lat);
  const coseno = Math.cos(((latMin + latMax) / 2) * (Math.PI / 180));

  const larghezzaGradi = (lonMax - lonMin) * coseno;
  const scala = LARGHEZZA_VISTA / larghezzaGradi;
  const altezza = arrotonda((latMax - latMin) * scala);

  const proietta = ([x, y]) => [
    arrotonda((x - lonMin) * coseno * scala),
    arrotonda((latMax - y) * scala),
  ];

  return { proietta, vista: { larghezza: LARGHEZZA_VISTA, altezza } };
}

function percorriCoordinate(coordinate, visita) {
  if (typeof coordinate[0] === "number") {
    visita(coordinate);
    return;
  }
  for (const parte of coordinate) percorriCoordinate(parte, visita);
}

function mappaCoordinate(coordinate, proietta) {
  if (typeof coordinate[0] === "number") return proietta(coordinate);
  return coordinate.map((parte) => mappaCoordinate(parte, proietta));
}

/** Due decimali: su una vista da 1000 unità è meno di un decimo di pixel. */
const arrotonda = (n) => Math.round(n * 100) / 100;

/* --- normalizzazioni ------------------------------------------------------ */

/**
 * Il grafo nomina i quartieri col quadrante attaccato — `aria_nord`,
 * `acqua_sud`, `centro_villaggio`, `perimetro_fiume_che_gira`. Il geojson usa
 * il nome secco. Qui si riportano alla forma del geojson, che è quella che il
 * sito già conosce.
 */
const QUARTIERI = ["aria", "fuoco", "acqua", "terra", "centro", "perimetro"];

function normalizzaQuartiere(valore) {
  return QUARTIERI.find((q) => valore === q || valore.startsWith(`${q}_`)) ?? null;
}

/** Nel grafo un riferimento è a volte una stringa, a volte un oggetto con id. */
const soloId = (v) => (typeof v === "string" ? v : v?.id ?? null);

/* --- costruzione ---------------------------------------------------------- */

function costruisciLuoghi(features, proietta) {
  return features.map((f) => {
    const scelte = {};
    for (const campo of CAMPI_LUOGO) {
      if (f.properties[campo] !== undefined) scelte[campo] = f.properties[campo];
    }
    return {
      id: scelte.id,
      nome: scelte.name,
      tipo: scelte.type ?? null,
      categoria: scelte.category ?? null,
      quartiere: scelte.quarter ? normalizzaQuartiere(scelte.quarter) : null,
      dentro: scelte.parent ?? null,
      abitante: scelte.inhabitant ?? null,
      stato: scelte.status ?? null,
      altitudine: scelte.elevation_m ?? null,
      corrente: scelte.flow_direction ?? null,
      forma: f.geometry.type,
      punti: mappaCoordinate(f.geometry.coordinates, proietta),
    };
  });
}

function costruisciStorie(stories, alias) {
  return Object.keys(stories)
    .sort()
    .map((sid) => {
      const s = stories[sid];
      const scelte = {};
      for (const campo of CAMPI_STORIA) {
        if (s[campo] !== undefined) scelte[campo] = s[campo];
      }

      const luoghi = [
        soloId(s.location_primary),
        ...(s.locations_secondary ?? []).map(soloId),
      ]
        .filter(Boolean)
        .map((id) => alias.get(id) ?? id);

      return {
        sid: scelte.id,
        ciclo: scelte.cycle ?? null,
        stagione: scelte.season ?? null,
        vento: scelte.wind_active ?? null,
        notturna: Boolean(scelte.night_scene),
        quartieri: [...new Set((scelte.quartieri_attraversati ?? []).map(normalizzaQuartiere))]
          .filter(Boolean)
          .sort(),
        luoghi: [...new Set(luoghi)].sort(),
        cast: [...new Set((s.characters_in_scene ?? []).map(soloId).filter(Boolean))].sort(),
      };
    });
}

/* --- scrittura ------------------------------------------------------------ */

const json = (v) => JSON.stringify(v, null, 2).replace(/\n/g, "\n  ");

function componiModulo({ luoghi, storie, vista, versione, data }) {
  return `/**
 * GENERATO — non si modifica a mano.
 *
 *   node scripts/estrai-legami.mjs --canone ../isola_i3v_visual
 *
 * Proiezione pubblica dei legami del canone: quali luoghi stanno in quale
 * quartiere, chi ci abita, e per dove passano le dodici storie. Gli id degli
 * abitanti e delle storie sono gli stessi di \`lib/canone.ts\`: il join non ha
 * bisogno di una tabella di corrispondenza.
 *
 * Delle storie escono il dove e il quando, mai come vanno a finire: i racconti
 * stanno nei libri (AGENTS.md, regola 7).
 *
 * LE POSIZIONI SONO SIMBOLICHE. Le coordinate dicono in quale quartiere sta una
 * cosa, non dove sta davvero: l'isola misura 7,9×6,7 km ma la bottega e la casa
 * di Nodo distano 5,4 metri. Le **aree dei quartieri** sono affidabili; la
 * disposizione dentro un quartiere si prende dall'illustrazione di reference e
 * dalle storie. Chi disegna una mappa leggendo \`punti\` come cartografia
 * ottiene un'isola che non è quella dei libri.
 *
 * Sorgenti: island.geojson v${versione} (${data}) e story_graph.json.
 */

/** Riquadro della proiezione, in unità di viewBox SVG. */
export const vista = ${JSON.stringify(vista)} as const;

export type LuogoMappa = {
  id: string;
  nome: string;
  /** Che cosa è: quarter, building, path, river, landmark… */
  tipo: string | null;
  /** Sottotipo, dove il canone lo dà: bakery, school, sentiero_costiero… */
  categoria: string | null;
  /** aria, fuoco, acqua, terra, centro, perimetro. */
  quartiere: string | null;
  /** Il luogo che lo contiene, quando ce n'è uno. */
  dentro: string | null;
  /** Id dell'abitante in lib/canone.ts, per i luoghi che sono la casa di qualcuno. */
  abitante: string | null;
  stato: string | null;
  altitudine: number | null;
  /** Verso della corrente, per i tratti d'acqua. */
  corrente: string | null;
  forma: string;
  /**
   * Coordinate proiettate, annidate come nel GeoJSON di partenza.
   * **Simboliche**: dicono il quartiere e il lato, non la posizione reale.
   * Affidabili per le aree (\`tipo === "quarter"\`), non per i singoli edifici.
   */
  punti: number[] | number[][] | number[][][];
};

export const luoghiMappa: LuogoMappa[] = ${json(luoghi)};

export type StoriaLegami = {
  sid: string;
  ciclo: string | null;
  stagione: string | null;
  vento: string | null;
  notturna: boolean;
  /** I quartieri che la storia attraversa. */
  quartieri: string[];
  /** Id di luoghiMappa toccati dalla storia. */
  luoghi: string[];
  /** Id di personaggi in lib/canone.ts presenti in scena. */
  cast: string[];
};

export const storieLegami: StoriaLegami[] = ${json(storie)};

export const luogoMappa = (id: string) => luoghiMappa.find((l) => l.id === id);

export const legamiStoria = (sid: string) => storieLegami.find((s) => s.sid === sid);

/** I luoghi di un quartiere, il quartiere stesso escluso. */
export const luoghiDelQuartiere = (quartiere: string) =>
  luoghiMappa.filter((l) => l.quartiere === quartiere && l.tipo !== "quarter");

/** Le storie che passano da un luogo. */
export const storiePerLuogo = (id: string) =>
  storieLegami.filter((s) => s.luoghi.includes(id));

/** Dove abita un personaggio, se il canone gli dà una casa. */
export const casaDi = (abitante: string) =>
  luoghiMappa.filter((l) => l.abitante === abitante);
`;
}

/* --- esecuzione ----------------------------------------------------------- */

const canone = leggiPercorsoCanone();
const geo = await leggiJson(join(canone, "cartografia/geo/island.geojson"));
const grafo = await leggiJson(join(canone, "pipeline_narrativa/story_graph.json"));

const { proietta, vista } = costruisciProiezione(geo.features);

// Gli alias del geojson tengono la compatibilità con gli id vecchi del grafo:
// si risolvono qui, così il sito vede un id solo per luogo.
const alias = new Map();
for (const f of geo.features) {
  for (const a of f.properties.aliases ?? []) alias.set(a, f.properties.id);
}

const luoghi = costruisciLuoghi(geo.features, proietta);
const storie = costruisciStorie(grafo.stories, alias);

// Un id di storia che non risolve su nessun luogo vuol dire canone cambiato
// sotto i piedi: meglio fermarsi che scrivere un modulo con buchi dentro.
const conosciuti = new Set(luoghi.map((l) => l.id));
const orfani = storie.flatMap((s) => s.luoghi.filter((id) => !conosciuti.has(id)));
if (orfani.length) {
  console.error(`Luoghi citati dalle storie e assenti dal geojson: ${[...new Set(orfani)].join(", ")}`);
  process.exit(1);
}

await writeFile(
  new URL("../lib/legami.ts", import.meta.url),
  componiModulo({
    luoghi,
    storie,
    vista,
    versione: geo.metadata?.version ?? "sconosciuta",
    data: geo.metadata?.date ?? "senza data",
  }),
  "utf8",
);

const conAbitante = luoghi.filter((l) => l.abitante).length;
console.log(
  `lib/legami.ts scritto: ${luoghi.length} luoghi (${conAbitante} con un abitante), ` +
    `${storie.length} storie, vista ${vista.larghezza}×${vista.altezza}.`,
);
