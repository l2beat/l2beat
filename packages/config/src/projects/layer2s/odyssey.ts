import { UnixTime } from '@l2beat/shared-pure'
import { underReviewL2 } from './templates/underReview'
import { Layer2 } from './types'

export const odyssey: Layer2 = underReviewL2({
  id: 'odyssey',
  createdAt: new UnixTime(1728909101), // 2024-10-14T12:31:41Z
  display: {
    name: 'Odyssey',
    slug: 'odyssey',
    description:
      'Odyssey is a OP Stack rollup aimed at enabling experimentation of bleeding edge Ethereum Research.',
    purposes: ['Universal'],
    category: 'Optimium',
    provider: 'OP Stack',
    links: {
      websites: ['https://ithaca.xyz/updates/odyssey'],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: ['https://github.com/ithacaxyz'],
      socialMedia: [
        'https://x.com/ithacaxyz',
        'https://warpcast.com/~/channel/ithaca',
      ],
    },
  },
})
