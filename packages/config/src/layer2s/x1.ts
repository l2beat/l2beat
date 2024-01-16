import { upcoming } from './templates/upcoming'
import { Layer2 } from './types'

export const x1: Layer2 = upcoming({
  id: 'x1',
  display: {
    name: 'X1',
    slug: 'x1',
    description:
      'X1 is an upcoming Validium by OKX. It is powered by the Polygon CDK.',
    purposes: ['Universal'],
    category: 'Validium',
    provider: 'Polygon',
    links: {
      websites: ['https://okx.com/x1'],
      apps: [],
      documentation: ['https://okx.com/x1/docs'],
      explorers: [],
      repositories: [],
      socialMedia: ['https://twitter.com/X1_Network'],
    },
  },
})
