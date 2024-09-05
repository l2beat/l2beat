import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const arithmic: Layer2 = upcomingL2({
  id: 'arithmic',
  display: {
    name: 'Arithmic',
    slug: 'arithmic',
    description:
      'Arithmic is an upcoming zero-knowledge Layer-2 powered by universal native (re)staking at a protocol-level.',
    purposes: ['Universal'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://arithmic.com'],
      apps: [],
      documentation: [
        'https://arithmic-labs.gitbook.io/arithmic-documentation/',
      ],
      explorers: [],
      repositories: [],
      socialMedia: ['https://x.com/ArithmicNetwork'],
    },
  },
})
