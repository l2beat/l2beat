import {
  DATA_AVAILABILITY,
  FORCE_TRANSACTIONS,
  OPERATOR,
  RISK_VIEW,
} from './common'
import { Project } from './types'

export const optimism: Project = {
  name: 'Boba Network',
  slug: 'bobanetwork',
  bridges: [
    {
      // Proxy__OVM_L1StandardBridge
      address: '0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00',
      sinceBlock: 13012048,
      tokens: ['ETH', 'USDC'],
    },
    {
      // Proxy__L1LiquidityPool
      address: '0x6b4eab8D55A4f701C3FE58bDb8b3e1f181eA7087',
      sinceBlock: 13013879,
      tokens: ['ETH'],
    }
  ],
  details: {
    description:
      'The Ethereum Layer 2: Boba Network. Lower gas, faster, secured in Ethereum.',
    purpose: 'Universal',
    links: {
      websites: ['https://boba.network'],
      apps: [],
      documentation: ['https://docs.boba.network/'],
      explorers: ['https://blockexplorer.boba.network/'],
      repositories: ['https://github.com/omgnetwork'],
      socialMedia: [
        'https://blog.omgx.network',
        'https://twitter.com/bobanetwork',
        'https://t.me/omgnetwork',
        'https://discord.com/invite/m7NysJjKhm'
      ],
    },
    riskView: {
      stateValidation: {
        value: 'Proofs disabled',
        description:
          'Currently the system permits invalid state roots. More details in project overview.',
        sentiment: 'bad',
      },
      dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
      upgradeability: RISK_VIEW.UPGRADABLE_YES,
      operatorCensoring: RISK_VIEW.CENSORING_TRANSACT_L1,
      operatorDown: RISK_VIEW.DOWN_ESCAPE_MP,
    },
    technology: {
      category: {
        name: 'Optimistic Rollup',
      },
      stateCorrectness: {
        name: 'Fraud proofs are disabled',
        description:
          'Ultimately Boba Network will use fraud proofs to enforce state correctness. This feature is currently disabled and the system permits invalid state roots.',
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'an invalid state root is submitted to the system.',
          },
        ],
        references: [
          {
            text: 'Boba_Docs_Title',
            href: 'Boba_Docs_Link',
          },
        ],
      },
      dataAvailability: {
        ...DATA_AVAILABILITY.ON_CHAIN_CANONICAL,
        references: [
          {
            text: 'Boba_Docs_Title',
            href: 'Boba_Docs_Link',
          },
        ],
      },
      operator: {
        ...OPERATOR.CENTRALIZED_SEQUENCER,
        references: [
          {
            text: 'Boba_Docs_Title',
            href: 'Boba_Docs_Link',
          },
        ],
      },
      forceTransactions: {
        ...FORCE_TRANSACTIONS.CANONICAL_ORDERING,
        references: [
          {
            text: 'Boba_Docs_Title',
            href: 'Boba_Docs_Link',
          },
        ],
      },
      exitMechanisms: [
        {
          name: 'Regular exit',
          description:
            'When a user initiates a withdrawal it is processed as a L2 to L1 message. Because Boba Network is an optimistic rollup this transaction has to be included in a block and finalized. This takes several days to happen after which the funds can be withdrawn on L1.',
        },
        {
          name: 'Fast exit',
          description:
            'Users can initiate a fast exit which makes use of liquidity pools, and charges a small fee for the convenience. Users funds can then be withdrawn on L1 after only minutes.',
        }
      ],
      smartContracts: {
        name: 'EVM compatible smart contracts are supported',
        description:
          'Boba Network uses the Optimistic Virtual Machine (OVM) to execute transactions. This is similar to the EVM, but is independent from it and allows fraud proofs to be executed.',
        risks: [
          {
            category: 'Funds can be lost if',
            text: 'there are mistakes in the highly complex OVM implementation.',
          }
        ]
      },
      contracts: {
        addresses: [
          {
            name: 'L1 Standard Bridge',
            address: '0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00'
          },
          {
            name: 'L1 Liquidity Pool',
            address: '0x6b4eab8D55A4f701C3FE58bDb8b3e1f181eA7087'
          }
        ],
        risks: [],
      },
    },
    news: [
      {
        date: '2021-08-24',
        name: 'Boba Network Partners with DODO',
        link: 'https://www.enya.ai/press/dodo',
      },
      {
        date: '2021-08-19',
        name: 'Enya Launches Mainnet Beta of Boba Network',
        link: 'https://www.enya.ai/press/bobanetwork',
      }
    ],
  },
}
