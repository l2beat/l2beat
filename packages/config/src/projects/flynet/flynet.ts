import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL3 } from '../../templates/underReview'

export const flynet: ScalingProject = underReviewL3({
  id: 'flynet',
  capability: 'universal',
  addedAt: UnixTime(1755098742),
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Flynet',
    slug: 'flynet',
    stacks: ['Arbitrum'],
    description:
      'Flynet is a transaction network for restaurant industry participants, by restaurant industry participants by Blackbird.',
    purposes: ['Universal'],
    links: {
      websites: ['https://flynet.org/'],
      documentation: ['https://flynet.org/os.pdf'],
      explorers: ['https://explorer.flynet.org/'],
      socialMedia: [
        'https://x.com/blackbird_xyz',
        'https://instagram.com/blackbird_xyz',
        'https://tiktok.com/@blackbird_xyz',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
  dataAvailability: undefined,
  proofSystem: {
    type: 'Optimistic',
  },
})
