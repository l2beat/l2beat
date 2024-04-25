import { Meta, StoryObj } from '@storybook/react'

import { ScalingCostsView } from './ScalingCostsView'

const meta: Meta<typeof ScalingCostsView> = {
  title: 'Pages/Scaling/CostsView',
  component: ScalingCostsView,
  args: {
    items: [
      {
        name: 'Arbitrum One',
        shortName: undefined,
        slug: 'arbitrum',
        showProjectUnderReview: false,
        hasImplementationChanged: true,
        warning:
          'Fraud proof system is fully deployed but is not yet permissionless as it requires Validators to be whitelisted.',
        redWarning: undefined,
        category: 'Optimistic Rollup',
        provider: 'Arbitrum',
        purposes: ['Universal'],
        stage: {
          stage: 'Stage 1',
          missing: {
            nextStage: 'Stage 2',
            requirements: [
              'Fraud proof submission is open only to whitelisted actors.',
              'Upgrades unrelated to on-chain provable bugs provide less than 30d to exit.',
              "The Security Council's actions are not confined to on-chain provable bugs.",
            ],
          },
          summary: [
            {
              stage: 'Stage 0',
              requirements: [
                {
                  satisfied: true,
                  description: 'The project calls itself a rollup.',
                },
                {
                  satisfied: true,
                  description: 'L2 state roots are posted to Ethereum L1.',
                },
                {
                  satisfied: true,
                  description:
                    'Inputs for the state transition function are posted to L1.',
                },
                {
                  satisfied: true,
                  description:
                    'A source-available node exists that can recreate the state from L1 data. Please note that the L2BEAT team has not verified the validity of the node source code. [View code](https://github.com/OffchainLabs/nitro/)',
                },
              ],
            },
            {
              stage: 'Stage 1',
              requirements: [
                {
                  satisfied: true,
                  description:
                    'A complete and functional proof system is deployed.',
                },
                {
                  satisfied: true,
                  description:
                    'There are at least 5 external actors who can submit fraud proofs.',
                },
                {
                  satisfied: true,
                  description:
                    'Users are able to exit without the help of the permissioned operators.',
                },
                {
                  satisfied: true,
                  description:
                    'In case of an unwanted upgrade by actors more centralized than a Security Council, users have at least 7d to exit.',
                },
                {
                  satisfied: true,
                  description: 'The Security Council is properly set up.',
                },
              ],
            },
            {
              stage: 'Stage 2',
              requirements: [
                {
                  satisfied: false,
                  description:
                    'Fraud proof submission is open only to whitelisted actors.',
                },
                {
                  satisfied: false,
                  description:
                    'Upgrades unrelated to on-chain provable bugs provide less than 30d to exit.',
                },
                {
                  satisfied: false,
                  description:
                    "The Security Council's actions are not confined to on-chain provable bugs.",
                },
              ],
            },
          ],
          message: undefined,
        },
        data: {
          last24h: {
            total: {
              ethCost: {
                displayValue: 'Ξ16.14',
                value: 16.15,
                perL2Tx: { value: 0.32299999999999995, displayValue: 'Ξ0.323' },
              },
              usdCost: {
                displayValue: '$451 K',
                value: 451189.77,
                perL2Tx: { value: 9023.7954, displayValue: '$9.02 K' },
              },
              gas: {
                displayValue: '25.28 M',
                value: 25284127.39,
                perL2Tx: { value: 505682.5478, displayValue: '505 K' },
              },
            },
            blobs: {
              ethCost: {
                displayValue: 'Ξ1.47',
                value: 1.47,
                perL2Tx: { value: 0.0294, displayValue: 'Ξ0.0294' },
              },
              usdCost: {
                displayValue: '$41.13 K',
                value: 41139.3,
                perL2Tx: { value: 822.7860000000001, displayValue: '$822' },
              },
              gas: {
                displayValue: '2.30 M',
                value: 2305396.4,
                perL2Tx: { value: 46107.928, displayValue: '46.10 K' },
              },
            },
            calldata: {
              ethCost: {
                displayValue: 'Ξ2.63',
                value: 2.63,
                perL2Tx: { value: 0.0526, displayValue: 'Ξ0.0526' },
              },
              usdCost: {
                displayValue: '$73.40 K',
                value: 73400.76,
                perL2Tx: { value: 1468.0151999999998, displayValue: '$1.46 K' },
              },
              gas: {
                displayValue: '4.11 M',
                value: 4113289.71,
                perL2Tx: { value: 82265.7942, displayValue: '82.26 K' },
              },
            },
            compute: {
              ethCost: {
                displayValue: 'Ξ6.12',
                value: 6.12,
                perL2Tx: {
                  value: 0.12240000000000001,
                  displayValue: 'Ξ0.1224',
                },
              },
              usdCost: {
                displayValue: '$170 K',
                value: 170907.3,
                perL2Tx: { value: 3418.1459999999997, displayValue: '$3.41 K' },
              },
              gas: {
                displayValue: '9.57 M',
                value: 9577437.7,
                perL2Tx: { value: 191548.754, displayValue: '191 K' },
              },
            },
            overhead: {
              ethCost: {
                displayValue: 'Ξ5.93',
                value: 5.93,
                perL2Tx: { value: 0.1186, displayValue: 'Ξ0.1186' },
              },
              usdCost: {
                displayValue: '$165 K',
                value: 165742.41,
                perL2Tx: { value: 3314.8482, displayValue: '$3.31 K' },
              },
              gas: {
                displayValue: '9.28 M',
                value: 9288003.58,
                perL2Tx: { value: 185760.0716, displayValue: '185 K' },
              },
            },
            txCount: { value: 50, displayValue: '50.00' },
          },
          last7d: {
            total: {
              ethCost: {
                displayValue: 'Ξ69.84',
                value: 69.84,
                perL2Tx: {
                  value: 0.19954285714285716,
                  displayValue: 'Ξ0.199543',
                },
              },
              usdCost: {
                displayValue: '$1.60 M',
                value: 1609184.48,
                perL2Tx: { value: 4597.669942857143, displayValue: '$4.59 K' },
              },
              gas: {
                displayValue: '78.66 M',
                value: 78665587.33,
                perL2Tx: { value: 224758.82094285713, displayValue: '224 K' },
              },
            },
            blobs: {
              ethCost: {
                displayValue: 'Ξ12.15',
                value: 12.150000000000002,
                perL2Tx: {
                  value: 0.03471428571428572,
                  displayValue: 'Ξ0.034714',
                },
              },
              usdCost: {
                displayValue: '$284 K',
                value: 284832.2,
                perL2Tx: { value: 813.8062857142858, displayValue: '$813' },
              },
              gas: {
                displayValue: '13.73 M',
                value: 13732762.290000003,
                perL2Tx: { value: 39236.46368571429, displayValue: '39.23 K' },
              },
            },
            calldata: {
              ethCost: {
                displayValue: 'Ξ12.05',
                value: 12.05,
                perL2Tx: {
                  value: 0.03442857142857143,
                  displayValue: 'Ξ0.034429',
                },
              },
              usdCost: {
                displayValue: '$279 K',
                value: 279649.86,
                perL2Tx: { value: 798.9996, displayValue: '$798' },
              },
              gas: {
                displayValue: '13.10 M',
                value: 13100071.669999998,
                perL2Tx: { value: 37428.77619999999, displayValue: '37.42 K' },
              },
            },
            compute: {
              ethCost: {
                displayValue: 'Ξ22.66',
                value: 22.66,
                perL2Tx: {
                  value: 0.06474285714285714,
                  displayValue: 'Ξ0.064743',
                },
              },
              usdCost: {
                displayValue: '$516 K',
                value: 516149.20999999996,
                perL2Tx: { value: 1474.7120285714284, displayValue: '$1.47 K' },
              },
              gas: {
                displayValue: '25.95 M',
                value: 25957368.159999996,
                perL2Tx: { value: 74163.90902857142, displayValue: '74.16 K' },
              },
            },
            overhead: {
              ethCost: {
                displayValue: 'Ξ22.97',
                value: 22.979999999999997,
                perL2Tx: {
                  value: 0.06565714285714284,
                  displayValue: 'Ξ0.065657',
                },
              },
              usdCost: {
                displayValue: '$528 K',
                value: 528553.2100000001,
                perL2Tx: { value: 1510.152028571429, displayValue: '$1.51 K' },
              },
              gas: {
                displayValue: '25.87 M',
                value: 25875385.21,
                perL2Tx: { value: 73929.67202857143, displayValue: '73.92 K' },
              },
            },
            txCount: { value: 350, displayValue: '350' },
          },
          last30d: {
            total: {
              ethCost: {
                displayValue: 'Ξ314',
                value: 314.01,
                perL2Tx: { value: 0.20934, displayValue: 'Ξ0.20934' },
              },
              usdCost: {
                displayValue: '$7.56 M',
                value: 7563616.130000003,
                perL2Tx: { value: 5042.410753333335, displayValue: '$5.04 K' },
              },
              gas: {
                displayValue: '313 M',
                value: 313621390.05,
                perL2Tx: { value: 209080.9267, displayValue: '209 K' },
              },
            },
            blobs: {
              ethCost: {
                displayValue: 'Ξ71.23',
                value: 71.23,
                perL2Tx: {
                  value: 0.04748666666666667,
                  displayValue: 'Ξ0.047487',
                },
              },
              usdCost: {
                displayValue: '$1.74 M',
                value: 1744344.0199999996,
                perL2Tx: { value: 1162.896013333333, displayValue: '$1.16 K' },
              },
              gas: {
                displayValue: '72.37 M',
                value: 72373840.19000001,
                perL2Tx: { value: 48249.22679333334, displayValue: '48.24 K' },
              },
            },
            calldata: {
              ethCost: {
                displayValue: 'Ξ60.09',
                value: 60.09000000000001,
                perL2Tx: {
                  value: 0.040060000000000005,
                  displayValue: 'Ξ0.04006',
                },
              },
              usdCost: {
                displayValue: '$1.39 M',
                value: 1398309.56,
                perL2Tx: { value: 932.2063733333333, displayValue: '$932' },
              },
              gas: {
                displayValue: '56.29 M',
                value: 56298969.92000001,
                perL2Tx: { value: 37532.64661333334, displayValue: '37.53 K' },
              },
            },
            compute: {
              ethCost: {
                displayValue: 'Ξ103',
                value: 103.39999999999999,
                perL2Tx: {
                  value: 0.06893333333333333,
                  displayValue: 'Ξ0.068933',
                },
              },
              usdCost: {
                displayValue: '$2.55 M',
                value: 2550517.5700000003,
                perL2Tx: { value: 1700.3450466666668, displayValue: '$1.70 K' },
              },
              gas: {
                displayValue: '106 M',
                value: 106936156.36,
                perL2Tx: { value: 71290.77090666667, displayValue: '71.29 K' },
              },
            },
            overhead: {
              ethCost: {
                displayValue: 'Ξ79.29',
                value: 79.29000000000002,
                perL2Tx: {
                  value: 0.05286000000000001,
                  displayValue: 'Ξ0.05286',
                },
              },
              usdCost: {
                displayValue: '$1.87 M',
                value: 1870444.9799999997,
                perL2Tx: { value: 1246.9633199999998, displayValue: '$1.24 K' },
              },
              gas: {
                displayValue: '78.01 M',
                value: 78012423.58000001,
                perL2Tx: { value: 52008.28238666667, displayValue: '52.00 K' },
              },
            },
            txCount: { value: 1500, displayValue: '1.50 K' },
          },
          last90d: {
            total: {
              ethCost: {
                displayValue: 'Ξ920',
                value: 920.7499999999998,
                perL2Tx: {
                  value: 0.20461111111111105,
                  displayValue: 'Ξ0.204611',
                },
              },
              usdCost: {
                displayValue: '$22.03 M',
                value: 22039334.529999997,
                perL2Tx: { value: 4897.629895555555, displayValue: '$4.89 K' },
              },
              gas: {
                displayValue: '937 M',
                value: 937704471.7099999,
                perL2Tx: { value: 208378.77149111108, displayValue: '208 K' },
              },
            },
            blobs: {
              ethCost: {
                displayValue: 'Ξ213',
                value: 213.94000000000003,
                perL2Tx: {
                  value: 0.04754222222222223,
                  displayValue: 'Ξ0.047542',
                },
              },
              usdCost: {
                displayValue: '$5.20 M',
                value: 5209256.839999999,
                perL2Tx: { value: 1157.6126311111109, displayValue: '$1.15 K' },
              },
              gas: {
                displayValue: '221 M',
                value: 221342138.47999996,
                perL2Tx: { value: 49187.141884444434, displayValue: '49.18 K' },
              },
            },
            calldata: {
              ethCost: {
                displayValue: 'Ξ203',
                value: 203.15,
                perL2Tx: {
                  value: 0.045144444444444445,
                  displayValue: 'Ξ0.045144',
                },
              },
              usdCost: {
                displayValue: '$4.82 M',
                value: 4828303.08,
                perL2Tx: { value: 1072.95624, displayValue: '$1.07 K' },
              },
              gas: {
                displayValue: '206 M',
                value: 206536687.16999996,
                perL2Tx: { value: 45897.04159333332, displayValue: '45.89 K' },
              },
            },
            compute: {
              ethCost: {
                displayValue: 'Ξ264',
                value: 264.02,
                perL2Tx: {
                  value: 0.058671111111111104,
                  displayValue: 'Ξ0.058671',
                },
              },
              usdCost: {
                displayValue: '$6.41 M',
                value: 6419309.809999999,
                perL2Tx: { value: 1426.513291111111, displayValue: '$1.42 K' },
              },
              gas: {
                displayValue: '272 M',
                value: 272118564.77000004,
                perL2Tx: { value: 60470.79217111112, displayValue: '60.47 K' },
              },
            },
            overhead: {
              ethCost: {
                displayValue: 'Ξ239',
                value: 239.64000000000001,
                perL2Tx: {
                  value: 0.05325333333333334,
                  displayValue: 'Ξ0.053253',
                },
              },
              usdCost: {
                displayValue: '$5.58 M',
                value: 5582464.800000001,
                perL2Tx: { value: 1240.5477333333336, displayValue: '$1.24 K' },
              },
              gas: {
                displayValue: '237 M',
                value: 237707081.29,
                perL2Tx: { value: 52823.79584222222, displayValue: '52.82 K' },
              },
            },
            txCount: { value: 4500, displayValue: '4.50 K' },
          },
          last180d: {
            total: {
              ethCost: {
                displayValue: 'Ξ1.76 K',
                value: 1769.0100000000004,
                perL2Tx: {
                  value: 0.1965566666666667,
                  displayValue: 'Ξ0.196557',
                },
              },
              usdCost: {
                displayValue: '$41.25 M',
                value: 41251172.51999999,
                perL2Tx: { value: 4583.463613333332, displayValue: '$4.58 K' },
              },
              gas: {
                displayValue: '1.76 B',
                value: 1768313580.4799998,
                perL2Tx: { value: 196479.28671999997, displayValue: '196 K' },
              },
            },
            blobs: {
              ethCost: {
                displayValue: 'Ξ420',
                value: 420.7600000000001,
                perL2Tx: {
                  value: 0.046751111111111125,
                  displayValue: 'Ξ0.046751',
                },
              },
              usdCost: {
                displayValue: '$9.83 M',
                value: 9832005.53000001,
                perL2Tx: { value: 1092.4450588888901, displayValue: '$1.09 K' },
              },
              gas: {
                displayValue: '416 M',
                value: 416225895.32,
                perL2Tx: { value: 46247.32170222222, displayValue: '46.24 K' },
              },
            },
            calldata: {
              ethCost: {
                displayValue: 'Ξ416',
                value: 416.77999999999975,
                perL2Tx: {
                  value: 0.04630888888888886,
                  displayValue: 'Ξ0.046309',
                },
              },
              usdCost: {
                displayValue: '$9.66 M',
                value: 9660101.090000007,
                perL2Tx: { value: 1073.3445655555563, displayValue: '$1.07 K' },
              },
              gas: {
                displayValue: '413 M',
                value: 413900881.83000016,
                perL2Tx: { value: 45988.986870000015, displayValue: '45.98 K' },
              },
            },
            compute: {
              ethCost: {
                displayValue: 'Ξ470',
                value: 470.64999999999975,
                perL2Tx: {
                  value: 0.052294444444444414,
                  displayValue: 'Ξ0.052294',
                },
              },
              usdCost: {
                displayValue: '$11.18 M',
                value: 11189393.829999998,
                perL2Tx: { value: 1243.265981111111, displayValue: '$1.24 K' },
              },
              gas: {
                displayValue: '478 M',
                value: 478911254.34999967,
                perL2Tx: { value: 53212.36159444441, displayValue: '53.21 K' },
              },
            },
            overhead: {
              ethCost: {
                displayValue: 'Ξ460',
                value: 460.82,
                perL2Tx: {
                  value: 0.05120222222222222,
                  displayValue: 'Ξ0.051202',
                },
              },
              usdCost: {
                displayValue: '$10.56 M',
                value: 10569672.069999997,
                perL2Tx: { value: 1174.4080077777774, displayValue: '$1.17 K' },
              },
              gas: {
                displayValue: '459 M',
                value: 459275548.98,
                perL2Tx: { value: 51030.61655333333, displayValue: '51.03 K' },
              },
            },
            txCount: { value: 9000, displayValue: '9.00 K' },
          },
          syncStatus: {
            displaySyncedUntil: '2024 April 04, 14:00 (UTC)',
            isSynced: true,
          },
        },
        costsWarning: undefined,
      },
      {
        name: 'Base',
        shortName: undefined,
        slug: 'base',
        showProjectUnderReview: false,
        hasImplementationChanged: false,
        warning:
          'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
        redWarning: undefined,
        category: 'Optimistic Rollup',
        provider: 'OP Stack',
        purposes: ['Universal'],
        stage: {
          stage: 'Stage 0',
          missing: {
            nextStage: 'Stage 1',
            requirements: [
              'The proof system is still under development.',
              "Users' withdrawals can be censored by the permissioned operators.",
              'Upgrades executed by actors with more centralized control than a Security Council provide less than 7d for users to exit if the permissioned operator is down or censoring.',
            ],
          },
          summary: [
            {
              stage: 'Stage 0',
              requirements: [
                {
                  satisfied: true,
                  description: 'The project calls itself a rollup.',
                },
                {
                  satisfied: true,
                  description: 'L2 state roots are posted to Ethereum L1.',
                },
                {
                  satisfied: true,
                  description:
                    'Inputs for the state transition function are posted to L1.',
                },
                {
                  satisfied: true,
                  description:
                    'A source-available node exists that can recreate the state from L1 data. Please note that the L2BEAT team has not verified the validity of the node source code. [View code](https://github.com/ethereum-optimism/optimism/tree/develop/op-node)',
                },
              ],
            },
            {
              stage: 'Stage 1',
              requirements: [
                {
                  satisfied: false,
                  description: 'The proof system is still under development.',
                },
                {
                  satisfied: false,
                  description:
                    "Users' withdrawals can be censored by the permissioned operators.",
                },
                {
                  satisfied: false,
                  description:
                    'Upgrades executed by actors with more centralized control than a Security Council provide less than 7d for users to exit if the permissioned operator is down or censoring.',
                },
              ],
            },
            {
              stage: 'Stage 2',
              requirements: [
                {
                  satisfied: false,
                  description:
                    'Upgrades unrelated to on-chain provable bugs provide less than 30d to exit.',
                },
              ],
            },
          ],
          message: undefined,
        },
        data: {
          last24h: {
            total: {
              ethCost: {
                displayValue: 'Ξ4.94',
                value: 4.94,
                perL2Tx: {
                  value: 0.09880000000000001,
                  displayValue: 'Ξ0.0988',
                },
              },
              usdCost: {
                displayValue: '$35.17 K',
                value: 35177.37,
                perL2Tx: { value: 703.5474, displayValue: '$703' },
              },
              gas: {
                displayValue: '1.44 M',
                value: 1441454.75,
                perL2Tx: { value: 28829.095, displayValue: '28.82 K' },
              },
            },
            blobs: {
              ethCost: {
                displayValue: 'Ξ1.15',
                value: 1.16,
                perL2Tx: { value: 0.0232, displayValue: 'Ξ0.0232' },
              },
              usdCost: {
                displayValue: '$8.25 K',
                value: 8258.54,
                perL2Tx: { value: 165.1708, displayValue: '$165' },
              },
              gas: {
                displayValue: '338 K',
                value: 338408.37,
                perL2Tx: { value: 6768.1674, displayValue: '6.76 K' },
              },
            },
            calldata: {
              ethCost: {
                displayValue: 'Ξ0.78',
                value: 0.78,
                perL2Tx: {
                  value: 0.015600000000000001,
                  displayValue: 'Ξ0.0156',
                },
              },
              usdCost: {
                displayValue: '$5.54 K',
                value: 5544.34,
                perL2Tx: { value: 110.88680000000001, displayValue: '$110' },
              },
              gas: {
                displayValue: '227 K',
                value: 227189.19,
                perL2Tx: { value: 4543.7838, displayValue: '4.54 K' },
              },
            },
            compute: {
              ethCost: {
                displayValue: 'Ξ1.03',
                value: 1.03,
                perL2Tx: { value: 0.0206, displayValue: 'Ξ0.0206' },
              },
              usdCost: {
                displayValue: '$7.34 K',
                value: 7341.08,
                perL2Tx: { value: 146.8216, displayValue: '$146' },
              },
              gas: {
                displayValue: '300 K',
                value: 300813.7,
                perL2Tx: { value: 6016.274, displayValue: '6.01 K' },
              },
            },
            overhead: {
              ethCost: {
                displayValue: 'Ξ1.97',
                value: 1.97,
                perL2Tx: { value: 0.0394, displayValue: 'Ξ0.0394' },
              },
              usdCost: {
                displayValue: '$14.03 K',
                value: 14033.41,
                perL2Tx: { value: 280.6682, displayValue: '$280' },
              },
              gas: {
                displayValue: '575 K',
                value: 575043.49,
                perL2Tx: { value: 11500.8698, displayValue: '11.50 K' },
              },
            },
            txCount: { value: 50, displayValue: '50.00' },
          },
          last7d: {
            total: {
              ethCost: {
                displayValue: 'Ξ59.48',
                value: 59.480000000000004,
                perL2Tx: {
                  value: 0.16994285714285715,
                  displayValue: 'Ξ0.169943',
                },
              },
              usdCost: {
                displayValue: '$1.31 M',
                value: 1313861.4100000001,
                perL2Tx: { value: 3753.889742857143, displayValue: '$3.75 K' },
              },
              gas: {
                displayValue: '57.28 M',
                value: 57288213.36,
                perL2Tx: { value: 163680.6096, displayValue: '163 K' },
              },
            },
            blobs: {
              ethCost: {
                displayValue: 'Ξ13.42',
                value: 13.420000000000002,
                perL2Tx: {
                  value: 0.03834285714285715,
                  displayValue: 'Ξ0.038343',
                },
              },
              usdCost: {
                displayValue: '$276 K',
                value: 276914.27,
                perL2Tx: { value: 791.1836285714286, displayValue: '$791' },
              },
              gas: {
                displayValue: '12.53 M',
                value: 12537282.530000001,
                perL2Tx: { value: 35820.80722857143, displayValue: '35.82 K' },
              },
            },
            calldata: {
              ethCost: {
                displayValue: 'Ξ11.88',
                value: 11.88,
                perL2Tx: {
                  value: 0.03394285714285714,
                  displayValue: 'Ξ0.033943',
                },
              },
              usdCost: {
                displayValue: '$262 K',
                value: 262552.15,
                perL2Tx: { value: 750.1490000000001, displayValue: '$750' },
              },
              gas: {
                displayValue: '11.44 M',
                value: 11440136.78,
                perL2Tx: { value: 32686.105085714284, displayValue: '32.68 K' },
              },
            },
            compute: {
              ethCost: {
                displayValue: 'Ξ13.68',
                value: 13.68,
                perL2Tx: {
                  value: 0.039085714285714286,
                  displayValue: 'Ξ0.039086',
                },
              },
              usdCost: {
                displayValue: '$316 K',
                value: 316583.72000000003,
                perL2Tx: { value: 904.5249142857143, displayValue: '$904' },
              },
              gas: {
                displayValue: '14.63 M',
                value: 14635076.4,
                perL2Tx: { value: 41814.504, displayValue: '41.81 K' },
              },
            },
            overhead: {
              ethCost: {
                displayValue: 'Ξ20.49',
                value: 20.499999999999996,
                perL2Tx: {
                  value: 0.05857142857142856,
                  displayValue: 'Ξ0.058571',
                },
              },
              usdCost: {
                displayValue: '$457 K',
                value: 457811.26999999996,
                perL2Tx: { value: 1308.0321999999999, displayValue: '$1.30 K' },
              },
              gas: {
                displayValue: '18.67 M',
                value: 18675717.65,
                perL2Tx: { value: 53359.19328571428, displayValue: '53.35 K' },
              },
            },
            txCount: { value: 350, displayValue: '350' },
          },
          last30d: {
            total: {
              ethCost: {
                displayValue: 'Ξ249',
                value: 249.6900000000001,
                perL2Tx: {
                  value: 0.16646000000000008,
                  displayValue: 'Ξ0.16646',
                },
              },
              usdCost: {
                displayValue: '$5.35 M',
                value: 5351613.63,
                perL2Tx: { value: 3567.74242, displayValue: '$3.56 K' },
              },
              gas: {
                displayValue: '238 M',
                value: 238835785.40999997,
                perL2Tx: { value: 159223.85693999997, displayValue: '159 K' },
              },
            },
            blobs: {
              ethCost: {
                displayValue: 'Ξ59.26',
                value: 59.260000000000005,
                perL2Tx: {
                  value: 0.03950666666666667,
                  displayValue: 'Ξ0.039507',
                },
              },
              usdCost: {
                displayValue: '$1.17 M',
                value: 1179786.04,
                perL2Tx: { value: 786.5240266666667, displayValue: '$786' },
              },
              gas: {
                displayValue: '54.82 M',
                value: 54822083.69,
                perL2Tx: { value: 36548.05579333333, displayValue: '36.54 K' },
              },
            },
            calldata: {
              ethCost: {
                displayValue: 'Ξ48.03',
                value: 48.03,
                perL2Tx: { value: 0.03202, displayValue: 'Ξ0.03202' },
              },
              usdCost: {
                displayValue: '$991 K',
                value: 991223.11,
                perL2Tx: { value: 660.8154066666666, displayValue: '$660' },
              },
              gas: {
                displayValue: '43.23 M',
                value: 43232946.08,
                perL2Tx: { value: 28821.964053333333, displayValue: '28.82 K' },
              },
            },
            compute: {
              ethCost: {
                displayValue: 'Ξ64.08',
                value: 64.08,
                perL2Tx: { value: 0.04272, displayValue: 'Ξ0.04272' },
              },
              usdCost: {
                displayValue: '$1.44 M',
                value: 1446489.1199999996,
                perL2Tx: { value: 964.3260799999998, displayValue: '$964' },
              },
              gas: {
                displayValue: '64.37 M',
                value: 64373525.56999999,
                perL2Tx: { value: 42915.68371333333, displayValue: '42.91 K' },
              },
            },
            overhead: {
              ethCost: {
                displayValue: 'Ξ78.31',
                value: 78.32,
                perL2Tx: {
                  value: 0.05221333333333333,
                  displayValue: 'Ξ0.052213',
                },
              },
              usdCost: {
                displayValue: '$1.73 M',
                value: 1734115.36,
                perL2Tx: { value: 1156.0769066666667, displayValue: '$1.15 K' },
              },
              gas: {
                displayValue: '76.40 M',
                value: 76407230.07,
                perL2Tx: { value: 50938.153379999996, displayValue: '50.93 K' },
              },
            },
            txCount: { value: 1500, displayValue: '1.50 K' },
          },
          last90d: {
            total: {
              ethCost: {
                displayValue: 'Ξ784',
                value: 784.29,
                perL2Tx: {
                  value: 0.17428666666666665,
                  displayValue: 'Ξ0.174287',
                },
              },
              usdCost: {
                displayValue: '$17.49 M',
                value: 17493733.64,
                perL2Tx: { value: 3887.4963644444447, displayValue: '$3.88 K' },
              },
              gas: {
                displayValue: '771 M',
                value: 771256474.0299999,
                perL2Tx: { value: 171390.3275622222, displayValue: '171 K' },
              },
            },
            blobs: {
              ethCost: {
                displayValue: 'Ξ183',
                value: 183.65000000000006,
                perL2Tx: {
                  value: 0.040811111111111124,
                  displayValue: 'Ξ0.040811',
                },
              },
              usdCost: {
                displayValue: '$3.99 M',
                value: 3995265.210000001,
                perL2Tx: { value: 887.8367133333335, displayValue: '$887' },
              },
              gas: {
                displayValue: '174 M',
                value: 174865985.62999997,
                perL2Tx: { value: 38859.10791777777, displayValue: '38.85 K' },
              },
            },
            calldata: {
              ethCost: {
                displayValue: 'Ξ166',
                value: 166.95999999999998,
                perL2Tx: {
                  value: 0.03710222222222222,
                  displayValue: 'Ξ0.037102',
                },
              },
              usdCost: {
                displayValue: '$3.61 M',
                value: 3615285.030000001,
                perL2Tx: { value: 803.3966733333336, displayValue: '$803' },
              },
              gas: {
                displayValue: '158 M',
                value: 158337498.67,
                perL2Tx: { value: 35186.110815555556, displayValue: '35.18 K' },
              },
            },
            compute: {
              ethCost: {
                displayValue: 'Ξ214',
                value: 214.49000000000007,
                perL2Tx: {
                  value: 0.04766444444444446,
                  displayValue: 'Ξ0.047664',
                },
              },
              usdCost: {
                displayValue: '$4.76 M',
                value: 4766163.75,
                perL2Tx: { value: 1059.1475, displayValue: '$1.05 K' },
              },
              gas: {
                displayValue: '210 M',
                value: 210044735.29999995,
                perL2Tx: { value: 46676.607844444436, displayValue: '46.67 K' },
              },
            },
            overhead: {
              ethCost: {
                displayValue: 'Ξ219',
                value: 219.18999999999997,
                perL2Tx: {
                  value: 0.048708888888888885,
                  displayValue: 'Ξ0.048709',
                },
              },
              usdCost: {
                displayValue: '$5.11 M',
                value: 5117019.650000001,
                perL2Tx: { value: 1137.115477777778, displayValue: '$1.13 K' },
              },
              gas: {
                displayValue: '228 M',
                value: 228008254.43000004,
                perL2Tx: { value: 50668.50098444445, displayValue: '50.66 K' },
              },
            },
            txCount: { value: 4500, displayValue: '4.50 K' },
          },
          last180d: {
            total: {
              ethCost: {
                displayValue: 'Ξ1.66 K',
                value: 1660.34,
                perL2Tx: {
                  value: 0.18448222222222221,
                  displayValue: 'Ξ0.184482',
                },
              },
              usdCost: {
                displayValue: '$37.05 M',
                value: 37055528.81999999,
                perL2Tx: { value: 4117.2809799999995, displayValue: '$4.11 K' },
              },
              gas: {
                displayValue: '1.62 B',
                value: 1623543223.030001,
                perL2Tx: { value: 180393.69144777788, displayValue: '180 K' },
              },
            },
            blobs: {
              ethCost: {
                displayValue: 'Ξ398',
                value: 398.8799999999997,
                perL2Tx: {
                  value: 0.04431999999999997,
                  displayValue: 'Ξ0.04432',
                },
              },
              usdCost: {
                displayValue: '$8.67 M',
                value: 8671320.25,
                perL2Tx: { value: 963.4800277777778, displayValue: '$963' },
              },
              gas: {
                displayValue: '379 M',
                value: 379082057.31000006,
                perL2Tx: { value: 42120.228590000006, displayValue: '42.12 K' },
              },
            },
            calldata: {
              ethCost: {
                displayValue: 'Ξ413',
                value: 413.36999999999995,
                perL2Tx: {
                  value: 0.04592999999999999,
                  displayValue: 'Ξ0.04593',
                },
              },
              usdCost: {
                displayValue: '$9.24 M',
                value: 9246847.919999994,
                perL2Tx: { value: 1027.427546666666, displayValue: '$1.02 K' },
              },
              gas: {
                displayValue: '404 M',
                value: 404789982.4799999,
                perL2Tx: { value: 44976.664719999986, displayValue: '44.97 K' },
              },
            },
            compute: {
              ethCost: {
                displayValue: 'Ξ422',
                value: 422.09999999999997,
                perL2Tx: { value: 0.0469, displayValue: 'Ξ0.0469' },
              },
              usdCost: {
                displayValue: '$9.38 M',
                value: 9384538.95,
                perL2Tx: { value: 1042.7265499999999, displayValue: '$1.04 K' },
              },
              gas: {
                displayValue: '407 M',
                value: 407474354.26,
                perL2Tx: { value: 45274.92825111111, displayValue: '45.27 K' },
              },
            },
            overhead: {
              ethCost: {
                displayValue: 'Ξ425',
                value: 425.98999999999984,
                perL2Tx: {
                  value: 0.047332222222222206,
                  displayValue: 'Ξ0.047332',
                },
              },
              usdCost: {
                displayValue: '$9.75 M',
                value: 9752821.700000001,
                perL2Tx: { value: 1083.6468555555557, displayValue: '$1.08 K' },
              },
              gas: {
                displayValue: '432 M',
                value: 432196828.9800002,
                perL2Tx: { value: 48021.86988666669, displayValue: '48.02 K' },
              },
            },
            txCount: { value: 9000, displayValue: '9.00 K' },
          },
          syncStatus: {
            displaySyncedUntil: '2024 April 01, 14:00 (UTC)',
            isSynced: false,
          },
        },
        costsWarning: undefined,
      },
      {
        name: 'dYdX v3',
        shortName: undefined,
        slug: 'dydx',
        showProjectUnderReview: false,
        hasImplementationChanged: false,
        warning:
          'This page describes dYdX v3, which is an L2 built on Ethereum. Recently deployed dYdX v4 is a separate blockchain based on Cosmos SDK, unrelated to Ethereum and is using different technology. No information on this page applies to dYdX v4.',
        redWarning: undefined,
        category: 'ZK Rollup',
        provider: 'StarkEx',
        purposes: ['Exchange'],
        stage: {
          stage: 'Stage 1',
          missing: {
            nextStage: 'Stage 2',
            requirements: [
              'Upgrades unrelated to on-chain provable bugs provide less than 30d to exit.',
            ],
          },
          summary: [
            {
              stage: 'Stage 0',
              requirements: [
                {
                  satisfied: true,
                  description: 'The project calls itself a rollup.',
                },
                {
                  satisfied: true,
                  description: 'L2 state roots are posted to Ethereum L1.',
                },
                {
                  satisfied: true,
                  description:
                    'Inputs for the state transition function are posted to L1.',
                },
                {
                  satisfied: true,
                  description:
                    'A source-available node exists that can recreate the state from L1 data. Please note that the L2BEAT team has not verified the validity of the node source code. [View code](https://github.com/l2beat/starkex-explorer)',
                },
              ],
            },
            {
              stage: 'Stage 1',
              requirements: [
                {
                  satisfied: true,
                  description:
                    'A complete and functional proof system is deployed.',
                },
                {
                  satisfied: true,
                  description:
                    'Users are able to exit without the help of the permissioned operators.',
                },
                {
                  satisfied: true,
                  description:
                    'In case of an unwanted upgrade by actors more centralized than a Security Council, users have at least 7d to exit.',
                },
              ],
            },
            {
              stage: 'Stage 2',
              requirements: [
                {
                  satisfied: false,
                  description:
                    'Upgrades unrelated to on-chain provable bugs provide less than 30d to exit.',
                },
              ],
            },
          ],
          message: undefined,
        },
        data: {
          last24h: {
            total: {
              ethCost: {
                displayValue: 'Ξ4.28',
                value: 4.28,
                perL2Tx: {
                  value: 0.08560000000000001,
                  displayValue: 'Ξ0.0856',
                },
              },
              usdCost: {
                displayValue: '$45.85 K',
                value: 45857.56,
                perL2Tx: { value: 917.1511999999999, displayValue: '$917' },
              },
              gas: {
                displayValue: '1.94 M',
                value: 1941337.21,
                perL2Tx: { value: 38826.7442, displayValue: '38.82 K' },
              },
            },
            blobs: {
              ethCost: {
                displayValue: 'Ξ0.69',
                value: 0.69,
                perL2Tx: { value: 0.0138, displayValue: 'Ξ0.0138' },
              },
              usdCost: {
                displayValue: '$7.35 K',
                value: 7355.69,
                perL2Tx: { value: 147.1138, displayValue: '$147' },
              },
              gas: {
                displayValue: '311 K',
                value: 311396.35,
                perL2Tx: { value: 6227.927, displayValue: '6.22 K' },
              },
            },
            calldata: {
              ethCost: {
                displayValue: 'Ξ2.68',
                value: 2.68,
                perL2Tx: { value: 0.0536, displayValue: 'Ξ0.0536' },
              },
              usdCost: {
                displayValue: '$28.74 K',
                value: 28742.36,
                perL2Tx: { value: 574.8472, displayValue: '$574' },
              },
              gas: {
                displayValue: '1.21 M',
                value: 1216781.07,
                perL2Tx: { value: 24335.6214, displayValue: '24.33 K' },
              },
            },
            compute: {
              ethCost: {
                displayValue: 'Ξ0.74',
                value: 0.74,
                perL2Tx: { value: 0.0148, displayValue: 'Ξ0.0148' },
              },
              usdCost: {
                displayValue: '$7.97 K',
                value: 7970.06,
                perL2Tx: { value: 159.40120000000002, displayValue: '$159' },
              },
              gas: {
                displayValue: '337 K',
                value: 337405.22,
                perL2Tx: { value: 6748.104399999999, displayValue: '6.74 K' },
              },
            },
            overhead: {
              ethCost: {
                displayValue: 'Ξ0.17',
                value: 0.17,
                perL2Tx: {
                  value: 0.0034000000000000002,
                  displayValue: 'Ξ0.0034',
                },
              },
              usdCost: {
                displayValue: '$1.78 K',
                value: 1789.45,
                perL2Tx: { value: 35.789, displayValue: '$35.78' },
              },
              gas: {
                displayValue: '75.75 K',
                value: 75754.57,
                perL2Tx: { value: 1515.0914000000002, displayValue: '1.51 K' },
              },
            },
            txCount: { value: 50, displayValue: '50.00' },
          },
          last7d: {
            total: {
              ethCost: {
                displayValue: 'Ξ66.81',
                value: 66.82,
                perL2Tx: {
                  value: 0.1909142857142857,
                  displayValue: 'Ξ0.190914',
                },
              },
              usdCost: {
                displayValue: '$1.60 M',
                value: 1607265.56,
                perL2Tx: { value: 4592.187314285715, displayValue: '$4.59 K' },
              },
              gas: {
                displayValue: '66.33 M',
                value: 66339357.38,
                perL2Tx: { value: 189541.02108571428, displayValue: '189 K' },
              },
            },
            blobs: {
              ethCost: {
                displayValue: 'Ξ18.04',
                value: 18.04,
                perL2Tx: {
                  value: 0.05154285714285714,
                  displayValue: 'Ξ0.051543',
                },
              },
              usdCost: {
                displayValue: '$435 K',
                value: 435312.79,
                perL2Tx: { value: 1243.7508285714284, displayValue: '$1.24 K' },
              },
              gas: {
                displayValue: '18.24 M',
                value: 18241816.1,
                perL2Tx: { value: 52119.474571428575, displayValue: '52.11 K' },
              },
            },
            calldata: {
              ethCost: {
                displayValue: 'Ξ19.55',
                value: 19.56,
                perL2Tx: {
                  value: 0.05588571428571428,
                  displayValue: 'Ξ0.055886',
                },
              },
              usdCost: {
                displayValue: '$459 K',
                value: 459315.81,
                perL2Tx: { value: 1312.3308857142856, displayValue: '$1.31 K' },
              },
              gas: {
                displayValue: '18.96 M',
                value: 18968602.45,
                perL2Tx: { value: 54196.007, displayValue: '54.19 K' },
              },
            },
            compute: {
              ethCost: {
                displayValue: 'Ξ13.98',
                value: 13.98,
                perL2Tx: {
                  value: 0.03994285714285714,
                  displayValue: 'Ξ0.039943',
                },
              },
              usdCost: {
                displayValue: '$328 K',
                value: 328471.75,
                perL2Tx: { value: 938.4907142857143, displayValue: '$938' },
              },
              gas: {
                displayValue: '13.40 M',
                value: 13406936.93,
                perL2Tx: { value: 38305.53408571429, displayValue: '38.30 K' },
              },
            },
            overhead: {
              ethCost: {
                displayValue: 'Ξ15.24',
                value: 15.24,
                perL2Tx: {
                  value: 0.04354285714285714,
                  displayValue: 'Ξ0.043543',
                },
              },
              usdCost: {
                displayValue: '$384 K',
                value: 384165.21,
                perL2Tx: { value: 1097.6148857142857, displayValue: '$1.09 K' },
              },
              gas: {
                displayValue: '15.72 M',
                value: 15722001.9,
                perL2Tx: { value: 44920.00542857143, displayValue: '44.92 K' },
              },
            },
            txCount: { value: 350, displayValue: '350' },
          },
          last30d: {
            total: {
              ethCost: {
                displayValue: 'Ξ284',
                value: 284.1699999999999,
                perL2Tx: {
                  value: 0.1894466666666666,
                  displayValue: 'Ξ0.189447',
                },
              },
              usdCost: {
                displayValue: '$6.10 M',
                value: 6109298.409999996,
                perL2Tx: { value: 4072.8656066666645, displayValue: '$4.07 K' },
              },
              gas: {
                displayValue: '247 M',
                value: 247272199.06,
                perL2Tx: { value: 164848.13270666666, displayValue: '164 K' },
              },
            },
            blobs: {
              ethCost: {
                displayValue: 'Ξ63.72',
                value: 63.72,
                perL2Tx: { value: 0.04248, displayValue: 'Ξ0.04248' },
              },
              usdCost: {
                displayValue: '$1.33 M',
                value: 1339155.4100000001,
                perL2Tx: { value: 892.7702733333334, displayValue: '$892' },
              },
              gas: {
                displayValue: '54.56 M',
                value: 54568830.57000001,
                perL2Tx: { value: 36379.220380000006, displayValue: '36.37 K' },
              },
            },
            calldata: {
              ethCost: {
                displayValue: 'Ξ71.54',
                value: 71.54000000000002,
                perL2Tx: {
                  value: 0.047693333333333345,
                  displayValue: 'Ξ0.047693',
                },
              },
              usdCost: {
                displayValue: '$1.48 M',
                value: 1488533.73,
                perL2Tx: { value: 992.35582, displayValue: '$992' },
              },
              gas: {
                displayValue: '60.86 M',
                value: 60860033.120000005,
                perL2Tx: { value: 40573.35541333334, displayValue: '40.57 K' },
              },
            },
            compute: {
              ethCost: {
                displayValue: 'Ξ79.73',
                value: 79.74,
                perL2Tx: { value: 0.05316, displayValue: 'Ξ0.05316' },
              },
              usdCost: {
                displayValue: '$1.74 M',
                value: 1740744.7999999996,
                perL2Tx: { value: 1160.496533333333, displayValue: '$1.16 K' },
              },
              gas: {
                displayValue: '69.50 M',
                value: 69509899.00999998,
                perL2Tx: { value: 46339.932673333315, displayValue: '46.33 K' },
              },
            },
            overhead: {
              ethCost: {
                displayValue: 'Ξ69.17',
                value: 69.17,
                perL2Tx: {
                  value: 0.04611333333333333,
                  displayValue: 'Ξ0.046113',
                },
              },
              usdCost: {
                displayValue: '$1.54 M',
                value: 1540864.4700000002,
                perL2Tx: { value: 1027.2429800000002, displayValue: '$1.02 K' },
              },
              gas: {
                displayValue: '62.33 M',
                value: 62333436.36,
                perL2Tx: { value: 41555.62424, displayValue: '41.55 K' },
              },
            },
            txCount: { value: 1500, displayValue: '1.50 K' },
          },
          last90d: {
            total: {
              ethCost: {
                displayValue: 'Ξ907',
                value: 907.4199999999996,
                perL2Tx: {
                  value: 0.2016488888888888,
                  displayValue: 'Ξ0.201649',
                },
              },
              usdCost: {
                displayValue: '$21.49 M',
                value: 21498607.029999997,
                perL2Tx: { value: 4777.468228888888, displayValue: '$4.77 K' },
              },
              gas: {
                displayValue: '885 M',
                value: 885789960.7999997,
                perL2Tx: { value: 196842.21351111104, displayValue: '196 K' },
              },
            },
            blobs: {
              ethCost: {
                displayValue: 'Ξ198',
                value: 198.39,
                perL2Tx: {
                  value: 0.04408666666666666,
                  displayValue: 'Ξ0.044087',
                },
              },
              usdCost: {
                displayValue: '$4.53 M',
                value: 4537532.61,
                perL2Tx: { value: 1008.34058, displayValue: '$1.00 K' },
              },
              gas: {
                displayValue: '186 M',
                value: 186987508.36,
                perL2Tx: { value: 41552.77963555556, displayValue: '41.55 K' },
              },
            },
            calldata: {
              ethCost: {
                displayValue: 'Ξ233',
                value: 233.57000000000002,
                perL2Tx: {
                  value: 0.05190444444444445,
                  displayValue: 'Ξ0.051904',
                },
              },
              usdCost: {
                displayValue: '$5.54 M',
                value: 5545905.740000004,
                perL2Tx: { value: 1232.4234977777787, displayValue: '$1.23 K' },
              },
              gas: {
                displayValue: '229 M',
                value: 229178983.27999997,
                perL2Tx: { value: 50928.6629511111, displayValue: '50.92 K' },
              },
            },
            compute: {
              ethCost: {
                displayValue: 'Ξ246',
                value: 246.28000000000003,
                perL2Tx: {
                  value: 0.054728888888888896,
                  displayValue: 'Ξ0.054729',
                },
              },
              usdCost: {
                displayValue: '$5.89 M',
                value: 5899878.620000001,
                perL2Tx: { value: 1311.084137777778, displayValue: '$1.31 K' },
              },
              gas: {
                displayValue: '237 M',
                value: 237748891.18999994,
                perL2Tx: { value: 52833.086931111095, displayValue: '52.83 K' },
              },
            },
            overhead: {
              ethCost: {
                displayValue: 'Ξ229',
                value: 229.17999999999998,
                perL2Tx: {
                  value: 0.050928888888888885,
                  displayValue: 'Ξ0.050929',
                },
              },
              usdCost: {
                displayValue: '$5.51 M',
                value: 5515290.060000001,
                perL2Tx: { value: 1225.6200133333336, displayValue: '$1.22 K' },
              },
              gas: {
                displayValue: '231 M',
                value: 231874577.9700001,
                perL2Tx: { value: 51527.683993333354, displayValue: '51.52 K' },
              },
            },
            txCount: { value: 4500, displayValue: '4.50 K' },
          },
          last180d: {
            total: {
              ethCost: {
                displayValue: 'Ξ1.74 K',
                value: 1744.3300000000002,
                perL2Tx: {
                  value: 0.19381444444444446,
                  displayValue: 'Ξ0.193814',
                },
              },
              usdCost: {
                displayValue: '$40.48 M',
                value: 40483104.90999999,
                perL2Tx: { value: 4498.122767777777, displayValue: '$4.49 K' },
              },
              gas: {
                displayValue: '1.66 B',
                value: 1668287669.140001,
                perL2Tx: { value: 185365.29657111122, displayValue: '185 K' },
              },
            },
            blobs: {
              ethCost: {
                displayValue: 'Ξ395',
                value: 395.87000000000006,
                perL2Tx: {
                  value: 0.04398555555555556,
                  displayValue: 'Ξ0.043986',
                },
              },
              usdCost: {
                displayValue: '$9.06 M',
                value: 9065751.379999993,
                perL2Tx: { value: 1007.3057088888881, displayValue: '$1.00 K' },
              },
              gas: {
                displayValue: '373 M',
                value: 373410149.2899999,
                perL2Tx: { value: 41490.01658777777, displayValue: '41.49 K' },
              },
            },
            calldata: {
              ethCost: {
                displayValue: 'Ξ431',
                value: 431.9299999999999,
                perL2Tx: {
                  value: 0.04799222222222221,
                  displayValue: 'Ξ0.047992',
                },
              },
              usdCost: {
                displayValue: '$9.98 M',
                value: 9983904.249999996,
                perL2Tx: { value: 1109.322694444444, displayValue: '$1.10 K' },
              },
              gas: {
                displayValue: '416 M',
                value: 416067940.7900001,
                perL2Tx: { value: 46229.7711988889, displayValue: '46.22 K' },
              },
            },
            compute: {
              ethCost: {
                displayValue: 'Ξ453',
                value: 453.76000000000033,
                perL2Tx: {
                  value: 0.05041777777777781,
                  displayValue: 'Ξ0.050418',
                },
              },
              usdCost: {
                displayValue: '$10.56 M',
                value: 10566012.779999992,
                perL2Tx: { value: 1174.0014199999991, displayValue: '$1.17 K' },
              },
              gas: {
                displayValue: '428 M',
                value: 428220425.59000003,
                perL2Tx: { value: 47580.04728777778, displayValue: '47.58 K' },
              },
            },
            overhead: {
              ethCost: {
                displayValue: 'Ξ462',
                value: 462.7700000000002,
                perL2Tx: {
                  value: 0.05141888888888891,
                  displayValue: 'Ξ0.051419',
                },
              },
              usdCost: {
                displayValue: '$10.86 M',
                value: 10867436.500000002,
                perL2Tx: { value: 1207.4929444444447, displayValue: '$1.20 K' },
              },
              gas: {
                displayValue: '450 M',
                value: 450589153.46999997,
                perL2Tx: { value: 50065.46149666666, displayValue: '50.06 K' },
              },
            },
            txCount: { value: 9000, displayValue: '9.00 K' },
          },
          syncStatus: {
            displaySyncedUntil: '2024 April 04, 14:00 (UTC)',
            isSynced: true,
          },
        },
        costsWarning: undefined,
      },
      {
        name: 'Linea',
        shortName: undefined,
        slug: 'linea',
        showProjectUnderReview: false,
        hasImplementationChanged: false,
        warning: 'The circuit of the program being proven is not public.',
        redWarning: undefined,
        category: 'ZK Rollup',
        provider: undefined,
        purposes: ['Universal'],
        stage: {
          stage: 'Stage 0',
          missing: {
            nextStage: 'Stage 1',
            requirements: [
              "Users' withdrawals can be censored by the permissioned operators.",
              'Upgrades executed by actors with more centralized control than a Security Council provide less than 7d for users to exit if the permissioned operator is down or censoring.',
              'Security Council members are not publicly known.',
            ],
          },
          summary: [
            {
              stage: 'Stage 0',
              requirements: [
                {
                  satisfied: true,
                  description: 'The project calls itself a rollup.',
                },
                {
                  satisfied: true,
                  description: 'L2 state roots are posted to Ethereum L1.',
                },
                {
                  satisfied: true,
                  description:
                    'Inputs for the state transition function are posted to L1.',
                },
                {
                  satisfied: false,
                  description:
                    'No source-available node exists that can recreate the state from L1 data.',
                },
              ],
            },
            {
              stage: 'Stage 1',
              requirements: [
                {
                  satisfied: true,
                  description:
                    'A complete and functional proof system is deployed.',
                },
                {
                  satisfied: false,
                  description:
                    "Users' withdrawals can be censored by the permissioned operators.",
                },
                {
                  satisfied: false,
                  description:
                    'Upgrades executed by actors with more centralized control than a Security Council provide less than 7d for users to exit if the permissioned operator is down or censoring.',
                },
                {
                  satisfied: false,
                  description:
                    'Security Council members are not publicly known.',
                },
              ],
            },
            {
              stage: 'Stage 2',
              requirements: [
                {
                  satisfied: false,
                  description:
                    'Upgrades unrelated to on-chain provable bugs provide less than 30d to exit.',
                },
                {
                  satisfied: false,
                  description:
                    "The Security Council's actions are not confined to on-chain provable bugs.",
                },
              ],
            },
          ],
          message: {
            type: 'warning',
            text: 'There is no available node software that can reconstruct the state from L1 data, hence there is no way to verify that this system is a rollup.',
          },
        },
        data: {
          last24h: {
            total: {
              ethCost: {
                displayValue: 'Ξ0.58',
                value: 0.58,
                perL2Tx: { value: 0.0116, displayValue: 'Ξ0.0116' },
              },
              usdCost: {
                displayValue: '$1.22 K',
                value: 1222.13,
                perL2Tx: { value: 24.442600000000002, displayValue: '$24.44' },
              },
              gas: {
                displayValue: '56.11 K',
                value: 56117.42,
                perL2Tx: { value: 1122.3483999999999, displayValue: '1.12 K' },
              },
            },
            blobs: {
              ethCost: {
                displayValue: 'Ξ0.05',
                value: 0.05,
                perL2Tx: { value: 0.001, displayValue: 'Ξ0.001' },
              },
              usdCost: {
                displayValue: '$100',
                value: 100.69,
                perL2Tx: { value: 2.0138, displayValue: '$2.01' },
              },
              gas: {
                displayValue: '4.62 K',
                value: 4623.59,
                perL2Tx: { value: 92.4718, displayValue: '92.47' },
              },
            },
            calldata: {
              ethCost: {
                displayValue: 'Ξ0.14',
                value: 0.14,
                perL2Tx: {
                  value: 0.0028000000000000004,
                  displayValue: 'Ξ0.0028',
                },
              },
              usdCost: {
                displayValue: '$302',
                value: 302.79,
                perL2Tx: { value: 6.0558000000000005, displayValue: '$6.05' },
              },
              gas: {
                displayValue: '13.90 K',
                value: 13903.52,
                perL2Tx: { value: 278.0704, displayValue: '278' },
              },
            },
            compute: {
              ethCost: {
                displayValue: 'Ξ0.2',
                value: 0.2,
                perL2Tx: { value: 0.004, displayValue: 'Ξ0.004' },
              },
              usdCost: {
                displayValue: '$419',
                value: 419.74,
                perL2Tx: { value: 8.3948, displayValue: '$8.39' },
              },
              gas: {
                displayValue: '19.27 K',
                value: 19273.24,
                perL2Tx: { value: 385.4648, displayValue: '385' },
              },
            },
            overhead: {
              ethCost: {
                displayValue: 'Ξ0.19',
                value: 0.19,
                perL2Tx: { value: 0.0038, displayValue: 'Ξ0.0038' },
              },
              usdCost: {
                displayValue: '$398',
                value: 398.91,
                perL2Tx: { value: 7.9782, displayValue: '$7.97' },
              },
              gas: {
                displayValue: '18.31 K',
                value: 18317.07,
                perL2Tx: { value: 366.3414, displayValue: '366' },
              },
            },
            txCount: { value: 50, displayValue: '50.00' },
          },
          last7d: {
            total: {
              ethCost: {
                displayValue: 'Ξ70.65',
                value: 70.65,
                perL2Tx: {
                  value: 0.20185714285714287,
                  displayValue: 'Ξ0.201857',
                },
              },
              usdCost: {
                displayValue: '$1.78 M',
                value: 1784416.2199999997,
                perL2Tx: { value: 5098.332057142857, displayValue: '$5.09 K' },
              },
              gas: {
                displayValue: '78.57 M',
                value: 78577469.37,
                perL2Tx: { value: 224507.05534285714, displayValue: '224 K' },
              },
            },
            blobs: {
              ethCost: {
                displayValue: 'Ξ12.66',
                value: 12.66,
                perL2Tx: {
                  value: 0.03617142857142857,
                  displayValue: 'Ξ0.036171',
                },
              },
              usdCost: {
                displayValue: '$269 K',
                value: 269551.20999999996,
                perL2Tx: { value: 770.1463142857142, displayValue: '$770' },
              },
              gas: {
                displayValue: '12.47 M',
                value: 12479272.91,
                perL2Tx: { value: 35655.06545714286, displayValue: '35.65 K' },
              },
            },
            calldata: {
              ethCost: {
                displayValue: 'Ξ24.69',
                value: 24.69,
                perL2Tx: {
                  value: 0.07054285714285714,
                  displayValue: 'Ξ0.070543',
                },
              },
              usdCost: {
                displayValue: '$675 K',
                value: 675446.7100000001,
                perL2Tx: { value: 1929.847742857143, displayValue: '$1.92 K' },
              },
              gas: {
                displayValue: '29.81 M',
                value: 29813077.18,
                perL2Tx: { value: 85180.22051428571, displayValue: '85.18 K' },
              },
            },
            compute: {
              ethCost: {
                displayValue: 'Ξ18.45',
                value: 18.45,
                perL2Tx: {
                  value: 0.052714285714285714,
                  displayValue: 'Ξ0.052714',
                },
              },
              usdCost: {
                displayValue: '$478 K',
                value: 478769.53,
                perL2Tx: { value: 1367.912942857143, displayValue: '$1.36 K' },
              },
              gas: {
                displayValue: '20.99 M',
                value: 20990917.209999997,
                perL2Tx: { value: 59974.04917142856, displayValue: '59.97 K' },
              },
            },
            overhead: {
              ethCost: {
                displayValue: 'Ξ14.85',
                value: 14.85,
                perL2Tx: {
                  value: 0.04242857142857143,
                  displayValue: 'Ξ0.042429',
                },
              },
              usdCost: {
                displayValue: '$360 K',
                value: 360648.76999999996,
                perL2Tx: { value: 1030.425057142857, displayValue: '$1.03 K' },
              },
              gas: {
                displayValue: '15.29 M',
                value: 15294202.07,
                perL2Tx: { value: 43697.7202, displayValue: '43.69 K' },
              },
            },
            txCount: { value: 350, displayValue: '350' },
          },
          last30d: {
            total: {
              ethCost: {
                displayValue: 'Ξ340',
                value: 340.72999999999996,
                perL2Tx: {
                  value: 0.22715333333333332,
                  displayValue: 'Ξ0.227153',
                },
              },
              usdCost: {
                displayValue: '$8.87 M',
                value: 8870955.690000001,
                perL2Tx: { value: 5913.9704600000005, displayValue: '$5.91 K' },
              },
              gas: {
                displayValue: '370 M',
                value: 370321866.56999993,
                perL2Tx: { value: 246881.24437999996, displayValue: '246 K' },
              },
            },
            blobs: {
              ethCost: {
                displayValue: 'Ξ86.14',
                value: 86.14000000000003,
                perL2Tx: {
                  value: 0.05742666666666669,
                  displayValue: 'Ξ0.057427',
                },
              },
              usdCost: {
                displayValue: '$2.17 M',
                value: 2172833.3099999996,
                perL2Tx: { value: 1448.5555399999998, displayValue: '$1.44 K' },
              },
              gas: {
                displayValue: '87.99 M',
                value: 87997717.19000001,
                perL2Tx: { value: 58665.14479333334, displayValue: '58.66 K' },
              },
            },
            calldata: {
              ethCost: {
                displayValue: 'Ξ95.44',
                value: 95.44,
                perL2Tx: {
                  value: 0.06362666666666666,
                  displayValue: 'Ξ0.063627',
                },
              },
              usdCost: {
                displayValue: '$2.51 M',
                value: 2515993.76,
                perL2Tx: { value: 1677.329173333333, displayValue: '$1.67 K' },
              },
              gas: {
                displayValue: '105 M',
                value: 105243959.65999998,
                perL2Tx: { value: 70162.63977333331, displayValue: '70.16 K' },
              },
            },
            compute: {
              ethCost: {
                displayValue: 'Ξ81.97',
                value: 81.97999999999999,
                perL2Tx: {
                  value: 0.054653333333333325,
                  displayValue: 'Ξ0.054653',
                },
              },
              usdCost: {
                displayValue: '$2.15 M',
                value: 2158352,
                perL2Tx: { value: 1438.9013333333332, displayValue: '$1.43 K' },
              },
              gas: {
                displayValue: '90.92 M',
                value: 90921035.49000001,
                perL2Tx: { value: 60614.023660000006, displayValue: '60.61 K' },
              },
            },
            overhead: {
              ethCost: {
                displayValue: 'Ξ77.17',
                value: 77.17,
                perL2Tx: {
                  value: 0.05144666666666667,
                  displayValue: 'Ξ0.051447',
                },
              },
              usdCost: {
                displayValue: '$2.02 M',
                value: 2023776.6199999996,
                perL2Tx: { value: 1349.1844133333332, displayValue: '$1.34 K' },
              },
              gas: {
                displayValue: '86.15 M',
                value: 86159154.22999999,
                perL2Tx: { value: 57439.43615333333, displayValue: '57.43 K' },
              },
            },
            txCount: { value: 1500, displayValue: '1.50 K' },
          },
          last90d: {
            total: {
              ethCost: {
                displayValue: 'Ξ920',
                value: 920.4700000000003,
                perL2Tx: {
                  value: 0.20454888888888895,
                  displayValue: 'Ξ0.204549',
                },
              },
              usdCost: {
                displayValue: '$22.59 M',
                value: 22591808.50999999,
                perL2Tx: { value: 5020.401891111109, displayValue: '$5.02 K' },
              },
              gas: {
                displayValue: '940 M',
                value: 940960714.4299998,
                perL2Tx: { value: 209102.3809844444, displayValue: '209 K' },
              },
            },
            blobs: {
              ethCost: {
                displayValue: 'Ξ246',
                value: 246.95000000000002,
                perL2Tx: {
                  value: 0.05487777777777778,
                  displayValue: 'Ξ0.054878',
                },
              },
              usdCost: {
                displayValue: '$5.99 M',
                value: 5993181.329999998,
                perL2Tx: { value: 1331.818073333333, displayValue: '$1.33 K' },
              },
              gas: {
                displayValue: '244 M',
                value: 244004265.51999998,
                perL2Tx: { value: 54223.17011555555, displayValue: '54.22 K' },
              },
            },
            calldata: {
              ethCost: {
                displayValue: 'Ξ223',
                value: 223.1899999999999,
                perL2Tx: {
                  value: 0.04959777777777776,
                  displayValue: 'Ξ0.049598',
                },
              },
              usdCost: {
                displayValue: '$5.47 M',
                value: 5471414.429999999,
                perL2Tx: { value: 1215.869873333333, displayValue: '$1.21 K' },
              },
              gas: {
                displayValue: '229 M',
                value: 229757162.35999998,
                perL2Tx: { value: 51057.14719111111, displayValue: '51.05 K' },
              },
            },
            compute: {
              ethCost: {
                displayValue: 'Ξ230',
                value: 230.62000000000003,
                perL2Tx: {
                  value: 0.0512488888888889,
                  displayValue: 'Ξ0.051249',
                },
              },
              usdCost: {
                displayValue: '$5.75 M',
                value: 5754826.7,
                perL2Tx: { value: 1278.8503777777778, displayValue: '$1.27 K' },
              },
              gas: {
                displayValue: '240 M',
                value: 240301947.95,
                perL2Tx: { value: 53400.43287777778, displayValue: '53.40 K' },
              },
            },
            overhead: {
              ethCost: {
                displayValue: 'Ξ219',
                value: 219.70999999999992,
                perL2Tx: {
                  value: 0.04882444444444443,
                  displayValue: 'Ξ0.048824',
                },
              },
              usdCost: {
                displayValue: '$5.37 M',
                value: 5372386.05,
                perL2Tx: { value: 1193.8635666666667, displayValue: '$1.19 K' },
              },
              gas: {
                displayValue: '226 M',
                value: 226897338.59999993,
                perL2Tx: { value: 50421.630799999984, displayValue: '50.42 K' },
              },
            },
            txCount: { value: 4500, displayValue: '4.50 K' },
          },
          last180d: {
            total: {
              ethCost: {
                displayValue: 'Ξ1.77 K',
                value: 1773.3600000000001,
                perL2Tx: {
                  value: 0.19704000000000002,
                  displayValue: 'Ξ0.19704',
                },
              },
              usdCost: {
                displayValue: '$42.38 M',
                value: 42385169.03,
                perL2Tx: { value: 4709.463225555555, displayValue: '$4.70 K' },
              },
              gas: {
                displayValue: '1.74 B',
                value: 1743827811.4499998,
                perL2Tx: { value: 193758.64571666665, displayValue: '193 K' },
              },
            },
            blobs: {
              ethCost: {
                displayValue: 'Ξ469',
                value: 469.2899999999999,
                perL2Tx: {
                  value: 0.052143333333333326,
                  displayValue: 'Ξ0.052143',
                },
              },
              usdCost: {
                displayValue: '$11.35 M',
                value: 11353906.749999998,
                perL2Tx: { value: 1261.5451944444442, displayValue: '$1.26 K' },
              },
              gas: {
                displayValue: '467 M',
                value: 467313244.4,
                perL2Tx: { value: 51923.693822222216, displayValue: '51.92 K' },
              },
            },
            calldata: {
              ethCost: {
                displayValue: 'Ξ443',
                value: 443.8200000000002,
                perL2Tx: {
                  value: 0.049313333333333355,
                  displayValue: 'Ξ0.049313',
                },
              },
              usdCost: {
                displayValue: '$10.64 M',
                value: 10643321.840000004,
                perL2Tx: { value: 1182.5913155555559, displayValue: '$1.18 K' },
              },
              gas: {
                displayValue: '438 M',
                value: 438171247.19000024,
                perL2Tx: { value: 48685.69413222225, displayValue: '48.68 K' },
              },
            },
            compute: {
              ethCost: {
                displayValue: 'Ξ447',
                value: 447.45999999999975,
                perL2Tx: {
                  value: 0.04971777777777775,
                  displayValue: 'Ξ0.049718',
                },
              },
              usdCost: {
                displayValue: '$10.75 M',
                value: 10756486.389999999,
                perL2Tx: { value: 1195.1651544444444, displayValue: '$1.19 K' },
              },
              gas: {
                displayValue: '439 M',
                value: 439080306.57999986,
                perL2Tx: { value: 48786.700731111094, displayValue: '48.78 K' },
              },
            },
            overhead: {
              ethCost: {
                displayValue: 'Ξ412',
                value: 412.78999999999985,
                perL2Tx: {
                  value: 0.04586555555555554,
                  displayValue: 'Ξ0.045866',
                },
              },
              usdCost: {
                displayValue: '$9.63 M',
                value: 9631454.05,
                perL2Tx: { value: 1070.1615611111113, displayValue: '$1.07 K' },
              },
              gas: {
                displayValue: '399 M',
                value: 399263013.2800001,
                perL2Tx: { value: 44362.55703111112, displayValue: '44.36 K' },
              },
            },
            txCount: { value: 9000, displayValue: '9.00 K' },
          },
          syncStatus: {
            displaySyncedUntil: '2024 April 04, 14:00 (UTC)',
            isSynced: true,
          },
        },
        costsWarning: undefined,
      },
      {
        name: 'OP Mainnet',
        shortName: undefined,
        slug: 'optimism',
        showProjectUnderReview: false,
        hasImplementationChanged: false,
        warning:
          'Fraud proof system is currently under development. Users need to trust block Proposer to submit correct L1 state roots.',
        redWarning: undefined,
        category: 'Optimistic Rollup',
        provider: 'OP Stack',
        purposes: ['Universal'],
        stage: {
          stage: 'Stage 0',
          missing: {
            nextStage: 'Stage 1',
            requirements: [
              'The proof system is still under development.',
              "Users' withdrawals can be censored by the permissioned operators.",
              'Upgrades executed by actors with more centralized control than a Security Council provide less than 7d for users to exit if the permissioned operator is down or censoring.',
              'The Security Council is not properly set up.',
            ],
          },
          summary: [
            {
              stage: 'Stage 0',
              requirements: [
                {
                  satisfied: true,
                  description: 'The project calls itself a rollup.',
                },
                {
                  satisfied: true,
                  description: 'L2 state roots are posted to Ethereum L1.',
                },
                {
                  satisfied: true,
                  description:
                    'Inputs for the state transition function are posted to L1.',
                },
                {
                  satisfied: true,
                  description:
                    'A source-available node exists that can recreate the state from L1 data. Please note that the L2BEAT team has not verified the validity of the node source code. [View code](https://github.com/ethereum-optimism/optimism/tree/develop/op-node)',
                },
              ],
            },
            {
              stage: 'Stage 1',
              requirements: [
                {
                  satisfied: false,
                  description: 'The proof system is still under development.',
                },
                {
                  satisfied: false,
                  description:
                    "Users' withdrawals can be censored by the permissioned operators.",
                },
                {
                  satisfied: false,
                  description:
                    'Upgrades executed by actors with more centralized control than a Security Council provide less than 7d for users to exit if the permissioned operator is down or censoring.',
                },
                {
                  satisfied: false,
                  description: 'The Security Council is not properly set up.',
                },
              ],
            },
            {
              stage: 'Stage 2',
              requirements: [
                {
                  satisfied: false,
                  description:
                    'Upgrades unrelated to on-chain provable bugs provide less than 30d to exit.',
                },
              ],
            },
          ],
          message: undefined,
        },
        data: {
          last24h: {
            total: {
              ethCost: {
                displayValue: 'Ξ20.76',
                value: 20.76,
                perL2Tx: { value: 0.4152, displayValue: 'Ξ0.4152' },
              },
              usdCost: {
                displayValue: '$614 K',
                value: 614196.22,
                perL2Tx: { value: 12283.9244, displayValue: '$12.28 K' },
              },
              gas: {
                displayValue: '29.96 M',
                value: 29966030.67,
                perL2Tx: { value: 599320.6134, displayValue: '599 K' },
              },
            },
            blobs: {
              ethCost: {
                displayValue: 'Ξ4.94',
                value: 4.94,
                perL2Tx: {
                  value: 0.09880000000000001,
                  displayValue: 'Ξ0.0988',
                },
              },
              usdCost: {
                displayValue: '$146 K',
                value: 146201.19,
                perL2Tx: { value: 2924.0238, displayValue: '$2.92 K' },
              },
              gas: {
                displayValue: '7.13 M',
                value: 7133012.47,
                perL2Tx: { value: 142660.2494, displayValue: '142 K' },
              },
            },
            calldata: {
              ethCost: {
                displayValue: 'Ξ8.44',
                value: 8.44,
                perL2Tx: {
                  value: 0.16879999999999998,
                  displayValue: 'Ξ0.1688',
                },
              },
              usdCost: {
                displayValue: '$249 K',
                value: 249705.2,
                perL2Tx: { value: 4994.104, displayValue: '$4.99 K' },
              },
              gas: {
                displayValue: '12.18 M',
                value: 12182871.65,
                perL2Tx: { value: 243657.43300000002, displayValue: '243 K' },
              },
            },
            compute: {
              ethCost: {
                displayValue: 'Ξ3.67',
                value: 3.67,
                perL2Tx: {
                  value: 0.07339999999999999,
                  displayValue: 'Ξ0.0734',
                },
              },
              usdCost: {
                displayValue: '$108 K',
                value: 108598.21,
                perL2Tx: { value: 2171.9642000000003, displayValue: '$2.17 K' },
              },
              gas: {
                displayValue: '5.29 M',
                value: 5298399.89,
                perL2Tx: { value: 105967.9978, displayValue: '105 K' },
              },
            },
            overhead: {
              ethCost: {
                displayValue: 'Ξ3.71',
                value: 3.71,
                perL2Tx: { value: 0.0742, displayValue: 'Ξ0.0742' },
              },
              usdCost: {
                displayValue: '$109 K',
                value: 109691.62,
                perL2Tx: { value: 2193.8324, displayValue: '$2.19 K' },
              },
              gas: {
                displayValue: '5.35 M',
                value: 5351746.66,
                perL2Tx: { value: 107034.9332, displayValue: '107 K' },
              },
            },
            txCount: { value: 50, displayValue: '50.00' },
          },
          last7d: {
            total: {
              ethCost: {
                displayValue: 'Ξ80.69',
                value: 80.69,
                perL2Tx: {
                  value: 0.23054285714285713,
                  displayValue: 'Ξ0.230543',
                },
              },
              usdCost: {
                displayValue: '$2.06 M',
                value: 2068997.8,
                perL2Tx: { value: 5911.422285714286, displayValue: '$5.91 K' },
              },
              gas: {
                displayValue: '86.56 M',
                value: 86560006.30000001,
                perL2Tx: { value: 247314.30371428575, displayValue: '247 K' },
              },
            },
            blobs: {
              ethCost: {
                displayValue: 'Ξ23.06',
                value: 23.060000000000002,
                perL2Tx: {
                  value: 0.0658857142857143,
                  displayValue: 'Ξ0.065886',
                },
              },
              usdCost: {
                displayValue: '$598 K',
                value: 598718.52,
                perL2Tx: { value: 1710.624342857143, displayValue: '$1.71 K' },
              },
              gas: {
                displayValue: '25.67 M',
                value: 25674903.24,
                perL2Tx: { value: 73356.8664, displayValue: '73.35 K' },
              },
            },
            calldata: {
              ethCost: {
                displayValue: 'Ξ19.63',
                value: 19.63,
                perL2Tx: {
                  value: 0.05608571428571428,
                  displayValue: 'Ξ0.056086',
                },
              },
              usdCost: {
                displayValue: '$500 K',
                value: 500151.34,
                perL2Tx: { value: 1429.0038285714286, displayValue: '$1.42 K' },
              },
              gas: {
                displayValue: '22.81 M',
                value: 22815225.439999998,
                perL2Tx: { value: 65186.35839999999, displayValue: '65.18 K' },
              },
            },
            compute: {
              ethCost: {
                displayValue: 'Ξ18.92',
                value: 18.92,
                perL2Tx: {
                  value: 0.05405714285714286,
                  displayValue: 'Ξ0.054057',
                },
              },
              usdCost: {
                displayValue: '$433 K',
                value: 433401.97000000003,
                perL2Tx: { value: 1238.291342857143, displayValue: '$1.23 K' },
              },
              gas: {
                displayValue: '17.97 M',
                value: 17974594.009999998,
                perL2Tx: { value: 51355.98288571428, displayValue: '51.35 K' },
              },
            },
            overhead: {
              ethCost: {
                displayValue: 'Ξ19.08',
                value: 19.080000000000002,
                perL2Tx: {
                  value: 0.054514285714285717,
                  displayValue: 'Ξ0.054514',
                },
              },
              usdCost: {
                displayValue: '$536 K',
                value: 536725.97,
                perL2Tx: { value: 1533.5027714285714, displayValue: '$1.53 K' },
              },
              gas: {
                displayValue: '20.09 M',
                value: 20095283.61,
                perL2Tx: { value: 57415.096028571425, displayValue: '57.41 K' },
              },
            },
            txCount: { value: 350, displayValue: '350' },
          },
          last30d: {
            total: {
              ethCost: {
                displayValue: 'Ξ271',
                value: 271.42999999999995,
                perL2Tx: {
                  value: 0.1809533333333333,
                  displayValue: 'Ξ0.180953',
                },
              },
              usdCost: {
                displayValue: '$6.29 M',
                value: 6291486.44,
                perL2Tx: { value: 4194.324293333334, displayValue: '$4.19 K' },
              },
              gas: {
                displayValue: '273 M',
                value: 273461128.1999999,
                perL2Tx: { value: 182307.41879999996, displayValue: '182 K' },
              },
            },
            blobs: {
              ethCost: {
                displayValue: 'Ξ64.66',
                value: 64.66,
                perL2Tx: {
                  value: 0.04310666666666666,
                  displayValue: 'Ξ0.043107',
                },
              },
              usdCost: {
                displayValue: '$1.41 M',
                value: 1418493.27,
                perL2Tx: { value: 945.66218, displayValue: '$945' },
              },
              gas: {
                displayValue: '59.84 M',
                value: 59846190.88999999,
                perL2Tx: { value: 39897.46059333333, displayValue: '39.89 K' },
              },
            },
            calldata: {
              ethCost: {
                displayValue: 'Ξ80.88',
                value: 80.88000000000001,
                perL2Tx: {
                  value: 0.05392000000000001,
                  displayValue: 'Ξ0.05392',
                },
              },
              usdCost: {
                displayValue: '$1.91 M',
                value: 1914755.5299999998,
                perL2Tx: { value: 1276.5036866666665, displayValue: '$1.27 K' },
              },
              gas: {
                displayValue: '85.47 M',
                value: 85470578.82999998,
                perL2Tx: { value: 56980.385886666656, displayValue: '56.98 K' },
              },
            },
            compute: {
              ethCost: {
                displayValue: 'Ξ56.39',
                value: 56.399999999999984,
                perL2Tx: {
                  value: 0.03759999999999999,
                  displayValue: 'Ξ0.0376',
                },
              },
              usdCost: {
                displayValue: '$1.27 M',
                value: 1276203.01,
                perL2Tx: { value: 850.8020066666667, displayValue: '$850' },
              },
              gas: {
                displayValue: '56.23 M',
                value: 56239941.16999999,
                perL2Tx: { value: 37493.29411333332, displayValue: '37.49 K' },
              },
            },
            overhead: {
              ethCost: {
                displayValue: 'Ξ69.49',
                value: 69.49000000000001,
                perL2Tx: {
                  value: 0.046326666666666676,
                  displayValue: 'Ξ0.046327',
                },
              },
              usdCost: {
                displayValue: '$1.68 M',
                value: 1682034.6300000004,
                perL2Tx: { value: 1121.3564200000003, displayValue: '$1.12 K' },
              },
              gas: {
                displayValue: '71.90 M',
                value: 71904417.31,
                perL2Tx: { value: 47936.27820666667, displayValue: '47.93 K' },
              },
            },
            txCount: { value: 1500, displayValue: '1.50 K' },
          },
          last90d: {
            total: {
              ethCost: {
                displayValue: 'Ξ932',
                value: 932.2399999999999,
                perL2Tx: {
                  value: 0.20716444444444443,
                  displayValue: 'Ξ0.207164',
                },
              },
              usdCost: {
                displayValue: '$22.65 M',
                value: 22651933.7,
                perL2Tx: { value: 5033.763044444444, displayValue: '$5.03 K' },
              },
              gas: {
                displayValue: '977 M',
                value: 977270150.1200001,
                perL2Tx: { value: 217171.14447111113, displayValue: '217 K' },
              },
            },
            blobs: {
              ethCost: {
                displayValue: 'Ξ228',
                value: 228.94000000000003,
                perL2Tx: {
                  value: 0.05087555555555556,
                  displayValue: 'Ξ0.050876',
                },
              },
              usdCost: {
                displayValue: '$5.39 M',
                value: 5395099.68,
                perL2Tx: { value: 1198.91104, displayValue: '$1.19 K' },
              },
              gas: {
                displayValue: '230 M',
                value: 230174164.99000004,
                perL2Tx: { value: 51149.81444222223, displayValue: '51.14 K' },
              },
            },
            calldata: {
              ethCost: {
                displayValue: 'Ξ241',
                value: 241.01999999999998,
                perL2Tx: {
                  value: 0.053559999999999997,
                  displayValue: 'Ξ0.05356',
                },
              },
              usdCost: {
                displayValue: '$6.00 M',
                value: 6005090.07,
                perL2Tx: { value: 1334.4644600000001, displayValue: '$1.33 K' },
              },
              gas: {
                displayValue: '258 M',
                value: 258712383.7600001,
                perL2Tx: { value: 57491.64083555558, displayValue: '57.49 K' },
              },
            },
            compute: {
              ethCost: {
                displayValue: 'Ξ223',
                value: 223.08999999999995,
                perL2Tx: {
                  value: 0.049575555555555546,
                  displayValue: 'Ξ0.049576',
                },
              },
              usdCost: {
                displayValue: '$5.41 M',
                value: 5410482.86,
                perL2Tx: { value: 1202.3295244444446, displayValue: '$1.20 K' },
              },
              gas: {
                displayValue: '237 M',
                value: 237544991.62000003,
                perL2Tx: { value: 52787.77591555556, displayValue: '52.78 K' },
              },
            },
            overhead: {
              ethCost: {
                displayValue: 'Ξ239',
                value: 239.18999999999997,
                perL2Tx: {
                  value: 0.05315333333333332,
                  displayValue: 'Ξ0.053153',
                },
              },
              usdCost: {
                displayValue: '$5.84 M',
                value: 5841261.089999999,
                perL2Tx: { value: 1298.0580199999997, displayValue: '$1.29 K' },
              },
              gas: {
                displayValue: '250 M',
                value: 250838609.74999988,
                perL2Tx: { value: 55741.91327777775, displayValue: '55.74 K' },
              },
            },
            txCount: { value: 4500, displayValue: '4.50 K' },
          },
          last180d: {
            total: {
              ethCost: {
                displayValue: 'Ξ1.80 K',
                value: 1802.8300000000008,
                perL2Tx: {
                  value: 0.20031444444444454,
                  displayValue: 'Ξ0.200314',
                },
              },
              usdCost: {
                displayValue: '$42.06 M',
                value: 42068701.88,
                perL2Tx: { value: 4674.300208888889, displayValue: '$4.67 K' },
              },
              gas: {
                displayValue: '1.82 B',
                value: 1820110763.2700007,
                perL2Tx: { value: 202234.5292522223, displayValue: '202 K' },
              },
            },
            blobs: {
              ethCost: {
                displayValue: 'Ξ454',
                value: 454.4500000000001,
                perL2Tx: {
                  value: 0.05049444444444445,
                  displayValue: 'Ξ0.050494',
                },
              },
              usdCost: {
                displayValue: '$10.39 M',
                value: 10394599.530000001,
                perL2Tx: { value: 1154.9555033333334, displayValue: '$1.15 K' },
              },
              gas: {
                displayValue: '448 M',
                value: 448785624.37999994,
                perL2Tx: { value: 49865.06937555555, displayValue: '49.86 K' },
              },
            },
            calldata: {
              ethCost: {
                displayValue: 'Ξ465',
                value: 465.09000000000015,
                perL2Tx: {
                  value: 0.05167666666666668,
                  displayValue: 'Ξ0.051677',
                },
              },
              usdCost: {
                displayValue: '$11.04 M',
                value: 11040984.429999998,
                perL2Tx: { value: 1226.7760477777776, displayValue: '$1.22 K' },
              },
              gas: {
                displayValue: '478 M',
                value: 478383505.0399999,
                perL2Tx: { value: 53153.72278222221, displayValue: '53.15 K' },
              },
            },
            compute: {
              ethCost: {
                displayValue: 'Ξ432',
                value: 432,
                perL2Tx: { value: 0.048, displayValue: 'Ξ0.048' },
              },
              usdCost: {
                displayValue: '$10.14 M',
                value: 10144584.619999997,
                perL2Tx: { value: 1127.1760688888885, displayValue: '$1.12 K' },
              },
              gas: {
                displayValue: '444 M',
                value: 444379800.18999994,
                perL2Tx: { value: 49375.53335444444, displayValue: '49.37 K' },
              },
            },
            overhead: {
              ethCost: {
                displayValue: 'Ξ451',
                value: 451.28999999999996,
                perL2Tx: {
                  value: 0.05014333333333333,
                  displayValue: 'Ξ0.050143',
                },
              },
              usdCost: {
                displayValue: '$10.48 M',
                value: 10488533.300000003,
                perL2Tx: { value: 1165.3925888888891, displayValue: '$1.16 K' },
              },
              gas: {
                displayValue: '448 M',
                value: 448561833.66,
                perL2Tx: { value: 49840.203740000004, displayValue: '49.84 K' },
              },
            },
            txCount: { value: 9000, displayValue: '9.00 K' },
          },
          syncStatus: {
            displaySyncedUntil: '2024 April 04, 14:00 (UTC)',
            isSynced: true,
          },
        },
        costsWarning: undefined,
      },
      {
        name: 'Paradex',
        shortName: undefined,
        slug: 'paradex',
        showProjectUnderReview: false,
        hasImplementationChanged: false,
        warning: undefined,
        redWarning: undefined,
        category: 'ZK Rollup',
        provider: 'Starknet',
        purposes: ['Exchange'],
        stage: {
          stage: 'Stage 0',
          missing: {
            nextStage: 'Stage 1',
            requirements: [
              "Users' withdrawals can be censored by the permissioned operators.",
              'Upgrades executed by actors with more centralized control than a Security Council provide less than 7d for users to exit if the permissioned operator is down or censoring.',
            ],
          },
          summary: [
            {
              stage: 'Stage 0',
              requirements: [
                {
                  satisfied: true,
                  description: 'The project calls itself a rollup.',
                },
                {
                  satisfied: true,
                  description: 'L2 state roots are posted to Ethereum L1.',
                },
                {
                  satisfied: true,
                  description:
                    'Inputs for the state transition function are posted to L1.',
                },
                {
                  satisfied: false,
                  description:
                    'No source-available node exists that can recreate the state from L1 data.',
                },
              ],
            },
            {
              stage: 'Stage 1',
              requirements: [
                {
                  satisfied: true,
                  description:
                    'A complete and functional proof system is deployed.',
                },
                {
                  satisfied: false,
                  description:
                    "Users' withdrawals can be censored by the permissioned operators.",
                },
                {
                  satisfied: false,
                  description:
                    'Upgrades executed by actors with more centralized control than a Security Council provide less than 7d for users to exit if the permissioned operator is down or censoring.',
                },
              ],
            },
            {
              stage: 'Stage 2',
              requirements: [
                {
                  satisfied: false,
                  description:
                    'Upgrades unrelated to on-chain provable bugs provide less than 30d to exit.',
                },
              ],
            },
          ],
          message: {
            type: 'warning',
            text: 'There is no available node software that can reconstruct the state from L1 data, hence there is no way to verify that this system is a rollup.',
          },
        },
        data: undefined,
        costsWarning: undefined,
      },
    ],
  },
}
export default meta
type Story = StoryObj<typeof ScalingCostsView>

export const Primary: Story = {}
