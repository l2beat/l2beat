import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { upcomingL3 } from '../layer2s/templates/upcoming'
import { Layer3 } from './types'

export const mvchain: Layer3 = upcomingL3({
  id: 'mvchain',
  createdAt: new UnixTime(1720191862), // 2024-07-05T15:04:22Z
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'MV Chain',
    slug: 'mvchain',
    description:
      'MV Chain is an upcoming Layer 3 on Arbitrum, built on the Orbit stack. It is focused on creating a better gaming- and metaverse experience.',
    purposes: ['Gaming'],
    category: 'Optimium',
    provider: 'Arbitrum',
    links: {
      websites: ['https://genso.game/en/'],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: ['https://x.com/genso_meta'],
    },
  },
})
