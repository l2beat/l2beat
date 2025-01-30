import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const leaf: Layer2 = upcomingL2({
  id: 'leaf',
  capability: 'universal',
  addedAt: new UnixTime(1724842746), // 2024-08-28T10:59:06Z
  display: {
    name: 'Leaf',
    slug: 'leaf',
    description:
      'Leaf is an upcoming OP Stack L2 focused on DeFi and MEV protection.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    stack: 'OP Stack',
    links: {
      websites: ['https://leafprotocol.com/'],
      socialMedia: ['https://x.com/leaf_rollup'],
    },
  },
})
