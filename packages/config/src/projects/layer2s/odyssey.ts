import { underReviewL2 } from './templates/underReview'
import { Layer2 } from './types'

export const odyssey: Layer2 = underReviewL2({
  id: 'odyssey',
  display: {
    name: 'Odyssey',
    slug: 'odyssey',
    description:
      'Ithaca is developing Odyssey, an open-source Layer 2 network, built with Reth, the OP Stack and Conduit.',
    purposes: ['Universal'],
    category: 'Optimium',
    provider: 'OP Stack',
    links: {
      websites: ['https://ithaca.xyz'],
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
