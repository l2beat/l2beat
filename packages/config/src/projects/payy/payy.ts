import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const payy: ScalingProject = upcomingL2({
  id: 'payy',
  capability: 'universal',
  addedAt: UnixTime(1718719211), // 2024-06-18T14:00:11Z
  display: {
    name: 'Payy',
    slug: 'payy',
    description:
      'Payy is an app-specific zk-rollup enabling privacy and scalability for payments and DeFi.',
    purposes: ['Payments'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://payy.network/'],
      bridges: ['https://payy.link/download'],
      documentation: ['https://payy.network/docs'],
      explorers: ['https://payy.network/explorer'],
      repositories: ['https://github.com/polybase/payy'],
      socialMedia: ['https://x.com/payy_link'],
    },
  },
})
