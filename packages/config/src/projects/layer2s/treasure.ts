import { Badge } from '../badges'
import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const treasure: Layer2 = upcomingL2({
  id: 'treasure',
  badges: [Badge.VM.EVM, Badge.RaaS.Caldera],
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
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: ['https://x.com/Treasure_DAO'],
    },
  },
})
