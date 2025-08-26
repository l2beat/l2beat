import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL3 } from '../../templates/upcoming'

export const hyperagi: ScalingProject = upcomingL3({
  id: 'hyperagi',
  capability: 'universal',
  addedAt: UnixTime(1741704727),
  hostChain: ProjectId('arbitrum'),
  hasTestnet: true,
  display: {
    name: 'HyperAGI',
    slug: 'hyperagi',
    description:
      'HyperAGI is a multi-tiered decentralized platform designed to provide powerful computational support and innovative applications for AI.',
    purposes: ['AI'],
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://hyperagi.ai/'],
      bridges: ['https://bridge.hyperagi.ai'],
      documentation: ['https://hyperdust-foundation.gitbook.io/hyperagi-docs'],
      repositories: ['https://github.com/HyperdustLab/HyperdustProtocol'],
      explorers: ['https://explorer.hyperagi.network/'],
      socialMedia: [
        'https://x.com/HyperAGIAI',
        'https://linkedin.com/company/hyperdust-protocol',
        'https://t.me/hyperdust_io',
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
