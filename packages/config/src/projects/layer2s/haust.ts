import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const haust: Layer2 = upcomingL2({
  id: 'haust',
  createdAt: new UnixTime(1736600180), // 2024-11-12T10:56:20Z
  display: {
    name: 'Haust Network',
    slug: 'haust',
    description:
      'Haust Network is a zkEVM Layer 2 blockchain built on the Polygon CDK, integrating AggLayer, Data Availability and Account Abstraction from the outset.',
    purposes: ['Exchange'],
    category: 'ZK Rollup',
    provider: 'Polygon',
    links: {
      websites: ['https://haust.network/'],
      apps: [],
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
