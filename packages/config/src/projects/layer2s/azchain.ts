import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const azchain: Layer2 = upcomingL2({
  id: 'azchain',
  addedAt: new UnixTime(1727519160), // 2024-09-27T17:09:00Z
  capability: 'universal',
  display: {
    name: 'AZ Chain',
    slug: 'azchain',
    description:
      'AZ Chain is an Ethereum L2 chain designed to enhance gaming performance and scalability.',
    purposes: ['Universal', 'Gaming'],
    category: 'Optimistic Rollup',
    stack: 'OP Stack',
    links: {
      websites: ['https://arena-z.gg/'],
      socialMedia: [
        'https://x.com/OfficialArenaZ',
        'https://t.me/OfficialArenaZ',
      ],
    },
  },
})
