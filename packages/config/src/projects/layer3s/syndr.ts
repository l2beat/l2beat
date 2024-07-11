import { ProjectId } from '@l2beat/shared-pure'
import { upcomingL3 } from '../layer2s/templates/upcoming'
import { Layer3 } from './types'

export const syndr: Layer3 = upcomingL3({
  id: 'syndr',
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Syndr',
    slug: 'syndr',
    description:
      'Syndr is an upcoming Layer 3 - an institutional-grade, high-performance Options and Futures exchange powered by Arbitrum Orbit.',
    purposes: ['DeFi'],
    category: 'Optimium',
    provider: 'Arbitrum',
    links: {
      websites: ['https://syndr.com/'],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: ['https://x.com/SyndrHQ'],
    },
  },
})
