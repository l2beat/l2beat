import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL3 } from '../../templates/upcoming'

export const syndr: ScalingProject = upcomingL3({
  id: 'syndr',
  capability: 'universal',
  addedAt: UnixTime(1720082709), // 2024-07-04T08:45:09Z
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Syndr',
    slug: 'syndr',
    description:
      'Syndr is an upcoming Layer 3 - an institutional-grade, high-performance Options and Futures exchange powered by Arbitrum Orbit.',
    purposes: ['Universal'],
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://syndr.com/'],
      explorers: ['https://explorer.syndr.com'],
      documentation: ['https://docs.syndr.com'],
      repositories: ['https://github.com/0xSyndr'],
      socialMedia: [
        'https://x.com/SyndrHQ',
        'https://medium.com/syndr',
        'https://t.me/syndr_official',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
  proofSystem: {
    type: 'Optimistic',
  },
})
