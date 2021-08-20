import {
  DATA_AVAILABILITY,
  FORCE_TRANSACTIONS,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
} from './common'
import { Project } from './types'

export const habitat: Project = {
  name: 'Habitat',
  slug: 'habitat',
  bridges: [
    {
      address: '0x96E471B5945373dE238963B4E032D3574be4d195',
      sinceBlock: 12731872,
      tokens: ['HBT', 'WETH', 'USDC', 'GNO'],
    },
  ],
  associatedToken: 'HBT',
  details: {
    purpose: 'DAO, Treasury',
    links: {
      websites: ['https://0xhabitat.org/'],
      apps: ['https://0xhabitat.org/app/'],
      documentation: ['https://docs.0xhabitat.org/'],
      explorers: ['https://0xhabitat.org/explorer/'],
      repositories: ['https://github.com/0xHabitat/habitat'],
      socialMedia: [
        'https://twitter.com/EnterTheHabitat',
        'https://discord.gg/4Cu6vBZhDp',
        'https://0xhabitat.substack.com/',
      ],
    },
    riskView: {
      stateValidation: RISK_VIEW.STATE_FP,
      dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
      upgradeability: RISK_VIEW.UPGRADABLE_YES,
      operatorCensoring: RISK_VIEW.CENSORING_PROPOSE_BLOCKS,
      operatorDown: RISK_VIEW.DOWN_PROPOSE_BLOCKS,
    },
    technology: {
      category: {
        name: 'Optimistic Rollup',
        details: 'NutBerry',
      },
      stateCorrectness: {
        ...STATE_CORRECTNESS.FRAUD_PROOFS,
        isIncomplete: true,
      },
      dataAvailability: {
        ...DATA_AVAILABILITY.ON_CHAIN,
        isIncomplete: true,
      },
      operator: {
        ...OPERATOR.DECENTRALIZED_OPERATOR,
        isIncomplete: true,
      },
      forceTransactions: {
        ...FORCE_TRANSACTIONS.PROPOSE_OWN_BLOCKS,
        isIncomplete: true,
      },
      exitMechanisms: [
        {
          name: 'Regular withdraw',
          description:
            'Withdraw delays are subject to the inspection period. Currently 1 week.',
          risks: [],
          references: [],
          isIncomplete: true,
        },
      ],
      smartContracts: {
        name: 'Limited smart contract support exists.',
        description:
          'Only static contracts that comply to the Habitat Module interface can be deployed and used.',
        references: [
          {
            text: 'HabitatModule.sol - Habitat source code',
            href: 'https://github.com/0xHabitat/habitat/blob/master/src/rollup/contracts/HabitatModule.sol',
          },
        ],
        risks: [],
      },
      contracts: {
        addresses: [
          {
            name: 'HabitatV1',
            address: '0x96E471B5945373dE238963B4E032D3574be4d195',
            upgradeability: {
              type: 'NutBerry',
              admin: '0xc97f82c80DF57c34E84491C0EDa050BA924D7429',
              implementation: '0x1EE6fDa8cE6c4e32E48005e98D9cCdC2F2b4f346',
            },
          },
        ],
        risks: [
          // TODO: risks?
        ],
      },
    },
    news: [
      {
        date: '2021-06-30',
        name: 'Community Update #15 - Habitat is Live on Mainnet',
        link: 'https://0xhabitat.substack.com/p/15',
      },
    ],

    // DEPRECATED ITEMS BELOW

    technologyName: 'Optimistic Rollup',
    technologyDetails: 'NutBerry',
    parameters: [
      {
        name: 'Primary use case',
        value: 'Governance & Treasury Management',
      },
      {
        name: 'Hypothetical level of decentralization',
        value: 'High',
        sentiment: 'good',
      },
      {
        name: 'Current level of decentralization',
        value: 'Low',
        tooltip:
          'Contract Ownership will be transferred to community governance in the future',
        sentiment: 'warning',
      },
      {
        name: 'Can funds be stolen by the operator?',
        value: 'Yes, through a contract upgrade via the multisig.',
        tooltip:
          'The multisig will be replaced by on-chain governance once the Habitat community is sufficiently decentralized.',
        sentiment: 'warning',
        pointers: [
          {
            name: 'HabitatV1.sol#L52 - Habitat source code',
            href: 'https://github.com/0xHabitat/habitat/blob/master/src/rollup/contracts/HabitatV1.sol#L52',
          },
        ],
      },
      {
        name: 'Protocol upgrade timelock',
        value: 'No',
        sentiment: 'bad',
      },
      {
        name: 'Permissionless?',
        value: 'Anyone can propose, dispute, challenge and finalize blocks',
        sentiment: 'good',
      },
      {
        name: 'Force TX mechanism?',
        value: 'No',
        tooltip:
          'Operators are independent transaction aggregators and are not subject to any enforcements.',
        sentiment: 'warning',
      },
      {
        name: 'Can the funds be freely withdrawn?',
        value: 'Yes, but not instantly.',
        tooltip:
          'Withdraw delays are subject to the inspection period. Currently 1 week.',
        sentiment: 'good',
      },
      {
        name: 'Rollup Governance',
        value: 'HBT tokens are needed to participate.',
        sentiment: 'warning',
      },
      {
        name: 'Privacy',
        value: 'No',
      },
      {
        name: 'Smart contracts',
        value:
          'Limited. Only static contracts that comply to the Habitat Module interface.',
        pointers: [
          {
            name: 'HabitatModule.sol - Habitat source code',
            href: 'https://github.com/0xHabitat/habitat/blob/master/src/rollup/contracts/HabitatModule.sol',
          },
        ],
      },
    ],
  },
}
