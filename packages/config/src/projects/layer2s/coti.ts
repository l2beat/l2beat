import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const coti: Layer2 = upcomingL2({
  id: 'coti',
  capability: 'universal',
  addedAt: new UnixTime(1712133479), // 2024-04-03T08:37:59Z
  display: {
    name: 'Coti',
    slug: 'coti',
    description:
      'Coti is a privacy-centric Ethereum Layer 2 leveraging multiparty computation and secure enclaves for scalable privacy.',
    purposes: ['Universal', 'Privacy'],
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://coti.io/'],
      documentation: [
        'https://medium.com/cotinetwork/how-coti-is-gearing-up-for-2024-and-beyond-e0d465794767',
      ],
      repositories: ['https://github.com/coti-io'],
      socialMedia: [
        'https://twitter.com/COTInetwork',
        'https://medium.com/@cotinetwork',
        'https://t.me/COTInetwork',
        'https://discord.gg/9tq6CP6XrT',
      ],
    },
  },
})
