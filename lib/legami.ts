/**
 * GENERATO — non si modifica a mano.
 *
 *   node scripts/estrai-legami.mjs --canone ../isola_i3v_visual
 *
 * Proiezione pubblica dei legami del canone: quali luoghi stanno in quale
 * quartiere, chi ci abita, e per dove passano le dodici storie. Gli id degli
 * abitanti e delle storie sono gli stessi di `lib/canone.ts`: il join non ha
 * bisogno di una tabella di corrispondenza.
 *
 * Delle storie escono il dove e il quando, mai come vanno a finire: i racconti
 * stanno nei libri (AGENTS.md, regola 7).
 *
 * LE POSIZIONI SONO SIMBOLICHE. Le coordinate dicono in quale quartiere sta una
 * cosa, non dove sta davvero: l'isola misura 7,9×6,7 km ma la bottega e la casa
 * di Nodo distano 5,4 metri. Le **aree dei quartieri** sono affidabili; la
 * disposizione dentro un quartiere si prende dall'illustrazione di reference e
 * dalle storie. Chi disegna una mappa leggendo `punti` come cartografia
 * ottiene un'isola che non è quella dei libri.
 *
 * Sorgenti: island.geojson v0.6.1 (2026-04-28) e story_graph.json.
 */

/** Riquadro della proiezione, in unità di viewBox SVG. */
export const vista = {"larghezza":1000,"altezza":848.38} as const;

export type LuogoMappa = {
  id: string;
  nome: string;
  /** Che cosa è: quarter, building, path, river, landmark… */
  tipo: string | null;
  /** Sottotipo, dove il canone lo dà: bakery, school, sentiero_costiero… */
  categoria: string | null;
  /** aria, fuoco, acqua, terra, centro, perimetro. */
  quartiere: string | null;
  /** Il luogo che lo contiene, quando ce n'è uno. */
  dentro: string | null;
  /** Id dell'abitante in lib/canone.ts, per i luoghi che sono la casa di qualcuno. */
  abitante: string | null;
  stato: string | null;
  altitudine: number | null;
  /** Verso della corrente, per i tratti d'acqua. */
  corrente: string | null;
  forma: string;
  /**
   * Coordinate proiettate, annidate come nel GeoJSON di partenza.
   * **Simboliche**: dicono il quartiere e il lato, non la posizione reale.
   * Affidabili per le aree (`tipo === "quarter"`), non per i singoli edifici.
   */
  punti: number[] | number[][] | number[][][];
};

export const luoghiMappa: LuogoMappa[] = [
    {
      "id": "island_outline",
      "nome": "Isola dei Tre Venti",
      "tipo": "island_outline",
      "categoria": null,
      "quartiere": "perimetro",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "Polygon",
      "punti": [
        [
          [
            1000,
            402.11
          ],
          [
            991.98,
            345.19
          ],
          [
            987.4,
            287.31
          ],
          [
            962.95,
            233.2
          ],
          [
            936.22,
            179.72
          ],
          [
            887.08,
            138.41
          ],
          [
            832.26,
            104.81
          ],
          [
            775.98,
            76.66
          ],
          [
            715.96,
            57.45
          ],
          [
            660.75,
            34.39
          ],
          [
            600.53,
            23.7
          ],
          [
            540.37,
            18.27
          ],
          [
            480.59,
            1.4
          ],
          [
            417.97,
            0
          ],
          [
            353.8,
            2.08
          ],
          [
            287.38,
            7.77
          ],
          [
            224.21,
            26.71
          ],
          [
            159.06,
            47.87
          ],
          [
            100.29,
            80.6
          ],
          [
            70.41,
            136.03
          ],
          [
            23.83,
            179.17
          ],
          [
            6.98,
            236.27
          ],
          [
            1.32,
            293.55
          ],
          [
            0,
            348.63
          ],
          [
            18.34,
            402.11
          ],
          [
            20.48,
            453.33
          ],
          [
            29.99,
            504.19
          ],
          [
            48.62,
            553.39
          ],
          [
            83.53,
            595.92
          ],
          [
            103.63,
            646.65
          ],
          [
            134.42,
            694.78
          ],
          [
            172.4,
            741.68
          ],
          [
            221.7,
            781.2
          ],
          [
            275.25,
            821.21
          ],
          [
            344.14,
            832.66
          ],
          [
            411.43,
            846.22
          ],
          [
            480.59,
            848.38
          ],
          [
            547.39,
            831.03
          ],
          [
            609.29,
            808.19
          ],
          [
            664.88,
            778.26
          ],
          [
            713.72,
            743.5
          ],
          [
            766.98,
            717.66
          ],
          [
            808.1,
            679.01
          ],
          [
            847.95,
            640.43
          ],
          [
            890.21,
            602.06
          ],
          [
            923.46,
            557.2
          ],
          [
            954.9,
            509.56
          ],
          [
            979.18,
            457.61
          ],
          [
            1000,
            402.11
          ]
        ]
      ]
    },
    {
      "id": "terra_interna",
      "nome": "Terra Interna",
      "tipo": "inner_land",
      "categoria": null,
      "quartiere": "centro",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "Polygon",
      "punti": [
        [
          [
            761.5,
            421.08
          ],
          [
            759.41,
            378.96
          ],
          [
            750.35,
            337.48
          ],
          [
            731.67,
            299.06
          ],
          [
            707.54,
            263.82
          ],
          [
            677.65,
            233.14
          ],
          [
            643.45,
            207.3
          ],
          [
            605.49,
            187.29
          ],
          [
            565.23,
            172.65
          ],
          [
            523.36,
            163.5
          ],
          [
            480.59,
            157.87
          ],
          [
            437.27,
            160.26
          ],
          [
            394.52,
            168.45
          ],
          [
            353.06,
            182.37
          ],
          [
            314.65,
            203.26
          ],
          [
            281.76,
            231.44
          ],
          [
            251.3,
            262.19
          ],
          [
            229.43,
            299.02
          ],
          [
            214.86,
            338.72
          ],
          [
            206.72,
            379.7
          ],
          [
            204.36,
            421.08
          ],
          [
            208.28,
            462.21
          ],
          [
            219.95,
            501.84
          ],
          [
            234.87,
            540.48
          ],
          [
            256.85,
            576.1
          ],
          [
            284.01,
            608.55
          ],
          [
            316.38,
            636.64
          ],
          [
            352.84,
            660.18
          ],
          [
            393.39,
            677.03
          ],
          [
            436.28,
            687.93
          ],
          [
            480.59,
            689.58
          ],
          [
            524.4,
            684.9
          ],
          [
            566.5,
            673.23
          ],
          [
            605.85,
            655.54
          ],
          [
            642.15,
            633.14
          ],
          [
            674.87,
            606.36
          ],
          [
            701.57,
            574.19
          ],
          [
            725.32,
            540
          ],
          [
            744.09,
            502.73
          ],
          [
            756.52,
            462.76
          ],
          [
            761.5,
            421.08
          ]
        ]
      ]
    },
    {
      "id": "fascia_costiera",
      "nome": "Fascia Costiera",
      "tipo": "coastal_belt",
      "categoria": null,
      "quartiere": "perimetro",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "Polygon",
      "punti": [
        [
          [
            1000,
            402.11
          ],
          [
            991.98,
            345.19
          ],
          [
            987.4,
            287.31
          ],
          [
            962.95,
            233.2
          ],
          [
            936.22,
            179.72
          ],
          [
            887.08,
            138.41
          ],
          [
            832.26,
            104.81
          ],
          [
            775.98,
            76.66
          ],
          [
            715.96,
            57.45
          ],
          [
            660.75,
            34.39
          ],
          [
            600.53,
            23.7
          ],
          [
            540.37,
            18.27
          ],
          [
            480.59,
            1.4
          ],
          [
            417.97,
            0
          ],
          [
            353.8,
            2.08
          ],
          [
            287.38,
            7.77
          ],
          [
            224.21,
            26.71
          ],
          [
            159.06,
            47.87
          ],
          [
            100.29,
            80.6
          ],
          [
            70.41,
            136.03
          ],
          [
            23.83,
            179.17
          ],
          [
            6.98,
            236.27
          ],
          [
            1.32,
            293.55
          ],
          [
            0,
            348.63
          ],
          [
            18.34,
            402.11
          ],
          [
            20.48,
            453.33
          ],
          [
            29.99,
            504.19
          ],
          [
            48.62,
            553.39
          ],
          [
            83.53,
            595.92
          ],
          [
            103.63,
            646.65
          ],
          [
            134.42,
            694.78
          ],
          [
            172.4,
            741.68
          ],
          [
            221.7,
            781.2
          ],
          [
            275.25,
            821.21
          ],
          [
            344.14,
            832.66
          ],
          [
            411.43,
            846.22
          ],
          [
            480.59,
            848.38
          ],
          [
            547.39,
            831.03
          ],
          [
            609.29,
            808.19
          ],
          [
            664.88,
            778.26
          ],
          [
            713.72,
            743.5
          ],
          [
            766.98,
            717.66
          ],
          [
            808.1,
            679.01
          ],
          [
            847.95,
            640.43
          ],
          [
            890.21,
            602.06
          ],
          [
            923.46,
            557.2
          ],
          [
            954.9,
            509.56
          ],
          [
            979.18,
            457.61
          ],
          [
            1000,
            402.11
          ]
        ],
        [
          [
            761.5,
            421.08
          ],
          [
            759.41,
            378.96
          ],
          [
            750.35,
            337.48
          ],
          [
            731.67,
            299.06
          ],
          [
            707.54,
            263.82
          ],
          [
            677.65,
            233.14
          ],
          [
            643.45,
            207.3
          ],
          [
            605.49,
            187.29
          ],
          [
            565.23,
            172.65
          ],
          [
            523.36,
            163.5
          ],
          [
            480.59,
            157.87
          ],
          [
            437.27,
            160.26
          ],
          [
            394.52,
            168.45
          ],
          [
            353.06,
            182.37
          ],
          [
            314.65,
            203.26
          ],
          [
            281.76,
            231.44
          ],
          [
            251.3,
            262.19
          ],
          [
            229.43,
            299.02
          ],
          [
            214.86,
            338.72
          ],
          [
            206.72,
            379.7
          ],
          [
            204.36,
            421.08
          ],
          [
            208.28,
            462.21
          ],
          [
            219.95,
            501.84
          ],
          [
            234.87,
            540.48
          ],
          [
            256.85,
            576.1
          ],
          [
            284.01,
            608.55
          ],
          [
            316.38,
            636.64
          ],
          [
            352.84,
            660.18
          ],
          [
            393.39,
            677.03
          ],
          [
            436.28,
            687.93
          ],
          [
            480.59,
            689.58
          ],
          [
            524.4,
            684.9
          ],
          [
            566.5,
            673.23
          ],
          [
            605.85,
            655.54
          ],
          [
            642.15,
            633.14
          ],
          [
            674.87,
            606.36
          ],
          [
            701.57,
            574.19
          ],
          [
            725.32,
            540
          ],
          [
            744.09,
            502.73
          ],
          [
            756.52,
            462.76
          ],
          [
            761.5,
            421.08
          ]
        ]
      ]
    },
    {
      "id": "fiume_capo",
      "nome": "Capo del Fiume",
      "tipo": "river",
      "categoria": null,
      "quartiere": "perimetro",
      "dentro": "fiume_che_gira",
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": "nord_verso_sud",
      "forma": "LineString",
      "punti": [
        [
          480.59,
          111.42
        ],
        [
          479.96,
          124.06
        ],
        [
          480.59,
          136.7
        ],
        [
          481.22,
          146.8
        ],
        [
          480.59,
          155.66
        ]
      ]
    },
    {
      "id": "fiume_braccio_ovest_alto",
      "nome": "Braccio Ovest — tratto alto",
      "tipo": "river",
      "categoria": null,
      "quartiere": "perimetro",
      "dentro": "fiume_che_gira",
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": "nord_verso_sud_lato_ovest",
      "forma": "LineString",
      "punti": [
        [
          480.59,
          155.66
        ],
        [
          459.75,
          156.41
        ],
        [
          439.03,
          158.69
        ],
        [
          418.57,
          162.46
        ],
        [
          398.5,
          167.72
        ],
        [
          378.93,
          174.41
        ],
        [
          359.99,
          182.52
        ],
        [
          341.79,
          191.98
        ],
        [
          324.45,
          202.72
        ],
        [
          308.06,
          214.71
        ],
        [
          292.74,
          227.84
        ],
        [
          278.59,
          242.05
        ],
        [
          265.68,
          257.26
        ],
        [
          254.08,
          273.33
        ],
        [
          243.89,
          290.23
        ],
        [
          235.16,
          307.8
        ],
        [
          227.94,
          325.96
        ],
        [
          222.28,
          344.57
        ],
        [
          218.21,
          363.56
        ],
        [
          215.76,
          382.78
        ]
      ]
    },
    {
      "id": "fiume_stretta_due_massi",
      "nome": "Stretta dei Due Massi",
      "tipo": "river",
      "categoria": null,
      "quartiere": "perimetro",
      "dentro": "fiume_che_gira",
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": "nord_verso_sud_lato_ovest",
      "forma": "LineString",
      "punti": [
        [
          215.76,
          382.78
        ],
        [
          214.94,
          402.11
        ],
        [
          215.76,
          421.46
        ]
      ]
    },
    {
      "id": "due_massi",
      "nome": "I Due Massi",
      "tipo": "landmark",
      "categoria": null,
      "quartiere": "perimetro",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "Point",
      "punti": [
        214.94,
        402.11
      ]
    },
    {
      "id": "fiume_braccio_ovest_medio",
      "nome": "Braccio Ovest — tratto medio",
      "tipo": "river",
      "categoria": null,
      "quartiere": "perimetro",
      "dentro": "fiume_che_gira",
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": "nord_verso_sud_lato_ovest",
      "forma": "LineString",
      "punti": [
        [
          215.76,
          421.46
        ],
        [
          218.21,
          440.68
        ],
        [
          222.28,
          459.66
        ],
        [
          227.94,
          478.27
        ],
        [
          235.16,
          496.43
        ],
        [
          243.89,
          514.01
        ],
        [
          254.08,
          530.88
        ],
        [
          265.68,
          546.98
        ],
        [
          278.59,
          562.18
        ]
      ]
    },
    {
      "id": "fiume_braccio_ovest_basso",
      "nome": "Braccio Ovest — tratto basso",
      "tipo": "river",
      "categoria": null,
      "quartiere": "perimetro",
      "dentro": "fiume_che_gira",
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": "nord_verso_sud_lato_ovest",
      "forma": "LineString",
      "punti": [
        [
          292.74,
          576.4
        ],
        [
          308.06,
          589.53
        ],
        [
          324.45,
          601.51
        ],
        [
          341.79,
          612.25
        ],
        [
          359.99,
          621.71
        ],
        [
          378.93,
          629.82
        ],
        [
          398.5,
          636.51
        ],
        [
          418.57,
          641.77
        ],
        [
          439.03,
          645.55
        ],
        [
          459.75,
          647.82
        ],
        [
          480.59,
          730.73
        ]
      ]
    },
    {
      "id": "fiume_braccio_est",
      "nome": "Braccio Est",
      "tipo": "river",
      "categoria": null,
      "quartiere": "perimetro",
      "dentro": "fiume_che_gira",
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": "nord_verso_sud_lato_est",
      "forma": "LineString",
      "punti": [
        [
          480.59,
          155.66
        ],
        [
          510.62,
          127.81
        ],
        [
          545.64,
          138.26
        ],
        [
          572.08,
          139.49
        ],
        [
          598.82,
          155.99
        ],
        [
          617.72,
          163.93
        ],
        [
          652.38,
          179.31
        ],
        [
          673.21,
          194.36
        ],
        [
          699.65,
          204.34
        ],
        [
          714.03,
          223.43
        ],
        [
          727.49,
          247.2
        ],
        [
          753.09,
          278.43
        ],
        [
          763.68,
          297.38
        ],
        [
          776.87,
          326.9
        ],
        [
          778.86,
          344.27
        ],
        [
          784.48,
          377.89
        ],
        [
          778.9,
          396.55
        ],
        [
          782.4,
          422.48
        ],
        [
          773.82,
          451.18
        ],
        [
          775.08,
          475.69
        ],
        [
          754.99,
          507.72
        ],
        [
          742.67,
          527.03
        ],
        [
          731.19,
          547.28
        ],
        [
          713.7,
          571.04
        ],
        [
          699.92,
          597.57
        ],
        [
          673.91,
          606.39
        ],
        [
          649.6,
          629.83
        ],
        [
          620.76,
          638.15
        ],
        [
          592.88,
          651.86
        ],
        [
          569.43,
          661.48
        ],
        [
          535.13,
          666.63
        ],
        [
          515.61,
          674.84
        ],
        [
          480.59,
          730.73
        ]
      ]
    },
    {
      "id": "torrente_affluente_foresta",
      "nome": "Torrente della Foresta",
      "tipo": "stream",
      "categoria": null,
      "quartiere": "terra",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          227.59,
          364.2
        ],
        [
          214.94,
          402.11
        ],
        [
          221.27,
          440.03
        ],
        [
          233.91,
          477.95
        ],
        [
          252.89,
          503.23
        ],
        [
          235.16,
          496.43
        ]
      ]
    },
    {
      "id": "sorgente",
      "nome": "Sorgente del Fiume",
      "tipo": "river_source",
      "categoria": null,
      "quartiere": "aria",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "Point",
      "punti": [
        480.59,
        111.42
      ]
    },
    {
      "id": "fiume_biforcazione",
      "nome": "Biforcazione del Fiume",
      "tipo": "river_fork",
      "categoria": null,
      "quartiere": "aria",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "Point",
      "punti": [
        480.59,
        155.66
      ]
    },
    {
      "id": "guado_di_pietre_piatte",
      "nome": "Guado di Pietre Piatte",
      "tipo": "ford",
      "categoria": null,
      "quartiere": "aria",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "Point",
      "punti": [
        480.59,
        136.7
      ]
    },
    {
      "id": "bocca",
      "nome": "Bocca",
      "tipo": "river_mouth",
      "categoria": null,
      "quartiere": "acqua",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "Point",
      "punti": [
        480.59,
        730.73
      ]
    },
    {
      "id": "greto_montagna_est",
      "nome": "Greto della Montagna Est",
      "tipo": "seasonal_streambed",
      "categoria": null,
      "quartiere": "aria",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          518.54,
          54.55
        ],
        [
          505.89,
          79.81
        ],
        [
          493.24,
          98.78
        ],
        [
          480.59,
          111.42
        ]
      ]
    },
    {
      "id": "greto_montagna_ovest",
      "nome": "Greto della Montagna Ovest",
      "tipo": "seasonal_streambed",
      "categoria": null,
      "quartiere": "aria",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          442.63,
          54.55
        ],
        [
          455.28,
          79.81
        ],
        [
          467.94,
          98.78
        ],
        [
          480.59,
          111.42
        ]
      ]
    },
    {
      "id": "villaggio",
      "nome": "Villaggio",
      "tipo": "quarter",
      "categoria": null,
      "quartiere": "centro",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "Polygon",
      "punti": [
        [
          [
            516.01,
            402.11
          ],
          [
            514.81,
            392.96
          ],
          [
            511.27,
            384.42
          ],
          [
            505.64,
            377.09
          ],
          [
            498.29,
            371.47
          ],
          [
            489.76,
            367.93
          ],
          [
            480.59,
            366.73
          ],
          [
            471.42,
            367.93
          ],
          [
            462.88,
            371.47
          ],
          [
            455.54,
            377.09
          ],
          [
            449.92,
            384.42
          ],
          [
            446.38,
            392.96
          ],
          [
            445.17,
            402.11
          ],
          [
            446.38,
            411.27
          ],
          [
            449.92,
            419.81
          ],
          [
            455.54,
            427.14
          ],
          [
            462.88,
            432.76
          ],
          [
            471.42,
            436.3
          ],
          [
            480.59,
            437.51
          ],
          [
            489.76,
            436.3
          ],
          [
            498.29,
            432.76
          ],
          [
            505.64,
            427.14
          ],
          [
            511.27,
            419.81
          ],
          [
            514.81,
            411.27
          ],
          [
            516.01,
            402.11
          ]
        ]
      ]
    },
    {
      "id": "piazza_villaggio",
      "nome": "Piazza del Villaggio",
      "tipo": "square",
      "categoria": null,
      "quartiere": "centro",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "Polygon",
      "punti": [
        [
          [
            482.17,
            402.11
          ],
          [
            482.05,
            401.51
          ],
          [
            481.7,
            401
          ],
          [
            481.19,
            400.65
          ],
          [
            480.59,
            400.54
          ],
          [
            479.98,
            400.65
          ],
          [
            479.47,
            401
          ],
          [
            479.12,
            401.51
          ],
          [
            479.01,
            402.11
          ],
          [
            479.12,
            402.73
          ],
          [
            479.47,
            403.23
          ],
          [
            479.98,
            403.58
          ],
          [
            480.59,
            403.69
          ],
          [
            481.19,
            403.58
          ],
          [
            481.7,
            403.23
          ],
          [
            482.05,
            402.73
          ],
          [
            482.17,
            402.11
          ]
        ]
      ]
    },
    {
      "id": "albero_vecchio",
      "nome": "Albero Vecchio",
      "tipo": "landmark",
      "categoria": null,
      "quartiere": "centro",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "Point",
      "punti": [
        480.59,
        402.11
      ]
    },
    {
      "id": "pozzo_piazza",
      "nome": "Pozzo della Piazza",
      "tipo": "landmark",
      "categoria": null,
      "quartiere": "centro",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "Point",
      "punti": [
        480.59,
        402.49
      ]
    },
    {
      "id": "panca_di_pietra",
      "nome": "Panca di Pietra",
      "tipo": "landmark",
      "categoria": null,
      "quartiere": "centro",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "Point",
      "punti": [
        480.85,
        402.49
      ]
    },
    {
      "id": "scuola_stria",
      "nome": "Scuola di Stria",
      "tipo": "building",
      "categoria": "school",
      "quartiere": "centro",
      "dentro": null,
      "abitante": "stria",
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "Point",
      "punti": [
        475.27,
        407.43
      ]
    },
    {
      "id": "casa_stria",
      "nome": "Casa di Stria",
      "tipo": "building",
      "categoria": "dwelling",
      "quartiere": "centro",
      "dentro": null,
      "abitante": "stria",
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "Point",
      "punti": [
        474.64,
        408.18
      ]
    },
    {
      "id": "bottega_nodo",
      "nome": "Bottega di Nodo",
      "tipo": "building",
      "categoria": "workshop",
      "quartiere": "centro",
      "dentro": null,
      "abitante": "nodo",
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "Point",
      "punti": [
        482.87,
        401.1
      ]
    },
    {
      "id": "casa_nodo",
      "nome": "Casa di Nodo",
      "tipo": "building",
      "categoria": "dwelling",
      "quartiere": "centro",
      "dentro": null,
      "abitante": "nodo",
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "Point",
      "punti": [
        483.11,
        400.47
      ]
    },
    {
      "id": "casa_memolo",
      "nome": "Casetta di Mèmolo",
      "tipo": "building",
      "categoria": "dwelling",
      "quartiere": "centro",
      "dentro": null,
      "abitante": "memolo",
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "Point",
      "punti": [
        478.44,
        400.47
      ]
    },
    {
      "id": "casa_memolo_cortile",
      "nome": "Cortile di Mèmolo",
      "tipo": "landmark",
      "categoria": null,
      "quartiere": "centro",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "Point",
      "punti": [
        478.44,
        400.22
      ]
    },
    {
      "id": "cespuglio_dietro_albero_vecchio",
      "nome": "Cespuglio dietro l'Albero",
      "tipo": "landmark",
      "categoria": null,
      "quartiere": "centro",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "Point",
      "punti": [
        480.34,
        401.6
      ]
    },
    {
      "id": "quartiere_fuoco",
      "nome": "Quartiere di Fuoco",
      "tipo": "quarter",
      "categoria": null,
      "quartiere": "fuoco",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": null,
      "corrente": null,
      "forma": "Polygon",
      "punti": [
        [
          [
            786.47,
            402.11
          ],
          [
            786.03,
            386.79
          ],
          [
            778.43,
            372.3
          ],
          [
            767.69,
            358.79
          ],
          [
            751.06,
            348.35
          ],
          [
            732.41,
            340.24
          ],
          [
            712.04,
            335.05
          ],
          [
            691.78,
            330.32
          ],
          [
            670.34,
            329.13
          ],
          [
            648.39,
            328.64
          ],
          [
            626.26,
            331.23
          ],
          [
            605.07,
            337.05
          ],
          [
            586.65,
            346.37
          ],
          [
            572.86,
            358.73
          ],
          [
            562.74,
            372.42
          ],
          [
            559.11,
            387.38
          ],
          [
            560.13,
            402.11
          ],
          [
            563.64,
            416.25
          ],
          [
            567.74,
            430.42
          ],
          [
            577.54,
            443.43
          ],
          [
            590.09,
            455.57
          ],
          [
            605.71,
            466.55
          ],
          [
            625.63,
            474.01
          ],
          [
            647.24,
            479.48
          ],
          [
            670.34,
            479.93
          ],
          [
            692.83,
            477.42
          ],
          [
            713.27,
            471.16
          ],
          [
            731.41,
            463
          ],
          [
            748.45,
            454.14
          ],
          [
            761.36,
            442.63
          ],
          [
            773.79,
            430.66
          ],
          [
            782.57,
            416.98
          ],
          [
            786.47,
            402.11
          ]
        ]
      ]
    },
    {
      "id": "quartiere_acqua",
      "nome": "Quartiere d'Acqua",
      "tipo": "quarter",
      "categoria": null,
      "quartiere": "acqua",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": null,
      "corrente": null,
      "forma": "Polygon",
      "punti": [
        [
          [
            598.06,
            629.62
          ],
          [
            595.08,
            616.98
          ],
          [
            590.1,
            604.44
          ],
          [
            577.45,
            593.69
          ],
          [
            561.42,
            584.74
          ],
          [
            542.76,
            577.97
          ],
          [
            522.3,
            573.72
          ],
          [
            502.16,
            569.42
          ],
          [
            480.59,
            568.83
          ],
          [
            458.6,
            568.24
          ],
          [
            436.63,
            570.71
          ],
          [
            415.67,
            575.69
          ],
          [
            396.81,
            583.12
          ],
          [
            383.78,
            593.71
          ],
          [
            373.72,
            605.04
          ],
          [
            369.24,
            617.32
          ],
          [
            368.69,
            629.62
          ],
          [
            372.06,
            641.6
          ],
          [
            378.49,
            653.09
          ],
          [
            387.81,
            664.02
          ],
          [
            400.39,
            674.14
          ],
          [
            416.26,
            683.06
          ],
          [
            435.22,
            690.41
          ],
          [
            457.33,
            694.52
          ],
          [
            480.59,
            695.1
          ],
          [
            503.1,
            692.43
          ],
          [
            523.64,
            687.31
          ],
          [
            541.78,
            680.45
          ],
          [
            557.32,
            672.22
          ],
          [
            572.05,
            663.55
          ],
          [
            584.39,
            653.49
          ],
          [
            592.72,
            642
          ],
          [
            598.06,
            629.62
          ]
        ]
      ]
    },
    {
      "id": "quartiere_terra",
      "nome": "Quartiere di Terra",
      "tipo": "quarter",
      "categoria": null,
      "quartiere": "terra",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": null,
      "corrente": null,
      "forma": "Polygon",
      "punti": [
        [
          [
            420.63,
            402.11
          ],
          [
            420.54,
            384.07
          ],
          [
            411.76,
            367.08
          ],
          [
            398.83,
            351.65
          ],
          [
            380.66,
            339.3
          ],
          [
            359.83,
            329.9
          ],
          [
            337.38,
            323.52
          ],
          [
            314.46,
            319.07
          ],
          [
            290.83,
            316.78
          ],
          [
            266.33,
            315.97
          ],
          [
            242,
            319.66
          ],
          [
            217.82,
            325.69
          ],
          [
            197.49,
            336.83
          ],
          [
            182.75,
            351.6
          ],
          [
            171.63,
            367.58
          ],
          [
            167.17,
            384.91
          ],
          [
            167.11,
            402.11
          ],
          [
            171.06,
            418.78
          ],
          [
            177.39,
            434.98
          ],
          [
            187.53,
            450.4
          ],
          [
            201.68,
            464.47
          ],
          [
            219.16,
            477.14
          ],
          [
            241.01,
            486.24
          ],
          [
            265.14,
            492.47
          ],
          [
            290.83,
            493.95
          ],
          [
            315.69,
            489.53
          ],
          [
            338.78,
            483.06
          ],
          [
            359.62,
            474.11
          ],
          [
            376.54,
            462.06
          ],
          [
            392.77,
            449.75
          ],
          [
            405.77,
            435.41
          ],
          [
            415.34,
            419.44
          ],
          [
            420.63,
            402.11
          ]
        ]
      ]
    },
    {
      "id": "quartiere_aria",
      "nome": "Quartiere d'Aria",
      "tipo": "quarter",
      "categoria": null,
      "quartiere": "aria",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": null,
      "corrente": null,
      "forma": "Polygon",
      "punti": [
        [
          [
            637.06,
            187.25
          ],
          [
            633.54,
            166.99
          ],
          [
            626.03,
            147.13
          ],
          [
            609.73,
            129.77
          ],
          [
            588.38,
            115.46
          ],
          [
            563.52,
            104.57
          ],
          [
            536.82,
            96.83
          ],
          [
            509.05,
            91.96
          ],
          [
            480.59,
            88.81
          ],
          [
            451.36,
            89.39
          ],
          [
            421.67,
            92.51
          ],
          [
            393.41,
            100.35
          ],
          [
            370.43,
            113.88
          ],
          [
            348.88,
            128.64
          ],
          [
            337.85,
            147.87
          ],
          [
            332.37,
            167.61
          ],
          [
            332.56,
            187.25
          ],
          [
            337.13,
            206.26
          ],
          [
            346.8,
            224.16
          ],
          [
            356.88,
            242.31
          ],
          [
            373.52,
            258.57
          ],
          [
            394.22,
            273.35
          ],
          [
            420.87,
            283.28
          ],
          [
            450.03,
            289.57
          ],
          [
            480.59,
            291.14
          ],
          [
            510.6,
            287.73
          ],
          [
            538.08,
            279.69
          ],
          [
            563.26,
            269.66
          ],
          [
            584.55,
            256.5
          ],
          [
            603.41,
            241.91
          ],
          [
            619.19,
            225.49
          ],
          [
            630.25,
            207.09
          ],
          [
            637.06,
            187.25
          ]
        ]
      ]
    },
    {
      "id": "orti_cerchio_interno",
      "nome": "Orti del Cerchio — anello interno",
      "tipo": "fields",
      "categoria": "herbs_vegetables",
      "quartiere": "terra",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "Polygon",
      "punti": [
        [
          [
            381.92,
            402.11
          ],
          [
            381.63,
            399.16
          ],
          [
            380.77,
            396.31
          ],
          [
            379.35,
            393.69
          ],
          [
            377.47,
            391.39
          ],
          [
            375.17,
            389.51
          ],
          [
            372.54,
            388.11
          ],
          [
            369.7,
            387.24
          ],
          [
            366.74,
            386.94
          ],
          [
            363.78,
            387.24
          ],
          [
            360.92,
            388.11
          ],
          [
            358.3,
            389.51
          ],
          [
            356,
            391.39
          ],
          [
            354.11,
            393.69
          ],
          [
            352.72,
            396.31
          ],
          [
            351.85,
            399.16
          ],
          [
            351.56,
            402.11
          ],
          [
            351.85,
            405.07
          ],
          [
            352.72,
            407.92
          ],
          [
            354.11,
            410.54
          ],
          [
            356,
            412.84
          ],
          [
            358.3,
            414.72
          ],
          [
            360.92,
            416.12
          ],
          [
            363.78,
            416.99
          ],
          [
            366.74,
            417.29
          ],
          [
            369.7,
            416.99
          ],
          [
            372.54,
            416.12
          ],
          [
            375.17,
            414.72
          ],
          [
            377.47,
            412.84
          ],
          [
            379.35,
            410.54
          ],
          [
            380.77,
            407.92
          ],
          [
            381.63,
            405.07
          ],
          [
            381.92,
            402.11
          ]
        ]
      ]
    },
    {
      "id": "orti_cerchio_medio",
      "nome": "Orti del Cerchio — anello medio",
      "tipo": "fields",
      "categoria": "grains_legumes",
      "quartiere": "terra",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "Polygon",
      "punti": [
        [
          [
            402.16,
            402.11
          ],
          [
            401.62,
            395.96
          ],
          [
            400.03,
            390.02
          ],
          [
            397.41,
            384.42
          ],
          [
            393.88,
            379.37
          ],
          [
            389.51,
            375
          ],
          [
            384.45,
            371.47
          ],
          [
            378.86,
            368.86
          ],
          [
            372.89,
            367.26
          ],
          [
            366.74,
            366.73
          ],
          [
            360.59,
            367.26
          ],
          [
            354.62,
            368.86
          ],
          [
            349.03,
            371.47
          ],
          [
            343.97,
            375
          ],
          [
            339.6,
            379.37
          ],
          [
            336.07,
            384.42
          ],
          [
            333.45,
            390.02
          ],
          [
            331.86,
            395.96
          ],
          [
            331.31,
            402.11
          ],
          [
            331.86,
            408.25
          ],
          [
            333.45,
            414.22
          ],
          [
            336.07,
            419.81
          ],
          [
            339.6,
            424.86
          ],
          [
            343.97,
            429.23
          ],
          [
            349.03,
            432.76
          ],
          [
            354.62,
            435.37
          ],
          [
            360.59,
            436.97
          ],
          [
            366.74,
            437.51
          ],
          [
            372.89,
            436.97
          ],
          [
            378.86,
            435.37
          ],
          [
            384.45,
            432.76
          ],
          [
            389.51,
            429.23
          ],
          [
            393.88,
            424.86
          ],
          [
            397.41,
            419.81
          ],
          [
            400.03,
            414.22
          ],
          [
            401.62,
            408.25
          ],
          [
            402.16,
            402.11
          ]
        ],
        [
          [
            383.18,
            402.11
          ],
          [
            382.87,
            405.32
          ],
          [
            381.93,
            408.41
          ],
          [
            380.41,
            411.24
          ],
          [
            378.37,
            413.74
          ],
          [
            375.87,
            415.77
          ],
          [
            373.03,
            417.29
          ],
          [
            369.94,
            418.23
          ],
          [
            366.74,
            418.55
          ],
          [
            363.53,
            418.23
          ],
          [
            360.45,
            417.29
          ],
          [
            357.61,
            415.77
          ],
          [
            355.11,
            413.74
          ],
          [
            353.06,
            411.24
          ],
          [
            351.55,
            408.41
          ],
          [
            350.61,
            405.32
          ],
          [
            350.3,
            402.11
          ],
          [
            350.61,
            398.91
          ],
          [
            351.55,
            395.82
          ],
          [
            353.06,
            392.99
          ],
          [
            355.11,
            390.49
          ],
          [
            357.61,
            388.46
          ],
          [
            360.45,
            386.93
          ],
          [
            363.53,
            386
          ],
          [
            366.74,
            385.68
          ],
          [
            369.94,
            386
          ],
          [
            373.03,
            386.93
          ],
          [
            375.87,
            388.46
          ],
          [
            378.37,
            390.49
          ],
          [
            380.41,
            392.99
          ],
          [
            381.93,
            395.82
          ],
          [
            382.87,
            398.91
          ],
          [
            383.18,
            402.11
          ]
        ]
      ]
    },
    {
      "id": "orti_cerchio_esterno",
      "nome": "Orti del Cerchio — anello esterno",
      "tipo": "fields",
      "categoria": "orchards",
      "quartiere": "terra",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "Polygon",
      "punti": [
        [
          [
            423.66,
            402.11
          ],
          [
            422.97,
            393.21
          ],
          [
            420.87,
            384.54
          ],
          [
            417.46,
            376.3
          ],
          [
            412.79,
            368.69
          ],
          [
            406.99,
            361.9
          ],
          [
            400.2,
            356.11
          ],
          [
            392.58,
            351.44
          ],
          [
            384.33,
            348.03
          ],
          [
            375.64,
            345.94
          ],
          [
            366.74,
            345.23
          ],
          [
            357.84,
            345.94
          ],
          [
            349.14,
            348.03
          ],
          [
            340.9,
            351.44
          ],
          [
            333.28,
            356.11
          ],
          [
            326.48,
            361.9
          ],
          [
            320.69,
            368.69
          ],
          [
            316.02,
            376.3
          ],
          [
            312.59,
            384.54
          ],
          [
            310.51,
            393.21
          ],
          [
            309.81,
            402.11
          ],
          [
            310.51,
            411.02
          ],
          [
            312.59,
            419.69
          ],
          [
            316.02,
            427.94
          ],
          [
            320.69,
            435.54
          ],
          [
            326.48,
            442.33
          ],
          [
            333.28,
            448.13
          ],
          [
            340.9,
            452.8
          ],
          [
            349.14,
            456.21
          ],
          [
            357.84,
            458.3
          ],
          [
            366.74,
            459
          ],
          [
            375.64,
            458.3
          ],
          [
            384.33,
            456.21
          ],
          [
            392.58,
            452.8
          ],
          [
            400.2,
            448.13
          ],
          [
            406.99,
            442.33
          ],
          [
            412.79,
            435.54
          ],
          [
            417.46,
            427.94
          ],
          [
            420.87,
            419.69
          ],
          [
            422.97,
            411.02
          ],
          [
            423.66,
            402.11
          ]
        ],
        [
          [
            403.43,
            402.11
          ],
          [
            402.87,
            408.48
          ],
          [
            401.21,
            414.65
          ],
          [
            398.51,
            420.45
          ],
          [
            394.84,
            425.68
          ],
          [
            390.32,
            430.2
          ],
          [
            385.08,
            433.86
          ],
          [
            379.29,
            436.57
          ],
          [
            373.11,
            438.21
          ],
          [
            366.74,
            438.77
          ],
          [
            360.37,
            438.21
          ],
          [
            354.2,
            436.57
          ],
          [
            348.39,
            433.86
          ],
          [
            343.15,
            430.2
          ],
          [
            338.63,
            425.68
          ],
          [
            334.97,
            420.45
          ],
          [
            332.26,
            414.65
          ],
          [
            330.61,
            408.48
          ],
          [
            330.05,
            402.11
          ],
          [
            330.61,
            395.75
          ],
          [
            332.26,
            389.58
          ],
          [
            334.97,
            383.79
          ],
          [
            338.63,
            378.55
          ],
          [
            343.15,
            374.04
          ],
          [
            348.39,
            370.37
          ],
          [
            354.2,
            367.67
          ],
          [
            360.37,
            366.03
          ],
          [
            366.74,
            365.46
          ],
          [
            373.11,
            366.03
          ],
          [
            379.29,
            367.67
          ],
          [
            385.08,
            370.37
          ],
          [
            390.32,
            374.04
          ],
          [
            394.84,
            378.55
          ],
          [
            398.51,
            383.79
          ],
          [
            401.21,
            389.58
          ],
          [
            402.87,
            395.75
          ],
          [
            403.43,
            402.11
          ]
        ]
      ]
    },
    {
      "id": "orti_del_cerchio",
      "nome": "Orti del Cerchio",
      "tipo": "fields",
      "categoria": null,
      "quartiere": "terra",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "Point",
      "punti": [
        366.74,
        402.11
      ]
    },
    {
      "id": "foresta_intrecciata",
      "nome": "Foresta Intrecciata",
      "tipo": "forest",
      "categoria": null,
      "quartiere": "terra",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "Polygon",
      "punti": [
        [
          [
            337.01,
            427.39
          ],
          [
            339.37,
            410.34
          ],
          [
            336.22,
            393.09
          ],
          [
            321,
            379.8
          ],
          [
            305.09,
            368.61
          ],
          [
            286.49,
            361.13
          ],
          [
            267.78,
            356.28
          ],
          [
            250.15,
            352.22
          ],
          [
            232.65,
            349.3
          ],
          [
            214.94,
            345.67
          ],
          [
            195.76,
            342.86
          ],
          [
            175.17,
            342.47
          ],
          [
            152.81,
            343.76
          ],
          [
            133.03,
            351.55
          ],
          [
            117.19,
            363.65
          ],
          [
            108.78,
            379.76
          ],
          [
            104.04,
            396.02
          ],
          [
            104.51,
            412.27
          ],
          [
            110.59,
            427.39
          ],
          [
            113.07,
            441.35
          ],
          [
            118.15,
            454.76
          ],
          [
            127.54,
            466.6
          ],
          [
            130.71,
            482.31
          ],
          [
            139.84,
            496.93
          ],
          [
            153.56,
            510.01
          ],
          [
            171.17,
            520.85
          ],
          [
            192.79,
            524.99
          ],
          [
            214.94,
            521.85
          ],
          [
            235.57,
            518.33
          ],
          [
            253.23,
            509.15
          ],
          [
            267.99,
            498.8
          ],
          [
            282.29,
            489.76
          ],
          [
            295.33,
            479.82
          ],
          [
            305.8,
            468.16
          ],
          [
            319.15,
            456.87
          ],
          [
            329.11,
            443.03
          ],
          [
            337.01,
            427.39
          ]
        ]
      ]
    },
    {
      "id": "pascoli_alti",
      "nome": "Pascoli Alti",
      "tipo": "fields",
      "categoria": "pasture",
      "quartiere": "aria",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "Polygon",
      "punti": [
        [
          [
            600.1,
            206.22
          ],
          [
            597.29,
            193.32
          ],
          [
            593.67,
            180.21
          ],
          [
            578.18,
            170.02
          ],
          [
            561.49,
            161.3
          ],
          [
            541.53,
            155.59
          ],
          [
            522.05,
            150.63
          ],
          [
            501.47,
            147.94
          ],
          [
            480.59,
            145.26
          ],
          [
            458.87,
            145.58
          ],
          [
            435.97,
            146.42
          ],
          [
            415.02,
            151.74
          ],
          [
            396.48,
            159.53
          ],
          [
            381.04,
            169.29
          ],
          [
            372.46,
            181.36
          ],
          [
            369.8,
            193.98
          ],
          [
            370.68,
            206.22
          ],
          [
            375.75,
            217.79
          ],
          [
            380.06,
            229.32
          ],
          [
            388.79,
            240.25
          ],
          [
            400.39,
            250.73
          ],
          [
            415.45,
            260.33
          ],
          [
            434.6,
            267.83
          ],
          [
            456.95,
            272.17
          ],
          [
            480.59,
            273.15
          ],
          [
            503.13,
            269.1
          ],
          [
            523.45,
            263.65
          ],
          [
            540.95,
            256.36
          ],
          [
            554.85,
            247.44
          ],
          [
            570.92,
            239.71
          ],
          [
            583.28,
            229.81
          ],
          [
            592.95,
            218.62
          ],
          [
            600.1,
            206.22
          ]
        ]
      ]
    },
    {
      "id": "forno",
      "nome": "Forno di Fiamma",
      "tipo": "building",
      "categoria": "bakery",
      "quartiere": "fuoco",
      "dentro": null,
      "abitante": "fiamma",
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "Point",
      "punti": [
        619.74,
        402.11
      ]
    },
    {
      "id": "forno_cortile",
      "nome": "Cortile del Forno",
      "tipo": "landmark",
      "categoria": null,
      "quartiere": "fuoco",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "Point",
      "punti": [
        620.37,
        400.85
      ]
    },
    {
      "id": "case_del_mattino",
      "nome": "Case del Mattino",
      "tipo": "building",
      "categoria": "dwelling_cluster",
      "quartiere": "fuoco",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": null,
      "corrente": null,
      "forma": "Point",
      "punti": [
        657.69,
        402.11
      ]
    },
    {
      "id": "fabbro",
      "nome": "Fabbro",
      "tipo": "building",
      "categoria": "forge",
      "quartiere": "fuoco",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": null,
      "corrente": null,
      "forma": "Point",
      "punti": [
        657.69,
        414.75
      ]
    },
    {
      "id": "conceria",
      "nome": "Conceria",
      "tipo": "building",
      "categoria": "tanner",
      "quartiere": "fuoco",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": null,
      "corrente": null,
      "forma": "Point",
      "punti": [
        670.34,
        408.44
      ]
    },
    {
      "id": "essiccatoio",
      "nome": "Essiccatoio",
      "tipo": "building",
      "categoria": "drying_rack",
      "quartiere": "fuoco",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": null,
      "corrente": null,
      "forma": "Point",
      "punti": [
        664.02,
        395.8
      ]
    },
    {
      "id": "pontile_bocca",
      "nome": "Pontile di Bartolo",
      "tipo": "pier",
      "categoria": null,
      "quartiere": "acqua",
      "dentro": null,
      "abitante": "bartolo",
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          481.85,
          718.09
        ],
        [
          481.85,
          737.05
        ]
      ]
    },
    {
      "id": "capanna_bartolo",
      "nome": "Capanna di Bartolo",
      "tipo": "building",
      "categoria": "dwelling",
      "quartiere": "acqua",
      "dentro": null,
      "abitante": "bartolo",
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "Point",
      "punti": [
        481.85,
        737.05
      ]
    },
    {
      "id": "spiaggia_conchiglie",
      "nome": "Spiaggia delle Conchiglie",
      "tipo": "beach",
      "categoria": null,
      "quartiere": "acqua",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "Polygon",
      "punti": [
        [
          [
            505.89,
            743.37
          ],
          [
            524.86,
            745.9
          ],
          [
            531.19,
            756.01
          ],
          [
            518.54,
            762.33
          ],
          [
            505.89,
            756.01
          ],
          [
            505.89,
            743.37
          ]
        ]
      ]
    },
    {
      "id": "casa_amo",
      "nome": "Casa di Amo",
      "tipo": "building",
      "categoria": "dwelling",
      "quartiere": "acqua",
      "dentro": null,
      "abitante": "amo",
      "stato": "canonico",
      "altitudine": 12,
      "corrente": null,
      "forma": "Point",
      "punti": [
        534.98,
        752.21
      ]
    },
    {
      "id": "scogliera_est",
      "nome": "Scogliera Est",
      "tipo": "cliff",
      "categoria": null,
      "quartiere": "acqua",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": 15,
      "corrente": null,
      "forma": "Point",
      "punti": [
        536.25,
        753.49
      ]
    },
    {
      "id": "case_basse_pescatori",
      "nome": "Case Basse dei Pescatori",
      "tipo": "building",
      "categoria": "fisher_house_cluster",
      "quartiere": "acqua",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "Point",
      "punti": [
        467.94,
        705.45
      ]
    },
    {
      "id": "tana_rovo",
      "nome": "Tana di Rovo",
      "tipo": "burrow",
      "categoria": null,
      "quartiere": "terra",
      "dentro": null,
      "abitante": "rovo",
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "Point",
      "punti": [
        278.19,
        376.84
      ]
    },
    {
      "id": "casa_salvia",
      "nome": "Casa di Salvia",
      "tipo": "burrow",
      "categoria": "burrow_dwelling",
      "quartiere": "terra",
      "dentro": null,
      "abitante": "salvia",
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "Point",
      "punti": [
        341.44,
        364.2
      ]
    },
    {
      "id": "casa_zolla",
      "nome": "Casa di Zolla",
      "tipo": "burrow",
      "categoria": "burrow_dwelling",
      "quartiere": "terra",
      "dentro": null,
      "abitante": "zolla",
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "Point",
      "punti": [
        328.79,
        440.03
      ]
    },
    {
      "id": "roccia_alta",
      "nome": "Roccia Alta",
      "tipo": "landmark",
      "categoria": null,
      "quartiere": "aria",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": 550,
      "corrente": null,
      "forma": "Point",
      "punti": [
        505.89,
        174.61
      ]
    },
    {
      "id": "montagna_gemella_est",
      "nome": "Montagna Gemella Est",
      "tipo": "mountain_peak",
      "categoria": null,
      "quartiere": "aria",
      "dentro": "montagne_gemelle",
      "abitante": null,
      "stato": "canonico",
      "altitudine": 1050,
      "corrente": null,
      "forma": "Point",
      "punti": [
        518.54,
        54.55
      ]
    },
    {
      "id": "montagna_gemella_ovest",
      "nome": "Montagna Gemella Ovest",
      "tipo": "mountain_peak",
      "categoria": null,
      "quartiere": "aria",
      "dentro": "montagne_gemelle",
      "abitante": null,
      "stato": "canonico",
      "altitudine": 980,
      "corrente": null,
      "forma": "Point",
      "punti": [
        442.63,
        54.55
      ]
    },
    {
      "id": "burrone",
      "nome": "Burrone",
      "tipo": "valley",
      "categoria": null,
      "quartiere": "aria",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          448.96,
          54.55
        ],
        [
          480.59,
          73.5
        ],
        [
          512.22,
          54.55
        ]
      ]
    },
    {
      "id": "grotta_grunto",
      "nome": "Grotta di Grunto",
      "tipo": "cave",
      "categoria": null,
      "quartiere": "aria",
      "dentro": null,
      "abitante": "grunto",
      "stato": "canonico",
      "altitudine": 850,
      "corrente": null,
      "forma": "Point",
      "punti": [
        483.11,
        63.38
      ]
    },
    {
      "id": "capanne_stagionali_pastori",
      "nome": "Capanne Stagionali dei Pastori",
      "tipo": "building",
      "categoria": "seasonal_shelter",
      "quartiere": "aria",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": null,
      "corrente": null,
      "forma": "Point",
      "punti": [
        455.28,
        199.89
      ]
    },
    {
      "id": "via_dell_alba",
      "nome": "Via dell'Alba",
      "tipo": "path",
      "categoria": "via_principale",
      "quartiere": "fuoco",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          480.59,
          402.11
        ],
        [
          543.84,
          402.11
        ],
        [
          619.74,
          402.11
        ],
        [
          670.34,
          402.11
        ]
      ]
    },
    {
      "id": "via_del_pontile",
      "nome": "Via del Pontile",
      "tipo": "path",
      "categoria": "via_principale",
      "quartiere": "acqua",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          480.59,
          402.11
        ],
        [
          480.59,
          515.87
        ],
        [
          480.59,
          616.98
        ],
        [
          481.85,
          718.09
        ]
      ]
    },
    {
      "id": "via_degli_orti",
      "nome": "Via degli Orti",
      "tipo": "path",
      "categoria": "via_principale",
      "quartiere": "terra",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          480.59,
          402.11
        ],
        [
          392.04,
          402.11
        ],
        [
          366.74,
          402.11
        ]
      ]
    },
    {
      "id": "via_che_sale",
      "nome": "Via che Sale",
      "tipo": "path",
      "categoria": "via_principale",
      "quartiere": "aria",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          480.59,
          402.11
        ],
        [
          480.59,
          313.64
        ],
        [
          480.59,
          250.45
        ],
        [
          493.24,
          199.89
        ],
        [
          505.89,
          174.61
        ]
      ]
    },
    {
      "id": "via_scuola",
      "nome": "Via della Scuola",
      "tipo": "path",
      "categoria": "via_secondaria",
      "quartiere": "centro",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          480.59,
          408.44
        ],
        [
          476.79,
          405.28
        ],
        [
          475.27,
          407.43
        ]
      ]
    },
    {
      "id": "sentiero_roccia_burrone",
      "nome": "Sentiero Roccia-Burrone",
      "tipo": "path",
      "categoria": "sentiero_montano",
      "quartiere": "aria",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          505.89,
          174.61
        ],
        [
          499.57,
          124.06
        ],
        [
          493.24,
          92.45
        ],
        [
          483.11,
          63.38
        ]
      ]
    },
    {
      "id": "sentiero_al_guado",
      "nome": "Sentiero al Guado",
      "tipo": "path",
      "categoria": "sentiero_secondario",
      "quartiere": "aria",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          480.59,
          250.45
        ],
        [
          480.59,
          199.89
        ],
        [
          480.59,
          161.97
        ],
        [
          480.59,
          136.7
        ]
      ]
    },
    {
      "id": "sentiero_pontile_spiaggia",
      "nome": "Sentiero Pontile-Spiaggia",
      "tipo": "path",
      "categoria": "sentiero_costiero",
      "quartiere": "acqua",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          481.85,
          730.73
        ],
        [
          493.24,
          737.05
        ],
        [
          505.89,
          743.37
        ]
      ]
    },
    {
      "id": "sentiero_pontile_case_basse",
      "nome": "Sentiero Pontile-Case Basse",
      "tipo": "path",
      "categoria": "sentiero_secondario",
      "quartiere": "acqua",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          481.85,
          718.09
        ],
        [
          474.27,
          711.78
        ],
        [
          467.94,
          705.45
        ]
      ]
    },
    {
      "id": "sentiero_orti_tana_rovo",
      "nome": "Sentiero Orti-Tana",
      "tipo": "path",
      "categoria": "sentiero_interno_quartiere",
      "quartiere": "terra",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          366.74,
          402.11
        ],
        [
          328.79,
          383.16
        ],
        [
          278.19,
          376.84
        ]
      ]
    },
    {
      "id": "sentiero_casa_salvia_casa_zolla",
      "nome": "Sentiero Salvia-Zolla",
      "tipo": "path",
      "categoria": "sentiero_interno_quartiere",
      "quartiere": "terra",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          341.44,
          364.2
        ],
        [
          335.12,
          402.11
        ],
        [
          328.79,
          440.03
        ]
      ]
    },
    {
      "id": "sentiero_riva_ovest",
      "nome": "Sentiero della Riva Ovest",
      "tipo": "path",
      "categoria": "sentiero_costeggiante",
      "quartiere": "perimetro",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          480.59,
          143.02
        ],
        [
          383.05,
          183.64
        ],
        [
          347.36,
          200.41
        ],
        [
          314.92,
          222.14
        ],
        [
          286.51,
          248.33
        ],
        [
          262.88,
          278.34
        ],
        [
          244.61,
          311.42
        ],
        [
          232.16,
          346.78
        ],
        [
          225.86,
          383.52
        ],
        [
          225.86,
          420.71
        ],
        [
          232.16,
          457.45
        ],
        [
          244.61,
          492.81
        ],
        [
          262.88,
          525.89
        ],
        [
          286.51,
          555.9
        ],
        [
          314.92,
          582.08
        ],
        [
          347.36,
          603.82
        ],
        [
          383.05,
          620.59
        ],
        [
          480.59,
          718.09
        ]
      ]
    },
    {
      "id": "isola_orizzonte_se",
      "nome": "Isola all'Orizzonte (sud-est)",
      "tipo": "island_outline",
      "categoria": null,
      "quartiere": "perimetro",
      "dentro": null,
      "abitante": null,
      "stato": "stub",
      "altitudine": null,
      "corrente": null,
      "forma": "Polygon",
      "punti": [
        [
          [
            1302.85,
            1097.26
          ],
          [
            1340.79,
            1097.26
          ],
          [
            1328.15,
            1071.98
          ],
          [
            1302.85,
            1097.26
          ]
        ]
      ]
    },
    {
      "id": "isola_orizzonte_so",
      "nome": "Isola all'Orizzonte (sud-ovest)",
      "tipo": "island_outline",
      "categoria": null,
      "quartiere": "perimetro",
      "dentro": null,
      "abitante": null,
      "stato": "stub",
      "altitudine": null,
      "corrente": null,
      "forma": "Polygon",
      "punti": [
        [
          [
            -253.12,
            1034.07
          ],
          [
            -215.16,
            1034.07
          ],
          [
            -227.81,
            1008.79
          ],
          [
            -253.12,
            1034.07
          ]
        ]
      ]
    },
    {
      "id": "fiume_che_gira",
      "nome": "Fiume che Gira",
      "tipo": "river_system",
      "categoria": null,
      "quartiere": "perimetro",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "MultiLineString",
      "punti": [
        [
          [
            480.59,
            111.42
          ],
          [
            479.96,
            124.06
          ],
          [
            480.59,
            136.7
          ],
          [
            481.22,
            146.8
          ],
          [
            480.59,
            155.66
          ]
        ],
        [
          [
            480.59,
            155.66
          ],
          [
            459.75,
            156.41
          ],
          [
            439.03,
            158.69
          ],
          [
            418.57,
            162.46
          ],
          [
            398.5,
            167.72
          ],
          [
            378.93,
            174.41
          ],
          [
            359.99,
            182.52
          ],
          [
            341.79,
            191.98
          ],
          [
            324.45,
            202.72
          ],
          [
            308.06,
            214.71
          ],
          [
            292.74,
            227.84
          ],
          [
            278.59,
            242.05
          ],
          [
            265.68,
            257.26
          ],
          [
            254.08,
            273.33
          ],
          [
            243.89,
            290.23
          ],
          [
            235.16,
            307.8
          ],
          [
            227.94,
            325.96
          ],
          [
            222.28,
            344.57
          ],
          [
            218.21,
            363.56
          ],
          [
            215.76,
            382.78
          ]
        ],
        [
          [
            215.76,
            382.78
          ],
          [
            214.94,
            402.11
          ],
          [
            215.76,
            421.46
          ]
        ],
        [
          [
            215.76,
            421.46
          ],
          [
            218.21,
            440.68
          ],
          [
            222.28,
            459.66
          ],
          [
            227.94,
            478.27
          ],
          [
            235.16,
            496.43
          ],
          [
            243.89,
            514.01
          ],
          [
            254.08,
            530.88
          ],
          [
            265.68,
            546.98
          ],
          [
            278.59,
            562.18
          ]
        ],
        [
          [
            292.74,
            576.4
          ],
          [
            308.06,
            589.53
          ],
          [
            324.45,
            601.51
          ],
          [
            341.79,
            612.25
          ],
          [
            359.99,
            621.71
          ],
          [
            378.93,
            629.82
          ],
          [
            398.5,
            636.51
          ],
          [
            418.57,
            641.77
          ],
          [
            439.03,
            645.55
          ],
          [
            459.75,
            647.82
          ],
          [
            480.59,
            730.73
          ]
        ],
        [
          [
            480.59,
            155.66
          ],
          [
            510.62,
            127.81
          ],
          [
            545.64,
            138.26
          ],
          [
            572.08,
            139.49
          ],
          [
            598.82,
            155.99
          ],
          [
            617.72,
            163.93
          ],
          [
            652.38,
            179.31
          ],
          [
            673.21,
            194.36
          ],
          [
            699.65,
            204.34
          ],
          [
            714.03,
            223.43
          ],
          [
            727.49,
            247.2
          ],
          [
            753.09,
            278.43
          ],
          [
            763.68,
            297.38
          ],
          [
            776.87,
            326.9
          ],
          [
            778.86,
            344.27
          ],
          [
            784.48,
            377.89
          ],
          [
            778.9,
            396.55
          ],
          [
            782.4,
            422.48
          ],
          [
            773.82,
            451.18
          ],
          [
            775.08,
            475.69
          ],
          [
            754.99,
            507.72
          ],
          [
            742.67,
            527.03
          ],
          [
            731.19,
            547.28
          ],
          [
            713.7,
            571.04
          ],
          [
            699.92,
            597.57
          ],
          [
            673.91,
            606.39
          ],
          [
            649.6,
            629.83
          ],
          [
            620.76,
            638.15
          ],
          [
            592.88,
            651.86
          ],
          [
            569.43,
            661.48
          ],
          [
            535.13,
            666.63
          ],
          [
            515.61,
            674.84
          ],
          [
            480.59,
            730.73
          ]
        ]
      ]
    },
    {
      "id": "montagne_gemelle",
      "nome": "Montagne Gemelle",
      "tipo": "mountain_system",
      "categoria": null,
      "quartiere": "aria",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "MultiPoint",
      "punti": [
        [
          518.54,
          54.55
        ],
        [
          442.63,
          54.55
        ]
      ]
    },
    {
      "id": "pozza_abbeveratoio_pastori",
      "nome": "Pozza dei Pascoli",
      "tipo": "water_pool",
      "categoria": null,
      "quartiere": "aria",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "Point",
      "punti": [
        486.92,
        250.45
      ]
    },
    {
      "id": "noce_della_scuola",
      "nome": "Noce della Scuola",
      "tipo": "landmark",
      "categoria": "tree",
      "quartiere": "centro",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "Point",
      "punti": [
        477.42,
        405.91
      ]
    },
    {
      "id": "zona_di_lavoro_salvia",
      "nome": "Zona di Lavoro di Salvia",
      "tipo": "work_area",
      "categoria": null,
      "quartiere": "terra",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": null,
      "corrente": null,
      "forma": "Polygon",
      "punti": [
        [
          [
            322.47,
            357.87
          ],
          [
            309.81,
            351.56
          ],
          [
            303.48,
            364.2
          ],
          [
            316.13,
            370.51
          ],
          [
            328.79,
            364.2
          ],
          [
            322.47,
            357.87
          ]
        ]
      ]
    },
    {
      "id": "sentiero_foresta_traversata_ovest",
      "nome": "Sentiero di traversata Foresta",
      "tipo": "path",
      "categoria": "sentiero_foresta",
      "quartiere": "terra",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          316.13,
          395.8
        ],
        [
          278.19,
          402.11
        ],
        [
          240.24,
          414.75
        ],
        [
          202.29,
          427.39
        ],
        [
          164.33,
          440.03
        ],
        [
          126.39,
          452.67
        ]
      ]
    },
    {
      "id": "sentiero_ritorno_bocca_orti",
      "nome": "Sentiero Bocca-Orti",
      "tipo": "path",
      "categoria": "sentiero_interno",
      "quartiere": "acqua",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          481.85,
          705.45
        ],
        [
          455.28,
          654.89
        ],
        [
          429.99,
          591.7
        ],
        [
          404.69,
          528.5
        ],
        [
          379.39,
          465.31
        ],
        [
          366.74,
          402.11
        ]
      ]
    },
    {
      "id": "sentiero_casa_salvia_margine_foresta",
      "nome": "Sentiero Salvia-Margine Foresta",
      "tipo": "path",
      "categoria": "sentiero_interno_quartiere",
      "quartiere": "terra",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          341.44,
          364.2
        ],
        [
          328.79,
          361.68
        ],
        [
          316.13,
          362.94
        ],
        [
          309.81,
          360.4
        ]
      ]
    },
    {
      "id": "sentiero_orti_torrente_foresta",
      "nome": "Sentiero Orti-Torrente",
      "tipo": "path",
      "categoria": "sentiero_foresta",
      "quartiere": "terra",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          366.74,
          402.11
        ],
        [
          328.79,
          402.11
        ],
        [
          290.83,
          414.75
        ],
        [
          252.89,
          427.39
        ],
        [
          227.59,
          440.03
        ],
        [
          221.27,
          452.67
        ]
      ]
    },
    {
      "id": "sentiero_orti_casa_salvia",
      "nome": "Sentiero Orti-Casa Salvia",
      "tipo": "path",
      "categoria": "sentiero_interno_quartiere",
      "quartiere": "terra",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          366.74,
          402.11
        ],
        [
          360.42,
          389.48
        ],
        [
          351.56,
          376.84
        ],
        [
          341.44,
          364.2
        ]
      ]
    },
    {
      "id": "sentiero_orti_casa_zolla",
      "nome": "Sentiero Orti-Casa Zolla",
      "tipo": "path",
      "categoria": "sentiero_interno_quartiere",
      "quartiere": "terra",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          366.74,
          402.11
        ],
        [
          354.09,
          414.75
        ],
        [
          341.44,
          427.39
        ],
        [
          328.79,
          440.03
        ]
      ]
    },
    {
      "id": "sentiero_tana_rovo_casa_salvia",
      "nome": "Sentiero Tana Rovo-Casa Salvia",
      "tipo": "path",
      "categoria": "sentiero_interno_quartiere",
      "quartiere": "terra",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          278.19,
          376.84
        ],
        [
          297.16,
          370.51
        ],
        [
          316.13,
          364.2
        ],
        [
          341.44,
          364.2
        ]
      ]
    },
    {
      "id": "sentiero_casa_zolla_tana_rovo",
      "nome": "Sentiero Casa Zolla-Tana Rovo",
      "tipo": "path",
      "categoria": "sentiero_interno_quartiere",
      "quartiere": "terra",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          328.79,
          440.03
        ],
        [
          316.13,
          414.75
        ],
        [
          303.48,
          395.8
        ],
        [
          290.83,
          383.16
        ],
        [
          278.19,
          376.84
        ]
      ]
    },
    {
      "id": "sentiero_forno_case_mattino",
      "nome": "Sentiero Forno-Case del Mattino",
      "tipo": "path",
      "categoria": "sentiero_interno_quartiere",
      "quartiere": "fuoco",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          619.74,
          402.11
        ],
        [
          638.72,
          402.11
        ],
        [
          657.69,
          402.11
        ]
      ]
    },
    {
      "id": "sentiero_fuoco_ring",
      "nome": "Viottolo del Quartiere di Fuoco",
      "tipo": "path",
      "categoria": "sentiero_interno_quartiere",
      "quartiere": "fuoco",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          657.69,
          402.11
        ],
        [
          657.69,
          414.75
        ],
        [
          670.34,
          408.44
        ],
        [
          664.02,
          395.8
        ],
        [
          657.69,
          402.11
        ]
      ]
    },
    {
      "id": "sentiero_scogliera_casa_amo",
      "nome": "Sentiero Scogliera-Casa Amo",
      "tipo": "path",
      "categoria": "sentiero_costiero",
      "quartiere": "acqua",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          536.25,
          753.49
        ],
        [
          534.98,
          752.21
        ]
      ]
    },
    {
      "id": "sentiero_spiaggia_casa_amo",
      "nome": "Sentiero Spiaggia-Casa Amo",
      "tipo": "path",
      "categoria": "sentiero_costiero",
      "quartiere": "acqua",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          518.54,
          756.01
        ],
        [
          528.66,
          754.75
        ],
        [
          534.98,
          752.21
        ]
      ]
    },
    {
      "id": "sentiero_case_basse_bocca",
      "nome": "Sentiero Case Basse-Bocca",
      "tipo": "path",
      "categoria": "sentiero_costiero",
      "quartiere": "acqua",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          467.94,
          705.45
        ],
        [
          474.27,
          718.09
        ],
        [
          480.59,
          730.73
        ]
      ]
    },
    {
      "id": "sentiero_capanne_pastori_pascoli",
      "nome": "Sentiero Capanne-Pascoli",
      "tipo": "path",
      "categoria": "sentiero_interno_quartiere",
      "quartiere": "aria",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          455.28,
          199.89
        ],
        [
          467.94,
          206.22
        ],
        [
          480.59,
          212.53
        ],
        [
          493.24,
          218.84
        ]
      ]
    },
    {
      "id": "sentiero_pascoli_burrone_diretto",
      "nome": "Sentiero Pascoli-Burrone",
      "tipo": "path",
      "categoria": "sentiero_montano",
      "quartiere": "aria",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          480.59,
          212.53
        ],
        [
          486.92,
          161.97
        ],
        [
          490.71,
          111.42
        ],
        [
          486.92,
          73.5
        ],
        [
          483.11,
          63.38
        ]
      ]
    },
    {
      "id": "viottolo_perimetrale_piazza",
      "nome": "Viottolo Perimetrale della Piazza",
      "tipo": "path",
      "categoria": "viottolo",
      "quartiere": "centro",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          482.23,
          403.64
        ],
        [
          482.87,
          401.1
        ],
        [
          483.11,
          400.47
        ],
        [
          478.44,
          400.47
        ],
        [
          478.06,
          402.75
        ],
        [
          478.7,
          403.64
        ],
        [
          482.23,
          403.64
        ]
      ]
    },
    {
      "id": "viottolo_piazza_bottega_nodo",
      "nome": "Viottolo Piazza-Bottega Nodo",
      "tipo": "path",
      "categoria": "viottolo",
      "quartiere": "centro",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          481.85,
          402.11
        ],
        [
          482.87,
          401.1
        ]
      ]
    },
    {
      "id": "viottolo_piazza_casa_memolo",
      "nome": "Viottolo Piazza-Casetta Mèmolo",
      "tipo": "path",
      "categoria": "viottolo",
      "quartiere": "centro",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          479.7,
          402.11
        ],
        [
          478.44,
          400.47
        ]
      ]
    },
    {
      "id": "sentiero_forno_orti_diretto",
      "nome": "Sentiero Forno-Orti diretto",
      "tipo": "path",
      "categoria": "sentiero_inter_quartiere",
      "quartiere": "centro",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          619.74,
          402.11
        ],
        [
          569.14,
          421.08
        ],
        [
          518.54,
          427.39
        ],
        [
          467.94,
          427.39
        ],
        [
          417.34,
          421.08
        ],
        [
          366.74,
          402.11
        ]
      ]
    },
    {
      "id": "sentiero_roccia_orti_tangenziale",
      "nome": "Sentiero Roccia-Orti",
      "tipo": "path",
      "categoria": "sentiero_inter_quartiere",
      "quartiere": "perimetro",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          505.89,
          174.61
        ],
        [
          455.28,
          250.45
        ],
        [
          417.34,
          313.64
        ],
        [
          392.04,
          364.2
        ],
        [
          366.74,
          402.11
        ]
      ]
    },
    {
      "id": "sentiero_pontile_forno",
      "nome": "Sentiero Pontile-Forno",
      "tipo": "path",
      "categoria": "sentiero_inter_quartiere",
      "quartiere": "perimetro",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          481.85,
          718.09
        ],
        [
          518.54,
          642.26
        ],
        [
          556.49,
          566.42
        ],
        [
          588.11,
          490.59
        ],
        [
          613.42,
          427.39
        ],
        [
          619.74,
          402.11
        ]
      ]
    },
    {
      "id": "sentiero_riva_est_parziale",
      "nome": "Sentiero Riva Est parziale",
      "tipo": "path",
      "categoria": "sentiero_costeggiante",
      "quartiere": "perimetro",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          505.89,
          161.97
        ],
        [
          581.78,
          237.81
        ],
        [
          645.04,
          313.64
        ],
        [
          670.34,
          402.11
        ],
        [
          657.69,
          503.23
        ],
        [
          607.09,
          604.34
        ],
        [
          531.19,
          692.81
        ]
      ]
    },
    {
      "id": "sentiero_costiero_ovest",
      "nome": "Sentiero Costiero Ovest",
      "tipo": "path",
      "categoria": "sentiero_costiero",
      "quartiere": "perimetro",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          455.28,
          718.09
        ],
        [
          379.39,
          667.53
        ],
        [
          290.83,
          553.78
        ],
        [
          227.59,
          402.11
        ],
        [
          240.24,
          237.81
        ],
        [
          328.79,
          111.42
        ],
        [
          442.63,
          35.58
        ]
      ]
    },
    {
      "id": "sentiero_costiero_est",
      "nome": "Sentiero Costiero Est",
      "tipo": "path",
      "categoria": "sentiero_costiero",
      "quartiere": "perimetro",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          531.19,
          718.09
        ],
        [
          632.39,
          654.89
        ],
        [
          720.94,
          528.5
        ],
        [
          758.89,
          402.11
        ],
        [
          746.25,
          250.45
        ],
        [
          670.34,
          111.42
        ],
        [
          543.84,
          35.58
        ]
      ]
    },
    {
      "id": "radura_dei_pini",
      "nome": "Radura dei Pini",
      "tipo": "clearing",
      "categoria": null,
      "quartiere": "terra",
      "dentro": null,
      "abitante": null,
      "stato": "provvisorio",
      "altitudine": null,
      "corrente": null,
      "forma": "Polygon",
      "punti": [
        [
          [
            314.58,
            355.35
          ],
          [
            313.32,
            352.19
          ],
          [
            309.53,
            351.56
          ],
          [
            305.74,
            352.19
          ],
          [
            304.47,
            355.35
          ],
          [
            305.74,
            358.51
          ],
          [
            309.53,
            359.14
          ],
          [
            313.32,
            358.51
          ],
          [
            314.58,
            355.35
          ]
        ]
      ]
    },
    {
      "id": "sentiero_montagne_gemelle",
      "nome": "Sentiero delle Montagne Gemelle",
      "tipo": "path",
      "categoria": "sentiero_montano",
      "quartiere": "aria",
      "dentro": null,
      "abitante": null,
      "stato": "canonico",
      "altitudine": null,
      "corrente": null,
      "forma": "LineString",
      "punti": [
        [
          483.07,
          63.38
        ],
        [
          479.27,
          58.97
        ],
        [
          479.27,
          54.55
        ]
      ]
    }
  ];

export type StoriaLegami = {
  sid: string;
  ciclo: string | null;
  stagione: string | null;
  vento: string | null;
  notturna: boolean;
  /** I quartieri che la storia attraversa. */
  quartieri: string[];
  /** Id di luoghiMappa toccati dalla storia. */
  luoghi: string[];
  /** Id di personaggi in lib/canone.ts presenti in scena. */
  cast: string[];
};

export const storieLegami: StoriaLegami[] = [
    {
      "sid": "s01",
      "ciclo": "A",
      "stagione": "inverno",
      "vento": "vento_taglio",
      "notturna": true,
      "quartieri": [
        "aria",
        "fuoco"
      ],
      "luoghi": [
        "forno",
        "montagne_gemelle",
        "via_che_sale"
      ],
      "cast": [
        "elias",
        "fiamma",
        "gabriel",
        "grunto",
        "noah"
      ]
    },
    {
      "sid": "s02",
      "ciclo": "A",
      "stagione": "inverno",
      "vento": "vento_taglio",
      "notturna": false,
      "quartieri": [
        "aria",
        "centro"
      ],
      "luoghi": [
        "pascoli_alti",
        "sentiero_capanne_pastori_pascoli",
        "via_che_sale"
      ],
      "cast": [
        "elias",
        "gabriel",
        "noah",
        "stria"
      ]
    },
    {
      "sid": "s03",
      "ciclo": "A",
      "stagione": "inverno",
      "vento": null,
      "notturna": false,
      "quartieri": [
        "terra"
      ],
      "luoghi": [
        "foresta_intrecciata",
        "orti_del_cerchio",
        "sentiero_orti_torrente_foresta"
      ],
      "cast": [
        "bru",
        "elias",
        "gabriel",
        "noah",
        "rovo"
      ]
    },
    {
      "sid": "s04",
      "ciclo": "B",
      "stagione": "primavera",
      "vento": "vento_intreccio",
      "notturna": false,
      "quartieri": [
        "terra"
      ],
      "luoghi": [
        "casa_salvia",
        "foresta_intrecciata",
        "orti_del_cerchio",
        "sentiero_orti_casa_salvia",
        "sentiero_orti_torrente_foresta"
      ],
      "cast": [
        "bru",
        "elias",
        "gabriel",
        "noah",
        "rovo",
        "salvia"
      ]
    },
    {
      "sid": "s05",
      "ciclo": "B",
      "stagione": "primavera",
      "vento": "vento_intreccio",
      "notturna": false,
      "quartieri": [
        "terra"
      ],
      "luoghi": [
        "foresta_intrecciata",
        "orti_del_cerchio",
        "sentiero_foresta_traversata_ovest",
        "sentiero_orti_torrente_foresta",
        "torrente_affluente_foresta"
      ],
      "cast": [
        "bru",
        "elias",
        "gabriel",
        "noah",
        "nodo"
      ]
    },
    {
      "sid": "s06",
      "ciclo": "B",
      "stagione": "primavera",
      "vento": "vento_intreccio",
      "notturna": false,
      "quartieri": [
        "centro",
        "fuoco",
        "terra"
      ],
      "luoghi": [
        "casa_memolo_cortile",
        "casa_salvia",
        "casa_zolla",
        "cespuglio_dietro_albero_vecchio",
        "forno",
        "panca_di_pietra",
        "piazza_villaggio",
        "scuola_stria",
        "sentiero_casa_salvia_casa_zolla",
        "sentiero_forno_orti_diretto",
        "sentiero_orti_casa_salvia",
        "sentiero_orti_casa_zolla",
        "viottolo_piazza_casa_memolo"
      ],
      "cast": [
        "elias",
        "fiamma",
        "gabriel",
        "liu",
        "memolo",
        "mercato_del_mezzogiorno",
        "noah",
        "pun",
        "salvia",
        "stria",
        "zolla"
      ]
    },
    {
      "sid": "s07",
      "ciclo": "C",
      "stagione": "estate",
      "vento": "vento_intreccio",
      "notturna": false,
      "quartieri": [
        "acqua",
        "perimetro",
        "terra"
      ],
      "luoghi": [
        "bocca",
        "casa_amo",
        "fiume_che_gira",
        "foresta_intrecciata",
        "guado_di_pietre_piatte",
        "orti_del_cerchio",
        "pontile_bocca",
        "sentiero_al_guado",
        "sentiero_case_basse_bocca",
        "sentiero_pontile_spiaggia",
        "sentiero_ritorno_bocca_orti",
        "sentiero_riva_ovest",
        "spiaggia_conchiglie"
      ],
      "cast": [
        "amo",
        "bartolo",
        "elias",
        "gabriel",
        "noah",
        "toba"
      ]
    },
    {
      "sid": "s08",
      "ciclo": "C",
      "stagione": "estate",
      "vento": "vento_mulinello",
      "notturna": true,
      "quartieri": [
        "centro",
        "fuoco"
      ],
      "luoghi": [
        "albero_vecchio",
        "casa_memolo_cortile",
        "forno",
        "panca_di_pietra",
        "piazza_villaggio",
        "pozzo_piazza",
        "scuola_stria",
        "sentiero_fuoco_ring",
        "via_scuola",
        "viottolo_perimetrale_piazza"
      ],
      "cast": [
        "elias",
        "fiamma",
        "gabriel",
        "liu",
        "mantenitori",
        "memolo",
        "noah",
        "nodo",
        "stria"
      ]
    },
    {
      "sid": "s09",
      "ciclo": "C",
      "stagione": "estate",
      "vento": "vento_mulinello",
      "notturna": false,
      "quartieri": [
        "centro",
        "fuoco"
      ],
      "luoghi": [
        "forno",
        "scuola_stria",
        "sentiero_orti_casa_salvia",
        "via_dell_alba",
        "viottolo_piazza_casa_memolo"
      ],
      "cast": [
        "bru",
        "cardo",
        "elias",
        "fiamma",
        "gabriel",
        "liu",
        "memolo",
        "noah",
        "pun",
        "stria",
        "toba"
      ]
    },
    {
      "sid": "s10",
      "ciclo": "D",
      "stagione": "autunno",
      "vento": "vento_mulinello",
      "notturna": true,
      "quartieri": [
        "acqua",
        "centro"
      ],
      "luoghi": [
        "piazza_villaggio",
        "pontile_bocca",
        "sentiero_pontile_forno",
        "via_del_pontile",
        "via_dell_alba",
        "viottolo_perimetrale_piazza"
      ],
      "cast": [
        "amo",
        "bartolo",
        "elias",
        "fiamma",
        "gabriel",
        "grunto",
        "noah"
      ]
    },
    {
      "sid": "s11",
      "ciclo": "D",
      "stagione": "autunno",
      "vento": null,
      "notturna": false,
      "quartieri": [
        "acqua",
        "centro",
        "terra"
      ],
      "luoghi": [
        "albero_vecchio",
        "forno",
        "orti_del_cerchio",
        "panca_di_pietra",
        "pascoli_alti",
        "piazza_villaggio",
        "pontile_bocca",
        "pozzo_piazza",
        "sentiero_fuoco_ring",
        "sentiero_orti_torrente_foresta",
        "via_che_sale",
        "via_dell_alba",
        "viottolo_perimetrale_piazza"
      ],
      "cast": [
        "amo",
        "bartolo",
        "bru",
        "cardo",
        "coltivatori_del_cerchio",
        "elias",
        "fiamma",
        "gabriel",
        "mantenitori",
        "memolo",
        "mercato_del_mezzogiorno",
        "noah",
        "nodo",
        "pastori",
        "pun",
        "salvia",
        "stria",
        "toba",
        "zolla"
      ]
    },
    {
      "sid": "s12",
      "ciclo": "D",
      "stagione": "autunno",
      "vento": null,
      "notturna": false,
      "quartieri": [
        "acqua",
        "aria",
        "centro",
        "fuoco",
        "terra"
      ],
      "luoghi": [
        "albero_vecchio",
        "burrone",
        "fiume_che_gira",
        "foresta_intrecciata",
        "forno",
        "guado_di_pietre_piatte",
        "pascoli_alti",
        "piazza_villaggio",
        "pontile_bocca",
        "roccia_alta",
        "sentiero_al_guado",
        "sentiero_capanne_pastori_pascoli",
        "sentiero_pascoli_burrone_diretto",
        "sentiero_riva_ovest",
        "via_che_sale",
        "via_dell_alba"
      ],
      "cast": [
        "bartolo",
        "coltivatori_del_cerchio",
        "elias",
        "fiamma",
        "gabriel",
        "grunto",
        "liu",
        "noah",
        "pastori"
      ]
    }
  ];

export const luogoMappa = (id: string) => luoghiMappa.find((l) => l.id === id);

export const legamiStoria = (sid: string) => storieLegami.find((s) => s.sid === sid);

/** I luoghi di un quartiere, il quartiere stesso escluso. */
export const luoghiDelQuartiere = (quartiere: string) =>
  luoghiMappa.filter((l) => l.quartiere === quartiere && l.tipo !== "quarter");

/** Le storie che passano da un luogo. */
export const storiePerLuogo = (id: string) =>
  storieLegami.filter((s) => s.luoghi.includes(id));

/** Dove abita un personaggio, se il canone gli dà una casa. */
export const casaDi = (abitante: string) =>
  luoghiMappa.filter((l) => l.abitante === abitante);
