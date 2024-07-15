import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const alephzero: Layer2 = upcomingL2({
  id: 'alephzero',
  display: {
    name: 'Aleph Zero',
    slug: 'aleph-zero',
    description:
      'Aleph Zero is an upcoming Layer 2 on Ethereum, built on the Orbit stack. It aims to enable you to build and use unique privacy apps with speed and a great UX.',
    purposes: ['Privacy'],
    category: 'Optimium',
    provider: 'Arbitrum',
    links: {
      websites: ['https://alephzero.org/'],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: ['https://x.com/Aleph__Zero'],
    },
  },
})
