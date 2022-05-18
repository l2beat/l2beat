import { RISK_VIEW } from './common'
import { Project } from './types'

export const harmonyBridge: Project = {
  name: 'Harmony Bridge',
  slug: 'harmonybridge',
  bridges: [
    {
      address: '0xF9Fb1c508Ff49F78b60d3A96dea99Fa5d7F3A8A6',
      sinceBlock: 14559298,
      tokens: ['ETH'],
    },
    {
      address: '0x2dCCDB493827E15a5dC8f8b72147E6c4A5620857',
      sinceBlock: 14559298,
      tokens: [
        'USDC',
        'USDT',
        'WBTC',
        'DAI',
        'FRAX',
        //'AAG',
        'FXS',
        'SUSHI',
        'AAVE',
        'CRV',
        'WETH',
        'MATIC',
      ],
    },
  ],
  details: {
    description: '.',
    purpose: 'Native Bridge',
    links: {
      websites: ['https://bridge.harmony.one/erc20'],
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
