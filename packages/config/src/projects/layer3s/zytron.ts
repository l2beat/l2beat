import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { underReviewL3 } from '../layer2s/templates/underReview'
import { Layer3 } from './types'

export const zytron: Layer3 = underReviewL3({
  id: 'zytron',
  createdAt: new UnixTime(1734489204),
  hostChain: ProjectId('linea'),
  display: {
    name: 'zytron',
    slug: 'zytron',
    description:
      'A Highly customizable Layer 3 sovereign roll up stack. Gasless and high speed.',
    purposes: ['Universal', 'Interoperability'],
    category: 'Validium',
    links: {
      websites: ['https://zytron.zypher.network'],
      apps: [],
      documentation: ['https://docs.zypher.network/zytron/chain/overview'],
      explorers: ['https://explorer.zypher.network'],
      repositories: ['https://github.com/zypher-game'],
      socialMedia: [
        'https://x.com/Zypher_Network',
        'https://t.me/zyphernetwork',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
})
