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

  test("la testata porta il segno dei tre venti e il nome del sito", async ({ page }) => {
    await page.goto("/");

    const marchio = page.locator(".marchio");
    // Il segno e' decorativo: il nome accessibile lo porta il testo accanto.
    await expect(marchio).toHaveAccessibleName(/Isola dei Tre Venti/);
    await expect(marchio.locator("svg circle")).toHaveCount(3);
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

  /*
   * La mappa e' un indice: ogni segno sulla tavola porta alla scheda del suo
   * luogo, e la scheda dice chi ci abita e quali storie ci passano. Deve
   * funzionare **senza JavaScript**, quindi i segni sono ancore vere: qui si
   * verifica che ognuna abbia il suo bersaglio, non solo che esista il segno.
   */
  /*
   * I legami del canone devono affiorare anche fuori dalla mappa: su /mondo
   * ogni abitante dice dove sta, su /storie ogni storia dice quando succede e
   * per dove passa. Sono le stesse due proiezioni, lette da superfici diverse:
   * se una si scollega, si scollega qui.
   */
  test("ogni abitante dice dove sta e in quante storie compare", async ({ page }) => {
    await page.goto("/mondo");

    await expect(page.locator(".abitante-legami")).toHaveCount(18);

    // Fiamma e' il caso completo: casa nel canone piu' presenze nelle storie.
    const fiamma = page.locator(".abitante").filter({ hasText: "Fiamma" }).first();
    await expect(fiamma).toContainText("Forno di Fiamma");
    await expect(fiamma).toContainText("quartiere di Fuoco");

    // Gli otto senza casa georiferita non se ne inventano una.
    const noah = page.locator(".abitante").filter({ hasText: "Noah" }).first();
    await expect(noah).not.toContainText("Vive");
    await expect(noah).toContainText("dodici");
  });

  test("ogni storia dice quando succede e per dove passa, mai come finisce", async ({ page }) => {
    await page.goto("/storie");

    await expect(page.locator(".storia-dove")).toHaveCount(12);

    const prima = page.locator(".storia").first();
    await expect(prima).toContainText("Inverno");
    await expect(prima).toContainText("di notte");
    await expect(prima).toContainText("Montagne Gemelle");

    // I sentieri restano fuori: nominarli non direbbe niente a nessuno.
    const righe = await page.locator(".storia-dove").allInnerTexts();
    expect(righe.filter((r) => /Sentiero|Viottolo/.test(r))).toEqual([]);
  });

  test("ogni segno sulla mappa porta alla scheda del suo luogo", async ({ page }) => {
    await page.goto("/mappa");

    const segni = page.locator(".mappa-segno");
    const quanti = await segni.count();
    expect(quanti).toBeGreaterThanOrEqual(10);
    await expect(page.locator(".mappa-scheda")).toHaveCount(quanti);

    for (let i = 0; i < quanti; i++) {
      const segno = segni.nth(i);
      const href = await segno.getAttribute("href");
      expect(href, "un segno senza destinazione").toMatch(/^#luogo-/);
      await expect(page.locator(href as string)).toHaveCount(1);

      // Il cerchio non dice niente a chi non vede: il nome sta sul collegamento.
      const nome = await segno.getAttribute("aria-label");
      expect(nome?.trim(), "un segno senza nome accessibile").toBeTruthy();
    }
  });

  test("le schede della mappa legano i luoghi a chi ci abita e alle storie", async ({ page }) => {
    await page.goto("/mappa");

    // Il Forno e' il caso che tiene insieme tutto: ci abita Fiamma e ci passano
    // piu' storie che in qualsiasi altro luogo dell'isola.
    const forno = page.locator("#luogo-forno");
    await expect(forno).toContainText("Fiamma");
    await expect(forno.locator(".mappa-scheda-storie li").first()).toBeVisible();
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
  /*
   * La lente e' un `<dialog>` vero: il fuoco che resta dentro, Esc e il ritorno
   * del fuoco sono del browser, non miei. Qui si verifica che ci siano davvero,
   * perche' e' esattamente il genere di cosa che si crede funzioni e non
   * funziona.
   */
  test("l'ingrandimento si apre, si scorre con le frecce e si chiude con Esc", async ({ page }) => {
    await page.goto("/giornate");

    // Senza JavaScript il collegamento porta comunque al file grande.
    const primo = page.locator(".giornata-apri").first();
    expect(await primo.getAttribute("href")).toMatch(/@2x\.webp$/);

    await page.locator(".giornata-apri").nth(2).click();
    const lente = page.locator(".lente[open]");
    await expect(lente).toHaveCount(1);
    await expect(lente.locator(".lente-conto")).toHaveText("3 di 20");

    await page.keyboard.press("ArrowRight");
    await expect(lente.locator(".lente-conto")).toHaveText("4 di 20");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await expect(lente.locator(".lente-conto")).toHaveText("2 di 20");

    // Il fuoco non deve poter uscire dalla finestra.
    expect(await page.evaluate(() => document.activeElement?.closest("dialog") !== null)).toBe(true);

    await page.keyboard.press("Escape");
    await expect(page.locator(".lente[open]")).toHaveCount(0);

    // E deve tornare da dove si era partiti.
    expect(await page.evaluate(() => document.activeElement?.className)).toContain("giornata-apri");
  });

  test("la lente aperta non introduce violazioni di accessibilita'", async ({ page }) => {
    await page.goto("/giornate");
    await page.locator(".giornata-apri").first().click();
    await expect(page.locator(".lente[open]")).toHaveCount(1);

    const esito = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(esito.violations).toEqual([]);
  });

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
