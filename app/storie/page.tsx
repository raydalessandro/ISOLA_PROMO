import type { Metadata } from "next";

import { storie, storiePerCiclo, venti, volumi } from "@/lib/canone";
import { elenco, luoghiNotevoli, quando } from "@/lib/dove";

export const metadata: Metadata = {
  title: "Le dodici storie",
  description:
    "Dodici storie illustrate in quattro volumi, uno per stagione. Titoli e una riga: i racconti stanno nei libri.",
};

/*
 * Il colore del volume è quello del suo vento. Il quarto volume non ha un vento
 * suo — ci soffiano tutti e tre — quindi prende il filetto neutro e l'inchiostro
 * tenue: un colore inventato apposta direbbe una cosa che il canone non dice.
 */
function coloriVolume(vento: string) {
  const trovato = venti.find((v) => v.nome === vento);
  return {
    "--colore-vento": trovato?.colore ?? "var(--bordo-forte)",
    "--colore-vento-testo": trovato?.coloreTesto ?? "var(--tenue)",
  } as React.CSSProperties;
}

/*
 * Quando succede una storia e per dove passa. Viene dal grafo del canone, e si
 * ferma esattamente lì: stagione, notte, luoghi attraversati. Come vada a
 * finire resta nel libro (AGENTS.md, regola 7).
 *
 * Dei luoghi si nominano i più caratteristici e mai i sentieri: «passa per il
 * Sentiero Orti-Casa Salvia» non dice niente a nessuno.
 */
function Dove({ sid }: { sid: string }) {
  const momento = quando(sid);
  const luoghi = luoghiNotevoli(sid, 2);

  if (!momento && luoghi.length === 0) return null;

  return (
    <p className="storia-dove">
      {momento && <b>{momento}</b>}
      {momento && luoghi.length > 0 && " — "}
      {luoghi.length > 0 && elenco(luoghi.map((l) => l.nome))}
    </p>
  );
}

export default function Storie() {
  return (
    <section className="sezione">
      <div className="contenuto">
        <div className="testa-sezione">
          <span className="occhiello">La saga</span>
          <h1>Dodici storie, quattro stagioni.</h1>
          <p>
            Le dodici storie non sono in ordine casuale: sono quattro cicli di
            tre, e ogni ciclo è una stagione. Tre storie per volume, una per
            sera.
          </p>
        </div>

        {volumi.map((volume) => {
          return (
            <section
              className="volume"
              key={volume.numero}
              style={coloriVolume(volume.vento)}
              aria-labelledby={`vol-${volume.numero}`}
            >
              <div className="volume-testa">
                <span className="volume-numero">Volume {volume.numero}</span>
                <h2 id={`vol-${volume.numero}`}>
                  {volume.sottotitolo ?? `${volume.stagione} — ${volume.vento}`}
                </h2>
                <span className="volume-stato">
                  {volume.stato === "stampato" ? "stampato" : "in preparazione"}
                </span>
              </div>

              <ol className="elenco-storie">
                {storiePerCiclo(volume.ciclo).map((storia) => (
                  <li className="storia" key={storia.sid}>
                    <h3>{storia.titolo}</h3>
                    <p>{storia.riga}</p>
                    <Dove sid={storia.sid} />
                  </li>
                ))}
              </ol>
            </section>
          );
        })}

        <div className="nota-testi">
          <h2>Perché qui non si legge nessuna storia</h2>
          <p>
            Le {storie.length} storie sono scritte e illustrate, ma il loro
            posto è la pagina stampata: si leggono ad alta voce, con un bambino
            addosso, una per sera. Su questa pagina ci sono i titoli e una riga
            per ciascuna — abbastanza per sapere dove si va, non abbastanza per
            rovinare la sera in cui ci si arriva.
          </p>
        </div>
      </div>
    </section>
  );
}
