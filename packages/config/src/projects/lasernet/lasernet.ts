import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL2 } from '../../templates/underReview'

export const lasernet: ScalingProject = underReviewL2({
  id: 'lasernet',
  capability: 'universal',
  addedAt: UnixTime(1745311928),
  display: {
    name: 'Lasernet',
    slug: 'lasernet',
    description:
      'Lasernet is a new oracle architecture with an ETH layer-2 at its core. Lasernet brings fully on-chain, verifiable, and trustless data through its permissionless and modular design.',
    purposes: ['Universal'],
    category: 'Optimium',
    stack: 'Arbitrum',
    links: {
      websites: ['https://diadata.org/'],
      apps: ['https://diadata.org/app/'],
      documentation: ['https://docs.diadata.org/resources/chain-information'],
      explorers: ['https://explorer.diadata.org/'],
      repositories: ['https://github.com/diadata-org/'],
      socialMedia: [
        'https://twitter.com/DIAdata_org',
        'https://discord.com/invite/RjHBcZ9mEH',
        'https://t.me/diadata_org',
        'https://linkedin.com/company/diadata-org/',
        'https://diadata.org/blog/',
      ],
    },
  },
  chainConfig: {
    name: 'lasernet',
    chainId: 1050,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.diadata.org/',
        callsPerMinute: 1500,
      },
    ],
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
})
