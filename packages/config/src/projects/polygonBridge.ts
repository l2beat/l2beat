import { RISK_VIEW } from './common'
import { Project } from './types'

export const polygonBridge: Project = {
  name: 'Polygon Bridge',
  slug: 'polygonbridge',
  bridges: [
    {
      address: '0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf',
      sinceBlock: 14559298,
      tokens: [
        'USDC',
        'USDT',
        'WBTC',
        'SAND',
        //'ALTA',
        //'QUICK',
        'DAI',
        //'GHST',
        'AAVE',
        'LINK',
        //'BAL',
        'CRV',
        'MANA',
        'CEL',
        //'DG',
        //'xDG',
        //'BZRX',
        //'AWX',
      ],
    },
    {
      address: '0x8484Ef722627bf18ca5Ae6BcF031c23E6e922B30',
      sinceBlock: 14559298,
      tokens: ['ETH'],
    },
    {
      address: '0x401F6c983eA34274ec46f84D70b31C151321188b',
      sinceBlock: 14559298,
      tokens: ['MATIC', 'DAI'],
    },
  ],
  associatedTokens: ['MATIC'],
  details: {
    description: '.',
    purpose: 'Native Bridge',
    links: {
      websites: ['https://wallet.polygon.technology/'],
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
