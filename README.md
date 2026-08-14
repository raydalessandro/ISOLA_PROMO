# L'Isola dei Tre Venti — sito di lancio

Sito pubblico della saga illustrata di **Beatrice Mercuri** (Spirale Editrice): dodici storie
per bambini dai 3 ai 6 anni, in quattro volumi, uno per stagione.

Sta online prima che partano i social e fa da base d'atterraggio per i post che verranno.
È una **vetrina**: racconta il mondo, mostra il libro e dichiara — senza fingere link — che
Amazon e i canali social sono in arrivo.

Cinque superfici più il gioco:

- `/` — l'isola, i tre venti, il primo volume;
- `/mondo` — i diciotto abitanti e i quartieri;
- `/storie` — le dodici storie, per volume;
- `/mappa` — l'isola vista dall'alto;
- `/giornate` — le 40 illustrazioni social, la casa dei post che verranno;
- `/libro` — il Volume 1, dentro e fuori;
- `/gioco` — l'avventura sull'isola.

## Avvio

```bash
npm install
npm run dev
```

Il service worker è attivo **solo nelle build di produzione** (`npm run build && npm start`),
così in sviluppo non si servono mai risorse dalla cache.

## Da dove viene il contenuto

`lib/canone.ts` è la fonte unica: storie, venti, volumi, personaggi, luoghi, canali. Le pagine
non tengono dati propri.

Il canone vero vive in [`raydalessandro/isola_i3v_visual`](https://github.com/raydalessandro/isola_i3v_visual)
— grafo delle 12 storie, 116 schede di entità, illustrazioni canoniche — ed è **in sola lettura**.
`lib/canone.ts` ne è una proiezione pubblica ridotta, aggiornata a mano: nessuna generazione
automatica, nessuna seconda verità.

Delle storie si pubblicano **titolo e una riga**. I racconti stanno nei libri: le righe dicono
dove si va, non come va a finire.

### I legami fra le cose

`lib/canone.ts` dice chi sono i personaggi e quali sono le storie. `lib/legami.ts` dice
**dove stanno**: quali luoghi compongono ciascun quartiere, chi ci abita, per dove passano le
dodici storie e in che stagione.

Non è scritto a mano: lo genera `scripts/estrai-legami.mjs` da due file del canone —
`cartografia/geo/island.geojson` (105 luoghi georiferiti) e `pipeline_narrativa/story_graph.json`.
Il bello è che le chiavi combaciano già da sole: la proprietà `inhabitant` dei luoghi usa gli
stessi identificativi dei personaggi di `canone.ts`, e `characters_in_scene` delle storie pure.
Nessuna tabella di corrispondenza da mantenere.

```bash
node scripts/estrai-legami.mjs --canone ../isola_i3v_visual
```

Si lancia a mano, con il canone checkato a parte, e l'output si committa. **Il sito non dipende
dal canone in build**: `npm run check` gira anche su una macchina che non ce l'ha. Il canone è un
altro repo, in sola lettura, e cambia senza avvisare questo: per questo `e2e/legami.spec.ts`
verifica che le due proiezioni continuino a combaciare.

Delle storie escono il dove e il quando — stagione, vento, notte, quartieri attraversati, chi c'è
in scena — e mai come vanno a finire. Il grafo è un documento di lavorazione pieno di finali: lo
script elenca i campi ammessi uno per uno, così un campo nuovo non arriva sul sito da solo.

Le coordinate sono proiettate in unità di viewBox SVG. Il riquadro inquadra l'isola: le due
"Isole all'Orizzonte" restano nel modulo ma cadono fuori, che è poi dove stanno davvero.

**Le posizioni però sono simboliche, e questo va saputo prima di disegnarci sopra.** Le coordinate
dicono in quale quartiere sta una cosa, e da che parte; non dove sta davvero. L'isola misura
7,9 × 6,7 km, ma la bottega e la casa di Nodo distano 5,4 metri e la scuola dalla casa di Stria
7,8: su un riquadro da mille unità è meno di un pixel, ed è il motivo per cui gli edifici del
villaggio si accavallano in un grumo.

Quindi le **aree dei quartieri** sono affidabili, e con esse l'appartenenza di ogni luogo. La
disposizione dentro un quartiere no: quella si prende dall'illustrazione di reference
(`public/media/isola/mappa.webp`) e dalle storie. Una mappa disegnata leggendo queste coordinate
come cartografia mostrerebbe un'isola che non è quella dei libri.

### Immagini

`public/media/` contiene le illustrazioni canoniche convertite in WebP a due larghezze
(`nome.webp` per lo schermo, `nome@2x.webp` per i display densi):

| Cartella | Cosa contiene | Sorgente |
|---|---|---|
| `personaggi/` | i 18 ritratti canonici | `visual/personaggi/individuali/` |
| `luoghi/` | il villaggio e i quattro quartieri | `visual/atlante/tavole/`, e per Acqua e Terra `visual/luoghi/` |
| `isola/` | arte di copertina, la mappa canonica, panoramica, notturna | `visual/atlante/isola/` |
| `emblema/` | il rosone dei tre venti, marchio del sito | `visual/atlante/emblema/` |
| `libro/` | i tre render del Volume 1 stampato | originali di Ray |
| `giornate/` | le 40 illustrazioni social, in due set da 20 | branch `immaginixsito` |

Le icone PWA si generano dal rosone: `npm run icons`.

## Le giornate dell'isola

`/giornate` raccoglie 40 illustrazioni che non stanno in nessun libro: momenti laterali della
vita sull'isola, disegnati sulle stesse reference canoniche dei volumi. Il primo set segue i tre
fratelli fra gli abitanti; il secondo è fatto di ritratti ambientati, un personaggio per volta.

Le didascalie non sono inventate: vengono dai brief che hanno generato le immagini
(`20_BRIEF_PRONTI.md` e `20_BRIEF_FOCUS_V2.md`), quindi dicono quello che l'immagine mostra
davvero. Servono anche da testo alternativo, e un test verifica che nessuna delle 40 ne sia priva.

Le sorgenti stanno nella branch [`immaginixsito`](https://github.com/raydalessandro/isola_i3v_visual/tree/immaginixsito)
di `isola_i3v_visual`, sotto `assets/social_isola_01_20` e `assets/social_isola_v2_01_20`.
Sono PNG da 6-8 MB e restano là: nel sito entrano solo come WebP a due larghezze.

Le cinque proporzioni del set (3:4, 1:1, 9:16, 4:5, 16:9) sono la ragione per cui la galleria usa
colonne CSS e non una griglia: ogni illustrazione tiene le sue proporzioni. Ritagliarle
significherebbe buttare via proprio la fascia alta che l'autrice ha lasciato quieta per il testo
dei post.

## Marchio e palette

Il segno della saga è il **rosone dei tre venti** — piuma, onda, foglie intorno a una spirale —
preso dall'atlante del canone. È un acquerello, e vuole spazio: a 34 px nella testata diventava
una macchia in cui non si distingueva niente. Il canone non ne ha una versione vettoriale, e
ridisegnarlo avrebbe voluto dire inventare un marchio che non esiste.

Nella testata il segno sono quindi **i tre punti dei venti**, in triangolo come stanno stampati
intorno all'isola sulla quarta di copertina: blu in alto, verde a sinistra, arancio a destra.
Prendono i colori dai token, reggono a qualsiasi dimensione e non inventano niente. Il rosone
resta la sorgente delle icone PWA (`npm run icons`), dove la dimensione gli rende giustizia.

I colori non sono inventati: i tre punti stampati sulla quarta di copertina del Volume 1,
campionati dal file di stampa, sono i colori dei tre venti.

| Token | Valore | Cos'è |
|---|---|---|
| `--carta` | `#faf6f0` | il fondo della quarta di copertina |
| `--taglio` | `#25537f` | il punto blu |
| `--intreccio` | `#267435` | il punto verde |
| `--mulinello` | `#c56823` | il punto arancio |
| `--mulinello-testo` | `#a8541a` | l'arancio quando diventa parola scritta |

L'accoppiata vento→colore segue le stagioni dei cicli (inverno taglia, primavera intreccia,
estate capovolge) ed è una **convenzione di questo sito**: il canone nomina i tre venti ma non
assegna loro un colore.

Il pieno arancio dei punti si ferma a 3,6:1 sulla carta: come testo non arriva ad AA, quindi
esiste la variante scura. Il quarto volume, dove soffiano tutti e tre i venti, non prende un
colore inventato — prende il filetto neutro.

## Il gioco

`/gioco` occupa lo schermo: la shell si toglie di mezzo, niente testata e niente barra bassa.

`lib/gioco/motore.js` è il prototipo HTML consegnato da Ray, portato quasi alla lettera. Rispetto
all'originale cambia solo quello che serve a vivere dentro una superficie che si monta e si
smonta: il canvas e i tasti si cercano dentro il contenitore invece che fra gli id del documento,
i listener su `window` passano da una funzione che li sa togliere, e il loop di animazione tiene
il proprio id per potersi fermare. Resta JavaScript e resta fuori da ESLint — riscriverlo in
TypeScript idiomatico vorrebbe dire riscrivere un gioco che funziona. Il contratto verso l'app è
tipizzato in `motore.d.ts`.

React possiede il DOM, il motore possiede il gioco: `components/gioco/console-isola.tsx` gli passa
il contenitore al montaggio e chiama allo smontaggio la funzione che ferma tutto e salva.
Il salvataggio sta in `localStorage` sotto `isola-save`.

Otto stelle in tutto: cinque commissioni degli abitanti, il memory coi cuccioli e le tre piccole
avventure che rifanno il verso alle storie del primo volume. Nessuna battaglia.

## Amazon e social

Il Volume 1 è stampato e la scheda Amazon è caricata: manca la data di pubblicazione.

Finché quella data non c'è, `canali` in `lib/canone.ts` tiene `url: null` e la UI mostra
"in arrivo" — non un pulsante che non porta da nessuna parte. Il giorno dell'uscita si riempie
l'`url` e il collegamento compare ovunque, da un punto solo. Un test e2e verifica che dal sito
non esca nessun link esterno finché i canali non esistono.

## Dati strutturati

`/libro` dichiara il Volume 1 in JSON-LD: titolo, autrice, editore, lingua, copertina rigida,
fascia d'età, i tre racconti che contiene.

Non dichiara **ISBN, data di pubblicazione, prezzo o disponibilità**. Il libro è stampato ma la
scheda Amazon non ha ancora una data: scrivere quei campi adesso sarebbe la stessa cosa di un
pulsante che non porta da nessuna parte, solo invisibile a chi legge e ben visibile a un motore
di ricerca. Entrano il giorno in cui esistono. Un test in `e2e/rifiniture.spec.ts` verifica che
non ci siano.

## Struttura

```
app/
  layout.tsx        metadati, viewport, shell
  page.tsx          l'apertura
  mondo/            abitanti e quartieri
  storie/           le dodici storie per volume
  mappa/            l'isola dall'alto
  libro/            il Volume 1
  gioco/            l'avventura, a schermo pieno
  offline/          ricaduta del service worker
  manifest.ts       manifest PWA generato
  sitemap.ts        le sette superfici, con URL assoluti
  robots.ts         apre tutto tranne la ricaduta offline
  error.tsx  global-error.tsx  not-found.tsx
  globals.css       solo import
  styles/           base, shell, home, mondo, storie, mappa, libro
components/
  shell.tsx           testata, barra bassa, chiusura
  icone.tsx           icone della barra bassa
  dati-strutturati.tsx JSON-LD del Volume 1
  gioco/            console e stili non globali del gioco
lib/
  canone.ts         fonte unica, scritta a mano
  legami.ts         luoghi, abitanti e storie: generato dal canone
  gioco/            motore portato dal prototipo
e2e/                test Playwright
public/
  icons/            icone PWA (generate)
  media/            illustrazioni
  sw.js             service worker
scripts/
  make-icons.mjs     rigenera le icone dal rosone
  check-media.mjs    verifica l'integrità dei binari
  estrai-legami.mjs  rigenera lib/legami.ts dal canone
```

## Configurazione

`NEXT_PUBLIC_SITE_URL` imposta il dominio pubblico usato dai metadati assoluti
(vedi `.env.example`). È facoltativa: `lib/base-url.ts` prova in ordine questa
variabile, il dominio di produzione del progetto Vercel, l'URL del singolo
deploy e infine localhost, scartando ogni candidato vuoto o malformato.

Quella catena non è pignoleria difensiva: al primo deploy la variabile esisteva
su Vercel ma era vuota, e `new URL("")` faceva cadere la build durante la
raccolta delle pagine. Una variabile impostata a stringa vuota non è una
variabile assente — su Vercel o le si dà un dominio, o la si toglie.

## Accessibilità

Le pagine passano axe-core su WCAG 2.1 AA senza violazioni, su viewport mobile e desktop.
Il contrasto va misurato sui pixel resi: il velo di carta su `body::before` copre tutta la
pagina. `--tenue` è il grigio più scuro che regge 4,5:1 sulla carta; sotto quello si esce da AA.

Il gioco è un canvas: chi non vede lo schermo non può giocarci. I tasti della console hanno
comunque un nome accessibile, e il gioco si comanda anche da tastiera (frecce, Z/Invio, X).

## Verifiche

```bash
npm run check      # typecheck + lint + integrità dei binari + build
npm run test:e2e   # build + Playwright su mobile e desktop
```

`check:media` confronta quanto ogni binario dichiara nel proprio header con quello che contiene
davvero. Serve perché un file troncato supera build, lint e typecheck senza segnalare nulla:
il browser mostra mezza illustrazione e non se ne accorge nessuno finché non è online.

La suite `e2e/` copre le cinque superfici, il conteggio di storie e abitanti, l'assenza di link
finti verso canali che non esistono, il gioco che parte davvero (si controlla che il canvas
smetta di essere vuoto), l'uscita dal gioco, la PWA offline e l'accessibilità. Gira in CI su ogni
push e pull request tramite `.github/workflows/ci.yml`.
