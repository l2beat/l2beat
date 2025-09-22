import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import type { ScalingProject } from '../../internalTypes'
import { underReviewL3 } from '../../templates/underReview'

export const dodochain: ScalingProject = underReviewL3({
  id: 'dodochain',
  capability: 'universal',
  addedAt: UnixTime(1719224565), // 2024-06-24T10:22:45Z
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Birdlayer',
    slug: 'dodochain',
    description:
      'Birdlayer is an Omni-Trading Layer-3 connecting liquidity from all chains including BTC and ETH L2s.',
    purposes: ['Universal', 'Interoperability'],
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://birdlayer.xyz/'],
      explorers: ['https://scan.birdlayer.xyz/'],
      bridges: ['https://birdlayer.xyz/bridge/'],
      documentation: [
        'https://docs.birdlayer.xyz/en/birdlayer/developers/network-information',
      ],
      repositories: ['https://github.com/DODOEX'],
      socialMedia: [
        'https://x.com/Bird_Layer',
        'https://medium.com/@BirdLayer',
        'https://t.me/dodoex_official',
        'https://discord.com/invite/tyKReUK',
      ],
    },
  },
  dataAvailability: undefined,
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
  proofSystem: {
    type: 'Optimistic',
  },
  chainConfig: {
    name: 'dodochain',
    chainId: 53456,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.birdlayer.xyz',
        callsPerMinute: 300,
      },
    ],
  },
  escrows: [
    {
      address: EthereumAddress('0x113E7DC5e4A42b1bEe9DB0594f48EFdEa7b88eE0'), // bridge
      sinceTimestamp: UnixTime(1737689038),
      tokens: ['ETH'],
      chain: 'arbitrum',
    },
    {
      address: EthereumAddress('0x6111D7AAa83fbE979301C458fF8f07F1d2E30002'), // standardGW
      sinceTimestamp: UnixTime(1737693204),
      tokens: '*',
      chain: 'arbitrum',
    },
  ],
})
