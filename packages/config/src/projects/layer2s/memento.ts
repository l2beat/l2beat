import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import type { Layer2 } from './types'

export const memento: Layer2 = upcomingL2({
  id: 'memento',
  addedAt: new UnixTime(1730879100), // 2024-11-6T07:45:00Z
  display: {
    name: 'Memento ZK Chain',
    slug: 'memento',
    description:
      'Memento ZKchain is a ZK Rollup dedicated to institutional DeFi and digital asset management, providing a secure, permissioned environment for digital investment funds and asset distribution.',
    purposes: ['Interoperability', 'Privacy', 'RWA'],
    category: 'ZK Rollup',
    provider: 'ZK Stack',
    links: {
      websites: ['https://mementoblockchain.com/'],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: [
        'https://x.com/Memento_Bc',
        'https://linkedin.com/company/memento-blockchain/',
      ],
    },
  },
})
