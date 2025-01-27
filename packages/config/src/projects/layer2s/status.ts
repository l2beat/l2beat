import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import type { Layer2 } from './types'

export const status: Layer2 = upcomingL2({
  id: 'status',
  capability: 'universal',
  addedAt: new UnixTime(1729678881), // 2024-10-23T12:21:33
  display: {
    name: 'status',
    slug: 'status',
    description:
      'Status is an upcoming social L2 being built on the Linea stack.',
    purposes: ['Social'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://status.app/'],
      apps: ['https://status.app/apps#desktop'],
      documentation: ['https://status.app/specs'],
      explorers: [],
      repositories: ['https://github.com/status-im'],
      socialMedia: ['https://x.com/ethstatus'],
    },
  },
})
