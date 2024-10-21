import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const morph: Layer2 = upcomingL2({
  id: 'morph',
  createdAt: new UnixTime(1702295992), // 2023-12-11T11:59:52Z
  display: {
    name: 'Morph',
    slug: 'morph',
    description:
      'Morph is an EVM compatible rollup. It operates as an optimistic rollup with ZK fault proofs.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://morphl2.io'],
      apps: ['https://bridge-holesky.morphl2.io'],
      documentation: ['https://docs.morphl2.io'],
      explorers: ['https://explorer-holesky.morphl2.io'],
      repositories: ['https://github.com/morph-l2'],
      socialMedia: [
        'https://twitter.com/MorphL2',
        'https://t.me/MorphL2official',
        'https://medium.com/@morphlayer2',
        'https://discord.com/invite/L2Morph',
        'https://youtube.com/@morphofficiall2',
      ],
    },
  },
})
