import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { upcomingL3 } from '../layer2s/templates/upcoming'
import { Layer3 } from './types'

export const gaea: Layer3 = upcomingL3({
  id: 'gaea',
  createdAt: new UnixTime(1733983236), // 2024-12-12T06:00:36Z
  hostChain: ProjectId('base'),
  display: {
    name: 'GAEA',
    slug: 'gaea',
    description:
      'Gaea is a Layer 3 public blockchain project built on Ethereum, aiming to create a decentralized ecosystem by leveraging unused network resources for AI training and development. Its goal is to provide a platform for AI-driven data sharing and processing.',
    purposes: ['AI'],
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://aigaea.net'],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: [
        'https://discord.com/invite/n5JrYzKGBz',
        'https://x.com/aigaea',
        'https://t.me/AIGAEA_Community',
      ],
    },
  },
})
