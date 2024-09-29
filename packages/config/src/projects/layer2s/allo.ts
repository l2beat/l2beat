import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const allo: Layer2 = upcomingL2({
  id: 'allo',
  display: {
    name: 'Allo',
    slug: 'allo',
    description:
      'Allo is an OP Stack L2 which will be a part of Super Chain. It is used to tokenize Real World Assets seamlessly - unlocking reduced transaction times, lower costs, and enhanced security.',
    purposes: ['RWA'],
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://allo.xyz'],
      apps: [],
      explorers: [],
      repositories: [],
      documentation: ['https://docs.axonum.io'],
      socialMedia: [
        'https://twitter.com/axonum_io',
      ],
    },
  },
})
