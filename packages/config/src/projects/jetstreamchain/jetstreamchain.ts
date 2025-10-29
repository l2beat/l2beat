import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL3 } from '../../templates/underReview'

export const jetstreamchain: ScalingProject = underReviewL3({
  id: 'jetstreamchain',
  capability: 'universal',
  addedAt: UnixTime(1753947052),
  archivedAt: UnixTime(1761698219),
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Jetstream',
    slug: 'jetstreamchain',
    description:
      'Jetstream Chain is a decentralized trading protocol powered by Arbitrum Orbit, offering ultra-low fees and a smoother trading experience on its own dedicated chain.',
    purposes: ['Exchange'],
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://jetstream.trade/'],
      documentation: ['https://docs.jetstream.trade/'],
      explorers: ['https://jetscan.io'],
      socialMedia: [
        'https://t.me/JetStreamTrade',
        'https://discord.com/invite/WhYYaHHhy3',
        'https://x.com/JetstreamTrade',
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
})
