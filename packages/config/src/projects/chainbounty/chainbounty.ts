import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL3 } from '../../templates/underReview'

export const chainbounty: ScalingProject = underReviewL3({
  id: 'chainbounty',
  capability: 'universal',
  hostChain: ProjectId('arbitrum'),
  addedAt: UnixTime(1755399003),
  display: {
    name: 'Chainbounty',
    slug: 'chainbounty',
    description:
      'ChainBounty is a decentralized platform that helps solve security challenges in the crypto space.',
    purposes: ['Universal'],
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://chainbounty.io/'],
      documentation: ['https://chainbounty.gitbook.io/chainbounty'],
      explorers: ['https://scan.chainbounty.io'],
      bridges: [
        'https://bridge.arbitrum.io/?amount=0&sourceChain=arbitrum-one&destinationChain=chainbounty&tab=bridge',
      ],
      repositories: ['https://github.com/powerLoom'],
      socialMedia: [
        'https://x.com/ChainBountyX',
        'https://medium.com/@ChainBountyX',
      ],
    },
  },
  dataAvailability: undefined,
  proofSystem: {
    type: 'Optimistic',
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
  chainConfig: {
    name: 'chainbounty',
    gasTokens: ['BOUNTY'],
    chainId: 51828,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.chainbounty.io',
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
      address: EthereumAddress('0xd46AB997110a91C4CB6f4576ffE6769a3033622A'), // bridge
      sinceTimestamp: UnixTime(1735778707),
      tokens: '*',
      chain: 'arbitrum',
    },
    {
      address: EthereumAddress('0x81d8Bb220060Ba83653925c2a5D5c7060fD7729B'), // standardgw
      sinceTimestamp: UnixTime(1735778707),
      tokens: '*',
      chain: 'arbitrum',
    },
  ],
})
