import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const arithmic: Layer2 = upcomingL2({
  id: 'arithmic',
  addedAt: new UnixTime(1725550343), // 2024-09-05T15:32:23Z
  capability: 'universal',
  display: {
    name: 'Arithmic',
    slug: 'arithmic',
    description:
      'Arithmic is an upcoming zero-knowledge Layer-2 powered by universal native (re)staking at a protocol-level.',
    purposes: ['Universal'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://arithmic.com'],
      documentation: [
        'https://arithmic-labs.gitbook.io/arithmic-documentation/',
      ],
      socialMedia: ['https://x.com/ArithmicNetwork'],
    },
  },
})
