import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const sentient: ScalingProject = upcomingL2({
  id: 'sentient',
  capability: 'universal',
  addedAt: UnixTime(1756724480), // 2025-09-01T12:01:20Z
  display: {
    name: 'Sentient',
    slug: 'sentient',
    description:
      'A decentralized AI protocol built for open-source AGI, integrating with Agglayer to advance community-driven intelligence.',
    purposes: ['Universal'],
    stacks: ['Agglayer CDK'],
    links: {
      websites: ['https://sentient.foundation/'],
      repositories: ['https://github.com/sentient-agi'],
      socialMedia: ['https://x.com/SentientAGI'],
    },
  },
  ecosystemInfo: {
    id: ProjectId('agglayer'),
  },
  proofSystem: {
    type: 'Validity',
  },
})
