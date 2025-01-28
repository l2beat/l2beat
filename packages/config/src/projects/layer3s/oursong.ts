import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { Layer3 } from '../../types'
import { upcomingL3 } from '../layer2s/templates/upcoming'

export const oursong: Layer3 = upcomingL3({
  id: 'oursong',
  capability: 'universal',
  addedAt: new UnixTime(1720191862), // 2024-07-05T15:04:22Z
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Oursong',
    slug: 'oursong',
    description:
      'Oursong is an upcoming Layer 3 on Arbitrum, built on the Orbit stack. It aims to transform the music industry with an automated copyright management system designed for the AI era, streamlining registration, licensing, and royalty distribution for creators.',
    purposes: ['Music'],
    category: 'Optimium',
    stack: 'Arbitrum',
    links: {
      websites: ['https://oursong.com/'],
      socialMedia: ['https://x.com/oursong'],
    },
  },
})
