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

export const immutablex: Project = {
  name: 'ImmutableX',
  slug: 'immutablex',
  bridges: [
    {
      address: '0x5FDCCA53617f4d2b9134B29090C87D01058e27e9',
      sinceBlock: 12011518,
      tokens: ['ETH'],
    },
  ],
  details: {
    purpose: 'NFT, Exchange',
    links: {
      websites: ['https://www.immutable.com/'],
      apps: ['https://market.x.immutable.com/'],
      documentation: ['https://docs.starkware.co/starkex-docs-v2/'],
      explorers: [],
      repositories: ['https://github.com/starkware-libs/starkex-contracts'],
      socialMedia: [
        'https://medium.com/@immutablex',
        'https://twitter.com/Immutable',
      ],
    },
    provider: 'StarkEx',
    riskView: {
      stateValidation: RISK_VIEW.STATE_ZKP_ST,
      dataAvailability: RISK_VIEW.DATA_EXTERNAL_DAC,
      upgradeability: RISK_VIEW.UPGRADABLE_YES,
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
            address: '0x5FDCCA53617f4d2b9134B29090C87D01058e27e9',
            upgradeability: {
              type: 'StarkWare',
              implementation: '0x49401Ddc4E0A858B5B4cf3D6De38393B7fAC7378',
              upgradeDelay: 0,
              isFinal: false,
            },
          },
          {
            name: 'Committee',
            address: '0x16BA0f221664A5189cf2C1a7AF0d3AbFc70aA295',
          },
          {
            name: 'GpsStatementVerifier',
            address: '0x45769d52d47E9CBfac9A2dF68c2051ADB0630F17',
          },
          {
            name: 'MemoryPageFactRegistry',
            address: '0x076CF2113b6EEd19883a92454C473998FC8479E5',
          },
          {
            name: 'FriStatementContract',
            address: '0xe74999fBc71455462C8143b56797D3Bb84C1064b',
          },
          {
            name: 'MerkleStatementContract',
            address: '0x26ec188F555F0C491083D280cF8162E9D5E0d386',
          },
        ],
        risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
      },
    },
    news: [
      {
        date: '2021-04-09',
        name: 'Immutable X Launches Gas-Free Layer-2 Solution Paving the Way to Mainstream NFT Adoption',
        link: 'https://www.immutable.com/blog/immutable-x-alpha-trading-launch',
      },
    ],

    // DEPRECATED ITEMS BELOW

    technologyName: 'Validium',
    technologyDetails: "Powered by StarkWare's StarkEx",
    parameters: [
      {
        name: 'Primary use case',
        value: 'NFT, Exchange',
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
            href: 'https://etherscan.io/address/0x5FDCCA53617f4d2b9134B29090C87D01058e27e9#code',
          },
        ],
        value: 'Yes, through contract upgrade',
      },
      {
        name: 'Permissionless?',
        sentiment: 'bad',
        tooltip: 'Only ImmutableX can produce new blocks',
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
