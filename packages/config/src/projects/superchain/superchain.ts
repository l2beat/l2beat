import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import type { BaseProject } from '../../types'

export const superchain: BaseProject = {
  id: ProjectId('superchain'),
  slug: 'superchain',
  name: 'Superchain',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2024-09-03')),
  display: {
    description: 'The Superchain is a network of OP Stack chains.',
    links: {
      websites: ['https://superchain.eco'],
    },
    badges: [BADGES.Infra.Superchain, BADGES.Stack.OPStack],
  },
  ecosystemConfig: {
    colors: {
      primary: '#F00000',
      secondary: '#F93E3F',
    },
    ecosystemToken: {
      name: 'OP',
      chain: 'ethereum',
      description:
        'OP is the governance token for the Optimism Collective and the Superchain ecosystem. It is used for voting on protocol upgrades, treasury allocations, and other governance decisions across the Superchain network of OP Stack chains.',
    },
    governanceReviews: true,
  },
}
