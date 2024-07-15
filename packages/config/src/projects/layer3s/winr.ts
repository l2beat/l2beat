import { ProjectId } from '@l2beat/shared-pure'
import { upcomingL3 } from '../layer2s/templates/upcoming'
import { Layer3 } from './types'

export const winr: Layer3 = upcomingL3({
  id: 'winr',
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'WINR',
    slug: 'winr',
    description:
      'WINR is an upcoming Layer 3 on Arbitrum, built on the Orbit stack. It is focused on building a decentralized iGaming infrastructure.',
    purposes: ['Gaming'],
    category: 'Optimium',
    provider: 'Arbitrum',
    links: {
      websites: ['https://winr.games/'],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: ['https://x.com/WINRProtocol'],
    },
  },
})
