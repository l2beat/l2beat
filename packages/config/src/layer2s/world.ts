import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const world: Layer2 = upcomingL2({
  id: 'world',
  display: {
    name: 'World Chain',
    slug: 'world',
    description:
      'World Chain is a new OP Stack L2 that will leverage World ID\'s Proof of Personhood',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://worldcoin.org/world-chain'],
      apps: ['https://worldcoin.org/download-app'],
      documentation: ['https://docs.worldcoin.org/'],
      explorers: [''],
      repositories: ['https://github.com/worldcoin'],
      socialMedia: [
        'https://twitter.com/worldcoin',
        'https://discord.com/invite/worldcoin',
        'https://t.me/worldcoin',
        'https://www.linkedin.com/company/worldcoinproject/',
        'https://www.youtube.com/@worldcoinofficial'
      ],
    },
  },
})
