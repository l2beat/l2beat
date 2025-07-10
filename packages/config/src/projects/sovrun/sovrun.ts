import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const sovrun: ScalingProject = upcomingL2({
  id: 'sovrun',
  addedAt: UnixTime(1744635768), // 2025-04-14T14:42:48Z
  capability: 'universal',
  display: {
    name: 'Sovrun',
    slug: 'sovrun',
    description:
      'Shaping the future of gaming through AI, Blockchain & Autonomous Worlds.',
    purposes: ['AI', 'Gaming'],
    category: 'Optimistic Rollup',
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://sovrun.org/'],
      explorers: ['https://testnet-l2-explorer-hyperliquid.sovrun.org/'],
      documentation: ['https://docs.sovrun.org/'],
      socialMedia: [
        'https://medium.com/@sovrun',
        'https://discord.com/invite/Sovrun',
        'https://x.com/SovrunOfficial',
        'https://t.me/SovrunAnn',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
})
