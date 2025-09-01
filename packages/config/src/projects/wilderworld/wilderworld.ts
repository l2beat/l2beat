import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const wilderworld: ScalingProject = upcomingL2({
  id: 'wilderworld',
  capability: 'universal',
  addedAt: UnixTime(1756724480), // 2025-09-01T12:01:20Z
  display: {
    name: 'Wilder World',
    slug: 'wilderworld',
    description:
      'A modular infrastructure layer transforming millions of idle DePIN devices into communal economies.',
    purposes: ['Universal'],
    stacks: ['Agglayer CDK'],
    links: {
      websites: ['https://wilderworld.com/'],
      documentation: ['https://wiki.wilderworld.com/'],
      socialMedia: ['https://x.com/wilderworld'],
    },
  },
  ecosystemInfo: {
    id: ProjectId('agglayer'),
  },
  proofSystem: {
    type: 'Validity',
  },
})
