import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL3 } from '../../templates/upcoming'

export const yellowstone: ScalingProject = upcomingL3({
  id: 'yellowstone',
  capability: 'universal',
  addedAt: UnixTime(1745844787),
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Chronicle Yellowstone',
    slug: 'yellowstone',
    description:
      "Chronicle Yellowstone is Lit Protocol's custom EVM rollup which is superseding the Chronicle blockchain, allowing for a more performant and stable backend for Lit's infrastructure.",
    purposes: ['Universal'],
    category: 'Optimium',
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://litprotocol.com/'],
      documentation: ['https://developer.litprotocol.com/'],
      explorers: ['https://yellowstone-explorer.litprotocol.com/'],
      socialMedia: [
        'https://twitter.com/litprotocol',
        'https://t.me/+aa73FAF9Vp82ZjJh',
        'https://discord.com/invite/zBw5hDZve8',
        'https://linkedin.com/company/lit-protocol',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
})
