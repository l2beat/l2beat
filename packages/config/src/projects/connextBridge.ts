import { RISK_VIEW } from './common'
import { Project } from './types'

export const connextBridge: Project = {
  name: 'Connext Bridge',
  slug: 'connextbridge',
  bridges: [
    {
      address: '0x31eFc4AeAA7c39e54A33FDc3C46ee2Bd70ae0A09',
      sinceBlock: 13548432,
      tokens: ['USDC', 'USDT', 'DAI', 'WBTC'],
    },
  ],
  details: {
    description: '.',
    purpose: 'Native Bridge',
    links: {
      websites: ['https://bridge.connext.network/'],
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
