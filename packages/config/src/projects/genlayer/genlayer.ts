import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const genlayer: ScalingProject = upcomingL2({
  id: 'genlayer',
  capability: 'universal',
  addedAt: UnixTime(1740073213), // 2025-01-20T17:40:13Z
  display: {
    name: 'GenLayer',
    slug: 'genlayer',
    description:
      'GenLayer is the first AI-native blockchain built for AI-powered smart contracts.',
    purposes: ['Universal', 'AI'],
    category: 'ZK Rollup',
    stacks: ['ZK Stack'],
    links: {
      websites: ['https://genlayer.com/'],
      documentation: ['https://docs.genlayer.com/'],
      explorers: ['https://genlayer-testnet.explorer.caldera.xyz/'],
      socialMedia: ['https://x.com/GenLayer'],
    },
  },
  ecosystemInfo: {
    id: ProjectId('the-elastic-network'),
  },
})
