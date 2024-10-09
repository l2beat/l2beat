import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const swell: Layer2 = upcomingL2({
  id: 'swell',
  createdAt: new UnixTime(1712341625), // 2024-04-05T18:27:05Z
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
