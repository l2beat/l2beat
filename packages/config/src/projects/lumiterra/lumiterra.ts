import { ProjectId, UnixTime } from '@l2beat/shared-pure'

import type { ScalingProject } from '../../internalTypes'
import { upcomingL3 } from '../../templates/upcoming'

export const lumiterra: ScalingProject = upcomingL3({
  id: 'lumiterra',
  capability: 'universal',
  addedAt: UnixTime(1728665516),
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Lumiterra',
    slug: 'lumiterra',
    description:
      'Lumiterra is a multiplayer open-world survival crafting game built on L3 Arbitrum Orbit chain.',
    purposes: ['Gaming'],
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://lumiterra.net/'],
      bridges: ['https://bridge.layerlumi.com/?l2ChainId=94168'],
      documentation: [
        'https://docs.lumiterra.net/docs/overview/mainnet-beta/beta-test-arbiturm',
      ],
      socialMedia: [
        'https://x.com/LumiterraGame',
        'https://discord.com/invite/q3P5hjqsuE',
      ],
      explorers: ['https://scan.layerlumi.com'],
      repositories: ['https://github.com/LumiterraCommunity'],
    },
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
  proofSystem: {
    type: 'Optimistic',
  },
})
