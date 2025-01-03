import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { upcomingL3 } from '../layer2s/templates/upcoming'
import { Layer3 } from './types'

export const superposition: Layer3 = upcomingL3({
  id: 'superposition',
  createdAt: new UnixTime(1720082709), // 2024-07-04T08:45:09Z
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Superposition',
    slug: 'superposition',
    description:
      'Superposition is an upcoming Layer 3 powered by Arbitrum Orbit. It is the ultimate yield centric blockchain that pays users and developers to use it. Superposition offers novel incentive mechanisms such as Utility Mining and Super Assets and a native onchain order book built using Stylus that provides shared liquidity for the ecosystem.',
    purposes: ['Universal'],
    category: 'Optimium',
    provider: 'Arbitrum',
    links: {
      websites: ['https://superposition.so/'],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: ['https://x.com/Superpositionso'],
    },
  },
})
