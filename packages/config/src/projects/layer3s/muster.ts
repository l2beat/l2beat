import { ProjectId } from '@l2beat/shared-pure'

import { underReviewL3 } from '../layer2s/templates/underReview'
import { Layer3 } from './types'

export const muster: Layer3 = underReviewL3({
  id: 'muster',
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Muster',
    slug: 'muster',
    category: 'Optimium',
    description: 'Muster Network is an Arbitrum Orbit gaming chain.',
    purposes: ['Gaming'],
    provider: 'Arbitrum',
    links: {
      websites: ['https://cometh.io/'],
      apps: [
        'https://bridge.arbitrum.io/?destinationChain=muster&sourceChain=arbitrum-one',
      ],
      documentation: ['https://docs.cometh.io/marketplace'],
      explorers: [],
      repositories: ['https://github.com/cometh-hq'],
      socialMedia: ['https://x.com/Cometh', 'https://blog.cometh.io/'],
    },
    activityDataSource: 'Blockchain RPC',
  },
  rpcUrl: 'https://api.muster-marketplace.cometh.io/v1',
})
