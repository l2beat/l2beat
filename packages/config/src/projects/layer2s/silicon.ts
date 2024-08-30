import { underReviewL2 } from './templates/underReview'
import { Layer2 } from './types'

export const silicon: Layer2 = underReviewL2({
  id: 'silicon',
  display: {
    name: 'Silicon',
    slug: 'silicon',
    description:
      'Silicon is a Validium built on the Polygon CDK Stack, aiming to become the social network of the future.',
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
