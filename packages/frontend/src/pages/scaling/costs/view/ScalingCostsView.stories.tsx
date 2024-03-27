import { Meta, StoryObj } from '@storybook/react'

import { ScalingCostsView } from './ScalingCostsView'

const meta: Meta<typeof ScalingCostsView> = {
  component: ScalingCostsView,
  args: {
    items: [
      {
        name: 'Arbitrum One',
        shortName: undefined,
        slug: 'arbitrum',
        warning:
          'Fraud proof system is fully deployed but is not yet permissionless as it requires Validators to be whitelisted.',
        redWarning: undefined,
        showProjectUnderReview: false,
        costs: {
          last24h: {
            total: {
              ethCost: { displayValue: 'Ξ1.97', value: 1.975084205893318 },
              usdCost: { displayValue: '$7.15 K', value: 7155.839810079516 },
              gas: { displayValue: '359 M', value: 359851537 },
            },
            blobs: {
              ethCost: { displayValue: '~Ξ0.00', value: 4.946657280000027e-10 },
              usdCost: {
                displayValue: '~$0.00',
                value: 0.0000017997867688132626,
              },
              gas: { displayValue: '292 M', value: 292552704 },
            },
            calldata: {
              ethCost: { displayValue: 'Ξ0.0136', value: 0.013552139894719617 },
              usdCost: { displayValue: '$49.10', value: 49.10019918169476 },
              gas: { displayValue: '463 K', value: 463384 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ1.71', value: 1.7182748907086207 },
              usdCost: { displayValue: '$6.22 K', value: 6225.405615111142 },
              gas: { displayValue: '58.54 M', value: 58540449 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ0.2433', value: 0.2432571747953129 },
              usdCost: { displayValue: '$881', value: 881.3339939869016 },
              gas: { displayValue: '8.29 M', value: 8295000 },
            },
          },
          last7d: {
            total: {
              ethCost: { displayValue: 'Ξ11.43', value: 11.438745161826201 },
              usdCost: { displayValue: '$39.20 K', value: 39203.29670135163 },
              gas: { displayValue: '2.20 B', value: 2204721926 },
            },
            blobs: {
              ethCost: { displayValue: '~Ξ0.00', value: 1.9936051200000346e-9 },
              usdCost: {
                displayValue: '~$0.00',
                value: 0.000006879876033360699,
              },
              gas: { displayValue: '1.78 B', value: 1789132800 },
            },
            calldata: {
              ethCost: { displayValue: 'Ξ0.0792', value: 0.07917547444475448 },
              usdCost: { displayValue: '$271', value: 271.3434487600931 },
              gas: { displayValue: '2.89 M', value: 2890716 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ9.94', value: 9.949500789728273 },
              usdCost: { displayValue: '$34.09 K', value: 34099.317325351774 },
              gas: { displayValue: '361 M', value: 361416410 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ1.41', value: 1.4100688956595733 },
              usdCost: { displayValue: '$4.83 K', value: 4832.635920359895 },
              gas: { displayValue: '51.28 M', value: 51282000 },
            },
          },
          last30d: {
            total: {
              ethCost: { displayValue: 'Ξ2.74 K', value: 2742.41395044112 },
              usdCost: { displayValue: '$9.99 M', value: 9998096.617511926 },
              gas: { displayValue: '48.61 B', value: 48612575812 },
            },
            blobs: {
              ethCost: { displayValue: '~Ξ0.00', value: 2.964848639999887e-9 },
              usdCost: {
                displayValue: '~$0.00',
                value: 0.000010376958807166133,
              },
              gas: { displayValue: '2.75 B', value: 2759589888 },
            },
            calldata: {
              ethCost: { displayValue: 'Ξ2.32 K', value: 2329.444916428333 },
              usdCost: { displayValue: '$8.49 M', value: 8494932.290272178 },
              gas: { displayValue: '38.69 B', value: 38693337804 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ378', value: 378.79762290658005 },
              usdCost: { displayValue: '$1.37 M', value: 1378896.6127563526 },
              gas: { displayValue: '6.55 B', value: 6554764120 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ34.17', value: 34.17141110323093 },
              usdCost: { displayValue: '$124 K', value: 124267.71447303078 },
              gas: { displayValue: '604 M', value: 604884000 },
            },
          },
          last90d: {
            total: {
              ethCost: { displayValue: 'Ξ6.98 K', value: 6988.044622975213 },
              usdCost: { displayValue: '$20.64 M', value: 20642060.554227494 },
              gas: { displayValue: '207 B', value: 207562951125 },
            },
            blobs: {
              ethCost: { displayValue: '~Ξ0.00', value: 2.964848639999887e-9 },
              usdCost: {
                displayValue: '~$0.00',
                value: 0.000010376958807166133,
              },
              gas: { displayValue: '2.75 B', value: 2759589888 },
            },
            calldata: {
              ethCost: { displayValue: 'Ξ5.96 K', value: 5966.553300814135 },
              usdCost: { displayValue: '$17.61 M', value: 17612937.803413756 },
              gas: { displayValue: '174 B', value: 174870397804 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ937', value: 937.9563746022058 },
              usdCost: { displayValue: '$2.78 M', value: 2781102.0373568847 },
              gas: { displayValue: '27.48 B', value: 27480604433 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ83.53', value: 83.5349475559581 },
              usdCost: { displayValue: '$248 K', value: 248020.71344651998 },
              gas: { displayValue: '2.45 B', value: 2452359000 },
            },
          },
        },
      },
      {
        name: 'OP Mainnet',
        shortName: undefined,
        slug: 'optimism',
        warning:
          'Fraud proof system is currently under development. Users need to trust block Proposer to submit correct L1 state roots.',
        redWarning: undefined,
        showProjectUnderReview: false,
        costs: {
          last24h: {
            total: {
              ethCost: { displayValue: 'Ξ0.2528', value: 0.25275755304437314 },
              usdCost: { displayValue: '$915', value: 915.773408288345 },
              gas: { displayValue: '245 M', value: 245929608 },
            },
            blobs: {
              ethCost: { displayValue: '~Ξ0.00', value: 4.34896896000003e-10 },
              usdCost: {
                displayValue: '~$0.00',
                value: 0.0000015834109694705675,
              },
              gas: { displayValue: '237 M', value: 237502464 },
            },
            calldata: {
              ethCost: { displayValue: 'Ξ0.001', value: 0.000979726865476224 },
              usdCost: { displayValue: '$3.54', value: 3.548247908124698 },
              gas: { displayValue: '34.46 K', value: 34464 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ0.044', value: 0.04397010565075392 },
              usdCost: { displayValue: '$159', value: 159.24589905323785 },
              gas: { displayValue: '1.54 M', value: 1546680 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ0.2078', value: 0.207807720093246 },
              usdCost: { displayValue: '$752', value: 752.9792597435717 },
              gas: { displayValue: '6.84 M', value: 6846000 },
            },
          },
          last7d: {
            total: {
              ethCost: { displayValue: 'Ξ1.31', value: 1.3157559673271022 },
              usdCost: { displayValue: '$4.52 K', value: 4520.464894915036 },
              gas: { displayValue: '1.21 B', value: 1219969063 },
            },
            blobs: {
              ethCost: { displayValue: '~Ξ0.00', value: 1.3711441920000172e-9 },
              usdCost: {
                displayValue: '~$0.00',
                value: 0.000004762301865472833,
              },
              gas: { displayValue: '1.17 B', value: 1173749760 },
            },
            calldata: {
              ethCost: { displayValue: 'Ξ0.0064', value: 0.006372824040940671 },
              usdCost: { displayValue: '$21.80', value: 21.809278716327487 },
              gas: { displayValue: '239 K', value: 239988 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ0.2857', value: 0.2857441590306716 },
              usdCost: { displayValue: '$977', value: 977.906771087875 },
              gas: { displayValue: '10.76 M', value: 10762315 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ1.02', value: 1.0236389828843422 },
              usdCost: { displayValue: '$3.52 K', value: 3520.7488403485304 },
              gas: { displayValue: '35.21 M', value: 35217000 },
            },
          },
          last30d: {
            total: {
              ethCost: { displayValue: 'Ξ2.10 K', value: 2106.8361085575016 },
              usdCost: { displayValue: '$7.56 M', value: 7561764.445786604 },
              gas: { displayValue: '35.41 B', value: 35416301131 },
            },
            blobs: {
              ethCost: { displayValue: '~Ξ0.00', value: 2.2528655359999898e-9 },
              usdCost: {
                displayValue: '~$0.00',
                value: 0.00000798251840811829,
              },
              gas: { displayValue: '2.05 B', value: 2054684672 },
            },
            calldata: {
              ethCost: { displayValue: 'Ξ2.07 K', value: 2078.1839194386544 },
              usdCost: { displayValue: '$7.45 M', value: 7458907.413025201 },
              gas: { displayValue: '32.86 B', value: 32868653148 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ2.21', value: 2.2169494193274586 },
              usdCost: { displayValue: '$8.04 K', value: 8047.177283386356 },
              gas: { displayValue: '46.33 M', value: 46335311 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ26.43', value: 26.435239697256048 },
              usdCost: { displayValue: '$94.80 K', value: 94809.85547005475 },
              gas: { displayValue: '446 M', value: 446628000 },
            },
          },
          last90d: {
            total: {
              ethCost: { displayValue: 'Ξ4.84 K', value: 4845.464929718462 },
              usdCost: { displayValue: '$14.51 M', value: 14519677.92271622 },
              gas: { displayValue: '134 B', value: 134506670927 },
            },
            blobs: {
              ethCost: { displayValue: '~Ξ0.00', value: 2.2528655359999898e-9 },
              usdCost: {
                displayValue: '~$0.00',
                value: 0.00000798251840811829,
              },
              gas: { displayValue: '2.05 B', value: 2054684672 },
            },
            calldata: {
              ethCost: { displayValue: 'Ξ4.78 K', value: 4782.86557687496 },
              usdCost: { displayValue: '$14.33 M', value: 14330640.996168807 },
              gas: { displayValue: '130 B', value: 130725514264 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ4.68', value: 4.687670819120225 },
              usdCost: { displayValue: '$14.28 K', value: 14281.079439963662 },
              gas: { displayValue: '139 M', value: 139102991 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ57.91', value: 57.91168202205722 },
              usdCost: { displayValue: '$174 K', value: 174755.84709941185 },
              gas: { displayValue: '1.58 B', value: 1587369000 },
            },
          },
        },
      },
      {
        name: 'Base',
        shortName: undefined,
        slug: 'base',
        warning:
          'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
        redWarning: undefined,
        showProjectUnderReview: false,
        costs: {
          last24h: {
            total: {
              ethCost: { displayValue: 'Ξ0.2695', value: 0.2695071943155954 },
              usdCost: { displayValue: '$976', value: 976.4752595724514 },
              gas: { displayValue: '255 M', value: 255418760 },
            },
            blobs: {
              ethCost: {
                displayValue: '~Ξ0.00',
                value: 4.2677043200000244e-10,
              },
              usdCost: {
                displayValue: '~$0.00',
                value: 0.0000015532885838528512,
              },
              gas: { displayValue: '246 M', value: 246677504 },
            },
            calldata: {
              ethCost: {
                displayValue: 'Ξ0.0011',
                value: 0.0010654093244247482,
              },
              usdCost: { displayValue: '$3.85', value: 3.8584548884152436 },
              gas: { displayValue: '34.12 K', value: 34128 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ0.0483', value: 0.048277772581926254 },
              usdCost: { displayValue: '$174', value: 174.8413551160265 },
              gas: { displayValue: '1.54 M', value: 1546128 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ0.2202', value: 0.2201640119824741 },
              usdCost: { displayValue: '$797', value: 797.7754480147212 },
              gas: { displayValue: '7.16 M', value: 7161000 },
            },
          },
          last7d: {
            total: {
              ethCost: { displayValue: 'Ξ1.73', value: 1.7321390503448406 },
              usdCost: { displayValue: '$5.93 K', value: 5934.102131416168 },
              gas: { displayValue: '1.78 B', value: 1786432504 },
            },
            blobs: {
              ethCost: { displayValue: '~Ξ0.00', value: 1.9065733120000396e-9 },
              usdCost: {
                displayValue: '~$0.00',
                value: 0.0000065708616474951835,
              },
              gas: { displayValue: '1.72 B', value: 1724907520 },
            },
            calldata: {
              ethCost: { displayValue: 'Ξ0.0066', value: 0.006570050396594615 },
              usdCost: { displayValue: '$22.52', value: 22.52522239795001 },
              gas: { displayValue: '239 K', value: 239088 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ0.2974', value: 0.29740134919334227 },
              usdCost: { displayValue: '$1.01 K', value: 1019.6357173703843 },
              gas: { displayValue: '10.82 M', value: 10822896 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ1.42', value: 1.4281676488483326 },
              usdCost: { displayValue: '$4.89 K', value: 4891.94118507697 },
              gas: { displayValue: '50.46 M', value: 50463000 },
            },
          },
          last30d: {
            total: {
              ethCost: { displayValue: 'Ξ1.28 K', value: 1285.1414373480686 },
              usdCost: { displayValue: '$4.70 M', value: 4708495.18778189 },
              gas: { displayValue: '24.06 B', value: 24066130292 },
            },
            blobs: {
              ethCost: { displayValue: '~Ξ0.00', value: 3.1056199679998586e-9 },
              usdCost: {
                displayValue: '~$0.00',
                value: 0.000010951260656566246,
              },
              gas: { displayValue: '2.92 B', value: 2922381312 },
            },
            calldata: {
              ethCost: { displayValue: 'Ξ1.25 K', value: 1255.4551566736604 },
              usdCost: { displayValue: '$4.60 M', value: 4602341.051667825 },
              gas: { displayValue: '20.60 B', value: 20605713140 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ2.23', value: 2.230884173524427 },
              usdCost: { displayValue: '$8.10 K', value: 8103.670484314411 },
              gas: { displayValue: '46.38 M', value: 46383840 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ27.45', value: 27.45539649777938 },
              usdCost: { displayValue: '$98.05 K', value: 98050.46561878565 },
              gas: { displayValue: '491 M', value: 491652000 },
            },
          },
          last90d: {
            total: {
              ethCost: { displayValue: 'Ξ3.12 K', value: 3123.990312942304 },
              usdCost: { displayValue: '$9.36 M', value: 9362945.881671974 },
              gas: { displayValue: '92.55 B', value: 92554452724 },
            },
            blobs: {
              ethCost: { displayValue: '~Ξ0.00', value: 3.1056199679998586e-9 },
              usdCost: {
                displayValue: '~$0.00',
                value: 0.000010951260656566246,
              },
              gas: { displayValue: '2.92 B', value: 2922381312 },
            },
            calldata: {
              ethCost: { displayValue: 'Ξ3.04 K', value: 3042.9125763271004 },
              usdCost: { displayValue: '$9.12 M', value: 9127453.583840141 },
              gas: { displayValue: '87.17 B', value: 87170676892 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ4.60', value: 4.60164889784807 },
              usdCost: { displayValue: '$14.07 K', value: 14079.434738005739 },
              gas: { displayValue: '139 M', value: 139151520 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ76.47', value: 76.47608771423717 },
              usdCost: { displayValue: '$221 K', value: 221412.86308296965 },
              gas: { displayValue: '2.32 B', value: 2322243000 },
            },
          },
        },
      },
      {
        name: 'Blast',
        shortName: undefined,
        slug: 'blast',
        warning:
          'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
        redWarning: undefined,
        showProjectUnderReview: false,
        costs: {
          last24h: {
            total: {
              ethCost: { displayValue: 'Ξ30.88', value: 30.882659592633114 },
              usdCost: { displayValue: '$111 K', value: 111872.7874826193 },
              gas: { displayValue: '1.07 B', value: 1077586195 },
            },
            blobs: undefined,
            calldata: {
              ethCost: { displayValue: 'Ξ30.42', value: 30.429089118303658 },
              usdCost: { displayValue: '$110 K', value: 110229.66935644238 },
              gas: { displayValue: '1.06 B', value: 1061794728 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ0.0423', value: 0.04231197315036129 },
              usdCost: { displayValue: '$153', value: 153.3418930914199 },
              gas: { displayValue: '1.53 M', value: 1532467 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ0.4113', value: 0.41125850117912754 },
              usdCost: { displayValue: '$1.48 K', value: 1489.776233085478 },
              gas: { displayValue: '14.25 M', value: 14259000 },
            },
          },
          last7d: {
            total: {
              ethCost: { displayValue: 'Ξ156', value: 156.46247613284083 },
              usdCost: { displayValue: '$538 K', value: 538534.1635370344 },
              gas: { displayValue: '5.95 B', value: 5951861135 },
            },
            blobs: undefined,
            calldata: {
              ethCost: { displayValue: 'Ξ153', value: 153.9040178651673 },
              usdCost: { displayValue: '$529 K', value: 529746.0370280485 },
              gas: { displayValue: '5.85 B', value: 5855390092 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ0.2888', value: 0.28878415236614347 },
              usdCost: { displayValue: '$988', value: 988.411342947225 },
              gas: { displayValue: '11.12 M', value: 11127043 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ2.26', value: 2.269674115307293 },
              usdCost: { displayValue: '$7.79 K', value: 7799.715166039953 },
              gas: { displayValue: '85.34 M', value: 85344000 },
            },
          },
          last30d: {
            total: {
              ethCost: { displayValue: 'Ξ1.10 K', value: 1101.1614386781007 },
              usdCost: { displayValue: '$3.98 M', value: 3981019.151511297 },
              gas: { displayValue: '22.34 B', value: 22349185439 },
            },
            blobs: undefined,
            calldata: {
              ethCost: { displayValue: 'Ξ1.08 K', value: 1080.5530876840073 },
              usdCost: { displayValue: '$3.90 M', value: 3906669.9047709703 },
              gas: { displayValue: '21.92 B', value: 21929180188 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ2.30', value: 2.3087062004193877 },
              usdCost: { displayValue: '$8.38 K', value: 8380.8800531164 },
              gas: { displayValue: '47.90 M', value: 47906251 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ18.29', value: 18.299644793669362 },
              usdCost: { displayValue: '$65.96 K', value: 65968.36668720182 },
              gas: { displayValue: '372 M', value: 372099000 },
            },
          },
          last90d: {
            total: {
              ethCost: { displayValue: 'Ξ1.10 K', value: 1101.999271059059 },
              usdCost: { displayValue: '$3.98 M', value: 3983554.5557318777 },
              gas: { displayValue: '22.38 B', value: 22381562729 },
            },
            blobs: undefined,
            calldata: {
              ethCost: { displayValue: 'Ξ1.08 K', value: 1081.1872881683132 },
              usdCost: { displayValue: '$3.90 M', value: 3908587.9737854875 },
              gas: { displayValue: '21.95 B', value: 21953892836 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ2.34', value: 2.3437728516103173 },
              usdCost: { displayValue: '$8.48 K', value: 8487.0858207546 },
              gas: { displayValue: '49.18 M', value: 49186893 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ18.46', value: 18.46821003913108 },
              usdCost: { displayValue: '$66.47 K', value: 66479.49612562747 },
              gas: { displayValue: '378 M', value: 378483000 },
            },
          },
        },
      },
      {
        name: 'zkSync Era',
        shortName: undefined,
        slug: 'zksync-era',
        warning:
          'Withdrawals are delayed by 21h. The length of the delay can be arbitrarily set by a MultiSig.',
        redWarning: undefined,
        showProjectUnderReview: false,
        costs: {
          last24h: {
            total: {
              ethCost: { displayValue: 'Ξ6.62', value: 6.625603316723645 },
              usdCost: { displayValue: '$24.02 K', value: 24028.127505383956 },
              gas: { displayValue: '197 M', value: 197734251 },
            },
            blobs: undefined,
            calldata: {
              ethCost: { displayValue: 'Ξ0.3861', value: 0.38605336262638545 },
              usdCost: { displayValue: '$1.40 K', value: 1400.0005492125308 },
              gas: { displayValue: '11.21 M', value: 11211260 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ5.97', value: 5.9703363840029535 },
              usdCost: { displayValue: '$21.65 K', value: 21651.845748890923 },
              gas: { displayValue: '178 M', value: 178794991 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ0.2692', value: 0.2692135700942939 },
              usdCost: { displayValue: '$976', value: 976.2812072804995 },
              gas: { displayValue: '7.72 M', value: 7728000 },
            },
          },
          last7d: {
            total: {
              ethCost: { displayValue: 'Ξ36.81', value: 36.81118722079296 },
              usdCost: { displayValue: '$126 K', value: 126145.74253215043 },
              gas: { displayValue: '1.34 B', value: 1344638215 },
            },
            blobs: undefined,
            calldata: {
              ethCost: { displayValue: 'Ξ2.11', value: 2.1137479795647836 },
              usdCost: { displayValue: '$7.24 K', value: 7243.169072644044 },
              gas: { displayValue: '75.83 M', value: 75831760 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ33.24', value: 33.24898938296048 },
              usdCost: { displayValue: '$113 K', value: 113938.9941282001 },
              gas: { displayValue: '1.21 B', value: 1217020455 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ1.44', value: 1.448449858267564 },
              usdCost: { displayValue: '$4.96 K', value: 4963.579331305986 },
              gas: { displayValue: '51.78 M', value: 51786000 },
            },
          },
          last30d: {
            total: {
              ethCost: { displayValue: 'Ξ1.64 K', value: 1644.336454310152 },
              usdCost: { displayValue: '$5.81 M', value: 5812171.569461779 },
              gas: { displayValue: '29.54 B', value: 29543105405 },
            },
            blobs: undefined,
            calldata: {
              ethCost: { displayValue: 'Ξ1.00 K', value: 1008.6429830851134 },
              usdCost: { displayValue: '$3.54 M', value: 3546306.9587443206 },
              gas: { displayValue: '17.66 B', value: 17660197860 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ600', value: 600.4582480990172 },
              usdCost: { displayValue: '$2.14 M', value: 2140371.7054853872 },
              gas: { displayValue: '11.24 B', value: 11240118545 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ35.23', value: 35.23522312602217 },
              usdCost: { displayValue: '$125 K', value: 125492.90523208423 },
              gas: { displayValue: '642 M', value: 642789000 },
            },
          },
          last90d: {
            total: {
              ethCost: { displayValue: 'Ξ5.78 K', value: 5780.460154399062 },
              usdCost: { displayValue: '$16.24 M', value: 16243813.666832006 },
              gas: { displayValue: '172 B', value: 172379728571 },
            },
            blobs: undefined,
            calldata: {
              ethCost: { displayValue: 'Ξ3.62 K', value: 3624.745750990695 },
              usdCost: { displayValue: '$10.17 M', value: 10179375.514509466 },
              gas: { displayValue: '107 B', value: 107726838520 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ2.03 K', value: 2033.1950302149075 },
              usdCost: { displayValue: '$5.72 M', value: 5720560.218580714 },
              gas: { displayValue: '60.98 B', value: 60986227051 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ122', value: 122.51937319341691 },
              usdCost: { displayValue: '$343 K', value: 343877.933741878 },
              gas: { displayValue: '3.66 B', value: 3666663000 },
            },
          },
        },
      },
      {
        name: 'Linea',
        shortName: undefined,
        slug: 'linea',
        warning: 'The circuit of the program being proven is not public.',
        redWarning: undefined,
        showProjectUnderReview: true,
        costs: {
          last24h: {
            total: {
              ethCost: { displayValue: 'Ξ5.31', value: 5.319567656267581 },
              usdCost: { displayValue: '$19.20 K', value: 19201.101951758505 },
              gas: { displayValue: '213 M', value: 213348983 },
            },
            blobs: undefined,
            calldata: {
              ethCost: { displayValue: 'Ξ3.66', value: 3.6610871533267564 },
              usdCost: { displayValue: '$13.20 K', value: 13207.212311727471 },
              gas: { displayValue: '146 M', value: 146259296 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ1.60', value: 1.6073752426231538 },
              usdCost: { displayValue: '$5.80 K', value: 5809.037082066044 },
              gas: { displayValue: '65.01 M', value: 65010687 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ0.0511', value: 0.051105260317670986 },
              usdCost: { displayValue: '$184', value: 184.85255796499163 },
              gas: { displayValue: '2.07 M', value: 2079000 },
            },
          },
          last7d: {
            total: {
              ethCost: { displayValue: 'Ξ341', value: 341.60420570743634 },
              usdCost: { displayValue: '$1.15 M', value: 1157732.91099791 },
              gas: { displayValue: '13.10 B', value: 13100616562 },
            },
            blobs: undefined,
            calldata: {
              ethCost: { displayValue: 'Ξ243', value: 243.00947827648466 },
              usdCost: { displayValue: '$823 K', value: 823544.8394781338 },
              gas: { displayValue: '9.31 B', value: 9311436704 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ95.71', value: 95.71684657811973 },
              usdCost: { displayValue: '$324 K', value: 324432.5065115751 },
              gas: { displayValue: '3.67 B', value: 3678341858 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ2.87', value: 2.877880852832485 },
              usdCost: { displayValue: '$9.75 K', value: 9755.56500819594 },
              gas: { displayValue: '110 M', value: 110838000 },
            },
          },
          last30d: {
            total: {
              ethCost: { displayValue: 'Ξ1.72 K', value: 1727.998800285904 },
              usdCost: { displayValue: '$6.25 M', value: 6256468.549697821 },
              gas: { displayValue: '43.53 B', value: 43539722549 },
            },
            blobs: undefined,
            calldata: {
              ethCost: { displayValue: 'Ξ1.22 K', value: 1229.0041127537727 },
              usdCost: { displayValue: '$4.44 M', value: 4449678.697564592 },
              gas: { displayValue: '30.95 B', value: 30959929452 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ484', value: 484.45971389585634 },
              usdCost: { displayValue: '$1.75 M', value: 1754157.438010172 },
              gas: { displayValue: '12.21 B', value: 12212965097 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ14.53', value: 14.53497363626811 },
              usdCost: { displayValue: '$52.63 K', value: 52632.414123069226 },
              gas: { displayValue: '366 M', value: 366828000 },
            },
          },
          last90d: {
            total: {
              ethCost: { displayValue: 'Ξ4.15 K', value: 4151.6828292965065 },
              usdCost: { displayValue: '$12.07 M', value: 12073676.062534323 },
              gas: { displayValue: '151 B', value: 151164929508 },
            },
            blobs: undefined,
            calldata: {
              ethCost: { displayValue: 'Ξ2.60 K', value: 2601.1280945785984 },
              usdCost: { displayValue: '$7.76 M', value: 7766483.640358271 },
              gas: { displayValue: '91.70 B', value: 91704690948 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ1.49 K', value: 1493.740068088475 },
              usdCost: { displayValue: '$4.15 M', value: 4155070.2305742586 },
              gas: { displayValue: '57.20 B', value: 57209521560 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ56.81', value: 56.81466662941037 },
              usdCost: { displayValue: '$152 K', value: 152122.19160182544 },
              gas: { displayValue: '2.25 B', value: 2250717000 },
            },
          },
        },
      },
      {
        name: 'dYdX v3',
        shortName: undefined,
        slug: 'dydx',
        warning:
          'This page describes dYdX v3, which is an L2 built on Ethereum. Recently deployed dYdX v4 is a separate blockchain based on Cosmos SDK, unrelated to Ethereum and is using different technology. No information on this page applies to dYdX v4.',
        redWarning: undefined,
        showProjectUnderReview: false,
        costs: {
          last24h: {
            total: {
              ethCost: { displayValue: 'Ξ0.4446', value: 0.4446019070349197 },
              usdCost: { displayValue: '$1.61 K', value: 1613.237046867805 },
              gas: { displayValue: '16.67 M', value: 16675438 },
            },
            blobs: undefined,
            calldata: {
              ethCost: { displayValue: 'Ξ0.0717', value: 0.07167096222102227 },
              usdCost: { displayValue: '$260', value: 260.0539294341415 },
              gas: { displayValue: '2.69 M', value: 2693016 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ0.3639', value: 0.3639481067612335 },
              usdCost: { displayValue: '$1.32 K', value: 1320.5865752384054 },
              gas: { displayValue: '13.64 M', value: 13646422 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ0.009', value: 0.008982838052664002 },
              usdCost: { displayValue: '$32.59', value: 32.59654219525815 },
              gas: { displayValue: '336 K', value: 336000 },
            },
          },
          last7d: {
            total: {
              ethCost: { displayValue: 'Ξ4.49', value: 4.4995357532286215 },
              usdCost: { displayValue: '$15.30 K', value: 15300.111635952422 },
              gas: { displayValue: '154 M', value: 154528481 },
            },
            blobs: undefined,
            calldata: {
              ethCost: { displayValue: 'Ξ0.7273', value: 0.7272714830017203 },
              usdCost: { displayValue: '$2.47 K', value: 2472.954062815269 },
              gas: { displayValue: '24.96 M', value: 24965016 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ3.68', value: 3.680369405912192 },
              usdCost: { displayValue: '$12.51 K', value: 12514.78702023615 },
              gas: { displayValue: '126 M', value: 126413465 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ0.0919', value: 0.09189486431470793 },
              usdCost: { displayValue: '$312', value: 312.37055290100227 },
              gas: { displayValue: '3.15 M', value: 3150000 },
            },
          },
          last30d: {
            total: {
              ethCost: { displayValue: 'Ξ51.16', value: 51.16357306737139 },
              usdCost: { displayValue: '$184 K', value: 184871.5741613868 },
              gas: { displayValue: '950 M', value: 950165762 },
            },
            blobs: undefined,
            calldata: {
              ethCost: { displayValue: 'Ξ8.21', value: 8.213651292102314 },
              usdCost: { displayValue: '$29.67 K', value: 29677.90582536962 },
              gas: { displayValue: '152 M', value: 152552012 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ41.90', value: 41.90492627343362 },
              usdCost: { displayValue: '$151 K', value: 151418.1735630251 },
              gas: { displayValue: '778 M', value: 778209750 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ1.04', value: 1.0449955018354966 },
              usdCost: { displayValue: '$3.77 K', value: 3775.4947729923288 },
              gas: { displayValue: '19.40 M', value: 19404000 },
            },
          },
          last90d: {
            total: {
              ethCost: { displayValue: 'Ξ103', value: 103.90984283961312 },
              usdCost: { displayValue: '$315 K', value: 315668.60246403865 },
              gas: { displayValue: '2.88 B', value: 2880127695 },
            },
            blobs: undefined,
            calldata: {
              ethCost: { displayValue: 'Ξ16.68', value: 16.685500751990464 },
              usdCost: { displayValue: '$50.68 K', value: 50686.76419933903 },
              gas: { displayValue: '462 M', value: 462306456 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ85.08', value: 85.08832333609607 },
              usdCost: { displayValue: '$258 K', value: 258503.2900858317 },
              gas: { displayValue: '2.35 B', value: 2358475239 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ2.13', value: 2.136018751526638 },
              usdCost: { displayValue: '$6.47 K', value: 6478.548178866843 },
              gas: { displayValue: '59.34 M', value: 59346000 },
            },
          },
        },
      },
      {
        name: 'Mode Network',
        shortName: undefined,
        slug: 'mode',
        warning:
          'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
        redWarning: undefined,
        showProjectUnderReview: false,
        costs: {
          last24h: {
            total: {
              ethCost: { displayValue: 'Ξ0.0748', value: 0.07482597378009935 },
              usdCost: { displayValue: '$271', value: 271.2315495114216 },
              gas: { displayValue: '19.71 M', value: 19713922 },
            },
            blobs: {
              ethCost: {
                displayValue: '~Ξ0.00',
                value: 1.7170431999999998e-11,
              },
              usdCost: { displayValue: '~$0.00', value: 6.223421083484161e-8 },
              gas: { displayValue: '17.17 M', value: 17170432 },
            },
            calldata: {
              ethCost: {
                displayValue: 'Ξ0.0009',
                value: 0.0009429059891715719,
              },
              usdCost: { displayValue: '$3.41', value: 3.418756679277777 },
              gas: { displayValue: '32.78 K', value: 32784 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ0.0426', value: 0.04261516510238135 },
              usdCost: { displayValue: '$154', value: 154.51261719781758 },
              gas: { displayValue: '1.48 M', value: 1481706 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ0.0313', value: 0.031267902671376004 },
              usdCost: { displayValue: '$113', value: 113.30017557209196 },
              gas: { displayValue: '1.02 M', value: 1029000 },
            },
          },
          last7d: {
            total: {
              ethCost: { displayValue: 'Ξ0.4975', value: 0.49750805726749814 },
              usdCost: { displayValue: '$1.70 K', value: 1704.1175701917925 },
              gas: { displayValue: '130 M', value: 130766360 },
            },
            blobs: {
              ethCost: {
                displayValue: '~Ξ0.00',
                value: 1.1429478400000006e-10,
              },
              usdCost: { displayValue: '~$0.00', value: 3.91149204393165e-7 },
              gas: { displayValue: '112 M', value: 112590848 },
            },
            calldata: {
              ethCost: { displayValue: 'Ξ0.0064', value: 0.006363823394694407 },
              usdCost: { displayValue: '$21.79', value: 21.799187648348624 },
              gas: { displayValue: '236 K', value: 236460 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ0.2878', value: 0.28778141539734486 },
              usdCost: { displayValue: '$985', value: 985.7977266890298 },
              gas: { displayValue: '10.69 M', value: 10694052 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ0.2034', value: 0.20336281836116385 },
              usdCost: { displayValue: '$696', value: 696.5206554632638 },
              gas: { displayValue: '7.24 M', value: 7245000 },
            },
          },
          last30d: {
            total: {
              ethCost: { displayValue: 'Ξ115', value: 115.68711901714279 },
              usdCost: { displayValue: '$423 K', value: 423986.07363576017 },
              gas: { displayValue: '2.14 B', value: 2147855708 },
            },
            blobs: {
              ethCost: {
                displayValue: '~Ξ0.00',
                value: 2.0211302400000142e-10,
              },
              usdCost: { displayValue: '~$0.00', value: 7.105970262900736e-7 },
              gas: { displayValue: '199 M', value: 199622656 },
            },
            calldata: {
              ethCost: { displayValue: 'Ξ108', value: 108.8915300768265 },
              usdCost: { displayValue: '$399 K', value: 399232.4565960206 },
              gas: { displayValue: '1.82 B', value: 1822556056 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ2.31', value: 2.3195227866661163 },
              usdCost: { displayValue: '$8.42 K', value: 8421.345371836345 },
              gas: { displayValue: '46.25 M', value: 46254996 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ4.47', value: 4.476066153447931 },
              usdCost: { displayValue: '$16.33 K', value: 16332.271667193092 },
              gas: { displayValue: '79.42 M', value: 79422000 },
            },
          },
          last90d: {
            total: {
              ethCost: { displayValue: 'Ξ316', value: 316.8873021730914 },
              usdCost: { displayValue: '$942 K', value: 942712.6911463815 },
              gas: { displayValue: '8.89 B', value: 8896966440 },
            },
            blobs: {
              ethCost: {
                displayValue: '~Ξ0.00',
                value: 2.0211302400000142e-10,
              },
              usdCost: { displayValue: '~$0.00', value: 7.105970262900736e-7 },
              gas: { displayValue: '199 M', value: 199622656 },
            },
            calldata: {
              ethCost: { displayValue: 'Ξ301', value: 301.05428590122835 },
              usdCost: { displayValue: '$895 K', value: 895216.281231677 },
              gas: { displayValue: '8.24 B', value: 8241284108 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ4.92', value: 4.924019063036948 },
              usdCost: { displayValue: '$14.96 K', value: 14967.353660432234 },
              gas: { displayValue: '139 M', value: 139022676 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ10.90', value: 10.908997208623378 },
              usdCost: { displayValue: '$32.52 K', value: 32529.05625356689 },
              gas: { displayValue: '317 M', value: 317037000 },
            },
          },
        },
      },
      {
        name: 'Polygon zkEVM',
        shortName: undefined,
        slug: 'polygonzkevm',
        warning: 'The forced transaction mechanism is currently disabled.',
        redWarning: undefined,
        showProjectUnderReview: false,
        costs: {
          last24h: {
            total: {
              ethCost: { displayValue: 'Ξ1.95', value: 1.9537949239347674 },
              usdCost: { displayValue: '$7.08 K', value: 7084.759596813894 },
              gas: { displayValue: '69.96 M', value: 69965802 },
            },
            blobs: undefined,
            calldata: {
              ethCost: { displayValue: 'Ξ1.09', value: 1.0957017685512753 },
              usdCost: { displayValue: '$3.97 K', value: 3974.788299175492 },
              gas: { displayValue: '38.85 M', value: 38854092 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ0.7978', value: 0.7978388417286909 },
              usdCost: { displayValue: '$2.89 K', value: 2891.623071608078 },
              gas: { displayValue: '28.94 M', value: 28948710 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ0.0603', value: 0.06025431365480101 },
              usdCost: { displayValue: '$218', value: 218.34822603032637 },
              gas: { displayValue: '2.16 M', value: 2163000 },
            },
          },
          last7d: {
            total: {
              ethCost: { displayValue: 'Ξ13.64', value: 13.648302592433778 },
              usdCost: { displayValue: '$46.72 K', value: 46726.10976690554 },
              gas: { displayValue: '510 M', value: 510020239 },
            },
            blobs: undefined,
            calldata: {
              ethCost: { displayValue: 'Ξ8.30', value: 8.305330964276898 },
              usdCost: { displayValue: '$28.40 K', value: 28403.707782092984 },
              gas: { displayValue: '314 M', value: 314061504 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ4.97', value: 4.974502546048759 },
              usdCost: { displayValue: '$17.05 K', value: 17058.540359573744 },
              gas: { displayValue: '182 M', value: 182455735 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ0.3685', value: 0.36846908210813384 },
              usdCost: { displayValue: '$1.26 K', value: 1263.8616252388415 },
              gas: { displayValue: '13.50 M', value: 13503000 },
            },
          },
          last30d: {
            total: {
              ethCost: { displayValue: 'Ξ105', value: 105.78913019007359 },
              usdCost: { displayValue: '$381 K', value: 381932.1241570083 },
              gas: { displayValue: '2.15 B', value: 2156867379 },
            },
            blobs: undefined,
            calldata: {
              ethCost: { displayValue: 'Ξ63.25', value: 63.259136587095824 },
              usdCost: { displayValue: '$226 K', value: 226884.62071816553 },
              gas: { displayValue: '1.30 B', value: 1309989092 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ39.51', value: 39.51159250495063 },
              usdCost: { displayValue: '$144 K', value: 144027.37479746787 },
              gas: { displayValue: '787 M', value: 787196287 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ3.01', value: 3.0184010980273754 },
              usdCost: { displayValue: '$11.02 K', value: 11020.128641375499 },
              gas: { displayValue: '59.68 M', value: 59682000 },
            },
          },
          last90d: {
            total: {
              ethCost: { displayValue: 'Ξ373', value: 373.3467817891582 },
              usdCost: { displayValue: '$1.04 M', value: 1042030.9127547563 },
              gas: { displayValue: '12.91 B', value: 12913633175 },
            },
            blobs: undefined,
            calldata: {
              ethCost: { displayValue: 'Ξ242', value: 242.52484643197533 },
              usdCost: { displayValue: '$670 K', value: 670024.8003783195 },
              gas: { displayValue: '8.59 B', value: 8593252168 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ123', value: 123.26629344051845 },
              usdCost: { displayValue: '$349 K', value: 349768.05896389286 },
              gas: { displayValue: '4.08 B', value: 4081317007 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ7.55', value: 7.555641916665121 },
              usdCost: { displayValue: '$22.23 K', value: 22238.053412550384 },
              gas: { displayValue: '239 M', value: 239064000 },
            },
          },
        },
      },
      {
        name: 'Scroll',
        shortName: undefined,
        slug: 'scroll',
        warning: undefined,
        redWarning: undefined,
        showProjectUnderReview: false,
        costs: {
          last24h: {
            total: {
              ethCost: { displayValue: 'Ξ96.13', value: 96.13748147655 },
              usdCost: { displayValue: '$348 K', value: 348418.95231676614 },
              gas: { displayValue: '3.42 B', value: 3428793991 },
            },
            blobs: undefined,
            calldata: {
              ethCost: { displayValue: 'Ξ52.80', value: 52.803843313281845 },
              usdCost: { displayValue: '$191 K', value: 191365.22211835 },
              gas: { displayValue: '1.84 B', value: 1841308436 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ39.94', value: 39.941243360920716 },
              usdCost: { displayValue: '$144 K', value: 144762.5353787258 },
              gas: { displayValue: '1.44 B', value: 1449935555 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ3.39', value: 3.392394802347465 },
              usdCost: { displayValue: '$12.29 K', value: 12291.194819690238 },
              gas: { displayValue: '137 M', value: 137550000 },
            },
          },
          last7d: {
            total: {
              ethCost: { displayValue: 'Ξ517', value: 517.6246315678333 },
              usdCost: { displayValue: '$1.77 M', value: 1779970.011766583 },
              gas: { displayValue: '20.23 B', value: 20238786898 },
            },
            blobs: undefined,
            calldata: {
              ethCost: { displayValue: 'Ξ307', value: 307.8829833622568 },
              usdCost: { displayValue: '$1.05 M', value: 1057849.1971216248 },
              gas: { displayValue: '12.05 B', value: 12051492704 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ195', value: 195.67178589770572 },
              usdCost: { displayValue: '$673 K', value: 673579.5230269225 },
              gas: { displayValue: '7.62 B', value: 7627182194 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ14.06', value: 14.069862307872118 },
              usdCost: { displayValue: '$48.54 K', value: 48541.291618033465 },
              gas: { displayValue: '560 M', value: 560112000 },
            },
          },
          last30d: {
            total: {
              ethCost: { displayValue: 'Ξ2.56 K', value: 2566.0446917649588 },
              usdCost: { displayValue: '$9.15 M', value: 9159661.117744658 },
              gas: { displayValue: '61.30 B', value: 61303004203 },
            },
            blobs: undefined,
            calldata: {
              ethCost: { displayValue: 'Ξ1.52 K', value: 1526.0368120161916 },
              usdCost: { displayValue: '$5.44 M', value: 5445130.473236361 },
              gas: { displayValue: '36.72 B', value: 36725848016 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ973', value: 973.3156149431762 },
              usdCost: { displayValue: '$3.47 M', value: 3476356.2530013053 },
              gas: { displayValue: '22.97 B', value: 22971895187 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ66.69', value: 66.69226480556773 },
              usdCost: { displayValue: '$238 K', value: 238174.3915069237 },
              gas: { displayValue: '1.60 B', value: 1605261000 },
            },
          },
          last90d: {
            total: {
              ethCost: { displayValue: 'Ξ4.56 K', value: 4564.302701954274 },
              usdCost: { displayValue: '$14.35 M', value: 14355083.915518576 },
              gas: { displayValue: '140 B', value: 140722097074 },
            },
            blobs: undefined,
            calldata: {
              ethCost: { displayValue: 'Ξ2.73 K', value: 2737.2717388307233 },
              usdCost: { displayValue: '$8.59 M', value: 8593185.11495544 },
              gas: { displayValue: '85.39 B', value: 85395244708 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ1.71 K', value: 1711.4097576568802 },
              usdCost: { displayValue: '$5.39 M', value: 5396278.007071936 },
              gas: { displayValue: '51.79 B', value: 51799986366 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ115', value: 115.62120546674363 },
              usdCost: { displayValue: '$365 K', value: 365620.79349081044 },
              gas: { displayValue: '3.52 B', value: 3526866000 },
            },
          },
        },
      },
      {
        name: 'Loopring',
        shortName: undefined,
        slug: 'loopring',
        warning: undefined,
        redWarning: undefined,
        showProjectUnderReview: false,
        costs: {
          last24h: {
            total: {
              ethCost: { displayValue: 'Ξ0.4327', value: 0.4327190035455428 },
              usdCost: { displayValue: '$1.56 K', value: 1569.6255714842048 },
              gas: { displayValue: '14.59 M', value: 14595245 },
            },
            blobs: undefined,
            calldata: {
              ethCost: { displayValue: 'Ξ0.0596', value: 0.05961828115967179 },
              usdCost: { displayValue: '$216', value: 216.07300235788864 },
              gas: { displayValue: '1.87 M', value: 1872684 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ0.3565', value: 0.35646476179067993 },
              usdCost: { displayValue: '$1.29 K', value: 1293.1894031322352 },
              gas: { displayValue: '12.13 M', value: 12134561 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ0.0166', value: 0.016635960595191 },
              usdCost: { displayValue: '$60.36', value: 60.36316599408082 },
              gas: { displayValue: '588 K', value: 588000 },
            },
          },
          last7d: {
            total: {
              ethCost: { displayValue: 'Ξ2.84', value: 2.8438822315739816 },
              usdCost: { displayValue: '$9.73 K', value: 9736.36550701231 },
              gas: { displayValue: '107 M', value: 107818263 },
            },
            blobs: undefined,
            calldata: {
              ethCost: { displayValue: 'Ξ0.4393', value: 0.43929892627048805 },
              usdCost: { displayValue: '$1.49 K', value: 1497.7142315155195 },
              gas: { displayValue: '16.00 M', value: 16007220 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ2.29', value: 2.2993286435546936 },
              usdCost: { displayValue: '$7.87 K', value: 7877.760468861147 },
              gas: { displayValue: '87.77 M', value: 87779043 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ0.1053', value: 0.10525466174880305 },
              usdCost: { displayValue: '$360', value: 360.8908066356399 },
              gas: { displayValue: '4.03 M', value: 4032000 },
            },
          },
          last30d: {
            total: {
              ethCost: { displayValue: 'Ξ26.56', value: 26.5679827048082 },
              usdCost: { displayValue: '$97.04 K', value: 97042.13853969783 },
              gas: { displayValue: '532 M', value: 532979900 },
            },
            blobs: undefined,
            calldata: {
              ethCost: { displayValue: 'Ξ4.84', value: 4.845513894436445 },
              usdCost: { displayValue: '$17.72 K', value: 17722.660625431472 },
              gas: { displayValue: '92.13 M', value: 92134076 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ20.81', value: 20.810225565328135 },
              usdCost: { displayValue: '$75.99 K', value: 75990.87571409524 },
              gas: { displayValue: '422 M', value: 422134824 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ0.9122', value: 0.9122432450435854 },
              usdCost: { displayValue: '$3.32 K', value: 3328.602200171153 },
              gas: { displayValue: '18.71 M', value: 18711000 },
            },
          },
          last90d: {
            total: {
              ethCost: { displayValue: 'Ξ51.52', value: 51.52066876591303 },
              usdCost: { displayValue: '$160 K', value: 160004.48685902788 },
              gas: { displayValue: '1.47 B', value: 1474823308 },
            },
            blobs: undefined,
            calldata: {
              ethCost: { displayValue: 'Ξ8.64', value: 8.645642793002178 },
              usdCost: { displayValue: '$27.28 K', value: 27287.76633976866 },
              gas: { displayValue: '231 M', value: 231743724 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ41.02', value: 41.0277489404032 },
              usdCost: { displayValue: '$127 K', value: 127033.70569304244 },
              gas: { displayValue: '1.18 B', value: 1188962584 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ1.84', value: 1.8472770325075711 },
              usdCost: { displayValue: '$5.68 K', value: 5683.014826216524 },
              gas: { displayValue: '54.11 M', value: 54117000 },
            },
          },
        },
      },
    ],
  },
}
export default meta
type Story = StoryObj<typeof ScalingCostsView>

export const Primary: Story = {}
