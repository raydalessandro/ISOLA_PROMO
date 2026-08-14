# Regole operative — sito de L'Isola dei Tre Venti

1. `lib/canone.ts` è la fonte unica del sito: storie, venti, volumi, personaggi, luoghi, canali. Le pagine non tengono dati propri.
2. Il canone vive in `raydalessandro/isola_i3v_visual` ed è **in sola lettura**. `lib/canone.ts` ne è una proiezione pubblica ridotta: se il canone cambia, questo file si corregge a mano.
2-bis. `lib/legami.ts` è l'**unico file generato** del progetto: lo scrive `scripts/estrai-legami.mjs` dal canone e non si modifica a mano. Contiene i legami fra luoghi, abitanti e storie. Resta una proiezione come `canone.ts`, con una differenza: quella si corregge a mano, questa si rigenera. Il sito **non** dipende dal canone in build — `npm run check` deve funzionare su una macchina che non ce l'ha su disco.
2-ter. Dal grafo delle storie escono **il dove e il quando, mai come vanno a finire**. Lo script elenca i campi ammessi uno per uno: si allunga quella whitelist, non si toglie da una blacklist. Un campo nuovo nel grafo non deve poter arrivare sul sito da solo.
3. Non inventare canone. Titoli, specie, mestieri, luoghi e relazioni si prendono dal grafo delle storie o dalle schede visual. Se una cosa non è nel canone, non va sul sito.
4. **Un canale che non esiste non si linka.** Amazon e i social si dichiarano `url: null` in `canone.ts` e la UI li mostra come "in arrivo". Il link compare il giorno in cui il canale è vivo, non prima.
5. Niente controlli finti: se un elemento sembra cliccabile, deve fare qualcosa o dichiararsi in attesa.
6. Uno stato esplicito è sempre meglio di un contenuto inventato per riempire la pagina.
7. **Del testo delle storie si pubblicano solo titolo e una riga.** I racconti stanno nei libri. Le righe descrivono l'apertura o il luogo, mai il finale.
8. Le didascalie di `/giornate` vengono dai brief che hanno generato le immagini, e fanno anche da testo alternativo: descrivono quello che si vede, non quello che si vorrebbe far sentire. Nessuna immagine senza didascalia.
9. La firma pubblica è **Beatrice Mercuri / Spirale Editrice**. Ray, il grafo, la pipeline e i repo di lavorazione non compaiono da nessuna parte sul sito.
10. Il pubblico che legge queste pagine è il genitore, non il bambino. L'unica superficie rivolta ai bambini è `/gioco`.
11. La palette non si allarga a piacere: i tre colori dei venti sono i tre punti stampati sulla quarta di copertina del Volume 1, la carta è il suo fondo. Chi aggiunge un colore dice da dove viene.
12. Il testo sta a 4.5:1 di contrasto. `--tenue` è il grigio più scuro ammesso sulla carta, e l'arancio dei punti come testo va usato nella variante `--mulinello-testo`: il pieno non ce la fa.
13. Gli stili vivono in `app/styles/`, uno per superficie. `globals.css` si limita agli import. Il gioco usa CSS Modules e non tocca il resto.
14. `lib/gioco/motore.js` è il prototipo di Ray portato quasi alla lettera: resta JavaScript, resta fuori da ESLint, e si modifica solo per farlo funzionare — non per riscriverlo in stile. Il contratto verso l'app è `motore.d.ts`.
15. Toccando `public/sw.js` va alzata `VERSION`, altrimenti i client restano su cache vecchie.
16. Le immagini nuove entrano in `public/media/` già in WebP e a due larghezze (`nome.webp`, `nome@2x.webp`). Le sorgenti stanno nel canone o negli originali di Ray, non nel repo.
17. Un binario copiato va verificato prima del commit: `npm run check:media` confronta quello che l'header dichiara con quello che il file contiene. Un'immagine troncata passa build, lint e test senza rumore.
18. Ogni superficie resta mobile-first e deve funzionare come deploy Vercel.
19. Prima di consegnare: `npm run check` e `npm run test:e2e` devono passare puliti. Zero violazioni axe su WCAG 2.1 AA.
20. Si lavora su branch con pull request. La CI (typecheck, lint, integrità dei binari, build, Playwright) dev'essere verde prima del merge.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
