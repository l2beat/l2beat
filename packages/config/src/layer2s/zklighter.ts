import { upcoming } from './templates/upcoming'
import { Layer2 } from './types'

export const zklighter: Layer2 = upcoming({
  id: 'zklighter',
  display: {
    name: 'zkLighter',
    slug: 'zklighter',
    description:
      'zkLighter is an efficient order book Validium on Ethereum - low cost, low latency, verifiable matching.',
    purposes: ['DeFi'],
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
