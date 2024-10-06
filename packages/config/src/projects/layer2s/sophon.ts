import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const sophon: Layer2 = upcomingL2({
  id: 'sophon',
  display: {
    name: 'Sophon',
    slug: 'sophon',
    description:
      "Sophon is a community-driven and entertainment-focused ecosystem built on top of a modular rollup stack leveraging ZKsync's ZK Stack technology.",
    purposes: ['Universal'],
    category: 'Validium',
    provider: 'ZK Stack',
    links: {
      websites: ['https://sophon.xyz/'],
      apps: ['https://farm.sophon.xyz/'],
      documentation: ['https://docs.sophon.xyz/'],
      explorers: [],
      repositories: [],
      socialMedia: ['https://x.com/sophon'],
    },
  },
})
