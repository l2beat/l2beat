import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const arcology: Layer2 = upcomingL2({
  id: 'arcology',
  display: {
    name: 'Arcology',
    slug: 'arcology',
    description:
      'Arcology Network is the first and only Ethereum Rollup with parallel transaction execution, offering EVM equivalence and horizontal scaling to process tens of thousands of transactions (complex contract interactions) in full parallel. It is the perfect solution for developers seeking to build high-performance, resource-intensive decentralized applications, unlocking the full potential of the Ethereum network.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    provider: 'Arcology',
    links: {
      websites: ['https://arcology.network/'],
      apps: [],
      documentation: ['https://doc.arcology.network/main'],
      explorers: [],
      repositories: ['https://github.com/arcology-network'],
      socialMedia: [
        'https://twitter.com/ArcologyN',
        'https://chatgpt.com/g/g-lkeB0ZG52-solidity-concurrent-programming-gpt',
      ],
    },
  },
})
