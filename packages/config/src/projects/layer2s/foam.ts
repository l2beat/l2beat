import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const foam: Layer2 = upcomingL2({
  id: 'foam',
  capability: 'universal',
  addedAt: new UnixTime(1740704677),
  display: {
    name: 'Foam',
    slug: 'foam',
    description:
      'FOAM is a decentralized protocol built on the OP Stack that provides crowdsourced mapping and location services. It enables Ethereum transactions over radio, focusing on Proof of Location functionality.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    stack: 'OP Stack',
    links: {
      websites: ['https://foam.space/'],
      documentation: ['https://f-o-a-m.github.io/foam.developer/'],
      repositories: ['https://github.com/f-o-a-m'],
      apps: ['https://map.foam.space/'],
      explorers: ['https://devnet-l2.foam.space/txs'],
      socialMedia: [
        'https://x.com/foamspace',
        'https://mirror.xyz/foamspace.eth',
        'https://blog.foam.space/',
        'https://warpcast.com/~/channel/foam',
      ],
    },
  },
})
