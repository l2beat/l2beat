import { upcoming } from './templates/upcoming'
import { Layer2 } from './types'

export const tradable: Layer2 = upcoming({
  id: 'tradable',
  display: {
    name: 'Tradable',
    slug: 'tradable',
    description:
      "A US-based hyperchain on zkSync helping the world's leading asset managers tokenize assets and discover investment opportunities in DeFi in a secure, compliant way, leveraging zero knowledge proofs.",
    purposes: ['RWA', 'DeFi'],
    category: 'ZK Rollup',
    provider: 'ZK Stack',
    links: {
      websites: ['https://tradable.xyz/'],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: ['https://twitter.com/tradable_xyz'],
    },
  },
})
