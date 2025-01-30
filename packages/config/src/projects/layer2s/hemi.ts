import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const hemi: Layer2 = upcomingL2({
  id: 'hemi',
  capability: 'universal',
  addedAt: new UnixTime(1727449740), // 2024-09-27T17:09:00Z
  display: {
    name: 'Hemi',
    slug: 'hemi',
    description:
      'Hemi is an OP Stack based L2 on Ethereum focusing on interoperability with the Bitcoin blockchain.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    stack: 'OP Stack',
    links: {
      websites: ['https://hemi.xyz'],
      apps: ['https://app.hemi.xyz'],
      documentation: ['https://docs.hemi.xyz'],
      explorers: ['https://testnet.explorer.hemi.xyz/'],
      repositories: ['https://github.com/hemilabs'],
      socialMedia: [
        'https://twitter.com/hemi_xyz',
        'https://discord.gg/hemixyz',
        'https://linkedin.com/company/hemi-labs',
        'https://youtube.com/@HemiLabs',
      ],
    },
  },
})
