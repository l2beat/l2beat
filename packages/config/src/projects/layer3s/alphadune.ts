import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { upcomingL3 } from '../layer2s/templates/upcoming'
import { Layer3 } from './types'

export const alphadune: Layer3 = upcomingL3({
  id: 'alphadune',
  createdAt: new UnixTime(1720191862), // 2024-07-05T15:04:22Z
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'AlphaDune',
    slug: 'alphadune',
    description:
      'AlphaDune is an upcoming Layer 3 on Arbitrum, built on the Orbit stack and using Celestia for DA. It aims to be a meta progression layer for games that unlocks value for gamers and developers alike.',
    purposes: ['Universal', 'Gaming'],
    category: 'Optimium',
    provider: 'Arbitrum',
    links: {
      websites: ['https://alphadune.com/'],
      apps: [],
      documentation: ['https://docs.alphadune.com/'],
      explorers: [],
      repositories: [],
      socialMedia: [
        'https://x.com/alphadune',
        'https://discord.com/invite/N8AnA662Mx',
      ],
    },
  },
})
