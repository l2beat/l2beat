import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
} from './common'
import { Project } from './types'

export const leverj: Project = {
  name: 'LeverJ',
  slug: 'leverj',
  bridges: [
    {
      address: '0x75ACe7a086eA0FB1a79e43Cc6331Ad053d8C67cB',
      sinceBlock: 8929632,
      tokens: ['ETH', 'DAI', 'L2'],
    },
    {
      address: '0x84e34fD82FC368F1a072075114AdC4b552a7a1F4',
      sinceBlock: 11783715,
      tokens: ['DAI', 'USDT'],
    },
  ],
  associatedToken: 'L2',
  details: {
    purpose: 'Exchange',
    links: {
      websites: ['https://leverj.io/'],
      apps: ['https://live.leverj.io/'],
      documentation: ['https://leverj.io/assets/documents/Gluon-Layer2.pdf'],
      explorers: ['https://gluon.leverj.io/'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/Leverj_io',
        'https://t.me/leverj',
        'https://discord.gg/xpsjfwn',
        'https://blog.leverj.io/',
        'https://linkedin.com/company/leverj/',
        'https://youtube.com/channel/UCGor-eEpq0ObqN9u3jutq2w',
      ],
    },
    riskView: {
      stateValidation: RISK_VIEW.STATE_FP,
      dataAvailability: RISK_VIEW.DATA_EXTERNAL,
      upgradeability: RISK_VIEW.UPGRADABLE_YES,
      operatorCensoring: RISK_VIEW.CENSORING_EXIT_L1,
      operatorDown: RISK_VIEW.DOWN_ESCAPE_MP,
    },
    technology: {
      category: {
        name: 'Plasma',
        details: 'Gluon',
      },
      stateCorrectness: {
        ...STATE_CORRECTNESS.FRAUD_PROOFS,
        isIncomplete: true,
      },
      dataAvailability: {
        ...DATA_AVAILABILITY.PLASMA_OFF_CHAIN,
        isIncomplete: true,
      },
      operator: {
        ...OPERATOR.CENTRALIZED_OPERATOR,
        isIncomplete: true,
      },
      forceTransactions: {
        ...FORCE_TRANSACTIONS.WITHDRAW,
        isIncomplete: true,
      },
      exitMechanisms: [
        {
          ...EXITS.PLASMA,
          isIncomplete: true,
        },
      ],
      massExit: {
        name: 'The mass exit problem is unsolved',
        description:
          'In case the operator is malicious all users need to exit within a predetermined time frame. Users that do not manage to do this will lose their funds.',
        references: [],
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'users are unable to withdraw in a mass exit event.',
          },
        ],
        isIncomplete: true,
      },
      contracts: {
        addresses: [
          {
            name: 'Gluon',
            address: '0x75ACe7a086eA0FB1a79e43Cc6331Ad053d8C67cB',
          },
          {
            name: 'RegistryLogic',
            address: '0x385827aC8d1AC7B2960D4aBc303c843D9f87Bb0C',
            upgradeability: {
              type: 'Reference',
              base: 'Gluon',
              method: 'function current(uint32 id) view returns(address)',
              args: [0],
            },
          },
          {
            name: 'RegistryData',
            address: '0x0fC25C7931679B838209c484d49Df0Cb9E633C41',
            upgradeability: {
              type: 'Reference',
              base: 'RegistryLogic',
              method: 'function data() view returns(address)',
            },
          },
          {
            name: 'StakeLogic',
            address: '0x84e34fD82FC368F1a072075114AdC4b552a7a1F4',
            upgradeability: {
              type: 'Reference',
              base: 'Gluon',
              method: 'function current(uint32 id) view returns(address)',
              args: [1],
            },
          },
          {
            name: 'StakeData',
            address: '0xaB3AC436D66CBEeDc734ed2c1562c3a213c9bc77',
            upgradeability: {
              type: 'Reference',
              base: 'StakeLogic',
              method: 'function data() view returns(address)',
            },
          },
          {
            name: 'SpotLogic',
            address: '0x2D627FF93d32f5FEBb04d68409A889895B4aef2D',
            upgradeability: {
              type: 'Reference',
              base: 'Gluon',
              method: 'function current(uint32 id) view returns(address)',
              args: [2],
            },
          },
          {
            name: 'SpotData',
            address: '0x0d283D685F0A741C463846176e4c8EFF90D3F9EC',
            upgradeability: {
              type: 'Reference',
              base: 'SpotLogic',
              method: 'function data() view returns(address)',
            },
          },
          {
            name: 'DerivativesLogic',
            address: '0xDfBFe895e07e5115773Cb9631CB2148114589caC',
            upgradeability: {
              type: 'Reference',
              base: 'Gluon',
              method: 'function current(uint32 id) view returns(address)',
              args: [3],
            },
          },
          {
            name: 'DerivativesData',
            address: '0x563052914Fd973a2305763269A106a7B0B6D50Cc',
            upgradeability: {
              type: 'Reference',
              base: 'DerivativesLogic',
              method: 'function data() view returns(address)',
            },
          },
          {
            name: 'LegacyTokensExtension',
            address: '0xda88efa53c85afa30564bb651a2e76b99a232082',
          },
        ],
        risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
      },
    },
    news: [
      {
        date: '2021-04-08',
        name: 'Shutting Down the Spot Market on Leverj',
        link: 'https://blog.leverj.io/announcement-shutting-down-the-spot-markets-on-leverj-c20d14fad546',
      },
      {
        date: '2020-09-25',
        name: 'Launching high frequency derivatives trading on a DEX',
        link: 'https://blog.leverj.io/launching-high-frequency-derivatives-trading-on-a-dex-fdca839aa51d',
      },
      {
        date: '2019-02-19',
        name: 'Leverj now on Ethereum Mainnet',
        link: 'https://blog.leverj.io/leverj-now-on-ethereum-mainnet-bd016af01cb7',
      },
    ],

    // DEPRECATED ITEMS BELOW
    technologyName: 'Plasma',
    technologyDetails: 'Gluon Plasma',
    parameters: [
      {
        name: 'Primary use case',
        value: 'Exchange',
      },
      {
        name: 'Hypothetical level of decentralization',
        value: 'High',
        sentiment: 'good',
      },
      {
        name: 'Current level of decentralization',
        value: 'Low',
        tooltip: 'Single operator. Supports decentralized watchers.',
        sentiment: 'warning',
      },
      {
        name: 'Can funds be stolen by the operator?',
        value: 'No',
        tooltip:
          'Users can safely exit to L1 even if the operator is malicious.',
        sentiment: 'good',
      },
      {
        name: 'Permisonless?',
        value: 'No',
        sentiment: 'bad',
        tooltip: 'Only operator can produce new blocks',
      },
      {
        name: 'Force TX mechanism?',
        value: 'Yes but only for withdrawals',
        sentiment: 'good',
      },
      {
        name: 'Privacy',
        value: 'No',
      },
      {
        name: 'Smart contracts',
        value: 'No',
      },
    ],
  },
}
