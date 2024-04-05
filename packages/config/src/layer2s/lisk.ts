import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const lisk: Layer2 = upcomingL2({
  id: 'lisk',
  display: {
    name: 'Lisk',
    slug: 'lisk',
    description:
      'Lisk announced a strategic move to integrate with the Ethereum ecosystem as an OP Stack L2.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://lisk.com/'],
      apps: [],
      documentation: ['https://lisk.com/documentation/'],
      explorers: ['https://liskscan.com/'],
      repositories: ['https://github.com/LiskHQ'],
      socialMedia: [
        'https://twitter.com/LiskHQ',
        'https://lisk.chat/',
        'https://t.me/Lisk_HQ',
      ],
    },
  },
})
