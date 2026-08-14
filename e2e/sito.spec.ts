import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const SUPERFICI = ["/", "/mondo", "/giornate", "/storie", "/mappa", "/libro"];

test.describe("le superfici del sito", () => {
  test("l'apertura racconta l'isola e i tre venti", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toContainText("Tre Venti");
    // La stessa frase torna in chiusura: qui interessa quella dell'apertura.
    await expect(page.locator(".apertura-promessa")).toHaveText(
      "Su un’isola in mezzo al mare soffiano tre venti.",
    );

    for (const vento of ["Vento Taglio", "Vento Intreccio", "Vento Mulinello"]) {
      await expect(page.getByRole("heading", { name: vento })).toBeVisible();
    }
  });

  test("il mondo mostra tutti gli abitanti, ciascuno con la sua illustrazione", async ({ page }) => {
    await page.goto("/mondo");

    const schede = page.locator(".abitante");
    await expect(schede).toHaveCount(18);

    // Un'immagine rotta passerebbe inosservata: si controlla che il browser
    // l'abbia davvero decodificata, non solo che il tag esista.
    await schede.first().locator("img").scrollIntoViewIfNeeded();
    const caricata = await schede
      .first()
      .locator("img")
      .evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0);
    expect(caricata).toBe(true);
  });

  /*
   * Il testo prometteva quattro quartieri e la pagina ne mostrava tre: e' il
   * tipo di scollamento che nessuno rilegge, perche' copy e griglia vivono in
   * due file diversi. Qui si legano: si contano gli elementi nominati nella
   * riga di apertura e si pretende una scheda per ciascuno.
   */
  test("ogni quartiere nominato nel testo ha la sua scheda", async ({ page }) => {
    await page.goto("/mondo");

    const testa = page
      .locator(".testa-sezione")
      .filter({ hasText: "Il centro e i quattro quartieri" });
    const intro = (await testa.locator("p").innerText()).toLowerCase();

    const nominati = ["aria", "fuoco", "acqua", "terra"].filter((e) => intro.includes(e));
    expect(nominati).toHaveLength(4);

    const schede = page.locator(".quartieri .luogo");
    await expect(schede).toHaveCount(nominati.length);

    for (const elemento of nominati) {
      await expect(
        schede.locator("h3").filter({ hasText: new RegExp(elemento, "i") }),
      ).toHaveCount(1);
    }

    // Il villaggio non e' un quartiere: sta al centro e ha una scheda sua.
    await expect(page.locator(".luogo--largo")).toHaveCount(1);

    // Le due illustrazioni nuove sono le ultime arrivate: si verifica che il
    // browser le abbia davvero decodificate, non solo che il tag esista.
    for (const id of ["quartiere-acqua", "quartiere-terra"]) {
      const img = page.locator(`.quartieri img[src*="${id}"]`);
      await img.scrollIntoViewIfNeeded();
      // Le schede stanno in fondo alla pagina e le immagini sono pigre:
      // l'asserzione deve riprovare finche' il browser non ha decodificato.
      await expect
        .poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0))
        .toBe(true);
    }
  });

  test("le storie sono dodici, divise in quattro volumi, senza testo dei racconti", async ({
    page,
  }) => {
    await page.goto("/storie");

    await expect(page.locator(".storia")).toHaveCount(12);
    await expect(page.locator(".volume")).toHaveCount(4);
    await expect(page.getByRole("heading", { name: "Il vento che taglia" })).toBeVisible();
  });
});

test.describe("le giornate dell'isola", () => {
  test("la galleria mostra tutte e quaranta le illustrazioni, ognuna con la sua didascalia", async ({
    page,
  }) => {
    await page.goto("/giornate");

    const schede = page.locator(".giornata");
    await expect(schede).toHaveCount(40);

    // Una didascalia vuota lascerebbe un'immagine muta anche a chi non la vede.
    const senzaDidascalia = await schede.evaluateAll((figure) =>
      figure.filter((f) => !f.querySelector("figcaption")?.textContent?.trim()).length,
    );
    expect(senzaDidascalia).toBe(0);

    // Il testo alternativo ripete la didascalia: nessuna immagine resta senza.
    const senzaAlt = await schede.evaluateAll((figure) =>
      figure.filter((f) => !f.querySelector("img")?.getAttribute("alt")?.trim()).length,
    );
    expect(senzaAlt).toBe(0);
  });
});

test.describe("i canali che non esistono ancora", () => {
  test("Amazon è dichiarato in arrivo e non è un collegamento", async ({ page }) => {
    await page.goto("/libro");

    const amazon = page.locator(".in-arrivo", { hasText: "Su Amazon" });
    await expect(amazon).toBeVisible();
    // Regola 4: finché non c'è una data, non c'è un link. Nessun controllo finto.
    await expect(amazon.locator("a")).toHaveCount(0);
    await expect(page.getByText("Il libro è stampato.")).toBeVisible();
  });

  test("nessun collegamento del sito porta fuori a un canale inesistente", async ({ page }) => {
    await page.goto("/");

    const esterni = await page.locator("a[href^='http']").count();
    expect(esterni).toBe(0);
  });
});

test.describe("metadati", () => {
  test("le anteprime social puntano a un indirizzo assoluto e valido", async ({ page }) => {
    await page.goto("/");

    // Il primo deploy su Vercel e' caduto qui: NEXT_PUBLIC_SITE_URL esisteva
    // ma era vuota, e la base dei metadati diventava una stringa vuota.
    const immagine = await page
      .locator('meta[property="og:image"]')
      .first()
      .getAttribute("content");

    expect(immagine).toBeTruthy();
    expect(() => new URL(immagine!)).not.toThrow();
    expect(new URL(immagine!).hostname).not.toBe("");
    expect(immagine).toContain("/media/libro/vol1-fronte.webp");
  });
});

test.describe("il gioco", () => {
  test("occupa lo schermo e parte davvero", async ({ page }) => {
    await page.goto("/gioco");

    // La shell si toglie di mezzo: niente testata, niente barra bassa.
    await expect(page.locator("header.testata")).toHaveCount(0);
    await expect(page.locator("nav.barra-bassa")).toHaveCount(0);
    await expect(page.locator("main")).toHaveCount(1);

    const schermo = page.locator("canvas[data-schermo]");
    await expect(schermo).toBeVisible();

    // Il motore disegna a ogni frame: se è partito, il canvas non è più vuoto.
    await expect
      .poll(
        async () =>
          schermo.evaluate((canvas: HTMLCanvasElement) => {
            const ctx = canvas.getContext("2d");
            if (!ctx) return 0;
            const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let acceso = 0;
            for (let i = 3; i < data.length; i += 4) if (data[i] > 0) acceso += 1;
            return acceso;
          }),
        { timeout: 8000 },
      )
      .toBeGreaterThan(1000);

    await expect(page.getByRole("button", { name: "Vai su" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Tasto A/ })).toBeVisible();
  });

  test("si esce dal gioco e si torna al sito", async ({ page }) => {
    await page.goto("/gioco");
    await page.getByRole("link", { name: /Esci dall’isola/ }).click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("header.testata")).toBeVisible();
  });
});

test.describe("navigazione", () => {
  test("la barra bassa porta alle superfici principali", async ({ page, isMobile }) => {
    test.skip(!isMobile, "la barra bassa esiste solo sugli schermi stretti");

    await page.goto("/");
    await page.locator("nav.barra-bassa").getByRole("link", { name: "Storie" }).click();
    await expect(page).toHaveURL(/\/storie$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});

test.describe("accessibilità", () => {
  for (const percorso of SUPERFICI) {
    test(`nessuna violazione WCAG 2.1 AA su ${percorso}`, async ({ page }) => {
      await page.goto(percorso);
      // Le immagini in fondo sono lazy: si scorre, così axe le vede tutte.
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(600);

      const esito = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(esito.violations).toEqual([]);
    });
  }
});
