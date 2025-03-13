import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL3 } from '../../templates/upcoming'

export const hyperagi: ScalingProject = upcomingL3({
  id: 'hyperagi',
  capability: 'universal',
  addedAt: UnixTime(1741704727),
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'HyperAGI',
    slug: 'hyperagi',
    description:
      'HyperAGI is a multi-tiered decentralized platform designed to provide powerful computational support and innovative applications for AI.',
    purposes: ['AI'],
    category: 'Optimium',
    stack: 'Arbitrum',
    links: {
      websites: ['https://hyperagi.network/'],
      documentation: ['https://hyperdust-foundation.gitbook.io/moss-ai-docs'],
      repositories: ['https://github.com/HyperdustLab/HyperdustProtocol'],
      explorers: ['https://explorer.hyperagi.network/'],
      socialMedia: [
        'https://x.com/HyperDustIO',
        'https://linkedin.com/company/hyperdust-protocol',
        'https://t.me/hyperdust_io',
      ],
    },
  },
})
