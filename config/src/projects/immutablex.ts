import { RISK } from './common'
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
      censorshipResistance: RISK.UNKNOWN,
      upgradeability: RISK.UPGRADABLE,
      owner: RISK.UNKNOWN,
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
