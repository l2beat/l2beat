import { RISK, STARKEX } from './common'
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
    technologyName: 'ZK Rollup',
    technologyDetails: "Powered by StarkWare's StarkEx",
    purpose: 'Exchange',
    provider: 'StarkEx',
    riskView: {
      stateValidation: RISK.STATE_ZKP_ST,
      dataAvailability: RISK.DATA_ON_CHAIN,
      upgradeability: RISK.UPGRADABLE_YES,
      operatorCensoring: RISK.CENSORING_WITHDRAW_L1,
      operatorDown: RISK.DOWN_ESCAPE_MP,
    },
    technology: {
      category: {
        name: 'ZK Rollup',
        description: "Powered by StarkWare's StarkEx",
        references: [
          {
            text: 'dYdX Contracts - StarkEx documentation',
            href: 'https://docs.starkware.co/starkex-v3/starkex-deep-dive/smart-contracts-1/deployments-addresses#dydx-contracts',
          },
        ],
      },
      stateCorrectness: STARKEX.VALIDITY_PROOFS,
      dataAvailability: STARKEX.ROLLUP_DATA_AVAILABILITY,
      newCryptography: STARKEX.CRYPTOGRAPHY,
      operator: STARKEX.OPERATOR,
      forceTransactions: STARKEX.FORCE_OPERATIONS('perpetual'),
      exitMechanisms: [STARKEX.OFF_CHAIN_WITHDRAWAL, STARKEX.FORCED_WITHDRAWAL],
      contracts: {
        addresses: [
          {
            name: 'Bridge',
            address: '0xD54f502e184B6B739d7D27a6410a67dc462D69c8',
            upgradable: true,
            // TODO: more information
          },
          {
            name: 'GpsStatementVerifier',
            address: '0xC8c212f11f6ACca77A7afeB7282dEBa5530eb46C',
            upgradable: true,
            // TODO: more information
          },
          {
            name: 'MemoryPageFactRegistry',
            address: '0xEfbCcE4659db72eC6897F46783303708cf9ACef8',
            upgradable: true,
            // TODO: more information
          },
          {
            name: 'FriStatementContract',
            address: '0xf6b83CcaDeee478FC372AF6ca7069b14FBc5E1B1',
            upgradable: true,
            // TODO: more information
          },
          {
            name: 'MerkleStatementContract',
            address: '0x0d62bac5c346c78DC1b27107CAbC5F4DE057a830',
            upgradable: true,
            // TODO: more information
          },
        ],
        risks: [],
      },
    },
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
  },
}
