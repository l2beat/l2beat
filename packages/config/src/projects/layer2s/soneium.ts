import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const soneium: Layer2 = upcomingL2({
  id: 'soneium',
  display: {
    name: 'Soneium',
    slug: 'soneium',
    description:
      'Soneium is an upcoming Optimistic rollup based on the OP Stack. It is built by Sony Block Solutions Labs and planned to stand as a versatile, general-purpose blockchain.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://soneium.org/en/'],
      apps: [],
      documentation: ['https://soneium.org/en/docs/'],
      explorers: [],
      repositories: [],
      socialMedia: ['https://x.com/soneium'],
    },
  },
})
