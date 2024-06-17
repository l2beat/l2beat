import { ProjectId } from '@l2beat/shared-pure'

import { underReviewL3 } from '../layer2s/templates/underReview'
import { Layer3 } from './types'

export const l3x: Layer3 = underReviewL3({
  id: 'l3x',
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'L3X',
    slug: 'l3x',
    category: 'Optimium',
    description: 'L3X is a L3 Arbitrum Orbit DeFi-focused project.',
    purposes: ['DeFi'],
    provider: 'Arbitrum',
    links: {
      websites: ['https://l3x.com/'],
      apps: [
        'https://bridge.arbitrum.io/?destinationChain=arbitrum-one&sourceChain=ethereum',
      ],
      documentation: ['https://docs.l3x.com/'],
      explorers: [],
      repositories: [],
      socialMedia: ['https://t.me/l3x_protocol', 'https://x.com/l3x_protocol'],
    },
    activityDataSource: 'Blockchain RPC',
  },
})
