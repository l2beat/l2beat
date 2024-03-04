import { upcoming } from './templates/upcoming'
import { Layer2 } from './types'

export const zkcandy: Layer2 = upcoming({
  id: 'zkcandy',
  display: {
    name: 'zkCandy',
    slug: 'zkcandy',
    description:
      "zkCandy is an L2 Gaming Hyperchain built on zkSync's ZK stack for the next generation of GameFi - Supercharged by iCandy, the largest game developer in ANZ and SEA.",
    purposes: ['Universal', 'Gaming'],
    category: 'Validium',
    provider: 'ZK Stack',
    links: {
      websites: ['https://zkcandy.io', 'https://icandy.io/'],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: [
        'https://twitter.com/zkCandyHQ',
        'https://discord.gg/zkcandy',
        'https://t.me/zkcandy',
      ],
    },
  },
})
