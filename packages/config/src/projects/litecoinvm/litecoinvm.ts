import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const litecoinvm: ScalingProject = upcomingL2({
  id: 'litecoinvm',
  capability: 'universal',
  addedAt: UnixTime(1756724480), // 2025-09-01T12:01:20Z
  display: {
    name: 'LitecoinVM',
    slug: 'litecoinvm',
    description: 'A trustless ZK omnichain built for Litecoin.',
    purposes: ['Universal'],
    stacks: ['Agglayer CDK'],
    links: {
      websites: ['https://litvm.com/'],
      socialMedia: ['https://x.com/LitecoinVM'],
    },
  },
  ecosystemInfo: {
    id: ProjectId('agglayer'),
  },
  proofSystem: {
    type: 'Validity',
  },
})
