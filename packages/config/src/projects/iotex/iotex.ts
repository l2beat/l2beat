import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const iotex: ScalingProject = upcomingL2({
  id: 'iotex',
  capability: 'universal',
  addedAt: UnixTime(1756724480), // 2025-09-01T12:01:20Z
  display: {
    name: 'IoTeX',
    slug: 'iotex',
    description:
      'A modular infrastructure layer transforming millions of idle DePIN devices into communal economies.',
    purposes: ['Universal'],
    stacks: ['Agglayer CDK'],
    links: {
      websites: ['https://iotex.io/'],
      documentation: ['https://docs.iotex.io/'],
      repositories: ['https://github.com/iotexproject'],
      socialMedia: ['https://x.com/iotex_io'],
      bridges: ['https://bridge.iotex.io'],
      explorers: ['https://iotexscan.io'],
    },
  },
  ecosystemInfo: {
    id: ProjectId('agglayer'),
  },
  proofSystem: {
    type: 'Validity',
  },
})
