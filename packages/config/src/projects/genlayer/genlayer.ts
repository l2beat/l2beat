import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const genlayer: ScalingProject = upcomingL2({
  id: 'genlayer',
  capability: 'universal',
  hasTestnet: true,
  addedAt: UnixTime(1740073213), // 2025-01-20T17:40:13Z
  display: {
    name: 'GenLayer',
    slug: 'genlayer',
    description:
      'GenLayer is the first AI-native blockchain built for AI-powered smart contracts.',
    purposes: ['Universal', 'AI'],
    stacks: ['ZK Stack'],
    links: {
      websites: ['https://genlayer.com/'],
      bridges: ['https://genlayer-testnet.bridge.caldera.xyz'],
      repositories: ['https://github.com/genlayerlabs'],
      documentation: ['https://docs.genlayer.com/'],
      explorers: ['https://genlayer-testnet.explorer.caldera.xyz/'],
      socialMedia: [
        'https://x.com/GenLayer',
        'https://discord.com/invite/8Jm4v89VAu',
        'https://t.me/genlayer',
        'https://www.youtube.com/@GenLayer',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('the-elastic-network'),
  },
  proofSystem: {
    type: 'Validity',
  },
})
