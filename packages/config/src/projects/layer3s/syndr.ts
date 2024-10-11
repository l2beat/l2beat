import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { upcomingL3 } from '../layer2s/templates/upcoming'
import { Layer3 } from './types'

export const syndr: Layer3 = upcomingL3({
  id: 'syndr',
  createdAt: new UnixTime(1720082709), // 2024-07-04T08:45:09Z
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
      documentation: ['https://docs.syndr.com'],
      explorers: [],
      repositories: ['https://github.com/0xSyndr'],
      socialMedia: [
        'https://x.com/SyndrHQ',
        'https://medium.com/syndr',
        'https://t.me/syndr_official',
      ],
    },
  },
})
