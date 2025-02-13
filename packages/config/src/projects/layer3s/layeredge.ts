import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { Layer3 } from '../../types'
import { upcomingL3 } from '../layer2s/templates/upcoming'

export const layeredge: Layer3 = upcomingL3({
  id: 'layeredge',
  capability: 'universal',
  addedAt: new UnixTime(1739450158), 
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'LayerEdge',
    slug: 'layeredge',
    description:
      'LayerEdge is an innovative verification layer designed to bring enhanced data settlement and verification capabilities to PoS-based chains and rollups.',
    purposes: ['Universal'],
    category: 'Optimium',
    stack: 'Arbitrum',
    links: {
      websites: ['https://layeredge.io/'],
      apps: ['https://dashboard.layeredge.io/'],
      documentation: ['https://docs.layeredge.io/'],
      explorers: ['https://layeredge.io/explorer'],
      repositories: [],
      socialMedia: [
        'https://blog.layeredge.io/',
        'https://t.me/layeredge',
        'https://discord.gg/layeredge',
        'https://x.com/layeredge',
      ],
    },
  },
})
