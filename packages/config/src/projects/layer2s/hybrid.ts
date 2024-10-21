import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const hybrid: Layer2 = upcomingL2({
  id: 'hybrid',
  createdAt: new UnixTime(1720191862), // 2024-07-05T15:04:22Z
  display: {
    name: 'Hybrid',
    slug: 'hybrid',
    description:
      'Hybrid is an upcoming Layer 2 on Ethereum, built on the Orbit stack. It is focused on building consumer AI products like the custom AI Agent infrastructure and Atlas. Transitioned from a Layer 1 blockchain to an Orbit Layer 2.',
    purposes: ['AI'],
    category: 'Optimium',
    provider: 'Arbitrum',
    links: {
      websites: ['https://buildonhybrid.com/'],
      apps: [],
      documentation: ['https://docs.buildonhybrid.com'],
      explorers: [],
      repositories: ['https://github.com/buildonhybrid'],
      socialMedia: [
        'https://x.com/BuildOnHybrid',
        'https://t.me/HybridCommunity',
      ],
    },
  },
})
