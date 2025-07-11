import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const union: ScalingProject = upcomingL2({
  id: 'union',
  capability: 'universal',
  addedAt: UnixTime(1740072951), // 2025-01-20T17:35:51Z
  display: {
    name: 'Union Chain',
    slug: 'union',
    description:
      'Union Chain is a ZK Chain designed to bridge the worlds of Crypto and Traditional Finance (TradFi) by uniting top centralized crypto exchanges (CEXs) and licensed RWA tokenization leaders with top Blockchain technology to build, issue, distribute, and transact on one chain.',
    purposes: ['Universal', 'RWA'],
    category: 'ZK Rollup',
    stacks: ['ZK Stack'],
    links: {
      websites: ['https://unionchain.io/'],
      socialMedia: [
        'https://x.com/unionchain_io',
        'https://linkedin.com/company/unionchain/',
        'https://t.me/union_chain',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('the-elastic-network'),
  },
})
