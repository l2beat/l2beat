import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { upcomingL3 } from '../layer2s/templates/upcoming'
import { Layer3 } from './types'

export const animechain: Layer3 = upcomingL3({
  id: 'animechain',
  createdAt: new UnixTime(1720191862), // 2024-07-05T15:04:22Z
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'AnimeChain',
    slug: 'animechain',
    description:
      'AnimeChain is an upcoming Layer 3 on Arbitrum, built on the Orbit stack. It aims to provide the infrastructure to enable the global anime network to live onchain, governed by creators and participants.',
    purposes: ['Gaming', 'DeFi'],
    category: 'Optimium',
    provider: 'Arbitrum',
    links: {
      websites: ['https://anime.xyz/'],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: ['https://x.com/animecoin'],
    },
  },
})
