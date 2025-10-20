import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL3 } from '../../templates/upcoming'

export const rivalz: ScalingProject = upcomingL3({
  id: 'rivalz',
  capability: 'universal',
  addedAt: UnixTime(1739605172),
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Rivalz',
    slug: 'rivalz',
    stacks: ['Arbitrum'],
    description:
      'Rivalz is a new chain on Arbitrum Orbit for a new service - ADCS (Agentic data coordination service).',
    purposes: ['AI'],
    links: {
      websites: ['https://rivalz.ai/'],
      bridges: ['https://rivalz.ai/dashboard'],
      documentation: ['https://docs.rivalz.ai/'],
      explorers: ['https://explorer.rivalz.ai/'],
      repositories: ['https://github.com/Rivalz-ai'],
      socialMedia: [
        'https://x.com/Rivalz_AI',
        'https://discord.com/invite/rivalzai',
        'https://t.me/+1yVzpdr6hxphYmQx',
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
