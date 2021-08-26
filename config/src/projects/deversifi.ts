import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  NEW_CRYPTOGRAPHY,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
} from './common'
import { Project } from './types'

export const deversifi: Project = {
  name: 'DeversiFi',
  slug: 'deversifi',
  bridges: [
    {
      address: '0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b',
      sinceBlock: 10141009,
      tokens: [
        'ETH',
        'USDT',
        'WBTC',
        'USDC',
        'DAI',
        'LDO',
        'CEL',
        'cUSDT',
        'PNK',
        'AAVE',
        'SUSHI',
        'YFI',
        'UNI',
        'ZRX',
        'HEZ',
        'DUSK',
        'LINK',
        'MKR',
        'MLN',
        'NEC',
        'COMP',
        'SNX',
        'BAL',
        'LRC',
        'OMG',
        'BAT',
      ],
    },
  ],
  details: {
    description:
      'DeversiFi claims to be the easiest way to access DeFi opportunities on Ethereum: invest, trade, and send tokens without paying gas fees.',
    purpose: 'Exchange',
    links: {
      websites: ['https://www.deversifi.com/'],
      apps: ['https://app.deversifi.com/'],
      documentation: [
        'https://docs.deversifi.com/',
        'https://support.deversifi.com/en/',
        'https://docs.starkware.co/starkex-docs-v2/',
      ],
      explorers: [],
      repositories: [
        'https://github.com/starkware-libs/starkex-contracts',
        'https://github.com/deversifi',
      ],
      socialMedia: [
        'https://blog.deversifi.com/',
        'https://twitter.com/deversifi',
        'https://linkedin.com/company/deversifi/',
        'https://youtube.com/c/deversifi',
      ],
    },
    provider: 'StarkEx',
    riskView: {
      stateValidation: RISK_VIEW.STATE_ZKP_ST,
      dataAvailability: RISK_VIEW.DATA_EXTERNAL_DAC,
      upgradeability: RISK_VIEW.UPGRADE_DELAY('4 weeks'),
      operatorCensoring: RISK_VIEW.CENSORING_FORCE_EXIT_L1,
      operatorDown: RISK_VIEW.DOWN_ESCAPE_MP,
    },
    technology: {
      category: {
        name: 'Validium',
        details: "Powered by StarkWare's StarkEx",
      },
      stateCorrectness: STATE_CORRECTNESS.STARKEX_VALIDITY_PROOFS,
      newCryptography: NEW_CRYPTOGRAPHY.ZK_STARKS,
      dataAvailability: DATA_AVAILABILITY.STARKEX_OFF_CHAIN,
      operator: OPERATOR.STARKEX_OPERATOR,
      forceTransactions: FORCE_TRANSACTIONS.STARKEX_SPOT_WITHDRAW,
      exitMechanisms: EXITS.STARKEX,
      contracts: {
        addresses: [
          {
            name: 'Bridge',
            address: '0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b',
            upgradeability: {
              type: 'StarkWare',
              implementation: '0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC',
              useConstantDelay: true,
              upgradeDelay: 2419200,
              isFinal: false,
            },
          },
          {
            name: 'Committee',
            address: '0x28780349A33eEE56bb92241bAAB8095449e24306',
          },
          {
            name: 'GpsStatementVerifier',
            address: '0xd4CF925B9d0f4d1cCf82aB97C25130657474Ee19',
          },
          {
            name: 'MemoryPageFactRegistry',
            address: '0xc8e4EE91E7C14D625B829D2C2E87cF7348Eca449',
          },
          {
            name: 'FriStatementContract',
            address: '0x2742A152Be5032DafBC885Ba1801ffbc2345de7B',
          },
          {
            name: 'MerkleStatementContract',
            address: '0x0aF10D116A5CF10cA8835A0d775e0b248114fAD0',
          },
        ],
        risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK('4 weeks')],
      },
    },
    news: [
      {
        date: '2021-08-11',
        name: "It's here. The launch of DVF Governance.",
        link: 'https://blog.deversifi.com/its-here-the-launch-of-dvf-governance/',
      },
      {
        date: '2021-08-03',
        name: 'DeversiFi launches first Layer 2 bridge between Polygon for instant transfers',
        link: 'https://blog.deversifi.com/deversifi-launches-first-layer-2-bridge-between-polygon-for-instant-transfers',
      },
      {
        date: '2021-07-20',
        name: 'Introducing the DVF DAO Treasury',
        link: 'https://blog.deversifi.com/dvf-dao-treasury/',
      },
    ],

    // DEPRECATED ITEMS BELOW

    technologyName: 'Validium',
    technologyDetails: "Powered by StarkWare's StarkEx",
    parameters: [
      {
        name: 'Primary use case',
        value: 'Exchange',
      },
      {
        name: 'Hypothetical level of decentralization',
        value: 'High',
      },
      {
        name: 'Current level of decentralization',
        tooltip: 'Contracts are upgradable',
        sentiment: 'bad',
        value: 'Low',
      },
      {
        name: 'Can funds be stolen by the operator?',
        tooltip: 'Contracts are upgradable',
        sentiment: 'warning',
        pointers: [
          {
            name: 'Bridge contract - source on Etherscan',
            href: 'https://etherscan.io/address/0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b#code',
          },
        ],
        value: 'Yes, through contract upgrade',
      },
      {
        name: 'Permissionless?',
        sentiment: 'bad',
        tooltip: 'Only DeversiFi can produce new blocks',
        value: 'No',
      },
      {
        name: 'Force TX mechanism?',
        sentiment: 'good',
        value: 'Yes but only for withdrawals',
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
