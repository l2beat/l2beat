import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import type { Layer2 } from './types'

export const palm: Layer2 = upcomingL2({
  id: 'palm',
  createdAt: new UnixTime(1692958606), // 2023-08-25T10:16:46Z
  display: {
    name: 'Palm',
    slug: 'palm',
    description:
      'The Palm network is a sidechain focused on NFTs that will transition from a Proof of Authority network to a ZK Rollup in 2024.',
    purposes: ['NFT'],
    category: 'Validium',
    provider: 'Polygon',
    links: {
      websites: ['https://palm.network/'],
      apps: ['https://app.palm.io/bridge', 'https://uniswap-v3.scroll.io'],
      documentation: ['https://docs.palm.io/'],
      explorers: ['https://explorer.palm.io/'],
      repositories: [],
      socialMedia: ['https://twitter.com/palmnetwork3'],
    },
  },
})
