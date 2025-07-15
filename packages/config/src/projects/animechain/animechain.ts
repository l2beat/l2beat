import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL3 } from '../../templates/upcoming'

export const animechain: ScalingProject = upcomingL3({
  id: 'animechain',
  capability: 'universal',
  addedAt: UnixTime(1720191862), // 2024-07-05T15:04:22Z
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'AnimeChain',
    slug: 'animechain',
    description:
      'AnimeChain is an upcoming Layer 3 on Arbitrum, built on the Orbit stack. It aims to provide the infrastructure to enable the global anime network to live onchain, governed by creators and participants.',
    purposes: ['Gaming', 'Universal'],
    category: 'Optimium',
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://anime.xyz/'],
      socialMedia: ['https://x.com/animecoin'],
    },
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
})
