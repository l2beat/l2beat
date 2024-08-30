import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { CELESTIA_DA_PROVIDER, opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('orderly')

const upgradeability = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

export const orderly: Layer2 = opStackL2({
  daProvider: CELESTIA_DA_PROVIDER,
  badges: [Badge.DA.Celestia, Badge.Infra.Superchain, Badge.RaaS.Conduit],
  discovery,
  display: {
    name: 'Orderly Network',
    slug: 'orderly',
    warning:
      'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
    description:
      'Orderly is an OP stack Optimium on Ethereum using Celestia for data availability. It has a unified ledger for assets from multiple chains and an orderbook that can be used by apps that build on top of it.',
    detailedDescription:
      'While ETH deposited to Orderly is using an OP Stack canonical bridge, the multichain USDC escrows are sending / receiving their deposit / withdrawal messages through the external LayerZero v1 AMB.',
    purposes: ['DeFi', 'Exchange'],
    links: {
      websites: ['https://orderly.network/'],
      apps: ['https://app.orderly.network/'],
      documentation: [
        'https://orderly.network/docs/build-on-evm/building-on-evm',
      ],
      explorers: ['https://explorer.orderly.network/'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/OrderlyNetwork',
        'https://discord.gg/orderlynetwork',
        'https://medium.com/@orderlynetwork',
        'https://t.me/OrderlyNetworkAnnouncements',
      ],
    },
    activityDataSource: 'Blockchain RPC',
    architectureImage: 'opstack',
  },
  nonTemplateEscrows: [
    {
      chain: 'arbitrum',
      includeInTotal: false,
      address: EthereumAddress('0x816f722424B49Cf1275cc86DA9840Fbd5a6167e9'),
      sinceTimestamp: new UnixTime(1697682598),
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
      sinceTimestamp: new UnixTime(1701153879),
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
      sinceTimestamp: new UnixTime(1712584295),
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
      sinceTimestamp: new UnixTime(1705831672),
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
      sinceTimestamp: new UnixTime(1705702751),
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
  upgradeability,
  rpcUrl: 'https://rpc.orderly.network',
  genesisTimestamp: new UnixTime(1696566432),
  isNodeAvailable: false,
  milestones: [
    {
      name: 'Orderly Network Mainnet Launch',
      link: 'https://twitter.com/OrderlyNetwork/status/1749419001913237526',
      date: '2024-01-22T00:00:00Z',
      description: 'Orderly Network is live on mainnet.',
      type: 'general',
    },
  ],
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'ConduitMultisig',
      'This address is the owner of the following contracts: ProxyAdmin, SystemConfig.',
    ),
  ],
})
