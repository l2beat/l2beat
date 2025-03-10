import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { Layer3 } from '../../internalTypes'
import { upcomingL3 } from '../layer2s/templates/upcoming'

export const nums: Layer3 = upcomingL3({
  id: ProjectId('nums'),
  capability: 'universal',
  addedAt: UnixTime(1740706975),
  hostChain: ProjectId('starknet'),
  display: {
    name: 'Nums',
    shortName: 'nums',
    slug: 'nums',
    description:
      "Nums is a sequential game built off of Starknet's technology and is the first layer-3 to settle on the network.",
    purposes: ['Gaming'],
    stack: 'SN Stack',
    category: 'ZK Rollup',
    links: {
      websites: ['https://nums.gg/'],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: ['https://x.com/numsgg'],
    },
  },
})
