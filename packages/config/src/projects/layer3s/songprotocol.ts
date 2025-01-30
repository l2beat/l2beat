import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { Layer3 } from '../../types'
import { upcomingL3 } from '../layer2s/templates/upcoming'

export const songprotocol: Layer3 = upcomingL3({
  id: 'songprotocol',
  capability: 'universal',
  addedAt: new UnixTime(1720191862), // 2024-07-05T15:04:22Z
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Song Protocol',
    slug: 'song-protocol',
    description:
      'Song Protocol is an upcoming Layer 3 on Arbitrum, built on the Orbit stack. It is designed to democratize music collaboration and enable innovation for apps utilizing music, all while removing the hassle and expense of copyright issues.',
    purposes: ['Music'],
    category: 'Optimistic Rollup',
    stack: 'Arbitrum',
    links: {
      websites: ['https://songprotocol.org/'],
      socialMedia: ['https://x.com/songprotocol'],
    },
  },
})
