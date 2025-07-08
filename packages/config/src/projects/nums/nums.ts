import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL3 } from '../../templates/upcoming'

export const nums: ScalingProject = upcomingL3({
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
    stacks: ['SN Stack'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://nums.gg/'],
      bridges: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: ['https://x.com/numsgg'],
    },
  },
})
