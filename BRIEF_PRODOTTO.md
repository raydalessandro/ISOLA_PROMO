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

- `visual/` — 183 illustrazioni canoniche, schede di 116 entità;
- `cartografia/geo/island.geojson` — **105 feature georiferite** con `name`, `category`, `type`,
  `quarter`, `parent`, `elevation_m`, `flow_direction`;
- `pipeline_narrativa/story_graph.json` — grafo delle 12 storie;
- branch `immaginixsito` — le 40 illustrazioni social sorgente (PNG 6-8 MB).

`lib/canone.ts` nel sito è una **proiezione pubblica ridotta** del canone, aggiornata a mano.
Non generarla automaticamente e non allargarla con roba inventata.

---

## Il principio: informazione vissuta, non scorsa

Il sito ha sette superfici e ognuna è un elenco piatto dello stesso mondo. `/mondo` ha gli
abitanti senza i loro luoghi. `/mappa` ha i luoghi senza i loro abitanti. `/storie` ha le storie
senza né gli uni né gli altri. `/giornate` ha quaranta illustrazioni che mostrano quei luoghi e
quegli abitanti, e non lo dice. Chi legge ricostruisce l'isola nella propria testa, oppure scorre
e se ne va. Una landing page da leggere e basta non è più il modo in cui si conosce un mondo.

**I collegamenti però esistono già nel canone, e le chiavi combaciano.** Non c'è niente da
inventare: c'è da esporre quello che nel canone è già legato.

| Da | A | Dove sta il legame | Verificato |
|---|---|---|---|
| luogo | abitante | `island.geojson`, proprietà `inhabitant` | 13 feature → 10 abitanti, id identici a `lib/canone.ts` |
| luogo | quartiere | `island.geojson`, proprietà `quarter` | 105 feature su 105 |
| storia | quartiere | `story_graph.json`, `quartieri_attraversati` | 12 storie su 12, tutti e quattro i quartieri |
| storia | luogo | `story_graph.json`, `location_primary` + `locations_secondary` | 12 storie su 12 |
| storia | personaggio | `story_graph.json`, `characters_in_scene` | i 18 personaggi del sito, id identici |
| storia | stagione, vento, notte | `story_graph.json`, `season`, `wind_active`, `night_scene` | 12 storie; tre sono notturne (s01, s08, s10) |

Gli id di `inhabitant` sono esattamente `fiamma, bartolo, stria, memolo, grunto, rovo, salvia,
nodo, zolla, amo`: i dieci abitanti che non sono né fratelli né cuccioli, già in `lib/canone.ts`
con lo stesso id. Il join non ha bisogno di una tabella di corrispondenza scritta a mano.

### Dove si ferma: regola 7 e regola 10

`story_graph.json` è un documento di lavorazione e contiene le risoluzioni, le paure, i finali.
**Di quel file si pubblica il dove e il quando, mai il cosa succede.** Stagione, vento, notte,
quartieri attraversati, luoghi toccati, chi c'è in scena: leciti. `premise`, `problem`,
`resolution_mode`, `threshold_moment`, `seeds_*`, `key_phrase_*` e le `note` dei luoghi: no, sono
il contenuto dei libri (regola 7). Chi scrive l'estrazione mette in **whitelist** i campi che
escono, non in blacklist quelli che restano: una blacklist, al prossimo campo aggiunto al grafo,
pubblica un finale.

L'altra metà del vincolo: il pubblico di queste pagine è **il genitore, non il bambino**
(regola 10). L'unica superficie che gioca è `/gioco`. Quindi niente punteggi, niente barre di
completamento, niente "hai visto 7 luoghi su 18", niente sblocchi. Tutto è raggiungibile subito:
esplorare dà **più mondo**, non l'accesso al mondo. Il gioco dell'isola non ha battaglie e la
vetrina non ha quiz: lo spirito è lo stesso, cose piccole da trovare, nessuna prestazione
richiesta.

E la condizione che tiene in piedi tutto il resto: **l'esplorazione è additiva.** Chi arriva di
sera, scorre e se ne va deve ricevere lo stesso il messaggio intero, cos'è la saga, com'è
disegnata, dov'è il libro. Se qualcosa si capisce solo cliccando, non è un prodotto: è un
indovinello.

## I lavori, in ordine di valore

### A. I due quartieri mancanti — è un difetto, non un miglioramento

`/mondo` dichiara "L'isola è divisa in quattro quartieri — aria, acqua, fuoco, terra — più il
centro" e poi mostra **tre schede**: villaggio, quartiere di Fuoco, quartiere d'Aria. Il testo
promette quattro cose e la pagina ne dà tre.

**Non è solo `/mondo`.** La stessa promessa è in home, `app/page.tsx:99`: "Il villaggio, i
quattro quartieri, le Montagne Gemelle, il Fiume che Gira". Se sistemi solo `/mondo`, la
contraddizione resta sulla pagina che vede più gente. Le superfici da tenere d'accordo sono due.

Causa verificata: nel canone `visual/atlante/tavole/` **esistono solo** le tavole di villaggio,
quartiere d'Aria e quartiere di Fuoco. Le tavole d'Acqua e di Terra non sono mai state disegnate,
e lo stesso vale per le varianti `*_vivo.jpg`.

Materiale canonico che invece **esiste** ed è utilizzabile:

| Quartiere | File nel canone |
|---|---|
| acqua | `visual/luoghi/quartiere_acqua/spiaggia_conchiglie/immagini/spiaggia_conchiglie_canonica_v1_panoramica.jpg` |
| terra | `visual/luoghi/quartiere_terra/orti_del_cerchio/immagini/orti_del_cerchio_canonica_v1_panoramica.jpg` |
| terra | `visual/luoghi/quartiere_terra/foresta_intrecciata/immagini/foresta_intrecciata_canonica_v1_interno.jpg` |
| terra | `visual/luoghi/quartiere_terra/foresta_intrecciata/radura_dei_pini/immagini/radura_dei_pini_canonica_v1_margine.jpg` |
| terra | `visual/luoghi/quartiere_terra/orti_del_cerchio/immagini/orti_del_cerchio_canonica_v1_coltivatori_al_lavoro.jpg` |

I cinque percorsi qui sopra sono verificati sul canone: esistono verbatim. La radura dei
pini sta **dentro** `foresta_intrecciata/`, non direttamente sotto il quartiere.

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

### G. Il tessuto connettivo — il modulo dati da cui dipendono B ed E

È il lavoro che trasforma il principio qui sopra in codice, ed è piccolo: un modulo dati
committato, generato da uno script che si lancia a mano con il canone checkato accanto.

**Il sito non deve mai dipendere dal canone in build.** `isola_i3v_visual` è un repo separato e
in sola lettura: `npm run check` deve continuare a funzionare su una macchina che non ce l'ha su
disco. Lo script si lancia quando il canone cambia, l'output si committa e si rilegge a mano
esattamente come si fa con `lib/canone.ts` (regola 2). Nessuna generazione dentro `next build`,
nessun fetch, nessun submodule.

```
node scripts/estrai-legami.mjs --canone ../isola_i3v_visual   ->   lib/legami.ts   (committato)
```

Cosa contiene: per ogni luogo pubblicabile id, nome, quartiere, categoria, geometria proiettata e
abitante quando c'è; per ogni storia i quartieri attraversati, i luoghi, il cast, la stagione, il
vento e se è notturna. Whitelist dei campi, come sopra.

Cosa apre, una volta che esiste:

- **`/mappa` diventa la spina dorsale** invece di una pagina fra sette: da un luogo si arriva a
  chi ci abita, alle storie che ci passano, all'illustrazione che lo mostra. È il lavoro B, che
  senza questo modulo resta un SVG muto, solo più nitido del JPEG di oggi.
- **`/mondo` guadagna il dove.** Dieci abitanti su diciotto hanno già una casa georiferita. Gli
  altri otto — i tre fratelli e i cinque cuccioli — nel geojson non ce l'hanno: dichiaralo, non
  inventargliela (regola 2 di questi guard rail).
- **`/storie` smette di essere solo testo.** Ogni storia può mostrare dove passa e in che
  stagione senza dire come va a finire: una storia d'inverno, di notte, sulle Montagne Gemelle è
  già un'immagine e non spoilera niente. Le tre notturne hanno persino l'atmosfera già in
  `public/media/isola/notturna.webp`.
- **`/giornate` si ancora al mondo.** Le didascalie nominano già la Foresta Intrecciata, gli
  Orti, la Spiaggia delle Conchiglie, il Pontile, la Roccia Alta: sono luoghi del geojson, e
  collegarli costa quasi zero.

E chiude il cerchio su A: i quartieri attraversati dalle dodici storie coprono tutti e quattro i
quartieri, più il centro e il perimetro del Fiume. I quattro quartieri non sono un modo di dire
nel testo di `/mondo`, sono la struttura su cui il canone indicizza le storie. Ragione in più
perché la pagina non ne mostri tre.

Vincolo suo proprio, oltre a tutti i guard rail: **ogni collegamento è un link vero**:
navigabile, con un URL, raggiungibile senza JavaScript. Un pannello che si apre solo al clic non
è informazione vissuta, è informazione nascosta.

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
A questi si aggiunge `lib/legami.ts` appena esiste: lo scrive lo script di G, non le mani.

Suggerimento di sequenza:

1. **In parallelo, indipendenti:** A (quartieri) · C (rosone SVG) · F (sitemap, robots, JSON-LD)
   · G (il modulo dati). G è piccolo ma sta sul cammino critico: fallo partire subito, perché
   B ed E aspettano il suo output.
2. **Poi, sulla base stabilizzata:** B (mappa SVG) — è il lavoro grosso, dagli spazio e un
   subagente dedicato che possa anche scrivere lo script di proiezione. Legge `lib/legami.ts`.
3. **Poi:** E (immagini nelle altre superfici, lightbox), che usa gli stessi legami per ancorare
   le illustrazioni ai luoghi.
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
