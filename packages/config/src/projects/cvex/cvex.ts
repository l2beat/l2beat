import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL3 } from '../../templates/upcoming'

export const cvex: ScalingProject = upcomingL3({
  id: 'cvex',
  capability: 'universal',
  addedAt: UnixTime(1753947052),
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'CVEX',
    slug: 'cvex',
    description:
      'CVEX is a decentralized trading protocol powered by Arbitrum Orbit, offering ultra-low fees and a smoother trading experience on its own dedicated chain.',
    purposes: ['Exchange'],
    category: 'Optimium',
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://jetstream.trade/'],
      documentation: ['https://docs.jetstream.trade/'],
      socialMedia: [
        'https://t.me/JetStreamTrade',
        'https://discord.com/invite/WhYYaHHhy3',
        'https://x.com/JetstreamTrade',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
})
