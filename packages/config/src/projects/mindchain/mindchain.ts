import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL3 } from '../../templates/upcoming'

export const mindchain: ScalingProject = upcomingL3({
  id: 'mindchain',
  capability: 'universal',
  addedAt: UnixTime(1738898515), // 2025-02-05T14:15:15Z
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'MindChain',
    slug: 'mindchain',
    description: 'MindChain is an FHE restaking Layer for PoS and AI networks.',
    purposes: ['AI'],
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://mindnetwork.xyz/'],
      documentation: ['https://docs.mindnetwork.xyz/minddocs'],
      repositories: ['https://github.com/mind-network'],
      bridges: ['https://fhebridge.mindnetwork.xyz/connectWallct'],
      socialMedia: [
        'https://twitter.com/mindnetwork_xyz',
        'https://discord.com/invite/UYj94MJdGJ',
        'https://t.me/MindNetwork_xyz',
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
