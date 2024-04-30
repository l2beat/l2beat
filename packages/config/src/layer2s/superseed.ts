import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const superseed: Layer2 = upcomingL2({
  id: 'superseed',
  display: {
    name: 'Superseed',
    slug: 'superseed',
    description:
      'Superseed is an Optimistic Rollup utilizing the OP Stack, aiming to provide a CDP lending platform enshrined in the protocol.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://superseed.xyz/'],
      apps: ['https://superseed.xyz/coming-soon'],
      documentation: ['https://docs.superseed.xyz/'],
      explorers: ['https://superseed.xyz/coming-soon'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/SuperseedXYZ',
        'https://discord.com/invite/vjDDB5S4BN',
      ],
    },
  },
})
