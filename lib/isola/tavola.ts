/**
 * La tavolozza della tavola.
 *
 * La regola 11 dice che chi aggiunge un colore dice da dove viene: eccolo detto
 * qui, una riga per colore. Nessuno è stato scelto a occhio — sono **campionati
 * da `public/media/isola/mappa.webp`**, la stessa isola stampata sulla quarta di
 * copertina, alle coordinate scritte accanto (media su un quadratino di sette
 * pixel, per non prendere un pixel di rumore). Dove serviva una luce o un'ombra
 * che sulla tavola non c'era da prendere, la voce dichiara da quale campione è
 * schiarita o scurita.
 *
 * Questi colori **non allargano la palette del sito**: vivono dentro il disegno
 * dell'isola e non ne escono. I tre venti restano i tre punti della copertina, e
 * i token del sito restano quelli di `app/styles/base.css`. Chi ne vuole uno per
 * un bottone o per un titolo ha sbagliato file.
 *
 * Perché stiano qui e non in un foglio di stile: il disegno si serve da
 * `/isola.svg`, un'immagine a sé che il browser mette in cache e che non può
 * leggere il CSS della pagina. La tavolozza le viaggia dentro, in un `<style>`
 * che nasce da questa mappa — una sorgente sola, e la pagina resta leggera.
 *
 * Chi ritocca un valore lo ricampiona dalla tavola invece di aggiustarlo a naso,
 * e sposta la coordinata scritta nel commento se prende un altro punto.
 */

export const TAVOLA: Record<string, { colore: string; da: string }> = {

  /* Il mare */
  "tav-mare-fondo": { colore: "#0a3f5b", da: "(60,1420) l'acqua profonda a sud-ovest" },
  "tav-mare": { colore: "#487b7b", da: "(40,700) il mare aperto a ovest" },
  "tav-mare-chiaro": { colore: "#77a3a1", da: "(960,400) il mare a levante, più chiaro" },
  "tav-secca": { colore: "#6b9a9a", da: "(928,470) la secca lungo la costa est" },
  "tav-schiuma": { colore: "#dfeeea", da: "--tav-secca schiarito: la risacca, che sulla tavola è quasi carta" },

  /* Le acque dolci */
  "tav-fiume": { colore: "#859787", da: "(530,1240) la Bocca, appena prima del mare" },
  "tav-fiume-chiaro": { colore: "#c2cdb4", da: "--tav-fiume-chiaro schiarito dalla pozza (432,386): il filo di corrente" },
  "tav-fiume-riva": { colore: "#5f6b4e", da: "--tav-fiume scurito: la riva bagnata" },

  /* La roccia */
  "tav-roccia-luce": { colore: "#c2ad87", da: "(600,90) la cima illuminata della gemella di levante" },
  "tav-roccia": { colore: "#a18d67", da: "(470,180) la parete, a mezza luce" },
  "tav-roccia-ombra": { colore: "#4c5041", da: "(350,170) la parete in ombra" },

  /* L'erba */
  "tav-prato-chiaro": { colore: "#aa9748", da: "(620,560) il prato dentro l'anello, in pieno sole" },
  "tav-prato": { colore: "#9e9244", da: "(410,520) i Pascoli Alti" },
  "tav-prato-scuro": { colore: "#887d37", da: "(700,1000) il prato all'ombra, verso il fiume" },

  /* Il fogliame */
  "tav-bosco": { colore: "#4e532b", da: "(200,620) la Foresta Intrecciata" },
  "tav-bosco-luce": { colore: "#84783c", da: "(590,990) schiarito: una chioma in piena luce" },
  "tav-bosco-ombra": { colore: "#2f3419", da: "--tav-bosco scurito: il sottobosco e l'ombra delle chiome" },
  "tav-bosco-secco": { colore: "#6b582b", da: "(828,700) i cipressi del quartiere di Fuoco" },
  "tav-fogliame-luce": { colore: "#a3a25c", da: "--tav-bosco-luce schiarito: il colmo dell'Albero Vecchio" },

  /* La terra secca del quartiere di Fuoco */
  "tav-secco": { colore: "#bf9f68", da: "(770,690) la terra battuta attorno alle case" },
  "tav-secco-chiaro": { colore: "#c89848", da: "(790,640) la radura del forno" },

  /* La sabbia */
  "tav-sabbia": { colore: "#e1c793", da: "(430,1300) la spiaggia" },
  "tav-sabbia-chiara": { colore: "#f0dcb4", da: "--tav-sabbia schiarita: la sabbia asciutta più in alto" },

  /* Il costruito */
  "tav-tetto": { colore: "#a77d48", da: "(556,858) un tetto del villaggio" },
  "tav-tetto-scuro": { colore: "#7d5a30", da: "--tav-tetto scurito: la falda in ombra, il legno del pontile" },
  "tav-muro": { colore: "#857250", da: "(470,870) il muro di una casa" },
  "tav-muro-ombra": { colore: "#5f5238", da: "--tav-muro scurito" },
  "tav-tronco": { colore: "#6b5233", da: "--tav-tetto-scuro scurito: la corteccia dell'Albero Vecchio" },

  /* I sentieri e i campi */
  "tav-sentiero": { colore: "#a18a44", da: "(516,520) la Via che Sale, dove attraversa il prato" },
  "tav-sentiero-ombra": { colore: "#6f5f2c", da: "--tav-sentiero scurito: il solco ai bordi" },
  "tav-orto": { colore: "#786b2e", da: "(232,812) gli Orti del Cerchio" },
  "tav-orto-riga": { colore: "#5a5122", da: "--tav-orto scurito: i solchi fra un giro e l'altro" },
  "tav-orto-fiore": { colore: "#d8b23f", da: "--tav-orto schiarito: le colture in fiore" },

  /* Il tratto */
  "tav-inchiostro": { colore: "#3a3222", da: "--tav-roccia-ombra scurito: il segno di contorno della tavola" },
};

/**
 * La tavolozza come foglio di stile, da mettere dentro l'SVG.
 *
 * I commenti ci restano: chi apre `/isola.svg` e si chiede da dove venga un
 * verde lo legge lì, senza dover risalire al codice che l'ha disegnato.
 */
export const stileTavola = () =>
  `.isola-disegnata{${Object.entries(TAVOLA)
    .map(([nome, { colore, da }]) => `--${nome}:${colore};/* ${da} */`)
    .join("")}}`;
