import { RISK_VIEW } from './common'
import { Project } from './types'

export const synapseBridge: Project = {
  name: 'Synapse Bridge',
  slug: 'synapsebridge',
  bridges: [
    {
      address: '0x2796317b0fF8538F253012862c06787Adfb8cEb6',
      sinceBlock: 14559298,
      tokens: [
        'ETH',
        'WETH',
        //'gOHM',
        //'HIGH',
        'FRAX',
      ],
    },
  ],
  associatedTokens: ['AURORA'],
  details: {
    description: '.',
    purpose: 'Native Bridge',
    links: {
      websites: ['https://near.org/bridge/'],
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
