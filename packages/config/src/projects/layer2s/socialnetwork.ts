import { Badge } from '../badges'
import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const socialnetwork: Layer2 = upcomingL2({
  id: 'socialnetwork',
  badges: [Badge.VM.EVM, Badge.RaaS.AltLayer, Badge.Stack.Orbit],
  display: {
    name: 'Social Network',
    slug: 'social-network',
    description:
      'Social Network is an upcoming Layer 2 on Ethereum, built on the Orbit stack. It is the first Layer 2 scaling and staking solution for Bitcoin, aiming to reduce transaction fees (<1 SAT/byte), finality (<1 minute), and energy consumption (~99%), of the Bitcoin Network, by connecting it to Ethereum via Arbitrum.',
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
