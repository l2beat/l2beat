import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const destra: Layer2 = upcomingL2({
  id: 'destra',
  capability: 'universal',
  addedAt: new UnixTime(1738496763), // 2025-02-02T15:23:30Z
  display: {
    name: 'Destra',
    slug: 'destra',
    description:
      'Destra Network pioneers true Decentralized computing solutions for the emerging AI economy.',
    purposes: ['AI'],
    category: 'Optimium',
    stack: 'Arbitrum',
    links: {
      websites: ['https://destra.network/'],
      apps: ['https://ocai.destranetwork.io/'],
      documentation: ['https://destra-network.gitbook.io/documentation'],
      repositories: [],
      socialMedia: [
        'https://x.com/destranetwork',
        'https://medium.com/@destranetwork',
        'https://t.me/DestraNetwork',
      ],
    },
  },
})
