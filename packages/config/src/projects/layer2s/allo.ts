import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const allo: Layer2 = upcomingL2({
  id: 'allo',
  capability: 'universal',
  addedAt: new UnixTime(1728665516),
  display: {
    name: 'Allo',
    slug: 'allo',
    description:
      'Allo is an OP Stack L2 which will be a part of Superchain. It is used to tokenize Real World Assets seamlessly - unlocking reduced transaction times and lower costs.',
    purposes: ['RWA'],
    category: 'Optimistic Rollup',
    stack: 'OP Stack',
    links: {
      websites: ['https://allo.xyz'],
      apps: ['https://app.allo.xyz/'],
      socialMedia: [
        'https://x.com/allo_xyz',
        'https://discord.gg/allo',
        'https://t.me/allo_xyz',
        'https://linkedin.com/company/alloxyz/',
      ],
    },
  },
})
