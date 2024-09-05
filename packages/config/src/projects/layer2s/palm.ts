import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const palm: Layer2 = upcomingL2({
  id: 'palm',
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


import { Badge } from '../badges'
import { underReviewL2 } from './templates/underReview'
import { Layer2 } from './types'

export const palm: Layer2 = underReviewL2({
  id: 'palm',
  badges: [Badge.Infra.AggLayer],
  display: {
    name: 'Palm Network',
    slug: 'palm',
    description:
      'Palm Network is a Validium built on the Polygon CDK Stack, aiming to become the social network of the future.',
    purposes: ['Universal'],
    category: 'Validium',
    provider: 'Polygon',
    links: {
      websites: ['https://silicon.network/'],
      apps: ['https://bridge.silicon.network/'],
      documentation: ['https://docs.silicon.network/'],
      explorers: ['https://scope.silicon.network'],
      repositories: [],
      socialMedia: ['https://x.com/0xSilicon'],
    },
    activityDataSource: 'Blockchain RPC',
  },
  rpcUrl: 'https://rpc.silicon.network',
  //shared polygon bridge
})
