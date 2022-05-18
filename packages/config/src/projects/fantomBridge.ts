import { RISK_VIEW } from './common'
import { Project } from './types'

export const fantomBridge: Project = {
  name: 'MChain Fantom Bridge',
  slug: 'fantombridge',
  bridges: [
    {
      address: '0xC564EE9f21Ed8A2d8E7e76c085740d5e4c5FaFbE',
      sinceBlock: 14559298,
      tokens: [
        'USDC',
        'WBTC',
        'DAI',
        'WETH',
        'FRAX',
        'USDC',
        //'DOLA',
        'LINK',
        'YFI',
        'CRV',
        'TUSD',
        'FXS',
        //'WOOFY',
      ],
    },
  ],
  details: {
    description: '.',
    purpose: 'Native Bridge',
    links: {
      websites: ['https://multichain.xyz/'],
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
