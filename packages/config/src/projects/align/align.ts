import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const align: ScalingProject = upcomingL2({
  id: 'align',
  capability: 'universal',
  addedAt: UnixTime(1719931843), // 2024-07-02T14:50:43Z
  display: {
    name: 'Align Network',
    slug: 'align',
    description:
      'Align Network is an upcoming Layer 2 on Ethereum, built on the Orbit stack. It focuses on providing a decentralized identity and verification layer for social interactions.',
    purposes: ['Social'],
    category: 'Optimium',
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://align.network/'],
      documentation: ['https://docs.align.network/docs/getting-started'],
      repositories: ['https://github.com/alignnetwork'],
      socialMedia: [
        'https://x.com/align_network',
        'https://discord.com/invite/KCSkfqW5js',
        'https://warpcast.com/~/channel/align',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
})
