import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const capx: ScalingProject = upcomingL2({
  id: 'capx',
  capability: 'universal',
  hasTestnet: true,
  addedAt: UnixTime(1692958606), // '2023-08-25T10:16:46Z'
  display: {
    name: 'Capx',
    slug: 'capx',
    description:
      'Capx is a Layer 2 focused on simplifying and reducing the cost of building AI agents.',
    purposes: ['Universal'],
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://capx.ai/'],
      socialMedia: ['https://discord.com/invite/capx', 'https://x.com/0xCapx'],
      explorers: ['https://capxscan.com'],
      documentation: ['https://docs.capx.ai'],
      repositories: ['https://github.com/capx-ai'],
    },
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
  proofSystem: {
    type: 'Optimistic',
  },
})
