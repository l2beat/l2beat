import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const zeronetwork: Layer2 = upcomingL2({
  id: 'zeronetwork',
  createdAt: new UnixTime(1721214420), // 2024-07-17T11:07:00Z
  display: {
    name: 'Zero Network',
    slug: 'zeronetwork',
    description:
      'Zero Network is an L2 by the Zerion wallet team, utilizing the ZKsync Stack and allowing certain users with Zerion DNA NFTs gasless and prioritized transactions.',
    purposes: ['Universal'],
    category: 'ZK Rollup',
    provider: 'ZK Stack',
    links: {
      websites: ['https://zero.network/'],
      apps: ['https://zerion.io/'],
      documentation: ['https://docs.zero.network/'],
      explorers: ['https://explorer.zero.network/'],
      repositories: [],
      socialMedia: ['https://x.com/zerodotnetwork'],
    },
  },
})
