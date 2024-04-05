import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const x1: Layer2 = upcomingL2({
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
      explorers: ['https://okx1-testnet.l2scan.co/'],
      repositories: [],
      socialMedia: ['https://twitter.com/X1_Network'],
    },
  },
})
