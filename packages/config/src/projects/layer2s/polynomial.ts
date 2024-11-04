import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('polynomial')

export const polynomial: Layer2 = opStackL2({
  createdAt: new UnixTime(1726570826), // 2024-09-17T11:00:26Z
  discovery,
  badges: [Badge.RaaS.Conduit, Badge.Infra.Superchain],
  additionalPurposes: ['Exchange'],
  display: {
    name: 'Polynomial',
    slug: 'polynomial',
    description:
      'Polynomial Chain is a derivatives chain that addresses liquidity fragmentation with a unified liquidity layer, enabling innovative derivatives.',
    links: {
      websites: ['https://polynomial.fi/'],
      apps: [],
      documentation: ['https://docs.polynomial.fi/'],
      explorers: ['https://polynomialscan.io/'],
      repositories: ['https://github.com/Polynomial-Protocol'],
      socialMedia: [
        'https://x.com/PolynomialFi',
        'https://discord.gg/Mr9XKU5W',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  rpcUrl: 'https://rpc.polynomial.fi',
  finality: {
    type: 'OPStack-blob',
    genesisTimestamp: new UnixTime(1718038307),
    minTimestamp: new UnixTime(1718049059),
    l2BlockTimeSeconds: 2,
    lag: 0,
    stateUpdate: 'analyze',
  },
  isNodeAvailable: 'UnderReview',
  genesisTimestamp: new UnixTime(1718038307),
  milestones: [
    {
      name: 'Polynomial Chain announced',
      date: '2024-07-16T00:00:00.000Z',
      description: 'Polynomial Chain announced on X.',
      link: 'https://x.com/PolynomialFi/status/1813259120629457403',
      type: 'general',
    },
  ],
  usesBlobs: true,
  discoveryDrivenData: true,
  nonTemplateEscrows: [
    {
      address: EthereumAddress('0x615172e47c0C5A6dA8ea959632Ac0166f7a59eDc'),
      sinceTimestamp: new UnixTime(1721219231),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['sDAI'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0xDE1617Ddb7C8A250A409D986930001985cfad76F'),
      sinceTimestamp: new UnixTime(1721277431),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['USDC'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0xC6cfb996A7CFEB89813A68CD13942CD75553032b'),
      sinceTimestamp: new UnixTime(1721382935),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['sUSDe'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0xc374967634133F5Ed1DF5050276e5B33986625D3'),
      sinceTimestamp: new UnixTime(1721232015),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['USDC'],
      chain: 'optimism',
      includeInTotal: false,
    },
    {
      address: EthereumAddress('0x038bc0f438C6b46FaCc5C83475925F4Dc111d79F'),
      sinceTimestamp: new UnixTime(1721231761),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['USDC'],
      chain: 'base',
      includeInTotal: false,
    },
    {
      address: EthereumAddress('0x615172e47c0C5A6dA8ea959632Ac0166f7a59eDc'),
      sinceTimestamp: new UnixTime(1721230760),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['USDC'],
      chain: 'arbitrum',
      includeInTotal: false,
    },
  ],
})
