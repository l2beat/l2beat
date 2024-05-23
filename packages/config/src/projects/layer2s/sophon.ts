import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const sophon: Layer2 = upcomingL2({
  id: 'sophon',
  display: {
    name: 'Sophon',
    slug: 'sophon',
    description:
        "Sophon is a community-driven and entertainment-focused ecosystem built on top of a modular rollup stack leveraging zkSync's ZK Stack technology.",
    purposes: ['Universal'],
    category: 'Validium',
    provider: 'ZK Stack',
    links: {
      websites: ['https://sophon.xyz/'],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: [
        'https://x.com/sophon',
      ],
    },
  },
})
