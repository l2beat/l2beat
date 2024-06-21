import { ProjectId } from '@l2beat/shared-pure'

import { underReviewL3 } from '../layer2s/templates/underReview'
import { Layer3 } from './types'

export const genso: Layer3 = underReviewL3({
  id: 'genso',
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Genso Meta',
    slug: 'genso meta',
    category: 'Optimium',
    description:
      'Genso Meta is migrating from Polygon to Arbitrum Orbit gaming chain',
    purposes: ['Gaming'],
    provider: 'Arbitrum',
    links: {
      websites: ['https://genso.game/en'],
      apps: [
        'https://bridge.arbitrum.io/?destinationChain=arbitrum-one&sourceChain=ethereum',
      ],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: [
        'https://x.com/genso_meta',
        'https://t.me/gensometamain',
        'https://discord.com/invite/gensometaverse',
        'https://line.me/R/ti/p/%40846fieqo',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  rpcUrl: '',
})
