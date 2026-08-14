import { expect, test } from "@playwright/test";

const SUPERFICI = ["/", "/mondo", "/storie", "/libro", "/giornate", "/mappa", "/gioco"];

test.describe("quello che leggono i motori di ricerca", () => {
  /*
   * L'host assoluto non si controlla da qui: `baseUrlDelSito()` legge la
   * configurazione del deploy, e in prova ricade su una porta fissa. Si
   * verifica quindi quello che dipende da noi — quali superfici escono, che
   * la sitemap sia dichiarata, e che tutti gli indirizzi vengano dallo stesso
   * posto — non il dominio, che cambia col deploy.
   */
  test("robots.txt apre il sito e indica la sitemap", async ({ request }) => {
    const risposta = await request.get("/robots.txt");
    expect(risposta.ok()).toBe(true);

    const testo = await risposta.text();
    expect(testo).toContain("Allow: /");
    expect(testo).toMatch(/^Sitemap: https?:\/\/\S+\/sitemap\.xml$/m);

    // La ricaduta del service worker non è una pagina da indicizzare.
    expect(testo).toContain("Disallow: /offline");
  });

  test("la sitemap elenca tutte le superfici pubbliche e nient'altro", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    const indirizzi = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]));

    expect(indirizzi.map((u) => u.pathname).sort()).toEqual([...SUPERFICI].sort());

    // Un solo dominio: un indirizzo rimasto indietro si vedrebbe qui.
    expect(new Set(indirizzi.map((u) => u.origin)).size).toBe(1);
  });
});

test.describe("i dati strutturati del libro", () => {
  test("descrivono il Volume 1 senza inventarsi niente", async ({ page }) => {
    await page.goto("/libro");

    const grezzo = await page.locator('script[type="application/ld+json"]').innerText();
    const dati = JSON.parse(grezzo);

    expect(dati["@type"]).toBe("Book");
    expect(dati.name).toContain("Volume 1");
    expect(dati.author.name).toBe("Beatrice Mercuri");
    expect(dati.publisher.name).toBe("Spirale Editrice");
    expect(dati.inLanguage).toBe("it");
    expect(dati.hasPart).toHaveLength(3);

    /*
     * Il cuore del test. Il libro è stampato ma la scheda Amazon non ha ancora
     * una data: finché è così, dichiarare ISBN, data d'uscita o disponibilità
     * sarebbe un link finto scritto in JSON — invisibile a chi legge la pagina,
     * ben visibile a Google. Quei campi entrano il giorno in cui esistono.
     */
    for (const campo of ["isbn", "datePublished", "offers", "aggregateRating", "numberOfPages"]) {
      expect(dati, `${campo} non deve esserci finché non è un fatto`).not.toHaveProperty(campo);
    }
  });
});
