import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
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
  associatedTokens: ['HBT'],
  details: {
    warning:
      'Will be shutdown on 17th January. Please withdraw any remaining funds which you need on mainnet.',
    description:
      'Habitat is an optimistic rollup designed to allow community governance and treasury management.',
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
      sequencerFailure: RISK_VIEW.SEQUENCER_PROPOSE_BLOCKS,
      validatorFailure: RISK_VIEW.VALIDATOR_PROPOSE_BLOCKS,
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
          ...EXITS.REGULAR('optimistic', 'merkle proof'),
          isIncomplete: true,
        },
      ],
      smartContracts: {
        name: 'Limited smart contract support exists',
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
              implementation: '0xa0542eb5672572cf5E95BC06caff92B333eb6b43',
            },
          },
        ],
        risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
      },
    },
    news: [
      {
        date: '2022-01-03',
        name: 'Announcing Rollup Shutdown on the 17th January 2022',
        link: 'https://0xhabitat.substack.com/p/rollup-shutdown',
      },
      {
        date: '2021-08-18',
        name: 'Community Update #20 - Weekly Calls',
        link: 'https://0xhabitat.substack.com/p/20',
      },
      {
        date: '2021-08-11',
        name: 'Community Update #19 - Governance Awakening/ Next AMA',
        link: 'https://0xhabitat.substack.com/p/19',
      },
      {
        date: '2021-07-21',
        name: 'From Paris with Love',
        link: 'https://0xhabitat.substack.com/p/frompariswithlove',
      },
    ],
  },
}
