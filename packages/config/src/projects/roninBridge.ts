import { RISK_VIEW } from './common'
import { Project } from './types'

export const roninBridge: Project = {
  name: 'Ronin Bridge',
  slug: 'roninbridge',
  bridges: [
    {
      address: '0x1A2a1c938CE3eC39b6D47113c7955bAa9DD454F2',
      sinceBlock: 14559298,
      tokens: ['ETH', 'AXS', 'WETH', 'USDC', 'USDT', 'MATIC', 'LINK'],
    },
  ],
  associatedTokens: ['AXS'],
  details: {
    description: '.',
    purpose: 'Native Bridge',
    links: {
      websites: ['https://bridge.roninchain.com/'],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: [],
    },
    riskView: {
      stateValidation: RISK_VIEW.STATE_ZKP_SN,
      dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
      upgradeability: RISK_VIEW.UPGRADABLE_YES,
      sequencerFailure: RISK_VIEW.SEQUENCER_PROPOSE_BLOCKS_ZKP,
      validatorFailure: RISK_VIEW.VALIDATOR_PROPOSE_BLOCKS_ZKP,
    },
    technology: {
      category: {
        name: 'Bridge',
      },
      stateCorrectness: {
        name: '',
        description: '.',
        risks: [],
        references: [],
      },
      dataAvailability: {
        name: '',
        description: '.',
        risks: [],
        references: [],
      },
      operator: {
        name: '',
        description: '.',
        risks: [],
        references: [],
      },
      forceTransactions: {
        name: '',
        description: '.',
        risks: [],
        references: [],
      },
      exitMechanisms: [
        {
          name: '',
          description: '.',
          risks: [],
          references: [],
        },
      ],
      contracts: {
        addresses: [],
        risks: [],
      },
    },
    news: [],
  },
}
