import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { upcomingL3 } from '../layer2s/templates/upcoming'
import { Layer3 } from './types'

export const alphadune: Layer3 = upcomingL3({
  id: 'alphadune',
  createdAt: new UnixTime(1720191862), // 2024-07-05T15:04:22Z
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'AlphaDune',
    slug: 'alphadune',
    description:
      'AlphaDune is an upcoming Layer 3 on Arbitrum, built on the Orbit stack. It is a loyalty-driven network for GameFi and GambleFi.',
    purposes: ['Gaming', 'DeFi'],
    category: 'Optimium',
    provider: 'Arbitrum',
    links: {
      websites: ['https://alphadune.com/'],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: ['https://x.com/alphadune'],
    },
  },
})
