import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const aztecV2: Layer2 = upcomingL2({
  id: 'aztec-v2',
  display: {
    name: 'Aztec',
    slug: 'aztec',
    description:
      'Aztec is an open source layer 2 network that brings programmable privacy and scalability to Ethereum.',
    purposes: ['Universal', 'Privacy'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://aztec.network/'],
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
