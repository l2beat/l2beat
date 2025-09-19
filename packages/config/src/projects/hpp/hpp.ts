import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL2 } from '../../templates/underReview'

export const hpp: ScalingProject = underReviewL2({
  id: 'hpp',
  capability: 'universal',
  hasTestnet: true,
  addedAt: UnixTime(1753945535),
  display: {
    name: 'HPP',
    slug: 'hpp',
    description:
      'HPP is an AI-ready Layer 2 for agents, data, and decentralized infrastructure — composable and verifiable by design.',
    purposes: ['AI'],
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://hpp.io/'],
      bridges: [
        'https://bridge.arbitrum.io/?sourceChain=ethereum&destinationChain=hpp-mainnet&tab=bridge',
      ],
      explorers: ['https://explorer.hpp.io/'],
      documentation: ['https://docs.hpp.io/'],
      repositories: ['https://github.com/hpp-io'],
      socialMedia: [
        'https://x.com/aergo_io',
        'https://medium.com/aergo',
        'https://t.me/aergoofficial',
      ],
    },
  },
  dataAvailability: undefined,
  chainConfig: {
    name: 'hpp',
    gasTokens: ['ETH'],
    chainId: 190415,
    apis: [
      {
        type: 'rpc',
        url: 'https://mainnet.hpp.io',
        callsPerMinute: 300,
      },
    ],
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
  escrows: [
    {
      address: EthereumAddress('0x9948eDFBb9e0b104bAd60393dBe79d0BC7937014'), // bridge
      sinceTimestamp: UnixTime(1752805500),
      tokens: ['ETH'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0x8F31c7a6806432F05A936Ade26a7407c968f13eA'), // standardGW
      sinceTimestamp: UnixTime(1752805500),
      tokens: '*',
      chain: 'ethereum',
    },
  ],
  proofSystem: {
    type: 'Optimistic',
  },
})
