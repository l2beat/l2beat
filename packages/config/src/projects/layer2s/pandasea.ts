import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const pandasea: Layer2 = upcomingL2({
  id: 'pandasea',
  capability: 'universal',
  addedAt: new UnixTime(1729797861), // 2024-10-24T21:24:21Z
  display: {
    name: 'PandaSea',
    slug: 'pandasea',
    description:
      'PandaSea.io is a Layer 2 Web3 platform focused on integrating social finance and sports engagement.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    stack: 'OP Stack',
    links: {
      websites: ['https://pandasea.io/'],
    },
  },
})
