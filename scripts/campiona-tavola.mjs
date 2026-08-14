/**
 * Controlla che la tavolozza del disegno venga davvero dalla tavola dipinta.
 *
 * `lib/isola/tavola.ts` dichiara, per ogni colore, da dove l'ha preso: o una
 * coordinata sulla tavola — `(430,1300) la spiaggia` — o un altro colore da cui
 * è schiarito o scurito. Questo script legge quelle dichiarazioni, va a
 * ricampionare `public/media/isola/mappa.webp` nei punti indicati e protesta se
 * il valore scritto non è quello che c'è sulla tavola.
 *
 * Serve perché la regola 11 non resti una buona intenzione: un colore ritoccato
 * a naso, "che così sta meglio", qui si vede subito. I colori dichiarati come
 * schiariti o scuriti non si controllano — di quelli risponde chi li ha scelti,
 * e la voce dice da quale campione partono.
 *
 *   node scripts/campiona-tavola.mjs           controlla
 *   node scripts/campiona-tavola.mjs --scrivi  riallinea i valori alla tavola
 */

import { readFile, writeFile } from "node:fs/promises";

import sharp from "sharp";

const TAVOLA = "lib/isola/tavola.ts";
const DIPINTO = "public/media/isola/mappa.webp";

/** Media su un quadratino di sette pixel: un pixel solo sarebbe rumore. */
const RAGGIO = 3;

/** Quanto può scostarsi un canale prima che sia un colore diverso. */
const TOLLERANZA = 6;

const { data, info } = await sharp(DIPINTO).raw().toBuffer({ resolveWithObject: true });

const campiona = (x, y) => {
  const somma = [0, 0, 0];
  let quanti = 0;

  for (let j = y - RAGGIO; j <= y + RAGGIO; j++) {
    for (let i = x - RAGGIO; i <= x + RAGGIO; i++) {
      if (i < 0 || j < 0 || i >= info.width || j >= info.height) continue;
      const k = (j * info.width + i) * info.channels;
      somma[0] += data[k];
      somma[1] += data[k + 1];
      somma[2] += data[k + 2];
      quanti++;
    }
  }

  return `#${somma.map((v) => Math.round(v / quanti).toString(16).padStart(2, "0")).join("")}`;
};

const canali = (esa) => [1, 3, 5].map((i) => parseInt(esa.slice(i, i + 2), 16));

const sorgente = await readFile(TAVOLA, "utf8");
const voci = [...sorgente.matchAll(/"(tav-[a-z-]+)": \{ colore: "(#[0-9a-f]{6})", da: "\((\d+),(\d+)\)/g)];

const scrivi = process.argv.includes("--scrivi");
let aggiornato = sorgente;
const storti = [];

for (const [intero, nome, dichiarato, x, y] of voci) {
  const vero = campiona(Number(x), Number(y));
  const scarto = Math.max(...canali(dichiarato).map((v, i) => Math.abs(v - canali(vero)[i])));

  if (scarto <= TOLLERANZA) continue;

  storti.push({ nome, dichiarato, vero, scarto });
  if (scrivi) aggiornato = aggiornato.replace(intero, intero.replace(dichiarato, vero));
}

if (scrivi && storti.length > 0) {
  await writeFile(TAVOLA, aggiornato);
  console.log(`Riallineati ${storti.length} colori alla tavola.`);
  for (const s of storti) console.log(`  ${s.nome}: ${s.dichiarato} → ${s.vero}`);
  process.exit(0);
}

console.log(`Tavolozza: ${voci.length} colori campionati dalla tavola, ${storti.length} fuori posto.`);

if (storti.length > 0) {
  for (const s of storti) {
    console.error(`  ${s.nome} dichiara ${s.dichiarato}, ma alla sua coordinata la tavola dice ${s.vero} (scarto ${s.scarto}).`);
  }
  console.error("\nO si ricampiona il colore, o si sposta la coordinata: `node scripts/campiona-tavola.mjs --scrivi`.");
  process.exit(1);
}
