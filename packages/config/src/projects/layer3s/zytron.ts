import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { upcomingL3 } from '../layer2s/templates/upcoming'
import { Layer3 } from './types'

export const zytron: Layer3 = upcomingL3({
  id: 'zytron',
  createdAt: new UnixTime(1734343268),
  hostChain: ProjectId('base'),
  display: {
    name: 'zytron',
    slug: 'zytron',
    description:
      'A Highly customizable Layer 3 sovereign roll up stack. Gasless and high speed.',
    purposes: ['AI', 'Gaming'],
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
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
  },
})
