import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../internalTypes'
import { upcomingL2 } from './templates/upcoming'

export const lachain: Layer2 = upcomingL2({
  id: 'lachain',
  capability: 'universal',
  addedAt: UnixTime(1740072754), // 2025-01-20T17:32:34Z
  display: {
    name: 'LaChain',
    slug: 'lachain',
    description:
      "LaChain, Ripio's blockchain, is designed for the Latin American ecosystem. Scalable, secure, and part of the Elastic Chain by ZKsync.",
    purposes: ['Universal'],
    category: 'ZK Rollup',
    stack: 'ZK Stack',
    links: {
      websites: ['https://lachain.network/'],
      documentation: ['https://lachain.gitbook.io/lachain-docs'],
      explorers: ['https://testexplorer.lachain.network/'],
      socialMedia: ['https://x.com/LaChain_Network'],
    },
  },
})
