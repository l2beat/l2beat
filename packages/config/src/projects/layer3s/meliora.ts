import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { upcomingL3 } from '../layer2s/templates/upcoming'
import { Layer3 } from './types'

export const meliora: Layer3 = upcomingL3({
  id: 'meliora',
  createdAt: new UnixTime(1720191862), // 2024-07-05T15:04:22Z
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Meliora',
    slug: 'meliora',
    description:
      'Meliora is an upcoming Layer 3 on Arbitrum, built on the Orbit stack. It is focused on the creation of an ecosystem of fixed-income/credit-based applications.',
    purposes: ['DeFi'],
    category: 'Optimium',
    provider: 'Arbitrum',
    links: {
      websites: ['https://meliorachain.io/'],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: ['https://twitter.com/meliorafnd'],
    },
  },
})
