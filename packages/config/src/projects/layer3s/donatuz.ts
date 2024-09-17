import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { Badge } from '../badges'
import { underReviewL3 } from '../layer2s/templates/underReview'
import { Layer3 } from './types'

export const donatuz: Layer3 = underReviewL3({
  id: 'donatuz',
  hostChain: ProjectId('base'),
  badges: [
    Badge.L3ParentChain.Base,
    Badge.DA.EigenDA,
    Badge.Stack.OPStack,
    Badge.VM.EVM,
    Badge.RaaS.Conduit,
  ],
  display: {
    name: 'Donatuz',
    slug: 'donatuz',
    category: 'Optimium',
    description:
      'Donatuz is a Layer-3 that aims at providing social media creators with innovative monetization tools to earn money from their content.',
    purposes: ['Social'],
    provider: 'OP Stack',
    links: {
      websites: ['https://donatuz.org/'],
      apps: ['https://bridge.donatuz.com'],
      documentation: [],
      explorers: ['https://explorer.donatuz.com/'],
      repositories: ['https://github.com/Donatuz-Labs'],
      socialMedia: [
        'https://x.com/Donatuz_',
        'https://t.me/donatuzz',
        'https://linkedin.com/company/donatuz/',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  rpcUrl: 'https://rpc.donatuz.com',
  escrows: [
    {
      chain: 'base',
      address: EthereumAddress('0xb765Df9d2925a82678F4B7bc60eF5294c1604514'), // OptimismPortal
      sinceTimestamp: new UnixTime(1719319541),
      tokens: '*',
    },
  ],
})
