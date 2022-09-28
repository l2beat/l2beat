import { ProjectId, UnixTime } from '@l2beat/types'

import {
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
} from './common'
import { Layer2 } from './types'

export const fuelv1: Layer2 = {
  id: ProjectId('fuelv1'),
  display: {
    name: 'Fuel v1',
    slug: 'fuelv1',
    description:
      'Fuel aims to be a complete optimistic rollup with low transaction costs, high speed and high throughput.',
    purpose: 'Payments',
    links: {
      websites: ['https://fuel.sh/'],
      apps: [],
      documentation: ['https://docs.fuel.sh/'],
      explorers: ['https://mainnet.fuel.sh/network/'],
      repositories: ['https://github.com/FuelLabs/fuel-v1-contracts'],
      socialMedia: [
        'https://discord.gg/xfpK4Pe',
        'https://twitter.com/fuellabs_',
      ],
    },
  },
  config: {
    escrows: [
      {
        address: '0x6880f6Fd960D1581C2730a451A22EED1081cfD72',
        sinceTimestamp: new UnixTime(1612414780),
        tokens: ['DAI', 'USDC', 'USDT'],
      },
    ],
    events: [],
  },
  riskView: {
    stateValidation: RISK_VIEW.STATE_FP_1R,
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    upgradeability: RISK_VIEW.UPGRADABLE_NO,
    sequencerFailure: RISK_VIEW.SEQUENCER_PROPOSE_BLOCKS,
    validatorFailure: RISK_VIEW.VALIDATOR_PROPOSE_BLOCKS,
  },
  technology: {
    category: 'Optimistic Rollup',
    stateCorrectness: {
      ...STATE_CORRECTNESS.FRAUD_PROOFS,
      references: [
        {
          text: 'Background - Fuel documentation',
          href: 'https://docs.fuel.sh/v1.1.0/Concepts/Fundamentals/Fuel%20Overview.html#background',
        },
      ],
    },
    dataAvailability: {
      ...DATA_AVAILABILITY.ON_CHAIN,
      references: [
        {
          text: 'Background - Fuel documentation',
          href: 'https://docs.fuel.sh/v1.1.0/Concepts/Fundamentals/Fuel%20Overview.html#background',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_SEQUENCER,
      references: [
        {
          text: 'Architecture: A High-Level View - Fuel documentation',
          href: 'https://docs.fuel.sh/v1.1.0/Concepts/Fundamentals/Fuel%20Overview.html#architectureahighlevelview',
        },
        {
          text: 'Mainnet deployment parameters - Fuel documentation',
          href: 'https://docs.fuel.sh/v1.1.0/Concepts/Fundamentals/Deployment%20Parameters.html#mainnet',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.PROPOSE_OWN_BLOCKS,
      references: [
        {
          text: 'Architecture: A High-Level View - Fuel documentation',
          href: 'https://docs.fuel.sh/v1.1.0/Concepts/Fundamentals/Fuel%20Overview.html#architectureahighlevelview',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('optimistic', 'merkle proof'),
        references: [
          {
            text: 'Withdraw.yulp#L40 - Fuel documentation',
            href: 'https://github.com/FuelLabs/fuel-v1-contracts/blob/master/src/Withdraw.yulp#L40',
          },
        ],
      },
    ],
  },
  contracts: {
    addresses: [
      {
        address: '0x6880f6Fd960D1581C2730a451A22EED1081cfD72',
        name: 'Fuel',
      },
    ],
    risks: [],
  },
  news: [
    {
      date: '2020-09-15',
      name: 'Inside Fuel — Summer 2022',
      link: 'https://fuel-labs.ghost.io/introducing-beta-1-testnet/',
    },
    {
      date: '2020-09-08',
      name: 'Launch of the new Fuel "Beta-1" testnet',
      link: 'https://fuel-labs.ghost.io/introducing-beta-1-testnet/',
    },
    {
      date: '2022-09-06',
      name: 'Fuel Labs Announces $80 Million of Support',
      link: 'https://fuel-labs.ghost.io/fuel-labs-announces-80-million-of-support-for-the-fastest-modular-execution-layer/',
    },
  ],
}
