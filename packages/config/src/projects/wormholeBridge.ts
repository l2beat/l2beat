import { RISK_VIEW } from './common'
import { Project } from './types'

export const wormholeBridge: Project = {
  name: 'Wormhole Bridge',
  slug: 'wormholebridge',
  bridges: [
    {
      address: '0x3ee18B2214AFF97000D974cf647E7C347E8fa585',
      sinceBlock: 13217349,
      tokens: [
        'WETH',
        //'NEXM',
        //'XCN',
        'USDT',
        'USDC',
        'HUSD',
        'BUSD',
        'LINK',
        'SRM',
        'SUSHI',
        'UNI',
        'LDO',
        'DAI',
        //'stETH',
      ],
    },
    {
      address: '0xf92cD566Ea4864356C5491c177A430C222d7e678',
      sinceBlock: 11687664,
      tokens: [
        //'FTT',
        'BUSD',
        'HBTC',
        'HUSD',
        'DAI',
        'SRM',
        'WETH',
        'FRAX',
        'WBTC',
      ],
    },
  ],
  details: {
    description: '.',
    purpose: 'Native Bridge',
    links: {
      websites: ['https://www.portalbridge.com/'],
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
