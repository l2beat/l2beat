import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import type { Layer2 } from './types'

export const allo: Layer2 = upcomingL2({
  id: 'allo',
  capability: 'universal',
  createdAt: new UnixTime(1728665516),
  display: {
    name: 'Allo',
    slug: 'allo',
    description:
      'Allo is an OP Stack L2 which will be a part of Superchain. It is used to tokenize Real World Assets seamlessly - unlocking reduced transaction times and lower costs.',
    purposes: ['RWA'],
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://allo.xyz'],
      apps: ['https://app.allo.xyz/'],
      explorers: [],
      repositories: [],
      documentation: [],
      socialMedia: [
        'https://x.com/allo_xyz',
        'https://discord.gg/allo',
        'https://t.me/allo_xyz',
        'https://linkedin.com/company/alloxyz/',
      ],
    },
  },
})
