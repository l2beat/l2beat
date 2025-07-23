import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const destra: ScalingProject = upcomingL2({
  id: 'destra',
  capability: 'universal',
  addedAt: UnixTime(1738496763), // 2025-02-02T15:23:30Z
  display: {
    name: 'Destra',
    slug: 'destra',
    description:
      'Destra Network pioneers true Decentralized computing solutions for the emerging AI economy.',
    purposes: ['AI'],
    category: 'Optimium',
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://destra.network/'],
      bridges: ['https://ocai.destranetwork.io/'],
      documentation: ['https://destra-network.gitbook.io/documentation'],
      repositories: [],
      socialMedia: [
        'https://x.com/destranetwork',
        'https://medium.com/@destranetwork',
        'https://t.me/DestraNetwork',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
})
