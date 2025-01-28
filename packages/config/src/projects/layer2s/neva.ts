import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const neva: Layer2 = upcomingL2({
  id: 'neva',
  capability: 'universal',
  addedAt: new UnixTime(1727445360), // 2024-09-27T17:09:00Z
  display: {
    name: 'Neva',
    slug: 'neva',
    description:
      'Neva is an EVM-equivalent ZK-application network that provides scalability through Celestia DA and Polygon zkEVM, transforming GameFi and streamlining DeFi.',
    purposes: ['Universal', 'Gaming'],
    category: 'Validium',
    links: {
      websites: ['https://neva.network/'],
      documentation: ['https://docs.neva.network/'],
      repositories: ['https://github.com/NevaNetwork'],
      socialMedia: ['https://x.com/NevaNetwork', 'https://t.me/NevaPortal'],
    },
  },
})
