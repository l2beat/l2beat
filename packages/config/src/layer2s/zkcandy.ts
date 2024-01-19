import { upcoming } from './templates/upcoming'
import { Layer2 } from './types'

export const zkcandy: Layer2 = upcoming({
  id: 'zkcandy',
  display: {
    name: 'zkCandy',
    slug: 'zkcandy',
    description:
      "zkCandy is an L2 Gaming Hyperchain for the next generation of GameFi - Supercharged by iCandy & zkSync ZK Stack. iCandy is the largest game developer in ANZ and SEA, publicly traded on the ASX with a world-class portfolio of award-winning titles enjoyed by millions of gamers on mobile, console, and PC, as well as ambitious projects in Web3 gaming, NFTs, and the metaverse.",
    purposes: ['Universal','Gaming'],
    category: 'ZK Rollup',
    provider: 'ZK Stack',
    links: {
      websites: ['https://zkcandy.io','https://www.icandy.io/'],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: ['https://twitter.com/zkCandyHQ'],
    },
  },
})
