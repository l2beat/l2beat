import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { CELESTIA_DA_PROVIDER, opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('orderly')

export const orderly: ScalingProject = opStackL2({
  addedAt: UnixTime(1707309065), // 2024-02-07T12:31:05Z
  daProvider: CELESTIA_DA_PROVIDER,
  additionalBadges: [BADGES.RaaS.Conduit],
  additionalPurposes: ['Exchange'],
  discovery,
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  display: {
    name: 'Orderly Network',
    shortName: 'Orderly',
    slug: 'orderly',
    description:
      'Orderly is an OP stack Optimium on Ethereum using Celestia for data availability. It has a unified ledger for assets from multiple chains and an orderbook that can be used by apps that build on top of it.',
    detailedDescription:
      'While ETH deposited to Orderly is using an OP Stack canonical bridge, the multichain USDC escrows are sending / receiving their deposit / withdrawal messages through the external LayerZero v1 AMB.',
    links: {
      websites: ['https://orderly.network/'],
      bridges: ['https://app.orderly.network/'],
      documentation: [
        'https://orderly.network/docs/build-on-evm/building-on-evm',
      ],
      explorers: ['https://explorer.orderly.network/'],
      socialMedia: [
        'https://twitter.com/OrderlyNetwork',
        'https://discord.gg/orderlynetwork',
        'https://medium.com/@orderlynetwork',
        'https://t.me/OrderlyNetworkAnnouncements',
      ],
    },
  },
  nonTemplateEscrows: [
    {
      chain: 'arbitrum',
      includeInTotal: false,
      address: EthereumAddress('0x816f722424B49Cf1275cc86DA9840Fbd5a6167e9'),
      sinceTimestamp: UnixTime(1697682598),
      tokens: ['USDC'],
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Arbitrum escrow -> LayerZero AMB',
          },
        ],
      },
    },
    {
      chain: 'optimism',
      includeInTotal: false,
      address: EthereumAddress('0x816f722424B49Cf1275cc86DA9840Fbd5a6167e9'),
      sinceTimestamp: UnixTime(1701153879),
      tokens: ['USDC'],
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Optimism escrow -> LayerZero AMB',
          },
        ],
      },
    },
    {
      chain: 'base',
      includeInTotal: false,
      address: EthereumAddress('0x816f722424b49cf1275cc86da9840fbd5a6167e9'),
      sinceTimestamp: UnixTime(1712584295),
      tokens: ['USDC'],
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Base escrow -> LayerZero AMB',
          },
        ],
      },
    },
    {
      chain: 'mantle',
      includeInTotal: false,
      address: EthereumAddress('0x816f722424B49Cf1275cc86DA9840Fbd5a6167e9'),
      sinceTimestamp: UnixTime(1705831672),
      tokens: ['USDC'],
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Mantle escrow -> LayerZero AMB',
          },
        ],
      },
    },
    {
      chain: 'ethereum',
      address: EthereumAddress('0x816f722424B49Cf1275cc86DA9840Fbd5a6167e9'),
      sinceTimestamp: UnixTime(1705702751),
      tokens: ['USDC'],
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Ethereum escrow -> LayerZero AMB',
          },
        ],
      },
    },
  ],
  chainConfig: {
    name: 'orderly',
    chainId: 291,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.orderly.network',
        callsPerMinute: 1500,
      },
    ],
  },
  genesisTimestamp: UnixTime(1696566432),
  celestiaDa: {
    sinceBlock: 0, // Edge Case: config added @ DA Module start
    namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAABYTLU4hLOUU=',
  },
  isNodeAvailable: false,
  milestones: [
    {
      title: 'ORDER Token Airdrop',
      url: 'https://orderly.network/blog/orderly-network-staking-unstake-ORDER/',
      date: '2024-08-26T00:00:00.00Z',
      description: 'ORDER token launched as a governance token.',
      type: 'general',
    },
    {
      title: 'Orderly Network Mainnet Launch',
      url: 'https://twitter.com/OrderlyNetwork/status/1749419001913237526',
      date: '2024-01-22T00:00:00Z',
      description: 'Orderly Network is live on mainnet.',
      type: 'general',
    },
  ],
})
