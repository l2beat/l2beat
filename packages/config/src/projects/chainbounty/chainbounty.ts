import { ProjectId, UnixTime } from '@l2beat/shared-pure'
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
    category: 'Optimium',
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
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
})
