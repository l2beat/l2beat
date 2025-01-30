import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const zklighter: Layer2 = upcomingL2({
  id: 'zklighter',
  capability: 'universal',
  addedAt: new UnixTime(1711551933), // 2024-03-27T15:05:33Z
  display: {
    name: 'zkLighter',
    slug: 'zklighter',
    description:
      'zkLighter is an efficient order book Validium on Ethereum - low cost, low latency, verifiable matching.',
    purposes: ['Universal', 'Exchange'],
    category: 'Validium',
    stack: 'ZK Stack',
    links: {
      websites: ['https://zk.lighter.xyz'],
      documentation: ['https://zk.lighter.xyz/developers'],
      socialMedia: ['https://twitter.com/lighter_xyz'],
    },
  },
})
