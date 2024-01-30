import { upcoming } from './templates/upcoming'
import { Layer2 } from './types'

export const morph: Layer2 = upcoming({
  id: 'morph',
  display: {
    name: 'Morph',
    slug: 'morph',
    description:
      'Morph is an EVM compatible rollup. It operates as an optimistic rollup with ZK fault proofs.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://morphl2.io'],
      apps: ['https://bridge-testnet.morphl2.io'],
      documentation: ['https://docs.morphl2.io'],
      explorers: ['https://explorer-testnet.morphl2.io'],
      repositories: ['https://github.com/morph-l2'],
      socialMedia: [
        'https://twitter.com/MorphL2',
        'https://medium.com/@morphlayer2',
        'https://discord.gg/5SmG4yhzVZ',
        'https://facebook.com/profile.php?id=61554448708419',
        'https://youtube.com/channel/UCZW6iBpnbpCzYOrMY-RtDOw',
      ],
    },
  },
})
