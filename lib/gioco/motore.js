/*
 * L'AVVENTURA DELL'ISOLA — motore di gioco.
 *
 * Portato quasi alla lettera dal prototipo HTML autonomo consegnato da Ray.
 * Le uniche modifiche rispetto all'originale sono quelle che servono a farlo
 * vivere dentro una superficie React che si monta e si smonta:
 *
 *   - il canvas e i tasti si cercano dentro `root`, non fra gli id del documento;
 *   - i listener su window passano da `onWindow`, così si possono togliere;
 *   - il loop di animazione tiene il proprio id, così si può fermare.
 *
 * Resta JavaScript e resta fuori da ESLint (vedi eslint.config.mjs): riscriverlo
 * in TypeScript idiomatico significherebbe riscrivere un gioco che funziona.
 * Il tipo pubblico sta in `motore.d.ts`.
 *
 * Salvataggio: localStorage, chiave `isola-save`.
 */

export function avviaGioco(root) {
  let rafId = 0;
  const suFinestra = [];
  const onWindow = (tipo, fn) => {
    window.addEventListener(tipo, fn);
    suFinestra.push([tipo, fn]);
  };

  /* ============================================================
     L'ISOLA DEI TRE VENTI — Avventura  (v0.1)
     Basato sul canone della saga: personaggi, luoghi e oggetti
     canonici. Niente battaglie: piccole avventure, commissioni,
     il memory con i cuccioli, e la Festa dei Tre Venti.
     ============================================================ */

  const cv = root.querySelector("[data-schermo]");
  const ctx = cv.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  /* ---------- PALETTE ---------- */
  const PAL = {
    K:"#181820", R:"#d04838", B:"#3868c8", S:"#f0c090", D:"#4a4038",
    W:"#f8f8f8", G:"#3a7a4a", L:"#9ac86a", Y:"#f0c040", O:"#e08a3a",
    P:"#e8a0b8", A:"#9aa0aa", E:"#c8b088"
  };

  function makeSprite(rows, mirror=false){
    const c = document.createElement("canvas"); c.width=16; c.height=16;
    const g = c.getContext("2d");
    for(let y=0;y<16;y++){
      const row = rows[y]||"";
      for(let x=0;x<16;x++){
        const ch = row[mirror?15-x:x];
        if(ch && ch!=="."){ g.fillStyle=PAL[ch]||"#000"; g.fillRect(x,y,1,1); }
      }
    }
    return c;
  }

  /* ---------- IL BAMBINO (giocatore) ---------- */
  const pDown0 = [
  "................",
  ".....KKKKKK.....",
  "....KRRRRRRK....",
  "...KRRRRRRRRK...",
  "...KRRRRRRRRK...",
  "...KKKKKKKKKK...",
  "...KSKSSSSKSK...",
  "...KSSSSSSSSK...",
  "....KSSSSSSK....",
  ".....KKKKKK.....",
  "....KBBBBBBK....",
  "...KSBBBBBBSK...",
  "...KKBBBBBBKK...",
  ".....KBBBBK.....",
  ".....KDKKDK.....",
  ".....KK..KK....."];
  const pDown1 = pDown0.slice(0,13).concat([
  ".....KBBBBK.....",
  "....KDK.KDK.....",
  "....KK....K....."]);
  const pUp0 = [
  "................",
  ".....KKKKKK.....",
  "....KRRRRRRK....",
  "...KRRRRRRRRK...",
  "...KRRDDDDRRK...",
  "...KKKKKKKKKK...",
  "...KDDDDDDDDK...",
  "...KDDDDDDDDK...",
  "....KDDDDDDK....",
  ".....KKKKKK.....",
  "....KBBBBBBK....",
  "...KSBBBBBBSK...",
  "...KKBBBBBBKK...",
  ".....KBBBBK.....",
  ".....KDKKDK.....",
  ".....KK..KK....."];
  const pUp1 = pUp0.slice(0,13).concat([
  ".....KBBBBK.....",
  "....KDK.KDK.....",
  "....KK....K....."]);
  const pSide0 = [
  "................",
  ".....KKKKK......",
  "....KRRRRRK.....",
  "...KRRRRRRK.....",
  "...KRRRRRRRK....",
  "...KKKKKKKK.....",
  "...KSKSSSKK.....",
  "...KSSSSSK......",
  "....KSSSK.......",
  ".....KKKK.......",
  "....KBBBBK......",
  "....KBBBBSK.....",
  "....KBBBBK......",
  ".....KBBK.......",
  ".....KDDK.......",
  ".....KKKK......."];
  const pSide1 = pSide0.slice(0,13).concat([
  ".....KBBK.......",
  "....KDKKDK......",
  "....KK..KK......"]);
  const SPR = {
    down:[makeSprite(pDown0), makeSprite(pDown1), makeSprite(pDown0), makeSprite(pDown1,true)],
    up:  [makeSprite(pUp0),   makeSprite(pUp1),   makeSprite(pUp0),   makeSprite(pUp1,true)],
    left:[makeSprite(pSide0), makeSprite(pSide1), makeSprite(pSide0), makeSprite(pSide1)],
    right:[makeSprite(pSide0,true), makeSprite(pSide1,true), makeSprite(pSide0,true), makeSprite(pSide1,true)]
  };

  /* ---------- GLI ABITANTI DELL'ISOLA (canone) ---------- */
  const artFiamma = [   // volpe rossa, fornaia, col grembiule
  "..KK........KK..",
  ".KOOK......KOOK.",
  ".KOWOK....KOWOK.",
  "..KOOOKKKKOOOK..",
  "..KOOOOOOOOOOK..",
  ".KOOWKOOOOWKOOK.",
  ".KOOKKOOOOKKOOK.",
  ".KWWOOOKKOOOWWK.",
  "..KWWWOOOOWWWK..",
  "..KOOWWWWWWOOK..",
  "...KWWWWWWWWK...",
  "...KWWWWWWWWK...",
  "...KOOWWWWOOK...",
  "....KOKKKKOK....",
  "....KK....KK....",
  "................"];
  const artStria = [    // airone cenerino, maestra, con lo scialle
  "......KKK.......",
  ".....KAAAK......",
  ".....KAWAK......",
  ".....KAAAKKY....",
  "......KAAKYY....",
  "......KAAK......",
  "......KAAK......",
  ".....KAAAAK.....",
  "....KAAAAAAK....",
  "...KAPPPPPPAK...",
  "...KAAAAAAAAK...",
  "...KAAAAAAAAK...",
  "....KAAAAAAK....",
  ".....KKKKKK.....",
  "......KY.KY.....",
  "................"];
  const artMemolo = [   // riccio, zio buffo, con la sciarpa
  "....KKKKKKK.....",
  "...KDDDDDDDK....",
  "..KDDDDDDDDDK...",
  ".KDDDDDDDDDDDK..",
  ".KDDSSSSSSSDDK..",
  ".KDSWKSSSWKSDK..",
  ".KDSKKSSSKKSDK..",
  ".KDSSSSKSSSSDK..",
  ".KDDSSSSSSSDDK..",
  ".KRRRRRRRRRRRK..",
  "..KRRRRRRRRRK...",
  "..KDDDDDDDDDK...",
  "...KDDDDDDDK....",
  "....KKKKKKK.....",
  "....KS...KS.....",
  "................"];
  const artBartolo = [  // tartaruga di mare anziana, il pontile
  "....KKKKKKKK....",
  "...KGGGGGGGGK...",
  "..KGLGGLLGGLGK..",
  ".KGGLGGLLGGLGGK.",
  ".KGGGGGGGGGGGGK.",
  ".KGLLGGLLGGLLGK.",
  ".KGGGGGGGGGGGGK.",
  "..KGGGGGGGGGGK..",
  "...KKKKKKKKKK...",
  "....KLLLLLLK....",
  "...KLWKLLWKLK...",
  "...KLKKLLKKLK...",
  "...KLLLLLLLLK...",
  "....KKKKKKKK....",
  "..KLK......KLK..",
  "................"];
  const artSalvia = [   // lepre, cure ed erbe
  "...KK....KK.....",
  "..KEEK..KEEK....",
  "..KEPEK.KEPEK...",
  "..KEEK..KEEK....",
  "...KEEKKEEK.....",
  "...KEEEEEEK.....",
  "..KEWKEEWKEK....",
  "..KEKKEEKKEK....",
  "..KEEEKKEEEK....",
  "...KEEEEEEK.....",
  "..KWWWWWWWWK....",
  "..KWWWWWWWWK....",
  "..KOKWWWWKOK....",
  "...KWWWWWWK.....",
  "....KE..KE......",
  "................"];
  const artNodo = [     // picchio, la bottega, mano che fa
  "......KKK.......",
  ".....KRRRK......",
  "....KKKKKKK.....",
  "....KDWDDDK.....",
  "...KDDDDDDKYY...",
  "....KDDDDDK.....",
  "....KWWDDDK.....",
  "...KWWWDDDDK....",
  "...KWWWDDDDK....",
  "...KWWDDDDDK....",
  "....KWDDDDK.....",
  "....KDDDDK......",
  ".....KKKK.......",
  ".....KY.KY......",
  "................",
  "................"];
  const artRovo = [     // tasso con la bandana, resistenza che protegge
  "....KKKKKKKK....",
  "...KRRRRRRRRK...",
  "..KWWKWWWKWWWK..",
  "..KWKKWWWKKWWK..",
  "..KWKKWKWKKWWK..",
  "..KWWKWWWKWWWK..",
  "..KWWWKKKWWWWK..",
  "...KWWWWWWWWK...",
  "...KDDDDDDDDK...",
  "..KDDDDDDDDDDK..",
  "..KDDDDDDDDDDK..",
  "..KDDDDDDDDDDK..",
  "...KDDDDDDDDK...",
  "....KKKKKKKK....",
  "...KDK....KDK...",
  "................"];
  const artGrunto = [   // stambecco verde vecchio, la grotta
  ".KK..........KK.",
  "KOOK........KOOK",
  ".KOOK......KOOK.",
  "..KOOKKKKKKOOK..",
  "...KLLLLLLLLK...",
  "..KLLWKLLWKLLK..",
  "..KLLKKLLKKLLK..",
  "..KLWWLLLLWWLK..",
  "...KWWWWWWWWK...",
  "...KLLLLLLLLK...",
  "..KLLLLLLLLLLK..",
  "..KLLLLLLLLLLK..",
  "...KLLLLLLLLK...",
  "....KKKKKKKK....",
  "...KLK....KLK...",
  "................"];
  const artZolla = [    // scoiattolo grigio anziano, gli orti
  ".........KKK....",
  "........KAAAK...",
  "KK......KAAAAK..",
  "KAAK...KAAAAAK..",
  "KAAAK..KAAAK....",
  ".KAAAKKAAAAK....",
  ".KAAAAAAAAK.....",
  "..KAWKAAWKK.....",
  "..KAKKAAKK......",
  "..KAAAAAAK......",
  "..KAAAAAAAK.....",
  "..KAAAAAAAK.....",
  "...KAAAAAK......",
  "....KKKKK.......",
  "...KAK.KAK......",
  "................"];
  /* i pastori dei Pascoli Alti */
  const artPastore = [
  "......KKKK......",
  ".....KEEEEK.....",
  "....KEEEEEEK....",
  "....KESKKSEK....",
  "....KESSSSEK....",
  ".....KEEEEK..K..",
  "....KAAAAAAK.K..",
  "...KAAAAAAAAKK..",
  "...KAAAAAAAAKK..",
  "...KAAAAAAAAKK..",
  "...KAAAAAAAAKK..",
  "....KAAAAAAK.K..",
  "....KAAAAAAK.K..",
  ".....KKKKKK..K..",
  "....KAK..KAK.K..",
  "................"];
  const artPecora = [
  "................",
  "................",
  "................",
  "...KKKKKKK......",
  "..KWWWWWWWK.....",
  ".KWWWWWWWWWK....",
  ".KWWWWWWWWWK....",
  "KDDKWWWWWWWK....",
  "KDDKWWWWWWWK....",
  "KDKKWWWWWWK.....",
  "..K.KKKKKK......",
  "....KK..KK......",
  "................",
  "................",
  "................",
  "................"];
  /* i cuccioli */
  const artBru = [
  "................",
  "................",
  "....KKKKKK......",
  "...KWWKWWWK.....",
  "...KWKKWKWK.....",
  "...KWKKWKWK.....",
  "...KWWKWWWK.....",
  "....KWWWWK......",
  "...KDDDDDDK.....",
  "...KDDDDDDK.....",
  "....KDDDDK......",
  ".....KKKK.......",
  "....KDK.KDK.....",
  "................",
  "................",
  "................"];
  const artPun = [
  "................",
  "................",
  "....KKKKKK......",
  "...KDDDDDDK.....",
  "..KDDSSSSDDK....",
  "..KDSWKSWKDK....",
  "..KDSKKSKKDK....",
  "..KDSSSKSSDK....",
  "..KDDSSSSDDK....",
  "...KDDDDDDK.....",
  "....KKKKKK......",
  "....KS..KS......",
  "................",
  "................",
  "................",
  "................"];
  const artToba = [
  "................",
  "................",
  ".....KKKKKK.....",
  "....KGYGGYGK....",
  "...KGGYGGYGGK...",
  "...KGYGGGGYGK...",
  "...KGGGGGGGGK...",
  "....KKKKKKKK....",
  ".....KLLLLK.....",
  "....KLWKLWKK....",
  "....KLKKLKKK....",
  "....KLLLLLLK....",
  ".....KKKKKK.....",
  "....KLK..KLK....",
  "................",
  "................"];

  /* ---------- LA MAPPA DELL'ISOLA (generata e verificata) ---------- */
  const ISOLA = [
  "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
  "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
  "wwwMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMwww",
  "wwwMMMMMMMMM....C.......MMMMMMMMMMMMMMMMMMMMMwww",
  "wwwMMMMMMMMM........ttt.MMMMMMMMMMMMMMMMMMMMMwww",
  "wwwMMMMMMMMM.ttt........MMMMMMMMMMMMMMMMMMMMMwww",
  "wwwMMMMMMMMM.....p......MMMMMMMMMMMwwMMMMMMMMwww",
  "www......ww......p.................ww........www",
  "www......ww......p,...,............ww........www",
  "www......ww......p.................ww........www",
  "www......ww......p.,...............ww.RRR....www",
  "www.RRR..ww......p.................ww.RRR....www",
  "www.RRR..ww......p.................ww.WWW....www",
  "www.WWW..ww......p.RRRR.......T....ww........www",
  "www....ffww......p.RRRR..........T.ww..rrrr..www",
  "www.,,,,,ww......p.WWWW.....,......ww..rrrr..www",
  "www.,,,,,ww...ppppppppppppAppp.....ww..WWWW..www",
  "www.,,,,,ww.,.pppppppppppppppp.....ww........www",
  "www.ppppppppppppppppppppppppppppppppppppp....www",
  "www......ww...ppppppppppppppppRRR..ww........www",
  "www......pp...ppppppppppppppppRRR..wwtt..ttt.www",
  "www......ww..TppppppopppppppppWWW..wwtt..ttt.www",
  "www......ww...pspppppppppppppp...,.ww....ttt.www",
  "www.RRR..ww..,..........p..........ww........www",
  "www.RRR..ww....RRR......p..tt......ww....,...www",
  "www.WWW..ww....RRR.ttt..p..tt..T...ww.T......www",
  "www......ww....WWW.ttt..p.......T..ww..T.....www",
  "wwwTTTTTTTTtt...........p...,......ww........www",
  "wwwTTTpTTTTTT.......T..,p..........ww........www",
  "wwwTTTpTTTTTT........T..p..........ww........www",
  "wwwTTTpCTTTTT.RRRR......p....tt....pp........www",
  "wwwTTTppppppT.RRRR......p..........ww........www",
  "wwwTTTpTTTTTT.WWWW......p..........ww........www",
  "wwwTTTpTTTTTTaaaaaaaaaaakaaaaaaaaaaww........www",
  "wwwTTTpTTTTTTaaaaaaaaaaakaaaaaaaaaaww........www",
  "wwww.....wwaaaaaaaaaaaaakaaaaaaaaaaww.......wwww",
  "wwww.....wwaaaaaaaaaaaaakaaaaaaaaaaww.......wwww",
  "wwwww...................k..................wwwww",
  "wwwwwwwwwwwwwwwwwwwwwwwwkwwwwwwwwwwwwwwwwwwwwwww",
  "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww"];
  const MONTI = [
  "MMNNNNNNNNNNMMMMMMNNNNNNNNNNMM",
  "MMNNNNNNNNNNMMMMMMNNNNNNNNNNMM",
  "MMMMNNNNNNMMMMMMMMMMNNNNNNMMMM",
  "MMMMMMMMMMMMMMMMMCMMMMMMMMMMMM",
  "MMMMMMMMpppppppppppMMMMMMMMMMM",
  "MMMMMMMMpMMMMMMMMMMMMMMMMMMMMM",
  "MMMMMMMMpMMMMMMMMMMMMMMMMMMMMM",
  "MMMMMMMMpMMMMMMMMMMMMMMMMMMMMM",
  "MMMMMMMMpMvvvvvvvvvvvvvvvvvMMM",
  "MMMMMMMMpMvvvvvvvvvvvvvvvvvMMM",
  "MMMMMMMMpppppppppppppppMMMMMMM",
  "MMMMMMMMMMMMMMMMMMMMMMpMMMMMMM",
  "MMMMMMMMMMMMMMMMMMMMMMpMMMMMMM",
  "MMMMMMMMMMMMMMMMMMMMMMpMMMMMMM",
  "MMMMMMMMMMMMMMMMMMMMMMpMMMMMMM",
  "MMMMMMMMMMMMMMMMMMMMMMpMMMMMMM",
  "MMMMMMMMMMMMMMMMMMMMMMpMMMMMMM",
  "MMMMMMMMMMMMMMpppppppppMMMMMMM",
  "MMMM..........p......MMMMMMMMM",
  "MMMM...ww.....p......MMMMMMMMM",
  "MMMM...ww.....p.tt...MMMMMMMMM",
  "MMMM.tt.......p.tt...MMMMMMMMM",
  "MMMM.tt.....t.p......MMMMMMMMM",
  "MMMM..........p......MMMMMMMMM",
  "MMMMMMMMMMMMMppppMMMMMMMMMMMMM",
  "MMMMMMMMMMMMMppppMMMMMMMMMMMMM"];
  const MAPS = { isola:ISOLA, monti:MONTI };
  let curMap = "isola";
  const mrows = ()=>MAPS[curMap];
  function tileAt(x,y){
    const rows=mrows();
    if(x<0||y<0||y>=rows.length||x>=rows[0].length) return curMap==="isola"?"w":"M";
    return rows[y][x] || (curMap==="isola"?"w":"M");
  }
  const SOLID = new Set(["w","T","M","N","v","o","A","R","r","W","f","s","C"]);
  const WARPS = {
    "isola:16,3":["monti",14,24],
    "monti:13,25":["isola",17,4], "monti:14,25":["isola",17,4],
    "monti:15,25":["isola",17,4], "monti:16,25":["isola",17,4]
  };

  /* ---------- TILESET ---------- */
  function makeTile(fn){
    return [0,1].map(f=>{
      const c=document.createElement("canvas");c.width=16;c.height=16;
      fn(c.getContext("2d"),f); return c;
    });
  }
  const px=(g,c,x,y,w=1,h=1)=>{g.fillStyle=c;g.fillRect(x,y,w,h);};
  const grassBase=g=>{ px(g,"#8fce62",0,0,16,16);
    [[3,4],[11,2],[7,9],[13,12],[2,13],[9,6]].forEach(([x,y])=>px(g,"#7bbb50",x,y,2,1)); };
  const TILES = {
    ".": makeTile(g=>grassBase(g)),
    ",": makeTile((g,f)=>{ grassBase(g);
        const col = f? "#f0d030":"#e05858";
        px(g,col,5,5,2,2); px(g,col,9,9,2,2); px(g,"#f8f8e0",5,5,1,1); px(g,"#f8f8e0",9,9,1,1); }),
    "t": makeTile((g,f)=>{ grassBase(g);
        g.fillStyle="#2e8b3a";
        for(let i=0;i<4;i++){ const x=i*4+(f?1:0);
          g.fillRect(x,6,1,9); g.fillRect(x+1,4,1,11); g.fillRect(x+2,7,1,8); }
        px(g,"#1f6b2c",0,14,16,2); }),
    "p": makeTile(g=>{ px(g,"#e8d8a0",0,0,16,16);
        [[2,3],[12,5],[6,11],[10,13],[14,9]].forEach(([x,y])=>px(g,"#d4c288",x,y,2,1));
        px(g,"#cbb87c",0,0,16,1); }),
    "T": makeTile(g=>{ grassBase(g);
        px(g,"#1f6b2c",1,0,14,10); px(g,"#2e8b3a",2,1,12,7);
        px(g,"#5aa348",3,2,4,2); px(g,"#5aa348",9,3,3,2);
        px(g,"#181820",1,0,14,1); px(g,"#6b4a2b",6,10,4,5); px(g,"#4c3018",6,10,1,5);
        px(g,"#1f6b2c",0,15,16,1); }),
    "w": makeTile((g,f)=>{ px(g,"#4090e0",0,0,16,16);
        g.fillStyle="#78b8f0";
        const o=f?3:0;
        g.fillRect(1+o,3,5,1); g.fillRect(8+o,8,5,1); g.fillRect(3+o,12,5,1);
        px(g,"#2c6ab0",0,15,16,1); }),
    "M": makeTile(g=>{ px(g,"#8a8a98",0,0,16,16);
        px(g,"#a2a2b0",1,1,6,5); px(g,"#a2a2b0",9,6,6,5);
        px(g,"#6e6e7c",0,11,16,5); px(g,"#5c5c6a",3,7,4,3);
        px(g,"#181820",0,15,16,1); }),
    "C": makeTile(g=>{ px(g,"#8a8a98",0,0,16,16);
        px(g,"#6e6e7c",0,0,16,3);
        px(g,"#181820",4,5,8,11); px(g,"#101018",5,7,6,9);
        px(g,"#a2a2b0",2,3,2,2); px(g,"#a2a2b0",12,4,2,2); }),
    "a": makeTile(g=>{ px(g,"#eeda9e",0,0,16,16);
        [[3,3],[12,6],[7,10],[13,13],[2,12],[9,4]].forEach(([x,y])=>px(g,"#dfc784",x,y,2,1));
        px(g,"#f6e8b8",5,7,1,1); px(g,"#f6e8b8",11,11,1,1); }),
    "k": makeTile((g,f)=>{ px(g,"#4090e0",0,0,16,16);
        g.fillStyle="#78b8f0"; g.fillRect(f?2:6,13,5,1);
        px(g,"#b08850",1,0,14,12); px(g,"#8a6538",1,3,14,1);
        px(g,"#8a6538",1,7,14,1); px(g,"#8a6538",1,11,14,1);
        px(g,"#6b4a2b",1,0,1,12); px(g,"#6b4a2b",14,0,1,12); }),
    "o": makeTile(g=>{ grassBase(g);
        px(g,"#8a8a98",2,4,12,10); px(g,"#6e6e7c",2,4,12,2);
        px(g,"#181820",5,7,6,5);
        px(g,"#6b4a2b",3,0,2,5); px(g,"#6b4a2b",11,0,2,5); px(g,"#8a6538",3,0,10,2); }),
    "A": makeTile(g=>{ px(g,"#1f6b2c",0,0,16,12); px(g,"#2e8b3a",1,1,14,9);
        px(g,"#5aa348",2,2,5,3); px(g,"#5aa348",9,3,4,3); px(g,"#181820",0,0,16,1);
        px(g,"#6b4a2b",5,12,6,4); px(g,"#4c3018",5,12,2,4);
        px(g,"#8fce62",0,12,5,4); px(g,"#8fce62",11,12,5,4); }),
    "R": makeTile(g=>{ px(g,"#c04848",0,0,16,16);
        px(g,"#a83838",0,5,16,1); px(g,"#a83838",0,11,16,1);
        px(g,"#e07070",0,0,16,2); px(g,"#181820",0,15,16,1); }),
    "r": makeTile(g=>{ px(g,"#e08a3a",0,0,16,16);
        px(g,"#c8722c",0,5,16,1); px(g,"#c8722c",0,11,16,1);
        px(g,"#f0aa60",0,0,16,2); px(g,"#181820",0,15,16,1); }),
    "W": makeTile(g=>{ px(g,"#f0e0c0",0,0,16,16);
        px(g,"#d8c8a0",0,0,1,16); px(g,"#d8c8a0",15,0,1,16);
        px(g,"#b8a880",2,3,5,5); px(g,"#78b8f0",3,4,3,3); px(g,"#b8a880",9,3,5,5); px(g,"#78b8f0",10,4,3,3);
        px(g,"#c8b890",0,14,16,2); }),
    "f": makeTile(g=>{ grassBase(g);
        px(g,"#b08850",1,5,14,3); px(g,"#b08850",1,10,14,3);
        px(g,"#8a6538",2,3,2,11); px(g,"#8a6538",12,3,2,11);
        px(g,"#6b4a2b",1,7,14,1); px(g,"#6b4a2b",1,12,14,1); }),
    "s": makeTile(g=>{ grassBase(g);
        px(g,"#b08850",2,2,12,8); px(g,"#8a6538",2,2,12,1); px(g,"#8a6538",2,2,1,8);
        px(g,"#6b4a2b",4,4,8,1); px(g,"#6b4a2b",4,6,8,1);
        px(g,"#8a6538",7,10,2,5); }),
    "N": makeTile(g=>{ px(g,"#8a8a98",0,0,16,16);
        px(g,"#f0f4f8",0,0,16,6); px(g,"#d8e2ec",2,6,5,2); px(g,"#d8e2ec",10,6,4,3);
        px(g,"#6e6e7c",0,12,16,4); px(g,"#a2a2b0",4,9,3,2); }),
    "v": makeTile(g=>{ px(g,"#101018",0,0,16,16);
        px(g,"#2a2a38",0,0,16,2); px(g,"#3a3a48",2,0,2,4); px(g,"#3a3a48",9,0,3,3);
        px(g,"#2a2a38",0,14,16,2); px(g,"#3a3a48",5,13,2,3); px(g,"#3a3a48",12,12,2,4); })
  };

  /* ---------- AUDIO ---------- */
  let AC=null;
  function audio(){ if(!AC){ try{AC=new (window.AudioContext||window.webkitAudioContext)();}catch(e){} } if(AC&&AC.state==="suspended")AC.resume(); }
  function beep(freq,dur,delay=0,vol=0.12,type="square"){
    if(!AC)return;
    const t=AC.currentTime+delay, o=AC.createOscillator(), g=AC.createGain();
    o.type=type;o.frequency.value=freq;
    g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(0.001,t+dur);
    o.connect(g);g.connect(AC.destination); o.start(t);o.stop(t+dur);
  }
  const sfx = {
    a:()=>beep(880,.07),
    b:()=>beep(440,.07),
    flip:()=>beep(700,.05),
    match:()=>{beep(780,.08);beep(1040,.12,.08);},
    nomatch:()=>beep(180,.12,0,.1),
    pick:()=>{beep(660,.08);beep(880,.1,.08);},
    star:()=>{[523,659,784,1047,1318].forEach((f,i)=>beep(f,.12,i*.09));},
    msg:()=>beep(980,.04,0,.07),
    wind:()=>{beep(300,.5,0,.04,"sine");beep(380,.5,.2,.04,"sine");}
  };

  /* ---------- SALVATAGGIO ---------- */
  function loadSave(){
    try{
      const d=JSON.parse(localStorage.getItem("isola-save"));
      if(d && Array.isArray(d.q)) return d;
    }catch(e){}
    return null;
  }
  function doSave(){
    try{
      localStorage.setItem("isola-save", JSON.stringify({
        q:qs, carry:[...carry], cucc, s01, s01Talk, s02, s03, cor:cornetto?1:0,
        pg:pg.to, ex:extraStars, m:curMap, x:player.x, y:player.y}));
    }catch(e){}
  }

  /* ---------- AVVENTURE (canone: oggetti e luoghi) ---------- */
  const ITEMS = {
    pagnotta:"PAGNOTTA", conchiglia:"CONCHIGLIA", erbe:"ERBE",
    corda:"CORDA", sciarpa:"SCIARPA",
    pagnotta_g:"PAGNOTTA (Grunto)", pagnotta_r:"PAGNOTTA", pallone:"PALLONE"
  };
  const QUESTS = [
    { giver:"FIAMMA", type:"deliver", item:"pagnotta", to:"BARTOLO",
      ask:["Ciao piccolo mio!","Porta questa PAGNOTTA","calda a BARTOLO,","al pontile a sud!"],
      remind:["La pagnotta e' per","BARTOLO! Il pontile","e' in fondo a sud."],
      deliver:["Mmm, il pane di","Fiamma... che","profumo! Grazie!","+1 STELLA ★"],
      done:["Il forno profuma","fino al mare! ♥"] },
    { giver:"BARTOLO", type:"fetch", item:"conchiglia", at:[30,35], map:"isola",
      ask:["Ho perso la","CONCHIGLIA di Amo","sulla SPIAGGIA...","La cerchi tu?"],
      remind:["Brilla sulla sabbia,","la conchiglia..."],
      deliver:["La conchiglia di Amo!","Il mare ci canta","dentro. Grazie!","+1 STELLA ★"],
      done:["Ascolta... si sente","il mare! ♥"] },
    { giver:"SALVIA", type:"fetch", item:"erbe", at:[11,27], map:"isola",
      ask:["Mi servono le ERBE","che crescono presso","il torrente, al","margine della foresta."],
      remind:["Le erbe sono a ovest,","vicino al torrente..."],
      deliver:["Che belle fresche!","Ora preparo la","tisana. Grazie!","+1 STELLA ★"],
      done:["Le erbe giuste","curano piano ♥"] },
    { giver:"NODO", type:"fetch", item:"corda", at:[16,20], map:"monti",
      ask:["Il vento mi ha","portato via la CORDA!","E' volata sui PASCOLI","ALTI, oltre il passo!"],
      remind:["Sali la VIA CHE SALE","a nord: la corda e'","sui Pascoli Alti..."],
      deliver:["La mia corda!","Ora aggiusto il","tetto. Grazie!","+1 STELLA ★"],
      done:["Tutto si aggiusta,","con le mani ♥"] },
    { giver:"MEMOLO", type:"fetch", item:"sciarpa", at:[27,17], map:"isola",
      ask:["Brrr! La mia SCIARPA","e' volata fino","all'ALBERO VECCHIO","della piazza!"],
      remind:["Guarda vicino","all'Albero Vecchio..."],
      deliver:["La mia sciarpa!","Adesso il collo","ride di nuovo! Ah ah!","+1 STELLA ★"],
      done:["Una sciarpa calda","e' mezza estate! ♥"] }
  ];
  let qs = QUESTS.map(()=>0);       // 0 non iniziata, 1 attiva, 2 completata
  let carry = new Set();            // oggetti nello zaino
  let cucc = {BRU:0, PUN:0, TOBA:0};// memory giocato con i cuccioli
  /* --- avventura s01: La Nebbia delle Montagne Gemelle --- */
  let s01 = 0;          // 0 non iniziata, 1 in salita (nebbia da passare), 2 nebbia passata, 3 completata
  let s01Talk = 0;      // incontro con Grunto: 0 grunt!, 1 fermo, 2 permesso
  let cornetto = false; // il cornetto del ritorno
  /* --- avventura s02: Il Riflesso nella Pozza --- */
  let s02 = 0;          // 0 -, 1 messaggio ricevuto, 2 pozza vista, 3 consegnato
  let msgS = null;      // minigioco del messaggio
  let rippleT = 0;      // cerchi nell'acqua della pozza
  /* --- avventura s03: Il Pallone oltre la Foresta --- */
  let s03 = 0;          // 0 -, 1 pallone in mano, 2 pallone nella foresta, 3 completata
  /* --- scene a piu' riquadri --- */
  let scene = null;     // {q:[...], end:fn}
  function playScene(boxes, endFn){
    scene = { q: boxes.slice(1), end: endFn||null };
    openDialog(boxes[0].lines, boxes[0]);
  }
  let pg = { to:null }; // la pagnotta del giorno
  let extraStars = 0;
  let fog = null;       // la nebbia: {t, phase, cd, msgI}
  const stars = ()=> qs.filter(s=>s===2).length
    + Object.values(cucc).filter(v=>v).length
    + (s01===3?1:0) + (s02===3?1:0) + (s03===3?1:0) + extraStars;
  const TOT_STELLE = 8;

  /* ---------- PERSONAGGI SULLA MAPPA ---------- */
  function mkChar(id,x,y,art,opts={}){
    return Object.assign({id,x,y,map:"isola",spr:makeSprite(art),dir:"down",
      moving:false,step:0,ox:0,oy:0,t:60+Math.floor(Math.random()*120)},opts);
  }
  const CHARS = [
    mkChar("FIAMMA", 40,17,artFiamma,{fix:1}),
    mkChar("STRIA",  20,16,artStria,{fix:1,
      lines:["Ciao! Io sono STRIA,","la maestra. I cuccioli","giocano in piazza:","gioca con loro!"]}),
    mkChar("MEMOLO", 31,22,artMemolo,{fix:1}),
    mkChar("BARTOLO",24,36,artBartolo,{fix:1}),
    mkChar("SALVIA",  5,14,artSalvia,{fix:1}),
    mkChar("NODO",   16,27,artNodo,{fix:1}),
    mkChar("ZOLLA",   5,26,artZolla,{fix:1,
      lines:["Ogni stagione da'","il suo frutto,","se sai aspettare."]}),
    mkChar("ROVO",    7,31,artRovo,{fix:1,
      lines:["La foresta e' amica","di chi la rispetta.","Io veglio sulla tana."]}),
    mkChar("GRUNTO", 16,4, artGrunto,{fix:1, map:"monti"}),
    mkChar("PASTORI", 6,18, artPastore,{fix:1, map:"monti"}),
    mkChar("PECORA",  8,18, artPecora,{fix:1, map:"monti", lines:["Beee!"]}),
    mkChar("BRU",    21,18,artBru,{cucc:1,home:[21,18]}),
    mkChar("PUN",    26,20,artPun,{cucc:1,home:[26,20]}),
    mkChar("TOBA",   22,21,artToba,{cucc:1,home:[22,21]})
  ];
  const charAt=(x,y)=>CHARS.find(c=>c.map===curMap&&c.x===x&&c.y===y);

  /* ---------- STATO ---------- */
  const TS=16, VW=160, VH=144;
  const player = { x:24, y:20, dir:"down", ox:0, oy:0, moving:false, step:0, animT:0 };
  const saved = loadSave();
  if(saved){
    qs = QUESTS.map((_,i)=> saved.q[i]|0);
    (saved.carry||[]).forEach(i=>{ if(ITEMS[i]) carry.add(i); });
    if(saved.cucc) cucc = {BRU:saved.cucc.BRU?1:0, PUN:saved.cucc.PUN?1:0, TOBA:saved.cucc.TOBA?1:0};
    s01 = saved.s01|0; s01Talk = saved.s01Talk|0; s02 = saved.s02|0; s03 = saved.s03|0;
    cornetto = !!saved.cor; extraStars = saved.ex|0;
    if(saved.pg) pg.to = saved.pg;
    if(MAPS[saved.m]) curMap = saved.m;
    if(!SOLID.has(tileAt(saved.x,saved.y)) && !charAt(saved.x,saved.y)){
      player.x=saved.x; player.y=saved.y;
    } else { curMap="isola"; }
  }
  const keys = { up:false, down:false, left:false, right:false };
  let mode = "map";     // map | dialog | memory | zaino | final
  let dialog = null;    // {lines, memoryWith?}
  let memory = null;
  let memoryCucc = null;
  let tick = 0;
  let aPressed=false, bPressed=false, dirTapped=null;
  const leaves = [];    // il vento sull'isola
  const DIRV = { up:[0,-1], down:[0,1], left:[-1,0], right:[1,0] };

  /* ---------- INPUT ---------- */
  function bindHold(id, name){
    const el=root.querySelector("#"+id);
    const on=e=>{e.preventDefault();audio();keys[name]=true;el.classList.add("on");dirTapped=name;};
    const off=e=>{e.preventDefault();keys[name]=false;el.classList.remove("on");};
    el.addEventListener("touchstart",on,{passive:false});
    el.addEventListener("touchend",off); el.addEventListener("touchcancel",off);
    el.addEventListener("mousedown",on); el.addEventListener("mouseup",off); el.addEventListener("mouseleave",off);
  }
  bindHold("dU","up"); bindHold("dD","down"); bindHold("dL","left"); bindHold("dR","right");
  function bindTap(id, fn){
    const el=root.querySelector("#"+id);
    const on=e=>{e.preventDefault();audio();el.classList.add("on");fn();};
    const off=e=>{e.preventDefault();el.classList.remove("on");};
    el.addEventListener("touchstart",on,{passive:false});
    el.addEventListener("touchend",off); el.addEventListener("touchcancel",off);
    el.addEventListener("mousedown",on); el.addEventListener("mouseup",off);
  }
  bindTap("btnA",()=>{aPressed=true;});
  bindTap("btnB",()=>{bPressed=true;});
  onWindow("keydown",e=>{
    audio();
    if(e.repeat){
      if(e.key==="ArrowUp")keys.up=true; if(e.key==="ArrowDown")keys.down=true;
      if(e.key==="ArrowLeft")keys.left=true; if(e.key==="ArrowRight")keys.right=true;
      return;
    }
    if(e.key==="ArrowUp"){keys.up=true;dirTapped="up";}
    if(e.key==="ArrowDown"){keys.down=true;dirTapped="down";}
    if(e.key==="ArrowLeft"){keys.left=true;dirTapped="left";}
    if(e.key==="ArrowRight"){keys.right=true;dirTapped="right";}
    if(e.key==="z"||e.key==="Z"||e.key===" "||e.key==="Enter")aPressed=true;
    if(e.key==="x"||e.key==="X")bPressed=true;
  });
  onWindow("keyup",e=>{
    if(e.key==="ArrowUp")keys.up=false; if(e.key==="ArrowDown")keys.down=false;
    if(e.key==="ArrowLeft")keys.left=false; if(e.key==="ArrowRight")keys.right=false;
  });
  root.addEventListener("contextmenu",e=>e.preventDefault());

  /* ---------- MOVIMENTO ---------- */
  function heldDir(){
    if(keys.up)return "up"; if(keys.down)return "down";
    if(keys.left)return "left"; if(keys.right)return "right"; return null;
  }
  let forestCd = 0;
  function tryMove(dir){
    player.dir=dir;
    const [dx,dy]=DIRV[dir], nx=player.x+dx, ny=player.y+dy;
    // durante la s03: di sera nella Foresta NON si entra
    if(curMap==="isola" && s03===2 && ny>=27 && nx<=13){
      if(forestCd<=0){
        forestCd=60; sfx.nomatch();
        openDialog(["E' quasi sera.","Nella Foresta, di sera,","NON SI ENTRA.","(chiama: premi A!)"]);
      }
      return;
    }
    const isWarp = !!WARPS[curMap+":"+nx+","+ny];
    if((SOLID.has(tileAt(nx,ny)) && !isWarp) || charAt(nx,ny)) return;
    player.moving=true; player.step=0;
  }
  function activeItemAt(x,y){
    for(const q of QUESTS){
      if(q.type==="fetch" && q.map===curMap && qs[QUESTS.indexOf(q)]===1 && !carry.has(q.item)
         && q.at[0]===x && q.at[1]===y) return q;
    }
    return null;
  }
  function finishMove(){
    const [dx,dy]=DIRV[player.dir];
    player.x+=dx; player.y+=dy; player.moving=false; player.ox=0; player.oy=0;
    const w=WARPS[curMap+":"+player.x+","+player.y];
    if(w){
      curMap=w[0]; player.x=w[1]; player.y=w[2];
      player.dir = w[0]==="monti" ? "up" : "down";
      sfx.a(); doSave(); return;
    }
    // la NEBBIA della s01: sul sentiero di mezza costa
    if(curMap==="monti" && s01===1 && !fog && player.x===22 && player.y>=12 && player.y<=14){
      fog={t:300, phase:"wait", cd:0, msgI:0};
      sfx.wind();
      openDialog(["NEBBIA!","Bianco dappertutto!","Non vedi piu' nulla...","(RESTA FERMO)"]);
      return;
    }
    const q=activeItemAt(player.x,player.y);
    if(q){
      carry.add(q.item); sfx.pick(); doSave();
      openDialog(["Hai trovato:",ITEMS[q.item]+"!","Riportala indietro!"]);
      return;
    }
    // s03: giocare a pallone al margine degli orti
    if(curMap==="isola" && s03===1 && carry.has("pallone")
       && player.x>=10 && player.x<=15 && player.y>=24 && player.y<=26){
      carry.delete("pallone");
      playScene([
        {lines:["Tirate calci!","Noah corre di traverso,","Elias para,","Gabriel passa..."]},
        {lines:["NOAH tira un calcio","mal misurato! Il pallone","rotola... si infila","TRA I TRONCHI!"]},
        {lines:["Si vede ancora,","biancastro tra le","radici... poi sparisce.","E' quasi sera."]}
      ], ()=>{ s03=2; doSave(); sfx.nomatch(); });
      return;
    }
    doSave();
  }
  function openDialog(lines,extra){
    sfx.msg(); mode="dialog"; dialog=Object.assign({lines},extra||{});
    if(dialog.ripple){ rippleT=90; sfx.wind(); }
  }

  /* ---------- PARLARE CON GLI ABITANTI ---------- */
  function talk(c){
    const opp={up:"down",down:"up",left:"right",right:"left"};
    c.dir=opp[player.dir]; c.moving=false; c.ox=0; c.oy=0;

    // 0) pagnotta del giorno consegnata?
    if(pg.to===c.id && carry.has("pagnotta_r")){
      carry.delete("pagnotta_r"); pg.to=null; extraStars++;
      sfx.star(); doSave();
      openDialog([c.id+": Mmm, il pane","di Fiamma! Che","profumo! Grazie!","+1 STELLA ★"]);
      return;
    }
    // 1) consegna di un oggetto trasportato a destinazione
    for(let i=0;i<QUESTS.length;i++){
      const q=QUESTS[i];
      if(q.type==="deliver" && q.to===c.id && qs[i]===1 && carry.has(q.item)){
        qs[i]=2; carry.delete(q.item); sfx.star(); doSave();
        openDialog(q.deliver); return;
      }
    }
    // 2) FIAMMA: dopo la prima pagnotta, comincia la s01
    if(c.id==="FIAMMA" && qs[0]===2){
      if(s01===0){
        s01=1; carry.add("pagnotta_g"); doSave(); sfx.a();
        openDialog(["Salite alle GEMELLE?","Ecco due pagnotte.","«Se passate dal Burrone,","una per GRUNTO. Una sola.»"]);
        return;
      }
      if(s01<3){
        openDialog(["«Una per GRUNTO.","Una sola.»","La via che sale","parte dal passo a nord."]);
        return;
      }
      if(!cornetto){
        cornetto=true; doSave(); sfx.match();
        openDialog(["Fiamma non chiede","com'e' andata.","Ti mette in mano","un CORNETTO caldo. ♥"]);
        return;
      }
      if(!pg.to){
        const dest=["BARTOLO","SALVIA","NODO","MEMOLO","ZOLLA","ROVO","STRIA"];
        pg.to=dest[Math.floor(Math.random()*dest.length)];
        carry.add("pagnotta_r"); doSave(); sfx.a();
        openDialog(["Una pagnotta calda,","appena sfornata!","Portala a "+pg.to+",","ti aspetta! ♥"]);
        return;
      }
      openDialog(["La pagnotta di oggi","e' per "+pg.to+"! ♥"]);
      return;
    }
    // 3b) STRIA: la s02, il messaggio per i Pastori
    if(c.id==="STRIA" && s01===3){
      if(s02===0){
        playScene([
          {lines:["STRIA: «Mi serve","una cosa. Oggi io","volo altrove. Ai","PASTORI va un messaggio.»"]},
          {lines:["Il messaggio e':"], msgIcons:true},
          {lines:["«Ripetilo bene!","VENTO - GREGGE - RIPARO.","I Pastori sono sui","PASCOLI ALTI, su!»"]}
        ], ()=>{ s02=1; doSave(); });
        return;
      }
      if(s02<3){
        openDialog(["«Ricordi il messaggio?"], {msgIcons:true});
        return;
      }
      playScene([
        {lines:["GABRIEL: «Tu dove vai?»","STRIA ti guarda:","«Tu cosa pensi?»"]},
        {lines:["Non aspetta la risposta.","Alza le ali...","e vola via. ♥"]}
      ]);
      return;
    }
    // 3c) SALVIA: la s03, il pallone di stoffa cucita
    if(c.id==="SALVIA" && qs[2]===2 && s02===3){
      if(s03===0){
        s03=1; carry.add("pallone"); doSave(); sfx.a();
        openDialog(["Vi ho cucito il","PALLONE di stoffa!","Andate a giocare al","margine, verso la foresta!"]);
        return;
      }
      if(s03===1){ openDialog(["Il margine e' laggiu',","tra gli orti e i","primi alberi, a sud!"]); return; }
      if(s03===2){ openDialog(["Il pallone e' finito","nella foresta?","Oh no... prova a","CHIAMARE dal margine!"]); return; }
      openDialog(["Il mio pallone si","scuce sempre da una","parte... ma quanto","ci giocate! ♥"]);
      return;
    }
    // 3d) PASTORI: consegnare il messaggio di Stria
    if(c.id==="PASTORI"){
      if(s02===2){
        msgS={sel:0, slots:[], opts:["sole","gregge","vento","riparo"]};
        mode="msg"; sfx.a(); return;
      }
      if(s02===3){ openDialog(["I Pastori fanno","un cenno.","E' fatto."]); return; }
      if(s02===1){ openDialog(["I Pastori aspettano...","(prima passa dalla","POZZA a bere!)"]); return; }
      openDialog(["I Pastori guardano","il gregge,","in silenzio."]);
      return;
    }
    // 3) l'abitante ha una sua avventura da affidare?
    const qi = QUESTS.findIndex(q=>q.giver===c.id);
    if(qi>=0){
      const q=QUESTS[qi], st=qs[qi];
      if(st===0){
        qs[qi]=1;
        if(q.type==="deliver") carry.add(q.item);
        sfx.a(); doSave(); openDialog(q.ask); return;
      }
      if(st===1){
        if(q.type==="fetch" && carry.has(q.item)){
          qs[qi]=2; carry.delete(q.item); sfx.star(); doSave();
          openDialog(q.deliver); return;
        }
        openDialog(q.remind); return;
      }
      openDialog(q.done); return;
    }
    // 4) cuccioli: memory!
    if(c.cucc){
      if(!cucc[c.id]){
        openDialog([c.id+": Giochiamo","a MEMORY?","Trova le coppie","e vinci una STELLA!"],{memoryWith:c.id});
      } else {
        openDialog([c.id+": che bello","giocare con te! ★"]);
      }
      return;
    }
    // 5) GRUNTO alla cengia (la scena della s01)
    if(c.id==="GRUNTO"){
      if(s01===3){
        if(stars()>=TOT_STELLE){ sfx.wind(); mode="final"; return; }
        openDialog(["Grunto ti guarda,","tranquillo, dalla","sua cengia.","(Stelle: "+stars()+"/"+TOT_STELLE+")"]);
        return;
      }
      if(s01<2){
        openDialog(["GRUNT!","Lo stambecco batte","lo zoccolo sul sasso.","Vuole che tu vada via!"]);
        return;
      }
      if(s01Talk===0){
        s01Talk=1; doSave();
        openDialog(["GRUNT!","Batte lo zoccolo.","E' enorme, col pelo","scuro... (tu RESTA)"]);
        return;
      }
      if(s01Talk===1){
        s01Talk=2; doSave(); sfx.msg();
        openDialog(["Resti fermo, zitto,","a tre passi.","Grunto ti fissa a lungo...","poi volta la testa."]);
        return;
      }
      if(carry.has("pagnotta_g")){
        carry.delete("pagnotta_g"); s01=3; sfx.star(); doSave();
        openDialog(["Posi la pagnotta sulla","pietra piatta. Grunto","annusa. La prende.","«Buono.»  +1 STELLA ★"]);
        return;
      }
      openDialog(["Grunto aspetta...","(la pagnotta di Fiamma","e' per lui!)"]);
      return;
    }
    // 6) frasi degli altri abitanti
    if(c.lines){ openDialog(c.lines); return; }
    openDialog([c.id+" ti sorride."]);
  }
  function mapInteract(){
    const [dx,dy]=DIRV[player.dir];
    const fx=player.x+dx, fy=player.y+dy;
    const c=charAt(fx,fy);
    if(c){ talk(c); return; }
    // s03: chiamare nel buio della Foresta dal margine
    if(curMap==="isola" && s03===2 && player.x>=10 && player.x<=15 && player.y>=24 && player.y<=26){
      const rovo=CHARS.find(ch=>ch.id==="ROVO");
      const rx = (player.x===12) ? 13 : 12;
      rovo.x=rx; rovo.y=26; rovo.dir="up";
      playScene([
        {lines:["ELIAS si ferma sulla","soglia. Chiama nel buio:","«C'e' nessuno?»"]},
        {lines:["...silenzio...","fruscii di foglie morte,","un battito d'ali alto.","Poi una voce: «CHI E'?»"]},
        {lines:["E' ROVO! Esce dagli","alberi col PALLONE.","Lo posa a terra:","«E' buio. Andate.»"]},
        {lines:["Dietro di lui, un","attimo: due occhi neri","che brillano... BRU!","Poi sparisce."]},
        {lines:["GABRIEL: «Perche' di","sera non si entra?»","ROVO: «Le cose della","Foresta hanno il loro orario.»"]},
        {lines:["Il pallone e' salvo!","Tornate a casa","in silenzio.","+1 STELLA ★"]}
      ], ()=>{
        s03=3; carry.add("pallone"); sfx.star();
        rovo.x=7; rovo.y=31; rovo.dir="down";
        doSave();
      });
      return;
    }
    const t=tileAt(fx,fy);
    // s02: la pozza dei riflessi
    if(curMap==="monti" && t==="w" && s02===1){
      rippleT=0;
      playScene([
        {lines:["Il ghiaccio e' andato","via. L'acqua e' ferma,","lucida. Vi chinate","a bere, in tre."]},
        {lines:["Vi vedete... strani.","GABRIEL ha la bocca dura.","ELIAS e' piccolissimo.","NOAH e' immobile."]},
        {lines:["Cominciate a litigare!","Noah dice una cosa,","Gabriel risponde male...","Elias: «smettete»."]},
        {lines:["NOAH lascia cadere","il bastoncino","nell'acqua.","L'acqua si increspa..."], ripple:true},
        {lines:["Il VENTO TAGLIO passa","basso. Piccole pieghe","sull'acqua. Poi la","pozza riprende calma."]},
        {lines:["Vi rivedete: giusti.","Gabriel ha la sua faccia.","Elias non e' piccolo.","Noah non e' fermo. ♥"]}
      ], ()=>{ s02=2; doSave(); });
      return;
    }
    if(t==="s") openDialog(["PIAZZA DEL VILLAGGIO","L'Isola dei Tre Venti","Nord: le Gemelle","Sud: il mare"]);
    else if(t==="o") openDialog(["Il POZZO della piazza.","L'acqua e' fresca","e profonda."]);
    else if(t==="A") openDialog(["L'ALBERO VECCHIO.","Conosce tutte le","storie dell'isola."]);
    else if(t==="C"){
      if(curMap==="isola") openDialog(["Da qui parte la","VIA CHE SALE, verso","le MONTAGNE GEMELLE.","(entra nel passo!)"]);
      else openDialog(["La grotta di GRUNTO.","Buia e silenziosa.","Meglio non entrare."]);
    }
    else if(t==="v") openDialog(["IL BURRONE.","Le pietre che cadono","si sentono a lungo...","Stai lontano dal bordo!"]);
    else if(t==="N") openDialog(["Le cime innevate","delle GEMELLE","toccano le nuvole."]);
    else if(t==="w"){
      if(curMap==="monti") openDialog(["La POZZA","dell'Abbeveratoio","dei Pastori."]);
      else openDialog(["Il mare respira","intorno all'isola."]);
    }
    else if(t==="M") openDialog(["Roccia delle","MONTAGNE GEMELLE."]);
  }
  function updateMap(){
    // la nebbia: stare fermi e' la cosa giusta
    if(fog && fog.phase==="wait"){
      if(fog.cd>0) fog.cd--;
      const d=heldDir();
      if(d && fog.cd<=0){
        fog.cd=60; sfx.nomatch();
        const msgs=[
          ["Noah vuole correre!","Gabriel dice:","«No. Non muoverci.»"],
          ["Un passo nel bianco","puo' essere un passo","nel vuoto... FERMO."],
          ["Elias ti stringe","la mano. Aspettate","insieme, fermi."]];
        openDialog(msgs[fog.msgI%3]); fog.msgI++;
        return;
      }
      if(!d) fog.t--;
      if(fog.t<=0){ fog.phase="sweep"; fog.t=70; sfx.wind(); }
      if(aPressed||bPressed){}
      return;
    }
    if(fog && fog.phase==="sweep"){
      fog.t--;
      if(fog.t<=0){
        fog=null; s01=2; doSave(); sfx.star();
        openDialog(["VENTO TAGLIO!","La nebbia si squarcia:","IL BURRONE, a due passi!","Stare fermi vi ha salvati."]);
      }
      return;
    }
    if(aPressed){ mapInteract(); return; }
    if(bPressed){ sfx.a(); mode="zaino"; return; }
    if(player.moving){
      player.step+=2; player.animT++;
      const [dx,dy]=DIRV[player.dir];
      player.ox=dx*player.step; player.oy=dy*player.step;
      if(player.step>=TS) finishMove();
    } else {
      const d=heldDir();
      if(d) tryMove(d); else player.animT=0;
    }
  }
  function updateChars(){
    CHARS.forEach(c=>{
      if(c.fix) return;
      if(c.moving){
        c.step+=1;
        const [dx,dy]=DIRV[c.dir];
        c.ox=dx*c.step; c.oy=dy*c.step;
        if(c.step>=TS){ c.x+=DIRV[c.dir][0]; c.y+=DIRV[c.dir][1]; c.moving=false; c.ox=0; c.oy=0; }
        return;
      }
      c.t--;
      if(c.t<=0){
        c.t=70+Math.floor(Math.random()*110);
        const dirs=["up","down","left","right"];
        const d=dirs[Math.floor(Math.random()*4)];
        c.dir=d;
        const nx=c.x+DIRV[d][0], ny=c.y+DIRV[d][1];
        const tt=tileAt(nx,ny);
        if(Math.random()<0.7 && (tt==="p"||tt===".")
           && Math.abs(nx-c.home[0])<=3 && Math.abs(ny-c.home[1])<=3
           && !charAt(nx,ny) && !(nx===player.x&&ny===player.y)){
          c.moving=true; c.step=0;
        }
      }
    });
  }
  /* il vento: foglie che attraversano l'isola */
  function updateLeaves(){
    if(tick%36===0 && leaves.length<12){
      leaves.push({x:-4, y:Math.random()*120, vx:1+Math.random()*1.2,
        vy:0.3+Math.random()*0.5, c:Math.random()<0.5?"#7bbb50":"#e0a040", l:220});
    }
    for(let i=leaves.length-1;i>=0;i--){
      const f=leaves[i];
      f.x+=f.vx; f.y+=f.vy+Math.sin((tick+i*20)/14)*0.4; f.l--;
      if(f.x>VW+4||f.l<=0) leaves.splice(i,1);
    }
  }

  /* ---------- MEMORY CON I CUCCIOLI ---------- */
  const FACES=[artFiamma,artMemolo,artBartolo,artSalvia,artNodo].map(a=>makeSprite(a));
  function startMemory(cid){
    const picks=[];
    const idx=[0,1,2,3,4];
    while(picks.length<3){
      picks.push(idx.splice(Math.floor(Math.random()*idx.length),1)[0]);
    }
    const cards=[...picks,...picks]
      .map(m=>({m, flip:false, done:false}))
      .sort(()=>Math.random()-0.5);
    memory={cards, cursor:0, open:[], lockT:0, matched:0};
    memoryCucc=cid;
    mode="memory"; sfx.a();
  }
  function updateMemory(){
    const m=memory;
    if(m.lockT>0){
      m.lockT--;
      if(m.lockT===0){
        const [i,j]=m.open;
        if(m.cards[i].m===m.cards[j].m){
          m.cards[i].done=true; m.cards[j].done=true; m.matched++;
          sfx.match();
          if(m.matched===3){
            cucc[memoryCucc]=1; doSave(); sfx.star();
            mode="map"; memory=null;
            openDialog(["BRAVISSIMO!","Hai vinto una","STELLA! ★ ("+stars()+"/"+TOT_STELLE+")"]);
            return;
          }
        } else {
          m.cards[i].flip=false; m.cards[j].flip=false;
          sfx.nomatch();
        }
        m.open=[];
      }
      return;
    }
    if(dirTapped){
      const col=m.cursor%3, row=Math.floor(m.cursor/3);
      let nc=col, nr=row;
      if(dirTapped==="left")nc=Math.max(0,col-1);
      if(dirTapped==="right")nc=Math.min(2,col+1);
      if(dirTapped==="up")nr=0;
      if(dirTapped==="down")nr=1;
      const next=nr*3+nc;
      if(next!==m.cursor){m.cursor=next;sfx.b();}
    }
    if(aPressed){
      const c=m.cards[m.cursor];
      if(!c.flip && !c.done && m.open.length<2){
        c.flip=true; m.open.push(m.cursor); sfx.flip();
        if(m.open.length===2) m.lockT=34;
      }
    }
    if(bPressed){ mode="map"; memory=null; sfx.b(); }
  }

  /* ---------- IL MESSAGGIO DI STRIA (simboli) ---------- */
  const MSG_SEQ=["vento","gregge","riparo"];
  function drawSymbol(id,x,y,big){
    const s=big?1.6:1;
    if(id==="vento"){ ctx.strokeStyle="#4bb7ff"; ctx.lineWidth=2;
      for(let k=0;k<2;k++){ ctx.beginPath(); ctx.arc(x+9*s,y+9*s,(4+k*4)*s,0.6+k,3.6+k); ctx.stroke(); } }
    else if(id==="gregge"){ ctx.fillStyle="#f8f8f8"; ctx.fillRect(x+3*s,y+6*s,12*s,7*s);
      ctx.fillRect(x+5*s,y+4*s,8*s,3*s); ctx.fillStyle="#4a4038"; ctx.fillRect(x+1*s,y+7*s,3*s,4*s);
      ctx.fillRect(x+5*s,y+13*s,2*s,3*s); ctx.fillRect(x+11*s,y+13*s,2*s,3*s); }
    else if(id==="riparo"){ ctx.fillStyle="#d04838";
      for(let i=0;i<7;i++) ctx.fillRect(x+(9-i)*s, y+(2+i)*s, (i*2+1)*s, 1.2*s);
      ctx.fillStyle="#b08850"; ctx.fillRect(x+4*s,y+9*s,10*s,7*s);
      ctx.fillStyle="#6b4a2b"; ctx.fillRect(x+8*s,y+11*s,3*s,5*s); }
    else if(id==="sole"){ ctx.fillStyle="#f0c040"; ctx.beginPath();
      ctx.arc(x+9*s,y+9*s,5*s,0,Math.PI*2); ctx.fill();
      ctx.fillRect(x+8*s,y+1*s,2*s,3*s); ctx.fillRect(x+8*s,y+14*s,2*s,3*s);
      ctx.fillRect(x+1*s,y+8*s,3*s,2*s); ctx.fillRect(x+14*s,y+8*s,3*s,2*s); }
  }
  function updateMsg(){
    const m=msgS;
    if(dirTapped==="left"&&m.sel>0){m.sel--;sfx.b();}
    if(dirTapped==="right"&&m.sel<3){m.sel++;sfx.b();}
    if(aPressed){
      const pick=m.opts[m.sel];
      if(pick===MSG_SEQ[m.slots.length]){
        m.slots.push(pick); sfx.flip();
        if(m.slots.length===3){
          s02=3; msgS=null; mode="map"; sfx.star(); doSave();
          playScene([
            {lines:["ELIAS ripete il","messaggio, parola","per parola."]},
            {lines:["I Pastori ascoltano","in silenzio.","Fanno un cenno.","E' fatto.  +1 STELLA ★"]}
          ]);
        }
      } else {
        m.slots=[]; sfx.nomatch();
      }
    }
    if(bPressed){ msgS=null; mode="map"; sfx.b(); }
  }
  function drawMsg(){
    const m=msgS;
    ctx.fillStyle="#e8f0e0"; ctx.fillRect(0,0,VW,VH);
    ctx.fillStyle="#181820"; ctx.font="bold 9px 'Courier New',monospace"; ctx.textBaseline="top";
    ctx.fillText("Com'era il messaggio",8,5);
    ctx.fillText("di STRIA?",8,15);
    // gli spazi da riempire
    for(let i=0;i<3;i++){
      const x=22+i*42, y=32;
      ctx.fillStyle="#f8f8f8"; ctx.fillRect(x,y,30,30);
      ctx.strokeStyle="#181820"; ctx.lineWidth=2; ctx.strokeRect(x+1,y+1,28,28);
      if(m.slots[i]) drawSymbol(m.slots[i], x+6, y+6, false);
      else { ctx.fillStyle="#c8c8c8"; ctx.fillText("?",x+12,y+10); }
    }
    // le scelte
    ctx.fillStyle="#181820"; ctx.fillText("Scegli in ordine:",8,74);
    for(let i=0;i<4;i++){
      const x=8+i*38, y=88;
      ctx.fillStyle="#f8f8f8"; ctx.fillRect(x,y,32,32);
      ctx.strokeStyle=(i===m.sel)?"#e0a020":"#181820";
      ctx.lineWidth=(i===m.sel)?3:2;
      ctx.strokeRect(x+1,y+1,30,30);
      drawSymbol(m.opts[i], x+7, y+7, false);
    }
    ctx.fillStyle="#181820"; ctx.font="bold 8px 'Courier New',monospace";
    ctx.fillText("A: scegli  B: dopo",8,132);
  }

  /* ---------- RENDER ---------- */
  function drawStar(g,cx,cy,r,col){
    g.fillStyle=col;
    g.fillRect(cx-1,cy-r,2,r*2);
    g.fillRect(cx-r,cy-1,r*2,2);
    g.fillRect(cx-1,cy-1,2,2);
  }
  function drawItemIcon(id,x,y){
    if(id==="pagnotta"){ ctx.fillStyle="#e0b060"; ctx.fillRect(x+1,y+3,10,6);
      ctx.fillStyle="#c89040"; ctx.fillRect(x+3,y+4,1,4); ctx.fillRect(x+6,y+4,1,4); ctx.fillRect(x+9,y+4,1,4); }
    else if(id==="conchiglia"){ ctx.fillStyle="#e8a0b8"; ctx.fillRect(x+2,y+4,8,5);
      ctx.fillRect(x+4,y+2,4,2); ctx.fillStyle="#f8d0dc"; ctx.fillRect(x+5,y+4,1,5); ctx.fillRect(x+7,y+4,1,5); }
    else if(id==="erbe"){ ctx.fillStyle="#3a7a4a"; ctx.fillRect(x+3,y+2,1,8); ctx.fillRect(x+6,y+1,1,9);
      ctx.fillRect(x+9,y+3,1,7); ctx.fillStyle="#9ac86a"; ctx.fillRect(x+2,y+2,2,2); ctx.fillRect(x+5,y+1,2,2); ctx.fillRect(x+8,y+3,2,2); }
    else if(id==="corda"){ ctx.strokeStyle="#8a6538"; ctx.lineWidth=2;
      ctx.beginPath(); ctx.arc(x+6,y+6,4,0,Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.arc(x+6,y+6,2,0,Math.PI*2); ctx.stroke(); }
    else if(id==="sciarpa"){ ctx.fillStyle="#d04838"; ctx.fillRect(x+2,y+3,8,3);
      ctx.fillRect(x+7,y+5,3,6); ctx.fillStyle="#f0d030"; ctx.fillRect(x+7,y+9,3,1); }
  }
  function drawMap(){
    const rows=mrows(), MWc=rows[0].length, MHc=rows.length;
    const camX=Math.max(0,Math.min(player.x*TS+player.ox-72, MWc*TS-VW));
    const camY=Math.max(0,Math.min(player.y*TS+player.oy-64, MHc*TS-VH));
    const f=(Math.floor(tick/30))%2;
    const tx0=Math.floor(camX/TS), ty0=Math.floor(camY/TS);
    for(let ty=ty0;ty<=ty0+9;ty++){
      for(let tx=tx0;tx<=tx0+10;tx++){
        const t=TILES[tileAt(tx,ty)]||TILES["."];
        ctx.drawImage(t[f], tx*TS-camX, ty*TS-camY);
      }
    }
    // oggetti da trovare: scintillano
    QUESTS.forEach((q,i)=>{
      if(q.type==="fetch" && q.map===curMap && qs[i]===1 && !carry.has(q.item)){
        const sx=q.at[0]*TS-camX, sy=q.at[1]*TS-camY;
        if(sx>-16&&sx<VW&&sy>-16&&sy<VH){
          const r = (Math.floor(tick/8)%2) ? 5 : 3;
          drawStar(ctx, sx+8, sy+8, r, "#f8e858");
        }
      }
    });
    CHARS.forEach(c=>{
      if(c.map!==curMap) return;
      ctx.drawImage(c.spr, c.x*TS+c.ox-camX, c.y*TS+c.oy-camY-2);
    });
    const frame = player.moving ? Math.floor(player.animT/6)%4 : 0;
    ctx.drawImage(SPR[player.dir][frame], player.x*TS+player.ox-camX, player.y*TS+player.oy-camY-2);
    // foglie nel vento
    leaves.forEach(l=>{ ctx.fillStyle=l.c; ctx.fillRect(Math.round(l.x),Math.round(l.y),2,2); });
    // i cerchi nell'acqua della pozza (s02)
    if(rippleT>0 && curMap==="monti"){
      const cx=8*TS-camX, cy=20*TS-camY;
      ctx.strokeStyle="rgba(200,230,255,.9)"; ctx.lineWidth=1;
      for(let k=0;k<3;k++){
        const r=(90-rippleT)/6 + k*5;
        if(r>0&&r<30){ ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.stroke(); }
      }
    }
    // il pallone perso tra i tronchi (s03)
    if(curMap==="isola" && s03===2){
      const bx=10*TS-camX+6, by=28*TS-camY+6;
      if(bx>-8&&bx<VW&&by>-8&&by<VH){
        ctx.fillStyle="#e8e8e0"; ctx.beginPath(); ctx.arc(bx,by,3,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle="#8a6538"; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(bx-3,by); ctx.lineTo(bx+3,by); ctx.stroke();
      }
    }
    // LA NEBBIA
    if(fog){
      ctx.globalAlpha = 0.92;
      ctx.fillStyle="#f2f5f7";
      if(fog.phase==="wait"){
        ctx.fillRect(0,0,VW,VH);
        ctx.globalAlpha = 1;
        ctx.drawImage(SPR[player.dir][0], player.x*TS+player.ox-camX, player.y*TS+player.oy-camY-2);
        // pazienza: puntini che si accendono
        const dots = 5 - Math.min(5, Math.ceil(fog.t/60));
        for(let i=0;i<5;i++){
          ctx.fillStyle = i<dots ? "#4bb7ff" : "#c8d4dc";
          ctx.fillRect(64+i*8, 8, 5, 5);
        }
      } else {
        // il Taglio spazza la nebbia da destra a sinistra
        ctx.fillRect(0,0,Math.max(0,VW*fog.t/70),VH);
        ctx.globalAlpha = 1;
      }
      ctx.globalAlpha = 1;
    }
    // contatore stelle
    ctx.fillStyle="rgba(248,248,248,.85)"; ctx.fillRect(2,2,40,12);
    ctx.strokeStyle="#181820"; ctx.lineWidth=1; ctx.strokeRect(2.5,2.5,39,11);
    drawStar(ctx,10,8,3,"#e0a020");
    ctx.fillStyle="#181820"; ctx.font="bold 8px 'Courier New',monospace"; ctx.textBaseline="top";
    ctx.fillText(stars()+"/"+TOT_STELLE,17,5);
  }
  function textBox(lines, extra){
    const hasIcons = extra && extra.msgIcons;
    const h = hasIcons ? 58 : (lines.length>3 ? 48 : 38);
    const y = 142-h;
    ctx.fillStyle="#f8f8f8"; ctx.fillRect(2,y,156,h);
    ctx.strokeStyle="#181820"; ctx.lineWidth=2; ctx.strokeRect(3,y+1,154,h-2);
    ctx.fillStyle="#181820"; ctx.font="bold 9px 'Courier New',monospace"; ctx.textBaseline="top";
    lines.slice(0,4).forEach((l,i)=>ctx.fillText(l, 9, y+5+i*10));
    if(hasIcons){
      MSG_SEQ.forEach((id,i)=>{
        const x=26+i*40;
        ctx.fillStyle="#eef2f6"; ctx.fillRect(x,y+18,30,30);
        ctx.strokeStyle="#181820"; ctx.lineWidth=1; ctx.strokeRect(x+.5,y+18.5,29,29);
        drawSymbol(id,x+6,y+24,false);
      });
    }
  }
  function drawMemory(){
    const m=memory;
    ctx.fillStyle="#dcedf5"; ctx.fillRect(0,0,VW,VH);
    ctx.fillStyle="#181820"; ctx.font="bold 9px 'Courier New',monospace"; ctx.textBaseline="top";
    ctx.fillText("MEMORY con "+memoryCucc+"!",8,4);
    for(let i=0;i<6;i++){
      const col=i%3, row=Math.floor(i/3);
      const x=12+col*48, y=18+row*54;
      const c=m.cards[i];
      ctx.fillStyle = c.done ? "#c8f0c8" : "#f8f8f8";
      ctx.fillRect(x,y,40,48);
      ctx.strokeStyle = (i===m.cursor)?"#e0a020":"#181820";
      ctx.lineWidth=(i===m.cursor)?3:2;
      ctx.strokeRect(x+1,y+1,38,46);
      if(c.flip||c.done){
        ctx.drawImage(FACES[c.m],0,0,16,16,x+4,y+8,32,32);
      } else {
        drawStar(ctx,x+20,y+24,7,"#4bb7ff");
      }
    }
    ctx.fillStyle="#181820"; ctx.font="bold 8px 'Courier New',monospace";
    ctx.fillText("A: gira carta  B: dopo!",8,132);
  }
  function drawZaino(){
    ctx.fillStyle="#f2ead2"; ctx.fillRect(0,0,VW,VH);
    ctx.fillStyle="#181820"; ctx.font="bold 10px 'Courier New',monospace"; ctx.textBaseline="top";
    ctx.fillText("IL TUO ZAINO",8,5);
    ctx.fillRect(0,18,VW,1);
    drawStar(ctx,14,30,5,"#e0a020");
    ctx.font="bold 9px 'Courier New',monospace";
    ctx.fillText("STELLE: "+stars()+" su "+TOT_STELLE,26,26);
    ctx.fillText("Nello zaino:",8,46);
    let n=0;
    carry.forEach(id=>{
      const y=58+n*16;
      drawItemIcon(id,10,y);
      ctx.fillText(ITEMS[id],28,y+2);
      n++;
    });
    if(n===0){ ctx.font="bold 8px 'Courier New',monospace"; ctx.fillText("(vuoto)",12,60); }
    ctx.font="bold 8px 'Courier New',monospace";
    ctx.fillText("Parla con gli abitanti,",8,108);
    ctx.fillText("aiutali e gioca coi",8,118);
    ctx.fillText("cuccioli!  A/B: esci",8,128);
  }
  function drawFinal(){
    ctx.fillStyle="#16223c"; ctx.fillRect(0,0,VW,VH);
    for(let i=0;i<20;i++){
      const sx=(i*37)%VW, sy=(i*53)%100;
      ctx.fillStyle = ((tick>>4)+i)%3 ? "#f8f8f8" : "#8fb0ff";
      ctx.fillRect(sx,sy,1,1);
    }
    const winds=[["INTRECCIO","#7be07b",40],["MULINELLO","#4bb7ff",80],["TAGLIO","#ffb84b",120]];
    winds.forEach(([nm,col,cx],wi)=>{
      ctx.strokeStyle=col; ctx.lineWidth=2;
      for(let k=0;k<3;k++){
        const a=(tick/20)+wi*2+k*2.1;
        ctx.beginPath();
        ctx.arc(cx,52,6+k*5, a, a+3.6);
        ctx.stroke();
      }
      ctx.fillStyle=col; ctx.font="bold 7px 'Courier New',monospace"; ctx.textBaseline="top";
      ctx.fillText(nm, cx-20, 78);
    });
    ctx.fillStyle="#f8e858"; ctx.font="bold 10px 'Courier New',monospace";
    ctx.fillText("LA FESTA DEI",34,8);
    ctx.fillText("TRE VENTI!",42,20);
    for(let i=0;i<TOT_STELLE;i++) drawStar(ctx, 26+i*16, 98, 4, "#e0a020");
    ctx.fillStyle="#f8f8f8"; ctx.font="bold 8px 'Courier New',monospace";
    ctx.fillText("Hai aiutato tutta",30,112);
    ctx.fillText("l'isola! GRAZIE!",34,122);
    ctx.fillText("B: torna a casa",34,134);
  }
  function draw(){
    ctx.clearRect(0,0,VW,VH);
    if(mode==="memory"){ drawMemory(); return; }
    if(mode==="zaino"){ drawZaino(); return; }
    if(mode==="final"){ drawFinal(); return; }
    if(mode==="msg"){ drawMsg(); return; }
    drawMap();
    if(mode==="dialog") textBox(dialog.lines, dialog);
  }

  /* ---------- LOOP ---------- */
  function update(){
    tick++;
    if(mode==="map"||mode==="dialog"){ updateChars(); updateLeaves(); }
    if(forestCd>0) forestCd--;
    if(rippleT>0) rippleT--;
    if(mode==="map") updateMap();
    else if(mode==="dialog"){
      if(aPressed||bPressed){
        const mw=dialog.memoryWith;
        sfx.msg(); mode="map"; dialog=null;
        if(mw && aPressed){ startMemory(mw); }
        else if(scene){
          if(scene.q.length){ const b=scene.q.shift(); openDialog(b.lines,b); }
          else { const e=scene.end; scene=null; if(e)e(); }
        }
      }
    }
    else if(mode==="memory") updateMemory();
    else if(mode==="msg") updateMsg();
    else if(mode==="zaino"){
      if(aPressed||bPressed){ sfx.b(); mode="map"; }
    }
    else if(mode==="final"){
      if(bPressed||aPressed){ sfx.b(); mode="map"; }
    }
    aPressed=false; bPressed=false; dirTapped=null;
    draw();
    rafId=requestAnimationFrame(update);
  }
  rafId=requestAnimationFrame(update);

  return function fermaGioco() {
    cancelAnimationFrame(rafId);
    for (const [tipo, fn] of suFinestra) window.removeEventListener(tipo, fn);
    // L'uscita dal gioco non deve perdere i progressi della sessione.
    try { doSave(); } catch (e) { /* localStorage negato: si esce comunque */ }
  };
}
