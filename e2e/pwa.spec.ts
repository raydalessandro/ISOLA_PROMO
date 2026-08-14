import { expect, test } from "@playwright/test";

/*
 * Il service worker è attivo solo nelle build di produzione — ed è contro una
 * build di produzione che gira questa suite (vedi playwright.config.ts).
 */

test("il manifest descrive l'app installabile", async ({ request }) => {
  const risposta = await request.get("/manifest.webmanifest");
  expect(risposta.ok()).toBe(true);

  const manifest = await risposta.json();
  expect(manifest.name).toBe("L’Isola dei Tre Venti");
  expect(manifest.start_url).toBe("/");
  expect(manifest.icons.some((i: { purpose?: string }) => i.purpose === "maskable")).toBe(true);
});

test("il service worker si registra e mette da parte le superfici", async ({ page }) => {
  await page.goto("/");

  const pronto = await page.evaluate(async () => {
    if (!("serviceWorker" in navigator)) return false;
    const registrazione = await navigator.serviceWorker.ready;
    return Boolean(registrazione.active);
  });
  expect(pronto).toBe(true);
});

test("senza rete si finisce sulla pagina che lo dice, non su un errore", async ({ page, context }) => {
  await page.goto("/");
  await page.evaluate(() => navigator.serviceWorker.ready);
  // Il precache dell'installazione può non essere ancora finito.
  await page.waitForTimeout(1500);

  await context.setOffline(true);
  await page.goto("/storie");

  // O la pagina è già in cache, o si atterra sull'avviso: mai un errore del browser.
  const titolo = page.getByRole("heading", { level: 1 });
  await expect(titolo).toBeVisible();
  await expect(titolo).toHaveText(
    /Dodici storie, quattro stagioni\.|Questa pagina non è ancora scesa a terra\./,
  );

  await context.setOffline(false);
});
