import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import type { Layer2 } from './types'

export const socialnetwork: Layer2 = upcomingL2({
  id: 'socialnetwork',
  addedAt: new UnixTime(1720191862), // 2024-07-05T15:04:22Z
  display: {
    name: 'Social Network',
    slug: 'social-network',
    description:
      'Social Network is an upcoming Layer 2 on Ethereum, built on the Orbit stack. It is the first Layer 2 scaling and staking solution for Bitcoin, aiming to reduce transaction fees, finality, and energy consumption of the Bitcoin Network by connecting it to Ethereum via Arbitrum.',
    purposes: ['Bitcoin DApps'],
    category: 'Optimium',
    provider: 'Arbitrum',
    links: {
      websites: ['https://social.network/'],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: ['https://twitter.com/socialnetworkL2'],
    },
  },
})
