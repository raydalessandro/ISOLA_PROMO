/**
 * Integrità dei binari in public/media e public/icons.
 *
 * Un'immagine troncata a metà upload supera build, lint, typecheck e test
 * senza fare rumore: il browser mostra mezza illustrazione e nessuno se ne
 * accorge finché non è online. Ogni formato dichiara nel proprio header quanto
 * è lungo o quanto è grande: qui si confronta la dichiarazione col contenuto.
 *
 *   npm run check:media
 */

import { readFile, readdir, stat } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const RADICE = new URL("../public", import.meta.url).pathname;
const CARTELLE = ["media", "icons"];

const problemi = [];
let verificati = 0;

/* --- WebP ----------------------------------------------------------------- */

function controllaWebp(nome, buf) {
  if (buf.length < 12) {
    problemi.push(`${nome}: file troppo corto per essere un WebP`);
    return;
  }
  if (buf.toString("latin1", 0, 4) !== "RIFF" || buf.toString("latin1", 8, 12) !== "WEBP") {
    problemi.push(`${nome}: non è un WebP (header RIFF/WEBP assente)`);
    return;
  }

  // Il campo RIFF dichiara la lunghezza di tutto ciò che segue i primi 8 byte.
  const dichiarati = buf.readUInt32LE(4) + 8;
  if (dichiarati > buf.length) {
    problemi.push(
      `${nome}: troncato — l'header dichiara ${dichiarati} byte, il file ne ha ${buf.length}`,
    );
    return;
  }

  // L'ultimo chunk deve chiudersi dentro il file: se manca la coda, l'immagine
  // si apre ma si vede a metà.
  let cursore = 12;
  let ultimo = null;
  while (cursore + 8 <= dichiarati) {
    const tipo = buf.toString("latin1", cursore, cursore + 4);
    const lunghezza = buf.readUInt32LE(cursore + 4);
    const fine = cursore + 8 + lunghezza + (lunghezza % 2);
    if (fine > buf.length) {
      problemi.push(`${nome}: chunk ${tipo} incompleto, l'immagine è tagliata`);
      return;
    }
    ultimo = tipo;
    cursore = fine;
  }

  if (!ultimo) problemi.push(`${nome}: nessun chunk WebP leggibile`);
}

/* --- PNG ------------------------------------------------------------------ */

const FIRMA_PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function controllaPng(nome, buf) {
  if (buf.length < 8 || !buf.subarray(0, 8).equals(FIRMA_PNG)) {
    problemi.push(`${nome}: firma PNG assente`);
    return;
  }
  // Un PNG completo finisce con il chunk IEND. Se manca, è stato troncato.
  if (buf.toString("latin1", buf.length - 8, buf.length - 4) !== "IEND") {
    problemi.push(`${nome}: manca il chunk IEND finale, il file è troncato`);
  }
}

/* --- percorso ------------------------------------------------------------- */

async function percorri(cartella) {
  let voci;
  try {
    voci = await readdir(cartella, { withFileTypes: true });
  } catch {
    return; // cartella assente: non è un errore di integrità
  }

  for (const voce of voci) {
    const percorso = join(cartella, voce.name);
    if (voce.isDirectory()) {
      await percorri(percorso);
      continue;
    }

    const nome = relative(RADICE, percorso);
    const estensione = extname(voce.name).toLowerCase();
    const info = await stat(percorso);

    if (info.size === 0) {
      problemi.push(`${nome}: file vuoto`);
      continue;
    }

    if (estensione === ".webp") {
      controllaWebp(nome, await readFile(percorso));
      verificati += 1;
    } else if (estensione === ".png") {
      controllaPng(nome, await readFile(percorso));
      verificati += 1;
    }
  }
}

for (const cartella of CARTELLE) await percorri(join(RADICE, cartella));

if (verificati === 0) {
  console.error("Nessun binario trovato in public/media o public/icons.");
  process.exit(1);
}

if (problemi.length > 0) {
  console.error(`Integrità dei binari: ${problemi.length} problemi\n`);
  for (const problema of problemi) console.error(`  ${problema}`);
  process.exit(1);
}

console.log(`Integrità dei binari: ${verificati} file verificati, tutti integri.`);
