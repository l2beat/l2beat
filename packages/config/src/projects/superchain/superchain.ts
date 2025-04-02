import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const superchain: BaseProject = {
  id: ProjectId('superchain'),
  slug: 'superchain',
  name: 'Superchain',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2024-09-03')),
  ecosystemConfig: {
    accentColor: '#F00',
    ecosystemToken: {
      name: 'OP',
      chain: 'ethereum',
      description:
        'OP is the governance token for the Optimism Collective and the Superchain ecosystem. It is used for voting on protocol upgrades, treasury allocations, and other governance decisions across the Superchain network of OP Stack chains.',
    },
    governanceReviews: true,
  },
}
