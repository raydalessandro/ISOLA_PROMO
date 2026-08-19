import { expect, test } from "@playwright/test";

/*
 * I quartieri: cinque pezzi d'isola, ciascuno con la sua pagina e la sua
 * immagine. Qui si controlla quello che si può rompere senza accorgersene —
 * che l'inquadratura sia quella giusta, che da vicino compaiano gli abitanti e
 * di lontano no, e che i pulsanti della camera restino collegamenti veri anche
 * quando JavaScript non c'è.
 */

const QUARTIERI = [
  { url: "aria", vista: "aria", titolo: "quartiere d’Aria" },
  { url: "fuoco", vista: "fuoco", titolo: "quartiere di Fuoco" },
  { url: "acqua", vista: "acqua", titolo: "quartiere d’Acqua" },
  { url: "terra", vista: "terra", titolo: "quartiere di Terra" },
  { url: "villaggio", vista: "centro", titolo: "Villaggio" },
];

test.describe("le pagine dei quartieri", () => {
  for (const q of QUARTIERI) {
    test(`/mappa/${q.url} mostra il suo pezzo d'isola`, async ({ page }) => {
      await page.goto(`/mappa/${q.url}`);

      await expect(page.getByRole("heading", { level: 1 })).toContainText(q.titolo);

      // L'immagine è quella del quartiere, non l'isola intera ingrandita.
      const disegno = page.locator(".mappa-interattiva img");
      await expect(disegno).toHaveAttribute("src", new RegExp(`isola/${q.vista}\\.svg`));

      // Da ogni quartiere si torna alla mappa e si passa agli altri quattro.
      await expect(page.locator(".quartiere-giro a")).toHaveCount(4);
      await expect(page.locator(".testa-sezione a")).toHaveAttribute("href", "/mappa");
    });
  }

  test("i segni di un quartiere sono quelli che ci cadono dentro, non tutti", async ({ page }) => {
    await page.goto("/mappa/acqua");

    const nomi = await page.locator(".mappa-segno").evaluateAll((segni) =>
      segni.map((s) => s.getAttribute("aria-label") ?? ""),
    );

    expect(nomi.length).toBeGreaterThan(0);
    expect(nomi.join(" ")).toContain("Pontile");
    // Le Montagne Gemelle stanno a nord: nel quartiere d'Acqua non ci sono.
    expect(nomi.join(" ")).not.toContain("Grotta di Grunto");
  });
});

test.describe("chi si vede sulla mappa", () => {
  test("gli abitanti compaiono da vicino e non da lontano", async ({ request }) => {
    const intera = await (await request.get("/isola/intera.svg")).text();
    const acqua = await (await request.get("/isola/acqua.svg")).text();

    /*
     * Sull'isola intera nessuna figura: alla scala del foglio un abitante
     * sarebbe grande come una casa, e sarebbe una bugia sulle distanze.
     */
    expect(intera).not.toContain('class="figura"');
    expect(acqua).toContain('class="figura"');
  });

  test("il disegno di un quartiere non si porta dietro il resto dell'isola", async ({ request }) => {
    const intera = await (await request.get("/isola/intera.svg")).text();
    const fuoco = await (await request.get("/isola/fuoco.svg")).text();

    const alberi = (testo: string) => (testo.match(/<use/g) ?? []).length;

    /*
     * Il conto degli alberi è la prova che il taglio funziona: un quartiere è
     * un sesto del foglio e ne pianta una frazione. Il peso del file scende
     * meno, perché da vicino il disegno ci aggiunge quello che di lontano non
     * c'era — l'erba fitta, i tronchi, gli abitanti — ed è giusto così.
     */
    expect(alberi(fuoco)).toBeLessThan(alberi(intera) / 3);
    expect(fuoco.length).toBeLessThan(intera.length * 0.85);
  });
});

test.describe("la camera sulla mappa", () => {
  test("il primo clic guarda da vicino, il secondo entra nel quartiere", async ({ page }) => {
    await page.goto("/mappa");

    const scena = page.locator(".mappa-scena");
    await expect(scena).toHaveAttribute("style", /--zoom:\s*1/);

    await page.getByRole("link", { name: "Fuoco", exact: true }).click();
    await expect(scena).toHaveAttribute("style", /scale\(/);
    await expect(page).toHaveURL(/\/mappa$/);

    // Da qui si entra: il secondo clic non è più un ingrandimento.
    await page.getByRole("link", { name: "Fuoco", exact: true }).click();
    await expect(page).toHaveURL(/\/mappa\/fuoco$/);
  });

  test("senza JavaScript i pulsanti restano collegamenti che portano da qualche parte", async ({
    browser,
  }) => {
    const contesto = await browser.newContext({ javaScriptEnabled: false });
    const pagina = await contesto.newPage();
    await pagina.goto("/mappa");

    const chip = pagina.getByRole("link", { name: "Terra", exact: true });
    await expect(chip).toHaveAttribute("href", "/mappa/terra");

    // Niente controlli finti: quello che si vede senza JavaScript funziona.
    // "Tutta l'isola" ha senso solo da ingranditi, e infatti non c'è.
    await expect(pagina.locator(".mappa-chip--via")).toHaveCount(0);
    await expect(pagina.locator(".mappa-invito")).toHaveCount(0);
    await chip.click();
    await expect(pagina.getByRole("heading", { level: 1 })).toContainText("Terra");

    await contesto.close();
  });
});
