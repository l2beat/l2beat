import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const aztecV2: Layer2 = upcomingL2({
  id: 'aztec-v2',
  addedAt: new UnixTime(1700568758), // '2023-11-21T12:12:38Z'
  capability: 'universal',
  display: {
    name: 'Aztec',
    slug: 'aztec',
    description:
      'Aztec is an open source layer 2 network that brings programmable privacy and scalability to Ethereum, powered by Noir, an open-source general programming language.',
    purposes: ['Universal', 'Privacy'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://aztec.network/', 'https://aztec.network/noir'],
      documentation: ['https://docs.aztec.network/'],
      repositories: ['https://github.com/AztecProtocol/aztec-packages'],
      socialMedia: [
        'https://twitter.com/aztecnetwork',
        'https://medium.com/aztec-protocol',
        'https://t.me/aztecprotocol',
      ],
    },
  },
})
