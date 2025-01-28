import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import type { Layer2 } from './types'

export const azchain: Layer2 = upcomingL2({
  id: 'azchain',
  capability: 'universal',
  createdAt: new UnixTime(1727519160), // 2024-09-27T17:09:00Z
  display: {
    name: 'AZ Chain',
    slug: 'azchain',
    description:
      'AZ Chain is an Ethereum L2 chain designed to enhance gaming performance and scalability.',
    purposes: ['Universal', 'Gaming'],
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://arena-z.gg/'],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: [
        'https://x.com/OfficialArenaZ',
        'https://t.me/OfficialArenaZ',
      ],
    },
  },
})
