import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL3 } from '../../templates/upcoming'

export const oursong: ScalingProject = upcomingL3({
  id: 'oursong',
  capability: 'universal',
  addedAt: UnixTime(1720191862), // 2024-07-05T15:04:22Z
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Oursong',
    slug: 'oursong',
    description:
      'Oursong is an upcoming Layer 3 on Arbitrum, built on the Orbit stack. It aims to transform the music industry with an automated copyright management system designed for the AI era, streamlining registration, licensing, and royalty distribution for creators.',
    purposes: ['Music'],
    category: 'Optimium',
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://oursong.com/'],
      socialMedia: ['https://x.com/oursong'],
    },
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
})
