import { RISK, TECHNOLOGY } from './common'
import { Project } from './types'

export const fuel: Project = {
  name: 'Fuel',
  slug: 'fuel',
  bridges: [
    {
      address: '0x6880f6Fd960D1581C2730a451A22EED1081cfD72',
      sinceBlock: 11787727,
      tokens: ['DAI', 'USDC', 'USDT'],
    },
  ],
  details: {
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
    technologyName: 'Optimistic Rollup',
    technologyDetails: 'UTXO',
    purpose: 'Payments',
    riskView: {
      stateCorrectness: RISK.FRAUD_PROOFS,
      dataAvailability: RISK.DATA_ON_CHAIN,
      censorshipResistance: RISK.FORCE_ANY_TRANSACTION,
      upgradeability: RISK.IMMUTABLE,
      owner: RISK.NO_OWNER,
    },
    technology: {
      category: {
        name: 'Optimistic Rollup',
        references: [],
      },
      stateCorrectness: {
        ...TECHNOLOGY.FRAUD_PROOFS,
        references: [
          {
            text: 'Background - Fuel documentation',
            href: 'https://docs.fuel.sh/v1.1.0/Concepts/Fundamentals/Fuel%20Overview.html#background',
          },
        ],
      },
      dataAvailability: {
        ...TECHNOLOGY.ON_CHAIN_DATA,
        references: [
          {
            text: 'Background - Fuel documentation',
            href: 'https://docs.fuel.sh/v1.1.0/Concepts/Fundamentals/Fuel%20Overview.html#background',
          },
        ],
      },
      operator: {
        name: 'Block production is partially centralized.',
        description:
          'While anyone can propose new blocks the Fuel operator has a short period of time (5 minutes) where they are the only one that can propose a block that includes a given transaction bundle. This allows the operator to reliably provide a soft confirmation to a recipient that a transaction will be included in the next Fuel block.',
        risks: [],
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
        ...TECHNOLOGY.PROPOSE_OWN_BLOCKS,
        references: [
          {
            text: 'Architecture: A High-Level View - Fuel documentation',
            href: 'https://docs.fuel.sh/v1.1.0/Concepts/Fundamentals/Fuel%20Overview.html#architectureahighlevelview',
          },
        ],
      },
      exitMechanisms: [
        {
          name: 'Regular withdrawal',
          description:
            'The user initiates a withdrawal by submitting a L2 transaction. Because the system is an optimistic rollup this transaction has to be included in a block and finalized. This takes several days to happen after which the funds can be withdrawn on L1 by submitting a Merkle proof of inclusion.',
          risks: [],
          references: [
            {
              text: 'Withdraw.yulp#L40 - Fuel documentation',
              href: 'https://github.com/FuelLabs/fuel-v1-contracts/blob/master/src/Withdraw.yulp#L40',
            },
          ],
        },
      ],
      contracts: {
        addresses: [
          // https://etherscan.io/address/0x6880f6Fd960D1581C2730a451A22EED1081cfD72
        ],
        risks: [],
      },
    },
    parameters: [
      {
        name: 'Primary use case',
        value: 'Payments',
      },
      {
        name: 'Hypothetical level of decentralization',
        sentiment: 'good',
        value: 'High',
      },
      {
        name: 'Current level of decentralization',
        sentiment: 'warning',
        tooltip:
          "Optimistic rollups require 3rd party validators to submit fraud proofs. B/c of current lack of the adoption users can't trust that such validators are running.",
        value: 'Medium',
      },
      {
        name: 'Can funds be stolen by the operator?',
        sentiment: 'good',
        value: 'No',
      },
      {
        name: 'Permissionless?',
        sentiment: 'good',
        tooltip:
          'Anyone can submit a new root that can become part of the rollup after a delay',
        pointers: [
          {
            name: 'Block.yulp#L95-L101 - Fuel source code',
            href: 'https://github.com/FuelLabs/fuel/blob/49c35e8de752200175174a08b6a8eae42796790d/src/Block.yulp#L95-L101',
          },
        ],
        value: 'Yes',
      },
      {
        name: 'Privacy',
        value: 'No',
      },
      {
        name: 'Smart contracts',
        value: 'No',
      },
    ],
    news: [
      {
        date: '2020-01-19',
        name: 'Announcing the Fuel v0 Open Beta',
        link: 'https://fuellabs.medium.com/announcing-the-fuel-v0-open-beta-565a2d340fc3',
      },
    ],
  },
}
