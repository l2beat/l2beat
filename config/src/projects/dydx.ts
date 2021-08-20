import {
  DATA_AVAILABILITY,
  FORCE_TRANSACTIONS,
  NEW_CRYPTOGRAPHY,
  OPERATOR,
  RISK_VIEW,
  STARKEX,
  STATE_CORRECTNESS,
} from './common'
import { Project } from './types'

export const dydx: Project = {
  name: 'dYdX',
  slug: 'dydx',
  bridges: [
    {
      address: '0xD54f502e184B6B739d7D27a6410a67dc462D69c8',
      sinceBlock: 11834295,
      tokens: ['USDC'],
    },
  ],
  details: {
    purpose: 'Exchange',
    links: {
      websites: ['https://dydx.exchange/'],
      apps: ['https://trade.dydx.exchange/', 'https://margin.dydx.exchange/'],
      documentation: [
        'https://docs.starkware.co/starkex-docs-v2/',
        'https://docs.dydx.exchange/',
      ],
      explorers: [],
      repositories: [
        'https://github.com/starkware-libs/starkex-contracts',
        'https://github.com/dydxprotocol/',
      ],
      socialMedia: [
        'https://dydx.exchange/blog',
        'https://twitter.com/dydxprotocol',
        'https://discord.gg/Tuze6tY',
        'https://youtube.com/c/dydxprotocol',
        'https://reddit.com/r/dydxprotocol/',
        'https://linkedin.com/company/dydx',
      ],
    },
    provider: 'StarkEx',
    riskView: {
      stateValidation: RISK_VIEW.STATE_ZKP_ST,
      dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
      upgradeability: RISK_VIEW.UPGRADABLE_YES,
      operatorCensoring: RISK_VIEW.CENSORING_WITHDRAW_L1,
      operatorDown: RISK_VIEW.DOWN_ESCAPE_MP,
    },
    technology: {
      category: {
        name: 'ZK Rollup',
        details: "Powered by StarkWare's StarkEx",
      },
      stateCorrectness: STATE_CORRECTNESS.STARKEX_VALIDITY_PROOFS,
      newCryptography: NEW_CRYPTOGRAPHY.ZK_STARKS,
      dataAvailability: DATA_AVAILABILITY.STARKEX_ON_CHAIN,
      operator: OPERATOR.STARKEX_OPERATOR,
      forceTransactions: FORCE_TRANSACTIONS.STARKEX_PERPETUAL_WITHDRAW,
      exitMechanisms: [STARKEX.OFF_CHAIN_WITHDRAWAL, STARKEX.FORCED_WITHDRAWAL],
      contracts: {
        addresses: [
          {
            name: 'Bridge',
            address: '0xD54f502e184B6B739d7D27a6410a67dc462D69c8',
            upgradeability: {
              type: 'StarkWare',
              implementation: '0x2C0df87E073755139101b35c0A51e065291cc2d3',
              upgradeDelay: 0,
              isFinal: false,
            },
          },
          {
            name: 'GpsStatementVerifier',
            address: '0xC8c212f11f6ACca77A7afeB7282dEBa5530eb46C',
            upgradeability: {
              type: 'StarkWare',
              implementation: '0xCC5B2c75cbbD281b2Fc4B58C7d5B080d023C92F2',
              callImplementation: '0x894c4a12548FB18EaA48cF34f9Cd874Fc08b7FC3',
              upgradeDelay: 0,
              isFinal: false,
            },
          },
          {
            name: 'MemoryPageFactRegistry',
            address: '0xEfbCcE4659db72eC6897F46783303708cf9ACef8',
          },
          {
            name: 'FriStatementContract',
            address: '0xf6b83CcaDeee478FC372AF6ca7069b14FBc5E1B1',
          },
          {
            name: 'MerkleStatementContract',
            address: '0x0d62bac5c346c78DC1b27107CAbC5F4DE057a830',
          },
        ],
        risks: [],
      },
    },
    news: [
      {
        date: '2021-04-06',
        name: 'Trade now on Layer 2',
        link: 'https://dydx.exchange/blog/public',
      },
      {
        date: '2020-08-18',
        name: 'Scaling dYdX with StarkWare',
        link: 'https://dydx.exchange/blog/public',
      },
      {
        date: '2020-04-20',
        name: 'dYdX Launches BTC Perpetual Contract Market',
        link: 'https://medium.com/dydxderivatives/dydx-launches-btc-perpetual-contract-market-68f59b193f7e',
      },
    ],

    // DEPRECATED ITEMS BELOW

    technologyName: 'ZK Rollup',
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
            href: 'https://etherscan.io/address/0xD54f502e184B6B739d7D27a6410a67dc462D69c8#code',
          },
        ],
        value: 'Yes, through contract upgrade',
      },
      {
        name: 'Permissionless?',
        sentiment: 'bad',
        tooltip: 'Only dydx can produce new blocks',
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
