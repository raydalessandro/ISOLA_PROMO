# L'isola disegnata

L'isola dei Tre Venti, disegnata in vettoriale: la stessa isola della tavola
dipinta stampata nel Volume 1, ridisegnata forma per forma perché si possa
ingrandire, inquadrare, animare e servire ovunque senza portarsi dietro mezzo
megabyte di fotografia.

Questa cartella è un **asset a sé stante**. Non importa niente da fuori, non
conosce il sito che la mostra, non conosce Next, non legge il canone e non tocca
il DOM. Per portarla in un altro progetto si copia la cartella: serve React e un
compilatore TypeScript, nient'altro.

## Come si usa

```tsx
import { IsolaDisegnata, descrizione, inquadratura } from "./isola-mappa";

// l'isola intera
<IsolaDisegnata />

// un quartiere
<IsolaDisegnata vista={inquadratura("fuoco")} />
```

`IsolaDisegnata` restituisce un `<svg>` completo — tavolozza inclusa, in un
`<style>` che viaggia dentro il disegno. È fatto per essere **servito come
immagine**, non messo in linea in una pagina: sono migliaia di forme, e dentro
un documento React finirebbero scritte due volte (nel markup e nel payload).

Su Next basta una route:

```ts
const disegno = renderToStaticMarkup(createElement(IsolaDisegnata));
return new Response(disegno, { headers: { "content-type": "image/svg+xml" } });
```

e poi `<img src="/isola.svg">`. Chi non ha un server lo stampa una volta in un
file `.svg` e se lo tiene.

## Cosa esce da qui

Solo quello che sta in `index.ts`:

| | |
|---|---|
| `IsolaDisegnata` | il disegno, per un'inquadratura |
| `descrizione` | il testo alternativo di quell'inquadratura |
| `QUARTIERI`, `ISOLA_INTERA`, `inquadratura` | i riquadri: l'isola intera e i cinque pezzi |
| `camera` | quanto ingrandire e dove puntare, per chi inquadra un quartiere con una trasformazione invece che con un'altra immagine |
| `riquadro` | l'attributo `viewBox` di un'inquadratura |
| `FOGLIO` | le misure del foglio |
| `TAVOLA` | i colori, con scritto da dove vengono |

Il resto è interno e cambia quando cambia il disegno.

## Com'è fatto dentro

| File | Cosa contiene |
|---|---|
| `tratto.ts` | la matita: caso governato, curve morbide, semine dentro una forma, nastri |
| `geografia.ts` | dove stanno le cose, letto sulla tavola dipinta con una griglia sovrapposta |
| `quartieri.ts` | i riquadri dei quartieri e il conto della camera |
| `tavola.ts` | i colori, campionati dalla tavola, con la coordinata del prelievo |
| `disegno/simboli.tsx` | quello che si ripete: chiome e sassi, in cinque misure |
| `disegno/strati.tsx` | gli strati, dal mare alla grana della carta |
| `disegno/isola.tsx` | le definizioni SVG e l'ordine in cui gli strati si sovrappongono |

## Le tre regole di chi ci mette mano

1. **Il disegno è deterministico.** Alberi, onde, scogli e rughe della roccia
   sono sparsi a caso, ma è un caso con un seme scritto nel codice: due build
   danno lo stesso file, byte per byte. Niente `Math.random()`, niente `Date`.
   Un albero che si sposta a ogni ricarica non è vivo, è rotto.

2. **I colori vengono dalla tavola, non dal gusto.** Ogni voce di `tavola.ts`
   dichiara la coordinata da cui è stata presa su `mappa.webp`. Nel sito che la
   ospita c'è uno script che va a ricontrollarle una per una
   (`scripts/campiona-tavola.mjs`): chi porta via questa cartella si porti via
   anche quello, o la provenienza resta una buona intenzione.

3. **Le coordinate sono un patto.** Il foglio è 1000×1500 e non si tocca: chi
   mette dei segni sopra la mappa — etichette, luoghi cliccabili, figure — li
   piazza in quelle unità. Cambiare il foglio significa spostare tutto quello
   che qualcun altro ci ha appoggiato sopra.

## Cosa **non** va messo qui dentro

Il canone. Nomi, specie, abitanti, storie, quartieri come si chiamano: sono del
progetto che usa la mappa, non della mappa. Qui dentro un quartiere si chiama
`fuoco` perché è un id, e finisce lì. La regola pratica: se per aggiungere una
cosa serve sapere chi ci abita, quella cosa va fuori — questa cartella disegna
un'isola, non la racconta.
