import { RISK_VIEW } from './common'
import { Project } from './types'

export const avalancheBridge: Project = {
  name: 'Avalanche Bridge',
  slug: 'avalanchebridge',
  bridges: [
    {
      address: '0xE78388b4CE79068e89Bf8aA7f218eF6b9AB0e9d0',
      sinceBlock: 14559298,
      tokens: [
        'ETH',
        'USDC',
        'WETH',
        'WBTC',
        'USDT',
        'DAI',
        'LINK',
        'WOO',
        'AAVE',
        //'SWAP',
        'BUSD',
        'SUSHI',
        'SHIB',
        'UNI',
        'GRT',
        'MKR',
      ],
    },
  ],
  details: {
    description: '.',
    purpose: 'Native Bridge',
    links: {
      websites: ['https://bridge.avax.network/'],
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
