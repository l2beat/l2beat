import { RISK_VIEW } from './common'
import { Project } from './types'

export const xDaiBridge: Project = {
  name: 'xDai Omni Bridge',
  slug: 'xdaibridge',
  bridges: [
    {
      address: '0x88ad09518695c6c3712AC10a214bE5109a655671',
      sinceBlock: 14559298,
      tokens: [
        'GNO',
        //'NODE',
        //'DXD',
        //'HOPR',
        //'BRIGHT'
      ],
    },
    {
      address: '0x4aa42145Aa6Ebf72e164C9bBC74fbD3788045016',
      sinceBlock: 14559298,
      tokens: ['cDAI', 'DAI'],
    },
  ],
  associatedTokens: ['GNO'],
  details: {
    description: '.',
    purpose: 'Native Bridge',
    links: {
      websites: ['https://omni.xdaichain.com/bridge'],
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
