import { LivenessApiResponse, UnixTime } from '@l2beat/shared-pure'

export const mockLiveness: LivenessApiResponse = {
  projects: {
    aevo: {
      batchSubmissions: {
        last30Days: { averageInSeconds: 904, maximumInSeconds: 6708 },
        last90Days: { averageInSeconds: 1090, maximumInSeconds: 7440 },
        max: { averageInSeconds: 1141, maximumInSeconds: 7440 },
      },
      stateUpdates: {
        last30Days: { averageInSeconds: 2051, maximumInSeconds: 11868 },
        last90Days: { averageInSeconds: 2017, maximumInSeconds: 11868 },
        max: { averageInSeconds: 1812, maximumInSeconds: 11868 },
      },
      anomalies: [],
    },
    arbitrum: {
      batchSubmissions: {
        last30Days: { averageInSeconds: 28, maximumInSeconds: 684 },
        last90Days: { averageInSeconds: 30, maximumInSeconds: 3936 },
        max: { averageInSeconds: 23, maximumInSeconds: 6348 },
      },
      stateUpdates: {
        last30Days: { averageInSeconds: 3616, maximumInSeconds: 11340 },
        last90Days: { averageInSeconds: 3614, maximumInSeconds: 11340 },
        max: { averageInSeconds: 3616, maximumInSeconds: 11340 },
      },
      anomalies: [
        {
          timestamp: new UnixTime(1699552295),
          durationInSeconds: 11340,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698018299),
          durationInSeconds: 4764,
          type: 'STATE',
        },
      ],
    },
    aztec: {
      batchSubmissions: {},
      stateUpdates: {
        last30Days: { averageInSeconds: 67398, maximumInSeconds: 333564 },
        last90Days: { averageInSeconds: 65673, maximumInSeconds: 333564 },
        max: { averageInSeconds: 61670, maximumInSeconds: 1541556 },
      },
      anomalies: [],
    },
    aztecconnect: {
      batchSubmissions: {},
      stateUpdates: {
        last30Days: { averageInSeconds: 4941, maximumInSeconds: 43572 },
        last90Days: { averageInSeconds: 4873, maximumInSeconds: 43572 },
        max: { averageInSeconds: 4157, maximumInSeconds: 232788 },
      },
      anomalies: [],
    },
    base: {
      batchSubmissions: {
        last30Days: { averageInSeconds: 21, maximumInSeconds: 1836 },
        last90Days: { averageInSeconds: 20, maximumInSeconds: 2832 },
        max: { averageInSeconds: 21, maximumInSeconds: 2832 },
      },
      stateUpdates: {
        last30Days: { averageInSeconds: 1230, maximumInSeconds: 4596 },
        last90Days: { averageInSeconds: 1210, maximumInSeconds: 9156 },
        max: { averageInSeconds: 1150, maximumInSeconds: 9156 },
      },
      anomalies: [
        {
          timestamp: new UnixTime(1699397243),
          durationInSeconds: 1536,
          type: 'DA',
        },
        {
          timestamp: new UnixTime(1697885639),
          durationInSeconds: 1836,
          type: 'DA',
        },
      ],
    },
    bobanetwork: {
      batchSubmissions: {
        last30Days: { averageInSeconds: 1169, maximumInSeconds: 4620 },
        last90Days: { averageInSeconds: 1210, maximumInSeconds: 15096 },
        max: { averageInSeconds: 1101, maximumInSeconds: 15096 },
      },
      stateUpdates: {
        last30Days: { averageInSeconds: 1234, maximumInSeconds: 8448 },
        last90Days: { averageInSeconds: 1240, maximumInSeconds: 15096 },
        max: { averageInSeconds: 1115, maximumInSeconds: 15096 },
      },
      anomalies: [],
    },
    degate: {
      batchSubmissions: {},
      stateUpdates: {
        last90Days: { averageInSeconds: 4112, maximumInSeconds: 120108 },
        max: { averageInSeconds: 1951, maximumInSeconds: 120108 },
      },
      anomalies: [],
    },
    degate2: {
      batchSubmissions: {},
      stateUpdates: {
        last30Days: { averageInSeconds: 3004, maximumInSeconds: 28632 },
        last90Days: { averageInSeconds: 3768, maximumInSeconds: 573756 },
        max: { averageInSeconds: 3768, maximumInSeconds: 573756 },
      },
      anomalies: [],
    },
    dydx: {
      batchSubmissions: {},
      stateUpdates: {
        last30Days: { averageInSeconds: 1016, maximumInSeconds: 16644 },
        last90Days: { averageInSeconds: 1367, maximumInSeconds: 18540 },
        max: { averageInSeconds: 1244, maximumInSeconds: 22872 },
      },
      anomalies: [],
    },
    kroma: {
      batchSubmissions: {
        last30Days: { averageInSeconds: 212, maximumInSeconds: 696 },
        last90Days: { averageInSeconds: 208, maximumInSeconds: 1140 },
        max: { averageInSeconds: 208, maximumInSeconds: 1140 },
      },
      stateUpdates: {
        last30Days: { averageInSeconds: 1231, maximumInSeconds: 5688 },
        last90Days: { averageInSeconds: 1212, maximumInSeconds: 7644 },
        max: { averageInSeconds: 1212, maximumInSeconds: 7644 },
      },
      anomalies: [],
    },
    linea: {
      batchSubmissions: {},
      stateUpdates: {
        last30Days: { averageInSeconds: 30, maximumInSeconds: 80340 },
        last90Days: { averageInSeconds: 23, maximumInSeconds: 80340 },
        max: { averageInSeconds: 23, maximumInSeconds: 213168 },
      },
      anomalies: [
        {
          timestamp: new UnixTime(1699660607),
          durationInSeconds: 37716,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699589699),
          durationInSeconds: 69408,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699490963),
          durationInSeconds: 43248,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699385819),
          durationInSeconds: 22596,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699328231),
          durationInSeconds: 56328,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699262795),
          durationInSeconds: 10464,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699250771),
          durationInSeconds: 7548,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699197659),
          durationInSeconds: 7356,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699036727),
          durationInSeconds: 21384,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699002947),
          durationInSeconds: 6420,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698961679),
          durationInSeconds: 35904,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698897959),
          durationInSeconds: 54696,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698788855),
          durationInSeconds: 12768,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698775103),
          durationInSeconds: 18948,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698718403),
          durationInSeconds: 20880,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698696827),
          durationInSeconds: 26508,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698428651),
          durationInSeconds: 13488,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698344159),
          durationInSeconds: 18096,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698294539),
          durationInSeconds: 6696,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698273275),
          durationInSeconds: 34572,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698169667),
          durationInSeconds: 19056,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698139091),
          durationInSeconds: 80340,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698055787),
          durationInSeconds: 5052,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698035939),
          durationInSeconds: 5112,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698005339),
          durationInSeconds: 9144,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697995451),
          durationInSeconds: 10464,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697916755),
          durationInSeconds: 18408,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697842751),
          durationInSeconds: 48156,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697793779),
          durationInSeconds: 3432,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697773295),
          durationInSeconds: 3444,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697758643),
          durationInSeconds: 4584,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697752871),
          durationInSeconds: 4152,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697748107),
          durationInSeconds: 3300,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697744807),
          durationInSeconds: 3288,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697741519),
          durationInSeconds: 3168,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697736515),
          durationInSeconds: 16428,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697662643),
          durationInSeconds: 28692,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697574371),
          durationInSeconds: 27240,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697494607),
          durationInSeconds: 34512,
          type: 'STATE',
        },
      ],
    },
    loopring: {
      batchSubmissions: {},
      stateUpdates: {
        last30Days: { averageInSeconds: 919, maximumInSeconds: 21660 },
        last90Days: { averageInSeconds: 951, maximumInSeconds: 21660 },
        max: { averageInSeconds: 848, maximumInSeconds: 21660 },
      },
      anomalies: [],
    },
    optimism: {
      batchSubmissions: {
        last30Days: { averageInSeconds: 48, maximumInSeconds: 408 },
        last90Days: { averageInSeconds: 46, maximumInSeconds: 420 },
        max: { averageInSeconds: 36, maximumInSeconds: 1032 },
      },
      stateUpdates: {
        last30Days: { averageInSeconds: 1230, maximumInSeconds: 3900 },
        last90Days: { averageInSeconds: 1210, maximumInSeconds: 4224 },
        max: { averageInSeconds: 1136, maximumInSeconds: 6156 },
      },
      anomalies: [],
    },
    polygonzkevm: {
      batchSubmissions: {
        last30Days: { averageInSeconds: 112, maximumInSeconds: 1416 },
        last90Days: { averageInSeconds: 149, maximumInSeconds: 8556 },
        max: { averageInSeconds: 145, maximumInSeconds: 25380 },
      },
      stateUpdates: {
        last30Days: { averageInSeconds: 564, maximumInSeconds: 2856 },
        last90Days: { averageInSeconds: 558, maximumInSeconds: 3612 },
        max: { averageInSeconds: 558, maximumInSeconds: 3612 },
      },
      anomalies: [],
    },
    publicgoodsnetwork: {
      batchSubmissions: {
        last30Days: { averageInSeconds: 204, maximumInSeconds: 2736 },
        last90Days: { averageInSeconds: 200, maximumInSeconds: 2736 },
        max: { averageInSeconds: 200, maximumInSeconds: 2736 },
      },
      stateUpdates: {
        last30Days: { averageInSeconds: 1230, maximumInSeconds: 5520 },
        last90Days: { averageInSeconds: 1210, maximumInSeconds: 5520 },
        max: { averageInSeconds: 1207, maximumInSeconds: 5520 },
      },
      anomalies: [],
    },
    deversifi: {
      batchSubmissions: {},
      stateUpdates: {
        last30Days: { averageInSeconds: 2190, maximumInSeconds: 21336 },
        last90Days: { averageInSeconds: 3166, maximumInSeconds: 48672 },
        max: { averageInSeconds: 3793, maximumInSeconds: 122208 },
      },
      anomalies: [],
    },
    starknet: {
      batchSubmissions: {},
      stateUpdates: {
        last30Days: { averageInSeconds: 12, maximumInSeconds: 15336 },
        last90Days: { averageInSeconds: 11, maximumInSeconds: 22440 },
        max: { averageInSeconds: 16, maximumInSeconds: 49764 },
      },
      anomalies: [
        {
          timestamp: new UnixTime(1699859123),
          durationInSeconds: 6420,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699851563),
          durationInSeconds: 4584,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699845611),
          durationInSeconds: 5148,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699839251),
          durationInSeconds: 6348,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699831691),
          durationInSeconds: 6048,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699824359),
          durationInSeconds: 7056,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699815647),
          durationInSeconds: 3120,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699769363),
          durationInSeconds: 5028,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699763111),
          durationInSeconds: 6936,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699755011),
          durationInSeconds: 9240,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699744739),
          durationInSeconds: 8568,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699735019),
          durationInSeconds: 6108,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699697075),
          durationInSeconds: 4632,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699691183),
          durationInSeconds: 7464,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699682651),
          durationInSeconds: 7788,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699673903),
          durationInSeconds: 15336,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699657643),
          durationInSeconds: 10020,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699646699),
          durationInSeconds: 5388,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699640099),
          durationInSeconds: 5952,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699633007),
          durationInSeconds: 5604,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699622555),
          durationInSeconds: 4956,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699616123),
          durationInSeconds: 3480,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699611503),
          durationInSeconds: 6900,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699603343),
          durationInSeconds: 8172,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699594271),
          durationInSeconds: 11004,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699582703),
          durationInSeconds: 7428,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699574531),
          durationInSeconds: 9276,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699564871),
          durationInSeconds: 5820,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699558211),
          durationInSeconds: 3600,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699535135),
          durationInSeconds: 2796,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699526903),
          durationInSeconds: 3876,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699521851),
          durationInSeconds: 3096,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699513619),
          durationInSeconds: 3732,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699508771),
          durationInSeconds: 8784,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699499039),
          durationInSeconds: 9336,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699488767),
          durationInSeconds: 10212,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699477367),
          durationInSeconds: 7116,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699440647),
          durationInSeconds: 4596,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699422623),
          durationInSeconds: 2844,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699418603),
          durationInSeconds: 5124,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699412387),
          durationInSeconds: 7104,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699404095),
          durationInSeconds: 7860,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699395047),
          durationInSeconds: 4980,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699388687),
          durationInSeconds: 3360,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699383875),
          durationInSeconds: 4536,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699352291),
          durationInSeconds: 3636,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699347131),
          durationInSeconds: 2712,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699343099),
          durationInSeconds: 4152,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699337939),
          durationInSeconds: 6120,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699330619),
          durationInSeconds: 8604,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699321247),
          durationInSeconds: 11124,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699308827),
          durationInSeconds: 7848,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699299755),
          durationInSeconds: 4428,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699291283),
          durationInSeconds: 3624,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699283111),
          durationInSeconds: 4020,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699267487),
          durationInSeconds: 3372,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699256027),
          durationInSeconds: 4020,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699248095),
          durationInSeconds: 4056,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699242875),
          durationInSeconds: 3888,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699237643),
          durationInSeconds: 4956,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699227311),
          durationInSeconds: 3888,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699216979),
          durationInSeconds: 3768,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699147703),
          durationInSeconds: 2844,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699141331),
          durationInSeconds: 2988,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699137191),
          durationInSeconds: 4200,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699121027),
          durationInSeconds: 3216,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699088783),
          durationInSeconds: 3120,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699080491),
          durationInSeconds: 3756,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699067747),
          durationInSeconds: 3756,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699062707),
          durationInSeconds: 8160,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699053407),
          durationInSeconds: 5736,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699046447),
          durationInSeconds: 5496,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699039475),
          durationInSeconds: 4020,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699032203),
          durationInSeconds: 3504,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699020911),
          durationInSeconds: 2760,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698989243),
          durationInSeconds: 6084,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698981983),
          durationInSeconds: 5520,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698975203),
          durationInSeconds: 6420,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698967631),
          durationInSeconds: 6732,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698959831),
          durationInSeconds: 5664,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698953111),
          durationInSeconds: 3768,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698947339),
          durationInSeconds: 5376,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698916055),
          durationInSeconds: 4800,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698909803),
          durationInSeconds: 6384,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698902423),
          durationInSeconds: 9948,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698891803),
          durationInSeconds: 7416,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698883643),
          durationInSeconds: 7860,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698874571),
          durationInSeconds: 6312,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698866975),
          durationInSeconds: 2868,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698863255),
          durationInSeconds: 3420,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698833459),
          durationInSeconds: 3936,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698826427),
          durationInSeconds: 4500,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698817235),
          durationInSeconds: 5388,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698810575),
          durationInSeconds: 5448,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698803903),
          durationInSeconds: 4584,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698798143),
          durationInSeconds: 4044,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698792971),
          durationInSeconds: 5712,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698785951),
          durationInSeconds: 4860,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698779339),
          durationInSeconds: 2808,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698775079),
          durationInSeconds: 3012,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698766607),
          durationInSeconds: 2820,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698752267),
          durationInSeconds: 2676,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698743675),
          durationInSeconds: 4164,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698738083),
          durationInSeconds: 5112,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698732011),
          durationInSeconds: 9528,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698721151),
          durationInSeconds: 7524,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698712631),
          durationInSeconds: 11028,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698700331),
          durationInSeconds: 4380,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698694547),
          durationInSeconds: 5148,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698684275),
          durationInSeconds: 5748,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698651527),
          durationInSeconds: 3456,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698644183),
          durationInSeconds: 3384,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698639563),
          durationInSeconds: 4548,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698630479),
          durationInSeconds: 6684,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698619247),
          durationInSeconds: 4500,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698613307),
          durationInSeconds: 3468,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698608435),
          durationInSeconds: 3444,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698573587),
          durationInSeconds: 2664,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698560363),
          durationInSeconds: 3516,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698551879),
          durationInSeconds: 3192,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698543839),
          durationInSeconds: 7080,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698535307),
          durationInSeconds: 2904,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698530987),
          durationInSeconds: 4644,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698524843),
          durationInSeconds: 3276,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698520343),
          durationInSeconds: 3168,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698470279),
          durationInSeconds: 5016,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698464159),
          durationInSeconds: 8400,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698454247),
          durationInSeconds: 5760,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698447527),
          durationInSeconds: 4248,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698442295),
          durationInSeconds: 8808,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698400283),
          durationInSeconds: 5664,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698393011),
          durationInSeconds: 3384,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698385319),
          durationInSeconds: 6864,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698377207),
          durationInSeconds: 10200,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698365987),
          durationInSeconds: 9072,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698355955),
          durationInSeconds: 8724,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698346055),
          durationInSeconds: 3324,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698338459),
          durationInSeconds: 3396,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698333935),
          durationInSeconds: 3828,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698326675),
          durationInSeconds: 2760,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698317423),
          durationInSeconds: 4428,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698311831),
          durationInSeconds: 9444,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698301211),
          durationInSeconds: 6612,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698293639),
          durationInSeconds: 10032,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698282779),
          durationInSeconds: 10848,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698271259),
          durationInSeconds: 8148,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698262199),
          durationInSeconds: 5304,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698227363),
          durationInSeconds: 3804,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698214067),
          durationInSeconds: 4824,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698208415),
          durationInSeconds: 9636,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698197855),
          durationInSeconds: 9168,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698187859),
          durationInSeconds: 7416,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698179879),
          durationInSeconds: 5148,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698173819),
          durationInSeconds: 6780,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698165887),
          durationInSeconds: 3924,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698160727),
          durationInSeconds: 3876,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698144059),
          durationInSeconds: 4068,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698139019),
          durationInSeconds: 8952,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698129527),
          durationInSeconds: 6060,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698122867),
          durationInSeconds: 6048,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698116207),
          durationInSeconds: 3036,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698112307),
          durationInSeconds: 10152,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698101447),
          durationInSeconds: 6888,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698093815),
          durationInSeconds: 6720,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698085703),
          durationInSeconds: 3192,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698073319),
          durationInSeconds: 2604,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698052391),
          durationInSeconds: 2568,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698048899),
          durationInSeconds: 3216,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698035315),
          durationInSeconds: 4776,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698029435),
          durationInSeconds: 4896,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698020603),
          durationInSeconds: 5292,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698013571),
          durationInSeconds: 2508,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698009911),
          durationInSeconds: 4200,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697962031),
          durationInSeconds: 5004,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697955287),
          durationInSeconds: 3552,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697950415),
          durationInSeconds: 3204,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697946095),
          durationInSeconds: 5172,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697939435),
          durationInSeconds: 3300,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697900135),
          durationInSeconds: 6540,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697889551),
          durationInSeconds: 3336,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697879555),
          durationInSeconds: 6084,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697872535),
          durationInSeconds: 8568,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697862323),
          durationInSeconds: 7524,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697853563),
          durationInSeconds: 3252,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697848991),
          durationInSeconds: 6348,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697841443),
          durationInSeconds: 2760,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697837207),
          durationInSeconds: 2664,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697817959),
          durationInSeconds: 3996,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697803535),
          durationInSeconds: 5160,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697793851),
          durationInSeconds: 6180,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697786411),
          durationInSeconds: 6816,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697778251),
          durationInSeconds: 3840,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697772599),
          durationInSeconds: 3912,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697767607),
          durationInSeconds: 9156,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697752535),
          durationInSeconds: 5748,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697740787),
          durationInSeconds: 2760,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697731571),
          durationInSeconds: 2604,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697720555),
          durationInSeconds: 4032,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697714123),
          durationInSeconds: 3720,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697707631),
          durationInSeconds: 4668,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697701391),
          durationInSeconds: 7656,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697692271),
          durationInSeconds: 5688,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697685347),
          durationInSeconds: 2940,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697681087),
          durationInSeconds: 6456,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697672615),
          durationInSeconds: 5484,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697656763),
          durationInSeconds: 2580,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697629079),
          durationInSeconds: 3864,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697624087),
          durationInSeconds: 3048,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697617187),
          durationInSeconds: 5652,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697610023),
          durationInSeconds: 2952,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697605811),
          durationInSeconds: 7992,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697596451),
          durationInSeconds: 3648,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697591279),
          durationInSeconds: 6444,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697571203),
          durationInSeconds: 5448,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697548775),
          durationInSeconds: 3852,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697540531),
          durationInSeconds: 3264,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697535971),
          durationInSeconds: 5448,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697529131),
          durationInSeconds: 5364,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697522219),
          durationInSeconds: 4092,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697516927),
          durationInSeconds: 4836,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697510627),
          durationInSeconds: 11664,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697491271),
          durationInSeconds: 3000,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697472239),
          durationInSeconds: 4788,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697461583),
          durationInSeconds: 2796,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697456171),
          durationInSeconds: 7536,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697447339),
          durationInSeconds: 3552,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697439827),
          durationInSeconds: 4476,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697428223),
          durationInSeconds: 6984,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697419751),
          durationInSeconds: 2928,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697409743),
          durationInSeconds: 2544,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697391491),
          durationInSeconds: 2976,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697386919),
          durationInSeconds: 5004,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697375747),
          durationInSeconds: 7188,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697367419),
          durationInSeconds: 3684,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697362307),
          durationInSeconds: 2964,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697358035),
          durationInSeconds: 3708,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697352803),
          durationInSeconds: 6552,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697340863),
          durationInSeconds: 4968,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697334251),
          durationInSeconds: 4620,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697320631),
          durationInSeconds: 3468,
          type: 'STATE',
        },
      ],
    },
    zkspace: {
      batchSubmissions: {},
      stateUpdates: {
        last30Days: { averageInSeconds: 10647, maximumInSeconds: 97800 },
        last90Days: { averageInSeconds: 8205, maximumInSeconds: 182760 },
        max: { averageInSeconds: 2795, maximumInSeconds: 182760 },
      },
      anomalies: [],
    },
    zksync2: {
      batchSubmissions: {},
      stateUpdates: {
        last30Days: { averageInSeconds: 23, maximumInSeconds: 44256 },
        last90Days: { averageInSeconds: 18, maximumInSeconds: 44256 },
        max: { averageInSeconds: 19, maximumInSeconds: 52488 },
      },
      anomalies: [
        {
          timestamp: new UnixTime(1699857515),
          durationInSeconds: 7500,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699839995),
          durationInSeconds: 16344,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699823387),
          durationInSeconds: 12036,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699806035),
          durationInSeconds: 5448,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699788023),
          durationInSeconds: 4524,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699735007),
          durationInSeconds: 4728,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699717679),
          durationInSeconds: 6120,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699705703),
          durationInSeconds: 5628,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699619831),
          durationInSeconds: 4884,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699598903),
          durationInSeconds: 5532,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699582247),
          durationInSeconds: 7152,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699560419),
          durationInSeconds: 9516,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699547459),
          durationInSeconds: 4188,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699512887),
          durationInSeconds: 6000,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699503791),
          durationInSeconds: 4596,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699478651),
          durationInSeconds: 6168,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699449863),
          durationInSeconds: 4128,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699430087),
          durationInSeconds: 8172,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699399175),
          durationInSeconds: 6144,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699392155),
          durationInSeconds: 6168,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699383239),
          durationInSeconds: 4692,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699371863),
          durationInSeconds: 6648,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699365107),
          durationInSeconds: 7032,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699357103),
          durationInSeconds: 5940,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699348331),
          durationInSeconds: 5652,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699308155),
          durationInSeconds: 4596,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699302359),
          durationInSeconds: 4560,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699296527),
          durationInSeconds: 7932,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699288187),
          durationInSeconds: 5964,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699272599),
          durationInSeconds: 3996,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699267487),
          durationInSeconds: 5340,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699259987),
          durationInSeconds: 5400,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699249979),
          durationInSeconds: 4368,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699210319),
          durationInSeconds: 4668,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699201091),
          durationInSeconds: 5508,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699188635),
          durationInSeconds: 4632,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699148219),
          durationInSeconds: 5460,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699138055),
          durationInSeconds: 4152,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699118735),
          durationInSeconds: 4140,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699087343),
          durationInSeconds: 4188,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699055099),
          durationInSeconds: 5124,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699043147),
          durationInSeconds: 4740,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1699019531),
          durationInSeconds: 6564,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698973559),
          durationInSeconds: 6492,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698961727),
          durationInSeconds: 4668,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698955211),
          durationInSeconds: 6192,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698924431),
          durationInSeconds: 4764,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698914315),
          durationInSeconds: 5124,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698908855),
          durationInSeconds: 6936,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698901679),
          durationInSeconds: 6384,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698875147),
          durationInSeconds: 5364,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698865091),
          durationInSeconds: 11916,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698845735),
          durationInSeconds: 4884,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698819719),
          durationInSeconds: 9408,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698810275),
          durationInSeconds: 4932,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698790895),
          durationInSeconds: 4080,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698784403),
          durationInSeconds: 5952,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698766295),
          durationInSeconds: 9804,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698744767),
          durationInSeconds: 7068,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698724715),
          durationInSeconds: 4248,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698709811),
          durationInSeconds: 4020,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698686039),
          durationInSeconds: 5880,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698670355),
          durationInSeconds: 8328,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698611423),
          durationInSeconds: 5604,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698603479),
          durationInSeconds: 6720,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698479447),
          durationInSeconds: 5352,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698437963),
          durationInSeconds: 6084,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698430907),
          durationInSeconds: 5412,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698402527),
          durationInSeconds: 6480,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698380315),
          durationInSeconds: 5964,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698373607),
          durationInSeconds: 5160,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698363455),
          durationInSeconds: 5688,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698351647),
          durationInSeconds: 6240,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698337019),
          durationInSeconds: 4140,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698331679),
          durationInSeconds: 5364,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698323315),
          durationInSeconds: 6024,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698308051),
          durationInSeconds: 5784,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698292259),
          durationInSeconds: 5616,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698286643),
          durationInSeconds: 5532,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698275639),
          durationInSeconds: 4668,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698261047),
          durationInSeconds: 7212,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698229427),
          durationInSeconds: 5208,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698210095),
          durationInSeconds: 4908,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698181955),
          durationInSeconds: 4668,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698175115),
          durationInSeconds: 4020,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698167867),
          durationInSeconds: 5232,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698150623),
          durationInSeconds: 6876,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698128819),
          durationInSeconds: 5928,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698102395),
          durationInSeconds: 4284,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698088919),
          durationInSeconds: 4968,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698080015),
          durationInSeconds: 4656,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698070487),
          durationInSeconds: 9912,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698043631),
          durationInSeconds: 4464,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698026087),
          durationInSeconds: 5748,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1698014291),
          durationInSeconds: 6384,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697982671),
          durationInSeconds: 6000,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697963987),
          durationInSeconds: 5088,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697953043),
          durationInSeconds: 5232,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697942015),
          durationInSeconds: 5952,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697931395),
          durationInSeconds: 5232,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697911103),
          durationInSeconds: 4776,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697904275),
          durationInSeconds: 3732,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697881931),
          durationInSeconds: 4140,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697872751),
          durationInSeconds: 4656,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697857415),
          durationInSeconds: 5088,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697849711),
          durationInSeconds: 5664,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697838527),
          durationInSeconds: 4476,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697833895),
          durationInSeconds: 5544,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697799803),
          durationInSeconds: 25032,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697766527),
          durationInSeconds: 6540,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697756183),
          durationInSeconds: 6996,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697749163),
          durationInSeconds: 20532,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697717231),
          durationInSeconds: 4848,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697712179),
          durationInSeconds: 3756,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697700827),
          durationInSeconds: 5148,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697693723),
          durationInSeconds: 3876,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697689787),
          durationInSeconds: 5952,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697678339),
          durationInSeconds: 3660,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697671247),
          durationInSeconds: 5880,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697660855),
          durationInSeconds: 4488,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697653559),
          durationInSeconds: 3900,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697637299),
          durationInSeconds: 4128,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697627183),
          durationInSeconds: 6168,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697620991),
          durationInSeconds: 4752,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697595335),
          durationInSeconds: 4800,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697587775),
          durationInSeconds: 3564,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697581223),
          durationInSeconds: 3696,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697577359),
          durationInSeconds: 5640,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697547083),
          durationInSeconds: 44256,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697497883),
          durationInSeconds: 3744,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697465591),
          durationInSeconds: 4452,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697460107),
          durationInSeconds: 4632,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697452643),
          durationInSeconds: 3804,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697441135),
          durationInSeconds: 7332,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697428943),
          durationInSeconds: 3900,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697423879),
          durationInSeconds: 3720,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697420159),
          durationInSeconds: 3816,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697394539),
          durationInSeconds: 4824,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697387327),
          durationInSeconds: 9948,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697373683),
          durationInSeconds: 4152,
          type: 'STATE',
        },
        {
          timestamp: new UnixTime(1697351795),
          durationInSeconds: 3492,
          type: 'STATE',
        },
      ],
    },
    zksync: {
      batchSubmissions: {},
      stateUpdates: {
        last30Days: { averageInSeconds: 523, maximumInSeconds: 9744 },
        last90Days: { averageInSeconds: 353, maximumInSeconds: 11844 },
        max: { averageInSeconds: 272, maximumInSeconds: 11844 },
      },
      anomalies: [],
    },
    zora: {
      batchSubmissions: {
        last30Days: { averageInSeconds: 203, maximumInSeconds: 2556 },
        last90Days: { averageInSeconds: 191, maximumInSeconds: 2556 },
        max: { averageInSeconds: 184, maximumInSeconds: 2556 },
      },
      stateUpdates: {
        last30Days: { averageInSeconds: 1230, maximumInSeconds: 5760 },
        last90Days: { averageInSeconds: 1210, maximumInSeconds: 5760 },
        max: { averageInSeconds: 1067, maximumInSeconds: 5760 },
      },
      anomalies: [],
    },
  },
}
