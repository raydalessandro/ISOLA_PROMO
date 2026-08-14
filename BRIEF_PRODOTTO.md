# Da sito a prodotto — L'Isola dei Tre Venti

> **Come usare questo file.** È il brief per la prossima fase di lavoro, non contenuto del sito.
> Il sito è su `main`; questo documento arriva dalla branch `claude/brief-giro-prodotto`.
> Chi prende in mano il lavoro parte da `main`, apre le proprie branch e lascia questo file
> dov'è: serve da traccia condivisa mentre i lavori procedono.

Coordini più subagenti su `raydalessandro/ISOLA_PROMO`: il sito pubblico di lancio di una saga
illustrata per bambini. Esiste, funziona, è online. Il tuo compito è portarlo da "sito corretto"
a "prodotto": mappa interattiva, segno vettoriale, movimento misurato, le illustrazioni sfruttate
davvero. Senza rompere niente di quello che già regge.

## Prima di toccare qualsiasi cosa

Leggi, in quest'ordine:

1. `README.md` — cos'è il sito, da dove viene ogni immagine, perché la galleria usa colonne.
2. `AGENTS.md` — **20 regole operative. Sono un contratto, non consigli.** In particolare la 4
   (nessun link a canali che non esistono), la 7 (del testo delle storie escono titolo e una riga),
   la 14 (il motore del gioco non si riscrive).
3. `lib/canone.ts` — la fonte unica. Ogni pagina nasce da qui.

Poi lancia `npm install && npm run check && npm run test:e2e` e assicurati che sia tutto verde
**prima** di modificare una riga. Se non lo è, il problema è l'ambiente, non il codice: risolvilo
prima di procedere.

## Stato attuale

- Next.js 16 + React 19, App Router, PWA, deploy Vercel. `main` a `fab7392`.
- Sette superfici: `/` `/mondo` `/giornate` `/storie` `/mappa` `/libro` `/gioco`.
- 37 test Playwright su mobile e desktop, **zero violazioni axe su WCAG 2.1 AA**.
- `public/media/` 28 MB: 18 ritratti, 3 tavole di luogo, atlante, 3 render del libro,
  40 illustrazioni social, il rosone.
- Il gioco è un canvas 160×144 in `lib/gioco/motore.js`, JavaScript portato quasi alla lettera
  dal prototipo dell'autore ed escluso da ESLint di proposito.

### Il canone (sola lettura, non committarci mai)

`raydalessandro/isola_i3v_visual`:

- `visual/` — 185 illustrazioni canoniche, schede di 116 entità;
- `cartografia/geo/island.geojson` — **105 feature georiferite** con `name`, `category`, `type`,
  `quarter`, `parent`, `elevation_m`, `flow_direction`;
- `pipeline_narrativa/story_graph.json` — grafo delle 12 storie;
- branch `immaginixsito` — le 40 illustrazioni social sorgente (PNG 6-8 MB).

`lib/canone.ts` nel sito è una **proiezione pubblica ridotta** del canone, aggiornata a mano.
Non generarla automaticamente e non allargarla con roba inventata.

---

## I lavori, in ordine di valore

### A. I due quartieri mancanti — è un difetto, non un miglioramento

`/mondo` dichiara "L'isola è divisa in quattro quartieri — aria, acqua, fuoco, terra — più il
centro" e poi mostra **tre schede**: villaggio, quartiere di Fuoco, quartiere d'Aria. Il testo
promette quattro cose e la pagina ne dà tre.

Causa verificata: nel canone `visual/atlante/tavole/` **esistono solo** le tavole di villaggio,
quartiere d'Aria e quartiere di Fuoco. Le tavole d'Acqua e di Terra non sono mai state disegnate,
e lo stesso vale per le varianti `*_vivo.jpg`.

Materiale canonico che invece **esiste** ed è utilizzabile:

| Quartiere | File nel canone |
|---|---|
| acqua | `visual/luoghi/quartiere_acqua/spiaggia_conchiglie/immagini/spiaggia_conchiglie_canonica_v1_panoramica.jpg` |
| terra | `visual/luoghi/quartiere_terra/orti_del_cerchio/immagini/orti_del_cerchio_canonica_v1_panoramica.jpg` |
| terra | `visual/luoghi/quartiere_terra/foresta_intrecciata/immagini/foresta_intrecciata_canonica_v1_interno.jpg` |
| terra | `visual/luoghi/quartiere_terra/radura_dei_pini/immagini/radura_dei_pini_canonica_v1_margine.jpg` |

E fra le social già nel sito: `v2-11-bartolo-mattino-cover` (il pontile all'alba, acqua),
`v2-18-amo-riva-carousel` (la Bocca, acqua), `v2-17-zolla-orti-cover` (gli Orti, terra).

**Decidi tu la strada, ma testo e immagini devono finire d'accordo.** Le opzioni oneste sono:
completare i quattro quartieri con le panoramiche dei luoghi (registro diverso dalle tavole:
verifica che la griglia regga), oppure ristrutturare la sezione perché non prometta quattro
schede. Quello che non è ammesso è lasciare la contraddizione, o generare un'illustrazione nuova
e spacciarla per canone.

Aggiungi un test che leghi il numero di quartieri nominati nel testo al numero di schede rese:
è esattamente il tipo di scollamento che nessuno rilegge.

### B. La mappa vera — il pezzo con più valore inespresso

`/mappa` oggi è **un JPEG**. C'è un GeoJSON canonico da 105 feature che nessuno sta usando.

Costruisci una mappa **SVG interattiva** generata da `island.geojson`:

- proietta le geometrie in coordinate SVG a build time (script in `scripts/`, output un modulo
  dati in `lib/`, non parsing del geojson nel browser);
- i quattro quartieri come aree distinguibili, colorate con la palette esistente;
- luoghi selezionabili con nome, categoria e — dove esiste — il rimando all'illustrazione;
- il Fiume che Gira come tracciato leggibile: è un anello, e la direzione della corrente sta in
  `flow_direction`.

Vincoli:

- deve funzionare **senza JavaScript** almeno come immagine leggibile con i nomi;
- navigabile da tastiera, ogni area interattiva è un elemento focalizzabile con nome accessibile;
- niente Leaflet, niente librerie di mappe, niente tile server: è un'isola inventata, sta tutta
  in un SVG;
- il JPEG attuale resta come alternativa illustrata, non buttarlo.

### C. Il segno vettoriale

Il rosone dei tre venti (piuma, onda, foglie intorno a una spirale) oggi è un **raster WebP**,
anche a 34 px nella testata. Portalo a SVG: scala, prende il colore dai token, si può animare.

Occasioni collegate:

- lo spirale verde di Spirale Editrice, oggi assente dal sito;
- i tre punti dei venti sono già CSS, ma potrebbero diventare un segno unico riusabile;
- decorazioni di sezione (tracce di vento) — solo se aggiungono, non se riempiono.

Gli SVG stanno inline nei componenti o come file in `public/`, mai come stringhe iniettate con
`dangerouslySetInnerHTML`. Le icone della barra bassa sono già a posto: prendile a modello.

### D. Movimento

**Il pubblico di questo sito è un genitore stanco, di sera.** Ogni animazione deve avere una
ragione — orientare, dare continuità, far capire che qualcosa ha risposto — e nessuna deve
chiedere attenzione.

Regole non negoziabili:

- ogni animazione rispetta `prefers-reduced-motion: reduce`. `app/styles/base.css` ha già la
  regola globale: verifica che copra davvero quello che aggiungi, non darlo per scontato;
- niente parallasse sulle illustrazioni, niente entrate a cascata su ogni elemento, niente
  autoplay che si muove da solo in loop nel campo visivo;
- niente animazioni che spostano il layout: nessun peggioramento di CLS.

Candidati sensati: i tre venti che si distinguono al passaggio, il rosone che ruota appena
sull'interazione, il rivelarsi delle schede della galleria, le transizioni fra superfici, il
feedback sui luoghi della mappa.

### E. Le quaranta illustrazioni, sfruttate meglio

Oggi vivono solo in `/giornate`. Sono il materiale migliore che il progetto ha. Valuta:

- `/storie` è tutta testo: ogni storia potrebbe avere l'illustrazione giusta accanto;
- `/mondo` usa le schede di reference; alcune social sono ritratti ambientati molto più belli —
  ma **attenzione a non spaccare l'omogeneità della griglia**, che oggi funziona;
- la galleria non ha ingrandimento: una lightbox accessibile (focus trap, Esc, frecce) è il tipo
  di cosa che rende un sito un prodotto;
- didascalie e testo alternativo vengono dai brief di generazione. Se aggiungi immagini, la
  didascalia si scrive dal brief, non a fantasia (regola 8).

### F. Rifiniture da prodotto

- `sitemap.ts` e `robots.ts`: oggi non ci sono.
- Dati strutturati JSON-LD: `Book` per il Volume 1, `Person` per l'autrice. Solo fatti veri —
  niente ISBN inventato, niente data di uscita finché non c'è.
- Anteprima social per pagina (`opengraph-image`), oggi tutte le pagine condividono la copertina.
- Un budget di performance dichiarato e verificato: il sito serve 28 MB di media e la galleria ne
  carica 40 in una volta.
- Il sito diventerà un **sottodominio** di un hub. Non serve `basePath`, ma controlla che niente
  presupponga di stare in radice assoluta.

---

## Guard rail — quello che fa fallire il lavoro

1. `npm run check` e `npm run test:e2e` verdi, **zero violazioni axe su WCAG 2.1 AA**. Non è una
   soglia da negoziare: è già rispettata oggi e non deve regredire.
2. **Niente canone inventato.** Nomi, specie, luoghi, relazioni si prendono dal grafo o dalle
   schede. Se una cosa non è nel canone, non va sul sito.
3. **Nessun link a canali che non esistono.** Amazon e social sono `url: null` e si dichiarano
   "in arrivo". Un test lo verifica: non aggirarlo.
4. **Non riscrivere `lib/gioco/motore.js`.** È un gioco che funziona, portato dal prototipo
   dell'autore. Modifiche solo per farlo funzionare, mai per farlo bello.
5. **Del testo delle storie escono titolo e una riga.** I racconti stanno nei libri.
6. **La palette non si allarga.** I tre colori sono i punti stampati sulla quarta di copertina.
   Chi ne aggiunge uno dichiara da dove viene. Il testo sta a 4.5:1 misurato sui pixel resi, non
   sui valori esadecimali: sopra tutta la pagina c'è un velo di carta.
7. **Niente dipendenze nuove senza motivo forte.** Nessun framework CSS, nessuna libreria di
   componenti, nessun font esterno, nessun CDN. Il sito è autonomo e deve restarlo.
8. **Italiano, con apostrofo tipografico `’`.** Le didascalie descrivono quello che si vede.
9. Toccando `public/sw.js` si alza `VERSION`. Aggiungendo rotte si aggiorna il precache.
10. Immagini nuove: WebP a due larghezze (`nome.webp`, `nome@2x.webp`), `width`/`height` sempre
    dichiarati, `npm run check:media` prima del commit.

## Come coordinare i subagenti

Il lavoro si divide bene per superficie, ma tre file sono **punti di contesa**: `lib/canone.ts`,
`app/styles/base.css` e `components/shell.tsx`. Chi li tocca lo fa da solo.

Suggerimento di sequenza:

1. **In parallelo, indipendenti:** A (quartieri) · C (rosone SVG) · F (sitemap, robots, JSON-LD).
2. **Poi, sulla base stabilizzata:** B (mappa SVG) — è il lavoro grosso, dagli spazio e un
   subagente dedicato che possa anche scrivere lo script di proiezione.
3. **Poi:** E (immagini nelle altre superfici, lightbox).
4. **Per ultimo, quando il DOM è fermo:** D (movimento). Animare prima significa rifarlo.

Ogni workstream atterra con i suoi test e con la suite intera verde. Un lavoro che passa i propri
test ma rompe quelli di un altro non è finito.

Commit descrittivi: prima riga ≤72 caratteri, corpo che spiega **cosa** e **perché**. Branch
dedicata, PR, CI verde prima del merge.

## Come verificare davvero

```bash
npm run check      # typecheck + lint + integrità dei binari + build
npm run test:e2e   # build + Playwright su mobile e desktop
```

I test non bastano per il lavoro visivo: **guarda le pagine**. Chromium è preinstallato
(`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`). Fai screenshot a 390 px e 1280 px di ogni
superficie toccata, prima e dopo, e confrontali. Un'animazione o una mappa si giudicano
guardandole, non leggendo un assert verde.

Verifica anche `prefers-reduced-motion` attivo: è una condizione reale di utenti reali, non un
caso di scuola.

## Cosa NON fare

- Non aprire PR verso il repo del canone.
- Non aggiungere analytics, cookie banner, newsletter o form senza chiedere: il sito oggi non
  raccoglie **nessun** dato, ed è una scelta.
- Non introdurre modalità scura: il sito è carta stampata, e una scelta dichiarata vale più di
  una funzione in più fatta male.
- Non "modernizzare" il registro visivo. È un albo illustrato ad acquerello, non una landing SaaS.
- Non rifare quello che già funziona per il gusto di rifarlo.

## Come riferire alla fine

Cosa hai cambiato e perché, cosa hai deciso di non fare e perché, cosa resta aperto. Se qualcosa
non è riuscito, dillo — con l'output, non con una parafrasi.
