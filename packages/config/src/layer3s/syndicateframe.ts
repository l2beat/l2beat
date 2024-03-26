import { ProjectId } from '@l2beat/shared-pure'

import { underReviewL3 } from '../layer2s/templates/underReview'
import { Layer3 } from './types'

export const syndicateframe: Layer3 = underReviewL3({
  id: 'syndicateframe',
  hostChain: ProjectId('base'),
  display: {
    name: 'Syndicate Frame Chain',
    slug: 'syndicateframe',
    category: 'Optimium',
    description:
      'Syndicate Frame Chain is an OP Stack L3 on Base with Celestia underneath unlocking high throughput and extremely low gas costs for Frame developers.',
    purposes: ['Social', 'NFT'],
    provider: 'Arbitrum Orbit',
    links: {
      websites: ['https://syndicate.io/blog/syndicate-frame-chain'],
      apps: [
        'https://bridge-frame.syndicate.io/',
        'https://frame.syndicate.io/',
      ],
      documentation: ['https://docs.syndicate.io/get-started/introduction'],
      explorers: ['https://explorer-frame.syndicate.io/'],
      repositories: [
        'https://github.com/WillPapper/syndicate-farcaster-frame-starter',
      ],
      socialMedia: ['https://warpcast.com/syndicate'],
    },
  },
})
