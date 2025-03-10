import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { BADGES } from '../badges'
import { opStackL2 } from './templates/opStack'

const discovery = new ProjectDiscovery('polynomial')

export const polynomial: ScalingProject = opStackL2({
  addedAt: UnixTime(1726570826), // 2024-09-17T11:00:26Z
  discovery,
  additionalBadges: [BADGES.RaaS.Conduit, BADGES.Infra.Superchain],
  additionalPurposes: ['Exchange'],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  display: {
    name: 'Polynomial',
    slug: 'polynomial',
    description:
      'Polynomial Chain is a derivatives chain that addresses liquidity fragmentation with a unified liquidity layer, enabling innovative derivatives.',
    links: {
      websites: ['https://polynomial.fi/'],
      documentation: ['https://docs.polynomial.fi/'],
      explorers: ['https://polynomialscan.io/'],
      repositories: ['https://github.com/Polynomial-Protocol'],
      socialMedia: [
        'https://x.com/PolynomialFi',
        'https://discord.gg/Mr9XKU5W',
      ],
    },
  },
  chainConfig: {
    name: 'polynomial',
    chainId: 8008,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.polynomial.fi',
        callsPerMinute: 1500,
      },
    ],
  },
  finality: {
    type: 'OPStack',
    genesisTimestamp: UnixTime(1718038175),
    minTimestamp: UnixTime(1718049059),
    l2BlockTimeSeconds: 2,
    lag: 0,
    stateUpdate: 'analyze',
  },
  isNodeAvailable: 'UnderReview',
  genesisTimestamp: UnixTime(1718038307),
  milestones: [
    {
      title: 'Polynomial Chain announced',
      date: '2024-07-16T00:00:00.000Z',
      description: 'Polynomial Chain announced on X.',
      url: 'https://x.com/PolynomialFi/status/1813259120629457403',
      type: 'general',
    },
  ],
  nonTemplateEscrows: [
    {
      address: EthereumAddress('0xDf9Fa2b420689384E8DD55a706262DC0ED37020F'),
      sinceTimestamp: UnixTime(1728993695),
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Socket bridge',
            slug: 'socket',
          },
        ],
      },
      tokens: ['USD0++'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0x615172e47c0C5A6dA8ea959632Ac0166f7a59eDc'),
      sinceTimestamp: UnixTime(1721219231),
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
      sinceTimestamp: UnixTime(1721277431),
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
      sinceTimestamp: UnixTime(1721382935),
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
      sinceTimestamp: UnixTime(1721232015),
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
      sinceTimestamp: UnixTime(1721231761),
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
      sinceTimestamp: UnixTime(1721230760),
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
