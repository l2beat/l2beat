import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL3 } from '../../templates/upcoming'

export const onyx: ScalingProject = upcomingL3({
  id: 'onyx',
  capability: 'universal',
  addedAt: UnixTime(1744637831),
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Onyx',
    slug: 'onyx',
    description:
      'Onyx is a modular blockchain designed for financial-grade applications, offering near-instant confirmations and low fees.',
    purposes: ['Universal'],
    category: 'Optimium',
    stack: 'Arbitrum',
    links: {
      websites: ['https://onyx.org/'],
      repositories: ['https://github.com/Onyx-Protocol'],
      documentation: ['https://docs.onyx.org/'],
      explorers: ['https://explorer.onyx.org/'],
      apps: ['https://app.onyx.org/'],
      socialMedia: [
        'https://x.com/OnyxDAO',
        'https://t.me/Onyx',
        'https://blog.onyx.org/',
      ],
    },
  },
})
