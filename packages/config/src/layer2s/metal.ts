import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const metal: Layer2 = upcomingL2({
  id: 'metal',
  display: {
    name: 'Metal',
    slug: 'metal',
    description:
      'Metal L2 is an upcoming scaling solution by Metallicus. It is powered by the OP Stack.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://metall2.com/'],
      apps: [],
      documentation: [],
      explorers: ['https://testnet-explorer.metall2.com/'],
      repositories: [],
      socialMedia: ['https://twitter.com/metalpaysme'],
    },
  },
})
