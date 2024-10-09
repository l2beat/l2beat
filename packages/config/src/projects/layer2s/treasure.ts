import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const treasure: Layer2 = upcomingL2({
  id: 'treasure',
  display: {
    name: 'Treasure Chain',
    slug: 'treasure',
    description:
      'Treasure Chain is an upcoming gaming-specific L2 built on the ZK Stack. The Treasure Platform powers end-to-end gaming and game-builder needs including but not limited to Identity, Marketplace, AMM Payments, Analytics and LiveOps.',
    purposes: ['Gaming'],
    category: 'Validium',
    provider: 'ZK Stack',
    links: {
      websites: ['https://treasure.lol/'],
      apps: ['https://app.treasure.lol'],
      documentation: ['https://docs.treasure.lol'],
      explorers: [],
      repositories: ['https://github.com/TreasureProject'],
      socialMedia: ['https://x.com/Treasure_DAO'],
    },
  },
})
