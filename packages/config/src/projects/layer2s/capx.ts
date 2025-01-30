import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const capx: Layer2 = upcomingL2({
  id: 'capx',
  capability: 'universal',
  addedAt: new UnixTime(1692958606), // '2023-08-25T10:16:46Z'
  display: {
    name: 'Capx',
    slug: 'capx',
    description:
      'Capx is a Layer 2 focused on simplifying and reducing the cost of building AI agents.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    stack: 'Arbitrum',
    links: {
      websites: ['https://capx.ai/'],
      socialMedia: ['https://discord.com/invite/capx', 'https://x.com/0xCapx'],
    },
  },
})
