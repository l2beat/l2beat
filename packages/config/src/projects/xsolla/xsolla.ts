import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const xsolla: ScalingProject = upcomingL2({
  id: 'xsolla',
  capability: 'universal',
  addedAt: UnixTime(1740072617), // 2025-01-20T17:30:17Z
  display: {
    name: 'Xsolla ZK',
    slug: 'xsolla',
    description: 'Xsolla ZK is a Layer 2 gaming platform powered by ZKsync.',
    purposes: ['Gaming'],
    category: 'ZK Rollup',
    stacks: ['ZK Stack'],
    links: {
      websites: ['https://xsolla.com/zk'],
      documentation: ['https://developers.xsolla.com/'],
      socialMedia: ['https://x.com/xsolla'],
    },
  },
  ecosystemInfo: {
    id: ProjectId('the-elastic-network'),
  },
})
