import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import type { Layer2 } from './types'

export const aztecV2: Layer2 = upcomingL2({
  id: 'aztec-v2',
  capability: 'universal',
  createdAt: new UnixTime(1700568758), // '2023-11-21T12:12:38Z'
  display: {
    name: 'Aztec',
    slug: 'aztec',
    description:
      'Aztec is an open source layer 2 network that brings programmable privacy and scalability to Ethereum, powered by Noir, an open-source general programming language.',
    purposes: ['Universal', 'Privacy'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://aztec.network/', 'https://aztec.network/noir'],
      apps: [],
      documentation: ['https://docs.aztec.network/'],
      explorers: [],
      repositories: ['https://github.com/AztecProtocol/aztec-packages'],
      socialMedia: [
        'https://twitter.com/aztecnetwork',
        'https://medium.com/aztec-protocol',
        'https://t.me/aztecprotocol',
      ],
    },
  },
})
