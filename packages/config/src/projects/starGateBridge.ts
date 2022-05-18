import { RISK_VIEW } from './common'
import { Project } from './types'

export const starGateBridge: Project = {
  name: 'StarGate Bridge',
  slug: 'stargatebridge',
  bridges: [
    {
      address: '0xdf0770dF86a8034b3EFEf0A1Bb3c889B8332FF56',
      sinceBlock: 14559298,
      tokens: ['USDC'],
    },
    {
      address: '0x38EA452219524Bb87e18dE1C24D3bB59510BD783',
      sinceBlock: 14559298,
      tokens: ['USDT'],
    },
  ],
  details: {
    description: '.',
    purpose: 'Swap Bridge',
    links: {
      websites: ['https://stargate.finance/'],
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
