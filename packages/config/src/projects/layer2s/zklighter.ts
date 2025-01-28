import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import type { Layer2 } from './types'

export const zklighter: Layer2 = upcomingL2({
  id: 'zklighter',
  addedAt: new UnixTime(1711551933), // 2024-03-27T15:05:33Z
  display: {
    name: 'zkLighter',
    slug: 'zklighter',
    description:
      'zkLighter is an efficient order book Validium on Ethereum - low cost, low latency, verifiable matching.',
    purposes: ['Universal', 'Exchange'],
    category: 'Validium',
    provider: 'ZK Stack',
    links: {
      websites: ['https://zk.lighter.xyz'],
      apps: [],
      documentation: ['https://zk.lighter.xyz/developers'],
      explorers: [],
      repositories: [],
      socialMedia: ['https://twitter.com/lighter_xyz'],
    },
  },
})
