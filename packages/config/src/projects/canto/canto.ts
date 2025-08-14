import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const canto: ScalingProject = upcomingL2({
  id: 'canto',
  capability: 'universal', // this project should be deleted, because the team is no longer building the L2.
  addedAt: UnixTime(1690815262), // '2023-07-31T14:54:22Z'
  display: {
    name: 'Canto',
    slug: 'canto',
    description:
      "Canto is the L1 which will migrate to an Ethereum L2 scaling solution powered by Polygon's CDK dedicated to Real World Assets.",
    purposes: ['Universal'],
    stacks: ['Agglayer CDK'],
    links: {
      websites: ['https://canto.io'],
      bridges: ['https://app.canto.io/bridge'],
      documentation: ['https://docs.canto.io'],
      explorers: ['https://tuber.build'],
      repositories: ['https://github.com/Canto-Network'],
      socialMedia: [
        'https://twitter.com/CantoPublic',
        'https://discord.gg/canto',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('agglayer'),
  },
  proofSystem: {
    type: 'Validity',
  },
})
