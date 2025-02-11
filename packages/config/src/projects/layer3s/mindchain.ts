import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { Layer3 } from '../../types'
import { upcomingL3 } from '../layer2s/templates/upcoming'

export const mindchain: Layer3 = upcomingL3({
  id: 'mindchain',
  capability: 'universal',
  addedAt: new UnixTime(1738898515), // 2025-02-05T14:15:15Z
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'MindChain',
    slug: 'mindchain',
    description: 'MindChain is an FHE restaking Layer for PoS and AI networks.',
    purposes: ['AI'],
    category: 'Optimium',
    stack: 'Arbitrum',
    links: {
      websites: ['https://mindnetwork.xyz/'],
      documentation: ['https://docs.mindnetwork.xyz/minddocs'],
      repositories: ['https://github.com/mind-network'],
      apps: ['https://fhebridge.mindnetwork.xyz/connectWallct'],
      socialMedia: [
        'https://twitter.com/mindnetwork_xyz',
        'https://discord.com/invite/UYj94MJdGJ',
        'https://t.me/MindNetwork_xyz',
      ],
    },
  },
})
