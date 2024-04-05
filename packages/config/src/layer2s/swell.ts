import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const swell: Layer2 = upcomingL2({
  id: 'swell',
  display: {
    name: 'Swell',
    slug: 'swell',
    description:
      'Swell L2, powered by Polygon CDK,  will leverage EigenDA and the AggLayer in collaboration with AltLayer and Chainlink.',
    purposes: ['Universal', 'Restaking'],
    category: 'Validium',
    provider: 'Polygon',
    links: {
      websites: ['https://swellnetwork.io/'],
      apps: [],
      documentation: ['https://docs.swellnetwork.io/'],
      explorers: [],
      repositories: ['https://github.com/SwellNetwork'],
      socialMedia: ['https://twitter.com/swellnetworkio'],
    },
  },
})
