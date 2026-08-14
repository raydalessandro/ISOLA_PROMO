import { expect, test } from "@playwright/test";

import { luoghi, personaggi, storie } from "@/lib/canone";
import { casaDi, luoghiMappa, storieLegami, vista } from "@/lib/legami";

/*
 * `lib/legami.ts` è generato dal canone, `lib/canone.ts` è scritto a mano: le
 * due proiezioni devono continuare a combaciare. Il canone vive in un altro
 * repo e cambia senza avvisare questo, quindi il disallineamento non lo
 * segnala nessuno — a meno che non lo si controlli qui.
 *
 * Non serve un browser: si legge il dato e basta. Il costo è nullo e il valore
 * è che una rigenerazione sbagliata non arriva in produzione.
 */
test.describe("i legami col canone", () => {
  test("ogni abitante nominato dai luoghi esiste fra i personaggi del sito", () => {
    const noti = new Set(personaggi.map((p) => p.id));
    const abitanti = [...new Set(luoghiMappa.map((l) => l.abitante).filter(Boolean))];

    expect(abitanti.length).toBeGreaterThan(0);
    expect(abitanti.filter((a) => !noti.has(a as string))).toEqual([]);
  });

  test("le dodici storie hanno gli stessi identificativi delle due proiezioni", () => {
    expect(storieLegami.map((s) => s.sid).sort()).toEqual(storie.map((s) => s.sid).sort());
  });

  test("ogni storia passa da almeno un quartiere e da almeno un luogo conosciuto", () => {
    const conosciuti = new Set(luoghiMappa.map((l) => l.id));

    for (const s of storieLegami) {
      expect(s.quartieri.length, `${s.sid} senza quartieri`).toBeGreaterThan(0);
      expect(s.luoghi.length, `${s.sid} senza luoghi`).toBeGreaterThan(0);
      expect(s.luoghi.filter((id) => !conosciuti.has(id))).toEqual([]);
    }
  });

  test("i cinque luoghi mostrati da /mondo hanno la loro area sulla mappa", () => {
    const aree = luoghiMappa.filter((l) => l.tipo === "quarter");
    expect(aree).toHaveLength(luoghi.length);

    // Gli id divergono per un trattino: il sito usa `quartiere-acqua`, il
    // canone `quartiere_acqua`. È l'unica traduzione ammessa fra i due.
    const suMappa = new Set(aree.map((a) => a.id));
    for (const luogo of luoghi) {
      expect(suMappa.has(luogo.id.replace(/-/g, "_")), `manca l'area di ${luogo.id}`).toBe(true);
    }
  });

  test("le geometrie dell'isola stanno dentro il riquadro della proiezione", () => {
    const fuori: string[] = [];

    const controlla = (id: string, punti: unknown): void => {
      if (typeof (punti as number[])[0] === "number") {
        const [x, y] = punti as number[];
        if (x < 0 || x > vista.larghezza || y < 0 || y > vista.altezza) fuori.push(id);
        return;
      }
      for (const parte of punti as unknown[]) controlla(id, parte);
    };

    // Le due Isole all'Orizzonte sono `stub` e stanno al largo: il riquadro
    // inquadra l'isola, non loro, quindi cadono fuori per costruzione.
    for (const l of luoghiMappa.filter((l) => l.stato !== "stub")) controlla(l.id, l.punti);
    expect(fuori).toEqual([]);

    const orizzonte = luoghiMappa.filter((l) => l.stato === "stub");
    expect(orizzonte.length).toBe(2);
  });

  test("chi ha una casa nel canone la ritrova dal proprio identificativo", () => {
    // Fiamma sta al Forno: è il caso che rende utile tutto il resto.
    const case_ = casaDi("fiamma");
    expect(case_.length).toBeGreaterThan(0);
    expect(case_.every((l) => l.quartiere === "fuoco")).toBe(true);
  });
});
