/**
 * Genera le icone PWA dal rosone dei tre venti.
 *
 * Il rosone è il marchio ridotto della saga (piuma, onda, foglie intorno a una
 * spirale). Arriva dal canone con lo sfondo trasparente: qui viene appoggiato
 * sulla carta, perché un PNG trasparente su una schermata home scura sparisce.
 *
 *   npm run icons
 */

import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const SORGENTE = new URL("../public/media/emblema/rosone@2x.webp", import.meta.url).pathname;
const DESTINAZIONE = new URL("../public/icons", import.meta.url).pathname;

const CARTA = { r: 250, g: 246, b: 240, alpha: 1 };

/** `any`: il rosone respira ai bordi. `maskable`: sta dentro la zona sicura del 40%. */
const ICONE = [
  { file: "icon-192.png", lato: 192, margine: 0.1 },
  { file: "icon-512.png", lato: 512, margine: 0.1 },
  { file: "apple-touch-icon.png", lato: 180, margine: 0.12 },
  { file: "maskable-512.png", lato: 512, margine: 0.22 },
];

await mkdir(DESTINAZIONE, { recursive: true });

for (const { file, lato, margine } of ICONE) {
  const interno = Math.round(lato * (1 - margine * 2));
  const segno = await sharp(SORGENTE)
    .resize(interno, interno, { fit: "contain", background: { ...CARTA, alpha: 0 } })
    .toBuffer();

  await sharp({
    create: { width: lato, height: lato, channels: 4, background: CARTA },
  })
    .composite([{ input: segno, gravity: "center" }])
    .png()
    .toFile(`${DESTINAZIONE}/${file}`);

  console.log(`${file} ${lato}×${lato}`);
}
