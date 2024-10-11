import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const treasure: Layer2 = upcomingL2({
  id: 'treasure',
  createdAt: new UnixTime(1719931843), // 2024-07-02T14:50:43Z
  display: {
    name: 'Treasure Chain',
    slug: 'treasure',
    description:
      'Treasure Chain is an upcoming Layer 2 on Ethereum, built on the Orbit stack. It is a gaming-specific L2, orbited by super-customized Infinity L3 Chains. Around this network of Infinity Chains, the Treasure Platform powers end-to-end gaming and game-builder needs including but not limited to Identity, Marketplace, AMM Payments, Analytics and LiveOps.',
    purposes: ['Gaming'],
    category: 'Optimium',
    provider: 'Arbitrum',
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
