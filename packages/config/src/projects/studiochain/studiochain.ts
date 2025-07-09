import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const studiochain: ScalingProject = upcomingL2({
  id: 'studiochain',
  addedAt: UnixTime(1744635768), // 2025-04-14T14:42:48Z
  capability: 'universal',
  display: {
    name: 'Studiochain',
    slug: 'studiochain',
    description:
      'Studiochain is a Layer 2 blockchain built with Arbitrum’s Ethereum layer-2 tech, which will play host to My Pet Hooligan.',
    purposes: ['Gaming'],
    category: 'Optimistic Rollup',
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://karratcoin.com/'],
      explorers: ['https://studio-chain.explorer.caldera.xyz'],
      socialMedia: ['https://twitter.com/karratcoin'],
    },
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
})
