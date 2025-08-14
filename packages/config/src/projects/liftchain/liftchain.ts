import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const liftchain: ScalingProject = upcomingL2({
  id: 'liftchain',
  capability: 'universal',
  addedAt: UnixTime(1715161986), // 2024-05-08T09:53:06Z
  display: {
    name: 'LIFTChain',
    slug: 'liftchain',
    description:
      'LIFTChain is a Layer 2 solution built on the ZK Stack leveraging zkEVM in Validium mode. It serves as a Hyperchain allowing anyone to build gaming apps (gApps) on top of their favourite AAA games.',
    purposes: ['Gaming', 'Universal'],
    stacks: ['ZK Stack'],
    links: {
      websites: ['https://liftdata.ai/'],
      documentation: ['https://docs.liftdata.ai/'],
      repositories: ['https://github.com/PlayFi-Labs'],
      socialMedia: ['https://liftdata.ai'],
    },
  },
  ecosystemInfo: {
    id: ProjectId('the-elastic-network'),
  },
  proofSystem: {
    type: 'Validity',
  },
})
