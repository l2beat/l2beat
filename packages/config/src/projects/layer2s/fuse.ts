import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const fuse: Layer2 = upcomingL2({
  id: 'fuse',
  capability: 'universal',
  addedAt: new UnixTime(1692958606), // '2023-08-25T10:16:46Z'
  display: {
    name: 'Fuse',
    slug: 'fuse',
    description:
      'Fuse announced a strategic move to integrate with the Ethereum ecosystem as a Polygon CDK L2.',
    purposes: ['Universal'],
    category: 'ZK Rollup',
    stack: 'Polygon',
    links: {
      websites: ['https://fuse.io/'],
      apps: ['https://fuse.io/network'],
      documentation: ['https://docs.fuse.io/fuse-ember/about-fuse-ember-l2/'],
      explorers: ['https://explorer.fuse.io/'],
      repositories: ['https://github.com/fuseio'],
      socialMedia: [
        'https://discord.gg/46QxE5ESzQ',
        'https://x.com/Fuse_network',
        'https://t.me/fuseio',
      ],
    },
  },
})
