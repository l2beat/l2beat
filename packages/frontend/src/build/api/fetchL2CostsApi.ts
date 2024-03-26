import { UnixTime } from '@l2beat/shared-pure'

import {
  L2CostsApiProject,
  L2CostsApiResponse,
  L2CostsDetails,
} from './DELETE_THIS_FILE'

export async function fetchL2CostsApi(): Promise<L2CostsApiResponse> {
  return Promise.resolve(getMockL2CostsApiResponse())
}

function getMockL2CostsApiResponse(): L2CostsApiResponse {
  // const projects = [
  //   'zksyncera',
  //   'base',
  //   'optimism',
  //   'honeypot',
  //   'fuelv1',
  //   'kroma',
  //   'mode',
  //   'zksync2',
  //   'zora',
  // ].reduce<Record<string, L2CostsApiProject>>((acc, cur) => {
  //   const withoutBlobs = cur === 'honeypot' || cur === 'kroma'
  //   acc[cur] = generateMockData(withoutBlobs)
  //   return acc
  // }, {})

  return {
    projects: {
      arbitrum: {
        syncedUntil: new UnixTime(1711357200),
        last24h: {
          total: {
            ethCost: 0.9992213043274188,
            usdCost: 3417.028759078755,
            gas: 271416911,
          },
          calldata: {
            ethCost: 0.006930926425505519,
            gas: 356636,
            usdCost: 23.701408492635963,
          },
          compute: {
            ethCost: 0.8690887404960238,
            usdCost: 2972.0136751064197,
            gas: 44538315,
          },
          overhead: {
            ethCost: 0.12320163718411496,
            usdCost: 421.3136747205315,
            gas: 6321000,
          },

          blobs: {
            ethCost: 2.217738240000017e-10,
            usdCost: 7.591655683129354e-7,
            gas: 220200960,
          },
        },
        last7d: {
          total: {
            ethCost: 11.616018585502063,
            usdCost: 39298.13977082305,
            gas: 2066462940,
          },
          calldata: {
            ethCost: 0.08077662594232242,
            gas: 2726216,
            usdCost: 273.3217491110569,
          },
          compute: {
            ethCost: 10.102350533844227,
            usdCost: 34177.088575138245,
            gas: 339634132,
          },
          overhead: {
            ethCost: 1.432891424036499,
            usdCost: 4847.729440887968,
            gas: 48216000,
          },

          blobs: {
            ethCost: 1.679032320000044e-9,
            usdCost: 0.00000568578425927763,
            gas: 1675886592,
          },
        },
        last30d: {
          total: {
            ethCost: 2823.3584698890336,
            usdCost: 10239896.120313704,
            gas: 51135011821,
          },
          calldata: {
            ethCost: 2400.945382196141,
            gas: 41259403672,
            usdCost: 8709872.886086144,
          },
          compute: {
            ethCost: 387.5944463708895,
            usdCost: 1403999.8774270029,
            gas: 6874989237,
          },
          overhead: {
            ethCost: 34.81864131961286,
            usdCost: 126023.35679221673,
            gas: 628740000,
          },

          blobs: {
            ethCost: 2.375024639999967e-9,
            usdCost: 0.000008245414430638095,
            gas: 2371878912,
          },
        },
        last90d: {
          total: {
            ethCost: 7088.580902697555,
            usdCost: 20866052.92649976,
            gas: 210780265350,
          },
          calldata: {
            ethCost: 6054.9622005200745,
            gas: 178035604932,
            usdCost: 17812966.079166386,
          },
          compute: {
            ethCost: 949.2113008060663,
            usdCost: 2803523.3479611343,
            gas: 27888481506,
          },
          overhead: {
            ethCost: 84.4074013690685,
            usdCost: 249563.49936424958,
            gas: 2484300000,
          },

          blobs: {
            ethCost: 2.375024639999967e-9,
            usdCost: 0.000008245414430638095,
            gas: 2371878912,
          },
        },
      },
      base: {
        syncedUntil: new UnixTime(1711357200),
        last24h: {
          total: {
            ethCost: 0.1624193279170695,
            usdCost: 555.1028560598405,
            gas: 227658510,
          },
          calldata: {
            ethCost: 0.00059986304372112,
            gas: 29904,
            usdCost: 2.0508165013670743,
          },
          compute: {
            ethCost: 0.027133626956589284,
            usdCost: 92.76458205320218,
            gas: 1352862,
          },
          overhead: {
            ethCost: 0.13468583769616488,
            usdCost: 460.2874567507985,
            gas: 6468000,
          },

          blobs: {
            ethCost: 2.2059417600000165e-10,
            usdCost: 7.544726463709197e-7,
            gas: 219807744,
          },
        },
        last7d: {
          total: {
            ethCost: 1.7617501956467214,
            usdCost: 5972.371107469485,
            gas: 1688273550,
          },
          calldata: {
            ethCost: 0.006893295336716605,
            gas: 234816,
            usdCost: 23.389052985632002,
          },
          compute: {
            ethCost: 0.31201717240745297,
            usdCost: 1058.6722692930039,
            gas: 10629630,
          },
          overhead: {
            ethCost: 1.442839726269922,
            usdCost: 4890.309779656021,
            gas: 47922000,
          },

          blobs: {
            ethCost: 1.6326328320000381e-9,
            usdCost: 0.0000055348355903258685,
            gas: 1629487104,
          },
        },
        last30d: {
          total: {
            ethCost: 1335.432008662184,
            usdCost: 4859462.708006966,
            gas: 25531474978,
          },
          calldata: {
            ethCost: 1305.0221224512075,
            gas: 22375877540,
            usdCost: 4751346.432910609,
          },
          compute: {
            ethCost: 2.218916435726143,
            usdCost: 8030.40146587513,
            gas: 46190574,
          },
          overhead: {
            ethCost: 28.1909697726565,
            usdCost: 100085.87362134596,
            gas: 519162000,
          },

          blobs: {
            ethCost: 2.593390591999926e-9,
            usdCost: 0.000009100204597090735,
            gas: 2590244864,
          },
        },
        last90d: {
          total: {
            ethCost: 3154.454430864443,
            usdCost: 9431071.400933925,
            gas: 93492864474,
          },
          calldata: {
            ethCost: 3072.774230810006,
            gas: 88413194356,
            usdCost: 9194703.858674537,
          },
          compute: {
            ethCost: 4.581056218544469,
            usdCost: 13947.904544349729,
            gas: 138958254,
          },
          overhead: {
            ethCost: 77.09914383327818,
            usdCost: 222419.63770601345,
            gas: 2350467000,
          },

          blobs: {
            ethCost: 2.593390591999926e-9,
            usdCost: 0.000009100204597090735,
            gas: 2590244864,
          },
        },
      },
      blast: {
        syncedUntil: new UnixTime(1711357200),
        last24h: {
          total: {
            ethCost: 14.501662294755954,
            usdCost: 49545.59906933225,
            gas: 772492058,
          },
          calldata: {
            ethCost: 14.275941976098107,
            gas: 760421220,
            usdCost: 48774.30821704358,
          },
          compute: {
            ethCost: 0.02676215149202959,
            usdCost: 91.46523763861933,
            gas: 1465838,
          },
          overhead: {
            ethCost: 0.19895816716582795,
            usdCost: 679.825614650117,
            gas: 10605000,
          },
        },
        last7d: {
          total: {
            ethCost: 148.27169178256278,
            usdCost: 502938.6892522297,
            gas: 5309367734,
          },
          calldata: {
            ethCost: 145.6887822796149,
            gas: 5218843320,
            usdCost: 494177.80678474804,
          },
          compute: {
            ethCost: 0.31363290604068966,
            usdCost: 1063.8521287542821,
            gas: 11060414,
          },
          overhead: {
            ethCost: 2.269276596907047,
            usdCost: 7697.030338728923,
            gas: 79464000,
          },
        },
        last30d: {
          total: {
            ethCost: 1060.6916901853551,
            usdCost: 3835135.5677005174,
            gas: 20954195718,
          },
          calldata: {
            ethCost: 1040.4895380113078,
            gas: 20547638324,
            usdCost: 3762359.764579257,
          },
          compute: {
            ethCost: 2.287593647197157,
            usdCost: 8285.2610722835,
            gas: 47121394,
          },
          overhead: {
            ethCost: 17.914558526844964,
            usdCost: 64490.54204897822,
            gas: 359436000,
          },
        },
        last90d: {
          total: {
            ethCost: 1060.6916901853551,
            usdCost: 3835135.5677005174,
            gas: 20954195718,
          },
          calldata: {
            ethCost: 1040.4895380113078,
            gas: 20547638324,
            usdCost: 3762359.764579257,
          },
          compute: {
            ethCost: 2.287593647197157,
            usdCost: 8285.2610722835,
            gas: 47121394,
          },
          overhead: {
            ethCost: 17.914558526844964,
            usdCost: 64490.54204897822,
            gas: 359436000,
          },
        },
      },
      bobanetwork: {
        syncedUntil: new UnixTime(1711357200),
        last24h: {
          total: {
            ethCost: 0.16342950466895495,
            usdCost: 558.1192894983408,
            gas: 8771693,
          },
          calldata: {
            ethCost: 0.04717892754077794,
            gas: 2511312,
            usdCost: 160.91632193227053,
          },
          compute: {
            ethCost: 0.09954485710630501,
            usdCost: 340.1000969683554,
            gas: 5357381,
          },
          overhead: {
            ethCost: 0.016705720021872,
            usdCost: 57.10287059771482,
            gas: 903000,
          },
        },
        last7d: {
          total: {
            ethCost: 1.712981269815904,
            usdCost: 5800.744913601768,
            gas: 58537331,
          },
          calldata: {
            ethCost: 0.43501894051338574,
            gas: 14199944,
            usdCost: 1471.4450580124155,
          },
          compute: {
            ethCost: 1.0843169134121866,
            usdCost: 3672.9507748646934,
            gas: 37554387,
          },
          overhead: {
            ethCost: 0.19364541589033205,
            usdCost: 656.3490807246536,
            gas: 6783000,
          },
        },
        last30d: {
          total: {
            ethCost: 11.960147688629988,
            usdCost: 43404.96026749785,
            gas: 245261375,
          },
          calldata: {
            ethCost: 2.584296688652058,
            gas: 53609352,
            usdCost: 9441.196366367218,
          },
          compute: {
            ethCost: 7.892248302391375,
            usdCost: 28597.263910906597,
            gas: 161454023,
          },
          overhead: {
            ethCost: 1.4836026975865606,
            usdCost: 5366.499990223994,
            gas: 30198000,
          },
        },
        last90d: {
          total: {
            ethCost: 23.2098046931917,
            usdCost: 71509.57985938246,
            gas: 662281292,
          },
          calldata: {
            ethCost: 4.259945278538933,
            gas: 111796360,
            usdCost: 13604.152345893344,
          },
          compute: {
            ethCost: 15.841046158694427,
            usdCost: 48472.672184759365,
            gas: 459218932,
          },
          overhead: {
            ethCost: 3.1088132559583466,
            usdCost: 9432.755328729809,
            gas: 91266000,
          },
        },
      },
      honeypot: {
        syncedUntil: new UnixTime(1711357200),
        last24h: {
          total: {
            ethCost: 0,
            usdCost: 0,
            gas: 0,
          },
          calldata: {
            ethCost: 0,
            gas: 0,
            usdCost: 0,
          },
          compute: {
            ethCost: 0,
            usdCost: 0,
            gas: 0,
          },
          overhead: {
            ethCost: 0,
            usdCost: 0,
            gas: 0,
          },
        },
        last7d: {
          total: {
            ethCost: 0.003247360938776412,
            usdCost: 11.26880228386308,
            gas: 88061,
          },
          calldata: {
            ethCost: 0.000055019390202863994,
            gas: 1492,
            usdCost: 0.19092507474959078,
          },
          compute: {
            ethCost: 0.002417939943841548,
            usdCost: 8.39059398542622,
            gas: 65569,
          },
          overhead: {
            ethCost: 0.000774401604732,
            usdCost: 2.68728322368727,
            gas: 21000,
          },
        },
        last30d: {
          total: {
            ethCost: 0.02795299618643754,
            usdCost: 99.70124595929015,
            gas: 352280,
          },
          calldata: {
            ethCost: 0.000476911177839056,
            gas: 6004,
            usdCost: 1.701063202073996,
          },
          compute: {
            ethCost: 0.020810907113733484,
            usdCost: 74.22719429828122,
            gas: 262276,
          },
          overhead: {
            ethCost: 0.006665177894864999,
            usdCost: 23.772988458934947,
            gas: 84000,
          },
        },
        last90d: {
          total: {
            ethCost: 0.05256486042923227,
            usdCost: 159.63429759406228,
            gas: 1144925,
          },
          calldata: {
            ethCost: 0.0008967536215053479,
            gas: 19528,
            usdCost: 2.7232162658396324,
          },
          compute: {
            ethCost: 0.03913440256068392,
            usdCost: 118.84742450080547,
            gas: 852397,
          },
          overhead: {
            ethCost: 0.012533704247043,
            usdCost: 38.063656827417155,
            gas: 273000,
          },
        },
      },
      degate3: {
        syncedUntil: new UnixTime(1711357200),
        last24h: {
          total: {
            ethCost: 0.1611730855197213,
            usdCost: 551.8906863465985,
            gas: 8975687,
          },
          calldata: {
            ethCost: 0.013220506344790111,
            gas: 734356,
            usdCost: 45.22188096522337,
          },
          compute: {
            ethCost: 0.13928028444334123,
            usdCost: 476.968144222301,
            gas: 7758331,
          },
          overhead: {
            ethCost: 0.008672294731590001,
            usdCost: 29.70066115907407,
            gas: 483000,
          },
        },
        last7d: {
          total: {
            ethCost: 1.9396833291803286,
            usdCost: 6568.843974811201,
            gas: 68789377,
          },
          calldata: {
            ethCost: 0.3254885164889583,
            gas: 10680372,
            usdCost: 1102.2925231009547,
          },
          compute: {
            ethCost: 1.5290912029336854,
            usdCost: 5178.661143465488,
            gas: 55043005,
          },
          overhead: {
            ethCost: 0.08510360975768397,
            usdCost: 287.8903082447606,
            gas: 3066000,
          },
        },
        last30d: {
          total: {
            ethCost: 30.66777823586581,
            usdCost: 113666.36912133786,
            gas: 558452833,
          },
          calldata: {
            ethCost: 10.919607690746624,
            gas: 183701400,
            usdCost: 40155.58209403575,
          },
          compute: {
            ethCost: 18.931392626745534,
            usdCost: 70470.20492461773,
            gas: 358560433,
          },
          overhead: {
            ethCost: 0.8167779183736621,
            usdCost: 3040.5821026843378,
            gas: 16191000,
          },
        },
        last90d: {
          total: {
            ethCost: 51.15322945554316,
            usdCost: 164843.74648342916,
            gas: 1290566472,
          },
          calldata: {
            ethCost: 18.64299571756736,
            gas: 433330064,
            usdCost: 59468.36157953998,
          },
          compute: {
            ethCost: 31.168503231086866,
            usdCost: 101023.80292965213,
            gas: 820276408,
          },
          overhead: {
            ethCost: 1.3417305068888457,
            usdCost: 4351.581974237105,
            gas: 36960000,
          },
        },
      },
      dydx: {
        syncedUntil: new UnixTime(1711357200),
        last24h: {
          total: {
            ethCost: 0.23636025496114624,
            usdCost: 807.84048631692,
            gas: 12266846,
          },
          calldata: {
            ethCost: 0.03830932053064543,
            gas: 1986712,
            usdCost: 130.93361773742134,
          },
          compute: {
            ethCost: 0.1932071966209748,
            usdCost: 660.3507600731497,
            gas: 10028134,
          },
          overhead: {
            ethCost: 0.004843737809526001,
            usdCost: 16.55610850634876,
            gas: 252000,
          },
        },
        last7d: {
          total: {
            ethCost: 5.613769976568748,
            usdCost: 18916.406698727304,
            gas: 172548931,
          },
          calldata: {
            ethCost: 0.9046661115228418,
            gas: 27810036,
            usdCost: 3048.4162424764145,
          },
          compute: {
            ethCost: 4.594111150769032,
            usdCost: 15480.595113737581,
            gas: 141210895,
          },
          overhead: {
            ethCost: 0.11499271427687399,
            usdCost: 387.39534251329115,
            gas: 3528000,
          },
        },
        last30d: {
          total: {
            ethCost: 51.05418054562363,
            usdCost: 184141.61315894258,
            gas: 947629165,
          },
          calldata: {
            ethCost: 8.194580088643775,
            gas: 152097592,
            usdCost: 29555.597013985247,
          },
          compute: {
            ethCost: 41.816549120373764,
            usdCost: 150824.39471772913,
            gas: 776169573,
          },
          overhead: {
            ethCost: 1.0430513366061402,
            usdCost: 3761.621427228494,
            gas: 19362000,
          },
        },
        last90d: {
          total: {
            ethCost: 105.15188393895608,
            usdCost: 317545.2380919632,
            gas: 2938571716,
          },
          calldata: {
            ethCost: 16.884206910493354,
            gas: 471668028,
            usdCost: 50985.0412319376,
          },
          compute: {
            ethCost: 86.10457139484605,
            usdCost: 260039.05497085507,
            gas: 2406297688,
          },
          overhead: {
            ethCost: 2.1631056336167163,
            usdCost: 6521.141889169504,
            gas: 60606000,
          },
        },
      },
      kroma: {
        syncedUntil: new UnixTime(1711357200),
        last24h: {
          total: {
            ethCost: 0.8745993271802455,
            usdCost: 2984.5893196995007,
            gas: 45664528,
          },
          calldata: {
            ethCost: 0.735504382295766,
            gas: 38137696,
            usdCost: 2509.0939538803664,
          },
          compute: {
            ethCost: 0.08158832254771521,
            usdCost: 278.9219014263692,
            gas: 4439832,
          },
          overhead: {
            ethCost: 0.05750662233676498,
            usdCost: 196.5734643927632,
            gas: 3087000,
          },
        },
        last7d: {
          total: {
            ethCost: 9.135493198170826,
            usdCost: 30877.350722935767,
            gas: 335640342,
          },
          calldata: {
            ethCost: 7.508308161568973,
            gas: 277571800,
            usdCost: 25356.00211163538,
          },
          compute: {
            ethCost: 0.9434177344327178,
            usdCost: 3202.800254469286,
            gas: 34002542,
          },
          overhead: {
            ethCost: 0.68376730216914,
            usdCost: 2318.548356831183,
            gas: 24066000,
          },
        },
        last30d: {
          total: {
            ethCost: 34.438284614684726,
            usdCost: 120570.90205851677,
            gas: 835052734,
          },
          calldata: {
            ethCost: 22.55207920805406,
            gas: 586890044,
            usdCost: 77549.18551312736,
          },
          compute: {
            ethCost: 6.865433142133777,
            usdCost: 24875.887546122583,
            gas: 144359690,
          },
          overhead: {
            ethCost: 5.020772264496929,
            usdCost: 18145.82899926663,
            gas: 103803000,
          },
        },
        last90d: {
          total: {
            ethCost: 189.7914059557363,
            usdCost: 497141.9089673249,
            gas: 7886767976,
          },
          calldata: {
            ethCost: 166.40594756482915,
            gas: 7191068932,
            usdCost: 425384.5729969556,
          },
          compute: {
            ethCost: 14.332903593886787,
            usdCost: 43570.824928959984,
            gas: 429272044,
          },
          overhead: {
            ethCost: 9.052554797020678,
            usdCost: 28186.51104141228,
            gas: 266427000,
          },
        },
      },
      linea: {
        syncedUntil: new UnixTime(1711357200),
        last24h: {
          total: {
            ethCost: 50.86419284907692,
            usdCost: 173693.28045105853,
            gas: 2493704368,
          },
          calldata: {
            ethCost: 36.19988211551569,
            gas: 1773031088,
            usdCost: 123617.21264672052,
          },
          compute: {
            ethCost: 14.234760037330934,
            usdCost: 48609.28748477375,
            gas: 699526280,
          },
          overhead: {
            ethCost: 0.4295506962302862,
            usdCost: 1466.7803195644906,
            gas: 21147000,
          },
        },
        last7d: {
          total: {
            ethCost: 390.8015507951346,
            usdCost: 1327553.1407801386,
            gas: 14469739625,
          },
          calldata: {
            ethCost: 278.2097197763585,
            gas: 10293483336,
            usdCost: 945079.7955651337,
          },
          compute: {
            ethCost: 109.31078415781164,
            usdCost: 371327.63684453984,
            gas: 4054330289,
          },
          overhead: {
            ethCost: 3.281046860965369,
            usdCost: 11145.708370459964,
            gas: 121926000,
          },
        },
        last30d: {
          total: {
            ethCost: 1756.2646227885937,
            usdCost: 6335545.472587848,
            gas: 44496427009,
          },
          calldata: {
            ethCost: 1249.3007150247822,
            gas: 31649075740,
            usdCost: 4506604.026354613,
          },
          compute: {
            ethCost: 492.20328211171244,
            usdCost: 1775685.6949559706,
            gas: 12473005269,
          },
          overhead: {
            ethCost: 14.760625652092218,
            usdCost: 53255.751277270494,
            gas: 374346000,
          },
        },
        last90d: {
          total: {
            ethCost: 4180.700713989645,
            usdCost: 12125121.974595044,
            gas: 152450829766,
          },
          calldata: {
            ethCost: 2615.037298603218,
            gas: 92325702132,
            usdCost: 7788236.725813294,
          },
          compute: {
            ethCost: 1508.242134032209,
            usdCost: 4183530.7617735933,
            gas: 57848013634,
          },
          overhead: {
            ethCost: 57.421281354191564,
            usdCost: 153354.48700819706,
            gas: 2277114000,
          },
        },
      },
      loopring: {
        syncedUntil: new UnixTime(1711357200),
        last24h: {
          total: {
            ethCost: 0.25632161217711413,
            usdCost: 877.4925029813851,
            gas: 13342629,
          },
          calldata: {
            ethCost: 0.03605719804961858,
            gas: 1899148,
            usdCost: 123.32937444845348,
          },
          compute: {
            ethCost: 0.20982052689391154,
            usdCost: 718.3868700872735,
            gas: 10897481,
          },
          overhead: {
            ethCost: 0.010443887233584002,
            usdCost: 35.77625844565828,
            gas: 546000,
          },
        },
        last7d: {
          total: {
            ethCost: 3.0766906082126675,
            usdCost: 10406.511441923672,
            gas: 107513050,
          },
          calldata: {
            ethCost: 0.5155476378849293,
            gas: 17166544,
            usdCost: 1737.415584272461,
          },
          compute: {
            ethCost: 2.4484040198086707,
            usdCost: 8287.227818290892,
            gas: 86377506,
          },
          overhead: {
            ethCost: 0.11273895051906907,
            usdCost: 381.8680393603172,
            gas: 3969000,
          },
        },
        last30d: {
          total: {
            ethCost: 26.56897851993644,
            usdCost: 96712.23168677765,
            gas: 533423422,
          },
          calldata: {
            ethCost: 4.8543392681586806,
            gas: 92670868,
            usdCost: 17702.570776513785,
          },
          compute: {
            ethCost: 20.803001028371597,
            usdCost: 75695.476652818,
            gas: 422062554,
          },
          overhead: {
            ethCost: 0.9116382234061415,
            usdCost: 3314.184257445902,
            gas: 18690000,
          },
        },
        last90d: {
          total: {
            ethCost: 51.63577216575263,
            usdCost: 159518.5582137649,
            gas: 1479966580,
          },
          calldata: {
            ethCost: 8.753052161262882,
            gas: 235905448,
            usdCost: 27426.84177019768,
          },
          compute: {
            ethCost: 41.03322407367609,
            usdCost: 126431.87881163947,
            gas: 1189860132,
          },
          overhead: {
            ethCost: 1.8494959308135663,
            usdCost: 5659.837631927461,
            gas: 54201000,
          },
        },
      },
      mode: {
        syncedUntil: new UnixTime(1711357200),
        last24h: {
          total: {
            ethCost: 0.0466633035533176,
            usdCost: 159.54605412803676,
            gas: 16614626,
          },
          calldata: {
            ethCost: 0.000581103378910008,
            gas: 29916,
            usdCost: 1.9873836864793124,
          },
          compute: {
            ethCost: 0.026274331433628253,
            usdCost: 89.86138978706579,
            gas: 1352862,
          },
          overhead: {
            ethCost: 0.019807868725574992,
            usdCost: 67.69728060258085,
            gas: 945000,
          },

          blobs: {
            ethCost: 1.5204352e-11,
            usdCost: 5.19107882909696e-8,
            gas: 14286848,
          },
        },
        last7d: {
          total: {
            ethCost: 0.5343978209559991,
            usdCost: 1811.6030593379269,
            gas: 127953046,
          },
          calldata: {
            ethCost: 0.0068773039604334,
            gas: 235008,
            usdCost: 23.31791526605281,
          },
          compute: {
            ethCost: 0.3110296454077726,
            usdCost: 1054.5975382948207,
            gas: 10629630,
          },
          overhead: {
            ethCost: 0.21649087147533286,
            usdCost: 733.6876053962549,
            gas: 7119000,
          },

          blobs: {
            ethCost: 1.1245977600000006e-10,
            usdCost: 3.8079747983933467e-7,
            gas: 109969408,
          },
        },
        last30d: {
          total: {
            ethCost: 120.52283391093641,
            usdCost: 438472.3056141862,
            gas: 2298915798,
          },
          calldata: {
            ethCost: 113.64509584470136,
            gas: 1994432744,
            usdCost: 413530.38269409956,
          },
          compute: {
            ethCost: 2.3156154699743667,
            usdCost: 8376.350969678622,
            gas: 46190574,
          },
          overhead: {
            ethCost: 4.562122596082429,
            usdCost: 16565.571949783953,
            gas: 82656000,
          },

          blobs: {
            ethCost: 1.7812684800000103e-10,
            usdCost: 6.246220630589434e-7,
            gas: 175636480,
          },
        },
        last90d: {
          total: {
            ethCost: 317.84497058353264,
            usdCost: 944736.7268068949,
            gas: 8913281948,
          },
          calldata: {
            ethCost: 301.9590745015579,
            gas: 8278582792,
            usdCost: 897254.53433405,
          },
          compute: {
            ethCost: 4.913366634231777,
            usdCost: 14867.734162327482,
            gas: 139022676,
          },
          overhead: {
            ethCost: 10.972529447564067,
            usdCost: 32614.458309897997,
            gas: 320040000,
          },

          blobs: {
            ethCost: 1.7812684800000103e-10,
            usdCost: 6.246220630589434e-7,
            gas: 175636480,
          },
        },
      },
      optimism: {
        syncedUntil: new UnixTime(1711357200),
        last24h: {
          total: {
            ethCost: 0.1144981277105779,
            usdCost: 391.4860996574894,
            gas: 146441738,
          },
          calldata: {
            ethCost: 0.0006088765227986641,
            gas: 31620,
            usdCost: 2.0803884770855916,
          },
          compute: {
            ethCost: 0.02730987800952884,
            usdCost: 93.31027558272376,
            gas: 1417790,
          },
          overhead: {
            ethCost: 0.08657937303747898,
            usdCost: 296.09543511576146,
            gas: 4221000,
          },

          blobs: {
            ethCost: 1.4077132800000037e-10,
            usdCost: 4.819187388383236e-7,
            gas: 140771328,
          },
        },
        last7d: {
          total: {
            ethCost: 1.3507821077381865,
            usdCost: 4583.137272706741,
            gas: 1111592194,
          },
          calldata: {
            ethCost: 0.006940685093109072,
            gas: 238596,
            usdCost: 23.535940597667043,
          },
          compute: {
            ethCost: 0.3112023267632562,
            usdCost: 1055.2923240835719,
            gas: 10697870,
          },
          overhead: {
            ethCost: 1.0326390948129263,
            usdCost: 3504.309004396704,
            gas: 32550000,
          },

          blobs: {
            ethCost: 1.0688921599999933e-9,
            usdCost: 0.0000036287970320842744,
            gas: 1068105728,
          },
        },
        last30d: {
          total: {
            ethCost: 2165.2364770702206,
            usdCost: 7736937.24341806,
            gas: 37061857928,
          },
          calldata: {
            ethCost: 2136.183465289293,
            gas: 34818385608,
            usdCost: 7633072.5008146055,
          },
          compute: {
            ethCost: 2.2176890638719646,
            usdCost: 8016.323280756376,
            gas: 46270176,
          },
          overhead: {
            ethCost: 26.835322715318913,
            usdCost: 95848.41931661729,
            gas: 460236000,
          },

          blobs: {
            ethCost: 1.737752576000047e-9,
            usdCost: 0.000006119697996041441,
            gas: 1736966144,
          },
        },
        last90d: {
          total: {
            ethCost: 4896.4548802432,
            usdCost: 14634484.789740158,
            gas: 136119298076,
          },
          calldata: {
            ethCost: 4833.545819362773,
            gas: 132642632076,
            usdCost: 14445191.262764363,
          },
          compute: {
            ethCost: 4.681316364934175,
            usdCost: 14191.520246882717,
            gas: 139037856,
          },
          overhead: {
            ethCost: 58.22774451366291,
            usdCost: 175102.00672272986,
            gas: 1600662000,
          },

          blobs: {
            ethCost: 1.737752576000047e-9,
            usdCost: 0.000006119697996041441,
            gas: 1736966144,
          },
        },
      },
      polygonzkevm: {
        syncedUntil: new UnixTime(1711357200),
        last24h: {
          total: {
            ethCost: 1.370522030529327,
            usdCost: 4688.84868647236,
            gas: 70537968,
          },
          calldata: {
            ethCost: 0.9349501079403676,
            gas: 47664968,
            usdCost: 3197.544064291413,
          },
          compute: {
            ethCost: 0.4055104346161639,
            usdCost: 1388.4121924361946,
            gas: 21298000,
          },
          overhead: {
            ethCost: 0.030061487972796005,
            usdCost: 102.89242974475206,
            gas: 1575000,
          },
        },
        last7d: {
          total: {
            ethCost: 14.824420998044245,
            usdCost: 50220.05496374253,
            gas: 504995030,
          },
          calldata: {
            ethCost: 9.022728443032845,
            gas: 312565000,
            usdCost: 30544.147978570592,
          },
          compute: {
            ethCost: 5.400910063667865,
            usdCost: 18316.14576851405,
            gas: 179137030,
          },
          overhead: {
            ethCost: 0.40078249134354893,
            usdCost: 1359.761216657888,
            gas: 13293000,
          },
        },
        last30d: {
          total: {
            ethCost: 107.2311093844317,
            usdCost: 384667.5025933289,
            gas: 2211681702,
          },
          calldata: {
            ethCost: 64.76343988072854,
            gas: 1366635904,
            usdCost: 230491.8337505517,
          },
          compute: {
            ethCost: 39.46022331787434,
            usdCost: 143235.84460530305,
            gas: 785720798,
          },
          overhead: {
            ethCost: 3.007446185828721,
            usdCost: 10939.824237474357,
            gas: 59325000,
          },
        },
        last90d: {
          total: {
            ethCost: 377.51888871503866,
            usdCost: 1047761.6338385596,
            gas: 13115602524,
          },
          calldata: {
            ethCost: 245.691520659925,
            gas: 8745613900,
            usdCost: 675053.168677073,
          },
          compute: {
            ethCost: 124.24175173377168,
            usdCost: 350511.09335294674,
            gas: 4129097624,
          },
          overhead: {
            ethCost: 7.585616321343408,
            usdCost: 22197.371808540425,
            gas: 240891000,
          },
        },
      },
      deversifi: {
        syncedUntil: new UnixTime(1711357200),
        last24h: {
          total: {
            ethCost: 0.23872651369995004,
            usdCost: 814.1717855766302,
            gas: 11846533,
          },
          calldata: {
            ethCost: 0.06030259794415525,
            gas: 2985180,
            usdCost: 205.63402363434034,
          },
          compute: {
            ethCost: 0.17344413102834574,
            usdCost: 591.5433698104296,
            gas: 8609353,
          },
          overhead: {
            ethCost: 0.004979784727449,
            usdCost: 16.994392131860277,
            gas: 252000,
          },
        },
        last7d: {
          total: {
            ethCost: 1.639691248632438,
            usdCost: 5568.294762955265,
            gas: 57552484,
          },
          calldata: {
            ethCost: 0.3947191707932237,
            gas: 13927648,
            usdCost: 1340.105571563182,
          },
          compute: {
            ethCost: 1.2014561452848818,
            usdCost: 4080.167907044374,
            gas: 42133836,
          },
          overhead: {
            ethCost: 0.043515932554332,
            usdCost: 148.02128434770904,
            gas: 1491000,
          },
        },
        last30d: {
          total: {
            ethCost: 8.899958336922191,
            usdCost: 31554.29271466732,
            gas: 191465111,
          },
          calldata: {
            ethCost: 1.9758808483563202,
            gas: 43542080,
            usdCost: 6986.327854387813,
          },
          compute: {
            ethCost: 6.56672781580193,
            usdCost: 23289.15696095206,
            gas: 140909031,
          },
          overhead: {
            ethCost: 0.35734967276393703,
            usdCost: 1278.80789932747,
            gas: 7014000,
          },
        },
        last90d: {
          total: {
            ethCost: 22.071323858632685,
            usdCost: 64251.76200704788,
            gas: 696667628,
          },
          calldata: {
            ethCost: 5.271474089463088,
            gas: 171490720,
            usdCost: 15143.20890458466,
          },
          compute: {
            ethCost: 16.191353854099646,
            usdCost: 47187.29740620117,
            gas: 509405908,
          },
          overhead: {
            ethCost: 0.6084959150699312,
            usdCost: 1921.2556962619954,
            gas: 15771000,
          },
        },
      },
      scroll: {
        syncedUntil: new UnixTime(1711357200),
        last24h: {
          total: {
            ethCost: 54.25229075673079,
            usdCost: 185560.9069591207,
            gas: 2874606420,
          },
          calldata: {
            ethCost: 32.624134914801296,
            gas: 1741918528,
            usdCost: 111612.41531782551,
          },
          compute: {
            ethCost: 20.27289072394497,
            usdCost: 69314.9667357228,
            gas: 1061518892,
          },
          overhead: {
            ethCost: 1.3552651179843285,
            usdCost: 4633.5249055723225,
            gas: 71169000,
          },
        },
        last7d: {
          total: {
            ethCost: 492.94267708810924,
            usdCost: 1673618.8127615037,
            gas: 18268897142,
          },
          calldata: {
            ethCost: 295.40580976463025,
            gas: 11051740496,
            usdCost: 1002957.5776174351,
          },
          compute: {
            ethCost: 184.83192234799301,
            usdCost: 627528.9881783563,
            gas: 6753014646,
          },
          overhead: {
            ethCost: 12.704944975486764,
            usdCost: 43132.24696571528,
            gas: 464142000,
          },
        },
        last30d: {
          total: {
            ethCost: 2553.436559966963,
            usdCost: 9048011.526777554,
            gas: 60891233554,
          },
          calldata: {
            ethCost: 1524.268571206398,
            gas: 36737914592,
            usdCost: 5398496.036745655,
          },
          compute: {
            ethCost: 963.7931798466429,
            usdCost: 3417737.7943634014,
            gas: 22611309962,
          },
          overhead: {
            ethCost: 65.37480891390948,
            usdCost: 231777.69566850376,
            gas: 1542009000,
          },
        },
        last90d: {
          total: {
            ethCost: 4510.865058662784,
            usdCost: 14067290.393197736,
            gas: 138983271514,
          },
          calldata: {
            ethCost: 2713.945384861936,
            gas: 84723372872,
            usdCost: 8446636.617529953,
          },
          compute: {
            ethCost: 1683.8447952969784,
            usdCost: 5266267.787943985,
            gas: 50837003642,
          },
          overhead: {
            ethCost: 113.07487850393412,
            usdCost: 354385.98772351537,
            gas: 3422895000,
          },
        },
      },
      zkspace: {
        syncedUntil: new UnixTime(1711357200),
        last24h: {
          total: {
            ethCost: 0,
            usdCost: 0,
            gas: 0,
          },
          calldata: {
            ethCost: 0,
            usdCost: 0,
            gas: 0,
          },
          compute: {
            ethCost: 0,
            usdCost: 0,
            gas: 0,
          },
          overhead: {
            ethCost: 0,
            usdCost: 0,
            gas: 0,
          },
        },
        last7d: {
          total: {
            ethCost: 0.06923288105416317,
            usdCost: 240.02986761990292,
            gas: 1746357,
          },
          calldata: {
            ethCost: 0.002701668476010816,
            gas: 68148,
            usdCost: 9.36674796426623,
          },
          compute: {
            ethCost: 0.06403362950451635,
            usdCost: 222.00402145135752,
            gas: 1615209,
          },
          overhead: {
            ethCost: 0.0024975830736360003,
            usdCost: 8.65909820427915,
            gas: 63000,
          },
        },
        last30d: {
          total: {
            ethCost: 1.1517777043922706,
            usdCost: 4087.302948563258,
            gas: 17468461,
          },
          calldata: {
            ethCost: 0.04495310347071252,
            gas: 681696,
            usdCost: 159.52350876258586,
          },
          compute: {
            ethCost: 1.0652862451171718,
            usdCost: 3780.376756653053,
            gas: 16156765,
          },
          overhead: {
            ethCost: 0.041538355804385994,
            usdCost: 147.40268314761897,
            gas: 630000,
          },
        },
        last90d: {
          total: {
            ethCost: 2.6444676575811643,
            usdCost: 7771.8254308814185,
            gas: 68126214,
          },
          calldata: {
            ethCost: 0.10319062814082686,
            gas: 2657820,
            usdCost: 303.278646994864,
          },
          compute: {
            ethCost: 2.445899569303581,
            usdCost: 7188.248661489539,
            gas: 63011394,
          },
          overhead: {
            ethCost: 0.09537746013675599,
            usdCost: 280.29812239701187,
            gas: 2457000,
          },
        },
      },
      zksync2: {
        syncedUntil: new UnixTime(1711357200),
        last24h: {
          total: {
            ethCost: 3.454183700373096,
            usdCost: 11785.029106125941,
            gas: 173960478,
          },
          calldata: {
            ethCost: 0.19644341663505577,
            gas: 9859428,
            usdCost: 670.2917451936812,
          },
          compute: {
            ethCost: 3.12203438480074,
            usdCost: 10651.726836604941,
            gas: 157318050,
          },
          overhead: {
            ethCost: 0.13570589893730106,
            usdCost: 463.0105243273141,
            gas: 6783000,
          },
        },
        last7d: {
          total: {
            ethCost: 40.79122666145023,
            usdCost: 138453.3245333133,
            gas: 1347623222,
          },
          calldata: {
            ethCost: 2.399342442926677,
            gas: 77547676,
            usdCost: 8145.283197608913,
          },
          compute: {
            ethCost: 36.77508056159836,
            usdCost: 124820.33845915033,
            gas: 1217680546,
          },
          overhead: {
            ethCost: 1.6168036569252051,
            usdCost: 5487.702876554186,
            gas: 52395000,
          },
        },
        last30d: {
          total: {
            ethCost: 1794.3562550593745,
            usdCost: 6258315.701622302,
            gas: 34197825837,
          },
          calldata: {
            ethCost: 1116.9077337488384,
            gas: 21027785656,
            usdCost: 3871407.0874064174,
          },
          compute: {
            ethCost: 639.6373202579041,
            usdCost: 2253858.3251353046,
            gas: 12447556181,
          },
          overhead: {
            ethCost: 37.81120105263238,
            usdCost: 133050.2890805433,
            gas: 722484000,
          },
        },
        last90d: {
          total: {
            ethCost: 5877.631006778846,
            usdCost: 16451947.418803297,
            gas: 175937648879,
          },
          calldata: {
            ethCost: 3685.969565106405,
            gas: 109965154492,
            usdCost: 10316471.376209531,
          },
          compute: {
            ethCost: 2067.135606893606,
            usdCost: 5787485.638231738,
            gas: 62232247387,
          },
          overhead: {
            ethCost: 124.52583477880736,
            usdCost: 347990.40436220483,
            gas: 3740247000,
          },
        },
      },
      zksync: {
        syncedUntil: new UnixTime(1711357200),
        last24h: {
          total: {
            ethCost: 1.130101378279734,
            usdCost: 3855.91368607844,
            gas: 59773414,
          },
          calldata: {
            ethCost: 0.2676185028875146,
            gas: 14164196,
            usdCost: 913.0162672919472,
          },
          compute: {
            ethCost: 0.833836258066627,
            usdCost: 2845.1636017076426,
            gas: 44097218,
          },
          overhead: {
            ethCost: 0.028646617325592,
            usdCost: 97.73381707885048,
            gas: 1512000,
          },
        },
        last7d: {
          total: {
            ethCost: 11.38785229432306,
            usdCost: 38572.88681521899,
            gas: 436206720,
          },
          calldata: {
            ethCost: 2.690064084396481,
            gas: 103050648,
            usdCost: 9107.932918670029,
          },
          compute: {
            ethCost: 8.409057561419049,
            usdCost: 28487.322439442894,
            gas: 322278072,
          },
          overhead: {
            ethCost: 0.2887306485075178,
            usdCost: 977.6314571061098,
            gas: 10878000,
          },
        },
        last30d: {
          total: {
            ethCost: 95.55583335927624,
            usdCost: 338063.57151137694,
            gas: 2242807077,
          },
          calldata: {
            ethCost: 22.592287473363513,
            gas: 531315656,
            usdCost: 79952.41686706657,
          },
          compute: {
            ethCost: 70.56951005126521,
            usdCost: 249636.84008120868,
            gas: 1655673421,
          },
          overhead: {
            ethCost: 2.3940358346472483,
            usdCost: 8474.314563101045,
            gas: 55818000,
          },
        },
        last90d: {
          total: {
            ethCost: 242.1155860394683,
            usdCost: 700976.5083562514,
            gas: 8991969043,
          },
          calldata: {
            ethCost: 57.042157276107226,
            gas: 2127225436,
            usdCost: 165319.7624652764,
          },
          compute: {
            ethCost: 178.93207048161042,
            usdCost: 517902.8904365533,
            gas: 6639266607,
          },
          overhead: {
            ethCost: 6.14135828175036,
            usdCost: 17753.855454425284,
            gas: 225477000,
          },
        },
      },
      zora: {
        syncedUntil: new UnixTime(1711357200),
        last24h: {
          total: {
            ethCost: 0.047712294766100116,
            usdCost: 163.00729907700273,
            gas: 17925382,
          },
          calldata: {
            ethCost: 0.0005981727311111521,
            gas: 29952,
            usdCost: 2.043100625920591,
          },
          compute: {
            ethCost: 0.027021122509059397,
            usdCost: 92.29153689536065,
            gas: 1352862,
          },
          overhead: {
            ethCost: 0.020092999510332,
            usdCost: 68.67266150246036,
            gas: 945000,
          },

          blobs: {
            ethCost: 1.5597567999999998e-11,
            usdCost: 5.3261115483750406e-8,
            gas: 15597568,
          },
        },
        last7d: {
          total: {
            ethCost: 0.5300271658683001,
            usdCost: 1797.160322701981,
            gas: 124288294,
          },
          calldata: {
            ethCost: 0.006956681597400157,
            gas: 235200,
            usdCost: 23.571711530094596,
          },
          compute: {
            ethCost: 0.3143896258607406,
            usdCost: 1065.2682559760528,
            gas: 10629630,
          },
          overhead: {
            ethCost: 0.20868085830372898,
            usdCost: 708.320354833963,
            gas: 6993000,
          },

          blobs: {
            ethCost: 1.0643046400000002e-10,
            usdCost: 3.6186796873482235e-7,
            gas: 106430464,
          },
        },
        last30d: {
          total: {
            ethCost: 146.34692952988726,
            usdCost: 530280.9694442904,
            gas: 2844604156,
          },
          calldata: {
            ethCost: 139.49140229315654,
            gas: 2542470964,
            usdCost: 505416.06470714265,
          },
          compute: {
            ethCost: 2.2853409335432375,
            usdCost: 8263.527995630544,
            gas: 46126152,
          },
          overhead: {
            ethCost: 4.570186303014387,
            usdCost: 16601.37674090881,
            gas: 82992000,
          },

          blobs: {
            ethCost: 1.7301504000000098e-10,
            usdCost: 6.090989925957636e-7,
            gas: 173015040,
          },
        },
        last90d: {
          total: {
            ethCost: 395.2106313870512,
            usdCost: 1155910.7083077303,
            gas: 12292629062,
          },
          calldata: {
            ethCost: 379.7173106654098,
            gas: 11668805768,
            usdCost: 1109422.8923600104,
          },
          compute: {
            ethCost: 4.771827673202542,
            usdCost: 14479.923587981839,
            gas: 138958254,
          },
          overhead: {
            ethCost: 10.7214930482642,
            usdCost: 32007.89235913031,
            gas: 311850000,
          },

          blobs: {
            ethCost: 1.7301504000000098e-10,
            usdCost: 6.090989925957636e-7,
            gas: 173015040,
          },
        },
      },
    },
  }
}

function generateMockData(withoutBlobs?: boolean): L2CostsApiProject {
  return {
    syncedUntil: UnixTime.now(),
    last24h: generateMockDataDetails(2, withoutBlobs),
    last7d: generateMockDataDetails(8, withoutBlobs),
    last30d: generateMockDataDetails(30, withoutBlobs),
    last90d: generateMockDataDetails(90, withoutBlobs),
  }
}

function generateMockDataDetails(
  base: number,
  withoutBlobs?: boolean,
): L2CostsDetails {
  const calldataMultiplier = Math.random()
  const blobsMultiplier = Math.random()
  const computeMultiplier = Math.random()
  const overheadMultiplier = Math.random()

  const usdMultiplier = base * 3500
  const gasMultiplier = (base + Math.random() * base) * 100000

  const calldataEthCost = round(base * calldataMultiplier)
  const calldataUsdCost = round(base * usdMultiplier * calldataMultiplier)
  const calldataGas = round(base * gasMultiplier * calldataMultiplier)
  const blobEthCost = round(base * blobsMultiplier)
  const blobUsdCost = round(base * usdMultiplier * blobsMultiplier)
  const blobGas = round(base * gasMultiplier * blobsMultiplier)
  const computeEthCost = round(base * computeMultiplier)
  const computeUsdCost = round(base * usdMultiplier * computeMultiplier)
  const computeGas = round(base * gasMultiplier * computeMultiplier)
  const overheadEthCost = round(base * overheadMultiplier)
  const overheadUsdCost = round(base * usdMultiplier * overheadMultiplier)
  const overheadGas = round(base * gasMultiplier * overheadMultiplier)

  const totalEthCost = round(
    withoutBlobs
      ? calldataEthCost + computeEthCost + overheadEthCost
      : calldataEthCost + blobEthCost + computeEthCost + overheadEthCost,
  )
  const totalUsdCost = round(
    withoutBlobs
      ? calldataUsdCost + computeUsdCost + overheadUsdCost
      : calldataUsdCost + blobUsdCost + computeUsdCost + overheadUsdCost,
  )
  const totalGas = round(
    withoutBlobs
      ? calldataGas + computeGas + overheadGas
      : calldataGas + blobGas + computeGas + overheadGas,
  )
  return {
    total: {
      ethCost: totalEthCost,
      usdCost: totalUsdCost,
      gas: totalGas,
    },
    calldata: {
      ethCost: calldataEthCost,
      usdCost: calldataUsdCost,
      gas: calldataGas,
    },
    blobs: withoutBlobs
      ? undefined
      : {
          ethCost: blobEthCost,
          usdCost: blobUsdCost,
          gas: blobGas,
        },
    compute: {
      ethCost: computeEthCost,
      usdCost: computeUsdCost,
      gas: computeGas,
    },
    overhead: {
      ethCost: overheadEthCost,
      usdCost: overheadUsdCost,
      gas: overheadGas,
    },
  }
}

function round(value: number) {
  return Math.round(value * 100) / 100
}
