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

export type Luogo = {
  id: string;
  nome: string;
  riga: string;
  /** Il villaggio sta dentro l’anello del Fiume; gli altri quattro sono i quartieri. */
  tipo: "centro" | "quartiere";
};

/*
 * Il centro e i quattro quartieri, in ordine di bussola a partire da nord.
 * Le direzioni sono quelle canoniche: nord in alto, est dove sorge il sole,
 * sud dove la Bocca sbocca nel mare, ovest verso gli Orti.
 *
 * Attenzione alle immagini di Acqua e Terra: il canone non ha una tavola
 * d’atlante per questi due quartieri, quindi `public/media/luoghi/` monta la
 * panoramica canonica di un luogo che ci sta dentro — la Spiaggia delle
 * Conchiglie per l’Acqua, gli Orti del Cerchio per la Terra. Sono segnaposto
 * dichiarati, in attesa delle tavole in produzione: quando arrivano si
 * sostituiscono i due file e questa nota si toglie.
 */
export const luoghi: Luogo[] = [
  {
    id: "villaggio",
    nome: "Il Villaggio",
    riga: "La piazza, l’Albero Vecchio, il mercato di mezzogiorno. Il centro di tutto.",
    tipo: "centro",
  },
  {
    id: "quartiere-aria",
    nome: "Il quartiere d’Aria",
    riga: "A nord, verso i Pascoli Alti e le Montagne Gemelle.",
    tipo: "quartiere",
  },
  {
    id: "quartiere-fuoco",
    nome: "Il quartiere di Fuoco",
    riga: "A est, la Via dell’Alba. Il camino del forno fuma prima che sia giorno.",
    tipo: "quartiere",
  },
  {
    id: "quartiere-acqua",
    nome: "Il quartiere d’Acqua",
    riga: "A sud, dove il Fiume incontra il mare: il Pontile, la Bocca, la Spiaggia delle Conchiglie.",
    tipo: "quartiere",
  },
  {
    id: "quartiere-terra",
    nome: "Il quartiere di Terra",
    riga: "A ovest, gli Orti del Cerchio e poi la Foresta Intrecciata. I campi ripetono i cerchi del Fiume.",
    tipo: "quartiere",
  },
];

export const luoghiPerTipo = (tipo: Luogo["tipo"]) =>
  luoghi.filter((l) => l.tipo === tipo);

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

/* ------------------------------------------------------------------------ */

export type Giornata = {
  /** Nome del file in public/media/giornate, senza estensione. */
  file: string;
  didascalia: string;
  /** Proporzioni della sorgente: servono a Next per non far saltare il layout. */
  larghezza: number;
  altezza: number;
};

export type SetGiornate = {
  id: string;
  titolo: string;
  intro: string;
  immagini: Giornata[];
};

/*
 * Le quaranta illustrazioni social, in due set.
 *
 * Non sono nei libri: sono momenti laterali, disegnati apposta per raccontare
 * l'isola fuori dalla pagina. Le didascalie vengono dai brief che le hanno
 * generate (20_BRIEF_PRONTI.md e 20_BRIEF_FOCUS_V2.md), quindi dicono quello
 * che l'immagine mostra davvero.
 *
 * Sorgenti: branch `immaginixsito` di isola_i3v_visual, cartelle
 * assets/social_isola_01_20 e assets/social_isola_v2_01_20.
 */
export const giornate: SetGiornate[] = [
  {
    id: "insieme",
    titolo: "I tre fratelli e l’isola",
    intro:
      "Venti momenti in cui i fratelli incontrano chi ci vive: un ponte da provare, un nodo da fare, una fila di semi storta.",
    immagini: [
      { file: "s1-01-ponte-rami-post", didascalia: "I tre provano un ponte di rami, sul ruscello della Foresta Intrecciata.", larghezza: 1632, altezza: 2176 },
      { file: "s1-02-braccialetto-carousel", didascalia: "Noah lascia nella mano di Gabriel un braccialetto di canapa, rametti e una castagna.", larghezza: 1920, altezza: 1920 },
      { file: "s1-03-lanterna-story", didascalia: "Elias vela la lanterna; Gabriel trova la mano di Noah nel buio.", larghezza: 1440, altezza: 2560 },
      { file: "s1-04-zattera-cover", didascalia: "Una zattera di tre rametti passa fra le pietre piatte del guado.", larghezza: 2560, altezza: 1440 },
      { file: "s1-05-radice-reel-cover", didascalia: "Elias batte un ritmo su una radice; oltre le felci, Noah lo restituisce.", larghezza: 1664, altezza: 2080 },
      { file: "s1-06-fiamma-forno-post", didascalia: "Mani di farina, nel laboratorio del forno di Fiamma.", larghezza: 1632, altezza: 2176 },
      { file: "s1-07-stria-scuola-carousel", didascalia: "Tre ciottoli, un rametto e l’attenzione calma di Stria.", larghezza: 1920, altezza: 1920 },
      { file: "s1-08-bartolo-pontile-story", didascalia: "Il nodo del pontile. Bartolo aspetta e non risolve al posto loro.", larghezza: 1440, altezza: 2560 },
      { file: "s1-09-memolo-pun-reel-cover", didascalia: "Nel cortile di Mèmolo, Pun ha notato una cosa piccolissima sotto una foglia.", larghezza: 1664, altezza: 2080 },
      { file: "s1-10-grunto-roccia-cover", didascalia: "Sul margine della Roccia Alta si sceglie la linea sicura. Grunto sta a distanza.", larghezza: 2560, altezza: 1440 },
      { file: "s1-11-rovo-bru-post", didascalia: "Le impronte di Rovo e Bru nel terreno umido, al margine della Foresta.", larghezza: 1632, altezza: 2176 },
      { file: "s1-12-nodo-carousel", didascalia: "Nella bottega di Nodo il nodo si trova con le mani, non si spiega.", larghezza: 1920, altezza: 1920 },
      { file: "s1-13-salvia-story", didascalia: "Salvia raccoglie una foglia che scende, sul sentiero verso gli Orti.", larghezza: 1440, altezza: 2560 },
      { file: "s1-14-zolla-cover", didascalia: "Una fila di semi storta, negli Orti del Cerchio. Zolla la fa diventare lavoro.", larghezza: 2560, altezza: 1440 },
      { file: "s1-15-amo-reel-cover", didascalia: "Una conchiglia all’orecchio, sulla Spiaggia delle Conchiglie. Amo aspetta.", larghezza: 1664, altezza: 2080 },
      { file: "s1-16-cardo-post", didascalia: "Un frutto rotola nella piazza, al margine dell’Albero Vecchio.", larghezza: 1632, altezza: 2176 },
      { file: "s1-17-liu-carousel", didascalia: "Liù ascolta sotto una foglia larga, al bordo del torrente.", larghezza: 1920, altezza: 1920 },
      { file: "s1-18-toba-story", didascalia: "Toba guarda una corrente complicata; Bartolo resta fermo accanto alla barca.", larghezza: 1440, altezza: 2560 },
      { file: "s1-19-mercato-cover", didascalia: "Il mercato del mezzogiorno, dal lato tranquillo della piazza.", larghezza: 2560, altezza: 1440 },
      { file: "s1-20-trio-piazza-reel-cover", didascalia: "Tre direzioni, una panca di pietra. Nessuno guarda la stessa cosa.", larghezza: 1664, altezza: 2080 },
    ],
  },
  {
    id: "uno-alla-volta",
    titolo: "Uno alla volta",
    intro:
      "Venti ritratti ambientati: un abitante per volta, un gesto minimo, il posto dove passa le sue giornate.",
    immagini: [
      { file: "v2-01-gabriel-pietra-post", didascalia: "Gabriel posa un sasso piatto accanto a una fessura della Via che Sale.", larghezza: 1632, altezza: 2176 },
      { file: "v2-02-gabriel-stria-carousel", didascalia: "Una foglia bagnata sulla soglia della scuola, dopo la pioggia.", larghezza: 1920, altezza: 1920 },
      { file: "v2-03-gabriel-grunto-story", didascalia: "Gabriel e Grunto, sullo stesso sentiero alto, ascoltano lo stesso vento.", larghezza: 1440, altezza: 2560 },
      { file: "v2-04-elias-telaio-reel", didascalia: "Elias intreccia canne in un piccolo telaio, al margine degli Orti.", larghezza: 1664, altezza: 2080 },
      { file: "v2-05-elias-nodo-post", didascalia: "Una legatura da rifare, fuori dalla bottega di Nodo.", larghezza: 1632, altezza: 2176 },
      { file: "v2-06-elias-bru-cover", didascalia: "Due rametti biforcuti a confronto, e Bru che guarda il più piccolo.", larghezza: 2560, altezza: 1440 },
      { file: "v2-07-noah-erba-post", didascalia: "Noah segue una formica lungo una fessura nella pietra.", larghezza: 1632, altezza: 2176 },
      { file: "v2-08-noah-fiamma-carousel", didascalia: "Tre briciole su un palmo, nel cortile dietro il forno.", larghezza: 1920, altezza: 1920 },
      { file: "v2-09-noah-toba-story", didascalia: "Noah e Toba guardano la linea dove l’acqua scurisce la sabbia.", larghezza: 1440, altezza: 2560 },
      { file: "v2-10-fiamma-ritratto-reel", didascalia: "Fiamma solleva il telo dalle ciotole dell’impasto, prima che cominci il giorno.", larghezza: 1664, altezza: 2080 },
      { file: "v2-11-bartolo-mattino-cover", didascalia: "Bartolo controlla una cima al pontile, all’alba. La barca è vuota.", larghezza: 2560, altezza: 1440 },
      { file: "v2-12-grunto-sentiero-post", didascalia: "Grunto passa fra l’erba alta, con calma, in un’aria mite.", larghezza: 1632, altezza: 2176 },
      { file: "v2-13-memolo-pun-carousel", didascalia: "La sciarpa storta di Mèmolo si è impigliata; Pun tiene il filo.", larghezza: 1920, altezza: 1920 },
      { file: "v2-14-rovo-bru-story", didascalia: "Rovo e Bru sullo stesso sentiero ombroso, nella stessa direzione.", larghezza: 1440, altezza: 2560 },
      { file: "v2-15-stria-quaderno-reel", didascalia: "Stria aspetta sola sotto la tettoia della scuola.", larghezza: 1664, altezza: 2080 },
      { file: "v2-16-salvia-cesto-post", didascalia: "Salvia divide le foglie in un cesto basso, al margine degli Orti.", larghezza: 1632, altezza: 2176 },
      { file: "v2-17-zolla-orti-cover", didascalia: "Zolla pareggia con due pietre il bordo di un’aiuola, all’alba.", larghezza: 2560, altezza: 1440 },
      { file: "v2-18-amo-riva-carousel", didascalia: "Amo aspetta la risalita dell’acqua, alla Bocca. La cassetta è vuota.", larghezza: 1920, altezza: 1920 },
      { file: "v2-19-cuccioli-muretti-story", didascalia: "Cardo, Liù, Pun e Toba su un muretto basso: quattro ritmi diversi.", larghezza: 1440, altezza: 2560 },
      { file: "v2-20-isola-abitata-cover", didascalia: "La piazza del villaggio, un mattino qualunque, senza i tre fratelli.", larghezza: 2560, altezza: 1440 },
    ],
  },
];

export const totaleGiornate = giornate.reduce((n, s) => n + s.immagini.length, 0);
