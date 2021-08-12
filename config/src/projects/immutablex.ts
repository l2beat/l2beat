import { RISK, STARKEX } from './common'
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
    technologyName: 'Validium',
    technologyDetails: "Powered by StarkWare's StarkEx",
    purpose: 'NFT, Exchange',
    provider: 'StarkEx',
    riskView: {
      stateCorrectness: RISK.STARK_PROOFS,
      dataAvailability: RISK.DATA_EXTERNAL,
      censorshipResistance: RISK.FORCE_EXIT,
      upgradeability: RISK.UPGRADABLE,
      owner: RISK.UNKNOWN,
    },
    technology: {
      category: {
        name: 'Validium',
        description: "Powered by StarkWare's StarkEx",
        references: [
          {
            text: 'Immutable Contracts - StarkEx documentation',
            href: 'https://docs.starkware.co/starkex-v3/starkex-deep-dive/smart-contracts-1/deployments-addresses#immutable-contracts',
          },
        ],
      },
      stateCorrectness: STARKEX.VALIDITY_PROOFS,
      dataAvailability: STARKEX.VALIDIUM_DATA_AVAILABILITY,
      newCryptography: STARKEX.CRYPTOGRAPHY,
      operator: STARKEX.OPERATOR,
      forceTransactions: STARKEX.FORCE_OPERATIONS('spot'),
      exitMechanisms: [STARKEX.OFF_CHAIN_WITHDRAWAL, STARKEX.FORCED_WITHDRAWAL],
      contracts: {
        addresses: [
          {
            name: 'Bridge',
            address: '0x5FDCCA53617f4d2b9134B29090C87D01058e27e9',
            upgradable: true,
            // TODO: more information
          },
          {
            name: 'Committee',
            address: '0x16BA0f221664A5189cf2C1a7AF0d3AbFc70aA295',
            upgradable: true,
            // TODO: more information
          },
          {
            name: 'GpsStatementVerifier',
            address: '0x45769d52d47E9CBfac9A2dF68c2051ADB0630F17',
            upgradable: true,
            // TODO: more information
          },
          {
            name: 'MemoryPageFactRegistry',
            address: '0x076CF2113b6EEd19883a92454C473998FC8479E5',
            upgradable: true,
            // TODO: more information
          },
          {
            name: 'FriStatementContract',
            address: '0xe74999fBc71455462C8143b56797D3Bb84C1064b',
            upgradable: true,
            // TODO: more information
          },
          {
            name: 'MerkleStatementContract',
            address: '0x26ec188F555F0C491083D280cF8162E9D5E0d386',
            upgradable: true,
            // TODO: more information
          },
        ],
        risks: [
          // TODO: Risks
        ],
      },
    },
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
    news: [
      {
        date: '2021-04-09',
        name: 'Immutable X Launches Gas-Free Layer-2 Solution Paving the Way to Mainstream NFT Adoption',
        link: 'https://www.immutable.com/blog/immutable-x-alpha-trading-launch',
      },
    ],
  },
}
