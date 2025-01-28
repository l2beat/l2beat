import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const haust: Layer2 = upcomingL2({
  id: 'haust',
  capability: 'universal',
  addedAt: new UnixTime(1736600180), // 2024-11-12T10:56:20Z
  display: {
    name: 'Haust Network',
    slug: 'haust',
    description:
      'Haust Network is a zkEVM Layer 2 blockchain built on the Polygon CDK, integrating with the AggLayer and Account Abstraction from the outset.',
    purposes: ['Exchange'],
    category: 'ZK Rollup',
    stack: 'Polygon',
    links: {
      websites: ['https://haust.network/'],
      documentation: ['https://docs.haust.network/'],
      explorers: ['https://explorer-test.haust.network'],
      repositories: ['https://github.com/Haust-Labs'],
      socialMedia: [
        'https://twitter.com/HaustNetwork',
        'https://t.me/haustnetwork',
        'https://discord.gg/QWGxjTXD8N',
        'https://medium.com/@haustnetwork',
      ],
    },
  },
})
