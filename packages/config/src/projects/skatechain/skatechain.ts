import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const skatechain: ScalingProject = upcomingL2({
  id: 'skatechain',
  capability: 'universal',
  addedAt: UnixTime(1741609623),
  display: {
    name: 'Skatechain',
    slug: 'skatechain',
    description:
      "Skatechain enables users to interact with applications from any VM while staying on their favorite VM. Its Hub Chain operates as an Ethereum L2, leveraging dual data availability and providing a secure environment for whitelisted applications to interact with Skate's AVS.",
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    stacks: ['OP Stack'],
    links: {
      websites: ['https://skatechain.org/'],
      bridges: ['https://park.skatechain.org/'],
      documentation: ['https://docs.skatechain.org/'],
      explorers: ['https://scan.skatechain.org/'],
      repositories: ['https://github.com/Skate-Org'],
      socialMedia: [
        'https://x.com/skate_chain/',
        'https://t.me/skatechain',
        'https://discord.com/invite/skatechain',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('superchain'),
  },
})
