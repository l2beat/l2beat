import { upcoming } from './templates/upcoming'
import { Layer2 } from './types'

export const orb3: Layer2 = upcoming({
  id: 'orb3',
  display: {
    name: 'ORB3 Protocol',
    slug: 'orb3',
    description: 'SocialFi & GameFi blockchain built for the Gaming Industry.',
    purpose: ['Universal'],
    category: 'Optimium',
    provider: 'Arbitrum',
    links: {
      websites: ['https://orb3.tech'],
      apps: [],
      documentation: ['https://docs.orb3.tech'],
      explorers: [
        'https://orb3scan.tech/',
        'https://orb3-protocol.instatus.com/',
      ],
      repositories: ['https://github.com/orb3-protocol'],
      socialMedia: [
        'https://twitter.com/Orb3Tech',
        'https://discord.com/invite/PmWGn2UmdJ',
        'https://mirror.xyz/orb3.eth',
      ],
    },
  },
})
