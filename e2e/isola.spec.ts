import { gzipSync } from "node:zlib";

import { expect, test } from "@playwright/test";

/*
 * L'isola disegnata.
 *
 * Il disegno non si può controllare guardandolo — nessun test sa dire se una
 * montagna è bella. Si controlla quello che si può rompere senza accorgersene:
 * che l'immagine esista e sia davvero un vettoriale, che si porti dentro la
 * tavolozza (viaggia da sola, non legge il CSS della pagina), che stia nel
 * riquadro in cui cadono i segni della mappa, e che non sia ingrassata di
 * nascosto fino a pesare come la fotografia che ha sostituito.
 */

test.describe("l'isola disegnata", () => {
  test("è un vettoriale servito a parte, con la sua tavolozza dentro", async ({ request }) => {
    const risposta = await request.get("/isola.svg");
    expect(risposta.ok()).toBe(true);
    expect(risposta.headers()["content-type"]).toContain("image/svg+xml");

    const svg = await risposta.text();

    // Il riquadro è quello: i segni della mappa ci cadono sopra per coordinate.
    expect(svg).toContain('viewBox="0 0 1000 1500"');

    // La tavolozza viaggia dentro l'immagine, con scritto da dove viene.
    expect(svg).toContain("--tav-mare");
    expect(svg).toMatch(/--tav-prato:#[0-9a-f]{6}/);

    // Un'immagine ha un nome accessibile anche quando è un disegno.
    expect(svg).toContain("Montagne Gemelle");
  });

  test("pesa meno della tavola dipinta che ha sostituito", async ({ request }) => {
    const svg = await (await request.get("/isola.svg")).text();
    const dipinta = (await (await request.get("/media/isola/mappa.webp")).body()).byteLength;

    /*
     * Il confronto si fa a parità di condizioni: il vettoriale viaggia
     * compresso, la webp no — è già un formato compresso. Il numero che conta
     * per chi scarica la mappa è quello, e il disegno deve restarci sotto di
     * parecchio, altrimenti tanto valeva la fotografia.
     */
    const compresso = gzipSync(Buffer.from(svg), { level: 9 }).byteLength;

    expect(compresso).toBeLessThan(dipinta / 4);
  });

  test("la mappa mostra il disegno, e i segni ci cadono sopra", async ({ page }) => {
    await page.goto("/mappa");

    const disegno = page.locator(".mappa-interattiva img");
    await expect(disegno).toHaveAttribute("src", /isola\.svg/);

    // Un'immagine rotta passerebbe inosservata: si chiede al browser se l'ha
    // davvero decodificata.
    await disegno.scrollIntoViewIfNeeded();
    await expect(async () => {
      const caricata = await disegno.evaluate(
        (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
      );
      expect(caricata).toBe(true);
    }).toPass();

    // Lo strato dei segni condivide il riquadro del disegno: se qualcuno cambia
    // l'uno senza l'altro, le etichette finiscono in mare.
    const segni = page.locator(".mappa-segni");
    await expect(segni).toHaveAttribute("viewBox", "0 0 1000 1500");

    const riquadroDisegno = await disegno.boundingBox();
    const riquadroSegni = await segni.boundingBox();
    expect(Math.abs(riquadroDisegno!.width - riquadroSegni!.width)).toBeLessThan(2);
    expect(Math.abs(riquadroDisegno!.height - riquadroSegni!.height)).toBeLessThan(2);
  });

  test("la tavola dipinta resta sulla pagina, sotto la mappa", async ({ page }) => {
    await page.goto("/mappa");

    const tavola = page.locator(".mappa-tavola-dipinta img");
    await expect(tavola).toHaveAttribute("src", /mappa\.webp/);
    await expect(page.locator(".mappa-tavola-dipinta figcaption")).toContainText("stampata nel libro");
  });
});
