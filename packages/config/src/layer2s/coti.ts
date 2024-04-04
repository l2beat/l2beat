import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const coti: Layer2 = upcomingL2({
  id: 'coti',
  display: {
    name: 'Coti',
    slug: 'coti',
    description:
      'Coti is a privacy-centric Ethereum Layer 2 leveraging multiparty computation and secure enclaves for scalable privacy.',
    purposes: ['Universal', 'Privacy'],
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://coti.io/'],
      apps: [],
      documentation: [
        'https://medium.com/cotinetwork/how-coti-is-gearing-up-for-2024-and-beyond-e0d465794767',
      ],
      explorers: [],
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
