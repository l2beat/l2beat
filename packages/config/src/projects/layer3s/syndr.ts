import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { Layer3 } from '../../types'
import { upcomingL3 } from '../layer2s/templates/upcoming'

export const syndr: Layer3 = upcomingL3({
  id: 'syndr',
  capability: 'universal',
  addedAt: new UnixTime(1720082709), // 2024-07-04T08:45:09Z
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Syndr',
    slug: 'syndr',
    description:
      'Syndr is an upcoming Layer 3 - an institutional-grade, high-performance Options and Futures exchange powered by Arbitrum Orbit.',
    purposes: ['Universal'],
    category: 'Optimium',
    stack: 'Arbitrum',
    links: {
      websites: ['https://syndr.com/'],
      documentation: ['https://docs.syndr.com'],
      repositories: ['https://github.com/0xSyndr'],
      socialMedia: [
        'https://x.com/SyndrHQ',
        'https://medium.com/syndr',
        'https://t.me/syndr_official',
      ],
    },
  },
})
