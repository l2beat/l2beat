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
                    'A source-available node exists that can recreate the state from L1 data. [View code](https://github.com/OffchainLabs/nitro/)',
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
        costs: {
          last24h: {
            total: {
              ethCost: { displayValue: 'Ξ7.52', value: 7.524754309322546 },
              usdCost: { displayValue: '$26.44 K', value: 26446.618109837746 },
              gas: { displayValue: '331 M', value: 331918253 },
            },
            blobs: {
              ethCost: { displayValue: 'Ξ5.15', value: 5.154321003134575 },
              usdCost: { displayValue: '$18.06 K', value: 18061.546977974216 },
              gas: { displayValue: '269 M', value: 269746176 },
            },
            calldata: {
              ethCost: { displayValue: 'Ξ0.0163', value: 0.016327129111335274 },
              usdCost: { displayValue: '$57.74', value: 57.74972084283909 },
              gas: { displayValue: '428 K', value: 428824 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ2.06', value: 2.0619286139716593 },
              usdCost: { displayValue: '$7.29 K', value: 7293.790604665481 },
              gas: { displayValue: '54.07 M', value: 54078253 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ0.2922', value: 0.2921775631049731 },
              usdCost: { displayValue: '$1.03 K', value: 1033.530806355203 },
              gas: { displayValue: '7.66 M', value: 7665000 },
            },
          },
          last7d: {
            total: {
              ethCost: { displayValue: 'Ξ16.83', value: 16.83588256476522 },
              usdCost: { displayValue: '$58.98 K', value: 58983.32959950466 },
              gas: { displayValue: '2.23 B', value: 2236046257 },
            },
            blobs: {
              ethCost: { displayValue: 'Ξ5.15', value: 5.154321004918042 },
              usdCost: { displayValue: '$18.06 K', value: 18061.546984219713 },
              gas: { displayValue: '1.81 B', value: 1815085056 },
            },
            calldata: {
              ethCost: { displayValue: 'Ξ0.0807', value: 0.08070578441962754 },
              usdCost: { displayValue: '$282', value: 282.6714340791739 },
              gas: { displayValue: '2.92 M', value: 2923028 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ10.16', value: 10.161120282716295 },
              usdCost: { displayValue: '$35.59 K', value: 35595.650764372964 },
              gas: { displayValue: '366 M', value: 366105173 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ1.43', value: 1.439735492711041 },
              usdCost: { displayValue: '$5.04 K', value: 5043.460416832834 },
              gas: { displayValue: '51.93 M', value: 51933000 },
            },
          },
          last30d: {
            total: {
              ethCost: { displayValue: 'Ξ2.58 K', value: 2584.0425247062967 },
              usdCost: { displayValue: '$9.50 M', value: 9505650.963098465 },
              gas: { displayValue: '44.87 B', value: 44872360450 },
            },
            blobs: {
              ethCost: { displayValue: 'Ξ5.15', value: 5.154321006318542 },
              usdCost: { displayValue: '$18.06 K', value: 18061.54698914002 },
              gas: { displayValue: '3.21 B', value: 3214147584 },
            },
            calldata: {
              ethCost: { displayValue: 'Ξ2.18 K', value: 2186.2705861056957 },
              usdCost: { displayValue: '$8.04 M', value: 8046558.97856826 },
              gas: { displayValue: '35.01 B', value: 35014371148 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ359', value: 359.9202050933545 },
              usdCost: { displayValue: '$1.32 M', value: 1321180.2655728345 },
              gas: { displayValue: '6.07 B', value: 6075938718 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ32.69', value: 32.697412500927854 },
              usdCost: { displayValue: '$119 K', value: 119850.17196824217 },
              gas: { displayValue: '567 M', value: 567903000 },
            },
          },
          last90d: {
            total: {
              ethCost: { displayValue: 'Ξ6.83 K', value: 6836.812025208052 },
              usdCost: { displayValue: '$20.29 M', value: 20293025.540765136 },
              gas: { displayValue: '202 B', value: 202876281580 },
            },
            blobs: {
              ethCost: { displayValue: 'Ξ5.15', value: 5.154321006318542 },
              usdCost: { displayValue: '$18.06 K', value: 18061.54698914002 },
              gas: { displayValue: '3.21 B', value: 3214147584 },
            },
            calldata: {
              ethCost: { displayValue: 'Ξ5.82 K', value: 5829.29851371252 },
              usdCost: { displayValue: '$17.28 M', value: 17286849.756874472 },
              gas: { displayValue: '170 B', value: 170375369956 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ920', value: 920.2159172847897 },
              usdCost: { displayValue: '$2.74 M', value: 2742848.253484513 },
              gas: { displayValue: '26.88 B', value: 26882411040 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ82.14', value: 82.14327320442565 },
              usdCost: { displayValue: '$245 K', value: 245265.9834170837 },
              gas: { displayValue: '2.40 B', value: 2404353000 },
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
                    'A source-available node exists that can recreate the state from L1 data. [View code](https://github.com/ethereum-optimism/optimism/tree/develop/op-node)',
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
        costs: {
          last24h: {
            total: {
              ethCost: { displayValue: 'Ξ5.58', value: 5.581502362879083 },
              usdCost: { displayValue: '$19.56 K', value: 19560.036788374604 },
              gas: { displayValue: '245 M', value: 245035327 },
            },
            blobs: {
              ethCost: { displayValue: 'Ξ5.26', value: 5.262037014377394 },
              usdCost: { displayValue: '$18.43 K', value: 18432.482336290148 },
              gas: { displayValue: '236 M', value: 236716032 },
            },
            calldata: {
              ethCost: { displayValue: 'Ξ0.0012', value: 0.00117410464987656 },
              usdCost: { displayValue: '$4.14', value: 4.144995979486967 },
              gas: { displayValue: '33.06 K', value: 33060 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ0.0526', value: 0.05263650963138011 },
              usdCost: { displayValue: '$185', value: 185.82471224853253 },
              gas: { displayValue: '1.48 M', value: 1482235 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ0.2657', value: 0.265654734220428 },
              usdCost: { displayValue: '$937', value: 937.5847438564527 },
              gas: { displayValue: '6.80 M', value: 6804000 },
            },
          },
          last7d: {
            total: {
              ethCost: { displayValue: 'Ξ6.69', value: 6.693853010692087 },
              usdCost: { displayValue: '$23.45 K', value: 23454.054358097386 },
              gas: { displayValue: '1.35 B', value: 1357829911 },
            },
            blobs: {
              ethCost: { displayValue: 'Ξ5.26', value: 5.262037015661991 },
              usdCost: { displayValue: '$18.43 K', value: 18432.482340811814 },
              gas: { displayValue: '1.30 B', value: 1308229632 },
            },
            calldata: {
              ethCost: { displayValue: 'Ξ0.0063', value: 0.006280802270900054 },
              usdCost: { displayValue: '$21.93', value: 21.93459779777728 },
              gas: { displayValue: '239 K', value: 239964 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ0.2817', value: 0.2816568377562826 },
              usdCost: { displayValue: '$983', value: 983.6335931625069 },
              gas: { displayValue: '10.76 M', value: 10762315 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ1.14', value: 1.1438783550028597 },
              usdCost: { displayValue: '$4.01 K', value: 4016.0038263253346 },
              gas: { displayValue: '38.59 M', value: 38598000 },
            },
          },
          last30d: {
            total: {
              ethCost: { displayValue: 'Ξ1.97 K', value: 1976.3745351914977 },
              usdCost: { displayValue: '$7.15 M', value: 7155205.837441184 },
              gas: { displayValue: '32.46 B', value: 32460669079 },
            },
            blobs: {
              ethCost: { displayValue: 'Ξ5.26', value: 5.262037016805556 },
              usdCost: { displayValue: '$18.43 K', value: 18432.48234490283 },
              gas: { displayValue: '2.45 B', value: 2451046400 },
            },
            calldata: {
              ethCost: { displayValue: 'Ξ1.94 K', value: 1943.6129946779868 },
              usdCost: { displayValue: '$7.03 M', value: 7037314.978041533 },
              gas: { displayValue: '29.54 B', value: 29543916724 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ2.20', value: 2.2038065260882 },
              usdCost: { displayValue: '$8.04 K', value: 8041.1071647297995 },
              gas: { displayValue: '46.33 M', value: 46335955 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ25.29', value: 25.29569697061388 },
              usdCost: { displayValue: '$91.41 K', value: 91417.26989001692 },
              gas: { displayValue: '419 M', value: 419370000 },
            },
          },
          last90d: {
            total: {
              ethCost: { displayValue: 'Ξ4.78 K', value: 4780.266393656209 },
              usdCost: { displayValue: '$14.37 M', value: 14371430.589691268 },
              gas: { displayValue: '132 B', value: 132503820809 },
            },
            blobs: {
              ethCost: { displayValue: 'Ξ5.26', value: 5.262037016805556 },
              usdCost: { displayValue: '$18.43 K', value: 18432.48234490283 },
              gas: { displayValue: '2.45 B', value: 2451046400 },
            },
            calldata: {
              ethCost: { displayValue: 'Ξ4.71 K', value: 4712.789179329086 },
              usdCost: { displayValue: '$14.16 M', value: 14164275.88059107 },
              gas: { displayValue: '128 B', value: 128342849544 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ4.70', value: 4.700444609810849 },
              usdCost: { displayValue: '$14.40 K', value: 14409.50982864214 },
              gas: { displayValue: '139 M', value: 139103865 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ57.51', value: 57.51473270044391 },
              usdCost: { displayValue: '$174 K', value: 174312.71692656702 },
              gas: { displayValue: '1.57 B', value: 1570821000 },
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
                    'A source-available node exists that can recreate the state from L1 data. [View code](https://github.com/ethereum-optimism/optimism/tree/develop/op-node)',
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
        costs: {
          last24h: {
            total: {
              ethCost: { displayValue: 'Ξ7.28', value: 7.281951224703787 },
              usdCost: { displayValue: '$25.51 K', value: 25511.775583999566 },
              gas: { displayValue: '315 M', value: 315081902 },
            },
            blobs: {
              ethCost: { displayValue: 'Ξ6.89', value: 6.89403653105711 },
              usdCost: { displayValue: '$24.14 K', value: 24144.03856568876 },
              gas: { displayValue: '304 M', value: 304873472 },
            },
            calldata: {
              ethCost: { displayValue: 'Ξ0.0013', value: 0.001272412992623772 },
              usdCost: { displayValue: '$4.48', value: 4.482032006944384 },
              gas: { displayValue: '32.72 K', value: 32724 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ0.0576', value: 0.05761817555690579 },
              usdCost: { displayValue: '$202', value: 202.9588520847817 },
              gas: { displayValue: '1.48 M', value: 1481706 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ0.329', value: 0.329024105097135 },
              usdCost: { displayValue: '$1.16 K', value: 1160.296134219068 },
              gas: { displayValue: '8.69 M', value: 8694000 },
            },
          },
          last7d: {
            total: {
              ethCost: { displayValue: 'Ξ8.69', value: 8.693157159356643 },
              usdCost: { displayValue: '$30.43 K', value: 30431.870058562414 },
              gas: { displayValue: '1.86 B', value: 1860325206 },
            },
            blobs: {
              ethCost: { displayValue: 'Ξ6.89', value: 6.894036532751817 },
              usdCost: { displayValue: '$24.14 K', value: 24144.038571607573 },
              gas: { displayValue: '1.79 B', value: 1796997120 },
            },
            calldata: {
              ethCost: {
                displayValue: 'Ξ0.0066',
                value: 0.0066096126704098665,
              },
              usdCost: { displayValue: '$23.09', value: 23.09661507000829 },
              gas: { displayValue: '237 K', value: 237612 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ0.2993', value: 0.2992855768956348 },
              usdCost: { displayValue: '$1.04 K', value: 1045.820408861562 },
              gas: { displayValue: '10.75 M', value: 10758474 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ1.49', value: 1.493225437038448 },
              usdCost: { displayValue: '$5.21 K', value: 5218.914463023293 },
              gas: { displayValue: '52.33 M', value: 52332000 },
            },
          },
          last30d: {
            total: {
              ethCost: { displayValue: 'Ξ1.21 K', value: 1216.5631488789986 },
              usdCost: { displayValue: '$4.49 M', value: 4496987.106462731 },
              gas: { displayValue: '22.54 B', value: 22546240658 },
            },
            blobs: {
              ethCost: { displayValue: 'Ξ6.89', value: 6.894036534348862 },
              usdCost: { displayValue: '$24.14 K', value: 24144.038577311134 },
              gas: { displayValue: '3.39 B', value: 3392798720 },
            },
            calldata: {
              ethCost: { displayValue: 'Ξ1.18 K', value: 1181.3850213744659 },
              usdCost: { displayValue: '$4.37 M', value: 4370837.068280052 },
              gas: { displayValue: '18.65 B', value: 18650813520 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ2.22', value: 2.225734667129156 },
              usdCost: { displayValue: '$8.12 K', value: 8125.130211788333 },
              gas: { displayValue: '46.31 M', value: 46319418 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ26.05', value: 26.058356303054953 },
              usdCost: { displayValue: '$93.88 K', value: 93880.86939356709 },
              gas: { displayValue: '456 M', value: 456309000 },
            },
          },
          last90d: {
            total: {
              ethCost: { displayValue: 'Ξ3.09 K', value: 3090.9557758243777 },
              usdCost: { displayValue: '$9.29 M', value: 9292964.69695621 },
              gas: { displayValue: '91.63 B', value: 91634417594 },
            },
            blobs: {
              ethCost: { displayValue: 'Ξ6.89', value: 6.894036534348862 },
              usdCost: { displayValue: '$24.14 K', value: 24144.038577311134 },
              gas: { displayValue: '3.39 B', value: 3392798720 },
            },
            calldata: {
              ethCost: { displayValue: 'Ξ3.00 K', value: 3003.854344414997 },
              usdCost: { displayValue: '$9.03 M', value: 9034707.22884277 },
              gas: { displayValue: '85.81 B', value: 85815526776 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ4.62', value: 4.624852282003684 },
              usdCost: { displayValue: '$14.24 K', value: 14240.300249364149 },
              gas: { displayValue: '139 M', value: 139087098 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ75.58', value: 75.58254259301584 },
              usdCost: { displayValue: '$219 K', value: 219873.1292868593 },
              gas: { displayValue: '2.28 B', value: 2287005000 },
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
        showProjectUnderReview: true,
        category: 'Optimistic Rollup',
        provider: 'OP Stack',
        purposes: ['Universal', 'DeFi'],
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
          message: {
            type: 'warning',
            text: 'There is no available node software that can reconstruct the state from L1 data, hence there is no way to verify that this system is a rollup.',
          },
        },
        costs: {
          last24h: {
            total: {
              ethCost: { displayValue: 'Ξ39.93', value: 39.93625596428643 },
              usdCost: { displayValue: '$141 K', value: 141013.90700052795 },
              gas: { displayValue: '1.06 B', value: 1063415923 },
            },
            blobs: undefined,
            calldata: {
              ethCost: { displayValue: 'Ξ39.32', value: 39.32109150755325 },
              usdCost: { displayValue: '$138 K', value: 138841.16521035065 },
              gas: { displayValue: '1.04 B', value: 1047141456 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ0.0548', value: 0.054829936359908696 },
              usdCost: { displayValue: '$193', value: 193.5652307319448 },
              gas: { displayValue: '1.53 M', value: 1532467 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ0.5603', value: 0.560334520373313 },
              usdCost: { displayValue: '$1.97 K', value: 1979.1765594452181 },
              gas: { displayValue: '14.74 M', value: 14742000 },
            },
          },
          last7d: {
            total: {
              ethCost: { displayValue: 'Ξ178', value: 178.9990085164456 },
              usdCost: { displayValue: '$627 K', value: 627301.3175442297 },
              gas: { displayValue: '6.57 B', value: 6572318107 },
            },
            blobs: undefined,
            calldata: {
              ethCost: { displayValue: 'Ξ176', value: 176.22800367476424 },
              usdCost: { displayValue: '$617 K', value: 617595.4451220351 },
              gas: { displayValue: '6.47 B', value: 6470030064 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ0.2829', value: 0.28286927613585744 },
              usdCost: { displayValue: '$988', value: 988.3299337000668 },
              gas: { displayValue: '11.12 M', value: 11127043 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ2.48', value: 2.4881355655456 },
              usdCost: { displayValue: '$8.71 K', value: 8717.542488493227 },
              gas: { displayValue: '91.16 M', value: 91161000 },
            },
          },
          last30d: {
            total: {
              ethCost: { displayValue: 'Ξ1.15 K', value: 1159.4229486319493 },
              usdCost: { displayValue: '$4.18 M', value: 4188969.4293577736 },
              gas: { displayValue: '23.97 B', value: 23977925339 },
            },
            blobs: undefined,
            calldata: {
              ethCost: { displayValue: 'Ξ1.13 K', value: 1138.599378274834 },
              usdCost: { displayValue: '$4.11 M', value: 4113558.3904188196 },
              gas: { displayValue: '23.55 B', value: 23550486088 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ2.29', value: 2.295875793501065 },
              usdCost: { displayValue: '$8.37 K', value: 8376.90695032407 },
              gas: { displayValue: '47.90 M', value: 47906251 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ18.52', value: 18.527694563610392 },
              usdCost: { displayValue: '$67.03 K', value: 67034.13198862424 },
              gas: { displayValue: '379 M', value: 379533000 },
            },
          },
          last90d: {
            total: {
              ethCost: { displayValue: 'Ξ1.16 K', value: 1162.866956779769 },
              usdCost: { displayValue: '$4.19 M', value: 4199667.7942168545 },
              gas: { displayValue: '24.07 B', value: 24077521243 },
            },
            blobs: undefined,
            calldata: {
              ethCost: { displayValue: 'Ξ1.14 K', value: 1141.1294676805876 },
              usdCost: { displayValue: '$4.12 M', value: 4121414.959560203 },
              gas: { displayValue: '23.62 B', value: 23624114448 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ2.42', value: 2.4298321252684985 },
              usdCost: { displayValue: '$8.79 K', value: 8792.70633858953 },
              gas: { displayValue: '51.71 M', value: 51718795 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ19.30', value: 19.307656973908962 },
              usdCost: { displayValue: '$69.46 K', value: 69460.12831805981 },
              gas: { displayValue: '401 M', value: 401688000 },
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
        category: 'ZK Rollup',
        provider: 'ZK Stack',
        purposes: ['Universal'],
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
                  satisfied: true,
                  description:
                    'A source-available node exists that can recreate the state from L1 data. [View code](https://github.com/matter-labs/zksync-era)',
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
          message: undefined,
        },
        costs: {
          last24h: {
            total: {
              ethCost: { displayValue: 'Ξ10.78', value: 10.785002552468061 },
              usdCost: { displayValue: '$38.05 K', value: 38058.43924563794 },
              gas: { displayValue: '310 M', value: 310651104 },
            },
            blobs: {
              ethCost: { displayValue: 'Ξ1.76', value: 1.7668648555574733 },
              usdCost: { displayValue: '$6.18 K', value: 6186.792233067411 },
              gas: { displayValue: '80.47 M', value: 80478208 },
            },
            calldata: {
              ethCost: { displayValue: 'Ξ0.5804', value: 0.5803662350122668 },
              usdCost: { displayValue: '$2.05 K', value: 2051.2161597752543 },
              gas: { displayValue: '14.58 M', value: 14584692 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ7.92', value: 7.929926474599262 },
              usdCost: { displayValue: '$28.02 K', value: 28025.734743624682 },
              gas: { displayValue: '202 M', value: 202799204 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ0.5078', value: 0.5078449872990484 },
              usdCost: { displayValue: '$1.79 K', value: 1794.6961091706228 },
              gas: { displayValue: '12.78 M', value: 12789000 },
            },
          },
          last7d: {
            total: {
              ethCost: { displayValue: 'Ξ49.71', value: 49.7134780139355 },
              usdCost: { displayValue: '$173 K', value: 173809.64617206933 },
              gas: { displayValue: '2.38 B', value: 2383504717 },
            },
            blobs: {
              ethCost: { displayValue: 'Ξ1.76', value: 1.766864856131087 },
              usdCost: { displayValue: '$6.18 K', value: 6186.792235066855 },
              gas: { displayValue: '587 M', value: 587726848 },
            },
            calldata: {
              ethCost: { displayValue: 'Ξ2.98', value: 2.985126024433168 },
              usdCost: { displayValue: '$10.43 K', value: 10439.65335754735 },
              gas: { displayValue: '110 M', value: 110387328 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ42.37', value: 42.37989659066142 },
              usdCost: { displayValue: '$148 K', value: 148157.73586752856 },
              gas: { displayValue: '1.59 B', value: 1590071541 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ2.58', value: 2.5815905427095878 },
              usdCost: { displayValue: '$9.02 K', value: 9025.464711926337 },
              gas: { displayValue: '95.31 M', value: 95319000 },
            },
          },
          last30d: {
            total: {
              ethCost: { displayValue: 'Ξ1.64 K', value: 1646.0888167193534 },
              usdCost: { displayValue: '$5.96 M', value: 5961164.36912599 },
              gas: { displayValue: '29.98 B', value: 29984704846 },
            },
            blobs: {
              ethCost: { displayValue: 'Ξ1.76', value: 1.7668648569388543 },
              usdCost: { displayValue: '$6.18 K', value: 6186.792237981121 },
              gas: { displayValue: '1.39 B', value: 1394737152 },
            },
            calldata: {
              ethCost: { displayValue: 'Ξ994', value: 994.9601554818796 },
              usdCost: { displayValue: '$3.60 M', value: 3601733.0748043875 },
              gas: { displayValue: '16.34 B', value: 16341954652 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ609', value: 609.7222317827074 },
              usdCost: { displayValue: '$2.20 M', value: 2209295.0968736825 },
              gas: { displayValue: '11.49 B', value: 11499510042 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ39.63', value: 39.63956459782161 },
              usdCost: { displayValue: '$143 K', value: 143949.4052099189 },
              gas: { displayValue: '748 M', value: 748503000 },
            },
          },
          last90d: {
            total: {
              ethCost: { displayValue: 'Ξ5.85 K', value: 5853.594491065604 },
              usdCost: { displayValue: '$16.70 M', value: 16702249.57057045 },
              gas: { displayValue: '173 B', value: 173861907446 },
            },
            blobs: {
              ethCost: { displayValue: 'Ξ1.76', value: 1.7668648569388543 },
              usdCost: { displayValue: '$6.18 K', value: 6186.792237981121 },
              gas: { displayValue: '1.39 B', value: 1394737152 },
            },
            calldata: {
              ethCost: { displayValue: 'Ξ3.66 K', value: 3669.3208436832415 },
              usdCost: { displayValue: '$10.46 M', value: 10466105.024204645 },
              gas: { displayValue: '107 B', value: 107444994640 },
            },
            compute: {
              ethCost: { displayValue: 'Ξ2.05 K', value: 2054.6955648676944 },
              usdCost: { displayValue: '$5.86 M', value: 5862920.396739638 },
              gas: { displayValue: '61.24 B', value: 61244548654 },
            },
            overhead: {
              ethCost: { displayValue: 'Ξ127', value: 127.8112176576333 },
              usdCost: { displayValue: '$367 K', value: 367037.3573881276 },
              gas: { displayValue: '3.77 B', value: 3777627000 },
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
