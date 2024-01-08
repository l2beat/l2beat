import { upcoming } from './templates/upcoming'
import { Layer2 } from './types'

export const palm: Layer2 = upcoming({
  id: 'palm',
  display: {
    name: 'Palm',
    slug: 'palm',
    description:
      'The Palm network is a sidechain focused on NFTs that will transition from a Proof of Authority network to a ZK Rollup in 2024.',
    purpose: 'NFTs',
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
