/**
 * Quello che si muove.
 *
 * Poco, e piano. Una mappa non è un cartone animato: se si muove troppo, chi la
 * guarda smette di leggerla e comincia a guardare il movimento. Qui si muovono
 * solo le cose che sull'isola si muovono davvero — le nuvole impigliate fra le
 * cime, il fumo del Forno, il luccichio sull'acqua, la corrente del fiume — e si
 * muovono lentamente, in cicli lunghi e sfasati, così non si vede il ritmo.
 *
 * Vive dentro l'SVG, in un `<style>`, non fuori: il disegno si serve come
 * immagine, e un'immagine non porta con sé il CSS di chi la mostra né può
 * chiedere JavaScript. Le animazioni CSS dentro un SVG servito come immagine
 * girano lo stesso — è l'unico modo perché questa mappa sia viva anche
 * incorniciata in un `<img>`.
 *
 * **Chi ha chiesto di non vedere animazioni non ne vede.** La media query sta
 * qui dentro e vale nel documento SVG: non è una cortesia, è la regola.
 */

/** Quanti gruppi di onde luccicano sfasati: tre bastano perché non battano il tempo. */
export const ONDATE = 3;

export const stileVita = () => `
.nuvole{animation:deriva 90s ease-in-out infinite}
.nuvole--lente{animation-duration:140s;animation-direction:reverse}
@keyframes deriva{0%,100%{transform:translateX(-10px)}50%{transform:translateX(14px)}}

.fumo{animation:sale 9s linear infinite;transform-origin:center bottom}
@keyframes sale{0%{opacity:0;transform:translate(0,10px) scale(.6)}25%{opacity:1}100%{opacity:0;transform:translate(-14px,-46px) scale(1.5)}}

.onde{animation:luccica 7s ease-in-out infinite}
@keyframes luccica{0%,100%{opacity:.55}50%{opacity:1}}

.corrente{animation:scorre 6s linear infinite}
@keyframes scorre{to{stroke-dashoffset:-120}}

@media (prefers-reduced-motion:reduce){
.nuvole,.fumo,.onde,.corrente{animation:none}
.fumo{opacity:.5}
}
`.trim();
