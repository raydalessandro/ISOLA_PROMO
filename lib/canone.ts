/**
 * Fonte unica del sito. Tutto quello che le pagine mostrano nasce da qui.
 *
 * I dati derivano dal canone in `raydalessandro/isola_i3v_visual` (grafo delle
 * storie, schede visual, scheda KDP del Volume 1). Il canone resta là: questo
 * file ne è una proiezione pubblica ridotta, non una seconda verità. Se il
 * canone cambia, si corregge qui a mano — non c’è generazione automatica.
 */

export const sito = {
  nome: "L’Isola dei Tre Venti",
  nomeBreve: "Isola",
  titolo: "L’Isola dei Tre Venti — saga illustrata per bambini",
  descrizione:
    "Su un’isola in mezzo al mare soffiano tre venti. Uno separa le cose, uno le unisce, uno le capovolge. Dodici storie illustrate da leggere ad alta voce, dai 3 ai 6 anni.",
  autore: "Beatrice Mercuri",
  editore: "Spirale Editrice",
  coloreTema: "#faf6f0",
} as const;

/** Frase della quarta di copertina: è la promessa del mondo, non un claim inventato. */
export const promessa =
  "Su un’isola in mezzo al mare soffiano tre venti.";

export type Vento = {
  id: string;
  nome: string;
  cosaFa: string;
  stagione: string;
  /** Il colore pieno: filetti, bordi, punti. Decorazione. */
  colore: string;
  /**
   * Il colore quando il vento diventa parola scritta. Per due venti su tre
   * coincide col pieno; l’arancio dei punti, come testo, non arriva a 4.5:1
   * sulla carta e va scurito. Vedi base.css, --mulinello-testo.
   */
  coloreTesto: string;
};

/**
 * I tre venti del titolo. I colori sono quelli dei tre punti stampati sulla
 * quarta di copertina del Volume 1, campionati dal file di stampa. L’accoppiata
 * vento→colore è una convenzione di questo sito (segue le stagioni dei cicli):
 * il canone nomina i venti ma non assegna loro un colore.
 */
export const venti: Vento[] = [
  {
    id: "taglio",
    nome: "Vento Taglio",
    cosaFa: "Separa le cose. Fa vedere dove finisce una cosa e dove ne comincia un’altra.",
    stagione: "Inverno",
    colore: "var(--taglio)",
    coloreTesto: "var(--taglio)",
  },
  {
    id: "intreccio",
    nome: "Vento Intreccio",
    cosaFa: "Unisce le cose. Tutto si riprende, tutto si lega.",
    stagione: "Primavera",
    colore: "var(--intreccio)",
    coloreTesto: "var(--intreccio)",
  },
  {
    id: "mulinello",
    nome: "Vento Mulinello",
    cosaFa: "Capovolge le cose. Girano, si ribaltano, cambiano.",
    stagione: "Estate",
    colore: "var(--mulinello)",
    coloreTesto: "var(--mulinello-testo)",
  },
];

export type Storia = {
  sid: string;
  titolo: string;
  riga: string;
  ciclo: "A" | "B" | "C" | "D";
};

/**
 * Le dodici storie. Titolo e una riga soltanto: il testo dei racconti sta nei
 * libri, non qui. Le righe descrivono l’apertura o il luogo, mai il finale.
 */
export const storie: Storia[] = [
  {
    sid: "s01",
    titolo: "La Nebbia delle Montagne Gemelle",
    riga: "Il forno all’alba, la salita ai Pascoli Alti, e una nebbia che arriva prima di loro.",
    ciclo: "A",
  },
  {
    sid: "s02",
    titolo: "Il Riflesso nella Pozza",
    riga: "Sulla pozza dei pastori il ghiaccio si è appena sciolto, e l’acqua restituisce qualcosa.",
    ciclo: "A",
  },
  {
    sid: "s03",
    titolo: "Il Pallone oltre la Foresta",
    riga: "Il pallone finisce oltre il margine della Foresta. Dalla Foresta esce Rovo.",
    ciclo: "A",
  },
  {
    sid: "s04",
    titolo: "Le Radici che Parlano",
    riga: "Noah segue una farfalla oltre il punto in cui gli alberi diventano tutti uguali.",
    ciclo: "B",
  },
  {
    sid: "s05",
    titolo: "Il Ponte di Rami",
    riga: "La piena ha portato via il tronco che faceva da ponte. Da lontano, un tok-tok-tok.",
    ciclo: "B",
  },
  {
    sid: "s06",
    titolo: "Il Dono per Mèmolo",
    riga: "Un giro dell’isola intero per trovare un regalo che non si compra.",
    ciclo: "B",
  },
  {
    sid: "s07",
    titolo: "La Zattera dei Tre Rametti",
    riga: "Dal guado di pietre piatte fino alla Bocca, una giornata intera dietro una zattera.",
    ciclo: "C",
  },
  {
    sid: "s08",
    titolo: "L’Albero che Cadde di Sera",
    riga: "L’albero della piazza cade di sera, e al mattino la piazza non è più la stessa.",
    ciclo: "C",
  },
  {
    sid: "s09",
    titolo: "Quel Pomeriggio di Ottobre",
    riga: "Al Forno si sa del compleanno prima del festeggiato.",
    ciclo: "C",
  },
  {
    sid: "s10",
    titolo: "La Notte senza Luna",
    riga: "Una notte senza luna, e un’alba che aspetta al Pontile.",
    ciclo: "D",
  },
  {
    sid: "s11",
    titolo: "La Festa del Raccolto",
    riga: "Tutta l’isola nella stessa piazza, nello stesso pomeriggio.",
    ciclo: "D",
  },
  {
    sid: "s12",
    titolo: "Quando i Tre Venti Suonano Insieme",
    riga: "Sulla Roccia Alta si vede l’isola intera, e i tre venti arrivano insieme.",
    ciclo: "D",
  },
];

export type Volume = {
  numero: 1 | 2 | 3 | 4;
  ciclo: "A" | "B" | "C" | "D";
  /** Sottotitolo stampato in copertina. Esiste solo per il Volume 1. */
  sottotitolo: string | null;
  stagione: string;
  vento: string;
  stato: "stampato" | "in preparazione";
};

/** Quattro volumi, tre storie ciascuno, uno per stagione. */
export const volumi: Volume[] = [
  {
    numero: 1,
    ciclo: "A",
    sottotitolo: "Il vento che taglia",
    stagione: "Inverno",
    vento: "Vento Taglio",
    stato: "stampato",
  },
  {
    numero: 2,
    ciclo: "B",
    sottotitolo: null,
    stagione: "Primavera",
    vento: "Vento Intreccio",
    stato: "in preparazione",
  },
  {
    numero: 3,
    ciclo: "C",
    sottotitolo: null,
    stagione: "Estate",
    vento: "Vento Mulinello",
    stato: "in preparazione",
  },
  {
    numero: 4,
    ciclo: "D",
    sottotitolo: null,
    stagione: "Autunno",
    vento: "Tutti e tre insieme",
    stato: "in preparazione",
  },
];

export type Gruppo = "fratelli" | "abitanti" | "mestieri" | "cuccioli";

export type Personaggio = {
  id: string;
  nome: string;
  specie: string;
  riga: string;
  gruppo: Gruppo;
};

export const gruppi: { id: Gruppo; titolo: string; intro: string }[] = [
  {
    id: "fratelli",
    titolo: "I tre fratelli",
    intro: "Diversi in tutto. È il motivo per cui, insieme, funzionano.",
  },
  {
    id: "abitanti",
    titolo: "Gli abitanti",
    intro: "Animali che parlano, hanno una casa e un mestiere, e non sono lì per insegnare niente.",
  },
  {
    id: "mestieri",
    titolo: "Chi tiene in piedi l’isola",
    intro: "Le erbe, il legno, le stagioni, il pesce. Il lavoro di tutti i giorni.",
  },
  {
    id: "cuccioli",
    titolo: "I cuccioli della scuola",
    intro: "Cinque, e nessuno somiglia a un altro.",
  },
];

export const personaggi: Personaggio[] = [
  {
    id: "gabriel",
    nome: "Gabriel",
    specie: "il maggiore",
    riga: "Guarda, misura, decide. Anche quando decidere costa.",
    gruppo: "fratelli",
  },
  {
    id: "elias",
    nome: "Elias",
    specie: "quello di mezzo",
    riga: "Parla con tutti, e le mani gli servono per capire.",
    gruppo: "fratelli",
  },
  {
    id: "noah",
    nome: "Noah",
    specie: "il più piccolo",
    riga: "Trova quello che gli altri hanno oltrepassato senza vederlo.",
    gruppo: "fratelli",
  },
  {
    id: "fiamma",
    nome: "Fiamma",
    specie: "volpe rossa, fornaia",
    riga: "Il primo posto dell’isola dove al mattino c’è luce calda.",
    gruppo: "abitanti",
  },
  {
    id: "bartolo",
    nome: "Bartolo",
    specie: "tartaruga di mare, molto vecchia",
    riga: "Sta al Pontile. Vicino a lui il tempo si allarga.",
    gruppo: "abitanti",
  },
  {
    id: "stria",
    nome: "Stria",
    specie: "airone cenerino, maestra",
    riga: "Autorità calma: non ha mai avuto bisogno di alzare la voce.",
    gruppo: "abitanti",
  },
  {
    id: "memolo",
    nome: "Mèmolo",
    specie: "riccio",
    riga: "Casa tonda sulla piazza. Cambia il tono di una giornata con una battuta.",
    gruppo: "abitanti",
  },
  {
    id: "grunto",
    nome: "Grunto",
    specie: "stambecco, vecchissimo",
    riga: "Vive sulle Montagne Gemelle. Ha visto l’isola prima dei venti.",
    gruppo: "abitanti",
  },
  {
    id: "rovo",
    nome: "Rovo",
    specie: "tasso",
    riga: "Sembra scontroso. È una resistenza che protegge.",
    gruppo: "abitanti",
  },
  {
    id: "salvia",
    nome: "Salvia",
    specie: "lepre",
    riga: "Conosce le erbe. Cura senza fare prediche.",
    gruppo: "mestieri",
  },
  {
    id: "nodo",
    nome: "Nodo",
    specie: "picchio",
    riga: "Aggiusta. Lo senti lavorare prima di vederlo.",
    gruppo: "mestieri",
  },
  {
    id: "zolla",
    nome: "Zolla",
    specie: "scoiattolo grigio, anziano",
    riga: "Tiene il conto delle stagioni e non spreca niente.",
    gruppo: "mestieri",
  },
  {
    id: "amo",
    nome: "Amo",
    specie: "cormorano",
    riga: "Pesca. Insegna la pazienza standosene zitto.",
    gruppo: "mestieri",
  },
  {
    id: "bru",
    nome: "Bru",
    specie: "tassino",
    riga: "Sta vicino senza farsi notare.",
    gruppo: "cuccioli",
  },
  {
    id: "pun",
    nome: "Pun",
    specie: "riccino",
    riga: "Si ricorda sempre dove vanno a finire le cose.",
    gruppo: "cuccioli",
  },
  {
    id: "cardo",
    nome: "Cardo",
    specie: "lupacchiotto",
    riga: "Quello che dice la cosa scomoda.",
    gruppo: "cuccioli",
  },
  {
    id: "liu",
    nome: "Liù",
    specie: "libellulina",
    riga: "Arriva sempre un momento prima delle notizie.",
    gruppo: "cuccioli",
  },
  {
    id: "toba",
    nome: "Toba",
    specie: "tartarughina",
    riga: "Fa la domanda che nessuno aveva pensato di fare.",
    gruppo: "cuccioli",
  },
];

export type Luogo = { id: string; nome: string; riga: string };

export const luoghi: Luogo[] = [
  {
    id: "villaggio",
    nome: "Il Villaggio",
    riga: "La piazza, l’Albero Vecchio, il mercato di mezzogiorno. Il centro di tutto.",
  },
  {
    id: "quartiere-fuoco",
    nome: "Il quartiere di Fuoco",
    riga: "A est, la Via dell’Alba. Il camino del forno fuma prima che sia giorno.",
  },
  {
    id: "quartiere-aria",
    nome: "Il quartiere d’Aria",
    riga: "A nord, verso i Pascoli Alti e le Montagne Gemelle.",
  },
];

/**
 * Il Volume 1 esiste, è stampato ed è caricato su Amazon: manca solo la data di
 * pubblicazione. Finché quella data non c’è, il sito lo dichiara in arrivo e non
 * espone un link d’acquisto — vedi AGENTS.md, regola 4.
 */
export const libro = {
  volume: 1,
  titolo: "L’Isola dei Tre Venti",
  sottotitolo: "Volume 1 — Il vento che taglia",
  eta: "Dai 3 ai 6 anni",
  storie: ["s01", "s02", "s03"],
  descrizione:
    "In questo primo volume soffia il Vento Taglio, quello che fa vedere dove finisce una cosa e dove ne comincia un’altra. Tre storie da leggere ad alta voce, una per sera.",
  stato: "in arrivo" as const,
} as const;

export type Canale = {
  id: string;
  nome: string;
  dove: string;
  url: string | null;
};

/**
 * Canali esterni. `url: null` significa che il canale non esiste ancora: la UI
 * lo mostra come "in arrivo" e non come collegamento. Nessun link finto.
 */
export const canali: Canale[] = [
  { id: "amazon", nome: "Il libro", dove: "Amazon", url: null },
  { id: "instagram", nome: "Le giornate dell’isola", dove: "Instagram", url: null },
  { id: "tiktok", nome: "Le storie in voce", dove: "TikTok", url: null },
];

export const storiePerCiclo = (ciclo: Volume["ciclo"]) =>
  storie.filter((s) => s.ciclo === ciclo);

export const personaggiPerGruppo = (gruppo: Gruppo) =>
  personaggi.filter((p) => p.gruppo === gruppo);

export const getStoria = (sid: string) => {
  const s = storie.find((x) => x.sid === sid);
  if (!s) throw new Error(`storia sconosciuta: ${sid}`);
  return s;
};
